import type { Level } from '@/types';

/** Agent 课程 · 第三章：工具调用与循环（advanced，4 关） */
export const AGENTDEV_ADVANCED: Level[] = [
  {
    id: 'agentdev-advanced-1',
    lang: 'agentdev',
    module: 'advanced',
    order: 1,
    title: '工具注册与调用',
    difficulty: 3,
    xp: 25,
    goals: [
      '理解 Function Calling：模型只"点菜"，执行永远在你的代码里',
      '学会用对象注册工具（name → 函数）',
      '能检测回复中的 toolCalls，执行工具并把结果回填给模型',
    ],
    brief: `## Function Calling：给模型配"工具箱"

模型只会生成文本，查天气、查订单它做不到 —— 但可以**请求调用**你注册的工具，这就是 Function Calling：

1. 你在代码里**注册**工具：名字 + 参数 + 干活的函数；
2. 模型需要时返回 **toolCalls**：\`[{ name: 'getWeather', args: {...} }]\` —— 只是"点菜"，没有执行；
3. **你**执行函数，结果以 tool 消息回填 messages，再 chat 得到最终回复。

类比：模型是**只动嘴的主管**，能开单子不能跑腿；你照单干活、把小票递回去，主管看了才做汇报。

> ⚠️ **工具永远由你的代码执行**，模型只决定调什么、传什么参数。`,
    task: `## 任务：注册天气工具并完成一次调用

Mock 配置两轮：第 1 轮模型请求调用 \`getWeather\`（参数 \`{ city: '北京' }\`），第 2 轮基于工具结果给出最终回复。

1. 注册工具：\`const tools = { getWeather: (args) => '晴 25°C' }\`；
2. 发送 user 消息 \`'北京今天天气怎么样？'\`，调用 \`llm.chat\`；
3. 检测 \`res.toolCalls\`：非空则**逐个执行** —— 按名字从 tools 取函数，传入 \`call.args\`；
4. 每执行一个工具，输出一行：\`工具 <name> → <结果>\`，并把结果以 \`{ role: 'tool', content: result }\` 追加回 messages；
5. 再次调用 \`llm.chat\`，输出其 \`content\` 作为最终回复。

**输入**：无

**输出**：两行

\`\`\`text
工具 getWeather → 晴 25°C
北京今天晴，气温 25°C，适合出行。
\`\`\``,
    starter: `// llm 已注入。配置：第 1 轮返回 toolCalls（getWeather），第 2 轮返回最终回复。
// chat 返回值里的 toolCalls 形如 [{ name: 'getWeather', args: { city: '北京' } }]

// TODO 1: 用对象注册工具 getWeather，返回 '晴 25°C'
// TODO 2: 组装 messages（user: '北京今天天气怎么样？'）并第一次 llm.chat
// TODO 3: 检测 res.toolCalls，执行工具，输出 '工具 <name> → <结果>'，并把结果回填为 tool 消息
// TODO 4: 第二次 llm.chat，输出最终回复

`,
    solution: `const tools = {
  getWeather: (args) => '晴 25°C',
};
const messages = [{ role: 'user', content: '北京今天天气怎么样？' }];
let res = llm.chat(messages);
if (res.toolCalls && res.toolCalls.length > 0) {
  for (const call of res.toolCalls) {
    const result = tools[call.name](call.args);
    console.log('工具 ' + call.name + ' → ' + result);
    messages.push({ role: 'tool', content: result });
  }
  res = llm.chat(messages);
}
console.log(res.content);
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。配置：第 1 轮返回 toolCalls（getWeather），第 2 轮返回最终回复。
// chat 返回值里的 toolCalls 形如 [{ name: 'getWeather', args: { city: '北京' } }]

// TODO 1: 用对象注册工具 getWeather，返回 '晴 25°C'
// TODO 2: 组装 messages（user: '北京今天天气怎么样？'）并第一次 llm.chat
// TODO 3: 检测 res.toolCalls，执行工具，输出 '工具 <name> → <结果>'，并把结果回填为 tool 消息
// TODO 4: 第二次 llm.chat，输出最终回复

`,
      },
      solutions: {
        javascript: `const tools = {
  getWeather: (args) => '晴 25°C',
};
const messages = [{ role: 'user', content: '北京今天天气怎么样？' }];
let res = llm.chat(messages);
if (res.toolCalls && res.toolCalls.length > 0) {
  for (const call of res.toolCalls) {
    const result = tools[call.name](call.args);
    console.log('工具 ' + call.name + ' → ' + result);
    messages.push({ role: 'tool', content: result });
  }
  res = llm.chat(messages);
}
console.log(res.content);
`,
      },
    },
    hints: [
      '工具箱就是普通对象：`const tools = { getWeather: (args) => "晴 25°C" }`；按名字取函数：`tools[call.name]`。',
      '执行后两件事：输出 `"工具 " + call.name + " → " + result`，然后 `messages.push({ role: "tool", content: result })` 把结果回填。',
      '回填完再 `llm.chat(messages)` 一次，这次没有 toolCalls，`res.content` 就是最终回复，直接输出。',
    ],
    tests: [
      { name: '样例：工具执行与最终回复', stdin: '', expected: '工具 getWeather → 晴 25°C\n北京今天晴，气温 25°C，适合出行。' },
      { name: '检查：toolCalls 检测', stdin: '', expected: '工具 getWeather → 晴 25°C\n北京今天晴，气温 25°C，适合出行。' },
      { name: '检查：结果回填后再 chat', stdin: '', expected: '工具 getWeather → 晴 25°C\n北京今天晴，气温 25°C，适合出行。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '工具 getWeather → 晴 25°C\n北京今天晴，气温 25°C，适合出行。', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { toolCalls: [{ name: 'getWeather', args: { city: '北京' } }] },
        { content: '北京今天晴，气温 25°C，适合出行。' },
      ],
    }),
  },
  {
    id: 'agentdev-advanced-2',
    lang: 'agentdev',
    module: 'advanced',
    order: 2,
    title: 'Agent Loop 循环',
    difficulty: 4,
    xp: 35,
    goals: [
      '掌握 Agent Loop：chat → 检测 toolCalls → 执行 → 回填 → 再 chat',
      '理解"模型自主决定调几次工具"的循环终止条件',
      '能实现带最大步数上限的完整循环并输出每轮动作',
    ],
    brief: `## Agent Loop：从"一问一答"到"自主完成任务"

把工具调用的流程放进循环，就得到所有 Agent 框架的内核 —— **Agent Loop**：每轮先 \`llm.chat(messages)\`；返回里**没有 toolCalls** 就输出最终回复并结束；有 toolCalls 就逐个执行，把结果回填为 tool 消息，进入下一轮。

模型像**接了任务的实习生**：查一次资料不够就再查，每拿到一张"小票"就接着思考 —— 你不替它规划步骤，只提供工具和循环。Claude Code 等真实框架，剥掉外壳正是这个循环：**chat → toolCalls → 执行 → 回填 → 再 chat**。

> 💡 生产中务必加**最大步数上限**，防止模型无限调用工具烧钱。`,
    task: `## 任务：实现完整 Agent Loop（本课程标志性关卡）

Mock 配置三轮：第 1 轮请求调用 \`search\`（查课程），第 2 轮请求调用 \`getDetail\`（查详情），第 3 轮给出最终回复。

1. 注册两个工具（参数用不到也要声明）：
   - \`search: (args) => '找到 1 门课程：Agent 实战（编号 CQ-101）'\`
   - \`getDetail: (args) => 'Agent 实战：20 关，含 Mock LLM 判题'\`
2. 发送 user 消息 \`'智码有哪些 Agent 课程？'\`，进入循环（最多 6 轮）；
3. 每轮 chat 后：若无 toolCalls，输出 \`最终回复: <content>\` 并 break；
4. 若有 toolCalls，对每个工具调用输出一行 \`第<step>轮: 调用 <name>\`，执行后把结果回填为 tool 消息，step 加一。

**输入**：无

**输出**：三行

\`\`\`text
第1轮: 调用 search
第2轮: 调用 getDetail
最终回复: 为你找到课程「Agent 实战」：共 20 关，覆盖提示词、工具调用与 RAG，建议从第 1 关开始闯。
\`\`\``,
    starter: `// llm 已注入。配置：第 1、2 轮各返回一次 toolCalls，第 3 轮返回最终回复。
// 完整循环骨架：
//   for (let step = 1; step <= 6; step++) {
//     const res = llm.chat(messages);
//     if (无 toolCalls) { 输出最终回复; break; }
//     for (const call of res.toolCalls) { 执行 → 输出动作 → 回填 tool 消息 }
//   }

// TODO 1: 注册工具 search 与 getDetail
// TODO 2: 组装 messages（user: '智码有哪些 Agent 课程？'）
// TODO 3: 按上方骨架实现循环，工具调用行输出 '第<step>轮: 调用 <name>'
// TODO 4: 最终回复行输出 '最终回复: <content>'

`,
    solution: `const tools = {
  search: (args) => '找到 1 门课程：Agent 实战（编号 CQ-101）',
  getDetail: (args) => 'Agent 实战：20 关，含 Mock LLM 判题',
};
const messages = [{ role: 'user', content: '智码有哪些 Agent 课程？' }];
for (let step = 1; step <= 6; step++) {
  const res = llm.chat(messages);
  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log('最终回复: ' + res.content);
    break;
  }
  for (const call of res.toolCalls) {
    console.log('第' + step + '轮: 调用 ' + call.name);
    const result = tools[call.name](call.args);
    messages.push({ role: 'tool', name: call.name, content: result });
  }
}
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。配置：第 1、2 轮各返回一次 toolCalls，第 3 轮返回最终回复。
// 完整循环骨架：
//   for (let step = 1; step <= 6; step++) {
//     const res = llm.chat(messages);
//     if (无 toolCalls) { 输出最终回复; break; }
//     for (const call of res.toolCalls) { 执行 → 输出动作 → 回填 tool 消息 }
//   }

// TODO 1: 注册工具 search 与 getDetail
// TODO 2: 组装 messages（user: '智码有哪些 Agent 课程？'）
// TODO 3: 按上方骨架实现循环，工具调用行输出 '第<step>轮: 调用 <name>'
// TODO 4: 最终回复行输出 '最终回复: <content>'

`,
      },
      solutions: {
        javascript: `const tools = {
  search: (args) => '找到 1 门课程：Agent 实战（编号 CQ-101）',
  getDetail: (args) => 'Agent 实战：20 关，含 Mock LLM 判题',
};
const messages = [{ role: 'user', content: '智码有哪些 Agent 课程？' }];
for (let step = 1; step <= 6; step++) {
  const res = llm.chat(messages);
  if (!res.toolCalls || res.toolCalls.length === 0) {
    console.log('最终回复: ' + res.content);
    break;
  }
  for (const call of res.toolCalls) {
    console.log('第' + step + '轮: 调用 ' + call.name);
    const result = tools[call.name](call.args);
    messages.push({ role: 'tool', name: call.name, content: result });
  }
}
`,
      },
    },
    hints: [
      '循环终止条件是"回复里没有 toolCalls"：`if (!res.toolCalls || res.toolCalls.length === 0)` 时输出 `最终回复: ` + res.content 并 break。',
      '工具轮里：先输出动作行 `"第" + step + "轮: 调用 " + call.name`，再执行 `tools[call.name](call.args)`，最后 push 一条 role 为 tool 的消息。',
      '循环上限用 `for (let step = 1; step <= 6; step++)` —— Mock 三轮就结束，上限只是安全网，防真实模型无限调用。',
    ],
    tests: [
      { name: '样例：两轮工具后交付', stdin: '', expected: '第1轮: 调用 search\n第2轮: 调用 getDetail\n最终回复: 为你找到课程「Agent 实战」：共 20 关，覆盖提示词、工具调用与 RAG，建议从第 1 关开始闯。' },
      { name: '检查：循环终止条件', stdin: '', expected: '第1轮: 调用 search\n第2轮: 调用 getDetail\n最终回复: 为你找到课程「Agent 实战」：共 20 关，覆盖提示词、工具调用与 RAG，建议从第 1 关开始闯。' },
      { name: '检查：每轮动作可追溯', stdin: '', expected: '第1轮: 调用 search\n第2轮: 调用 getDetail\n最终回复: 为你找到课程「Agent 实战」：共 20 关，覆盖提示词、工具调用与 RAG，建议从第 1 关开始闯。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: '第1轮: 调用 search\n第2轮: 调用 getDetail\n最终回复: 为你找到课程「Agent 实战」：共 20 关，覆盖提示词、工具调用与 RAG，建议从第 1 关开始闯。', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { toolCalls: [{ name: 'search', args: { keyword: 'Agent 课程' } }] },
        { toolCalls: [{ name: 'getDetail', args: { id: 'CQ-101' } }] },
        { content: '为你找到课程「Agent 实战」：共 20 关，覆盖提示词、工具调用与 RAG，建议从第 1 关开始闯。' },
      ],
    }),
  },
  {
    id: 'agentdev-advanced-3',
    lang: 'agentdev',
    module: 'advanced',
    order: 3,
    title: '工具错误处理',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解工具调用的失败面：模型可能请求不存在的工具',
      '学会检测未知工具并输出 UNKNOWN_TOOL 日志',
      '掌握优雅兜底：把失败信息回填后给出兜底回复',
    ],
    brief: `## 工具调用会出错：先想好摔了怎么办

真实系统里，工具调用是**跨网络的远程操作**：接口会下线、参数会超界、权限会失效。健壮的 Agent 至少要处理三类故障：

1. **未知工具**：模型点了菜单上没有的菜 —— 记录 \`UNKNOWN_TOOL: <name>\`，绝不能假装成功；
2. **执行失败**：函数抛异常 —— 把错误信息作为 tool 消息回传；
3. **优雅兜底**：转人工或给固定话术，别让用户看到报错堆栈。

类比：餐厅**没有的菜就老实说"售罄"** —— 顾客（模型）拿到真实信息，才能做出下一步合理决定。

> ⚠️ 把错误"如实回传"比"隐瞒"更好：模型看到失败，往往会换一种问法或道歉收场。`,
    task: `## 任务：接住一次"不存在的工具"调用

Mock 配置两轮：第 1 轮模型请求调用**未注册**的 \`getStock\`（查库存），第 2 轮返回兜底回复。

1. 工具箱**保持为空**：\`const tools = {}\`（\`getStock\` 故意不注册）；
2. 发送 user 消息 \`'帮我查一下商品 A-001 的库存'\`，调用 \`llm.chat\`；
3. 遍历 \`res.toolCalls\`：若 \`tools[call.name]\` 不存在，输出一行 \`UNKNOWN_TOOL: <name>\`，并把消息 \`'工具不存在，调用失败'\` 以 tool 消息回填；
4. 再次调用 \`llm.chat\`，输出其 \`content\`（兜底回复）。

**输入**：无

**输出**：两行

\`\`\`text
UNKNOWN_TOOL: getStock
抱歉，库存查询服务暂时不可用，已为你转接人工客服。
\`\`\``,
    starter: `// llm 已注入。配置：第 1 轮请求调用未注册的 getStock，第 2 轮返回兜底回复。
// 防御要点：取函数前先判断 tools[call.name] 是否存在。

// TODO 1: 声明空工具箱 const tools = {}
// TODO 2: 组装 messages（user: '帮我查一下商品 A-001 的库存'）并第一次 llm.chat
// TODO 3: 遍历 toolCalls，未知工具输出 'UNKNOWN_TOOL: <name>'，回填失败信息为 tool 消息
// TODO 4: 第二次 llm.chat，输出兜底回复

`,
    solution: `const tools = {};
const messages = [{ role: 'user', content: '帮我查一下商品 A-001 的库存' }];
let res = llm.chat(messages);
for (const call of res.toolCalls) {
  const fn = tools[call.name];
  if (!fn) {
    console.log('UNKNOWN_TOOL: ' + call.name);
    messages.push({ role: 'tool', name: call.name, content: '工具不存在，调用失败' });
  }
}
res = llm.chat(messages);
console.log(res.content);
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。配置：第 1 轮请求调用未注册的 getStock，第 2 轮返回兜底回复。
// 防御要点：取函数前先判断 tools[call.name] 是否存在。

// TODO 1: 声明空工具箱 const tools = {}
// TODO 2: 组装 messages（user: '帮我查一下商品 A-001 的库存'）并第一次 llm.chat
// TODO 3: 遍历 toolCalls，未知工具输出 'UNKNOWN_TOOL: <name>'，回填失败信息为 tool 消息
// TODO 4: 第二次 llm.chat，输出兜底回复

`,
      },
      solutions: {
        javascript: `const tools = {};
const messages = [{ role: 'user', content: '帮我查一下商品 A-001 的库存' }];
let res = llm.chat(messages);
for (const call of res.toolCalls) {
  const fn = tools[call.name];
  if (!fn) {
    console.log('UNKNOWN_TOOL: ' + call.name);
    messages.push({ role: 'tool', name: call.name, content: '工具不存在，调用失败' });
  }
}
res = llm.chat(messages);
console.log(res.content);
`,
      },
    },
    hints: [
      '对象取不存在的键得到 `undefined`：`const fn = tools[call.name]; if (!fn) { ... }` 就是"未知工具"的判断。',
      '日志格式严格是 `UNKNOWN_TOOL: getStock`（大写、冒号后一个空格）：`console.log("UNKNOWN_TOOL: " + call.name)`。',
      '回填失败信息后**再 chat 一次**，Mock 第 2 轮会返回兜底话术，输出 `res.content` 即可。',
    ],
    tests: [
      { name: '样例：未知工具兜底', stdin: '', expected: 'UNKNOWN_TOOL: getStock\n抱歉，库存查询服务暂时不可用，已为你转接人工客服。' },
      { name: '检查：UNKNOWN_TOOL 日志', stdin: '', expected: 'UNKNOWN_TOOL: getStock\n抱歉，库存查询服务暂时不可用，已为你转接人工客服。' },
      { name: '检查：兜底回复', stdin: '', expected: 'UNKNOWN_TOOL: getStock\n抱歉，库存查询服务暂时不可用，已为你转接人工客服。' },
      { name: '隐藏：逐字符比对', stdin: '', expected: 'UNKNOWN_TOOL: getStock\n抱歉，库存查询服务暂时不可用，已为你转接人工客服。', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        { toolCalls: [{ name: 'getStock', args: { sku: 'A-001' } }] },
        { content: '抱歉，库存查询服务暂时不可用，已为你转接人工客服。' },
      ],
    }),
  },
  {
    id: 'agentdev-advanced-4',
    lang: 'agentdev',
    module: 'advanced',
    order: 4,
    title: '并行工具调用',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解并行工具调用：单轮回复携带多个 toolCalls',
      '能按顺序执行多个工具并逐行输出结果',
      '知道真实 API 中并发执行与结果配对的要点',
    ],
    brief: `## 并行工具调用：一张单子点多道菜

用户一次问"北京天气怎么样、现在几点"，模型可以**在同一个回合里返回多个 toolCalls** —— 这就是并行工具调用：\`res.toolCalls\` 数组一次装着两个调用，你的循环逐个执行，把**每个**结果都回填为 tool 消息。

真实 API 中这些调用相互独立，可**并发**执行（如 Promise.all）省时间；本课程沙箱是同步的，按数组顺序依次执行即可，结果与并发完全一致。

类比：点外卖说"**一杯奶茶加一份鸡排**" —— 商家不必等奶茶做好才去炸鸡排，两件事同时进行，最后一起交付。

> 💡 并发执行时结果要靠唯一标识与 toolCalls 一一配对，避免"张冠李戴"。`,
    task: `## 任务：一轮执行两个工具

Mock 配置**单轮**，返回两个 toolCalls：\`getWeather\`（参数 \`{ city: '北京' }\`）与 \`getTime\`（参数 \`{ zone: '东八区' }\`）。

1. 注册两个工具：
   - \`getWeather: (args) => '北京晴，25°C'\`
   - \`getTime: (args) => '14:00'\`
2. 发送 user 消息 \`'北京现在天气如何？几点了？'\`，调用 \`llm.chat\`；
3. 按 toolCalls 数组**顺序**逐个执行，每行输出 \`<name> → <结果>\`。

**输入**：无

**输出**：两行

\`\`\`text
getWeather → 北京晴，25°C
getTime → 14:00
\`\`\``,
    starter: `// llm 已注入。配置：单轮返回两个 toolCalls（getWeather、getTime）。
// res.toolCalls 是数组 —— 遍历它，逐个执行并输出。

// TODO 1: 注册工具 getWeather（返回 '北京晴，25°C'）与 getTime（返回 '14:00'）
// TODO 2: 组装 messages（user: '北京现在天气如何？几点了？'）并调用 llm.chat
// TODO 3: 遍历 res.toolCalls，按顺序执行，每行输出 '<name> → <结果>'

`,
    solution: `const tools = {
  getWeather: (args) => '北京晴，25°C',
  getTime: (args) => '14:00',
};
const messages = [{ role: 'user', content: '北京现在天气如何？几点了？' }];
const res = llm.chat(messages);
for (const call of res.toolCalls) {
  const result = tools[call.name](call.args);
  console.log(call.name + ' → ' + result);
}
`,
    algo: {
      starters: {
        javascript: `// llm 已注入。配置：单轮返回两个 toolCalls（getWeather、getTime）。
// res.toolCalls 是数组 —— 遍历它，逐个执行并输出。

// TODO 1: 注册工具 getWeather（返回 '北京晴，25°C'）与 getTime（返回 '14:00'）
// TODO 2: 组装 messages（user: '北京现在天气如何？几点了？'）并调用 llm.chat
// TODO 3: 遍历 res.toolCalls，按顺序执行，每行输出 '<name> → <结果>'

`,
      },
      solutions: {
        javascript: `const tools = {
  getWeather: (args) => '北京晴，25°C',
  getTime: (args) => '14:00',
};
const messages = [{ role: 'user', content: '北京现在天气如何？几点了？' }];
const res = llm.chat(messages);
for (const call of res.toolCalls) {
  const result = tools[call.name](call.args);
  console.log(call.name + ' → ' + result);
}
`,
      },
    },
    hints: [
      '注册两个工具就是对象里放两个键；调用一次 `llm.chat` 后，`res.toolCalls.length` 应为 2。',
      '`for (const call of res.toolCalls)` 天然按数组顺序执行：先 getWeather 后 getTime。',
      '输出行格式：`call.name + " → " + result`，注意箭头两侧各有一个空格。',
    ],
    tests: [
      { name: '样例：两个工具各一行', stdin: '', expected: 'getWeather → 北京晴，25°C\ngetTime → 14:00' },
      { name: '检查：执行顺序', stdin: '', expected: 'getWeather → 北京晴，25°C\ngetTime → 14:00' },
      { name: '检查：结果格式', stdin: '', expected: 'getWeather → 北京晴，25°C\ngetTime → 14:00' },
      { name: '隐藏：逐字符比对', stdin: '', expected: 'getWeather → 北京晴，25°C\ngetTime → 14:00', hidden: true },
    ],
    runtime: JSON.stringify({
      turns: [
        {
          toolCalls: [
            { name: 'getWeather', args: { city: '北京' } },
            { name: 'getTime', args: { zone: '东八区' } },
          ],
        },
      ],
    }),
  },
];
