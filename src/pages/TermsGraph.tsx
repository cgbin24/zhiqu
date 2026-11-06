import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, RotateCcw, ZoomIn } from 'lucide-react';
import { TERM_CATEGORIES, TERMS } from '@/data/terms';

/* ---------------- 数据结构 ---------------- */

interface GNode {
  id: string;
  name: string;
  en: string;
  cat: string;
  color: string;
  icon: string;
  degree: number;
  related: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}
interface GEdge {
  a: number;
  b: number;
}

const CAT_COLOR = new Map<string, string>(TERM_CATEGORIES.map((c) => [c.id, c.color]));
const CAT_NAME = new Map<string, string>(TERM_CATEGORIES.map((c) => [c.id, c.name]));
const CAT_ICON = new Map<string, string>(TERM_CATEGORIES.map((c) => [c.id, c.icon]));

/** 高频术语的真实图标（关键词匹配；未命中回退领域图标） */
const ICON_RULES: [RegExp, string][] = [
  [/git/i, '🌿'],
  [/react/i, '⚛️'],
  [/vue/i, '💚'],
  [/node/i, '🟩'],
  [/typescript|ts\b/i, '🔷'],
  [/javascript|js\b/i, '🟨'],
  [/webpack|vite|构建|打包|bundle/i, '📦'],
  [/docker|容器/i, '🐳'],
  [/kubernetes|k8s|编排/i, '☸️'],
  [/nginx/i, '🟢'],
  [/redis/i, '🧱'],
  [/缓存|cache/i, '🗃️'],
  [/数据库|database|sql|mysql|mongo|索引/i, '🗄️'],
  [/api|接口|rest|graphql/i, '🔌'],
  [/websocket|长连接/i, '📡'],
  [/http|https|tcp|udp|网络协议/i, '🌐'],
  [/dns|域名/i, '🧭'],
  [/css|样式|布局/i, '🎨'],
  [/html|语义|标签/i, '🏷️'],
  [/测试|test|jest|单测/i, '🧪'],
  [/ci|cd|devops|部署|发布|流水线/i, '🚀'],
  [/监控|日志|log|metrics/i, '📊'],
  [/加密|密码|签名|证书|哈希/i, '🔐'],
  [/漏洞|xss|csrf|注入|攻击|安全/i, '🛡️'],
  [/复杂度|算法|排序|查找|动态规划/i, '🧮'],
  [/组件|component|组件化/i, '🧩'],
  [/性能|优化|渲染|重绘|回流/i, '⚡'],
  [/闭包|作用域|原型|异步|事件循环/i, '🌀'],
  [/进程|线程|并发/i, '🧵'],
  [/指针|内存/i, '🧠'],
];

function iconFor(name: string, en: string, cat: string): string {
  for (const [re, icon] of ICON_RULES) {
    if (re.test(name) || re.test(en)) return icon;
  }
  return CAT_ICON.get(cat) ?? '🔹';
}

function buildGraph() {
  const termMap = new Map(TERMS.map((t) => [t.id, t]));
  const nodes: GNode[] = TERMS.map((t, i) => {
    const catIndex = TERM_CATEGORIES.findIndex((c) => c.id === t.cat);
    const ang = (catIndex / TERM_CATEGORIES.length) * Math.PI * 2;
    const rad = 620 + (i % 7) * 52;
    return {
      id: t.id,
      name: t.name,
      en: t.en ?? '',
      cat: t.cat,
      color: CAT_COLOR.get(t.cat) ?? '#8b7cf6',
      icon: iconFor(t.name, t.en ?? '', t.cat),
      degree: 0,
      related: [],
      x: Math.cos(ang) * rad + (Math.random() - 0.5) * 180,
      y: Math.sin(ang) * rad + (Math.random() - 0.5) * 180,
      vx: 0,
      vy: 0,
      r: 13,
    };
  });
  const index = new Map(nodes.map((n, i) => [n.id, i]));
  const edges: GEdge[] = [];
  const seen = new Set<string>();
  for (const t of TERMS) {
    for (const r of t.relations ?? []) {
      const a = index.get(t.id);
      const b = index.get(r.to);
      if (a == null || b == null || a === b) continue;
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ a, b });
      nodes[a].degree++;
      nodes[b].degree++;
      nodes[a].related.push(termMap.get(r.to)?.name ?? r.to);
      nodes[b].related.push(t.name);
    }
  }
  const maxDeg = Math.max(1, ...nodes.map((n) => n.degree));
  for (const n of nodes) n.r = 13 + (n.degree / maxDeg) * 8;
  return { nodes, edges };
}

/* ---------------- 组件 ---------------- */

export function TermsGraph() {
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeCats, setActiveCats] = useState<Set<string>>(() => new Set(TERM_CATEGORIES.map((c) => c.id)));
  const activeCatsRef = useRef(activeCats);
  activeCatsRef.current = activeCats;
  const [hoverInfo, setHoverInfo] = useState<{ name: string; en: string; cat: string; color: string; icon: string; degree: number; related: string[] } | null>(null);
  const simRef = useRef<{ nodes: GNode[]; edges: GEdge[] } | null>(null);
  const viewRef = useRef({ x: 0, y: 0, k: 1 });
  const dragRef = useRef<{ node: GNode | null; panning: boolean; lx: number; ly: number }>({ node: null, panning: false, lx: 0, ly: 0 });
  const hoverRef = useRef<GNode | null>(null);

  const graph = useMemo(buildGraph, []);

  useEffect(() => {
    simRef.current = graph;
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const card = cardRef.current!;
    const ctx = canvas.getContext('2d')!;
    let alpha = 1;
    let raf = 0;
    let W = 0;
    let H = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (viewRef.current.k === 1 && viewRef.current.x === 0 && viewRef.current.y === 0) {
        viewRef.current.x = W / 2;
        viewRef.current.y = H / 2;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const toWorld = (sx: number, sy: number) => {
      const v = viewRef.current;
      return { x: (sx - v.x) / v.k, y: (sy - v.y) / v.k };
    };

    /* —— 模拟：斥力 + 弹簧 + 向心/聚拢 + 碰撞消重叠（缩放感知间距） —— */
    const simulate = (ticks: number) => {
      const { nodes, edges } = simRef.current!;
      for (let step = 0; step < ticks; step++) {
        const cell = 110;
        const grid = new Map<string, number[]>();
        nodes.forEach((n, i) => {
          const key = `${Math.round(n.x / cell)},${Math.round(n.y / cell)}`;
          const list = grid.get(key);
          if (list) list.push(i);
          else grid.set(key, [i]);
        });
        grid.forEach((list, key) => {
          const [cx, cy] = key.split(',').map(Number);
          const neighbors: number[] = [];
          for (let dx = -2; dx <= 2; dx++)
            for (let dy = -2; dy <= 2; dy++) {
              const other = grid.get(`${cx + dx},${cy + dy}`);
              if (other) neighbors.push(...other);
            }
          for (const i of list) {
            for (const j of neighbors) {
              if (j <= i) continue;
              const a = nodes[i];
              const b = nodes[j];
              let dx = b.x - a.x;
              let dy = b.y - a.y;
              let d2 = dx * dx + dy * dy;
              if (d2 < 1) {
                dx = Math.random() - 0.5;
                dy = Math.random() - 0.5;
                d2 = 1;
              }
              if (d2 > cell * cell * 9) continue;
              const d = Math.sqrt(d2);
              const f = 5200 / d2;
              const fx = (dx / d) * f;
              const fy = (dy / d) * f;
              a.vx -= fx;
              a.vy -= fy;
              b.vx += fx;
              b.vy += fy;
            }
          }
        });
        for (const e of edges) {
          const a = nodes[e.a];
          const b = nodes[e.b];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.max(1, Math.hypot(dx, dy));
          const f = (d - 110) * 0.014;
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
        const catCenters = new Map<string, { x: number; y: number; c: number }>();
        for (const n of nodes) {
          const c = catCenters.get(n.cat);
          if (c) { c.x += n.x; c.y += n.y; c.c++; }
          else catCenters.set(n.cat, { x: n.x, y: n.y, c: 1 });
        }
        for (const n of nodes) {
          n.vx -= n.x * 0.0022;
          n.vy -= n.y * 0.0022;
          const c = catCenters.get(n.cat)!;
          n.vx += (c.x / c.c - n.x) * 0.004;
          n.vy += (c.y / c.c - n.y) * 0.004;
        }
        for (const n of nodes) {
          if (n === dragRef.current.node) { n.vx = 0; n.vy = 0; continue; }
          n.vx *= 0.85;
          n.vy *= 0.85;
          n.x += n.vx * (0.35 + alpha);
          n.y += n.vy * (0.35 + alpha);
        }
        // 碰撞消重叠：间距随缩放增大（放大 → 世界间距变大 → 局部清晰）
        const gap = 30 / viewRef.current.k;
        const grid2 = new Map<string, number[]>();
        nodes.forEach((n, i) => {
          const key = `${Math.round(n.x / 80)},${Math.round(n.y / 80)}`;
          const list = grid2.get(key);
          if (list) list.push(i);
          else grid2.set(key, [i]);
        });
        grid2.forEach((list, key) => {
          const [cx, cy] = key.split(',').map(Number);
          for (let dx = -1; dx <= 1; dx++)
            for (let dy = -1; dy <= 1; dy++) {
              const others = grid2.get(`${cx + dx},${cy + dy}`);
              if (!others) continue;
              for (const i of list) {
                for (const j of others) {
                  if (j <= i) continue;
                  const a = nodes[i];
                  const b = nodes[j];
                  const minD = a.r + b.r + gap;
                  let dx = b.x - a.x;
                  let dy = b.y - a.y;
                  let d = Math.hypot(dx, dy);
                  if (d >= minD) continue;
                  if (d < 0.01) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d = Math.hypot(dx, dy) || 0.01; }
                  const push = (minD - d) / 2;
                  const fx = (dx / d) * push;
                  const fy = (dy / d) * push;
                  a.x -= fx;
                  a.y -= fy;
                  b.x += fx;
                  b.y += fy;
                }
              }
            }
        });
        alpha *= 0.994;
      }
    };
    simulate(260); // 预热：首屏即舒展布局

    /* —— 绘制循环 —— */
    const tick = () => {
      const { nodes, edges } = simRef.current!;
      const active = activeCatsRef.current;
      if (alpha > 0.01) simulate(1);

      const v = viewRef.current;
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(v.x, v.y);
      ctx.scale(v.k, v.k);
      const hovered = hoverRef.current;
      const hoverIdx = hovered ? nodes.indexOf(hovered) : -1;
      const neighborIds = new Set<number>();
      if (hovered) {
        neighborIds.add(hoverIdx);
        for (const e of edges) {
          if (e.a === hoverIdx) neighborIds.add(e.b);
          if (e.b === hoverIdx) neighborIds.add(e.a);
        }
      }
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const dimA = active.size > 0 && !active.has(a.cat);
        const dimB = active.size > 0 && !active.has(b.cat);
        const hi = hovered && (e.a === hoverIdx || e.b === hoverIdx);
        ctx.strokeStyle = hi
          ? 'rgba(251,191,36,0.9)'
          : dimA || dimB
            ? 'rgba(100,116,139,0.05)'
            : hovered
              ? 'rgba(100,116,139,0.07)'
              : 'rgba(124,92,240,0.14)';
        ctx.lineWidth = hi ? 2.4 / v.k : 1 / v.k;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      // 节点：圆形芯片（领域描边 + 图标）
      const labelEvery = v.k >= 2 ? 0 : v.k >= 1.3 ? 3 : v.k >= 0.85 ? 6 : 9;
      nodes.forEach((n, ni) => {
        const dim = active.size > 0 && !active.has(n.cat);
        const isHover = n === hovered;
        const isNeighbor = hovered && neighborIds.has(ni);
        ctx.globalAlpha = dim ? 0.14 : isHover || isNeighbor ? 1 : 0.92;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = n.color;
        ctx.stroke();
        ctx.font = `${Math.round(n.r * 1.05)}px system-ui, 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.icon, n.x, n.y + 1);
        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';
        if (isHover) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
        const showLabel = isHover || isNeighbor || n.degree >= labelEvery || v.k >= 2.2;
        if (showLabel && !dim) {
          ctx.globalAlpha = dim ? 0.14 : 1;
          ctx.font = `${isHover ? 600 : 500} ${isHover ? 15 : 12.5}px system-ui, 'PingFang SC', sans-serif`;
          const tw = ctx.measureText(n.name).width;
          ctx.fillStyle = isHover ? 'rgba(254,243,199,0.95)' : 'rgba(255,255,255,0.85)';
          ctx.fillRect(n.x + n.r + 3, n.y - 9.5, tw + 10, 19);
          ctx.fillStyle = isHover ? '#92400e' : '#334155';
          ctx.fillText(n.name, n.x + n.r + 8, n.y + 4.5);
        }
        ctx.globalAlpha = 1;
      });
      ctx.restore();

      // 悬浮卡片跟随节点
      const hoveredNow = hoverRef.current;
      if (hoveredNow) {
        const sx = hoveredNow.x * v.k + v.x;
        const sy = hoveredNow.y * v.k + v.y;
        const cw = card.offsetWidth;
        const ch = card.offsetHeight;
        let left = sx + hoveredNow.r * v.k + 14;
        if (left + cw > W - 8) left = sx - hoveredNow.r * v.k - 14 - cw;
        let top = sy - ch / 2;
        top = Math.max(8, Math.min(H - ch - 8, top));
        card.style.left = `${left}px`;
        card.style.top = `${top}px`;
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* —— 交互 —— */
    const pick = (ev: PointerEvent | MouseEvent | WheelEvent) => {
      const rect = canvas.getBoundingClientRect();
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      const w = toWorld(sx, sy);
      const { nodes } = simRef.current!;
      let best: GNode | null = null;
      let bestD = Infinity;
      for (const n of nodes) {
        const d = Math.hypot(n.x - w.x, n.y - w.y);
        if (d < n.r + 7 && d < bestD) { best = n; bestD = d; }
      }
      return { best, sx, sy };
    };
    const onDown = (ev: PointerEvent) => {
      const { best, sx, sy } = pick(ev);
      if (best) dragRef.current.node = best;
      else { dragRef.current.panning = true; dragRef.current.lx = sx; dragRef.current.ly = sy; }
      canvas.setPointerCapture(ev.pointerId);
    };
    const onMove = (ev: PointerEvent) => {
      const { best, sx, sy } = pick(ev);
      if (dragRef.current.node) {
        const w = toWorld(sx, sy);
        dragRef.current.node.x = w.x;
        dragRef.current.node.y = w.y;
        alpha = Math.max(alpha, 0.35);
        return;
      }
      if (dragRef.current.panning) {
        viewRef.current.x += sx - dragRef.current.lx;
        viewRef.current.y += sy - dragRef.current.ly;
        dragRef.current.lx = sx;
        dragRef.current.ly = sy;
        return;
      }
      const changed = hoverRef.current !== best;
      hoverRef.current = best;
      if (changed) {
        setHoverInfo(best ? { name: best.name, en: best.en, cat: CAT_NAME.get(best.cat) ?? best.cat, color: best.color, icon: best.icon, degree: best.degree, related: best.related } : null);
        if (best) alpha = Math.max(alpha, 0.28);
      }
      canvas.style.cursor = best ? 'pointer' : 'default';
    };
    const onUp = () => {
      dragRef.current.node = null;
      dragRef.current.panning = false;
    };
    const onClick = (ev: MouseEvent) => {
      const { best } = pick(ev as unknown as PointerEvent);
      if (best) navigate(`/terms/${best.cat}/${best.id}`);
    };
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      const v = viewRef.current;
      const k2 = Math.min(5, Math.max(0.3, v.k * (ev.deltaY < 0 ? 1.15 : 0.87)));
      const w = toWorld(sx, sy);
      v.k = k2;
      v.x = sx - w.x * k2;
      v.y = sy - w.y * k2;
      alpha = Math.max(alpha, 0.55); // 缩放触发重排：放大时节点按更大世界间距散开
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [graph, navigate]);

  const relayout = () => {
    const g = simRef.current;
    if (!g) return;
    g.nodes.forEach((n, i) => {
      const catIndex = TERM_CATEGORIES.findIndex((c) => c.id === n.cat);
      const ang = (catIndex / TERM_CATEGORIES.length) * Math.PI * 2;
      n.x = Math.cos(ang) * 620 + (i % 7) * 46 + (Math.random() - 0.5) * 180;
      n.y = Math.sin(ang) * 620 + (Math.random() - 0.5) * 180;
      n.vx = 0;
      n.vy = 0;
    });
    viewRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2, k: 1 };
    setHoverInfo(null);
    hoverRef.current = null;
  };

  const toggleCat = (id: string) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalEdges = graph.edges.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/terms"
          className="flex items-center gap-1 rounded-lg border border-night-700 bg-night-850 px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:text-slate-200"
        >
          <ChevronLeft size={14} /> 术语百科
        </Link>
        <h1 className="text-lg font-bold text-slate-100">术语关系图谱</h1>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <ZoomIn size={13} /> {TERMS.length} 个术语 · {totalEdges} 条关联 · 滚轮缩放自动重排 / 拖拽节点 / 点击查看详情
        </span>
        <div className="flex-1" />
        <button
          onClick={relayout}
          className="flex items-center gap-1.5 rounded-lg border border-night-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:text-slate-200"
        >
          <RotateCcw size={13} /> 重新布局
        </button>
      </div>

      {/* 领域筛选 */}
      <div className="flex flex-wrap gap-1.5">
        {TERM_CATEGORIES.map((c) => {
          const on = activeCats.has(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggleCat(c.id)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                on ? 'border-night-600 bg-night-800 text-slate-200' : 'border-night-800 text-slate-600'
              }`}
              style={on ? { borderColor: c.color + '66' } : undefined}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: c.color, opacity: on ? 1 : 0.3 }} />
              {c.name}
            </button>
          );
        })}
      </div>

      <div ref={wrapRef} className="relative h-[70vh] min-h-[460px] overflow-hidden rounded-2xl border border-night-700 bg-night-950">
        <canvas ref={canvasRef} className="absolute inset-0" />
        {/* 悬浮信息卡片：跟随节点、边缘自动翻转 */}
        <div
          ref={cardRef}
          className="pointer-events-none absolute z-10 hidden w-64 rounded-xl border border-gold-500/40 bg-night-900/95 p-3 shadow-xl shadow-black/30 backdrop-blur"
        >
          {hoverInfo && (
            <>
              <div className="flex items-start gap-2.5">
                <span className="text-2xl leading-none">{hoverInfo.icon}</span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-black text-slate-100">{hoverInfo.name}</div>
                  <div className="truncate text-[10px] uppercase tracking-wide text-slate-500">{hoverInfo.en}</div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                <span
                  className="rounded px-1.5 py-0.5 font-bold"
                  style={{ background: hoverInfo.color + '26', color: hoverInfo.color }}
                >
                  {hoverInfo.cat}
                </span>
                <span className="text-slate-500">{hoverInfo.degree} 条关联</span>
              </div>
              {hoverInfo.related.length > 0 && (
                <div className="mt-2 border-t border-night-700 pt-2">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">关联术语</div>
                  <div className="flex flex-wrap gap-1">
                    {hoverInfo.related.slice(0, 8).map((r) => (
                      <span key={r} className="rounded bg-night-800 px-1.5 py-0.5 text-[10px] text-slate-300">{r}</span>
                    ))}
                    {hoverInfo.related.length > 8 && (
                      <span className="text-[10px] text-slate-500">+{hoverInfo.related.length - 8}</span>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-2 text-center text-[10px] text-quest-400">点击节点查看完整详情 →</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
