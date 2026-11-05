import type { Level } from '@/types';

/**
 * Git 实战课程 · 第五章：团队协作规范（best，3 关）
 *
 * 提交「一段 git 命令脚本」，由本地仓库模拟器（src/judge/git-sim.ts）执行，
 * stdout 与 expected 逐字符比对。提交哈希完全确定（seq+msg+parent 的 fnv1a）。
 * 章节文件自包含（与 verify-levels.mjs 的 Node 直跑兼容）。
 */

const L1_SCRIPT = `git init
echo "登录页第一版" > login.js
git add login.js
git commit -m "feat: 新增用户登录页"
echo "登录页第二版" > login.js
git add login.js
git commit -m "fix: 修复登录按钮无响应的问题"
echo "# 登录模块文档" > login.md
git add login.md
git commit -m "docs: 补充登录接口说明"
git log --oneline`;

const L1_EXPECTED = `已初始化空 Git 仓库（.git/）
[main f73710c] feat: 新增用户登录页
[main 366fe85] fix: 修复登录按钮无响应的问题
[main e476526] docs: 补充登录接口说明
e476526 docs: 补充登录接口说明
366fe85 fix: 修复登录按钮无响应的问题
f73710c feat: 新增用户登录页`;

const L2_SCRIPT = `git init
echo "v1" > app.js
git add app.js
git commit -m "feat: 初始版本"
echo "v2" > app.js
git add app.js
git commit -m "fix: 修正按钮颜色"
git remote add origin https://github.com/you/repo.git
git remote -v
git push -u origin main
echo "v3" > app.js
git add app.js
git commit -m "docs: 更新使用说明"
git push`;

const L2_EXPECTED = `已初始化空 Git 仓库（.git/）
[main cd5d5bf] feat: 初始版本
[main a144310] fix: 修正按钮颜色
origin https://github.com/you/repo.git
已推送 main -> origin/main（已建立跟踪）
[main 2ad18b6] docs: 更新使用说明
已推送 main -> origin/main`;

const L3_SCRIPT = `git init
echo "项目首页" > index.html
git add index.html
git commit -m "feat: 项目初始化"
git remote add origin https://github.com/you/repo.git
git push -u origin main
git pull
git status
echo "联系页" > contact.html
git add contact.html
git commit -m "feat: 新增联系页面"
git push
git pull
git log --oneline`;

const L3_EXPECTED = `已初始化空 Git 仓库（.git/）
[main 7876a3f] feat: 项目初始化
已推送 main -> origin/main（已建立跟踪）
已是最新
[main]
工作区干净
[main 96239ee] feat: 新增联系页面
已推送 main -> origin/main
已是最新
96239ee feat: 新增联系页面
7876a3f feat: 项目初始化`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'git-best-1',
  lang: 'git',
  module: 'best',
  order: 1,
  title: '提交信息的艺术：log 读起来像 changelog',
  difficulty: 3,
  xp: 25,
  goals: [
    '掌握 Conventional Commits 规范：feat: / fix: / docs: 前缀',
    '理解提交信息是写给未来读者（自己与同事）的说明书',
    '体验规范信息让 git log --oneline 读起来像一份 changelog',
  ],
  brief: `## 提交信息：写给三个月后的自己

\`git log\` 就是项目的更新日志（changelog），提交信息是每一条的标题。坏信息如"更新一下"，三个月后连自己都看不懂；好信息说清**做了什么、为什么改**。

业界通行 Conventional Commits 规范：\`<类型>: <内容>\`——feat: 新功能 / fix: 修 bug / docs: 文档。照此提交，\`git log --oneline\` 天然就是一份可读的 changelog，同事扫一眼就知道每条提交的意图。

类比：**航班信息牌**——每条提交是一班飞机，信息写得规范，接机的同事一眼就知道这班带来了什么。

> 💡 读者思维：将来读历史的不只是你，还有接手的同事。说清"为什么改"，比"改了什么"更值钱。`,
  task: `## 任务：三条规范提交，一份 changelog

在模拟器中依次执行：

1. \`git init\` 初始化仓库；
2. \`echo "登录页第一版" > login.js\` → \`git add login.js\` → \`git commit -m "feat: 新增用户登录页"\`；
3. \`echo "登录页第二版" > login.js\`（覆盖同一文件，模拟修 bug）→ \`git add login.js\` → \`git commit -m "fix: 修复登录按钮无响应的问题"\`；
4. \`echo "# 登录模块文档" > login.md\` → \`git add login.md\` → \`git commit -m "docs: 补充登录接口说明"\`；
5. \`git log --oneline\` —— 三条记录从新到旧，读起来应像一份更新日志。

哈希由模拟器确定：feat 为 f73710c，fix 为 366fe85，docs 为 e476526。`,
  starter: `# 第 1 关：提交信息的艺术
# 三个哈希：f73710c / 366fe85 / e476526

# TODO 1: 初始化仓库

# TODO 2: 三轮"创建/覆盖文件 → add → commit"，信息用规范前缀
#   login.js → feat: 新增用户登录页
#   login.js → fix: 修复登录按钮无响应的问题
#   login.md → docs: 补充登录接口说明

# TODO 3: git log --oneline 验证这份"changelog"`,
  solution: L1_SCRIPT,
  hints: [
    '三轮提交套路完全一样：echo 创建/覆盖文件、git add 文件名、git commit -m "信息"。',
    '前缀决定类型：新功能用 feat:、修 bug 用 fix:、文档用 docs:，注意冒号后有一个空格。',
    'log --oneline 从新到旧：e476526 docs、366fe85 fix、f73710c feat——顺序反了说明提交顺序有误。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'git-best-2',
  lang: 'git',
  module: 'best',
  order: 2,
  title: '远程仓库与推送：把代码放上云端',
  difficulty: 3,
  xp: 25,
  goals: [
    '掌握 git remote add origin：给仓库登记远程地址',
    '掌握 git push -u origin main：首次推送并建立跟踪',
    '对比 -u 与裸 push 的输出差别，理解跟踪的作用',
  ],
  brief: `## 远程仓库：把代码放上云端

本地仓库只活在你电脑里——硬盘一坏，历史全没。**远程仓库**（GitHub 上的那份）是团队共享的"云端存档"。

协作三板斧：\`git remote add origin <url>\` 登记远程地址（每个仓库一次即可）；\`git push -u origin main\` 首次推送并用 -u 建立跟踪；之后每次收工，\`git push\` 两个词就把新提交同步上云。

类比：**网盘同步**——本地是硬盘里的文件夹，push 是点"上传"；-u 相当于勾选"记住这对文件夹"，以后一键同步。

> 💡 首推带 -u，之后裸 push：\`git push -u origin main\` 只需一次，从此每天收尾都是最短的 \`git push\`。`,
  task: `## 任务：登记远程并完成两次推送

1. \`git init\`；
2. \`echo "v1" > app.js\` → \`git add app.js\` → \`git commit -m "feat: 初始版本"\`；
3. \`echo "v2" > app.js\` → \`git add app.js\` → \`git commit -m "fix: 修正按钮颜色"\`；
4. \`git remote add origin https://github.com/you/repo.git\` —— 登记远程（无输出）；
5. \`git remote -v\` —— 应输出 \`origin https://github.com/you/repo.git\`；
6. \`git push -u origin main\` —— 首次推送，输出带"（已建立跟踪）"；
7. \`echo "v3" > app.js\` → \`git add app.js\` → \`git commit -m "docs: 更新使用说明"\`；
8. \`git push\` —— 再次推送，对比这次输出少了什么。

哈希依次为 cd5d5bf / a144310 / 2ad18b6。`,
  starter: `# 第 2 关：远程仓库与推送
# 三个哈希：cd5d5bf / a144310 / 2ad18b6

# TODO 1: 初始化仓库，完成两次提交（feat: 初始版本 / fix: 修正按钮颜色）

# TODO 2: 登记远程仓库 origin 为 https://github.com/you/repo.git

# TODO 3: 用 git remote -v 确认登记结果

# TODO 4: 首次推送 main（带 -u 建立跟踪）

# TODO 5: 再提交一次（docs: 更新使用说明），然后不带 -u 直接 git push`,
  solution: L2_SCRIPT,
  hints: [
    '先完成两次提交（哈希 cd5d5bf、a144310），再执行 git remote add origin https://github.com/you/repo.git。',
    '首次推送命令是 git push -u origin main，输出为"已推送 main -> origin/main（已建立跟踪）"。',
    '第三次提交（哈希 2ad18b6）之后直接 git push——输出里不再有"（已建立跟踪）"。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'git-best-3',
  lang: 'git',
  module: 'best',
  order: 3,
  title: 'pull：先同步再干活',
  difficulty: 4,
  xp: 30,
  goals: [
    '掌握 git pull 的时机：每天开工第一件事',
    '学会判读 pull 的输出："已是最新"意味着可以放心开工',
    '养成 pull → 干活 → commit → push 的每日循环',
  ],
  brief: `## pull：开工前的第一句话

团队协作时，远程仓库可能在你睡觉时被同事更新了。**开工前先 \`git pull\`**，把云端最新进度拉到本地再动手——否则你会在旧版本上叠新代码，回头合并一团乱麻。

输出判读：\`已是最新\`——远程没有新东西，放心开工；\`已更新 <分支>（快进至 origin/<分支>）\`——拉到了同事的提交。本模拟器中远程只被你的 push 更新，所以 push 之后 pull 恒为"已是最新"，但仪式照做：先拉取、再确认、后干活。

类比：**开会前先看群公告**——先同步大家已经定下的事再发言，避免白说一通。

> 💡 每天开工第一件事 \`git pull\`，收工最后一件事 \`git push\`。一拉一推，团队永远在同一页上。`,
  task: `## 任务：把 pull 变成开工仪式

1. \`git init\`；
2. \`echo "项目首页" > index.html\` → \`git add index.html\` → \`git commit -m "feat: 项目初始化"\`；
3. \`git remote add origin https://github.com/you/repo.git\` → \`git push -u origin main\`；
4. \`git pull\` —— 输出"已是最新"（模拟器中远程刚被你的 push 同步过）；
5. \`git status\` —— 工作区干净，放心开工；
6. \`echo "联系页" > contact.html\` → \`git add contact.html\` → \`git commit -m "feat: 新增联系页面"\`；
7. \`git push\` —— 收工推送；
8. \`git pull\` —— 仍是"已是最新"；
9. \`git log --oneline\` —— 两条提交，从新到旧。

哈希：项目初始化为 7876a3f，新增联系页面为 96239ee。`,
  starter: `# 第 3 关：pull：先同步再干活
# 两个哈希：7876a3f / 96239ee

# TODO 1: 初始化仓库并提交"feat: 项目初始化"

# TODO 2: 登记远程 origin，并用 -u 推送 main

# TODO 3: 开工仪式 —— git pull，应看到"已是最新"

# TODO 4: 再提交一次（feat: 新增联系页面），收工 push

# TODO 5: 最后再 pull 一次，并用 log --oneline 查看历史`,
  solution: L3_SCRIPT,
  hints: [
    '开头四步：init → echo 创建 index.html → add → commit "feat: 项目初始化"（哈希 7876a3f）。',
    '登记远程后先 push -u origin main 再 git pull——模拟器中远程由 push 同步，pull 应输出"已是最新"。',
    '若 pull 显示"pull 产生分歧"，说明本地有提交还没 push——先 git push 再 pull；结尾 log 应为 96239ee、7876a3f 两条。',
  ],
  tests: tests(L3_EXPECTED),
};

export const GIT_BEST: Level[] = [L1, L2, L3];
