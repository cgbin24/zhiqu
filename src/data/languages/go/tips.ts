import type { Level } from '@/types';

/** Go · 第四章：开发实用技巧（6 关） */
export const GO_TIPS: Level[] = [
  {
    id: 'go-tips-1',
    lang: 'go',
    module: 'tips',
    order: 1,
    title: 'strings 包速查',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握 Fields / Split / Join / Contains / ToUpper',
      '学会用 bufio.Scanner 按行读取输入',
      '用 strings.Builder 高效拼接字符串',
    ],
    brief: `## strings 包速查

处理字符串的高频函数，一张表记住：

| 函数 | 作用 |
| --- | --- |
| Fields(s) | 按任意空白切分（自动合并连续空格） |
| Split(s, ",") | 按指定分隔符切分 |
| Join(parts, "-") | 把 []string 拼回字符串 |
| Contains(s, sub) | 是否包含子串 |
| ToUpper / ToLower | 大小写转换 |
| TrimSpace(s) | 去首尾空白 |

\`\`\`go
fields := strings.Fields("go  is   fun") // [go is fun]
s := strings.Join(fields, "-")           // go-is-fun
\`\`\`

## strings.Builder：高效拼接

循环里用 \`s += x\` 每次都复制整串（O(n²)）；Builder 内部维护字节缓冲，WriteString 摊还 O(1)：

\`\`\`go
var b strings.Builder
for _, p := range parts {
    b.WriteString(p)
}
out := b.String()
\`\`\`

> 💡 Split 不合并空字段（"a,,b" → [a "" b]），Fields 会自动忽略空白 —— 两者别混用。按行读输入用 \`bufio.Scanner\`，记得 TrimSpace 去掉行尾的回车。`,
    task: `## 任务：字符串实验台

按行读入三行输入：

1. 一句英文（单词间以空格分隔）
2. 一个待查找的单词
3. 一个逗号分隔的串

依次输出七行实验结果：

1. \`单词数: <Fields 长度>\`
2. \`连接: <Join(fields, "-")>\`
3. \`包含 <target>: <Contains(sentence, target)>\`
4. \`大写: <ToUpper(sentence)>\`
5. \`CSV 拆分: <Split(csv, ",") 的 %v 形式>\`
6. \`CSV 重组: <Join(parts, "|")>\`
7. \`Builder 拼接: <各段大写后用 + 连接>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`go is fun\`<br>\`go\`<br>\`x,y,z\` | \`单词数: 3\`<br>\`连接: go-is-fun\`<br>\`包含 go: true\`<br>\`大写: GO IS FUN\`<br>\`CSV 拆分: [x y z]\`<br>\`CSV 重组: x|y|z\`<br>\`Builder 拼接: X+Y+Z\` |`,
    starter: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	sc := bufio.NewScanner(os.Stdin)
	readLine := func() string {
		if sc.Scan() {
			return strings.TrimSpace(sc.Text())
		}
		return ""
	}

	sentence := readLine()

	// TODO 1: 再读两行：target := readLine()，csv := readLine()
	// TODO 2: fields := strings.Fields(sentence)，打印"单词数: <len>"
	fmt.Printf("单词数: %d\\n", len(strings.Fields(sentence)))
	// TODO 3: 用 strings.Join 以 "-" 连接 fields，打印"连接: ..."
	// TODO 4: 用 strings.Contains 判断 sentence 是否包含 target，打印"包含 <target>: true/false"
	// TODO 5: 用 strings.ToUpper 打印"大写: ..."
	// TODO 6: 用 strings.Split 按 "," 拆分 csv，用 %v 打印"CSV 拆分: [...]"
	// TODO 7: 用 strings.Join 以 "|" 重组，打印"CSV 重组: ..."
	// TODO 8: 用 strings.Builder 把各段大写后以 "+" 拼接，打印"Builder 拼接: ..."
}
`,
    solution: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	sc := bufio.NewScanner(os.Stdin)
	readLine := func() string {
		if sc.Scan() {
			return strings.TrimSpace(sc.Text())
		}
		return ""
	}

	sentence := readLine()
	target := readLine()
	csv := readLine()

	fields := strings.Fields(sentence)
	fmt.Printf("单词数: %d\\n", len(fields))
	fmt.Printf("连接: %s\\n", strings.Join(fields, "-"))
	fmt.Printf("包含 %s: %t\\n", target, strings.Contains(sentence, target))
	fmt.Printf("大写: %s\\n", strings.ToUpper(sentence))

	parts := strings.Split(csv, ",")
	fmt.Printf("CSV 拆分: %v\\n", parts)
	fmt.Printf("CSV 重组: %s\\n", strings.Join(parts, "|"))

	// strings.Builder：高效拼接字符串
	var b strings.Builder
	for i, p := range parts {
		if i > 0 {
			b.WriteString("+")
		}
		b.WriteString(strings.ToUpper(p))
	}
	fmt.Printf("Builder 拼接: %s\\n", b.String())
}
`,
    hints: [
      '按行读入用 bufio.Scanner：`sc.Scan()` 返回是否还有行，`sc.Text()` 是内容（带行尾换行符，要 TrimSpace）。本题骨架已给出 readLine 闭包，直接调用三次。',
      '第 2~4 行：`strings.Join(fields, "-")`、`strings.Contains(sentence, target)`（用 %t 打印布尔）、`strings.ToUpper(sentence)`。注意"包含 go: true"里 target 原样嵌入。',
      'CSV 与 Builder：`parts := strings.Split(csv, ",")` 用 %v 打印会得到 [x y z]；Builder 循环里先写分隔符再写 `strings.ToUpper(p)`，避免行首多出 + 号。',
    ],
    tests: [
      {
        name: '样例：go is fun',
        stdin: 'go is fun\ngo\nx,y,z\n',
        expected: '单词数: 3\n连接: go-is-fun\n包含 go: true\n大写: GO IS FUN\nCSV 拆分: [x y z]\nCSV 重组: x|y|z\nBuilder 拼接: X+Y+Z',
      },
      {
        name: '样例：hello go world',
        stdin: 'hello go world\ngo\n1,22,333\n',
        expected: '单词数: 3\n连接: hello-go-world\n包含 go: true\n大写: HELLO GO WORLD\nCSV 拆分: [1 22 333]\nCSV 重组: 1|22|333\nBuilder 拼接: 1+22+333',
      },
      {
        name: '隐藏：不包含',
        stdin: 'go go go\ngopher\na,b,c\n',
        expected: '单词数: 3\n连接: go-go-go\n包含 gopher: false\n大写: GO GO GO\nCSV 拆分: [a b c]\nCSV 重组: a|b|c\nBuilder 拼接: A+B+C',
        hidden: true,
      },
      {
        name: '隐藏：单单词单段',
        stdin: 'Go\nGo\nz\n',
        expected: '单词数: 1\n连接: Go\n包含 Go: true\n大写: GO\nCSV 拆分: [z]\nCSV 重组: z\nBuilder 拼接: Z',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-tips-2',
    lang: 'go',
    module: 'tips',
    order: 2,
    title: 'strconv 数字翻译官',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握 Atoi / ParseFloat 与 Itoa / FormatFloat',
      '正确处理解析失败时的错误值',
      '认识 strconv 的标准错误消息格式',
    ],
    brief: `## strconv：字符串 ↔ 数字

字符串里的数字要"翻译"成真正的数字类型才能运算：

\`\`\`go
n, err := strconv.Atoi("42")              // string → int
f, err := strconv.ParseFloat("3.14", 64)  // string → float64
s := strconv.Itoa(42)                     // int → string
s2 := strconv.FormatFloat(3.6, 'f', 1, 64) // float64 → "3.6"
\`\`\`

## 错误处理是必修课

用户输入不可信，解析可能失败 —— Atoi 系列通过 (值, err) 双返回值报告问题，失败时 err 描述了原因：

\`\`\`go
n, err := strconv.Atoi("abc")
if err != nil {
    fmt.Println(err) // strconv.Atoi: parsing "abc": invalid syntax
}
\`\`\`

**绝不能忽略 err**：失败时 n 是零值 0，拿去计算会产出错误结果而不是崩溃 —— 更危险。

> ⚠️ FormatFloat 的第三参是小数位数（-1 表示最短表示）；Atoi 只认整数，小数请用 ParseFloat。`,
    task: `## 任务：数字翻译局

读入两个字符串 t1、t2（空格分隔）。t1 当作整数解析，t2 当作浮点数解析：

1. t1 解析成功：\`整数: <t1> * 10 = <n*10>\`；失败：\`整数解析失败: <err>\`
2. t2 解析成功：\`浮点: <t2> + 0.5 = <f+0.5, 保留 2 位>\`；失败：\`浮点解析失败: <err>\`
3. 两个都成功：\`回转: <Itoa(n)> 和 <FormatFloat(f+0.5, 'f', 1, 64)>\`；否则：\`回转: 解析失败, 无法回转\`

**输入**：一行两个字符串（不含空格）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`42 3.14\` | \`整数: 42 * 10 = 420\`<br>\`浮点: 3.14 + 0.5 = 3.64\`<br>\`回转: 42 和 3.6\` |
| \`abc x9\` | \`整数解析失败: strconv.Atoi: parsing "abc": invalid syntax\`<br>\`浮点解析失败: strconv.ParseFloat: parsing "x9": invalid syntax\`<br>\`回转: 解析失败, 无法回转\` |`,
    starter: `package main

import "fmt"

func main() {
	var s1, s2 string
	fmt.Scan(&s1, &s2)

	// TODO 1: 补 import "strconv"
	// TODO 2: n, err1 := strconv.Atoi(s1)
	//   成功打印"整数: <s1> * 10 = <n*10>"；失败打印"整数解析失败: <err1>"
	// TODO 3: f, err2 := strconv.ParseFloat(s2, 64)
	//   成功打印"浮点: <s2> + 0.5 = <%.2f>"；失败打印"浮点解析失败: <err2>"
	// TODO 4: 两个都成功时用 strconv.Itoa 与 strconv.FormatFloat 打印"回转: ..."
	//   否则打印"回转: 解析失败, 无法回转"
}
`,
    solution: `package main

import (
	"fmt"
	"strconv"
)

func main() {
	var s1, s2 string
	fmt.Scan(&s1, &s2)

	n, err1 := strconv.Atoi(s1)
	if err1 != nil {
		fmt.Printf("整数解析失败: %v\\n", err1)
	} else {
		fmt.Printf("整数: %s * 10 = %d\\n", s1, n*10)
	}

	f, err2 := strconv.ParseFloat(s2, 64)
	if err2 != nil {
		fmt.Printf("浮点解析失败: %v\\n", err2)
	} else {
		fmt.Printf("浮点: %s + 0.5 = %.2f\\n", s2, f+0.5)
	}

	if err1 == nil && err2 == nil {
		fmt.Printf("回转: %s 和 %s\\n", strconv.Itoa(n), strconv.FormatFloat(f+0.5, 'f', 1, 64))
	} else {
		fmt.Println("回转: 解析失败, 无法回转")
	}
}
`,
    hints: [
      '整数解析：`n, err1 := strconv.Atoi(s1)`，err1 非 nil 时直接打印 `fmt.Printf("整数解析失败: %v\\n", err1)`，错误消息本身就是标准格式，原样输出即可。',
      '浮点解析：`f, err2 := strconv.ParseFloat(s2, 64)`，成功时 `fmt.Printf("浮点: %s + 0.5 = %.2f\\n", s2, f+0.5)`。注意 %.2f 才能把 3.64 打全。',
      '回转：`strconv.Itoa(n)` 把 int 变回字符串；`strconv.FormatFloat(f+0.5, \'f\', 1, 64)` 保留 1 位小数（3.64 → "3.6"）。两个 err 都是 nil 才走回转分支。',
    ],
    tests: [
      {
        name: '样例：合法输入',
        stdin: '42 3.14\n',
        expected: '整数: 42 * 10 = 420\n浮点: 3.14 + 0.5 = 3.64\n回转: 42 和 3.6',
      },
      {
        name: '样例：双双失败',
        stdin: 'abc x9\n',
        expected: '整数解析失败: strconv.Atoi: parsing "abc": invalid syntax\n浮点解析失败: strconv.ParseFloat: parsing "x9": invalid syntax\n回转: 解析失败, 无法回转',
      },
      {
        name: '隐藏：负浮点',
        stdin: '100 -2.5\n',
        expected: '整数: 100 * 10 = 1000\n浮点: -2.5 + 0.5 = -2.00\n回转: 100 和 -2.0',
        hidden: true,
      },
      {
        name: '隐藏：整数坏浮点好',
        stdin: '3o 7\n',
        expected: '整数解析失败: strconv.Atoi: parsing "3o": invalid syntax\n浮点: 7 + 0.5 = 7.50\n回转: 解析失败, 无法回转',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-tips-3',
    lang: 'go',
    module: 'tips',
    order: 3,
    title: 'append 共享陷阱',
    difficulty: 2,
    xp: 25,
    goals: [
      '复现切片表达式共享底层数组的坑',
      '用 copy 彻底脱离原数组',
      '用首元素地址判断是否共享',
    ],
    brief: `## 复习：共享底层数组

切片表达式 \`s1[:2]\` 不会复制数据，新旧切片共享同一底层数组：

\`\`\`go
s1 := []int{1, 2, 3}
s2 := s1[:2]
s2[0] = 999 // s1 也变了！
\`\`\`

这在"裁剪后再修改"的场景下是隐形炸弹：你可能以为拿到了独立数据。

## copy：真正分离

内置 \`copy(dst, src)\` 把**元素值**复制进 dst 自己的内存：

\`\`\`go
s3 := make([]int, 2)
copy(s3, s1[:2]) // 值拷贝，s3 有自己的底层数组
s3[0] = 777      // s1 毫发无损
\`\`\`

验证是否共享：比较首元素地址 \`&s1[0] == &s2[0]\` —— 相同就是共享。

> ⚠️ 记住两条：要快、要共享 → 直接切；要独立、要修改 → 先 copy。Go 1.21+ 也可以用 \`slices.Clone\` 一行搞定。`,
    task: `## 任务：拆分与独立

读入 n 个整数存入 s1，然后：

1. 打印 \`原始: <s1>\`
2. \`s2 := s1[:2]\`，改 \`s2[0] = 999\`，打印 \`改 s2[0]=999 后 s1: <s1>\`（被连累！）
3. \`s3 := make([]int, 2)\`，\`copy(s3, s1[:2])\`，改 \`s3[0] = 777\`，再打印 s1（安然无恙）
4. 打印 \`指针对比: s2 共享=<bool>, s3 共享=<bool>\`（比较 &s1[0] 与 &s2[0]、&s3[0]）

**输入**：第一行 n（2 ≤ n ≤ 100）；第二行 n 个整数

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`1 2 3\` | \`原始: [1 2 3]\`<br>\`改 s2[0]=999 后 s1: [999 2 3]\`<br>\`copy 出 s3 改 s3[0]=777 后 s1: [999 2 3]\`<br>\`指针对比: s2 共享=true, s3 共享=false\` |`,
    starter: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	s1 := make([]int, n)
	for i := range s1 {
		fmt.Scan(&s1[i])
	}

	fmt.Printf("原始: %v\\n", s1)

	// TODO 1: s2 := s1[:2]，改 s2[0] = 999，打印 s1（被连累了！）
	// TODO 2: s3 := make([]int, 2)，copy(s3, s1[:2])，改 s3[0] = 777，打印 s1（安然无恙）
	// TODO 3: 比较 &s1[0] == &s2[0] 与 &s1[0] == &s3[0]，打印"指针对比: s2 共享=?, s3 共享=?"
}
`,
    solution: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	s1 := make([]int, n)
	for i := range s1 {
		fmt.Scan(&s1[i])
	}
	fmt.Printf("原始: %v\\n", s1)

	// 切片表达式共享底层数组
	s2 := s1[:2]
	s2[0] = 999
	fmt.Printf("改 s2[0]=999 后 s1: %v\\n", s1)

	// copy 复制值到新内存，彻底脱离
	s3 := make([]int, 2)
	copy(s3, s1[:2])
	s3[0] = 777
	fmt.Printf("copy 出 s3 改 s3[0]=777 后 s1: %v\\n", s1)

	fmt.Printf("指针对比: s2 共享=%t, s3 共享=%t\\n",
		&s1[0] == &s2[0], &s1[0] == &s3[0])
}
`,
    hints: [
      '`s2 := s1[:2]` 只是切了个视图：改 s2[0] 时 s1[0] 同步变成 999。打印用 `fmt.Printf("改 s2[0]=999 后 s1: %v\\n", s1)`。',
      'copy 用法：先 `s3 := make([]int, 2)` 分配新内存，再 `copy(s3, s1[:2])`。注意 s3 改完后第二次打印 s1 应保持 [999 2 ...] 不再变化。',
      '共享判定就是比较地址：`&s1[0] == &s2[0]`（true）与 `&s1[0] == &s3[0]`（false），用 %t 打印。格式串："指针对比: s2 共享=%t, s3 共享=%t"。',
    ],
    tests: [
      {
        name: '样例：3 个数',
        stdin: '3\n1 2 3\n',
        expected: '原始: [1 2 3]\n改 s2[0]=999 后 s1: [999 2 3]\ncopy 出 s3 改 s3[0]=777 后 s1: [999 2 3]\n指针对比: s2 共享=true, s3 共享=false',
      },
      {
        name: '样例：4 个数',
        stdin: '4\n10 20 30 40\n',
        expected: '原始: [10 20 30 40]\n改 s2[0]=999 后 s1: [999 20 30 40]\ncopy 出 s3 改 s3[0]=777 后 s1: [999 20 30 40]\n指针对比: s2 共享=true, s3 共享=false',
      },
      {
        name: '隐藏：刚好 2 个',
        stdin: '2\n7 8\n',
        expected: '原始: [7 8]\n改 s2[0]=999 后 s1: [999 8]\ncopy 出 s3 改 s3[0]=777 后 s1: [999 8]\n指针对比: s2 共享=true, s3 共享=false',
        hidden: true,
      },
      {
        name: '隐藏：全零',
        stdin: '5\n0 0 0 0 0\n',
        expected: '原始: [0 0 0 0 0]\n改 s2[0]=999 后 s1: [999 0 0 0 0]\ncopy 出 s3 改 s3[0]=777 后 s1: [999 0 0 0 0]\n指针对比: s2 共享=true, s3 共享=false',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-tips-4',
    lang: 'go',
    module: 'tips',
    order: 4,
    title: 'iota 枚举工坊',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握 iota 在 const 块中的自动递增',
      '实现 String() 方法让 fmt 打印枚举名',
      '处理越界枚举值（default 分支）',
    ],
    brief: `## iota：自动递增的常量计数器

在 const 块里，iota 从 0 开始，每换一行 +1：

\`\`\`go
type Level int

const (
    Low Level = iota // 0
    Mid              // 1（省略 = iota 自动沿用）
    High             // 2
    Max              // 3
)
\`\`\`

配合类型定义，得到一个"带类型的枚举"，比裸 int 常量安全得多。

## String() 方法：给枚举一张脸

实现 \`String() string\` 后，fmt 打印该类型时会自动调用它（这就是标准库的 Stringer 接口模式）：

\`\`\`go
func (l Level) String() string {
    switch l {
    case Low:
        return "Low"
    case Mid:
        return "Mid"
    // ...
    default:
        return "Unknown"
    }
}

fmt.Println(Mid) // Mid，而不是数字 1
\`\`\`

> ⚠️ 越界的枚举值（如 \`Level(9)\`）记得在 default 里返回 Unknown，别让 %d 直接漏出来。`,
    task: `## 任务：级别 enum

定义 \`type Level int\`，用 iota 定义 Low/Mid/High/Max（0~3），实现 \`String()\`（越界返回 Unknown）。

**输入**：一行一个整数 n（0 ≤ n ≤ 9）

**输出**（三行）：

1. \`你选择的级别: <String(n)> (编号 <n>)\`
2. \`下一级: <String(n+1)>\`；若 n 已是 Max，则输出 \`下一级: 已是最高\`
3. \`枚举列表: Low(0) Mid(1) High(2) Max(3)\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`1\` | \`你选择的级别: Mid (编号 1)\`<br>\`下一级: High\`<br>\`枚举列表: Low(0) Mid(1) High(2) Max(3)\` |
| \`3\` | \`你选择的级别: Max (编号 3)\`<br>\`下一级: 已是最高\`<br>\`枚举列表: Low(0) Mid(1) High(2) Max(3)\` |`,
    starter: `package main

import "fmt"

// TODO 1: 定义 type Level int
// TODO 2: 用 iota 定义常量 Low/Mid/High/Max（0~3）
// TODO 3: 实现 (l Level) String() string，越界返回 "Unknown"

func main() {
	var n int
	fmt.Scan(&n)

	// TODO 4: lv := Level(n)，打印"你选择的级别: <%v> (编号 <%d>)"
	// TODO 5: 不是 Max 时打印下一级（lv+1 会被 %v 自动转成名字），否则打印"下一级: 已是最高"
	// TODO 6: 循环打印"枚举列表: Low(0) Mid(1) High(2) Max(3)"
}
`,
    solution: `package main

import "fmt"

// Level 用 iota 定义枚举
type Level int

const (
	Low Level = iota // 0
	Mid              // 1
	High             // 2
	Max              // 3
)

// String 让 fmt 直接打印枚举名（Stringer 接口）
func (l Level) String() string {
	switch l {
	case Low:
		return "Low"
	case Mid:
		return "Mid"
	case High:
		return "High"
	case Max:
		return "Max"
	default:
		return "Unknown"
	}
}

func main() {
	var n int
	fmt.Scan(&n)

	lv := Level(n)
	fmt.Printf("你选择的级别: %v (编号 %d)\\n", lv, int(lv))
	if lv < Max {
		fmt.Printf("下一级: %v\\n", lv+1)
	} else {
		fmt.Println("下一级: 已是最高")
	}

	fmt.Print("枚举列表: ")
	for i := 0; i <= 3; i++ {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Printf("%s(%d)", Level(i), i)
	}
	fmt.Println()
}
`,
    hints: [
      'iota 从 0 开始逐行 +1：`const ( Low Level = iota; Mid; High; Max )`，后面三行省略赋值自动沿用上一行的表达式。',
      'String() 方法让 %v 打印名字而不是数字。下一级直接 `lv+1`（1 是无类型常量，自动适配 Level 类型），越界（lv == Max）时打印"下一级: 已是最高"。',
      '枚举列表行要避免行尾多空格：先 `fmt.Print("枚举列表: ")`，循环里在每项前补空格（首项除外），用 `fmt.Printf("%s(%d)", Level(i), i)`，最后 `fmt.Println()` 收尾。',
    ],
    tests: [
      {
        name: '样例：1（Mid）',
        stdin: '1\n',
        expected: '你选择的级别: Mid (编号 1)\n下一级: High\n枚举列表: Low(0) Mid(1) High(2) Max(3)',
      },
      {
        name: '样例：3（Max）',
        stdin: '3\n',
        expected: '你选择的级别: Max (编号 3)\n下一级: 已是最高\n枚举列表: Low(0) Mid(1) High(2) Max(3)',
      },
      {
        name: '隐藏：0（Low）',
        stdin: '0\n',
        expected: '你选择的级别: Low (编号 0)\n下一级: Mid\n枚举列表: Low(0) Mid(1) High(2) Max(3)',
        hidden: true,
      },
      {
        name: '隐藏：2（High）',
        stdin: '2\n',
        expected: '你选择的级别: High (编号 2)\n下一级: Max\n枚举列表: Low(0) Mid(1) High(2) Max(3)',
        hidden: true,
      },
      {
        name: '隐藏：9（越界）',
        stdin: '9\n',
        expected: '你选择的级别: Unknown (编号 9)\n下一级: 已是最高\n枚举列表: Low(0) Mid(1) High(2) Max(3)',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-tips-5',
    lang: 'go',
    module: 'tips',
    order: 5,
    title: 'fmt 动词大全',
    difficulty: 2,
    xp: 25,
    goals: [
      '区分 %v / %+v / %#v 三种打印粒度',
      '掌握 %q 与 %T 的用途',
      '知道打印百分号要写 %%',
    ],
    brief: `## fmt 动词：打印的显微镜

| 动词 | 作用 | 示例输出 |
| --- | --- | --- |
| %v | 默认格式 | {Alice 20 95.5} |
| %+v | 结构体带字段名 | {Name:Alice Age:20 Score:95.5} |
| %#v | Go 语法表示 | main.Student{Name:"Alice", Age:20, Score:95.5} |
| %q | 带引号字符串 | "Alice" |
| %T | 类型名 | main.Student |
| %.1f | 保留 1 位小数 | 95.5 |

\`\`\`go
type Student struct {
    Name  string
    Age   int
    Score float64
}
fmt.Printf("%+v\\n", Student{"Alice", 20, 95.5})
\`\`\`

%v 一把梭适合临时调试；%+v 能看清结构体每个字段；%#v 直接给出可复制的 Go 字面量，排查类型问题时是神器。

> ⚠️ Printf 的格式串里想打印百分号本身要写 \`%%\`；动词与参数个数必须匹配，否则会输出 %!v(MISSING) 之类的占位符。`,
    task: `## 任务：动词观察仪

定义 \`Student\` 结构体（\`Name string\`、\`Age int\`、\`Score float64\`），读入三个值构造实例，用六种动词各打印一行：

1. \`%v:  <%v 结果>\`
2. \`%+v: <%+v 结果>\`
3. \`%#v: <%#v 结果>\`
4. \`%q:  <%q 打印 Name>\`
5. \`%T:  <%T 打印结构体类型>\`
6. \`%.1f: <Score 保留 1 位小数>\`

（注意：1~5 行冒号后是**两个空格**，第 6 行是一个空格，与示例逐字一致。）

**输入**：一行：名字（不含空格） 年龄 分数

### 示例

| 输入 | 输出 |
| --- | --- |
| \`Alice 20 95.5\` | \`%v:  {Alice 20 95.5}\`<br>\`%+v: {Name:Alice Age:20 Score:95.5}\`<br>\`%#v: main.Student{Name:"Alice", Age:20, Score:95.5}\`<br>\`%q:  "Alice"\`<br>\`%T:  main.Student\`<br>\`%.1f: 95.5\` |`,
    starter: `package main

import "fmt"

// TODO 1: 定义 Student struct{ Name string; Age int; Score float64 }

func main() {
	var name string
	var age int
	var score float64
	fmt.Scan(&name, &age, &score)

	// TODO 2: st := Student{Name: name, Age: age, Score: score}
	// TODO 3: 依次用 %v / %+v / %#v / %q / %T / %.1f 打印六行
	// 提示：Printf 的格式串里打印百分号本身要写成 %%
	fmt.Println(name, age, score)
}
`,
    solution: `package main

import "fmt"

type Student struct {
	Name  string
	Age   int
	Score float64
}

func main() {
	var name string
	var age int
	var score float64
	fmt.Scan(&name, &age, &score)

	st := Student{Name: name, Age: age, Score: score}
	fmt.Printf("%%v:  %v\\n", st)
	fmt.Printf("%%+v: %+v\\n", st)
	fmt.Printf("%%#v: %#v\\n", st)
	fmt.Printf("%%q:  %q\\n", st.Name)
	fmt.Printf("%%T:  %T\\n", st)
	fmt.Printf("%%.1f: %.1f\\n", st.Score)
}
`,
    hints: [
      '格式串里打印百分号本身用 %%：`fmt.Printf("%%v:  %v\\n", st)` 先输出字面量 %v:，再输出结构体的默认格式 {Alice 20 95.5}。',
      '%+v 带字段名（{Name:Alice Age:20 Score:95.5}）；%#v 是 Go 语法表示（main.Student{Name:"Alice", Age:20, Score:95.5}），字段间是英文逗号加空格。',
      '%q 给字符串加双引号：`fmt.Printf("%%q:  %q\\n", st.Name)`；%T 打印类型名 main.Student。前 5 行冒号后两个空格，最后一行 `fmt.Printf("%%.1f: %.1f\\n", st.Score)`。',
    ],
    tests: [
      {
        name: '样例：Alice',
        stdin: 'Alice 20 95.5\n',
        expected: '%v:  {Alice 20 95.5}\n%+v: {Name:Alice Age:20 Score:95.5}\n%#v: main.Student{Name:"Alice", Age:20, Score:95.5}\n%q:  "Alice"\n%T:  main.Student\n%.1f: 95.5',
      },
      {
        name: '样例：Bob',
        stdin: 'Bob 18 88.5\n',
        expected: '%v:  {Bob 18 88.5}\n%+v: {Name:Bob Age:18 Score:88.5}\n%#v: main.Student{Name:"Bob", Age:18, Score:88.5}\n%q:  "Bob"\n%T:  main.Student\n%.1f: 88.5',
      },
      {
        name: '隐藏：整百分数',
        stdin: 'Go1 15 100\n',
        expected: '%v:  {Go1 15 100}\n%+v: {Name:Go1 Age:15 Score:100}\n%#v: main.Student{Name:"Go1", Age:15, Score:100}\n%q:  "Go1"\n%T:  main.Student\n%.1f: 100.0',
        hidden: true,
      },
      {
        name: '隐藏：下划线名字',
        stdin: 'Coder_99 30 59.5\n',
        expected: '%v:  {Coder_99 30 59.5}\n%+v: {Name:Coder_99 Age:30 Score:59.5}\n%#v: main.Student{Name:"Coder_99", Age:30, Score:59.5}\n%q:  "Coder_99"\n%T:  main.Student\n%.1f: 59.5',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-tips-6',
    lang: 'go',
    module: 'tips',
    order: 6,
    title: '错误包装 %w',
    difficulty: 3,
    xp: 30,
    goals: [
      '用 fmt.Errorf 的 %w 动词包装底层错误',
      '用 errors.Is 穿透包装链识别哨兵错误',
      '理解"包装保留身份，拼接丢失身份"',
    ],
    brief: `## 错误包装 %w

多层函数调用中，底层错误传到上层时最好带上"案发经过"：

\`\`\`go
var ErrInsufficient = errors.New("余额不足") // 哨兵错误

func withdraw(balance, amount int) (int, error) {
    if amount > balance {
        return balance, fmt.Errorf("取款 %d 失败: %w", amount, ErrInsufficient)
    }
    ...
}
\`\`\`

动词 **%w** 包装原错误：外层消息更完整，内层错误的**身份**保留。

## errors.Is：沿着错误链找身份

\`\`\`go
err := withdraw(100, 500)
fmt.Println(err)                // 取款 500 失败: 余额不足
errors.Is(err, ErrInsufficient) // true！隔着包装也能认出
\`\`\`

errors.Is 会逐层解包比对，比 \`err == ErrInsufficient\` 强大得多 —— 后者遇到包装就失效。配套的 errors.As 则按**类型**提取错误详情。

> ⚠️ 哨兵错误用 \`var ErrXxx = errors.New(...)\` 声明，首字母大写导出，调用方才能 errors.Is 判断。用 %v 而不是 %w 拼接错误，身份就丢了，Is 会变 false。`,
    task: `## 任务：错误链侦探

定义哨兵错误 \`ErrInsufficient = errors.New("余额不足")\`，实现 \`withdraw(balance, amount int) (int, error)\`：

- \`amount <= 0\`：返回 \`fmt.Errorf("取款金额 %d 无效", amount)\` —— 故意**不用** %w
- \`amount > balance\`：返回 \`fmt.Errorf("取款 %d 失败: %w", amount, ErrInsufficient)\`
- 成功：返回新余额和 nil

**输入**：一行两个整数：余额 金额

**输出**：

- 成功：\`取款成功, 余额 = <新余额>\`
- 失败：先 \`错误链: <err>\`，再 \`errors.Is 余额不足: <bool>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`100 500\` | \`错误链: 取款 500 失败: 余额不足\`<br>\`errors.Is 余额不足: true\` |
| \`100 0\` | \`错误链: 取款金额 0 无效\`<br>\`errors.Is 余额不足: false\` |
| \`100 30\` | \`取款成功, 余额 = 70\` |`,
    starter: `package main

import "fmt"

// TODO 1: 补 import "errors"；定义哨兵错误 var ErrInsufficient = errors.New("余额不足")
// TODO 2: 实现 withdraw(balance, amount int) (int, error)：
//   金额 <= 0 → fmt.Errorf("取款金额 %d 无效", amount)（故意不包装，观察 errors.Is 的差异）
//   余额不足 → fmt.Errorf("取款 %d 失败: %w", amount, ErrInsufficient)

func main() {
	var balance, amount int
	fmt.Scan(&balance, &amount)

	// TODO 3: 调用 withdraw；有错时打印"错误链: <err>"并用 errors.Is 判断
	//   无错时打印"取款成功, 余额 = <b>"
}
`,
    solution: `package main

import (
	"errors"
	"fmt"
)

// 哨兵错误：包级别的"错误常量"，调用方可以用 errors.Is 精确识别
var ErrInsufficient = errors.New("余额不足")

func withdraw(balance, amount int) (int, error) {
	if amount <= 0 {
		// 故意不用 %w：错误身份丢失，errors.Is 认不出
		return balance, fmt.Errorf("取款金额 %d 无效", amount)
	}
	if amount > balance {
		return balance, fmt.Errorf("取款 %d 失败: %w", amount, ErrInsufficient)
	}
	return balance - amount, nil
}

func main() {
	var balance, amount int
	fmt.Scan(&balance, &amount)

	newBalance, err := withdraw(balance, amount)
	if err != nil {
		fmt.Printf("错误链: %v\\n", err)
		if errors.Is(err, ErrInsufficient) {
			fmt.Println("errors.Is 余额不足: true")
		} else {
			fmt.Println("errors.Is 余额不足: false")
		}
		return
	}
	fmt.Printf("取款成功, 余额 = %d\\n", newBalance)
}
`,
    hints: [
      '哨兵错误放包级：`var ErrInsufficient = errors.New("余额不足")`。包装用 %w：`fmt.Errorf("取款 %d 失败: %w", amount, ErrInsufficient)`，消息与身份都保留。',
      '无效金额那条分支故意用 %v 风格拼接（不带 %w），这样 errors.Is(err, ErrInsufficient) 返回 false —— 体会"包装保留身份，拼接丢失身份"。',
      'main 判断：`errors.Is(err, ErrInsufficient)` 为 true 打印"errors.Is 余额不足: true"否则 false。成功路径打印 `fmt.Printf("取款成功, 余额 = %d\\n", newBalance)`。',
    ],
    tests: [
      {
        name: '样例：余额不足',
        stdin: '100 500\n',
        expected: '错误链: 取款 500 失败: 余额不足\nerrors.Is 余额不足: true',
      },
      {
        name: '样例：无效金额',
        stdin: '100 0\n',
        expected: '错误链: 取款金额 0 无效\nerrors.Is 余额不足: false',
      },
      {
        name: '隐藏：成功',
        stdin: '100 30\n',
        expected: '取款成功, 余额 = 70',
        hidden: true,
      },
      {
        name: '隐藏：零余额',
        stdin: '0 10\n',
        expected: '错误链: 取款 10 失败: 余额不足\nerrors.Is 余额不足: true',
        hidden: true,
      },
      {
        name: '隐藏：负金额',
        stdin: '-3 -5\n',
        expected: '错误链: 取款金额 -5 无效\nerrors.Is 余额不足: false',
        hidden: true,
      },
    ],
  },
];
