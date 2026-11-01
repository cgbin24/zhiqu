import type { Level } from '@/types';

/** Go · 第五章：行业最佳实践（5 关） */
export const GO_BEST: Level[] = [
  {
    id: 'go-best-1',
    lang: 'go',
    module: 'best',
    order: 1,
    title: '错误处理军规',
    difficulty: 2,
    xp: 20,
    goals: [
      '绝不忽略 err：检查、处理或上抛',
      '上抛时用 fmt.Errorf 带上案发上下文',
      '保持"无错主干"清爽的代码结构',
    ],
    brief: `## 错误处理军规

Go 的错误处理哲学：**错误要当场处理或带着上下文上抛，绝不吞掉**。

军规一：不忽略 err

\`\`\`go
v, err := ratio(17, 0)
if err != nil {
    fmt.Println("出错:", err) // 处理！
    return
}
\`\`\`

军规二：上抛时带上下文

\`\`\`go
if b == 0 {
    return 0, fmt.Errorf("计算 %d/%d 失败: 分母为 0", a, b)
}
\`\`\`

只返回"分母为 0"，调用方不知道是谁算的；把 a、b 一起写进错误消息，日志一眼定位。更上层的包装用 fmt.Errorf 的 %w 动词（tips 章讲过）。

军规三：\`if err != nil\` 后紧跟处理，成功路径保持在主干上，缩进浅、阅读顺畅。

> ⚠️ 反面教材：\`v, _ := doX()\` 用 _ 丢弃 err —— 出问题时连尸体都找不到。`,
    task: `## 任务：安全的除法服务

实现 \`ratio(a, b int) (float64, error)\`：

- \`b == 0\` → 返回 0 和带上下文的错误：\`计算 <a>/<b> 失败: 分母为 0\`
- 否则返回 \`float64(a)/float64(b)\` 和 nil

主流程遵守军规：err 非 nil 立即输出并返回，成功才继续。

**输入**：一行两个整数 a b

**输出**：

- 成功：\`<a>/<b> = <结果, 保留 2 位小数>\`
- 失败：\`出错: 计算 <a>/<b> 失败: 分母为 0\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`17 5\` | \`17/5 = 3.40\` |
| \`10 4\` | \`10/4 = 2.50\` |
| \`7 0\` | \`出错: 计算 7/0 失败: 分母为 0\` |`,
    starter: `package main

import "fmt"

// TODO 1: 实现 ratio(a, b int) (float64, error)
//   b == 0 → 返回 0 和带上下文的错误："计算 <a>/<b> 失败: 分母为 0"

func main() {
	var a, b int
	fmt.Scan(&a, &b)

	// TODO 2: 调用 ratio，err != nil 时打印"出错: <err>"并 return
	// TODO 3: 成功时打印"<a>/<b> = <%.2f>"
}
`,
    solution: `package main

import "fmt"

// ratio 返回 a/b，出错时带着上下文包装后返回
func ratio(a, b int) (float64, error) {
	if b == 0 {
		return 0, fmt.Errorf("计算 %d/%d 失败: 分母为 0", a, b)
	}
	return float64(a) / float64(b), nil
}

func main() {
	var a, b int
	fmt.Scan(&a, &b)

	v, err := ratio(a, b)
	if err != nil {
		// 军规一：绝不忽略 err，立刻处理
		fmt.Printf("出错: %v\\n", err)
		return
	}
	// 成功路径保持在主干上
	fmt.Printf("%d/%d = %.2f\\n", a, b, v)
}
`,
    hints: [
      '错误消息要带上下文：`fmt.Errorf("计算 %d/%d 失败: 分母为 0", a, b)`，把 a 和 b 都写进去，调用方一眼看到是谁出的错。',
      'main 的骨架：`v, err := ratio(a, b)` → `if err != nil { fmt.Printf("出错: %v\\n", err); return }` → 成功才打印。%v 打印 error 会自动调用它的 Error() 方法。',
      '成功行注意整除陷阱：`float64(a)/float64(b)` 才是小数除法，用 `fmt.Printf("%d/%d = %.2f\\n", a, b, v)` 输出（17/5 = 3.40）。',
    ],
    tests: [
      {
        name: '样例：17 5',
        stdin: '17 5\n',
        expected: '17/5 = 3.40',
      },
      {
        name: '样例：10 4',
        stdin: '10 4\n',
        expected: '10/4 = 2.50',
      },
      {
        name: '隐藏：除零',
        stdin: '7 0\n',
        expected: '出错: 计算 7/0 失败: 分母为 0',
        hidden: true,
      },
      {
        name: '隐藏：零分子',
        stdin: '0 3\n',
        expected: '0/3 = 0.00',
        hidden: true,
      },
      {
        name: '隐藏：负数',
        stdin: '-7 2\n',
        expected: '-7/2 = -3.50',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-best-2',
    lang: 'go',
    module: 'best',
    order: 2,
    title: '命名的艺术',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握 MixedCaps 驼峰与缩写规范',
      '记住 Getter 不加 Get 前缀的惯例',
      '用 NewXxx 构造函数与小写字段封装状态',
    ],
    brief: `## Go 命名规范

- **MixedCaps 驼峰**：\`goBufferSize\` 而不是 \`go_buffer_size\`，Go 不用下划线。
- **缩写保持统一大小写**：URL 写成 \`url\` 或 \`URL\`，不写 \`Url\`。
- **作用域越短，名字越短**：循环里 i、j 随便用；包级导出标识符要完整达意。
- **Getter 不加 Get 前缀**：

\`\`\`go
type Counter struct{ count int } // 小写字段 = 包内私有

func (c *Counter) Count() int { return c.count } // ✅
func (c *Counter) GetCount() int { ... }         // ❌ 不地道
\`\`\`

- **构造函数用 NewXxx**：\`NewCounter(10)\` 返回 \`*Counter\`，一眼知道造什么。
- 未导出标识符（首字母小写）只在本包可见 —— 对外暴露最小集合，状态只能通过方法读写。

> ⚠️ 命名是给三个月后的自己看的：能一行注释说清的，不如一个好名字。`,
    task: `## 任务：给计数器起好名字

按规范实现：

1. \`Counter\` 结构体：**小写**字段 \`count int\`（包内私有）
2. Getter 方法 \`Count() int\`（**不要**写成 GetCount）
3. \`Add(x int)\` 方法
4. 构造函数 \`NewCounter(initial int) *Counter\`

然后读入数据做统计：m 是计数器初始值，接着 n 和 n 个整数。把整数总和 Add 进计数器，输出报告。

**输入**：一行：m n，随后 n 个整数（1 ≤ n ≤ 100）

**输出**（四行）：

1. \`元素个数: <n>\`
2. \`元素总和: <sum>\`
3. \`计数器最终值: <m+sum>\`（通过 c.Count() 读取）
4. \`平均值: <sum/n, 保留 2 位小数>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`10 3 5 15 40\` | \`元素个数: 3\`<br>\`元素总和: 60\`<br>\`计数器最终值: 70\`<br>\`平均值: 20.00\` |`,
    starter: `package main

import "fmt"

// TODO 1: 定义 Counter struct{ count int }（字段小写 = 包内私有）
// TODO 2: Getter 叫什么？记住 Go 惯例：不要 Get 前缀 → (c *Counter) Count() int
// TODO 3: 实现 Add(x int) 与构造函数 NewCounter(initial int) *Counter

func main() {
	var m, n int
	fmt.Scan(&m, &n)

	total := 0
	// TODO 4: 循环读入 n 个整数累加到 total

	// TODO 5: 创建计数器（初值 m），Add(total) 后用 getter 打印四行报告
	fmt.Println(total)
}
`,
    solution: `package main

import "fmt"

// Counter 的字段小写（包内私有），对外只暴露方法
type Counter struct {
	count int
}

// Go 惯例：Getter 不加 Get 前缀，直接叫 Count()
func (c *Counter) Count() int { return c.count }

func (c *Counter) Add(x int) { c.count += x }

// NewCounter 构造函数，返回 *Counter
func NewCounter(initial int) *Counter {
	return &Counter{count: initial}
}

func main() {
	var m, n int
	fmt.Scan(&m, &n)

	total := 0
	for i := 0; i < n; i++ {
		var x int
		fmt.Scan(&x)
		total += x
	}

	c := NewCounter(m)
	c.Add(total)

	fmt.Printf("元素个数: %d\\n", n)
	fmt.Printf("元素总和: %d\\n", total)
	fmt.Printf("计数器最终值: %d\\n", c.Count())
	fmt.Printf("平均值: %.2f\\n", float64(total)/float64(n))
}
`,
    hints: [
      '结构体字段小写、方法首字母大写：`type Counter struct { count int }`、`func (c *Counter) Count() int { return c.count }`。Getter 千万别叫 GetCount。',
      '构造函数返回指针：`func NewCounter(initial int) *Counter { return &Counter{count: initial} }`。Add 直接改字段：`func (c *Counter) Add(x int) { c.count += x }`。',
      '平均值记得先转浮点：`float64(total)/float64(n)`，用 %.2f 输出。计数器最终值 = m + total，必须通过 `c.Count()` 读取。',
    ],
    tests: [
      {
        name: '样例：10 3 5 15 40',
        stdin: '10 3 5 15 40\n',
        expected: '元素个数: 3\n元素总和: 60\n计数器最终值: 70\n平均值: 20.00',
      },
      {
        name: '样例：初值 0',
        stdin: '0 4 1 2 3 4\n',
        expected: '元素个数: 4\n元素总和: 10\n计数器最终值: 10\n平均值: 2.50',
      },
      {
        name: '隐藏：单个元素',
        stdin: '100 1 5\n',
        expected: '元素个数: 1\n元素总和: 5\n计数器最终值: 105\n平均值: 5.00',
        hidden: true,
      },
      {
        name: '隐藏：总和为零',
        stdin: '7 2 -3 3\n',
        expected: '元素个数: 2\n元素总和: 0\n计数器最终值: 7\n平均值: 0.00',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-best-3',
    lang: 'go',
    module: 'best',
    order: 3,
    title: '表驱动测试思想',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解"用例表格 + 循环验证"的测试模式',
      '每个用例输出通过/失败与期望值',
      '汇总统计通过与失败的数量',
    ],
    brief: `## 表驱动测试思想

Go 官方测试最流行的模式：把用例排成表格，循环逐个验证：

\`\`\`go
cases := []struct{ a, b, want int }{
    {3, 4, 12},
    {5, 0, 0},
    {2, -3, -6},
}
for i, c := range cases {
    if got := mulByAdd(c.a, c.b); got != c.want {
        fmt.Printf("用例 %d 失败: 期望 %d\\n", i+1, c.want)
    }
}
\`\`\`

好处：

- **加用例只需加一行数据**，不用复制粘贴测试代码；
- 失败信息自带编号与期望值，定位极快；
- 期望值与实际值并排对比，一眼看出差多少。

本题把"测试表格"从输入读入：每行是一个用例，程序像测试框架一样输出每个用例的判定，最后汇总。

> 💡 真实项目用 \`go test\` + \`xxx_test.go\` 文件运行表驱动测试（t.Run 子测试），思路完全一致。`,
    task: `## 任务：迷你测试框架

实现被测函数 \`mulByAdd(a, b int) int\` —— 用循环加法模拟乘法（\`b <= 0\` 时返回 0，故意留个缺陷）。然后把输入当作测试表格逐个验证：

- 用例通过：\`用例 <i>: <a>*<b> = <got> [通过]\`
- 用例失败：\`用例 <i>: <a>*<b> = <got> [失败, 期望 <want>]\`
- 汇总：\`结果: 通过 <p>, 失败 <f>\`

其中 want = a*b（真实乘法）。

**输入**：第一行 n（1 ≤ n ≤ 10）；随后 n 行，每行两个整数 a b

**输出**：n 行判定 + 1 行汇总

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`3 4\`<br>\`5 0\`<br>\`2 -3\` | \`用例 1: 3*4 = 12 [通过]\`<br>\`用例 2: 5*0 = 0 [通过]\`<br>\`用例 3: 2*-3 = 0 [失败, 期望 -6]\`<br>\`结果: 通过 2, 失败 1\` |`,
    starter: `package main

import "fmt"

// TODO 1: 实现 mulByAdd(a, b int) int：用循环加法模拟乘法（b <= 0 时返回 0）

func main() {
	var n int
	fmt.Scan(&n)

	pass, fail := 0, 0
	// TODO 2: 循环 n 次，每次读入一对 a b
	// TODO 3: want := a * b；got := mulByAdd(a, b)
	// TODO 4: 相等 → pass++ 并打印"用例 i: a*b = got [通过]"
	//         否则 → fail++ 并打印"用例 i: a*b = got [失败, 期望 want]"
	fmt.Printf("结果: 通过 %d, 失败 %d\\n", pass, fail)
}
`,
    solution: `package main

import "fmt"

// mulByAdd 朴素实现：重复加法模拟乘法（b <= 0 时返回 0，故意留缺陷）
func mulByAdd(a, b int) int {
	result := 0
	for i := 0; i < b; i++ {
		result += a
	}
	return result
}

func main() {
	var n int
	fmt.Scan(&n)

	pass, fail := 0, 0
	for i := 1; i <= n; i++ {
		var a, b int
		fmt.Scan(&a, &b)
		want := a * b
		got := mulByAdd(a, b)
		if got == want {
			pass++
			fmt.Printf("用例 %d: %d*%d = %d [通过]\\n", i, a, b, got)
		} else {
			fail++
			fmt.Printf("用例 %d: %d*%d = %d [失败, 期望 %d]\\n", i, a, b, got, want)
		}
	}
	fmt.Printf("结果: 通过 %d, 失败 %d\\n", pass, fail)
}
`,
    hints: [
      '被测函数用循环加法：`result := 0; for i := 0; i < b; i++ { result += a }; return result`。注意 b 为负时循环不执行，返回 0 —— 与真实乘法 a*b 不符，这正是要暴露的缺陷。',
      '每个用例先算期望：`want := a * b`，再拿 `got := mulByAdd(a, b)` 对比。打印格式：`fmt.Printf("用例 %d: %d*%d = %d [通过]\\n", i, a, b, got)`，失败时追加"期望 %d"。',
      '统计 pass/fail 并在最后汇总：`fmt.Printf("结果: 通过 %d, 失败 %d\\n", pass, fail)`。输入是 -6 这样的负数时 %d 直接输出 -6，如 2*-3。',
    ],
    tests: [
      {
        name: '样例：3 个用例',
        stdin: '3\n3 4\n5 0\n2 -3\n',
        expected: '用例 1: 3*4 = 12 [通过]\n用例 2: 5*0 = 0 [通过]\n用例 3: 2*-3 = 0 [失败, 期望 -6]\n结果: 通过 2, 失败 1',
      },
      {
        name: '样例：全通过',
        stdin: '2\n6 7\n1 1\n',
        expected: '用例 1: 6*7 = 42 [通过]\n用例 2: 1*1 = 1 [通过]\n结果: 通过 2, 失败 0',
      },
      {
        name: '隐藏：混合 4 例',
        stdin: '4\n0 -5\n-2 -3\n10 3\n2 2\n',
        expected: '用例 1: 0*-5 = 0 [通过]\n用例 2: -2*-3 = 0 [失败, 期望 6]\n用例 3: 10*3 = 30 [通过]\n用例 4: 2*2 = 4 [通过]\n结果: 通过 3, 失败 1',
        hidden: true,
      },
      {
        name: '隐藏：单用例',
        stdin: '1\n9 9\n',
        expected: '用例 1: 9*9 = 81 [通过]\n结果: 通过 1, 失败 0',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-best-4',
    lang: 'go',
    module: 'best',
    order: 4,
    title: '小接口原则',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解"接口越大，抽象越弱"',
      '函数参数接受接口、依赖最小行为集合',
      '用 %T 观察接口里装的具体类型',
    ],
    brief: `## 小接口原则

Go 谚语：**The bigger the interface, the weaker the abstraction**（接口越大，抽象越弱）。

- 接口应该小而精：\`io.Reader\` 只有 Read 一个方法，却让文件、网络、压缩流都能互换。
- **接受接口**：函数参数声明为接口，只依赖自己真正需要的行为，调用方塞什么都能跑。
- **返回结构体**：返回具体类型，调用方拿到完整信息，未来想加方法也不破坏兼容（工厂场景返回接口是例外）。

\`\`\`go
type Herald interface { Announce() string } // 小接口：一个方法

type Dog struct{ Name string }
func (d Dog) Announce() string { return "汪汪" }

func greet(h Herald) { // 接受接口
    fmt.Println(h.Announce())
}
\`\`\`

标准库的 io.Reader/Writer、sort.Interface 都是 1~3 个方法的小接口。想看接口变量里装的到底是什么，用 \`%T\` 一探便知。

> ⚠️ 别上来就定义大而全的接口 —— 先写具体类型，等出现第二个实现、真正需要抽象时再提炼接口。`,
    task: `## 任务：会自我介绍的动物们

定义小接口 \`Herald\`（只有 \`Announce() string\` 一个方法），实现：

- \`Dog\`：\`Announce()\` 返回 \`汪汪, 我是 <Name>\`
- \`Robot\`：\`Announce()\` 返回 \`哔哔, 我是 <Name>\`
- 工厂函数 \`NewHerald(kind, name string) Herald\`：kind 为 \`dog\` 返回 \`Dog{Name: name}\`，其余返回 \`Robot{Name: name}\`
- \`greet(h Herald)\`：打印 \`接口调用: <h.Announce()>\`

**输入**：一行：kind 名字

**输出**（两行）：

1. \`工厂返回类型: <%T>\`
2. \`greet(h)\` 的输出

### 示例

| 输入 | 输出 |
| --- | --- |
| \`dog 旺财\` | \`工厂返回类型: main.Dog\`<br>\`接口调用: 汪汪, 我是 旺财\` |
| \`robot 小智\` | \`工厂返回类型: main.Robot\`<br>\`接口调用: 哔哔, 我是 小智\` |`,
    starter: `package main

import "fmt"

// TODO 1: 定义小接口 type Herald interface { Announce() string }
// TODO 2: 定义 Dog / Robot 两个结构体，各自实现 Announce()
// TODO 3: 工厂函数 NewHerald(kind, name string) Herald：dog → Dog，其他 → Robot

func main() {
	var kind, name string
	fmt.Scan(&kind, &name)

	// TODO 4: 调用工厂，用 %T 打印返回类型；greet(h) 打印接口调用结果
	fmt.Println(kind, name)
}
`,
    solution: `package main

import "fmt"

// 小接口：只描述"会自我介绍"这一件事
type Herald interface {
	Announce() string
}

type Dog struct{ Name string }

func (d Dog) Announce() string { return fmt.Sprintf("汪汪, 我是 %s", d.Name) }

type Robot struct{ Name string }

func (r Robot) Announce() string { return fmt.Sprintf("哔哔, 我是 %s", r.Name) }

// 工厂函数：kind 描述需求，返回具体结构体
func NewHerald(kind, name string) Herald {
	switch kind {
	case "dog":
		return Dog{Name: name}
	default:
		return Robot{Name: name}
	}
}

// 接受接口：只依赖最小的行为集合
func greet(h Herald) {
	fmt.Printf("接口调用: %s\\n", h.Announce())
}

func main() {
	var kind, name string
	fmt.Scan(&kind, &name)

	h := NewHerald(kind, name)
	fmt.Printf("工厂返回类型: %T\\n", h)
	greet(h)
}
`,
    hints: [
      '小接口只写一个方法：`type Herald interface { Announce() string }`。Dog 和 Robot 都实现 Announce，自动满足接口，无需任何声明。',
      '工厂用 switch：`case "dog": return Dog{Name: name}` / `default: return Robot{Name: name}`。注意返回的是结构体值不是指针，%T 会显示 main.Dog、main.Robot。',
      'greet 只依赖接口：`func greet(h Herald) { fmt.Printf("接口调用: %s\\n", h.Announce()) }`。两行输出分别是"工厂返回类型: "（%T）和 greet 的结果。',
    ],
    tests: [
      {
        name: '样例：dog 旺财',
        stdin: 'dog 旺财\n',
        expected: '工厂返回类型: main.Dog\n接口调用: 汪汪, 我是 旺财',
      },
      {
        name: '样例：robot 小智',
        stdin: 'robot 小智\n',
        expected: '工厂返回类型: main.Robot\n接口调用: 哔哔, 我是 小智',
      },
      {
        name: '隐藏：dog 英文名',
        stdin: 'dog REX\n',
        expected: '工厂返回类型: main.Dog\n接口调用: 汪汪, 我是 REX',
        hidden: true,
      },
      {
        name: '隐藏：未知类型走默认',
        stdin: 'cat 咪咪\n',
        expected: '工厂返回类型: main.Robot\n接口调用: 哔哔, 我是 咪咪',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-best-5',
    lang: 'go',
    module: 'best',
    order: 5,
    title: '包的组织学',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解 cmd / internal/service / internal/storage 分层',
      '体会"依赖单向向下、每层职责单一"',
      '在单文件内用逻辑分区模拟分层结构',
    ],
    brief: `## 包组织：Go 项目的分层

真实的 Go 工程按目录划分包：

\`\`\`
cmd/app/            main 包：只做组装与输入输出
internal/service/   业务逻辑层
internal/storage/   存储细节层
\`\`\`

依赖方向**单向向下**：cmd → service → storage。上层不知道下层的实现细节（storage 用 map 还是数据库，service 不关心）；每层只通过函数/方法边界交流。

本关在**单文件内模拟**这套分层：用注释划分 storage / service / main 三个"逻辑分区"，各自定义自己的类型与方法，感受职责分离 —— 存储层负责保存与罗列，服务层负责业务规则（如拒绝空名字），main 只管读输入、调服务、打输出。

> 💡 规则速记：包名小写单个词；internal 目录只许项目内引用；跨层传值用参数，别全局变量满天飞。`,
    task: `## 任务：用户注册流水线

在单文件里划分三个逻辑分区并实现：

- **storage 层**：\`userStore\`（内含 \`map[string]bool\`），\`save(name)\` 保存并打印 \`[storage] 保存: <name>\`；\`all()\` 返回排序后的所有名字
- **service 层**：\`userService\`，\`register(name)\` 校验非空后调用 storage 并打印 \`[service] 注册成功: <name>\`（空名字打印 \`[service] 拒绝空名字\`）
- **main 层**：读输入、调服务、打输出

**输入**：第一行 n（1 ≤ n ≤ 20）；第二行 n 个用户名（不含空格）

**输出**：每个名字两行（storage、service 各一行），最后两行：

- \`[service] 用户列表: <排序后, 逗号空格分隔>\`
- \`[storage] 总数: <m>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`carol alice bob\` | \`[storage] 保存: carol\`<br>\`[service] 注册成功: carol\`<br>\`[storage] 保存: alice\`<br>\`[service] 注册成功: alice\`<br>\`[storage] 保存: bob\`<br>\`[service] 注册成功: bob\`<br>\`[service] 用户列表: alice, bob, carol\`<br>\`[storage] 总数: 3\` |`,
    starter: `package main

import "fmt"

// TODO 1: storage 层：userStore 结构体（map[string]bool）
//   save(name) 保存并打印"[storage] 保存: <name>"；all() 返回排序后的列表

// TODO 2: service 层：userService，register(name) 校验非空后调 storage

// TODO 3: main 层：读输入、调服务、打输出

func main() {
	var n int
	fmt.Scan(&n)

	// TODO 4: 对每个名字输出两行：storage 保存 + service 注册成功
	// TODO 5: 最后输出排序后的用户列表与总数
	fmt.Println(n)
}
`,
    solution: `package main

import (
	"fmt"
	"sort"
	"strings"
)

// ---------- storage 层（模拟 internal/storage 包）----------
// 只负责存储细节，不关心业务规则

type userStore struct {
	users map[string]bool
}

func newStore() *userStore {
	return &userStore{users: make(map[string]bool)}
}

func (s *userStore) save(name string) {
	s.users[name] = true
	fmt.Printf("[storage] 保存: %s\\n", name)
}

func (s *userStore) all() []string {
	names := make([]string, 0, len(s.users))
	for name := range s.users {
		names = append(names, name)
	}
	sort.Strings(names)
	return names
}

// ---------- service 层（模拟 internal/service 包）----------
// 业务规则：名字非空才能注册

type userService struct {
	store *userStore
}

func (sv *userService) register(name string) {
	if name == "" {
		fmt.Println("[service] 拒绝空名字")
		return
	}
	sv.store.save(name)
	fmt.Printf("[service] 注册成功: %s\\n", name)
}

func (sv *userService) list() []string {
	return sv.store.all()
}

// ---------- main 层（模拟 cmd/app 包）----------
// 只做输入输出与组装

func main() {
	var n int
	fmt.Scan(&n)

	sv := &userService{store: newStore()}
	for i := 0; i < n; i++ {
		var name string
		fmt.Scan(&name)
		sv.register(name)
	}

	names := sv.list()
	fmt.Printf("[service] 用户列表: %s\\n", strings.Join(names, ", "))
	fmt.Printf("[storage] 总数: %d\\n", len(names))
}
`,
    hints: [
      'storage 层两个方法：save 写 map 并打印 `[storage] 保存: %s`；all() 把 map 的 key 收进切片、sort.Strings 排序后返回（记得补 import "sort"）。',
      'service 层只依赖 storage 的方法：register 先判空（本题输入不含空名字，但规则要写），再调 store.save 并打印 `[service] 注册成功: %s`。',
      '最后的列表行：`fmt.Printf("[service] 用户列表: %s\\n", strings.Join(names, ", "))`，分隔符是逗号+空格；总数行用 len(names)。',
    ],
    tests: [
      {
        name: '样例：3 个用户',
        stdin: '3\ncarol alice bob\n',
        expected: '[storage] 保存: carol\n[service] 注册成功: carol\n[storage] 保存: alice\n[service] 注册成功: alice\n[storage] 保存: bob\n[service] 注册成功: bob\n[service] 用户列表: alice, bob, carol\n[storage] 总数: 3',
      },
      {
        name: '样例：2 个用户',
        stdin: '2\nzoe amy\n',
        expected: '[storage] 保存: zoe\n[service] 注册成功: zoe\n[storage] 保存: amy\n[service] 注册成功: amy\n[service] 用户列表: amy, zoe\n[storage] 总数: 2',
      },
      {
        name: '隐藏：1 个用户',
        stdin: '1\nsolo\n',
        expected: '[storage] 保存: solo\n[service] 注册成功: solo\n[service] 用户列表: solo\n[storage] 总数: 1',
        hidden: true,
      },
      {
        name: '隐藏：4 个乱序',
        stdin: '4\nd a c b\n',
        expected: '[storage] 保存: d\n[service] 注册成功: d\n[storage] 保存: a\n[service] 注册成功: a\n[storage] 保存: c\n[service] 注册成功: c\n[storage] 保存: b\n[service] 注册成功: b\n[service] 用户列表: a, b, c, d\n[storage] 总数: 4',
        hidden: true,
      },
    ],
  },
];
