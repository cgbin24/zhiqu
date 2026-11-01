/** 全局类型定义 —— 智码 CodeQuest */

/* ---------- 语言 ---------- */

export type LanguageId = 'go' | 'rust' | 'cpp';

/** 执行器配置：主用 Godbolt（最新版本），备用 Wandbox */
export interface ExecutorConfig {
  /** Compiler Explorer 编译器 id，如 gl1260 */
  godboltId: string;
  /** 附加编译参数，如 "-std=c++20" */
  godboltArgs?: string;
  /** Wandbox 备用编译器 id，如 go-1.23.2 */
  wandboxId?: string;
}

export interface LanguageDef {
  id: LanguageId;
  name: string;
  tagline: string;
  /** 主题色（hex） */
  color: string;
  /** Tailwind 渐变类（语言卡片/地图用） */
  gradient: string;
  /** Monaco 语言 id */
  monaco: string;
  /** 单文件名 */
  fileName: string;
  executor: ExecutorConfig;
  /** Playground 默认模板 */
  template: string;
}

/* ---------- 模块 / 章节 / 关卡 ---------- */

/** 六大学习模块（所有语言共用同一骨架） */
export type ModuleId = 'basic' | 'paradigm' | 'advanced' | 'tips' | 'best' | 'integration';

export interface ModuleDef {
  id: ModuleId;
  name: string;
  subtitle: string;
  /** lucide 图标名（注册表映射） */
  icon: string;
  /** Tailwind 渐变类 */
  gradient: string;
}

export interface TestCase {
  name: string;
  stdin: string;
  expected: string;
  /** 隐藏用例：只展示通过与否，不展示内容 */
  hidden?: boolean;
  /** 命令行参数 */
  args?: string[];
}

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Level {
  /** 全局唯一，如 go-basic-3 */
  id: string;
  lang: LanguageId;
  module: ModuleId;
  /** 关卡在章节内的序号（1 起） */
  order: number;
  title: string;
  difficulty: Difficulty;
  /** 基础 XP（星级/每日挑战会加成） */
  xp: number;
  /** 本关目标（要点列表） */
  goals: string[];
  /** 知识讲解（Markdown） */
  brief: string;
  /** 任务描述（Markdown） */
  task: string;
  /** 起始代码骨架 */
  starter: string;
  /** 参考答案（用于验证与「查看答案」） */
  solution: string;
  /** 渐进提示（3 级） */
  hints: [string, string, string];
  tests: TestCase[];
}

/* ---------- 判题 ---------- */

export interface ExecRequest {
  lang: LanguageId;
  source: string;
  stdin: string;
  args?: string[];
}

export interface ExecResult {
  /** 是否成功编译并执行 */
  executed: boolean;
  /** 编译失败信息（ compilers' stderr） */
  compileError?: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timeMs?: number;
  provider: 'godbolt' | 'wandbox';
}

export type Verdict = 'accepted' | 'wrong-answer' | 'compile-error' | 'runtime-error' | 'timeout' | 'internal-error';

export interface JudgeCaseResult {
  name: string;
  hidden: boolean;
  verdict: Verdict;
  /** 实际 stdout（隐藏用例为空） */
  actual: string;
  expected: string;
  timeMs?: number;
  compileError?: string;
  /** 运行时 stderr 摘要 */
  stderr?: string;
}

export interface JudgeResult {
  verdict: Verdict;
  passed: number;
  total: number;
  cases: JudgeCaseResult[];
  compileError?: string;
}

/* ---------- 游戏化 ---------- */

export interface RankDef {
  name: string;
  minXp: number;
  icon: string;
  color: string;
}

export type AchievementCheckCtx = {
  completedCount: number;
  langCompleted: Record<LanguageId, number>;
  moduleCompleted: Record<ModuleId, number>;
  chapterCleared: number;
  perfectChapters: number;
  threeStarCount: number;
  streakCurrent: number;
  streakBest: number;
  totalSubmissions: number;
  totalRuns: number;
  firstTryWins: number;
  langsTouched: number;
  dailyDone: number;
  playgroundUsed: boolean;
  comebackAfterFail: boolean;
};

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  /** 稀有度：普通/稀有/史诗/传说 */
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  check: (ctx: AchievementCheckCtx) => boolean;
  /** 进度展示：返回 [当前, 目标]，无则不展示进度条 */
  progress?: (ctx: AchievementCheckCtx) => [number, number];
}

/* ---------- 进度存储 ---------- */

export interface LevelStat {
  stars: number;
  xp: number;
  attempts: number;
  completedAt: string;
}

export interface StreakState {
  current: number;
  best: number;
  lastActiveDate: string | null;
}
