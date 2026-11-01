import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RARITY_STYLE } from '@/data/achievements';
import { onToast, type ToastPayload } from '@/lib/toast-bus';

interface ToastItem {
  id: number;
  payload: ToastPayload;
}

let nextId = 1;

export function Toasts() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const off = onToast((payload) => {
      const id = nextId++;
      setItems((prev) => [...prev.slice(-4), { id, payload }]);
      const ttl = payload.kind === 'achievement' ? 5200 : 3000;
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), ttl);
    });
    return off;
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-16 z-[90] flex w-80 flex-col gap-2">
      <AnimatePresence>
        {items.map((item) => (
          <ToastCard key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ item }: { item: ToastItem }) {
  const { payload } = item;
  if (payload.kind === 'xp') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.95 }}
        className="pointer-events-auto flex items-center gap-3 rounded-xl border border-gold-500/40 bg-night-850/95 px-4 py-3 shadow-lg shadow-gold-500/10 backdrop-blur"
      >
        <span className="text-2xl">⚡</span>
        <div>
          <div className="font-bold text-gold-300">+{payload.amount} XP</div>
          {payload.label && <div className="text-xs text-slate-400">{payload.label}</div>}
        </div>
      </motion.div>
    );
  }
  if (payload.kind === 'rank') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.95 }}
        className="pointer-events-auto flex items-center gap-3 rounded-xl border border-quest-500/50 bg-night-850/95 px-4 py-3 shadow-lg shadow-quest-500/20 backdrop-blur"
      >
        <span className="text-2xl">{payload.icon}</span>
        <div>
          <div className="font-bold text-quest-400">段位提升！</div>
          <div className="text-xs text-slate-400">晋升 {payload.rankName}</div>
        </div>
      </motion.div>
    );
  }
  if (payload.kind === 'info') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.95 }}
        className="pointer-events-auto rounded-xl border border-night-600 bg-night-850/95 px-4 py-3 text-sm text-slate-300 shadow-lg backdrop-blur"
      >
        {payload.text}
      </motion.div>
    );
  }
  // achievements
  return (
    <div className="pointer-events-auto flex flex-col gap-2">
      {payload.achievements.map((a, i) => {
        const style = RARITY_STYLE[a.rarity];
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ delay: i * 0.15 }}
            className={`flex items-center gap-3 rounded-xl border border-night-600 bg-night-850/95 px-4 py-3 shadow-lg backdrop-blur ring-1 ${style.ring}`}
          >
            <span className="text-2xl">{a.icon}</span>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                成就解锁 · {style.label}
              </div>
              <div className="font-bold text-slate-100">{a.name}</div>
              <div className="text-xs text-slate-400">{a.desc}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
