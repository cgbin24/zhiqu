import type { Level } from '@/types';

/**
 * 鸿蒙应用开发 · 第四章：高频踩坑实战（tips，4 关）。
 * 每关 = 一个真实事故现场：starter 是"看起来能跑的坑版本"，solution 是正解，
 * 模拟器对二者产出可区分的渲染/计时器证据 —— 亲历一次坑，胜过十遍警告。
 */
export const HARMONY_TIPS: Level[] = [
  {
    id: 'harmony-tips-1',
    lang: 'harmony',
    module: 'tips',
    order: 1,
    title: '消失的数组更新：push 为什么不刷新',
    difficulty: 3,
    xp: 25,
    goals: [
      '理解 @State 只观察引用变化，不观察数组内部变异',
      '掌握不可变更新的标准写法：this.list = [...this.list, x]',
      '能识别真实事故现场：点了按钮，界面毫无反应',
    ],
    brief: `## 事故现场：点了按钮，界面毫无反应

新手最经典的鸿蒙事故：\`@State list: string[]\`，点按钮 \`this.list.push('新项')\` —— 逻辑对、数据在、**界面纹丝不动**。原因藏在 ArkUI 状态管理的机制里：@State 观察**引用变化**，push 是原地变异，引用没换，框架判定"状态没变"，重绘不发生。

正解是**不可变更新**：不改动旧数组，而是构造新数组整体替换 —— 添加 \`this.list = [...this.list, x]\`，删除 \`this.list = this.list.filter(...)\`。引用一变，@State 立刻通知重绘。

类比：@State 像快递柜的**取件码** —— 你往柜子里塞新包裹（push）没人知道；换一个新柜子并更新取件码（重新赋值），系统才会通知你。

> 💡 本关 starter 就是事故现场：点「添加」逻辑执行了但清单不出现 —— 把它改成不可变更新，清单立刻现身。`,
    task: `## 任务：修复"点了没反应"的清单

1. \`Button('添加')\` 的 onClick 里：把 \`this.list.push(this.draft)\` 改为 **不可变追加** \`this.list = [...this.list, this.draft]\`，随后 \`this.draft = ''\`；
2. TextInput 保留 onChange 受控写法；
3. ForEach 渲染保持不变（key 用 item 本身）。

**判题**：交互【输入「学状态管理」→ 添加】—— 事故版清单不出现，修复版必须出现。`,
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
      Button('添加')
        .fontSize(14)
        .onClick(() => {
          // ⚠️ 事故代码：push 原地变异，引用没变，UI 不刷新
          this.list.push(this.draft)
          this.draft = ''
        })
      ForEach(this.list, (item: string) => {
        Text(item)
          .fontSize(15)
          .fontColor('#e2e8f0')
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
          // ✅ 不可变更新：构造新数组整体替换引用
          this.list = [...this.list, this.draft]
          this.draft = ''
        })
      ForEach(this.list, (item: string) => {
        Text(item)
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
          // ⚠️ 事故代码：push 原地变异，引用没变，UI 不刷新
          this.list.push(this.draft)
          this.draft = ''
        })
      ForEach(this.list, (item: string) => {
        Text(item)
          .fontSize(15)
          .fontColor('#e2e8f0')
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
          // ✅ 不可变更新：构造新数组整体替换引用
          this.list = [...this.list, this.draft]
          this.draft = ''
        })
      ForEach(this.list, (item: string) => {
        Text(item)
          .fontSize(15)
          .fontColor('#e2e8f0')
      }, (item: string) => item)
    }
  }
}`,
      },
    },
    hints: [
      '把 this.list.push(this.draft) 整行替换为：this.list = [...this.list, this.draft]。',
      '判断标准：@State 数组的任何修改都必须产生"新数组"赋回给自己。',
      '本关交互后清单应出现「学状态管理」—— 事故版它永远不会出现。',
    ],
    tests: [
      { name: '样例：修复后清单出现', stdin: JSON.stringify([{ input: '学状态管理' }, { tap: '添加' }]), expected: "__root__\n  Column \"添加搭建环境学状态管理\" (space=10)\n    TextInput (placeholder='要学什么？', text='')\n    Button \"添加\" (fontSize=14)\n    Text \"搭建环境\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"学状态管理\" (fontSize=15, fontColor='#e2e8f0')\n#renders Index=2\n#prefs {}" },
      { name: '检查：连续添加两条', stdin: JSON.stringify([{ input: 'A' }, { tap: '添加' }, { input: 'B' }, { tap: '添加' }]), expected: "__root__\n  Column \"添加搭建环境AB\" (space=10)\n    TextInput (placeholder='要学什么？', text='')\n    Button \"添加\" (fontSize=14)\n    Text \"搭建环境\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"A\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"B\" (fontSize=15, fontColor='#e2e8f0')\n#renders Index=4\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"添加搭建环境\" (space=10)\n    TextInput (placeholder='要学什么？', text='')\n    Button \"添加\" (fontSize=14)\n    Text \"搭建环境\" (fontSize=15, fontColor='#e2e8f0')\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ input: '学状态管理' }, { tap: '添加' }]), expected: "__root__\n  Column \"添加搭建环境学状态管理\" (space=10)\n    TextInput (placeholder='要学什么？', text='')\n    Button \"添加\" (fontSize=14)\n    Text \"搭建环境\" (fontSize=15, fontColor='#e2e8f0')\n    Text \"学状态管理\" (fontSize=15, fontColor='#e2e8f0')\n#renders Index=2\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-tips-2',
    lang: 'harmony',
    module: 'tips',
    order: 2,
    title: '错乱的列表项：key 与状态错位',
    difficulty: 4,
    xp: 30,
    goals: [
      '理解 ForEach 用 index 引用项在删除后产生的状态错位',
      '掌握用唯一 id 引用列表项、用 id 作 key',
      '学会删除后保持其余项状态稳定',
    ],
    brief: `## 删掉一项，状态全乱了

列表项带勾选状态时，删除中间一项会让"按 index 操作"的代码全线错位：你勾选了第 2 项，删掉第 1 项后再操作，index 已经指向别人。根源是**用位置（index）标识数据** —— 位置随删除漂移，状态自然挂错对象。

正解两件套：数据带**唯一 id**；一切操作都**按 id 寻址** —— 勾选 \`this.tasks = this.tasks.map(t => t.id === task.id ? { ...t, done: v } : t)\`，删除 \`this.tasks = this.tasks.filter(t => t.id !== task.id)\`，key 也用 id。位置会漂移，id 永远不变。

类比：酒店房客用**房卡号**识别，不靠"走廊第几间" —— 中途退一间房，按序数找人必找错。

> 💡 判题会勾选一项再删除另一项：事故版的勾选会"跳"到别的项上，正解保持稳定。`,
    task: `## 任务：修好删除后状态错位的任务列表

1. \`Task\` 结构含 \`id\`；\`@State tasks\` 三条：学 ArkTS / 写 Demo / 复盘；
2. 勾选用 \`Checkbox(task.name)\` + \`.onChange\`：**按 id** 用 map 不可变更新 done；
3. 每项配 \`Button('删除 ' + task.name)\`：\`onClick\` 里 **按 id** filter 删除；
4. ForEach 的 key 用 \`task.id.toString()\`；每项文本 \`Text(\\\`\${task.done ? '☑' : '☐'} \\\${task.name}\\\`)\`。

**判题**：交互【勾选「写 Demo」→ 删除「学 ArkTS」】—— 「写 Demo」必须保持 ☑，其余项顺序稳定。`,
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
      ForEach(this.tasks, (task: Task, idx: number) => {
        Row({ space: 8 }) {
          Checkbox(task.name)
            .onChange((v: boolean) => {
              // ⚠️ 事故代码：按 index 寻址 —— 删除后错位
              this.tasks[idx].done = v
            })
          Text(\`\${task.done ? '☑' : '☐'} \${task.name}\`).fontSize(15)
          Button('删除 ' + task.name)
            .fontSize(11)
            .onClick(() => {
              // ⚠️ 事故代码：按 index 删除
              this.tasks.splice(idx, 1)
            })
        }
      }, (task: Task, idx: number) => idx.toString())
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
              // ✅ 按 id 寻址：map 不可变更新
              this.tasks = this.tasks.map((t: Task) => t.id === task.id ? { ...t, done: v } : t)
            })
          Text(\`\${task.done ? '☑' : '☐'} \${task.name}\`)
            .fontSize(15)
            .fontColor('#e2e8f0')
          Button('删除 ' + task.name)
            .fontSize(11)
            .fontColor('#fca5a5')
            .onClick(() => {
              // ✅ 按 id 删除：filter
              this.tasks = this.tasks.filter((t: Task) => t.id !== task.id)
            })
        }
      }, (task: Task) => task.id.toString())
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
      ForEach(this.tasks, (task: Task, idx: number) => {
        Row({ space: 8 }) {
          Checkbox(task.name)
            .onChange((v: boolean) => {
              // ⚠️ 事故代码：按 index 寻址 —— 删除后错位
              this.tasks[idx].done = v
            })
          Text(\`\${task.done ? '☑' : '☐'} \${task.name}\`).fontSize(15)
          Button('删除 ' + task.name)
            .fontSize(11)
            .onClick(() => {
              // ⚠️ 事故代码：按 index 删除
              this.tasks.splice(idx, 1)
            })
        }
      }, (task: Task, idx: number) => idx.toString())
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
              // ✅ 按 id 寻址：map 不可变更新
              this.tasks = this.tasks.map((t: Task) => t.id === task.id ? { ...t, done: v } : t)
            })
          Text(\`\${task.done ? '☑' : '☐'} \${task.name}\`)
            .fontSize(15)
            .fontColor('#e2e8f0')
          Button('删除 ' + task.name)
            .fontSize(11)
            .fontColor('#fca5a5')
            .onClick(() => {
              // ✅ 按 id 删除：filter
              this.tasks = this.tasks.filter((t: Task) => t.id !== task.id)
            })
        }
      }, (task: Task) => task.id.toString())
    }
  }
}`,
      },
    },
    hints: [
      '勾选按 id：this.tasks = this.tasks.map((t: Task) => t.id === task.id ? { ...t, done: v } : t)。',
      '删除按 id：this.tasks = this.tasks.filter((t: Task) => t.id !== task.id)。',
      'key 也用 id：task.id.toString() —— 位置会漂移，id 不会。',
    ],
    tests: [
      { name: '样例：勾选后删除他项', stdin: JSON.stringify([{ input: [true, 1] }, { tap: '删除 学 ArkTS' }]), expected: "__root__\n  Column \"写 Demo☑ 写 Demo删除 写 Demo复盘☐ 复盘删除 复盘\" (space=8)\n    Row \"写 Demo☑ 写 Demo删除 写 Demo\" (space=8)\n      Checkbox \"写 Demo\"\n      Text \"☑ 写 Demo\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"删除 写 Demo\" (fontSize=11, fontColor='#fca5a5')\n    Row \"复盘☐ 复盘删除 复盘\" (space=8)\n      Checkbox \"复盘\"\n      Text \"☐ 复盘\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"删除 复盘\" (fontSize=11, fontColor='#fca5a5')\n#renders Index=2\n#prefs {}" },
      { name: '检查：只勾选不删除', stdin: JSON.stringify([{ input: [true, 0] }]), expected: "__root__\n  Column \"学 ArkTS☑ 学 ArkTS删除 学 ArkTS写 Demo☐ 写 Demo删除 写 Demo复盘☐ 复盘删除 复盘\" (space=8)\n    Row \"学 ArkTS☑ 学 ArkTS删除 学 ArkTS\" (space=8)\n      Checkbox \"学 ArkTS\"\n      Text \"☑ 学 ArkTS\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"删除 学 ArkTS\" (fontSize=11, fontColor='#fca5a5')\n    Row \"写 Demo☐ 写 Demo删除 写 Demo\" (space=8)\n      Checkbox \"写 Demo\"\n      Text \"☐ 写 Demo\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"删除 写 Demo\" (fontSize=11, fontColor='#fca5a5')\n    Row \"复盘☐ 复盘删除 复盘\" (space=8)\n      Checkbox \"复盘\"\n      Text \"☐ 复盘\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"删除 复盘\" (fontSize=11, fontColor='#fca5a5')\n#renders Index=1\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"学 ArkTS☐ 学 ArkTS删除 学 ArkTS写 Demo☐ 写 Demo删除 写 Demo复盘☐ 复盘删除 复盘\" (space=8)\n    Row \"学 ArkTS☐ 学 ArkTS删除 学 ArkTS\" (space=8)\n      Checkbox \"学 ArkTS\"\n      Text \"☐ 学 ArkTS\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"删除 学 ArkTS\" (fontSize=11, fontColor='#fca5a5')\n    Row \"写 Demo☐ 写 Demo删除 写 Demo\" (space=8)\n      Checkbox \"写 Demo\"\n      Text \"☐ 写 Demo\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"删除 写 Demo\" (fontSize=11, fontColor='#fca5a5')\n    Row \"复盘☐ 复盘删除 复盘\" (space=8)\n      Checkbox \"复盘\"\n      Text \"☐ 复盘\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"删除 复盘\" (fontSize=11, fontColor='#fca5a5')\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ input: [true, 1] }, { tap: '删除 学 ArkTS' }]), expected: "__root__\n  Column \"写 Demo☑ 写 Demo删除 写 Demo复盘☐ 复盘删除 复盘\" (space=8)\n    Row \"写 Demo☑ 写 Demo删除 写 Demo\" (space=8)\n      Checkbox \"写 Demo\"\n      Text \"☑ 写 Demo\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"删除 写 Demo\" (fontSize=11, fontColor='#fca5a5')\n    Row \"复盘☐ 复盘删除 复盘\" (space=8)\n      Checkbox \"复盘\"\n      Text \"☐ 复盘\" (fontSize=15, fontColor='#e2e8f0')\n      Button \"删除 复盘\" (fontSize=11, fontColor='#fca5a5')\n#renders Index=2\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-tips-3',
    lang: 'harmony',
    module: 'tips',
    order: 3,
    title: '嵌套对象更新失效：this.obj.x++ 的沉默',
    difficulty: 4,
    xp: 30,
    goals: [
      '理解 @State 对第一层属性的观察边界：嵌套属性变异不触发刷新',
      '掌握整体替换写法：this.obj = new Profile(...) 或展开新对象',
      '了解 @Observed/@ObjectLink 是另一条解法（进阶路线）',
    ],
    brief: `## this.profile.age++ 之后，界面沉默了

@State 的观察能力有**深度边界**：第一层属性变了会刷新；**嵌套对象内部属性**的原地修改（\`this.profile.age++\`）完全静默 —— 第一层引用没变，框架继续沉睡。这与数组的 push 坑同根同源：**观察的是引用，不是内容**。

正解：嵌套属性变更也走"整体替换" —— \`this.profile = new Profile(this.profile.name, this.profile.age + 1)\`，或者展开新对象 \`this.profile = { ...this.profile, age: this.profile.age + 1 }\`。另一条进阶路线是给类加 \`@Observed\`、子组件字段用 \`@ObjectLink\` 做深度观察 —— 学有余力再研究。

类比：@State 像楼里的**水表** —— 只读总阀（第一层）；房间里私接水管（嵌套属性），总表不动，水哗哗流也无人计费。

> 💡 数据结构设计时就扁平化，或养成"嵌套必替换"的手感 —— 二选一，别赌框架。`,
    task: `## 任务：让开发者档案的年龄真正长大

1. \`class Profile\` 含 \`name: string\` 与 \`age: number\`（constructor 初始化）；
2. \`@State profile: Profile = new Profile('鸿蒙冒险者', 24)\`；
3. 渲染 \`Text(\\\`\${this.profile.name} · \${this.profile.age} 岁\\\`)\`（fontSize 16）；
4. \`Button('生日快乐 🎂')\`：\`onClick\` 里 **整体替换** —— \`this.profile = new Profile(this.profile.name, this.profile.age + 1)\`。

**判题**：交互【点击两次生日按钮】—— 年龄显示 26（事故版永远 24）。`,
    starter: `class Profile {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

@Entry
@Component
struct Index {
  @State profile: Profile = new Profile('鸿蒙冒险者', 24)

  build() {
    Column({ space: 12 }) {
      Text(\`\${this.profile.name} · \${this.profile.age} 岁\`).fontSize(16)
      Button('生日快乐 🎂').fontSize(14).onClick(() => {
        // ⚠️ 事故代码：嵌套属性原地修改 —— @State 沉睡
        this.profile.age++
      })
    }
  }
}`,
    solution: `class Profile {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

@Entry
@Component
struct Index {
  @State profile: Profile = new Profile('鸿蒙冒险者', 24)

  build() {
    Column({ space: 12 }) {
      Text(\`\${this.profile.name} · \${this.profile.age} 岁\`)
        .fontSize(16)
        .fontColor('#e2e8f0')
      Button('生日快乐 🎂')
        .fontSize(14)
        .onClick(() => {
          // ✅ 整体替换：第一层引用变化，@State 被唤醒
          this.profile = new Profile(this.profile.name, this.profile.age + 1)
        })
    }
  }
}`,
    algo: {
      starters: {
        arkts: `class Profile {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

@Entry
@Component
struct Index {
  @State profile: Profile = new Profile('鸿蒙冒险者', 24)

  build() {
    Column({ space: 12 }) {
      Text(\`\${this.profile.name} · \${this.profile.age} 岁\`).fontSize(16)
      Button('生日快乐 🎂').fontSize(14).onClick(() => {
        // ⚠️ 事故代码：嵌套属性原地修改 —— @State 沉睡
        this.profile.age++
      })
    }
  }
}`,
      },
      solutions: {
        arkts: `class Profile {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

@Entry
@Component
struct Index {
  @State profile: Profile = new Profile('鸿蒙冒险者', 24)

  build() {
    Column({ space: 12 }) {
      Text(\`\${this.profile.name} · \${this.profile.age} 岁\`)
        .fontSize(16)
        .fontColor('#e2e8f0')
      Button('生日快乐 🎂')
        .fontSize(14)
        .onClick(() => {
          // ✅ 整体替换：第一层引用变化，@State 被唤醒
          this.profile = new Profile(this.profile.name, this.profile.age + 1)
        })
    }
  }
}`,
      },
    },
    hints: [
      '事故代码 this.profile.age++ 一行——它修改了嵌套属性但引用未变。',
      '正解：this.profile = new Profile(this.profile.name, this.profile.age + 1)。',
      '验证方式：点两次按钮，文本年龄应显示 26。',
    ],
    tests: [
      { name: '样例：两次生日长两岁', stdin: JSON.stringify([{ tap: '生日快乐' }, { tap: '生日快乐' }]), expected: "__root__\n  Column \"鸿蒙冒险者 · 26 岁生日快乐 🎂\" (space=12)\n    Text \"鸿蒙冒险者 · 26 岁\" (fontSize=16, fontColor='#e2e8f0')\n    Button \"生日快乐 🎂\" (fontSize=14)\n#renders Index=2\n#prefs {}" },
      { name: '检查：一次生日', stdin: JSON.stringify([{ tap: '生日快乐' }]), expected: "__root__\n  Column \"鸿蒙冒险者 · 25 岁生日快乐 🎂\" (space=12)\n    Text \"鸿蒙冒险者 · 25 岁\" (fontSize=16, fontColor='#e2e8f0')\n    Button \"生日快乐 🎂\" (fontSize=14)\n#renders Index=1\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"鸿蒙冒险者 · 24 岁生日快乐 🎂\" (space=12)\n    Text \"鸿蒙冒险者 · 24 岁\" (fontSize=16, fontColor='#e2e8f0')\n    Button \"生日快乐 🎂\" (fontSize=14)\n#renders \n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ tap: '生日快乐' }, { tap: '生日快乐' }]), expected: "__root__\n  Column \"鸿蒙冒险者 · 26 岁生日快乐 🎂\" (space=12)\n    Text \"鸿蒙冒险者 · 26 岁\" (fontSize=16, fontColor='#e2e8f0')\n    Button \"生日快乐 🎂\" (fontSize=14)\n#renders Index=2\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index' }, entry: 'pages/Index' }),
  },
  {
    id: 'harmony-tips-4',
    lang: 'harmony',
    module: 'tips',
    order: 4,
    title: '谁动了我的定时器：生命周期与泄漏',
    difficulty: 4,
    xp: 30,
    goals: [
      '理解 aboutToAppear 创建的资源必须由 aboutToDisappear 释放',
      '掌握 setInterval / clearInterval 的成对使用',
      '养成"谁创建谁清理"的资源管理纪律',
    ],
    brief: `## 页面关了，定时器还在跑

页面 \`aboutToAppear\` 里 \`setInterval\` 起了一个轮询，用户退出了页面 —— 定时器**还在跑**。每进一次设置页就多一个定时器，回退也不清理：内存持续上涨、后台逻辑反复触发、日志疯狂刷屏。这就是**资源泄漏**，真实项目里是最难查的一类性能劣化。

纪律只有一条：**谁创建，谁清理**。\`aboutToAppear\` 创建的定时器，把句柄存起来，在 \`aboutToDisappear\` 里 \`clearInterval\` 成对释放。模拟器会追踪活跃定时器：修复后返回上一页，\`#timers active=0\`；事故版是 \`active=1\`。

类比：离开会议室要**关灯** —— 灯（定时器）是你进来时开的，走时不关，电费（内存）一直烧。

> 💡 同类资源一个道理：网络请求的取消、监听器的注销、文件句柄的关闭，全部成对书写。`,
    task: `## 任务：让设置页退出时关掉轮询

1. 设置页 \`struct SettingsPage\`：\`@State polls: number = 0\`、\`@State timerId: number = -1\`；
2. \`aboutToAppear()\`：\`this.timerId = setInterval(() => { this.polls++ }, 1000)\`；
3. \`aboutToDisappear()\`：\`clearInterval(this.timerId)\`（solution 必须有；starter 缺失）；
4. 首页 \`Button('打开设置页')\` → \`router.pushUrl({ url: 'pages/Settings' })\`；设置页内 \`Button('返回')\` → \`router.back()\`。

**判题**：交互【打开设置页 → 返回】，runtime 开启 trackTimers —— \`#timers active=0\` 才算修复。`,
    starter: `@Entry
@Component
struct Index {
  build() {
    Column({ space: 12 }) {
      Text('主页面').fontSize(18)
      Button('打开设置页').fontSize(14).onClick(() => {
        router.pushUrl({ url: 'pages/Settings' })
      })
    }
  }
}

@Component
struct SettingsPage {
  @State polls: number = 0
  @State timerId: number = -1

  aboutToAppear() {
    this.timerId = setInterval(() => {
      this.polls++
    }, 1000)
  }

  // ⚠️ 事故代码：缺少 aboutToDisappear 清理 —— 返回后定时器仍在运行

  build() {
    Column({ space: 10 }) {
      Text('设置页（轮询中）').fontSize(16)
      Button('返回').fontSize(14).onClick(() => {
        router.back()
      })
    }
  }
}`,
    solution: `@Entry
@Component
struct Index {
  build() {
    Column({ space: 12 }) {
      Text('主页面').fontSize(18)
      Button('打开设置页').fontSize(14).onClick(() => {
        router.pushUrl({ url: 'pages/Settings' })
      })
    }
  }
}

@Component
struct SettingsPage {
  @State polls: number = 0
  @State timerId: number = -1

  aboutToAppear() {
    this.timerId = setInterval(() => {
      this.polls++
    }, 1000)
  }

  // ✅ 成对清理：页面销毁时释放定时器
  aboutToDisappear() {
    clearInterval(this.timerId)
  }

  build() {
    Column({ space: 10 }) {
      Text('设置页（轮询中）').fontSize(16)
      Button('返回').fontSize(14).onClick(() => {
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
  build() {
    Column({ space: 12 }) {
      Text('主页面').fontSize(18)
      Button('打开设置页').fontSize(14).onClick(() => {
        router.pushUrl({ url: 'pages/Settings' })
      })
    }
  }
}

@Component
struct SettingsPage {
  @State polls: number = 0
  @State timerId: number = -1

  aboutToAppear() {
    this.timerId = setInterval(() => {
      this.polls++
    }, 1000)
  }

  // ⚠️ 事故代码：缺少 aboutToDisappear 清理 —— 返回后定时器仍在运行

  build() {
    Column({ space: 10 }) {
      Text('设置页（轮询中）').fontSize(16)
      Button('返回').fontSize(14).onClick(() => {
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
  build() {
    Column({ space: 12 }) {
      Text('主页面').fontSize(18)
      Button('打开设置页').fontSize(14).onClick(() => {
        router.pushUrl({ url: 'pages/Settings' })
      })
    }
  }
}

@Component
struct SettingsPage {
  @State polls: number = 0
  @State timerId: number = -1

  aboutToAppear() {
    this.timerId = setInterval(() => {
      this.polls++
    }, 1000)
  }

  // ✅ 成对清理：页面销毁时释放定时器
  aboutToDisappear() {
    clearInterval(this.timerId)
  }

  build() {
    Column({ space: 10 }) {
      Text('设置页（轮询中）').fontSize(16)
      Button('返回').fontSize(14).onClick(() => {
        router.back()
      })
    }
  }
}`,
      },
    },
    hints: [
      '在 aboutToDisappear() { clearInterval(this.timerId) } —— 与 aboutToAppear 严格成对。',
      '句柄必须保存：this.timerId = setInterval(...)，否则清理无从下手。',
      '判据：返回主页面后 #timers active=0。',
    ],
    tests: [
      { name: '样例：进出后无泄漏', stdin: JSON.stringify([{ tap: '打开设置页' }, { back: true }]), expected: "__root__\n  Column \"主页面打开设置页\" (space=12)\n    Text \"主页面\" (fontSize=18)\n    Button \"打开设置页\" (fontSize=14)\n#renders SettingsPage=1\n#timers active=0\n#prefs {}" },
      { name: '检查：进入设置页', stdin: JSON.stringify([{ tap: '打开设置页' }]), expected: "__root__\n  Column \"设置页（轮询中）返回\" (space=10)\n    Text \"设置页（轮询中）\" (fontSize=16)\n    Button \"返回\" (fontSize=14)\n#renders SettingsPage=1\n#timers active=1\n#prefs {}" },
      { name: '检查：初始渲染', stdin: '[]', expected: "__root__\n  Column \"主页面打开设置页\" (space=12)\n    Text \"主页面\" (fontSize=18)\n    Button \"打开设置页\" (fontSize=14)\n#renders \n#timers active=0\n#prefs {}" },
      { name: '隐藏：逐字符比对', stdin: JSON.stringify([{ tap: '打开设置页' }, { back: true }]), expected: "__root__\n  Column \"主页面打开设置页\" (space=12)\n    Text \"主页面\" (fontSize=18)\n    Button \"打开设置页\" (fontSize=14)\n#renders SettingsPage=1\n#timers active=0\n#prefs {}", hidden: true },
    ],
    runtime: JSON.stringify({ kind: 'arkts', pages: { 'pages/Index': 'Index', 'pages/Settings': 'SettingsPage' }, entry: 'pages/Index', trackTimers: true }),
  },
];
