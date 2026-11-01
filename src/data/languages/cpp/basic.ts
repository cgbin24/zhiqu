import type { Level } from '@/types';

/** C++ · 第一章：基础语法结构（8 关） */
export const CPP_BASIC: Level[] = [
  {
    id: 'cpp-basic-1',
    lang: 'cpp',
    module: 'basic',
    order: 1,
    title: '你好，匠心之旅',
    difficulty: 1,
    xp: 15,
    goals: [
      '理解 C++ 程序的基本结构：#include、main 函数、return',
      '学会用 std::cout 与 << 运算符输出文本',
      '区分 endl 与 \\n 两种换行方式',
    ],
    brief: `## 你的第一个 C++ 程序

每个 C++ 程序都从 \`main\` 函数开始执行。一个最小但完整的程序长这样：

\`\`\`cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
\`\`\`

三件事缺一不可：

- **\`#include <iostream>\`** —— 引入输入输出流库。\`iostream\` 提供 \`std::cin\`（读输入）和 \`std::cout\`（写输出）。
- **\`int main()\`** —— 程序入口，返回值类型是 \`int\`。\`return 0;\` 表示程序正常结束（\`main\` 里不写也会自动补上，但写出来是好习惯）。
- **\`std::\` 前缀** —— 标准库的所有名字都住在 \`std\` 命名空间里。\`cout\` 是"字符输出流"，\`<<\` 把内容依次"推"给它。

### 换行的两种写法

\`\`\`cpp
std::cout << "A" << std::endl; // 换行 + 立即刷新缓冲区
std::cout << "B\\n";            // 换行，更快，刷题首选
\`\`\`

\`endl\` 每次都会清空输出缓冲区，频繁使用会拖慢程序；竞赛和刷题场景用 \`'\\n'\` 即可。

> 💡 \`<<\` 可以链式书写：\`std::cout << a << b << c;\` 会按从左到右的顺序输出。`,
    task: `## 任务

从标准输入读取你的匠人代号（一个不含空格的字符串），向它问好。

**输入**：一行一个字符串，如 \`Zhi\`

**输出**：一行，格式为 \`你好, <代号>! 欢迎来到智码世界。\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`Zhi\` | \`你好, Zhi! 欢迎来到智码世界。\` |
| \`Gopher\` | \`你好, Gopher! 欢迎来到智码世界。\` |

用 \`std::string name; std::cin >> name;\` 可以读入一个以空白分隔的字符串（需要 \`#include <string>\`）。`,
    starter: `#include <iostream>
#include <string>

int main() {
    std::string name;
    // TODO 1: 用 std::cin >> name 读入代号
    // TODO 2: 用 std::cout 链式输出问候语，别忘了换行
    return 0;
}
`,
    solution: `#include <iostream>
#include <string>

int main() {
    std::string name;
    std::cin >> name;
    std::cout << "你好, " << name << "! 欢迎来到智码世界。\\n";
    return 0;
}
`,
    hints: [
      '读取字符串两步走：`std::string name;` 声明，`std::cin >> name;` 读入。`>>` 会自动跳过空格和换行。',
      'std::cout 支持链式输出：`std::cout << "你好, " << name << "! 欢迎来到智码世界。\\n";`。注意逗号后有空格，感叹号紧跟代号。',
      '结尾换行用 `\\n`（写在字符串里）或 `std::endl` 都可以。完整程序：读入 name 后一行链式输出即可。',
    ],
    tests: [
      { name: '样例 1：Zhi', stdin: 'Zhi\n', expected: '你好, Zhi! 欢迎来到智码世界。' },
      { name: '样例 2：Gopher', stdin: 'Gopher\n', expected: '你好, Gopher! 欢迎来到智码世界。' },
      { name: '隐藏：含数字代号', stdin: 'Coder99\n', expected: '你好, Coder99! 欢迎来到智码世界。', hidden: true },
      { name: '隐藏：单字符代号', stdin: 'Q\n', expected: '你好, Q! 欢迎来到智码世界。', hidden: true },
    ],
  },
  {
    id: 'cpp-basic-2',
    lang: 'cpp',
    module: 'basic',
    order: 2,
    title: '变量工坊与类型百科',
    difficulty: 1,
    xp: 15,
    goals: [
      '认识 int / double / char / bool 四种基础类型',
      '掌握变量初始化与 auto 类型推断',
      '用 fixed + setprecision 控制小数位数',
    ],
    brief: `## 变量：先声明，后使用

C++ 是**静态强类型**语言，每个变量都要先声明类型：

\`\`\`cpp
int age = 18;          // 整数
double pi = 3.14159;   // 双精度浮点
char grade = 'A';      // 单个字符，用单引号
bool passed = true;    // 真假值
auto count = 42;       // auto：让编译器推断类型（这里推断为 int）
\`\`\`

**初始化**是给变量第一个值。切记：局部变量不会自动清零，\`int x;\` 里的 x 是随机垃圾值——**声明时顺手初始化**是铁律。

### char 与编码

\`char\` 存的是字符编码（ASCII）。\`'A'\` 的编码是 65，可以用 \`static_cast<int>(c)\` 看到它。

### 控制小数位

\`cout\` 默认最多显示 6 位有效数字。要精确控制小数位，请出 \`<iomanip>\` 头文件：

\`\`\`cpp
#include <iomanip>
std::cout << std::fixed << std::setprecision(2) << 3.14159; // 3.14
\`\`\`

\`fixed\` 表示定点表示，\`setprecision(2)\` 表示保留 2 位小数（会四舍五入）。设置一次，对后续所有浮点输出生效。`,
    task: `## 任务：三色工坊报告

读入一个字符 \`c\`、一个整数 \`n\`、一个小数 \`x\`（用空格分隔），输出工坊报告。

**输入**：一行三个值：字符 整数 小数，如 \`A 21 3.14159\`

**输出**：三行

1. \`字符: <c>, 编码: <c 的 ASCII 码>\`
2. \`翻倍: <n 的两倍>\`
3. \`圆整: <x 保留 2 位小数>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`A 21 3.14159\` | \`字符: A, 编码: 65\`<br>\`翻倍: 42\`<br>\`圆整: 3.14\` |
| \`z 0 2.71828\` | \`字符: z, 编码: 122\`<br>\`翻倍: 0\`<br>\`圆整: 2.72\` |

第 3 行必须用 \`std::fixed << std::setprecision(2)\`，\`2.7\` 要显示成 \`2.70\`。`,
    starter: `#include <iomanip>
#include <iostream>

int main() {
    char c;
    int n;
    double x;
    std::cin >> c >> n >> x;

    // TODO 1: 输出字符行（编码用 static_cast<int>(c)）
    // TODO 2: 输出翻倍
    // TODO 3: 设置 fixed + setprecision(2) 后输出圆整
    return 0;
}
`,
    solution: `#include <iomanip>
#include <iostream>

int main() {
    char c;
    int n;
    double x;
    std::cin >> c >> n >> x;
    std::cout << "字符: " << c << ", 编码: " << static_cast<int>(c) << "\\n";
    std::cout << "翻倍: " << n * 2 << "\\n";
    std::cout << std::fixed << std::setprecision(2) << "圆整: " << x << "\\n";
    return 0;
}
`,
    hints: [
      '字符的编码：`static_cast<int>(c)` 把 char 转成整数再输出，\'A\' 会得到 65。',
      '整数翻倍直接 `n * 2`，整数输出不受 setprecision 影响。',
      '先设置 `std::cout << std::fixed << std::setprecision(2);`（一次即可），再输出 x 就会保留两位小数，注意 2.7 会显示成 2.70。',
    ],
    tests: [
      { name: '样例 1：A 21 3.14159', stdin: 'A 21 3.14159\n', expected: '字符: A, 编码: 65\n翻倍: 42\n圆整: 3.14' },
      { name: '样例 2：z 0 2.71828', stdin: 'z 0 2.71828\n', expected: '字符: z, 编码: 122\n翻倍: 0\n圆整: 2.72' },
      { name: '隐藏：数字字符', stdin: '9 5 1.999\n', expected: '字符: 9, 编码: 57\n翻倍: 10\n圆整: 2.00', hidden: true },
      { name: '隐藏：小数进位', stdin: 'B -3 1.005\n', expected: '字符: B, 编码: 66\n翻倍: -6\n圆整: 1.00', hidden: true },
    ],
  },
  {
    id: 'cpp-basic-3',
    lang: 'cpp',
    module: 'basic',
    order: 3,
    title: '整除炼金炉',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解整数除法向零截断的行为',
      '掌握 % 取余及其符号规则',
      '学会用类型提升得到精确的小数结果',
    ],
    brief: `## 两个除法，两副面孔

C++ 里 \`/\` 对**两个整数**是整除（向零截断），一旦有一方是浮点数就变成精确除法：

\`\`\`cpp
std::cout << 17 / 5;   // 3（整除，不是 3.4！）
std::cout << 17 % 5;   // 2
std::cout << -17 / 5;  // -3（向零截断，不是向下取整）
std::cout << -17 % 5;  // -2（余数符号跟随被除数）
std::cout << 17.0 / 5; // 3.4（有浮点数参与，变精确除法）
\`\`\`

### 类型提升

当 \`int\` 与 \`double\` 混合运算时，\`int\` 会自动"升级"为 \`double\` 再计算：

\`\`\`cpp
int a = 17, b = 5;
double exact = static_cast<double>(a) / b; // 先转 double，除法变精确
\`\`\`

> ⚠️ 最常见的坑：想算平均分写了 \`sum / n\`（两个 int），结果小数全被砍掉。写 \`static_cast<double>(sum) / n\` 才对。

\`%\` 只能用于整数，取余在"拆位数、判断倍数、循环队列"等场景都是利器。`,
    task: `## 任务：一炉三炼

读入两个整数 \`a\` 和 \`b\`（\`b ≠ 0\`），对它们完成三次"冶炼"并输出。

**输入**：一行两个整数 a b（空格分隔）

**输出**：三行

1. \`整除: <a / b>\`（整数除法）
2. \`余数: <a % b>\`
3. \`精确: <a ÷ b 保留 3 位小数>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`17 5\` | \`整除: 3\`<br>\`余数: 2\`<br>\`精确: 3.400\` |
| \`-17 5\` | \`整除: -3\`<br>\`余数: -2\`<br>\`精确: -3.400\` |

第 3 行用 \`std::fixed << std::setprecision(3)\`，\`3.4\` 必须显示成 \`3.400\`。`,
    starter: `#include <iomanip>
#include <iostream>

int main() {
    int a, b;
    std::cin >> a >> b;

    // TODO 1: 整数除法
    // TODO 2: 取余
    // TODO 3: 先把 a 转成 double 再除，用 setprecision(3) 输出
    return 0;
}
`,
    solution: `#include <iomanip>
#include <iostream>

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << "整除: " << a / b << "\\n";
    std::cout << "余数: " << a % b << "\\n";
    std::cout << std::fixed << std::setprecision(3)
              << "精确: " << static_cast<double>(a) / b << "\\n";
    return 0;
}
`,
    hints: [
      '两个 int 相除自动截断：`a / b` 直接就是整除结果，`a % b` 是余数。',
      '精确除法的关键是让其中一方变成浮点数：`static_cast<double>(a) / b`。',
      '输出前先 `std::cout << std::fixed << std::setprecision(3);`，3.4 就会显示为 3.400。注意负数除法向零截断：-17/5 得 -3 而不是 -4。',
    ],
    tests: [
      { name: '样例 1：17 5', stdin: '17 5\n', expected: '整除: 3\n余数: 2\n精确: 3.400' },
      { name: '样例 2：-17 5', stdin: '-17 5\n', expected: '整除: -3\n余数: -2\n精确: -3.400' },
      { name: '隐藏：除不尽', stdin: '1 3\n', expected: '整除: 0\n余数: 1\n精确: 0.333', hidden: true },
      { name: '隐藏：整除干净', stdin: '7 2\n', expected: '整除: 3\n余数: 1\n精确: 3.500', hidden: true },
      { name: '隐藏：小被大', stdin: '2 4\n', expected: '整除: 0\n余数: 2\n精确: 0.500', hidden: true },
    ],
  },
  {
    id: 'cpp-basic-4',
    lang: 'cpp',
    module: 'basic',
    order: 4,
    title: '分支开关台',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握 if / else if / else 多路分支',
      '学会用 switch 处理离散取值',
      '养成先处理特殊分支（如除零）的意识',
    ],
    brief: `## if 与 switch：两条岔路

**if / else if / else** 适合范围判断：

\`\`\`cpp
if (score >= 90) {
    std::cout << "甲上\\n";
} else if (score >= 60) {
    std::cout << "及格\\n";
} else {
    std::cout << "加油\\n";
}
\`\`\`

**switch** 适合对一个变量的离散取值分支，\`break\` 负责跳出，漏写会"贯穿"到下一个 case：

\`\`\`cpp
switch (op) {
    case '+': result = a + b; break; // break 不能忘！
    case '-': result = a - b; break;
    default:  /* 其余情况 */  break;
}
\`\`\`

### 常见坑

- \`=\` 是赋值、\`==\` 才是比较：\`if (x = 5)\` 会把 5 赋给 x 且恒为真。
- 浮点数别用 \`==\` 比较，误差会让它几乎永远不相等。
- 分支判断要**先特殊后一般**：比如先拦住除零，再做正常计算。`,
    task: `## 任务：迷你计算器

读入一个整数 \`a\`、一个运算符 \`op\`、一个整数 \`b\`（空格分隔），用 **switch** 计算并输出结果。

规则：

- \`op\` 为 \`+\`、\`-\`、\`*\`：输出 \`a op b = 结果\`
- \`op\` 为 \`/\`：若 \`b == 0\`，输出 \`除数不能为零\`；否则输出 \`a op b = 商\`（整数除法）
- 其他字符：输出 \`未知运算符\`

**输入**：一行，形如 \`17 + 5\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`17 + 5\` | \`17 + 5 = 22\` |
| \`9 * 3\` | \`9 * 3 = 27\` |
| \`17 / 0\` | \`除数不能为零\` |
| \`12 - 20\` | \`12 - 20 = -8\` |
| \`5 % 3\` | \`未知运算符\` |

输出中的运算符两边各有一个空格。`,
    starter: `#include <iostream>

int main() {
    int a, b;
    char op;
    std::cin >> a >> op >> b;

    // TODO: 用 switch(op) 分支处理 + - * /
    // 注意：'/' 分支里先判断 b 是否为 0
    // default 分支输出"未知运算符"
    return 0;
}
`,
    solution: `#include <iostream>

int main() {
    int a, b;
    char op;
    std::cin >> a >> op >> b;
    switch (op) {
        case '+':
            std::cout << a << " " << op << " " << b << " = " << a + b << "\\n";
            break;
        case '-':
            std::cout << a << " " << op << " " << b << " = " << a - b << "\\n";
            break;
        case '*':
            std::cout << a << " " << op << " " << b << " = " << a * b << "\\n";
            break;
        case '/':
            if (b == 0) {
                std::cout << "除数不能为零\\n";
            } else {
                std::cout << a << " " << op << " " << b << " = " << a / b << "\\n";
            }
            break;
        default:
            std::cout << "未知运算符\\n";
    }
    return 0;
}
`,
    hints: [
      '读入用 `std::cin >> a >> op >> b;`，`>>` 会自动跳过空格，所以 `17 + 5` 三个值能一次读完。',
      'switch 结构：`case \'+\': ... break;`，每个分支末尾的 break 不能漏，否则会继续执行下一个 case。除法分支里先 `if (b == 0)` 拦住除零。',
      '正常结果格式：`std::cout << a << " " << op << " " << b << " = " << 结果 << "\\n";`；错误情况只输出 `除数不能为零` 或 `未知运算符`。',
    ],
    tests: [
      { name: '样例 1：加法', stdin: '17 + 5\n', expected: '17 + 5 = 22' },
      { name: '样例 2：乘法', stdin: '9 * 3\n', expected: '9 * 3 = 27' },
      { name: '样例 3：除零', stdin: '17 / 0\n', expected: '除数不能为零' },
      { name: '隐藏：减出负数', stdin: '12 - 20\n', expected: '12 - 20 = -8', hidden: true },
      { name: '隐藏：不支持的运算符', stdin: '5 % 3\n', expected: '未知运算符', hidden: true },
    ],
  },
  {
    id: 'cpp-basic-5',
    lang: 'cpp',
    module: 'basic',
    order: 5,
    title: '循环数字磨坊',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握 while 与 do-while 的适用场景',
      '理解 do-while 至少执行一次的特性',
      '综合练习：拆解一个整数的每一位',
    ],
    brief: `## 三种循环，各司其职

\`\`\`cpp
for (int i = 0; i < n; ++i) { ... }  // 已知次数：计数循环
while (n > 0) { ... }                // 先判断后执行：可能一次都不跑
do { ... } while (n > 0);            // 先执行后判断：至少跑一次
\`\`\`

**do-while** 的经典用武之地：拆数字。因为即使是 0，也"至少有一位"要处理：

\`\`\`cpp
int digits = 0;
do {
    int d = n % 10;  // 拿出最后一位
    ++digits;
    n /= 10;         // 砍掉最后一位
} while (n > 0);
\`\`\`

若改用 while，\`n = 0\` 时循环体一次都不执行，位数会错算成 0。

### break 与 continue

- \`break\`：立刻跳出整个循环。
- \`continue\`：跳过本轮剩余语句，直接进入下一轮。

> ⚠️ 循环里别忘更新条件变量，否则就是死循环；\`while (true)\` 必须配一个能到达的 \`break\`。`,
    task: `## 任务：数字磨粉

读入一个非负整数 \`n\`（0 ≤ n ≤ 10^8），把它送进磨坊，输出三份"粉末报告"。

**输入**：一行一个整数 n

**输出**：三行

1. \`位数: <n 有几位>\`
2. \`各位和: <各位数字之和>\`
3. \`反转: <把 n 的数字倒过来>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`1234\` | \`位数: 4\`<br>\`各位和: 10\`<br>\`反转: 4321\` |
| \`0\` | \`位数: 1\`<br>\`各位和: 0\`<br>\`反转: 0\` |
| \`100\` | \`位数: 3\`<br>\`各位和: 1\`<br>\`反转: 1\` |

注意 \`100\` 反转后前导零消失，就是 \`1\`；\`0\` 要用 do-while 才能正确算出 1 位。`,
    starter: `#include <iostream>

int main() {
    long long n;
    std::cin >> n;

    int digits = 0;
    long long sum = 0, rev = 0;

    // TODO: 用 do-while 循环拆位
    // 每轮：d = n % 10; 更新 digits/sum/rev; n /= 10;

    std::cout << "位数: " << digits << "\\n";
    std::cout << "各位和: " << sum << "\\n";
    std::cout << "反转: " << rev << "\\n";
    return 0;
}
`,
    solution: `#include <iostream>

int main() {
    long long n;
    std::cin >> n;

    int digits = 0;
    long long sum = 0, rev = 0;
    do {
        int d = static_cast<int>(n % 10);
        ++digits;
        sum += d;
        rev = rev * 10 + d;
        n /= 10;
    } while (n > 0);

    std::cout << "位数: " << digits << "\\n";
    std::cout << "各位和: " << sum << "\\n";
    std::cout << "反转: " << rev << "\\n";
    return 0;
}
`,
    hints: [
      '用 do-while 保证 n=0 时也处理一次：循环体里 `int d = n % 10;` 拿末位，`n /= 10;` 去末位。',
      '三个变量每轮同步更新：`++digits;`、`sum += d;`、`rev = rev * 10 + d;`——rev 正是把各位"推"回去的动作。',
      '反转 100 时：先得 0、再得 0、再得 1，rev 依次为 0、0、1，前导零自动消失。输出三行别改动格式。',
    ],
    tests: [
      { name: '样例 1：1234', stdin: '1234\n', expected: '位数: 4\n各位和: 10\n反转: 4321' },
      { name: '样例 2：0', stdin: '0\n', expected: '位数: 1\n各位和: 0\n反转: 0' },
      { name: '隐藏：尾零', stdin: '100\n', expected: '位数: 3\n各位和: 1\n反转: 1', hidden: true },
      { name: '隐藏：全同数字', stdin: '99999999\n', expected: '位数: 8\n各位和: 72\n反转: 99999999', hidden: true },
      { name: '隐藏：一位数', stdin: '7\n', expected: '位数: 1\n各位和: 7\n反转: 7', hidden: true },
    ],
  },
  {
    id: 'cpp-basic-6',
    lang: 'cpp',
    module: 'basic',
    order: 6,
    title: '函数锻造锤',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握函数定义、参数与返回值',
      '理解函数原型：先声明后使用的意义',
      '学会默认参数的写法与规则',
    ],
    brief: `## 函数：代码的锻件

把一段逻辑封装成函数，就能到处复用：

\`\`\`cpp
int add(int a, int b) {   // 返回类型 参数列表
    return a + b;         // return 把结果送回调用处
}
\`\`\`

**函数原型（声明）**告诉编译器"有这么个函数"，让定义可以放在调用之后：

\`\`\`cpp
int add(int a, int b);        // 原型：只写签名加分号
int main() { return add(1, 2); }
int add(int a, int b) { ... } // 定义放最后也行
\`\`\`

### 默认参数

参数可以带默认值，调用时省略就用默认：

\`\`\`cpp
double power(double base, int exp = 2) {
    double r = 1.0;
    for (int i = 0; i < exp; ++i) r *= base;
    return r;
}
power(3.0);    // 9：exp 用默认值 2
power(3.0, 3); // 27：显式传入 exp
\`\`\`

> ⚠️ 默认参数必须从右往左连续给：\`f(int a, int b = 1)\` 合法，\`f(int a = 1, int b)\` 编译不过。`,
    task: `## 任务：锻造三件工具

在 \`main\` 外定义**三个函数**（评测要求逻辑写在函数里，而不是全堆在 main）：

1. \`int add(int a, int b)\` —— 返回和
2. \`double power(double base, int exp = 2)\` —— 用循环计算 base 的 exp 次方，**exp 带默认值 2**
3. \`int max2(int a, int b)\` —— 返回较大值

**输入**：一行两个整数 a b

**输出**：四行

1. \`a+b = <add(a,b)>\`
2. \`a^2 = <power(a)>\`（用默认参数，保留 1 位小数）
3. \`a^3 = <power(a, 3)>\`（显式传 3，保留 1 位小数）
4. \`max = <max2(a,b)>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 4\` | \`3+4 = 7\`<br>\`3^2 = 9.0\`<br>\`3^3 = 27.0\`<br>\`max = 4\` |
| \`-2 5\` | \`-2+5 = 3\`<br>\`-2^2 = 4.0\`<br>\`-2^3 = -8.0\`<br>\`max = 5\` |

小数行用 \`std::fixed << std::setprecision(1)\`。`,
    starter: `#include <iomanip>
#include <iostream>

// TODO 1: 定义 add 函数

// TODO 2: 定义 power 函数（第二个参数默认值为 2，用循环实现乘方）

// TODO 3: 定义 max2 函数

int main() {
    int a, b;
    std::cin >> a >> b;

    // TODO 4: 按格式调用三个函数输出四行
    return 0;
}
`,
    solution: `#include <iomanip>
#include <iostream>

int add(int a, int b) {
    return a + b;
}

double power(double base, int exp = 2) {
    double result = 1.0;
    for (int i = 0; i < exp; ++i) {
        result *= base;
    }
    return result;
}

int max2(int a, int b) {
    return a > b ? a : b;
}

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << a << "+" << b << " = " << add(a, b) << "\\n";
    std::cout << std::fixed << std::setprecision(1);
    std::cout << a << "^2 = " << power(a) << "\\n";
    std::cout << a << "^3 = " << power(a, 3) << "\\n";
    std::cout << "max = " << max2(a, b) << "\\n";
    return 0;
}
`,
    hints: [
      'power 用累乘实现：`double result = 1.0; for (int i = 0; i < exp; ++i) result *= base;`，签名写成 `double power(double base, int exp = 2)`。',
      '调用时 `power(a)` 用默认指数 2，`power(a, 3)` 显式传 3——这就是默认参数的意义。',
      '输出前统一 `std::cout << std::fixed << std::setprecision(1);`，9 会显示成 9.0；整数行不受影响。',
    ],
    tests: [
      { name: '样例 1：3 4', stdin: '3 4\n', expected: '3+4 = 7\n3^2 = 9.0\n3^3 = 27.0\nmax = 4' },
      { name: '样例 2：-2 5', stdin: '-2 5\n', expected: '-2+5 = 3\n-2^2 = 4.0\n-2^3 = -8.0\nmax = 5' },
      { name: '隐藏：零与正数', stdin: '0 7\n', expected: '0+7 = 7\n0^2 = 0.0\n0^3 = 0.0\nmax = 7', hidden: true },
      { name: '隐藏：较大数', stdin: '10 0\n', expected: '10+0 = 10\n10^2 = 100.0\n10^3 = 1000.0\nmax = 10', hidden: true },
    ],
  },
  {
    id: 'cpp-basic-7',
    lang: 'cpp',
    module: 'basic',
    order: 7,
    title: '引用传送门',
    difficulty: 2,
    xp: 25,
    goals: [
      '理解值传递：函数内修改不影响外部',
      '掌握引用传递：形参是实参的别名',
      '学会用引用实现 swap 与多"返回值"',
    ],
    brief: `## 值传递 vs 引用传递

C++ 函数参数默认是**值传递**——把实参**复制**一份给形参，函数里怎么改都不影响外面：

\`\`\`cpp
void brokenSwap(int a, int b) {
    int t = a; a = b; b = t; // 只交换了副本
}
\`\`\`

在类型后面加一个 \`&\`，就成了**引用传递**——形参是实参的**别名**，同一块内存：

\`\`\`cpp
void swap(int& a, int& b) {
    int t = a;
    a = b;
    b = t; // 真的交换了调用者的变量
}
\`\`\`

### 引用的两个妙用

1. **修改调用者的数据**（如 swap）。
2. **多"返回值"**：函数只能 return 一个值，但可以用引用参数把额外结果"带出来"：

\`\`\`cpp
void minmax(int a, int b, int& mn, int& mx) {
    mn = a < b ? a : b;
    mx = a < b ? b : a;
}
\`\`\`

> 💡 传大对象（如 string、vector）时用 \`const T&\` 既不拷贝又不许改，后面章节会专讲。`,
    task: `## 任务：传送门实验

定义两个使用**引用传递**的函数：

1. \`void swapByRef(int& a, int& b)\` —— 交换两个数
2. \`void minmax(int a, int b, int& mn, int& mx)\` —— 通过引用参数同时带出最小值和最大值

**输入**：一行两个整数 a b

**输出**：三行

1. \`交换前: a=?, b=?\`
2. \`交换后: a=?, b=?\`（调用 swapByRef 之后的值）
3. \`min=?, max=?\`（调用 minmax 得到，min 与 max 后紧跟等号无空格）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 7\` | \`交换前: a=3, b=7\`<br>\`交换后: a=7, b=3\`<br>\`min=3, max=7\` |
| \`-5 12\` | \`交换前: a=-5, b=12\`<br>\`交换后: a=12, b=-5\`<br>\`min=-5, max=12\` |`,
    starter: `#include <iostream>

// TODO 1: 定义 swapByRef(int& a, int& b)，借助临时变量交换

// TODO 2: 定义 minmax(int a, int b, int& mn, int& mx)

int main() {
    int a, b;
    std::cin >> a >> b;

    // TODO 3: 输出交换前的值
    // TODO 4: 调用 swapByRef 后输出交换后的值
    // TODO 5: 定义 mn、mx，调用 minmax 后输出结果
    return 0;
}
`,
    solution: `#include <iostream>

void swapByRef(int& a, int& b) {
    int t = a;
    a = b;
    b = t;
}

void minmax(int a, int b, int& mn, int& mx) {
    if (a <= b) {
        mn = a;
        mx = b;
    } else {
        mn = b;
        mx = a;
    }
}

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << "交换前: a=" << a << ", b=" << b << "\\n";
    swapByRef(a, b);
    std::cout << "交换后: a=" << a << ", b=" << b << "\\n";
    int mn, mx;
    minmax(a, b, mn, mx);
    std::cout << "min=" << mn << ", max=" << mx << "\\n";
    return 0;
}
`,
    hints: [
      'swapByRef 的经典三步：`int t = a; a = b; b = t;`。参数必须写成 `int&`，写成 `int` 就只是交换副本。',
      'minmax 里比较后给 mn、mx 赋值，调用处先声明 `int mn, mx;`，再 `minmax(a, b, mn, mx);`——两个结果从引用参数"流"出来。',
      '输出格式：`std::cout << "交换前: a=" << a << ", b=" << b << "\\n";`，逗号后有空格，min/max 行没有空格。',
    ],
    tests: [
      { name: '样例 1：3 7', stdin: '3 7\n', expected: '交换前: a=3, b=7\n交换后: a=7, b=3\nmin=3, max=7' },
      { name: '样例 2：-5 12', stdin: '-5 12\n', expected: '交换前: a=-5, b=12\n交换后: a=12, b=-5\nmin=-5, max=12' },
      { name: '隐藏：相等值', stdin: '42 42\n', expected: '交换前: a=42, b=42\n交换后: a=42, b=42\nmin=42, max=42', hidden: true },
      { name: '隐藏：含零', stdin: '0 9\n', expected: '交换前: a=0, b=9\n交换后: a=9, b=0\nmin=0, max=9', hidden: true },
    ],
  },
  {
    id: 'cpp-basic-8',
    lang: 'cpp',
    module: 'basic',
    order: 8,
    title: '字符串变形工坊',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握 getline 读入含空格的一整行',
      '熟悉 size、下标访问与遍历修改',
      '综合练习：字符串反转与凯撒加密',
    ],
    brief: `## std::string：随身的字符串工具箱

\`std::string\`（头文件 \`<string>\`）能自动管理内存，是 C++ 里最常用的类型之一：

\`\`\`cpp
std::string s = "Hello";
s.size();          // 长度 5
s[0];              // 首字符 'H'，下标从 0 开始
s + "!";           // 拼接，得到 "Hello!"
\`\`\`

### cin >> 与 getline 的分工

\`cin >> s\` 只读到空白为止；要读**含空格的一整行**，用 \`getline\`：

\`\`\`cpp
std::string line;
std::getline(std::cin, line); // 读一行（不含换行符）
\`\`\`

> ⚠️ \`cin >> x\` 之后紧跟 \`getline\` 会读到空行——数字后面残留的换行符被它吃掉了。需要先 \`cin.ignore()\` 清掉。

### 遍历修改

范围 for 加引用，可以原地修改每个字符：

\`\`\`cpp
for (char& ch : s) { ch = ch + 1; } // 每个字符后移一位
\`\`\``,
    task: `## 任务：三道变形工序

读入**一整行**字符串 \`s\`（可含空格与标点，仅 ASCII 字符，长度 1~200），依次完成三道工序并输出。

**输入**：一行一个字符串（可含空格与标点，仅 ASCII 字符，长度 1~200）

**输出**：三行

1. \`长度: <s.size()>\`
2. \`反转: <s 倒序>\`
3. \`加密: <凯撒加密——每个英文字母后移一位，z→a、Z→A 循环，非字母不变>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`Hello, CodeQuest!\` | \`长度: 17\`<br>\`反转: !tseuQedoC ,olleH\`<br>\`加密: Ifmmp, DpefRvftu!\` |
| \`buzz ZZ\` | \`长度: 7\`<br>\`反转: ZZ zzub\`<br>\`加密: cvaa AA\` |

必须用 \`std::getline\` 读入，\`cin >>\` 会在第一个空格处截断。`,
    starter: `#include <iostream>
#include <string>

int main() {
    std::string s;
    // TODO 1: 用 getline 读入一整行

    // TODO 2: 输出长度

    // TODO 3: 反转（双指针交换首尾）
    // 提示：int i = 0, j = s.size() - 1; 交换 s[i] 与 s[j]，向中间推进

    // TODO 4: 凯撒加密：字母 +1，z/Z 回绕到 a/A，其他字符原样
    return 0;
}
`,
    solution: `#include <iostream>
#include <string>

int main() {
    std::string s;
    std::getline(std::cin, s);

    std::cout << "长度: " << s.size() << "\\n";

    std::string rev = s;
    for (int i = 0, j = static_cast<int>(s.size()) - 1; i < j; ++i, --j) {
        rev[i] = s[j];
        rev[j] = s[i];
    }
    std::cout << "反转: " << rev << "\\n";

    std::string enc = s;
    for (char& ch : enc) {
        if (ch >= 'a' && ch <= 'z') {
            ch = (ch == 'z') ? 'a' : static_cast<char>(ch + 1);
        } else if (ch >= 'A' && ch <= 'Z') {
            ch = (ch == 'Z') ? 'A' : static_cast<char>(ch + 1);
        }
    }
    std::cout << "加密: " << enc << "\\n";
    return 0;
}
`,
    hints: [
      '读整行：`std::getline(std::cin, s);`。长度是 `s.size()`，中文标点也算字符。',
      '反转用双指针：`for (int i = 0, j = s.size() - 1; i < j; ++i, --j)` 循环里交换 `s[i]` 与 `s[j]`（借助临时字符或先拷贝一份）。',
      '加密只在字母分支里加一：小写判断 `ch >= \'a\' && ch <= \'z\'`，`z` 特殊回绕成 `\'a\'`，其余字母 `ch + 1`；逗号、空格、感叹号都原样保留。',
    ],
    tests: [
      { name: '样例 1：Hello, CodeQuest!', stdin: 'Hello, CodeQuest!\n', expected: '长度: 17\n反转: !tseuQedoC ,olleH\n加密: Ifmmp, DpefRvftu!' },
      { name: '样例 2：buzz ZZ', stdin: 'buzz ZZ\n', expected: '长度: 7\n反转: ZZ zzub\n加密: cvaa AA' },
      { name: '隐藏：数字与符号混合', stdin: 'C++ Quest 42!\n', expected: '长度: 13\n反转: !24 tseuQ ++C\n加密: D++ Rvftu 42!', hidden: true },
      { name: '隐藏：回绕边界', stdin: 'zZa\n', expected: '长度: 3\n反转: aZz\n加密: aAb', hidden: true },
    ],
  },
];
