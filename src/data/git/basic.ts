import type { Level } from '@/types';

/**
 * Git 实战课程 · 第一章：仓库与提交（basic，4 关）
 *
 * 提交「一段 git 命令脚本」，由本地仓库模拟器（src/judge/git-sim.ts）执行，
 * stdout 与 expected 逐字符比对。提交哈希完全确定（seq+msg+parent 的 fnv1a）。
 * 章节文件自包含（与 verify-levels.mjs 的 Node 直跑兼容）。
 */

const L1_SCRIPT = `git init
git status
echo "你好，Git" > readme.txt
git status
touch notes.txt
git status`;

const L1_EXPECTED = `已初始化空 Git 仓库（.git/）
[main]
工作区干净
[main]
未跟踪: readme.txt
[main]
未跟踪: readme.txt, notes.txt`;

const L2_SCRIPT = `git init
echo "console.log('hi')" > app.js
git add app.js
git status
git commit -m "feat: 第一版应用"
git status
git log --oneline`;

const L2_EXPECTED = `已初始化空 Git 仓库（.git/）
[main]
暂存: app.js
[main 55dee5a] feat: 第一版应用
[main]
工作区干净
55dee5a feat: 第一版应用`;

const L3_SCRIPT = `git init
echo "v1" > app.js
git add .
git commit -m "feat: 初始版本"
echo "v2" > app.js
git add app.js
git commit -m "fix: 修正输出"
git log --oneline
git log`;

const L3_EXPECTED = `已初始化空 Git 仓库（.git/）
[main cd5d5bf] feat: 初始版本
[main aed3e6c] fix: 修正输出
aed3e6c fix: 修正输出
cd5d5bf feat: 初始版本
commit aed3e6c
Author: student@codequest
Date:   2026-01-01 12:00:00 +0800

    fix: 修正输出

commit cd5d5bf
Author: student@codequest
Date:   2026-01-01 12:00:00 +0800

    feat: 初始版本`;

const L4_SCRIPT = `git init
echo "第 1 章内容" > book1.txt
git add book1.txt
git commit -m "docs: 第 1 章"
echo "第 2 章内容" > book2.txt
git add book2.txt
git commit -m "docs: 第 2 章"
echo "第 3 章内容" > book3.txt
git add book3.txt
git commit -m "docs: 第 3 章"
git log --oneline`;

const L4_EXPECTED = `已初始化空 Git 仓库（.git/）
[main 8242b2e] docs: 第 1 章
[main e317cc9] docs: 第 2 章
[main e5edfe7] docs: 第 3 章
e5edfe7 docs: 第 3 章
e317cc9 docs: 第 2 章
8242b2e docs: 第 1 章`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'git-basic-1',
  lang: 'git',
  module: 'basic',
  order: 1,
  title: '初始化仓库：一切从 init 开始',
  difficulty: 1,
  xp: 15,
  goals: [
    '掌握 git init：把普通文件夹变成 Git 仓库',
    '认识 git status 的三种状态：干净 / 未跟踪',
    '理解"未跟踪"：Git 看见了你新建的文件，但还没开始管它',
  ],
  brief: `## git init：给文件夹装上"存档系统"

Git 仓库 = 普通文件夹 + 一个隐藏的 \`\.git\` 目录（数据库）。\`git init\` 就是装这个数据库——一个项目只需执行一次。

\`git status\` 是 Git 里最常用的命令（没有之一），随时可以看仓库现在的状态：

- 刚 init 完、什么都没有 → **工作区干净**
- 新建了一个文件 → 显示**未跟踪**：Git 看见了它，但还没纳入管理

类比：**新买的游戏** —— init 是装存档系统，"未跟踪"是游戏发现了新地图但还没存过档。

> 💡 status 不会改动任何东西，迷路了就敲 status，它是你的仪表盘。`,
  task: `## 任务：初始化仓库并观察状态变化

在模拟器中依次执行：

1. \`git init\` 初始化仓库；
2. \`git status\` 查看初始状态（应为"工作区干净"）；
3. \`echo "你好，Git" > readme.txt\` 创建第一个文件；
4. \`git status\` —— 观察出现的变化；
5. \`touch notes.txt\` 再建一个空文件；
6. \`git status\` —— 未跟踪列表应包含两个文件（按创建顺序）。

每一步的输出都会被判题器逐字符比对。`,
  starter: `# 第 1 关：初始化仓库
# 每行一条命令，# 开头是注释

# TODO 1: 初始化 Git 仓库

# TODO 2: 查看初始状态（应为"工作区干净"）

# TODO 3: 用 echo 创建 readme.txt，内容为"你好，Git"

# TODO 4: 查看 status（readme.txt 应为未跟踪）

# TODO 5: 用 touch 创建空文件 notes.txt

# TODO 6: 再看一次 status（未跟踪应有两个文件）`,
  solution: L1_SCRIPT,
  hints: [
    'init 之后 status 的输出只有一行：[main] 工作区干净。',
    '创建文件：echo "你好，Git" > readme.txt（引号包住内容）；空文件用 touch notes.txt。',
    '未跟踪列表按文件创建顺序排列：readme.txt 在前、notes.txt 在后，逗号+空格分隔。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'git-basic-2',
  lang: 'git',
  module: 'basic',
  order: 2,
  title: '暂存与提交：存档的完整动作',
  difficulty: 2,
  xp: 20,
  goals: [
    '掌握 add → commit 两步存档：暂存区是"购物车"，提交才是"结算"',
    '观察 status 在 add 前后的变化',
    '理解提交后工作区干净、历史多了一条记录',
  ],
  brief: `## add 与 commit：购物车与结算

Git 的存档分两步：\`git add\` 把改动放进**暂存区**（购物车——挑这次要提交什么），\`git commit -m\` 才真正**提交**（结算——生成一条不可变的历史记录）。

为什么分两步？你可能改了 5 个文件，但只想提交其中 2 个 —— 暂存区让你**精确控制每次提交的内容**。

提交后：工作区干净、暂存区清空、历史里多了一条带哈希的记录（如 \`55dee5a\`），这是这次存档的唯一编号。

类比：**购物车** —— add 是加购，commit 是付款；加购了没付款，订单（历史）不会出现。

> 💡 提交信息用"动词 + 什么变了"：feat: 新功能 / fix: 修 bug / docs: 文档。`,
  task: `## 任务：完成第一次完整存档

1. \`git init\` 初始化；
2. \`echo "console.log('hi')" > app.js\` 创建代码文件；
3. \`git add app.js\` 暂存它；
4. \`git status\` —— app.js 应出现在"暂存"行；
5. \`git commit -m "feat: 第一版应用"\` 提交；
6. \`git status\` —— 应恢复"工作区干净"；
7. \`git log --oneline\` —— 历史里应有一条记录（哈希为 55dee5a）。`,
  starter: `# 第 2 关：暂存与提交
# 目标输出最后一行：55dee5a feat: 第一版应用

# TODO 1: 初始化仓库

# TODO 2: 创建 app.js，内容为 console.log('hi')（用 echo + >）

# TODO 3: 暂存 app.js

# TODO 4: 查看 status —— app.js 应在"暂存"行

# TODO 5: 提交，信息为"feat: 第一版应用"

# TODO 6: 再看 status，然后 log --oneline`,
  solution: L2_SCRIPT,
  hints: [
    'echo 的内容含引号时外层也要引号：echo "console.log(\'hi\')" > app.js。',
    'add 之后 status 会显示"暂存: app.js"；commit 会输出 [main 哈希] 提交信息。',
    '提交后 status 回到"工作区干净"，log --oneline 输出 55dee5a feat: 第一版应用。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'git-basic-3',
  lang: 'git',
  module: 'basic',
  order: 3,
  title: '查看历史：log 的两种打开方式',
  difficulty: 2,
  xp: 20,
  goals: [
    '掌握 git log --oneline：一行一条快速浏览',
    '掌握完整 git log：查看每条提交的作者与时间',
    '理解历史是"链"：每条提交通过哈希唯一标识',
  ],
  brief: `## git log：你的存档列表

提交会产生一条**不可变的历史记录**，每条有唯一哈希。\`git log\` 有两种常用姿势：

- \`git log --oneline\`：一行一条 \`哈希 提交信息\`，最新的在最上面 —— 日常浏览用这个；
- \`git log\`：完整格式，含 Author / Date / 完整信息 —— 排查"这行代码谁改的"时用。

注意顺序：**最新的提交排在最前**（历史从最新往回读）。

类比：**游戏存档列表** —— oneline 是快速读档菜单，完整 log 是点开存档看详情。

> 💡 哈希前 7 位（如 aed3e6c）就可以唯一指代一次提交，日常够用。`,
  task: `## 任务：两次提交，两种 log

1. \`git init\`；
2. \`echo "v1" > app.js\` → \`git add .\` → \`git commit -m "feat: 初始版本"\`；
3. \`echo "v2" > app.js\`（修改同一文件）→ \`git add app.js\` → \`git commit -m "fix: 修正输出"\`；
4. \`git log --oneline\` —— 两条记录，最新的在前；
5. \`git log\` —— 完整格式，注意每条提交之间有一个空行。

哈希是完全确定的：初始版本为 cd5d5bf，修正输出为 aed3e6c。`,
  starter: `# 第 3 关：查看提交历史
# 两个哈希：cd5d5bf（初始版本）、aed3e6c（修正输出）

# TODO 1: 初始化仓库

# TODO 2: 创建 app.js 内容 v1，add . 后提交"feat: 初始版本"

# TODO 3: 覆盖 app.js 内容为 v2，add 后提交"fix: 修正输出"

# TODO 4: git log --oneline 查看简史

# TODO 5: git log 查看完整历史`,
  solution: L3_SCRIPT,
  hints: [
    '修改文件还是用 echo 覆盖：echo "v2" > app.js；add 时用 add app.js 或 add . 都可以。',
    'log --oneline 两条：第一行 aed3e6c fix: 修正输出，第二行 cd5d5bf feat: 初始版本 —— 最新的在前。',
    '完整 log 每条提交是 4 行（commit/Author/Date/空行+缩进信息），提交信息前有 4 个空格缩进。',
  ],
  tests: tests(L3_EXPECTED),
};

const L4: Level = {
  id: 'git-basic-4',
  lang: 'git',
  module: 'basic',
  order: 4,
  title: '小步提交：好习惯从这里开始',
  difficulty: 3,
  xp: 25,
  goals: [
    '养成"改一点 → 提交一次"的小步提交节奏',
    '练习循环式的 status → add → commit 工作流',
    '理解提交信息是写给未来自己的说明书写给未来自己',
  ],
  brief: `## 小步提交：每个存档都是可回退的检查点

新手最常见的坏习惯：写了一整天代码，最后来一个"更新"提交。**小步提交**是反过来的：每完成一个小目标（一个功能、一节内容）就提交一次。

好处是**每个提交都是一个可回退的检查点** —— 出问题时你能精确退到"第 2 章写完"的那一刻，而不是退回昨天。

类比：**游戏里每过一关就存档** —— 死了（改崩了）只损失一小段进度。

> 💡 提交信息格式：<类型>: <内容>。docs: 文档 / feat: 功能 / fix: 修复 / style: 样式。三个月后你会感谢现在写清楚的自己。`,
  task: `## 任务：三章内容，三次提交

模拟写一本书的三个章节，每完成一章就提交一次：

1. \`git init\`；
2. \`echo "第 1 章内容" > book1.txt\` → add → \`git commit -m "docs: 第 1 章"\`；
3. \`echo "第 2 章内容" > book2.txt\` → add → \`git commit -m "docs: 第 2 章"\`；
4. \`echo "第 3 章内容" > book3.txt\` → add → \`git commit -m "docs: 第 3 章"\`；
5. \`git log --oneline\` —— 三条历史，从新到旧。

哈希依次为 8242b2e / e317cc9 / e5edfe7。`,
  starter: `# 第 4 关：小步提交
# 三个哈希：8242b2e / e317cc9 / e5edfe7

# TODO 1: 初始化仓库

# TODO 2: 三轮"创建文件 → add → commit"
#   book1.txt → docs: 第 1 章
#   book2.txt → docs: 第 2 章
#   book3.txt → docs: 第 3 章

# TODO 3: git log --oneline 验证三条历史`,
  solution: L4_SCRIPT,
  hints: [
    '每轮三行：echo 创建文件、git add 文件名、git commit -m "docs: 第 N 章"。',
    '每章是独立文件（book1/book2/book3），不用覆盖同一个文件。',
    'log --oneline 从新到旧：e5edfe7 第 3 章、e317cc9 第 2 章、8242b2e 第 1 章。',
  ],
  tests: tests(L4_EXPECTED),
};

export const GIT_BASIC: Level[] = [L1, L2, L3, L4];
