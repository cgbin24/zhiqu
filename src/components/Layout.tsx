import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  BookOpenText, Compass, Flame, Gamepad2, Github, Home, Medal, SlidersHorizontal,
} from 'lucide-react';
import type { AchievementDef } from '@/types';
import { emitToast } from '@/lib/toast-bus';
import { getRank } from '@/data/ranks';
import { useProgress } from '@/store/progress';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Toasts } from './Toasts';

const NAV = [
  { to: '/', label: '仪表盘', icon: Home, end: true },
  { to: '/learn/go', label: '闯关', icon: Compass, end: false },
  { to: '/terms', label: '术语', icon: BookOpenText, end: false },
  { to: '/playground', label: '练习场', icon: Gamepad2, end: false },
  { to: '/achievements', label: '成就', icon: Medal, end: false },
  { to: '/profile', label: '我的', icon: SlidersHorizontal, end: false },
];

const GITHUB_URL = 'https://github.com/cgbin24';

function isNavActive(pathname: string, to: string): boolean {
  if (to === '/learn/go' || to === '/learn') return pathname.startsWith('/learn');
  return pathname === to || pathname.startsWith(to + '/');
}

export function Layout() {
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak.current);
  const location = useLocation();
  const { rank } = getRank(xp);

  /* ---------- 彩蛋系统 ---------- */
  const logoClicks = useRef(0);
  const keyBuffer = useRef('');
  const [eggPing, setEggPing] = useState(false);

  const emitEggToast = (res: AchievementDef[]) => {
    if (res.length > 0) emitToast({ kind: 'achievement', achievements: res });
  };

  useEffect(() => {
    // 夜猫子：凌晨 0-5 点访问
    const hour = new Date().getHours();
    if (hour < 5) {
      const res = useProgress.getState().foundEasterEgg('night-owl');
      if (res.length > 0) emitEggToast(res);
    }
    // Konami 秘技：↑↑↓↓←→←→BA
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let ki = 0;
    const onKonami = (e: KeyboardEvent) => {
      ki = e.key === seq[ki] ? ki + 1 : e.key === seq[0] ? 1 : 0;
      if (ki === seq.length) {
        ki = 0;
        confetti({ particleCount: 160, spread: 90, colors: ['#7c5cf0', '#fbbf24', '#34d399', '#f74c00'] });
        const res = useProgress.getState().foundEasterEgg('konami');
        if (res.length > 0) emitEggToast(res);
      }
    };
    // 彩蛋：连续键入 "zhiqu"
    const onZhiqu = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      keyBuffer.current = (keyBuffer.current + e.key.toLowerCase()).slice(-5);
      if (keyBuffer.current === 'zhiqu') {
        keyBuffer.current = '';
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#7c5cf0', '#fbbf24', '#34d399'] });
        const res = useProgress.getState().foundEasterEgg('zhiqu');
        if (res.length > 0) emitEggToast(res);
      }
    };
    window.addEventListener('keydown', onKonami);
    window.addEventListener('keydown', onZhiqu);
    return () => {
      window.removeEventListener('keydown', onKonami);
      window.removeEventListener('keydown', onZhiqu);
    };
  }, []);

  const onLogoClick = () => {
    logoClicks.current++;
    if (logoClicks.current >= 5) {
      logoClicks.current = 0;
      setEggPing(true);
      setTimeout(() => setEggPing(false), 500);
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.2 } });
      const res = useProgress.getState().foundEasterEgg('logo-clicker');
      if (res.length > 0) emitEggToast(res);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-night-700/60 bg-night-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
          <button onClick={onLogoClick} className="mr-1 flex items-center gap-2 sm:mr-2" aria-label="智码 CodeQuest">
            <Logo size={30} />
            <span className="hidden font-bold tracking-wide text-slate-100 sm:block">
              智码 <span className="text-quest-400">CodeQuest</span>
            </span>
          </button>

          {/* 桌面导航 */}
          <nav className="hidden flex-1 items-center gap-0.5 md:flex lg:gap-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors lg:px-3 ${
                  isNavActive(location.pathname, to)
                    ? 'bg-quest-500/15 font-semibold text-quest-400'
                    : 'text-slate-400 hover:bg-night-800 hover:text-slate-200'
                }`}
              >
                <Icon size={16} />
                <span className="hidden lg:inline">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
            {/* 移动端紧凑状态：段位+XP 合并显示 */}
            <span className="flex items-center gap-1 rounded-lg border border-night-700 bg-night-850 px-2 py-1.5 text-[11px] font-bold text-gold-300 md:hidden">
              ⚡{xp}
            </span>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              title="GitHub 主页"
              aria-label="GitHub 主页"
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-night-800 hover:text-slate-100"
            >
              <Github size={18} />
            </a>
            <ThemeToggle />

            {/* 桌面完整状态条 */}
            <div className="hidden items-center gap-2 sm:flex">
              <span
                className="hidden items-center gap-1 rounded-lg border border-night-700 bg-night-850 px-2.5 py-1.5 text-xs font-semibold brand-text lg:flex"
                style={{ '--brand': rank.color } as CSSProperties}
                title={`当前段位：${rank.name}`}
              >
                <span>{rank.icon}</span> {rank.name}
              </span>
              <span className="flex items-center gap-1 rounded-lg border border-night-700 bg-night-850 px-2.5 py-1.5 text-xs font-semibold text-gold-300">
                ⚡ {xp}
              </span>
              <span
                className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                  streak > 0
                    ? 'border-orange-500/40 bg-orange-500/10 text-orange-300'
                    : 'border-night-700 bg-night-850 text-slate-500'
                }`}
                title="连续学习天数"
              >
                <Flame size={13} /> {streak}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-6 md:pb-16 min-h-[calc(100vh-3.5rem-4rem)]">
        {/* 页面切换动效（纯淡入 0.12s，卸载间隙不可感知） */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* 移动端悬浮毛玻璃导航（横条滑块指示器） */}
      <nav className="fixed inset-x-0 bottom-3 z-40 md:hidden">
        <div className="mx-auto flex w-[min(94vw,430px)] items-center justify-around rounded-[22px] border border-night-600/50 bg-night-900/55 p-1.5 shadow-[0_8px_32px_rgba(7,11,20,0.45)] backdrop-blur-xl">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = isNavActive(location.pathname, to);
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex flex-col items-center gap-0.5 rounded-2xl px-2 pb-1 pt-1.5 text-[10px] transition-colors ${
                  active ? 'font-bold text-quest-300' : 'text-slate-500'
                }`}
              >
                <Icon size={19} className="relative z-10" />
                <span className="relative z-10">{label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-indicator-bar"
                    transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                    className="absolute bottom-0 left-0 right-0 flex justify-center"
                  >
                    <span className="h-[3px] w-7 rounded-full bg-quest-400 shadow-[0_0_8px_rgba(124,92,240,0.8)]" />
                  </motion.span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <Toasts />
      {/* 彩蛋点击反馈光环 */}
      <AnimatePresence>
        {eggPing && (
          <motion.div
            initial={{ opacity: 0.6, scale: 0.4 }}
            animate={{ opacity: 0, scale: 2.4 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none fixed left-4 top-2 z-[95] h-12 w-12 rounded-full border-4 border-gold-400"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
