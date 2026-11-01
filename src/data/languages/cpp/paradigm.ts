import type { Level } from '@/types';

/** C++ · 第二章：核心编程思想（10 关） */
export const CPP_PARADIGM: Level[] = [
  {
    id: 'cpp-paradigm-1',
    lang: 'cpp',
    module: 'paradigm',
    order: 1,
    title: '类与封装的第一课',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解 class 默认 private、struct 默认 public',
      '用 private 隐藏数据、public 暴露接口',
      '实现带成员函数的 Rectangle 类',
    ],
    brief: `## 类：数据与行为的封装

\`class\` 把**数据**（成员变量）和**操作**（成员函数）打包在一起：

\`\`\`cpp
class Rectangle {
public:                     // 对外开放的接口
    Rectangle(int w, int h) : width_(w), height_(h) {}  // 构造函数

    int area() const { return width_ * height_; }

private:                    // 对外隐藏的数据
    int width_;
    int height_;
};

Rectangle r(3, 4);
r.area();     // 12 —— 通过接口使用
r.width_;     // ❌ 编译错误：private 成员外部不可访问
\`\`\`

### 封装的意义

外部只能通过 \`public\` 方法操作数据，类内部怎么改（比如把宽高改成对角线存储）都不影响使用者——这就是封装带来的"信息隐藏"。

- \`class\` 的成员默认 \`private\`，\`struct\` 默认 \`public\`，其余语法相同。
- \`area() const\` 里的 \`const\` 表示"这个函数承诺不修改成员"，只读方法都该加上。
- 构造函数与类同名、无返回类型，负责初始化对象；\`: width_(w)\` 是成员初始化列表。

> ⚠️ 数据成员用 \`width_\` 这样的下划线后缀命名（Google 风格），一眼区分成员与局部变量。`,
    task: `## 任务：打造 Rectangle 类

定义一个 \`Rectangle\` 类：

- \`private\` 成员：\`int width_\`、\`int height_\`
- 构造函数：接收宽和高（用成员初始化列表）
- \`int area() const\` —— 返回面积
- \`int perimeter() const\` —— 返回周长
- \`void scale(int k)\` —— 把宽和高各乘以 k

**输入**：一行三个整数 w h k

**输出**：三行

1. \`原始面积: <r.area()>\`
2. \`原始周长: <r.perimeter()>\`
3. \`放大后面积: <scale(k) 之后再调用 area()>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 4 2\` | \`原始面积: 12\`<br>\`原始周长: 14\`<br>\`放大后面积: 48\` |
| \`5 1 3\` | \`原始面积: 5\`<br>\`原始周长: 12\`<br>\`放大后面积: 45\` |`,
    starter: `#include <iostream>

// TODO: 定义 Rectangle 类
// private: width_、height_
// public: 构造函数、area() const、perimeter() const、scale(int k)

int main() {
    int w, h, k;
    std::cin >> w >> h >> k;
    Rectangle r(w, h);

    // TODO: 输出三行报告（最后一行先 scale 再 area）
    return 0;
}
`,
    solution: `#include <iostream>

class Rectangle {
public:
    Rectangle(int w, int h) : width_(w), height_(h) {}

    int area() const { return width_ * height_; }
    int perimeter() const { return 2 * (width_ + height_); }
    void scale(int k) {
        width_ *= k;
        height_ *= k;
    }

private:
    int width_;
    int height_;
};

int main() {
    int w, h, k;
    std::cin >> w >> h >> k;
    Rectangle r(w, h);
    std::cout << "原始面积: " << r.area() << "\\n";
    std::cout << "原始周长: " << r.perimeter() << "\\n";
    r.scale(k);
    std::cout << "放大后面积: " << r.area() << "\\n";
    return 0;
}
`,
    hints: [
      '类骨架：`class Rectangle { public: ... private: int width_; int height_; };`，别忘了结尾的分号。',
      '构造函数用初始化列表：`Rectangle(int w, int h) : width_(w), height_(h) {}`；只读方法在参数列表后加 const。',
      'main 里三步：先输出 area/perimeter，再 `r.scale(k);`，最后再输出一次 `r.area()`。',
    ],
    tests: [
      { name: '样例 1：3 4 2', stdin: '3 4 2\n', expected: '原始面积: 12\n原始周长: 14\n放大后面积: 48' },
      { name: '样例 2：5 1 3', stdin: '5 1 3\n', expected: '原始面积: 5\n原始周长: 12\n放大后面积: 45' },
      { name: '隐藏：单位方形放大', stdin: '1 1 10\n', expected: '原始面积: 1\n原始周长: 4\n放大后面积: 100', hidden: true },
      { name: '隐藏：放大 2 倍', stdin: '7 6 2\n', expected: '原始面积: 42\n原始周长: 26\n放大后面积: 168', hidden: true },
    ],
  },
  {
    id: 'cpp-paradigm-2',
    lang: 'cpp',
    module: 'paradigm',
    order: 2,
    title: '构造与析构的生命线',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解构造函数与析构函数的调用时机',
      '掌握成员初始化列表的写法',
      '体会栈对象按构造的逆序析构',
    ],
    brief: `## 对象的一生

C++ 里栈上的对象遵循一条铁律：**出生时调构造函数，离开作用域时自动调析构函数**，且析构顺序与构造顺序**相反**（后建先毁）。

\`\`\`cpp
class Tracer {
public:
    explicit Tracer(std::string name) : name_(std::move(name)) {
        std::cout << "构造: " << name_ << "\\n";
    }
    ~Tracer() {
        std::cout << "析构: " << name_ << "\\n";
    }
private:
    std::string name_;
};

int main() {
    Tracer a("外层");
    {
        Tracer b("内层");
    }              // b 在这里析构
    std::cout << "作用域结束\\n";
}                  // a 在这里析构
\`\`\`

输出顺序：构造外层 → 构造内层 → 析构内层 → 作用域结束 → 析构外层。

### 两个要点

- **成员初始化列表**（\`: name_(...)\`）直接以"生下来就有值"的方式初始化成员，比在函数体里赋值更高效，也是 const 成员、引用成员唯一的初始化方式。
- \`explicit\` 禁止构造函数被隐式调用，避免意外的自动转换。

> 💡 这条"离开作用域必析构"的规则，正是后面 RAII 技术的基石。`,
    task: `## 任务：追踪对象的一生

实现一个 \`Tracer\` 类：构造时输出 \`构造: <名字>\`，析构时输出 \`析构: <名字>\`（用成员初始化列表保存名字）。

在 main 中读入两个名字 \`outer\` 和 \`inner\`，然后：

1. 用 outer 创建对象 a
2. 进入一个 \`{ }\` 作用域块，用 inner 创建对象 b
3. 块结束后输出 \`作用域结束\`

**输入**：一行两个字符串（空格分隔），如 \`外层 内层\`

**输出**：五行（构造两条、析构两条、中间一条）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`外层 内层\` | \`构造: 外层\`<br>\`构造: 内层\`<br>\`析构: 内层\`<br>\`作用域结束\`<br>\`析构: 外层\` |
| \`数据库 文件\` | \`构造: 数据库\`<br>\`构造: 文件\`<br>\`析构: 文件\`<br>\`作用域结束\`<br>\`析构: 数据库\` |`,
    starter: `#include <iostream>
#include <string>
#include <utility>

// TODO: 定义 Tracer 类
// 构造函数打印 "构造: 名字"，析构函数打印 "析构: 名字"
// 记得用成员初始化列表

int main() {
    std::string outer, inner;
    std::cin >> outer >> inner;

    // TODO: 创建 a，进入块创建 b，块结束，打印"作用域结束"
    return 0;
}
`,
    solution: `#include <iostream>
#include <string>
#include <utility>

class Tracer {
public:
    explicit Tracer(std::string name) : name_(std::move(name)) {
        std::cout << "构造: " << name_ << "\\n";
    }
    ~Tracer() {
        std::cout << "析构: " << name_ << "\\n";
    }

private:
    std::string name_;
};

int main() {
    std::string outer, inner;
    std::cin >> outer >> inner;
    Tracer a(outer);
    {
        Tracer b(inner);
    }
    std::cout << "作用域结束\\n";
    return 0;
}
`,
    hints: [
      '析构函数签名是 `~Tracer()`，无参数无返回值；构造和析构里各一行 cout。',
      '成员初始化列表写法：`Tracer(std::string name) : name_(std::move(name)) { ... }`，需要 `#include <utility>`。',
      'main 里先建 a，再 `{ Tracer b(inner); }` 让 b 在块结束时析构，然后打印"作用域结束"，a 要等 main 结束才析构。',
    ],
    tests: [
      { name: '样例 1：外层 内层', stdin: '外层 内层\n', expected: '构造: 外层\n构造: 内层\n析构: 内层\n作用域结束\n析构: 外层' },
      { name: '样例 2：数据库 文件', stdin: '数据库 文件\n', expected: '构造: 数据库\n构造: 文件\n析构: 文件\n作用域结束\n析构: 数据库' },
      { name: '隐藏：英文名', stdin: 'Alpha Beta\n', expected: '构造: Alpha\n构造: Beta\n析构: Beta\n作用域结束\n析构: Alpha', hidden: true },
      { name: '隐藏：单字名', stdin: '甲 乙\n', expected: '构造: 甲\n构造: 乙\n析构: 乙\n作用域结束\n析构: 甲', hidden: true },
    ],
  },
  {
    id: 'cpp-paradigm-3',
    lang: 'cpp',
    module: 'paradigm',
    order: 3,
    title: '运算符的定制车间',
    difficulty: 2,
    xp: 25,
    goals: [
      '掌握成员函数形式的 operator+',
      '学会用 friend 重载 operator<< 输出对象',
      '理解运算符重载只是"有名字的函数"',
    ],
    brief: `## 让自定义类型也认得 + 和 <<

运算符重载＝给运算符指定一个函数实现。对 \`Vec2\`（二维向量）重载加法：

\`\`\`cpp
class Vec2 {
public:
    Vec2(int x, int y) : x_(x), y_(y) {}

    Vec2 operator+(const Vec2& o) const {   // 成员函数形式
        return Vec2(x_ + o.x_, y_ + o.y_);
    }
    bool operator==(const Vec2& o) const {
        return x_ == o.x_ && y_ == o.y_;
    }

private:
    int x_, y_;
};

Vec2 a(1, 2), b(3, 4);
Vec2 c = a + b;   // 等价于 a.operator+(b)
\`\`\`

### 输出运算符必须是非成员函数

\`cout << v\` 的左操作数是 \`ostream\`，不是 Vec2，所以 \`operator<<\` 写不成成员函数。惯例是定义成类的 **friend**，让它能访问私有成员：

\`\`\`cpp
friend std::ostream& operator<<(std::ostream& os, const Vec2& v) {
    os << "(" << v.x_ << ", " << v.y_ << ")";
    return os;   // 返回流本身，才能链式 <<
}
\`\`\`

> ⚠️ 输出 bool 时默认打印 1/0；加 \`std::boolalpha\` 就变成 true/false。`,
    task: `## 任务：向量计算器

定义 \`Vec2\` 类（私有成员 \`int x_\`、\`int y_\`），完成：

- 构造函数（默认值为 0）
- \`operator+\`（成员函数）
- \`operator==\`（成员函数）
- \`operator<<\`（friend 非成员函数，输出格式 \`(x, y)\`）

**输入**：一行四个整数 x1 y1 x2 y2

**输出**：两行

1. \`和: <v1 + v2>\`（用重载的 + 和 << 输出）
2. \`相等: <true/false>\`（v1 与 v2 是否相等，用 boolalpha）

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3 4 1 2\` | \`和: (4, 6)\`<br>\`相等: false\` |
| \`5 5 5 5\` | \`和: (10, 10)\`<br>\`相等: true\` |`,
    starter: `#include <iostream>

// TODO: 定义 Vec2 类
// 构造函数（默认 0）、operator+、operator==（成员）
// operator<< 用 friend 定义在类内

int main() {
    int x1, y1, x2, y2;
    std::cin >> x1 >> y1 >> x2 >> y2;
    Vec2 a(x1, y1), b(x2, y2);

    // TODO: 输出"和"与"相等"两行
    return 0;
}
`,
    solution: `#include <iostream>

class Vec2 {
public:
    Vec2(int x = 0, int y = 0) : x_(x), y_(y) {}

    Vec2 operator+(const Vec2& other) const {
        return Vec2(x_ + other.x_, y_ + other.y_);
    }

    bool operator==(const Vec2& other) const {
        return x_ == other.x_ && y_ == other.y_;
    }

    friend std::ostream& operator<<(std::ostream& os, const Vec2& v) {
        os << "(" << v.x_ << ", " << v.y_ << ")";
        return os;
    }

private:
    int x_;
    int y_;
};

int main() {
    int x1, y1, x2, y2;
    std::cin >> x1 >> y1 >> x2 >> y2;
    Vec2 a(x1, y1), b(x2, y2);
    std::cout << "和: " << a + b << "\\n";
    std::cout << std::boolalpha << "相等: " << (a == b) << "\\n";
    return 0;
}
`,
    hints: [
      'operator+ 是成员函数：`Vec2 operator+(const Vec2& other) const { return Vec2(x_ + other.x_, y_ + other.y_); }`。',
      'operator<< 写成 friend：`friend std::ostream& operator<<(std::ostream& os, const Vec2& v)`，最后 `return os;` 支持链式输出，格式 `(x, y)`。',
      '相等行先开 `std::boolalpha`，并给 `(a == b)` 加括号——`<<` 的优先级高于 `==`，不括起来编译不过。',
    ],
    tests: [
      { name: '样例 1：3 4 1 2', stdin: '3 4 1 2\n', expected: '和: (4, 6)\n相等: false' },
      { name: '样例 2：5 5 5 5', stdin: '5 5 5 5\n', expected: '和: (10, 10)\n相等: true' },
      { name: '隐藏：负坐标', stdin: '-1 -2 3 4\n', expected: '和: (2, 2)\n相等: false', hidden: true },
      { name: '隐藏：全零', stdin: '0 0 0 0\n', expected: '和: (0, 0)\n相等: true', hidden: true },
    ],
  },
  {
    id: 'cpp-paradigm-4',
    lang: 'cpp',
    module: 'paradigm',
    order: 4,
    title: '继承与虚函数的变身术',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握 public 继承与虚函数重写',
      '理解 override 关键字的作用',
      '体会通过基类引用实现的动态绑定',
    ],
    brief: `## 继承：派生类复用基类

\`class Circle : public Shape\` 表示 Circle 是一种 Shape，自动获得 Shape 的成员。基类把函数标为 **virtual**，派生类**重写（override）**它，就能实现"同一接口、不同行为"：

\`\`\`cpp
class Shape {
public:
    virtual ~Shape() {}                          // 有虚函数就要有虚析构
    virtual std::string name() const { return "形状"; }
    virtual double area() const { return 0.0; }
};

class Circle : public Shape {
public:
    std::string name() const override { return "圆"; }     // override 防拼错
    double area() const override { return 3.14 * r_ * r_; }
};
\`\`\`

### 动态绑定：运行时才决定调谁

通过**基类引用或指针**调用虚函数时，执行的是**实际对象类型**的版本：

\`\`\`cpp
void report(const Shape& s) {
    std::cout << s.name() << " " << s.area();  // 走子类版本
}
report(Circle(2));  // 圆 …
report(Rect(3, 4)); // 矩形 …
\`\`\`

这就是**多态**。没有 virtual，\`s.name()\` 永远只会调 Shape 的版本。

> ⚠️ \`override\` 不是必须的，但它让编译器替你检查"确实重写了基类虚函数"，强烈建议始终写上。`,
    task: `## 任务：图形报告器

定义继承体系并输出图形报告：

- 基类 \`Shape\`：虚析构、虚函数 \`std::string name() const\`（返回 \`形状\`）、虚函数 \`double area() const\`（返回 0）
- \`Circle : public Shape\`：构造接收半径 r，\`name()\` 返回 \`圆\`，\`area()\` 返回 \`3.14159265358979 * r * r\`
- \`Rect : public Shape\`：构造接收宽 w 高 h，\`name()\` 返回 \`矩形\`，\`area()\` 返回 \`w * h\`
- 一个函数 \`void report(const Shape& s)\`：输出 \`<名称>: 面积=<面积，保留 2 位小数>\`

**输入**：第一行 n；接下来 n 行，每行 \`C r\`（圆）或 \`R w h\`（矩形）

**输出**：n 行报告

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`C 2\`<br>\`R 3 4\`<br>\`C 1\` | \`圆: 面积=12.57\`<br>\`矩形: 面积=12.00\`<br>\`圆: 面积=3.14\` |
| \`2\`<br>\`R 5 2\`<br>\`C 3\` | \`矩形: 面积=10.00\`<br>\`圆: 面积=28.27\` |

report 只接收 \`const Shape&\`，靠虚函数自动分发到正确的版本。`,
    starter: `#include <iomanip>
#include <iostream>
#include <string>

const double kPi = 3.14159265358979;

// TODO 1: 定义 Shape 基类（虚析构 + 虚 name + 虚 area）

// TODO 2: 定义 Circle 派生类（override 两个虚函数）

// TODO 3: 定义 Rect 派生类（override 两个虚函数）

// TODO 4: 定义 report(const Shape& s) 输出一行报告

int main() {
    int n;
    std::cin >> n;
    // TODO 5: 循环读入并构造对应对象，交给 report
    return 0;
}
`,
    solution: `#include <iomanip>
#include <iostream>
#include <string>

const double kPi = 3.14159265358979;

class Shape {
public:
    virtual ~Shape() {}
    virtual std::string name() const { return "形状"; }
    virtual double area() const { return 0.0; }
};

class Circle : public Shape {
public:
    explicit Circle(double r) : radius_(r) {}
    std::string name() const override { return "圆"; }
    double area() const override { return kPi * radius_ * radius_; }

private:
    double radius_;
};

class Rect : public Shape {
public:
    Rect(double w, double h) : width_(w), height_(h) {}
    std::string name() const override { return "矩形"; }
    double area() const override { return width_ * height_; }

private:
    double width_;
    double height_;
};

void report(const Shape& s) {
    std::cout << s.name() << ": 面积=" << std::fixed << std::setprecision(2)
              << s.area() << "\\n";
}

int main() {
    int n;
    std::cin >> n;
    for (int i = 0; i < n; ++i) {
        char type;
        std::cin >> type;
        if (type == 'C') {
            double r;
            std::cin >> r;
            report(Circle(r));
        } else {
            double w, h;
            std::cin >> w >> h;
            report(Rect(w, h));
        }
    }
    return 0;
}
`,
    hints: [
      '派生类写法：`class Circle : public Shape { ... };`，重写的函数签名后加 `override`，比如 `std::string name() const override`。',
      'report 函数的形参是 `const Shape&`——多态的关键。里面一次 `s.name()`、一次 `s.area()`，运行时自动落到圆或矩形的实现。',
      '读入分支：`char type; std::cin >> type;`，\'C\' 后面再读一个 double，\'R\' 后面读两个 double，各自构造对象传给 report。',
    ],
    tests: [
      { name: '样例 1：混合图形', stdin: '3\nC 2\nR 3 4\nC 1\n', expected: '圆: 面积=12.57\n矩形: 面积=12.00\n圆: 面积=3.14' },
      { name: '样例 2：先矩后圆', stdin: '2\nR 5 2\nC 3\n', expected: '矩形: 面积=10.00\n圆: 面积=28.27' },
      { name: '隐藏：大半径', stdin: '1\nC 10\n', expected: '圆: 面积=314.16', hidden: true },
      { name: '隐藏：零与小数', stdin: '4\nC 0\nR 1 1\nC 5\nR 2 2\n', expected: '圆: 面积=0.00\n矩形: 面积=1.00\n圆: 面积=78.54\n矩形: 面积=4.00', hidden: true },
    ],
  },
  {
    id: 'cpp-paradigm-5',
    lang: 'cpp',
    module: 'paradigm',
    order: 5,
    title: '抽象类的契约书',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解纯虚函数 = 0 与抽象类',
      '认识接口：只定义契约不给实现',
      '通过基类指针数组统一调度子类对象',
    ],
    brief: `## 纯虚函数：只立规矩，不给实现

在虚函数声明后写 \` = 0\`，它就成了**纯虚函数**——本类不实现，强制每个派生类自己给：

\`\`\`cpp
class Animal {
public:
    virtual ~Animal() = default;
    virtual std::string speak() const = 0;  // 纯虚函数
};

class Dog : public Animal {
public:
    std::string speak() const override { return "汪汪"; }
};
\`\`\`

含纯虚函数的类是**抽象类**：\`Animal a;\` 直接编译错误——不能实例化只有契约、没有实现的"概念"。

### 抽象类当接口用

把一堆不同子类的对象放进**基类指针**数组，就能统一调度：

\`\`\`cpp
std::vector<Animal*> zoo;
zoo.push_back(new Dog("旺财"));
for (const auto& a : zoo) std::cout << a->name() << ": " << a->speak() << "\\n";
for (auto* a : zoo) delete a;  // 裸 new 过的内存要手动 delete
\`\`\`

> ⚠️ \`new\` 和 \`delete\` 必须成对出现，忘了 delete 就是内存泄漏——下一章的智能指针会根治这个问题。`,
    task: `## 任务：动物园点名

定义抽象类 \`Animal\`：

- \`private\` 成员 \`std::string name_\`（构造函数保存）
- \`const std::string& name() const\` 返回名字
- 纯虚函数 \`std::string speak() const = 0\`
- 虚析构

再定义三个派生类，各自重写 \`speak()\`：\`Dog\` → \`汪汪\`、\`Cat\` → \`喵喵\`、\`Bird\` → \`叽叽\`。

**输入**：第一行 n；接下来 n 行，每行格式为 \`<类型> <名字>\`，类型是 \`D\`/\`C\`/\`B\` 之一

**输出**：n 行点名结果，格式 \`<名字>: <叫声>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`3\`<br>\`D 旺财\`<br>\`C 咪咪\`<br>\`D 小黑\` | \`旺财: 汪汪\`<br>\`咪咪: 喵喵\`<br>\`小黑: 汪汪\` |
| \`1\`<br>\`B 小黄\` | \`小黄: 叽叽\` |

用 \`std::vector<Animal*>\` 存所有动物，最后统一 \`delete\`。`,
    starter: `#include <iostream>
#include <string>
#include <vector>

// TODO 1: 定义抽象类 Animal（name_、name()、纯虚 speak、虚析构）

// TODO 2: 定义 Dog / Cat / Bird 三个派生类

int main() {
    int n;
    std::cin >> n;
    std::vector<Animal*> zoo;

    // TODO 3: 读入并 new 出对应动物，放入 zoo

    // TODO 4: 遍历 zoo 输出点名

    // TODO 5: delete 所有动物，防止泄漏
    return 0;
}
`,
    solution: `#include <iostream>
#include <string>
#include <vector>

class Animal {
public:
    explicit Animal(std::string name) : name_(std::move(name)) {}
    virtual ~Animal() {}
    const std::string& name() const { return name_; }
    virtual std::string speak() const = 0;

private:
    std::string name_;
};

class Dog : public Animal {
public:
    explicit Dog(std::string name) : Animal(std::move(name)) {}
    std::string speak() const override { return "汪汪"; }
};

class Cat : public Animal {
public:
    explicit Cat(std::string name) : Animal(std::move(name)) {}
    std::string speak() const override { return "喵喵"; }
};

class Bird : public Animal {
public:
    explicit Bird(std::string name) : Animal(std::move(name)) {}
    std::string speak() const override { return "叽叽"; }
};

int main() {
    int n;
    std::cin >> n;
    std::vector<Animal*> zoo;
    for (int i = 0; i < n; ++i) {
        char type;
        std::string name;
        std::cin >> type >> name;
        if (type == 'D') {
            zoo.push_back(new Dog(name));
        } else if (type == 'C') {
            zoo.push_back(new Cat(name));
        } else {
            zoo.push_back(new Bird(name));
        }
    }
    for (const auto& a : zoo) {
        std::cout << a->name() << ": " << a->speak() << "\\n";
    }
    for (auto* a : zoo) {
        delete a;
    }
    return 0;
}
`,
    hints: [
      '抽象类骨架：`virtual std::string speak() const = 0;`。写了 = 0 之后 Animal 就不能直接实例化，只能当基类。',
      '派生类构造函数要把名字转交给基类：`Dog(std::string name) : Animal(std::move(name)) {}`，然后 `override` speak。',
      'main 里按类型 `new Dog(name)` 等放入 vector，输出用 `a->name()` 与 `a->speak()`（指针用箭头），最后 for 循环逐个 delete。',
    ],
    tests: [
      { name: '样例 1：猫狗同笼', stdin: '3\nD 旺财\nC 咪咪\nD 小黑\n', expected: '旺财: 汪汪\n咪咪: 喵喵\n小黑: 汪汪' },
      { name: '样例 2：只有鸟', stdin: '1\nB 小黄\n', expected: '小黄: 叽叽' },
      { name: '隐藏：五只混编', stdin: '5\nC a\nD b\nB c\nC d\nB e\n', expected: 'a: 喵喵\nb: 汪汪\nc: 叽叽\nd: 喵喵\ne: 叽叽', hidden: true },
      { name: '隐藏：数字名字', stdin: '1\nD 0\n', expected: '0: 汪汪', hidden: true },
    ],
  },
  {
    id: 'cpp-paradigm-6',
    lang: 'cpp',
    module: 'paradigm',
    order: 6,
    title: 'lambda 匿名工匠',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握 lambda 语法 [捕获](参数){ 函数体 }',
      '理解按值捕获与按引用捕获的区别',
      '把 lambda 作为回调交给 sort 与 count_if',
    ],
    brief: `## lambda：随手定义的匿名函数

lambda 可以在代码里"就地"写出一个函数：

\`\`\`cpp
[](int a, int b) { return a > b; }   // 没有名字：比较 a、b
\`\`\`

完整结构是 **[捕获](参数) -> 返回类型 { 函数体 }**，返回类型通常可省略。

### 捕获：lambda 记住了谁

方括号决定 lambda 能否使用外部的变量：

\`\`\`cpp
int t = 10;
[t](int x) { return x > t; }   // 按值捕获 t：拷贝一份，安全
[&t](int x) { return x > t; }  // 按引用捕获：跟随 t 的变化
[=]  // 按值捕获全部用到的变量
[&]  // 按引用捕获全部用到的变量
\`\`\`

按值捕获后外部改 t 不影响 lambda；按引用捕获则同步变化。默认建议按值，行为更可控。

### 作为回调交给算法

STL 算法普遍接受"可调用对象"，lambda 是最方便的回调：

\`\`\`cpp
std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; }); // 降序
int n = std::count_if(v.begin(), v.end(), [t](int x) { return x > t; });
\`\`\``,
    task: `## 任务：排序与筛选流水线

读入 n 个整数和一个阈值 t，用 **lambda** 完成两道工序：

1. 用 \`std::sort\` 配合 lambda 把序列**降序**排列
2. 用 \`std::count_if\` 配合**捕获 t 的 lambda** 统计严格大于 t 的个数

**输入**：第一行 n（1 ≤ n ≤ 1000）；第二行 n 个整数；第三行阈值 t

**输出**：两行

1. \`降序: <降序后的序列，数字间一个空格>\`
2. \`大于 <t>: <个数>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5\`<br>\`3 1 4 1 5\`<br>\`3\` | \`降序: 5 4 3 1 1\`<br>\`大于 3: 2\` |
| \`1\`<br>\`7\`<br>\`7\` | \`降序: 7\`<br>\`大于 7: 0\` |`,
    starter: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (auto& x : v) std::cin >> x;
    int t;
    std::cin >> t;

    // TODO 1: sort + lambda 降序排列

    // TODO 2: count_if + 捕获 t 的 lambda 统计

    // TODO 3: 按格式输出两行
    return 0;
}
`,
    solution: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (auto& x : v) std::cin >> x;
    int t;
    std::cin >> t;

    std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });

    int count = static_cast<int>(
        std::count_if(v.begin(), v.end(), [t](int x) { return x > t; }));

    std::cout << "降序:";
    for (int x : v) std::cout << " " << x;
    std::cout << "\\n";
    std::cout << "大于 " << t << ": " << count << "\\n";
    return 0;
}
`,
    hints: [
      '降序比较器：`[](int a, int b) { return a > b; }`——a 排在 b 前面当且仅当 a 更大。',
      '统计用捕获：`std::count_if(v.begin(), v.end(), [t](int x) { return x > t; })`，方括号里的 t 是按值捕获。',
      '输出列表时先打 "降序:"，循环里 `std::cout << " " << x;`（空格打在数字前面就不会有行尾空格），count_if 的返回值记得转成 int。',
    ],
    tests: [
      { name: '样例 1：3 1 4 1 5', stdin: '5\n3 1 4 1 5\n3\n', expected: '降序: 5 4 3 1 1\n大于 3: 2' },
      { name: '样例 2：等于阈值', stdin: '1\n7\n7\n', expected: '降序: 7\n大于 7: 0' },
      { name: '隐藏：负数', stdin: '3\n-1 -5 -3\n-4\n', expected: '降序: -1 -3 -5\n大于 -4: 2', hidden: true },
      { name: '隐藏：全部大于', stdin: '4\n10 10 10 10\n9\n', expected: '降序: 10 10 10 10\n大于 9: 4', hidden: true },
    ],
  },
  {
    id: 'cpp-paradigm-7',
    lang: 'cpp',
    module: 'paradigm',
    order: 7,
    title: '模板函数万用模',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解模板：一份代码适配多种类型',
      '掌握 template <typename T> 函数模板',
      '体会编译器按调用实参自动实例化',
    ],
    brief: `## 模板：给编译器的"填空题"

写 \`max\` 函数，int 版、double 版、char 版逻辑一模一样，只是类型不同。函数模板让你**只写一次**：

\`\`\`cpp
template <typename T>
T myMax(const T& a, const T& b) {
    return a > b ? a : b;
}

myMax(3, 7);        // 编译器生成 int 版
myMax(2.5, 3.9);    // 生成 double 版
myMax('x', 'm');    // 生成 char 版
\`\`\`

\`T\` 是一个**类型占位符**：每次调用，编译器根据实参类型"填空"生成一份真实函数，这个过程叫**实例化**。零运行时开销——和手写三个版本完全等价。

### 两个惯例

- 参数写 \`const T&\`：不拷贝、又允许传入大对象。
- 模板定义必须放在调用点**可见**的位置（通常就在头文件/同文件顶部），因为实例化时编译器需要看到完整定义。

> 💡 \`typename\` 也可写作 \`class\`：\`template <class T>\`，两者完全等价。`,
    task: `## 任务：一台模子打三种料

编写函数模板 \`T myMax(const T& a, const T& b)\`，对三种类型各调用一次。

**输入**：三行

1. 两个整数 a b
2. 两个小数 c d
3. 两个字符 c1 c2（空格分隔）

**输出**：三行

1. \`整数最大: <myMax(a, b)>\`
2. \`小数最大: <myMax(c, d)>\`（保留 2 位小数）
3. \`字母最大: <myMax(c1, c2)>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`7 17\`<br>\`2.5 3.9\`<br>\`x m\` | \`整数最大: 17\`<br>\`小数最大: 3.90\`<br>\`字母最大: x\` |
| \`-9 -2\`<br>\`-1.5 -2.5\`<br>\`B A\` | \`整数最大: -2\`<br>\`小数最大: -1.50\`<br>\`字母最大: B\` |`,
    starter: `#include <iomanip>
#include <iostream>

// TODO: 编写函数模板 myMax

int main() {
    int a, b;
    double c, d;
    char c1, c2;
    std::cin >> a >> b >> c >> d >> c1 >> c2;

    // TODO: 三次调用 myMax 并按格式输出
    return 0;
}
`,
    solution: `#include <iomanip>
#include <iostream>

template <typename T>
T myMax(const T& a, const T& b) {
    return a > b ? a : b;
}

int main() {
    int a, b;
    double c, d;
    char c1, c2;
    std::cin >> a >> b >> c >> d >> c1 >> c2;
    std::cout << "整数最大: " << myMax(a, b) << "\\n";
    std::cout << std::fixed << std::setprecision(2)
              << "小数最大: " << myMax(c, d) << "\\n";
    std::cout << "字母最大: " << myMax(c1, c2) << "\\n";
    return 0;
}
`,
    hints: [
      '模板头两行固定写法：`template <typename T>` 换行后 `T myMax(const T& a, const T& b) { return a > b ? a : b; }`。',
      '三次调用直接 `myMax(a, b)`、`myMax(c, d)`、`myMax(c1, c2)`，编译器自动按实参类型实例化，不需要写 myMax<int>(...)。',
      '小数行前设置 `std::fixed << std::setprecision(2)`；字母是 char，输出不受影响。',
    ],
    tests: [
      { name: '样例 1：7 17 / 2.5 3.9 / x m', stdin: '7 17\n2.5 3.9\nx m\n', expected: '整数最大: 17\n小数最大: 3.90\n字母最大: x' },
      { name: '样例 2：负数与字母序', stdin: '-9 -2\n-1.5 -2.5\nB A\n', expected: '整数最大: -2\n小数最大: -1.50\n字母最大: B' },
      { name: '隐藏：相等值', stdin: '5 5\n1.5 1.5\na a\n', expected: '整数最大: 5\n小数最大: 1.50\n字母最大: a', hidden: true },
      { name: '隐藏：小数位数', stdin: '0 0\n0.05 0.04\nZ Z\n', expected: '整数最大: 0\n小数最大: 0.05\n字母最大: Z', hidden: true },
    ],
  },
  {
    id: 'cpp-paradigm-8',
    lang: 'cpp',
    module: 'paradigm',
    order: 8,
    title: '模板类：万能收纳盒',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握类模板 template <typename T> class',
      '理解模板类内部可以用 T 声明成员与参数',
      '综合运用：实现一个可复用的 Stack',
    ],
    brief: `## 类模板：类型也是参数

函数模板泛化"函数"，类模板泛化"整个类"。一个不用写死的栈：

\`\`\`cpp
template <typename T>
class Stack {
public:
    void push(const T& v) { data_.push_back(v); }
    void pop() { data_.pop_back(); }
    const T& top() const { return data_.back(); }
    bool empty() const { return data_.empty(); }
    int size() const { return static_cast<int>(data_.size()); }

private:
    std::vector<T> data_;   // 用 T 声明成员
};

Stack<int> si;          // 装整数的栈
Stack<std::string> ss;  // 装字符串的栈
\`\`\`

类模板使用时**必须显式给出类型**（\`Stack<int>\`），编译器才能实例化出具体类。

### 实现要点

- 内部用 \`std::vector<T>\` 存数据，push_back / pop_back / back 天然对应入栈、出栈、看栈顶。
- 操作前先判空：对空栈 pop / top 是未定义行为，业务上要先检查。
- \`size()\` 的返回值做一次 \`static_cast<int>\`，避免无符号数参与的隐式转换。`,
    task: `## 任务：实现 Stack<int> 收纳盒

编写类模板 \`Stack<T>\`（内部用 \`std::vector<T>\`），提供：\`push\`、\`pop\`、\`top\`、\`empty\`、\`size\`。然后用它模拟一串操作。

**输入**：第一行 m（操作数，1 ≤ m ≤ 1000）；接下来 m 行：

- \`push x\` —— 入栈（无输出）
- \`pop\` —— 出栈；若栈空输出 \`pop: 空\`
- \`top\` —— 输出栈顶元素（单独一行）；若栈空输出 \`top: 空\`

**输出**：所有 top/pop 的输出，最后追加一行 \`大小: <size()>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`6\`<br>\`push 1\`<br>\`push 2\`<br>\`top\`<br>\`pop\`<br>\`top\`<br>\`pop\` | \`2\`<br>\`1\`<br>\`大小: 0\` |
| \`5\`<br>\`push 5\`<br>\`top\`<br>\`pop\`<br>\`pop\`<br>\`top\` | \`5\`<br>\`pop: 空\`<br>\`top: 空\`<br>\`大小: 0\` |`,
    starter: `#include <iostream>
#include <string>
#include <vector>

// TODO: 编写类模板 Stack<T>
// 内部 std::vector<T> data_，提供 push/pop/top/empty/size

int main() {
    int m;
    std::cin >> m;
    Stack<int> st;

    // TODO: 循环处理三种操作，注意空栈的输出
    // TODO: 最后输出 大小: st.size()
    return 0;
}
`,
    solution: `#include <iostream>
#include <string>
#include <vector>

template <typename T>
class Stack {
public:
    void push(const T& value) { data_.push_back(value); }

    void pop() { data_.pop_back(); }

    const T& top() const { return data_.back(); }

    bool empty() const { return data_.empty(); }

    int size() const { return static_cast<int>(data_.size()); }

private:
    std::vector<T> data_;
};

int main() {
    int m;
    std::cin >> m;
    Stack<int> st;
    for (int i = 0; i < m; ++i) {
        std::string op;
        std::cin >> op;
        if (op == "push") {
            int x;
            std::cin >> x;
            st.push(x);
        } else if (op == "pop") {
            if (st.empty()) {
                std::cout << "pop: 空\\n";
            } else {
                st.pop();
            }
        } else if (op == "top") {
            if (st.empty()) {
                std::cout << "top: 空\\n";
            } else {
                std::cout << st.top() << "\\n";
            }
        }
    }
    std::cout << "大小: " << st.size() << "\\n";
    return 0;
}
`,
    hints: [
      '类模板五个方法都只有一两行：push 用 push_back、pop 用 pop_back、top 用 back，empty/size 直接转发 vector 的同名函数。',
      '读操作用 `std::string op; std::cin >> op;` 再比较 `op == "push"`；push 分支里还要多读一个 int。',
      'pop 与 top 都要先 `st.empty()` 判断，空栈时输出 `pop: 空` 或 `top: 空`，绝不能对空 vector 调 pop_back/back。',
    ],
    tests: [
      { name: '样例 1：正常进出栈', stdin: '6\npush 1\npush 2\ntop\npop\ntop\npop\n', expected: '2\n1\n大小: 0' },
      { name: '样例 2：空栈操作', stdin: '5\npush 5\ntop\npop\npop\ntop\n', expected: '5\npop: 空\ntop: 空\n大小: 0' },
      { name: '隐藏：先空后满', stdin: '4\ntop\npush 7\npush 8\ntop\n', expected: 'top: 空\n8\n大小: 2', hidden: true },
      { name: '隐藏：负数元素', stdin: '3\npush -1\ntop\npop\n', expected: '-1\n大小: 0', hidden: true },
      { name: '隐藏：连续弹栈', stdin: '7\npush 1\npush 2\npush 3\npop\ntop\npop\ntop\n', expected: '2\n1\n大小: 1', hidden: true },
    ],
  },
  {
    id: 'cpp-paradigm-9',
    lang: 'cpp',
    module: 'paradigm',
    order: 9,
    title: 'STL 算法流水线',
    difficulty: 3,
    xp: 30,
    goals: [
      '熟练 sort / accumulate / transform 组合使用',
      '用 lambda 定制算法行为（如条件求和）',
      '建立"迭代器 + 可调用对象"的算法思维',
    ],
    brief: `## 算法库：别再手写循环了

\`<algorithm>\` 和 \`<numeric>\` 提供了几十个通用算法，全部以**迭代器区间**为参数：

\`\`\`cpp
std::sort(v.begin(), v.end());                          // 原地升序排序
long long s = std::accumulate(v.begin(), v.end(), 0LL); // 求和
std::transform(v.begin(), v.end(), out.begin(),
               [](int x) { return x * x; });            // 逐元素变换
\`\`\`

### 带自定义逻辑的 accumulate

accumulate 的第四个参数可以传入一个"怎么累计"的 lambda，条件求和一行搞定：

\`\`\`cpp
long long evenSum = std::accumulate(
    v.begin(), v.end(), 0LL,
    [](long long acc, int x) { return x % 2 == 0 ? acc + x : acc; });
\`\`\`

初始值 \`0LL\` 是 long long，保证长序列求和不溢出 int。

### 心法

- 算法不改变容器大小（sort/transform 都如此），增删请用容器的成员函数。
- 能用算法就不用手写 for：意图更清晰、边界不易错。

> ⚠️ transform 需要**提前准备**好输出区间（如先 resize 好 vector），它不会自己扩容。`,
    task: `## 任务：四道数据工序

读入 n 个整数，用 STL 算法 + lambda 输出四行结果。

**输入**：第一行 n（1 ≤ n ≤ 1000，元素绝对值 ≤ 10^4）；第二行 n 个整数

**输出**：四行

1. \`升序: <排序后的序列>\`
2. \`总和: <所有元素之和>\`
3. \`偶数和: <所有偶数元素之和>\`
4. \`平方: <每个元素的平方，按输入顺序>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5\`<br>\`3 1 4 1 5\` | \`升序: 1 1 3 4 5\`<br>\`总和: 14\`<br>\`偶数和: 4\`<br>\`平方: 9 1 16 1 25\` |
| \`1\`<br>\`2\` | \`升序: 2\`<br>\`总和: 2\`<br>\`偶数和: 2\`<br>\`平方: 4\` |

注意第 1、4 行"标签:"后跟每个数字前的一个空格，行尾不能有空格。`,
    starter: `#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (auto& x : v) std::cin >> x;

    // TODO 1: 复制一份排序，输出升序行
    // TODO 2: accumulate 求总和
    // TODO 3: accumulate + lambda 求偶数和
    // TODO 4: transform 求平方（先准备输出容器），按输入顺序输出
    return 0;
}
`,
    solution: `#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (auto& x : v) std::cin >> x;

    std::vector<int> sorted = v;
    std::sort(sorted.begin(), sorted.end());

    long long total = std::accumulate(v.begin(), v.end(), 0LL);
    long long evenSum = std::accumulate(
        v.begin(), v.end(), 0LL,
        [](long long acc, int x) { return x % 2 == 0 ? acc + x : acc; });

    std::vector<int> squares(n);
    std::transform(v.begin(), v.end(), squares.begin(),
                   [](int x) { return x * x; });

    std::cout << "升序:";
    for (int x : sorted) std::cout << " " << x;
    std::cout << "\\n";
    std::cout << "总和: " << total << "\\n";
    std::cout << "偶数和: " << evenSum << "\\n";
    std::cout << "平方:";
    for (int x : squares) std::cout << " " << x;
    std::cout << "\\n";
    return 0;
}
`,
    hints: [
      '排序别污染原数据：先 `std::vector<int> sorted = v;` 再对副本 sort，平方行还需要原始顺序。',
      '偶数和的关键是 accumulate 的第四参：`[](long long acc, int x) { return x % 2 == 0 ? acc + x : acc; }`，初始值用 0LL。',
      'transform 先准备 `std::vector<int> squares(n);`，lambda `[](int x) { return x * x; }`；两行列表都是"标签后每个数字前补一个空格"。',
    ],
    tests: [
      { name: '样例 1：3 1 4 1 5', stdin: '5\n3 1 4 1 5\n', expected: '升序: 1 1 3 4 5\n总和: 14\n偶数和: 4\n平方: 9 1 16 1 25' },
      { name: '样例 2：单元素', stdin: '1\n2\n', expected: '升序: 2\n总和: 2\n偶数和: 2\n平方: 4' },
      { name: '隐藏：负数混合', stdin: '4\n-1 -2 3 4\n', expected: '升序: -2 -1 3 4\n总和: 4\n偶数和: 2\n平方: 1 4 9 16', hidden: true },
      { name: '隐藏：全是奇数', stdin: '3\n7 7 7\n', expected: '升序: 7 7 7\n总和: 21\n偶数和: 0\n平方: 49 49 49', hidden: true },
      { name: '隐藏：含零重复', stdin: '6\n0 0 1 2 3 4\n', expected: '升序: 0 0 1 2 3 4\n总和: 10\n偶数和: 6\n平方: 0 0 1 4 9 16', hidden: true },
    ],
  },
  {
    id: 'cpp-paradigm-10',
    lang: 'cpp',
    module: 'paradigm',
    order: 10,
    title: '多线程首航',
    difficulty: 3,
    xp: 30,
    goals: [
      '学会创建 std::thread 并用 join 等待',
      '理解共享数据需要 mutex 与 lock_guard 保护',
      '用"各算各的、主线程汇总"保证输出确定',
    ],
    brief: `## std::thread：同时做多件事

\`<thread>\` 让一个函数在独立线程里跑起来：

\`\`\`cpp
std::thread t([] { /* 干活 */ });  // 启动线程
t.join();                          // 主线程等它结束
\`\`\`

**join 必须调用**（或 detach），否则线程对象析构时程序直接终止。

### 共享数据要上锁

两个线程同时写一个变量是数据竞争，结果不可预测。用 \`std::mutex\` + \`std::lock_guard\` 保护临界区：

\`\`\`cpp
std::mutex mtx;
std::lock_guard<std::mutex> lock(mtx); // 构造即加锁
results[0] = s;                        // 临界区：同一时刻只有一个线程进来
// lock 析构自动解锁 —— RAII 风格
\`\`\`

### 判题友好的写法

输出由多个线程交错打印会乱序。稳妥做法：**每个线程只计算纯结果**（写进自己专属的格子），join 之后由**主线程统一输出**——结果永远确定。`,
    task: `## 任务：两半分治求和

读入 n 个整数，把它们切成前后两半（前 \`n/2\` 个为前半，其余为后半），开**两个线程**分别求和，主线程 join 后输出。

**输入**：第一行 n（1 ≤ n ≤ 100000）；第二行 n 个整数（绝对值 ≤ 10^9）

**输出**：三行

1. \`前半和: <前 n/2 个数之和>\`
2. \`后半和: <其余数之和>\`
3. \`总和: <两者相加>\`

### 示例

| 输入 | 输出 |
| --- | --- |
| \`5\`<br>\`1 2 3 4 5\` | \`前半和: 3\`<br>\`后半和: 12\`<br>\`总和: 15\` |
| \`1\`<br>\`9\` | \`前半和: 0\`<br>\`后半和: 9\`<br>\`总和: 9\` |

n=1 时前半为空、和为 0。求和用 long long。`,
    starter: `#include <iostream>
#include <mutex>
#include <thread>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (auto& x : v) std::cin >> x;

    int half = n / 2;
    std::mutex mtx;
    std::vector<long long> results(2, 0);

    // TODO 1: 线程 1 求 v[0..half) 的和，lock_guard 保护写入 results[0]
    // TODO 2: 线程 2 求 v[half..n) 的和，lock_guard 保护写入 results[1]
    // TODO 3: join 两个线程
    // TODO 4: 主线程按顺序输出三行
    return 0;
}
`,
    solution: `#include <iostream>
#include <mutex>
#include <thread>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (auto& x : v) std::cin >> x;

    int half = n / 2;
    std::mutex mtx;
    std::vector<long long> results(2, 0);

    std::thread t1([&] {
        long long s = 0;
        for (int i = 0; i < half; ++i) s += v[i];
        std::lock_guard<std::mutex> lock(mtx);
        results[0] = s;
    });
    std::thread t2([&] {
        long long s = 0;
        for (int i = half; i < n; ++i) s += v[i];
        std::lock_guard<std::mutex> lock(mtx);
        results[1] = s;
    });
    t1.join();
    t2.join();

    std::cout << "前半和: " << results[0] << "\\n";
    std::cout << "后半和: " << results[1] << "\\n";
    std::cout << "总和: " << results[0] + results[1] << "\\n";
    return 0;
}
`,
    hints: [
      '线程用 lambda 启动：`std::thread t1([&] { ... });`，捕获 `[&]` 让 lambda 能访问 v、half、mtx、results。别忘了 join。',
      '临界区就一句：算完和之后 `std::lock_guard<std::mutex> lock(mtx);` 再写 `results[0] = s;`，guard 析构自动解锁。',
      '输出必须放在两个 join 之后由主线程统一完成，交错打印会导致判题不确定。n=1 时 half=0，前半和自然为 0。',
    ],
    tests: [
      { name: '样例 1：1 到 5', stdin: '5\n1 2 3 4 5\n', expected: '前半和: 3\n后半和: 12\n总和: 15' },
      { name: '样例 2：单元素', stdin: '1\n9\n', expected: '前半和: 0\n后半和: 9\n总和: 9' },
      { name: '隐藏：偶数个数', stdin: '6\n2 4 6 8 10 12\n', expected: '前半和: 12\n后半和: 30\n总和: 42', hidden: true },
      { name: '隐藏：负数', stdin: '4\n-1 -2 3 4\n', expected: '前半和: -3\n后半和: 7\n总和: 4', hidden: true },
    ],
  },
];
