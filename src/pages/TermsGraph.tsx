import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import { TERM_CATEGORIES, TERMS } from '@/data/terms';

/* ---------------- 数据结构 ---------------- */

interface GNode {
  id: string;
  name: string;
  cat: string;
  color: string;
  degree: number;
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

function buildGraph() {
  const nodes: GNode[] = TERMS.map((t, i) => {
    const catIndex = TERM_CATEGORIES.findIndex((c) => c.id === t.cat);
    const ang = (catIndex / TERM_CATEGORIES.length) * Math.PI * 2;
    const rad = 320 + (i % 7) * 46;
    return {
      id: t.id,
      name: t.name,
      cat: t.cat,
      color: CAT_COLOR.get(t.cat) ?? '#8b7cf6',
      degree: 0,
      x: Math.cos(ang) * rad + (Math.random() - 0.5) * 140,
      y: Math.sin(ang) * rad + (Math.random() - 0.5) * 140,
      vx: 0,
      vy: 0,
      r: 5,
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
    }
  }
  const maxDeg = Math.max(1, ...nodes.map((n) => n.degree));
  for (const n of nodes) n.r = 4 + (n.degree / maxDeg) * 7;
  return { nodes, edges };
}

/* ---------------- 组件 ---------------- */

export function TermsGraph() {
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCats, setActiveCats] = useState<Set<string>>(() => new Set(TERM_CATEGORIES.map((c) => c.id)));
  const activeCatsRef = useRef(activeCats);
  activeCatsRef.current = activeCats;
  const [hoverInfo, setHoverInfo] = useState<{ name: string; cat: string; degree: number } | null>(null);
  const simRef = useRef<{ nodes: GNode[]; edges: GEdge[] } | null>(null);
  const viewRef = useRef({ x: 0, y: 0, k: 1 });
  const dragRef = useRef<{ node: GNode | null; panning: boolean; lx: number; ly: number }>({ node: null, panning: false, lx: 0, ly: 0 });
  const hoverRef = useRef<GNode | null>(null);

  const graph = useMemo(buildGraph, []);

  useEffect(() => {
    simRef.current = graph;
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
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
      // 世界原点居中（力导向围绕原点展开）
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

    const tick = () => {
      const { nodes, edges } = simRef.current!;
      const active = activeCatsRef.current;

      // —— 力学模拟 ——
      if (alpha > 0.015) {
        // 斥力（网格近似：仅同 96px 栅格内计算，n² 不可行时保性能）
        const cell = 96;
        const grid = new Map<string, number[]>();
        nodes.forEach((n, i) => {
          const key = `${Math.round(n.x / cell)},${Math.round(n.y / cell)}`;
          (grid.get(key) ?? grid.set(key, []).get(key)!).push(i);
        });
        for (const [key, list] of grid) {
          const [cx, cy] = key.split(',').map(Number);
          const neighbors: number[] = [];
          for (let dx = -1; dx <= 1; dx++)
            for (let dy = -1; dy <= 1; dy++) {
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
              if (d2 > cell * cell * 4) continue;
              const f = 1400 / d2;
              const d = Math.sqrt(d2);
              const fx = (dx / d) * f;
              const fy = (dy / d) * f;
              a.vx -= fx;
              a.vy -= fy;
              b.vx += fx;
              b.vy += fy;
            }
          }
        }
        // 弹簧（关系边）
        for (const e of edges) {
          const a = nodes[e.a];
          const b = nodes[e.b];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.max(1, Math.hypot(dx, dy));
          const f = (d - 90) * 0.012;
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
        // 向心
        for (const n of nodes) {
          n.vx -= n.x * 0.0016;
          n.vy -= n.y * 0.0016;
        }
      }
      // 积分 + 阻尼（拖拽/悬停中的节点冻结）
      for (const n of nodes) {
        if (n === dragRef.current.node) { n.vx = 0; n.vy = 0; continue; }
        n.vx *= 0.86;
        n.vy *= 0.86;
        n.x += n.vx * (0.3 + alpha);
        n.y += n.vy * (0.3 + alpha);
      }
      alpha *= 0.995;

      // —— 绘制 ——
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
      // 边
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const dimA = active.size > 0 && !active.has(a.cat);
        const dimB = active.size > 0 && !active.has(b.cat);
        const hi = hovered && (e.a === hoverIdx || e.b === hoverIdx);
        ctx.strokeStyle = hi
          ? 'rgba(251,191,36,0.85)'
          : dimA || dimB
            ? 'rgba(100,116,139,0.06)'
            : hovered
              ? 'rgba(100,116,139,0.08)'
              : 'rgba(124,92,240,0.16)';
        ctx.lineWidth = hi ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      // 点
      nodes.forEach((n, ni) => {
        const dim = active.size > 0 && !active.has(n.cat);
        const isHover = n === hovered;
        const isNeighbor = hovered && neighborIds.has(ni);        ctx.globalAlpha = dim ? 0.12 : isHover || isNeighbor ? 1 : 0.78;
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        if (isHover) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        // 标签：悬停/邻居/高连接度显示
        if ((isHover || isNeighbor || (n.degree >= 6 && v.k > 0.75)) && !dim) {
          ctx.globalAlpha = dim ? 0.12 : 0.92;
          ctx.fillStyle = isHover ? '#fbbf24' : '#e2e8f0';
          ctx.font = `${isHover ? 600 : 400} ${isHover ? 12 : 10.5}px system-ui, sans-serif`;
          ctx.fillText(n.name, n.x + n.r + 4, n.y + 3.5);
        }
        ctx.globalAlpha = 1;
      });
      ctx.restore();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* —— 交互 —— */
    const pick = (ev: PointerEvent | WheelEvent) => {
      const rect = canvas.getBoundingClientRect();
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      const w = toWorld(sx, sy);
      const { nodes } = simRef.current!;
      let best: GNode | null = null;
      let bestD = Infinity;
      for (const n of nodes) {
        const d = Math.hypot(n.x - w.x, n.y - w.y);
        if (d < n.r + 6 && d < bestD) { best = n; bestD = d; }
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
        alpha = Math.max(alpha, 0.3);
        return;
      }
      if (dragRef.current.panning) {
        viewRef.current.x += sx - dragRef.current.lx;
        viewRef.current.y += sy - dragRef.current.ly;
        dragRef.current.lx = sx;
        dragRef.current.ly = sy;
        return;
      }
      hoverRef.current = best;
      setHoverInfo(best ? { name: best.name, cat: CAT_NAME.get(best.cat) ?? best.cat, degree: best.degree } : null);
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
      const k2 = Math.min(4, Math.max(0.25, v.k * (ev.deltaY < 0 ? 1.12 : 0.89)));
      const w = toWorld(sx, sy);
      v.k = k2;
      v.x = sx - w.x * k2;
      v.y = sy - w.y * k2;
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
      n.x = Math.cos(ang) * 320 + (i % 7) * 40 + (Math.random() - 0.5) * 160;
      n.y = Math.sin(ang) * 320 + (Math.random() - 0.5) * 160;
      n.vx = 0;
      n.vy = 0;
    });
    viewRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2, k: 1 };
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
        <span className="text-xs text-slate-500">
          {TERMS.length} 个术语 · {totalEdges} 条关联 · 拖拽节点 / 滚轮缩放 / 点击查看详情
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

      <div
        ref={wrapRef}
        className="relative h-[68vh] min-h-[440px] overflow-hidden rounded-2xl border border-night-700 bg-night-950"
      >
        <canvas ref={canvasRef} className="absolute inset-0" />
        {hoverInfo && (
          <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-gold-500/30 bg-night-900/90 px-3 py-2 text-xs backdrop-blur">
            <div className="font-bold text-gold-300">{hoverInfo.name}</div>
            <div className="mt-0.5 text-slate-400">
              {hoverInfo.cat} · {hoverInfo.degree} 条关联 · 点击查看详情
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
