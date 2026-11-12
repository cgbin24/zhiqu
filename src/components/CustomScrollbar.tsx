import { useEffect, useRef } from 'react';

/** 滑块静止后自动淡出的延时 */
const HIDE_DELAY = 900;
/** 滑块最小高度（px） */
const MIN_THUMB = 44;

/**
 * 页面级自定义滚动条 —— 不占布局空间的覆盖式设计。
 *
 * - 固定定位悬浮在右缘（宽 7px），原生滚动条已全局隐藏（index.css）
 * - 滑块位移优先走 CSS 滚动驱动动画（animation-timeline: scroll(root)，见 index.css）：
 *   位移由合成器按根滚动进度直接插值，滚动过程主线程零样式/布局/重绘工作，
 *   从根上消除逐帧抖动；不支持的浏览器自动降级为 rAF + transform 直写
 * - 几何（内容高度/轨道高度/滑块高度/可移动距离）全部缓存，仅在 resize 与
 *   内容尺寸变化（ResizeObserver 监听 body/track）时重算 —— 滚动路径零布局读写
 *   （旧实现每帧写 display 后读 clientHeight，强制同步 reflow，是抖动延迟的根源）
 * - 交互：滚动或拖动时浮现，静止 900ms 后淡出（单定时器 + 活动时间戳，
 *   滚动期间不反复 clearTimeout/setTimeout）；可拖动滑块直接定位
 */
export function CustomScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startTop: number } | null>(null);

  useEffect(() => {
    const track = trackRef.current!;
    const thumb = thumbRef.current!;
    const doc = document.documentElement;
    const cssDriven =
      typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('animation-timeline', 'scroll()');

    // 几何缓存：滚动路径只读这些值，不再触碰 scrollHeight / clientHeight
    let max = 0;   // 可滚动总距离
    let range = 0; // 滑块可移动距离（trackH - thumbH）

    let raf = 0;
    let pending = false;

    /** 降级路径：按当前 scrollY 直写 transform（transform 只走合成器，无布局） */
    const applyJs = () => {
      const top = max > 0 ? Math.round((Math.min(window.scrollY, max) / max) * range) : 0;
      thumb.style.transform = `translateY(${top}px)`;
    };

    /** 几何重算：只在 RO/resize 触发，绝不在滚动路径里调用 */
    const recompute = () => {
      const scrollH = doc.scrollHeight;
      max = scrollH - window.innerHeight;
      // 无条件写可见性（recompute 本就不在滚动路径）：轨道以 invisible 类起始，
      // 这里覆盖为实际状态，避免"初始即可见但状态判断没变化"导致永久隐藏
      track.style.visibility = max <= 2 ? 'hidden' : 'visible';
      if (max <= 2) return;
      const trackH = track.clientHeight;
      const thumbH = Math.max(MIN_THUMB, Math.round((window.innerHeight / Math.max(scrollH, 1)) * trackH));
      range = Math.max(0, trackH - thumbH);
      thumb.style.height = `${thumbH}px`;
      if (cssDriven) {
        thumb.style.setProperty('--thumb-range', `${range}px`);
      } else {
        applyJs();
      }
    };

    /* 显隐：单定时器 + 活动时间戳。滚动期间只刷新时间戳，不重复排队定时器 */
    let visible = false;
    let lastActivity = 0;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const hideTick = () => {
      hideTimer = undefined;
      const remain = HIDE_DELAY - (performance.now() - lastActivity);
      if (remain > 0) {
        hideTimer = setTimeout(hideTick, remain);
      } else if (!dragRef.current) {
        visible = false;
        track.style.opacity = '0';
      }
    };
    const show = () => {
      lastActivity = performance.now();
      if (!visible) {
        visible = true;
        track.style.opacity = '1';
      }
      if (hideTimer === undefined) hideTimer = setTimeout(hideTick, HIDE_DELAY);
    };

    const onScroll = () => {
      show();
      if (!cssDriven && !pending) {
        pending = true;
        raf = requestAnimationFrame(() => {
          pending = false;
          applyJs();
        });
      }
    };

    /* 拖动滑块：只写 scrollTo，滑块位移统一交给滚动路径驱动（两种模式同构） */
    let dragY = 0;
    const onThumbDown = (ev: PointerEvent) => {
      ev.preventDefault();
      const startTop = max > 0 ? (Math.min(window.scrollY, max) / max) * range : 0;
      dragRef.current = { startY: ev.clientY, startTop };
      thumb.setPointerCapture(ev.pointerId);
      show();
      clearTimeout(hideTimer);
      hideTimer = undefined; // 拖动期间保持可见
    };
    const onThumbMove = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      dragY = ev.clientY;
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(() => {
        pending = false;
        const drag = dragRef.current;
        if (!drag) return;
        const top = Math.max(0, Math.min(range, drag.startTop + (dragY - drag.startY)));
        if (max > 0 && range > 0) window.scrollTo(0, (top / range) * max);
        show();
      });
    };
    const onThumbUp = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      dragRef.current = null;
      thumb.releasePointerCapture(ev.pointerId);
      show();
    };

    recompute();
    if (cssDriven) {
      thumb.classList.add('scroll-thumb-css');
    } else {
      thumb.style.willChange = 'transform';
    }
    show();

    const ro = new ResizeObserver(recompute);
    ro.observe(document.body); // 内容高度变化（路由切换/内容展开/字体加载）
    ro.observe(track);         // 轨道尺寸变化（窗口尺寸/断点切换）

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recompute);
    thumb.addEventListener('pointerdown', onThumbDown);
    thumb.addEventListener('pointermove', onThumbMove);
    thumb.addEventListener('pointerup', onThumbUp);
    thumb.addEventListener('pointercancel', onThumbUp);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recompute);
      thumb.removeEventListener('pointerdown', onThumbDown);
      thumb.removeEventListener('pointermove', onThumbMove);
      thumb.removeEventListener('pointerup', onThumbUp);
      thumb.removeEventListener('pointercancel', onThumbUp);
      thumb.classList.remove('scroll-thumb-css');
    };
  }, []);

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-[3px] top-14 bottom-24 z-50 invisible w-[7px] opacity-0 transition-opacity duration-300 md:bottom-3"
    >
      <div
        ref={thumbRef}
        className="pointer-events-auto absolute left-0 top-0 w-full cursor-grab rounded-full bg-quest-400/45 shadow-sm transition-colors hover:bg-quest-400/80 active:cursor-grabbing active:bg-quest-400"
        style={{ height: MIN_THUMB }}
      />
    </div>
  );
}
