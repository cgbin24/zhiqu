import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Flame, Gamepad2, Home, Medal, SlidersHorizontal } from 'lucide-react';
import { getRank } from '@/data/ranks';
import { useProgress } from '@/store/progress';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Toasts } from './Toasts';

const NAV = [
  { to: '/', label: '仪表盘', icon: Home, end: true },
  { to: '/learn', label: '闯关', icon: Compass, end: false },
  { to: '/playground', label: '练习场', icon: Gamepad2, end: false },
  { to: '/achievements', label: '成就', icon: Medal, end: false },
  { to: '/profile', label: '我的', icon: SlidersHorizontal, end: false },
];

export function Layout() {
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak.current);
  const location = useLocation();
  const { rank } = getRank(xp);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-night-700/60 bg-night-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
          <NavLink to="/" className="mr-2 flex items-center gap-2">
            <Logo size={30} />
            <span className="hidden font-bold tracking-wide text-slate-100 sm:block">
              智码 <span className="text-quest-400">CodeQuest</span>
            </span>
          </NavLink>

          <nav className="flex flex-1 items-center gap-0.5 overflow-x-auto sm:gap-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors sm:px-3 ${
                    isActive
                      ? 'bg-quest-500/15 font-semibold text-quest-400'
                      : 'text-slate-400 hover:bg-night-800 hover:text-slate-200'
                  }`
                }
              >
                <Icon size={16} />
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <span
              className="hidden items-center gap-1 rounded-lg border border-night-700 bg-night-850 px-2.5 py-1.5 text-xs font-semibold sm:flex"
              style={{ color: rank.color }}
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
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-6">
        {/* 页面切换动效：按路径 key 重挂载，淡入上移，不产生布局跳动 */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>

      <Toasts />
    </div>
  );
}
