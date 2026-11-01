import type { ModuleDef, ModuleId } from '@/types';

/** 六大学习模块：所有语言共用同一学习路径骨架 */
export const MODULES: ModuleDef[] = [
  {
    id: 'basic',
    name: '基础语法结构',
    subtitle: '变量、类型、控制流，筑牢地基',
    icon: 'Code2',
    gradient: 'from-sky-500 to-cyan-400',
  },
  {
    id: 'paradigm',
    name: '核心编程思想',
    subtitle: 'OOP · 函数式 · 泛型 · 并发范式',
    icon: 'Brain',
    gradient: 'from-violet-500 to-fuchsia-400',
  },
  {
    id: 'advanced',
    name: '进阶技术',
    subtitle: '语言深层特性与底层机制',
    icon: 'Swords',
    gradient: 'from-amber-500 to-orange-400',
  },
  {
    id: 'tips',
    name: '开发实用技巧',
    subtitle: '效率工具、避坑指南与惯用法',
    icon: 'Lightbulb',
    gradient: 'from-lime-500 to-emerald-400',
  },
  {
    id: 'best',
    name: '行业最佳实践',
    subtitle: '代码规范 · 错误处理 · 工程化',
    icon: 'ShieldCheck',
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'integration',
    name: '跨领域融会贯通',
    subtitle: '综合实战：把一切串起来',
    icon: 'Rocket',
    gradient: 'from-rose-500 to-pink-400',
  },
];

export const MODULE_MAP: Record<ModuleId, ModuleDef> = Object.fromEntries(
  MODULES.map((m) => [m.id, m]),
) as Record<ModuleId, ModuleDef>;
