import teamSimSrc from './team-sim.js?raw';

/**
 * 把 team-sim.ts 源码转成沙箱可执行形态：
 * new Function 体内不允许 export 语句，剥掉导出关键字（引擎仅此一处导出）。
 * verify-levels.mjs（node 端）用同样的替换处理 fs 读出的源码，两处必须一致。
 */
export function teamSandboxSource(): string {
  return teamSimSrc.replace('export function createTeamEngine', 'function createTeamEngine');
}

/**
 * 「Agent 团队」关卡沙箱前置注入块。
 *
 * team-sim.ts 是纯 JavaScript + JSDoc（无 TS 专有语法），因此可以把源码原样
 * 内联进学员沙箱 —— 与大屏 import 的是同一份实现（单一数据源）。
 * 注入后学员代码里可用：
 *   team.run({ roles, guardrails?, policy? }) → RunResult
 */
export function teamPreamble(projectJson: string): string {
  return (
    teamSandboxSource() +
    '\nconst __TEAM_CONFIG__ = ' + projectJson + ';\n' +
    'const team = createTeamEngine(__TEAM_CONFIG__);\n'
  );
}

/** 关卡 runtime 是否为「团队」型配置（LevelPlay 据此选择注入方式） */
export function isTeamRuntime(runtime: string | undefined): boolean {
  return !!runtime && runtime.includes('"kind":"team"');
}
