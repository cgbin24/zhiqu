import type { Level } from '@/types';

/** C++ · 第六章：跨领域融会贯通（5 关） */
export const CPP_INTEGRATION: Level[] = [
  {
    id: 'cpp-integration-1',
    lang: 'cpp',
    module: 'integration',
    order: 1,
    title: '词频统计器',
    difficulty: 4,
    xp: 35,
    goals: [
      '用 map 完成计数与有序存储',
      '用自定义比较器实现多关键字排序',
      '综合 map + vector<pair> + sort + 结构化绑定',
    ],
    brief: `## 词频统计：STL 组合拳

统计"每个单词出现几次"是 map 的看家本领，配合 vector + sort 可以做任意排序：

\`\`\`cpp
std::map<std::string, int> freq;
std::string w;
while (读入单词) ++freq[w];        // operator[] 不存在则默认 0，自增即计数

std::vector<std::pair<std::string, int>> items(freq.begin(), freq.end());
std::sort(items.begin(), items.end(), [](const auto& a, const auto& b) {
    if (a.second != b.second) return a.second > b.second;  // 次数降序
    return a.first < b.first;                              // 同次按字典序
});
\`\`\`

### 多关键字排序的思维

比较器回答"谁应该排前面"：先比主关键字（次数，大的在前），主关键字相同时再比次关键字（单词，小的在前）。

### 为什么要搬进 vector

map 只能按键排序。要按"值"排序，就得把键值对**倒进 vector**，交给 sort 自由发挥——这是 STL 的标准协作模式。

> ⚠️ 比较器必须满足"严格弱序"：相等元素两次比较结果要一致。写 \`a.second > b.second\` 就别再混入 \`>=\`。`,
    task: `## 任务：词频统计器

读入 n 个单词（不含空格），统计词频，按 **出现次数降序** 输出；次数相同的按**字典序升序**。

**输入**：第一行 n（1 ≤ n ≤ 100000）；第二行 n 个单词（小写字母组成，长度 1~20）

**输出**：每个不同单词一行，格式 \`<单词> <次数>\`（单词与次数间一个空格）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`8\`<br>\`apple banana apple cherry banana apple date cherry\` | \`apple 3\`<br>\`banana 2\`<br>\`cherry 2\`<br>\`date 1\` |
| \`6\`<br>\`b b a a c c\` | \`a 2\`<br>\`b 2\`<br>\`c 2\` |`,
    starter: `#include <algorithm>
#include <iostream>
#include <map>
#include <string>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    // TODO 1: 用 map<string,int> 统计词频
    // TODO 2: 倒入 vector<pair<string,int>>
    // TODO 3: sort + 比较器（次数降序、同次字典序升序）
    // TODO 4: 遍历输出（可用结构化绑定）
    return 0;
}
`,
    solution: `#include <algorithm>
#include <iostream>
#include <map>
#include <string>
#include <utility>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::map<std::string, int> freq;
    for (int i = 0; i < n; ++i) {
        std::string w;
        std::cin >> w;
        ++freq[w];
    }

    std::vector<std::pair<std::string, int>> items(freq.begin(), freq.end());
    std::sort(items.begin(), items.end(),
              [](const auto& a, const auto& b) {
                  if (a.second != b.second) return a.second > b.second;
                  return a.first < b.first;
              });

    for (const auto& [word, count] : items) {
        std::cout << word << " " << count << "\\n";
    }
    return 0;
}
`,
    hints: [
      '计数核心一行：`++freq[w];`——map 的 operator[] 对不存在的键自动插入 0，自增即完成统计。',
      '比较器先比次数再比单词：`if (a.second != b.second) return a.second > b.second; return a.first < b.first;`（次数降序、同次字典序升序）。',
      '输出用结构化绑定：`for (const auto& [word, count] : items) std::cout << word << " " << count << "\\n";`，单词与数字间一个空格。',
    ],
    tests: [
      { name: '样例 1：水果单词', stdin: '8\napple banana apple cherry banana apple date cherry\n', expected: 'apple 3\nbanana 2\ncherry 2\ndate 1' },
      { name: '样例 2：全并列', stdin: '6\nb b a a c c\n', expected: 'a 2\nb 2\nc 2' },
      { name: '隐藏：全部不同', stdin: '3\nx y z\n', expected: 'x 1\ny 1\nz 1', hidden: true },
      { name: '隐藏：两词对比', stdin: '5\ngo rust go rust go\n', expected: 'go 3\nrust 2', hidden: true },
    ],
  },
  {
    id: 'cpp-integration-2',
    lang: 'cpp',
    module: 'integration',
    order: 2,
    title: 'LRU 缓存',
    difficulty: 4,
    xp: 40,
    goals: [
      '理解 LRU 淘汰策略：淘汰最久未使用的键',
      '用 list 维护访问顺序、unordered_map 实现 O(1) 定位',
      '综合处理 put / get / 淘汰 / 更新四种情形',
    ],
    brief: `## LRU：操作系统与面试的双料明星

LRU（Least Recently Used）缓存的规则：

- **get(k)**：命中返回值，且 k 变为"最近使用"；未命中返回 -1。
- **put(k, v)**：写入/更新 k，k 变为"最近使用"；容量已满且 k 是新键时，**淘汰最久未使用**的键。

### 双剑合璧：list + unordered_map

\`\`\`cpp
std::list<std::pair<int,int>> order;            // front = 最近使用
std::unordered_map<int, std::list<std::pair<int,int>>::iterator> pos;

// 定位：pos[k] 直接拿到 list 里的位置，O(1)
// 挪动：把该节点 splice/erase 后 emplace_front，O(1)
// 淘汰：order.back() 就是最久未使用，pop_back，O(1)
\`\`\`

list 的**任意位置 O(1) 摘除** + 哈希表的 **O(1) 查找**，组合出全 O(1) 的 LRU——单用一个 map 或 vector 都做不到。

### 判重细节

put 已存在的键是**更新**（不淘汰、挪到 front）；put 新键且已满才淘汰。get 未命中不改顺序。`,
    task: `## 任务：容量 2~3 的迷你 LRU

实现 LRU 缓存并模拟操作序列。键值都是整数。

**输入**：第一行两个整数 \`容量 操作数\`（1 ≤ 容量 ≤ 3，1 ≤ 操作数 ≤ 1000）；接下来每行一条操作：

- \`put k v\` —— 写入
- \`get k\` —— 查询：命中输出值，未命中输出 \`-1\`

**输出**：每个 get 一行结果；最后输出 \`最终: [k1, k2, ...]\`——从**最近使用到最久未使用**列出所有键（缓存为空输出 \`最终: []\`）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`2 6\`<br>\`put 1 10\`<br>\`put 2 20\`<br>\`get 1\`<br>\`put 3 30\`<br>\`get 2\`<br>\`get 1\` | \`10\`<br>\`-1\`<br>\`10\`<br>\`最终: [1, 3]\` |
| \`3 9\`<br>\`put 1 100\`<br>\`put 2 200\`<br>\`put 3 300\`<br>\`get 1\`<br>\`put 4 400\`<br>\`get 2\`<br>\`get 3\`<br>\`put 1 999\`<br>\`get 1\` | \`100\`<br>\`-1\`<br>\`300\`<br>\`999\`<br>\`最终: [1, 3, 4]\` |

样例 1 解读：put 3 时容量满，淘汰最久未使用的 2；get 1 后 1 成为最新，顺序为 [1, 3]。`,
    starter: `#include <iostream>
#include <list>
#include <string>
#include <unordered_map>
#include <utility>

int main() {
    int capacity, m;
    std::cin >> capacity >> m;

    std::list<std::pair<int, int>> order;  // front = 最近使用
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> pos;

    // TODO 1: 写 touch(key, value)：把 key 挪到 front（已存在先擦除）
    // TODO 2: 写 evictIfNeeded()：超过容量时淘汰 order.back()
    // TODO 3: 循环处理 put / get，get 输出结果
    // TODO 4: 输出 最终: [k1, k2, ...]
    return 0;
}
`,
    solution: `#include <iostream>
#include <list>
#include <string>
#include <unordered_map>
#include <utility>

int main() {
    int capacity, m;
    std::cin >> capacity >> m;

    std::list<std::pair<int, int>> order;
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> pos;

    auto touch = [&](int key, int value) {
        auto it = pos.find(key);
        if (it != pos.end()) {
            order.erase(it->second);
            pos.erase(it);
        }
        order.emplace_front(key, value);
        pos[key] = order.begin();
    };

    auto evictIfNeeded = [&] {
        if (static_cast<int>(order.size()) > capacity) {
            pos.erase(order.back().first);
            order.pop_back();
        }
    };

    for (int i = 0; i < m; ++i) {
        std::string op;
        std::cin >> op;
        if (op == "put") {
            int k, v;
            std::cin >> k >> v;
            touch(k, v);
            evictIfNeeded();
        } else {
            int k;
            std::cin >> k;
            auto it = pos.find(k);
            if (it == pos.end()) {
                std::cout << -1 << "\\n";
            } else {
                int value = it->second->second;
                touch(k, value);
                std::cout << value << "\\n";
            }
        }
    }

    std::cout << "最终:";
    bool first = true;
    for (const auto& [k, v] : order) {
        std::cout << (first ? " [" : ", ") << k;
        first = false;
    }
    std::cout << "]\\n";
    return 0;
}
`,
    hints: [
      'touch 函数是核心：找到旧节点就 `order.erase(it->second)` 摘掉，然后 `order.emplace_front(key, value)` 插到队头，最后 `pos[key] = order.begin();` 记录新位置。',
      '淘汰看队尾：`order.back()` 是最久未使用，先 `pos.erase(order.back().first)` 清索引再 `order.pop_back();`。put 更新旧键时 touch 已把旧位置擦掉，size 不会超。',
      'get 未命中只输出 -1 不动顺序；命中时先取值（`it->second->second`）再 touch，因为 touch 之后旧迭代器就失效了。最终行格式：`最终: [1, 3]`，逗号后有空格。',
    ],
    tests: [
      { name: '样例 1：容量 2 经典序列', stdin: '2 6\nput 1 10\nput 2 20\nget 1\nput 3 30\nget 2\nget 1\n', expected: '10\n-1\n10\n最终: [1, 3]' },
      { name: '样例 2：容量 3 更新键', stdin: '3 9\nput 1 100\nput 2 200\nput 3 300\nget 1\nput 4 400\nget 2\nget 3\nput 1 999\nget 1\n', expected: '100\n-1\n300\n999\n最终: [1, 3, 4]' },
      { name: '隐藏：满容更新不淘汰', stdin: '2 5\nput 1 10\nput 2 20\nput 1 11\nget 3\nget 1\n', expected: '-1\n11\n最终: [1, 2]', hidden: true },
      { name: '隐藏：查询空缓存', stdin: '2 3\nget 5\nput 7 70\nget 7\n', expected: '-1\n70\n最终: [7]', hidden: true },
    ],
  },
  {
    id: 'cpp-integration-3',
    lang: 'cpp',
    module: 'integration',
    order: 3,
    title: '多线程分块求和',
    difficulty: 4,
    xp: 35,
    goals: [
      '把数据均匀切块，为每块创建独立线程',
      '线程只写自己的结果格子，避免数据竞争',
      'join 后由主线程按序输出保证确定性',
    ],
    brief: `## 分治 + 并行：线程版求和

把 n 个数切成 k 块，每块交给一个线程求和，最后汇总——多线程计算的最小完整模型：

\`\`\`cpp
std::vector<long long> sums(k, 0);
std::vector<std::thread> threads;
for (int i = 0; i < k; ++i) {
    threads.emplace_back([&, i] {
        int lo = i * n / k, hi = (i + 1) * n / k;  // 块 i 的区间
        long long s = 0;
        for (int j = lo; j < hi; ++j) s += v[j];
        sums[i] = s;   // 每个线程只写自己的格子：无竞争
    });
}
for (auto& t : threads) t.join();
\`\`\`

### 三个工程细节

- **分块公式**：\`[i*n/k, (i+1)*n/k)\` 自动处理不整除的情况，k > n 时部分块为空区间（和为 0）。
- **无锁的条件**：sums[i] 与线程一一对应，写不同内存单元天然安全——比抢一把锁更快也更简单。
- **输出纪律**：线程内绝不打印（会交错乱序），join 后主线程统一输出，结果 100% 确定。

> 💡 lambda 捕获 \`[&, i]\`：v、sums、n 按引用共享，循环变量 i 按值拷贝（否则所有线程看到的是同一个 i）。`,
    task: `## 任务：k 路并行求和

读入 n 个整数和块数 k，把数据切成 k 块并行求和，主线程输出每块结果与总和。

**输入**：第一行 n（1 ≤ n ≤ 100000）；第二行 n 个整数（绝对值 ≤ 10^9）；第三行 k（1 ≤ k ≤ 100）

**输出**：k 行 \`块<i>和: <sum>\`（i 从 0 开始），最后一行 \`总和: <total>\`

分块规则：块 i 负责下标 \`[i*n/k, (i+1)*n/k)\`。

### 示例

| 输入 | 输出 |
| --- | --- |
| \`6\`<br>\`1 2 3 4 5 6\`<br>\`3\` | \`块0和: 3\`<br>\`块1和: 7\`<br>\`块2和: 11\`<br>\`总和: 21\` |
| \`7\`<br>\`1 2 3 4 5 6 7\`<br>\`3\` | \`块0和: 3\`<br>\`块1和: 7\`<br>\`块2和: 18\`<br>\`总和: 28\` |

样例 2 中块 2 是 [4,7)，即 5+6+7=18。`,
    starter: `#include <iostream>
#include <thread>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<long long> v(n);
    for (auto& x : v) std::cin >> x;
    int k;
    std::cin >> k;

    std::vector<long long> sums(k, 0);
    std::vector<std::thread> threads;

    // TODO 1: 循环创建 k 个线程，块 i 负责 [i*n/k, (i+1)*n/k)
    // TODO 2: join 全部线程
    // TODO 3: 主线程输出 k 行块和与总和行
    return 0;
}
`,
    solution: `#include <iostream>
#include <thread>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<long long> v(n);
    for (auto& x : v) std::cin >> x;
    int k;
    std::cin >> k;

    std::vector<long long> sums(k, 0);
    std::vector<std::thread> threads;
    threads.reserve(k);

    for (int i = 0; i < k; ++i) {
        threads.emplace_back([&, i] {
            long long s = 0;
            int lo = i * n / k;
            int hi = (i + 1) * n / k;
            for (int j = lo; j < hi; ++j) {
                s += v[j];
            }
            sums[i] = s;
        });
    }
    for (auto& t : threads) {
        t.join();
    }

    long long total = 0;
    for (int i = 0; i < k; ++i) {
        std::cout << "块" << i << "和: " << sums[i] << "\\n";
        total += sums[i];
    }
    std::cout << "总和: " << total << "\\n";
    return 0;
}
`,
    hints: [
      '线程体：`threads.emplace_back([&, i] { ... });`——注意 i 必须按值捕获，v/sums/n 按引用捕获。',
      '区间公式 `int lo = i * n / k, hi = (i + 1) * n / k;` 自动适配不整除与 k > n（空区间和为 0）。sums[i] 只被线程 i 写，天然无竞争。',
      '先 for-join 再输出：主线程按 i 顺序打印 `块<i>和: <sums[i]>`，边打印边累加 total，最后输出 `总和: <total>`。',
    ],
    tests: [
      { name: '样例 1：1 到 6 三块', stdin: '6\n1 2 3 4 5 6\n3\n', expected: '块0和: 3\n块1和: 7\n块2和: 11\n总和: 21' },
      { name: '样例 2：不整除分块', stdin: '7\n1 2 3 4 5 6 7\n3\n', expected: '块0和: 3\n块1和: 7\n块2和: 18\n总和: 28' },
      { name: '隐藏：块多于数据', stdin: '1\n42\n3\n', expected: '块0和: 0\n块1和: 0\n块2和: 42\n总和: 42', hidden: true },
      { name: '隐藏：两块', stdin: '5\n10 20 30 40 50\n2\n', expected: '块0和: 30\n块1和: 120\n总和: 150', hidden: true },
      { name: '隐藏：每块一个数', stdin: '4\n-1 -2 3 4\n4\n', expected: '块0和: -1\n块1和: -2\n块2和: 3\n块3和: 4\n总和: 4', hidden: true },
    ],
  },
  {
    id: 'cpp-integration-4',
    lang: 'cpp',
    module: 'integration',
    order: 4,
    title: '命令行参数解析：迷你 todo',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解 argc/argv 与子命令式 CLI 的设计',
      '掌握按行读取 + 首词分发的解析框架',
      '综合 getline / rfind / stoi 完成状态管理',
    ],
    brief: `## CLI 应用的骨架：子命令分发

真实的命令行程序（git、docker）都遵循"命令 + 子命令 + 参数"的结构。C++ 的 main 直接收得到它们：

\`\`\`cpp
int main(int argc, char* argv[]) {
    // argc：参数个数（含程序名）；argv[i]：第 i 个参数（C 字符串）
    // ./todo add 买菜  →  argc=3, argv[1]="add", argv[2]="买菜"
}
\`\`\`

### 判题环境等价训练场

评测器按 stdin 逐行喂命令，逻辑与解析 argv 完全同构——把"解析一行"的本领练好，命令行解析就通了：

\`\`\`cpp
std::string line;
std::getline(std::cin, line);          // 读一整行（add 的文本可以带空格）
if (line == "list") { ... }
else if (line.rfind("done ", 0) == 0) {          // 前缀匹配
    int id = std::stoi(line.substr(5));          // 取出数字
}
else if (line.rfind("add ", 0) == 0) {
    std::string text = line.substr(4);           // 文本允许含空格
}
\`\`\`

### 三个细节

- \`cin >> m\` 之后接 \`getline\` 必须先 \`cin.ignore()\`，否则 getline 读到残留的换行符，拿到空行。
- \`rfind(prefix, 0) == 0\` 是"以 prefix 开头"的标准判法（从下标 0 起找，找到即前缀匹配）。
- \`stoi\` 遇到非法输入会抛异常，本关保证输入合法。`,
    task: `## 任务：迷你 todo 应用

实现三条子命令的状态机，维护一个待办清单（条目 id 从 1 开始递增）：

- \`add <文本>\` —— 添加条目，输出 \`已添加 #<id>: <文本>\`
- \`list\` —— 逐行输出 \`#<id> [x] <文本>\`（已完成）或 \`#<id> [ ] <文本>\`（未完成）；清单为空时输出 \`清单是空的\`
- \`done <id>\` —— 标记完成，输出 \`已完成: <文本>\`；id 不存在输出 \`没有 #<id> 这一项\`（可重复 done，幂等）

**输入**：第一行 m（1 ≤ m ≤ 1000，命令数）；接下来 m 行一条命令，add 的文本可含空格

**输出**：按命令逐条输出（list 空清单只输出一行）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`6\`<br>\`add 买牛奶\`<br>\`add 写周报\`<br>\`list\`<br>\`done 1\`<br>\`list\`<br>\`done 9\` | \`已添加 #1: 买牛奶\`<br>\`已添加 #2: 写周报\`<br>\`#1 [ ] 买牛奶\`<br>\`#2 [ ] 写周报\`<br>\`已完成: 买牛奶\`<br>\`#1 [x] 买牛奶\`<br>\`#2 [ ] 写周报\`<br>\`没有 #9 这一项\` |`,
    starter: `#include <iostream>
#include <string>
#include <vector>

struct Todo {
    std::string text;
    bool done = false;
};

int main() {
    int m;
    std::cin >> m;
    std::cin.ignore();  // 吃掉数字后残留的换行符

    std::vector<Todo> items;
    // TODO: 循环 getline 读命令，按 add / list / done 分发处理
    return 0;
}
`,
    solution: `#include <iostream>
#include <string>
#include <vector>

struct Todo {
    std::string text;
    bool done = false;
};

int main() {
    int m;
    std::cin >> m;
    std::cin.ignore();

    std::vector<Todo> items;
    for (int i = 0; i < m; ++i) {
        std::string line;
        std::getline(std::cin, line);
        if (line == "list") {
            if (items.empty()) {
                std::cout << "清单是空的\\n";
            } else {
                int no = 1;
                for (const auto& t : items) {
                    std::cout << "#" << no++
                              << (t.done ? " [x] " : " [ ] ") << t.text
                              << "\\n";
                }
            }
        } else if (line.rfind("add ", 0) == 0) {
            std::string text = line.substr(4);
            items.push_back({text, false});
            std::cout << "已添加 #" << items.size() << ": " << text << "\\n";
        } else if (line.rfind("done ", 0) == 0) {
            int id = std::stoi(line.substr(5));
            if (id >= 1 && id <= static_cast<int>(items.size())) {
                items[id - 1].done = true;
                std::cout << "已完成: " << items[id - 1].text << "\\n";
            } else {
                std::cout << "没有 #" << id << " 这一项\\n";
            }
        }
    }
    return 0;
}
`,
    hints: [
      '读入框架：`std::cin >> m; std::cin.ignore();` 之后每轮 `std::getline(std::cin, line);`，这样才能处理带空格的 add 文本。',
      '前缀分发：`line == "list"`、`line.rfind("add ", 0) == 0`、`line.rfind("done ", 0) == 0`；add 文本取 `line.substr(4)`，id 用 `std::stoi(line.substr(5))`。',
      'list 的状态标记：`(t.done ? " [x] " : " [ ] ")`——方括号前后各有一个空格；done 判断 `id >= 1 && id <= items.size()`，越界输出 `没有 #<id> 这一项`。',
    ],
    tests: [
      { name: '样例 1：添加列出完成', stdin: '6\nadd 买牛奶\nadd 写周报\nlist\ndone 1\nlist\ndone 9\n', expected: '已添加 #1: 买牛奶\n已添加 #2: 写周报\n#1 [ ] 买牛奶\n#2 [ ] 写周报\n已完成: 买牛奶\n#1 [x] 买牛奶\n#2 [ ] 写周报\n没有 #9 这一项' },
      { name: '样例 2：空清单', stdin: '1\nlist\n', expected: '清单是空的' },
      { name: '隐藏：文本带空格与越界 id 0', stdin: '4\nadd 学 C++ 模板\ndone 1\nlist\ndone 0\n', expected: '已添加 #1: 学 C++ 模板\n已完成: 学 C++ 模板\n#1 [x] 学 C++ 模板\n没有 #0 这一项', hidden: true },
      { name: '隐藏：重复 done', stdin: '3\nadd a\ndone 1\ndone 1\n', expected: '已添加 #1: a\n已完成: a\n已完成: a', hidden: true },
      { name: '隐藏：三条混排', stdin: '5\nadd t1\nadd t2\nadd t3\ndone 2\nlist\n', expected: '已添加 #1: t1\n已添加 #2: t2\n已添加 #3: t3\n已完成: t2\n#1 [ ] t1\n#2 [x] t2\n#3 [ ] t3', hidden: true },
    ],
  },
  {
    id: 'cpp-integration-5',
    lang: 'cpp',
    module: 'integration',
    order: 5,
    title: '中缀表达式求值器',
    difficulty: 5,
    xp: 50,
    goals: [
      '掌握递归下降解析：expr / term / factor 三层文法',
      '正确处理运算优先级与括号嵌套',
      '注意整数除法向零截断与负中间值',
    ],
    brief: `## 表达式求值：编译器的微缩模型

计算器、解释器、SQL 引擎，内核都是表达式解析。**递归下降**用三层函数表达优先级，一层管一级：

\`\`\`cpp
// 文法：
// expr   := term (('+'|'-') term)*     最低优先级
// term   := factor (('*'|'/') factor)*  高一级
// factor := 数字 | '(' expr ')'          最高：原子或括号

long long parseExpr() {
    long long v = parseTerm();
    while (peek() == '+' || peek() == '-') {
        char op = next();
        long long r = parseTerm();
        v = (op == '+') ? v + r : v - r;
    }
    return v;
}
\`\`\`

### 为什么这样就对了

- \`2+3*4\`：parseExpr 先拿 term=2，看到 +，**再调 parseTerm**——而 parseTerm 会把 3*4 整个吃掉返回 12，优先级自动成立。
- \`(2+3)*4\`：factor 遇到 \`(\` 就递归调 parseExpr，把括号整体变成一个"数字"。
- 左结合：循环里的 \`v = v op r\` 逐次向左折，\`8/2/2\` 得 2 而不是 8。

### 除法的坑

整数除法**向零截断**：\`(1-8)/2\` = -7/2 = **-3**（不是 -4）。保证除数不为 0，中间值可能有负数，用 \`long long\` 防溢出。`,
    task: `## 任务：迷你计算引擎

读入 t 个不含空格的中缀表达式（数字为非负整数，运算符 \`+ - * /\` 与括号，除数保证非 0，长度 ≤ 100），逐个求值。

**输入**：第一行 t（1 ≤ t ≤ 100）；接下来 t 行每行一个表达式

**输出**：t 行，每行 \`结果: <值>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`2+3*4\`<br>\`(2+3)*4\`<br>\`10/3\` | \`结果: 14\`<br>\`结果: 20\`<br>\`结果: 3\` |
| \`2\`<br>\`100-(20+3)*2\`<br>\`(1+2)*(3+4)\` | \`结果: 54\`<br>\`结果: 21\` |

记住：除法向零截断，\`10/3 = 3\`；表达式以数字或 \`(\` 开头，不出现一元负号。`,
    starter: `#include <iostream>
#include <string>

class Parser {
public:
    explicit Parser(const std::string& s) : s_(s), pos_(0) {}

    long long parse() { return parseExpr(); }

private:
    const std::string& s_;
    size_t pos_;

    char peek() const { return pos_ < s_.size() ? s_[pos_] : '\\0'; }

    // TODO 1: parseExpr —— 处理 + -（循环、左结合）
    // TODO 2: parseTerm —— 处理 * /
    // TODO 3: parseFactor —— 数字（逐位累加）或 '(' expr ')'
};

int main() {
    int t;
    std::cin >> t;
    // TODO 4: 循环读入表达式，输出 结果: 值
    return 0;
}
`,
    solution: `#include <iostream>
#include <string>

class Parser {
public:
    explicit Parser(const std::string& s) : s_(s), pos_(0) {}

    long long parse() { return parseExpr(); }

private:
    const std::string& s_;
    size_t pos_;

    char peek() const { return pos_ < s_.size() ? s_[pos_] : '\\0'; }

    long long parseExpr() {
        long long v = parseTerm();
        while (peek() == '+' || peek() == '-') {
            char op = s_[pos_++];
            long long r = parseTerm();
            v = (op == '+') ? v + r : v - r;
        }
        return v;
    }

    long long parseTerm() {
        long long v = parseFactor();
        while (peek() == '*' || peek() == '/') {
            char op = s_[pos_++];
            long long r = parseFactor();
            v = (op == '*') ? v * r : v / r;
        }
        return v;
    }

    long long parseFactor() {
        if (peek() == '(') {
            ++pos_;
            long long v = parseExpr();
            ++pos_;  // 跳过 ')'
            return v;
        }
        long long num = 0;
        while (pos_ < s_.size() && s_[pos_] >= '0' && s_[pos_] <= '9') {
            num = num * 10 + (s_[pos_] - '0');
            ++pos_;
        }
        return num;
    }
};

int main() {
    int t;
    std::cin >> t;
    for (int i = 0; i < t; ++i) {
        std::string expr;
        std::cin >> expr;
        Parser p(expr);
        std::cout << "结果: " << p.parse() << "\\n";
    }
    return 0;
}
`,
    hints: [
      '三层结构各司其职：parseExpr 的 while 循环处理 + -；parseTerm 处理 * /；parseFactor 处理数字或括号。优先级由"谁调谁"天然保证。',
      '数字读取逐位累加：`while (是数字) { num = num * 10 + (s_[pos_] - \'0\'); ++pos_; }`；括号分支里先 `++pos_` 跳过 \'(\'，parseExpr 后再 `++pos_` 跳过 \')\'。',
      '除法用 C++ 原生 `/`——向零截断：`(1-8)/2` 得 -3。表达式无空格，main 里直接 `std::cin >> expr` 每次读一个。',
    ],
    tests: [
      { name: '样例 1：优先级与括号', stdin: '3\n2+3*4\n(2+3)*4\n10/3\n', expected: '结果: 14\n结果: 20\n结果: 3' },
      { name: '样例 2：嵌套运算', stdin: '2\n100-(20+3)*2\n(1+2)*(3+4)\n', expected: '结果: 54\n结果: 21' },
      { name: '隐藏：负中间值与截断', stdin: '3\n1-5\n(1-8)/2\n7-(2-5)\n', expected: '结果: -4\n结果: -3\n结果: 10', hidden: true },
      { name: '隐藏：单数字与深嵌套', stdin: '2\n42\n2*(3+(4*5))\n', expected: '结果: 42\n结果: 46', hidden: true },
      { name: '隐藏：连续除法', stdin: '1\n8/2/2\n', expected: '结果: 2', hidden: true },
    ],
  },
];
