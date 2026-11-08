import type { Level } from '@/types';

/**
 * 知识库工程课程 · 第六章：综合实战（integration，3 关）
 *
 * 提交一段 kb 命令脚本，由本地 PARA 知识库模拟器（src/judge/kb-sim.ts）执行，
 * stdout 与 expected 逐字符比对。输出完全确定（排序按创建序号）。
 *
 * 本章主题：把前五章的零件装配成整机 —— 从零搭建（建库全景）、
 * 一周工作流（捕获→处理→复用→归档的节律）、毕业演练（接管存量团队库并整治汇报）。
 */

const L1_SCRIPT = `# 从零搭建：init → 四区各 2 条 → 补标签 → 接线 → 全景
kb init
kb new 00-inbox/ai-course-idea --title "AI 课程选题灵感"
kb new 00-inbox/reading-queue --title "待读书单：认知科学"
kb new 10-projects/quest-launch --title "智码平台上线方案" --tags "项目,里程碑"
kb new 10-projects/blog-revamp --title "个人博客改版" --tags "项目"
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"
kb new 20-areas/english-daily --title "英语日常维持计划" --tags "学习,英语"
kb new 30-resources/para-guide --title "PARA 方法论详解" --tags "方法论"
kb new 30-resources/zettelkasten-notes --title "卡片盒笔记法入门" --tags "方法论"
# 补标签、接线：让孤立的笔记互相认识
kb tag ai-course-idea 灵感
kb tag reading-queue 灵感
kb link golang-learning para-guide
kb link zettelkasten-notes para-guide
# 全景盘点：标签分布 + 结构 + 指标
kb tags
kb tree
kb stats`;

const L1_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [00-inbox/ai-course-idea] AI 课程选题灵感
已创建 [00-inbox/reading-queue] 待读书单：认知科学
已创建 [10-projects/quest-launch] 智码平台上线方案 #项目 #里程碑
已创建 [10-projects/blog-revamp] 个人博客改版 #项目
已创建 [20-areas/golang-learning] Go 学习体系 #学习 #Go
已创建 [20-areas/english-daily] 英语日常维持计划 #学习 #英语
已创建 [30-resources/para-guide] PARA 方法论详解 #方法论
已创建 [30-resources/zettelkasten-notes] 卡片盒笔记法入门 #方法论
已为 [00-inbox/ai-course-idea] 追加标签 #灵感
已为 [00-inbox/reading-queue] 追加标签 #灵感
已链接 Go 学习体系 ↔ PARA 方法论详解
已链接 卡片盒笔记法入门 ↔ PARA 方法论详解
#方法论 (2)
#灵感 (2)
#项目 (2)
#学习 (2)
#里程碑 (1)
#英语 (1)
#Go (1)
00-inbox/ (2)
  ai-course-idea.md
  reading-queue.md
10-projects/ (2)
  quest-launch.md
  blog-revamp.md
20-areas/ (2)
  golang-learning.md
  english-daily.md
30-resources/ (2)
  para-guide.md
  zettelkasten-notes.md
40-archive/ (0)
笔记总数：8
  00-inbox: 2
  10-projects: 2
  20-areas: 2
  30-resources: 2
  40-archive: 0
双向链接：2 对`;

const L2_SCRIPT = `kb init
# —— Day 1 捕获：想到什么先进收件箱 ——
kb new 00-inbox/rust-notes --title "Rust 入门笔记"
kb new 00-inbox/api-design --title "API 设计要点速记"
kb new 00-inbox/interview-prep --title "秋招面试冲刺计划"
# —— Day 2 处理：打标签、建链接、归位，inbox 清零 ——
kb tag rust-notes 学习
kb tag api-design 后端
kb tag interview-prep 求职
kb link rust-notes api-design
kb move rust-notes 20-areas
kb move api-design 30-resources
kb move interview-prep 10-projects
# —— Day 3 复用：要用时找得到、连得着 ——
kb search 设计
kb search 学习
kb backlinks api-design
# —— Day 5 归档：完结的事退出视野 ——
kb archive interview-prep
kb stats`;

const L2_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [00-inbox/rust-notes] Rust 入门笔记
已创建 [00-inbox/api-design] API 设计要点速记
已创建 [00-inbox/interview-prep] 秋招面试冲刺计划
已为 [00-inbox/rust-notes] 追加标签 #学习
已为 [00-inbox/api-design] 追加标签 #后端
已为 [00-inbox/interview-prep] 追加标签 #求职
已链接 Rust 入门笔记 ↔ API 设计要点速记
已移动：Rust 入门笔记（00-inbox → 20-areas）
已移动：API 设计要点速记（00-inbox → 30-resources）
已移动：秋招面试冲刺计划（00-inbox → 10-projects）
找到 1 条：
[30-resources/api-design] API 设计要点速记 #后端
找到 1 条：
[20-areas/rust-notes] Rust 入门笔记 #学习
'API 设计要点速记' 的反向链接（1）：
  [20-areas/rust-notes] Rust 入门笔记
已归档：秋招面试冲刺计划（10-projects → 40-archive）
笔记总数：3
  00-inbox: 0
  10-projects: 0
  20-areas: 1
  30-resources: 1
  40-archive: 1
双向链接：1 对`;

const L3_SCRIPT = `kb init
# —— 第 1 步 接手现状：重建 6 条存量笔记（docker-cookbook 故意放错分区）——
kb new 00-inbox/legacy-standup --title "旧站会纪要：3 月架构评审"
kb new 10-projects/pay-refactor --title "支付系统重构" --tags "项目"
kb new 10-projects/docker-cookbook --title "Docker 实战手册" --tags "运维"
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"
kb new 30-resources/mysql-cookbook --title "MySQL 实战手册" --tags "数据库"
kb new 30-resources/redis-cookbook --title "Redis 实战手册" --tags "数据库"
# —— 第 2 步 摸底：清单、结构、检索、孤岛检查 ——
kb list
kb tree
kb search 手册
kb backlinks golang-learning
# —— 第 3 步 整治：归位、补标签、补链接 ——
kb move docker-cookbook 30-resources
kb tag golang-learning 后端
kb tag mysql-cookbook 后端
kb link golang-learning mysql-cookbook
kb link pay-refactor mysql-cookbook
# —— 第 4 步 清理：过期内容归档 ——
kb archive legacy-standup
# —— 第 5 步 增值：建两条 MOC 当目录页 ——
kb new 30-resources/moc-backend --title "MOC：后端知识地图" --tags "MOC"
kb link moc-backend golang-learning
kb link moc-backend mysql-cookbook
kb link moc-backend redis-cookbook
kb new 20-areas/moc-devops --title "MOC：运维知识地图" --tags "MOC"
kb link moc-devops docker-cookbook
kb backlinks docker-cookbook
# —— 第 6 步 汇报：标签分布 + 全景指标 ——
kb tags
kb stats`;

const L3_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [00-inbox/legacy-standup] 旧站会纪要：3 月架构评审
已创建 [10-projects/pay-refactor] 支付系统重构 #项目
已创建 [10-projects/docker-cookbook] Docker 实战手册 #运维
已创建 [20-areas/golang-learning] Go 学习体系 #学习 #Go
已创建 [30-resources/mysql-cookbook] MySQL 实战手册 #数据库
已创建 [30-resources/redis-cookbook] Redis 实战手册 #数据库
[00-inbox/legacy-standup] 旧站会纪要：3 月架构评审
[10-projects/pay-refactor] 支付系统重构 #项目
[10-projects/docker-cookbook] Docker 实战手册 #运维
[20-areas/golang-learning] Go 学习体系 #学习 #Go
[30-resources/mysql-cookbook] MySQL 实战手册 #数据库
[30-resources/redis-cookbook] Redis 实战手册 #数据库
00-inbox/ (1)
  legacy-standup.md
10-projects/ (2)
  pay-refactor.md
  docker-cookbook.md
20-areas/ (1)
  golang-learning.md
30-resources/ (2)
  mysql-cookbook.md
  redis-cookbook.md
40-archive/ (0)
找到 3 条：
[10-projects/docker-cookbook] Docker 实战手册 #运维
[30-resources/mysql-cookbook] MySQL 实战手册 #数据库
[30-resources/redis-cookbook] Redis 实战手册 #数据库
'Go 学习体系' 暂无反向链接
已移动：Docker 实战手册（10-projects → 30-resources）
已为 [20-areas/golang-learning] 追加标签 #后端
已为 [30-resources/mysql-cookbook] 追加标签 #后端
已链接 Go 学习体系 ↔ MySQL 实战手册
已链接 支付系统重构 ↔ MySQL 实战手册
已归档：旧站会纪要：3 月架构评审（00-inbox → 40-archive）
已创建 [30-resources/moc-backend] MOC：后端知识地图 #MOC
已链接 MOC：后端知识地图 ↔ Go 学习体系
已链接 MOC：后端知识地图 ↔ MySQL 实战手册
已链接 MOC：后端知识地图 ↔ Redis 实战手册
已创建 [20-areas/moc-devops] MOC：运维知识地图 #MOC
已链接 MOC：运维知识地图 ↔ Docker 实战手册
'Docker 实战手册' 的反向链接（1）：
  [20-areas/moc-devops] MOC：运维知识地图
#后端 (2)
#数据库 (2)
#MOC (2)
#项目 (1)
#学习 (1)
#运维 (1)
#Go (1)
笔记总数：8
  00-inbox: 0
  10-projects: 1
  20-areas: 2
  30-resources: 4
  40-archive: 1
双向链接：6 对`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'kb-integration-1',
  lang: 'kb',
  module: 'integration',
  order: 1,
  title: '从零搭建个人知识库',
  difficulty: 4,
  xp: 35,
  goals: [
    '综合运用 init / new / tag / link 完成一次完整建库',
    '掌握建库顺序：先分区入住、再贴标签、后接线成网',
    '会用 tags + tree + stats 对知识库做全景盘点',
  ],
  brief: `## 综合实战：从零搭起你的知识库

前三章学的是零件，这一章开始装配整机。从零搭一个能用的知识库，流程固定四步：

- **圈地**：\`kb init\` 立起 PARA 五区，地基一次到位；
- **入住**：四个分区各放两条真实笔记 —— inbox 存灵感、projects 放进行中的事、areas 是长期领域、resources 收参考资料；
- **贴标签**：创建时 \`--tags\` 与事后 \`kb tag\` 互补，主题维度立起来；
- **接线**：\`kb link\` 把相关的笔记连起来，孤岛不成网络。

最后 \`kb tags\` 看主题分布、\`kb tree\` 看结构、\`kb stats\` 看指标 —— 结构对、指标健康，知识库才算"建成"。

类比：**搬家布置** —— 先隔好房间（分区），再把东西搬进对应房间、贴上标签，最后把电线（链接）接通，灯亮了才算真的入住。

> 💡 建库最难的不是命令而是克制：宁可 8 条真实笔记，也不要 80 条囤积。`,
  task: `## 任务：从零搭一个 8 条笔记的知识库

1. \`kb init\`；
2. 00-inbox 两条灵感：ai-course-idea（"AI 课程选题灵感"）、reading-queue（"待读书单：认知科学"），创建时不带标签；
3. 10-projects 两条：quest-launch（"智码平台上线方案"，标签 项目,里程碑）、blog-revamp（"个人博客改版"，标签 项目）；
4. 20-areas 两条：golang-learning（"Go 学习体系"，标签 学习,Go）、english-daily（"英语日常维持计划"，标签 学习,英语）；
5. 30-resources 两条：para-guide（"PARA 方法论详解"，标签 方法论）、zettelkasten-notes（"卡片盒笔记法入门"，标签 方法论）；
6. \`kb tag\` 给两条 inbox 笔记各补"灵感"标签；
7. \`kb link golang-learning para-guide\`、\`kb link zettelkasten-notes para-guide\` —— 两条链接都汇到 para-guide；
8. \`kb tags\` → \`kb tree\` → \`kb stats\` 全景盘点（8 条笔记、双向链接 2 对）。`,
  starter: `# 第 1 关：从零搭建个人知识库

# TODO 1: 初始化 PARA 五区

# TODO 2: 00-inbox 建两条灵感笔记（ai-course-idea / reading-queue，不带标签）

# TODO 3: 10-projects 建两条项目笔记（quest-launch / blog-revamp，标签见任务）

# TODO 4: 20-areas 建两条领域笔记（golang-learning / english-daily）

# TODO 5: 30-resources 建两条资源笔记（para-guide / zettelkasten-notes）

# TODO 6: 用 kb tag 给两条 inbox 笔记补"灵感"标签

# TODO 7: 建两条链接，都指向 para-guide

# TODO 8: kb tags + kb tree + kb stats 全景盘点`,
  solution: L1_SCRIPT,
  hints: [
    '八条 kb new 按分区顺序写：inbox 两条不带标签，其余六条用 --tags 带标签；slug 必须与任务一致。',
    'kb tag 每次只加一个标签：给 ai-course-idea 和 reading-queue 各加"灵感"；kb link 一次即双向，两条都连向 para-guide。',
    'kb tags 四个标签各 2 次（方法论/灵感/项目/学习，按名称序），里程碑/英语/Go 各 1 次；stats 里五区 2/2/2/2/0、双向链接 2 对。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'kb-integration-2',
  lang: 'kb',
  module: 'integration',
  order: 2,
  title: '一周知识工作流',
  difficulty: 4,
  xp: 35,
  goals: [
    '把捕获、处理、复用、归档串成一周工作流',
    '掌握"inbox 定期清零"的日常处理节奏：tag + link + move',
    '体会知识复用：search 找得到、backlinks 顺藤摸瓜',
  ],
  brief: `## 一周知识工作流：知识库的心跳节律

知识库不是建完就完事，它靠**每周节律**活着。这一关把工作日的动作串成完整循环：

- **Day 1 捕获**：想到什么先扔进 00-inbox，不打断手头的事；
- **Day 2 处理**：给每条收件箱笔记 \`kb tag\` 打标签、\`kb link\` 建连接、\`kb move\` 归位到正式分区 —— 收件箱清零；
- **Day 3 复用**：要用时 \`kb search\` 找到它、\`kb backlinks\` 顺藤摸瓜找到它的邻居 —— 存进去的知识第一次产生回报；
- **Day 5 归档**：完结的事 \`kb archive\` 退出视野。

四个动作合起来就是知识库的呼吸：吸入（捕获）、消化（处理）、供能（复用）、代谢（归档）。

类比：**洗衣机** —— 脏衣服先进篮（捕获），定期洗（处理），穿的时候伸手就拿（复用），穿旧了收进柜子（归档）。

> 💡 节律比强度重要：每天 5 分钟的捕获加每周一次的处理，胜过一年一次的大扫除。`,
  task: `## 任务：跑完一周的知识循环

1. \`kb init\`；
2. **Day 1 捕获**：00-inbox 三条 —— rust-notes（"Rust 入门笔记"）、api-design（"API 设计要点速记"）、interview-prep（"秋招面试冲刺计划"）；
3. **Day 2 处理**：三条各补一个标签（学习 / 后端 / 求职）；\`kb link rust-notes api-design\`；三条分别 \`kb move\` 到 20-areas / 30-resources / 10-projects；
4. **Day 3 复用**：\`kb search 设计\` 与 \`kb search 学习\` 各命中一条；\`kb backlinks api-design\` 顺藤摸瓜；
5. **Day 5 归档**：\`kb archive interview-prep\`，再 \`kb stats\` 检视（3 条笔记、双向链接 1 对、五区 0/0/1/1/1）。`,
  starter: `# 第 2 关：一周知识工作流

# TODO 1: 初始化

# TODO 2: Day 1 捕获——00-inbox 三条（rust-notes / api-design / interview-prep）

# TODO 3: Day 2 处理——三条各补一个标签（学习 / 后端 / 求职）

# TODO 4: Day 2 处理——kb link rust-notes api-design

# TODO 5: Day 2 处理——三条分别 move 到 20-areas / 30-resources / 10-projects

# TODO 6: Day 3 复用——search 设计 与 search 学习

# TODO 7: Day 3 复用——backlinks api-design

# TODO 8: Day 5 归档——archive interview-prep 后 kb stats`,
  solution: L2_SCRIPT,
  hints: [
    'Day 1 三条都建在 00-inbox 且不带标签；Day 2 先 kb tag 补标签、kb link 建连接，再三次 kb move 归位。',
    'move 的去向：rust-notes → 20-areas、api-design → 30-resources、interview-prep → 10-projects；输出里带着旧分区与新分区。',
    'search 设计 只命中 api-design（标题含"设计"），search 学习 只命中 rust-notes（标签 #学习）；backlinks 显示 20-areas 的 rust-notes 指向 api-design；归档后 stats 五区为 0/0/1/1/1。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'kb-integration-3',
  lang: 'kb',
  module: 'integration',
  order: 3,
  title: '毕业演练：团队知识库接管',
  difficulty: 5,
  xp: 45,
  goals: [
    '掌握接手存量知识库的摸底方法：list / tree / search / backlinks',
    '完成存量整治闭环：归位、补标签、补链接、归档过期',
    '用 MOC 与 stats 交付一份可汇报的知识库全景',
  ],
  brief: `## 毕业演练：接管一个真实的团队知识库

真实工作里，你接手的库往往长这样：前任留下一堆存量笔记 —— 有放错分区的、没打标签的、彼此孤立没有链接的、早已过期的。你要做的不是推倒重来，而是一次系统整治：

- **摸底**：\`kb list\` 看资产清单、\`kb tree\` 看结构、\`kb search\` 验证可检索性、\`kb backlinks\` 找出孤岛；
- **整治**：放错的 \`kb move\` 归位，缺标签的 \`kb tag\` 补上，孤岛之间 \`kb link\` 连起来；
- **清理**：过期的 \`kb archive\`，让活跃分区只剩"正在呼吸"的内容；
- **增值**：建两条 MOC 当目录页，新人顺着反向链接就能入门；最后 \`kb tags\` + \`kb stats\` 汇报全局。

类比：**接管旧图书馆** —— 不搬新馆，先编目、修补、下架过期书，再挂上导览图。

> 💡 接手比新建更常见：能把别人的库整治健康，才算真的会知识管理。`,
  task: `## 任务：接手团队库并完成整治汇报

1. \`kb init\` 后重建 6 条存量：legacy-standup（00-inbox，"旧站会纪要：3 月架构评审"，无标签）、pay-refactor（10-projects，标签 项目）、docker-cookbook（10-projects —— **故意放错**，标签 运维）、golang-learning（20-areas，标签 学习,Go）、mysql-cookbook（30-resources，标签 数据库）、redis-cookbook（30-resources，标签 数据库）；
2. **摸底**：\`kb list\` + \`kb tree\` 看结构；\`kb search 手册\` 应命中三条手册；\`kb backlinks golang-learning\` 确认它是孤岛；
3. **整治**：\`kb move docker-cookbook 30-resources\`；给 golang-learning、mysql-cookbook 补 #后端 标签；\`kb link golang-learning mysql-cookbook\`、\`kb link pay-refactor mysql-cookbook\`；
4. **清理**：\`kb archive legacy-standup\`；
5. **增值**：\`kb new 30-resources/moc-backend --title "MOC：后端知识地图" --tags "MOC"\` 并依次 link 到 golang-learning / mysql-cookbook / redis-cookbook；\`kb new 20-areas/moc-devops --title "MOC：运维知识地图" --tags "MOC"\` 并 link 到 docker-cookbook；\`kb backlinks docker-cookbook\` 验证能回到 MOC；
6. **汇报**：\`kb tags\`（#后端/#数据库/#MOC 各 2 次）+ \`kb stats\`（8 条、五区 0/1/2/4/1、双向链接 6 对）。`,
  starter: `# 第 3 关：毕业演练——团队知识库接管

# TODO 1: 初始化

# TODO 2: 重建 6 条存量笔记（见任务清单，注意 docker-cookbook 故意放错分区）

# TODO 3: 摸底——kb list + kb tree + kb search 手册 + kb backlinks golang-learning

# TODO 4: 整治——move 归位 docker-cookbook，再补两个 #后端 标签

# TODO 5: 整治——两条 kb link 补链接

# TODO 6: 清理——archive 过期的 legacy-standup

# TODO 7: 增值——创建 moc-backend 并链到三条后端笔记

# TODO 8: 增值——创建 moc-devops 并链到 docker-cookbook，再 backlinks 验证

# TODO 9: 汇报——kb tags + kb stats`,
  solution: L3_SCRIPT,
  hints: [
    '六条存量按任务清单原样重建：docker-cookbook 故意建在 10-projects；kb search 手册 命中三条手册；backlinks 显示 Go 学习体系 暂无反向链接。',
    '整治顺序：先 move 归位，再补 #后端 标签，再补链接；moc-backend 要与 golang-learning / mysql-cookbook / redis-cookbook 各链一次。',
    'kb tags 前三行是 #后端 (2)、#数据库 (2)、#MOC (2)（同为 2 次按名称序）；stats 五区 0/1/2/4/1、双向链接 6 对 —— 汇报数字与输出一致才算整治完成。',
  ],
  tests: tests(L3_EXPECTED),
};

export const KB_INTEGRATION: Level[] = [L1, L2, L3];
