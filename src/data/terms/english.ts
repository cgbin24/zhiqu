import type { Term } from './types';

/** english 领域术语：OOP 与设计 / 函数与范式 / 类型与语言特性 / 内存与运行时 / 并发与执行 / 工程行话 / 高频缩写 */
export const ENG_ENGLISH: Term[] = [
  // ==================== OOP 与设计 ====================
  {
    id: 'eng-encapsulation',
    name: 'Encapsulation',
    en: '封装',
  phonetic: '\u026a\u006e\u02cck\u00e6psju\u02c8le\u026a\u0283\u0259n',
    cat: 'english',
    sub: 'OOP 与设计',
    tags: ['OOP', '设计原则', '面试高频'],
    summary: '封装是把数据与操作捆绑在类内部、隐藏实现细节的 OOP 特性，教科书与面试三大特性常客。',
    detail: `**全称**：源自英语 enclose（装入、包围）+ -tion 名词后缀，动词形式为 encapsulate，本义"装进胶囊里"。

**含义与语境**：OOP 四大特性之一：把数据（字段）与操作数据的方法包在类内部，用 private 等访问控制隐藏实现细节，只暴露公开接口。见于教科书 OOP 章节、面试"面向对象三大特性"、类设计与 Code Review。

**易混辨析**：Encapsulation vs Abstraction——抽象是"只暴露该暴露的"（接口层面隐藏复杂度），封装是"把数据和方法包起来并保护起来"（数据层面隐藏细节）；前者靠接口设计，后者靠访问控制。

**例句**：Encapsulation lets us hide internal state and expose behavior through public methods.（封装让我们隐藏内部状态，通过公开方法暴露行为。）`,
    relations: [
      { to: 'fe-component', desc: '前端组件把模板/逻辑/样式封装在一起，是封装思想在 UI 层的落地' },
      { to: 'be-ddd', desc: 'DDD 的聚合根把业务规则封装在领域对象内，防止外部绕过约束' },
      { to: 'lc-coding-standards', desc: '编码规范中的访问控制约定（私有字段、暴露接口）即封装实践' },
    ],
    example: `"In well-designed code, fields are private and all access goes through getters and setters." —— 封装的典型描述（好的设计中字段私有，访问都走 getter/setter）`,
    interview: '面试常问：封装与抽象的区别——抽象针对"暴露什么接口"，封装针对"如何保护数据"。',
  },
  {
    id: 'eng-inheritance',
    name: 'Inheritance',
    en: '继承',
  phonetic: '\u026an\u02c8her\u026at\u0259ns',
    cat: 'english',
    sub: 'OOP 与设计',
    tags: ['OOP', '设计原则'],
    summary: '继承让子类复用并扩展父类的属性与方法，OOP 四大特性之一，类库文档与面试高频词。',
    detail: `**全称**：inherit（继承，源自拉丁语 heres 继承人）+ -ance 名词后缀；派生词有 inherited、inheritable。

**含义与语境**：子类（subclass/child class）获得父类（superclass/parent class）的字段与方法，可在其上扩展。语法标记：Java/C++/TS 的 extends、Python 的括号继承。见于类库文档的继承链（Throwable 下挂所有异常）、UML 类图、面试。

**易混辨析**：Inheritance vs Composition（组合）——继承是"是一个"（is-a），组合是"拥有一个"（has-a）；现代工程更推崇"组合优于继承"，因为继承把父子类焊死、层级深了难改。与 Overriding 搭配：子类重写继承来的方法。

**例句**：Dog inherits from Animal and overrides its makeSound method.（Dog 继承自 Animal，并重写了它的 makeSound 方法。）`,
    relations: [
      { to: 'fe-component', desc: 'React 从类组件继承走向函数组件组合，是"组合优于继承"的活案例' },
      { to: 'fe-hoc', desc: '高阶组件（HOC）用组合方式复用逻辑，替代了 mixin 式继承' },
      { to: 'be-ddd', desc: '领域建模中如何选择继承还是组合，是 DDD 战术设计的一部分' },
    ],
    example: `"Favor object composition over class inheritance." —— GoF《设计模式》第二原则（优先使用对象组合而非类继承）`,
    interview: '高频追问："组合优于继承"为什么；JS 原型链继承与 class extends 的关系。',
  },
  {
    id: 'eng-polymorphism',
    name: 'Polymorphism',
    en: '多态',
  phonetic: '\u02ccp\u0252li\u02c8m\u0254\u02d0rf\u026az\u0259m',
    cat: 'english',
    sub: 'OOP 与设计',
    tags: ['OOP', '面试高频'],
    summary: '多态指同一接口在不同类型上有不同实现，OOP 四大特性之一，框架设计与面试必备词。',
    detail: `**全称**：希腊词根 poly-（多）+ morph（形态）= "多种形态"；形容词 polymorphic。

**含义与语境**：同一个调用在不同对象上产生不同行为：同一接口的多个实现、父类引用指向子类对象后仍调到子类方法。见于接口设计文档、面试三大特性、框架的插件式设计（日志后端、序列化器、支付渠道都靠多态切换）。

**易混辨析**：Overloading 是编译期多态（同名不同参，编译时决定调谁），Overriding 是运行期多态（子类覆盖父类，运行时按实际类型分派）——狭义的"多态"通常指后者；面试若问"多态的两种形态"就是指这两个。

**例句**：Polymorphism lets the same render() call produce different output for each shape type.（多态让同一个 render() 调用对每种图形类型产生不同输出。）`,
    relations: [
      { to: 'fe-component', desc: '组件接口统一、实现多样：同一个 Button 组件适配多种主题即 UI 层多态' },
      { to: 'fe-props', desc: 'React 用 props 多态渲染不同子组件（多态槽位）' },
      { to: 'eng-overriding', desc: '运行期多态的实现手段就是子类重写父类方法' },
    ],
    example: `"All payment providers implement the same PaymentGateway interface." —— 多态的接口化设计（所有支付渠道实现同一支付网关接口）`,
    interview: '必考：运行期多态靠动态分派/虚函数表实现；鸭子类型是"没有继承也能多态"。',
  },
  {
    id: 'eng-abstraction',
    name: 'Abstraction',
    en: '抽象',
  phonetic: '\u00e6b\u02c8str\u00e6k\u0283\u0259n',
    cat: 'english',
    sub: 'OOP 与设计',
    tags: ['OOP', '设计原则'],
    summary: '抽象是只暴露必要接口、隐藏复杂实现的思维与特性，见于抽象类、接口与架构分层。',
    detail: `**全称**：abs-（离开）+ tract（拉、抽，源自拉丁语 trahere）——"把细节抽走"；动词 abstract，形容词 abstract（抽象的），名词 abstraction。

**含义与语境**：OOP 四大特性之一：用抽象类/接口定义"能做什么"，不关心"怎么做"。语法标记：abstract class、interface。见于分层架构（上层只依赖抽象）、设计文档、面试。

**易混辨析**：Abstraction vs Encapsulation——抽象隐藏"复杂度"（让你少关心），封装隐藏"数据"（让你碰不到）；抽象靠接口约定，封装靠访问控制。与 Generalization（泛化）近义，但抽象更强调"建模时抓本质"。口诀：抽象定义"能做什么"的契约，封装保证"怎么做到"不被绕过。

**例句**：Program to an abstraction, not an implementation.（面向抽象编程，而不是面向具体实现编程。）`,
    relations: [
      { to: 'fe-component', desc: '组件是对 DOM 与业务逻辑的抽象，使用者只需知道 props 契约' },
      { to: 'lc-tech-design', desc: '技术设计文档的核心工作就是划分抽象层级与边界' },
      { to: 'be-ddd', desc: 'DDD 用领域抽象（实体/值对象/领域服务）隔离业务复杂性' },
    ],
    example: `"The database layer is an abstraction over raw SQL calls." —— 抽象的典型描述（数据库层是对裸 SQL 调用的抽象）`,
    interview: '高频：接口与抽象类的区别——接口是纯契约，抽象类可带公共实现与状态。',
  },
  {
    id: 'eng-overloading',
    name: 'Overloading',
    en: '重载',
  phonetic: '\u02cco\u028av\u0259r\u02c8lo\u028ad\u026a\u014b',
    cat: 'english',
    sub: 'OOP 与设计',
    tags: ['OOP', '易混词', '面试高频'],
    summary: '重载指同名函数因参数不同而共存，编译期决定调用哪个；Java/C++/TS 文档常见。',
    detail: `**全称**：over-（叠加在……之上）+ load（装载）——"往同一个名字上装下多种定义"。

**含义与语境**：同一个类/作用域内定义多个同名方法，参数个数或类型不同，调用时按实参匹配。Java/C++ 原生支持；TypeScript 用重载签名声明、用可选参数实现；JS 语言本身没有重载（常被面试追问）。

**易混辨析**：Overloading vs Overriding——编程英语第一易混对：重载是"同一个类里、同名不同参"，编译期匹配（静态多态）；重写是"子类重新实现父类的同名同参方法"，运行期分派（动态多态）。一句话记忆：重载"横着长"（同名多版本），重写"竖着长"（父子换实现）。

**例句**：No overload matches this call.（没有重载版本能匹配这次调用——TypeScript 参数类型不符时的经典编译错误。）`,
    relations: [
      { to: 'eng-overriding', desc: '与重写构成"编译期/运行期"两态对照，面试必考的易混对' },
      { to: 'fe-props', desc: 'TS 组件 props 用可选参数与联合类型模拟"重载"体验' },
      { to: 'lc-api-doc', desc: 'API 文档中同一端点的多版本签名本质上也是接口重载' },
    ],
    example: `"No overload matches this call." —— TypeScript 类型检查错误（重载不匹配）`,
    interview: '必考三连：发生在谁与谁之间？绑定在编译期还是运行期？返回值类型参与区分吗（Java 不参与）。',
  },
  {
    id: 'eng-overriding',
    name: 'Overriding',
    en: '重写/覆写',
  phonetic: '\u02cco\u028av\u0259\u02c8ra\u026ad\u026a\u014b',
    cat: 'english',
    sub: 'OOP 与设计',
    tags: ['OOP', '易混词', '面试高频'],
    summary: '重写指子类重新实现父类的同名同参方法，运行期生效，是运行期多态的基础。',
    detail: `**全称**：over-（覆盖在上）+ ride（骑）——"骑在原有实现之上"，即用新实现盖住旧实现。

**含义与语境**：子类提供与父类方法同名同参的新实现。Java 用 @Override 注解防手误，C++11/TS 用 override 关键字。见于继承体系文档、模板方法模式（父类定骨架、子类重写步骤）、面试。

**易混辨析**：Overriding vs Overloading 见 eng-overloading 词条；Overriding vs Overwrite——overwrite（覆盖写入）指文件/数据被直接盖掉，不涉继承关系，"覆盖文件"用 overwrite，"重写方法"用 override。另注意：重写须遵循里氏替换——子类实现不得收窄父类契约。

**例句**：The subclass overrides the draw() method defined in its superclass.（这个子类重写了父类中定义的 draw() 方法。）`,
    relations: [
      { to: 'eng-overloading', desc: '与重载构成 OOP 最经典易混对，辨析见该词条' },
      { to: 'fe-lifecycle', desc: '类组件时代通过重写生命周期方法定制行为，即典型的方法重写' },
      { to: 'fe-hooks', desc: 'Hooks 用自定义 Hook 组合逻辑，替代了"重写基类"的复用方式' },
    ],
    example: `"Use the @Override annotation so the compiler verifies you are actually overriding a superclass method." —— Java 最佳实践（用 @Override 让编译器校验确实重写了父类方法）`,
    interview: '高频：@Override 的价值——拼错方法名或参数不符时编译器直接报错，防止"意外重载"。',
  },
  {
    id: 'eng-solid',
    name: 'SOLID',
    en: '五大面向对象设计原则',
  phonetic: '\u02c8s\u0252l\u026ad',
    cat: 'english',
    sub: 'OOP 与设计',
    tags: ['设计原则', '缩写', '面试高频'],
    summary: 'SOLID 是五个面向对象设计原则的首字母缩写，架构评审与 Code Review 的通用语言。',
    detail: `**全称**（逐字母）：**S**ingle Responsibility Principle（单一职责原则）、**O**pen-Closed Principle（开闭原则）、**L**iskov Substitution Principle（里氏替换原则）、**I**nterface Segregation Principle（接口隔离原则）、**D**ependency Inversion Principle（依赖倒置原则），由 Robert C. Martin 整理成缩写。

**含义与语境**：评价类与模块设计的五把标尺：一个类只干一件事、对扩展开放对修改关闭、子类必须能替换父类、接口按角色拆细、依赖抽象而非具体。见于架构文档、Code Review 评论（"这违反 SRP 了"）、面试。

**易混辨析**：SOLID 是"原则"（Principle，指导思想），Design Pattern 是"模式"（Pattern，可复用方案）——原则告诉你方向，模式给你具体答案，层次不同不要混谈。

**例句**：This class violates the Single Responsibility Principle — it both parses and persists data.（这个类违反了单一职责原则——它既解析数据又持久化数据。）`,
    relations: [
      { to: 'eng-dependency-injection', desc: '依赖倒置原则（DIP）是依赖注入的理论根源' },
      { to: 'be-ddd', desc: 'DDD 的领域建模实践是 SOLID 原则在业务层的系统化应用' },
      { to: 'lc-coding-standards', desc: '编码规范中的类设计约束大多能追溯到 SOLID 某一条' },
    ],
    example: `"We apply SOLID principles to keep modules loosely coupled." —— 架构文档常用句（我们遵循 SOLID 原则保持模块松耦合）`,
    interview: '必考：逐个说出五个原则 + 一句人话解释；DIP 与依赖注入的关系是高频追问。',
  },
  {
    id: 'eng-design-pattern',
    name: 'Design Pattern',
    en: '设计模式',
  phonetic: 'd\u026a\u02c8za\u026an \u02c8p\u00e6t\u0259rn',
    cat: 'english',
    sub: 'OOP 与设计',
    tags: ['设计', '经典书'],
    summary: '设计模式是前人总结的可复用面向对象方案，源自 GoF《设计模式》的 23 种经典模式。',
    detail: `**全称**：Design（设计）+ Pattern（模式、范型）——思想源自建筑学家 Christopher Alexander 的"模式语言"，1994 年由 GoF（Gang of Four，四人帮：Gamma 等四位作者）引入软件界。

**含义与语境**：针对反复出现的问题的标准解法，GoF 归纳 23 种分三大类：创建型（Singleton、Factory、Builder）、结构型（Adapter、Decorator、Proxy）、行为型（Observer、Strategy、Iterator）。见于源码命名（xxxFactory、xxxObserver）、面试、框架设计说明。

**易混辨析**：Pattern vs Anti-pattern（反模式）——反模式是"看似合理实则有害的常见坏做法"，如上帝类、回调地狱；Pattern vs Principle——模式是具体方案，SOLID 是抽象原则。

**例句**：The Observer pattern is widely used for event-driven UI updates.（观察者模式被广泛用于事件驱动的界面更新。）`,
    relations: [
      { to: 'fe-hoc', desc: '高阶组件是装饰器模式在 React 中的实现' },
      { to: 'fe-state-management', desc: 'Redux 是观察者/发布订阅模式的工业化形态' },
      { to: 'lc-coding-standards', desc: '团队规范常约定"优先用已认可模式而不是自造轮子"' },
    ],
    example: `"We use the Strategy pattern to swap pricing algorithms at runtime." —— 典型应用描述（我们用策略模式在运行时切换定价算法）`,
    interview: '高频：举出前端框架中的模式实例——HOC 是装饰器、事件总线是观察者、createStore 是工厂。',
  },
  {
    id: 'eng-singleton',
    name: 'Singleton',
    en: '单例模式',
  phonetic: '\u02c8s\u026a\u014bɡl\u0259t\u0259n',
    cat: 'english',
    sub: 'OOP 与设计',
    tags: ['设计模式', '创建型'],
    summary: 'Singleton 保证一个类全局只有一个实例并提供统一访问点，最常被讨论的创建型模式。',
    detail: `**全称**：single（单一）+ -ton 名词后缀——"独一无二的那一个"。

**含义与语境**：创建型设计模式：私有化构造函数，通过静态方法 getInstance() 返回全局唯一实例。典型场景：全局配置对象、数据库连接池、日志器、前端的全局 Store、弹窗管理器。见于框架文档与面试手写题。

**易混辨析**：Singleton vs Static（静态类）——单例是一个有状态、可传参、可实现接口的实例；静态类不实例化、更像函数命名空间。面试坑点：多线程双重检查锁（double-checked locking）；分布式坑点：K8s 多副本部署后"进程内单例"不再全局唯一。

**例句**：Make sure the connection pool is a singleton so we actually reuse connections.（确保连接池是单例，这样连接才能真正被复用。）`,
    relations: [
      { to: 'fe-state-management', desc: '全局 Store 是前端最典型的单例应用' },
      { to: 'be-conn-pool', desc: '连接池通常以单例形式存在，保证全进程共享连接' },
      { to: 'eng-closure-en', desc: 'JS 常用模块级闭包变量实现单例（模块模式）' },
    ],
    example: `"GetInstance() returns the same logger instance throughout the application lifecycle." —— 单例文档标准句（GetInstance 在整个应用生命周期返回同一个日志实例）`,
    interview: '高频：如何写线程安全的单例；"单例为什么常被视为反模式"——全局状态难测试、难隔离。',
  },
  {
    id: 'eng-dependency-injection',
    name: 'Dependency Injection',
    en: '依赖注入',
  phonetic: 'd\u026a\u02c8pend\u0259nsi \u026an\u02c8d\u0292\u025bk\u0283\u0259n',
    cat: 'english',
    sub: 'OOP 与设计',
    tags: ['设计', '框架'],
    summary: '依赖注入指依赖由外部传入而非内部创建，实现解耦的核心手段，Angular/Spring 核心机制。',
    detail: `**全称**：Dependency（依赖）+ Injection（注入，动词 inject 的名词形式）——"把依赖从外部注射进来"。

**含义与语境**：类不自己 new 依赖，而是通过构造函数、Setter 或参数接收。这是"控制反转"（IoC, Inversion of Control）思想最常见的落地方式：Angular 的 DI 容器、Spring 的 @Autowired、React 的 props/Context 都是它的变体。见于框架文档、架构讨论、面试。

**易混辨析**：DI vs IoC——IoC 是思想（"别自己创建，交给容器"），DI 是实现手段（"通过构造函数/Setter 注进去"）；DI vs Service Locator——服务定位器是类主动向容器查找依赖，依赖注入是被动接收（更利于测试）。

**例句**：We inject the auth service via the constructor instead of instantiating it inside the class.（我们通过构造函数注入鉴权服务，而不是在类内部自己实例化。）`,
    relations: [
      { to: 'fe-props', desc: 'props 从外部传入依赖与数据，就是 React 世界里的注入' },
      { to: 'fe-hooks', desc: 'Context + Hook 提供了树级依赖注入能力' },
      { to: 'eng-solid', desc: '依赖倒置原则（DIP）是依赖注入背后的设计原则' },
    ],
    example: `"Register the service in the container and let the framework handle constructor injection." —— DI 框架典型描述（在容器里注册服务，由框架处理构造函数注入）`,
    interview: '高频：DI 解决什么问题（可替换、可测试、解耦）；单测时注入 mock 依赖即其直接收益。',
  },

  // ==================== 函数与范式 ====================
  {
    id: 'eng-first-class-function',
    name: 'First-Class Function',
    en: '一等函数',
  phonetic: 'f\u025c\u02d0rst kl\u00e6s \u02c8f\u028c\u014bk\u0283\u0259n',
    cat: 'english',
    sub: '函数与范式',
    tags: ['函数式', '语言特性'],
    summary: '一等函数指函数可当值传递、赋值与返回，JS/Python 的基础特性，函数式编程的前提。',
    detail: `**全称**：First-Class（一等公民）+ Function（函数）——借自社会学"一等公民"：享有全部权利、不受限制。

**含义与语境**：函数在这门语言里与数字、字符串平起平坐：能赋给变量、能存进数组/对象、能当参数传入、能当返回值返回。JS、Python、Go 都是"函数一等公民"语言；C 的函数指针只能算半个。见于语言对比文章、面试第一问。

**易混辨析**：First-Class Function vs Higher-Order Function——前者是语言属性（函数是不是值），后者是函数类型（这个函数接收/返回函数吗）；先有一等函数，才写得出高阶函数，两者是前提与运用的关系。

**例句**：In JavaScript, functions are first-class citizens, so you can pass them around like any other value.（在 JavaScript 里函数是一等公民，可以像其他值一样随意传递。）`,
    relations: [
      { to: 'eng-higher-order-function', desc: '一等函数是前提，高阶函数是运用，两者配套记忆' },
      { to: 'eng-callback', desc: '回调正是"函数当值传"的第一应用场景' },
      { to: 'fe-hooks', desc: 'Hook 传入回调、返回函数，处处依赖一等函数特性' },
    ],
    example: `"Since functions are first-class in Go, handlers can be passed as ordinary values." —— 语言文档句（Go 中函数是一等公民，处理器可以作为普通值传递）`,
    interview: '高频：判断一门语言是否支持函数式的第一问——函数是否一等公民。',
  },
  {
    id: 'eng-higher-order-function',
    name: 'Higher-Order Function',
    en: '高阶函数',
  phonetic: '\u02ccha\u026a\u0259r \u02c8\u0254\u02d0rd\u0259r',
    cat: 'english',
    sub: '函数与范式',
    tags: ['函数式', '易混词'],
    summary: '高阶函数指接收函数为参数或返回函数的函数，map/filter、防抖与柯里化的本质。',
    detail: `**全称**：Higher-Order（更高阶）+ Function——"order"取自函数的阶：普通函数操作数据，高阶函数操作函数。

**含义与语境**：满足其一即是：接收一个或多个函数作为参数；返回一个函数。Array 的 map/filter/reduce、防抖节流、柯里化、React 的 HOC 全是高阶函数。见于函数式文档、面试手写题（手写防抖 = 手写高阶函数）。

**易混辨析**：HOF vs First-Class Function 见 eng-first-class-function；HOF vs Callback——回调是被传进去的函数（角色），高阶函数是接收回调的函数（宿主），同一句代码里两者同时登场。

**例句**：filter is a higher-order function because it takes a predicate function as an argument.（filter 是高阶函数，因为它接收一个判定函数作为参数。）`,
    relations: [
      { to: 'fe-hoc', desc: '高阶组件（HOC）就是组件版的高阶函数：接收组件、返回新组件' },
      { to: 'eng-first-class-function', desc: '一等函数是语言前提，高阶函数是其直接产物' },
      { to: 'fe-debounce-throttle', desc: '防抖/节流是"接收函数、返回新函数"的经典高阶函数' },
    ],
    example: `"reduce() is a higher-order function that takes a reducer callback and an initial value." —— MDN 风格文档句（reduce 是接收归调与初始值的高阶函数）`,
    interview: '手写防抖/节流/柯里化都是手写高阶函数；说出 HOF 与回调的关系即可加分。',
  },
  {
    id: 'eng-pure-function',
    name: 'Pure Function',
    en: '纯函数',
  phonetic: 'pj\u028a\u0259r \u02c8f\u028c\u014bk\u0283\u0259n',
    cat: 'english',
    sub: '函数与范式',
    tags: ['函数式', '面试高频'],
    summary: '纯函数指相同输入永远得到相同输出且无副作用，可测试性与 Redux/React 渲染的基石。',
    detail: `**全称**：Pure（纯净的，源自拉丁语 purus）+ Function——"不掺杂质"的函数。

**含义与语境**：两个判定条件：输出只由输入决定（引用透明，不依赖外部可变量）；不产生副作用（不改外部变量、不发请求、不打印）。例：slice 是纯函数，splice 不是。见于 Redux 的 reducer 约定、React 组件渲染要求、单元测试讨论。

**易混辨析**：Pure vs Impure——不纯的典型：依赖 Date.now()、Math.random()、全局变量；Pure vs Idempotent（幂等）——纯函数管"输出可预测"，幂等管"重复执行效果不变"，两个正交维度：带副作用的操作可以幂等但绝不纯。

**例句**：Reducers must be pure functions: same state and action in, same new state out.（reducer 必须是纯函数：相同的 state 与 action 进来，必须得到相同的新 state。）`,
    relations: [
      { to: 'fe-component', desc: 'React 要求组件像纯函数：只依赖 props/state 渲染 UI' },
      { to: 'fe-state', desc: '纯函数更新 state 是单向数据流的基础' },
      { to: 'eng-side-effect', desc: '副作用是纯函数的反面定义，两者成对理解' },
    ],
    example: `"A pure function always returns the same result for the same arguments and has no side effects." —— 函数式文档标准定义（纯函数对相同参数总返回相同结果且无副作用）`,
    interview: '高频：为什么纯函数可测试、可缓存（记忆化）、可并行；React 严格模式双调用就是在检验纯度。',
  },
  {
    id: 'eng-side-effect',
    name: 'Side Effect',
    en: '副作用',
  phonetic: 'sa\u026ad \u026a\u02c8f\u025bkt',
    cat: 'english',
    sub: '函数与范式',
    tags: ['函数式', 'React'],
    summary: '副作用指函数执行时对外部世界产生的可观察影响，React 用 useEffect 专门安置它。',
    detail: `**全称**：Side（旁边）+ Effect（效果）——"主要目的之外顺带产生的效果"，与药物副作用的引申同源。

**含义与语境**：修改全局变量、修改入参、发网络请求、操作 DOM、console.log、读写系统时间都是副作用。纯函数世界禁止它，真实业务离不开它，所以框架给副作用划了专门位置：React 的 useEffect、Vue 的 watch、Redux 的中间件。见于函数式文档、React 官方文档、面试。

**易混辨析**：Side Effect vs Side Input——读时间、读随机数这类"外部输入"同样破坏纯度，面试里也归入副作用来源；与日常语境不同，技术语境的副作用是中性词，关键是"放对地方"。

**例句**：useEffect lets you synchronize with external systems and isolate side effects from rendering.（useEffect 让你与外部系统同步，并把副作用从渲染过程中隔离出去。）`,
    relations: [
      { to: 'fe-hooks', desc: 'useEffect 正是 React 为副作用设计的官方出口' },
      { to: 'eng-pure-function', desc: '纯函数的定义就是"无副作用"，两者互为正反面' },
      { to: 'fe-event-loop', desc: '异步副作用（请求/定时器）的调度依赖事件循环机制' },
    ],
    example: `"Updating the DOM inside render is a side effect and breaks purity." —— React 教学常用句（在 render 里改 DOM 是副作用，会破坏纯度）`,
    interview: '高频：React 为什么要求渲染纯净、副作用进 useEffect；严格模式双调 effect 就是为了暴露副作用。',
  },
  {
    id: 'eng-closure-en',
    name: 'Closure',
    en: '闭包',
  phonetic: '\u02c8klo\u028a\u0292\u0259r',
    cat: 'english',
    sub: '函数与范式',
    tags: ['JS 核心', '面试高频'],
    summary: '闭包指函数与其定义时词法作用域的组合，让它能记住并持续访问外部变量。',
    detail: `**全称**：close（闭合）+ -ure 名词后缀——"闭合起来的东西"：函数连同它捕获的环境被打包封闭在一起。

**含义与语境**：内层函数引用了外层函数的变量，即使外层函数已经返回，这些变量仍存活可访问。典型场景：事件回调、柯里化、防抖节流、模块模式（用闭包做私有变量）、计数器。JS 面试必考，词源上与"词法作用域"（lexical scoping）绑定。

**易混辨析**：Closure vs Scope——scope 是"变量可见性的规则/区域"，closure 是"函数 + 被保存下来的作用域"这个组合物；Closure vs Callback——回调是使用方式，闭包是实现机制，一个回调函数往往同时是闭包。

**例句**：The returned inner function forms a closure over the count variable.（返回的内层函数对 count 变量形成了一个闭包。）`,
    relations: [
      { to: 'fe-closure-perf', desc: '闭包的性能影响（内存占用/泄漏）在该词条深入展开' },
      { to: 'eng-scope', desc: '闭包建立在词法作用域之上，先懂作用域再懂闭包' },
      { to: 'fe-debounce-throttle', desc: '防抖/节流靠闭包保存定时器与状态' },
    ],
    example: `"Each handler closure captures its own copy of the loop variable." —— 经典面试考点句（每个事件处理闭包捕获各自的循环变量副本）`,
    interview: '必考：闭包导致内存泄漏的场景与解法（及时解除引用）；用闭包手写防抖、 once、 memoize。',
  },
  {
    id: 'eng-callback',
    name: 'Callback',
    en: '回调',
  phonetic: '\u02c8k\u0254\u02d0lb\u00e6k',
    cat: 'english',
    sub: '函数与范式',
    tags: ['JS 核心', '异步'],
    summary: '回调是作为参数传给他人、在恰当时机被调用的函数，异步编程的最原始形态。',
    detail: `**全称**：call（调用）+ back（回来）——"回头再调用你"：不是立刻执行，而是约定时机回头执行。

**含义与语境**：把函数 A 交给函数 B，由 B 在合适时机调用 A。分两类：同步回调（map 的遍历函数，立刻调用）与异步回调（请求成功后调用）。经典语境：Node 的 error-first callback（第一个参数是 err）、浏览器事件监听。回调嵌套过深即"回调地狱"（callback hell / pyramid of doom）。

**易混辨析**：Callback vs Hook（钩子）——回调是"你传给他人在某时刻调用"，钩子是"框架预留的固定挂载点"，钩子本质上也是回调的约定化；Callback vs Promise——Promise 用链式 .then 把嵌套回调拍平。

**例句**：Pass a callback as the second argument; it will be invoked with (err, data).（把回调作为第二个参数传入，它会以 (err, data) 的形式被调用。）`,
    relations: [
      { to: 'fe-event-loop', desc: '异步回调何时执行由事件循环决定' },
      { to: 'eng-closure-en', desc: '异步回调通常是闭包，捕获定义时的变量环境' },
      { to: 'fe-debounce-throttle', desc: '防抖节流包装的就是回调函数的触发时机' },
    ],
    example: `"Callback hell makes deeply nested asynchronous code hard to read and maintain." —— 重构文章常见句（回调地狱让深层嵌套的异步代码难读难维护）`,
    interview: '高频：从回调地狱到 Promise 再到 async/await 的演进；error-first 约定是什么。',
  },
  {
    id: 'eng-lazy-evaluation',
    name: 'Lazy Evaluation',
    en: '惰性求值',
  phonetic: '\u02c8le\u026azi \u026a\u02ccv\u00e6lju\u02c8e\u026a\u0283\u0259n',
    cat: 'english',
    sub: '函数与范式',
    tags: ['语言特性', '性能'],
    summary: '惰性求值指表达式用到才算、按需计算，JS 生成器与懒加载背后的同一思想。',
    detail: `**全称**：Lazy（懒惰的）+ Evaluation（求值）——"能不算就不算，拖到必须算为止"；反义词 Eager Evaluation（急切求值）。

**含义与语境**：表达式不在绑定时立即计算，而在首次取值时才计算。常见形态：JS 生成器（function*）与迭代器、Python 生成器表达式、Haskell 的默认策略、Java Stream 的惰性中间操作（终端操作才触发计算）、SQL 的延迟执行。性能语境高频词。

**易混辨析**：Lazy Evaluation vs Memoization——惰性管"算的时机"（推迟），记忆化管"算过的结果"（缓存），两者常搭配使用；Lazy Evaluation vs Lazy Loading——同一思想在不同层：前者是语言求值策略，后者是工程实践（资源按需加载）。

**例句**：Stream operations are lazy until a terminal operation triggers the computation.（流的中间操作是惰性的，直到终端操作才触发真正的计算。）`,
    relations: [
      { to: 'fe-lazy-loading', desc: '懒加载是惰性思想在资源加载上的工程化应用' },
      { to: 'dsa-memo-tabulation', desc: '记忆化与惰性求值常配合：推迟计算 + 缓存结果' },
      { to: 'eff-lazy-image-fade', desc: '图片惰性加载是前端最直观的 lazy 应用' },
    ],
    example: `"Generators compute values on demand, enabling lazy evaluation of infinite sequences." —— 生成器文档句（生成器按需计算值，从而支持对无限序列的惰性求值）`,
    interview: '高频：短路求值（&&/||）是最简单的惰性求值；生成器如何实现惰性序列。',
  },
  {
    id: 'eng-recursion-en',
    name: 'Recursion',
    en: '递归',
  phonetic: 'r\u026a\u02c8k\u025c\u02d0\u0292\u0259n',
    cat: 'english',
    sub: '函数与范式',
    tags: ['算法', '面试高频'],
    summary: '递归指函数直接或间接调用自身解决问题，必须有终止条件，算法面试与树遍历必备。',
    detail: `**全称**：re-（再次）+ curs（跑，源自拉丁语 currere）+ -ion——"自己跑回来"，即自己调用自己。

**含义与语境**：把问题拆成更小的同类子问题，函数调用自身直到触底。三要素：终止条件（base case）、递归步（recursive step）、问题规模收缩。典型场景：树/JSON 扁平化遍历、DFS、分治、目录树遍历。面试常考"递归爆栈"与"尾递归"。

**易混辨析**：Recursion vs Iteration（迭代）——递归自顶向下靠调用栈，迭代自底向上靠循环，任何递归都能改成迭代（显式栈）；Recursion vs Backtracking（回溯）——回溯 = 递归 + 撤销选择（试探后复原现场）。

**例句**：Without a base case, the recursion never terminates and you get a stack overflow.（没有终止条件，递归永远不会结束，你会得到栈溢出。）`,
    relations: [
      { to: 'dsa-recursion-a', desc: '递归的执行模型、调用栈与复杂度分析在该词条深入展开' },
      { to: 'dsa-backtracking', desc: '回溯是递归 + 撤销选择的系统化应用' },
      { to: 'dsa-dp-intro', desc: '动态规划常由自顶向下递归 + 记忆化演化而来' },
    ],
    example: `"The flatten() function uses recursion to walk arbitrarily nested arrays." —— 工具库文档句（flatten 函数用递归遍历任意深度的嵌套数组）`,
    interview: '高频：递归转迭代（显式栈）；为什么大多数 JS 引擎不做尾递归优化。',
  },

  // ==================== 类型与语言特性 ====================
  {
    id: 'eng-type-inference',
    name: 'Type Inference',
    en: '类型推断',
  phonetic: 'ta\u026ap \u02c8\u026anf\u0259r\u0259ns',
    cat: 'english',
    sub: '类型与语言特性',
    tags: ['类型系统', 'TS'],
    summary: '类型推断指编译器自动推导类型而无需显式标注，TS 与现代语言的省心机制。',
    detail: `**全称**：Type（类型）+ Inference（推断，动词 infer 的名词，源自拉丁语 inferre"推出"）。

**含义与语境**：不写类型标注，编译器根据初始值、返回值与上下文自动推导类型。TS 中 const x = 1 推导出字面量类型 1，函数返回值可自动推导。见于 TS 文档、IDE 悬浮提示、面试（"何时该写类型标注"）。

**易混辨析**：Inference vs Annotation（标注）——推断是编译器猜，标注是人写，公共 API 参数建议手写标注；Inference vs Duck Typing——推断发生在编译期的静态类型系统内，鸭子类型根本不做类型检查，动态语言"处处皆推断"是错觉。

**例句**：The compiler infers the return type as Promise<void>.（编译器把返回类型推断为 Promise<void>。）`,
    relations: [
      { to: 'eng-strong-weak-typing', desc: '推断属于静态类型系统的能力，与强弱类型维度配合理解' },
      { to: 'eng-duck-typing', desc: 'TS 的结构化推断与鸭子类型形似而机制不同' },
      { to: 'lc-coding-standards', desc: '编码规范常约定"局部变量靠推断、导出 API 写标注"' },
    ],
    example: `"TypeScript infers types in many cases, reducing the need for explicit annotations." —— TS 官方文档句（TS 在很多场景会推断类型，减少显式标注的需要）`,
    interview: '高频：TS 何时该写标注（公共 API、函数参数）、何时交给推断（局部变量）。',
  },
  {
    id: 'eng-type-casting',
    name: 'Type Casting / Conversion',
    en: '类型转换',
  phonetic: 'ta\u026ap \u02c8k\u00e6st\u026a\u014b',
    cat: 'english',
    sub: '类型与语言特性',
    tags: ['类型系统', '易混词'],
    summary: '类型转换是把值从一种类型变为另一种，Casting 强调显式写出、Conversion 用法更中性。',
    detail: `**全称**：Cast（铸造——把金属倒进模具"铸"成另一形状）+ Conversion（转换，动词 convert 的名词）。

**含义与语境**：Casting 常指显式转换，代码里写明意图：Java 的 (int) x、C 的 (Widget) ptr、TS 的 as 断言；Conversion 泛指一切类型间转换（含隐式）。Java 还分 Upcasting（子转父，安全）与 Downcasting（父转子，需 instanceof 检查）。见于强转语法、类型断言、面试。

**易混辨析**：Casting vs Coercion——本领域核心易混对：Casting 是显式的（你自己写出来），Coercion 是隐式的（语言引擎自动转，如 JS 的 "1" + 1）；Casting vs Parsing——Number("1") 是解析字符串语义，不是强转。

**例句**：Use the as keyword only when you know the type better than the compiler.（只有当你比编译器更了解类型时才用 as 断言。）`,
    relations: [
      { to: 'eng-type-coercion', desc: '显式 Casting 与隐式 Coercion 是一对核心辨析' },
      { to: 'eng-strong-weak-typing', desc: '语言对转换的容忍度决定了强弱的判别' },
      { to: 'lc-coding-standards', desc: '团队规范通常限制 as 断言与强转的使用场景' },
    ],
    example: `"Downcasting requires an explicit cast and may throw ClassCastException at runtime." —— Java 文档句（向下转型需要显式强转，运行时可能抛出 ClassCastException）`,
    interview: '高频：TS 的 as 与双重断言 as unknown as 的坏味道；Java ClassCastException 何时发生。',
  },
  {
    id: 'eng-type-coercion',
    name: 'Type Coercion',
    en: '隐式类型强转',
  phonetic: 'ta\u026ap ko\u028a\u02c8\u025c\u02d0\u0292\u0259n',
    cat: 'english',
    sub: '类型与语言特性',
    tags: ['类型系统', '易混词', 'JS 核心'],
    summary: '隐式强转指语言在运算时自动转换类型，JS 的 == 与 + 是重灾区，面试常考细节。',
    detail: `**全称**：Coerce（强制、迫使，源自拉丁语 coercere"约束"）+ -ion——"被强制变过去"，不是你主动转的。

**含义与语境**：运算符两侧类型不一致时，引擎按内置规则自动转换：JS 的 "1" + 1 得 "11"（拼接）、"1" == 1 为 true（宽松相等先转数字）；转换分两步走：先转原始值（ToPrimitive），再转数字或字符串。面试高频题：[] == ![] 为什么是 true、== 与 === 与 Object.is 的区别。

**易混辨析**：Coercion vs Casting——coercion 隐式（引擎悄悄转），casting 显式（你写出来）；Coercion vs Weak Typing——弱类型语言里隐式强转才常见，强类型语言会用报错拦下这些"善意"。

**例句**：In JavaScript, the == operator performs type coercion before comparison.（在 JavaScript 里，== 运算符在比较前会执行隐式类型转换。）`,
    relations: [
      { to: 'eng-type-casting', desc: '隐式强转与显式强转对照记忆，是核心易混对' },
      { to: 'eng-strong-weak-typing', desc: '隐式转换的容忍度正是"弱类型"的判定标准' },
      { to: 'eng-duck-typing', desc: '动态语言的宽容转换与鸭子类型同属"灵活但危险"家族' },
    ],
    example: `"[] + {} is '[object Object]' because both operands are coerced to primitives." —— JS 面试经典句（[] + {} 得到 '[object Object]'，因为两个操作数都被隐式转为原始值）`,
    interview: '必考：== 的隐式转换规则；为什么团队规范禁用 == 只用 ===。',
  },
  {
    id: 'eng-duck-typing',
    name: 'Duck Typing',
    en: '鸭子类型',
  phonetic: 'd\u028ck \u02c8ta\u026ap\u026a\u014b',
    cat: 'english',
    sub: '类型与语言特性',
    tags: ['类型系统', '设计'],
    summary: '鸭子类型指"走路像鸭子就是鸭子"——只看有没有方法不问类型声明，Python/JS 的常态。',
    detail: `**全称**：来自谚语 "If it walks like a duck and it quacks like a duck, then it must be a duck."（走起来像鸭子、叫起来像鸭子，那它就是鸭子。）

**含义与语境**：动态语言的类型观：不检查对象"是什么类型"，只检查它"有没有需要的方法/属性"。Python 的 EAFP 风格（先试再说）、JS 的 thenable（只要有 .then() 就按 Promise 处理）都是鸭子类型。见于动态语言文档、面试。

**易混辨析**：Duck Typing vs Structural Typing（结构化类型）——TS 是结构化的：编译期静态检查"形状"是否匹配；鸭子类型是运行期动态检查甚至不检查。一句话：结构化类型是"编译期的鸭子类型"。

**例句**：We don't check the type; if it has a save() method, we accept it.（我们不检查类型；只要它有 save() 方法就接受它。）`,
    relations: [
      { to: 'eng-strong-weak-typing', desc: '鸭子类型常出现在动态类型语言，与强弱维度配合理解' },
      { to: 'eng-type-inference', desc: 'TS 的结构化推断继承了鸭子类型的"看形状"精神' },
      { to: 'fe-props', desc: 'TS 对 props 的结构化检查就是"编译期鸭子类型"' },
    ],
    example: `"Any object with a then method is treated as a thenable, regardless of its actual type." —— Promise 规范句（任何带 then 方法的对象都被当作 thenable，不管它实际类型是什么）`,
    interview: '高频：鸭子类型与多态的关系——没有继承也能多态；TS 结构化类型与它的异同。',
  },
  {
    id: 'eng-strong-weak-typing',
    name: 'Strong / Weak Typing',
    en: '强类型与弱类型',
  phonetic: 'str\u0254\u014b wi\u02d0k',
    cat: 'english',
    sub: '类型与语言特性',
    tags: ['类型系统', '易混词', '面试高频'],
    summary: '强弱类型描述语言对类型混用的容忍度：弱类型悄悄转换，强类型直接报错拦下。',
    detail: `**全称**：Strong/Weak（强/弱）+ Typing（类型化）——描述"类型约束严格程度"这个光谱，而非非黑即白。

**含义与语境**：弱类型（JS、PHP）允许不同类型隐式混算："1" + 1 得 "11"；强类型（Python、Java）直接抛 TypeError。面试高频："Python 是强类型还是弱类型？"——答"强类型 + 动态类型"才算懂。

**易混辨析**：两根轴别搞混——Strong/Weak 管"是否容忍隐式转换"，Static/Dynamic 管"类型检查在编译期还是运行期"，互相独立：Python 是"强 + 动态"，C 是"弱 + 静态"（指针乱转它也放行），JS 是"弱 + 动态"。强弱是光谱而非开关，同一语言在不同场景的容忍度也有差异。

**例句**：Python is strongly typed — "1" + 1 raises a TypeError instead of returning "11".（Python 是强类型的——"1" + 1 会抛 TypeError，而不是返回 "11"。）`,
    relations: [
      { to: 'eng-type-coercion', desc: '隐式强转的容忍度正是强弱类型的分界线' },
      { to: 'eng-type-casting', desc: '强类型语言里想转换必须走显式转换' },
      { to: 'eng-duck-typing', desc: '动态类型与鸭子类型常相伴出现，但维度不同' },
    ],
    example: `"JavaScript is weakly typed: the + operator silently coerces its operands." —— 类型系统讨论常用句（JS 是弱类型的：+ 运算符会悄悄转换操作数）`,
    interview: '必考：强弱 / 静动两根轴的四象限，每个象限举一门语言实例。',
  },
  {
    id: 'eng-namespace',
    name: 'Namespace',
    en: '命名空间',
  phonetic: '\u02c8ne\u026amspa\u026as',
    cat: 'english',
    sub: '类型与语言特性',
    tags: ['组织', '命名'],
    summary: '命名空间把名字分组隔离防冲突，见于包名、C++ namespace、npm scope 与 K8s namespace。',
    detail: `**全称**：Name（名字）+ Space（空间）——"给名字划分地盘"。

**含义与语境**：把标识符包进一个命名空间以避免重名冲突：C++ 的 namespace std、C# 的 using、TS 的 namespace（旧称 internal module）、Python 的 module/package、npm 的 @scope/pkg、K8s 的 namespace、XML 的 xmlns。核心目的永远一样：同名不打架。

**易混辨析**：Namespace vs Scope（作用域）——namespace 是"人为划分的命名边界"（代码组织层面），scope 是"变量可见性的词法区域"（运行期可见规则）；Namespace vs Module——module 是物理文件/包级别的划分，namespace 可以在单文件内部。

**例句**：Everything in the std namespace must be explicitly imported in modern C++.（在现代 C++ 中，std 命名空间里的所有名字都必须显式引入。）`,
    relations: [
      { to: 'eng-scope', desc: '命名空间与作用域是"人为分组"与"词法可见"两个维度' },
      { to: 'tool-monorepo', desc: 'Monorepo 中 @scope/pkg 的包名即 npm 的命名空间' },
      { to: 'lc-coding-standards', desc: '命名规范（前缀、分组）是编码标准的重要组成' },
    ],
    example: `"We publish internal packages under the @acme namespace." —— npm 实践句（我们的内部包统一发布在 @acme 命名空间下）`,
    interview: '高频：npm @scope、K8s namespace 的隔离思想同源；TS namespace 为何被 ES Module 取代。',
  },
  {
    id: 'eng-scope',
    name: 'Scope',
    en: '作用域',
  phonetic: 'sko\u028ap',
    cat: 'english',
    sub: '类型与语言特性',
    tags: ['JS 核心', '面试高频'],
    summary: '作用域决定变量在哪里可见、何时销毁，词法作用域与作用域链是 JS 面试必考。',
    detail: `**全称**：源自希腊语 skopos（观察的目标、靶点）——"能看得到的地方"。

**含义与语境**：变量与名字的可见范围。JS 细分：全局/函数/块级作用域（let/const 引入块级）、词法作用域（lexical scope，函数定义时确定）、以及行为上像动态作用域的 this。作用域链（scope chain）是逐层向外查找变量的路径。面试高频：var 提升与函数作用域、let 的暂时性死区（TDZ）。

**易混辨析**：Scope vs Context——scope 管"变量可见性"（词法决定），context 管"this 指向"（调用方式决定），口诀"scope 管变量，context 管 this"；Scope vs Namespace 见 eng-namespace。

**例句**：Variables declared with let are block-scoped, not function-scoped.（用 let 声明的变量是块级作用域，而不是函数作用域。）`,
    relations: [
      { to: 'eng-closure-en', desc: '闭包 = 函数 + 保存下来的词法作用域' },
      { to: 'fe-closure-perf', desc: '作用域链查找与闭包内存影响在前端性能词条展开' },
      { to: 'eng-namespace', desc: '作用域是语言的可见性规则，命名空间是人为的命名分组' },
    ],
    example: `"Inner functions can access variables from their outer lexical scope." —— 经典教材句（内层函数可以访问外层词法作用域中的变量）`,
    interview: '必考：作用域在函数定义时确定（词法）而非调用时；this 与作用域无关、与调用方式有关。',
  },

  // ==================== 内存与运行时 ====================
  {
    id: 'eng-garbage-collection',
    name: 'Garbage Collection',
    en: '垃圾回收',
  phonetic: '\u02c8ɡɑːrb\u026ad\u0292 k\u0259\u02c8lek\u0283\u0259n',
    cat: 'english',
    sub: '内存与运行时',
    tags: ['内存', '运行时'],
    summary: '垃圾回收是运行时自动回收不可达对象内存的机制，GC 调优与内存排查的基础词。',
    detail: `**全称**：Garbage（垃圾）+ Collection（收集）——直译"收垃圾"；缩写 GC，动词形式 collect garbage。

**含义与语境**：运行时自动找出"不会再被使用的对象"并释放其内存，程序员无需手动 free。主流算法：标记-清除（Mark-Sweep）、标记-整理（Mark-Compact）、分代收集（Generational）、引用计数（Python/早期 IE）。见于 JVM 调优、V8 内存排查、Go/Java 面试。

**易混辨析**：GC vs Manual Memory Management——C/C++ 手动 malloc/free，出错就泄漏或悬垂指针；GC vs Memory Leak——GC 只回收"不可达"对象，仍被引用着却不再使用的对象它管不了，这正是托管语言的泄漏来源。

**例句**：A full GC pause of 800ms caused the timeout spikes we saw last night.（一次 800 毫秒的完整 GC 停顿导致了昨晚我们看到的超时尖峰。）`,
    relations: [
      { to: 'eng-memory-leak', desc: 'GC 的盲区（仍被引用的垃圾）正是内存泄漏的成因' },
      { to: 'fe-closure-perf', desc: '闭包持有对象会阻止 GC 回收，是前端内存问题主因' },
      { to: 'eng-stack-heap', desc: 'GC 只管堆上的对象，栈帧随函数返回自动回收' },
    ],
    example: `"The garbage collector reclaims memory for objects that are no longer reachable." —— 教科书定义句（垃圾回收器回收不再可达的对象所占内存）`,
    interview: '高频：可达性分析如何判定垃圾；分代回收为什么有效（弱分代假说：多数对象朝生夕死）。',
  },
  {
    id: 'eng-memory-leak',
    name: 'Memory Leak',
    en: '内存泄漏',
  phonetic: '\u02c8mem\u0259ri li\u02d0k',
    cat: 'english',
    sub: '内存与运行时',
    tags: ['内存', '排查'],
    summary: '内存泄漏指不再使用的对象因仍被引用而无法回收，长期运行服务与 SPA 的常见顽疾。',
    detail: `**全称**：Memory（内存）+ Leak（漏，像容器壁上漏水的孔）——内存像漏水一样一点点流失。

**含义与语境**：分配的内存不再使用却无法释放。GC 语言里照样发生：被遗忘的定时器、闭包持有大对象、事件监听未解绑、脱离 DOM 的引用、全局变量累积。症状：内存曲线只升不降、长时间运行后 OOM 崩溃。见于性能排查、监控告警、面试。

**易混辨析**：Memory Leak vs Memory Overflow（OOM）——泄漏是"因"，持续泄漏最终触发 Out Of Memory 这个"果"；Leak vs Memory Bloat（内存膨胀）——膨胀是数据量真的太大，泄漏是"该放的没放"。

**例句**：The chart component leaked memory because the interval was never cleared.（图表组件内存泄漏了，因为那个定时器始终没有被清除。）`,
    relations: [
      { to: 'eng-garbage-collection', desc: 'GC 只回收不可达对象，"仍被引用的垃圾"正是泄漏来源' },
      { to: 'fe-closure-perf', desc: '闭包持有大对象是前端泄漏的头号元凶，详见该词条' },
      { to: 'ops-metrics', desc: '内存指标监控是发现线上泄漏的第一道防线' },
    ],
    example: `"Take a heap snapshot before and after the action to confirm the leak." —— DevTools 排查句（操作前后各拍一张堆快照来确认泄漏）`,
    interview: '高频：前端泄漏四大来源（定时器、闭包、脱离 DOM 的引用、全局变量）；用 Memory 面板三快照法定位。',
  },
  {
    id: 'eng-stack-heap',
    name: 'Stack vs Heap',
    en: '栈与堆',
  phonetic: 'st\u00e6k hi\u02d0p',
    cat: 'english',
    sub: '内存与运行时',
    tags: ['内存', '基础', '面试高频'],
    summary: '栈存函数调用帧与局部变量、快而自动管理；堆存对象、大而需 GC，是内存问题的坐标系。',
    detail: `**全称**：Stack（叠放——后进先出，像叠盘子）+ Heap（堆——一片可自由取用的杂物堆）。注意与数据结构的 stack/heap 同名不同物。

**含义与语境**：运行时内存两大区：栈存放函数调用帧、局部变量与返回地址，分配释放全自动、极快、容量小（默认几 MB）；堆存放对象与闭包捕获的数据，容量大、靠 GC 或手动管理。栈满即 stack overflow，堆耗尽或碎片化引发 OOM。

**易混辨析**：运行时 Stack vs 数据结构 Stack——前者是内存区域，后者是 LIFO 容器，前者用后者的思想实现；内存 Heap vs 二叉堆（Binary Heap）——同名纯属巧合，堆内存里的对象并无堆序。

**例句**：Deep recursion can overflow the call stack even when the heap still has plenty of room.（即使堆内存还很充裕，深层递归也可能撑爆调用栈。）`,
    relations: [
      { to: 'eng-garbage-collection', desc: '堆上的对象靠 GC 回收，栈帧随函数返回自动弹栈' },
      { to: 'eng-segfault', desc: '栈溢出与非法堆访问都会以段错误的形式崩溃' },
      { to: 'dsa-stack-ds', desc: '栈数据结构（LIFO）是调用栈的实现思想，注意区分同名概念' },
    ],
    example: `"Primitive values live on the stack; objects are allocated on the heap and referenced by pointer." —— 教材经典句（原始值在栈上，对象在堆上分配、由引用指向）`,
    interview: '高频：为什么栈快（移动栈指针即完成分配）；JS 原始类型与对象在栈堆上的分布。',
  },
  {
    id: 'eng-buffer',
    name: 'Buffer',
    en: '缓冲区',
  phonetic: '\u02c8b\u028cf\u0259r',
    cat: 'english',
    sub: '内存与运行时',
    tags: ['内存', 'IO'],
    summary: '缓冲区是临时存放传输中数据的内存块，协调快慢两端，流、IO 与二进制处理高频词。',
    detail: `**全称**：Buffer（缓冲——原义"减轻冲击的垫子"，引申为吸收两端的速度差）。

**含义与语境**：一块临时存放传输中数据的内存区域，协调生产者与消费者的速度差：视频"边下边播"的缓冲、Node 的 Buffer 类处理二进制、流（Stream）的 chunk 累积、日志缓冲刷盘、GPU 的顶点缓冲。日常语境："buffering…"（视频加载转圈）。

**易混辨析**：Buffer vs Cache——buffer 协调"两端速度差"，数据只路过一次；cache 缓存"会重复读取的数据"，追求命中率，数据会被反复使用；Buffer vs Stream——stream 是传输通道，buffer 是通道里的暂存舱。

**例句**：Read the file in chunks into a fixed-size buffer instead of loading it all at once.（分块把文件读进固定大小的缓冲区，而不是一次性全部载入。）`,
    relations: [
      { to: 'dsa-circular-buffer', desc: '环形缓冲区是固定大小缓冲的经典实现，深入讲解见该词条' },
      { to: 'eng-stack-heap', desc: '缓冲区是堆上分配的内存块，受内存管理机制约束' },
      { to: 'fe-web-worker', desc: 'Worker 与主线程通过可转移的 ArrayBuffer 高效交换二进制数据' },
    ],
    example: `"Buffering keeps the player ahead of playback so the video never stutters." —— 流媒体文档句（缓冲让播放进度领先于播放位置，视频才不卡顿）`,
    interview: '高频：为什么网络传输要缓冲（MTU 与 Nagle 算法）；Node Buffer 与 ArrayBuffer 的区别。',
  },
  {
    id: 'eng-segfault',
    name: 'Segmentation Fault',
    en: '段错误',
  phonetic: '\u02c8s\u025bɡm\u0259nt \u02c8f\u0254\u02d0lt',
    cat: 'english',
    sub: '内存与运行时',
    tags: ['内存', '系统', 'C/C++'],
    summary: '段错误是程序访问了未授权内存区域而被操作系统终止，C/C++ 最经典的崩溃，俗称 segfault。',
    detail: `**全称**：Segmentation（分段——早期内存管理把内存划分为若干段）+ Fault（错误）——"越段访问出错"，口语缩写 segfault。

**含义与语境**：操作系统的内存保护机制：程序访问不属于它的地址（解引用空指针/野指针、数组越界写、栈溢出）时，内核发 SIGSEGV 信号终止进程并可能生成 core dump。C/C++/Rust(unsafe) 的日常；GC 语言里对应 NullPointer 异常这类"温和版"。

**易混辨析**：Segfault vs Bus Error——段错误是"权限不允许"，总线错误通常是"地址未对齐"；Segfault vs Stack Overflow——栈溢出是段错误的一种常见成因；Segfault vs NullPointerException——托管语言把崩溃换成了可捕获的异常。

**例句**：Program received signal SIGSEGV, Segmentation fault — you are dereferencing a null pointer.（程序收到 SIGSEGV 信号，段错误——你正在解引用空指针。）`,
    relations: [
      { to: 'eng-stack-heap', desc: '非法访问栈或堆之外的地址都会触发段错误' },
      { to: 'emb-mmio', desc: '嵌入式里访问未映射的寄存器地址同样产生非法访问错误' },
      { to: 'emb-watchdog', desc: '嵌入式程序因野指针跑飞后，常由看门狗复位兜底' },
    ],
    example: `"gdb backtrace shows the crash happened inside parse_header(), line 42." —— core dump 分析句（gdb 回溯显示崩溃发生在 parse_header 第 42 行）`,
    interview: '高频：用 gdb + core dump 定位段错误的步骤；为什么解引用空指针必然触发 SIGSEGV。',
  },
  {
    id: 'eng-race-condition',
    name: 'Race Condition',
    en: '竞态条件',
  phonetic: 're\u026as k\u0259n\u02c8d\u026a\u0283\u0259n',
    cat: 'english',
    sub: '内存与运行时',
    tags: ['并发', '排查'],
    summary: '竞态条件指多线程/多任务因执行时序不确定导致结果错误，是并发 bug 的头号来源。',
    detail: `**全称**：Race（赛跑）+ Condition（条件）——结果取决于"谁先冲线"，即执行顺序。

**含义与语境**：多个执行流（线程、协程、中断、请求）并发访问共享资源且至少一个是写操作，最终结果依赖不可控的时序。经典案例：非原子自增丢更新、double-checked locking 失效、前端"先发后至"的乱序响应覆盖新数据。特点是难复现、偶发。

**易混辨析**：Race Condition vs Deadlock——竞态是"抢着写导致结果错"，死锁是"互相等待卡死不动"；Race Condition vs Data Race（数据竞争）——数据竞争是竞态的底层形式（无同步的并发内存访问），有数据竞争必有竞态，反之不一定。

**例句**：Two requests updated the same row concurrently — a classic race condition.（两个请求并发更新了同一行——典型的竞态条件。）`,
    relations: [
      { to: 'eng-deadlock', desc: '竞态（结果错）与死锁（卡不动）是并发两大病，辨析成对记' },
      { to: 'fe-event-loop', desc: 'JS 单线程事件循环从模型上规避了线程竞态，但异步时序仍会产生竞态' },
      { to: 'emb-rtos', desc: 'RTOS 中中断打断任务访问共享资源是嵌入式竞态的典型来源' },
    ],
    example: `"Add an AbortController so a stale response can't overwrite the latest search results." —— 前端 Code Review 常见句（加一个 AbortController，防止过期响应覆盖最新搜索结果）`,
    interview: '高频：互斥锁如何消除竞态；前端"接口竞态"（切页后旧请求后到）的三种治理手段。',
  },
  {
    id: 'eng-deadlock',
    name: 'Deadlock',
    en: '死锁',
  phonetic: '\u02c8dedl\u0252k',
    cat: 'english',
    sub: '内存与运行时',
    tags: ['并发', '排查'],
    summary: '死锁指多个执行流互相持有并等待对方资源而永久卡住，数据库与线程编程经典问题。',
    detail: `**全称**：Dead（死）+ Lock（锁）——"锁死了"，谁也动不了。

**含义与语境**：形成四条件（Coffman 条件）：互斥、持有并等待、不可剥夺、循环等待——全部满足即死锁。经典场景：线程 A 锁 R1 等 R2，线程 B 锁 R2 等 R1；数据库两个事务互相等待对方持有的行锁（MySQL 会检测并回滚一方）。

**易混辨析**：Deadlock vs Livelock（活锁）——死锁是"都卡住不动"，活锁是"都在动但互相让路谁也过不去"；Deadlock vs Starvation（饥饿）——饥饿是"优先级低一直轮不到"，系统还在跑；Deadlock vs Race Condition——一个卡死，一个出错。

**例句**：The two transactions deadlocked and MySQL rolled back the second one.（这两个事务发生了死锁，MySQL 回滚了第二个。）`,
    relations: [
      { to: 'eng-race-condition', desc: '竞态与死锁构成并发问题的两难兄弟，辨析成对记忆' },
      { to: 'emb-rtos', desc: 'RTOS 中信号量使用不当是嵌入式死锁的常见根源' },
      { to: 'be-acid', desc: '数据库事务的锁机制是死锁讨论的主战场之一' },
    ],
    example: `"Always acquire locks in a global order to prevent deadlocks." —— 并发规范句（始终按全局统一顺序加锁，防止死锁）`,
    interview: '必考：四个必要条件 + 破坏其一即可预防（最常用：统一加锁顺序打破循环等待）。',
  },

  // ==================== 并发与执行 ====================
  {
    id: 'eng-concurrency-vs-parallelism',
    name: 'Concurrency vs Parallelism',
    en: '并发与并行',
  phonetic: 'k\u0259n\u02c8k\u025c\u02d0r\u0259nsi vs \u02ccp\u00e6r\u0259\u02c8lel\u026az\u0259m',
    cat: 'english',
    sub: '并发与执行',
    tags: ['并发', '易混词', '面试高频'],
    summary: '并发是"交替应对多任务"的结构能力，并行是"同时执行"的物理能力，单核也能并发。',
    detail: `**全称**：Concurrency（con- 共同 + curr 跑 = "一起跑"，实为交替跑）vs Parallelism（parallel 平行的 = 真正同时跑）。

**含义与语境**：并发是"组织任务的方式"：单核也能通过时间片轮转/事件循环并发处理多任务（JS 单线程高并发）；并行是"执行的物理形态"：多核/多机同时真跑。Go 团队的名句点题：Concurrency is not parallelism。见于系统设计、面试必考。

**易混辨析**：一句话记忆——并发是"看起来的同时"（结构能力），并行是"真正的同时"（物理执行）；"同时进行"不等于"并行"：单核多任务任意时刻只有一个在跑，只是切换快到像同时。

**例句**：Concurrency is about dealing with lots of things at once; parallelism is about doing lots of things at once.（并发是同时应对很多事，并行是同时做成很多事。—— Rob Pike）`,
    relations: [
      { to: 'fe-event-loop', desc: '事件循环是"单线程并发"的代表模型，JS 高并发的根基' },
      { to: 'eng-thread-pool', desc: '线程池是多核并行执行任务的工程化容器' },
      { to: 'fe-web-worker', desc: 'Web Worker 让浏览器拥有真正的多线程并行能力' },
    ],
    example: `"Concurrency is not parallelism — go channels express concurrency, multi-core gives you parallelism." —— Rob Pike 演讲名句（并发不是并行——goroutine 通道表达并发，多核才给你并行）`,
    interview: '必考：单核 CPU 有并发无并行；JS 是"单线程并发"靠事件循环，Web Worker 补足并行。',
  },
  {
    id: 'eng-thread-pool',
    name: 'Thread Pool',
    en: '线程池',
  phonetic: '\u03b8red pu\u02d0l',
    cat: 'english',
    sub: '并发与执行',
    tags: ['并发', '性能'],
    summary: '线程池预先创建固定线程复用执行任务，避免频繁建销线程的开销，服务端标配。',
    detail: `**全称**：Thread（线程）+ Pool（池）——"池化"（pooling）思想：把昂贵资源预先建好、循环复用；同族还有连接池、对象池、内存池。

**含义与语境**：启动时创建 N 个工作线程，任务提交后进入队列，空闲线程取出执行。三大收益：复用免去创建销毁开销、限制并发数防资源耗尽、便于统一监控。Java 的 Executor 框架、Node 的 libuv 线程池（处理文件 IO/加密）都是它。参数：核心线程数、队列、拒绝策略。

**易混辨析**：Thread Pool vs Connection Pool——池化对象不同：线程执行任务，连接持有数据库会话，但管理思想同源；Thread Pool vs 进程池——进程更重、隔离更强。

**例句**：Configure the executor with a bounded queue to avoid task pileup under load.（给线程池配置有界队列，避免高负载下任务无限堆积。）`,
    relations: [
      { to: 'eng-concurrency-vs-parallelism', desc: '线程池是让任务获得并行执行能力的容器' },
      { to: 'be-conn-pool', desc: '连接池与线程池共享"池化复用"思想，对照理解' },
      { to: 'emb-rtos', desc: 'RTOS 的任务调度是嵌入式版的"线程池"思想' },
    ],
    example: `"Threads are created once and reused for multiple tasks, avoiding expensive per-task creation." —— 池化收益标准句（线程只创建一次并复用于多个任务，避免昂贵的按任务创建）`,
    interview: '高频：Java 线程池七大参数与执行流程；CPU 密集设核数、IO 密集可设更高的经验公式。',
  },
  {
    id: 'eng-idempotent',
    name: 'Idempotent',
    en: '幂等',
  phonetic: '\u02cca\u026ad\u0259m\u02c8po\u028at\u0259nt',
    cat: 'english',
    sub: '并发与执行',
    tags: ['分布式', 'API', '面试高频'],
    summary: '幂等指同一操作执行一次与多次效果相同，接口重试、消息防重消费的理论基石。',
    detail: `**全称**：源自数学——idem（同样的）+ potent（力量），即 f(f(x)) = f(x)：施加多次与施加一次效果相同。

**含义与语境**：同一请求发一次和发 N 次，最终状态一致。HTTP 语义：GET/PUT/DELETE 幂等，POST 不幂等。分布式语境：支付接口防重复扣款（幂等键 idempotency key）、消息队列重复消费、重试机制的安全前提。见于 API 设计文档、Stripe 等支付文档、面试。

**易混辨析**：Idempotent vs Pure——幂等管"重复执行效果不变"（可有副作用），纯函数管"无副作用且输出确定"，两个正交维度；Idempotent vs Safe（HTTP 安全方法）——safe 是"不改变任何状态"，幂等不要求首次也不改变（DELETE 幂等但不安全）。

**例句**：Include an idempotency key so retrying the payment won't double-charge the customer.（带上幂等键，这样重试支付就不会重复扣款。）`,
    relations: [
      { to: 'be-rest', desc: 'REST 对 HTTP 方法幂等性有明确约定，是幂等的经典语境' },
      { to: 'be-mq', desc: '消息队列至少一次投递决定了消费端必须幂等' },
      { to: 'be-api-gateway', desc: '网关重试策略的安全性取决于接口是否幂等' },
    ],
    example: `"The Stripe API idempotency key ensures the same request is only processed once." —— 支付文档句（Stripe 的幂等键保证同一请求只被处理一次）`,
    interview: '必考：HTTP 方法幂等性分类；幂等设计三板斧（唯一键 + 状态机 + 去重表）。',
  },
  {
    id: 'eng-async-await',
    name: 'Async / Await',
    en: '异步与等待',
  phonetic: '\u02c7e\u026a\u028as\u014bk \u0259\u02c8we\u026at',
    cat: 'english',
    sub: '并发与执行',
    tags: ['异步', '语法糖'],
    summary: 'async/await 用同步写法处理异步，本质是 Promise 的语法糖，配合事件循环与微任务理解。',
    detail: `**全称**：Async = Asynchronous（异步的，a- 非 + syn 共 + chron 时间）的缩写；Await = a + wait（等待）——"异步地等"。

**含义与语境**：async 标记函数返回 Promise，await 暂停函数执行直到 Promise 结束，让异步代码长得像同步。C# 最早推广，JS ES2017、Python、Rust 相继采用。错误处理用 try/catch 替代 .catch 链。常见于现代前端代码与面试执行顺序题。

**易混辨析**：await 不是同步阻塞——它让出线程给事件循环，其他任务照跑；async 函数无论如何都返回 Promise；顺序写多个 await 会串行等待，想并行要 Promise.all——"怎么并发多个请求"是高频考点。

**例句**：The async function pauses at each await without blocking the event loop.（async 函数在每个 await 处暂停，但不会阻塞事件循环。）`,
    relations: [
      { to: 'fe-event-loop', desc: 'await 之后代码何时恢复执行由事件循环调度' },
      { to: 'fe-microtask-macrotask', desc: 'await 后续代码进入微任务队列，执行顺序考点所在' },
      { to: 'eng-callback', desc: 'async/await 是对回调与 Promise 链的语法级终结者' },
    ],
    example: `"Unhandled promise rejections inside async functions are caught by try/catch." —— 现代写法说明句（async 函数内未处理的 Promise 拒绝可被 try/catch 捕获）`,
    interview: '高频：async/await 执行顺序（微任务）；Promise.all 与顺序 await 的耗时差异。',
  },

  // ==================== 工程行话 ====================
  {
    id: 'eng-boilerplate',
    name: 'Boilerplate',
    en: '样板代码',
  phonetic: '\u02c8b\u0254\u026al\u0259rple\u026at',
    cat: 'english',
    sub: '工程行话',
    tags: ['行话', 'Code Review'],
    summary: '样板代码指复制粘贴即可用、几乎不改的模板代码，也指项目脚手架与冗长配置。',
    detail: `**全称**：Boiler（锅炉）+ Plate（钢板）——源自出版业：冲压成型的钢版只能整块照印、无法改字，引申为"照搬的模板文本"；法律合同套话也用此词。

**含义与语境**：两层含义：1）中性——脚手架、许可证头部、配置模板这类"复制即可用"的代码；2）贬义——重复无信息量的代码（一堆 getter/setter、样板配置），框架宣传语 "less boilerplate"（少写样板）即针对后者。见于工程讨论与框架对比。

**易混辨析**：Boilerplate vs Template（模板）——template 留了占位符等你填，boilerplate 是整块照搬不用填；Boilerplate vs Verbose——前者指"重复的样板"，后者指"啰嗦冗长"（不重复也可能啰嗦）。

**例句**：This starter kit eliminates most of the boilerplate for setting up a new project.（这个启动套件省去了新项目初始化的大部分样板代码。）`,
    relations: [
      { to: 'eng-idiomatic', desc: '地道写法往往能消掉翻译腔式样板代码' },
      { to: 'eng-verbose', desc: '样板代码与啰嗦代码常相伴出现，但含义不同' },
      { to: 'lc-coding-standards', desc: '编码规范通过约定与生成器减少重复样板' },
    ],
    example: `"Reduce boilerplate by generating types from the OpenAPI spec." —— 工程实践句（从 OpenAPI 规范生成类型，减少样板代码）`,
    interview: '聊框架时可用：Vue SFC、React Hooks 都以"减少 boilerplate"为核心卖点。',
  },
  {
    id: 'eng-deprecated',
    name: 'Deprecated',
    en: '已弃用',
  phonetic: '\u02c8depr\u0259ke\u026at\u026ad',
    cat: 'english',
    sub: '工程行话',
    tags: ['行话', '文档'],
    summary: '已弃用指官方不建议再用但暂未删除，弃用警告的标志性用词，升级依赖前必看。',
    detail: `**全称**：de-（向下、去除）+ preciate（价值，与 appreciate"珍视"同根）——"价值被贬"，不再推荐。

**含义与语境**：生命周期三段：Deprecated（不建议用但可用）→ Obsolete（已过时）→ Removed（已删除）。弃用通常伴随替代方案与起始版本（"since v2.0"）。库作者的规范姿势：先弃用、给替代、留过渡期，再在大版本删除。见于 JSDoc 的 @deprecated 标记、IDE 删除线提示、npm install 的 deprecation warning、RFC。

**易混辨析**：Deprecated vs Removed——弃用是"还能用但有警告"，删除是"真没了直接报错"；Deprecated vs Legacy——前者是官方态度（这个 API 别用了），后者是系统现状（这套老系统还在跑）。

**例句**：This method is deprecated since v2.0, use fetchV2 instead.（该方法自 v2.0 起已弃用，请改用 fetchV2。）`,
    relations: [
      { to: 'eng-legacy', desc: '弃用是官方标记，遗留是系统现状，两个视角对照记忆' },
      { to: 'tool-semver-dep', desc: '依赖版本中的弃用警告是升级决策的重要输入' },
      { to: 'lc-semver', desc: '语义化版本规范约定：破坏性变更前应先弃用' },
    ],
    example: `"This method is deprecated since v2.0, use fetchV2 instead." —— 弃用警告的典型句式`,
    interview: '实践要点：库作者弃用 API 必须留替代指引；升级依赖前先看 deprecation warning 清单。',
  },
  {
    id: 'eng-legacy',
    name: 'Legacy',
    en: '遗留系统',
  phonetic: '\u02c8le\u0261\u0259si',
    cat: 'english',
    sub: '工程行话',
    tags: ['行话', '技术债'],
    summary: 'Legacy 指老一代仍在服役的代码或系统，维护遗留系统与迁移是工程常态话题。',
    detail: `**全称**：源自拉丁语 legare（遗赠）——前人"留传下来"的代码；单词本义"遗产"，本属中性。

**含义与语境**：Legacy code/system：仍在生产运行、但技术栈老旧或无人熟悉的老系统。经典定义来自《Working Effectively with Legacy Code》：没有测试覆盖的代码都是遗留代码。工程语境：legacy 迁移、旧接口兼容、绞杀者模式（strangler pattern）渐进替换。

**易混辨析**：Legacy vs Deprecated——legacy 是状态描述（还活着但老），deprecated 是官方标记（明确叫你别用）；Legacy vs Obsolete——obsolete 意为"已被淘汰、不再使用"，legacy 还在服役。

**例句**：We're strangling the legacy monolith service by service instead of a big-bang rewrite.（我们正在逐个服务地绞杀式迁移这个遗留单体，而不是一次性重写。）`,
    relations: [
      { to: 'lc-tech-debt', desc: '遗留系统是技术债的载体，治理思路在技术债词条展开' },
      { to: 'eng-deprecated', desc: '遗留系统里充满被弃用的 API，两个词同框出现' },
      { to: 'eng-refactoring-en', desc: '重构是治理遗留代码的核心手段' },
    ],
    example: `"Michael Feathers defines legacy code as code without tests." —— 经典书观点句（Michael Feathers 把遗留代码定义为没有测试的代码）`,
    interview: '聊迁移经验：先补测试再动刀、双写灰度、绞杀者模式渐进替换。',
  },
  {
    id: 'eng-refactoring-en',
    name: 'Refactoring',
    en: '重构',
  phonetic: 'ri\u02c8f\u00e6kt\u0259r\u026a\u014b',
    cat: 'english',
    sub: '工程行话',
    tags: ['行话', '质量'],
    summary: '重构是在不改外部行为的前提下改善内部结构，"不修 bug 也不加功能"是关键定义。',
    detail: `**全称**：re-（重新）+ factor（因式分解、组织因子）——"重新组织代码的因子"；名词动同形，动词 to refactor。

**含义与语境**：Martin Fowler 的经典定义：在**不改变软件可观察行为**的前提下调整其内部结构。关键特征：不加功能、不修 bug、不改行为——只让代码更可读、更好改。常见手法：提取函数（Extract Function）、改名（Rename）、搬移类。安全前提：有测试兜底。

**易混辨析**：Refactoring vs Rewriting（重写）——重构小步渐进、行为不变，重写推倒重来、风险巨大；Refactoring vs Bug Fix——修 bug 改变行为（从错到对），重构绝不改变行为；"顺手改了点逻辑"的 PR 不是重构。

**例句**：This PR is a pure refactor — no behavior change, tests untouched and green.（这个 PR 是纯重构——行为无变化，测试原样且全绿。）`,
    relations: [
      { to: 'lc-refactor', desc: '重构的时机、手法与安全网在该词条系统展开' },
      { to: 'lc-tech-debt', desc: '重构是偿还技术债的主要偿还方式' },
      { to: 'eng-idiomatic', desc: '把翻译腔代码改地道，是日常重构的一部分' },
    ],
    example: `"Refactoring is a disciplined technique for restructuring existing code without changing its observable behavior." —— Fowler 定义原句（重构是在不改变可观察行为前提下重组代码的严谨技法）`,
    interview: '高频：重构为什么必须先有测试；"大泥球"如何渐进治理；重构与重写的取舍。',
  },
  {
    id: 'eng-idiomatic',
    name: 'Idiomatic',
    en: '惯用的/地道的',
  phonetic: '\u02cc\u026adi\u0259\u02c8m\u00e6t\u026ak',
    cat: 'english',
    sub: '工程行话',
    tags: ['行话', '风格'],
    summary: '惯用指符合该语言社区公认的写法风格，Code Review 里"这不地道"就指偏离惯例。',
    detail: `**全称**：源自 idiom（习语、惯用语）+ -atic——像"说英语有地道与中式英语之分"，写代码也有地道与"翻译腔"之分。

**含义与语境**：Idiomatic code：符合语言社区惯例的代码——Python 圈叫 Pythonic，Go 圈讲 go fmt 风格，Rust 圈有 idiom 指南。反面是"用 Java 的思路写 Python"。积累地道写法的捷径：读官方风格指南与标准库源码。见于 Code Review 评论、语言风格指南、面试聊天。

**易混辨析**：Idiomatic vs Clean（整洁）——clean 泛指可读性好，idiomatic 特指"符合本语言社区惯例"：代码可以 clean 但不 idiomatic；Idiomatic vs Verbose——地道往往简洁，翻译腔常啰嗦。

**例句**：Use list comprehensions here — this loop isn't very Pythonic.（这里应该用列表推导式——你这个循环写得不太 Pythonic。）`,
    relations: [
      { to: 'lc-coding-standards', desc: '编码规范是"地道写法"在团队层面的固化' },
      { to: 'eng-verbose', desc: '不地道常常表现为啰嗦，两者在评审中常一起出现' },
      { to: 'eng-boilerplate', desc: '样板代码往往就是不地道写法的产物' },
    ],
    example: `"Prefer errors.Is over direct equality checks — that's the idiomatic way in Go." —— Code Review 评论（优先用 errors.Is 而不是直接判等——这才是 Go 的地道写法）`,
    interview: '可聊：各语言的地道性标志——Pythonic、go fmt、Rust 的 Option 处理。',
  },
  {
    id: 'eng-verbose',
    name: 'Verbose',
    en: '冗长啰嗦的',
  phonetic: 'v\u025c\u02d0r\u02c8bo\u028as',
    cat: 'english',
    sub: '工程行话',
    tags: ['行话', '风格'],
    summary: 'Verbose 评代码是贬义"啰嗦"，评日志是中性"详细输出"，语感随对象切换。',
    detail: `**全称**：源自拉丁语 verbum（词）——"词太多"；同族词：verbal（口头的）、proverb（谚语）。

**含义与语境**：双重语感，看对象：1）贬义评代码——verbose = 啰嗦、样板堆砌、明明三行能写完却写了十行；2）中性评输出——verbose mode（详细模式）：CLI 的 -v 参数、构建工具的详细日志，指"打印更多过程信息"。见于 CLI 帮助文档、Code Review、构建日志。

**易混辨析**：Verbose vs Explicit（显式）——显式是褒义"意图清楚"，verbose 是"词多到冗余"；有趣的是 Go 社区会夸代码 verbose（显式即美德），Java 则常被嘲 verbose；Verbose vs Detailed——detailed 强调"信息充分"，verbose 强调"字数冗余"。

**例句**：Run the build with --verbose to see exactly which plugin failed.（用 --verbose 运行构建，看清楚到底是哪个插件失败了。）`,
    relations: [
      { to: 'eng-idiomatic', desc: '地道写法通常更简洁，啰嗦常是翻译腔的信号' },
      { to: 'eng-boilerplate', desc: '样板代码与啰嗦代码是"冗余"的两种形态' },
      { to: 'lc-code-review', desc: '评审意见里 verbose 属于风格类建议，非阻塞问题' },
    ],
    example: `"Java tends to be verbose: even a simple getter requires several lines." —— 语言对比常用句（Java 往往很啰嗦：连一个简单 getter 都要好几行）`,
    interview: '语感要点：评同事代码说 verbose 偏批评，评日志级别说 verbose 是功能开关。',
  },
  {
    id: 'eng-dry',
    name: 'DRY',
    en: '不要重复自己',
  phonetic: 'dra\u026a',
    cat: 'english',
    sub: '工程行话',
    tags: ['原则', '缩写'],
    summary: 'DRY 即"不要重复自己"——知识在系统里只该有一份权威表述，软件工程第一原则。',
    detail: `**全称**（逐词）：**D**on't **R**epeat **Y**ourself，出自《程序员修炼之道》（The Pragmatic Programmer，1999）。自嘲反义词 WET（We Enjoy Typing / Write Everything Twice）。

**含义与语境**：原文定义：Every piece of knowledge must have a single, unambiguous, authoritative representation——每份知识在系统内只能有唯一、无歧义、权威的表述。重复的不只是代码：配置重复、文档重复、接口契约重复都算违反。见于团队规范与 Code Review（"这里违反 DRY 了"）。

**易混辨析**：DRY vs YAGNI/KISS——DRY 管重复，YAGNI/KISS 管过度设计：为消除表面重复硬抽"万能基类"反而同时违反 DRY（错误抽象）与 KISS；"偶然重复"（accidental duplication）不必强行合并。

**例句**：Extract that into a shared util — this is the third copy, DRY it up.（把它抽成公共工具函数——这已经是第三份拷贝了，遵守 DRY。）`,
    relations: [
      { to: 'eng-yagni-kiss', desc: 'DRY 与 YAGNI/KISS 构成"消除重复 vs 防止过度"的平衡组' },
      { to: 'lc-coding-standards', desc: '编码规范把 DRY 落成具体的复用约定' },
      { to: 'lc-tech-debt', desc: '复制粘贴式重复是最常见的技术债形态' },
    ],
    example: `"Every piece of knowledge must have a single, unambiguous, authoritative representation within a system." —— DRY 原则原文（每份知识在系统内必须有唯一、无歧义、权威的表述）`,
    interview: '高频：DRY 的边界——两段代码"长得像"不等于"知识重复"，强行抽象比重复更糟。',
  },
  {
    id: 'eng-yagni-kiss',
    name: 'YAGNI / KISS',
    en: '你不会需要它 / 保持简单',
  phonetic: 'j\u00e6ɡni k\u026as',
    cat: 'english',
    sub: '工程行话',
    tags: ['原则', '缩写', '行话'],
    summary: 'YAGNI 管住"现在就做"的冲动，KISS 管住"做出来太复杂"，反过度设计双原则。',
    detail: `**全称**（逐词）：YAGNI = **Y**ou **A**ren't **G**onna **N**eed **I**t（你不会需要它），极限编程（XP）提出；KISS = **K**eep **I**t **S**imple, **S**tupid（保持简单，连傻瓜都能懂），源自 1960 年代美国海军的工程设计原则。

**含义与语境**：YAGNI：别为"将来可能需要"写现在用不上的功能，需求真来了再写也不迟；KISS：能用简单方案就别炫技，每一分复杂度都是未来的维护成本。见于架构评审（"这层抽象 YAGNI 了"）、Code Review、MVP 讨论。

**易混辨析**：YAGNI vs DRY——DRY 防重复（该合就合），YAGNI 防超前（不该提前建）；KISS vs YAGNI——KISS 说"已实现的东西要简单"，YAGNI 说"没需要的东西别实现"，一个管质量一个管范围。

**例句**：Let's not build a plugin system for two use cases — YAGNI.（两个用例就别搞插件系统了——你不会需要它。）`,
    relations: [
      { to: 'eng-dry', desc: '与 DRY 构成"防重复 vs 防超前"的平衡组' },
      { to: 'lc-mvp', desc: 'YAGNI 与 MVP 精神同源：先做最小可用，验证后再扩' },
      { to: 'lc-coding-standards', desc: '编码规范中的"拒绝炫技"条款即 KISS 的落地' },
    ],
    example: `"Write the simple version first; you aren't gonna need the generic one." —— 评审常用句（先写简单版本；你不会需要那个通用版）`,
    interview: '高频：YAGNI 与 MVP 的关系；举一个"为想象中的需求过度设计"的例子。',
  },

  // ==================== 高频缩写 ====================
  {
    id: 'eng-api-en',
    name: 'API = Application Programming Interface',
    en: '应用程序编程接口',
  phonetic: '\u02cce\u026ape\u02c8a\u026a',
    cat: 'english',
    sub: '高频缩写',
    tags: ['缩写', '基础', '高频'],
    summary: 'API 即应用程序编程接口——软件间约定的调用方式，日常说的"调接口"多半指它。',
    detail: `**全称**（逐词）：**A**pplication（应用）**P**rogramming（编程）**I**nterface（接口）——"应用之间编程层面的约定"。

**含义与语境**：定义"别人能调你什么、怎么调"的契约：函数签名是代码级 API，REST 端点是 Web API，浏览器的 fetch/DOM 是 Web API，操作系统系统调用是 OS API。日常口语"调接口""接口文档"默认指 HTTP API。全栈无处不在的第一缩写。

**易混辨析**：API vs SDK——API 是"契约"（规则本身），SDK 是"工具包"（封装好的实现、文档、示例，帮你更省事地调 API）；API vs ABI——ABI 是编译后的二进制层兼容约定，普通开发者很少直接打交道。

**例句**：Our public API is versioned and rate-limited at 100 requests per minute.（我们的公开 API 带版本号，并限速为每分钟 100 次请求。）`,
    relations: [
      { to: 'be-rest', desc: 'REST 是 HTTP API 最主流的设计风格' },
      { to: 'be-api-gateway', desc: 'API 网关是所有 API 请求的统一入口与守门人' },
      { to: 'lc-api-doc', desc: 'API 文档是把契约写清楚、联调不掉链子的关键交付物' },
    ],
    example: `"Please refer to the API documentation for the full list of endpoints." —— 接口文档标准句（完整端点列表请参阅 API 文档）`,
    interview: '高频：好 API 的标准——一致性、可演进、向后兼容、错误信息可诊断。',
  },
  {
    id: 'eng-sdk-en',
    name: 'SDK = Software Development Kit',
    en: '软件开发工具包',
  phonetic: 'es di\u02d0 ke\u026a',
    cat: 'english',
    sub: '高频缩写',
    tags: ['缩写', '生态'],
    summary: 'SDK 是软件开发工具包——官方打包好的库、工具与文档，接入平台能力的省事途径。',
    detail: `**全称**（逐词）：**S**oftware（软件）**D**evelopment（开发）**K**it（成套工具箱）。

**含义与语境**：官方为平台能力提供的"接入全家桶"：类库 + 编译/调试工具 + 文档 + 示例。典型：Android SDK、微信小程序 SDK、支付 SDK、各云产品的 SDK（把签名、重试、序列化都封装好）。安装方式：npm install、gradle 依赖、下载安装包。

**易混辨析**：SDK vs API——API 是规则，SDK 是"实现并封装了 API 调用的工具箱"，用 SDK 最终还是在调 API；SDK vs Library——库是单个可复用组件，SDK 是围绕某平台的成套开发环境，可包含多个库。

**例句**：Initialize the SDK with your app credentials before making any API calls.（在调用任何 API 之前，先用你的应用凭证初始化 SDK。）`,
    relations: [
      { to: 'eng-api-en', desc: 'SDK 是 API 的封装与全家桶，两者是规则与工具包的关系' },
      { to: 'eng-cli-en', desc: '不少 SDK 自带 CLI 工具，作为开发体验的一部分' },
      { to: 'agent-mcp', desc: 'MCP 为 AI 工具接入提供官方 SDK，是 SDK 思想在新领域的应用' },
    ],
    example: `"The SDK handles request signing and retries automatically." —— 云产品文档句（SDK 会自动处理请求签名与重试）`,
    interview: '实践要点：选 SDK 看维护活跃度、类型支持、体积，以及与自研薄封装的取舍。',
  },
  {
    id: 'eng-cli-en',
    name: 'CLI = Command-Line Interface',
    en: '命令行界面',
  phonetic: 'si\u02d0 el \u02c8a\u026a',
    cat: 'english',
    sub: '高频缩写',
    tags: ['缩写', '工具'],
    summary: 'CLI 即命令行界面——用文本命令操作程序的方式，效率与自动化的标配，反义是 GUI。',
    detail: `**全称**（逐词）：**C**ommand-**L**ine（命令行）**I**nterface（界面）——"通过敲命令与程序交互"。

**含义与语境**：开发者日常的 git、npm、docker、kubectl 全是 CLI。CLI 的价值：可组合（管道）、可脚本化（自动化）、可远程（SSH 环境没有 GUI）。生态关键词：子命令（npm install）、--verbose 之类的 flag、交互式 prompt、npm 的 bin 字段是发布 CLI 的入口。

**易混辨析**：CLI vs GUI（图形界面）——前者键盘驱动、适合自动化，后者鼠标驱动、适合探索；CLI vs Shell——shell 是"命令行解释器"这个程序（bash/zsh），CLI 是"任何提供命令行交互的程序"——你在 shell 里敲各种 CLI。

**例句**：Run npx create-vite@latest to scaffold a project from the command line.（运行 npx create-vite@latest，从命令行脚手架一个项目。）`,
    relations: [
      { to: 'tool-shell-basics', desc: 'Shell 是运行 CLI 的解释器环境，命令行技能的地基' },
      { to: 'tool-npx-scripts', desc: 'npx 让你免安装直接运行 npm 生态里的 CLI 工具' },
      { to: 'eng-gui-en', desc: 'CLI 与 GUI 是人机交互的两大范式，对照记忆' },
    ],
    example: `"All flags are listed in the CLI help output: run git help clone." —— 帮助文档句（所有 flag 都在 CLI 帮助输出里：运行 git help clone）`,
    interview: '实践要点：好 CLI 的特征——子命令清晰、--help 完备、退出码规范、支持管道。',
  },
  {
    id: 'eng-gui-en',
    name: 'GUI = Graphical User Interface',
    en: '图形用户界面',
  phonetic: '\u02c8ɡu\u02d0i',
    cat: 'english',
    sub: '高频缩写',
    tags: ['缩写', '界面'],
    summary: 'GUI 即图形用户界面——用窗口、图标、鼠标交互的界面，前端与桌面开发的"屏上世界"。',
    detail: `**全称**（逐词）：**G**raphical（图形的）**U**ser（用户）**I**nterface（界面）——相对命令行而言"看得见、点得着"的界面。

**含义与语境**：以 WIMP 范式（Window 窗口、Icon 图标、Menu 菜单、Pointer 指针）组织的图形界面。前端开发的浏览器页面就是 Web GUI；桌面端有 Qt/Electron；历史上 GUI 由施乐 PARC 孕育、苹果与微软发扬光大。日常语境："做个 GUI 工具" = 有界面的图形程序。

**易混辨析**：GUI vs CLI 见 eng-cli-en；GUI vs UI——GUI 是 UI 的子集，特指"图形化"的 UI；UI 还包括语音交互（VUI）、触屏手势等非图形交互，日常口语里两者常混用。

**例句**：The tool ships with both a GUI and a CLI — pick whichever fits your workflow.（这个工具同时提供图形界面和命令行——按你的工作流任选。）`,
    relations: [
      { to: 'eng-cli-en', desc: 'GUI 与 CLI 是人机交互两大范式，见 CLI 词条对照' },
      { to: 'eng-ide-en', desc: 'IDE 是开发者最常用的 GUI 应用之一' },
      { to: 'lc-ui-design', desc: 'GUI 的设计方法与原则正是 UI 设计的讨论对象' },
    ],
    example: `"The desktop app provides a GUI for configuring agents without editing YAML." —— 工具文档句（桌面应用提供了 GUI，让你不用手改 YAML 就能配置）`,
    interview: '语感要点：说"GUI 工具"通常指"有窗口界面的程序"，与 headless（无界面）相对。',
  },
  {
    id: 'eng-ide-en',
    name: 'IDE = Integrated Development Environment',
    en: '集成开发环境',
  phonetic: 'a\u026a di\u02d0 \u02c8i\u02d0',
    cat: 'english',
    sub: '高频缩写',
    tags: ['缩写', '工具'],
    summary: 'IDE 即集成开发环境——编辑器、构建、调试一体的工具，VS Code/JetBrains 是主流。',
    detail: `**全称**（逐词）：**I**ntegrated（集成的）**D**evelopment（开发）**E**nvironment（环境）——"把开发所需工具集成进一个软件"。

**含义与语境**：集成四件套：编辑器（补全/重构）、构建与运行、调试器（断点/变量查看）、版本管理。典型：JetBrains 全家桶（IntelliJ/WebStorm/PyCharm）、Visual Studio、Eclipse；VS Code 严格说是"编辑器 + 插件生态"，装齐插件后等同 IDE。

**易混辨析**：IDE vs Code Editor（编辑器）——IDE 开箱即全（调试器、构建器内建），编辑器轻量靠插件扩展，VS Code 处于两者之间；IDE vs Toolkit——Android Studio 本质是面向 Android 的定制 IDE。

**例句**：Set a breakpoint in your IDE and inspect the variable state at each step.（在 IDE 里打个断点，逐步查看变量状态。）`,
    relations: [
      { to: 'tool-editor-setup', desc: '编辑器/IDE 的配置与插件体系是该词条的主题' },
      { to: 'eng-cli-en', desc: 'IDE 内置终端让你在图形环境里无缝使用 CLI' },
      { to: 'eng-gui-en', desc: 'IDE 是 GUI 应用，但资深开发者常混用命令行' },
    ],
    example: `"The IDE flags the deprecated API usage directly in the editor." —— IDE 功能句（IDE 直接在编辑器里标出被弃用 API 的调用）`,
    interview: '实践要点：调试器是面试演示利器；提取函数、改名等重构快捷键必须熟练。',
  },
  {
    id: 'eng-lts',
    name: 'LTS = Long-Term Support',
    en: '长期支持版',
  phonetic: 'el ti\u02d0 \u02c8es',
    cat: 'english',
    sub: '高频缩写',
    tags: ['缩写', '版本', '运维'],
    summary: 'LTS 即长期支持版——官方承诺长期维护的稳定版本，生产环境选型的默认答案。',
    detail: `**全称**（逐词）：**L**ong-**T**erm（长期）**S**upport（支持）——"承诺支持很久的版本"。

**含义与语境**：发布策略：每若干个版本指定一个 LTS，只收安全修复与关键 bug、不加新特性，支持期通常 2.5~5 年。典型：Node.js 偶数版本是 LTS（18/20/22）、Ubuntu LTS（两年一版、支持五年）、Java 的 8/11/17/21。生产选型的默认答案。

**易混辨析**：LTS vs Current/Latest——LTS 求稳（生产用它），Current 有新特性（尝鲜用）；LTS vs EOL（End of Life，生命周期终止）——EOL 意味着不再有安全更新、必须升级，"还在跑 EOL 版本"是安全审计的红旗。

**例句**：Node 18 reached End of Life, so we migrated all services to the 20 LTS line.（Node 18 已终止支持，所以我们把所有服务迁移到了 20 的 LTS 线。）`,
    relations: [
      { to: 'tool-semver-dep', desc: 'LTS 是版本策略的一种，与语义化版本配合理解' },
      { to: 'lc-semver', desc: '发布节奏与版本号规则在语义化版本词条展开' },
      { to: 'tool-npm', desc: 'npm 的 engines 字段可锁定项目使用的 Node LTS 版本' },
    ],
    example: `"Use only LTS releases in production; Current is for experimentation." —— 团队规范句（生产环境只用 LTS 版本；Current 版本留给尝鲜）`,
    interview: '运维要点：生产选 LTS、制定升级日历；EOL 版本出现在审计报告里就是整改项。',
  },
  {
    id: 'eng-wip-lgtm',
    name: 'WIP / LGTM',
    en: '进行中 / 看起来不错',
  phonetic: 'd\u028cbju\u02d0 a\u026a pi\u02d0',
    cat: 'english',
    sub: '高频缩写',
    tags: ['缩写', 'Code Review', '行话'],
    summary: 'WIP 标记"还没写完别合并"，LGTM 表示"我看过了可以合"——Code Review 高频缩写。',
    detail: `**全称**（逐词）：**WIP** = **W**ork **I**n **P**rogress（进行中的工作）；**LGTM** = **L**ooks **G**ood **T**o **M**e（在我看来不错）。

**含义与语境**：都出现在 PR/协作流程：标题加 [WIP] 或转成 Draft PR 表示"还在写、先看看方向、别合并"；reviewer 回 LGTM 或点 Approve 表示通过。演进：GitHub 用 Draft PR 取代 WIP 标记，用 Approve 机制形式化 LGTM，但行话仍高频。

**易混辨析**：LGTM vs Approved——LGTM 是口语表态，Approve 是平台动作（真正解锁合并按钮）；WIP vs Draft——draft 是状态机制，WIP 是约定标记；同族行话：nit（小瑕疵，可不改）、PTAL（Please Take Another Look，请再看一眼）。

**例句**：Still WIP, but PTAL on the overall approach — I'll merge once tests pass.（还在进行中，但请先看看整体思路——测试过了我就合并。）`,
    relations: [
      { to: 'tool-pr', desc: 'WIP/Draft 与 LGTM 都发生在 PR 协作流程中' },
      { to: 'lc-code-review', desc: 'Code Review 的流程与礼仪是该词条的系统讲解处' },
      { to: 'tool-code-review-gh', desc: 'GitHub 上如何发起与回应 Review 的操作指南' },
    ],
    example: `"LGTM except two nits — address them and ship it." —— Review 评论（整体不错只有两个小瑕疵——改完就可以合了）`,
    interview: '实践要点：Review 意见区分 nit 与 blocking；LGTM 不等于已合并，CI 绿灯仍是前提。',
  },
  {
    id: 'eng-tbd-na',
    name: 'TBD / N/A',
    en: '待定 / 不适用',
  phonetic: 'ti bi\u02d0 di\u02d0',
    cat: 'english',
    sub: '高频缩写',
    tags: ['缩写', '文档', '行话'],
    summary: 'TBD 标记"还没定"，N/A 标记"此处不适用"——文档、表格、评审里的占位缩写。',
    detail: `**全称**（逐词）：**TBD** = **T**o **B**e **D**ecided（待定，也有 To Be Determined 写法）；**N/A** = **N**ot **A**pplicable（不适用，也作 Not Available）。

**含义与语境**：文档占位符：PRD 里 TBD 表示"这块还没想好，等定论"；表格里 N/A 表示"此项与该行无关/无值"。技术语境：RFC/设计文档用 TBD 标记待讨论点；配置表里 N/A 表示该项不生效。近亲：TODO（待办）、TBC（To Be Confirmed 待确认）、FYI（供你参考）。

**易混辨析**：TBD vs TBC——decided 是"还没决定"，confirmed 是"还没最终确认"（可能已有倾向）；N/A vs 空值/0——N/A 是"语义上不适用"（不是数字），0 是真实值，数据表里混用两者会引发统计事故。

**例句**：Timeline: TBD until the design review is done.（时间表：待设计评审完成后再定。）`,
    relations: [
      { to: 'lc-prd', desc: 'PRD 中 TBD 占位与需求评审的收敛流程直接相关' },
      { to: 'lc-api-doc', desc: '接口文档里 N/A 常用于标记不适用的字段或响应' },
    ],
    example: `"Owner: TBD (to be assigned after the kickoff meeting)." —— 项目文档句（负责人：待定——启动会后分配）`,
    interview: '语感要点：评审文档看到 TBD 要追问决策人与截止时间；N/A 不能当默认值填进数据。',
  },
];
