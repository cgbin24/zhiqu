import type { Level } from '@/types';

/** Agent 课程 · 第四章：记忆与 RAG（tips，8 关） */
export const AGENTDEV_TIPS: Level[] = [
  {
    id: 'agentdev-tips-1',
    lang: 'agentdev',
    module: 'tips',
    order: 1,
    title: '会话记忆',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握会话记忆的维护方式：每轮把回复以 assistant 消息回填',
      '理解 messages 数组长度就是"记忆长度"的直观体现',
      '能跨两轮对话维护同一条消息历史',
    ],
    brief: `## 会话记忆：记忆长在你的数组里

第 1 章说过：LLM 没有记忆，"多轮对话"靠的是客户端把历史接回 messages。**会话管理**就是维护这个数组的纪律：

- 每次调用后，把回复以 **assistant 消息**追加回去 —— 少了这条，模型就不记得自己说过什么；
- 每轮用户输入以 user 消息追加；
- 数组越长，token 消耗线性增长 —— 长会话要做**裁剪或摘要**。

类比：**病历本** —— 医生每次问诊都先翻旧记录；你不记录，病人每次都是初诊。

> 💡 \`messages.length\` 就是"记忆长度"仪表盘，对应真实系统的上下文窗口占用。`,
    task: `## 任务：带着记忆聊两轮，并报出历史长度

Mock 配置两轮回复（第 2 轮回复"记得"你的名字，模拟有记忆的助手）。维护同一条 messages 历史：

1. 声明 \`messages\`，先放 system 消息 \`'你是智码助教，请记住用户告诉你的信息。'\`；
2. 追加 user 消息 \`'你好，我叫小明'\`，第一次 \`llm.chat\`，输出回复（第 1 行）；
3. 把第 1 轮回复以 assistant 消息回填，再追加 user 消息 \`'你还记得我的名字吗？'\`；
4. 记下此刻 \`messages.length\`（应含 system + user + assistant + user 共 **4** 条），第二次 \`llm.chat\`，输出回复（第 2 行）；
5. 输出第 3 行：\`历史消息数: 4\`（第二次调用时的长度）。

**输入**：无

**输出**：三行

\`\`\`text
你好！我是智码助手。
小明你好！我当然记得，你刚才告诉过我。
历史消息数: 4
\`\`\``,
    starter: `// llm 已注入，配置有两轮预设回复。
// 记忆纪律：每轮 chat 前把新的 user 消息 push 进数组，chat 后把回复以 assistant 回填。

// TODO 1: messages 以 system 消息 '你是智码助教，请记住用户告诉你的信息。' 起步
// TODO 2: 追加 user 消息 '你好，我叫小明'，第一次 chat 并输出回复
// TODO 3: 回填 assistant，追加 user '你还记得我的名字吗？'，记下 messages.length
// TODO 4: 第二次 chat 输出回复，最后输出 '历史消息数: <长度>'

`,
    solution: `const messages = [{ role: 'system', content: '你是智码助教，请记住用户告诉你的信息。' }];
messages.push({ role: 'user', content: '你好，我叫小明' });
const r1 = llm.chat(messages);
console.log(r1.content);
messages.push({ role: 'assistant', content: r1.content });
messages.push({ role: 'user', content: '你还记得我的名字吗？' });
const historyLen = messages.length;
const r2 = llm.chat(messages);
console.log(r2.content);
console.log('历史消息数: ' + historyLen);
`,
    algo: {
      starters: {
        javascript: `// llm 已注入，配置有两轮预设回复。
// 记忆纪律：每轮 chat 前把新的 user 消息 push 进数组，chat 后把回复以 assistant 回填。

// TODO 1: messages 以 system 消息 '你是智码助教，请记住用户告诉你的信息。' 起步
// TODO 2: 追加 user 消息 '你好，我叫小明'，第一次 chat 并输出回复
// TODO 3: 回填 assistant，追加 user '你还记得我的名字吗？'，记下 messages.length
// TODO 4: 第二次 chat 输出回复，最后输出 '历史消息数: <长度>'

`,
      },
      solutions: {
        javascript: `const messages = [{ role: 'system', content: '你是智码助教，请记住用户告诉你的信息。' }];
messages.push({ role: 'user', content: '你好，我叫小明' });
const r1 = llm.chat(messages);
console.log(r1.content);
messages.push({ role: 'assistant', content: r1.content });
messages.push({ role: 'user', content: '你还记得我的名字吗？' });
const historyLen = messages.length;
const r2 = llm.chat(messages);
console.log(r2.content);
console.log('历史消息数: ' + historyLen);
`,
      },
    },
    hints: [
      '数组里有 4 条消息：system、user、assistant、user —— 在第二次 chat **之前**用变量存下 `messages.length`。',
      '回填别漏：`messages.push({ role: "assistant", content: r1.content })`，否则第二轮时历史就断了。',
      '输出格式：`"历史消息数: " + historyLen`，冒号后一个空格，本关应为 4。',
    ],
    tests: [
      { name: '样例：两轮记忆对话', stdin: '', expected: '你好！我是智码助手。\n小明你好！我当然记得，你刚才告诉过我。\n历史消息数: 4' },
      { name: '检查：assistant 回填', stdin: '', expected: '你好！我是智码助手。\n小明你好！我当然记得，你刚才告诉过我。\n历史消息数: 4' },
      { name: '检查：历史长度', stdin: '', expected: '你好！我是智码助手。\n小明你好！我当然记得，你刚才告诉过我。\n历史消息数: 4' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '你好！我是智码助手。\n小明你好！我当然记得，你刚才告诉过我。\n历史消息数: 4', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [{ content: '你好！我是智码助手。' }, { content: '小明你好！我当然记得，你刚才告诉过我。' }],
    }),
  },
  {
    id: 'agentdev-tips-2',
    lang: 'agentdev',
    module: 'tips',
    order: 2,
    title: '关键词检索',
    difficulty: 3,
    xp: 25,
    goals: [
      '理解检索是 RAG 的第一步：先找资料，再回答',
      '实现"查询拆词 + 全包含"的关键词匹配检索',
      '能输出命中文档的标题',
    ],
    brief: `## 关键词检索：最朴素的"找资料"

Agent 要回答"平台怎么退款"，光靠模型脑补会胡编 —— 得先从资料库**检索**相关文档，这就是 RAG 的第一步。最朴素的实现是**关键词匹配**：

1. 查询按空格拆词：\`"数组 filter 过滤"\` → \`["数组", "filter", "过滤"]\`；
2. 文档的标题 + 正文**包含全部关键词**才算命中；
3. 按原文顺序输出命中的文档。

它粗糙（同义词、单复数都处理不了），但**零依赖、可解释、够快**，原型阶段非常好用。

类比：在图书馆**按书名索引找书** —— 同义名的书找不到，但名字对得上的，一定找得到。

> 💡 下一关交给平台注入的 \`retrieve()\`：按词元重叠打分，还支持取 Top-k。`,
    task: `## 任务：给 4 篇文档写一个关键词检索器

4 篇文档已内置在代码里（starter 与 solution 相同）。查询词为 \`数组 filter 过滤\`。

1. 把查询按空格拆成关键词数组 \`["数组", "filter", "过滤"]\`；
2. 对每篇文档，把 \`title + text\` 拼成一个字符串；
3. **每个关键词都出现**（\`includes\`）的文档才算命中；
4. 按原文顺序输出命中文档的标题，每个一行。

**输入**：无

**输出**：一行（只有 1 篇文档同时包含三个关键词）

\`\`\`text
数组常用方法
\`\`\``,
    starter: `// 本关不需要调用 llm（没有 Mock 配置），纯逻辑题。
// 4 篇内置文档：

const docs = [
  { title: '变量与作用域', text: '用 let 和 const 声明变量，const 声明的变量不能重新赋值。' },
  { title: '函数入门', text: '函数封装可复用的逻辑，用 function 定义，参数与返回值让函数更灵活。' },
  { title: '数组常用方法', text: 'push 在数组末尾追加元素，filter 按条件过滤数组，map 生成新数组。' },
  { title: '循环与遍历', text: 'for 循环按下标遍历数组，for...of 直接取出每个元素，while 适合次数未定的循环。' },
];
const query = '数组 filter 过滤';

// TODO 1: query.split(' ') 拆出关键词数组
// TODO 2: 过滤 docs：title + text 包含全部关键词才算命中
// TODO 3: 输出命中文档的标题

`,
    solution: `const docs = [
  { title: '变量与作用域', text: '用 let 和 const 声明变量，const 声明的变量不能重新赋值。' },
  { title: '函数入门', text: '函数封装可复用的逻辑，用 function 定义，参数与返回值让函数更灵活。' },
  { title: '数组常用方法', text: 'push 在数组末尾追加元素，filter 按条件过滤数组，map 生成新数组。' },
  { title: '循环与遍历', text: 'for 循环按下标遍历数组，for...of 直接取出每个元素，while 适合次数未定的循环。' },
];
const query = '数组 filter 过滤';
const kws = query.split(' ');
const hits = docs.filter((d) => {
  const body = (d.title || '') + (d.text || '');
  return kws.every((k) => body.includes(k));
});
for (const h of hits) console.log(h.title);
`,
    algo: {
      starters: {
        javascript: `// 本关不需要调用 llm（没有 Mock 配置），纯逻辑题。
// 4 篇内置文档：

const docs = [
  { title: '变量与作用域', text: '用 let 和 const 声明变量，const 声明的变量不能重新赋值。' },
  { title: '函数入门', text: '函数封装可复用的逻辑，用 function 定义，参数与返回值让函数更灵活。' },
  { title: '数组常用方法', text: 'push 在数组末尾追加元素，filter 按条件过滤数组，map 生成新数组。' },
  { title: '循环与遍历', text: 'for 循环按下标遍历数组，for...of 直接取出每个元素，while 适合次数未定的循环。' },
];
const query = '数组 filter 过滤';

// TODO 1: query.split(' ') 拆出关键词数组
// TODO 2: 过滤 docs：title + text 包含全部关键词才算命中
// TODO 3: 输出命中文档的标题

`,
      },
      solutions: {
        javascript: `const docs = [
  { title: '变量与作用域', text: '用 let 和 const 声明变量，const 声明的变量不能重新赋值。' },
  { title: '函数入门', text: '函数封装可复用的逻辑，用 function 定义，参数与返回值让函数更灵活。' },
  { title: '数组常用方法', text: 'push 在数组末尾追加元素，filter 按条件过滤数组，map 生成新数组。' },
  { title: '循环与遍历', text: 'for 循环按下标遍历数组，for...of 直接取出每个元素，while 适合次数未定的循环。' },
];
const query = '数组 filter 过滤';
const kws = query.split(' ');
const hits = docs.filter((d) => {
  const body = (d.title || '') + (d.text || '');
  return kws.every((k) => body.includes(k));
});
for (const h of hits) console.log(h.title);
`,
      },
    },
    hints: [
      '拆词：`const kws = query.split(" ")`；拼接正文：`(d.title || "") + (d.text || "")`。',
      '"全部包含"用 `kws.every((k) => body.includes(k))` —— every 要求每个关键词都命中；用 some 会把只含"数组"的《循环与遍历》也放进来。',
      '命中结果按原数组顺序输出标题：`for (const h of hits) console.log(h.title)`，本关只有《数组常用方法》命中。',
    ],
    tests: [
      { name: '样例：命中一篇', stdin: '', expected: '数组常用方法' },
      { name: '检查：全包含匹配', stdin: '', expected: '数组常用方法' },
      { name: '检查：按原文顺序输出', stdin: '', expected: '数组常用方法' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '数组常用方法', hidden: true },
    ],
  },
  {
    id: 'agentdev-tips-3',
    lang: 'agentdev',
    module: 'tips',
    order: 3,
    title: 'retrieve 检索助手',
    difficulty: 3,
    xp: 30,
    goals: [
      '了解平台注入的 retrieve(docs, query, k) 的打分规则',
      '理解词元重叠打分：中文双字组 + 英文按词',
      '能用 retrieve 取出 Top-2 相关文档并输出标题',
    ],
    brief: `## retrieve：平台自带的检索助手

平台为 Agent 课程注入了同步检索函数 \`retrieve(docs, query, k)\`，用法与真实 RAG 的向量检索一致，只是打分方式更直白：

- **分词**：英文/数字按词切，中文按**双字组**切（"工具调用" → 工具 / 具调 / 调用）；
- **打分**：每个查询词元在文档（标题 + 正文）中出现的次数求和；
- **排序**：得分高的在前，同分保持原序，**零分淘汰**，返回前 k 条。

类比：考试时**快速翻教材** —— 哪一页提到问题里的词多，就先看哪页，翻不到的直接跳过。

> 💡 它就是下一关 RAG 的"R"：检索质量决定了注入资料的质量。`,
    task: `## 任务：用 retrieve 找出最相关的 2 篇文档

5 篇文档已内置在代码里。使用**平台注入的** \`retrieve\` 函数（本关已注入，无需自己实现）：

1. 调用 \`retrieve(docs, '如何让模型调用外部工具', 2)\`；
2. 返回数组按相关度从高到低排列（最多 2 篇）；
3. 依次输出每篇文档的标题，每个一行。

**输入**：无

**输出**：两行

\`\`\`text
工具调用
什么是 Agent
\`\`\``,
    starter: `// 平台已注入检索助手（无需自己实现）：
//   retrieve(docs, query, k) → 按词元重叠打分的前 k 篇（得分为 0 的淘汰）
// 本关 5 篇内置文档：

const docs = [
  { title: '什么是 Agent', text: 'Agent 是能感知环境、规划任务并调用工具的智能体。' },
  { title: '提示词工程', text: 'few-shot 示例与思维链能显著提升提示质量。' },
  { title: '工具调用', text: 'Function Calling 让模型请求调用外部工具，例如查询天气或计算结果。' },
  { title: 'RAG 检索增强', text: '先从知识库检索相关文档，再把资料注入提示词让模型生成有依据的回答。' },
  { title: '多智能体协作', text: '多个 Agent 按角色分工协作，例如翻译、总结与审校。' },
];

// TODO 1: 调用 retrieve(docs, '如何让模型调用外部工具', 2)
// TODO 2: 依次输出每篇命中文档的标题

`,
    solution: `const docs = [
  { title: '什么是 Agent', text: 'Agent 是能感知环境、规划任务并调用工具的智能体。' },
  { title: '提示词工程', text: 'few-shot 示例与思维链能显著提升提示质量。' },
  { title: '工具调用', text: 'Function Calling 让模型请求调用外部工具，例如查询天气或计算结果。' },
  { title: 'RAG 检索增强', text: '先从知识库检索相关文档，再把资料注入提示词让模型生成有依据的回答。' },
  { title: '多智能体协作', text: '多个 Agent 按角色分工协作，例如翻译、总结与审校。' },
];
const top = retrieve(docs, '如何让模型调用外部工具', 2);
for (const d of top) console.log(d.title);
`,
    algo: {
      starters: {
        javascript: `// 平台已注入检索助手（无需自己实现）：
//   retrieve(docs, query, k) → 按词元重叠打分的前 k 篇（得分为 0 的淘汰）
// 本关 5 篇内置文档：

const docs = [
  { title: '什么是 Agent', text: 'Agent 是能感知环境、规划任务并调用工具的智能体。' },
  { title: '提示词工程', text: 'few-shot 示例与思维链能显著提升提示质量。' },
  { title: '工具调用', text: 'Function Calling 让模型请求调用外部工具，例如查询天气或计算结果。' },
  { title: 'RAG 检索增强', text: '先从知识库检索相关文档，再把资料注入提示词让模型生成有依据的回答。' },
  { title: '多智能体协作', text: '多个 Agent 按角色分工协作，例如翻译、总结与审校。' },
];

// TODO 1: 调用 retrieve(docs, '如何让模型调用外部工具', 2)
// TODO 2: 依次输出每篇命中文档的标题

`,
      },
      solutions: {
        javascript: `const docs = [
  { title: '什么是 Agent', text: 'Agent 是能感知环境、规划任务并调用工具的智能体。' },
  { title: '提示词工程', text: 'few-shot 示例与思维链能显著提升提示质量。' },
  { title: '工具调用', text: 'Function Calling 让模型请求调用外部工具，例如查询天气或计算结果。' },
  { title: 'RAG 检索增强', text: '先从知识库检索相关文档，再把资料注入提示词让模型生成有依据的回答。' },
  { title: '多智能体协作', text: '多个 Agent 按角色分工协作，例如翻译、总结与审校。' },
];
const top = retrieve(docs, '如何让模型调用外部工具', 2);
for (const d of top) console.log(d.title);
`,
      },
    },
    hints: [
      'retrieve 是平台注入的全局函数，直接调用：`const top = retrieve(docs, "如何让模型调用外部工具", 2)`。',
      '返回值是文档数组（按得分从高到低）；《工具调用》得分最高，《什么是 Agent》与《RAG 检索增强》同分时按原序取前者。',
      '输出就是两行标题：`for (const d of top) console.log(d.title)`。',
    ],
    tests: [
      { name: '样例：Top-2 检索', stdin: '', expected: '工具调用\n什么是 Agent' },
      { name: '检查：相关度排序', stdin: '', expected: '工具调用\n什么是 Agent' },
      { name: '检查：零分淘汰', stdin: '', expected: '工具调用\n什么是 Agent' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '工具调用\n什么是 Agent', hidden: true },
    ],
    runtime: JSON.stringify({ turns: [] }),
  },
  {
    id: 'agentdev-tips-4',
    lang: 'agentdev',
    module: 'tips',
    order: 4,
    title: 'RAG 注入',
    difficulty: 4,
    xp: 35,
    goals: [
      '掌握 RAG 完整闭环：检索 → 注入 → 生成',
      '学会把检索到的文档拼接进 user 消息',
      '理解"只依据资料回答"的提示词纪律',
    ],
    brief: `## RAG：检索增强生成的完整闭环

RAG（检索增强生成）解决模型"不知道私有知识、还会编造"的问题，完整流程四步：

1. **Retrieve**：用用户问题去知识库检索最相关的文档；
2. **注入**：把文档内容拼进 user 消息（标注"资料"）；
3. **生成**：调用 \`llm.chat\`，模型依据资料作答；
4. **纪律**：提示词写明"只依据资料回答"，不许脑补。

类比：**开卷考试** —— 模型不再凭记忆硬答，而是先翻到相关页（检索），照着书作答（生成）；答错至少是"抄错行"，而不是凭空编造。

> 💡 真实系统用向量数据库做检索，但流程与本关完全一致：**检索 → 注入 → 生成**。`,
    task: `## 任务：完成一次 RAG 问答

3 篇知识库文档已内置在代码里，Mock 第 1 轮会返回"依据资料"的答案。

1. 用 \`retrieve(docs, 'Agent 实战课程有几关', 1)\` 检索最相关的 **1** 篇文档；
2. 把它拼成资料块：\`【<title>】<text>\`；
3. 组装 messages 并调用 \`llm.chat\`：
   - system：\`'你只能依据资料回答问题。'\`
   - user：\`'Agent 实战课程有几关？'\` + \`'\\n资料：'\` + 资料块；
4. 输出模型的回复（第 1 行）。

**输入**：无

**输出**：一行

\`\`\`text
根据资料：Agent 实战课程共 20 关，覆盖提示词、工具调用与 RAG。
\`\`\``,
    starter: `// llm 与 retrieve 均已注入。RAG 三步：检索 → 注入 → 生成。

const docs = [
  { title: '平台介绍', text: '智码 CodeQuest 是游戏化编程学习平台，支持多语言判题。' },
  { title: 'Agent 实战课程', text: 'Agent 实战课程共 20 关，覆盖提示词、工具调用与 RAG。' },
  { title: '算法课程', text: '算法课程提供动画可视化与多语言作答。' },
];

// TODO 1: retrieve(docs, 'Agent 实战课程有几关', 1) 取最相关的 1 篇
// TODO 2: 拼资料块 '【' + title + '】' + text
// TODO 3: system '你只能依据资料回答问题。'，user 消息带上问题与资料块
// TODO 4: 调用 llm.chat 并输出回复

`,
    solution: `const docs = [
  { title: '平台介绍', text: '智码 CodeQuest 是游戏化编程学习平台，支持多语言判题。' },
  { title: 'Agent 实战课程', text: 'Agent 实战课程共 20 关，覆盖提示词、工具调用与 RAG。' },
  { title: '算法课程', text: '算法课程提供动画可视化与多语言作答。' },
];
const question = 'Agent 实战课程有几关？';
const hits = retrieve(docs, 'Agent 实战课程有几关', 1);
const context = hits.map((d) => '【' + d.title + '】' + d.text).join('\\n');
const messages = [
  { role: 'system', content: '你只能依据资料回答问题。' },
  { role: 'user', content: question + '\\n资料：' + context },
];
console.log(llm.chat(messages).content);
`,
    algo: {
      starters: {
        javascript: `// llm 与 retrieve 均已注入。RAG 三步：检索 → 注入 → 生成。

const docs = [
  { title: '平台介绍', text: '智码 CodeQuest 是游戏化编程学习平台，支持多语言判题。' },
  { title: 'Agent 实战课程', text: 'Agent 实战课程共 20 关，覆盖提示词、工具调用与 RAG。' },
  { title: '算法课程', text: '算法课程提供动画可视化与多语言作答。' },
];

// TODO 1: retrieve(docs, 'Agent 实战课程有几关', 1) 取最相关的 1 篇
// TODO 2: 拼资料块 '【' + title + '】' + text
// TODO 3: system '你只能依据资料回答问题。'，user 消息带上问题与资料块
// TODO 4: 调用 llm.chat 并输出回复

`,
      },
      solutions: {
        javascript: `const docs = [
  { title: '平台介绍', text: '智码 CodeQuest 是游戏化编程学习平台，支持多语言判题。' },
  { title: 'Agent 实战课程', text: 'Agent 实战课程共 20 关，覆盖提示词、工具调用与 RAG。' },
  { title: '算法课程', text: '算法课程提供动画可视化与多语言作答。' },
];
const question = 'Agent 实战课程有几关？';
const hits = retrieve(docs, 'Agent 实战课程有几关', 1);
const context = hits.map((d) => '【' + d.title + '】' + d.text).join('\\n');
const messages = [
  { role: 'system', content: '你只能依据资料回答问题。' },
  { role: 'user', content: question + '\\n资料：' + context },
];
console.log(llm.chat(messages).content);
`,
      },
    },
    hints: [
      '检索：`const hits = retrieve(docs, "Agent 实战课程有几关", 1)`，k=1 时返回数组里最多 1 篇（《Agent 实战课程》）。',
      '资料块：`hits.map((d) => "【" + d.title + "】" + d.text).join("\\n")`，再拼到 user 消息的 `"\\n资料："` 之后。',
      '最后 `console.log(llm.chat(messages).content)` 一行输出即可，Mock 会按资料给出答案。',
    ],
    tests: [
      { name: '样例：RAG 问答', stdin: '', expected: '根据资料：Agent 实战课程共 20 关，覆盖提示词、工具调用与 RAG。' },
      { name: '检查：检索命中', stdin: '', expected: '根据资料：Agent 实战课程共 20 关，覆盖提示词、工具调用与 RAG。' },
      { name: '检查：资料注入格式', stdin: '', expected: '根据资料：Agent 实战课程共 20 关，覆盖提示词、工具调用与 RAG。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '根据资料：Agent 实战课程共 20 关，覆盖提示词、工具调用与 RAG。', hidden: true },
    ],
    runtime: JSON.stringify({ turns: [{ content: '根据资料：Agent 实战课程共 20 关，覆盖提示词、工具调用与 RAG。' }] }),
  },
  {
    id: 'agentdev-tips-5',
    lang: 'agentdev',
    module: 'tips',
    order: 5,
    title: '滑动窗口记忆',
    difficulty: 3,
    xp: 25,
    goals: [
      '理解上下文窗口有限：历史越长，发送的 token 越多',
      '实现滑动窗口：每次只把最近 3 条消息发给模型',
      '认识窗口的信息损失：被挤出窗口的内容模型就"失忆"',
    ],
    brief: `## 滑动窗口记忆：只带最近 3 条上车

消息历史一路 push，token 消耗线性上涨，模型的上下文窗口还有硬上限。**滑动窗口**是最省事的记忆裁剪：每次只把**最近 N 条**消息发给模型 —— \`history.slice(-3)\`。历史仍完整保留在本地，但发送的永远是窗口里的那几条。

代价是**信息损失**：被挤出窗口的旧消息，模型就"失忆"了 —— 本关第 3 轮时，第 1 轮的自我介绍已被挤出窗口，模型之所以还记得，全靠第 2 轮回复里那句复述。

类比：**车厢只有 3 个座位** —— 老乘客到站下车，新乘客才能上车，车上永远只有最近 3 位。

> 💡 窗口适合闲聊场景；要保住关键事实，请用下一关的摘要压缩，或把事实写进 system。`,
    task: `## 任务：用最近 3 条消息的窗口聊三轮

Mock 三轮回复已配置。历史数组照常累积，但**每次 chat 只发送窗口**：

1. 声明 \`history = []\`，三轮输入依次为：\`'我叫小明，喜欢天文'\`、\`'我叫什么？'\`、\`'我喜欢什么？'\`；
2. 每轮：push user 消息 → \`const recent = history.slice(-3)\` → \`llm.chat(recent)\` → 把回复 push 回 history；
3. 每轮输出一行：\`第<n>轮: 窗口发送 <recent.length> 条 / 历史 <history.length> 条\`；
4. 最后输出一行 \`--- 最终窗口（最近 3 条）---\`，再逐条输出窗口内容：\`[<role>] <content>\`。

**输入**：无

**输出**：六行

\`\`\`text
第1轮: 窗口发送 1 条 / 历史 2 条
第2轮: 窗口发送 3 条 / 历史 4 条
第3轮: 窗口发送 3 条 / 历史 6 条
--- 最终窗口（最近 3 条）---
[assistant] 你是小明，喜欢天文。
[user] 我喜欢什么？
[assistant] 你喜欢天文。
\`\`\``,
    starter: `// llm 已注入。配置：三轮回复。纪律：历史照常累积，但每次只把最近 3 条发给模型。

const history = [];
const rounds = ['我叫小明，喜欢天文', '我叫什么？', '我喜欢什么？'];

// TODO 1: 遍历 rounds：push user 消息，然后 const recent = history.slice(-3)
// TODO 2: llm.chat(recent)（注意传窗口而不是全量历史），回复 push 回 history
// TODO 3: 每轮输出 '第<n>轮: 窗口发送 <recent.length> 条 / 历史 <history.length> 条'
// TODO 4: 最后输出 '--- 最终窗口（最近 3 条）---'，再逐条输出 '[<role>] <content>'

`,
    solution: `const history = [];
const rounds = ['我叫小明，喜欢天文', '我叫什么？', '我喜欢什么？'];
for (let i = 0; i < rounds.length; i++) {
  history.push({ role: 'user', content: rounds[i] });
  const recent = history.slice(-3);
  const res = llm.chat(recent);
  history.push({ role: 'assistant', content: res.content });
  console.log('第' + (i + 1) + '轮: 窗口发送 ' + recent.length + ' 条 / 历史 ' + history.length + ' 条');
}
console.log('--- 最终窗口（最近 3 条）---');
for (const m of history.slice(-3)) {
  console.log('[' + m.role + '] ' + m.content);
}
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。配置：三轮回复。纪律：历史照常累积，但每次只把最近 3 条发给模型。

const history = [];
const rounds = ['我叫小明，喜欢天文', '我叫什么？', '我喜欢什么？'];

// TODO 1: 遍历 rounds：push user 消息，然后 const recent = history.slice(-3)
// TODO 2: llm.chat(recent)（注意传窗口而不是全量历史），回复 push 回 history
// TODO 3: 每轮输出 '第<n>轮: 窗口发送 <recent.length> 条 / 历史 <history.length> 条'
// TODO 4: 最后输出 '--- 最终窗口（最近 3 条）---'，再逐条输出 '[<role>] <content>'

`,
      },
      solutions: {
        javascript: `const history = [];
const rounds = ['我叫小明，喜欢天文', '我叫什么？', '我喜欢什么？'];
for (let i = 0; i < rounds.length; i++) {
  history.push({ role: 'user', content: rounds[i] });
  const recent = history.slice(-3);
  const res = llm.chat(recent);
  history.push({ role: 'assistant', content: res.content });
  console.log('第' + (i + 1) + '轮: 窗口发送 ' + recent.length + ' 条 / 历史 ' + history.length + ' 条');
}
console.log('--- 最终窗口（最近 3 条）---');
for (const m of history.slice(-3)) {
  console.log('[' + m.role + '] ' + m.content);
}
`,
      },
    },
    hints: [
      '窗口就一行：`const recent = history.slice(-3)`，把 `recent`（而不是 `history`）传给 `llm.chat`。',
      '第 1 轮历史只有 1 条 user 消息，窗口自然只有 1 条 —— 别硬凑 3；统计行在 push assistant 之后打印，所以历史数是偶数。',
      '窗口内容用 `for (const m of history.slice(-3))` 输出，格式 `"[" + m.role + "] " + m.content`。',
    ],
    tests: [
      { name: '样例：三轮窗口对话', stdin: '', expected: '第1轮: 窗口发送 1 条 / 历史 2 条\n第2轮: 窗口发送 3 条 / 历史 4 条\n第3轮: 窗口发送 3 条 / 历史 6 条\n--- 最终窗口（最近 3 条）---\n[assistant] 你是小明，喜欢天文。\n[user] 我喜欢什么？\n[assistant] 你喜欢天文。' },
      { name: '检查：只发送窗口', stdin: '', expected: '第1轮: 窗口发送 1 条 / 历史 2 条\n第2轮: 窗口发送 3 条 / 历史 4 条\n第3轮: 窗口发送 3 条 / 历史 6 条\n--- 最终窗口（最近 3 条）---\n[assistant] 你是小明，喜欢天文。\n[user] 我喜欢什么？\n[assistant] 你喜欢天文。' },
      { name: '检查：窗口大小上限', stdin: '', expected: '第1轮: 窗口发送 1 条 / 历史 2 条\n第2轮: 窗口发送 3 条 / 历史 4 条\n第3轮: 窗口发送 3 条 / 历史 6 条\n--- 最终窗口（最近 3 条）---\n[assistant] 你是小明，喜欢天文。\n[user] 我喜欢什么？\n[assistant] 你喜欢天文。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '第1轮: 窗口发送 1 条 / 历史 2 条\n第2轮: 窗口发送 3 条 / 历史 4 条\n第3轮: 窗口发送 3 条 / 历史 6 条\n--- 最终窗口（最近 3 条）---\n[assistant] 你是小明，喜欢天文。\n[user] 我喜欢什么？\n[assistant] 你喜欢天文。', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { content: '你好小明！' },
        { content: '你是小明，喜欢天文。' },
        { content: '你喜欢天文。' },
      ],
    }),
  },
  {
    id: 'agentdev-tips-6',
    lang: 'agentdev',
    module: 'tips',
    order: 6,
    title: '摘要压缩记忆',
    difficulty: 3,
    xp: 25,
    goals: [
      '理解摘要压缩：把长历史浓缩成一条摘要消息',
      '实现"长对话 → 生成摘要 → 重建轻量历史"的压缩流程',
      '对比压缩前后的 messages 长度',
    ],
    brief: `## 摘要压缩记忆：把一本日记浓缩成一页纸

滑动窗口简单粗暴，但关键事实会被挤丢。**摘要压缩**更聪明：历史太长时，让模型把整段对话**压缩成一条摘要**，再用摘要替换旧历史：

1. 正常聊若干轮，历史照常累积；
2. 触发压缩：追加 user 消息"请把之前的对话压缩成一句话摘要"，这一轮 \`llm.chat\` 返回的就是摘要；
3. **重建历史**：旧消息全部丢弃，新 messages 只放一条 \`历史摘要：<摘要>\`；
4. 之后带着轻量历史继续对话。

类比：**交接班记录** —— 新值班医生没空读整本病历，只需要上一班的摘要，重点不丢、篇幅骤减。

> 💡 代价：压缩本身多消耗一次调用，细节也会失真。真实系统常"摘要 + 保留最近几条"混合使用。`,
    task: `## 任务：长对话触发摘要压缩，报出前后长度

Mock 四轮：第 1、2 轮正常回复，第 3 轮返回摘要，第 4 轮基于压缩后的历史回复。

1. 空数组 \`messages\` 起步。第 1 轮：push user \`'我下周要去上海出差'\` → chat → 输出回复 → 回填 assistant；
2. 第 2 轮：push user \`'顺便看下上海明天的天气'\` → chat → 输出回复 → 回填 assistant；
3. 输出 \`压缩前历史: <messages.length> 条\`（应为 4）；
4. 触发压缩：push user \`'请把之前的对话压缩成一句话摘要'\` → chat，输出 \`摘要: <content>\`；
5. 重建历史：\`const compact = [{ role: 'user', content: '历史摘要：' + 摘要 }]\`，输出 \`压缩后历史: <compact.length> 条\`（应为 1）；
6. compact 追加 user \`'那帮我订一张高铁票'\`，再 chat，输出最终回复。

**输入**：无

**输出**：六行

\`\`\`text
好的，已记下：下周去上海出差。
上海明天晴，25°C。
压缩前历史: 4 条
摘要: 用户下周去上海出差，并查询了上海天气。
压缩后历史: 1 条
好的，已为你预订下周去上海的高铁票。
\`\`\``,
    starter: `// llm 已注入。配置：第 1、2 轮正常回复，第 3 轮返回摘要，第 4 轮基于压缩后的历史回复。

const messages = [];

// TODO 1: 两轮正常对话：push user → chat → 输出回复 → 回填 assistant（输入见任务）
// TODO 2: 输出 '压缩前历史: ' + messages.length + ' 条'
// TODO 3: push user '请把之前的对话压缩成一句话摘要'，chat 得到摘要，输出 '摘要: <content>'
// TODO 4: 重建 compact = [{ role: 'user', content: '历史摘要：' + 摘要 }]，输出 '压缩后历史: 1 条'
// TODO 5: compact 追加 '那帮我订一张高铁票'，再 chat，输出最终回复

`,
    solution: `const messages = [];
messages.push({ role: 'user', content: '我下周要去上海出差' });
const r1 = llm.chat(messages);
console.log(r1.content);
messages.push({ role: 'assistant', content: r1.content });
messages.push({ role: 'user', content: '顺便看下上海明天的天气' });
const r2 = llm.chat(messages);
console.log(r2.content);
messages.push({ role: 'assistant', content: r2.content });
console.log('压缩前历史: ' + messages.length + ' 条');
messages.push({ role: 'user', content: '请把之前的对话压缩成一句话摘要' });
const sum = llm.chat(messages);
console.log('摘要: ' + sum.content);
const compact = [{ role: 'user', content: '历史摘要：' + sum.content }];
console.log('压缩后历史: ' + compact.length + ' 条');
compact.push({ role: 'user', content: '那帮我订一张高铁票' });
console.log(llm.chat(compact).content);
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。配置：第 1、2 轮正常回复，第 3 轮返回摘要，第 4 轮基于压缩后的历史回复。

const messages = [];

// TODO 1: 两轮正常对话：push user → chat → 输出回复 → 回填 assistant（输入见任务）
// TODO 2: 输出 '压缩前历史: ' + messages.length + ' 条'
// TODO 3: push user '请把之前的对话压缩成一句话摘要'，chat 得到摘要，输出 '摘要: <content>'
// TODO 4: 重建 compact = [{ role: 'user', content: '历史摘要：' + 摘要 }]，输出 '压缩后历史: 1 条'
// TODO 5: compact 追加 '那帮我订一张高铁票'，再 chat，输出最终回复

`,
      },
      solutions: {
        javascript: `const messages = [];
messages.push({ role: 'user', content: '我下周要去上海出差' });
const r1 = llm.chat(messages);
console.log(r1.content);
messages.push({ role: 'assistant', content: r1.content });
messages.push({ role: 'user', content: '顺便看下上海明天的天气' });
const r2 = llm.chat(messages);
console.log(r2.content);
messages.push({ role: 'assistant', content: r2.content });
console.log('压缩前历史: ' + messages.length + ' 条');
messages.push({ role: 'user', content: '请把之前的对话压缩成一句话摘要' });
const sum = llm.chat(messages);
console.log('摘要: ' + sum.content);
const compact = [{ role: 'user', content: '历史摘要：' + sum.content }];
console.log('压缩后历史: ' + compact.length + ' 条');
compact.push({ role: 'user', content: '那帮我订一张高铁票' });
console.log(llm.chat(compact).content);
`,
      },
    },
    hints: [
      '第 2 轮结束后 messages 里是 user/assistant 交替的 4 条 —— 在 push 摘要请求**之前**打印"压缩前历史"。',
      '重建一行搞定：`const compact = [{ role: "user", content: "历史摘要：" + sum.content }]`，旧 messages 直接不再使用。',
      '压缩后继续聊：`compact.push({ role: "user", content: "那帮我订一张高铁票" })`，对 `compact` 调 chat，别再碰旧的 `messages`。',
    ],
    tests: [
      { name: '样例：摘要压缩', stdin: '', expected: '好的，已记下：下周去上海出差。\n上海明天晴，25°C。\n压缩前历史: 4 条\n摘要: 用户下周去上海出差，并查询了上海天气。\n压缩后历史: 1 条\n好的，已为你预订下周去上海的高铁票。' },
      { name: '检查：压缩前长度', stdin: '', expected: '好的，已记下：下周去上海出差。\n上海明天晴，25°C。\n压缩前历史: 4 条\n摘要: 用户下周去上海出差，并查询了上海天气。\n压缩后历史: 1 条\n好的，已为你预订下周去上海的高铁票。' },
      { name: '检查：压缩后长度', stdin: '', expected: '好的，已记下：下周去上海出差。\n上海明天晴，25°C。\n压缩前历史: 4 条\n摘要: 用户下周去上海出差，并查询了上海天气。\n压缩后历史: 1 条\n好的，已为你预订下周去上海的高铁票。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '好的，已记下：下周去上海出差。\n上海明天晴，25°C。\n压缩前历史: 4 条\n摘要: 用户下周去上海出差，并查询了上海天气。\n压缩后历史: 1 条\n好的，已为你预订下周去上海的高铁票。', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { content: '好的，已记下：下周去上海出差。' },
        { content: '上海明天晴，25°C。' },
        { content: '用户下周去上海出差，并查询了上海天气。' },
        { content: '好的，已为你预订下周去上海的高铁票。' },
      ],
    }),
  },
  {
    id: 'agentdev-tips-7',
    lang: 'agentdev',
    module: 'tips',
    order: 7,
    title: '多轮工具链',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解工具链：上游工具的输出成为下游工具的输入',
      '看清链条所在：模型从消息历史提取结果，填进下一次调用的参数',
      '实现"查 ID → 用 ID 查订单"的两级工具链',
    ],
    brief: `## 工具链：上一棒的结果，是下一棒的原料

单次工具调用解决不了"查小明的订单" —— 得先拿到 userId，再用它查订单。**工具链**就是让工具接力：\`getUserId\` 的输出 \`u_1001\`，成为 \`getOrders\` 的输入参数。

链条在哪对接？答案是**消息历史**：getUserId 的结果以 tool 消息回填后，模型读到它，第 2 轮就把 \`u_1001\` 填进 getOrders 的 args。你不必写"把 A 的结果传给 B"的胶水代码 —— **回填历史就是胶水**。

类比：**接力赛** —— 交棒区（消息历史）里上一棒的棒伸手就能拿到，下一棒（模型）带它跑下一程。

> 💡 链条越长越容易断：任何一步失败都要回填错误信息，模型才知道换路还是收场。`,
    task: `## 任务：实现"查 ID → 查订单"的两级工具链

Mock 三轮：第 1 轮请求 \`getUserId\`，第 2 轮请求 \`getOrders\`（**参数带回了**第 1 轮的结果 \`u_1001\`），第 3 轮给出最终回答。

1. 注册两个工具：
   - \`getUserId: (args) => 'u_1001'\`
   - \`getOrders: (args) => '用户 ' + args.userId + ' 有 2 个订单：O-201 图书 x2；O-305 无线耳机 x1'\` —— 结果里要**用上** args.userId
2. 发送 user 消息 \`'查一下小明名下的订单'\`，进入循环（最多 5 轮）；
3. 工具行输出 \`<name>(<args 的 JSON>) → <结果>\`（args 用 \`JSON.stringify\` 打印）；
4. 最终行输出 \`回答: <content>\`。

**输入**：无

**输出**：三行

\`\`\`text
getUserId({"name":"小明"}) → u_1001
getOrders({"userId":"u_1001"}) → 用户 u_1001 有 2 个订单：O-201 图书 x2；O-305 无线耳机 x1
回答: 小明（u_1001）共有 2 个订单：O-201（图书 x2）和 O-305（无线耳机 x1）。
\`\`\``,
    starter: `// llm 已注入。配置：第 1 轮 getUserId，第 2 轮 getOrders（参数带回了第 1 轮的结果），第 3 轮最终回答。
// 链条在哪？工具结果回填消息历史后，模型读到它，把它填进了下一次调用的参数。

// TODO 1: 注册 getUserId（返回 'u_1001'）
// TODO 2: 注册 getOrders：把 args.userId 拼进结果 '用户 <userId> 有 2 个订单：O-201 图书 x2；O-305 无线耳机 x1'
// TODO 3: Agent Loop（最多 5 轮）：工具行输出 '<name>(' + JSON.stringify(args) + ') → <结果>'
// TODO 4: 最终行输出 '回答: <content>'

`,
    solution: `const tools = {
  getUserId: (args) => 'u_1001',
  getOrders: (args) => '用户 ' + args.userId + ' 有 2 个订单：O-201 图书 x2；O-305 无线耳机 x1',
};
const messages = [{ role: 'user', content: '查一下小明名下的订单' }];
for (let step = 1; step <= 5; step++) {
  const res = llm.chat(messages);
  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log('回答: ' + res.content);
    break;
  }
  for (const call of res.toolCalls) {
    const result = tools[call.name](call.args);
    console.log(call.name + '(' + JSON.stringify(call.args) + ') → ' + result);
    messages.push({ role: 'tool', name: call.name, content: result });
  }
}
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。配置：第 1 轮 getUserId，第 2 轮 getOrders（参数带回了第 1 轮的结果），第 3 轮最终回答。
// 链条在哪？工具结果回填消息历史后，模型读到它，把它填进了下一次调用的参数。

// TODO 1: 注册 getUserId（返回 'u_1001'）
// TODO 2: 注册 getOrders：把 args.userId 拼进结果 '用户 <userId> 有 2 个订单：O-201 图书 x2；O-305 无线耳机 x1'
// TODO 3: Agent Loop（最多 5 轮）：工具行输出 '<name>(' + JSON.stringify(args) + ') → <结果>'
// TODO 4: 最终行输出 '回答: <content>'

`,
      },
      solutions: {
        javascript: `const tools = {
  getUserId: (args) => 'u_1001',
  getOrders: (args) => '用户 ' + args.userId + ' 有 2 个订单：O-201 图书 x2；O-305 无线耳机 x1',
};
const messages = [{ role: 'user', content: '查一下小明名下的订单' }];
for (let step = 1; step <= 5; step++) {
  const res = llm.chat(messages);
  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log('回答: ' + res.content);
    break;
  }
  for (const call of res.toolCalls) {
    const result = tools[call.name](call.args);
    console.log(call.name + '(' + JSON.stringify(call.args) + ') → ' + result);
    messages.push({ role: 'tool', name: call.name, content: result });
  }
}
`,
      },
    },
    hints: [
      'args 的 JSON 用 `JSON.stringify(call.args)` 打印 —— 单键对象输出形如 `{"name":"小明"}`，键序按声明顺序。',
      '链条的证明就在日志里：第 2 行 args 里的 `u_1001` 正是第 1 行的结果 —— 模型从回填的 tool 消息里读到并填进了参数。',
      'getOrders 的实现要把 `args.userId` 拼进结果：`"用户 " + args.userId + " 有 2 个订单：…"` —— 下游真的消费了上游的输出。',
    ],
    tests: [
      { name: '样例：两级工具接力', stdin: '', expected: 'getUserId({"name":"小明"}) → u_1001\ngetOrders({"userId":"u_1001"}) → 用户 u_1001 有 2 个订单：O-201 图书 x2；O-305 无线耳机 x1\n回答: 小明（u_1001）共有 2 个订单：O-201（图书 x2）和 O-305（无线耳机 x1）。' },
      { name: '检查：输出接力', stdin: '', expected: 'getUserId({"name":"小明"}) → u_1001\ngetOrders({"userId":"u_1001"}) → 用户 u_1001 有 2 个订单：O-201 图书 x2；O-305 无线耳机 x1\n回答: 小明（u_1001）共有 2 个订单：O-201（图书 x2）和 O-305（无线耳机 x1）。' },
      { name: '检查：args 序列化格式', stdin: '', expected: 'getUserId({"name":"小明"}) → u_1001\ngetOrders({"userId":"u_1001"}) → 用户 u_1001 有 2 个订单：O-201 图书 x2；O-305 无线耳机 x1\n回答: 小明（u_1001）共有 2 个订单：O-201（图书 x2）和 O-305（无线耳机 x1）。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: 'getUserId({"name":"小明"}) → u_1001\ngetOrders({"userId":"u_1001"}) → 用户 u_1001 有 2 个订单：O-201 图书 x2；O-305 无线耳机 x1\n回答: 小明（u_1001）共有 2 个订单：O-201（图书 x2）和 O-305（无线耳机 x1）。', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { toolCalls: [{ name: 'getUserId', args: { name: '小明' } }] },
        { toolCalls: [{ name: 'getOrders', args: { userId: 'u_1001' } }] },
        { content: '小明（u_1001）共有 2 个订单：O-201（图书 x2）和 O-305（无线耳机 x1）。' },
      ],
    }),
  },
  {
    id: 'agentdev-tips-8',
    lang: 'agentdev',
    module: 'tips',
    order: 8,
    title: '思维链+工具组合',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解 ReAct：思考（content）与行动（toolCalls）可在同一轮并存',
      '能展示模型的思维链，再执行其同轮嵌入的工具调用',
      '实现"思考 → 行动 → 观察"交替推进直至最终结果',
    ],
    brief: `## 思维链 + 工具：ReAct，边想边做

前面的关卡里模型要么"说话"要么"点菜"，而 **ReAct**（Reason + Act）允许**同一轮回复既有思维链又有工具调用**：\`res.content\` 是"我现在想干什么"，\`res.toolCalls\` 是"所以我决定调什么"。

客户端职责是把两者都接住：先打印 \`思考: <content>\` 让推理可追溯；再逐个执行 \`toolCalls\` 并打印 \`[工具] 结果\`；回填后进入下一轮 —— 想 → 做 → 看，直到某轮没有 toolCalls，输出最终结果。

类比：**边查地图边开车** —— 先念叨"该左转了"，再打方向盘，看到路牌再决定下一段。

> 💡 打印"思考"不是装饰：排查故障时，思维链日志就是第一现场。`,
    task: `## 任务：跑通"思考 → 行动 → 观察"的下单流程

Mock 三轮：第 1、2 轮**同时**返回 content（思维链）与 toolCalls，第 3 轮只返回最终结论。

1. 注册两个工具：
   - \`checkStock: (args) => '商品 ' + args.sku + ' 库存 10 件'\`
   - \`calcTotal: (args) => args.qty + ' 件 × ' + args.price + ' 元 = ' + args.qty * args.price + ' 元'\`
2. 发送 user 消息 \`'帮我下单 3 件商品 A-001，单价 99 元'\`，进入循环（最多 5 轮）；
3. 有 toolCalls 的轮次：先输出 \`思考: <content>\`，再逐个执行并输出 \`[<name>] <结果>\`，结果回填为 tool 消息；
4. 无 toolCalls：输出 \`最终结果: <content>\` 并结束。

**输入**：无

**输出**：五行

\`\`\`text
思考: 先查商品 A-001 的库存是否充足。
[checkStock] 商品 A-001 库存 10 件
思考: 库存充足，计算 3 件的总价。
[calcTotal] 3 件 × 99 元 = 297 元
最终结果: 下单成功，总价 297 元，订单号 O-888。
\`\`\``,
    starter: `// llm 已注入。配置：第 1、2 轮同时返回 content（思维链）与 toolCalls，第 3 轮只有最终结论。
// ReAct：思考（content）与行动（toolCalls）同轮并存 —— 先打印思考，再执行工具。

// TODO 1: 注册 checkStock：'商品 ' + args.sku + ' 库存 10 件'
// TODO 2: 注册 calcTotal：args.qty + ' 件 × ' + args.price + ' 元 = ' + args.qty * args.price + ' 元'
// TODO 3: Agent Loop（最多 5 轮）：工具轮先输出 '思考: <content>'，再逐个输出 '[<name>] <结果>' 并回填
// TODO 4: 无 toolCalls 时输出 '最终结果: <content>' 并 break

`,
    solution: `const tools = {
  checkStock: (args) => '商品 ' + args.sku + ' 库存 10 件',
  calcTotal: (args) => args.qty + ' 件 × ' + args.price + ' 元 = ' + args.qty * args.price + ' 元',
};
const messages = [{ role: 'user', content: '帮我下单 3 件商品 A-001，单价 99 元' }];
for (let step = 1; step <= 5; step++) {
  const res = llm.chat(messages);
  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log('最终结果: ' + res.content);
    break;
  }
  console.log('思考: ' + res.content);
  for (const call of res.toolCalls) {
    const result = tools[call.name](call.args);
    console.log('[' + call.name + '] ' + result);
    messages.push({ role: 'tool', name: call.name, content: result });
  }
}
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。配置：第 1、2 轮同时返回 content（思维链）与 toolCalls，第 3 轮只有最终结论。
// ReAct：思考（content）与行动（toolCalls）同轮并存 —— 先打印思考，再执行工具。

// TODO 1: 注册 checkStock：'商品 ' + args.sku + ' 库存 10 件'
// TODO 2: 注册 calcTotal：args.qty + ' 件 × ' + args.price + ' 元 = ' + args.qty * args.price + ' 元'
// TODO 3: Agent Loop（最多 5 轮）：工具轮先输出 '思考: <content>'，再逐个输出 '[<name>] <结果>' 并回填
// TODO 4: 无 toolCalls 时输出 '最终结果: <content>' 并 break

`,
      },
      solutions: {
        javascript: `const tools = {
  checkStock: (args) => '商品 ' + args.sku + ' 库存 10 件',
  calcTotal: (args) => args.qty + ' 件 × ' + args.price + ' 元 = ' + args.qty * args.price + ' 元',
};
const messages = [{ role: 'user', content: '帮我下单 3 件商品 A-001，单价 99 元' }];
for (let step = 1; step <= 5; step++) {
  const res = llm.chat(messages);
  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log('最终结果: ' + res.content);
    break;
  }
  console.log('思考: ' + res.content);
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
      '本关与 Agent Loop 的唯一区别：工具轮在执行工具前多打一行 `"思考: " + res.content` —— content 与 toolCalls 可以同时返回。',
      'calcTotal 的算式：`args.qty + " 件 × " + args.price + " 元 = " + args.qty * args.price + " 元"`，乘法先算，结果是 297。',
      '终止分支不变：`!res.toolCalls || res.toolCalls.length === 0` 时输出 `"最终结果: " + res.content` 并 break。',
    ],
    tests: [
      { name: '样例：ReAct 下单流程', stdin: '', expected: '思考: 先查商品 A-001 的库存是否充足。\n[checkStock] 商品 A-001 库存 10 件\n思考: 库存充足，计算 3 件的总价。\n[calcTotal] 3 件 × 99 元 = 297 元\n最终结果: 下单成功，总价 297 元，订单号 O-888。' },
      { name: '检查：思维链展示', stdin: '', expected: '思考: 先查商品 A-001 的库存是否充足。\n[checkStock] 商品 A-001 库存 10 件\n思考: 库存充足，计算 3 件的总价。\n[calcTotal] 3 件 × 99 元 = 297 元\n最终结果: 下单成功，总价 297 元，订单号 O-888。' },
      { name: '检查：同轮思考+行动', stdin: '', expected: '思考: 先查商品 A-001 的库存是否充足。\n[checkStock] 商品 A-001 库存 10 件\n思考: 库存充足，计算 3 件的总价。\n[calcTotal] 3 件 × 99 元 = 297 元\n最终结果: 下单成功，总价 297 元，订单号 O-888。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '思考: 先查商品 A-001 的库存是否充足。\n[checkStock] 商品 A-001 库存 10 件\n思考: 库存充足，计算 3 件的总价。\n[calcTotal] 3 件 × 99 元 = 297 元\n最终结果: 下单成功，总价 297 元，订单号 O-888。', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        {
          content: '先查商品 A-001 的库存是否充足。',
          toolCalls: [{ name: 'checkStock', args: { sku: 'A-001' } }],
        },
        {
          content: '库存充足，计算 3 件的总价。',
          toolCalls: [{ name: 'calcTotal', args: { price: 99, qty: 3 } }],
        },
        { content: '下单成功，总价 297 元，订单号 O-888。' },
      ],
    }),
  },
];
