import type { Level } from '@/types';

/** Rust · 第二章：核心编程思想（10 关） */
export const RUST_PARADIGM: Level[] = [
  {
    id: 'rust-paradigm-1',
    lang: 'rust',
    module: 'paradigm',
    order: 1,
    title: '结构体与方法',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握 struct 定义与字段初始化简写',
      '掌握 impl 块：关联函数 new 与方法 &self',
      '理解 Self 与方法调用语法',
    ],
    brief: `## 结构体与方法：数据 + 行为

\`\`\`rust
struct Rect {
    w: f64,
    h: f64,
}

impl Rect {
    // 关联函数（没有 self）：常当"构造器"，用 :: 调用
    fn new(w: f64, h: f64) -> Self {
        Rect { w, h } // 字段名与变量同名时可简写
    }

    // 方法（第一个参数是 self 的引用）：用 . 调用
    fn area(&self) -> f64 {
        self.w * self.h
    }
}

let r = Rect::new(3.0, 4.0);
r.area(); // 12
\`\`\`

要点：

- \`impl 类型 { }\` 块里放方法；\`&self\` 表示"只读借用自己"，\`&mut self\` 可改自己，\`self\` 会吃掉自己；
- \`Self\` 是"本类型"的别名，构造器返回 \`Self\` 最地道；
- Rust 的 struct 没有继承，复用靠组合与 trait（下一关）。`,
    task: `## 任务：矩形体检报告

定义结构体 \`Rect\`（字段 \`w\`、\`h\`，类型 \`f64\`），并实现：

1. 关联函数 \`fn new(w: f64, h: f64) -> Self\`
2. 方法 \`fn area(&self) -> f64\` —— 面积
3. 方法 \`fn perim(&self) -> f64\` —— 周长（2×(w+h)）
4. 方法 \`fn is_square(&self) -> bool\` —— 是否正方形（w == h）

**输入**：一行两个数 w h（0 < w, h ≤ 1000）

**输出**（三行）：

1. \`面积: <area>\`
2. \`周长: <perim>\`
3. \`正方形: <true/false>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 4\` | \`面积: 12\`<br>\`周长: 14\`<br>\`正方形: false\` |
| \`5 5\` | \`面积: 25\`<br>\`周长: 20\`<br>\`正方形: true\` |

浮点数用 \`{}\` 直接打印即可（12.0 会显示成 \`12\`）。`,
    starter: `use std::io;

struct Rect {
    w: f64,
    h: f64,
}

impl Rect {
    // TODO 1: 关联函数 new(w, h) -> Self
    // TODO 2: 方法 area(&self) -> f64
    // TODO 3: 方法 perim(&self) -> f64
    // TODO 4: 方法 is_square(&self) -> bool
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let w: f64 = parts.next().unwrap().parse().unwrap();
    let h: f64 = parts.next().unwrap().parse().unwrap();

    // TODO 5: 构造 Rect 并输出三行报告
}
`,
    solution: `use std::io;

struct Rect {
    w: f64,
    h: f64,
}

impl Rect {
    fn new(w: f64, h: f64) -> Self {
        Rect { w, h }
    }

    fn area(&self) -> f64 {
        self.w * self.h
    }

    fn perim(&self) -> f64 {
        2.0 * (self.w + self.h)
    }

    fn is_square(&self) -> bool {
        self.w == self.h
    }
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let w: f64 = parts.next().unwrap().parse().unwrap();
    let h: f64 = parts.next().unwrap().parse().unwrap();

    let r = Rect::new(w, h);
    println!("面积: {}", r.area());
    println!("周长: {}", r.perim());
    println!("正方形: {}", r.is_square());
}
`,
    hints: [
      '构造器一行搞定：`fn new(w: f64, h: f64) -> Self { Rect { w, h } }` —— 字段简写。',
      '面积 `self.w * self.h`，周长 `2.0 * (self.w + self.h)`，正方形判断 `self.w == self.h`。都用 `&self`。',
      '调用：`let r = Rect::new(w, h);` 然后方法用点号 `r.area()`，打印用 `{}`。',
    ],
    tests: [
      { name: '样例：3 4', stdin: '3 4\n', expected: '面积: 12\n周长: 14\n正方形: false' },
      { name: '样例：5 5', stdin: '5 5\n', expected: '面积: 25\n周长: 20\n正方形: true' },
      { name: '隐藏：小数', stdin: '2.5 4\n', expected: '面积: 10\n周长: 13\n正方形: false', hidden: true },
      { name: '隐藏：0.5', stdin: '0.5 0.5\n', expected: '面积: 0.25\n周长: 2\n正方形: true', hidden: true },
    ],
  },
  {
    id: 'rust-paradigm-2',
    lang: 'rust',
    module: 'paradigm',
    order: 2,
    title: '枚举与 match',
    difficulty: 3,
    xp: 30,
    goals: [
      '定义携带数据的自定义枚举',
      '用 match 穷尽匹配所有变体并解构数据',
      '体验漏写变体导致的编译错误',
    ],
    brief: `## 枚举：一个类型，多种形态

Rust 枚举的变体可以**携带数据**，比 C 的枚举强大得多：

\`\`\`rust
enum Shape {
    Circle(f64),    // 携带半径
    Rect(f64, f64), // 携带宽、高
    Tri(f64, f64),  // 携带底、高
}
\`\`\`

### match：穷尽性检查

\`\`\`rust
match shape {
    Shape::Circle(r) => std::f64::consts::PI * r * r,
    Shape::Rect(w, h) => w * h,
    Shape::Tri(b, h) => b * h / 2.0,
}
\`\`\`

- 每个变体都要处理，**漏一个就是编译错误**（non-exhaustive patterns）—— 这是 Rust 消灭"忘记处理分支"类 bug 的杀手锏；
- 变体携带的数据被**解构**进模式变量；
- \`_\` 分支兜底"其余情况"，但能用穷尽匹配就别偷懒用 \`_\`。

> 💡 圆周率用 \`std::f64::consts::PI\`，别手写 3.14。`,
    task: `## 任务：形状面积机

定义枚举 \`Shape\`，三个变体各携带数据：

- \`Circle(f64)\` —— 圆，携带半径
- \`Rect(f64, f64)\` —— 矩形，携带宽、高
- \`Tri(f64, f64)\` —— 三角形，携带底、高

给它实现 \`fn area(&self) -> f64\`：用 match 计算面积。

**输入**：一行，先是形状单词 \`circle\` / \`rect\` / \`tri\`，后跟对应参数（空格分隔）

**输出**：一行 \`面积: <保留 2 位小数>\`

- circle: π × r²（用 \`std::f64::consts::PI\`）
- rect: w × h
- tri: 底 × 高 ÷ 2

### 示例

| 输入 | 输出 |
| --- | --- |
| \`circle 5\` | \`面积: 78.54\` |
| \`rect 3 4\` | \`面积: 12.00\` |
| \`tri 6 8\` | \`面积: 24.00\` |`,
    starter: `use std::io;

// TODO 1: 定义 enum Shape { Circle(f64), Rect(f64, f64), Tri(f64, f64) }

impl Shape {
    // TODO 2: 实现 fn area(&self) -> f64，用 match 穷尽三个变体
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let kind = parts.next().unwrap();

    // TODO 3: 按 kind 构造对应的 Shape 变体（参数用 parse 读取）

    // TODO 4: 打印 "面积: {:.2}"
}
`,
    solution: `use std::io;

enum Shape {
    Circle(f64),
    Rect(f64, f64),
    Tri(f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r) => std::f64::consts::PI * r * r,
            Shape::Rect(w, h) => w * h,
            Shape::Tri(b, h) => b * h / 2.0,
        }
    }
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let kind = parts.next().unwrap();

    let shape = match kind {
        "circle" => Shape::Circle(parts.next().unwrap().parse().unwrap()),
        "rect" => Shape::Rect(
            parts.next().unwrap().parse().unwrap(),
            parts.next().unwrap().parse().unwrap(),
        ),
        _ => Shape::Tri(
            parts.next().unwrap().parse().unwrap(),
            parts.next().unwrap().parse().unwrap(),
        ),
    };

    println!("面积: {:.2}", shape.area());
}
`,
    hints: [
      '构造时先看 kind：`match kind { "circle" => Shape::Circle(...), "rect" => ..., _ => Shape::Tri(...) }`，参数用 `parts.next().unwrap().parse().unwrap()`。',
      'area 的 match 里解构携带的数据：`Shape::Circle(r) => std::f64::consts::PI * r * r`，矩形 `w * h`，三角形 `b * h / 2.0`。',
      '输出用 `{:.2}` 保留两位：circle 5 → 78.54，rect 3 4 → 12.00，tri 6 8 → 24.00。',
    ],
    tests: [
      { name: '样例：circle 5', stdin: 'circle 5\n', expected: '面积: 78.54' },
      { name: '样例：rect 3 4', stdin: 'rect 3 4\n', expected: '面积: 12.00' },
      { name: '样例：tri 6 8', stdin: 'tri 6 8\n', expected: '面积: 24.00' },
      { name: '隐藏：circle 1', stdin: 'circle 1\n', expected: '面积: 3.14', hidden: true },
      { name: '隐藏：rect 小数', stdin: 'rect 2.5 4\n', expected: '面积: 10.00', hidden: true },
      { name: '隐藏：tri 3 3', stdin: 'tri 3 3\n', expected: '面积: 4.50', hidden: true },
    ],
  },
  {
    id: 'rust-paradigm-3',
    lang: 'rust',
    module: 'paradigm',
    order: 3,
    title: 'trait 与多态',
    difficulty: 3,
    xp: 30,
    goals: [
      '定义 trait 并为多个类型实现',
      '编写带 trait bound 的泛型函数 T: Area',
      '理解单态化静态派发与 impl Trait 简写',
    ],
    brief: `## trait：Rust 的"接口"

\`\`\`rust
trait Area {
    fn area(&self) -> f64; // 只有签名：实现者必须自己写
}

struct Circle { r: f64 }
struct Square { s: f64 }

impl Area for Circle {
    fn area(&self) -> f64 { std::f64::consts::PI * self.r * self.r }
}
impl Area for Square {
    fn area(&self) -> f64 { self.s * self.s }
}
\`\`\`

### trait bound：给泛型上规矩

\`\`\`rust
fn show<T: Area>(shape: &T) {
    println!("{:.2}", shape.area());
}

show(&Circle { r: 1.0 }); // ✅
show(&42);                // ❌ i64 没实现 Area
\`\`\`

\`T: Area\` 读作"T 必须实现 Area"。编译器为每个具体类型生成专用代码（**单态化**），零运行时开销。简写 \`fn show(shape: &impl Area)\` 等价。`,
    task: `## 任务：多态面积展示台

1. 定义 trait \`Area\`，含方法 \`fn area(&self) -> f64\`
2. 定义结构体 \`Circle { r: f64 }\` 和 \`Square { s: f64 }\`，都实现 \`Area\`
3. 编写**泛型函数** \`fn show<T: Area>(shape: &T)\`，打印 \`{:.2}\` 格式的面积
4. main 中读入两行，各构造一个形状，依次用 \`show\` 展示

**输入**：两行，每行是 \`circle <r>\` 或 \`square <s>\`

**输出**：两行，每行一个面积（保留 2 位小数）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`circle 5\`<br>\`square 3\` | \`78.54\`<br>\`9.00\` |

同一个 \`show\` 函数服务于两种类型 —— 这就是 trait bound 带来的多态。`,
    starter: `use std::io;

// TODO 1: 定义 trait Area（方法 area）

// TODO 2: 定义 Circle / Square 并为它们 impl Area

// TODO 3: 定义泛型函数 show<T: Area>(shape: &T)

fn main() {
    let mut line1 = String::new();
    std::io::stdin().read_line(&mut line1).unwrap();
    // TODO 4: 解析第一行并调用 show

    let mut line2 = String::new();
    std::io::stdin().read_line(&mut line2).unwrap();
    // TODO 5: 解析第二行并调用 show
}
`,
    solution: `use std::io;

trait Area {
    fn area(&self) -> f64;
}

struct Circle {
    r: f64,
}

struct Square {
    s: f64,
}

impl Area for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.r * self.r
    }
}

impl Area for Square {
    fn area(&self) -> f64 {
        self.s * self.s
    }
}

fn show<T: Area>(shape: &T) {
    println!("{:.2}", shape.area());
}

fn main() {
    let mut line1 = String::new();
    std::io::stdin().read_line(&mut line1).unwrap();
    let mut p1 = line1.split_whitespace();
    let kind1 = p1.next().unwrap();
    let v1: f64 = p1.next().unwrap().parse().unwrap();

    let mut line2 = String::new();
    std::io::stdin().read_line(&mut line2).unwrap();
    let mut p2 = line2.split_whitespace();
    let kind2 = p2.next().unwrap();
    let v2: f64 = p2.next().unwrap().parse().unwrap();

    if kind1 == "circle" {
        show(&Circle { r: v1 });
    } else {
        show(&Square { s: v1 });
    }
    if kind2 == "circle" {
        show(&Circle { r: v2 });
    } else {
        show(&Square { s: v2 });
    }
}
`,
    hints: [
      'trait 只有签名：`trait Area { fn area(&self) -> f64; }`（注意分号）。实现用 `impl Area for Circle { fn area(&self) -> f64 { ... } }`。',
      '泛型函数：`fn show<T: Area>(shape: &T) { println!("{:.2}", shape.area()); }` —— bound 让编译器知道 T 有 area 方法。',
      '圆面积 `std::f64::consts::PI * r * r`，方面积 `s * s`。两行输入各调用一次 show。',
    ],
    tests: [
      { name: '样例：circle 5 / square 3', stdin: 'circle 5\nsquare 3\n', expected: '78.54\n9.00' },
      { name: '样例：circle 2 / square 2.5', stdin: 'circle 2\nsquare 2.5\n', expected: '12.57\n6.25' },
      { name: '隐藏：单位值', stdin: 'circle 1\nsquare 1\n', expected: '3.14\n1.00', hidden: true },
      { name: '隐藏：大值', stdin: 'circle 10\nsquare 9\n', expected: '314.16\n81.00', hidden: true },
    ],
  },
  {
    id: 'rust-paradigm-4',
    lang: 'rust',
    module: 'paradigm',
    order: 4,
    title: '派生与默认方法',
    difficulty: 2,
    xp: 25,
    goals: [
      '用 #[derive(Debug, Clone, PartialEq)] 自动实现能力',
      '精确掌握 {:?} 的 Debug 输出格式',
      '编写带默认实现的 trait 方法',
    ],
    brief: `## derive：让编译器替你写代码

\`\`\`rust
#[derive(Debug, Clone, PartialEq)]
struct Point { x: i32, y: i32 }
\`\`\`

\`#[derive(...)]\` 让编译器自动实现常用 trait：

- \`Debug\` → 支持 \`{:?}\` 打印，输出 \`Point { x: 3, y: 4 }\`
- \`Clone\` → 支持 \`.clone()\` 深拷贝
- \`PartialEq\` → 支持 \`==\` 比较

### trait 默认方法

trait 的方法可以有**默认实现**，实现者可以选择覆盖或直接用：

\`\`\`rust
trait Measurable {
    fn value(&self) -> i32;    // 必须实现
    fn doubled(&self) -> i32 { // 默认实现
        self.value() * 2
    }
}
\`\`\`

默认方法还能调用同 trait 的其他方法 —— 这就是模板方法模式。没有默认体的方法（如 \`value\`）是实现者必须写的"抽象方法"。`,
    task: `## 任务：派生报告

1. 定义 \`#[derive(Debug, Clone, PartialEq)]\` 的结构体 \`Point { x: i32, y: i32 }\`
2. 定义 trait \`Measurable\`：必须有 \`fn value(&self) -> i32\`（返回 x+y），带默认方法 \`fn doubled(&self) -> i32\`（返回 value×2，不用覆盖）
3. 为 Point 实现 \`Measurable\`
4. main 中读入两个整数构造 \`p1\`，用 \`.clone()\` 得到 \`p2\`，输出三行

**输入**：一行两个整数 x y（-1000 ≤ x, y ≤ 1000）

**输出**（三行）：

1. \`调试: <用 {:?} 打印 p1>\`
2. \`相等: <p1 == p2>\`
3. \`两倍: <p1.doubled()>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 4\` | \`调试: Point { x: 3, y: 4 }\`<br>\`相等: true\`<br>\`两倍: 14\` |

第 1 行的格式必须由 \`{:?}\` 生成，不能手工拼。`,
    starter: `use std::io;

// TODO 1: 定义带 #[derive(Debug, Clone, PartialEq)] 的 Point

// TODO 2: 定义 trait Measurable（value 必须实现，doubled 默认实现）

// TODO 3: 为 Point 实现 Measurable

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 4: 构造 p1、clone 得 p2，输出三行
}
`,
    solution: `use std::io;

#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

trait Measurable {
    fn value(&self) -> i32;

    fn doubled(&self) -> i32 {
        self.value() * 2
    }
}

impl Measurable for Point {
    fn value(&self) -> i32 {
        self.x + self.y
    }
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let p1 = Point { x: nums[0], y: nums[1] };
    let p2 = p1.clone();

    println!("调试: {:?}", p1);
    println!("相等: {}", p1 == p2);
    println!("两倍: {}", p1.doubled());
}
`,
    hints: [
      'derive 一行放结构体上方：`#[derive(Debug, Clone, PartialEq)]`。clone 得到 p2，== 比较，都是派生带来的能力。',
      '默认方法不用写函数体：`fn doubled(&self) -> i32 { self.value() * 2 }`，Point 的 impl 里只写 value。',
      'Debug 格式是编译器生成的，直接 `println!("调试: {:?}", p1);` —— 3 4 会输出 `Point { x: 3, y: 4 }`。',
    ],
    tests: [
      { name: '样例：3 4', stdin: '3 4\n', expected: '调试: Point { x: 3, y: 4 }\n相等: true\n两倍: 14' },
      { name: '样例：-2 8', stdin: '-2 8\n', expected: '调试: Point { x: -2, y: 8 }\n相等: true\n两倍: 12' },
      { name: '隐藏：全零', stdin: '0 0\n', expected: '调试: Point { x: 0, y: 0 }\n相等: true\n两倍: 0', hidden: true },
      { name: '隐藏：正负抵消', stdin: '100 -100\n', expected: '调试: Point { x: 100, y: -100 }\n相等: true\n两倍: 0', hidden: true },
    ],
  },
  {
    id: 'rust-paradigm-5',
    lang: 'rust',
    module: 'paradigm',
    order: 5,
    title: '闭包与环境捕获',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握闭包语法 |参数| 表达式 与类型推断',
      '把闭包存进变量、用 match 选择闭包',
      '理解闭包捕获环境变量',
    ],
    brief: `## 闭包：能捕获环境的匿名函数

\`\`\`rust
let add = |x: i64, y: i64| x + y; // 类型可省略，让编译器推断
let double = |v| v * 2;           // |参数| 表达式
add(3, 5);   // 8
double(21);  // 42
\`\`\`

闭包与函数最大的区别：**闭包能捕获所在环境的变量**：

\`\`\`rust
let k = 100;
let with_offset = |x| x + k; // 捕获了 k
with_offset(5); // 105
\`\`\`

编译器按需选择捕获方式（借用 / 可变借用 / 移动）；\`move ||\` 强制拿走所有权（多线程必用，第 10 关见）。

闭包本质是实现了 \`Fn\` / \`FnMut\` / \`FnOnce\` trait 的匿名类型 —— 所以闭包能存进变量、当参数传递，甚至用 match 挑一个来调用。`,
    task: `## 任务：闭包计算器

读入 \`a\`、\`b\`、运算符、偏移量 \`k\` 四个字段，完成：

1. 定义三个闭包 \`add\` / \`sub\` / \`mul\`（参数 i64，返回 x+y、x-y、x*y）
2. 用 match 按运算符选中一个闭包并调用，得到结果
3. 再定义捕获了 \`k\` 的闭包 \`with_offset = |x| x + k\`，把结果加上偏移

**输入**：一行：\`a b op k\`（op ∈ \`+\` \`-\` \`*\`，|a|,|b|,k ≤ 1000）

**输出**（两行）：

1. \`a op b = 结果\`
2. \`偏移: <结果 + k>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 5 * 100\` | \`3 * 5 = 15\`<br>\`偏移: 115\` |
| \`10 4 - 7\` | \`10 - 4 = 6\`<br>\`偏移: 13\` |`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let a: i64 = parts.next().unwrap().parse().unwrap();
    let b: i64 = parts.next().unwrap().parse().unwrap();
    let op = parts.next().unwrap();
    let k: i64 = parts.next().unwrap().parse().unwrap();

    // TODO 1: 定义 add / sub / mul 三个闭包
    // TODO 2: 用 match op 选中闭包并调用
    // TODO 3: 定义捕获 k 的 with_offset 闭包
    // TODO 4: 输出两行
}
`,
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let a: i64 = parts.next().unwrap().parse().unwrap();
    let b: i64 = parts.next().unwrap().parse().unwrap();
    let op = parts.next().unwrap();
    let k: i64 = parts.next().unwrap().parse().unwrap();

    let add = |x: i64, y: i64| x + y;
    let sub = |x: i64, y: i64| x - y;
    let mul = |x: i64, y: i64| x * y;

    let f = match op {
        "+" => add,
        "-" => sub,
        _ => mul,
    };

    let with_offset = |x: i64| x + k;

    println!("{} {} {} = {}", a, op, b, f(a, b));
    println!("偏移: {}", with_offset(f(a, b)));
}
`,
    hints: [
      '闭包定义：`let add = |x: i64, y: i64| x + y;`。三个闭包签名一致，才能用 match 挑选。',
      '选择闭包：`let f = match op { "+" => add, "-" => sub, _ => mul };`，然后 `f(a, b)` 调用。',
      '捕获环境：`let with_offset = |x: i64| x + k;` —— k 不用传参，闭包自己"记得"。输出格式注意运算符两侧空格。',
    ],
    tests: [
      { name: '样例：3 5 * 100', stdin: '3 5 * 100\n', expected: '3 * 5 = 15\n偏移: 115' },
      { name: '样例：10 4 - 7', stdin: '10 4 - 7\n', expected: '10 - 4 = 6\n偏移: 13' },
      { name: '隐藏：加法', stdin: '2 8 + 1\n', expected: '2 + 8 = 10\n偏移: 11' },
      { name: '隐藏：零偏移', stdin: '7 7 * 0\n', expected: '7 * 7 = 49\n偏移: 49', hidden: true },
    ],
  },
  {
    id: 'rust-paradigm-6',
    lang: 'rust',
    module: 'paradigm',
    order: 6,
    title: '迭代器链',
    difficulty: 3,
    xp: 30,
    goals: [
      '用 iter().filter().map() 等组合迭代器',
      '掌握 sum / max / count 收尾消费',
      '理解迭代器惰性与两层解引用模式',
    ],
    brief: `## 迭代器链：声明式数据处理

\`\`\`rust
let v = vec![1, 2, 3, 4, 5];
let total: i32 = v.iter().filter(|&&x| x > 0).map(|x| x * x).sum();
\`\`\`

链式核心角色：

- \`.iter()\` 把集合变成迭代器（借用元素）；
- \`.filter(谓词)\` 留下满足条件的；
- \`.map(变换)\` 逐个变形；
- \`.sum() / .max() / .count()\` 收尾消费。

迭代器是**惰性**的：不调用收尾方法就什么也不做。编译器会把链优化得和手写循环一样快（零成本抽象）。

\`\`\`rust
v.iter().filter(|&&x| x > 0)
\`\`\`

filter 给闭包的是 \`&&i64\`（迭代器的引用的引用），所以模式写 \`&&x\` 解构 —— 这是新手最常见的编译报错点。`,
    task: `## 任务：数据流水线

读入一行若干整数（至少 1 个，最多 20 个），用**迭代器链**完成三项统计：

1. \`正数和: <所有 >0 的数之和>\`（没有正数则为 0）
2. \`最大平方: <每个数的平方中的最大值>\`
3. \`偶数个数: <能被 2 整除的个数>\`（0 算偶数）

**输入**：一行若干整数（空格分隔）

**输出**：三行统计结果

### 示例

| 输入 | 输出 |
| --- | --- |
| \`-3 4 -1 6 0\` | \`正数和: 10\`<br>\`最大平方: 36\`<br>\`偶数个数: 3\` |
| \`1 2 3 4 5\` | \`正数和: 15\`<br>\`最大平方: 25\`<br>\`偶数个数: 2\` |

禁用手写 for 循环 —— 三项都必须用迭代器方法完成。`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: filter + sum 求正数和
    // TODO 2: map + max 求最大平方
    // TODO 3: filter + count 数偶数
}
`,
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let pos_sum: i64 = nums.iter().filter(|&&x| x > 0).sum();
    let max_sq = nums.iter().map(|x| x * x).max().unwrap_or(0);
    let even_cnt = nums.iter().filter(|&&x| x % 2 == 0).count();

    println!("正数和: {}", pos_sum);
    println!("最大平方: {}", max_sq);
    println!("偶数个数: {}", even_cnt);
}
`,
    hints: [
      '正数和：`let pos_sum: i64 = nums.iter().filter(|&&x| x > 0).sum();` —— 注意 &&x 两层解构。',
      '最大平方：`nums.iter().map(|x| x * x).max().unwrap_or(0)`。输入非空时 unwrap_or 不会触发。',
      '偶数个数：`nums.iter().filter(|&&x| x % 2 == 0).count()`。0 是偶数；全负数时正数和为空集求和 = 0。',
    ],
    tests: [
      { name: '样例：-3 4 -1 6 0', stdin: '-3 4 -1 6 0\n', expected: '正数和: 10\n最大平方: 36\n偶数个数: 3' },
      { name: '样例：1 2 3 4 5', stdin: '1 2 3 4 5\n', expected: '正数和: 15\n最大平方: 25\n偶数个数: 2' },
      { name: '隐藏：全负', stdin: '-5 -5 -5\n', expected: '正数和: 0\n最大平方: 25\n偶数个数: 0', hidden: true },
      { name: '隐藏：单元素', stdin: '7\n', expected: '正数和: 7\n最大平方: 49\n偶数个数: 0', hidden: true },
    ],
  },
  {
    id: 'rust-paradigm-7',
    lang: 'rust',
    module: 'paradigm',
    order: 7,
    title: '泛型函数',
    difficulty: 3,
    xp: 30,
    goals: [
      '编写泛型函数 largest<T: PartialOrd>',
      '理解 trait bound 约束类型能力',
      '用切片参数 &[T] 同时服务多种集合',
    ],
    brief: `## 泛型：一份代码，多种类型

\`\`\`rust
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut max = &list[0];
    for item in list {
        if item > max {
            max = item;
        }
    }
    max
}
\`\`\`

- \`<T>\` 声明类型参数；\`: PartialOrd\` 是 **trait bound**：T 必须支持 \`>\` 比较（i64、f64 都实现了它）。不写 bound，\`item > max\` 直接编译报错；
- 参数 \`&[T]\` 是切片 —— 能同时接收 Vec、数组（第四章细讲）；
- 编译期**单态化**：为 i64、f64 各生成一份专用代码，无装箱开销。

\`largest(&ints)\` / \`largest(&floats)\` —— 同一个函数，两种类型，两份机器码。这就是 Rust 泛型与 Java 泛型（类型擦除）的本质区别。`,
    task: `## 任务：万能最大值

实现泛型函数 \`fn largest<T: PartialOrd>(list: &[T]) -> &T\`，返回切片中最大元素的引用（禁止用 std 的 max 函数）。

**输入**：两行

1. 第一行：若干整数
2. 第二行：若干小数

**输出**（两行）：

1. \`整数最大: <结果>\`
2. \`浮点最大: <结果>\`

两个输出都必须调用**同一个** largest 函数。

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 7 1 9 4\`<br>\`2.5 9.1 3.3\` | \`整数最大: 9\`<br>\`浮点最大: 9.1\` |`,
    starter: `use std::io;

// TODO: 实现泛型函数 largest<T: PartialOrd>(list: &[T]) -> &T

fn main() {
    let mut line1 = String::new();
    std::io::stdin().read_line(&mut line1).unwrap();
    let ints: Vec<i64> = line1.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let mut line2 = String::new();
    std::io::stdin().read_line(&mut line2).unwrap();
    let floats: Vec<f64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO: 用同一个 largest 分别处理两个 Vec
}
`,
    solution: `use std::io;

fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut max = &list[0];
    for item in list {
        if item > max {
            max = item;
        }
    }
    max
}

fn main() {
    let mut line1 = String::new();
    std::io::stdin().read_line(&mut line1).unwrap();
    let ints: Vec<i64> = line1.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let mut line2 = String::new();
    std::io::stdin().read_line(&mut line2).unwrap();
    let floats: Vec<f64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    println!("整数最大: {}", largest(&ints));
    println!("浮点最大: {}", largest(&floats));
}
`,
    hints: [
      '函数骨架：`let mut max = &list[0]; for item in list { if item > max { max = item; } } max` —— max 存的是引用。',
      'bound 必须写 PartialOrd，否则 `>` 不能用于任意 T：`fn largest<T: PartialOrd>(list: &[T]) -> &T`。',
      '调用时 Vec 自动转切片：`largest(&ints)` 传的是 `&Vec<i64>`，deref 成 `&[i64]`。f64 用 {} 打印，9.1 就显示 9.1。',
    ],
    tests: [
      { name: '样例：混合小数', stdin: '3 7 1 9 4\n2.5 9.1 3.3\n', expected: '整数最大: 9\n浮点最大: 9.1' },
      { name: '样例：全负数', stdin: '-5 -2 -9\n-1.5 -0.5\n', expected: '整数最大: -2\n浮点最大: -0.5' },
      { name: '隐藏：单元素', stdin: '10\n1.5\n', expected: '整数最大: 10\n浮点最大: 1.5', hidden: true },
      { name: '隐藏：重复最大', stdin: '100 3\n2 2 2\n', expected: '整数最大: 100\n浮点最大: 2', hidden: true },
    ],
  },
  {
    id: 'rust-paradigm-8',
    lang: 'rust',
    module: 'paradigm',
    order: 8,
    title: 'Option 组合子',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解 Option<T> 取代 null 的设计',
      '掌握 filter_map + parse().ok() 过滤脏数据',
      '用 if let / unwrap_or 优雅处理 None',
    ],
    brief: `## Option：没有 null 的世界

Rust 用 \`Option<T>\` 表达"可能没有值"：

\`\`\`rust
enum Option<T> {
    Some(T),
    None,
}
\`\`\`

编译器强制你在使用前处理 None —— 空指针异常在 Rust 里不存在。常用组合子：

\`\`\`rust
let x: Option<i32> = Some(42);
x.unwrap_or(0);           // None 时给默认值
x.map(|v| v * 2);         // Some(84)
x.is_some_and(|v| v > 0); // 存在且满足条件
\`\`\`

习惯用法一：\`filter_map(|w| w.parse().ok())\` —— \`ok()\` 把 Result 变 Option，解析失败的 None 被 filter_map 自动丢弃，一行筛出所有合法数字。

习惯用法二：\`if let\` 优雅处理"只关心 Some"：

\`\`\`rust
if let Some(m) = nums.iter().max() {
    println!("{}", m);
} else {
    println!("空空如也");
}
\`\`\``,
    task: `## 任务：淘金者

读入一行若干单词（可能夹杂数字），从中"淘"出所有能解析成 i32 的 token：

1. \`数字个数: <个数>\`
2. \`第一个数字: <首个数字 或 无>\`
3. \`最大数字: <最大值 或 无>\`

要求：第 2、3 行必须用 \`match\` / \`if let\` 处理 None 的情况（输出 \`无\`），禁止 unwrap。

**输入**：一行若干单词（空格分隔，1~10 个）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`abc 42 x7 99 hello\` | \`数字个数: 2\`<br>\`第一个数字: 42\`<br>\`最大数字: 99\` |
| \`no numbers here\` | \`数字个数: 0\`<br>\`第一个数字: 无\`<br>\`最大数字: 无\` |`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();

    // TODO 1: 用 filter_map(|w| w.parse().ok()) 收集所有合法数字
    // TODO 2: 打印数字个数
    // TODO 3: 用 match nums.first() 处理"第一个数字"
    // TODO 4: 用 if let nums.iter().max() 处理"最大数字"
}
`,
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i32> = input
        .split_whitespace()
        .filter_map(|w| w.parse().ok())
        .collect();

    println!("数字个数: {}", nums.len());

    match nums.first() {
        Some(v) => println!("第一个数字: {}", v),
        None => println!("第一个数字: 无"),
    }

    if let Some(m) = nums.iter().max() {
        println!("最大数字: {}", m);
    } else {
        println!("最大数字: 无");
    }
}
`,
    hints: [
      '淘金核心：`let nums: Vec<i32> = input.split_whitespace().filter_map(|w| w.parse().ok()).collect();` —— 解析失败自动跳过。',
      '第一个数字：`match nums.first() { Some(v) => ..., None => println!("第一个数字: 无") }`。first 返回 Option<&i32>，直接打印即可。',
      '最大数字：`if let Some(m) = nums.iter().max() { ... } else { ... }`。空 Vec 的 max 是 None，输出"无"。',
    ],
    tests: [
      { name: '样例：夹杂数字', stdin: 'abc 42 x7 99 hello\n', expected: '数字个数: 2\n第一个数字: 42\n最大数字: 99' },
      { name: '样例：无数字', stdin: 'no numbers here\n', expected: '数字个数: 0\n第一个数字: 无\n最大数字: 无' },
      { name: '隐藏：负数', stdin: '-5 0 -9\n', expected: '数字个数: 3\n第一个数字: -5\n最大数字: 0', hidden: true },
      { name: '隐藏：递增序列', stdin: '1 2 3\n', expected: '数字个数: 3\n第一个数字: 1\n最大数字: 3', hidden: true },
    ],
  },
  {
    id: 'rust-paradigm-9',
    lang: 'rust',
    module: 'paradigm',
    order: 9,
    title: 'Result 与 ? 运算符',
    difficulty: 3,
    xp: 30,
    goals: [
      '编写返回 Result<T, E> 的函数',
      '用 ? 与 map_err 实现错误自动上抛与转换',
      '用 match 在 main 中分流 Ok / Err',
    ],
    brief: `## Result 与 ? 运算符

\`Result<T, E>\` 是 Rust 的错误处理核心：

\`\`\`rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
\`\`\`

与 Option 的区别：\`Err\` 携带**失败原因**。

### ? 运算符：错误自动上抛

\`\`\`rust
fn parse_score(s: &str) -> Result<i32, String> {
    let n: i32 = s.parse().map_err(|_| format!("不是整数: {}", s))?;
    // ? ：Ok → 拆包继续执行；Err → 立刻 return Err(...)
    Ok(n)
}
\`\`\`

\`?\` 等价于"成功就拆包继续，失败就提前返回错误"，配合 \`map_err\` 还能顺手把错误转换成想要的类型。

### main 也能返回 Result

\`\`\`rust
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let n: i32 = "abc".parse()?; // 失败会让 main 返回 Err
    Ok(())
}
\`\`\`

第五章会学如何自定义错误类型。本关先把 \`?\` 用熟。`,
    task: `## 任务：成绩录入器

实现函数 \`fn parse_score(s: &str) -> Result<i32, String>\`：

1. \`s.parse()\` 失败 → 返回 \`Err("不是整数: <原字符串>")\`（用 map_err + ?）
2. 解析成功但不在 0..=100 → 返回 \`Err("超出范围: <数值>")\`
3. 否则返回 \`Ok(n)\`

main 中读入一行，用 match 分流：

- \`Ok(n)\` → \`成绩: <n> (<及格/不及格>)\`（n ≥ 60 及格）
- \`Err(e)\` → \`错误: <e>\`

**输入**：一行一个成绩字符串

### 示例

| 输入 | 输出 |
| --- | --- |
| \`85\` | \`成绩: 85 (及格)\` |
| \`abc\` | \`错误: 不是整数: abc\` |
| \`150\` | \`错误: 超出范围: 150\` |`,
    starter: `use std::io;

// TODO: 实现 parse_score（内部用 parse + map_err + ?，再做范围检查）

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let s = input.trim();

    // TODO: match parse_score(s) 分流输出
}
`,
    solution: `use std::io;

fn parse_score(s: &str) -> Result<i32, String> {
    let n: i32 = s
        .parse()
        .map_err(|_| format!("不是整数: {}", s))?;
    if (0..=100).contains(&n) {
        Ok(n)
    } else {
        Err(format!("超出范围: {}", n))
    }
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let s = input.trim();

    match parse_score(s) {
        Ok(n) => {
            let verdict = if n >= 60 { "及格" } else { "不及格" };
            println!("成绩: {} ({})", n, verdict);
        }
        Err(e) => println!("错误: {}", e),
    }
}
`,
    hints: [
      '解析一步到位：`let n: i32 = s.parse().map_err(|_| format!("不是整数: {}", s))?;` —— ? 把 Err 提前返回。',
      '范围检查：`(0..=100).contains(&n)` 成立返回 `Ok(n)`，否则 `Err(format!("超出范围: {}", n))`。',
      'main 分流：`match parse_score(s) { Ok(n) => ..., Err(e) => println!("错误: {}", e) }`。及格线 60（含）。',
    ],
    tests: [
      { name: '样例：85', stdin: '85\n', expected: '成绩: 85 (及格)' },
      { name: '样例：非数字', stdin: 'abc\n', expected: '错误: 不是整数: abc' },
      { name: '样例：超出上限', stdin: '150\n', expected: '错误: 超出范围: 150' },
      { name: '隐藏：临界及格', stdin: '59\n', expected: '成绩: 59 (不及格)', hidden: true },
      { name: '隐藏：负数', stdin: '-3\n', expected: '错误: 超出范围: -3', hidden: true },
      { name: '隐藏：满分', stdin: '100\n', expected: '成绩: 100 (及格)', hidden: true },
    ],
  },
  {
    id: 'rust-paradigm-10',
    lang: 'rust',
    module: 'paradigm',
    order: 10,
    title: '线程入门',
    difficulty: 3,
    xp: 30,
    goals: [
      '用 thread::spawn 启动子线程',
      '理解 move 闭包为何是跨线程必需',
      '用 join 等待线程并取回返回值',
    ],
    brief: `## 线程：无畏并发

\`\`\`rust
use std::thread;

let handle = thread::spawn(move || {
    // 在新线程里执行
    data.iter().sum::<i64>()
});

let result = handle.join().unwrap(); // 等待子线程结束并取回返回值
\`\`\`

- \`thread::spawn(闭包)\` 启动新线程；
- **\`move\` 强制闭包拿走数据所有权** —— 没有它，编译器不知道新线程能活多久、借用是否安全，直接报错（closure may outlive the current thread）；
- \`join()\` 返回 \`Result\`（线程 panic 时是 Err），unwrap 取回值。

Rust 的杀手锏：**数据竞争在编译期就被拒绝**。两个线程不能同时可写一份数据 —— 除非显式使用 \`Arc<Mutex>\`（第三章第 8 关）。`,
    task: `## 任务：主副线分工

读入一行四个整数 \`a b c d\`。

1. 把 \`c d\` 交给**子线程**求和（\`thread::spawn(move || ...)\`，数据要 move 进去）
2. 主线程同时求 \`a + b\`
3. \`join()\` 等子线程完工，取回结果

**输出**（三行，顺序固定）：

1. \`主线程和: <a+b>\`
2. \`子线程和: <c+d>\`
3. \`总和: <a+b+c+d>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`1 2 3 4\` | \`主线程和: 3\`<br>\`子线程和: 7\`<br>\`总和: 10\` |

注意：闭包 \`move\` 会拿走数据 —— 先把要留下的部分算好或复制出来，再 spawn。`,
    starter: `use std::io;
use std::thread;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: 把 c、d（或其副本）move 进子线程求和，拿到 handle
    // TODO 2: 主线程算 a + b
    // TODO 3: join 取回子线程结果，按固定顺序输出三行
}
`,
    solution: `use std::io;
use std::thread;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let back = vec![nums[2], nums[3]];
    let handle = thread::spawn(move || back.iter().sum::<i64>());

    let front_sum = nums[0] + nums[1];
    let back_sum = handle.join().unwrap();

    println!("主线程和: {}", front_sum);
    println!("子线程和: {}", back_sum);
    println!("总和: {}", front_sum + back_sum);
}
`,
    hints: [
      '先复制再移动：`let back = vec![nums[2], nums[3]];` 然后 `thread::spawn(move || back.iter().sum::<i64>())` —— move 把 back 拿走，nums 还留在主线程。',
      'join 返回 Result：`let back_sum = handle.join().unwrap();`。',
      '输出顺序固定：先算好 front_sum，join 之后按 主线程和 / 子线程和 / 总和 三行打印。',
    ],
    tests: [
      { name: '样例：1 2 3 4', stdin: '1 2 3 4\n', expected: '主线程和: 3\n子线程和: 7\n总和: 10' },
      { name: '样例：10 20 30 40', stdin: '10 20 30 40\n', expected: '主线程和: 30\n子线程和: 70\n总和: 100' },
      { name: '隐藏：正负抵消', stdin: '-5 5 8 -8\n', expected: '主线程和: 0\n子线程和: 0\n总和: 0', hidden: true },
      { name: '隐藏：全零', stdin: '0 0 0 0\n', expected: '主线程和: 0\n子线程和: 0\n总和: 0', hidden: true },
    ],
  },
];
