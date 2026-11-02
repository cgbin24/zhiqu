import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import type { EffectDemoKind } from '@/data/terms';

/**
 * 页面效果实时演示器 —— effects 领域术语的可交互案例。
 * 全部基于 CSS / framer-motion 实现，无需外部库。
 */
export function EffectDemo({ kind, param }: { kind: EffectDemoKind; param?: string }) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-night-950/60 p-3.5">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">✨ 实时演示</span>
        <span className="text-[10px] text-slate-600">在下方区域内直接操作体验</span>
      </div>
      <div className="min-h-[120px] overflow-hidden rounded-lg">
        <DemoSwitch kind={kind} param={param} />
      </div>
    </div>
  );
}

function DemoSwitch({ kind, param }: { kind: EffectDemoKind; param?: string }) {
  void param; // 预留：个别效果可用 param 变体
  switch (kind) {
    case 'masonry': return <MasonryDemo />;
    case 'parallax': return <ParallaxDemo />;
    case 'scroll-reveal': return <ScrollRevealDemo />;
    case 'horizontal-scroll': return <HorizontalScrollDemo />;
    case 'sticky-header': return <StickyDemo />;
    case 'scroll-progress': return <ScrollProgressDemo />;
    case 'infinite-scroll': return <InfiniteScrollDemo />;
    case 'skeleton': return <SkeletonDemo />;
    case 'preloader': return <PreloaderDemo />;
    case 'page-transition': return <PageTransitionDemo />;
    case 'typewriter': return <TypewriterDemo />;
    case 'text-reveal': return <TextRevealDemo />;
    case 'count-up': return <CountUpDemo />;
    case 'tilt': return <TiltDemo />;
    case 'magnetic': return <MagneticDemo />;
    case 'ripple': return <RippleDemo />;
    case 'glassmorphism': return <GlassDemo />;
    case 'neumorphism': return <NeumorphismDemo />;
    case 'gradient-animate': return <GradientDemo />;
    case 'neon-glow': return <NeonDemo />;
    case 'custom-cursor': return <CustomCursorDemo />;
    case 'card-flip': return <CardFlipDemo />;
    case 'coverflow': return <CoverflowDemo />;
    case 'marquee': return <MarqueeDemo />;
    case 'lightbox': return <LightboxDemo />;
    case 'before-after': return <BeforeAfterDemo />;
    case 'accordion': return <AccordionDemo />;
    case 'magic-line': return <MagicLineDemo />;
    case 'bottom-sheet': return <BottomSheetDemo />;
    case 'progress-ring': return <ProgressRingDemo />;
    case 'bento': return <BentoDemo />;
    case 'timeline': return <TimelineDemo />;
    default: return <div className="p-4 text-xs text-slate-500">演示未配置</div>;
  }
}

/* ---------- 布局骨架 ---------- */

function MasonryDemo() {
  const items = [
    { h: 90, c: 'from-sky-500/70', t: '短卡片' },
    { h: 140, c: 'from-fuchsia-500/70', t: '高卡片' },
    { h: 60, c: 'from-emerald-500/70', t: '矮卡' },
    { h: 120, c: 'from-amber-500/70', t: '中卡片' },
    { h: 75, c: 'from-rose-500/70', t: '小卡' },
    { h: 130, c: 'from-violet-500/70', t: '高卡片' },
    { h: 95, c: 'from-cyan-500/70', t: '中等' },
    { h: 65, c: 'from-lime-500/70', t: '矮卡' },
  ];
  return (
    <div className="columns-3 gap-2 p-2 [column-fill:balance]">
      {items.map((it, i) => (
        <div key={i} className={`mb-2 break-inside-avoid rounded-lg bg-gradient-to-br ${it.c} to-transparent p-2`} style={{ height: it.h }}>
          <span className="text-[10px] text-white/90">{it.t}</span>
          <p className="mt-1 text-[9px] leading-snug text-white/60">columns + break-inside-avoid</p>
        </div>
      ))}
    </div>
  );
}

function ParallaxDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);
  const onScroll = () => {
    const el = boxRef.current;
    if (el) setY(el.scrollTop);
  };
  return (
    <div>
      <div ref={boxRef} onScroll={onScroll} className="relative h-44 overflow-y-auto rounded-lg bg-night-900">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-600/40 to-transparent" style={{ transform: `translateY(${y * 0.5}px)` }} />
        <div className="relative z-10 grid h-32 place-items-center text-2xl">🏔️</div>
        <div className="relative z-10 space-y-2 p-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-8 rounded bg-night-800" />
          ))}
        </div>
      </div>
      <p className="mt-1.5 px-1 text-[10px] text-slate-500">↑ 在框内滚动：背景层以 0.5 倍速移动（远慢于前景）= 视差。分层速率 0.2/0.5/1.0 常见于官网首屏</p>
    </div>
  );
}

function ScrollRevealDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div ref={boxRef} className="h-44 space-y-3 overflow-y-auto rounded-lg bg-night-900 p-3">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: boxRef, once: false, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-lg border border-night-700 bg-night-850 p-3"
          >
            <div className="text-xs font-semibold text-slate-200">滚动到我才显现 · 卡片 {i + 1}</div>
            <div className="mt-1 text-[10px] text-slate-500">whileInView + viewport.root —— 进入视口触发一次动画</div>
          </motion.div>
        ))}
      </div>
      <p className="mt-1.5 px-1 text-[10px] text-slate-500">↑ 在框内滚动：卡片进入视口时淡入上移（IntersectionObserver 的动画化封装）</p>
    </div>
  );
}

function HorizontalScrollDemo() {
  return (
    <div>
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-lg bg-night-900 p-3 [scrollbar-width:thin]">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="grid h-28 w-40 shrink-0 snap-center place-items-center rounded-xl bg-gradient-to-br from-sky-500/60 to-indigo-500/40 text-sm text-white">
            第 {i + 1} 屏
          </div>
        ))}
      </div>
      <p className="mt-1.5 px-1 text-[10px] text-slate-500">↑ 横向滚动 + scroll-snap 磁性吸附：横向叙事/画廊常用</p>
    </div>
  );
}

function StickyDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div ref={boxRef} className="h-44 overflow-y-auto rounded-lg bg-night-900">
        <div className="sticky top-0 z-10 border-b border-night-700 bg-night-850/95 px-3 py-2 text-xs font-bold text-amber-300 backdrop-blur">
          📌 我会吸附在顶部（sticky top-0）
        </div>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="border-b border-night-800 px-3 py-2 text-xs text-slate-400">普通内容行 {i + 1}</div>
        ))}
      </div>
      <p className="mt-1.5 px-1 text-[10px] text-slate-500">↑ position: sticky —— 表头/导航吸附的标配实现</p>
    </div>
  );
}

function ScrollProgressDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  return (
    <div>
      <div ref={boxRef} onScroll={(e) => {
        const el = e.currentTarget;
        setPct(Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100));
      }} className="relative h-44 overflow-y-auto rounded-lg bg-night-900">
        <div className="sticky top-0 h-1.5 w-full bg-night-800">
          <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500" style={{ width: `${pct}%` }} />
        </div>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="border-b border-night-800 px-3 py-2 text-xs text-slate-400">滚动我，看顶部进度条 {i + 1}/12</div>
        ))}
      </div>
      <p className="mt-1.5 px-1 text-[10px] text-slate-500">↑ 阅读进度条：scrollTop / (scrollHeight - clientHeight)，博客/长文标配</p>
    </div>
  );
}

function InfiniteScrollDemo() {
  const [items, setItems] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const load = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => [...prev, prev.length + 1, prev.length + 2, prev.length + 3]);
      setLoading(false);
    }, 700);
  };
  return (
    <div>
      <div
        ref={boxRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.scrollHeight - el.scrollTop - el.clientHeight < 30) load();
        }}
        className="h-44 space-y-1.5 overflow-y-auto rounded-lg bg-night-900 p-3"
      >
        {items.map((n) => (
          <div key={n} className="rounded bg-night-850 px-2.5 py-1.5 text-xs text-slate-300">列表项 {n}</div>
        ))}
        {loading && <div className="py-1 text-center text-[10px] text-amber-300">加载中…（触底自动追加）</div>}
      </div>
      <p className="mt-1.5 px-1 text-[10px] text-slate-500">↑ 无限滚动：滚动接近底部时加载下一页（feed 流标配）</p>
    </div>
  );
}

/* ---------- 加载与转场 ---------- */

function SkeletonDemo() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setLoaded((v) => !v), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="p-3">
      <div className="mx-auto max-w-xs rounded-xl border border-night-700 bg-night-900 p-3">
        {loaded ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-rose-400" />
            <div>
              <div className="text-xs font-bold text-slate-200">内容已加载 ✓</div>
              <div className="mt-1 text-[10px] text-slate-500">骨架屏在数据到达前占位，消除"闪白"焦虑</div>
            </div>
          </motion.div>
        ) : (
          <div className="flex animate-pulse gap-3">
            <div className="h-12 w-12 rounded-full bg-night-800" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 w-24 rounded bg-night-800" />
              <div className="h-2.5 w-40 rounded bg-night-800" />
              <div className="h-2.5 w-32 rounded bg-night-800" />
            </div>
          </div>
        )}
      </div>
      <p className="mt-2 px-1 text-center text-[10px] text-slate-500">骨架屏 ↔ 真实内容 交替演示中</p>
    </div>
  );
}

function PreloaderDemo() {
  return (
    <div className="grid place-items-center p-5">
      <div className="relative h-16 w-16">
        <motion.div className="absolute inset-0 rounded-full border-4 border-night-700" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        />
      </div>
      <motion.div className="mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-night-800">
        <motion.div
          className="h-full w-1/3 rounded-full bg-gradient-to-r from-amber-400 to-rose-400"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        />
      </motion.div>
      <p className="mt-2 text-[10px] text-slate-500">环形 Loader + 滑动进度条 —— 预加载动画的两种经典形态</p>
    </div>
  );
}

function PageTransitionDemo() {
  const [page, setPage] = useState(0);
  return (
    <div className="p-3">
      <div className="relative mx-auto h-32 max-w-xs overflow-hidden rounded-xl border border-night-700 bg-night-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 grid place-items-center bg-gradient-to-br text-sm font-bold text-white ${
              page === 0 ? 'from-sky-500/60 to-indigo-600/40' : 'from-rose-500/60 to-fuchsia-600/40'
            }`}
          >
            {page === 0 ? '页面 A' : '页面 B'}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-3 text-center">
        <button onClick={() => setPage((p) => 1 - p)} className="rounded-lg bg-amber-500/20 px-4 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30">
          切换页面（旧页左滑出，新页右滑入）
        </button>
      </div>
    </div>
  );
}

/* ---------- 文字动效 ---------- */

function TypewriterDemo() {
  const text = 'Hello, CodeQuest! 用 CSS steps() 或逐字 state 都能实现。';
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v >= text.length ? 0 : v + 1)), 90);
    return () => clearInterval(t);
  }, [text.length]);
  return (
    <div className="grid h-32 place-items-center p-3">
      <div className="font-mono text-sm text-emerald-300">
        {text.slice(0, n)}
        <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-emerald-300 align-middle" />
      </div>
    </div>
  );
}

function TextRevealDemo() {
  const words = '让每个词依次浮起，形成电影字幕般的出场感'.split('');
  return (
    <div className="grid h-32 place-items-center p-4">
      <div className="flex flex-wrap justify-center gap-x-1 text-lg font-bold text-slate-100">
        {words.map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: i * 0.05, duration: 0.45 }}
          >
            {w}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function CountUpDemo() {
  const [val, setVal] = useState(0);
  const [key, setKey] = useState(0);
  useEffect(() => {
    setVal(0);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1800);
      setVal(Math.round(2333 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [key]);
  return (
    <div className="grid h-32 place-items-center p-3">
      <div className="text-center">
        <div className="text-4xl font-black tabular-nums text-gold-300">{val.toLocaleString()}</div>
        <button onClick={() => setKey((k) => k + 1)} className="mt-2 rounded-lg border border-night-600 px-3 py-1 text-[11px] text-slate-400 hover:text-slate-200">
          ↻ 重新播放（easeOutCubic 缓动）
        </button>
      </div>
    </div>
  );
}

/* ---------- 微交互 ---------- */

function TiltDemo() {
  const rx = useSpring(useMotionValue(0), { stiffness: 260, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 260, damping: 20 });
  return (
    <div className="grid h-40 place-items-center p-3" style={{ perspective: 600 }}>
      <motion.div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 24);
          rx.set(-(e.clientY - r.top) / r.height * 16);
        }}
        onMouseLeave={() => { rx.set(0); ry.set(0); }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="grid h-28 w-52 place-items-center rounded-xl bg-gradient-to-br from-quest-500/80 to-fuchsia-500/60 shadow-2xl"
      >
        <span className="text-sm font-bold text-white" style={{ transform: 'translateZ(30px)' }}>移动鼠标 · 3D 倾斜</span>
      </motion.div>
    </div>
  );
}

function MagneticDemo() {
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  return (
    <div
      className="grid h-36 place-items-center"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <motion.button style={{ x, y }} className="rounded-full bg-gradient-to-r from-quest-500 to-fuchsia-500 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-quest-500/30">
        磁吸按钮
      </motion.button>
    </div>
  );
}

function RippleDemo() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  return (
    <div className="grid h-36 place-items-center p-3">
      <button
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const id = Date.now();
          setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
          setTimeout(() => setRipples((p) => p.filter((q) => q.id !== id)), 600);
        }}
        className="relative grid h-20 w-40 place-items-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-bold text-white"
      >
        点击我
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute h-10 w-10 rounded-full bg-white/50"
            style={{ left: r.x - 20, top: r.y - 20 }}
          />
        ))}
      </button>
      <p className="mt-2 text-[10px] text-slate-500">Material Design 涟漪：从点击点扩散的圆形波纹</p>
    </div>
  );
}

/* ---------- 视觉风格 ---------- */

function GlassDemo() {
  return (
    <div className="relative grid h-36 place-items-center overflow-hidden p-3">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#7c5cf0_0%,transparent_50%),radial-gradient(circle_at_70%_60%,#f74c00_0%,transparent_45%),radial-gradient(circle_at_50%_80%,#00add8_0%,transparent_40%)] opacity-70" />
      <div className="relative rounded-2xl border border-white/30 bg-white/10 p-4 text-center shadow-2xl backdrop-blur-md">
        <div className="text-sm font-bold text-white">毛玻璃卡片</div>
        <div className="mt-1 text-[10px] text-white/70">backdrop-blur + 半透明背景 + 细边框</div>
      </div>
    </div>
  );
}

function NeumorphismDemo() {
  return (
    <div className="grid h-36 place-items-center bg-[#e0e5ec] p-4">
      <div className="flex gap-6">
        <div className="grid h-16 w-16 place-items-center rounded-2xl text-2xl text-slate-500 shadow-[8px_8px_16px_#bec4cd,-8px_-8px_16px_#ffffff]">🔘</div>
        <div className="grid h-16 w-16 place-items-center rounded-2xl text-2xl text-slate-500 shadow-[inset_6px_6px_12px_#bec4cd,inset_-6px_-6px_12px_#ffffff]">⏏️</div>
      </div>
    </div>
  );
}

function GradientDemo() {
  return (
    <div className="grid h-36 place-items-center p-3">
      <div className="grid h-20 w-56 place-items-center rounded-xl bg-[linear-gradient(270deg,#7c5cf0,#f74c00,#00add8,#7c5cf0)] bg-[length:600%_600%] text-sm font-bold text-white [animation:shimmer_4s_linear_infinite]">
        流光渐变背景
      </div>
      <p className="mt-2 text-[10px] text-slate-500">background-size 放大 + background-position 循环 = 流动的渐变</p>
    </div>
  );
}

function NeonDemo() {
  return (
    <div className="grid h-36 place-items-center bg-night-950 p-3">
      <motion.div
        animate={{ textShadow: ['0 0 8px #22d3ee, 0 0 24px #22d3ee', '0 0 4px #22d3ee, 0 0 12px #22d3ee', '0 0 8px #22d3ee, 0 0 24px #22d3ee'] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="font-mono text-3xl font-black text-cyan-300"
      >
        NEON
      </motion.div>
      <p className="mt-2 text-[10px] text-slate-500">多层 text-shadow + 呼吸动画 = 霓虹灯管</p>
    </div>
  );
}

function CustomCursorDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [hovering, setHovering] = useState(false);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setPos(null)}
      className="relative grid h-36 cursor-none place-items-center overflow-hidden bg-night-900"
    >
      <div className="rounded-lg border border-night-600 px-3 py-1.5 text-xs text-slate-300"
        onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
        悬停我试试（可交互元素上光标变大）
      </div>
      {pos && (
        <motion.div
          animate={{ scale: hovering ? 2 : 1 }}
          className="pointer-events-none absolute h-5 w-5 rounded-full border-2 border-amber-300 bg-amber-300/20"
          style={{ left: pos.x - 10, top: pos.y - 10 }}
        />
      )}
    </div>
  );
}

/* ---------- 媒体展示 ---------- */

function CardFlipDemo() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="grid h-40 place-items-center p-3" style={{ perspective: 700 }}>
      <div onClick={() => setFlipped((f) => !f)} className="relative h-28 w-48 cursor-pointer" style={{ transformStyle: 'preserve-3d' }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 [transform-style:preserve-3d]"
        >
          <div className="absolute inset-0 grid place-items-center rounded-xl bg-gradient-to-br from-sky-500/80 to-indigo-500/60 text-sm font-bold text-white [backface-visibility:hidden]">
            点击翻转（正面）
          </div>
          <div className="absolute inset-0 grid place-items-center rounded-xl bg-gradient-to-br from-emerald-500/80 to-teal-500/60 text-sm font-bold text-white [backface-visibility:hidden]" style={{ transform: 'rotateY(180deg)' }}>
            背面！
          </div>
        </motion.div>
      </div>
      <p className="mt-2 text-[10px] text-slate-500">rotateY 180° + backface-visibility: hidden = 双面卡</p>
    </div>
  );
}

function CoverflowDemo() {
  const [active, setActive] = useState(2);
  return (
    <div className="grid h-40 place-items-center p-3">
      <div className="flex items-center gap-1" style={{ perspective: 800 }}>
        {Array.from({ length: 5 }, (_, i) => {
          const off = i - active;
          return (
            <motion.div
              key={i}
              onClick={() => setActive(i)}
              animate={{ x: off * 46, scale: off === 0 ? 1 : 0.72, rotateY: off * -32, zIndex: 5 - Math.abs(off), opacity: Math.abs(off) > 2 ? 0 : 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className={`grid h-24 w-32 cursor-pointer place-items-center rounded-xl text-xs font-bold text-white ${
                off === 0 ? 'bg-gradient-to-br from-amber-400 to-rose-500' : 'bg-night-700'
              }`}
            >
              {i + 1}
            </motion.div>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] text-slate-500">点击切换 —— Apple Coverflow 式 3D 轮播</p>
    </div>
  );
}

function MarqueeDemo() {
  const tags = ['瀑布流', '视差滚动', '毛玻璃', '骨架屏', '霓虹字', '磁吸按钮'];
  const row = [...tags, ...tags];
  return (
    <div className="overflow-hidden py-5">
      <motion.div className="flex w-max gap-3" animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}>
        {row.map((t, i) => (
          <span key={i} className="whitespace-nowrap rounded-full border border-night-600 bg-night-850 px-4 py-1.5 text-xs text-slate-300">
            {t}
          </span>
        ))}
      </motion.div>
      <p className="mt-2 px-1 text-[10px] text-slate-500">内容复制两份 + 位移 -50% 循环 = 无缝走马灯</p>
    </div>
  );
}

function LightboxDemo() {
  const [open, setOpen] = useState<number | null>(null);
  const colors = ['from-sky-500/70 to-indigo-500/50', 'from-rose-500/70 to-fuchsia-500/50', 'from-emerald-500/70 to-teal-500/50'];
  return (
    <div className="p-3">
      <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
        {colors.map((c, i) => (
          <button key={i} onClick={() => setOpen(i)} className={`grid h-16 place-items-center rounded-lg bg-gradient-to-br ${c} text-[10px] text-white/90`}>
            图片 {i + 1}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 grid place-items-center bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}
              className={`grid h-40 w-64 place-items-center rounded-xl bg-gradient-to-br ${colors[open]} text-sm font-bold text-white`}
            >
              灯箱大图（点击任意处关闭）
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-2 text-[10px] text-slate-500">缩略图点击 → 遮罩 + 缩放打开大图</p>
    </div>
  );
}

function BeforeAfterDemo() {
  const [pct, setPct] = useState(50);
  return (
    <div className="p-3">
      <div className="relative mx-auto h-32 max-w-sm select-none overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/70 to-indigo-600/50 grid place-items-center">
          <span className="text-xs font-bold text-white/90">2023 版设计（底层）</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/80 to-rose-500/60 grid place-items-center" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
          <span className="text-xs font-bold text-white/90">2024 新版（上层）</span>
        </div>
        <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg" style={{ left: `${pct}%` }}>
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md" />
        </div>
        <input
          type="range" min={0} max={100} value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <p className="mt-2 text-center text-[10px] text-slate-500">拖动滑块 —— 改版前后对比（clip-path 裁切上层）</p>
    </div>
  );
}

/* ---------- 内容组织 ---------- */

function AccordionDemo() {
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    { t: '什么是手风琴效果？', d: '点击标题展开内容、其余收起 —— 用 max-height/height 动画或 AnimatePresence 驱动。' },
    { t: '为什么叫"手风琴"？', d: '展开与收起的联动形似拉动风箱。FAQ 页与设置面板的标配。' },
    { t: '实现要点', d: '只允许一个展开时互斥处理；高度动画注意 content 的动态高度（framer 的 height:auto 支持）。' },
  ];
  return (
    <div className="mx-auto max-w-md space-y-1.5 p-3">
      {items.map((it, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-night-700 bg-night-900">
          <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold text-slate-200">
            {it.t}
            <motion.span animate={{ rotate: open === i ? 180 : 0 }} className="text-slate-500">▾</motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                <p className="px-3 pb-2.5 text-[11px] leading-relaxed text-slate-400">{it.d}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function MagicLineDemo() {
  const [active, setActive] = useState(0);
  const tabs = ['首页', '作品', '关于', '联系'];
  return (
    <div className="grid h-32 place-items-center p-3">
      <div className="relative flex gap-6 border-b border-night-700 pb-2">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActive(i)} className={`text-sm transition-colors ${active === i ? 'font-bold text-amber-300' : 'text-slate-400'}`}>
            {t}
          </button>
        ))}
        <motion.div
          layoutId="magic-line"
          className="absolute -bottom-0.5 h-0.5 rounded-full bg-amber-300"
          style={{ width: '2.5rem' }}
          animate={{ left: `${active * 6.4 + 0.2}rem` }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </div>
      <p className="mt-3 text-[10px] text-slate-500">下划线随选中项滑动 —— layoutId 共享元素动画</p>
    </div>
  );
}

function BottomSheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative mx-auto h-36 max-w-sm overflow-hidden rounded-xl border border-night-700 bg-night-900">
      <div className="grid h-full place-items-center">
        <button onClick={() => setOpen(true)} className="rounded-lg bg-sky-500/20 px-4 py-2 text-xs font-bold text-sky-300">
          打开底部抽屉
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/50" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => { if (info.offset.y > 60) setOpen(false); }}
              className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-night-600 bg-night-850 p-4"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-600" />
              <div className="text-xs font-bold text-slate-200">可拖拽关闭的底部抽屉</div>
              <div className="mt-1.5 text-[10px] text-slate-500">移动端详情/筛选面板的标准交互（drag 向下拉关闭）</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgressRingDemo() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPct((p) => (p >= 100 ? 8 : p + 8)), 120);
    return () => clearInterval(t);
  }, []);
  const R = 30, C = 2 * Math.PI * R;
  return (
    <div className="grid h-36 place-items-center p-3">
      <svg width="86" height="86" className="-rotate-90">
        <circle cx="43" cy="43" r={R} fill="none" stroke="#1e2942" strokeWidth="7" />
        <circle cx="43" cy="43" r={R} fill="none" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} />
      </svg>
      <div className="-mt-14 text-center">
        <div className="text-lg font-black text-gold-300">{pct}%</div>
        <div className="mt-7 text-[10px] text-slate-500">stroke-dashoffset 动画 = 进度环（技能图谱/加载完成度）</div>
      </div>
    </div>
  );
}

function BentoDemo() {
  return (
    <div className="grid grid-cols-3 gap-2 p-3">
      <div className="col-span-2 grid h-16 place-items-center rounded-xl bg-gradient-to-br from-violet-500/60 to-indigo-500/40 text-xs font-bold text-white">大块 · 2×1</div>
      <div className="grid h-16 place-items-center rounded-xl bg-night-800 text-[10px] text-slate-400">1×1</div>
      <div className="grid h-16 place-items-center rounded-xl bg-night-800 text-[10px] text-slate-400">1×1</div>
      <div className="col-span-2 grid h-16 place-items-center rounded-xl bg-gradient-to-br from-emerald-500/60 to-teal-500/40 text-xs font-bold text-white">大块 · 2×1</div>
    </div>
  );
}

function TimelineDemo() {
  const steps = [
    { t: '2021 · 萌芽', d: '第一个 Hello World' },
    { t: '2023 · 成长', d: '掌握三门语言' },
    { t: '2026 · 进化', d: '在这里刷完算法' },
  ];
  return (
    <div className="p-4">
      <div className="relative ml-3 space-y-4 border-l-2 border-night-600 pl-6">
        {steps.map((s, i) => (
          <div key={i} className="relative">
            <span className="absolute -left-[31px] top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-amber-400 ring-4 ring-amber-400/20" />
            <div className="text-xs font-bold text-slate-200">{s.t}</div>
            <div className="text-[11px] text-slate-500">{s.d}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-slate-500">左侧轴线 + 节点圆点 + 卡片 —— 简历/ roadmap 的经典呈现</p>
    </div>
  );
}
