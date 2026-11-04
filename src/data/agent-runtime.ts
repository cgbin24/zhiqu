/**
 * Agent 开发课程运行时 —— 注入学员沙箱的 Mock LLM 与检索助手。
 *
 * 设计原则：
 *  - 完全确定性：同一配置 + 同一输入 → 同一输出（保证判题可复现）
 *  - 同步 API：学员代码无需 async/await 即可驱动
 *  - 真实模式：消息结构 / 工具调用协议 / RAG 注入方式与主流 LLM API 一致，
 *    学员代码可近乎原样迁移到 OpenAI/Anthropic 等真实 SDK
 *
 * 注入约定（平台在学员代码前自动注入）：
 *   const llm = createMockLLM(__LLM_CONFIG__);
 *   llm.chat([{ role, content }, ...]) → { content, toolCalls? }
 *     - 按配置中的 turns 顺序消耗；每个 turn 可含 content（最终回复）
 *       或 toolCalls: [{ name, args }]（要求调用工具）
 *   const { docs } = __RAG_DOCS__;            // 关卡预置的知识库（可选）
 *   retrieve(docs, query, k) → 按词频重叠打分的前 k 条
 */

export const AGENT_RUNTIME_PREAMBLE = String.raw`
function createMockLLM(config) {
  let turn = 0;
  return {
    chat(messages) {
      const turns = (config && config.turns) || [];
      const t = turns[Math.min(turn, turns.length - 1)];
      turn++;
      const lastUser = [...messages].reverse().find((m) => m.role === 'user');
      return {
        content: t.content !== undefined ? t.content : '',
        toolCalls: t.toolCalls || [],
        model: 'mock-gpt',
        usage: {
          promptTokens: JSON.stringify(messages).length,
          completionTokens: (t.content || '').length + JSON.stringify(t.toolCalls || []).length,
        },
        _turn: turn - 1,
        _lastUser: lastUser ? lastUser.content : '',
      };
    },
    reset() { turn = 0; },
  };
}

/* 中文/混合文本分词：连续英文数字为词，CJK 按双字组 */
function __tokens(text) {
  const out = [];
  const en = text.toLowerCase().match(/[a-z0-9]+/g) || [];
  out.push(...en);
  const cjk = text.match(/[\u4e00-\u9fff]/g) || [];
  if (cjk.length === 1) out.push(cjk[0]);
  for (let i = 0; i + 1 < cjk.length; i++) out.push(cjk[i] + cjk[i + 1]);
  return out;
}

/* 关键词重叠检索：score = 查询词元在文档(标题+正文)中出现次数之和；同分保持原序 */
function retrieve(docs, query, k) {
  const qTokens = __tokens(query);
  const scored = docs.map((d, i) => {
    const text = (d.title || '') + ' ' + (d.text || '');
    let score = 0;
    for (const tk of qTokens) {
      let idx = 0;
      while ((idx = text.toLowerCase().indexOf(tk.toLowerCase(), idx)) !== -1) { score++; idx += tk.length; }
    }
    return { i, d, score };
  });
  scored.sort((a, b) => b.score - a.score || a.i - b.i);
  return scored.slice(0, k || 3).filter((x) => x.score > 0).map((x) => x.d);
}
`;

/** Agent 课程专用注入块（学员代码前置） */
export function agentPreamble(llmConfigJson: string): string {
  return (
    AGENT_RUNTIME_PREAMBLE +
    '\nconst __LLM_CONFIG__ = ' +
    llmConfigJson +
    ';\nconst llm = createMockLLM(__LLM_CONFIG__);\n'
  );
}
