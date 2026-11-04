import type { ExecRequest, ExecResult, JudgeCaseResult, JudgeResult, LanguageId, TestCase, Verdict } from '@/types';
import { LANG_MAP } from '@/data/languages/registry';
import { godboltProvider } from './godbolt';
import { wandboxProvider } from './wandbox';
import { localJsProvider } from './local-js';
import { execShell } from './linux-sim';

/* ---------------- 节流队列：公共 API 礼貌限速 ---------------- */

let chain: Promise<unknown> = Promise.resolve();
const MIN_GAP_MS = 1_100;
let lastRunAt = 0;

function schedule<T>(fn: () => Promise<T>): Promise<T> {
  const run = async () => {
    const wait = Math.max(0, lastRunAt + MIN_GAP_MS - Date.now());
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastRunAt = Date.now();
    return fn();
  };
  const next = chain.then(run, run);
  chain = next.catch(() => undefined);
  return next as Promise<T>;
}

/* ---------------- Provider 链：godbolt -> wandbox ---------------- */

async function executeWithFallback(req: ExecRequest): Promise<ExecResult> {
  // Bash 走本地 Linux 模拟器（Linux 课程判题）
  if (req.lang === 'bash') {
    const t0 = performance.now();
    const r = execShell(req.source, req.fs ?? '{"cwd":"/home/student"}');
    return {
      executed: true,
      stdout: r.stdout,
      stderr: r.stderr,
      exitCode: r.exitCode,
      timeMs: Math.max(1, Math.round(performance.now() - t0)),
      provider: 'godbolt',
    };
  }
  // JS 走浏览器本地执行：零延迟、无配额
  if (LANG_MAP[req.lang]?.executor.provider === 'local') {
    return localJsProvider.execute(req);
  }
  try {
    return await schedule(() => godboltProvider.execute(req));
  } catch (err) {
    if (wandboxProvider.available) {
      return schedule(() => wandboxProvider.execute(req));
    }
    throw err;
  }
}

/** 单次执行（「运行」按钮 / Playground 用） */
export function executeCode(req: ExecRequest): Promise<ExecResult> {
  return executeWithFallback(req);
}

/* ---------------- 输出规整与比对 ---------------- */

/**
 * 规整输出用于比对：去掉 \r、每行去除行尾空白、去掉末尾空行。
 * 首尾中间的空行保留 —— 避免把格式题判错。
 */
export function normalizeOutput(s: string): string {
  const lines = s.replace(/\r\n?/g, '\n').split('\n').map((l) => l.replace(/[ \t]+$/g, ''));
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}

export function compareOutput(actual: string, expected: string): boolean {
  return normalizeOutput(actual) === normalizeOutput(expected);
}

/* ---------------- 判题 ---------------- */

function toVerdict(res: ExecResult, test: TestCase): Verdict {
  if (!res.executed) return 'compile-error';
  if (res.exitCode === -1) return 'timeout';
  if (res.exitCode !== 0 && res.exitCode !== null) return 'runtime-error';
  return compareOutput(res.stdout, test.expected) ? 'accepted' : 'wrong-answer';
}

/**
 * 对一道关卡的用例逐个判题（串行，受节流队列约束）。
 * 编译失败时短路：其余用例直接标记编译错误，不再请求。
 * onProgress 用于逐步刷新 UI。
 */
export async function judgeLevel(
  lang: LanguageId,
  source: string,
  tests: TestCase[],
  onProgress?: (result: JudgeCaseResult, done: number, total: number) => void,
  fs?: string,
  runtime?: string,
): Promise<JudgeResult> {
  const results: JudgeCaseResult[] = [];
  let compileError: string | undefined;
  let passed = 0;

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    if (compileError) {
      const r: JudgeCaseResult = {
        name: test.name,
        hidden: Boolean(test.hidden),
        verdict: 'compile-error',
        actual: '',
        expected: test.hidden ? '' : test.expected,
      };
      results.push(r);
      onProgress?.(r, i + 1, tests.length);
      continue;
    }
    try {
      const res = await executeWithFallback({ lang, source, stdin: test.stdin, args: test.args, fs, runtime });
      const verdict = toVerdict(res, test);
      if (verdict === 'accepted') passed++;
      if (verdict === 'compile-error') compileError = res.compileError;
      const r: JudgeCaseResult = {
        name: test.name,
        hidden: Boolean(test.hidden),
        verdict,
        actual: test.hidden ? '' : res.stdout,
        expected: test.hidden ? '' : test.expected,
        timeMs: res.timeMs,
        compileError: res.compileError,
        stderr: res.stderr ? res.stderr.slice(0, 800) : undefined,
      };
      results.push(r);
      onProgress?.(r, i + 1, tests.length);
    } catch (err) {
      const r: JudgeCaseResult = {
        name: test.name,
        hidden: Boolean(test.hidden),
        verdict: 'internal-error',
        actual: '',
        expected: test.hidden ? '' : test.expected,
        compileError: err instanceof Error ? err.message : String(err),
      };
      results.push(r);
      onProgress?.(r, i + 1, tests.length);
    }
  }

  const firstFail = results.find((r) => r.verdict !== 'accepted');
  return {
    verdict: passed === tests.length ? 'accepted' : (firstFail?.verdict ?? 'internal-error'),
    passed,
    total: tests.length,
    cases: results,
    compileError,
  };
}
