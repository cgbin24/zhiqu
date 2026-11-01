import type { Level } from '@/types';

/** Go · 第二章：核心编程思想（10 关） */
export const GO_PARADIGM: Level[] = [
  {
    id: 'go-paradigm-1',
    lang: 'go',
    module: 'paradigm',
    order: 1,
    title: '结构体与方法：玩家档案',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握 struct 定义与字段访问',
      '理解方法接收者：值接收者 vs 指针接收者',
      '明白值接收者拿到的是副本、改不动原结构体',
    ],
    brief: `## 结构体：把相关数据打包

Go 没有 class，用 **struct** 把相关字段打包成一个新类型：

\`\`\`go
type Player struct {
    Name  string
    Score int
}
p := Player{Name: "Alice", Score: 100}
fmt.Println(p.Name) // 字段访问用点号
\`\`\`

## 方法：带接收者的函数

方法就是在 \`func\` 和函数名之间声明一个**接收者**，让函数"属于"某个类型：

\`\`\`go
// 值接收者：p 是副本
func (p Player) Greet() string { ... }

// 指针接收者：p 是原变量的地址
func (p *Player) AddScore(x int) { p.Score += x }
\`\`\`

两者都能读写数据，但**值接收者拿到的是副本** —— 在方法里改 \`p.Score\`，外面的原结构体纹丝不动；想修改调用者的数据，必须用 \`*Player\` 指针接收者。

调用时 \`p.AddScore(50)\` 即可，Go 会自动取地址（\`&p\`），不用手写。

> ⚠️ 经典坑：用值接收者写 setter，怎么调都不生效。经验法则：需要修改 → 指针接收者；小结构体、只读 → 值接收者也行。`,
    task: `## 任务：玩家档案

定义 \`Player\` 结构体（\`Name string\`、\`Score int\`），并为它实现：

1. 值接收者方法 \`Greet()\` —— 返回 \`玩家 <Name>: 积分 <Score>\`
2. **指针接收者**方法 \`AddScore(x int)\` —— 真正加分
3. 值接收者方法 \`tryAdd(x int)\` —— 试图加分（但改不动，用来见证区别）

**输入**：一行三个值：名字（不含空格）、初始积分、加分数

**输出**（三行）：

1. \`Greet()\` 的结果
2. \`指针接收者加分 <x> 后: 积分 <新积分>\`
3. \`值接收者加分 <x> 后: 积分 <新积分>（没有变化）\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`Alice 100 50\` | \`玩家 Alice: 积分 100\`<br>\`指针接收者加分 50 后: 积分 150\`<br>\`值接收者加分 50 后: 积分 150（没有变化）\` |`,
    starter: `package main

import "fmt"

// TODO 1: 定义 Player 结构体（Name string, Score int）

// TODO 2: 定义值接收者方法 Greet() string
// TODO 3: 定义指针接收者方法 AddScore(x int)
// TODO 4: 定义值接收者方法 tryAdd(x int)（故意改不动，见证区别）

func main() {
	var name string
	var score, bonus int
	fmt.Scan(&name, &score, &bonus)

	// TODO 5: 创建 Player，先 Greet；再分别用两种接收者加分并打印
	// 提示：只有指针接收者能真正改到 p.Score
}
`,
    solution: `package main

import "fmt"

type Player struct {
	Name  string
	Score int
}

// 值接收者：操作副本，不影响原结构体
func (p Player) Greet() string {
	return fmt.Sprintf("玩家 %s: 积分 %d", p.Name, p.Score)
}

// 值接收者：无法修改调用者的字段
func (p Player) tryAdd(x int) {
	p.Score += x
}

// 指针接收者：直接修改原结构体
func (p *Player) AddScore(x int) {
	p.Score += x
}

func main() {
	var name string
	var score, bonus int
	fmt.Scan(&name, &score, &bonus)

	p := Player{Name: name, Score: score}
	fmt.Println(p.Greet())
	p.AddScore(bonus)
	fmt.Printf("指针接收者加分 %d 后: 积分 %d\\n", bonus, p.Score)
	p.tryAdd(bonus)
	fmt.Printf("值接收者加分 %d 后: 积分 %d（没有变化）\\n", bonus, p.Score)
}
`,
    hints: [
      'struct 定义：`type Player struct { Name string; Score int }`。方法的接收者写在 func 和方法名之间：`func (p Player) Greet() string` 是值接收者，`func (p *Player) AddScore(x int)` 是指针接收者。',
      '值接收者的 p 是副本，方法里 `p.Score += x` 只改副本；指针接收者通过地址直接改原结构体。两种方法都能用 `p.AddScore(50)` 的形式调用，Go 自动处理取地址。',
      '完整流程：`p := Player{Name: name, Score: score}` → `fmt.Println(p.Greet())` → `p.AddScore(bonus)` 后打印 → `p.tryAdd(bonus)` 后再打印（积分不变）。',
    ],
    tests: [
      {
        name: '样例：Alice 100 50',
        stdin: 'Alice 100 50\n',
        expected: '玩家 Alice: 积分 100\n指针接收者加分 50 后: 积分 150\n值接收者加分 50 后: 积分 150（没有变化）',
      },
      {
        name: '样例：Bob 7 3',
        stdin: 'Bob 7 3\n',
        expected: '玩家 Bob: 积分 7\n指针接收者加分 3 后: 积分 10\n值接收者加分 3 后: 积分 10（没有变化）',
      },
      {
        name: '隐藏：Gopher42',
        stdin: 'Gopher42 999 1\n',
        expected: '玩家 Gopher42: 积分 999\n指针接收者加分 1 后: 积分 1000\n值接收者加分 1 后: 积分 1000（没有变化）',
        hidden: true,
      },
      {
        name: '隐藏：全零',
        stdin: 'X 0 0\n',
        expected: '玩家 X: 积分 0\n指针接收者加分 0 后: 积分 0\n值接收者加分 0 后: 积分 0（没有变化）',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-paradigm-2',
    lang: 'go',
    module: 'paradigm',
    order: 2,
    title: '接口与多态：形状马戏团',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握 interface 的定义与隐式实现',
      '把不同类型装进同一个切片实现多态调用',
      '用接口统一处理"求面积"这类行为',
    ],
    brief: `## 接口：行为的合同

接口定义一组方法签名。Go 的接口是**隐式实现**的 —— 不需要声明"我实现了某接口"，只要类型拥有接口要求的全部方法，它就自动满足该接口（俗称鸭子类型）：

\`\`\`go
type Shape interface {
    Name() string
    Area() float64
}

type Circle struct{ R float64 }

func (c Circle) Name() string  { return "圆形" }
func (c Circle) Area() float64 { return math.Pi * c.R * c.R }
\`\`\`

## 多态：一个接口，多种形态

把不同类型装进同一个 \`[]Shape\` 切片，调用时自动分发到各自的实现：

\`\`\`go
shapes := []Shape{Circle{R: 2}, Rect{W: 3, H: 4}}
for _, s := range shapes {
    fmt.Printf("%s 面积 = %.2f\\n", s.Name(), s.Area())
}
\`\`\`

同一个 \`s.Area()\`，圆形走圆的公式、矩形走矩形的公式 —— 这就是多态。

接口变量内部保存着（具体类型的值, 方法集），调用方法时自动找到对应实现。

> 💡 空接口 \`any\` 可以装任何值，但也就失去了类型信息；小而具体的接口才是好接口。`,
    task: `## 任务：形状马戏团

定义接口 \`Shape\`（\`Name() string\` 与 \`Area() float64\`），实现 \`Circle\`（半径 r，面积 = π·r²）与 \`Rect\`（宽 w 高 h，面积 = w·h）两个类型，把它们装进 \`[]Shape\` 做多态处理。

**输入**：一行三个浮点数：r w h

**输出**（三行）：

1. \`圆形 面积 = <%.2f>\`
2. \`矩形 面积 = <%.2f>\`
3. \`面积最大: <名> (<%.2f>)\` —— 面积大的赢

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5 3 4\` | \`圆形 面积 = 78.54\`<br>\`矩形 面积 = 12.00\`<br>\`面积最大: 圆形 (78.54)\` |
| \`1 10 1\` | \`圆形 面积 = 3.14\`<br>\`矩形 面积 = 10.00\`<br>\`面积最大: 矩形 (10.00)\` |

π 用 \`math.Pi\`，面积用 \`%.2f\` 保留两位小数。`,
    starter: `package main

import "fmt"

// TODO 1: 定义 Shape 接口（Name() string 与 Area() float64）

// TODO 2: 定义 Circle（半径 r）并实现两个方法
//   面积 = math.Pi * r * r，需要自己补 import "math"

// TODO 3: 定义 Rect（宽 w 高 h）并实现两个方法，面积 = w * h

func main() {
	var r, w, h float64
	fmt.Scan(&r, &w, &h)

	// TODO 4: 把两个形状装进 []Shape，循环打印面积，并记录面积最大的
	// 提示：%.2f 保留两位小数
}
`,
    solution: `package main

import (
	"fmt"
	"math"
)

type Shape interface {
	Name() string
	Area() float64
}

type Circle struct{ R float64 }

func (c Circle) Name() string  { return "圆形" }
func (c Circle) Area() float64 { return math.Pi * c.R * c.R }

type Rect struct{ W, H float64 }

func (r Rect) Name() string  { return "矩形" }
func (r Rect) Area() float64 { return r.W * r.H }

func main() {
	var r, w, h float64
	fmt.Scan(&r, &w, &h)

	shapes := []Shape{Circle{R: r}, Rect{W: w, H: h}}
	best := shapes[0]
	for _, s := range shapes {
		fmt.Printf("%s 面积 = %.2f\\n", s.Name(), s.Area())
		if s.Area() > best.Area() {
			best = s
		}
	}
	fmt.Printf("面积最大: %s (%.2f)\\n", best.Name(), best.Area())
}
`,
    hints: [
      '接口只写方法签名不写实现：`type Shape interface { Name() string; Area() float64 }`。Circle/Rect 只要实现这两个方法就自动满足 Shape，无需任何声明。',
      '多态的关键是把不同类型放进同一个切片：`shapes := []Shape{Circle{R: r}, Rect{W: w, H: h}}`，然后 `for _, s := range shapes` 循环调用 `s.Name()` 和 `s.Area()`。',
      '找最大：先 `best := shapes[0]`，循环里 `if s.Area() > best.Area() { best = s }`。输出格式：`fmt.Printf("%s 面积 = %.2f\\n", s.Name(), s.Area())` 和 `fmt.Printf("面积最大: %s (%.2f)\\n", best.Name(), best.Area())`。',
    ],
    tests: [
      {
        name: '样例：5 3 4',
        stdin: '5 3 4\n',
        expected: '圆形 面积 = 78.54\n矩形 面积 = 12.00\n面积最大: 圆形 (78.54)',
      },
      {
        name: '样例：1 10 1',
        stdin: '1 10 1\n',
        expected: '圆形 面积 = 3.14\n矩形 面积 = 10.00\n面积最大: 矩形 (10.00)',
      },
      {
        name: '隐藏：3 7 2',
        stdin: '3 7 2\n',
        expected: '圆形 面积 = 28.27\n矩形 面积 = 14.00\n面积最大: 圆形 (28.27)',
        hidden: true,
      },
      {
        name: '隐藏：2 2 2',
        stdin: '2 2 2\n',
        expected: '圆形 面积 = 12.57\n矩形 面积 = 4.00\n面积最大: 圆形 (12.57)',
        hidden: true,
      },
      {
        name: '隐藏：5 20 4',
        stdin: '5 20 4\n',
        expected: '圆形 面积 = 78.54\n矩形 面积 = 80.00\n面积最大: 矩形 (80.00)',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-paradigm-3',
    lang: 'go',
    module: 'paradigm',
    order: 3,
    title: '组合优于继承：汽车装配线',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解 Go 没有 extends、用 struct 嵌入实现复用',
      '掌握字段与方法的"提升"（promotion）',
      '体会组合比继承更松耦合的设计思想',
    ],
    brief: `## 组合优于继承

Go 故意砍掉了继承（没有 extends），推崇**组合**：一个 struct 里嵌入另一个 struct，自动获得它的字段和方法。

\`\`\`go
type Engine struct{ Power int }

func (e Engine) Desc() string { return fmt.Sprintf("%d 马力引擎", e.Power) }

type Car struct {
    Brand  string
    Engine // 匿名嵌入：类型名就是字段名
    Seats  int
}

car := Car{Brand: "BMW", Engine: Engine{Power: 200}, Seats: 4}
fmt.Println(car.Power) // 字段"提升"：等价 car.Engine.Power
car.Desc()             // 方法"提升"：像自己的方法一样调用
\`\`\`

嵌入类型的字段与方法会**向上提升**，仿佛外层类型自己拥有它们 —— 但本质仍是 \`car.Engine\` 这个字段在起作用。

这是比继承更松的复用：改 Engine 不需要动 Car 的定义，也没有"祖类"带来的脆弱耦合。

> ⚠️ 嵌入不是继承：没有多态，Car 不是 Engine；若外层定义了同名方法，会"遮住"内层的版本。`,
    task: `## 任务：汽车装配线

定义 \`Engine\` 结构体（\`Power int\`）与方法 \`Desc()\`（返回 \`<Power> 马力引擎\`）；定义 \`Car\` 结构体，**匿名嵌入** \`Engine\`，另有 \`Brand string\` 与 \`Seats int\`。

**输入**：一行三个值：品牌（不含空格） 马力 座位数

**输出**（三行）：

1. \`字段提升: car.Power = <power>\` —— 直接访问提升上来的字段
2. \`方法提升: car.Desc() = <power> 马力引擎\` —— 直接调用提升上来的方法
3. \`<brand>: <seats> 座, 搭载 <power> 马力引擎\` —— Car 自己的 Info() 方法组合三者

### 示例

| 输入 | 输出 |
| --- | --- |
| \`BMW 200 4\` | \`字段提升: car.Power = 200\`<br>\`方法提升: car.Desc() = 200 马力引擎\`<br>\`BMW: 4 座, 搭载 200 马力引擎\` |`,
    starter: `package main

import "fmt"

// TODO 1: 定义 Engine 结构体（Power int）和方法 Desc() string

// TODO 2: 定义 Car 结构体：Brand string、Engine（匿名嵌入）、Seats int
// TODO 3: 给 Car 定义 Info() 方法，组合品牌、座位与引擎描述

func main() {
	var brand string
	var power, seats int
	fmt.Scan(&brand, &power, &seats)

	// TODO 4: 创建 Car，验证字段提升 car.Power 与方法提升 car.Desc()
	// 然后调用 Info() 打印第三行
}
`,
    solution: `package main

import "fmt"

type Engine struct {
	Power int
}

func (e Engine) Desc() string {
	return fmt.Sprintf("%d 马力引擎", e.Power)
}

type Car struct {
	Brand  string
	Engine // 匿名嵌入：组合优于继承
	Seats  int
}

func (c Car) Info() string {
	return fmt.Sprintf("%s: %d 座, 搭载 %s", c.Brand, c.Seats, c.Desc())
}

func main() {
	var brand string
	var power, seats int
	fmt.Scan(&brand, &power, &seats)

	car := Car{Brand: brand, Engine: Engine{Power: power}, Seats: seats}
	fmt.Printf("字段提升: car.Power = %d\\n", car.Power)
	fmt.Printf("方法提升: car.Desc() = %s\\n", car.Desc())
	fmt.Println(car.Info())
}
`,
    hints: [
      '匿名嵌入的写法：结构体里只写类型名，`type Car struct { Brand string; Engine; Seats int }`。初始化时嵌套赋值：`Car{Brand: brand, Engine: Engine{Power: power}, Seats: seats}`。',
      '字段与方法提升是自动的：`car.Power` 等价于 `car.Engine.Power`，`car.Desc()` 等价于 `car.Engine.Desc()`。Car 自己的 Info 方法里也可以直接用 `c.Desc()`。',
      '第三行格式串：`fmt.Sprintf("%s: %d 座, 搭载 %s", c.Brand, c.Seats, c.Desc())`，注意中文冒号、逗号后空格与"搭载"前后的空格。',
    ],
    tests: [
      {
        name: '样例：BMW 200 4',
        stdin: 'BMW 200 4\n',
        expected: '字段提升: car.Power = 200\n方法提升: car.Desc() = 200 马力引擎\nBMW: 4 座, 搭载 200 马力引擎',
      },
      {
        name: '样例：Tesla 500 5',
        stdin: 'Tesla 500 5\n',
        expected: '字段提升: car.Power = 500\n方法提升: car.Desc() = 500 马力引擎\nTesla: 5 座, 搭载 500 马力引擎',
      },
      {
        name: '隐藏：最小值',
        stdin: 'X1 1 1\n',
        expected: '字段提升: car.Power = 1\n方法提升: car.Desc() = 1 马力引擎\nX1: 1 座, 搭载 1 马力引擎',
        hidden: true,
      },
      {
        name: '隐藏：零马力',
        stdin: 'BYD 0 2\n',
        expected: '字段提升: car.Power = 0\n方法提升: car.Desc() = 0 马力引擎\nBYD: 2 座, 搭载 0 马力引擎',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-paradigm-4',
    lang: 'go',
    module: 'paradigm',
    order: 4,
    title: '错误是值：取款守卫',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解 Go 的错误哲学：error 是普通的返回值',
      '掌握 errors.New / fmt.Errorf 与自定义错误类型',
      '学会用 if err != nil 的惯用法处理错误',
    ],
    brief: `## 错误是值

Go 没有 try/catch。函数用最后一个返回值携带错误，调用方**当场检查**：

\`\`\`go
value, err := doSomething()
if err != nil {
    return err // 处理或上抛
}
// 一切正常，继续走
\`\`\`

## 造错误的三种方式

\`\`\`go
errors.New("余额不足")              // 最简单的静态错误
fmt.Errorf("取款 %d 失败", amount)   // 带格式化上下文

type InsufficientError struct{ Need, Have int }

func (e *InsufficientError) Error() string {
    return fmt.Sprintf("需要 %d, 只有 %d", e.Need, e.Have)
} // 自定义错误类型
\`\`\`

任何实现了 \`Error() string\` 方法的类型都是 error —— 所以错误可以携带**结构化数据**（差多少钱等），调用方用类型断言取回细节。

> ⚠️ 最常见的 Go bug：忘记检查 err，或者用 \`_\` 把 err 丢掉。错误要么处理，要么上抛，不要吞。`,
    task: `## 任务：取款守卫

实现取款函数 \`withdraw(balance, amount int) (int, error)\`：

- \`amount <= 0\` → 返回原余额和 \`errors.New("无效金额")\`
- \`amount > balance\` → 返回原余额和自定义错误 \`&InsufficientError{Need: amount, Have: balance}\`，其 \`Error()\` 返回 \`余额不足: 需要 <Need>, 只有 <Have>\`
- 否则扣款成功，返回新余额和 nil

**输入**：一行两个整数：余额 取款金额

**输出**：

- 成功：\`取款成功, 余额 = <新余额>\`
- 失败：\`取款失败: <错误的 Error() 内容>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`100 30\` | \`取款成功, 余额 = 70\` |
| \`100 500\` | \`取款失败: 余额不足: 需要 500, 只有 100\` |
| \`50 0\` | \`取款失败: 无效金额\` |`,
    starter: `package main

import "fmt"

// TODO 1: 补 import "errors"；定义自定义错误类型 InsufficientError{Need, Have int}
// TODO 2: 实现它的 Error() string 方法（实现 error 接口）
//   返回"余额不足: 需要 <Need>, 只有 <Have>"

// TODO 3: 实现 withdraw(balance, amount int) (int, error)
//   amount <= 0 → errors.New("无效金额")
//   amount > balance → &InsufficientError{...}
//   否则 → 扣款成功

func main() {
	var balance, amount int
	fmt.Scan(&balance, &amount)

	// TODO 4: 调用 withdraw，检查 err 并按格式输出
}
`,
    solution: `package main

import (
	"errors"
	"fmt"
)

// 自定义错误类型：错误也是普通的值
type InsufficientError struct {
	Need int
	Have int
}

func (e *InsufficientError) Error() string {
	return fmt.Sprintf("余额不足: 需要 %d, 只有 %d", e.Need, e.Have)
}

func withdraw(balance, amount int) (int, error) {
	if amount <= 0 {
		return balance, errors.New("无效金额")
	}
	if amount > balance {
		return balance, &InsufficientError{Need: amount, Have: balance}
	}
	return balance - amount, nil
}

func main() {
	var balance, amount int
	fmt.Scan(&balance, &amount)

	newBalance, err := withdraw(balance, amount)
	if err != nil {
		fmt.Printf("取款失败: %v\\n", err)
		return
	}
	fmt.Printf("取款成功, 余额 = %d\\n", newBalance)
}
`,
    hints: [
      '自定义错误三步：定义 struct → 实现 `func (e *InsufficientError) Error() string` → 返回 `&InsufficientError{Need: amount, Have: balance}`。指针类型挂上 Error 方法后就实现了 error 接口。',
      'withdraw 的判断顺序：先 `if amount <= 0` 返回 `errors.New("无效金额")`，再 `if amount > balance` 返回自定义错误，最后 `return balance - amount, nil`。',
      'main 的惯用写法：`newBalance, err := withdraw(balance, amount)`，然后 `if err != nil { fmt.Printf("取款失败: %v\\n", err); return }`，成功路径打印 `fmt.Printf("取款成功, 余额 = %d\\n", newBalance)`。%v 会自动调用 Error() 方法。',
    ],
    tests: [
      {
        name: '样例：成功取款',
        stdin: '100 30\n',
        expected: '取款成功, 余额 = 70',
      },
      {
        name: '样例：余额不足',
        stdin: '100 500\n',
        expected: '取款失败: 余额不足: 需要 500, 只有 100',
      },
      {
        name: '隐藏：零金额',
        stdin: '50 0\n',
        expected: '取款失败: 无效金额',
        hidden: true,
      },
      {
        name: '隐藏：零余额',
        stdin: '0 10\n',
        expected: '取款失败: 余额不足: 需要 10, 只有 0',
        hidden: true,
      },
      {
        name: '隐藏：取光',
        stdin: '999 999\n',
        expected: '取款成功, 余额 = 0',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-paradigm-5',
    lang: 'go',
    module: 'paradigm',
    order: 5,
    title: '函数是一等公民：运算指挥家',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握函数类型 type Op func(int, int) int',
      '把函数存进变量、切片、当参数传递',
      '理解高阶函数：接受函数作为参数',
    ],
    brief: `## 函数是一等公民

在 Go 里函数和 int、string 一样：可以存进变量、放进切片、当参数传、当返回值还。

\`\`\`go
type Op func(int, int) int // 定义函数类型

func add(a, b int) int { return a + b }

var f Op = add    // 函数赋值给变量
result := f(1, 2) // 像普通函数一样调用
\`\`\`

## 高阶函数

接受函数为参数、或返回函数的函数：

\`\`\`go
func apply(f Op, a, b int) int {
    return f(a, b) // 把"怎么做"交给调用者
}
apply(add, 1, 2) // 3
\`\`\`

配合匿名函数与闭包，可以写出 \`sort.Slice(s, func(i, j int) bool {...})\` 这种"把策略注入"的灵活代码 —— 标准库里到处都是。

> ⚠️ 函数类型签名必须完全匹配：\`Op\` 与 \`func(int, int) int\` 是同一类型，参数或返回值差一点都不行。`,
    task: `## 任务：运算指挥家

定义函数类型 \`Op func(int, int) int\`，实现 \`add\`、\`sub\`、\`mul\` 三个函数，以及高阶函数 \`apply(f Op, a, b int) int\`。

把三个函数装进切片排队，依次通过 \`apply\` 调用，并报告最大结果来自谁（并列时取最先出现的）。

**输入**：一行两个整数 a b

**输出**（四行）：

1. \`add: <a> + <b> = <a+b>\`
2. \`sub: <a> - <b> = <a-b>\`
3. \`mul: <a> * <b> = <a*b>\`
4. \`最大结果: <值> (来自 <add/sub/mul>)\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5 3\` | \`add: 5 + 3 = 8\`<br>\`sub: 5 - 3 = 2\`<br>\`mul: 5 * 3 = 15\`<br>\`最大结果: 15 (来自 mul)\` |
| \`10 1\` | \`add: 10 + 1 = 11\`<br>\`sub: 10 - 1 = 9\`<br>\`mul: 10 * 1 = 10\`<br>\`最大结果: 11 (来自 add)\` |`,
    starter: `package main

import "fmt"

// TODO 1: 定义函数类型 type Op func(int, int) int
// TODO 2: 定义 add / sub / mul 三个函数
// TODO 3: 定义高阶函数 apply(f Op, a, b int) int

func main() {
	var a, b int
	fmt.Scan(&a, &b)

	// TODO 4: 用匿名结构体切片把三个函数排队
	// 循环调用 apply 打印三行，并记录最大结果来自谁
}
`,
    solution: `package main

import "fmt"

// 函数类型：把"运算"抽象成值
type Op func(int, int) int

func add(a, b int) int { return a + b }
func sub(a, b int) int { return a - b }
func mul(a, b int) int { return a * b }

// 高阶函数：接收函数作为参数
func apply(f Op, a, b int) int {
	return f(a, b)
}

func main() {
	var a, b int
	fmt.Scan(&a, &b)

	ops := []struct {
		name string
		sym  string
		f    Op
	}{
		{"add", "+", add},
		{"sub", "-", sub},
		{"mul", "*", mul},
	}

	best := apply(add, a, b)
	bestName := "add"
	for _, op := range ops {
		r := apply(op.f, a, b)
		fmt.Printf("%s: %d %s %d = %d\\n", op.name, a, op.sym, b, r)
		if r > best {
			best = r
			bestName = op.name
		}
	}
	fmt.Printf("最大结果: %d (来自 %s)\\n", best, bestName)
}
`,
    hints: [
      '函数类型：`type Op func(int, int) int`。之后 `var f Op = add` 或直接传参 `apply(add, a, b)`，函数名本身就是值（不加括号）。',
      '高阶函数：`func apply(f Op, a, b int) int { return f(a, b) }`。用匿名结构体切片排队：`ops := []struct{ name string; sym string; f Op }{{"add", "+", add}, {"sub", "-", sub}, {"mul", "*", mul}}`。',
      '循环里 `r := apply(op.f, a, b)` 打印并比较。注意：比较用严格大于 `r > best`，初值取 add 的结果，这样并列时保留先出现的（如 a=b=0 时最大来自 add）。',
    ],
    tests: [
      {
        name: '样例：5 3',
        stdin: '5 3\n',
        expected: 'add: 5 + 3 = 8\nsub: 5 - 3 = 2\nmul: 5 * 3 = 15\n最大结果: 15 (来自 mul)',
      },
      {
        name: '样例：10 1',
        stdin: '10 1\n',
        expected: 'add: 10 + 1 = 11\nsub: 10 - 1 = 9\nmul: 10 * 1 = 10\n最大结果: 11 (来自 add)',
      },
      {
        name: '隐藏：负数 mul 最小',
        stdin: '2 -3\n',
        expected: 'add: 2 + -3 = -1\nsub: 2 - -3 = 5\nmul: 2 * -3 = -6\n最大结果: 5 (来自 sub)',
        hidden: true,
      },
      {
        name: '隐藏：全零并列',
        stdin: '0 0\n',
        expected: 'add: 0 + 0 = 0\nsub: 0 - 0 = 0\nmul: 0 * 0 = 0\n最大结果: 0 (来自 add)',
        hidden: true,
      },
      {
        name: '隐藏：1 10',
        stdin: '1 10\n',
        expected: 'add: 1 + 10 = 11\nsub: 1 - 10 = -9\nmul: 1 * 10 = 10\n最大结果: 11 (来自 add)',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-paradigm-6',
    lang: 'go',
    module: 'paradigm',
    order: 6,
    title: '闭包：记忆胶囊',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解闭包 = 函数 + 它捕获的外部变量',
      '实现计数器/累加器闭包，体会状态被"关住"',
      '明白每次调用 maker 得到的是独立的新闭包',
    ],
    brief: `## 闭包：函数 + 它记住的环境

闭包 = 函数体 + 它捕获的外部变量。即使外部函数已经返回，被捕获的变量依然活着：

\`\`\`go
func counter() func() int {
    n := 0 // 被"关进"闭包
    return func() int {
        n++ // 每次调用都在上一次基础上 +1
        return n
    }
}

c := counter()
c() // 1
c() // 2
\`\`\`

两个要点：

- **状态藏在函数里**：n 不在全局作用域，外部碰不到，只能通过 \`c()\` 间接操作 —— 这是 Go 实现"私有状态"的惯用手法。
- **每次调用 maker 都得到独立的新闭包**：\`c1 := counter()\` 和 \`c2 := counter()\` 各数各的，互不干扰。

闭包是 Go 实现回调、中间件、惰性求值的基础工具。

> ⚠️ Go 1.22 之前，for 循环变量被所有闭包共享是著名大坑；1.22 起每轮循环都是新变量，坑已填平。`,
    task: `## 任务：记忆胶囊

实现两个闭包工厂：

1. \`accumulator() func(int) int\` —— 返回的闭包把参数累加进内部 sum，返回当前累计值
2. \`counter() func() int\` —— 返回的闭包每次调用计数 +1 并返回

**输入**：第一行一个整数 n；第二行 n 个整数（n 可以为 0）

**输出**：

- 对每个整数 x 一行：\`累加 <x> 后: <当前累计>\`
- 最后一行：\`新计数器: 1 2 3\` —— 调用三次新计数器闭包

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`5 10 2\` | \`累加 5 后: 5\`<br>\`累加 10 后: 15\`<br>\`累加 2 后: 17\`<br>\`新计数器: 1 2 3\` |
| \`1\`<br>\`100\` | \`累加 100 后: 100\`<br>\`新计数器: 1 2 3\` |`,
    starter: `package main

import "fmt"

// TODO 1: 实现 accumulator() func(int) int
//   内部 sum := 0，返回的闭包把 x 加进 sum 并返回当前累计值

// TODO 2: 实现 counter() func() int
//   内部 n := 0，返回的闭包每次 n++ 并返回

func main() {
	var n int
	fmt.Scan(&n)
	// TODO 3: 读入 n 个整数，逐个喂给闭包并打印"累加 x 后: t"
	// TODO 4: 调用新计数器三次，打印"新计数器: 1 2 3"
}
`,
    solution: `package main

import "fmt"

// accumulator 返回一个闭包：它"记住"了自己的 sum
func accumulator() func(int) int {
	sum := 0
	return func(x int) int {
		sum += x
		return sum
	}
}

// counter 返回一个无参闭包计数器
func counter() func() int {
	n := 0
	return func() int {
		n++
		return n
	}
}

func main() {
	var n int
	fmt.Scan(&n)
	acc := accumulator()
	for i := 0; i < n; i++ {
		var x int
		fmt.Scan(&x)
		fmt.Printf("累加 %d 后: %d\\n", x, acc(x))
	}

	c := counter()
	a1 := c()
	a2 := c()
	a3 := c()
	fmt.Printf("新计数器: %d %d %d\\n", a1, a2, a3)
}
`,
    hints: [
      '闭包工厂的骨架：外部函数里声明变量，返回一个引用该变量的匿名函数。`func accumulator() func(int) int { sum := 0; return func(x int) int { sum += x; return sum } }`。',
      'sum 是被闭包捕获的变量：闭包每次执行都会更新同一个 sum（不是副本）。两次调用 accumulator() 会得到两个互不干扰的闭包。',
      '新计数器是**同一个闭包**连续调用三次：`c := counter()`，然后 `a1 := c(); a2 := c(); a3 := c()`（分别得到 1、2、3），再 `fmt.Printf("新计数器: %d %d %d\\n", a1, a2, a3)`。注意 counter() 每次调用会生成新闭包，先存下来再逐次调用最稳。',
    ],
    tests: [
      {
        name: '样例：5 10 2',
        stdin: '3\n5 10 2\n',
        expected: '累加 5 后: 5\n累加 10 后: 15\n累加 2 后: 17\n新计数器: 1 2 3',
      },
      {
        name: '样例：单个 100',
        stdin: '1\n100\n',
        expected: '累加 100 后: 100\n新计数器: 1 2 3',
      },
      {
        name: '隐藏：含负数',
        stdin: '4\n-1 -2 3 0\n',
        expected: '累加 -1 后: -1\n累加 -2 后: -3\n累加 3 后: 0\n累加 0 后: 0\n新计数器: 1 2 3',
        hidden: true,
      },
      {
        name: '隐藏：n 为 0',
        stdin: '0\n',
        expected: '新计数器: 1 2 3',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-paradigm-7',
    lang: 'go',
    module: 'paradigm',
    order: 7,
    title: '泛型基础：万能模具',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握泛型函数语法 [T any]',
      '理解类型参数与自动推断',
      '写出对任意元素类型都适用的函数',
    ],
    brief: `## 泛型：一份代码，多种类型

Go 1.18 之前，写"对任意类型都适用"的函数只能靠 interface{} + 反射，或者复制粘贴。现在用**类型参数**：

\`\`\`go
func Reverse[T any](s []T) []T {
    r := make([]T, len(s))
    for i, v := range s {
        r[len(s)-1-i] = v
    }
    return r
}

Reverse([]int{1, 2, 3})     // [3 2 1]
Reverse([]string{"a", "b"}) // [b a]
\`\`\`

方括号 \`[T any]\` 声明类型参数 T：调用时编译器自动推断（也可显式写 \`Reverse[int](...)\`）。编译期做完整类型检查，**零装箱开销**。

\`any\` 是 \`interface{}\` 的别名 —— 意思是"对 T 没有任何要求"。

> ⚠️ \`any\` 意味着"什么都不能做"：T 类型的值不能比较、不能加减。需要操作能力，就要给 T 加约束 —— 下一关见。`,
    task: `## 任务：万能模具

实现两个泛型函数：

1. \`Reverse[T any](s []T) []T\` —— 返回倒序的新切片（不改原切片）
2. \`Ends[T any](s []T) (first, last T)\` —— 返回首尾元素

**输入**：第一行整数 n（1 ≤ n ≤ 100）；第二行 n 个整数

**输出**（三行）：

1. \`原始: <切片 %v>\`
2. \`反转: <反转后 %v>\`
3. \`首=<first>, 末=<last>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`5 12 8\` | \`原始: [5 12 8]\`<br>\`反转: [8 12 5]\`<br>\`首=5, 末=8\` |
| \`1\`<br>\`42\` | \`原始: [42]\`<br>\`反转: [42]\`<br>\`首=42, 末=42\` |`,
    starter: `package main

import "fmt"

// TODO 1: 实现泛型函数 Reverse[T any](s []T) []T
//   提示：make 一个等长新切片，倒着填，不要修改原切片

// TODO 2: 实现泛型函数 Ends[T any](s []T) (first, last T)

func main() {
	var n int
	fmt.Scan(&n)
	nums := make([]int, n)
	for i := range nums {
		fmt.Scan(&nums[i])
	}

	// TODO 3: 打印原始、反转、首尾三行
	// %v 可以直接打印切片
}
`,
    solution: `package main

import "fmt"

// Reverse 是泛型函数：[T any] 对任意元素类型都适用
func Reverse[T any](s []T) []T {
	r := make([]T, len(s))
	for i, v := range s {
		r[len(s)-1-i] = v
	}
	return r
}

// Ends 返回切片的首尾元素
func Ends[T any](s []T) (first, last T) {
	first, last = s[0], s[len(s)-1]
	return
}

func main() {
	var n int
	fmt.Scan(&n)
	nums := make([]int, n)
	for i := range nums {
		fmt.Scan(&nums[i])
	}

	fmt.Printf("原始: %v\\n", nums)
	fmt.Printf("反转: %v\\n", Reverse(nums))
	f, l := Ends(nums)
	fmt.Printf("首=%d, 末=%d\\n", f, l)
}
`,
    hints: [
      '泛型语法：函数名后加类型参数 `[T any]`，函数体内 T 就是普通类型。`func Reverse[T any](s []T) []T` 里的 `make([]T, len(s))` 可以直接用 T。',
      '反转的填充逻辑：遍历原切片，`r[len(s)-1-i] = v` 把第 i 个放到倒数第 i 个位置。不要在原切片上原地交换（题目要求返回新切片、不改原切片）。',
      '首尾函数用命名返回值最清晰：`func Ends[T any](s []T) (first, last T) { first, last = s[0], s[len(s)-1]; return }`。调用：`f, l := Ends(nums)`。',
    ],
    tests: [
      {
        name: '样例：5 12 8',
        stdin: '3\n5 12 8\n',
        expected: '原始: [5 12 8]\n反转: [8 12 5]\n首=5, 末=8',
      },
      {
        name: '样例：单元素',
        stdin: '1\n42\n',
        expected: '原始: [42]\n反转: [42]\n首=42, 末=42',
      },
      {
        name: '隐藏：5 个元素',
        stdin: '5\n1 2 3 4 5\n',
        expected: '原始: [1 2 3 4 5]\n反转: [5 4 3 2 1]\n首=1, 末=5',
        hidden: true,
      },
      {
        name: '隐藏：含负数',
        stdin: '4\n-1 0 7 -7\n',
        expected: '原始: [-1 0 7 -7]\n反转: [-7 7 0 -1]\n首=-1, 末=-7',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-paradigm-8',
    lang: 'go',
    module: 'paradigm',
    order: 8,
    title: '泛型约束：定制模具规格',
    difficulty: 3,
    xp: 30,
    goals: [
      '使用内置约束 comparable（支持 == 与 !=）',
      '定义自定义约束：类型集合 ~int | ~float64',
      '理解约束决定了泛型体内能做什么操作',
    ],
    brief: `## 约束：告诉泛型"你能做什么"

\`[T any]\` 里的 any 本身就是个约束接口，只是它什么都不要求。想要 ==、<、+ 这些操作，就要换约束：

\`\`\`go
// 内置约束 comparable：支持 == 和 != 的类型
func Contains[T comparable](s []T, target T) int {
    for i, v := range s {
        if v == target { return i }
    }
    return -1
}
\`\`\`

## 自定义约束：类型集合

\`|\` 表示"或"，\`~\` 表示"底层类型"：

\`\`\`go
type Number interface {
    ~int | ~float64 // 底层是 int 或 float64 的类型都算
}

func Sum[T Number](s []T) T {
    var total T // 零值起步
    for _, v := range s {
        total += v // 合法：类型集合里每个类型都支持 +
    }
    return total
}
\`\`\`

约束就是接口的扩展：既能要求方法，也能列出允许的类型集合。编译器据此检查泛型函数体 —— 用了 \`+\`，类型集合里每个类型都必须支持 \`+\`。

> ⚠️ 想在约束里用运算符（+、< 等），必须用类型集合写法，普通"方法接口"做不到。`,
    task: `## 任务：定制模具规格

实现：

1. \`Contains[T comparable](s []T, target T) int\` —— 返回 target 首次出现的下标（0 起），不存在返回 -1
2. 自定义约束 \`type Number interface { ~int | ~float64 }\`
3. \`Sum[T Number](s []T) T\` 与 \`Max[T Number](s []T) T\`

**输入**：第一行 n；第二行 n 个整数；第三行待查找的 target（1 ≤ n ≤ 100）

**输出**（四行）：

1. \`包含 <target>: <true/false>\`
2. \`位置: <下标或 -1>\`
3. \`总和: <S>\`
4. \`最大值: <M>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5\`<br>\`3 8 8 1 12\`<br>\`8\` | \`包含 8: true\`<br>\`位置: 1\`<br>\`总和: 32\`<br>\`最大值: 12\` |
| \`5\`<br>\`3 8 8 1 12\`<br>\`7\` | \`包含 7: false\`<br>\`位置: -1\`<br>\`总和: 32\`<br>\`最大值: 12\` |`,
    starter: `package main

import "fmt"

// TODO 1: 实现 Contains[T comparable](s []T, target T) int
//   返回首次出现的下标，不存在返回 -1

// TODO 2: 定义约束 type Number interface { ~int | ~float64 }
// TODO 3: 实现 Sum[T Number] 与 Max[T Number]

func main() {
	var n int
	fmt.Scan(&n)
	nums := make([]int, n)
	for i := range nums {
		fmt.Scan(&nums[i])
	}
	var target int
	fmt.Scan(&target)

	// TODO 4: 依次打印四行报告
}
`,
    solution: `package main

import "fmt"

// comparable 约束：类型必须支持 == 和 !=
func Contains[T comparable](s []T, target T) int {
	for i, v := range s {
		if v == target {
			return i
		}
	}
	return -1
}

// 自定义约束：类型集合（~int 表示底层类型是 int 的都算）
type Number interface {
	~int | ~float64
}

func Sum[T Number](s []T) T {
	var total T
	for _, v := range s {
		total += v
	}
	return total
}

func Max[T Number](s []T) T {
	m := s[0]
	for _, v := range s[1:] {
		if v > m {
			m = v
		}
	}
	return m
}

func main() {
	var n int
	fmt.Scan(&n)
	nums := make([]int, n)
	for i := range nums {
		fmt.Scan(&nums[i])
	}
	var target int
	fmt.Scan(&target)

	pos := Contains(nums, target)
	fmt.Printf("包含 %d: %t\\n", target, pos >= 0)
	fmt.Printf("位置: %d\\n", pos)
	fmt.Printf("总和: %d\\n", Sum(nums))
	fmt.Printf("最大值: %d\\n", Max(nums))
}
`,
    hints: [
      '`comparable` 是内置约束，出现在类型参数位：`func Contains[T comparable](s []T, target T) int`。它允许在函数体里写 `v == target`；换成 any 就编译不过。',
      '自定义约束用类型集合：`type Number interface { ~int | ~float64 }`。`var total T` 是 T 的零值（int 就是 0），循环里 `total += v` 合法，因为集合里每个类型都支持 +=。',
      'Max 先假设第一个最大：`m := s[0]`，再从 `s[1:]` 逐个比较。输出用 %t 打印布尔、%d 打印整数，注意"包含 8: true"中冒号后有空格。',
    ],
    tests: [
      {
        name: '样例：查找 8',
        stdin: '5\n3 8 8 1 12\n8\n',
        expected: '包含 8: true\n位置: 1\n总和: 32\n最大值: 12',
      },
      {
        name: '样例：查找 7',
        stdin: '5\n3 8 8 1 12\n7\n',
        expected: '包含 7: false\n位置: -1\n总和: 32\n最大值: 12',
      },
      {
        name: '隐藏：全负数',
        stdin: '3\n-5 -1 -9\n-1\n',
        expected: '包含 -1: true\n位置: 1\n总和: -15\n最大值: -1',
        hidden: true,
      },
      {
        name: '隐藏：单元素命中',
        stdin: '1\n42\n42\n',
        expected: '包含 42: true\n位置: 0\n总和: 42\n最大值: 42',
        hidden: true,
      },
      {
        name: '隐藏：4 个元素',
        stdin: '4\n2 4 6 8\n5\n',
        expected: '包含 5: false\n位置: -1\n总和: 20\n最大值: 8',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-paradigm-9',
    lang: 'go',
    module: 'paradigm',
    order: 9,
    title: 'goroutine 入门：分身术',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握 go 关键字启动协程',
      '使用 sync.WaitGroup 的 Add/Done/Wait 三件套',
      '理解"并发写不同下标安全、输出顺序由 main 控制"',
    ],
    brief: `## goroutine：轻量并发

\`go\` 关键字把函数变成并发执行的任务：

\`\`\`go
go doWork(1)        // 立即返回，doWork 在新协程里跑
go func() { ... }() // 匿名函数也行
\`\`\`

goroutine 极其轻量（初始栈仅几 KB），开几千个毫无压力。但 main 一旦返回，**所有 goroutine 立即被终止** —— 所以需要等待机制。

## sync.WaitGroup：等待集体完工

\`\`\`go
var wg sync.WaitGroup
for i := 0; i < 3; i++ {
    wg.Add(1) // 计数 +1
    go func(idx int) {
        defer wg.Done() // 完成时计数 -1
        _ = idx
    }(i)
}
wg.Wait() // 阻塞到计数归零
\`\`\`

> ⚠️ 三件套缺一不可：忘了 Add 则 Wait 直接通过，忘了 Done 则 Wait 永久卡死。并发写**不同的**切片下标是安全的；写同一个变量就要加锁（进阶章节细讲）。`,
    task: `## 任务：分身术

读入 n 个整数，为每个数启动一个 goroutine 并发计算平方：协程 \`i\` 把结果写进 \`results[i]\`（各写各的下标，安全），主协程用 \`sync.WaitGroup\` 等全部完成后，**按输入顺序**打印。

**输入**：第一行 n（1 ≤ n ≤ 100）；第二行 n 个整数

**输出**（n+1 行）：

1. \`启动 <n> 个协程计算平方\`
2. 每个数一行：\`<x> 的平方是 <x²>\`（按输入顺序）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`5 12 8\` | \`启动 3 个协程计算平方\`<br>\`5 的平方是 25\`<br>\`12 的平方是 144\`<br>\`8 的平方是 64\` |

> 💡 为什么输出能有序？因为协程只写 \`results[idx]\`，main 等 WaitGroup 归零后统一打印 —— 顺序由 main 决定，与调度无关。`,
    starter: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	nums := make([]int, n)
	for i := range nums {
		fmt.Scan(&nums[i])
	}

	fmt.Printf("启动 %d 个协程计算平方\\n", n)

	// TODO 1: results := make([]int, n)
	// TODO 2: 补 import "sync"；var wg sync.WaitGroup
	// TODO 3: 循环里 wg.Add(1)，go func(idx, x int) 计算平方写入 results[idx]，defer wg.Done()
	// TODO 4: wg.Wait() 后按输入顺序打印每行"x 的平方是 y"
}
`,
    solution: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var n int
	fmt.Scan(&n)
	nums := make([]int, n)
	for i := range nums {
		fmt.Scan(&nums[i])
	}

	fmt.Printf("启动 %d 个协程计算平方\\n", n)

	results := make([]int, n) // 每个协程写自己的下标，互不冲突
	var wg sync.WaitGroup
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func(idx, x int) {
			defer wg.Done()
			results[idx] = x * x
		}(i, nums[i])
	}
	wg.Wait() // 等所有协程完成

	for i, v := range results {
		fmt.Printf("%d 的平方是 %d\\n", nums[i], v)
	}
}
`,
    hints: [
      'WaitGroup 三件套：每个协程启动前 `wg.Add(1)`，协程内第一行 `defer wg.Done()`，主协程 `wg.Wait()` 阻塞等待计数归零。记得补 import "sync"。',
      '协程参数显式传入最清晰：`go func(idx, x int) { defer wg.Done(); results[idx] = x * x }(i, nums[i])`。写不同的 results[i] 互不冲突，不需要锁。',
      '输出顺序由 main 控制：wg.Wait() 之后 `for i, v := range results { fmt.Printf("%d 的平方是 %d\\n", nums[i], v) }`，不要在协程里打印（那样顺序就乱了）。',
    ],
    tests: [
      {
        name: '样例：5 12 8',
        stdin: '3\n5 12 8\n',
        expected: '启动 3 个协程计算平方\n5 的平方是 25\n12 的平方是 144\n8 的平方是 64',
      },
      {
        name: '样例：单协程',
        stdin: '1\n0\n',
        expected: '启动 1 个协程计算平方\n0 的平方是 0',
      },
      {
        name: '隐藏：含负数',
        stdin: '4\n-2 -3 10 7\n',
        expected: '启动 4 个协程计算平方\n-2 的平方是 4\n-3 的平方是 9\n10 的平方是 100\n7 的平方是 49',
        hidden: true,
      },
      {
        name: '隐藏：重复大数',
        stdin: '2\n999 999\n',
        expected: '启动 2 个协程计算平方\n999 的平方是 998001\n999 的平方是 998001',
        hidden: true,
      },
    ],
  },
  {
    id: 'go-paradigm-10',
    lang: 'go',
    module: 'paradigm',
    order: 10,
    title: 'channel 管道：数据流水线',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握 make(chan T) 的发送与接收',
      '理解无缓冲 channel 的同步阻塞特性',
      '学会 close + for range 的标准消费模式',
    ],
    brief: `## channel：协程之间的传送带

channel 是带类型的管道，一端发送、一端接收：

\`\`\`go
ch := make(chan int) // 无缓冲 channel

ch <- 10  // 发送：阻塞，直到有人取走
x := <-ch // 接收：阻塞，直到有人送来
\`\`\`

**无缓冲 channel 是同步点**：发送方和接收方必须同时到场，数据才交接成功。这让并发程序的时序变得可控。

## close 与 for range

生产者发完数据后 \`close(ch)\`。消费者用 range 循环接收，channel 关闭且取空后循环自动结束：

\`\`\`go
for x := range ch {
    fmt.Println(x)
}
\`\`\`

这是"生产者-消费者"的最小骨架：生产者协程发送，主协程 range 接收，一条 channel 就是整条流水线。

> ⚠️ 两大坑：向**已关闭**的 channel 发送会 panic；忘了 close，range 会永远阻塞。规则：**由发送方负责 close**。`,
    task: `## 任务：数据流水线

实现生产者函数 \`producer(ch chan int, nums []int)\`：逐个把数字发送到 channel，发完后 \`close(ch)\`。主协程用 \`for x := range ch\` 消费，统计个数与总和。

**输入**：第一行 n（0 ≤ n ≤ 100）；第二行 n 个整数（n 为 0 时该行不存在）

**输出**：

- 收到每个数一行：\`收到第 <序号> 个: <x>\`
- 结束行：\`管道结束, 共 <n> 个, 总和 = <S>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`10 20 30\` | \`收到第 1 个: 10\`<br>\`收到第 2 个: 20\`<br>\`收到第 3 个: 30\`<br>\`管道结束, 共 3 个, 总和 = 60\` |
| \`0\` | \`管道结束, 共 0 个, 总和 = 0\` |`,
    starter: `package main

import "fmt"

// TODO 1: 补全 producer：逐个发送每个数，发完 close(ch)
func producer(ch chan int, nums []int) {
}

func main() {
	var n int
	fmt.Scan(&n)
	nums := make([]int, n)
	for i := range nums {
		fmt.Scan(&nums[i])
	}

	ch := make(chan int)
	go producer(ch, nums)
	// TODO 2: for x := range ch 接收，统计序号与总和，打印"收到第 i 个: x"
	// TODO 3: 循环结束后打印"管道结束, 共 i 个, 总和 = s"
}
`,
    solution: `package main

import "fmt"

// 生产者：把数据逐个发送到 channel，发完关闭
func producer(ch chan int, nums []int) {
	for _, x := range nums {
		ch <- x
	}
	close(ch)
}

func main() {
	var n int
	fmt.Scan(&n)
	nums := make([]int, n)
	for i := range nums {
		fmt.Scan(&nums[i])
	}

	ch := make(chan int) // 无缓冲：发送阻塞直到接收方取走
	go producer(ch, nums)

	total := 0
	count := 0
	for x := range ch { // 消费者：channel 关闭且取空后循环结束
		count++
		total += x
		fmt.Printf("收到第 %d 个: %d\\n", count, x)
	}
	fmt.Printf("管道结束, 共 %d 个, 总和 = %d\\n", count, total)
}
`,
    hints: [
      '生产者三行：`for _, x := range nums { ch <- x }` 然后 `close(ch)`。发送是阻塞的：每个 `ch <- x` 都要等主协程取走才继续。',
      '消费用 range：`for x := range ch { ... }`，close 之后且数据取空，循环自动退出 —— 不需要自己判断"还有没有数据"。',
      '统计两件套在循环里维护：`count++; total += x`，打印 `fmt.Printf("收到第 %d 个: %d\\n", count, x)`。循环结束后 `fmt.Printf("管道结束, 共 %d 个, 总和 = %d\\n", count, total)`。',
    ],
    tests: [
      {
        name: '样例：10 20 30',
        stdin: '3\n10 20 30\n',
        expected: '收到第 1 个: 10\n收到第 2 个: 20\n收到第 3 个: 30\n管道结束, 共 3 个, 总和 = 60',
      },
      {
        name: '样例：1 到 5',
        stdin: '5\n1 2 3 4 5\n',
        expected: '收到第 1 个: 1\n收到第 2 个: 2\n收到第 3 个: 3\n收到第 4 个: 4\n收到第 5 个: 5\n管道结束, 共 5 个, 总和 = 15',
      },
      {
        name: '隐藏：正负抵消',
        stdin: '2\n-5 5\n',
        expected: '收到第 1 个: -5\n收到第 2 个: 5\n管道结束, 共 2 个, 总和 = 0',
        hidden: true,
      },
      {
        name: '隐藏：空流水线',
        stdin: '0\n',
        expected: '管道结束, 共 0 个, 总和 = 0',
        hidden: true,
      },
      {
        name: '隐藏：单个数',
        stdin: '1\n42\n',
        expected: '收到第 1 个: 42\n管道结束, 共 1 个, 总和 = 42',
        hidden: true,
      },
    ],
  },
];
