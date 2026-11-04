import type { Level } from '@/types';

/** Agent 课程 · 第四章：记忆与 RAG（tips，4 关） */
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
];
