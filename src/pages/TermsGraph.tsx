import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, RotateCcw, ZoomIn } from 'lucide-react';
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
    const rad = 640 + (i % 7) * 54;
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
      r: 10,
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
  for (const n of nodes) n.r = 9 + (n.degree / maxDeg) * 4;
  return { nodes, edges };
}

/** 焦点模式的节点布局坐标（原点为中心，屏幕位置 = 坐标 × 焦点视图变换） */
interface FocusPos {
  node: GNode;
  x: number;
  y: number;
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
  const [focusName, setFocusName] = useState<string | null>(null);
  const simRef = useRef<{ nodes: GNode[]; edges: GEdge[] } | null>(null);
  const viewRef = useRef({ x: 0, y: 0, k: 1 });
  const dragRef = useRef<{ node: GNode | null; panning: boolean; lx: number; ly: number; centerDrag: boolean; moved: boolean }>({ node: null, panning: false, lx: 0, ly: 0, centerDrag: false, moved: false });
  const hoverRef = useRef<GNode | null>(null);
  const modeRef = useRef<'global' | 'focus'>('global');
  const focusRef = useRef<{ center: GNode; pos: FocusPos[]; rx: number; ry: number } | null>(null);
  const focusViewRef = useRef({ x: 0, y: 0, k: 1 });
  const savedViewRef = useRef<{ x: number; y: number; k: number } | null>(null);
  const simulateRef = useRef<((ticks: number) => void) | null>(null);
  const exitFocusRef = useRef<() => void>(() => {});

  const graph = useMemo(buildGraph, []);

  useEffect(() => {
    simRef.current = graph;
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const card = cardRef.current!;
    const ctx = canvas.getContext('2d')!;
    let alpha = 1;
    let suppressClickUntil = 0;
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
      if (modeRef.current === 'focus') {
        focusViewRef.current.x = W / 2;
        focusViewRef.current.y = H / 2;
      } else if (viewRef.current.k === 1 && viewRef.current.x === 0 && viewRef.current.y === 0) {
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
    const toFocusWorld = (sx: number, sy: number) => {
      const f = focusViewRef.current;
      return { x: (sx - f.x) / f.k, y: (sy - f.y) / f.k };
    };

    /** 全局节点屏幕半径：随缩放增大但有硬上限 44px（直径 88px） */
    const drawR = (n: GNode) => {
      const screen = n.r * (0.8 + 0.2 * viewRef.current.k) * viewRef.current.k;
      return Math.min(screen, 44) / viewRef.current.k;
    };

    /* —— 全局模式模拟：力学（约 1 秒收敛静止）+ 碰撞（静止后跳过） —— */
    const simulate = (ticks: number) => {
      const { nodes, edges } = simRef.current!;
      for (let step = 0; step < ticks; step++) {
        if (alpha > 0.005) {
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
          alpha *= 0.93;
        }
        if (alpha > 0.005) {
          const kNow = viewRef.current.k;
          const gap = 20 / kNow;
          const grid2 = new Map<string, number[]>();
          nodes.forEach((n, i) => {
            const key = `${Math.round(n.x / 90)},${Math.round(n.y / 90)}`;
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
                    const minD = (drawR(a) + drawR(b)) / kNow + gap;
                    let dx = b.x - a.x;
                    let dy = b.y - a.y;
                    let d = Math.hypot(dx, dy);
                    if (d >= minD) continue;
                    if (d < 0.01) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d = Math.hypot(dx, dy) || 0.01; }
                    const push = ((minD - d) / 2) * 0.5;
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
        }
      }
    };
    simulateRef.current = simulate;
    simulate(320);

    /* —— 焦点模式：原点为中心的椭圆放射布局 —— */
    const layoutFocus = (center: GNode) => {
      const { nodes, edges } = simRef.current!;
      const ci = nodes.indexOf(center);
      const ring: GNode[] = [];
      for (const e of edges) {
        if (e.a === ci) ring.push(nodes[e.b]);
        else if (e.b === ci) ring.push(nodes[e.a]);
      }
      ring.sort((a, b) => b.degree - a.degree);
      const n = ring.length;
      const rx = Math.max(190, Math.min(W / 2 - 150, 200 + n * 20));
      const ry = Math.max(140, Math.min(H / 2 - 150, 140 + n * 13));
      const pos: FocusPos[] = ring.map((node, i) => {
        const ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
        return { node, x: Math.cos(ang) * rx, y: Math.sin(ang) * ry };
      });
      focusRef.current = { center, pos, rx, ry };
      focusViewRef.current = { x: W / 2, y: H / 2, k: 1 };
    };

    const enterFocus = (node: GNode, opts?: { replace?: boolean }) => {
      if (modeRef.current === 'global') savedViewRef.current = { ...viewRef.current };
      modeRef.current = 'focus';
      layoutFocus(node);
      setFocusName(node.name);
      setHoverInfo(null);
      hoverRef.current = null;
      navigate('/terms/graph?focus=' + node.id, { replace: Boolean(opts?.replace) });
    };

    const exitFocus = () => {
      modeRef.current = 'global';
      focusRef.current = null;
      setFocusName(null);
      if (savedViewRef.current) viewRef.current = { ...savedViewRef.current };
      navigate('/terms/graph', { replace: true });
    };
    exitFocusRef.current = exitFocus;

    /* —— 从 URL 恢复焦点状态（详情页返回 / 刷新 / 分享链接） —— */
    const fm = window.location.hash.match(/[?&]focus=([\w-]+)/);
    if (fm) {
      const focusNode = graph.nodes.find((n) => n.id === fm[1]);
      if (focusNode) enterFocus(focusNode, { replace: true });
    }

    /* —— 绘制：全局模式 —— */
    const drawGlobal = () => {
      const { nodes, edges } = simRef.current!;
      const active = activeCatsRef.current;
      const v = viewRef.current;
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
      const edgeAlpha = 0.15 + Math.min(0.14, v.k * 0.035);
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
              ? 'rgba(100,116,139,0.08)'
              : `rgba(124,92,240,${edgeAlpha})`;
        ctx.lineWidth = (hi ? 2.2 : 1.1) / Math.max(1, v.k);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      const labelAll = v.k >= 1.5;
      const labelEvery = v.k >= 2 ? 0 : v.k >= 1.1 ? 4 : v.k >= 0.8 ? 7 : 10;
      nodes.forEach((n, ni) => {
        const dim = active.size > 0 && !active.has(n.cat);
        const isHover = n === hovered;
        const isNeighbor = hovered && neighborIds.has(ni);
        const dr = drawR(n);
        ctx.globalAlpha = dim ? 0.14 : isHover || isNeighbor ? 1 : 0.93;
        ctx.beginPath();
        ctx.arc(n.x, n.y, dr, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2.2 / Math.max(1, Math.min(v.k, 2));
        ctx.strokeStyle = n.color;
        ctx.stroke();
        ctx.font = `${Math.round(dr * 1.05)}px system-ui, 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.icon, n.x, n.y + 1);
        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';
        const showLabel = isHover || isNeighbor || labelAll || n.degree >= labelEvery;
        if (showLabel && !dim) {
          const fs = 12 / Math.min(Math.max(v.k, 0.8), 2.2);
          ctx.globalAlpha = dim ? 0.14 : 1;
          ctx.font = `${isHover ? 600 : 500} ${fs}px system-ui, 'PingFang SC', sans-serif`;
          const tw = ctx.measureText(n.name).width;
          ctx.fillStyle = isHover ? 'rgba(254,243,199,0.95)' : 'rgba(255,255,255,0.85)';
          ctx.fillRect(n.x + dr + 3, n.y - fs * 0.75, tw + 9, fs * 1.5);
          ctx.fillStyle = isHover ? '#92400e' : '#334155';
          ctx.fillText(n.name, n.x + dr + 7, n.y + fs * 0.35);
        }
        ctx.globalAlpha = 1;
      });
    };

    /* —— 绘制：焦点放射模式（芯片屏幕半径 ≤ 44px，缩放展开的是间距） —— */
    const drawFocus = () => {
      const f = focusRef.current!;
      const hovered = hoverRef.current;
      const fv = focusViewRef.current;
      ctx.save();
      ctx.translate(fv.x, fv.y);
      ctx.scale(fv.k, fv.k);
      const chipR = Math.min(24, 44 / fv.k);
      const centerR = Math.min(40, 52 / fv.k);
      // 同心圆背景
      ctx.strokeStyle = 'rgba(124,92,240,0.08)';
      for (const rr of [f.rx * 0.55, f.rx, f.rx * 1.3]) {
        ctx.lineWidth = 1 / fv.k;
        ctx.beginPath();
        ctx.ellipse(0, 0, rr, rr * (f.ry / Math.max(f.rx, 1)), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // 连线：中心 → 环绕（从芯片边缘出发，按目标领域着色）
      for (const p of f.pos) {
        const ang = Math.atan2(p.y, p.x);
        const hi = hovered && (p.node === hovered || f.center === hovered);
        ctx.strokeStyle = hi ? 'rgba(251,191,36,0.9)' : p.node.color + 'aa';
        ctx.lineWidth = (hi ? 3 : 2) / fv.k;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * centerR, Math.sin(ang) * centerR);
        ctx.lineTo(p.x - Math.cos(ang) * chipR, p.y - Math.sin(ang) * chipR);
        ctx.stroke();
      }
      // 中心节点（大芯片）
      const c = f.center;
      ctx.beginPath();
      ctx.arc(0, 0, centerR, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 4 / fv.k;
      ctx.strokeStyle = c.color;
      ctx.stroke();
      ctx.font = `${centerR * 0.95}px system-ui, 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.icon, 0, 2 / fv.k);
      // 名字（屏幕恒定字号，芯片下方）
      const cfs = 15 / Math.min(Math.max(fv.k, 0.8), 2.2);
      ctx.font = `700 ${cfs}px system-ui, 'PingFang SC', sans-serif`;
      ctx.fillStyle = '#334155';
      ctx.fillText(c.name, 0, centerR + cfs * 1.7);
      // 环绕节点（小芯片 + 下方名字）
      for (const p of f.pos) {
        const isHover = hovered === p.node;
        ctx.globalAlpha = 0.97;
        ctx.beginPath();
        ctx.arc(p.x, p.y, chipR, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2.5 / fv.k;
        ctx.strokeStyle = p.node.color;
        ctx.stroke();
        ctx.font = `${chipR * 0.92}px system-ui, 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif`;
        ctx.fillText(p.node.icon, p.x, p.y + 1 / fv.k);
        if (isHover) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3 / fv.k;
          ctx.beginPath();
          ctx.arc(p.x, p.y, chipR + 4 / fv.k, 0, Math.PI * 2);
          ctx.stroke();
        }
        const fs = 13 / Math.min(Math.max(fv.k, 0.8), 2.2);
        ctx.font = `${isHover ? 700 : 500} ${fs}px system-ui, 'PingFang SC', sans-serif`;
        ctx.fillStyle = isHover ? '#b45309' : '#475569';
        const tw = ctx.measureText(p.node.name).width;
        ctx.fillStyle = isHover ? 'rgba(254,243,199,0.95)' : 'rgba(255,255,255,0.88)';
        ctx.fillRect(p.x - tw / 2 - 6, p.y + chipR + 5 / fv.k, tw + 12, fs * 1.5);
        ctx.fillStyle = isHover ? '#92400e' : '#475569';
        ctx.fillText(p.node.name, p.x, p.y + chipR + 5 / fv.k + fs);
        ctx.globalAlpha = 1;
      }
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';
      ctx.restore();
    };

    /* —— 绘制循环 —— */
    const tick = () => {
      if (modeRef.current === 'global') simulate(1);
      const v = viewRef.current;
      ctx.clearRect(0, 0, W, H);
      if (modeRef.current === 'global') {
        ctx.save();
        ctx.translate(v.x, v.y);
        ctx.scale(v.k, v.k);
        drawGlobal();
        ctx.restore();
      } else {
        drawFocus();
      }

      // 悬浮卡片跟随
      const hoveredNow = hoverRef.current;
      if (hoveredNow) {
        let sx: number;
        let sy: number;
        let hr: number;
        if (modeRef.current === 'focus' && focusRef.current) {
          const fv = focusViewRef.current;
          if (focusRef.current.center === hoveredNow) {
            sx = fv.x; sy = fv.y; hr = Math.min(40, 52 / fv.k) * fv.k;
          } else {
            const p = focusRef.current.pos.find((q) => q.node === hoveredNow)!;
            sx = p.x * fv.k + fv.x;
            sy = p.y * fv.k + fv.y;
            hr = Math.min(24, 44 / fv.k) * fv.k;
          }
        } else {
          sx = hoveredNow.x * v.k + v.x;
          sy = hoveredNow.y * v.k + v.y;
          hr = drawR(hoveredNow) * v.k;
        }
        const cw = card.offsetWidth;
        const ch = card.offsetHeight;
        let left = sx + hr + 14;
        if (left + cw > W - 8) left = sx - hr - 14 - cw;
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
      if (modeRef.current === 'focus' && focusRef.current) {
        const fv = focusViewRef.current;
        const w = toFocusWorld(sx, sy);
        const chipR = Math.min(24, 44 / fv.k);
        const centerR = Math.min(40, 52 / fv.k);
        let best: GNode | null = null;
        let bestD = Infinity;
        const consider = (node: GNode, x: number, y: number, r: number) => {
          const d = Math.hypot(x - w.x, y - w.y);
          if (d < r + 8 / fv.k && d < bestD) { best = node; bestD = d; }
        };
        consider(focusRef.current.center, 0, 0, centerR);
        for (const p of focusRef.current.pos) consider(p.node, p.x, p.y, chipR);
        return { best, sx, sy };
      }
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
      dragRef.current.lx = sx;
      dragRef.current.ly = sy;
      dragRef.current.moved = false;
      if (modeRef.current === 'focus' && focusRef.current) {
        // 焦点模式：环绕节点可单独拖动；中心/空位整体平移
        if (best && best !== focusRef.current.center) dragRef.current.node = best;
        else dragRef.current.centerDrag = true;
        canvas.setPointerCapture(ev.pointerId);
        return;
      }
      if (best) dragRef.current.node = best;
      else dragRef.current.panning = true;
      canvas.setPointerCapture(ev.pointerId);
    };
    const onMove = (ev: PointerEvent) => {
      const dist = Math.hypot(ev.clientX - canvas.getBoundingClientRect().left - dragRef.current.lx, ev.clientY - canvas.getBoundingClientRect().top - dragRef.current.ly);
      if (dist > 4) dragRef.current.moved = true;
      const { best, sx, sy } = pick(ev);
      if (modeRef.current === 'global' && dragRef.current.node) {
        const w = toWorld(sx, sy);
        dragRef.current.node.x = w.x;
        dragRef.current.node.y = w.y;
        alpha = Math.min(0.3, Math.max(alpha, 0.15));
        return;
      }
      if (modeRef.current === 'focus' && focusRef.current) {
        const fv = focusViewRef.current;
        const dragging = dragRef.current.centerDrag || dragRef.current.panning;
        if (dragging) {
          // 拖动中心/空位：整体平移
          fv.x += sx - dragRef.current.lx;
          fv.y += sy - dragRef.current.ly;
          dragRef.current.lx = sx;
          dragRef.current.ly = sy;
          return;
        }
        if (dragRef.current.node) {
          // 拖动环绕节点：单独调整位置（连线实时跟随）
          const w = toFocusWorld(sx, sy);
          const p = focusRef.current.pos.find((q) => q.node === dragRef.current.node);
          if (p) { p.x = w.x; p.y = w.y; }
          dragRef.current.lx = sx;
          dragRef.current.ly = sy;
          return;
        }
        // 非拖动：不 return，落到下方悬停逻辑
      } else if (dragRef.current.panning) {
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
      }
      canvas.style.cursor = best ? 'pointer' : modeRef.current === 'focus' ? 'grab' : 'default';
    };
    const onUp = () => {
      if (dragRef.current.moved) suppressClickUntil = performance.now() + 350;
      dragRef.current.node = null;
      dragRef.current.panning = false;
      dragRef.current.centerDrag = false;
    };
    const onClick = (ev: MouseEvent) => {
      if (dragRef.current.moved || performance.now() < suppressClickUntil) { dragRef.current.moved = false; return; } // 拖动结束不触发点击（时间窗防双发）
      const { best } = pick(ev as unknown as PointerEvent);
      if (!best) return;
      if (modeRef.current === 'focus') {
        if (best === focusRef.current!.center) navigate(`/terms/${best.cat}/${best.id}`, { state: { from: 'graph' } });
        else enterFocus(best);
      } else {
        enterFocus(best);
      }
    };
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      // 光标锚定缩放：焦点模式与全局模式统一（焦点模式缩放展开间距，芯片 ≤ 44px）
      const tgt = modeRef.current === 'focus' ? focusViewRef.current : viewRef.current;
      const k2 = Math.min(modeRef.current === 'focus' ? 2.5 : 4, Math.max(0.35, tgt.k * (ev.deltaY < 0 ? 1.15 : 0.87)));
      const w = modeRef.current === 'focus'
        ? { x: (sx - tgt.x) / tgt.k, y: (sy - tgt.y) / tgt.k }
        : toWorld(sx, sy);
      tgt.k = k2;
      tgt.x = sx - w.x * k2;
      tgt.y = sy - w.y * k2;
      if (modeRef.current === 'global') alpha = Math.min(0.4, Math.max(alpha, 0.25));
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
      n.x = Math.cos(ang) * 640 + (i % 7) * 50 + (Math.random() - 0.5) * 180;
      n.y = Math.sin(ang) * 640 + (Math.random() - 0.5) * 180;
      n.vx = 0;
      n.vy = 0;
    });
    setHoverInfo(null);
    hoverRef.current = null;
    viewRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2, k: 1 };
    simulateRef.current?.(320);
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
        {/* 焦点模式：返回全局 */}
        {focusName && (
          <button
            onClick={() => exitFocusRef.current()}
            className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-night-600 bg-night-900/90 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur hover:border-quest-500/50"
          >
            <ArrowLeft size={13} /> 返回全局视图
          </button>
        )}
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
              <div className="mt-2 text-center text-[10px] text-quest-400">
                {focusName ? '点击环绕节点切换焦点 · 点击中心查看详情 →' : '点击节点展开关系结构 →'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
