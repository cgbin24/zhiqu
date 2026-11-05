import type { Level } from '@/types';

/**
 * Git 实战课程 · 第二章：分支与切换（paradigm，4 关）
 *
 * 提交「一段 git 命令脚本」，由本地仓库模拟器（src/judge/git-sim.ts）执行，
 * stdout 与 expected 逐字符比对。提交哈希完全确定（seq+msg+parent 的 fnv1a）。
 * 章节文件自包含（与 verify-levels.mjs 的 Node 直跑兼容）。
 */

const L1_SCRIPT = `git init
echo "v1" > app.js
git add app.js
git commit -m "feat: v1"
git branch
git branch dev
git branch`;

const L1_EXPECTED = `已初始化空 Git 仓库（.git/）
[main 630950f] feat: v1
* main
* main
  dev`;

const L2_SCRIPT = `git init
echo "主页" > index.html
git add index.html
git commit -m "feat: 主页"
git branch dev
git switch dev
echo "开发版" > dev.txt
git add dev.txt
git commit -m "feat: dev 专属功能"
git switch main
git status
git log --oneline`;

const L2_EXPECTED = `已初始化空 Git 仓库（.git/）
[main 5128c7c] feat: 主页
切换到分支 'dev'
[dev 9d38839] feat: dev 专属功能
切换到分支 'main'
[main]
工作区干净
5128c7c feat: 主页`;

const L3_SCRIPT = `git init
echo "v1" > app.js
git add app.js
git commit -m "feat: 初始版本"
git switch -c feat/login
echo "登录表单" > login.html
git add login.html
git commit -m "feat: 登录表单"
echo "登录校验" > login.js
git add login.js
git commit -m "feat: 登录校验"
git branch`;

const L3_EXPECTED = `已初始化空 Git 仓库（.git/）
[main cd5d5bf] feat: 初始版本
切换到新分支 'feat/login'
[feat/login 5cd4643] feat: 登录表单
[feat/login 40fe149] feat: 登录校验
  main
* feat/login`;

const L4_SCRIPT = `git init
echo "v1" > app.js
git add app.js
git commit -m "feat: v1"
git branch dev
git switch dev
echo "dev 改动一" > dev1.txt
git add dev1.txt
git commit -m "feat: dev 第一周"
echo "dev 改动二" > dev2.txt
git add dev2.txt
git commit -m "feat: dev 第二周"
git switch main
echo "main 独有" > main.txt
git add main.txt
git commit -m "feat: main 前进"
git log --oneline
git switch dev
git log --oneline`;

const L4_EXPECTED = `已初始化空 Git 仓库（.git/）
[main 630950f] feat: v1
切换到分支 'dev'
[dev d8e3b5d] feat: dev 第一周
[dev 996830c] feat: dev 第二周
切换到分支 'main'
[main 6fd42f7] feat: main 前进
6fd42f7 feat: main 前进
630950f feat: v1
切换到分支 'dev'
996830c feat: dev 第二周
d8e3b5d feat: dev 第一周
630950f feat: v1`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'git-paradigm-1',
  lang: 'git',
  module: 'paradigm',
  order: 1,
  title: '分支是什么：只是一张会动的便利贴',
  difficulty: 2,
  xp: 20,
  goals: [
    '掌握 git branch：列出分支（* 标记当前）与创建新分支',
    '理解分支的本质：指向某个提交的"可移动指针"，不是代码拷贝',
    '观察创建分支后"当前分支"不变：branch 只贴便利贴，不搬家',
  ],
  brief: `## 分支：指向某个提交的"便利贴"

Git 的分支轻得出奇 —— 它**不是**一份代码的完整拷贝，只是指向某条提交的**可移动指针**。

\`git branch\` 列出所有分支：带 \`*\` 的是你当前所在的分支。\`git branch dev\` 只是创建一张新"便利贴"，让它指向当前提交 —— **不会切换过去**，也不改动任何代码。

为什么要分支？在 main 上直接开发，写一半项目就是"不能用"的状态；开个分支，烂摊子留在分支里，main 永远保持可用。

类比：**书签** —— 每个分支是一枚书签，夹在故事的某一页；你提交到哪一步，书签就停在哪一页。

> 💡 创建分支零成本，放心多开。真正要记的是"我现在在哪个分支上"—— branch 命令随时查看。`,
  task: `## 任务：创建你的第一个分支

1. \`git init\`；
2. \`echo "v1" > app.js\` → \`git add app.js\` → \`git commit -m "feat: v1"\` —— 先得有一个提交；
3. \`git branch\` —— 此时应只看到 \`* main\` 一行；
4. \`git branch dev\` —— 创建分支（注意：这条命令没有任何输出）；
5. \`git branch\` —— 再看：\`* main\` 与 \`  dev\` 两行，星号仍停在 main 上。

体会：创建分支后，当前分支并没有变 —— branch 只贴便利贴，不搬家。`,
  starter: `# 第 1 关：分支是什么
# 最后一行应该是两行分支列表（* 在 main 上）

# TODO 1: 初始化仓库

# TODO 2: 创建 app.js 内容 v1，add 后提交"feat: v1"

# TODO 3: git branch 查看分支列表（应只有 * main）

# TODO 4: 创建分支 dev（无输出）

# TODO 5: 再 git branch 查看（应出现两行，星号仍在 main）`,
  solution: L1_SCRIPT,
  hints: [
    '先有一个提交才能看到分支：echo "v1" > app.js → git add app.js → git commit -m "feat: v1"。',
    'git branch 带名字是创建（无输出），不带名字是列出；列出的行里星号在当前分支前。',
    '最终分支列表两行：* main 在前、  dev 在后（dev 前面是两个空格，不是星号）。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'git-paradigm-2',
  lang: 'git',
  module: 'paradigm',
  order: 2,
  title: '切换分支：switch 的世界穿越',
  difficulty: 2,
  xp: 20,
  goals: [
    '掌握 git switch：切换到已有分支，并从输出确认切换成功',
    '观察"不同分支不同世界"：dev 上创建的文件切回 main 后消失',
    '理解每条分支有独立历史：main 的 log 看不到 dev 的提交',
  ],
  brief: `## git switch：走进另一个平行世界

\`git switch dev\` 把 HEAD 指向 dev，**工作区文件瞬间变成 dev 分支记录的样子**：main 上没有的文件会出现，dev 上没有的文件会消失。

每个分支都有自己独立的历史和文件快照 —— 在 dev 上提交的 dev.txt，切回 main 后就"不见了"：不是被删除，而是**它只属于 dev 的世界**。这是 Git 最反直觉、也最强大的一点。

类比：**平行宇宙** —— 每个分支是一条世界线；switch 是穿越，你在哪条线存档（提交），就只改变那条线。

> 💡 切换前最好保持工作区干净（status 检查一下）。模拟器里 switch 会直接摆正文件，真 Git 对带着未提交改动切换要挑剔得多。`,
  task: `## 任务：在分支间切换，观察两个世界

1. \`git init\` → \`echo "主页" > index.html\` → add → \`git commit -m "feat: 主页"\`；
2. \`git branch dev\` 创建分支；
3. \`git switch dev\` —— 输出会确认切换；
4. 在 dev 上：\`echo "开发版" > dev.txt\` → add → \`git commit -m "feat: dev 专属功能"\`；
5. \`git switch main\` —— 回到 main；
6. \`git status\` —— 工作区干净，dev.txt 不见了；
7. \`git log --oneline\` —— main 的历史里没有 dev 的提交。`,
  starter: `# 第 2 关：切换分支
# 关键观察：切回 main 后 dev.txt 消失、log 里没有 dev 的提交

# TODO 1: 初始化仓库

# TODO 2: 创建 index.html（内容"主页"），add 后提交"feat: 主页"

# TODO 3: 创建分支 dev，再 switch 过去

# TODO 4: 在 dev 上创建 dev.txt（内容"开发版"），add 后提交"feat: dev 专属功能"

# TODO 5: switch 回 main

# TODO 6: git status（工作区应干净）和 git log --oneline（应只有一条）`,
  solution: L2_SCRIPT,
  hints: [
    '切到 dev 用两步：git branch dev（无输出）+ git switch dev（输出 切换到分支 \'dev\'）。',
    '切回 main 后 status 只有两行：[main] 和 工作区干净 —— dev.txt 是 dev 世界的东西。',
    'main 的 log --oneline 只有一条：提交哈希 + " feat: 主页"（dev 的提交不属于 main 的历史）。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'git-paradigm-3',
  lang: 'git',
  module: 'paradigm',
  order: 3,
  title: 'switch -c：新建即切换',
  difficulty: 3,
  xp: 25,
  goals: [
    '掌握 git switch -c：一条命令完成"建分支 + 切换"',
    '在新分支上连续提交两次，练习功能分支工作流',
    '对比"先 branch 再 switch"的两步写法，理解 -c 是合体版',
  ],
  brief: `## switch -c：两步并作一步

新建分支再切换要两条命令：

    git branch feat/login  # 创建
    git switch feat/login  # 切换

实际开发中"开新分支"是最高频动作，Git 提供了合体版：\`git switch -c feat/login\` —— **创建并立即切换**。

老教程里的 \`git checkout -b\` 效果相同；switch 是更安全的现代写法（老命令兼职杂活，容易误操作）。

类比：**新开一局游戏** —— 不是读旧档（switch），而是复制当前进度、立刻在新档位继续玩。

> 💡 团队协作的肌肉记忆：动工前先 switch -c 开功能分支，用 feat/xxx、fix/xxx 前缀命名。`,
  task: `## 任务：一条命令开分支并切换

1. \`git init\` → \`echo "v1" > app.js\` → add → \`git commit -m "feat: 初始版本"\`；
2. \`git switch -c feat/login\` —— 创建并切换，一步到位（对比：branch + switch 要两条）；
3. \`echo "登录表单" > login.html\` → add → \`git commit -m "feat: 登录表单"\`；
4. \`echo "登录校验" > login.js\` → add → \`git commit -m "feat: 登录校验"\`；
5. \`git branch\` —— 应看到 \`* feat/login\` 与 \`  main\`：两次提交都落在 feat/login 上。`,
  starter: `# 第 3 关：switch -c 新建即切换
# 关键：用一条命令完成建分支 + 切换，然后在新分支上提交两次

# TODO 1: 初始化仓库

# TODO 2: 创建 app.js 内容 v1，add 后提交"feat: 初始版本"

# TODO 3: git switch -c feat/login（输出应是"切换到新分支 'feat/login'"）

# TODO 4: 在 feat/login 上提交两次
#   login.html（内容"登录表单"）→ feat: 登录表单
#   login.js（内容"登录校验"）→ feat: 登录校验

# TODO 5: git branch 验证（星号应在 feat/login 上）`,
  solution: L3_SCRIPT,
  hints: [
    'git switch -c feat/login 会输出：切换到新分支 \'feat/login\'（注意"新"字）。',
    '两次提交都是"echo 创建文件 → git add 文件 → git commit -m"的三连。',
    'git branch 列表顺序按创建先后：第一行   main，第二行 * feat/login。',
  ],
  tests: tests(L3_EXPECTED),
};

const L4: Level = {
  id: 'git-paradigm-4',
  lang: 'git',
  module: 'paradigm',
  order: 4,
  title: '并行宇宙：两条分支各自前进',
  difficulty: 3,
  xp: 25,
  goals: [
    '在两条分支上交替提交，体会"互不干扰的时间线"',
    '验证 main 与 dev 的 log 各自独立，只记录自己线上的提交',
    '建立心智模型：分支分岔后是并行宇宙，缝合要靠 merge（下一章）',
  ],
  brief: `## 并行宇宙：两条时间线各自前进

分支一旦分岔，就是两条**互不干扰的时间线**：在 dev 上连提两次，main 完全不知道；切回 main 再提交，dev 也毫不知情 —— 各自的 log 只记录各自线上的提交。

这正是团队开发的真实图景：你在 feature 分支上安静开发，同事的 main 照常推进，谁也不阻塞谁。等两边都稳定了，再用 merge（下一章）把两条线"缝合"回来。

类比：**存档位** —— 开局存了个档，一条线走 A 剧情、一条线走 B 剧情；两个存档各自演化，互不覆盖。

> 💡 随时用 log --oneline 回答"我在哪条线上、线上有什么"—— 输出和预期对不上时，先确认自己在哪个分支。`,
  task: `## 任务：让两条分支各自前进

1. \`git init\` → \`echo "v1" > app.js\` → add → \`git commit -m "feat: v1"\`；
2. \`git branch dev\` → \`git switch dev\`；
3. dev 上提交两次：\`echo "dev 改动一" > dev1.txt\` → add → \`git commit -m "feat: dev 第一周"\`；再 \`echo "dev 改动二" > dev2.txt\` → add → \`git commit -m "feat: dev 第二周"\`；
4. \`git switch main\` → \`echo "main 独有" > main.txt\` → add → \`git commit -m "feat: main 前进"\`；
5. \`git log --oneline\` —— 只有 main 的两条（main 前进、v1）；
6. \`git switch dev\` → \`git log --oneline\` —— dev 的三条（dev 第二周、dev 第一周、v1）。`,
  starter: `# 第 4 关：并行宇宙
# 关键观察：main 与 dev 的 log --oneline 输出完全不同

# TODO 1: 初始化仓库

# TODO 2: 创建 app.js 内容 v1，add 后提交"feat: v1"

# TODO 3: 建分支 dev 并切换过去

# TODO 4: dev 上提交两次
#   dev1.txt（内容"dev 改动一"）→ feat: dev 第一周
#   dev2.txt（内容"dev 改动二"）→ feat: dev 第二周

# TODO 5: switch 回 main，创建 main.txt（内容"main 独有"），add 后提交"feat: main 前进"

# TODO 6: 在 main 上 git log --oneline，再 switch dev 后 git log --oneline（对比两条历史）`,
  solution: L4_SCRIPT,
  hints: [
    'dev 上的两次提交输出都带 [dev 哈希]；切回 main 后提交输出变回 [main 哈希]。',
    'main 的 log --oneline 两行（main 前进在上、v1 在下）；dev 的三行（第二周、第一周、v1）。',
    '两次 log 之间夹着 git switch dev，其输出是：切换到分支 \'dev\'。',
  ],
  tests: tests(L4_EXPECTED),
};

export const GIT_PARADIGM: Level[] = [L1, L2, L3, L4];
