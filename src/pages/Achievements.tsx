import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ACHIEVEMENTS, RARITY_STYLE } from '@/data/achievements';
import { buildAchievementCtx, useProgress } from '@/store/progress';

export function Achievements() {
  const achievements = useProgress((s) => s.achievements);
  const state = useProgress((s) => s);
  const ctx = useMemo(() => buildAchievementCtx(state), [state]);
  const unlockedCount = Object.keys(achievements).length;

  const groups: Array<[string, typeof ACHIEVEMENTS]> = [
    ['🏆 里程碑', ACHIEVEMENTS.filter((a) => ['first-blood', ' Getting-warm', 'ten-down', 'quarter', 'halfway', 'completionist'].includes(a.id))],
    ['🗺️ 探索', ACHIEVEMENTS.filter((a) => ['polyglot-2', 'polyglot-3', 'chapter-clear', 'chapter-5', 'chapter-all', 'perfect-chapter'].includes(a.id))],
    ['⭐ 星辉', ACHIEVEMENTS.filter((a) => ['star-10', 'star-40', 'star-100', 'first-try', 'first-try-10'].includes(a.id))],
    ['🔥 坚持', ACHIEVEMENTS.filter((a) => ['streak-3', 'streak-7', 'streak-30', 'comeback'].includes(a.id))],
    ['🛠️ 实践', ACHIEVEMENTS.filter((a) => ['runner-10', 'submit-25', 'playground', 'daily-1', 'daily-10'].includes(a.id))],
    ['👑 精通', ACHIEVEMENTS.filter((a) => ['go-master', 'rust-master', 'cpp-master'].includes(a.id))],
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-baseline gap-3">
        <h1 className="text-xl font-bold text-slate-100">成就墙</h1>
        <span className="text-sm text-slate-500">{unlockedCount} / {ACHIEVEMENTS.length} 已解锁</span>
        <div className="ml-auto h-2 w-48 overflow-hidden rounded-full bg-night-800">
          <div className="h-full rounded-full bg-gradient-to-r from-quest-500 to-gold-400" style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-6">
        {groups.map(([title, list]) => (
          <section key={title}>
            <h2 className="mb-2 text-sm font-bold text-slate-300">{title}</h2>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((a, i) => {
                const unlockedAt = achievements[a.id];
                const style = RARITY_STYLE[a.rarity];
                const prog = a.progress?.(ctx);
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={`relative overflow-hidden rounded-xl border p-3.5 ${
                      unlockedAt
                        ? `border-night-600 bg-night-850 shadow-md ${style.glow} ring-1 ${style.ring}`
                        : 'border-night-800 bg-night-900/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`text-3xl ${unlockedAt ? '' : 'opacity-25 saturate-0'}`}>{a.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`truncate font-bold ${unlockedAt ? 'text-slate-100' : 'text-slate-500'}`}>{a.name}</span>
                          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold ${unlockedAt ? style.ring + ' text-slate-300' : 'text-slate-600'}`}>{style.label}</span>
                        </div>
                        <p className={`mt-0.5 text-xs ${unlockedAt ? 'text-slate-400' : 'text-slate-600'}`}>{a.desc}</p>
                        {!unlockedAt && prog && prog[1] > 1 && (
                          <div className="mt-2">
                            <div className="h-1 overflow-hidden rounded-full bg-night-800">
                              <div className="h-full rounded-full bg-quest-500/60" style={{ width: `${Math.min(100, (prog[0] / prog[1]) * 100)}%` }} />
                            </div>
                            <div className="mt-0.5 text-right text-[10px] text-slate-600">{prog[0]}/{prog[1]}</div>
                          </div>
                        )}
                        {unlockedAt && (
                          <div className="mt-1 text-[10px] text-emerald-400/80">✓ {new Date(unlockedAt).toLocaleDateString('zh-CN')} 解锁</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
