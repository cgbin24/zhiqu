import type { Level } from '@/types';

/** 算法课 · 第二章：算法思想篇 —— 从枚举到快排（10 关） */
export const ALGO_PARADIGM: Level[] = [
  {
    id: 'algo-paradigm-1',
    lang: 'algo',
    module: 'paradigm',
    order: 1,
    title: '枚举：三角形组合',
    difficulty: 2,
    xp: 25,
    goals: [
      '理解枚举思想：不重不漏地遍历所有候选',
      '掌握下标组合 i<j<k 的三重循环去重写法',
      '学会估算枚举量，判断暴力是否可行',
    ],
    brief: `## 枚举：把所有可能数一遍

枚举是最朴素的算法思想：答案空间不大时，**把所有候选一个一个试**，总有一个是对的。三角形成立的条件是"任意两边之和大于第三边"，候选是所有下标组合 i < j < k：

\`\`\`text
for i in 0..n:
  for j in i+1..n:
    for k in j+1..n:
      若 a[i]+a[j] > a[k] 且 a[i]+a[k] > a[j] 且 a[j]+a[k] > a[i]:
        count++
\`\`\`

限定 i < j < k，每种组合只被数一次 —— 枚举的是"组合"而非"排列"。n = 20 时最多 C(20,3) = 1140 次判断，瞬间完成；若 n 是 10⁵，三重循环就是 10¹⁵ 次，完全不可行。**枚举前先估算循环总量**，这是暴力法的生命线。

> ⚠️ 坑：两边之和可能溢出 32 位（两个 10⁹ 相加），Go/Rust/C++ 用 64 位整数；三个条件一个都不能省。`,
    task: `## 任务：数三角形

读入 n 条线段的长度，统计有多少种**下标组合** (i < j < k) 能围成三角形（任意两边之和大于第三边）。

**输入**：
- 第 1 行：n（3 ≤ n ≤ 20）
- 第 2 行：n 个正整数（≤ 10⁹）

**输出**：一行，能组成三角形的组合数量（按下标区分，相同长度的不同下标算不同组合）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`4\`<br>\`3 4 5 6\` | \`4\`（3,4,5 / 3,4,6 / 3,5,6 / 4,5,6 全部可行） |
| \`3\`<br>\`1 2 3\` | \`0\`（1+2 = 3，不大于 3） |

注意是**组合**不是排列：{3,4,5} 只算一种，别把同一组三条边数三遍。`,
    starter: `const n = Number(readline());
const a = readInts();
let count = 0;

// TODO 1: 三重循环枚举下标组合 i < j < k
// TODO 2: 判断三角形：任意两边之和大于第三边
// TODO 3: 输出 count

console.log(count); // 占位
`,
    solution: `const n = Number(readline());
const a = readInts();
let count = 0;
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    for (let k = j + 1; k < n; k++) {
      if (a[i] + a[j] > a[k] && a[i] + a[k] > a[j] && a[j] + a[k] > a[i]) count++;
    }
  }
}
console.log(count);
`,
    hints: [
      '三重循环枚举下标：`for i`、`for j = i+1`、`for k = j+1`，这样每个组合 (i<j<k) 只出现一次。',
      '三角形判定三个条件都要查：`a[i]+a[j] > a[k] && a[i]+a[k] > a[j] && a[j]+a[k] > a[i]`。',
      'Go/Rust/C++ 用 64 位整数存边长（两数相加可达 2×10⁹）。完整逻辑：三重循环里 if 三个条件同时成立就 count++，最后输出 count。',
    ],
    tests: [
      { name: '样例：3 4 5 6', stdin: '4\n3 4 5 6\n', expected: '4' },
      { name: '样例：退化 1 2 3', stdin: '3\n1 2 3\n', expected: '0' },
      { name: '隐藏：全等边', stdin: '5\n2 2 2 2 2\n', expected: '10', hidden: true },
      { name: '隐藏：全部不可行', stdin: '4\n1 1 2 3\n', expected: '0', hidden: true },
      { name: '隐藏：混合 6 条', stdin: '6\n7 2 3 4 5 10\n', expected: '7', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const n = Number(readline());
const a = readInts();
let count = 0;

// TODO 1: 三重循环枚举下标组合 i < j < k
// TODO 2: 判断三角形：任意两边之和大于第三边
// TODO 3: 输出 count

console.log(count); // 占位
`,
        go: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	a := make([]int64, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&a[i])
	}
	count := 0
	// TODO 1: 三重循环 i < j < k
	// TODO 2: 判断 a[i]+a[j] > a[k] 等三个条件
	// TODO 3: 输出 count
	fmt.Println(count) // 占位
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    let mut line2 = String::new();
    stdin().read_line(&mut line2).unwrap();
    let a: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let mut count = 0i64;
    // TODO 1: 三重循环 i < j < k
    // TODO 2: 判断 a[i] + a[j] > a[k] 等三个条件
    // TODO 3: 输出 count
    println!("{}", count); // 占位
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    long long count = 0;
    // TODO 1: 三重循环 i < j < k
    // TODO 2: 判断 a[i] + a[j] > a[k] 等三个条件
    // TODO 3: 输出 count
    cout << count << "\\n"; // 占位
    return 0;
}
`,
      },
      solutions: {
        javascript: `const n = Number(readline());
const a = readInts();
let count = 0;
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    for (let k = j + 1; k < n; k++) {
      if (a[i] + a[j] > a[k] && a[i] + a[k] > a[j] && a[j] + a[k] > a[i]) count++;
    }
  }
}
console.log(count);
`,
        go: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	a := make([]int64, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&a[i])
	}
	count := 0
	for i := 0; i < n; i++ {
		for j := i + 1; j < n; j++ {
			for k := j + 1; k < n; k++ {
				if a[i]+a[j] > a[k] && a[i]+a[k] > a[j] && a[j]+a[k] > a[i] {
					count++
				}
			}
		}
	}
	fmt.Println(count)
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    let mut line2 = String::new();
    stdin().read_line(&mut line2).unwrap();
    let a: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let mut count = 0i64;
    for i in 0..n {
        for j in i + 1..n {
            for k in j + 1..n {
                if a[i] + a[j] > a[k] && a[i] + a[k] > a[j] && a[j] + a[k] > a[i] {
                    count += 1;
                }
            }
        }
    }
    println!("{}", count);
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    long long count = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            for (int k = j + 1; k < n; k++)
                if (a[i] + a[j] > a[k] && a[i] + a[k] > a[j] && a[j] + a[k] > a[i]) count++;
    cout << count << "\\n";
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-paradigm-2',
    lang: 'algo',
    module: 'paradigm',
    order: 2,
    title: '递归入门：阶乘',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解递归两要素：基线条件与递归式',
      '能读懂递归调用树的展开与回传过程',
      '实现递归版阶乘并覆盖 0! = 1 边界',
    ],
    brief: `## 递归：自己调用自己

递归函数 = **基线条件**（什么时候停）+ **递归式**（如何拆成更小的同类问题）。阶乘天然满足：fact(n) = n × fact(n-1)，触底条件 fact(0) = 1。

递归的执行过程是一棵**调用树**。看 fib(5)（fib(n) = fib(n-1) + fib(n-2)，fib(0)=0、fib(1)=1）是怎么展开的 —— 上方动画可以逐帧看：

\`\`\`text
fib(5)
├─ fib(4)
│   ├─ fib(3) ── fib(2), fib(1)
│   └─ fib(2) ── fib(1), fib(0)
└─ fib(3)          ← 注意 fib(3)、fib(2) 被算了不止一次！
    ├─ fib(2) ...
    └─ fib(1)
\`\`\`

每个方框是一次函数调用：先一路拆到基线条件（叶子），返回值再逐层乘、加回去。函数每调用自己一次，调用栈就压入一层，返回时弹出。

> ⚠️ 忘写基线条件 = 无限递归 → 爆栈崩溃。递归深度也有上限：本题 n ≤ 12 很安全，但"递归不是免费的"要记在心里 —— 下一关就会遇到它失控的场面。`,
    task: `## 任务：递归算阶乘

用**递归**（自己调用自己）计算 n!。

**输入**：一行一个整数 n（0 ≤ n ≤ 12）

**输出**：一行，n! 的值

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5\` | \`120\`（5×4×3×2×1） |
| \`0\` | \`1\`（基线条件：0! = 1） |

要求：函数里必须同时有基线条件和递归调用两部分；不许写循环版糊弄 —— 递归结构是本关的考察点。`,
    starter: `const n = Number(readline());

// TODO 1: 定义递归函数 fact(k)：k <= 1 时返回 1（基线条件）
// TODO 2: 否则返回 k * fact(k - 1)（递归式）
// TODO 3: 输出 fact(n)

console.log(n); // 占位
`,
    solution: `const n = Number(readline());
function fact(k) {
  if (k <= 1) return 1;
  return k * fact(k - 1);
}
console.log(fact(n));
`,
    hints: [
      '递归两要素：基线条件（`k <= 1` 时返回 1，同时覆盖 0! 和 1!）+ 递归式（`k * fact(k-1)`）。',
      'JS 定义 `function fact(k) { if (k <= 1) return 1; return k * fact(k - 1); }`，输出 `fact(n)`。',
      'Go/Rust/C++ 把 fact 定义在 main 外面。n=0 时直接走基线条件返回 1 —— 不需要特判。',
    ],
    tests: [
      { name: '样例：5', stdin: '5\n', expected: '120' },
      { name: '样例：0', stdin: '0\n', expected: '1' },
      { name: '隐藏：1', stdin: '1\n', expected: '1', hidden: true },
      { name: '隐藏：10', stdin: '10\n', expected: '3628800', hidden: true },
      { name: '隐藏：上限 12', stdin: '12\n', expected: '479001600', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const n = Number(readline());

// TODO 1: 定义递归函数 fact(k)：k <= 1 时返回 1（基线条件）
// TODO 2: 否则返回 k * fact(k - 1)（递归式）
// TODO 3: 输出 fact(n)

console.log(n); // 占位
`,
        go: `package main

import "fmt"

// TODO 1: 定义 func fact(k int64) int64，基线条件 k <= 1 返回 1

func main() {
	var n int64
	fmt.Scan(&n)
	// TODO 2: 递归调用 fact(n) 并输出
	fmt.Println(n) // 占位
}
`,
        rust: `use std::io::stdin;

// TODO 1: 定义 fn fact(k: i64) -> i64，基线条件 k <= 1 返回 1

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let n: i64 = line.trim().parse().unwrap();
    // TODO 2: 递归调用 fact(n) 并输出
    println!("{}", n); // 占位
}
`,
        cpp: `#include <iostream>
using namespace std;

// TODO 1: 定义 long long fact(long long k)，基线条件 k <= 1 返回 1

int main() {
    long long n;
    cin >> n;
    // TODO 2: 递归调用 fact(n) 并输出
    cout << n << "\\n"; // 占位
    return 0;
}
`,
      },
      solutions: {
        javascript: `const n = Number(readline());
function fact(k) {
  if (k <= 1) return 1;
  return k * fact(k - 1);
}
console.log(fact(n));
`,
        go: `package main

import "fmt"

func fact(k int64) int64 {
	if k <= 1 {
		return 1
	}
	return k * fact(k-1)
}

func main() {
	var n int64
	fmt.Scan(&n)
	fmt.Println(fact(n))
}
`,
        rust: `use std::io::stdin;

fn fact(k: i64) -> i64 {
    if k <= 1 {
        return 1;
    }
    k * fact(k - 1)
}

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let n: i64 = line.trim().parse().unwrap();
    println!("{}", fact(n));
}
`,
        cpp: `#include <iostream>
using namespace std;

long long fact(long long k) {
    if (k <= 1) return 1;
    return k * fact(k - 1);
}

int main() {
    long long n;
    cin >> n;
    cout << fact(n) << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'recursion-tree' },
  },
  {
    id: 'algo-paradigm-3',
    lang: 'algo',
    module: 'paradigm',
    order: 3,
    title: '记忆化：斐波那契',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解朴素递归 fib 的重复子问题与指数复杂度',
      '掌握记忆化：memo 缓存让每个子问题只算一次',
      '体会指数级到 O(n) 的复杂度飞跃',
    ],
    brief: `## 记忆化：给递归装上缓存

上一关的 fib 调用树里，fib(3)、fib(2) 被反复计算 —— 朴素递归 fib(n) 的调用次数约是 O(1.618ⁿ)，fib(40) 要算 3 亿多次。可总共只有 n+1 个**不同的**子问题！**记忆化**（memoization）：算过就存起来，再问直接查表：

\`\`\`js
const memo = new Array(n + 1).fill(-1);
function fib(k) {
  if (k <= 1) return k;
  if (memo[k] !== -1) return memo[k]; // 查缓存：算过直接拿
  memo[k] = fib(k - 1) + fib(k - 2);  // 没算过：算完存进去
  return memo[k];
}
\`\`\`

每个子问题只真正计算一次，复杂度从指数级降到 **O(n)**。这就是动态规划的雏形："自顶向下递归 + 缓存"。

> ⚠️ 判题说明：mode=0（朴素递归）的测试 n ≤ 25，朴素也来得及跑完；但真实场景 n=40 时朴素递归要 3 亿次调用、明显超时 —— 这正是记忆化存在的意义。所以 n=40 的测试只出现在 mode=1 下。`,
    task: `## 任务：两种姿势的 fib

斐波那契：fib(0) = 0，fib(1) = 1，fib(n) = fib(n-1) + fib(n-2)。

**输入**：
- 第 1 行：n（0 ≤ n ≤ 40）
- 第 2 行：mode（0 = 朴素递归；1 = 记忆化递归）

**输出**：一行，fib(n)

### 示例

| 输入 | 输出 |
| --- | --- |
| \`10\`<br>\`1\` | \`55\` |
| \`5\`<br>\`0\` | \`5\` |

两种实现都要写：mode=0 走朴素递归，mode=1 走带 memo 数组的记忆化。判题中朴素递归的测试 n ≤ 25（保证 1 秒内算完），n=40 只在 mode=1 出现 —— 想想为什么。`,
    starter: `const n = Number(readline());
const mode = Number(readline());

// TODO 1: 写朴素递归 fibNaive(k)：k <= 1 返回 k，否则 fibNaive(k-1) + fibNaive(k-2)
// TODO 2: 写记忆化 fibMemo(k)：memo 数组缓存已算过的结果（初始 -1 表示未算）
// TODO 3: mode 为 1 输出 fibMemo(n)，否则输出 fibNaive(n)

console.log(n); // 占位
`,
    solution: `const n = Number(readline());
const mode = Number(readline());

function fibNaive(k) {
  if (k <= 1) return k;
  return fibNaive(k - 1) + fibNaive(k - 2);
}

const memo = new Array(n + 1).fill(-1);
function fibMemo(k) {
  if (k <= 1) return k;
  if (memo[k] !== -1) return memo[k];
  memo[k] = fibMemo(k - 1) + fibMemo(k - 2);
  return memo[k];
}

console.log(mode === 1 ? fibMemo(n) : fibNaive(n));
`,
    hints: [
      '朴素版：`if (k <= 1) return k; return fib(k-1) + fib(k-2);`。记忆化版：加一个 memo 数组，初始 -1 表示"没算过"。',
      '记忆化三步：进函数先查 `memo[k] !== -1` 就直接返回；否则递归计算；算完存入 `memo[k]` 再返回。',
      'mode 分支：1 走记忆化（n 可到 40），0 走朴素（判题只测 n ≤ 25，再大朴素就要算几百万次了）。fib(40) = 102334197，四语言都用 64 位整数稳妥。',
    ],
    tests: [
      { name: '样例：记忆化 fib(10)', stdin: '10\n1\n', expected: '55' },
      { name: '样例：朴素 fib(5)', stdin: '5\n0\n', expected: '5' },
      { name: '隐藏：朴素 fib(25)', stdin: '25\n0\n', expected: '75025', hidden: true },
      { name: '隐藏：记忆化 fib(40)', stdin: '40\n1\n', expected: '102334155', hidden: true },
      { name: '隐藏：记忆化 fib(30)', stdin: '30\n1\n', expected: '832040', hidden: true },
      { name: '隐藏：朴素 fib(0)', stdin: '0\n0\n', expected: '0', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const n = Number(readline());
const mode = Number(readline());

// TODO 1: 写朴素递归 fibNaive(k)：k <= 1 返回 k，否则 fibNaive(k-1) + fibNaive(k-2)
// TODO 2: 写记忆化 fibMemo(k)：memo 数组缓存已算过的结果（初始 -1 表示未算）
// TODO 3: mode 为 1 输出 fibMemo(n)，否则输出 fibNaive(n)

console.log(n); // 占位
`,
        go: `package main

import "fmt"

var memo []int64

// TODO 1: 朴素递归 fibNaive(k int) int64
// TODO 2: 记忆化 fibMemo(k int) int64：先查 memo[k]，没算过才算并存入

func main() {
	var n, mode int
	fmt.Scan(&n)
	fmt.Scan(&mode)
	// TODO 3: mode == 1 时初始化 memo（全 -1）并输出 fibMemo(n)，否则输出 fibNaive(n)
	fmt.Println(n) // 占位
}
`,
        rust: `use std::io::stdin;

// TODO 1: 朴素递归 fn fib_naive(k: u64) -> u64
// TODO 2: 记忆化 fn fib_memo(k: usize, memo: &mut Vec<i64>) -> i64

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    let mut line2 = String::new();
    stdin().read_line(&mut line2).unwrap();
    let mode: u32 = line2.trim().parse().unwrap();

    // TODO 3: mode == 1 时建 memo（全 -1）并调用 fib_memo，否则调用 fib_naive
    println!("{}", n); // 占位
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

// TODO 1: 朴素递归 long long fibNaive(int k)
// TODO 2: 记忆化 long long fibMemo(int k, vector<long long>& memo)

int main() {
    int n, mode;
    cin >> n >> mode;
    // TODO 3: mode == 1 时建 memo（全 -1）调用 fibMemo，否则调用 fibNaive
    cout << n << "\\n"; // 占位
    return 0;
}
`,
      },
      solutions: {
        javascript: `const n = Number(readline());
const mode = Number(readline());

function fibNaive(k) {
  if (k <= 1) return k;
  return fibNaive(k - 1) + fibNaive(k - 2);
}

const memo = new Array(n + 1).fill(-1);
function fibMemo(k) {
  if (k <= 1) return k;
  if (memo[k] !== -1) return memo[k];
  memo[k] = fibMemo(k - 1) + fibMemo(k - 2);
  return memo[k];
}

console.log(mode === 1 ? fibMemo(n) : fibNaive(n));
`,
        go: `package main

import "fmt"

var memo []int64

func fibNaive(k int) int64 {
	if k <= 1 {
		return int64(k)
	}
	return fibNaive(k-1) + fibNaive(k-2)
}

func fibMemo(k int) int64 {
	if k <= 1 {
		return int64(k)
	}
	if memo[k] != -1 {
		return memo[k]
	}
	memo[k] = fibMemo(k-1) + fibMemo(k-2)
	return memo[k]
}

func main() {
	var n, mode int
	fmt.Scan(&n)
	fmt.Scan(&mode)
	if mode == 1 {
		memo = make([]int64, n+1)
		for i := range memo {
			memo[i] = -1
		}
		fmt.Println(fibMemo(n))
	} else {
		fmt.Println(fibNaive(n))
	}
}
`,
        rust: `use std::io::stdin;

fn fib_naive(k: u64) -> u64 {
    if k <= 1 {
        return k;
    }
    fib_naive(k - 1) + fib_naive(k - 2)
}

fn fib_memo(k: usize, memo: &mut Vec<i64>) -> i64 {
    if k <= 1 {
        return k as i64;
    }
    if memo[k] != -1 {
        return memo[k];
    }
    memo[k] = fib_memo(k - 1, memo) + fib_memo(k - 2, memo);
    memo[k]
}

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    let mut line2 = String::new();
    stdin().read_line(&mut line2).unwrap();
    let mode: u32 = line2.trim().parse().unwrap();

    if mode == 1 {
        let mut memo = vec![-1i64; n + 1];
        println!("{}", fib_memo(n, &mut memo));
    } else {
        println!("{}", fib_naive(n as u64));
    }
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

long long fibNaive(int k) {
    if (k <= 1) return k;
    return fibNaive(k - 1) + fibNaive(k - 2);
}

long long fibMemo(int k, vector<long long>& memo) {
    if (k <= 1) return k;
    if (memo[k] != -1) return memo[k];
    return memo[k] = fibMemo(k - 1, memo) + fibMemo(k - 2, memo);
}

int main() {
    int n, mode;
    cin >> n >> mode;
    if (mode == 1) {
        vector<long long> memo(n + 1, -1);
        cout << fibMemo(n, memo) << "\\n";
    } else {
        cout << fibNaive(n) << "\\n";
    }
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-paradigm-4',
    lang: 'algo',
    module: 'paradigm',
    order: 4,
    title: '分治：归并排序',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解分治三步：分、治、合',
      '掌握有序数组的双指针合并写法',
      '理解 O(n log n) 的由来与归并的稳定性',
    ],
    brief: `## 分治：分成小块，逐个击破

归并排序是**分治**（Divide and Conquer）的教科书案例，三步走：

1. **分**：把数组从中间一分为二，各自递归排序（切到只剩 1 个元素，天然有序）
2. **合**：把两个**有序**子数组合并成一个有序数组 —— 双指针各指一头，每次取较小者

\`\`\`text
merge([2,5,9], [1,7])：
  比较 2 vs 1 → 取 1；比较 2 vs 7 → 取 2；……
\`\`\`

先看上方动画：数组不断对半切、再自底向上逐层合并，像一棵树。合并一次 O(n)、共 O(log n) 层，总复杂度 **O(n log n)**；相等元素不越位 —— 它还是**稳定**排序。

> ⚠️ 坑：合并时相等取**左边**（用 \`<=\`）才稳定；递归边界是"长度 ≤ 1 就停"，写错会无限切下去；C++/Go/Rust 实现时注意区间边界的开闭保持一致。`,
    task: `## 任务：手写归并排序

读入一行整数，用**归并排序**将它们升序排列后输出。

**输入**：一行 1~5000 个整数，空格分隔（绝对值 ≤ 10⁹）

**输出**：一行，升序排列的整数，单个空格分隔（行尾无空格）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5 2 9 1 7\` | \`1 2 5 7 9\` |
| \`42\` | \`42\` |

要求自己实现分治与合并（不许调用语言内置 sort）；相等元素保持先后顺序（稳定）也顺带做到 —— 合并时取 \`<=\` 的一侧即可。`,
    starter: `const a = readInts();

// TODO 1: mergeSort(arr)：长度 <= 1 直接返回；从中间切开，左右各自递归
// TODO 2: merge(left, right)：双指针比较两头的较小者，拼成有序数组
// TODO 3: 输出 mergeSort(a).join(' ')

console.log(a.join(' ')); // 占位
`,
    solution: `const a = readInts();
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}
console.log(mergeSort(a).join(' '));
`,
    hints: [
      '递归边界：数组长度 ≤ 1 直接返回。否则 `mid = Math.floor(len/2)`，对 `arr.slice(0, mid)` 和 `arr.slice(mid)` 各自递归。',
      '合并双指针：`while (i < left.length && j < right.length)` 取较小者（相等取左，保证稳定），再把剩余部分整体接上。',
      'Go/Rust/C++ 用切片（a[:mid]、a[mid:]）或下标区间实现都可以；输出用 join(" ") / 循环拼接，别用语言默认打印。',
    ],
    tests: [
      { name: '样例：乱序 5 个', stdin: '5 2 9 1 7\n', expected: '1 2 5 7 9' },
      { name: '样例：单个数', stdin: '42\n', expected: '42' },
      { name: '隐藏：负数与重复', stdin: '3 -1 3 0 -1\n', expected: '-1 -1 0 3 3', hidden: true },
      { name: '隐藏：倒序输入', stdin: '8 7 6 5 4 3 2 1\n', expected: '1 2 3 4 5 6 7 8', hidden: true },
      { name: '隐藏：已有序', stdin: '1 2 3\n', expected: '1 2 3', hidden: true },
      { name: '隐藏：随机 15 个', stdin: '42 -7 19 0 -3 88 5 5 -42 13 7 7 -19 60 1\n', expected: '-42 -19 -7 -3 0 1 5 5 7 7 13 19 42 60 88', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const a = readInts();

// TODO 1: mergeSort(arr)：长度 <= 1 直接返回；从中间切开，左右各自递归
// TODO 2: merge(left, right)：双指针比较两头的较小者，拼成有序数组
// TODO 3: 输出 mergeSort(a).join(' ')

console.log(a.join(' ')); // 占位
`,
        go: `package main

import "fmt"

// TODO 1: mergeSort(a []int64) []int64：len <= 1 直接返回，二分递归
// TODO 2: merge(left, right []int64) []int64：双指针合并成有序数组

func main() {
	var x int64
	var a []int64
	for {
		_, err := fmt.Scan(&x)
		if err != nil {
			break
		}
		a = append(a, x)
	}
	// TODO 3: 调用 mergeSort 后用空格分隔输出（行尾无空格）
	for _, v := range a {
		fmt.Print(v, " ") // 占位：格式需要修正
	}
	fmt.Println()
}
`,
        rust: `use std::io::stdin;

// TODO 1: fn merge_sort(a: Vec<i64>) -> Vec<i64>：len <= 1 直接返回，二分递归
// TODO 2: fn merge(left: Vec<i64>, right: Vec<i64>) -> Vec<i64>：双指针合并

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let a: Vec<i64> = line.split_whitespace().map(|x| x.parse().unwrap()).collect();
    // TODO 3: 输出排序结果（join(" ")）
    let strs: Vec<String> = a.iter().map(|x| x.to_string()).collect();
    println!("{}", strs.join(" ")); // 占位：还没排序
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

// TODO 1: mergeSort(a, lo, hi)：lo >= hi 返回，二分递归
// TODO 2: merge(a, lo, mid, hi)：双指针合并 a[lo..mid] 与 a[mid+1..hi]

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);
    // TODO 3: 调用 mergeSort(a, 0, a.size()-1) 后空格分隔输出
    for (size_t i = 0; i < a.size(); i++) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << "\\n"; // 占位：还没排序
    return 0;
}
`,
      },
      solutions: {
        javascript: `const a = readInts();
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}
console.log(mergeSort(a).join(' '));
`,
        go: `package main

import "fmt"

func merge(left, right []int64) []int64 {
	out := make([]int64, 0, len(left)+len(right))
	i, j := 0, 0
	for i < len(left) && j < len(right) {
		if left[i] <= right[j] {
			out = append(out, left[i])
			i++
		} else {
			out = append(out, right[j])
			j++
		}
	}
	out = append(out, left[i:]...)
	out = append(out, right[j:]...)
	return out
}

func mergeSort(a []int64) []int64 {
	if len(a) <= 1 {
		return a
	}
	mid := len(a) / 2
	return merge(mergeSort(a[:mid]), mergeSort(a[mid:]))
}

func main() {
	var x int64
	var a []int64
	for {
		_, err := fmt.Scan(&x)
		if err != nil {
			break
		}
		a = append(a, x)
	}
	res := mergeSort(a)
	for i, v := range res {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(v)
	}
	fmt.Println()
}
`,
        rust: `use std::io::stdin;

fn merge(left: Vec<i64>, right: Vec<i64>) -> Vec<i64> {
    let mut out = Vec::with_capacity(left.len() + right.len());
    let mut i = 0;
    let mut j = 0;
    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            out.push(left[i]);
            i += 1;
        } else {
            out.push(right[j]);
            j += 1;
        }
    }
    out.extend_from_slice(&left[i..]);
    out.extend_from_slice(&right[j..]);
    out
}

fn merge_sort(a: Vec<i64>) -> Vec<i64> {
    if a.len() <= 1 {
        return a;
    }
    let (left, right) = a.split_at(a.len() / 2);
    merge(merge_sort(left.to_vec()), merge_sort(right.to_vec()))
}

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let a: Vec<i64> = line.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let res = merge_sort(a);
    let strs: Vec<String> = res.iter().map(|x| x.to_string()).collect();
    println!("{}", strs.join(" "));
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

void merge(vector<long long>& a, int lo, int mid, int hi) {
    vector<long long> tmp;
    int i = lo, j = mid + 1;
    while (i <= mid && j <= hi) {
        if (a[i] <= a[j]) tmp.push_back(a[i++]);
        else tmp.push_back(a[j++]);
    }
    while (i <= mid) tmp.push_back(a[i++]);
    while (j <= hi) tmp.push_back(a[j++]);
    for (int k = 0; k < (int)tmp.size(); k++) a[lo + k] = tmp[k];
}

void mergeSort(vector<long long>& a, int lo, int hi) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(a, lo, mid);
    mergeSort(a, mid + 1, hi);
    merge(a, lo, mid, hi);
}

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);
    mergeSort(a, 0, (int)a.size() - 1);
    for (int i = 0; i < (int)a.size(); i++) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'sort', param: 'merge' },
  },
  {
    id: 'algo-paradigm-5',
    lang: 'algo',
    module: 'paradigm',
    order: 5,
    title: '贪心：找零',
    difficulty: 2,
    xp: 25,
    goals: [
      '理解贪心思想：每步取当前最优',
      '掌握大面额优先的找零策略',
      '认识贪心的适用前提与反例意识',
    ],
    brief: `## 贪心：每步都拿眼前最优

**贪心**：不做长远规划，每一步选当前看起来最好的选择，寄希望于局部最优连成全局最优。找零钱是经典例子：每次都先用**最大面额**去凑：

\`\`\`text
144 元 → 1 张 100（剩 44）→ 0 张 50 → 2 张 20（剩 4）
      → 10、5 各 0 张 → 4 张 1 → 共 7 张
\`\`\`

面额 {100,50,20,10,5,1} 下，贪心**恰好**给出张数最少的方案：大面额能抵掉的钱，小面额只能用更多张数补 —— 能拿大就拿大一定不亏。

> ⚠️ 贪心不是万能公式！换成面额 {1,3,4} 找 6 元：贪心拿 4+1+1 共 3 张，最优却是 3+3 共 2 张。标准币值系统是"规范币制"，贪心才正确。做题时先问一句：**这道题的局部最优为什么不会骗人？**`,
    task: `## 任务：ATM 找零

读入一个金额（正整数，单位：元），用面额 {100, 50, 20, 10, 5, 1} 找零，输出**贪心策略**下每种面额用的张数。

**输入**：一行一个整数 m（1 ≤ m ≤ 10⁶）

**输出**：一行，格式如 \`100x1 50x0 20x2 10x0 5x0 1x4\` —— 按面额**从大到小**、空格分隔，0 张也要输出

### 示例

| 输入 | 输出 |
| --- | --- |
| \`144\` | \`100x1 50x0 20x2 10x0 5x0 1x4\` |
| \`1\` | \`100x0 50x0 20x0 10x0 5x0 1x1\` |

注意 144 = 100 + 20×2 + 1×4。面额与张数之间是小写字母 x（不是乘号），没有冒号和等号。`,
    starter: `let m = Number(readline());
const denoms = [100, 50, 20, 10, 5, 1];

// TODO 1: 从大到小遍历面额：当前面额张数 = Math.floor(m / d)
// TODO 2: 拼接 "面额x张数" 片段（0 张也要），m %= d 更新剩余
// TODO 3: 空格分隔输出一行

console.log(m); // 占位
`,
    solution: `let m = Number(readline());
const denoms = [100, 50, 20, 10, 5, 1];
const out = [];
for (const d of denoms) {
  out.push(d + 'x' + Math.floor(m / d));
  m %= d;
}
console.log(out.join(' '));
`,
    hints: [
      '核心就两行：张数 = `Math.floor(m / d)`，剩余 `m %= d`。从 100 开始从大到小处理。',
      'JS 拼片段 `d + "x" + Math.floor(m / d)` push 进数组，最后 `join(" ")`。0 张也要 push。',
      'Go 用 `fmt.Printf("%dx%d", d, m/d)` + 空格分隔（首项前不加空格）；C++ `cout << denoms[i] << "x" << m/denoms[i]`；Rust `format!("{}x{}", d, m/d)` 收集后 join。',
    ],
    tests: [
      { name: '样例：144', stdin: '144\n', expected: '100x1 50x0 20x2 10x0 5x0 1x4' },
      { name: '样例：1', stdin: '1\n', expected: '100x0 50x0 20x0 10x0 5x0 1x1' },
      { name: '隐藏：整百', stdin: '100\n', expected: '100x1 50x0 20x0 10x0 5x0 1x0', hidden: true },
      { name: '隐藏：76', stdin: '76\n', expected: '100x0 50x1 20x1 10x0 5x1 1x1', hidden: true },
      { name: '隐藏：99', stdin: '99\n', expected: '100x0 50x1 20x2 10x0 5x1 1x4', hidden: true },
      { name: '隐藏：8', stdin: '8\n', expected: '100x0 50x0 20x0 10x0 5x1 1x3', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `let m = Number(readline());
const denoms = [100, 50, 20, 10, 5, 1];

// TODO 1: 从大到小遍历面额：当前面额张数 = Math.floor(m / d)
// TODO 2: 拼接 "面额x张数" 片段（0 张也要），m %= d 更新剩余
// TODO 3: 空格分隔输出一行

console.log(m); // 占位
`,
        go: `package main

import "fmt"

func main() {
	var m int64
	fmt.Scan(&m)
	denoms := []int64{100, 50, 20, 10, 5, 1}
	for _, d := range denoms {
		_ = d
		// TODO 1: m/d 是张数，m %= d 更新剩余
		// TODO 2: 按 "%dx%d" 输出（空格分隔、0 张也要、行尾无空格）
	}
	fmt.Println() // 占位
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut m: i64 = line.trim().parse().unwrap();
    let denoms = [100i64, 50, 20, 10, 5, 1];

    // TODO 1: 从大到小遍历面额：m / d 是张数，m %= d 更新剩余
    // TODO 2: 拼接 "面额x张数"（0 张也要），空格分隔输出一行
    println!("{}", m); // 占位
}
`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    long long m;
    cin >> m;
    long long denoms[6] = {100, 50, 20, 10, 5, 1};

    // TODO 1: 从大到小遍历面额：m / d 是张数，m %= d 更新剩余
    // TODO 2: 输出 "面额x张数"（0 张也要），空格分隔，行尾无空格
    cout << m << "\\n"; // 占位
    return 0;
}
`,
      },
      solutions: {
        javascript: `let m = Number(readline());
const denoms = [100, 50, 20, 10, 5, 1];
const out = [];
for (const d of denoms) {
  out.push(d + 'x' + Math.floor(m / d));
  m %= d;
}
console.log(out.join(' '));
`,
        go: `package main

import "fmt"

func main() {
	var m int64
	fmt.Scan(&m)
	denoms := []int64{100, 50, 20, 10, 5, 1}
	first := true
	for _, d := range denoms {
		if !first {
			fmt.Print(" ")
		}
		first = false
		fmt.Printf("%dx%d", d, m/d)
		m %= d
	}
	fmt.Println()
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut m: i64 = line.trim().parse().unwrap();
    let denoms = [100i64, 50, 20, 10, 5, 1];
    let mut parts: Vec<String> = Vec::new();
    for d in denoms {
        parts.push(format!("{}x{}", d, m / d));
        m %= d;
    }
    println!("{}", parts.join(" "));
}
`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    long long m;
    cin >> m;
    long long denoms[6] = {100, 50, 20, 10, 5, 1};
    bool first = true;
    for (int i = 0; i < 6; i++) {
        if (!first) cout << ' ';
        first = false;
        cout << denoms[i] << 'x' << m / denoms[i];
        m %= denoms[i];
    }
    cout << "\\n";
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-paradigm-6',
    lang: 'algo',
    module: 'paradigm',
    order: 6,
    title: '贪心：区间调度',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解区间调度为什么按右端点排序',
      '掌握"能选就选"的贪心扫描',
      '处理闭区间共享端点算冲突的边界',
    ],
    brief: `## 贪心：按右端点排排坐

活动选择/区间调度：n 个区间里选尽量多的**互不相交**的。哪种贪心策略是对的？

- 按开始时间排？早开始的可能巨长，堵死后面
- 按长度排？短的可能正好横在中间
- **按结束时间排 ✓**：最早结束的给后面留最多的空间

\`\`\`text
按 r 从小到大排序
依次扫描：若 l > lastR（与上一个选中的不重叠）→ 选它，lastR = r
\`\`\`

验证示例：按右端点排序后"能选就选"，得到的就是最优解 —— 反证法可证：任何最优解都可以把第一个区间换成"结束最早"的那个，不会变差。排序 O(n log n) + 扫描 O(n)。

> ⚠️ 本题区间是**闭区间**：共享端点也算相交（如 [1,3] 和 [3,5] 只能选一个），所以判断条件是严格的 \`l > lastR\`，不是 \`l >= lastR\`。`,
    task: `## 任务：最多能参加几场活动

n 个活动，第 i 个占据时间区间 [l, r]（**闭区间**，共享端点算冲突）。选出一组两两不冲突的活动，问最多能选几个。

**输入**：
- 第 1 行：n（1 ≤ n ≤ 10⁵）
- 接下来 n 行：每行 l r（0 ≤ l ≤ r ≤ 10⁹）

**输出**：一行，最多可选的不相交区间数

### 示例

| 输入 | 输出 |
| --- | --- |
| \`4\`<br>\`1 3\`<br>\`2 5\`<br>\`4 7\`<br>\`6 9\` | \`2\`（选 [1,3] 和 [4,7]） |
| \`3\`<br>\`1 2\`<br>\`2 3\`<br>\`3 4\` | \`2\`（闭区间端点相接算冲突：选 [1,2] 与 [3,4]） |

提示：按右端点从小到大排序，能选就选。`,
    starter: `const n = Number(readline());
const iv = [];
for (let i = 0; i < n; i++) {
  const [l, r] = readInts();
  iv.push([l, r]);
}

// TODO 1: 按右端点 r 从小到大排序：iv.sort((x, y) => x[1] - y[1])
// TODO 2: 依次扫描：l > lastR（初始 -1）就选它，count++，lastR = r
// TODO 3: 输出 count

console.log(n); // 占位
`,
    solution: `const n = Number(readline());
const iv = [];
for (let i = 0; i < n; i++) {
  const [l, r] = readInts();
  iv.push([l, r]);
}
iv.sort((x, y) => x[1] - y[1]);
let count = 0;
let lastR = -1;
for (const [l, r] of iv) {
  if (l > lastR) {
    count++;
    lastR = r;
  }
}
console.log(count);
`,
    hints: [
      '排序是第一步：JS `iv.sort((x, y) => x[1] - y[1])` 按 r 升序。C++ 把区间存成 pair(r, l) 后 sort 即可。',
      '扫描规则：`if (l > lastR)`（严格大于，闭区间共享端点算冲突）就选中：`count++; lastR = r;`。lastR 初始 -1。',
      '为什么对？最早结束的区间给后面留的空间最大。反证：若最优解第一个选的不是最早结束的，换成它只会更好不会更差。',
    ],
    tests: [
      { name: '样例：4 个区间', stdin: '4\n1 3\n2 5\n4 7\n6 9\n', expected: '2' },
      { name: '样例：端点相接', stdin: '3\n1 2\n2 3\n3 4\n', expected: '2' },
      { name: '隐藏：单区间', stdin: '1\n5 9\n', expected: '1', hidden: true },
      { name: '隐藏：完全重叠', stdin: '3\n0 10\n0 10\n0 10\n', expected: '1', hidden: true },
      { name: '隐藏：嵌套与交叠', stdin: '6\n1 4\n2 3\n3 6\n5 7\n8 9\n6 8\n', expected: '3', hidden: true },
      { name: '隐藏：全不冲突', stdin: '5\n1 2\n3 4\n5 6\n7 8\n9 10\n', expected: '5', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const n = Number(readline());
const iv = [];
for (let i = 0; i < n; i++) {
  const [l, r] = readInts();
  iv.push([l, r]);
}

// TODO 1: 按右端点 r 从小到大排序：iv.sort((x, y) => x[1] - y[1])
// TODO 2: 依次扫描：l > lastR（初始 -1）就选它，count++，lastR = r
// TODO 3: 输出 count

console.log(n); // 占位
`,
        go: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	type interval struct{ l, r int64 }
	iv := make([]interval, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&iv[i].l, &iv[i].r)
	}
	// TODO 1: 引入 "sort" 包，sort.Slice 按 r 从小到大排序
	// TODO 2: 扫描：l > lastR（初始 -1）就选，count++，lastR = r
	count := 0
	fmt.Println(count) // 占位
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    let mut iv: Vec<(i64, i64)> = Vec::new();
    for _ in 0..n {
        let mut lr = String::new();
        stdin().read_line(&mut lr).unwrap();
        let mut p = lr.split_whitespace();
        let l: i64 = p.next().unwrap().parse().unwrap();
        let r: i64 = p.next().unwrap().parse().unwrap();
        iv.push((l, r));
    }

    // TODO 1: iv.sort_by_key(|x| x.1) 按右端点排序
    // TODO 2: 扫描：l > last_r（初始 -1）就选，count += 1，last_r = r
    let mut count = 0i64;
    println!("{}", count); // 占位
}
`,
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<long long, long long>> iv(n); // 存 (r, l)，方便按 r 排序
    for (int i = 0; i < n; i++) cin >> iv[i].second >> iv[i].first;

    // TODO 1: sort(iv.begin(), iv.end()) 后即按 r 升序
    // TODO 2: 扫描：l（.second）> lastR（初始 -1）就选，count++，lastR = r（.first）
    long long count = 0;
    cout << count << "\\n"; // 占位
    return 0;
}
`,
      },
      solutions: {
        javascript: `const n = Number(readline());
const iv = [];
for (let i = 0; i < n; i++) {
  const [l, r] = readInts();
  iv.push([l, r]);
}
iv.sort((x, y) => x[1] - y[1]);
let count = 0;
let lastR = -1;
for (const [l, r] of iv) {
  if (l > lastR) {
    count++;
    lastR = r;
  }
}
console.log(count);
`,
        go: `package main

import (
	"fmt"
	"sort"
)

func main() {
	var n int
	fmt.Scan(&n)
	type interval struct{ l, r int64 }
	iv := make([]interval, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&iv[i].l, &iv[i].r)
	}
	sort.Slice(iv, func(i, j int) bool { return iv[i].r < iv[j].r })
	count := 0
	var lastR int64 = -1
	for _, it := range iv {
		if it.l > lastR {
			count++
			lastR = it.r
		}
	}
	fmt.Println(count)
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    let mut iv: Vec<(i64, i64)> = Vec::new();
    for _ in 0..n {
        let mut lr = String::new();
        stdin().read_line(&mut lr).unwrap();
        let mut p = lr.split_whitespace();
        let l: i64 = p.next().unwrap().parse().unwrap();
        let r: i64 = p.next().unwrap().parse().unwrap();
        iv.push((l, r));
    }
    iv.sort_by_key(|x| x.1);
    let mut count = 0i64;
    let mut last_r: i64 = -1;
    for (l, r) in iv {
        if l > last_r {
            count += 1;
            last_r = r;
        }
    }
    println!("{}", count);
}
`,
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<long long, long long>> iv(n); // 存 (r, l)，sort 后按 r 升序
    for (int i = 0; i < n; i++) cin >> iv[i].second >> iv[i].first;
    sort(iv.begin(), iv.end());
    long long count = 0, lastR = -1;
    for (auto& p : iv) {
        if (p.second > lastR) {
            count++;
            lastR = p.first;
        }
    }
    cout << count << "\\n";
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-paradigm-7',
    lang: 'algo',
    module: 'paradigm',
    order: 7,
    title: '二分查找',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握二分查找的 lo/hi/mid 不变量',
      '理解 O(log n)：每次比较排除一半',
      '注意有序前提与防溢出的 mid 写法',
    ],
    brief: `## 二分查找：每次砍一半

有序数组里找 target，从头扫是 O(n)；**二分查找**利用有序性每次排除一半，O(log n) —— 10⁶ 个数只要约 20 次比较：

\`\`\`text
lo = 0, hi = n-1
while lo <= hi:
  mid = lo + (hi-lo)/2
  a[mid] == target → 找到，返回 mid
  a[mid] <  target → 目标在右半，lo = mid+1
  a[mid] >  target → 目标在左半，hi = mid-1
\`\`\`

先看上方动画：区间 [lo..hi] 像被反复折半，直到夹出答案或区间变空（返回 -1）。不变量始终成立：**target 若存在，必在 [lo..hi] 内**。

> ⚠️ 三个坑：① 前提是**有序**，无序数组二分没有意义；② mid 写 \`lo + (hi-lo)/2\` 而不是 \`(lo+hi)/2\` —— 后者在其他语言里可能整型溢出（C/C++ 的经典事故）；③ 循环条件 \`lo <= hi\` 的等号不能丢，否则单元素区间查不到。本题数组**无重复元素**，答案唯一。`,
    task: `## 任务：折半找数

给定升序数组（元素互不相同），查找 target 的下标；不存在输出 -1。要求用二分查找。

**输入**：
- 第 1 行：n 和 target（1 ≤ n ≤ 10⁵，|target| ≤ 10⁹）
- 第 2 行：n 个严格升序的整数（绝对值 ≤ 10⁹）

**输出**：一行，target 的下标（从 0 开始）或 -1

### 示例

| 输入 | 输出 |
| --- | --- |
| \`8 7\`<br>\`-5 -1 0 3 7 9 12 20\` | \`4\` |
| \`5 100\`<br>\`1 2 3 4 5\` | \`-1\` |

数组元素互不相同，答案唯一 —— 不会出现"该返回哪一个下标"的歧义。`,
    starter: `const [n, target] = readInts();
const a = readInts();

// TODO 1: lo = 0, hi = n - 1，ans = -1
// TODO 2: while (lo <= hi)：mid = lo + Math.floor((hi - lo) / 2)
//         a[mid] === target → 记下并 break；小于 target → lo = mid + 1；否则 hi = mid - 1
// TODO 3: 输出 ans

console.log(-1); // 占位
`,
    solution: `const [n, target] = readInts();
const a = readInts();
let lo = 0, hi = n - 1;
let ans = -1;
while (lo <= hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (a[mid] === target) { ans = mid; break; }
  if (a[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
console.log(ans);
`,
    hints: [
      '三件套：`lo = 0, hi = n - 1, ans = -1`，循环条件 `lo <= hi`。',
      '`mid = lo + Math.floor((hi - lo) / 2)`：a[mid] 等于 target 就记下并 break；小于 target 说明目标在右半 `lo = mid + 1`；大于则在左半 `hi = mid - 1`。',
      'Rust 里 lo/hi 用 isize 避免下溢（mid=0 时 hi = mid-1 会变成 -1）。循环自然结束后 ans 仍是 -1 就是不存在。',
    ],
    tests: [
      { name: '样例：找到 7', stdin: '8 7\n-5 -1 0 3 7 9 12 20\n', expected: '4' },
      { name: '样例：不存在', stdin: '5 100\n1 2 3 4 5\n', expected: '-1' },
      { name: '隐藏：单元素命中', stdin: '1 42\n42\n', expected: '0', hidden: true },
      { name: '隐藏：偶数位命中', stdin: '6 3\n1 3 5 7 9 11\n', expected: '1', hidden: true },
      { name: '隐藏：首元素', stdin: '4 -9\n-9 -4 0 8\n', expected: '0', hidden: true },
      { name: '隐藏：尾部附近', stdin: '7 25\n1 4 9 16 20 25 36\n', expected: '5', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const [n, target] = readInts();
const a = readInts();

// TODO 1: lo = 0, hi = n - 1，ans = -1
// TODO 2: while (lo <= hi)：mid = lo + Math.floor((hi - lo) / 2)
//         a[mid] === target → 记下并 break；小于 target → lo = mid + 1；否则 hi = mid - 1
// TODO 3: 输出 ans

console.log(-1); // 占位
`,
        go: `package main

import "fmt"

func main() {
	var n int
	var target int64
	fmt.Scan(&n, &target)
	a := make([]int64, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&a[i])
	}
	ans := -1
	// TODO: 声明 lo, hi := 0, n-1，写 for lo <= hi 的二分循环：mid = lo + (hi-lo)/2，比较 a[mid] 与 target
	fmt.Println(ans) // 占位
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut it = line.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let target: i64 = it.next().unwrap().parse().unwrap();

    let mut line2 = String::new();
    stdin().read_line(&mut line2).unwrap();
    let a: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let mut lo: isize = 0;
    let mut hi: isize = n as isize - 1;
    let mut ans: i64 = -1;
    // TODO: while lo <= hi 的二分循环：mid = lo + (hi - lo) / 2，比较 a[mid as usize] 与 target
    println!("{}", ans); // 占位
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    long long target;
    cin >> n >> target;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    int lo = 0, hi = n - 1;
    long long ans = -1;
    // TODO: while (lo <= hi) 的二分循环：mid = lo + (hi - lo) / 2，比较 a[mid] 与 target
    cout << ans << "\\n"; // 占位
    return 0;
}
`,
      },
      solutions: {
        javascript: `const [n, target] = readInts();
const a = readInts();
let lo = 0, hi = n - 1;
let ans = -1;
while (lo <= hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (a[mid] === target) { ans = mid; break; }
  if (a[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
console.log(ans);
`,
        go: `package main

import "fmt"

func main() {
	var n int
	var target int64
	fmt.Scan(&n, &target)
	a := make([]int64, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&a[i])
	}
	lo, hi := 0, n-1
	ans := -1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		if a[mid] == target {
			ans = mid
			break
		} else if a[mid] < target {
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	fmt.Println(ans)
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut it = line.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let target: i64 = it.next().unwrap().parse().unwrap();

    let mut line2 = String::new();
    stdin().read_line(&mut line2).unwrap();
    let a: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let mut lo: isize = 0;
    let mut hi: isize = n as isize - 1;
    let mut ans: i64 = -1;
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        if a[mid as usize] == target {
            ans = mid as i64;
            break;
        } else if a[mid as usize] < target {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    println!("{}", ans);
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    long long target;
    cin >> n >> target;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    int lo = 0, hi = n - 1;
    long long ans = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) { ans = mid; break; }
        else if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    cout << ans << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'binary-search' },
  },
  {
    id: 'algo-paradigm-8',
    lang: 'algo',
    module: 'paradigm',
    order: 8,
    title: '二分答案：木头切割',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解二分答案：答案具有单调性即可二分',
      '掌握"验证函数 + 二分框架"的组合套路',
      '处理无解输出 0 的边界',
    ],
    brief: `## 二分答案：猜数字的艺术

"求最大的段长 L，使得能切出至少 k 段" —— 注意单调性：**L 越大，能切出的段数越少**。这个单调性让答案可以"猜"出来，这就是**二分答案**：

\`\`\`text
check(L) = Σ 每根木头 ⌊长度/L⌋    // 能切出的总段数，余料舍弃
在 [1, maxLen] 上二分：
  check(L) ≥ k → L 可行，试试更大的
  check(L) < k → L 太大，缩小
\`\`\`

"最小值最大化"类问题的通用套路：**二分答案 + 贪心验证**。验证一次 O(n)，二分 O(log maxLen)，总 O(n log maxLen) —— 比逐个试 L = 1, 2, 3, … 快得多。

> ⚠️ 两个坑：① 别忘了"不可能"的出口 —— 若连 L = 1 都凑不够 k 段，输出 0；② 验证时是**整数除法**（余料舍弃），且每根木头独立切，余料不能拼给别的木头。`,
    task: `## 任务：木头切割

n 根木头要切出**至少 k 段**等长的段，段长必须是正整数；每根木头独立切割，**余料舍弃**（不能拼接）。求满足条件的最大段长；若连段长 1 都切不出 k 段，输出 0。

**输入**：
- 第 1 行：n 和 k（1 ≤ n ≤ 10⁵，1 ≤ k ≤ 10⁹）
- 第 2 行：n 根木头的长度（1 ≤ 长度 ≤ 10⁹）

**输出**：一行，最大段长（或 0）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 7\`<br>\`5 9 7\` | \`2\`（L=2：2+4+3=9 段 ≥ 7；L=3：1+3+2=6 段 < 7） |
| \`1 1\`<br>\`10\` | \`10\` |

提示：对候选段长 L，能切出的总段数随 L 增大而减小 —— 单调性正是二分答案的入场券。`,
    starter: `const [n, k] = readInts();
const w = readInts();

// TODO 1: 写验证函数 check(L)：对每根木头累加 Math.floor(x / L)，返回总段数
// TODO 2: 在 [1, max(w)] 上二分 L：check(L) >= k 则 ans = L 并 lo = mid + 1，否则 hi = mid - 1
// TODO 3: 输出 ans（切不出时保持 0）

console.log(0); // 占位
`,
    solution: `const [n, k] = readInts();
const w = readInts();
function check(len) {
  let s = 0;
  for (const x of w) s += Math.floor(x / len);
  return s;
}
let lo = 1;
let hi = w.reduce((a, b) => Math.max(a, b), 0);
let ans = 0;
while (lo <= hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (check(mid) >= k) { ans = mid; lo = mid + 1; }
  else hi = mid - 1;
}
console.log(ans);
`,
    hints: [
      '先写验证：`check(L)` = 对每根木头累加 `Math.floor(x / L)`。段数随 L 增大而单调不增 —— 这就是能二分的理由。',
      '二分骨架：`lo = 1, hi = max(w), ans = 0`；`check(mid) >= k` 说明 mid 可行，记下并尝试更大（`lo = mid + 1`）；否则 `hi = mid - 1`。',
      '切不出 k 段时 ans 保持初始 0。Go/Rust/C++ 全程 64 位整数：k 可达 10⁹，段数总和可达 10¹⁴。',
    ],
    tests: [
      { name: '样例：3 根切 7 段', stdin: '3 7\n5 9 7\n', expected: '2' },
      { name: '样例：单根切 1 段', stdin: '1 1\n10\n', expected: '10' },
      { name: '隐藏：大数边界', stdin: '4 10\n1000000000 1000000000 1000000000 1000000000\n', expected: '333333333', hidden: true },
      { name: '隐藏：不可能', stdin: '2 5\n1 1\n', expected: '0', hidden: true },
      { name: '隐藏：5 根切 11 段', stdin: '5 11\n10 10 10 10 10\n', expected: '3', hidden: true },
      { name: '隐藏：长木头短需求', stdin: '3 100\n50 60 70\n', expected: '1', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const [n, k] = readInts();
const w = readInts();

// TODO 1: 写验证函数 check(L)：对每根木头累加 Math.floor(x / L)，返回总段数
// TODO 2: 在 [1, max(w)] 上二分 L：check(L) >= k 则 ans = L 并 lo = mid + 1，否则 hi = mid - 1
// TODO 3: 输出 ans（切不出时保持 0）

console.log(0); // 占位
`,
        go: `package main

import "fmt"

func main() {
	var n, k int64
	fmt.Scan(&n, &k)
	w := make([]int64, n)
	for i := int64(0); i < n; i++ {
		fmt.Scan(&w[i])
	}
	// TODO 1: 验证函数：总段数 = Σ w[i] / L（整数除法，余料舍弃）
	// TODO 2: 在 [1, 最长木头] 上二分 L：段数 >= k 则 ans = L，lo = mid + 1；否则 hi = mid - 1
	ans := int64(0)
	fmt.Println(ans) // 占位
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut it = line.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let k: i64 = it.next().unwrap().parse().unwrap();

    let mut line2 = String::new();
    stdin().read_line(&mut line2).unwrap();
    let w: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: 验证闭包：总段数 = w.iter().map(|&x| x / len).sum()
    // TODO 2: 在 [1, max] 上二分：段数 >= k 则 ans = mid，lo = mid + 1；否则 hi = mid - 1
    let mut ans = 0i64;
    println!("{}", ans); // 占位
}
`,
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    long long n, k;
    cin >> n >> k;
    vector<long long> w(n);
    for (int i = 0; i < n; i++) cin >> w[i];

    // TODO 1: 验证函数：总段数 = Σ w[i] / len（整数除法，余料舍弃）
    // TODO 2: 在 [1, 最长木头] 上二分：段数 >= k 则 ans = mid，lo = mid + 1；否则 hi = mid - 1
    long long ans = 0;
    cout << ans << "\\n"; // 占位
    return 0;
}
`,
      },
      solutions: {
        javascript: `const [n, k] = readInts();
const w = readInts();
function check(len) {
  let s = 0;
  for (const x of w) s += Math.floor(x / len);
  return s;
}
let lo = 1;
let hi = w.reduce((a, b) => Math.max(a, b), 0);
let ans = 0;
while (lo <= hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (check(mid) >= k) { ans = mid; lo = mid + 1; }
  else hi = mid - 1;
}
console.log(ans);
`,
        go: `package main

import "fmt"

func main() {
	var n, k int64
	fmt.Scan(&n, &k)
	w := make([]int64, n)
	mx := int64(0)
	for i := int64(0); i < n; i++ {
		fmt.Scan(&w[i])
		if w[i] > mx {
			mx = w[i]
		}
	}
	count := func(length int64) int64 {
		var s int64
		for _, x := range w {
			s += x / length
		}
		return s
	}
	lo, hi := int64(1), mx
	ans := int64(0)
	for lo <= hi {
		mid := lo + (hi-lo)/2
		if count(mid) >= k {
			ans = mid
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	fmt.Println(ans)
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut it = line.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let k: i64 = it.next().unwrap().parse().unwrap();

    let mut line2 = String::new();
    stdin().read_line(&mut line2).unwrap();
    let w: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let count = |length: i64| -> i64 { w.iter().map(|&x| x / length).sum() };
    let mx = *w.iter().max().unwrap();
    let (mut lo, mut hi) = (1i64, mx);
    let mut ans = 0i64;
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        if count(mid) >= k {
            ans = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    println!("{}", ans);
}
`,
        cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    long long n, k;
    cin >> n >> k;
    vector<long long> w(n);
    for (int i = 0; i < n; i++) cin >> w[i];
    long long mx = *max_element(w.begin(), w.end());

    auto count = [&](long long len) {
        long long s = 0;
        for (long long x : w) s += x / len;
        return s;
    };

    long long lo = 1, hi = mx, ans = 0;
    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2;
        if (count(mid) >= k) { ans = mid; lo = mid + 1; }
        else hi = mid - 1;
    }
    cout << ans << "\\n";
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-paradigm-9',
    lang: 'algo',
    module: 'paradigm',
    order: 9,
    title: '冒泡排序与交换次数',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握冒泡排序的相邻交换实现',
      '理解交换次数 = 逆序对数',
      '理解严格比较与稳定性对计数的影响',
    ],
    brief: `## 冒泡：相邻交换的累计

冒泡排序：从左到右两两比较相邻元素，逆序就交换 —— 每一轮都把当前未排序部分的**最大值"冒泡"到末尾**：

\`\`\`text
for i in 0..n-2:
  for j in 0..n-2-i:        // 末尾 i 个已就位，不用再比
    若 a[j] > a[j+1] → 交换
\`\`\`

**交换次数**是本关真正的主角：一次交换恰好消除一个"逆序对"（前大后小的数对），所以总交换次数 = 数组的**逆序对数**。正序数组 0 次，倒序数组 n(n-1)/2 次拉满。逆序数衡量一个序列"有多乱"，以后还能用归并排序 O(n log n) 地数出来。

先看上方动画，注意比较与交换的范围如何随轮次缩短。

> ⚠️ 比较必须用**严格大于**：相等的元素不交换（稳定排序），否则交换次数会算错 —— 试试 [4,4,1]，答案应是 2 不是 3。`,
    task: `## 任务：冒泡并数一数交换

读入一行整数，用**冒泡排序**升序排列，输出排序结果和**交换总次数**。

**输入**：一行 1~2000 个整数，空格分隔（绝对值 ≤ 10⁹）

**输出**：
- 第 1 行：升序排列的整数（单个空格分隔）
- 第 2 行：冒泡排序过程中的交换次数

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5 2 9 1 7\` | \`1 2 5 7 9\`<br>\`5\` |
| \`1 2 3\` | \`1 2 3\`<br>\`0\` |

要求手写冒泡（不许调用语言内置 sort）。相等的元素**不交换**，交换次数才能与逆序对数一致。`,
    starter: `const a = readInts();
const b = [...a];
let swaps = 0;

// TODO 1: 双重循环冒泡：外层 i 0..n-2，内层 j 0..n-2-i
// TODO 2: b[j] > b[j+1]（严格大于）就交换并 swaps++
// TODO 3: 第 1 行输出 b.join(' ')，第 2 行输出 swaps

console.log(b.join(' ')); // 占位
`,
    solution: `const a = readInts();
const b = [...a];
let swaps = 0;
for (let i = 0; i < b.length - 1; i++) {
  for (let j = 0; j < b.length - 1 - i; j++) {
    if (b[j] > b[j + 1]) {
      [b[j], b[j + 1]] = [b[j + 1], b[j]];
      swaps++;
    }
  }
}
console.log(b.join(' '));
console.log(swaps);
`,
    hints: [
      '冒泡骨架：`for (let i = 0; i < n - 1; i++)` 外层控制轮数，内层 `for (let j = 0; j < n - 1 - i; j++)` 相邻比较，末尾 i 个每轮就位。',
      '交换条件必须**严格大于** `b[j] > b[j+1]`：相等不换，否则交换次数会多算（[4,4,1] 应为 2 次）。',
      'JS 交换 `[b[j], b[j+1]] = [b[j+1], b[j]]`，Go 元组 `a[j], a[j+1] = a[j+1], a[j]`，Rust `a.swap(j, j+1)`，C++ `swap(a[j], a[j+1])`。先输出排序行，再输出 swaps 行。',
    ],
    tests: [
      { name: '样例：5 个数', stdin: '5 2 9 1 7\n', expected: '1 2 5 7 9\n5' },
      { name: '样例：已有序', stdin: '1 2 3\n', expected: '1 2 3\n0' },
      { name: '隐藏：倒序 3 个', stdin: '3 2 1\n', expected: '1 2 3\n3', hidden: true },
      { name: '隐藏：相等元素', stdin: '4 4 1\n', expected: '1 4 4\n2', hidden: true },
      { name: '隐藏：单元素', stdin: '8\n', expected: '8\n0', hidden: true },
      { name: '隐藏：倒序 6 个', stdin: '6 5 4 3 2 1\n', expected: '1 2 3 4 5 6\n15', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const a = readInts();
const b = [...a];
let swaps = 0;

// TODO 1: 双重循环冒泡：外层 i 0..n-2，内层 j 0..n-2-i
// TODO 2: b[j] > b[j+1]（严格大于）就交换并 swaps++
// TODO 3: 第 1 行输出 b.join(' ')，第 2 行输出 swaps

console.log(b.join(' ')); // 占位
`,
        go: `package main

import "fmt"

func main() {
	var x int64
	var a []int64
	for {
		_, err := fmt.Scan(&x)
		if err != nil {
			break
		}
		a = append(a, x)
	}
	swaps := int64(0)
	// TODO 1: 双重循环冒泡：a[j] > a[j+1] 就交换（Go 元组交换 a[j], a[j+1] = a[j+1], a[j]）
	// TODO 2: 排序结果空格分隔一行，随后一行输出 swaps
	for _, v := range a {
		fmt.Print(v, " ") // 占位：格式需要修正
	}
	fmt.Println(swaps)
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut a: Vec<i64> = line.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let mut swaps: i64 = 0;

    // TODO 1: 双重循环冒泡：for i in 0..a.len().saturating_sub(1)，内层 j 范围随 i 缩短
    // TODO 2: a[j] > a[j + 1] 就 a.swap(j, j + 1) 并 swaps += 1
    // TODO 3: 第 1 行 join(" ") 输出排序结果，第 2 行输出 swaps
    println!("{}", swaps); // 占位
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);

    long long swaps = 0;
    // TODO 1: 双重循环冒泡：外层 i < n-1，内层 j < n-1-i
    // TODO 2: a[j] > a[j+1]（严格大于）就 swap 并 swaps++
    // TODO 3: 第 1 行空格分隔输出排序结果，第 2 行输出 swaps
    cout << swaps << "\\n"; // 占位
    return 0;
}
`,
      },
      solutions: {
        javascript: `const a = readInts();
const b = [...a];
let swaps = 0;
for (let i = 0; i < b.length - 1; i++) {
  for (let j = 0; j < b.length - 1 - i; j++) {
    if (b[j] > b[j + 1]) {
      [b[j], b[j + 1]] = [b[j + 1], b[j]];
      swaps++;
    }
  }
}
console.log(b.join(' '));
console.log(swaps);
`,
        go: `package main

import "fmt"

func main() {
	var x int64
	var a []int64
	for {
		_, err := fmt.Scan(&x)
		if err != nil {
			break
		}
		a = append(a, x)
	}
	swaps := int64(0)
	for i := 0; i < len(a)-1; i++ {
		for j := 0; j < len(a)-1-i; j++ {
			if a[j] > a[j+1] {
				a[j], a[j+1] = a[j+1], a[j]
				swaps++
			}
		}
	}
	for i, v := range a {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(v)
	}
	fmt.Println()
	fmt.Println(swaps)
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut a: Vec<i64> = line.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let mut swaps: i64 = 0;
    for i in 0..a.len().saturating_sub(1) {
        for j in 0..a.len() - 1 - i {
            if a[j] > a[j + 1] {
                a.swap(j, j + 1);
                swaps += 1;
            }
        }
    }
    let strs: Vec<String> = a.iter().map(|x| x.to_string()).collect();
    println!("{}", strs.join(" "));
    println!("{}", swaps);
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);
    long long swaps = 0;
    for (int i = 0; i < (int)a.size() - 1; i++) {
        for (int j = 0; j < (int)a.size() - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                swaps++;
            }
        }
    }
    for (int i = 0; i < (int)a.size(); i++) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << "\\n" << swaps << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'sort', param: 'bubble' },
  },
  {
    id: 'algo-paradigm-10',
    lang: 'algo',
    module: 'paradigm',
    order: 10,
    title: '快速排序实现',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握快速排序的划分（partition）思想',
      '理解基准选取对复杂度的影响',
      '实现原地递归快排并与归并对比取舍',
    ],
    brief: `## 快排：分治里的闪电手

快速排序也是分治，但与归并"先分后合"相反 —— **先治后分**：

1. 选一个**基准** pivot（常用中间元素）
2. **划分**：小于 pivot 的甩到左边，大于的甩到右边（双指针从两头向中间扫、遇逆序就交换）
3. 递归处理左右两段 —— 划分完各就各位，**合并不需要任何操作**

\`\`\`text
partition 之后：[ ≤pivot 的 | pivot 位置确定 | ≥pivot 的 ]
\`\`\`

平均 **O(n log n)** 且是原地排序（只用 O(log n) 栈空间）；最坏 O(n²) 出现在基准总选得极偏时（比如每次拿首元素去排有序数组）—— 取**中间元素**做基准能躲开最常见的退化。对比记忆：归并稳定但费内存，快排原地但不稳定，工程上快排（及其变种）应用更广。

> ⚠️ 划分的双指针别越过边界；递归区间要与划分后的 j / i 位置严格衔接 —— 边界错一位就是死循环或漏排。`,
    task: `## 任务：手写快速排序

读入一行整数，用**快速排序**升序排列后输出。

**输入**：一行 1~5000 个整数，空格分隔（绝对值 ≤ 10⁹）

**输出**：一行，升序排列的整数，单个空格分隔（行尾无空格）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5 2 9 1 7\` | \`1 2 5 7 9\` |
| \`3 3 3 3\` | \`3 3 3 3\` |

要求自己实现划分与递归（不许调用语言内置 sort）。建议取**中间元素**做基准 —— 对已有序的输入也不会退化。`,
    starter: `const a = readInts();

// TODO 1: quickSort(arr, lo, hi)：lo >= hi 返回；pivot 取 arr[(lo + hi) >> 1]
// TODO 2: 双指针划分：左扫找 >= pivot 的，右扫找 <= pivot 的，i <= j 就交换
// TODO 3: 递归 quickSort(arr, lo, j) 与 quickSort(arr, i, hi)，最后 join(' ') 输出

console.log(a.join(' ')); // 占位
`,
    solution: `const a = readInts();
function quickSort(arr, lo, hi) {
  if (lo >= hi) return;
  const pivot = arr[(lo + hi) >> 1];
  let i = lo, j = hi;
  while (i <= j) {
    while (arr[i] < pivot) i++;
    while (arr[j] > pivot) j--;
    if (i <= j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++; j--;
    }
  }
  quickSort(arr, lo, j);
  quickSort(arr, i, hi);
}
quickSort(a, 0, a.length - 1);
console.log(a.join(' '));
`,
    hints: [
      '递归边界 `lo >= hi` 返回。基准取中间：`pivot = arr[(lo + hi) >> 1]`（JS）/ `a[(lo+hi)/2]`（其他语言）。',
      '划分双指针：`while (arr[i] < pivot) i++;`、`while (arr[j] > pivot) j--;`，若 `i <= j` 就交换并 `i++、j--`。循环结束后 j 在左段末尾、i 在右段开头。',
      '递归两段：`quickSort(arr, lo, j)` 和 `quickSort(arr, i, hi)`（注意不是 lo..mid）。Rust 用 isize 存 lo/hi，防止 j = -1 时下标下溢。',
    ],
    tests: [
      { name: '样例：乱序 5 个', stdin: '5 2 9 1 7\n', expected: '1 2 5 7 9' },
      { name: '样例：全相等', stdin: '3 3 3 3\n', expected: '3 3 3 3' },
      { name: '隐藏：两个元素', stdin: '2 1\n', expected: '1 2', hidden: true },
      { name: '隐藏：负数与重复', stdin: '-5 12 0 -5 8\n', expected: '-5 -5 0 8 12', hidden: true },
      { name: '隐藏：倒序输入', stdin: '9 8 7 6 5 4 3 2 1\n', expected: '1 2 3 4 5 6 7 8 9', hidden: true },
      { name: '隐藏：随机 15 个', stdin: '42 -7 19 0 -3 88 5 5 -42 13 7 7 -19 60 1\n', expected: '-42 -19 -7 -3 0 1 5 5 7 7 13 19 42 60 88', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const a = readInts();

// TODO 1: quickSort(arr, lo, hi)：lo >= hi 返回；pivot 取 arr[(lo + hi) >> 1]
// TODO 2: 双指针划分：左扫找 >= pivot 的，右扫找 <= pivot 的，i <= j 就交换
// TODO 3: 递归 quickSort(arr, lo, j) 与 quickSort(arr, i, hi)，最后 join(' ') 输出

console.log(a.join(' ')); // 占位
`,
        go: `package main

import "fmt"

// TODO 1: quickSort(a []int64, lo, hi int)：lo >= hi 返回，pivot = a[(lo+hi)/2]
// TODO 2: 双指针划分：a[i] < pivot 右移 i，a[j] > pivot 左移 j，i <= j 就交换并继续

func main() {
	var x int64
	var a []int64
	for {
		_, err := fmt.Scan(&x)
		if err != nil {
			break
		}
		a = append(a, x)
	}
	// TODO 3: quickSort(a, 0, len(a)-1) 后空格分隔输出（行尾无空格）
	for _, v := range a {
		fmt.Print(v, " ") // 占位：格式需要修正
	}
	fmt.Println()
}
`,
        rust: `use std::io::stdin;

// TODO 1: fn quick_sort(a: &mut Vec<i64>, lo: isize, hi: isize)
// TODO 2: pivot = a[(lo + hi) as usize / 2]；双指针划分，i <= j 就 swap

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut a: Vec<i64> = line.split_whitespace().map(|x| x.parse().unwrap()).collect();
    // TODO 3: 递归排序后 join(" ") 输出
    let strs: Vec<String> = a.iter().map(|x| x.to_string()).collect();
    println!("{}", strs.join(" ")); // 占位：还没排序
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

// TODO 1: quickSort(a, lo, hi)：lo >= hi 返回，pivot = a[(lo + hi) / 2]
// TODO 2: 双指针划分：a[i] < pivot 右移 i，a[j] > pivot 左移 j，i <= j 就交换

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);
    // TODO 3: 递归排序后空格分隔输出
    for (size_t i = 0; i < a.size(); i++) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << "\\n"; // 占位：还没排序
    return 0;
}
`,
      },
      solutions: {
        javascript: `const a = readInts();
function quickSort(arr, lo, hi) {
  if (lo >= hi) return;
  const pivot = arr[(lo + hi) >> 1];
  let i = lo, j = hi;
  while (i <= j) {
    while (arr[i] < pivot) i++;
    while (arr[j] > pivot) j--;
    if (i <= j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++; j--;
    }
  }
  quickSort(arr, lo, j);
  quickSort(arr, i, hi);
}
quickSort(a, 0, a.length - 1);
console.log(a.join(' '));
`,
        go: `package main

import "fmt"

func quickSort(a []int64, lo, hi int) {
	if lo >= hi {
		return
	}
	pivot := a[(lo+hi)/2]
	i, j := lo, hi
	for i <= j {
		for a[i] < pivot {
			i++
		}
		for a[j] > pivot {
			j--
		}
		if i <= j {
			a[i], a[j] = a[j], a[i]
			i++
			j--
		}
	}
	quickSort(a, lo, j)
	quickSort(a, i, hi)
}

func main() {
	var x int64
	var a []int64
	for {
		_, err := fmt.Scan(&x)
		if err != nil {
			break
		}
		a = append(a, x)
	}
	quickSort(a, 0, len(a)-1)
	for i, v := range a {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(v)
	}
	fmt.Println()
}
`,
        rust: `use std::io::stdin;

fn quick_sort(a: &mut Vec<i64>, lo: isize, hi: isize) {
    if lo >= hi {
        return;
    }
    let pivot = a[(lo + hi) as usize / 2];
    let mut i = lo;
    let mut j = hi;
    while i <= j {
        while a[i as usize] < pivot {
            i += 1;
        }
        while a[j as usize] > pivot {
            j -= 1;
        }
        if i <= j {
            a.swap(i as usize, j as usize);
            i += 1;
            j -= 1;
        }
    }
    quick_sort(a, lo, j);
    quick_sort(a, i, hi);
}

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut a: Vec<i64> = line.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let n = a.len() as isize;
    quick_sort(&mut a, 0, n - 1);
    let strs: Vec<String> = a.iter().map(|x| x.to_string()).collect();
    println!("{}", strs.join(" "));
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

void quickSort(vector<long long>& a, int lo, int hi) {
    if (lo >= hi) return;
    long long pivot = a[(lo + hi) / 2];
    int i = lo, j = hi;
    while (i <= j) {
        while (a[i] < pivot) i++;
        while (a[j] > pivot) j--;
        if (i <= j) {
            swap(a[i], a[j]);
            i++; j--;
        }
    }
    quickSort(a, lo, j);
    quickSort(a, i, hi);
}

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);
    quickSort(a, 0, (int)a.size() - 1);
    for (int i = 0; i < (int)a.size(); i++) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'sort', param: 'quick' },
  },
];

