import type { Term } from './types';

/** dsa 领域术语：复杂度与基础 / 线性结构 / 哈希与集合 / 树 / 图 / 排序算法 / 搜索与递归 / 动态规划 / 高频技巧 */
export const DSA_DSA: Term[] = [
  // ==================== 复杂度与基础 ====================
  {
    id: 'dsa-big-o',
    name: '大 O 表示法',
    en: 'Big O Notation',
    cat: 'dsa',
    sub: '复杂度与基础',
    tags: ['复杂度', '基础'],
    summary: '大 O 表示法描述算法耗时或耗空间随输入规模 n 增长的上界趋势，忽略常数与低阶项。',
    detail: `**是什么**：大 O 是复杂度的渐近上界记号：T(n) = O(f(n)) 表示 n 足够大后，运行时间不超过 c·f(n)。它抹去机器差异与常数因子，只回答"规模大十倍，耗时变几倍"。

**常见层级（由快到慢）**：
- O(1)：数组下标访问、哈希查取
- O(log n)：二分查找、平衡树操作
- O(n)：单层扫描
- O(n log n)：快排、归并等高效排序
- O(n²) / O(2ⁿ)：双重循环暴力 / 子集枚举

**运算规则**：只保留最高阶项；顺序执行取最大者，嵌套循环相乘。

**坑**：O 是上界而非精确值——O(n) 的算法也可以说成 O(n²)；面试报告复杂度默认按最坏情况。`,
    relations: [
      { to: 'dsa-time-space', desc: '时间与空间是大 O 度量的两个维度' },
    ],
    example: `// 数循环法：看关键语句执行次数随 n 的增长
function f(arr, n) {
  let s = 0;
  s += arr[0];                              // O(1)
  for (let i = 0; i < n; i++) s += arr[i];  // O(n)
  for (let i = 0; i < n; i++)               // 嵌套相乘 => O(n^2)
    for (let j = i + 1; j < n; j++) s += arr[i] * arr[j];
  return s;
}
// 常见复杂度由快到慢：
// O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)`,
    exampleLang: 'js',
    interview: '高频：给代码片段口算复杂度；为什么忽略常数（不同机器常数不同，增长趋势才本质）；n 的规模与可行复杂度对应——10^5 量级数据基本锁定 O(n log n) 以内。',
  },
  {
    id: 'dsa-time-space',
    name: '时间与空间复杂度',
    en: 'Time & Space Complexity',
    cat: 'dsa',
    sub: '复杂度与基础',
    tags: ['复杂度', '分析'],
    summary: '时间复杂度估计算法基本操作次数随 n 的增长，空间复杂度估算额外内存占用，两者常可互换。',
    detail: `**是什么**：时间复杂度 T(n) 统计"基本操作执行次数"随输入规模 n 的增长阶；空间复杂度 S(n) 统计"额外辅助空间"（不含输入本身）的增长阶。

**怎么算**：
- 时间：找最深层循环的关键操作，顺序取最大、嵌套相乘
- 空间：新开的数组/哈希/矩阵 + 递归调用栈深度
- 递归：每层代价 × 调用数

**时空权衡**：多数优化是空间换时间——用哈希集合把 O(n²) 的查找降为 O(n)、用前缀和把区间查询降为 O(1)；反向如滚动数组把二维 DP 压到一维空间。

**坑**：递归调用栈也是空间，深 n 的递归就是 O(n) 栈空间，可能爆栈；不要把输入本身占的空间计入。`,
    relations: [
      { to: 'dsa-big-o', desc: '两者都用大 O 记号表达增长趋势' },
      { to: 'dsa-in-place', desc: '原地算法是 S(n)=O(1) 的极致要求' },
    ],
    example: `// 时空权衡：两数之和
// 暴力双循环：O(n^2) 时间 / O(1) 空间
// 哈希表：O(n) 时间 / O(n) 空间 —— 空间换时间
function twoSum(nums, target) {
  const seen = new Map();            // 额外 O(n) 空间
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];
    seen.set(nums[i], i);            // 平均 O(1)
  }
  return null;
}`,
    exampleLang: 'js',
    interview: '高频：给算法同时报时间与空间复杂度；递归的空间复杂度要算调用栈深度；说出一个自己做过的时间换空间/空间换时间的具体案例。',
  },
  {
    id: 'dsa-amortized',
    name: '均摊复杂度',
    en: 'Amortized Complexity',
    cat: 'dsa',
    sub: '复杂度与基础',
    tags: ['复杂度', '分析'],
    summary: '均摊复杂度把偶发的昂贵操作代价平摊到整个操作序列上，如动态数组 push 均摊 O(1)。',
    detail: `**是什么**：均摊（摊还）复杂度考察"一连串操作的总代价 ÷ 操作次数"：个别操作偶尔昂贵，但平均到整个序列上很便宜。

**典型案例**：
- 动态数组 push：扩容那次 O(n)，n 次 push 总代价 O(n)，均摊 O(1)
- 哈希表插入：rehash 那次 O(n)，均摊 O(1)
- 二进制计数器：n 次加一的总翻转位数 O(n)

**分析方法**：聚合法（总代价÷次数）、记账法（给廉价操作预存票券）、势能法（结构势能抵扣昂贵操作）。

**坑**：均摊不等于平均——平均是随机输入的期望，均摊是任意输入序列的最坏保证；单次最坏仍是 O(n)，实时系统要警惕扩容带来的毛刺。`,
    relations: [
      { to: 'dsa-dynamic-array', desc: '动态数组倍增扩容是均摊分析的教科书案例' },
      { to: 'dsa-load-factor', desc: '哈希表扩容同样靠均摊摊平 rehash 代价' },
      { to: 'dsa-big-o', desc: '均摊是大 O 在操作序列上的推广' },
    ],
    example: `// 动态数组的 push：均摊 O(1)
class DynArr {
  constructor() { this.a = [undefined]; this.len = 0; this.cap = 1; }
  push(x) {
    if (this.len === this.cap) {          // 满了才扩容
      this.cap *= 2;                      // 倍增：关键在按比例增长
      const b = new Array(this.cap);
      for (let i = 0; i < this.len; i++) b[i] = this.a[i]; // 这一次 O(n)
      this.a = b;
    }
    this.a[this.len++] = x;               // 平时 O(1)
  }
}
// 1 次搬移 O(n) + n 次写 O(1) => 总代价 O(n) => 均摊 O(1)
// 若每次只加 1 个容量：n 次 push 总代价 O(n^2)，均摊变 O(n)`,
    exampleLang: 'js',
    interview: '高频：为什么扩容必须倍增而不是每次加 1（加 1 会让 n 次 push 总代价 O(n²)）；均摊与平均的区别；Redis 渐进式 rehash 如何摊平扩容停顿。',
  },
  {
    id: 'dsa-stability',
    name: '排序稳定性',
    en: 'Sort Stability',
    cat: 'dsa',
    sub: '复杂度与基础',
    tags: ['排序', '性质'],
    summary: '稳定排序保证相等的元素排序后相对顺序不变，多字段排序与业务展示依赖这一性质。',
    detail: `**是什么**：稳定性指排序后"值相等"的元素保持原有序列中的相对次序——它不是性能指标，而是语义保证。

**各排序稳定性**：
- 稳定：冒泡、插入、归并、计数、桶、基数
- 不稳定：选择、快排、堆排、希尔（分区或远距离交换破坏次序）

**为什么重要**：
- 多字段排序：先按 B 排、再按 A 稳定排，等效于按 (A, B) 联合排序——不稳定排序会毁掉该技巧
- 业务展示：同分选手保持报名顺序

**坑**：JS 的 sort 自 ES2019 起规范要求稳定（TimSort 实现）；给不稳定排序"补"稳定性的通用做法是带原始下标作次级比较键。`,
    relations: [
      { to: 'dsa-sorting-family', desc: '选型时稳定性是与复杂度并列的核心维度' },
      { to: 'dsa-merge-sort-a', desc: '归并是通用稳定 O(n log n) 排序的代表' },
      { to: 'dsa-counting-sort', desc: '基数排序的每一轮依赖内部排序的稳定性' },
      { to: 'dsa-quick-sort-a', desc: '快排的不稳定来自分区时的远距离交换' },
    ],
    example: `// 多字段排序依赖稳定性：先按分数排，再按姓名稳定排
const students = [
  { name: 'Ann', score: 90 },
  { name: 'Bob', score: 85 },
  { name: 'Cid', score: 90 },
];
students.sort((a, b) => a.score - b.score);          // 第一步：按分数
students.sort((a, b) => a.name.localeCompare(b.name));
// 若第二步稳定：同分者仍保持第一步的相对次序

// 给不稳定排序"加"稳定性：带原始下标作次级键
const idx = [3, 1, 2, 3, 1];
idx.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);`,
    exampleLang: 'js',
    interview: '高频：背出哪些排序稳定/不稳定并说清原因（快排分区交换、堆排堆顶换尾）；稳定性的工程价值：多级排序、基数排序的前提。',
  },
  {
    id: 'dsa-in-place',
    name: '原地算法',
    en: 'In-place Algorithm',
    cat: 'dsa',
    sub: '复杂度与基础',
    tags: ['算法', '空间'],
    summary: '原地算法只占用 O(1) 额外空间、直接在输入上修改完成计算，是内存受限场景的关键设计。',
    detail: `**是什么**：原地（就地）算法只用 O(1)（或 O(log n)）额外空间、直接在输入数据结构上完成计算，以"覆盖输入"换低内存。

**经典操作**：
- 原地反转数组：双指针首尾交换，O(n) 时间 / O(1) 空间
- 快排分区、堆排：无辅助数组
- 原地移除元素：读写双指针压实
- 矩阵原地置零：借首行首列做标记位

**适用与代价**：内存受限（嵌入式、大数据批处理）首选；但输入被破坏，调用方还需原数据时必须先复制，反而多花 O(n)。

**坑**：递归的调用栈也算空间——归并的 O(n) 辅助数组使它不算原地；快排 O(log n) 递归栈通常仍被视作"可接受的原地"。`,
    relations: [
      { to: 'dsa-quick-sort-a', desc: '快排是原地排序代表：分区交换无需辅助数组' },
      { to: 'dsa-heap-sort-a', desc: '堆排 O(1) 额外空间，原地与 O(n log n) 兼得' },
      { to: 'dsa-merge-sort-a', desc: '归并的反例：常规实现需要 O(n) 辅助数组' },
    ],
    example: `// 原地反转：双指针交换，O(n) 时间 / O(1) 空间
function reverse(a) {
  let i = 0, j = a.length - 1;
  while (i < j) {
    [a[i], a[j]] = [a[j], a[i]];   // 直接在输入上换
    i++; j--;
  }
  return a;
}
// 原地移除元素：读写双指针，读指针跳过目标、写指针压实
function removeVal(a, v) {
  let w = 0;
  for (let r = 0; r < a.length; r++)
    if (a[r] !== v) a[w++] = a[r];
  return w;                        // 前 w 个是结果
}`,
    exampleLang: 'js',
    interview: '高频：哪些排序是原地的；原地与非原地的时间空间取舍；链表反转也是 O(1) 原地操作的经典面试题。',
  },

  // ==================== 线性结构 ====================
  {
    id: 'dsa-dynamic-array',
    name: '动态数组',
    en: 'Dynamic Array',
    cat: 'dsa',
    sub: '线性结构',
    tags: ['数组', '线性'],
    summary: '动态数组是自动扩容的连续内存数组，随机访问 O(1)、尾部插入均摊 O(1)，如 JS 的 Array。',
    detail: `**是什么**：动态数组在连续内存上存储元素，容量不足时自动申请更大内存并整体搬移，兼顾随机访问与"长度可变"。JS 的 Array、Python 的 list、Java 的 ArrayList、C++ 的 vector 都是它。

**核心操作**：
- 下标访问 O(1)：地址 = 首地址 + i × 元素大小
- 尾部 push / pop：均摊 O(1)
- 中间插入/删除 O(n)：整体搬移
- 查找：无序 O(n)，有序可二分 O(log n)

**实现要点**：扩容倍增（1.5~2 倍）保证均摊 O(1)；收缩设滞回阈值防反复抖动。

**对比**：链表插删 O(1) 但访问 O(n) 且指针开销大；连续内存对 CPU 缓存友好（预取有效），实践中动态数组几乎总是更快——"数组几乎总是赢家"。`,
    relations: [
      { to: 'dsa-linked-list-a', desc: '经典对照组：连续内存 vs 指针链，访问与插删的复杂度互换' },
      { to: 'dsa-amortized', desc: '扩容倍增使 push 均摊 O(1)' },
      { to: 'dsa-circular-buffer', desc: '定容环形缓冲是它"不扩容"的变体' },
    ],
    example: `// 手写动态数组：扩容与搬移的本质
class DynamicArray {
  #a = [undefined, undefined]; #len = 0;
  get(i) { return this.#a[i]; }                  // O(1) 随机访问
  push(x) {                                      // 均摊 O(1)
    if (this.#len === this.#a.length) this.#grow();
    this.#a[this.#len++] = x;
  }
  insert(i, x) {                                 // 中间插入 O(n)
    this.push(undefined);                        // 先保证容量
    for (let k = this.#len - 1; k > i; k--) this.#a[k] = this.#a[k-1];
    this.#a[i] = x;
  }
  #grow() {                                      // 倍增扩容
    const bigger = new Array(this.#a.length * 2);
    for (let i = 0; i < this.#len; i++) bigger[i] = this.#a[i];
    this.#a = bigger;                            // 整体搬移这一次 O(n)
  }
}`,
    exampleLang: 'js',
    interview: '高频：数组 vs 链表选型；为什么扩容选 2 倍或 1.5 倍（增长因子与内存浪费的折中）；JS 数组在引擎层可能是稀疏哈希存储的细节。',
  },
  {
    id: 'dsa-linked-list-a',
    name: '链表',
    en: 'Linked List',
    cat: 'dsa',
    sub: '线性结构',
    tags: ['链表', '线性'],
    summary: '链表用指针串联节点实现 O(1) 插删但 O(n) 查找，牺牲随机访问换取灵活的内存布局。',
    detail: `**是什么**：链表由节点组成，每个节点存数据与指向后继的指针，内存不必连续；插删只需改指针，但失去下标随机访问能力。

**核心操作（单链表）**：
- 按下标访问/查找 O(n)：必须从头走
- 已知节点后插入/删除 O(1)；头插头删 O(1)
- 尾插需尾指针辅助，否则 O(n)

**常用套路**：虚拟头节点（dummy）统一头部边界；快慢指针找中点、判环；反转链表是面试第一操。

**坑与对比**：每节点多一个指针的内存开销，且节点散落内存、CPU 预取失效，实测常输给动态数组；真正的用武之地是 LRU（配合哈希表）、内存池管理、元素规模未知且频繁头插的场景。`,
    relations: [
      { to: 'dsa-dynamic-array', desc: '最经典对照组：访问 O(1) vs O(n)、插删 O(n) vs O(1)' },
      { to: 'dsa-doubly-linked', desc: '双向链表补上 prev 指针，支持 O(1) 删除自身' },
    ],
    example: `class Node { constructor(v) { this.val = v; this.next = null; } }

// 反转链表：三指针迭代，O(n) 时间 O(1) 空间
function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;   // 先存后继
    cur.next = prev;         // 掉头
    prev = cur; cur = next;  // 双双前进
  }
  return prev;               // 新头
}

// 快慢指针判环：慢走 1 快走 2，相遇则有环
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    exampleLang: 'js',
    interview: '高频：反转链表；判环并找环入口（相遇后一头一慢同速再走）；合并有序链表；为什么生产代码里链表常不如数组好用。',
  },
  {
    id: 'dsa-doubly-linked',
    name: '双向链表',
    en: 'Doubly Linked List',
    cat: 'dsa',
    sub: '线性结构',
    tags: ['链表', '线性'],
    summary: '双向链表每个节点带 prev 与 next 指针，支持 O(1) 删除已知节点与双向遍历，是 LRU 的标配。',
    detail: `**是什么**：双向链表的每个节点同时持有 prev 与 next 两个指针，可从任一节点 O(1) 前进或后退。

**核心操作**：
- 已知节点删除 O(1)（单链表要 O(n) 找前驱）
- 头尾插删均 O(1)（配 head/tail 哨兵）
- 反向遍历 O(n)

**代价**：每节点多一个指针的内存开销；插删要同步维护四条链接，漏一条即断链。

**为什么 LRU 必用它**：命中后要把节点挪到"最新端"——O(1) 摘下任意节点 + O(1) 头插；哈希表负责定位、双向链表负责维护顺序，两者组合才有 O(1) 的 get/put。

**坑**：删除时先改 prev.next 再改 next.prev 的顺序别乱；哨兵节点能消灭全部空链表特判。`,
    relations: [
      { to: 'dsa-linked-list-a', desc: '单链表的升级：用空间换"回退"与 O(1) 自删除' },
      { to: 'dsa-deque', desc: '双端队列常用双向链表实现两端 O(1) 操作' },
    ],
    example: `class DNode { constructor(v) { this.val = v; this.prev = this.next = null; } }

// O(1) 摘除已知节点（哨兵保证链表非空）
function remove(node) {
  node.prev.next = node.next;
  node.next.prev = node.prev;
}
// O(1) 把节点插到 head 之后（MRU 端）
function insertAfter(head, node) {
  node.next = head.next; node.prev = head;
  head.next.prev = node; head.next = node;
}
// LRU get：哈希表查到节点 -> remove(node) -> insertAfter(head, node)
// LRU put：存在则更新并挪头；不存在则头插；超容量删 tail.prev`,
    exampleLang: 'js',
    interview: '高频：为什么 LRU 用双向而不是单链表（O(1) 删除需要 O(1) 拿到前驱）；Java 的 LinkedHashMap 如何一行实现 LRU；哨兵节点的作用。',
  },
  {
    id: 'dsa-stack-ds',
    name: '栈',
    en: 'Stack',
    cat: 'dsa',
    sub: '线性结构',
    tags: ['栈', '线性'],
    summary: '栈是后进先出 LIFO 的线性结构，push/pop/peek 均 O(1)，支撑函数调用与撤销等"最近优先"场景。',
    detail: `**是什么**：栈只允许在栈顶一端进出，后进先出（LIFO），像摞盘子——放、取都发生在顶端。

**核心操作**：push / pop / peek / 判空全部 O(1)；数组实现缓存更友好，链表实现免扩容。

**经典应用**：
- 函数调用栈：调用即压帧、返回即弹出，递归过深爆栈（Stack Overflow）由此得名
- 括号匹配、表达式求值、浏览器前进后退、编辑器撤销
- 单调栈："下一个更大元素"、柱状图最大矩形
- DFS 的显式实现

**坑**：出栈前必判空；LIFO 天然"反转顺序"，两个栈倒两次即可实现队列；单调栈的识别信号是"下一个更大/更小"。`,
    relations: [
      { to: 'dsa-queue-ds', desc: 'LIFO 与 FIFO 的镜像对照，两个栈可互相模拟' },
      { to: 'fe-event-loop', desc: 'JS 调用栈清空后才处理宏微任务，栈是事件循环的一环' },
      { to: 'dsa-recursion-a', desc: '递归即隐式使用系统调用栈' },
    ],
    example: `// 括号匹配：栈的经典应用，O(n) 时间
function isBalanced(s) {
  const pair = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);                 // 左括号入栈
    } else if (stack.pop() !== pair[ch]) {
      return false;                   // 栈顶必须是对应左括号
    }
  }
  return stack.length === 0;          // 有剩余则不匹配
}
isBalanced('a(b[c]d)e');  // true
isBalanced('a(b[c]d');    // false`,
    exampleLang: 'js',
    interview: '高频：括号匹配；用栈实现队列/用队列实现栈；最小栈（辅助栈同步维护最小值）；单调栈套路与识别信号。',
  },
  {
    id: 'dsa-queue-ds',
    name: '队列',
    en: 'Queue',
    cat: 'dsa',
    sub: '线性结构',
    tags: ['队列', '线性'],
    summary: '队列是先进先出 FIFO 的线性结构，入队出队均 O(1)，是 BFS 与异步任务调度的骨架。',
    detail: `**是什么**：队列从队尾入队、队头出队，先进先出（FIFO），保证处理顺序与到达顺序一致。

**核心操作**：enqueue / dequeue / front 均 O(1)。注意：动态数组直接头删会整体搬移退化 O(n)，须用循环缓冲或链表实现。

**经典应用**：
- BFS：层层扩散与无权图最短路
- 任务调度：线程池任务队列、打印队列
- 生产者-消费者之间的速度差缓冲

**变体**：双端队列（两端进出）、优先队列（按优先级出队，堆实现）、循环队列（定容环形数组）。

**坑**：后端语境的"消息队列 MQ"是跨进程/跨机器的中间件，与内存中的队列数据结构是两个层级的东西；JS 数组的 shift 是 O(n)，演示可以、生产不行。`,
    relations: [
      { to: 'dsa-bfs-a', desc: 'BFS 的灵魂：队列 FIFO 保证按层访问' },
      { to: 'dsa-stack-ds', desc: 'FIFO 与 LIFO 对照，双栈可互相模拟' },
      { to: 'dsa-circular-buffer', desc: '循环队列即环形缓冲，解决数组头删搬移' },
      { to: 'be-mq', desc: '消息队列是队列思想在分布式系统的工程化放大' },
    ],
    example: `// 用队列做二叉树层序遍历（BFS）
function levelOrder(root) {
  if (!root) return [];
  const queue = [root], res = [];
  while (queue.length) {
    const size = queue.length;
    const level = [];
    for (let i = 0; i < size; i++) {   // 一次处理一整层
      const node = queue.shift();      // 出队（示例简化；生产用环形缓冲/链表保证 O(1)）
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}`,
    exampleLang: 'js',
    interview: '高频：用栈实现队列（双栈倒序）；循环队列判满判空；BFS 为什么用队列而 DFS 用栈；消息队列与数据结构队列的区别。',
  },
  {
    id: 'dsa-deque',
    name: '双端队列',
    en: 'Deque (Double-Ended Queue)',
    cat: 'dsa',
    sub: '线性结构',
    tags: ['队列', '线性'],
    summary: '双端队列两端都可插入删除且均 O(1)，兼通栈与队列，单调队列专解滑动窗口极值。',
    detail: `**是什么**：双端队列（double-ended queue）在头尾两端都可 O(1) 插入与删除，同时具备栈与队列的能力。

**核心操作**：pushFront / pushBack / popFront / popBack 全 O(1)；中部访问 O(n)。常用循环数组（分段连续）或双向链表实现。

**最重要应用——单调队列**：维护值单调递减的下标队列，求滑动窗口最大值整体 O(n)：队尾弹出比新元素小的（它们永远不可能再成为最大值）、队头滑出窗口则弹出、队头即当前窗口最大值。

**其他应用**：浏览器前进后退、任务窃取调度器（偷别的队列尾部任务）、撤销重做。

**坑**：JS 数组的 unshift/shift 是 O(n)，不能当 deque 用；单调队列必须存下标而非值，才能判断"过期"。`,
    relations: [
      { to: 'dsa-queue-ds', desc: '队列与栈的推广体：两端皆可进出' },
      { to: 'dsa-sliding-window-a', desc: '单调队列是滑动窗口求极值的标配武器' },
      { to: 'dsa-doubly-linked', desc: '双向链表可实现两端 O(1) 的 deque' },
    ],
    example: `// 单调队列：滑动窗口最大值，整体 O(n)
function maxSlidingWindow(nums, k) {
  const dq = [];   // 存下标，对应值单调递减
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i])
      dq.pop();                                // 队尾淘汰更小者
    dq.push(i);
    if (dq[0] <= i - k) dq.shift();            // 队头过期出窗
    if (i >= k - 1) res.push(nums[dq[0]]);     // 队头即窗口最大值
  }
  return res;
}
maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3); // [3, 3, 5, 5, 6, 7]`,
    exampleLang: 'js',
    interview: '高频：滑动窗口最大值（单调队列模板题）；说清为什么被淘汰元素永远不可能再成为答案；单调队列 O(n) 与优先队列 O(n log k) 的对比。',
  },
  {
    id: 'dsa-circular-buffer',
    name: '循环缓冲区',
    en: 'Circular Buffer / Ring Buffer',
    cat: 'dsa',
    sub: '线性结构',
    tags: ['队列', '缓冲'],
    summary: '循环缓冲区用定容数组加头尾指针取模实现环形队列，入队出队 O(1) 且零搬移，嵌入式标配。',
    detail: `**是什么**：循环缓冲区（环形缓冲）用一段固定大小数组加 head/tail 两个下标，通过取模把数组首尾逻辑相接，形成可无限复用的环形队列。

**核心操作**：入队 / 出队 / 判空判满全 O(1)，零数据搬移。

**判满与判空三方案**：
- 牺牲一格：(tail + 1) % cap === head 判满——最常用
- 维护 size 计数器
- head === tail 加空/满标志位；容量取 2 的幂时用位掩码 (i & (cap - 1)) 替代取模

**适用场景**：串口/网络收发缓冲（中断写入、主循环读取）、音视频流缓冲、日志环形写入、生产者-消费者队列。

**坑**：写满后是覆盖旧数据（实时流）还是拒绝写入（任务队列）由业务决定；并发访问需配锁或单生产者单消费者的无锁写法。`,
    relations: [
      { to: 'dsa-queue-ds', desc: '循环队列即队列的定容数组高效实现' },
      { to: 'emb-uart', desc: '串口收发用环形缓冲衔接中断与主循环' },
      { to: 'dsa-deque', desc: '定容循环数组也是 deque 的常见实现方式' },
    ],
    example: `class RingBuffer {
  constructor(cap) { this.buf = new Array(cap); this.cap = cap;
    this.head = 0; this.tail = 0; this.size = 0; }   // 计数法判空满
  push(x) {                     // 入队 O(1)
    if (this.size === this.cap) throw new Error('full');
    this.buf[this.tail] = x;
    this.tail = (this.tail + 1) % this.cap;   // 取模绕回
    this.size++;
  }
  pop() {                       // 出队 O(1)，零数据搬移
    if (this.size === 0) return undefined;
    const x = this.buf[this.head];
    this.head = (this.head + 1) % this.cap;
    this.size--;
    return x;
  }
}`,
    exampleLang: 'js',
    interview: '高频：如何区分队空与队满（三种方案）；为什么容量常取 2 的幂（取模变位与）；嵌入式串口丢数据如何从环形缓冲溢出排查。',
  },

  // ==================== 哈希与集合 ====================
  {
    id: 'dsa-hash-map-a',
    name: '哈希表',
    en: 'Hash Table / Hash Map',
    cat: 'dsa',
    sub: '哈希与集合',
    tags: ['哈希', '结构'],
    summary: '哈希表通过哈希函数把键映射到桶下标，平均 O(1) 完成键值存取，是最常用的加速结构。',
    detail: `**是什么**：哈希表用哈希函数 h(key) 把任意键折算成数组下标，直接定位桶位存取键值对——用"算出来"替代"找出来"，平均 O(1)。

**核心操作（平均 / 最坏）**：
- get / set / delete：O(1) / O(n)（全部键撞同一桶时）
- 遍历 O(n + 桶数)，且无序——迭代顺序不可依赖

**性能三要素**：均匀的哈希函数、冲突解决策略（拉链/开放寻址）、负载因子触发的扩容 rehash。

**适用**：缓存、索引、去重、计数、两数之和类"空间换时间"。JS 的 Map、Java 的 HashMap、Redis 的 dict 都是。

**坑**：可变对象作键、之后被修改，就"找不到自己"；哈希表无序、不支持范围查询——需要有序时改用平衡树或 B+ 树。`,
    relations: [
      { to: 'dsa-hash-collision', desc: '冲突解决决定最坏性能：拉链与开放寻址' },
      { to: 'dsa-load-factor', desc: '负载因子与扩容维持均摊 O(1)' },
      { to: 'dsa-balanced-tree', desc: '需要有序与范围查询时用平衡树替代' },
    ],
    example: `// 两数之和：哈希表把 O(n^2) 双循环降为 O(n)
function twoSum(nums, target) {
  const seen = new Map();               // 值 -> 下标
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);               // 平均 O(1) 写入
  }
  return [];
}
// 计数场景也常用哈希：字符频次
function count(s) {
  const m = new Map();
  for (const ch of s) m.set(ch, (m.get(ch) ?? 0) + 1);
  return m;
}`,
    exampleLang: 'js',
    interview: '高频：哈希表原理与冲突处理；为什么查询是"平均" O(1)；HashMap 的 key 设计（hashCode 与 equals 必须一致）；哪些场景不适用（范围查询、有序遍历）。',
  },
  {
    id: 'dsa-hash-collision',
    name: '哈希冲突解决',
    en: 'Hash Collision Resolution',
    cat: 'dsa',
    sub: '哈希与集合',
    tags: ['哈希', '实现'],
    summary: '两个键哈希到同一桶即冲突；主流解法是拉链法（桶挂链表）与开放寻址法（向后探测空位）。',
    detail: `**是什么**：不同键经哈希函数算出同一下标即为哈希冲突（鸽笼原理注定存在）；解决策略直接决定哈希表的最坏性能。

**两大流派**：
- 拉链法（链地址）：每个桶挂一条链表；删除方便、允许负载因子超 1；Java HashMap 在链长超 8 且桶数超 64 时树化（红黑树），最坏查询从 O(n) 压到 O(log n)
- 开放寻址：冲突后按探测序列找空位（线性探测 i+1、二次探测、双重哈希）；无指针、缓存友好，但删除要打墓碑标记，聚集现象拖慢探测

**补充**：一致性哈希解决分布式分片场景的"节点增减"问题；完美哈希适用于静态键集。

**坑**：线性探测的一次聚集——被占位连成片后探测越来越长；负载因子过高时两派都会雪崩，必须及时扩容。`,
    relations: [
      { to: 'dsa-hash-map-a', desc: '冲突解决是哈希表实现的核心课题' },
      { to: 'dsa-load-factor', desc: '负载因子过高会加剧冲突，扩容即治本' },
      { to: 'dsa-linked-list-a', desc: '拉链法的桶内链表正是链表结构的落地应用' },
    ],
    example: `哈希函数: h(k) = k % 7

拉链法（链地址）：
桶0: [14] -> [7]        14%7=0, 7%7=0，同桶挂链
桶1: [8]  -> [1]
桶2: [2]
插入 = 算桶 + 头插 O(1)；查找 = 算桶 + 遍历链

开放寻址（线性探测）：
h(14)=0 占桶0；h(7)=0 冲突 -> 探测 (0+1)=1 -> 占桶1
查找沿原探测序走；删除打墓碑标记（DELETED）防止断链`,
    exampleLang: 'text',
    interview: '高频：拉链 vs 开放寻址的取舍（内存/缓存/删除）；为什么 Java 8 引入树化；线性探测的聚集问题与墓碑机制。',
  },
  {
    id: 'dsa-set-ds',
    name: '集合与去重',
    en: 'Set',
    cat: 'dsa',
    sub: '哈希与集合',
    tags: ['哈希', '去重'],
    summary: '集合存储不重复元素、只关心"存在与否"，哈希实现下增删查平均 O(1)，是去重首选。',
    detail: `**是什么**：集合（Set）是不含重复元素的容器，只回答"有没有"、不关心"第几个"；哈希实现下增删查平均 O(1)，有序实现（红黑树）O(log n) 且支持范围查询。

**核心操作**：
- add / has / delete：O(1)
- 交集：遍历小集合、查大集合；并集与差集同理

**去重的层次**：原始值直接用 Set；对象去重要先定义"相等"（按 id、按 JSON 序列化、按引用）；海量数据去重用位图或布隆过滤器（允许误判换内存）。

**典型场景**：爬虫 URL 去重、单词拼写存在性检查、权限差集运算、配对统计。

**坑**：JS 的 Set 对对象按引用比较、NaN 视为相同；写去重前先想清楚"什么算相等"。`,
    relations: [
      { to: 'dsa-hash-map-a', desc: '哈希集合就是"只有键没有值"的哈希表' },
    ],
    example: `// 数组去重：一行 Set
const uniq = (arr) => [...new Set(arr)];
uniq([1, 2, 2, 3, 1]);          // [1, 2, 3]

// 交集：遍历小集合查大集合
function intersect(a, b) {
  const big = new Set(a), res = new Set();
  for (const x of b) if (big.has(x)) res.add(x);
  return [...res];
}
// 判存在：把循环内 O(n) 查找换成 O(1)
function hasDuplicate(arr) {
  const seen = new Set();
  for (const x of arr) {
    if (seen.has(x)) return true;   // 早退
    seen.add(x);
  }
  return false;
}`,
    exampleLang: 'js',
    interview: '高频：几种数组去重方案及复杂度（双循环 O(n²)、排序后跳过相邻 O(n log n)、哈希 O(n)）；Set 与 Map 底层同源；海量去重的位图与布隆过滤器思路。',
  },
  {
    id: 'dsa-load-factor',
    name: '负载因子与扩容',
    en: 'Load Factor & Resizing',
    cat: 'dsa',
    sub: '哈希与集合',
    tags: ['哈希', '实现'],
    summary: '负载因子 = 元素数/桶数，超过阈值（常 0.75）触发扩容 rehash，是哈希表维持 O(1) 的关键。',
    detail: `**是什么**：负载因子 = 已存元素数 ÷ 桶总数，衡量哈希表的拥挤程度；因子越高冲突越多、性能越差，超阈值必须扩容。

**扩容流程**：申请新桶数组（通常 2 倍）→ 全部元素按新桶数重新哈希（rehash）→ 释放旧表。单次 O(n)，由均摊分析摊平为插入均摊 O(1)。

**工程细节**：
- Java HashMap 阈值 0.75：时空折中（太小浪费内存，太大冲突多）
- Redis 渐进式 rehash：新旧两表并存，每次操作搬一点，摊平单线程的停顿
- 缩容同理但用不同阈值，防反复抖动

**坑**：预估容量可一次性分配桶数免多次扩容；扩容会打乱遍历顺序；桶数保持 2 的幂让取模退化为位与运算。`,
    relations: [
      { to: 'dsa-hash-map-a', desc: '负载因子是哈希表性能的调节旋钮' },
      { to: 'dsa-amortized', desc: '扩容 O(n) 靠均摊分析摊平为 O(1)' },
      { to: 'dsa-hash-collision', desc: '高负载因子加剧冲突，扩容是治本手段' },
    ],
    example: `负载因子 = 元素数 / 桶数

插入流程（阈值为 0.75、初始 8 桶为例）：
  put 前判断: size + 1 > cap * 0.75 ?  ->  是则先扩容
  扩容: cap 8 -> 16，全部元素 rehash（新下标 = hash % 16）

为什么 2 倍扩容：
  1) 均摊 O(1)：n 次插入的总代价保持 O(n)
  2) cap 为 2 的幂时，桶下标 = hash & (cap - 1)，取模变位与

渐进式 rehash（Redis 思路）：
  同时持有旧表/新表；查：先旧后新；写：只进新表；定时批量迁移`,
    exampleLang: 'text',
    interview: '高频：为什么默认阈值 0.75；扩容为什么选 2 倍；Redis 渐进式 rehash 解决什么问题（单线程阻塞）；如何预估容量避免反复扩容。',
  },

  // ==================== 树 ====================
  {
    id: 'dsa-binary-tree-a',
    name: '二叉树',
    en: 'Binary Tree',
    cat: 'dsa',
    sub: '树',
    tags: ['树', '递归'],
    summary: '二叉树每节点至多两子树，递归结构天然适配分治，遍历 O(n) 是一切树算法的地基。',
    detail: `**是什么**：二叉树是每个节点至多有左、右两个孩子的树形结构；递归定义——树 = 根 + 左子树 + 右子树，因此绝大多数树问题都能写成"处理根 + 递归左右"的分治。

**核心操作（n 节点、h 高度）**：
- 前/中/后序遍历（DFS）：O(n) 时间、O(h) 栈空间
- 层序遍历（BFS）：O(n)，队列辅助
- 查找/插入：普通二叉树 O(n)，平衡时 O(log n)

**关键形态**：满二叉树、完全二叉树（堆的底座）、平衡二叉树（h = O(log n)）。

**坑**：顺序插入会退化成"链"（h = n），一切 O(log n) 变 O(n)——由此引出 BST 与平衡树；三种遍历的迭代写法中中序最易错（要先压到底）。`,
    relations: [
      { to: 'dsa-bst', desc: '二叉搜索树给二叉树加上"左小右大"的序性质' },
      { to: 'dsa-heap-ds', desc: '堆是完全二叉树 + 堆序的特例，用数组存储' },
    ],
    example: `// 递归定义：树 = 根 + 左 + 右；三种 DFS 遍历一个函数说清
function dfs(node, order, out) {
  if (!node) return;
  if (order === 'pre') out.push(node.val);   // 根（前序位置）
  dfs(node.left, order, out);                // 左
  if (order === 'in') out.push(node.val);    // 根（中序位置）
  dfs(node.right, order, out);               // 右
  if (order === 'post') out.push(node.val);  // 根（后序位置）
}
// 分治求深度：max(左深, 右深) + 1，O(n)
function depth(node) {
  if (!node) return 0;
  return Math.max(depth(node.left), depth(node.right)) + 1;
}`,
    exampleLang: 'js',
    interview: '高频：手写三种遍历的递归与迭代版本；由前序 + 中序重建二叉树；最近公共祖先 LCA；树问题的分治思维如何迁移到图。',
  },
  {
    id: 'dsa-bst',
    name: '二叉搜索树',
    en: 'Binary Search Tree (BST)',
    cat: 'dsa',
    sub: '树',
    tags: ['树', '有序'],
    summary: '二叉搜索树满足左子树<根<右子树，平衡时查找插入删除 O(log n)，中序遍历即有序序列。',
    detail: `**是什么**：BST 是带序性质的二叉树——任意节点满足"左子树所有值 < 它 < 右子树所有值"；查找如二分，每步排除一半。

**核心操作（平衡时 O(log n)，最坏退化 O(n)）**：
- 查找/插入：从根下行，按大小走左或右
- 删除：叶子直接删；单孩子顶上；双孩子用中序后继（右子树最小值）替换
- 中序遍历：得到升序序列——"BST + 中序 = 有序"

**适用**：需要"有序 + 动态增删 + 范围查询"的场景，如有序字典、区间统计。纯查找哈希表更快；静态有序数据直接二分数组。

**坑**：有序数据顺序插入会退化成链表——工程实现必须自平衡；验证 BST 只比较父子节点是常见错误，要传递上下界（min/max）。`,
    relations: [
      { to: 'dsa-balanced-tree', desc: 'AVL/红黑树通过旋转阻止 BST 退化' },
      { to: 'dsa-binary-tree-a', desc: 'BST 是加了序性质的二叉树' },
      { to: 'dsa-btree', desc: 'B 树是 BST 的多路推广，面向磁盘块' },
    ],
    example: `function insert(node, val) {
  if (!node) return { val, left: null, right: null };
  if (val < node.val) node.left = insert(node.left, val);
  else if (val > node.val) node.right = insert(node.right, val);
  return node;                          // 相等则忽略（去重语义）
}
function search(node, val) {            // O(h)
  while (node && node.val !== val)
    node = val < node.val ? node.left : node.right;
  return node;
}
// 中序遍历 BST => 升序数组
function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out); out.push(node.val); inorder(node.right, out);
  return out;
}`,
    exampleLang: 'js',
    interview: '高频：验证 BST（传递上下界）；删除节点的三种情况；第 k 小元素（中序计数）；为什么退化会发生、工程上怎么防。',
  },
  {
    id: 'dsa-balanced-tree',
    name: '平衡树：AVL 与红黑树',
    en: 'Balanced Tree (AVL / Red-Black Tree)',
    cat: 'dsa',
    sub: '树',
    tags: ['树', '有序'],
    summary: '平衡树通过旋转把 BST 树高压在 O(log n)，最坏情况下查找与更新仍保持对数级。',
    detail: `**是什么**：自平衡 BST 在插入/删除后通过旋转（rotation）修复平衡，把树高压在 O(log n)，杜绝退化成链。

**两大代表**：
- AVL：任意节点左右子树高差 ≤ 1；更矮、查找更快，但增删可能触发 O(log n) 次旋转——读多写少选它
- 红黑树：弱平衡（最长路 ≤ 2 × 最短路）；增删至多 3 次旋转——写多更划算，标准库主力（C++ map、Java TreeMap）

**核心操作**：查找/插入/删除 O(log n)；中序遍历 O(n) 有序；范围查询 O(log n + k)。

**坑**：面试重点在"为什么需要"与旋转直觉（LL/RR/LR/RL 四种失衡与对应旋转）；哈希表无序、红黑树有序，按是否需要顺序与范围查询选型。`,
    relations: [
      { to: 'dsa-bst', desc: '平衡树是 BST 的自平衡版本，专治退化' },
      { to: 'dsa-hash-map-a', desc: '有序 vs 无序的经典选型对比' },
      { to: 'dsa-btree', desc: '同源平衡思想：B 树把多路平衡用于磁盘页' },
    ],
    example: `右旋（把 x 的左孩子 y 转上来）：
    x                y
   / \\              / \\
  y   C    ->      A   x
 / \\                  / \\
A    B               B   C

AVL 失衡判定：插入后回溯检查 |h(左) - h(右)| > 1
四种失衡与修复：LL 右旋 / RR 左旋 / LR 先左后右 / RL 先右后左

红黑树性质（节选）：节点红或黑；红节点的孩子必黑；
任一节点到叶子的黑高相同 —— 共同保证最长路 <= 2 * 最短路`,
    exampleLang: 'text',
    interview: '高频：AVL 与红黑树怎么选；红黑树五条性质；为什么标准库 map 用红黑树而非 AVL；旋转如何同时恢复 BST 性质与平衡。',
  },
  {
    id: 'dsa-heap-ds',
    name: '堆',
    en: 'Heap / Priority Queue',
    cat: 'dsa',
    sub: '树',
    tags: ['树', '优先级'],
    summary: '堆是完全二叉树实现的优先队列，父节点恒优于孩子，取顶 O(1)、插删 O(log n)。',
    detail: `**是什么**：二叉堆 = 完全二叉树 + 堆序性质（小顶堆父 ≤ 孩子，大顶堆父 ≥ 孩子）；它为"反复取最值"而生，不擅长任意查找。

**核心操作（n 元素）**：
- peek 堆顶：O(1)
- push / pop：上浮（siftUp）/ 下沉（siftDown）O(log n)
- 建堆：自底向上逐个下沉 O(n)（优于逐个插入的 O(n log n)）

**存储**：完全二叉树直接压进数组——父 i、孩子 2i+1 / 2i+2，零指针开销。

**应用**：优先队列、Top-K（维护容量为 k 的小顶堆）、堆排序、定时器取最近到期任务、Dijkstra / Prim 加速。

**坑**：堆只保证堆顶最优，内部无全局序；求第 k 大用小顶堆（容量 k）而非大顶堆是常见误区；Java 默认 PriorityQueue 是小顶堆。`,
    relations: [
      { to: 'dsa-heap-sort-a', desc: '堆排序 = 建堆 + 反复取堆顶' },
      { to: 'dsa-binary-tree-a', desc: '完全二叉树形态，数组即存储' },
      { to: 'dsa-dijkstra-a', desc: '优先队列把 Dijkstra 提到 O((V+E)log V)' },
      { to: 'be-mq', desc: '延迟消息与优先投递依赖时间堆管理到期任务' },
    ],
    example: `// 数组小顶堆：parent=(i-1)/2, children=2i+1/2i+2；上浮与下沉是全部精髓
const siftUp = (a, i) => {                 // O(log n)
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (a[p] <= a[i]) break;
    [a[p], a[i]] = [a[i], a[p]]; i = p;
  }
};
const siftDown = (a, i, n = a.length) => { // O(log n)
  while (true) {
    let m = i; const l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && a[l] < a[m]) m = l;
    if (r < n && a[r] < a[m]) m = r;
    if (m === i) break;
    [a[i], a[m]] = [a[m], a[i]]; i = m;
  }
};
// push: a.push(x); siftUp(a, a.length - 1)
// pop:  堆顶与末位交换后 pop，再 siftDown(a, 0)`,
    exampleLang: 'js',
    interview: '高频：Top-K 用什么堆、为什么；建堆为什么是 O(n)（多数节点下沉路径短）；堆与 BST 的定位差异；堆排序为何缓存不友好。',
  },
  {
    id: 'dsa-trie',
    name: '前缀树 Trie',
    en: 'Trie / Prefix Tree',
    cat: 'dsa',
    sub: '树',
    tags: ['树', '字符串'],
    summary: 'Trie 按"字符即边"存储字符串集合，共享公共前缀，查找与前缀匹配 O(L) 与词数无关。',
    detail: `**是什么**：Trie（字典树/前缀树）把每个词按字符逐层展开：根到某节点的路径即一个前缀，节点上标记"是否成词"；公共前缀的词自动共享路径。

**核心操作（L 为词长）**：
- 插入 / 查找 / 前缀匹配：O(L)——与词典规模无关
- 自动补全：前缀定位 O(L) + 收集子树 O(子树大小)

**适用场景**：搜索框联想与自动补全、拼写检查、敏感词过滤（DFA 化）、IP 路由最长前缀匹配、词频统计。

**坑**：字符集大时用 Map 存子节点而非定长数组；每字符一个节点内存开销大，可用压缩 Trie（基数树）优化；海量短词的纯精确查找用哈希表更省。`,
    relations: [
      { to: 'dsa-hash-map-a', desc: '精确查找哈希表更快，前缀匹配必须 Trie' },
      { to: 'dsa-binary-tree-a', desc: '多叉树形结构，遍历思想同源' },
      { to: 'dsa-set-ds', desc: 'Trie 可视作按公共前缀组织的字符串集合' },
    ],
    example: `class Trie {
  root = {};                          // 节点 = { 子字符: 节点, '#': 是否成词 }
  insert(word) {                      // O(L)
    let node = this.root;
    for (const ch of word) node = node[ch] ??= {};
    node['#'] = true;
  }
  search(word) {                      // 完整查找 O(L)
    const n = this.walk(word);
    return !!n && !!n['#'];
  }
  startsWith(prefix) { return !!this.walk(prefix); }   // 前缀匹配 O(L)
  walk(s) {
    let node = this.root;
    for (const ch of s) { node = node[ch]; if (!node) return null; }
    return node;
  }
}`,
    exampleLang: 'js',
    interview: '高频：实现 Trie 三操作；Trie 与哈希表的取舍（前缀能力 vs 常数与内存）；敏感词过滤如何用 Trie/DFA；搜索联想的实现设计。',
  },
  {
    id: 'dsa-btree',
    name: 'B 树与 B+ 树',
    en: 'B-Tree & B+ Tree',
    cat: 'dsa',
    sub: '树',
    tags: ['树', '磁盘'],
    summary: 'B/B+ 树是多路平衡搜索树，节点对齐磁盘页，矮胖树形把千万级数据的 IO 压到 3~4 次。',
    detail: `**是什么**：B 树是节点含多键、多子树的自平衡多路搜索树；B+ 树是其数据库变体——数据全存叶子层、内部节点只放索引键、叶子节点串成有序链表。

**核心操作**：查找/插入/删除 O(log n)，但树高极低——千万级数据约 3~4 层，即 3~4 次磁盘 IO。

**为什么为磁盘而生**：磁盘按页（4~16KB）读写，一次 IO 远贵于内存比较；节点对齐页大小、单节点装数百键，每层"一次 IO 换数百路分支"，树自然矮胖。

**B+ 树优于 B 树**：内部节点不存数据故扇出更大；叶子链表高效支撑范围扫描（BETWEEN、ORDER BY）；查询耗时稳定（必走到叶子）。

**坑**：别用二叉树的左右子树思维理解多路树；InnoDB 的聚簇索引、二级索引回表都是 B+ 树的直接工程体现。`,
    relations: [
      { to: 'be-index', desc: 'MySQL InnoDB 索引的底层数据结构就是 B+ 树' },
      { to: 'be-rdbms', desc: '行存数据库用 B+ 树组织主键与二级索引' },
      { to: 'dsa-balanced-tree', desc: '同源平衡思想：二叉平衡的多路推广，面向块设备' },
    ],
    example: `3 阶 B+ 树示意（叶子层串联，支持范围扫描）：
                [ 40 | 80 ]                 <- 内部节点只放索引键
               /     |     \\
        [10|20|30] [40|50|60] [80|90]       <- 数据全在叶子
             -------- 链表 -------->

点查 60：根 -> 中 -> 叶，3 次 IO（树高 3）
范围查 [40, 90]：定位 40 后沿叶子链表向右扫，无需回溯根

对比平衡二叉树：1000 万数据树高约 23 层 = 23 次 IO；
B+ 树扇出约 500，树高仅 3~4 层 —— 数据库选它的根本原因`,
    exampleLang: 'text',
    interview: '高频：B+ 树 vs B 树 vs 红黑树/哈希（数据库为什么选 B+ 树）；聚簇索引与回表；用扇出估算树高与 IO 次数；叶子链表为什么必要。',
  },

  // ==================== 图 ====================
  {
    id: 'dsa-graph-repr',
    name: '图的表示：邻接矩阵与邻接表',
    en: 'Adjacency Matrix & Adjacency List',
    cat: 'dsa',
    sub: '图',
    tags: ['图', '表示'],
    summary: '图用邻接矩阵（二维数组，O(1) 判边）或邻接表（每点挂邻居列表，省空间）两种主形式存储。',
    detail: `**是什么**：图 G=(V, E) 由顶点与边组成；程序中存储"谁连谁"的主流方式有邻接矩阵与邻接表两种。

**对比（n 点 m 边）**：
- 邻接矩阵：n×n 矩阵；判边/加边 O(1)、遍历邻居 O(n)；空间 O(n²)——稠密图（m ≈ n²）合算，Floyd 等矩阵算法方便
- 邻接表：每点挂邻居列表；判边 O(度)、遍历邻居 O(度)；空间 O(n + m)——稀疏图标配，BFS/DFS/Dijkstra 的默认选择

**选择口诀**：点少边多用矩阵；点百万级只能用表；Kruskal 常直接吃边列表。

**坑**：无向图每条边要存两遍；带权图矩阵存权值、邻接表存 (to, w) 对；网格地图直接用二维数组更自然。`,
    relations: [
      { to: 'dsa-bfs-a', desc: 'BFS/DFS 的第一步就是把图装进邻接表' },
      { to: 'dsa-floyd', desc: 'Floyd 直接在邻接矩阵上做全源最短路' },
      { to: 'dsa-mst', desc: 'Kruskal 吃边列表，Prim 吃邻接表' },
    ],
    example: `// 邻接表：数组 + 邻居列表（最常用）
const n = 5;
const adj = Array.from({ length: n }, () => []);
function addEdge(u, v, w) {
  adj[u].push([v, w]);
  adj[v].push([u, w]);      // 无向图存两遍
}
addEdge(0, 1, 7); addEdge(1, 2, 3);

// 邻接矩阵：n x n，mat[i][j] 存权值（0 表示无边）
const mat = Array.from({ length: n }, () => new Array(n).fill(0));
function addEdgeMat(u, v, w) {
  mat[u][v] = w; mat[v][u] = w;   // 无向图对称
}
// 判边 O(1)：mat[u][v] !== 0；遍历 u 的邻居：矩阵 O(n)，表 O(deg(u))`,
    exampleLang: 'js',
    interview: '高频：两种表示的空间与操作复杂度对比；稀疏/稠密的判据；无向图与带权图的存储差异；网格图算不算图。',
  },
  {
    id: 'dsa-bfs-a',
    name: '广度优先搜索 BFS',
    en: 'Breadth-First Search',
    cat: 'dsa',
    sub: '图',
    tags: ['图', '搜索'],
    summary: 'BFS 借队列按"圈层"由近及远遍历图，天然给出无权图最短路，时间 O(V+E)。',
    detail: `**是什么**：BFS 从起点按圈层由近及远扩散：先访问全部直接邻居（第 1 层），再邻居的邻居（第 2 层）……像水波纹。队列的 FIFO 保证"先入队的先处理"，实现层序推进。

**流程与复杂度**：起点入队并标记 → 出队处理 → 未访问邻居入队时立即标记 → 队空结束。时间 O(V+E)，空间 O(V)。

**核心性质**：无权图中首次到达某点的层数就是最短距离——BFS 严格按距离递增探索。

**变体与应用**：网格最短路（四方向移动）、多源 BFS（所有源头同时入队）、0-1 BFS（双端队列）、二叉树层序遍历。

**坑**：必须"入队时标记"而不是"出队时标记"，否则同点被重复塞进队列；带权图"层数最短"不再等于"权和最短"，要换 Dijkstra。`,
    relations: [
      { to: 'dsa-queue-ds', desc: '队列是 BFS 的实现根基：FIFO 即按层' },
      { to: 'dsa-dfs-a', desc: '同一张图的两种遍历顺序：层进 vs 深潜' },
      { to: 'dsa-dijkstra-a', desc: 'Dijkstra 是 BFS 的带权推广：队列换优先队列' },
    ],
    example: `// 无权图最短路：BFS + 队列 + visited
function bfsShortest(adj, start) {
  const dist = new Map([[start, 0]]);
  const queue = [start];
  while (queue.length) {
    const u = queue.shift();
    for (const [v] of adj[u]) {
      if (dist.has(v)) continue;    // 入队前判重 = 入队时标记
      dist.set(v, dist.get(u) + 1); // 首次到达即最短
      queue.push(v);
    }
  }
  return dist;  // 各点到 start 的最短步数
}
// 网格最短路同理：把 (r, c) 编号入队，按四个方向扩展`,
    exampleLang: 'js',
    interview: '高频：为什么 BFS 能求无权最短路（若存在更短路，其更近的点会先入队）；双向 BFS 如何提速；多源 BFS 的初始化技巧。',
  },
  {
    id: 'dsa-dfs-a',
    name: '深度优先搜索 DFS',
    en: 'Depth-First Search',
    cat: 'dsa',
    sub: '图',
    tags: ['图', '搜索'],
    summary: 'DFS 沿一条路走到底再回溯换路，用栈或递归实现，O(V+E) 遍历全图并支撑连通性类问题。',
    detail: `**是什么**：DFS 从起点选一条边一路深入，死路回溯换下一条；递归天然匹配——"访问 u，对每个未访问邻居递归"。

**核心操作**：遍历 O(V+E)；递归实现空间 O(V)（调用栈），深图用显式栈防爆栈。

**支撑的算法族**：
- 连通块/岛屿计数：每个未访问点发起一次 DFS 染色
- 环检测：有向图三色标记（栈中灰点再遇灰即有环）
- 拓扑排序：DFS 完成序的逆序
- 回溯法：DFS + 撤销选择

**BFS vs DFS**：求最短路用 BFS；问连通性/存在性/枚举所有方案两者皆可，DFS 代码更短、空间更省（不必存整层）。

**坑**：visited 忘标记即死循环；递归深度到 10^5 级别会爆栈，改显式栈。`,
    relations: [
      { to: 'dsa-bfs-a', desc: '遍历双雄：用栈还是用队列决定探索顺序' },
      { to: 'dsa-backtracking', desc: '回溯 = DFS + 撤销选择，搜索所有解' },
      { to: 'dsa-topo-sort-a', desc: '拓扑排序可由 DFS 完成序导出' },
    ],
    example: `// 连通块（岛屿）计数：每个未访问点发起一次 DFS 染色
function countComponents(n, adj) {
  const visited = new Array(n).fill(false);
  let count = 0;
  const dfs = (u) => {
    visited[u] = true;             // 标记放在进入时
    for (const [v] of adj[u])
      if (!visited[v]) dfs(v);     // 深入未访问邻居
  };
  for (let u = 0; u < n; u++)
    if (!visited[u]) { dfs(u); count++; }   // 新块起点
  return count;
}
// 递归等价于显式栈：stack.push(u) / pop() 循环`,
    exampleLang: 'js',
    interview: '高频：DFS 与 BFS 各自适用的问题类型；岛屿数量系列；有向图环检测的三色标记；递归深度超限怎么办。',
  },
  {
    id: 'dsa-topo-sort-a',
    name: '拓扑排序',
    en: 'Topological Sort',
    cat: 'dsa',
    sub: '图',
    tags: ['图', '排序'],
    summary: '拓扑排序把 DAG 顶点排成序列使每条边 u→v 中 u 在 v 前，Kahn 算法 O(V+E)，兼测环。',
    detail: `**是什么**：拓扑排序给出有向无环图（DAG）的线性顺序，满足所有依赖关系"先决者在前"——课程先修、任务调度、构建顺序、包依赖解析都是它。

**Kahn 算法（BFS 法，O(V+E)）**：
- 统计各点入度，入度为 0 的点入队
- 出队点追加结果，其出边终点的入度减 1，减到 0 入队
- 结束时结果数 < 点数 ⇒ 图中有环

**另一路线**：DFS 完成时间的逆序即拓扑序。

**性质**：拓扑序可能不唯一（无约束的点可任意交错）；只有 DAG 才有拓扑序——它本身就是环检测器。

**坑**：入度减 1 与入队条件别写反；需要字典序最小的方案时用小顶堆替代普通队列；报错时给出环的具体路径，DFS 法更易还原。`,
    relations: [
      { to: 'dsa-bfs-a', desc: 'Kahn 本质是"入度驱动的 BFS"' },
      { to: 'dsa-dfs-a', desc: 'DFS 完成序逆序是另一实现路线' },
    ],
    example: `// Kahn：入度表 + 队列，O(V+E)，顺带检测环
function topoSort(n, edges) {         // edges: [u, v] 表示 u 先于 v
  const adj = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [u, v] of edges) { adj[u].push(v); indeg[v]++; }
  const queue = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  const order = [];
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    for (const v of adj[u])
      if (--indeg[v] === 0) queue.push(v);
  }
  return order.length === n ? order : [];   // 长度不足 => 有环
}`,
    exampleLang: 'js',
    interview: '高频：课程表 I/II（判环 + 求序）；为什么 DFS 逆后序也正确；构建工具（webpack/bazel 依赖图）如何用拓扑排序。',
  },
  {
    id: 'dsa-mst',
    name: '最小生成树：Kruskal 与 Prim',
    en: 'Minimum Spanning Tree (Kruskal / Prim)',
    cat: 'dsa',
    sub: '图',
    tags: ['图', '贪心'],
    summary: '最小生成树用 n-1 条最小权边连通全部顶点，Kruskal 排边加并查集、Prim 扩点用堆，均贪心。',
    detail: `**是什么**：最小生成树（MST）在无向连通带权图中选出 n-1 条边连通所有顶点且总权最小；正确性由切割性质保证——横跨任意切分的最小边必属于某棵 MST，贪心因此成立。

**两大算法（均贪心）**：
- Kruskal：边按权升序尝试加入，用并查集跳过成环的边；O(E log E)，稀疏图首选、代码短
- Prim：从任一点出发，反复把"连接树内外的最小横跨边"另一端拉进来，用堆维护候选；O(E log V)，稠密图更优

**应用**：网络布线（最省成本连通所有机房）、聚类（去掉最大边近似分簇）、电路布线。

**坑**：图不连通时 MST 不存在（得到森林）；Kruskal 判环必须用并查集；负权边不影响 MST——这与最短路不同。`,
    relations: [
      { to: 'dsa-union-find', desc: 'Kruskal 用并查集判两点是否已连通（防环）' },
      { to: 'dsa-dijkstra-a', desc: '同为贪心图算法：一个求连通成本、一个求最短路' },
      { to: 'dsa-graph-repr', desc: 'Kruskal 吃边列表，Prim 吃邻接表' },
    ],
    example: `// Kruskal：边排序 + 并查集，O(E log E)
function kruskal(n, edges) {          // edges: [w, u, v]
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => parent[x] === x ? x : (parent[x] = find(parent[x]));
  edges.sort((a, b) => a[0] - b[0]);  // 1. 按权升序
  let total = 0, used = 0;
  for (const [w, u, v] of edges) {
    const ru = find(u), rv = find(v);
    if (ru === rv) continue;          // 2. 已连通则跳过（成环）
    parent[ru] = rv;                  // 3. 合并两个集合
    total += w;
    if (++used === n - 1) break;      // 选满 n-1 条即完成
  }
  return used === n - 1 ? total : -1; // -1 表示图不连通
}`,
    exampleLang: 'js',
    interview: '高频：Kruskal 与 Prim 各适合什么图；切割性质如何证明贪心正确；MST 何时唯一（边权互异）；MST 与最短路的区别。',
  },
  {
    id: 'dsa-dijkstra-a',
    name: 'Dijkstra 最短路',
    en: "Dijkstra's Algorithm",
    cat: 'dsa',
    sub: '图',
    tags: ['图', '最短路'],
    summary: 'Dijkstra 贪心扩展"当前距离最小"的未定点求单源最短路，堆优化 O((V+E)log V)，要求边权非负。',
    detail: `**是什么**：Dijkstra 求带权图单源最短路：反复取出"当前 dist 最小"的未定点 u——因边权非负，绕路只会更远，所以它必然已是最短——再用 u 松弛邻居。

**流程与复杂度**：dist[源] = 0 其余 ∞ → 优先队列取最小 dist 点 → 松弛 dist[v] = min(dist[v], dist[u] + w) → 队空。堆实现 O((V+E) log V)。

**限制**：边权必须非负——负权边会让"先定型"的点被后续更短路推翻，正确性崩塌，换 Bellman-Ford。

**变体**：建反向图求"到终点"、A* 加启发函数加速、分层图。

**坑**：优先队列里的过期条目出队时要跳过（d > dist[u] 的懒删除）；还原路径需记 prev 数组；BFS 是它边权全 1 的特例。`,
    relations: [
      { to: 'dsa-heap-ds', desc: '优先队列把"取最小 dist"降到 O(log V)' },
      { to: 'dsa-bellman-ford', desc: '负权场景的替代方案' },
      { to: 'dsa-bfs-a', desc: 'BFS 是它边权全 1 的特例' },
    ],
    example: `// 堆优化 Dijkstra：O((V+E) log V)
function dijkstra(n, adj, src) {      // adj[u] = [[v, w], ...]
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  const pq = [[0, src]];              // 小顶堆条目：[dist, node]
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);   // 演示用 sort 取最小（生产用真堆）
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;        // 过期条目，跳过
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {    // 松弛
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;                        // 到各点的最短距离
}`,
    exampleLang: 'js',
    interview: '高频：为什么负权边会破坏 Dijkstra；堆优化后的复杂度推导；"if (d > dist[u]) continue" 在防什么；Dijkstra/BFS/Bellman-Ford 的选型。',
  },
  {
    id: 'dsa-bellman-ford',
    name: 'Bellman-Ford',
    en: 'Bellman-Ford Algorithm',
    cat: 'dsa',
    sub: '图',
    tags: ['图', '最短路'],
    summary: 'Bellman-Ford 对全部边做 V-1 轮松弛求单源最短路，容忍负权边并可检测负环，O(VE)。',
    detail: `**是什么**：Bellman-Ford 求单源最短路但不贪心定型：对全部边反复松弛，第 i 轮结束后"最多经过 i 条边"的最短路全部正确——而最短路至多 V-1 条边。

**流程与复杂度**：dist[源] = 0 → 重复 V-1 轮遍历所有边做松弛 → 第 V 轮仍可松弛 ⇒ 存在负环（距离可无限变小）。O(V·E)。

**换来什么**：比 Dijkstra 慢，但支持负权边 + 能检测负环。

**实用变体**：SPFA 队列驱动、只松弛被更新过的点，平均快很多、最坏仍 O(VE)。

**应用**：货币套利检测（汇率取负对数找正环）、RIP 路由协议（距离向量）、差分约束系统。

**坑**：某轮无任何更新即可早停，优化必须加；负环检测要在 V-1 轮后单独再跑一轮。`,
    relations: [
      { to: 'dsa-dijkstra-a', desc: '同为单源最短路：有负权选 BF，无负权选 Dijkstra' },
      { to: 'dsa-floyd', desc: '同族思想：逐轮放宽限制的动态规划松弛' },
      { to: 'net-routing', desc: 'RIP 路由协议即距离向量算法（BF 思想）的工程落地' },
    ],
    example: `function bellmanFord(n, edges, src) {   // edges: [u, v, w]
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let round = 0; round < n - 1; round++) {  // V-1 轮松弛
    let updated = false;
    for (const [u, v, w] of edges) {
      if (dist[u] < Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;          // 沿边松弛
        updated = true;
      }
    }
    if (!updated) break;                // 早停：本轮无更新
  }
  // 第 V 轮：仍能松弛 => 存在负环
  for (const [u, v, w] of edges)
    if (dist[u] < Infinity && dist[u] + w < dist[v]) return null;
  return dist;
}`,
    exampleLang: 'js',
    interview: '高频：为什么是 V-1 轮（路径最多 V-1 条边）；负环判定怎么写；SPFA 的队列优化思想；货币套利如何转化为负环问题。',
  },
  {
    id: 'dsa-floyd',
    name: 'Floyd-Warshall',
    en: 'Floyd-Warshall Algorithm',
    cat: 'dsa',
    sub: '图',
    tags: ['图', '最短路'],
    summary: 'Floyd-Warshall 三重循环动态规划求全源最短路，O(n³) 时间 O(n²) 空间，代码仅五行。',
    detail: `**是什么**：Floyd-Warshall 一次求出**所有点对**之间的最短路（全源），基于动态规划：允许经过的中转点从"无"逐步放宽到"全部"。

**转移方程**：dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])——i 到 j 要么不经过 k，要么拆成 i→k 再 k→j。三重循环 O(n³)，空间 O(n²)，代码五行。

**与 Dijkstra 分工**：多源小图（n ≤ 几百）Floyd 一次搞定；单源大图 Dijkstra；负权边兼容，负环检测看 dp[i][i] < 0。

**附加能力**：记 next 矩阵还原路径；传递闭包（可达性）；无向图最小环。

**坑**：k 必须放最外层——dp 的阶段语义被破坏会算错；初始化 dp[i][i] = 0、邻接权、其余 ∞。`,
    relations: [
      { to: 'dsa-dijkstra-a', desc: '单源 vs 全源的分工：大图单源 Dijkstra，小图全源 Floyd' },
      { to: 'dsa-bellman-ford', desc: '同族动态规划：逐轮放宽中转限制' },
      { to: 'dsa-graph-repr', desc: 'Floyd 直接在邻接矩阵上迭代' },
    ],
    example: `// Floyd-Warshall：dp[i][j] = 只经中转点 0..k 的最短路
function floyd(n, dist) {             // dist 为 n x n 邻接矩阵（副本）
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (let k = 0; k < n; k++)         // k 必须在最外层！
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];   // 经 k 中转更短
  return dist;                        // 全源最短距离矩阵
}
// 负环检测：结束后若存在 dist[i][i] < 0 则有负环`,
    exampleLang: 'js',
    interview: '高频：为什么 k 必须在最外层（dp 阶段语义）；Floyd 能否处理负权（可）与负环（可检测）；n 的规模如何决定选 Floyd 还是 n 次 Dijkstra。',
  },
  {
    id: 'dsa-union-find',
    name: '并查集',
    en: 'Union-Find / Disjoint Set',
    cat: 'dsa',
    sub: '图',
    tags: ['图', '连通'],
    summary: '并查集用森林管理不相交集合，路径压缩加按秩合并让 find/union 均摊近 O(1)，专治连通性。',
    detail: `**是什么**：并查集（不相交集合）维护若干互不相交的集合，核心只答两问：find(x)——x 属于哪个集合（代表元）；union(x, y)——合并两个集合。内部是"孩子指父亲"的森林。

**两大优化（缺一退化）**：
- 路径压缩：find 时把沿途节点直接挂到根，树越来越扁
- 按秩/按大小合并：矮树挂到高树下，防长链
- 齐备时单次操作均摊 O(α(n))，α 为反阿克曼函数，实践视为常数

**应用**：Kruskal 判环、连通块个数（动态加边）、账号/朋友圈合并、离线 LCA。

**坑**：不支持拆分集合（需离线倒序处理）；find 忘压缩或 union 忘判根都会退化 O(n)；非整数元素配哈希映射使用。`,
    relations: [
      { to: 'dsa-mst', desc: 'Kruskal 的成环判定全靠并查集' },
      { to: 'dsa-graph-repr', desc: '动态连通性与静态图遍历互补' },
    ],
    example: `class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);      // 秩：树的近似高度
  }
  find(x) {                                // 路径压缩
    if (this.parent[x] !== x)
      this.parent[x] = this.find(this.parent[x]);   // 直接挂根
    return this.parent[x];
  }
  union(x, y) {                            // 按秩合并
    const rx = this.find(x), ry = this.find(y);
    if (rx === ry) return false;           // 已同集 => 加边成环
    if (this.rank[rx] < this.rank[ry]) [rx, ry] = [ry, rx];
    this.parent[ry] = rx;
    if (this.rank[rx] === this.rank[ry]) this.rank[rx]++;
    return true;
  }
}`,
    exampleLang: 'js',
    interview: '高频：两大优化各自的作用与 α(n) 复杂度；连通块个数如何随 union 动态维护；为什么并查集不支持删除；带权并查集的应用（食物链）。',
  },

  // ==================== 排序算法 ====================
  {
    id: 'dsa-sorting-family',
    name: '排序算法总览与选型',
    en: 'Sorting Overview',
    cat: 'dsa',
    sub: '排序算法',
    tags: ['排序', '总览'],
    summary: '排序算法分比较类（快归堆插选冒）与非比较类（计桶基）两阵营，选型看规模、稳定性与内存。',
    detail: `**是什么**：排序是把序列按序重排的算法族，也是算法学习的"练武场"；按是否比较元素分两大阵营。

**比较类（理论下界 O(n log n)）**：
- O(n²)：冒泡（稳定）、插入（稳定、基本有序时近 O(n)）、选择（不稳定）
- O(n log n)：归并（稳定、需 O(n) 辅助）、快排（均摊最快、不稳定）、堆排（原地、不稳定）

**非比较类（可突破下界）**：计数、桶、基数——牺牲空间与"整数/有限域"前提换 O(n + k)。

**选型口诀**：通用默认快排；要稳定选归并/TimSort；内存苛刻选堆排；值域小的整数用计数；工程里直接用内置 sort（高度调优）。

**坑**："O(n log n) + 原地 + 稳定"的比较排序三者不可兼得；手写快排注意枢轴选择防退化。`,
    relations: [
      { to: 'dsa-quick-sort-a', desc: '均摊最快的通用排序，工程默认之选' },
      { to: 'dsa-merge-sort-a', desc: '稳定 O(n log n) 的代表' },
      { to: 'dsa-stability', desc: '稳定性是选型核心维度之一' },
      { to: 'dsa-counting-sort', desc: '非比较阵营：线性时间换空间与前提' },
    ],
    example: `算法      平均         最坏         空间      稳定
冒泡      O(n^2)       O(n^2)       O(1)      是
插入      O(n^2)       O(n^2)       O(1)      是   <- 基本有序时近 O(n)
选择      O(n^2)       O(n^2)       O(1)      否
快排      O(n log n)   O(n^2)       O(log n)  否   <- 均摊最快
归并      O(n log n)   O(n log n)   O(n)      是
堆排      O(n log n)   O(n log n)   O(1)      否
计数      O(n+k)       O(n+k)       O(k)      是   <- 整数小值域
基数      O(d(n+k))    O(d(n+k))    O(n+k)    是   <- d 为位数

选型：默认快排；要稳定归并；省内存堆排；值域小计数`,
    exampleLang: 'text',
    interview: '高频：默写对比表；为什么比较排序下界是 O(n log n)（决策树叶子数至少 n!）；内置排序的实现策略（TimSort、introsort 快排+堆排混合防退化）。',
  },
  {
    id: 'dsa-merge-sort-a',
    name: '归并排序',
    en: 'Merge Sort',
    cat: 'dsa',
    sub: '排序算法',
    tags: ['排序', '分治'],
    summary: '归并排序分治拆半递归排序再合并两个有序段，稳定 O(n log n)，代价是 O(n) 辅助空间。',
    detail: `**是什么**：归并排序是分治的教科书：拆（对半分到单元素）→ 治（各自有序）→ 合（双指针合并两个有序数组）。任何输入都稳定 O(n log n)。

**核心操作**：
- 合并两个有序段：双指针逐个取小，O(段长)
- 递归深度 O(log n)，每层总合并 O(n)，合计 O(n log n)
- 空间 O(n) 辅助数组 + O(log n) 栈

**价值点**：
- 稳定——相等元素不换位，是通用稳定排序的默认选择（TimSort 的骨架）
- 外排序：磁盘数据按块归并，K 路归并用堆加速
- 合并时统计"左段 > 右段元素"的个数即逆序对，一石二鸟

**坑**：每次 merge 都 new 数组是常数杀手（应复用一个缓冲区）；链表归并可 O(1) 额外空间（改指针不搬数据）；小段切插入排序能提速。`,
    relations: [
      { to: 'dsa-quick-sort-a', desc: '分治双雄：稳定+空间 vs 不稳定+原地' },
      { to: 'dsa-stability', desc: '归并是稳定排序的代表实现' },
      { to: 'dsa-heap-sort-a', desc: '同为 O(n log n)：空间换稳定的对照' },
    ],
    example: `function mergeSort(a) {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid));    // 分
  const right = mergeSort(a.slice(mid));
  return merge(left, right);                  // 合
}
function merge(l, r) {                        // 双指针合并 O(n)
  const out = [];
  let i = 0, j = 0;
  while (i < l.length && j < r.length)
    out.push(l[i] <= r[j] ? l[i++] : r[j++]); // <= 保证稳定
  return out.concat(l.slice(i), r.slice(j));
}
mergeSort([5, 2, 9, 1, 5, 6]);  // [1, 2, 5, 5, 6, 9]`,
    exampleLang: 'js',
    interview: '高频：手写归并；归并求逆序对（merge 时累加右段被跳过的个数）；为什么稳定；外排序 K 路归并怎么优化。',
  },
  {
    id: 'dsa-quick-sort-a',
    name: '快速排序',
    en: 'Quick Sort',
    cat: 'dsa',
    sub: '排序算法',
    tags: ['排序', '分治'],
    summary: '快排选枢轴分区使左小右大再递归两侧，均摊 O(n log n) 且原地，是实践最快的通用排序。',
    detail: `**是什么**：快排选一个枢轴（pivot）把数组分区——小于枢轴在左、大于在右、枢轴落位——再递归两侧。与归并相反：工作发生在"分"，先分区后递归。

**复杂度**：
- 平均/均摊 O(n log n)：常数小、缓存友好、原地（O(log n) 栈）——实践最快
- 最坏 O(n²)：枢轴总取到最值（如有序数组取首元素）

**关键工程手段**：
- 随机枢轴 / 三数取中防退化
- 三路分区（< = >）应对大量重复元素（荷兰国旗问题）
- 小区间切插入排序；introsort 混合堆排保 O(n log n) 上界

**坑**：分区指针的边界条件（i/j 交叉）最易写错；不稳定——远距离交换破坏相等元素次序；JS 的 sort 不用快排（V8 用 TimSort）。`,
    relations: [
      { to: 'dsa-merge-sort-a', desc: '分治双雄：先分区 vs 先拆解、原地 vs 稳定' },
      { to: 'dsa-amortized', desc: '随机枢轴下最坏情况被均摊分析覆盖' },
      { to: 'dsa-in-place', desc: '原地分区不需要辅助数组' },
    ],
    example: `function quickSort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return a;
  const p = partition(a, lo, hi);
  quickSort(a, lo, p - 1);              // 左段
  quickSort(a, p + 1, hi);              // 右段
  return a;
}
function partition(a, lo, hi) {         // Lomuto 分区
  const rand = lo + Math.floor(Math.random() * (hi - lo + 1));
  [a[rand], a[hi]] = [a[hi], a[rand]];  // 随机枢轴防退化
  const pivot = a[hi];
  let i = lo;                           // i：小于区的下一个坑位
  for (let j = lo; j < hi; j++)
    if (a[j] < pivot) [a[i++], a[j]] = [a[j], a[i]];
  [a[i], a[hi]] = [a[hi], a[i]];        // 枢轴归位
  return i;
}`,
    exampleLang: 'js',
    interview: '高频：手写分区；最坏退化场景与三种规避手段；快排 vs 归并怎么选；三路分区解决重复元素；第 k 大问题用快速选择 O(n)。',
  },
  {
    id: 'dsa-heap-sort-a',
    name: '堆排序',
    en: 'Heap Sort',
    cat: 'dsa',
    sub: '排序算法',
    tags: ['排序', '堆'],
    summary: '堆排序先 O(n) 建大顶堆再反复取堆顶与末位交换，原地 O(n log n)，短板是缓存不友好。',
    detail: `**是什么**：堆排序两步走：① 自底向上把数组建成大顶堆 O(n)；② 反复"堆顶（最大值）与当前末位交换、堆缩一格、下沉修复"，每轮把最大值沉到尾部——升序用大顶堆。

**复杂度**：最坏也是 O(n log n)（无退化输入），空间 O(1)——唯一同时满足"原地 + 最坏 n log n"的常见排序；但不稳定（堆顶换尾跨越相等元素）。

**实践短板**：堆按 0→1→3→7… 跳跃式访问下标，缓存命中率差，实测常慢于快排（尽管复杂度相同）。

**变体与应用**：
- Top-K：只维护容量 k 的小顶堆流式处理，不必全排
- introsort：快排递归过深时切堆排保上界（C++ std::sort 策略）
- 优先级调度、定时器

**坑**：建堆必须"从最后一个非叶子节点倒序下沉"才是 O(n)；升序要建大顶堆，别建反。`,
    relations: [
      { to: 'dsa-heap-ds', desc: '堆排是堆结构最直接的应用' },
      { to: 'dsa-in-place', desc: 'O(1) 额外空间的原地排序' },
      { to: 'dsa-quick-sort-a', desc: '同为 O(n log n)：最坏保证 vs 平均速度' },
    ],
    example: `function heapSort(a) {
  const n = a.length;
  const siftDown = (i, size) => {         // 大顶堆下沉
    while (true) {
      let big = i; const l = 2 * i + 1, r = 2 * i + 2;
      if (l < size && a[l] > a[big]) big = l;
      if (r < size && a[r] > a[big]) big = r;
      if (big === i) break;
      [a[i], a[big]] = [a[big], a[i]]; i = big;
    }
  };
  for (let i = (n >> 1) - 1; i >= 0; i--) // 1. 建堆 O(n)
    siftDown(i, n);
  for (let end = n - 1; end > 0; end--) { // 2. 反复取顶
    [a[0], a[end]] = [a[end], a[0]];      // 最大值沉底
    siftDown(0, end);                     // 堆缩小一格
  }
  return a;
}`,
    exampleLang: 'js',
    interview: '高频：建堆为何 O(n)；为何实际常慢于快排（缓存局部性）；Top-K 怎么做；introsort 为什么混入堆排。',
  },
  {
    id: 'dsa-counting-sort',
    name: '计数、桶与基数排序',
    en: 'Counting / Bucket / Radix Sort',
    cat: 'dsa',
    sub: '排序算法',
    tags: ['排序', '非比较'],
    summary: '计数/桶/基数三类非比较排序绕开 O(n log n) 下界，用值域或位数换线性时间 O(n+k)。',
    detail: `**是什么**：比较排序的决策树下界是 O(n log n)；非比较排序不比大小、直接"按值落位"，可达线性时间——前提是数据可枚举（整数/定长字符串/均匀分布浮点）。

**三兄弟**：
- 计数排序：值域 [0, k] 小时统计每个值的出现次数再顺序展开；O(n + k)，可实现稳定
- 桶排序：把数据均匀撒进 k 个桶，桶内各自排序（常用插排），按桶序拼接；依赖均匀分布，期望 O(n)
- 基数排序：从低位到高位逐轮做**稳定**排序（每轮常为计数排序）；d 位整数 O(d(n + k))

**关键联系**：基数排序每一轮依赖内部排序的**稳定性**——低位排好的相对次序不能被高位打乱。

**坑**：值域巨大时计数数组内存爆炸；浮点分布不均会让桶退化 O(n²)；先问"值域/位数是否有限"再选它们。`,
    relations: [
      { to: 'dsa-sorting-family', desc: '非比较阵营在总览中的位置' },
      { to: 'dsa-stability', desc: '基数排序的每轮排序必须稳定' },
    ],
    example: `// 计数排序：值域 [0, k]，O(n + k)，稳定版
function countingSort(a, k) {
  const count = new Array(k + 1).fill(0);
  for (const x of a) count[x]++;               // 1. 计数
  for (let i = 1; i <= k; i++)
    count[i] += count[i - 1];                  // 2. 前缀和 = 排名
  const out = new Array(a.length);
  for (let i = a.length - 1; i >= 0; i--)      // 3. 倒序回填保证稳定
    out[--count[a[i]]] = a[i];
  return out;
}
countingSort([4, 2, 2, 8, 3, 3, 1], 8);
// [1, 2, 2, 3, 3, 4, 8]`,
    exampleLang: 'js',
    interview: '高频：为什么能突破比较下界（不做比较）；稳定版为何倒序回填；计数/桶/基数三者的关系与适用数据；十亿手机号排序怎么选。',
  },

  // ==================== 搜索与递归 ====================
  {
    id: 'dsa-binary-search-a',
    name: '二分查找',
    en: 'Binary Search',
    cat: 'dsa',
    sub: '搜索与递归',
    tags: ['查找', '分治'],
    summary: '二分查找在有序或单调数据上每次排除一半，O(log n)，关键在循环不变量与开闭区间纪律。',
    detail: `**是什么**：二分在**有序**（或具备单调性）的数据上查找：取中点比较、排除不可能的一半，每次折半 O(log n)——10 亿数据只需约 30 次。

**模板纪律（根治死循环与差一错误）**：
- 定好区间语义并贯穿始终：闭区间 [lo, hi] 配 while (lo <= hi) 与 hi = mid - 1；左闭右开配 while (lo < hi) 与 hi = mid
- mid 用 lo + ((hi - lo) >> 1) 防溢出
- 最通用两形态："第一个 ≥ x"（lower_bound）与"第一个 > x"（upper_bound），其余变体可归约

**二分答案**：把"求最小满足条件的值"转化为"对答案二分 + 判定函数"，单调性是前提。

**坑**：数据无序不能二分（除非按单调判定函数二分答案）；mid ± 1 边界遗漏会死循环；浮点二分控精度而非次数。`,
    relations: [
    ],
    example: `// 通用模板：返回第一个 >= x 的下标（lower_bound），闭区间写法
function lowerBound(a, x) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);   // 防溢出
    if (a[mid] >= x) hi = mid - 1;       // mid 可行，向左找更小可行解
    else lo = mid + 1;
  }
  return lo;                             // lo = 第一个 >= x 的位置
}
// 变体：找第一个 == x => lowerBound 后判等
// 变体：旋转数组找 target => 先判断哪半有序再二分`,
    exampleLang: 'js',
    interview: '高频：手写无死循环的二分；lower_bound/upper_bound；二分答案的识别信号（"最小化最大值/最大化最小值"）；x 的平方根、旋转数组等经典变体。',
  },
  {
    id: 'dsa-recursion-a',
    name: '递归与分治',
    en: 'Recursion & Divide-and-Conquer',
    cat: 'dsa',
    sub: '搜索与递归',
    tags: ['递归', '思想'],
    summary: '递归让函数调用自身解决更小的同类问题，分治再配"合并"步骤，把大问题拆成独立子问题。',
    detail: `**是什么**：递归是"函数调用自身"的求解方式，每个递归 = 基线条件（最小子问题直接返回）+ 递归条件（缩小规模调用自身）；调用栈自动保存每层局部状态。

**分治三步**：分（把问题拆成同构的独立子问题）→ 治（递归求解子问题）→ 合（把子解合并成原解）。归并、快排、二分、大整数乘法、最近点对皆此范式。

**复杂度分析**：递归式 T(n) = a·T(n/b) + f(n) 用主定理；直观法"每层代价 × 层数"。

**递归 vs 迭代**：任何递归可改显式栈迭代；深递归（万级）有爆栈风险；尾递归可被优化成循环，但 JS 引擎大多未实现。

**坑**：忘写基线条件死循环；先问"子问题是否重叠"——独立用分治，重叠用记忆化/DP，否则指数爆炸。`,
    relations: [
      { to: 'dsa-memo-tabulation', desc: '子问题重叠时升级为记忆化' },
      { to: 'dsa-stack-ds', desc: '递归即隐式使用调用栈' },
    ],
    example: `// 基线 + 递归条件：n 的阶乘
function fact(n) {
  if (n <= 1) return 1;            // 基线：最小子问题
  return n * fact(n - 1);          // 缩小规模调用自身
}

// 分治三步：求最大值 => 分半、各自求、取大
function maxOf(a, lo = 0, hi = a.length - 1) {
  if (lo === hi) return a[lo];                 // 治：单元素
  const mid = (lo + hi) >> 1;
  return Math.max(maxOf(a, lo, mid),           // 分 + 治
                  maxOf(a, mid + 1, hi));      // 合
}`,
    exampleLang: 'js',
    interview: '高频：递归三要素；调用栈如何保存现场；分治与 DP 的分界（子问题独立 vs 重叠）；主定理套 T(n) = 2T(n/2) + O(n)。',
  },
  {
    id: 'dsa-backtracking',
    name: '回溯法',
    en: 'Backtracking',
    cat: 'dsa',
    sub: '搜索与递归',
    tags: ['搜索', '思想'],
    summary: '回溯在决策树上 DFS 逐步构建解，走不通就撤销选择换分支，配合剪枝枚举所有可行解。',
    detail: `**是什么**：回溯 = 系统化试错：在"选择树"上做 DFS，每层做一个选择并深入；发现违反约束（或已不可能更优）就**撤销选择**回到上一层换分支。它穷举全部可行解，是指数级算法，剪枝是生命线。

**统一模板**：
- path 记当前路径；start 约束"只往后选"防重复（组合）；used 数组防同元素重用（排列）
- 每层：for 候选 → 做选择 → 递归 → 撤销选择
- 终止条件满足时收集 path

**经典题族**：全排列/子集/组合（去重：排序 + 跳过同层同值）、N 皇后、括号生成、数独、单词搜索。

**剪枝手段**：可行性剪枝（违反约束立即返回）、最优性剪枝（当前已劣于已知最优）、排序后提前 break。

**坑**：撤销时忘记恢复现场（visited/path）是头号 bug；排列与组合的 start 参数差异要想清楚。`,
    relations: [
      { to: 'dsa-dfs-a', desc: '回溯 = 树/图的 DFS + 撤销选择' },
      { to: 'dsa-recursion-a', desc: '回溯是递归的应用范式' },
    ],
    example: `// 全排列模板：做选择 -> 递归 -> 撤销选择
function permute(nums) {
  const res = [], path = [], used = new Array(nums.length).fill(false);
  const dfs = () => {
    if (path.length === nums.length) {
      res.push([...path]);          // 收集一个完整解
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;        // 剪枝：同元素不重复用
      used[i] = true; path.push(nums[i]);   // 做选择
      dfs();
      path.pop(); used[i] = false;  // 撤销（回溯的灵魂）
    }
  };
  dfs();
  return res;
}
permute([1, 2, 3]);  // 6 种排列`,
    exampleLang: 'js',
    interview: '高频：排列/组合/子集三件套与去重技巧（排序 + used[i-1]）；N 皇后的约束设计；回溯的复杂度量级与剪枝必要性。',
  },
  {
    id: 'dsa-memo-tabulation',
    name: '记忆化与制表',
    en: 'Memoization & Tabulation',
    cat: 'dsa',
    sub: '搜索与递归',
    tags: ['DP', '优化'],
    summary: '记忆化给递归缓存子问题结果（自顶向下），制表按序填表迭代（自底向上），同解重叠子问题。',
    detail: `**是什么**：两者都消灭"重叠子问题的重复计算"，是动态规划的两种等价实现：
- 记忆化（自顶向下）：保留递归结构，子问题首次算出即存缓存，再次遇到直接查——改动小、只算"被需要"的状态，但有递归栈开销
- 制表（自底向上）：按依赖顺序用循环填表，从边界推到答案——无递归开销、易做空间压缩（滚动数组），但可能算了不需要的状态

**何时需要**：递归树中同一子问题被反复求解（朴素 fib 的 fib(n-2) 算两遍、指数爆炸）；子问题不重叠则纯分治即可。

**升级路径**：暴力递归 → 带参数的记忆化 → 改制表 → 滚动数组压维度。

**坑**：记忆化的缓存键要涵盖所有变化参数；制表的填表顺序必须保证"算某状态时依赖已就绪"；JS 用 Map 可做稀疏缓存。`,
    relations: [
      { to: 'dsa-dp-intro', desc: '记忆化与制表是 DP 的两种实现形态' },
      { to: 'dsa-recursion-a', desc: '递归是记忆化的宿主' },
    ],
    example: `// 同一问题两种解法：爬楼梯 f(n) = f(n-1) + f(n-2)

// 自顶向下：记忆化递归 O(n)
function climbMemo(n, memo = new Map()) {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n);   // 命中缓存
  const r = climbMemo(n - 1, memo) + climbMemo(n - 2, memo);
  memo.set(n, r);                        // 存缓存
  return r;
}

// 自底向上：制表迭代 O(n)，两个滚动变量即 O(1) 空间
function climbTab(n) {
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
    exampleLang: 'js',
    interview: '高频：两种写法的优劣对比；斐波那契从 O(2ⁿ) 到 O(n) 的改造过程；什么时候制表能压到一维（状态只依赖上一行或前几个）。',
  },

  // ==================== 动态规划 ====================
  {
    id: 'dsa-dp-intro',
    name: '动态规划',
    en: 'Dynamic Programming',
    cat: 'dsa',
    sub: '动态规划',
    tags: ['DP', '思想'],
    summary: '动态规划把问题拆成重叠子问题，用"状态定义+转移方程"自底向上求最优解，避免重复计算。',
    detail: `**是什么**：动态规划适用于**最优子结构**（原问题最优解由子问题最优解构成）+ **重叠子问题**（子问题反复出现）的问题：把每个子问题的答案存进表，按依赖顺序推导，指数暴力降为多项式。

**三步拆题法**：
- 状态定义：dp[i]（或 dp[i][j]）代表什么？——最考验功力的一步
- 转移方程：dp[i] 如何由更小的状态推出？——枚举"最后一步"是万能切入
- 初始与顺序：边界值、填表方向

**常见模型**：线性（爬楼梯/打家劫舍）、双序列（LCS/编辑距离）、背包（选/不选）、区间、树形、状态压缩。

**坑**：贪心是 DP 的特例（局部最优即全局最优时可省表），能贪心别上 DP；状态定义模糊则转移写不出；先写暴力递归再翻译成 DP 是最稳路线。`,
    relations: [
      { to: 'dsa-memo-tabulation', desc: '记忆化/制表是 DP 的两种实现形态' },
      { to: 'dsa-greedy-a', desc: '贪心与 DP 的分界：局部最优是否安全' },
      { to: 'dsa-knapsack', desc: '背包是"选/不选"状态模型的经典载体' },
    ],
    example: `// 三步拆题：以"打家劫舍"（相邻不能都偷）为例
// 1. 状态：dp[i] = 前 i 间房能偷到的最大金额
// 2. 转移：dp[i] = max(dp[i-1],            // 不偷第 i 间
//                     dp[i-2] + nums[i])  // 偷第 i 间
// 3. 边界：滚动变量从 0 开始
function rob(nums) {
  let prev = 0, cur = 0;             // 滚动变量压掉数组
  for (const x of nums) {
    const next = Math.max(cur, prev + x);
    prev = cur; cur = next;
  }
  return cur;                        // O(n) 时间 O(1) 空间
}
rob([2, 7, 9, 3, 1]);  // 12`,
    exampleLang: 'js',
    interview: '高频：DP 两个成立条件的含义；如何从"枚举最后一步"找转移方程；贪心失败的反例（面值 1/3/4 的找零）；空间压缩的一般规律。',
  },
  {
    id: 'dsa-lcs-a',
    name: '最长公共子序列',
    en: 'Longest Common Subsequence (LCS)',
    cat: 'dsa',
    sub: '动态规划',
    tags: ['DP', '双序列'],
    summary: 'LCS 用二维 DP 求两序列按原相对顺序的最长公共部分，O(mn)，是 diff 与相似度的底层模型。',
    detail: `**是什么**：LCS 求两个序列"都能按原相对顺序对上"的最长子序列（不要求连续）；它是双序列 DP 的原型，也是 git diff、文件比对、DNA 比对的底层模型。

**状态与转移（O(mn) 时间与空间）**：
- dp[i][j] = a 前 i 个与 b 前 j 个的 LCS 长度
- a[i] === b[j]：dp[i][j] = dp[i-1][j-1] + 1（配对，两串各进一位）
- 否则：dp[i][j] = max(dp[i-1][j], dp[i][j-1])（丢 a 尾或 b 尾，取优）
- 边界：i = 0 或 j = 0 时为 0

**变体**：输出具体序列——从表尾回溯（匹配则斜上，否则走向较大者）；最长公共**子串**（连续版，不匹配清零）；只要长度可滚动数组压到 O(min(m, n))。

**坑**：子序列 ≠ 子串；回溯方向决定输出顺序（需反转）；无关字符数 = m + n - 2×LCS 可作 diff 编辑量近似。`,
    relations: [
      { to: 'dsa-dp-intro', desc: '双序列 DP 的原型题' },
      { to: 'dsa-edit-distance', desc: '同一张 DP 表：编辑距离是带代价的推广' },
    ],
    example: `// 1. 定义 dp[i][j] = a 前 i 与 b 前 j 的 LCS 长度
// 2. 转移：相同 -> 左上 + 1；不同 -> max(上, 左)
function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
  // 回溯还原一个具体序列
  let s = '', i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) { s = a[i - 1] + s; i--; j--; }
    else dp[i - 1][j] >= dp[i][j - 1] ? i-- : j--;
  }
  return { len: dp[m][n], seq: s };
}
lcs('ABCBDAB', 'BDCABA');  // len 4，如 'BCBA'`,
    exampleLang: 'js',
    interview: '高频：转移方程两种情况如何推出；如何输出具体序列；滚动数组空间优化；LCS 与 git diff 工具的关系。',
  },
  {
    id: 'dsa-knapsack',
    name: '背包问题',
    en: 'Knapsack Problem',
    cat: 'dsa',
    sub: '动态规划',
    tags: ['DP', '模型'],
    summary: '背包问题在容量限制下选物品最大化价值：0-1 背包倒序遍历容量、完全背包正序，O(nW)。',
    detail: `**是什么**：背包问题族是"带容量限制的选与不选"模型：n 件物品各有重量与价值，容量 W 内求最大价值。预算、时间、库存都是"容量"——资源分配类问题的万能壳。

**核心模型**：
- 0-1 背包：每件至多选一次；dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight] + value)；一维优化时容量**倒序**遍历（防同一物品被选两次）
- 完全背包：每件可选无限次；容量**正序**遍历
- 多重/分组背包：加次数上限或组内互斥的变体

**复杂度 O(nW)**：W 是数值不是规模——**伪多项式**，W 巨大时理论不可行（NP-hard）。

**坑**：0-1 与完全背包的一维写法仅差遍历方向，最易混淆；"恰好装满"要初始化为 -∞；求方案数时把 max 换加法。`,
    relations: [
      { to: 'dsa-dp-intro', desc: '背包是 DP "选/不选"模型的经典载体' },
      { to: 'dsa-greedy-a', desc: '分数背包可贪心、0-1 背包必须 DP 的分界案例' },
    ],
    example: `// 0-1 背包一维优化：容量必须倒序！
function knapsack01(weights, values, W) {
  const dp = new Array(W + 1).fill(0);    // dp[w] = 容量 w 的最大价值
  for (let i = 0; i < weights.length; i++)
    for (let w = W; w >= weights[i]; w--) // 倒序：保证每件只选一次
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
  return dp[W];
}

// 完全背包：内层改正序（同一物品可重复选）
function knapsackFull(weights, values, W) {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++)
    for (let w = weights[i]; w <= W; w++) // 正序：允许重复选择
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
  return dp[W];
}`,
    exampleLang: 'js',
    interview: '高频：为什么 0-1 倒序、完全正序（一维是二维滚动压缩，倒序保住"上一行"）；伪多项式的含义；装满方案数；组合与排列的内外循环区别。',
  },
  {
    id: 'dsa-lis',
    name: '最长递增子序列',
    en: 'Longest Increasing Subsequence (LIS)',
    cat: 'dsa',
    sub: '动态规划',
    tags: ['DP', '二分'],
    summary: 'LIS 求严格递增子序列的最大长度：DP O(n²)，贪心加二分维护 tails 数组可达 O(n log n)。',
    detail: `**是什么**：LIS 求数列中"严格递增"子序列的最大长度（不要求连续）。两层解法是同一问题的两次进化：
- DP：dp[i] = 以 i 结尾的 LIS 长度，dp[i] = max(dp[j]) + 1（j < i 且 a[j] < a[i]），O(n²)
- 贪心 + 二分：维护 tails 数组——tails[k] = 长度为 k+1 的递增子序列的**最小可能结尾**；它恒有序，对新元素 x 二分替换第一个 ≥ x 的位置（让结尾更小、后续更易延长），不存在则追加；O(n log n)

**直觉**：tails 不是任何一条真实的 LIS，但它的长度就是答案；每次替换都在"给未来留最好的尾巴"。

**变体**：输出具体序列（记录前驱）；二维套娃信封（一维排序 + 二维 LIS）；最长非递增（改比较符）。

**坑**：tails 是"结尾最小值"数组、不是 LIS 本身；严格递增用 lower_bound，非严格用 upper_bound。`,
    relations: [
      { to: 'dsa-binary-search-a', desc: 'O(n log n) 解法靠二分定位替换点' },
      { to: 'dsa-dp-intro', desc: 'O(n²) 解法是线性 DP 的经典形态' },
      { to: 'dsa-lcs-a', desc: '子序列家族：LIS 单序列，LCS 双序列' },
    ],
    example: `// 贪心 + 二分：O(n log n)
function lis(nums) {
  const tails = [];                    // tails[k]: 长度 k+1 的最小结尾
  for (const x of nums) {
    let lo = 0, hi = tails.length;     // 二分找第一个 >= x 的位置
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      tails[mid] < x ? (lo = mid + 1) : (hi = mid);
    }
    if (lo === tails.length) tails.push(x);  // x 比都大：延长
    else tails[lo] = x;                      // 否则替换：结尾更小
  }
  return tails.length;
}
lis([10, 9, 2, 5, 3, 7, 101, 18]);  // 4，如 [2, 5, 7, 101]`,
    exampleLang: 'js',
    interview: '高频：两种解法的思路与复杂度；tails 数组的含义与有序性；如何还原具体序列；扑克牌耐心排序与 LIS 的渊源。',
  },
  {
    id: 'dsa-edit-distance',
    name: '编辑距离',
    en: 'Edit Distance (Levenshtein)',
    cat: 'dsa',
    sub: '动态规划',
    tags: ['DP', '双序列'],
    summary: '编辑距离求把一个串改成另一个所需的最少插入/删除/替换次数，二维 DP O(mn)，拼写纠错基石。',
    detail: `**是什么**：编辑距离（Levenshtein 距离）量化两字符串相似度：把 a 改成 b 至少需要几次单字符插入/删除/替换。拼写检查、搜索纠错、DNA 序列比对、模糊匹配都基于它。

**状态与转移（O(mn) 时间与空间）**：
- dp[i][j] = a 前 i 个字符变成 b 前 j 个字符的最少操作数
- a[i] === b[j]：dp[i][j] = dp[i-1][j-1]（不用操作）
- 否则：dp[i][j] = 1 + min(dp[i-1][j-1] 替换, dp[i-1][j] 删除, dp[i][j-1] 插入)
- 边界：dp[i][0] = i（全删）、dp[0][j] = j（全插）

**直觉**：枚举"对最后一个字符的三种处置"取最小代价——与 LCS 共用同一张表骨架。

**坑**：只允许增删（不许替换）时距离 = m + n - 2×LCS；空间可滚动压到 O(min(m, n))；带操作权重即加权编辑距离。`,
    relations: [
      { to: 'dsa-dp-intro', desc: '双序列 DP 的代表应用' },
      { to: 'dsa-lcs-a', desc: '同表不同转移：LCS 是只增删的特例' },
      { to: 'agent-embedding', desc: '语义相似度用向量，字符级相似度用编辑距离，两者互补' },
    ],
    example: `// dp[i][j]: a 前 i 个 -> b 前 j 个的最少操作
function editDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;   // 全删
  for (let j = 0; j <= n; j++) dp[0][j] = j;   // 全插
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1],   // 替换
                       dp[i - 1][j],       // 删除
                       dp[i][j - 1]);      // 插入
  return dp[m][n];
}
editDistance('kitten', 'sitting');  // 3`,
    exampleLang: 'js',
    interview: '高频：三种操作如何对应转移；与 LCS 的数学关系；滚动数组优化；搜索引擎拼写纠错如何加速批量计算（BK 树、预剪枝）。',
  },

  // ==================== 高频技巧 ====================
  {
    id: 'dsa-greedy-a',
    name: '贪心算法',
    en: 'Greedy Algorithm',
    cat: 'dsa',
    sub: '高频技巧',
    tags: ['思想', '贪心'],
    summary: '贪心每步取局部最优且不回头，靠贪心选择性质保证全局最优，证明常比写代码更难。',
    detail: `**是什么**：贪心在每一步选"当下看起来最好"的选项且绝不反悔，一次扫描到底；成功与否取决于问题是否具有**贪心选择性质**（局部最优可导致全局最优）与最优子结构。

**常见套路（每类都是排序 + 贪心）**：
- 区间调度（最多不重叠区间）：按右端点排序，能选就选
- 区间覆盖：按左端点排序，扩展覆盖
- 跳跃游戏：维护可达边界
- 分发饼干/找零：从满足关系最近处配对
- 重量级应用：Huffman 编码、Kruskal/Prim、Dijkstra

**证明工具**：交换论证（任取最优解，换成贪心选择不会更差）、反证法。

**坑**：贪心失败没有任何信号——代码照跑、答案照错，必须先证明再实现；找零面值 1/3/4 时贪心错（6 = 4+1+1 vs 3+3），反例是面试常客。`,
    relations: [
      { to: 'dsa-dp-intro', desc: '贪心与 DP 的分水岭：局部最优是否全局安全' },
    ],
    example: `// 区间调度：最多多少个互不重叠的区间？按右端点贪心
function maxNonOverlapping(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);  // 右端点小者优先
  let count = 0, end = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= end) {        // 与已选区间不重叠
      count++;
      end = e;             // 保留最小的 end，给后面留空间
    }
  }
  return count;
}
maxNonOverlapping([[1, 3], [2, 4], [3, 5], [6, 8]]);  // 3
// 直觉：越早结束 => 给后面的区间腾出越多机会`,
    exampleLang: 'js',
    interview: '高频：如何判断一个问题能否贪心（举反例/交换论证）；区间题按左端点还是右端点排；找零反例；为什么说 Dijkstra 是贪心。',
  },
  {
    id: 'dsa-two-pointer-a',
    name: '双指针',
    en: 'Two Pointers',
    cat: 'dsa',
    sub: '高频技巧',
    tags: ['技巧', '数组'],
    summary: '双指针用两个下标协同扫描把 O(n²) 降为 O(n)，分对撞、快慢、同向读写三种基本形态。',
    detail: `**是什么**：双指针不是数据结构，而是利用序列的**有序性或结构单调性**、用两个下标一次遍历完成任务的技巧——把内层查找的 O(n) 省掉。

**三种形态**：
- 对撞指针：两头向中间靠拢（有序两数之和、回文判断、盛水容器）——前提是"两端关系有单调性"
- 快慢指针：同起点不同速度（链表判环、找中点）
- 同向读写指针：读指针扫描、写指针压实（原地移除元素、去重）——空间 O(1)

**复杂度**：两指针合计各走一遍数组，O(n)——比双重循环少一个数量级。

**识别信号**：有序数组上的配对问题、"原地"修改要求、链表中点/环。

**坑**：对撞指针只动违反条件的那一端，别两头都动；三数之和 = 排序 + 固定一个 + 对撞，记得跳过重复元素。`,
    relations: [
      { to: 'dsa-sliding-window-a', desc: '滑动窗口是同向双指针的进阶模板' },
    ],
    example: `// 对撞指针：有序数组找两数之和，O(n)
function twoSumSorted(a, target) {
  let l = 0, r = a.length - 1;
  while (l < r) {
    const s = a[l] + a[r];
    if (s === target) return [l, r];
    s < target ? l++ : r--;      // 小了移左，大了移右
  }
  return null;
}
// 同向读写指针：原地删除有序数组重复项
function removeDup(a) {
  let w = 1;
  for (let r = 1; r < a.length; r++)
    if (a[r] !== a[w - 1]) a[w++] = a[r];  // 新值才写
  return w;                    // 前 w 个为去重结果
}`,
    exampleLang: 'js',
    interview: '高频：三数之和（排序 + 对撞 + 去重）；移动零/移除元素的原地写法；为什么对撞指针不会漏解（单调性证明）；双指针与二分的选择。',
  },
  {
    id: 'dsa-sliding-window-a',
    name: '滑动窗口',
    en: 'Sliding Window',
    cat: 'dsa',
    sub: '高频技巧',
    tags: ['技巧', '数组'],
    summary: '滑动窗口用同向双指针维护连续区间，右扩左缩一次遍历解决子串/子数组类问题，O(n)。',
    detail: `**是什么**：滑动窗口是同向双指针的专用形态：右指针扩张纳入新元素，窗口不满足条件时左指针收缩——每个元素至多进出窗口各一次，O(n)。

**适用前提（关键判断）**：答案窗口具有**单调性**——右端右移时，窗口的可行性/最优性不会来回震荡。"最长的满足 X 的窗口""最短的满足 X 的窗口""每个定长窗口的极值"皆属此类。

**两大模板**：
- 求最长：右扩 → 违规则缩左 → 更新答案
- 求最短：右扩至满足 → 缩到刚不满足 → 更新答案

**经典题族**：无重复字符最长子串、最小覆盖子串、定长窗口最大和、和 ≥ s 的最短子数组（正数）。

**坑**：负数破坏单调性（窗口和不再随扩张递增），换前缀和 + 哈希；窗口内状态（计数器/哈希）要在左缩时正确回退；"恰好 k 个"常转化为"至多 k 减至多 k-1"。`,
    relations: [
      { to: 'dsa-two-pointer-a', desc: '滑动窗口是同向双指针的模板化' },
      { to: 'dsa-deque', desc: '单调队列专解窗口极值' },
    ],
    example: `// 无重复字符的最长子串：右扩左缩，O(n)
function lengthOfLongestSubstring(s) {
  const last = new Map();          // 字符 -> 最近出现下标
  let best = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left)
      left = last.get(ch) + 1;     // 重复：左界跳到重复位之后
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
lengthOfLongestSubstring('abcabcbb');  // 3`,
    exampleLang: 'js',
    interview: '高频：如何识别滑动窗口可用性（单调性）；定长与可变长两套模板；"恰好 k"的至多相减技巧；最小覆盖子串的 need/valid 计数。',
  },
  {
    id: 'dsa-prefix-sum-a',
    name: '前缀和与差分',
    en: 'Prefix Sum & Difference Array',
    cat: 'dsa',
    sub: '高频技巧',
    tags: ['技巧', '数组'],
    summary: '前缀和 pre[i] = 前 i 项之和使区间和查询 O(1)；差分是其逆运算，让区间批量加减 O(1)。',
    detail: `**是什么**：前缀和把"区间和的多次查询"从每次 O(n) 降到 O(1)：预处理 pre[i] = a[0..i-1] 之和，则 sum(l, r) = pre[r+1] - pre[l]。差分是逆运算：diff[i] = a[i] - a[i-1]，区间 [l, r] 整体加 v 只需 diff[l] += v、diff[r+1] -= v，最后一次前缀和还原——**区间批量修改**利器。

**复杂度**：预处理 O(n)；此后前缀和查询 O(1)、差分修改 O(1)。

**变体**：二维前缀和（子矩阵和，容斥原理）、前缀积、前缀异或；前缀和 + 哈希求"和为 k 的子数组个数"（两前缀作差 = k，查之前出现次数）。

**坑**：pre 数组长 n+1、下标错位是头号 bug 源；动态单点修改场景前缀和失效（改用树状数组/线段树）；负数不影响前缀和本身，但破坏单调性类技巧。`,
    relations: [
      { to: 'dsa-hash-map-a', desc: '前缀和+哈希组合拳的另一半' },
    ],
    example: `// 一维前缀和：区间和查询 O(1)
const a = [3, 1, 4, 1, 5];
const pre = [0];                       // pre[0] = 0 哨兵
for (let i = 0; i < a.length; i++) pre.push(pre[i] + a[i]);
const rangeSum = (l, r) => pre[r + 1] - pre[l];   // 含两端
rangeSum(1, 3);   // 6  (1 + 4 + 1)

// 差分：区间 [l, r] 整体 +v，还原时一次前缀和
const diff = new Array(a.length + 1).fill(0);
const add = (l, r, v) => { diff[l] += v; diff[r + 1] -= v; };
add(1, 3, 10); add(2, 4, -5);
let cur = 0;
const result = a.map((x, i) => (cur += diff[i], x + cur));`,
    exampleLang: 'js',
    interview: '高频：为什么要留 pre[0] = 0 哨兵；前缀和 + 哈希求和为 k 的子数组；前缀和/树状数组/线段树的适用边界（静态查询 vs 动态更新）；二维前缀和容斥。',
  },
  {
    id: 'dsa-bit-tricks',
    name: '位运算技巧',
    en: 'Bit Manipulation Tricks',
    cat: 'dsa',
    sub: '高频技巧',
    tags: ['技巧', '位运算'],
    summary: '位运算直接操作二进制位：异或对消找单数、n&(n-1) 清最低位 1、移位即乘除 2，常数极小。',
    detail: `**是什么**：位运算直接在二进制表示上计算——与、或、异或、取反、左移右移；硬件直通、无分支、常数极小，在算法题与嵌入式里都是降维打击。

**必会套路**：
- 异或三性质：x ^ x = 0、x ^ 0 = x、满足交换结合——"找落单的数""缺一个数"全靠对消
- n & (n - 1)：清掉最低位的 1——判 2 的幂（结果为 0）、数 1 的个数（Brian Kernighan）
- n & 1 取奇偶、n >> 1 除 2、1 << k 即 2^k
- 状态压缩：每个二进制位表示一个元素"选/不选"，一个 int 编码一个子集（状压 DP 的基石）

**坑**：JS 位运算按 32 位有符号整数处理，超范围先 | 0；带符号右移与 >>> 无符号右移不同；位运算优先级低于比较符，记得加括号；可读性代价要用注释弥补。`,
    relations: [
      { to: 'emb-register', desc: '寄存器位操作：置位/清位/翻转是嵌入式日常' },
      { to: 'dsa-set-ds', desc: '位图：用位运算实现超省内存的集合' },
    ],
    example: `// 1. 找出只出现一次的数：全员异或，成对对消
const single = (a) => a.reduce((x, y) => x ^ y, 0);
single([4, 1, 2, 1, 2]);            // 4

// 2. 统计二进制中 1 的个数（Brian Kernighan）
function popcount(n) {
  let c = 0;
  while (n) { n &= n - 1; c++; }    // 每次清掉最低位的 1
  return c;
}

// 3. 判断 2 的幂 & 状态压缩示例
const isPow2 = (n) => n > 0 && (n & (n - 1)) === 0;
const mask = 0b1010;                // 子集 {1, 3} 的位编码
const has = (m, i) => (m >> i) & 1; // 第 i 个元素是否在集合中`,
    exampleLang: 'js',
    interview: '高频：异或性质与找单数系列（两个落单数如何分组）；n & (n-1) 的两个应用；位图的内存计算（1 亿整数去重需要多少空间）；JS 位运算的 32 位陷阱。',
  },
];
