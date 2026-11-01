import type { Level } from '@/types';

/** Rust · 第四章：开发实用技巧（6 关） */
export const RUST_TIPS: Level[] = [
  {
    id: 'rust-tips-1',
    lang: 'rust',
    module: 'tips',
    order: 1,
    title: '格式化宏大全',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握 {:>8} / {:04} / {:.2} 等格式参数',
      '掌握 {:?} Debug 格式化',
      '学会 {{ }} 转义花括号',
    ],
    brief: `## 格式化宏全家桶

\`println!\` 的占位符语法：\`{[:参数][:格式]\`：

\`\`\`rust
println!("{}", 7);          // 7
println!("{:?}", (1, "a")); // Debug 格式：(1, "a")
println!("{:>8}", 7);       // 右对齐宽 8："       7"
println!("{:<8}", 7);       // 左对齐："7       "
println!("{:^8}", 7);       // 居中
println!("{:04}", 7);       // 补零到 4 位："0007"（负数 -7 → -007）
println!("{:.2}", 3.14159); // 保留 2 位小数："3.14"
println!("{{}}");           // 想打印花括号本身：{{ 输出 {，}} 输出 }
\`\`\`

更多玩法：

- \`{:>8.2}\` 组合：右对齐宽 8、保留 2 位小数；
- \`{0} {1} {0}\` 按位置复用参数；
- \`{:?}\` / \`{:#?}\` 打印调试信息（后者带缩进换行）；
- \`print!\` 不换行，\`eprintln!\` 输出到 stderr。

> 💡 \`{:>8}\` 宽度里数字和空格一共占 8 位，正数右侧顶格。`,
    task: `## 任务：格式化表演秀

读入一个整数 \`n\` 和一个小数 \`x\`，按五条格式输出：

1. \`右对齐: |<n 右对齐宽 8>|\` —— 两根竖线夹住 \`{:>8}\` 的结果
2. \`补零: <{:04} 的 n>\`
3. \`小数: <{:.2} 的 x>\`
4. \`调试: <{:?} 打印元组 (n, x)>\`
5. \`转义: {}\` —— 用 {{}} 转义真的打印出一对花括号

**输入**：一行：\`n x\`（-1000 ≤ n ≤ 1000）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`7 3.14159\` | \`右对齐: \|       7\| \`<br>\`补零: 0007\`<br>\`小数: 3.14\`<br>\`调试: (7, 3.14159)\`<br>\`转义: {}\` |
| \`-7 2.5\` | \`右对齐: \|      -7\|<br>\`补零: -007\`<br>\`小数: 2.50\`<br>\`调试: (-7, 2.5)\`<br>\`转义: {}\` |

注意第 1 行的竖线 \`|\` 是字面字符，\`{:>8}\` 负数时符号也占宽度。`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let n: i64 = parts.next().unwrap().parse().unwrap();
    let x: f64 = parts.next().unwrap().parse().unwrap();

    // TODO: 五条格式化输出
}
`,
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let n: i64 = parts.next().unwrap().parse().unwrap();
    let x: f64 = parts.next().unwrap().parse().unwrap();

    println!("右对齐: |{:>8}|", n);
    println!("补零: {:04}", n);
    println!("小数: {:.2}", x);
    println!("调试: {:?}", (n, x));
    println!("转义: {{}}");
}
`,
    hints: [
      '右对齐夹竖线：`println!("右对齐: |{:>8}|", n);` —— 7 会变成 7 个空格加一个 7。',
      '补零与小数：`println!("补零: {:04}", n);`、`println!("小数: {:.2}", x);`。负数补零是 -007。',
      '调试与转义：`println!("调试: {:?}", (n, x));`、`println!("转义: {{}}");` —— 双写花括号才是字面花括号。',
    ],
    tests: [
      { name: '样例：7 3.14159', stdin: '7 3.14159\n', expected: '右对齐: |       7|\n补零: 0007\n小数: 3.14\n调试: (7, 3.14159)\n转义: {}' },
      { name: '样例：-7 2.5', stdin: '-7 2.5\n', expected: '右对齐: |      -7|\n补零: -007\n小数: 2.50\n调试: (-7, 2.5)\n转义: {}' },
      { name: '隐藏：42', stdin: '42 99.999\n', expected: '右对齐: |      42|\n补零: 0042\n小数: 100.00\n调试: (42, 99.999)\n转义: {}', hidden: true },
      { name: '隐藏：零', stdin: '0 0.5\n', expected: '右对齐: |       0|\n补零: 0000\n小数: 0.50\n调试: (0, 0.5)\n转义: {}', hidden: true },
    ],
  },
  {
    id: 'rust-tips-2',
    lang: 'rust',
    module: 'tips',
    order: 2,
    title: 'String 与 Vec 速查',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握 Vec 的 push / pop / retain / sort',
      '在辅助函数中用 &[T] 与泛型打印',
      '理解 retain 闭包的 |&x| 解构写法',
    ],
    brief: `## String / Vec 速查手册

两个最常用集合的高频方法：

### String

\`\`\`rust
let mut s = String::from("ab");
s.push('c');           // "abc" 追加单字符
s.push_str("de");      // "abcde" 追加字符串
s.pop();               // 弹出末尾字符 Option<char>
s.insert(0, 'X');      // 指定字节处插入
s.replace("ab", "xy"); // 替换（返回新串）
s.trim();              // 去首尾空白（返回 &str）
\`\`\`

### Vec

\`\`\`rust
let mut v = vec![3, -1, 4];
v.push(100);            // 尾插
v.pop();                // 弹出末尾 Option<T>
v.insert(1, 99);        // 下标处插入，其余右移
v.remove(0);            // 移除并返回下标元素
v.retain(|&x| x > 0);   // 原地保留满足条件的
v.sort();               // 升序排序
v.contains(&4);         // 是否包含
v.len(); v.is_empty();
\`\`\`

> ⚠️ \`retain\` 的闭包参数是 \`&T\`，写 \`|&x| x > 0\` 解构最舒服；\`sort\` 是原地稳定排序。`,
    task: `## 任务：Vec 操作流水线

第一行读 n，第二行读 n 个整数，依次执行并**每步打印**：

1. \`原始: <v>\`
2. \`尾插100: <v.push(100) 后>\`
3. \`弹出: <pop 出来的值>\`
4. \`保留正数: <retain(|&x| x > 0) 后>\`
5. \`排序后: <sort() 后>\`

**输入**：两行 —— 第一行 n（1 ≤ n ≤ 10）；第二行 n 个整数（至少有一个正数）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5\`<br>\`3 -1 4 2 -5\` | \`原始: 3 -1 4 2 -5\`<br>\`尾插100: 3 -1 4 2 -5 100\`<br>\`弹出: 100\`<br>\`保留正数: 3 4 2\`<br>\`排序后: 2 3 4\` |

建议写辅助函数 \`fn show(name: &str, v: &[i64])\` 统一打印，避免五段重复代码。`,
    starter: `use std::io;

// TODO: 定义辅助函数 show(name: &str, v: &[i64])，打印 "<name>: <空格分隔>"

fn main() {
    let mut line = String::new();
    std::io::stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    let mut line2 = String::new();
    std::io::stdin().read_line(&mut line2).unwrap();
    let mut v: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO: 依次执行五步并打印
}
`,
    solution: `use std::io;

fn show(name: &str, v: &[i64]) {
    let parts: Vec<String> = v.iter().map(|x| x.to_string()).collect();
    println!("{}: {}", name, parts.join(" "));
}

fn main() {
    let mut line = String::new();
    std::io::stdin().read_line(&mut line).unwrap();
    let _n: usize = line.trim().parse().unwrap();

    let mut line2 = String::new();
    std::io::stdin().read_line(&mut line2).unwrap();
    let mut v: Vec<i64> = line2.split_whitespace().map(|x| x.parse().unwrap()).collect();

    show("原始", &v);
    v.push(100);
    show("尾插100", &v);
    let popped = v.pop().unwrap();
    println!("弹出: {}", popped);
    v.retain(|&x| x > 0);
    show("保留正数", &v);
    v.sort();
    show("排序后", &v);
}
`,
    hints: [
      '辅助函数：`fn show(name: &str, v: &[i64]) { let parts: Vec<String> = v.iter().map(|x| x.to_string()).collect(); println!("{}: {}", name, parts.join(" ")); }`。',
      '流水线：push(100) → show → pop（返回 Option<i64>，unwrap 得 100）→ retain(|&x| x > 0) → show → sort → show。',
      '注意顺序：弹出在保留正数之前，所以"弹出"恒为 100；retain 和 sort 都是原地修改。',
    ],
    tests: [
      { name: '样例：5 个数', stdin: '5\n3 -1 4 2 -5\n', expected: '原始: 3 -1 4 2 -5\n尾插100: 3 -1 4 2 -5 100\n弹出: 100\n保留正数: 3 4 2\n排序后: 2 3 4' },
      { name: '样例：含零', stdin: '4\n-2 5 0 3\n', expected: '原始: -2 5 0 3\n尾插100: -2 5 0 3 100\n弹出: 100\n保留正数: 5 3\n排序后: 3 5' },
      { name: '隐藏：单元素', stdin: '1\n7\n', expected: '原始: 7\n尾插100: 7 100\n弹出: 100\n保留正数: 7\n排序后: 7', hidden: true },
      { name: '隐藏：已有序', stdin: '3\n10 -20 30\n', expected: '原始: 10 -20 30\n尾插100: 10 -20 30 100\n弹出: 100\n保留正数: 10 30\n排序后: 10 30', hidden: true },
    ],
  },
  {
    id: 'rust-tips-3',
    lang: 'rust',
    module: 'tips',
    order: 3,
    title: '踩坑：按字节索引字符串',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解字符串不支持 s[0] 与边界 panic 的原因',
      '用 chars().nth(k) 安全按字符取值',
      '区分 len() 字节数与字符数',
    ],
    brief: `## 踩坑：字符串不能按"字符"下标索引

Rust 字符串是 UTF-8 字节序列，**不支持 \`s[0]\`**：

\`\`\`rust
let s = "你好";
// let c = s[0];       // ❌ 编译错误：字符串没有实现 Index<usize>
// let half = &s[..1]; // ✅ 编译通过但运行 panic！
//                     // 1 不是字符边界（"你"占 3 字节）
\`\`\`

为什么？按字节切可能切在汉字中间，Rust 宁可 panic 也不给你乱码 —— 报错信息是 **byte index N is not a char boundary**。

### 正确姿势

\`\`\`rust
s.chars().nth(0);  // Some('你') —— 按字符取，注意是 O(n)
s.chars().last();  // 末字符
&s[..3];           // ✅ 3 是"你"的完整边界，得到 "你"
s.as_bytes()[0];   // 228 —— 明确要原始字节时
s.chars().count(); // 字符数（len() 是字节数）
\`\`\`

遇到"取第 k 个字符"，先想想是不是能用迭代器一步完成。`,
    task: `## 任务：安全取字器

读入一行字符串（首个字符是汉字，或前三个字节都是 ASCII；不含空格），输出五项报告：

1. \`字节: <s.len()>\`
2. \`字符: <s.chars().count()>\`
3. \`首字符: <chars().nth(0)>\`
4. \`前3字节: <&s[..3]>\`（题目保证这是安全边界）
5. \`第3个字符: <chars().nth(2)>\`

**输入**：一行一个字符串

### 示例

| 输入 | 输出 |
| --- | --- |
| \`你好Go\` | \`字节: 8\`<br>\`字符: 4\`<br>\`首字符: 你\`<br>\`前3字节: 你\`<br>\`第3个字符: G\` |
| \`Rust1\` | \`字节: 5\`<br>\`字符: 5\`<br>\`首字符: R\`<br>\`前3字节: Rus\`<br>\`第3个字符: s\` |

对比第 1、4 行：汉字时 \`前3字节\` 恰好等于一个完整汉字。`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let s = input.trim();

    // TODO 1: 打印字节、字符两行
    // TODO 2: 用 chars().nth(0) 打印首字符
    // TODO 3: 用 &s[..3] 打印前 3 字节
    // TODO 4: 用 chars().nth(2) 打印第 3 个字符
}
`,
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let s = input.trim();

    println!("字节: {}", s.len());
    println!("字符: {}", s.chars().count());
    println!("首字符: {}", s.chars().nth(0).unwrap());
    println!("前3字节: {}", &s[..3]);
    println!("第3个字符: {}", s.chars().nth(2).unwrap());
}
`,
    hints: [
      '字符计数：`s.chars().count()`；字节数 `s.len()`。两者对"你好Go"分别是 4 和 8。',
      '按字符取：`s.chars().nth(0).unwrap()` 首字符、`s.chars().nth(2).unwrap()` 第 3 个字符（下标从 0 数）。',
      '按字节切：`&s[..3]` 在"你好Go"得到"你"（3 字节正好是完整边界），在"Rust1"得到"Rus"。若边界落在汉字中间会 panic。',
    ],
    tests: [
      { name: '样例：你好Go', stdin: '你好Go\n', expected: '字节: 8\n字符: 4\n首字符: 你\n前3字节: 你\n第3个字符: G' },
      { name: '样例：Rust1', stdin: 'Rust1\n', expected: '字节: 5\n字符: 5\n首字符: R\n前3字节: Rus\n第3个字符: s' },
      { name: '隐藏：中文开头', stdin: '中文ABC\n', expected: '字节: 9\n字符: 5\n首字符: 中\n前3字节: 中\n第3个字符: A', hidden: true },
      { name: '隐藏：全 ASCII', stdin: 'a1b2c3\n', expected: '字节: 6\n字符: 6\n首字符: a\n前3字节: a1b\n第3个字符: b', hidden: true },
    ],
  },
  {
    id: 'rust-tips-4',
    lang: 'rust',
    module: 'tips',
    order: 4,
    title: '模式匹配进阶',
    difficulty: 3,
    xp: 30,
    goals: [
      '用元组模式与 _ 通配解构坐标',
      '用匹配守卫 if 表达附加条件',
      '用 @ 绑定在范围匹配中拿到值',
    ],
    brief: `## 模式匹配进阶招式

\`match\` 的模式远不止字面量：

\`\`\`rust
// 1. 多模式 | 与范围
match n {
    1 | 2 => "一二",
    3..=9 => "三到九",
    _ => "其他",
}

// 2. 元组与解构
match point {
    (0, 0) => "原点",
    (0, y) => "y轴",
    (x, 0) => "x轴",
    _ => "普通点",
}

// 3. 匹配守卫 if
match n {
    x if x < 0 => "负数",
    _ => "非负",
}

// 4. @ 绑定：范围匹配的同时拿到值
match code {
    c @ 500..=599 => format!("服务器错误 {}", c),
    _ => "正常".to_string(),
}
\`\`\`

\`_\` 忽略整个值；\`.. \` 忽略剩余字段；\`if let\` / \`while let\` 是"只匹配一种模式"的语法糖。匹配从上往下短路，把最特殊的分支放前面。`,
    task: `## 任务：坐标与状态码

读入一行：\`x y code\`（x、y 是整数坐标，code 是整数状态码），完成两段匹配：

**第一段**：对元组 \`(x, y)\` 匹配出位置：

- \`(0, 0)\` → \`原点\`；\`(0, _)\` → \`y轴\`；\`(_, 0)\` → \`x轴\`
- 守卫：\`x>0 && y>0\` → \`第一象限\`；\`x<0 && y>0\` → \`第二象限\`；\`x<0 && y<0\` → \`第三象限\`；其余 → \`第四象限\`

**第二段**：对 \`code\` 匹配：

- \`200\` → \`OK\`；\`404\` → \`未找到\`
- \`c @ 500..=599\` → \`服务器错误 <c>\`
- 其余 → \`未知\`

**输出**（两行）：\`位置: <...>\` 与 \`状态: <...>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 4 503\` | \`位置: 第一象限\`<br>\`状态: 服务器错误 503\` |
| \`0 0 200\` | \`位置: 原点\`<br>\`状态: OK\` |`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let x: i64 = parts.next().unwrap().parse().unwrap();
    let y: i64 = parts.next().unwrap().parse().unwrap();
    let code: i64 = parts.next().unwrap().parse().unwrap();

    // TODO 1: match (x, y) —— 元组模式 + 守卫
    // TODO 2: match code —— 字面量 + @ 绑定范围
}
`,
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let x: i64 = parts.next().unwrap().parse().unwrap();
    let y: i64 = parts.next().unwrap().parse().unwrap();
    let code: i64 = parts.next().unwrap().parse().unwrap();

    let position = match (x, y) {
        (0, 0) => "原点",
        (0, _) => "y轴",
        (_, 0) => "x轴",
        (px, py) if px > 0 && py > 0 => "第一象限",
        (px, py) if px < 0 && py > 0 => "第二象限",
        (px, py) if px < 0 && py < 0 => "第三象限",
        _ => "第四象限",
    };

    let status = match code {
        200 => "OK".to_string(),
        404 => "未找到".to_string(),
        c @ 500..=599 => format!("服务器错误 {}", c),
        _ => "未知".to_string(),
    };

    println!("位置: {}", position);
    println!("状态: {}", status);
}
`,
    hints: [
      '轴和原点的分支必须放在守卫分支**之前**，否则 (0, 5) 会被守卫接走。(0, _) 里用 _ 忽略 y。',
      '守卫写在模式后面：`(px, py) if px > 0 && py > 0 => "第一象限"`。',
      '@ 绑定：`c @ 500..=599 => format!("服务器错误 {}", c)` —— 既检查范围又拿到具体值。200/404 的字符串统一 .to_string() 保持分支类型一致。',
    ],
    tests: [
      { name: '样例：3 4 503', stdin: '3 4 503\n', expected: '位置: 第一象限\n状态: 服务器错误 503' },
      { name: '样例：0 0 200', stdin: '0 0 200\n', expected: '位置: 原点\n状态: OK' },
      { name: '隐藏：y轴与404', stdin: '0 9 404\n', expected: '位置: y轴\n状态: 未找到', hidden: true },
      { name: '隐藏：第四象限', stdin: '5 -1 301\n', expected: '位置: 第四象限\n状态: 未知', hidden: true },
      { name: '隐藏：第三象限', stdin: '-3 -3 550\n', expected: '位置: 第三象限\n状态: 服务器错误 550', hidden: true },
      { name: '隐藏：x轴', stdin: '-7 0 100\n', expected: '位置: x轴\n状态: 未知', hidden: true },
    ],
  },
  {
    id: 'rust-tips-5',
    lang: 'rust',
    module: 'tips',
    order: 5,
    title: '模块系统与 use',
    difficulty: 2,
    xp: 25,
    goals: [
      '在单文件内定义 mod 并用 pub 控制可见性',
      '用 use 引入路径缩短调用',
      '理解 crate:: 路径起点',
    ],
    brief: `## 模块系统：单文件也能分而治之

Rust 用 \`mod\` 组织代码树，再大的项目也是一条条路径：

\`\`\`rust
mod math_tools {          // 定义模块
    pub fn square(x: i64) -> i64 { x * x } // pub 才对外可见
    fn secret() -> i64 { 42 }              // 默认私有，外部调不到
}

use crate::math_tools::cube; // use 引入路径，之后直接写 cube(x)

fn main() {
    math_tools::square(3);      // 全路径调用
    cube(3);                    // use 之后的短名调用
    crate::math_tools::cube(3); // crate:: 从根出发
}
\`\`\`

要点：

- 不写 \`pub\` 的项**模块外不可见**（默认私有）—— 把 \`secret\` 去掉 pub 试试，外部调用直接编译错误；
- \`use A::B;\` 只是把路径变短，不改变可见性；
- 真实项目里模块放不同文件（\`mod foo;\` + \`foo.rs\`），单文件内 \`mod\` 适合小工具与测试。`,
    task: `## 任务：内联工具箱

1. 在文件内定义模块 \`math_tools\`，提供两个 \`pub\` 函数：
   - \`pub fn square(x: i64) -> i64\` —— 平方
   - \`pub fn cube(x: i64) -> i64\` —— 立方
2. 在 main 之上用 \`use crate::math_tools::cube;\` 引入 cube
3. main 中读入一个整数 x，分别以 \`math_tools::square(x)\`（全路径）与 \`cube(x)\`（use 短名）调用

**输入**：一行一个整数 x（-100 ≤ x ≤ 100）

**输出**（两行）：

1. \`平方: <square(x)>\`
2. \`立方: <cube(x)>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\` | \`平方: 9\`<br>\`立方: 27\` |
| \`-4\` | \`平方: 16\`<br>\`立方: -64\` |`,
    starter: `// TODO 1: 定义 mod math_tools，含 pub fn square 与 pub fn cube

use crate::math_tools::cube; // TODO 2: 补全 use 路径

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let x: i64 = input.trim().parse().unwrap();

    // TODO 3: 用全路径调 square、用短名调 cube，输出两行
}
`,
    solution: `mod math_tools {
    pub fn square(x: i64) -> i64 {
        x * x
    }

    pub fn cube(x: i64) -> i64 {
        x * x * x
    }
}

use crate::math_tools::cube;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let x: i64 = input.trim().parse().unwrap();

    println!("平方: {}", math_tools::square(x));
    println!("立方: {}", cube(x));
}
`,
    hints: [
      '模块骨架：`mod math_tools { pub fn square(x: i64) -> i64 { x * x } pub fn cube(x: i64) -> i64 { x * x * x } }` —— 两个都要 pub。',
      'use 引入：`use crate::math_tools::cube;` 之后 cube(x) 直接可用；square 保持全路径 math_tools::square(x) 调用。',
      '注意负数：(-4)² = 16，(-4)³ = -64。用 parse 得到的 i64 直接运算即可。',
    ],
    tests: [
      { name: '样例：3', stdin: '3\n', expected: '平方: 9\n立方: 27' },
      { name: '样例：5', stdin: '5\n', expected: '平方: 25\n立方: 125' },
      { name: '隐藏：负数', stdin: '-4\n', expected: '平方: 16\n立方: -64', hidden: true },
      { name: '隐藏：零', stdin: '0\n', expected: '平方: 0\n立方: 0', hidden: true },
    ],
  },
  {
    id: 'rust-tips-6',
    lang: 'rust',
    module: 'tips',
    order: 6,
    title: '调试三件套',
    difficulty: 2,
    xp: 25,
    goals: [
      '用 dbg! 带现场快照并取回返回值',
      '用 assert_eq! 锁住关键不变量',
      '用 {:?} 快速查看复合数据',
    ],
    brief: `## 调试三件套：dbg! / assert_eq! / {:?}

### 1. dbg!：带现场信息的速印

\`\`\`rust
let sum = dbg!(a + b); // 向 stderr 打印 [src/main.rs:5:15] a + b = 7，并返回值
\`\`\`

- 输出到 **stderr**，不污染 stdout；
- 自带文件名、行号、列号和表达式原文；
- **返回表达式的值**，可以原位包裹继续使用。

### 2. assert_eq! / assert!

\`\`\`rust
assert_eq!(a + b, b + a, "交换律坏了"); // 不等就 panic，附带两边值
assert!(v.is_sorted());
\`\`\`

写代码前先把关键不变量 assert 上 —— 比 println 调试高效得多。

### 3. {:?} 与 Debug

给结构体 \`#[derive(Debug)]\`，然后 \`println!("{:?}", p)\` 一键打印；\`{:#?}\` 美化成多行。元组也能直接 \`{:?}\`。

> 💡 dbg! 只在开发时用：它走 stderr，发布版本记得清理。`,
    task: `## 任务：调试工坊

读入两个整数 \`a b\`，按要求组合三件套：

1. \`assert_eq!(a + b, b + a, "交换律坏了");\` —— 不变量检查（正常无输出）
2. \`let sum = dbg!(a + b);\` —— dbg! 输出走 stderr（评测不采集），返回值继续用
3. 输出四行：和、差、元组调试、最大值

**输入**：一行两个整数 a b（绝对值 ≤ 10⁹）

**输出**（四行）：

1. \`和: <sum>\`
2. \`差: <a-b>\`
3. \`元组调试: <{:?} 打印 (a, b)>\`
4. \`最大: <std::cmp::max(a, b)>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 4\` | \`和: 7\`<br>\`差: -1\`<br>\`元组调试: (3, 4)\`<br>\`最大: 4\` |
| \`-5 5\` | \`和: 0\`<br>\`差: -10\`<br>\`元组调试: (-5, 5)\`<br>\`最大: 5\` |`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let a: i64 = parts.next().unwrap().parse().unwrap();
    let b: i64 = parts.next().unwrap().parse().unwrap();

    // TODO 1: assert_eq! 检查加法交换律
    // TODO 2: 用 dbg! 包住 a + b 拿到 sum（stderr 不影响评测）
    // TODO 3: 输出 和 / 差 / 元组调试 / 最大 四行
}
`,
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut parts = input.split_whitespace();
    let a: i64 = parts.next().unwrap().parse().unwrap();
    let b: i64 = parts.next().unwrap().parse().unwrap();

    assert_eq!(a + b, b + a, "交换律坏了");
    let sum = dbg!(a + b);

    println!("和: {}", sum);
    println!("差: {}", a - b);
    println!("元组调试: {:?}", (a, b));
    println!("最大: {}", std::cmp::max(a, b));
}
`,
    hints: [
      '断言：`assert_eq!(a + b, b + a, "交换律坏了");` 通过时无声无息，失败时 panic 并打印两边值。',
      'dbg! 返回值：`let sum = dbg!(a + b);` —— 它打印到 stderr（评测只看 stdout，不影响判题），sum 照常使用。',
      '元组调试：`println!("元组调试: {:?}", (a, b));` 输出形如 (3, 4)。最大值用 std::cmp::max。',
    ],
    tests: [
      { name: '样例：3 4', stdin: '3 4\n', expected: '和: 7\n差: -1\n元组调试: (3, 4)\n最大: 4' },
      { name: '样例：-5 5', stdin: '-5 5\n', expected: '和: 0\n差: -10\n元组调试: (-5, 5)\n最大: 5' },
      { name: '隐藏：全零', stdin: '0 0\n', expected: '和: 0\n差: 0\n元组调试: (0, 0)\n最大: 0', hidden: true },
      { name: '隐藏：大小悬殊', stdin: '100 1\n', expected: '和: 101\n差: 99\n元组调试: (100, 1)\n最大: 100', hidden: true },
    ],
  },
];
