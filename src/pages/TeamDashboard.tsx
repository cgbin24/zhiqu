import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Maximize2, Minimize2, Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { createTeamEngine, type TeamEvent, type TeamMessage, type TeamSetup } from '@/judge/team-sim';
import { TEAM_SCENARIOS } from '@/data/agentdev/team-scenarios';

/**
 * 团队指挥室 —— Agent 团队全屏可视化大屏（流程流图版）。
 *
 * 核心是一张**角色节点 + 传递线路**的流程图：PM 在左、执行角色居中、评审在右、
 * 护栏守在一角；每次派工 / 提交评审 / 打回 / 阻塞 / 升级 / 越权，都会在对应的
 * 线路上触发一次**飞行光点脉冲**，线路点亮、中点浮出任务标签 —— 数据与任务的
 * 流向一眼可读。内核与「Agent 团队搭建与治理」关卡同一引擎（单一数据源），
 * 回放是纯派生：deriveAt(events, cursor) 推出节点/线路状态，播放只是移动游标。
 */

/* ---------------- 回放派生 ---------------- */

interface TaskView { state: string; assignee: string | null }
interface Derived {
  tasks: Record<string, TaskView>;
  lastAssignee: Record<string, string | null>;
  roleBusy: Record<string, string | null>;
  messages: TeamMessage[];
  intercepted: number;
  breaches: number;
  escalations: number;
  current: TeamEvent | null;
  finished: boolean;
  deadlocked: boolean;
}

function deriveAt(events: TeamEvent[], messages: TeamMessage[], upto: number): Derived {
  const tasks: Record<string, TaskView> = {};
  const lastAssignee: Record<string, string | null> = {};
  const roleBusy: Record<string, string | null> = {};
  let intercepted = 0;
  let breaches = 0;
  let escalations = 0;
  const shown = events.slice(0, upto);
  for (const e of shown) {
    if (e.taskId && !tasks[e.taskId]) tasks[e.taskId] = { state: 'todo', assignee: null };
    switch (e.kind) {
      case 'assign':
      case 'start':
        if (e.taskId) {
          tasks[e.taskId] = { state: 'in_progress', assignee: e.roleId ?? null };
          lastAssignee[e.taskId] = e.roleId ?? null;
        }
        if (e.roleId) roleBusy[e.roleId] = e.taskId ?? null;
        break;
      case 'submit':
        if (e.taskId) tasks[e.taskId] = { state: 'review', assignee: tasks[e.taskId]?.assignee ?? e.roleId ?? null };
        break;
      case 'review-fail':
        if (e.taskId) tasks[e.taskId] = { state: 'in_progress', assignee: tasks[e.taskId]?.assignee ?? null };
        break;
      case 'done':
        if (e.taskId) tasks[e.taskId] = { state: 'done', assignee: null };
        if (e.roleId) roleBusy[e.roleId] = null;
        break;
      case 'block':
        if (e.taskId) tasks[e.taskId] = { state: 'blocked', assignee: e.roleId ?? null };
        if (e.roleId) roleBusy[e.roleId] = null;
        break;
      case 'retry':
        if (e.taskId) tasks[e.taskId] = { state: 'todo', assignee: null };
        break;
      case 'escalate':
        escalations++;
        if (e.taskId) tasks[e.taskId] = { state: 'todo', assignee: null };
        break;
      case 'violation':
        if (e.intercepted) intercepted++; else breaches++;
        break;
      case 'deadlock':
        return {
          tasks, lastAssignee, roleBusy,
          messages: messages.filter((m) => m.tick <= (e.tick ?? 0)),
          intercepted, breaches, escalations,
          current: e, finished: true, deadlocked: true,
        };
      case 'complete':
        return {
          tasks, lastAssignee, roleBusy,
          messages: messages.filter((m) => m.tick <= (e.tick ?? 0)),
          intercepted, breaches, escalations,
          current: e, finished: true, deadlocked: false,
        };
      default:
        break;
    }
  }
  const last = shown[shown.length - 1] ?? null;
  return {
    tasks,
    lastAssignee,
    roleBusy,
    messages: messages.filter((m) => m.tick <= (last?.tick ?? 0)),
    intercepted, breaches, escalations,
    current: last,
    finished: false,
    deadlocked: false,
  };
}

/* ---------------- 流图布局 ---------------- */

interface GraphNode {
  id: string;
  name: string;
  kind: 'planner' | 'worker' | 'reviewer' | 'guardrail';
  skills: string[];
  x: number;
  y: number;
}

const GW = 900;
const GH = 430;

function layoutGraph(roleList: { id: string; name: string; skills: string[] }[], whitelistOn: boolean) {
  const planner = roleList.find((r) => r.skills.includes('plan'));
  const reviewer = roleList.find((r) => r.skills.includes('review'));
  const workers = roleList.filter((r) => r !== planner && r !== reviewer);
  const nodes: GraphNode[] = [];
  const P = { x: 130, y: GH / 2 };
  const R = { x: GW - 130, y: GH / 2 };
  const W = { x: GW / 2, y: 0 };
  if (planner) nodes.push({ ...planner, kind: 'planner', x: P.x, y: P.y });
  const n = workers.length;
  workers.forEach((r, i) => {
    const y = n === 1 ? GH / 2 : 62 + (i * (GH - 124)) / (n - 1);
    nodes.push({ ...r, kind: 'worker', x: W.x, y });
  });
  if (reviewer) nodes.push({ ...reviewer, kind: 'reviewer', x: R.x, y: R.y });
  nodes.push({ id: 'guardrail', name: whitelistOn ? '🛡 护栏' : '⚠ 护栏(关)', kind: 'guardrail', skills: [], x: R.x + 8, y: 52 });
  return { nodes, plannerId: planner?.id ?? null, reviewerId: reviewer?.id ?? null };
}

/** 贝塞尔曲线：带垂直偏移的弓形，正反方向不重叠 */
function edgePath(a: GraphNode, b: GraphNode, bow: number): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.max(Math.hypot(dx, dy), 1);
  const nx = -dy / len;
  const ny = dx / len;
  const c1x = a.x + dx * 0.3 + nx * bow;
  const c1y = a.y + dy * 0.3 + ny * bow;
  const c2x = a.x + dx * 0.7 + nx * bow;
  const c2y = a.y + dy * 0.7 + ny * bow;
  return `M ${a.x} ${a.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${b.x} ${b.y}`;
}

/** 三次贝塞尔中点（标签定位用） */
function bezierMid(a: GraphNode, b: GraphNode, bow: number): { x: number; y: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.max(Math.hypot(dx, dy), 1);
  const nx = -dy / len;
  const ny = dx / len;
  const c1 = { x: a.x + dx * 0.3 + nx * bow, y: a.y + dy * 0.3 + ny * bow };
  const c2 = { x: a.x + dx * 0.7 + nx * bow, y: a.y + dy * 0.7 + ny * bow };
  return {
    x: (a.x + 3 * c1.x + 3 * c2.x + b.x) / 8,
    y: (a.y + 3 * c1.y + 3 * c2.y + b.y) / 8,
  };
}

const EDGE_BOW: Record<string, number> = {
  'planner->worker': 26,
  'worker->planner': -26,
  'worker->reviewer': 20,
  'reviewer->planner': -120,
  'guardrail->planner': -60,
};

/** 按节点"类型对"解析线路类型（EDGE_BOW / 连线样式的键）—— 与具体角色 id 无关 */
function pairType(kindA: string, kindB: string): string | null {
  const pair = `${kindA}->${kindB}`;
  return pair in EDGE_BOW ? pair : null;
}

const EDGE_COLOR: Record<string, string> = {
  assign: '#38bdf8',
  start: '#38bdf8',
  submit: '#22d3ee',
  'review-pass': '#34d399',
  'review-fail': '#fbbf24',
  done: '#10b981',
  block: '#f97316',
  retry: '#facc15',
  escalate: '#e879f9',
  violation: '#f87171',
};

const EDGE_LABEL: Record<string, string> = {
  assign: '派工', start: '开工', submit: '提交评审', 'review-pass': '评审通过',
  'review-fail': '打回返工', done: '交付验收', block: '阻塞上报', retry: '重新入队',
  escalate: '升级解除', violation: '越权告警',
};

/* ---------------- 事件 → 线路解析 ---------------- */

function resolveEdge(
  e: TeamEvent,
  layout: ReturnType<typeof layoutGraph>,
  lastAssignee: Record<string, string | null>,
): { key: string; from: string; to: string; type: string } | null {
  const { plannerId, reviewerId } = layout;
  const worker = lastAssignee[e.taskId ?? ''] ?? e.roleId ?? null;
  const kindOf = (id: string | null) => layout.nodes.find((n) => n.id === id)?.kind ?? '';
  const make = (from: string | null, to: string | null) => {
    if (!from || !to) return null;
    const type = pairType(kindOf(from), kindOf(to));
    return type ? { key: `${from}->${to}`, from, to, type } : null;
  };
  switch (e.kind) {
    case 'assign':
    case 'start':
      return make(plannerId, e.roleId ?? null);
    case 'submit':
      return make(worker, reviewerId);
    case 'review-pass':
      return make(reviewerId, plannerId);
    case 'review-fail':
      return make(reviewerId, worker);
    case 'block':
      return make(worker, plannerId);
    case 'retry':
      return make(plannerId, worker);
    case 'escalate':
      return make(plannerId, worker);
    case 'violation':
      return make('guardrail', plannerId);
    case 'done':
      return make(worker, plannerId);
    default:
      return null;
  }
}

/* ---------------- 视觉常量 ---------------- */

const STATE_LABEL: Record<string, string> = { todo: '待办', in_progress: '进行中', review: '评审', blocked: '阻塞', done: '已完成' };
const STATE_CHIP: Record<string, string> = {
  todo: 'border-night-600 text-slate-500',
  in_progress: 'border-sky-500/50 text-sky-300',
  review: 'border-cyan-500/50 text-cyan-300',
  blocked: 'border-orange-500/60 text-orange-300',
  done: 'border-emerald-500/50 text-emerald-300',
};

const KIND_STYLE: Record<string, { icon: string; cls: string }> = {
  assign: { icon: '👉', cls: 'text-sky-300 border-sky-500/30 bg-sky-500/5' },
  start: { icon: '▶', cls: 'text-sky-200 border-sky-500/30 bg-sky-500/5' },
  submit: { icon: '📤', cls: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/5' },
  'review-pass': { icon: '✓', cls: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/5' },
  'review-fail': { icon: '✗', cls: 'text-amber-300 border-amber-500/30 bg-amber-500/5' },
  done: { icon: '✔', cls: 'text-emerald-200 border-emerald-500/40 bg-emerald-500/10' },
  block: { icon: '⏸', cls: 'text-orange-300 border-orange-500/40 bg-orange-500/10' },
  retry: { icon: '↻', cls: 'text-yellow-300 border-yellow-500/30 bg-yellow-500/5' },
  escalate: { icon: '⇡', cls: 'text-fuchsia-300 border-fuchsia-500/40 bg-fuchsia-500/10' },
  violation: { icon: '⚠', cls: 'text-red-300 border-red-500/40 bg-red-500/10' },
  'config-error': { icon: '🔧', cls: 'text-slate-300 border-slate-500/30 bg-slate-500/5' },
  deadlock: { icon: '☠', cls: 'text-red-200 border-red-500/60 bg-red-500/15' },
  complete: { icon: '🏁', cls: 'text-emerald-200 border-emerald-400/60 bg-emerald-500/15' },
};

const ROLE_HUE = ['#7c5cf0', '#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#22d3ee', '#a3e635', '#fb923c'];

/* ---------------- 页面 ---------------- */

export function TeamDashboard() {
  const [scenarioId, setScenarioId] = useState(TEAM_SCENARIOS[0].id);
  const scenario = TEAM_SCENARIOS.find((s) => s.id === scenarioId) ?? TEAM_SCENARIOS[0];

  const [onBlock, setOnBlock] = useState<'escalate' | 'retry' | 'ignore'>('escalate');
  const [maxRetries, setMaxRetries] = useState(2);
  const [toolWhitelist, setToolWhitelist] = useState(true);
  const [requireReview, setRequireReview] = useState(true);
  const [stale, setStale] = useState(false);

  const [run, setRun] = useState<{ events: TeamEvent[]; messages: TeamMessage[]; summary: { ticks: number } } | null>(null);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  const setup: TeamSetup = useMemo(() => ({
    ...scenario.defaultSetup,
    guardrails: { toolWhitelist, requireReview },
    policy: { onBlock, maxRetries },
  }), [scenario, toolWhitelist, requireReview, onBlock, maxRetries]);

  const doRun = () => {
    const engine = createTeamEngine(scenario.project);
    const r = engine.run(setup);
    setRun(r);
    setCursor(0);
    setPlaying(true);
    setStale(false);
  };

  const resetAll = () => { setRun(null); setCursor(0); setPlaying(false); setStale(false); };
  const markStale = () => { setStale(true); };

  useEffect(() => {
    if (!playing || !run) return;
    if (cursor >= run.events.length) { setPlaying(false); return; }
    const t = setTimeout(() => setCursor((c) => Math.min(c + 1, run.events.length)), Math.max(120, 820 / speed));
    return () => clearTimeout(t);
  }, [playing, cursor, speed, run]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shellRef.current?.requestFullscreen();
    } catch { /* 忽略不支持的环境 */ }
  };

  const derived = run ? deriveAt(run.events, run.messages, cursor) : null;

  /* 流图布局与线路状态（随游标派生） */
  const layout = useMemo(
    () => layoutGraph(scenario.defaultSetup.roles, toolWhitelist),
    [scenario, toolWhitelist],
  );

  const edgeFlow = useMemo(() => {
    if (!derived || !run) return { usage: {} as Record<string, number>, active: null as null | { key: string; type: string; kind: string; taskId?: string } };
    const usage: Record<string, number> = {};
    let active: { key: string; type: string; kind: string; taskId?: string } | null = null;
    for (let i = 0; i < cursor; i++) {
      const e = run.events[i];
      const edge = resolveEdge(e, layout, derived.lastAssignee);
      if (edge) usage[edge.key] = (usage[edge.key] ?? 0) + 1;
      if (i === cursor - 1 && edge) active = { key: edge.key, type: edge.type, kind: e.kind, taskId: e.taskId };
    }
    return { usage, active };
  }, [derived, run, cursor, layout]);

  const stats = useMemo(() => {
    if (!derived || !run) return null;
    const counts: Record<string, number> = { todo: 0, in_progress: 0, review: 0, blocked: 0, done: 0 };
    for (const t of scenario.project.tasks) {
      const st = derived.tasks[t.id]?.state ?? 'todo';
      counts[st] = (counts[st] ?? 0) + 1;
    }
    return counts;
  }, [derived, run, scenario]);

  const nodeById = (id: string | null | undefined) => layout.nodes.find((n) => n.id === id);
  const progressPct = run ? Math.round((cursor / Math.max(run.events.length, 1)) * 100) : 0;

  /* 当前活跃节点（当前事件涉及的 roleId / lastAssignee） */
  const activeNodeIds = useMemo(() => {
    if (!derived?.current) return new Set<string>();
    const e = derived.current;
    const ids = new Set<string>();
    if (e.roleId) ids.add(e.roleId);
    const w = derived.lastAssignee[e.taskId ?? ''];
    if (w) ids.add(w);
    return ids;
  }, [derived]);

  return (
    <div
      ref={shellRef}
      className={`relative flex flex-col gap-3 rounded-2xl border border-quest-500/25 bg-night-950 p-4 text-slate-200 shadow-[0_0_40px_rgba(124,92,240,0.12)] ${fullscreen ? 'h-screen overflow-y-auto' : ''}`}
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,92,240,0.14), transparent), repeating-linear-gradient(0deg, rgba(148,163,184,0.045) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, rgba(148,163,184,0.045) 0 1px, transparent 1px 28px)',
      }}
    >
      {/* 顶栏 */}
      <div className="flex flex-wrap items-center gap-2">
        <Link to="/" className="flex items-center gap-1 rounded-lg border border-night-700 bg-night-900 px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:text-slate-200">
          <ChevronLeft size={14} /> 返回
        </Link>
        <h1 className="text-lg font-black tracking-wider text-quest-300 drop-shadow-[0_0_10px_rgba(124,92,240,0.6)]">
          🛰 AGENT 团队指挥中心
        </h1>
        <span className="rounded-md border border-quest-500/30 bg-quest-500/10 px-2 py-0.5 text-[10px] font-bold text-quest-300">
          任务流向流图 · 与团队关卡同一引擎
        </span>
        <div className="flex-1" />
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1 rounded-lg border border-night-600 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-quest-500/50 hover:text-quest-300"
          title={fullscreen ? '退出全屏' : '全屏大屏模式'}
        >
          {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />} {fullscreen ? '退出全屏' : '全屏'}
        </button>
      </div>

      {/* 场景 + 管理策略 + 控制 */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-night-700 bg-night-900/80 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">项目场景</span>
        {TEAM_SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => { setScenarioId(s.id); resetAll(); }}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
              s.id === scenarioId ? 'border-quest-500/60 bg-quest-500/15 text-quest-300' : 'border-night-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {s.name}
          </button>
        ))}
        <div className="mx-1 h-5 w-px bg-night-700" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">管理策略</span>
        <button
          onClick={() => { setToolWhitelist(!toolWhitelist); markStale(); }}
          className={`rounded-lg border px-2 py-1 text-xs font-semibold transition-all ${
            toolWhitelist ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-red-500/50 bg-red-500/10 text-red-300'
          }`}
          title="工具白名单护栏：开启后越权工具调用被当场拦截"
        >
          {toolWhitelist ? '🛡 工具护栏 开' : '⚠ 工具护栏 关'}
        </button>
        <button
          onClick={() => { setRequireReview(!requireReview); markStale(); }}
          className={`rounded-lg border px-2 py-1 text-xs font-semibold transition-all ${
            requireReview ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-red-500/50 bg-red-500/10 text-red-300'
          }`}
          title="评审闸门：开启后所有任务必须过评审才能交付"
        >
          {requireReview ? '✓ 评审闸门 开' : '✗ 评审闸门 关'}
        </button>
        <span className="text-[10px] text-slate-500">阻塞策略</span>
        {(['escalate', 'retry', 'ignore'] as const).map((p) => (
          <button
            key={p}
            onClick={() => { setOnBlock(p); markStale(); }}
            className={`rounded-lg border px-2 py-1 text-xs font-semibold transition-all ${
              onBlock === p ? 'border-quest-500/60 bg-quest-500/15 text-quest-300' : 'border-night-700 text-slate-400 hover:text-slate-200'
            }`}
            title={p === 'escalate' ? '阻塞直报 PM 解除（有出口）' : p === 'retry' ? '先重试，耗尽后升级（仍有出口）' : '无人处理 —— 将死锁（反面教材）'}
          >
            {p === 'escalate' ? '⇡ 升级' : p === 'retry' ? '↻ 重试' : '☠ 忽略'}
          </button>
        ))}
        {onBlock === 'retry' && (
          <>
            <span className="text-[10px] text-slate-500">重试上限</span>
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => { setMaxRetries(num); markStale(); }}
                className={`rounded-md px-1.5 py-1 font-mono text-[11px] font-bold transition-colors ${
                  maxRetries === num ? 'bg-quest-500/20 text-quest-300' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {num}次
              </button>
            ))}
          </>
        )}
        <div className="flex-1" />
        {stale && <span className="text-[10px] font-semibold text-amber-300">策略已修改，请重新运行</span>}
        <button onClick={run ? resetAll : doRun} className="rounded-lg border border-night-600 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:text-slate-100">
          <RotateCcw size={12} className="mr-1 inline" />重置
        </button>
        <button
          onClick={doRun}
          className="rounded-lg bg-gradient-to-r from-quest-500 to-fuchsia-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-quest-500/25 transition-all hover:brightness-110"
        >
          ▶ 运行团队
        </button>
      </div>

      {!run ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-night-700 text-center">
          <div className="text-4xl">🛰</div>
          <p className="text-sm text-slate-400">
            选择项目场景 → 调整管理策略 → 点「运行团队」，在流图上观看 {scenario.project.tasks.length} 项任务如何沿传递线路流向交付
          </p>
          <p className="max-w-md text-xs leading-relaxed text-slate-600">{scenario.desc}</p>
        </div>
      ) : (
        <>
          {/* 统计条 */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {[
              { label: '完成', value: `${stats?.done ?? 0}/${scenario.project.tasks.length}`, cls: 'text-emerald-300 border-emerald-500/30' },
              { label: '进行中', value: stats?.in_progress ?? 0, cls: 'text-sky-300 border-sky-500/30' },
              { label: '阻塞', value: stats?.blocked ?? 0, cls: 'text-orange-300 border-orange-500/30' },
              { label: '拦截', value: derived?.intercepted ?? 0, cls: 'text-amber-300 border-amber-500/30' },
              { label: '升级', value: derived?.escalations ?? 0, cls: 'text-fuchsia-300 border-fuchsia-500/30' },
              { label: '拍数', value: `${derived?.current?.tick ?? 0}/${run.summary.ticks}`, cls: 'text-quest-300 border-quest-500/30' },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border bg-night-900/80 px-3 py-2 text-center ${s.cls}`}>
                <div className="font-mono text-xl font-black leading-tight">{s.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ===== 流程流图（核心面板） ===== */}
          <div className="rounded-xl border border-night-700 bg-night-900/70 p-2">
            <svg viewBox={`0 0 ${GW} ${GH}`} className="w-full" style={{ maxHeight: '52vh' }}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke="rgba(148,163,184,0.7)" strokeWidth="1.6" />
                </marker>
                <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </marker>
              </defs>

              {/* 基础线路（结构边） */}
              {layout.nodes.flatMap((a) => {
                const out: React.ReactNode[] = [];
                for (const b of layout.nodes) {
                  const type = pairType(a.kind, b.kind);
                  if (!type) continue;
                  const bow = EDGE_BOW[type];
                  const key = `${a.id}->${b.id}`;
                  const d = edgePath(a, b, bow);
                  const used = edgeFlow.usage[key] ?? 0;
                  const isActive = edgeFlow.active?.key === key;
                  const color = isActive ? (EDGE_COLOR[edgeFlow.active!.kind] ?? '#38bdf8') : 'rgba(148,163,184,1)';
                  out.push(
                    <g key={key} style={isActive ? { color } : undefined}>
                      {isActive && <path d={d} stroke={color} strokeWidth={7} fill="none" opacity={0.22} strokeLinecap="round" />}
                      <path
                        d={d}
                        fill="none"
                        stroke={color}
                        strokeOpacity={isActive ? 0.95 : Math.min(0.18 + used * 0.09, 0.6)}
                        strokeWidth={isActive ? 2.4 : 1.5}
                        markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow)'}
                        strokeDasharray={a.kind === 'guardrail' || b.kind === 'guardrail' ? '6 5' : undefined}
                      />
                    </g>,
                  );
                }
                return out;
              })}

              {/* 飞行脉冲光点（沿当前事件线路运动） */}
              {edgeFlow.active && (() => {
                const parts = edgeFlow.active.key.split('->');
                const a = nodeById(parts[0]);
                const b = nodeById(parts[1]);
                if (!a || !b) return null;
                const bow = EDGE_BOW[edgeFlow.active.type] ?? 0;
                const d = edgePath(a, b, bow);
                const color = EDGE_COLOR[edgeFlow.active.kind] ?? '#38bdf8';
                const mid = bezierMid(a, b, bow);
                return (
                  <g key={cursor}>
                    <circle r={5.5} fill={color} opacity={0.95}>
                      <animateMotion dur="0.72s" fill="freeze" path={d} />
                    </circle>
                    <circle r={10} fill={color} opacity={0.25}>
                      <animateMotion dur="0.72s" fill="freeze" path={d} />
                    </circle>
                    {/* 任务流向标签（线路中点） */}
                    {edgeFlow.active.taskId && (
                      <g>
                        <rect
                          x={mid.x - 44} y={mid.y - 13} width={88} height={24} rx={7}
                          fill="rgba(2,6,17,0.92)" stroke={color} strokeWidth={1.2}
                        />
                        <text x={mid.x} y={mid.y + 4} textAnchor="middle" fontSize={12} fill={color} fontWeight="700">
                          {KIND_STYLE[edgeFlow.active.kind]?.icon ?? ''} {edgeFlow.active.taskId} {EDGE_LABEL[edgeFlow.active.kind] ?? ''}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })()}

              {/* 角色节点 */}
              {layout.nodes.map((n2, i) => {
                const hue = n2.kind === 'guardrail' ? '#f87171' : ROLE_HUE[i % ROLE_HUE.length];
                const busyTask = n2.kind !== 'guardrail' ? (derived?.roleBusy[n2.id] ?? null) : null;
                const busyState = busyTask ? derived?.tasks[busyTask]?.state : null;
                const working = busyState === 'in_progress' || busyState === 'review';
                const isActiveNode = activeNodeIds.has(n2.id);
                const isAlert = n2.kind === 'guardrail' && edgeFlow.active?.kind === 'violation';
                const w2 = n2.kind === 'guardrail' ? 96 : 128;
                const h2 = n2.kind === 'guardrail' ? 34 : 52;
                return (
                  <g key={n2.id} transform={`translate(${n2.x - w2 / 2}, ${n2.y - h2 / 2})`}>
                    {working && <rect width={w2} height={h2} rx={12} fill="none" stroke={hue} strokeWidth={2.5} opacity={0.5} className="animate-pulse" />}
                    <rect
                      width={w2} height={h2} rx={12}
                      fill="rgba(2,6,17,0.92)"
                      stroke={isAlert ? '#f87171' : isActiveNode ? hue : 'rgba(100,116,139,0.55)'}
                      strokeWidth={isAlert || isActiveNode ? 2.2 : 1.3}
                    />
                    <text x={w2 / 2} y={n2.kind === 'guardrail' ? 21 : 20} textAnchor="middle" fontSize={n2.kind === 'guardrail' ? 11 : 12.5} fontWeight={700} fill={hue}>
                      {n2.name}
                    </text>
                    {n2.kind !== 'guardrail' && (
                      <>
                        <text x={w2 / 2} y={37} textAnchor="middle" fontSize={10} fill={busyTask ? '#93c5fd' : '#64748b'}>
                          {busyTask ? `${busyState === 'review' ? '待评审' : '执行中'} · ${busyTask}` : '空闲'}
                        </text>
                        <text x={w2 / 2} y={49} textAnchor="middle" fontSize={9} fill="#475569">
                          {n2.skills.join(' / ')}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}

              {/* 死锁/完成全图效果 */}
              {derived?.deadlocked && (
                <text x={GW / 2} y={26} textAnchor="middle" fontSize={17} fontWeight={800} fill="#f87171">☠ 流程死锁 —— 线路已停摆</text>
              )}
              {derived?.finished && !derived.deadlocked && (
                <text x={GW / 2} y={26} textAnchor="middle" fontSize={17} fontWeight={800} fill="#34d399">🏁 全部交付</text>
              )}
            </svg>

            {/* 图例 */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 px-2 pb-1 text-[10px] text-slate-500">
              {Object.entries(EDGE_LABEL).map(([k, label]) => (
                <span key={k} className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-4 rounded-full" style={{ background: EDGE_COLOR[k] }} />
                  {label}
                </span>
              ))}
            </div>

            {/* 任务状态条（流图下的快速一览） */}
            <div className="flex flex-wrap gap-1.5 px-2 pb-1">
              {scenario.project.tasks.map((t) => {
                const st = derived?.tasks[t.id]?.state ?? 'todo';
                const asg = derived?.tasks[t.id]?.assignee;
                return (
                  <span key={t.id} className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-bold ${STATE_CHIP[st]}`} title={`${t.title} · ${STATE_LABEL[st]}${asg ? ' · ' + (nodeById(asg)?.name ?? asg) : ''}`}>
                    {t.id} {STATE_LABEL[st]}{asg ? `(${nodeById(asg)?.name ?? asg})` : ''}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 终局横幅 */}
          {derived?.finished && (
            <div className={`rounded-xl border px-4 py-2.5 text-center text-sm font-bold ${
              derived.deadlocked
                ? 'border-red-500/60 bg-red-500/15 text-red-300 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
                : 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
            }`}>
              {derived.deadlocked
                ? '☠ 流程死锁 —— 阻塞没有出口。切换阻塞策略为「升级」或「重试」后重新运行。'
                : '🏁 项目全部交付 —— 护栏拦截 ' + (derived.intercepted ?? 0) + ' 次越权，升级 ' + (derived.escalations ?? 0) + ' 次，流程有条不紊。'}
            </div>
          )}

          {/* 时间轴 + 消息流 */}
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="rounded-xl border border-night-700 bg-night-900/80 p-3 lg:col-span-8">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">🎬 执行时间轴</span>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  disabled={Boolean(derived?.finished)}
                  className="flex items-center gap-1 rounded-lg border border-quest-500/40 bg-quest-500/10 px-2.5 py-1 text-xs font-bold text-quest-300 transition-colors hover:bg-quest-500/20 disabled:opacity-40"
                >
                  {playing ? <Pause size={12} /> : <Play size={12} />} {playing ? '暂停' : '播放'}
                </button>
                <button
                  onClick={() => { setPlaying(false); setCursor((c) => Math.min(c + 1, run.events.length)); }}
                  disabled={Boolean(derived?.finished)}
                  className="flex items-center gap-1 rounded-lg border border-night-600 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:text-slate-100 disabled:opacity-40"
                >
                  <StepForward size={12} /> 单步
                </button>
                {[0.5, 1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`rounded-md px-1.5 py-1 font-mono text-[11px] font-bold transition-colors ${
                      speed === s ? 'bg-quest-500/20 text-quest-300' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {s}×
                  </button>
                ))}
                <div className="flex-1" />
                <div className="h-1.5 w-36 overflow-hidden rounded-full bg-night-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-quest-500 to-fuchsia-400 transition-all" style={{ width: progressPct + '%' }} />
                </div>
                <span className="font-mono text-[10px] text-slate-500">{cursor}/{run.events.length}</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {run.events.map((e, i) => {
                  const st = KIND_STYLE[e.kind] ?? KIND_STYLE.assign;
                  const active = i < cursor;
                  return (
                    <button
                      key={i}
                      onClick={() => { setPlaying(false); setCursor(i + 1); }}
                      title={e.text}
                      className={`shrink-0 rounded-md border px-1.5 py-1 font-mono text-[10px] transition-all ${
                        active ? st.cls : 'border-night-700 bg-night-850 text-slate-600'
                      } ${i === cursor - 1 ? 'scale-110 ring-1 ring-quest-400/60' : ''}`}
                    >
                      {st.icon}<span className="ml-0.5">{e.tick}</span>
                    </button>
                  );
                })}
              </div>
              {derived?.current && (
                <div className={`mt-2 rounded-lg border px-3 py-2 text-xs ${KIND_STYLE[derived.current.kind]?.cls ?? 'border-night-700 bg-night-850 text-slate-300'}`}>
                  <span className="mr-2 font-mono text-[10px] font-bold text-slate-500">拍 {derived.current.tick}</span>
                  {derived.current.text}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-night-700 bg-night-900/80 p-3 lg:col-span-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">✉ 协作消息流</span>
                <span className="font-mono text-[10px] text-slate-600">{derived?.messages.length ?? 0} 条</span>
              </div>
              <div className="flex max-h-[240px] flex-col gap-1.5 overflow-y-auto">
                {(derived?.messages ?? []).slice(-30).reverse().map((m, i) => (
                  <div key={i} className="rounded-lg border border-night-700 bg-night-850 px-2 py-1.5">
                    <div className="flex items-center gap-1 text-[9px] font-bold">
                      <span className="text-quest-300">{nodeById(m.from)?.name ?? m.from}</span>
                      <span className="text-slate-600">→</span>
                      <span className="text-sky-300">{nodeById(m.to)?.name ?? m.to}</span>
                      <span className="ml-auto font-mono text-slate-600">拍{m.tick}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] leading-tight text-slate-400">{m.text}</div>
                  </div>
                ))}
                {(derived?.messages.length ?? 0) === 0 && (
                  <div className="py-6 text-center text-xs italic text-slate-600">尚无消息</div>
                )}
              </div>
            </div>
          </div>

          {/* 配套关卡入口 */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>想自己搭一支这样的团队？配套关卡：</span>
            {[
              ['agentdev-best-5', '组建团队'],
              ['agentdev-best-6', '依赖并行'],
              ['agentdev-best-7', '评审闸门'],
              ['agentdev-best-8', '工具护栏'],
              ['agentdev-best-9', '防卡死策略'],
              ['agentdev-integration-5', '毕业演练'],
            ].map(([id, label]) => (
              <Link key={id} to={`/level/${id}`} className="rounded-md border border-night-700 px-2 py-0.5 text-quest-300/80 transition-colors hover:border-quest-500/40 hover:text-quest-300">
                {label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
