import type { Term } from './types';

/** agent 领域术语：模型基础 / Agent 核心 / 知识增强 / 工程与质量 */
export const AGENT_AGENT: Term[] = [
  // ==================== 模型基础 ====================
  {
    id: 'agent-llm',
    name: 'LLM 大语言模型',
    en: 'Large Language Model',
    cat: 'agent',
    sub: '模型基础',
    tags: ['LLM', '预训练', '生成'],
    summary: 'LLM 是在海量文本上预训练的大规模神经网络，按概率逐 token 生成文本，是 Agent 的推理大脑。',
    detail: `**是什么**：LLM（大语言模型）是基于 Transformer 架构、在数万亿 token 文本上预训练的神经网络，参数量从数十亿到万亿级，代表如 GPT、Claude、Gemini、GLM。

**解决什么问题**：让机器"理解并生成"自然语言——问答、写作、翻译、写代码，一切文本任务都能通过对话完成，成为 Agent 的通用认知引擎。

**如何工作**：
- 输入文本被分词成 token 序列
- 模型基于全部上下文预测下一个 token 的概率分布
- 采样出下一个 token 拼回输入，自回归地逐词生成

**关键认知**：LLM 只做"下一个 token 预测"，不会真的执行动作、查数据库——所以需要 Agent Loop 与工具调用把它接入真实世界。`,
    relations: [
      { to: 'agent-token', desc: 'token 是 LLM 的基本输入输出单位' },
      { to: 'ai-transformer', desc: 'Transformer 自注意力是 LLM 的架构基石' },
      { to: 'agent-agent-loop', desc: 'Agent Loop 让只会写文本的 LLM 真正做成事' },
      { to: 'agent-tool-calling', desc: '工具调用是 LLM 与真实世界的接口' },
    ],
    interview: '基础考点：LLM 自回归生成的含义；为什么 LLM 本身不能联网查数据；上下文窗口对能力的意义。',
  },
  {
    id: 'agent-token',
    name: 'Token 与分词',
    en: 'Token & Tokenization',
    cat: 'agent',
    sub: '模型基础',
    tags: ['分词', '计费', 'BPE'],
    summary: 'Token 是模型处理文本的最小单位，介于字与词之间，上下文长度、计费与速度均按 token 计。',
    detail: `**是什么**：Token 是 LLM 词表中的基本单元，由分词器（BPE 等算法）切分而成：一个英文单词可能是一个 token，一个汉字常占 1-2 个 token，罕见词会被拆碎。

**解决什么问题**：神经网络只吃数字；分词把任意文本映射成固定词表内的 ID 序列模型才能计算，且共享子词大幅压缩词表规模。

**关键换算**：
- 英文约 1 token ≈ 0.75 个单词（约 4 字符）
- 中文约 1 token ≈ 0.5-1 个汉字，因模型词表而异
- 128K 上下文 ≈ 能读下一整本长篇小说

**实践要点**：计费与限速都按 token 口径，提示词里冗余示例直接烧钱；token ≠ 字 ≠ 词，估算输出长度、成本与上下文预算时必须按 token 折算。`,
    relations: [
      { to: 'agent-llm', desc: 'LLM 的输入输出序列都以 token 为单位' },
      { to: 'agent-context-window', desc: '上下文窗口容量按 token 计量' },
      { to: 'agent-streaming', desc: '流式输出按 token/块粒度增量推送' },
    ],
    interview: '常见陷阱："输出 1000 字"与"输出 1000 token"的成本差异；为什么中文 token 效率直接影响费用。',
  },
  {
    id: 'agent-context-window',
    name: '上下文窗口',
    en: 'Context Window',
    cat: 'agent',
    sub: '模型基础',
    tags: ['上下文', '记忆', '限制'],
    summary: '上下文窗口是模型单次可见的 token 上限，装着系统提示、对话历史与工具结果，是短期记忆边界。',
    detail: `**是什么**：上下文窗口是 LLM 一次推理能处理的最大 token 数，涵盖系统提示、历史对话、检索内容与工具返回——窗口之外的内容模型完全"看不见"。

**解决什么问题**：模型没有自带记忆，每次调用都是"金鱼视角"；上下文窗口定义了它当前能记住和推理的信息总量，也决定任务复杂度上限。

**如何工作**：
- 每轮把累积的对话整体重新发给模型
- 超窗会报错或被截断，最早的"记忆"先消失
- 主流窗口从 128K 到 1M token，长窗仍有"中间遗忘"现象

**实践要点**：窗口是稀缺资源，要做预算分配：系统提示、Few-shot、RAG 片段、历史各占多少；长对话用摘要压缩，外部知识用 RAG 按需注入，而不是全塞进去。`,
    relations: [
      { to: 'agent-token', desc: '窗口容量以 token 为计量单位' },
      { to: 'agent-memory', desc: '窗口即短期记忆，长期记忆靠外挂存储' },
      { to: 'agent-rag', desc: 'RAG 只把最相关片段注入窗口，节省预算' },
    ],
    interview: '高频考点：上下文超限的三种处理（截断/摘要/检索）；为什么窗口大不等于记得牢（lost in the middle）。',
  },
  {
    id: 'agent-temperature',
    name: '温度与采样',
    en: 'Temperature & Sampling',
    cat: 'agent',
    sub: '模型基础',
    tags: ['采样', '随机性', '调参'],
    summary: '温度控制输出分布的随机性：越低越确定，越高越发散，Agent 工具调用场景常取低温求稳。',
    detail: `**是什么**：温度（Temperature）是采样超参数：对模型输出的概率分布做缩放后再抽样。温度趋近 0 时总选最高概率 token（贪心），温度越高长尾 token 越有机会被选中。

**解决什么问题**：同一提示，想要不同结果（写文案）还是稳定结果（抽取数据、生成函数调用）？温度是控制"确定性与多样性"的旋钮。

**采样家族**：
- Greedy：温度 0，完全确定
- Top-p（核采样）：只在累计概率前 p 的候选里抽
- Top-k：只在前 k 个候选里抽

**实践要点**：结构化抽取、代码、工具调用用低温度（0-0.3）；创意写作、头脑风暴用高温度（0.7-1.0）；评测与回归测试必须固定温度保证可复现。`,
    relations: [
      { to: 'agent-llm', desc: '温度作用于 LLM 逐 token 的采样过程' },
      { to: 'agent-hallucination', desc: '高温加剧自由发挥，幻觉风险随之上升' },
      { to: 'agent-evals', desc: '评测需固定温度与随机种子保证可复现' },
    ],
    interview: '调参考点：为什么 RAG 问答要低温、写诗要高温；temperature 与 top-p 能否同时调；评测为什么必须锁定温度。',
  },
  {
    id: 'agent-system-prompt',
    name: 'System Prompt',
    en: 'System Prompt',
    cat: 'agent',
    sub: '模型基础',
    tags: ['提示词', '角色设定', '约束'],
    summary: 'System Prompt 是设定模型角色、规则与输出边界的最高优先级指令，相当于 Agent 的宪法。',
    detail: `**是什么**：System Prompt（系统提示）是在对话开始前注入的最高优先级指令，定义模型是谁、遵守什么规则、以什么格式回应，用户通常不可见。

**解决什么问题**：没有角色与边界的模型行为漂移：一会中文一会英文、格式随机、越界回答；System Prompt 把"人设 + 纪律"固化为每次请求的基准。

**典型结构**：
- 角色与目标：你是谁、为谁服务
- 能力清单：可用的工具与调用时机
- 约束红线：不做什么、拒绝策略
- 输出格式：JSON Schema、语气、长度

**实践要点**：规则要具体可执行，"要礼貌"不如"先复述用户目标再给方案"；系统提示与用户输入分开存放防覆盖；每次修改都要跑评测集回归。`,
    relations: [
      { to: 'agent-prompt-engineering', desc: '系统提示是提示工程的最高优先级产物' },
      { to: 'agent-guardrails', desc: '护栏策略常写入系统提示并配合外部拦截' },
      { to: 'agent-agent-loop', desc: 'Agent 循环的每一轮都携带系统提示' },
    ],
    interview: '实践考点：System Prompt 与用户消息谁优先级高；如何防止用户通过多轮对话"越狱"改写系统提示。',
  },
  {
    id: 'agent-hallucination',
    name: '幻觉',
    en: 'Hallucination',
    cat: 'agent',
    sub: '模型基础',
    tags: ['可靠性', '事实性', '风险'],
    summary: '幻觉指模型自信地编造不存在的事实，根因是概率预测而非事实查询，RAG 与护栏是主要对策。',
    detail: `**是什么**：幻觉（Hallucination）指 LLM 生成看似合理实则错误、虚构的内容：编造不存在的论文、API、法条，而且语气笃定。

**解决什么问题**：根因在生成机制——模型只预测"像真的"的 token，没有内置事实校验器；理解幻觉才能设计系统性防御，而不是指望模型"自觉不胡说"。

**典型成因**：
- 知识缺失：训练数据没覆盖或已经过期
- 提问诱导："为什么 X 是对的"类前提陷阱
- 高温度采样放大长尾错误输出

**防御组合拳**：
- RAG：让模型依据检索到的真实资料作答
- 要求引用来源、允许回答"不知道"
- 低温度 + 结构化输出约束
- 关键场景加事实核查或人工确认`,
    relations: [
      { to: 'agent-rag', desc: 'RAG 让模型引用真实检索内容压制幻觉' },
      { to: 'ai-confidence', desc: '置信度可用于识别可疑输出' },
      { to: 'agent-guardrails', desc: '护栏在输出侧拦截与核查事实' },
      { to: 'agent-hitl', desc: '高风险回答转人工复核兜底' },
    ],
    interview: '必考：幻觉的根因是什么；为什么把"禁止编造"写进提示词也不完全可靠；如何用引用溯源降低幻觉危害。',
  },
  {
    id: 'agent-streaming',
    name: '流式输出',
    en: 'Streaming Output',
    cat: 'agent',
    sub: '模型基础',
    tags: ['流式', 'SSE', '体验'],
    summary: '流式输出让 token 边生成边推送到前端，首字延迟从数十秒降到一秒内，是对话产品标配。',
    detail: `**是什么**：流式输出（Streaming）指服务端不等完整结果生成，而是每产出一段（通常逐 token 或逐块）就通过 SSE/WebSocket 推给客户端，界面打字机式呈现。

**解决什么问题**：长回答完整生成要几十秒，用户盯着空白极易流失；流式把"总耗时"转化为"首字时间"体验，秒级出字大幅提升体感。

**如何工作**：
- 服务端以 chunk 形式增量发送，SSE 是最常见载体
- 客户端维护缓冲区拼接 chunk，边收边渲染
- 结束时收到终止原因（stop / length / tool_calls）

**实践要点**：流式与工具调用叠加时，要先收齐完整 tool_calls 参数再执行；用户中断需通知服务端终止生成以省算力；错误处理要考虑半截输出的回退。`,
    relations: [
      { to: 'agent-llm', desc: '流式转发的是自回归生成的增量结果' },
      { to: 'agent-token', desc: '推送粒度就是 token 或小块' },
      { to: 'net-http', desc: 'SSE 基于 HTTP 长连接实现服务端推送' },
    ],
    interview: '工程考点：SSE 与 WebSocket 的选型依据；流式场景如何处理工具调用与内容审核；首字延迟由哪些环节构成。',
  },

  // ==================== Agent 核心 ====================
  {
    id: 'agent-agent-loop',
    name: 'Agent Loop',
    en: 'Agent Loop',
    cat: 'agent',
    sub: 'Agent 核心',
    tags: ['循环', '执行引擎', '架构'],
    summary: 'Agent Loop 是"思考→调用工具→观察结果→再思考"的循环，是 Agent 与普通聊天机器人的分水岭。',
    detail: `**是什么**：Agent Loop（代理循环）是 Agent 的基本执行引擎：把用户目标交给 LLM，模型决定调用什么工具，程序执行后把结果回喂，模型继续推理，循环直至任务完成。

**解决什么问题**：LLM 单轮只能"说"，不能"做"；Agent Loop 把多轮推理与真实动作串起来，让模型能查数据库、写文件、下订单——从聊天机器人变成干活的 Agent。

**循环骨架**：
1. 组装上下文（系统提示 + 目标 + 历史）
2. 调 LLM → 返回文本或工具调用请求
3. 执行工具，把结果追加进上下文
4. 重复，直到模型给出最终答案或触发停止条件

**实践要点**：必须设最大迭代数与预算上限防死循环；每轮上下文膨胀要做裁剪/摘要；工具报错要让模型看见错误信息，才能自我纠正。`,
    relations: [
      { to: 'agent-react', desc: 'ReAct 是 Agent Loop 中"边推理边行动"的经典模式' },
      { to: 'agent-tool-calling', desc: '工具调用是循环中的"行动"环节' },
      { to: 'agent-planning', desc: '规划决定循环内步骤的组织方式' },
    ],
    example: `Agent Loop 伪代码（Python 风格）

messages = [system_prompt, user_task]
for step in range(MAX_STEPS):        # 防死循环：上限 20 轮
    resp = llm.chat(messages, tools=tool_schemas)

    if resp.tool_calls:              # 模型要求调用工具
        for call in resp.tool_calls:
            result = execute(call.name, call.args)  # 程序侧真正执行
            messages.append(tool_result(call.id, result))
        continue                     # 结果回喂，进入下一轮

    final = resp.content             # 无工具调用 -> 最终答案
    break
else:
    final = fallback("达到最大轮数，转人工")`,
    exampleLang: 'python',
    interview: '核心考点：画出 Agent Loop 流程；循环的终止条件有哪些；上下文逐轮膨胀怎么处理。',
  },
  {
    id: 'agent-react',
    name: 'ReAct 模式',
    en: 'Reasoning + Acting',
    cat: 'agent',
    sub: 'Agent 核心',
    tags: ['ReAct', '推理', '范式'],
    summary: 'ReAct 让模型交替输出"思考-行动-观察"，把推理与工具使用串联成轨迹，是 Agent 经典范式。',
    detail: `**是什么**：ReAct（Reasoning + Acting）是经典 Agent 范式：模型在轨迹中交替产出 Thought（推理）、Action（行动）、Observation（观察），逐步逼近答案。

**解决什么问题**：纯推理只能闭卷冥想，接触不到外界事实；纯行动则盲目试错。ReAct 让推理指导行动、观察修正推理，显著降低幻觉与无效调用。

**典型轨迹**：
- Thought: 需要先查库存
- Action: search_inventory(商品A)
- Observation: 库存 3 件，直接下单

**与相邻概念**：CoT 是纯文本推理链，ReAct 是"CoT + 工具"的落地；Agent Loop 是执行引擎，ReAct 是驱动决策的经典模式。`,
    relations: [
      { to: 'agent-agent-loop', desc: 'ReAct 是 Agent Loop 的经典驱动模式' },
      { to: 'agent-cot', desc: 'ReAct 的 Thought 环节就是思维链推理' },
      { to: 'agent-tool-calling', desc: 'Action 在现代实现中即工具调用' },
    ],
    example: `ReAct 轨迹示例：帮我看看明天上海适合跑步吗

Thought: 我需要明天上海的天气，再判断是否适合跑步
Action: weather.get(city="上海", date="明天")
Observation: 晴转多云，15-22°C，空气质量优，西北风 3 级

Thought: 温度适宜、空气好、风力小，适合户外跑步
Action: finish(answer="适合。明天上海 15-22°C，晴转多云，
         空气质量优，很适合户外运动。")`,
    exampleLang: 'text',
    interview: '辨析题：ReAct 与 CoT 的区别；轨迹中的 Observation 由谁产生；失败观察如何让模型自我纠正。',
  },
  {
    id: 'agent-planning',
    name: '任务规划',
    en: 'Task Planning',
    cat: 'agent',
    sub: 'Agent 核心',
    tags: ['规划', '拆解', '长任务'],
    summary: '任务规划让 Agent 先把目标拆解成子任务与执行顺序，再按计划逐步执行，是完成长程任务的前提。',
    detail: `**是什么**：任务规划（Planning）指 Agent 在执行前或执行中，把模糊的大目标分解为有序、可验证的子任务，并动态调整计划的能力。

**解决什么问题**：复杂目标（"调研竞品并写报告"）直接扔给模型会漏步骤、顺序混乱；先规划再执行，让每步小而可验证，长程任务成功率大增。

**常见策略**：
- 计划先行：一次生成完整任务清单，逐项执行
- ReAct 式渐进：边做边决定下一步
- 分层规划：先粗计划，子任务再细分
- 反思重规划：执行失败或环境变化时修订计划

**实践要点**：计划要落成结构化清单（状态可跟踪）；步骤间传递的数据要显式定义；过度规划与频繁重规划都会拖慢收敛，用评测驱动调优节奏。`,
    relations: [
      { to: 'agent-agent-loop', desc: '规划决定循环里先做什么、后做什么' },
      { to: 'agent-multi-agent', desc: '复杂计划可拆给多个专职 Agent 并行执行' },
      { to: 'agent-react', desc: 'ReAct 是不显式出计划的渐进式规划' },
    ],
    interview: '设计题：计划先行 vs 渐进式规划的适用场景；如何让 Agent 在子任务失败后合理重规划。',
  },
  {
    id: 'agent-tool-calling',
    name: '工具调用 Function Calling',
    en: 'Function Calling',
    cat: 'agent',
    sub: 'Agent 核心',
    tags: ['工具调用', 'JSON Schema', '集成'],
    summary: '工具调用让模型输出结构化 JSON 声明要调的函数与参数，由程序执行后把结果回喂模型。',
    detail: `**是什么**：Function Calling（工具调用）是 LLM 的结构化输出能力：开发者注册函数的名称、描述与 JSON Schema 参数，模型判断需要时输出符合 Schema 的调用请求，由程序执行并回喂结果。

**解决什么问题**：模型知识有截止日期、无法操作真实世界；工具调用是 LLM 与数据库、API、文件系统的桥梁，也是一切 Agent 能力的地基。

**完整闭环**：
1. 请求中携带工具定义列表
2. 模型返回 tool_calls（函数名 + JSON 参数）
3. 程序校验参数并真正执行
4. 结果以 tool 角色消息追加，模型继续推理

**要点**：模型只"点菜"不"做饭"——执行永远在代码侧；工具描述质量直接决定调用准确率；参数校验与权限控制不能省。`,
    relations: [
      { to: 'agent-mcp', desc: 'MCP 统一了工具的发现与接入协议' },
      { to: 'agent-agent-loop', desc: '工具调用是 Agent Loop 的执行环节' },
      { to: 'be-rest', desc: '工具常是对内部 REST API 的安全封装' },
    ],
    example: `/* 请求：注册工具定义 */
{
  "model": "glm-4",
  "messages": [{ "role": "user", "content": "查北京明天天气" }],
  "tools": [{
    "type": "function",
    "function": {
      "name": "get_weather",
      "description": "查询指定城市指定日期的天气",
      "parameters": {
        "type": "object",
        "properties": {
          "city": { "type": "string", "description": "城市名" },
          "date": { "type": "string", "description": "YYYY-MM-DD" }
        },
        "required": ["city"]
      }
    }
  }]
}

/* 模型返回的调用请求：只"点菜"，不执行 */
{
  "tool_calls": [{
    "id": "call_abc123",
    "function": {
      "name": "get_weather",
      "arguments": "{\\"city\\": \\"北京\\", \\"date\\": \\"2026-11-03\\"}"
    }
  }]
}`,
    exampleLang: 'json',
    interview: '核心考点：模型是否真的执行了函数；工具描述如何影响选择准确率；如何防参数注入与越权调用。',
  },
  {
    id: 'agent-mcp',
    name: 'MCP 协议',
    en: 'Model Context Protocol',
    cat: 'agent',
    sub: 'Agent 核心',
    tags: ['协议', '工具生态', '标准化'],
    summary: 'MCP 是连接 AI 应用与外部工具、数据源的开放协议，让工具生态像 USB 一样即插即用。',
    detail: `**是什么**：MCP（Model Context Protocol）是 Anthropic 开放的协议，标准化 AI 应用（Host）与外部工具提供方（MCP Server）之间的通信。

**解决什么问题**：M 个应用对接 N 个工具本要写 M×N 份胶水代码；MCP 统一协议后，Server 写一次，任何支持的 Host 都能用——生态从网状变星形。

**架构角色**：
- Host：Claude、IDE 等 AI 应用
- Client：Host 内维护与 Server 的连接
- Server：暴露 Tools、Resources、Prompts

**实践要点**：MCP 管"工具怎么接入"，Function Calling 管"怎么调用"，两者互补；敏感 Server 做好鉴权与最小权限。`,
    relations: [
      { to: 'agent-tool-calling', desc: 'MCP Server 的 Tools 最终以工具调用形式执行' },
      { to: 'be-api-gateway', desc: 'MCP 在工具世界扮演统一网关的角色' },
      { to: 'be-registry', desc: 'MCP Server 的注册与发现类似注册中心思想' },
    ],
    interview: '生态考点：MCP 解决的 M×N 问题是什么；MCP Server 的三类能力；MCP 与 Function Calling 的关系。',
  },
  {
    id: 'agent-memory',
    name: '记忆机制',
    en: 'Memory',
    cat: 'agent',
    sub: 'Agent 核心',
    tags: ['记忆', '状态', '个性化'],
    summary: '记忆机制让 Agent 跨轮次保存信息：上下文窗口承担短期记忆，向量库与结构化存储承担长期记忆。',
    detail: `**是什么**：Agent 记忆是让系统跨轮次、跨会话保留并利用信息的机制总称，通常分层：短期记忆 = 上下文窗口内的对话；长期记忆 = 窗口外持久化的用户偏好、事实与历史结论。

**解决什么问题**：窗口有限且会话结束即遗忘；没有外挂记忆，Agent 每次都从零开始，用户要反复交代偏好。

**常见分层**：
- 短期：对话历史，超窗时滑动截断或摘要压缩
- 长期：向量库存语义记忆，结构化库存用户档案
- 工作记忆：当前任务的中间状态与计划

**实践要点**：记忆写入要做筛选（不是所有对话都值得记）；检索记忆时按相关性与时效加权；提供查看/删除接口，涉及个人信息需合规设计。`,
    relations: [
      { to: 'agent-context-window', desc: '窗口是短期记忆的物理上限' },
      { to: 'agent-vector-db', desc: '长期记忆常用向量库做语义检索' },
      { to: 'agent-rag', desc: '检索自身历史本质是 RAG 思想的应用' },
    ],
    interview: '设计题：短期与长期记忆的分界；会话摘要压缩的时机与风险；用户记忆的合规删除怎么做。',
  },
  {
    id: 'agent-multi-agent',
    name: '多智能体协作',
    en: 'Multi-Agent Collaboration',
    cat: 'agent',
    sub: 'Agent 核心',
    tags: ['多智能体', '编排', '分工'],
    summary: '多智能体把复杂任务分派给多个角色化 Agent 协作，以分工、通信与编排换取专业性与并行性。',
    detail: `**是什么**：多智能体系统由多个各司其职的 Agent 组成：规划者、研究员、编码者、评审者等，通过消息传递与编排协同完成单个 Agent 难以胜任的任务。

**解决什么问题**：单 Agent 上下文有限、职责过载、只能串行；分工让每个 Agent 的系统提示更聚焦、上下文更干净，子任务还能并行推进。

**常见编排模式**：
- 主管-工人：一个协调者分派与汇总
- 流水线：产出物按阶段流转
- 辩论/评审：多 Agent 互查提升质量
- 群聊式：共享消息总线自由协作

**实践要点**：先把单 Agent 推到极限再上多智能体——通信成本与错误级联是真实代价；明确每个 Agent 的输入输出契约，并各自建立评测。`,
    relations: [
      { to: 'agent-agent-loop', desc: '每个 Agent 内部仍是独立运行的循环' },
      { to: 'agent-planning', desc: '规划者负责把大任务拆分并分派' },
      { to: 'be-microservices', desc: '多智能体分工与微服务解耦异曲同工' },
    ],
    interview: '架构题：什么时候值得引入多智能体；主管-工人模式如何防止信息损耗；多 Agent 的成本与错误放大问题。',
  },
  {
    id: 'agent-hitl',
    name: '人机协同 Human-in-the-loop',
    en: 'Human-in-the-Loop',
    cat: 'agent',
    sub: 'Agent 核心',
    tags: ['人机协同', '审批', '风控'],
    summary: '人机协同在关键动作前暂停并请求人工确认，用检查点机制平衡自动化效率与风险控制。',
    detail: `**是什么**：Human-in-the-Loop（HITL，人机协同）指在自动化流程的关键节点引入人工判断：Agent 执行高危操作前暂停，请人批准、修改或否决，再继续执行。

**解决什么问题**：全自动 Agent 一旦误判（删库、转账、群发邮件）代价不可逆；人机协同把"信任边界"量化：低风险自动放行，高风险人来拍板。

**典型检查点**：
- 执行写入/支付/删除类工具前
- 输出对外发布（邮件、公告）前
- 置信度低或多次重试失败时转人工
- 敏感数据访问需要授权时

**实践要点**：确认界面要展示足够上下文（将执行什么、为什么）；等待人工不能阻塞无关任务流；记录每次人工决策用于审计与评测回流。`,
    relations: [
      { to: 'agent-guardrails', desc: '护栏自动拦截 + 人工复核构成两道防线' },
      { to: 'agent-agent-loop', desc: '检查点嵌入 Agent 循环的暂停-恢复' },
      { to: 'ai-confidence', desc: '低置信度输出自动路由给人工处理' },
    ],
    interview: '设计题：哪些动作必须设人工确认点；等待确认时如何保持 Agent 状态可恢复；人工反馈怎样回流成评测集。',
  },

  // ==================== 知识增强 ====================
  {
    id: 'agent-rag',
    name: 'RAG 检索增强生成',
    en: 'Retrieval-Augmented Generation',
    cat: 'agent',
    sub: '知识增强',
    tags: ['RAG', '检索', '知识增强'],
    summary: 'RAG 先从知识库检索相关片段再注入上下文生成回答，为模型外挂私有知识并抑制幻觉。',
    detail: `**是什么**：RAG（Retrieval-Augmented Generation，检索增强生成）在生成前先从外部知识库检索相关内容，拼接进提示再让模型作答——相当于"开卷考试"。

**解决什么问题**：模型不懂私有文档、知识会过期、幻觉难根除；微调成本高且不适合频繁更新的事实，RAG 以"不改模型、改输入"的方式低成本解决。

**离线 + 在线两段**：
- 离线索引：文档 → 清洗 → 切块 → Embedding → 入向量库
- 在线检索：查询向量化 → 相似度召回 TopK →（可选重排）→ 注入提示 → 生成

**实践要点**：切块大小与重叠影响召回粒度；混合检索（关键词 + 向量）与重排模型显著提升精度；答案要求附引用便于核查，检索不到时诚实说不知道。`,
    relations: [
      { to: 'agent-embedding', desc: '检索依赖 Embedding 的语义相似度' },
      { to: 'agent-vector-db', desc: '向量库承担在线召回' },
      { to: 'agent-knowledge-base', desc: '知识库是 RAG 的数据源' },
      { to: 'agent-hallucination', desc: 'RAG 让模型引用真实资料压制幻觉' },
    ],
    example: `# RAG 两阶段流程（Python 伪代码）

# ---- 离线：建索引 ----
chunks = split_documents(load_docs("./handbook"), size=500, overlap=50)
vectors = [embed(c.text) for c in chunks]
vector_db.insert(vectors, metadata=[c.meta for c in chunks])

# ---- 在线：检索增强回答 ----
def answer(question):
    q_vec  = embed(question)
    hits   = vector_db.search(q_vec, top_k=5)   # 语义召回
    hits   = rerank(question, hits, top_k=3)    # 精排出前 3
    context = "\\n---\\n".join(h.text for h in hits)
    prompt  = f"仅依据以下资料回答并标注引用编号：\\n{context}\\n\\n问题：{question}"
    return llm.chat(prompt)                     # 生成带引用的答案`,
    exampleLang: 'python',
    interview: '必考：RAG 与微调如何选；提升召回率与精度的手段；切块策略为什么重要。',
  },
  {
    id: 'agent-embedding',
    name: 'Embedding 向量表示',
    en: 'Embedding',
    cat: 'agent',
    sub: '知识增强',
    tags: ['向量', '语义', '表示学习'],
    summary: 'Embedding 把文本映射为高维向量，语义相近则向量距离近，是语义检索与 RAG 的数学地基。',
    detail: `**是什么**：Embedding（向量表示）是模型把文本、图片等编码为固定长度的高维浮点向量（如 1536 维），使语义相似的输入在向量空间中距离更近。

**解决什么问题**：关键词匹配搜不出"退货政策 ≈ 退款规则"这类同义表达；向量把语义变成几何问题，"意思相近"变成"距离更近"。

**如何工作**：
- 文本经 Embedding 模型前向计算输出向量
- 相似度用余弦相似度或内积度量
- 查询与文档必须用同一模型编码，才在同一空间可比

**实践要点**：换 Embedding 模型必须全量重建索引；长文档先切块再分别向量化；效果用检索命中率评估而非肉眼；多语言场景选多语种对齐的模型。`,
    relations: [
      { to: 'agent-vector-db', desc: '向量库存储并检索 Embedding' },
      { to: 'agent-rag', desc: 'RAG 靠 Embedding 做语义召回' },
      { to: 'ai-nn', desc: 'Embedding 是神经网络学到的中间表示' },
      { to: 'ai-clustering', desc: '向量聚类可自动发现主题结构' },
    ],
    example: `# Embedding 语义检索三步（Python 伪代码）

sentences = ["如何申请退款", "退货政策是什么", "怎么开发票"]
vecs = model.encode(sentences)        # 每句变成 1536 维向量

# "退款流程怎么走" 与 "如何申请退款" 字面不同、语义相近
query_vec = model.encode("退款流程怎么走")

scores = cosine_similarity(query_vec, vecs)
# scores 约为 [0.91, 0.84, 0.32]  <- 语义相关性，而非字面重合
best = sentences[scores.argmax()]     # 命中"如何申请退款"`,
    exampleLang: 'python',
    interview: '基础考点：余弦相似度与欧氏距离的区别；为什么查询和文档必须用同一模型编码；维度高低与效果的权衡。',
  },
  {
    id: 'agent-vector-db',
    name: '向量数据库',
    en: 'Vector Database',
    cat: 'agent',
    sub: '知识增强',
    tags: ['向量库', 'ANN', '检索'],
    summary: '向量数据库专存 Embedding 并提供近似最近邻检索，以毫秒级相似度搜索支撑 RAG 与推荐。',
    detail: `**是什么**：向量数据库是存储高维向量并提供相似度检索的专用系统，核心是 ANN（近似最近邻）索引：HNSW、IVF 等，在亿级数据中毫秒级召回 TopK 相似向量。

**解决什么问题**：暴力比较一亿个 1536 维向量每次要算上千亿次乘法，不可行；ANN 索引牺牲少量召回率换取百倍千倍速度，让语义搜索可落地。

**关键概念**：
- 距离度量：余弦 / 内积 / 欧氏
- 索引：HNSW 图（快且准、吃内存）、IVF 聚类
- 元数据过滤：先按标签过滤再做向量检索
- 代表：Milvus、Qdrant、pgvector、Pinecone

**实践要点**：选型看数据规模与过滤需求，百万级 pgvector 就够；召回率要压测调参；向量库不替代业务数据库，通常与元数据库并用。`,
    relations: [
      { to: 'agent-embedding', desc: '向量库存的就是 Embedding' },
      { to: 'agent-rag', desc: 'RAG 的在线检索环节依赖向量库' },
      { to: 'be-index', desc: 'ANN 索引与数据库索引思想一脉相承' },
      { to: 'be-nosql', desc: '向量库是 NoSQL 家族里面向相似度的新成员' },
    ],
    interview: '选型题：HNSW 与 IVF 的取舍；为什么叫"近似"最近邻；元数据过滤应该在检索前还是检索后。',
  },
  {
    id: 'agent-knowledge-base',
    name: '知识库',
    en: 'Knowledge Base',
    cat: 'agent',
    sub: '知识增强',
    tags: ['知识库', '文档处理', '数据治理'],
    summary: '知识库是经清洗、切块、向量化处理的私有文档集合，作为 RAG 数据源充当 Agent 的外挂大脑。',
    detail: `**是什么**：知识库在 Agent 语境指经过工程处理的私有知识集合：产品手册、制度文档、FAQ、工单等原始资料，经清洗、切块、向量化后可被检索引用。

**解决什么问题**：企业知识散落在 PDF、Confluence、数据库里，模型既没见过也不能直接读；知识库把非结构化资料加工成"可检索、可引用"的形态。

**建设流水线**：
- 采集：接通各文档源并定时同步
- 清洗：去页眉页脚、表格转文本、去重
- 切块：按语义段落切分并保留元数据（来源、标题、时间）
- 入库：向量化 + 关键词索引双通道

**实践要点**：垃圾进垃圾出——文档质量决定答案上限；保留来源元数据支持引用与权限过滤；建立更新与失效机制，过期文档是错误答案的温床。`,
    relations: [
      { to: 'agent-rag', desc: '知识库是 RAG 的检索数据源' },
      { to: 'agent-vector-db', desc: '切块后的知识存入向量库' },
      { to: 'agent-embedding', desc: '知识入库依赖向量化' },
    ],
    interview: '工程题：知识库建设的完整流水线；表格与图片型文档怎么处理；知识更新删除如何同步到索引。',
  },

  // ==================== 工程与质量 ====================
  {
    id: 'agent-prompt-engineering',
    name: 'Prompt 工程',
    en: 'Prompt Engineering',
    cat: 'agent',
    sub: '工程与质量',
    tags: ['提示词', '方法论', '调优'],
    summary: 'Prompt 工程通过结构化设计角色、上下文、任务与输出格式，稳定而充分地释放模型能力。',
    detail: `**是什么**：Prompt 工程是设计与迭代提示词的方法论：通过清晰的角色设定、任务描述、上下文组织、示例与输出约束，让模型输出稳定、可控、高质量。

**解决什么问题**：模型能力上限固定，但"榨取率"差异巨大——同一个任务，含糊提示答非所问，结构化提示一次到位；提示是成本最低的效果杠杆。

**实用技巧**：
- 结构化：角色 / 任务 / 上下文 / 约束 / 输出格式分节
- 给示例（Few-shot）与给步骤（CoT）
- 明确"不要做什么"与边界
- 用分隔符或标签组织长上下文

**实践要点**：提示词是"代码"，要进版本管理；改动必须跑评测集对比，凭感觉调提示是最大陷阱；稳定沉淀的提示应固化为系统提示模板。`,
    relations: [
      { to: 'agent-system-prompt', desc: '系统提示是提示工程的固化成果' },
      { to: 'agent-few-shot', desc: 'Few-shot 是提示工程的核心手法之一' },
      { to: 'agent-cot', desc: 'CoT 是引导推理的提示技巧' },
      { to: 'agent-evals', desc: '提示改动必须经过评测回归验证' },
    ],
    interview: '实践考点：为什么提示词改动要做回归评测；如何组织长上下文减少"中间遗忘"。',
  },
  {
    id: 'agent-few-shot',
    name: 'Few-shot 提示',
    en: 'Few-shot Prompting',
    cat: 'agent',
    sub: '工程与质量',
    tags: ['示例', '提示技巧', '对齐'],
    summary: 'Few-shot 在提示中附上少量输入输出示例，让模型照葫芦画瓢，比纯指令更能对齐格式与风格。',
    detail: `**是什么**：Few-shot（少样本）提示指在提示中给出 2-5 个"输入 → 期望输出"示例，模型模仿示例的模式处理新输入；零示例则为 Zero-shot。

**解决什么问题**：自然语言描述规则总有歧义——"输出 JSON，字段有 name 和 price"可能被理解成十种结构；直接给一个标准示例，歧义瞬间消解。

**关键技巧**：
- 示例要覆盖边界情况（空值、异常输入）
- 示例与真实输入格式完全一致
- 数量是成本与效果的折中，并非越多越好
- 动态选取与当前问题最相似的示例（动态 Few-shot）

**与微调的边界**：Few-shot 是"临时辅导"，零训练成本；微调是"正式培训"，改权重、长期稳定——格式对齐先用 Few-shot，规模化再微调。`,
    relations: [
      { to: 'agent-prompt-engineering', desc: 'Few-shot 是提示工程的基本功' },
      { to: 'ai-supervised', desc: '示例像迷你训练集，但完全不改权重' },
      { to: 'agent-cot', desc: '示例可包含推理过程，形成思维链示范' },
    ],
    interview: '辨析题：Few-shot 与微调的成本与效果边界；为什么示例里包含边界情况能显著提升鲁棒性。',
  },
  {
    id: 'agent-cot',
    name: '思维链 CoT',
    en: 'Chain-of-Thought',
    cat: 'agent',
    sub: '工程与质量',
    tags: ['推理', '思维链', '提示技巧'],
    summary: '思维链 CoT 引导模型先写出中间推理步骤再给答案，显著提升数学与逻辑类复杂推理的准确率。',
    detail: `**是什么**：CoT（Chain-of-Thought，思维链）要求模型"一步步思考"，或用含推理过程的示例，先输出中间推理再给最终答案。

**解决什么问题**：直接要答案时，模型把多步计算压缩成一次输出，错一步全错；显式展开推理步骤后，每步只需正确一小段，复杂推理准确率大幅提升。

**变体**：
- Zero-shot CoT：一句"think step by step"即可生效
- Few-shot CoT：示例本身带推理过程
- Self-Consistency：多次采样取多数答案

**实践要点**：CoT 明显增加 token 与延迟，简单任务不必开启；现代推理模型（o1/R1 类）已内置长思考，外部 CoT 提示反而画蛇添足；答案要以明确标记结尾便于解析。`,
    relations: [
      { to: 'agent-react', desc: 'ReAct 中的 Thought 即思维链与行动结合' },
      { to: 'agent-few-shot', desc: 'Few-shot CoT 用带推理的示例做示范' },
      { to: 'agent-llm', desc: 'CoT 利用了自回归生成的连续性' },
    ],
    interview: '辨析题：CoT 为什么能提升推理准确率；对推理模型还需要写"step by step"吗；CoT 的 token 成本问题。',
  },
  {
    id: 'agent-evals',
    name: 'Evals 评测',
    en: 'Evaluations',
    cat: 'agent',
    sub: '工程与质量',
    tags: ['评测', '质量', '回归'],
    summary: 'Evals 用固定数据集对模型或 Agent 输出做自动化回归评测，把"感觉变好"变成可度量指标。',
    detail: `**是什么**：Evals（评测）是用预构建的测试集（输入 + 期望标准）系统化度量 AI 应用质量的工程实践，输出准确率、格式合规率、成本、延迟等可追踪指标。

**解决什么问题**：提示词改一行、模型升个版，效果"感觉"变好也"感觉"变差——没有评测就没有回归；Evals 让每次改动像代码 CI 一样可验证。

**评测方法**：
- 精确断言：格式、关键词、JSON Schema 校验
- 相似度：与参考答案的语义相似度
- LLM-as-Judge：用强模型按评分标准打分
- 人工抽检：校准自动化评测的可信度

**实践要点**：评测集优先来自真实失败案例；覆盖"不该回答"的对抗样本；固定温度与模型版本，指标随版本趋势化记录；上线前跑全量、日常跑冒烟。`,
    relations: [
      { to: 'ai-train-val-test', desc: '评测集思想与机器学习的测试集同源' },
      { to: 'agent-guardrails', desc: '评测发现的风险固化为护栏规则' },
      { to: 'agent-prompt-engineering', desc: '提示词改动必须过评测回归' },
    ],
    interview: '工程考点：如何构建 Agent 评测集；LLM-as-Judge 的偏差与校准方法；评测集为什么要持续维护演进。',
  },
  {
    id: 'agent-guardrails',
    name: 'Guardrails 护栏',
    en: 'Guardrails',
    cat: 'agent',
    sub: '工程与质量',
    tags: ['安全', '合规', '过滤'],
    summary: 'Guardrails 护栏是围绕模型输入输出的安全过滤与规则约束层，拦截注入、越权与违规内容。',
    detail: `**是什么**：Guardrails（护栏）是包裹在模型外层的输入/输出检查与约束系统：敏感内容过滤、提示注入检测、输出 Schema 校验、工具权限白名单、事实核查等。

**解决什么问题**：模型行为有随机性且可被诱导，单靠提示词约束不保险；护栏把安全合规从"希望模型自觉"变成"系统强制执行"。

**分层防线**：
- 输入侧：注入检测、敏感信息脱敏、话题范围校验
- 输出侧：格式校验、毒性过滤、引用核查
- 行为侧：工具调用白名单，金额/删除类操作转人工确认
- 系统侧：速率限制、审计日志

**实践要点**：护栏要低延迟，否则拖垮体验；误拦截率与漏放率靠评测集持续平衡；护栏日志是分析攻击与改进提示的富矿。`,
    relations: [
      { to: 'agent-hitl', desc: '护栏自动拦截 + 人工复核双保险' },
      { to: 'agent-system-prompt', desc: '提示层约束是第一道防线，护栏是系统层兜底' },
      { to: 'agent-evals', desc: '护栏的误拦/漏放率靠评测持续校准' },
      { to: 'be-rate-limit', desc: '行为侧护栏常与限流、配额机制配合' },
    ],
    interview: '安全考点：提示注入的常见手法与防御；护栏的误拦与漏放如何权衡；工具调用的权限模型怎么设计。',
  },
];
