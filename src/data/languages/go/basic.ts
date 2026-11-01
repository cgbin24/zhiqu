import type { Level } from '@/types';

/** Go · 第一章：基础语法结构（8 关） */
export const GO_BASIC: Level[] = [
  {
    id: 'go-basic-1',
    lang: 'go',
    module: 'basic',
    order: 1,
    title: '你好，冒险者',
    difficulty: 1,
    xp: 15,
    goals: [
      '理解 Go 程序的基本结构：package、import、func main',
      '学会使用 fmt.Println 输出文本',
      '成功跑通第一个 Go 程序',
    ],
    brief: `## 你的第一个 Go 程序

每个 Go 程序都从 \`main\` 包的 \`main\` 函数开始执行。一个最小但完整的 Go 程序长这样：

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
\`\`\`

三行结构缺一不可：

- **\`package main\`** —— 声明本文件属于 \`main\` 包。可执行程序必须有一个 main 包。
- **\`import "fmt"\`** —— 引入标准库的 \`fmt\` 包，它负责格式化输入输出。Go 是编译型语言，import 了就必须使用，否则编译报错。
- **\`func main()\`** —— 程序入口。注意 Go 的左大括号 \`{\` **必须**和函数声明在同一行，这是语言强制规范。

\`fmt.Println\` 会打印参数并自动追加换行符。它支持一次打印多个值：

\`\`\`go
fmt.Println("A", "B", 3) // 输出：A B 3（参数间自动加空格）
\`\`\`

> 💡 在右侧编辑器写完代码后，点「运行」看效果，点「提交评测」接受测试点检验。`,
    task: `## 任务

从标准输入读取你的冒险者代号（一个不含空格的字符串），向它问好。

**输入**：一行一个字符串，如 \`Zhi\`

**输出**：一行，格式为 \`你好, <代号>! 欢迎来到智码世界。\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`Zhi\` | \`你好, Zhi! 欢迎来到智码世界。\` |
| \`Gopher\` | \`你好, Gopher! 欢迎来到智码世界。\` |

用 \`fmt.Scan(&s)\` 可以读入一个以空白分隔的字符串（\`s\` 是已声明的 string 变量）。`,
    starter: `package main

import "fmt"

func main() {
	// TODO 1: 声明一个 string 变量 s
	// TODO 2: 用 fmt.Scan 读取输入到 s
	// TODO 3: 按格式打印问候语
}
`,
    solution: `package main

import "fmt"

func main() {
	var s string
	fmt.Scan(&s)
	fmt.Println("你好,", s + "! 欢迎来到智码世界。")
}
`,
    hints: [
      '声明变量用 `var s string`，读取输入用 `fmt.Scan(&s)` —— 注意取地址符 `&`。',
      'fmt.Println 的多个参数之间会自动加一个空格：`fmt.Println("你好,", s + "! 欢迎来到智码世界。")`。也可以用 `fmt.Printf("你好, %s! 欢迎来到智码世界。\\n", s)`。',
      '完整方案：先 `var s string`，再 `fmt.Scan(&s)`，最后 `fmt.Println("你好,", s+"! 欢迎来到智码世界。")`。注意逗号后有空格、感叹号紧跟代号。',
    ],
    tests: [
      { name: '样例 1：Zhi', stdin: 'Zhi\n', expected: '你好, Zhi! 欢迎来到智码世界。' },
      { name: '样例 2：Gopher', stdin: 'Gopher\n', expected: '你好, Gopher! 欢迎来到智码世界。' },
      { name: '隐藏：含数字代号', stdin: 'Coder99\n', expected: '你好, Coder99! 欢迎来到智码世界。', hidden: true },
      { name: '隐藏：单字符代号', stdin: 'Q\n', expected: '你好, Q! 欢迎来到智码世界。', hidden: true },
    ],
  },
  {
    id: 'go-basic-2',
    lang: 'go',
    module: 'basic',
    order: 2,
    title: '变量容器与交换戏法',
    difficulty: 1,
    xp: 20,
    goals: [
      '掌握 var 声明与短变量声明 :=',
      '理解 Go 的强类型与同类型多变量声明',
      '练习读入多个整数并按指定格式输出',
    ],
    brief: `## 变量：存放数据的容器

Go 是**强类型**语言，每个变量都有确定的类型。声明方式有两种：

\`\`\`go
var a int = 10      // 完整声明：var 名字 类型 = 初值
var b = 20          // 类型推断：编译器猜出 b 是 int
c := 30             // 短声明：只能在函数内使用，最常用
x, y := 1, 2        // 一行声明多个变量
\`\`\`

Go 的规矩很严格：

- **声明了就必须使用**，否则编译错误（\`declared and not used\`）。
- **\`:=\` 只能用于新变量**，已声明的变量用 \`=\` 赋值。
- 常量用 \`const\` 声明，编译期确定、不可修改：\`const Pi = 3.14159\`。

### 读入多个数

\`fmt.Scan\` 会自动跳过空白（空格、换行）连续读取：

\`\`\`go
var a, b int
fmt.Scan(&a, &b) // 输入 "3 5" 或两行各一个数都可以
\`\`\``,
    task: `## 任务：交换戏法

读入两个整数 \`a\` 和 \`b\`，**交换它们的值**后按格式输出。

**输入**：一行两个整数 a b（用空格分隔）

**输出**：一行，格式为 \`交换前: a=?, b=?\` 和 \`交换后: a=?, b=?\` 两行

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 7\` | \`交换前: a=3, b=7\`<br>\`交换后: a=7, b=3\` |

提示：交换两个变量的经典写法是借助临时变量 \`t := a; a = b; b = t\`（Go 也支持 \`a, b = b, a\` 元组赋值，不妨都试试）。`,
    starter: `package main

import "fmt"

func main() {
	var a, b int
	fmt.Scan(&a, &b)

	// TODO: 交换 a 和 b 的值

	fmt.Printf("交换前: a=%d, b=%d\\n", /* 填什么？ */, /* 填什么？ */)
	fmt.Printf("交换后: a=%d, b=%d\\n", a, b)
}
`,
    solution: `package main

import "fmt"

func main() {
	var a, b int
	fmt.Scan(&a, &b)
	x, y := a, b
	a, b = b, a
	fmt.Printf("交换前: a=%d, b=%d\\n", x, y)
	fmt.Printf("交换后: a=%d, b=%d\\n", a, b)
}
`,
    hints: [
      '必须在读入后、交换前先保存原始值（如 `x, y := a, b`），否则打印"交换前"时已经是交换后的值了。',
      'Go 的元组交换一行搞定：`a, b = b, a`。也可以用临时变量 `t := a; a = b; b = t`。',
      '%d 是整数的格式化占位符。完整实现：读入后立即 `x, y := a, b` 保存副本，然后 `a, b = b, a`，先打印 x/y 再打印 a/b。',
    ],
    tests: [
      { name: '样例：3 7', stdin: '3 7\n', expected: '交换前: a=3, b=7\n交换后: a=7, b=3' },
      { name: '样例：-5 12', stdin: '-5 12\n', expected: '交换前: a=-5, b=12\n交换后: a=12, b=-5' },
      { name: '隐藏：相等值', stdin: '42 42\n', expected: '交换前: a=42, b=42\n交换后: a=42, b=42', hidden: true },
      { name: '隐藏：零值', stdin: '0 9\n', expected: '交换前: a=0, b=9\n交换后: a=9, b=0', hidden: true },
    ],
  },
  {
    id: 'go-basic-3',
    lang: 'go',
    module: 'basic',
    order: 3,
    title: '类型窥探者',
    difficulty: 2,
    xp: 25,
    goals: [
      '认识 Go 的基础类型：int / float64 / string / bool',
      '学会显式类型转换 T(v)',
      '用 fmt.Printf 的 %T 动词窥探类型',
    ],
    brief: `## Go 的基础类型

| 类型 | 用途 | 零值 |
| --- | --- | --- |
| \`int\` | 整数 | 0 |
| \`float64\` | 浮点数（双精度） | 0.0 |
| \`string\` | 字符串（UTF-8） | "" |
| \`bool\` | 真假值 | false |

**Go 不允许隐式类型转换**。下面的代码编译不过：

\`\`\`go
var a int = 3
var b float64 = a        // ❌ 编译错误
var b float64 = float64(a) // ✅ 显式转换
\`\`\`

整数和浮点数运算前必须先统一类型：

\`\`\`go
n := 7
half := float64(n) / 2 // 3.5
\`\`\`

### fmt.Printf 与动词

\`fmt.Printf\` 用占位符格式化输出，常用动词：

- \`%d\` 整数、\`%s\` 字符串、\`%t\` 布尔
- \`%f\` 浮点（默认 6 位小数）、\`%.2f\` 保留 2 位
- \`%T\` 打印变量的**类型名**

\`\`\`go
fmt.Printf("类型是 %T, 值是 %.2f\\n", 3.14, 3.14)
// 类型是 float64, 值是 3.14
\`\`\``,
    task: `## 任务：三重窥探

读入一个整数 \`n\`，完成三次"类型变形"并输出侦探报告。

**输入**：一行一个整数 n（1 ≤ n ≤ 1000）

**输出**：三行

1. \`原始: n=<n> (<int 类型>)\` —— 用 %T 打印出实际类型名
2. \`平方: <n*n>\`
3. \`半价: <n/2 的浮点结果，保留 1 位小数>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`7\` | \`原始: n=7 (int 类型)\`<br>\`平方: 49\`<br>\`半价: 3.5\` |
| \`10\` | \`原始: n=10 (int 类型)\`<br>\`平方: 100\`<br>\`半价: 5.0\` |

注意：第 1 行括号里的类型必须用 \`%T\` 打印得到（本题中即为 int）。第 3 行要用 \`float64(n)/2\` 并用 \`%.1f\` 输出（5.0 也要显示 \`.0\`）。`,
    starter: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	// TODO 1: 打印原始行（用 %T 打印类型）
	// TODO 2: 打印平方
	// TODO 3: 把 n 转成 float64 再除以 2，用 %.1f 打印
}
`,
    solution: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	fmt.Printf("原始: n=%d (%T 类型)\\n", n, n)
	fmt.Printf("平方: %d\\n", n*n)
	fmt.Printf("半价: %.1f\\n", float64(n)/2)
}
`,
    hints: [
      '%T 会打印类型的 Go 名字（int / float64 / string…），直接把 n 作为参数传给它：`fmt.Printf("(%T 类型)", n)`。',
      '整数平方直接 `n*n` 用 %d 打印。但除法要注意：Go 里 `7/2` 是整数除法得 3，想得到 3.5 必须先转换：`float64(n)/2`。',
      '`%.1f` 表示保留 1 位小数（5 会显示成 5.0）。完整三行：`fmt.Printf("原始: n=%d (%T 类型)\\n", n, n)` / `fmt.Printf("平方: %d\\n", n*n)` / `fmt.Printf("半价: %.1f\\n", float64(n)/2)`。',
    ],
    tests: [
      { name: '样例：7', stdin: '7\n', expected: '原始: n=7 (int 类型)\n平方: 49\n半价: 3.5' },
      { name: '样例：10', stdin: '10\n', expected: '原始: n=10 (int 类型)\n平方: 100\n半价: 5.0' },
      { name: '隐藏：奇数 999', stdin: '999\n', expected: '原始: n=999 (int 类型)\n平方: 998001\n半价: 499.5', hidden: true },
      { name: '隐藏：最小值 1', stdin: '1\n', expected: '原始: n=1 (int 类型)\n平方: 1\n半价: 0.5', hidden: true },
    ],
  },
  {
    id: 'go-basic-4',
    lang: 'go',
    module: 'basic',
    order: 4,
    title: '时间炼金术',
    difficulty: 2,
    xp: 25,
    goals: [
      '熟练使用算术运算符与整除 / 取余',
      '理解整数除法的截断行为',
      '拆解组合：把总秒数换算为时分秒',
    ],
    brief: `## 运算符与整除的陷阱

Go 的算术运算符：\`+ - * / %\`。对**整数**使用 \`/\` 是整除（向零截断），\`%\` 是取余：

\`\`\`go
fmt.Println(17 / 5)  // 3（不是 3.4！）
fmt.Println(17 % 5)  // 2
fmt.Println(-17 / 5) // -3（向零截断，不是向下取整）
fmt.Println(-17 % 5) // -2（余数符号跟被除数）
\`\`\`

这个特性正好适合**进制换算**类问题：

- 总秒数 \`t\` 里有多少个完整的小时？\`t / 3600\`
- 除去整小时后剩余的秒？\`t % 3600\`
- 再从剩余里拿分钟：\`t % 3600 / 60\`，最后的秒：\`t % 60\`

> ⚠️ 常见坑：想得到浮点结果却写了两个整数相除。\`float64(t)/3600\` 才是小数小时。`,
    task: `## 任务：把秒炼成时分秒

读入一个总秒数（非负整数），换算成「时:分:秒」。

**输入**：一行一个整数 t（0 ≤ t < 86400）

**输出**：一行，格式为 \`<h>时<m>分<s>秒\`，其中 h、m、s 都是整数且不补零

**追加挑战**（同一行末尾，用空格隔开）：再输出 \`(<xx:xx:xx>)\` 的补零时钟格式，时分秒各占两位、不足补零。

### 示例

| 输入 | 输出 |
| --- | --- |
| \`7285\` | \`2时1分25秒 (02:01:25)\` |
| \`59\` | \`0时0分59秒 (00:00:59)\` |
| \`0\` | \`0时0分0秒 (00:00:00)\` |

补零可以用 \`%02d\` 动词。`,
    starter: `package main

import "fmt"

func main() {
	var t int
	fmt.Scan(&t)

	// TODO: 计算时 h、分 m、秒 s
	// 提示：t/3600 → 时；t%3600/60 → 分；t%60 → 秒

	// TODO: 按两种格式打印
}
`,
    solution: `package main

import "fmt"

func main() {
	var t int
	fmt.Scan(&t)
	h := t / 3600
	m := t % 3600 / 60
	s := t % 60
	fmt.Printf("%d时%d分%d秒 (%02d:%02d:%02d)\\n", h, m, s, h, m, s)
}
`,
    hints: [
      '先把小时"剥"出来：`h := t / 3600`。剩下的秒数是 `t % 3600`，再对它除以 60 得分钟，对 60 取余得秒。',
      '一行连写的写法：`m := t % 3600 / 60`、`s := t % 60`（运算优先级：先乘除取余后加减，所以不用额外括号）。',
      '打印格式：`fmt.Printf("%d时%d分%d秒 (%02d:%02d:%02d)\\n", h, m, s, h, m, s)`。%02d 会自动补零到两位。',
    ],
    tests: [
      { name: '样例：7285', stdin: '7285\n', expected: '2时1分25秒 (02:01:25)' },
      { name: '样例：59', stdin: '59\n', expected: '0时0分59秒 (00:00:59)' },
      { name: '样例：0', stdin: '0\n', expected: '0时0分0秒 (00:00:00)' },
      { name: '隐藏：整点', stdin: '7200\n', expected: '2时0分0秒 (02:00:00)', hidden: true },
      { name: '隐藏：23:59:59', stdin: '86399\n', expected: '23时59分59秒 (23:59:59)', hidden: true },
    ],
  },
  {
    id: 'go-basic-5',
    lang: 'go',
    module: 'basic',
    order: 5,
    title: '分岔路口的守卫',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握 if / else if / else 与比较运算符',
      '理解 if 可带初始化语句的特性',
      '综合运用逻辑运算符 && || !',
    ],
    brief: `## 条件分支

Go 的 if 可以带一个初始化语句，变量作用域仅限 if 块内：

\`\`\`go
if n := score / 10; n >= 9 {
    fmt.Println("优秀")
} else if n >= 8 {
    fmt.Println("良好")
} else {
    fmt.Println("继续加油")
}
\`\`\`

逻辑运算符：\`&&\`（与）、\`||\`（或）、\`!\`（非）。**Go 的条件不需要括号**，但大括号必须写。

### 经典问题：闰年

闰年规则（四年一闰，百年不闰，四百年再闰）：

\`\`\`go
isLeap := y%400 == 0 || (y%4 == 0 && y%100 != 0)
\`\`\`

注意短路求值：\`||\` 左边为真就不算右边，\`&&\` 左边为假就不算右边 —— 利用它可以避免不必要的计算甚至除零错误。`,
    task: `## 任务：星星评级官

星空观测站按亮度给星星评级。读入一个整数亮度值 \`b\`（1 ≤ b ≤ 1000），输出评级：

- \`b ≥ 900\`：\`超新星\`
- \`b ≥ 700\`：\`一等星\`
- \`b ≥ 500\`：\`二等星\`
- \`b ≥ 300\`：\`三等星\`
- 其余：\`暗星\`

**特别规则**：若 b 是 42 的倍数，无论其他条件如何，都输出 \`答案之星\`。

**输入**：一行一个整数 b

**输出**：一行评级名称

### 示例

| 输入 | 输出 |
| --- | --- |
| \`950\` | \`超新星\` |
| \`700\` | \`一等星\` |
| \`42\` | \`答案之星\` |
| \`840\` | \`答案之星\`（840 = 42×20，虽然 ≥700 但 42 优先） |

提示：把 42 的倍数判断放在最前面单独处理。`,
    starter: `package main

import "fmt"

func main() {
	var b int
	fmt.Scan(&b)

	// TODO: 按评级规则输出
	// 别忘了 42 的倍数优先！用 b%42 == 0 判断
}
`,
    solution: `package main

import "fmt"

func main() {
	var b int
	fmt.Scan(&b)
	if b%42 == 0 {
		fmt.Println("答案之星")
	} else if b >= 900 {
		fmt.Println("超新星")
	} else if b >= 700 {
		fmt.Println("一等星")
	} else if b >= 500 {
		fmt.Println("二等星")
	} else if b >= 300 {
		fmt.Println("三等星")
	} else {
		fmt.Println("暗星")
	}
}
`,
    hints: [
      '判断 42 的倍数：`b%42 == 0`。这条规则必须放在其它判断**之前**，否则 840 会先命中 ≥700 的分支。',
      'if-else if 链是从上往下短路匹配的：先查 42，再 900、700、500、300，最后 else 兜底"暗星"。',
      '参考结构：`if b%42==0 { ... } else if b>=900 { ... } else if b>=700 { ... } else if b>=500 { ... } else if b>=300 { ... } else { ... }`，每个分支一个 fmt.Println。',
    ],
    tests: [
      { name: '样例：950', stdin: '950\n', expected: '超新星' },
      { name: '样例：700', stdin: '700\n', expected: '一等星' },
      { name: '样例：42', stdin: '42\n', expected: '答案之星' },
      { name: '样例：840', stdin: '840\n', expected: '答案之星' },
      { name: '隐藏：边界 900', stdin: '900\n', expected: '超新星', hidden: true },
      { name: '隐藏：暗星 299', stdin: '299\n', expected: '暗星', hidden: true },
      { name: '隐藏：126（42×3）', stdin: '126\n', expected: '答案之星', hidden: true },
    ],
  },
  {
    id: 'go-basic-6',
    lang: 'go',
    module: 'basic',
    order: 6,
    title: '循环回廊',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握 Go 唯一的循环关键字 for 的三种形态',
      '学会累加器模式与求和',
      '用循环 + 条件筛选（质数判断）',
    ],
    brief: `## Go 只有一种循环：for

但它是三合一的：

\`\`\`go
// 1. 经典三段式
for i := 0; i < 10; i++ { ... }

// 2. while 风格（省略前后段）
for n > 1 { n = n / 2 }

// 3. 无限循环 + break
for {
    if done { break }
}

// 4. range 遍历（后续章节细讲）
for i, v := range slice { ... }
\`\`\`

### 两个常用模式

**累加器**：先声明 \`sum := 0\`，循环里 \`sum += i\`：

\`\`\`go
sum := 0
for i := 1; i <= 100; i++ {
    sum += i
} // 5050
\`\`\`

**标记 + 质数**：判断 n 是否质数 —— 用一个 bool 标记，从 2 试到 √n：

\`\`\`go
isPrime := n >= 2
for d := 2; d*d <= n; d++ {
    if n%d == 0 {
        isPrime = false
        break
    }
}
\`\`\`

\`d*d <= n\` 是比 \`d <= sqrt(n)\` 更地道的写法（避免浮点误差，还不用 import math）。`,
    task: `## 任务：回廊三试

读入一个整数 n（2 ≤ n ≤ 1000），依次完成三件事：

**输出**（共三行）：

1. \`1 到 n 的和: <S>\`
2. \`1 到 n 的偶数和: <E>\`
3. \`n 是质数: <true/false>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`10\` | \`1 到 n 的和: 55\`<br>\`1 到 n 的偶数和: 30\`<br>\`n 是质数: false\` |
| \`7\` | \`1 到 n 的和: 28\`<br>\`1 到 n 的偶数和: 12\`<br>\`n 是质数: true\` |
| \`2\` | \`1 到 n 的和: 3\`<br>\`1 到 n 的偶数和: 2\`<br>\`n 是质数: true\` |

用 \`%t\` 打印 bool 值。`,
    starter: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	// TODO 1: 循环累加 1..n
	// TODO 2: 循环累加偶数（或循环里 if i%2==0）
	// TODO 3: 质数判断（试除到 d*d<=n）
}
`,
    solution: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)

	sum := 0
	even := 0
	for i := 1; i <= n; i++ {
		sum += i
		if i%2 == 0 {
			even += i
		}
	}

	isPrime := n >= 2
	for d := 2; d*d <= n; d++ {
		if n%d == 0 {
			isPrime = false
			break
		}
	}

	fmt.Printf("1 到 n 的和: %d\\n", sum)
	fmt.Printf("1 到 n 的偶数和: %d\\n", even)
	fmt.Printf("n 是质数: %t\\n", isPrime)
}
`,
    hints: [
      '一个循环就能同时完成前两问：循环里 `sum += i`，并判断 `if i%2 == 0 { even += i }`。',
      '质数判断的骨架：`isPrime := n >= 2` 先假设成立，然后 `for d := 2; d*d <= n; d++` 里一旦 `n%d == 0` 就置 false 并 break。注意 n=2 时循环体不会执行，isPrime 保持 true，正确。',
      '%t 打印 bool。完整输出用三个 fmt.Printf，注意中文和冒号后有空格，格式要与示例完全一致。',
    ],
    tests: [
      { name: '样例：10', stdin: '10\n', expected: '1 到 n 的和: 55\n1 到 n 的偶数和: 30\nn 是质数: false' },
      { name: '样例：7', stdin: '7\n', expected: '1 到 n 的和: 28\n1 到 n 的偶数和: 12\nn 是质数: true' },
      { name: '样例：2', stdin: '2\n', expected: '1 到 n 的和: 3\n1 到 n 的偶数和: 2\nn 是质数: true', hidden: true },
      { name: '隐藏：4', stdin: '4\n', expected: '1 到 n 的和: 10\n1 到 n 的偶数和: 6\nn 是质数: false', hidden: true },
      { name: '隐藏：997', stdin: '997\n', expected: '1 到 n 的和: 497503\n1 到 n 的偶数和: 248502\nn 是质数: true', hidden: true },
    ],
  },
  {
    id: 'go-basic-7',
    lang: 'go',
    module: 'basic',
    order: 7,
    title: '函数锻造炉',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握函数声明、参数与返回值',
      '理解 Go 的招牌特性：多返回值',
      '学会命名返回值写法',
    ],
    brief: `## 函数：代码的积木

Go 函数声明格式：\`func 名字(参数) 返回值 { }\`

\`\`\`go
func add(a, b int) int {
    return a + b
}
\`\`\`

同一类型的相邻参数可以合并声明（\`a, b int\`）。

### 招牌特性：多返回值

Go 函数可以一次返回多个值 —— 这是 Go 错误处理 idiomatic 风格的基石（\`value, err := ...\`）：

\`\`\`go
func divmod(a, b int) (int, int) {
    return a / b, a % b
}

q, r := divmod(17, 5) // q=3, r=2
\`\`\`

### 命名返回值

返回值可以起名字，函数末尾裸 \`return\` 即可（文档性更好）：

\`\`\`go
func stats(x, y int) (sum, diff int) {
    sum = x + y
    diff = x - y
    return
}
\`\`\`

> ⚠️ Go 没有默认参数、没有函数重载。保持函数小而专一。`,
    task: `## 任务：锻造三件工具

在 main 外定义**三个函数**（评测会检查你确实使用了函数而不是把逻辑全塞 main 里）：

1. \`func add(a, b int) int\` —— 返回和
2. \`func max3(a, b, c int) int\` —— 返回三者最大值
3. \`func divmod(a, b int) (int, int)\` —— 返回商和余数（用多返回值）

**输入**：一行四个整数 a b c d（b、d 不为 0）

**输出**（四行）：

1. \`a+b = <add(a,b)>\`
2. \`max(a,b,c) = <max3(a,b,c)>\`
3. \`a÷b = 商<q> 余<r>\`
4. \`c÷d = 商<q> 余<r>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`17 5 9 2\` | \`17+5 = 22\`<br>\`max(17,5,9) = 17\`<br>\`17÷5 = 商3 余2\`<br>\`9÷2 = 商4 余1\` |`,
    starter: `package main

import "fmt"

// TODO: 定义 add 函数

// TODO: 定义 max3 函数

// TODO: 定义 divmod 函数（多返回值）

func main() {
	var a, b, c, d int
	fmt.Scan(&a, &b, &c, &d)

	// TODO: 调用三个函数并输出四行结果
}
`,
    solution: `package main

import "fmt"

func add(a, b int) int {
	return a + b
}

func max3(a, b, c int) int {
	m := a
	if b > m {
		m = b
	}
	if c > m {
		m = c
	}
	return m
}

func divmod(a, b int) (int, int) {
	return a / b, a % b
}

func main() {
	var a, b, c, d int
	fmt.Scan(&a, &b, &c, &d)
	fmt.Printf("%d+%d = %d\\n", a, b, add(a, b))
	fmt.Printf("max(%d,%d,%d) = %d\\n", a, b, c, max3(a, b, c))
	q, r := divmod(a, b)
	fmt.Printf("%d÷%d = 商%d 余%d\\n", a, b, q, r)
	q2, r2 := divmod(c, d)
	fmt.Printf("%d÷%d = 商%d 余%d\\n", c, d, q2, r2)
}
`,
    hints: [
      'max3 的常见写法：先 `m := a`，再两个 if 依次比较 b、c。也可以用嵌套调用 `max(max(a,b),c)`（如果再定义一个两数 max）。',
      'divmod 一行即可：`return a / b, a % b`。调用时用两个变量接住：`q, r := divmod(a, b)`。',
      '输出格式注意 ÷ 和空格：`fmt.Printf("%d÷%d = 商%d 余%d\\n", a, b, q, r)`。四行输出按示例排好。',
    ],
    tests: [
      { name: '样例：17 5 9 2', stdin: '17 5 9 2\n', expected: '17+5 = 22\nmax(17,5,9) = 17\n17÷5 = 商3 余2\n9÷2 = 商4 余1' },
      { name: '隐藏：负数参与', stdin: '-7 3 -1 4\n', expected: '-7+3 = -4\nmax(-7,3,-1) = 3\n-7÷3 = 商-2 余-1\n-1÷4 = 商0 余-1', hidden: true },
      { name: '隐藏：全等值', stdin: '6 6 6 6\n', expected: '6+6 = 12\nmax(6,6,6) = 6\n6÷6 = 商1 余0\n6÷6 = 商1 余0', hidden: true },
    ],
  },
  {
    id: 'go-basic-8',
    lang: 'go',
    module: 'basic',
    order: 8,
    title: '字符串解码者',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解 string 是 UTF-8 字节序列',
      '区分 len()（字节数）与 utf8.RuneCountInString()（字符数）',
      '掌握 for range 遍历字符串得到的正是 rune',
    ],
    brief: `## 字符串的真相：字节 vs 字符

Go 的 string 是**不可变的 UTF-8 字节序列**。这对中文至关重要：

\`\`\`go
s := "你好Go"
fmt.Println(len(s))                    // 8 ！（"你""好"各 3 字节，Go 2 字节）
fmt.Println(utf8.RuneCountInString(s)) // 4（4 个字符）
\`\`\`

一个汉字在 UTF-8 里通常占 3 个字节。\`len\` 数的是**字节**，\`utf8.RuneCountInString\` 数的才是**字符**（rune）。

### for range 天生懂 rune

\`for range\` 字符串时，迭代变量拿到的是**字符（rune）**和它的字节下标：

\`\`\`go
for i, r := range "你好" {
    fmt.Printf("%d:%c ", i, r) // 0:你 3:好 （注意 i 是字节位置）
}
\`\`\`

### 常用技巧

- 按 rune 反转：转成 \`[]rune\` 再首尾交换：\`rs := []rune(s)\`，\`rs[i], rs[j] = rs[j], rs[i]\`
- %c 打印 rune 对应的字符，%b 打印二进制`,
    task: `## 任务：解码报告

读入一个字符串 s（可能包含中文、字母、数字，长度 1~100 字节），输出侦探报告（共三行）：

1. \`字节: <len(s)>\`
2. \`字符: <utf8.RuneCountInString(s)>\`
3. \`反转: <按字符反转后的 s>\`

**输入**：一行一个字符串（不含空格）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`你好Go\` | \`字节: 8\`<br>\`字符: 4\`<br>\`反转: oG好你\` |
| \`abc123\` | \`字节: 6\`<br>\`字符: 6\`<br>\`反转: 321cba\` |

需要 import \`unicode/utf8\`。`,
    starter: `package main

import (
	"fmt"
	"unicode/utf8"
)

func main() {
	var s string
	fmt.Scan(&s)

	// TODO 1: 打印字节数与字符数
	// TODO 2: 按 rune 反转字符串
}
`,
    solution: `package main

import (
	"fmt"
	"unicode/utf8"
)

func main() {
	var s string
	fmt.Scan(&s)
	fmt.Printf("字节: %d\\n", len(s))
	fmt.Printf("字符: %d\\n", utf8.RuneCountInString(s))

	rs := []rune(s)
	for i, j := 0, len(rs)-1; i < j; i, j = i+1, j-1 {
		rs[i], rs[j] = rs[j], rs[i]
	}
	fmt.Printf("反转: %s\\n", string(rs))
}
`,
    hints: [
      '字节数是 `len(s)`，字符数是 `utf8.RuneCountInString(s)`。两者对纯 ASCII 相同，对含中文的字符串不同。',
      '反转三步：`rs := []rune(s)` 转成 rune 切片 → 双指针交换 `rs[i], rs[j] = rs[j], rs[i]`（i 从 0、j 从 len-1 向中间走）→ `string(rs)` 转回字符串打印。',
      '双指针循环写法：`for i, j := 0, len(rs)-1; i < j; i, j = i+1, j-1 { ... }`。别忘了最后用 %s 打印 string(rs)。',
    ],
    tests: [
      { name: '样例：你好Go', stdin: '你好Go\n', expected: '字节: 8\n字符: 4\n反转: oG好你' },
      { name: '样例：abc123', stdin: 'abc123\n', expected: '字节: 6\n字符: 6\n反转: 321cba' },
      { name: '隐藏：纯中文', stdin: '智码世界\n', expected: '字节: 12\n字符: 4\n反转: 界世码智', hidden: true },
      { name: '隐藏：单字符', stdin: 'x\n', expected: '字节: 1\n字符: 1\n反转: x', hidden: true },
      { name: '隐藏：混合', stdin: 'Go1学2习\n', expected: '字节: 10\n字符: 6\n反转: 习2学1oG', hidden: true },
    ],
  },
];
