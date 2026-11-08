import type { CourseId, ExecutorConfig, LanguageDef, LanguageId } from '@/types';

/**
 * 语言注册表 —— 可扩展架构的核心：
 * 新增语言 = 增加一个 LanguageDef + 对应章节内容文件，其余零改动。
 *
 * 执行引擎：Godbolt 为主（编译器版本最新），Wandbox 为备；JS 为浏览器本地执行（零延迟）。
 */
export const LANGUAGES: LanguageDef[] = [
  {
    id: 'go',
    name: 'Go',
    tagline: '简洁、高效、为并发而生',
    color: '#00add8',
    gradient: 'from-cyan-500 to-sky-400',
    monaco: 'go',
    fileName: 'main.go',
    executor: { godboltId: 'gl1260', wandboxId: 'go-1.23.2' },
    template: `package main

import "fmt"

func main() {
	fmt.Println("Hello, Go Quest!")
}
`,
  },
  {
    id: 'rust',
    name: 'Rust',
    tagline: '无畏并发，内存安全',
    color: '#f74c00',
    gradient: 'from-orange-500 to-amber-400',
    monaco: 'rust',
    fileName: 'main.rs',
    executor: { godboltId: 'r1990', wandboxId: 'rust-1.69.0' },
    template: `fn main() {
    println!("Hello, Rust Quest!");
}
`,
  },
  {
    id: 'cpp',
    name: 'C++',
    tagline: '极致性能，掌控一切',
    color: '#659ad2',
    gradient: 'from-blue-500 to-indigo-400',
    monaco: 'cpp',
    fileName: 'main.cpp',
    executor: { godboltId: 'g162', godboltArgs: '-std=c++20', wandboxId: 'gcc-13.2.0' },
    template: `#include <iostream>

int main() {
    std::cout << "Hello, C++ Quest!" << std::endl;
    return 0;
}
`,
  },
  {
    id: 'bash',
    name: 'Bash',
    tagline: 'Linux 命令行（本地模拟执行）',
    color: '#89e051',
    gradient: 'from-lime-500 to-green-400',
    monaco: 'shell',
    fileName: 'commands.sh',
    executor: { provider: 'local' },
    learnable: false,
    template: `# Linux 命令在本地模拟器中执行
pwd
ls
`,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    tagline: '浏览器原生语言，本地瞬时执行',
    color: '#eab308',
    gradient: 'from-yellow-400 to-amber-500',
    monaco: 'javascript',
    fileName: 'main.js',
    executor: { provider: 'local' },
    learnable: false,
    template: `// JavaScript 在浏览器内直接执行，无需等待云端
// stdin 已按行注入：readline() 读一行，readInts() 读一行整数数组
const n = Number(readline());
console.log("Hello, JS Quest! n =", n);
console.log("平方：", n * n);
`,
  },
  {
    id: 'prompt',
    name: 'Prompt 规格',
    tagline: 'AI 协作文档（要素体检判题）',
    color: '#f472b6',
    gradient: 'from-pink-500 to-rose-400',
    monaco: 'markdown',
    fileName: 'prompt.md',
    executor: { provider: 'local' },
    learnable: false,
    template: `<!-- AI 协作课程：以 Markdown 文档作答，判题引擎检查关键要素 -->
# 任务

<!-- 你要 AI 做什么，一句话说清 -->

## 约束

<!-- 技术栈 / 边界 / 不要做的事 -->
`,
  },
  {
    id: 'kb',
    name: '知识库',
    tagline: 'PARA 方法论（本地知识库模拟器）',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-yellow-500',
    monaco: 'shell',
    fileName: 'kb.sh',
    executor: { provider: 'local' },
    learnable: false,
    template: '# 知识库命令在本地 PARA 模拟器中执行\nkb init\nkb tree',
  },
  {
    id: 'git',
    name: 'Git',
    tagline: '版本控制命令（本地仓库模拟器）',
    color: '#f05133',
    gradient: 'from-orange-600 to-rose-500',
    monaco: 'shell',
    fileName: 'git.sh',
    executor: { provider: 'local' },
    learnable: false,
    template: `# Git 命令在本地仓库模拟器中执行
git init
git status
`,
  },
];

export const LANG_MAP: Record<LanguageId, LanguageDef> = Object.fromEntries(
  LANGUAGES.map((l) => [l.id, l]),
) as Record<LanguageId, LanguageDef>;

export function getLang(id: string | undefined): LanguageDef | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

/* ---------- 课程轨道（语言课 + 算法课） ---------- */

/** 课程轨道的统一展示定义 */
export interface CourseDef {
  id: CourseId;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  gradient: string;
  /** 关卡作答使用的执行语言集合 */
  execLangs: LanguageId[];
  /** 品牌 logo（内联 SVG 渲染） */
  logo?: 'go' | 'rust' | 'cpp' | 'linux' | 'algo' | 'agentdev' | 'collab' | 'git' | 'kb';
  /** 课程级模块名覆盖（如 Linux 课的"文件与目录"） */
  moduleNames?: Partial<Record<string, string>>;
  /** 课程级模块副标题覆盖 */
  moduleSubtitles?: Partial<Record<string, string>>;
}

/** 算法课：语言无关，作答语言可切换（JS 本地执行，其余云端） */
/** Linux 课程：模拟终端判题 */
export const LINUX_TRACK: CourseDef = {
  id: 'linux',
  name: 'Linux',
  tagline: '命令行实战，虚拟终端真实判题',
  icon: '🐧',
  color: '#a3e635',
  gradient: 'from-lime-500 to-green-500',
  execLangs: ['bash'],
  logo: 'linux',
  moduleNames: {
    basic: '文件与目录',
    paradigm: '文本处理与管道',
    advanced: '权限与进程',
    tips: 'Shell 脚本入门',
    best: '系统管理',
    integration: '综合实战',
  },
  moduleSubtitles: {
    basic: '目录、文件与路径，命令行第一步',
    paradigm: 'grep / sort / uniq / wc 管道组合',
    advanced: '权限位、查找与身份',
    tips: '从命令到可执行脚本',
    best: '系统管理常用操作',
    integration: '真实日志分析场景',
  },
};

export const ALGO_TRACK: CourseDef = {
  id: 'algo',
  name: '算法',
  tagline: '从入门到实战，可视化理解每一步',
  icon: '🧮',
  color: '#c084fc',
  gradient: 'from-purple-500 to-indigo-400',
  execLangs: ['javascript', 'go', 'rust', 'cpp'],
  logo: 'algo',
};

/** Agent 开发实战课：Mock LLM 本地判题 */
export const AGENTDEV_TRACK: CourseDef = {
  id: 'agentdev',
  name: 'Agent 实战',
  tagline: '从提示词到多智能体，真实模式离线跑',
  icon: '🤖',
  color: '#38bdf8',
  gradient: 'from-sky-500 to-cyan-400',
  execLangs: ['javascript'],
  logo: 'agentdev',
  moduleNames: {
    basic: 'LLM 基础调用',
    paradigm: 'Prompt 工程',
    advanced: '工具调用与循环',
    tips: '记忆与 RAG',
    best: '多智能体与评估',
    integration: '综合实战',
  },
  moduleSubtitles: {
    basic: '消息、Token 与采样',
    paradigm: 'Few-shot / CoT / 结构化输出',
    advanced: 'Function Calling 与 Agent Loop',
    tips: '会话记忆与检索增强',
    best: '多智能体、护栏与评测',
    integration: '真实场景综合',
  },
};

export const LEARNABLE_LANGS = LANGUAGES.filter((l) => l.learnable !== false);

/** 知识库工程课：PARA 方法论，本地知识库模拟器真实判题 */
export const KB_TRACK: CourseDef = {
  id: 'kb',
  name: '知识库工程',
  tagline: '从零搭建真实可运行的个人知识库，PARA 方法论全程实战',
  icon: '📚',
  color: '#f59e0b',
  gradient: 'from-amber-500 to-yellow-500',
  execLangs: ['kb'],
  logo: 'kb',
  moduleNames: {
    basic: '方案与初始化',
    paradigm: '记录与链接',
    advanced: '检索与发现',
    tips: '迁移与归类',
    best: '规范与工作流',
    integration: '综合实战',
  },
  moduleSubtitles: {
    basic: 'PARA 架构、front-matter 与第一条知识',
    paradigm: '双链、标签与 inbox 处理流',
    advanced: 'search / tags 知识发现引擎',
    tips: '迁移归类、生命周期与去重合并',
    best: '命名规范、MOC 与每周维护',
    integration: '从零到一完整搭建演练',
  },
};

/** Git 实战课：本地仓库模拟器真实判题 */
export const GIT_TRACK: CourseDef = {
  id: 'git',
  name: 'Git 实战',
  tagline: '版本控制从入门到团队协作，本地模拟器真实判题',
  icon: '🌿',
  color: '#f05133',
  gradient: 'from-orange-600 to-rose-500',
  execLangs: ['git'],
  logo: 'git',
  moduleNames: {
    basic: '仓库与提交',
    paradigm: '分支与切换',
    advanced: '合并与历史',
    tips: '差异与暂存',
    best: '团队协作规范',
    integration: '综合实战',
  },
  moduleSubtitles: {
    basic: 'init / add / commit 核心工作流',
    paradigm: 'branch / switch 并行开发',
    advanced: 'merge / log / tag 历史管理',
    tips: 'diff / stash / .gitignore 日常技巧',
    best: '提交规范与远程协作',
    integration: '完整 feature 工作流演练',
  },
};

/** AI 协作开发课：以真实项目为主线，提交「给 AI 的文档」做要素判题 */
export const COLLAB_TRACK: CourseDef = {  id: 'collab',
  name: 'AI 协作开发',
  tagline: '与 AI 结对，从需求到落地的系统方法',
  icon: '🤝',
  color: '#f472b6',
  gradient: 'from-pink-500 to-rose-400',
  execLangs: ['prompt'],
  logo: 'collab',
  moduleNames: {
    basic: '协作心智',
    paradigm: '精确提问',
    advanced: '计划与拆解',
    tips: '迭代与反馈',
    best: '工具与流程',
    integration: '综合实战',
  },
  moduleSubtitles: {
    basic: '认清 AI 的能力边界与分诊方法',
    paradigm: '把模糊需求写成精确规格',
    advanced: '方案、里程碑与 Phase 规约',
    tips: '有效反馈、报错打包与渐进修复',
    best: '工具选型、工作流与审核点',
    integration: '从 0 到 1 的完整项目演练',
  },
};

/** 闯关地图顶部的课程卡片列表（语言课 + 算法课） */
export const COURSES: CourseDef[] = [
  ...LEARNABLE_LANGS.map((l) => ({
    id: l.id as CourseId,
    name: l.name,
    tagline: l.tagline,
    icon: l.id === 'go' ? '🐹' : l.id === 'rust' ? '🦀' : '🐉',
    color: l.color,
    gradient: l.gradient,
    execLangs: [l.id],
    logo: (l.id === 'go' || l.id === 'rust' || l.id === 'cpp') ? l.id : undefined,
  })),
  ALGO_TRACK,
  LINUX_TRACK,
  AGENTDEV_TRACK,
  COLLAB_TRACK,
  GIT_TRACK,
  KB_TRACK,
];

export const COURSE_MAP: Record<CourseId, CourseDef> = Object.fromEntries(
  COURSES.map((c) => [c.id, c]),
) as Record<CourseId, CourseDef>;

export function getCourse(id: string | undefined): CourseDef | undefined {
  return id ? COURSE_MAP[id as CourseId] : undefined;
}

/** 关卡执行配置（语言课直接取语言；算法课由作答语言决定） */
export function getModuleName(course: CourseDef, moduleId: string): string {
  return course.moduleNames?.[moduleId] ?? '';
}

export function getModuleSubtitle(course: CourseDef, moduleId: string, fallback: string): string {
  return course.moduleSubtitles?.[moduleId] ?? fallback;
}

export function executorOf(course: CourseId, execLang?: LanguageId): ExecutorConfig {
  if (course === 'linux') {
    return LANG_MAP['bash'].executor;
  }
  if (course === 'agentdev') {
    return LANG_MAP['javascript'].executor;
  }
  if (course === 'collab') {
    return LANG_MAP['prompt'].executor;
  }
  if (course === 'git') {
    return LANG_MAP['git'].executor;
  }
  if (course === 'kb') {
    return LANG_MAP['kb'].executor;
  }
  if (course === 'algo') {
    const lang = execLang ?? 'javascript';
    return LANG_MAP[lang].executor;
  }
  return LANG_MAP[course].executor;
}
