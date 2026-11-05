import { MODULES } from '@/data/modules';
import type { CourseId, Level, ModuleId, TestCase } from '@/types';
import { GO_BASIC } from './go/basic';
import { GO_PARADIGM } from './go/paradigm';
import { GO_ADVANCED } from './go/advanced';
import { GO_TIPS } from './go/tips';
import { GO_BEST } from './go/best';
import { GO_INTEGRATION } from './go/integration';
import { RUST_BASIC } from './rust/basic';
import { RUST_PARADIGM } from './rust/paradigm';
import { RUST_ADVANCED } from './rust/advanced';
import { RUST_TIPS } from './rust/tips';
import { RUST_BEST } from './rust/best';
import { RUST_INTEGRATION } from './rust/integration';
import { CPP_BASIC } from './cpp/basic';
import { CPP_PARADIGM } from './cpp/paradigm';
import { CPP_ADVANCED } from './cpp/advanced';
import { CPP_TIPS } from './cpp/tips';
import { CPP_BEST } from './cpp/best';
import { CPP_INTEGRATION } from './cpp/integration';
import { ALGO_BASIC } from '../algo/basic';
import { ALGO_PARADIGM } from '../algo/paradigm';
import { ALGO_ADVANCED } from '../algo/advanced';
import { ALGO_TIPS } from '../algo/tips';
import { ALGO_BEST } from '../algo/best';
import { ALGO_INTEGRATION } from '../algo/integration';
import { LINUX_BASIC } from '../linux/basic';
import { LINUX_TEXT } from '../linux/text';
import { LINUX_PERM } from '../linux/perm';
import { LINUX_SCRIPT } from '../linux/script';
import { LINUX_BEST } from '../linux/best';
import { LINUX_INTEGRATION } from '../linux/integration';
import { AGENTDEV_BASIC } from '../agentdev/basic';
import { AGENTDEV_PARADIGM } from '../agentdev/paradigm';
import { AGENTDEV_ADVANCED } from '../agentdev/advanced';
import { AGENTDEV_TIPS } from '../agentdev/tips';
import { AGENTDEV_BEST } from '../agentdev/best';
import { AGENTDEV_INTEGRATION } from '../agentdev/integration';
import { COLLAB_BASIC } from '../collab/basic';
import { COLLAB_PARADIGM } from '../collab/paradigm';
import { COLLAB_ADVANCED } from '../collab/advanced';
import { COLLAB_TIPS } from '../collab/tips';
import { COLLAB_BEST } from '../collab/best';
import { COLLAB_INTEGRATION } from '../collab/integration';

/** 章节文件注册表：新增语言/章节在这里追加一行即可 */
const CHAPTER_FILES: Level[][] = [
  GO_BASIC, GO_PARADIGM, GO_ADVANCED, GO_TIPS, GO_BEST, GO_INTEGRATION,
  RUST_BASIC, RUST_PARADIGM, RUST_ADVANCED, RUST_TIPS, RUST_BEST, RUST_INTEGRATION,
  CPP_BASIC, CPP_PARADIGM, CPP_ADVANCED, CPP_TIPS, CPP_BEST, CPP_INTEGRATION,
  ALGO_BASIC, ALGO_PARADIGM, ALGO_ADVANCED, ALGO_TIPS, ALGO_BEST, ALGO_INTEGRATION,
  LINUX_BASIC, LINUX_TEXT, LINUX_PERM, LINUX_SCRIPT, LINUX_BEST, LINUX_INTEGRATION,
  AGENTDEV_BASIC, AGENTDEV_PARADIGM, AGENTDEV_ADVANCED, AGENTDEV_TIPS, AGENTDEV_BEST, AGENTDEV_INTEGRATION,
  COLLAB_BASIC, COLLAB_PARADIGM, COLLAB_ADVANCED, COLLAB_TIPS, COLLAB_BEST, COLLAB_INTEGRATION,
];

/** 全部关卡（扁平，含课程内全局顺序） */
export const LEVELS: Level[] = CHAPTER_FILES.flat();

const BY_ID = new Map<string, Level>(LEVELS.map((l) => [l.id, l]));

/** 课程内顺序：同一课程按模块顺序 + 章节内顺序 */
const COURSE_ORDER: Record<CourseId, Level[]> = {
  go: [],
  rust: [],
  cpp: [],
  javascript: [],
  algo: [],
  linux: [],
  agentdev: [],
  collab: [],
};
for (const course of ['go', 'rust', 'cpp', 'javascript', 'algo', 'linux', 'agentdev', 'collab'] as CourseId[]) {
  for (const m of MODULES) {
    for (const l of LEVELS) {
      if (l.lang === course && l.module === m.id) COURSE_ORDER[course].push(l);
    }
  }
}

export function getLevel(id: string | undefined): Level | undefined {
  return id ? BY_ID.get(id) : undefined;
}

export function levelsOfCourse(course: CourseId): Level[] {
  return COURSE_ORDER[course];
}

/** 兼容旧调用名 */
export const levelsOfLang = levelsOfCourse;

export function levelsOfChapter(course: CourseId, module: ModuleId): Level[] {
  return LEVELS.filter((l) => l.lang === course && l.module === module);
}

export function totalLevels(): number {
  return LEVELS.length;
}

/** 关卡是否解锁：课程内前一关已通关（首关永远解锁） */
export function isLevelUnlocked(level: Level, completedIds: Set<string>): boolean {
  const list = COURSE_ORDER[level.lang];
  const idx = list.findIndex((l) => l.id === level.id);
  if (idx <= 0) return true;
  return completedIds.has(list[idx - 1].id);
}

/** 下一关（课程内顺序） */
export function nextLevel(level: Level): Level | undefined {
  const list = COURSE_ORDER[level.lang];
  const idx = list.findIndex((l) => l.id === level.id);
  return idx >= 0 && idx + 1 < list.length ? list[idx + 1] : undefined;
}

/* ---------------- 每日挑战 ---------------- */

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 按日期确定性选取每日挑战关（总在 2~3 星难度池里挑，且必可玩） */
export function dailyLevel(dateStr = todayStr()): Level {
  let h = 2166136261;
  for (let i = 0; i < dateStr.length; i++) {
    h ^= dateStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const pool = LEVELS.filter((l) => l.difficulty <= 3);
  return pool[Math.abs(h) % pool.length];
}

export function todayKey(): string {
  return todayStr();
}

/** 测试用例数量与隐藏数统计（关卡地图展示） */
export function testCaseSummary(tests: TestCase[]): string {
  const hidden = tests.filter((t) => t.hidden).length;
  return hidden > 0 ? `${tests.length - hidden} + ${hidden} 隐藏` : `${tests.length}`;
}
