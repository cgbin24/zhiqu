import type { Level } from '@/types';

/** Agent 课程 · 第六章：综合实战（integration，4 关） */
export const AGENTDEV_INTEGRATION: Level[] = [
  {
    id: 'agentdev-integration-1',
    lang: 'agentdev',
    module: 'integration',
    order: 1,
    title: '代码审查 Agent',
    difficulty: 4,
    xp: 35,
    goals: [
      '综合运用：Agent Loop + 工具接力 + 参数回传',
      '实现"读取代码 → 检测问题 → 输出建议"的审查流水线',
      '让检测工具消费上游工具的产出：代码原文作为参数流转',
    ],
    brief: `## 代码审查 Agent：让工具像接力棒一样传递数据

真实任务往往要**串起多个工具**：先读代码，再把内容交给检测器，最后由模型汇总建议。本关把三步装进 Agent Loop：

1. 模型第 1 轮请求 \`readCode\` —— 你执行后把**代码原文**回填为 tool 消息；
2. 模型从历史里"抄"出代码，第 2 轮请求 \`lint\` 并**把代码作为参数传回** —— 检测函数拿到真实输入；
3. 第 3 轮模型基于检测结果给出审查建议。

类比：**先复印再批注** —— 校对（lint）必须拿到复印件（代码）才能圈点，而复印件正是上一棒递来的。

> 💡 本关的 lint 是**真检测**：在工具函数里判断 var 与空格，不是背台词。`,
    task: `## 任务：实现"读取 → 检测 → 建议"的审查流程

Mock 配置三轮：第 1 轮请求调用 \`readCode\`，第 2 轮请求调用 \`lint\`（**参数里带回**第 1 轮读到的代码），第 3 轮给出审查建议。

1. 注册两个工具（lint 是真检测）：
   - \`readCode: (args) => 'var total = price*count'\`
   - \`lint: (args) => { ... }\` 函数体：建 \`issues\` 数组，两条规则 ——
     - \`args.code.indexOf('var ') !== -1\` → push \`'用 var 声明'\`
     - 含 \`'*'\` 但不含 \`' * '\` → push \`'运算符两侧缺空格'\`
     - 返回 \`'发现 ' + issues.length + ' 处问题：' + issues.join('；')\`
2. 发送 user 消息 \`'请审查 math.js 的代码质量'\`，进入循环（最多 5 轮）；
3. 有 toolCalls：逐个执行，输出 \`[<name>] <结果>\`，结果回填为 tool 消息；
4. 无 toolCalls：输出 \`审查建议: <content>\` 并结束。

**输入**：无

**输出**：三行

\`\`\`text
[readCode] var total = price*count
[lint] 发现 2 处问题：用 var 声明；运算符两侧缺空格
审查建议: 将 var 改为 let，并给乘号两侧补空格：let total = price * count;
\`\`\``,
    starter: `// llm 已注入。配置：第 1 轮 readCode，第 2 轮 lint（args 里带回了读到的代码），第 3 轮审查建议。
// 看点：lint 是真检测 —— 在工具函数里对 args.code 做字符串判断，不是背台词。

// TODO 1: 注册 readCode，返回 'var total = price*count'
// TODO 2: 注册 lint：含 'var ' 则 push '用 var 声明'；含 '*' 但不含 ' * ' 则 push '运算符两侧缺空格'
// TODO 3: lint 返回 '发现 <n> 处问题：' + issues.join('；')
// TODO 4: Agent Loop（最多 5 轮）：工具行输出 '[<name>] <结果>'，最终行输出 '审查建议: <content>'

`,
    solution: `const tools = {
  readCode: (args) => 'var total = price*count',
  lint: (args) => {
    const issues = [];
    if (args.code.indexOf('var ') !== -1) issues.push('用 var 声明');
    if (args.code.indexOf('*') !== -1 && args.code.indexOf(' * ') === -1) issues.push('运算符两侧缺空格');
    return '发现 ' + issues.length + ' 处问题：' + issues.join('；');
  },
};
const messages = [{ role: 'user', content: '请审查 math.js 的代码质量' }];
for (let step = 1; step <= 5; step++) {
  const res = llm.chat(messages);
  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log('审查建议: ' + res.content);
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
        javascript: `// llm 已注入。配置：第 1 轮 readCode，第 2 轮 lint（args 里带回了读到的代码），第 3 轮审查建议。
// 看点：lint 是真检测 —— 在工具函数里对 args.code 做字符串判断，不是背台词。

// TODO 1: 注册 readCode，返回 'var total = price*count'
// TODO 2: 注册 lint：含 'var ' 则 push '用 var 声明'；含 '*' 但不含 ' * ' 则 push '运算符两侧缺空格'
// TODO 3: lint 返回 '发现 <n> 处问题：' + issues.join('；')
// TODO 4: Agent Loop（最多 5 轮）：工具行输出 '[<name>] <结果>'，最终行输出 '审查建议: <content>'

`,
      },
      solutions: {
        javascript: `const tools = {
  readCode: (args) => 'var total = price*count',
  lint: (args) => {
    const issues = [];
    if (args.code.indexOf('var ') !== -1) issues.push('用 var 声明');
    if (args.code.indexOf('*') !== -1 && args.code.indexOf(' * ') === -1) issues.push('运算符两侧缺空格');
    return '发现 ' + issues.length + ' 处问题：' + issues.join('；');
  },
};
const messages = [{ role: 'user', content: '请审查 math.js 的代码质量' }];
for (let step = 1; step <= 5; step++) {
  const res = llm.chat(messages);
  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log('审查建议: ' + res.content);
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
      'lint 这次是真的在检测：`if (args.code.indexOf("var ") !== -1) issues.push("用 var 声明")`，两条规则各自 push 一条。',
      '缺空格的判断：代码里有 `*` 但没有 `" * "` —— `args.code.indexOf("*") !== -1 && args.code.indexOf(" * ") === -1`。',
      '拼接返回：`"发现 " + issues.length + " 处问题：" + issues.join("；")`；外层循环骨架与 advanced-2 的 Agent Loop 完全一致。',
    ],
    tests: [
      { name: '样例：读码 → 检测 → 建议', stdin: '', expected: '[readCode] var total = price*count\n[lint] 发现 2 处问题：用 var 声明；运算符两侧缺空格\n审查建议: 将 var 改为 let，并给乘号两侧补空格：let total = price * count;' },
      { name: '检查：代码参数回传', stdin: '', expected: '[readCode] var total = price*count\n[lint] 发现 2 处问题：用 var 声明；运算符两侧缺空格\n审查建议: 将 var 改为 let，并给乘号两侧补空格：let total = price * count;' },
      { name: '检查：lint 真检测', stdin: '', expected: '[readCode] var total = price*count\n[lint] 发现 2 处问题：用 var 声明；运算符两侧缺空格\n审查建议: 将 var 改为 let，并给乘号两侧补空格：let total = price * count;' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '[readCode] var total = price*count\n[lint] 发现 2 处问题：用 var 声明；运算符两侧缺空格\n审查建议: 将 var 改为 let，并给乘号两侧补空格：let total = price * count;', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { toolCalls: [{ name: 'readCode', args: { file: 'math.js' } }] },
        { toolCalls: [{ name: 'lint', args: { code: 'var total = price*count' } }] },
        { content: '将 var 改为 let，并给乘号两侧补空格：let total = price * count;' },
      ],
    }),
  },
  {
    id: 'agentdev-integration-2',
    lang: 'agentdev',
    module: 'integration',
    order: 2,
    title: '文档生成 Agent',
    difficulty: 4,
    xp: 35,
    goals: [
      '综合运用：RAG 检索 + 两轮生成流水线',
      '用 retrieve 取 Top-2 资料并拼接为上下文',
      '实现"检索 → 生成摘要 → 整理成文档条目"的流水线',
    ],
    brief: `## 文档生成 Agent：先找资料，再动笔，最后排版

写文档最忌凭空编造。本关把 RAG 与多轮生成串成流水线：**检索 → 摘要 → 成稿**：

1. \`retrieve(docs, query, 2)\` 取最相关的 2 篇资料，拼进 user 消息（RAG 的老三样）；
2. 第 1 轮 chat 依据资料产出**摘要**；
3. 摘要回填为 assistant 消息，追加"整理成文档条目"的指令，第 2 轮 chat 产出**成稿**。

摘要与成稿拆两轮：先保证内容对（只依据资料），再管格式好（整理条目）。

类比：**先打草稿再誊写** —— 草稿对着资料写，誊写只管卷面工整。

> 💡 上一步的输出就是下一步的输入 —— 与多智能体流水线同构，只是这里只有一个模型。`,
    task: `## 任务：检索资料并两轮生成 API 文档

4 篇数组方法文档已内置。Mock 两轮：第 1 轮返回摘要，第 2 轮返回成稿。

1. 调用 \`retrieve(docs, '数组 filter 方法怎么用', 2)\`，先输出一行：\`检索到: <标题1>、<标题2>\`（标题用 \`、\` 连接）；
2. 组装 messages：system \`'你是文档生成Agent，只依据资料生成 API 文档摘要。'\`；user \`'为 filter 生成摘要。\\n资料：'\` + 资料块（每篇 \`【标题】正文\`，块内用 \`\\n\` 连接）；
3. 第 1 次 chat，输出 \`摘要: <content>\`；把回复回填为 assistant 消息，再追加 user \`'把摘要整理成一条 API 文档条目。'\`；
4. 第 2 次 chat，输出 \`文档: <content>\`。

**输入**：无

**输出**：三行

\`\`\`text
检索到: filter 方法、map 方法
摘要: filter：按条件过滤数组，返回新数组，原数组不变。
文档: filter(callback) — 按条件过滤数组并返回新数组。
\`\`\``,
    starter: `// llm 与 retrieve 均已注入。配置：第 1 轮返回摘要，第 2 轮返回成稿。
// 流水线：检索 → 拼资料 → 生成摘要 → 回填 → 整理成文档条目。

const docs = [
  { title: 'filter 方法', text: 'filter 按条件过滤数组，返回由满足条件的元素组成的新数组，原数组不变。' },
  { title: 'map 方法', text: 'map 对数组的每个元素执行函数，返回由结果组成的新数组。' },
  { title: 'reduce 方法', text: 'reduce 对数组元素做累积计算，最终得到一个值。' },
  { title: 'forEach 方法', text: 'forEach 对数组的每个元素执行一次函数，没有返回值。' },
];

// TODO 1: retrieve(docs, '数组 filter 方法怎么用', 2)，输出 '检索到: <标题1>、<标题2>'
// TODO 2: 拼资料块（'【' + title + '】' + text，用 '\\n' 连接），组装 system + user 消息
// TODO 3: 第 1 次 chat 输出 '摘要: <content>'，回填 assistant 后追加 user '把摘要整理成一条 API 文档条目。'
// TODO 4: 第 2 次 chat 输出 '文档: <content>'

`,
    solution: `const docs = [
  { title: 'filter 方法', text: 'filter 按条件过滤数组，返回由满足条件的元素组成的新数组，原数组不变。' },
  { title: 'map 方法', text: 'map 对数组的每个元素执行函数，返回由结果组成的新数组。' },
  { title: 'reduce 方法', text: 'reduce 对数组元素做累积计算，最终得到一个值。' },
  { title: 'forEach 方法', text: 'forEach 对数组的每个元素执行一次函数，没有返回值。' },
];
const hits = retrieve(docs, '数组 filter 方法怎么用', 2);
console.log('检索到: ' + hits.map((d) => d.title).join('、'));
const context = hits.map((d) => '【' + d.title + '】' + d.text).join('\\n');
const messages = [
  { role: 'system', content: '你是文档生成Agent，只依据资料生成 API 文档摘要。' },
  { role: 'user', content: '为 filter 生成摘要。\\n资料：' + context },
];
const r1 = llm.chat(messages);
console.log('摘要: ' + r1.content);
messages.push({ role: 'assistant', content: r1.content });
messages.push({ role: 'user', content: '把摘要整理成一条 API 文档条目。' });
const r2 = llm.chat(messages);
console.log('文档: ' + r2.content);
`,
    algo: {
      starters: {
        javascript: `// llm 与 retrieve 均已注入。配置：第 1 轮返回摘要，第 2 轮返回成稿。
// 流水线：检索 → 拼资料 → 生成摘要 → 回填 → 整理成文档条目。

const docs = [
  { title: 'filter 方法', text: 'filter 按条件过滤数组，返回由满足条件的元素组成的新数组，原数组不变。' },
  { title: 'map 方法', text: 'map 对数组的每个元素执行函数，返回由结果组成的新数组。' },
  { title: 'reduce 方法', text: 'reduce 对数组元素做累积计算，最终得到一个值。' },
  { title: 'forEach 方法', text: 'forEach 对数组的每个元素执行一次函数，没有返回值。' },
];

// TODO 1: retrieve(docs, '数组 filter 方法怎么用', 2)，输出 '检索到: <标题1>、<标题2>'
// TODO 2: 拼资料块（'【' + title + '】' + text，用 '\\n' 连接），组装 system + user 消息
// TODO 3: 第 1 次 chat 输出 '摘要: <content>'，回填 assistant 后追加 user '把摘要整理成一条 API 文档条目。'
// TODO 4: 第 2 次 chat 输出 '文档: <content>'

`,
      },
      solutions: {
        javascript: `const docs = [
  { title: 'filter 方法', text: 'filter 按条件过滤数组，返回由满足条件的元素组成的新数组，原数组不变。' },
  { title: 'map 方法', text: 'map 对数组的每个元素执行函数，返回由结果组成的新数组。' },
  { title: 'reduce 方法', text: 'reduce 对数组元素做累积计算，最终得到一个值。' },
  { title: 'forEach 方法', text: 'forEach 对数组的每个元素执行一次函数，没有返回值。' },
];
const hits = retrieve(docs, '数组 filter 方法怎么用', 2);
console.log('检索到: ' + hits.map((d) => d.title).join('、'));
const context = hits.map((d) => '【' + d.title + '】' + d.text).join('\\n');
const messages = [
  { role: 'system', content: '你是文档生成Agent，只依据资料生成 API 文档摘要。' },
  { role: 'user', content: '为 filter 生成摘要。\\n资料：' + context },
];
const r1 = llm.chat(messages);
console.log('摘要: ' + r1.content);
messages.push({ role: 'assistant', content: r1.content });
messages.push({ role: 'user', content: '把摘要整理成一条 API 文档条目。' });
const r2 = llm.chat(messages);
console.log('文档: ' + r2.content);
`,
      },
    },
    hints: [
      '先检索：`const hits = retrieve(docs, "数组 filter 方法怎么用", 2)`，标题行用 `hits.map((d) => d.title).join("、")`。',
      '资料块与 tips-4 相同：`hits.map((d) => "【" + d.title + "】" + d.text).join("\\n")`，拼在 user 消息的 `"\\n资料："` 之后。',
      '两轮生成之间别忘了回填：push assistant 摘要，再 push user 指令，第二次 chat 的结果才是成稿。',
    ],
    tests: [
      { name: '样例：检索 + 两轮生成', stdin: '', expected: '检索到: filter 方法、map 方法\n摘要: filter：按条件过滤数组，返回新数组，原数组不变。\n文档: filter(callback) — 按条件过滤数组并返回新数组。' },
      { name: '检查：Top-2 检索', stdin: '', expected: '检索到: filter 方法、map 方法\n摘要: filter：按条件过滤数组，返回新数组，原数组不变。\n文档: filter(callback) — 按条件过滤数组并返回新数组。' },
      { name: '检查：摘要回填', stdin: '', expected: '检索到: filter 方法、map 方法\n摘要: filter：按条件过滤数组，返回新数组，原数组不变。\n文档: filter(callback) — 按条件过滤数组并返回新数组。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '检索到: filter 方法、map 方法\n摘要: filter：按条件过滤数组，返回新数组，原数组不变。\n文档: filter(callback) — 按条件过滤数组并返回新数组。', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { content: 'filter：按条件过滤数组，返回新数组，原数组不变。' },
        { content: 'filter(callback) — 按条件过滤数组并返回新数组。' },
      ],
    }),
  },
  {
    id: 'agentdev-integration-3',
    lang: 'agentdev',
    module: 'integration',
    order: 3,
    title: '数据管道 Agent',
    difficulty: 4,
    xp: 35,
    goals: [
      '综合运用：结构化输出 + JSON 解析 + 数据变换',
      '实践"LLM 规划、代码执行"：模型出 JSON 计划，代码按序执行',
      '实现清洗（trim/去空）→ 转换（小写）→ 报告的三步管道',
    ],
    brief: `## 数据管道 Agent：模型出计划，代码来干活

让模型直接处理批量数据又贵又不可靠。更聪明的分工：模型只输出**计划**（JSON），数据变换交给**确定性代码**执行：

1. 第 1 轮 chat：模型返回 JSON 清洗计划（steps 数组）；
2. \`JSON.parse\` 解析出步骤，代码按序执行 trim → dropEmpty → lowercase；
3. 第 2 轮 chat：回报结果，生成总结报告。

这就是"**LLM 规划 + 代码执行**"：模型负责决策，代码负责精确可复现。

类比：**医生开处方，药房按方抓药** —— 医生（模型）不亲自数药片，抓药（代码）一粒都不能错。

> 💡 模型输出仍不可信，解析要配 try/catch 兜底（见 best-3）。`,
    task: `## 任务：执行一条"计划驱动"的数据管道

原始数据（内置）：\`[' Alice ', '', 'BOB', ' charlie ']\`。Mock 两轮：第 1 轮返回 JSON 清洗计划，第 2 轮返回报告。

1. 发送 user 消息 \`'4 条原始数据待清洗，请给出 JSON 清洗计划'\`，调用 \`llm.chat\`；
2. \`JSON.parse(res.content).steps\` 取出步骤数组，输出 \`清洗计划: <步骤用 ' → ' 连接>\`；
3. \`let data = raw\` 起步，**按计划顺序**逐个执行：
   - \`trim\`：\`data = data.map((s) => s.trim())\`
   - \`dropEmpty\`：\`data = data.filter((s) => s.length > 0)\`
   - \`lowercase\`：\`data = data.map((s) => s.toLowerCase())\`
   每步执行后输出一行 \`执行 <step> 后: <data.join(',')>\`；
4. 再次 chat（user 消息 \`'管道执行完毕，请给出报告'\`），输出 \`报告: <content>\`。

**输入**：无

**输出**：五行

\`\`\`text
清洗计划: trim → dropEmpty → lowercase
执行 trim 后: Alice,,BOB,charlie
执行 dropEmpty 后: Alice,BOB,charlie
执行 lowercase 后: alice,bob,charlie
报告: 清洗完成：4 条原始记录 → 3 条有效记录，已全部标准化为小写。
\`\`\``,
    starter: `// llm 已注入。配置：第 1 轮返回 JSON 清洗计划，第 2 轮返回报告。
// 模式：LLM 规划（出 JSON 计划），代码执行（确定性变换）。

const raw = [' Alice ', '', 'BOB', ' charlie '];

// TODO 1: 第一次 llm.chat，JSON.parse(res.content).steps 取出计划，输出 '清洗计划: ' + plan.join(' → ')
// TODO 2: let data = raw 起步，按计划顺序执行 trim / dropEmpty / lowercase 三个 if 分支
// TODO 3: 每步执行后输出 '执行 <step> 后: ' + data.join(',')
// TODO 4: 第二次 llm.chat（user: '管道执行完毕，请给出报告'），输出 '报告: <content>'

`,
    solution: `const raw = [' Alice ', '', 'BOB', ' charlie '];
const r1 = llm.chat([{ role: 'user', content: '4 条原始数据待清洗，请给出 JSON 清洗计划' }]);
const plan = JSON.parse(r1.content).steps;
console.log('清洗计划: ' + plan.join(' → '));
let data = raw;
for (const step of plan) {
  if (step === 'trim') data = data.map((s) => s.trim());
  if (step === 'dropEmpty') data = data.filter((s) => s.length > 0);
  if (step === 'lowercase') data = data.map((s) => s.toLowerCase());
  console.log('执行 ' + step + ' 后: ' + data.join(','));
}
const r2 = llm.chat([{ role: 'user', content: '管道执行完毕，请给出报告' }]);
console.log('报告: ' + r2.content);
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。配置：第 1 轮返回 JSON 清洗计划，第 2 轮返回报告。
// 模式：LLM 规划（出 JSON 计划），代码执行（确定性变换）。

const raw = [' Alice ', '', 'BOB', ' charlie '];

// TODO 1: 第一次 llm.chat，JSON.parse(res.content).steps 取出计划，输出 '清洗计划: ' + plan.join(' → ')
// TODO 2: let data = raw 起步，按计划顺序执行 trim / dropEmpty / lowercase 三个 if 分支
// TODO 3: 每步执行后输出 '执行 <step> 后: ' + data.join(',')
// TODO 4: 第二次 llm.chat（user: '管道执行完毕，请给出报告'），输出 '报告: <content>'

`,
      },
      solutions: {
        javascript: `const raw = [' Alice ', '', 'BOB', ' charlie '];
const r1 = llm.chat([{ role: 'user', content: '4 条原始数据待清洗，请给出 JSON 清洗计划' }]);
const plan = JSON.parse(r1.content).steps;
console.log('清洗计划: ' + plan.join(' → '));
let data = raw;
for (const step of plan) {
  if (step === 'trim') data = data.map((s) => s.trim());
  if (step === 'dropEmpty') data = data.filter((s) => s.length > 0);
  if (step === 'lowercase') data = data.map((s) => s.toLowerCase());
  console.log('执行 ' + step + ' 后: ' + data.join(','));
}
const r2 = llm.chat([{ role: 'user', content: '管道执行完毕，请给出报告' }]);
console.log('报告: ' + r2.content);
`,
      },
    },
    hints: [
      '解析计划：`const plan = JSON.parse(r1.content).steps`，输出用 `plan.join(" → ")`（箭头两侧有空格）。',
      '三个步骤就是三个 if：trim 用 `s.trim()`，dropEmpty 用 `filter((s) => s.length > 0)`，lowercase 用 `s.toLowerCase()`。',
      '每步打印 `data.join(",")` —— 逗号后无空格；trim 后的空串会显示为连续两个逗号，正好让你看见 dropEmpty 干了什么。',
    ],
    tests: [
      { name: '样例：计划驱动的管道', stdin: '', expected: '清洗计划: trim → dropEmpty → lowercase\n执行 trim 后: Alice,,BOB,charlie\n执行 dropEmpty 后: Alice,BOB,charlie\n执行 lowercase 后: alice,bob,charlie\n报告: 清洗完成：4 条原始记录 → 3 条有效记录，已全部标准化为小写。' },
      { name: '检查：JSON 计划解析', stdin: '', expected: '清洗计划: trim → dropEmpty → lowercase\n执行 trim 后: Alice,,BOB,charlie\n执行 dropEmpty 后: Alice,BOB,charlie\n执行 lowercase 后: alice,bob,charlie\n报告: 清洗完成：4 条原始记录 → 3 条有效记录，已全部标准化为小写。' },
      { name: '检查：三步变换结果', stdin: '', expected: '清洗计划: trim → dropEmpty → lowercase\n执行 trim 后: Alice,,BOB,charlie\n执行 dropEmpty 后: Alice,BOB,charlie\n执行 lowercase 后: alice,bob,charlie\n报告: 清洗完成：4 条原始记录 → 3 条有效记录，已全部标准化为小写。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '清洗计划: trim → dropEmpty → lowercase\n执行 trim 后: Alice,,BOB,charlie\n执行 dropEmpty 后: Alice,BOB,charlie\n执行 lowercase 后: alice,bob,charlie\n报告: 清洗完成：4 条原始记录 → 3 条有效记录，已全部标准化为小写。', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { content: '{"steps":["trim","dropEmpty","lowercase"]}' },
        { content: '清洗完成：4 条原始记录 → 3 条有效记录，已全部标准化为小写。' },
      ],
    }),
  },
  {
    id: 'agentdev-integration-4',
    lang: 'agentdev',
    module: 'integration',
    order: 4,
    title: '对话式 BI Agent',
    difficulty: 5,
    xp: 45,
    goals: [
      '综合运用：自然语言 → 结构化查询 → 真实计算 → 格式化输出',
      '让工具做真实计算（reduce 求和、拼报表行），而非返回写死文本',
      '实现"查询 → 格式化 → 解读"三段式 ChatBI 流程',
    ],
    brief: `## 对话式 BI：把"问数据"变成一句话

对话式 BI（ChatBI）的门槛在于：用户说的是"帮我看看第四季度卖得怎么样"，数据库只听得懂结构化查询。Agent 在中间做**翻译与编排**：

1. 模型把自然语言**翻译成结构化参数**（\`{ quarter: 'Q4' }\`），请求调用 \`queryData\`；
2. 工具执行**真实计算** —— reduce 求和、拼接明细，而不是返回背好的台词；
3. 模型再请求 \`format\` 把数据格式化成报表行，最后一轮给出**解读**。

类比：**点菜不进后厨** —— 你（用户）说人话，服务员（模型）翻译成菜单编号，厨师（工具）照单做菜。

> 💡 数据一变，同一套 Agent 不用改一行代码 —— 这就是"工具真计算"的价值。`,
    task: `## 任务：实现"查询 → 格式化 → 解读"的 BI 流程

数据（内置）：\`const sales = { '10月': 12000, '11月': 14500, '12月': 15800 }\`。Mock 三轮：第 1 轮请求 \`queryData\`，第 2 轮请求 \`format\`，第 3 轮给出解读。

1. 预先算出合计：\`const total = Object.values(sales).reduce((a, b) => a + b, 0)\`；
2. 注册两个工具（都基于真数据）：
   - \`queryData: (args) => '查询完成：' + args.quarter + ' 合计 ' + total + ' 元（' + Object.keys(sales).length + ' 个月）'\`
   - \`format: (args) =>\` 每个月拼 \`'<月份> <销售额> 元'\`，用 \`' | '\` 连接，末尾再接 \`' | 合计 ' + total + ' 元'\`
3. 发送 user 消息 \`'帮我看看第四季度每个月的销售额'\`，进入循环（最多 5 轮）；
4. 工具行输出 \`[<name>] <结果>\` 并回填 tool 消息；最终行输出 \`BI: <content>\`。

**输入**：无

**输出**：三行

\`\`\`text
[queryData] 查询完成：Q4 合计 42300 元（3 个月）
[format] 10月 12000 元 | 11月 14500 元 | 12月 15800 元 | 合计 42300 元
BI: 第四季度（Q4）销售额合计 42300 元，12 月最高（15800 元），建议关注增长势头。
\`\`\``,
    starter: `// llm 已注入。配置：第 1 轮 queryData，第 2 轮 format，第 3 轮解读。
// 看点：两个工具都做真实计算（reduce 求和 / 拼报表行），数据一改代码不用改。

const sales = { '10月': 12000, '11月': 14500, '12月': 15800 };

// TODO 1: 用 Object.values(sales).reduce((a, b) => a + b, 0) 预先算出 total
// TODO 2: 注册 queryData：'查询完成：' + args.quarter + ' 合计 ' + total + ' 元（' + Object.keys(sales).length + ' 个月）'
// TODO 3: 注册 format：每月 '<月份> <额> 元' 用 ' | ' 连接，末尾再接 ' | 合计 ' + total + ' 元'
// TODO 4: Agent Loop（最多 5 轮）：工具行 '[<name>] <结果>'，最终行 'BI: <content>'

`,
    solution: `const sales = { '10月': 12000, '11月': 14500, '12月': 15800 };
const total = Object.values(sales).reduce((a, b) => a + b, 0);
const tools = {
  queryData: (args) => '查询完成：' + args.quarter + ' 合计 ' + total + ' 元（' + Object.keys(sales).length + ' 个月）',
  format: (args) =>
    Object.keys(sales).map((k) => k + ' ' + sales[k] + ' 元').join(' | ') + ' | 合计 ' + total + ' 元',
};
const messages = [{ role: 'user', content: '帮我看看第四季度每个月的销售额' }];
for (let step = 1; step <= 5; step++) {
  const res = llm.chat(messages);
  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log('BI: ' + res.content);
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
        javascript: `// llm 已注入。配置：第 1 轮 queryData，第 2 轮 format，第 3 轮解读。
// 看点：两个工具都做真实计算（reduce 求和 / 拼报表行），数据一改代码不用改。

const sales = { '10月': 12000, '11月': 14500, '12月': 15800 };

// TODO 1: 用 Object.values(sales).reduce((a, b) => a + b, 0) 预先算出 total
// TODO 2: 注册 queryData：'查询完成：' + args.quarter + ' 合计 ' + total + ' 元（' + Object.keys(sales).length + ' 个月）'
// TODO 3: 注册 format：每月 '<月份> <额> 元' 用 ' | ' 连接，末尾再接 ' | 合计 ' + total + ' 元'
// TODO 4: Agent Loop（最多 5 轮）：工具行 '[<name>] <结果>'，最终行 'BI: <content>'

`,
      },
      solutions: {
        javascript: `const sales = { '10月': 12000, '11月': 14500, '12月': 15800 };
const total = Object.values(sales).reduce((a, b) => a + b, 0);
const tools = {
  queryData: (args) => '查询完成：' + args.quarter + ' 合计 ' + total + ' 元（' + Object.keys(sales).length + ' 个月）',
  format: (args) =>
    Object.keys(sales).map((k) => k + ' ' + sales[k] + ' 元').join(' | ') + ' | 合计 ' + total + ' 元',
};
const messages = [{ role: 'user', content: '帮我看看第四季度每个月的销售额' }];
for (let step = 1; step <= 5; step++) {
  const res = llm.chat(messages);
  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log('BI: ' + res.content);
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
      '求和一行搞定：`const total = Object.values(sales).reduce((a, b) => a + b, 0)`，两个工具共用它。',
      'format 的拼接：`Object.keys(sales).map((k) => k + " " + sales[k] + " 元").join(" | ")`，再 `+ " | 合计 " + total + " 元"`。',
      '循环骨架与 best-4 相同；`args.quarter` 的值 Q4 来自 Mock 配置，直接拼进结果即可。',
    ],
    tests: [
      { name: '样例：问数 → 出报表', stdin: '', expected: '[queryData] 查询完成：Q4 合计 42300 元（3 个月）\n[format] 10月 12000 元 | 11月 14500 元 | 12月 15800 元 | 合计 42300 元\nBI: 第四季度（Q4）销售额合计 42300 元，12 月最高（15800 元），建议关注增长势头。' },
      { name: '检查：真实求和计算', stdin: '', expected: '[queryData] 查询完成：Q4 合计 42300 元（3 个月）\n[format] 10月 12000 元 | 11月 14500 元 | 12月 15800 元 | 合计 42300 元\nBI: 第四季度（Q4）销售额合计 42300 元，12 月最高（15800 元），建议关注增长势头。' },
      { name: '检查：报表行格式', stdin: '', expected: '[queryData] 查询完成：Q4 合计 42300 元（3 个月）\n[format] 10月 12000 元 | 11月 14500 元 | 12月 15800 元 | 合计 42300 元\nBI: 第四季度（Q4）销售额合计 42300 元，12 月最高（15800 元），建议关注增长势头。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '[queryData] 查询完成：Q4 合计 42300 元（3 个月）\n[format] 10月 12000 元 | 11月 14500 元 | 12月 15800 元 | 合计 42300 元\nBI: 第四季度（Q4）销售额合计 42300 元，12 月最高（15800 元），建议关注增长势头。', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { toolCalls: [{ name: 'queryData', args: { quarter: 'Q4' } }] },
        { toolCalls: [{ name: 'format', args: { metric: 'sales' } }] },
        { content: '第四季度（Q4）销售额合计 42300 元，12 月最高（15800 元），建议关注增长势头。' },
      ],
    }),
  },
];
