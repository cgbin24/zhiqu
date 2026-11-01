import type { Level } from '@/types';

/** Rust · 第一章：基础语法结构（8 关） */
export const RUST_BASIC: Level[] = [
  {
    id: 'rust-basic-1',
    lang: 'rust',
    module: 'basic',
    order: 1,
    title: '你好，无畏者',
    difficulty: 1,
    xp: 15,
    goals: [
      '理解 Rust 程序的基本结构：fn main 入口与语句',
      '学会用 println! 宏输出文本与 {} 占位符',
      '掌握标准输入读取套路：read_line + trim',
    ],
    brief: `## 你的第一个 Rust 程序

每个 Rust 程序从 \`main\` 函数开始。一个最小但完整的程序：

\`\`\`rust
fn main() {
    println!("Hello, World!");
}
\`\`\`

- **\`fn main()\`** —— 程序入口。\`fn\` 是 function 的缩写。
- **\`println!\`** —— 带 \`!\` 的叫**宏**（不是函数），在编译期展开。它打印参数并自动追加换行。
- **\`{}\` 占位符** —— \`println!("你好, {}!", name)\` 会把 \`name\` 的值填进 \`{}\`，支持多个：\`println!("{} + {} = {}", a, b, a + b)\`。

### 读输入的固定套路

本平台所有 Rust 关卡都用这一套读法（先背下来）：

\`\`\`rust
let mut input = String::new();
std::io::stdin().read_line(&mut input).unwrap();
let name = input.trim();
\`\`\`

三步拆解：

- \`String::new()\` 创建空字符串；\`read_line\` 需要**可变引用** \`&mut input\`，所以必须写 \`mut\`。
- \`read_line\` 返回 \`Result\`（读到的字节数），\`.unwrap()\` 表示"出错就直接崩溃"。
- 读入的字符串**末尾带换行符**，\`.trim()\` 去掉首尾空白 —— 忘了 trim 是新手第一大坑。

> 💡 写完代码点「运行」看效果，点「提交评测」接受测试点检验。`,
    task: `## 任务

从标准输入读取你的冒险者代号（一个不含空格的字符串），向它问好。

**输入**：一行一个字符串，如 \`Zhi\`

**输出**：一行，格式为 \`你好, <代号>! 欢迎来到智码世界。\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`Zhi\` | \`你好, Zhi! 欢迎来到智码世界。\` |
| \`Gopher\` | \`你好, Gopher! 欢迎来到智码世界。\` |

提示：用 \`{}\` 占位符拼接：\`println!("你好, {}! 欢迎来到智码世界。", name)\`。`,
    starter: `fn main() {
    // 套路：读一行输入并去掉末尾换行
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let name = input.trim();

    // TODO: 用 println! 和 {} 占位符输出问候语
}
`,
    solution: `fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let name = input.trim();
    println!("你好, {}! 欢迎来到智码世界。", name);
}
`,
    hints: [
      '读入套路固定三步：`String::new()` → `read_line(&mut input).unwrap()` → `input.trim()`。trim 返回去掉首尾空白的字符串切片。',
      'println! 是宏，名字带感叹号。`{}` 是占位符：`println!("你好, {}! 欢迎来到智码世界。", name)`。',
      '完整方案只要 4 行：读入、trim、`println!("你好, {}! 欢迎来到智码世界。", name)`。注意逗号后有空格、感叹号紧跟代号、句号是中文的。',
    ],
    tests: [
      { name: '样例 1：Zhi', stdin: 'Zhi\n', expected: '你好, Zhi! 欢迎来到智码世界。' },
      { name: '样例 2：Gopher', stdin: 'Gopher\n', expected: '你好, Gopher! 欢迎来到智码世界。' },
      { name: '隐藏：含数字代号', stdin: 'Coder99\n', expected: '你好, Coder99! 欢迎来到智码世界。', hidden: true },
      { name: '隐藏：单字符代号', stdin: 'Q\n', expected: '你好, Q! 欢迎来到智码世界。', hidden: true },
    ],
  },
  {
    id: 'rust-basic-2',
    lang: 'rust',
    module: 'basic',
    order: 2,
    title: '变量封印与遮蔽戏法',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解 Rust 变量默认不可变，mut 才可修改',
      '掌握遮蔽（shadowing）：let 重新声明顶替旧值',
      '学会 split_whitespace + parse 读取多个数',
    ],
    brief: `## 变量：默认不可变

Rust 变量默认**不可变**（immutable），这是它的招牌设计：

\`\`\`rust
let x = 5;
// x = 6;    // ❌ E0384：cannot assign twice to immutable variable
let mut y = 5;
y = 6;       // ✅ mut 声明后才可修改
\`\`\`

### 遮蔽（Shadowing）

用 \`let\` 可以**重新声明**同名变量，新值"遮住"旧值，连类型都能换：

\`\`\`rust
let spaces = "   ";        // &str
let spaces = spaces.len(); // ✅ 遮蔽：现在是 usize
\`\`\`

遮蔽不是 mut：它是创建**新变量**，常用于"转换后顶替旧值"。

### 本关要用的新套路：读多个数

\`\`\`rust
let mut parts = input.split_whitespace(); // 按空白切开
let a: i64 = parts.next().unwrap().parse().unwrap();
let b: i64 = parts.next().unwrap().parse().unwrap();
\`\`\`

\`split_whitespace\` 把一行按空格切成迭代器；\`parse()\` 把 \`&str\` 转成数字（返回 Result，类型要标注）。`,
    task: `## 任务：变量遮蔽交换戏法

读入两个整数 \`a\` 和 \`b\`，完成三步输出：

1. \`原始: a=?, b=?\`
2. 用**元组遮蔽**交换两个变量：\`let (a, b) = (b, a);\` 然后输出 \`交换后: a=?, b=?\`
3. 输出两者较大值 \`较大值: ?\`（可用 \`std::cmp::max(a, b)\`）

**输入**：一行两个整数 a b（用空格分隔）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 7\` | \`原始: a=3, b=7\`<br>\`交换后: a=7, b=3\`<br>\`较大值: 7\` |
| \`-5 12\` | \`原始: a=-5, b=12\`<br>\`交换后: a=12, b=-5\`<br>\`较大值: 12\` |

本题全程**不需要 mut** —— 靠遮蔽就能"交换"变量。`,
    starter: `fn main() {
    // read_line 需要可变引用，所以 input 必须声明为 mut
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let a: i64 = parts.next().unwrap().parse().unwrap();
    let b: i64 = parts.next().unwrap().parse().unwrap();

    // TODO 1: 打印 "原始: a=?, b=?"
    // TODO 2: 用元组遮蔽交换：let (a, b) = (b, a);
    // TODO 3: 打印 "交换后: a=?, b=?"
    // TODO 4: 打印 "较大值: ?"（std::cmp::max）
}
`,
    solution: `fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let a: i64 = parts.next().unwrap().parse().unwrap();
    let b: i64 = parts.next().unwrap().parse().unwrap();

    println!("原始: a={}, b={}", a, b);
    let (a, b) = (b, a);
    println!("交换后: a={}, b={}", a, b);
    println!("较大值: {}", std::cmp::max(a, b));
}
`,
    hints: [
      '读入：`let mut parts = input.split_whitespace();` 然后 `let a: i64 = parts.next().unwrap().parse().unwrap();`（b 同理）。类型标注不能少。',
      '元组遮蔽一行完成交换：`let (a, b) = (b, a);` —— 右边先求值，再绑定到新的 a、b 上。',
      '输出三行：`println!("原始: a={}, b={}", a, b);` / 遮蔽交换后 `println!("交换后: a={}, b={}", a, b);` / `println!("较大值: {}", std::cmp::max(a, b));`。',
    ],
    tests: [
      { name: '样例：3 7', stdin: '3 7\n', expected: '原始: a=3, b=7\n交换后: a=7, b=3\n较大值: 7' },
      { name: '样例：-5 12', stdin: '-5 12\n', expected: '原始: a=-5, b=12\n交换后: a=12, b=-5\n较大值: 12' },
      { name: '隐藏：相等值', stdin: '42 42\n', expected: '原始: a=42, b=42\n交换后: a=42, b=42\n较大值: 42', hidden: true },
      { name: '隐藏：零值', stdin: '0 9\n', expected: '原始: a=0, b=9\n交换后: a=9, b=0\n较大值: 9', hidden: true },
    ],
  },
  {
    id: 'rust-basic-3',
    lang: 'rust',
    module: 'basic',
    order: 3,
    title: '类型变形记',
    difficulty: 2,
    xp: 25,
    goals: [
      '认识 Rust 基础类型：i32/i64、f64、bool、char',
      '掌握 as 显式转换及其截断语义',
      '掌握 parse：字符串到数字的桥梁',
    ],
    brief: `## Rust 的基础类型与转换

| 类型 | 用途 | 示例 |
| --- | --- | --- |
| \`i32\` / \`i64\` | 有符号整数 | \`42\` |
| \`f64\` | 浮点数（默认） | \`3.14\` |
| \`bool\` | 真假值 | \`true\` |
| \`char\` | 单个 Unicode 字符 | \`'A'\` |

数字字面量不写后缀时，编译器按使用场景推断类型（推断不出就默认 \`i32\` / \`f64\`）。

### as 转换：明确、可能截断

Rust **不做隐式转换**，窄化/互转用 \`as\`：

\`\`\`rust
let n: i32 = 65;
let x = n as f64;        // 65.0
let c = n as u8 as char; // 'A'（数字转字符）
\`\`\`

\`as\` 是按位重新解释：大转小会截断，浮点转整数为向零截断。

### parse：字符串 → 数字

输入读到的都是字符串，转数字靠 \`parse\`（返回 Result，用 unwrap）：

\`\`\`rust
let n: i32 = input.trim().parse().unwrap();
\`\`\``,
    task: `## 任务：三重变形

读入一个整数 \`n\`（33 ≤ n ≤ 126，保证在可打印 ASCII 范围内），输出侦探报告（共三行）：

1. \`数值: <n>\`
2. \`一半: <n/2 的浮点结果，保留 1 位小数>\` —— 用 \`n as f64 / 2.0\`
3. \`符号: <n 对应的 ASCII 字符>\` —— 用 \`n as u8 as char\`

**输入**：一行一个整数 n

### 示例

| 输入 | 输出 |
| --- | --- |
| \`65\` | \`数值: 65\`<br>\`一半: 32.5\`<br>\`符号: A\` |
| \`126\` | \`数值: 126\`<br>\`一半: 63.0\`<br>\`符号: ~\` |

注意用 \`{:.1}\` 才会把 63 显示成 \`63.0\`。`,
    starter: `fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();

    // TODO 1: 用 parse 把 input 转成 i32
    // TODO 2: 打印 "数值: ?"
    // TODO 3: 用 as 转 f64 除以 2.0，{:.1} 打印 "一半: ?"
    // TODO 4: 用 as u8 as char 打印 "符号: ?"
}
`,
    solution: `fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let n: i32 = input.trim().parse().unwrap();

    println!("数值: {}", n);
    println!("一半: {:.1}", n as f64 / 2.0);
    println!("符号: {}", n as u8 as char);
}
`,
    hints: [
      '读入并解析：`let n: i32 = input.trim().parse().unwrap();`。parse 需要类型标注才知道转成什么。',
      '一半：`println!("一半: {:.1}", n as f64 / 2.0);` —— 先 as f64 再除，否则整数除法会截断成 32。',
      '符号：`println!("符号: {}", n as u8 as char);`。三行合起来：数值用 `{}` 直接打印。',
    ],
    tests: [
      { name: '样例：65', stdin: '65\n', expected: '数值: 65\n一半: 32.5\n符号: A' },
      { name: '样例：126', stdin: '126\n', expected: '数值: 126\n一半: 63.0\n符号: ~' },
      { name: '隐藏：33', stdin: '33\n', expected: '数值: 33\n一半: 16.5\n符号: !', hidden: true },
      { name: '隐藏：48', stdin: '48\n', expected: '数值: 48\n一半: 24.0\n符号: 0', hidden: true },
    ],
  },
  {
    id: 'rust-basic-4',
    lang: 'rust',
    module: 'basic',
    order: 4,
    title: '整除炼金术',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握算术运算符 + - * / %',
      '理解整数除法向零截断与余数符号规则',
      '了解 debug/release 下的溢出行为差异',
    ],
    brief: `## 运算符与整除

\`+ - * / %\` 与数学直觉基本一致，但**整数除法向零截断**：

\`\`\`rust
println!("{}", 17 / 5);  // 3（不是 3.4）
println!("{}", 17 % 5);  // 2
println!("{}", -17 / 5); // -3（向零截断，不是向下取整）
println!("{}", -17 % 5); // -2（余数符号跟被除数一致）
\`\`\`

### 溢出行为

\`i32::MAX + 1\` 在 **debug 编译下会 panic**（attempt to add with overflow），release 下则回绕成负数。本平台按 debug 语义运行，数据大时记得换 \`i64\`。

### 一个经典坑

想得到小数却写了两个整数相除：\`7 / 2\` 是 \`3\`，\`(7 as f64) / 2.0\` 才是 \`3.5\`。整数 op 整数 = 整数，这是 Rust 的铁律。`,
    task: `## 任务：四则炼金报告

读入两个整数 \`a\` 和 \`b\`（\`b ≠ 0\`，绝对值 ≤ 10⁹，建议用 \`i64\` 防溢出），输出四行：

1. \`和: <a+b>\`
2. \`积: <a*b>\`
3. \`商: <a/b 整除>\` —— 注意负数是向零截断
4. \`余: <a%b>\` —— 余数符号跟被除数

**输入**：一行两个整数 a b

### 示例

| 输入 | 输出 |
| --- | --- |
| \`17 5\` | \`和: 22\`<br>\`积: 85\`<br>\`商: 3\`<br>\`余: 2\` |
| \`-17 5\` | \`和: -12\`<br>\`积: -85\`<br>\`商: -3\`<br>\`余: -2\` |`,
    starter: `fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();

    // TODO 1: 用 split_whitespace + parse 读入 a、b（i64）
    // TODO 2: 依次打印 和 / 积 / 商 / 余 四行
}
`,
    solution: `fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let a = nums[0];
    let b = nums[1];

    println!("和: {}", a + b);
    println!("积: {}", a * b);
    println!("商: {}", a / b);
    println!("余: {}", a % b);
}
`,
    hints: [
      '读入套路：`let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();` 然后 `nums[0]`、`nums[1]`。',
      '四行输出：`println!("和: {}", a + b);` 依次类推，商是 `a / b`，余是 `a % b`。',
      '验证截断方向：-17/5 = -3（向零），-17%5 = -2（跟被除数同号）；7/-2 = -3，7%-2 = 1。',
    ],
    tests: [
      { name: '样例：17 5', stdin: '17 5\n', expected: '和: 22\n积: 85\n商: 3\n余: 2' },
      { name: '样例：-17 5', stdin: '-17 5\n', expected: '和: -12\n积: -85\n商: -3\n余: -2' },
      { name: '隐藏：7 -2', stdin: '7 -2\n', expected: '和: 5\n积: -14\n商: -3\n余: 1', hidden: true },
      { name: '隐藏：0 5', stdin: '0 5\n', expected: '和: 5\n积: 0\n商: 0\n余: 0', hidden: true },
    ],
  },
  {
    id: 'rust-basic-5',
    lang: 'rust',
    module: 'basic',
    order: 5,
    title: 'if 是表达式',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握 if / else if / else 分支结构',
      '理解 if 是表达式：分支值必须同类型',
      '养成"先 let 再打印"的表达式风格',
    ],
    brief: `## if 是表达式

Rust 的 if 与其他语言最大的不同：**它是表达式，有值**！

\`\`\`rust
let grade = if score >= 90 { "优" } else { "良" };
\`\`\`

规矩：

- 各分支块的**最后一个表达式**（不带分号）就是分支的值；
- 各分支类型必须一致（上面都是 \`&str\`）；
- 条件**不加括号**，加了反而会被 clippy 提醒；
- if / else if / else 链从上往下短路匹配，else 兜底。

\`\`\`rust
let sign = if n > 0 {
    "正数"
} else if n == 0 {
    "零"
} else {
    "负数"
};
\`\`\`

因为 if 有值，C 风格的三目运算符 \`cond ? a : b\` 在 Rust 里都写成 if 表达式 —— Rust 没有三目运算符。`,
    task: `## 任务：数字体检中心

读入一个整数 \`n\`（绝对值 ≤ 10⁹），用 **if 表达式**给数字做三项体检：

1. \`奇偶: 奇数/偶数\`
2. \`符号: 正数/零/负数\`
3. \`绝对值: <|n|>\`

**输入**：一行一个整数 n

### 示例

| 输入 | 输出 |
| --- | --- |
| \`-17\` | \`奇偶: 奇数\`<br>\`符号: 负数\`<br>\`绝对值: 17\` |
| \`0\` | \`奇偶: 偶数\`<br>\`符号: 零\`<br>\`绝对值: 0\` |

三行都要求把 if 表达式的结果先 \`let\` 给变量，再统一 \`println!\`。`,
    starter: `fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let n: i64 = input.trim().parse().unwrap();

    // TODO 1: 用 if 表达式得到奇偶
    // TODO 2: 用 if / else if / else 表达式得到符号
    // TODO 3: 用 if 表达式得到绝对值
    // TODO 4: 依次打印三行
}
`,
    solution: `fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let n: i64 = input.trim().parse().unwrap();

    let parity = if n % 2 == 0 { "偶数" } else { "奇数" };
    let sign = if n > 0 { "正数" } else if n == 0 { "零" } else { "负数" };
    let abs = if n < 0 { -n } else { n };

    println!("奇偶: {}", parity);
    println!("符号: {}", sign);
    println!("绝对值: {}", abs);
}
`,
    hints: [
      '`let parity = if n % 2 == 0 { "偶数" } else { "奇数" };` —— 分支最后不带分号，才有值。',
      '符号要三分支：`if n > 0 { "正数" } else if n == 0 { "零" } else { "负数" }`。',
      '绝对值：`let abs = if n < 0 { -n } else { n };`。最后三行 println 顺序：奇偶、符号、绝对值。',
    ],
    tests: [
      { name: '样例：-17', stdin: '-17\n', expected: '奇偶: 奇数\n符号: 负数\n绝对值: 17' },
      { name: '样例：0', stdin: '0\n', expected: '奇偶: 偶数\n符号: 零\n绝对值: 0' },
      { name: '隐藏：42', stdin: '42\n', expected: '奇偶: 偶数\n符号: 正数\n绝对值: 42', hidden: true },
      { name: '隐藏：7', stdin: '7\n', expected: '奇偶: 奇数\n符号: 正数\n绝对值: 7', hidden: true },
    ],
  },
  {
    id: 'rust-basic-6',
    lang: 'rust',
    module: 'basic',
    order: 6,
    title: '三重循环回廊',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握 for + 范围（1..=n 含端点）',
      '掌握 while 条件循环与数字反转套路',
      '掌握 loop 无限循环与 break 带值',
    ],
    brief: `## Rust 的三种循环

\`\`\`rust
// 1. for + 范围：1..=5 含 5，1..5 不含
for i in 1..=100 {
    sum += i;
}

// 2. while：条件循环
while n > 0 {
    n /= 10;
}

// 3. loop：无限循环，break 可以带出返回值！
let found = loop {
    k += 1;
    if k * k > n {
        break k; // loop 表达式的值
    }
};
\`\`\`

**\`loop + break 值\`** 是 Rust 独有的优雅设计：整个 loop 是表达式，\`break x\` 决定它的值，适合"不断尝试直到找到"的场景。

### 数字反转套路

\`\`\`rust
rev = rev * 10 + n % 10;
n /= 10;
\`\`\`

while 循环到 n 为 0 为止。注意 10 反转后前导零消失，得 1。`,
    task: `## 任务：循环回廊三试

读入一个整数 \`n\`（2 ≤ n ≤ 1000），依次完成三试：

1. \`1 到 n 的和: <S>\` —— 用 \`for i in 1..=n\`
2. \`反转数: <n 的数字反转>\` —— 用 \`while\`（如 123 → 321，10 → 1）
3. \`平方突破: <最小正整数 k 使 k² > n>\` —— 用 \`loop + break k\`

**输入**：一行一个整数 n

### 示例

| 输入 | 输出 |
| --- | --- |
| \`10\` | \`1 到 n 的和: 55\`<br>\`反转数: 1\`<br>\`平方突破: 4\` |
| \`123\` | \`1 到 n 的和: 7626\`<br>\`反转数: 321\`<br>\`平方突破: 12\` |

三试分别对应三种循环形态，请按指定方式实现。`,
    starter: `fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let n: i64 = input.trim().parse().unwrap();

    // TODO 1: for 循环求 1..=n 的和
    // TODO 2: while 循环做数字反转
    // TODO 3: loop + break 求最小 k 使 k*k > n
}
`,
    solution: `fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let n: i64 = input.trim().parse().unwrap();

    let mut sum = 0i64;
    for i in 1..=n {
        sum += i;
    }

    let mut m = n;
    let mut rev = 0i64;
    while m > 0 {
        rev = rev * 10 + m % 10;
        m /= 10;
    }

    let mut k = 1i64;
    let breaker = loop {
        if k * k > n {
            break k;
        }
        k += 1;
    };

    println!("1 到 n 的和: {}", sum);
    println!("反转数: {}", rev);
    println!("平方突破: {}", breaker);
}
`,
    hints: [
      '求和：`let mut sum = 0i64; for i in 1..=n { sum += i; }`。',
      '反转：`let (mut m, mut rev) = (n, 0i64); while m > 0 { rev = rev * 10 + m % 10; m /= 10; }`。',
      '平方突破：`let mut k = 1i64; let breaker = loop { if k * k > n { break k; } k += 1; };`。注意 12² = 144 > 123 而 11² = 121 ≤ 123，所以 123 的答案是 12。',
    ],
    tests: [
      { name: '样例：10', stdin: '10\n', expected: '1 到 n 的和: 55\n反转数: 1\n平方突破: 4' },
      { name: '样例：123', stdin: '123\n', expected: '1 到 n 的和: 7626\n反转数: 321\n平方突破: 12' },
      { name: '隐藏：2', stdin: '2\n', expected: '1 到 n 的和: 3\n反转数: 2\n平方突破: 2', hidden: true },
      { name: '隐藏：1000', stdin: '1000\n', expected: '1 到 n 的和: 500500\n反转数: 1\n平方突破: 32', hidden: true },
    ],
  },
  {
    id: 'rust-basic-7',
    lang: 'rust',
    module: 'basic',
    order: 7,
    title: '函数锻造炉',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握函数声明：参数类型必须标注',
      '理解表达式返回：最后不带分号即返回值',
      '用元组实现多值返回并解构接收',
    ],
    brief: `## 函数：类型必须写明

\`\`\`rust
fn add(a: i64, b: i64) -> i64 {
    a + b // 表达式返回：没有分号、没有 return
}
\`\`\`

三条铁律：

- **参数类型必须标注**（编译器无法从用法反推参数类型）；
- 返回值用 \`-> 类型\` 声明；函数体最后**不带分号的表达式**就是返回值，写 \`return\` 反而不地道；
- 需要提前返回时才用 \`return x;\`。

### 多值返回：元组

\`\`\`rust
fn divmod(a: i64, b: i64) -> (i64, i64) {
    (a / b, a % b)
}

let (q, r) = divmod(17, 5); // 解构接收：q=3, r=2
\`\`\`

> 💡 Rust 没有 Go 那种 \`(value, err)\` 惯例 —— 错误处理走 \`Result\`（第二章第 9 关见）。`,
    task: `## 任务：锻造三件工具

在 main 外定义**三个函数**（评测会检查你确实使用了函数而不是把逻辑全塞 main 里）：

1. \`fn add(a: i64, b: i64) -> i64\` —— 返回和
2. \`fn max3(a: i64, b: i64, c: i64) -> i64\` —— 返回三者最大值
3. \`fn divmod(a: i64, b: i64) -> (i64, i64)\` —— 返回 (商, 余) 元组

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
    starter: `// TODO 1: 定义 add 函数（表达式返回）



// TODO 2: 定义 max3 函数



// TODO 3: 定义 divmod 函数（返回元组）

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 4: 调用三个函数，输出四行结果
}
`,
    solution: `fn add(a: i64, b: i64) -> i64 {
    a + b
}

fn max3(a: i64, b: i64, c: i64) -> i64 {
    let mut m = a;
    if b > m {
        m = b;
    }
    if c > m {
        m = c;
    }
    m
}

fn divmod(a: i64, b: i64) -> (i64, i64) {
    (a / b, a % b)
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let a = nums[0];
    let b = nums[1];
    let c = nums[2];
    let d = nums[3];

    println!("{}+{} = {}", a, b, add(a, b));
    println!("max({},{},{}) = {}", a, b, c, max3(a, b, c));
    let (q1, r1) = divmod(a, b);
    println!("{}÷{} = 商{} 余{}", a, b, q1, r1);
    let (q2, r2) = divmod(c, d);
    println!("{}÷{} = 商{} 余{}", c, d, q2, r2);
}
`,
    hints: [
      'max3 写法：`let mut m = a; if b > m { m = b; } if c > m { m = c; } m`（最后的 m 不带分号，即返回值）。',
      'divmod 一行：`(a / b, a % b)`。调用时解构：`let (q, r) = divmod(a, b);`。',
      '输出注意 ÷ 和空格：`println!("{}÷{} = 商{} 余{}", a, b, q, r);`。四行按示例顺序排好。',
    ],
    tests: [
      { name: '样例：17 5 9 2', stdin: '17 5 9 2\n', expected: '17+5 = 22\nmax(17,5,9) = 17\n17÷5 = 商3 余2\n9÷2 = 商4 余1' },
      { name: '样例：含负数与零商', stdin: '-1 2 3 4\n', expected: '-1+2 = 1\nmax(-1,2,3) = 3\n-1÷2 = 商0 余-1\n3÷4 = 商0 余3' },
      { name: '隐藏：负数参与', stdin: '-7 3 -1 4\n', expected: '-7+3 = -4\nmax(-7,3,-1) = 3\n-7÷3 = 商-2 余-1\n-1÷4 = 商0 余-1', hidden: true },
      { name: '隐藏：全等值', stdin: '6 6 6 6\n', expected: '6+6 = 12\nmax(6,6,6) = 6\n6÷6 = 商1 余0\n6÷6 = 商1 余0', hidden: true },
    ],
  },
  {
    id: 'rust-basic-8',
    lang: 'rust',
    module: 'basic',
    order: 8,
    title: '字符串的双面性',
    difficulty: 2,
    xp: 25,
    goals: [
      '区分 &str 与 String 两种字符串',
      '理解 len()（字节）与 chars().count()（字符）的差异',
      '用迭代器链 chars().rev().collect() 反转字符串',
    ],
    brief: `## 字符串的双面性：&str vs String

Rust 有两种字符串：

- **\`String\`** —— 堆上分配、可增长、有所有权（\`String::new()\`、\`"x".to_string()\`）。
- **\`&str\`** —— 字符串切片，"借来的一段 UTF-8 文本"（字面量 \`"hi"\` 就是 \`&str\`）。

输入套路里 \`input\` 是 \`String\`，\`input.trim()\` 返回 \`&str\` —— 函数参数尽量收 \`&str\`（第五章细讲）。

### 字节 vs 字符

\`&str\` 本质是 **UTF-8 字节序列**：

\`\`\`rust
let s = "你好Go";
s.len();           // 8 ！（汉字各 3 字节）
s.chars().count(); // 4（4 个字符）
\`\`\`

一个汉字在 UTF-8 里通常占 3 字节。\`len()\` 数**字节**，\`chars()\` 迭代**字符**。

### 反转字符串

\`\`\`rust
let rev: String = s.chars().rev().collect();
\`\`\`

\`chars()\` → 迭代器 → \`rev()\` 反转 → \`collect()\` 收集成 String。迭代器链是 Rust 的灵魂（第二章细讲）。`,
    task: `## 任务：解码报告

读入一个字符串 s（可能含中文、字母、数字，长度 1~100 字节，不含空格），输出侦探报告（共三行）：

1. \`字节: <s.len()>\`
2. \`字符: <s.chars().count()>\`
3. \`反转: <按字符反转后的 s>\`

**输入**：一行一个字符串

### 示例

| 输入 | 输出 |
| --- | --- |
| \`你好Go\` | \`字节: 8\`<br>\`字符: 4\`<br>\`反转: oG好你\` |
| \`abc123\` | \`字节: 6\`<br>\`字符: 6\`<br>\`反转: 321cba\` |`,
    starter: `fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let s = input.trim();

    // TODO 1: 打印字节数
    // TODO 2: 打印字符数
    // TODO 3: 用迭代器链反转并打印
}
`,
    solution: `fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let s = input.trim();

    println!("字节: {}", s.len());
    println!("字符: {}", s.chars().count());
    let reversed: String = s.chars().rev().collect();
    println!("反转: {}", reversed);
}
`,
    hints: [
      'trim 后的 s 是 &str，`s.len()` 是字节数，`s.chars().count()` 是字符数。',
      '反转一行：`let reversed: String = s.chars().rev().collect();` —— 类型标注帮助 collect 知道收成什么。',
      '纯 ASCII 时字节 == 字符；含中文时字节数约是字符数的 3 倍。检查"你好Go"：8 字节、4 字符。',
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
