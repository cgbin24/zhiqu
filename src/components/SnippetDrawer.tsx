import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, X } from 'lucide-react';
import { SNIPPETS } from '@/data/snippets';
import { LANG_MAP } from '@/data/languages/registry';
import type { LanguageId } from '@/types';
import { emitToast } from '@/lib/toast-bus';

/** 代码片段速查抽屉 —— 按语言分 Tab，一键复制 */
export function SnippetDrawer({
  open, onClose, lang, onLangChange,
}: {
  open: boolean; onClose: () => void; lang: LanguageId; onLangChange: (l: LanguageId) => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const snippets = SNIPPETS[lang];
  const def = LANG_MAP[lang];

  const copy = async (code: string, title: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(title);
    emitToast({ kind: 'info', text: `已复制「${title}」` });
    setTimeout(() => setCopied((c) => (c === title ? null : c)), 1600);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed inset-y-0 right-0 z-[75] flex w-[min(92vw,440px)] flex-col border-l border-night-700 bg-night-900 shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-night-700 px-4 py-3">
              <span className="text-lg">📖</span>
              <div>
                <div className="text-sm font-bold text-slate-100">代码片段速查</div>
                <div className="text-[10px] text-slate-500">点卡片复制，粘贴进编辑器</div>
              </div>
              <button onClick={onClose} className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-night-800 hover:text-slate-200">
                <X size={16} />
              </button>
            </div>

            {/* 语言切换 */}
            <div className="flex gap-1 border-b border-night-700 px-3 py-2">
              {(['javascript', 'go', 'rust', 'cpp'] as LanguageId[]).map((l) => (
                <button
                  key={l}
                  onClick={() => onLangChange(l)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    lang === l ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  style={lang === l ? { background: LANG_MAP[l].color + '33', color: LANG_MAP[l].color } : undefined}
                >
                  {LANG_MAP[l].name}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
              {snippets.map((sn) => (
                <div key={sn.title} className="rounded-xl border border-night-700 bg-night-850">
                  <div className="flex items-center gap-2 px-3 pt-2.5">
                    <span className="flex-1 text-xs font-bold text-slate-200">{sn.title}</span>
                    <button
                      onClick={() => copy(sn.code, sn.title)}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold transition-colors ${
                        copied === sn.title ? 'bg-emerald-500/20 text-emerald-300' : 'bg-night-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Copy size={11} /> {copied === sn.title ? '已复制' : '复制'}
                    </button>
                  </div>
                  <pre className="mx-2.5 mt-1.5 overflow-x-auto rounded-lg bg-night-950 p-2.5 font-mono text-[11px] leading-relaxed text-slate-300">
                    {sn.code}
                  </pre>
                  {sn.note && <p className="px-3 pb-2.5 pt-1 text-[10px] text-slate-500">💡 {sn.note}</p>}
                  <div className="pb-2" />
                </div>
              ))}
              <p className="px-1 pb-2 text-center text-[10px] text-slate-600">
                {def.name} · {snippets.length} 条片段 · 遇到语法卡壳先来这里翻翻
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
