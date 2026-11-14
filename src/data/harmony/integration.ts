import type { Level } from '@/types';

/**
 * 鸿蒙应用开发 · 第六章：综合实战「口袋记账」（integration，4 关）。
 * 完整小应用：数据模型 + 表单录入 + 列表删除 + 统计汇总 + 持久化恢复，
 * 综合运用前五章全部知识；#prefs 审计行验证持久化真实落盘。
 */
export const HARMONY_INTEGRATION: Level[] = [
  {
    id: 'harmony-integration-1',
    lang: 'harmony',
    module: 'integration',
    order: 1,
    title: '口袋记账：数据模型与记一笔',
    difficulty: 4,
    xp: 35,
    goals: [
      '用 class 定义领域模型（Bill）并在 @State 数组中管理',
      '实现分类单选（高亮模式）与表单校验',
      '综合运用不可变更新完成「记一笔」全流程',
    ],
    brief: `## 从 Demo 到应用：领域模型登场

真实应用的第一步是**领域建模**：记账应用的核心是 \`Bill\` —— 标题、金额、分类、唯一 id。用 \`class Bill\` 承载（constructor 统一初始化），\`@State bills: Bill[]\` 管理集合。

「记一笔」表单三件套：标题输入框、金额输入框、分类单选（三枚按钮高亮切换，\`@State category\` 记录当前选择）。保存时校验：标题与金额都有效才入账 —— **不可变追加** \`this.bills = [...this.bills, new Bill(...)]\`，成功后清空草稿。id 用 \`Date.now()\` 保证唯一。

这一关做完，你已经拥有一个能真实记账的应用雏形 —— 后面三关给它装上列表、统计与持久化。

> 💡 金额解析用 \`Number(this.draftAmount)\` —— 记得校验 \`> 0\`，别让 NaN 混进账本。`,
    task: `## 任务：实现记账应用的「记一笔」

1. \`class Bill\`：\`id: number\`、\`title: string\`、\`amount: number\`、\`category: string\`（constructor 四参初始化）；
2. 状态：\`@State bills: Bill[] = []\`、\`@State draftTitle: string = ''\`、\`@State draftAmount: string = ''\`、\`@State category: string = '餐饮'\`；
3. 分类三按钮（餐饮/交通/购物）：\`backgroundColor\` 随 \`this.category === '餐饮'\` 等高亮（选中 '#0a59f7' 白字，未选 '#1e293b' 灰字），onClick 设置 category；
4. \`TextInput\` ×2（标题 draftTitle / 金额 draftAmount，onChange 同步）；
5. \`Button('保存')\`：\`onClick\` 里校验 \`draftTitle.length > 0\` 且 \`Number(draftAmount) > 0\`，通过后 \`this.bills = [...this.bills, new Bill(Date.now(), this.draftTitle, Number(this.draftAmount), this.category)]\` 并清空两个草稿。

**判题**：交互【输入「早餐」→ 输入「12」→ 点「餐饮」→ 保存】，校验账本与表单清空。`,
    starter: `class Bill {
  id: number
  title: string
  amount: number
  category: string
  constructor(id: number, title: string, amount: number, category: string) {
    this.id = id
    this.title = title
    this.amount = amount
    this.category = category
  }
}

@Entry
@Component
struct Index {
  @State bills: Bill[] = []
  @State draftTitle: string = ''
  @State draftAmount: string = ''
  @State category: string = '餐饮'

  build() {
    Column({ space: 10 }) {
      Text('口袋记账 · 记一笔').fontSize(18)
      // TODO 1: 分类三按钮高亮切换
      // TODO 2: 标题/金额两个 TextInput
      // TODO 3: 保存按钮 —— 校验 + 不可变追加 + 清空
      ForEach(this.bills, (b: Bill) => {
        Text(\`\${b.title} ¥\${b.amount}\`)
      }, (b: Bill) => b.id.toString())
    }
  }
}`,
    solution: `class Bill {
  id: number
  title: string
  amount: number
  category: string
  constructor(id: number, title: string, amount: number, category: string) {
    this.id = id
    this.title = title
    this.amount = amount
    this.category = category
  }
}

@Entry
@Component
struct Index {
  @State bills: Bill[] = []
  @State draftTitle: string = ''
  @State draftAmount: string = ''
  @State category: string = '餐饮'

  build() {
    Column({ space: 10 }) {
      Text('口袋记账 · 记一笔')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      Row({ space: 8 }) {
        Button('餐饮')
          .fontSize(12)
          .backgroundColor(this.category === '餐饮' ? '#0a59f7' : '#1e293b')
          .fontColor(this.category === '餐饮' ? '#ffffff' : '#94a3b8')
          .onClick(() => {
            this.category = '餐饮'
          })
        Button('交通')
          .fontSize(12)
          .backgroundColor(this.category === '交通' ? '#0a59f7' : '#1e293b')
          .fontColor(this.category === '交通' ? '#ffffff' : '#94a3b8')
          .onClick(() => {
            this.category = '交通'
          })
        Button('购物')
          .fontSize(12)
          .backgroundColor(this.category === '购物' ? '#0a59f7' : '#1e293b')
          .fontColor(this.category === '购物' ? '#ffffff' : '#94a3b8')
          .onClick(() => {
            this.category = '购物'
          })
      }
      TextInput({ placeholder: '标题', text: this.draftTitle })
        .onChange((v: string) => {
          this.draftTitle = v
        })
      TextInput({ placeholder: '金额', text: this.draftAmount })
        .onChange((v: string) => {
          this.draftAmount = v
        })
      Button('保存')
        .fontSize(14)
        .onClick(() => {
          if (this.draftTitle.length > 0 && Number(this.draftAmount) > 0) {
            this.bills = [...this.bills, new Bill(Date.now(), this.draftTitle, Number(this.draftAmount), this.category)]
            this.draftTitle = ''
            this.draftAmount = ''
          }
        })
      ForEach(this.bills, (b: Bill) => {
        Text(\`\${b.title} ¥\${b.amount}\`)
          .fontSize(14)
          .fontColor('#e2e8f0')
      }, (b: Bill) => b.id.toString())
    }
  }
}`,
    algo: {
      starters: {
        arkts: `class Bill {
  id: number
  title: string
  amount: number
  category: string
  constructor(id: number, title: string, amount: number, category: string) {
    this.id = id
    this.title = title
    this.amount = amount
    this.category = category
  }
}

@Entry
@Component
struct Index {
  @State bills: Bill[] = []
  @State draftTitle: string = ''
  @State draftAmount: string = ''
  @State category: string = '餐饮'

  build() {
    Column({ space: 10 }) {
      Text('口袋记账 · 记一笔').fontSize(18)
      // TODO 1: 分类三按钮高亮切换
      // TODO 2: 标题/金额两个 TextInput
      // TODO 3: 保存按钮 —— 校验 + 不可变追加 + 清空
      ForEach(this.bills, (b: Bill) => {
        Text(\`\${b.title} ¥\${b.amount}\`)
      }, (b: Bill) => b.id.toString())
    }
  }
}`,
      },
      solutions: {
        arkts: `class Bill {
  id: number
  title: string
  amount: number
  category: string
  constructor(id: number, title: string, amount: number, category: string) {
    this.id = id
    this.title = title
    this.amount = amount
    this.category = category
  }
}

@Entry
@Component
struct Index {
  @State bills: Bill[] = []
  @State draftTitle: string = ''
  @State draftAmount: string = ''
  @State category: string = '餐饮'

  build() {
    Column({ space: 10 }) {
      Text('口袋记账 · 记一笔')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      Row({ space: 8 }) {
        Button('餐饮')
          .fontSize(12)
          .backgroundColor(this.category === '餐饮' ? '#0a59f7' : '#1e293b')
          .fontColor(this.category === '餐饮' ? '#ffffff' : '#94a3b8')
          .onClick(() => {
            this.category = '餐饮'
          })
        Button('交通')
          .fontSize(12)
          .backgroundColor(this.category === '交通' ? '#0a59f7' : '#1e293b')
          .fontColor(this.category === '交通' ? '#ffffff' : '#94a3b8')
          .onClick(() => {
            this.category = '交通'
          })
        Button('购物')
          .fontSize(12)
          .backgroundColor(this.category === '购物' ? '#0a59f7' : '#1e293b')
          .fontColor(this.category === '购物' ? '#ffffff' : '#94a3b8')
          .onClick(() => {
            this.category = '购物'
          })
      }
      TextInput({ placeholder: '标题', text: this.draftTitle })
        .onChange((v: string) => {
          this.draftTitle = v
        })
      TextInput({ placeholder: '金额', text: this.draftAmount })
        .onChange((v: string) => {
          this.draftAmount = v
        })
      Button('保存')
        .fontSize(14)
        .onClick(() => {
          if (this.draftTitle.length > 0 && Number(this.draftAmount) > 0) {
            this.bills = [...this.bills, new Bill(Date.now(), this.draftTitle, Number(this.draftAmount), this.category)]
            this.draftTitle = ''
            this.draftAmount = ''
          }
        })
      ForEach(this.bills, (b: Bill) => {
        Text(\`\${b.title} ¥\${b.amount}\`)
          .fontSize(14)
          .fontColor('#e2e8f0')
      }, (b: Bill) => b.id.toString())
    }
  }
}`,
      },
    },
    hints: [
      '分类高亮：backgroundColor(this.category === \'餐饮\' ? \'#0a59f7\' : \'#1e293b\') —— 每个按钮判断自己的名字。',
      '保存校验：this.draftTitle.length > 0 && Number(this.draftAmount) > 0 —— 双条件。',
      '入账：this.bills = [...this.bills, new Bill(Date.now(), this.draftTitle, Number(this.draftAmount), this.category)]。',
    ],
    tests: [
      { name: '样例：记一笔早餐', stdin: JSON.stringify([{ input: '早餐' }, { input: '12' }, { tap: '餐饮' }, { tap: '保存' }]), expected: "__root__\n  Column \"口袋记账 · 记一笔餐饮交通购物保存\" (space=10)\n    Text \"口袋记账 · 记一笔\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Row \"餐饮交通购物\" (space=8)\n      Button \"餐饮\" (fontSize=12, backgroundColor='#0a59f7', fontColor='#ffffff')\n      Button \"交通\" (fontSize=12, backgroundColor='#1e293b', fontColor='#94a3b8')\n      Button \"购物\" (fontSize=12, backgroundColor='#1e293b', fontColor='#94a3b8')\n    TextInput (placeholder='标题', text='12')\n    TextInput (placeholder='金额', text='')\n    Button \"保存\" (fontSize=14)\n#renders Index=4\n#prefs {}" },
      { name: '检查：金额非法不入账', stdin: JSON.stringify([{ input: '早餐' }, { input: 'abc' }, { tap: '保存' }]), expected: "__root__\n  Column \"口袋记账 · 记一笔餐饮交通购物保存\" (space=10)\n    Text \"口袋记账 · 记一笔\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Row \"餐饮交通购物\" (space=8)\n      Button \"餐饮\" (fontSize=12, backgroundColor='#0a59f7', fontColor='#ffffff')\n      Button \"交通\" (fontSize=12, backgroundColor='#1e293b', fontColor='#94a3b8')\n      Button \"购物\" (fontSize=12, backgroundColor='#1e293b', fontColor='#94a3b8')\n    TextInput (placeholder='标题', text='abc')\n    TextInput (placeholder='金额', text='')\n    Button \"保存\" (fontSize=14)\n#renders Index=3\n#prefs {}" },
      { name: '检查：连续记两笔', stdin: JSON.stringify([{ input: '早餐' }, { input: '12' }, { tap: '保存' }, { input: '地铁' }, { input: '3' }, { tap: '交通' }, { tap: '保存' }]), expected: "__root__\n  Column \"口袋记账 · 记一笔餐饮交通购物保存\" (space=10)\n    Text \"口袋记账 · 记一笔\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Row \"餐饮交通购物\" (space=8)\n      Button \"餐饮\" (fontSize=12, backgroundColor='#1e293b', fontColor='#94a3b8')\n      Button \"交通\" (fontSize=12, backgroundColor='#0a59f7', fontColor='#ffffff')\n      Button \"购物\" (fontSize=12, backgroundColor='#1e293b', fontColor='#94a3b8')\n    TextInput (placeholder='标题', text='3')\n    TextInput (placeholder='金额', text='')\n    Button \"保存\" (fontSize=14)\n#renders Index=7\n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ input: '早餐' }, { input: '12' }, { tap: '餐饮' }, { tap: '保存' }]), expected: "__root__\n  Column \"口袋记账 · 记一笔餐饮交通购物保存\" (space=10)\n    Text \"口袋记账 · 记一笔\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Row \"餐饮交通购物\" (space=8)\n      Button \"餐饮\" (fontSize=12, backgroundColor='#0a59f7', fontColor='#ffffff')\n      Button \"交通\" (fontSize=12, backgroundColor='#1e293b', fontColor='#94a3b8')\n      Button \"购物\" (fontSize=12, backgroundColor='#1e293b', fontColor='#94a3b8')\n    TextInput (placeholder='标题', text='12')\n    TextInput (placeholder='金额', text='')\n    Button \"保存\" (fontSize=14)\n#renders Index=4\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-integration-2',
    lang: 'harmony',
    module: 'integration',
    order: 2,
    title: '账单列表：删除与空状态',
    difficulty: 4,
    xp: 30,
    goals: [
      '按 id 不可变删除（filter）并保持列表稳定',
      '用 if 条件渲染实现空状态引导',
      '掌握「数据为空 → 界面换装」的完整闭环',
    ],
    brief: `## 空状态：被忽视的体验细节

列表应用的两条命脉：**删除必须稳定**（按 id filter，绝不动别人），**空了要说人话**（"暂无账单，去记一笔吧"而不是一片空白）。删除沿用 id 寻址：\`this.bills = this.bills.filter(b => b.id !== id)\`；空状态用 \`if (this.bills.length === 0)\` 条件渲染引导文案。

组合起来就是完整的列表生命周期：有数据 → 渲染列表；删光了 → 引导去新增。用户永远不会面对"不知道该干什么"的界面 —— 这是产品级的细节自觉。

类比：图书馆**还书与荐书** —— 书架空了不放"此架已空"的冷冰冰告示，而是放一张"欢迎借阅新书"的引导牌。

> 💡 删除按钮的文本带上账单名（\`'删除 ' + b.title\`），交互目标明确，也方便测试定位。`,
    task: `## 任务：账单列表与空状态闭环

1. \`@State bills\` 初始两条：早餐 12 / 地铁 3（constructor 注入固定 id 1、2）；
2. \`ForEach\` 渲染 \`Row\`：\`Text(\\\`\${b.title} ¥\\\${b.amount}\\\`)\`（fontSize 14）+ \`Button('删除 ' + b.title)\`（fontSize 11、fontColor '#fca5a5'、onClick 按 id filter）；
3. \`if (this.bills.length === 0)\` 渲染 \`Text('暂无账单，去记一笔吧 ✏️')\`（fontSize 14、fontColor '#94a3b8'）与 \`Text('──────────')\`；
4. 删除全部账单后，空状态文案与分隔线必须出现。

**判题**：交互【删除两条】，验证空状态闭环（solution 删光后出现引导；渲染树全程无错乱）。`,
    starter: `class Bill {
  id: number
  title: string
  amount: number
  category: string
  constructor(id: number, title: string, amount: number, category: string) {
    this.id = id
    this.title = title
    this.amount = amount
    this.category = category
  }
}

@Entry
@Component
struct Index {
  @State bills: Bill[] = [
    new Bill(1, '早餐', 12, '餐饮'),
    new Bill(2, '地铁', 3, '交通'),
  ]

  build() {
    Column({ space: 10 }) {
      Text('账单列表').fontSize(18)
      // TODO: ForEach + 按 id 删除 + 空状态渲染
      ForEach(this.bills, (b: Bill) => {
        Text(\`\${b.title} ¥\${b.amount}\`)
      }, (b: Bill) => b.id.toString())
    }
  }
}`,
    solution: `class Bill {
  id: number
  title: string
  amount: number
  category: string
  constructor(id: number, title: string, amount: number, category: string) {
    this.id = id
    this.title = title
    this.amount = amount
    this.category = category
  }
}

@Entry
@Component
struct Index {
  @State bills: Bill[] = [
    new Bill(1, '早餐', 12, '餐饮'),
    new Bill(2, '地铁', 3, '交通'),
  ]

  build() {
    Column({ space: 10 }) {
      Text('账单列表')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      ForEach(this.bills, (b: Bill) => {
        Row({ space: 8 }) {
          Text(\`\${b.title} ¥\${b.amount}\`)
            .fontSize(14)
            .fontColor('#e2e8f0')
          Button('删除 ' + b.title)
            .fontSize(11)
            .fontColor('#fca5a5')
            .onClick(() => {
              this.bills = this.bills.filter((x: Bill) => x.id !== b.id)
            })
        }
      }, (b: Bill) => b.id.toString())
      if (this.bills.length === 0) {
        Text('暂无账单，去记一笔吧 ✏️')
          .fontSize(14)
          .fontColor('#94a3b8')
        Text('──────────')
          .fontSize(12)
          .fontColor('#334155')
      }
    }
  }
}`,
    algo: {
      starters: {
        arkts: `class Bill {
  id: number
  title: string
  amount: number
  category: string
  constructor(id: number, title: string, amount: number, category: string) {
    this.id = id
    this.title = title
    this.amount = amount
    this.category = category
  }
}

@Entry
@Component
struct Index {
  @State bills: Bill[] = [
    new Bill(1, '早餐', 12, '餐饮'),
    new Bill(2, '地铁', 3, '交通'),
  ]

  build() {
    Column({ space: 10 }) {
      Text('账单列表').fontSize(18)
      // TODO: ForEach + 按 id 删除 + 空状态渲染
      ForEach(this.bills, (b: Bill) => {
        Text(\`\${b.title} ¥\${b.amount}\`)
      }, (b: Bill) => b.id.toString())
    }
  }
}`,
      },
      solutions: {
        arkts: `class Bill {
  id: number
  title: string
  amount: number
  category: string
  constructor(id: number, title: string, amount: number, category: string) {
    this.id = id
    this.title = title
    this.amount = amount
    this.category = category
  }
}

@Entry
@Component
struct Index {
  @State bills: Bill[] = [
    new Bill(1, '早餐', 12, '餐饮'),
    new Bill(2, '地铁', 3, '交通'),
  ]

  build() {
    Column({ space: 10 }) {
      Text('账单列表')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      ForEach(this.bills, (b: Bill) => {
        Row({ space: 8 }) {
          Text(\`\${b.title} ¥\${b.amount}\`)
            .fontSize(14)
            .fontColor('#e2e8f0')
          Button('删除 ' + b.title)
            .fontSize(11)
            .fontColor('#fca5a5')
            .onClick(() => {
              this.bills = this.bills.filter((x: Bill) => x.id !== b.id)
            })
        }
      }, (b: Bill) => b.id.toString())
      if (this.bills.length === 0) {
        Text('暂无账单，去记一笔吧 ✏️')
          .fontSize(14)
          .fontColor('#94a3b8')
        Text('──────────')
          .fontSize(12)
          .fontColor('#334155')
      }
    }
  }
}`,
      },
    },
    hints: [
      '删除按 id：this.bills = this.bills.filter((x: Bill) => x.id !== b.id)。',
      '空状态：if (this.bills.length === 0) { 引导文案 } —— 条件渲染直接写进 build。',
      '删除按钮文本带账单名：\'删除 \' + b.title —— 用户与测试都能精确定位。',
    ],
    tests: [
      { name: '样例：删光后空状态', stdin: JSON.stringify([{ tap: '删除 早餐' }, { tap: '删除 地铁' }]), expected: "__root__\n  Column \"账单列表暂无账单，去记一笔吧 ✏️──────────\" (space=10)\n    Text \"账单列表\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"暂无账单，去记一笔吧 ✏️\" (fontSize=14, fontColor='#94a3b8')\n    Text \"──────────\" (fontSize=12, fontColor='#334155')\n#renders Index=2\n#prefs {}" },
      { name: '检查：只删一条', stdin: JSON.stringify([{ tap: '删除 早餐' }]), expected: "__root__\n  Column \"账单列表地铁 ¥3删除 地铁\" (space=10)\n    Text \"账单列表\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Row \"地铁 ¥3删除 地铁\" (space=8)\n      Text \"地铁 ¥3\" (fontSize=14, fontColor='#e2e8f0')\n      Button \"删除 地铁\" (fontSize=11, fontColor='#fca5a5')\n#renders Index=1\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"账单列表早餐 ¥12删除 早餐地铁 ¥3删除 地铁\" (space=10)\n    Text \"账单列表\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Row \"早餐 ¥12删除 早餐\" (space=8)\n      Text \"早餐 ¥12\" (fontSize=14, fontColor='#e2e8f0')\n      Button \"删除 早餐\" (fontSize=11, fontColor='#fca5a5')\n    Row \"地铁 ¥3删除 地铁\" (space=8)\n      Text \"地铁 ¥3\" (fontSize=14, fontColor='#e2e8f0')\n      Button \"删除 地铁\" (fontSize=11, fontColor='#fca5a5')\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ tap: '删除 地铁' }]), expected: "__root__\n  Column \"账单列表早餐 ¥12删除 早餐\" (space=10)\n    Text \"账单列表\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Row \"早餐 ¥12删除 早餐\" (space=8)\n      Text \"早餐 ¥12\" (fontSize=14, fontColor='#e2e8f0')\n      Button \"删除 早餐\" (fontSize=11, fontColor='#fca5a5')\n#renders Index=1\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-integration-3',
    lang: 'harmony',
    module: 'integration',
    order: 3,
    title: '统计汇总：reduce 与金额格式化',
    difficulty: 4,
    xp: 35,
    goals: [
      '用 reduce 从账单数组派生总支出与分类小计',
      '掌握 struct 方法（format）在模板串中的调用',
      '理解派生数据原则在真实应用中的落地',
    ],
    brief: `## 统计是派生的，不是存储的

账单列表有了，"本月共花了多少？餐饮占多少？" —— 这些统计数字**全部从 bills 派生**：\`this.bills.reduce((s, b) => s + b.amount, 0)\` 算总额，按 category 分组累加算小计。派生数据不占 @State —— 源数据变，统计自动变，永远不会对不上账。

金额展示讲究格式：\`¥12.00\` —— 用 struct 方法 \`format(n: number): string\` 封装 \`'¥' + n.toFixed(2)\`，模板串里直接 \`this.format(total)\` 调用。格式化逻辑只写一处，改汇率/改位数不用全应用翻找。

类比：统计是**仪表盘指针** —— 指针读数来自油箱（bills），你只需要保证油箱是对的，指针永远自己走。

> 💡 toFixed 返回字符串 —— 拼接展示无碍；参与计算请用原始 number。`,
    task: `## 任务：给账本装上统计仪表盘

1. \`@State bills\` 初始四条：早餐 12/餐饮、地铁 3/交通、咖啡 18/餐饮、打车 9/交通；
2. struct 方法 \`total(): number\`：\`return this.bills.reduce((s: number, b: Bill) => s + b.amount, 0)\`；方法 \`format(n: number): string\`：\`return '¥' + n.toFixed(2)\`；
3. 渲染 \`Text(\\\`总支出：\\\${this.format(this.total())}\\\`)\`（fontSize 18、fontWeight Bold）；
4. \`ForEach\` 渲染分类小计：\`@State categories: string[] = ['餐饮', '交通']\`，每项 \`Text(\\\`\\\${c}：\\\${this.format(this.sumBy(c))}\\\`)\`（fontSize 14）—— \`sumBy(c: string): number\` 方法 filter+reduce 实现；
5. \`format\` 与 \`sumBy\` 的 this 调用（模拟器已支持 struct 方法在模板串中调用）。

**判题**：比对统计文本（总额 ¥42.00、餐饮 ¥30.00、交通 ¥12.00）。`,
    starter: `class Bill {
  id: number
  title: string
  amount: number
  category: string
  constructor(id: number, title: string, amount: number, category: string) {
    this.id = id
    this.title = title
    this.amount = amount
    this.category = category
  }
}

@Entry
@Component
struct Index {
  @State bills: Bill[] = [
    new Bill(1, '早餐', 12, '餐饮'),
    new Bill(2, '地铁', 3, '交通'),
    new Bill(3, '咖啡', 18, '餐饮'),
    new Bill(4, '打车', 9, '交通'),
  ]
  @State categories: string[] = ['餐饮', '交通']

  // TODO 1: total() —— reduce 求总额
  // TODO 2: format(n: number) —— '¥' + n.toFixed(2)
  // TODO 3: sumBy(c: string) —— filter + reduce 分类小计

  build() {
    Column({ space: 10 }) {
      Text('支出统计').fontSize(18)
      Text('总支出：待实现').fontSize(18)
      ForEach(this.categories, (c: string) => {
        Text(c)
      }, (c: string) => c)
    }
  }
}`,
    solution: `class Bill {
  id: number
  title: string
  amount: number
  category: string
  constructor(id: number, title: string, amount: number, category: string) {
    this.id = id
    this.title = title
    this.amount = amount
    this.category = category
  }
}

@Entry
@Component
struct Index {
  @State bills: Bill[] = [
    new Bill(1, '早餐', 12, '餐饮'),
    new Bill(2, '地铁', 3, '交通'),
    new Bill(3, '咖啡', 18, '餐饮'),
    new Bill(4, '打车', 9, '交通'),
  ]
  @State categories: string[] = ['餐饮', '交通']

  total(): number {
    return this.bills.reduce((s: number, b: Bill) => s + b.amount, 0)
  }

  format(n: number): string {
    return '¥' + n.toFixed(2)
  }

  sumBy(c: string): number {
    return this.bills.filter((b: Bill) => b.category === c).reduce((s: number, b: Bill) => s + b.amount, 0)
  }

  build() {
    Column({ space: 10 }) {
      Text('支出统计')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      Text(\`总支出：\${this.format(this.total())}\`)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#22c55e')
      ForEach(this.categories, (c: string) => {
        Text(\`\${c}：\${this.format(this.sumBy(c))}\`)
          .fontSize(14)
          .fontColor('#e2e8f0')
      }, (c: string) => c)
    }
  }
}`,
    algo: {
      starters: {
        arkts: `class Bill {
  id: number
  title: string
  amount: number
  category: string
  constructor(id: number, title: string, amount: number, category: string) {
    this.id = id
    this.title = title
    this.amount = amount
    this.category = category
  }
}

@Entry
@Component
struct Index {
  @State bills: Bill[] = [
    new Bill(1, '早餐', 12, '餐饮'),
    new Bill(2, '地铁', 3, '交通'),
    new Bill(3, '咖啡', 18, '餐饮'),
    new Bill(4, '打车', 9, '交通'),
  ]
  @State categories: string[] = ['餐饮', '交通']

  // TODO 1: total() —— reduce 求总额
  // TODO 2: format(n: number) —— '¥' + n.toFixed(2)
  // TODO 3: sumBy(c: string) —— filter + reduce 分类小计

  build() {
    Column({ space: 10 }) {
      Text('支出统计').fontSize(18)
      Text('总支出：待实现').fontSize(18)
      ForEach(this.categories, (c: string) => {
        Text(c)
      }, (c: string) => c)
    }
  }
}`,
      },
      solutions: {
        arkts: `class Bill {
  id: number
  title: string
  amount: number
  category: string
  constructor(id: number, title: string, amount: number, category: string) {
    this.id = id
    this.title = title
    this.amount = amount
    this.category = category
  }
}

@Entry
@Component
struct Index {
  @State bills: Bill[] = [
    new Bill(1, '早餐', 12, '餐饮'),
    new Bill(2, '地铁', 3, '交通'),
    new Bill(3, '咖啡', 18, '餐饮'),
    new Bill(4, '打车', 9, '交通'),
  ]
  @State categories: string[] = ['餐饮', '交通']

  total(): number {
    return this.bills.reduce((s: number, b: Bill) => s + b.amount, 0)
  }

  format(n: number): string {
    return '¥' + n.toFixed(2)
  }

  sumBy(c: string): number {
    return this.bills.filter((b: Bill) => b.category === c).reduce((s: number, b: Bill) => s + b.amount, 0)
  }

  build() {
    Column({ space: 10 }) {
      Text('支出统计')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      Text(\`总支出：\${this.format(this.total())}\`)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#22c55e')
      ForEach(this.categories, (c: string) => {
        Text(\`\${c}：\${this.format(this.sumBy(c))}\`)
          .fontSize(14)
          .fontColor('#e2e8f0')
      }, (c: string) => c)
    }
  }
}`,
      },
    },
    hints: [
      '总额：return this.bills.reduce((s: number, b: Bill) => s + b.amount, 0)。',
      '格式化：return \'¥\' + n.toFixed(2) —— 模板串里 this.format(this.total()) 链式调用。',
      '分类小计：先 filter 后 reduce —— sumBy(\'餐饮\') 返回该类合计。',
    ],
    tests: [
      { name: '样例：统计渲染', stdin: '[]', expected: "__root__\n  Column \"支出统计总支出：¥42.00餐饮：¥30.00交通：¥12.00\" (space=10)\n    Text \"支出统计\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"总支出：¥42.00\" (fontSize=18, fontWeight='bold', fontColor='#22c55e')\n    Text \"餐饮：¥30.00\" (fontSize=14, fontColor='#e2e8f0')\n    Text \"交通：¥12.00\" (fontSize=14, fontColor='#e2e8f0')\n#renders \n#prefs {}" },
      { name: '检查：总额正确', stdin: '[]', expected: "__root__\n  Column \"支出统计总支出：¥42.00餐饮：¥30.00交通：¥12.00\" (space=10)\n    Text \"支出统计\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"总支出：¥42.00\" (fontSize=18, fontWeight='bold', fontColor='#22c55e')\n    Text \"餐饮：¥30.00\" (fontSize=14, fontColor='#e2e8f0')\n    Text \"交通：¥12.00\" (fontSize=14, fontColor='#e2e8f0')\n#renders \n#prefs {}" },
      { name: '检查：分类小计', stdin: '[]', expected: "__root__\n  Column \"支出统计总支出：¥42.00餐饮：¥30.00交通：¥12.00\" (space=10)\n    Text \"支出统计\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"总支出：¥42.00\" (fontSize=18, fontWeight='bold', fontColor='#22c55e')\n    Text \"餐饮：¥30.00\" (fontSize=14, fontColor='#e2e8f0')\n    Text \"交通：¥12.00\" (fontSize=14, fontColor='#e2e8f0')\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: '[]', expected: "__root__\n  Column \"支出统计总支出：¥42.00餐饮：¥30.00交通：¥12.00\" (space=10)\n    Text \"支出统计\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"总支出：¥42.00\" (fontSize=18, fontWeight='bold', fontColor='#22c55e')\n    Text \"餐饮：¥30.00\" (fontSize=14, fontColor='#e2e8f0')\n    Text \"交通：¥12.00\" (fontSize=14, fontColor='#e2e8f0')\n#renders \n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-integration-4',
    lang: 'harmony',
    module: 'integration',
    order: 4,
    title: '持久化收尾：preferences 保存与恢复',
    difficulty: 5,
    xp: 40,
    goals: [
      '掌握 preferences 的 put / flush / get 异步持久化三步',
      '理解 aboutToAppear 恢复数据的时序（await 后状态更新）',
      '完成「保存 → 退出 → 恢复」的完整审计闭环',
    ],
    brief: `## 数据要能活过一次退出

前三关的账本在应用退出后就清零 —— 真实应用必须有**持久化**。鸿蒙用 \`preferences\`（键值偏好存储）：保存 \`put('bills', 序列化数据)\` + \`flush()\` 落盘；恢复在 \`aboutToAppear\` 里 \`await get('bills', [])\` —— 注意 get 是异步的，恢复后更新 @State 才会渲染。

模拟器的 preferences 是**真实语义的内存实现**：put/flush 真实写入，恢复真实读取，\`#prefs\` 审计行展示最终落盘内容 —— 「保存一笔 → 恢复出三条」的闭环全程可验证。

类比的完整版：前三关你学会了**做菜**（录入/列表/统计），这一关学会**装进饭盒**（持久化）—— 明天打开饭盒，菜还在。

> 💡 真实工程中存 JSON 字符串（JSON.stringify/parse 配对），恢复时校验类型 —— 本关的模拟数据直接存数组，机制相同。`,
    task: `## 任务：账本数据落盘与恢复

1. \`@State bills\` 初始空数组；runtime prefs 注入历史数据 \`[{id:1,...早餐12},{id:2,...地铁3}]\`；
2. \`aboutToAppear()\`：\`const prefs = preferences.getSharedPreferences()\` → \`const saved = await prefs.get('bills', []) as Bill[]\` → \`this.bills = saved\`（恢复历史账单）；
3. \`save()\` 方法：\`const prefs = preferences.getSharedPreferences()\` → \`await prefs.put('bills', this.bills)\` → \`await prefs.flush()\`；
4. \`Button('保存账本')\`：\`onClick\` 里 \`await this.save()\`（模拟器已注入异步运行时支持）；
5. 渲染账单列表 \`Text(\\\`\\\${b.title} ¥\\\${b.amount}\\\`)\`。

**判题**：交互【保存账本】—— \`#prefs\` 审计行应包含两条账单（真实落盘验证）。`,
    starter: `interface BillData {
  id: number
  title: string
  amount: number
}

@Entry
@Component
struct Index {
  @State bills: object[] = []

  aboutToAppear() {
    // TODO: preferences 恢复历史账单
  }

  // TODO: save() —— put + flush 落盘

  build() {
    Column({ space: 10 }) {
      Text('口袋记账').fontSize(18)
      ForEach(this.bills, (b: object) => {
        Text('待渲染')
      }, (b: object, idx: number) => idx.toString())
    }
  }
}`,
    solution: `interface BillData {
  id: number
  title: string
  amount: number
}

@Entry
@Component
struct Index {
  @State bills: object[] = []

  aboutToAppear() {
    const prefs = preferences.getSharedPreferences()
    prefs.get('bills', []).then((saved: object[]) => {
      this.bills = saved
    })
  }

  async save() {
    const prefs = preferences.getSharedPreferences()
    await prefs.put('bills', this.bills)
    await prefs.flush()
  }

  build() {
    Column({ space: 10 }) {
      Text('口袋记账')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      ForEach(this.bills, (b: object) => {
        Text(\`\${b.title} ¥\${b.amount}\`)
          .fontSize(14)
          .fontColor('#e2e8f0')
      }, (b: object, idx: number) => b.id.toString())
      Button('保存账本')
        .fontSize(14)
        .onClick(() => {
          this.save()
        })
    }
  }
}`,
    algo: {
      starters: {
        arkts: `interface BillData {
  id: number
  title: string
  amount: number
}

@Entry
@Component
struct Index {
  @State bills: object[] = []

  aboutToAppear() {
    // TODO: preferences 恢复历史账单
  }

  // TODO: save() —— put + flush 落盘

  build() {
    Column({ space: 10 }) {
      Text('口袋记账').fontSize(18)
      ForEach(this.bills, (b: object) => {
        Text('待渲染')
      }, (b: object, idx: number) => idx.toString())
    }
  }
}`,
      },
      solutions: {
        arkts: `interface BillData {
  id: number
  title: string
  amount: number
}

@Entry
@Component
struct Index {
  @State bills: object[] = []

  aboutToAppear() {
    const prefs = preferences.getSharedPreferences()
    prefs.get('bills', []).then((saved: object[]) => {
      this.bills = saved
    })
  }

  async save() {
    const prefs = preferences.getSharedPreferences()
    await prefs.put('bills', this.bills)
    await prefs.flush()
  }

  build() {
    Column({ space: 10 }) {
      Text('口袋记账')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      ForEach(this.bills, (b: object) => {
        Text(\`\${b.title} ¥\${b.amount}\`)
          .fontSize(14)
          .fontColor('#e2e8f0')
      }, (b: object, idx: number) => b.id.toString())
      Button('保存账本')
        .fontSize(14)
        .onClick(() => {
          this.save()
        })
    }
  }
}`,
      },
    },
    hints: [
      '恢复：aboutToAppear 里 prefs.get(\'bills\', []).then((saved) => this.bills = saved) —— Promise 风格与真实一致。',
      '落盘：save 方法里 await prefs.put(\'bills\', this.bills) 与 await prefs.flush()。',
      '审计：#prefs 行展示最终落盘内容 —— 恢复出的两条账单必须出现在渲染与审计中。',
    ],
    tests: [
      { name: '样例：恢复历史账单', stdin: '[]', expected: "__root__\n  Column \"口袋记账早餐 ¥12地铁 ¥3保存账本\" (space=10)\n    Text \"口袋记账\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"早餐 ¥12\" (fontSize=14, fontColor='#e2e8f0')\n    Text \"地铁 ¥3\" (fontSize=14, fontColor='#e2e8f0')\n    Button \"保存账本\" (fontSize=14)\n#renders \n#prefs {\"bills\":[{\"id\":1,\"title\":\"早餐\",\"amount\":12},{\"id\":2,\"title\":\"地铁\",\"amount\":3}]}" },
      { name: '检查：列表渲染', stdin: '[]', expected: "__root__\n  Column \"口袋记账早餐 ¥12地铁 ¥3保存账本\" (space=10)\n    Text \"口袋记账\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"早餐 ¥12\" (fontSize=14, fontColor='#e2e8f0')\n    Text \"地铁 ¥3\" (fontSize=14, fontColor='#e2e8f0')\n    Button \"保存账本\" (fontSize=14)\n#renders \n#prefs {\"bills\":[{\"id\":1,\"title\":\"早餐\",\"amount\":12},{\"id\":2,\"title\":\"地铁\",\"amount\":3}]}" },
      { name: '检查：恢复时序', stdin: '[]', expected: "__root__\n  Column \"口袋记账早餐 ¥12地铁 ¥3保存账本\" (space=10)\n    Text \"口袋记账\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"早餐 ¥12\" (fontSize=14, fontColor='#e2e8f0')\n    Text \"地铁 ¥3\" (fontSize=14, fontColor='#e2e8f0')\n    Button \"保存账本\" (fontSize=14)\n#renders \n#prefs {\"bills\":[{\"id\":1,\"title\":\"早餐\",\"amount\":12},{\"id\":2,\"title\":\"地铁\",\"amount\":3}]}" },
      { name: '隐藏：逐字符比对', stdin: '[]', expected: "__root__\n  Column \"口袋记账早餐 ¥12地铁 ¥3保存账本\" (space=10)\n    Text \"口袋记账\" (fontSize=18, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"早餐 ¥12\" (fontSize=14, fontColor='#e2e8f0')\n    Text \"地铁 ¥3\" (fontSize=14, fontColor='#e2e8f0')\n    Button \"保存账本\" (fontSize=14)\n#renders \n#prefs {\"bills\":[{\"id\":1,\"title\":\"早餐\",\"amount\":12},{\"id\":2,\"title\":\"地铁\",\"amount\":3}]}", hidden: true },
    ],
    runtime: JSON.stringify({
      kind: 'arkts',
      pages: { 'pages/Index': 'Index' },
      entry: 'pages/Index',
      prefs: {
        bills: [
          { id: 1, title: '早餐', amount: 12 },
          { id: 2, title: '地铁', amount: 3 },
        ],
      },
    }),
  },
];
