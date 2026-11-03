import type { AchievementDef } from '@/types';
import { totalTerms } from '@/data/terms';

const TOTAL_TERMS = totalTerms();

/** 成就定义（check 均为纯函数，配合 store 计数评估） */
export const ACHIEVEMENTS: AchievementDef[] = [
  // —— 启程 ——
  { id: 'first-blood', name: '初出茅庐', desc: '通过第一关', icon: '🌱', rarity: 'common',
    check: (c) => c.completedCount >= 1, progress: (c) => [Math.min(c.completedCount, 1), 1] },
  { id: 'getting-warm', name: '渐入佳境', desc: '通过 5 关', icon: '🧭', rarity: 'common',
    check: (c) => c.completedCount >= 5, progress: (c) => [Math.min(c.completedCount, 5), 5] },
  { id: 'ten-down', name: '小试锋芒', desc: '通过 10 关', icon: '⚔️', rarity: 'common',
    check: (c) => c.completedCount >= 10, progress: (c) => [Math.min(c.completedCount, 10), 10] },
  { id: 'quarter', name: '四分之一程', desc: '通过 25 关', icon: '🛡️', rarity: 'rare',
    check: (c) => c.completedCount >= 25, progress: (c) => [Math.min(c.completedCount, 25), 25] },
  { id: 'halfway', name: '过半英雄', desc: '通过 63 关（全部的一半）', icon: '🏔️', rarity: 'epic',
    check: (c) => c.completedCount >= 63, progress: (c) => [Math.min(c.completedCount, 63), 63] },
  { id: 'completionist', name: '登峰造极', desc: '通过全部关卡', icon: '🏆', rarity: 'legendary',
    check: (c) => c.completedCount >= 126, progress: (c) => [Math.min(c.completedCount, 126), 126] },

  // —— 语言探索 ——
  { id: 'polyglot-2', name: '双刀流', desc: '在 2 种语言中各通过至少 1 关', icon: '🔀', rarity: 'rare',
    check: (c) => c.langsTouched >= 2, progress: (c) => [Math.min(c.langsTouched, 2), 2] },
  { id: 'polyglot-3', name: '多面手', desc: '在全部 3 种语言中各通过至少 1 关', icon: '🎪', rarity: 'epic',
    check: (c) => c.langsTouched >= 3, progress: (c) => [Math.min(c.langsTouched, 3), 3] },

  // —— 章节与模块 ——
  { id: 'chapter-clear', name: '章节收割者', desc: '首次清空一个章节', icon: '📜', rarity: 'rare',
    check: (c) => c.chapterCleared >= 1, progress: (c) => [Math.min(c.chapterCleared, 1), 1] },
  { id: 'chapter-5', name: '地图绘制师', desc: '清空 5 个章节', icon: '🗺️', rarity: 'epic',
    check: (c) => c.chapterCleared >= 5, progress: (c) => [Math.min(c.chapterCleared, 5), 5] },
  { id: 'chapter-all', name: '六界行者', desc: '清空 18 个章节（3 语言 × 6 模块）', icon: '🌌', rarity: 'legendary',
    check: (c) => c.chapterCleared >= 18, progress: (c) => [Math.min(c.chapterCleared, 18), 18] },
  { id: 'perfect-chapter', name: '完美主义', desc: '以 3 星评价清空一个章节', icon: '✨', rarity: 'epic',
    check: (c) => c.perfectChapters >= 1, progress: (c) => [Math.min(c.perfectChapters, 1), 1] },

  // —— 星级 ——
  { id: 'star-10', name: '摘星者', desc: '累计获得 10 个 3 星', icon: '⭐', rarity: 'common',
    check: (c) => c.threeStarCount >= 10, progress: (c) => [Math.min(c.threeStarCount, 10), 10] },
  { id: 'star-40', name: '星河收藏家', desc: '累计获得 40 个 3 星', icon: '🌟', rarity: 'rare',
    check: (c) => c.threeStarCount >= 40, progress: (c) => [Math.min(c.threeStarCount, 40), 40] },
  { id: 'star-100', name: '银河之主', desc: '累计获得 100 个 3 星', icon: '🌠', rarity: 'legendary',
    check: (c) => c.threeStarCount >= 100, progress: (c) => [Math.min(c.threeStarCount, 100), 100] },
  { id: 'first-try', name: '一发入魂', desc: '首次尝试即 3 星通关', icon: '🎯', rarity: 'rare',
    check: (c) => c.firstTryWins >= 1, progress: (c) => [Math.min(c.firstTryWins, 1), 1] },
  { id: 'first-try-10', name: '十连贯彻', desc: '10 次首次尝试即通关', icon: '🎰', rarity: 'epic',
    check: (c) => c.firstTryWins >= 10, progress: (c) => [Math.min(c.firstTryWins, 10), 10] },

  // —— 坚持 ——
  { id: 'streak-3', name: '三日之约', desc: '连续学习 3 天', icon: '🔥', rarity: 'common',
    check: (c) => c.streakBest >= 3, progress: (c) => [Math.min(c.streakBest, 3), 3] },
  { id: 'streak-7', name: '七日不辍', desc: '连续学习 7 天', icon: '📅', rarity: 'rare',
    check: (c) => c.streakBest >= 7, progress: (c) => [Math.min(c.streakBest, 7), 7] },
  { id: 'streak-30', name: '月满功成', desc: '连续学习 30 天', icon: '🌕', rarity: 'legendary',
    check: (c) => c.streakBest >= 30, progress: (c) => [Math.min(c.streakBest, 30), 30] },
  { id: 'comeback', name: '百折不挠', desc: '失败后不放弃，最终通过同一关', icon: '💪', rarity: 'common',
    check: (c) => c.comebackAfterFail, progress: (c) => [c.comebackAfterFail ? 1 : 0, 1] },

  // —— 实践 ——
  { id: 'runner-10', name: '运行爱好者', desc: '在编辑器中运行代码 10 次', icon: '▶️', rarity: 'common',
    check: (c) => c.totalRuns >= 10, progress: (c) => [Math.min(c.totalRuns, 10), 10] },
  { id: 'submit-25', name: '提交常客', desc: '累计提交判题 25 次', icon: '📮', rarity: 'common',
    check: (c) => c.totalSubmissions >= 25, progress: (c) => [Math.min(c.totalSubmissions, 25), 25] },
  { id: 'playground', name: '自由之翼', desc: '在自由练习场运行一次代码', icon: '🪁', rarity: 'common',
    check: (c) => c.playgroundUsed, progress: (c) => [c.playgroundUsed ? 1 : 0, 1] },
  { id: 'daily-1', name: '每日一炼', desc: '完成第一个每日挑战', icon: '🗓️', rarity: 'rare',
    check: (c) => c.dailyDone >= 1, progress: (c) => [Math.min(c.dailyDone, 1), 1] },
  { id: 'daily-10', name: '拾日堂主', desc: '完成 10 个每日挑战', icon: '🏮', rarity: 'epic',
    check: (c) => c.dailyDone >= 10, progress: (c) => [Math.min(c.dailyDone, 10), 10] },

  // —— 语言精通（内容 agent 会在各语言模块全部通关时授予） ——
  { id: 'go-master', name: 'Gopher 大师', desc: '完成 Go 全部关卡', icon: '🐹', rarity: 'legendary',
    check: (c) => c.langCompleted.go >= 42, progress: (c) => [Math.min(c.langCompleted.go, 42), 42] },
  { id: 'rust-master', name: 'Ferris 驯服者', desc: '完成 Rust 全部关卡', icon: '🦀', rarity: 'legendary',
    check: (c) => c.langCompleted.rust >= 42, progress: (c) => [Math.min(c.langCompleted.rust, 42), 42] },
  { id: 'cpp-master', name: 'C++ 宗师', desc: '完成 C++ 全部关卡', icon: '🐉', rarity: 'legendary',
    check: (c) => c.langCompleted.cpp >= 42, progress: (c) => [Math.min(c.langCompleted.cpp, 42), 42] },
  { id: 'algo-master', name: '算法大师', desc: '完成算法课全部关卡', icon: '🧮', rarity: 'legendary',
    check: (c) => c.algoCompleted >= 42, progress: (c) => [Math.min(c.algoCompleted, 42), 42] },

  // —— 术语百科 ——
  { id: 'term-novice', name: '术语新丁', desc: '浏览 20 个术语词条', icon: '📖', rarity: 'common',
    check: (c) => c.viewedTermsCount >= 20, progress: (c) => [Math.min(c.viewedTermsCount, 20), 20] },
  { id: 'term-explorer', name: '百科漫游者', desc: '浏览 60 个术语词条', icon: '📚', rarity: 'rare',
    check: (c) => c.viewedTermsCount >= 60, progress: (c) => [Math.min(c.viewedTermsCount, 60), 60] },
  { id: 'term-completionist', name: '行走的百科全书', desc: '浏览全部术语词条', icon: '🗃️', rarity: 'legendary',
    check: (c) => c.viewedTermsCount >= TOTAL_TERMS, progress: (c) => [Math.min(c.viewedTermsCount, TOTAL_TERMS), TOTAL_TERMS] },
  { id: 'quiz-10', name: '小试词锋', desc: '术语测验累计答对 10 题', icon: '🎓', rarity: 'common',
    check: (c) => c.quizCorrect >= 10, progress: (c) => [Math.min(c.quizCorrect, 10), 10] },
  { id: 'quiz-100', name: '词汇大师', desc: '术语测验累计答对 100 题', icon: '🏅', rarity: 'epic',
    check: (c) => c.quizCorrect >= 100, progress: (c) => [Math.min(c.quizCorrect, 100), 100] },
  { id: 'quiz-perfect', name: '满分测验', desc: '术语测验获得一次满分', icon: '💯', rarity: 'rare',
    check: (c) => c.quizPerfectRounds >= 1, progress: (c) => [Math.min(c.quizPerfectRounds, 1), 1] },
  { id: 'rush-player', name: '极限速答', desc: '速答模式单局答对 15 题', icon: '⚡', rarity: 'epic',
    check: (c) => c.quizRushBest >= 15, progress: (c) => [Math.min(c.quizRushBest, 15), 15] },
  { id: 'active-30', name: '三十日足迹', desc: '累计 30 天有学习活动', icon: '👣', rarity: 'rare',
    check: (c) => c.activeDays >= 30, progress: (c) => [Math.min(c.activeDays, 30), 30] },
  { id: 'easter-egg', name: '彩蛋猎人', desc: '发现隐藏在页面里的彩蛋', icon: '🥚', rarity: 'epic',
    check: (c) => c.easterEggFound, progress: (c) => [c.easterEggFound ? 1 : 0, 1] },
];

export const ACHIEVEMENT_MAP: Record<string, AchievementDef> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);

export const RARITY_STYLE: Record<AchievementDef['rarity'], { label: string; ring: string; glow: string }> = {
  common: { label: '普通', ring: 'ring-slate-500/50', glow: 'shadow-slate-500/20' },
  rare: { label: '稀有', ring: 'ring-sky-400/60', glow: 'shadow-sky-500/30' },
  epic: { label: '史诗', ring: 'ring-fuchsia-400/60', glow: 'shadow-fuchsia-500/30' },
  legendary: { label: '传说', ring: 'ring-amber-400/70', glow: 'shadow-amber-500/40' },
};
