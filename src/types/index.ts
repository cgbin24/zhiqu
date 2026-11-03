/** 全局类型定义 —— 智码 CodeQuest */

/* ---------- 语言 ---------- */

export type LanguageId = 'go' | 'rust' | 'cpp' | 'javascript';

/** 课程轨道：三门语言课 + 算法课 */
export type CourseId = 'go' | 'rust' | 'cpp' | 'javascript' | 'algo';

/** 算法关可选择的作答语言 */
export type AlgoLang = 'go' | 'rust' | 'cpp' | 'javascript';

/** 执行器配置：godbolt（云端最新版本）/ local（浏览器本地执行，仅 JS） */
export interface ExecutorConfig {
  /** Compiler Explorer 编译器 id，如 gl1260 */
  godboltId?: string;
  /** 附加编译参数，如 "-std=c++20" */
  godboltArgs?: string;
  /** Wandbox 备用编译器 id，如 go-1.23.2 */
  wandboxId?: string;
  /** 执行方式：默认 godbolt 云端；local = 浏览器内直接执行（JS） */
  provider?: 'godbolt' | 'local';
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
  /** 是否作为独立课程出现在闯关地图（JS 仅作为执行语言与练习场语言） */
  learnable?: boolean;
}

/** 算法关多语言代码集 */
export interface AlgoCodeSet {
  starters: Partial<Record<AlgoLang, string>>;
  solutions: Partial<Record<AlgoLang, string>>;
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

/** 算法可视化种类（component: AlgoVisualizer） */
export type AlgoVizKind =
  | 'sort'            // param: bubble | insertion | merge | quick | selection
  | 'binary-search'   // 二分查找
  | 'two-pointer'     // 对撞双指针
  | 'sliding-window'  // 滑动窗口
  | 'prefix-sum'      // 前缀和构建
  | 'recursion-tree'  // 递归调用树
  | 'hash-table'      // 哈希表插入与冲突
  | 'stack'           // 栈操作（括号匹配）
  | 'linked-list'     // 链表指针操作
  | 'tree-traversal'  // 二叉树遍历
  | 'grid'            // param: bfs | dfs 网格搜索
  | 'dp-table'        // 动态规划填表
  | 'dijkstra'        // Dijkstra 最短路（权重图）
  | 'josephus'        // 约瑟夫环（循环计数消除）
  | 'topo-sort'       // 拓扑排序（入度递减）
  | 'lru'             // LRU 缓存（最近使用 + 淘汰）
  | 'merge-interval'; // 合并区间（扫描合并）

export interface Level {
  /** 全局唯一，如 go-basic-3 / algo-basic-1 */
  id: string;
  /** 所属课程轨道（三门语言 或 algo） */
  lang: CourseId;
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
  /** 起始代码骨架（单语言课程使用） */
  starter?: string;
  /** 参考答案（单语言课程使用；算法课用 algo 字段） */
  solution?: string;
  /** 算法课：多语言起始代码与参考答案（存在时 LevelPlay 出现语言切换） */
  algo?: AlgoCodeSet;
  /** 算法可视化配置 */
  visualizer?: { kind: AlgoVizKind; param?: string };
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
  algoCompleted: number;
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
  viewedTermsCount: number;
  quizCorrect: number;
  quizPerfectRounds: number;
  quizRushBest: number;
  activeDays: number;
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
