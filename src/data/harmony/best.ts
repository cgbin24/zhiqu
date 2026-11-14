import type { Level } from '@/types';

/**
 * 鸿蒙应用开发 · 第五章：性能调优（best，4 关）。
 * LazyForEach 数据源、@Builder 复用、状态下沉（renderCounts 断言无效重建）、骨架屏。
 * 模拟器的 renderCounts 精确记录每个 struct 的 build 次数 —— 调优效果可量化判定。
 */
export const HARMONY_BEST: Level[] = [
  {
    id: 'harmony-best-1',
    lang: 'harmony',
    module: 'best',
    order: 1,
    title: 'LazyForEach：长列表的数据源契约',
    difficulty: 4,
    xp: 30,
    goals: [
      '理解 LazyForEach 与普通 ForEach 的差别：按需加载、数据源驱动',
      '掌握 IDataSource 契约：totalCount / getData / registerListener',
      '学会实现 BasicDataSource 子类并通过数据源方法驱动 UI 更新',
    ],
    brief: `## 长列表为什么需要 LazyForEach

普通 \`ForEach\` 一次性渲染全部数据 —— 一百条记录就创建一百个组件，滑动时内存与渲染压力全在开局爆发。\`LazyForEach\` 只渲染**视口内**的项，滚动到哪加载到哪 —— 前提是数据必须实现 **IDataSource 契约**：\`totalCount()\` 报总数、\`getData(i)\` 按下标取数、\`registerListener\` 注册监听器、数据变化后 \`notifyReload()\` 通知刷新。

平台内置 \`BasicDataSource\` 基类（已实现契约与监听器队列），继承它只需关心业务方法。数据变更必须**走数据源方法**（如 \`pushItem\`），而不是直接改数组 —— 数据源是列表与数据之间唯一的真相通道。

类比：ForEach 是**自助餐**（一次全上），LazyForEach 是**点菜**（吃一道做一道），数据源是**传菜口** —— 绕过传菜口直接上菜，服务员（框架）毫不知情。

> 💡 数据源方法内部调用 notifyReload —— 这就是"数据变了，列表知道了"的唯一正道。`,
    task: `## 任务：用 LazyForEach 构建按需加载的长列表

1. \`class TaskSource extends BasicDataSource\`：私有 \`tasks: string[]\` 构造注入；实现 \`add(t: string)\` 方法调用 \`this.pushItem(t)\`（基类内部 notifyReload）；
2. \`@State data: TaskSource = new TaskSource(['任务 1', '任务 2', '任务 3'])\`；
3. \`List({ space: 8 })\` 内 \`LazyForEach(this.data, (item: string) => { ListItem { Text(item)... } }, (item: string) => item)\`；
4. \`Button('加载更多')\`：\`onClick\` 里 \`this.data.add(\\\`任务 \\\${this.data.totalCount() + 1}\\\`)\`。

**判题**：交互【点击「加载更多」两次】，第 4、5 条依次出现（数据源驱动）。`,
    starter: `class TaskSource extends BasicDataSource {
  private tasks: string[] = []

  constructor(init: string[]) {
    super()
    this.tasks = init
  }

  // TODO: add(t: string) —— 调用基类 pushItem 触发通知
}

@Entry
@Component
struct Index {
  // TODO: @State data: TaskSource = new TaskSource(['任务 1', '任务 2', '任务 3'])
  @State data: TaskSource = new TaskSource([])

  build() {
    Column({ space: 10 }) {
      Text('按需加载的任务列表').fontSize(18)
      List({ space: 8 }) {
        // TODO: LazyForEach(this.data, ...)
      }
      Button('加载更多').fontSize(14).onClick(() => {
        // TODO: this.data.add(...)
      })
    }
  }
}`,
    solution: `class TaskSource extends BasicDataSource {
  private tasks: string[] = []

  constructor(init: string[]) {
    super()
    this.tasks = init
  }

  add(t: string) {
    this.tasks.push(t)
    this.pushItem(t)
  }
}

@Entry
@Component
struct Index {
  @State data: TaskSource = new TaskSource(['任务 1', '任务 2', '任务 3'])

  build() {
    Column({ space: 10 }) {
      Text('按需加载的任务列表')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      List({ space: 8 }) {
        LazyForEach(this.data, (item: string) => {
          ListItem() {
            Text(item)
              .fontSize(15)
              .fontColor('#e2e8f0')
              .padding(10)
              .backgroundColor('#1e293b')
              .borderRadius(8)
          }
        }, (item: string) => item)
      }
      Button('加载更多')
        .fontSize(14)
        .onClick(() => {
          this.data.add(\`任务 \${this.data.totalCount() + 1}\`)
        })
    }
  }
}`,
    algo: {
      starters: {
        arkts: `class TaskSource extends BasicDataSource {
  private tasks: string[] = []

  constructor(init: string[]) {
    super()
    this.tasks = init
  }

  // TODO: add(t: string) —— 调用基类 pushItem 触发通知
}

@Entry
@Component
struct Index {
  // TODO: @State data: TaskSource = new TaskSource(['任务 1', '任务 2', '任务 3'])
  @State data: TaskSource = new TaskSource([])

  build() {
    Column({ space: 10 }) {
      Text('按需加载的任务列表').fontSize(18)
      List({ space: 8 }) {
        // TODO: LazyForEach(this.data, ...)
      }
      Button('加载更多').fontSize(14).onClick(() => {
        // TODO: this.data.add(...)
      })
    }
  }
}`,
      },
      solutions: {
        arkts: `class TaskSource extends BasicDataSource {
  private tasks: string[] = []

  constructor(init: string[]) {
    super()
    this.tasks = init
  }

  add(t: string) {
    this.tasks.push(t)
    this.pushItem(t)
  }
}

@Entry
@Component
struct Index {
  @State data: TaskSource = new TaskSource(['任务 1', '任务 2', '任务 3'])

  build() {
    Column({ space: 10 }) {
      Text('按需加载的任务列表')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      List({ space: 8 }) {
        LazyForEach(this.data, (item: string) => {
          ListItem() {
            Text(item)
              .fontSize(15)
              .fontColor('#e2e8f0')
              .padding(10)
              .backgroundColor('#1e293b')
              .borderRadius(8)
          }
        }, (item: string) => item)
      }
      Button('加载更多')
        .fontSize(14)
        .onClick(() => {
          this.data.add(\`任务 \${this.data.totalCount() + 1}\`)
        })
    }
  }
}`,
      },
    },
    hints: [
      'add 方法两行：this.tasks.push(t)（业务数组）+ this.pushItem(t)（基类通知）。',
      'LazyForEach 第一参数是数据源实例 this.data，不是数组。',
      '新任务名：`任务 ${this.data.totalCount() + 1}` —— totalCount 返回当前条数。',
    ],
    tests: [
      { name: '样例：加载两条', stdin: JSON.stringify([{ tap: '加载更多' }, { tap: '加载更多' }]), expected: "__root__\n  Column \"按需加载的任务列表加载更多\" (space=10)\n    Text \"按需加载的任务列表\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    List (space=8)\n    Button \"加载更多\" (fontSize=14)\n#renders Index=2\n#prefs {}" },
      { name: '检查：初始三条', stdin: '[]', expected: "__root__\n  Column \"按需加载的任务列表加载更多\" (space=10)\n    Text \"按需加载的任务列表\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    List (space=8)\n    Button \"加载更多\" (fontSize=14)\n#renders \n#prefs {}" },
      { name: '检查：加载一条', stdin: JSON.stringify([{ tap: '加载更多' }]), expected: "__root__\n  Column \"按需加载的任务列表加载更多\" (space=10)\n    Text \"按需加载的任务列表\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    List (space=8)\n    Button \"加载更多\" (fontSize=14)\n#renders Index=1\n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ tap: '加载更多' }, { tap: '加载更多' }]), expected: "__root__\n  Column \"按需加载的任务列表加载更多\" (space=10)\n    Text \"按需加载的任务列表\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    List (space=8)\n    Button \"加载更多\" (fontSize=14)\n#renders Index=2\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-best-2',
    lang: 'harmony',
    module: 'best',
    order: 2,
    title: '@Builder：把重复的 UI 抽成函数',
    difficulty: 3,
    xp: 25,
    goals: [
      '掌握 @Builder 方法：参数化的 UI 片段复用',
      '理解 @Builder 与自定义组件的取舍：轻量复用 vs 独立状态',
      '学会在统计卡片场景应用 Builder 消除重复',
    ],
    brief: `## @Builder：轻量级的 UI 函数

三张统计卡的布局一模一样，只有数字和颜色不同 —— 复制三遍？改一处忘两处。\`@Builder\` 方法把这段 UI 抽成**参数化的函数**：\`@Builder statCard(label: string, value: string) { ... }\`，调用处直接 \`statCard('专注', '4h')\` —— 与普通函数调用一样自然，但它返回的是组件树。

@Builder 与自定义组件的取舍：@Builder 是**同组件内的轻量片段**（无独立状态、无生命周期，开销极小）；需要独立状态/交互逻辑时才升级为 @Component。优先 @Builder，够用就好。

类比：@Builder 是**文档模板** —— 排版固定，填空即可；@Component 是**带电路的模块** —— 有自己的状态要管理时才用。

> 💡 Builder 参数里的值变化要靠外部状态驱动 —— Builder 本身不持有状态。`,
    task: `## 任务：用 @Builder 重构统计面板

1. 父组件 \`@State stats\` 三条：\`{ label: '专注', value: '4h' }\`、\`{ label: '任务', value: '6' }\`、\`{ label: '连击', value: '5 天' }\`；
2. 定义 \`@Builder statCard(label: string, value: string)\`：\`Column({ space: 4 })\` 内 \`Text(label)\`（fontSize 12、fontColor '#94a3b8'）+ \`Text(value)\`（fontSize 20、fontWeight Bold、fontColor '#e2e8f0'），外层 \`.backgroundColor('#1e293b')\`、\`.borderRadius(12)\`、\`.padding(14)\`；
3. \`Row\` 里循环调用三次 \`this.statCard(s.label, s.value)\`；
4. \`Button('切换数据集')\`：\`onClick\` 里把 stats 换成另一组值（专注 2h / 任务 3 / 连击 2 天）。

**判题**：交互【点击切换】，三张卡文本同时更新（@Builder 参数驱动）。`,
    starter: `@Entry
@Component
struct Index {
  @State stats: object[] = [
    { label: '专注', value: '4h' },
    { label: '任务', value: '6' },
    { label: '连击', value: '5 天' },
  ]

  // TODO: @Builder statCard(label: string, value: string) { Column {...} }

  build() {
    Row({ space: 10 }) {
      // TODO: 三次调用 this.statCard(...)
      Text('统计面板')
    }
  }
}`,
    solution: `@Entry
@Component
struct Index {
  @State stats: object[] = [
    { label: '专注', value: '4h' },
    { label: '任务', value: '6' },
    { label: '连击', value: '5 天' },
  ]

  @Builder
  statCard(label: string, value: string) {
    Column({ space: 4 }) {
      Text(label)
        .fontSize(12)
        .fontColor('#94a3b8')
      Text(value)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
    }
    .backgroundColor('#1e293b')
    .borderRadius(12)
    .padding(14)
  }

  build() {
    Column({ space: 12 }) {
      Row({ space: 10 }) {
        this.statCard(this.stats[0].label, this.stats[0].value)
        this.statCard(this.stats[1].label, this.stats[1].value)
        this.statCard(this.stats[2].label, this.stats[2].value)
      }
      Button('切换数据集')
        .fontSize(14)
        .onClick(() => {
          this.stats = [
            { label: '专注', value: '2h' },
            { label: '任务', value: '3' },
            { label: '连击', value: '2 天' },
          ]
        })
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Entry
@Component
struct Index {
  @State stats: object[] = [
    { label: '专注', value: '4h' },
    { label: '任务', value: '6' },
    { label: '连击', value: '5 天' },
  ]

  // TODO: @Builder statCard(label: string, value: string) { Column {...} }

  build() {
    Row({ space: 10 }) {
      // TODO: 三次调用 this.statCard(...)
      Text('统计面板')
    }
  }
}`,
      },
      solutions: {
        arkts: `@Entry
@Component
struct Index {
  @State stats: object[] = [
    { label: '专注', value: '4h' },
    { label: '任务', value: '6' },
    { label: '连击', value: '5 天' },
  ]

  @Builder
  statCard(label: string, value: string) {
    Column({ space: 4 }) {
      Text(label)
        .fontSize(12)
        .fontColor('#94a3b8')
      Text(value)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
    }
    .backgroundColor('#1e293b')
    .borderRadius(12)
    .padding(14)
  }

  build() {
    Column({ space: 12 }) {
      Row({ space: 10 }) {
        this.statCard(this.stats[0].label, this.stats[0].value)
        this.statCard(this.stats[1].label, this.stats[1].value)
        this.statCard(this.stats[2].label, this.stats[2].value)
      }
      Button('切换数据集')
        .fontSize(14)
        .onClick(() => {
          this.stats = [
            { label: '专注', value: '2h' },
            { label: '任务', value: '3' },
            { label: '连击', value: '2 天' },
          ]
        })
    }
  }
}`,
      },
    },
    hints: [
      'Builder 声明：@Builder statCard(label: string, value: string) { Column(...) }。',
      '调用：this.statCard(this.stats[0].label, this.stats[0].value) —— 与普通方法一致。',
      '切换数据集用整体替换：this.stats = [新数组] —— 触发重渲染。',
    ],
    tests: [
      { name: '样例：切换数据集', stdin: JSON.stringify([{ tap: '切换数据集' }]), expected: "__root__\n  Column \"专注2h任务3连击2 天切换数据集\" (space=12)\n    Row \"专注2h任务3连击2 天\" (space=10)\n      Column \"专注2h\" (space=4, backgroundColor='#1e293b', borderRadius=12, padding=14)\n        Text \"专注\" (fontSize=12, fontColor='#94a3b8')\n        Text \"2h\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n      Column \"任务3\" (space=4, backgroundColor='#1e293b', borderRadius=12, padding=14)\n        Text \"任务\" (fontSize=12, fontColor='#94a3b8')\n        Text \"3\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n      Column \"连击2 天\" (space=4, backgroundColor='#1e293b', borderRadius=12, padding=14)\n        Text \"连击\" (fontSize=12, fontColor='#94a3b8')\n        Text \"2 天\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n    Button \"切换数据集\" (fontSize=14)\n#renders Index=1\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"专注4h任务6连击5 天切换数据集\" (space=12)\n    Row \"专注4h任务6连击5 天\" (space=10)\n      Column \"专注4h\" (space=4, backgroundColor='#1e293b', borderRadius=12, padding=14)\n        Text \"专注\" (fontSize=12, fontColor='#94a3b8')\n        Text \"4h\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n      Column \"任务6\" (space=4, backgroundColor='#1e293b', borderRadius=12, padding=14)\n        Text \"任务\" (fontSize=12, fontColor='#94a3b8')\n        Text \"6\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n      Column \"连击5 天\" (space=4, backgroundColor='#1e293b', borderRadius=12, padding=14)\n        Text \"连击\" (fontSize=12, fontColor='#94a3b8')\n        Text \"5 天\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n    Button \"切换数据集\" (fontSize=14)\n#renders \n#prefs {}" },
      { name: '检查：切回再切', stdin: JSON.stringify([{ tap: '切换数据集' }, { tap: '切换数据集' }]), expected: "__root__\n  Column \"专注2h任务3连击2 天切换数据集\" (space=12)\n    Row \"专注2h任务3连击2 天\" (space=10)\n      Column \"专注2h\" (space=4, backgroundColor='#1e293b', borderRadius=12, padding=14)\n        Text \"专注\" (fontSize=12, fontColor='#94a3b8')\n        Text \"2h\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n      Column \"任务3\" (space=4, backgroundColor='#1e293b', borderRadius=12, padding=14)\n        Text \"任务\" (fontSize=12, fontColor='#94a3b8')\n        Text \"3\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n      Column \"连击2 天\" (space=4, backgroundColor='#1e293b', borderRadius=12, padding=14)\n        Text \"连击\" (fontSize=12, fontColor='#94a3b8')\n        Text \"2 天\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n    Button \"切换数据集\" (fontSize=14)\n#renders Index=2\n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ tap: '切换数据集' }]), expected: "__root__\n  Column \"专注2h任务3连击2 天切换数据集\" (space=12)\n    Row \"专注2h任务3连击2 天\" (space=10)\n      Column \"专注2h\" (space=4, backgroundColor='#1e293b', borderRadius=12, padding=14)\n        Text \"专注\" (fontSize=12, fontColor='#94a3b8')\n        Text \"2h\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n      Column \"任务3\" (space=4, backgroundColor='#1e293b', borderRadius=12, padding=14)\n        Text \"任务\" (fontSize=12, fontColor='#94a3b8')\n        Text \"3\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n      Column \"连击2 天\" (space=4, backgroundColor='#1e293b', borderRadius=12, padding=14)\n        Text \"连击\" (fontSize=12, fontColor='#94a3b8')\n        Text \"2 天\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n    Button \"切换数据集\" (fontSize=14)\n#renders Index=1\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-best-3',
    lang: 'harmony',
    module: 'best',
    order: 3,
    title: '状态下沉：让无关组件保持沉默',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解「无效重建」：无关组件因他人状态变化而重渲染',
      '掌握状态下沉：把高频变化的状态移入最小受益组件',
      '学会用 renderCounts 量化调优效果',
    ],
    brief: `## 一次按键，半个应用重渲染

性能调优第一课：**状态放得越高，受影响的界面越大**。把一个搜索输入框的状态放在父组件，父组件里"顺便"渲染的重统计面板也会跟着重建 —— 输入一个字母，整个面板重新计算。正解是**状态下沉**：把输入状态移到真正需要它的最小子组件里，其他组件对该状态一无所知。

模拟器为每个 struct 精确统计 **build 执行次数**（\`#renders\` 行）—— 调优前后一目了然：事故版输入一次，父 + 回显 + 统计面板全部 +1；调优后输入十次，统计面板纹丝不动（0 次）。

类比：公司群里@全体 —— 本来只需要通知一个人（下沉到私聊），结果全公司都在响铃（无效重建）。

> 💡 状态设计的黄金律：**把状态放在恰好需要它的最小范围内** —— 过高则扩散，过低则失联。`,
    task: `## 任务：把输入状态下沉到回显组件

1. \`struct InputEcho\`：\`@State text: string = ''\`（**状态放子组件内部**）；build 渲染 \`TextInput({ placeholder: '输入会实时回显', text: this.text })\` + \`.onChange((v: string) => { this.text = v })\` + \`Text(\\\`回显：\\\${this.text}\\\`)\`（fontSize 14）；
2. \`struct StatPanel\`：\`@Prop total: number = 0\`；渲染 \`Text(\\\`累计任务：\\\${this.total}\\\`)\`（fontSize 14）；
3. 父组件 \`@State total: number = 3\`：渲染 \`Text('任务面板')\`（fontSize 18）+ \`InputEcho()\` + \`StatPanel({ total: this.total })\` + \`Button('+1 任务')\`（onClick 里 this.total += 1）；
4. **不要**把 InputEcho 的输入状态放父组件 —— 输入只应重建 InputEcho。

**判题**：交互【输入「abc」】，\`#renders\` 中 InputEcho=1 且 StatPanel=0（事故版 StatPanel 会跟着重建）。`,
    starter: `@Entry
@Component
struct Index {
  // ⚠️ 事故设计：输入状态放在父组件 —— 任何输入都重建整页
  @State text: string = ''
  @State total: number = 3

  build() {
    Column({ space: 10 }) {
      Text('任务面板').fontSize(18)
      TextInput({ placeholder: '输入会实时回显', text: this.text })
        .onChange((v: string) => {
          this.text = v
        })
      Text(\`回显：\${this.text}\`).fontSize(14)
      Text(\`累计任务：\${this.total}\`).fontSize(14)
      Button('+1 任务').fontSize(14).onClick(() => {
        this.total += 1
      })
    }
  }
}`,
    solution: `@Component
struct InputEcho {
  @State text: string = ''

  build() {
    Column({ space: 6 }) {
      TextInput({ placeholder: '输入会实时回显', text: this.text })
        .onChange((v: string) => {
          this.text = v
        })
      Text(\`回显：\${this.text}\`)
        .fontSize(14)
        .fontColor('#e2e8f0')
    }
  }
}

@Component
struct StatPanel {
  @Prop total: number = 0

  build() {
    Text(\`累计任务：\${this.total}\`)
      .fontSize(14)
      .fontColor('#94a3b8')
  }
}

@Entry
@Component
struct Index {
  @State total: number = 3

  build() {
    Column({ space: 10 }) {
      Text('任务面板')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      InputEcho()
      StatPanel({ total: this.total })
      Button('+1 任务')
        .fontSize(14)
        .onClick(() => {
          this.total += 1
        })
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Entry
@Component
struct Index {
  // ⚠️ 事故设计：输入状态放在父组件 —— 任何输入都重建整页
  @State text: string = ''
  @State total: number = 3

  build() {
    Column({ space: 10 }) {
      Text('任务面板').fontSize(18)
      TextInput({ placeholder: '输入会实时回显', text: this.text })
        .onChange((v: string) => {
          this.text = v
        })
      Text(\`回显：\${this.text}\`).fontSize(14)
      Text(\`累计任务：\${this.total}\`).fontSize(14)
      Button('+1 任务').fontSize(14).onClick(() => {
        this.total += 1
      })
    }
  }
}`,
      },
      solutions: {
        arkts: `@Component
struct InputEcho {
  @State text: string = ''

  build() {
    Column({ space: 6 }) {
      TextInput({ placeholder: '输入会实时回显', text: this.text })
        .onChange((v: string) => {
          this.text = v
        })
      Text(\`回显：\${this.text}\`)
        .fontSize(14)
        .fontColor('#e2e8f0')
    }
  }
}

@Component
struct StatPanel {
  @Prop total: number = 0

  build() {
    Text(\`累计任务：\${this.total}\`)
      .fontSize(14)
      .fontColor('#94a3b8')
  }
}

@Entry
@Component
struct Index {
  @State total: number = 3

  build() {
    Column({ space: 10 }) {
      Text('任务面板')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      InputEcho()
      StatPanel({ total: this.total })
      Button('+1 任务')
        .fontSize(14)
        .onClick(() => {
          this.total += 1
        })
    }
  }
}`,
      },
    },
    hints: [
      '正解：InputEcho 内部 @State text —— 输入状态不经过父组件。',
      '判据：输入交互后 #renders 里 StatPanel=0（它对输入一无所知）。',
      '事故版的 #renders 里父组件与统计面板都会重建 —— 对比一目了然。',
    ],
    tests: [
      { name: '样例：输入不惊动统计', stdin: JSON.stringify([{ input: 'abc' }]), expected: "__root__\n  Column \"任务面板回显：累计任务：3+1 任务\" (space=10)\n    Text \"任务面板\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    InputEcho \"回显：\"\n      __root__\n        Column \"回显：\" (space=6)\n          TextInput (placeholder='输入会实时回显', text='')\n          Text \"回显：\" (fontSize=14, fontColor='#e2e8f0')\n    StatPanel \"累计任务：3\"\n      __root__\n        Text \"累计任务：3\" (fontSize=14, fontColor='#94a3b8')\n    Button \"+1 任务\" (fontSize=14)\n#renders Index=1, InputEcho=1, StatPanel=1\n#prefs {}" },
      { name: '检查：+1 任务', stdin: JSON.stringify([{ tap: '+1 任务' }]), expected: "__root__\n  Column \"任务面板回显：累计任务：4+1 任务\" (space=10)\n    Text \"任务面板\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    InputEcho \"回显：\"\n      __root__\n        Column \"回显：\" (space=6)\n          TextInput (placeholder='输入会实时回显', text='')\n          Text \"回显：\" (fontSize=14, fontColor='#e2e8f0')\n    StatPanel \"累计任务：4\"\n      __root__\n        Text \"累计任务：4\" (fontSize=14, fontColor='#94a3b8')\n    Button \"+1 任务\" (fontSize=14)\n#renders Index=1, InputEcho=1, StatPanel=1\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"任务面板回显：累计任务：3+1 任务\" (space=10)\n    Text \"任务面板\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    InputEcho \"回显：\"\n      __root__\n        Column \"回显：\" (space=6)\n          TextInput (placeholder='输入会实时回显', text='')\n          Text \"回显：\" (fontSize=14, fontColor='#e2e8f0')\n    StatPanel \"累计任务：3\"\n      __root__\n        Text \"累计任务：3\" (fontSize=14, fontColor='#94a3b8')\n    Button \"+1 任务\" (fontSize=14)\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ input: 'abc' }]), expected: "__root__\n  Column \"任务面板回显：累计任务：3+1 任务\" (space=10)\n    Text \"任务面板\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    InputEcho \"回显：\"\n      __root__\n        Column \"回显：\" (space=6)\n          TextInput (placeholder='输入会实时回显', text='')\n          Text \"回显：\" (fontSize=14, fontColor='#e2e8f0')\n    StatPanel \"累计任务：3\"\n      __root__\n        Text \"累计任务：3\" (fontSize=14, fontColor='#94a3b8')\n    Button \"+1 任务\" (fontSize=14)\n#renders Index=1, InputEcho=1, StatPanel=1\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-best-4',
    lang: 'harmony',
    module: 'best',
    order: 4,
    title: '骨架屏与异步加载：别让用户盯着白屏',
    difficulty: 3,
    xp: 25,
    goals: [
      '掌握 loading 状态 + 条件渲染构成的骨架屏模式',
      '学会用 http 模拟数据加载并在回调中更新状态',
      '理解异步回调中的状态更新时机（this 绑定）',
    ],
    brief: `## 白屏三秒钟，用户就走了

异步加载的界面有三个阶段：**加载中**（骨架占位）、**加载完成**（数据渲染）、**加载失败**（错误提示）。用 \`@State loading\` 驱动条件渲染：加载时显示骨架占位，回调到达后置 \`loading = false\` 并填充数据 —— 用户感知的是"应用在努力工作"而不是"应用死机了"。

鸿蒙的 \`http.createHttp().request(url, options, callback)\` 是回调风格：回调里更新 @State 要注意 **this 指向** —— 用箭头函数捕获组件 this（模拟器中回调由运行时调用，this 绑定与真实框架一致）。

类比：餐厅先上**小菜**（骨架）—— 让客人知道厨房在干活；主菜（数据）好了再撤。空桌上干等是最差体验。

> 💡 本平台模拟器用 mock 数据演示网络加载（真实设备走 @kit.NetworkKit），回调时序与真实一致。`,
    task: `## 任务：给干货列表加骨架屏

1. \`@State loading: boolean = true\`、\`@State items: string[] = []\`；
2. \`aboutToAppear()\` 里发起模拟请求：\`http.createHttp().request('https://mock.zhiquest.dev/tips', {}, (err, data) => { ... })\` —— 回调里 \`this.loading = false\`、\`this.items = JSON.parse(data.result)\`；
3. \`if (this.loading)\` 渲染骨架 \`Text('▓▓▓ 加载中…')\`（fontColor '#64748b'）；\`else\` 渲染 \`ForEach\` 数据项（fontSize 15）；
4. runtime 的 httpMock 已注入 \`tips\` 关键词的模拟数据：['HiLog 用好分段标签', 'LazyForEach 按需加载', '状态最小化原则']。

**判题**：初始渲染即加载完成态（模拟回调同步到达）—— 骨架消失、三条干货出现。`,
    starter: `@Entry
@Component
struct Index {
  @State loading: boolean = true
  @State items: string[] = []

  aboutToAppear() {
    // TODO: http.createHttp().request(...) —— 回调里 loading = false、items 赋值
  }

  build() {
    Column({ space: 10 }) {
      // TODO: if (this.loading) 骨架 else ForEach
      Text('干货列表').fontSize(18)
    }
  }
}`,
    solution: `@Entry
@Component
struct Index {
  @State loading: boolean = true
  @State items: string[] = []

  aboutToAppear() {
    http.createHttp().request('https://mock.zhiquest.dev/tips', {}, (err, data) => {
      if (err) return
      this.loading = false
      this.items = JSON.parse(data.result)
    })
  }

  build() {
    Column({ space: 10 }) {
      Text('干货列表')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      if (this.loading) {
        Text('▓▓▓ 加载中…')
          .fontSize(14)
          .fontColor('#64748b')
      } else {
        ForEach(this.items, (item: string) => {
          Text(item)
            .fontSize(15)
            .fontColor('#e2e8f0')
        }, (item: string) => item)
      }
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Entry
@Component
struct Index {
  @State loading: boolean = true
  @State items: string[] = []

  aboutToAppear() {
    // TODO: http.createHttp().request(...) —— 回调里 loading = false、items 赋值
  }

  build() {
    Column({ space: 10 }) {
      // TODO: if (this.loading) 骨架 else ForEach
      Text('干货列表').fontSize(18)
    }
  }
}`,
      },
      solutions: {
        arkts: `@Entry
@Component
struct Index {
  @State loading: boolean = true
  @State items: string[] = []

  aboutToAppear() {
    http.createHttp().request('https://mock.zhiquest.dev/tips', {}, (err, data) => {
      if (err) return
      this.loading = false
      this.items = JSON.parse(data.result)
    })
  }

  build() {
    Column({ space: 10 }) {
      Text('干货列表')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      if (this.loading) {
        Text('▓▓▓ 加载中…')
          .fontSize(14)
          .fontColor('#64748b')
      } else {
        ForEach(this.items, (item: string) => {
          Text(item)
            .fontSize(15)
            .fontColor('#e2e8f0')
        }, (item: string) => item)
      }
    }
  }
}`,
      },
    },
    hints: [
      '回调签名：(err, data) => { ... } —— err 非空直接 return，data.result 是 JSON 字符串。',
      'JSON.parse(data.result) 解析为数组后整体赋给 this.items（不可变更新）。',
      '模拟数据已在 runtime 的 httpMock 中配置，key 为 tips。',
    ],
    tests: [
      { name: '样例：加载完成态', stdin: '[]', expected: "__root__\n  Column \"干货列表HiLog 用好分段标签LazyForEach 按需加载状态最小化原则\" (space=10)\n    Text \"干货列表\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"HiLog 用好分段标签\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"LazyForEach 按需加载\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"状态最小化原则\" (fontSize=15, fontColor='#e2e8f0')\n#renders \n#prefs {}" },
      { name: '检查：数据渲染', stdin: '[]', expected: "__root__\n  Column \"干货列表HiLog 用好分段标签LazyForEach 按需加载状态最小化原则\" (space=10)\n    Text \"干货列表\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"HiLog 用好分段标签\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"LazyForEach 按需加载\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"状态最小化原则\" (fontSize=15, fontColor='#e2e8f0')\n#renders \n#prefs {}" },
      { name: '检查：骨架已消失', stdin: '[]', expected: "__root__\n  Column \"干货列表HiLog 用好分段标签LazyForEach 按需加载状态最小化原则\" (space=10)\n    Text \"干货列表\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"HiLog 用好分段标签\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"LazyForEach 按需加载\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"状态最小化原则\" (fontSize=15, fontColor='#e2e8f0')\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: '[]', expected: "__root__\n  Column \"干货列表HiLog 用好分段标签LazyForEach 按需加载状态最小化原则\" (space=10)\n    Text \"干货列表\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"HiLog 用好分段标签\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"LazyForEach 按需加载\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"状态最小化原则\" (fontSize=15, fontColor='#e2e8f0')\n#renders \n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({
      kind: 'arkts',
      pages: { 'pages/Index': 'Index' },
      entry: 'pages/Index',
      httpMock: { 'mock.zhiquest.dev/tips': { status: 200, data: ['HiLog 用好分段标签', 'LazyForEach 按需加载', '状态最小化原则'] } },
    }),
  },
];
