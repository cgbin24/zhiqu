import { useEffect, useRef, useState } from 'react';
import { CornerDownLeft, Eraser } from 'lucide-react';
import { execShell, type ShellTranscriptEntry } from '@/judge/linux-sim';

/**
 * 交互式 Linux 终端演练 —— 基于/linux-sim 的逐命令 REPL。
 * 状态延续原理：每次执行都把「本次会话全部命令」重放给 execShell（模拟器逐行
 * 顺序执行、fs 状态在单次调用内延续），因此 cd / touch / 重定向等效果都会保留。
 * 仅是演练面板，不影响关卡判题（提交仍以编辑器内容整段评测）。
 */

interface TerminalSimProps {
  /** 场景 fs JSON（与关卡 runtime / initFs 同构：{cwd, tree, system?}） */
  fsJson: string;
  /** 顶部说明文字（如「自由演练，不影响提交」或场景介绍） */
  welcome?: string;
  /** 提供时显示「填入编辑器」按钮，把本次会话敲过的命令导出 */
  onExport?: (script: string) => void;
  /** 外层容器类名（控制高度） */
  className?: string;
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="select-none">
      <span className="text-emerald-400">student@zhiqu</span>
      <span className="text-slate-500">:</span>
      <span className="text-sky-400">{cwd}</span>
      <span className="text-slate-500">$ </span>
    </span>
  );
}

export function TerminalSim({ fsJson, welcome, onExport, className }: TerminalSimProps) {
  const [replay, setReplay] = useState<string[]>([]);
  const [entries, setEntries] = useState<ShellTranscriptEntry[]>([]);
  const [clearIdx, setClearIdx] = useState(0);
  const [input, setInput] = useState('');
  const [cmdHist, setCmdHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialCwd = (() => {
    try {
      return (JSON.parse(fsJson) as { cwd?: string }).cwd ?? '/home/student';
    } catch {
      return '/home/student';
    }
  })();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries, input]);

  const focusInput = () => inputRef.current?.focus();

  const submit = () => {
    const cmd = input.trim();
    setInput('');
    if (!cmd) return;
    setCmdHist((h) => [...h, cmd]);
    setHistIdx(-1);
    if (cmd === 'clear') {
      // 清屏：显示重置，但已执行命令保留在重放历史里（cd 等状态不丢）
      setClearIdx(entries.length);
      return;
    }
    const next = [...replay, cmd];
    const r = execShell(next.join('\n'), fsJson);
    setReplay(next);
    setEntries(r.transcript);
    setClearIdx(0);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHist.length === 0) return;
      const idx = histIdx < 0 ? cmdHist.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(cmdHist[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < 0) return;
      const idx = histIdx + 1;
      if (idx >= cmdHist.length) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(idx);
        setInput(cmdHist[idx]);
      }
    }
  };

  const visible = entries.slice(clearIdx);
  const nextCwd = entries.length > 0 ? entries[entries.length - 1].cwdAfter : initialCwd;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-night-700 bg-night-950 ${className ?? ''}`}
      onClick={focusInput}
    >
      {/* 顶栏 */}
      <div className="flex flex-wrap items-center gap-2 border-b border-night-700 bg-night-900 px-3 py-1.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </span>
        <span className="text-[11px] font-semibold text-slate-400">终端演练</span>
        {welcome && <span className="hidden text-[10px] text-slate-600 sm:inline">{welcome}</span>}
        <div className="flex-1" />
        <button
          onClick={(e) => { e.stopPropagation(); setClearIdx(entries.length); }}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-slate-500 transition-colors hover:text-slate-300"
          title="清屏（命令状态保留）"
        >
          <Eraser size={11} /> 清屏
        </button>
        {onExport && (
          <button
            onClick={(e) => { e.stopPropagation(); if (replay.length > 0) onExport(replay.join('\n')); }}
            disabled={replay.length === 0}
            className="flex items-center gap-1 rounded-md border border-night-600 px-2 py-0.5 text-[10px] text-slate-400 transition-colors hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
            title="把本次敲过的命令填入编辑器（随后可运行/提交）"
          >
            <CornerDownLeft size={11} /> 填入编辑器
          </button>
        )}
      </div>

      {/* 回显区 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-relaxed">
        {visible.length === 0 && (
          <div className="mb-2 text-[11px] italic text-slate-600">
            {welcome ?? '自由演练：随便敲命令试试，这里的状态不会影响评测。'}
          </div>
        )}
        {visible.map((t, i) => (
          <div key={i} className="mb-1">
            <div>
              <Prompt cwd={t.cwd} />
              <span className="text-slate-200">{t.line}</span>
            </div>
            {t.out && <pre className="whitespace-pre-wrap text-emerald-200/90">{t.out}</pre>}
            {t.err && <pre className="whitespace-pre-wrap text-red-400/90">{t.err}</pre>}
          </div>
        ))}
        {/* 输入行 */}
        <div className="flex items-center">
          <Prompt cwd={nextCwd} />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="flex-1 bg-transparent font-mono text-xs text-slate-100 caret-emerald-400 outline-none"
            aria-label="终端命令输入"
          />
        </div>
      </div>
    </div>
  );
}
