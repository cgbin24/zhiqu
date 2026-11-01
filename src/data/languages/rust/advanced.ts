import type { Level } from '@/types';

/** Rust · 第三章：进阶技术（8 关） */
export const RUST_ADVANCED: Level[] = [
  {
    id: 'rust-advanced-1',
    lang: 'rust',
    module: 'advanced',
    order: 1,
    title: '所有权与移动',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握所有权三铁律与移动语义',
      '理解值传给函数同样会发生 move',
      '用 clone 显式深拷贝保住所有权',
    ],
    brief: `## 所有权：Rust 的灵魂

三条铁律：

1. Rust 每个值有唯一的**所有者**（owner）；
2. 同一时刻只能有一个所有者；
3. 所有者离开作用域，值被自动释放（drop）。

### 移动（Move）：赋值 = 转让所有权

\`\`\`rust
let s1 = String::from("你好");
let s2 = s1;          // 所有权从 s1 移动到 s2
// println!("{}", s1); // ❌ E0382: borrow of moved value: \`s1\`
println!("{}", s2);   // ✅
\`\`\`

\`String\` 的数据在堆上，赋值只复制栈上的指针（浅拷贝）。为防止两任 owner 各自释放同一块内存（双重释放），Rust 直接让 s1 失效。

**把值传给函数同样会移动**：

\`\`\`rust
fn consume(s: String) -> usize { s.len() }

let s = String::from("hi");
let n = consume(s);
// println!("{}", s); // ❌ E0382：s 已被移进函数
\`\`\`

### clone：显式深拷贝

\`\`\`rust
let backup = s.clone(); // 真的复制一份数据，s 依然有效
\`\`\`

> 💡 i64 等基本类型是 Copy 语义，赋值后旧变量仍可用，不受移动规则约束。`,
    task: `## 任务：所有权转移观察站

读入一行字符串（可含空格），完成所有权实验：

1. 定义函数 \`fn count_bytes(s: String) -> usize\`，返回 \`s.len()\`（s 会把所有权移进函数，函数结束时被 drop）
2. main 中：读入并打印 \`原始: <s>\`
3. **先**用 \`s.clone()\` 造出 \`backup\`（深拷贝，s 仍有效）
4. 再把 s 移入 \`count_bytes\`，打印 \`字节数: <n>\`
5. 函数返回后 s 已失效，但 backup 还活着：打印 \`备份: <backup>\`

**输入**：一行一个字符串（可含空格）

**输出**（三行）：

1. \`原始: <s>\`
2. \`字节数: <字节长>\`
3. \`备份: <backup>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`你好世界\` | \`原始: 你好世界\`<br>\`字节数: 12\`<br>\`备份: 你好世界\` |

汉字每字 3 字节：你好世界 = 12 字节。`,
    starter: `use std::io;

// TODO 1: 定义 count_bytes(s: String) -> usize

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let s = input.trim().to_string();

    // TODO 2: 打印原始行
    // TODO 3: clone 出 backup（必须在移动 s 之前！）
    // TODO 4: 把 s 移入 count_bytes，打印字节数
    // TODO 5: 打印备份行
    // 试试取消下面注释，观察 E0382 编译错误：
    // println!("{}", s);
}
`,
    solution: `use std::io;

fn count_bytes(s: String) -> usize {
    s.len()
} // s 在这里被 drop，内存释放

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let s = input.trim().to_string();

    println!("原始: {}", s);
    let backup = s.clone(); // 深拷贝：backup 拿到自己的数据
    let n = count_bytes(s); // 所有权移动进函数，此后 s 不能再用
    // println!("{}", s);   // ❌ E0382: borrow of moved value: \`s\`
    println!("字节数: {}", n);
    println!("备份: {}", backup);
}
`,
    hints: [
      '顺序是关键：`let backup = s.clone();` 必须写在 `count_bytes(s)` 之前 —— 移动之后 s 就没了，clone 不了。',
      '函数签名收 String：`fn count_bytes(s: String) -> usize { s.len() }`。传参即移动，返回的 usize 是 Copy 类型不受影响。',
      '输出三行：原始、字节数、备份。验证字节数：你好世界 12 字节，abc 3 字节。',
    ],
    tests: [
      { name: '样例：你好世界', stdin: '你好世界\n', expected: '原始: 你好世界\n字节数: 12\n备份: 你好世界' },
      { name: '样例：abc', stdin: 'abc\n', expected: '原始: abc\n字节数: 3\n备份: abc' },
      { name: '隐藏：含空格', stdin: '智码 CodeQuest\n', expected: '原始: 智码 CodeQuest\n字节数: 16\n备份: 智码 CodeQuest', hidden: true },
      { name: '隐藏：纯 ASCII', stdin: 'Rust\n', expected: '原始: Rust\n字节数: 4\n备份: Rust', hidden: true },
    ],
  },
  {
    id: 'rust-advanced-2',
    lang: 'rust',
    module: 'advanced',
    order: 2,
    title: '借用与引用',
    difficulty: 3,
    xp: 30,
    goals: [
      '用 &T 只读借用，避免所有权转移',
      '用 &mut T 可变借用修改原数据',
      '理解"多个 & 或一个 &mut"的借用规则',
    ],
    brief: `## 借用：不夺走所有权的使用权

移动太重了 —— 只想"用一下"值，用**引用**（borrow）：

\`\`\`rust
fn count_vowels(s: &str) -> usize { /* 只读 */ }
fn shout(s: &mut String) { *s = s.to_uppercase(); } // 可写

let mut s = String::from("hello");
let n = count_vowels(&s); // 借出只读引用，s 还是你的
shout(&mut s);            // 借出可变引用
println!("{}", s);        // HELLO!
\`\`\`

### 借用检查器两条黄金规则

同一时刻，对一份数据：

- 要么有**任意多个**不可变引用 \`&T\`；
- 要么有**恰好一个**可变引用 \`&mut T\`；
- 两者不能共存。

\`\`\`rust
let mut v = vec![1, 2];
let a = &v;
// v.push(3); // ❌ E0502：a 还在借用 v，不能同时可变借用
println!("{:?}", a);
\`\`\`

这个规则在编译期杜绝了数据竞争。引用默认不可变，\`&mut\` 必须显式写。`,
    task: `## 任务：单词变形工坊

读入一个英文单词，体验两种借用：

1. 定义 \`fn count_vowels(s: &str) -> usize\`（**只读借用**）—— 统计元音字母 a e i o u 的个数（不分大小写）
2. 定义 \`fn shout(s: &mut String)\`（**可变借用**）—— 把单词变成全大写并追加 \`!\`
3. main 中依次调用并输出

**输入**：一行一个英文单词（仅 ASCII 字母，长度 1~50）

**输出**（三行）：

1. \`原词: <s>\`
2. \`元音: <个数>\`
3. \`增强: <大写 + !>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`hello\` | \`原词: hello\`<br>\`元音: 2\`<br>\`增强: HELLO!\` |
| \`Rust\` | \`原词: Rust\`<br>\`元音: 1\`<br>\`增强: RUST!\` |`,
    starter: `use std::io;

// TODO 1: 定义 count_vowels(s: &str) -> usize（只读借用）

// TODO 2: 定义 shout(s: &mut String)（可变借用：转大写 + 追加 !）

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut s = input.trim().to_string();

    // TODO 3: 打印原词
    // TODO 4: 用 &s 借用统计元音并打印
    // TODO 5: 用 &mut s 借用变形，打印增强版
}
`,
    solution: `use std::io;

fn count_vowels(s: &str) -> usize {
    s.chars().filter(|c| "aeiouAEIOU".contains(*c)).count()
}

fn shout(s: &mut String) {
    *s = s.to_uppercase();
    s.push('!');
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut s = input.trim().to_string();

    println!("原词: {}", s);
    println!("元音: {}", count_vowels(&s));
    shout(&mut s);
    println!("增强: {}", s);
}
`,
    hints: [
      '只读借用：`fn count_vowels(s: &str) -> usize`，调用写 `count_vowels(&s)` —— 借完 s 还能用。',
      '可变借用：`fn shout(s: &mut String)`，内部 `*s = s.to_uppercase(); s.push(\'!\');`，调用写 `shout(&mut s)`。',
      '元音统计用迭代器：`s.chars().filter(|c| "aeiouAEIOU".contains(*c)).count()`。hello 有 2 个元音。',
    ],
    tests: [
      { name: '样例：hello', stdin: 'hello\n', expected: '原词: hello\n元音: 2\n增强: HELLO!' },
      { name: '样例：Rust', stdin: 'Rust\n', expected: '原词: Rust\n元音: 1\n增强: RUST!' },
      { name: '隐藏：全元音', stdin: 'AEiou\n', expected: '原词: AEiou\n元音: 5\n增强: AEIOU!', hidden: true },
      { name: '隐藏：零元音', stdin: 'xyz\n', expected: '原词: xyz\n元音: 0\n增强: XYZ!', hidden: true },
    ],
  },
  {
    id: 'rust-advanced-3',
    lang: 'rust',
    module: 'advanced',
    order: 3,
    title: '生命周期标注',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解返回引用为何需要生命周期标注',
      "掌握 'a 标注语法与约束含义",
      '体会悬垂引用如何被编译器拦截',
    ],
    brief: `## 生命周期：引用的有效范围

生命周期多数时候自动推断，但**返回引用的函数**常需手工标注：

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.chars().count() >= b.chars().count() {
        a
    } else {
        b
    }
}
\`\`\`

\`'a\`（读作 life-a）是什么？

- 它**不是**让引用活得更久，而是**声明约束**：返回的引用，存活期不超过 a、b 中较短的那个；
- 三个 \`'a\` 的含义：返回值引用的数据，必须同时被 a 和 b 的借用覆盖；
- 不标注时编译器无法判断返回的引用来自 a 还是 b，直接报 **E0106: missing lifetime specifier**。

\`\`\`rust
let s1 = String::from("long");
let result;
{
    let s2 = String::from("hi");
    result = longest(&s1, &s2);
} // s2 在此销毁
// println!("{}", result); // ❌ 若 result 指向 s2 就悬垂了，编译器拒绝
\`\`\`

省略规则：每个引用参数各有一个生命周期 / 只有一个输入引用时输出沿用之 / 方法里 &self 优先 —— 多数场景不用手写。`,
    task: `## 任务：谁更长？

实现经典函数：

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str
\`\`\`

规则：返回**字符数**较多的那个单词；一样长返回第一个（a）。

**输入**：两行，各一个单词（可含中文，非空）

**输出**：一行 \`较长: <胜出的单词>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`apple\`<br>\`banana\` | \`较长: banana\` |
| \`你好\`<br>\`hi\` | \`较长: 你好\` |

注意第二组：你好（2 个字符）和 hi（2 个字符）一样长，返回第一个 \`你好\` —— 比较的是**字符数**不是字节数！`,
    starter: `use std::io;

// TODO: 实现 longest<'a>(a: &'a str, b: &'a str) -> &'a str
//       按字符数比较，平局返回 a

fn main() {
    let mut line1 = String::new();
    std::io::stdin().read_line(&mut line1).unwrap();
    let mut line2 = String::new();
    std::io::stdin().read_line(&mut line2).unwrap();

    // TODO: trim 两行，调用 longest 并输出 "较长: ..."
}
`,
    solution: `use std::io;

fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.chars().count() >= b.chars().count() {
        a
    } else {
        b
    }
}

fn main() {
    let mut line1 = String::new();
    std::io::stdin().read_line(&mut line1).unwrap();
    let mut line2 = String::new();
    std::io::stdin().read_line(&mut line2).unwrap();
    let w1 = line1.trim();
    let w2 = line2.trim();

    println!("较长: {}", longest(w1, w2));
}
`,
    hints: [
      "标注写在参数与返回值上：`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str` —— 返回引用必然来自 a 或 b。",
      '比较用字符数：`a.chars().count() >= b.chars().count()` 返回 a，否则返回 b。平局（>=）归 a。',
      '第二组样例：你好 2 字符 vs hi 2 字符，平局返回第一个 —— 若误用字节比较（6 vs 2）就会答错。',
    ],
    tests: [
      { name: '样例：apple vs banana', stdin: 'apple\nbanana\n', expected: '较长: banana' },
      { name: '样例：你好 vs hi（平局）', stdin: '你好\nhi\n', expected: '较长: 你好' },
      { name: '隐藏：中文更长', stdin: 'hi\n你好吗\n', expected: '较长: 你好吗', hidden: true },
      { name: '隐藏：同长平局', stdin: 'same\nsize\n', expected: '较长: same', hidden: true },
    ],
  },
  {
    id: 'rust-advanced-4',
    lang: 'rust',
    module: 'advanced',
    order: 4,
    title: '切片 slice',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握范围语法 [a..b] / [..n] / [n..] 切片',
      '理解切片是借用不是复制',
      '在切片上直接求和、遍历',
    ],
    brief: `## 切片：借一段，不复制

切片（slice）是对集合中**连续一段**的引用：

\`\`\`rust
let v = vec![10, 20, 30, 40, 50];
let mid = &v[1..4];  // [20, 30, 40] —— 借用，不复制
let head = &v[..3];  // 前三个：[10, 20, 30]
let tail = &v[3..];  // 下标 3 到末尾：[40, 50]
let sum: i64 = mid.iter().sum();
\`\`\`

- \`[a..b]\` 含头不含尾；\`[..n]\` 从 0 到 n；\`[n..]\` 从 n 到末尾；
- 字符串切片 \`&s[..3]\` 是**按字节**切（第 4 章 tips 有坑点）；
- \`&Vec<i64>\` 能自动转成 \`&[i64]\`（deref 强制转换），所以函数参数写 \`&[T]\` 更通用。

切片是**胖指针**：保存 (起始指针, 长度)。越界访问直接 panic，不会像 C 一样静默越界。`,
    task: `## 任务：切片观察镜

读入一行若干整数（4 ≤ 个数 ≤ 20），输出四行切片报告：

1. \`前三个: <&v[..3]>\` —— 空格分隔
2. \`去首尾: <&v[1..len-1]>\`
3. \`后两个: <&v[len-2..]>\`
4. \`中间和: <&v[1..3] 的元素和>\`

**输入**：一行若干整数（空格分隔）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`10 20 30 40 50\` | \`前三个: 10 20 30\`<br>\`去首尾: 20 30 40\`<br>\`后两个: 40 50\`<br>\`中间和: 50\` |
| \`1 2 3 4\` | \`前三个: 1 2 3\`<br>\`去首尾: 2 3\`<br>\`后两个: 3 4\`<br>\`中间和: 5\` |

提示：把切片转成输出可以用 \`.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(" ")\`。`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let v: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO: 写一个把 &[i64] 变成 "10 20 30" 形态的辅助闭包或函数
    // TODO 1: 前三个 &v[..3]
    // TODO 2: 去首尾 &v[1..v.len()-1]
    // TODO 3: 后两个 &v[v.len()-2..]
    // TODO 4: 中间和 &v[1..3]
}
`,
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let v: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let show = |s: &[i64]| -> String {
        s.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(" ")
    };

    println!("前三个: {}", show(&v[..3]));
    println!("去首尾: {}", show(&v[1..v.len() - 1]));
    println!("后两个: {}", show(&v[v.len() - 2..]));
    println!("中间和: {}", v[1..3].iter().sum::<i64>());
}
`,
    hints: [
      '辅助函数/闭包：`s.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(" ")` 把切片拼成空格分隔的字符串。',
      '四个切片：`&v[..3]`、`&v[1..v.len()-1]`、`&v[v.len()-2..]`、`&v[1..3]`。注意 [a..b] 含头不含尾。',
      '中间和：`v[1..3].iter().sum::<i64>()` —— 对 10 20 30 40 50 是 20+30=50。',
    ],
    tests: [
      { name: '样例：5 个数', stdin: '10 20 30 40 50\n', expected: '前三个: 10 20 30\n去首尾: 20 30 40\n后两个: 40 50\n中间和: 50' },
      { name: '样例：4 个数', stdin: '1 2 3 4\n', expected: '前三个: 1 2 3\n去首尾: 2 3\n后两个: 3 4\n中间和: 5' },
      { name: '隐藏：6 个数', stdin: '5 6 7 8 9 10\n', expected: '前三个: 5 6 7\n去首尾: 6 7 8 9\n后两个: 9 10\n中间和: 13', hidden: true },
      { name: '隐藏：负数', stdin: '-1 -2 -3 -4\n', expected: '前三个: -1 -2 -3\n去首尾: -2 -3\n后两个: -3 -4\n中间和: -5', hidden: true },
    ],
  },
  {
    id: 'rust-advanced-5',
    lang: 'rust',
    module: 'advanced',
    order: 5,
    title: 'Box 堆分配',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解 Box<T> 把数据放上堆的用途',
      '明白递归类型为什么离不开 Box',
      '体验 Deref 自动解引用',
    ],
    brief: `## Box：把数据放上堆

\`Box<T>\` 是最简单的智能指针：把值放到**堆**上，栈上只留一个指针。

\`\`\`rust
let b = Box::new(5);
println!("{}", *b); // 解引用：5
\`\`\`

### 为什么需要它：递归类型

\`\`\`rust
enum List {
    Node(i32, Box<List>), // 没有 Box 就编译不过！
    Nil,
}
\`\`\`

没有 Box，\`Node\` 会包含 \`List\`，\`List\` 又包含 \`Node\`……编译器算不出无限大的内存。\`Box\` 把递归部分变成固定大小的指针，循环就此打断。

### Deref：智能指针的魔法

\`Box<T>\` 实现了 \`Deref\` trait：\`&Box<T>\` 能自动当 \`&T\` 用，\`*b\` 解引用取值 —— 函数参数收 \`&List\`，传 \`&Box<List>\` 也能自动转换。`,
    task: `## 任务：倒数链表

用 Box 实现链表枚举：

\`\`\`rust
enum List {
    Node(i32, Box<List>),
    Nil,
}
\`\`\`

读入一行整数，**依次把每个数"推"到链表头部**（后来居上，头节点是最后读入的数），然后写一个**递归函数**沿头向下收集并输出：

1. \`链表长度: <节点数>\`
2. \`倒序输出: <链表从头到尾的数，空格分隔>\`（即输入的倒序）

**输入**：一行若干整数（1 ≤ 个数 ≤ 10）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`1 2 3\` | \`链表长度: 3\`<br>\`倒序输出: 3 2 1\` |
| \`7\` | \`链表长度: 1\`<br>\`倒序输出: 7\` |

递归收集时注意 \`*v\` 解引用（模式绑定拿到的是 \`&i32\`），\`next\` 是 \`&Box<List>\`，传给递归函数时 Deref 自动转 \`&List\`。`,
    starter: `use std::io;

// TODO 1: 定义 enum List { Node(i32, Box<List>), Nil }

// TODO 2: 定义递归函数 collect_list(list: &List, out: &mut Vec<i32>)
//         Node 分支：先 push 当前值，再递归 next

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 3: 从 Nil 开始，逐个把数推到链表头部
    // TODO 4: 递归收集并输出两行
}
`,
    solution: `use std::io;

enum List {
    Node(i32, Box<List>),
    Nil,
}

fn collect_list(list: &List, out: &mut Vec<i32>) {
    if let List::Node(v, next) = list {
        out.push(*v);
        collect_list(next, out);
    }
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let mut list = List::Nil;
    for &n in &nums {
        list = List::Node(n, Box::new(list));
    }

    let mut out = Vec::new();
    collect_list(&list, &mut out);

    let parts: Vec<String> = out.iter().map(|x| x.to_string()).collect();
    println!("链表长度: {}", out.len());
    println!("倒序输出: {}", parts.join(" "));
}
`,
    hints: [
      '推入头部：`let mut list = List::Nil; for &n in &nums { list = List::Node(n, Box::new(list)); }` —— 每个新节点都成为新头部，所以头是最后一个数。',
      "递归收集：`if let List::Node(v, next) = list { out.push(*v); collect_list(next, out); }` —— *v 解引用，next 是 &Box<List> 自动转 &List。",
      '头到尾 = 输入倒序：1 2 3 依次推入后链表是 3→2→1，输出 `3 2 1`。',
    ],
    tests: [
      { name: '样例：1 2 3', stdin: '1 2 3\n', expected: '链表长度: 3\n倒序输出: 3 2 1' },
      { name: '样例：7', stdin: '7\n', expected: '链表长度: 1\n倒序输出: 7' },
      { name: '隐藏：四个数', stdin: '4 8 15 16\n', expected: '链表长度: 4\n倒序输出: 16 15 8 4', hidden: true },
      { name: '隐藏：含负数', stdin: '-1 0 1\n', expected: '链表长度: 3\n倒序输出: 1 0 -1', hidden: true },
    ],
  },
  {
    id: 'rust-advanced-6',
    lang: 'rust',
    module: 'advanced',
    order: 6,
    title: 'Rc 与 RefCell',
    difficulty: 4,
    xp: 40,
    goals: [
      '用 Rc::clone 共享所有权并观察引用计数',
      '用 RefCell 的 borrow_mut 实现内部可变性',
      '理解运行期借用检查与 panic 风险',
    ],
    brief: `## Rc + RefCell：共享所有权与内部可变性

\`Rc<T>\`（Reference Counted）：**引用计数**智能指针，允许多个所有者：

\`\`\`rust
use std::rc::Rc;
let shared = Rc::new(vec![1, 2, 3]);
let view_a = Rc::clone(&shared); // 计数 +1，不复制数据
let view_b = Rc::clone(&shared);
Rc::strong_count(&shared); // 3
\`\`\`

但 \`Rc\` 只提供只读访问。想要"多个所有者 + 可修改"，套上 \`RefCell<T>\`：

\`\`\`rust
use std::cell::RefCell;
let cell = Rc::new(RefCell::new(vec![1, 2]));
cell.borrow_mut()[0] = 99; // 运行时借用检查
\`\`\`

- \`borrow()\` 只读借用，\`borrow_mut()\` 可变借用 —— 借用规则从**编译期挪到运行期**：违反时 panic；
- \`Rc<RefCell<T>>\` 是树结构、图结构的标准配方（父节点和子节点共享数据）；
- ⚠️ \`Rc\` **不是线程安全的**，跨线程共享请用 \`Arc<Mutex<T>>\`（第 8 关）。`,
    task: `## 任务：共享记分板

读入一行若干整数，用 \`Rc<RefCell<Vec<i64>>>\` 做一块"共享记分板"：

1. 创建 \`shared = Rc::new(RefCell::new(初始数据))\`
2. 用 \`Rc::clone\` 造出两个视图 \`view_a\`、\`view_b\`，打印 \`引用计数: <strong_count>\`
3. 通过 \`view_a\` 的 \`borrow_mut()\` 把**每个元素翻倍**
4. 通过 \`shared\` 读出翻倍后的数据，打印 \`翻倍后: <空格分隔>\`
5. 通过 \`view_b\` 读取求和，打印 \`总和: <sum>\`

**输入**：一行若干整数（1 ≤ 个数 ≤ 10）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`1 2 3\` | \`引用计数: 3\`<br>\`翻倍后: 2 4 6\`<br>\`总和: 12\` |
| \`5\` | \`引用计数: 3\`<br>\`翻倍后: 10\`<br>\`总和: 10\` |

注意：三份 Rc 指向**同一块**数据 —— view_a 改的，shared 和 view_b 都看得见。`,
    starter: `use std::cell::RefCell;
use std::io;
use std::rc::Rc;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: 创建 Rc<RefCell<Vec<i64>>>，clone 出 view_a、view_b
    // TODO 2: 打印引用计数
    // TODO 3: 通过 view_a borrow_mut 把每个元素翻倍
    // TODO 4: 通过 shared 读出并打印翻倍后
    // TODO 5: 通过 view_b 读取求和并打印总和
}
`,
    solution: `use std::cell::RefCell;
use std::io;
use std::rc::Rc;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let shared = Rc::new(RefCell::new(nums));
    let view_a = Rc::clone(&shared);
    let view_b = Rc::clone(&shared);

    println!("引用计数: {}", Rc::strong_count(&shared));

    for x in view_a.borrow_mut().iter_mut() {
        *x *= 2;
    }

    let doubled: Vec<String> = shared.borrow().iter().map(|x| x.to_string()).collect();
    println!("翻倍后: {}", doubled.join(" "));

    let sum: i64 = view_b.borrow().iter().sum();
    println!("总和: {}", sum);
}
`,
    hints: [
      '引用计数：original + view_a + view_b = 3（输入只有一个数时也是 3）。用 `Rc::strong_count(&shared)` 打印。',
      '翻倍：`for x in view_a.borrow_mut().iter_mut() { *x *= 2; }` —— borrow_mut 的临时 RefMut 在语句结束自动释放。',
      '读取：`shared.borrow().iter()` 只读借用。三份 Rc 是同一块数据，view_a 改完 shared 立即可见。',
    ],
    tests: [
      { name: '样例：1 2 3', stdin: '1 2 3\n', expected: '引用计数: 3\n翻倍后: 2 4 6\n总和: 12' },
      { name: '样例：5', stdin: '5\n', expected: '引用计数: 3\n翻倍后: 10\n总和: 10' },
      { name: '隐藏：含零和负数', stdin: '0 -1 2\n', expected: '引用计数: 3\n翻倍后: 0 -2 4\n总和: 2', hidden: true },
      { name: '隐藏：两个数', stdin: '10 20\n', expected: '引用计数: 3\n翻倍后: 20 40\n总和: 60', hidden: true },
    ],
  },
  {
    id: 'rust-advanced-7',
    lang: 'rust',
    module: 'advanced',
    order: 7,
    title: 'trait 对象 dyn Trait',
    difficulty: 4,
    xp: 40,
    goals: [
      '构建 Vec<Box<dyn Trait>> 多态容器',
      '理解动态派发与虚表开销',
      '统一处理"同一 trait 的不同实现"',
    ],
    brief: `## trait 对象：运行期多态

泛型是编译期多态（单态化）；**trait 对象**是运行期多态：

\`\`\`rust
trait Area {
    fn area(&self) -> f64;
}

let shapes: Vec<Box<dyn Area>> = vec![
    Box::new(Circle { r: 1.0 }),
    Box::new(Square { s: 2.0 }),
];

for s in &shapes {
    println!("{:.2}", s.area()); // 运行时查虚表（动态派发）
}
\`\`\`

- \`dyn Area\` 读作"某个实现了 Area 的类型"；编译期不知道具体类型，通过**虚表（vtable）**在运行时找到方法 —— 一点开销换灵活；
- 容器元素必须等大，不同结构体大小不同，所以套 \`Box\` 统一成指针；
- 对比：泛型 \`impl Area\` 为每类型生成一份代码（静态派发）；\`dyn Area\` 一份代码 + 虚表。GUI 组件列表、插件系统都靠它。`,
    task: `## 任务：形状杂技团

1. 定义 trait \`Area\`（方法 \`fn area(&self) -> f64\`）
2. 定义 \`Circle(f64)\`（元组结构体，携带半径）与 \`Square(f64)\`（携带边长），都实现 Area
3. 读入 n 个形状规格，全部装进 \`Vec<Box<dyn Area>>\`
4. 按输入顺序输出每个面积（保留 2 位小数），最后输出总面积（保留 2 位小数）

**输入**：第一行 n（1 ≤ n ≤ 10）；接下来 n 行，每行 \`circle <r>\` 或 \`square <s>\`

**输出**：n+1 行 —— n 个面积 + \`总面积: <x.xx>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`circle 1\`<br>\`square 2\`<br>\`circle 0.5\` | \`3.14\`<br>\`4.00\`<br>\`0.79\`<br>\`总面积: 7.93\` |

总面积按**未舍入**的原始值累加后再舍入（3.14159 + 4 + 0.78539… = 7.9269… → 7.93）。`,
    starter: `use std::io;

// TODO 1: 定义 trait Area
// TODO 2: 定义 Circle(f64) / Square(f64) 元组结构体并实现 Area

fn main() {
    let mut line = String::new();
    std::io::stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    // TODO 3: 创建 Vec<Box<dyn Area>>，循环读入 n 行并按类型装箱入列
    // TODO 4: 遍历输出各面积（{:.2}），累加总面积后输出
}
`,
    solution: `use std::io;

trait Area {
    fn area(&self) -> f64;
}

struct Circle(f64);
struct Square(f64);

impl Area for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.0 * self.0
    }
}

impl Area for Square {
    fn area(&self) -> f64 {
        self.0 * self.0
    }
}

fn main() {
    let mut line = String::new();
    std::io::stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    let mut shapes: Vec<Box<dyn Area>> = Vec::new();
    for _ in 0..n {
        let mut line = String::new();
        std::io::stdin().read_line(&mut line).unwrap();
        let mut p = line.split_whitespace();
        let kind = p.next().unwrap();
        let v: f64 = p.next().unwrap().parse().unwrap();
        match kind {
            "circle" => shapes.push(Box::new(Circle(v))),
            _ => shapes.push(Box::new(Square(v))),
        }
    }

    let mut total = 0.0;
    for s in &shapes {
        let a = s.area();
        println!("{:.2}", a);
        total += a;
    }
    println!("总面积: {:.2}", total);
}
`,
    hints: [
      '容器类型：`Vec<Box<dyn Area>>`。入列：`shapes.push(Box::new(Circle(v)))` —— Box 抹平类型差异。',
      '遍历时 `for s in &shapes`，s 是 &Box<dyn Area>，Deref 自动转 &dyn Area，直接 `s.area()`。',
      '圆面积 `PI * self.0 * self.0`（元组结构体用 self.0 取字段），方面积 `self.0 * self.0`。总面积累加原始值后 {:.2}。',
    ],
    tests: [
      { name: '样例：三种形状', stdin: '3\ncircle 1\nsquare 2\ncircle 0.5\n', expected: '3.14\n4.00\n0.79\n总面积: 7.93' },
      { name: '样例：方与圆', stdin: '2\nsquare 2\ncircle 1\n', expected: '4.00\n3.14\n总面积: 7.14' },
      { name: '隐藏：单个圆', stdin: '1\ncircle 2\n', expected: '12.57\n总面积: 12.57', hidden: true },
      { name: '隐藏：两个方', stdin: '2\nsquare 1.5\nsquare 0.5\n', expected: '2.25\n0.25\n总面积: 2.50', hidden: true },
    ],
  },
  {
    id: 'rust-advanced-8',
    lang: 'rust',
    module: 'advanced',
    order: 8,
    title: 'mpsc 通道与 Arc',
    difficulty: 4,
    xp: 40,
    goals: [
      '用 mpsc::channel 在线程间传消息',
      '用 Arc 在多线程共享只读数据',
      '理解 Mutex 互斥锁的适用场景',
    ],
    brief: `## 线程协作：通道 + 共享

### mpsc 通道：消息传递

\`\`\`rust
use std::sync::mpsc;
let (tx, rx) = mpsc::channel();

for i in 0..4 {
    let tx = tx.clone(); // 每个线程一个发送端
    std::thread::spawn(move || {
        tx.send((i, i * i)).unwrap();
    });
}
drop(tx); // 丢弃原发送端

for _ in 0..4 {
    let (i, sq) = rx.recv().unwrap(); // 接收（到达顺序不定）
}
\`\`\`

mpsc = multi-producer, single-consumer。消息传递哲学："不要通过共享内存来通信，而要通过通信来共享内存。"

### Arc<Mutex>：共享状态

\`\`\`rust
let shared = Arc::new(Mutex::new(vec![]));
let s2 = Arc::clone(&shared);
thread::spawn(move || s2.lock().unwrap().push(1));
\`\`\`

\`Arc\` 原子引用计数（线程安全的 Rc），\`Mutex\` 互斥锁保证同时只有一个线程能改。Rust 里忘加锁直接编译不过 —— 因为锁定的 guards 与数据的生命周期绑定。`,
    task: `## 任务：双线程分账

读入一行偶数个整数（4 ≤ 个数 ≤ 8），切成**前后两半**：

1. 用 \`Arc<Vec<i64>>\` 共享数据（每个线程 \`Arc::clone\`）
2. 两个线程分别算自己那一半的和，通过 mpsc 通道发回 **(半区编号, 和)**
3. 主线程 \`recv\` 两次，按编号回填数组（通道到达顺序不定，靠 id 恢复确定性）

**输出**（三行）：

1. \`前半和: <sum>\`
2. \`后半和: <sum>\`
3. \`总和: <sum>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`1 2 3 4 5 6\` | \`前半和: 6\`<br>\`后半和: 15\`<br>\`总和: 21\` |
| \`10 20\` | \`前半和: 10\`<br>\`后半和: 20\`<br>\`总和: 30\` |`,
    starter: `use std::io;
use std::sync::mpsc;
use std::sync::Arc;
use std::thread;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: 创建 Arc 与 channel
    // TODO 2: 循环 2 次，clone tx 与 Arc，spawn 线程算对应半区的和并 send((编号, 和))
    // TODO 3: drop(tx) 后 recv 两次，按编号回填
    // TODO 4: 输出三行
}
`,
    solution: `use std::sync::mpsc;
use std::sync::Arc;
use std::thread;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let half = nums.len() / 2;

    let shared = Arc::new(nums);
    let (tx, rx) = mpsc::channel();

    for part in 0..2 {
        let tx = tx.clone();
        let shared = Arc::clone(&shared);
        thread::spawn(move || {
            let (start, end) = if part == 0 { (0, half) } else { (half, shared.len()) };
            let sum: i64 = shared[start..end].iter().sum();
            tx.send((part, sum)).unwrap();
        });
    }
    drop(tx);

    let mut results = [0i64; 2];
    for _ in 0..2 {
        let (id, sum) = rx.recv().unwrap();
        results[id] = sum;
    }

    println!("前半和: {}", results[0]);
    println!("后半和: {}", results[1]);
    println!("总和: {}", results[0] + results[1]);
}
`,
    hints: [
      '线程内算半区：`shared[0..half].iter().sum::<i64>()` 或 `shared[half..].iter().sum::<i64>()`，part 是 0 还是 1 决定范围。',
      '消息带编号：`tx.send((part, sum)).unwrap()`。接收后 `results[id] = sum` 回填，输出顺序就确定了。',
      '别忘了 `drop(tx)`（或让原 tx 离开作用域），避免通道持有发送端。recv 恰好两次即可。',
    ],
    tests: [
      { name: '样例：1 2 3 4 5 6', stdin: '1 2 3 4 5 6\n', expected: '前半和: 6\n后半和: 15\n总和: 21' },
      { name: '样例：10 20', stdin: '10 20\n', expected: '前半和: 10\n后半和: 20\n总和: 30' },
      { name: '隐藏：正负抵消', stdin: '-1 -2 -3 3 2 1\n', expected: '前半和: -6\n后半和: 6\n总和: 0', hidden: true },
      { name: '隐藏：四元素', stdin: '5 5 5 5\n', expected: '前半和: 10\n后半和: 10\n总和: 20', hidden: true },
    ],
  },
];
