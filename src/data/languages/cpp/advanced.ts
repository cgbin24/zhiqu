import type { Level } from '@/types';

/** C++ · 第三章：进阶技术（8 关） */
export const CPP_ADVANCED: Level[] = [
  {
    id: 'cpp-advanced-1',
    lang: 'cpp',
    module: 'advanced',
    order: 1,
    title: '指针深潜',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解指针存地址：* 解引用、& 取地址',
      '掌握 nullptr 判空与指针有效性',
      '学会用指针算术遍历连续内存',
    ],
    brief: `## 指针：存地址的变量

指针的值是"另一个变量在内存里的门牌号"：

\`\`\`cpp
int x = 42;
int* p = &x;      // p 存 x 的地址，& 是取地址
std::cout << *p;  // 42，* 是解引用：顺着地址找到东西
*p = 100;         // 通过指针改 x，x 变成 100
\`\`\`

### nullptr：指向"没有"

指针不指向任何对象时，必须置 \`nullptr\`（C++11 起），不要用老的 \`NULL\` 或 0。使用前判空：

\`\`\`cpp
int* p = nullptr;
if (p != nullptr) { std::cout << *p; }  // 不判空就解引用是崩溃炸弹
\`\`\`

### 指针算术：在连续内存上散步

对指向数组元素的指针做 \`+1\`，它移动的是**一个元素**，不是一个字节：

\`\`\`cpp
int a[5] = {10, 20, 30, 40, 50};
int* p = a;           // 数组名退化为指向首元素的指针
*(p + 2);             // 30
for (int* q = a; q != a + 5; ++q) sum += *q;  // 指针遍历
\`\`\`

\`std::vector\` 的底层内存同样连续，\`v.data()\` 返回首元素指针，指针算术对它同样成立。

> ⚠️ 越界的指针（如 \`a + 5\` 之后继续 ++）哪怕不解引用也是未定义行为的边缘，遍历条件要卡准。`,
    task: `## 任务：指针寻宝

读入 n 个整数（存入 vector）和一个下标 k（1 ≤ k ≤ n），全程**用指针算术**完成寻宝。

**输入**：第一行 n（1 ≤ n ≤ 1000）；第二行 n 个整数；第三行 k

**输出**：三行

1. \`第 <k> 个: <*(p + k - 1)>\`
2. \`倒数第 <k> 个: <*(p + n - k)>\`
3. \`遍历和: <用移动指针的方式累加全部元素>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5\`<br>\`10 20 30 40 50\`<br>\`2\` | \`第 2 个: 20\`<br>\`倒数第 2 个: 40\`<br>\`遍历和: 150\` |
| \`3\`<br>\`-10 5 -3\`<br>\`2\` | \`第 2 个: 5\`<br>\`倒数第 2 个: 5\`<br>\`遍历和: -8\` |

用 \`int* p = v.data();\` 拿到首元素指针，\`v.data()\` 需要 vector 非空。`,
    starter: `#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (auto& x : v) std::cin >> x;
    int k;
    std::cin >> k;

    // TODO 1: int* p = v.data(); 拿到首元素指针
    // TODO 2: 用 *(p + k - 1) 和 *(p + n - k) 输出前两行
    // TODO 3: 用移动指针 q 的循环累加，输出遍历和
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
    int k;
    std::cin >> k;

    int* p = v.data();

    std::cout << "第 " << k << " 个: " << *(p + k - 1) << "\\n";
    std::cout << "倒数第 " << k << " 个: " << *(p + n - k) << "\\n";

    long long sum = 0;
    for (const int* q = p; q != p + n; ++q) {
        sum += *q;
    }
    std::cout << "遍历和: " << sum << "\\n";
    return 0;
}
`,
    hints: [
      '`int* p = v.data();` 之后，第 k 个元素就是 `*(p + k - 1)`，倒数第 k 个是 `*(p + n - k)`（指针算术按元素移动）。',
      '遍历循环用指针当游标：`for (const int* q = p; q != p + n; ++q) sum += *q;`——q 从首元素走到"末尾之后"为止。',
      '求和变量用 long long 防溢出。注意输出格式："第 2 个: 20"，数字与冒号后各有一个空格。',
    ],
    tests: [
      { name: '样例 1：10 20 30 40 50', stdin: '5\n10 20 30 40 50\n2\n', expected: '第 2 个: 20\n倒数第 2 个: 40\n遍历和: 150' },
      { name: '样例 2：含负数', stdin: '3\n-10 5 -3\n2\n', expected: '第 2 个: 5\n倒数第 2 个: 5\n遍历和: -8' },
      { name: '隐藏：单元素', stdin: '1\n42\n1\n', expected: '第 1 个: 42\n倒数第 1 个: 42\n遍历和: 42', hidden: true },
      { name: '隐藏：首尾对调', stdin: '6\n1 2 3 4 5 6\n6\n', expected: '第 6 个: 6\n倒数第 6 个: 1\n遍历和: 21', hidden: true },
    ],
  },
  {
    id: 'cpp-advanced-2',
    lang: 'cpp',
    module: 'advanced',
    order: 2,
    title: 'RAII 资源管家',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解 RAII：资源获取即初始化',
      '手写守卫类，把清理工作交给析构函数',
      '体会提前返回也不会泄漏的原因',
    ],
    brief: `## RAII：让作用域替你管理资源

C++ 程序最大的资源泄漏来源是"忘了清理"。RAII（Resource Acquisition Is Initialization）的思路是：

- **构造函数**里获取资源（打开文件、加锁、连接数据库）
- **析构函数**里释放资源（关文件、解锁、断开连接）

对象离开作用域时析构函数**必然**被调用——不管是正常走完、提前 return，还是抛异常：

\`\`\`cpp
class Guard {
public:
    explicit Guard(std::string name) : name_(std::move(name)) {
        std::cout << "获取: " << name_ << "\\n";
    }
    ~Guard() {
        std::cout << "释放: " << name_ << "\\n";
    }
    Guard(const Guard&) = delete;            // 资源守卫不可复制
    Guard& operator=(const Guard&) = delete;
private:
    std::string name_;
};

int main() {
    Guard g("文件句柄");
    // ... 中间哪怕 return、throw，g 的析构都会执行
}
\`\`\`

### 关键细节

- \`Guard(const Guard&) = delete;\` 显式**删除拷贝**：一份资源不能被两个守卫各释放一次。
- 嵌套作用域里多个守卫按**构造的逆序**释放（后拿的先还）。
- 标准库的 \`lock_guard\`、\`fstream\`、智能指针，全是 RAII 思想的产物。`,
    task: `## 任务：守卫的纪律

实现 \`Guard\` 类：构造时输出 \`获取: <名字>\`，析构时输出 \`释放: <名字>\`，并**删除拷贝构造与拷贝赋值**。

main 中读入两个资源名 \`a\`、\`b\`，然后：

1. 用 a 创建守卫 g1
2. 进入 \`{ }\` 块，用 b 创建守卫 g2，输出 \`工作中\`，再输出 \`提前返回!\`，然后 **\`return 0;\`**
3. 观察即使提前返回，析构依然按逆序执行

**输入**：一行两个字符串（空格分隔），如 \`数据库连接 文件句柄\`

**输出**：六行

### 示例

| 输入 | 输出 |
| --- | --- |
| \`数据库连接 文件句柄\` | \`获取: 数据库连接\`<br>\`获取: 文件句柄\`<br>\`工作中\`<br>\`提前返回!\`<br>\`释放: 文件句柄\`<br>\`释放: 数据库连接\` |
| \`锁A 锁B\` | \`获取: 锁A\`<br>\`获取: 锁B\`<br>\`工作中\`<br>\`提前返回!\`<br>\`释放: 锁B\`<br>\`释放: 锁A\` |`,
    starter: `#include <iostream>
#include <string>
#include <utility>

// TODO 1: 定义 Guard 类
// 构造打印"获取: 名字"，析构打印"释放: 名字"
// 用 = delete 删除拷贝构造与拷贝赋值

int main() {
    std::string a, b;
    std::cin >> a >> b;

    // TODO 2: 创建 g1，进入块创建 g2
    // TODO 3: 输出"工作中"和"提前返回!"，然后 return 0;
    return 0;
}
`,
    solution: `#include <iostream>
#include <string>
#include <utility>

class Guard {
public:
    explicit Guard(std::string name) : name_(std::move(name)) {
        std::cout << "获取: " << name_ << "\\n";
    }
    ~Guard() {
        std::cout << "释放: " << name_ << "\\n";
    }
    Guard(const Guard&) = delete;
    Guard& operator=(const Guard&) = delete;

private:
    std::string name_;
};

int main() {
    std::string a, b;
    std::cin >> a >> b;
    Guard g1(a);
    {
        Guard g2(b);
        std::cout << "工作中\\n";
        std::cout << "提前返回!\\n";
        return 0;
    }
}
`,
    hints: [
      '删除拷贝的写法：`Guard(const Guard&) = delete;` 和 `Guard& operator=(const Guard&) = delete;`，放在 public 区。',
      '块内结构：`{ Guard g2(b); std::cout << "工作中\\n"; std::cout << "提前返回!\\n"; return 0; }`——return 触发 g2、g1 逆序析构。',
      '输出顺序完全由构造/析构时机决定：获取 a、获取 b、工作中、提前返回!、释放 b、释放 a。',
    ],
    tests: [
      { name: '样例 1：数据库连接 文件句柄', stdin: '数据库连接 文件句柄\n', expected: '获取: 数据库连接\n获取: 文件句柄\n工作中\n提前返回!\n释放: 文件句柄\n释放: 数据库连接' },
      { name: '样例 2：锁A 锁B', stdin: '锁A 锁B\n', expected: '获取: 锁A\n获取: 锁B\n工作中\n提前返回!\n释放: 锁B\n释放: 锁A' },
      { name: '隐藏：英文名', stdin: 'dbConn fileHandle\n', expected: '获取: dbConn\n获取: fileHandle\n工作中\n提前返回!\n释放: fileHandle\n释放: dbConn', hidden: true },
      { name: '隐藏：单字资源', stdin: '网 线\n', expected: '获取: 网\n获取: 线\n工作中\n提前返回!\n释放: 线\n释放: 网', hidden: true },
    ],
  },
  {
    id: 'cpp-advanced-3',
    lang: 'cpp',
    module: 'advanced',
    order: 3,
    title: 'unique_ptr 独占骑士',
    difficulty: 3,
    xp: 30,
    goals: [
      '用 make_unique 创建独占所有权对象',
      '理解 unique_ptr 不可复制、只能移动',
      '掌握所有权转移后原指针自动变空',
    ],
    brief: `## unique_ptr：独占所有权的守卫

裸 \`new/delete\` 要人肉配对，一疏忽就泄漏。\`unique_ptr\` 把堆对象包成"栈对象"管理——析构时自动 delete，RAII 管到底：

\`\`\`cpp
#include <memory>
auto p = std::make_unique<Resource>("宝剑");  // 推荐：make_unique 创建
p->name();        // 像指针一样用 -> 和 *
p == nullptr;     // 可以判空
\`\`\`

### 独占：不能复制，只能移交

一份资源只有一个主人。复制 unique_ptr 会编译错误；转移所有权必须用 \`std::move\`：

\`\`\`cpp
auto q = p;              // ❌ 编译错误：拷贝被删除
auto q = std::move(p);   // ✅ p 把所有权移交给 q，p 变为 nullptr
\`\`\`

### 函数传参的姿势

\`void use(std::unique_ptr<Resource> p)\` 按**值**接收——调用方必须 \`use(std::move(p))\`，所有权进入函数，函数结束时资源自动释放。

> 💡 \`make_unique<Resource>(args...)\` 内部执行 new 并把异常安全性做到最好，永远优先于手写 \`new\`。`,
    task: `## 任务：宝剑的移交仪式

定义 \`Resource\` 类：构造时输出 \`构造: <名字>\`，析构时输出 \`析构: <名字>\`，提供 \`name()\` 访问器。

再定义函数 \`void use(std::unique_ptr<Resource> p)\`：输出 \`使用者拿到: <名字>\`（p 在函数结束时自动析构）。

main 中读入一个名字（如 \`宝剑\`），完成移交仪式并输出每一步。

**输入**：一行一个字符串，如 \`宝剑\`

**输出**：六行

### 示例

| 输入 | 输出 |
| --- | --- |
| \`宝剑\` | \`构造: 宝剑\`<br>\`p 为空: 否\`<br>\`转移所有权...\`<br>\`使用者拿到: 宝剑\`<br>\`析构: 宝剑\`<br>\`p 为空: 是\` |
| \`火焰剑\` | \`构造: 火焰剑\`<br>\`p 为空: 否\`<br>\`转移所有权...\`<br>\`使用者拿到: 火焰剑\`<br>\`析构: 火焰剑\`<br>\`p 为空: 是\` |

"p 为空"用 \`(p == nullptr ? "是" : "否")\` 判断。`,
    starter: `#include <iostream>
#include <memory>
#include <string>
#include <utility>

// TODO 1: 定义 Resource 类（构造/析构打印，name() 访问器）

// TODO 2: 定义 use(std::unique_ptr<Resource> p)

int main() {
    std::string name;
    std::cin >> name;

    // TODO 3: make_unique 创建 p，打印 p 是否为空
    // TODO 4: std::move 移交所有权给 use，之后再打印 p 是否为空
    return 0;
}
`,
    solution: `#include <iostream>
#include <memory>
#include <string>
#include <utility>

class Resource {
public:
    explicit Resource(std::string name) : name_(std::move(name)) {
        std::cout << "构造: " << name_ << "\\n";
    }
    ~Resource() {
        std::cout << "析构: " << name_ << "\\n";
    }
    const std::string& name() const { return name_; }

private:
    std::string name_;
};

void use(std::unique_ptr<Resource> p) {
    std::cout << "使用者拿到: " << p->name() << "\\n";
}

int main() {
    std::string name;
    std::cin >> name;
    auto p = std::make_unique<Resource>(name);
    std::cout << "p 为空: " << (p == nullptr ? "是" : "否") << "\\n";
    std::cout << "转移所有权...\\n";
    use(std::move(p));
    std::cout << "p 为空: " << (p == nullptr ? "是" : "否") << "\\n";
    return 0;
}
`,
    hints: [
      '创建用 `auto p = std::make_unique<Resource>(name);`，判空直接和 nullptr 比较：`(p == nullptr ? "是" : "否")`。',
      'unique_ptr 不能复制，移交必须 `use(std::move(p));`；use 内部用 `p->name()` 取名字，函数返回时 p 自动析构。',
      '注意输出顺序：use 内部打印"使用者拿到"后立即析构（析构行在"p 为空: 是"之前），因为 use 的形参在函数返回时销毁。',
    ],
    tests: [
      { name: '样例 1：宝剑', stdin: '宝剑\n', expected: '构造: 宝剑\np 为空: 否\n转移所有权...\n使用者拿到: 宝剑\n析构: 宝剑\np 为空: 是' },
      { name: '样例 2：火焰剑', stdin: '火焰剑\n', expected: '构造: 火焰剑\np 为空: 否\n转移所有权...\n使用者拿到: 火焰剑\n析构: 火焰剑\np 为空: 是' },
      { name: '隐藏：英文名', stdin: 'MagicSword\n', expected: '构造: MagicSword\np 为空: 否\n转移所有权...\n使用者拿到: MagicSword\n析构: MagicSword\np 为空: 是', hidden: true },
      { name: '隐藏：盾牌', stdin: '盾牌\n', expected: '构造: 盾牌\np 为空: 否\n转移所有权...\n使用者拿到: 盾牌\n析构: 盾牌\np 为空: 是', hidden: true },
    ],
  },
  {
    id: 'cpp-advanced-4',
    lang: 'cpp',
    module: 'advanced',
    order: 4,
    title: 'shared_ptr 共享议会',
    difficulty: 3,
    xp: 30,
    goals: [
      '用 make_shared 创建共享所有权对象',
      '用 use_count 观察引用计数变化',
      '理解最后一个引用消失时资源才释放',
    ],
    brief: `## shared_ptr：多人共管一个对象

\`unique_ptr\` 独占，\`shared_ptr\` 则**共享**：内部维护一个**引用计数**，记录"还有几个人持有这个对象"：

\`\`\`cpp
#include <memory>
auto a = std::make_shared<Resource>("宝箱");
a.use_count();   // 1：只有 a 持有

auto b = a;      // 复制！计数 +1（与 unique_ptr 相反）
a.use_count();   // 2

b.reset();       // b 放弃持有，计数 -1
a.use_count();   // 1
\`\`\`

### 析构时机：计数归零

每个 shared_ptr 离开作用域或 reset 时计数减一；**计数减到 0** 的那一刻，管理的对象才被 delete：

\`\`\`cpp
{
    auto c = a;   // 计数 3
}                 // c 析构，计数回到 2
\`\`\`

### make_shared 的好处

\`std::make_shared<Resource>(args...)\` 一次分配把"对象 + 控制块（计数器）"放在一起，比 \`shared_ptr<Resource>(new Resource(...))\` 更快也更安全。

> ⚠️ 共享指针解决"多人共管"，但也可能造成循环引用（A 引用 B、B 引用 A，计数永不为 0）——那是 weak_ptr 的故事。`,
    task: `## 任务：宝箱的持有者们

定义 \`Resource\` 类：构造时输出 \`构造: <名字>\`，析构时输出 \`析构: <名字>\`。

main 中读入一个名字（如 \`宝箱\`），按以下剧本操作并随时观察 \`use_count()\`：

1. \`make_shared\` 创建 a，输出 \`创建后: 计数\`
2. 复制给 b，输出 \`复制给 b 后: 计数\`
3. 进入 \`{ }\` 块复制出 c，块内输出 \`块内: 计数\`
4. 块结束后输出 \`离开块后: 计数\`
5. \`b.reset()\` 后输出 \`b 重置后: 计数\`
6. 输出 \`程序即将结束\`

**输入**：一行一个字符串，如 \`宝箱\`

**输出**：八行（含最后的析构行）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`宝箱\` | \`构造: 宝箱\`<br>\`创建后: 1\`<br>\`复制给 b 后: 2\`<br>\`块内: 3\`<br>\`离开块后: 2\`<br>\`b 重置后: 1\`<br>\`程序即将结束\`<br>\`析构: 宝箱\` |`,
    starter: `#include <iostream>
#include <memory>
#include <string>
#include <utility>

// TODO: 定义 Resource 类（构造/析构打印）

int main() {
    std::string name;
    std::cin >> name;

    // TODO 1: make_shared 创建 a，打印 创建后: a.use_count()
    // TODO 2: auto b = a; 打印 复制给 b 后
    // TODO 3: 块内 auto c = a; 打印 块内，块外打印 离开块后
    // TODO 4: b.reset(); 打印 b 重置后
    // TODO 5: 打印 程序即将结束（析构行会在 main 结束时自动出现）
    return 0;
}
`,
    solution: `#include <iostream>
#include <memory>
#include <string>
#include <utility>

class Resource {
public:
    explicit Resource(std::string name) : name_(std::move(name)) {
        std::cout << "构造: " << name_ << "\\n";
    }
    ~Resource() {
        std::cout << "析构: " << name_ << "\\n";
    }
    const std::string& name() const { return name_; }

private:
    std::string name_;
};

int main() {
    std::string name;
    std::cin >> name;
    auto a = std::make_shared<Resource>(name);
    std::cout << "创建后: " << a.use_count() << "\\n";

    auto b = a;
    std::cout << "复制给 b 后: " << a.use_count() << "\\n";

    {
        auto c = a;
        std::cout << "块内: " << a.use_count() << "\\n";
    }

    std::cout << "离开块后: " << a.use_count() << "\\n";
    b.reset();
    std::cout << "b 重置后: " << a.use_count() << "\\n";
    std::cout << "程序即将结束\\n";
    return 0;
}
`,
    hints: [
      '复制 shared_ptr 就是计数 +1：`auto b = a;` 之后 use_count 变 2；块内再复制一次变 3。',
      '计数减少的两种方式：块结束（c 析构）或 `b.reset();`。use_count 随时反映当前持有者数量。',
      '最后一行"析构: 名字"不是手写打印的——main 返回时 a 析构、计数归零、Resource 被 delete，析构函数自动输出。',
    ],
    tests: [
      { name: '样例 1：宝箱', stdin: '宝箱\n', expected: '构造: 宝箱\n创建后: 1\n复制给 b 后: 2\n块内: 3\n离开块后: 2\nb 重置后: 1\n程序即将结束\n析构: 宝箱' },
      { name: '样例 2：金币袋', stdin: '金币袋\n', expected: '构造: 金币袋\n创建后: 1\n复制给 b 后: 2\n块内: 3\n离开块后: 2\nb 重置后: 1\n程序即将结束\n析构: 金币袋' },
      { name: '隐藏：英文名', stdin: 'Chest\n', expected: '构造: Chest\n创建后: 1\n复制给 b 后: 2\n块内: 3\n离开块后: 2\nb 重置后: 1\n程序即将结束\n析构: Chest', hidden: true },
      { name: '隐藏：药水', stdin: '药水\n', expected: '构造: 药水\n创建后: 1\n复制给 b 后: 2\n块内: 3\n离开块后: 2\nb 重置后: 1\n程序即将结束\n析构: 药水', hidden: true },
    ],
  },
  {
    id: 'cpp-advanced-5',
    lang: 'cpp',
    module: 'advanced',
    order: 5,
    title: '移动语义搬家术',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解拷贝 vs 移动：移动是"接管资源"',
      '掌握 std::move 的作用：把表达式转为右值',
      '学会实现移动构造函数并观察被移动对象',
    ],
    brief: `## 拷贝是复印，移动是搬家

拷贝构造把别人的资源**完整复制一份**；移动构造则直接**接管**别人的资源（比如把对方 string 内部的字符数组"搬"过来），完成后对方只剩空壳——省去整块内存的分配与复制：

\`\`\`cpp
class Buffer {
public:
    Buffer(const Buffer& other) : name_(other.name_) {          // 拷贝构造
        std::cout << "拷贝构造: " << name_ << "\\n";
    }
    Buffer(Buffer&& other) noexcept                             // 移动构造
        : name_(std::move(other.name_)) {
        other.name_ = "(已移交)";   // 被移动对象置为"有效但空"的状态
        std::cout << "移动构造: " << name_ << "\\n";
    }
};
\`\`\`

### std::move：不动一字节的" cast"

\`std::move(x)\` **不移动任何东西**，它只是一个类型转换：把 x 标记为"可以搬走"（右值），从而让重载解析选中移动构造：

\`\`\`cpp
Buffer b = a;             // a 是左值 → 拷贝构造
Buffer c = std::move(a);  // 标记 a 可搬 → 移动构造
\`\`\`

### 两个纪律

- 移动构造标 \`noexcept\`：否则 vector 扩容时不敢用移动，退化为拷贝。
- 被移动后的对象仍可安全析构、可重新赋值，但**不要假设它的内容还在**。`,
    task: `## 任务：追踪一次搬家

定义 \`Buffer\` 类，完整实现三种构造：普通构造、拷贝构造、移动构造（照 brief 的模板实现，移动构造把源对象的 name 置为 \`(已移交)\`），每种构造都打印 \`构造: / 拷贝构造: / 移动构造: <名字>\`。

main 中读入一个名字 n：

1. 用 n 创建 a
2. \`Buffer b = a;\`
3. \`Buffer c = std::move(a);\`
4. 依次输出 \`b = <b.name()>\`、\`c = <c.name()>\`、\`a = <a.name()>\`

**输入**：一行一个字符串，如 \`A\`

**输出**：六行

### 示例

| 输入 | 输出 |
| --- | --- |
| \`A\` | \`构造: A\`<br>\`拷贝构造: A\`<br>\`移动构造: A\`<br>\`b = A\`<br>\`c = A\`<br>\`a = (已移交)\` |`,
    starter: `#include <iostream>
#include <string>
#include <utility>

// TODO: 定义 Buffer 类
// 普通构造打印"构造: 名字"
// 拷贝构造打印"拷贝构造: 名字"
// 移动构造（noexcept）打印"移动构造: 名字"，并把源对象 name 置为 "(已移交)"

int main() {
    std::string name;
    std::cin >> name;
    // TODO: 创建 a、b（拷贝）、c（std::move），输出三行归属报告
    return 0;
}
`,
    solution: `#include <iostream>
#include <string>
#include <utility>

class Buffer {
public:
    explicit Buffer(std::string name) : name_(std::move(name)) {
        std::cout << "构造: " << name_ << "\\n";
    }

    Buffer(const Buffer& other) : name_(other.name_) {
        std::cout << "拷贝构造: " << name_ << "\\n";
    }

    Buffer(Buffer&& other) noexcept : name_(std::move(other.name_)) {
        other.name_ = "(已移交)";
        std::cout << "移动构造: " << name_ << "\\n";
    }

    const std::string& name() const { return name_; }

private:
    std::string name_;
};

int main() {
    std::string name;
    std::cin >> name;
    Buffer a(name);
    Buffer b = a;
    Buffer c = std::move(a);
    std::cout << "b = " << b.name() << "\\n";
    std::cout << "c = " << c.name() << "\\n";
    std::cout << "a = " << a.name() << "\\n";
    return 0;
}
`,
    hints: [
      '移动构造签名：`Buffer(Buffer&& other) noexcept`，参数是右值引用；初始化列表里 `name_(std::move(other.name_))` 把对方的 string 搬过来。',
      '搬完记得"留条活路"：`other.name_ = "(已移交)";`——被移动对象必须保持有效状态。',
      '`Buffer b = a;` 中 a 是左值，走拷贝构造；`Buffer c = std::move(a);` 中 std::move 把 a 转成右值，走移动构造。最后 a.name() 已是 "(已移交)"。',
    ],
    tests: [
      { name: '样例 1：A', stdin: 'A\n', expected: '构造: A\n拷贝构造: A\n移动构造: A\nb = A\nc = A\na = (已移交)' },
      { name: '样例 2：Buffer1', stdin: 'Buffer1\n', expected: '构造: Buffer1\n拷贝构造: Buffer1\n移动构造: Buffer1\nb = Buffer1\nc = Buffer1\na = (已移交)' },
      { name: '隐藏：中文名', stdin: '缓冲区\n', expected: '构造: 缓冲区\n拷贝构造: 缓冲区\n移动构造: 缓冲区\nb = 缓冲区\nc = 缓冲区\na = (已移交)', hidden: true },
      { name: '隐藏：单字符', stdin: 'X\n', expected: '构造: X\n拷贝构造: X\n移动构造: X\nb = X\nc = X\na = (已移交)', hidden: true },
    ],
  },
  {
    id: 'cpp-advanced-6',
    lang: 'cpp',
    module: 'advanced',
    order: 6,
    title: '右值引用与完美转发',
    difficulty: 4,
    xp: 40,
    goals: [
      '区分左值引用 T& 与右值引用 T&&',
      '理解"具名右值引用变量本身是左值"',
      '掌握 std::forward 保持值类别的完美转发',
    ],
    brief: `## 值类别：左值与右值

- **左值**：有名字、能取地址，如变量 \`a\`。
- **右值**：临时的、即将消亡的，如 \`a + 1\`、字面量 \`5\`。

\`T&\` 只能绑定左值，\`T&&\`（右值引用）专门绑定右值——"这个东西反正要没了，允许你搬走它"：

\`\`\`cpp
void probe(int& x);   // 重载 1：左值版
void probe(int&& x);  // 重载 2：右值版

probe(a);        // 左值 → 左值版
probe(a + 1);    // 临时值 → 右值版
probe(std::move(a));  // move 把 a 转成右值 → 右值版
\`\`\`

### 陷阱：具名的右值引用是左值

进了函数体，形参 \`x\` 有了名字，它就是**左值**。直接往下传会"掉级"：

\`\`\`cpp
template <typename T>
void relayBroken(T&& arg) {
    probe(arg);              // ❌ arg 有名字 → 永远走左值版
    probe(std::forward<T>(arg));  // ✅ 完美转发：该左值左值、该右值右值
}
\`\`\`

\`std::forward<T>(arg)\` 按模板推导结果还原值类别，这就是**完美转发**，是写泛型包装层（工厂函数、emplace 类接口）的标准姿势。`,
    task: `## 任务：值类别探测器

实现两个 \`probe\` 重载与两个转发模板，用输出验证值类别。

**要求**：

- \`void probe(int& x, const char* tag)\`：输出 \`<tag> -> 左值, 值 <x>\`
- \`void probe(int&& x, const char* tag)\`：输出 \`<tag> -> 右值, 值 <x>\`
- \`relay(T&& arg, const char* tag)\`（模板）：\`probe(std::forward<T>(arg), tag)\`
- \`relayBroken(T&& arg, const char* tag)\`（模板）：\`probe(arg, tag)\`（故意不转发）

main 读入整数 a，依次调用 7 次（tag 原样输出）：

\`probe(a)\`、\`probe(a+1)\`、\`probe(move(a))\`、\`relay(a)\`、\`relay(a+1)\`、\`relay(move(a))\`、\`relayBroken(a+1)\`

**输入**：一行一个整数，如 \`10\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`10\` | \`probe(a) -> 左值, 值 10\`<br>\`probe(a+1) -> 右值, 值 11\`<br>\`probe(move(a)) -> 右值, 值 10\`<br>\`relay(a) -> 左值, 值 10\`<br>\`relay(a+1) -> 右值, 值 11\`<br>\`relay(move(a)) -> 右值, 值 10\`<br>\`relayBroken(a+1) -> 左值, 值 11\` |

重点观察最后一行：忘了 forward，右值被"降级"成左值。`,
    starter: `#include <iostream>
#include <utility>

// TODO 1: 两个 probe 重载（int& 与 int&&，带 tag 参数）

// TODO 2: relay 模板：probe(std::forward<T>(arg), tag)

// TODO 3: relayBroken 模板：probe(arg, tag)（故意不转发）

int main() {
    int a;
    std::cin >> a;
    // TODO: 按任务中的 7 个 tag 依次调用
    return 0;
}
`,
    solution: `#include <iostream>
#include <utility>

void probe(int& x, const char* tag) {
    std::cout << tag << " -> 左值, 值 " << x << "\\n";
}

void probe(int&& x, const char* tag) {
    std::cout << tag << " -> 右值, 值 " << x << "\\n";
}

template <typename T>
void relay(T&& arg, const char* tag) {
    probe(std::forward<T>(arg), tag);
}

template <typename T>
void relayBroken(T&& arg, const char* tag) {
    probe(arg, tag);
}

int main() {
    int a;
    std::cin >> a;
    probe(a, "probe(a)");
    probe(a + 1, "probe(a+1)");
    probe(std::move(a), "probe(move(a))");
    relay(a, "relay(a)");
    relay(a + 1, "relay(a+1)");
    relay(std::move(a), "relay(move(a))");
    relayBroken(a + 1, "relayBroken(a+1)");
    return 0;
}
`,
    hints: [
      '两个重载只有参数类型不同：`void probe(int& x, const char* tag)` 与 `void probe(int&& x, const char* tag)`，输出格式 `<tag> -> 左值, 值 <x>`。',
      'relay 里 `std::forward<T>(arg)` 依赖模板推导的 T 还原值类别：传 a 时 T=int&（左值），传 a+1 时 T=int（右值）。',
      'relayBroken 里 arg 是具名变量，永远按左值绑定——所以 relayBroken(a+1) 打印"左值"，这正是忘记 forward 的经典 bug。',
    ],
    tests: [
      { name: '样例 1：10', stdin: '10\n', expected: 'probe(a) -> 左值, 值 10\nprobe(a+1) -> 右值, 值 11\nprobe(move(a)) -> 右值, 值 10\nrelay(a) -> 左值, 值 10\nrelay(a+1) -> 右值, 值 11\nrelay(move(a)) -> 右值, 值 10\nrelayBroken(a+1) -> 左值, 值 11' },
      { name: '样例 2：-5', stdin: '-5\n', expected: 'probe(a) -> 左值, 值 -5\nprobe(a+1) -> 右值, 值 -4\nprobe(move(a)) -> 右值, 值 -5\nrelay(a) -> 左值, 值 -5\nrelay(a+1) -> 右值, 值 -4\nrelay(move(a)) -> 右值, 值 -5\nrelayBroken(a+1) -> 左值, 值 -4' },
      { name: '隐藏：0', stdin: '0\n', expected: 'probe(a) -> 左值, 值 0\nprobe(a+1) -> 右值, 值 1\nprobe(move(a)) -> 右值, 值 0\nrelay(a) -> 左值, 值 0\nrelay(a+1) -> 右值, 值 1\nrelay(move(a)) -> 右值, 值 0\nrelayBroken(a+1) -> 左值, 值 1', hidden: true },
      { name: '隐藏：7', stdin: '7\n', expected: 'probe(a) -> 左值, 值 7\nprobe(a+1) -> 右值, 值 8\nprobe(move(a)) -> 右值, 值 7\nrelay(a) -> 左值, 值 7\nrelay(a+1) -> 右值, 值 8\nrelay(move(a)) -> 右值, 值 7\nrelayBroken(a+1) -> 左值, 值 8', hidden: true },
    ],
  },
  {
    id: 'cpp-advanced-7',
    lang: 'cpp',
    module: 'advanced',
    order: 7,
    title: '容器选型参谋部',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解 set 自动去重且有序、O(log n) 查询',
      '对比 vector / map / set / unordered_map 的适用场景',
      '实践：用 set 完成去重与快速命中判断',
    ],
    brief: `## 四大容器，各守一方

| 容器 | 底层 | 查找 | 有序 | 适用场景 |
| --- | --- | --- | --- | --- |
| \`vector\` | 连续数组 | O(n) | 插入序 | 随机访问、尾部增删 |
| \`set\` | 红黑树 | O(log n) | **自动排序去重** | 去重、范围查询 |
| \`map\` | 红黑树 | O(log n) | 按 key 有序 | 有序键值映射 |
| \`unordered_map\` | 哈希表 | 平均 O(1) | 无序 | 只要快查、不关心顺序 |

### 选型三问

1. 要不要按顺序遍历？要 → \`set/map\`；不要 → \`unordered_map\`。
2. 只存值还是要键值对？只存值 → \`set\`；键值 → \`map\`。
3. 元素会不会大量中间插入删除？会 → 考虑 \`list\`/\`deque\`，一般 \`vector\` 仍是最快默认项。

### set 的实战价值

\`set\` 插入时自动去重，迭代顺序就是升序，\`count(x)\` / \`find(x)\` 都是 O(log n)：

\`\`\`cpp
std::set<int> s;
s.insert(5);
s.insert(5);          // 无效，set 里仍只有一个 5
if (s.count(5)) ...   // 1 表示存在
\`\`\`

> 💡 海量"存在性判断"且不需要有序时，\`unordered_set\`（同族哈希容器）平均更快。`,
    task: `## 任务：去重与命中演练

读入 n 个整数放入 \`std::set<int>\`，再读入 q 个查询，用 set 判断每个查询值是否存在。

**输入**：第一行 n（1 ≤ n ≤ 100000）；第二行 n 个整数；第三行 q（q 可为 0）；第四行 q 个整数

**输出**：三行

1. \`去重个数: <set.size()>\`
2. \`有序序列: <set 升序遍历，数字间一个空格>\`
3. \`命中: <存在个数>/<q>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`6\`<br>\`5 3 5 8 3 1\`<br>\`3\`<br>\`5 2 8\` | \`去重个数: 4\`<br>\`有序序列: 1 3 5 8\`<br>\`命中: 2/3\` |
| \`4\`<br>\`7 7 7 7\`<br>\`2\`<br>\`7 3\` | \`去重个数: 1\`<br>\`有序序列: 7\`<br>\`命中: 1/2\` |

q = 0 时命中行输出 \`命中: 0/0\`。`,
    starter: `#include <iostream>
#include <set>

int main() {
    int n;
    std::cin >> n;
    std::set<int> s;
    // TODO 1: 读入 n 个数插入 set

    // TODO 2: 输出去重个数与有序序列

    // TODO 3: 读入 q 个查询，用 s.count 判断，统计命中
    return 0;
}
`,
    solution: `#include <iostream>
#include <set>

int main() {
    int n;
    std::cin >> n;
    std::set<int> s;
    for (int i = 0; i < n; ++i) {
        int x;
        std::cin >> x;
        s.insert(x);
    }

    std::cout << "去重个数: " << s.size() << "\\n";
    std::cout << "有序序列:";
    for (int x : s) {
        std::cout << " " << x;
    }
    std::cout << "\\n";

    int q;
    std::cin >> q;
    int hits = 0;
    for (int i = 0; i < q; ++i) {
        int x;
        std::cin >> x;
        if (s.count(x) > 0) {
            ++hits;
        }
    }
    std::cout << "命中: " << hits << "/" << q << "\\n";
    return 0;
}
`,
    hints: [
      'set 插入重复值自动忽略：6 个数里有重复，size 就是去重后的个数，直接遍历 set 得到的就是升序序列。',
      '列表输出防行尾空格：标签 `"有序序列:"` 后循环里统一 `std::cout << " " << x;`——空格打在数字前面，行尾自然干净。',
      '查询用 `s.count(x) > 0` 判断存在（C++20 也可以用 `s.contains(x)`），最后按 `命中: <hits>/<q>` 输出。',
    ],
    tests: [
      { name: '样例 1：5 3 5 8 3 1', stdin: '6\n5 3 5 8 3 1\n3\n5 2 8\n', expected: '去重个数: 4\n有序序列: 1 3 5 8\n命中: 2/3' },
      { name: '样例 2：全重复', stdin: '4\n7 7 7 7\n2\n7 3\n', expected: '去重个数: 1\n有序序列: 7\n命中: 1/2' },
      { name: '隐藏：零查询', stdin: '3\n1 2 3\n0\n', expected: '去重个数: 3\n有序序列: 1 2 3\n命中: 0/0', hidden: true },
      { name: '隐藏：单值多查', stdin: '5\n9 9 9 9 9\n1\n9\n', expected: '去重个数: 1\n有序序列: 9\n命中: 1/1', hidden: true },
    ],
  },
  {
    id: 'cpp-advanced-8',
    lang: 'cpp',
    module: 'advanced',
    order: 8,
    title: '异常处理安全网',
    difficulty: 4,
    xp: 35,
    goals: [
      '掌握 try / throw / catch 三段式',
      '理解栈展开：异常路径上局部对象仍会析构',
      '学会捕获 std::exception 并读取 what()',
    ],
    brief: `## 异常：错误的"跳伞通道"

正常返回值表达不了"出错了"时，用异常把错误**向上抛**，由调用方决定怎么接：

\`\`\`cpp
#include <stdexcept>

int divide(int a, int b) {
    if (b == 0) {
        throw std::invalid_argument("除零");  // 抛出：立刻离开本函数
    }
    return a / b;
}

int main() {
    try {
        divide(1, 0);
    } catch (const std::exception& e) {   // 按 const 引用捕获基类
        std::cout << e.what();            // "除零"
    }
}
\`\`\`

### 栈展开：沿途析构一个不落

throw 之后，程序沿调用链回退寻找 catch，这个回退过程叫**栈展开**。沿途每个函数里已构造的**局部对象都会被析构**——这正是 RAII 在异常下依然安全的原因。

### 三条军规

- 按值抛出（\`throw std::invalid_argument(...)\`），按 **const 引用**捕获（\`catch (const std::exception& e)\`），避免对象切割。
- \`e.what()\` 返回错误描述字符串。
- 先 catch 派生类，再 catch 基类；\`catch (...)\` 兜底一切。`,
    task: `## 任务：带守卫的安全除法

实现：

- \`Guard\` 类：构造输出 \`守卫建立\`，析构输出 \`守卫释放\`（无参构造即可）
- \`int safeDivide(int a, int b)\`：进入时创建 Guard；\`b == 0\` 时 \`throw std::invalid_argument("除零")\`；否则输出 \`结果: <a/b>\`（整数除法）并返回
- main：读入 n 组数据 \`a b\`，每组用 try/catch 调用 safeDivide，catch 里输出 \`捕获: <e.what()>\`

**输入**：第一行 n（1 ≤ n ≤ 1000）；接下来 n 行，每行两个整数 a b

**输出**：每组 3 行——\`守卫建立\`、\`结果: x\` 或 \`捕获: 除零\`、\`守卫释放\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`2\`<br>\`10 2\`<br>\`7 0\` | \`守卫建立\`<br>\`结果: 5\`<br>\`守卫释放\`<br>\`守卫建立\`<br>\`守卫释放\`<br>\`捕获: 除零\` |

注意异常组：栈展开先析构 Guard（守卫释放），然后才轮到 catch 输出。`,
    starter: `#include <iostream>
#include <stdexcept>

// TODO 1: 定义 Guard 类（构造打印"守卫建立"，析构打印"守卫释放"）

// TODO 2: 定义 safeDivide(int a, int b)
// 进入时创建 Guard；b==0 时 throw std::invalid_argument("除零")
// 否则输出"结果: a/b"并返回

int main() {
    int n;
    std::cin >> n;
    // TODO 3: 循环读入 a b，try 调用 safeDivide，catch (const std::exception& e)
    // catch 里输出"捕获: e.what()"
    return 0;
}
`,
    solution: `#include <iostream>
#include <stdexcept>

class Guard {
public:
    Guard() { std::cout << "守卫建立\\n"; }
    ~Guard() { std::cout << "守卫释放\\n"; }
    Guard(const Guard&) = delete;
    Guard& operator=(const Guard&) = delete;
};

int safeDivide(int a, int b) {
    Guard g;
    if (b == 0) {
        throw std::invalid_argument("除零");
    }
    std::cout << "结果: " << a / b << "\\n";
    return a / b;
}

int main() {
    int n;
    std::cin >> n;
    for (int i = 0; i < n; ++i) {
        int a, b;
        std::cin >> a >> b;
        try {
            safeDivide(a, b);
        } catch (const std::exception& e) {
            std::cout << "捕获: " << e.what() << "\\n";
        }
    }
    return 0;
}
`,
    hints: [
      'safeDivide 第一行就是 `Guard g;`——正常路径它在 return 后析构，异常路径它在栈展开中析构，两条路都打印"守卫释放"。',
      '异常组顺序：throw 之后先栈展开析构 Guard（守卫释放），然后才进入 catch 打印"捕获: 除零"。',
      'catch 参数写成 `const std::exception& e`，错误信息用 `e.what()` 取——正是构造 invalid_argument 时传入的"除零"。',
    ],
    tests: [
      { name: '样例 1：一正一零', stdin: '2\n10 2\n7 0\n', expected: '守卫建立\n结果: 5\n守卫释放\n守卫建立\n守卫释放\n捕获: 除零' },
      { name: '样例 2：全部正常', stdin: '3\n8 2\n9 3\n1 4\n', expected: '守卫建立\n结果: 4\n守卫释放\n守卫建立\n结果: 3\n守卫释放\n守卫建立\n结果: 0\n守卫释放' },
      { name: '隐藏：零与负数', stdin: '2\n0 5\n-6 2\n', expected: '守卫建立\n结果: 0\n守卫释放\n守卫建立\n结果: -3\n守卫释放', hidden: true },
      { name: '隐藏：只有异常', stdin: '1\n100 0\n', expected: '守卫建立\n守卫释放\n捕获: 除零', hidden: true },
    ],
  },
];
