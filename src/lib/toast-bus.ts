import type { AchievementDef } from '@/types';

/** 轻量事件总线：跨页面 XP / 成就 / 段位 toast */

export type ToastPayload =
  | { kind: 'xp'; amount: number; label?: string }
  | { kind: 'achievement'; achievements: AchievementDef[] }
  | { kind: 'rank'; rankName: string; icon: string }
  | { kind: 'info'; text: string };

type Listener = (t: ToastPayload) => void;

const listeners = new Set<Listener>();

export function onToast(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emitToast(t: ToastPayload): void {
  for (const l of listeners) l(t);
}
