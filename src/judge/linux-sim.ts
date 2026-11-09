/**
 * Linux 命令模拟器 —— Linux 课程的本地判题引擎。
 * 在内存中维护一棵虚拟文件树，支持常用命令、管道与重定向。
 * 这仅是教学用模拟（语义简化），非真实 Shell。
 */

export interface FsNode {
  type: 'dir' | 'file';
  children?: Record<string, FsNode>;
  content?: string;
  mode?: string;
}

export interface FsState {
  root: FsNode;
  cwd: string; // 绝对路径
  user: string;
  /** 系统级状态（ps/df/free/netstat 等命令的数据源），由场景 JSON 的 system 字段注入 */
  system: Record<string, unknown>;
}

export function makeDir(children: Record<string, FsNode> = {}): FsNode {
  return { type: 'dir', children };
}

export function makeFile(content = ''): FsNode {
  return { type: 'file', content };
}

/** 将场景树挂载到 cwd 路径下：fs JSON 的 tree 描述的是 cwd 目录的内容，root 代表文件系统根 '/' */
function mountTree(cwd: string, tree: FsNode): FsNode {
  const root: FsNode = makeDir();
  let cur = root;
  const parts = cwd.split('/').filter((x) => x !== '' && x !== '.' && x !== '..');
  for (const part of parts) {
    const next: FsNode = makeDir();
    cur.children![part] = next;
    cur = next;
  }
  cur.children = tree.type === 'dir' ? (tree.children ?? {}) : {};
  return root;
}

/** 从 JSON 字符串初始化（{cwd, tree}） */
export function initFs(json: string): FsState {
  try {
    const parsed = JSON.parse(json) as { cwd?: string; tree?: FsNode; system?: Record<string, unknown> };
    const cwd = parsed.cwd ?? '/home/student';
    return {
      root: mountTree(cwd, parsed.tree ?? makeDir()),
      cwd,
      user: 'student',
      system: parsed.system ?? {},
    };
  } catch {
    return { root: mountTree('/home/student', makeDir()), cwd: '/home/student', user: 'student', system: {} };
  }
}

/* ---------------- 路径工具 ---------------- */

function splitPath(p: string): string[] {
  return p.split('/').filter((x) => x !== '' && x !== '.');
}

function normalize(cwd: string, p: string): string {
  const abs = p.startsWith('/') ? p : `${cwd}/${p}`;
  const out: string[] = [];
  for (const part of splitPath(abs)) {
    if (part === '..') out.pop();
    else if (part === '~') continue;
    else out.push(part);
  }
  return '/' + out.join('/');
}

function getNode(fs: FsState, p: string): FsNode | null {
  const parts = splitPath(p);
  let node: FsNode = fs.root;
  for (const part of parts) {
    if (node.type !== 'dir' || !node.children?.[part]) return null;
    node = node.children[part];
  }
  return node;
}

function getParent(fs: FsState, p: string): { parent: FsNode | null; name: string } {
  const parts = splitPath(p);
  const name = parts.pop() ?? '';
  let node: FsNode = fs.root;
  for (const part of parts) {
    if (node.type !== 'dir' || !node.children?.[part]) return { parent: null, name };
    node = node.children[part];
  }
  return { parent: node, name };
}

/* ---------------- 输出与解析 ---------------- */

function tokenize(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quote: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ' ') {
      if (cur) { out.push(cur); cur = ''; }
    } else if (ch === '>' || ch === '<' || ch === '|') {
      if (ch === '>' && line[i + 1] === '>') {
        if (cur) { out.push(cur); cur = ''; }
        out.push('>>');
        i++;
      } else {
        if (cur) { out.push(cur); cur = ''; }
        out.push(ch);
      }
    } else {
      cur += ch;
    }
  }
  if (cur) out.push(cur);
  return out;
}

/* ---------------- 各命令实现（返回 stdout） ---------------- */

interface Ctx {
  fs: FsState;
  stdin: string;
}

function cmdLs(ctx: Ctx, args: string[]): string {
  const flags = args.filter((a) => a.startsWith('-')).join('');
  const target = args.find((a) => !a.startsWith('-')) ?? ctx.fs.cwd;
  const p = normalize(ctx.fs.cwd, target);
  const node = getNode(ctx.fs, p);
  if (!node) return `ls: 无法访问 '${target}': 没有那个文件或目录`;
  if (node.type === 'file') return p.split('/').pop() ?? '';
  let names = Object.keys(node.children ?? {}).sort();
  if (!flags.includes('a')) names = names.filter((n) => !n.startsWith('.'));
  if (flags.includes('l')) {
    return names
      .map((n) => {
        const c = node.children![n];
        const kind = c.type === 'dir' ? 'drwxr-xr-x' : `-rw-r--r--`;
        const size = c.type === 'file' ? (c.content?.length ?? 0) : 4096;
        return `${kind} 1 student student ${String(size).padStart(6)} Jan  1 10:00 ${n}`;
      })
      .join('\n');
  }
  return names.join('  ');
}

function cmdCd(ctx: Ctx, args: string[]): string {
  const target = args[0] ?? '/';
  const p = normalize(ctx.fs.cwd, target);
  const node = getNode(ctx.fs, p);
  if (!node) return `cd: ${target}: 没有那个文件或目录`;
  if (node.type !== 'dir') return `cd: ${target}: 不是目录`;
  ctx.fs.cwd = p;
  return '';
}

function cmdMkdir(ctx: Ctx, args: string[]): string {
  const errs: string[] = [];
  for (const name of args.filter((a) => !a.startsWith('-'))) {
    const p = normalize(ctx.fs.cwd, name);
    const { parent, name: base } = getParent(ctx.fs, p);
    if (!parent || parent.type !== 'dir') { errs.push(`mkdir: 无法创建目录 '${name}'`); continue; }
    if (parent.children?.[base]) { errs.push(`mkdir: 无法创建目录 '${name}': 文件已存在`); continue; }
    parent.children![base] = makeDir();
  }
  return errs.join('\n');
}

function cmdTouch(ctx: Ctx, args: string[]): string {
  for (const name of args.filter((a) => !a.startsWith('-'))) {
    const p = normalize(ctx.fs.cwd, name);
    const { parent, name: base } = getParent(ctx.fs, p);
    if (!parent || parent.type !== 'dir') continue;
    if (!parent.children?.[base]) parent.children![base] = makeFile('');
  }
  return '';
}

function cmdRm(ctx: Ctx, args: string[]): string {
  const flags = args.filter((a) => a.startsWith('-')).join('');
  const errs: string[] = [];
  for (const name of args.filter((a) => !a.startsWith('-'))) {
    const p = normalize(ctx.fs.cwd, name);
    const { parent, name: base } = getParent(ctx.fs, p);
    if (!parent?.children?.[base]) { errs.push(`rm: 无法删除 '${name}': 没有那个文件或目录`); continue; }
    const node = parent.children[base];
    if (node.type === 'dir' && Object.keys(node.children ?? {}).length > 0 && !flags.includes('r')) {
      errs.push(`rm: 无法删除 '${name}': 是一个目录`);
      continue;
    }
    delete parent.children[base];
  }
  return errs.join('\n');
}

function readSource(ctx: Ctx, p: string): string | null {
  if (p === '-') return ctx.stdin;
  const node = getNode(ctx.fs, normalize(ctx.fs.cwd, p));
  return node?.type === 'file' ? node.content ?? '' : null;
}

function cmdCat(ctx: Ctx, args: string[]): string {
  const outs: string[] = [];
  for (const name of args.filter((a) => !a.startsWith('-'))) {
    const c = readSource(ctx, name);
    if (c === null) outs.push(`cat: ${name}: 没有那个文件或目录`);
    else outs.push(c.replace(/\n$/, ''));
  }
  return outs.join('\n');
}

function cmdEcho(ctx: Ctx, args: string[]): string {
  void ctx;
  return args.join(' ');
}

function cmdMv(ctx: Ctx, args: string[]): string {
  const [src, dst] = args;
  if (!src || !dst) return 'mv: 缺少操作数';
  const sp = normalize(ctx.fs.cwd, src);
  const { parent: spParent, name: sName } = getParent(ctx.fs, sp);
  const node = spParent?.children?.[sName];
  if (!node) return `mv: 无法统计 '${src}': 没有那个文件或目录`;
  const dp = normalize(ctx.fs.cwd, dst);
  const dNode = getNode(ctx.fs, dp);
  if (dNode?.type === 'dir') {
    dNode.children![sName] = node;
  } else {
    const { parent: dParent, name: dName } = getParent(ctx.fs, dp);
    if (!dParent?.children) return `mv: 目标无效`;
    dParent.children[dName] = node;
  }
  delete spParent!.children![sName];
  return '';
}

function cmdCp(ctx: Ctx, args: string[]): string {
  const [src, dst] = args;
  if (!src || !dst) return 'cp: 缺少操作数';
  const node = getNode(ctx.fs, normalize(ctx.fs.cwd, src));
  if (!node) return `cp: 无法统计 '${src}': 没有那个文件或目录`;
  const clone: FsNode = node.type === 'dir'
    ? { type: 'dir', children: structuredClone(node.children ?? {}) }
    : { type: 'file', content: node.content ?? '' };
  const dp = normalize(ctx.fs.cwd, dst);
  const dNode = getNode(ctx.fs, dp);
  if (dNode?.type === 'dir') {
    dNode.children![splitPath(dst).pop() ?? ''] = clone;
  } else {
    const { parent: dParent, name: dName } = getParent(ctx.fs, dp);
    if (!dParent?.children) return `cp: 目标无效`;
    dParent.children[dName] = clone;
  }
  return '';
}

function grepLines(ctx: Ctx, args: string[]): string {
  const flags = args.filter((a) => a.startsWith('-')).join('');
  const pattern = args.find((a) => !a.startsWith('-'));
  const file = args[args.indexOf(pattern!) + 1];
  let text: string;
  if (file && !file.startsWith('-')) {
    const c = readSource(ctx, file);
    if (c === null) return `grep: ${file}: 没有那个文件或目录`;
    text = c;
  } else {
    text = ctx.stdin;
  }
  const re = new RegExp(pattern!, flags.includes('i') ? 'i' : '');
  const lines = text.replace(/\n$/, '').split('\n');
  const res: string[] = [];
  lines.forEach((l, i) => {
    const m = re.test(l);
    if (flags.includes('v') ? !m : m) {
      res.push(flags.includes('n') ? `${i + 1}:${l}` : l);
    }
  });
  return res.join('\n');
}

function sortCmd(ctx: Ctx, args: string[]): string {
  const flags = args.filter((a) => a.startsWith('-')).join('');
  const file = args.find((a) => !a.startsWith('-'));
  const text = file ? (readSource(ctx, file) ?? '') : ctx.stdin;
  const lines = text.replace(/\n$/, '').split('\n');
  if (flags.includes('n')) lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
  else lines.sort((a, b) => a.localeCompare(b));
  if (flags.includes('r')) lines.reverse();
  return lines.join('\n');
}

function uniqCmd(ctx: Ctx, args: string[]): string {
  const flags = args.filter((a) => a.startsWith('-')).join('');
  const file = args.find((a) => !a.startsWith('-'));
  const text = file ? (readSource(ctx, file) ?? '') : ctx.stdin;
  const lines = text.replace(/\n$/, '').split('\n');
  const res: string[] = [];
  let prev: string | null = null;
  let count = 0;
  for (const l of lines) {
    if (l === prev) count++;
    else {
      if (prev !== null) res.push(flags.includes('c') ? `${String(count).padStart(4)} ${prev}` : prev);
      prev = l; count = 1;
    }
  }
  if (prev !== null) res.push(flags.includes('c') ? `${String(count).padStart(4)} ${prev}` : prev);
  return res.join('\n');
}

function wcCmd(ctx: Ctx, args: string[]): string {
  const flags = args.filter((a) => a.startsWith('-')).join('');
  const file = args.find((a) => !a.startsWith('-'));
  const text = file ? (readSource(ctx, file) ?? '') : ctx.stdin;
  const clean = text.replace(/\n$/, '');
  const l = clean === '' ? 0 : clean.split('\n').length;
  const w = clean === '' ? 0 : clean.split(/\s+/).filter(Boolean).length;
  const c = text.length;
  if (flags.includes('l')) return String(l);
  if (flags.includes('w')) return String(w);
  if (flags.includes('c')) return String(c);
  return `${l} ${w} ${c}`;
}

function headTail(ctx: Ctx, args: string[], isHead: boolean): string {
  const nArg = args.find((a) => /^-\d+$/.test(a));
  const n = nArg ? Number(nArg.slice(1)) : 10;
  const file = args.find((a) => !a.startsWith('-') && !/^-\d+$/.test(a));
  const text = file ? (readSource(ctx, file) ?? '') : ctx.stdin;
  const lines = text.replace(/\n$/, '').split('\n');
  return (isHead ? lines.slice(0, n) : lines.slice(-n)).join('\n');
}

function cmdFind(ctx: Ctx, args: string[]): string {
  const nameIdx = args.indexOf('-name');
  const pattern = nameIdx >= 0 ? args[nameIdx + 1]?.replace(/\*/g, '.*').replace(/\?/g, '.') ?? '' : '';
  const re = pattern ? new RegExp(`^${pattern}$`) : null;
  const base = args.find((a) => !a.startsWith('-') && a !== '-name' && a !== pattern) ?? ctx.fs.cwd;
  const startP = normalize(ctx.fs.cwd, base);
  const res: string[] = [];
  const walk = (p: string) => {
    const node = getNode(ctx.fs, p);
    if (!node) return;
    const name = splitPath(p).pop() ?? '';
    if (!re || re.test(name)) res.push(p === '/' ? '/' : p.replace(/^\//, ''));
    if (node.type === 'dir') {
      for (const c of Object.keys(node.children ?? {}).sort()) walk(`${p === '/' ? '' : p}/${c}`);
    }
  };
  walk(startP);
  return res.join('\n');
}

function cmdChmod(ctx: Ctx, args: string[]): string {
  const mode = args[0];
  const name = args[1];
  if (!mode || !name) return 'chmod: 缺少操作数';
  const node = getNode(ctx.fs, normalize(ctx.fs.cwd, name));
  if (!node) return `chmod: 无法访问 '${name}': 没有那个文件或目录`;
  node.mode = mode;
  return '';
}

function cmdTree(ctx: Ctx, args: string[]): string {
  const base = args.find((a) => !a.startsWith('-')) ?? ctx.fs.cwd;
  const startP = normalize(ctx.fs.cwd, base);
  const lines: string[] = [startP === '/' ? '/' : splitPath(startP).pop() ?? '/'];
  const walk = (p: string, prefix: string) => {
    const node = getNode(ctx.fs, p);
    if (node?.type !== 'dir') return;
    const entries = Object.keys(node.children ?? {}).sort();
    entries.forEach((name, i) => {
      const last = i === entries.length - 1;
      const child = node.children![name];
      lines.push(`${prefix}${last ? '└── ' : '├── '}${name}${child.type === 'dir' ? '/' : ''}`);
      if (child.type === 'dir') walk(`${p === '/' ? '' : p}/${name}`, prefix + (last ? '    ' : '│   '));
    });
  };
  walk(startP, '');
  return lines.join('\n');
}

function cmdWhoami(ctx: Ctx): string {
  return ctx.fs.user;
}

/* ---------------- 新增：sed / awk / ps / du / df / free / netstat ---------------- */

/** sed：支持 s/old/new/[g] 替换（可管道可文件） */
function sedCmd(ctx: Ctx, args: string[]): string {
  const expr = args.find((a) => /^s\//.test(a));
  const file = args.find((a) => !a.startsWith('-') && !/^s\//.test(a));
  const text = file ? (readSource(ctx, file) ?? '') : ctx.stdin;
  if (!expr) return 'sed: 缺少表达式（用法 s/old/new/[g]）';
  const m = expr.match(/^s\/([^/]*)\/([^/]*)(\/([gi]*))?$/);
  if (!m) return `sed: 表达式无效`;
  const [, oldStr, newStr, , flagStr = ''] = m;
  const re = new RegExp(oldStr, flagStr.includes('g') ? 'g' : '');
  const lines = text.replace(/\n$/, '').split('\n').map((l) => l.replace(re, newStr));
  return lines.join('\n');
}

/** awk：极简版 —— 支持 -F 分隔符 与 {print $N} / {print $N, $M} / {print $0} / {print NF} */
function awkCmd(ctx: Ctx, args: string[]): string {
  let sep = /\s+/;
  const rest = [...args];
  const fIdx = rest.findIndex((a) => a.startsWith('-F'));
  if (fIdx >= 0) {
    const sepCh = rest[fIdx].slice(2) || rest[fIdx + 1];
    if (sepCh) sep = new RegExp(sepCh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    rest.splice(fIdx, sepCh && rest[fIdx].length > 2 ? 1 : 2);
  }
  const body = rest.find((a) => a.startsWith('{'));
  const file = rest.find((a) => !a.startsWith('{') && !a.startsWith('-F'));
  const text = file ? (readSource(ctx, file) ?? '') : ctx.stdin;
  if (!body) return '';
  const fields = body.match(/\$(\d+|NF)/g);
  if (!fields) return '';
  const idxs = fields.map((f) => (f === '$NF' ? -1 : Number(f.slice(1))));
  const literal = fields.includes('$0');
  const lines = text.replace(/\n$/, '').split('\n').filter((l) => l !== '');
  const outs: string[] = [];
  for (const l of lines) {
    const cols = l.split(sep).filter((c) => c !== '');
    if (literal) { outs.push(l); continue; }
    const picked = idxs.map((i) => (i === -1 ? String(cols.length) : (cols[i - 1] ?? '')));
    outs.push(picked.join(' '));
  }
  return outs.join('\n');
}

/** ps：进程列表（数据源 system.ps，缺省用内置演示进程表） */
function psCmd(ctx: Ctx): string {
  const list = (ctx.fs.system.ps as { pid: number; cmd: string; cpu: number }[] | undefined) ?? [
    { pid: 1, cmd: 'systemd', cpu: 0.1 },
    { pid: 348, cmd: 'sshd: /usr/sbin/sshd -D', cpu: 0.2 },
    { pid: 512, cmd: 'nginx: master process', cpu: 0.5 },
    { pid: 780, cmd: 'node /var/www/app/server.js', cpu: 3.4 },
    { pid: 1024, cmd: 'mysqld', cpu: 8.2 },
  ];
  const lines = ['  PID CMD                              %CPU', ...list.map((p) => `${String(p.pid).padStart(5)} ${p.cmd.padEnd(32)} ${String(p.cpu).padStart(4)}`)];
  return lines.join('\n');
}

/** 目录大小（KB）：递归累计文件字节数，目录按 4K 计 */
function dirSize(node: FsNode): number {
  if (node.type === 'file') return Math.max(4, Math.ceil((node.content?.length ?? 0) / 1024)) * 1;
  let sum = 4;
  for (const c of Object.values(node.children ?? {})) sum += dirSize(c);
  return sum;
}

/** du：du -sh <dir> 汇总 / du <dir> 分项 */
function duCmd(ctx: Ctx, args: string[]): string {
  const flags = args.filter((a) => a.startsWith('-')).join('');
  const target = args.find((a) => !a.startsWith('-')) ?? ctx.fs.cwd;
  const p = normalize(ctx.fs.cwd, target);
  const node = getNode(ctx.fs, p);
  if (!node) return `du: 无法访问 '${target}': 没有那个文件或目录`;
  const kb = dirSize(node);
  if (flags.includes('s')) {
    const human = kb >= 1024 ? `${(kb / 1024).toFixed(1)}M` : `${kb}K`;
    return `${human}\t${p === '/' ? '/' : p.replace(/^\//, '')}`;
  }
  const lines: string[] = [];
  if (node.type === 'dir') {
    for (const name of Object.keys(node.children ?? {}).sort()) {
      const child = node.children![name];
      lines.push(`${dirSize(child)}K\t${p === '/' ? '' : p.replace(/^\//, '') + '/' + name}`);
    }
  }
  lines.push(`${kb}K\t.`);
  return lines.join('\n');
}

/** df：磁盘分区使用（数据源 system.df，缺省演示值） */
function dfCmd(ctx: Ctx): string {
  const df = (ctx.fs.system.df as { total: number; used: number } | undefined) ?? { total: 40, used: 31 };
  const pct = Math.round((df.used / df.total) * 100);
  return [
    'Filesystem      Size  Used  Use% Mounted on',
    `/dev/vda1       ${df.total}G  ${df.used}G  ${df.total - df.used}G  ${pct}% /`,
  ].join('\n');
}

/** free：内存使用（数据源 system.memMb / memUsedMb，缺省演示值） */
function freeCmd(ctx: Ctx): string {
  const total = (ctx.fs.system.memMb as number | undefined) ?? 7982;
  const used = (ctx.fs.system.memUsedMb as number | undefined) ?? 4950;
  return `              total        used        free\nMem:   ${String(total).padStart(8)}  ${String(used).padStart(8)}  ${String(total - used).padStart(8)}`;
}

/** netstat：监听端口列表（数据源 system.ports） */
function netstatCmd(ctx: Ctx): string {
  const ports = (ctx.fs.system.ports as number[] | undefined) ?? [22, 80, 443];
  const names: Record<number, string> = { 22: 'sshd', 80: 'nginx', 443: 'nginx', 3306: 'mysqld', 6379: 'redis' };
  const lines = ['Active Internet connections (only servers)'];
  for (const p of ports) {
    const svc = names[p] ?? 'app';
    lines.push(`tcp   0  0 0.0.0.0:${p}   0.0.0.0:*   LISTEN   ${svc}`);
  }
  return lines.join('\n');
}

/* ---------------- 执行入口 ---------------- */

const COMMANDS: Record<string, (ctx: Ctx, args: string[]) => string> = {

  pwd: (ctx) => ctx.fs.cwd, // 修复：文档声明支持 pwd，但此前未注册（下方 cmdName === 'pwd' 分支为死代码）
  ls: cmdLs,
  cd: cmdCd,
  mkdir: cmdMkdir,
  touch: cmdTouch,
  rm: cmdRm,
  cp: cmdCp,
  mv: cmdMv,
  cat: cmdCat,
  echo: cmdEcho,
  grep: grepLines,
  sort: sortCmd,
  uniq: uniqCmd,
  wc: wcCmd,
  head: (ctx, a) => headTail(ctx, a, true),
  tail: (ctx, a) => headTail(ctx, a, false),
  find: cmdFind,
  chmod: cmdChmod,
  tree: cmdTree,
  whoami: (ctx) => cmdWhoami(ctx),
  date: () => new Date().toISOString().slice(0, 10),
  sed: sedCmd,
  awk: awkCmd,
  ps: (ctx) => psCmd(ctx),
  du: duCmd,
  df: (ctx) => dfCmd(ctx),
  free: (ctx) => freeCmd(ctx),
  netstat: (ctx) => netstatCmd(ctx),
  clear: () => '',
  true: () => '',
  false: () => '',
};

/** 逐命令回显记录：终端演练组件用它按真实终端的样子渲染每条命令的输出 */
export interface ShellTranscriptEntry {
  line: string;
  out: string;
  err: string;
  /** 本条命令执行前的 cwd（渲染该行提示符用） */
  cwd: string;
  /** 本条命令执行后的 cwd（渲染下一行提示符用） */
  cwdAfter: string;
}

export function execShell(script: string, fsJson: string): { stdout: string; stderr: string; exitCode: number | null; transcript: ShellTranscriptEntry[] } {
  const fs: FsState = initFs(fsJson);
  const stdout: string[] = [];
  const stderr: string[] = [];
  const transcript: ShellTranscriptEntry[] = [];
  let errMark = 0;
  let curLine = '';
  let lineCwd = fs.cwd;
  const lines = script.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));

  try {
    for (const line of lines) {
      curLine = line;
      errMark = stderr.length;
      lineCwd = fs.cwd;
      // 管道分段
      const segments = line.split('|').map((x) => x.trim());
      let pipeData = '';
      for (let si = 0; si < segments.length; si++) {
        const tokens = tokenize(segments[si]);
        if (tokens.length === 0) continue;
        // 重定向处理（> >> <）
        let redirect: { mode: '>' | '>>'; file: string } | null = null;
        let stdinFile: string | null = null;
        const cleanArgs: string[] = [];
        for (let ti = 0; ti < tokens.length; ti++) {
          const tk = tokens[ti];
          if (tk === '>' || tk === '>>') {
            redirect = { mode: tk, file: tokens[++ti] ?? '' };
          } else if (tk === '<') {
            stdinFile = tokens[++ti] ?? '';
          } else cleanArgs.push(tk);
        }
        const cmdName = cleanArgs.shift() ?? '';
        if (!(cmdName in COMMANDS)) {
          stderr.push(`${cmdName}: 未找到命令（本模拟器支持的命令见关卡讲解）`);
          break;
        }
        const stdinText = stdinFile ? (readSource({ fs, stdin: '' }, normalize(fs.cwd, stdinFile)) ?? '') : '';
        const ctx: Ctx = { fs, stdin: si === 0 ? stdinText : pipeData };
        let out = COMMANDS[cmdName](ctx, cleanArgs);
        if (cmdName === 'pwd') out = fs.cwd;
        if (redirect) {
          const p = normalize(fs.cwd, redirect.file);
          const { parent, name } = getParent(fs, p);
          if (parent?.children) {
            const prev = redirect.mode === '>>' ? parent.children[name]?.content ?? '' : '';
            parent.children[name] = makeFile(prev + out + (out ? '\n' : ''));
          }
          out = '';
        }
        pipeData = out;
      }
      stdout.push(pipeData);
      transcript.push({ line, out: pipeData, err: stderr.slice(errMark).join('\n'), cwd: lineCwd, cwdAfter: fs.cwd });
    }
  } catch (err) {
    stderr.push(String((err as Error)?.message ?? err));
    transcript.push({ line: curLine, out: '', err: stderr.slice(errMark).join('\n'), cwd: lineCwd, cwdAfter: fs.cwd });
  }

  return { stdout: stdout.filter((x) => x !== '').join('\n'), stderr: stderr.join('\n'), exitCode: stderr.length > 0 ? 1 : 0, transcript };
}
