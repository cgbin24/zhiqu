import type { RankDef } from '@/types';

/** 段位：按全平台总 XP */
export const RANKS: RankDef[] = [
  { name: '青铜', minXp: 0, icon: '🥉', color: '#b08d57' },
  { name: '白银', minXp: 400, icon: '🥈', color: '#9fb4c7' },
  { name: '黄金', minXp: 1000, icon: '🥇', color: '#fbbf24' },
  { name: '铂金', minXp: 1800, icon: '💎', color: '#67e8f9' },
  { name: '钻石', minXp: 3000, icon: '💠', color: '#a5b4fc' },
  { name: '大师', minXp: 4500, icon: '👑', color: '#f0abfc' },
  { name: '宗师', minXp: 6000, icon: '🔥', color: '#fb7185' },
];

export function getRank(xp: number): { rank: RankDef; next: RankDef | null; pct: number } {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].minXp) idx = i;
  }
  const rank = RANKS[idx];
  const next = idx + 1 < RANKS.length ? RANKS[idx + 1] : null;
  const pct = next
    ? Math.min(100, Math.round(((xp - rank.minXp) / (next.minXp - rank.minXp)) * 100))
    : 100;
  return { rank, next, pct };
}
