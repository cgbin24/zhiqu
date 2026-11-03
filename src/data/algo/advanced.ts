import type { Level } from '@/types';

/** 算法课 · 第三章：进阶技术 —— 栈/队列/哈希/链表/树/图（8 关） */
export const ALGO_ADVANCED: Level[] = [
  {
    id: 'algo-advanced-1',
    lang: 'algo',
    module: 'advanced',
    order: 1,
    title: '栈：括号匹配',
    difficulty: 2,
    xp: 25,
    goals: [
      '理解栈的后进先出（LIFO）特性与 push/pop 语义',
      '掌握「左括号入栈、右括号查栈顶」的匹配框架',
      '注意两类坑：右括号来时栈可能为空、扫描完必须判栈空',
    ],
    brief: `## 栈：后进先出的「叠盘子」

栈（Stack）只允许在一端（栈顶）放入和取出 —— 就像餐厅里叠盘子：新盘子放最上面，取也先取最上面的，**后进先出（LIFO）**。

括号匹配是栈最经典的应用。从左往右扫描字符串：

- 遇到**左括号** \`(\` \`[\` \`{\`：入栈（"先欠着一笔，回头再还"）；
- 遇到**右括号**：栈顶必须是对应的左括号，配对成功则弹出，否则立即判无效；
- 扫描结束后**栈必须为空** —— 还有没还清的"欠账"也不行。

\`\`\`text
( [ { } ] )   →  入( 入[ 入{ → 弹{ 弹[ 弹( → 栈空 ✓
( [ ) ]       →  入( 入[ → 遇 ) 时栈顶是 [ ✗ 交叉，无效
\`\`\`

时间复杂度 O(n)，每个字符至多入栈、出栈各一次；空间最坏 O(n)。

> ⚠️ 易错点：① 只检查"配对成功"却忘了最后判栈空（\`(([\` 会误判 Valid）；② 右括号到来时栈可能已空，直接取栈顶会出错 —— 先判空再比对。`,
    task: `## 任务：判断括号串是否合法

读入一行仅由 \`()\` \`[]\` \`{}\` 六种字符组成的括号串，判断它是否配对合法：

- 每个左括号都必须有同类型的右括号按正确顺序闭合；
- 嵌套必须完全对齐，不能交叉（如 \`([)]\` 不合法）。

**输入**：一行一个括号串（长度 1~100，只含六种括号字符）

**输出**：一行 \`Valid\` 或 \`Invalid\`（注意大小写）

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`()[]{}\` | \`Valid\` | 依次闭合 |
| \`([)]\` | \`Invalid\` | 括号交叉 |
| \`(([]){})\` | \`Valid\` | 嵌套正确 |`,
    starter: `const s = (readline() || '').trim();

// TODO 1: 建一个栈（数组 + push/pop 即可），准备一张「右括号 → 对应左括号」的对照表
// TODO 2: 从左往右扫描 s：左括号入栈；右括号先判栈空、再比对栈顶，配对则弹出
// TODO 3: 扫描结束且栈为空输出 Valid，否则 Invalid
console.log('Invalid'); // 占位，替换为你的判断结果
`,
    solution: `const s = (readline() || '').trim();
const pairs = { ')': '(', ']': '[', '}': '{' };
const stack = [];
let ok = true;
for (const c of s) {
  if (c === '(' || c === '[' || c === '{') {
    stack.push(c);
  } else if (stack.pop() !== pairs[c]) {
    ok = false;
    break;
  }
}
console.log(ok && stack.length === 0 ? 'Valid' : 'Invalid');
`,
    hints: [
      '数据结构就选栈：JS 用数组 push/pop，Go 用切片，Rust 用 Vec，C++ 用 vector。左括号 `( [ {` 直接入栈。',
      '遇到右括号 `) ] }` 时：先判断栈是否为空（空则直接 Invalid），再检查栈顶是不是对应的左括号——配一张「右括号 → 左括号」的对照表。配对成功弹出栈顶，不匹配立即判负。',
      '扫描结束后还要补最后一刀：栈非空说明有左括号没闭合（如 `(((`），输出 Invalid；只有「中途没错且栈空」才输出 Valid。',
    ],
    tests: [
      { name: '样例：依次闭合', stdin: '()[]{}\n', expected: 'Valid' },
      { name: '样例：括号交叉', stdin: '([)]\n', expected: 'Invalid' },
      { name: '样例：嵌套正确', stdin: '(([]){})\n', expected: 'Valid' },
      { name: '隐藏：类型不符', stdin: '(]\n', expected: 'Invalid', hidden: true },
      { name: '隐藏：右括号多', stdin: '][\n', expected: 'Invalid', hidden: true },
      { name: '隐藏：左括号未闭合', stdin: '{{[[()]]}}\n', expected: 'Valid', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const s = (readline() || '').trim();

// TODO 1: 建一个栈（数组 + push/pop 即可），准备一张「右括号 → 对应左括号」的对照表
// TODO 2: 从左往右扫描 s：左括号入栈；右括号先判栈空、再比对栈顶，配对则弹出
// TODO 3: 扫描结束且栈为空输出 Valid，否则 Invalid
console.log('Invalid'); // 占位，替换为你的判断结果
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	sc := bufio.NewScanner(os.Stdin)
	sc.Scan()
	s := strings.TrimSpace(sc.Text())

	// TODO 1: 用切片模拟栈，map[byte]byte 记录「右括号 → 对应左括号」
	// TODO 2: 扫描 s：左括号入栈；右括号先判栈空、再比对栈顶，配对则弹出
	// TODO 3: 扫描结束且栈空输出 Valid，否则 Invalid
	if len(s) >= 0 {
		fmt.Println("Invalid") // 占位，替换为你的判断结果
	}
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let s = line.trim();

    // TODO 1: 用 Vec<char> 当栈
    // TODO 2: match 扫描 s：左括号 push；右括号 pop 并检查是否配对（栈空或类型不符即 Invalid）
    // TODO 3: 扫描结束且栈空输出 Valid，否则 Invalid
    println!("Invalid"); // 占位，替换为你的判断结果
}
`,
        cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string s;
    cin >> s;

    // TODO 1: 用 vector<char> 当栈
    // TODO 2: 左括号 push_back；右括号先判 empty()，再检查 back() 是否配对，配对则 pop_back
    // TODO 3: 扫描结束且栈空输出 Valid，否则 Invalid
    cout << "Invalid" << "\\n"; // 占位，替换为你的判断结果
    return 0;
}
`,
      },
      solutions: {
        javascript: `const s = (readline() || '').trim();
const pairs = { ')': '(', ']': '[', '}': '{' };
const stack = [];
let ok = true;
for (const c of s) {
  if (c === '(' || c === '[' || c === '{') {
    stack.push(c);
  } else if (stack.pop() !== pairs[c]) {
    ok = false;
    break;
  }
}
console.log(ok && stack.length === 0 ? 'Valid' : 'Invalid');
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	sc := bufio.NewScanner(os.Stdin)
	sc.Scan()
	s := strings.TrimSpace(sc.Text())
	pairs := map[byte]byte{')': '(', ']': '[', '}': '{'}
	stack := make([]byte, 0)
	ok := true
	for i := 0; i < len(s) && ok; i++ {
		c := s[i]
		switch c {
		case '(', '[', '{':
			stack = append(stack, c)
		default:
			if len(stack) == 0 || stack[len(stack)-1] != pairs[c] {
				ok = false
			} else {
				stack = stack[:len(stack)-1]
			}
		}
	}
	if ok && len(stack) == 0 {
		fmt.Println("Valid")
	} else {
		fmt.Println("Invalid")
	}
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    let s = line.trim();
    let mut stack: Vec<char> = Vec::new();
    let mut ok = true;
    for c in s.chars() {
        match c {
            '(' | '[' | '{' => stack.push(c),
            ')' => { if stack.pop() != Some('(') { ok = false; break; } }
            ']' => { if stack.pop() != Some('[') { ok = false; break; } }
            '}' => { if stack.pop() != Some('{') { ok = false; break; } }
            _ => {}
        }
    }
    if ok && stack.is_empty() {
        println!("Valid");
    } else {
        println!("Invalid");
    }
}
`,
        cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string s;
    cin >> s;
    vector<char> st;
    bool ok = true;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push_back(c);
        } else {
            char want = (c == ')') ? '(' : (c == ']') ? '[' : '{';
            if (st.empty() || st.back() != want) { ok = false; break; }
            st.pop_back();
        }
    }
    cout << ((ok && st.empty()) ? "Valid" : "Invalid") << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'stack' },
  },
  {
    id: 'algo-advanced-2',
    lang: 'algo',
    module: 'advanced',
    order: 2,
    title: '队列：约瑟夫环',
    difficulty: 3,
    visualizer: { kind: 'josephus' },
    xp: 30,
    goals: [
      '掌握用队列（数组切片）模拟循环报数',
      '理解「前 m-1 个挪到队尾 + 第 m 个出列」的队列实现',
      '练习按出列顺序拼接单空格分隔的输出',
    ],
    brief: `## 队列：循环报数的「击鼓传花」

队列（Queue）只允许队尾入队、队头出队 —— 像排队买票，**先进先出（FIFO）**。用数组模拟：\`push\` 入队尾，\`shift\` 出队头（Go/C++ 用切片或 deque）。

约瑟夫环：n 个人围成一圈，从 1 号开始报数，报到 m 的人出列。把它想象成**击鼓传花**：花在谁手里谁出局。用队列模拟"转圈"特别巧妙：

\`\`\`text
队列 [1 2 3 4 5]，m=3：
把队头挪到队尾 2 次 → [3 4 5 1 2]
此时队头 3 正好是报到 3 的人 → 出列！
\`\`\`

每轮"挪 m-1 个 + 出列 1 个"，重复 n 轮即可，时间 O(n·m)，n ≤ 20 轻松通过。

> ⚠️ 易错点：① 报数从 1 号开始数 1，所以第一轮出列的是第 m 号 —— 实现为"挪 m-1 个再出列"；② 输出的是**出列顺序**，不是最后幸存者；③ 序列用单空格分隔。`,
    task: `## 任务：模拟约瑟夫环出列

n 个人围成一圈，编号 1~n。从 1 号开始从 1 报数，报到 m 的人出列；下一个人再从 1 重新报数……直到所有人出列。

**输入**：一行两个整数 n m（1 ≤ n ≤ 20，1 ≤ m ≤ 100）

**输出**：一行，n 个出列编号，按出列顺序以单空格分隔

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`5 3\` | \`3 1 5 2 4\` | 3 先出列；从 4 重新数：4,5,1 → 1 出列…… |
| \`6 2\` | \`2 4 6 3 1 5\` | 报到 2 就出列 |`,
    starter: `const [n, m] = readInts();

// TODO 1: 把 1~n 依次放进队列（数组即可，push 入队）
// TODO 2: 每轮把队头挪到队尾 m-1 次（出队再入队），然后取出队头记为出列者
// TODO 3: 重复 n 轮，出列编号以单空格分隔输出
console.log(n + ' ' + m); // 占位，替换为你的输出
`,
    solution: `const [n, m] = readInts();
const q = [];
for (let i = 1; i <= n; i++) q.push(i);
const out = [];
for (let round = 0; round < n; round++) {
  for (let i = 0; i < m - 1; i++) q.push(q.shift());
  out.push(q.shift());
}
console.log(out.join(' '));
`,
    hints: [
      '把 1~n 依次放进队列（JS 数组 push，C++ 用 deque）。核心口诀：每轮「报数」就是把队头挪到队尾，共挪 m-1 次。',
      '挪完 m-1 次后，队头正好是报到 m 的人——取出它记为出列者，下一轮继续。重复 n 轮即可。',
      '收集出列编号后以单空格拼接输出（JS join、Go strings.Join、C++ 手动控制分隔符、Rust join）。自查样例：`5 3` 应输出 `3 1 5 2 4`。',
    ],
    tests: [
      { name: '样例：5 人报 3', stdin: '5 3\n', expected: '3 1 5 2 4' },
      { name: '样例：6 人报 2', stdin: '6 2\n', expected: '2 4 6 3 1 5' },
      { name: '隐藏：单人', stdin: '1 1\n', expected: '1', hidden: true },
      { name: '隐藏：m 大于 n', stdin: '4 10\n', expected: '2 3 1 4', hidden: true },
      { name: '隐藏：7 人报 3', stdin: '7 3\n', expected: '3 6 2 7 5 1 4', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const [n, m] = readInts();

// TODO 1: 把 1~n 依次放进队列（数组即可，push 入队）
// TODO 2: 每轮把队头挪到队尾 m-1 次（出队再入队），然后取出队头记为出列者
// TODO 3: 重复 n 轮，出列编号以单空格分隔输出
console.log(n + ' ' + m); // 占位，替换为你的输出
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

	// TODO 1: 用切片模拟队列：装入 1~n
	// TODO 2: 每轮把队头挪到队尾 m-1 次（append(q[1:], q[0])），再取出队头记为出列者
	// TODO 3: 重复 n 轮，出列编号 strconv.Itoa 收集后 strings.Join(" ") 输出
	fmt.Println(strings.Join([]string{strconv.Itoa(n), strconv.Itoa(m)}, " ")) // 占位，替换为你的输出
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace().map(|x| x.parse::<usize>().unwrap());
    let n = it.next().unwrap();
    let m = it.next().unwrap();

    // TODO 1: 用 Vec 当队列，装入 1..=n
    // TODO 2: 每轮 remove(0) 再 push 到队尾 m-1 次，然后 remove(0) 记录出列者
    // TODO 3: 收集出列编号，join(" ") 输出
    println!("{} {}", n, m); // 占位，替换为你的输出
}
`,
        cpp: `#include <deque>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    // TODO 1: 用 deque 装入 1~n
    // TODO 2: 每轮 push_back(front()) + pop_front() 共 m-1 次，然后记录 front() 并 pop_front()
    // TODO 3: 重复 n 轮，单空格分隔输出出列序列
    cout << n << " " << m << "\\n"; // 占位，替换为你的输出
    return 0;
}
`,
      },
      solutions: {
        javascript: `const [n, m] = readInts();
const q = [];
for (let i = 1; i <= n; i++) q.push(i);
const out = [];
for (let round = 0; round < n; round++) {
  for (let i = 0; i < m - 1; i++) q.push(q.shift());
  out.push(q.shift());
}
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
	q := make([]int, 0, n)
	for i := 1; i <= n; i++ {
		q = append(q, i)
	}
	out := make([]string, 0, n)
	for r := 0; r < n; r++ {
		for i := 0; i < m-1; i++ {
			q = append(q[1:], q[0])
		}
		out = append(out, strconv.Itoa(q[0]))
		q = q[1:]
	}
	fmt.Println(strings.Join(out, " "))
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace().map(|x| x.parse::<usize>().unwrap());
    let n = it.next().unwrap();
    let m = it.next().unwrap();
    let mut q: Vec<usize> = (1..=n).collect();
    let mut out: Vec<String> = Vec::new();
    for _ in 0..n {
        for _ in 0..m - 1 {
            let front = q.remove(0);
            q.push(front);
        }
        out.push(q.remove(0).to_string());
    }
    println!("{}", out.join(" "));
}
`,
        cpp: `#include <deque>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    deque<int> q;
    for (int i = 1; i <= n; i++) q.push_back(i);
    vector<int> out;
    for (int r = 0; r < n; r++) {
        for (int i = 0; i < m - 1; i++) { q.push_back(q.front()); q.pop_front(); }
        out.push_back(q.front());
        q.pop_front();
    }
    for (size_t i = 0; i < out.size(); i++) {
        if (i) cout << ' ';
        cout << out[i];
    }
    cout << "\\n";
    return 0;
}
`,
      },
    },
  },
  {
    id: 'algo-advanced-3',
    lang: 'algo',
    module: 'advanced',
    order: 3,
    title: '哈希表：第一个重复数',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解哈希函数、桶与哈希冲突（拉链法）',
      '会用现成哈希容器（Set/map/HashSet/unordered_set）做存在性判断',
      '体会用空间换时间把 O(n²) 降到 O(n)',
    ],
    brief: `## 哈希表：O(1) 的「寄存柜」

哈希表（Hash Table）像超市寄存柜：把钥匙（key）交给**哈希函数**一算，直接得到柜子编号，存与查都是 O(1)。

两个不同的 key 可能算出同一个编号 —— 这叫**哈希冲突**。最常见的解法是**拉链法**：每个桶挂一条链表，冲突的元素依次往后串：

\`\`\`text
hash(key) % 3 → 桶0: 3 → 12 → 9
               桶1: 1 → 7
               桶2: (空)
\`\`\`

JS 的 \`Set/Map\`、Go 的 \`map\`、Rust 的 \`HashSet\`、C++ 的 \`unordered_set\` 都是现成的哈希表，直接用。

找「第一个重复数」：从左往右扫，每个数先问哈希表"见过吗"—— 见过就是答案；没见过就登记。每个数只查一次、存一次，时间 O(n)、空间 O(n)，比"两两比较"的 O(n²) 优雅得多。

> ⚠️ 易错点：① 顺序敏感 —— 找的是最早**再次出现**的数，不是出现次数最多的数；② 输入可能有负数（现成容器天然支持，自己取模做桶时要当心负数取模）；③ 无重复输出 \`-1\`。`,
    task: `## 任务：找出第一个重复出现的数

从左往右扫描一行整数，输出**第一个重复出现**的数（即扫描时发现它之前已经出现过）；若每个数都只出现一次，输出 \`-1\`。

**输入**：一行若干个整数（1~1000 个，绝对值 ≤ 10⁹，空格分隔）

**输出**：一行一个整数 —— 第一个重复数，或 \`-1\`

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`3 1 4 1 5 9 2 6 5\` | \`1\` | 扫到第二个 1 时发现 1 已出现过 |
| \`1 2 3 4\` | \`-1\` | 无重复 |
| \`5 5\` | \`5\` | 第二个 5 重复 |`,
    starter: `const a = readInts();

// TODO 1: 准备一个哈希集合 Set
// TODO 2: 从左往右扫描：先问集合「见过吗」，见过立即停下并记为答案；没见过就登记
// TODO 3: 扫描完都没遇到重复则输出 -1
console.log(-1); // 占位，替换为你的判断结果
`,
    solution: `const a = readInts();
const seen = new Set();
let ans = -1;
for (const x of a) {
  if (seen.has(x)) {
    ans = x;
    break;
  }
  seen.add(x);
}
console.log(ans);
`,
    hints: [
      '开一个哈希集合（JS `Set`、Go `map[int64]bool`、Rust `HashSet`、C++ `unordered_set`），从左往右扫描。',
      '每个数先问集合「见过吗」：见过 → 它就是第一个重复数，立即停；没见过 → 登记进集合再继续。',
      '扫描完都没遇到重复就输出 -1。注意找的是「最早再次出现」的数，不是出现次数最多的数；负数也能进现成的哈希容器。',
    ],
    tests: [
      { name: '样例：扫到第二个 1', stdin: '3 1 4 1 5 9 2 6 5\n', expected: '1' },
      { name: '样例：无重复', stdin: '1 2 3 4\n', expected: '-1' },
      { name: '隐藏：相邻重复', stdin: '5 5\n', expected: '5', hidden: true },
      { name: '隐藏：负数重复', stdin: '-2 7 -2 7\n', expected: '-2', hidden: true },
      { name: '隐藏：后置重复不算', stdin: '10 20 30 20 10\n', expected: '20', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const a = readInts();

// TODO 1: 准备一个哈希集合 Set
// TODO 2: 从左往右扫描：先问集合「见过吗」，见过立即停下并记为答案；没见过就登记
// TODO 3: 扫描完都没遇到重复则输出 -1
console.log(-1); // 占位，替换为你的判断结果
`,
        go: `package main

import "fmt"

func main() {
	// TODO 1: 用 map[int64]bool 做「已见集合」
	// TODO 2: 循环 fmt.Scan 读到 EOF；遇到已见过的数立即记为答案并停止
	// TODO 3: 输出第一个重复数，无重复输出 -1
	ans := int64(-1)
	fmt.Println(ans)
}
`,
        rust: `use std::collections::HashSet;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();

    // TODO 1: HashSet<i64> 做「已见集合」
    // TODO 2: 遍历 split_whitespace 的每个 token：insert 返回 false 说明已存在，记为答案并停止
    // TODO 3: 无重复输出 -1
    println!("-1"); // 占位，替换为你的判断结果
}
`,
        cpp: `#include <iostream>
#include <unordered_set>
using namespace std;

int main() {
    // TODO 1: unordered_set<long long> 做「已见集合」
    // TODO 2: while (cin >> x) 循环读入；已存在则记为答案并停止
    // TODO 3: 输出第一个重复数，无重复输出 -1
    long long ans = -1;
    cout << ans << "\\n";
    return 0;
}
`,
      },
      solutions: {
        javascript: `const a = readInts();
const seen = new Set();
let ans = -1;
for (const x of a) {
  if (seen.has(x)) {
    ans = x;
    break;
  }
  seen.add(x);
}
console.log(ans);
`,
        go: `package main

import "fmt"

func main() {
	seen := make(map[int64]bool)
	ans := int64(-1)
	var x int64
	for {
		_, err := fmt.Scan(&x)
		if err != nil {
			break
		}
		if seen[x] {
			ans = x
			break
		}
		seen[x] = true
	}
	fmt.Println(ans)
}
`,
        rust: `use std::collections::HashSet;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut ans: i64 = -1;
    let mut seen: HashSet<i64> = HashSet::new();
    for tok in input.split_whitespace() {
        let x: i64 = tok.parse().unwrap();
        if !seen.insert(x) {
            ans = x;
            break;
        }
    }
    println!("{}", ans);
}
`,
        cpp: `#include <iostream>
#include <unordered_set>
using namespace std;

int main() {
    unordered_set<long long> seen;
    long long x, ans = -1;
    while (cin >> x) {
        if (seen.count(x)) {
            ans = x;
            break;
        }
        seen.insert(x);
    }
    cout << ans << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'hash-table' },
  },
  {
    id: 'algo-advanced-4',
    lang: 'algo',
    module: 'advanced',
    order: 4,
    title: '链表反转（数组模拟）',
    difficulty: 2,
    xp: 25,
    goals: [
      '理解链表「节点 + next 指针」的结构',
      '掌握 prev/cur/nxt 三指针反转的推进逻辑',
      '能用对象或结构体模拟链表并按新顺序输出',
    ],
    brief: `## 链表反转：三指针掉头

链表像寻宝游戏：每个节点存着值和"下一张纸条"（next 指针），只能顺着走、不能回头。反转就是把每条 next 全部**掉头**。

经典做法用三个指针接力，一次扫完：

\`\`\`text
prev    cur     nxt
null ← [1]    [2] → [3] → …
每步：nxt 记住 cur.next，再让 cur.next 指回 prev，
     然后 prev=cur、cur=nxt 往前走
\`\`\`

全部走完后 \`prev\` 就是新链表的头。时间 O(n)、空间 O(1) —— 面试出镜率极高的一题。

本关用**数组模拟**：JS 用对象 \`{val, next}\` 当节点；Go/C++ 直接上结构体指针；Rust 的所有权模型下手写链表很别扭，用 \`Vec\` 存好后 \`reverse()\` 一行即可（思想相通：都是把顺序掉头）。

> ⚠️ 易错点：① 必须先用 nxt 保存 cur.next 再改指向，否则"断链"后找不到后继；② 单个元素也要正常输出；③ 输出用单空格分隔。`,
    task: `## 任务：反转序列（数组模拟链表）

读入一行整数，把它们看作一条链表（按读入顺序依次相连），反转整条链表后按新顺序输出。

**输入**：一行 1~1000 个整数（绝对值 ≤ 10⁹，空格分隔）

**输出**：一行，反转后的序列，单空格分隔

### 示例

| 输入 | 输出 |
| --- | --- |
| \`1 2 3 4 5\` | \`5 4 3 2 1\` |
| \`42\` | \`42\` |
| \`-1 0 7\` | \`7 0 -1\` |`,
    starter: `const a = readInts();

// TODO 1: 建链表：按读入顺序用 { val, next } 节点尾插相连（维护 head/tail）
// TODO 2: 三指针反转：prev = null, cur = head；每轮 nxt 记住 cur.next，再让 cur.next 指回 prev，最后 prev/cur 前移
// TODO 3: 从新头（prev）沿 next 收集值，单空格分隔输出
console.log(a.join(' ')); // 占位：当前输出原顺序，替换为反转后的输出
`,
    solution: `const a = readInts();
let head = null;
let tail = null;
for (const x of a) {
  const node = { val: x, next: null };
  if (head === null) { head = node; tail = node; }
  else { tail.next = node; tail = node; }
}
let prev = null;
let cur = head;
while (cur) {
  const nxt = cur.next;
  cur.next = prev;
  prev = cur;
  cur = nxt;
}
const out = [];
for (let p = prev; p; p = p.next) out.push(p.val);
console.log(out.join(' '));
`,
    hints: [
      '先按读入顺序建链表：JS 用对象 { val, next }，Go/C++ 用结构体指针，尾插法维护 head/tail。Rust 直接 Vec 存值再 reverse 即可。',
      '反转口诀（三指针）：每轮先用 nxt 记住 cur.next，再让 cur.next 指回 prev，然后 prev=cur、cur=nxt。循环结束时 prev 就是新链表头。',
      '从新头沿 next 收集值，单空格分隔输出。自查样例：`1 2 3 4 5` 应输出 `5 4 3 2 1`；单个数输出它本身。',
    ],
    tests: [
      { name: '样例：五个数', stdin: '1 2 3 4 5\n', expected: '5 4 3 2 1' },
      { name: '样例：单个数', stdin: '42\n', expected: '42' },
      { name: '隐藏：含负数与零', stdin: '-1 0 7\n', expected: '7 0 -1', hidden: true },
      { name: '隐藏：重复值', stdin: '1 1 2\n', expected: '2 1 1', hidden: true },
      { name: '隐藏：六个数', stdin: '10 20 30 40 50 60\n', expected: '60 50 40 30 20 10', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const a = readInts();

// TODO 1: 建链表：按读入顺序用 { val, next } 节点尾插相连（维护 head/tail）
// TODO 2: 三指针反转：prev = null, cur = head；每轮 nxt 记住 cur.next，再让 cur.next 指回 prev，最后 prev/cur 前移
// TODO 3: 从新头（prev）沿 next 收集值，单空格分隔输出
console.log(a.join(' ')); // 占位：当前输出原顺序，替换为反转后的输出
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type node struct {
	val  int
	next *node
}

func main() {
	sc := bufio.NewScanner(os.Stdin)
	sc.Split(bufio.ScanWords)
	var vals []int
	for sc.Scan() {
		v, _ := strconv.Atoi(sc.Text())
		vals = append(vals, v)
	}

	// TODO 1: 尾插法建链表（用上面定义的 node，维护 head/tail 指针）
	// TODO 2: 三指针反转：prev=nil, cur=head；每轮 nxt 记住 cur.next，再让 cur.next 指回 prev
	// TODO 3: 从反转后的新头沿 next 收集值，strings.Join 以单空格输出
	parts := make([]string, len(vals))
	for i, v := range vals {
		parts[i] = strconv.Itoa(v)
	}
	fmt.Println(strings.Join(parts, " ")) // 占位：当前输出原顺序，替换为反转后的输出
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut a: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: 把 a 整体反转
    // TODO 2: 拼成单空格分隔的字符串输出
    a.sort(); // 占位，替换为 reverse
    let out: Vec<String> = a.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

struct Node { long long val; Node* next; Node(long long v): val(v), next(nullptr) {} };

int main() {
    vector<long long> a;
    long long x;
    while (cin >> x) a.push_back(x);

    // TODO 1: 用 a 里的值按原顺序尾插法建链表（维护 head/tail 指针）
    // TODO 2: 三指针反转：prev=nullptr, cur=head；每轮 nxt 记住 cur->next，再让 cur->next 指回 prev
    // TODO 3: 从新头沿 next 输出（单空格分隔）
    for (size_t i = 0; i < a.size(); i++) {
        if (i) cout << ' ';
        cout << a[i];
    }
    cout << "\\n"; // 占位：当前输出原顺序，替换为反转后的输出
    return 0;
}
`,
      },
      solutions: {
        javascript: `const a = readInts();
let head = null;
let tail = null;
for (const x of a) {
  const node = { val: x, next: null };
  if (head === null) { head = node; tail = node; }
  else { tail.next = node; tail = node; }
}
let prev = null;
let cur = head;
while (cur) {
  const nxt = cur.next;
  cur.next = prev;
  prev = cur;
  cur = nxt;
}
const out = [];
for (let p = prev; p; p = p.next) out.push(p.val);
console.log(out.join(' '));
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type node struct {
	val  int
	next *node
}

func main() {
	sc := bufio.NewScanner(os.Stdin)
	sc.Split(bufio.ScanWords)
	var head, tail *node
	for sc.Scan() {
		v, _ := strconv.Atoi(sc.Text())
		n := &node{val: v}
		if head == nil {
			head, tail = n, n
		} else {
			tail.next = n
			tail = n
		}
	}
	var prev *node
	for cur := head; cur != nil; {
		nxt := cur.next
		cur.next = prev
		prev = cur
		cur = nxt
	}
	var sb strings.Builder
	for p := prev; p != nil; p = p.next {
		if sb.Len() > 0 {
			sb.WriteByte(' ')
		}
		sb.WriteString(strconv.Itoa(p.val))
	}
	fmt.Println(sb.String())
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut a: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    a.reverse();
    let out: Vec<String> = a.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}
`,
        cpp: `#include <iostream>
using namespace std;

struct Node { long long val; Node* next; Node(long long v): val(v), next(nullptr) {} };

int main() {
    Node *head = nullptr, *tail = nullptr;
    long long x;
    while (cin >> x) {
        Node* n = new Node(x);
        if (!head) head = tail = n;
        else { tail->next = n; tail = n; }
    }
    Node *prev = nullptr;
    for (Node* cur = head; cur; ) {
        Node* nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    bool first = true;
    for (Node* p = prev; p; p = p->next) {
        if (!first) cout << ' ';
        cout << p->val;
        first = false;
    }
    cout << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'linked-list' },
  },
  {
    id: 'algo-advanced-5',
    lang: 'algo',
    module: 'advanced',
    order: 5,
    title: 'BST：插入与中序遍历',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握 BST「左小右大」的插入过程',
      '掌握中序遍历（左→根→右）的递归实现',
      '理解「BST 中序遍历 = 升序序列」这一性质',
    ],
    brief: `## 二叉搜索树：左小右大的分叉路

BST（Binary Search Tree）每个节点满足：**左子树全部 < 根 < 右子树全部**。像玩猜数字：比它小往左走，比它大往右走，每步排除一半，查找/插入平均 O(log n)。

插入新值就是一路"猜数字"到底：小往左、大往右，空位就是它的新家。

本关的主角是**中序遍历**（左 → 根 → 右）。在 BST 上做中序遍历，得到的恰好是**升序序列** —— "先访问所有比根小的，再访问根，再访问所有比根大的"，递归成立。这也是"验证 BST""第 k 小"等题的基石。

\`\`\`text
      5
     / \\
    3   8        中序遍历：1 3 4 5 8（天然有序）
   / \\
  1   4
\`\`\`

递归写法三行搞定：遍历 O(n)，n 次插入共 O(n log n)（最坏退化成链表 O(n²)，本题 n 很小无妨）。

> ⚠️ 易错点：① 别把中序记成"根左右"（那是先序）；② 递归要有终止条件（空节点直接返回）；③ 输出单空格分隔。`,
    task: `## 任务：建 BST 并中序遍历

第一行给出 n，第二行给出 n 个**互不相同**的整数（按插入顺序）。依次将它们插入一棵空的二叉搜索树（小于当前节点往左，大于往右），然后输出这棵树的**中序遍历**（左 → 根 → 右）。

**输入**：两行 —— 第一行 n（1 ≤ n ≤ 100）；第二行 n 个互异整数（绝对值 ≤ 10⁹）

**输出**：一行，中序遍历结果，单空格分隔（应当恰好是升序）

### 示例

| 输入 | 输出 |
| --- | --- |
| 第一行 \`5\`<br>第二行 \`5 3 8 1 4\` | \`1 3 4 5 8\` |
| 第一行 \`1\`<br>第二行 \`7\` | \`7\` |`,
    starter: `const n = Number(readline());
const a = readInts();

// TODO 1: 定义节点 { val, left, right }，写 insert(root, val)：小于往左、大于往右
// TODO 2: 依次把 a 插入一棵空 BST
// TODO 3: 中序遍历（左→根→右）收集值，单空格分隔输出
console.log(a.join(' ')); // 占位，替换为你的输出
`,
    solution: `const n = Number(readline());
const a = readInts();
function insert(root, val) {
  if (root === null) return { val, left: null, right: null };
  if (val < root.val) root.left = insert(root.left, val);
  else root.right = insert(root.right, val);
  return root;
}
let root = null;
for (let i = 0; i < n; i++) root = insert(root, a[i]);
const out = [];
(function inorder(node) {
  if (!node) return;
  inorder(node.left);
  out.push(node.val);
  inorder(node.right);
})(root);
console.log(out.join(' '));
`,
    hints: [
      'BST 插入：从根出发，比当前节点小往左子树走，大往右走，走到空位就是新节点的位置。递归或循环实现都可以。',
      '中序遍历 = 递归左子树 → 访问根 → 递归右子树；空节点直接返回，这就是递归出口。',
      '把遍历到的值收集起来，单空格分隔输出——结果应当恰好是升序（这正是 BST 的性质，可用来自查）。',
    ],
    tests: [
      { name: '样例：五个数', stdin: '5\n5 3 8 1 4\n', expected: '1 3 4 5 8' },
      { name: '样例：单个数', stdin: '1\n7\n', expected: '7' },
      { name: '样例：完美七节点', stdin: '7\n50 30 70 20 40 60 80\n', expected: '20 30 40 50 60 70 80' },
      { name: '隐藏：递减插入成链', stdin: '6\n9 7 5 3 1 -2\n', expected: '-2 1 3 5 7 9', hidden: true },
      { name: '隐藏：八节点混合', stdin: '8\n10 5 15 2 7 12 20 1\n', expected: '1 2 5 7 10 12 15 20', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const n = Number(readline());
const a = readInts();

// TODO 1: 定义节点 { val, left, right }，写 insert(root, val)：小于往左、大于往右
// TODO 2: 依次把 a 插入一棵空 BST
// TODO 3: 中序遍历（左→根→右）收集值，单空格分隔输出
console.log(a.join(' ')); // 占位，替换为你的输出
`,
        go: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

type treeNode struct {
	val         int
	left, right *treeNode
}

func main() {
	var n int
	fmt.Scan(&n)

	// TODO 1: 循环读入 n 个数，逐个插入 BST（小于往左、大于往右，走到空位即插入）
	// TODO 2: 中序遍历：递归左子树 → 访问根 → 递归右子树，空节点返回
	// TODO 3: 结果 strconv.Itoa 收集后 strings.Join(" ") 输出
	parts := []string{strconv.Itoa(n)}
	fmt.Println(strings.Join(parts, " ")) // 占位，替换为你的输出
}
`,
        rust: `use std::io::{self, Read};

// TODO 1: 定义 Node { val: i64, left/right: Option<Box<Node>> } 和 insert 函数
// TODO 2: 中序遍历函数：递归左 → 收集根 → 递归右
fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let toks: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let n = toks[0] as usize;
    println!("{}", n); // 占位，替换为你的输出
}
`,
        cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

// TODO 1: 定义 struct Node { long long val; Node *left, *right; } 与 insert 函数
// TODO 2: 中序遍历函数：递归左 → 收集根 → 递归右
int main() {
    int n;
    cin >> n;
    cout << n << "\\n"; // 占位，替换为你的输出
    return 0;
}
`,
      },
      solutions: {
        javascript: `const n = Number(readline());
const a = readInts();
function insert(root, val) {
  if (root === null) return { val, left: null, right: null };
  if (val < root.val) root.left = insert(root.left, val);
  else root.right = insert(root.right, val);
  return root;
}
let root = null;
for (let i = 0; i < n; i++) root = insert(root, a[i]);
const out = [];
(function inorder(node) {
  if (!node) return;
  inorder(node.left);
  out.push(node.val);
  inorder(node.right);
})(root);
console.log(out.join(' '));
`,
        go: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

type treeNode struct {
	val         int
	left, right *treeNode
}

func insert(root *treeNode, v int) *treeNode {
	if root == nil {
		return &treeNode{val: v}
	}
	if v < root.val {
		root.left = insert(root.left, v)
	} else {
		root.right = insert(root.right, v)
	}
	return root
}

func inorder(root *treeNode, out *[]string) {
	if root == nil {
		return
	}
	inorder(root.left, out)
	*out = append(*out, strconv.Itoa(root.val))
	inorder(root.right, out)
}

func main() {
	var n int
	fmt.Scan(&n)
	var root *treeNode
	for i := 0; i < n; i++ {
		var x int
		fmt.Scan(&x)
		root = insert(root, x)
	}
	out := []string{}
	inorder(root, &out)
	fmt.Println(strings.Join(out, " "))
}
`,
        rust: `use std::io::{self, Read};

struct Node { val: i64, left: Option<Box<Node>>, right: Option<Box<Node>> }

fn insert(node: &mut Option<Box<Node>>, val: i64) {
    match node {
        None => *node = Some(Box::new(Node { val, left: None, right: None })),
        Some(n) => if val < n.val { insert(&mut n.left, val) } else { insert(&mut n.right, val) },
    }
}

fn inorder(node: &Option<Box<Node>>, out: &mut Vec<String>) {
    if let Some(n) = node {
        inorder(&n.left, out);
        out.push(n.val.to_string());
        inorder(&n.right, out);
    }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let toks: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let n = toks[0] as usize;
    let mut root = None;
    for i in 1..=n { insert(&mut root, toks[i]); }
    let mut out: Vec<String> = Vec::new();
    inorder(&root, &mut out);
    println!("{}", out.join(" "));
}
`,
        cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Node { long long val; Node *left, *right; Node(long long v): val(v), left(nullptr), right(nullptr) {} };

Node* insert(Node* root, long long v) {
    if (!root) return new Node(v);
    if (v < root->val) root->left = insert(root->left, v);
    else root->right = insert(root->right, v);
    return root;
}

void inorder(Node* root, vector<long long>& out) {
    if (!root) return;
    inorder(root->left, out);
    out.push_back(root->val);
    inorder(root->right, out);
}

int main() {
    int n;
    cin >> n;
    Node* root = nullptr;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        root = insert(root, x);
    }
    vector<long long> out;
    inorder(root, out);
    for (size_t i = 0; i < out.size(); i++) {
        if (i) cout << ' ';
        cout << out[i];
    }
    cout << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'tree-traversal', param: 'inorder' },
  },
  {
    id: 'algo-advanced-6',
    lang: 'algo',
    module: 'advanced',
    order: 6,
    title: 'BFS：网格最短路',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解 BFS 逐层扩散、首次到达即最短的性质',
      '掌握队列 + dist 数组的 BFS 模板（四方向扩展）',
      '注意越界检查、防重复入队与不可达输出 -1',
    ],
    brief: `## BFS：水波纹式扩散找最短路

广度优先搜索（BFS）像往池塘里扔石子：水波**一圈一圈**向外扩散，先浸到的地方一定近。因此从起点 BFS，第一次到达某个格子时用的步数就是**最短步数**。

实现要点：

1. 队列里放"待扩散的格子"，起点步数为 0；
2. 每次取出队头，向**上下左右**四个方向扩展没走过的空格，步数 = 当前 + 1；
3. 用 \`dist\` 数组记录步数兼"到访标记"，防止重复入队死循环。

\`\`\`text
0 0 1        dist:  0 1  -        （- 表示墙）
1 0 0   →           - 2  3
0 0 0               6 5  4
\`\`\`

时间复杂度 O(行×列)，每个格子至多入队一次。

> ⚠️ 易错点：① 忘记标记已到访，格子被反复入队导致死循环；② 扩展前先判 \`0 ≤ 新坐标 < 5\`，否则数组越界；③ 不可达时 \`dist[4][4]\` 保持 -1，直接输出 \`-1\`。`,
    task: `## 任务：网格 BFS 最短步数

给定 5×5 网格，\`0\` 表示通路，\`1\` 表示墙。从左上角 (0,0) 出发走到右下角 (4,4)，每步可以向**上下左右**移动一格（不能出界、不能穿墙），起点和终点保证是通路。

**输入**：5 行，每行 5 个数（0 或 1），以空格分隔

**输出**：一行一个整数 —— 最短步数（移动次数）；若 (4,4) 不可达，输出 \`-1\`

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`0 0 0 0 0\`<br>\`0 1 1 1 0\`<br>\`0 0 0 0 0\`<br>\`0 1 1 1 0\`<br>\`0 0 0 0 0\` | \`8\` | (0,0)↓(1,0)↓(2,0)→(2,1)…(2,4)↓(3,4)↓(4,4)，共 8 步 |
| \`0 0 0 0 0\`<br>\`0 1 1 1 1\`<br>\`0 1 0 0 0\`<br>\`0 1 0 1 0\`<br>\`0 1 0 0 0\` | \`-1\` | 中间的墙把两侧隔开 |

提示：\`dist\` 数组同时完成"记录步数"和"防重复访问"两件事。`,
    starter: `const g = [];
for (let i = 0; i < 5; i++) {
  const row = readline().split(' ').join(''); // 去掉空格，得到如 01010 的行
  g.push(row.split('').map(Number));
}

// TODO 1: dist 表初始化为 -1（5×5），dist[0][0] = 0，起点入队
// TODO 2: BFS：每轮出队一个格子，向上下左右扩展「不出界、是通路、未访问」的格子，dist = 当前 + 1
// TODO 3: 队列空后输出 dist[4][4]（不可达保持 -1）
console.log(-1); // 占位，替换为你的计算结果
`,
    solution: `const g = [];
for (let i = 0; i < 5; i++) {
  const row = readline().split(' ').join('');
  g.push(row.split('').map(Number));
}
const dist = [];
for (let i = 0; i < 5; i++) dist.push([-1, -1, -1, -1, -1]);
dist[0][0] = 0;
const qx = [0];
const qy = [0];
let head = 0;
const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
while (head < qx.length) {
  const x = qx[head], y = qy[head];
  head++;
  for (const d of dirs) {
    const nx = x + d[0], ny = y + d[1];
    if (nx < 0 || nx >= 5 || ny < 0 || ny >= 5) continue;
    if (g[nx][ny] !== 0 || dist[nx][ny] !== -1) continue;
    dist[nx][ny] = dist[x][y] + 1;
    qx.push(nx);
    qy.push(ny);
  }
}
console.log(dist[4][4]);
`,
    hints: [
      'BFS 模板：dist 表全部初始化为 -1，dist[0][0] = 0，起点入队；每轮取出队头，向上下左右扩展。',
      '扩展条件三连：不出界（0 ≤ 新坐标 < 5）、是通路（g=0）、未访问（dist=-1）。满足就把 dist 设为当前+1 并入队。dist 数组兼任 visited，防死循环。',
      '队列空了就结束，输出 dist[4][4]——不可达时它保持 -1，正好直接输出。自查：无墙网格答案应是 8（曼哈顿距离）。',
    ],
    tests: [
      { name: '样例：蛇形通道', stdin: '0 0 0 0 0\n1 1 1 1 0\n0 0 0 0 0\n0 1 1 1 1\n0 0 0 0 0\n', expected: '16' },
      { name: '样例：不可达', stdin: '0 0 0 0 0\n0 1 1 1 1\n0 1 0 0 0\n0 1 0 1 0\n0 1 0 0 0\n', expected: '-1' },
      { name: '样例：直路 8 步', stdin: '0 0 0 0 0\n0 1 1 1 0\n0 0 0 0 0\n0 1 1 1 0\n0 0 0 0 0\n', expected: '8' },
      { name: '隐藏：绕行仍 8 步', stdin: '0 1 0 0 0\n0 1 0 1 0\n0 0 0 1 0\n0 1 1 1 0\n0 0 0 0 0\n', expected: '8', hidden: true },
      { name: '隐藏：底部绕行 10 步', stdin: '0 1 0 0 0\n0 1 0 1 0\n0 1 0 1 0\n0 1 0 0 0\n0 0 0 1 0\n', expected: '10', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const g = [];
for (let i = 0; i < 5; i++) {
  const row = readline().split(' ').join(''); // 去掉空格，得到如 01010 的行
  g.push(row.split('').map(Number));
}

// TODO 1: dist 表初始化为 -1（5×5），dist[0][0] = 0，起点入队
// TODO 2: BFS：每轮出队一个格子，向上下左右扩展「不出界、是通路、未访问」的格子，dist = 当前 + 1
// TODO 3: 队列空后输出 dist[4][4]（不可达保持 -1）
console.log(-1); // 占位，替换为你的计算结果
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	sc := bufio.NewScanner(os.Stdin)
	g := make([][]int, 5)
	for i := 0; i < 5; i++ {
		sc.Scan()
		line := strings.ReplaceAll(sc.Text(), " ", "")
		g[i] = make([]int, 5)
		for j := 0; j < 5; j++ {
			g[i][j] = int(line[j] - '0')
		}
	}

	// TODO 1: dist 初始化为 -1 的 5×5 表，dist[0][0]=0；用切片当 BFS 队列
	// TODO 2: 出队一个格子，向上下左右扩展：不出界、g 为 0、dist 为 -1 → dist=当前+1 并入队
	// TODO 3: 循环结束输出 dist[4][4]（不可达保持 -1）
	fmt.Println(-1) // 占位，替换为你的计算结果
}
`,
        rust: `use std::io::stdin;

fn main() {
    let mut g = vec![vec![0i64; 5]; 5];
    for i in 0..5 {
        let mut line = String::new();
        stdin().read_line(&mut line).unwrap();
        let chars: Vec<char> = line.chars().filter(|c| !c.is_whitespace()).collect();
        for j in 0..5 {
            g[i][j] = chars[j].to_digit(10).unwrap() as i64;
        }
    }

    // TODO 1: dist 初始化为 -1 的 5×5 表，dist[0][0]=0；用 VecDeque 当 BFS 队列
    // TODO 2: 出队一个格子，向上下左右扩展：不出界、g 为 0、dist 为 -1 → dist=当前+1 并入队
    // TODO 3: 循环结束输出 dist[4][4]（不可达保持 -1）
    println!("{}", -1); // 占位，替换为你的计算结果
}
`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    int g[5][5];
    char c;
    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++) {
            cin >> c; // cin 读 char 会自动跳过空格和换行
            g[i][j] = c - '0';
        }

    // TODO 1: dist 初始化为 -1，dist[0][0]=0；用数组模拟 BFS 队列
    // TODO 2: 出队一个格子，向上下左右扩展：不出界、g 为 0、dist 为 -1 → dist=当前+1 并入队
    // TODO 3: 循环结束输出 dist[4][4]（不可达保持 -1）
    cout << -1 << "\\n"; // 占位，替换为你的计算结果
    return 0;
}
`,
      },
      solutions: {
        javascript: `const g = [];
for (let i = 0; i < 5; i++) {
  const row = readline().split(' ').join('');
  g.push(row.split('').map(Number));
}
const dist = [];
for (let i = 0; i < 5; i++) dist.push([-1, -1, -1, -1, -1]);
dist[0][0] = 0;
const qx = [0];
const qy = [0];
let head = 0;
const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
while (head < qx.length) {
  const x = qx[head], y = qy[head];
  head++;
  for (const d of dirs) {
    const nx = x + d[0], ny = y + d[1];
    if (nx < 0 || nx >= 5 || ny < 0 || ny >= 5) continue;
    if (g[nx][ny] !== 0 || dist[nx][ny] !== -1) continue;
    dist[nx][ny] = dist[x][y] + 1;
    qx.push(nx);
    qy.push(ny);
  }
}
console.log(dist[4][4]);
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	sc := bufio.NewScanner(os.Stdin)
	g := make([][]int, 5)
	for i := 0; i < 5; i++ {
		sc.Scan()
		line := strings.ReplaceAll(sc.Text(), " ", "")
		g[i] = make([]int, 5)
		for j := 0; j < 5; j++ {
			g[i][j] = int(line[j] - '0')
		}
	}
	dist := make([][]int, 5)
	for i := range dist {
		dist[i] = []int{-1, -1, -1, -1, -1}
	}
	dist[0][0] = 0
	type pair struct{ x, y int }
	q := []pair{{0, 0}}
	dirs := [4][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
	for len(q) > 0 {
		p := q[0]
		q = q[1:]
		for _, d := range dirs {
			nx, ny := p.x+d[0], p.y+d[1]
			if nx < 0 || nx >= 5 || ny < 0 || ny >= 5 || g[nx][ny] != 0 || dist[nx][ny] != -1 {
				continue
			}
			dist[nx][ny] = dist[p.x][p.y] + 1
			q = append(q, pair{nx, ny})
		}
	}
	fmt.Println(dist[4][4])
}
`,
        rust: `use std::collections::VecDeque;
use std::io::stdin;

fn main() {
    let mut g = vec![vec![0i64; 5]; 5];
    for i in 0..5 {
        let mut line = String::new();
        stdin().read_line(&mut line).unwrap();
        let chars: Vec<char> = line.chars().filter(|c| !c.is_whitespace()).collect();
        for j in 0..5 {
            g[i][j] = chars[j].to_digit(10).unwrap() as i64;
        }
    }
    let mut dist = [[-1i64; 5]; 5];
    dist[0][0] = 0;
    let mut q: VecDeque<(usize, usize)> = VecDeque::new();
    q.push_back((0, 0));
    let dirs = [(1i64, 0i64), (-1, 0), (0, 1), (0, -1)];
    while let Some((x, y)) = q.pop_front() {
        for d in dirs.iter() {
            let nx = x as i64 + d.0;
            let ny = y as i64 + d.1;
            if nx < 0 || nx >= 5 || ny < 0 || ny >= 5 { continue; }
            let (nx, ny) = (nx as usize, ny as usize);
            if g[nx][ny] != 0 || dist[nx][ny] != -1 { continue; }
            dist[nx][ny] = dist[x][y] + 1;
            q.push_back((nx, ny));
        }
    }
    println!("{}", dist[4][4]);
}
`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    int g[5][5];
    char c;
    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++) { cin >> c; g[i][j] = c - '0'; }
    int dist[5][5];
    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++) dist[i][j] = -1;
    int qx[25], qy[25], head = 0, tail = 0;
    dist[0][0] = 0;
    qx[tail] = 0; qy[tail] = 0; tail++;
    int dx[4] = {1, -1, 0, 0}, dy[4] = {0, 0, 1, -1};
    while (head < tail) {
        int x = qx[head], y = qy[head];
        head++;
        for (int k = 0; k < 4; k++) {
            int nx = x + dx[k], ny = y + dy[k];
            if (nx < 0 || nx >= 5 || ny < 0 || ny >= 5) continue;
            if (g[nx][ny] != 0 || dist[nx][ny] != -1) continue;
            dist[nx][ny] = dist[x][y] + 1;
            qx[tail] = nx; qy[tail] = ny; tail++;
        }
    }
    cout << dist[4][4] << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'grid', param: 'bfs' },
  },
  {
    id: 'algo-advanced-7',
    lang: 'algo',
    module: 'advanced',
    order: 7,
    title: 'DFS：连通块计数',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解 DFS 递归探路「走到黑再回头」的过程',
      '掌握连通块计数：遇到新陆地处数 +1 并淹没整座岛',
      '明确四方向相邻才连通、对角不算',
    ],
    brief: `## DFS：深挖到底的「探洞法」

深度优先搜索（DFS）像探洞：选定一个洞口就一头扎到底，走到无路可走再退回来换条岔路，直到整个洞系都被踩过一遍。递归天然适合表达它："访问 → 标记 → 对每个邻居递归"。

数岛屿就是经典应用：每个 \`#\` 格子是陆地，**上下左右**相邻的陆地组成同一座岛。策略：

1. 从左上到右下扫描，每遇到一个没被踩过的 \`#\`，岛屿数 +1；
2. 立刻从它出发 DFS，把整座岛（四方向连通的所有 \`#\`）全部标记成水，防止重复计数。

\`\`\`text
# # .        两座岛：
. . #        ① 左上的 ##（左右相邻）
             ② 右下的 #（和它对角的都不算相邻）
\`\`\`

时间复杂度 O(行×列) —— 每个格子至多被访问一次。对角线**不连通**（只算四方向），这是最常见的理解偏差。

> ⚠️ 易错点：① 递归开头先判越界和"是不是陆地"，否则数组越界；② 标记要在进入格子时立刻做（改成 \`.\` 或 visited），否则同一格被重复递归可能爆栈；③ 全水地图输出 0。`,
    task: `## 任务：数出岛屿数量

给定 4×4 字符网格，\`.\` 表示水，\`#\` 表示陆地。**上下左右**相邻的陆地组成同一座岛（对角相邻不算），求岛屿数量。

**输入**：4 行，每行 4 个字符（\`.\` 或 \`#\`，中间无空格）

**输出**：一行一个整数 —— 岛屿数量

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| \`.##.\`<br>\`.#..\`<br>\`..#.\`<br>\`#.##\` | \`3\` | 左上一片、(2,2) 连底部两格、左下角各一座 |
| \`....\`<br>\`....\`<br>\`....\`<br>\`....\` | \`0\` | 全是水 |`,
    starter: `const g = [];
for (let i = 0; i < 4; i++) {
  g.push(readline().split(' ').join('').split('')); // 每行拆成字符数组
}

// TODO 1: 写 dfs(x, y)：越界或 g[x][y] 不是 # 时返回；否则把 g[x][y] 改成 .，再向四方向递归
// TODO 2: 双重循环扫描，每遇到 # 就岛屿计数 +1 并调用 dfs 淹没整座岛
// TODO 3: 输出岛屿数量
console.log(0); // 占位，替换为你的计算结果
`,
    solution: `const g = [];
for (let i = 0; i < 4; i++) {
  g.push(readline().split(' ').join('').split(''));
}
let count = 0;
function dfs(x, y) {
  if (x < 0 || x >= 4 || y < 0 || y >= 4 || g[x][y] !== '#') return;
  g[x][y] = '.';
  dfs(x + 1, y);
  dfs(x - 1, y);
  dfs(x, y + 1);
  dfs(x, y - 1);
}
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    if (g[i][j] === '#') {
      count++;
      dfs(i, j);
    }
  }
}
console.log(count);
`,
    hints: [
      '双重循环扫描网格，每遇到一个还没被淹掉的 # 就计数 +1，然后从它出发 DFS 把整座岛（所有四方向连通的 #）标成水。',
      'DFS 写法：开头先判越界和「当前格是不是 #」，不满足就 return；否则把 g[x][y] 改成 . ，再对上下左右四个方向递归。',
      '注意对角线不算相邻（只有四方向）；全水地图输出 0。自查样例：`.##.`/`.#..`/`..#.`/`#.##` 应输出 3。',
    ],
    tests: [
      { name: '样例：三座岛', stdin: '.##.\n.#..\n..#.\n#.##\n', expected: '3' },
      { name: '样例：全水', stdin: '....\n....\n....\n....\n', expected: '0' },
      { name: '样例：整块大陆', stdin: '####\n####\n####\n####\n', expected: '1' },
      { name: '隐藏：四角各一座', stdin: '#..#\n....\n#..#\n#..#\n', expected: '4', hidden: true },
      { name: '隐藏：对角不连通', stdin: '##..\n.#..\n..#.\n...#\n', expected: '3', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const g = [];
for (let i = 0; i < 4; i++) {
  g.push(readline().split(' ').join('').split('')); // 每行拆成字符数组
}

// TODO 1: 写 dfs(x, y)：越界或 g[x][y] 不是 # 时返回；否则把 g[x][y] 改成 .，再向四方向递归
// TODO 2: 双重循环扫描，每遇到 # 就岛屿计数 +1 并调用 dfs 淹没整座岛
// TODO 3: 输出岛屿数量
console.log(0); // 占位，替换为你的计算结果
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

var g [][]byte

func dfs(x, y int) {
	// TODO: 越界或 g[x][y] != '#' 时返回；否则把 g[x][y] 改成 '.'，再向四方向递归
}

func main() {
	sc := bufio.NewScanner(os.Stdin)
	g = make([][]byte, 4)
	for i := 0; i < 4; i++ {
		sc.Scan()
		g[i] = []byte(strings.ReplaceAll(sc.Text(), " ", ""))
	}

	// TODO 1: 双重循环扫描，每遇到 '#'：计数 +1 并调用 dfs 淹没整座岛
	// TODO 2: 输出岛屿数量
	fmt.Println(0) // 占位，替换为你的计算结果
}
`,
        rust: `use std::io::stdin;

// TODO: 写 dfs(g: &mut Vec<Vec<char>>, x: i32, y: i32)：越界或不是 '#' 时返回；
//       否则把该格改成 '.'，再向四方向递归
fn main() {
    let mut g: Vec<Vec<char>> = Vec::new();
    for _ in 0..4 {
        let mut line = String::new();
        stdin().read_line(&mut line).unwrap();
        g.push(line.chars().filter(|c| !c.is_whitespace()).collect());
    }

    // TODO 1: 双重循环扫描，每遇到 '#'：计数 +1 并调用 dfs 淹没整座岛
    // TODO 2: 输出岛屿数量
    println!("{}", 0); // 占位，替换为你的计算结果
}
`,
        cpp: `#include <iostream>
using namespace std;

char g[4][4];

void dfs(int x, int y) {
    // TODO: 越界或 g[x][y] != '#' 时返回；否则把 g[x][y] 改为 '.'，再向四方向递归
}

int main() {
    char c;
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++) {
            cin >> c; // cin 读 char 会自动跳过空白
            g[i][j] = c;
        }

    // TODO 1: 双重循环扫描，每遇到 '#'：计数 +1 并调用 dfs 淹没整座岛
    // TODO 2: 输出岛屿数量
    cout << 0 << "\\n"; // 占位，替换为你的计算结果
    return 0;
}
`,
      },
      solutions: {
        javascript: `const g = [];
for (let i = 0; i < 4; i++) {
  g.push(readline().split(' ').join('').split(''));
}
let count = 0;
function dfs(x, y) {
  if (x < 0 || x >= 4 || y < 0 || y >= 4 || g[x][y] !== '#') return;
  g[x][y] = '.';
  dfs(x + 1, y);
  dfs(x - 1, y);
  dfs(x, y + 1);
  dfs(x, y - 1);
}
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    if (g[i][j] === '#') {
      count++;
      dfs(i, j);
    }
  }
}
console.log(count);
`,
        go: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

var g [][]byte

func dfs(x, y int) {
	if x < 0 || x >= 4 || y < 0 || y >= 4 || g[x][y] != '#' {
		return
	}
	g[x][y] = '.'
	dfs(x+1, y)
	dfs(x-1, y)
	dfs(x, y+1)
	dfs(x, y-1)
}

func main() {
	sc := bufio.NewScanner(os.Stdin)
	g = make([][]byte, 4)
	for i := 0; i < 4; i++ {
		sc.Scan()
		g[i] = []byte(strings.ReplaceAll(sc.Text(), " ", ""))
	}
	count := 0
	for i := 0; i < 4; i++ {
		for j := 0; j < 4; j++ {
			if g[i][j] == '#' {
				count++
				dfs(i, j)
			}
		}
	}
	fmt.Println(count)
}
`,
        rust: `use std::io::stdin;

fn dfs(g: &mut Vec<Vec<char>>, x: i32, y: i32) {
    if x < 0 || x >= 4 || y < 0 || y >= 4 {
        return;
    }
    if g[x as usize][y as usize] != '#' {
        return;
    }
    g[x as usize][y as usize] = '.';
    dfs(g, x + 1, y);
    dfs(g, x - 1, y);
    dfs(g, x, y + 1);
    dfs(g, x, y - 1);
}

fn main() {
    let mut g: Vec<Vec<char>> = Vec::new();
    for _ in 0..4 {
        let mut line = String::new();
        stdin().read_line(&mut line).unwrap();
        g.push(line.chars().filter(|c| !c.is_whitespace()).collect());
    }
    let mut count = 0;
    for i in 0..4 {
        for j in 0..4 {
            if g[i][j] == '#' {
                count += 1;
                dfs(&mut g, i as i32, j as i32);
            }
        }
    }
    println!("{}", count);
}
`,
        cpp: `#include <iostream>
using namespace std;

char g[4][4];

void dfs(int x, int y) {
    if (x < 0 || x >= 4 || y < 0 || y >= 4 || g[x][y] != '#') return;
    g[x][y] = '.';
    dfs(x + 1, y);
    dfs(x - 1, y);
    dfs(x, y + 1);
    dfs(x, y - 1);
}

int main() {
    char c;
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++) { cin >> c; g[i][j] = c; }
    int count = 0;
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++)
            if (g[i][j] == '#') { count++; dfs(i, j); }
    cout << count << "\\n";
    return 0;
}
`,
      },
    },
    visualizer: { kind: 'grid', param: 'dfs' },
  },
  {
    id: 'algo-advanced-8',
    lang: 'algo',
    module: 'advanced',
    order: 8,
    title: '拓扑排序',
    difficulty: 4,
    visualizer: { kind: 'topo-sort' },
    xp: 35,
    goals: [
      '理解依赖关系建模成有向图与拓扑序的含义',
      '掌握 Kahn 算法：入度表 + 逐步摘除入度为 0 的点',
      '学会输出字典序最小拓扑序并判定成环输出 -1',
    ],
    brief: `## 拓扑排序：给任务排「先来后到」

修课要先《基础》再《进阶》，穿衣服要先穿袜子再穿鞋 —— 把有依赖关系的任务排成合法顺序，就是**拓扑排序**：把有向图排成一列，保证每条边 u→v 中 u 都排在 v 前面。

常用 **Kahn 算法**（想象"拆快递"：能拆的先拆）：

1. 统计每个点的**入度**（有几个前置任务）；
2. 入度为 0 的点没有前置，可以立刻输出；输出后把它指向的所有点入度 -1；
3. 重复 n 次；若某轮找不到入度为 0 的点，说明**剩下的点互相依赖成环** → 输出 \`-1\`。

要"字典序最小"？每次不从随便挑，而是**挑编号最小的可用点**（n 很小直接线性扫描，n 大用小根堆）。时间 O(n²) 或 O((n+m)log n)。

> ⚠️ 易错点：① 输出 \`-1\` 的时机是"凑不满 n 个点"；② 自环、双向依赖都构成环；③ 序列单空格分隔，编号从 1 开始。`,
    task: `## 任务：输出字典序最小的拓扑序

有 n 项任务（编号 1~n）和 m 条依赖关系：\`u v\` 表示任务 u 必须排在 v 之前。请输出一个合法的执行顺序；若存在多个合法顺序，输出**字典序最小**的那个；若依赖成环（无解），输出 \`-1\`。

**输入**：第一行 n m（1 ≤ n ≤ 8，0 ≤ m ≤ 20）；接下来 m 行，每行 u v（1 ≤ u, v ≤ n）

**输出**：一行 —— n 个编号（单空格分隔）或 \`-1\`

### 示例

| 输入 | 输出 | 说明 |
| --- | --- | --- |
| 第一行 \`4 3\`<br>后三行 \`1 2\`、\`2 3\`、\`1 4\` | \`1 2 3 4\` | 3 和 4 都可在 2 后执行，字典序选 3 |
| 第一行 \`3 3\`<br>后三行 \`1 2\`、\`2 3\`、\`3 1\` | \`-1\` | 1→2→3→1 成环 |`,
    starter: `const [n, m] = readInts();

// TODO 1: 建邻接表 adj 与入度表 indeg；循环 m 次 readInts() 读 [u, v]：adj[u].push(v)、indeg[v]++
// TODO 2: 重复 n 次：从 1 到 n 找「未输出且 indeg === 0」的最小编号；一轮找不到就输出 -1
// TODO 3: 找到后记录答案，并把它所有后继的 indeg 各减 1
console.log(-1); // 占位，替换为你的输出
`,
    solution: `const [n, m] = readInts();
const adj = [];
for (let i = 0; i <= n; i++) adj.push([]);
const indeg = new Array(n + 1).fill(0);
for (let i = 0; i < m; i++) {
  const [u, v] = readInts();
  adj[u].push(v);
  indeg[v]++;
}
const out = [];
const removed = new Array(n + 1).fill(false);
let ok = true;
for (let step = 0; step < n; step++) {
  let pick = 0;
  for (let i = 1; i <= n; i++) {
    if (!removed[i] && indeg[i] === 0) { pick = i; break; }
  }
  if (pick === 0) { ok = false; break; }
  out.push(pick);
  removed[pick] = true;
  for (const v of adj[pick]) indeg[v]--;
}
console.log(ok ? out.join(' ') : '-1');
`,
    hints: [
      '建图：adj[u] 记录 u 的后继列表，indeg[v] 统计 v 的前置数量。Kahn 算法每轮找一个入度为 0 的点输出。',
      '字典序最小的诀窍：每轮在所有「入度为 0 且未输出」的点里挑编号最小的（n ≤ 8，直接 1 到 n 线性扫描即可）。输出后把它所有后继的入度 -1。',
      '如果某轮一个入度为 0 的点都找不到，说明剩下的点成环，输出 -1。自查样例：`4 3` + 边 (1,2)(2,3)(1,4) 应输出 `1 2 3 4`。',
    ],
    tests: [
      { name: '样例：链式依赖', stdin: '4 3\n1 2\n2 3\n1 4\n', expected: '1 2 3 4' },
      { name: '样例：成环', stdin: '3 3\n1 2\n2 3\n3 1\n', expected: '-1' },
      { name: '样例：字典序取舍', stdin: '5 4\n3 1\n3 2\n4 2\n5 4\n', expected: '3 1 5 4 2' },
      { name: '隐藏：无边单点', stdin: '1 0\n', expected: '1', hidden: true },
      { name: '隐藏：六点六边', stdin: '6 6\n1 4\n2 4\n4 5\n3 5\n6 3\n6 4\n', expected: '1 2 6 3 4 5', hidden: true },
    ],
    algo: {
      starters: {
        javascript: `const [n, m] = readInts();

// TODO 1: 建邻接表 adj 与入度表 indeg；循环 m 次 readInts() 读 [u, v]：adj[u].push(v)、indeg[v]++
// TODO 2: 重复 n 次：从 1 到 n 找「未输出且 indeg === 0」的最小编号；一轮找不到就输出 -1
// TODO 3: 找到后记录答案，并把它所有后继的 indeg 各减 1
console.log(-1); // 占位，替换为你的输出
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

	// TODO 1: adj 邻接表 + indeg 入度表；循环 m 次读 u v：adj[u] 追加 v，indeg[v]++
	// TODO 2: 重复 n 次：线性扫描 1..n 找「未输出且 indeg==0」的最小编号；找不到输出 -1
	// TODO 3: 输出该点并把它的后继 indeg 全部 -1；答案 strconv.Itoa 收集后 join
	parts := []string{strconv.Itoa(n), strconv.Itoa(m)}
	fmt.Println(strings.Join(parts, " ")) // 占位，替换为你的输出
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace().map(|x| x.parse::<usize>().unwrap());
    let n = it.next().unwrap();
    let m = it.next().unwrap();

    // TODO 1: adj 邻接表 + indeg 入度表；循环 m 次读 u v
    // TODO 2: 重复 n 次：线性扫描 1..=n 找「未输出且 indeg==0」的最小编号；找不到输出 -1
    // TODO 3: 输出该点并把它的后继 indeg 全部 -1；结果 join(" ") 输出
    println!("-1"); // 占位，替换为你的输出
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    // TODO 1: adj 邻接表 + indeg 入度表；循环 m 次读 u v：adj[u].push_back(v)、indeg[v]++
    // TODO 2: 重复 n 次：线性扫描 1..n 找「未输出且 indeg==0」的最小编号；找不到输出 -1
    // TODO 3: 输出该点并把它的后继 indeg 全部 -1；结果单空格分隔输出
    cout << -1 << "\\n"; // 占位，替换为你的输出
    return 0;
}
`,
      },
      solutions: {
        javascript: `const [n, m] = readInts();
const adj = [];
for (let i = 0; i <= n; i++) adj.push([]);
const indeg = new Array(n + 1).fill(0);
for (let i = 0; i < m; i++) {
  const [u, v] = readInts();
  adj[u].push(v);
  indeg[v]++;
}
const out = [];
const removed = new Array(n + 1).fill(false);
let ok = true;
for (let step = 0; step < n; step++) {
  let pick = 0;
  for (let i = 1; i <= n; i++) {
    if (!removed[i] && indeg[i] === 0) { pick = i; break; }
  }
  if (pick === 0) { ok = false; break; }
  out.push(pick);
  removed[pick] = true;
  for (const v of adj[pick]) indeg[v]--;
}
console.log(ok ? out.join(' ') : '-1');
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
	adj := make([][]int, n+1)
	indeg := make([]int, n+1)
	for i := 0; i < m; i++ {
		var u, v int
		fmt.Scan(&u, &v)
		adj[u] = append(adj[u], v)
		indeg[v]++
	}
	out := make([]string, 0, n)
	removed := make([]bool, n+1)
	ok := true
	for step := 0; step < n; step++ {
		pick := 0
		for i := 1; i <= n; i++ {
			if !removed[i] && indeg[i] == 0 {
				pick = i
				break
			}
		}
		if pick == 0 {
			ok = false
			break
		}
		out = append(out, strconv.Itoa(pick))
		removed[pick] = true
		for _, v := range adj[pick] {
			indeg[v]--
		}
	}
	if ok {
		fmt.Println(strings.Join(out, " "))
	} else {
		fmt.Println(-1)
	}
}
`,
        rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace().map(|x| x.parse::<usize>().unwrap());
    let n = it.next().unwrap();
    let m = it.next().unwrap();
    let mut adj: Vec<Vec<usize>> = vec![vec![]; n + 1];
    let mut indeg = vec![0usize; n + 1];
    for _ in 0..m {
        let u = it.next().unwrap();
        let v = it.next().unwrap();
        adj[u].push(v);
        indeg[v] += 1;
    }
    let mut out: Vec<String> = Vec::new();
    let mut removed = vec![false; n + 1];
    let mut ok = true;
    for _ in 0..n {
        let mut pick = 0;
        for i in 1..=n {
            if !removed[i] && indeg[i] == 0 { pick = i; break; }
        }
        if pick == 0 { ok = false; break; }
        out.push(pick.to_string());
        removed[pick] = true;
        for &v in &adj[pick] {
            indeg[v] -= 1;
        }
    }
    if ok {
        println!("{}", out.join(" "));
    } else {
        println!("-1");
    }
}
`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> adj(n + 1);
    vector<int> indeg(n + 1, 0);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        indeg[v]++;
    }
    vector<int> out;
    vector<bool> removed(n + 1, false);
    bool ok = true;
    for (int step = 0; step < n; step++) {
        int pick = 0;
        for (int i = 1; i <= n; i++) {
            if (!removed[i] && indeg[i] == 0) { pick = i; break; }
        }
        if (pick == 0) { ok = false; break; }
        out.push_back(pick);
        removed[pick] = true;
        for (int v : adj[pick]) indeg[v]--;
    }
    if (ok) {
        for (size_t i = 0; i < out.size(); i++) {
            if (i) cout << ' ';
            cout << out[i];
        }
        cout << "\\n";
    } else {
        cout << -1 << "\\n";
    }
    return 0;
}
`,
      },
    },
  },
];
