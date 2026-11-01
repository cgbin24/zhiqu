import type { Level } from '@/types';

/** 算法课 · 第四章：开发实用技巧 —— IO/溢出/去重/双指针/前缀和/调试（6 关） */
export const ALGO_TIPS: Level[] = [
  {
    id: 'algo-tips-1',
    lang: 'algo',
    module: 'tips',
    order: 1,
    title: 'IO 惯例与快读',
    difficulty: 1,
    xp: 15,
    goals: [
      '掌握各语言标准 stdin 读入写法与 JS 注入的 readline/readInts',
      '了解大数据量下的快读手段（bufio/关同步/一次读入）',
      '能正确处理逐行输出与负数运算',
    ],
    brief: `## 输入输出：算法题的「起手式」

评测里 IO 是第一道坎，各语言习惯不同：

- **JS**：本平台已注入 \`readline()\`（读一行）与 \`readInts()\`（读一行并拆成数字数组），配 \`console.log\` 输出；
- **Go**：\`fmt.Scan(&x)\` 按空白分隔连续读取，最省事；大数据量换 \`bufio.Scanner\` 快一个量级；
- **Rust**：\`read_line\` 读一行配 \`split_whitespace\` 拆整数；一次性 \`read_to_string\` 再拆最快；
- **C++**：\`cin >> x\` 简单直接，开头加 \`ios::sync_with_stdio(false)\` 可显著提速。

读入速度大致是：C++（关同步）≈ Go（bufio）≈ Rust（一次读入）> 逐行裸读。本题数据量小怎么写都对，但**从现在起养成快读习惯**，以后面对 10⁶ 级输入才不吃亏。

> ⚠️ 易错点：① JS 的 \`readInts()\` 一次只读**一行**，两行数据要调两次；② 负数平方别用 \`^\`（那是异或不是乘方）；③ 要求每行一个输出时，别把结果拼在一行。`,
    task: `## 任务：平方输出器

第一行读入 n，第二行读入 n 个整数，逐个输出它们的平方 —— 每个一行。

**输入**：两行 —— 第一行 n（1 ≤ n ≤ 100）；第二行 n 个整数（绝对值 ≤ 10⁴）

**输出**：n 行，每行一个整数的平方

### 示例

| 输入 | 输出 |
| --- | --- |
| 第一行 \`3\`<br>第二行 \`2 5 10\` | \`4\`<br>\`25\`<br>\`100\` |
| 第一行 \`1\`<br>第二行 \`-7\` | \`49\` |`,
    starter: `const n = Number(readline());
const a = readInts();

// TODO 1: 循环 n 次
// TODO 2: 每次输出 a[i] 的平方（每行一个）
for (let i = 0; i < n; i++) {
  console.log(a[i]); // 占位：当前输出原数，替换为它的平方
}
`,
    solution: `const n = Number(readline());
const a = readInts();
for (let i = 0; i < n; i++) {
  console.log(a[i] * a[i]);
}
`,
    hints: [
      'JS 平台已注入 readline()/readInts()：readInts() 一次读一行整数数组；Go 用 fmt.Scan(&x) 循环读，C++ 用 cin >> x，Rust 一次 read_to_string 再 split_whitespace。',
      '循环 n 次，每次读一个数 x，立刻输出它的平方——每行一个（console.log / fmt.Println / println! / cout 加换行）。',
      '负数的平方是正数，别用位运算符 ^（那是异或）。数据量再大时记得换快读：Go bufio.Scanner、C++ 关同步、Rust 一次读入。',
    ],
    tests: [
      { name: '样例：三个数', stdin: '3\n2 5 10\n', expected: '4\n25\n100' },
      { name: '样例：负数', stdin: '1\n-7\n', expected: '49' },
      { name: '隐藏：含零', stdin: '4\n0 1 2 3\n', expected: '0\n1\n4\n9', hidden: true },
      { name: '隐藏：大数', stdin: '5\n10000 999 0 -1 12345\n', expected: '100000000\n998001\n0\n1\n152399025', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const n = Number(readline());
const a = readInts();

// TODO 1: 循环 n 次
// TODO 2: 每次输出 a[i] 的平方（每行一个）
for (let i = 0; i < n; i++) {
  console.log(a[i]); // 占位：当前输出原数，替换为它的平方
}
`,
        go: `package main

import "fmt"

func main() {
	var n int64
	fmt.Scan(&n)

	// TODO 1: 循环 n 次，每次 fmt.Scan 读一个整数 x
	// TODO 2: 输出 x*x（每行一个）
	for i := int64(0); i < n; i++ {
		var x int64
		fmt.Scan(&x)
		fmt.Println(x) // 占位：当前输出原数，替换为它的平方
	}
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace().map(|x| x.parse::<i64>().unwrap());
    let n = it.next().unwrap();

    // TODO 1: 循环 n 次，每次 it.next() 取一个整数 x
    // TODO 2: 输出 x*x（每行一个）
    for _ in 0..n {
        let x = it.next().unwrap();
        println!("{}", x); // 占位：当前输出原数，替换为它的平方
    }
}
`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;

    // TODO 1: 循环 n 次，每次 cin 读一个整数 x
    // TODO 2: 输出 x*x（每行一个）
    for (long long i = 0; i < n; i++) {
        long long x;
        cin >> x;
        cout << x << "\\n"; // 占位：当前输出原数，替换为它的平方
    }
    return 0;
}
`,
      },
      solutions: {
        javascript: `const n = Number(readline());
const a = readInts();
for (let i = 0; i < n; i++) {
  console.log(a[i] * a[i]);
}
`,
        go: `package main

import "fmt"

func main() {
	var n int64
	fmt.Scan(&n)
	for i := int64(0); i < n; i++ {
		var x int64
		fmt.Scan(&x)
		fmt.Println(x * x)
	}
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace().map(|x| x.parse::<i64>().unwrap());
    let n = it.next().unwrap();
    for _ in 0..n {
        let x = it.next().unwrap();
        println!("{}", x * x);
    }
}
`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    for (long long i = 0; i < n; i++) {
        long long x;
        cin >> x;
        cout << x * x << "\\n";
    }
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-tips-2',
    lang: 'algo',
    module: 'tips',
    order: 2,
    title: '溢出与边界',
    difficulty: 2,
    xp: 25,
    goals: [
      '理解 32/64 位整数的表示范围与溢出风险',
      '掌握 Legendre 公式 O(log n) 求 n! 末尾 0 的个数',
      '养成「看数据范围反推算法」的习惯',
    ],
    brief: `## 溢出：算得对不如算得巧

求 n! 末尾 0 的个数，暴力做法是把 n! 算出来再数 —— 但 n = 21 时 21! ≈ 5.1×10¹⁹ 已爆掉 64 位整数（上限约 9.2×10¹⁸），而本题 n ≤ 10⁹，**直接算必死无疑**。

换个角度：末尾的 0 来自因子 **10 = 2×5**，而 2 的个数远多于 5，所以 0 的个数 = n! 里因子 5 的个数。用 **Legendre 公式**直接数：

\`\`\`text
个数 = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + …   （直到 5^k > n）
n=25   → 5 + 1 = 6          （25 贡献了两个 5）
n=1000 → 200+40+8+1 = 249
\`\`\`

复杂度从"天文数字"降到 O(log₅n)，n = 10⁹ 也只需十几步。**看数据范围反推算法**是竞赛第一直觉：见到 10⁹ 就该意识到"模拟不可能，必有公式或数学性质"。

> ⚠️ 易错点：① 循环变量 \`p *= 5\` 在 C++/Go/Rust 里要用 64 位，否则 5¹³ 就溢出；② n < 5 时答案为 0，循环天然不执行；③ 别用浮点数算 floor，精度会骗人。`,
    task: `## 任务：n! 末尾有多少个 0

读入 n（0 ≤ n ≤ 10⁹），输出 n! 末尾连续 0 的个数。**不要**真的去算 n! —— 21! 就已超出 64 位整数范围，必须用 Legendre 公式：

> 末尾 0 的个数 = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + …（直到 5^k > n）

**输入**：一行一个整数 n

**输出**：一行一个整数 —— n! 末尾 0 的个数

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`10\` | \`2\` | 10! = 3628800 |
| \`25\` | \`6\` | 25 = 5²，多贡献一个 5 |
| \`4\` | \`0\` | 4! = 24，没有 0 |`,
    starter: `const n = Number(readline());

// TODO 1: 明确思路：末尾 0 的个数 = n! 中因子 5 的个数（因子 2 远多于 5）
// TODO 2: 循环：p 从 5 开始每次 p *= 5，只要 p <= n 就累加 Math.floor(n / p)
// TODO 3: 输出累加和（n 最大 1e9，JS 的 Number 精度足够）
console.log(0); // 占位，替换为你的计算结果
`,
    solution: `const n = Number(readline());
let ans = 0;
for (let p = 5; p <= n; p *= 5) {
  ans += Math.floor(n / p);
}
console.log(ans);
`,
    hints: [
      '别真的算阶乘！21! 就已超出 64 位整数上限。末尾 0 = 因子 10 的个数 = min(因子2个数, 因子5个数) = 因子5的个数。',
      'Legendre 公式：ans = n/5 + n/25 + n/125 + …（整数除法向下取整），循环变量 p 从 5 开始每次 p *= 5，直到 p > n。n=10⁹ 时循环只跑十几轮。',
      'C++/Go/Rust 的 p 和 ans 都用 64 位（long long / int64 / i64），否则 p 乘到 5¹³ 附近会溢出；n < 5 时循环不执行，ans=0 天然正确。',
    ],
    tests: [
      { name: '样例：10', stdin: '10\n', expected: '2' },
      { name: '样例：25', stdin: '25\n', expected: '6' },
      { name: '隐藏：4 无零', stdin: '4\n', expected: '0', hidden: true },
      { name: '隐藏：100', stdin: '100\n', expected: '24', hidden: true },
      { name: '隐藏：上限 1e9', stdin: '1000000000\n', expected: '249999998', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const n = Number(readline());

// TODO 1: 明确思路：末尾 0 的个数 = n! 中因子 5 的个数（因子 2 远多于 5）
// TODO 2: 循环：p 从 5 开始每次 p *= 5，只要 p <= n 就累加 Math.floor(n / p)
// TODO 3: 输出累加和（n 最大 1e9，JS 的 Number 精度足够）
console.log(0); // 占位，替换为你的计算结果
`,
        go: `package main

import "fmt"

func main() {
	var n int64
	fmt.Scan(&n)

	// TODO 1: ans 与循环变量 p 都用 int64（p 会乘到约 5e9，32 位会溢出）
	// TODO 2: for p := int64(5); p <= n; p *= 5 { ans += n / p }
	// TODO 3: 输出 ans
	fmt.Println(n) // 占位，替换为你的计算结果
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let n: i64 = input.split_whitespace().next().unwrap().parse().unwrap();

    // TODO 1: ans 与循环变量 p 都用 i64
    // TODO 2: for p in (5i64..).take_while(|p| *p <= n) { ans += n / p }（或 while 循环 p *= 5）
    // TODO 3: 输出 ans
    println!("{}", n); // 占位，替换为你的计算结果
}
`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;

    // TODO 1: ans 与循环变量 p 都用 long long
    // TODO 2: for (long long p = 5; p <= n; p *= 5) ans += n / p;
    // TODO 3: 输出 ans
    cout << n << "\\n"; // 占位，替换为你的计算结果
    return 0;
}
`,
      },
      solutions: {
        javascript: `const n = Number(readline());
let ans = 0;
for (let p = 5; p <= n; p *= 5) {
  ans += Math.floor(n / p);
}
console.log(ans);
`,
        go: `package main

import "fmt"

func main() {
	var n int64
	fmt.Scan(&n)
	ans := int64(0)
	for p := int64(5); p <= n; p *= 5 {
		ans += n / p
	}
	fmt.Println(ans)
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let n: i64 = input.split_whitespace().next().unwrap().parse().unwrap();
    let mut ans = 0i64;
    let mut p = 5i64;
    while p <= n {
        ans += n / p;
        p *= 5;
    }
    println!("{}", ans);
}
`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    long long ans = 0;
    for (long long p = 5; p <= n; p *= 5) {
        ans += n / p;
    }
    cout << ans << "\\n";
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-tips-3',
    lang: 'algo',
    module: 'tips',
    order: 3,
    title: '去重与排序组合技',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握排序后相邻比较去重的通用套路',
      '会用各语言现成工具（Set/dedup/unique）',
      '记住 JS sort 需要数值比较函数的坑',
    ],
    brief: `## 排序 + 去重：数据预处理组合拳

"去重后升序输出"是数据处理的高频操作，两步走：**先排序，再去重**（顺序不能反）。有序之后相同的数必然相邻，一趟扫描就能去掉重复：

\`\`\`text
5 3 5 1 3 9  →  排序 1 3 3 5 5 9  →  相邻比较留第一个  →  1 3 5 9
\`\`\`

各语言的现成武器：JS 用 \`Set\` 去重 + \`sort((a,b)=>a-b)\`；Rust \`sort()\` + \`dedup()\`（dedup 的前提就是"已排序，重复相邻"）；C++ \`sort\` + \`unique\` + \`erase\`（unique 只是把重复值挪到尾部并返回边界，要手动 erase 才真正删掉）；Go 排序后手动跳过相邻重复。

整体复杂度 O(n log n)，瓶颈在排序。

> ⚠️ 易错点：① JS 的 \`sort()\` 默认按**字符串**比较，\`[10, 2]\` 会排成 \`10 < 2\` —— 必须传比较函数 \`(a, b) => a - b\`；② C++ \`unique\` 不缩小容器，忘了 erase 会输出一串尾巴；③ 输出单空格分隔，结尾别多空格。`,
    task: `## 任务：去重 + 升序输出

读入一行整数，去掉重复的值（每个值只保留一个），按升序输出。

**输入**：一行 1~1000 个整数（绝对值 ≤ 10⁹，空格分隔）

**输出**：一行，去重后的升序序列，单空格分隔

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5 3 5 1 3 9\` | \`1 3 5 9\` |
| \`2 2 2\` | \`2\` |
| \`-1 4 -1 0 4 4\` | \`-1 0 4\` |`,
    starter: `const a = readInts();

// TODO 1: 先排序（注意传数值比较函数 (x, y) => x - y）
// TODO 2: 再去重：相邻比较，只保留每段重复值的第一个
// TODO 3: 单空格分隔输出
console.log(a.join(' ')); // 占位，替换为你的输出
`,
    solution: `const a = readInts();
a.sort((x, y) => x - y); // 注意传数值比较函数，否则按字符串比较
const out = [];
for (let i = 0; i < a.length; i++) {
  if (i === 0 || a[i] !== a[i - 1]) out.push(a[i]); // 有序后重复必相邻，保留每段第一个
}
console.log(out.join(' '));
`,
    hints: [
      '思路两步走：先整队排序，再一趟扫描去重——有序后相同的数必然相邻，只保留相邻比较中的第一个即可。',
      '各语言现成工具：JS `[...new Set(a)].sort((x, y) => x - y)`；Rust `sort()` + `dedup()`；C++ `sort` + `unique` 后记得 `erase`；Go 排序后手动跳过相邻重复。',
      'JS 千万注意 `sort()` 默认按字符串比较（10 会排在 2 前面），必须传 `(a, b) => a - b`；输出单空格分隔，结尾别带多余空格。',
    ],
    tests: [
      { name: '样例：混合数列', stdin: '5 3 5 1 3 9\n', expected: '1 3 5 9' },
      { name: '样例：全相同', stdin: '2 2 2\n', expected: '2' },
      { name: '隐藏：负数去重', stdin: '-1 4 -1 0 4 4\n', expected: '-1 0 4', hidden: true },
      { name: '隐藏：倒序输入', stdin: '10 9 8 7 6 5 4 3 2 1 1\n', expected: '1 2 3 4 5 6 7 8 9 10', hidden: true },
      { name: '隐藏：单个数', stdin: '7\n', expected: '7', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const a = readInts();

// TODO 1: 先排序（注意传数值比较函数 (x, y) => x - y）
// TODO 2: 再去重：相邻比较，只保留每段重复值的第一个
// TODO 3: 单空格分隔输出
console.log(a.join(' ')); // 占位，替换为你的输出
`,
        go: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func main() {
	// TODO 1: 循环 fmt.Scan 读到 EOF 收集所有整数
	// TODO 2: 排序（可引入 sort 包，或自己写）
	// TODO 3: 相邻比较跳过重复值，strconv.Itoa 收集后 strings.Join(" ") 输出
	_ = strconv.Itoa
	_ = strings.Join
	fmt.Println("") // 占位，替换为你的输出
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut a: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: a.sort() 升序排序
    // TODO 2: a.dedup() 去除相邻重复（前提是已排序）
    // TODO 3: join(" ") 输出
    a.sort_by(|x, y| y.cmp(x)); // 占位：当前是降序，替换为 sort + dedup
    let out: Vec<String> = a.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}
`,
        cpp: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);

    // TODO 1: sort 升序排序
    // TODO 2: unique 把重复值挪到尾部并返回新结尾，再用 erase 真正删掉
    // TODO 3: 单空格分隔输出
    for (size_t i = 0; i < a.size(); i++) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << "\\n"; // 占位：当前输出原顺序，替换为去重升序结果
    return 0;
}
`,
      },
      solutions: {
        javascript: `const a = readInts();
a.sort((x, y) => x - y); // 注意传数值比较函数，否则按字符串比较
const out = [];
for (let i = 0; i < a.length; i++) {
  if (i === 0 || a[i] !== a[i - 1]) out.push(a[i]); // 有序后重复必相邻，保留每段第一个
}
console.log(out.join(' '));
`,
        go: `package main

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
)

func main() {
	var vals []int64
	var x int64
	for {
		_, err := fmt.Scan(&x)
		if err != nil {
			break
		}
		vals = append(vals, x)
	}
	sort.Slice(vals, func(i, j int) bool { return vals[i] < vals[j] })
	out := make([]string, 0, len(vals))
	for i, v := range vals {
		if i == 0 || v != vals[i-1] {
			out = append(out, strconv.FormatInt(v, 10))
		}
	}
	fmt.Println(strings.Join(out, " "))
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut a: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    a.sort();
    a.dedup();
    let out: Vec<String> = a.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}
`,
        cpp: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);
    sort(a.begin(), a.end());
    a.erase(unique(a.begin(), a.end()), a.end());
    for (size_t i = 0; i < a.size(); i++) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << "\\n";
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-tips-4',
    lang: 'algo',
    module: 'tips',
    order: 4,
    title: '双序列双指针：合并有序数组',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握双指针归并两个有序序列的 O(n+m) 写法',
      '理解「利用已有有序性避免重复排序」',
      '注意循环结束后的剩余尾巴补齐与空数组边界',
    ],
    brief: `## 双序列双指针：合并两摞排好队的牌

两摞已排序的牌合成一摞，谁小拿谁 —— 这就是归并排序的 "merge" 步骤，也是**双指针**最直观的应用：

\`\`\`text
a: 1 3 5      i 指向 a 的当前牌
b: 2 4 6      j 指向 b 的当前牌
每轮比较 a[i] 和 b[j]，小的进结果并后移；一摞拿完后另一摞整体搬过去
\`\`\`

因为两输入都有序，每个元素只需被比较一次，合并只要 **O(n+m)**；若先拼接再排序则是 O((n+m)log(n+m))，白白浪费了"已有序"这个信息。**有序性是宝贵资产，能省一次排序就省** —— 这也是外排序、LeetCode 合并 K 条链表共用的思想。

相等时取哪边？取 a（\`<=\`）能保证稳定性（相同值保持 a 在前的相对次序）；本题只要求值有序，取哪边结果都一样。

> ⚠️ 易错点：① 两个数组各占**一行**，读入别混；② 主循环结束后还有"剩余尾巴"要补齐，漏掉就丢数据；③ m=0 或 n=0 的边界要能自然通过。`,
    task: `## 任务：合并有序数组

两个升序数组合并成一个升序数组，要求用**双指针**一次归并完成（不要拼起来重新排序）。

**输入**：三行 —— 第一行 n m（0 ≤ n, m ≤ 1000）；第二行 n 个升序整数；第三行 m 个升序整数（绝对值 ≤ 10⁹）

**输出**：一行，合并后的升序序列，单空格分隔

### 示例

| 输入 | 输出 |
| --- | --- |
| 第一行 \`3 3\`<br>第二行 \`1 3 5\`<br>第三行 \`2 4 6\` | \`1 2 3 4 5 6\` |
| 第一行 \`1 1\`<br>第二行 \`10\`<br>第三行 \`-5\` | \`-5 10\` |`,
    starter: `const [n, m] = readInts();
const a = readInts();
const b = readInts();

// TODO 1: 双指针 i = 0、j = 0 分别指向 a、b 开头
// TODO 2: 每轮比较 a[i] 与 b[j]，小者进入结果并后移；一边耗尽后把另一边余量全部追加
// TODO 3: 单空格分隔输出合并结果
console.log(a.join(' ')); // 占位：当前只输出第一个数组，替换为双指针归并结果
`,
    solution: `const [n, m] = readInts();
const a = readInts();
const b = readInts();
const out = [];
let i = 0, j = 0;
while (i < n && j < m) {
  if (a[i] <= b[j]) out.push(a[i++]);
  else out.push(b[j++]);
}
while (i < n) out.push(a[i++]);
while (j < m) out.push(b[j++]);
console.log(out.join(' '));
`,
    hints: [
      '双指针 i、j 分别指向两个数组的开头；每轮比较 a[i] 与 b[j]，小者进入结果并后移指针。',
      '一边走完后，把另一边的剩余元素整段追加到结果尾部——这一步最容易漏。相等时取 a（用 <=）保持稳定。',
      '注意 m 或 n 可能为 0：此时对应数组直接整体追加，代码要能自然通过。结果用单空格分隔输出。',
    ],
    tests: [
      { name: '样例：交错合并', stdin: '3 3\n1 3 5\n2 4 6\n', expected: '1 2 3 4 5 6' },
      { name: '样例：负数在前', stdin: '1 1\n10\n-5\n', expected: '-5 10' },
      { name: '隐藏：第二个数组为空', stdin: '2 0\n3 7\n\n', expected: '3 7', hidden: true },
      { name: '隐藏：重复值穿插', stdin: '4 4\n1 2 2 3\n2 2 4 5\n', expected: '1 2 2 2 2 3 4 5', hidden: true },
      { name: '隐藏：负数大数组', stdin: '5 4\n-9 -3 0 0 12\n-7 -3 1 6\n', expected: '-9 -7 -3 -3 0 0 1 6 12', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const [n, m] = readInts();
const a = readInts();
const b = readInts();

// TODO 1: 双指针 i = 0、j = 0 分别指向 a、b 开头
// TODO 2: 每轮比较 a[i] 与 b[j]，小者进入结果并后移；一边耗尽后把另一边余量全部追加
// TODO 3: 单空格分隔输出合并结果
console.log(a.join(' ')); // 占位：当前只输出第一个数组，替换为双指针归并结果
`,
        go: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func main() {
	var n, m int
	fmt.Scan(&n, &m)
	a := make([]int64, n)
	for i := range a {
		fmt.Scan(&a[i])
	}
	b := make([]int64, m)
	for i := range b {
		fmt.Scan(&b[i])
	}

	// TODO 1: 双指针 i=0、j=0 分别指向 a、b 开头
	// TODO 2: 每轮比较 a[i] 与 b[j]：小者进入结果并后移；一边耗尽后把另一边余量全部追加
	// TODO 3: strconv.Itoa 收集结果，strings.Join(" ") 输出
	_ = strconv.Itoa
	_ = strings.Join
	fmt.Println("") // 占位，替换为你的输出
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let toks: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let n = toks[0] as usize;
    let m = toks[1] as usize;
    let a = &toks[2..2 + n];
    let b = &toks[2 + n..2 + n + m];

    // TODO 1: 双指针 i=0、j=0 分别指向 a、b 开头
    // TODO 2: 每轮比较 a[i] 与 b[j]：小者进入结果并后移；一边耗尽后把另一边余量全部追加
    // TODO 3: 收集结果 join(" ") 输出
    println!("{}", a.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(" ")); // 占位，替换为你的输出
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    long long n, m;
    cin >> n >> m;
    vector<long long> a(n), b(m);
    for (auto& v : a) cin >> v;
    for (auto& v : b) cin >> v;

    // TODO 1: 双指针 i=0、j=0 分别指向 a、b 开头
    // TODO 2: 每轮比较 a[i] 与 b[j]：小者进入结果并后移；一边耗尽后把另一边余量全部追加
    // TODO 3: 单空格分隔输出合并结果
    for (size_t i = 0; i < a.size(); i++) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << "\\n"; // 占位：当前只输出第一个数组，替换为双指针归并结果
    return 0;
}
`,
      },
      solutions: {
        javascript: `const [n, m] = readInts();
const a = readInts();
const b = readInts();
const out = [];
let i = 0, j = 0;
while (i < n && j < m) {
  if (a[i] <= b[j]) out.push(a[i++]);
  else out.push(b[j++]);
}
while (i < n) out.push(a[i++]);
while (j < m) out.push(b[j++]);
console.log(out.join(' '));
`,
        go: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func main() {
	var n, m int
	fmt.Scan(&n, &m)
	a := make([]int64, n)
	for i := range a {
		fmt.Scan(&a[i])
	}
	b := make([]int64, m)
	for i := range b {
		fmt.Scan(&b[i])
	}
	out := make([]string, 0, n+m)
	i, j := 0, 0
	for i < n && j < m {
		if a[i] <= b[j] {
			out = append(out, strconv.FormatInt(a[i], 10))
			i++
		} else {
			out = append(out, strconv.FormatInt(b[j], 10))
			j++
		}
	}
	for ; i < n; i++ {
		out = append(out, strconv.FormatInt(a[i], 10))
	}
	for ; j < m; j++ {
		out = append(out, strconv.FormatInt(b[j], 10))
	}
	fmt.Println(strings.Join(out, " "))
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let toks: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let n = toks[0] as usize;
    let m = toks[1] as usize;
    let a = &toks[2..2 + n];
    let b = &toks[2 + n..2 + n + m];
    let mut out: Vec<String> = Vec::new();
    let (mut i, mut j) = (0usize, 0usize);
    while i < n && j < m {
        if a[i] <= b[j] {
            out.push(a[i].to_string());
            i += 1;
        } else {
            out.push(b[j].to_string());
            j += 1;
        }
    }
    while i < n {
        out.push(a[i].to_string());
        i += 1;
    }
    while j < m {
        out.push(b[j].to_string());
        j += 1;
    }
    println!("{}", out.join(" "));
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    long long n, m;
    cin >> n >> m;
    vector<long long> a(n), b(m), out;
    out.reserve(n + m);
    for (auto& v : a) cin >> v;
    for (auto& v : b) cin >> v;
    size_t i = 0, j = 0;
    while (i < a.size() && j < b.size()) {
        if (a[i] <= b[j]) out.push_back(a[i++]);
        else out.push_back(b[j++]);
    }
    while (i < a.size()) out.push_back(a[i++]);
    while (j < b.size()) out.push_back(b[j++]);
    for (size_t k = 0; k < out.size(); k++) {
        if (k) cout << ' ';
        cout << out[k];
    }
    cout << "\\n";
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-tips-5',
    lang: 'algo',
    module: 'tips',
    order: 5,
    title: '前缀和+哈希：和为 K 的子数组',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解前缀和与「区间和 = 两前缀之差」',
      '掌握 前缀和+哈希表 的 O(n) 子数组统计框架',
      '记得初始化 map[0]=1 并注意负数带来的影响',
    ],
    brief: `## 前缀和 + 哈希：化区间为「两个前缀相减」

求数组中和恰为 k 的连续子数组个数。暴力枚举左右端点是 O(n²)；配合前缀和可以 O(n)：

**核心等式**：子数组 [i+1..j] 的和 = pre[j] − pre[i]（pre 为前缀和）。于是"和为 k"等价于"**两个前缀相差 k**"：

\`\`\`text
从左往右维护 pre，边走边问哈希表：
「之前有多少个前缀恰好等于 pre − k？」
有几个，以当前位置结尾的和为 k 的子数组就有几个
\`\`\`

哈希表存"每个前缀和出现的次数"，初始 \`pre = 0\` 记 1 次（空前缀）—— 这样从头开始的子数组也不会漏。每步 O(1)，总计 **O(n)**。负数会让前缀和忽大忽小，滑动窗口在这里失效，正显出"前缀+哈希"的威力。

> ⚠️ 易错点：① 忘记初始化 \`map[0] = 1\`，会漏掉从下标 0 开始的子数组；② 必须**先查询再加当前前缀**，顺序反了 k=0 时会把空子数组多算进去；③ C++/Go/Rust 的前缀和与计数用 64 位。`,
    task: `## 任务：和为 K 的子数组

读入 n k 和 n 个整数（**可能为负**），统计"和恰好等于 k 的连续子数组"的个数。

**输入**：两行 —— 第一行 n k（1 ≤ n ≤ 2000，|k| ≤ 10⁹）；第二行 n 个整数（绝对值 ≤ 10⁹）

**输出**：一行一个整数 —— 满足条件的子数组个数

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| 第一行 \`5 3\`<br>第二行 \`1 2 3 -1 4\` | \`3\` | [1,2]、[3]、[-1,4] |
| 第一行 \`1 -5\`<br>第二行 \`-5\` | \`1\` | 单元素子数组 |`,
    starter: `const [n, k] = readInts();
const a = readInts();

// TODO 1: cnt = new Map([[0, 1]]) —— 前缀和 0 出现 1 次（空前缀，别漏）
// TODO 2: 边扫边维护 pre：先 ans += (cnt.get(pre - k) ?? 0)，再 cnt.set(pre, (cnt.get(pre) ?? 0) + 1)
// TODO 3: 输出 ans
console.log(0); // 占位，替换为你的计算结果
`,
    solution: `const [n, k] = readInts();
const a = readInts();
const cnt = new Map([[0, 1]]);
let pre = 0;
let ans = 0;
for (let i = 0; i < n; i++) {
  pre += a[i];
  ans += cnt.get(pre - k) ?? 0;
  cnt.set(pre, (cnt.get(pre) ?? 0) + 1);
}
console.log(ans);
`,
    hints: [
      '前缀和 pre[j] = 前 j 个数的和；子数组 (i..j] 的和 = pre[j] − pre[i]。求「和为 k」就是数「差为 k 的前缀对」。',
      '边扫边查哈希表：ans += map 里 pre−k 出现的次数；然后把当前 pre 的次数 +1。查询必须在插入当前前缀之前做。',
      '初始化 map[0] = 1（空前缀），否则从头开始的子数组会漏；k=0 的用例能帮你验证这一点。计数与前缀和用 64 位更稳。',
    ],
    tests: [
      { name: '样例：正负混合', stdin: '5 3\n1 2 3 -1 4\n', expected: '3' },
      { name: '样例：单元素', stdin: '1 -5\n-5\n', expected: '1' },
      { name: '隐藏：全零 k=0', stdin: '3 0\n0 0 0\n', expected: '6', hidden: true },
      { name: '隐藏：正负抵消', stdin: '8 7\n3 4 -7 1 3 3 1 -4\n', expected: '4', hidden: true },
      { name: '隐藏：全 1', stdin: '6 2\n1 1 1 1 1 1\n', expected: '5', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const [n, k] = readInts();
const a = readInts();

// TODO 1: cnt = new Map([[0, 1]]) —— 前缀和 0 出现 1 次（空前缀，别漏）
// TODO 2: 边扫边维护 pre：先 ans += (cnt.get(pre - k) ?? 0)，再 cnt.set(pre, (cnt.get(pre) ?? 0) + 1)
// TODO 3: 输出 ans
console.log(0); // 占位，替换为你的计算结果
`,
        go: `package main

import "fmt"

func main() {
	var n, k int64
	fmt.Scan(&n, &k)

	// TODO 1: cnt := map[int64]int64{0: 1}（前缀和 0 出现 1 次，别忘了！）
	// TODO 2: 边读边累加 pre；每步先 ans += cnt[pre-k]，再 cnt[pre]++
	// TODO 3: 输出 ans
	ans := int64(0)
	fmt.Println(ans)
}
`,
        rust: `use std::collections::HashMap;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let toks: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let n = toks[0] as usize;
    let k = toks[1];

    // TODO 1: HashMap<i64, i64>，初始 (0, 1)
    // TODO 2: 遍历数组累加 pre：先 ans += cnt.get(&(pre - k))，再 cnt[pre] += 1
    // TODO 3: 输出 ans
    println!("{}", 0); // 占位，替换为你的计算结果
}
`,
        cpp: `#include <iostream>
#include <unordered_map>
using namespace std;

int main() {
    long long n, k;
    cin >> n >> k;

    // TODO 1: unordered_map<long long, long long> cnt; cnt[0] = 1;
    // TODO 2: 循环读入并累加 pre：先查 cnt.find(pre - k) 累加答案，再 cnt[pre]++
    // TODO 3: 输出 ans
    long long ans = 0;
    cout << ans << "\\n"; // 占位，替换为你的计算结果
    return 0;
}
`,
      },
      solutions: {
        javascript: `const [n, k] = readInts();
const a = readInts();
const cnt = new Map([[0, 1]]);
let pre = 0;
let ans = 0;
for (let i = 0; i < n; i++) {
  pre += a[i];
  ans += cnt.get(pre - k) ?? 0;
  cnt.set(pre, (cnt.get(pre) ?? 0) + 1);
}
console.log(ans);
`,
        go: `package main

import "fmt"

func main() {
	var n, k int64
	fmt.Scan(&n, &k)
	cnt := map[int64]int64{0: 1}
	var pre, ans int64
	for i := int64(0); i < n; i++ {
		var x int64
		fmt.Scan(&x)
		pre += x
		ans += cnt[pre-k]
		cnt[pre]++
	}
	fmt.Println(ans)
}
`,
        rust: `use std::collections::HashMap;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let toks: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let n = toks[0] as usize;
    let k = toks[1];
    let mut cnt: HashMap<i64, i64> = HashMap::new();
    cnt.insert(0, 1);
    let mut pre = 0i64;
    let mut ans = 0i64;
    for i in 0..n {
        pre += toks[2 + i];
        ans += *cnt.get(&(pre - k)).unwrap_or(&0);
        *cnt.entry(pre).or_insert(0) += 1;
    }
    println!("{}", ans);
}
`,
        cpp: `#include <iostream>
#include <unordered_map>
using namespace std;

int main() {
    long long n, k;
    cin >> n >> k;
    unordered_map<long long, long long> cnt;
    cnt[0] = 1;
    long long pre = 0, ans = 0;
    for (long long i = 0; i < n; i++) {
        long long x;
        cin >> x;
        pre += x;
        auto it = cnt.find(pre - k);
        if (it != cnt.end()) ans += it->second;
        cnt[pre]++;
    }
    cout << ans << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'prefix-sum' },
  },
  {
    id: 'algo-tips-6',
    lang: 'algo',
    module: 'tips',
    order: 6,
    title: '调试：打印中间态',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握标准二分查找 lo/hi/mid 的推进规则',
      '学会用打印中间态的方法定位死循环与边界错误',
      '能按严格格式输出调试信息',
    ],
    brief: `## 调试：让程序把心里话打印出来

二分查找写错时，与其盯着代码发呆，不如**把每轮的 lo/hi/mid 打出来**，对着样例逐步核对 —— 这叫"打印中间态"，最朴素也最万能的调试法。

标准二分骨架（下标从 0 开始）：

\`\`\`text
lo = 0, hi = n-1
while lo <= hi:
    mid = ⌊(lo+hi)/2⌋
    a[mid] == target → 找到
    a[mid] <  target → lo = mid+1（目标在右半）
    a[mid] >  target → hi = mid-1（目标在左半）
\`\`\`

打印三件套怎么看门道：

- **lo/hi 是否正确收缩**：不收缩 = 死循环（典型错误：\`lo = mid\` 而不是 \`mid + 1\`）；
- **mid 是否落在预期区间**：能暴露边界算错；
- **最后为何退出**：lo > hi 仍未命中 → not found。

> ⚠️ 易错点：① 本题要求**先打印再判断**，包括发现目标的那一轮；② mid 用整数除法向下取整，JS 要 \`Math.floor\`；③ \`found at <下标>\` 的下标从 0 起；④ 输出格式逐字符对齐，别多空格。`,
    task: `## 任务：给二分查找装上「行车记录仪」

读入 n 和目标值 target，再读入 n 个**升序**整数（下标从 0 开始）。模拟标准二分查找（lo=0、hi=n-1、mid = ⌊(lo+hi)/2⌋），并把过程打印出来：

- **每一轮**循环（包括找到目标的那一轮）输出一行：\`lo=<lo> hi=<hi> mid=<mid> a[mid]=<值>\`
- 若某轮 a[mid] == target，紧接该行输出 \`found at <mid下标>\`，结束；
- 若循环因 lo > hi 退出仍未找到，输出 \`not found\`。

**输入**：两行 —— 第一行 n target（1 ≤ n ≤ 1000）；第二行 n 个升序整数

**输出**：按上述格式逐行输出（各字段间恰好一个空格）

### 示例

| 输入 | 输出 |
| --- | --- |
| 第一行 \`5 4\`<br>第二行 \`1 2 4 8 16\` | \`lo=0 hi=4 mid=2 a[mid]=4\`<br>\`found at 2\` |
| 第一行 \`5 6\`<br>第二行 \`1 2 4 8 16\` | \`lo=0 hi=4 mid=2 a[mid]=4\`<br>\`lo=3 hi=4 mid=3 a[mid]=8\`<br>\`not found\` |`,
    starter: `const [n, target] = readInts();
const a = readInts();

// TODO 1: lo = 0、hi = n - 1；while (lo <= hi) 循环
// TODO 2: 每轮 mid = Math.floor((lo + hi) / 2)，先按 lo=.. hi=.. mid=.. a[mid]=.. 的格式输出本轮
// TODO 3: 命中输出 found at <mid> 并停止；否则按大小收缩 lo/hi；循环结束仍未找到输出 not found
console.log('not found'); // 占位，替换为你的模拟输出
`,
    solution: `const [n, target] = readInts();
const a = readInts();
let lo = 0;
let hi = n - 1;
let found = -1;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  console.log('lo=' + lo + ' hi=' + hi + ' mid=' + mid + ' a[mid]=' + a[mid]);
  if (a[mid] === target) {
    found = mid;
    break;
  }
  if (a[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
if (found >= 0) console.log('found at ' + found);
else console.log('not found');
`,
    hints: [
      '标准二分：lo=0、hi=n-1；while (lo <= hi)：mid = floor((lo+hi)/2)。每轮先打印再判断，包括命中那一轮。',
      '打印格式逐字符对齐：lo=<lo> hi=<hi> mid=<mid> a[mid]=<值>，各字段恰好一个空格（Go 用 Printf，C++ 用 cout 拼接，Rust 用 println!）。',
      'a[mid] < target 时 lo = mid+1，大于时 hi = mid-1（不减 1 会死循环）；命中输出 found at <mid> 后立即结束；循环正常退出还没找到就输出 not found。',
    ],
    tests: [
      {
        name: '样例：四轮命中',
        stdin: '9 7\n1 3 5 7 9 11 13 15 17\n',
        expected: 'lo=0 hi=8 mid=4 a[mid]=9\nlo=0 hi=3 mid=1 a[mid]=3\nlo=2 hi=3 mid=2 a[mid]=5\nlo=3 hi=3 mid=3 a[mid]=7\nfound at 3',
      },
      {
        name: '样例：一轮命中',
        stdin: '5 4\n1 2 4 8 16\n',
        expected: 'lo=0 hi=4 mid=2 a[mid]=4\nfound at 2',
      },
      {
        name: '隐藏：未找到',
        stdin: '5 6\n1 2 4 8 16\n',
        expected: 'lo=0 hi=4 mid=2 a[mid]=4\nlo=3 hi=4 mid=3 a[mid]=8\nnot found',
        hidden: true,
      },
      {
        name: '隐藏：单元素命中',
        stdin: '1 3\n3\n',
        expected: 'lo=0 hi=0 mid=0 a[mid]=3\nfound at 0',
        hidden: true,
      },
      {
        name: '隐藏：末位命中',
        stdin: '6 15\n2 4 6 8 10 15\n',
        expected: 'lo=0 hi=5 mid=2 a[mid]=6\nlo=3 hi=5 mid=4 a[mid]=10\nlo=5 hi=5 mid=5 a[mid]=15\nfound at 5',
        hidden: true,
      },
    ],
    algo: {
      starters: {
        javascript: `const [n, target] = readInts();
const a = readInts();

// TODO 1: lo = 0、hi = n - 1；while (lo <= hi) 循环
// TODO 2: 每轮 mid = Math.floor((lo + hi) / 2)，先按 lo=.. hi=.. mid=.. a[mid]=.. 的格式输出本轮
// TODO 3: 命中输出 found at <mid> 并停止；否则按大小收缩 lo/hi；循环结束仍未找到输出 not found
console.log('not found'); // 占位，替换为你的模拟输出
`,
        go: `package main

import "fmt"

func main() {
	var n, target int
	fmt.Scan(&n, &target)
	a := make([]int, n)
	for i := range a {
		fmt.Scan(&a[i])
	}

	// TODO 1: lo, hi := 0, n-1；for lo <= hi 循环
	// TODO 2: 每轮 mid := (lo+hi)/2，先 Printf("lo=%d hi=%d mid=%d a[mid]=%d\\n", ...) 打印
	// TODO 3: 命中输出 found at <mid> 并结束；未命中按大小收缩 lo/hi；循环自然结束输出 not found
	fmt.Println("not found") // 占位，替换为你的模拟输出
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let toks: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let n = toks[0] as usize;
    let target = toks[1];
    let a = &toks[2..2 + n];

    // TODO 1: lo=0, hi=n-1；while lo <= hi 循环
    // TODO 2: 每轮 mid = (lo+hi)/2，先 println!("lo={} hi={} mid={} a[mid]={}", ...) 打印
    // TODO 3: 命中输出 found at <mid> 并结束；未命中按大小收缩 lo/hi；循环自然结束输出 not found
    println!("not found"); // 占位，替换为你的模拟输出
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, target;
    cin >> n >> target;
    vector<long long> a(n);
    for (auto& v : a) cin >> v;

    // TODO 1: lo=0, hi=n-1；while (lo <= hi) 循环
    // TODO 2: 每轮 mid = (lo+hi)/2，先按格式输出 lo=.. hi=.. mid=.. a[mid]=..
    // TODO 3: 命中输出 found at <mid> 并结束；未命中按大小收缩 lo/hi；循环自然结束输出 not found
    cout << "not found" << "\\n"; // 占位，替换为你的模拟输出
    return 0;
}
`,
      },
      solutions: {
        javascript: `const [n, target] = readInts();
const a = readInts();
let lo = 0;
let hi = n - 1;
let found = -1;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  console.log('lo=' + lo + ' hi=' + hi + ' mid=' + mid + ' a[mid]=' + a[mid]);
  if (a[mid] === target) {
    found = mid;
    break;
  }
  if (a[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
if (found >= 0) console.log('found at ' + found);
else console.log('not found');
`,
        go: `package main

import "fmt"

func main() {
	var n, target int
	fmt.Scan(&n, &target)
	a := make([]int, n)
	for i := range a {
		fmt.Scan(&a[i])
	}
	lo, hi := 0, n-1
	found := -1
	for lo <= hi {
		mid := (lo + hi) / 2
		fmt.Printf("lo=%d hi=%d mid=%d a[mid]=%d\\n", lo, hi, mid, a[mid])
		if a[mid] == target {
			found = mid
			break
		}
		if a[mid] < target {
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	if found >= 0 {
		fmt.Println("found at", found)
	} else {
		fmt.Println("not found")
	}
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let toks: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let n = toks[0] as usize;
    let target = toks[1];
    let a = &toks[2..2 + n];
    let (mut lo, mut hi) = (0i64, n as i64 - 1);
    let mut found: i64 = -1;
    while lo <= hi {
        let mid = (lo + hi) / 2;
        let mid_u = mid as usize;
        println!("lo={} hi={} mid={} a[mid]={}", lo, hi, mid, a[mid_u]);
        if a[mid_u] == target {
            found = mid;
            break;
        }
        if a[mid_u] < target {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    if found >= 0 {
        println!("found at {}", found);
    } else {
        println!("not found");
    }
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, target;
    cin >> n >> target;
    vector<long long> a(n);
    for (auto& v : a) cin >> v;
    int lo = 0, hi = n - 1;
    int found = -1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        cout << "lo=" << lo << " hi=" << hi << " mid=" << mid << " a[mid]=" << a[mid] << "\\n";
        if (a[mid] == target) {
            found = mid;
            break;
        }
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    if (found >= 0) cout << "found at " << found << "\\n";
    else cout << "not found" << "\\n";
    return 0;
}
`,
      },
    },
  },
];
