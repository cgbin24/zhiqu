import type { Level } from '@/types';

/** Rust · 第六章：跨领域融会贯通（5 关） */
export const RUST_INTEGRATION: Level[] = [
  {
    id: 'rust-integration-1',
    lang: 'rust',
    module: 'integration',
    order: 1,
    title: '词频统计',
    difficulty: 4,
    xp: 40,
    goals: [
      '用 entry().or_insert(0) 一步完成计数',
      '掌握 HashMap → Vec → sort_by 的排序输出',
      '实现"次数降序 + 字典序升序"复合排序',
    ],
    brief: `## 词频统计：entry 的艺术

统计频率的地道写法只有一行核心：

\`\`\`rust
use std::collections::HashMap;

let mut counts: HashMap<String, usize> = HashMap::new();
for w in line.split_whitespace() {
    *counts.entry(w.to_string()).or_insert(0) += 1;
}
\`\`\`

- \`entry(k)\` 返回"入口"：键存在 → 给出可变访问；不存在 → **插入** \`or_insert(0)\` 的默认值；
- 一行完成"查询 - 不存在则初始化 - 自增"，避免 contains_key + get + insert 的三段式；
- 相比两查一插，entry 只做一次哈希。

### 排序输出

HashMap 遍历顺序**不确定**，输出前必须排序：

\`\`\`rust
let mut pairs: Vec<(String, usize)> = counts.into_iter().collect();
pairs.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(&b.0)));
\`\`\`

先按次数（\`.1\`）降序，次数相同用 \`then_with\` 按单词（\`.0\`）字典序升序 —— 复合排序的标准写法。`,
    task: `## 任务：词频排行

读入一行若干单词（空格分隔），统计词频并输出：

- 按**出现次数降序**排列
- 次数相同的按**单词字典序升序**

**输出**：每行 \`<单词> <次数>\`

**输入**：一行若干单词（1 ≤ 个数 ≤ 50）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`apple banana apple cherry banana apple\` | \`apple 3\`<br>\`banana 2\`<br>\`cherry 1\` |
| \`b a b a\` | \`a 2\`<br>\`b 2\` |

第二组：a 和 b 都是 2 次，字典序 a 在前。`,
    starter: `use std::collections::HashMap;
use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();

    // TODO 1: 用 entry().or_insert(0) 统计词频
    // TODO 2: 收集成 Vec 并按 次数降序 + 单词升序 排序
    // TODO 3: 逐行输出 "<单词> <次数>"
}
`,
    solution: `use std::collections::HashMap;
use std::io;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();

    let mut counts: HashMap<String, usize> = HashMap::new();
    for w in input.split_whitespace() {
        *counts.entry(w.to_string()).or_insert(0) += 1;
    }

    let mut pairs: Vec<(String, usize)> = counts.into_iter().collect();
    pairs.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(&b.0)));

    for (word, count) in &pairs {
        println!("{} {}", word, count);
    }
}
`,
    hints: [
      '计数核心：`*counts.entry(w.to_string()).or_insert(0) += 1;` —— entry 不存在时插入 0，再自增。',
      '复合排序：`pairs.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(&b.0)));` —— b.1 在前是降序，a.0 在前是升序。',
      'HashMap 直接遍历顺序随机，必须先 collect 成 Vec 再 sort。输出格式是 `{} {}`（单词 空格 次数）。',
    ],
    tests: [
      { name: '样例：三个词', stdin: 'apple banana apple cherry banana apple\n', expected: 'apple 3\nbanana 2\ncherry 1' },
      { name: '样例：平局', stdin: 'b a b a\n', expected: 'a 2\nb 2' },
      { name: '隐藏：单单词', stdin: 'x\n', expected: 'x 1', hidden: true },
      { name: '隐藏：多平局', stdin: 'z y x z y\n', expected: 'y 2\nz 2\nx 1', hidden: true },
    ],
  },
  {
    id: 'rust-integration-2',
    lang: 'rust',
    module: 'integration',
    order: 2,
    title: 'LRU 缓存',
    difficulty: 4,
    xp: 40,
    goals: [
      '用 HashMap + VecDeque 组合实现 LRU',
      '实现 get 命中提新鲜与 put 超容淘汰',
      '保持两个结构的同步更新',
    ],
    brief: `## LRU 缓存：两个结构的双人舞

LRU（Least Recently Used）：容量有限，满了就淘汰**最久没用**的。O(1) 工业实现是哈希表 + 双向链表；我们的简化版用 \`HashMap\` + \`VecDeque\`：

- \`HashMap<i32, i32>\`：O(1) 查值；
- \`VecDeque<i32>\` 维护**新鲜度**：队头 = 最近使用，队尾 = 最旧；

\`\`\`rust
// get 命中后要"提新鲜"：从队列中移除再插到队头
let pos = order.iter().position(|&x| x == k).unwrap();
order.remove(pos);      // VecDeque 支持按下标删除
order.push_front(k);

// put 之后超容：从队尾淘汰
if order.len() > cap {
    if let Some(old) = order.pop_back() {
        map.remove(&old);
    }
}
\`\`\`

两个结构必须**同步更新** —— 命中要提新鲜、更新键要先删旧位、淘汰要两边一起删，这是本关的全部难点。`,
    task: `## 任务：迷你 LRU

第一行输入容量 \`cap\`（1 ≤ cap ≤ 10），第二行操作数 \`n\`（1 ≤ n ≤ 20），接下来 n 行操作：

- \`put k v\`：插入/更新键值（更新已有键不算新增，但要提新鲜）；若键数超过 cap，淘汰队尾（最旧）的键
- \`get k\`：命中输出 \`k -> <v>\` 并把 k 提为最新；未命中输出 \`k -> -1\`

所有操作结束后输出最终缓存（从最新到最旧）：\`缓存: [k1, k2, ...]\`

**输入**：见上（共 n + 2 行）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`2\`<br>\`6\`<br>\`put 1 10\`<br>\`put 2 20\`<br>\`get 1\`<br>\`put 3 30\`<br>\`get 2\`<br>\`get 3\` | \`1 -> 10\`<br>\`2 -> -1\`<br>\`3 -> 30\`<br>\`缓存: [3, 1]\` |

跟踪：get 1 后顺序是 [1,2]；put 3 超容淘汰 2 → [3,1]；get 3 已在队头。`,
    starter: `use std::collections::{HashMap, VecDeque};
use std::io;

fn main() {
    let mut line = String::new();
    std::io::stdin().read_line(&mut line).unwrap();
    let cap: usize = line.trim().parse().unwrap();

    let mut line = String::new();
    std::io::stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    let mut map: HashMap<i32, i32> = HashMap::new();
    let mut order: VecDeque<i32> = VecDeque::new();

    // TODO: 循环 n 次读操作行，处理 put / get

    // TODO: 输出 "缓存: [k1, k2, ...]"
}
`,
    solution: `use std::collections::{HashMap, VecDeque};
use std::io;

fn main() {
    let mut line = String::new();
    std::io::stdin().read_line(&mut line).unwrap();
    let cap: usize = line.trim().parse().unwrap();

    let mut line = String::new();
    std::io::stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    let mut map: HashMap<i32, i32> = HashMap::new();
    let mut order: VecDeque<i32> = VecDeque::new();

    for _ in 0..n {
        let mut line = String::new();
        std::io::stdin().read_line(&mut line).unwrap();
        let parts: Vec<&str> = line.split_whitespace().collect();
        match parts[0] {
            "put" => {
                let k: i32 = parts[1].parse().unwrap();
                let v: i32 = parts[2].parse().unwrap();
                if map.contains_key(&k) {
                    let pos = order.iter().position(|&x| x == k).unwrap();
                    order.remove(pos);
                }
                map.insert(k, v);
                order.push_front(k);
                if order.len() > cap {
                    if let Some(old) = order.pop_back() {
                        map.remove(&old);
                    }
                }
            }
            _ => {
                let k: i32 = parts[1].parse().unwrap();
                match map.get(&k) {
                    Some(&v) => {
                        println!("{} -> {}", k, v);
                        let pos = order.iter().position(|&x| x == k).unwrap();
                        order.remove(pos);
                        order.push_front(k);
                    }
                    None => println!("{} -> -1", k),
                }
            }
        }
    }

    let keys: Vec<String> = order.iter().map(|k| k.to_string()).collect();
    println!("缓存: [{}]", keys.join(", "));
}
`,
    hints: [
      'put 已存在的键要先从 order 里删旧位置再 push_front，否则队列里会出现重复键。',
      'get 命中：先取出值并打印，再 position + remove + push_front 提新鲜；未命中直接打印 `k -> -1`，顺序不动。',
      '淘汰只在 put 后检查一次：`if order.len() > cap { pop_back + map.remove }`。最终输出 join(", ") 并夹在方括号里。',
    ],
    tests: [
      { name: '样例：容量 2', stdin: '2\n6\nput 1 10\nput 2 20\nget 1\nput 3 30\nget 2\nget 3\n', expected: '1 -> 10\n2 -> -1\n3 -> 30\n缓存: [3, 1]' },
      { name: '样例：容量 1', stdin: '1\n5\nput 1 5\nget 1\nput 2 6\nget 1\nget 2\n', expected: '1 -> 5\n1 -> -1\n2 -> 6\n缓存: [2]' },
      { name: '隐藏：更新提新鲜', stdin: '3\n5\nput 1 1\nput 2 2\nput 1 9\nget 1\nget 2\n', expected: '1 -> 9\n2 -> 2\n缓存: [2, 1]', hidden: true },
      { name: '隐藏：连续淘汰', stdin: '2\n5\nput 5 50\nput 6 60\nput 7 70\nput 5 55\nget 6\n', expected: '6 -> -1\n缓存: [5, 7]', hidden: true },
    ],
  },
  {
    id: 'rust-integration-3',
    lang: 'rust',
    module: 'integration',
    order: 3,
    title: '多线程并行求和',
    difficulty: 4,
    xp: 40,
    goals: [
      '按公式把数组切成 4 块分给 4 线程',
      '用 Arc 共享只读数据、mpsc 回传结果',
      '用块编号恢复确定性输出',
    ],
    brief: `## 多线程并行求和

把数组切成 4 块，4 个线程各算各的，主线程汇总 —— 经典的数据并行：

\`\`\`rust
let shared = Arc::new(nums);     // 原子引用计数：跨线程共享只读数据
let (tx, rx) = mpsc::channel();

for i in 0..4 {
    let tx = tx.clone();         // 每线程一个发送端
    let shared = Arc::clone(&shared);
    thread::spawn(move || {      // move：把 Arc 克隆移进线程
        let start = len * i / 4;
        let end = len * (i + 1) / 4;
        let s: i64 = shared[start..end].iter().sum();
        tx.send((i, s)).unwrap(); // 带上编号，结果才能对号入座
    });
}
\`\`\`

要点：

- **分块公式** \`start = n*i/4\`、\`end = n*(i+1)/4\`：每块大小接近，n 不是 4 的倍数时前面的块可能为空（本题保证 n ≥ 4）；
- \`Arc::clone\` 只加计数不复制数据；
- 消息带 \`(块号, 和)\`：通道到达顺序不定，接收端按编号回填数组 —— 靠 id 恢复确定性。`,
    task: `## 任务：四路并行求和

读入一行整数（4 ≤ 个数 ≤ 16），按 \`start = n*i/4\`、\`end = n*(i+1)/4\` 切成 4 块（i = 0..4），4 个线程并行求各自块的和，主线程汇总输出：

1. \`块0: <和>\`
2. \`块1: <和>\`
3. \`块2: <和>\`
4. \`块3: <和>\`
5. \`总和: <四块之和>\`

**输入**：一行若干整数（空格分隔，|值| ≤ 10⁶）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`1 2 3 4 5 6 7 8\` | \`块0: 3\`<br>\`块1: 7\`<br>\`块2: 11\`<br>\`块3: 15\`<br>\`总和: 36\` |
| \`1 2 3 4\` | \`块0: 1\`<br>\`块1: 2\`<br>\`块2: 3\`<br>\`块3: 4\`<br>\`总和: 10\` |

n=8：块0 是 [1,2]、块1 是 [3,4]、块2 是 [5,6]、块3 是 [7,8]。`,
    starter: `use std::io;
use std::sync::mpsc;
use std::sync::Arc;
use std::thread;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    // TODO 1: 创建 Arc 与 channel
    // TODO 2: 循环 4 次：clone tx 与 Arc，spawn 按分块公式求和并 send((块号, 和))
    // TODO 3: drop(tx) 后 recv 4 次，按块号回填数组
    // TODO 4: 输出五行
}
`,
    solution: `use std::io;
use std::sync::mpsc;
use std::sync::Arc;
use std::thread;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();

    let shared = Arc::new(nums);
    let (tx, rx) = mpsc::channel();
    let len = shared.len();

    for i in 0..4 {
        let tx = tx.clone();
        let shared = Arc::clone(&shared);
        thread::spawn(move || {
            let start = len * i / 4;
            let end = len * (i + 1) / 4;
            let sum: i64 = shared[start..end].iter().sum();
            tx.send((i, sum)).unwrap();
        });
    }
    drop(tx);

    let mut sums = [0i64; 4];
    for _ in 0..4 {
        let (id, s) = rx.recv().unwrap();
        sums[id] = s;
    }

    for i in 0..4 {
        println!("块{}: {}", i, sums[i]);
    }
    println!("总和: {}", sums.iter().sum::<i64>());
}
`,
    hints: [
      '分块公式：`let start = len * i / 4; let end = len * (i + 1) / 4;`。n=6 时块0 是 [0..1]，块1 是 [1..3]。',
      '每轮循环 clone 一份 tx 和一份 Arc：`let tx = tx.clone(); let shared = Arc::clone(&shared);` 然后 move 进闭包。',
      'recv 回填：`results[id] = s`，之后按 0..4 顺序打印就与线程完成先后无关。最后 `sums.iter().sum::<i64>()` 出总和。',
    ],
    tests: [
      { name: '样例：8 个数', stdin: '1 2 3 4 5 6 7 8\n', expected: '块0: 3\n块1: 7\n块2: 11\n块3: 15\n总和: 36' },
      { name: '样例：4 个数', stdin: '1 2 3 4\n', expected: '块0: 1\n块1: 2\n块2: 3\n块3: 4\n总和: 10' },
      { name: '隐藏：6 个数', stdin: '1 2 3 4 5 6\n', expected: '块0: 1\n块1: 5\n块2: 4\n块3: 11\n总和: 21', hidden: true },
      { name: '隐藏：16 个数', stdin: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16\n', expected: '块0: 10\n块1: 26\n块2: 42\n块3: 58\n总和: 136', hidden: true },
    ],
  },
  {
    id: 'rust-integration-4',
    lang: 'rust',
    module: 'integration',
    order: 4,
    title: '迷你 todo 命令行',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解 std::env::args 真实 CLI 的参数来源',
      '用 split_once 拆分"命令 + 可含空格的参数"',
      '实现 add / list / rm 三个子命令的状态机',
    ],
    brief: `## 命令行参数：真实 CLI 的骨架

真实 CLI 用 \`std::env::args()\` 读参数：

\`\`\`rust
let args: Vec<String> = std::env::args().collect();
// args[0] 是程序名，args[1] 开始是参数
match args[1].as_str() {
    "add" => { /* ... */ }
    "list" => { /* ... */ }
    _ => eprintln!("未知命令"),
}
\`\`\`

在线评测只有一个进程，所以本关**用 stdin 模拟命令行**：每行是一条命令，按顺序执行 —— 逻辑与真实 CLI 完全一致，只是输入源不同。

迷你 todo 支持三条子命令：

- \`add <文本>\`：文本可以含空格，用 \`split_once(' ')\` 把命令和参数分开；
- \`list\`：带序号列出，\`enumerate()\` 从 1 计数；
- \`rm <序号>\`：越界要友好报错，\`Vec::remove\` 会自动左移补位。`,
    task: `## 任务：单文件 todo

第一行是命令数 n（1 ≤ n ≤ 10），接下来 n 行是命令，按序执行：

- \`add <文本>\`：添加任务（文本可含空格），输出 \`已添加: <文本>\`
- \`list\`：依次输出 \`<序号>. <文本>\`（从 1 起）；列表为空输出 \`(列表为空)\`
- \`rm <序号>\`：删除该序号任务，输出 \`已删除: <文本>\`；序号不存在输出 \`没有第 <序号> 项\`

**输入**：见上（共 n + 1 行）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5\`<br>\`add 买牛奶\`<br>\`add 写作业\`<br>\`list\`<br>\`rm 1\`<br>\`list\` | \`已添加: 买牛奶\`<br>\`已添加: 写作业\`<br>\`1. 买牛奶\`<br>\`2. 写作业\`<br>\`已删除: 买牛奶\`<br>\`1. 写作业\` |
| \`2\`<br>\`list\`<br>\`add 喝水\` | \`(列表为空)\`<br>\`已添加: 喝水\` |`,
    starter: `use std::io;

fn main() {
    let mut line = String::new();
    std::io::stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    let mut todos: Vec<String> = Vec::new();

    // TODO: 循环 n 次读命令行
    //  add: split_once(' ') 取出文本
    //  list: enumerate 从 1 编号，空表打印 (列表为空)
    //  rm: 越界打印 没有第 <序号> 项
}
`,
    solution: `use std::io;

fn main() {
    let mut line = String::new();
    std::io::stdin().read_line(&mut line).unwrap();
    let n: usize = line.trim().parse().unwrap();

    let mut todos: Vec<String> = Vec::new();

    for _ in 0..n {
        let mut line = String::new();
        std::io::stdin().read_line(&mut line).unwrap();
        let line = line.trim();

        let (cmd, rest) = match line.split_once(' ') {
            Some((c, r)) => (c, r),
            None => (line, ""),
        };

        match cmd {
            "add" => {
                todos.push(rest.to_string());
                println!("已添加: {}", rest);
            }
            "list" => {
                if todos.is_empty() {
                    println!("(列表为空)");
                } else {
                    for (i, t) in todos.iter().enumerate() {
                        println!("{}. {}", i + 1, t);
                    }
                }
            }
            "rm" => {
                let idx: usize = rest.parse().unwrap_or(0);
                if idx == 0 || idx > todos.len() {
                    println!("没有第 {} 项", idx);
                } else {
                    let t = todos.remove(idx - 1);
                    println!("已删除: {}", t);
                }
            }
            _ => println!("未知命令: {}", cmd),
        }
    }
}
`,
    hints: [
      '拆命令：`line.split_once(\' \')` 得到 (命令, 参数)。add 的文本要保留空格，所以不能用 split_whitespace。',
      'list 用 `todos.iter().enumerate()`，序号是 `i + 1`；空表特判输出 `(列表为空)`。',
      'rm 校验：`idx == 0 || idx > todos.len()` 时输出 `没有第 {} 项`；合法时 `todos.remove(idx - 1)` 返回被删文本。',
    ],
    tests: [
      { name: '样例：增列删', stdin: '5\nadd 买牛奶\nadd 写作业\nlist\nrm 1\nlist\n', expected: '已添加: 买牛奶\n已添加: 写作业\n1. 买牛奶\n2. 写作业\n已删除: 买牛奶\n1. 写作业' },
      { name: '样例：空表', stdin: '2\nlist\nadd 喝水\n', expected: '(列表为空)\n已添加: 喝水' },
      { name: '隐藏：越界删除', stdin: '3\nadd A\nrm 5\nlist\n', expected: '已添加: A\n没有第 5 项\n1. A', hidden: true },
      { name: '隐藏：多词任务', stdin: '3\nadd 买 牛奶 和 鸡蛋\nlist\nrm 1\n', expected: '已添加: 买 牛奶 和 鸡蛋\n1. 买 牛奶 和 鸡蛋\n已删除: 买 牛奶 和 鸡蛋', hidden: true },
    ],
  },
  {
    id: 'rust-integration-5',
    lang: 'rust',
    module: 'integration',
    order: 5,
    title: '迷你 JSON 解析器',
    difficulty: 5,
    xp: 50,
    goals: [
      '用枚举建模 Json 六种值类型',
      '实现递归下降解析器（skip_ws + peek + 递归）',
      '实现规范化序列化（含键序保留）',
    ],
    brief: `## 迷你 JSON 解析器：递归下降

JSON 只有几种值，正好用一个枚举装下：

\`\`\`rust
enum Json {
    Null,
    Bool(bool),
    Int(i64),
    Float(f64),
    Str(String),
    Arr(Vec<Json>),
    Obj(Vec<(String, Json)>),
}
\`\`\`

### 递归下降：一个指针走天下

解析器 = 一个字符游标 + 每种语法一个函数：

\`\`\`rust
fn parse_value(&mut self) -> Json {
    match self.peek() {
        Some('n') => { self.word("null"); Json::Null }
        Some('"') => Json::Str(self.parse_string()),
        Some('[') => self.parse_array(), // 数组里装 value → 递归！
        Some('{') => self.parse_object(),
        _ => self.parse_number(),
    }
}
\`\`\`

- 数组/对象里嵌套 value，**函数自己调用自己** —— 这就是递归下降；
- \`skip_ws\` 处理任意空白；数字含 \`.\` 或 \`e\` 归 Float，否则 Int；
- 对象用 \`Vec<(String, Json)>\` 保住键的插入顺序（HashMap 会打乱）；
- 规范化输出 = 解析后重渲染：\`{"a":1}\` → \`{"a": 1}\`。

本关字符串不含转义字符（\\、\\"），遇到 \`"\` 即结束。`,
    task: `## 任务：JSON 规范化器

实现迷你 JSON 解析器，支持 \`null\` / \`true\` / \`false\` / 数字 / 字符串 / 数组 / 对象（可任意嵌套，字符串不含转义）。

读入一行 JSON，输出两行：

1. \`顶层类型: <对象/数组/字符串/数字/布尔/null>\`
2. \`规范化: <解析后重新序列化的标准形态>\`

规范化格式：数组 \`[a, b, c]\`（逗号后一个空格）；对象 \`{"k": v, "k2": v2}\`（引号 + 冒号后空格）；键序保持输入顺序；整数去浮点尾巴（\`3.0\` 输出 \`3\`）。

**输入**：一行合法 JSON（长度 ≤ 200）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`{"name": "Zhi", "age": 3, "tags": [1, 2.5, null]}\` | \`顶层类型: 对象\`<br>\`规范化: {"name": "Zhi", "age": 3, "tags": [1, 2.5, null]}\` |
| \`{ "a" : true , "b": null }\` | \`顶层类型: 对象\`<br>\`规范化: {"a": true, "b": null}\` |
| \`42\` | \`顶层类型: 数字\`<br>\`规范化: 42\` |`,
    starter: `use std::io;

// TODO 1: 定义 enum Json { Null, Bool(bool), Int(i64), Float(f64), Str(String), Arr(Vec<Json>), Obj(Vec<(String, Json)>) }

// TODO 2: 实现 Parser（chars + pos，skip_ws / peek / expect / word）
// TODO 3: 实现 parse_value / parse_string / parse_number / parse_array / parse_object
// TODO 4: 实现 render（规范化序列化）与 type_name（顶层类型名）

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let line = input.trim();

    // TODO 5: 解析并输出两行
}
`,
    solution: `use std::io;

#[derive(Debug)]
enum Json {
    Null,
    Bool(bool),
    Int(i64),
    Float(f64),
    Str(String),
    Arr(Vec<Json>),
    Obj(Vec<(String, Json)>),
}

struct Parser {
    chars: Vec<char>,
    pos: usize,
}

impl Parser {
    fn new(s: &str) -> Self {
        Parser {
            chars: s.chars().collect(),
            pos: 0,
        }
    }

    fn peek(&self) -> Option<char> {
        self.chars.get(self.pos).copied()
    }

    fn skip_ws(&mut self) {
        while matches!(self.peek(), Some(' ') | Some('\\t') | Some('\\r') | Some('\\n')) {
            self.pos += 1;
        }
    }

    fn expect(&mut self, c: char) {
        self.skip_ws();
        assert_eq!(self.peek(), Some(c), "期望 '{}'，实际 {:?}", c, self.peek());
        self.pos += 1;
    }

    fn word(&mut self, w: &str) {
        for c in w.chars() {
            assert_eq!(self.chars.get(self.pos), Some(&c));
            self.pos += 1;
        }
    }

    fn parse_value(&mut self) -> Json {
        self.skip_ws();
        match self.peek() {
            Some('n') => {
                self.word("null");
                Json::Null
            }
            Some('t') => {
                self.word("true");
                Json::Bool(true)
            }
            Some('f') => {
                self.word("false");
                Json::Bool(false)
            }
            Some('"') => Json::Str(self.parse_string()),
            Some('[') => self.parse_array(),
            Some('{') => self.parse_object(),
            Some(_) => self.parse_number(),
            None => panic!("意外结束"),
        }
    }

    fn parse_string(&mut self) -> String {
        self.expect('"');
        let mut s = String::new();
        loop {
            let c = self.chars[self.pos];
            self.pos += 1;
            if c == '"' {
                break;
            }
            s.push(c);
        }
        s
    }

    fn parse_number(&mut self) -> Json {
        self.skip_ws();
        let start = self.pos;
        while let Some(c) = self.peek() {
            if c.is_ascii_digit() || c == '-' || c == '+' || c == '.' || c == 'e' || c == 'E' {
                self.pos += 1;
            } else {
                break;
            }
        }
        let text: String = self.chars[start..self.pos].iter().collect();
        if text.contains('.') || text.contains('e') || text.contains('E') {
            Json::Float(text.parse().unwrap())
        } else {
            Json::Int(text.parse().unwrap())
        }
    }

    fn parse_array(&mut self) -> Json {
        self.expect('[');
        let mut items = Vec::new();
        self.skip_ws();
        if self.peek() == Some(']') {
            self.pos += 1;
            return Json::Arr(items);
        }
        loop {
            items.push(self.parse_value());
            self.skip_ws();
            match self.peek() {
                Some(',') => self.pos += 1,
                Some(']') => {
                    self.pos += 1;
                    break;
                }
                other => panic!("数组格式错误：{:?}", other),
            }
        }
        Json::Arr(items)
    }

    fn parse_object(&mut self) -> Json {
        self.expect('{');
        let mut pairs = Vec::new();
        self.skip_ws();
        if self.peek() == Some('}') {
            self.pos += 1;
            return Json::Obj(pairs);
        }
        loop {
            self.skip_ws();
            let key = self.parse_string();
            self.expect(':');
            let value = self.parse_value();
            pairs.push((key, value));
            self.skip_ws();
            match self.peek() {
                Some(',') => self.pos += 1,
                Some('}') => {
                    self.pos += 1;
                    break;
                }
                other => panic!("对象格式错误：{:?}", other),
            }
        }
        Json::Obj(pairs)
    }
}

fn render(j: &Json) -> String {
    match j {
        Json::Null => "null".to_string(),
        Json::Bool(b) => b.to_string(),
        Json::Int(n) => n.to_string(),
        Json::Float(f) => f.to_string(),
        Json::Str(s) => format!("\\"{}\\"", s),
        Json::Arr(items) => {
            let parts: Vec<String> = items.iter().map(render).collect();
            format!("[{}]", parts.join(", "))
        }
        Json::Obj(pairs) => {
            let parts: Vec<String> = pairs
                .iter()
                .map(|(k, v)| format!("\\"{}\\": {}", k, render(v)))
                .collect();
            format!("{{{}}}", parts.join(", "))
        }
    }
}

fn type_name(j: &Json) -> &'static str {
    match j {
        Json::Null => "null",
        Json::Bool(_) => "布尔",
        Json::Int(_) | Json::Float(_) => "数字",
        Json::Str(_) => "字符串",
        Json::Arr(_) => "数组",
        Json::Obj(_) => "对象",
    }
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let line = input.trim();

    let mut parser = Parser::new(line);
    let value = parser.parse_value();

    println!("顶层类型: {}", type_name(&value));
    println!("规范化: {}", render(&value));
}
`,
    hints: [
      '解析器骨架：`peek()` 看当前字符、`skip_ws()` 跳空白、`parse_value()` 按 peek 分派到 null/true/false/字符串/数组/对象/数字七个入口。',
      '数字二分：扫描出数字文本后，含 `.` 或 e/E → Float，否则 Int。渲染时 f64 的 {} 会把 2.5 打成 2.5、3.0 打成 3。',
      '数组/对象循环：先 parse_value，再 peek 逗号（继续）或闭括号（结束）。对象键序用 Vec<(String, Json)> 天然保留。',
    ],
    tests: [
      { name: '样例：混合对象', stdin: '{"name": "Zhi", "age": 3, "tags": [1, 2.5, null]}\n', expected: '顶层类型: 对象\n规范化: {"name": "Zhi", "age": 3, "tags": [1, 2.5, null]}' },
      { name: '样例：嵌套数组', stdin: '[1, [2, 3], "x"]\n', expected: '顶层类型: 数组\n规范化: [1, [2, 3], "x"]' },
      { name: '样例：纯数字', stdin: '42\n', expected: '顶层类型: 数字\n规范化: 42' },
      { name: '隐藏：宽松空白', stdin: '  {"a" : true , "b": null}  \n', expected: '顶层类型: 对象\n规范化: {"a": true, "b": null}', hidden: true },
      { name: '隐藏：null 顶层', stdin: 'null\n', expected: '顶层类型: null\n规范化: null', hidden: true },
      { name: '隐藏：空容器', stdin: '{"empty": {}, "list": []}\n', expected: '顶层类型: 对象\n规范化: {"empty": {}, "list": []}', hidden: true },
    ],
  },
];
