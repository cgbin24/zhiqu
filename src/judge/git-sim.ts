/**
 * Git 实战课判题模拟器 —— 在纯内存中模拟一个确定性的迷你 Git 仓库。
 *
 * 脚本：每行一条命令（# 开头为注释，空行跳过）。输出逐行拼接为 stdout，与关卡
 * expected 逐字符比对（走 judge 的常规比对路径）。
 *
 * 提交哈希完全确定：fnv1a(seq + msg + parent) 前 7 位 —— 同一脚本永远得到同一历史。
 *
 * 支持的命令（levels 只允许使用这些）：
 *   git init
 *   echo "内容" > 文件名 / echo "内容" >> 文件名 / touch 文件名...
 *   git status
 *   git add <file | .>
 *   git commit -m "信息"
 *   git log [--oneline]
 *   git branch [名] / git switch <名> / git switch -c <名>
 *   git checkout <名> / git checkout -b <名>
 *   git merge <名>
 *   git diff / git diff --staged
 *   git tag [名]
 *   git stash / git stash pop
 *   git remote add origin <url> / git remote -v
 *   git push [-u] [origin] [分支] / git pull
 */

/* ---------------- 状态 ---------------- */

interface Commit {
  msg: string;
  parents: string[];
  files: Record<string, string>;
}

interface RepoState {
  initialized: boolean;
  head: string;
  branchOrder: string[];
  branches: Record<string, string>;
  commits: Record<string, Commit>;
  staging: Record<string, string>;
  workdir: Record<string, string>;
  tags: string[];
  stash: Record<string, string>[];
  remote: string | null;
  remoteBranches: Record<string, string>;
  seq: number;
}

function emptyRepo(): RepoState {
  return {
    initialized: false,
    head: 'main',
    branchOrder: [],
    branches: {},
    commits: {},
    staging: {},
    workdir: {},
    tags: [],
    stash: [],
    remote: null,
    remoteBranches: {},
    seq: 0,
  };
}

function seedRepo(initJson: string): RepoState {
  const s = emptyRepo();
  if (!initJson) return s;
  try {
    const cfg = JSON.parse(initJson) as {
      workdir?: Record<string, string>;
      head?: string;
    };
    if (cfg.workdir) s.workdir = { ...cfg.workdir };
    if (cfg.head) s.head = cfg.head;
  } catch {
    /* 初始状态解析失败按空仓库处理 */
  }
  return s;
}

/* ---------------- 确定性哈希 ---------------- */

function fnv1a(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function commitHash(s: RepoState, msg: string, parent: string): string {
  s.seq++;
  return fnv1a(`${s.seq}:${msg}:${parent}`).toString(16).padStart(7, '0').slice(0, 7);
}

/* ---------------- 工具 ---------------- */

function headFiles(s: RepoState): Record<string, string> {
  const h = s.branches[s.head];
  return h && s.commits[h] ? s.commits[h].files : {};
}

function isIgnored(s: RepoState, file: string): boolean {
  const gi = s.workdir['.gitignore'];
  if (!gi || file === '.gitignore') return false;
  return gi.split('\n').some((line) => {
    const p = line.trim();
    if (!p || p.startsWith('#')) return false;
    if (p === file) return true;
    if (p.startsWith('*') && file.endsWith(p.slice(1))) return true;
    return false;
  });
}

function statusSections(s: RepoState): { staged: string[]; changed: string[]; untracked: string[] } {
  const head = headFiles(s);
  const staged: string[] = [];
  for (const f of Object.keys(s.staging)) {
    if (s.staging[f] !== head[f]) staged.push(f);
  }
  const changed: string[] = [];
  for (const f of Object.keys(s.staging)) {
    if (s.workdir[f] !== s.staging[f]) changed.push(f);
  }
  for (const f of Object.keys(head)) {
    if (!(f in s.staging) && s.workdir[f] !== undefined && s.workdir[f] !== head[f]) changed.push(f);
  }
  const untracked: string[] = [];
  for (const f of Object.keys(s.workdir)) {
    if (f === '.gitignore' && Object.keys(s.workdir).length > 1) {
      // .gitignore 自身如果未提交也按未跟踪显示
    }
    if (!(f in s.staging) && !(f in head) && !isIgnored(s, f)) untracked.push(f);
  }
  return { staged, changed, untracked };
}

function isAncestor(s: RepoState, ancestor: string, of: string): boolean {
  if (!ancestor) return true;
  const seen = new Set<string>();
  const stack = [of];
  while (stack.length) {
    const h = stack.pop()!;
    if (h === ancestor) return true;
    if (!h || seen.has(h)) continue;
    seen.add(h);
    for (const p of s.commits[h]?.parents ?? []) stack.push(p);
  }
  return false;
}

function mergeBase(s: RepoState, a: string, b: string): string | null {
  const ancestorsA = new Set<string>();
  const stack = [a];
  while (stack.length) {
    const h = stack.pop()!;
    if (!h || ancestorsA.has(h)) continue;
    ancestorsA.add(h);
    for (const p of s.commits[h]?.parents ?? []) stack.push(p);
  }
  // b 侧 BFS 找最近公共祖先
  const seen = new Set<string>();
  const queue = [b];
  while (queue.length) {
    const h = queue.shift()!;
    if (ancestorsA.has(h)) return h;
    if (seen.has(h)) continue;
    seen.add(h);
    for (const p of s.commits[h]?.parents ?? []) queue.push(p);
  }
  return null;
}

function doMerge(s: RepoState, out: string[], branch: string): void {
  const headHash = s.branches[s.head];
  const otherHash = s.branches[branch];
  if (!otherHash) {
    out.push(`merge：分支 '${branch}' 不存在`);
    return;
  }
  if (isAncestor(s, otherHash, headHash)) {
    out.push('已是最新');
    return;
  }
  if (isAncestor(s, headHash, otherHash)) {
    // fast-forward
    s.branches[s.head] = otherHash;
    s.workdir = { ...s.commits[otherHash].files };
    out.push(`正在快进 ${s.head} 至 ${branch}`);
    out.push('Fast-forward');
    return;
  }
  // 三方合并
  const base = mergeBase(s, headHash, otherHash);
  const baseFiles = base ? s.commits[base].files : {};
  const aFiles = s.commits[headHash].files;
  const bFiles = s.commits[otherHash].files;
  const merged: Record<string, string> = {};
  const conflicts: string[] = [];
  const all = new Set([...Object.keys(aFiles), ...Object.keys(bFiles)]);
  for (const f of all) {
    const aC = aFiles[f];
    const bC = bFiles[f];
    const baseC = baseFiles[f];
    if (aC === bC) merged[f] = aC ?? '';
    else if (aC === baseC) merged[f] = bC ?? '';
    else if (bC === baseC) merged[f] = aC ?? '';
    else conflicts.push(f);
  }
  if (conflicts.length > 0) {
    out.push(`冲突：${conflicts.join(', ')}（两边都修改了）—— 解决后重新提交`);
    return;
  }
  s.seq++;
  const hash = fnv1a(`${s.seq}:Merge branch '${branch}':${headHash},${otherHash}`).toString(16).padStart(7, '0').slice(0, 7);
  s.commits[hash] = { msg: `Merge branch '${branch}'`, parents: [headHash, otherHash], files: merged };
  s.branches[s.head] = hash;
  s.staging = {};
  s.workdir = { ...merged };
  out.push(`[${s.head} ${hash}] Merge branch '${branch}'`);
}

/* ---------------- 命令执行 ---------------- */

function execLine(s: RepoState, line: string, out: string[]): void {
  const raw = line.trim();
  if (!raw || raw.startsWith('#')) return;
  if (!raw.startsWith('git ')) {
    // 工作区文件操作
    const echoM = raw.match(/^echo\s+"([^"]*)"\s*(>>|>)\s*(\S+)$/);
    if (echoM) {
      const [, text, op, file] = echoM;
      s.workdir[file] = op === '>>' ? (s.workdir[file] ?? '') + text : text;
      return;
    }
    const touchM = raw.match(/^touch\s+(.+)$/);
    if (touchM) {
      for (const f of touchM[1].trim().split(/\s+/)) {
        if (!(f in s.workdir)) s.workdir[f] = '';
      }
      return;
    }
    out.push(`未知命令：${raw}`);
    return;
  }

  const argv = raw.slice(4).trim().split(/\s+/).filter(Boolean);
  const cmd = argv[0];
  const rest = argv.slice(1);

  switch (cmd) {
    case 'init': {
      if (s.initialized) {
        out.push('重新初始化已存在的 Git 仓库');
      } else {
        s.initialized = true;
        s.branches[s.head] = '';
        s.branchOrder.push(s.head);
        out.push('已初始化空 Git 仓库（.git/）');
      }
      return;
    }
    case 'status': {
      if (!s.initialized) { out.push('fatal：不是 Git 仓库（先 git init）'); return; }
      const { staged, changed, untracked } = statusSections(s);
      out.push(`[${s.head}]`);
      if (staged.length) out.push(`暂存: ${staged.join(', ')}`);
      if (changed.length) out.push(`改动: ${changed.join(', ')}`);
      if (untracked.length) out.push(`未跟踪: ${untracked.join(', ')}`);
      if (!staged.length && !changed.length && !untracked.length) out.push('工作区干净');
      return;
    }
    case 'add': {
      if (!s.initialized) { out.push('fatal：不是 Git 仓库（先 git init）'); return; }
      const target = rest[0];
      if (!target) { out.push('nothing specified, nothing added'); return; }
      if (target === '.' || target === '-A' || target === '--all') {
        for (const f of Object.keys(s.workdir)) {
          if (!isIgnored(s, f)) s.staging[f] = s.workdir[f];
        }
        return;
      }
      if (!(target in s.workdir)) { out.push(`fatal：路径 '${target}' 不存在`); return; }
      s.staging[target] = s.workdir[target];
      return;
    }
    case 'commit': {
      if (!s.initialized) { out.push('fatal：不是 Git 仓库（先 git init）'); return; }
      const mFlag = rest.indexOf('-m');
      if (mFlag === -1 || !rest[mFlag + 1]) { out.push('错误：请用 -m 提供提交信息'); return; }
      const msg = rest.slice(mFlag + 1).join(' ').replace(/^"|"$/g, '');
      if (Object.keys(s.staging).length === 0) { out.push('没有可提交的变更'); return; }
      const parent = s.branches[s.head] ?? '';
      const files = { ...s.staging };
      const hash = commitHash(s, msg, parent);
      s.commits[hash] = { msg, parents: parent ? [parent] : [], files };
      s.branches[s.head] = hash;
      s.staging = {};
      out.push(`[${s.head} ${hash}] ${msg}`);
      return;
    }
    case 'log': {
      if (!s.initialized) { out.push('fatal：不是 Git 仓库（先 git init）'); return; }
      const oneline = rest.includes('--oneline');
      let h = s.branches[s.head];
      if (!h || !s.commits[h]) { out.push('还没有任何提交'); return; }
      const chain: string[] = [];
      while (h && s.commits[h]) {
        chain.push(h);
        h = s.commits[h].parents[0] ?? '';
      }
      if (oneline) {
        for (const c of chain) out.push(`${c} ${s.commits[c].msg}`);
      } else {
        chain.forEach((c, i) => {
          if (i > 0) out.push('');
          out.push(`commit ${c}`);
          out.push('Author: student@codequest');
          out.push('Date:   2026-01-01 12:00:00 +0800');
          out.push('');
          out.push(`    ${s.commits[c].msg}`);
        });
      }
      return;
    }
    case 'branch': {
      if (!s.initialized) { out.push('fatal：不是 Git 仓库（先 git init）'); return; }
      const name = rest.find((a) => !a.startsWith('-'));
      if (!name) {
        for (const b of s.branchOrder) out.push(`${b === s.head ? '* ' : '  '}${b}`);
        return;
      }
      if (s.branches[name] !== undefined) { out.push(`fatal：分支 '${name}' 已存在`); return; }
      s.branches[name] = s.branches[s.head] ?? '';
      s.branchOrder.push(name);
      return;
    }
    case 'switch':
    case 'checkout': {
      if (!s.initialized) { out.push('fatal：不是 Git 仓库（先 git init）'); return; }
      const createFlag = rest[0] === '-b' || rest[0] === '-c';
      const name = createFlag ? rest[1] : rest[0];
      if (!name) { out.push('错误：请提供分支名'); return; }
      if (createFlag) {
        if (s.branches[name] !== undefined) { out.push(`fatal：分支 '${name}' 已存在`); return; }
        s.branches[name] = s.branches[s.head] ?? '';
        s.branchOrder.push(name);
      } else if (s.branches[name] === undefined) {
        out.push(`fatal：分支 '${name}' 不存在`);
        return;
      }
      s.head = name;
      s.staging = {};
      const h = s.branches[name];
      s.workdir = h && s.commits[h] ? { ...s.commits[h].files } : {};
      out.push(createFlag ? `切换到新分支 '${name}'` : `切换到分支 '${name}'`);
      return;
    }
    case 'merge': {
      if (!s.initialized) { out.push('fatal：不是 Git 仓库（先 git init）'); return; }
      doMerge(s, out, rest[0]);
      return;
    }
    case 'diff': {
      if (!s.initialized) { out.push('fatal：不是 Git 仓库（先 git init）'); return; }
      const stagedMode = rest.includes('--staged') || rest.includes('--cached');
      const head = headFiles(s);
      const base: Record<string, string> = stagedMode ? head : s.staging;
      const target: Record<string, string> = stagedMode ? s.staging : s.workdir;
      const lines: string[] = [];
      const all = new Set([...Object.keys(base), ...Object.keys(target)]);
      for (const f of all) {
        if (base[f] !== target[f]) {
          lines.push(base[f] === undefined ? `新增：${f}` : target[f] === undefined ? `删除：${f}` : `修改：${f}`);
        }
      }
      if (lines.length === 0) out.push('无差异');
      else lines.forEach((l) => out.push(l));
      return;
    }
    case 'tag': {
      if (!s.initialized) { out.push('fatal：不是 Git 仓库（先 git init）'); return; }
      const name = rest[0];
      if (!name) {
        if (s.tags.length === 0) { out.push('还没有任何标签'); return; }
        s.tags.forEach((t) => out.push(t));
        return;
      }
      if (s.tags.includes(name)) { out.push(`fatal：标签 '${name}' 已存在`); return; }
      s.tags.push(name);
      return;
    }
    case 'stash': {
      const sub = rest[0];
      if (sub === 'pop') {
        const top = s.stash.pop();
        if (!top) { out.push('没有可恢复的 stash'); return; }
        s.workdir = { ...top };
        out.push('恢复了 stash@{0}');
        return;
      }
      const { staged, changed } = statusSections(s);
      if (!staged.length && !changed.length) { out.push('没有本地改动需要储藏'); return; }
      s.stash.unshift({ ...s.workdir });
      const h = s.branches[s.head];
      s.workdir = h && s.commits[h] ? { ...s.commits[h].files } : {};
      s.staging = {};
      out.push('已保存到 stash@{0}');
      return;
    }
    case 'remote': {
      if (rest[0] === 'add') {
        s.remote = rest[2] ?? 'origin';
        return;
      }
      if (rest[0] === '-v' || rest.length === 0) {
        if (s.remote) out.push(`origin ${s.remote}`);
        return;
      }
      return;
    }
    case 'push': {
      if (!s.initialized) { out.push('fatal：不是 Git 仓库（先 git init）'); return; }
      if (!s.remote) { out.push('fatal：没有配置远程仓库（git remote add origin <url>）'); return; }
      const hasU = rest.includes('-u');
      const branch = rest[rest.length - 1] ?? s.head;
      const hash = s.branches[branch];
      if (hash === undefined) { out.push(`fatal：分支 '${branch}' 不存在`); return; }
      s.remoteBranches[branch] = hash;
      out.push(`已推送 ${branch} -> origin/${branch}${hasU ? '（已建立跟踪）' : ''}`);
      return;
    }
    case 'pull': {
      if (!s.initialized) { out.push('fatal：不是 Git 仓库（先 git init）'); return; }
      const rb = s.remoteBranches[s.head];
      const local = s.branches[s.head];
      if (!rb || rb === local) { out.push('已是最新'); return; }
      if (isAncestor(s, local, rb)) {
        s.branches[s.head] = rb;
        s.workdir = { ...s.commits[rb].files };
        out.push(`已更新 ${s.head}（快进至 origin/${s.head}）`);
      } else {
        out.push('pull 产生分歧 —— 请先 merge');
      }
      return;
    }
    default:
      out.push(`git: '${cmd}' 不是一个 git 命令`);
  }
}

/** 执行一段 git 脚本，返回全部输出（\n 连接） */
export function runGitScript(script: string, initJson: string | undefined): string {
  const s = seedRepo(initJson ?? '');
  const out: string[] = [];
  for (const line of script.replace(/\r\n?/g, '\n').split('\n')) {
    execLine(s, line.trim(), out);
  }
  return out.join('\n');
}
