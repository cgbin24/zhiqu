import type { Level } from '@/types';

/**
 * 鸿蒙应用开发 · 第三章：组件进阶与导航（advanced，4 关）。
 * @Prop/@Link 父子传值、router 页面栈与生命周期、AppStorage 全局状态。
 */
export const HARMONY_ADVANCED: Level[] = [
  {
    id: 'harmony-advanced-1',
    lang: 'harmony',
    module: 'advanced',
    order: 1,
    title: '@Prop：把数据从父组件传下去',
    difficulty: 3,
    xp: 25,
    goals: [
      '掌握 @Prop 单向数据流：父 → 子',
      '理解子组件是「纯展示」：数据由父驱动',
      '学会在同一页面复用自定义组件',
    ],
    brief: `## @Prop：单向的输水管

自定义组件要可复用，就不能把数据写死在内部 —— \`@Prop\` 让父组件把值**单向**传给子组件：父变，子自动跟着变；但子组件自己不改它（改了也不会回流到父）。这就是**单向数据流**，React/Vue 玩家会秒懂的设计。

本关把「技术方向标签」抽成 \`Tag\` 子组件：它只负责"给我 label 我画徽章"，什么 label 由父决定。父组件一次传三个标签，点按钮切换主攻方向 —— 三个 Tag 同时联动。**组件复用的本质就是"展示与数据分离"**。

类比：@Prop 像投影仪的**信号线** —— 画面跟着电脑走，幕布自己不会改内容。

> 💡 @Prop 传值在组件初始化处：\`Tag({ label: this.tag })\`，与函数传参一模一样。`,
    task: `## 任务：三枚联动的技术方向标签

1. 定义 \`@Component struct Tag\`：\`@Prop label: string = ''\`；build 渲染 \`Text(\\\`# \\\${this.label}\\\`)\`：\`fontSize(13)\`、\`fontColor('#93c5fd')\`、\`backgroundColor('#1e3a8a')\`、\`borderRadius(10)\`、\`padding(8)\`；
2. 父组件 \`@State direction: string = '全栈'\`；
3. \`Row({ space: 8 })\` 内放三个 \`Tag({ label: this.direction })\`（复用同一状态）；
4. \`Button('切换主攻方向')\`：\`onClick\` 里 \`this.direction = this.direction === '全栈' ? '后端' : '全栈'\`。

**判题**：交互【点击切换】，三个 Tag 的文本应同时联动。`,
    starter: `@Component
struct Tag {
  @Prop label: string = ''

  build() {
    Text(\`# \${this.label}\`)
      .fontSize(13)
      .fontColor('#93c5fd')
      .backgroundColor('#1e3a8a')
      .borderRadius(10)
      .padding(8)
  }
}

@Entry
@Component
struct Index {
  // TODO: @State direction + 三个 Tag 复用 + 切换按钮
  build() {
    Column({ space: 12 }) {
      Row({ space: 8 }) {
        Tag({ label: '全栈' })
        Tag({ label: '全栈' })
        Tag({ label: '全栈' })
      }
      Button('切换主攻方向')
    }
  }
}`,
    solution: `@Component
struct Tag {
  @Prop label: string = ''

  build() {
    Text(\`# \${this.label}\`)
      .fontSize(13)
      .fontColor('#93c5fd')
      .backgroundColor('#1e3a8a')
      .borderRadius(10)
      .padding(8)
  }
}

@Entry
@Component
struct Index {
  @State direction: string = '全栈'

  build() {
    Column({ space: 12 }) {
      Row({ space: 8 }) {
        Tag({ label: this.direction })
        Tag({ label: this.direction })
        Tag({ label: this.direction })
      }
      Button('切换主攻方向')
        .fontSize(14)
        .onClick(() => {
          this.direction = this.direction === '全栈' ? '后端' : '全栈'
        })
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Component
struct Tag {
  @Prop label: string = ''

  build() {
    Text(\`# \${this.label}\`)
      .fontSize(13)
      .fontColor('#93c5fd')
      .backgroundColor('#1e3a8a')
      .borderRadius(10)
      .padding(8)
  }
}

@Entry
@Component
struct Index {
  // TODO: @State direction + 三个 Tag 复用 + 切换按钮
  build() {
    Column({ space: 12 }) {
      Row({ space: 8 }) {
        Tag({ label: '全栈' })
        Tag({ label: '全栈' })
        Tag({ label: '全栈' })
      }
      Button('切换主攻方向')
    }
  }
}`,
      },
      solutions: {
        arkts: `@Component
struct Tag {
  @Prop label: string = ''

  build() {
    Text(\`# \${this.label}\`)
      .fontSize(13)
      .fontColor('#93c5fd')
      .backgroundColor('#1e3a8a')
      .borderRadius(10)
      .padding(8)
  }
}

@Entry
@Component
struct Index {
  @State direction: string = '全栈'

  build() {
    Column({ space: 12 }) {
      Row({ space: 8 }) {
        Tag({ label: this.direction })
        Tag({ label: this.direction })
        Tag({ label: this.direction })
      }
      Button('切换主攻方向')
        .fontSize(14)
        .onClick(() => {
          this.direction = this.direction === '全栈' ? '后端' : '全栈'
        })
    }
  }
}`,
      },
    },
    hints: [
      '子组件只加 @Prop：@Prop label: string = \'\' —— 数据永远来自父组件的初始化参数。',
      '父组件传值：Tag({ label: this.direction }) —— 三个 Tag 引用同一状态即可联动。',
      '切换：this.direction = this.direction === \'全栈\' ? \'后端\' : \'全栈\'。',
    ],
    tests: [
      { name: '样例：切换方向', stdin: JSON.stringify([{ tap: '切换主攻方向' }]), expected: "__root__\n  Column \"# 后端# 后端# 后端切换主攻方向\" (space=12)\n    Row \"# 后端# 后端# 后端\" (space=8)\n      Tag \"# 后端\"\n        __root__\n          Text \"# 后端\" (fontSize=13, fontColor='#93c5fd', backgroundColor='#1e3a8a', borderRadius=10, padding=8)\n      Tag \"# 后端\"\n        __root__\n          Text \"# 后端\" (fontSize=13, fontColor='#93c5fd', backgroundColor='#1e3a8a', borderRadius=10, padding=8)\n      Tag \"# 后端\"\n        __root__\n          Text \"# 后端\" (fontSize=13, fontColor='#93c5fd', backgroundColor='#1e3a8a', borderRadius=10, padding=8)\n    Button \"切换主攻方向\" (fontSize=14)\n#renders Index=1, Tag=3\n#prefs {}" },
      { name: '检查：再切回来', stdin: JSON.stringify([{ tap: '切换主攻方向' }, { tap: '切换主攻方向' }]), expected: "__root__\n  Column \"# 全栈# 全栈# 全栈切换主攻方向\" (space=12)\n    Row \"# 全栈# 全栈# 全栈\" (space=8)\n      Tag \"# 全栈\"\n        __root__\n          Text \"# 全栈\" (fontSize=13, fontColor='#93c5fd', backgroundColor='#1e3a8a', borderRadius=10, padding=8)\n      Tag \"# 全栈\"\n        __root__\n          Text \"# 全栈\" (fontSize=13, fontColor='#93c5fd', backgroundColor='#1e3a8a', borderRadius=10, padding=8)\n      Tag \"# 全栈\"\n        __root__\n          Text \"# 全栈\" (fontSize=13, fontColor='#93c5fd', backgroundColor='#1e3a8a', borderRadius=10, padding=8)\n    Button \"切换主攻方向\" (fontSize=14)\n#renders Index=2, Tag=6\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"# 全栈# 全栈# 全栈切换主攻方向\" (space=12)\n    Row \"# 全栈# 全栈# 全栈\" (space=8)\n      Tag \"# 全栈\"\n        __root__\n          Text \"# 全栈\" (fontSize=13, fontColor='#93c5fd', backgroundColor='#1e3a8a', borderRadius=10, padding=8)\n      Tag \"# 全栈\"\n        __root__\n          Text \"# 全栈\" (fontSize=13, fontColor='#93c5fd', backgroundColor='#1e3a8a', borderRadius=10, padding=8)\n      Tag \"# 全栈\"\n        __root__\n          Text \"# 全栈\" (fontSize=13, fontColor='#93c5fd', backgroundColor='#1e3a8a', borderRadius=10, padding=8)\n    Button \"切换主攻方向\" (fontSize=14)\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ tap: '切换主攻方向' }]), expected: "__root__\n  Column \"# 后端# 后端# 后端切换主攻方向\" (space=12)\n    Row \"# 后端# 后端# 后端\" (space=8)\n      Tag \"# 后端\"\n        __root__\n          Text \"# 后端\" (fontSize=13, fontColor='#93c5fd', backgroundColor='#1e3a8a', borderRadius=10, padding=8)\n      Tag \"# 后端\"\n        __root__\n          Text \"# 后端\" (fontSize=13, fontColor='#93c5fd', backgroundColor='#1e3a8a', borderRadius=10, padding=8)\n      Tag \"# 后端\"\n        __root__\n          Text \"# 后端\" (fontSize=13, fontColor='#93c5fd', backgroundColor='#1e3a8a', borderRadius=10, padding=8)\n    Button \"切换主攻方向\" (fontSize=14)\n#renders Index=1, Tag=3\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-advanced-2',
    lang: 'harmony',
    module: 'advanced',
    order: 2,
    title: '@Link：父子双向绑定',
    difficulty: 3,
    xp: 25,
    goals: [
      '掌握 @Link 双向绑定与父组件 $ 前缀传值',
      '理解子组件可以「修改父组件的状态」',
      '学会把计数器/步进器抽成可复用子组件',
    ],
    brief: `## @Link：双向的水管

@Prop 是单向的，但有些场景子组件必须能**改父组件的状态** —— 步进器、开关、表单控件。\`@Link\` 就是双向绑定：子组件里改，父组件立刻同步；父组件改了，子组件也立刻刷新。

语法有个标志性记号：父组件传值时加 **$ 前缀** —— \`Stepper({ value: $this.count })\`，表示"传引用"而不是"传拷贝"。子组件声明 \`@Link value: number\` 后，\`this.value++\` 改的就是父组件的 count 本尊。

类比：@Prop 是**复印件**（改复印件不动原件），@Link 是**共享文档链接**（谁改都是同一份）。

> 💡 $ 前缀只用于 @Link 传值；@Prop 传值不加 $。用错前缀是最常见的编译报错来源。`,
    task: `## 任务：把步进器抽成子组件

1. 子组件 \`struct Stepper\`：\`@Link value: number\`；build 渲染 \`Row\`：两个 \`Button('-1')\`、\`Button('+1')\`（fontSize 16）与 \`Text(\\\`\${this.value}\\\`)\`（fontSize 20、width 48、textAlign(TextAlign.Center)）；
2. 两个按钮的 \`onClick\` 分别 \`this.value -= 1\`、\`this.value += 1\` —— 修改的是父组件状态；
3. 父组件 \`@State count: number = 5\`：\`Text(\\\`当前专注次数：\\\${this.count}\\\`)\`（fontSize 16）+ \`Stepper({ value: $this.count })\`。

**判题**：交互【+1 → +1 → -1】，父组件文本应变为「当前专注次数：6」。`,
    starter: `@Component
struct Stepper {
  // TODO: @Link value: number
  @Prop value: number = 0

  build() {
    Row({ space: 12 }) {
      Button('-1').fontSize(16)
      Text(\`\${this.value}\`).fontSize(20)
      Button('+1').fontSize(16)
    }
  }
}

@Entry
@Component
struct Index {
  @State count: number = 5

  build() {
    Column({ space: 12 }) {
      Text(\`当前专注次数：\${this.count}\`).fontSize(16)
      // TODO: Stepper({ value: $this.count }) —— 注意 $ 前缀
      Stepper({ value: this.count })
    }
  }
}`,
    solution: `@Component
struct Stepper {
  @Link value: number

  build() {
    Row({ space: 12 }) {
      Button('-1')
        .fontSize(16)
        .onClick(() => {
          this.value -= 1
        })
      Text(\`\${this.value}\`)
        .fontSize(20)
        .width(48)
        .textAlign(TextAlign.Center)
        .fontColor('#e2e8f0')
      Button('+1')
        .fontSize(16)
        .onClick(() => {
          this.value += 1
        })
    }
  }
}

@Entry
@Component
struct Index {
  @State count: number = 5

  build() {
    Column({ space: 12 }) {
      Text(\`当前专注次数：\${this.count}\`)
        .fontSize(16)
        .fontColor('#e2e8f0')
      Stepper({ value: $this.count })
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Component
struct Stepper {
  // TODO: @Link value: number
  @Prop value: number = 0

  build() {
    Row({ space: 12 }) {
      Button('-1').fontSize(16)
      Text(\`\${this.value}\`).fontSize(20)
      Button('+1').fontSize(16)
    }
  }
}

@Entry
@Component
struct Index {
  @State count: number = 5

  build() {
    Column({ space: 12 }) {
      Text(\`当前专注次数：\${this.count}\`).fontSize(16)
      // TODO: Stepper({ value: $this.count }) —— 注意 $ 前缀
      Stepper({ value: this.count })
    }
  }
}`,
      },
      solutions: {
        arkts: `@Component
struct Stepper {
  @Link value: number

  build() {
    Row({ space: 12 }) {
      Button('-1')
        .fontSize(16)
        .onClick(() => {
          this.value -= 1
        })
      Text(\`\${this.value}\`)
        .fontSize(20)
        .width(48)
        .textAlign(TextAlign.Center)
        .fontColor('#e2e8f0')
      Button('+1')
        .fontSize(16)
        .onClick(() => {
          this.value += 1
        })
    }
  }
}

@Entry
@Component
struct Index {
  @State count: number = 5

  build() {
    Column({ space: 12 }) {
      Text(\`当前专注次数：\${this.count}\`)
        .fontSize(16)
        .fontColor('#e2e8f0')
      Stepper({ value: $this.count })
    }
  }
}`,
      },
    },
    hints: [
      '子组件声明：@Link value: number（不加初始值 —— 它由父组件注入）。',
      '父组件传引用：Stepper({ value: $this.count }) —— $ 前缀是 @Link 的标志。',
      '子组件里 this.value -= 1 / this.value += 1 —— 改的就是父组件的 count。',
    ],
    tests: [
      { name: '样例：+1 +1 -1', stdin: JSON.stringify([{ tap: '+1' }, { tap: '+1' }, { tap: '-1' }]), expected: "__root__\n  Column \"当前专注次数：6-16+1\" (space=12)\n    Text \"当前专注次数：6\" (fontSize=16, fontColor='#e2e8f0')\n    Stepper \"-16+1\"\n      __root__\n        Row \"-16+1\" (space=12)\n          Button \"-1\" (fontSize=16)\n          Text \"6\" (fontSize=20, width=48, textAlign='center', fontColor='#e2e8f0')\n          Button \"+1\" (fontSize=16)\n#renders Index=3, Stepper=3\n#prefs {}" },
      { name: '检查：减到 0 以下', stdin: JSON.stringify([{ tap: '-1' }, { tap: '-1' }]), expected: "__root__\n  Column \"当前专注次数：3-13+1\" (space=12)\n    Text \"当前专注次数：3\" (fontSize=16, fontColor='#e2e8f0')\n    Stepper \"-13+1\"\n      __root__\n        Row \"-13+1\" (space=12)\n          Button \"-1\" (fontSize=16)\n          Text \"3\" (fontSize=20, width=48, textAlign='center', fontColor='#e2e8f0')\n          Button \"+1\" (fontSize=16)\n#renders Index=2, Stepper=2\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"当前专注次数：5-15+1\" (space=12)\n    Text \"当前专注次数：5\" (fontSize=16, fontColor='#e2e8f0')\n    Stepper \"-15+1\"\n      __root__\n        Row \"-15+1\" (space=12)\n          Button \"-1\" (fontSize=16)\n          Text \"5\" (fontSize=20, width=48, textAlign='center', fontColor='#e2e8f0')\n          Button \"+1\" (fontSize=16)\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ tap: '+1' }, { tap: '+1' }, { tap: '-1' }]), expected: "__root__\n  Column \"当前专注次数：6-16+1\" (space=12)\n    Text \"当前专注次数：6\" (fontSize=16, fontColor='#e2e8f0')\n    Stepper \"-16+1\"\n      __root__\n        Row \"-16+1\" (space=12)\n          Button \"-1\" (fontSize=16)\n          Text \"6\" (fontSize=20, width=48, textAlign='center', fontColor='#e2e8f0')\n          Button \"+1\" (fontSize=16)\n#renders Index=3, Stepper=3\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-advanced-3',
    lang: 'harmony',
    module: 'advanced',
    order: 3,
    title: '页面路由：列表页跳转详情页',
    difficulty: 4,
    xp: 30,
    goals: [
      '掌握 router.pushUrl 页面跳转与 params 传参',
      '掌握 router.getParams 在目标页取参',
      '理解多页面应用的页面栈模型',
    ],
    brief: `## 页面栈：多页面应用的骨架

真实应用都是多页面的：列表页点一条 → 详情页；设置页返回 → 首页。鸿蒙用 **router** 管理一个页面栈：\`router.pushUrl({ url, params })\` 入栈跳转并携带参数，\`router.back()\` 出栈返回。

参数在目标页用 \`router.getParams()\` 取回 —— 惯例是在 \`aboutToAppear\` 生命周期里取（页面"即将出现"时刻），存进自己的 @State。栈模型决定了返回的直觉：从哪来回哪去，栈顶永远是当前页。

类比：页面栈是**餐盘摞** —— push 放一个新盘子，back 拿走最上面的；getParams 是盘底的订单小票。

> 💡 路由目标必须提前注册（本平台由关卡 runtime 的 pages 表声明真实工程里在 main_pages.json 配置）。`,
    task: `## 任务：课程列表页 → 详情页

1. 父组件 \`@State courses\` 初始两条：\`{ title: 'ArkTS 状态管理', hours: 2 }\`、\`{ title: 'ArkUI 渲染原理', hours: 3 }\`（用对象字面量数组即可）；
2. \`ForEach\` 渲染 \`Button(course.title)\`：\`onClick\` 里 \`router.pushUrl({ url: 'pages/Detail', params: { title: course.title, hours: course.hours } })\`；
3. 定义第二个页面 \`struct Detail\`：\`@State title: string = ''\`、\`@State hours: number = 0\`；\`aboutToAppear()\` 里 \`const p = router.getParams() as Record<string, string | number>\` 后赋值；
4. Detail 渲染 \`Text(\\\`课程：\\\${this.title}\\\`)\`（fontSize 20）与 \`Text(\\\`预计学习 \\\${this.hours} 小时\\\`)\`（fontSize 14）与 \`Button('返回')\` → \`router.back()\`。

**判题**：交互【点击「ArkTS 状态管理」】，栈顶应为 Detail 页且参数正确。`,
    starter: `@Entry
@Component
struct Index {
  @State courses: object[] = [
    { title: 'ArkTS 状态管理', hours: 2 },
    { title: 'ArkUI 渲染原理', hours: 3 },
  ]

  build() {
    Column({ space: 10 }) {
      Text('课程列表').fontSize(20)
      // TODO: ForEach + Button 跳转 Detail 并传参
      ForEach(this.courses, (c: object) => {
        Button('待跳转')
      }, (c: object, idx: number) => idx.toString())
    }
  }
}

@Component
struct Detail {
  @State title: string = ''
  @State hours: number = 0

  // TODO: aboutToAppear 里 router.getParams() 取参
  build() {
    Column({ space: 10 }) {
      Text('课程详情').fontSize(20)
      Button('返回').onClick(() => {
        router.back()
      })
    }
  }
}`,
    solution: `@Entry
@Component
struct Index {
  @State courses: object[] = [
    { title: 'ArkTS 状态管理', hours: 2 },
    { title: 'ArkUI 渲染原理', hours: 3 },
  ]

  build() {
    Column({ space: 10 }) {
      Text('课程列表')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      ForEach(this.courses, (c: object) => {
        Button(c.title)
          .fontSize(15)
          .onClick(() => {
            router.pushUrl({ url: 'pages/Detail', params: { title: c.title, hours: c.hours } })
          })
      }, (c: object) => c.title)
    }
  }
}

@Component
struct Detail {
  @State title: string = ''
  @State hours: number = 0

  aboutToAppear() {
    const p = router.getParams() as Record<string, string | number>
    this.title = p.title
    this.hours = p.hours
  }

  build() {
    Column({ space: 10 }) {
      Text(\`课程：\${this.title}\`)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      Text(\`预计学习 \${this.hours} 小时\`)
        .fontSize(14)
        .fontColor('#94a3b8')
      Button('返回')
        .fontSize(14)
        .onClick(() => {
          router.back()
        })
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Entry
@Component
struct Index {
  @State courses: object[] = [
    { title: 'ArkTS 状态管理', hours: 2 },
    { title: 'ArkUI 渲染原理', hours: 3 },
  ]

  build() {
    Column({ space: 10 }) {
      Text('课程列表').fontSize(20)
      // TODO: ForEach + Button 跳转 Detail 并传参
      ForEach(this.courses, (c: object) => {
        Button('待跳转')
      }, (c: object, idx: number) => idx.toString())
    }
  }
}

@Component
struct Detail {
  @State title: string = ''
  @State hours: number = 0

  // TODO: aboutToAppear 里 router.getParams() 取参
  build() {
    Column({ space: 10 }) {
      Text('课程详情').fontSize(20)
      Button('返回').onClick(() => {
        router.back()
      })
    }
  }
}`,
      },
      solutions: {
        arkts: `@Entry
@Component
struct Index {
  @State courses: object[] = [
    { title: 'ArkTS 状态管理', hours: 2 },
    { title: 'ArkUI 渲染原理', hours: 3 },
  ]

  build() {
    Column({ space: 10 }) {
      Text('课程列表')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      ForEach(this.courses, (c: object) => {
        Button(c.title)
          .fontSize(15)
          .onClick(() => {
            router.pushUrl({ url: 'pages/Detail', params: { title: c.title, hours: c.hours } })
          })
      }, (c: object) => c.title)
    }
  }
}

@Component
struct Detail {
  @State title: string = ''
  @State hours: number = 0

  aboutToAppear() {
    const p = router.getParams() as Record<string, string | number>
    this.title = p.title
    this.hours = p.hours
  }

  build() {
    Column({ space: 10 }) {
      Text(\`课程：\${this.title}\`)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      Text(\`预计学习 \${this.hours} 小时\`)
        .fontSize(14)
        .fontColor('#94a3b8')
      Button('返回')
        .fontSize(14)
        .onClick(() => {
          router.back()
        })
    }
  }
}`,
      },
    },
    hints: [
      '跳转：router.pushUrl({ url: \'pages/Detail\', params: { title: c.title, hours: c.hours } })。',
      '取参：aboutToAppear 里 const p = router.getParams() as Record<string, string | number>。',
      'ForEach 的数组元素是对象时，模板串取字段：Button(c.title)。',
    ],
    tests: [
      { name: '样例：跳转详情页', stdin: JSON.stringify([{ tap: 'ArkTS 状态管理' }]), expected: "__root__\n  Column \"课程：ArkTS 状态管理预计学习 2 小时返回\" (space=10)\n    Text \"课程：ArkTS 状态管理\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"预计学习 2 小时\" (fontSize=14, fontColor='#94a3b8')\n    Button \"返回\" (fontSize=14)\n#renders Detail=1\n#prefs {}" },
      { name: '检查：第二条课程', stdin: JSON.stringify([{ tap: 'ArkUI 渲染原理' }]), expected: "__root__\n  Column \"课程：ArkUI 渲染原理预计学习 3 小时返回\" (space=10)\n    Text \"课程：ArkUI 渲染原理\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"预计学习 3 小时\" (fontSize=14, fontColor='#94a3b8')\n    Button \"返回\" (fontSize=14)\n#renders Detail=1\n#prefs {}" },
      { name: '检查：返回后栈顶', stdin: JSON.stringify([{ tap: 'ArkTS 状态管理' }, { back: true }]), expected: "__root__\n  Column \"课程列表ArkTS 状态管理ArkUI 渲染原理\" (space=10)\n    Text \"课程列表\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n    Button \"ArkTS 状态管理\" (fontSize=15)\n    Button \"ArkUI 渲染原理\" (fontSize=15)\n#renders Detail=1\n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ tap: 'ArkTS 状态管理' }]), expected: "__root__\n  Column \"课程：ArkTS 状态管理预计学习 2 小时返回\" (space=10)\n    Text \"课程：ArkTS 状态管理\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"预计学习 2 小时\" (fontSize=14, fontColor='#94a3b8')\n    Button \"返回\" (fontSize=14)\n#renders Detail=1\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index', 'pages/Detail': 'Detail' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-advanced-4',
    lang: 'harmony',
    module: 'advanced',
    order: 4,
    title: 'AppStorage：全局状态与应用主题',
    difficulty: 3,
    xp: 25,
    goals: [
      '掌握 AppStorage.setOrCreate / get 的全局状态读写',
      '掌握 @StorageLink 与全局状态的双向绑定',
      '理解「页面级状态」与「应用级状态」的边界',
    ],
    brief: `## AppStorage：整个应用的公告板

页面里的 @State 只属于当前组件；换一页就没了。**应用级状态** —— 主题、登录态、全局设置 —— 放在 \`AppStorage\`：一个所有页面共享的键值仓库。\`AppStorage.setOrCreate('theme', 'dark')\` 写入，任何页面 \`AppStorage.get('theme')\` 读取。

更优雅的用法是 \`@StorageLink('theme')\`：把这个键和组件字段**双向绑定** —— 字段变了仓库自动更新，仓库变了所有链接它的页面同步刷新。主题切换就是最经典的用例：一行改颜色，全应用换装。

类比：AppStorage 是**大楼公告栏** —— 每层楼（页面）都看得见；@StorageLink 是贴在你家门上的**抄送副本**，谁更新公告，副本自动换新。

> 💡 分界线：只在单个页面用的数据放 @State；跨页面的放 AppStorage。别把一切都塞进全局。`,
    task: `## 任务：一键切换深浅主题

1. \`@StorageLink('theme') theme: string = 'dark'\`；
2. \`Text('当前主题：' + this.theme)\`：\`fontSize(16)\`、\`fontColor(this.theme === 'dark' ? '#e5e7eb' : '#111827')\`；
3. \`Button(this.theme === 'dark' ? '☀ 切换浅色' : '🌙 切换深色')\`：\`fontSize(15)\`、\`onClick\` 里 \`this.theme = this.theme === 'dark' ? 'light' : 'dark'\`；
4. \`Text('鸿蒙，万物智联。')\`：\`fontSize(24)\`、\`fontColor(this.theme === 'dark' ? '#f8fafc' : '#0f172a')\` —— 主文案随主题换色。

**判题**：交互【点击切换主题】，两处文本的颜色属性应随主题翻转（dump 中 fontColor 变化）。`,
    starter: `@Entry
@Component
struct Index {
  // TODO: @StorageLink('theme') theme: string = 'dark'
  @State theme: string = 'dark'

  build() {
    Column({ space: 16 }) {
      // TODO: 主题文本、切换按钮（fontColor 随主题）、主文案
      Text('当前主题：dark').fontSize(16)
      Button('☀ 切换浅色').fontSize(15)
    }
  }
}`,
    solution: `@Entry
@Component
struct Index {
  @StorageLink('theme') theme: string = 'dark'

  build() {
    Column({ space: 16 }) {
      Text('当前主题：' + this.theme)
        .fontSize(16)
        .fontColor(this.theme === 'dark' ? '#e5e7eb' : '#111827')
      Button(this.theme === 'dark' ? '☀ 切换浅色' : '🌙 切换深色')
        .fontSize(15)
        .onClick(() => {
          this.theme = this.theme === 'dark' ? 'light' : 'dark'
        })
      Text('鸿蒙，万物智联。')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor(this.theme === 'dark' ? '#f8fafc' : '#0f172a')
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Entry
@Component
struct Index {
  // TODO: @StorageLink('theme') theme: string = 'dark'
  @State theme: string = 'dark'

  build() {
    Column({ space: 16 }) {
      // TODO: 主题文本、切换按钮（fontColor 随主题）、主文案
      Text('当前主题：dark').fontSize(16)
      Button('☀ 切换浅色').fontSize(15)
    }
  }
}`,
      },
      solutions: {
        arkts: `@Entry
@Component
struct Index {
  @StorageLink('theme') theme: string = 'dark'

  build() {
    Column({ space: 16 }) {
      Text('当前主题：' + this.theme)
        .fontSize(16)
        .fontColor(this.theme === 'dark' ? '#e5e7eb' : '#111827')
      Button(this.theme === 'dark' ? '☀ 切换浅色' : '🌙 切换深色')
        .fontSize(15)
        .onClick(() => {
          this.theme = this.theme === 'dark' ? 'light' : 'dark'
        })
      Text('鸿蒙，万物智联。')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor(this.theme === 'dark' ? '#f8fafc' : '#0f172a')
    }
  }
}`,
      },
    },
    hints: [
      '@StorageLink(\'theme\') theme: string = \'dark\' —— 字段名即 AppStorage 的键。',
      '切换：this.theme = this.theme === \'dark\' ? \'light\' : \'dark\' —— 双向绑定会同步回 AppStorage。',
      '两处 Text 的 fontColor 都写成三元表达式 —— 断言它们随主题翻转。',
    ],
    tests: [
      { name: '样例：切换到浅色', stdin: JSON.stringify([{ tap: '切换浅色' }]), expected: "__root__\n  Column \"当前主题：light🌙 切换深色鸿蒙，万物智联。\" (space=16)\n    Text \"当前主题：light\" (fontSize=16, fontColor='#111827')\n    Button \"🌙 切换深色\" (fontSize=15)\n    Text \"鸿蒙，万物智联。\" (fontSize=24, fontWeight='bold', fontColor='#0f172a')\n#renders Index=1\n#prefs {}" },
      { name: '检查：切回深色', stdin: JSON.stringify([{ tap: '切换浅色' }, { tap: '切换深色' }]), expected: "__root__\n  Column \"当前主题：dark☀ 切换浅色鸿蒙，万物智联。\" (space=16)\n    Text \"当前主题：dark\" (fontSize=16, fontColor='#e5e7eb')\n    Button \"☀ 切换浅色\" (fontSize=15)\n    Text \"鸿蒙，万物智联。\" (fontSize=24, fontWeight='bold', fontColor='#f8fafc')\n#renders Index=2\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"当前主题：dark☀ 切换浅色鸿蒙，万物智联。\" (space=16)\n    Text \"当前主题：dark\" (fontSize=16, fontColor='#e5e7eb')\n    Button \"☀ 切换浅色\" (fontSize=15)\n    Text \"鸿蒙，万物智联。\" (fontSize=24, fontWeight='bold', fontColor='#f8fafc')\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ tap: '切换浅色' }]), expected: "__root__\n  Column \"当前主题：light🌙 切换深色鸿蒙，万物智联。\" (space=16)\n    Text \"当前主题：light\" (fontSize=16, fontColor='#111827')\n    Button \"🌙 切换深色\" (fontSize=15)\n    Text \"鸿蒙，万物智联。\" (fontSize=24, fontWeight='bold', fontColor='#0f172a')\n#renders Index=1\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
];
