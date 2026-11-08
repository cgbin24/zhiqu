import { useEffect, useRef } from 'react';

/**
 * 页面级自定义滚动条 —— 不占布局空间的覆盖式设计。
 *
 * - 固定定位悬浮在右缘（宽 7px），原生滚动条已全局隐藏（index.css）
 * - 滑块高度按内容/视口比例计算，滚动时实时跟随
 * - 交互：滚动或悬停滑块时浮现，静止 1 秒后淡出；可拖动滑块直接定位
 * - 性能：rAF 节流 + ref 直写样式，滚动过程中零 React 重渲染
 */
export function CustomScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const dragRef = useRef<{ startY: number; startTop: number } | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current!;
    const thumb = thumbRef.current!;
    let raf = 0;
    let pending = false;

    const show = () => {
      if (!visibleRef.current) {
        visibleRef.current = true;
        track.style.opacity = '1';
      }
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (!dragRef.current) {
          visibleRef.current = false;
          track.style.opacity = '0';
        }
      }, 900);
    };

    const update = () => {
      pending = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 2) {
        track.style.display = 'none';
        return;
      }
      track.style.display = 'block';
      const trackH = track.clientHeight;
      const thumbH = Math.max(44, Math.round((window.innerHeight / doc.scrollHeight) * trackH));
      thumb.style.height = `${thumbH}px`;
      const ratio = window.scrollY / max;
      thumb.style.top = `${Math.round(ratio * (trackH - thumbH))}px`;
      show();
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // 拖动滑块直接定位
    const onThumbDown = (ev: PointerEvent) => {
      ev.preventDefault();
      dragRef.current = { startY: ev.clientY, startTop: parseFloat(thumb.style.top || '0') };
      thumb.setPointerCapture(ev.pointerId);
      show();
      clearTimeout(hideTimer.current);
    };
    const onThumbMove = (ev: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const trackH = track.clientHeight;
      const thumbH = parseFloat(thumb.style.height || '44');
      const top = Math.max(0, Math.min(trackH - thumbH, drag.startTop + (ev.clientY - drag.startY)));
      thumb.style.top = `${top}px`;
      window.scrollTo(0, (top / (trackH - thumbH)) * max);
      show();
    };
    const onThumbUp = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      dragRef.current = null;
      thumb.releasePointerCapture(ev.pointerId);
      show();
    };
    thumb.addEventListener('pointerdown', onThumbDown);
    thumb.addEventListener('pointermove', onThumbMove);
    thumb.addEventListener('pointerup', onThumbUp);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      thumb.removeEventListener('pointerdown', onThumbDown);
      thumb.removeEventListener('pointermove', onThumbMove);
      thumb.removeEventListener('pointerup', onThumbUp);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-[3px] top-14 bottom-24 z-50 hidden w-[7px] opacity-0 transition-opacity duration-300 md:bottom-3"
    >
      <div
        ref={thumbRef}
        className="pointer-events-auto absolute left-0 w-full cursor-grab rounded-full bg-quest-400/45 shadow-sm transition-colors hover:bg-quest-400/80 active:cursor-grabbing active:bg-quest-400"
        style={{ top: 0, height: 44 }}
      />
    </div>
  );
}
