import type { Level } from '@/types';

/** basic-3 的 Mock LLM 长回复（75 字 × 4 = 300 字符，用于超预算截断） */
const INTRO_LONG =
  '智码CodeQuest是一条游戏化编程学习路线，从语言基础到算法实战，每一关都有清晰的任务说明与即时判题反馈，像闯关打游戏一样循序渐进，坚持不再困难。';

const B1_EXPECTED =
  '[{"role":"system","content":"你是一个乐于助人的编程助教。"},{"role":"user","content":"你好，请介绍一下你自己。"}]';

/** Agent 课程 · 第一章：LLM 基础调用（basic，4 关） */
export const AGENTDEV_BASIC: Level[] = [
  {
    id: 'agentdev-basic-1',
    lang: 'agentdev',
    module: 'basic',
    order: 1,
    title: '你好，LLM',
    difficulty: 1,
    xp: 15,
    goals: [
      '理解 messages 数组是调用大模型的基本载体',
      '区分 system / user / assistant 三种角色的职责',
      '能把一次对话请求组装成 API 规范的结构并序列化输出',
    ],
    brief: `## 一切从 messages 开始

调用大模型 API，本质就是发送一个 **messages 数组**：一条条带角色的消息按顺序发给模型。三种角色各司其职：

- **system**：导演。设定身份与规矩，用户看不见，却决定助手"是谁"。
- **user**：观众提问。用户的每句话都是一条 user 消息。
- **assistant**：模型的回答。由 API 返回；多轮对话时要接回数组，模型才"记得"说过什么。

真实 SDK 的请求体正是 \`messages: [{role, content}]\`，与本关写法几乎一致。类比**剧本台词表**：system 是幕后设定，user 与 assistant 的对白轮流登场 —— 追加一条消息，就是给对话加一场戏。`,
    task: `## 任务：组装你的第一个对话请求

本关不需要调用 \`llm\`（没有 Mock 配置），只练"组装请求体"。

1. 声明 \`messages\` 数组，包含**恰好两条**消息：
   - 第 1 条：\`role: 'system'\`，\`content: '你是一个乐于助人的编程助教。'\`
   - 第 2 条：\`role: 'user'\`，\`content: '你好，请介绍一下你自己。'\`
2. 用 \`console.log(JSON.stringify(messages))\` 输出**一行** JSON（默认无空格、不换行）。

**输入**：无

**输出**：一行 JSON，与下面逐字符一致

\`\`\`json
[{"role":"system","content":"你是一个乐于助人的编程助教。"},{"role":"user","content":"你好，请介绍一下你自己。"}]
\`\`\``,
    starter: `// 与真实 LLM API 一样，对话由 messages 数组承载：
//   { role: 'system',    content: '...' }  设定助手的身份与规则
//   { role: 'user',      content: '...' }  用户的输入
//   { role: 'assistant', content: '...' }  模型回复（由 API 返回，不用你写）
//
// 本关不需要调用 llm，只组装请求体。

// TODO 1: 声明 messages 数组，先放一条 system 消息："你是一个乐于助人的编程助教。"
// TODO 2: 追加一条 user 消息："你好，请介绍一下你自己。"
// TODO 3: 用 JSON.stringify(messages) 输出一行 JSON

`,
    solution: `const messages = [
  { role: 'system', content: '你是一个乐于助人的编程助教。' },
  { role: 'user', content: '你好，请介绍一下你自己。' },
];
console.log(JSON.stringify(messages));
`,
    algo: {
      starters: {
        javascript: `// 与真实 LLM API 一样，对话由 messages 数组承载：
//   { role: 'system',    content: '...' }  设定助手的身份与规则
//   { role: 'user',      content: '...' }  用户的输入
//   { role: 'assistant', content: '...' }  模型回复（由 API 返回，不用你写）
//
// 本关不需要调用 llm，只组装请求体。

// TODO 1: 声明 messages 数组，先放一条 system 消息："你是一个乐于助人的编程助教。"
// TODO 2: 追加一条 user 消息："你好，请介绍一下你自己。"
// TODO 3: 用 JSON.stringify(messages) 输出一行 JSON

`,
      },
      solutions: {
        javascript: `const messages = [
  { role: 'system', content: '你是一个乐于助人的编程助教。' },
  { role: 'user', content: '你好，请介绍一下你自己。' },
];
console.log(JSON.stringify(messages));
`,
      },
    },
    hints: [
      'messages 就是一个普通数组：`const messages = [{ role: "system", content: "..." }, { role: "user", content: "..." }]`，角色用字符串 system / user。',
      'content 里的文案要一字不差：system 是"你是一个乐于助人的编程助教。"，user 是"你好，请介绍一下你自己。"（含句号）。',
      '输出直接 `console.log(JSON.stringify(messages))`，JSON.stringify 默认就是紧凑单行格式，别加缩进参数。',
    ],
    tests: [
      { name: '样例：请求体 JSON', stdin: '', expected: B1_EXPECTED },
      { name: '检查：system 在前 user 在后', stdin: '', expected: B1_EXPECTED },
      { name: '检查：紧凑单行输出', stdin: '', expected: B1_EXPECTED },
      { name: '隐藏：逐字符比对', stdin: '', expected: B1_EXPECTED, hidden: true },
    ],
  },
  {
    id: 'agentdev-basic-2',
    lang: 'agentdev',
    module: 'basic',
    order: 2,
    title: '温度与采样',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解 temperature 与采样策略对输出确定性的影响',
      '学会调用 llm.chat 并读取返回的 content 与 usage',
      '知道 promptTokens 与输入长度的对应关系',
    ],
    brief: `## 温度：给模型装一个"随机旋钮"

同样的提问，模型每次回答可能不同 —— 这由**采样策略**决定。temperature（温度）控制模型怎么在候选词中挑选：

- **温度 → 0**：永远选得分最高的词，输出确定稳定，适合分类、抽取等要可复现的任务。
- **温度 → 1**：按概率随机抽样，输出多样有创意，适合文案与头脑风暴。

类比：温度为 0 像**照菜谱做菜**，每次味道一样；调高像**凭手感即兴发挥**，可能惊艳也可能翻车。

每次调用还返回 **usage** 用量：\`promptTokens\`（输入）与 \`completionTokens\`（输出），真实 API 按它计费，Mock 用字符数模拟。Mock 等价于温度 0 —— 同样输入永远同样回复，判题因此可复现。`,
    task: `## 任务：发出你的第一次 chat 调用

平台已注入 \`llm = createMockLLM(...)\`，本关配置里预设了一条回复。

1. 组装 messages：system 消息 \`'你是一个友好的AI助手。'\` + user 消息 \`'你好！'\`（文案一字不差，会影响 token 数）。
2. 调用 \`llm.chat(messages)\`，返回对象含 \`content\` 与 \`usage\`。
3. 输出两行：
   - 第 1 行：回复内容（\`res.content\`）
   - 第 2 行：输入 token 数（\`res.usage.promptTokens\`）

**输入**：无

**输出**：两行

\`\`\`text
你好！我是助手
76
\`\`\`

第 2 行的数字来自 Mock 的规则 \`JSON.stringify(messages).length\`，即"整个请求体序列化后的字符数"。`,
    starter: `// llm 已注入，可直接调用：
//   llm.chat(messages) → { content, toolCalls, model, usage }
// usage.promptTokens = 整个 messages 序列化后的字符数

// TODO 1: 组装 messages（system: '你是一个友好的AI助手。'，user: '你好！'）
// TODO 2: 调用 llm.chat 拿到返回值 res
// TODO 3: 两行输出：res.content 与 res.usage.promptTokens

`,
    solution: `const messages = [
  { role: 'system', content: '你是一个友好的AI助手。' },
  { role: 'user', content: '你好！' },
];
const res = llm.chat(messages);
console.log(res.content);
console.log(res.usage.promptTokens);
`,
    algo: {
      starters: {
        javascript: `// llm 已注入，可直接调用：
//   llm.chat(messages) → { content, toolCalls, model, usage }
// usage.promptTokens = 整个 messages 序列化后的字符数

// TODO 1: 组装 messages（system: '你是一个友好的AI助手。'，user: '你好！'）
// TODO 2: 调用 llm.chat 拿到返回值 res
// TODO 3: 两行输出：res.content 与 res.usage.promptTokens

`,
      },
      solutions: {
        javascript: `const messages = [
  { role: 'system', content: '你是一个友好的AI助手。' },
  { role: 'user', content: '你好！' },
];
const res = llm.chat(messages);
console.log(res.content);
console.log(res.usage.promptTokens);
`,
      },
    },
    hints: [
      '结构照抄上一关：`const messages = [{ role: "system", content: "..." }, { role: "user", content: "..." }]`，然后 `const res = llm.chat(messages)`。',
      '返回值是对象：`res.content` 是回复文本，`res.usage.promptTokens` 是输入 token 数，分别用两个 console.log 输出。',
      '注意文案必须一字不差 —— promptTokens 按 JSON.stringify(messages) 的字符数计算，content 多一个字数字就不同。',
    ],
    tests: [
      { name: '样例：回复与 token 数', stdin: '', expected: '你好！我是助手\n76' },
      { name: '检查：回复内容', stdin: '', expected: '你好！我是助手\n76' },
      { name: '检查：usage 字段读取', stdin: '', expected: '你好！我是助手\n76' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '你好！我是助手\n76', hidden: true },
    ],
    runtime: JSON.stringify({ turns: [{ content: '你好！我是助手' }] }),
  },
  {
    id: 'agentdev-basic-3',
    lang: 'agentdev',
    module: 'basic',
    order: 3,
    title: 'Token 预算',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解 token 与字符的估算关系（1 token ≈ 2 字符）',
      '学会拼接 messages 各角色 content 估算总 token 数',
      '掌握超预算时的截断策略：保 system、砍 user',
    ],
    brief: `## Token：模型的"计价单位"

模型不按"字"思考，而按 **token** —— 文本被切成的最小单位，英文一个单词常占一个 token，中文约 1~2 字一个。真实 API 按 token 计费，上下文窗口也有上限，所以发送前要做**预算控制**。

本课程用最简单的估算：**token 数 ≈ 字符数 ÷ 2**（向下取整）—— 拼接各角色 content、除以 2；超预算就**截断**：保住 system 设定，砍掉 user 长文尾部。

类比：token 像**行李额** —— 出发前称重，超重就从大件行李（user 长文）里拿掉一些，随身小包（system）必须留下。

> ⚠️ 截断会丢信息，生产中更优雅的做法是摘要压缩，或只检索相关片段注入（见 tips 章）。`,
    task: `## 任务：给长文做 token 体检

平台注入的 Mock LLM 会在第 1 轮返回一份**长文**。把"system 设定 + 这份长文"组装成待发送的 messages，并做预算检查：

1. 先调 \`llm.chat\` 拿到长文（\`res.content\`），作为 user 消息的 content；
2. messages = system 消息 \`'你是课程答疑助手。'\` + 上述 user 消息；
3. 把各角色 content 拼接，\`token 数 = Math.floor(总字符数 / 2)\`；
4. 输出第 1 行：\`tokens=<N>\`；
5. 若超过预算 **100**：输出第 2 行 \`TRUNCATED\`，然后**保持 system 不变**，把 user 消息从头截取 \`100 × 2 − system 字符数 = 191\` 个字符，重算并输出第 3 行 \`tokens=<N>\`。

**输入**：无

**输出**：三行（未超预算时只有第 1 行）

\`\`\`text
tokens=154
TRUNCATED
tokens=100
\`\`\``,
    starter: `// llm 已注入。本关第 1 轮回复是一篇长文。
// 预算：100 token，按 1 token ≈ 2 字符估算。

// TODO 1: 调用 llm.chat 拿到长文，作为 user 消息 content
// TODO 2: messages = [system '你是课程答疑助手。', user 长文]
// TODO 3: 拼接各角色 content，Math.floor(总字符数 / 2) 得到 token 数，输出 tokens=<N>
// TODO 4: 超过 100 则输出 TRUNCATED，把 user content 截到 191 字符，再输出一次 tokens=<N>

`,
    solution: `const BUDGET = 100;
const long = llm.chat([{ role: 'user', content: '请给我一份平台介绍长文。' }]).content;
const messages = [
  { role: 'system', content: '你是课程答疑助手。' },
  { role: 'user', content: long },
];
const all = messages.map((m) => m.content).join('');
const tokens = Math.floor(all.length / 2);
console.log('tokens=' + tokens);
if (tokens > BUDGET) {
  console.log('TRUNCATED');
  const keep = BUDGET * 2 - messages[0].content.length;
  messages[1].content = messages[1].content.slice(0, keep);
  const trimmed = messages.map((m) => m.content).join('');
  console.log('tokens=' + Math.floor(trimmed.length / 2));
}
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。本关第 1 轮回复是一篇长文。
// 预算：100 token，按 1 token ≈ 2 字符估算。

// TODO 1: 调用 llm.chat 拿到长文，作为 user 消息 content
// TODO 2: messages = [system '你是课程答疑助手。', user 长文]
// TODO 3: 拼接各角色 content，Math.floor(总字符数 / 2) 得到 token 数，输出 tokens=<N>
// TODO 4: 超过 100 则输出 TRUNCATED，把 user content 截到 191 字符，再输出一次 tokens=<N>

`,
      },
      solutions: {
        javascript: `const BUDGET = 100;
const long = llm.chat([{ role: 'user', content: '请给我一份平台介绍长文。' }]).content;
const messages = [
  { role: 'system', content: '你是课程答疑助手。' },
  { role: 'user', content: long },
];
const all = messages.map((m) => m.content).join('');
const tokens = Math.floor(all.length / 2);
console.log('tokens=' + tokens);
if (tokens > BUDGET) {
  console.log('TRUNCATED');
  const keep = BUDGET * 2 - messages[0].content.length;
  messages[1].content = messages[1].content.slice(0, keep);
  const trimmed = messages.map((m) => m.content).join('');
  console.log('tokens=' + Math.floor(trimmed.length / 2));
}
`,
      },
    },
    hints: [
      '先 `llm.chat(...)` 拿到长文 `long`，再组 `messages`。拼接用 `messages.map((m) => m.content).join("")`，字符数就是 `.length`。',
      'token 数 = `Math.floor(all.length / 2)`，输出格式是 `tokens=` + 数字（无空格）。本关长文 300 字符，加 9 字符的 system，tokens 应为 154。',
      '截断规则：预算 100 token 即 200 字符，user 消息截取前 `200 - system 字符数` = 191 个字符（`slice(0, 191)`），重算后正好 tokens=100。',
    ],
    tests: [
      { name: '样例：超预算截断', stdin: '', expected: 'tokens=154\nTRUNCATED\ntokens=100' },
      { name: '检查：tokens 估算', stdin: '', expected: 'tokens=154\nTRUNCATED\ntokens=100' },
      { name: '检查：截断到预算内', stdin: '', expected: 'tokens=154\nTRUNCATED\ntokens=100' },
      { name: '隐藏：逐字符比对', stdin: '', expected: 'tokens=154\nTRUNCATED\ntokens=100', hidden: true },
    ],
    runtime: JSON.stringify({ turns: [{ content: INTRO_LONG.repeat(4) }] }),
  },
  {
    id: 'agentdev-basic-4',
    lang: 'agentdev',
    module: 'basic',
    order: 4,
    title: '多轮对话',
    difficulty: 3,
    xp: 25,
    goals: [
      '掌握多轮对话的数组操作：追加 user 与 assistant 消息',
      '理解"模型无记忆，记忆在客户端数组"的本质',
      '能连续调用两次 llm.chat 并输出两轮回复',
    ],
    brief: `## 多轮对话：把历史接回去

LLM 本身**没有记忆**：每次调用独立，模型只看得到这次发去的 messages。所谓"多轮对话"，其实是**客户端把历史接回数组再重发**：第 1 次 chat 后，把回复以 assistant 消息追加回去；第 2 次 chat 时数组已是 [user, assistant, user]，模型"看得到"之前聊了什么。

这就是记忆的真相：**记忆不在模型里，在你的数组里**。类比：一位**每次见面前都要重读聊天记录的笔友** —— 你不把之前的信附上，他就一无所知。

> 💡 Mock 按调用顺序消耗预设回复 —— 历史回填虽不影响本关输出，却是真实多轮对话的必备动作。`,
    task: `## 任务：和助手聊两轮

Mock 配置预设了两轮回复。维护同一个 \`messages\` 数组完成两轮对话：

1. 声明空的 \`messages\` 数组，追加 \`{ role: 'user', content: '你好' }\`，调用 \`llm.chat\` 得到第 1 轮回复；
2. 输出第 1 轮回复（第 1 行）；
3. **把第 1 轮回复以 assistant 消息追加回数组**，再追加 \`{ role: 'user', content: '再见' }\`，再次调用 \`llm.chat\`；
4. 输出第 2 轮回复（第 2 行）。

**输入**：无

**输出**：两行

\`\`\`text
你好！我是智码助手，有什么可以帮你？
再见！记得完成今天的关卡哦。
\`\`\``,
    starter: `// llm 已注入，本关配置有两轮预设回复：
//   第 1 次 chat 返回第 1 轮回复，第 2 次返回第 2 轮。

// TODO 1: 声明空数组 messages，push 一条 user 消息 '你好'
// TODO 2: 第一次 llm.chat，输出回复内容
// TODO 3: 把回复作为 assistant 消息 push 回 messages，再 push user 消息 '再见'
// TODO 4: 第二次 llm.chat，输出第二轮回复

`,
    solution: `const messages = [];
messages.push({ role: 'user', content: '你好' });
const r1 = llm.chat(messages);
console.log(r1.content);
messages.push({ role: 'assistant', content: r1.content });
messages.push({ role: 'user', content: '再见' });
const r2 = llm.chat(messages);
console.log(r2.content);
`,
    algo: {
      starters: {
        javascript: `// llm 已注入，本关配置有两轮预设回复：
//   第 1 次 chat 返回第 1 轮回复，第 2 次返回第 2 轮。

// TODO 1: 声明空数组 messages，push 一条 user 消息 '你好'
// TODO 2: 第一次 llm.chat，输出回复内容
// TODO 3: 把回复作为 assistant 消息 push 回 messages，再 push user 消息 '再见'
// TODO 4: 第二次 llm.chat，输出第二轮回复

`,
      },
      solutions: {
        javascript: `const messages = [];
messages.push({ role: 'user', content: '你好' });
const r1 = llm.chat(messages);
console.log(r1.content);
messages.push({ role: 'assistant', content: r1.content });
messages.push({ role: 'user', content: '再见' });
const r2 = llm.chat(messages);
console.log(r2.content);
`,
      },
    },
    hints: [
      '两次调用要用**同一个** messages 数组：第一次 `llm.chat(messages)` 前数组只有一条 user 消息。',
      '拿到 `r1` 后先输出 `r1.content`，然后 `messages.push({ role: "assistant", content: r1.content })` —— 这一步就是"把历史接回去"。',
      '再 push 一条 `{ role: "user", content: "再见" }` 后第二次调用，输出 `r2.content`。两次输出各占一行。',
    ],
    tests: [
      { name: '样例：两轮回复', stdin: '', expected: '你好！我是智码助手，有什么可以帮你？\n再见！记得完成今天的关卡哦。' },
      { name: '检查：第一轮回复', stdin: '', expected: '你好！我是智码助手，有什么可以帮你？\n再见！记得完成今天的关卡哦。' },
      { name: '检查：第二轮回复', stdin: '', expected: '你好！我是智码助手，有什么可以帮你？\n再见！记得完成今天的关卡哦。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '你好！我是智码助手，有什么可以帮你？\n再见！记得完成今天的关卡哦。', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [{ content: '你好！我是智码助手，有什么可以帮你？' }, { content: '再见！记得完成今天的关卡哦。' }],
    }),
  },
];
