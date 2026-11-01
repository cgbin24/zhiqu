import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/store/theme';

/** 明暗主题切换按钮（带 450ms 全局颜色过渡，见 index.css .theme-transition） */
export function ThemeToggle() {
  const theme = useTheme((s) => s.theme);
  const toggle = useTheme((s) => s.toggle);
  return (
    <button
      onClick={toggle}
      title={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
      aria-label="切换主题"
      className="grid h-8 w-8 place-items-center rounded-lg border border-night-700 bg-night-850 text-slate-400 transition-colors hover:text-quest-400"
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
