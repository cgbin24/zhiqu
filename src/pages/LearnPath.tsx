import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { MODULES } from '@/data/modules';
import { LANGUAGES } from '@/data/languages/registry';
import { isLevelUnlocked, levelsOfChapter, testCaseSummary } from '@/data/languages';
import { DIFFICULTY_COLOR } from '@/game/xp';
import { useProgress } from '@/store/progress';
import type { LanguageId, Level } from '@/types';

export function LearnPath() {
  const { lang = 'go' } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const levelStats = useProgress((s) => s.levelStats);

  const completedIds = useMemo(
    () => new Set(Object.keys(levelStats).filter((k) => levelStats[k].stars > 0)),
    [levelStats],
  );
  const langDef = LANGUAGES.find((l) => l.id === lang) ?? LANGUAGES[0];

  return (
    <div>
      {/* 语言切换 */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {LANGUAGES.map((l) => {
          const lv = levelsOfChapter(l.id, 'basic').concat(
            levelsOfChapter(l.id, 'paradigm'),
            levelsOfChapter(l.id, 'advanced'),
            levelsOfChapter(l.id, 'tips'),
            levelsOfChapter(l.id, 'best'),
            levelsOfChapter(l.id, 'integration'),
          );
          const done = lv.filter((x) => completedIds.has(x.id)).length;
          const active = l.id === langDef.id;
          return (
            <Link
              key={l.id}
              to={`/learn/${l.id}`}
              className={`group relative overflow-hidden rounded-2xl border p-4 transition-all ${
                active ? 'border-transparent ring-2 shadow-lg' : 'border-night-700 hover:border-night-600'
              }`}
              style={active ? ({ '--tw-ring-color': l.color } as CSSProperties) : undefined}
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-10 ${l.gradient}`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-lg font-black" style={{ color: l.color }}>{l.name}</div>
                  <div className="text-xs text-slate-400">{l.tagline}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-200">{done}<span className="text-sm text-slate-500">/{lv.length}</span></div>
                  <div className="text-[10px] text-slate-500">关卡</div>
                </div>
              </div>
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-night-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${l.gradient} transition-all`}
                  style={{ width: `${lv.length ? (done / lv.length) * 100 : 0}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 六大模块章节 */}
      <div className="space-y-5">
        {MODULES.map((mod) => {
          const lv = levelsOfChapter(langDef.id as LanguageId, mod.id);
          const done = lv.filter((x) => completedIds.has(x.id)).length;
          const stars = lv.reduce((acc, x) => acc + (levelStats[x.id]?.stars ?? 0), 0);
          const maxStars = lv.length * 3;
          return (
            <section key={mod.id} className="overflow-hidden rounded-2xl border border-night-700 bg-night-900">
              <header className={`flex flex-wrap items-center gap-3 border-b border-night-700 bg-gradient-to-r ${mod.gradient} bg-opacity-10 px-4 py-3`}>
                <span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${mod.gradient} text-white shadow`}>
                  <ModuleIcon name={mod.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-slate-100">
                    第 {MODULES.indexOf(mod) + 1} 章 · {mod.name}
                  </h2>
                  <p className="truncate text-xs text-slate-400">{mod.subtitle}</p>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-slate-200">{done}/{lv.length} 关</div>
                  <div className="text-gold-300">★ {stars}/{maxStars}</div>
                </div>
              </header>
              <div className="grid gap-2.5 p-4 sm:grid-cols-2 xl:grid-cols-3">
                {lv.map((level, i) => (
                  <LevelNode
                    key={level.id}
                    level={level}
                    index={i}
                    langColor={langDef.color}
                    locked={!isLevelUnlocked(level, completedIds) && !(/* daily bypass */ false)}
                    stars={levelStats[level.id]?.stars ?? 0}
                    completed={completedIds.has(level.id)}
                    onClick={() => navigate(`/level/${level.id}`)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function ModuleIcon({ name }: { name: string }) {
  const size = 17;
  switch (name) {
    case 'Code2': return <span className="font-mono text-sm font-bold">{'{}'}</span>;
    case 'Brain': return <span className="text-sm">🧠</span>;
    case 'Swords': return <span className="text-sm">⚔️</span>;
    case 'Lightbulb': return <span className="text-sm">💡</span>;
    case 'ShieldCheck': return <span className="text-sm">🛡️</span>;
    case 'Rocket': return <span className="text-sm">🚀</span>;
    default: return <span className="text-sm">★</span>;
  }
  void size;
}

function LevelNode({
  level, index, langColor, locked, stars, completed, onClick,
}: {
  level: Level; index: number; langColor: string; locked: boolean; stars: number; completed: boolean; onClick: () => void;
}) {
  const stat = useProgress.getState().levelStats[level.id];
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      disabled={locked}
      className={`group flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all ${
        locked
          ? 'cursor-not-allowed border-night-800 bg-night-850/50 opacity-60'
          : completed
            ? 'border-emerald-500/25 bg-emerald-500/5 hover:border-emerald-500/50'
            : 'border-night-700 bg-night-850 hover:border-quest-500/50 hover:shadow-md hover:shadow-quest-500/10'
      }`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-black ${
          locked
            ? 'bg-night-800 text-slate-600'
            : completed
              ? 'bg-emerald-500/15 text-emerald-300'
              : 'text-white'
        }`}
        style={!locked && !completed ? { background: `linear-gradient(135deg, ${langColor}cc, ${langColor}66)` } : undefined}
      >
        {locked ? <Lock size={15} /> : index + 1}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-slate-200">{level.title}</span>
        <span className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-500">
          <span className={DIFFICULTY_COLOR[level.difficulty]}>{"●".repeat(level.difficulty)}</span>
          <span>⚡{level.xp}</span>
          <span className="hidden sm:inline">{testCaseSummary(level.tests)}用例</span>
          {stat?.attempts ? <span className="text-amber-400/70">尝试 {stat.attempts} 次</span> : null}
        </span>
      </span>
      <span className="shrink-0 text-xs">
        {completed ? (
          <span className="text-gold-300">{'★'.repeat(stars)}<span className="text-night-600">{'★'.repeat(3 - stars)}</span></span>
        ) : locked ? (
          <span className="text-slate-700">──</span>
        ) : (
          <span className="text-slate-600 group-hover:text-quest-400">GO →</span>
        )}
      </span>
    </motion.button>
  );
}
