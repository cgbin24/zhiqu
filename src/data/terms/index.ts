import { LC_LIFECYCLE } from './lifecycle';
import { EFF_EFFECTS } from './effects';
import { FE_FRONTEND } from './frontend';
import { NET_NETWORK } from './network';
import { SEC_SECURITY } from './security';
import { BE_BACKEND } from './backend';
import { DEVOPS_DEVOPS } from './devops';
import { EMB_EMBEDDED } from './embedded';
import { AGENT_AGENT } from './agent';
import { AI_AI } from './ai';
import type { Term, TermCatId } from './types';

/** 全部术语（按领域聚合） */
export const TERMS: Term[] = [
  ...LC_LIFECYCLE,
  ...EFF_EFFECTS,
  ...FE_FRONTEND,
  ...NET_NETWORK,
  ...SEC_SECURITY,
  ...BE_BACKEND,
  ...DEVOPS_DEVOPS,
  ...EMB_EMBEDDED,
  ...AGENT_AGENT,
  ...AI_AI,
];

const TERM_MAP = new Map<string, Term>(TERMS.map((t) => [t.id, t]));

export function getTerm(id: string | undefined): Term | undefined {
  return id ? TERM_MAP.get(id) : undefined;
}

export function termsOfCategory(cat: TermCatId): Term[] {
  return TERMS.filter((t) => t.cat === cat);
}

export function totalTerms(): number {
  return TERMS.length;
}

export function categoryTermCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const t of TERMS) counts[t.cat] = (counts[t.cat] ?? 0) + 1;
  return counts;
}

/** 全库搜索：名称 / 英文 / 标签 / 摘要 */
export function searchTerms(query: string, cat?: TermCatId): Term[] {
  const q = query.trim().toLowerCase();
  const pool = cat ? TERMS.filter((t) => t.cat === cat) : TERMS;
  if (!q) return pool;
  return pool.filter((t) =>
    t.name.toLowerCase().includes(q) ||
    t.en.toLowerCase().includes(q) ||
    t.summary.toLowerCase().includes(q) ||
    t.tags.some((tag) => tag.toLowerCase().includes(q)),
  );
}

export type { Term, TermCatId, TermCategoryDef, EffectDemoKind } from './types';
export { TERM_CATEGORIES, TERM_CATEGORY_MAP } from './registry';
