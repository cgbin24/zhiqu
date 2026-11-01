import type { Level } from '@/types';

/** 星级 → XP 系数 */
export const STAR_XP_FACTOR: Record<number, number> = { 1: 1, 2: 1.15, 3: 1.3 };

export interface XpBreakdown {
  base: number;
  starBonus: number;
  dailyBonus: number;
  total: number;
}

/**
 * 计算首次通关获得 XP。
 * - 每日挑战 ×1.5
 * - 星级加成：3 星 = 1.3 倍
 */
export function xpForFirstClear(level: Level, stars: number, isDaily: boolean): XpBreakdown {
  const base = level.xp;
  const starBonus = Math.round(base * ((STAR_XP_FACTOR[stars] ?? 1) - 1));
  const dailyBonus = isDaily ? Math.round(base * 0.5) : 0;
  return { base, starBonus, dailyBonus, total: base + starBonus + dailyBonus };
}

/** 补星奖励：每提升一颗星 +15 XP */
export function xpForStarUpgrade(oldStars: number, newStars: number): number {
  return Math.max(0, newStars - oldStars) * 15;
}

export const DIFFICULTY_LABEL: Record<number, string> = {
  1: '入门',
  2: '简单',
  3: '中等',
  4: '困难',
  5: '挑战',
};

export const DIFFICULTY_COLOR: Record<number, string> = {
  1: 'text-emerald-400',
  2: 'text-lime-400',
  3: 'text-amber-400',
  4: 'text-orange-400',
  5: 'text-rose-400',
};
