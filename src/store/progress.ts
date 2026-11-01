import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ACHIEVEMENTS } from '@/data/achievements';
import { MODULES } from '@/data/modules';
import { LANGUAGES } from '@/data/languages/registry';
import { LEVELS, levelsOfChapter } from '@/data/languages';
import { xpForFirstClear, xpForStarUpgrade } from '@/game/xp';
import type {
  AchievementCheckCtx,
  AchievementDef,
  LanguageId,
  Level,
  LevelStat,
  ModuleId,
  StreakState,
} from '@/types';

/* ---------------- 日期工具 ---------------- */

export function localDateStr(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDateStr(d);
}

export function todayKey(): string {
  return localDateStr();
}

/* ---------------- 状态形状 ---------------- */

export interface ProgressState {
  version: number;
  nickname: string;
  xp: number;
  /** levelId -> 统计（stars>0 即已通关） */
  levelStats: Record<string, LevelStat>;
  /** 编辑器草稿（关卡） */
  drafts: Record<string, string>;
  /** Playground 代码（按语言） */
  playground: Record<string, string>;
  /** achievementId -> 解锁时间 ISO */
  achievements: Record<string, string>;
  streak: StreakState;
  counters: {
    totalSubmissions: number;
    totalRuns: number;
    playgroundRuns: number;
    firstTryWins: number;
    failedThenPassed: boolean;
    dailyDone: number;
    quizCorrect: number;
    quizRounds: number;
    quizPerfectRounds: number;
  };
  /** 术语百科：已浏览术语 id -> true */
  viewedTerms: Record<string, true>;
  /** 每日挑战完成记录：date -> levelId */
  dailyLog: Record<string, string>;
  lastLevelId: string | null;
  /** 正在失败的关卡（百折不挠判定） */
  failingLevels: Record<string, true>;

  /* actions */
  completeLevel: (
    level: Level,
    stars: number,
    opts?: { isDaily?: boolean },
  ) => { xpGained: number; newStars: number; firstClear: boolean; newAchievements: AchievementDef[] };
  recordHint: () => void;
  hintsUsedThisLevel: () => number;
  recordSubmission: (levelId: string, accepted: boolean) => void;
  recordRun: (playground?: boolean) => void;
  saveDraft: (levelId: string, code: string) => void;
  savePlayground: (lang: string, code: string) => void;
  markTermViewed: (termId: string) => void;
  /** 术语测验结算：答对数计入 XP（每题 +2，满分一轮 +10），返回新解锁成就 */
  recordQuiz: (correct: number, total: number) => { xpGained: number; perfect: boolean; newAchievements: AchievementDef[] };
  setNickname: (n: string) => void;
  touchStreak: () => void;
  setLastLevel: (id: string) => void;
  resetAll: () => void;
  importAll: (json: string) => boolean;
}

/* ---------------- 轻量关卡索引 ---------------- */

const ALL_LEVEL_MAP: Record<string, Level> = Object.fromEntries(LEVELS.map((l) => [l.id, l]));

/* ---------------- 派生：成就上下文 ---------------- */

export function buildAchievementCtx(s: ProgressState): AchievementCheckCtx {
  const stats = Object.entries(s.levelStats);
  const completedCount = stats.length;
  const langCompleted = { go: 0, rust: 0, cpp: 0 } as Record<LanguageId, number>;
  let algoCompleted = 0;
  const moduleCompleted = Object.fromEntries(MODULES.map((m) => [m.id, 0])) as Record<ModuleId, number>;
  let threeStarCount = 0;

  for (const [id, st] of stats) {
    if (st.stars <= 0) continue;
    if (st.stars === 3) threeStarCount++;
    const level = ALL_LEVEL_MAP[id];
    if (!level) continue;
    if (level.lang === 'algo') {
      algoCompleted++;
    } else if (level.lang === 'go' || level.lang === 'rust' || level.lang === 'cpp') {
      langCompleted[level.lang]++;
    }
    moduleCompleted[level.module]++;
  }

  let chapterCleared = 0;
  let perfectChapters = 0;
  for (const lang of LANGUAGES) {
    for (const m of MODULES) {
      const lv = levelsOfChapter(lang.id, m.id);
      if (lv.length === 0) continue;
      if (lv.every((l) => (s.levelStats[l.id]?.stars ?? 0) > 0)) {
        chapterCleared++;
        if (lv.every((l) => s.levelStats[l.id]?.stars === 3)) perfectChapters++;
      }
    }
  }

  const langsTouched = (Object.keys(langCompleted) as LanguageId[]).filter(
    (k) => langCompleted[k] > 0,
  ).length;
  // 算法课也算一种"多面手"经历
  const courseTouched = langsTouched + (algoCompleted > 0 ? 1 : 0);

  return {
    completedCount,
    langCompleted,
    algoCompleted,
    moduleCompleted,
    chapterCleared,
    perfectChapters,
    threeStarCount,
    streakCurrent: s.streak.current,
    streakBest: s.streak.best,
    totalSubmissions: s.counters.totalSubmissions,
    totalRuns: s.counters.totalRuns,
    firstTryWins: s.counters.firstTryWins,
    langsTouched: courseTouched,
    dailyDone: s.counters.dailyDone,
    playgroundUsed: s.counters.playgroundRuns > 0,
    comebackAfterFail: s.counters.failedThenPassed,
    viewedTermsCount: Object.keys(s.viewedTerms).length,
    quizCorrect: s.counters.quizCorrect,
    quizPerfectRounds: s.counters.quizPerfectRounds,
  };
}

/* ---------------- 星级 ---------------- */

/** 首次通过：0 次失败提交且未用提示 = 3星；未用提示 = 2星；否则 1星 */
export function starsFor(failedSubmissionsBefore: number, hintsUsed: number): number {
  if (failedSubmissionsBefore === 0 && hintsUsed === 0) return 3;
  if (hintsUsed === 0) return 2;
  return 1;
}

/* ---------------- streak ---------------- */

function touchStreakObj(streak: StreakState): StreakState {
  const today = localDateStr();
  if (streak.lastActiveDate === today) return streak;
  const current = streak.lastActiveDate === yesterdayStr() ? streak.current + 1 : 1;
  return { current, best: Math.max(current, streak.best), lastActiveDate: today };
}

/* ---------------- 成就评估 ---------------- */

function evaluateAchievements(
  set: (partial: Partial<ProgressState>) => void,
  get: () => ProgressState,
): AchievementDef[] {
  const s = get();
  const ctx = buildAchievementCtx(s);
  const unlocked: AchievementDef[] = [];
  const now = new Date().toISOString();
  const next = { ...s.achievements };
  for (const a of ACHIEVEMENTS) {
    if (!next[a.id] && a.check(ctx)) {
      next[a.id] = now;
      unlocked.push(a);
    }
  }
  if (unlocked.length > 0) set({ achievements: next });
  return unlocked;
}

/* ---------------- 瞬态（本关提示计数，不持久化） ---------------- */

let hintsThisLevel = 0;

/* ---------------- Store ---------------- */

const initial = {
  version: 1,
  nickname: '旅行者',
  xp: 0,
  levelStats: {} as Record<string, LevelStat>,
  drafts: {} as Record<string, string>,
  playground: {} as Record<string, string>,
  achievements: {} as Record<string, string>,
  streak: { current: 0, best: 0, lastActiveDate: null } as StreakState,
  counters: {
    totalSubmissions: 0,
    totalRuns: 0,
    playgroundRuns: 0,
    firstTryWins: 0,
    failedThenPassed: false,
    dailyDone: 0,
    quizCorrect: 0,
    quizRounds: 0,
    quizPerfectRounds: 0,
  },
  dailyLog: {} as Record<string, string>,
  lastLevelId: null as string | null,
  failingLevels: {} as Record<string, true>,
  viewedTerms: {} as Record<string, true>,
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...structuredClone(initial),

      completeLevel: (level, stars, opts) => {
        const s = get();
        const prev = s.levelStats[level.id];
        const firstClear = !prev || prev.stars === 0;
        const isDaily = Boolean(opts?.isDaily);
        let xpGained = 0;
        const newStars = Math.max(prev?.stars ?? 0, stars);

        const hintsUsed = hintsThisLevel;

        if (firstClear) {
          const bd = xpForFirstClear(level, stars, isDaily);
          xpGained = bd.total;
          const firstTry = (prev?.attempts ?? 0) === 0 && hintsUsed === 0;
          const counters = { ...s.counters };
          if (firstTry) counters.firstTryWins++;
          if (isDaily) counters.dailyDone++;
          if (s.failingLevels[level.id]) counters.failedThenPassed = true;
          const levelStats: Record<string, LevelStat> = {
            ...s.levelStats,
            [level.id]: {
              stars,
              xp: xpGained,
              attempts: prev?.attempts ?? 0,
              completedAt: new Date().toISOString(),
            },
          };
          set({
            xp: s.xp + xpGained,
            levelStats,
            counters,
            streak: touchStreakObj(s.streak),
            dailyLog: isDaily ? { ...s.dailyLog, [todayKey()]: level.id } : s.dailyLog,
            failingLevels: {},
          });
        } else if (stars > (prev?.stars ?? 0)) {
          xpGained = xpForStarUpgrade(prev?.stars ?? 0, stars);
          const levelStats: Record<string, LevelStat> = {
            ...s.levelStats,
            [level.id]: { ...prev!, stars: newStars, xp: prev!.xp + xpGained },
          };
          set({ xp: s.xp + xpGained, levelStats });
        }

        hintsThisLevel = 0;
        const newAchievements = evaluateAchievements(set, get);
        return { xpGained, newStars, firstClear, newAchievements };
      },

      recordHint: () => {
        hintsThisLevel++;
      },

      hintsUsedThisLevel: () => hintsThisLevel,

      recordSubmission: (levelId, accepted) => {
        const s = get();
        const counters = { ...s.counters, totalSubmissions: s.counters.totalSubmissions + 1 };
        let failingLevels = s.failingLevels;
        let levelStats = s.levelStats;
        if (accepted) {
          const copy = { ...failingLevels };
          delete copy[levelId];
          failingLevels = copy;
        } else {
          // 记录失败次数（用于星级：一次提交通过 = 3 星）
          const prev = s.levelStats[levelId];
          levelStats = {
            ...s.levelStats,
            [levelId]: { stars: 0, xp: 0, attempts: (prev?.attempts ?? 0) + 1, completedAt: '' },
          };
          failingLevels = { ...s.failingLevels, [levelId]: true };
        }
        set({ counters, failingLevels, levelStats, streak: touchStreakObj(s.streak) });
      },

      recordRun: (playground) => {
        const s = get();
        set({
          counters: {
            ...s.counters,
            totalRuns: s.counters.totalRuns + 1,
            playgroundRuns: s.counters.playgroundRuns + (playground ? 1 : 0),
          },
          streak: touchStreakObj(s.streak),
        });
      },

      saveDraft: (levelId, code) =>
        set((s) => ({ drafts: { ...s.drafts, [levelId]: code } })),

      savePlayground: (lang, code) =>
        set((s) => ({ playground: { ...s.playground, [lang]: code } })),

      markTermViewed: (termId) =>
        set((s) => {
          if (s.viewedTerms[termId]) return s;
          return { viewedTerms: { ...s.viewedTerms, [termId]: true }, streak: touchStreakObj(s.streak) };
        }),

      recordQuiz: (correct, total) => {
        const s = get();
        const perfect = correct === total && total > 0;
        const xpGained = correct * 2 + (perfect ? 10 : 0);
        set({
          xp: s.xp + xpGained,
          counters: {
            ...s.counters,
            quizCorrect: s.counters.quizCorrect + correct,
            quizRounds: s.counters.quizRounds + 1,
            quizPerfectRounds: s.counters.quizPerfectRounds + (perfect ? 1 : 0),
          },
          streak: touchStreakObj(s.streak),
        });
        const newAchievements = evaluateAchievements(set, get);
        return { xpGained, perfect, newAchievements };
      },

      setNickname: (n) => set({ nickname: n.trim().slice(0, 16) || '旅行者' }),

      touchStreak: () => set({ streak: touchStreakObj(get().streak) }),

      setLastLevel: (id) => set({ lastLevelId: id }),

      resetAll: () => set(structuredClone(initial)),

      importAll: (json) => {
        try {
          const data = JSON.parse(json) as Partial<ProgressState>;
          if (typeof data.xp !== 'number' || typeof data.levelStats !== 'object' || data.levelStats === null) {
            return false;
          }
          set({
            ...structuredClone(initial),
            ...data,
            version: 1,
            counters: { ...initial.counters, ...data.counters },
            streak: { ...initial.streak, ...data.streak },
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'zhiqu-codequest',
      version: 1,
    },
  ),
);
