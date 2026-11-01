import { TERMS, getTerm } from '@/data/terms';
import type { Term, TermCatId } from '@/data/terms';

export type QuizKind = 'summary-to-term' | 'term-to-summary' | 'relation';

export interface QuizOption {
  label: string;
  correct: boolean;
}

export interface QuizQuestion {
  kind: QuizKind;
  termId: string;
  prompt: string;
  options: QuizOption[];
  /** 答案解析：展示正确术语的摘要 */
  explain: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distractorsOf(term: Term, pool: Term[], count: number): Term[] {
  const sameCat = pool.filter((t) => t.id !== term.id && t.cat === term.cat);
  const rest = pool.filter((t) => t.id !== term.id && t.cat !== term.cat);
  return [...shuffle(sameCat), ...shuffle(rest)].slice(0, count);
}

function buildSummaryToTerm(term: Term, pool: Term[]): QuizQuestion {
  const ds = distractorsOf(term, pool, 3);
  return {
    kind: 'summary-to-term',
    termId: term.id,
    prompt: `哪个术语符合以下描述？\n「${term.summary}」`,
    options: shuffle([{ label: term.name, correct: true }, ...ds.map((d) => ({ label: d.name, correct: false }))]),
    explain: `${term.name}（${term.en}）：${term.summary}`,
  };
}

function buildTermToSummary(term: Term, pool: Term[]): QuizQuestion {
  const ds = distractorsOf(term, pool, 3);
  return {
    kind: 'term-to-summary',
    termId: term.id,
    prompt: `「${term.name}（${term.en}）」指的是？`,
    options: shuffle([
      { label: term.summary, correct: true },
      ...ds.map((d) => ({ label: d.summary, correct: false })),
    ]),
    explain: `${term.name}：${term.summary}`,
  };
}

function buildRelation(term: Term, pool: Term[]): QuizQuestion | null {
  const rel = term.relations?.[0];
  if (!rel) return null;
  const target = getTerm(rel.to);
  if (!target) return null;
  const ds = distractorsOf(
    term,
    pool.filter((t) => t.id !== target.id),
    3,
  );
  return {
    kind: 'relation',
    termId: term.id,
    prompt: `以下哪个术语与「${term.name}」直接相关？`,
    options: shuffle([
      { label: target.name, correct: true },
      ...ds.map((d) => ({ label: d.name, correct: false })),
    ]),
    explain: `${term.name} ↔ ${target.name}：${rel.desc}`,
  };
}

/** 生成一轮测验题（优先覆盖不同领域） */
export function buildQuizRound(count = 10, cat?: TermCatId): QuizQuestion[] {
  const pool = cat ? TERMS.filter((t) => t.cat === cat) : TERMS;
  const questions: QuizQuestion[] = [];
  const shuffled = shuffle(pool.filter((t) => t.summary));

  for (const term of shuffled) {
    if (questions.length >= count) break;
    const wantRelation = Math.random() < 0.35 && term.relations && term.relations.length > 0;
    let q: QuizQuestion | null = null;
    if (wantRelation) q = buildRelation(term, pool);
    if (!q) q = Math.random() < 0.5 ? buildSummaryToTerm(term, pool) : buildTermToSummary(term, pool);
    if (q) questions.push(q);
  }
  return questions;
}
