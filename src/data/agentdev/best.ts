import type { Level } from '@/types';

/** Agent 课程 · 第五章：多智能体与护栏（best，4 关） */
export const AGENTDEV_BEST: Level[] = [
  {
    id: 'agentdev-best-1',
    lang: 'agentdev',
    module: 'best',
    order: 1,
    title: '多智能体协作',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解多智能体协作：按角色拆分任务，输出串成流水线',
      '学会为每个 agent 配置专属的 system 提示词',
      '能实现三段流水线：翻译 → 总结 → 审校',
    ],
    brief: `## 多智能体：给流水线安排三个专家

一个提示词既要翻译又要总结还要润色，模型容易顾此失彼。**多智能体协作**拆而治之：每个 agent 只带一个角色的 system 提示词，输出作为下一个 agent 的输入，串成流水线：**翻译 → 总结 → 审校**。各环节上下文更聚焦、提示词更好调，坏了也知道坏在哪一棒 —— 代价是多几次 LLM 调用。

类比：**出版社的编辑流水线** —— 译者、编辑、校对各司其职，没人一边翻译一边给自己写腰封。

> 💡 这是最简单的编排形态（串行链）。真实框架（LangGraph、AutoGen）还支持路由、并行与辩论式协作，但"角色分工 + 传递上下文"是不变的内核。`,
    task: `## 任务：跑通三段协作流水线

Mock 配置三轮，依次返回三个 agent 的回复。原文（内置）：\`智码 CodeQuest 通过闯关和即时反馈，让学习者像玩游戏一样掌握编程。\`

1. 定义流水线数组，三个步骤：
   - 翻译：system \`'你是翻译Agent，把中文准确译成英文，只输出译文。'\`，user 提示 \`'把下面的中文翻译成英文：'\` + 当前文本；
   - 总结：system \`'你是总结Agent，把文本压缩成一句话英文，只输出摘要。'\`，user 提示 \`'把下面的英文总结成一句话：'\` + 当前文本；
   - 审校：system \`'你是审校Agent，润色英文使其更地道，只输出定稿。'\`，user 提示 \`'润色下面的英文，使其更地道：'\` + 当前文本；
2. 依次调用 \`llm.chat\`，每步把回复作为**下一步的输入**；
3. 每步输出一行：\`<角色>: <回复>\`。

**输入**：无

**输出**：三行

\`\`\`text
翻译: CodeQuest turns learning to code into a game-like adventure.
总结: CodeQuest makes coding fun.
审校: CodeQuest makes coding genuinely fun and addictive.
\`\`\``,
    starter: `// llm 已注入，配置有三轮预设回复（翻译 / 总结 / 审校 各一轮）。
// 流水线纪律：上一步的输出就是下一步的输入。

const text = '智码 CodeQuest 通过闯关和即时反馈，让学习者像玩游戏一样掌握编程。';

// TODO 1: 定义流水线数组 steps：每步含 role（角色名）、system（专属 system 提示词）、prompt（user 提示前缀）
// TODO 2: 顺序执行：每步组 messages（system + user），调用 llm.chat
// TODO 3: 输出 '<角色>: <回复>'，并把回复作为下一步的输入

`,
    solution: `const text = '智码 CodeQuest 通过闯关和即时反馈，让学习者像玩游戏一样掌握编程。';
const steps = [
  { role: '翻译', system: '你是翻译Agent，把中文准确译成英文，只输出译文。', prompt: '把下面的中文翻译成英文：' },
  { role: '总结', system: '你是总结Agent，把文本压缩成一句话英文，只输出摘要。', prompt: '把下面的英文总结成一句话：' },
  { role: '审校', system: '你是审校Agent，润色英文使其更地道，只输出定稿。', prompt: '润色下面的英文，使其更地道：' },
];
let current = text;
for (const s of steps) {
  const messages = [
    { role: 'system', content: s.system },
    { role: 'user', content: s.prompt + current },
  ];
  const res = llm.chat(messages);
  current = res.content;
  console.log(s.role + ': ' + current);
}
`,
    algo: {
      starters: {
        javascript: `// llm 已注入，配置有三轮预设回复（翻译 / 总结 / 审校 各一轮）。
// 流水线纪律：上一步的输出就是下一步的输入。

const text = '智码 CodeQuest 通过闯关和即时反馈，让学习者像玩游戏一样掌握编程。';

// TODO 1: 定义流水线数组 steps：每步含 role（角色名）、system（专属 system 提示词）、prompt（user 提示前缀）
// TODO 2: 顺序执行：每步组 messages（system + user），调用 llm.chat
// TODO 3: 输出 '<角色>: <回复>'，并把回复作为下一步的输入

`,
      },
      solutions: {
        javascript: `const text = '智码 CodeQuest 通过闯关和即时反馈，让学习者像玩游戏一样掌握编程。';
const steps = [
  { role: '翻译', system: '你是翻译Agent，把中文准确译成英文，只输出译文。', prompt: '把下面的中文翻译成英文：' },
  { role: '总结', system: '你是总结Agent，把文本压缩成一句话英文，只输出摘要。', prompt: '把下面的英文总结成一句话：' },
  { role: '审校', system: '你是审校Agent，润色英文使其更地道，只输出定稿。', prompt: '润色下面的英文，使其更地道：' },
];
let current = text;
for (const s of steps) {
  const messages = [
    { role: 'system', content: s.system },
    { role: 'user', content: s.prompt + current },
  ];
  const res = llm.chat(messages);
  current = res.content;
  console.log(s.role + ': ' + current);
}
`,
      },
    },
    hints: [
      '三个 agent 依次调用 chat，共三次 —— Mock 按顺序返回三轮预设回复。',
      '关键一行：`current = res.content`，把本步输出存起来，下一步拼进 user 消息（`s.prompt + current`）。',
      '输出格式 `翻译: ...` 用 `s.role + ": " + current`，冒号后一个空格。',
    ],
    tests: [
      { name: '样例：三段流水线', stdin: '', expected: '翻译: CodeQuest turns learning to code into a game-like adventure.\n总结: CodeQuest makes coding fun.\n审校: CodeQuest makes coding genuinely fun and addictive.' },
      { name: '检查：输出接力', stdin: '', expected: '翻译: CodeQuest turns learning to code into a game-like adventure.\n总结: CodeQuest makes coding fun.\n审校: CodeQuest makes coding genuinely fun and addictive.' },
      { name: '检查：角色前缀', stdin: '', expected: '翻译: CodeQuest turns learning to code into a game-like adventure.\n总结: CodeQuest makes coding fun.\n审校: CodeQuest makes coding genuinely fun and addictive.' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '翻译: CodeQuest turns learning to code into a game-like adventure.\n总结: CodeQuest makes coding fun.\n审校: CodeQuest makes coding genuinely fun and addictive.', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { content: 'CodeQuest turns learning to code into a game-like adventure.' },
        { content: 'CodeQuest makes coding fun.' },
        { content: 'CodeQuest makes coding genuinely fun and addictive.' },
      ],
    }),
  },
  {
    id: 'agentdev-best-2',
    lang: 'agentdev',
    module: 'best',
    order: 2,
    title: '护栏：敏感词拦截',
    difficulty: 3,
    xp: 25,
    goals: [
      '理解输入护栏：把明显不合规的请求拦在模型之外',
      '实现基于内置词表的敏感词检测',
      '认识规则护栏的误报问题（正当内容含敏感词）',
    ],
    brief: `## 输入护栏：先验货，再进模型

用户输入直接进模型是有风险的：提示词注入、违规内容都会顺着这条通道进来。**输入护栏**是 Agent 的第一道安检门 —— 用规则把明显不合规的输入拦在模型之外：

\`\`\`js
blocked.some((w) => input.includes(w)) // 命中即拦截
\`\`\`

命中就返回 \`BLOCKED\`，**不消耗一次 LLM 调用**；放行才进模型。规则护栏快、便宜、可解释，但只认字面 —— "如何防范网络诈骗"这类正当提问会被**误杀**。生产系统通常"规则 + 模型审核"双层：规则拦明显的，模型判模糊的。

类比：地铁安检 —— **金属探测门**先扫一遍，拿不准的再请人工复检。

> ⚠️ 宁可误报也不要漏报，误报率要持续回归测试。`,
    task: `## 任务：给三条用户输入过安检

敏感词表与输入都内置在代码里（本关不需要调用 \`llm\`）：

- 词表：\`['诈骗', '赌博', '博彩', '暴力']\`
- 输入依次为：
  1. \`帮我查询订单什么时候发货\`
  2. \`这个游戏怎么通关\`
  3. \`有没有稳赚的博彩平台推荐\`

对每条输入：只要包含**任一**敏感词就输出 \`BLOCKED\`，否则输出 \`OK\`。

**输入**：无

**输出**：三行（注意第 3 条命中"博彩"）

\`\`\`text
OK
OK
BLOCKED
\`\`\``,
    starter: `// 本关不需要调用 llm（没有 Mock 配置），纯逻辑题。
// 护栏原则：命中任一敏感词 → BLOCKED（不进模型）；否则 → OK。

const blocked = ['诈骗', '赌博', '博彩', '暴力'];
const inputs = [
  '帮我查询订单什么时候发货',
  '这个游戏怎么通关',
  '有没有稳赚的博彩平台推荐',
];

// TODO 1: 遍历 inputs
// TODO 2: 用 blocked.some((w) => t.includes(w)) 判断是否命中
// TODO 3: 命中输出 BLOCKED，否则输出 OK

`,
    solution: `const blocked = ['诈骗', '赌博', '博彩', '暴力'];
const inputs = [
  '帮我查询订单什么时候发货',
  '这个游戏怎么通关',
  '有没有稳赚的博彩平台推荐',
];
for (const t of inputs) {
  const hit = blocked.some((w) => t.includes(w));
  console.log(hit ? 'BLOCKED' : 'OK');
}
`,
    algo: {
      starters: {
        javascript: `// 本关不需要调用 llm（没有 Mock 配置），纯逻辑题。
// 护栏原则：命中任一敏感词 → BLOCKED（不进模型）；否则 → OK。

const blocked = ['诈骗', '赌博', '博彩', '暴力'];
const inputs = [
  '帮我查询订单什么时候发货',
  '这个游戏怎么通关',
  '有没有稳赚的博彩平台推荐',
];

// TODO 1: 遍历 inputs
// TODO 2: 用 blocked.some((w) => t.includes(w)) 判断是否命中
// TODO 3: 命中输出 BLOCKED，否则输出 OK

`,
      },
      solutions: {
        javascript: `const blocked = ['诈骗', '赌博', '博彩', '暴力'];
const inputs = [
  '帮我查询订单什么时候发货',
  '这个游戏怎么通关',
  '有没有稳赚的博彩平台推荐',
];
for (const t of inputs) {
  const hit = blocked.some((w) => t.includes(w));
  console.log(hit ? 'BLOCKED' : 'OK');
}
`,
      },
    },
    hints: [
      '遍历输入：`for (const t of inputs)`；判断：`blocked.some((w) => t.includes(w))` 返回布尔值。',
      '注意方向：some 检查"词表里是否有词出现在输入里"，别写成 `t.includes(w)` 的反向遍历。',
      '输出用三目运算符最简洁：`console.log(hit ? "BLOCKED" : "OK")`，大小写必须一致。',
    ],
    tests: [
      { name: '样例：三过安检', stdin: '', expected: 'OK\nOK\nBLOCKED' },
      { name: '检查：命中判定', stdin: '', expected: 'OK\nOK\nBLOCKED' },
      { name: '检查：放行判定', stdin: '', expected: 'OK\nOK\nBLOCKED' },
      { name: '隐藏：逐字符比对', stdin: '', expected: 'OK\nOK\nBLOCKED', hidden: true },
    ],
  },
  {
    id: 'agentdev-best-3',
    lang: 'agentdev',
    module: 'best',
    order: 3,
    title: '输出格式护栏',
    difficulty: 3,
    xp: 25,
    goals: [
      '理解"模型输出永远当不可信输入对待"的护栏原则',
      '会用 try/catch 捕获 JSON.parse 失败并降级',
      '掌握兜底值输出的规范格式',
    ],
    brief: `## 输出护栏：不信模型，信校验

结构化输出很方便，但模型偶尔会"交白卷"：少个括号、多了句解释、被截断 —— \`JSON.parse\` 一抛异常，整个服务就挂了。**输出护栏**的原则是：**模型的输出永远当不可信输入对待**：

1. \`try\` 解析模型返回的 JSON；
2. **失败**：打印 \`PARSE_ERROR\`，走兜底值（默认对象 / 重试 / 转人工），绝不让异常裸奔；
3. **成功**也别全信 —— 再校验字段类型与取值范围（如 price 必须是非负数）。

类比：收快递**先验货再签收** —— 盒子破了（解析失败）就拒收走理赔，而不是硬拆。

> 💡 真实系统还会配"重试 + 修复"：把报错回传给模型重试，超次数才降级兜底。`,
    task: `## 任务：接住一次解析失败

Mock 第 1 轮会返回一段**不完整**的 JSON（模拟模型输出被截断）：\`{"name":"机械键盘","price":\`。

1. 发送 user 消息 \`'提取商品信息，JSON 输出'\`，调用 \`llm.chat\`；
2. 用 \`try { JSON.parse(res.content) } catch (e) { ... }\` 尝试解析；
3. **解析失败**时输出两行：
   - 第 1 行：\`PARSE_ERROR\`
   - 第 2 行：兜底值 \`商品: 未知, 价格: 0\`
4. 解析成功则输出 \`商品: <name>, 价格: <price>\`（本关不会走到这一步）。

**输入**：无

**输出**：两行

\`\`\`text
PARSE_ERROR
商品: 未知, 价格: 0
\`\`\``,
    starter: `// llm 已注入。第 1 轮回复是一段不完整的 JSON（模拟输出被截断）。
// 护栏原则：JSON.parse 放进 try，失败走兜底，绝不让异常裸奔。

// TODO 1: 组装 messages（user: '提取商品信息，JSON 输出'）并调用 llm.chat
// TODO 2: try JSON.parse(res.content)
// TODO 3: 失败输出 PARSE_ERROR 与兜底值 '商品: 未知, 价格: 0'
// TODO 4: 成功输出 '商品: <name>, 价格: <price>'

`,
    solution: `const messages = [{ role: 'user', content: '提取商品信息，JSON 输出' }];
const res = llm.chat(messages);
try {
  const data = JSON.parse(res.content);
  console.log('商品: ' + data.name + ', 价格: ' + data.price);
} catch (e) {
  console.log('PARSE_ERROR');
  console.log('商品: 未知, 价格: 0');
}
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。第 1 轮回复是一段不完整的 JSON（模拟输出被截断）。
// 护栏原则：JSON.parse 放进 try，失败走兜底，绝不让异常裸奔。

// TODO 1: 组装 messages（user: '提取商品信息，JSON 输出'）并调用 llm.chat
// TODO 2: try JSON.parse(res.content)
// TODO 3: 失败输出 PARSE_ERROR 与兜底值 '商品: 未知, 价格: 0'
// TODO 4: 成功输出 '商品: <name>, 价格: <price>'

`,
      },
      solutions: {
        javascript: `const messages = [{ role: 'user', content: '提取商品信息，JSON 输出' }];
const res = llm.chat(messages);
try {
  const data = JSON.parse(res.content);
  console.log('商品: ' + data.name + ', 价格: ' + data.price);
} catch (e) {
  console.log('PARSE_ERROR');
  console.log('商品: 未知, 价格: 0');
}
`,
      },
    },
    hints: [
      '语法骨架：`try { ... } catch (e) { ... }` —— JSON.parse 抛异常时直接跳进 catch，不会中断程序。',
      'catch 里按顺序两行输出：`console.log("PARSE_ERROR")` 和 `console.log("商品: 未知, 价格: 0")`。',
      'try 块里的成功分支本关不会执行，但也要写完整：`"商品: " + data.name + ", 价格: " + data.price`。',
    ],
    tests: [
      { name: '样例：解析失败兜底', stdin: '', expected: 'PARSE_ERROR\n商品: 未知, 价格: 0' },
      { name: '检查：异常捕获', stdin: '', expected: 'PARSE_ERROR\n商品: 未知, 价格: 0' },
      { name: '检查：兜底值格式', stdin: '', expected: 'PARSE_ERROR\n商品: 未知, 价格: 0' },
      { name: '隐藏：逐字符比对', stdin: '', expected: 'PARSE_ERROR\n商品: 未知, 价格: 0', hidden: true },
    ],
    runtime: JSON.stringify({ turns: [{ content: '{"name":"机械键盘","price":' }] }),
  },
  {
    id: 'agentdev-best-4',
    lang: 'agentdev',
    module: 'best',
    order: 4,
    title: '综合：客服 Agent',
    difficulty: 5,
    xp: 45,
    goals: [
      '综合运用：提示词设计 + 工具注册 + Agent Loop + 结果回填',
      '实现查订单 → 发起退款 → 交付最终回复的完整流程',
      '让每一步动作可追溯：打印每次工具调用与结果',
    ],
    brief: `## 压轴实战：一个能真办事的客服 Agent

把全课程的知识拧成一股绳：system 提示词定职责、工具注册与调用、Agent Loop 循环、消息历史回填、兜底意识 —— 骨架是 **chat → queryOrder → 回填 → chat → refund → 回填 → chat → 最终回复**。

注意每一步的打印：**动作可追溯**是客服 Agent 的底线 —— 出了纠纷，日志能还原"模型当时看到了什么、做了什么"。

类比：**老练的客服坐席** —— 先查订单确认问题，再办退款，最后一句话说清结果，全程有工单记录。

> 💡 完成本关，你已拥有把 Mock 换成真实 API（只换 \`llm\` 实现）就能跑的 Agent 雏形。`,
    task: `## 任务：实现完整客服 Agent Loop（本课程压轴关）

Mock 配置三轮：第 1 轮请求调用 \`queryOrder\`（查订单），第 2 轮请求调用 \`refund\`（发起退款），第 3 轮给出最终回复。

1. 注册两个工具：
   - \`queryOrder: (args) => '订单 ' + args.orderId + '：机械键盘 x1，已签收，金额 399 元'\`
   - \`refund: (args) => '订单 ' + args.orderId + ' 退款申请已提交，预计 1-3 个工作日到账'\`
2. 发送 user 消息 \`'我的订单 A1024 键盘坏了，我要退款'\`，进入循环（最多 5 轮）；
3. 每轮 chat 后：若无 toolCalls，输出 \`客服: <content>\` 并 break；
4. 有 toolCalls 时，对每个调用执行工具并输出一行：\`[<name>] <工具结果>\`，把结果以 tool 消息回填。

**输入**：无

**输出**：三行

\`\`\`text
[queryOrder] 订单 A1024：机械键盘 x1，已签收，金额 399 元
[refund] 订单 A1024 退款申请已提交，预计 1-3 个工作日到账
客服: 已为您提交订单 A1024 的退款申请，预计 1-3 个工作日原路退回 399 元，请注意查收。
\`\`\``,
    starter: `// llm 已注入。配置：第 1 轮 queryOrder，第 2 轮 refund，第 3 轮最终回复。
// 这是全课程综合关：工具注册 + Agent Loop + 结果回填 + 可追溯日志。

// TODO 1: 注册工具 queryOrder 与 refund（模板见任务描述）
// TODO 2: 组装 messages（user: '我的订单 A1024 键盘坏了，我要退款'）
// TODO 3: 实现循环（最多 5 轮）：无 toolCalls 输出 '客服: <content>' 并 break
// TODO 4: 有 toolCalls 时执行并输出 '[<name>] <结果>'，回填 tool 消息

`,
    solution: `const tools = {
  queryOrder: (args) => '订单 ' + args.orderId + '：机械键盘 x1，已签收，金额 399 元',
  refund: (args) => '订单 ' + args.orderId + ' 退款申请已提交，预计 1-3 个工作日到账',
};
const messages = [{ role: 'user', content: '我的订单 A1024 键盘坏了，我要退款' }];
for (let step = 1; step <= 5; step++) {
  const res = llm.chat(messages);
  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log('客服: ' + res.content);
    break;
  }
  for (const call of res.toolCalls) {
    const result = tools[call.name](call.args);
    console.log('[' + call.name + '] ' + result);
    messages.push({ role: 'tool', name: call.name, content: result });
  }
}
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。配置：第 1 轮 queryOrder，第 2 轮 refund，第 3 轮最终回复。
// 这是全课程综合关：工具注册 + Agent Loop + 结果回填 + 可追溯日志。

// TODO 1: 注册工具 queryOrder 与 refund（模板见任务描述）
// TODO 2: 组装 messages（user: '我的订单 A1024 键盘坏了，我要退款'）
// TODO 3: 实现循环（最多 5 轮）：无 toolCalls 输出 '客服: <content>' 并 break
// TODO 4: 有 toolCalls 时执行并输出 '[<name>] <结果>'，回填 tool 消息

`,
      },
      solutions: {
        javascript: `const tools = {
  queryOrder: (args) => '订单 ' + args.orderId + '：机械键盘 x1，已签收，金额 399 元',
  refund: (args) => '订单 ' + args.orderId + ' 退款申请已提交，预计 1-3 个工作日到账',
};
const messages = [{ role: 'user', content: '我的订单 A1024 键盘坏了，我要退款' }];
for (let step = 1; step <= 5; step++) {
  const res = llm.chat(messages);
  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log('客服: ' + res.content);
    break;
  }
  for (const call of res.toolCalls) {
    const result = tools[call.name](call.args);
    console.log('[' + call.name + '] ' + result);
    messages.push({ role: 'tool', name: call.name, content: result });
  }
}
`,
      },
    },
    hints: [
      '这就是 advanced-2 Agent Loop 的加强版：循环骨架完全一致，只是工具是真实业务函数，结果从 args 里取值拼接。',
      '工具结果行：`"[" + call.name + "] " + result`，方括号内是工具名，后跟一个空格接结果。',
      '最终回复行：`"客服: " + res.content` —— 注意 Mock 第 3 轮的 content 就是以"已为您提交"开头的完整话术，原样输出。',
    ],
    tests: [
      { name: '样例：完整客服流程', stdin: '', expected: '[queryOrder] 订单 A1024：机械键盘 x1，已签收，金额 399 元\n[refund] 订单 A1024 退款申请已提交，预计 1-3 个工作日到账\n客服: 已为您提交订单 A1024 的退款申请，预计 1-3 个工作日原路退回 399 元，请注意查收。' },
      { name: '检查：两步工具调用', stdin: '', expected: '[queryOrder] 订单 A1024：机械键盘 x1，已签收，金额 399 元\n[refund] 订单 A1024 退款申请已提交，预计 1-3 个工作日到账\n客服: 已为您提交订单 A1024 的退款申请，预计 1-3 个工作日原路退回 399 元，请注意查收。' },
      { name: '检查：最终话术', stdin: '', expected: '[queryOrder] 订单 A1024：机械键盘 x1，已签收，金额 399 元\n[refund] 订单 A1024 退款申请已提交，预计 1-3 个工作日到账\n客服: 已为您提交订单 A1024 的退款申请，预计 1-3 个工作日原路退回 399 元，请注意查收。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '[queryOrder] 订单 A1024：机械键盘 x1，已签收，金额 399 元\n[refund] 订单 A1024 退款申请已提交，预计 1-3 个工作日到账\n客服: 已为您提交订单 A1024 的退款申请，预计 1-3 个工作日原路退回 399 元，请注意查收。', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { toolCalls: [{ name: 'queryOrder', args: { orderId: 'A1024' } }] },
        { toolCalls: [{ name: 'refund', args: { orderId: 'A1024', reason: '商品破损' } }] },
        { content: '已为您提交订单 A1024 的退款申请，预计 1-3 个工作日原路退回 399 元，请注意查收。' },
      ],
    }),
  },
];
