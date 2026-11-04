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
  logo?: 'go' | 'rust' | 'cpp' | 'linux' | 'algo' | 'agentdev';
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
  if (course === 'algo') {
    const lang = execLang ?? 'javascript';
    return LANG_MAP[lang].executor;
  }
  return LANG_MAP[course].executor;
}
