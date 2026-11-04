import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronRight, Flame, Play, Zap } from 'lucide-react';
import { ACHIEVEMENTS } from '@/data/achievements';
import { dailyLevel, levelsOfChapter, totalLevels } from '@/data/languages';
import { COURSES, LANGUAGES } from '@/data/languages/registry';
import { BrandLogo } from '@/components/BrandLogo';
import { MODULES } from '@/data/modules';
import { getRank } from '@/data/ranks';
import { useProgress } from '@/store/progress';

export function Dashboard() {
  const xp = useProgress((s) => s.xp);
  const nickname = useProgress((s) => s.nickname);
  const streak = useProgress((s) => s.streak);
  const levelStats = useProgress((s) => s.levelStats);
  const lastLevelId = useProgress((s) => s.lastLevelId);
  const achievements = useProgress((s) => s.achievements);

  const completedIds = useMemo(
    () => new Set(Object.keys(levelStats).filter((k) => levelStats[k].stars > 0)),
    [levelStats],
  );
  const { rank, next, pct } = getRank(xp);
  const total = totalLevels();
  const done = completedIds.size;

  const daily = dailyLevel();
  const dailyCompleted = useMemo(() => {
    const s = useProgress.getState();
    return Boolean(Object.entries(s.dailyLog).find(([d]) => d === formatToday())?.[1] === daily.id);
  }, [daily.id]);

  const continueLevel = useMemo(() => {
    if (lastLevelId) {
      const l = ALL_LEVELS.find((x) => x.id === lastLevelId);
      if (l && !completedIds.has(l.id)) return l;
    }
    return ALL_LEVELS.find((l) => !completedIds.has(l.id)) ?? ALL_LEVELS[0];
  }, [lastLevelId, completedIds]);

  const recentAchievements = useMemo(
    () =>
      Object.entries(achievements)
        .sort((a, b) => (a[1] < b[1] ? 1 : -1))
        .slice(0, 4)
        .map(([id]) => ACHIEVEMENTS.find((a) => a.id === id))
        .filter(Boolean),
    [achievements],
  );

  return (
    <div className="space-y-6">
      {/* 顶部：欢迎 + 段位进度 + 继续闯关 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-night-700 bg-night-900 p-5 lg:col-span-2">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-quest-500/10 blur-2xl" />
          <p className="text-sm text-slate-400">欢迎回来，</p>
          <h1 className="text-2xl font-black text-slate-100">{nickname} 👋</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-night-800 text-2xl" style={{ boxShadow: `0 0 18px ${rank.color}44` }}>
              {rank.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-bold" style={{ color: rank.color }}>{rank.name}</span>
                <span className="text-xs text-slate-500">⚡ {xp} XP</span>
                {next && <span className="ml-auto text-xs text-slate-500">距 {next.name} 还需 {next.minXp - xp} XP</span>}
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-night-800">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-quest-500 via-fuchsia-500 to-gold-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1.5 rounded-lg border border-night-700 bg-night-850 px-3 py-1.5 text-slate-300">
              <Zap size={13} className="text-quest-400" /> {done}/{total} 关卡
            </span>
            <span className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 ${streak.current > 0 ? 'border-orange-500/40 bg-orange-500/10 text-orange-300' : 'border-night-700 bg-night-850 text-slate-400'}`}>
              <Flame size={13} /> 连续 {streak.current} 天 · 最长 {streak.best} 天
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-night-700 bg-night-850 px-3 py-1.5 text-slate-300">
              🎖️ 成就 {Object.keys(achievements).length}/{ACHIEVEMENTS.length}
            </span>
          </div>
        </div>

        {/* 继续闯关 + 每日挑战 */}
        <div className="flex flex-col gap-4">
          {continueLevel && (
            <Link
              to={`/level/${continueLevel.id}`}
              className="group relative overflow-hidden rounded-2xl border border-quest-500/40 bg-gradient-to-br from-quest-500/15 to-fuchsia-500/10 p-4 transition-all hover:border-quest-500/70"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-quest-400">
                <Play size={13} /> 继续闯关
              </div>
              <div className="mt-1.5 font-bold text-slate-100">
                {LANGUAGES.find((l) => l.id === continueLevel.lang)?.name} · {continueLevel.title}
              </div>
              <div className="mt-0.5 text-xs text-slate-400">{chapterLabel(continueLevel.id)}</div>
              <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-quest-400 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          <Link
            to={`/level/${daily.id}`}
            className={`group relative overflow-hidden rounded-2xl border p-4 transition-all ${
              dailyCompleted ? 'border-night-700 bg-night-900' : 'border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-500/15 to-rose-500/10 hover:border-fuchsia-500/70'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fuchsia-300">
              <CalendarDays size={13} /> 每日挑战 · ×1.5 XP
            </div>
            <div className="mt-1.5 font-bold text-slate-100">{daily.title}</div>
            <div className="mt-0.5 text-xs text-slate-400">
              {LANGUAGES.find((l) => l.id === daily.lang)?.name} · {chapterLabel(daily.id)}
              {dailyCompleted && <span className="ml-2 text-emerald-400">今日已完成 ✓</span>}
            </div>
          </Link>
        </div>
      </div>

      {/* 课程进度 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COURSES.map((c) => {
          const all = MODULES.flatMap((m) => levelsOfChapter(c.id, m.id));
          const d = all.filter((x) => completedIds.has(x.id)).length;
          const stars = all.reduce((acc, x) => acc + (levelStats[x.id]?.stars ?? 0), 0);
          const ratio = all.length ? d / all.length : 0;
          return (
            <Link
              key={c.id}
              to={`/learn/${c.id}`}
              className="flex items-center gap-3 rounded-2xl border border-night-700 bg-night-900 p-4 transition-colors hover:border-night-600"
            >
              <ProgressRing ratio={ratio} color={c.color} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-black" style={{ color: c.color }}>
                  <BrandLogo brand={c.logo ?? 'algo'} size={18} /> {c.name}
                </div>
                <div className="text-xs text-slate-500">{d}/{all.length} 关 · ★ {stars}</div>
                <div className="mt-1.5 text-[11px] text-slate-600">{nextChapterLabel(c.id, completedIds)}</div>
              </div>
              <ChevronRight size={15} className="text-slate-600" />
            </Link>
          );
        })}
      </div>

      {/* 最近成就 */}
      {recentAchievements.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-bold text-slate-300">最近解锁的成就</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {recentAchievements.map((a) => (
              <div key={a!.id} className="flex items-center gap-2.5 rounded-xl border border-night-700 bg-night-900 p-3">
                <span className="text-2xl">{a!.icon}</span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-200">{a!.name}</div>
                  <div className="truncate text-[11px] text-slate-500">{a!.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 模块说明 */}
      <div>
        <h2 className="mb-2 text-sm font-bold text-slate-300">学习路径 · 六大模块</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <div key={m.id} className="flex items-center gap-3 rounded-xl border border-night-700 bg-night-900 p-3">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${m.gradient} text-sm text-white`}>
                {['{}', '🧠', '⚔️', '💡', '🛡️', '🚀'][i]}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-200">{m.name}</div>
                <div className="truncate text-[11px] text-slate-500">{m.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 术语百科入口 */}
      <Link
        to="/terms"
        className="group flex items-center gap-3 rounded-2xl border border-quest-500/40 bg-gradient-to-r from-quest-500/12 to-fuchsia-500/8 p-4 transition-all hover:border-quest-500/70"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-quest-500 to-fuchsia-500 text-lg shadow-lg shadow-quest-500/25">📖</span>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-slate-100">术语百科 <span className="ml-1 text-xs font-normal text-slate-400">全链路 · 页面效果 · 前后端 · 安全 · 网络 · 数据结构与算法 · 工具链 · Agent · AI · 编程英语</span></div>
          <div className="text-xs text-slate-400">534 个核心术语：全链路地图 + 页面效果实时演示 + 算法可视化 + 测验/速答得 XP</div>
        </div>
        <ChevronRight size={16} className="text-quest-400 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function ProgressRing({ ratio, color, size = 62 }: { ratio: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e2942" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - ratio)}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" transform={`rotate(90 ${size / 2} ${size / 2})`} className="fill-slate-300 text-[13px] font-bold">
        {Math.round(ratio * 100)}%
      </text>
    </svg>
  );
}

/* 延迟导入避免循环依赖 */
import { LEVELS as ALL_LEVELS } from '@/data/languages';

function formatToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function chapterLabel(levelId: string): string {
  const l = ALL_LEVELS.find((x) => x.id === levelId);
  if (!l) return '';
  const mod = MODULES.find((m) => m.id === l.module);
  return mod ? `${mod.name} #${l.order}` : '';
}

function nextChapterLabel(langId: string, completedIds: Set<string>): string {
  const mod = MODULES.find((m) =>
    levelsOfChapter(langId as never, m.id).some((l) => !completedIds.has(l.id)),
  );
  if (!mod) return '全部通关！🏆';
  const remaining = levelsOfChapter(langId as never, mod.id).filter((l) => !completedIds.has(l.id));
  return `进行中：${mod.name} 第 ${remaining[0]?.order ?? 1} 关`;
}
