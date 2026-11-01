import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpenText, ChevronRight, Search } from 'lucide-react';
import { TERM_CATEGORIES, categoryTermCounts, searchTerms, totalTerms } from '@/data/terms';
import { useProgress } from '@/store/progress';

export function TermsHome() {
  const viewedTerms = useProgress((s) => s.viewedTerms);
  const viewedCount = Object.keys(viewedTerms).length;
  const counts = useMemo(() => categoryTermCounts(), []);
  const total = useMemo(() => totalTerms(), []);

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="relative overflow-hidden rounded-2xl border border-night-700 bg-night-900 p-5">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-quest-500/10 blur-2xl" />
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-quest-500 to-fuchsia-500 text-2xl shadow-lg shadow-quest-500/30">
            <BookOpenText size={22} className="text-white" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-100">术语百科</h1>
            <p className="text-sm text-slate-400">七大领域 {total} 个核心术语 —— 概念、关系、代码示例与面试要点</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-black text-quest-400">{viewedCount}<span className="text-sm text-slate-500">/{total}</span></div>
            <div className="text-[11px] text-slate-500">已浏览</div>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-night-800">
          <div className="h-full rounded-full bg-gradient-to-r from-quest-500 to-fuchsia-500" style={{ width: `${total ? (viewedCount / total) * 100 : 0}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/terms/quiz"
            className="rounded-lg bg-gradient-to-r from-quest-500 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-quest-500/25 hover:brightness-110"
          >
            🎯 开始术语测验（答对每题 +2 XP）
          </Link>
        </div>
      </div>

      {/* 领域卡片 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TERM_CATEGORIES.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link
              to={`/terms/${c.id}`}
              className="group block h-full rounded-2xl border border-night-700 bg-night-900 p-4 transition-all hover:border-night-600 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${c.gradient} text-xl shadow`}>
                  {c.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-100">{c.name}</div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">{c.en}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black" style={{ color: c.color }}>{counts[c.id] ?? 0}</div>
                  <div className="text-[10px] text-slate-500">术语</div>
                </div>
                <ChevronRight size={15} className="text-slate-600 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-2.5 text-xs text-slate-400 line-clamp-2">{c.intro.split('**')[1] ?? c.name}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 快速搜索 */}
      <GlobalSearch />
    </div>
  );
}

function GlobalSearch() {
  const [q, setQ] = useState('');
  const results = useMemo(() => (q.trim() ? searchTerms(q).slice(0, 12) : []), [q]);

  return (
    <div>
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="全库搜索术语：如 JWT、K8s、ReAct、三次握手…"
          className="w-full rounded-xl border border-night-700 bg-night-900 py-2.5 pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-quest-500/60"
        />
      </div>
      {q.trim() !== '' && (
        <div className="mt-2 grid gap-1.5 rounded-xl border border-night-700 bg-night-900 p-2 sm:grid-cols-2">
          {results.length === 0 && <div className="p-2 text-sm text-slate-500">没有匹配的术语</div>}
          {results.map((t) => (
            <Link
              key={t.id}
              to={`/terms/${t.cat}/${t.id}`}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-night-800"
            >
              <span className="text-xs font-bold text-quest-400">{t.name}</span>
              <span className="truncate text-xs text-slate-500">{t.summary}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
