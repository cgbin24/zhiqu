import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { MODULES } from '@/data/modules';
import { COURSES, getCourse, getModuleName, getModuleSubtitle } from '@/data/languages/registry';
import { BrandLogo } from '@/components/BrandLogo';
import { isLevelUnlocked, levelsOfChapter, testCaseSummary } from '@/data/languages';
import { DIFFICULTY_COLOR } from '@/game/xp';
import { textOn } from '@/lib/color';
import { useProgress } from '@/store/progress';
import type { CourseId, Level } from '@/types';

export function LearnPath() {
  const { lang = 'go' } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const levelStats = useProgress((s) => s.levelStats);

  const completedIds = useMemo(
    () => new Set(Object.keys(levelStats).filter((k) => levelStats[k].stars > 0)),
    [levelStats],
  );
  const course = getCourse(lang) ?? COURSES[0];

  return (
    <div>
      {/* 课程切换 */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {COURSES.map((c) => {
          const lv = MODULES.flatMap((m) => levelsOfChapter(c.id, m.id));
          const done = lv.filter((x) => completedIds.has(x.id)).length;
          const active = c.id === course.id;
          return (
            <Link
              key={c.id}
              to={`/learn/${c.id}`}
              className={`group relative overflow-hidden rounded-2xl border p-3.5 transition-all ${
                active ? 'border-transparent ring-2 shadow-lg' : 'border-night-700 hover:border-night-600'
              }`}
              style={active ? ({ '--tw-ring-color': c.color } as CSSProperties) : undefined}
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-10 ${c.gradient}`} />
              <div className="relative flex items-center gap-2.5">
                <BrandLogo brand={c.logo ?? "algo"} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-base font-black brand-text" style={{ '--brand': c.color } as CSSProperties}>{c.name}</div>
                  <div className="truncate text-[10px] text-slate-400">{c.tagline}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-slate-200">{done}<span className="text-xs text-slate-500">/{lv.length}</span></div>
                </div>
              </div>
              <div className="relative mt-2.5 h-1.5 overflow-hidden rounded-full bg-night-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${c.gradient} transition-all`}
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
          const lv = levelsOfChapter(course.id as CourseId, mod.id);
          const done = lv.filter((x) => completedIds.has(x.id)).length;
          const stars = lv.reduce((acc, x) => acc + (levelStats[x.id]?.stars ?? 0), 0);
          const maxStars = lv.length * 3;
          return (
            <section key={mod.id} className="overflow-hidden rounded-2xl border border-night-700 bg-night-900">
              <header className="relative flex flex-wrap items-center gap-3 overflow-hidden border-b border-night-700 bg-night-850 px-4 py-3">
                {/* 柔和洗色层：模块色低透明度铺底（替代失效的 bg-opacity-10），文字全部用高对比档位 */}
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${mod.gradient} opacity-[0.06]`} aria-hidden />
                <span className={`relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${mod.gradient} text-white shadow`}>
                  <ModuleIcon name={mod.icon} />
                </span>
                <div className="relative min-w-0 flex-1">
                  <h2 className="text-[15px] font-black text-slate-100">
                    第 {MODULES.indexOf(mod) + 1} 章 · {getModuleName(course, mod.id) || mod.name}
                  </h2>
                  <p className="relative mt-0.5 truncate text-xs font-medium text-slate-300">{getModuleSubtitle(course, mod.id, mod.subtitle)}</p>
                </div>
                <div className="relative text-right text-xs">
                  <div className="font-black text-slate-100">{done}/{lv.length} 关</div>
                  <div className="font-bold text-slate-300"><span className="text-gold-300">★</span> {stars}/{maxStars}</div>
                </div>
              </header>
              <div className="relative p-4">
                <ChapterPath ids={lv.map((l) => l.id)} completedIds={completedIds} />
                <div className="relative z-10 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {lv.map((level, i) => (
                    <LevelNode
                      key={level.id}
                      level={level}
                      index={i}
                      langColor={course.color}
                      locked={!isLevelUnlocked(level, completedIds)}
                      stars={levelStats[level.id]?.stars ?? 0}
                      completed={completedIds.has(level.id)}
                      onClick={() => navigate(`/level/${level.id}`)}
                    />
                  ))}
                </div>
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

/* ---------- 章节路径连线：游戏地图式串联 ---------- */

/**
 * 测量章节内各关卡卡片的中心点，绘制游戏地图式连接线。
 * 同行直线相连；跨行用平滑贝塞尔曲线。已完成段绿色、当前可打段紫色、未解锁段灰色虚线。
 * 线绘制在卡片层之下（z-0），从卡片间隙中透出。
 */
function ChapterPath({ ids, completedIds }: { ids: string[]; completedIds: Set<string> }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [segs, setSegs] = useState<{ d: string; color: string; dash: boolean }[]>([]);

  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const wRect = wrap.getBoundingClientRect();
      const pts = Array.from(wrap.querySelectorAll<HTMLElement>('[data-node]')).map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - wRect.left + r.width / 2, y: r.top - wRect.top + r.height / 2 };
      });
      if (pts.length !== ids.length || pts.length < 2) {
        setSegs([]);
        return;
      }
      const next: { d: string; color: string; dash: boolean }[] = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const doneA = completedIds.has(ids[i]);
        const doneB = completedIds.has(ids[i + 1]);
        const color = doneA && doneB ? '#34d399' : doneA ? '#a78bfa' : '#2b3a5c';
        const dash = !doneA;
        let d: string;
        if (Math.abs(a.y - b.y) < 4) {
          d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
        } else {
          // 跨行：平滑 S 曲线
          const bend = Math.abs(b.y - a.y) * 0.55;
          const dirA = b.x > a.x ? 1 : -1;
          const dirB = b.x > a.x ? -1 : 1;
          d = `M ${a.x} ${a.y} C ${a.x + dirA * bend} ${a.y + bend * 0.35}, ${b.x + dirB * bend} ${b.y - bend * 0.35}, ${b.x} ${b.y}`;
        }
        next.push({ d, color, dash });
      }
      setSegs(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [ids, completedIds]);

  return (
    <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden="true">
      {segs.map((s, i) => (
        <path
          key={i}
          d={s.d}
          fill="none"
          stroke={s.color}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={s.dash ? '2 10' : undefined}
          opacity={0.75}
        />
      ))}
    </svg>
  );
}

function LevelNode({
  level, index, langColor, locked, stars, completed, onClick,
}: {
  level: Level; index: number; langColor: string; locked: boolean; stars: number; completed: boolean; onClick: () => void;
}) {
  const stat = useProgress.getState().levelStats[level.id];
  return (
    <motion.button
      data-node={level.id}
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
              : ''
        }`}
        style={!locked && !completed ? { background: `linear-gradient(135deg, ${langColor}cc, ${langColor}66)`, color: textOn(langColor) } : undefined}
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
