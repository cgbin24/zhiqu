import { useState } from 'react';
import { Loader2, Play, Trash2 } from 'lucide-react';
import { CodeEditor } from '@/components/CodeEditor';
import { LANGUAGES, LANG_MAP } from '@/data/languages/registry';
import { executeCode } from '@/judge/judge';
import { useProgress } from '@/store/progress';
import type { ExecResult } from '@/types';

/** 自由练习场：任意语言、任意代码、自定义 stdin */
export function Playground() {
  const [langId, setLangId] = useState(LANGUAGES[0].id);
  const lang = LANG_MAP[langId];
  const playground = useProgress((s) => s.playground);
  const savePlayground = useProgress((s) => s.savePlayground);
  const recordRun = useProgress((s) => s.recordRun);

  const [code, setCode] = useState(playground[langId] ?? lang.template);
  const [stdin, setStdin] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExecResult | null>(null);

  const switchLang = (id: typeof langId) => {
    setLangId(id);
    setCode(playground[id] ?? LANG_MAP[id].template);
    setResult(null);
  };

  const run = async () => {
    if (running) return;
    setRunning(true);
    setResult(null);
    recordRun(true);
    try {
      const res = await executeCode({ lang: langId, source: code, stdin });
      setResult(res);
    } catch (err) {
      setResult({
        executed: false,
        compileError: err instanceof Error ? err.message : String(err),
        stdout: '', stderr: '', exitCode: null, provider: 'godbolt',
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="mr-2 text-lg font-bold text-slate-100">自由练习场</h1>
        {LANGUAGES.map((l) => (
          <button
            key={l.id}
            onClick={() => switchLang(l.id)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition-all ${
              l.id === langId ? 'text-white' : 'border-night-700 text-slate-400 hover:text-slate-200'
            }`}
            style={l.id === langId ? { borderColor: l.color, background: `${l.color}22`, color: l.color } : undefined}
          >
            {l.name}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => { setCode(lang.template); setResult(null); }}
          className="flex items-center gap-1 rounded-lg border border-night-700 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200"
        >
          <Trash2 size={12} /> 重置模板
        </button>
        <button
          onClick={run}
          disabled={running}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:brightness-110 disabled:opacity-50"
        >
          {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} 运行
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="h-[52vh] min-h-[340px]">
            <CodeEditor
              value={code}
              language={lang.monaco}
              onChange={(v) => { setCode(v); savePlayground(langId, v); }}
            />
          </div>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            rows={3}
            spellCheck={false}
            placeholder="标准输入 stdin（可选）…"
            className="mt-3 w-full resize-y rounded-xl border border-night-700 bg-night-900 px-3 py-2 font-mono text-xs text-slate-300 outline-none focus:border-quest-500/50"
          />
        </div>

        <div className="rounded-xl border border-night-700 bg-night-900 p-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">输出</div>
          {running && (
            <div className="flex items-center gap-2 py-6 text-sm text-slate-400">
              <Loader2 size={15} className="animate-spin text-sky-400" /> 正在云端编译运行…
            </div>
          )}
          {!running && !result && <div className="py-6 text-xs text-slate-600">写点代码，然后点「运行」！支持 {lang.name} 全部标准库。</div>}
          {!running && result && (
            <div className="space-y-3">
              {!result.executed && (
                <pre className="max-h-[46vh] overflow-auto whitespace-pre-wrap rounded-lg bg-night-950 p-3 font-mono text-xs leading-relaxed text-orange-300">
                  {result.compileError}
                </pre>
              )}
              {result.executed && (
                <>
                  <pre className="max-h-[36vh] overflow-auto whitespace-pre-wrap rounded-lg bg-night-950 p-3 font-mono text-xs leading-relaxed text-emerald-200">
                    {result.stdout || '（无标准输出）'}
                  </pre>
                  {result.stderr && (
                    <div>
                      <div className="mb-1 text-[10px] font-bold uppercase text-amber-400/70">stderr</div>
                      <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-night-950 p-3 font-mono text-[11px] leading-relaxed text-amber-300/80">{result.stderr}</pre>
                    </div>
                  )}
                  <div className="text-[10px] text-slate-600">
                    退出码 {result.exitCode ?? '—'} · via {result.provider}{result.timeMs != null ? ` · ${result.timeMs}ms` : ''}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
