import type { Level } from '@/types';

/** 算法课 · 第一章：基础篇 —— 复杂度与基础技巧（8 关） */
export const ALGO_BASIC: Level[] = [
  {
    id: 'algo-basic-1',
    lang: 'algo',
    module: 'basic',
    order: 1,
    title: '复杂度：数循环',
    difficulty: 1,
    xp: 15,
    goals: [
      '理解大 O 记号：只看增长趋势，忽略常数与低阶项',
      '能数出单层、双层、折半三种循环的执行次数',
      '认识 O(n)、O(n²)、O(log n) 的数量级差距',
    ],
    brief: `## 用大 O 丈量代码

算法好不好，不看机器快慢，看**执行次数随输入规模 n 的增长趋势** —— 这就是大 O 记号。它忽略常数和低阶项，只保留增长最快的部分：

\`\`\`text
for i in 0..n                    → 执行 n 次           → O(n)
for i in 0..n { for j in 0..n }  → 执行 n×n 次         → O(n²)
while m > 0 { m = m / 2 }        → 执行 ⌊log₂n⌋+1 次   → O(log n)
\`\`\`

数量级差距巨大：n = 10⁶ 时，O(n) 是一百万步（眨眼完成），O(log n) 只有约 20 步，而 O(n²) 是一万亿步（分钟级起步）。**常数再大也改变不了排名**：O(100·n) 在 n 足够大后仍会被 O(n²) 反超。

对数为什么出现？每次把 n 减半，问"能减几次到 0"：1000 → 500 → 250 → … → 1 → 0。10⁶ 大约只要 20 次 —— 二分查找的高效正源于此。

> ⚠️ 两个坑：① n² 本身会很大 —— n = 10⁶ 时 n² = 10¹²，超出 32 位整数上限（约 2.1×10⁹），C++/Rust/Go 要用 64 位整数；② 数循环次数最稳的方法不是背公式，而是把循环**模拟一遍**。`,
    task: `## 任务：数出三种循环的执行次数

读入一个整数 n（1 ≤ n ≤ 10⁶），依次输出下面三段代码各自的执行次数：

1. \`for (i = 0; i < n; i++)\` —— 单层循环
2. \`for (i = 0; i < n; i++) { for (j = 0; j < n; j++) }\` —— 双层嵌套
3. \`while (m > 0) { m = m / 2 }\` —— 折半循环（m 从 n 开始，整数除法向零取整）

**输入**：一行一个整数 n

**输出**：三行，分别是三段代码的执行次数

### 示例

| 输入 | 输出 |
| --- | --- |
| \`10\` | \`10\`<br>\`100\`<br>\`4\` |
| \`1\` | \`1\`<br>\`1\`<br>\`1\` |

第 3 段以 n = 10 为例：m 依次为 10 → 5 → 2 → 1 → 0，循环体共执行 4 次（即 ⌊log₂10⌋ + 1）。`,
    starter: `const n = Number(readline());

// TODO 1: 第 1 行输出 n；第 2 行输出 n*n
// TODO 2: 模拟折半循环：m 从 n 开始，每次 m = Math.floor(m / 2)，直到 m 为 0，用计数器数执行次数
// TODO 3: 依次输出三行：n、n*n、次数

console.log(n); // 第 1 行先输出，后两行由你完成
`,
    solution: `const n = Number(readline());
let m = n;
let c = 0;
while (m > 0) {
  m = Math.floor(m / 2);
  c++;
}
console.log(n);
console.log(n * n);
console.log(c);
`,
    hints: [
      '第 1、2 问直接计算：n 和 n×n。第 3 问别套公式，声明 m = n，用 while 循环模拟每次除以 2，用计数器数循环体执行了几次。',
      '折半计数骨架：`let m = n, c = 0; while (m > 0) { m = Math.floor(m / 2); c++; }`（Go/Rust/C++ 里 `m /= 2` 整数除法即可）。循环结束后 c 就是第三行的答案。',
      '输出注意 n×n 可达 10¹²：Go 用 int64、Rust 用 i64、C++ 用 long long。最终三行输出依次是 n、n*n、c，各占一行。',
    ],
    tests: [
      { name: '样例：10', stdin: '10\n', expected: '10\n100\n4' },
      { name: '样例：1', stdin: '1\n', expected: '1\n1\n1' },
      { name: '隐藏：2 的幂 1024', stdin: '1024\n', expected: '1024\n1048576\n11', hidden: true },
      { name: '隐藏：奇数 999', stdin: '999\n', expected: '999\n998001\n10', hidden: true },
      { name: '隐藏：上限 1000000', stdin: '1000000\n', expected: '1000000\n1000000000000\n20', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const n = Number(readline());

// TODO 1: 第 1 行输出 n；第 2 行输出 n*n
// TODO 2: 模拟折半循环：m 从 n 开始，每次 m = Math.floor(m / 2)，直到 m 为 0，用计数器数执行次数
// TODO 3: 依次输出三行：n、n*n、次数

console.log(n); // 第 1 行先输出，后两行由你完成
`,
        go: `package main

import "fmt"

func main() {
	var n int64
	fmt.Scan(&n)

	// TODO 1: 用循环模拟 n /= 2 的过程，统计执行次数 c
	// TODO 2: 依次输出三行：n、n*n、c
	fmt.Println(n)
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let n: i64 = line.trim().parse().unwrap();

    // TODO 1: 用 while 循环模拟 n /= 2，统计执行次数 c
    // TODO 2: 依次输出三行：n、n*n、c
    println!("{}", n);
}
`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;

    // TODO 1: 用循环模拟 n /= 2，统计执行次数 c
    // TODO 2: 依次输出三行：n、n*n、c
    cout << n << "\\n";
    return 0;
}
`,
      },
      solutions: {
        javascript: `const n = Number(readline());
let m = n;
let c = 0;
while (m > 0) {
  m = Math.floor(m / 2);
  c++;
}
console.log(n);
console.log(n * n);
console.log(c);
`,
        go: `package main

import "fmt"

func main() {
	var n int64
	fmt.Scan(&n)
	c := int64(0)
	for m := n; m > 0; m /= 2 {
		c++
	}
	fmt.Println(n)
	fmt.Println(n * n)
	fmt.Println(c)
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let n: i64 = line.trim().parse().unwrap();
    let mut c = 0i64;
    let mut m = n;
    while m > 0 {
        m /= 2;
        c += 1;
    }
    println!("{}", n);
    println!("{}", n * n);
    println!("{}", c);
}
`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    long long c = 0;
    for (long long m = n; m > 0; m /= 2) c++;
    cout << n << "\\n" << n * n << "\\n" << c << "\\n";
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-basic-2',
    lang: 'algo',
    module: 'basic',
    order: 2,
    title: '数组三兄弟：max/min/sum',
    difficulty: 1,
    xp: 15,
    goals: [
      '掌握一遍扫描同时求最大值、最小值与总和',
      '理解"用第一个元素初始化极值"的正确姿势',
      '意识到求和溢出问题与 64 位整数',
    ],
    brief: `## 一趟扫描，三样全收

求最大、最小、总和，最朴素的办法是扫三遍数组，但**一遍就够** —— 用三个"记录员"变量同步更新：

\`\`\`js
let mx = a[0], mn = a[0], sum = 0; // 记录员：当前最大 / 当前最小 / 累计和
for (const x of a) {
  if (x > mx) mx = x;
  if (x < mn) mn = x;
  sum += x;
}
\`\`\`

总时间 O(n)，数组只扫一遍。这个"边扫边维护极值"的框架，后面学滑动窗口、动态规划时还会反复见到。

> ⚠️ 最大的坑：把 mx 初始化为 0。如果输入全是负数（如 \`-5 -2 -9\`），答案永远是错误的 0。**正确做法：用第一个元素初始化 mx 和 mn。**

另一个隐形坑是求和溢出：1000 个 10⁹ 相加约 10¹²，32 位整数（上限约 2.1×10⁹）装不下 —— Go/Rust/C++ 记得用 64 位类型（int64 / i64 / long long）。`,
    task: `## 任务：报出三兄弟

读入一行整数，输出其中的最大值、最小值与总和。

**输入**：一行 1~1000 个整数，以空格分隔（绝对值 ≤ 10⁹）

**输出**：三行 —— 第 1 行最大值，第 2 行最小值，第 3 行总和

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 1 4 1 5 9 2 6\` | \`9\`<br>\`1\`<br>\`31\` |
| \`7\` | \`7\`<br>\`7\`<br>\`7\` |

注意：输入可能包含负数和 0，初始化方式要经得起全负数数组的考验。`,
    starter: `const a = readInts();

// TODO 1: 用 a[0] 初始化 mx 和 mn（不要用 0！全负数会翻车）
// TODO 2: 遍历 a，同时维护 mx、mn 并累加 sum
// TODO 3: 三行输出：mx、mn、sum

console.log(a[0]); // 占位，替换为你的输出
`,
    solution: `const a = readInts();
let mx = a[0], mn = a[0], sum = 0;
for (const x of a) {
  if (x > mx) mx = x;
  if (x < mn) mn = x;
  sum += x;
}
console.log(mx);
console.log(mn);
console.log(sum);
`,
    hints: [
      'JS 用 `const a = readInts()` 读一行整数。先拿 a[0] 初始化 mx 和 mn（不要用 0！），sum 从 0 开始累加。',
      '一个 for 循环里做三件事：`if (x > mx) mx = x;`、`if (x < mn) mn = x;`、`sum += x`。',
      '最后三行输出：`console.log(mx)` / `console.log(mn)` / `console.log(sum)`。Go/Rust/C++ 的 sum 用 64 位类型防溢出。',
    ],
    tests: [
      { name: '样例：混合数列', stdin: '3 1 4 1 5 9 2 6\n', expected: '9\n1\n31' },
      { name: '样例：单个数', stdin: '7\n', expected: '7\n7\n7' },
      { name: '隐藏：全负数', stdin: '-5 -2 -9 -1\n', expected: '-1\n-9\n-17', hidden: true },
      { name: '隐藏：含零与重复', stdin: '0 -3 8 0\n', expected: '8\n-3\n5', hidden: true },
      { name: '隐藏：大数求和', stdin: '1000000000 1000000000\n', expected: '1000000000\n1000000000\n2000000000', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const a = readInts();

// TODO 1: 用 a[0] 初始化 mx 和 mn（不要用 0！全负数会翻车）
// TODO 2: 遍历 a，同时维护 mx、mn 并累加 sum
// TODO 3: 三行输出：mx、mn、sum

console.log(a[0]); // 占位，替换为你的输出
`,
        go: `package main

import "fmt"

func main() {
	var mx, mn, sum int64
	var x int64
	for {
		_, err := fmt.Scan(&x)
		if err != nil {
			break // 读到输入末尾
		}
		// TODO 1: 第一个数时用 x 初始化 mx、mn（可用 first 标记）
		// TODO 2: 维护 mx、mn
		// TODO 3: 累加 sum
	}
	fmt.Println(mx)
	fmt.Println(mn)
	fmt.Println(sum)
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let a: Vec<i64> = line.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: 用 a[0] 初始化 mx 和 mn（不要用 0！）
    // TODO 2: 遍历 a，同时维护 mx、mn 并累加 sum
    // TODO 3: 三行输出：mx、mn、sum
    println!("{}", a[0]); // 占位，替换为你的输出
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);

    // TODO 1: 用 a[0] 初始化 mx 和 mn（不要用 0！）
    // TODO 2: 遍历 a，同时维护 mx、mn 并累加 sum
    // TODO 3: 三行输出：mx、mn、sum
    cout << a[0] << "\\n"; // 占位，替换为你的输出
    return 0;
}
`,
      },
      solutions: {
        javascript: `const a = readInts();
let mx = a[0], mn = a[0], sum = 0;
for (const x of a) {
  if (x > mx) mx = x;
  if (x < mn) mn = x;
  sum += x;
}
console.log(mx);
console.log(mn);
console.log(sum);
`,
        go: `package main

import "fmt"

func main() {
	var x int64
	first := true
	var mx, mn, sum int64
	for {
		_, err := fmt.Scan(&x)
		if err != nil {
			break
		}
		if first {
			mx, mn = x, x
			first = false
		}
		if x > mx {
			mx = x
		}
		if x < mn {
			mn = x
		}
		sum += x
	}
	fmt.Println(mx)
	fmt.Println(mn)
	fmt.Println(sum)
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let a: Vec<i64> = line.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let mut mx = a[0];
    let mut mn = a[0];
    let mut sum = 0i64;
    for &x in &a {
        if x > mx { mx = x; }
        if x < mn { mn = x; }
        sum += x;
    }
    println!("{}", mx);
    println!("{}", mn);
    println!("{}", sum);
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);
    long long mx = a[0], mn = a[0], sum = 0;
    for (long long v : a) {
        if (v > mx) mx = v;
        if (v < mn) mn = v;
        sum += v;
    }
    cout << mx << "\\n" << mn << "\\n" << sum << "\\n";
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-basic-3',
    lang: 'algo',
    module: 'basic',
    order: 3,
    title: '原地反转',
    difficulty: 1,
    xp: 15,
    goals: [
      '掌握倒序遍历输出反转数组的写法',
      '理解对撞双指针原地交换：O(1) 额外空间',
      '注意行尾无空格的输出格式细节',
    ],
    brief: `## 双指针原地反转

反转数组有两个流派：**倒着输出**（新开数组从尾到头取）和**原地交换**（对称位置两两互换）。后者只需 O(1) 额外空间，是面试高频写法：

\`\`\`js
for (let i = 0, j = a.length - 1; i < j; i++, j--) {
  [a[i], a[j]] = [a[j], a[i]]; // 首尾交换
}
\`\`\`

两个指针 i、j 从两端向中间走，每走一步交换一对，相遇即完成 —— 这就是"对撞双指针"的雏形，本章回文判断用的正是它。

> ⚠️ 输出格式坑：数字之间用**单个空格**分隔，行尾不能留空格。用 \`join(' ')\` 或"第一个元素前不加分隔符"的写法；Go 千万别直接 \`fmt.Println(a)\`，那会打出 \`[3 6 9]\` 这种带方括号的格式。`,
    task: `## 任务：倒带

读入一行整数，将它们**按相反顺序**输出。

**输入**：一行 1~1000 个整数，以空格分隔（绝对值 ≤ 10⁹）

**输出**：一行，反转后的序列，数字间单个空格分隔（行尾无空格）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`1 2 3 4 5\` | \`5 4 3 2 1\` |
| \`42\` | \`42\` |

单个元素反转后仍是自己；负数与 0 照常参与。`,
    starter: `const a = readInts();

// TODO 1: 反转数组（倒序遍历 push 到新数组，或对撞双指针原地交换）
// TODO 2: 用空格分隔输出一行（行尾不要有空格）

console.log(a.join(' ')); // 占位：还没反转，先想想怎么改
`,
    solution: `const a = readInts();
const out = [];
for (let i = a.length - 1; i >= 0; i--) out.push(a[i]);
console.log(out.join(' '));
`,
    hints: [
      'JS 里 `const a = readInts()` 拿到数组后，从 `a.length - 1` 倒着遍历 push 到新数组，再 `join(" ")` 输出，是最省事的写法。',
      '想练原地反转就用对撞双指针：`for (let i = 0, j = a.length - 1; i < j; i++, j--)` 循环体里交换 a[i] 和 a[j]，然后正序输出。',
      'Go/Rust/C++ 输出数组别用语言默认打印：Go 用循环 + `fmt.Print`（第一个元素前不加空格），Rust 用 `map(|x| x.to_string()).collect()` 后 `join(" ")`，C++ 用"先输出第一个，之后每个先输出空格"。',
    ],
    tests: [
      { name: '样例：1 到 5', stdin: '1 2 3 4 5\n', expected: '5 4 3 2 1' },
      { name: '样例：单个数', stdin: '42\n', expected: '42' },
      { name: '隐藏：负数与零', stdin: '-1 0 7\n', expected: '7 0 -1', hidden: true },
      { name: '隐藏：重复值', stdin: '2 2 3\n', expected: '3 2 2', hidden: true },
      { name: '隐藏：1 到 10', stdin: '1 2 3 4 5 6 7 8 9 10\n', expected: '10 9 8 7 6 5 4 3 2 1', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const a = readInts();

// TODO 1: 反转数组（倒序遍历 push 到新数组，或对撞双指针原地交换）
// TODO 2: 用空格分隔输出一行（行尾不要有空格）

console.log(a.join(' ')); // 占位：还没反转，先想想怎么改
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

	// TODO 1: 从最后一个元素倒序遍历
	// TODO 2: 元素之间用空格分隔（第一个元素前不加），行尾无空格
	for i := len(a) - 1; i >= 0; i-- {
		fmt.Print(a[i]) // 占位：补上空格逻辑
	}
	fmt.Println()
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut a: Vec<i64> = line.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: 反转 a（提示：a.reverse() 一行搞定，或自己写双指针交换）
    // TODO 2: 空格分隔输出一行（提示：map(|x| x.to_string()) 后 join(" ")）
    println!("{}", a[0]); // 占位，替换为整行输出
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);

    // TODO 1: 从最后一个元素倒序遍历（i 从 a.size()-1 到 0）
    // TODO 2: 元素之间用空格分隔（第一个元素前不加），行尾无空格
    cout << a[0]; // 占位，替换为完整的反转输出
    cout << "\\n";
    return 0;
}
`,
      },
      solutions: {
        javascript: `const a = readInts();
const out = [];
for (let i = a.length - 1; i >= 0; i--) out.push(a[i]);
console.log(out.join(' '));
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
	for i := len(a) - 1; i >= 0; i-- {
		if i < len(a)-1 {
			fmt.Print(" ")
		}
		fmt.Print(a[i])
	}
	fmt.Println()
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut a: Vec<i64> = line.split_whitespace().map(|x| x.parse().unwrap()).collect();
    a.reverse();
    let strs: Vec<String> = a.iter().map(|x| x.to_string()).collect();
    println!("{}", strs.join(" "));
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);
    for (int i = (int)a.size() - 1; i >= 0; i--) {
        if (i < (int)a.size() - 1) cout << ' ';
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
    id: 'algo-basic-4',
    lang: 'algo',
    module: 'basic',
    order: 4,
    title: '前缀和：区间和查询',
    difficulty: 2,
    xp: 25,
    goals: [
      '理解前缀和数组 pre[i] = 前 i 个元素之和',
      '掌握 O(1) 查询：区间 [l, r] 的和 = pre[r] - pre[l-1]',
      '处理好 1 起下标与 0 起数组的错位',
    ],
    brief: `## 前缀和：用减法代替循环

区间和查询：问"第 l 到第 r 个数加起来是多少"，每次现算最坏要 O(n)。**前缀和**先花 O(n) 预处理，之后**每查一次只需一次减法**：

\`\`\`text
pre[0] = 0
pre[i] = pre[i-1] + a[i-1]       // pre[i] = 前 i 个数的和
区间 [l, r] 的和 = pre[r] - pre[l-1]
\`\`\`

先看上方动画，理解 pre 数组怎么"长出来"、查询怎么两数相减。以 a = [1,2,3,4,5] 为例：pre = [0,1,3,6,10,15]，区间 [2,5] 的和 = pre[5] − pre[1] = 15 − 1 = 14。

预处理 O(n) + 每次查询 O(1)，总复杂度 O(n + q) —— 这是"离线预处理换在线快答"思想的第一个例子。

> ⚠️ 两处下标坑：① 题目的 l、r 从 1 开始，数组下标从 0 开始 —— pre 比 a 多一位正好化解错位；② 减的是 \`pre[l-1]\`，不是 \`pre[l]\`。`,
    task: `## 任务：区间和查询器

**输入**：
- 第 1 行：n 和 q（1 ≤ n, q ≤ 1000）
- 第 2 行：n 个整数（绝对值 ≤ 10⁹）
- 接下来 q 行：每行 l r（1 ≤ l ≤ r ≤ n，**1 起、闭区间**）

**输出**：q 行，每行一个整数，对应查询的区间和

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5 2\`<br>\`1 2 3 4 5\`<br>\`1 3\`<br>\`2 5\` | \`6\`<br>\`14\` |
| \`1 1\`<br>\`7\`<br>\`1 1\` | \`7\` |

提示：区间和最大可达 10³ × 10⁹ = 10¹²，Go/Rust/C++ 用 64 位整数才装得下。`,
    starter: `const [n, q] = readInts();
const a = readInts();

// TODO 1: 构建前缀和数组 pre：pre[0] = 0，pre[i] = pre[i-1] + a[i-1]
// TODO 2: 循环 q 次，每次读一行 l r，输出 pre[r] - pre[l-1]

for (let t = 0; t < q; t++) {
  const [l, r] = readInts();
  // TODO: 输出区间和
}
`,
    solution: `const [n, q] = readInts();
const a = readInts();
const pre = [0];
for (let i = 0; i < n; i++) pre.push(pre[i] + a[i]);
for (let t = 0; t < q; t++) {
  const [l, r] = readInts();
  console.log(pre[r] - pre[l - 1]);
}
`,
    hints: [
      '先建前缀和：`pre[0] = 0`，然后 `for (let i = 1; i <= n; i++) pre[i] = pre[i-1] + a[i-1]`（注意 a 的下标是 i-1）。',
      '每个查询一次减法搞定：区间 [l, r] 的和 = `pre[r] - pre[l-1]`。可以在纸上用 n=5 的例子验证 l=1 和 l=2 两种情况。',
      'JS 里每个查询 `const [l, r] = readInts()` 读入后直接 `console.log(pre[r] - pre[l-1])`，循环 q 次。Go/Rust/C++ 的 pre 用 64 位整型。',
    ],
    tests: [
      { name: '样例：1 到 5 两查', stdin: '5 2\n1 2 3 4 5\n1 3\n2 5\n', expected: '6\n14' },
      { name: '样例：单元素全区间', stdin: '1 1\n7\n1 1\n', expected: '7' },
      { name: '隐藏：负数参与', stdin: '4 3\n-1 2 -3 4\n1 2\n2 4\n1 4\n', expected: '1\n3\n2', hidden: true },
      { name: '隐藏：大数前缀和', stdin: '6 2\n1000000000 1000000000 1000000000 1000000000 1000000000 1000000000\n1 6\n3 4\n', expected: '6000000000\n2000000000', hidden: true },
      { name: '隐藏：点查询与全区间', stdin: '3 2\n5 -5 10\n2 2\n1 3\n', expected: '-5\n10', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const [n, q] = readInts();
const a = readInts();

// TODO 1: 构建前缀和数组 pre：pre[0] = 0，pre[i] = pre[i-1] + a[i-1]
// TODO 2: 循环 q 次，每次读一行 l r，输出 pre[r] - pre[l-1]

for (let t = 0; t < q; t++) {
  const [l, r] = readInts();
  // TODO: 输出区间和
}
`,
        go: `package main

import "fmt"

func main() {
	var n, q int
	fmt.Scan(&n, &q)
	pre := make([]int64, n+1)
	for i := 1; i <= n; i++ {
		var x int64
		fmt.Scan(&x)
		// TODO: pre[i] = pre[i-1] + x
	}
	for t := 0; t < q; t++ {
		var l, r int
		fmt.Scan(&l, &r)
		// TODO: 输出 pre[r] - pre[l-1]
		fmt.Println(pre[n]) // 占位，替换为真正的区间和
	}
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut it = line.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let _q: usize = it.next().unwrap().parse().unwrap();

    let mut line2 = String::new();
    stdin().read_line(&mut line2).unwrap();
    let a: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: 构建前缀和 pre（长度 n+1，pre[0] = 0）
    let mut pre = vec![0i64; n + 1];
    for _ in 0.._q {
        // TODO 2: 读取一行 l r，输出 pre[r] - pre[l-1]
        println!("{}", a[0]); // 占位，替换为区间和
    }
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, q;
    cin >> n >> q;
    vector<long long> pre(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        // TODO: pre[i] = pre[i - 1] + x
    }
    while (q--) {
        int l, r;
        cin >> l >> r;
        // TODO: 输出 pre[r] - pre[l-1]
        cout << 0 << "\\n"; // 占位，替换为真正的区间和
    }
    return 0;
}
`,
      },
      solutions: {
        javascript: `const [n, q] = readInts();
const a = readInts();
const pre = [0];
for (let i = 0; i < n; i++) pre.push(pre[i] + a[i]);
for (let t = 0; t < q; t++) {
  const [l, r] = readInts();
  console.log(pre[r] - pre[l - 1]);
}
`,
        go: `package main

import "fmt"

func main() {
	var n, q int
	fmt.Scan(&n, &q)
	pre := make([]int64, n+1)
	for i := 1; i <= n; i++ {
		var x int64
		fmt.Scan(&x)
		pre[i] = pre[i-1] + x
	}
	for t := 0; t < q; t++ {
		var l, r int
		fmt.Scan(&l, &r)
		fmt.Println(pre[r] - pre[l-1])
	}
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut it = line.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut line2 = String::new();
    stdin().read_line(&mut line2).unwrap();
    let a: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let mut pre = vec![0i64; n + 1];
    for i in 0..n {
        pre[i + 1] = pre[i] + a[i];
    }
    for _ in 0..q {
        let mut lr = String::new();
        stdin().read_line(&mut lr).unwrap();
        let mut p = lr.split_whitespace();
        let l: usize = p.next().unwrap().parse().unwrap();
        let r: usize = p.next().unwrap().parse().unwrap();
        println!("{}", pre[r] - pre[l - 1]);
    }
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, q;
    cin >> n >> q;
    vector<long long> pre(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        pre[i] = pre[i - 1] + x;
    }
    while (q--) {
        int l, r;
        cin >> l >> r;
        cout << pre[r] - pre[l - 1] << "\\n";
    }
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'prefix-sum' },
  },
  {
    id: 'algo-basic-5',
    lang: 'algo',
    module: 'basic',
    order: 5,
    title: '计数数组',
    difficulty: 1,
    xp: 20,
    goals: [
      '掌握计数数组：把字符映射为 0~25 的桶编号',
      '理解"字符 - a"的哈希映射思想',
      '利用下标遍历天然获得字典序输出',
    ],
    brief: `## 26 个桶数字母

统计每个字母出现多少次，第一反应可能是"对每个字母扫一遍字符串" —— 26 倍的重复劳动。**计数数组**只扫一遍：

\`\`\`js
const cnt = new Array(26).fill(0);
for (const ch of s) cnt[ch.charCodeAt(0) - 97]++; // 'a' → 桶 0
\`\`\`

字符减去 \`'a'\` 正好变成 0~25 的桶编号，O(1) 定位。扫描 O(n)，最后统计 26 个桶 O(26)，总复杂度 O(n + 26)。这就是**哈希计数**的最简形态：把"键"直接映射成数组下标。

输出时按下标 0~25 遍历，天然按 a~z 字典序排列，无需再排序。Go/C++ 用 \`ch - 'a'\`，Rust 用 \`ch as usize - 'a' as usize\`，思路完全一致。

> 💡 这个模式是后面哈希表、桶排序的地基：**能映射成小范围整数的键，就用数组当哈希表**。`,
    task: `## 任务：字母点名录

读入一行仅由小写字母组成的字符串，按 a~z 顺序输出每个**出现过**的字母及其次数。

**输入**：一行字符串，仅含小写字母，长度 1~1000

**输出**：若干行，每行格式为 \`<字母>:<次数>\`（英文冒号、中间无空格），按字母表顺序，只输出出现过的字母

### 示例

| 输入 | 输出 |
| --- | --- |
| \`hello\` | \`e:1\`<br>\`h:1\`<br>\`l:2\`<br>\`o:1\` |
| \`banana\` | \`a:3\`<br>\`b:1\`<br>\`n:2\` |

只出现一次的字母也要输出；一次都没出现的字母（如示例里的 c）不能出现。`,
    starter: `const s = readline().trim();
const cnt = new Array(26).fill(0);

// TODO 1: 遍历 s，cnt[ch.charCodeAt(0) - 97]++
// TODO 2: 按 a~z 顺序输出出现过的字母，格式为 字母:次数

for (let i = 0; i < 26; i++) {
  // TODO: cnt[i] > 0 时输出
}
`,
    solution: `const s = readline().trim();
const cnt = new Array(26).fill(0);
for (const ch of s) cnt[ch.charCodeAt(0) - 97]++;
for (let i = 0; i < 26; i++) {
  if (cnt[i] > 0) console.log(String.fromCharCode(97 + i) + ':' + cnt[i]);
}
`,
    hints: [
      '建一个长度 26 的计数数组：JS 用 `new Array(26).fill(0)`，Go 用 `var cnt [26]int`，C++ 用 `int cnt[26] = {0}`，Rust 用 `let mut cnt = [0usize; 26]`。',
      '字符转桶号：JS `ch.charCodeAt(0) - 97`，Go/C++ `ch - \'a\'`，Rust `ch as usize - \'a\' as usize`。',
      '输出循环 `for i in 0..26`，`cnt[i] > 0` 才输出；字母用 `String.fromCharCode(97 + i)`（JS）/ `fmt.Printf("%c", \'a\'+i)`（Go）/ `char(\'a\'+i)`（C++）还原，格式 `字母:次数`。',
    ],
    tests: [
      { name: '样例：hello', stdin: 'hello\n', expected: 'e:1\nh:1\nl:2\no:1' },
      { name: '样例：banana', stdin: 'banana\n', expected: 'a:3\nb:1\nn:2' },
      { name: '隐藏：单一字母', stdin: 'zzz\n', expected: 'z:3', hidden: true },
      { name: '隐藏：两两成对', stdin: 'abcabc\n', expected: 'a:2\nb:2\nc:2', hidden: true },
      { name: '隐藏：全字母句', stdin: 'thequickbrownfoxjumpsoverthelazydog\n', expected: 'a:1\nb:1\nc:1\nd:1\ne:3\nf:1\ng:1\nh:2\ni:1\nj:1\nk:1\nl:1\nm:1\nn:1\no:4\np:1\nq:1\nr:2\ns:1\nt:2\nu:2\nv:1\nw:1\nx:1\ny:1\nz:1', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const s = readline().trim();
const cnt = new Array(26).fill(0);

// TODO 1: 遍历 s，cnt[ch.charCodeAt(0) - 97]++
// TODO 2: 按 a~z 顺序输出出现过的字母，格式为 字母:次数

for (let i = 0; i < 26; i++) {
  // TODO: cnt[i] > 0 时输出
}
`,
        go: `package main

import "fmt"

func main() {
	var s string
	fmt.Scan(&s)
	var cnt [26]int

	// TODO 1: for _, ch := range s { cnt[ch-'a']++ }
	// TODO 2: 按 a~z 顺序输出 cnt[i] > 0 的字母，格式 %c:%d
	for i := 0; i < 26; i++ {
		if cnt[i] > 0 {
			// TODO: 输出字母和次数
		}
	}
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let s = line.trim();
    let mut cnt = [0usize; 26];

    // TODO 1: for ch in s.chars() { cnt[ch as usize - 'a' as usize] += 1; }
    // TODO 2: 按 a~z 顺序输出 cnt[i] > 0 的字母，格式 字母:次数
    for i in 0..26 {
        if cnt[i] > 0 {
            println!("{}", cnt[i]); // 占位：补上字母部分
        }
    }
}
`,
        cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    int cnt[26] = {0};

    // TODO 1: 遍历 s 的每个字符 ch，cnt[ch - 'a']++
    // TODO 2: 按 a~z 顺序输出 cnt[i] > 0 的字母
    for (int i = 0; i < 26; i++) {
        if (cnt[i] > 0) {
            // TODO: 输出 char('a' + i) << ':' << cnt[i]
        }
    }
    return 0;
}
`,
      },
      solutions: {
        javascript: `const s = readline().trim();
const cnt = new Array(26).fill(0);
for (const ch of s) cnt[ch.charCodeAt(0) - 97]++;
for (let i = 0; i < 26; i++) {
  if (cnt[i] > 0) console.log(String.fromCharCode(97 + i) + ':' + cnt[i]);
}
`,
        go: `package main

import "fmt"

func main() {
	var s string
	fmt.Scan(&s)
	var cnt [26]int
	for _, ch := range s {
		cnt[ch-'a']++
	}
	for i := 0; i < 26; i++ {
		if cnt[i] > 0 {
			fmt.Printf("%c:%d\\n", 'a'+i, cnt[i])
		}
	}
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let s = line.trim();
    let mut cnt = [0usize; 26];
    for ch in s.chars() {
        cnt[ch as usize - 'a' as usize] += 1;
    }
    for i in 0..26 {
        if cnt[i] > 0 {
            println!("{}:{}", ('a' as u8 + i as u8) as char, cnt[i]);
        }
    }
}
`,
        cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    int cnt[26] = {0};
    for (char ch : s) cnt[ch - 'a']++;
    for (int i = 0; i < 26; i++) {
        if (cnt[i] > 0) cout << char('a' + i) << ':' << cnt[i] << "\\n";
    }
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-basic-6',
    lang: 'algo',
    module: 'basic',
    order: 6,
    title: '对撞双指针：回文判断',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握对撞双指针：l、r 从两端向中间收拢',
      '理解循环条件 l < r 的收敛逻辑',
      '严格输出 Yes / No 的大小写',
    ],
    brief: `## 两头往中间走

判断回文，笨办法是反转字符串再比较（要 O(n) 额外空间）；**对撞双指针**原地解决：

\`\`\`text
l = 0, r = len-1
while l < r:
    若 s[l] ≠ s[r] → 不是回文
    l++, r--        // 向中间收拢
\`\`\`

先看上方动画：两个指针像拉链一样向中间合拢，每一步验证一对字符，任何一对不等立即判负；全程相等（或指针相遇）就是回文。时间 O(n)、空间 O(1)。

为什么条件是 \`l < r\` 而不是 \`l <= r\`？奇数长度时中间那个字符自己跟自己比，永远相等，不用查；偶数长度时两指针恰好相遇。两种情况都自然收敛。

> ⚠️ 输出严格是 \`Yes\` / \`No\`（首字母大写）—— 判题逐字符比对，大小写错一个都不行。单字符、"aba" 这类边界记得心里过一遍。`,
    task: `## 任务：镜像裁判

读入一个不含空格的字符串（仅由字母和数字组成，长度 1~1000），判断它是不是回文（正读反读完全一样）。

**输入**：一行一个字符串

**输出**：一行，\`Yes\` 或 \`No\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`level\` | \`Yes\` |
| \`hello\` | \`No\` |
| \`a\` | \`Yes\`（单字符天然是回文） |

数字组成的串（如 \`12321\`）同样要能正确判断。`,
    starter: `const s = readline().trim();

// TODO 1: 定义 l = 0、r = s.length - 1，ok = true
// TODO 2: while (l < r)：s[l] 与 s[r] 不等则 ok = false 并 break，否则 l++、r--
// TODO 3: 输出 ok ? "Yes" : "No"

console.log(s); // 占位，替换为判断结果
`,
    solution: `const s = readline().trim();
let l = 0, r = s.length - 1;
let ok = true;
while (l < r) {
  if (s[l] !== s[r]) { ok = false; break; }
  l++; r--;
}
console.log(ok ? 'Yes' : 'No');
`,
    hints: [
      '双指针从两端开始：`let l = 0, r = s.length - 1;`，循环条件 `while (l < r)`。',
      '循环体里比较 `s[l] !== s[r]`：不等就标记 ok = false 并 break；相等则 `l++`、`r--` 继续收拢。',
      '最后 `console.log(ok ? "Yes" : "No")`。Rust 建议先把字符串 `chars().collect()` 成 `Vec<char>` 再按下标比较；Go/C++ 直接按下标取字符即可。',
    ],
    tests: [
      { name: '样例：level', stdin: 'level\n', expected: 'Yes' },
      { name: '样例：hello', stdin: 'hello\n', expected: 'No' },
      { name: '隐藏：单字符', stdin: 'a\n', expected: 'Yes', hidden: true },
      { name: '隐藏：数字回文', stdin: '12321\n', expected: 'Yes', hidden: true },
      { name: '隐藏：偶数长度回文', stdin: 'abba\n', expected: 'Yes', hidden: true },
      { name: '隐藏：两字符', stdin: 'ab\n', expected: 'No', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const s = readline().trim();

// TODO 1: 定义 l = 0、r = s.length - 1，ok = true
// TODO 2: while (l < r)：s[l] 与 s[r] 不等则 ok = false 并 break，否则 l++、r--
// TODO 3: 输出 ok ? "Yes" : "No"

console.log(s); // 占位，替换为判断结果
`,
        go: `package main

import "fmt"

func main() {
	var s string
	fmt.Scan(&s)

	ok := true
	// TODO 1: 双指针 l, r := 0, len(s)-1，循环条件 l < r
	// TODO 2: s[l] != s[r] 时置 ok = false 并 break，否则 l++、r-- 向中间收拢

	if ok {
		fmt.Println("Yes")
	} else {
		fmt.Println("No")
	}
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let s: Vec<char> = line.trim().chars().collect();

    let mut ok = true;
    // TODO 1: 双指针 l = 0、r = s.len() - 1，循环条件 l < r
    // TODO 2: s[l] != s[r] 时置 ok = false 并 break，否则 l += 1、r -= 1

    println!("{}", if ok { "Yes" } else { "No" });
}
`,
        cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;

    bool ok = true;
    // TODO 1: 双指针 l = 0、r = s.size() - 1，循环条件 l < r
    // TODO 2: s[l] != s[r] 时置 ok = false 并 break，否则 l++、r--

    cout << (ok ? "Yes" : "No") << "\\n";
    return 0;
}
`,
      },
      solutions: {
        javascript: `const s = readline().trim();
let l = 0, r = s.length - 1;
let ok = true;
while (l < r) {
  if (s[l] !== s[r]) { ok = false; break; }
  l++; r--;
}
console.log(ok ? 'Yes' : 'No');
`,
        go: `package main

import "fmt"

func main() {
	var s string
	fmt.Scan(&s)
	ok := true
	for l, r := 0, len(s)-1; l < r; l, r = l+1, r-1 {
		if s[l] != s[r] {
			ok = false
			break
		}
	}
	if ok {
		fmt.Println("Yes")
	} else {
		fmt.Println("No")
	}
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let s: Vec<char> = line.trim().chars().collect();
    let mut l = 0usize;
    let mut r = s.len().saturating_sub(1);
    let mut ok = true;
    while l < r {
        if s[l] != s[r] {
            ok = false;
            break;
        }
        l += 1;
        r -= 1;
    }
    println!("{}", if ok { "Yes" } else { "No" });
}
`,
        cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    int l = 0, r = (int)s.size() - 1;
    bool ok = true;
    while (l < r) {
        if (s[l] != s[r]) { ok = false; break; }
        l++; r--;
    }
    cout << (ok ? "Yes" : "No") << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'two-pointer' },
  },
  {
    id: 'algo-basic-7',
    lang: 'algo',
    module: 'basic',
    order: 7,
    title: '滑动窗口：定长最大和',
    difficulty: 2,
    xp: 25,
    goals: [
      '理解滑动窗口"加新减旧"的增量维护思想',
      '把 O(n·k) 的暴力优化为 O(n)',
      '用第一个窗口的正确和初始化 best',
    ],
    brief: `## 会滑动的窗口

求"长度恰好为 k 的连续子数组的最大和"，暴力做法是每个窗口都重新求和，O(n·k)。**滑动窗口**利用一个观察：相邻窗口只差一头一尾两个元素 —— 右滑一格 = 加上新进来的、减去滑出去的：

\`\`\`text
sum = a[0] + a[1] + ... + a[k-1]   // 第一个窗口
每右移一格：sum += a[i] - a[i-k]    // 加新减旧
\`\`\`

先看上方动画，注意窗口右移时"加新减旧"的一步。这样每个元素只进出窗口各一次，整体 O(n)。

> ⚠️ 两个坑：① best 的初值必须是**第一个窗口的真实和**，不能拍脑袋设 0 —— 数组可能全负，最大和也是负的；② 更新 best 要在 sum 更新**之后**。这个"维护增量"的思想与前缀和一脉相承：都在避免重复计算。`,
    task: `## 任务：定长最大和

**输入**：
- 第 1 行：n 和 k（1 ≤ k ≤ n ≤ 10⁵）
- 第 2 行：n 个整数（绝对值 ≤ 10⁹）

**输出**：一行，长度为 k 的连续子数组的最大和

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5 2\`<br>\`2 1 5 1 3\` | \`6\`（窗口 [5, 1]） |
| \`1 1\`<br>\`42\` | \`42\` |

k = n 时整个数组就是唯一窗口；数组可能全为负数，答案也可能为负。`,
    starter: `const [n, k] = readInts();
const a = readInts();

// TODO 1: 求第一个窗口 a[0..k-1] 的和，赋给 sum 和 best
// TODO 2: 从 i = k 开始右滑：sum += a[i] - a[i-k]，更新 best
// TODO 3: 输出 best

console.log(a[0]); // 占位，替换为答案
`,
    solution: `const [n, k] = readInts();
const a = readInts();
let sum = 0;
for (let i = 0; i < k; i++) sum += a[i];
let best = sum;
for (let i = k; i < n; i++) {
  sum += a[i] - a[i - k];
  if (sum > best) best = sum;
}
console.log(best);
`,
    hints: [
      '第一步：老老实实求出窗口 [0..k-1] 的和，同时赋给 sum 和 best。',
      '然后 `for (let i = k; i < n; i++)`，每次 `sum += a[i] - a[i-k]`（进一个出一个），再 `if (sum > best) best = sum`。',
      'JS 全程用 Number 精度足够；Go/Rust/C++ 记得用 64 位整数（n 个 10⁹ 相加可达 10¹⁴）。最后 `console.log(best)`。',
    ],
    tests: [
      { name: '样例：k=2', stdin: '5 2\n2 1 5 1 3\n', expected: '6' },
      { name: '样例：单元素', stdin: '1 1\n42\n', expected: '42' },
      { name: '隐藏：负数窗口', stdin: '5 3\n-2 1 -3 4 -1\n', expected: '2', hidden: true },
      { name: '隐藏：k=4', stdin: '6 4\n1 -2 3 4 -5 6\n', expected: '8', hidden: true },
      { name: '隐藏：全数组一个窗口', stdin: '5 5\n3 3 3 3 3\n', expected: '15', hidden: true },
      { name: '隐藏：全负数组 k=1', stdin: '5 1\n-9 -3 -7 -1 -5\n', expected: '-1', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const [n, k] = readInts();
const a = readInts();

// TODO 1: 求第一个窗口 a[0..k-1] 的和，赋给 sum 和 best
// TODO 2: 从 i = k 开始右滑：sum += a[i] - a[i-k]，更新 best
// TODO 3: 输出 best

console.log(a[0]); // 占位，替换为答案
`,
        go: `package main

import "fmt"

func main() {
	var n, k int
	fmt.Scan(&n, &k)
	a := make([]int64, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&a[i])
	}

	var sum int64
	// TODO 1: 先求第一个窗口 a[0..k-1] 的和，best = sum
	// TODO 2: 从 i = k 开始：sum += a[i] - a[i-k]，更新 best
	// TODO 3: 输出 best
	fmt.Println(sum) // 占位
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut it = line.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let k: usize = it.next().unwrap().parse().unwrap();

    let mut line2 = String::new();
    stdin().read_line(&mut line2).unwrap();
    let a: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: 先求 a[0..k] 的和，赋给 sum 和 best（提示：a[..k].iter().sum()）
    // TODO 2: 从 i = k 开始：sum += a[i] - a[i - k]，更新 best
    // TODO 3: 输出 best
    println!("{}", a[0]); // 占位，替换为答案
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    long long sum = 0;
    // TODO 1: 先求 a[0..k-1] 的和，best = sum
    // TODO 2: 从 i = k 开始：sum += a[i] - a[i-k]，更新 best
    // TODO 3: 输出 best
    cout << sum << "\\n"; // 占位
    return 0;
}
`,
      },
      solutions: {
        javascript: `const [n, k] = readInts();
const a = readInts();
let sum = 0;
for (let i = 0; i < k; i++) sum += a[i];
let best = sum;
for (let i = k; i < n; i++) {
  sum += a[i] - a[i - k];
  if (sum > best) best = sum;
}
console.log(best);
`,
        go: `package main

import "fmt"

func main() {
	var n, k int
	fmt.Scan(&n, &k)
	a := make([]int64, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&a[i])
	}
	var sum int64
	for i := 0; i < k; i++ {
		sum += a[i]
	}
	best := sum
	for i := k; i < n; i++ {
		sum += a[i] - a[i-k]
		if sum > best {
			best = sum
		}
	}
	fmt.Println(best)
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let mut it = line.split_whitespace();
    let n: usize = it.next().unwrap().parse().unwrap();
    let k: usize = it.next().unwrap().parse().unwrap();

    let mut line2 = String::new();
    stdin().read_line(&mut line2).unwrap();
    let a: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let mut sum: i64 = a[..k].iter().sum();
    let mut best = sum;
    for i in k..n {
        sum += a[i] - a[i - k];
        if sum > best {
            best = sum;
        }
    }
    println!("{}", best);
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    long long sum = 0;
    for (int i = 0; i < k; i++) sum += a[i];
    long long best = sum;
    for (int i = k; i < n; i++) {
        sum += a[i] - a[i - k];
        if (sum > best) best = sum;
    }
    cout << best << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'sliding-window' },
  },
  {
    id: 'algo-basic-8',
    lang: 'algo',
    module: 'basic',
    order: 8,
    title: '异或：孤立的数',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握异或三条性质：x^x=0、x^0=x、交换结合律',
      '学会"全数组异或"找唯一出现一次的数',
      '体会 O(n) 时间、O(1) 空间的优雅解法',
    ],
    brief: `## 异或的三条神技

异或 \`^\`：相同为 0，不同为 1。它有三条黄金性质：

\`\`\`text
x ^ x = 0        // 自己抵消自己
x ^ 0 = x        // 0 是"透明人"
交换律、结合律     // 运算顺序无关紧要
\`\`\`

于是"找一个只出现一次的数"变得惊人地简单：**把所有数全部异或起来**。成对出现的数互相抵消归零，最后只剩那个孤立的数 —— 而且顺序随便排。时间 O(n)、空间 O(1)，比哈希计数、排序都优雅。

以 \`1 2 3 2 1\` 为例：(1^1) ^ (2^2) ^ 3 = 0 ^ 0 ^ 3 = 3。

> ⚠️ JS 的 \`^\` 按 32 位整数运算，本题数据范围 ±10⁹ 内没有问题；负数按补码同样成立（-3 ^ -3 = 0）。若数据会超出 32 位，Go/Rust/C++ 用 64 位类型即可，JS 就得换 BigInt 了。`,
    task: `## 任务：揪出孤立的数

数组里有 n 个整数（n 为**奇数**），其中恰好一个数只出现一次，其余每个数都恰好出现两次。找出那个"孤立的数"。

**输入**：
- 第 1 行：n（1 ≤ n < 2×10⁵，保证是奇数）
- 第 2 行：n 个整数（绝对值 ≤ 10⁹）

**输出**：一行，只出现一次的那个数

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5\`<br>\`1 2 3 2 1\` | \`3\` |
| \`1\`<br>\`99\` | \`99\` |

用异或解：一遍扫完、零额外空间。n 只有 1 时它就是答案本身。`,
    starter: `const n = Number(readline());
const a = readInts();

// TODO 1: 回忆异或三性质：x ^ x = 0，x ^ 0 = x，顺序无关
// TODO 2: 把所有数异或到一个变量里（初始 0）
// TODO 3: 输出结果

console.log(a[0]); // 占位，替换为答案
`,
    solution: `const n = Number(readline());
const a = readInts();
let x = 0;
for (let i = 0; i < n; i++) x ^= a[i];
console.log(x);
`,
    hints: [
      '回顾三性质：x^x=0、x^0=x、顺序无关。把全部数字异或在一起，成对的都抵消，会剩下什么？',
      'JS：`let x = 0; for (const v of a) x ^= v;`，最后输出 x。',
      'Go/Rust/C++ 同理：用一个 64 位变量从头异或到尾。成对数抵消，x 最终就是孤立数 —— n=1 时循环一次直接得到答案。',
    ],
    tests: [
      { name: '样例：5 个数', stdin: '5\n1 2 3 2 1\n', expected: '3' },
      { name: '样例：只有它自己', stdin: '1\n99\n', expected: '99' },
      { name: '隐藏：7 个数', stdin: '7\n4 4 7 9 7 8 8\n', expected: '9', hidden: true },
      { name: '隐藏：负数参与', stdin: '5\n-3 5 -3 5 42\n', expected: '42', hidden: true },
      { name: '隐藏：大数与零', stdin: '9\n1000000000 1000000000 123456789 123456789 0 0 7 7 555555555\n', expected: '555555555', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const n = Number(readline());
const a = readInts();

// TODO 1: 回忆异或三性质：x ^ x = 0，x ^ 0 = x，顺序无关
// TODO 2: 把所有数异或到一个变量里（初始 0）
// TODO 3: 输出结果

console.log(a[0]); // 占位，替换为答案
`,
        go: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	x := int64(0)
	for i := 0; i < n; i++ {
		var v int64
		fmt.Scan(&v)
		// TODO: x ^= v
	}
	fmt.Println(x) // 异或完成后就是答案
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

    let mut x = 0i64;
    for i in 0..n {
        // TODO: x ^= a[i];
    }
    println!("{}", x);
}
`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long x = 0, v;
    for (int i = 0; i < n; i++) {
        cin >> v;
        // TODO: x ^= v;
    }
    cout << x << "\\n";
    return 0;
}
`,
      },
      solutions: {
        javascript: `const n = Number(readline());
const a = readInts();
let x = 0;
for (let i = 0; i < n; i++) x ^= a[i];
console.log(x);
`,
        go: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	x := int64(0)
	for i := 0; i < n; i++ {
		var v int64
		fmt.Scan(&v)
		x ^= v
	}
	fmt.Println(x)
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

    let mut x = 0i64;
    for i in 0..n {
        x ^= a[i];
    }
    println!("{}", x);
}
`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long x = 0, v;
    for (int i = 0; i < n; i++) {
        cin >> v;
        x ^= v;
    }
    cout << x << "\\n";
    return 0;
}
`,
      },
    },
  },
];

