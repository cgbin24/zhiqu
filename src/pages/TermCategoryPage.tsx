import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Search } from 'lucide-react';
import { TERM_CATEGORY_MAP, getTerm, searchTerms, termsOfCategory } from '@/data/terms';
import type { TermCatId } from '@/data/terms';
import { Markdown } from '@/components/Markdown';
import { LifecycleFlow } from '@/components/LifecycleFlow';
import { EffectDemo } from '@/components/EffectDemo';
import { SpeakButton } from '@/components/SpeakButton';
import { useProgress } from '@/store/progress';

export function TermCategoryPage() {
  const { cat = 'frontend' } = useParams<{ cat: string }>();
  const def = TERM_CATEGORY_MAP[cat as TermCatId];
  const [q, setQ] = useState('');
  const viewedTerms = useProgress((s) => s.viewedTerms);

  const list = useMemo(
    () => (q.trim() ? searchTerms(q, cat as TermCatId) : termsOfCategory(cat as TermCatId)),
    [q, cat],
  );

  // 按子分类分组（保持原顺序）
  const groups = useMemo(() => {
    const map = new Map<string, typeof list>();
    for (const t of list) {
      if (!map.has(t.sub)) map.set(t.sub, []);
      map.get(t.sub)!.push(t);
    }
    return [...map.entries()];
  }, [list]);

  if (!def) {
    return (
      <div className="py-24 text-center text-slate-400">
        领域不存在。<Link to="/terms" className="text-quest-400 hover:underline">返回术语百科</Link>
      </div>
    );
  }

  const viewed = termsOfCategory(def.id).filter((t) => viewedTerms[t.id]).length;
  const total = termsOfCategory(def.id).length;

  return (
    <div className="space-y-4">
      {/* 头部 */}
      <div className="rounded-2xl border border-night-700 bg-night-900 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/terms"
            className="flex items-center gap-1 rounded-lg border border-night-700 bg-night-850 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            <ChevronLeft size={14} /> 术语百科
          </Link>
          <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${def.gradient} text-xl`}>
            {def.icon}
          </span>
          <div className="flex-1">
            <h1 className="text-lg font-black text-slate-100">{def.name}</h1>
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{def.en}</p>
          </div>
          <div className="text-right text-xs">
            <div className="font-bold text-slate-200">{viewed}/{total} 已浏览</div>
          </div>
        </div>
        <Markdown text={def.intro} className="mt-3" />
      </div>

      {/* 搜索 */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`在 ${def.name} 中搜索…`}
          className="w-full rounded-xl border border-night-700 bg-night-900 py-2.5 pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-quest-500/60"
        />
      </div>

      {/* 全链路领域：专属流程视图 */}
      {def.id === 'lifecycle' && (
        <LifecycleFlow />
      )}

      {/* 分组列表 */}
      {def.id !== 'lifecycle' && groups.map(([sub, terms]) => (
        <section key={sub}>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: def.color }} />
            {sub}
            <span className="text-xs font-normal text-slate-500">{terms.length}</span>
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {terms.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                <Link
                  to={`/terms/${t.cat}/${t.id}`}
                  className={`block h-full rounded-xl border p-3 transition-all hover:border-quest-500/50 ${
                    viewedTerms[t.id]
                      ? 'border-emerald-500/25 bg-emerald-500/5'
                      : 'border-night-700 bg-night-900'
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-100">{t.name}</span>
                    <span className="truncate text-[11px] text-slate-500">{t.en}</span>
                    {viewedTerms[t.id] && <span className="ml-auto shrink-0 text-[10px] text-emerald-400">✓</span>}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{t.summary}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {t.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded bg-night-800 px-1.5 py-0.5 text-[10px] text-slate-500">{tag}</span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** 详情页（单独导出，路由 /terms/:cat/:tid） */
export function TermDetailPage() {
  const { cat = '', tid = '' } = useParams<{ cat: string; tid: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  // 只有从关系图谱进入时才显示「返回视图」按钮（navigate 携带的 state 标记）
  const fromGraph = (location.state as { from?: string } | null)?.from === 'graph';
  const def = TERM_CATEGORY_MAP[cat as TermCatId];
  const term = getTerm(tid);
  const markTermViewed = useProgress((s) => s.markTermViewed);
  const viewed = useProgress((s) => Boolean(s.viewedTerms[tid]));

  if (!def || !term) {
    return (
      <div className="py-24 text-center text-slate-400">
        术语不存在。<Link to="/terms" className="text-quest-400 hover:underline">返回术语百科</Link>
      </div>
    );
  }

  markTermViewed(term.id);

  const siblings = termsOfCategory(term.cat);
  const idx = siblings.findIndex((t) => t.id === term.id);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx + 1 < siblings.length ? siblings[idx + 1] : null;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Link to="/terms" className="text-slate-500 hover:text-slate-300">术语百科</Link>
        <span className="text-slate-600">/</span>
        <Link to={`/terms/${term.cat}`} className="text-slate-500 hover:text-slate-300">{def.name}</Link>
        <span className="text-slate-600">/</span>
        <span className="font-semibold text-slate-300">{term.name}</span>
        {fromGraph && (
          <button
            onClick={() => navigate(`/terms/graph?focus=${term.id}`)}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-quest-500/40 bg-quest-500/10 px-3 py-1 text-[11px] font-bold text-quest-300 transition-colors hover:bg-quest-500/20"
          >
            🕸️ 返回视图
          </button>
        )}
        {viewed && <span className={`rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300 ${fromGraph ? 'ml-2' : 'ml-auto'}`}>已学习</span>}
      </div>

      <div className="rounded-2xl border border-night-700 bg-night-900 p-6">
        <div className="flex items-start gap-4">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${def.gradient} text-2xl`}>
            {def.icon}
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-100">{term.name}</h1>
            <p className="text-sm text-slate-500">{term.en}</p>
            {term.phonetic && (
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-xs text-sky-400">/{term.phonetic}/</span>
                <SpeakButton text={term.name} size="sm" />
              </div>
            )}
          </div>
          {term.cat === 'english' && (
            <span className="ml-auto shrink-0">
              <SpeakButton text={term.name} />
            </span>
          )}
        </div>
        <p className="mt-4 rounded-xl border border-quest-500/25 bg-quest-500/8 p-3.5 text-sm leading-relaxed text-slate-300">
          {term.summary}
        </p>
        {term.demo && (
          <div className="mt-4">
            <EffectDemo kind={term.demo.kind} param={term.demo.param} />
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {term.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-night-800 px-2 py-0.5 text-[11px] text-slate-400">#{tag}</span>
          ))}
        </div>
        <Markdown text={term.detail} className="mt-4" />

        {term.example && (
          <div className="mt-4">
            <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">示例</div>
            <pre className="overflow-x-auto rounded-xl border border-night-700 bg-[var(--t-pre-bg)] p-3.5 font-mono text-xs leading-relaxed text-slate-300">
              {term.example}
            </pre>
          </div>
        )}

        {term.interview && (
          <div className="mt-4 rounded-xl border border-gold-500/25 bg-gold-500/5 p-3.5">
            <div className="mb-1 text-xs font-bold text-gold-300">💡 面试 / 实践要点</div>
            <Markdown text={term.interview} className="text-sm" />
          </div>
        )}
      </div>

      {/* 关联术语 */}
      {term.relations && term.relations.length > 0 && (
        <div className="rounded-2xl border border-night-700 bg-night-900 p-5">
          <h2 className="mb-3 text-sm font-bold text-slate-200">🔗 关联术语</h2>
          <div className="space-y-2">
            {term.relations.map((rel) => {
              const r = getTerm(rel.to);
              if (!r) return null;
              return (
                <Link
                  key={rel.to}
                  to={`/terms/${r.cat}/${r.id}`}
                  className="flex items-start gap-3 rounded-xl border border-night-700 bg-night-850 p-3 transition-colors hover:border-quest-500/50"
                >
                  <span className="shrink-0 font-bold text-quest-400">{r.name}</span>
                  <span className="flex-1 text-xs text-slate-400">{rel.desc}</span>
                  <span className="shrink-0 text-[10px] text-slate-600">{r.cat === term.cat ? '同领域' : '跨领域'}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 上一个 / 下一个 */}
      <div className="flex gap-2 pb-4">
        {prev && (
          <Link to={`/terms/${prev.cat}/${prev.id}`} className="flex-1 rounded-xl border border-night-700 bg-night-900 p-3 text-left hover:border-night-600">
            <div className="text-[10px] text-slate-500">← 上一个</div>
            <div className="text-sm font-semibold text-slate-200">{prev.name}</div>
          </Link>
        )}
        {next && (
          <Link to={`/terms/${next.cat}/${next.id}`} className="flex-1 rounded-xl border border-night-700 bg-night-900 p-3 text-right hover:border-night-600">
            <div className="text-[10px] text-slate-500">下一个 →</div>
            <div className="text-sm font-semibold text-slate-200">{next.name}</div>
          </Link>
        )}
      </div>
    </div>
  );
}
