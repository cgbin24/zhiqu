import { create } from 'zustand';

export type Theme = 'dark' | 'light';

const KEY = 'zhiqu-theme';

function initialTheme(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* ignore */
  }
  return 'dark';
}

/** 应用主题到 <html>：data-theme + color-scheme。切换时短暂开启全局过渡，避免跳变 */
function applyTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  if (animate) {
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 450);
  }
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

interface ThemeState {
  theme: Theme;
  toggle: () => void;
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: initialTheme(),
  toggle: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
    applyTheme(next, true);
    set({ theme: next });
  },
}));

/** 应用启动时同步（React 渲染前 index.html 内联脚本已设置过一次，这里兜底） */
export function initTheme(): void {
  applyTheme(useTheme.getState().theme, false);
}
