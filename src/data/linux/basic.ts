import type { Level } from '@/types';

/** Linux 课程 · 文件与目录（basic 模块，6 关） */
export const LINUX_BASIC: Level[] = [
  {
    id: 'linux-basic-1',
    lang: 'linux',
    module: 'basic',
    order: 1,
    title: '第一声问候：pwd 与 ls',
    difficulty: 1,
    xp: 15,
    goals: [
      '理解"当前目录"概念，会用 pwd 报出自己所在的位置',
      '会用 ls 列出目录内容（空目录时没有任何输出）',
      '习惯模拟器的执行方式：一行一条命令，自上而下依次运行',
    ],
    brief: `## 你的第一条命令

终端像一栋陌生的房子：你随时可能想知道"我现在站在哪个房间"以及"这个房间里有什么"。这两件事分别由两条命令完成：

\`\`\`bash
pwd   # print working directory：打印当前目录（报出你站的位置）
ls    # list：列出当前目录里的文件与文件夹
\`\`\`

- **\`pwd\`** 不需要任何参数，输出当前目录的绝对路径。本课程模拟器的初始位置是 \`/home/student\` —— student 同学的主目录。
- **\`ls\`** 在**空目录**下不会输出任何内容（房间是空的，自然什么都不打印），这不是出错。

模拟器的规则很简单：**一行一条命令，从上到下依次执行**；以 \`#\` 开头的行是注释，会被忽略。命令写错只会得到中文报错提示，虚拟文件系统里怎么折腾都不会造成真实破坏 —— 放心大胆地敲。`,
    task: `## 任务：报出位置，看看四周

依次执行两条命令：

1. \`pwd\` —— 打印当前目录
2. \`ls\` —— 列出当前目录内容（初始为空目录，无输出）

**输入**：无（模拟终端没有标准输入）

**期望输出**（只有 pwd 打印的一行）：

\`\`\`text
/home/student
\`\`\`

### 示例

命令：

\`\`\`bash
pwd
ls
\`\`\`

输出：

\`\`\`text
/home/student
\`\`\``,
    starter: `# 模拟器一行执行一条命令，从上到下依次运行
# TODO 1: 用 pwd 打印当前目录
# TODO 2: 用 ls 列出当前目录内容（空目录不会有输出）
`,
    solution: `pwd
ls`,
    hints: [
      '一条命令占一行：第一行写 `pwd`，第二行写 `ls`，都不需要任何参数。',
      'pwd 会打印当前目录路径；ls 在空目录下什么都不输出，这是正常现象，不是错误。',
      '完整答案只有两行：`pwd` 和 `ls`。最终输出就是 pwd 打印的 `/home/student`。',
    ],
    tests: [
      { name: 'pwd 打印当前目录', stdin: '', expected: '/home/student' },
      { name: 'ls 空目录无输出', stdin: '', expected: '/home/student' },
      { name: '两行命令按顺序执行', stdin: '', expected: '/home/student' },
      { name: '隐藏：输出精确匹配', stdin: '', expected: '/home/student', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 模拟器一行执行一条命令，从上到下依次运行
# TODO 1: 用 pwd 打印当前目录
# TODO 2: 用 ls 列出当前目录内容（空目录不会有输出）
`,
      },
      solutions: {
        bash: `pwd
ls`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{}}}',
  },
  {
    id: 'linux-basic-2',
    lang: 'linux',
    module: 'basic',
    order: 2,
    title: '创建你的第一个文件',
    difficulty: 1,
    xp: 15,
    goals: [
      '会用 touch 创建空文件',
      '理解相对路径：docs/hello.txt 表示 docs 目录下的 hello.txt',
      '会用 ls 目录名 查看指定目录的内容',
    ],
    brief: `## touch：轻轻一碰，文件诞生

\`touch\` 用来创建空文件，就像在抽屉里放入一张白纸 —— 文件存在了，但上面什么都没写：

\`\`\`bash
touch hello.txt          # 在当前目录创建 hello.txt
touch docs/hello.txt     # 在 docs 目录里创建 hello.txt
\`\`\`

\`docs/hello.txt\` 是**相对路径**：从当前目录出发，先找 \`docs\`，再找它里面的 \`hello.txt\`。路径就像快递地址 —— 中间的 \`/\` 读作"里面的"。

要确认文件真的创建了，可以让 \`ls\` 指定目录帮忙：

\`\`\`bash
ls docs    # 列出 docs 目录里的内容
\`\`\`

> 💡 真实 Linux 里对已存在的文件执行 touch 只会更新时间戳，不会清空内容；本模拟器同样不会改动已有文件。`,
    task: `## 任务：放入第一张白纸

场景：你的主目录下有一个空文件夹 \`docs\`。

1. 用 \`touch\` 在 \`docs\` 里创建文件 \`hello.txt\`
2. 用 \`ls docs\` 验证文件已存在

**输入**：无

**期望输出**（ls docs 打印的一行）：

\`\`\`text
hello.txt
\`\`\``,
    starter: `# 场景：主目录下已有一个空目录 docs
# TODO 1: 用 touch 在 docs 里创建 hello.txt（提示：用相对路径 docs/hello.txt）
# TODO 2: 用 ls 查看 docs 目录的内容来验证
`,
    solution: `touch docs/hello.txt
ls docs`,
    hints: [
      'touch 后面跟要创建的文件路径：`touch docs/hello.txt`。',
      '路径里的 docs/ 表示"docs 里面"，不要漏掉 —— 只写 hello.txt 会把文件建到主目录。',
      '再用 `ls docs` 验证，应输出 `hello.txt`。完整答案：第一行 `touch docs/hello.txt`，第二行 `ls docs`。',
    ],
    tests: [
      { name: 'touch 创建文件', stdin: '', expected: 'hello.txt' },
      { name: 'ls 列出 docs 内容', stdin: '', expected: 'hello.txt' },
      { name: '输出为 hello.txt', stdin: '', expected: 'hello.txt' },
      { name: '隐藏：命令序列整体验证', stdin: '', expected: 'hello.txt', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 场景：主目录下已有一个空目录 docs
# TODO 1: 用 touch 在 docs 里创建 hello.txt（提示：用相对路径 docs/hello.txt）
# TODO 2: 用 ls 查看 docs 目录的内容来验证
`,
      },
      solutions: {
        bash: `touch docs/hello.txt
ls docs`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"docs":{"type":"dir","children":{}}}}}',
  },
  {
    id: 'linux-basic-3',
    lang: 'linux',
    module: 'basic',
    order: 3,
    title: '目录树搭建',
    difficulty: 2,
    xp: 20,
    goals: [
      '会用 mkdir 创建目录，理解"父目录必须先存在"',
      '会用一条 mkdir 命令同时创建多个目录',
      '会用 cd 切换目录并用 ls 检查结果',
    ],
    brief: `## mkdir：盖一间新房间

\`mkdir\`（make directory）创建目录，相当于在文件系统这栋房子里隔出新房间：

\`\`\`bash
mkdir project                    # 创建 project 目录
mkdir project/src project/docs   # 一条命令，同时创建两个子目录
\`\`\`

两个关键规矩：

- **父目录必须先存在**。模拟器的 mkdir 不能一次挖出整条路径，要先建 \`project\`，才能在里面建 \`src\` 和 \`docs\` —— 就像先砌好一楼，才能盖二楼。
- **一条命令可以带多个参数**，一次创建多个目录。

搭完后用 \`cd project\` 走进去，再 \`ls\` 检查。注意 \`ls\` 列目录时把结果排在**同一行**：按字母序排列，名字之间用**两个空格**分隔。`,
    task: `## 任务：搭出项目骨架

从空主目录开始，搭建出下面的结构：

\`\`\`text
/home/student
└── project/
    ├── docs/
    └── src/
\`\`\`

步骤：

1. 创建 \`project\` 目录
2. 在其中创建 \`src\` 和 \`docs\` 两个子目录（一条 mkdir 带两个参数即可）
3. \`cd project\` 进入，再用 \`ls\` 检查

**输入**：无

**期望输出**（一行，字母序，两个空格分隔）：

\`\`\`text
docs  src
\`\`\``,
    starter: `# 注意：mkdir 不能一次创建多层不存在的目录，父目录要先建好
# TODO 1: 先创建 project 目录
# TODO 2: 再用一条 mkdir 同时创建 project/src 和 project/docs
# TODO 3: cd project 进入后用 ls 验证
`,
    solution: `mkdir project
mkdir project/src project/docs
cd project
ls`,
    hints: [
      '直接 `mkdir project/src` 会报错 —— 因为 project 还不存在，要先 `mkdir project`。',
      'project 建好后，一条命令就能建两个子目录：`mkdir project/src project/docs`。',
      '最后 `cd project` 再 `ls`，输出是同一行：`docs  src`（字母序，两个空格分隔）。',
    ],
    tests: [
      { name: 'mkdir 创建嵌套目录', stdin: '', expected: 'docs  src' },
      { name: '一次创建多个子目录', stdin: '', expected: 'docs  src' },
      { name: 'cd 后 ls 输出字母序', stdin: '', expected: 'docs  src' },
      { name: '隐藏：输出格式精确匹配', stdin: '', expected: 'docs  src', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 注意：mkdir 不能一次创建多层不存在的目录，父目录要先建好
# TODO 1: 先创建 project 目录
# TODO 2: 再用一条 mkdir 同时创建 project/src 和 project/docs
# TODO 3: cd project 进入后用 ls 验证
`,
      },
      solutions: {
        bash: `mkdir project
mkdir project/src project/docs
cd project
ls`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{}}}',
  },
  {
    id: 'linux-basic-4',
    lang: 'linux',
    module: 'basic',
    order: 4,
    title: '文件搬运工',
    difficulty: 2,
    xp: 20,
    goals: [
      '会用 mv 把文件移动进目录',
      '区分 mv（移动）与 cp（复制）：mv 之后原位置不再保留',
      '会用 cat 查看文件内容',
    ],
    brief: `## mv：把文件搬到新家

\`mv\`（move）让文件搬家：原位置的东西**消失**，出现在新位置 —— 与 \`cp\`（复印一份，原件还在）正好相反：

\`\`\`bash
mv notes.txt archive    # 把 notes.txt 移动进 archive 目录
\`\`\`

当第二个参数是**已存在的目录**时，mv 把文件移进去并保留原名 —— 就像把纸箱搬进仓库：箱子还是那个箱子，只是换了货架。

搬完之后用 \`cat\` 检查内容是否完好：

\`\`\`bash
cat archive/notes.txt   # 打印文件内容
\`\`\`

\`cat\`（concatenate）像把纸条上的字念出来 —— 文件里写了什么，就原样输出什么。`,
    task: `## 任务：归档便签

场景：主目录下有 \`notes.txt\`（内容是一行待办）和空目录 \`archive\`：

\`\`\`text
/home/student
├── notes.txt      内容：todo: buy milk
└── archive/
\`\`\`

1. 把 \`notes.txt\` 移动进 \`archive\` 目录
2. 用 \`cat\` 确认移动后内容完好

**输入**：无

**期望输出**：

\`\`\`text
todo: buy milk
\`\`\``,
    starter: `# 场景：notes.txt 在主目录，archive 是已存在的空目录
# TODO 1: 用 mv 把 notes.txt 移动进 archive（第二个参数写目录名）
# TODO 2: 用 cat 查看 archive/notes.txt 验证内容
`,
    solution: `mv notes.txt archive
cat archive/notes.txt`,
    hints: [
      '移动进已存在的目录：`mv notes.txt archive`，文件会保留原名进入 archive。',
      'mv 是"搬家"不是"复印"—— 执行后主目录下的 notes.txt 会消失，不用担心，这是正常的。',
      '再用 `cat archive/notes.txt` 验证，应输出 `todo: buy milk`。',
    ],
    tests: [
      { name: 'mv 移动文件进目录', stdin: '', expected: 'todo: buy milk' },
      { name: 'cat 验证内容完好', stdin: '', expected: 'todo: buy milk' },
      { name: '输出为 todo: buy milk', stdin: '', expected: 'todo: buy milk' },
      { name: '隐藏：移动后内容完好', stdin: '', expected: 'todo: buy milk', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 场景：notes.txt 在主目录，archive 是已存在的空目录
# TODO 1: 用 mv 把 notes.txt 移动进 archive（第二个参数写目录名）
# TODO 2: 用 cat 查看 archive/notes.txt 验证内容
`,
      },
      solutions: {
        bash: `mv notes.txt archive
cat archive/notes.txt`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"notes.txt":{"type":"file","content":"todo: buy milk\\n"},"archive":{"type":"dir","children":{}}}}}',
  },
  {
    id: 'linux-basic-5',
    lang: 'linux',
    module: 'basic',
    order: 5,
    title: '复制与重命名',
    difficulty: 2,
    xp: 20,
    goals: [
      '会用 cp 复制文件（原件保留）',
      '会用 mv 给文件重命名',
      '观察 ls 按字母序、两个空格分隔的输出格式',
    ],
    brief: `## cp 与 mv：复印机和改名处

\`cp\`（copy）是复印机：原件纹丝不动，多出一份独立副本：

\`\`\`bash
cp report_v1.txt report_v2.txt   # 复制出 report_v2.txt，v1 仍在
\`\`\`

\`mv\` 还能**重命名**：当第二个参数不是已存在的目录时，mv 就是"改名"—— 同一位置换了个名字：

\`\`\`bash
mv report_v1.txt report_final.txt   # v1 改名为 report_final.txt
\`\`\`

组合起来就是文档管理的日常：先复印一份改版本号，再把旧版改名归档。最后 \`ls\` 检查战果 —— \`ls\` 把结果排在**同一行**，按字母序，两个空格分隔。`,
    task: `## 任务：报告版本管理

场景：主目录下有 \`report_v1.txt\`（内容 \`Q3 report\`）。

1. 用 \`cp\` 复制出 \`report_v2.txt\`
2. 用 \`mv\` 把 \`report_v1.txt\` 重命名为 \`report_final.txt\`
3. 用 \`ls\` 查看最终文件列表

**输入**：无

**期望输出**（一行，两个空格分隔）：

\`\`\`text
report_final.txt  report_v2.txt
\`\`\`

注意：重命名之后 \`report_v1.txt\` 已不存在，目录里只剩两个文件。`,
    starter: `# 场景：只有 report_v1.txt 一个文件
# TODO 1: 用 cp 复制出 report_v2.txt（原件保留）
# TODO 2: 用 mv 把 report_v1.txt 改名为 report_final.txt
# TODO 3: 用 ls 查看结果（注意字母序与两个空格的分隔格式）
`,
    solution: `cp report_v1.txt report_v2.txt
mv report_v1.txt report_final.txt
ls`,
    hints: [
      '复制：`cp report_v1.txt report_v2.txt` —— 执行后两个文件都在。',
      '重命名：`mv report_v1.txt report_final.txt` —— 目标不是目录时，mv 就是改名。',
      '最后 `ls` 输出一行：`report_final.txt  report_v2.txt`（字母序，两个空格分隔）。',
    ],
    tests: [
      { name: 'cp 复制文件', stdin: '', expected: 'report_final.txt  report_v2.txt' },
      { name: 'mv 重命名文件', stdin: '', expected: 'report_final.txt  report_v2.txt' },
      { name: 'ls 按字母序输出', stdin: '', expected: 'report_final.txt  report_v2.txt' },
      { name: '隐藏：输出格式精确匹配', stdin: '', expected: 'report_final.txt  report_v2.txt', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 场景：只有 report_v1.txt 一个文件
# TODO 1: 用 cp 复制出 report_v2.txt（原件保留）
# TODO 2: 用 mv 把 report_v1.txt 改名为 report_final.txt
# TODO 3: 用 ls 查看结果（注意字母序与两个空格的分隔格式）
`,
      },
      solutions: {
        bash: `cp report_v1.txt report_v2.txt
mv report_v1.txt report_final.txt
ls`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"report_v1.txt":{"type":"file","content":"Q3 report\\n"}}}}',
  },
  {
    id: 'linux-basic-6',
    lang: 'linux',
    module: 'basic',
    order: 6,
    title: '眼见为实：tree',
    difficulty: 2,
    xp: 20,
    goals: [
      '会用 tree 直观展示目录结构',
      '读懂树状图：目录带 / 后缀，├── 与 └── 连接符',
      '理解 tree 按字母序、自上而下绘制整棵子树',
    ],
    brief: `## tree：给文件系统画全家福

\`ls\` 把名字排成一排，\`tree\` 则画出**整棵目录树** —— 房间、房间里的抽屉、抽屉里的文件一览无余：

\`\`\`bash
tree    # 从当前目录开始绘制
\`\`\`

读图规则：

- 根行是当前目录的名字（如 \`student\`）
- 目录名后面带 \`/\`，文件名不带
- 每层用 \`├──\` 连接，**最后一项**用 \`└──\`；进入下一层时整体缩进，纵向用 \`│\` 对齐
- 同层条目按字母序排列，空目录没有子行

tree 是检查目录结构是否搭对的最快方式 —— 结构对不对，一眼便知。`,
    task: `## 任务：画出目录全景

场景：

\`\`\`text
/home/student
├── docs/
│   ├── a.txt
│   └── b.md
└── pics/          （空目录）
\`\`\`

直接执行 \`tree\`，精确输出下面的树状图（注意空格与符号）：

\`\`\`text
student
├── docs/
│   ├── a.txt
│   └── b.md
└── pics/
\`\`\`

**输入**：无`,
    starter: `# 场景：docs 里有 a.txt 和 b.md，还有一个空目录 pics
# TODO: 直接用 tree 命令画出目录树
# 观察：目录带 / 后缀，最后一项用 └── 连接
`,
    solution: `tree`,
    hints: [
      'tree 不需要任何参数，默认从当前目录 /home/student 开始画。',
      '输出第一行是 `student`（根目录名），目录会带 `/` 后缀。',
      '精确输出共 5 行：`student` / `├── docs/` / `│   ├── a.txt` / `│   └── b.md` / `└── pics/`，注意 `│` 之后是三个空格。',
    ],
    tests: [
      { name: 'tree 绘制目录树', stdin: '', expected: 'student\n├── docs/\n│   ├── a.txt\n│   └── b.md\n└── pics/' },
      { name: '目录带 / 后缀', stdin: '', expected: 'student\n├── docs/\n│   ├── a.txt\n│   └── b.md\n└── pics/' },
      { name: '连接符与缩进精确匹配', stdin: '', expected: 'student\n├── docs/\n│   ├── a.txt\n│   └── b.md\n└── pics/' },
      { name: '隐藏：树状图整体精确匹配', stdin: '', expected: 'student\n├── docs/\n│   ├── a.txt\n│   └── b.md\n└── pics/', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 场景：docs 里有 a.txt 和 b.md，还有一个空目录 pics
# TODO: 直接用 tree 命令画出目录树
# 观察：目录带 / 后缀，最后一项用 └── 连接
`,
      },
      solutions: {
        bash: `tree`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"docs":{"type":"dir","children":{"a.txt":{"type":"file","content":"x\\n"},"b.md":{"type":"file","content":"y\\n"}}},"pics":{"type":"dir","children":{}}}}}',
  },
];
