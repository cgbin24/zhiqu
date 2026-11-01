import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import type { AlgoVizKind } from '@/types';

/* ================= 帧定义 ================= */

interface BaseFrame {
  caption: string;
}
interface SortF extends BaseFrame { arr: number[]; cmp?: [number, number]; swap?: [number, number]; pivot?: number; sorted: number[]; range?: [number, number] }
interface SearchF extends BaseFrame { lo: number; hi: number; mid?: number; found?: number }
interface TwoPtrF extends BaseFrame { l: number; r: number; match?: boolean; done: boolean }
interface WindowF extends BaseFrame { start: number; end: number; sum: number; best: number; bestRange?: [number, number] }
interface PrefixF extends BaseFrame { prefix: number[]; hi?: number; query?: [number, number] }
interface RecF extends BaseFrame { tree: { id: number; label: string; depth: number; state: 'call' | 'active' | 'returned'; value?: number }[] }
interface HashF extends BaseFrame { buckets: string[][]; hiBucket?: number; hiValue?: string }
interface StackF extends BaseFrame { chars: { ch: string; state: 'pending' | 'active' | 'done' }[]; stack: string[]; ok: boolean }
interface ListF extends BaseFrame { nodes: { val: number; state: 'untouched' | 'prev' | 'curr' | 'next' | 'done' }[]; doneCount: number }
interface TreeF extends BaseFrame { visited: number[]; current: number }
interface GridF extends BaseFrame { visited: Set<string>; frontier: Set<string>; path?: Set<string>; cur?: string }
interface DpF extends BaseFrame { table: number[][]; hi?: [number, number] }

type Frame =
  | { kind: 'sort'; f: SortF } | { kind: 'search'; f: SearchF } | { kind: 'two-pointer'; f: TwoPtrF }
  | { kind: 'sliding-window'; f: WindowF } | { kind: 'prefix-sum'; f: PrefixF } | { kind: 'recursion-tree'; f: RecF }
  | { kind: 'hash-table'; f: HashF } | { kind: 'stack'; f: StackF } | { kind: 'linked-list'; f: ListF }
  | { kind: 'tree-traversal'; f: TreeF } | { kind: 'grid'; f: GridF } | { kind: 'dp-table'; f: DpF };

/* ================= 帧生成 ================= */

function framesFor(kind: AlgoVizKind, param?: string): Frame[] {
  switch (kind) {
    case 'sort':
      return sortFrames(param ?? 'bubble');
    case 'binary-search':
      return searchFrames();
    case 'two-pointer':
      return twoPointerFrames();
    case 'sliding-window':
      return windowFrames();
    case 'prefix-sum':
      return prefixFrames();
    case 'recursion-tree':
      return recursionFrames();
    case 'hash-table':
      return hashFrames();
    case 'stack':
      return stackFrames();
    case 'linked-list':
      return listFrames();
    case 'tree-traversal':
      return treeFrames(param ?? 'inorder');
    case 'grid':
      return gridFrames(param ?? 'bfs');
    case 'dp-table':
      return dpFrames();
    default:
      return [{ kind: 'sort', f: { caption: '', arr: [], sorted: [] } }];
  }
}

function sortFrames(algo: string): Frame[] {
  const out: Frame[] = [];
  const push = (f: SortF) => out.push({ kind: 'sort', f });
  if (algo === 'bubble') {
    const arr = [38, 27, 43, 3, 9, 82, 10];
    const a = [...arr];
    const sorted: number[] = [];
    push({ caption: '冒泡排序：相邻比较，大的元素像气泡一样"浮"到末尾', arr: [...a], sorted: [] });
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - 1 - i; j++) {
        push({ caption: `比较 a[${j}]=${a[j]} 与 a[${j + 1}]=${a[j + 1]}`, arr: [...a], cmp: [j, j + 1], sorted: [...sorted] });
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          push({ caption: `${a[j + 1]} > ${a[j]} → 交换`, arr: [...a], swap: [j, j + 1], sorted: [...sorted] });
        }
      }
      sorted.unshift(a.length - 1 - i);
    }
    push({ caption: '完成！数组已有序', arr: [...a], sorted: a.map((_, i) => i) });
  } else if (algo === 'insertion') {
    const arr = [38, 27, 43, 3, 9, 82, 10];
    const a = [...arr];
    push({ caption: '插入排序：像整理扑克牌，把新牌插入左侧已排序区间', arr: [...a], sorted: [0] });
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      push({ caption: `取出 key=a[${i}]=${key}，在左侧找插入位置`, arr: [...a], pivot: i, sorted: Array.from({ length: i }, (_, k) => k) });
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        push({ caption: `a[${j}]=${a[j]} > key=${key} → 右移`, arr: [...a], cmp: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => k) });
        j--;
      }
      a[j + 1] = key;
      push({ caption: `key=${key} 插入到位置 ${j + 1}`, arr: [...a], pivot: j + 1, sorted: Array.from({ length: i + 1 }, (_, k) => k) });
    }
    push({ caption: '完成！数组已有序', arr: [...a], sorted: a.map((_, i) => i) });
  } else if (algo === 'selection') {
    const arr = [38, 27, 43, 3, 9, 82, 10];
    const a = [...arr];
    push({ caption: '选择排序：每轮从未排序区选出最小值，放到已排序区末尾', arr: [...a], sorted: [] });
    for (let i = 0; i < a.length - 1; i++) {
      let min = i;
      push({ caption: `第 ${i + 1} 轮：假设 a[${i}]=${a[i]} 是最小值`, arr: [...a], pivot: i, sorted: Array.from({ length: i }, (_, k) => k) });
      for (let j = i + 1; j < a.length; j++) {
        push({ caption: `比较 a[${j}]=${a[j]} 与当前最小 a[${min}]=${a[min]}`, arr: [...a], cmp: [j, min], sorted: Array.from({ length: i }, (_, k) => k) });
        if (a[j] < a[min]) {
          min = j;
          push({ caption: `发现更小值 a[${j}]=${a[j]}，更新 min`, arr: [...a], pivot: j, sorted: Array.from({ length: i }, (_, k) => k) });
        }
      }
      if (min !== i) [a[i], a[min]] = [a[min], a[i]];
      push({ caption: `最小值 ${a[i]} 与 a[${i}] 交换`, arr: [...a], swap: [i, min], sorted: Array.from({ length: i + 1 }, (_, k) => k) });
    }
    push({ caption: '完成！数组已有序', arr: [...a], sorted: a.map((_, i) => i) });
  } else if (algo === 'merge') {
    const arr = [38, 27, 43, 3, 9, 82, 10];
    const a = [...arr];
    push({ caption: '归并排序：递归二分 → 有序子数组两两合并', arr: [...a], sorted: [] });
    const sortRange = (l: number, r: number) => {
      if (l >= r) return;
      const m = (l + r) >> 1;
      sortRange(l, m);
      sortRange(m + 1, r);
      const merged = [...a];
      let i = l, j = m + 1, k = l;
      while (i <= m && j <= r) merged[k++] = a[i] <= a[j] ? a[i++] : a[j++];
      while (i <= m) merged[k++] = a[i++];
      while (j <= r) merged[k++] = a[j++];
      for (let t = l; t <= r; t++) a[t] = merged[t];
      push({ caption: `合并 [${l}..${m}] 与 [${m + 1}..${r}] → 有序区间`, arr: [...a], range: [l, r], sorted: [] });
    };
    sortRange(0, a.length - 1);
    push({ caption: '完成！数组已有序', arr: [...a], sorted: a.map((_, i) => i) });
  } else {
    // quick
    const arr = [38, 27, 43, 3, 9, 82, 10];
    const a = [...arr];
    const sorted: number[] = [];
    push({ caption: '快速排序：选定基准 pivot，小的放左、大的放右，再分而治之', arr: [...a], sorted: [] });
    const qs = (l: number, r: number) => {
      if (l > r) return;
      if (l === r) {
        sorted.push(l);
        push({ caption: `单元素区间 [${l}] 天然有序`, arr: [...a], sorted: [...sorted] });
        return;
      }
      const pivot = a[r];
      push({ caption: `区间 [${l}..${r}]，选 pivot=a[${r}]=${pivot}`, arr: [...a], pivot: r, sorted: [...sorted] });
      let i = l;
      for (let j = l; j < r; j++) {
        push({ caption: `j=${j}：a[${j}]=${a[j]} 与 pivot=${pivot} 比较`, arr: [...a], cmp: [j, r], pivot: r, sorted: [...sorted] });
        if (a[j] < pivot) {
          if (i !== j) {
            [a[i], a[j]] = [a[j], a[i]];
            push({ caption: `a[${j}] < pivot → 换到左侧（与 a[${i}] 交换）`, arr: [...a], swap: [i, j], sorted: [...sorted] });
          }
          i++;
        }
      }
      [a[i], a[r]] = [a[r], a[i]];
      sorted.push(i);
      push({ caption: `pivot=${pivot} 归位到 ${i}（左小右大）`, arr: [...a], swap: [i, r], sorted: [...sorted] });
      qs(l, i - 1);
      qs(i + 1, r);
    };
    qs(0, a.length - 1);
    push({ caption: '完成！数组已有序', arr: [...a], sorted: a.map((_, i) => i) });
  }
  return out;
}

function searchFrames(): Frame[] {
  const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const target = 23;
  const out: Frame[] = [{ kind: 'search', f: { caption: `二分查找：在有序数组中找 ${target}，每次比较排除一半`, lo: 0, hi: arr.length - 1 } }];
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    out.push({ kind: 'search', f: { caption: `[${lo}..${hi}] 中点 mid=${mid}，a[mid]=${arr[mid]} ${arr[mid] === target ? '= ' : arr[mid] < target ? '< ' : '> '}目标 ${target}`, lo, hi, mid } });
    if (arr[mid] === target) {
      out.push({ kind: 'search', f: { caption: `✅ 找到 ${target}，下标 ${mid}！共比较 ${out.length} 次（线性查找平均要 ${arr.length} 次）`, lo, hi, mid, found: mid } });
      return out;
    }
    if (arr[mid] < target) {
      lo = mid + 1;
      out.push({ kind: 'search', f: { caption: `a[mid] < ${target} → 目标在右侧，lo = ${lo}`, lo, hi } });
    } else {
      hi = mid - 1;
      out.push({ kind: 'search', f: { caption: `a[mid] > ${target} → 目标在左侧，hi = ${hi}`, lo, hi } });
    }
  }
  return out;
}

function twoPointerFrames(): Frame[] {
  const s = 'abcba'.split('');
  const out: Frame[] = [];
  let l = 0, r = s.length - 1;
  let ok = true;
  out.push({ kind: 'two-pointer', f: { caption: '对撞双指针判回文：l 从头、r 从尾，向中间收拢', l, r, done: false } });
  while (l < r) {
    const match = s[l] === s[r];
    if (!match) ok = false;
    out.push({ kind: 'two-pointer', f: { caption: `s[${l}]='${s[l]}' ${match ? '=' : '≠'} s[${r}]='${s[r]}' ${match ? '✓ 继续收拢' : '✗ 不是回文'}`, l, r, match, done: false } });
    l++; r--;
  }
  out.push({ kind: 'two-pointer', f: { caption: ok ? '指针相遇且全程相等 →「abcba」是回文 ✅' : '存在不等位置 → 不是回文 ❌', l, r, done: true } });
  return out;
}

function windowFrames(): Frame[] {
  const arr = [2, 1, 5, 1, 3, 2, 6];
  const k = 3;
  const out: Frame[] = [];
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i];
  let best = sum;
  out.push({ kind: 'sliding-window', f: { caption: `首个窗口 [0..${k - 1}]，和 = ${sum}`, start: 0, end: k - 1, sum, best } });
  for (let i = k; i < arr.length; i++) {
    const old = arr[i - k];
    sum = sum - old + arr[i];
    if (sum > best) best = sum;
    out.push({ kind: 'sliding-window', f: { caption: `窗口右移：减去 a[${i - k}]=${old}，加上 a[${i}]=${arr[i]} → 和 = ${sum}${sum >= best ? `（目前最大 ${best}）` : ''}`, start: i - k + 1, end: i, sum, best, bestRange: [i - k + 1, i] } });
  }
  out.push({ kind: 'sliding-window', f: { caption: `完成！和最大的窗口是最后高亮区间，最大和 = ${best}（O(n) 而非 O(n·k)）`, start: 0, end: 0, sum: best, best, bestRange: [0, 0] } });
  // 重新算 best 区间收尾
  let bs = 0, bsum = -Infinity;
  for (let i = 0; i + k <= arr.length; i++) {
    let s2 = 0;
    for (let j = i; j < i + k; j++) s2 += arr[j];
    if (s2 > bsum) { bsum = s2; bs = i; }
  }
  out[out.length - 1] = { kind: 'sliding-window', f: { caption: `完成！最大和窗口 [${bs}..${bs + k - 1}]，最大和 = ${bsum}（整体 O(n)，而非 O(n·k)）`, start: bs, end: bs + k - 1, sum: bsum, best: bsum } };
  return out;
}

function prefixFrames(): Frame[] {
  const arr = [3, 1, 4, 1, 5, 9];
  const prefix = [0];
  const out: Frame[] = [{ kind: 'prefix-sum', f: { caption: '前缀和：prefix[i] = 前 i 个元素之和，查询区间和只需两数相减', prefix: [...prefix] } }];
  for (let i = 0; i < arr.length; i++) {
    prefix.push(prefix[i] + arr[i]);
    out.push({ kind: 'prefix-sum', f: { caption: `prefix[${i + 1}] = prefix[${i}] + a[${i}]=${arr[i]} → ${prefix[i + 1]}`, prefix: [...prefix], hi: i + 1 } });
  }
  out.push({ kind: 'prefix-sum', f: { caption: '查询示例：区间 [2..4] 的和 = prefix[5] - prefix[2] = 19 - 4 = 15', prefix: [...prefix], query: [2, 4] } });
  return out;
}

function recursionFrames(): Frame[] {
  const out: Frame[] = [];
  let id = 0;
  const tree: RecF['tree'] = [];
  const fib = (n: number, depth: number): number => {
    const myId = id++;
    tree.push({ id: myId, label: `fib(${n})`, depth, state: 'call' });
    out.push({ kind: 'recursion-tree', f: { caption: `调用 fib(${n})${n <= 1 ? ' → 触底：直接返回 ' + n : ''}`, tree: tree.map((t) => ({ ...t, state: t.id === myId ? 'active' : t.state })) } });
    let v: number;
    if (n <= 1) v = n;
    else v = fib(n - 1, depth + 1) + fib(n - 2, depth + 1);
    const self = tree.find((t) => t.id === myId)!;
    self.state = 'returned';
    self.value = v;
    out.push({ kind: 'recursion-tree', f: { caption: `fib(${n}) 返回 ${v}`, tree: tree.map((t) => ({ ...t })) } });
    return v;
  };
  out.push({ kind: 'recursion-tree', f: { caption: '递归调用树：fib(5) 会把问题拆成子问题……注意同样的子问题被重复计算（绿色为重复）', tree: [] } });
  fib(5, 0);
  return out;
}

function hashFrames(): Frame[] {
  const buckets: string[][] = Array.from({ length: 8 }, () => []);
  const out: Frame[] = [{ kind: 'hash-table', f: { caption: '哈希表：hash(key) % 桶数 决定存放位置，平均 O(1) 存取', buckets: buckets.map((b) => [...b]) } }];
  const keys = ['Ana', 'Bob', 'Cy', 'Dan', 'Eva'];
  for (const k of keys) {
    const h = (k.charCodeAt(0) + k.length) % 8;
    const collide = buckets[h].length > 0;
    buckets[h].push(k);
    out.push({ kind: 'hash-table', f: { caption: `插入 "${k}"：hash("${k}")=${h}${collide ? ' ⚠️ 冲突！用链表追加到同一桶（拉链法）' : ''}`, buckets: buckets.map((b) => [...b]), hiBucket: h, hiValue: k } });
  }
  out.push({ kind: 'hash-table', f: { caption: '查找 "Dan"：同样计算 hash → 直达桶 → 桶内短链比对 → O(1)~O(链长)', buckets: buckets.map((b) => [...b]), hiBucket: (4 + 3) % 8, hiValue: 'Dan' } });
  return out;
}

function stackFrames(): Frame[] {
  const s = '({[]})'.split('');
  const out: Frame[] = [];
  const stack: string[] = [];
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  out.push({ kind: 'stack', f: { caption: '括号匹配：左括号入栈，右括号找栈顶配对 —— 后进先出（LIFO）', chars: s.map((ch) => ({ ch, state: 'pending' })), stack: [], ok: true } });
  let ok = true;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
      out.push({ kind: 'stack', f: { caption: `"${ch}" 是左括号 → 入栈`, chars: s.map((c, j) => ({ ch: c, state: j < i ? 'done' : j === i ? 'active' : 'pending' })), stack: [...stack], ok: true } });
    } else {
      const top = stack.pop();
      const good = top === pairs[ch];
      if (!good) ok = false;
      out.push({ kind: 'stack', f: { caption: `"${ch}" 是右括号 → 栈顶 "${top ?? '空'}" ${good ? '配对成功，弹出' : '✗ 配对失败'}`, chars: s.map((c, j) => ({ ch: c, state: j < i ? 'done' : j === i ? 'active' : 'pending' })), stack: [...stack], ok: good } });
    }
  }
  out.push({ kind: 'stack', f: { caption: ok && stack.length === 0 ? '扫描完成且栈空 → 括号完全匹配 ✅' : '栈非空或不匹配 → 括号无效 ❌', chars: s.map((c) => ({ ch: c, state: 'done' as const })), stack: [...stack], ok } });
  return out;
}

function listFrames(): Frame[] {
  const vals = [1, 2, 3, 4];
  const out: Frame[] = [{ kind: 'linked-list', f: { caption: '反转链表：三指针 prev/curr/next，逐个掉头指向', nodes: vals.map((v) => ({ val: v, state: 'untouched' as const })), doneCount: 0 } }];
  const states = vals.map(() => 'untouched' as 'untouched' | 'prev' | 'curr' | 'next' | 'done');
  let prevIdx = -1, curr = 0;
  while (curr < vals.length) {
    states[curr] = 'curr';
    if (prevIdx >= 0) states[prevIdx] = 'prev';
    if (curr + 1 < vals.length) states[curr + 1] = 'next';
    out.push({ kind: 'linked-list', f: { caption: `curr=${vals[curr]}：让 curr.next 指向 prev（原来的箭头断开重连）`, nodes: vals.map((v, i) => ({ val: v, state: states[i] })), doneCount: prevIdx } });
    states[curr] = 'done';
    prevIdx = curr;
    curr++;
  }
  out.push({ kind: 'linked-list', f: { caption: '全部反转完成：4→3→2→1，时间 O(n)、空间 O(1)', nodes: vals.map((v) => ({ val: v, state: 'done' as const })), doneCount: vals.length } });
  return out;
}

const TREE_NODES = [
  { id: 8, x: 50, y: 8 },
  { id: 3, x: 28, y: 30 }, { id: 10, x: 72, y: 30 },
  { id: 1, x: 16, y: 52 }, { id: 6, x: 40, y: 52 }, { id: 14, x: 84, y: 52 },
  { id: 4, x: 32, y: 74 }, { id: 7, x: 48, y: 74 }, { id: 13, x: 92, y: 74 },
];
const TREE_EDGES: [number, number][] = [[8, 3], [8, 10], [3, 1], [3, 6], [10, 14], [6, 4], [6, 7], [14, 13]];

function treeFrames(order: string): Frame[] {
  const seq: number[] =
    order === 'preorder' ? [8, 3, 1, 6, 4, 7, 10, 14, 13]
    : order === 'postorder' ? [1, 4, 7, 6, 3, 13, 14, 10, 8]
    : [1, 3, 4, 6, 7, 8, 10, 13, 14];
  const out: Frame[] = [{ kind: 'tree-traversal', f: { caption: `${order === 'preorder' ? '前序（根左右）' : order === 'postorder' ? '后序（左右根）' : '中序（左根右）——对 BST 恰好是升序'}遍历`, visited: [], current: -1 } }];
  const visited: number[] = [];
  for (const id of seq) {
    visited.push(id);
    out.push({ kind: 'tree-traversal', f: { caption: `访问节点 ${id}（已访问序列：${visited.join(' → ')}）`, visited: [...visited], current: id } });
  }
  out.push({ kind: 'tree-traversal', f: { caption: '遍历完成', visited: [...visited], current: -1 } });
  return out;
}

const GRID_SIZE = 5;
const GRID_WALLS = new Set(['1-1', '2-1', '3-3', '1-3', '3-1']);
const GRID_START = '0-0';
const GRID_END = '4-4';

function gridFrames(mode: string): Frame[] {
  const out: Frame[] = [];
  const key = (r: number, c: number) => `${r}-${c}`;
  const visited = new Set<string>([GRID_START]);
  const frontier = new Set<string>();
  const parent = new Map<string, string>();
  if (mode === 'bfs') {
    const queue: string[] = [GRID_START];
    frontier.add(GRID_START);
    out.push({ kind: 'grid', f: { caption: 'BFS 广度优先：队列（FIFO）逐层扩散，最先到达终点的就是最短路', visited: new Set(visited), frontier: new Set(frontier) } });
    while (queue.length > 0) {
      const cur = queue.shift()!;
      frontier.delete(cur);
      const [r, c] = cur.split('-').map(Number);
      out.push({ kind: 'grid', f: { caption: `出队 (${r},${c})，探索四邻`, visited: new Set(visited), frontier: new Set(frontier), cur } });
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nr = r + dr, nc = c + dc, nk = key(nr, nc);
        if (nr < 0 || nc < 0 || nr >= GRID_SIZE || nc >= GRID_SIZE) continue;
        if (GRID_WALLS.has(nk) || visited.has(nk)) continue;
        visited.add(nk);
        parent.set(nk, cur);
        frontier.add(nk);
        queue.push(nk);
        if (nk === GRID_END) {
          out.push({ kind: 'grid', f: { caption: `🎯 到达终点 (${nr},${nc})！开始回溯最短路径`, visited: new Set(visited), frontier: new Set(frontier), cur: nk } });
          const path = new Set<string>();
          let p: string | undefined = GRID_END;
          while (p) { path.add(p); p = parent.get(p); }
          out.push({ kind: 'grid', f: { caption: `BFS 最短路长度：${path.size} 格（层数即距离，这就是 BFS 求最短路的原理）`, visited: new Set(visited), frontier: new Set(), path } });
          return out;
        }
      }
    }
  } else {
    const stack: string[] = [GRID_START];
    frontier.add(GRID_START);
    out.push({ kind: 'grid', f: { caption: 'DFS 深度优先：栈（LIFO）一条路走到黑，撞墙再回头', visited: new Set(visited), frontier: new Set(frontier) } });
    while (stack.length > 0) {
      const cur = stack[stack.length - 1];
      frontier.delete(cur);
      const [r, c] = cur.split('-').map(Number);
      out.push({ kind: 'grid', f: { caption: `栈顶 (${r},${c})，探索未访问邻居`, visited: new Set(visited), frontier: new Set(frontier), cur } });
      let pushed = false;
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nr = r + dr, nc = c + dc, nk = key(nr, nc);
        if (nr < 0 || nc < 0 || nr >= GRID_SIZE || nc >= GRID_SIZE) continue;
        if (GRID_WALLS.has(nk) || visited.has(nk)) continue;
        visited.add(nk);
        frontier.add(nk);
        stack.push(nk);
        pushed = true;
        break;
      }
      if (!pushed) {
        stack.pop();
        out.push({ kind: 'grid', f: { caption: `(${r},${c}) 无路可走 → 回溯（弹出栈）`, visited: new Set(visited), frontier: new Set(frontier) } });
      }
      if (visited.has(GRID_END)) {
        const path = new Set<string>();
        let p: string | undefined = GRID_END;
        while (p) { path.add(p); p = parent.get(p); }
        out.push({ kind: 'grid', f: { caption: `🎯 DFS 找到一条路径（${path.size} 格）——注意它不保证最短，这就是与 BFS 的区别`, visited: new Set(visited), frontier: new Set(), path } });
        return out;
      }
    }
  }
  return out;
}

function dpFrames(): Frame[] {
  const X = 'ABCB', Y = 'BDCB';
  const m = X.length, n = Y.length;
  const t: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const out: Frame[] = [{ kind: 'dp-table', f: { caption: `最长公共子序列 LCS：dp[i][j] = X[..i] 与 Y[..j] 的 LCS 长度（X=${X}, Y=${Y}）`, table: t.map((r) => [...r]) } }];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (X[i - 1] === Y[j - 1]) {
        t[i][j] = t[i - 1][j - 1] + 1;
        out.push({ kind: 'dp-table', f: { caption: `X[${i - 1}]='${X[i - 1]}' = Y[${j - 1}]='${Y[j - 1]}' → dp[${i}][${j}] = 左上 + 1 = ${t[i][j]}`, table: t.map((r) => [...r]), hi: [i, j] } });
      } else {
        t[i][j] = Math.max(t[i - 1][j], t[i][j - 1]);
        out.push({ kind: 'dp-table', f: { caption: `'${X[i - 1]}' ≠ '${Y[j - 1]}' → dp[${i}][${j}] = max(上, 左) = ${t[i][j]}`, table: t.map((r) => [...r]), hi: [i, j] } });
      }
    }
  }
  out.push({ kind: 'dp-table', f: { caption: `填表完成：LCS 长度 = dp[${m}][${n}] = ${t[m][n]}（右下角）。每个格子只依赖上/左/左上 —— 这就是"无后效性"`, table: t.map((r) => [...r]), hi: [m, n] } });
  return out;
}

/* ================= 播放器组件 ================= */

export function AlgoVisualizer({ kind, param }: { kind: AlgoVizKind; param?: string }) {
  const frames = useMemo(() => framesFor(kind, param), [kind, param]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    if (playing) {
      timer.current = setInterval(() => {
        setIdx((i) => {
          if (i + 1 >= frames.length) {
            setPlaying(false);
            return i;
          }
          return i + 1;
        });
      }, 850 / speed);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, speed, frames.length]);

  const frame = frames[Math.min(idx, frames.length - 1)];
  const done = idx >= frames.length - 1;

  return (
    <div className="rounded-xl border border-night-700 bg-night-950/60 p-3.5">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-300">📊 算法可视化</span>
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => { setIdx(0); setPlaying(false); }} title="重置" className="grid h-7 w-7 place-items-center rounded-md border border-night-700 text-slate-400 hover:text-slate-200">
            <RotateCcw size={12} />
          </button>
          <button onClick={() => { if (done) setIdx(0); setPlaying(!playing); }} title={playing ? '暂停' : '播放'} className="grid h-7 w-7 place-items-center rounded-md bg-quest-500/20 text-quest-300 hover:bg-quest-500/30">
            {playing ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button onClick={() => { setPlaying(false); setIdx((i) => Math.min(i + 1, frames.length - 1)); }} title="单步" className="grid h-7 w-7 place-items-center rounded-md border border-night-700 text-slate-400 hover:text-slate-200">
            <SkipForward size={12} />
          </button>
          <button onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))} className="rounded-md border border-night-700 px-1.5 py-1 text-[10px] font-semibold text-slate-400 hover:text-slate-200">
            {speed}x
          </button>
          <span className="text-[10px] text-slate-600">{idx + 1}/{frames.length}</span>
        </div>
      </div>

      <div className="min-h-[120px]">{renderFrame(frame)}</div>

      <div className="mt-2.5 rounded-lg bg-night-900 px-3 py-2 text-xs leading-relaxed text-slate-300">
        {frame.f.caption}
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-night-800">
        <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-quest-500 transition-all" style={{ width: `${((idx + 1) / frames.length) * 100}%` }} />
      </div>
    </div>
  );
}

function renderFrame(frame: Frame) {
  switch (frame.kind) {
    case 'sort': {
      const { arr, cmp, swap, pivot, sorted, range } = frame.f;
      const max = Math.max(...arr, 1);
      return (
        <div className="flex h-[130px] items-end gap-1.5 px-1">
          {arr.map((v, i) => {
            const state =
              swap?.includes(i) ? 'bg-rose-400'
              : cmp?.includes(i) ? 'bg-gold-400'
              : i === pivot ? 'bg-fuchsia-400'
              : sorted.includes(i) ? 'bg-emerald-400'
              : range && i >= range[0] && i <= range[1] ? 'bg-quest-400'
              : 'bg-slate-500';
            return (
              <motion.div key={i} layout transition={{ duration: 0.25 }} className={`flex w-full flex-col items-center ${state === 'bg-slate-500' ? 'bg-slate-500' : state}`}>
                <span className="mb-0.5 text-[9px] text-slate-400">{v}</span>
                <div className={`w-full rounded-t ${state}`} style={{ height: `${(v / max) * 92 + 6}px` }} />
                <span className="mt-0.5 text-[8px] text-slate-600">{i}</span>
              </motion.div>
            );
          })}
        </div>
      );
    }
    case 'search': {
      const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
      const { lo, hi, mid, found } = frame.f;
      return (
        <div className="flex gap-1.5 px-1 pt-4">
          {arr.map((v, i) => {
            const inRange = i >= lo && i <= hi;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className={`grid h-10 w-full place-items-center rounded-md text-xs font-bold ${
                  i === found ? 'bg-emerald-500 text-white' : i === mid ? 'bg-gold-400 text-night-950' : inRange ? 'bg-night-700 text-slate-200' : 'bg-night-850 text-slate-700'
                }`}>{v}</div>
                <span className={`text-[9px] ${i === lo ? 'font-bold text-sky-400' : 'text-slate-700'}`}>{i === lo ? 'lo' : ''}</span>
                <span className={`text-[9px] ${i === hi ? 'font-bold text-rose-400' : 'text-slate-700'}`}>{i === hi ? 'hi' : ''}</span>
                <span className={`text-[9px] ${i === mid ? 'font-bold text-gold-300' : 'text-slate-700'}`}>{i === mid ? 'mid' : ''}</span>
              </div>
            );
          })}
        </div>
      );
    }
    case 'two-pointer': {
      const s = 'abcba'.split('');
      const { l, r, match, done } = frame.f;
      return (
        <div className="flex gap-2 px-2 pt-4">
          {s.map((ch, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className={`grid h-11 w-full place-items-center rounded-lg font-mono text-lg font-bold ${
                done ? 'bg-emerald-500/80 text-white'
                : i === l ? (match === false ? 'bg-rose-500 text-white' : 'bg-sky-500 text-white')
                : i === r ? (match === false ? 'bg-rose-500 text-white' : 'bg-violet-500 text-white')
                : 'bg-night-800 text-slate-400'
              }`}>{ch}</div>
              <span className="text-[9px] font-bold text-slate-500">{i === l ? '↑l' : i === r ? 'r↑' : ''}</span>
            </div>
          ))}
        </div>
      );
    }
    case 'sliding-window': {
      const arr = [2, 1, 5, 1, 3, 2, 6];
      const { start, end, bestRange } = frame.f;
      return (
        <div className="flex gap-1.5 px-1 pt-4">
          {arr.map((v, i) => {
            const inWin = i >= start && i <= end;
            const isBest = bestRange && i >= bestRange[0] && i <= bestRange[1];
            return (
              <div key={i} className="flex flex-1 flex-col items-center">
                <div className={`grid h-11 w-full place-items-center rounded-md text-sm font-bold ${
                  isBest ? 'bg-emerald-500/90 text-white' : inWin ? 'bg-quest-500 text-white' : 'bg-night-800 text-slate-500'
                }`}>{v}</div>
                <span className="mt-1 text-[9px] text-slate-600">{i}</span>
              </div>
            );
          })}
        </div>
      );
    }
    case 'prefix-sum': {
      const { prefix, hi, query } = frame.f;
      return (
        <div className="space-y-1.5 px-1 pt-1">
          {prefix.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-20 text-right text-[10px] text-slate-500">prefix[{i}]</span>
              <div className={`grid h-7 place-items-center rounded ${hi === i ? 'w-14 bg-quest-500 font-bold text-white' : query && (i === query[0] || i === query[1]) ? 'w-14 bg-gold-400 font-bold text-night-950' : 'w-14 bg-night-800 text-slate-300'}`}>{v}</div>
            </div>
          ))}
        </div>
      );
    }
    case 'recursion-tree': {
      const { tree } = frame.f;
      return (
        <div className="max-h-[150px] overflow-y-auto px-2 py-1">
          {tree.map((n) => (
            <div key={n.id} style={{ paddingLeft: n.depth * 22 }} className={`flex items-center gap-2 rounded px-1.5 py-0.5 text-xs ${
              n.state === 'active' ? 'bg-gold-400/20 font-bold text-gold-300' : n.state === 'returned' ? 'text-emerald-300' : 'text-slate-400'
            }`}>
              <span>{n.depth > 0 ? '└─' : ''}</span>
              <span className="font-mono">{n.label}</span>
              {n.state === 'returned' && n.value !== undefined && <span className="text-[10px] text-emerald-400">= {n.value}</span>}
            </div>
          ))}
        </div>
      );
    }
    case 'hash-table': {
      const { buckets, hiBucket, hiValue } = frame.f;
      return (
        <div className="grid grid-cols-4 gap-1.5 px-1">
          {buckets.map((b, i) => (
            <div key={i} className={`rounded-md border p-1.5 ${i === hiBucket ? 'border-gold-400/70 bg-gold-400/10' : 'border-night-700 bg-night-900'}`}>
              <div className="mb-1 text-[9px] text-slate-500">桶 {i}</div>
              {b.map((v) => (
                <div key={v} className={`mb-0.5 rounded px-1 py-0.5 text-center text-[10px] ${v === hiValue ? 'bg-gold-400 font-bold text-night-950' : 'bg-night-700 text-slate-300'}`}>{v}</div>
              ))}
            </div>
          ))}
        </div>
      );
    }
    case 'stack': {
      const { chars, stack, ok } = frame.f;
      return (
        <div className="flex items-center gap-6 px-2">
          <div className="flex gap-1.5">
            {chars.map((c, i) => (
              <div key={i} className={`grid h-9 w-9 place-items-center rounded-md font-mono text-sm ${
                c.state === 'active' ? 'bg-gold-400 font-bold text-night-950' : c.state === 'done' ? 'bg-emerald-500/70 text-white' : 'bg-night-800 text-slate-400'
              }`}>{c.ch}</div>
            ))}
          </div>
          <div className="flex min-h-[100px] w-24 flex-col-reverse items-center gap-1 rounded-lg border-2 border-t-0 border-night-600 bg-night-900 p-1.5">
            {stack.map((v, i) => (
              <div key={i} className="w-full rounded bg-quest-500/80 py-0.5 text-center font-mono text-xs text-white">{v}</div>
            ))}
            {stack.length === 0 && <span className="py-2 text-[10px] italic text-slate-600">栈空</span>}
          </div>
          {ok === false && <span className="text-lg">❌</span>}
        </div>
      );
    }
    case 'linked-list': {
      const { nodes } = frame.f;
      const color = (s: string) =>
        s === 'prev' ? 'bg-sky-500 text-white' : s === 'curr' ? 'bg-gold-400 text-night-950' : s === 'next' ? 'bg-violet-500 text-white' : s === 'done' ? 'bg-emerald-500/80 text-white' : 'bg-night-800 text-slate-400';
      return (
        <div className="flex items-center gap-1.5 px-2 py-2">
          {nodes.map((n, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`grid h-10 w-12 place-items-center rounded-lg font-mono text-sm font-bold ${color(n.state)}`}>{n.val}</div>
              {i < nodes.length - 1 && <span className={n.state === 'curr' ? 'text-gold-300' : 'text-slate-600'}>→</span>}
            </div>
          ))}
          <span className="ml-2 rounded bg-night-800 px-1.5 py-0.5 text-[9px] text-slate-500">prev / curr / next 高亮</span>
        </div>
      );
    }
    case 'tree-traversal': {
      const { visited, current } = frame.f;
      return (
        <div className="relative mx-auto h-[160px] w-full max-w-md">
          <svg viewBox="0 0 100 90" className="h-full w-full">
            {TREE_EDGES.map(([a, b]) => {
              const na = TREE_NODES.find((n) => n.id === a)!;
              const nb = TREE_NODES.find((n) => n.id === b)!;
              return <line key={`${a}-${b}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="#2b3a5c" strokeWidth="0.8" />;
            })}
            {TREE_NODES.map((n) => {
              const vi = visited.indexOf(n.id);
              return (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={current === n.id ? 6 : 5}
                    fill={current === n.id ? '#fbbf24' : vi >= 0 ? '#34d399' : '#1e2942'}
                    stroke={vi >= 0 ? '#6ee7b7' : '#3b4d78'} strokeWidth="0.6" />
                  <text x={n.x} y={n.y + 1.6} textAnchor="middle" fontSize="4.2" fill={vi >= 0 || current === n.id ? '#0b1020' : '#94a3b8'} fontWeight="bold">{n.id}</text>
                  {vi >= 0 && <text x={n.x} y={n.y - 7} textAnchor="middle" fontSize="3.6" fill="#34d399">{vi + 1}</text>}
                </g>
              );
            })}
          </svg>
        </div>
      );
    }
    case 'grid': {
      const { visited, frontier, path, cur } = frame.f;
      return (
        <div className="mx-auto grid w-fit grid-cols-5 gap-1">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, idx) => {
            const r = Math.floor(idx / GRID_SIZE), c = idx % GRID_SIZE;
            const k = `${r}-${c}`;
            const isWall = GRID_WALLS.has(k);
            const isStart = k === GRID_START, isEnd = k === GRID_END;
            return (
              <div key={k} className={`grid h-9 w-9 place-items-center rounded text-xs font-bold ${
                isWall ? 'bg-night-950 text-slate-700' : path?.has(k) ? 'bg-emerald-500 text-white' : k === cur ? 'bg-gold-400 text-night-950' : frontier.has(k) ? 'bg-sky-500/60 text-white' : visited.has(k) ? 'bg-quest-500/50 text-white' : 'bg-night-800 text-slate-600'
              }`}>{isWall ? '⬛' : isStart ? 'S' : isEnd ? 'E' : ''}</div>
            );
          })}
        </div>
      );
    }
    case 'dp-table': {
      const X = 'ABCB', Y = 'BDCB';
      const { table, hi } = frame.f;
      return (
        <div className="mx-auto w-fit">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${Y.length + 1}, minmax(0, 1fr))` }}>
            <div />
            {Y.split('').map((y, j) => <div key={j} className="grid h-7 place-items-center text-[10px] font-bold text-slate-500">{y}</div>)}
            {table.map((row, i) => (
              <div key={i} className="contents">
                <div className="grid h-7 place-items-center text-[10px] font-bold text-slate-500">{i === 0 ? 'ε' : X[i - 1]}</div>
                {row.map((v, j) => (
                  <div key={j} className={`m-[1px] grid h-7 place-items-center rounded text-xs font-bold ${
                    hi && hi[0] === i && hi[1] === j ? 'bg-gold-400 text-night-950' : v > 0 ? 'bg-quest-500/40 text-slate-100' : 'bg-night-800 text-slate-600'
                  }`}>{v}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}
