import type { Level } from '@/types';

/** C++ · 第五章：行业最佳实践（5 关） */
export const CPP_BEST: Level[] = [
  {
    id: 'cpp-best-1',
    lang: 'cpp',
    module: 'best',
    order: 1,
    title: '命名与风格整形术',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握 Google 风格命名：类型 PascalCase、函数 PascalCase',
      '变量与参数用 snake_case，类数据成员带下划线后缀',
      '常量用 k 前缀，并用 constexpr 声明编译期常量',
    ],
    brief: `## Google C++ 风格速览

大厂代码千行万行，统一的命名是最低成本的可读性投资。Google C++ 风格指南的核心命名规则：

\`\`\`cpp
class PlayerInventory { ... };        // 类型/类名：PascalCase（大驼峰）
void AddItem(const Item& item);       // 函数名：PascalCase（Google 风格）
int item_count = 0;                   // 变量/参数：snake_case（小写下划线）
int width_;                           // 类数据成员：snake_case + 下划线后缀
constexpr double kDiscountRate = 0.8; // 常量：k 开头 + PascalCase
\`\`\`

### 为什么要较真

- \`kDiscountRate\` 一眼看出"这是常量，谁都不许改"；\`width_\` 一眼看出"这是成员，属于整个类"。
- \`constexpr\` 常量在**编译期**就算好，还能用于数组大小等编译期上下文，比 \`#define\` 安全（有类型、有作用域）。

### 常见的坏味道

- 拼音缩写与单字母满天飞：\`int jg = js(yh);\`
- 魔法数字裸奔：\`total * 0.8\` 里的 0.8 没有名字。
- 常量用 \`#define\`：没有类型检查，还污染全局。`,
    task: `## 任务：把"野路子"代码整形成规范风

按 Google 风格实现一个折扣计算器，**所有命名遵守规范**（评测只看输出，但请把这一关当成重构练习认真命名）：

- 常量 \`kDiscountRate = 0.8\`（constexpr，k 前缀）
- 函数 \`TotalAfterDiscount(const std::vector<double>& prices)\` —— 返回所有价格之和乘以折扣率
- main 中变量用 snake_case

**输入**：第一行 n（1 ≤ n ≤ 1000）；第二行 n 个价格（0 ≤ 价格 ≤ 100000）

**输出**：一行 \`折后总价: <结果，保留 2 位小数>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`10 20 25.5\` | \`折后总价: 44.40\` |
| \`1\`<br>\`100\` | \`折后总价: 80.00\` |

10 + 20 + 25.5 = 55.5，55.5 × 0.8 = 44.4。`,
    starter: `#include <iomanip>
#include <iostream>
#include <vector>

// TODO: 定义 constexpr 常量 kDiscountRate = 0.8

// TODO: 定义 TotalAfterDiscount 函数（PascalCase，参数 const 引用）

int main() {
    int n;
    std::cin >> n;
    // TODO: snake_case 变量读入价格并调用函数
    // 输出格式：折后总价: xx.xx（fixed + setprecision(2)）
    return 0;
}
`,
    solution: `#include <iomanip>
#include <iostream>
#include <vector>

constexpr double kDiscountRate = 0.8;

double TotalAfterDiscount(const std::vector<double>& prices) {
    double total = 0.0;
    for (double price : prices) {
        total += price;
    }
    return total * kDiscountRate;
}

int main() {
    int n;
    std::cin >> n;
    std::vector<double> prices;
    for (int i = 0; i < n; ++i) {
        double price;
        std::cin >> price;
        prices.push_back(price);
    }
    std::cout << std::fixed << std::setprecision(2)
              << "折后总价: " << TotalAfterDiscount(prices) << "\\n";
    return 0;
}
`,
    hints: [
      '常量声明：`constexpr double kDiscountRate = 0.8;`——k 前缀 + 大驼峰，编译期常量。',
      '函数按 Google 风格取名 `TotalAfterDiscount`，参数写 `const std::vector<double>&`：不拷贝、也不允许修改。',
      '输出前设置 `std::fixed << std::setprecision(2)`；总和 × 0.8 的浮点结果对样例数据是稳定的，55.5×0.8 显示为 44.40。',
    ],
    tests: [
      { name: '样例 1：三种价格', stdin: '3\n10 20 25.5\n', expected: '折后总价: 44.40' },
      { name: '样例 2：单价格', stdin: '1\n100\n', expected: '折后总价: 80.00' },
      { name: '隐藏：小价格', stdin: '2\n0.5 0.5\n', expected: '折后总价: 0.80', hidden: true },
      { name: '隐藏：四个相同', stdin: '4\n12.5 12.5 12.5 12.5\n', expected: '折后总价: 40.00', hidden: true },
    ],
  },
  {
    id: 'cpp-best-2',
    lang: 'cpp',
    module: 'best',
    order: 2,
    title: 'const 正确性',
    difficulty: 2,
    xp: 25,
    goals: [
      '不修改状态的成员函数标记 const',
      '只读参数用 const 引用传递，避免拷贝',
      '编译期常量用 constexpr 而非宏',
    ],
    brief: `## const：让编译器当保安

\`const\` 是"不许改"的合同，谁违反合同，编译器直接拒绝编译：

\`\`\`cpp
class Circle {
public:
    explicit Circle(double radius) : radius_(radius) {}

    double area() const { return kPi * radius_ * radius_; }  // const 成员函数
    double circumference() const { return 2 * kPi * radius_; }

private:
    double radius_;
};

const Circle c(1.0);          // 对象本身也可以是 const
c.area();                     // ✅ const 方法在 const 对象上可调用
\`\`\`

### 三个层面的 const

1. **const 成员函数**：函数签名末尾的 \`const\` 承诺不修改成员。只读方法不加 const，就不能被 const 对象/const 引用调用——接口直接残废。
2. **const 引用参数**：\`const std::string& s\` 零拷贝又不可改，是传"大而只读"参数的标准姿势。
3. **constexpr**：真·编译期常量（\`constexpr double kPi = 3.14...\`），比 \`const\` 更进一步，可用于数组长度、模板参数。

> ⚠️ \`const\` 引用能延长临时对象寿命、避免悬空；而返回局部变量的引用无论有没有 const 都是 bug。`,
    task: `## 任务： consts 满汉全席

定义 \`Circle\` 类并演示 const 三件套：

- \`constexpr double kPi = 3.141592653589793\`（文件顶部）
- 类成员 \`double radius_\`，构造函数用初始化列表
- \`double area() const\` 与 \`double circumference() const\` 两个 **const 成员函数**
- main 中创建 \`const Circle c(r);\`——对象也是 const

**输入**：一行一个正数 r（0 < r ≤ 1000）

**输出**：两行（各保留 2 位小数）

1. \`面积: <area()>\`
2. \`周长: <circumference()>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`2\` | \`面积: 12.57\`<br>\`周长: 12.57\` |
| \`1\` | \`面积: 3.14\`<br>\`周长: 6.28\` |

面积 = πr²，周长 = 2πr。r=2 时两者恰好同为 12.57。`,
    starter: `#include <iomanip>
#include <iostream>

// TODO 1: 定义 constexpr 常量 kPi

// TODO 2: 定义 Circle 类
// 构造函数（初始化列表）、area() const、circumference() const

int main() {
    double r;
    std::cin >> r;
    // TODO 3: const Circle c(r); 输出面积与周长（.2f）
    return 0;
}
`,
    solution: `#include <iomanip>
#include <iostream>

constexpr double kPi = 3.141592653589793;

class Circle {
public:
    explicit Circle(double radius) : radius_(radius) {}

    double area() const { return kPi * radius_ * radius_; }
    double circumference() const { return 2 * kPi * radius_; }

private:
    double radius_;
};

int main() {
    double r;
    std::cin >> r;
    const Circle c(r);
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "面积: " << c.area() << "\\n";
    std::cout << "周长: " << c.circumference() << "\\n";
    return 0;
}
`,
    hints: [
      'const 成员函数：`double area() const { return kPi * radius_ * radius_; }`——const 写在参数列表之后、函数体之前。',
      'main 里声明 `const Circle c(r);`，只有 const 成员函数能在它身上调用——这就是 const 正确性的意义。',
      '输出前统一 `std::fixed << std::setprecision(2)`；r=1 时面积 3.14、周长 6.28。',
    ],
    tests: [
      { name: '样例 1：r=2', stdin: '2\n', expected: '面积: 12.57\n周长: 12.57' },
      { name: '样例 2：r=1', stdin: '1\n', expected: '面积: 3.14\n周长: 6.28' },
      { name: '隐藏：小半径', stdin: '0.5\n', expected: '面积: 0.79\n周长: 3.14', hidden: true },
      { name: '隐藏：带小数半径', stdin: '3.5\n', expected: '面积: 38.48\n周长: 21.99', hidden: true },
    ],
  },
  {
    id: 'cpp-best-3',
    lang: 'cpp',
    module: 'best',
    order: 3,
    title: '头文件卫生检查员',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解 #pragma once / include guard 防重复包含',
      '学会用前置声明减少编译依赖',
      '掌握 include 的分组与排序规范',
    ],
    brief: `## 头文件的三条卫生守则

**守则一：防重复包含。** 同一头文件被 include 两次会重定义报错。现代做法是 \`#pragma once\`，传统做法是 include guard：

\`\`\`cpp
#pragma once            // 放在头文件第一行，主流编译器全支持

// 或传统写法：
#ifndef GAME_PLAYER_H_
#define GAME_PLAYER_H_
// ... 头文件内容
#endif  // GAME_PLAYER_H_
\`\`\`

**守则二：前置声明。** 头文件里只用 \`Engine*\` 指针/引用时，不必 \`#include "engine.h"\`，一句 \`class Engine;\` 就够——斩断编译依赖链，缩短重编译时间：

\`\`\`cpp
// car.h
#pragma once
class Engine;           // 前置声明
class Car {
public:
    void SetEngine(Engine* e);  // 指针/引用：前置声明就够
};
\`\`\`

**守则三：分组排序。** Google 风格的 include 顺序：本文件对应的头 → C 标准库（\`<cxxx>\`）→ C++ 标准库 → 项目头文件，组内按字典序。

> 💡 本关的练习就是把一堆 include 行"整理归位"——真实项目里 IDE/clang-format 也会这么排序。`,
    task: `## 任务：整理 include 清单

读入 n 行 include 记录，按规范分组排序输出。约定：尖括号内以字母 **c** 开头的归为 C 库，其余尖括号归为 C++ 标准库，双引号归为项目头。

**输入**：第一行 n（1 ≤ n ≤ 100）；接下来 n 行，每行形如 \`<cstdio>\`、\`<vector>\` 或 \`"game.h"\`

**输出**：三行（组内按名字字典序升序，数字间一个空格；某组为空输出 \`无\`）

1. \`C 库: <名字列表>\`
2. \`标准库: <名字列表>\`
3. \`项目头: <名字列表>\`

名字输出时**去掉尖括号或引号**（如 \`cstdio\`）。

### 示例

| 输入 | 输出 |
| --- | --- |
| \`4\`<br>\`<string>\`<br>\`"game.h"\`<br>\`<cstdio>\`<br>\`<vector>\` | \`C 库: cstdio\`<br>\`标准库: string vector\`<br>\`项目头: game.h\` |
| \`3\`<br>\`<cmath>\`<br>\`<algorithm>\`<br>\`"player.h"\` | \`C 库: cmath\`<br>\`标准库: algorithm\`<br>\`项目头: player.h\` |`,
    starter: `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

// TODO 1: 写一个 printGroup(label, names) 辅助函数
// 排序后输出 "label: x y z"，空组输出 "无"

int main() {
    int n;
    std::cin >> n;
    std::vector<std::string> cHeaders, stdHeaders, projectHeaders;
    // TODO 2: 按首字符 < 或 " 分类，去掉包裹符号后放入对应组
    // TODO 3: 依次输出三组
    return 0;
}
`,
    solution: `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

void printGroup(const char* label, std::vector<std::string> names) {
    std::sort(names.begin(), names.end());
    std::cout << label << ":";
    if (names.empty()) {
        std::cout << " 无";
    } else {
        for (const auto& s : names) std::cout << " " << s;
    }
    std::cout << "\\n";
}

int main() {
    int n;
    std::cin >> n;
    std::vector<std::string> cHeaders, stdHeaders, projectHeaders;
    for (int i = 0; i < n; ++i) {
        std::string inc;
        std::cin >> inc;
        if (inc.size() >= 2 && inc.front() == '<' && inc.back() == '>') {
            std::string name = inc.substr(1, inc.size() - 2);
            if (!name.empty() && name[0] == 'c') {
                cHeaders.push_back(name);
            } else {
                stdHeaders.push_back(name);
            }
        } else if (inc.size() >= 2 && inc.front() == '"' && inc.back() == '"') {
            projectHeaders.push_back(inc.substr(1, inc.size() - 2));
        }
    }
    printGroup("C 库", cHeaders);
    printGroup("标准库", stdHeaders);
    printGroup("项目头", projectHeaders);
    return 0;
}
`,
    hints: [
      '分类判断：`inc.front() == \'<\'` 且 `inc.back() == \'>\'` 是尖括号组；`inc.front() == \'"\'` 且 `inc.back() == \'"\'` 是项目组。去壳用 `inc.substr(1, inc.size() - 2)`。',
      '尖括号组内再分：名字首字符是 \'c\'（如 cstdio、cmath）进 C 库，否则进标准库——这是本题约定。',
      '辅助函数里先 `std::sort(names.begin(), names.end());` 再输出；空组输出 `无`，非空时每个名字前补一个空格。',
    ],
    tests: [
      { name: '样例 1：三组齐全', stdin: '4\n<string>\n"game.h"\n<cstdio>\n<vector>\n', expected: 'C 库: cstdio\n标准库: string vector\n项目头: game.h' },
      { name: '样例 2：单条各组', stdin: '3\n<cmath>\n<algorithm>\n"player.h"\n', expected: 'C 库: cmath\n标准库: algorithm\n项目头: player.h' },
      { name: '隐藏：空组', stdin: '2\n<vector>\n<map>\n', expected: 'C 库: 无\n标准库: map vector\n项目头: 无', hidden: true },
      { name: '隐藏：组内排序', stdin: '5\n"a.h"\n"b.h"\n<csetjmp>\n<iostream>\n<cctype>\n', expected: 'C 库: cctype csetjmp\n标准库: iostream\n项目头: a.h b.h', hidden: true },
    ],
  },
  {
    id: 'cpp-best-4',
    lang: 'cpp',
    module: 'best',
    order: 4,
    title: '轻量单元测试台',
    difficulty: 3,
    xp: 30,
    goals: [
      '学会手写 CHECK_EQ 测试宏',
      '掌握表格驱动测试的组织方式',
      '理解"先定测试表，再写实现"的开发节奏',
    ],
    brief: `## 没有框架的单元测试

大型项目用 GoogleTest，但很多场景一行依赖都不想引入。手写宏 + 表格驱动，20 行就是一台测试台：

\`\`\`cpp
struct TestCase { int input; int expected; };

#define CHECK_EQ(no, actual, expected)                    \\
    do {                                                  \\
        auto a_ = (actual);                               \\
        auto e_ = (expected);                             \\
        if (a_ == e_) {                                   \\
            std::cout << "用例" << (no) << ": 通过\\n";     \\
        } else {                                          \\
            ++g_failures;                                 \\
            std::cout << "用例" << (no) << ": 失败 (期望 " \\
                      << (e_) << ", 实际 " << (a_) << ")\\n"; \\
        }                                                 \\
    } while (0)
\`\`\`

### 表格驱动测试

把"输入→期望输出"排成一张表，测试只是跑表：

\`\`\`cpp
std::vector<TestCase> table = { {-5, 5}, {0, 0}, {7, 7} };
int no = 0;
for (const auto& tc : table) {
    CHECK_EQ(++no, myAbs(tc.input), tc.expected);
}
\`\`\`

### 为什么这么组织

- **加用例零成本**：表里添一行就行，测试代码不动。
- **失败信息完整**：期望值、实际值都在一行里。
- 宏参数都套了括号：防止 \`CHECK_EQ(f(x) + 1, y)\` 这类实参被展开后因优先级出错——这是宏的经典防御。`,
    task: `## 任务：给 myAbs 建测试台

实现 \`int myAbs(int x)\`（x 为 int 且不为 INT_MIN），再搭表格驱动测试台：

- \`CHECK_EQ(no, actual, expected)\` 宏：相等打印 \`用例<no>: 通过\`；不等计数并打印 \`用例<no>: 失败 (期望 <e>, 实际 <a>)\`
- 从输入读入测试表，逐行跑宏，最后输出总结行

**输入**：第一行 n（1 ≤ n ≤ 100）；接下来 n 行，每行 \`x expected\`（expected 即 |x|，数据保证正确）

**输出**：n 行用例结果 + 一行 \`全部通过: <p>/<n>\`（p 为通过数）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`4\`<br>\`-5 5\`<br>\`0 0\`<br>\`7 7\`<br>\`-100 100\` | \`用例1: 通过\`<br>\`用例2: 通过\`<br>\`用例3: 通过\`<br>\`用例4: 通过\`<br>\`全部通过: 4/4\` |`,
    starter: `#include <iostream>
#include <vector>

int g_failures = 0;

// TODO 1: 定义 CHECK_EQ(no, actual, expected) 宏（do-while(0) 护甲）

// TODO 2: 定义 int myAbs(int x)

struct TestCase {
    int input;
    int expected;
};

int main() {
    int n;
    std::cin >> n;
    std::vector<TestCase> table(n);
    // TODO 3: 读入测试表
    // TODO 4: for 循环跑 CHECK_EQ，最后输出 全部通过: n-g_failures/n
    return 0;
}
`,
    solution: `#include <iostream>
#include <vector>

int g_failures = 0;

#define CHECK_EQ(no, actual, expected)                          \\
    do {                                                        \\
        auto a_ = (actual);                                     \\
        auto e_ = (expected);                                   \\
        if (a_ == e_) {                                         \\
            std::cout << "用例" << (no) << ": 通过\\n";          \\
        } else {                                                \\
            ++g_failures;                                       \\
            std::cout << "用例" << (no) << ": 失败 (期望 "      \\
                      << (e_) << ", 实际 " << (a_) << ")\\n";    \\
        }                                                       \\
    } while (0)

int myAbs(int x) {
    return x < 0 ? -x : x;
}

struct TestCase {
    int input;
    int expected;
};

int main() {
    int n;
    std::cin >> n;
    std::vector<TestCase> table(n);
    for (auto& tc : table) {
        std::cin >> tc.input >> tc.expected;
    }

    int no = 0;
    for (const auto& tc : table) {
        CHECK_EQ(++no, myAbs(tc.input), tc.expected);
    }
    std::cout << "全部通过: " << n - g_failures << "/" << n << "\\n";
    return 0;
}
`,
    hints: [
      '宏的骨架：比较分支里打印 `用例<no>: 通过`；失败分支先 `++g_failures;` 再打印 `用例<no>: 失败 (期望 e, 实际 a)`。所有宏参数使用时都套括号。',
      'myAbs 一行实现：`return x < 0 ? -x : x;`（数据保证不会遇到 INT_MIN，无需担心取负溢出）。',
      '用例编号：循环外 `int no = 0;`，调用 `CHECK_EQ(++no, myAbs(tc.input), tc.expected);`——两个分支只会走一个，++no 恰好执行一次。',
    ],
    tests: [
      { name: '样例 1：四用例', stdin: '4\n-5 5\n0 0\n7 7\n-100 100\n', expected: '用例1: 通过\n用例2: 通过\n用例3: 通过\n用例4: 通过\n全部通过: 4/4' },
      { name: '样例 2：两用例', stdin: '2\n3 3\n-3 3\n', expected: '用例1: 通过\n用例2: 通过\n全部通过: 2/2' },
      { name: '隐藏：大数', stdin: '1\n2147483647 2147483647\n', expected: '用例1: 通过\n全部通过: 1/1', hidden: true },
      { name: '隐藏：三用例混合', stdin: '3\n-1 1\n1 1\n0 0\n', expected: '用例1: 通过\n用例2: 通过\n用例3: 通过\n全部通过: 3/3', hidden: true },
    ],
  },
  {
    id: 'cpp-best-5',
    lang: 'cpp',
    module: 'best',
    order: 5,
    title: 'Core Guidelines 精选',
    difficulty: 3,
    xp: 30,
    goals: [
      'T.4：用模板让接口对类型泛化',
      'R.11：避免裸 new，优先容器与智能指针',
      'ES.20 / ES.65：始终初始化、访问前查边界',
    ],
    brief: `## C++ Core Guidelines 三连击

C++ 之父 Bjarne 与 Herb Sutter 维护的 **C++ Core Guidelines** 是官方最佳实践合集。本关精选三条：

**T.4 —— 用模板让接口对类型泛化。** 同一算法别为 int/double 复制粘贴三份：

\`\`\`cpp
template <typename T>
T SumOf(const std::vector<T>& v) {
    T sum = {};                 // 零初始化（ES.20）
    for (const T& x : v) sum += x;
    return sum;
}
\`\`\`

**R.11 —— 避免显式调用 new/delete。** 资源交给 \`vector\`、\`string\`、智能指针；本关 main 里一个 new 都不出现。

**ES.20 —— 始终初始化变量。** \`T sum = {};\`、\`std::vector<int> v(n, 0);\`，垃圾值读不得。

**ES.65 —— 解引用前检查边界。** 对可能为空的容器先判空再取 \`v[0]\`。

> 💡 这几条合起来的效果：函数更少、类型更少、内存错误更少——把心智花在逻辑上，而不是补漏上。`,
    task: `## 任务：泛型统计器

编写两个函数模板 \`SumOf\` 与 \`MaxOf\`（均接收 \`const std::vector<T>&\`），对整数、小数两个序列各调用一次。

**输入**：第一行 n（1 ≤ n ≤ 10000）；第二行 n 个整数；第三行 n 个小数

**输出**：四行（小数保留 2 位）

1. \`整数和: <SumOf(ints)>\`
2. \`小数和: <SumOf(doubles)>\`
3. \`整数最大: <MaxOf(ints)>\`
4. \`小数最大: <MaxOf(doubles)>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`1 2 3\`<br>\`1.5 2.5 3.0\` | \`整数和: 6\`<br>\`小数和: 7.00\`<br>\`整数最大: 3\`<br>\`小数最大: 3.00\` |
| \`4\`<br>\`5 -3 9 0\`<br>\`1.25 1.25 2.5 -0.5\` | \`整数和: 11\`<br>\`小数和: 4.50\`<br>\`整数最大: 9\`<br>\`小数最大: 2.50\` |

要求：全程不出现 \`new\`/\`delete\`（R.11），所有变量声明即初始化（ES.20）。`,
    starter: `#include <iomanip>
#include <iostream>
#include <vector>

// TODO 1: 编写模板 SumOf（sum 以 T{} 零初始化）

// TODO 2: 编写模板 MaxOf（内部访问 v[0] 前要求调用方保证非空，本题保证 n>=1）

int main() {
    int n;
    std::cin >> n;
    // TODO 3: 用 vector 装两组数据（声明即初始化，不用 new）
    // TODO 4: 四次模板调用输出四行
    return 0;
}
`,
    solution: `#include <iomanip>
#include <iostream>
#include <vector>

template <typename T>
T SumOf(const std::vector<T>& v) {
    T sum = {};
    for (const T& x : v) {
        sum += x;
    }
    return sum;
}

template <typename T>
T MaxOf(const std::vector<T>& v) {
    T best = v[0];
    for (const T& x : v) {
        if (x > best) best = x;
    }
    return best;
}

int main() {
    int n;
    std::cin >> n;
    std::vector<int> ints(n, 0);
    std::vector<double> doubles(n, 0.0);
    for (auto& x : ints) std::cin >> x;
    for (auto& x : doubles) std::cin >> x;

    std::cout << "整数和: " << SumOf(ints) << "\\n";
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "小数和: " << SumOf(doubles) << "\\n";
    std::cout << "整数最大: " << MaxOf(ints) << "\\n";
    std::cout << "小数最大: " << MaxOf(doubles) << "\\n";
    return 0;
}
`,
    hints: [
      'SumOf 模板：`T sum = {};` 零初始化后范围 for 累加——一份代码同时服务 int 与 double（T.4）。',
      'MaxOf 先 `T best = v[0];`（本题保证 n ≥ 1），循环取更大者。整数最大行在设置 fixed 之前输出，整型不受小数精度影响。',
      '容器声明即初始化：`std::vector<int> ints(n, 0);`、`std::vector<double> doubles(n, 0.0);`——全程零 new/delete。',
    ],
    tests: [
      { name: '样例 1：1 2 3 / 1.5 2.5 3.0', stdin: '3\n1 2 3\n1.5 2.5 3.0\n', expected: '整数和: 6\n小数和: 7.00\n整数最大: 3\n小数最大: 3.00' },
      { name: '样例 2：负数混合', stdin: '4\n5 -3 9 0\n1.25 1.25 2.5 -0.5\n', expected: '整数和: 11\n小数和: 4.50\n整数最大: 9\n小数最大: 2.50' },
      { name: '隐藏：单元素', stdin: '1\n7\n2.25\n', expected: '整数和: 7\n小数和: 2.25\n整数最大: 7\n小数最大: 2.25', hidden: true },
      { name: '隐藏：全负数', stdin: '2\n-5 -2\n-1.5 -2.5\n', expected: '整数和: -7\n小数和: -4.00\n整数最大: -2\n小数最大: -1.50', hidden: true },
    ],
  },
];
