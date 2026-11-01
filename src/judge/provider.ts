import type { ExecRequest, ExecResult } from '@/types';

/** 代码执行 Provider 抽象 —— 新增执行后端实现此接口即可 */
export interface ExecutionProvider {
  readonly name: 'godbolt' | 'wandbox';
  readonly available: boolean;
  execute(req: ExecRequest): Promise<ExecResult>;
}

/** 去除 ANSI 转义序列 */
export function stripAnsi(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '').replace(/\x1b\][^\x07]*\x07/g, '');
}

/** 带超时与重试的 fetch（429/5xx 退避） */
export async function fetchWithRetry(
  url: string,
  init: RequestInit,
  opts: { timeoutMs?: number; retries?: number; backoffMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = 120_000, retries = 2, backoffMs = 2_500 } = opts;
  let lastErr: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: ctrl.signal });
      if (res.status === 429 || res.status >= 500) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('执行超时，请稍后重试');
      }
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, backoffMs * 2 ** attempt));
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
