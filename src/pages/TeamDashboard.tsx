import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Maximize2, Minimize2, Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { createTeamEngine, type TeamEvent, type TeamMessage, type TeamSetup } from '@/judge/team-sim';
import { TEAM_SCENARIOS } from '@/data/agentdev/team-scenarios';

/**
 * 团队指挥室 —— Agent 团队全屏可视化大屏。
 *
 * 内核与「Agent 团队搭建与治理」关卡同一引擎（src/judge/team-sim.js，单一数据源）：
 * 选择项目场景 → 配置管理策略（护栏 / 升级策略）→ 运行引擎 → 逐拍回放执行轨迹。
 * 回放是纯派生：deriveAt(events, cursor) 从事件流水推出角色状态 / 看板 / 消息流，
 * 播放/单步/拖动时间轴都只是移动游标，无任何额外执行成本。
 */

/* ---------------- 回放派生 ---------------- */

interface TaskView { state: string; assignee: string | null }
interface Derived {
  tasks: Record<string, TaskView>;
  roleBusy: Record<string, string | null>;
  messages: TeamMessage[];
  intercepted: number;
  breaches: number;
  escalations: number;
  current: TeamEvent | null;
  finished: boolean;
  deadlocked: boolean;
}

function deriveAt(events: TeamEvent[], messages: TeamMessage[], upto: number): Derived {
  const tasks: Record<string, TaskView> = {};
  const roleBusy: Record<string, string | null> = {};
  let intercepted = 0;
  let breaches = 0;
  let escalations = 0;
  const shown: TeamEvent[] = events.slice(0, upto);
  for (const e of shown) {
    if (e.taskId && !tasks[e.taskId]) tasks[e.taskId] = { state: 'todo', assignee: null };
    switch (e.kind) {
      case 'assign':
      case 'start':
        if (e.taskId) { tasks[e.taskId] = { state: 'in_progress', assignee: e.roleId ?? null }; }
        if (e.roleId) roleBusy[e.roleId] = e.taskId ?? null;
        break;
      case 'submit':
        if (e.taskId) tasks[e.taskId] = { state: 'review', assignee: tasks[e.taskId]?.assignee ?? e.roleId ?? null };
        break;
      case 'review-fail':
        if (e.taskId) tasks[e.taskId] = { state: 'in_progress', assignee: tasks[e.taskId]?.assignee ?? null };
        break;
      case 'done':
        if (e.taskId) tasks[e.taskId] = { state: 'done', assignee: null };
        if (e.roleId) roleBusy[e.roleId] = null;
        break;
      case 'block':
        if (e.taskId) tasks[e.taskId] = { state: 'blocked', assignee: e.roleId ?? null };
        if (e.roleId) roleBusy[e.roleId] = null;
        break;
      case 'retry':
        if (e.taskId) tasks[e.taskId] = { state: 'todo', assignee: null };
        break;
      case 'escalate':
        escalations++;
        if (e.taskId) tasks[e.taskId] = { state: 'todo', assignee: null };
        break;
      case 'violation':
        if (e.intercepted) intercepted++; else breaches++;
        break;
      case 'deadlock':
        return {
          tasks, roleBusy,
          messages: messages.filter((m) => m.tick <= (e.tick ?? 0)),
          intercepted, breaches, escalations,
          current: e, finished: true, deadlocked: true,
        };
      case 'complete':
        return {
          tasks, roleBusy,
          messages: messages.filter((m) => m.tick <= (e.tick ?? 0)),
          intercepted, breaches, escalations,
          current: e, finished: true, deadlocked: false,
        };
      default:
        break;
    }
  }
  const last = shown[shown.length - 1] ?? null;
  return {
    tasks,
    roleBusy,
    messages: messages.filter((m) => m.tick <= (last?.tick ?? 0)),
    intercepted, breaches, escalations,
    current: last,
    finished: false,
    deadlocked: false,
  };
}

/* ---------------- 视觉常量 ---------------- */

const STATE_COLUMN = ['todo', 'in_progress', 'review', 'blocked', 'done'] as const;
const COLUMN_LABEL: Record<string, string> = { todo: '待办', in_progress: '进行中', review: '评审', blocked: '阻塞', done: '已完成' };
const COLUMN_GLOW: Record<string, string> = {
  todo: 'border-night-600/70',
  in_progress: 'border-sky-500/40 shadow-[0_0_18px_rgba(56,189,248,0.12)]',
  review: 'border-cyan-400/40 shadow-[0_0_18px_rgba(34,211,238,0.12)]',
  blocked: 'border-orange-500/50 shadow-[0_0_18px_rgba(249,115,22,0.15)]',
  done: 'border-emerald-500/40 shadow-[0_0_18px_rgba(16,185,129,0.12)]',
};

const KIND_STYLE: Record<string, { icon: string; cls: string }> = {
  assign: { icon: '👉', cls: 'text-sky-300 border-sky-500/30 bg-sky-500/5' },
  start: { icon: '▶', cls: 'text-sky-200 border-sky-500/30 bg-sky-500/5' },
  submit: { icon: '📤', cls: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/5' },
  'review-pass': { icon: '✓', cls: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/5' },
  'review-fail': { icon: '✗', cls: 'text-amber-300 border-amber-500/30 bg-amber-500/5' },
  done: { icon: '✔', cls: 'text-emerald-200 border-emerald-500/40 bg-emerald-500/10' },
  block: { icon: '⏸', cls: 'text-orange-300 border-orange-500/40 bg-orange-500/10' },
  retry: { icon: '↻', cls: 'text-yellow-300 border-yellow-500/30 bg-yellow-500/5' },
  escalate: { icon: '⇡', cls: 'text-fuchsia-300 border-fuchsia-500/40 bg-fuchsia-500/10' },
  violation: { icon: '⚠', cls: 'text-red-300 border-red-500/40 bg-red-500/10' },
  'config-error': { icon: '🔧', cls: 'text-slate-300 border-slate-500/30 bg-slate-500/5' },
  deadlock: { icon: '☠', cls: 'text-red-200 border-red-500/60 bg-red-500/15' },
  complete: { icon: '🏁', cls: 'text-emerald-200 border-emerald-400/60 bg-emerald-500/15' },
};

const ROLE_HUE = ['#7c5cf0', '#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#22d3ee', '#a3e635', '#fb923c'];

/* ---------------- 页面 ---------------- */

export function TeamDashboard() {
  const [scenarioId, setScenarioId] = useState(TEAM_SCENARIOS[0].id);
  const scenario = TEAM_SCENARIOS.find((s) => s.id === scenarioId) ?? TEAM_SCENARIOS[0];

  // 管理策略（运行前可改，改后需重新运行）
  const [onBlock, setOnBlock] = useState<'escalate' | 'retry' | 'ignore'>('escalate');
  const [maxRetries, setMaxRetries] = useState(2);
  const [toolWhitelist, setToolWhitelist] = useState(true);
  const [requireReview, setRequireReview] = useState(true);
  const [stale, setStale] = useState(false);

  // 运行结果与回放游标
  const [run, setRun] = useState<{ events: TeamEvent[]; messages: TeamMessage[]; summary: { done: number; total: number; blocked: number; ticks: number; messages: number } } | null>(null);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  const setup: TeamSetup = useMemo(() => ({
    ...scenario.defaultSetup,
    guardrails: { toolWhitelist, requireReview },
    policy: { onBlock, maxRetries },
  }), [scenario, toolWhitelist, requireReview, onBlock, maxRetries]);

  const doRun = () => {
    const engine = createTeamEngine(scenario.project);
    const r = engine.run(setup);
    setRun(r);
    setCursor(0);
    setPlaying(true);
    setStale(false);
  };

  const resetAll = () => {
    setRun(null);
    setCursor(0);
    setPlaying(false);
    setStale(false);
  };

  // 回放节拍：速度可调，播完自动停
  useEffect(() => {
    if (!playing || !run) return;
    if (cursor >= run.events.length) { setPlaying(false); return; }
    const t = setTimeout(() => setCursor((c) => Math.min(c + 1, run.events.length)), Math.max(120, 820 / speed));
    return () => clearTimeout(t);
  }, [playing, cursor, speed, run]);

  // 全屏状态同步
  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shellRef.current?.requestFullscreen();
    } catch { /* 用户拒绝或环境不支持：忽略 */ }
  };

  const markStale = () => { setStale(true); };

  const derived = run ? deriveAt(run.events, run.messages, cursor) : null;
  const progressPct = run ? Math.round((cursor / Math.max(run.events.length, 1)) * 100) : 0;

  /* 运行统计（以当前游标为准的实时数字） */
  const stats = useMemo(() => {
    if (!derived || !run) return null;
    const counts: Record<string, number> = { todo: 0, in_progress: 0, review: 0, blocked: 0, done: 0 };
    for (const t of scenario.project.tasks) {
      const st = derived.tasks[t.id]?.state ?? 'todo';
      counts[st] = (counts[st] ?? 0) + 1;
    }
    return counts;
  }, [derived, run, scenario]);

  const roleOf = (id: string | null | undefined) => scenario.defaultSetup.roles.find((r) => r.id === id);

  return (
    <div
      ref={shellRef}
      className={`relative flex flex-col gap-3 rounded-2xl border border-quest-500/25 bg-night-950 p-4 text-slate-200 shadow-[0_0_40px_rgba(124,92,240,0.12)] ${fullscreen ? 'h-screen overflow-y-auto' : ''}`}
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,92,240,0.14), transparent), repeating-linear-gradient(0deg, rgba(148,163,184,0.045) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, rgba(148,163,184,0.045) 0 1px, transparent 1px 28px)',
      }}
    >
      {/* 顶栏 */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to="/"
          className="flex items-center gap-1 rounded-lg border border-night-700 bg-night-900 px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:text-slate-200"
        >
          <ChevronLeft size={14} /> 返回
        </Link>
        <h1 className="text-lg font-black tracking-wider text-quest-300 drop-shadow-[0_0_10px_rgba(124,92,240,0.6)]">
          🛰 AGENT 团队指挥中心
        </h1>
        <span className="rounded-md border border-quest-500/30 bg-quest-500/10 px-2 py-0.5 text-[10px] font-bold text-quest-300">
          与「Agent 团队搭建与治理」关卡同一引擎
        </span>
        <div className="flex-1" />
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1 rounded-lg border border-night-600 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-quest-500/50 hover:text-quest-300"
          title={fullscreen ? '退出全屏' : '全屏大屏模式'}
        >
          {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />} {fullscreen ? '退出全屏' : '全屏'}
        </button>
      </div>

      {/* 场景选择 + 管理策略 */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-night-700 bg-night-900/80 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">项目场景</span>
        {TEAM_SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => { setScenarioId(s.id); resetAll(); }}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
              s.id === scenarioId ? 'border-quest-500/60 bg-quest-500/15 text-quest-300' : 'border-night-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {s.name}
          </button>
        ))}
        <div className="mx-1 h-5 w-px bg-night-700" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">管理策略</span>
        <button
          onClick={() => { setToolWhitelist(!toolWhitelist); markStale(); }}
          className={`rounded-lg border px-2 py-1 text-xs font-semibold transition-all ${
            toolWhitelist ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-red-500/50 bg-red-500/10 text-red-300'
          }`}
          title="工具白名单护栏：开启后越权工具调用被当场拦截"
        >
          {toolWhitelist ? '🛡 工具护栏 开' : '⚠ 工具护栏 关'}
        </button>
        <button
          onClick={() => { setRequireReview(!requireReview); markStale(); }}
          className={`rounded-lg border px-2 py-1 text-xs font-semibold transition-all ${
            requireReview ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-red-500/50 bg-red-500/10 text-red-300'
          }`}
          title="评审闸门：开启后所有任务必须过评审才能交付"
        >
          {requireReview ? '✓ 评审闸门 开' : '✗ 评审闸门 关'}
        </button>
        <span className="text-[10px] text-slate-500">阻塞策略</span>
        {(['escalate', 'retry', 'ignore'] as const).map((p) => (
          <button
            key={p}
            onClick={() => { setOnBlock(p); markStale(); }}
            className={`rounded-lg border px-2 py-1 text-xs font-semibold transition-all ${
              onBlock === p ? 'border-quest-500/60 bg-quest-500/15 text-quest-300' : 'border-night-700 text-slate-400 hover:text-slate-200'
            }`}
            title={p === 'escalate' ? '阻塞直报 PM 解除（有出口）' : p === 'retry' ? '先重试，耗尽后升级（仍有出口）' : '无人处理 —— 将死锁（反面教材）'}
          >
            {p === 'escalate' ? '⇡ 升级' : p === 'retry' ? '↻ 重试' : '☠ 忽略'}
          </button>
        ))}
        {onBlock === 'retry' && (
          <>
            <span className="text-[10px] text-slate-500">重试上限</span>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => { setMaxRetries(n); markStale(); }}
                className={`rounded-md px-1.5 py-1 font-mono text-[11px] font-bold transition-colors ${
                  maxRetries === n ? 'bg-quest-500/20 text-quest-300' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {n}次
              </button>
            ))}
          </>
        )}
        <div className="flex-1" />
        {stale && <span className="text-[10px] font-semibold text-amber-300">策略已修改，请重新运行</span>}
        <button
          onClick={run ? resetAll : doRun}
          className="rounded-lg border border-night-600 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:text-slate-100"
        >
          <RotateCcw size={12} className="mr-1 inline" />重置
        </button>
        <button
          onClick={doRun}
          className="rounded-lg bg-gradient-to-r from-quest-500 to-fuchsia-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-quest-500/25 transition-all hover:brightness-110"
        >
          ▶ 运行团队
        </button>
      </div>

      {!run ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-night-700 text-center">
          <div className="text-4xl">🛰</div>
          <p className="text-sm text-slate-400">
            选择项目场景 → 调整管理策略 → 点「运行团队」，观察 {scenario.project.tasks.length} 项任务如何被一支 Agent 团队有序交付
          </p>
          <p className="max-w-md text-xs leading-relaxed text-slate-600">{scenario.desc}</p>
        </div>
      ) : (
        <>
          {/* 统计条 */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {[
              { label: '完成', value: `${stats?.done ?? 0}/${scenario.project.tasks.length}`, cls: 'text-emerald-300 border-emerald-500/30' },
              { label: '进行中', value: stats?.in_progress ?? 0, cls: 'text-sky-300 border-sky-500/30' },
              { label: '阻塞', value: stats?.blocked ?? 0, cls: 'text-orange-300 border-orange-500/30' },
              { label: '拦截', value: derived?.intercepted ?? 0, cls: 'text-amber-300 border-amber-500/30' },
              { label: '升级', value: derived?.escalations ?? 0, cls: 'text-fuchsia-300 border-fuchsia-500/30' },
              { label: '拍数', value: `${derived?.current?.tick ?? 0}/${run.summary.ticks}`, cls: 'text-quest-300 border-quest-500/30' },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border bg-night-900/80 px-3 py-2 text-center ${s.cls}`}>
                <div className="font-mono text-xl font-black leading-tight">{s.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* 主区：角色 / 看板 / 消息流 */}
          <div className="grid flex-1 gap-3 lg:grid-cols-12">
            {/* 左：团队角色 */}
            <div className="rounded-xl border border-night-700 bg-night-900/80 p-3 lg:col-span-3">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">👥 团队角色</div>
              <div className="space-y-2">
                {scenario.defaultSetup.roles.map((r, i) => {
                  const busyTask = derived?.roleBusy[r.id] ?? null;
                  const busyTaskState = busyTask ? derived?.tasks[busyTask]?.state : null;
                  const working = busyTaskState === 'in_progress';
                  const waiting = busyTaskState === 'review';
                  const hue = ROLE_HUE[i % ROLE_HUE.length];
                  return (
                    <div
                      key={r.id}
                      className="flex items-center gap-2 rounded-lg border bg-night-850 px-2.5 py-2"
                      style={{ borderColor: working ? hue + '66' : 'rgba(75,85,99,0.4)', boxShadow: working ? `0 0 14px ${hue}33` : undefined }}
                    >
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 font-bold ${working ? 'animate-pulse' : ''}`}
                        style={{ borderColor: hue, color: hue, background: hue + '14' }}
                      >
                        {r.name.slice(0, 1)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-bold text-slate-200">{r.name}</div>
                        <div className="truncate text-[10px] text-slate-500">
                          {busyTask
                            ? waiting ? `待评审 · ${busyTask}` : `执行中 · ${busyTask}`
                            : '空闲待命'}
                        </div>
                      </div>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold ${working ? 'bg-sky-500/15 text-sky-300' : waiting ? 'bg-cyan-500/15 text-cyan-300' : 'bg-night-800 text-slate-500'}`}>
                        {working ? '工作' : waiting ? '评审' : '空闲'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 space-y-1 border-t border-night-700 pt-2 text-[10px] leading-relaxed text-slate-600">
                <p>技能 = 能接的任务类型；tools = 工具白名单。</p>
                <p>越权调用会在开工瞬间被护栏拦截。</p>
              </div>
            </div>

            {/* 中：任务流转看板 */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:col-span-6">
              {STATE_COLUMN.map((col) => (
                <div key={col} className={`flex flex-col rounded-xl border bg-night-900/80 p-2 ${COLUMN_GLOW[col]}`}>
                  <div className="mb-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {COLUMN_LABEL[col]}
                  </div>
                  <div className="flex min-h-[120px] flex-col gap-1.5">
                    {scenario.project.tasks.filter((t) => (derived?.tasks[t.id]?.state ?? 'todo') === col).map((t) => {
                      const asg = derived?.tasks[t.id]?.assignee;
                      return (
                        <div
                          key={t.id}
                          className={`rounded-lg border px-2 py-1.5 ${
                            col === 'blocked'
                              ? 'border-orange-500/50 bg-orange-500/10 animate-pulse'
                              : col === 'done'
                                ? 'border-emerald-500/30 bg-emerald-500/5'
                                : 'border-night-600 bg-night-850'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-quest-300">{t.id}</span>
                            {asg && (
                              <span className="rounded bg-night-800 px-1 text-[9px] font-semibold text-slate-400">
                                {roleOf(asg)?.name ?? asg}
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 text-[11px] leading-tight text-slate-300">{t.title}</div>
                          {t.deps && t.deps.length > 0 && col !== 'done' && (
                            <div className="mt-0.5 text-[9px] text-slate-600">依赖 {t.deps.join('+')}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* 右：协作消息流 */}
            <div className="rounded-xl border border-night-700 bg-night-900/80 p-3 lg:col-span-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">✉ 协作消息流</span>
                <span className="font-mono text-[10px] text-slate-600">{derived?.messages.length ?? 0} 条</span>
              </div>
              <div className="flex max-h-[380px] flex-col gap-1.5 overflow-y-auto lg:max-h-[460px]">
                {(derived?.messages ?? []).slice(-40).reverse().map((m, i) => (
                  <div key={i} className="rounded-lg border border-night-700 bg-night-850 px-2 py-1.5">
                    <div className="flex items-center gap-1 text-[9px] font-bold">
                      <span className="text-quest-300">{roleOf(m.from)?.name ?? m.from}</span>
                      <span className="text-slate-600">→</span>
                      <span className="text-sky-300">{roleOf(m.to)?.name ?? m.to}</span>
                      <span className="ml-auto font-mono text-slate-600">拍{m.tick}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] leading-tight text-slate-400">{m.text}</div>
                  </div>
                ))}
                {(derived?.messages.length ?? 0) === 0 && (
                  <div className="py-6 text-center text-xs italic text-slate-600">尚无消息 —— 点运行开始协作</div>
                )}
              </div>
            </div>
          </div>

          {/* 终局横幅 */}
          {derived?.finished && (
            <div className={`rounded-xl border px-4 py-2.5 text-center text-sm font-bold ${
              derived.deadlocked
                ? 'border-red-500/60 bg-red-500/15 text-red-300 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
                : 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
            }`}>
              {derived.deadlocked
                ? '☠ 流程死锁 —— 阻塞没有出口。切换阻塞策略为「升级」或「重试」后重新运行。'
                : '🏁 项目全部交付 —— 护栏拦截 ' + (derived.intercepted ?? 0) + ' 次越权，升级 ' + (derived.escalations ?? 0) + ' 次，流程有条不紊。'}
            </div>
          )}

          {/* 时间轴 + 播放控制 */}
          <div className="rounded-xl border border-night-700 bg-night-900/80 p-3">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">🎬 执行时间轴</span>
              <button
                onClick={() => setPlaying((p) => !p)}
                disabled={Boolean(derived?.finished)}
                className="flex items-center gap-1 rounded-lg border border-quest-500/40 bg-quest-500/10 px-2.5 py-1 text-xs font-bold text-quest-300 transition-colors hover:bg-quest-500/20 disabled:opacity-40"
              >
                {playing ? <Pause size={12} /> : <Play size={12} />} {playing ? '暂停' : '播放'}
              </button>
              <button
                onClick={() => { setPlaying(false); setCursor((c) => Math.min(c + 1, run.events.length)); }}
                disabled={Boolean(derived?.finished)}
                className="flex items-center gap-1 rounded-lg border border-night-600 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:text-slate-100 disabled:opacity-40"
              >
                <StepForward size={12} /> 单步
              </button>
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`rounded-md px-1.5 py-1 font-mono text-[11px] font-bold transition-colors ${
                    speed === s ? 'bg-quest-500/20 text-quest-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s}×
                </button>
              ))}
              <div className="flex-1" />
              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-night-800">
                <div className="h-full rounded-full bg-gradient-to-r from-quest-500 to-fuchsia-400 transition-all" style={{ width: progressPct + '%' }} />
              </div>
              <span className="font-mono text-[10px] text-slate-500">{cursor}/{run.events.length}</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {run.events.map((e, i) => {
                const st = KIND_STYLE[e.kind] ?? KIND_STYLE.assign;
                const active = i < cursor;
                return (
                  <button
                    key={i}
                    onClick={() => { setPlaying(false); setCursor(i + 1); }}
                    title={e.text}
                    className={`shrink-0 rounded-md border px-1.5 py-1 font-mono text-[10px] transition-all ${
                      active ? st.cls : 'border-night-700 bg-night-850 text-slate-600'
                    } ${i === cursor - 1 ? 'scale-110 ring-1 ring-quest-400/60' : ''}`}
                  >
                    {st.icon}
                    <span className="ml-0.5">{e.tick}</span>
                  </button>
                );
              })}
            </div>
            {derived?.current && (
              <div className={`mt-2 rounded-lg border px-3 py-2 text-xs ${KIND_STYLE[derived.current.kind]?.cls ?? 'border-night-700 bg-night-850 text-slate-300'}`}>
                <span className="mr-2 font-mono text-[10px] font-bold text-slate-500">拍 {derived.current.tick}</span>
                {derived.current.text}
              </div>
            )}
          </div>

          {/* 配套关卡入口 */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>想自己搭一支这样的团队？配套关卡：</span>
            {[
              ['agentdev-best-5', '组建团队'],
              ['agentdev-best-6', '依赖并行'],
              ['agentdev-best-7', '评审闸门'],
              ['agentdev-best-8', '工具护栏'],
              ['agentdev-best-9', '防卡死策略'],
              ['agentdev-integration-5', '毕业演练'],
            ].map(([id, label]) => (
              <Link key={id} to={`/level/${id}`} className="rounded-md border border-night-700 px-2 py-0.5 text-quest-300/80 transition-colors hover:border-quest-500/40 hover:text-quest-300">
                {label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
