import type { Level } from '@/types';

/**
 * Agent 课程 ·「Agent 团队搭建与治理」追加章
 *
 * 多 Agent 群组协作的真实治理：角色技能矩阵、依赖并行、评审闸门、
 * 工具白名单护栏、阻塞升级与死锁预防 —— 由 src/judge/team-sim.ts
 * 确定性团队引擎真实执行，关卡内可跑通真实项目流水线。
 * 团队指挥室大屏（#/team）用同一引擎做全屏可视化推演。
 */
export const AGENTDEV_TEAM: Level[] = [
  {
    id: 'agentdev-best-5',
    lang: 'agentdev',
    module: 'best',
    order: 5,
    title: '组建项目团队：角色与技能矩阵',
    difficulty: 3,
    xp: 25,
    goals: [
      '理解团队型多 Agent 的组织方式：角色 = 技能 + 工具白名单',
      '学会用技能矩阵反查任务类型：每种任务都必须有人能接',
      '能定义一套完整角色并跑通整个项目流水线',
    ],
    brief: `## 从单打独斗到项目团队

多 Agent 群组工具（团队/Harness）的核心不是"更多 Agent"，而是**组织**：每个角色只声明两件事 —— **会什么（skills）** 和 **能用什么（tools）**。任务按类型派工：类型落在谁的技能矩阵里，谁就能接。这就像建筑工地：钢筋工不会去开塔吊，每个人都持证上岗（工具白名单），工种表（技能矩阵）覆盖所有工序，工程才不会停摆。

若某类任务没人会做，流程会**死锁** —— 所以组队第一步永远是拿任务清单反查技能矩阵，确保"每种活都有人接"。

> 💡 最小权限原则从组队开始：tools 只给必需的工具，宁可后续加，不要一开始就全开。`,
    task: `## 任务：为「官网改版 v2」组建完整团队

项目已注入（\`team\` 引擎），含 5 个任务：T1 需求文档(plan) → T2 视觉设计(design) → T3 前端开发(frontend)、T4 后端接口(backend) → T5 联调测试(test)。

1. 定义 \`roles\` 数组，用 6 个角色覆盖全部任务类型：项目经理(plan)、设计师(design)、前端(frontend)、后端(backend)、测试(test)、评审专家(review)，每个角色给 1-2 个工具白名单项；
2. 调用 \`team.run({ roles })\` 执行项目；
3. 输出两行战报：先 \`run.summaryText()\`，再 \`run.boardText()\`。

**输出**：两行战报 + 五行看板（团队配置正确时全部交付）`,
    starter: `// team 已注入：项目「官网改版 v2」共 5 个任务（类型 plan/design/frontend/backend/test）。
// 组队公式：任务类型 ⊆ 全体角色的技能并集，否则流程死锁。

// TODO 1: 定义 roles 数组 —— 6 个角色覆盖全部类型（提示：还需一个 review 技能角色把守评审闸门）
// TODO 2: team.run({ roles }) 拿到 run
// TODO 3: 依次输出 run.summaryText() 与 run.boardText()

`,
    solution: `const roles = [
  { id: 'pm',  name: '项目经理', skills: ['plan'],     tools: ['board'] },
  { id: 'de',  name: '设计师',   skills: ['design'],   tools: ['figma'] },
  { id: 'fe',  name: '前端工程', skills: ['frontend'], tools: ['code'] },
  { id: 'be',  name: '后端工程', skills: ['backend'],  tools: ['code'] },
  { id: 'qa',  name: '测试工程', skills: ['test'],     tools: ['test'] },
  { id: 'rev', name: '评审专家', skills: ['review'],   tools: ['review'] },
];
const run = team.run({ roles });
console.log(run.summaryText());
console.log(run.boardText());
`,
    algo: {
      starters: {
        javascript: `// team 已注入：项目「官网改版 v2」共 5 个任务（类型 plan/design/frontend/backend/test）。
// 组队公式：任务类型 ⊆ 全体角色的技能并集，否则流程死锁。

// TODO 1: 定义 roles 数组 —— 6 个角色覆盖全部类型（提示：还需一个 review 技能角色把守评审闸门）
// TODO 2: team.run({ roles }) 拿到 run
// TODO 3: 依次输出 run.summaryText() 与 run.boardText()

`,
      },
      solutions: {
        javascript: `const roles = [
  { id: 'pm',  name: '项目经理', skills: ['plan'],     tools: ['board'] },
  { id: 'de',  name: '设计师',   skills: ['design'],   tools: ['figma'] },
  { id: 'fe',  name: '前端工程', skills: ['frontend'], tools: ['code'] },
  { id: 'be',  name: '后端工程', skills: ['backend'],  tools: ['code'] },
  { id: 'qa',  name: '测试工程', skills: ['test'],     tools: ['test'] },
  { id: 'rev', name: '评审专家', skills: ['review'],   tools: ['review'] },
];
const run = team.run({ roles });
console.log(run.summaryText());
console.log(run.boardText());
`,
      },
    },
    hints: [
      '技能矩阵检查：plan / design / frontend / backend / test 五种类型都要有角色接；评审闸门还需要一个 skills 含 review 的角色。',
      '每个角色三件套：id、name、skills、tools —— tools 是白名单，给工作必需的最小集合即可。',
      '输出顺序：先 console.log(run.summaryText()) 再 console.log(run.boardText())，各一行。',
    ],
    tests: [
      { name: '样例：完整团队', stdin: '', expected: "完成 5/5 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 0 · 重试 0 · 消息 15 · 用时 8 拍\n待办: -\n进行中: -\n评审: -\n阻塞: -\n已完成: T1 T2 T3 T4 T5" },
      { name: '检查：技能覆盖', stdin: '', expected: "完成 5/5 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 0 · 重试 0 · 消息 15 · 用时 8 拍\n待办: -\n进行中: -\n评审: -\n阻塞: -\n已完成: T1 T2 T3 T4 T5" },
      { name: '检查：全部交付', stdin: '', expected: "完成 5/5 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 0 · 重试 0 · 消息 15 · 用时 8 拍\n待办: -\n进行中: -\n评审: -\n阻塞: -\n已完成: T1 T2 T3 T4 T5" },
      { name: '隐藏：逐字符比对', stdin: '', expected: "完成 5/5 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 0 · 重试 0 · 消息 15 · 用时 8 拍\n待办: -\n进行中: -\n评审: -\n阻塞: -\n已完成: T1 T2 T3 T4 T5", hidden: true },
    ],
    runtime: JSON.stringify({
      kind: 'team',
      name: '官网改版 v2',
      tasks: [
        { id: 'T1', title: '撰写需求文档', type: 'plan' },
        { id: 'T2', title: '首页视觉设计', type: 'design', deps: ['T1'] },
        { id: 'T3', title: '前端页面开发', type: 'frontend', deps: ['T2'] },
        { id: 'T4', title: '后端接口开发', type: 'backend', deps: ['T1'] },
        { id: 'T5', title: '接口联调测试', type: 'test', deps: ['T3', 'T4'] },
      ],
    }),
  },
  {
    id: 'agentdev-best-6',
    lang: 'agentdev',
    module: 'best',
    order: 6,
    title: '依赖与并行：让没有依赖的活同时开工',
    difficulty: 3,
    xp: 25,
    goals: [
      '理解任务依赖（deps）如何决定开工顺序',
      '学会按负载配置同类角色的数量：依赖拆开后并行推进',
      '能从执行流水里读出并行证据（同一拍两条开工）',
    ],
    brief: `## 依赖是串行的，人力是并行的

任务依赖（deps）画出一张 DAG：**前置没完成，后继不开工** —— 这是流程不乱的根基。但依赖只约束"谁先谁后"，不约束"能有多快"：当两个互不依赖的任务在等待，**一个角色只能干一件**，加一个同技能角色，两条流水同拍并进。

类比：厨房里切菜和熬汤互不依赖，一个厨师只能先切完再熬，配两个厨师就能同时开火。并行不是魔法，是**人力冗余**换时间 —— 代价是协调成本，所以只在依赖解耦的地方加人。

> 💡 验证并行的证据在流水里：同一拍出现两条「开工」记录，才是真并行。`,
    task: `## 任务：把数据管线的串行改成并行

项目「数据管线搭建」：T1 埋点梳理(plan) → T2 采集管道(backend)、T3 清洗脚本(backend)（互不依赖）→ T4 调度上线(ops) → T5 质量报告(test)。

1. 定义角色：项目经理(plan)、**两名后端**(backend)、运维(ops)、测试(test)、评审(review)；
2. \`team.run({ roles })\` 后输出执行流水 \`run.logText()\`，再输出 \`run.summaryText()\`；
3. 观察流水：T2 与 T3 应在**同一拍**分派给两名后端（并行证据）。

**输出**：执行流水 + 单行战报（两名后端并行时总用时最短）`,
    starter: `// team 已注入：项目「数据管线搭建」，T2 与 T3 同为 backend 且互不依赖。
// 一个后端 = 串行；两个后端 = 同拍并行。

// TODO 1: 定义 roles —— 注意 backend 类任务有两件，需要两名后端角色才能并行
// TODO 2: team.run({ roles }) 后输出 run.logText()（流水里找并行证据）
// TODO 3: 再输出 run.summaryText()

`,
    solution: `const roles = [
  { id: 'pm',   name: '项目经理', skills: ['plan'],     tools: ['board'] },
  { id: 'be1',  name: '后端甲',   skills: ['backend'],  tools: ['code'] },
  { id: 'be2',  name: '后端乙',   skills: ['backend'],  tools: ['code'] },
  { id: 'op',   name: '运维',     skills: ['ops'],      tools: ['deploy'] },
  { id: 'qa',   name: '测试工程', skills: ['test'],     tools: ['test'] },
  { id: 'rev',  name: '评审专家', skills: ['review'],   tools: ['review'] },
];
const run = team.run({ roles });
console.log(run.logText());
console.log(run.summaryText());
`,
    algo: {
      starters: {
        javascript: `// team 已注入：项目「数据管线搭建」，T2 与 T3 同为 backend 且互不依赖。
// 一个后端 = 串行；两个后端 = 同拍并行。

// TODO 1: 定义 roles —— 注意 backend 类任务有两件，需要两名后端角色才能并行
// TODO 2: team.run({ roles }) 后输出 run.logText()（流水里找并行证据）
// TODO 3: 再输出 run.summaryText()

`,
      },
      solutions: {
        javascript: `const roles = [
  { id: 'pm',   name: '项目经理', skills: ['plan'],     tools: ['board'] },
  { id: 'be1',  name: '后端甲',   skills: ['backend'],  tools: ['code'] },
  { id: 'be2',  name: '后端乙',   skills: ['backend'],  tools: ['code'] },
  { id: 'op',   name: '运维',     skills: ['ops'],      tools: ['deploy'] },
  { id: 'qa',   name: '测试工程', skills: ['test'],     tools: ['test'] },
  { id: 'rev',  name: '评审专家', skills: ['review'],   tools: ['review'] },
];
const run = team.run({ roles });
console.log(run.logText());
console.log(run.summaryText());
`,
      },
    },
    hints: [
      'deps 是引擎强制的：T4 依赖 T2、T3，两者都完成前 T4 不会被派工 —— 你不需要写任何调度代码。',
      '并行只需要"两个 skills 含 backend 的角色"，其余配置不变；看流水里 T2/T3 是否同一拍开工。',
      '输出顺序：先 logText() 再 summaryText()。',
    ],
    tests: [
      { name: '样例：并行执行', stdin: '', expected: "[拍1] 👉 T1 埋点梳理 分派 → 项目经理\n[拍1] ▶ T1 开工 → 项目经理\n[拍1] 📤 T1 提交评审\n[拍2] ✓ T1 评审通过（评审专家）\n[拍2] ✔ T1 埋点梳理 完成\n[拍3] 👉 T2 采集管道开发 分派 → 后端甲\n[拍3] ▶ T2 开工 → 后端甲\n[拍3] 👉 T3 清洗脚本开发 分派 → 后端乙\n[拍3] ▶ T3 开工 → 后端乙\n[拍3] 📤 T2 提交评审\n[拍3] 📤 T3 提交评审\n[拍4] ✓ T2 评审通过（评审专家）\n[拍4] ✔ T2 采集管道开发 完成\n[拍4] ✓ T3 评审通过（评审专家）\n[拍4] ✔ T3 清洗脚本开发 完成\n[拍5] 👉 T4 调度上线 分派 → 运维\n[拍5] ▶ T4 开工 → 运维\n[拍5] 📤 T4 提交评审\n[拍6] ✓ T4 评审通过（评审专家）\n[拍6] ✔ T4 调度上线 完成\n[拍7] 👉 T5 数据质量报告 分派 → 测试工程\n[拍7] ▶ T5 开工 → 测试工程\n[拍7] 📤 T5 提交评审\n[拍8] ✓ T5 评审通过（评审专家）\n[拍8] ✔ T5 数据质量报告 完成\n[拍8] 🏁 项目「数据管线搭建」全部交付（8 拍）\n完成 5/5 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 0 · 重试 0 · 消息 15 · 用时 8 拍" },
      { name: '检查：依赖顺序', stdin: '', expected: "[拍1] 👉 T1 埋点梳理 分派 → 项目经理\n[拍1] ▶ T1 开工 → 项目经理\n[拍1] 📤 T1 提交评审\n[拍2] ✓ T1 评审通过（评审专家）\n[拍2] ✔ T1 埋点梳理 完成\n[拍3] 👉 T2 采集管道开发 分派 → 后端甲\n[拍3] ▶ T2 开工 → 后端甲\n[拍3] 👉 T3 清洗脚本开发 分派 → 后端乙\n[拍3] ▶ T3 开工 → 后端乙\n[拍3] 📤 T2 提交评审\n[拍3] 📤 T3 提交评审\n[拍4] ✓ T2 评审通过（评审专家）\n[拍4] ✔ T2 采集管道开发 完成\n[拍4] ✓ T3 评审通过（评审专家）\n[拍4] ✔ T3 清洗脚本开发 完成\n[拍5] 👉 T4 调度上线 分派 → 运维\n[拍5] ▶ T4 开工 → 运维\n[拍5] 📤 T4 提交评审\n[拍6] ✓ T4 评审通过（评审专家）\n[拍6] ✔ T4 调度上线 完成\n[拍7] 👉 T5 数据质量报告 分派 → 测试工程\n[拍7] ▶ T5 开工 → 测试工程\n[拍7] 📤 T5 提交评审\n[拍8] ✓ T5 评审通过（评审专家）\n[拍8] ✔ T5 数据质量报告 完成\n[拍8] 🏁 项目「数据管线搭建」全部交付（8 拍）\n完成 5/5 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 0 · 重试 0 · 消息 15 · 用时 8 拍" },
      { name: '检查：同拍开工', stdin: '', expected: "[拍1] 👉 T1 埋点梳理 分派 → 项目经理\n[拍1] ▶ T1 开工 → 项目经理\n[拍1] 📤 T1 提交评审\n[拍2] ✓ T1 评审通过（评审专家）\n[拍2] ✔ T1 埋点梳理 完成\n[拍3] 👉 T2 采集管道开发 分派 → 后端甲\n[拍3] ▶ T2 开工 → 后端甲\n[拍3] 👉 T3 清洗脚本开发 分派 → 后端乙\n[拍3] ▶ T3 开工 → 后端乙\n[拍3] 📤 T2 提交评审\n[拍3] 📤 T3 提交评审\n[拍4] ✓ T2 评审通过（评审专家）\n[拍4] ✔ T2 采集管道开发 完成\n[拍4] ✓ T3 评审通过（评审专家）\n[拍4] ✔ T3 清洗脚本开发 完成\n[拍5] 👉 T4 调度上线 分派 → 运维\n[拍5] ▶ T4 开工 → 运维\n[拍5] 📤 T4 提交评审\n[拍6] ✓ T4 评审通过（评审专家）\n[拍6] ✔ T4 调度上线 完成\n[拍7] 👉 T5 数据质量报告 分派 → 测试工程\n[拍7] ▶ T5 开工 → 测试工程\n[拍7] 📤 T5 提交评审\n[拍8] ✓ T5 评审通过（评审专家）\n[拍8] ✔ T5 数据质量报告 完成\n[拍8] 🏁 项目「数据管线搭建」全部交付（8 拍）\n完成 5/5 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 0 · 重试 0 · 消息 15 · 用时 8 拍" },
      { name: '隐藏：逐字符比对', stdin: '', expected: "[拍1] 👉 T1 埋点梳理 分派 → 项目经理\n[拍1] ▶ T1 开工 → 项目经理\n[拍1] 📤 T1 提交评审\n[拍2] ✓ T1 评审通过（评审专家）\n[拍2] ✔ T1 埋点梳理 完成\n[拍3] 👉 T2 采集管道开发 分派 → 后端甲\n[拍3] ▶ T2 开工 → 后端甲\n[拍3] 👉 T3 清洗脚本开发 分派 → 后端乙\n[拍3] ▶ T3 开工 → 后端乙\n[拍3] 📤 T2 提交评审\n[拍3] 📤 T3 提交评审\n[拍4] ✓ T2 评审通过（评审专家）\n[拍4] ✔ T2 采集管道开发 完成\n[拍4] ✓ T3 评审通过（评审专家）\n[拍4] ✔ T3 清洗脚本开发 完成\n[拍5] 👉 T4 调度上线 分派 → 运维\n[拍5] ▶ T4 开工 → 运维\n[拍5] 📤 T4 提交评审\n[拍6] ✓ T4 评审通过（评审专家）\n[拍6] ✔ T4 调度上线 完成\n[拍7] 👉 T5 数据质量报告 分派 → 测试工程\n[拍7] ▶ T5 开工 → 测试工程\n[拍7] 📤 T5 提交评审\n[拍8] ✓ T5 评审通过（评审专家）\n[拍8] ✔ T5 数据质量报告 完成\n[拍8] 🏁 项目「数据管线搭建」全部交付（8 拍）\n完成 5/5 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 0 · 重试 0 · 消息 15 · 用时 8 拍", hidden: true },
    ],
    runtime: JSON.stringify({
      kind: 'team',
      name: '数据管线搭建',
      tasks: [
        { id: 'T1', title: '埋点梳理', type: 'plan' },
        { id: 'T2', title: '采集管道开发', type: 'backend', deps: ['T1'] },
        { id: 'T3', title: '清洗脚本开发', type: 'backend', deps: ['T1'] },
        { id: 'T4', title: '调度上线', type: 'ops', deps: ['T2', 'T3'] },
        { id: 'T5', title: '数据质量报告', type: 'test', deps: ['T4'] },
      ],
    }),
  },
  {
    id: 'agentdev-best-7',
    lang: 'agentdev',
    module: 'best',
    order: 7,
    title: '评审闸门：没有验收，交付不算数',
    difficulty: 4,
    xp: 30,
    goals: [
      '理解 requireReview 工作流：提交 → 评审 → 完成，未评审不得交付',
      '理解打回-返工闭环：评审打回后返工重交，质量不达标不流入下游',
      '能识别"关掉评审省时间"的陷阱：闸门省的是返工成本',
    ],
    brief: `## 闸门是流程的减速带，也是质量的保险丝

没有评审的多 Agent 团队像没有验收的工地：干完就算交付，问题全部流向下游。**评审闸门**（requireReview）强制每个任务经过「提交 → 评审 → 完成」三态；评审角色有权力**打回**（review-fail），任务回到执行者手里返工，重新提交再评 —— 直到通过。打回不是内耗，是把缺陷拦在闸门内：这一棒多花一拍，下一棒少烧三天。

类比：机场安检 —— 你嫌它慢，但它拦下的东西你绝不想带上飞机。

> 💡 观察流水里的 ✗ → 📤 → ✓ 闭环：打回-返工-通过，正是闸门在工作。`,
    task: `## 任务：给登录迭代装上评审闸门

项目「App 登录迭代」：T1 登录页重构(frontend，**首次评审会被打回**) → T2 支付接口(backend) → T3 回归测试(test)。

1. 定义角色：前端、后端、测试、评审(skills 含 review)、项目经理(plan)；保持默认护栏（requireReview 开启）；
2. \`team.run({ roles })\` 后输出 \`run.logText()\` 与 \`run.summaryText()\`；
3. 流水里应能看到：✗ T1 打回 → 返工一拍 → 📤 重交 → ✓ 通过 —— 且没有任何任务"跳过评审直接完成"。

**输出**：执行流水 + 单行战报`,
    starter: `// team 已注入：项目「App 登录迭代」，T1 首次评审会被打回。
// 陷阱预警：关掉 requireReview 看似省 3 拍，实则把缺陷放进了下游。

// TODO 1: 定义 roles —— 必须包含一个 skills 含 review 的评审角色，闸门才有守门人
// TODO 2: 保持默认护栏（不要关 requireReview），team.run({ roles })
// TODO 3: 输出 run.logText() 与 run.summaryText()

`,
    solution: `const roles = [
  { id: 'pm',  name: '项目经理', skills: ['plan'],     tools: ['board'] },
  { id: 'fe',  name: '前端工程', skills: ['frontend'], tools: ['code'] },
  { id: 'be',  name: '后端工程', skills: ['backend'],  tools: ['code'] },
  { id: 'qa',  name: '测试工程', skills: ['test'],     tools: ['test'] },
  { id: 'rev', name: '评审专家', skills: ['review'],   tools: ['review'] },
];
const run = team.run({ roles });
console.log(run.logText());
console.log(run.summaryText());
`,
    algo: {
      starters: {
        javascript: `// team 已注入：项目「App 登录迭代」，T1 首次评审会被打回。
// 陷阱预警：关掉 requireReview 看似省 3 拍，实则把缺陷放进了下游。

// TODO 1: 定义 roles —— 必须包含一个 skills 含 review 的评审角色，闸门才有守门人
// TODO 2: 保持默认护栏（不要关 requireReview），team.run({ roles })
// TODO 3: 输出 run.logText() 与 run.summaryText()

`,
      },
      solutions: {
        javascript: `const roles = [
  { id: 'pm',  name: '项目经理', skills: ['plan'],     tools: ['board'] },
  { id: 'fe',  name: '前端工程', skills: ['frontend'], tools: ['code'] },
  { id: 'be',  name: '后端工程', skills: ['backend'],  tools: ['code'] },
  { id: 'qa',  name: '测试工程', skills: ['test'],     tools: ['test'] },
  { id: 'rev', name: '评审专家', skills: ['review'],   tools: ['review'] },
];
const run = team.run({ roles });
console.log(run.logText());
console.log(run.summaryText());
`,
      },
    },
    hints: [
      '评审角色 = skills 数组里含 review 的角色；没有它，引擎会报 config-error 并自动放行（工作流裸奔）。',
      'T1 的打回是项目配置好的：流水里会出现 ✗ 打回 →（返工一拍）→ 📤 重交 → ✓ 通过。',
      '不要在 setup 里传 guardrails: { requireReview: false } —— 那是本关要避开的陷阱。',
    ],
    tests: [
      { name: '样例：闸门拦截', stdin: '', expected: "[拍1] 👉 T1 登录页重构 分派 → 前端工程\n[拍1] ▶ T1 开工 → 前端工程\n[拍1] 📤 T1 提交评审\n[拍2] ✗ T1 评审打回（评审专家）→ 返工\n[拍3] 📤 T1 提交评审\n[拍4] ✓ T1 评审通过（评审专家）\n[拍4] ✔ T1 登录页重构 完成\n[拍5] 👉 T2 支付接口对接 分派 → 后端工程\n[拍5] ▶ T2 开工 → 后端工程\n[拍5] 📤 T2 提交评审\n[拍6] ✓ T2 评审通过（评审专家）\n[拍6] ✔ T2 支付接口对接 完成\n[拍7] 👉 T3 回归测试 分派 → 测试工程\n[拍7] ▶ T3 开工 → 测试工程\n[拍7] 📤 T3 提交评审\n[拍8] ✓ T3 评审通过（评审专家）\n[拍8] ✔ T3 回归测试 完成\n[拍8] 🏁 项目「App 登录迭代」全部交付（8 拍）\n完成 3/3 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 0 · 重试 0 · 消息 11 · 用时 8 拍" },
      { name: '检查：返工闭环', stdin: '', expected: "[拍1] 👉 T1 登录页重构 分派 → 前端工程\n[拍1] ▶ T1 开工 → 前端工程\n[拍1] 📤 T1 提交评审\n[拍2] ✗ T1 评审打回（评审专家）→ 返工\n[拍3] 📤 T1 提交评审\n[拍4] ✓ T1 评审通过（评审专家）\n[拍4] ✔ T1 登录页重构 完成\n[拍5] 👉 T2 支付接口对接 分派 → 后端工程\n[拍5] ▶ T2 开工 → 后端工程\n[拍5] 📤 T2 提交评审\n[拍6] ✓ T2 评审通过（评审专家）\n[拍6] ✔ T2 支付接口对接 完成\n[拍7] 👉 T3 回归测试 分派 → 测试工程\n[拍7] ▶ T3 开工 → 测试工程\n[拍7] 📤 T3 提交评审\n[拍8] ✓ T3 评审通过（评审专家）\n[拍8] ✔ T3 回归测试 完成\n[拍8] 🏁 项目「App 登录迭代」全部交付（8 拍）\n完成 3/3 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 0 · 重试 0 · 消息 11 · 用时 8 拍" },
      { name: '检查：无裸奔交付', stdin: '', expected: "[拍1] 👉 T1 登录页重构 分派 → 前端工程\n[拍1] ▶ T1 开工 → 前端工程\n[拍1] 📤 T1 提交评审\n[拍2] ✗ T1 评审打回（评审专家）→ 返工\n[拍3] 📤 T1 提交评审\n[拍4] ✓ T1 评审通过（评审专家）\n[拍4] ✔ T1 登录页重构 完成\n[拍5] 👉 T2 支付接口对接 分派 → 后端工程\n[拍5] ▶ T2 开工 → 后端工程\n[拍5] 📤 T2 提交评审\n[拍6] ✓ T2 评审通过（评审专家）\n[拍6] ✔ T2 支付接口对接 完成\n[拍7] 👉 T3 回归测试 分派 → 测试工程\n[拍7] ▶ T3 开工 → 测试工程\n[拍7] 📤 T3 提交评审\n[拍8] ✓ T3 评审通过（评审专家）\n[拍8] ✔ T3 回归测试 完成\n[拍8] 🏁 项目「App 登录迭代」全部交付（8 拍）\n完成 3/3 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 0 · 重试 0 · 消息 11 · 用时 8 拍" },
      { name: '隐藏：逐字符比对', stdin: '', expected: "[拍1] 👉 T1 登录页重构 分派 → 前端工程\n[拍1] ▶ T1 开工 → 前端工程\n[拍1] 📤 T1 提交评审\n[拍2] ✗ T1 评审打回（评审专家）→ 返工\n[拍3] 📤 T1 提交评审\n[拍4] ✓ T1 评审通过（评审专家）\n[拍4] ✔ T1 登录页重构 完成\n[拍5] 👉 T2 支付接口对接 分派 → 后端工程\n[拍5] ▶ T2 开工 → 后端工程\n[拍5] 📤 T2 提交评审\n[拍6] ✓ T2 评审通过（评审专家）\n[拍6] ✔ T2 支付接口对接 完成\n[拍7] 👉 T3 回归测试 分派 → 测试工程\n[拍7] ▶ T3 开工 → 测试工程\n[拍7] 📤 T3 提交评审\n[拍8] ✓ T3 评审通过（评审专家）\n[拍8] ✔ T3 回归测试 完成\n[拍8] 🏁 项目「App 登录迭代」全部交付（8 拍）\n完成 3/3 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 0 · 重试 0 · 消息 11 · 用时 8 拍", hidden: true },
    ],
    runtime: JSON.stringify({
      kind: 'team',
      name: 'App 登录迭代',
      tasks: [
        { id: 'T1', title: '登录页重构', type: 'frontend', reviewFails: true },
        { id: 'T2', title: '支付接口对接', type: 'backend', deps: ['T1'] },
        { id: 'T3', title: '回归测试', type: 'test', deps: ['T2'] },
      ],
    }),
  },
  {
    id: 'agentdev-best-8',
    lang: 'agentdev',
    module: 'best',
    order: 8,
    title: '护栏：工具白名单拦住越权的手',
    difficulty: 4,
    xp: 30,
    goals: [
      '理解工具白名单：角色只能调用 tools 里声明过的工具',
      '理解越权拦截与穿透的区别：护栏开启=拦截告警，关闭=静默穿透',
      '能按最小权限原则给每个角色配置工具集',
    ],
    brief: `## 权限是给出来的，事故也是

多 Agent 团队里最危险的瞬间，是某个 agent "顺手"调用了不属于它职责的工具 —— 后端工程师直接执行生产部署，测试 agent 清空了数据库。**工具白名单**是最小权限原则的落地：每个角色的 tools 数组就是它的全部权限，越权调用在护栏（toolWhitelist）开启时被**当场拦截并告警**；护栏一旦关闭，同样的调用会**静默穿透** —— 没有告警，只有后果。

类比：酒店的房卡 —— 你只能刷开自己的房间；把整栋楼做成万能门禁，省的是前台麻烦，赌的是整栋楼的安全。

> 💡 白名单宁小勿大：工具不在手上的越权会被拦下并留下证据，这正是你要的。`,
    task: `## 任务：为服务迁移项目配置最小权限

项目「服务迁移」：T1 迁移方案(plan) → T2 数据迁出(backend，**会尝试调用 deploy 工具**) → T3 数据校验(test) → T4 切换上线(ops)。

1. 定义角色：项目经理(plan)、后端（**tools 只给 code 和 db**，不给 deploy！）、测试(test)、运维（tools 含 deploy）、评审(review)；
2. \`team.run({ roles })\` 后输出 \`run.summaryText()\` 与 \`run.logText()\`；
3. 战报应显示 **拦截 1 · 穿透 0** —— 后端的越权 deploy 在开工瞬间被护栏拦下并告警，项目照常交付。

**输出**：单行战报 + 执行流水（含一条 ⚠ 拦截记录）`,
    starter: `// team 已注入：项目「服务迁移」，T2 的执行者会尝试调用 deploy（越权行为已写进项目剧本）。
// 陷阱预警：如果后端的 tools 里有 deploy，越权调用会被当成"合法操作"直接执行。

// TODO 1: 定义 roles —— 后端工程师的工具白名单只给 ['code', 'db']，deploy 属于运维
// TODO 2: 保持默认护栏（toolWhitelist 开启），team.run({ roles })
// TODO 3: 输出 run.summaryText() 与 run.logText()

`,
    solution: `const roles = [
  { id: 'pm',  name: '项目经理', skills: ['plan'],     tools: ['board'] },
  { id: 'be',  name: '后端工程', skills: ['backend'],  tools: ['code', 'db'] },
  { id: 'qa',  name: '测试工程', skills: ['test'],     tools: ['test'] },
  { id: 'op',  name: '运维',     skills: ['ops'],      tools: ['deploy'] },
  { id: 'rev', name: '评审专家', skills: ['review'],   tools: ['review'] },
];
const run = team.run({ roles });
console.log(run.summaryText());
console.log(run.logText());
`,
    algo: {
      starters: {
        javascript: `// team 已注入：项目「服务迁移」，T2 的执行者会尝试调用 deploy（越权行为已写进项目剧本）。
// 陷阱预警：如果后端的 tools 里有 deploy，越权调用会被当成"合法操作"直接执行。

// TODO 1: 定义 roles —— 后端工程师的工具白名单只给 ['code', 'db']，deploy 属于运维
// TODO 2: 保持默认护栏（toolWhitelist 开启），team.run({ roles })
// TODO 3: 输出 run.summaryText() 与 run.logText()

`,
      },
      solutions: {
        javascript: `const roles = [
  { id: 'pm',  name: '项目经理', skills: ['plan'],     tools: ['board'] },
  { id: 'be',  name: '后端工程', skills: ['backend'],  tools: ['code', 'db'] },
  { id: 'qa',  name: '测试工程', skills: ['test'],     tools: ['test'] },
  { id: 'op',  name: '运维',     skills: ['ops'],      tools: ['deploy'] },
  { id: 'rev', name: '评审专家', skills: ['review'],   tools: ['review'] },
];
const run = team.run({ roles });
console.log(run.summaryText());
console.log(run.logText());
`,
      },
    },
    hints: [
      '拦截发生在"开工瞬间"：流水里 ⚠ 记录出现在 ▶ 开工 之后、任务完成之前。',
      '判断依据只有一个：调用者的 tools 数组里有没有这个工具 —— 与角色名称、任务类型都无关。',
      '战报字段顺序：完成 · 阻塞 · 拦截 · 穿透 · 升级 · 重试 · 消息 · 用时。',
    ],
    tests: [
      { name: '样例：越权拦截', stdin: '', expected: "完成 4/4 · 阻塞 0 · 拦截 1 · 穿透 0 · 升级 0 · 重试 0 · 消息 13 · 用时 8 拍\n[拍1] 👉 T1 迁移方案 分派 → 项目经理\n[拍1] ▶ T1 开工 → 项目经理\n[拍1] 📤 T1 提交评审\n[拍2] ✓ T1 评审通过（评审专家）\n[拍2] ✔ T1 迁移方案 完成\n[拍3] 👉 T2 数据迁出 分派 → 后端工程\n[拍3] ▶ T2 开工 → 后端工程\n[拍3] ⚠ 后端工程 尝试调用未授权工具 [deploy] —— 已拦截\n[拍3] 📤 T2 提交评审\n[拍4] ✓ T2 评审通过（评审专家）\n[拍4] ✔ T2 数据迁出 完成\n[拍5] 👉 T3 数据校验 分派 → 测试工程\n[拍5] ▶ T3 开工 → 测试工程\n[拍5] 📤 T3 提交评审\n[拍6] ✓ T3 评审通过（评审专家）\n[拍6] ✔ T3 数据校验 完成\n[拍7] 👉 T4 切换上线 分派 → 运维\n[拍7] ▶ T4 开工 → 运维\n[拍7] 📤 T4 提交评审\n[拍8] ✓ T4 评审通过（评审专家）\n[拍8] ✔ T4 切换上线 完成\n[拍8] 🏁 项目「服务迁移」全部交付（8 拍）" },
      { name: '检查：最小权限', stdin: '', expected: "完成 4/4 · 阻塞 0 · 拦截 1 · 穿透 0 · 升级 0 · 重试 0 · 消息 13 · 用时 8 拍\n[拍1] 👉 T1 迁移方案 分派 → 项目经理\n[拍1] ▶ T1 开工 → 项目经理\n[拍1] 📤 T1 提交评审\n[拍2] ✓ T1 评审通过（评审专家）\n[拍2] ✔ T1 迁移方案 完成\n[拍3] 👉 T2 数据迁出 分派 → 后端工程\n[拍3] ▶ T2 开工 → 后端工程\n[拍3] ⚠ 后端工程 尝试调用未授权工具 [deploy] —— 已拦截\n[拍3] 📤 T2 提交评审\n[拍4] ✓ T2 评审通过（评审专家）\n[拍4] ✔ T2 数据迁出 完成\n[拍5] 👉 T3 数据校验 分派 → 测试工程\n[拍5] ▶ T3 开工 → 测试工程\n[拍5] 📤 T3 提交评审\n[拍6] ✓ T3 评审通过（评审专家）\n[拍6] ✔ T3 数据校验 完成\n[拍7] 👉 T4 切换上线 分派 → 运维\n[拍7] ▶ T4 开工 → 运维\n[拍7] 📤 T4 提交评审\n[拍8] ✓ T4 评审通过（评审专家）\n[拍8] ✔ T4 切换上线 完成\n[拍8] 🏁 项目「服务迁移」全部交付（8 拍）" },
      { name: '检查：照常交付', stdin: '', expected: "完成 4/4 · 阻塞 0 · 拦截 1 · 穿透 0 · 升级 0 · 重试 0 · 消息 13 · 用时 8 拍\n[拍1] 👉 T1 迁移方案 分派 → 项目经理\n[拍1] ▶ T1 开工 → 项目经理\n[拍1] 📤 T1 提交评审\n[拍2] ✓ T1 评审通过（评审专家）\n[拍2] ✔ T1 迁移方案 完成\n[拍3] 👉 T2 数据迁出 分派 → 后端工程\n[拍3] ▶ T2 开工 → 后端工程\n[拍3] ⚠ 后端工程 尝试调用未授权工具 [deploy] —— 已拦截\n[拍3] 📤 T2 提交评审\n[拍4] ✓ T2 评审通过（评审专家）\n[拍4] ✔ T2 数据迁出 完成\n[拍5] 👉 T3 数据校验 分派 → 测试工程\n[拍5] ▶ T3 开工 → 测试工程\n[拍5] 📤 T3 提交评审\n[拍6] ✓ T3 评审通过（评审专家）\n[拍6] ✔ T3 数据校验 完成\n[拍7] 👉 T4 切换上线 分派 → 运维\n[拍7] ▶ T4 开工 → 运维\n[拍7] 📤 T4 提交评审\n[拍8] ✓ T4 评审通过（评审专家）\n[拍8] ✔ T4 切换上线 完成\n[拍8] 🏁 项目「服务迁移」全部交付（8 拍）" },
      { name: '隐藏：逐字符比对', stdin: '', expected: "完成 4/4 · 阻塞 0 · 拦截 1 · 穿透 0 · 升级 0 · 重试 0 · 消息 13 · 用时 8 拍\n[拍1] 👉 T1 迁移方案 分派 → 项目经理\n[拍1] ▶ T1 开工 → 项目经理\n[拍1] 📤 T1 提交评审\n[拍2] ✓ T1 评审通过（评审专家）\n[拍2] ✔ T1 迁移方案 完成\n[拍3] 👉 T2 数据迁出 分派 → 后端工程\n[拍3] ▶ T2 开工 → 后端工程\n[拍3] ⚠ 后端工程 尝试调用未授权工具 [deploy] —— 已拦截\n[拍3] 📤 T2 提交评审\n[拍4] ✓ T2 评审通过（评审专家）\n[拍4] ✔ T2 数据迁出 完成\n[拍5] 👉 T3 数据校验 分派 → 测试工程\n[拍5] ▶ T3 开工 → 测试工程\n[拍5] 📤 T3 提交评审\n[拍6] ✓ T3 评审通过（评审专家）\n[拍6] ✔ T3 数据校验 完成\n[拍7] 👉 T4 切换上线 分派 → 运维\n[拍7] ▶ T4 开工 → 运维\n[拍7] 📤 T4 提交评审\n[拍8] ✓ T4 评审通过（评审专家）\n[拍8] ✔ T4 切换上线 完成\n[拍8] 🏁 项目「服务迁移」全部交付（8 拍）", hidden: true },
    ],
    runtime: JSON.stringify({
      kind: 'team',
      name: '服务迁移',
      tasks: [
        { id: 'T1', title: '迁移方案', type: 'plan' },
        { id: 'T2', title: '数据迁出', type: 'backend', deps: ['T1'], misuse: { tool: 'deploy' } },
        { id: 'T3', title: '数据校验', type: 'test', deps: ['T2'] },
        { id: 'T4', title: '切换上线', type: 'ops', deps: ['T3'] },
      ],
    }),
  },
  {
    id: 'agentdev-best-9',
    lang: 'agentdev',
    module: 'best',
    order: 9,
    title: '防卡死：阻塞上报与升级策略',
    difficulty: 4,
    xp: 30,
    goals: [
      '理解阻塞的生命周期：开工受阻 → 上报 → 策略处置 → 恢复或死锁',
      '掌握三种 onBlock 策略：escalate 直升 / retry 重试后升级 / ignore 死锁',
      '能配置"流程永不卡死"的团队：任何阻塞都有明确出口',
    ],
    brief: `## 没有出口的阻塞，就是死锁的前奏

真实项目里"卡住了"不可怕，可怕的是卡住了没人管。团队引擎里任务受阻会**上报阻塞**，之后的命运完全由策略（policy.onBlock）决定：**escalate** 直达项目经理解除阻塞恢复推进；**retry** 先原地重试，重试次数耗尽再升级 —— 多走弯路但仍有出口；**ignore** 没有任何出口，任务永远停在阻塞列，全项目死锁收场。

类比：客服工单 —— 转专人处理（升级）可能慢一点，但一定有回音；"已读不回"（ignore）才是用户拉黑你的原因。

> 💡 管理方式的本质是给每类异常配置出口：阻塞有升级、重试有上限、升级有受理人（plan 技能）。`,
    task: `## 任务：给双十一备战项目装上"不死"策略

项目「双十一备战」：T1 压测方案(plan) → T2 全链路压测(test，**会因环境资源被占用而阻塞**) → T3 容量扩容(ops)、T4 预案演练(ops)。

1. 定义角色：项目经理(plan)、测试(test)、运维(ops)、评审(review)；
2. 配置 \`policy: { onBlock: 'escalate' }\` —— 阻塞直报项目经理，由 PM 解除后重新派工；
3. \`team.run({ roles, policy })\` 后输出 \`run.summaryText()\`、\`run.logText()\` 与 \`run.boardText()\`；
4. 战报应显示 **升级 1 · 完成 4/4**：T2 阻塞一拍后经 PM 解除，项目照常交付。

**输出**：单行战报 + 执行流水 + 五行看板`,
    starter: `// team 已注入：项目「双十一备战」，T2 会被环境阻塞（阻塞行为已写进项目剧本）。
// 陷阱预警：onBlock 策略若是 ignore，阻塞永远无人处理，全项目死锁。

// TODO 1: 定义 roles —— 需要 plan（受理升级）/ test / ops / review 四类技能
// TODO 2: 配置 policy: { onBlock: 'escalate' }，team.run({ roles, policy })
// TODO 3: 输出 run.summaryText()、run.logText()、run.boardText()

`,
    solution: `const roles = [
  { id: 'pm',  name: '项目经理', skills: ['plan'],   tools: ['board'] },
  { id: 'qa',  name: '测试工程', skills: ['test'],   tools: ['test'] },
  { id: 'op',  name: '运维',     skills: ['ops'],    tools: ['deploy'] },
  { id: 'rev', name: '评审专家', skills: ['review'], tools: ['review'] },
];
const policy = { onBlock: 'escalate' };
const run = team.run({ roles, policy });
console.log(run.summaryText());
console.log(run.logText());
console.log(run.boardText());
`,
    algo: {
      starters: {
        javascript: `// team 已注入：项目「双十一备战」，T2 会被环境阻塞（阻塞行为已写进项目剧本）。
// 陷阱预警：onBlock 策略若是 ignore，阻塞永远无人处理，全项目死锁。

// TODO 1: 定义 roles —— 需要 plan（受理升级）/ test / ops / review 四类技能
// TODO 2: 配置 policy: { onBlock: 'escalate' }，team.run({ roles, policy })
// TODO 3: 输出 run.summaryText()、run.logText()、run.boardText()

`,
      },
      solutions: {
        javascript: `const roles = [
  { id: 'pm',  name: '项目经理', skills: ['plan'],   tools: ['board'] },
  { id: 'qa',  name: '测试工程', skills: ['test'],   tools: ['test'] },
  { id: 'op',  name: '运维',     skills: ['ops'],    tools: ['deploy'] },
  { id: 'rev', name: '评审专家', skills: ['review'], tools: ['review'] },
];
const policy = { onBlock: 'escalate' };
const run = team.run({ roles, policy });
console.log(run.summaryText());
console.log(run.logText());
console.log(run.boardText());
`,
      },
    },
    hints: [
      '升级受理人 = skills 含 plan 的角色（项目经理的看家技能）；没有它，升级无人受理。',
      '流水的完整故事线：⏸ 阻塞上报 → ⇡ PM 升级处理 → 任务重新入队 → ▶ 再次开工 → ✔ 完成。',
      'ignore 是反面教材：阻塞列永远不清空，引擎以 ✖ 死锁收场 —— 这就是"流程不卡"要防的事。',
    ],
    tests: [
      { name: '样例：升级恢复', stdin: '', expected: "完成 4/4 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 1 · 重试 0 · 消息 15 · 用时 9 拍\n[拍1] 👉 T1 压测方案 分派 → 项目经理\n[拍1] ▶ T1 开工 → 项目经理\n[拍1] 📤 T1 提交评审\n[拍2] ✓ T1 评审通过（评审专家）\n[拍2] ✔ T1 压测方案 完成\n[拍3] 👉 T2 全链路压测 分派 → 测试工程\n[拍3] ▶ T2 开工 → 测试工程\n[拍3] ⏸ T2 阻塞（压测环境资源被占用）→ 测试工程 上报\n[拍4] ⇡ 项目经理 升级处理：解除 T2 阻塞（压测环境资源被占用）\n[拍4] 👉 T2 全链路压测 分派 → 测试工程\n[拍4] ▶ T2 开工 → 测试工程\n[拍4] 📤 T2 提交评审\n[拍5] ✓ T2 评审通过（评审专家）\n[拍5] ✔ T2 全链路压测 完成\n[拍6] 👉 T3 容量扩容 分派 → 运维\n[拍6] ▶ T3 开工 → 运维\n[拍6] 📤 T3 提交评审\n[拍7] ✓ T3 评审通过（评审专家）\n[拍7] ✔ T3 容量扩容 完成\n[拍8] 👉 T4 预案演练 分派 → 运维\n[拍8] ▶ T4 开工 → 运维\n[拍8] 📤 T4 提交评审\n[拍9] ✓ T4 评审通过（评审专家）\n[拍9] ✔ T4 预案演练 完成\n[拍9] 🏁 项目「双十一备战」全部交付（9 拍）\n待办: -\n进行中: -\n评审: -\n阻塞: -\n已完成: T1 T2 T3 T4" },
      { name: '检查：无死锁', stdin: '', expected: "完成 4/4 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 1 · 重试 0 · 消息 15 · 用时 9 拍\n[拍1] 👉 T1 压测方案 分派 → 项目经理\n[拍1] ▶ T1 开工 → 项目经理\n[拍1] 📤 T1 提交评审\n[拍2] ✓ T1 评审通过（评审专家）\n[拍2] ✔ T1 压测方案 完成\n[拍3] 👉 T2 全链路压测 分派 → 测试工程\n[拍3] ▶ T2 开工 → 测试工程\n[拍3] ⏸ T2 阻塞（压测环境资源被占用）→ 测试工程 上报\n[拍4] ⇡ 项目经理 升级处理：解除 T2 阻塞（压测环境资源被占用）\n[拍4] 👉 T2 全链路压测 分派 → 测试工程\n[拍4] ▶ T2 开工 → 测试工程\n[拍4] 📤 T2 提交评审\n[拍5] ✓ T2 评审通过（评审专家）\n[拍5] ✔ T2 全链路压测 完成\n[拍6] 👉 T3 容量扩容 分派 → 运维\n[拍6] ▶ T3 开工 → 运维\n[拍6] 📤 T3 提交评审\n[拍7] ✓ T3 评审通过（评审专家）\n[拍7] ✔ T3 容量扩容 完成\n[拍8] 👉 T4 预案演练 分派 → 运维\n[拍8] ▶ T4 开工 → 运维\n[拍8] 📤 T4 提交评审\n[拍9] ✓ T4 评审通过（评审专家）\n[拍9] ✔ T4 预案演练 完成\n[拍9] 🏁 项目「双十一备战」全部交付（9 拍）\n待办: -\n进行中: -\n评审: -\n阻塞: -\n已完成: T1 T2 T3 T4" },
      { name: '检查：全部交付', stdin: '', expected: "完成 4/4 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 1 · 重试 0 · 消息 15 · 用时 9 拍\n[拍1] 👉 T1 压测方案 分派 → 项目经理\n[拍1] ▶ T1 开工 → 项目经理\n[拍1] 📤 T1 提交评审\n[拍2] ✓ T1 评审通过（评审专家）\n[拍2] ✔ T1 压测方案 完成\n[拍3] 👉 T2 全链路压测 分派 → 测试工程\n[拍3] ▶ T2 开工 → 测试工程\n[拍3] ⏸ T2 阻塞（压测环境资源被占用）→ 测试工程 上报\n[拍4] ⇡ 项目经理 升级处理：解除 T2 阻塞（压测环境资源被占用）\n[拍4] 👉 T2 全链路压测 分派 → 测试工程\n[拍4] ▶ T2 开工 → 测试工程\n[拍4] 📤 T2 提交评审\n[拍5] ✓ T2 评审通过（评审专家）\n[拍5] ✔ T2 全链路压测 完成\n[拍6] 👉 T3 容量扩容 分派 → 运维\n[拍6] ▶ T3 开工 → 运维\n[拍6] 📤 T3 提交评审\n[拍7] ✓ T3 评审通过（评审专家）\n[拍7] ✔ T3 容量扩容 完成\n[拍8] 👉 T4 预案演练 分派 → 运维\n[拍8] ▶ T4 开工 → 运维\n[拍8] 📤 T4 提交评审\n[拍9] ✓ T4 评审通过（评审专家）\n[拍9] ✔ T4 预案演练 完成\n[拍9] 🏁 项目「双十一备战」全部交付（9 拍）\n待办: -\n进行中: -\n评审: -\n阻塞: -\n已完成: T1 T2 T3 T4" },
      { name: '隐藏：逐字符比对', stdin: '', expected: "完成 4/4 · 阻塞 0 · 拦截 0 · 穿透 0 · 升级 1 · 重试 0 · 消息 15 · 用时 9 拍\n[拍1] 👉 T1 压测方案 分派 → 项目经理\n[拍1] ▶ T1 开工 → 项目经理\n[拍1] 📤 T1 提交评审\n[拍2] ✓ T1 评审通过（评审专家）\n[拍2] ✔ T1 压测方案 完成\n[拍3] 👉 T2 全链路压测 分派 → 测试工程\n[拍3] ▶ T2 开工 → 测试工程\n[拍3] ⏸ T2 阻塞（压测环境资源被占用）→ 测试工程 上报\n[拍4] ⇡ 项目经理 升级处理：解除 T2 阻塞（压测环境资源被占用）\n[拍4] 👉 T2 全链路压测 分派 → 测试工程\n[拍4] ▶ T2 开工 → 测试工程\n[拍4] 📤 T2 提交评审\n[拍5] ✓ T2 评审通过（评审专家）\n[拍5] ✔ T2 全链路压测 完成\n[拍6] 👉 T3 容量扩容 分派 → 运维\n[拍6] ▶ T3 开工 → 运维\n[拍6] 📤 T3 提交评审\n[拍7] ✓ T3 评审通过（评审专家）\n[拍7] ✔ T3 容量扩容 完成\n[拍8] 👉 T4 预案演练 分派 → 运维\n[拍8] ▶ T4 开工 → 运维\n[拍8] 📤 T4 提交评审\n[拍9] ✓ T4 评审通过（评审专家）\n[拍9] ✔ T4 预案演练 完成\n[拍9] 🏁 项目「双十一备战」全部交付（9 拍）\n待办: -\n进行中: -\n评审: -\n阻塞: -\n已完成: T1 T2 T3 T4", hidden: true },
    ],
    runtime: JSON.stringify({
      kind: 'team',
      name: '双十一备战',
      tasks: [
        { id: 'T1', title: '压测方案', type: 'plan' },
        { id: 'T2', title: '全链路压测', type: 'test', deps: ['T1'], needsEscalation: true, blockReason: '压测环境资源被占用' },
        { id: 'T3', title: '容量扩容', type: 'ops', deps: ['T2'] },
        { id: 'T4', title: '预案演练', type: 'ops', deps: ['T2'] },
      ],
    }),
  },
];
