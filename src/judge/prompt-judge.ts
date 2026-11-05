import type { PromptCheckResult, PromptRule } from '@/types';

/**
 * AI 协作关卡判题引擎 —— 提示词/规约文档的要素检查。
 *
 * 与代码判题不同，「写好一份给 AI 的提问/计划/反馈」没有唯一正确输出，
 * 因此采用**要素检查**：每个测试点是一条确定性规则（包含关键要素 / 禁用模糊表述 /
 * 结构完整等），对提交文档做纯字符串分析 —— 零依赖、零延迟、可离线。
 *
 * 规则以 JSON 存放于 TestCase.stdin：{"rule": {...}}，
 * Level.runtime 存放可见检查项 {"checks":[{hint, rule}]} 供「运行」按钮做体检报告。
 */

const BULLET_RE = /^\s*(?:[-*•·]|\d+[.、)）])\s+\S/;
const HEADER_RE = /^\s*#{1,6}\s+\S/;

/** ASCII 关键词大小写不敏感：统一转小写后匹配 */
function includesCI(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function runPromptRule(text: string, rule: PromptRule): PromptCheckResult {
  switch (rule.type) {
    case 'containsAny': {
      const options = rule.options ?? [];
      const hit = options.find((o) => includesCI(text, o));
      if (hit) return { pass: true, actual: `已包含要素「${hit}」` };
      return {
        pass: false,
        actual: `缺少关键要素 —— 需包含以下任一表述：${options.map((o) => `「${o}」`).join(' / ')}`,
      };
    }
    case 'containsAll': {
      const all = rule.all ?? [];
      const missing = all.filter((o) => !includesCI(text, o));
      if (missing.length === 0) return { pass: true, actual: `要素齐全（${all.length} 项全部命中）` };
      return {
        pass: false,
        actual: `缺少 ${missing.length} 项要素：${missing.map((o) => `「${o}」`).join('、')}`,
      };
    }
    case 'notContains': {
      const banned = rule.banned ?? [];
      const hit = banned.find((o) => includesCI(text, o));
      if (!hit) return { pass: true, actual: '未出现禁用表述' };
      return {
        pass: false,
        actual: `出现了禁用表述「${hit}」—— 提问要具体，不要把判断权抛回给 AI 或含糊带过`,
      };
    }
    case 'regex': {
      let re: RegExp;
      try {
        re = new RegExp(rule.pattern ?? '', rule.flags ?? 'im');
      } catch {
        return { pass: false, actual: '检查规则配置错误（正则不合法）' };
      }
      const m = re.exec(text);
      if (m) return { pass: true, actual: `匹配到「${m[0].slice(0, 40)}」` };
      return { pass: false, actual: `未匹配到模式 /${rule.pattern}/ —— 检查文档结构是否完整` };
    }
    case 'minLength': {
      const len = text.trim().length;
      if (len >= (rule.n ?? 0)) return { pass: true, actual: `篇幅 ${len} 字（≥ ${rule.n}）` };
      return { pass: false, actual: `篇幅过短（${len} 字，需 ≥ ${rule.n}）—— 规格太薄，AI 只能靠猜` };
    }
    case 'maxLength': {
      const len = text.trim().length;
      if (len <= (rule.n ?? Infinity)) return { pass: true, actual: `篇幅 ${len} 字（≤ ${rule.n}）` };
      return { pass: false, actual: `篇幅过长（${len} 字，需 ≤ ${rule.n}）—— 信息过载会稀释重点` };
    }
    case 'maxLines': {
      const lines = text.replace(/\r\n?/g, '\n').split('\n').filter((l) => l.trim().length > 0).length;
      if (lines <= (rule.n ?? Infinity)) return { pass: true, actual: `${lines} 行（≤ ${rule.n}）` };
      return { pass: false, actual: `内容过多（${lines} 行，需 ≤ ${rule.n}）—— 一页纸原则：拆分而不是堆砌` };
    }
    case 'bulletList': {
      const count = text.replace(/\r\n?/g, '\n').split('\n').filter((l) => BULLET_RE.test(l)).length;
      if (count >= (rule.n ?? 0)) return { pass: true, actual: `检测到 ${count} 个列表项（≥ ${rule.n}）` };
      return {
        pass: false,
        actual: `列表项不足（${count} 个，需 ≥ ${rule.n}）—— 用 - 或 1. 逐条列出，不要写成一大段`,
      };
    }
    case 'sectionHeaders': {
      const count = text.replace(/\r\n?/g, '\n').split('\n').filter((l) => HEADER_RE.test(l)).length;
      if (count >= (rule.n ?? 0)) return { pass: true, actual: `检测到 ${count} 个小节标题（≥ ${rule.n}）` };
      return {
        pass: false,
        actual: `小节标题不足（${count} 个，需 ≥ ${rule.n}）—— 用 ## 划分结构，让 AI 能定位每个部分`,
      };
    }
    default:
      return { pass: false, actual: '未知检查类型' };
  }
}

/** 解析 TestCase.stdin 中的检查规格 {"rule": {...}} 并执行 */
export function checkPromptSubmission(submission: string, stdinSpec: string): PromptCheckResult {
  try {
    const spec = JSON.parse(stdinSpec) as { rule?: PromptRule };
    if (!spec.rule) return { pass: false, actual: '检查规则缺失（数据配置错误）' };
    return runPromptRule(submission, spec.rule);
  } catch (err) {
    return { pass: false, actual: '检查规则解析失败：' + (err instanceof Error ? err.message : String(err)) };
  }
}

/** 解析 Level.runtime 中的可见检查项 {"checks":[{hint, rule}]}，输出「运行」体检报告 */
export function promptCheckReport(submission: string, runtimeJson: string | undefined): string {
  if (!runtimeJson) {
    return '本关以「提示词/规格文档」作答。\n点「运行」可先做要素体检（不计分），点「提交评测」正式判题。';
  }
  const lines: string[] = ['📋 提示词要素体检（可见项，不计分）', '──────────────────────'];
  let passCount = 0;
  let total = 0;
  try {
    const cfg = JSON.parse(runtimeJson) as { checks?: { hint?: string; rule: PromptRule }[] };
    for (const c of cfg.checks ?? []) {
      total++;
      const r = runPromptRule(submission, c.rule);
      if (r.pass) passCount++;
      lines.push(`${r.pass ? '✅' : '❌'} ${c.hint ?? '检查项'}${r.pass ? '' : `\n    └─ ${r.actual}`}`);
    }
  } catch (err) {
    lines.push('⚠️ 体检配置解析失败：' + (err instanceof Error ? err.message : String(err)));
  }
  lines.push('──────────────────────');
  lines.push(`小结：${passCount}/${total} 项达标${passCount === total ? ' —— 可以提交评测了！' : '，按提示补齐后重试'}`);
  return lines.join('\n');
}
