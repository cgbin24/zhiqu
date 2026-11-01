import type { Level } from '@/types';

/** Go · 第三章：进阶技术（8 关） */
export const GO_ADVANCED: Level[] = [
  {
    id: 'go-advanced-1',
    lang: 'go',
    module: 'advanced',
    order: 1,
    title: '切片的隐藏冰山',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解切片三件套：指针、len、cap',
      '观察 append 在容量足够时共享底层数组',
      '观察 append 超容量时扩容（翻倍）并独立',
    ],
    brief: `## 切片 ≠ 数组：它是个"视图"

切片的运行时结构是三件套：指向底层数组的**指针**、**长度 len**、**容量 cap**：

\`\`\`go
s1 := make([]int, 2, 4) // len=2, cap=4
s2 := append(s1, 7)     // cap 够 → 原地写入，共享底层数组！
s2[0] = 999             // s1[0] 也变成 999
\`\`\`

append 时如果 cap 够用，就在**原数组**上追加，返回的新切片头与旧切片共享同一底层数组 —— 这就是"改 s2 连累 s1"的根源。cap 不够时才分配新数组（小切片按约 2 倍扩容）并整体拷贝，从此分道扬镳。

排查利器：

\`\`\`go
len(s), cap(s)    // 长度与容量
&s1[0] == &s2[0]  // 首元素地址相同 → 共享底层数组
\`\`\`

> ⚠️ 想要真正独立的副本：\`c := make([]int, len(s)); copy(c, s)\`，或 Go 1.21+ 的 \`slices.Clone(s)\`。`,
    task: `## 任务：切片侦探报告

按顺序执行以下实验并输出报告：

1. \`s1 := make([]int, 2, 4)\`，填入 a、b，打印 len/cap/值
2. \`s2 := append(s1, c)\`，打印 len/cap/值（cap 够 → 仍是 4）
3. \`s2[0] = a * 10\`，打印 s1（见证共享！）
4. \`s3 := append(s2, 100, 200)\`，打印 len/cap/值（超容量 → 扩容到 8）
5. \`s3[0] = 999\`，打印 s2（见证 s3 已独立）

**输入**：一行三个整数 a b c

**输出**（五行）：

\`\`\`
s1: len=2 cap=4 值=[a b]
s2: len=3 cap=4 值=[a b c]
改 s2[0] 后 s1=[10a b]（共享底层数组）
s3: len=5 cap=8 值=[10a b c 100 200]
改 s3[0] 后 s2=[10a b c]（s3 已独立）
\`\`\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 5 7\` | \`s1: len=2 cap=4 值=[3 5]\`<br>\`s2: len=3 cap=4 值=[3 5 7]\`<br>\`改 s2[0] 后 s1=[30 5]（共享底层数组）\`<br>\`s3: len=5 cap=8 值=[30 5 7 100 200]\`<br>\`改 s3[0] 后 s2=[30 5 7]（s3 已独立）\` |`,
    starter: `package main

import "fmt"

func main() {
	var a, b, c int
	fmt.Scan(&a, &b, &c)

	// TODO 1: s1 := make([]int, 2, 4)，填入 a、b，打印 len/cap/值
	// TODO 2: s2 := append(s1, c)，打印 len/cap/值
	// TODO 3: s2[0] = a*10，打印 s1（见证共享！）
	// TODO 4: s3 := append(s2, 100, 200)，打印 len/cap/值（见证扩容）
	// TODO 5: s3[0] = 999，打印 s2（见证独立）
}
`,
    solution: `package main

import "fmt"

func main() {
	var a, b, c int
	fmt.Scan(&a, &b, &c)

	// len=2, cap=4：底层数组能装 4 个 int
	s1 := make([]int, 2, 4)
	s1[0], s1[1] = a, b
	fmt.Printf("s1: len=%d cap=%d 值=%v\\n", len(s1), cap(s1), s1)

	// cap 够用：append 原地写入，s1 和 s2 共享底层数组
	s2 := append(s1, c)
	fmt.Printf("s2: len=%d cap=%d 值=%v\\n", len(s2), cap(s2), s2)

	s2[0] = a * 10 // 通过 s2 改，s1 也能看到！
	fmt.Printf("改 s2[0] 后 s1=%v（共享底层数组）\\n", s1)

	// 一次追加两个：超过 cap=4，触发扩容到 8，搬到新数组
	s3 := append(s2, 100, 200)
	fmt.Printf("s3: len=%d cap=%d 值=%v\\n", len(s3), cap(s3), s3)

	s3[0] = 999 // s3 已独立，s2 不再受影响
	fmt.Printf("改 s3[0] 后 s2=%v（s3 已独立）\\n", s2)
}
`,
    hints: [
      'make 的两个参数：`make([]int, 2, 4)` 创建 len=2、cap=4 的切片。打印格式：`fmt.Printf("s1: len=%d cap=%d 值=%v\\n", len(s1), cap(s1), s1)`。',
      '第 2 步 cap 仍为 4：cap 够用时 append 不分配新数组。第 4 步一次追加两个元素，len 从 3 到 5 超过 cap=4，Go 按约 2 倍扩容到 cap=8 并搬到新数组。',
      '共享与独立：改 `s2[0]` 后 s1 跟着变（同一个底层数组）；但 s3 扩容后已有自己的数组，改 `s3[0]` 不影响 s2。括号用中文全角（），与示例逐字一致。',
    ],
    tests: [
      {
        name: '样例：3 5 7',
        stdin: '3 5 7\n',
        expected: 's1: len=2 cap=4 值=[3 5]\ns2: len=3 cap=4 值=[3 5 7]\n改 s2[0] 后 s1=[30 5]（共享底层数组）\ns3: len=5 cap=8 值=[30 5 7 100 200]\n改 s3[0] 后 s2=[30 5 7]（s3 已独立）',
      },
      {
        name: '样例：10 20 30',
        stdin: '10 20 30\n',
        expected: 's1: len=2 cap=4 值=[10 20]\ns2: len=3 cap=4 值=[10 20 30]\n改 s2[0] 后 s1=[100 20]（共享底层数组）\ns3: len=5 cap=8 值=[100 20 30 100 200]\n改 s3[0] 后 s2=[100 20 30]（s3 已独立）',
      },
      {
        name: '隐藏：全零',
        stdin: '0 0 0\n',
        expected: 's1: len=2 cap=4 值=[0 0]\ns2: len=3 cap=4 值=[0 0 0]\n改 s2[0] 后 s1=[0 0]（共享底层数组）\ns3: len=5 cap=8 值=[0 0 0 100 200]\n改 s3[0] 后 s2=[0 0 0]（s3 已独立）',
        hidden: true,
      },
      {
        name: '隐藏：负数',
        stdin: '-1 -2 -3\n',
        expected: 's1: len=2 cap=4 值=[-1 -2]\ns2: len=3 cap=4 值=[-1 -2 -3]\n改 s2[0] 后 s1=[-10 -2]（共享底层数组）\ns3: len=5 cap=8 值=[-10 -2 -3 100 200]\n改 s3[0] 后 s2=[-10 -2 -3]（s3 已独立）',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-advanced-2',
    lang: 'go',
    module: 'advanced',
    order: 2,
    title: 'map 的无序世界',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解 map 是引用类型：赋值别名共享同一哈希表',
      '牢记 map 遍历顺序随机，输出必须先排序',
      '实现"次数降序、字母升序"的复合排序',
    ],
    brief: `## map 是引用类型

make 返回的 map 更像一个"句柄"：把它赋给另一个变量，两者操作的是**同一个**哈希表：

\`\`\`go
m := map[string]int{"go": 1}
alias := m
alias["go"] = 99
fmt.Println(m["go"]) // 99 —— 不是副本！
\`\`\`

## 遍历是随机的

Go 故意让 map 的遍历顺序**每次运行都随机**（运行时会随机化起点），防止你依赖顺序：

\`\`\`go
for k := range m { ... } // 顺序不可预测！
\`\`\`

需要稳定输出时，把 key 收进切片、排序后再遍历：

\`\`\`go
keys := make([]string, 0, len(m))
for k := range m {
    keys = append(keys, k)
}
sort.Strings(keys)
for _, k := range keys {
    fmt.Println(k, m[k])
}
\`\`\`

> ⚠️ 这是判题场景的高频雷区：直接遍历 map 输出，本地偶尔"看着对"，评测必翻车。`,
    task: `## 任务：单词点名录

读入 n 个单词，用 map 统计词频，完成四步报告：

1. 打印 \`共 <m> 种单词\`（m 为不同单词数）
2. 按**字典序**打印每个单词：\`<word>: <count>\`
3. 找出现次数最多的单词（并列取字典序最小），打印 \`最常见: <word> (<count> 次)\`
4. 引用语义实验：\`alias := freq\`，执行 \`alias[第一个单词] += 100\`，打印 \`通过 alias 修改后 freq[<第一个单词>] = <新值>\`

**输入**：第一行 n（1 ≤ n ≤ 100）；第二行 n 个小写英文单词

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`go rust go\` | \`共 2 种单词\`<br>\`go: 2\`<br>\`rust: 1\`<br>\`最常见: go (2 次)\`<br>\`通过 alias 修改后 freq[go] = 102\` |`,
    starter: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	words := make([]string, n)
	for i := range words {
		fmt.Scan(&words[i])
	}

	// TODO 1: 用 map[string]int 统计词频，打印"共 x 种单词"
	// TODO 2: 收集 key 进切片，sort.Strings 后按序打印"word: count"（补 import "sort"）
	// TODO 3: 找出现最多的（并列取字典序最小）
	// TODO 4: alias := freq，通过 alias 给第一个单词 +100，验证引用语义
}
`,
    solution: `package main

import (
	"fmt"
	"sort"
)

func main() {
	var n int
	fmt.Scan(&n)
	words := make([]string, n)
	for i := range words {
		fmt.Scan(&words[i])
	}

	freq := make(map[string]int, n)
	for _, w := range words {
		freq[w]++
	}
	fmt.Printf("共 %d 种单词\\n", len(freq))

	// map 遍历是随机的！必须先拿 key 排序
	keys := make([]string, 0, len(freq))
	for k := range freq {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	for _, k := range keys {
		fmt.Printf("%s: %d\\n", k, freq[k])
	}

	// 按（次数降序, 字典序升序）找最常见
	top := keys[0]
	for _, k := range keys[1:] {
		if freq[k] > freq[top] {
			top = k
		}
	}
	fmt.Printf("最常见: %s (%d 次)\\n", top, freq[top])

	// 引用语义：alias 和 freq 指向同一个 map
	alias := freq
	alias[words[0]] += 100
	fmt.Printf("通过 alias 修改后 freq[%s] = %d\\n", words[0], freq[words[0]])
}
`,
    hints: [
      '统计与种类数：`freq[w]++` 后 `len(freq)` 就是不同单词数。注意"最常见"要在排序后的 keys 上找，keys 已按字典序排列，所以用严格大于 `freq[k] > freq[top]` 时并列自动保留字典序最小的。',
      'map 不能直接排序，把 key 收进切片：`keys := make([]string, 0, len(freq))` + 循环 append，然后 `sort.Strings(keys)`（补 import "sort"），再按 keys 顺序输出 `fmt.Printf("%s: %d\\n", k, freq[k])`。',
      '引用语义一行验证：`alias := freq; alias[words[0]] += 100`，随后打印 `fmt.Printf("通过 alias 修改后 freq[%s] = %d\\n", words[0], freq[words[0]])` —— freq 也跟着变了，因为 map 赋值只复制"句柄"。',
    ],
    tests: [
      {
        name: '样例：go rust go',
        stdin: '3\ngo rust go\n',
        expected: '共 2 种单词\ngo: 2\nrust: 1\n最常见: go (2 次)\n通过 alias 修改后 freq[go] = 102',
      },
      {
        name: '样例：并列取最小',
        stdin: '5\na b a b c\n',
        expected: '共 3 种单词\na: 2\nb: 2\nc: 1\n最常见: a (2 次)\n通过 alias 修改后 freq[a] = 102',
      },
      {
        name: '隐藏：单个单词',
        stdin: '1\nsolo\n',
        expected: '共 1 种单词\nsolo: 1\n最常见: solo (1 次)\n通过 alias 修改后 freq[solo] = 101',
        hidden: true,
      },
      {
        name: '隐藏：全是 1 次',
        stdin: '4\nx y z w\n',
        expected: '共 4 种单词\nw: 1\nx: 1\ny: 1\nz: 1\n最常见: w (1 次)\n通过 alias 修改后 freq[x] = 101',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-advanced-3',
    lang: 'go',
    module: 'advanced',
    order: 3,
    title: 'defer 的倒序魔法',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握 defer 的 LIFO（后进先出）执行顺序',
      '理解 defer 参数在注册时立即求值',
      '区分直接传参与闭包捕获的差异',
    ],
    brief: `## defer：延迟执行的栈

defer 把调用压入栈，**函数返回前按 LIFO（后进先出）执行**：

\`\`\`go
func main() {
    defer fmt.Println("first")
    defer fmt.Println("second")
}
// 输出：second → first
\`\`\`

资源成对操作（open/close、Lock/Unlock）用 defer 保证释放，且释放顺序与申请顺序相反，天然正确。

## 参数立即求值

defer 语句执行的那一刻，**参数就已经求值并固定**：

\`\`\`go
n := 5
defer fmt.Println(n) // 立刻拷贝 n=5
n = 100
// 函数结束时打印 5，不是 100
\`\`\`

想读最终值，用闭包：\`defer func() { fmt.Println(n) }()\` —— 闭包捕获的是**变量本身**，执行时才取值。

> ⚠️ 口诀：参数看注册时机，闭包看执行时机。`,
    task: `## 任务：倒序魔法秀

读入整数 n，依次执行：

1. \`defer\` 直接打印 \`A: 注册时 n = <n>\`
2. \`n *= 2\`
3. \`defer\` 用**闭包**打印 \`C: 闭包读取 n = <n>\`
4. \`n += 10\`
5. \`defer\` 直接打印 \`B: 注册时 n = <n>\`（此时 n 已经变大）
6. 打印 \`main 结束: n = <n>\`

观察输出顺序与各行的 n 值。

**输入**：一行一个整数 n

**输出**（四行，按 defer 的 LIFO 顺序）：\`main 结束\` 先出，然后 B、C、A

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5\` | \`main 结束: n = 20\`<br>\`B: 注册时 n = 20\`<br>\`C: 闭包读取 n = 20\`<br>\`A: 注册时 n = 5\` |`,
    starter: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	// TODO 1: defer 直接打印"A: 注册时 n = <n>"（参数立即求值）
	// TODO 2: n *= 2
	// TODO 3: defer 用闭包打印"C: 闭包读取 n = <n>"（执行时才读变量）
	// TODO 4: n += 10
	// TODO 5: defer 直接打印"B: 注册时 n = <n>"（注意此刻 n 已经是 2n+10）
	// TODO 6: 打印"main 结束: n = <n>"，运行观察 defer 的执行顺序
}
`,
    solution: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	defer fmt.Println("A: 注册时 n =", n)                // 参数在 defer 语句执行时立即求值
	n *= 2
	defer func() { fmt.Println("C: 闭包读取 n =", n) }() // 闭包捕获变量本身
	n += 10
	defer fmt.Println("B: 注册时 n =", n)                // 此刻 n 已经是 2n+10

	fmt.Println("main 结束: n =", n)
}
`,
    hints: [
      'LIFO：最后注册的 defer 最先执行。本题注册顺序 A、C、B，执行顺序就是 B、C、A，而 main 自己的打印（未 defer）最先输出。',
      'A 行注册时 n 还是原值，参数立即拷贝；B 行注册时 n 已经变成 2n+10。闭包 C 捕获的是变量本身，执行时读到最终值（也是 2n+10）。',
      '写法：`defer fmt.Println("A: 注册时 n =", n)`、`defer func() { fmt.Println("C: 闭包读取 n =", n) }()`、`defer fmt.Println("B: 注册时 n =", n)`。Println 的多个参数自动以空格连接。',
    ],
    tests: [
      {
        name: '样例：5',
        stdin: '5\n',
        expected: 'main 结束: n = 20\nB: 注册时 n = 20\nC: 闭包读取 n = 20\nA: 注册时 n = 5',
      },
      {
        name: '样例：0',
        stdin: '0\n',
        expected: 'main 结束: n = 10\nB: 注册时 n = 10\nC: 闭包读取 n = 10\nA: 注册时 n = 0',
      },
      {
        name: '隐藏：3',
        stdin: '3\n',
        expected: 'main 结束: n = 16\nB: 注册时 n = 16\nC: 闭包读取 n = 16\nA: 注册时 n = 3',
        hidden: true,
      },
      {
        name: '隐藏：负数',
        stdin: '-4\n',
        expected: 'main 结束: n = 2\nB: 注册时 n = 2\nC: 闭包读取 n = 2\nA: 注册时 n = -4',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-advanced-4',
    lang: 'go',
    module: 'advanced',
    order: 4,
    title: 'panic 与 recover：安全气囊',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解 panic 的传播机制与 defer 的关系',
      '掌握在 defer 闭包中用 recover 拦截 panic',
      '用命名返回值把拦截结果传出去',
    ],
    brief: `## panic：程序炸了

panic 表示不可恢复的异常（数组越界、空指针、主动 panic），会沿调用栈向上传播，逐层执行 defer，最终打印堆栈并退出。

## recover：紧急制动

recover 只在 **defer 的闭包中**有效，能接住 panic 让程序继续：

\`\`\`go
func safeCall() (result int, msg string) {
    defer func() {
        if r := recover(); r != nil {
            result = 0
            msg = fmt.Sprintf("已拦截: %v", r)
        }
    }()
    panic("出大事了") // r = "出大事了"
}
\`\`\`

要点：

- recover 必须写在 defer 的**闭包**里。\`defer fmt.Println(recover())\` 不行 —— 参数求值太早，recover 在 panic 发生前就返回 nil 了。
- 拦截后，用**命名返回值**补写结果。
- panic 的值可以是任何类型，\`%v\` 打印即可。

> ⚠️ recover 不是 try/catch：只用于兜底（如 HTTP 服务不让单个请求拖垮全局），不要拿它做正常流程控制。`,
    task: `## 任务：安全除法

实现 \`safeDiv(a, b int) (q int, errMsg string)\`：

- \`b == 0\` 时 \`panic("除数不能为 0")\`
- 函数内用 \`defer\` + \`recover\` 拦截：捕获到 panic 时 q 置 0，errMsg 置为 \`已拦截: <panic 内容>\`
- 正常时返回商和空字符串

**输入**：一行两个整数 a b

**输出**：

- 正常：\`<a> ÷ <b> = <q>\`
- 拦截：\`已拦截: 除数不能为 0\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`17 5\` | \`17 ÷ 5 = 3\` |
| \`9 0\` | \`已拦截: 除数不能为 0\` |`,
    starter: `package main

import "fmt"

// TODO 1: 实现 safeDiv(a, b int) (q int, errMsg string)
//   b == 0 时 panic("除数不能为 0")；否则返回商和空字符串
// TODO 2: 在 safeDiv 里用 defer + recover 拦截 panic：
//   r := recover() 不为 nil 时，q 置 0，errMsg 置为"已拦截: <r>"

func main() {
	var a, b int
	fmt.Scan(&a, &b)

	// TODO 3: 调用 safeDiv，errMsg 非空就打印它，否则打印除法结果
}
`,
    solution: `package main

import "fmt"

// safeDiv 用 panic/recover 保护除法
func safeDiv(a, b int) (q int, errMsg string) {
	defer func() {
		if r := recover(); r != nil {
			q = 0
			errMsg = fmt.Sprintf("已拦截: %v", r)
		}
	}()
	if b == 0 {
		panic("除数不能为 0")
	}
	return a / b, ""
}

func main() {
	var a, b int
	fmt.Scan(&a, &b)

	q, errMsg := safeDiv(a, b)
	if errMsg != "" {
		fmt.Println(errMsg)
		return
	}
	fmt.Printf("%d ÷ %d = %d\\n", a, b, q)
}
`,
    hints: [
      'recover 必须在 defer 的闭包里：`defer func() { if r := recover(); r != nil { ... } }()`。panic 的值（这里是字符串"除数不能为 0"）就是 recover 的返回值 r。',
      '用命名返回值 `(q int, errMsg string)` 才能在闭包里改返回值：拦截时 `q = 0`、`errMsg = fmt.Sprintf("已拦截: %v", r)`，函数自动把这些值返回给调用方。',
      'main 判断：errMsg 非空打印 `fmt.Println(errMsg)` 并 return；否则 `fmt.Printf("%d ÷ %d = %d\\n", a, b, q)`。注意 ÷ 两侧有空格。',
    ],
    tests: [
      {
        name: '样例：17 5',
        stdin: '17 5\n',
        expected: '17 ÷ 5 = 3',
      },
      {
        name: '样例：9 0',
        stdin: '9 0\n',
        expected: '已拦截: 除数不能为 0',
      },
      {
        name: '隐藏：负数商',
        stdin: '-7 3\n',
        expected: '-7 ÷ 3 = -2',
        hidden: true,
      },
      {
        name: '隐藏：零被除数',
        stdin: '0 4\n',
        expected: '0 ÷ 4 = 0',
        hidden: true,
      },
      {
        name: '隐藏：整除',
        stdin: '100 10\n',
        expected: '100 ÷ 10 = 10',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-advanced-5',
    lang: 'go',
    module: 'advanced',
    order: 5,
    title: 'nil 接口之谜',
    difficulty: 4,
    xp: 40,
    goals: [
      '理解接口的两张脸：（类型, 值）二元组',
      '复现"把 nil 具体指针装进接口"的经典陷阱',
      '掌握正确写法：要么真错误，要么直接 return nil',
    ],
    brief: `## 一个 famous bug

先看代码：

\`\`\`go
type MyError struct{ Msg string }
func (e *MyError) Error() string { return e.Msg }

func doWork(fail bool) error {
    var e *MyError // *MyError 类型，暂时是 nil
    if fail { e = &MyError{Msg: "出错"} }
    return e // 陷阱在这！
}
\`\`\`

当 fail=false 时，e 是 nil 的 \`*MyError\`，但 \`return e\` 把它装进 error 接口 —— 接口里装的是 **(类型=*MyError, 值=nil)**。

## 接口的两张脸

接口变量 == nil 当且仅当**类型和值都是 nil**。装了具体类型（哪怕值是 nil），接口就不等于 nil：

\`\`\`go
err := doWork(false)
fmt.Println(err == nil) // false ！！
fmt.Printf("%T\\n", err) // *main.MyError
\`\`\`

## 正确写法

出错才构造错误对象，否则**直接 return nil**：

\`\`\`go
func doWorkRight(fail bool) error {
    if fail { return &MyError{Msg: "出错"} }
    return nil // 干干净净的 nil 接口
}
\`\`\`

> ⚠️ 返回具体错误类型指针的函数，千万别声明 \`var e *T\` 再 return e。`,
    task: `## 任务：拆弹专家

实现 \`MyError\` 类型（\`Msg string\` + \`Error() string\` 方法），以及两个函数：

1. \`wrongReturn(fail bool) error\` —— 声明 \`var e *MyError\`，fail 时赋值，最后 \`return e\`（制造陷阱）
2. \`rightReturn(fail bool) error\` —— fail 时返回 \`&MyError{Msg: "出错了"}\`，否则直接 \`return nil\`

**输入**：一行一个整数 n（1 表示有故障，其他表示无故障）

**输出**：

- \`场景: 有故障\` 或 \`场景: 无故障\`
- \`错误写法返回类型: *main.MyError\`（用 %T 打印）
- \`错误写法: err == nil = <bool>\`
- \`正确写法: err == nil = <bool>\`
- 仅当正确写法真有错误时，加一行 \`正确写法的错误信息: 出错了\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`0\` | \`场景: 无故障\`<br>\`错误写法返回类型: *main.MyError\`<br>\`错误写法: err == nil = false\`<br>\`正确写法: err == nil = true\` |
| \`1\` | \`场景: 有故障\`<br>\`错误写法返回类型: *main.MyError\`<br>\`错误写法: err == nil = false\`<br>\`正确写法: err == nil = false\`<br>\`正确写法的错误信息: 出错了\` |

> ⚠️ 错误写法返回的接口哪怕不是 nil，也**千万不要**调用它的 Error() —— 那会对 nil 指针解引用而 panic！`,
    starter: `package main

import "fmt"

// TODO 1: 定义 MyError struct{ Msg string } 和 Error() string 方法
// TODO 2: 实现 wrongReturn(fail bool) error：
//   声明 var e *MyError，fail 时赋值，最后 return e（制造陷阱）
// TODO 3: 实现 rightReturn(fail bool) error：
//   fail 时返回 &MyError{...}，否则直接 return nil（正确姿势）

func main() {
	var n int
	fmt.Scan(&n)
	fail := n == 1

	if fail {
		fmt.Println("场景: 有故障")
	} else {
		fmt.Println("场景: 无故障")
	}

	// TODO 4: 按格式打印两种写法的 %T 与 err == nil 的结果
	// 注意：错误写法返回的"非 nil 接口"千万不能直接调 Error()，会 panic！
}
`,
    solution: `package main

import "fmt"

type MyError struct {
	Msg string
}

func (e *MyError) Error() string { return e.Msg }

// wrongReturn 演示经典陷阱：把 nil 具体指针装进接口
func wrongReturn(fail bool) error {
	var e *MyError // 具体类型 *MyError，当前为 nil
	if fail {
		e = &MyError{Msg: "出错了"}
	}
	return e // 接口里装了 (类型=*MyError, 值=nil) → 接口 != nil！
}

// rightReturn 正确做法：要么返回真的错误，要么直接返回 nil 接口
func rightReturn(fail bool) error {
	if fail {
		return &MyError{Msg: "出错了"}
	}
	return nil
}

func main() {
	var n int
	fmt.Scan(&n)
	fail := n == 1

	if fail {
		fmt.Println("场景: 有故障")
	} else {
		fmt.Println("场景: 无故障")
	}

	werr := wrongReturn(fail)
	fmt.Printf("错误写法返回类型: %T\\n", werr)
	fmt.Printf("错误写法: err == nil = %t\\n", werr == nil)

	rerr := rightReturn(fail)
	fmt.Printf("正确写法: err == nil = %t\\n", rerr == nil)
	if rerr != nil {
		fmt.Printf("正确写法的错误信息: %s\\n", rerr.Error())
	}
}
`,
    hints: [
      '陷阱的核心：`var e *MyError` 后 return e，接口二元组是 (类型=*MyError, 值=nil)，所以 `err == nil` 永远是 false。用 %T 打印它，会显示 *main.MyError。',
      '正确写法的分支要干脆：`if fail { return &MyError{Msg: "出错了"} }; return nil`。这样无故障时返回的才是真正的 nil 接口。',
      '输出用 %t 打印布尔：`fmt.Printf("错误写法: err == nil = %t\\n", werr == nil)`。只有 rightReturn 的结果非 nil 时才打印错误信息行，且绝不要对 wrongReturn 的结果调用 Error()。',
    ],
    tests: [
      {
        name: '样例：有故障',
        stdin: '1\n',
        expected: '场景: 有故障\n错误写法返回类型: *main.MyError\n错误写法: err == nil = false\n正确写法: err == nil = false\n正确写法的错误信息: 出错了',
      },
      {
        name: '样例：无故障',
        stdin: '0\n',
        expected: '场景: 无故障\n错误写法返回类型: *main.MyError\n错误写法: err == nil = false\n正确写法: err == nil = true',
      },
      {
        name: '隐藏：输入 2 视为无故障',
        stdin: '2\n',
        expected: '场景: 无故障\n错误写法返回类型: *main.MyError\n错误写法: err == nil = false\n正确写法: err == nil = true',
        hidden: true,
      },
      {
        name: '隐藏：输入 5 视为无故障',
        stdin: '5\n',
        expected: '场景: 无故障\n错误写法返回类型: *main.MyError\n错误写法: err == nil = false\n正确写法: err == nil = true',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-advanced-6',
    lang: 'go',
    module: 'advanced',
    order: 6,
    title: 'context 超时控制',
    difficulty: 4,
    xp: 40,
    goals: [
      '掌握 context.WithTimeout 创建超时上下文',
      '用 select 同时监听结果与 ctx.Done()',
      '学会消除"结果与超时同时就绪"的竞态',
    ],
    brief: `## context：取消与超时的标准姿势

Go 的并发操作需要"统一的遥控器"，这就是 context：

\`\`\`go
ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
defer cancel() // 提前释放资源
\`\`\`

100ms 后 ctx 自动完成：\`ctx.Done()\` 这个 channel 被关闭，\`ctx.Err()\` 返回 \`context deadline exceeded\`。

## 配合 select 使用

耗时操作随时盯着 Done：

\`\`\`go
select {
case res := <-resultCh: // 正常完成
    fmt.Println(res)
case <-ctx.Done(): // 超时/取消
    fmt.Println(ctx.Err())
}
\`\`\`

- \`time.After(d)\` 返回一个 d 后才就绪的 channel，可用来模拟"慢服务"。
- select 同时监听多个 channel，谁先就绪走谁。

> ⚠️ 结果 channel 建议带 1 缓冲（\`make(chan T, 1)\`），超时后 worker 也能顺利发完退出，不会泄漏。两边可能同时就绪时，拿到结果后再查一次 \`ctx.Err()\` 更稳。`,
    task: `## 任务：慢速服务调用

模拟一个需要 n 毫秒才响应的服务：协程里 \`time.After(n 毫秒)\` 后把结果 \`服务响应-OK\` 发进 channel。主协程用 \`context.WithTimeout(..., 100 毫秒)\` 等待：

- 服务在超时前响应 → \`调用成功: 服务响应-OK\`
- 超时先到 → \`调用超时: context deadline exceeded\`

**输入**：一行一个整数 n（题目保证 n ≤ 50 或 n ≥ 300，避免临界抖动）

**输出**：一行结果

### 示例

| 输入 | 输出 |
| --- | --- |
| \`10\` | \`调用成功: 服务响应-OK\` |
| \`300\` | \`调用超时: context deadline exceeded\` |`,
    starter: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	// TODO 1: 补 import "context" 和 "time"
	// TODO 2: ctx, cancel := context.WithTimeout(..., 100*time.Millisecond)，记得 defer cancel()
	// TODO 3: 起一个协程模拟慢服务：time.After(n 毫秒) 后把结果发进带缓冲的 channel
	// TODO 4: select 监听 结果channel 和 ctx.Done()：
	//   成功 → 打印"调用成功: 服务响应-OK"
	//   超时 → 打印"调用超时: " + ctx.Err()
	// 提示：拿到结果后再检查一次 ctx.Err()，避免两边同时就绪的竞态
}
`,
    solution: `package main

import (
	"context"
	"fmt"
	"time"
)

// slowService 模拟一个需要 n 毫秒才能响应的服务
func slowService(ctx context.Context, n int) string {
	select {
	case <-time.After(time.Duration(n) * time.Millisecond):
		return "服务响应-OK"
	case <-ctx.Done():
		return ""
	}
}

func main() {
	var n int
	fmt.Scan(&n)

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	ch := make(chan string, 1) // 带缓冲：超时后 worker 也能发完退出
	go func() {
		ch <- slowService(ctx, n)
	}()

	select {
	case res := <-ch:
		if ctx.Err() != nil { // 结果与超时同时就绪时，以超时为准
			fmt.Println("调用超时:", ctx.Err())
		} else {
			fmt.Println("调用成功:", res)
		}
	case <-ctx.Done():
		fmt.Println("调用超时:", ctx.Err())
	}
}
`,
    hints: [
      '创建上下文：`ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)`，后面 `defer cancel()`。超时后 `ctx.Done()` 关闭、`ctx.Err()` 返回 context.DeadlineExceeded。',
      '慢服务协程：`go func() { ch <- slowService(ctx, n) }()`，slowService 里 select `time.After(time.Duration(n) * time.Millisecond)` 与 `ctx.Done()`。channel 用 `make(chan string, 1)` 带缓冲。',
      '主 select 两个 case：收到结果时先查 `ctx.Err() != nil`（超时竞态兜底），没超时才打印成功；超时分支打印 `fmt.Println("调用超时:", ctx.Err())`，输出即"调用超时: context deadline exceeded"。',
    ],
    tests: [
      {
        name: '样例：服务快速响应',
        stdin: '10\n',
        expected: '调用成功: 服务响应-OK',
      },
      {
        name: '样例：30ms 也来得及',
        stdin: '30\n',
        expected: '调用成功: 服务响应-OK',
      },
      {
        name: '隐藏：300ms 超时',
        stdin: '300\n',
        expected: '调用超时: context deadline exceeded',
        hidden: true,
      },
      {
        name: '隐藏：1000ms 超时',
        stdin: '1000\n',
        expected: '调用超时: context deadline exceeded',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-advanced-7',
    lang: 'go',
    module: 'advanced',
    order: 7,
    title: '竞态与互斥锁',
    difficulty: 4,
    xp: 40,
    goals: [
      '理解 counter++ 的"读-加-写"三步与丢失更新',
      '用 sync.Mutex 保护临界区',
      '验证加锁后并发结果与期望值一致',
    ],
    brief: `## 竞态：看不见的 bug

两个 goroutine 同时执行 \`counter++\` —— 这行代码其实是"读 → 加 → 写"三步。交错执行时会互相覆盖，导致**丢失更新**：

\`\`\`go
counter++ // 两个协程各加 1000 次，结果可能小于 2000
\`\`\`

这种 bug 最阴险：结果时对时错，测试通过、上线翻车。

## sync.Mutex：互斥锁

临界区前后加锁解锁，同一时刻只允许一个 goroutine 进入：

\`\`\`go
var mu sync.Mutex
mu.Lock()
counter++ // 同一时刻只有一个协程在这
mu.Unlock()
\`\`\`

锁粒度越小越好；\`Lock\` 与 \`Unlock\` 必须成对，忘了解锁其余协程全部卡死。

验证工具：\`go run -race\` 能动态检测数据竞争（本编辑器不支持加参数，靠结果对不对来判断吧）。

> ⚠️ 如果去掉锁，本题的"实际值"经常小于期望值 —— 这就是竞态的现场证据。`,
    task: `## 任务：修复计数器

读入 n 和 k，启动 n 个协程，每个协程对共享计数器累加 k 次。**必须用 sync.Mutex 保护 counter++**，否则会发生竞态。

**输入**：一行两个整数 n k（1 ≤ n ≤ 20，1 ≤ k ≤ 1000）

**输出**（四行）：

1. \`启动 <n> 个协程, 每个累加 <k> 次\`
2. \`期望值: <n*k>\`
3. \`实际值: <counter>\`
4. 相等时 \`没有竞态, 结果正确!\`，否则 \`发生竞态, 结果丢失!\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`10 1000\` | \`启动 10 个协程, 每个累加 1000 次\`<br>\`期望值: 10000\`<br>\`实际值: 10000\`<br>\`没有竞态, 结果正确!\` |`,
    starter: `package main

import "fmt"

func main() {
	var n, k int
	fmt.Scan(&n, &k)

	fmt.Printf("启动 %d 个协程, 每个累加 %d 次\\n", n, k)
	fmt.Printf("期望值: %d\\n", n*k)

	// TODO 1: counter := 0；补 import "sync"，声明 sync.Mutex 与 sync.WaitGroup
	// TODO 2: 起 n 个协程，每个循环 k 次 counter++
	// TODO 3: 关键：counter++ 的读-加-写必须被 mu.Lock()/mu.Unlock() 包住
	// TODO 4: wg.Wait() 后打印实际值，并判断是否等于期望值
}
`,
    solution: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var n, k int
	fmt.Scan(&n, &k)

	var (
		mu      sync.Mutex
		wg      sync.WaitGroup
		counter int
	)
	fmt.Printf("启动 %d 个协程, 每个累加 %d 次\\n", n, k)
	fmt.Printf("期望值: %d\\n", n*k)

	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := 0; j < k; j++ {
				mu.Lock()
				counter++
				mu.Unlock()
			}
		}()
	}
	wg.Wait()

	fmt.Printf("实际值: %d\\n", counter)
	if counter == n*k {
		fmt.Println("没有竞态, 结果正确!")
	} else {
		fmt.Println("发生竞态, 结果丢失!")
	}
}
`,
    hints: [
      '临界区就是 counter++ 这一行：`mu.Lock(); counter++; mu.Unlock()`。把它放进循环里，每个协程每次自增都持锁，丢失更新就不会发生。',
      '协程骨架：`wg.Add(1)` + `go func() { defer wg.Done(); for j := 0; j < k; j++ { ... } }()`，最后 `wg.Wait()` 等待全部结束再读 counter。',
      '别忘了补 import "sync"。最后一行判断：`if counter == n*k` 输出 `fmt.Println("没有竞态, 结果正确!")`，否则输出"发生竞态, 结果丢失!"。加锁正确实现下永远走前者。',
    ],
    tests: [
      {
        name: '样例：10 1000',
        stdin: '10 1000\n',
        expected: '启动 10 个协程, 每个累加 1000 次\n期望值: 10000\n实际值: 10000\n没有竞态, 结果正确!',
      },
      {
        name: '样例：5 200',
        stdin: '5 200\n',
        expected: '启动 5 个协程, 每个累加 200 次\n期望值: 1000\n实际值: 1000\n没有竞态, 结果正确!',
      },
      {
        name: '隐藏：最小输入',
        stdin: '1 1\n',
        expected: '启动 1 个协程, 每个累加 1 次\n期望值: 1\n实际值: 1\n没有竞态, 结果正确!',
        hidden: true,
      },
      {
        name: '隐藏：20 500',
        stdin: '20 500\n',
        expected: '启动 20 个协程, 每个累加 500 次\n期望值: 10000\n实际值: 10000\n没有竞态, 结果正确!',
        hidden: true,
      },
      {
        name: '隐藏：3 7',
        stdin: '3 7\n',
        expected: '启动 3 个协程, 每个累加 7 次\n期望值: 21\n实际值: 21\n没有竞态, 结果正确!',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-advanced-8',
    lang: 'go',
    module: 'advanced',
    order: 8,
    title: 'select 多路复用',
    difficulty: 4,
    xp: 40,
    goals: [
      '用 select 同时监听多个 channel',
      '用 default 实现 select 的非阻塞探测',
      '理解"多个就绪随机挑、全不就绪走 default"',
    ],
    brief: `## select：同时等多个 channel

select 专治"不知道哪个 channel 先来"：

\`\`\`go
select {
case x := <-chA:
    fmt.Println("A:", x)
case y := <-chB:
    fmt.Println("B:", y)
}
\`\`\`

谁就绪走谁；**多个同时就绪则随机挑一个**（防止饥饿）；全都没就绪就阻塞等待。

## default：非阻塞尝试

带 default 的 select 绝不阻塞 —— 所有 case 都没就绪时走 default：

\`\`\`go
select {
case x := <-ch:
    fmt.Println(x)
default:
    fmt.Println("还没数据")
}
\`\`\`

常用于：非阻塞探测、轮询 + 其它工作交替。

> ⚠️ select 的 case 必须是 channel 收发；nil channel 的 case 永远不就绪（可用来"关掉"某条分支）。循环 select 时记得设计退出条件，防止死循环。`,
    task: `## 任务：双通道调度台

程序分三幕：

1. **启动前**：用 select + default 非阻塞探测空的 \`chOdd\`，打印 \`启动前探测: 通道空闲\`
2. **生产者协程**：按输入顺序，把第 i 个数（1 起）发送到奇数位通道 \`chOdd\` 或偶数位通道 \`chEven\`（无缓冲），全部发完 \`close(done)\`
3. **主协程**：select 循环从两个通道接收，打印 \`奇位通道: <x>\` 或 \`偶位通道: <x>\`；收满 n 个后打印 \`调度完成\`

**输入**：第一行 n（1 ≤ n ≤ 8）；第二行 n 个整数

**输出**：1 行探测 + n 行调度 + 1 行完成

### 示例

| 输入 | 输出 |
| --- | --- |
| \`4\`<br>\`10 20 30 40\` | \`启动前探测: 通道空闲\`<br>\`奇位通道: 10\`<br>\`偶位通道: 20\`<br>\`奇位通道: 30\`<br>\`偶位通道: 40\`<br>\`调度完成\` |

> 💡 生产者协程交替向两个通道发送、且通道无缓冲，任意时刻只有一个发送在等待 —— 输出顺序因此确定。`,
    starter: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	nums := make([]int, n)
	for i := range nums {
		fmt.Scan(&nums[i])
	}

	chOdd := make(chan int)

	// 第一幕（已给出）：select + default 非阻塞探测空通道
	select {
	case <-chOdd:
		fmt.Println("意外收到数据")
	default:
		fmt.Println("启动前探测: 通道空闲")
	}

	// TODO 1: 补齐通道：chEven := make(chan int)、done := make(chan struct{})
	// TODO 2: 启动生产者协程：第 i 个数（1 起奇数下标）发 chOdd，偶数发 chEven，发完 close(done)
	// TODO 3: select 循环接收 n 个值，打印"奇位通道: x"/"偶位通道: x"
	// TODO 4: 打印"调度完成"
}
`,
    solution: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	nums := make([]int, n)
	for i := range nums {
		fmt.Scan(&nums[i])
	}

	chOdd := make(chan int) // 无缓冲：发送方阻塞到被接收
	chEven := make(chan int)
	done := make(chan struct{})

	// 1. 非阻塞探测：default 分支立即执行
	select {
	case <-chOdd:
		fmt.Println("意外收到数据")
	default:
		fmt.Println("启动前探测: 通道空闲")
	}

	// 2. 生产者协程：按顺序把数字发送到奇/偶位通道
	go func() {
		for i, x := range nums {
			if (i+1)%2 == 1 {
				chOdd <- x
			} else {
				chEven <- x
			}
		}
		close(done)
	}()

	// 3. select 循环：哪个通道就绪就走哪个分支
	received := 0
	for received < n {
		select {
		case x := <-chOdd:
			fmt.Printf("奇位通道: %d\\n", x)
			received++
		case x := <-chEven:
			fmt.Printf("偶位通道: %d\\n", x)
			received++
		case <-done:
		}
	}
	fmt.Println("调度完成")
}
`,
    hints: [
      '非阻塞探测要在启动生产者之前做（通道一定为空）：`select { case <-chOdd: ...; default: fmt.Println("启动前探测: 通道空闲") }`。',
      '生产者协程按 1 起的下标分流：`if (i+1)%2 == 1 { chOdd <- x } else { chEven <- x }`，循环结束后 `close(done)`。无缓冲通道保证每次只有一个发送在等待。',
      '主循环用计数控制退出：`for received < n { select { case x := <-chOdd: ...; case x := <-chEven: ...; case <-done: } }`，收到就 received++ 并打印。收满后 `fmt.Println("调度完成")`。',
    ],
    tests: [
      {
        name: '样例：4 个数',
        stdin: '4\n10 20 30 40\n',
        expected: '启动前探测: 通道空闲\n奇位通道: 10\n偶位通道: 20\n奇位通道: 30\n偶位通道: 40\n调度完成',
      },
      {
        name: '样例：1 个数',
        stdin: '1\n5\n',
        expected: '启动前探测: 通道空闲\n奇位通道: 5\n调度完成',
      },
      {
        name: '隐藏：3 个数',
        stdin: '3\n1 2 3\n',
        expected: '启动前探测: 通道空闲\n奇位通道: 1\n偶位通道: 2\n奇位通道: 3\n调度完成',
        hidden: true,
      },
      {
        name: '隐藏：6 个零',
        stdin: '6\n0 0 0 0 0 0\n',
        expected: '启动前探测: 通道空闲\n奇位通道: 0\n偶位通道: 0\n奇位通道: 0\n偶位通道: 0\n奇位通道: 0\n偶位通道: 0\n调度完成',
        hidden: true,
      },
    ],
  },
];
