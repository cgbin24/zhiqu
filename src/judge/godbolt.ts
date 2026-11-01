import { LANG_MAP } from '@/data/languages/registry';
import type { ExecRequest, ExecResult } from '@/types';
import { fetchWithRetry, stripAnsi, type ExecutionProvider } from './provider';

const API = 'https://godbolt.org/api/compiler';

/**
 * Compiler Explorer（godbolt.org）执行 Provider —— 主引擎。
 * 已实测开放 CORS，且编译器保持最新（Go 1.26 / Rust 1.99 / GCC 16.2）。
 */
export const godboltProvider: ExecutionProvider = {
  name: 'godbolt',
  available: true,

  async execute(req: ExecRequest): Promise<ExecResult> {
    const lang = LANG_MAP[req.lang];
    const lines = (arr?: { text: string }[]) =>
      (arr ?? []).map((l) => l.text ?? '').join('\n');

    const body = {
      source: req.source,
      options: {
        userArguments: lang.executor.godboltArgs ?? '',
        executeParameters: { args: req.args ?? [], stdin: req.stdin },
        compilerOptions: { executorRequest: true },
        filters: { execute: true },
        tools: [] as string[],
        libraries: [] as unknown[],
      },
      lang: lang.monaco === 'cpp' ? 'c++' : lang.id,
      allowStoreCodeDebug: false,
    };

    const res = await fetchWithRetry(`${API}/${lang.executor.godboltId}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Godbolt HTTP ${res.status}`);
    const r = await res.json();

    const timedOut = Boolean(r.timedOut);
    const didExecute = r.didExecute === true;

    if (!didExecute && !timedOut) {
      const buildStderr = r.buildResult ? lines(r.buildResult.stderr) : '';
      const topStderr = stripAnsi(lines(r.stderr));
      const compileError = stripAnsi(buildStderr || topStderr || '编译失败（未知原因）');
      return {
        executed: false,
        compileError,
        stdout: '',
        stderr: '',
        exitCode: r.code ?? 1,
        provider: 'godbolt',
      };
    }

    // execTime 含排队/编译时间，超过 30s 视为统计噪声，不展示
    const execTime = typeof r.execTime === 'number' && r.execTime <= 30 ? Math.round(r.execTime * 1000) : undefined;
    return {
      executed: true,
      stdout: stripAnsi(lines(r.stdout)),
      stderr: stripAnsi(lines(r.stderr)),
      exitCode: typeof r.code === 'number' ? r.code : null,
      timeMs: execTime,
      provider: 'godbolt',
      ...(timedOut ? { exitCode: -1 } : {}),
    };
  },
};
