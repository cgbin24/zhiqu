import type { Level } from '@/types';

/**
 * Git 实战课程 · 第四章：差异与暂存（tips，4 关）
 *
 * 提交「一段 git 命令脚本」，由本地仓库模拟器（src/judge/git-sim.ts）执行，
 * stdout 与 expected 逐字符比对。提交哈希完全确定（seq+msg+parent 的 fnv1a）。
 * 章节文件自包含（与 verify-levels.mjs 的 Node 直跑兼容）。
 */

const L1_SCRIPT = `git init
echo "v1" > app.js
git add app.js
git commit -m "feat: 初始版本"
git add app.js
echo "v2" > app.js
git diff
git add app.js
git diff
git diff --staged
git commit -m "fix: 更新到 v2"
git status`;

const L1_EXPECTED = `已初始化空 Git 仓库（.git/）
[main cd5d5bf] feat: 初始版本
修改：app.js
无差异
修改：app.js
[main 19b121e] fix: 更新到 v2
[main]
工作区干净`;

const L2_SCRIPT = `git init
echo "*.log" > .gitignore
echo "调试输出" > debug.log
echo "正式代码" > app.js
git status
git add .
git status
git commit -m "chore: 添加 .gitignore 与首版代码"
git status
echo "运行日志" > run.log
git status`;

const L2_EXPECTED = `已初始化空 Git 仓库（.git/）
[main]
未跟踪: .gitignore, app.js
[main]
暂存: .gitignore, app.js
[main b2fb2af] chore: 添加 .gitignore 与首版代码
[main]
工作区干净
[main]
工作区干净`;

const L3_SCRIPT = `git init
echo "v1" > app.js
git add app.js
git commit -m "feat: 功能 v1"
echo "v2" > app.js
git status
git stash
git status
git stash pop
git status
git stash pop`;

const L3_EXPECTED = `已初始化空 Git 仓库（.git/）
[main 5a41bed] feat: 功能 v1
[main]
改动: app.js
已保存到 stash@{0}
[main]
工作区干净
恢复了 stash@{0}
[main]
改动: app.js
没有可恢复的 stash`;

const L4_SCRIPT = `git init
echo "v1" > app.js
echo "1.0" > config.js
git add .
git commit -m "feat: v1 基线"
git add .
echo "v2" > app.js
git add app.js
echo "v3" > app.js
echo "2.0" > config.js
git diff
git diff --staged
git status
git commit -m "feat: v2 上线"
git status`;

const L4_EXPECTED = `已初始化空 Git 仓库（.git/）
[main bf89d39] feat: v1 基线
修改：app.js
修改：config.js
修改：app.js
[main]
暂存: app.js
改动: app.js, config.js
[main d168c00] feat: v2 上线
[main]
改动: app.js, config.js`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'git-tips-1',
  lang: 'git',
  module: 'tips',
  order: 1,
  title: 'git diff：改动还没提交，先看一眼',
  difficulty: 3,
  xp: 25,
  goals: [
    '掌握 git diff：查看「暂存区 vs 工作区」的未暂存改动',
    '掌握 git diff --staged：查看「仓库 vs 暂存区」的已暂存改动',
    '理解 add 前后 diff 的变化：改动进了暂存区，普通 diff 就"看不见"了',
  ],
  brief: `## git diff：提交前看一眼

Git 文件内容分三层：**仓库**（已提交）、**暂存区**（add 过）、**工作区**（在改）。

- \`git diff\`：**暂存区 vs 工作区**，看「还没 add」的改动；
- \`git diff --staged\`：**仓库 vs 暂存区**，看「已 add、待提交」的改动。

同一份改动，add 前 diff 能看到，add 后变 **无差异** —— 它"搬"进暂存区了，想再看得换 --staged。

类比：**购物车** —— diff 盘点「手里还没放进购物车」的，--staged 核对「车里等结账」的。

> 💡 提交前标准动作：diff 查未暂存、diff --staged 查待提交，确认再 commit。`,
  task: `## 任务：追踪一次改动的"搬家"路线

在模拟器中依次执行（注意第 5 步的特殊 add）：

1. \`git init\`；
2. \`echo "v1" > app.js\` → \`git add app.js\` → \`git commit -m "feat: 初始版本"\`（哈希 cd5d5bf）；
3. **模拟器中提交会清空暂存区**：先 \`git add app.js\` 把暂存区恢复到与仓库一致（真实 Git 中提交后暂存区本就与 HEAD 同步）；
4. \`echo "v2" > app.js\` 覆盖为 v2（未 add）；
5. \`git diff\` —— 应显示 \`修改：app.js\`（暂存区 v1 → 工作区 v2）；
6. \`git add app.js\` 后再 \`git diff\` —— 应显示 \`无差异\`（改动已进暂存区）；
7. \`git diff --staged\` —— 此时能看到 \`修改：app.js\`（仓库 v1 → 暂存区 v2）；
8. \`git commit -m "fix: 更新到 v2"\`（哈希 19b121e），最后 \`git status\` 应为工作区干净。`,
  starter: `# 第 1 关：git diff 看改动
# 三层模型：仓库(v1) / 暂存区 / 工作区(v2)

# TODO 1: 初始化仓库

# TODO 2: 创建 app.js 内容 v1，add 后提交"feat: 初始版本"

# TODO 3: 提交后把 app.js 重新 add（模拟器中提交会清空暂存区）

# TODO 4: 覆盖 app.js 内容为 v2（不 add）

# TODO 5: git diff —— 应显示"修改：app.js"

# TODO 6: add 后再看 git diff —— 应显示"无差异"

# TODO 7: git diff --staged —— 应显示"修改：app.js"

# TODO 8: 提交"fix: 更新到 v2"，最后 git status`,
  solution: L1_SCRIPT,
  hints: [
    'diff 默认对比「暂存区 vs 工作区」：覆盖成 v2 后直接 git diff，暂存区里还是 v1，所以显示 修改：app.js。',
    'add 之后工作区与暂存区一致 → git diff 显示 无差异；要用 git diff --staged 对比「仓库 vs 暂存区」才能看到 v1→v2 的修改。',
    '完整脚本共 12 行：init / echo v1 / add / commit "feat: 初始版本" / add / echo v2 / git diff / add / git diff / git diff --staged / commit "fix: 更新到 v2" / git status。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'git-tips-2',
  lang: 'git',
  module: 'tips',
  order: 2,
  title: '.gitignore：让 Git 装看不见',
  difficulty: 3,
  xp: 25,
  goals: [
    '会用 .gitignore 声明「哪些文件不归 Git 管」',
    '观察 git status：被忽略的文件不再出现在未跟踪列表',
    '理解日志 / 依赖 / 构建产物为什么应该被忽略',
  ],
  brief: `## .gitignore：仓库的门禁名单

日志、临时文件、依赖包、构建产物——这些不该进版本库。\.gitignore\` 文件逐行列出要忽略的模式：\`*.log\` 表示所有以 .log 结尾的文件。

被忽略的文件在 \`git status\` 的未跟踪列表里**不再出现**，\`git add .\` 也不会把它加进暂存区——Git 对它"装看不见"。而 .gitignore 自己**必须提交**：名单要进仓库，全团队才共享同一份门禁。

类比：**门禁名单** —— 保安（Git）看到名单上的访客直接放行、不登记；名单本身要贴在门上（提交进仓库），换班保安才照样认识。

> 💡 约定：.gitignore 放在仓库根目录，第一个提交就带上它，免得日志、密钥被不小心提交进历史再也删不干净。`,
  task: `## 任务：给仓库立一份门禁名单

1. \`git init\`；
2. \`echo "*.log" > .gitignore\` —— 忽略所有 .log 文件；
3. \`echo "调试输出" > debug.log\`、\`echo "正式代码" > app.js\` —— 一个日志文件、一个代码文件；
4. \`git status\` —— 未跟踪应只有 **.gitignore 和 app.js**，debug.log 被忽略不见了；
5. \`git add .\` → \`git status\` —— 暂存两件：.gitignore 与 app.js（debug.log 依然进不来）；
6. \`git commit -m "chore: 添加 .gitignore 与首版代码"\`（哈希 b2fb2af）；
7. \`git status\` —— 工作区干净；
8. \`echo "运行日志" > run.log\` 后再 \`git status\` —— 依旧工作区干净：新建的日志同样被忽略。`,
  starter: `# 第 2 关：.gitignore 门禁名单

# TODO 1: 初始化仓库

# TODO 2: 用 echo 创建 .gitignore，内容为 *.log

# TODO 3: 创建 debug.log（内容"调试输出"）与 app.js（内容"正式代码"）

# TODO 4: git status —— 未跟踪应只有 .gitignore 和 app.js

# TODO 5: git add . 后再看 status —— 暂存里应没有 debug.log

# TODO 6: 提交"chore: 添加 .gitignore 与首版代码"

# TODO 7: 再建 run.log（内容"运行日志"），观察 status 是否依旧干净`,
  solution: L2_SCRIPT,
  hints: [
    '.gitignore 本身也是普通文件：echo "*.log" > .gitignore，它会出现在未跟踪列表里。',
    '匹配规则：*.log 匹配所有以 .log 结尾的文件名 —— debug.log 被忽略，未跟踪列表只剩 .gitignore 和 app.js（注意顺序）。',
    'git add . 会自动跳过被忽略的文件；最后新建 run.log 后 status 仍输出 工作区干净。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'git-tips-3',
  lang: 'git',
  module: 'tips',
  order: 3,
  title: 'git stash：改到一半，先存一手',
  difficulty: 3,
  xp: 25,
  goals: [
    '掌握 git stash：把未提交的改动收起来，工作区瞬间干净',
    '掌握 git stash pop：把收起来的改动原样取回',
    '理解典型场景：改到一半被叫去修紧急 bug',
  ],
  brief: `## git stash：口袋与桌面

正改着 app.js，突然被叫去修紧急 bug —— 改到一半的代码既不能提交（没写完），也不能丢。\`git stash\` 把未提交的改动**打包收进口袋**，工作区瞬间回到干净的已提交状态；干完急事，\`git stash pop\` 把改动**原样倒回工作区**，接着写。

没改动时 stash 会提醒"没有本地改动需要储藏"；口袋空了再 pop 则提示"没有可恢复的 stash"。

类比：**收拾桌面** —— 领导突然来检查（修 bug），把摊开的书塞进抽屉（stash），桌面立刻干净；检查完拉开抽屉（pop），从看到一半那页继续。

> 💡 stash 不是提交，历史里不会有记录；pop 取回后改动仍是未提交状态，该 add 还得 add。`,
  task: `## 任务：改到一半，被叫去修 bug

1. \`git init\` → \`echo "v1" > app.js\` → \`git add app.js\` → \`git commit -m "feat: 功能 v1"\`（哈希 5a41bed）；
2. \`echo "v2" > app.js\` 覆盖为 v2（改到一半，未提交）；
3. \`git status\` —— 应显示 \`改动: app.js\`；
4. \`git stash\` —— 输出 \`已保存到 stash@{0}\`；
5. \`git status\` —— 应恢复 \`工作区干净\`（现在可以安心去修紧急 bug 了）；
6. \`git stash pop\` —— 输出 \`恢复了 stash@{0}\`；
7. \`git status\` —— \`改动: app.js\` 回来了；
8. 再 \`git stash pop\` 一次 —— 口袋空了，输出 \`没有可恢复的 stash\`。`,
  starter: `# 第 3 关：stash 临时存一手
# 场景：改到一半被叫去修紧急 bug

# TODO 1: 初始化仓库，创建 app.js 内容 v1，add 后提交"feat: 功能 v1"

# TODO 2: 覆盖 app.js 为 v2（改到一半，先别提交）

# TODO 3: git status 确认有改动

# TODO 4: git stash 收起改动

# TODO 5: git status 确认工作区干净

# TODO 6: git stash pop 取回改动，再看 status

# TODO 7: 再 pop 一次，观察空 stash 的输出`,
  solution: L3_SCRIPT,
  hints: [
    'stash 的前提是"有改动"：status 显示 改动: app.js 之后再 stash，输出 已保存到 stash@{0}。',
    'stash 后工作区回到最近一次提交的状态（v1），status 显示 工作区干净；pop 之后 v2 的改动回到工作区。',
    '完整流程 11 行：init / echo v1 / add / commit / echo v2 / status / stash / status / stash pop / status / stash pop，最后一行输出 没有可恢复的 stash。',
  ],
  tests: tests(L3_EXPECTED),
};

const L4: Level = {
  id: 'git-tips-4',
  lang: 'git',
  module: 'tips',
  order: 4,
  title: 'diff 的三种对比：三层模型',
  difficulty: 4,
  xp: 30,
  goals: [
    '理解仓库 / 暂存区 / 工作区三层模型：同一文件可在三层各有一个版本',
    '同一时刻 git diff 与 git diff --staged 输出不同，并说清各自在比什么',
    '理解 commit 打包的是暂存区内容，工作区未 add 的改动不会进历史',
  ],
  brief: `## 三层模型：仓库 / 暂存区 / 工作区

同一文件可在三层各有一个版本：**仓库** v1、**暂存区** v2（add 过）、**工作区** v3（又改了没 add）。此刻两条 diff 输出不同：

- \`git diff\`：暂存区→工作区，看到 v2→v3 和没 add 的 config.js；
- \`git diff --staged\`：仓库→暂存区：v1→v2；

\`git commit\` 只打包**暂存区**：未 add 的 v3 不进历史，提交后 status 仍报"改动"。

类比：**三层书架** —— 书柜是仓库、桌面是暂存区、手里是工作区；commit 只收桌面。

> 💡 提交后 status 仍有"改动"？那是没 add 的部分，commit 只打包暂存区。`,
  task: `## 任务：让 app.js 在三层"分身"

1. \`git init\`；
2. \`echo "v1" > app.js\`、\`echo "1.0" > config.js\` → \`git add .\` → \`git commit -m "feat: v1 基线"\`（哈希 bf89d39）；
3. \`git add .\` 把仓库内容同步回暂存区（提交会清空暂存区）；
4. \`echo "v2" > app.js\` → \`git add app.js\` —— app.js 在暂存区升级为 v2；
5. \`echo "v3" > app.js\`、\`echo "2.0" > config.js\` —— 工作区继续改，都不 add；
6. \`git diff\` —— 应显示两行：\`修改：app.js\`、\`修改：config.js\`（暂存区 → 工作区）；
7. \`git diff --staged\` —— 只有一行：\`修改：app.js\`（仓库 v1 → 暂存区 v2，config.js 在这一层没变）；
8. \`git status\` —— app.js 同时出现在"暂存"与"改动"两行：它在三层各有一个版本；
9. \`git commit -m "feat: v2 上线"\`（哈希 d168c00）—— 注意进历史的是暂存区的 v2，不是工作区的 v3；
10. \`git status\` —— 仍显示 \`改动: app.js, config.js\`（工作区的 v3 没 add，不会进提交）。`,
  starter: `# 第 4 关：diff 的三种对比
# 目标：同一时刻，git diff 与 git diff --staged 输出不同

# TODO 1: 初始化仓库

# TODO 2: 创建 app.js 内容 v1 与 config.js 内容 1.0，add . 后提交"feat: v1 基线"

# TODO 3: 再 git add .（提交会清空暂存区，先同步回来）

# TODO 4: 覆盖 app.js 为 v2 并 add；随后再覆盖为 v3（不 add）

# TODO 5: 覆盖 config.js 为 2.0（不 add）

# TODO 6: git diff 与 git diff --staged —— 观察两份输出的差别

# TODO 7: git status —— app.js 应同时出现在"暂存"和"改动"两行

# TODO 8: 提交"feat: v2 上线"，再看 status —— 工作区改动还在`,
  solution: L4_SCRIPT,
  hints: [
    '三条命令各管一层：git diff 看 暂存区→工作区，git diff --staged 看 仓库→暂存区，status 一屏看全三层。',
    '关键顺序：v2 要 add 进暂存区、v3 留在工作区不 add，config.js 只改工作区 —— 这样 git diff 出两行，--staged 只出 app.js 一行。',
    '最后的 commit 只打包暂存区（app.js v2 + config.js 1.0），所以提交后 status 仍显示 改动: app.js, config.js。',
  ],
  tests: tests(L4_EXPECTED),
};

export const GIT_TIPS: Level[] = [L1, L2, L3, L4];
