import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/** 显现阈值：页面滚动超过该距离后按钮出现 */
const SHOW_THRESHOLD = 480;
const RING_R = 20;
const RING_C = 2 * Math.PI * RING_R;

/**
 * 全局返回顶部悬浮按钮（挂在 Layout，全站唯一实例）。
 * - 滚动超过阈值后弹性显现，附滚动进度环（ref 直写，不触发重渲染）
 * - 几何（可滚动距离）由 ResizeObserver 缓存，滚动路径零布局读写
 * - visible 状态用 ref 去重：滚动期间 setState 只在跨越阈值时触发一次，
 *   其余帧直接返回，不给主线程添加任何 React 工作
 * - 被动滚动监听 + rAF 节流
 * - 移动端位置避开底部悬浮导航（bottom-24）
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const ticking = useRef(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    // 几何缓存：内容高度变化（路由切换/内容展开）时重算，滚动路径只读缓存
    let max = 0;
    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure);

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        const y = window.scrollY;
        const shouldShow = y > SHOW_THRESHOLD;
        if (shouldShow !== visibleRef.current) {
          visibleRef.current = shouldShow;
          setVisible(shouldShow);
        }
        const ring = ringRef.current;
        if (ring && shouldShow && max > 0) {
          const p = Math.min(1, y / max);
          ring.style.strokeDashoffset = String(RING_C * (1 - p));
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 14 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="返回顶部"
          title="返回顶部"
          className="fixed bottom-24 right-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-night-600/70 bg-night-900/85 text-quest-400 shadow-lg shadow-quest-500/20 backdrop-blur-md transition-colors hover:border-quest-500/70 hover:bg-quest-500/15 hover:text-quest-300 md:bottom-8 md:right-6 md:h-12 md:w-12"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
            <circle
              ref={ringRef}
              cx="24"
              cy="24"
              r={RING_R}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              className="text-quest-500/60"
            />
          </svg>
          <ArrowUp size={18} className="relative" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
