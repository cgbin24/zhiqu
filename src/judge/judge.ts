import type { ExecRequest, ExecResult, JudgeCaseResult, JudgeResult, LanguageId, TestCase, Verdict } from '@/types';
import { LANG_MAP } from '@/data/languages/registry';
import { godboltProvider } from './godbolt';
import { wandboxProvider } from './wandbox';
import { localJsProvider } from './local-js';
import { execShell } from './linux-sim';
import { execArkTS } from './arkts-sim';
import { runGitScript } from './git-sim';
import { runKbScript } from './kb-sim';
import { runCronScript } from './cron-sim';
import { checkPromptSubmission, promptCheckReport } from './prompt-judge';

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
  // 提示词规格（AI 协作课程）：本地要素体检报告
  if (req.lang === 'prompt') {
    const t0 = performance.now();
    return {
      executed: true,
      stdout: promptCheckReport(req.source, req.runtime),
      stderr: '',
      exitCode: 0,
      timeMs: Math.max(1, Math.round(performance.now() - t0)),
      provider: 'godbolt',
    };
  }
  // Git 实战课：本地模拟器（runtime 携带初始仓库状态 JSON）
  if (req.lang === 'git') {
    const t0 = performance.now();
    const out = runGitScript(req.source, req.runtime);
    return {
      executed: true,
      stdout: out,
      stderr: '',
      exitCode: 0,
      timeMs: Math.max(1, Math.round(performance.now() - t0)),
      provider: 'godbolt',
    };
  }
  // 知识库工程课：本地 PARA 模拟器（runtime 携带初始状态 JSON）
  if (req.lang === 'kb') {
    const t0 = performance.now();
    const out = runKbScript(req.source, req.runtime);
    return {
      executed: true,
      stdout: out,
      stderr: '',
      exitCode: 0,
      timeMs: Math.max(1, Math.round(performance.now() - t0)),
      provider: 'godbolt',
    };
  }
  // 定时任务实战课：本地服务器监控模拟器（runtime 携带服务器状态 JSON）
  if (req.lang === 'cron') {
    const t0 = performance.now();
    const out = runCronScript(req.source, req.runtime);
    return {
      executed: true,
      stdout: out,
      stderr: '',
      exitCode: 0,
      timeMs: Math.max(1, Math.round(performance.now() - t0)),
      provider: 'godbolt',
    };
  }
  // Bash 走本地 Linux 模拟器（Linux 课程判题）
  if (req.lang === 'bash') {
    const t0 = performance.now();
    const r = execShell(req.source, req.fs ?? req.runtime ?? '{"cwd":"/home/student"}');
    return {
      executed: true,
      stdout: r.stdout,
      stderr: r.stderr,
      exitCode: r.exitCode,
      timeMs: Math.max(1, Math.round(performance.now() - t0)),
      provider: 'godbolt',
    };
  }
  // ArkTS 走本地鸿蒙模拟器（鸿蒙课程判题：渲染树 + 日志比对）
  if (req.lang === 'arkts') {
    const t0 = performance.now();
    const r = execArkTS(req.source, req.runtime ?? '{}', req.stdin ?? '[]');
    const out = r.ok
      ? [r.logs.join('\n'), r.dump].filter(Boolean).join('\n')
      : [r.logs.join('\n'), r.error ?? '执行出错'].filter(Boolean).join('\n');
    return {
      executed: true,
      stdout: out,
      stderr: r.ok ? '' : (r.error ?? '执行出错'),
      exitCode: r.ok ? 0 : 1,
      timeMs: Math.max(1, Math.round(performance.now() - t0)),
      provider: 'arkts-sim',
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
    // 提示词关卡：每个测试点是一条要素检查规则（stdin 存放规则 JSON）
    if (lang === 'prompt') {
      const r = checkPromptSubmission(source, test.stdin);
      const verdict: Verdict = r.pass ? 'accepted' : 'wrong-answer';
      if (r.pass) passed++;
      const cr: JudgeCaseResult = {
        name: test.name,
        hidden: Boolean(test.hidden),
        verdict,
        actual: test.hidden ? '' : r.actual,
        expected: test.hidden ? '' : test.expected,
        timeMs: 1,
      };
      results.push(cr);
      onProgress?.(cr, i + 1, tests.length);
      continue;
    }
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
