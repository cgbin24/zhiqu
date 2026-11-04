import type { Level } from '@/types';

/** Agent 课程 · 第二章：Prompt 工程（paradigm，4 关） */
export const AGENTDEV_PARADIGM: Level[] = [
  {
    id: 'agentdev-paradigm-1',
    lang: 'agentdev',
    module: 'paradigm',
    order: 1,
    title: 'Few-shot 提示',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解 few-shot 提示：用带答案的例子教模型完成任务',
      '能把"示例 + 目标输入"拼成结构化提示词',
      '能对 3 条评论逐条调用 llm.chat 并输出情感标签',
    ],
    brief: `## Few-shot：教模型"看例子做题"

想让模型做情感分类，与其解释概念，不如**直接给几个带答案的例子**塞进提示词 —— 这就是 few-shot（少样本）提示：给 1 个例子叫 one-shot，一个不给叫 zero-shot；例子会引导模型**模仿格式与规律**续写答案，分类、抽取这类格式固定的任务，few-shot 往往立竿见影。

\`\`\`text
评论: 这家店服务态度很好。
情感: 正面
评论: <目标评论>
情感:
\`\`\`

类比：**批改作业前先给学生看两道标准例题**，比讲抽象定义管用得多。真实 LLM 的效果取决于例子的代表性；Mock 则按调用顺序逐轮返回预设标签，让你专注练习"拼提示"。`,
    task: `## 任务：给 3 条课程评论打情感标签

评论固定为：

1. \`这个课程太棒了，讲解特别清晰！\`
2. \`买了就后悔，内容又旧又啰嗦。\`
3. \`示例很实用，老师答疑也及时。\`

对**每一条**评论：构造 few-shot 提示（system 角色说明 + 两条示例 + 目标评论），调用 \`llm.chat\`，输出标签。

- 两条 few-shot 示例（写进 user 消息）：\`评论: 这家店服务态度很好。→ 情感: 正面\`、\`评论: 物流太慢，包装也破了。→ 情感: 负面\`
- system 消息建议：\`你是情感分类器，只输出"正面"或"负面"。\`

**输入**：无

**输出**：三行，格式 \`评论<N>: <标签>\`

\`\`\`text
评论1: 正面
评论2: 负面
评论3: 正面
\`\`\``,
    starter: `// llm 已注入。本关配置有三轮预设回复（每调一次 chat 消耗一轮）：
//   第 1 次 → '正面'，第 2 次 → '负面'，第 3 次 → '正面'

const comments = [
  '这个课程太棒了，讲解特别清晰！',
  '买了就后悔，内容又旧又啰嗦。',
  '示例很实用，老师答疑也及时。',
];
const examples = [
  { text: '这家店服务态度很好。', label: '正面' },
  { text: '物流太慢，包装也破了。', label: '负面' },
];

// TODO 1: 遍历 comments，对每条评论用 examples 拼 few-shot 提示
// TODO 2: system 消息 + user 消息（示例块 + 目标评论）调用 llm.chat
// TODO 3: 按 '评论<N>: <标签>' 格式输出

`,
    solution: `const comments = [
  '这个课程太棒了，讲解特别清晰！',
  '买了就后悔，内容又旧又啰嗦。',
  '示例很实用，老师答疑也及时。',
];
const examples = [
  { text: '这家店服务态度很好。', label: '正面' },
  { text: '物流太慢，包装也破了。', label: '负面' },
];
comments.forEach((c, i) => {
  const shot = examples.map((e) => '评论: ' + e.text + '\\n情感: ' + e.label).join('\\n');
  const messages = [
    { role: 'system', content: '你是情感分类器，只输出"正面"或"负面"。' },
    { role: 'user', content: shot + '\\n评论: ' + c + '\\n情感:' },
  ];
  console.log('评论' + (i + 1) + ': ' + llm.chat(messages).content);
});
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。本关配置有三轮预设回复（每调一次 chat 消耗一轮）：
//   第 1 次 → '正面'，第 2 次 → '负面'，第 3 次 → '正面'

const comments = [
  '这个课程太棒了，讲解特别清晰！',
  '买了就后悔，内容又旧又啰嗦。',
  '示例很实用，老师答疑也及时。',
];
const examples = [
  { text: '这家店服务态度很好。', label: '正面' },
  { text: '物流太慢，包装也破了。', label: '负面' },
];

// TODO 1: 遍历 comments，对每条评论用 examples 拼 few-shot 提示
// TODO 2: system 消息 + user 消息（示例块 + 目标评论）调用 llm.chat
// TODO 3: 按 '评论<N>: <标签>' 格式输出

`,
      },
      solutions: {
        javascript: `const comments = [
  '这个课程太棒了，讲解特别清晰！',
  '买了就后悔，内容又旧又啰嗦。',
  '示例很实用，老师答疑也及时。',
];
const examples = [
  { text: '这家店服务态度很好。', label: '正面' },
  { text: '物流太慢，包装也破了。', label: '负面' },
];
comments.forEach((c, i) => {
  const shot = examples.map((e) => '评论: ' + e.text + '\\n情感: ' + e.label).join('\\n');
  const messages = [
    { role: 'system', content: '你是情感分类器，只输出"正面"或"负面"。' },
    { role: 'user', content: shot + '\\n评论: ' + c + '\\n情感:' },
  ];
  console.log('评论' + (i + 1) + ': ' + llm.chat(messages).content);
});
`,
      },
    },
    hints: [
      '用 `comments.forEach((c, i) => { ... })` 遍历；每次循环里新组一个 messages 数组并调用一次 `llm.chat` —— 三次调用正好消耗三轮预设回复。',
      '示例块：`examples.map((e) => "评论: " + e.text + "\\n情感: " + e.label).join("\\n")`，再拼上 `"\\n评论: " + c + "\\n情感:"` 作为 user 消息。',
      '输出格式 `评论1: 正面` 用字符串拼接：`"评论" + (i + 1) + ": " + res.content`。注意下标从 0 起，展示要从 1 起。',
    ],
    tests: [
      { name: '样例：三条评论', stdin: '', expected: '评论1: 正面\n评论2: 负面\n评论3: 正面' },
      { name: '检查：标签顺序', stdin: '', expected: '评论1: 正面\n评论2: 负面\n评论3: 正面' },
      { name: '检查：输出格式', stdin: '', expected: '评论1: 正面\n评论2: 负面\n评论3: 正面' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '评论1: 正面\n评论2: 负面\n评论3: 正面', hidden: true },
    ],
    runtime: JSON.stringify({ turns: [{ content: '正面' }, { content: '负面' }, { content: '正面' }] }),
  },
  {
    id: 'agentdev-paradigm-2',
    lang: 'agentdev',
    module: 'paradigm',
    order: 2,
    title: '结构化输出',
    difficulty: 3,
    xp: 25,
    goals: [
      '理解结构化输出（JSON mode）：让模型返回程序可解析的 JSON',
      '会用提示词约束输出格式，并用 JSON.parse 解析回复',
      '能把解析结果格式化为人类可读的输出',
    ],
    brief: `## 结构化输出：让模型交"表格"而不是"作文"

聊天回复是自然语言，程序没法直接用。让模型按 **JSON** 格式返回，下游代码才能解析 —— 这就是结构化输出（JSON mode）：提示词写明"请以 JSON 输出 {name, age}"，模型返回 \`{"name":"张三","age":25}\`，\`JSON.parse()\` 后字段与类型都可控。

真实 API 有更硬的保证：OpenAI 的 response_format、Anthropic 的工具入参约束，都能**强制**合法 JSON，而不只是"请求它"。

类比：让模型**填表**而不是写散文 —— 程序按列取值即可。

> ⚠️ 模型偶尔仍会输出不合法 JSON，best 章的"输出格式护栏"教你兜底。`,
    task: `## 任务：解析模型返回的 JSON

Mock LLM 第 1 轮会返回一段 JSON 字符串：\`{"name":"张三","age":25}\`。

1. 组装提示：system 消息 \`'请始终以 JSON 格式输出人物信息。'\`，user 消息 \`'记录：张三，25 岁。请输出 name 和 age。'\`；
2. 调用 \`llm.chat\`，用 \`JSON.parse(res.content)\` 解析成对象；
3. 输出一行，格式：\`姓名: <name>, 年龄: <age>\`（"姓名:"后、逗号后各一个空格）。

**输入**：无

**输出**：一行

\`\`\`text
姓名: 张三, 年龄: 25
\`\`\``,
    starter: `// llm 已注入。第 1 轮回复是 JSON 字符串 '{"name":"张三","age":25}'。

// TODO 1: 组装 messages（system: '请始终以 JSON 格式输出人物信息。'，user: '记录：张三，25 岁。请输出 name 和 age。'）
// TODO 2: 调用 llm.chat，JSON.parse 解析 res.content
// TODO 3: 输出 '姓名: <name>, 年龄: <age>'

`,
    solution: `const messages = [
  { role: 'system', content: '请始终以 JSON 格式输出人物信息。' },
  { role: 'user', content: '记录：张三，25 岁。请输出 name 和 age。' },
];
const res = llm.chat(messages);
const data = JSON.parse(res.content);
console.log('姓名: ' + data.name + ', 年龄: ' + data.age);
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。第 1 轮回复是 JSON 字符串 '{"name":"张三","age":25}'。

// TODO 1: 组装 messages（system: '请始终以 JSON 格式输出人物信息。'，user: '记录：张三，25 岁。请输出 name 和 age。'）
// TODO 2: 调用 llm.chat，JSON.parse 解析 res.content
// TODO 3: 输出 '姓名: <name>, 年龄: <age>'

`,
      },
      solutions: {
        javascript: `const messages = [
  { role: 'system', content: '请始终以 JSON 格式输出人物信息。' },
  { role: 'user', content: '记录：张三，25 岁。请输出 name 和 age。' },
];
const res = llm.chat(messages);
const data = JSON.parse(res.content);
console.log('姓名: ' + data.name + ', 年龄: ' + data.age);
`,
      },
    },
    hints: [
      '照常组装 messages 并 `const res = llm.chat(messages)`，此时 `res.content` 是**字符串**，不是对象。',
      '解析：`const data = JSON.parse(res.content)`，之后 `data.name` 是 "张三"，`data.age` 是 25。',
      '输出格式注意空格：`"姓名: " + data.name + ", 年龄: " + data.age` —— 冒号后一个空格，逗号后一个空格。',
    ],
    tests: [
      { name: '样例：解析并格式化', stdin: '', expected: '姓名: 张三, 年龄: 25' },
      { name: '检查：JSON.parse 结果', stdin: '', expected: '姓名: 张三, 年龄: 25' },
      { name: '检查：输出格式', stdin: '', expected: '姓名: 张三, 年龄: 25' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '姓名: 张三, 年龄: 25', hidden: true },
    ],
    runtime: JSON.stringify({ turns: [{ content: '{"name":"张三","age":25}' }] }),
  },
  {
    id: 'agentdev-paradigm-3',
    lang: 'agentdev',
    module: 'paradigm',
    order: 3,
    title: '思维链 CoT',
    difficulty: 3,
    xp: 25,
    goals: [
      '理解思维链（CoT）：让模型先写推理过程再给答案',
      '知道为什么"写出步骤"能提升复杂题正确率',
      '能用正则从模型回复中提取"答案: "后的最终数字',
    ],
    brief: `## 思维链：让模型"先打草稿再交卷"

直接问应用题，模型可能脱口而出错误答案。**思维链（CoT）**在提示词里加一句"请一步步推理"，让模型把中间步骤写出来再给最终答案 —— 复杂题正确率显著提升。

原因很直觉：模型逐词生成，**前面的输出是后面的上下文**。写出推理过程，等于让它边算边检查，而不是凭第一直觉押答案。提取结果也有套路：约定"所以答案: 42"这样的收尾标记，程序用正则把数字抠出来。

类比：**应用题要求"写出计算过程"** —— 错了知道错在哪，答案也更靠谱。

> 💡 o1、DeepSeek-R1 等推理模型把"先思考再回答"做成了产品形态，内核正是 CoT。`,
    task: `## 任务：从推理过程中提取最终答案

Mock LLM 会返回一段带推理步骤的回复，并以"所以答案: <数字>"收尾。

1. 发送 user 消息 \`'6 × 7 等于多少？请一步步推理。'\`（无需 system 消息）；
2. 调用 \`llm.chat\` 拿到回复；
3. 用正则 \`/答案[:：]\\s*(\\d+)/\` 从 \`res.content\` 中提取"答案: "后的数字；
4. 若匹配到，输出该数字；若没有，输出 \`NO_ANSWER\`。

**输入**：无

**输出**：一行

\`\`\`text
42
\`\`\``,
    starter: `// llm 已注入。第 1 轮回复带推理步骤，以"所以答案: 42"收尾。

// TODO 1: 发送 user 消息 '6 × 7 等于多少？请一步步推理。' 并调用 llm.chat
// TODO 2: 用正则 /答案[:：]\\s*(\\d+)/ 匹配 res.content
// TODO 3: 匹配到输出 m[1]，否则输出 NO_ANSWER

`,
    solution: `const messages = [{ role: 'user', content: '6 × 7 等于多少？请一步步推理。' }];
const res = llm.chat(messages);
const m = res.content.match(/答案[:：]\\s*(\\d+)/);
if (m) {
  console.log(m[1]);
} else {
  console.log('NO_ANSWER');
}
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。第 1 轮回复带推理步骤，以"所以答案: 42"收尾。

// TODO 1: 发送 user 消息 '6 × 7 等于多少？请一步步推理。' 并调用 llm.chat
// TODO 2: 用正则 /答案[:：]\\s*(\\d+)/ 匹配 res.content
// TODO 3: 匹配到输出 m[1]，否则输出 NO_ANSWER

`,
      },
      solutions: {
        javascript: `const messages = [{ role: 'user', content: '6 × 7 等于多少？请一步步推理。' }];
const res = llm.chat(messages);
const m = res.content.match(/答案[:：]\\s*(\\d+)/);
if (m) {
  console.log(m[1]);
} else {
  console.log('NO_ANSWER');
}
`,
      },
    },
    hints: [
      '正则字面量写在代码里：`res.content.match(/答案[:：]\\s*(\\d+)/)`，注意要同时兼容中英文冒号。',
      '匹配失败时 `match` 返回 `null`（而不是空数组），所以用 `if (m)` 判断；匹配成功时捕获组 `m[1]` 就是数字字符串。',
      '输出 `console.log(m[1])` 即可，m[1] 是字符串 "42"，不用转数字。',
    ],
    tests: [
      { name: '样例：提取答案', stdin: '', expected: '42' },
      { name: '检查：正则提取', stdin: '', expected: '42' },
      { name: '检查：单行输出', stdin: '', expected: '42' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '42', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { content: '首先计算 6 × 7：根据乘法口诀六七四十二，得到 42。再检查一遍题目要求的是乘积，没有其他运算。所以答案: 42' },
      ],
    }),
  },
  {
    id: 'agentdev-paradigm-4',
    lang: 'agentdev',
    module: 'paradigm',
    order: 4,
    title: '系统提示词设计',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握合格 system 提示词的四要素：身份、边界、语气、兜底',
      '能识别缺失边界的反例提示词的风险',
      '能为客服场景选出最合适的 system 提示词',
    ],
    brief: `## System 提示词：给 Agent 立规矩

system 消息是助手"人格与职责"的总设定，写得好坏直接决定 Agent 的下限。合格的客服 system 提示词包含四要素：

1. **身份与场景**：你是谁、服务于什么平台；
2. **职责边界**：只答什么、不答什么；
3. **语气与风格**：友善、简洁、不啰嗦；
4. **兜底策略**：办不了怎么办（转人工）。

反例的通病是**边界缺失**："无所不知的 AI"会顺着用户聊一切，"诗人"答非所问 —— 都没回答"不归我管的事怎么办"。

类比：招聘时给员工的**岗位说明书** —— 只写"什么都干"的岗位，入职后一定越界。

> 💡 写完 system 提示词，用几组刁钻输入测一测它会不会跑偏。`,
    task: `## 任务：为客服 Agent 选 system 提示词

下面是 4 条候选 system 提示词（已内置在代码里）：

1. \`你是一个无所不知的AI，可以回答任何问题。\`
2. \`你是电商平台"智码商城"的客服助手，只回答订单、物流、售后相关问题，语气友善简洁；超出范围或无法解决的问题，请引导用户联系人工客服。\`
3. \`你是一位诗人，请用优美的诗句回答用户的每一个问题。\`
4. \`请尽量长篇大论地展示你的知识，回答越详细越好。\`

从中选出**最适合客服场景**的一条，输出它的编号。

**输入**：无

**输出**：一行，该候选的编号

\`\`\`text
2
\`\`\``,
    starter: `// 本关不需要调用 llm（没有 Mock 配置），是一道"设计判断"题。
// 四要素：身份与场景 / 职责边界 / 语气与风格 / 兜底策略。

const candidates = [
  '你是一个无所不知的AI，可以回答任何问题。',
  '你是电商平台"智码商城"的客服助手，只回答订单、物流、售后相关问题，语气友善简洁；超出范围或无法解决的问题，请引导用户联系人工客服。',
  '你是一位诗人，请用优美的诗句回答用户的每一个问题。',
  '请尽量长篇大论地展示你的知识，回答越详细越好。',
];

// TODO: 逐条对照四要素，选出最适合客服场景的一条，输出其编号（1~4）

`,
    solution: `const candidates = [
  '你是一个无所不知的AI，可以回答任何问题。',
  '你是电商平台"智码商城"的客服助手，只回答订单、物流、售后相关问题，语气友善简洁；超出范围或无法解决的问题，请引导用户联系人工客服。',
  '你是一位诗人，请用优美的诗句回答用户的每一个问题。',
  '请尽量长篇大论地展示你的知识，回答越详细越好。',
];
// 2 号四要素齐全：身份（电商客服）+ 边界（只答订单/物流/售后）+ 语气（友善简洁）+ 兜底（转人工）
const best = 2;
console.log(best);
`,
    algo: {
      starters: {
        javascript: `// 本关不需要调用 llm（没有 Mock 配置），是一道"设计判断"题。
// 四要素：身份与场景 / 职责边界 / 语气与风格 / 兜底策略。

const candidates = [
  '你是一个无所不知的AI，可以回答任何问题。',
  '你是电商平台"智码商城"的客服助手，只回答订单、物流、售后相关问题，语气友善简洁；超出范围或无法解决的问题，请引导用户联系人工客服。',
  '你是一位诗人，请用优美的诗句回答用户的每一个问题。',
  '请尽量长篇大论地展示你的知识，回答越详细越好。',
];

// TODO: 逐条对照四要素，选出最适合客服场景的一条，输出其编号（1~4）

`,
      },
      solutions: {
        javascript: `const candidates = [
  '你是一个无所不知的AI，可以回答任何问题。',
  '你是电商平台"智码商城"的客服助手，只回答订单、物流、售后相关问题，语气友善简洁；超出范围或无法解决的问题，请引导用户联系人工客服。',
  '你是一位诗人，请用优美的诗句回答用户的每一个问题。',
  '请尽量长篇大论地展示你的知识，回答越详细越好。',
];
// 2 号四要素齐全：身份（电商客服）+ 边界（只答订单/物流/售后）+ 语气（友善简洁）+ 兜底（转人工）
const best = 2;
console.log(best);
`,
      },
    },
    hints: [
      '逐条检查四要素：1 号没有边界与兜底；3 号身份完全错位；4 号风格反效率。',
      '2 号同时写明了身份（"智码商城"客服）、职责边界（订单/物流/售后）、语气（友善简洁）与兜底（转人工）。',
      '输出编号即可：`console.log(best)`，best 是数字 2（输出 "2"）。',
    ],
    tests: [
      { name: '样例：选出最优提示词', stdin: '', expected: '2' },
      { name: '检查：四要素判断', stdin: '', expected: '2' },
      { name: '检查：单行输出', stdin: '', expected: '2' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '2', hidden: true },
    ],
  },
];
