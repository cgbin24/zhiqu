/** 期望输出 vs 实际输出 对照展示 */
export function DiffView({ expected, actual }: { expected: string; actual: string }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <OutputBox title="期望输出" text={expected} tone="ok" />
      <OutputBox title="实际输出" text={actual} tone="bad" />
    </div>
  );
}

function OutputBox({ title, text, tone }: { title: string; text: string; tone: 'ok' | 'bad' }) {
  return (
    <div
      className={`rounded-lg border p-2 ${
        tone === 'ok' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'
      }`}
    >
      <div className={`mb-1 text-[10px] font-semibold uppercase tracking-wide ${tone === 'ok' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {title}
      </div>
      <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-slate-300">
        {text === '' ? <span className="italic text-slate-600">（空）</span> : text}
      </pre>
    </div>
  );
}
