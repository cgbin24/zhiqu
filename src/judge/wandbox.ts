import { LANG_MAP } from '@/data/languages/registry';
import type { ExecRequest, ExecResult } from '@/types';
import { fetchWithRetry, stripAnsi, type ExecutionProvider } from './provider';

/**
 * Wandbox 执行 Provider —— 备用引擎（Godbolt 不可用时自动切换）。
 */
export const wandboxProvider: ExecutionProvider = {
  name: 'wandbox',
  available: true,

  async execute(req: ExecRequest): Promise<ExecResult> {
    const lang = LANG_MAP[req.lang];
    const wid = lang.executor.wandboxId;
    if (!wid) throw new Error(`Wandbox 不支持 ${lang.name}`);

    const body: Record<string, unknown> = {
      code: req.source,
      compilers: [wid],
      options: '',
      stdin: req.stdin,
      save: false,
    };
    if (lang.executor.godboltArgs) {
      // "-std=c++20" -> raw options array
      body['compiler-option-raw'] = lang.executor.godboltArgs.split(/\s+/);
    }

    const res = await fetchWithRetry('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Wandbox HTTP ${res.status}`);
    const r = (await res.json()) as {
      status: string;
      compiler_output?: string;
      compiler_error?: string;
      program_output?: string;
      program_error?: string;
      signal?: string | null;
    };

    const compilerErr = stripAnsi(r.compiler_error ?? '');
    const ran = r.program_output != null || r.program_error != null;

    if (!ran) {
      return {
        executed: false,
        compileError: compilerErr || stripAnsi(r.compiler_output ?? '') || '编译失败',
        stdout: '',
        stderr: '',
        exitCode: Number(r.status ?? 1) || 1,
        provider: 'wandbox',
      };
    }

    return {
      executed: true,
      stdout: r.program_output ?? '',
      stderr: stripAnsi(r.program_error ?? ''),
      exitCode: (Number(r.status) || 0) === 0 ? 0 : 1,
      provider: 'wandbox',
    };
  },
};
