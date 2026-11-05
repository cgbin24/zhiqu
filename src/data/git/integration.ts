import type { Level } from '@/types';

/**
 * Git 实战课程 · 第六章：综合实战（integration，3 关）
 *
 * 提交「一段 git 命令脚本」，由本地仓库模拟器（src/judge/git-sim.ts）执行，
 * stdout 与 expected 逐字符比对。提交哈希完全确定（seq+msg+parent 的 fnv1a）。
 * 章节文件自包含（与 verify-levels.mjs 的 Node 直跑兼容）。
 */

const L1_SCRIPT = `git init
echo "搜索页骨架" > app.js
git add app.js
git commit -m "feat: 搜索页骨架"
git switch -c feat/search
echo "搜索分词器" > tokenizer.js
git add tokenizer.js
git commit -m "feat: 搜索分词器"
echo "结果高亮" > highlight.js
git add highlight.js
git commit -m "feat: 结果高亮"
git switch main
git merge feat/search
git tag v1.1
git remote add origin https://github.com/you/demo.git
git remote -v
git push -u origin main
git log --oneline`;

const L1_EXPECTED = `已初始化空 Git 仓库（.git/）
[main 244e58a] feat: 搜索页骨架
切换到新分支 'feat/search'
[feat/search e57eacd] feat: 搜索分词器
[feat/search 709ea3f] feat: 结果高亮
切换到分支 'main'
正在快进 main 至 feat/search
Fast-forward
origin https://github.com/you/demo.git
已推送 main -> origin/main（已建立跟踪）
709ea3f feat: 结果高亮
e57eacd feat: 搜索分词器
244e58a feat: 搜索页骨架`;

const L2_SCRIPT = `git init
echo "项目骨架" > app.js
git add app.js
git commit -m "feat: 项目骨架"
git branch feat/a
git branch feat/b
git switch feat/a
echo "搜索功能" > search.js
git add search.js
git commit -m "feat: 搜索功能"
git switch feat/b
echo "账单功能" > billing.js
git add billing.js
git commit -m "feat: 账单功能"
git switch main
git merge feat/a
git merge feat/b
git log --oneline
git branch`;

const L2_EXPECTED = `已初始化空 Git 仓库（.git/）
[main 3dba615] feat: 项目骨架
切换到分支 'feat/a'
[feat/a d2ded25] feat: 搜索功能
切换到分支 'feat/b'
[feat/b 24ca8cd] feat: 账单功能
切换到分支 'main'
正在快进 main 至 feat/a
Fast-forward
[main 16cc08a] Merge branch 'feat/b'
16cc08a Merge branch 'feat/b'
d2ded25 feat: 搜索功能
3dba615 feat: 项目骨架
* main
  feat/a
  feat/b`;

const L3_SCRIPT = `git init
echo "应用骨架" > app.js
git add .
git commit -m "feat: v0.1 应用骨架"
echo "搜索功能" > search.js
git add .
git commit -m "feat: v0.2 搜索功能"
echo "账单功能" > billing.js
git add .
git commit -m "feat: v0.3 账单功能"
git tag v1.0
git switch -c hotfix/readme
echo "修正后的产品介绍" > readme.txt
git add .
git commit -m "fix: 修正产品介绍"
git switch main
git merge hotfix/readme
git tag v1.1
git tag
git remote add origin https://github.com/you/app.git
git remote -v
git push -u origin main
git log --oneline`;

const L3_EXPECTED = `已初始化空 Git 仓库（.git/）
[main 82cfe98] feat: v0.1 应用骨架
[main aa5a70b] feat: v0.2 搜索功能
[main f40d244] feat: v0.3 账单功能
切换到新分支 'hotfix/readme'
[hotfix/readme 95ab834] fix: 修正产品介绍
切换到分支 'main'
正在快进 main 至 hotfix/readme
Fast-forward
v1.0
v1.1
origin https://github.com/you/app.git
已推送 main -> origin/main（已建立跟踪）
95ab834 fix: 修正产品介绍
f40d244 feat: v0.3 账单功能
aa5a70b feat: v0.2 搜索功能
82cfe98 feat: v0.1 应用骨架`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'git-integration-1',
  lang: 'git',
  module: 'integration',
  order: 1,
  title: '完整 feature 工作流：一条龙演练',
  difficulty: 4,
  xp: 35,
  goals: [
    '把分支、切换、合并、标签、远程串成一条完整的特性分支工作流',
    '体验"在分支上开发、回主线合并"的标准节奏',
    '掌握首次推送 git push -u origin main 的完整流程',
  ],
  brief: `## 一条龙：从想法到上线

前面几章的零件——分支、切换、合并、标签、远程——现在拼成一条完整流水线。业界最常用的叫**特性分支工作流**：想加一个功能，就从最新主线切出一条 feat/xxx 分支，在上面安心开发、小步提交；功能完成后切回 main，把分支合并回去；重要版本打上标签；最后推送到远程仓库，既备份又共享。

这样做的价值：main 永远保持可用状态，实验性的代码被隔离在分支里，直到合并那一刻才汇入主线。

类比：**新菜研发**——正式菜单（main）绝不动摇，试做厨房（分支）里反复调味，定型后才端上正餐菜单，并在菜单角上贴一张"v1.1 新品上市"的标签。

> 💡 分支命名带前缀：feat/xxx 加功能、fix/xxx 修 bug，团队一眼看懂每条分支的使命。`,
  task: `## 任务：完整 feature 工作流一条龙

在模拟器中依次执行（每行一条命令）：

1. \`git init\` 初始化仓库；
2. \`echo "搜索页骨架" > app.js\` → \`git add app.js\` → \`git commit -m "feat: 搜索页骨架"\`；
3. \`git switch -c feat/search\` 新建并切换到特性分支；
4. \`echo "搜索分词器" > tokenizer.js\` → add → \`git commit -m "feat: 搜索分词器"\`；
5. \`echo "结果高亮" > highlight.js\` → add → \`git commit -m "feat: 结果高亮"\`；
6. \`git switch main\` 回到主线；
7. \`git merge feat/search\` —— 观察快进输出的两行；
8. \`git tag v1.1\` 给新版本打标签；
9. \`git remote add origin https://github.com/you/demo.git\` → \`git remote -v\` 确认配置；
10. \`git push -u origin main\` 首次推送（注意输出后缀）；
11. \`git log --oneline\` 验证主线已包含全部三个提交。

哈希是完全确定的：搜索页骨架 244e58a、搜索分词器 e57eacd、结果高亮 709ea3f。`,
  starter: `# 第 1 关：完整 feature 工作流
# 哈希：244e58a（搜索页骨架）/ e57eacd（搜索分词器）/ 709ea3f（结果高亮）

# TODO 1: 初始化仓库

# TODO 2: 在 main 上创建 app.js（内容：搜索页骨架）并提交"feat: 搜索页骨架"

# TODO 3: git switch -c feat/search 新建并切换到特性分支

# TODO 4: 在分支上提交两次：搜索分词器（tokenizer.js）、结果高亮（highlight.js）

# TODO 5: 切回 main，合并 feat/search（观察快进输出的两行）

# TODO 6: 打标签 v1.1

# TODO 7: 配置远程 origin 并 git push -u origin main（注意输出后缀）

# TODO 8: git log --oneline 验证主线历史`,
  solution: L1_SCRIPT,
  hints: [
    '流程骨架：init → main 提交 → switch -c feat/search → 分支上两次提交 → switch main → merge → tag v1.1 → remote add → push -u → log --oneline。',
    'main 在分支开发期间没有自己的新提交，所以 merge 是快进，输出两行：正在快进 main 至 feat/search / Fast-forward；push -u 的输出以（已建立跟踪）结尾。',
    '哈希依次为 244e58a / e57eacd / 709ea3f；merge、tag、remote add 这三步本身不产生输出，别在中间多等一行。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'git-integration-2',
  lang: 'git',
  module: 'integration',
  order: 2,
  title: '多分支并行开发：依次合入主线',
  difficulty: 4,
  xp: 35,
  goals: [
    '模拟两条特性分支从同一基线并行开发、互不干扰',
    '观察两次合并的差异：第一次快进、第二次产生合并提交',
    '理解合并顺序对快进/真合并的影响',
  ],
  brief: `## 并行开发：多条分支各自前进

真实项目里从来不止一条分支：A 在做搜索、B 在做账单，互不干扰。两条分支从同一个基线切出、各自提交、各自前进，这就是**并行开发**。

合并回主线时顺序有讲究。本关 main 在分支开发期间没有新提交：第一次合并 feat/a 是**快进**——指针直接拨到分支最新提交即可；轮到 feat/b 时，它与 main 的历史已经分叉，Git 会生成一个**合并提交**，把两条历史拧成一股。

类比：**溪流汇入干流**——第一条溪汇入时干流还没变，河道直接向前延伸（快进）；第二条溪汇入时干流已经改道，交汇处形成一个明显的"汇合点"（合并提交）。

> 💡 合并提交有两个父提交，它记录了"谁和谁在此合流"，是团队协作留在历史里的脚印。`,
  task: `## 任务：多分支并行开发

1. \`git init\`；
2. \`echo "项目骨架" > app.js\` → \`git add app.js\` → \`git commit -m "feat: 项目骨架"\`；
3. \`git branch feat/a\` 与 \`git branch feat/b\` —— 两条分支都从当前基线切出（这一步无输出）；
4. \`git switch feat/a\` → \`echo "搜索功能" > search.js\` → add → \`git commit -m "feat: 搜索功能"\`；
5. \`git switch feat/b\` → \`echo "账单功能" > billing.js\` → add → \`git commit -m "feat: 账单功能"\`；
6. \`git switch main\`；
7. \`git merge feat/a\` —— 第一次合并，注意观察输出；
8. \`git merge feat/b\` —— 第二次合并，此时历史已分叉，观察出现的合并提交；
9. \`git log --oneline\` 查看合并后的历史；
10. \`git branch\` 确认三条分支俱在。

哈希是完全确定的：项目骨架 3dba615、搜索功能 d2ded25、账单功能 24ca8cd、合并提交 16cc08a。`,
  starter: `# 第 2 关：多分支并行开发
# 哈希：3dba615（项目骨架）/ d2ded25（搜索功能）/ 24ca8cd（账单功能）/ 16cc08a（合并提交）

# TODO 1: 初始化仓库并在 main 上提交"feat: 项目骨架"（app.js）

# TODO 2: git branch feat/a 与 git branch feat/b，切出两条分支

# TODO 3: 切到 feat/a 提交"feat: 搜索功能"（search.js）

# TODO 4: 切到 feat/b 提交"feat: 账单功能"（billing.js）

# TODO 5: 切回 main，先合并 feat/a，再合并 feat/b（注意两次输出不同）

# TODO 6: git log --oneline 与 git branch 验证`,
  solution: L2_SCRIPT,
  hints: [
    '先 git branch feat/a、git branch feat/b 切出两条分支（无输出），再分别 switch 过去提交；合并前记得先 switch main。',
    '第一次 merge feat/a 是快进（正在快进 + Fast-forward 两行）；第二次 merge feat/b 时两条历史已分叉，输出合并提交 [main 16cc08a] Merge branch \'feat/b\'。',
    'log --oneline 从新到旧：16cc08a 合并提交 → d2ded25 搜索功能 → 3dba615 项目骨架（账单功能经合并提交的第二父链汇入，不在这份输出里单独出现）；git branch 为 * main / feat/a / feat/b。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'git-integration-3',
  lang: 'git',
  module: 'integration',
  order: 3,
  title: '毕业项目：一次真实的版本发布',
  difficulty: 5,
  xp: 45,
  goals: [
    '完整走通 init → 开发 → 标签 → 热修分支 → 合并 → 推送的生命周期',
    '理解 v1.0 / v1.1 版本号与标签在发布流程中的角色',
    '综合运用全课程命令，形成可迁移的版本管理肌肉记忆',
  ],
  brief: `## 从零复盘：一次真实的版本发布

毕业关：把整门课的命令串成一次真实发布。

初始化后小步提交三个功能（v0.1 → v0.2 → v0.3），时机成熟打上 v1.0 标签——标签是不动的里程碑，让版本永远可回溯；线上出问题，切出 hotfix/readme 分支修复、合并回 main，打 v1.1；最后配置远程仓库并推送发布。

走完这份全课程最长的脚本，一次微型的版本生命周期就闭环了：开发 → 小步提交 → 打标签 → 热修 → 合并 → 发布。

类比：**软件发布日**——功能冻结打上 v1.0，紧急修复走 hotfix 分支，补丁升级 v1.1，最后 push 上架。

> 💡 实际工作中 hotfix 分支总是从"出问题的那个版本"切出，修完立即合并回主线并递增补丁号。`,
  task: `## 任务：从零复盘一次版本发布

完整脚本（每行一条命令）：

1. \`git init\`；
2. \`echo "应用骨架" > app.js\` → \`git add .\` → \`git commit -m "feat: v0.1 应用骨架"\`；
3. \`echo "搜索功能" > search.js\` → \`git add .\` → \`git commit -m "feat: v0.2 搜索功能"\`；
4. \`echo "账单功能" > billing.js\` → \`git add .\` → \`git commit -m "feat: v0.3 账单功能"\`；
5. \`git tag v1.0\` —— 功能冻结，正式里程碑；
6. \`git switch -c hotfix/readme\` → \`echo "修正后的产品介绍" > readme.txt\` → \`git add .\` → \`git commit -m "fix: 修正产品介绍"\`；
7. \`git switch main\` → \`git merge hotfix/readme\` —— 修复合入主线；
8. \`git tag v1.1\` → \`git tag\`（应按创建顺序列出 v1.0、v1.1）；
9. \`git remote add origin https://github.com/you/app.git\` → \`git remote -v\`；
10. \`git push -u origin main\`；
11. \`git log --oneline\` —— 查看完整发布历史（4 条提交，从新到旧）。

哈希是完全确定的：v0.1 应用骨架 82cfe98、v0.2 搜索功能 aa5a70b、v0.3 账单功能 f40d244、修正产品介绍 95ab834。`,
  starter: `# 第 3 关（毕业关）：一次真实的版本发布
# 哈希：82cfe98（v0.1 应用骨架）/ aa5a70b（v0.2 搜索功能）/ f40d244（v0.3 账单功能）/ 95ab834（fix 修正产品介绍）

# TODO 1: 初始化仓库

# TODO 2: 三次小步提交（都用 git add .）：
#   app.js     -> "feat: v0.1 应用骨架"
#   search.js  -> "feat: v0.2 搜索功能"
#   billing.js -> "feat: v0.3 账单功能"

# TODO 3: 打标签 v1.0

# TODO 4: git switch -c hotfix/readme，创建 readme.txt 并提交"fix: 修正产品介绍"

# TODO 5: 切回 main，合并 hotfix/readme，打标签 v1.1，git tag 验证

# TODO 6: 配置远程 origin，git push -u origin main，最后 git log --oneline`,
  solution: L3_SCRIPT,
  hints: [
    '整个流程：三轮"echo → git add . → commit"（v0.1/v0.2/v0.3）→ tag v1.0 → switch -c hotfix/readme → 修复提交 → switch main → merge → tag v1.1 → remote add → push -u → log --oneline。',
    'git add . 一次暂存工作区全部文件；合并 hotfix/readme 仍是快进（main 在分支开发期间没有新提交），输出正在快进 + Fast-forward 两行。',
    'git tag 按创建顺序列出 v1.0、v1.1；log --oneline 四行从新到旧：95ab834 fix → f40d244 v0.3 → aa5a70b v0.2 → 82cfe98 v0.1。',
  ],
  tests: tests(L3_EXPECTED),
};

export const GIT_INTEGRATION: Level[] = [L1, L2, L3];
