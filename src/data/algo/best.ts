import type { Level } from '@/types';

/** 算法课 · 第 5 章：行业最佳实践 —— 工程与竞赛规范（5 关） */
export const ALGO_BEST: Level[] = [
  {
    id: 'algo-best-1',
    lang: 'algo',
    module: 'best',
    order: 1,
    title: '复杂度选型',
    difficulty: 2,
    xp: 25,
    goals: [
      '建立"1 秒 1 亿次"的估算法则',
      '熟记四种常见复杂度能承受的数据规模',
      '会用浮点/64 位比较避免估算时溢出',
    ],
    brief: `## 复杂度选型：1 秒 1 亿次

评测机每秒大约能执行 **1 亿次（1e8）** 次基本操作。拿到题先估算：**操作数 = 复杂度 × 数据规模，≤ 1e8 才敢交**，否则必须换算法。

常见对照表（n 为数据规模）：

| 复杂度 | 代表算法 | n 的安全上限（约） |
| --- | --- | --- |
| O(n²) | 冒泡 / 双重循环 | 1e4 |
| O(n log n) | 归并排序 / 堆 | 1e6 ~ 1e7 |
| O(n) | 计数 / 一遍扫描 | 1e8 |
| O(2ⁿ) | 子集枚举 | 24 ~ 26 |

感受一下差距：n = 1e4 时 n² 恰好 1e8，卡在生死线上；同样的 n 交给 O(n log n) 只需约 1.3e5 次，快了三个数量级。指数复杂度最危险——n 每加 1，代价直接翻倍，n = 30 就已越线。

> 💡 估算不只救 TLE：当某档复杂度怎么都过不了，说明该**换思路**（哈希、二分、前缀和…），而不是微调常数硬扛。`,
    task: `## 任务：超时裁判

你是评测机。给定数据规模 n 和算法编号，输出判决。

**输入**：两行
- 第一行：整数 n（1 ≤ n ≤ 1e9）
- 第二行：算法编号 id（1~4）

**输出**：一行，估算操作数 ≤ 1e8 输出 \`AC\`，否则输出 \`TLE\`

**操作数估算规则**（严格按此计算）：
- id=1 冒泡：n²
- id=2 归并：n × log₂n
- id=3 计数：n
- id=4 子集枚举：2ⁿ

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`1000\`<br>\`1\` | \`AC\` | 1e6 ≤ 1e8 |
| \`100000\`<br>\`1\` | \`TLE\` | 1e10 远超上限 |
| \`30\`<br>\`4\` | \`TLE\` | 2³⁰ ≈ 1.07e9 |

注意：n 可达 1e9，n² 高达 1e18、2ⁿ 更是天文数字——用 64 位整数或浮点数计算比较，别用 32 位（会溢出成负数）。恰好等于 1e8 也算 AC（≤ 取等）。`,
    starter: '',
    solution: '',
    algo: {
      starters: {
        javascript: `// 沙箱已注入：readline() 读一行字符串；readInts() 读一行并拆成数字数组
// TODO 1: 用 readInts() 读入 n（第一行）和算法编号 id（第二行）
// TODO 2: 按 id 计算操作数 ops：
//   1 → n*n    2 → n*Math.log2(n)    3 → n    4 → Math.pow(2, n)
// TODO 3: ops <= 1e8 时 console.log('AC')，否则 'TLE'
`,
        go: `package main

import (
	"bufio"
	"os"
	"strconv"
)

var sc = bufio.NewScanner(os.Stdin)

// nextInt：从 stdin 逐词读取一个整数（按空白切分，跨行也安全）
func nextInt() int {
	sc.Scan()
	n, _ := strconv.Atoi(sc.Text())
	return n
}

func main() {
	sc.Split(bufio.ScanWords)
	// TODO 1: 读入 n 与算法编号 id（用 nextInt()）
	// TODO 2: 按 id 计算操作数 ops（建议用 float64，防溢出）：
	//   1 → n*n    2 → n*log2(n)    3 → n    4 → 2^n
	// TODO 3: ops <= 1e8 输出 "AC"，否则 "TLE"
}
`,
        rust: `use std::io::Read;

fn main() {
    // 一次性读入全部输入，再按空白逐词取用（跨行也安全）
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    // TODO 1: 读 n（f64）与 id：
    //   let n: f64 = it.next().unwrap().parse().unwrap();
    // TODO 2: 按 id 计算操作数 ops（f64）
    // TODO 3: ops <= 1e8 输出 "AC"，否则 "TLE"
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // TODO 1: 用 cin 读入 n（建议 double）与算法编号 id
    // TODO 2: 按 id 计算操作数 ops（double，防溢出）：
    //   1 → n*n    2 → n*log2(n)    3 → n    4 → pow(2.0, n)
    // TODO 3: ops <= 1e8 输出 "AC"，否则 "TLE"
    return 0;
}
`,
      },
      solutions: {
        javascript: `const n = readInts()[0];
const id = readInts()[0];

// 操作数可能高达 1e18 甚至无穷大，用浮点数存（溢出成 Infinity 也照样 > 1e8）
let ops;
if (id === 1) ops = n * n;
else if (id === 2) ops = n * Math.log2(n);
else if (id === 3) ops = n;
else ops = Math.pow(2, n);

console.log(ops <= 1e8 ? 'AC' : 'TLE');
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"strconv"
)

var sc = bufio.NewScanner(os.Stdin)

func nextInt() int {
	sc.Scan()
	n, _ := strconv.Atoi(sc.Text())
	return n
}

func main() {
	sc.Split(bufio.ScanWords)
	n := float64(nextInt())
	id := nextInt()

	var ops float64
	switch id {
	case 1:
		ops = n * n
	case 2:
		ops = n * math.Log2(n)
	case 3:
		ops = n
	default:
		ops = math.Pow(2, n) // 溢出得 +Inf，仍然 > 1e8，无需特判
	}

	if ops <= 1e8 {
		fmt.Println("AC")
	} else {
		fmt.Println("TLE")
	}
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    let n: f64 = it.next().unwrap().parse().unwrap();
    let id: i32 = it.next().unwrap().parse().unwrap();

    let ops = match id {
        1 => n * n,
        2 => n * n.log2(),
        3 => n,
        _ => n.exp2(), // 溢出得 inf，仍然 > 1e8
    };

    println!("{}", if ops <= 1e8 { "AC" } else { "TLE" });
}
`,
        cpp: `#include <bits/stdc++.h>
#include <cmath>
using namespace std;

int main() {
    double n;
    int id;
    cin >> n >> id;

    double ops;
    if (id == 1) ops = n * n;
    else if (id == 2) ops = n * log2(n);
    else if (id == 3) ops = n;
    else ops = pow(2.0, n); // 溢出得 inf，仍然 > 1e8

    cout << (ops <= 1e8 ? "AC" : "TLE") << "\\n";
    return 0;
}
`,
      },
    },
    hints: [
      '这就是一道分支题：先按编号算操作数，再和 1e8 比较。但操作数可能是天文数字（n² 达 1e18、2ⁿ 更大），必须用浮点数或 64 位整数，32 位会溢出成负数导致误判 AC。',
      'log₂ 与 2ⁿ 都有内置函数：JS 用 Math.log2 / Math.pow，Go 用 math.Log2 / math.Pow，Rust 用 f64 的 log2 / exp2，C++ 用 log2() / pow()。浮点溢出会得到 +Inf，+Inf > 1e8 自然输出 TLE，不需要特判。',
      '骨架：id==1 时 ops=n*n，id==2 时 ops=n*log2(n)，id==3 时 ops=n，id==4 时 ops=2^n；最后 ops <= 1e8 输出 AC 否则 TLE。注意恰好等于 1e8 也算 AC（比较用 <=）。',
    ],
    tests: [
      { name: '样例：O(n²) 小规模', stdin: '1000\n1\n', expected: 'AC' },
      { name: '样例：O(n²) 大规模', stdin: '100000\n1\n', expected: 'TLE' },
      { name: '样例：指数枚举 n=30', stdin: '30\n4\n', expected: 'TLE' },
      { name: '隐藏：n² 恰好 1e8 的边界', stdin: '10000\n1\n', expected: 'AC', hidden: true },
      { name: '隐藏：O(n log n) 百万级', stdin: '1000000\n2\n', expected: 'AC', hidden: true },
      { name: '隐藏：线性计数卡满上限', stdin: '100000000\n3\n', expected: 'AC', hidden: true },
    ],
  },
  {
    id: 'algo-best-2',
    lang: 'algo',
    module: 'best',
    order: 2,
    title: '边界测试设计',
    difficulty: 3,
    xp: 30,
    goals: [
      '养成"先列边界清单再动手"的习惯',
      '一次扫描同时维护最大与次大',
      '用极小值初始化而非 0，规避负数陷阱',
    ],
    brief: `## 先想边界，再写代码

工程与竞赛里一半的 WA 不是算法错，而是**边界没想清**。动手前先列一份"边界清单"：

- **单元素**：n=1 时根本没有"第二大"，本题约定输出 -1——读题里的每一句话，特殊约定就是隐藏测试点。
- **重复值**：本题保证互不相同；若允许重复，"第二大"是严格次大还是不同值次大？需求歧义要提前澄清，而不是写完再猜。
- **已有序**：升序 / 降序输入，会不会骗过你"只看前两个元素"的取巧写法？
- **含极值**：±1e9 会撑爆 32 位吗？初值用"负无穷"（-Infinity / i64::MIN / LLONG_MIN）而不是 0，否则全负数组直接出错。

实现上，一次扫描维护两个变量即可：first 存当前最大，second 存当前次大。新元素比 first 大就顺次下压，否则比 second 大才更新 second。

> 💡 写完先脑跑一遍边界清单，再交评测——这 30 秒比改 10 遍划算。`,
    task: `## 任务：第二大的数

输出 n 个**互不相同**整数中第二大的数；n=1 时输出 -1。

**输入**：
- 第一行：n（1 ≤ n ≤ 100）
- 第二行：n 个互不相同的整数（绝对值 ≤ 1e9）

**输出**：一行，第二大的数；n=1 输出 \`-1\`

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`5\`<br>\`3 1 4 7 5\` | \`5\` | 最大 7，次大 5 |
| \`1\`<br>\`42\` | \`-1\` | 单元素边界 |
| \`3\`<br>\`-5 -1 -9\` | \`-5\` | 全负数：最大 -1，次大 -5 |

先在心里跑一遍边界清单：n=1？全负数？最大值排在第一位？然后再动手。`,
    starter: '',
    solution: '',
    algo: {
      starters: {
        javascript: `// 沙箱已注入：readline() 读一行字符串；readInts() 读一行并拆成数字数组
// TODO 1: 读入 n，再读入 n 个整数
// TODO 2: 一遍扫描，用 first / second 维护最大与次大
//   初值用 -Infinity（别用 0！想想全负数会怎样）
// TODO 3: n === 1 时输出 -1，否则输出 second
`,
        go: `package main

import (
	"bufio"
	"os"
	"strconv"
)

var sc = bufio.NewScanner(os.Stdin)

func nextInt() int {
	sc.Scan()
	n, _ := strconv.Atoi(sc.Text())
	return n
}

func main() {
	sc.Split(bufio.ScanWords)
	// TODO 1: 读入 n
	// TODO 2: 循环读 n 个数，维护 first（最大）与 second（次大）
	//   初值用 math.MinInt64（别用 0！想想全负数会怎样）
	// TODO 3: n == 1 输出 -1，否则输出 second
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    // TODO 1: 读入 n（usize），循环读 n 个 i64
    // TODO 2: 用 first / second 维护最大与次大，初值 i64::MIN
    // TODO 3: n == 1 输出 "-1"，否则输出 second
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // TODO 1: 读入 n，循环读 n 个 long long
    // TODO 2: 用 first / second 维护最大与次大，初值 LLONG_MIN
    // TODO 3: n == 1 输出 -1，否则输出 second
    return 0;
}
`,
      },
      solutions: {
        javascript: `const n = readInts()[0];
const a = readInts();

// 单变量职责清晰：first=当前最大，second=当前次大
let first = -Infinity, second = -Infinity;
for (const x of a) {
  if (x > first) {
    second = first; // 旧最大"下压"成次大
    first = x;
  } else if (x > second) {
    second = x;
  }
}

if (n === 1) console.log(-1);
else console.log(second); // n>=2 且互不相同时，second 必为真实值
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"strconv"
)

var sc = bufio.NewScanner(os.Stdin)

func nextInt() int {
	sc.Scan()
	n, _ := strconv.Atoi(sc.Text())
	return n
}

func main() {
	sc.Split(bufio.ScanWords)
	n := nextInt()

	first, second := math.MinInt64, math.MinInt64
	for i := 0; i < n; i++ {
		x := nextInt()
		if x > first {
			second = first
			first = x
		} else if x > second {
			second = x
		}
	}

	if n == 1 {
		fmt.Println(-1)
	} else {
		fmt.Println(second)
	}
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    let n: usize = it.next().unwrap().parse().unwrap();
    let mut first = i64::MIN;
    let mut second = i64::MIN;
    for _ in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        if x > first {
            second = first;
            first = x;
        } else if x > second {
            second = x;
        }
    }

    if n == 1 {
        println!("-1");
    } else {
        println!("{}", second);
    }
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;

    long long first = LLONG_MIN, second = LLONG_MIN;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (x > first) {
            second = first;
            first = x;
        } else if (x > second) {
            second = x;
        }
    }

    if (n == 1) cout << -1 << "\\n";
    else cout << second << "\\n";
    return 0;
}
`,
      },
    },
    hints: [
      '一遍循环两个变量：first 存当前最大，second 存当前次大，初值都用"负无穷"（JS 的 -Infinity、Go 的 math.MinInt64、Rust 的 i64::MIN、C++ 的 LLONG_MIN）。初值写 0 的话，全负数组会输出 0。',
      '更新规则：x > first 时 second 先接住旧的 first，first 再让位给 x；否则 x > second 时才更新 second。两个 if 的顺序不能反，否则次大值会被漏掉。',
      '输出前先判 n==1 直接输出 -1；否则输出 second（n≥2 且互不相同时它一定是真实的次大值）。参考：if x > first { second = first; first = x } else if x > second { second = x }。',
    ],
    tests: [
      { name: '样例：一般情况', stdin: '5\n3 1 4 7 5\n', expected: '5' },
      { name: '样例：单元素边界', stdin: '1\n42\n', expected: '-1' },
      { name: '样例：全负数', stdin: '3\n-5 -1 -9\n', expected: '-5' },
      { name: '隐藏：恰好两个元素', stdin: '2\n7 3\n', expected: '3', hidden: true },
      { name: '隐藏：升序输入', stdin: '4\n10 20 30 40\n', expected: '30', hidden: true },
      { name: '隐藏：含 ±1e9 极值', stdin: '6\n1000000000 -1000000000 0 999999999 1 -1\n', expected: '999999999', hidden: true },
    ],
  },
  {
    id: 'algo-best-3',
    lang: 'algo',
    module: 'best',
    order: 3,
    title: '可读性重构',
    difficulty: 3,
    xp: 30,
    goals: [
      '用好命名消除"猜变量"成本',
      '把可复用的几何判断提取成函数',
      '注释写意图而非复述代码',
    ],
    brief: `## 算法代码也是给人读的

同样的矩形交集，先看反面教材：

\`\`\`cpp
int a1,b1,a2,b2,c1,d1,c2,d2; // 哪个是左下？哪个矩形？
cin>>a1>>b1>>a2>>b2>>c1>>d1>>c2>>d2;
long long x=min(a2,c2)-max(a1,c1); // 这行在干嘛？
long long y=min(b2,d2)-max(b1,d1);
cout<<(x<0||y<0?0:x*y);           // 为什么 <0 是 0？
\`\`\`

能跑，但三个月后没人（包括作者自己）看得懂。三个重构动作让它改头换面：

1. **好命名**：\`ax1, ay1, ax2, ay2\`、\`bx1…\` —— 前缀分矩形、后缀分角，一眼定位。
2. **提取函数**：\`overlapLen(lo1, hi1, lo2, hi2)\` 把"两段投影的重叠长度"这个核心几何概念命名出来，main 里只剩两行几何 + 一行面积。
3. **注释意图**：注释写"为什么"（投影不相交时长度取 0），不写"是什么"（复述 min/max 代码）。

数学内核：交集面积 = X 轴重叠宽 × Y 轴重叠高；任一方向重叠 ≤ 0 即不相交，面积 0。相接（共享一条边）的宽或高恰为 0，被公式自然覆盖，**无需特判**。`,
    task: `## 任务：矩形交集面积

输入两个轴对齐矩形 A、B（各给左下角与右上角），输出交集面积；不相交输出 0。

**输入**：两行，每行 4 个整数 \`x1 y1 x2 y2\`（x1 < x2，y1 < y2，绝对值 ≤ 1e4）

**输出**：一行，交集面积

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`0 0 2 3\`<br>\`1 1 3 3\` | \`2\` | 重叠宽 1 × 高 2 |
| \`0 0 1 1\`<br>\`2 2 3 3\` | \`0\` | 完全分离 |
| \`0 0 5 5\`<br>\`1 1 2 2\` | \`1\` | B 完全在 A 内部 |

工程要求：把"投影重叠长度"封装成命名清晰的函数（如 overlapLen），不要把读入、计算、判负全糊在主流程里——本关同时考察代码组织。`,
    starter: '',
    solution: '',
    algo: {
      starters: {
        javascript: `// 沙箱已注入：readline() 读一行字符串；readInts() 读一行并拆成数字数组
// TODO 1: 定义函数 overlapLen(lo1, hi1, lo2, hi2)
//   返回两段投影的重叠长度：max(0, min(hi1,hi2) - max(lo1,lo2))
// TODO 2: 读入两个矩形 A、B（各 4 个数：左下角 + 右上角）
// TODO 3: 宽 = X 轴投影重叠，高 = Y 轴投影重叠，输出 w * h
`,
        go: `package main

import (
	"bufio"
	"os"
	"strconv"
)

var sc = bufio.NewScanner(os.Stdin)

func nextInt() int {
	sc.Scan()
	n, _ := strconv.Atoi(sc.Text())
	return n
}

// TODO 1: 定义 overlapLen(lo1, hi1, lo2, hi2 int) int
//   返回 max(0, min(hi1,hi2) - max(lo1,lo2))

func main() {
	sc.Split(bufio.ScanWords)
	// TODO 2: 读入矩形 A 与 B（各 4 个数）
	// TODO 3: 宽、高分别调用 overlapLen，输出 w * h
}
`,
        rust: `use std::io::Read;

// TODO 1: 定义 overlap_len(lo1, hi1, lo2, hi2) -> i64
//   返回 (hi1.min(hi2) - lo1.max(lo2)).max(0)

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    // TODO 2: 读入矩形 A 与 B（各 4 个 i64）
    // TODO 3: 宽、高分别调用 overlap_len，输出 w * h
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// TODO 1: 定义 overlapLen(lo1, hi1, lo2, hi2)，返回 max(0LL, min(hi1,hi2) - max(lo1,lo2))

int main() {
    // TODO 2: 读入矩形 A 与 B（各 4 个 long long）
    // TODO 3: 宽、高分别调用 overlapLen，输出 w * h
    return 0;
}
`,
      },
      solutions: {
        javascript: `// 意图注释：两段投影 [lo1,hi1] 与 [lo2,hi2] 的公共长度；不相交时为 0（而非负数）
function overlapLen(lo1, hi1, lo2, hi2) {
  return Math.max(0, Math.min(hi1, hi2) - Math.max(lo1, lo2));
}

const A = readInts(); // ax1 ay1 ax2 ay2（左下、右上）
const B = readInts();

const w = overlapLen(A[0], A[2], B[0], B[2]); // X 轴投影重叠 → 交集宽
const h = overlapLen(A[1], A[3], B[1], B[3]); // Y 轴投影重叠 → 交集高
console.log(w * h);
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

var sc = bufio.NewScanner(os.Stdin)

func nextInt() int {
	sc.Scan()
	n, _ := strconv.Atoi(sc.Text())
	return n
}

// overlapLen：两段投影 [lo1,hi1] 与 [lo2,hi2] 的公共长度，不相交时为 0
func overlapLen(lo1, hi1, lo2, hi2 int) int {
	hi := hi1
	if hi2 < hi {
		hi = hi2
	}
	lo := lo1
	if lo2 > lo {
		lo = lo2
	}
	if hi-lo < 0 {
		return 0
	}
	return hi - lo
}

func main() {
	sc.Split(bufio.ScanWords)
	ax1, ay1, ax2, ay2 := nextInt(), nextInt(), nextInt(), nextInt()
	bx1, by1, bx2, by2 := nextInt(), nextInt(), nextInt(), nextInt()

	w := overlapLen(ax1, ax2, bx1, bx2)
	h := overlapLen(ay1, ay2, by1, by2)
	fmt.Println(w * h)
}
`,
        rust: `use std::io::Read;

/// 两段投影 [lo1,hi1] 与 [lo2,hi2] 的公共长度，不相交时为 0
fn overlap_len(lo1: i64, hi1: i64, lo2: i64, hi2: i64) -> i64 {
    (hi1.min(hi2) - lo1.max(lo2)).max(0)
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();
    let mut next = || -> i64 { it.next().unwrap().parse().unwrap() };

    let (ax1, ay1, ax2, ay2) = (next(), next(), next(), next());
    let (bx1, by1, bx2, by2) = (next(), next(), next(), next());

    let w = overlap_len(ax1, ax2, bx1, bx2);
    let h = overlap_len(ay1, ay2, by1, by2);
    println!("{}", w * h);
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

// overlapLen：两段投影 [lo1,hi1] 与 [lo2,hi2] 的公共长度，不相交时为 0
long long overlapLen(long long lo1, long long hi1, long long lo2, long long hi2) {
    return max(0LL, min(hi1, hi2) - max(lo1, lo2));
}

int main() {
    long long ax1, ay1, ax2, ay2, bx1, by1, bx2, by2;
    cin >> ax1 >> ay1 >> ax2 >> ay2;
    cin >> bx1 >> by1 >> bx2 >> by2;

    long long w = overlapLen(ax1, ax2, bx1, bx2); // X 轴投影重叠
    long long h = overlapLen(ay1, ay2, by1, by2); // Y 轴投影重叠
    cout << w * h << "\\n";
    return 0;
}
`,
      },
    },
    hints: [
      '核心公式：X 轴重叠长度 = min(ax2, bx2) - max(ax1, bx1)，结果为负说明投影不相交，取 0；Y 轴同理。面积 = 宽 × 高。分离、包含、相接、全等都被这一个公式自然覆盖。',
      '封装成函数 overlapLen(lo1, hi1, lo2, hi2)，内部一行返回 max(0, min(hi1,hi2) - max(lo1,lo2))；主流程只剩"读入 → 算宽 → 算高 → 相乘输出"四步。',
      '变量命名建议 ax1/ay1/ax2/ay2 与 bx1/…：前缀区分矩形，x1/y1 是左下、x2/y2 是右上。调用时注意传参顺序——宽传 x 坐标对 (A[0],A[2],B[0],B[2])，高传 y 坐标对。',
    ],
    tests: [
      { name: '样例：部分重叠', stdin: '0 0 2 3\n1 1 3 3\n', expected: '2' },
      { name: '样例：完全分离', stdin: '0 0 1 1\n2 2 3 3\n', expected: '0' },
      { name: '样例：包含关系', stdin: '0 0 5 5\n1 1 2 2\n', expected: '1' },
      { name: '隐藏：仅一条边相接', stdin: '0 0 2 2\n2 0 4 2\n', expected: '0', hidden: true },
      { name: '隐藏：负坐标', stdin: '-3 -3 -1 -1\n-2 -2 0 0\n', expected: '1', hidden: true },
      { name: '隐藏：两矩形全等', stdin: '1 2 3 4\n1 2 3 4\n', expected: '4', hidden: true },
    ],
  },
  {
    id: 'algo-best-4',
    lang: 'algo',
    module: 'best',
    order: 4,
    title: '二分模板化',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握左边界 / 右边界两个二分模板与循环不变量',
      '用 lower + upper 组合回答"出现区间"',
      '体会"只改条件、不改骨架"的模板化思维',
    ],
    brief: `## 把二分固化成两个模板

手写二分最容易死在 mid 与边界上。把它固化成两个模板，从此**只改条件、不改骨架**：

**模板一：左边界 —— 第一个 ≥ target 的下标**

\`\`\`
lo = 0, hi = n          // 左闭右开区间 [lo, hi)
while lo < hi:
    mid = lo + (hi - lo) / 2
    if a[mid] >= target: hi = mid   // 答案在 [lo, mid]
    else:                lo = mid + 1 // 答案在 [mid+1, hi)
return lo
\`\`\`

**模板二：右边界 —— 第一个 > target 的下标**：骨架完全相同，只把条件 \`>=\` 换成 \`>\`。

循环不变量：任何时刻，答案（若存在）都在 [lo, hi) 内——\`hi = mid\` 与 \`lo = mid + 1\` 恰好维持它，结束时 lo == hi 即答案。想清楚不变量，就永远不用背"到底减不减一"。

组合使用：target 存在 ⟺ \`lower < n 且 a[lower] == target\`；首次出现 = lower，末次出现 = upper − 1。C++ 的 lower_bound/upper_bound、Go 的 sort.SearchInts、Rust 的 partition_point 都是这两个模板的内置版——但先手写一遍，才真正拥有它。

> ⚠️ mid 写成 \`lo + (hi-lo)/2\` 防大数相加溢出；两个模板都是 O(log n)，比"找到后向两边爬"在大量重复时稳得多。`,
    task: `## 任务：值域定位器

给定升序数组（可能有重复）与 q 个询问，对每个 target 输出它首次与末次出现的下标（0 起）。

**输入**：
- 第一行：n q（1 ≤ n, q ≤ 1e5）
- 第二行：n 个升序整数（绝对值 ≤ 1e9）
- 接下来 q 行：每行一个 target

**输出**：q 行，每行 \`<first> <last>\`；不存在输出 \`-1 -1\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`10 4\`<br>\`1 2 2 2 3 5 5 8 8 9\`<br>\`2\`<br>\`5\`<br>\`8\`<br>\`4\` | \`1 3\`<br>\`5 6\`<br>\`7 8\`<br>\`-1 -1\` |

若数组里有 1e5 个相同的数，"找到再向两边爬"会退化成 O(n)；两个二分模板始终 O(log n)。`,
    starter: '',
    solution: '',
    algo: {
      starters: {
        javascript: `// 沙箱已注入：readline() 读一行字符串；readInts() 读一行并拆成数字数组
// TODO 1: 写模板 lowerBound(a, t)：第一个 >= t 的下标
//   lo=0, hi=a.length；a[mid] >= t 时 hi=mid，否则 lo=mid+1
// TODO 2: 写模板 upperBound(a, t)：第一个 > t 的下标（只改条件）
// TODO 3: 读入 n q 与数组，对 q 个 target：
//   lower === n 或 a[lower] !== t → 输出 "-1 -1"
//   否则输出 first 与 (upper - 1)，每行一个
`,
        go: `package main

import (
	"bufio"
	"os"
	"strconv"
)

var sc = bufio.NewScanner(os.Stdin)

func nextInt() int {
	sc.Scan()
	n, _ := strconv.Atoi(sc.Text())
	return n
}

func main() {
	sc.Split(bufio.ScanWords)
	// TODO 1: 读入 n q 与升序数组 a
	// TODO 2: 对每个 target 用 sort.SearchInts(a, t) 求左边界 lower
	// TODO 3: lower == n 或 a[lower] != t → 输出 "-1 -1"；
	//   否则用 sort.Search 求右边界（第一个 > t 的下标），输出 lower 与 upper-1
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    // TODO 1: 读入 n q 与升序数组 a（Vec<i64>）
    // TODO 2: 对每个 target 用 a.partition_point(|&x| x < t) 求左边界
    // TODO 3: 越界或不等 → "-1 -1"；否则用 partition_point(|&x| x <= t)
    //   求右边界，输出 first 与 last
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // TODO 1: 读入 n q 与升序数组 a（long long）
    // TODO 2: 对每个 target 用 lower_bound 求左边界迭代器 first
    // TODO 3: first == a.end() 或 *first != t → 输出 "-1 -1"；
    //   否则用 upper_bound 求右边界，输出下标区间
    return 0;
}
`,
      },
      solutions: {
        javascript: `// 模板一：左边界 —— 第一个 >= target 的下标（不变量：答案始终在 [lo, hi) 内）
function lowerBound(a, t) {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] >= t) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
// 模板二：右边界 —— 第一个 > target 的下标（骨架同上，只改条件）
function upperBound(a, t) {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] > t) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

const [n, q] = readInts();
const a = readInts();
const lines = [];
for (let i = 0; i < q; i++) {
  const t = readInts()[0];
  const first = lowerBound(a, t);
  if (first === n || a[first] !== t) {
    lines.push('-1 -1');
  } else {
    lines.push(first + ' ' + (upperBound(a, t) - 1));
  }
}
console.log(lines.join('\\n'));
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
)

var sc = bufio.NewScanner(os.Stdin)

func nextInt() int {
	sc.Scan()
	n, _ := strconv.Atoi(sc.Text())
	return n
}

func main() {
	sc.Split(bufio.ScanWords)
	n := nextInt()
	q := nextInt()
	a := make([]int, n)
	for i := 0; i < n; i++ {
		a[i] = nextInt()
	}

	w := bufio.NewWriter(os.Stdout)
	defer w.Flush()
	for i := 0; i < q; i++ {
		t := nextInt()
		lower := sort.SearchInts(a, t) // 左边界：第一个 >= t
		if lower == n || a[lower] != t {
			fmt.Fprintln(w, -1, -1)
		} else {
			upper := sort.Search(n, func(i int) bool { return a[i] > t }) // 右边界
			fmt.Fprintln(w, lower, upper-1)
		}
	}
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    let n: usize = it.next().unwrap().parse().unwrap();
    let q: usize = it.next().unwrap().parse().unwrap();
    let mut a: Vec<i64> = Vec::with_capacity(n);
    for _ in 0..n {
        a.push(it.next().unwrap().parse().unwrap());
    }

    let mut out = String::new();
    for _ in 0..q {
        let t: i64 = it.next().unwrap().parse().unwrap();
        let first = a.partition_point(|&x| x < t); // 左边界：第一个 >= t
        if first == n || a[first] != t {
            out.push_str("-1 -1\\n");
        } else {
            let last = a.partition_point(|&x| x <= t) - 1; // 右边界：第一个 > t 再减一
            out.push_str(&format!("{} {}\\n", first, last));
        }
    }
    print!("{}", out);
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, q;
    cin >> n >> q;
    vector<long long> a(n);
    for (auto& x : a) cin >> x;

    while (q--) {
        long long t;
        cin >> t;
        auto first = lower_bound(a.begin(), a.end(), t); // 左边界：第一个 >= t
        if (first == a.end() || *first != t) {
            cout << -1 << " " << -1 << "\\n";
        } else {
            auto last = upper_bound(a.begin(), a.end(), t); // 右边界：第一个 > t
            cout << (first - a.begin()) << " " << (last - a.begin() - 1) << "\\n";
        }
    }
    return 0;
}
`,
      },
    },
    hints: [
      '先把 lowerBound 写对：lo=0、hi=n（左闭右开），循环条件 lo < hi，a[mid] >= t 时 hi=mid（mid 可能就是答案，不能丢），否则 lo=mid+1。mid 用 lo + (hi-lo)/2 形式防溢出。',
      'upperBound 与 lowerBound 唯一区别：条件从 >= 换成 >。判断存在性：lower < n 且 a[lower] === t；首次下标就是 lower，末次下标是 upper - 1。',
      'q 次询问逐行输出：存在时输出 first 空格 (upper-1)，不存在输出 -1 -1。n、q 都可达 1e5，每个询问必须两次二分（O(log n)），线性扫描会超时。',
    ],
    tests: [
      { name: '样例：重复值与不存在', stdin: '10 4\n1 2 2 2 3 5 5 8 8 9\n2\n5\n8\n4\n', expected: '1 3\n5 6\n7 8\n-1 -1' },
      { name: '样例：单元素数组', stdin: '1 2\n7\n7\n3\n', expected: '0 0\n-1 -1' },
      { name: '隐藏：全部相同', stdin: '6 2\n4 4 4 4 4 4\n4\n5\n', expected: '0 5\n-1 -1', hidden: true },
      { name: '隐藏：负数与首尾', stdin: '4 3\n-5 -5 0 3\n-5\n3\n-6\n', expected: '0 1\n3 3\n-1 -1', hidden: true },
      { name: '隐藏：末尾元素与超界值', stdin: '5 2\n1 3 5 7 9\n9\n10\n', expected: '4 4\n-1 -1', hidden: true },
    ],
  },
  {
    id: 'algo-best-5',
    lang: 'algo',
    module: 'best',
    order: 5,
    title: '对拍思想',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解对拍流程：生成器 + 暴力解 + 优化解互验',
      '会写 O(n²) 枚举与 Kadane 两种最大子数组和',
      '体会"双实现结果必然相等"背后的不变量',
    ],
    brief: `## 对拍：给自己造一个评测机

写完一份题解，怎么知道它对？**对拍（stress testing）**：用同一份随机输入，分别跑"正确但慢"的暴力解和"待验证"的优化解，逐字符比对输出。

\`\`\`
随机数据生成器 gen  →  input.txt
暴力解 baoli O(n²)  →  out1
优化解 sol   O(n)   →  out2
out1 == out2 ？ →  通过继续拍 : 找到反例！
\`\`\`

循环几万次，第一份输出不同的 input 就是珍贵反例，直接喂给 bug 修。考场最后一小时，对拍是最硬的保险。

本题埋了一组现成的双实现，求**最大子数组和**（非空连续子段）：

- **暴力 O(n²)**：枚举每个起点 i，向右扩展终点 j，途中累加并更新答案，覆盖所有子段 [i..j]。
- **Kadane O(n)**：只维护"以 i 结尾的最大子段和"——\`cur = max(a[i], cur + a[i])\`，要么从 a[i] 重新开始，要么接上前面的段。

数据 ≤ 200 个，暴力也不过 4 万步。两个实现结果**必然相等**：一旦不等，必有一错——这正是对拍的价值。

> 💡 对拍的灵魂在生成器：范围要覆盖负数、全负、单元素、极值——专挑边界拳打。`,
    task: `## 任务：双实现互验

读入一行整数（可正可负），用两种方法求**最大子数组和**（非空连续子段）：

- 第一行：暴力 O(n²) 的结果
- 第二行：Kadane O(n) 的结果

两行结果应完全相同。

**输入**：一行若干个整数，以空格分隔（1 ≤ 个数 ≤ 200，绝对值 ≤ 1e4）。**注意没有 n**，读到行尾 / 输入结束为止。

**输出**：两行，均为最大子数组和

### 示例

| 输入 | 输出 |
| --- | --- |
| \`-2 1 -3 4 -1 2 1 -5 4\` | \`6\`<br>\`6\` |
| \`-3 -1 -4\` | \`-1\`<br>\`-1\` |

第二组全是负数：子段不可为空，答案是最大的单个元素 -1——暴力与 Kadane 都必须自然处理它（答案初值取第一个元素，而不是 0）。

**读取提示**：JS 用一次 \`readInts()\` 拿到整行；C++ 用 \`while (cin >> x)\`；Rust 把全部输入 \`split_whitespace\` 后逐个 parse；Go 用 ScanWords 循环 \`sc.Scan()\` 读到结束。`,
    starter: '',
    solution: '',
    algo: {
      starters: {
        javascript: `// 沙箱已注入：readline() 读一行字符串；readInts() 读一行并拆成数字数组
// 本题没有 n！一次 readInts() 拿到整行全部整数
// TODO 1: 读入数组 a
// TODO 2: 暴力 O(n²)：枚举起点 i，向右扩展 j 累加求和，更新 best1
//   初值 best1 = a[0]（防全负数）
// TODO 3: Kadane O(n)：cur = max(a[i], cur + a[i])，更新 best2
// TODO 4: 先后输出 best1、best2（两行）
`,
        go: `package main

import (
	"bufio"
	"os"
)

var sc = bufio.NewScanner(os.Stdin)

func main() {
	sc.Split(bufio.ScanWords)
	// 本题没有 n！循环读到输入结束（ScanWords 模式下 sc.Scan() 逐词返回）：
	//   vals := []int{}
	//   for sc.Scan() { x, _ := strconv.Atoi(sc.Text()); vals = append(vals, x) }
	// TODO 1: 按上面注释读入 vals（记得把 strconv、fmt 加进 import）
	// TODO 2: 暴力 O(n²) 求 best1，初值 vals[0]
	// TODO 3: Kadane O(n) 求 best2，初值 vals[0]
	// TODO 4: 输出两行：best1、best2
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    // 本题没有 n！把剩余全部 token 一次收集：
    //   let a: Vec<i64> = it.map(|t| t.parse().unwrap()).collect();
    // TODO 1: 按上面注释读入 a
    // TODO 2: 暴力 O(n²) 求 best1，初值 a[0]
    // TODO 3: Kadane O(n) 求 best2，初值 a[0]
    // TODO 4: 输出两行：best1、best2
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // 本题没有 n！循环读到输入结束：
    //   vector<long long> a; long long x;
    //   while (cin >> x) a.push_back(x);
    // TODO 1: 按上面注释读入 a
    // TODO 2: 暴力 O(n²) 求 best1，初值 a[0]
    // TODO 3: Kadane O(n) 求 best2，初值 a[0]
    // TODO 4: 输出两行：best1、best2
    return 0;
}
`,
      },
      solutions: {
        javascript: `const a = readInts(); // 一行全部整数（本题没有 n）

// 方法一：暴力 O(n²) —— 枚举每个起点，向右扩展并累加，覆盖所有子段 [i..j]
let best1 = a[0];
for (let i = 0; i < a.length; i++) {
  let s = 0;
  for (let j = i; j < a.length; j++) {
    s += a[j];
    if (s > best1) best1 = s;
  }
}
console.log(best1);

// 方法二：Kadane O(n) —— cur 是"以 i 结尾"的最大子段和
let cur = a[0], best2 = a[0];
for (let i = 1; i < a.length; i++) {
  cur = Math.max(a[i], cur + a[i]); // 要么另起炉灶，要么续上前段
  best2 = Math.max(best2, cur);
}
console.log(best2);
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

var sc = bufio.NewScanner(os.Stdin)

func main() {
	sc.Split(bufio.ScanWords)

	// 没有计数 n，逐词读到输入结束
	vals := []int{}
	for sc.Scan() {
		x, _ := strconv.Atoi(sc.Text())
		vals = append(vals, x)
	}

	// 方法一：暴力 O(n²)
	best1 := vals[0]
	for i := 0; i < len(vals); i++ {
		s := 0
		for j := i; j < len(vals); j++ {
			s += vals[j]
			if s > best1 {
				best1 = s
			}
		}
	}
	fmt.Println(best1)

	// 方法二：Kadane O(n)
	cur, best2 := vals[0], vals[0]
	for i := 1; i < len(vals); i++ {
		if vals[i] > cur+vals[i] {
			cur = vals[i]
		} else {
			cur += vals[i]
		}
		if cur > best2 {
			best2 = cur
		}
	}
	fmt.Println(best2)
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    // 没有计数 n，收集全部 token
    let a: Vec<i64> = it.map(|t| t.parse().unwrap()).collect();

    // 方法一：暴力 O(n²)
    let mut best1 = a[0];
    for i in 0..a.len() {
        let mut s: i64 = 0;
        for j in i..a.len() {
            s += a[j];
            if s > best1 {
                best1 = s;
            }
        }
    }
    println!("{}", best1);

    // 方法二：Kadane O(n)
    let mut cur = a[0];
    let mut best2 = a[0];
    for i in 1..a.len() {
        cur = std::cmp::max(a[i], cur + a[i]);
        best2 = std::cmp::max(best2, cur);
    }
    println!("{}", best2);
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // 没有计数 n，读到输入结束
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);

    // 方法一：暴力 O(n²)
    long long best1 = a[0];
    for (int i = 0; i < (int)a.size(); i++) {
        long long s = 0;
        for (int j = i; j < (int)a.size(); j++) {
            s += a[j];
            best1 = max(best1, s);
        }
    }
    cout << best1 << "\\n";

    // 方法二：Kadane O(n)
    long long cur = a[0], best2 = a[0];
    for (int i = 1; i < (int)a.size(); i++) {
        cur = max(a[i], cur + a[i]);
        best2 = max(best2, cur);
    }
    cout << best2 << "\\n";
    return 0;
}
`,
      },
    },
    hints: [
      '暴力：外层 i 枚举起点，内层 j 从 i 向右扩展，途中累加 s 并更新 best——天然覆盖全部子段 [i..j]。答案初值取第一个元素 a[0]，千万别初始化成 0，否则全负数组会错。',
      'Kadane：cur 与 best 都初始化为 a[0]；i 从 1 开始，每步 cur = max(a[i], cur + a[i])（另起炉灶还是续上前段），best = max(best, cur)。子段非空，全负时自然给出最大单元素。',
      '读取是本题的隐藏考点：没有 n。JS 一次 readInts() 拿整行；Go 用 ScanWords 循环 sc.Scan()；Rust 把 split_whitespace 的迭代器全部收集；C++ 用 while (cin >> x)。最后先输出暴力结果，再输出 Kadane 结果，共两行。',
    ],
    tests: [
      { name: '样例：经典正负混合', stdin: '-2 1 -3 4 -1 2 1 -5 4\n', expected: '6\n6' },
      { name: '样例：全负数', stdin: '-3 -1 -4\n', expected: '-1\n-1' },
      { name: '样例：单元素', stdin: '5\n', expected: '5\n5' },
      { name: '隐藏：全正数', stdin: '1 2 3 4 5\n', expected: '15\n15', hidden: true },
      { name: '隐藏：含 0 与多峰', stdin: '-1 0 -2 3 4 -5 8 -9 2\n', expected: '10\n10', hidden: true },
      { name: '隐藏：正负交替', stdin: '2 -8 3 -2 4 -10 7 -1 5 -6\n', expected: '11\n11', hidden: true },
    ],
  },
];
