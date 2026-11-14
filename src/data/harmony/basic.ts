import type { Level } from '@/types';

/**
 * 鸿蒙应用开发 · 第一章：ArkTS 与首个页面（basic，4 关）。
 * 真实 ArkTS 语法（struct / @Entry / @Component / build() / 属性链），
 * 由 src/judge/arkts-sim.ts 解析执行：渲染树逐节点比对 + 交互模拟。
 */
export const HARMONY_BASIC: Level[] = [
  {
    id: 'harmony-basic-1',
    lang: 'harmony',
    module: 'basic',
    order: 1,
    title: '开发者名片：你的第一个 ArkUI 页面',
    difficulty: 1,
    xp: 15,
    goals: [
      '理解声明式 UI 的核心：build() 描述「状态长什么样」',
      '掌握 Column/Row 两个最基础的布局容器',
      '会用属性链设置 fontSize / fontWeight / fontColor / backgroundColor',
    ],
    brief: `## 声明式 UI：先画图纸，再盖房子

鸿蒙应用的界面用 **ArkTS + ArkUI** 编写：一个页面就是一个 \`struct\`，它的 \`build()\` 方法**声明**界面的结构 —— 你不写"点这里、改那里"的命令式代码，只声明"状态长什么样"，状态一变，框架自动重绘。

写 UI 就像搭积木：\`Column\` 是竖着排的容器，\`Row\` 是横着排的容器，\`Text\` 是文字，\`Button\` 是按钮；每个组件后面用 **属性链**（\`.fontSize(24)\`、\`.fontWeight(FontWeight.Bold)\`）逐个设置外观。属性链可以无限串联，顺序不影响结果，但同写一行更易读。

类比：**HTML + CSS 的合体** —— 组件就是标签，属性链就是内联样式，但它是强类型、可编译检查的。

> 💡 鸿蒙默认单位是 **vp**（虚拟像素），不写单位直接给数字即可；百分比字符串如 \`'100%'\` 表示相对父容器。`,
    task: `## 任务：搭出你的开发者名片

实现 \`Index\` 页面：一张竖向排布的名片卡。

1. 最外层 \`Column\`：\`{ space: 16 }\`，\`.width('100%')\`，\`.padding(20)\`，\`.backgroundColor('#0f172a')\`；
2. \`Text('鸿蒙冒险者')\`：\`fontSize(28)\`、\`fontWeight(FontWeight.Bold)\`、\`fontColor('#e2e8f0')\`；
3. 一行 \`Row({ space: 8 })\` 放三个技术徽章 \`Text\`：\`'ArkTS'\`、\`'ArkUI'\`、\`'Stage 模型'\`，每个 \`fontSize(12)\`、\`fontColor('#4f46e5')\`、\`backgroundColor('#eef2ff')\`、\`borderRadius(8)\`、\`padding(6)\`；
4. \`Text('正在学习 HarmonyOS 应用开发')\`：\`fontSize(14)\`、\`fontColor('#94a3b8')\`。

**判题**：模拟器渲染整棵组件树并逐节点比对（结构 + 文本 + 属性）。`,
    starter: `@Entry
@Component
struct Index {
  build() {
    Column({ space: 16 }) {
      // TODO 1: 名字 Text —— fontSize(28) + FontWeight.Bold + fontColor('#e2e8f0')
      // TODO 2: Row({ space: 8 }) 三个技术徽章 Text
      // TODO 3: 简介 Text —— fontSize(14) + fontColor('#94a3b8')
      Text('鸿蒙冒险者')
    }
    .width('100%')
  }
}`,
    solution: `@Entry
@Component
struct Index {
  build() {
    Column({ space: 16 }) {
      Text('鸿蒙冒险者')
        .fontSize(28)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      Row({ space: 8 }) {
        Text('ArkTS')
          .fontSize(12)
          .fontColor('#4f46e5')
          .backgroundColor('#eef2ff')
          .borderRadius(8)
          .padding(6)
        Text('ArkUI')
          .fontSize(12)
          .fontColor('#4f46e5')
          .backgroundColor('#eef2ff')
          .borderRadius(8)
          .padding(6)
        Text('Stage 模型')
          .fontSize(12)
          .fontColor('#4f46e5')
          .backgroundColor('#eef2ff')
          .borderRadius(8)
          .padding(6)
      }
      Text('正在学习 HarmonyOS 应用开发')
        .fontSize(14)
        .fontColor('#94a3b8')
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#0f172a')
  }
}`,
    algo: {
      starters: {
        arkts: `@Entry
@Component
struct Index {
  build() {
    Column({ space: 16 }) {
      // TODO 1: 名字 Text —— fontSize(28) + FontWeight.Bold + fontColor('#e2e8f0')
      // TODO 2: Row({ space: 8 }) 三个技术徽章 Text
      // TODO 3: 简介 Text —— fontSize(14) + fontColor('#94a3b8')
      Text('鸿蒙冒险者')
    }
    .width('100%')
  }
}`,
      },
      solutions: {
        arkts: `@Entry
@Component
struct Index {
  build() {
    Column({ space: 16 }) {
      Text('鸿蒙冒险者')
        .fontSize(28)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      Row({ space: 8 }) {
        Text('ArkTS')
          .fontSize(12)
          .fontColor('#4f46e5')
          .backgroundColor('#eef2ff')
          .borderRadius(8)
          .padding(6)
        Text('ArkUI')
          .fontSize(12)
          .fontColor('#4f46e5')
          .backgroundColor('#eef2ff')
          .borderRadius(8)
          .padding(6)
        Text('Stage 模型')
          .fontSize(12)
          .fontColor('#4f46e5')
          .backgroundColor('#eef2ff')
          .borderRadius(8)
          .padding(6)
      }
      Text('正在学习 HarmonyOS 应用开发')
        .fontSize(14)
        .fontColor('#94a3b8')
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#0f172a')
  }
}`,
      },
    },
    hints: [
      '属性链写在组件后面逐个串联：Text(...).fontSize(28).fontWeight(FontWeight.Bold)。',
      '徽章的 backgroundColor 与 fontColor 是两个不同属性，别混淆 —— 背景色用 backgroundColor。',
      'Row 里的三个 Text 各自独立写属性链；Row 自身只需 { space: 8 } 控制间距。',
    ],
    tests: [
      { name: '样例：完整名片', stdin: '[]', expected: "__root__\n  Column \"鸿蒙冒险者ArkTSArkUIStage 模型正在学习 HarmonyOS 应用开发\" (space=16, width='100%', padding=20, backgroundColor='#0f172a')\n    Text \"鸿蒙冒险者\" (fontSize=28, fontWeight='bold', fontColor='#e2e8f0')\n    Row \"ArkTSArkUIStage 模型\" (space=8)\n      Text \"ArkTS\" (fontSize=12, fontColor='#4f46e5', backgroundColor='#eef2ff', borderRadius=8, padding=6)\n      Text \"ArkUI\" (fontSize=12, fontColor='#4f46e5', backgroundColor='#eef2ff', borderRadius=8, padding=6)\n      Text \"Stage 模型\" (fontSize=12, fontColor='#4f46e5', backgroundColor='#eef2ff', borderRadius=8, padding=6)\n    Text \"正在学习 HarmonyOS 应用开发\" (fontSize=14, fontColor='#94a3b8')\n#renders \n#prefs {}" },
      { name: '检查：徽章行结构', stdin: '[]', expected: "__root__\n  Column \"鸿蒙冒险者ArkTSArkUIStage 模型正在学习 HarmonyOS 应用开发\" (space=16, width='100%', padding=20, backgroundColor='#0f172a')\n    Text \"鸿蒙冒险者\" (fontSize=28, fontWeight='bold', fontColor='#e2e8f0')\n    Row \"ArkTSArkUIStage 模型\" (space=8)\n      Text \"ArkTS\" (fontSize=12, fontColor='#4f46e5', backgroundColor='#eef2ff', borderRadius=8, padding=6)\n      Text \"ArkUI\" (fontSize=12, fontColor='#4f46e5', backgroundColor='#eef2ff', borderRadius=8, padding=6)\n      Text \"Stage 模型\" (fontSize=12, fontColor='#4f46e5', backgroundColor='#eef2ff', borderRadius=8, padding=6)\n    Text \"正在学习 HarmonyOS 应用开发\" (fontSize=14, fontColor='#94a3b8')\n#renders \n#prefs {}" },
      { name: '检查：配色属性', stdin: '[]', expected: "__root__\n  Column \"鸿蒙冒险者ArkTSArkUIStage 模型正在学习 HarmonyOS 应用开发\" (space=16, width='100%', padding=20, backgroundColor='#0f172a')\n    Text \"鸿蒙冒险者\" (fontSize=28, fontWeight='bold', fontColor='#e2e8f0')\n    Row \"ArkTSArkUIStage 模型\" (space=8)\n      Text \"ArkTS\" (fontSize=12, fontColor='#4f46e5', backgroundColor='#eef2ff', borderRadius=8, padding=6)\n      Text \"ArkUI\" (fontSize=12, fontColor='#4f46e5', backgroundColor='#eef2ff', borderRadius=8, padding=6)\n      Text \"Stage 模型\" (fontSize=12, fontColor='#4f46e5', backgroundColor='#eef2ff', borderRadius=8, padding=6)\n    Text \"正在学习 HarmonyOS 应用开发\" (fontSize=14, fontColor='#94a3b8')\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: '[]', expected: "__root__\n  Column \"鸿蒙冒险者ArkTSArkUIStage 模型正在学习 HarmonyOS 应用开发\" (space=16, width='100%', padding=20, backgroundColor='#0f172a')\n    Text \"鸿蒙冒险者\" (fontSize=28, fontWeight='bold', fontColor='#e2e8f0')\n    Row \"ArkTSArkUIStage 模型\" (space=8)\n      Text \"ArkTS\" (fontSize=12, fontColor='#4f46e5', backgroundColor='#eef2ff', borderRadius=8, padding=6)\n      Text \"ArkUI\" (fontSize=12, fontColor='#4f46e5', backgroundColor='#eef2ff', borderRadius=8, padding=6)\n      Text \"Stage 模型\" (fontSize=12, fontColor='#4f46e5', backgroundColor='#eef2ff', borderRadius=8, padding=6)\n    Text \"正在学习 HarmonyOS 应用开发\" (fontSize=14, fontColor='#94a3b8')\n#renders \n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-basic-2',
    lang: 'harmony',
    module: 'basic',
    order: 2,
    title: '专注番茄钟：@State 让界面活起来',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握 @State：被它标记的变量变化时，UI 自动重绘',
      '理解「状态驱动」：界面永远是状态的投影',
      '用 onClick 修改状态，观察按钮文本随状态自动更新',
    ],
    brief: `## @State：会说话的变量

\`@State\` 是 ArkUI 状态管理的起点：被它装饰的成员变量，**每一次变化都会自动触发界面重绘**。你不需要手动"刷新界面"—— 改状态就够了。这就是声明式 UI 的核心契约：**UI = f(state)**，界面永远是状态的函数。

本关做一个极简番茄钟：\`@State minutes\` 存剩余分钟，\`@State running\` 存是否计时中；按钮文本根据 \`running\` 显示「开始 ▶」或「暂停 ⏸」，点击时取反。两个状态各司其职，界面自动跟着变。

类比：状态是**剧本**，build() 是**舞台** —— 你只管改剧本，演员（界面）自动对台词。

> 💡 @State 只能修饰**组件自己的私有状态**；跨组件传递要用 @Prop/@Link（进阶章见）。`,
    task: `## 任务：实现番茄钟的状态切换

1. \`@State minutes: number = 25\`、\`@State running: boolean = false\`；
2. \`Text\\\`\\\${this.minutes}:00\\\`\`：\`fontSize(48)\`、\`fontWeight(FontWeight.Bold)\`、\`fontColor('#e2e8f0')\`；
3. \`Button\`：文本为三元表达式 \`this.running ? '暂停 ⏸' : '开始 ▶'\`，\`fontSize(18)\`，\`onClick\` 里 \`this.running = !this.running\`。

**判题**：模拟器依次执行交互【点击「开始 ▶」→ 点击「暂停 ⏸」】，比对每一步的渲染结果。`,
    starter: `@Entry
@Component
struct Index {
  // TODO 1: 两个 @State —— minutes 初始 25，running 初始 false
  @State minutes: number = 25

  build() {
    Column({ space: 16 }) {
      Text('25:00').fontSize(48)
      // TODO 2: 按钮文本随 running 切换，onClick 取反
      Button('开始 ▶').fontSize(18)
    }
  }
}`,
    solution: `@Entry
@Component
struct Index {
  @State minutes: number = 25
  @State running: boolean = false

  build() {
    Column({ space: 16 }) {
      Text(\`\${this.minutes}:00\`)
        .fontSize(48)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      Button(this.running ? '暂停 ⏸' : '开始 ▶')
        .fontSize(18)
        .onClick(() => {
          this.running = !this.running
        })
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Entry
@Component
struct Index {
  // TODO 1: 两个 @State —— minutes 初始 25，running 初始 false
  @State minutes: number = 25

  build() {
    Column({ space: 16 }) {
      Text('25:00').fontSize(48)
      // TODO 2: 按钮文本随 running 切换，onClick 取反
      Button('开始 ▶').fontSize(18)
    }
  }
}`,
      },
      solutions: {
        arkts: `@Entry
@Component
struct Index {
  @State minutes: number = 25
  @State running: boolean = false

  build() {
    Column({ space: 16 }) {
      Text(\`\${this.minutes}:00\`)
        .fontSize(48)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      Button(this.running ? '暂停 ⏸' : '开始 ▶')
        .fontSize(18)
        .onClick(() => {
          this.running = !this.running
        })
    }
  }
}`,
      },
    },
    hints: [
      '@State 写在字段上：@State running: boolean = false —— 两个状态各写一行。',
      '按钮文本：this.running ? \'暂停 ⏸\' : \'开始 ▶\' —— 三元表达式直接作为 Button 参数。',
      'onClick(() => { this.running = !this.running }) —— 修改 @State 会自动触发界面重绘。',
    ],
    tests: [
      { name: '样例：开始后暂停', stdin: JSON.stringify([{ tap: '开始' }, { tap: '暂停' }]), expected: "__root__\n  Column \"25:00开始 ▶\" (space=16)\n    Text \"25:00\" (fontSize=48, fontWeight='bold', fontColor='#e2e8f0')\n    Button \"开始 ▶\" (fontSize=18)\n#renders Index=2\n#prefs {}" },
      { name: '检查：状态驱动文本', stdin: JSON.stringify([{ tap: '开始' }]), expected: "__root__\n  Column \"25:00暂停 ⏸\" (space=16)\n    Text \"25:00\" (fontSize=48, fontWeight='bold', fontColor='#e2e8f0')\n    Button \"暂停 ⏸\" (fontSize=18)\n#renders Index=1\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"25:00开始 ▶\" (space=16)\n    Text \"25:00\" (fontSize=48, fontWeight='bold', fontColor='#e2e8f0')\n    Button \"开始 ▶\" (fontSize=18)\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ tap: '开始' }, { tap: '暂停' }]), expected: "__root__\n  Column \"25:00开始 ▶\" (space=16)\n    Text \"25:00\" (fontSize=48, fontWeight='bold', fontColor='#e2e8f0')\n    Button \"开始 ▶\" (fontSize=18)\n#renders Index=2\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-basic-3',
    lang: 'harmony',
    module: 'basic',
    order: 3,
    title: '今日战报：Row 三联卡与选中高亮',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握 Row 横向布局与多子组件排列',
      '学会用一个 @State 索引驱动「选中高亮」模式',
      '理解 backgroundColor / borderRadius 的卡片视觉手法',
    ],
    brief: `## 一个索引，掌控一排卡片

数据看板最常见的模式：一排统计卡片，点谁谁高亮。实现它的关键是**只存一个状态** —— \`@State active\` 记录当前选中卡片的下标；每张卡的背景色写成三元表达式：\`this.active === 0 ? 高亮色 : 普通色\`。状态只有一份，界面处处联动 —— 这就是"单一数据源"的雏形。

本关做「今日战报」：三张卡片（专注 4h / 任务 6 / 连击 5 天），用 \`Row({ space: 10 })\` 横排。每张卡是一个 \`Button\`（方便接收点击），点击后把自己变成高亮蓝。真实项目里，这种"选中态"随处可见：Tab 栏、日期选择器、筛选 chips…… 全都是同一个套路。

> 💡 高亮本质是**换属性**而不是换组件 —— 让状态决定属性值，而不是销毁重建节点。`,
    task: `## 任务：实现可点选的三联战报卡

1. \`@State active: number = 0\`；\`Row({ space: 10 })\` 内放三个 \`Button\`，文本分别为 \`'专注 4h'\`、\`'任务 6'\`、\`'连击 5 天'\`；
2. 每个按钮：\`.fontSize(14)\`、\`.backgroundColor(this.active === 下标 ? '#0a59f7' : '#1e293b')\`、\`.fontColor(this.active === 下标 ? '#ffffff' : '#94a3b8')\`、\`.borderRadius(12)\`、\`.padding(12)\`；
3. 每个 \`onClick\` 把 \`this.active\` 设为对应下标（0 / 1 / 2）。

**判题**：交互【点击「任务 6」】后，第二张卡应为高亮蓝、其余为深灰。`,
    starter: `@Entry
@Component
struct Index {
  // TODO: @State active: number = 0
  @State active: number = 0

  build() {
    Row({ space: 10 }) {
      // TODO: 三个 Button，backgroundColor / fontColor 随 active 高亮
      Button('专注 4h').fontSize(14)
      Button('任务 6').fontSize(14)
      Button('连击 5 天').fontSize(14)
    }
  }
}`,
    solution: `@Entry
@Component
struct Index {
  @State active: number = 0

  build() {
    Row({ space: 10 }) {
      Button('专注 4h')
        .fontSize(14)
        .backgroundColor(this.active === 0 ? '#0a59f7' : '#1e293b')
        .fontColor(this.active === 0 ? '#ffffff' : '#94a3b8')
        .borderRadius(12)
        .padding(12)
        .onClick(() => {
          this.active = 0
        })
      Button('任务 6')
        .fontSize(14)
        .backgroundColor(this.active === 1 ? '#0a59f7' : '#1e293b')
        .fontColor(this.active === 1 ? '#ffffff' : '#94a3b8')
        .borderRadius(12)
        .padding(12)
        .onClick(() => {
          this.active = 1
        })
      Button('连击 5 天')
        .fontSize(14)
        .backgroundColor(this.active === 2 ? '#0a59f7' : '#1e293b')
        .fontColor(this.active === 2 ? '#ffffff' : '#94a3b8')
        .borderRadius(12)
        .padding(12)
        .onClick(() => {
          this.active = 2
        })
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Entry
@Component
struct Index {
  // TODO: @State active: number = 0
  @State active: number = 0

  build() {
    Row({ space: 10 }) {
      // TODO: 三个 Button，backgroundColor / fontColor 随 active 高亮
      Button('专注 4h').fontSize(14)
      Button('任务 6').fontSize(14)
      Button('连击 5 天').fontSize(14)
    }
  }
}`,
      },
      solutions: {
        arkts: `@Entry
@Component
struct Index {
  @State active: number = 0

  build() {
    Row({ space: 10 }) {
      Button('专注 4h')
        .fontSize(14)
        .backgroundColor(this.active === 0 ? '#0a59f7' : '#1e293b')
        .fontColor(this.active === 0 ? '#ffffff' : '#94a3b8')
        .borderRadius(12)
        .padding(12)
        .onClick(() => {
          this.active = 0
        })
      Button('任务 6')
        .fontSize(14)
        .backgroundColor(this.active === 1 ? '#0a59f7' : '#1e293b')
        .fontColor(this.active === 1 ? '#ffffff' : '#94a3b8')
        .borderRadius(12)
        .padding(12)
        .onClick(() => {
          this.active = 1
        })
      Button('连击 5 天')
        .fontSize(14)
        .backgroundColor(this.active === 2 ? '#0a59f7' : '#1e293b')
        .fontColor(this.active === 2 ? '#ffffff' : '#94a3b8')
        .borderRadius(12)
        .padding(12)
        .onClick(() => {
          this.active = 2
        })
    }
  }
}`,
      },
    },
    hints: [
      '高亮三元表达式：this.active === 1 ? \'#0a59f7\' : \'#1e293b\' —— 下标对应哪张卡就高亮谁。',
      'onClick(() => { this.active = 1 }) —— 每张卡写死自己的下标，点击即切换。',
      '注意 fontColor 与 backgroundColor 要成对写，否则白字落在白底上。',
    ],
    tests: [
      { name: '样例：点选任务卡', stdin: JSON.stringify([{ tap: '任务 6' }]), expected: "__root__\n  Row \"专注 4h任务 6连击 5 天\" (space=10)\n    Button \"专注 4h\" (fontSize=14, backgroundColor='#1e293b', fontColor='#94a3b8', borderRadius=12, padding=12)\n    Button \"任务 6\" (fontSize=14, backgroundColor='#0a59f7', fontColor='#ffffff', borderRadius=12, padding=12)\n    Button \"连击 5 天\" (fontSize=14, backgroundColor='#1e293b', fontColor='#94a3b8', borderRadius=12, padding=12)\n#renders Index=1\n#prefs {}" },
      { name: '检查：初始默认第一张', stdin: '[]', expected: "__root__\n  Row \"专注 4h任务 6连击 5 天\" (space=10)\n    Button \"专注 4h\" (fontSize=14, backgroundColor='#0a59f7', fontColor='#ffffff', borderRadius=12, padding=12)\n    Button \"任务 6\" (fontSize=14, backgroundColor='#1e293b', fontColor='#94a3b8', borderRadius=12, padding=12)\n    Button \"连击 5 天\" (fontSize=14, backgroundColor='#1e293b', fontColor='#94a3b8', borderRadius=12, padding=12)\n#renders \n#prefs {}" },
      { name: '检查：切回专注卡', stdin: JSON.stringify([{ tap: '任务 6' }, { tap: '专注 4h' }]), expected: "__root__\n  Row \"专注 4h任务 6连击 5 天\" (space=10)\n    Button \"专注 4h\" (fontSize=14, backgroundColor='#0a59f7', fontColor='#ffffff', borderRadius=12, padding=12)\n    Button \"任务 6\" (fontSize=14, backgroundColor='#1e293b', fontColor='#94a3b8', borderRadius=12, padding=12)\n    Button \"连击 5 天\" (fontSize=14, backgroundColor='#1e293b', fontColor='#94a3b8', borderRadius=12, padding=12)\n#renders Index=2\n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ tap: '连击 5 天' }]), expected: "__root__\n  Row \"专注 4h任务 6连击 5 天\" (space=10)\n    Button \"专注 4h\" (fontSize=14, backgroundColor='#1e293b', fontColor='#94a3b8', borderRadius=12, padding=12)\n    Button \"任务 6\" (fontSize=14, backgroundColor='#1e293b', fontColor='#94a3b8', borderRadius=12, padding=12)\n    Button \"连击 5 天\" (fontSize=14, backgroundColor='#0a59f7', fontColor='#ffffff', borderRadius=12, padding=12)\n#renders Index=1\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-basic-4',
    lang: 'harmony',
    module: 'basic',
    order: 4,
    title: '目标进度环：Progress 与条件文案',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握 Progress 组件的 value / total 用法',
      '学会用 if 在 build() 中做条件渲染',
      '巩固状态累积模式：每次点击推进状态机',
    ],
    brief: `## 进度条是状态的温度计

\`Progress({ value, total })\` 是最直观的"状态可视化"组件 —— \`value\` 变多少，进度条就长多少。本关把一个 \`@State percent\` 从 0 推到 100：每点一次「+25」前进一格，**到达 100 时用 if 条件渲染出一行祝贺文案**。

条件渲染是声明式 UI 的分水岭：\`if (条件) { 组件 }\` 直接写在 build() 里，条件为真才进入渲染树。配合状态推进，就能做出"填满即达成"的仪式感 —— 打卡、集卡、进度解锁，全是这套模式。

类比：进度条是**油表**，if 是**警示灯** —— 油表指针动是状态，灯亮不亮由指针位置决定。

> 💡 记得做边界保护：\`Math.min(100, this.percent + 25)\`，别让进度超过 100。`,
    task: `## 任务：从 0 推进到 100，点亮达成文案

1. \`@State percent: number = 0\`；
2. \`Text(\`今日学习进度 \${this.percent}%\`)\`：\`fontSize(18)\`、\`fontColor('#e2e8f0')\`；
3. \`Progress({ value: this.percent, total: 100 })\`：\`.width('80%')\`、\`.height(12)\`；
4. \`Button('+25')\`：\`onClick\` 里 \`this.percent = Math.min(100, this.percent + 25)\`；
5. \`if (this.percent >= 100)\` 渲染 \`Text('今日目标达成 🎉')\`：\`fontSize(16)\`、\`fontColor('#22c55e')\`。

**判题**：交互【连点四次「+25」】，验证进度文本、Progress 数值与达成文案逐阶段正确。`,
    starter: `@Entry
@Component
struct Index {
  @State percent: number = 0

  build() {
    Column({ space: 12 }) {
      Text('今日学习进度 0%').fontSize(18)
      Progress({ value: this.percent, total: 100 }).width('80%').height(12)
      // TODO: Button('+25') —— Math.min(100, this.percent + 25)
      // TODO: if (this.percent >= 100) —— 达成文案
      Button('+25')
    }
  }
}`,
    solution: `@Entry
@Component
struct Index {
  @State percent: number = 0

  build() {
    Column({ space: 12 }) {
      Text(\`今日学习进度 \${this.percent}%\`)
        .fontSize(18)
        .fontColor('#e2e8f0')
      Progress({ value: this.percent, total: 100 })
        .width('80%')
        .height(12)
      Button('+25')
        .fontSize(16)
        .onClick(() => {
          this.percent = Math.min(100, this.percent + 25)
        })
      if (this.percent >= 100) {
        Text('今日目标达成 🎉')
          .fontSize(16)
          .fontColor('#22c55e')
      }
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Entry
@Component
struct Index {
  @State percent: number = 0

  build() {
    Column({ space: 12 }) {
      Text('今日学习进度 0%').fontSize(18)
      Progress({ value: this.percent, total: 100 }).width('80%').height(12)
      // TODO: Button('+25') —— Math.min(100, this.percent + 25)
      // TODO: if (this.percent >= 100) —— 达成文案
      Button('+25')
    }
  }
}`,
      },
      solutions: {
        arkts: `@Entry
@Component
struct Index {
  @State percent: number = 0

  build() {
    Column({ space: 12 }) {
      Text(\`今日学习进度 \${this.percent}%\`)
        .fontSize(18)
        .fontColor('#e2e8f0')
      Progress({ value: this.percent, total: 100 })
        .width('80%')
        .height(12)
      Button('+25')
        .fontSize(16)
        .onClick(() => {
          this.percent = Math.min(100, this.percent + 25)
        })
      if (this.percent >= 100) {
        Text('今日目标达成 🎉')
          .fontSize(16)
          .fontColor('#22c55e')
      }
    }
  }
}`,
      },
    },
    hints: [
      'Progress 的两个参数写进对象：Progress({ value: this.percent, total: 100 })。',
      '推进逻辑加边界保护：this.percent = Math.min(100, this.percent + 25)。',
      '条件渲染直接写 if (this.percent >= 100) { Text(...) } —— 不需要 else。',
    ],
    tests: [
      { name: '样例：连点四次达成', stdin: JSON.stringify([{ tap: '+25' }, { tap: '+25' }, { tap: '+25' }, { tap: '+25' }]), expected: "__root__\n  Column \"今日学习进度 100%+25今日目标达成 🎉\" (space=12)\n    Text \"今日学习进度 100%\" (fontSize=18, fontColor='#e2e8f0')\n    Progress (total=100, width='80%', height=12)\n    Button \"+25\" (fontSize=16)\n    Text \"今日目标达成 🎉\" (fontSize=16, fontColor='#22c55e')\n#renders Index=4\n#prefs {}" },
      { name: '检查：中途状态', stdin: JSON.stringify([{ tap: '+25' }, { tap: '+25' }]), expected: "__root__\n  Column \"今日学习进度 50%+25\" (space=12)\n    Text \"今日学习进度 50%\" (fontSize=18, fontColor='#e2e8f0')\n    Progress (total=100, width='80%', height=12)\n    Button \"+25\" (fontSize=16)\n#renders Index=2\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"今日学习进度 0%+25\" (space=12)\n    Text \"今日学习进度 0%\" (fontSize=18, fontColor='#e2e8f0')\n    Progress (total=100, width='80%', height=12)\n    Button \"+25\" (fontSize=16)\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ tap: '+25' }, { tap: '+25' }, { tap: '+25' }, { tap: '+25' }]), expected: "__root__\n  Column \"今日学习进度 100%+25今日目标达成 🎉\" (space=12)\n    Text \"今日学习进度 100%\" (fontSize=18, fontColor='#e2e8f0')\n    Progress (total=100, width='80%', height=12)\n    Button \"+25\" (fontSize=16)\n    Text \"今日目标达成 🎉\" (fontSize=16, fontColor='#22c55e')\n#renders Index=4\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
];
