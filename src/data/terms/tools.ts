import type { Term } from './types';

/** tools 领域术语：Git 核心 / GitHub 协作 / 包管理与依赖 / 环境与脚本 / 效率工具 */
export const TOOLS_TOOLS: Term[] = [
  // ==================== Git 核心 ====================
  {
    id: 'tool-git',
    name: 'Git',
    en: 'Git',
    cat: 'tools',
    sub: 'Git 核心',
    tags: ['版本控制', '基础'],
    summary: 'Git 是分布式版本控制系统，记录代码的每次变更，支持多人协作与随时回滚，是现代开发的地基。',
    detail: `**是什么**：Git 是分布式版本控制系统，把每次提交记录为一次不可变的快照；每个开发者本地都持有完整历史，离线也能提交、开分支与回溯。

**典型场景**：个人开发随时存档与回滚、多人并行协作、开源贡献与代码审查，一切以仓库为中心展开。

**核心用法**：\`git init\` 建仓、\`git add\` 暂存、\`git commit\` 提交、\`git status\` 查状态、\`git log\` 看历史、\`git push/pull\` 同步远程。

**技巧与坑**：动手前先敲 \`git status\` 养成习惯；提交要小而完整，一个提交只做一件事；\`.git\` 目录就是整个仓库，切勿手工改动其内部文件。`,
    relations: [
      { to: 'tool-repo-init', desc: 'init 与 clone 是接入 Git 的第一步' },
      { to: 'tool-commit', desc: '提交是最基本的存档动作，构成完整历史' },
      { to: 'tool-branch', desc: '分支让并行开发互不干扰' },
    ],
    example: `# 首次配置（全局，只需一次）
git config --global user.name "zq"
git config --global user.email "zq@example.com"

# 日常三步：改代码 → 暂存 → 提交
git status                    # 随时确认状态
git add src/app.ts            # 暂存指定文件（git add -A 全部）
git commit -m "feat: 新增术语搜索"
git log --oneline -5          # 回看最近 5 条提交`,
    exampleLang: 'bash',
    interview: '高频：Git 与 SVN 的区别（分布式 vs 集中式）；工作区/暂存区/版本库三区模型；merge 与 rebase 的取舍。',
  },
  {
    id: 'tool-repo-init',
    name: '仓库初始化',
    en: 'Repo Init & Clone',
    cat: 'tools',
    sub: 'Git 核心',
    tags: ['版本控制', '仓库'],
    summary: 'git init 把现有目录变成 Git 仓库，git clone 复制远程仓库到本地，是参与任何项目的第一步。',
    detail: `**是什么**：仓库初始化是接入 Git 的第一步：\`git init\` 把现有目录变成仓库（生成 .git），\`git clone\` 把远程仓库连同完整历史复制到本地并配置好 origin。

**典型场景**：新项目起步用 init；加入已有项目、拉取开源代码用 clone。

**核心用法**：\`git init && git remote add origin <url>\` 本地建仓并关联远程；\`git clone <url>\` 直接克隆；\`git clone --depth 1\` 浅克隆只取最近提交，适合 CI 与超大仓库。

**技巧与坑**：init 后先配好 .gitignore 再首次提交，避免把 node_modules、.env 传上去；clone 已含全部历史，切分支 \`git switch\` 即可，无需重新克隆。`,
    relations: [
      { to: 'tool-git', desc: 'init/clone 是所有 Git 操作的起点' },
      { to: 'tool-remote', desc: 'init 后需关联远程才能与团队同步' },
      { to: 'tool-gitignore', desc: '首次提交前先配好忽略规则' },
    ],
    example: `# 方式一：本地已有代码，初始化并关联远程
cd my-project
git init
git remote add origin git@github.com:team/my-project.git
git add . && git commit -m "chore: 初始化仓库"
git push -u origin main

# 方式二：克隆远程仓库（含完整历史）
git clone git@github.com:team/my-project.git
cd my-project && git log --oneline -3

# 超大仓库只想要最新代码：浅克隆
git clone --depth 1 https://github.com/large/repo.git`,
    exampleLang: 'bash',
  },
  {
    id: 'tool-commit',
    name: '提交与提交信息规范',
    en: 'Commit & Commit Message',
    cat: 'tools',
    sub: 'Git 核心',
    tags: ['版本控制', '规范'],
    summary: '提交把暂存区内容固化为一条带说明的历史记录，约定式提交信息让历史可读、可追溯、可自动化。',
    detail: `**是什么**：提交（commit）是 Git 的存档点：把暂存区内容固化为一条带说明的历史记录；提交信息向三个月后的你和队友解释"改了什么、为什么改"。

**典型场景**：完成一个独立小功能或修复后提交；协作时供 review、回滚与追溯，变更日志也按提交自动生成。

**核心用法**：\`git add -p\` 分块暂存，\`git commit -m "feat: 支持导出 CSV"\`；约定式前缀 feat/fix/docs/refactor/test/chore；\`git commit --amend\` 修补最后一次提交。

**技巧与坑**：信息写"做了什么+为什么"，杜绝 "update" 这类废话；未 add 的改动不会进提交；已 push 到公共分支的提交不要 amend。`,
    relations: [
      { to: 'tool-git', desc: 'commit 是 Git 最核心的存档动作' },
      { to: 'tool-log-diff', desc: 'log/diff 是查阅与核对提交历史的眼睛' },
      { to: 'lc-coding-standards', desc: '提交信息规范是编码规范的延伸' },
    ],
    example: `# 约定式提交（Conventional Commits）
git commit -m "feat: 术语详情支持锚点分享"
git commit -m "fix: 修复暗色模式下对比度不足"
git commit -m "docs: 补充 CONTRIBUTING 说明"

# 提交后漏了一个文件，并入同一次提交
git add missed.ts
git commit --amend --no-edit     # 不改说明，只并入内容

# 说明写错了，重写（仅限未 push 的提交）
git commit --amend -m "fix: 修复暗色模式对比度不足"`,
    exampleLang: 'bash',
    interview: '高频：git reset --soft/--mixed/--hard 的区别（分别动 HEAD、暂存区、工作区哪些）；已 push 的提交为什么不能随意 amend。',
  },
  {
    id: 'tool-branch',
    name: '分支',
    en: 'Branch',
    cat: 'tools',
    sub: 'Git 核心',
    tags: ['版本控制', '协作'],
    summary: '分支是指向某个提交的可移动指针，让多条开发线并行互不干扰，是功能开发与团队协作的基本单元。',
    detail: `**是什么**：分支是指向某个提交的可移动指针，从中分出独立的开发线；HEAD 标记你当前站在哪条线上，提交时指针随之前进。

**典型场景**：新功能、Bug 修复各开一条分支，完成后合回主干；配合分支策略（main + feature 分支）组织团队协作。

**核心用法**：\`git switch -c feat/login\` 创建并切换，\`git switch main\` 回主干，\`git branch -d feat/login\` 删除，\`git push -u origin feat/login\` 推送并建立跟踪。

**技巧与坑**：命名带语义：feat/xxx、fix/xxx；分支极轻（只是一个小指针文件），勤开勤删不留"僵尸分支"；切换分支前先 commit 或 stash 未完成的改动。`,
    relations: [
      { to: 'tool-merge', desc: '分支开发完成后经合并汇入主干' },
      { to: 'lc-branch-strategy', desc: '分支策略决定团队如何开、合、保护分支' },
      { to: 'tool-stash', desc: '切换分支前用 stash 安置未完成的改动' },
    ],
    example: `git switch -c feat/search       # 创建并切换到新分支
# ...开发、提交若干次...
git push -u origin feat/search  # 推送并绑定上游

git branch                      # 列出本地分支
git branch -a                   # 包含远程分支
git switch main                 # 切回主干
git branch -d feat/search       # 删除已合并的分支
git push origin --delete feat/search   # 删除远程分支
git branch --merged             # 查看哪些分支已并入当前分支`,
    exampleLang: 'bash',
    interview: '高频：分支的本质是指向提交的指针；fast-forward 与三方合并的区别；如何安全删除远程分支。',
  },
  {
    id: 'tool-merge',
    name: '合并与冲突解决',
    en: 'Merge & Conflict Resolution',
    cat: 'tools',
    sub: 'Git 核心',
    tags: ['版本控制', '协作'],
    summary: '合并把另一条分支的改动汇入当前分支；双方改了同一处就产生冲突，需人工裁决后完成合并。',
    detail: `**是什么**：合并把另一条分支的改动汇入当前分支并生成合并提交；若两条线改了同一处代码，Git 无法自动裁决，就产生冲突等待人工解决。

**典型场景**：功能分支开发完成合回 main；多人并行开发后的定期汇合。

**核心用法**：\`git switch main && git merge feat/login\`；冲突时 Git 用 <<<<<<<、=======、>>>>>>> 标出双方内容，手工编辑后 \`git add <file>\` 再 \`git commit\`；\`git merge --abort\` 随时放弃本次合并。

**技巧与坑**：合并前先 pull 最新主干，减小冲突面；解决冲突要理解双方意图，而不是无脑二选一；合并提交保留"曾经并行"的历史，想要线性历史则用 rebase。`,
    relations: [
      { to: 'tool-branch', desc: '合并是分支生命周期的终点' },
      { to: 'tool-rebase', desc: 'rebase 是合并的替代方案，产生线性历史' },
      { to: 'lc-branch-strategy', desc: '分支策略决定何时合并、由谁合并' },
    ],
    example: `git switch main
git pull origin main            # 先更新主干，减小冲突
git merge feat/login            # 合并功能分支

# 发生冲突时：
git status                      # 列出冲突文件
# 编辑文件，处理 <<<<<<< ======= >>>>>>> 标记
git add src/login.ts            # 标记该冲突已解决
git commit                      # 生成合并提交

git merge --abort               # 想放弃合并，一切复原`,
    exampleLang: 'bash',
    interview: '高频：merge 与 rebase 的区别与选择；冲突标记三段各代表什么；如何把冲突风险降到最低。',
  },
  {
    id: 'tool-rebase',
    name: '变基 rebase',
    en: 'Rebase',
    cat: 'tools',
    sub: 'Git 核心',
    tags: ['版本控制', '历史'],
    summary: 'rebase 把当前分支的提交摘下并重放到另一条分支之上，让提交历史变成一条直线。',
    detail: `**是什么**：变基把当前分支的提交"摘下来"，在目标分支的最新提交之上逐个重新播放，生成新的提交序列，让历史变成一条直线。

**典型场景**：功能分支定期同步主干，保持提交历史整洁；合并前用交互式 rebase 把零碎提交压成一个干净的提交。

**核心用法**：\`git fetch origin && git rebase origin/main\`；交互模式 \`git rebase -i HEAD~3\` 可 squash 压缩、reword 改写提交信息；冲突解决后 \`git rebase --continue\`，放弃用 \`--abort\`。

**技巧与坑**：黄金法则——绝不对已 push 到公共分支的提交做 rebase，改写哈希等于重写协作历史；吃不准时先开个备份分支再操作。`,
    relations: [
      { to: 'tool-merge', desc: 'rebase 与 merge 是汇合代码的两种路线' },
      { to: 'tool-cherry-pick', desc: '两者都通过重放提交改写历史' },
      { to: 'lc-branch-strategy', desc: '分支策略规定哪些分支允许 rebase' },
    ],
    example: `# 功能分支定期同步主干（线性历史）
git switch feat/login
git fetch origin
git rebase origin/main          # 把自己的提交搬到最新主干之上

# 交互式 rebase：整理最近 3 个提交
git rebase -i HEAD~3
#   pick    保持原样
#   squash  并入上一个提交
#   reword  改写提交信息

# 冲突解决后继续 / 放弃
git rebase --continue
git rebase --abort`,
    exampleLang: 'bash',
    interview: '高频：rebase 黄金法则（不改写公共历史）；interactive rebase 中 squash 与 reword 的用途；rebase 后如何同步远程（--force-with-lease）。',
  },
  {
    id: 'tool-remote',
    name: '远程仓库',
    en: 'Remote Repository (push/pull/fetch)',
    cat: 'tools',
    sub: 'Git 核心',
    tags: ['版本控制', '协作'],
    summary: '远程仓库是托管在服务器上的仓库副本，本地用 push/pull/fetch 与它同步，是团队协作的中枢。',
    detail: `**是什么**：远程仓库是托管在服务器上的仓库副本，本地通过 push/pull/fetch 与它交换提交，是团队共享与备份的中枢。

**典型场景**：团队共享代码、备份本地历史、CI 从远程拉取构建。

**核心用法**：\`git remote add origin <url>\` 关联远程；\`git push -u origin main\` 首推并绑定上游；\`git fetch\` 只下载不合并；\`git pull\` 下载并合并；\`git pull --rebase\` 拉取后变基保持线性历史。

**技巧与坑**：fetch 与 pull 的区别是高频考点——先 fetch 看看再决定怎么合并更稳；push 被拒说明远程有新提交，先 pull 再推；HTTPS 每次输密码，换 SSH 密钥一劳永逸。`,
    relations: [
      { to: 'tool-repo-init', desc: 'clone 会自动配置 origin 远程' },
      { to: 'tool-fork', desc: 'Fork 仓库的副本也通过 remote 互相同步' },
      { to: 'tool-ssh-key', desc: 'Git 推拉走 SSH 协议，配密钥免密免输密码' },
    ],
    example: `git remote -v                   # 查看已配置的远程
git remote add origin git@github.com:team/app.git

git push -u origin main         # 首推并绑定上游，此后 git push 即可
git push                        # 推送本地新提交
git fetch origin                # 只下载远程更新，不动本地分支
git pull origin main            # 下载并合并（fetch + merge）
git pull --rebase               # 下载并变基，保持线性历史

git remote set-url origin git@github.com:team/app-v2.git  # 换地址
git remote remove origin        # 解除关联`,
    exampleLang: 'bash',
    interview: '高频：fetch 与 pull 的区别；push 被拒（non-fast-forward）的原因与处理；-u 绑定上游的意义。',
  },
  {
    id: 'tool-tag',
    name: '标签与版本标记',
    en: 'Tag',
    cat: 'tools',
    sub: 'Git 核心',
    tags: ['版本控制', '发布'],
    summary: '标签是指向某个提交的固定书签，通常用于标记版本发布点，一经打好不再移动。',
    detail: `**是什么**：标签是指向某个提交的固定书签，通常标记版本发布点（v1.2.0）；与随提交移动的分支指针不同，标签一经打好就固定不变。

**典型场景**：发版时给主干打标签；线上出问题按标签快速检出当时代码；Release 页面依赖标签。

**核心用法**：\`git tag -a v1.2.0 -m "发布说明"\` 打附注标签；\`git push origin v1.2.0\` 推送单个标签；\`git checkout v1.2.0\` 检出该版本；删除用 \`git tag -d\`。

**技巧与坑**：正式发版用附注标签（含作者与时间），轻量标签只当个人书签；标签不随 push 自动上传，忘推标签是发版常见事故；版本号遵循语义化版本。`,
    relations: [
      { to: 'tool-release-github', desc: 'Release 建立在标签之上，是面向用户的发布页' },
      { to: 'lc-semver', desc: '标签名遵循语义化版本 v主.次.补丁' },
      { to: 'tool-log-diff', desc: '标签让历史中的发布点可快速定位与检出' },
    ],
    example: `git tag                         # 列出所有标签
git tag -a v1.2.0 -m "新增术语测验与暗色模式"   # 附注标签
git tag -a v1.2.1 HEAD~2 -m "给历史提交补标"   # 指定提交打标

git push origin v1.2.0          # 推送单个标签
git push --tags                 # 推送全部标签

git checkout v1.2.0             # 检出该版本（进入分离 HEAD）
git switch -                    # 回到之前的分支
git tag -d v1.2.1               # 删除本地标签
git push origin :refs/tags/v1.2.1      # 删除远程标签`,
    exampleLang: 'bash',
    interview: '要点：附注标签与轻量标签的区别；标签为什么不会随 push 自动上传；生产事故回溯为什么先找标签。',
  },
  {
    id: 'tool-stash',
    name: '暂存 stash',
    en: 'Stash',
    cat: 'tools',
    sub: 'Git 核心',
    tags: ['版本控制', '救急'],
    summary: 'stash 把工作区未完成的改动临时存入储藏区，让工作区瞬间干净，之后可随时恢复继续开发。',
    detail: `**是什么**：stash 把工作区与暂存区里未完成的改动临时存入"储藏柜"，工作区瞬间恢复干净，之后随时可以恢复出来继续干。

**典型场景**：功能写到一半被叫去修 Bug，需要先切分支；想 pull 但本地有未提交的改动挡路。

**核心用法**：\`git stash push -m "登录表单半成品"\` 存入并清空工作区；\`git stash list\` 查看；\`git stash pop\` 恢复最近一条并删除记录；\`git stash apply stash@{1}\` 恢复指定条目（保留记录）；\`git stash -u\` 连未跟踪的新文件一起存。

**技巧与坑**：stash 不是提交，长期存放容易遗忘，恢复即删才干净；恢复遇冲突需手动解决；多任务频繁切换更推荐每个任务一条分支。`,
    relations: [
      { to: 'tool-branch', desc: '切分支前用 stash 安置未完成改动' },
      { to: 'tool-commit', desc: 'stash 是"不生成提交"的临时存档' },
      { to: 'tool-merge', desc: 'stash pop 遇冲突时按合并冲突处理' },
    ],
    example: `git status                      # 工作区有未完成的改动
git stash push -m "登录表单半成品"    # 存入储藏区，工作区变干净
git stash list                  # stash@{0}: On feat/login: 登录表单半成品

git switch -c fix/hot-bug       # 安心切分支修 Bug
# ...修复完成、提交...
git switch feat/login-form      # 回到原分支
git stash pop                   # 恢复最近一次储藏并删除记录

git stash apply stash@{1}       # 恢复指定一条（记录保留）
git stash drop stash@{0}        # 丢弃指定一条
git stash -u                    # 连未跟踪的新文件一起存`,
    exampleLang: 'bash',
    interview: '要点：stash 与 commit 的本质区别；pop 与 apply 的区别；未跟踪文件默认不会被 stash（需 -u）。',
  },
  {
    id: 'tool-cherry-pick',
    name: '摘取提交 cherry-pick',
    en: 'Cherry-pick',
    cat: 'tools',
    sub: 'Git 核心',
    tags: ['版本控制', '救急'],
    summary: 'cherry-pick 把指定的某个提交摘到当前分支末尾，生成内容相同、哈希不同的新提交。',
    detail: `**是什么**：cherry-pick 把指定的某个提交"摘"到当前分支末尾，重新应用其改动，生成一个内容相同、哈希不同的新提交。

**典型场景**：把 Bug 修复从 main 摘到旧的发布分支；只想要某分支里的一个提交而不是整条分支的改动。

**核心用法**：\`git cherry-pick <hash>\` 摘单个提交；连续摘取 \`git cherry-pick A^..B\`；冲突时解决后 \`git cherry-pick --continue\`，放弃用 \`--abort\`。

**技巧与坑**：摘取后两个分支各有一个"同内容不同哈希"的提交，将来合并时 Git 会自动去重，不必担心重复；频繁 cherry-pick 往往说明分支策略有问题，应回头梳理；摘之前确认目标分支的基线兼容。`,
    relations: [
      { to: 'tool-rebase', desc: '两者都靠重放提交，rebase 是批量、pick 是单发' },
      { to: 'tool-merge', desc: '整条分支汇合用 merge，单个提交用 cherry-pick' },
      { to: 'lc-hotfix', desc: '热修复后常把补丁 cherry-pick 回各发布分支' },
    ],
    example: `git log main --oneline -5       # 找到要摘的提交哈希
# a1b2c3d fix: 修复导出空文件问题

git switch release/1.2          # 切到发布分支
git cherry-pick a1b2c3d         # 把修复摘过来

# 连续摘取一段提交（含 B，不含 A）
git cherry-pick A^..B

# 冲突时：解决后继续，或整体放弃
git cherry-pick --continue
git cherry-pick --abort`,
    exampleLang: 'bash',
    interview: '要点：为什么 cherry-pick 后哈希不同（父提交变了）；与 rebase 的关系；发布分支如何保持"只进修复"。',
  },
  {
    id: 'tool-log-diff',
    name: '日志与差异查看',
    en: 'Log & Diff',
    cat: 'tools',
    sub: 'Git 核心',
    tags: ['版本控制', '排障'],
    summary: 'git log 查看提交历史、git diff 查看状态间差异，是理解仓库发生了什么、定位问题的两只眼睛。',
    detail: `**是什么**：log 展示提交历史，diff 展示两个状态（工作区、暂存区、提交、分支）之间的差异，是理解"仓库里发生了什么"的两只眼睛。

**典型场景**：回顾谁在何时改了什么；提交前自查改动；排查某行代码的来历；找回误操作丢失的提交。

**核心用法**：\`git log --oneline --graph --all\` 一眼看全分支拓扑；\`git diff\` 看未暂存改动、\`git diff --staged\` 看已暂存；\`git blame <file>\` 逐行追责；\`git reflog\` 是后悔药。

**技巧与坑**：diff 里 -/+ 分别代表旧/新内容；大仓库用 \`git log -S "关键词"\` 按代码内容搜历史；reflog 记录一切 HEAD 移动，几乎什么都能救回来。`,
    relations: [
      { to: 'tool-commit', desc: 'log/diff 是核查提交内容的配套工具' },
      { to: 'tool-diff-patch', desc: 'diff 输出可以导出为补丁文件传播' },
      { to: 'tool-branch', desc: '比较分支差异是合并前的重要自查' },
    ],
    example: `git log --oneline --graph --all -15   # 分支拓扑一图看全
git log -p src/search.ts              # 带改动内容的详细历史
git blame src/search.ts               # 每行最后是谁改的

git diff                              # 工作区未暂存的改动
git diff --staged                     # 已暂存待提交的改动
git diff main..feat/login             # 两个分支的差异

git reflog                            # 所有 HEAD 移动记录（后悔药）
git reset --hard HEAD@{2}             # 回到 reflog 里的某个状态`,
    exampleLang: 'bash',
    interview: '高频：误 reset/误删分支后如何找回（reflog）；git log -S 与 -G 的用途；diff 输出中 a/ 与 b/ 前缀的含义。',
  },
  {
    id: 'tool-gitignore',
    name: 'gitignore 忽略规则',
    en: 'gitignore',
    cat: 'tools',
    sub: 'Git 核心',
    tags: ['版本控制', '配置'],
    summary: '.gitignore 声明哪些文件不纳入版本控制，避免把依赖、构建产物与密钥提交进仓库。',
    detail: `**是什么**：.gitignore 是仓库根目录的规则文件，声明哪些文件不纳入版本控制，Git 会自动跳过它们。

**典型场景**：新仓库初始化的第一件事——node_modules、dist、日志、本地环境文件都在列；敏感配置必须靠它挡在库外。

**核心用法**：每行一条规则：\`node_modules/\` 忽略整个目录，\`*.log\` 按通配匹配，\`!keep.txt\` 取反保留，\`build/\` 结尾斜杠限定目录；\`git check-ignore -v <file>\` 查询命中来源。

**技巧与坑**：已被跟踪的文件不受 ignore 影响，需先 \`git rm --cached <file>\` 停止跟踪；密钥与 .env 绝不入库，运行时用环境变量注入；直接用 github/gitignore 模板起步。`,
    relations: [
      { to: 'tool-repo-init', desc: '初始化仓库后的第一件事就是写 .gitignore' },
      { to: 'tool-commit', desc: '忽略规则决定哪些内容能进入提交' },
      { to: 'tool-env-vars', desc: '.env 等敏感文件应被忽略，配置改由环境变量注入' },
    ],
    example: `# 依赖与构建产物
node_modules/
dist/
*.tsbuildinfo

# 日志与本地环境（密钥绝不入库）
*.log
.env
.env.local

# 取反：忽略整个 dist 但保留占位文件
dist/*
!dist/.gitkeep`,
    exampleLang: 'text',
    interview: '要点：为什么已跟踪的文件 ignore 后仍在变更（需 git rm --cached）；规则优先级：后写的覆盖先写的，取反用 !。',
  },

  // ==================== GitHub 协作 ====================
  {
    id: 'tool-pr',
    name: 'Pull Request',
    en: 'Pull Request',
    cat: 'tools',
    sub: 'GitHub 协作',
    tags: ['协作', '流程'],
    summary: 'PR 是"请求把我的分支合入目标分支"的协作单元，集中呈现改动、讨论与审查，合并前守住质量关。',
    detail: `**是什么**：Pull Request（GitLab 称 Merge Request）是"请求把我的分支合入目标分支"的协作单元，集中呈现改动 diff、讨论与审查结论，是合并前最后一道质量关卡。

**典型场景**：团队功能合入主干前的必经环节；开源贡献者经 PR 向上游提交代码。

**核心用法**：推送分支后 \`gh pr create --fill\` 创建；描述写清背景、改动点与测试方式；用 "Closes #123" 关联 Issue；CI 通过 + 审查通过后合并（merge/squash/rebase 按团队约定）。

**技巧与坑**：PR 要小——几百行内的 PR 审查质量远高于上千行；标题遵循提交规范，方便自动生成变更日志；合并方式影响历史形态，squash 让主干一条提交一个功能。`,
    relations: [
      { to: 'lc-code-review', desc: 'PR 是 Code Review 落地的载体' },
      { to: 'tool-branch', desc: 'PR 通常以功能分支为源、主干为目标' },
      { to: 'tool-issue', desc: 'PR 描述中 Closes #N 可联动关闭 Issue' },
    ],
    example: `# 功能分支开发完成后
git push -u origin feat/search

# 创建 PR：标题、描述、关联 Issue
gh pr create \\
  --title "feat: 术语搜索支持拼音" \\
  --body "背景：#42。改动：索引与查询层。测试：单测 12 例通过。Closes #42" \\
  --base main --head feat/search

# 跟进评审意见与 CI 状态
gh pr checks && gh pr view --comments

# 审查通过后合并（团队约定 squash）
gh pr merge --squash --delete-branch`,
    exampleLang: 'bash',
    interview: '要点：PR 为什么强调小而专注；三种合并方式（merge/squash/rebase）各留下什么样的历史。',
  },
  {
    id: 'tool-code-review-gh',
    name: 'Code Review 流程',
    en: 'Code Review',
    cat: 'tools',
    sub: 'GitHub 协作',
    tags: ['协作', '质量'],
    summary: 'Code Review 是合并前由他人检查代码的流程，把关正确性与可读性，同时传播团队知识。',
    detail: `**是什么**：Code Review 是合并前由他人检查代码的流程：确认逻辑正确、边界周全、风格一致、可维护，同时也是团队传递领域知识的日常课堂。

**典型场景**：每个 PR 至少一名审查者把关；核心与安全模块要求资深成员复审。

**核心用法**：在 PR 的 Files Changed 里逐行评论；\`gh pr review --approve\` 通过、\`--request-changes\` 打回；对具体代码可直接给 suggestion 代码块，作者一键采纳。

**技巧与坑**：审查关注正确性、边界、安全与可读性，风格问题交给格式化工具；意见对事不对人，用"建议"代替"命令"；小步快提让 review 十分钟内能看完，响应别超过一个工作日。`,
    relations: [
      { to: 'lc-code-review', desc: '全链路视角的 CR 规范与角色分工' },
      { to: 'tool-pr', desc: 'PR 页面是执行 CR 的主战场' },
      { to: 'lc-coding-standards', desc: '编码标准是 CR 的评判基准' },
    ],
    example: `# 列出等待我审查的 PR
gh pr list --review-requested @me

# 先看整体 diff，再逐行评论
gh pr diff 123 | less

# 给出审查结论
gh pr review 123 --comment -b "整体 LGTM，第 42 行建议加边界判断"
gh pr review 123 --request-changes -b "需补充错误处理后再合入"
gh pr review 123 --approve

# 网页评论中对代码块给出可一键采纳的建议
# \`\`\`suggestion
# const total = items.length || 0;
# \`\`\``,
    exampleLang: 'bash',
    interview: '高频：CR 应该看什么（正确性/安全/可读性）、不该纠结什么（风格交给工具）；如何写出对事不对人的审查意见。',
  },
  {
    id: 'tool-issue',
    name: 'Issue 与任务管理',
    en: 'Issue Tracking',
    cat: 'tools',
    sub: 'GitHub 协作',
    tags: ['协作', '任务管理'],
    summary: 'Issue 是仓库里的任务与问题跟踪单元，Bug 报告、功能提案、技术债都开成 Issue 统一管理。',
    detail: `**是什么**：Issue 是仓库里的任务与问题跟踪单元：Bug 报告、功能提案、技术债都开成一个 Issue，配标签、负责人与里程碑形成需求池。

**典型场景**：Bug 上报与闭环跟踪；大需求拆解为可执行的任务；开源项目的需求池与讨论区。

**核心用法**：\`gh issue create -t "登录页 500" -b "复现步骤…"\`；用标签分类（bug/enhancement/P1）；修复 PR 写 "Closes #123"，合并即自动关闭；\`gh issue list --label bug\` 过滤。

**技巧与坑**：一个 Issue 只讲一件事，复现步骤、期望与实际结果写全；Issue 编号可跨仓库引用（org/repo#123）；大需求先拆用户故事再落 Issue。`,
    relations: [
      { to: 'lc-bug-lifecycle', desc: 'Issue 是线上缺陷进入闭环流程的入口' },
      { to: 'tool-pr', desc: 'PR 通过 Closes #N 与 Issue 联动关闭' },
      { to: 'lc-user-story', desc: '用户故事是拆解 Issue 的上游框架' },
    ],
    example: `# 创建 Bug 报告
gh issue create \\
  -t "搜索在空关键词时返回 500" \\
  -b "复现：首页直接点搜索。期望：提示输入关键词。实际：500。" \\
  -l bug -l P1

# 常用管理操作
gh issue list --label bug --state open
gh issue view 42 --comments
gh issue close 42 --reason completed

# PR 描述写 Closes #42，合并即自动关闭该 Issue
git commit -m "fix: 空关键词搜索返回提示 (closes #42)"`,
    exampleLang: 'bash',
    interview: '要点：Issue 与 PR 的联动机制（Closes/Fixes #N）；标签与里程碑如何组织任务优先级。',
  },
  {
    id: 'tool-fork',
    name: 'Fork 与上游同步',
    en: 'Fork & Upstream Sync',
    cat: 'tools',
    sub: 'GitHub 协作',
    tags: ['协作', '开源'],
    summary: 'Fork 把别人的仓库复制到自己账号下自由提交，再经 PR 向上游提议合并，是无写权限也能贡献的标准流程。',
    detail: `**是什么**：Fork 把别人的仓库复制一份到自己账号下，你在自己的副本上自由提交，再通过 PR 向上游（upstream）提议合并——没有原仓库写权限也能参与贡献。

**典型场景**：给开源项目提 PR 的标准姿势；基于他人项目维护自己的定制版。

**核心用法**：GitHub 点 Fork → \`git clone <你的副本>\` → \`git remote add upstream <原仓库>\`；同步上游 \`git fetch upstream && git rebase upstream/main\`；功能分支推到自己的 Fork 后向上游发 PR。

**技巧与坑**：Fork 是 GitHub 概念，Git 本身只有 remote；提 PR 前先把功能分支 rebase 到上游最新，减少审查噪音；不要直接在自己的 main 上开发，永远走功能分支。`,
    relations: [
      { to: 'tool-pr', desc: 'Fork + PR 是开源贡献的标准组合' },
      { to: 'tool-remote', desc: 'origin 与 upstream 是 fork 工作流的两条 remote' },
      { to: 'tool-branch', desc: '功能分支让 Fork 的 main 始终保持与上游一致' },
    ],
    example: `# 1. GitHub 页面点 Fork，得到 your-name/project
git clone git@github.com:your-name/project.git
cd project

# 2. 关联上游原仓库
git remote add upstream https://github.com/origin-owner/project.git
git remote -v                  # origin=你的副本，upstream=原仓库

# 3. 开功能分支并提交
git switch -c feat/fix-typo

# 4. 同步上游最新后推送，再向上游发 PR
git fetch upstream
git rebase upstream/main
git push -u origin feat/fix-typo`,
    exampleLang: 'bash',
    interview: '要点：fork 与 clone 的区别；origin 与 upstream 各指什么；如何让长期维护的 Fork 不落后于上游。',
  },
  {
    id: 'tool-release-github',
    name: 'Release 版本发布',
    en: 'GitHub Release',
    cat: 'tools',
    sub: 'GitHub 协作',
    tags: ['发布', '版本'],
    summary: 'Release 是挂在标签之上的正式发布页，汇总版本变更说明并附带产物下载，是面向用户的版本交付出口。',
    detail: `**是什么**：Release 是 GitHub 上挂在标签之上的正式发布页：汇总本版变更说明、附带可下载的构建产物，是面向用户的版本交付出口。

**典型场景**：开源项目发新版；团队对外交付安装包、二进制或 SDK。

**核心用法**：先打标签再发版：\`gh release create v1.2.0 --generate-notes\` 自动按提交生成变更说明；\`gh release upload v1.2.0 dist/app.zip\` 附产物；内测版加 \`--prerelease\` 标记。

**技巧与坑**：Release 依赖标签存在，标签没推上去发版会失败；变更说明可基于约定式提交自动生成，因此提交规范是前提；重要版本把产物校验和（checksum）一并上传便于校验。`,
    relations: [
      { to: 'tool-tag', desc: 'Release 必须依附于一个已存在的标签' },
      { to: 'lc-release-checklist', desc: '发版前逐项过发布清单再点 Publish' },
      { to: 'ops-cd', desc: 'CD 流水线可自动创建 Release 并上传产物' },
    ],
    example: `# 1. 确认主干稳定，打附注标签并推送
git tag -a v1.2.0 -m "v1.2.0：术语测验上线"
git push origin v1.2.0

# 2. 创建 Release（按约定式提交自动生成变更说明）
gh release create v1.2.0 \\
  --title "v1.2.0 术语测验" \\
  --generate-notes

# 3. 附上构建产物
gh release upload v1.2.0 dist/app-1.2.0.zip

# 4. 预发布版本供内测
gh release create v1.3.0-rc.1 --prerelease`,
    exampleLang: 'bash',
    interview: '要点：Tag 与 Release 的关系；--generate-notes 依赖约定式提交的原因；预发布（prerelease）的用途。',
  },

  // ==================== 包管理与依赖 ====================
  {
    id: 'tool-npm',
    name: 'npm 与 package.json',
    en: 'npm & package.json',
    cat: 'tools',
    sub: '包管理与依赖',
    tags: ['依赖', 'Node'],
    summary: 'npm 是 Node.js 的包管理器，package.json 声明项目的依赖与脚本，npm 据此安装依赖、运行任务。',
    detail: `**是什么**：npm 是 Node.js 官方包管理器，package.json 是项目的"身份证"：声明名称、依赖与脚本，npm 据此安装依赖、执行任务。

**典型场景**：任何 Node/前端项目的依赖管理起点；scripts 定义 dev/build/test 等统一命令入口。

**核心用法**：\`npm install\` 按锁文件精确安装；\`npm install lodash\` 加生产依赖，\`npm install -D vitest\` 加开发依赖；\`npm run dev\` 执行脚本；\`npm outdated\` 查看可升级依赖。

**技巧与坑**：依赖分 dependencies 与 devDependencies，部署环境只装前者省体积；锁文件必须提交；装陌生包前先看周下载量与仓库活跃度，谨防仿冒包投毒。`,
    relations: [
      { to: 'tool-lockfile', desc: '锁文件把 package.json 的版本范围钉成精确版本' },
      { to: 'tool-npx-scripts', desc: 'scripts 与 npx 是项目任务的执行入口' },
      { to: 'sec-dependency-audit', desc: 'npm audit 是依赖漏洞审计的日常入口' },
    ],
    example: `{
  "name": "codequest",
  "version": "1.2.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run"
  },
  "dependencies": { "react": "^18.3.1" },
  "devDependencies": { "vite": "^5.4.10", "vitest": "^2.1.0" }
}`,
    exampleLang: 'json',
    interview: '高频：dependencies 与 devDependencies 的区别；npm install 与 npm ci 的区别；如何审计依赖漏洞（npm audit）。',
  },
  {
    id: 'tool-semver-dep',
    name: '语义化版本依赖',
    en: 'Semantic Version Deps (^ ~)',
    cat: 'tools',
    sub: '包管理与依赖',
    tags: ['依赖', '版本'],
    summary: '^1.2.3 允许主版本内升级、~1.2.3 只收补丁升级，前缀决定依赖更新的激进程度。',
    detail: `**是什么**：语义化版本（主.次.补丁）配合 ^ 与 ~ 前缀声明"依赖可接受的更新范围"：^1.2.3 允许升到 <2.0.0，~1.2.3 只允许升到 <1.3.0。

**典型场景**：package.json 里权衡依赖升级的激进与稳定；排查"他机器能跑我机器报错"的版本漂移问题。

**核心用法**：\`^1.2.3\` 不改主版本（仍有小版本引入问题的可能），\`~1.2.3\` 最保守只收补丁，写死 \`1.2.3\` 完全锁定；\`npm ls <pkg>\` 查看实际安装的版本。

**技巧与坑**：^ 对 0.x 版本只允许同 0.y.z 段内升级（0 时代小版本也可能破坏兼容）；范围宽松交给锁文件兜底；跨主版本升级前先读 changelog 并回归测试。`,
    relations: [
      { to: 'lc-semver', desc: '依赖范围规则建立在你自己发版的语义化版本之上' },
      { to: 'tool-lockfile', desc: '范围声明选方向，锁文件定精确版本' },
      { to: 'tool-package-managers', desc: '各包管理器使用同一套语义化版本范围语法' },
    ],
    example: `^1.2.3   → 允许 1.2.3 ≤ v < 2.0.0（主版本内自由升级）
~1.2.3   → 允许 1.2.3 ≤ v < 1.3.0（只收补丁，最保守）
1.2.3    → 精确锁定，不自动升级
*        → 任意版本（危险，勿用）

# 特殊：0.x 阶段小版本可能带破坏性
^0.5.2   → 仅允许 0.5.x，等价于 ~0.5.2

# 实际安装的版本由锁文件决定
npm ls react          # 查看实际安装的版本
npm outdated          # 查看哪些依赖可升级`,
    exampleLang: 'text',
    interview: '高频：^ 与 ~ 的区别；为什么 0.x 版本下 ^ 的行为不同；主版本升级的正确流程。',
  },
  {
    id: 'tool-lockfile',
    name: '锁文件',
    en: 'Lockfile',
    cat: 'tools',
    sub: '包管理与依赖',
    tags: ['依赖', '安装'],
    summary: '锁文件（package-lock.json 等）把依赖树钉死为精确版本，保证任何机器上安装结果完全一致。',
    detail: `**是什么**：锁文件（package-lock.json / pnpm-lock.yaml）把整棵依赖树连同精确版本与下载地址钉死，让任何人在任何机器上都装出完全一致的依赖。

**典型场景**：CI 与生产部署要求可复现安装；团队协作消除"版本漂移"类疑难杂症。

**核心用法**：日常开发用 \`npm install\`（可更新锁文件），CI 与部署用 \`npm ci\`——严格按锁文件安装且速度更快；修改依赖后锁文件与 package.json 成对提交。

**技巧与坑**：锁文件必须入库，删掉它等于放弃可复现性；两人改动冲突时重新生成再提交，比手工合并安全得多；锁文件含完整下载地址与哈希，是依赖审计与供应链检查的输入。`,
    relations: [
      { to: 'tool-npm', desc: '锁文件是 package.json 版本范围的精确化' },
      { to: 'tool-semver-dep', desc: '^~ 决定范围，锁文件决定实际版本' },
      { to: 'sec-supply-chain', desc: '锁文件哈希校验是防依赖投毒的第一道闸' },
    ],
    example: `# 日常开发：允许按需更新锁文件
npm install

# CI / 生产：严格按锁文件安装，绝不改动它
npm ci

# 团队协作规则
# 1. package.json 与 package-lock.json 必须成对提交
# 2. 升级单个依赖：npm install react@18.3.1
# 3. 锁文件冲突时不要手工合并：
git checkout --theirs package-lock.json
npm install                        # 重新生成一致的锁文件`,
    exampleLang: 'bash',
    interview: '高频：npm install 与 npm ci 的区别；锁文件为什么必须提交；删除锁文件会带来什么问题。',
  },
  {
    id: 'tool-monorepo',
    name: '单仓库 Monorepo',
    en: 'Monorepo',
    cat: 'tools',
    sub: '包管理与依赖',
    tags: ['工程化', '仓库'],
    summary: 'Monorepo 把多个相关包放在同一仓库统一管理，靠工作区工具解析跨包依赖与按序构建。',
    detail: `**是什么**：Monorepo 把多个相关包放在同一仓库统一管理：共享提交历史、工具链与版本策略，由工作区工具解析跨包依赖并按拓扑构建。

**典型场景**：组件库与多个应用共享代码；前后端同仓库联调；Next.js、Babel 等大型开源项目皆如此。

**核心用法**：根目录 \`pnpm-workspace.yaml\` 声明 packages；包间依赖写 \`"workspace:*"\` 协议；\`pnpm -r build\` 按拓扑构建全部包，\`pnpm --filter web dev\` 只操作指定包。

**技巧与坑**：没有工作区工具的 Monorepo 是灾难，先选 pnpm workspace / Turborepo / Nx；权限与发布粒度变粗，大组织需配套 CI 缓存与权限体系。`,
    relations: [
      { to: 'tool-package-managers', desc: 'pnpm 的 workspace 是 Monorepo 的主流底座' },
      { to: 'tool-lockfile', desc: '整个仓库共享一份根锁文件保证一致' },
      { to: 'fe-bundler', desc: '跨包引用经打包器解析，构建缓存是提速关键' },
    ],
    example: `# pnpm-workspace.yaml —— 声明哪些目录是包
packages:
  - "apps/*"      # 应用：web、admin
  - "packages/*"  # 共享包：ui、utils

# 包内 package.json 引用同仓库的包：
#   "dependencies": { "@codequest/ui": "workspace:*" }

pnpm install                 # 一次性装好所有包的依赖
pnpm --filter web dev        # 只启动 web 应用
pnpm -r build                # 按依赖拓扑顺序构建全部包`,
    exampleLang: 'text',
    interview: '要点：Monorepo 与多仓库（polyrepo）的取舍；workspace:* 协议的作用；为什么 Monorepo 依赖 CI 缓存与增量构建。',
  },
  {
    id: 'tool-package-managers',
    name: '包管理器对比',
    en: 'npm / yarn / pnpm',
    cat: 'tools',
    sub: '包管理与依赖',
    tags: ['依赖', '工具链'],
    summary: 'npm、yarn、pnpm 三大包管理器功能相同，差异在安装速度、磁盘占用与 Monorepo 支持。',
    detail: `**是什么**：npm、yarn、pnpm 是三大 JS 包管理器：都能装依赖、跑脚本，差异在速度、磁盘与工程化能力——pnpm 靠全局内容寻址存储加硬链接，省磁盘、装得快、依赖结构严格；npm 内置零配置；yarn 老牌稳定。

**典型场景**：新项目选型、老项目迁移、统一团队工具链。

**核心用法**：\`npm i\` / \`yarn add\` / \`pnpm add\` 装依赖；pnpm 独有 \`pnpm store prune\` 清理全局缓存；package.json 的 \`packageManager\` 字段加 \`corepack enable\` 锁定全项目的管理器版本。

**技巧与坑**：一个团队锁定一种管理器，混用会让锁文件来回打架；迁移时删旧锁文件与 node_modules 重装；三者锁文件格式互不兼容，PR 里别横跳。`,
    relations: [
      { to: 'tool-npm', desc: 'npm 是基准实现，其余两者语法高度兼容' },
      { to: 'tool-lockfile', desc: '各家锁文件格式互不兼容，是混用的主要代价' },
      { to: 'tool-monorepo', desc: 'pnpm workspace 是 Monorepo 的主流选择' },
    ],
    example: `# 常用命令对照：npm / yarn / pnpm
npm install        yarn add         pnpm add
npm run dev        yarn dev         pnpm dev
npm uninstall x    yarn remove x    pnpm remove x

# pnpm：全局内容寻址存储 + 硬链接，省磁盘且安装快
pnpm store path        # 查看全局存储位置
pnpm store prune       # 清理未被引用的包

# 团队锁定包管理器（package.json 中声明）
#   "packageManager": "pnpm@9.12.0"
corepack enable        # 按该字段自动使用对应工具与版本`,
    exampleLang: 'text',
    interview: '要点：pnpm 为什么省磁盘（内容寻址 + 硬链接/符号链接结构）；如何用 packageManager + corepack 统一团队工具。',
  },

  // ==================== 环境与脚本 ====================
  {
    id: 'tool-shell-basics',
    name: 'Shell 命令行基础',
    en: 'Shell Basics',
    cat: 'tools',
    sub: '环境与脚本',
    tags: ['Shell', '基础'],
    summary: 'Shell 是命令行解释器，配合管道与重定向把小程序组合成强大流程，是远程开发与自动化的基本功。',
    detail: `**是什么**：Shell 是命令行解释器（bash/zsh），把命令交给操作系统执行；管道把前一个命令的输出接给下一个命令，重定向把输出写入文件，小程序因此能像积木一样组合。

**典型场景**：连服务器查日志、批量处理文件、编写自动化脚本。

**核心用法**：\`ls -la\` 看隐藏文件、\`cd -\` 回上个目录；管道 \`grep "ERROR" app.log | wc -l\` 统计错误行；\`./run.sh > out.log 2>&1\` 同时收编输出与报错；\`chmod +x run.sh\` 赋执行权。

**技巧与坑**：路径含空格必须加引号；rm 不进回收站，\`rm -rf\` 前先 pwd 三思；脚本开头加 \`set -euo pipefail\`，出错即停不静默扩散。`,
    relations: [
      { to: 'ops-server', desc: '登录服务器排障全靠 Shell 命令' },
      { to: 'tool-terminal-tips', desc: '快捷键与别名建立在 Shell 之上' },
      { to: 'tool-process-exit', desc: '退出码是脚本串联与流程控制的基础' },
    ],
    example: `cd ~/projects && ls -la            # 进入目录并列出（含隐藏文件）
mkdir -p src/utils                 # 递归创建目录
cp a.txt backup/ && mv b.txt c.txt # 复制与重命名/移动

# 管道组合：统计日志里 ERROR 的行数
grep "ERROR" app.log | wc -l
# 找出当前目录最大的 5 个文件
du -sh * | sort -rh | head -5

# 重定向：标准输出与错误都写入文件
./run.sh > out.log 2>&1

chmod +x deploy.sh                 # 赋予执行权限`,
    exampleLang: 'bash',
    interview: '要点：管道与重定向的区别；set -euo pipefail 三个开关各管什么；为什么脚本要用绝对路径。',
  },
  {
    id: 'tool-env-vars',
    name: '环境变量',
    en: 'Environment Variables',
    cat: 'tools',
    sub: '环境与脚本',
    tags: ['配置', '安全'],
    summary: '环境变量在进程启动时注入键值配置，让同一份代码在不同环境读不同配置，密钥无需写进代码。',
    detail: `**是什么**：环境变量是进程启动时注入的键值配置，让同一份代码在开发/测试/生产读到不同配置；密钥也由此不必写进代码。

**典型场景**：区分各环境的 API 地址；注入数据库密码、API Key 等敏感信息；CI 中传入部署参数。

**核心用法**：\`export DATABASE_URL=postgres://...\` 注入会话；Node 里 \`process.env.DATABASE_URL\` 读取；本地用 .env 文件配合 dotenv 加载；前端构建期变量按框架约定前缀注入（如 VITE_API_URL）。

**技巧与坑**：.env 文件必须进 .gitignore，密钥泄露事故多源于此；前端变量会被打进产物，浏览器可见，任何秘密都别放前端环境变量；改了环境变量要重启进程才生效。`,
    relations: [
      { to: 'lc-environments', desc: '环境变量是实现多环境隔离的标配手段' },
      { to: 'tool-gitignore', desc: '.env 文件必须被忽略，防止密钥入库' },
      { to: 'sec-password-storage', desc: '密钥注入运行时而非硬编码，是最基本的保密实践' },
    ],
    example: `# 临时注入（只对本次命令/会话生效）
export DATABASE_URL="postgres://localhost:5432/app"
export NODE_ENV=development

# 只对一条命令生效的前缀写法
NODE_ENV=production node server.js

# .env 文件（必须加入 .gitignore）
#   DATABASE_URL=postgres://localhost:5432/app
#   API_KEY=sk-xxxx
npx dotenv -e .env -- node server.js   # 加载后启动

# 进程内读取
node -e "console.log(process.env.NODE_ENV)"`,
    exampleLang: 'bash',
    interview: '高频：为什么前端"环境变量"不能存密钥（会打进产物）；.env 与运行时注入的边界；改环境变量为何要重启进程。',
  },
  {
    id: 'tool-make',
    name: 'Makefile 任务编排',
    en: 'Makefile & make',
    cat: 'tools',
    sub: '环境与脚本',
    tags: ['任务编排', '构建'],
    summary: 'make 按 Makefile 声明的"目标+依赖+命令"执行任务，只重建过期的部分，是老而弥坚的任务编排器。',
    detail: `**是什么**：make 按Makefile里声明的规则执行任务：每条规则是"目标: 依赖 + 命令"，依据文件时间戳只重建过期的部分，是四十多年不倒的任务编排器。

**典型场景**：项目统一入口 make build / make test，新人零文档上手；CI 流水线里调 make，而不是在 YAML 里复制一串命令。

**核心用法**：\`make test\` 执行 test 目标；\`make clean\` 惯例清理；纯任务目标必须写进 \`.PHONY\`，避免与同名文件冲突；\`build: test\` 声明依赖让构建前先跑测试。

**技巧与坑**：命令行必须以 Tab 缩进，空格会报 "missing separator"，新手第一坑；输出默认回显命令，行首加 @ 可静默；多命令间用 && 保证失败即停。`,
    relations: [
      { to: 'tool-shell-basics', desc: 'Makefile 的命令行就是 Shell 语句' },
      { to: 'tool-process-exit', desc: '命令失败（非 0）会中断 make 并传播错误' },
      { to: 'ops-pipeline', desc: 'CI 流水线常用 make 作为统一构建入口' },
    ],
    example: `.PHONY: dev build test clean   # 声明伪目标（非文件）

dev:      ## 启动开发环境
	npm run dev

test:     ## 跑测试
	vitest run

build: test   ## 依赖 test：先测试后构建
	npm run build

clean:
	rm -rf dist

# 注意：命令行必须用 Tab 缩进；用法 make dev / test / build / clean`,
    exampleLang: 'text',
    interview: '要点：.PHONY 的作用；make 的增量构建原理（目标文件与依赖的时间戳比较）；Tab 缩进坑。',
  },
  {
    id: 'tool-npx-scripts',
    name: 'npx 与 npm scripts',
    en: 'npx & npm scripts',
    cat: 'tools',
    sub: '环境与脚本',
    tags: ['脚本', 'npm'],
    summary: 'npm scripts 是 package.json 里的任务入口，npx 可直接运行包内命令行工具而无需全局安装。',
    detail: `**是什么**：npm scripts 是 package.json 里的任务入口，统一成 npm run xxx；npx 无需全局安装即可直接运行包内命令行工具。

**典型场景**：团队统一跑 test/lint/build，不必记各工具参数；临时用脚手架等一次性工具不污染全局。

**核心用法**：scripts 写 \`"test": "vitest run"\` 后 \`npm run test\` 执行；pre/post 前缀自动串联；\`npx create-vite@latest\` 临时跑脚手架；npx 优先找本地 node_modules/.bin 的版本。

**技巧与坑**：npm run 会把 node_modules/.bin 加入 PATH，脚本里可直接写工具名；传参经 \`npm run lint -- --fix\` 的 -- 透传；全局装工具易版本漂移，优先装成 devDependencies。`,
    relations: [
      { to: 'tool-npm', desc: 'scripts 定义在 package.json 中，随 npm 执行' },
      { to: 'tool-package-managers', desc: 'yarn/pnpm 有等价的 run 与 dlx/exec' },
      { to: 'ops-pipeline', desc: 'CI 流水线的每个步骤几乎都在调 npm run' },
    ],
    example: `# package.json 中的 scripts
#   "dev": "vite"
#   "test": "vitest run"
#   "lint": "eslint ."

npm run dev                    # 执行 dev 任务
npm run lint -- --fix          # -- 之后的参数透传给 eslint
npm test                       # test/build/start 有快捷形式

# npx：临时运行工具，不装全局
npx create-vite@latest demo    # 脚手架用完即走
npx prettier --write src/      # 优先用项目内安装的版本

# pre/post 前缀自动串联：pretest 在 test 之前执行`,
    exampleLang: 'bash',
    interview: '要点：npx 的查找顺序（本地 .bin → 全局 → 临时下载）；npm run 注入 PATH 的机制；-- 透传参数。',
  },
  {
    id: 'tool-cron',
    name: '定时任务 crontab',
    en: 'Cron / crontab',
    cat: 'tools',
    sub: '环境与脚本',
    tags: ['定时', 'Linux'],
    summary: 'cron 按"分 时 日 月 周"五字段的计划表到点自动执行命令，是服务器定时任务的标配。',
    detail: `**是什么**：cron 是 Linux 的定时任务守护进程，crontab -e 编辑"分 时 日 月 周"五个字段的计划表，到点自动执行命令或脚本。

**典型场景**：每天凌晨备份数据库、定时拉取数据、周期清理日志与缓存、按小时跑报表。

**核心用法**：\`crontab -e\` 编辑当前用户计划；\`0 3 * * * /opt/backup.sh\` 每天 3 点执行；\`*/5 * * * *\` 每 5 分钟一次；\`crontab -l\` 查看；输出重定向 \`>> /var/log/job.log 2>&1\` 留痕。

**技巧与坑**：cron 的环境变量极简，PATH 不含自定义路径，脚本一律用绝对路径；输出默认发邮件，重定向到文件更可靠；服务器时区影响触发时间。`,
    relations: [
      { to: 'ops-server', desc: 'crontab 是 Linux 服务器上的基础定时设施' },
      { to: 'tool-shell-basics', desc: 'cron 执行的就是 Shell 命令与脚本' },
      { to: 'ops-backup-dr', desc: '定时备份是容灾体系的第一块砖' },
    ],
    example: `crontab -e                        # 编辑当前用户的计划任务
crontab -l                        # 查看已有任务

# ┌─ 分钟(0-59)   ┌─ 小时(0-23)   ┌─ 日(1-31)
# │              │               │        ┌─ 月(1-12)  ┌─ 周(0-7, 0/7=周日)
0 3 * * *    /opt/scripts/backup-db.sh >> /var/log/backup.log 2>&1
*/5 * * * *  curl -sf https://api.example.com/health > /dev/null
0 9 * * 1-5  /opt/scripts/send-report.sh         # 工作日早 9 点
30 2 1 * *   /opt/scripts/clean-logs.sh          # 每月 1 号凌晨`,
    exampleLang: 'text',
    interview: '高频：五个字段的顺序与含义；cron 任务没跑如何排查（时区、环境变量、绝对路径、日志）；*/n 的语义。',
  },
  {
    id: 'tool-process-exit',
    name: '进程与退出码',
    en: 'Process & Exit Codes',
    cat: 'tools',
    sub: '环境与脚本',
    tags: ['进程', '脚本'],
    summary: '退出码是进程结束时的结论：0 成功、非 0 失败，脚本、Shell 与 CI 全靠它判断成败。',
    detail: `**是什么**：退出码是进程结束时留给父进程的一位数字结论：0 表示成功，非 0 表示失败；Shell 的条件执行、脚本的分支与 CI 的红绿判定全部建立其上。

**典型场景**：脚本中判断上一步是否成功再决定下一步；CI 流水线依据测试进程的退出码决定任务是否通过。

**核心用法**：\`$?\` 读取上一条命令的退出码；脚本里 \`exit 1\` 显式宣告失败；\`cmd1 && cmd2\` 成功才继续，\`cmd1 || cmd2\` 失败才兜底；\`ps aux | grep\` 找 PID 后 \`kill <pid>\` 终止进程。

**技巧与坑**：&& 链条中途失败会静默中断，CI 里务必让失败显式可见；测试框架失败返回非 0，流水线才能变红；kill 前先 ps 确认真凶，-9 强杀是最后手段。`,
    relations: [
      { to: 'tool-shell-basics', desc: '退出码与 && || 构成 Shell 的流程控制' },
      { to: 'tool-make', desc: '命令失败时 make 靠退出码中断构建' },
      { to: 'ops-pipeline', desc: 'CI 每个步骤的红绿判定就是退出码判定' },
    ],
    example: `ls /nonexistent
echo $?                            # 输出 1：非 0 即失败

echo $?                            # 输出 0：上一条 echo 成功了

# 脚本里显式声明结果：0 成功，非 0 失败
exit 1

# && 成功才继续，|| 失败才兜底 —— CI 红绿由此判断
npm run lint && npm test && npm run build`,
    exampleLang: 'bash',
    interview: '要点：0 与非 0 的约定；&& 与 ; 的区别；为什么测试失败时进程必须返回非 0。',
  },

  // ==================== 效率工具 ====================
  {
    id: 'tool-regex',
    name: '正则表达式',
    en: 'Regular Expression',
    cat: 'tools',
    sub: '效率工具',
    tags: ['文本处理', '正则'],
    summary: '正则用一串符号描述文本模式，一次声明即可完成查找、替换与校验，是文本处理的瑞士军刀。',
    detail: `**是什么**：正则表达式用一串符号描述文本模式，一次声明即可完成查找、替换与校验——grep、编辑器、各编程语言通用。

**典型场景**：校验邮箱/手机号格式；日志中批量提取字段；编辑器里批量重构变量名。

**核心用法**：\`\\d\` 数字、\`\\w\` 字母数字下划线、\`.\` 任意字符、\`+\` 一次以上、\`*\` 零次以上、\`?\` 可选；\`(colou?r)\` 分组捕获、\`\\1\` 反向引用；命令行 \`grep -E "ERROR|WARN"\` 直接筛选日志。

**技巧与坑**：\`.\` 是任意字符，匹配句点要写 \`\\.\`；贪婪量词会"多吃"，用 \`.*?\` 懒惰匹配收窄；嵌套量词可能引发回溯爆炸，复杂正则要配注释与测试用例。`,
    relations: [
      { to: 'tool-shell-basics', desc: 'grep/sed/awk 的威力一半来自正则' },
      { to: 'tool-editor-setup', desc: '编辑器批量替换与搜索离不开正则' },
      { to: 'tool-terminal-tips', desc: '历史搜索与日志排查常配合正则' },
    ],
    example: `模式            含义
^https?://      行首的 http 或 https 链接开头
\\d{11}         连续 11 位数字（手机号粗校验）
[a-zA-Z0-9_]+   字母/数字/下划线，至少 1 个
colou?r         color 或 colour，? 表示可有可无
ERROR|WARN      或：匹配 ERROR 或 WARN
.*?             懒惰匹配：尽量少地吞字符
\\btool\\b       词边界：独立单词 tool，不匹配 tools

# 实战：grep 提取日志中的耗时
grep -oE "took [0-9]+ms" app.log

# JS 中校验日期格式
"2026-01-15".match(/^\\d{4}-\\d{2}-\\d{2}$/)`,
    exampleLang: 'text',
    interview: '高频：贪婪与懒惰匹配的区别；正则回溯导致的性能问题；在 grep/JS/编辑器中各写一个提取模式。',
  },
  {
    id: 'tool-curl',
    name: 'Curl 与 API 调试',
    en: 'curl',
    cat: 'tools',
    sub: '效率工具',
    tags: ['调试', 'HTTP'],
    summary: 'curl 是命令行 HTTP 客户端，一条命令即可发送任意方法、带头部与请求体的请求，是不开浏览器调 API 的第一工具。',
    detail: `**是什么**：curl 是命令行 HTTP 客户端，一条命令即可发送任意方法、带头部与请求体的请求。

**典型场景**：联调时验证后端接口；脚本中调用 Web API；健康检查与网关排障。

**核心用法**：\`curl https://api.example.com/users\` 发 GET；\`-X POST -H "Content-Type: application/json" -d '{...}'\` 发 JSON；\`-i\` 显示响应头，\`-L\` 跟随重定向，\`-w "%{http_code}"\` 只取状态码，\`-v\` 看完整握手。

**技巧与坑**：JSON 体与引号冲突时改用 \`-d @body.json\`；证书报错先查证书链与系统时间，别习惯性加 -k；带令牌的命令会进 shell 历史，注意清理。`,
    relations: [
      { to: 'net-http', desc: 'curl 直接构造 HTTP 报文，是理解协议的活教材' },
      { to: 'tool-json-yaml', desc: '响应是 JSON 时配合 jq/格式化工具查看' },
      { to: 'lc-joint-debugging', desc: '联调中用 curl 隔离前端直接验证接口' },
    ],
    example: `# GET 请求（-i 显示响应头与状态码）
curl -i https://api.example.com/terms/tools

# POST JSON
curl -X POST https://api.example.com/terms \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{"name":"curl","cat":"tools"}'

# 只看状态码，常用于健康检查
curl -s -o /dev/null -w "%{http_code}\\n" https://api.example.com/health

# 调试连接过程 / 下载文件
curl -v https://api.example.com
curl -L -o app.zip https://example.com/app.zip`,
    exampleLang: 'bash',
    interview: '要点：-i/-L/-d/-w 各是什么作用；如何只取状态码做健康检查；-v 输出里能看到 TLS 握手哪些信息。',
  },
  {
    id: 'tool-ssh-key',
    name: 'SSH 密钥与免密登录',
    en: 'SSH Keys',
    cat: 'tools',
    sub: '效率工具',
    tags: ['安全', '远程'],
    summary: 'SSH 密钥用私钥签名代替密码认证：私钥留本机、公钥放服务器，实现更安全也更省事的免密登录。',
    detail: `**是什么**：SSH 密钥是一对非对称密钥：私钥留在本机、公钥放进服务器的 authorized_keys，登录时以签名挑战代替密码——免输密码且更抗暴力破解。

**典型场景**：免密登录云服务器；Git 推拉代码走 SSH 协议；CI 免交互部署。

**核心用法**：\`ssh-keygen -t ed25519 -C "you@mail.com"\` 生成；\`ssh-copy-id user@host\` 上传公钥；\`ssh -i ~/.ssh/id_ed25519 user@host\` 指定私钥；\`~/.ssh/config\` 配 Host 别名与 IdentityFile。

**技巧与坑**：私钥绝不外传，权限必须 600，怀疑泄露立即换新并吊销旧公钥；给私钥设 passphrase 兼顾安全；公钥放服务器、私钥留本机，方向别搞反。`,
    relations: [
      { to: 'sec-asymmetric-encryption', desc: 'SSH 认证是非对称签名的经典应用' },
      { to: 'sec-password-storage', desc: '密钥认证从源头替代弱口令与明文密码' },
      { to: 'tool-remote', desc: 'Git 远程走 SSH 协议时依赖本机密钥' },
    ],
    example: `# 1. 生成密钥对（ed25519，推荐）
ssh-keygen -t ed25519 -C "zq@laptop"
# 私钥 ~/.ssh/id_ed25519（绝不外传），公钥 .pub 可分发

# 2. 上传公钥到服务器，实现免密登录
ssh-copy-id zq@203.0.113.10

# 3. ~/.ssh/config 为常用主机配置别名
#   Host myserver
#     HostName 203.0.113.10
#     User zq
#     IdentityFile ~/.ssh/id_ed25519
ssh myserver            # 之后这样连即可

chmod 600 ~/.ssh/id_ed25519     # 私钥权限必须是 600`,
    exampleLang: 'bash',
    interview: '高频：非对称加密在 SSH 登录中的角色（签名挑战而非传密码）；公钥与私钥各放在哪；authorized_keys 的作用。',
  },
  {
    id: 'tool-json-yaml',
    name: 'JSON 与 YAML',
    en: 'JSON & YAML',
    cat: 'tools',
    sub: '效率工具',
    tags: ['配置', '格式'],
    summary: 'JSON 与 YAML 是两大配置与数据交换格式：JSON 严格机器友好，YAML 靠缩进表达层级、人类友好。',
    detail: `**是什么**：JSON 与 YAML 是最常用的两种配置/数据格式：JSON 语法严格、机器友好，是 API 数据交换的标准；YAML 靠缩进表达层级、支持注释，K8s 与 CI 配置多用。

**典型场景**：API 请求响应用 JSON；CI 流水线、K8s 清单、docker-compose 用 YAML；package.json、tsconfig 用 JSON。

**核心用法**：JSON：键必须双引号、不可注释、尾逗号非法；YAML：缩进即层级（禁 Tab）、\`#\` 注释、\`-\` 列表项；互转可用 yq 或编辑器插件。

**技巧与坑**：YAML 经典"挪威问题"——\`country: no\` 会解析成布尔 false，拿不准就加引号；缩进差一格语义全变，务必开 YAML 校验；JSON 数字与字符串类型敏感。`,
    relations: [
      { to: 'lc-openapi', desc: 'OpenAPI 文档本体就是一份 JSON/YAML' },
      { to: 'tool-curl', desc: 'curl 发 JSON 体是调试 API 的日常组合' },
      { to: 'ops-k8s', desc: 'K8s 的资源清单以 YAML 为主要载体' },
    ],
    example: `同一个配置，两种写法 —— JSON：

{ "server": { "host": "0.0.0.0", "port": 8080 },
  "features": ["search", "quiz"] }

等价的 YAML（缩进即层级，# 可注释）：

server:
  host: 0.0.0.0
  port: 8080
features:
  - search
  - quiz

# YAML 的坑：country: no → 布尔 false！字符串请加引号`,
    exampleLang: 'text',
    interview: '要点：YAML 缩进规则与挪威问题；JSON 为什么不允许注释；两者各自最适合的场景。',
  },
  {
    id: 'tool-markdown',
    name: 'Markdown 文档',
    en: 'Markdown',
    cat: 'tools',
    sub: '效率工具',
    tags: ['文档', '写作'],
    summary: 'Markdown 用纯文本符号写格式文档，GitHub、文档站、聊天框处处渲染，是开发者的通用文档格式。',
    detail: `**是什么**：Markdown 是用纯文本符号书写格式化文档的轻量标记语言：井号成标题、星号成加粗、符号成列表，纯文本好写好存好 diff。

**典型场景**：README 与项目文档；PR 描述与 Issue；API 文档、技术博客、笔记。

**核心用法**：\`#\` 至 \`######\` 六级标题；\`\`\`bash 围栏代码块可指定语言高亮；\`- \`\ 列表、\`> \`\ 引用、\`[文字](链接)\` 超链接；表格用 \`| --- |\` 分隔行。

**技巧与坑**：嵌套列表用统一缩进（2 或 4 空格），混用会断层级；围栏代码块内部不再解析 Markdown，写命令与代码首选它；标题从 # 开始逐级使用，别跳级；GitHub 还扩展了任务列表 - [ ] 与自动链接。`,
    relations: [
      { to: 'lc-api-doc', desc: '接口文档与 README 多以 Markdown 撰写' },
      { to: 'lc-prd', desc: 'PRD 与协作讨论常用 Markdown 书写与渲染' },
      { to: 'tool-code-review-gh', desc: 'PR/Issue 的评论与建议都用 Markdown 格式' },
    ],
    example: `# 项目名（一级标题）

简短介绍，支持 **加粗**、*斜体* 与 \`行内代码\`。

## 快速开始
1. 克隆仓库
2. 运行 \`npm install\`（无序列表用 -，支持嵌套）

\`\`\`bash
npm run dev   # 围栏代码块，可指定语言高亮
\`\`\`

| 术语 | 说明 |
| ---- | ---- |
| PR   | 合并请求 |`,
    exampleLang: 'markdown',
    interview: '要点：围栏代码块与行内代码的区别；GitHub 扩展语法（任务列表、表格、折叠）；为什么技术文档偏好纯文本格式。',
  },
  {
    id: 'tool-terminal-tips',
    name: '终端效率技巧',
    en: 'Terminal Tips',
    cat: 'tools',
    sub: '效率工具',
    tags: ['效率', '终端'],
    summary: '终端技巧是肌肉记忆级的快捷操作：历史搜索、补全、快捷编辑与别名，把常见操作从十秒压到一秒。',
    detail: `**是什么**：终端效率技巧是一组肌肉记忆级的操作：历史搜索、命令补全、光标快捷编辑与别名体系，让高频操作从十秒缩到一秒。

**典型场景**：每天敲上百条命令的日常；长命令反复重用与微调；忘加 sudo 的瞬间补救。

**核心用法**：\`Ctrl+R\` 反向搜索历史；\`!!\` 引用上一条命令（\`sudo !!\`）；\`Ctrl+A/E\` 跳行首行尾，\`Ctrl+W\` 删一词；\`alias gs="git status"\` 建别名；Tab 补全命令、路径与参数，能 Tab 的一律 Tab。

**技巧与坑**：别名写进 ~/.bashrc 或 ~/.zshrc 才能持久；\`sudo !!\` 回车前先看清上一条到底是什么；Ctrl+C 中断当前命令，Ctrl+D 才是退出会话，两者别混。`,
    relations: [
      { to: 'tool-shell-basics', desc: '这些技巧都是 Shell 提供的交互能力' },
      { to: 'tool-git', desc: '为高频 Git 命令配别名是效率提升第一名' },
      { to: 'tool-regex', desc: '历史搜索与日志过滤常配合正则模式' },
    ],
    example: `Ctrl+R  搜历史：输入关键字即可翻出旧命令
Ctrl+A / Ctrl+E   跳到行首 / 行尾
Ctrl+W / Ctrl+U   删一个词 / 删到行首
Tab     补全命令、路径与参数，一切皆可 Tab

!!                 引用上一条命令：忘加 sudo 时用 sudo !!
!git               执行最近一条以 git 开头的命令
cd -               回到上一个目录

# 常用别名（写入 ~/.zshrc 或 ~/.bashrc 持久化）
alias gs="git status"
alias gl="git log --oneline --graph"
alias serve="python3 -m http.server 8000"`,
    exampleLang: 'text',
    interview: '要点：Ctrl+R 历史搜索的用法；别名持久化到哪个文件；!! 与 !$ 各引用什么。',
  },
  {
    id: 'tool-editor-setup',
    name: '编辑器配置与插件',
    en: 'Editor Setup & Extensions',
    cat: 'tools',
    sub: '效率工具',
    tags: ['编辑器', '工程化'],
    summary: '编辑器配置把格式化、Lint 与插件集沉淀为随仓库共享的工程资产，让团队产出一致风格的代码。',
    detail: `**是什么**：编辑器配置把格式化、Lint、快捷键与插件集合沉淀为工程资产：仓库内提交推荐插件与默认设置，新成员克隆即获得统一环境。

**典型场景**：保存即格式化，提交前风格零争议；新成员入职零配置上手。

**核心用法**：提交 .vscode/extensions.json 推荐插件、settings.json 固定默认格式化器；\`editor.codeActionsOnSave\` 保存时自动修复 ESLint 问题；.editorconfig 统一缩进换行。

**技巧与坑**：settings.json 只放团队共识，个人偏好放用户级配置；插件装太多拖慢启动，定期清理；格式化与 Lint 打架时划界——Prettier 管格式、ESLint 管质量。`,
    relations: [
      { to: 'lc-coding-standards', desc: '编辑器配置是编码规范自动化的落点' },
      { to: 'tool-regex', desc: '编辑器全局搜索替换支持正则批量重构' },
      { to: 'tool-npm', desc: 'ESLint/Prettier 等工具链经 npm 安装管理' },
    ],
    example: `// .vscode/settings.json —— 团队共识（随仓库提交）
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }
}

// .vscode/extensions.json —— 推荐插件（打开仓库时提示安装）
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "EditorConfig.EditorConfig"
  ]
}`,
    exampleLang: 'json',
    interview: '要点：工作区配置与用户配置的边界；.editorconfig 与 Prettier 的分工；如何让新成员一键获得推荐插件。',
  },
  {
    id: 'tool-diff-patch',
    name: 'diff 与补丁文件',
    en: 'diff & Patch',
    cat: 'tools',
    sub: '效率工具',
    tags: ['补丁', '文本比较'],
    summary: 'diff 比较文件差异并生成补丁，patch/git apply 把补丁应用到别处，是无 Git 传递改动的标准方式。',
    detail: `**是什么**：diff 比较两个文件的差异并输出统一格式补丁，patch 与 \`git apply\` 可把补丁应用到另一份代码——没有 Git 也能搬运改动。

**典型场景**：把小修复传给无法联网的服务器；邮件补丁流的开源贡献；审查单文件改动。

**核心用法**：\`diff -u old.c new.c > fix.patch\` 生成；\`patch < fix.patch\` 应用；Git 用户 \`git diff > fix.patch\`，对端 \`git apply fix.patch\`；\`--check\` 先试打不落盘，\`-R\` 反向撤销。

**技巧与坑**：补丁靠上下文行匹配，目标文件已改动可能打不上，先 --check 再动手；能用分支或 cherry-pick 传改动时优先 Git，补丁是兜底。`,
    relations: [
      { to: 'tool-log-diff', desc: 'git diff 的输出即可直接作为补丁文件' },
      { to: 'tool-merge', desc: '补丁应用失败的本质类似冲突，需手工适配' },
      { to: 'tool-cherry-pick', desc: '传递单个改动：有 Git 用 cherry-pick，没 Git 用补丁' },
    ],
    example: `# 生成统一格式补丁（-u 附上下文，可读性最好）
diff -u config.old.js config.js > fix.patch

# 应用补丁到同结构的另一份代码
patch config.js < fix.patch
patch -p1 --dry-run < fix.patch   # 先演练，不落盘

# Git 用户更常用：
git diff main..fix/timeout > timeout.patch
git apply --check timeout.patch   # 检查能否干净应用
git apply timeout.patch           # 应用补丁
git apply -R timeout.patch        # 反向撤销补丁`,
    exampleLang: 'bash',
    interview: '要点：补丁靠上下文行匹配定位；git apply --check 的用途；-p1 参数剥路径层级的含义。',
  },
];

