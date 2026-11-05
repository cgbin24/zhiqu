/**
 * 品牌色可读性辅助 —— 课程/术语域/段位的主题色都按暗色主题调校，
 * 直接作为文字色压在浅色面板上会对比不足。这里提供两类修复：
 *
 * 1. `.brand-text`（index.css）：亮色主题下用 color-mix 统一加深文字色（CSS 方案，随主题自动切换）
 * 2. textOn()：给定品牌色背景，返回可读的文字色（亮底配深字、深底配白字）—— 用于色块上的数字/角标
 */

/** WCAG 相对亮度（0~1） */
export function hexLuminance(hex: string): number {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return 0;
  const chan = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const [r, g, b] = chan.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** 品牌色背景上的可读文字色：浅色（lime/amber/淡紫等）配深字，其余配白字 */
export function textOn(hex: string, dark = '#17233f', light = '#ffffff'): string {
  return hexLuminance(hex) > 0.42 ? dark : light;
}
