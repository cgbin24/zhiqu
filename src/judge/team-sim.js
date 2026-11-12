/* eslint-disable */
/**
 * 多 Agent 团队编排模拟器 —— Agent 课程「团队搭建与治理」判题引擎 + 团队指挥室大屏内核。
 *
 * 用确定性的"拍"（tick）驱动一个虚拟项目团队：
 *   PM 派工 → 角色按技能接任务 → 工作流（待办→进行中→评审→完成）流转 →
 *   护栏拦截越权 → 阻塞上报 → PM 升级解除 → 全部交付或死锁终结。
 *
 * 设计原则：
 *  - 完全确定性：同一项目配置 + 同一团队配置 → 同一执行轨迹（判题可复现）
 *  - 单一数据源：本文件同时被三处使用 ——
 *      1) 团队指挥室大屏直接 import（vite 编译）
 *      2) 关卡沙箱经 `?raw` 把源码原样内联注入学员代码前（见 team-preamble.ts）
 *      3) verify-levels.mjs 用 fs 读源码拼接（node 无 ?raw，读文本等价）
 *    因此本文件必须是【纯 JavaScript + JSDoc 类型标注】，不允许任何 TS 专有语法
 *  - 真实模式：角色/技能/工具白名单/工作流/护栏/升级策略与真实多 Agent 框架
 *    （LangGraph / AutoGen / 群组式 Harness）的治理概念一一对应，可平移迁移
 *
 * 项目配置（createTeamEngine 的入参，来自关卡 runtime / 大屏场景）：
 *   { name, tasks: [{ id, title, type, deps?, needsEscalation?, misuse?, reviewFails?, blockReason? }] }
 *
 * 团队配置（run 的入参，学员在大屏/关卡里编写）：
 *   { roles: [{ id, name, skills, tools }], guardrails?: { toolWhitelist?, requireReview? },
 *     policy?: { onBlock?: 'escalate'|'retry'|'ignore', maxRetries? } }
 */

/**
 * @typedef {Object} TeamTask
 * @property {string} id
 * @property {string} title
 * @property {string} type 技能标签：必须与某角色的 skill 匹配才有人能接
 * @property {string[]} [deps] 依赖任务 id：全部完成后才可派工
 * @property {boolean} [needsEscalation] 首次执行必阻塞，仅 PM 升级可解除
 * @property {string} [blockReason] 阻塞上报的原因文案
 * @property {{ tool: string }} [misuse] 开工时尝试越权调用的工具（护栏教学）
 * @property {boolean} [reviewFails] 首次评审被打回，返工后通过
 */

/**
 * @typedef {Object} TeamRole
 * @property {string} id
 * @property {string} name
 * @property {string[]} skills 能接的任务类型（task.type）
 * @property {string[]} tools 工具白名单（越权调用会被护栏拦截）
 */

/**
 * @typedef {Object} TeamSetup
 * @property {TeamRole[]} roles
 * @property {{ toolWhitelist?: boolean, requireReview?: boolean }} [guardrails]
 * @property {{ onBlock?: 'escalate'|'retry'|'ignore', maxRetries?: number }} [policy]
 */

/**
 * @typedef {Object} TeamEvent
 * @property {number} tick
 * @property {'assign'|'start'|'submit'|'review-pass'|'review-fail'|'done'|'block'|'retry'|'escalate'|'violation'|'config-error'|'deadlock'|'complete'} kind
 * @property {string} [taskId]
 * @property {string} [roleId]
 * @property {string} text
 * @property {boolean} [intercepted] 仅 violation 事件：true=被护栏拦截，false=穿透
 */

/**
 * @typedef {Object} TeamMessage
 * @property {number} tick
 * @property {string} from
 * @property {string} to
 * @property {string} text
 */

/**
 * @typedef {Object} TeamSummary
 * @property {number} done
 * @property {number} total
 * @property {number} blocked
 * @property {number} intercepted 越权尝试被护栏拦截数
 * @property {number} breaches    越权穿透数（护栏未开启/白名单错误时）
 * @property {number} escalations
 * @property {number} retries
 * @property {number} messages
 * @property {number} ticks
 * @property {number} configErrors
 * @property {boolean} deadlocked
 * @property {boolean} ok 全部交付且无穿透且无死锁
 */

/**
 * 创建团队编排引擎
 * @param {{ name?: string, tasks: TeamTask[] }} project
 */
export function createTeamEngine(project) {
  var tasks = (project.tasks || []).map(function (t) {
    return {
      id: t.id,
      title: t.title || t.id,
      type: t.type || 'dev',
      deps: t.deps || [],
      needsEscalation: !!t.needsEscalation,
      blockReason: t.blockReason || '前置条件未就绪',
      misuse: t.misuse || null,
      reviewFails: !!t.reviewFails,
    };
  });

  return {
    project: project,

    /**
     * 用一套团队配置跑一遍项目（确定性）
     * @param {TeamSetup} setup
     */
    run: function (setup) {
      var roles = (setup && setup.roles) || [];
      var guardrails = (setup && setup.guardrails) || {};
      var policy = (setup && setup.policy) || {};
      var toolWhitelist = guardrails.toolWhitelist !== false; // 默认开启
      var requireReview = guardrails.requireReview !== false; // 默认开启
      var onBlock = policy.onBlock || 'escalate';
      var maxRetries = typeof policy.maxRetries === 'number' ? policy.maxRetries : 2;

      /** @type {TeamEvent[]} */
      var events = [];
      /** @type {TeamMessage[]} */
      var messages = [];
      var tick = 0;
      var configErrors = 0;

      // 运行时状态
      var state = {};            // id -> 'todo'|'in_progress'|'review'|'blocked'|'done'
      var assignee = {};         // id -> roleId | null
      var cleared = {};          // id -> 升级解除后 true
      var misuseFired = {};      // id -> true
      var reviewFailed = {};     // id -> true（返工后不再打回）
      var retryCount = {};       // id -> n
      var reworkTick = {};       // id -> 被评审打回的拍（返工需耗时，次拍才能再提交）
      var pendingEscalation = {};// id -> true
      var roleBusy = {};         // roleId -> taskId | null

      tasks.forEach(function (t) {
        state[t.id] = 'todo';
        assignee[t.id] = null;
        cleared[t.id] = false;
        misuseFired[t.id] = false;
        reviewFailed[t.id] = false;
        retryCount[t.id] = 0;
        reworkTick[t.id] = -1;
        pendingEscalation[t.id] = false;
      });
      roles.forEach(function (r) { roleBusy[r.id] = null; });

      var reviewer = null;
      for (var i = 0; i < roles.length; i++) {
        if (roles[i].skills.indexOf('review') !== -1) { reviewer = roles[i]; break; }
      }
      var planner = null;
      for (var j = 0; j < roles.length; j++) {
        if (roles[j].skills.indexOf('plan') !== -1) { planner = roles[j]; break; }
      }
      if (requireReview && !reviewer) {
        tick++;
        events.push({ tick: tick, kind: 'config-error', text: '团队缺少 review 技能的评审角色 —— 评审闸门自动放行（工作流裸奔）' });
        configErrors++;
      }

      var roleName = function (roleId) {
        for (var k = 0; k < roles.length; k++) if (roles[k].id === roleId) return roles[k].name;
        return roleId || '-';
      };
      var pushMsg = function (from, to, text) {
        messages.push({ tick: tick, from: from, to: to, text: text });
      };
      var depsDone = function (t) {
        for (var d = 0; d < t.deps.length; d++) {
          if (state[t.deps[d]] !== 'done') return false;
        }
        return true;
      };
      var roleDone = function (roleId) {
        if (roleId) roleBusy[roleId] = null;
      };
      var allDone = function () {
        for (var k = 0; k < tasks.length; k++) if (state[tasks[k].id] !== 'done') return false;
        return true;
      };
      var sender = function () { return planner ? planner.id : 'pm'; };

      var MAX_TICKS = 300;
      var deadlocked = false;

      while (tick < MAX_TICKS) {
        tick++;
        var progressed = false;

        /* ---- 1. 升级处理：PM 解除阻塞 ---- */
        for (var e = 0; e < tasks.length; e++) {
          var et = tasks[e];
          if (!pendingEscalation[et.id]) continue;
          progressed = true;
          pendingEscalation[et.id] = false;
          cleared[et.id] = true;
          state[et.id] = 'todo';
          assignee[et.id] = null;
          if (planner) {
            events.push({ tick: tick, kind: 'escalate', taskId: et.id, roleId: planner.id, text: '⇡ ' + planner.name + ' 升级处理：解除 ' + et.id + ' 阻塞（' + et.blockReason + '）' });
            pushMsg(planner.id, 'team', '已解除 ' + et.id + ' 阻塞：' + et.blockReason + '，重新派工');
          } else {
            events.push({ tick: tick, kind: 'config-error', text: '阻塞升级无人受理（团队缺少 plan 技能的角色）—— 系统自动放行 ' + et.id });
            configErrors++;
          }
        }

        /* ---- 2. 派工：空闲角色按配置顺序接就绪任务（项目定义序） ---- */
        for (var r = 0; r < roles.length; r++) {
          var role = roles[r];
          if (roleBusy[role.id]) continue;
          for (var a = 0; a < tasks.length; a++) {
            var t = tasks[a];
            if (state[t.id] !== 'todo' || assignee[t.id]) continue;
            if (!depsDone(t)) continue;
            if (role.skills.indexOf(t.type) === -1) continue;
            assignee[t.id] = role.id;
            roleBusy[role.id] = t.id;
            state[t.id] = 'in_progress';
            events.push({ tick: tick, kind: 'assign', taskId: t.id, roleId: role.id, text: '👉 ' + t.id + ' ' + t.title + ' 分派 → ' + role.name });
            events.push({ tick: tick, kind: 'start', taskId: t.id, roleId: role.id, text: '▶ ' + t.id + ' 开工 → ' + role.name });
            pushMsg(sender(), role.id, '请接手 ' + t.id + ' ' + t.title + '（类型 ' + t.type + '）');
            progressed = true;
            // 越权尝试：开工瞬间发生
            if (t.misuse && !misuseFired[t.id]) {
              misuseFired[t.id] = true;
              var authorized = role.tools.indexOf(t.misuse.tool) !== -1;
              if (toolWhitelist && !authorized) {
                events.push({ tick: tick, kind: 'violation', taskId: t.id, roleId: role.id, text: '⚠ ' + role.name + ' 尝试调用未授权工具 [' + t.misuse.tool + '] —— 已拦截', intercepted: true });
                pushMsg('guardrail', sender(), '护栏拦截：' + role.name + ' 的越权工具调用 [' + t.misuse.tool + '] 已被阻止');
              } else if (!authorized) {
                events.push({ tick: tick, kind: 'violation', taskId: t.id, roleId: role.id, text: '🚨 ' + role.name + ' 越权调用工具 [' + t.misuse.tool + '] —— 护栏未开启，穿透成功', intercepted: false });
              }
              // authorized：工具在白名单内，不算违规
            }
            break; // 该角色本拍只接一个
          }
        }

        /* ---- 3. 评审流转 ---- */
        for (var v = 0; v < tasks.length; v++) {
          var vt = tasks[v];
          if (state[vt.id] !== 'review') continue;
          progressed = true;
          if (requireReview && reviewer && vt.reviewFails && !reviewFailed[vt.id]) {
            reviewFailed[vt.id] = true;
            events.push({ tick: tick, kind: 'review-fail', taskId: vt.id, roleId: reviewer.id, text: '✗ ' + vt.id + ' 评审打回（' + reviewer.name + '）→ 返工' });
            pushMsg(reviewer.id, assignee[vt.id] || 'team', vt.id + ' 未通过评审，请返工');
            state[vt.id] = 'in_progress';
            reworkTick[vt.id] = tick;
          } else {
            if (requireReview && reviewer) {
              events.push({ tick: tick, kind: 'review-pass', taskId: vt.id, roleId: reviewer.id, text: '✓ ' + vt.id + ' 评审通过（' + reviewer.name + '）' });
              pushMsg(reviewer.id, sender(), vt.id + ' 评审通过，请验收');
            }
            state[vt.id] = 'done';
            events.push({ tick: tick, kind: 'done', taskId: vt.id, roleId: assignee[vt.id] || undefined, text: '✔ ' + vt.id + ' ' + vt.title + ' 完成' });
            roleDone(assignee[vt.id]);
            assignee[vt.id] = null;
          }
        }

        /* ---- 4. 执行中的任务：提交评审 / 完成 / 阻塞 ---- */
        for (var w = 0; w < tasks.length; w++) {
          var wt = tasks[w];
          if (state[wt.id] !== 'in_progress') continue;
          if (reworkTick[wt.id] === tick) { progressed = true; continue; } // 返工占用本拍，次拍再提交
          progressed = true;
          if (wt.needsEscalation && !cleared[wt.id]) {
            var who = assignee[wt.id];
            state[wt.id] = 'blocked';
            events.push({ tick: tick, kind: 'block', taskId: wt.id, roleId: who || undefined, text: '⏸ ' + wt.id + ' 阻塞（' + wt.blockReason + '）→ ' + roleName(who) + ' 上报' });
            pushMsg(who || 'team', sender(), wt.id + ' 阻塞：' + wt.blockReason + '，请升级处理');
            roleBusy[who] = null;
            if (onBlock === 'escalate') {
              pendingEscalation[wt.id] = true;
            } else if (onBlock === 'retry') {
              if (retryCount[wt.id] < maxRetries) {
                retryCount[wt.id]++;
                state[wt.id] = 'todo';
                assignee[wt.id] = null;
                events.push({ tick: tick, kind: 'retry', taskId: wt.id, text: '↻ ' + wt.id + ' 重新入队重试（第 ' + retryCount[wt.id] + '/' + maxRetries + ' 次）' });
              } else {
                events.push({ tick: tick, kind: 'retry', taskId: wt.id, text: '↻ ' + wt.id + ' 重试已耗尽（' + maxRetries + ' 次）→ 转入升级' });
                pendingEscalation[wt.id] = true;
              }
            }
            // 'ignore'：保持 blocked 无人处理（死锁教学）
            continue;
          }
          if (requireReview && reviewer) {
            state[wt.id] = 'review';
            events.push({ tick: tick, kind: 'submit', taskId: wt.id, roleId: assignee[wt.id] || undefined, text: '📤 ' + wt.id + ' 提交评审' });
            pushMsg(assignee[wt.id] || 'team', reviewer.id, wt.id + ' 已完成开发，请评审');
          } else {
            state[wt.id] = 'done';
            events.push({ tick: tick, kind: 'done', taskId: wt.id, roleId: assignee[wt.id] || undefined, text: '✔ ' + wt.id + ' ' + wt.title + ' 完成' });
            roleDone(assignee[wt.id]);
            assignee[wt.id] = null;
          }
        }

        /* ---- 5. 终止判定 ---- */
        if (allDone()) {
          events.push({ tick: tick, kind: 'complete', text: '🏁 项目「' + (project.name || '未命名') + '」全部交付（' + tick + ' 拍）' });
          break;
        }
        if (!progressed) {
          deadlocked = true;
          var stuck = tasks.filter(function (x) { return state[x.id] !== 'done'; }).map(function (x) { return x.id; });
          events.push({ tick: tick, kind: 'deadlock', text: '✖ 流程死锁：' + stuck.join(', ') + ' 无法继续（检查依赖/技能覆盖/升级策略）' });
          break;
        }
      }

      var doneCount = tasks.filter(function (x) { return state[x.id] === 'done'; }).length;
      var blockedCount = tasks.filter(function (x) { return state[x.id] === 'blocked'; }).length;
      var intercepted = events.filter(function (e2) { return e2.kind === 'violation' && e2.intercepted; }).length;
      var breaches = events.filter(function (e2) { return e2.kind === 'violation' && !e2.intercepted; }).length;
      var escalations = events.filter(function (e2) { return e2.kind === 'escalate'; }).length;
      var retries = events.filter(function (e2) { return e2.kind === 'retry'; }).length;

      /** @type {TeamSummary} */
      var summary = {
        done: doneCount,
        total: tasks.length,
        blocked: blockedCount,
        intercepted: intercepted,
        breaches: breaches,
        escalations: escalations,
        retries: retries,
        messages: messages.length,
        ticks: tick,
        configErrors: configErrors,
        deadlocked: deadlocked,
        ok: doneCount === tasks.length && !deadlocked && breaches === 0,
      };

      var colText = function (st) {
        var ids = tasks.filter(function (t) { return state[t.id] === st; }).map(function (t) {
          return t.id + (assignee[t.id] ? '(' + assignee[t.id] + ')' : '');
        });
        return ids.length > 0 ? ids.join(' ') : '-';
      };

      return {
        events: events,
        messages: messages,
        ticks: tick,
        summary: summary,
        ok: summary.ok,
        /** 看板文本（五行：待办/进行中/评审/阻塞/已完成） */
        boardText: function () {
          return [
            '待办: ' + colText('todo'),
            '进行中: ' + colText('in_progress'),
            '评审: ' + colText('review'),
            '阻塞: ' + colText('blocked'),
            '已完成: ' + colText('done'),
          ].join('\n');
        },
        /** 单行战报 */
        summaryText: function () {
          return '完成 ' + summary.done + '/' + summary.total +
            ' · 阻塞 ' + summary.blocked +
            ' · 拦截 ' + summary.intercepted +
            ' · 穿透 ' + summary.breaches +
            ' · 升级 ' + summary.escalations +
            ' · 重试 ' + summary.retries +
            ' · 消息 ' + summary.messages +
            ' · 用时 ' + summary.ticks + ' 拍';
        },
        /** 事件流水 */
        logText: function () {
          return events.map(function (e2) { return '[拍' + e2.tick + '] ' + e2.text; }).join('\n');
        },
        /** 协作消息流水 */
        messagesText: function () {
          return messages.map(function (m) { return '[拍' + m.tick + '] ' + m.from + ' → ' + m.to + '：' + m.text; }).join('\n');
        },
      };
    },
  };
}
