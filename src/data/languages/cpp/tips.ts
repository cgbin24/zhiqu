import type { Level } from '@/types';

/** C++ · 第四章：开发实用技巧（6 关） */
export const CPP_TIPS: Level[] = [
  {
    id: 'cpp-tips-1',
    lang: 'cpp',
    module: 'tips',
    order: 1,
    title: 'iostream 加速三件套',
    difficulty: 2,
    xp: 20,
    goals: [
      '知道 cin/cout 默认与 C stdio 同步的性能开销',
      '掌握 sync_with_stdio(false) 与 cin.tie(nullptr)',
      '养成用 \\n 而非 endl 的习惯',
    ],
    brief: `## 比赛中 cin/cout 慢吗？

默认很慢，原因是三笔"隐形税"：

1. **C/C++ 流同步**：为兼容 printf/scanf 混用，cin/cout 每次操作都和 C 的 stdio 缓冲保持同步。关闭它：\`std::ios::sync_with_stdio(false);\`
2. **cin 绑定 cout**：默认每次 \`cin >>\` 前都强制刷新 cout（为了交互式提示）。比赛不需要，解绑：\`std::cin.tie(nullptr);\`
3. **endl 的刷新**：\`endl = 输出 '\\n' + 立刻 flush 缓冲区\`。十万行 endl 就是十万次系统级刷新，改用 \`'\\n'\`。

\`\`\`cpp
int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    // 之后正常 cin / cout，吞吐量可提升数倍
}
\`\`\`

### 三条纪律

- 这两行设置必须写在**任何 I/O 之前**。
- 关闭同步后**别再混用** printf/scanf 与 cin/cout。
- 刷题输出一律 \`\\n\`，只有交互题、需要实时看输出时才用 endl。`,
    task: `## 任务：高速转发器

读入 n 个整数，用开启加速三件套的流把它们**原样输出**（一行，空格分隔），再输出统计行。

**输入**：第一行 n（1 ≤ n ≤ 100000）；第二行 n 个整数

**输出**：两行

1. n 个整数，按输入顺序，数字间一个空格（行尾无空格）
2. \`共 <n> 个\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5\`<br>\`3 1 4 1 5\` | \`3 1 4 1 5\`<br>\`共 5 个\` |
| \`1\`<br>\`42\` | \`42\`<br>\`共 1 个\` |

在 main 最前面写好两行加速设置——本题数据量小看不出差别，但肌肉记忆从此养成。`,
    starter: `#include <iostream>
#include <vector>

int main() {
    // TODO 0: 开启加速三件套（sync_with_stdio + cin.tie）
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (auto& x : v) std::cin >> x;

    // TODO 1: 输出一行整数，空格分隔、行尾无空格
    // TODO 2: 输出"共 n 个"
    return 0;
}
`,
    solution: `#include <iostream>
#include <vector>

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);

    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (auto& x : v) std::cin >> x;

    for (int i = 0; i < n; ++i) {
        if (i > 0) std::cout << ' ';
        std::cout << v[i];
    }
    std::cout << '\\n';
    std::cout << "共 " << n << " 个\\n";
    return 0;
}
`,
    hints: [
      '两行加速：`std::ios::sync_with_stdio(false);` 和 `std::cin.tie(nullptr);`，必须放在任何 cin/cout 之前。',
      '分隔符技巧：循环里 `if (i > 0) std::cout << \' \';`——第一个数前不加空格，行尾自然没有空格。',
      '换行统一用字符 `\'\\n\'`（单引号）或字符串 `"\\n"`，不要用 endl；最后一行格式为 `共 n 个`（共 后 数字前 各一个空格）。',
    ],
    tests: [
      { name: '样例 1：3 1 4 1 5', stdin: '5\n3 1 4 1 5\n', expected: '3 1 4 1 5\n共 5 个' },
      { name: '样例 2：单元素', stdin: '1\n42\n', expected: '42\n共 1 个' },
      { name: '隐藏：负数与零', stdin: '3\n-7 0 9\n', expected: '-7 0 9\n共 3 个', hidden: true },
      { name: '隐藏：大数', stdin: '6\n1000000 2 3 4 5 6\n', expected: '1000000 2 3 4 5 6\n共 6 个', hidden: true },
    ],
  },
  {
    id: 'cpp-tips-2',
    lang: 'cpp',
    module: 'tips',
    order: 2,
    title: '现代语法糖三连',
    difficulty: 2,
    xp: 20,
    goals: [
      '用 auto 简化冗长的类型声明',
      '用范围 for 遍历容器',
      '用 C++17 结构化绑定解包 pair/map 元素',
    ],
    brief: `## 三颗糖：auto、范围 for、结构化绑定

**auto**——让编译器替你写类型：

\`\`\`cpp
auto n = 42;                                  // int
auto it = scores.find("alice");               // 冗长的迭代器类型不用写了
for (auto& [name, score] : scores) { ... }    // 与范围 for、绑定配合更香
\`\`\`

**范围 for**——告别 begin()/end() 样板：

\`\`\`cpp
for (int x : v) ...           // 拷贝每个元素
for (int& x : v) x *= 2;      // 引用：可修改
for (const auto& x : v) ...   // 大对象只读的标准姿势，零拷贝
\`\`\`

**结构化绑定（C++17）**——一把拆开 pair / tuple / map 元素：

\`\`\`cpp
std::map<std::string, int> scores = {{"alice", 90}, {"bob", 85}};
for (const auto& [name, score] : scores) {   // 拆成键和值
    std::cout << name << ": " << score << "\\n";
}
\`\`\`

> ⚠️ \`auto\` 推导会丢弃引用与 const，想要"原样别名"请写 \`auto&\` 或 \`const auto&\`。map 遍历顺序永远是按键升序。`,
    task: `## 任务：成绩册美化器

读入 n 条 \`<名字> <分数>\` 记录，放入 \`std::map<std::string, int>\`，用**范围 for + 结构化绑定**遍历输出，最后报告最高分。

**输入**：第一行 n（1 ≤ n ≤ 1000）；接下来 n 行，每行一个不含空格的名字和一个整数分数（同名后到覆盖先到）

**输出**：先按名字字典序输出 n' 行 \`<名字>: <分数>\`（去重后条数），最后一行 \`最高分: <最大分数>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`alice 90\`<br>\`bob 85\`<br>\`zoe 92\` | \`alice: 90\`<br>\`bob: 85\`<br>\`zoe: 92\`<br>\`最高分: 92\` |
| \`2\`<br>\`b 50\`<br>\`a 50\` | \`a: 50\`<br>\`b: 50\`<br>\`最高分: 50\` |`,
    starter: `#include <iostream>
#include <map>
#include <string>

int main() {
    int n;
    std::cin >> n;
    std::map<std::string, int> scores;
    // TODO 1: 读入 n 条记录写入 map（同名覆盖）

    // TODO 2: 范围 for + 结构化绑定遍历输出
    // TODO 3: 输出最高分行
    return 0;
}
`,
    solution: `#include <iostream>
#include <map>
#include <string>

int main() {
    int n;
    std::cin >> n;
    std::map<std::string, int> scores;
    for (int i = 0; i < n; ++i) {
        std::string name;
        int score;
        std::cin >> name >> score;
        scores[name] = score;
    }

    int best = 0;
    bool first = true;
    for (const auto& [name, score] : scores) {
        std::cout << name << ": " << score << "\\n";
        if (first || score > best) {
            best = score;
            first = false;
        }
    }
    std::cout << "最高分: " << best << "\\n";
    return 0;
}
`,
    hints: [
      '写入用 `scores[name] = score;`，同名自动覆盖；map 按键（名字）升序存储，直接遍历就是字典序。',
      '结构化绑定写法：`for (const auto& [name, score] : scores)`——name、score 分别绑定 map 元素的键和值。',
      '最高分用一个变量在遍历中维护：先 `bool first = true;` 处理首个元素，之后取 `score > best` 的较大者（分数可能为负时这个细节救命）。',
    ],
    tests: [
      { name: '样例 1：三人成绩', stdin: '3\nalice 90\nbob 85\nzoe 92\n', expected: 'alice: 90\nbob: 85\nzoe: 92\n最高分: 92' },
      { name: '样例 2：并列最低', stdin: '2\nb 50\na 50\n', expected: 'a: 50\nb: 50\n最高分: 50' },
      { name: '隐藏：单人', stdin: '1\nsolo 77\n', expected: 'solo: 77\n最高分: 77', hidden: true },
      { name: '隐藏：同名覆盖', stdin: '4\nzoe 10\namy 20\nzoe 30\nbob 5\n', expected: 'amy: 20\nbob: 5\nzoe: 30\n最高分: 30', hidden: true },
    ],
  },
  {
    id: 'cpp-tips-3',
    lang: 'cpp',
    module: 'tips',
    order: 3,
    title: '踩坑：迭代器失效',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解 vector 扩容导致所有迭代器失效',
      '掌握 erase 使被删位置之后的迭代器失效',
      '学会 erase-remove / std::erase_if 安全删除',
    ],
    brief: `## 迭代器为什么会"失效"

迭代器可以理解为"包装过的指针"。vector 底层是一块连续内存，两种情况会让它变成**悬空指针**：

1. **扩容**：push_back 触发重新分配，整块内存搬家，**所有**迭代器/指针/引用全部失效。
2. **erase**：删除点之后的元素整体前移，**删除点及之后**的迭代器失效。

经典的崩溃写法：

\`\`\`cpp
for (auto it = v.begin(); it != v.end(); ++it) {
    if (*it % 2 == 0) v.erase(it);   // ❌ it 已失效，++it 是未定义行为
}
\`\`\`

### 正确姿势一：erase 返回下一个

\`erase\` 返回"被删元素的下一个"的有效迭代器：

\`\`\`cpp
for (auto it = v.begin(); it != v.end();) {
    if (*it % 2 == 0) it = v.erase(it);  // 用返回值续命
    else ++it;
}
\`\`\`

### 正确姿势二：erase-remove / C++20 erase_if

\`\`\`cpp
v.erase(std::remove(v.begin(), v.end(), 0), v.end());   // 经典惯用法
std::erase_if(v, [](int x) { return x % 2 == 0; });     // C++20 一行搞定
\`\`\``,
    task: `## 任务：安全删除偶数

读入 n 个整数，从 vector 中删除**所有偶数**（0 也是偶数），保持其余元素相对顺序。

**输入**：第一行 n（1 ≤ n ≤ 100000）；第二行 n 个整数

**输出**：两行

1. \`剩余: <删除后的序列>\`；若一个不剩，输出 \`剩余: 空\`
2. \`个数: <删除后 size()>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`6\`<br>\`1 2 3 4 5 6\` | \`剩余: 1 3 5\`<br>\`个数: 3\` |
| \`4\`<br>\`2 4 6 8\` | \`剩余: 空\`<br>\`个数: 0\` |

推荐用 C++20 的 \`std::erase_if\`，或写对 \`it = v.erase(it)\` 的循环。`,
    starter: `#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (auto& x : v) std::cin >> x;

    // TODO 1: 安全删除所有偶数
    // 方案 A：std::erase_if(v, 谓词)（C++20）
    // 方案 B：it = v.erase(it) 循环

    // TODO 2: 输出"剩余:"行（空时输出 空）与"个数:"行
    return 0;
}
`,
    solution: `#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (auto& x : v) std::cin >> x;

    std::erase_if(v, [](int x) { return x % 2 == 0; });

    std::cout << "剩余:";
    if (v.empty()) {
        std::cout << " 空";
    } else {
        for (int x : v) std::cout << " " << x;
    }
    std::cout << "\\n";
    std::cout << "个数: " << v.size() << "\\n";
    return 0;
}
`,
    hints: [
      'C++20 一行删除：`std::erase_if(v, [](int x) { return x % 2 == 0; });`，不用自己操心迭代器失效。',
      '如果想练 erase 循环：`for (auto it = v.begin(); it != v.end();) { if (*it % 2 == 0) it = v.erase(it); else ++it; }`——关键是用 erase 的返回值更新 it。',
      '剩余行注意：空时输出 `剩余: 空`；非空时每个数字前补空格（`" " << x`），保证没有行尾空格。负奇数如 -1 要保留。',
    ],
    tests: [
      { name: '样例 1：1 2 3 4 5 6', stdin: '6\n1 2 3 4 5 6\n', expected: '剩余: 1 3 5\n个数: 3' },
      { name: '样例 2：全偶数', stdin: '4\n2 4 6 8\n', expected: '剩余: 空\n个数: 0' },
      { name: '隐藏：单奇数', stdin: '1\n7\n', expected: '剩余: 7\n个数: 1', hidden: true },
      { name: '隐藏：负数与零', stdin: '5\n-2 -1 0 3 8\n', expected: '剩余: -1 3\n个数: 2', hidden: true },
    ],
  },
  {
    id: 'cpp-tips-4',
    lang: 'cpp',
    module: 'tips',
    order: 4,
    title: '踩坑：未初始化与越界 UB',
    difficulty: 3,
    xp: 30,
    goals: [
      '认识未初始化读取与越界访问都是未定义行为',
      '学会初始化所有变量、先检查再访问',
      '用确定行为重写危险代码',
    ],
    brief: `## UB：未定义行为，程序界的"黑洞"

**未定义行为（Undefined Behavior）**指标准不管的代码——不报错、不崩溃都算"正常"，编译器可以生成任何行为。两大常见来源：

\`\`\`cpp
int x;                 // ❌ 未初始化：x 是随机垃圾值
std::cout << x;        //   读到什么全看运气

std::vector<int> v(3);
v[5] = 1;              // ❌ 越界写：operator[] 不做检查
v[-1];                 //   下标为负同样越界
\`\`\`

### 防御三板斧

1. **声明即初始化**：\`int x = 0;\`、\`std::vector<int> v(n, 0);\`（n 个 0）。
2. **访问前检查边界**：\`if (i >= 0 && i < v.size())\`。
3. **拿不准就用 at()**：\`v.at(5)\` 越界会抛 \`std::out_of_range\` 异常，可被捕获——慢一点但绝不含糊。

\`\`\`cpp
try {
    std::cout << v.at(i);
} catch (const std::out_of_range& e) {
    std::cout << "越界";
}
\`\`\``,
    task: `## 任务：安全下标查询器

读入 n 个整数存入 vector（显式初始化），然后回答 q 个下标查询。**必须用确定行为**处理越界。

**输入**：第一行 n（1 ≤ n ≤ 100000）；第二行 n 个整数；第三行 q（1 ≤ q ≤ 1000）；第四行 q 个整数下标（可能是负数或 ≥ n）

**输出**：q 行，每个查询一行

- 合法：\`下标 <i>: 值 <v[i]>\`
- 越界（i < 0 或 i ≥ n）：\`下标 <i>: 越界\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`10 20 30\`<br>\`3\`<br>\`0 2 5\` | \`下标 0: 值 10\`<br>\`下标 2: 值 30\`<br>\`下标 5: 越界\` |
| \`1\`<br>\`7\`<br>\`2\`<br>\`0 -1\` | \`下标 0: 值 7\`<br>\`下标 -1: 越界\` |`,
    starter: `#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    // TODO 1: 用 std::vector<int> v(n, 0) 显式初始化后读入

    int q;
    std::cin >> q;
    // TODO 2: 每个查询先检查 0 <= idx < n，再决定输出值还是"越界"
    return 0;
}
`,
    solution: `#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n, 0);
    for (auto& x : v) std::cin >> x;

    int q;
    std::cin >> q;
    for (int i = 0; i < q; ++i) {
        int idx;
        std::cin >> idx;
        if (idx < 0 || idx >= n) {
            std::cout << "下标 " << idx << ": 越界\\n";
        } else {
            std::cout << "下标 " << idx << ": 值 " << v[idx] << "\\n";
        }
    }
    return 0;
}
`,
    hints: [
      '显式初始化：`std::vector<int> v(n, 0);`——就算忘了读入，值也是确定的 0，绝不读垃圾。',
      '判断条件：`idx < 0 || idx >= n` 为真就是越界。负下标千万别漏，\`v[-1]\` 不是报错而是内存炸弹。',
      '输出两种格式：`下标 <idx>: 值 <v[idx]>` 与 `下标 <idx>: 越界`，冒号后都有一个空格。',
    ],
    tests: [
      { name: '样例 1：0 2 5', stdin: '3\n10 20 30\n3\n0 2 5\n', expected: '下标 0: 值 10\n下标 2: 值 30\n下标 5: 越界' },
      { name: '样例 2：负下标', stdin: '1\n7\n2\n0 -1\n', expected: '下标 0: 值 7\n下标 -1: 越界' },
      { name: '隐藏：边界 n', stdin: '4\n1 2 3 4\n4\n3 4 -1 1\n', expected: '下标 3: 值 4\n下标 4: 越界\n下标 -1: 越界\n下标 1: 值 2', hidden: true },
      { name: '隐藏：单查末位', stdin: '2\n5 8\n1\n1\n', expected: '下标 1: 值 8', hidden: true },
    ],
  },
  {
    id: 'cpp-tips-5',
    lang: 'cpp',
    module: 'tips',
    order: 5,
    title: 'STL 速查百宝袋',
    difficulty: 2,
    xp: 25,
    goals: [
      '用 minmax_element 一次拿到最小与最大',
      '用 count / find 做统计与存在性判断',
      '知道 emplace_back 能省一次拷贝',
    ],
    brief: `## 三个高频小工具

**minmax_element**——一趟遍历同时返回最小、最大（返回一对迭代器）：

\`\`\`cpp
auto mm = std::minmax_element(v.begin(), v.end());
*mm.first;   // 最小值
*mm.second;  // 最大值
\`\`\`

**count / find**——统计与查找（线性扫描）：

\`\`\`cpp
int cnt = std::count(v.begin(), v.end(), t);              // t 出现几次
auto it = std::find(v.begin(), v.end(), t);
bool has = (it != v.end());                               // 是否存在
\`\`\`

**emplace_back vs push_back**——emplace 直接在容器内存上**原地构造**对象，省去"先构造临时对象再拷贝"的一步；对 int 这类小对象差别不大，对 string、自定义类是白捡的性能：

\`\`\`cpp
v.emplace_back(x);   // 推荐
v.push_back(x);      // 也对
\`\`\`

> 💡 频繁 push 时先 \`v.reserve(n);\` 一次性预留容量，避免反复扩容搬家。`,
    task: `## 任务：数据速查仪

读入 n 个整数和目标值 t，用 STL 完成三项速查。

**输入**：第一行 n（1 ≤ n ≤ 100000）；第二行 n 个整数；第三行 t

**输出**：三行

1. \`最小: <mn>, 最大: <mx>\`
2. \`<t> 出现: <cnt> 次\`
3. \`包含 <t>: 是/否\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`7\`<br>\`4 2 7 2 9 2 1\`<br>\`2\` | \`最小: 1, 最大: 9\`<br>\`2 出现: 3 次\`<br>\`包含 2: 是\` |
| \`3\`<br>\`1 2 3\`<br>\`5\` | \`最小: 1, 最大: 3\`<br>\`5 出现: 0 次\`<br>\`包含 5: 否\` |`,
    starter: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v;
    v.reserve(n);
    // TODO 1: 循环用 emplace_back 读入 n 个数

    int t;
    std::cin >> t;
    // TODO 2: minmax_element 输出第一行
    // TODO 3: count 输出出现次数
    // TODO 4: find 输出 是否包含
    return 0;
}
`,
    solution: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v;
    v.reserve(n);
    for (int i = 0; i < n; ++i) {
        int x;
        std::cin >> x;
        v.emplace_back(x);
    }
    int t;
    std::cin >> t;

    auto mm = std::minmax_element(v.begin(), v.end());
    std::cout << "最小: " << *mm.first << ", 最大: " << *mm.second << "\\n";

    int cnt = static_cast<int>(std::count(v.begin(), v.end(), t));
    std::cout << t << " 出现: " << cnt << " 次\\n";

    bool found = std::find(v.begin(), v.end(), t) != v.end();
    std::cout << "包含 " << t << ": " << (found ? "是" : "否") << "\\n";
    return 0;
}
`,
    hints: [
      'minmax_element 返回一对迭代器：`auto mm = std::minmax_element(v.begin(), v.end());`，`*mm.first` 最小、`*mm.second` 最大。',
      '计数与查找：`std::count(v.begin(), v.end(), t)` 返回次数（记得转 int）；存在性可以 `std::find(...) != v.end()` 判断。',
      '输出格式细节：第一行逗号后有空格（`最小: 1, 最大: 9`）；第三行用三目运算符选 "是" 或 "否"。',
    ],
    tests: [
      { name: '样例 1：4 2 7 2 9 2 1', stdin: '7\n4 2 7 2 9 2 1\n2\n', expected: '最小: 1, 最大: 9\n2 出现: 3 次\n包含 2: 是' },
      { name: '样例 2：目标不存在', stdin: '3\n1 2 3\n5\n', expected: '最小: 1, 最大: 3\n5 出现: 0 次\n包含 5: 否' },
      { name: '隐藏：单元素', stdin: '1\n8\n8\n', expected: '最小: 8, 最大: 8\n8 出现: 1 次\n包含 8: 是', hidden: true },
      { name: '隐藏：负数目标', stdin: '5\n-3 -3 0 -3 5\n-3\n', expected: '最小: -3, 最大: 5\n-3 出现: 3 次\n包含 -3: 是', hidden: true },
    ],
  },
  {
    id: 'cpp-tips-6',
    lang: 'cpp',
    module: 'tips',
    order: 6,
    title: '调试与断言哨兵',
    difficulty: 3,
    xp: 30,
    goals: [
      '区分运行期 assert 与编译期 static_assert',
      '学会写 do-while(0) 包裹的安全 CHECK 宏',
      '用输出追踪定位逻辑错误',
    ],
    brief: `## 断言：让错误自己站出来

**static_assert**——编译期断言，条件不成立直接编译失败，零运行时开销：

\`\`\`cpp
static_assert(sizeof(int) >= 4, "本程序要求 int 至少 4 字节");
\`\`\`

**assert**——运行期断言（\`<cassert>\`），条件为假就终止程序并报告位置；发布版定义 \`NDEBUG\` 后全部消失：

\`\`\`cpp
assert(idx < v.size());  // 调试期守门员
\`\`\`

### 刷题更好用的 CHECK 宏

assert 在评测机上可能被优化开关影响，自己写一个**不中断、会报告**的宏更稳：

\`\`\`cpp
#define CHECK(cond, msg)              \\
    do {                              \\
        if (!(cond)) {                \\
            std::cout << "FAIL: " << msg << "\\n"; \\
            ++failures;               \\
        }                             \\
    } while (0)
\`\`\`

两个细节：

- **do { } while (0)**：让宏在任何 if/else 分支里都表现为"一条语句"，这是宏的标准护甲。
- **每行末尾的 \\\\**：宏定义必须是逻辑上的一行，反斜杠是续行符。`,
    task: `## 任务：三重哨兵检查

实现 \`CHECK(cond, msg)\` 宏（失败打印 \`FAIL: <msg>\` 并计数，不中断程序），再用 \`static_assert\` 做编译期检查。

读入三个整数 a b c，依次执行三个检查：

1. \`CHECK(a > 0, "a 必须为正")\`
2. \`CHECK(b >= a, "b 不得小于 a")\`
3. \`CHECK(c != 0, "c 不得为零")\`

**输入**：一行三个整数 a b c

**输出**：每条失败的检查一行 \`FAIL: <消息>\`（按检查顺序），最后输出 \`通过: <p>/3\`（p 为通过的条数）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5 3 0\` | \`FAIL: b 不得小于 a\`<br>\`FAIL: c 不得为零\`<br>\`通过: 1/3\` |
| \`10 20 5\` | \`通过: 3/3\` |

宏里的 \`do { } while (0)\` 和行尾续行符 \`\\\\\` 都不能少。`,
    starter: `#include <iostream>

int g_fails = 0;

// TODO 1: 定义 CHECK(cond, msg) 宏
// do { if (!(cond)) { 打印 FAIL: msg; ++g_fails; } } while (0)
// 注意每行末尾的续行符

int main() {
    // TODO 2: static_assert 检查 sizeof(int) >= 4

    int a, b, c;
    std::cin >> a >> b >> c;
    // TODO 3: 三个 CHECK，最后输出 通过: 3-g_fails /3
    return 0;
}
`,
    solution: `#include <iostream>

int g_fails = 0;

#define CHECK(cond, msg)                                  \\
    do {                                                  \\
        if (!(cond)) {                                    \\
            std::cout << "FAIL: " << msg << "\\n";         \\
            ++g_fails;                                    \\
        }                                                 \\
    } while (0)

int main() {
    static_assert(sizeof(int) >= 4, "本程序要求 int 至少 4 字节");

    int a, b, c;
    std::cin >> a >> b >> c;
    CHECK(a > 0, "a 必须为正");
    CHECK(b >= a, "b 不得小于 a");
    CHECK(c != 0, "c 不得为零");
    std::cout << "通过: " << 3 - g_fails << "/3\\n";
    return 0;
}
`,
    hints: [
      '宏骨架：`#define CHECK(cond, msg) do { if (!(cond)) { std::cout << "FAIL: " << msg << "\\n"; ++g_fails; } } while (0)`——多行书写时每行末尾加反斜杠续行。',
      '检查顺序固定：a > 0、b >= a、c != 0，失败的按顺序各打印一行，FAIL 行之间没有其他输出。',
      '通过数是 `3 - g_fails`。注意 b >= a 用的是大于等于：a=0、b=0 时第二条是**通过**的。',
    ],
    tests: [
      { name: '样例 1：5 3 0', stdin: '5 3 0\n', expected: 'FAIL: b 不得小于 a\nFAIL: c 不得为零\n通过: 1/3' },
      { name: '样例 2：全过', stdin: '10 20 5\n', expected: '通过: 3/3' },
      { name: '隐藏：a 为零', stdin: '0 0 0\n', expected: 'FAIL: a 必须为正\nFAIL: c 不得为零\n通过: 1/3', hidden: true },
      { name: '隐藏：负数组合', stdin: '-1 -5 3\n', expected: 'FAIL: a 必须为正\nFAIL: b 不得小于 a\n通过: 1/3', hidden: true },
    ],
  },
];
