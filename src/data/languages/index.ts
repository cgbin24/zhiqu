import { MODULES } from '@/data/modules';
import type { LanguageId, Level, ModuleId, TestCase } from '@/types';
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

/** 章节文件注册表：新增语言/章节在这里追加一行即可 */
const CHAPTER_FILES: Level[][] = [
  GO_BASIC, GO_PARADIGM, GO_ADVANCED, GO_TIPS, GO_BEST, GO_INTEGRATION,
  RUST_BASIC, RUST_PARADIGM, RUST_ADVANCED, RUST_TIPS, RUST_BEST, RUST_INTEGRATION,
  CPP_BASIC, CPP_PARADIGM, CPP_ADVANCED, CPP_TIPS, CPP_BEST, CPP_INTEGRATION,
];

/** 全部关卡（扁平，含语言内全局顺序） */
export const LEVELS: Level[] = CHAPTER_FILES.flat();

const BY_ID = new Map<string, Level>(LEVELS.map((l) => [l.id, l]));

/** 语言内顺序：同语言按模块顺序 + 章节内顺序 */
const LANG_ORDER: Record<LanguageId, Level[]> = {
  go: [],
  rust: [],
  cpp: [],
};
for (const lang of ['go', 'rust', 'cpp'] as LanguageId[]) {
  for (const m of MODULES) {
    for (const l of LEVELS) {
      if (l.lang === lang && l.module === m.id) LANG_ORDER[lang].push(l);
    }
  }
}

export function getLevel(id: string | undefined): Level | undefined {
  return id ? BY_ID.get(id) : undefined;
}

export function levelsOfLang(lang: LanguageId): Level[] {
  return LANG_ORDER[lang];
}

export function levelsOfChapter(lang: LanguageId, module: ModuleId): Level[] {
  return LEVELS.filter((l) => l.lang === lang && l.module === module);
}

export function totalLevels(): number {
  return LEVELS.length;
}

/** 关卡是否解锁：语言内前一关已通关（第一章首关永远解锁） */
export function isLevelUnlocked(level: Level, completedIds: Set<string>): boolean {
  const list = LANG_ORDER[level.lang];
  const idx = list.findIndex((l) => l.id === level.id);
  if (idx <= 0) return true;
  return completedIds.has(list[idx - 1].id);
}

/** 下一关（语言内顺序） */
export function nextLevel(level: Level): Level | undefined {
  const list = LANG_ORDER[level.lang];
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
