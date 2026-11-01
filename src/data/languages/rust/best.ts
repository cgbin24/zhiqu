import type { Level } from '@/types';

/** Rust · 第五章：行业最佳实践（5 关） */
export const RUST_BEST: Level[] = [
  {
    id: 'rust-best-1',
    lang: 'rust',
    module: 'best',
    order: 1,
    title: '错误处理规范',
    difficulty: 3,
    xp: 30,
    goals: [
      '手写自定义 Error 枚举',
      '实现 Display 与 From<ParseIntError>',
      '用 ok_or + ? 串联出干净的错误链',
    ],
    brief: `## 错误处理规范：自定义 Error

库代码的错误处理标准姿势：**一个错误枚举 + Display + From**：

\`\`\`rust
use std::fmt;
use std::num::ParseIntError;

#[derive(Debug)]
enum ConfigError {
    MissingEquals,
    BadPort(ParseIntError),
    OutOfRange(i32),
}

impl fmt::Display for ConfigError {   // 人类可读的错误描述
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ConfigError::MissingEquals => write!(f, "缺少等号"),
            ConfigError::BadPort(e) => write!(f, "端口不是数字: {}", e),
            ConfigError::OutOfRange(p) => write!(f, "端口越界: {}", p),
        }
    }
}

impl From<ParseIntError> for ConfigError { // 让 ? 自动转换错误类型
    fn from(e: ParseIntError) -> Self {
        ConfigError::BadPort(e)
    }
}
\`\`\`

之后业务函数一路 \`?\`：

\`\`\`rust
fn parse_config(line: &str) -> Result<i32, ConfigError> {
    let (_k, v) = line.split_once('=').ok_or(ConfigError::MissingEquals)?;
    let port: i32 = v.parse()?; // From 自动把 ParseIntError 变 ConfigError
    if !(1..=65535).contains(&port) {
        return Err(ConfigError::OutOfRange(port));
    }
    Ok(port)
}
\`\`\`

> 💡 实际项目用 \`thiserror\` 派生宏少写样板；本关只用 std 手写，理解原理。`,
    task: `## 任务：配置端口解析器

按上面的规范完整实现（\`ConfigError\` 枚举 + Display + From），函数 \`parse_config(line: &str) -> Result<i32, ConfigError>\`：

1. 行内没有 \`=\` → \`Err(MissingEquals)\`，Display 输出 \`缺少等号\`
2. 值解析失败（如 \`abc\`）→ 经 From 转成 \`BadPort\`，Display 输出 \`端口不是数字: invalid digit found in string\`
3. 端口不在 1..=65535 → \`Err(OutOfRange(p))\`，Display 输出 \`端口越界: <p>\`
4. 成功 → \`Ok(port)\`

main 读入一行，Ok 打印 \`端口: <p>\`，Err 打印 \`错误: <e>\`。

**输入**：一行 \`key=value\` 格式

### 示例

| 输入 | 输出 |
| --- | --- |
| \`port=8080\` | \`端口: 8080\` |
| \`port=abc\` | \`错误: 端口不是数字: invalid digit found in string\` |
| \`port=70000\` | \`错误: 端口越界: 70000\` |`,
    starter: `use std::fmt;
use std::io;
use std::num::ParseIntError;

// TODO 1: 定义 #[derive(Debug)] enum ConfigError { MissingEquals, BadPort(ParseIntError), OutOfRange(i32) }

// TODO 2: 实现 fmt::Display（三种错误的描述见任务）

// TODO 3: 实现 From<ParseIntError> for ConfigError

// TODO 4: 实现 parse_config（split_once + ok_or + ? + 范围检查）

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let line = input.trim();

    // TODO 5: match parse_config(line) 输出结果
}
`,
    solution: `use std::fmt;
use std::io;
use std::num::ParseIntError;

#[derive(Debug)]
enum ConfigError {
    MissingEquals,
    BadPort(ParseIntError),
    OutOfRange(i32),
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ConfigError::MissingEquals => write!(f, "缺少等号"),
            ConfigError::BadPort(e) => write!(f, "端口不是数字: {}", e),
            ConfigError::OutOfRange(p) => write!(f, "端口越界: {}", p),
        }
    }
}

impl From<ParseIntError> for ConfigError {
    fn from(e: ParseIntError) -> Self {
        ConfigError::BadPort(e)
    }
}

fn parse_config(line: &str) -> Result<i32, ConfigError> {
    let (_key, value) = line.split_once('=').ok_or(ConfigError::MissingEquals)?;
    let port: i32 = value.parse()?;
    if !(1..=65535).contains(&port) {
        return Err(ConfigError::OutOfRange(port));
    }
    Ok(port)
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let line = input.trim();

    match parse_config(line) {
        Ok(p) => println!("端口: {}", p),
        Err(e) => println!("错误: {}", e),
    }
}
`,
    hints: [
      'Display 用 write! 宏：`ConfigError::BadPort(e) => write!(f, "端口不是数字: {}", e)`。三种错误文案：缺少等号 / 端口不是数字: {} / 端口越界: {}。',
      'parse_config 三步：`line.split_once(\'=\').ok_or(ConfigError::MissingEquals)?` → `value.parse()?`（From 自动转换）→ 范围检查 `!(1..=65535).contains(&port)`。',
      'main 分流：Ok(p) 打印 `端口: {}`，Err(e) 打印 `错误: {}`（Display 自动生效）。注意 "abc" 的标准错误文案是 invalid digit found in string。',
    ],
    tests: [
      { name: '样例：合法端口', stdin: 'port=8080\n', expected: '端口: 8080' },
      { name: '样例：非数字', stdin: 'port=abc\n', expected: '错误: 端口不是数字: invalid digit found in string' },
      { name: '隐藏：越界', stdin: 'port=70000\n', expected: '错误: 端口越界: 70000', hidden: true },
      { name: '隐藏：缺少等号', stdin: 'noequals\n', expected: '错误: 缺少等号', hidden: true },
      { name: '隐藏：负端口', stdin: 'port=-5\n', expected: '错误: 端口越界: -5', hidden: true },
      { name: '隐藏：最小端口', stdin: 'port=1\n', expected: '端口: 1', hidden: true },
    ],
  },
  {
    id: 'rust-best-2',
    lang: 'rust',
    module: 'best',
    order: 2,
    title: '命名规范',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握 snake_case / CamelCase / SCREAMING_SNAKE 的适用对象',
      '遵循 getter 不加 get_ 前缀等语义惯例',
      '用 is_ 前缀命名布尔方法',
    ],
    brief: `## 命名规范：Rust 风格指南

| 对象 | 风格 | 示例 |
| --- | --- | --- |
| 变量 / 函数 / 模块 | snake_case | \`max_score\`、\`parse_config\` |
| 类型 / trait / 枚举变体 | CamelCase（大驼峰） | \`UserAccount\`、\`ParseIntError\` |
| 常量 / 静态量 | SCREAMING_SNAKE | \`MAX_LEVEL\`、\`DEFAULT_PORT\` |

语义惯例比大小写更重要：

- **getter 不加 \`get_\` 前缀**：\`fn user_name(&self)\` 而不是 \`fn get_user_name\`（与 Java/Go 惯例不同）；
- 布尔方法用 \`is_\` / \`has_\` 前缀：\`is_empty()\`、\`is_elite()\`；
- 类型转换：\`as_\`（免费）、\`to_\`（有成本）、\`into_\`（消耗所有权）；
- 构造器叫 \`new\`，不加冠词：\`UserAccount::new(...)\`。

clippy 会检查命名，风格统一是协作的起点。`,
    task: `## 任务：给账户建模

按规范命名，定义 \`UserAccount\`：

1. 字段：\`user_name: String\`、\`max_score: i64\`
2. 关联函数 \`fn new(user_name: &str, max_score: i64) -> Self\`
3. getter：\`fn user_name(&self) -> &str\`（**不加 get_ 前缀**）、\`fn max_score(&self) -> i64\`
4. 布尔方法 \`fn is_elite(&self) -> bool\`（分数 ≥ 90 为精英）
5. 顶部定义常量 \`const MAX_LEVEL: i64 = 99;\`

main 读入 \`名字 分数\`（名字不含空格），构造账户并输出。

**输出**（四行）：

1. \`账号: <user_name()>\`
2. \`分数: <max_score()>\`
3. \`精英: <is_elite()>\`
4. \`上限等级: <MAX_LEVEL>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`Alice 95\` | \`账号: Alice\`<br>\`分数: 95\`<br>\`精英: true\`<br>\`上限等级: 99\` |
| \`bob 90\` | \`账号: bob\`<br>\`分数: 90\`<br>\`精英: true\`<br>\`上限等级: 99\` |`,
    starter: `// TODO: 定义常量 MAX_LEVEL = 99

// TODO: 定义 UserAccount 结构体与 impl（注意各方法的规范命名）

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let name = parts.next().unwrap();
    let score: i64 = parts.next().unwrap().parse().unwrap();

    // TODO: 构造账户并输出四行
}
`,
    solution: `const MAX_LEVEL: i64 = 99;

struct UserAccount {
    user_name: String,
    max_score: i64,
}

impl UserAccount {
    fn new(user_name: &str, max_score: i64) -> Self {
        UserAccount {
            user_name: user_name.to_string(),
            max_score,
        }
    }

    fn user_name(&self) -> &str {
        &self.user_name
    }

    fn max_score(&self) -> i64 {
        self.max_score
    }

    fn is_elite(&self) -> bool {
        self.max_score >= 90
    }
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let name = parts.next().unwrap();
    let score: i64 = parts.next().unwrap().parse().unwrap();

    let account = UserAccount::new(name, score);
    println!("账号: {}", account.user_name());
    println!("分数: {}", account.max_score());
    println!("精英: {}", account.is_elite());
    println!("上限等级: {}", MAX_LEVEL);
}
`,
    hints: [
      '常量在类型外定义：`const MAX_LEVEL: i64 = 99;`（SCREAMING_SNAKE）。字段、方法全 snake_case，类型名 CamelCase。',
      'getter 直接用字段名：`fn user_name(&self) -> &str { &self.user_name }` —— Rust 惯例没有 get_ 前缀。布尔方法 is_elite 判断 >= 90。',
      'new 里用 to_string 把 &str 变 String 存进结构体：`UserAccount { user_name: user_name.to_string(), max_score }`（同名字段可简写）。',
    ],
    tests: [
      { name: '样例：Alice 95', stdin: 'Alice 95\n', expected: '账号: Alice\n分数: 95\n精英: true\n上限等级: 99' },
      { name: '样例：临界 90', stdin: 'bob 90\n', expected: '账号: bob\n分数: 90\n精英: true\n上限等级: 99' },
      { name: '隐藏：差一分', stdin: 'Cara 89\n', expected: '账号: Cara\n分数: 89\n精英: false\n上限等级: 99', hidden: true },
      { name: '隐藏：零分', stdin: 'Dan 0\n', expected: '账号: Dan\n分数: 0\n精英: false\n上限等级: 99', hidden: true },
    ],
  },
  {
    id: 'rust-best-3',
    lang: 'rust',
    module: 'best',
    order: 3,
    title: '文档注释与测试思想',
    difficulty: 3,
    xp: 30,
    goals: [
      '用 /// 编写文档注释（含示例区）',
      '建立"手写测试表"的单元测试思想',
      '用 assert_eq! 逐条核对表内用例',
    ],
    brief: `## 文档注释与测试思想

### /// 文档注释

\`\`\`rust
/// 把数字变成 FizzBuzz 字符串。
///
/// # 示例
/// \`\`\`
/// assert_eq!(fizzbuzz(15), "FizzBuzz");
/// \`\`\`
fn fizzbuzz(n: u32) -> String { ... }
\`\`\`

\`///\` 写在被注释项上方，支持 Markdown；\`cargo doc\` 生成文档；注释里的代码块还会被 \`cargo test\` 当作**文档测试**执行 —— 文档永远不过期。

### 单元测试表格化思想

好测试 = **一张手写的 (输入, 期望) 对照表**：

\`\`\`rust
let cases: [(u32, &str); 5] = [
    (1, "1"),
    (3, "Fizz"),
    (5, "Buzz"),
    (15, "FizzBuzz"),
    (7, "7"),
];

for (input, want) in &cases {
    assert_eq!(fizzbuzz(*input), *want, "fizzbuzz({})", input);
}
\`\`\`

对照表一眼看出覆盖了哪些边界：最小数、3 的倍数、5 的倍数、公倍数、普通数。\`cargo test\` 里对应 \`#[test]\` 函数；本关在 main 里手跑同一张表。`,
    task: `## 任务：FizzBuzz 测试台

1. 实现 \`fn fizzbuzz(n: u32) -> String\`（3 的倍数 Fizz，5 的倍数 Buzz，15 的倍数 FizzBuzz，其余为数字本身），函数上方写 \`///\` 文档注释
2. 在 main 中定义**测试表** \`[(u32, &str); 5]\`：\`(1, "1")\`、\`(3, "Fizz")\`、\`(5, "Buzz")\`、\`(15, "FizzBuzz")\`、\`(7, "7")\`
3. 遍历测试表：逐条 \`assert_eq!\` 校验，通过的打印 \`<输入> -> <输出>\`
4. 读入一个整数 n，打印 \`输入 <n> -> <fizzbuzz(n)>\`，最后打印 \`测试: 5/5 通过\`

**输入**：一行一个整数 n（1 ≤ n ≤ 100）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`9\` | \`1 -> 1\`<br>\`3 -> Fizz\`<br>\`5 -> Buzz\`<br>\`15 -> FizzBuzz\`<br>\`7 -> 7\`<br>\`输入 9 -> Fizz\`<br>\`测试: 5/5 通过\` |`,
    starter: `/// TODO: 给 fizzbuzz 写文档注释
// TODO: 实现 fizzbuzz(n: u32) -> String

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let n: u32 = input.trim().parse().unwrap();

    // TODO 1: 定义 5 组 (输入, 期望) 测试表
    // TODO 2: 遍历测试表 assert_eq! 并打印结果行
    // TODO 3: 打印输入行与统计行
}
`,
    solution: `/// 把数字变成 FizzBuzz 字符串。
///
/// 规则：3 的倍数 -> Fizz，5 的倍数 -> Buzz，
/// 15 的倍数 -> FizzBuzz，其余 -> 数字本身。
fn fizzbuzz(n: u32) -> String {
    if n % 15 == 0 {
        "FizzBuzz".to_string()
    } else if n % 3 == 0 {
        "Fizz".to_string()
    } else if n % 5 == 0 {
        "Buzz".to_string()
    } else {
        n.to_string()
    }
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let n: u32 = input.trim().parse().unwrap();

    // 手写测试表：(输入, 期望输出)
    let cases: [(u32, &str); 5] = [
        (1, "1"),
        (3, "Fizz"),
        (5, "Buzz"),
        (15, "FizzBuzz"),
        (7, "7"),
    ];

    let mut passed = 0;
    for (case_in, want) in &cases {
        let got = fizzbuzz(*case_in);
        assert_eq!(got, *want, "fizzbuzz({}) 应为 {}，实际 {}", case_in, want, got);
        println!("{} -> {}", case_in, got);
        passed += 1;
    }

    println!("输入 {} -> {}", n, fizzbuzz(n));
    println!("测试: {}/5 通过", passed);
}
`,
    hints: [
      'fizzbuzz 判断顺序：先 % 15（FizzBuzz），再 % 3，再 % 5 —— 顺序反了 15 会先被 Fizz 抢走。',
      '测试表：`let cases: [(u32, &str); 5] = [(1, "1"), (3, "Fizz"), (5, "Buzz"), (15, "FizzBuzz"), (7, "7")];` 遍历时 assert_eq! 后打印 `{} -> {}`。',
      '最后两行：`println!("输入 {} -> {}", n, fizzbuzz(n));` 和 `println!("测试: {}/5 通过", passed);`。',
    ],
    tests: [
      { name: '样例：9', stdin: '9\n', expected: '1 -> 1\n3 -> Fizz\n5 -> Buzz\n15 -> FizzBuzz\n7 -> 7\n输入 9 -> Fizz\n测试: 5/5 通过' },
      { name: '样例：30', stdin: '30\n', expected: '1 -> 1\n3 -> Fizz\n5 -> Buzz\n15 -> FizzBuzz\n7 -> 7\n输入 30 -> FizzBuzz\n测试: 5/5 通过' },
      { name: '隐藏：普通数', stdin: '4\n', expected: '1 -> 1\n3 -> Fizz\n5 -> Buzz\n15 -> FizzBuzz\n7 -> 7\n输入 4 -> 4\n测试: 5/5 通过', hidden: true },
      { name: '隐藏：100', stdin: '100\n', expected: '1 -> 1\n3 -> Fizz\n5 -> Buzz\n15 -> FizzBuzz\n7 -> 7\n输入 100 -> Buzz\n测试: 5/5 通过', hidden: true },
      { name: '隐藏：1', stdin: '1\n', expected: '1 -> 1\n3 -> Fizz\n5 -> Buzz\n15 -> FizzBuzz\n7 -> 7\n输入 1 -> 1\n测试: 5/5 通过', hidden: true },
    ],
  },
  {
    id: 'rust-best-4',
    lang: 'rust',
    module: 'best',
    order: 4,
    title: 'API 设计：借用还是拿所有权',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解 &str 优于 &String 的原因（deref 强制转换）',
      '理解 &[T] 优于 &Vec<T> 的通用性',
      '判断什么时候必须拿所有权',
    ],
    brief: `## API 设计：借用还是拿所有权？

设计函数签名时的黄金法则：**能借就不拿，能窄就不宽**。

### &str 优于 &String

\`\`\`rust
fn len_good(s: &str) -> usize { s.len() }   // ✅
fn len_bad(s: &String) -> usize { s.len() } // ❌ 多余限制
\`\`\`

\`&String\` 能自动转成 \`&str\`（deref 强制转换），所以收 \`&str\` 的函数，调用方传 \`String\`、\`&str\`、字面量都行；收 \`&String\` 只能传 \`&String\`。

### &[T] 优于 &Vec<T>

\`\`\`rust
fn sum_good(nums: &[f64]) -> f64 { ... }   // ✅ Vec、数组、切片都收
fn sum_bad(nums: &Vec<f64>) -> f64 { ... } // ❌ 只能收 Vec
\`\`\`

### 什么时候必须拿所有权？

- 要**存储**参数（放进 struct、Vec）；
- 要**转换后返回**新值且不需要原值；
- 需要 \`'static\`（如线程）。

其余场景一律借用 —— 调用方保留数据，API 更灵活。`,
    task: `## 任务：窄接口工具集

实现四个**只借用**的函数（参数用 &str 与 &[f64]，禁止收 &String / &Vec）：

1. \`fn count_chars(s: &str) -> usize\` —— 字符数
2. \`fn first_char(s: &str) -> Option<char>\` —— 首字符
3. \`fn mean(nums: &[f64]) -> f64\` —— 平均值
4. \`fn ends_sum(nums: &[f64]) -> f64\` —— 首元素 + 尾元素

**输入**：两行

1. 第一行：一个字符串（可含中文，不含空格）
2. 第二行：若干小数（至少 1 个）

**输出**（四行）：

1. \`字符数: <count_chars>\`
2. \`首字符: <first_char>\`
3. \`平均值: <mean 保留 2 位>\`
4. \`首尾和: <ends_sum>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`hello\`<br>\`1 2 3 4\` | \`字符数: 5\`<br>\`首字符: h\`<br>\`平均值: 2.50\`<br>\`首尾和: 5\` |`,
    starter: `use std::io;

// TODO 1: count_chars(s: &str) -> usize
// TODO 2: first_char(s: &str) -> Option<char>
// TODO 3: mean(nums: &[f64]) -> f64
// TODO 4: ends_sum(nums: &[f64]) -> f64

fn main() {
    let mut line1 = String::new();
    std::io::stdin().read_line(&mut line1).unwrap();
    let s = line1.trim();

    let mut line2 = String::new();
    std::io::stdin().read_line(&mut line2).unwrap();
    let nums: Vec<f64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 5: 调用四个函数输出四行
}
`,
    solution: `use std::io;

fn count_chars(s: &str) -> usize {
    s.chars().count()
}

fn first_char(s: &str) -> Option<char> {
    s.chars().next()
}

fn mean(nums: &[f64]) -> f64 {
    let sum: f64 = nums.iter().sum();
    sum / nums.len() as f64
}

fn ends_sum(nums: &[f64]) -> f64 {
    nums.first().unwrap() + nums.last().unwrap()
}

fn main() {
    let mut line1 = String::new();
    std::io::stdin().read_line(&mut line1).unwrap();
    let s = line1.trim();

    let mut line2 = String::new();
    std::io::stdin().read_line(&mut line2).unwrap();
    let nums: Vec<f64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    println!("字符数: {}", count_chars(s));
    println!("首字符: {}", first_char(s).unwrap());
    println!("平均值: {:.2}", mean(&nums));
    println!("首尾和: {}", ends_sum(&nums));
}
`,
    hints: [
      '四个函数的参数类型就是答案：`&str`、`&str`、`&[f64]`、`&[f64]` —— 调用时 `&nums`（&Vec）自动 deref 成 `&[f64]`。',
      'mean：`nums.iter().sum::<f64>() / nums.len() as f64`。首尾和：`nums.first().unwrap() + nums.last().unwrap()`。',
      '首字符：`s.chars().next()` 返回 Option<char>，main 里 unwrap。智码 是 2 字符、首字符 智。',
    ],
    tests: [
      { name: '样例：hello', stdin: 'hello\n1 2 3 4\n', expected: '字符数: 5\n首字符: h\n平均值: 2.50\n首尾和: 5' },
      { name: '样例：中文', stdin: '智码\n10\n', expected: '字符数: 2\n首字符: 智\n平均值: 10.00\n首尾和: 20' },
      { name: '隐藏：循环小数', stdin: 'abc\n1 2 4\n', expected: '字符数: 3\n首字符: a\n平均值: 2.33\n首尾和: 5', hidden: true },
      { name: '隐藏：小数输入', stdin: 'Rust\n2.5 3.5\n', expected: '字符数: 4\n首字符: R\n平均值: 3.00\n首尾和: 6', hidden: true },
    ],
  },
  {
    id: 'rust-best-5',
    lang: 'rust',
    module: 'best',
    order: 5,
    title: 'clippy 精选 lint',
    difficulty: 3,
    xp: 30,
    goals: [
      '用 any / all 代替 filter().next().is_some()',
      '用 is_some_and 代替 map + unwrap_or(false)',
      '养成表达式返回、避免冗余 return',
    ],
    brief: `## clippy：你的免费代码评审

\`\`\`bash
cargo clippy   # 600+ 条 lint：习惯用法、性能、可读性
\`\`\`

精选几条常见建议：

\`\`\`rust
// 1. 冗余 return（needless_return）
fn f(x: i32) -> i32 { return x + 1; }  // ❌
fn f(x: i32) -> i32 { x + 1 }          // ✅ 表达式返回

// 2. is_some_and 代替 map + unwrap_or(false)
opt.map(|v| v > 0).unwrap_or(false)      // ❌
opt.is_some_and(|v| v > 0)               // ✅

// 3. any/all 代替 filter().next().is_some()
v.iter().filter(|&&x| x > 0).next().is_some() // ❌
v.iter().any(|&x| x > 0)                      // ✅

// 4. map 代替 if let Some
if let Some(v) = opt { Some(v * 2) } else { None } // ❌
opt.map(|v| v * 2)                                 // ✅
\`\`\`

CI 里加 \`cargo clippy -- -D warnings\`，让烂味道在合并前被拦下。本关要求用"clippy 满意"的写法完成任务。`,
    task: `## 任务：改造为 idiomatic 代码

读入两行：第一行一个单词，第二行若干整数。用 clippy 推荐的写法输出五行：

1. \`首字符大写: <word.chars().next().is_some_and(|c| c.is_ascii_uppercase())>\`
2. \`有正数: <nums.iter().any(|&x| x > 0)>\`
3. \`全部非负: <nums.iter().all(|&x| x >= 0)>\`
4. \`首个负数: <find + copied + unwrap_or(0)>\`
5. \`平方和: <map + sum>\`

**输入**：两行 —— 单词（ASCII，非空）；若干整数（至少 1 个）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`Hello\`<br>\`-1 2 -3\` | \`首字符大写: true\`<br>\`有正数: true\`<br>\`全部非负: false\`<br>\`首个负数: -1\`<br>\`平方和: 14\` |
| \`rust\`<br>\`0 0\` | \`首字符大写: false\`<br>\`有正数: false\`<br>\`全部非负: true\`<br>\`首个负数: 0\`<br>\`平方和: 0\` |

禁用 filter().next().is_some() 与 map().unwrap_or(false) —— 那是 clippy 要拦的写法。`,
    starter: `use std::io;

fn main() {
    let mut line1 = String::new();
    std::io::stdin().read_line(&mut line1).unwrap();
    let word = line1.trim();

    let mut line2 = String::new();
    std::io::stdin().read_line(&mut line2).unwrap();
    let nums: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: is_some_and 判断首字符大写
    // TODO 2: any 判断有正数
    // TODO 3: all 判断全部非负
    // TODO 4: find 找首个负数（没有则 0）
    // TODO 5: map + sum 求平方和
}
`,
    solution: `use std::io;

fn main() {
    let mut line1 = String::new();
    std::io::stdin().read_line(&mut line1).unwrap();
    let word = line1.trim();

    let mut line2 = String::new();
    std::io::stdin().read_line(&mut line2).unwrap();
    let nums: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let starts_upper = word.chars().next().is_some_and(|c| c.is_ascii_uppercase());
    let has_positive = nums.iter().any(|&x| x > 0);
    let all_non_negative = nums.iter().all(|&x| x >= 0);
    let first_negative = nums.iter().find(|&&x| x < 0).copied().unwrap_or(0);
    let sq_sum: i64 = nums.iter().map(|x| x * x).sum();

    println!("首字符大写: {}", starts_upper);
    println!("有正数: {}", has_positive);
    println!("全部非负: {}", all_non_negative);
    println!("首个负数: {}", first_negative);
    println!("平方和: {}", sq_sum);
}
`,
    hints: [
      'is_some_and 一步到位：`word.chars().next().is_some_and(|c| c.is_ascii_uppercase())` —— Option 为 None 直接 false。',
      'any / all：`nums.iter().any(|&x| x > 0)`、`nums.iter().all(|&x| x >= 0)`。空迭代 all 返回 true，any 返回 false（本题输入非空）。',
      '首个负数：`nums.iter().find(|&&x| x < 0).copied().unwrap_or(0)`；平方和：`nums.iter().map(|x| x * x).sum::<i64>()`。',
    ],
    tests: [
      { name: '样例：Hello', stdin: 'Hello\n-1 2 -3\n', expected: '首字符大写: true\n有正数: true\n全部非负: false\n首个负数: -1\n平方和: 14' },
      { name: '样例：全零', stdin: 'rust\n0 0\n', expected: '首字符大写: false\n有正数: false\n全部非负: true\n首个负数: 0\n平方和: 0' },
      { name: '隐藏：无负数', stdin: 'Zhi\n5\n', expected: '首字符大写: true\n有正数: true\n全部非负: true\n首个负数: 0\n平方和: 25', hidden: true },
      { name: '隐藏：混合', stdin: 'code99\n-4 4 -4 4\n', expected: '首字符大写: false\n有正数: true\n全部非负: false\n首个负数: -4\n平方和: 64', hidden: true },
    ],
  },
];
