import type { Level } from '@/types';

/**
 * 鸿蒙应用开发 · 第二章：状态驱动与列表（paradigm，4 关）。
 * ForEach 渲染、不可变数组更新、Checkbox 交互、实时过滤 —— 真实清单类应用的骨架。
 */
export const HARMONY_PARADIGM: Level[] = [
  {
    id: 'harmony-paradigm-1',
    lang: 'harmony',
    module: 'paradigm',
    order: 1,
    title: '渲染待办清单：ForEach 的三要素',
    difficulty: 2,
    xp: 20,
    goals: [
      '掌握 ForEach(arr, itemGenerator, keyGenerator) 三要素',
      '理解 itemGenerator 的 (item, idx) 双参数与序号展示',
      '理解 keyGenerator 对列表复用的意义',
    ],
    brief: `## ForEach：把数组画成界面

列表是应用的半壁江山，ArkUI 用 \`ForEach\` 渲染数组。它有三要素：**数组**（渲染谁）、**itemGenerator**（每项长什么样，参数是 \`(item, idx)\`）、**keyGenerator**（每项的钥匙，帮助框架识别谁是谁）。

key 看似可有可无，实则决定列表的"记忆"：框架靠 key 判断哪些项需要更新、哪些可以复用。用稳定的业务 id（或唯一内容）作 key，列表行为才可预期 —— 用 index 作 key 在增删时会闹出状态错位的事故（踩坑章细说）。

类比：ForEach 是**点名册** —— 数组是学生名单，itemGenerator 是座位安排，key 是学号。学号错了，点名就乱。

> 💡 序号展示用第二参数：\`Text(\\\`\${idx + 1}. \${item}\\\`)\` —— 记住 +1，程序员从 0 开始数。`,
    task: `## 任务：渲染今日学习清单

1. \`@State items: string[] = ['搭建 ArkTS 环境', '学会声明式 UI', '跑通第一个页面']\`；
2. \`ForEach(this.items, (item: string) => { ... }, (item: string) => item)\`；
3. itemGenerator 内渲染 \`Text(\\\`\${idx + 1}. \${item}\\\`)\`（需要第二参数 idx）：\`fontSize(15)\`、\`fontColor('#e2e8f0')\`；
4. 外层先放标题 \`Text('今日清单')\`：\`fontSize(20)\`、\`fontWeight(FontWeight.Bold)\`。

**判题**：比对渲染树 —— 三条序号清单项 + 标题。`,
    starter: `@Entry
@Component
struct Index {
  @State items: string[] = ['搭建 ArkTS 环境', '学会声明式 UI', '跑通第一个页面']

  build() {
    Column({ space: 8 }) {
      Text('今日清单').fontSize(20)
      // TODO: ForEach 渲染 items —— 带 idx 序号与 key
      Text('（清单待渲染）')
    }
  }
}`,
    solution: `@Entry
@Component
struct Index {
  @State items: string[] = ['搭建 ArkTS 环境', '学会声明式 UI', '跑通第一个页面']

  build() {
    Column({ space: 8 }) {
      Text('今日清单')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      ForEach(this.items, (item: string, idx: number) => {
        Text(\`\${idx + 1}. \${item}\`)
          .fontSize(15)
          .fontColor('#e2e8f0')
      }, (item: string) => item)
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Entry
@Component
struct Index {
  @State items: string[] = ['搭建 ArkTS 环境', '学会声明式 UI', '跑通第一个页面']

  build() {
    Column({ space: 8 }) {
      Text('今日清单').fontSize(20)
      // TODO: ForEach 渲染 items —— 带 idx 序号与 key
      Text('（清单待渲染）')
    }
  }
}`,
      },
      solutions: {
        arkts: `@Entry
@Component
struct Index {
  @State items: string[] = ['搭建 ArkTS 环境', '学会声明式 UI', '跑通第一个页面']

  build() {
    Column({ space: 8 }) {
      Text('今日清单')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#e2e8f0')
      ForEach(this.items, (item: string, idx: number) => {
        Text(\`\${idx + 1}. \${item}\`)
          .fontSize(15)
          .fontColor('#e2e8f0')
      }, (item: string) => item)
    }
  }
}`,
      },
    },
    hints: [
      'ForEach 三要素：数组、item 生成器、key 生成器 —— key 返回 item 本身（本关内容唯一）。',
      'itemGenerator 双参数：(item: string, idx: number) => { ... }，idx 从 0 开始。',
      '序号模板串：Text(`\${idx + 1}. \${item}`) —— 模板串里也能用表达式。',
    ],
    tests: [
      { name: '样例：清单渲染', stdin: '[]', expected: "__root__\n  Column \"今日清单1. 搭建 ArkTS 环境2. 学会声明式 UI3. 跑通第一个页面\" (space=8)\n    Text \"今日清单\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"1. 搭建 ArkTS 环境\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"2. 学会声明式 UI\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"3. 跑通第一个页面\" (fontSize=15, fontColor='#e2e8f0')\n#renders \n#prefs {}" },
      { name: '检查：序号与内容', stdin: '[]', expected: "__root__\n  Column \"今日清单1. 搭建 ArkTS 环境2. 学会声明式 UI3. 跑通第一个页面\" (space=8)\n    Text \"今日清单\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"1. 搭建 ArkTS 环境\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"2. 学会声明式 UI\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"3. 跑通第一个页面\" (fontSize=15, fontColor='#e2e8f0')\n#renders \n#prefs {}" },
      { name: '检查：标题样式', stdin: '[]', expected: "__root__\n  Column \"今日清单1. 搭建 ArkTS 环境2. 学会声明式 UI3. 跑通第一个页面\" (space=8)\n    Text \"今日清单\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"1. 搭建 ArkTS 环境\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"2. 学会声明式 UI\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"3. 跑通第一个页面\" (fontSize=15, fontColor='#e2e8f0')\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: '[]', expected: "__root__\n  Column \"今日清单1. 搭建 ArkTS 环境2. 学会声明式 UI3. 跑通第一个页面\" (space=8)\n    Text \"今日清单\" (fontSize=20, fontWeight='bold', fontColor='#e2e8f0')\n    Text \"1. 搭建 ArkTS 环境\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"2. 学会声明式 UI\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"3. 跑通第一个页面\" (fontSize=15, fontColor='#e2e8f0')\n#renders \n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-paradigm-2',
    lang: 'harmony',
    module: 'paradigm',
    order: 2,
    title: '添加与删除：不可变数组更新',
    difficulty: 3,
    xp: 25,
    goals: [
      '掌握 TextInput 受控输入（onChange 同步 @State）',
      '理解不可变更新：push 的替代写法 this.list = [...this.list, x]',
      '学会 filter 删除数组指定项',
    ],
    brief: `## 不可变更新：数组的正确打开方式

\`@State\` 装饰的数组，用 \`push\` 追加**不会触发界面更新** —— 这是 ArkUI 状态管理最著名的坑（其机制：@State 观察的是引用变化）。正确姿势是**不可变更新**：每次都创建新数组替换引用 —— 添加用 \`this.list = [...this.list, newItem]\`，删除用 \`this.list = this.list.filter(...)\`。

\`TextInput({ text: this.draft })\` 配合 \`.onChange(v => this.draft = v)\` 构成**受控输入**：输入框的值和状态永远同步。点「添加」时校验非空、追加、清空草稿 —— 一气呵成。

类比：@State 像档案室的**卷宗封皮** —— 往旧卷宗里塞纸（push）无人知晓，换一份新封皮（重新赋值）档案室才会通知所有借阅人。

> 💡 踩坑章会专门剖析这个坑的机制；本关先把正确写法练成肌肉记忆。`,
    task: `## 任务：可增删的学习清单

1. \`@State list: string[] = ['搭建环境']\`、\`@State draft: string = ''\`；
2. \`TextInput({ placeholder: '要学什么？', text: this.draft })\` + \`.onChange((v: string) => { this.draft = v })\`；
3. \`Button('添加')\`：\`onClick\` 里校验 \`this.draft.length > 0\` 后追加并清空 —— \`this.list = [...this.list, this.draft]\`、\`this.draft = ''\`；
4. \`ForEach\` 渲染列表，每项配 \`Button('×')\`：\`onClick\` 里 \`this.list = this.list.filter((x: string) => x !== item)\`；
5. 文本项与删除钮放同一 \`Row\` 内。

**判题**：交互【输入「学状态管理」→ 添加 → 点 × 删除两项】，比对最终列表。`,
    starter: `@Entry
@Component
struct Index {
  @State list: string[] = ['搭建环境']
  @State draft: string = ''

  build() {
    Column({ space: 10 }) {
      TextInput({ placeholder: '要学什么？', text: this.draft })
        .onChange((v: string) => {
          this.draft = v
        })
      // TODO 1: 添加按钮 —— 校验非空、不可变追加、清空草稿
      // TODO 2: ForEach 渲染 + 每项 × 删除按钮（filter）
      ForEach(this.list, (item: string) => {
        Text(item)
      }, (item: string) => item)
    }
  }
}`,
    solution: `@Entry
@Component
struct Index {
  @State list: string[] = ['搭建环境']
  @State draft: string = ''

  build() {
    Column({ space: 10 }) {
      TextInput({ placeholder: '要学什么？', text: this.draft })
        .onChange((v: string) => {
          this.draft = v
        })
      Button('添加')
        .fontSize(14)
        .onClick(() => {
          if (this.draft.length > 0) {
            this.list = [...this.list, this.draft]
            this.draft = ''
          }
        })
      ForEach(this.list, (item: string) => {
        Row({ space: 8 }) {
          Text(item)
            .fontSize(15)
            .fontColor('#e2e8f0')
          Button('×')
            .fontSize(12)
            .backgroundColor('#7f1d1d')
            .fontColor('#fca5a5')
            .onClick(() => {
              this.list = this.list.filter((x: string) => x !== item)
            })
        }
      }, (item: string) => item)
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Entry
@Component
struct Index {
  @State list: string[] = ['搭建环境']
  @State draft: string = ''

  build() {
    Column({ space: 10 }) {
      TextInput({ placeholder: '要学什么？', text: this.draft })
        .onChange((v: string) => {
          this.draft = v
        })
      // TODO 1: 添加按钮 —— 校验非空、不可变追加、清空草稿
      // TODO 2: ForEach 渲染 + 每项 × 删除按钮（filter）
      ForEach(this.list, (item: string) => {
        Text(item)
      }, (item: string) => item)
    }
  }
}`,
      },
      solutions: {
        arkts: `@Entry
@Component
struct Index {
  @State list: string[] = ['搭建环境']
  @State draft: string = ''

  build() {
    Column({ space: 10 }) {
      TextInput({ placeholder: '要学什么？', text: this.draft })
        .onChange((v: string) => {
          this.draft = v
        })
      Button('添加')
        .fontSize(14)
        .onClick(() => {
          if (this.draft.length > 0) {
            this.list = [...this.list, this.draft]
            this.draft = ''
          }
        })
      ForEach(this.list, (item: string) => {
        Row({ space: 8 }) {
          Text(item)
            .fontSize(15)
            .fontColor('#e2e8f0')
          Button('×')
            .fontSize(12)
            .backgroundColor('#7f1d1d')
            .fontColor('#fca5a5')
            .onClick(() => {
              this.list = this.list.filter((x: string) => x !== item)
            })
        }
      }, (item: string) => item)
    }
  }
}`,
      },
    },
    hints: [
      '追加：this.list = [...this.list, this.draft] —— 展开旧数组构造新数组，引用变化触发刷新。',
      '删除：this.list = this.list.filter((x: string) => x !== item) —— item 来自 ForEach 闭包参数。',
      '添加成功后记得 this.draft = \'\' 清空输入框。',
    ],
    tests: [
      { name: '样例：添加后删除', stdin: JSON.stringify([{ input: '学状态管理' }, { tap: '添加' }, { tap: '×' }, { tap: '×' }]), expected: "__root__\n  Column \"添加\" (space=10)\n    TextInput (placeholder='要学什么？', text='')\n    Button \"添加\" (fontSize=14)\n#renders Index=4\n#prefs {}" },
      { name: '检查：空草稿不添加', stdin: JSON.stringify([{ tap: '添加' }]), expected: "__root__\n  Column \"添加搭建环境×\" (space=10)\n    TextInput (placeholder='要学什么？', text='')\n    Button \"添加\" (fontSize=14)\n    Row \"搭建环境×\" (space=8)\n      Text \"搭建环境\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"×\" (fontSize=12, backgroundColor='#7f1d1d', fontColor='#fca5a5')\n#renders Index=1\n#prefs {}" },
      { name: '检查：连续添加', stdin: JSON.stringify([{ input: 'A' }, { tap: '添加' }, { input: 'B' }, { tap: '添加' }]), expected: "__root__\n  Column \"添加搭建环境×A×B×\" (space=10)\n    TextInput (placeholder='要学什么？', text='')\n    Button \"添加\" (fontSize=14)\n    Row \"搭建环境×\" (space=8)\n      Text \"搭建环境\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"×\" (fontSize=12, backgroundColor='#7f1d1d', fontColor='#fca5a5')\n    Row \"A×\" (space=8)\n      Text \"A\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"×\" (fontSize=12, backgroundColor='#7f1d1d', fontColor='#fca5a5')\n    Row \"B×\" (space=8)\n      Text \"B\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"×\" (fontSize=12, backgroundColor='#7f1d1d', fontColor='#fca5a5')\n#renders Index=4\n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ input: '学状态管理' }, { tap: '添加' }, { tap: '×' }, { tap: '×' }]), expected: "__root__\n  Column \"添加\" (space=10)\n    TextInput (placeholder='要学什么？', text='')\n    Button \"添加\" (fontSize=14)\n#renders Index=4\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-paradigm-3',
    lang: 'harmony',
    module: 'paradigm',
    order: 3,
    title: '完成度统计：Checkbox 与派生数据',
    difficulty: 3,
    xp: 25,
    goals: [
      '掌握对象数组的状态管理：勾选后用 map 不可变替换',
      '理解派生数据：完成数直接从状态计算，不重复存储',
      '学会条件提示（全部完成 vs 进行中）',
    ],
    brief: `## 派生数据：算出来的，不是存出来的

任务列表里"已完成几项"要不要也存一个 @State？**不要。** 它能从列表直接算出来 —— \`this.tasks.filter(t => t.done).length\`。凡是能从现有状态推导的值都叫**派生数据**，派生数据存起来就是埋雷：源变了忘了同步，两份数据打架。

对象数组的勾选更新也要走不可变路线：\`this.tasks = this.tasks.map(t => t.id === id ? { ...t, done: checked } : t)\` —— map 造出新数组，命中的项用展开符替换字段。这就是"改一份拷贝、替换整份引用"。

类比：派生数据是**小计** —— 购物车总价从商品算出来，绝不手工维护第二个数字，否则对账必出事。

> 💡 Checkbox 的 onChange 回调参数是布尔值，直接作为 done 的新值。`,
    task: `## 任务：学习任务完成度看板

1. 定义 \`interface Task { id: number; name: string; done: boolean }\`；\`@State tasks: Task[]\` 初始三条（id 1/2/3，done 全 false，名称自拟如 '学 ArkTS'、'写 Demo'、'复盘'）；
2. \`ForEach\` 渲染每项：\`Checkbox(task.name)\` + \`.onChange((v: boolean) => { ... map 不可变更新 ... })\` + \`Text(\\\`\${task.done ? '☑' : '☐'} \${task.name}\\\`)\`；
3. 派生统计 \`Text(\\\`已完成 \${doneCount}/\\\${this.tasks.length}\\\`)\` —— \`doneCount\` 在 build 前用属性或直接在模板里 filter().length 计算（提示：可在 build 里先 \`const doneCount = ...\`？本模拟器推荐直接在模板串中写 \`this.tasks.filter((t: Task) => t.done).length\`）；
4. \`if\` 全部完成时追加 \`Text('全部搞定，休息一下 🎉')\`。

**判题**：交互【勾选第 1、2 项】，比对统计与每项勾选标记。`,
    starter: `interface Task {
  id: number
  name: string
  done: boolean
}

@Entry
@Component
struct Index {
  @State tasks: Task[] = [
    { id: 1, name: '学 ArkTS', done: false },
    { id: 2, name: '写 Demo', done: false },
    { id: 3, name: '复盘', done: false },
  ]

  build() {
    Column({ space: 8 }) {
      // TODO: ForEach + Checkbox 勾选（map 不可变更新）+ 统计与条件提示
      ForEach(this.tasks, (task: Task) => {
        Text(\`☐ \${task.name}\`)
      }, (task: Task) => task.id.toString())
    }
  }
}`,
    solution: `interface Task {
  id: number
  name: string
  done: boolean
}

@Entry
@Component
struct Index {
  @State tasks: Task[] = [
    { id: 1, name: '学 ArkTS', done: false },
    { id: 2, name: '写 Demo', done: false },
    { id: 3, name: '复盘', done: false },
  ]

  build() {
    Column({ space: 8 }) {
      ForEach(this.tasks, (task: Task) => {
        Row({ space: 8 }) {
          Checkbox(task.name)
            .onChange((v: boolean) => {
              this.tasks = this.tasks.map((t: Task) => t.id === task.id ? { ...t, done: v } : t)
            })
          Text(\`\${task.done ? '☑' : '☐'} \${task.name}\`)
            .fontSize(15)
            .fontColor('#e2e8f0')
        }
      }, (task: Task) => task.id.toString())
      Text(\`已完成 \${this.tasks.filter((t: Task) => t.done).length}/\${this.tasks.length}\`)
        .fontSize(14)
        .fontColor('#94a3b8')
      if (this.tasks.filter((t: Task) => t.done).length === this.tasks.length) {
        Text('全部搞定，休息一下 🎉')
          .fontSize(15)
          .fontColor('#22c55e')
      }
    }
  }
}`,
    algo: {
      starters: {
        arkts: `interface Task {
  id: number
  name: string
  done: boolean
}

@Entry
@Component
struct Index {
  @State tasks: Task[] = [
    { id: 1, name: '学 ArkTS', done: false },
    { id: 2, name: '写 Demo', done: false },
    { id: 3, name: '复盘', done: false },
  ]

  build() {
    Column({ space: 8 }) {
      // TODO: ForEach + Checkbox 勾选（map 不可变更新）+ 统计与条件提示
      ForEach(this.tasks, (task: Task) => {
        Text(\`☐ \${task.name}\`)
      }, (task: Task) => task.id.toString())
    }
  }
}`,
      },
      solutions: {
        arkts: `interface Task {
  id: number
  name: string
  done: boolean
}

@Entry
@Component
struct Index {
  @State tasks: Task[] = [
    { id: 1, name: '学 ArkTS', done: false },
    { id: 2, name: '写 Demo', done: false },
    { id: 3, name: '复盘', done: false },
  ]

  build() {
    Column({ space: 8 }) {
      ForEach(this.tasks, (task: Task) => {
        Row({ space: 8 }) {
          Checkbox(task.name)
            .onChange((v: boolean) => {
              this.tasks = this.tasks.map((t: Task) => t.id === task.id ? { ...t, done: v } : t)
            })
          Text(\`\${task.done ? '☑' : '☐'} \${task.name}\`)
            .fontSize(15)
            .fontColor('#e2e8f0')
        }
      }, (task: Task) => task.id.toString())
      Text(\`已完成 \${this.tasks.filter((t: Task) => t.done).length}/\${this.tasks.length}\`)
        .fontSize(14)
        .fontColor('#94a3b8')
      if (this.tasks.filter((t: Task) => t.done).length === this.tasks.length) {
        Text('全部搞定，休息一下 🎉')
          .fontSize(15)
          .fontColor('#22c55e')
      }
    }
  }
}`,
      },
    },
    hints: [
      '不可变勾选：this.tasks = this.tasks.map((t: Task) => t.id === task.id ? { ...t, done: v } : t)。',
      '派生统计直接写在模板串：`已完成 ${this.tasks.filter((t: Task) => t.done).length}/${this.tasks.length}`。',
      'Checkbox(task.name) 的 onChange 回调参数 v 是 boolean —— 直接赋给 done。',
    ],
    tests: [
      { name: '样例：勾选两项', stdin: JSON.stringify([{ input: [true, 0] }, { input: [true, 1] }]), expected: "__root__\n  Column \"学 ArkTS☑ 学 ArkTS写 Demo☑ 写 Demo复盘☐ 复盘已完成 2/3\" (space=8)\n    Row \"学 ArkTS☑ 学 ArkTS\" (space=8)\n      Checkbox \"学 ArkTS\"\n      Text \"☑ 学 ArkTS\" (fontSize=15, fontColor='#e2e8f0')\n    Row \"写 Demo☑ 写 Demo\" (space=8)\n      Checkbox \"写 Demo\"\n      Text \"☑ 写 Demo\" (fontSize=15, fontColor='#e2e8f0')\n    Row \"复盘☐ 复盘\" (space=8)\n      Checkbox \"复盘\"\n      Text \"☐ 复盘\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"已完成 2/3\" (fontSize=14, fontColor='#94a3b8')\n#renders Index=2\n#prefs {}" },
      { name: '检查：取消勾选', stdin: JSON.stringify([{ input: [true, 0] }, { input: [false, 0] }]), expected: "__root__\n  Column \"学 ArkTS☐ 学 ArkTS写 Demo☐ 写 Demo复盘☐ 复盘已完成 0/3\" (space=8)\n    Row \"学 ArkTS☐ 学 ArkTS\" (space=8)\n      Checkbox \"学 ArkTS\"\n      Text \"☐ 学 ArkTS\" (fontSize=15, fontColor='#e2e8f0')\n    Row \"写 Demo☐ 写 Demo\" (space=8)\n      Checkbox \"写 Demo\"\n      Text \"☐ 写 Demo\" (fontSize=15, fontColor='#e2e8f0')\n    Row \"复盘☐ 复盘\" (space=8)\n      Checkbox \"复盘\"\n      Text \"☐ 复盘\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"已完成 0/3\" (fontSize=14, fontColor='#94a3b8')\n#renders Index=2\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"学 ArkTS☐ 学 ArkTS写 Demo☐ 写 Demo复盘☐ 复盘已完成 0/3\" (space=8)\n    Row \"学 ArkTS☐ 学 ArkTS\" (space=8)\n      Checkbox \"学 ArkTS\"\n      Text \"☐ 学 ArkTS\" (fontSize=15, fontColor='#e2e8f0')\n    Row \"写 Demo☐ 写 Demo\" (space=8)\n      Checkbox \"写 Demo\"\n      Text \"☐ 写 Demo\" (fontSize=15, fontColor='#e2e8f0')\n    Row \"复盘☐ 复盘\" (space=8)\n      Checkbox \"复盘\"\n      Text \"☐ 复盘\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"已完成 0/3\" (fontSize=14, fontColor='#94a3b8')\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ input: [true, 0] }, { input: [true, 1] }, { input: [true, 2] }]), expected: "__root__\n  Column \"学 ArkTS☑ 学 ArkTS写 Demo☑ 写 Demo复盘☑ 复盘已完成 3/3全部搞定，休息一下 🎉\" (space=8)\n    Row \"学 ArkTS☑ 学 ArkTS\" (space=8)\n      Checkbox \"学 ArkTS\"\n      Text \"☑ 学 ArkTS\" (fontSize=15, fontColor='#e2e8f0')\n    Row \"写 Demo☑ 写 Demo\" (space=8)\n      Checkbox \"写 Demo\"\n      Text \"☑ 写 Demo\" (fontSize=15, fontColor='#e2e8f0')\n    Row \"复盘☑ 复盘\" (space=8)\n      Checkbox \"复盘\"\n      Text \"☑ 复盘\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"已完成 3/3\" (fontSize=14, fontColor='#94a3b8')\n    Text \"全部搞定，休息一下 🎉\" (fontSize=15, fontColor='#22c55e')\n#renders Index=3\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-paradigm-4',
    lang: 'harmony',
    module: 'paradigm',
    order: 4,
    title: '实时搜索：状态驱动的过滤列表',
    difficulty: 3,
    xp: 25,
    goals: [
      '掌握「一个输入框 + filter」构成的实时搜索模式',
      '理解派生列表：过滤结果不存储，随查询状态即时计算',
      '学会大小写不敏感匹配与空查询全量回退',
    ],
    brief: `## 搜索框是状态机器的输入阀

实时搜索是"状态驱动"最漂亮的示范：界面上只有一个 \`@State query\`，**过滤结果永远是 query 的函数** —— \`this.skills.filter(s => s.toLowerCase().includes(query.toLowerCase()))\`。查询变一个字母，列表瞬间重排，没有一次手动刷新。

两个细节决定体验：一是**大小写不敏感**（两边都 toLowerCase 再比），二是**空查询回退全量**（includes('') 恒为 true，天然实现 —— 不用写 if）。这套"单状态 + 派生列表"的模式同样适用于筛选、排序、分页联想。

类比：搜索框是**水龙头**，列表是水流 —— 你只拧阀门（query），水流自动变化；没人会去手动搬水。

> 💡 过滤结果不要存 @State —— 它是 query 的影子，存了就会和 query 打架（派生数据原则）。`,
    task: `## 任务：技术关键词实时检索

1. \`@State skills: string[] = ['ArkTS 声明式 UI', 'ArkUI 渲染管线', 'Stage 模型生命周期', 'ArkCompiler 字节码', '分布式软总线']\`；
2. \`@State query: string = ''\`；
3. \`TextInput({ placeholder: '搜索技术关键词…', text: this.query })\` + \`.onChange\` 同步 query；
4. \`ForEach(this.skills.filter((s: string) => s.toLowerCase().includes(this.query.toLowerCase())), ...)\` 渲染命中项 \`Text(s)\`（fontSize 15）；
5. \`if\` 过滤结果为空时渲染 \`Text('没有匹配的技术')\`（fontColor '#f87171'）。

**判题**：交互【输入「ark」】—— 两条 Ark 开头技术命中，其余过滤，空态不出现。`,
    starter: `@Entry
@Component
struct Index {
  @State skills: string[] = ['ArkTS 声明式 UI', 'ArkUI 渲染管线', 'Stage 模型生命周期', 'ArkCompiler 字节码', '分布式软总线']
  @State query: string = ''

  build() {
    Column({ space: 10 }) {
      TextInput({ placeholder: '搜索技术关键词…', text: this.query })
        .onChange((v: string) => {
          this.query = v
        })
      // TODO: ForEach 渲染过滤结果（大小写不敏感）+ 空结果提示
      ForEach(this.skills, (s: string) => {
        Text(s)
      }, (s: string) => s)
    }
  }
}`,
    solution: `@Entry
@Component
struct Index {
  @State skills: string[] = ['ArkTS 声明式 UI', 'ArkUI 渲染管线', 'Stage 模型生命周期', 'ArkCompiler 字节码', '分布式软总线']
  @State query: string = ''

  build() {
    Column({ space: 10 }) {
      TextInput({ placeholder: '搜索技术关键词…', text: this.query })
        .onChange((v: string) => {
          this.query = v
        })
      ForEach(this.skills.filter((s: string) => s.toLowerCase().includes(this.query.toLowerCase())), (s: string) => {
        Text(s)
          .fontSize(15)
          .fontColor('#e2e8f0')
      }, (s: string) => s)
      if (this.skills.filter((s: string) => s.toLowerCase().includes(this.query.toLowerCase())).length === 0) {
        Text('没有匹配的技术')
          .fontSize(14)
          .fontColor('#f87171')
      }
    }
  }
}`,
    algo: {
      starters: {
        arkts: `@Entry
@Component
struct Index {
  @State skills: string[] = ['ArkTS 声明式 UI', 'ArkUI 渲染管线', 'Stage 模型生命周期', 'ArkCompiler 字节码', '分布式软总线']
  @State query: string = ''

  build() {
    Column({ space: 10 }) {
      TextInput({ placeholder: '搜索技术关键词…', text: this.query })
        .onChange((v: string) => {
          this.query = v
        })
      // TODO: ForEach 渲染过滤结果（大小写不敏感）+ 空结果提示
      ForEach(this.skills, (s: string) => {
        Text(s)
      }, (s: string) => s)
    }
  }
}`,
      },
      solutions: {
        arkts: `@Entry
@Component
struct Index {
  @State skills: string[] = ['ArkTS 声明式 UI', 'ArkUI 渲染管线', 'Stage 模型生命周期', 'ArkCompiler 字节码', '分布式软总线']
  @State query: string = ''

  build() {
    Column({ space: 10 }) {
      TextInput({ placeholder: '搜索技术关键词…', text: this.query })
        .onChange((v: string) => {
          this.query = v
        })
      ForEach(this.skills.filter((s: string) => s.toLowerCase().includes(this.query.toLowerCase())), (s: string) => {
        Text(s)
          .fontSize(15)
          .fontColor('#e2e8f0')
      }, (s: string) => s)
      if (this.skills.filter((s: string) => s.toLowerCase().includes(this.query.toLowerCase())).length === 0) {
        Text('没有匹配的技术')
          .fontSize(14)
          .fontColor('#f87171')
      }
    }
  }
}`,
      },
    },
    hints: [
      '过滤表达式直接内联进 ForEach 第一参数：this.skills.filter((s: string) => s.toLowerCase().includes(this.query.toLowerCase()))。',
      '空态判断用同一过滤表达式的 .length === 0 —— 与列表保持同一个口径。',
      '不需要为过滤结果新建 @State —— 它是 query 的派生数据。',
    ],
    tests: [
      { name: '样例：输入 ark 过滤', stdin: JSON.stringify([{ input: 'ark' }]), expected: "__root__\n  Column \"ArkTS 声明式 UIArkUI 渲染管线ArkCompiler 字节码\" (space=10)\n    TextInput (placeholder='搜索技术关键词…', text='ark')\n    Text \"ArkTS 声明式 UI\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"ArkUI 渲染管线\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"ArkCompiler 字节码\" (fontSize=15, fontColor='#e2e8f0')\n#renders Index=1\n#prefs {}" },
      { name: '检查：无匹配空态', stdin: JSON.stringify([{ input: '不存在的关键词' }]), expected: "__root__\n  Column \"没有匹配的技术\" (space=10)\n    TextInput (placeholder='搜索技术关键词…', text='不存在的关键词')\n    Text \"没有匹配的技术\" (fontSize=14, fontColor='#f87171')\n#renders Index=1\n#prefs {}" },
      { name: '检查：清空回全量', stdin: JSON.stringify([{ input: 'ark' }, { input: '' }]), expected: "__root__\n  Column \"ArkTS 声明式 UIArkUI 渲染管线Stage 模型生命周期ArkCompiler 字节码分布式软总线\" (space=10)\n    TextInput (placeholder='搜索技术关键词…', text='')\n    Text \"ArkTS 声明式 UI\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"ArkUI 渲染管线\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"Stage 模型生命周期\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"ArkCompiler 字节码\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"分布式软总线\" (fontSize=15, fontColor='#e2e8f0')\n#renders Index=2\n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ input: '分布式' }]), expected: "__root__\n  Column \"分布式软总线\" (space=10)\n    TextInput (placeholder='搜索技术关键词…', text='分布式')\n    Text \"分布式软总线\" (fontSize=15, fontColor='#e2e8f0')\n#renders Index=1\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
];
