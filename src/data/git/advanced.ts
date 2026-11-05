import type { Level } from '@/types';

/**
 * Git 实战课程 · 第三章：合并与历史（advanced，4 关）
 *
 * 提交「一段 git 命令脚本」，由本地仓库模拟器（src/judge/git-sim.ts）执行，
 * stdout 与 expected 逐字符比对。提交哈希完全确定（seq+msg+parent 的 fnv1a）。
 * 章节文件自包含（与 verify-levels.mjs 的 Node 直跑兼容）。
 */

const L1_SCRIPT = `git init
echo "核心库 v1" > lib.js
git add lib.js
git commit -m "feat: 核心库 v1"
git branch feat
git switch feat
echo "功能 A 完成" > feat-a.txt
git add feat-a.txt
git commit -m "feat: 功能 A"
echo "功能 B 完成" > feat-b.txt
git add feat-b.txt
git commit -m "feat: 功能 B"
git switch main
git merge feat
git log --oneline`;

const L1_EXPECTED = `已初始化空 Git 仓库（.git/）
[main ad40fd0] feat: 核心库 v1
切换到分支 'feat'
[feat dc13f30] feat: 功能 A
[feat c9c113b] feat: 功能 B
切换到分支 'main'
正在快进 main 至 feat
Fast-forward
c9c113b feat: 功能 B
dc13f30 feat: 功能 A
ad40fd0 feat: 核心库 v1`;

const L2_SCRIPT = `git init
echo "v1" > app.js
git add app.js
git commit -m "feat: 初始版本"
git branch feat
git switch feat
echo "新功能" > feat.js
git add feat.js
git commit -m "feat: 新功能"
git switch main
git merge feat
git merge feat
git log --oneline`;

const L2_EXPECTED = `已初始化空 Git 仓库（.git/）
[main cd5d5bf] feat: 初始版本
切换到分支 'feat'
[feat 68057f9] feat: 新功能
切换到分支 'main'
正在快进 main 至 feat
Fast-forward
已是最新
68057f9 feat: 新功能
cd5d5bf feat: 初始版本`;

const L3_SCRIPT = `git init
echo "基础模块" > core.js
git add core.js
git commit -m "feat: 基础模块"
git branch dev
git switch dev
echo "开发新功能" > dev.js
git add dev.js
git commit -m "feat: 开发新功能"
git switch main
echo "主线修复" > main.js
git add main.js
git commit -m "feat: 主线修复"
git merge dev
git status
git log --oneline`;

const L3_EXPECTED = `已初始化空 Git 仓库（.git/）
[main d4806a5] feat: 基础模块
切换到分支 'dev'
[dev c60a157] feat: 开发新功能
切换到分支 'main'
[main 2916424] feat: 主线修复
[main 9540f6d] Merge branch 'dev'
[main]
工作区干净
9540f6d Merge branch 'dev'
2916424 feat: 主线修复
d4806a5 feat: 基础模块`;

const L4_SCRIPT = `git init
echo "登录功能" > login.js
git add login.js
git commit -m "feat: 登录功能"
echo "首页功能" > home.js
git add home.js
git commit -m "feat: 首页功能"
echo "支付功能" > pay.js
git add pay.js
git commit -m "feat: 支付功能"
git tag v1.0
echo "修复支付 bug" > pay.js
git add pay.js
git commit -m "fix: 修复支付 bug"
git tag v2.0
git tag
git log --oneline`;

const L4_EXPECTED = `已初始化空 Git 仓库（.git/）
[main 624e893] feat: 登录功能
[main 531bdfa] feat: 首页功能
[main 77be8fc] feat: 支付功能
[main d758448] fix: 修复支付 bug
v1.0
v2.0
d758448 fix: 修复支付 bug
77be8fc feat: 支付功能
531bdfa feat: 首页功能
624e893 feat: 登录功能`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'git-advanced-1',
  lang: 'git',
  module: 'advanced',
  order: 1,
  title: '快进合并：指针的直接移动',
  difficulty: 3,
  xp: 25,
  goals: [
    '掌握 git merge：把另一个分支的提交合入当前分支',
    '理解快进（fast-forward）：main 直接把指针挪到 feat 的最新提交',
    '用 git log --oneline 验证合并后 main 拥有全部分支的提交',
  ],
  brief: `## merge：把分支的成果搬回主线

feat 写完、验证通过，就该**合回主线**：切到 main 执行 \`git merge feat\`。

main 分叉后**一个提交都没走**？走最省事的**快进（fast-forward）**：main 指针直接挪到 feat 最新提交，不产生新提交。输出两行：\`正在快进 main 至 feat\` + \`Fast-forward\`。

快进后 \`git log --oneline\` 里 main 拥有 feat 全部提交——分支只是指针，快进就是拨快指针。

类比：**录像带快进** —— 不重录画面，直接快进到最新进度（feat 顶端）接着放。

> 💡 快进的前提是"main 分叉后没动"；main 也有提交时就走另一条路（第 3 关见）。`,
  task: `## 任务：快进合并

1. \`git init\` 初始化仓库；
2. 在 main 上提交一次：\`echo "核心库 v1" > lib.js\` → \`git add lib.js\` → \`git commit -m "feat: 核心库 v1"\`；
3. \`git branch feat\` 建分支，\`git switch feat\` 切过去；
4. 在 feat 上连续提交两次：
   - \`echo "功能 A 完成" > feat-a.txt\` → add → \`git commit -m "feat: 功能 A"\`
   - \`echo "功能 B 完成" > feat-b.txt\` → add → \`git commit -m "feat: 功能 B"\`
5. \`git switch main\` 回到主线；
6. \`git merge feat\` —— 观察两行快进输出：\`正在快进 main 至 feat\`、\`Fast-forward\`；
7. \`git log --oneline\` —— main 现在拥有全部 3 条提交，最新的 \`c9c113b feat: 功能 B\` 在最上。

哈希提示：核心库 v1 为 ad40fd0，功能 A 为 dc13f30，功能 B 为 c9c113b。`,
  starter: `# 第 1 关：快进合并
# 分支 feat 上有两次提交，要把它们合回 main（两行快进输出）

# TODO 1: 初始化仓库

# TODO 2: 在 main 上提交一次（lib.js，"feat: 核心库 v1"）

# TODO 3: 建分支 feat 并切换过去

# TODO 4: 在 feat 上连续提交两次（feat-a.txt / feat-b.txt）

# TODO 5: 切回 main，执行 git merge feat

# TODO 6: git log --oneline 验证 main 拥有全部提交`,
  solution: L1_SCRIPT,
  hints: [
    '建分支和切换是两条命令：git branch feat 之后 git switch feat；在 feat 上提交时输出会显示 [feat 哈希]。',
    '合并前必须先 git switch main——merge 是"把对方合入我当前所在的分支"；成功时输出 正在快进 main 至 feat 和 Fast-forward 两行。',
    '合并后 log --oneline 从新到旧三行：c9c113b 功能 B、dc13f30 功能 A、ad40fd0 核心库 v1。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'git-advanced-2',
  lang: 'git',
  module: 'advanced',
  order: 2,
  title: '已是最新：合并的幂等性',
  difficulty: 2,
  xp: 20,
  goals: [
    '重复合并同一个分支，观察"已是最新"输出',
    '理解合并是幂等的：已合并的内容再次合并不会产生新提交',
    '养成合并后用 git log 验证历史的习惯',
  ],
  brief: `## 已是最新：合并的幂等性

合并过的分支再合并一次会发生什么？答案是三个字：**已是最新**。什么都不变——没有新提交、没有报错、工作区纹丝不动。

这叫**幂等**：同一操作执行多次，结果与执行一次相同。Git 在合并前会先检查——如果对方分支的提交已经在当前分支的历史里，就没什么可做的，直接告诉你"已是最新"。

类比：**把已经读过的信再寄一遍** —— 收件人一看内容早就读过了，礼貌地回一句"已知悉"，绝不会把它当成新消息归档。

这个特性让人安心：你可以放心地重复合并（很多团队的脚本甚至"顺手再 merge 一次"保证同步），Git 不会产生重复的合并提交把历史搅乱。

> 💡 "已是最新"不是错误，而是确认——你想要的东西已经在历史里了，无需任何操作。`,
  task: `## 任务：合并，再合并

1. \`git init\` 初始化仓库；
2. main 上提交：\`echo "v1" > app.js\` → \`git add app.js\` → \`git commit -m "feat: 初始版本"\`；
3. \`git branch feat\` + \`git switch feat\`，在 feat 上提交：\`echo "新功能" > feat.js\` → add → \`git commit -m "feat: 新功能"\`；
4. \`git switch main\` 回主线，\`git merge feat\` —— 第一次合并，快进两行输出；
5. **再执行一次** \`git merge feat\` —— 这次输出只有一个词：已是最新；
6. \`git log --oneline\` 验证：历史仍然只有 2 条提交，重复合并没有多出任何记录。

哈希提示：初始版本为 cd5d5bf，新功能为 68057f9。`,
  starter: `# 第 2 关：已是最新
# 目标：第二次 merge feat 的输出只有三个字——已是最新

# TODO 1: 初始化仓库，main 上提交一次（app.js，"feat: 初始版本"）

# TODO 2: 建分支 feat 并切换，提交一次（feat.js，"feat: 新功能"）

# TODO 3: 切回 main，第一次 merge feat（应看到快进输出）

# TODO 4: 再 merge 一次 feat（观察这次的输出）

# TODO 5: git log --oneline 验证历史只有 2 条提交`,
  solution: L2_SCRIPT,
  hints: [
    '流程和上一关一样：main 提交 → 建分支切过去提交 → 切回 main → merge。第一次 merge 输出 正在快进 main 至 feat + Fast-forward。',
    '第二次 merge 什么都不用改，就是再敲一遍 git merge feat——输出只有 已是最新 一行。',
    '最终 log --oneline 两行：68057f9 feat: 新功能、cd5d5bf feat: 初始版本。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'git-advanced-3',
  lang: 'git',
  module: 'advanced',
  order: 3,
  title: '真合并：两条历史合流',
  difficulty: 4,
  xp: 30,
  goals: [
    '制造分叉：main 与 dev 各自有新提交，谁也不是谁的后代',
    '执行真合并：Git 自动产生一个合并提交（Merge branch）',
    '理解合并提交有两个父提交，是两条历史的汇合点',
  ],
  brief: `## 真合并：两条历史合流

如果分叉后 main 自己也有新提交，快进就行不通了——两边谁也包含不了谁，改动都得保住。这时 Git 走**三方合并**：以分叉点为基准，把两边的改动各取所长，自动生成一个**合并提交**，信息固定为 \`Merge branch '<分支名>'\`。

合并提交有**两个父提交**——指向 main 原来的位置和 dev 的最新提交，像一座桥把两条历史连成一体。两边改的是不同文件时 Git 能自动合好；改了同一处才会遇到"冲突"。

类比：**两条河流交汇** —— 主河道与支流各有水声，交汇处（合并提交）同时承接两条河的水，此后奔涌成同一条大河。

> 💡 模拟器的 log 沿第一父链展示；真 git 的 log 会把支线提交也列出，但合并提交永远连着两边。`,
  task: `## 任务：制造分叉，再合流

1. \`git init\` 初始化仓库；
2. main 提交：\`echo "基础模块" > core.js\` → \`git add core.js\` → \`git commit -m "feat: 基础模块"\`；
3. \`git branch dev\` + \`git switch dev\`，dev 上提交：\`echo "开发新功能" > dev.js\` → add → \`git commit -m "feat: 开发新功能"\`；
4. \`git switch main\` 切回主线——注意 main 还停在"基础模块"；
5. main 也提交：\`echo "主线修复" > main.js\` → add → \`git commit -m "feat: 主线修复"\` —— **分叉了！**；
6. \`git merge dev\` —— 这次不是快进：Git 产生合并提交，输出 \`[main 9540f6d] Merge branch 'dev'\`；
7. \`git status\` —— 合并后工作区干净；
8. \`git log --oneline\` —— 三条记录：合并提交 9540f6d 在最上，其下依次是 2916424 主线修复、d4806a5 基础模块（log 沿第一父链展示；dev 的"开发新功能" c60a157 已通过合并进入 main）。

哈希提示：合并提交的哈希无法手算，以模拟器实际输出为准（9540f6d）。`,
  starter: `# 第 3 关：真合并
# main 与 dev 各自有新提交，合并会产生一个合并提交

# TODO 1: 初始化仓库，main 上提交一次（core.js，"feat: 基础模块"）

# TODO 2: 建分支 dev 并切换，dev 上提交一次（dev.js，"feat: 开发新功能"）

# TODO 3: 切回 main，main 也提交一次（main.js，"feat: 主线修复"）——分叉了！

# TODO 4: git merge dev，观察合并提交的输出

# TODO 5: git status 与 git log --oneline 验证合并结果`,
  solution: L3_SCRIPT,
  hints: [
    '分叉的关键：切回 main 后一定要在 main 上再提交一次，两边才有各自的提交，merge 才不是快进。',
    '真合并不输出 Fast-forward，而是一条提交记录：[main 哈希] Merge branch \'dev\'——哈希是 9540f6d。',
    '最后 status 为 工作区干净；log --oneline 三行从上到下：9540f6d Merge branch \'dev\'、2916424 feat: 主线修复、d4806a5 feat: 基础模块。',
  ],
  tests: tests(L3_EXPECTED),
};

const L4: Level = {
  id: 'git-advanced-4',
  lang: 'git',
  module: 'advanced',
  order: 4,
  title: '标签：给重要时刻命名',
  difficulty: 3,
  xp: 25,
  goals: [
    '掌握 git tag：给当前提交打上版本标签',
    '用 git tag 列出全部标签（每行一个）',
    '理解标签与分支的区别：分支随提交移动，标签永远固定',
  ],
  brief: `## tag：给重要时刻钉一块里程碑

版本发布、重要功能上线——这些时刻值得被**命名**：\`git tag v1.0\` 给当前提交钉上标签，成功时没有任何输出，低调得像盖了个戳。

标签和分支都"指向某个提交"，但脾气完全不同：**分支会动**——每次提交它都跟着往前挪；**标签不动**——它钉死在那个提交上，永远提醒你"v1.0 长这样"。以后想回看发布时的代码，\`git tag\` 一眼找到名字，比在哈希海洋里捞针方便得多。

类比：**马拉松的里程碑** —— 选手（分支）不断向前跑，5 公里、10 公里的路牌（标签）却始终钉在原地，随时告诉你"比赛进行到这里时的样子"。

> 💡 业界惯例：对外发布用 v主.次 版本号（v1.0、v2.0）；打了标签的提交通常视为定稿，不再改动。`,
  task: `## 任务：给版本钉上标签

1. \`git init\` 初始化仓库；
2. 连续三次功能提交（每轮：echo 新文件 → git add → commit）：
   - \`echo "登录功能" > login.js\` → add → \`git commit -m "feat: 登录功能"\`
   - \`echo "首页功能" > home.js\` → add → \`git commit -m "feat: 首页功能"\`
   - \`echo "支付功能" > pay.js\` → add → \`git commit -m "feat: 支付功能"\`
3. \`git tag v1.0\` —— 给当前提交（支付功能）打上发布标签，成功时无输出；
4. \`echo "修复支付 bug" > pay.js\`（覆盖）→ \`git add pay.js\` → \`git commit -m "fix: 修复支付 bug"\`；
5. \`git tag v2.0\`；
6. \`git tag\` —— 逐行列出两个标签：v1.0、v2.0；
7. \`git log --oneline\` —— 4 条提交从新到旧；注意标签不会出现在 log 里，它们钉在各自的提交上。

哈希提示：登录 624e893 / 首页 531bdfa / 支付 77be8fc / 修复 d758448。`,
  starter: `# 第 4 关：标签
# 标签创建成功时没有任何输出，git tag 才会逐行列出它们

# TODO 1: 初始化仓库，连续提交 3 次（login.js / home.js / pay.js）

# TODO 2: 给当前提交打上标签 v1.0

# TODO 3: 覆盖 pay.js（"修复支付 bug"），提交"fix: 修复支付 bug"

# TODO 4: 给当前提交打上标签 v2.0

# TODO 5: git tag 列出全部标签，git log --oneline 查看 4 条提交`,
  solution: L4_SCRIPT,
  hints: [
    '打标签就是 git tag v1.0，不带任何额外参数；创建成功时终端安静（无输出），别以为没生效。',
    'git tag（后面什么都不加）是列出标签，每行一个、按创建顺序：v1.0 在上、v2.0 在下。',
    'log --oneline 四行从新到旧：d758448 fix: 修复支付 bug、77be8fc feat: 支付功能、531bdfa feat: 首页功能、624e893 feat: 登录功能。',
  ],
  tests: tests(L4_EXPECTED),
};

export const GIT_ADVANCED: Level[] = [L1, L2, L3, L4];
