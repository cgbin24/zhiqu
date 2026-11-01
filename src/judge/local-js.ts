import type { ExecRequest, ExecResult } from '@/types';
import type { ExecutionProvider } from './provider';

/**
 * JavaScript 本地执行 Provider —— 在浏览器/Node 内直接运行，零延迟、无配额。
 *
 * 注入约定（与算法课 JS 模板一致）：
 *   - readline(): 读取一行 stdin
 *   - readInts(): 读取一行并以空格拆分为数字数组
 *   - console.log/warn/error → stdout / stderr
 *   - process.exit(code) 可控制退出码
 */
const PREAMBLE = (stdin: string) => `
const __stdinLines = ${JSON.stringify(stdin)}.replace(/\\r\\n?/g, '\\n').split('\\n');
let __stdinPtr = 0;
function readline() { return __stdinLines[__stdinPtr++] ?? ''; }
function readInts() { return readline().trim().split(/\\s+/).filter(s => s !== '').map(Number); }
`;

function run(source: string, stdin: string, t0: number): { stdout: string; stderr: string; exitCode: number | null } {
  const logs: string[] = [];
  const errors: string[] = [];
  let exitCode: number | null = 0;

  const sandbox = `${PREAMBLE(stdin)}\n${source}`;
  try {
    const fn = new Function(
      'console',
      'process',
      `"use strict";\n${sandbox}`,
    );
    fn(
      {
        log: (...a: unknown[]) => logs.push(a.map((x) => (typeof x === 'string' ? x : String(x))).join(' ')),
        warn: (...a: unknown[]) => errors.push(a.map((x) => String(x)).join(' ')),
        error: (...a: unknown[]) => errors.push(a.map((x) => String(x)).join(' ')),
      },
      { exit: (code = 0) => { throw { __exitCode: code }; } },
    );
  } catch (err) {
    const e = err as { __exitCode?: number; stack?: string; message?: string };
    if (e && typeof e.__exitCode === 'number') {
      exitCode = e.__exitCode;
    } else {
      exitCode = 1;
      errors.push(String(e?.stack || e?.message || err).split('\n').slice(0, 4).join('\n'));
    }
  }

  return {
    stdout: logs.join('\n'),
    stderr: errors.join('\n'),
    exitCode,
    ...(Math.round(performance.now() - t0) > 0 ? {} : {}),
  };
}

function timeMs(t0: number): number {
  return Math.max(1, Math.round(performance.now() - t0));
}

export const localJsProvider: ExecutionProvider = {
  name: 'godbolt', // 接口约束占位；ExecResult.provider 由 judge 层标注
  available: true,

  async execute(req: ExecRequest): Promise<ExecResult> {
    const t0 = performance.now();
    const r = run(req.source, req.stdin, t0);
    return {
      executed: true,
      stdout: r.stdout,
      stderr: r.stderr,
      exitCode: r.exitCode,
      timeMs: timeMs(t0),
      provider: 'godbolt',
    };
  },
};

/** 供 Node 校验脚本复用的同构执行逻辑（performance 不存在时用 Date） */
export function executeJsLocally(source: string, stdin: string): { stdout: string; stderr: string; exitCode: number | null } {
  const logs: string[] = [];
  const errors: string[] = [];
  let exitCode: number | null = 0;
  const sandbox = `${PREAMBLE(stdin)}\n${source}`;
  try {
    const fn = new Function('console', 'process', `"use strict";\n${sandbox}`);
    fn(
      {
        log: (...a: unknown[]) => logs.push(a.map((x) => (typeof x === 'string' ? x : String(x))).join(' ')),
        warn: (...a: unknown[]) => errors.push(a.map((x) => String(x)).join(' ')),
        error: (...a: unknown[]) => errors.push(a.map((x) => String(x)).join(' ')),
      },
      { exit: (code = 0) => { throw { __exitCode: code }; } },
    );
  } catch (err) {
    const e = err as { __exitCode?: number; stack?: string };
    if (e && typeof e.__exitCode === 'number') exitCode = e.__exitCode;
    else {
      exitCode = 1;
      errors.push(String(e?.stack || err).split('\n').slice(0, 4).join('\n'));
    }
  }
  return { stdout: logs.join('\n'), stderr: errors.join('\n'), exitCode };
}
