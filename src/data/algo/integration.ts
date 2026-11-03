import type { Level } from '@/types';

/** 算法课 · 第 6 章：跨领域融会贯通 —— 综合实战（5 关） */
export const ALGO_INTEGRATION: Level[] = [
  {
    id: 'algo-integration-1',
    lang: 'algo',
    module: 'integration',
    order: 1,
    title: '两数之和',
    difficulty: 2,
    xp: 25,
    goals: [
      '用哈希表把 O(n²) 降为 O(n)',
      '掌握"先查后存"避免元素自配对',
      '正确处理重复值与负数',
    ],
    brief: `## 哈希：用空间换时间的一击必杀

两数之和的暴力是 O(n²) 双循环。哈希表把它砍到 O(n)，思路只有一句话：**只遍历一次，边走边问"我需要的搭档来过吗"**。

对每个 a[i]：先查哈希表里有没有 \`target − a[i]\`——有，答案就是它的下标和当前下标；没有，再把 a[i] 存进表里，等后来的数来认领。

| 结构 | 单次查找 | 总复杂度 |
| --- | --- | --- |
| 双重循环 | O(n) | O(n²) |
| 哈希表 | O(1) 均摊 | O(n) |

两个细节决定正确性：

- **先查后存**：当前元素绝不会和自己配对——查它的时候它还没进表。
- **重复值天然正确**：例如 4+4=8，第二个 4 查询时，第一个 4 已在表里等着。

这是哈希思想最经典的应用：把"找某个值"从线性扫描降为一次寻址。排序 + 双指针是另一条 O(n log n) 的路，但排序会打乱下标，还得把下标带在身上——哈希保序，更干净。`,
    task: `## 任务：两数之和

n 个整数中找出和恰为 target 的两个数，输出它们的**下标**（0 起，较小的在前，空格分隔）。保证恰有一解。

**输入**：
- 第一行：n target（2 ≤ n ≤ 1e5，|target| ≤ 1e9）
- 第二行：n 个整数（绝对值 ≤ 1e9）

**输出**：一行 \`i j\`（i < j，空格分隔）

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`4 9\`<br>\`2 7 11 15\` | \`0 1\` | 2+7=9 |
| \`3 6\`<br>\`3 2 4\` | \`1 2\` | 2+4=6，注意 3+3 不合法（只有一个 3） |

n 可达 1e5，O(n²) 双循环在评测里可能超时——用哈希表一遍扫描。`,
    starter: '',
    solution: '',
    algo: {
      starters: {
        javascript: `// 沙箱已注入：readline() 读一行字符串；readInts() 读一行并拆成数字数组
// TODO 1: 第一行读 n 与 target，第二行读 n 个整数
// TODO 2: 建一个 Map：值 → 下标，一遍扫描
//   对 a[i]：先查 target - a[i] 是否在表中；在则输出两个下标并结束
//   查不到再把 a[i] → i 存入表（先查后存！）
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
	// TODO 1: 读入 n 与 target
	// TODO 2: 建 map[int]int（值 → 下标），逐个读数：
	//   先查 target-x 是否在表中，在则输出两个下标并 return
	//   否则把 x 存入表（先查后存！）
}
`,
        rust: `use std::collections::HashMap;
use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    // TODO 1: 读 n（usize）与 target（i64）
    // TODO 2: 建 HashMap<i64, usize>（值 → 下标），逐个读数：
    //   先查 target - x 是否在表中，在则输出两个下标并结束
    //   否则把 x 存入表（先查后存！）
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // TODO 1: 读入 n 与 target（long long）
    // TODO 2: 建 unordered_map<long long, long long>（值 → 下标），逐个读数：
    //   先查 target - x 是否在表中，在则输出两个下标并结束
    //   否则把 x 存入表（先查后存！）
    return 0;
}
`,
      },
      solutions: {
        javascript: `const [n, target] = readInts();
const a = readInts();

const seen = new Map(); // 值 → 下标
for (let i = 0; i < n; i++) {
  const need = target - a[i];
  if (seen.has(need)) {
    // 先查后存：表里的下标 j 一定 < i，所以先输出 j
    console.log(seen.get(need) + ' ' + i);
    break;
  }
  seen.set(a[i], i);
}
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

func main() {
	sc.Split(bufio.ScanWords)
	n := nextInt()
	target := nextInt()

	seen := map[int]int{} // 值 → 下标
	for i := 0; i < n; i++ {
		x := nextInt()
		if j, ok := seen[target-x]; ok {
			// 先查后存：j 一定 < i
			fmt.Println(j, i)
			return
		}
		seen[x] = i
	}
}
`,
        rust: `use std::collections::HashMap;
use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    let n: usize = it.next().unwrap().parse().unwrap();
    let target: i64 = it.next().unwrap().parse().unwrap();

    let mut seen: HashMap<i64, usize> = HashMap::new(); // 值 → 下标
    for i in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        let found = seen.get(&(target - x)).copied();
        match found {
            Some(j) => {
                // 先查后存：j 一定 < i
                println!("{} {}", j, i);
                break;
            }
            None => {
                seen.insert(x, i);
            }
        }
    }
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    long long n, target;
    cin >> n >> target;

    unordered_map<long long, long long> seen; // 值 → 下标
    for (long long i = 0; i < n; i++) {
        long long x;
        cin >> x;
        auto it = seen.find(target - x);
        if (it != seen.end()) {
            // 先查后存：表中下标一定 < i
            cout << it->second << " " << i << "\\n";
            break;
        }
        seen[x] = i;
    }
    return 0;
}
`,
      },
    },
    hints: [
      '一遍扫描 + 哈希表：对每个 a[i] 计算 need = target - a[i]，先查表里有没有 need，有就直接得到答案；没有才把 a[i] 存入表。顺序反了会出现"自己配对自己"。',
      '输出顺序：因为先出现的数先入表，找到时表中的下标 j 一定小于当前下标 i，所以输出 j 在前、i 在后（题目要求较小下标在前）。',
      '重复值场景：如 5 4 4 2 7 找 8，第二个 4 查询时第一个 4 已在表中，天然正确。JS 用 Map，Go 用 map[int]int，Rust 用 HashMap 的 get + copied，C++ 用 unordered_map 的 find。',
    ],
    tests: [
      { name: '样例：经典用例', stdin: '4 9\n2 7 11 15\n', expected: '0 1' },
      { name: '样例：非前两元素', stdin: '3 6\n3 2 4\n', expected: '1 2' },
      { name: '隐藏：重复值配对', stdin: '5 8\n5 4 4 2 7\n', expected: '1 2', hidden: true },
      { name: '隐藏：负数与最小 n', stdin: '2 -10\n-3 -7\n', expected: '0 1', hidden: true },
      { name: '隐藏：乱序多候选', stdin: '6 20\n10 3 17 8 13 1\n', expected: '1 2', hidden: true },
    ],
  },
  {
    id: 'algo-integration-2',
    lang: 'algo',
    module: 'integration',
    order: 2,
    title: '合并区间',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握"排序 → 扫描 → 合并"的区间问题框架',
      '用 max(curR, r) 正确处理包含型区间',
      '区分相交、相接、分离三种情况',
    ],
    brief: `## 排序 + 扫描：区间问题的万能起手式

区间合并三步走：**按左端点排序 → 从左到右扫描 → 能接就接**。

维护当前合并区间 [curL, curR]，面对下一个区间 [l, r]（l 已升序）：

- \`l ≤ curR\`：重叠或恰好相接 → 合并，\`curR = max(curR, r)\`。用 max 是防"包含型"回退：新区间整个缩在当前区间里时，curR 不能变小。
- \`l > curR\`：彻底分离 → 输出当前区间，另起新区间。

排序是整个算法的灵魂：它保证 l 递增，于是"断开"之后就永远不必回头——问题从二维纠缠降为**一维顺序决策**。这就是扫描线思想，也直接迁移到会议室安排、区间覆盖等问题。

为什么 \`l == curR\` 也合并？[1,4] 与 [4,5] 共享点 4，合并为 [1,5]（左闭右闭语义）。若题目定义"相接不算重叠"，把 ≤ 改成 < 即可——一个判等符，就是需求差异的全部。

> 💡 复杂度 O(n log n)，瓶颈全在排序，扫描本身只有 O(n)。`,
    task: `## 任务：合并区间

给出 n 个区间，合并所有重叠或相接的区间，输出合并结果。

**输入**：
- 第一行：n（1 ≤ n ≤ 1000）
- 接下来 n 行：每行 \`l r\`（|l|, |r| ≤ 1e9，l ≤ r）。区间**不一定按顺序给出**

**输出**：合并后的区间，每行 \`l r\`（空格分隔），按左端点升序排列

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`4\`<br>\`1 3\`<br>\`2 6\`<br>\`8 10\`<br>\`15 18\` | \`1 6\`<br>\`8 10\`<br>\`15 18\` | (1,3) 与 (2,6) 重叠合并 |
| \`3\`<br>\`1 4\`<br>\`4 5\`<br>\`2 3\` | \`1 5\` | 输入乱序：先排序得 (1,4)(2,3)(4,5)，包含合并 + 相接合并 |

坐标可达 1e9，用 64 位整数。别忘最后一轮扫描结束时，手里还攥着一个没输出的区间。`,
    starter: '',
    solution: '',
    algo: {
      starters: {
        javascript: `// 沙箱已注入：readline() 读一行字符串；readInts() 读一行并拆成数字数组
// TODO 1: 读入 n 个区间 [l, r]（每行两个数）
// TODO 2: 按左端点 l 升序排序
// TODO 3: 扫描合并：维护 curL/curR，
//   l <= curR → 合并（curR = max(curR, r)）；l > curR → 输出当前并另起
// TODO 4: 别忘了输出最后一个合并区间
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
	// TODO 1: 读入 n 个区间（l, r）
	// TODO 2: sort.Slice 按左端点升序排序（记得把 sort 加进 import）
	// TODO 3: 扫描合并，fmt.Println 每行输出 "l r"（记得把 fmt 加进 import）
	// TODO 4: 别忘了最后一个区间
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    // TODO 1: 读入 n 个区间，收集成 Vec<(i64, i64)>（元组排序天然按左端点升序）
    // TODO 2: 扫描合并：维护 curL/curR
    //   l <= curR → curR = max(curR, r)；否则输出当前、另起
    // TODO 3: 别忘了最后一个区间，每行输出 "l r"
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // TODO 1: 读入 n 个区间到 vector<pair<long long,long long>>
    // TODO 2: sort（pair 默认按 first 升序）
    // TODO 3: 扫描合并：segs[i].first <= curR → curR = max(curR, segs[i].second)
    //   否则输出当前区间并另起
    // TODO 4: 别忘了最后一个区间
    return 0;
}
`,
      },
      solutions: {
        javascript: `const n = readInts()[0];
const segs = [];
for (let i = 0; i < n; i++) {
  const [l, r] = readInts();
  segs.push([l, r]);
}
segs.sort((p, q) => p[0] - q[0]); // 按左端点升序

const out = [];
let curL = segs[0][0], curR = segs[0][1];
for (let i = 1; i < n; i++) {
  const [l, r] = segs[i];
  if (l <= curR) {
    // 重叠或相接：扩展右端（max 防包含型回退）
    if (r > curR) curR = r;
  } else {
    out.push(curL + ' ' + curR);
    curL = l;
    curR = r;
  }
}
out.push(curL + ' ' + curR); // 最后一截
console.log(out.join('\\n'));
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

	type seg struct{ l, r int64 }
	segs := make([]seg, n)
	for i := 0; i < n; i++ {
		segs[i] = seg{int64(nextInt()), int64(nextInt())}
	}
	sort.Slice(segs, func(i, j int) bool { return segs[i].l < segs[j].l })

	curL, curR := segs[0].l, segs[0].r
	for _, s := range segs[1:] {
		if s.l <= curR {
			if s.r > curR {
				curR = s.r // 扩展右端，防包含型回退
			}
		} else {
			fmt.Println(curL, curR)
			curL, curR = s.l, s.r
		}
	}
	fmt.Println(curL, curR) // 最后一截
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    let n: usize = it.next().unwrap().parse().unwrap();
    let mut segs: Vec<(i64, i64)> = Vec::with_capacity(n);
    for _ in 0..n {
        let l: i64 = it.next().unwrap().parse().unwrap();
        let r: i64 = it.next().unwrap().parse().unwrap();
        segs.push((l, r));
    }
    segs.sort(); // 元组排序：先按左端点升序

    let mut out = String::new();
    let mut cur = segs[0];
    for &(l, r) in segs.iter().skip(1) {
        if l <= cur.1 {
            if r > cur.1 {
                cur.1 = r; // 扩展右端，防包含型回退
            }
        } else {
            out.push_str(&format!("{} {}\\n", cur.0, cur.1));
            cur = (l, r);
        }
    }
    out.push_str(&format!("{} {}\\n", cur.0, cur.1)); // 最后一截
    print!("{}", out);
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<long long, long long>> segs(n);
    for (auto& [l, r] : segs) cin >> l >> r;
    sort(segs.begin(), segs.end()); // pair 默认按左端点升序

    long long curL = segs[0].first, curR = segs[0].second;
    for (int i = 1; i < n; i++) {
        if (segs[i].first <= curR) {
            curR = max(curR, segs[i].second); // 扩展右端，防包含型回退
        } else {
            cout << curL << " " << curR << "\\n";
            curL = segs[i].first;
            curR = segs[i].second;
        }
    }
    cout << curL << " " << curR << "\\n"; // 最后一截
    return 0;
}
`,
      },
    },
    hints: [
      '第一步永远是排序：按左端点 l 升序。排序后只需一次线性扫描，不需要任何嵌套循环。',
      '扫描时维护 curL/curR：新区间 l <= curR 就合并（只更新 curR = max(curR, r)，max 是防"包含型"新区间把右端拉回去）；l > curR 就先输出当前区间，再把它作为新区间的起点。',
      '输出每行一个 "l r"（空格分隔），按左端点升序——排序已保证。最容易漏的是扫描结束后最后一段区间还没输出，循环外补一次输出。',
    ],
    tests: [
      { name: '样例：重叠合并', stdin: '4\n1 3\n2 6\n8 10\n15 18\n', expected: '1 6\n8 10\n15 18' },
      { name: '样例：乱序 + 相接 + 包含', stdin: '3\n1 4\n4 5\n2 3\n', expected: '1 5' },
      { name: '隐藏：包含型不回退', stdin: '4\n1 10\n2 3\n4 5\n11 12\n', expected: '1 10\n11 12', hidden: true },
      { name: '隐藏：全部分离', stdin: '3\n1 2\n4 5\n7 8\n', expected: '1 2\n4 5\n7 8', hidden: true },
      { name: '隐藏：单个区间', stdin: '1\n0 0\n', expected: '0 0', hidden: true },
      { name: '隐藏：负数乱序相接', stdin: '3\n5 6\n-3 -1\n0 5\n', expected: '-3 -1\n0 6', hidden: true },
    ],
  },
  {
    id: 'algo-integration-3',
    lang: 'algo',
    module: 'integration',
    order: 3,
    title: 'LRU 缓存模拟',
    difficulty: 4,
    xp: 40,
    goals: [
      '理解 LRU 淘汰策略与"使用即刷新"',
      '用哈希 + 有序列表（或 Map）模拟 O(1) 结构',
      '正确处理 put 覆盖、超容淘汰的顺序',
    ],
    brief: `## LRU：哈希 + 双向链表的经典协奏

LRU（Least Recently Used）缓存：容量有限，满了就淘汰**最久未使用**的键。注意 get 和 put 都算"使用"——两者都要把键刷新为最新，只顾淘汰不管刷新是最常见的 bug。

工业级实现是**哈希表 + 双向链表**的合体：

- **哈希表**：key → 链表节点，O(1) 定位（链表自己找节点要 O(n)）；
- **双向链表**：维护使用顺序，头 = 最新、尾 = 最旧；O(1) 摘除任意节点、O(1) 头插。

两个操作的完整流程：\`get(k)\` 命中则把节点摘下头插并返回值，未命中返回 miss；\`put(k, v)\` 已存在则更新值并头插，不存在则头插新节点，若超出容量就删除尾节点并从哈希表移除。

小数据量不必造轮子：JS 的 Map 本身按插入顺序迭代，\`delete + set\` 等价于头插，第一个键就是最久未用；也可以用数组 / Vec 当链表，摘除再插回头部。本题 m ≤ 1000，O(m) 的模拟绰绰有余。

> 💡 设计结构时先问：每种操作要碰哪些位置？get/put 都要"定位 + 移到头 + 可能删尾"——哈希管定位、链管顺序，正好各管一摊。`,
    task: `## 任务：LRU 缓存模拟

模拟一个容量为 m 的 LRU 缓存。

**输入**：
- 第一行：容量 m（1 ≤ m ≤ 1000）
- 第二行：操作数 q（1 ≤ q ≤ 1e4）
- 接下来 q 行：每行 \`put k v\` 或 \`get k\`（k、v 为整数，绝对值 ≤ 1e9）

**输出**：对每个 get 输出一行：命中输出 \`hit <v>\`，未命中输出 \`miss\`

**规则**：
- put 已存在的键：**更新值并刷新为最新使用**
- get 命中：返回值并**刷新为最新使用**
- put 新键导致超容量：淘汰最久未使用的键

### 示例

**输入**

\`\`\`
2
7
put 1 10
put 2 20
get 1
put 3 30
get 2
get 3
get 1
\`\`\`

**输出**

\`\`\`
hit 10
miss
hit 30
hit 10
\`\`\`

解析：get 1 使键 1 成为最新；put 3 超容，淘汰最久未用的 2；之后 3、1 均在缓存中。`,
    starter: '',
    solution: '',
    algo: {
      starters: {
        javascript: `// 沙箱已注入：readline() 读一行字符串；readInts() 读一行并拆成数字数组
// TODO 1: 读入容量 m 与操作数 q
// TODO 2: 用 Map 模拟：Map 迭代顺序 = 插入顺序，
//   delete + set 即"头插刷新"；第一个键即最久未用
// TODO 3: 逐行 readline().trim().split(/\\s+/) 解析命令：
//   put → 更新/插入 + 刷新 + 超容删最前；get → 命中刷新并输出 'hit <v>'，否则 'miss'
`,
        go: `package main

import (
	"bufio"
	"os"
	"strconv"
)

var sc = bufio.NewScanner(os.Stdin)

func nextToken() string {
	sc.Scan()
	return sc.Text()
}

func nextInt() int {
	n, _ := strconv.Atoi(nextToken())
	return n
}

func main() {
	sc.Split(bufio.ScanWords)
	// TODO 1: 读容量 m 与操作数 q
	// TODO 2: 用 map[int]int 存值，再维护一个切片 order：
	//   前端 = 最近使用，末尾 = 最久未用
	//   命中/更新时把 key 摘除再插到最前
	// TODO 3: 逐条处理：op == "put" 再读 k、v；op == "get" 只读 k
	//   命中输出 "hit <v>"，否则 "miss"
	// TODO 4: put 后若 len(order) > m，删除末尾 key 及其值
}
`,
        rust: `use std::collections::HashMap;
use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    // TODO 1: 读容量 m（usize）与操作数 q（usize）
    // TODO 2: 用 HashMap<i64, i64> 存值 + Vec<i64> order 维护顺序：
    //   前端 = 最近使用；命中/更新时先 remove 再 insert(0, k)
    // TODO 3: put 新键后若 order.len() > m，pop 末尾并从 map 移除
    // TODO 4: get 命中输出 "hit <v>"，否则 "miss"
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // TODO 1: 读容量 m 与操作数 q
    // TODO 2: unordered_map<long long,long long> 存值 + vector<long long> order：
    //   前端 = 最近使用；命中/更新时先 erase 再 insert(begin(), k)
    // TODO 3: put 后若 order.size() > m，取 order.back() 淘汰（map 里也要删）
    // TODO 4: get 命中输出 "hit <v>"，否则 "miss"
    return 0;
}
`,
      },
      solutions: {
        javascript: `const m = readInts()[0]; // 容量
const q = readInts()[0]; // 操作数

// Map 迭代顺序 = 插入顺序：delete + set 即"头插刷新"，第一个键即最久未用
const cache = new Map();
for (let i = 0; i < q; i++) {
  const parts = readline().trim().split(/\\s+/);
  const k = Number(parts[1]);
  if (parts[0] === 'put') {
    const v = Number(parts[2]);
    if (cache.has(k)) cache.delete(k); // 覆盖也要先摘除，保证刷新
    cache.set(k, v);
    if (cache.size > m) {
      const lru = cache.keys().next().value; // 最前 = 最久未用
      cache.delete(lru);
    }
  } else {
    if (cache.has(k)) {
      const v = cache.get(k);
      cache.delete(k);
      cache.set(k, v); // 命中刷新为最新
      console.log('hit ' + v);
    } else {
      console.log('miss');
    }
  }
}
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

var sc = bufio.NewScanner(os.Stdin)

func nextToken() string {
	sc.Scan()
	return sc.Text()
}

func nextInt() int {
	n, _ := strconv.Atoi(nextToken())
	return n
}

func main() {
	sc.Split(bufio.ScanWords)
	m := nextInt()
	q := nextInt()

	val := make(map[int]int)
	order := []int{} // 前端 = 最近使用，末尾 = 最久未用

	// 把 k 摘除（若在）并插到最前
	refresh := func(k int) {
		for i, key := range order {
			if key == k {
				order = append(order[:i], order[i+1:]...)
				break
			}
		}
		order = append([]int{k}, order...)
	}

	for i := 0; i < q; i++ {
		op := nextToken()
		k := nextInt()
		if op == "put" {
			val[k] = nextInt()
			refresh(k)
			if len(order) > m {
				delete(val, order[len(order)-1]) // 淘汰最久未用
				order = order[:len(order)-1]
			}
		} else {
			if v, ok := val[k]; ok {
				refresh(k) // 命中刷新
				fmt.Println("hit", v)
			} else {
				fmt.Println("miss")
			}
		}
	}
}
`,
        rust: `use std::collections::HashMap;
use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    let m: usize = it.next().unwrap().parse().unwrap();
    let q: usize = it.next().unwrap().parse().unwrap();

    let mut val: HashMap<i64, i64> = HashMap::new();
    let mut order: Vec<i64> = Vec::new(); // 前端 = 最近使用，末尾 = 最久未用
    let mut out = String::new();

    for _ in 0..q {
        let op = it.next().unwrap();
        let k: i64 = it.next().unwrap().parse().unwrap();
        if op == "put" {
            let v: i64 = it.next().unwrap().parse().unwrap();
            val.insert(k, v);
            if let Some(pos) = order.iter().position(|&x| x == k) {
                order.remove(pos);
            }
            order.insert(0, k);
            if order.len() > m {
                let lru = order.pop().unwrap(); // 淘汰最久未用
                val.remove(&lru);
            }
        } else if let Some(v) = val.get(&k).copied() {
            if let Some(pos) = order.iter().position(|&x| x == k) {
                order.remove(pos);
            }
            order.insert(0, k); // 命中刷新
            out.push_str(&format!("hit {}\\n", v));
        } else {
            out.push_str("miss\\n");
        }
    }
    print!("{}", out);
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int m, q;
    cin >> m >> q;

    unordered_map<long long, long long> val;
    vector<long long> order; // 前端 = 最近使用，末尾 = 最久未用

    while (q--) {
        string op;
        long long k;
        cin >> op >> k;
        if (op == "put") {
            long long v;
            cin >> v;
            val[k] = v;
            auto pos = find(order.begin(), order.end(), k);
            if (pos != order.end()) order.erase(pos);
            order.insert(order.begin(), k);
            if ((int)order.size() > m) {
                val.erase(order.back()); // 淘汰最久未用
                order.pop_back();
            }
        } else {
            auto itv = val.find(k);
            if (itv != val.end()) {
                auto pos = find(order.begin(), order.end(), k);
                order.erase(pos);
                order.insert(order.begin(), k); // 命中刷新
                cout << "hit " << itv->second << "\\n";
            } else {
                cout << "miss\\n";
            }
        }
    }
    return 0;
}
`,
      },
    },
    hints: [
      '核心数据结构：一个存"键 → 值"的哈希表，外加一个维护使用顺序的数组/Vec（前端 = 最新，末尾 = 最久未用）。命中或更新时：先把 key 从顺序表中摘除，再插到最前端。',
      '命令按 token 读：put 后面跟 k、v 两个数，get 后面只跟一个 k。JS 用 readline().trim().split(/\\s+/)；Go/Rust/C++ 直接按空白逐词读，put 比 get 多读一个数，不用关心换行位置。',
      '两个易错点：① put 覆盖已有键时，值要更新且顺序要刷新（先摘除再头插）；② put 新键插入后若长度超过 m，淘汰顺序表末尾的键（哈希表里也要删）。get 命中同样必须刷新顺序。',
    ],
    tests: [
      { name: '样例：get 刷新 + 淘汰', stdin: '2\n7\nput 1 10\nput 2 20\nget 1\nput 3 30\nget 2\nget 3\nget 1\n', expected: 'hit 10\nmiss\nhit 30\nhit 10' },
      { name: '样例：put 覆盖刷新', stdin: '2\n6\nput 1 1\nput 2 2\nput 1 11\nput 3 3\nget 1\nget 2\n', expected: 'hit 11\nmiss' },
      { name: '隐藏：get 刷新决定淘汰对象', stdin: '2\n6\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 1\nget 2\n', expected: 'hit 1\nhit 1\nmiss', hidden: true },
      { name: '隐藏：容量 1 反复换血', stdin: '1\n7\nput 5 50\nget 5\nput 6 60\nget 5\nput 5 55\nget 6\nget 5\n', expected: 'hit 50\nmiss\nmiss\nhit 55', hidden: true },
      { name: '隐藏：空缓存 miss 与连锁刷新', stdin: '3\n8\nget 9\nput 9 90\nput 8 80\nput 7 70\nget 8\nput 1 10\nget 9\nget 8\n', expected: 'miss\nhit 80\nmiss\nhit 80', hidden: true },
    ],
  },
  {
    id: 'algo-integration-4',
    lang: 'algo',
    module: 'integration',
    order: 4,
    title: '最长公共子序列',
    difficulty: 4,
    xp: 40,
    visualizer: { kind: 'dp-table', param: 'lcs' },
    goals: [
      '掌握 dp[i][j] 的状态定义与两条转移',
      '理解边界与填表顺序（无后效性）',
      '会按"状态数"估算 DP 的代价',
    ],
    brief: `## LCS：一张表看懂动态规划

最长公共子序列（LCS）：从两个串里**可以跳着删字符**，得到的最长公共串。"abcde" 与 "ace" 的 LCS 是 "ace"，长度 3——子序列不要求连续。

定义 **dp[i][j] = X 的前 i 个字符 与 Y 的前 j 个字符的 LCS 长度**。转移只有两条路：

\`\`\`
X[i-1] == Y[j-1]：dp[i][j] = dp[i-1][j-1] + 1        // 配上这一对
否则：            dp[i][j] = max(dp[i-1][j], dp[i][j-1]) // 舍弃其中一个字符
\`\`\`

边界：dp[0][*] = dp[*][0] = 0（和空串的公共子序列长度为 0）。按行填表，答案在右下角 dp[m][n]。右侧动画会逐格演示：字符命中时从**左上**进一格加一，否则从**上/左**取较大者——每个格子只依赖已经算好的邻居，这就是**无后效性**，DP 正确性的根基。

复杂度 O(m×n)：状态数就是表格大小。20×20 只有 400 格；若两串各 1e5，1e10 个格子就装不下——选 DP 前先估状态量，是动规题的第一步审题。`,
    task: `## 任务：最长公共子序列

**输入**：两行，各一个字符串（长度 1 ~ 20，仅小写字母）

**输出**：一行，LCS 的长度

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`abcde\`<br>\`ace\` | \`3\` | LCS = "ace" |
| \`abc\`<br>\`def\` | \`0\` | 无公共字符 |

建议先看右侧的 dp 填表动画，对照 "abcde"/"ace" 逐格理解两条转移，再动手写代码。`,
    starter: '',
    solution: '',
    algo: {
      starters: {
        javascript: `// 沙箱已注入：readline() 读一行字符串；readInts() 读一行并拆成数字数组
// TODO 1: 用 readline() 读入两个字符串 X、Y（各占一行，记得 trim）
// TODO 2: 建 (m+1)×(n+1) 的 dp 表，第 0 行/列全 0
// TODO 3: i、j 从 1 开始填表：
//   X[i-1] === Y[j-1] → dp[i][j] = dp[i-1][j-1] + 1
//   否则 → dp[i][j] = max(dp[i-1][j], dp[i][j-1])
// TODO 4: 输出 dp[m][n]
`,
        go: `package main

import (
	"bufio"
	"os"
)

var sc = bufio.NewScanner(os.Stdin)

func nextToken() string {
	sc.Scan()
	return sc.Text()
}

func main() {
	sc.Split(bufio.ScanWords)
	// TODO 1: 读入两个字符串 X、Y（nextToken）
	// TODO 2: 建 (m+1)×(n+1) 的 dp 表，边界为 0
	// TODO 3: 双层循环填表（相等取左上+1，否则取上/左较大者）
	// TODO 4: 输出 dp[m][n]（记得把 fmt 加进 import）
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    // TODO 1: 读入两个字符串，collect 成 Vec<char> 方便按下标访问
    // TODO 2: 建 (m+1)×(n+1) 的 dp 表（vec![vec![0usize; n+1]; m+1]）
    // TODO 3: 双层循环填表（相等取左上+1，否则取上/左较大者）
    // TODO 4: 输出 dp[m][n]
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // TODO 1: 读入两个字符串 x、y
    // TODO 2: 建 (m+1)×(n+1) 的 dp 表，边界为 0
    // TODO 3: 双层循环填表（相等取左上+1，否则取上/左较大者）
    // TODO 4: 输出 dp[m][n]
    return 0;
}
`,
      },
      solutions: {
        javascript: `const X = readline().trim();
const Y = readline().trim();
const m = X.length, n = Y.length;

// dp[i][j]：X 前 i 个字符与 Y 前 j 个字符的 LCS 长度
const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
for (let i = 1; i <= m; i++) {
  for (let j = 1; j <= n; j++) {
    if (X[i - 1] === Y[j - 1]) {
      dp[i][j] = dp[i - 1][j - 1] + 1; // 命中：配上这一对
    } else {
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // 舍弃其一
    }
  }
}
console.log(dp[m][n]);
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
)

var sc = bufio.NewScanner(os.Stdin)

func nextToken() string {
	sc.Scan()
	return sc.Text()
}

func main() {
	sc.Split(bufio.ScanWords)
	x := nextToken()
	y := nextToken()
	m, n := len(x), len(y)

	dp := make([][]int, m+1)
	for i := range dp {
		dp[i] = make([]int, n+1)
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			if x[i-1] == y[j-1] {
				dp[i][j] = dp[i-1][j-1] + 1
			} else if dp[i-1][j] > dp[i][j-1] {
				dp[i][j] = dp[i-1][j]
			} else {
				dp[i][j] = dp[i][j-1]
			}
		}
	}
	fmt.Println(dp[m][n])
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    let x: Vec<char> = it.next().unwrap().chars().collect();
    let y: Vec<char> = it.next().unwrap().chars().collect();
    let (m, n) = (x.len(), y.len());

    // dp[i][j]：x 前 i 个字符与 y 前 j 个字符的 LCS 长度
    let mut dp = vec![vec![0usize; n + 1]; m + 1];
    for i in 1..=m {
        for j in 1..=n {
            dp[i][j] = if x[i - 1] == y[j - 1] {
                dp[i - 1][j - 1] + 1
            } else {
                dp[i - 1][j].max(dp[i][j - 1])
            };
        }
    }
    println!("{}", dp[m][n]);
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string x, y;
    cin >> x >> y;
    int m = x.size(), n = y.size();

    // dp[i][j]：x 前 i 个字符与 y 前 j 个字符的 LCS 长度
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (x[i - 1] == y[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    cout << dp[m][n] << "\\n";
    return 0;
}
`,
      },
    },
    hints: [
      '先建表：dp 是 (m+1) 行 (n+1) 列，第 0 行、第 0 列全是 0（空串与任何串的 LCS 为 0）。i、j 都从 1 开始填。',
      '两条转移：字符相等（注意下标偏移，比的是 X[i-1] 与 Y[j-1]）时 dp[i][j] = dp[i-1][j-1] + 1；否则取 max(dp[i-1][j], dp[i][j-1])。',
      '答案是右下角 dp[m][n]。填表顺序只要保证"上、左、左上先算好"即可——按行从左到右最直观。可以对照右侧 dp 填表动画验证你的理解。',
    ],
    tests: [
      { name: '样例：经典用例', stdin: 'abcde\nace\n', expected: '3' },
      { name: '样例：无公共字符', stdin: 'abc\ndef\n', expected: '0' },
      { name: '隐藏：完全相同', stdin: 'abc\nabc\n', expected: '3', hidden: true },
      { name: '隐藏：单字符命中', stdin: 'bl\nyby\n', expected: '1', hidden: true },
      { name: '隐藏：交错公共串', stdin: 'aggtab\ngxtxayb\n', expected: '4', hidden: true },
      { name: '隐藏：单字符相等', stdin: 'z\nz\n', expected: '1', hidden: true },
    ],
  },
  {
    id: 'algo-integration-5',
    lang: 'algo',
    module: 'integration',
    order: 5,
    title: 'Dijkstra 最短路',
    difficulty: 5,
    visualizer: { kind: 'dijkstra' },
    xp: 45,
    goals: [
      '掌握 Dijkstra 的贪心流程与松弛操作',
      '理解它与 BFS 的本质区别（带权、按距离出序）',
      '会用邻接矩阵 + 每轮选最小实现 O(n²) 版本',
    ],
    brief: `## Dijkstra：带权图上的贪心最短路

BFS 能求无权图最短路，但边一旦带权，"步数最少"就不再等于"代价最小"。Dijkstra 用贪心补上这一点：

1. 初始化 \`dist[s] = 0\`，其余点为无穷大；
2. 每轮从**未确定**的点里挑 dist 最小的 u——由于边权非负，绕任何弯路都不会更近，所以 u 的距离已经尘埃落定，标记为"确定"；
3. 用 u **松弛**邻居：\`dist[v] = min(dist[v], dist[u] + w)\`；
4. 重复 n 轮（或用优先队列每次取堆顶）。

与 BFS 的两大区别：BFS 用**普通队列**（先到先得），Dijkstra 用**优先队列 / 每轮选最小**（谁近谁先确定）；BFS 只在边权相同时成立，Dijkstra 要求**边权非负**——负权边会破坏"确定即最优"的贪心前提（那种图要交给 Bellman-Ford）。

本题 n ≤ 10，O(n²) 朴素实现（每轮线性找最小）绰绰有余；竞赛大图用 priority_queue 达到 O((n+m) log n)。本题还可能有重边——邻接矩阵存"两点间最小权"，或让松弛自然取到更优的那条。`,
    task: `## 任务：最短路径

给定带权无向图，求 s 到 t 的最短距离。

**输入**：
- 第一行：n m（2 ≤ n ≤ 10，1 ≤ m ≤ 45）
- 接下来 m 行：每行 \`u v w\`——无向边，端点 1 起，权 1 ≤ w ≤ 1e9（可能有重边）
- 最后一行：\`s t\`（1 ≤ s, t ≤ n）

**输出**：一行，s 到 t 的最短距离；不可达输出 \`-1\`

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`4 4\`<br>\`1 2 1\`<br>\`2 3 2\`<br>\`1 3 5\`<br>\`3 4 1\`<br>\`1 4\` | \`4\` | 1→2→3→4 = 4，优于直连 1→3→4 = 6 |

注意：s == t 时距离为 0；路径和最大可达 45 × 1e9 ≈ 4.5e10，**必须用 64 位整数**，32 位会溢出。`,
    starter: '',
    solution: '',
    algo: {
      starters: {
        javascript: `// 沙箱已注入：readline() 读一行字符串；readInts() 读一行并拆成数字数组
// TODO 1: 读入 n m，建 (n+1)×(n+1) 邻接矩阵 g，初始为 Infinity
// TODO 2: 读 m 条边，无向：g[u][v] 与 g[v][u] 存较小权（防重边）
// TODO 3: 读 s t，Dijkstra：
//   dist 全 INF、dist[s]=0；每轮挑未确定中 dist 最小的 u，
//   标记确定，用 u 松弛所有邻居
// TODO 4: dist[t] 为 INF 输出 -1，否则输出 dist[t]
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
	// TODO 1: 读 n m，建 (n+1)×(n+1) 邻接矩阵 g（int64，初始一个很大的数）
	// TODO 2: 读 m 条边，无向双向存较小权（防重边）
	// TODO 3: 读 s t；dist 数组 + done 数组，每轮选未确定中 dist 最小的 u 并松弛
	// TODO 4: dist[t] 不可达输出 -1，否则输出 dist[t]（64 位！）
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    // TODO 1: 读 n m，建 (n+1)×(n+1) 邻接矩阵 g（i64，初始一个很大的数）
    // TODO 2: 读 m 条边，无向双向存较小权（防重边）
    // TODO 3: 读 s t；dist + done，每轮选未确定中 dist 最小的 u 并松弛
    // TODO 4: dist[t] 不可达输出 -1，否则输出 dist[t]
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // TODO 1: 读 n m，建 (n+1)×(n+1) 邻接矩阵 g（long long，初始 LLONG_MAX/4）
    // TODO 2: 读 m 条边，无向双向存较小权（防重边）
    // TODO 3: 读 s t；dist + done，每轮选未确定中 dist 最小的 u 并松弛
    // TODO 4: dist[t] 不可达输出 -1，否则输出 dist[t]
    return 0;
}
`,
      },
      solutions: {
        javascript: `const [n, m] = readInts();
const INF = Infinity;
// 邻接矩阵：g[u][v] = 最小边权（重边取小），Infinity 表示无边
const g = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(INF));
for (let i = 0; i < m; i++) {
  const [u, v, w] = readInts();
  if (w < g[u][v]) {
    g[u][v] = w;
    g[v][u] = w; // 无向边
  }
}
const [s, t] = readInts();

const dist = new Array(n + 1).fill(INF);
const done = new Array(n + 1).fill(false);
dist[s] = 0;
for (let k = 0; k < n; k++) {
  // 贪心：未确定点中 dist 最小者，其距离已尘埃落定
  let u = -1;
  for (let j = 1; j <= n; j++) {
    if (!done[j] && (u === -1 || dist[j] < dist[u])) u = j;
  }
  if (u === -1 || dist[u] === INF) break; // 剩余点不可达
  done[u] = true;
  for (let v = 1; v <= n; v++) {
    if (dist[u] + g[u][v] < dist[v]) dist[v] = dist[u] + g[u][v]; // 松弛
  }
}
console.log(dist[t] === INF ? -1 : dist[t]);
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

func main() {
	sc.Split(bufio.ScanWords)
	n := nextInt()
	m := nextInt()

	const INF = int64(1) << 62
	g := make([][]int64, n+1)
	for i := range g {
		g[i] = make([]int64, n+1)
		for j := range g[i] {
			g[i][j] = INF
		}
	}
	for i := 0; i < m; i++ {
		u := nextInt()
		v := nextInt()
		w := int64(nextInt())
		if w < g[u][v] { // 重边取小
			g[u][v] = w
			g[v][u] = w
		}
	}
	s := nextInt()
	t := nextInt()

	dist := make([]int64, n+1)
	done := make([]bool, n+1)
	for i := 1; i <= n; i++ {
		dist[i] = INF
	}
	dist[s] = 0

	for k := 0; k < n; k++ {
		u := -1
		for j := 1; j <= n; j++ {
			if !done[j] && (u == -1 || dist[j] < dist[u]) {
				u = j
			}
		}
		if u == -1 || dist[u] == INF {
			break
		}
		done[u] = true
		for v := 1; v <= n; v++ {
			if g[u][v] != INF && dist[u]+g[u][v] < dist[v] {
				dist[v] = dist[u] + g[u][v]
			}
		}
	}

	if dist[t] == INF {
		fmt.Println(-1)
	} else {
		fmt.Println(dist[t])
	}
}
`,
        rust: `use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    let n: usize = it.next().unwrap().parse().unwrap();
    let m: usize = it.next().unwrap().parse().unwrap();

    const INF: i64 = i64::MAX / 4;
    let mut g = vec![vec![INF; n + 1]; n + 1];
    for _ in 0..m {
        let u: usize = it.next().unwrap().parse().unwrap();
        let v: usize = it.next().unwrap().parse().unwrap();
        let w: i64 = it.next().unwrap().parse().unwrap();
        if w < g[u][v] {
            g[u][v] = w;
            g[v][u] = w; // 无向边，重边取小
        }
    }
    let s: usize = it.next().unwrap().parse().unwrap();
    let t: usize = it.next().unwrap().parse().unwrap();

    let mut dist = vec![INF; n + 1];
    let mut done = vec![false; n + 1];
    dist[s] = 0;

    for _ in 0..n {
        let mut u: i64 = -1;
        for j in 1..=n {
            if !done[j] && (u == -1 || dist[j] < dist[u as usize]) {
                u = j as i64;
            }
        }
        if u == -1 || dist[u as usize] == INF {
            break;
        }
        let u = u as usize;
        done[u] = true;
        for v in 1..=n {
            if g[u][v] < INF && dist[u] + g[u][v] < dist[v] {
                dist[v] = dist[u] + g[u][v];
            }
        }
    }

    if dist[t] == INF {
        println!("-1");
    } else {
        println!("{}", dist[t]);
    }
}
`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    const long long INF = LLONG_MAX / 4;
    vector<vector<long long>> g(n + 1, vector<long long>(n + 1, INF));
    for (int i = 0; i < m; i++) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        if (w < g[u][v]) { // 重边取小
            g[u][v] = w;
            g[v][u] = w;
        }
    }
    int s, t;
    cin >> s >> t;

    vector<long long> dist(n + 1, INF);
    vector<bool> done(n + 1, false);
    dist[s] = 0;

    for (int k = 0; k < n; k++) {
        int u = -1;
        for (int j = 1; j <= n; j++) {
            if (!done[j] && (u == -1 || dist[j] < dist[u])) u = j;
        }
        if (u == -1 || dist[u] >= INF) break;
        done[u] = true;
        for (int v = 1; v <= n; v++) {
            if (g[u][v] < INF && dist[u] + g[u][v] < dist[v]) {
                dist[v] = dist[u] + g[u][v];
            }
        }
    }

    cout << (dist[t] >= INF ? -1 : dist[t]) << "\\n";
    return 0;
}
`,
      },
    },
    hints: [
      '用邻接矩阵最省事：g[u][v] 初始为"无穷大"，读边时无向双向存、重边取较小权。dist 数组全部初始化为无穷大，dist[s] = 0。',
      '每轮两步：① 在未确定的点里找 dist 最小的 u（找不到或 dist[u] 仍是无穷大就 break）；② 标记 done[u]，然后对每个 v 松弛：dist[u] + g[u][v] < dist[v] 时更新。最多重复 n 轮。',
      '易错点：s == t 直接输出 0（算法天然给出）；无穷大别参与加法（先判 g[u][v] 是否为无穷大再松弛）；输出前判断 dist[t]，不可达输出 -1。全程用 64 位整数。',
    ],
    tests: [
      { name: '样例：多路径择优', stdin: '4 4\n1 2 1\n2 3 2\n1 3 5\n3 4 1\n1 4\n', expected: '4' },
      { name: '样例：不可达', stdin: '3 1\n1 2 7\n1 3\n', expected: '-1' },
      { name: '隐藏：无向边反向查询', stdin: '2 1\n1 2 100\n2 1\n', expected: '100', hidden: true },
      { name: '隐藏：五点多路径', stdin: '5 7\n1 2 10\n1 3 3\n3 4 2\n4 2 1\n2 5 1\n4 5 6\n1 5 15\n1 5\n', expected: '7', hidden: true },
      { name: '隐藏：起点即终点', stdin: '3 2\n1 2 5\n2 3 5\n2 2\n', expected: '0', hidden: true },
      { name: '隐藏：大权重防溢出', stdin: '4 3\n1 2 1000000000\n2 3 1000000000\n3 4 1000000000\n1 4\n', expected: '3000000000', hidden: true },
    ],
  },
];
