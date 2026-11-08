import type { Level } from '@/types';

/**
 * 知识库工程课程 · 第五章：规范与工作流（best，3 关）
 *
 * 提交一段 kb 命令脚本，由本地 PARA 知识库模拟器（src/judge/kb-sim.ts）执行，
 * stdout 与 expected 逐字符比对。输出完全确定（排序按创建序号）。
 *
 * 本章主题：把知识库用"久"的纪律 —— slug 命名规范（一次性决策）、
 * MOC 内容地图（主题目录页）、每周维护例程（15 分钟保鲜周期）。
 */

const L1_SCRIPT = `kb init
kb new 20-areas/golang-concurrency --title "Go 并发编程笔记" --tags "Go,并发"
kb new 30-resources/mysql-index-optimization --title "MySQL 索引优化指南" --tags "MySQL,数据库"
kb new 00-inbox/zzz-001 --title "笔记"
kb search 索引
kb search golang
kb search 笔记
kb link golang-concurrency mysql-index-optimization
kb backlinks mysql-index-optimization
kb tree`;

const L1_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [20-areas/golang-concurrency] Go 并发编程笔记 #Go #并发
已创建 [30-resources/mysql-index-optimization] MySQL 索引优化指南 #MySQL #数据库
已创建 [00-inbox/zzz-001] 笔记
找到 1 条：
[30-resources/mysql-index-optimization] MySQL 索引优化指南 #MySQL #数据库
未找到与 'golang' 相关的笔记
找到 2 条：
[20-areas/golang-concurrency] Go 并发编程笔记 #Go #并发
[00-inbox/zzz-001] 笔记
已链接 Go 并发编程笔记 ↔ MySQL 索引优化指南
'MySQL 索引优化指南' 的反向链接（1）：
  [20-areas/golang-concurrency] Go 并发编程笔记
00-inbox/ (1)
  zzz-001.md
10-projects/ (0)
20-areas/ (1)
  golang-concurrency.md
30-resources/ (1)
  mysql-index-optimization.md
40-archive/ (0)`;

const L2_SCRIPT = `kb init
kb new 20-areas/moc-backend-roadmap --title "MOC：后端学习路线" --tags "MOC,后端"
kb new 20-areas/golang-concurrency --title "Go 并发编程笔记" --tags "Go"
kb new 20-areas/golang-goroutine --title "Goroutine 调度原理" --tags "Go"
kb new 30-resources/mysql-index-optimization --title "MySQL 索引优化指南" --tags "MySQL"
kb new 30-resources/redis-cache-patterns --title "Redis 缓存模式集锦" --tags "Redis"
kb new 30-resources/docker-basics --title "Docker 基础入门" --tags "Docker"
kb search MOC
kb link moc-backend-roadmap golang-concurrency
kb link moc-backend-roadmap golang-goroutine
kb link moc-backend-roadmap mysql-index-optimization
kb link moc-backend-roadmap redis-cache-patterns
kb link moc-backend-roadmap docker-basics
kb backlinks golang-concurrency
kb backlinks golang-goroutine
kb backlinks mysql-index-optimization
kb backlinks redis-cache-patterns
kb backlinks docker-basics
kb backlinks moc-backend-roadmap
kb stats`;

const L2_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [20-areas/moc-backend-roadmap] MOC：后端学习路线 #MOC #后端
已创建 [20-areas/golang-concurrency] Go 并发编程笔记 #Go
已创建 [20-areas/golang-goroutine] Goroutine 调度原理 #Go
已创建 [30-resources/mysql-index-optimization] MySQL 索引优化指南 #MySQL
已创建 [30-resources/redis-cache-patterns] Redis 缓存模式集锦 #Redis
已创建 [30-resources/docker-basics] Docker 基础入门 #Docker
找到 1 条：
[20-areas/moc-backend-roadmap] MOC：后端学习路线 #MOC #后端
已链接 MOC：后端学习路线 ↔ Go 并发编程笔记
已链接 MOC：后端学习路线 ↔ Goroutine 调度原理
已链接 MOC：后端学习路线 ↔ MySQL 索引优化指南
已链接 MOC：后端学习路线 ↔ Redis 缓存模式集锦
已链接 MOC：后端学习路线 ↔ Docker 基础入门
'Go 并发编程笔记' 的反向链接（1）：
  [20-areas/moc-backend-roadmap] MOC：后端学习路线
'Goroutine 调度原理' 的反向链接（1）：
  [20-areas/moc-backend-roadmap] MOC：后端学习路线
'MySQL 索引优化指南' 的反向链接（1）：
  [20-areas/moc-backend-roadmap] MOC：后端学习路线
'Redis 缓存模式集锦' 的反向链接（1）：
  [20-areas/moc-backend-roadmap] MOC：后端学习路线
'Docker 基础入门' 的反向链接（1）：
  [20-areas/moc-backend-roadmap] MOC：后端学习路线
'MOC：后端学习路线' 的反向链接（5）：
  [20-areas/golang-concurrency] Go 并发编程笔记
  [20-areas/golang-goroutine] Goroutine 调度原理
  [30-resources/mysql-index-optimization] MySQL 索引优化指南
  [30-resources/redis-cache-patterns] Redis 缓存模式集锦
  [30-resources/docker-basics] Docker 基础入门
笔记总数：6
  00-inbox: 0
  10-projects: 0
  20-areas: 3
  30-resources: 3
  40-archive: 0
双向链接：5 对`;

const L3_SCRIPT = `kb init
kb new 00-inbox/go-channel-notes --title "Go channel 使用笔记"
kb new 00-inbox/meeting-api-review --title "周会纪要：API 评审"
kb new 10-projects/quest-launch --title "智码平台上线方案" --tags "项目"
kb new 10-projects/blog-revamp --title "个人博客改版" --tags "项目"
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习"
kb tag go-channel-notes Go
kb tag meeting-api-review 工作纪要
kb link go-channel-notes golang-learning
kb link meeting-api-review quest-launch
kb move go-channel-notes 20-areas
kb move meeting-api-review 10-projects
kb archive blog-revamp
kb stats
kb tree`;

const L3_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [00-inbox/go-channel-notes] Go channel 使用笔记
已创建 [00-inbox/meeting-api-review] 周会纪要：API 评审
已创建 [10-projects/quest-launch] 智码平台上线方案 #项目
已创建 [10-projects/blog-revamp] 个人博客改版 #项目
已创建 [20-areas/golang-learning] Go 学习体系 #学习
已为 [00-inbox/go-channel-notes] 追加标签 #Go
已为 [00-inbox/meeting-api-review] 追加标签 #工作纪要
已链接 Go channel 使用笔记 ↔ Go 学习体系
已链接 周会纪要：API 评审 ↔ 智码平台上线方案
已移动：Go channel 使用笔记（00-inbox → 20-areas）
已移动：周会纪要：API 评审（00-inbox → 10-projects）
已归档：个人博客改版（10-projects → 40-archive）
笔记总数：5
  00-inbox: 0
  10-projects: 2
  20-areas: 2
  30-resources: 0
  40-archive: 1
双向链接：2 对
00-inbox/ (0)
10-projects/ (2)
  meeting-api-review.md
  quest-launch.md
20-areas/ (2)
  go-channel-notes.md
  golang-learning.md
30-resources/ (0)
40-archive/ (1)
  blog-revamp.md`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'kb-best-1',
  lang: 'kb',
  module: 'best',
  order: 1,
  title: 'slug 命名规范：门牌号纪律',
  difficulty: 3,
  xp: 25,
  goals: [
    '理解 slug 是不可轻易变更的稳定标识：kebab-case + 语义化',
    '认清 search 的匹配范围：标题/正文/标签，不索引 slug',
    '体会乱命名的代价：检索噪声与不可读的链接',
  ],
  brief: `## slug：知识库的门牌号

标题会改、分区会迁，唯独 slug 被链接引用后不能轻易换 —— 起名是**一次性决策**。两条纪律：

- **kebab-case**：全小写加连字符（golang-concurrency），不混空格与下划线；
- **语义化**：望文生义（mysql-index-optimization），三个月后也知指向；zzz-001 连自己都迷路。

分工要分清：slug 管**链接可读性**，标题与标签管**检索命中率** —— search 不索引 slug。

类比：**门牌号与招牌** —— slug 是门牌号（规范、唯一），标题是招牌（醒目、含关键词）。

> 💡 建笔记前先 search 主题词：能找到就 link 过去，找不到再起新 slug。`,
  task: `## 任务：规范命名 vs 乱起名

1. \`kb init\`；
2. \`kb new 20-areas/golang-concurrency --title "Go 并发编程笔记" --tags "Go,并发"\`；
3. \`kb new 30-resources/mysql-index-optimization --title "MySQL 索引优化指南" --tags "MySQL,数据库"\`；
4. \`kb new 00-inbox/zzz-001 --title "笔记"\` —— **故意乱起名**：slug 无语义、标题笼统；
5. \`kb search 索引\` —— 语义命名，精确命中 1 条；
6. \`kb search golang\` —— 未找到！slug 不进搜索索引；
7. \`kb search 笔记\` —— 笼统标题制造噪声：命中 2 条，其中一条毫无信息量；
8. \`kb link golang-concurrency mysql-index-optimization\` 后 \`kb backlinks mysql-index-optimization\` —— 规范 slug 让链接一眼可读；
9. \`kb tree\` —— zzz-001 躺在收件箱里无人认领。`,
  starter: `# 第 1 关：slug 命名规范

# TODO 1: 初始化

# TODO 2: 创建 golang-concurrency（20-areas，标题/标签见任务）

# TODO 3: 创建 mysql-index-optimization（30-resources）

# TODO 4: 创建乱起名的 zzz-001（00-inbox，标题就叫"笔记"）

# TODO 5: 三次 kb search（索引 / golang / 笔记），观察命中差异

# TODO 6: link 两条规范笔记 + backlinks 验证

# TODO 7: kb tree 收尾`,
  solution: L1_SCRIPT,
  hints: [
    'search 只匹配标题、正文、标签，不索引 slug —— 所以 kb search golang 找不到 golang-concurrency。',
    'kb search 笔记 命中两条：Go 并发编程笔记（标题含"笔记"）和 zzz-001（标题就叫"笔记"）—— 笼统命名制造检索噪声。',
    'backlinks 首行格式："标题\' 的反向链接（N）："，每条两空格缩进 [分区/slug] 标题。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'kb-best-2',
  lang: 'kb',
  module: 'best',
  order: 2,
  title: 'MOC：内容地图',
  difficulty: 4,
  xp: 30,
  goals: [
    '掌握 MOC（Map of Content）模式：一条索引笔记挂载一个主题',
    '用 kb link 把 5 条具体知识挂到 MOC 之下',
    '用 backlinks 验证：从任何叶子都能反查回 MOC',
  ],
  brief: `## MOC：知识库的目录页

笔记一多，最贵的成本变成"找"—— 明明记得写过 Goroutine 调度，却想不起它的 slug。MOC（Map of Content，内容地图）是解法：为某主题建一条**索引笔记**，用 kb link 把主题下的具体知识逐条挂上去。

此后从任何一条知识出发 backlinks 都能反查回 MOC；而 MOC 自己的反向链接会列出全部成员 —— 打开这页目录，全主题尽收眼底。Zettelkasten 实践里，MOC 正是把笔记堆升维成知识网络的枢纽节点。

类比：**机场枢纽** —— 小城之间未必有直达航线，但都能飞到枢纽再中转；MOC 就是主题航线的中枢站。

> 💡 MOC 贵在维护：每次添新笔记，顺手回 MOC 补一条 link，目录页才不过期。`,
  task: `## 任务：搭建后端 MOC

1. \`kb init\`；
2. 建 1 条 MOC：\`kb new 20-areas/moc-backend-roadmap --title "MOC：后端学习路线" --tags "MOC,后端"\`；
3. 建 5 条具体知识：golang-concurrency、golang-goroutine 放 20-areas，mysql-index-optimization、redis-cache-patterns、docker-basics 放 30-resources（标题/标签见 solution）；
4. \`kb search MOC\` —— 检索直达目录页；
5. 5 条 \`kb link moc-backend-roadmap <slug>\` —— 逐条挂到 MOC 下；
6. 对 5 条具体知识逐条 \`kb backlinks\` —— 每条都指回 MOC；
7. \`kb backlinks moc-backend-roadmap\` —— MOC 自己的反向链接列出全部 5 条成员；
8. \`kb stats\` —— 双向链接 5 对。`,
  starter: `# 第 2 关：MOC 内容地图

# TODO 1: 初始化

# TODO 2: 创建 MOC 笔记 moc-backend-roadmap（20-areas）

# TODO 3: 创建 5 条具体知识（2 条在 20-areas、3 条在 30-resources）

# TODO 4: kb search MOC 确认目录页可被检索

# TODO 5: 5 条 kb link 把 MOC 与 5 条知识逐条相连

# TODO 6: 对 5 条知识逐条 backlinks（都应指回 MOC）

# TODO 7: backlinks MOC 本身 + kb stats 收尾`,
  solution: L2_SCRIPT,
  hints: [
    'MOC 也是一条普通笔记：先 kb new 创建，再用 5 条 kb link 与 5 条知识相连 —— link 是双向的，连一次即可。',
    '对具体知识 backlinks：每条反向链接都是 1，指向 [20-areas/moc-backend-roadmap] MOC：后端学习路线。',
    'MOC 自身 backlinks 显示 5 条（互为反向），stats 显示 双向链接：5 对 —— 叶子都挂在枢纽之下。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'kb-best-3',
  lang: 'kb',
  module: 'best',
  order: 3,
  title: '每周维护例程',
  difficulty: 4,
  xp: 30,
  goals: [
    '演练每周维护四步：清 inbox → 归位 → 归档 → 检视',
    '组合运用 tag / link / move / archive / stats / tree',
    '建立"固定节奏维护"的习惯：知识库死于只存不理',
  ],
  brief: `## 每周 15 分钟：知识库的保养周期

知识库死于"只存不理"。保鲜不靠意志力，靠固定例程 —— **每周 15 分钟**，三步：

- **清收件箱**：00-inbox 的暂记逐条 kb tag 补标签、kb link 建连接、kb move 归位 —— 收件箱是缓冲区不是仓库；
- **归档完结**：做完的项目 kb archive，项目区只留"正在呼吸"的事；
- **stats + tree 检视**：inbox 是否清零、archive 是否在增长、有无明显放错。

类比：**汽车保养** —— 不做也能开，但积攒的小问题终会在某天一起爆发；每周换机油，远便宜过大修发动机。

> 💡 把维护写进日历（如每周五下午 15 分钟）：固定节奏远比"有空再做"可靠。`,
  task: `## 任务：本周的 15 分钟维护

1. \`kb init\`，建 5 条初始库存：00-inbox 两条（go-channel-notes、meeting-api-review）、10-projects 两条（quest-launch、blog-revamp）、20-areas 一条（golang-learning），标题/标签见 solution；
2. \`kb tag go-channel-notes Go\`、\`kb tag meeting-api-review 工作纪要\` —— 补元数据；
3. \`kb link go-channel-notes golang-learning\`、\`kb link meeting-api-review quest-launch\` —— 建连接；
4. \`kb move go-channel-notes 20-areas\`、\`kb move meeting-api-review 10-projects\` —— inbox 清零；
5. \`kb archive blog-revamp\` —— 完结项目归档；
6. \`kb stats\` + \`kb tree\` —— 周末检视：五区 0/2/2/0/1，总数 5，双向链接 2 对。`,
  starter: `# 第 3 关：每周维护例程

# TODO 1: 初始化，并建 5 条初始库存（inbox 两条 / projects 两条 / areas 一条）

# TODO 2: 给两条 inbox 笔记补标签（Go / 工作纪要）

# TODO 3: 两条 kb link 建连接（channel→学习体系，纪要→上线方案）

# TODO 4: 两条 kb move 归位，inbox 清零

# TODO 5: 归档完结的 blog-revamp

# TODO 6: kb stats + kb tree 周末检视`,
  solution: L3_SCRIPT,
  hints: [
    '维护顺序建议 tag → link → move → archive → stats，对应"处理 → 归位 → 归档 → 检视"四步。',
    'move/archive 后 tree 按创建序列出文件：10-projects 里 meeting-api-review 创建早于 quest-launch，排在前。',
    '最终 stats：笔记总数 5，五区 0/2/2/0/1，双向链接 2 对；tree 里 40-archive 有 blog-revamp.md。',
  ],
  tests: tests(L3_EXPECTED),
};

export const KB_BEST: Level[] = [L1, L2, L3];
