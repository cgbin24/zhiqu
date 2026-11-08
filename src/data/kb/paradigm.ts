import type { Level } from '@/types';

/**
 * 知识库工程课程 · 第二章：记录与链接（paradigm，4 关）
 *
 * 提交一段 kb 命令脚本，由本地 PARA 知识库模拟器（src/judge/kb-sim.ts）执行，
 * stdout 与 expected 逐字符比对。输出完全确定（排序按创建序号）。
 */

const L1_SCRIPT = `kb init
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"
kb new 30-resources/goroutine-guide --title "Goroutine 调度详解" --tags "Go,并发"
kb new 30-resources/memory-model --title "Go 内存模型" --tags "Go,底层"
kb link golang-learning goroutine-guide
kb link goroutine-guide memory-model
kb backlinks golang-learning
kb backlinks goroutine-guide
kb backlinks memory-model
kb stats`;

const L1_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [20-areas/golang-learning] Go 学习体系 #学习 #Go
已创建 [30-resources/goroutine-guide] Goroutine 调度详解 #Go #并发
已创建 [30-resources/memory-model] Go 内存模型 #Go #底层
已链接 Go 学习体系 ↔ Goroutine 调度详解
已链接 Goroutine 调度详解 ↔ Go 内存模型
'Go 学习体系' 的反向链接（1）：
  [30-resources/goroutine-guide] Goroutine 调度详解
'Goroutine 调度详解' 的反向链接（2）：
  [20-areas/golang-learning] Go 学习体系
  [30-resources/memory-model] Go 内存模型
'Go 内存模型' 的反向链接（1）：
  [30-resources/goroutine-guide] Goroutine 调度详解
笔记总数：3
  00-inbox: 0
  10-projects: 0
  20-areas: 1
  30-resources: 2
  40-archive: 0
双向链接：2 对`;

const L2_SCRIPT = `kb init
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"
kb new 30-resources/goroutine-guide --title "Goroutine 调度详解" --tags "Go,并发"
kb new 30-resources/channel-patterns --title "Channel 使用模式" --tags "Go,并发"
kb new 10-projects/quest-backend --title "智码后端重构" --tags "Go,项目"
kb link golang-learning goroutine-guide
kb link golang-learning channel-patterns
kb link golang-learning quest-backend
kb link goroutine-guide channel-patterns
kb backlinks golang-learning
kb backlinks goroutine-guide
kb backlinks channel-patterns
kb backlinks quest-backend
kb stats`;

const L2_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [20-areas/golang-learning] Go 学习体系 #学习 #Go
已创建 [30-resources/goroutine-guide] Goroutine 调度详解 #Go #并发
已创建 [30-resources/channel-patterns] Channel 使用模式 #Go #并发
已创建 [10-projects/quest-backend] 智码后端重构 #Go #项目
已链接 Go 学习体系 ↔ Goroutine 调度详解
已链接 Go 学习体系 ↔ Channel 使用模式
已链接 Go 学习体系 ↔ 智码后端重构
已链接 Goroutine 调度详解 ↔ Channel 使用模式
'Go 学习体系' 的反向链接（3）：
  [30-resources/goroutine-guide] Goroutine 调度详解
  [30-resources/channel-patterns] Channel 使用模式
  [10-projects/quest-backend] 智码后端重构
'Goroutine 调度详解' 的反向链接（2）：
  [20-areas/golang-learning] Go 学习体系
  [30-resources/channel-patterns] Channel 使用模式
'Channel 使用模式' 的反向链接（2）：
  [20-areas/golang-learning] Go 学习体系
  [30-resources/goroutine-guide] Goroutine 调度详解
'智码后端重构' 的反向链接（1）：
  [20-areas/golang-learning] Go 学习体系
笔记总数：4
  00-inbox: 0
  10-projects: 1
  20-areas: 1
  30-resources: 2
  40-archive: 0
双向链接：4 对`;

const L3_SCRIPT = `kb init
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"
kb new 00-inbox/inbox-error-handling --title "随手记：Go 错误处理三原则"
kb new 00-inbox/inbox-pprof --title "随手记：pprof 排查性能问题"
kb tag inbox-error-handling Go
kb tag inbox-pprof Go
kb tag inbox-pprof 性能
kb link inbox-error-handling golang-learning
kb link inbox-pprof golang-learning
kb move inbox-error-handling 20-areas
kb move inbox-pprof 30-resources
kb backlinks golang-learning
kb tree`;

const L3_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [20-areas/golang-learning] Go 学习体系 #学习 #Go
已创建 [00-inbox/inbox-error-handling] 随手记：Go 错误处理三原则
已创建 [00-inbox/inbox-pprof] 随手记：pprof 排查性能问题
已为 [00-inbox/inbox-error-handling] 追加标签 #Go
已为 [00-inbox/inbox-pprof] 追加标签 #Go
已为 [00-inbox/inbox-pprof] 追加标签 #性能
已链接 随手记：Go 错误处理三原则 ↔ Go 学习体系
已链接 随手记：pprof 排查性能问题 ↔ Go 学习体系
已移动：随手记：Go 错误处理三原则（00-inbox → 20-areas）
已移动：随手记：pprof 排查性能问题（00-inbox → 30-resources）
'Go 学习体系' 的反向链接（2）：
  [20-areas/inbox-error-handling] 随手记：Go 错误处理三原则
  [30-resources/inbox-pprof] 随手记：pprof 排查性能问题
00-inbox/ (0)
10-projects/ (0)
20-areas/ (2)
  golang-learning.md
  inbox-error-handling.md
30-resources/ (1)
  inbox-pprof.md
40-archive/ (0)`;

const L4_SCRIPT = `kb init
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"
kb new 20-areas/backend-roadmap --title "后端学习路线" --tags "学习,Go,架构"
kb new 30-resources/zettelkasten --title "卡片盒笔记法" --tags "方法论,学习"
kb new 30-resources/obsidian-guide --title "Obsidian 实践指南" --tags "方法论,工具"
kb new 10-projects/quest-retro --title "智码一期复盘报告" --tags "方法论,项目"
kb list
kb tags
kb search 方法论`;

const L4_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [20-areas/golang-learning] Go 学习体系 #学习 #Go
已创建 [20-areas/backend-roadmap] 后端学习路线 #学习 #Go #架构
已创建 [30-resources/zettelkasten] 卡片盒笔记法 #方法论 #学习
已创建 [30-resources/obsidian-guide] Obsidian 实践指南 #方法论 #工具
已创建 [10-projects/quest-retro] 智码一期复盘报告 #方法论 #项目
[20-areas/golang-learning] Go 学习体系 #学习 #Go
[20-areas/backend-roadmap] 后端学习路线 #学习 #Go #架构
[30-resources/zettelkasten] 卡片盒笔记法 #方法论 #学习
[30-resources/obsidian-guide] Obsidian 实践指南 #方法论 #工具
[10-projects/quest-retro] 智码一期复盘报告 #方法论 #项目
#方法论 (3)
#学习 (3)
#Go (2)
#工具 (1)
#架构 (1)
#项目 (1)
找到 3 条：
[30-resources/zettelkasten] 卡片盒笔记法 #方法论 #学习
[30-resources/obsidian-guide] Obsidian 实践指南 #方法论 #工具
[10-projects/quest-retro] 智码一期复盘报告 #方法论 #项目`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'kb-paradigm-1',
  lang: 'kb',
  module: 'paradigm',
  order: 1,
  title: '双链：连接两个知识点',
  difficulty: 2,
  xp: 20,
  goals: [
    '掌握 kb link 建立双向链接',
    '会用 kb backlinks 反查"谁引用过我"',
    '理解双链的本质：链接是双向的，move 不断链',
  ],
  brief: `## 双链：知识之间的神经元

文件夹只有"包含"关系，一条笔记只能待在一个位置。Zettelkasten 的核心创新是**双向链接**：A 提到 B，A 与 B 就互相知晓 —— 知识从孤岛连成神经网络。

本课用 \`kb link <slugA> <slugB>\` 建立双向链接；用 \`kb backlinks <slug>\` 反向追问"谁引用过我" —— 这正是 Obsidian / Roam 反向链接面板的原理。正向链接代表"我想到它"，反向链接代表"谁基于它思考"，后者常常带来意外的连接与灵感。

类比：**维基百科的"被引用页面"** —— 它比"参考文献"更能帮你顺藤摸瓜，发现知识网络。

> 💡 链接按 slug 记账：move 移动笔记不会断链 —— 这也是"slug 一旦被引用就不宜再改"的原因。`,
  task: `## 任务：两条链接，三次反查

1. \`kb init\`；
2. 创建三条笔记：
   - \`kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"\`
   - \`kb new 30-resources/goroutine-guide --title "Goroutine 调度详解" --tags "Go,并发"\`
   - \`kb new 30-resources/memory-model --title "Go 内存模型" --tags "Go,底层"\`
3. \`kb link golang-learning goroutine-guide\`；
4. \`kb link goroutine-guide memory-model\`；
5. 依次 \`kb backlinks\` 三条笔记 —— 每条都能反查到引用者；
6. \`kb stats\` —— 双向链接：2 对。`,
  starter: `# 第 1 关：双链——连接两个知识点

# TODO 1: 初始化知识库（kb init）

# TODO 2: 创建三条笔记（分区/slug/标题/标签见任务）

# TODO 3: kb link 把 golang-learning 链到 goroutine-guide

# TODO 4: kb link 把 goroutine-guide 链到 memory-model

# TODO 5: 依次 kb backlinks 三条笔记，观察双向性

# TODO 6: kb stats 查看链接对数`,
  solution: L1_SCRIPT,
  hints: [
    'kb link <slugA> <slugB> 要求双方笔记都已存在；输出格式"已链接 A标题 ↔ B标题"。',
    'kb backlinks <slug> 输出两段 —— 首行 "\'标题\' 的反向链接（N）："，随后每条两空格缩进 [分区/slug] 标题。',
    '被引用 2 次的是 goroutine-guide（golang-learning 与 memory-model 都链向它）；stats 显示 双向链接：2 对。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'kb-paradigm-2',
  lang: 'kb',
  module: 'paradigm',
  order: 2,
  title: '知识网络',
  difficulty: 3,
  xp: 25,
  goals: [
    '用多条 kb link 把孤立笔记连成知识网络',
    '通过逐条 backlinks 观察每个节点被引用的次数',
    '理解网络价值随连接数超线性增长（梅特卡夫定律）',
  ],
  brief: `## 知识网络：连接的价值超线性增长

3 条孤立笔记只是 3 条笔记；互相链接后，多出 3 条"关系"；6 条笔记两两相连，关系多达 15 条 —— 梅特卡夫定律：**网络价值约等于节点数的平方**。知识库的复利来自连接，而不是囤积。

实操：让**中心笔记**（如"Go 学习体系"）链接到各条具体笔记，具体笔记之间再交叉引用 —— 这就是知识网络的雏形，也是第五章 MOC（内容地图）的前置技能。\`kb stats\` 的"双向链接：N 对"就是库的连通性指标：笔记数增长时，链接对数更应该增长。

类比：**地铁线路图** —— 单条线路价值有限，线路互相交汇，整座城市才被激活。

> 💡 每新建一条笔记就问一句："它和库里哪条笔记有关？"至少链接一条，网络才会生长。`,
  task: `## 任务：把四条笔记连成网

1. \`kb init\`；
2. 创建四条笔记：
   - \`kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"\`
   - \`kb new 30-resources/goroutine-guide --title "Goroutine 调度详解" --tags "Go,并发"\`
   - \`kb new 30-resources/channel-patterns --title "Channel 使用模式" --tags "Go,并发"\`
   - \`kb new 10-projects/quest-backend --title "智码后端重构" --tags "Go,项目"\`
3. 建立四条链接：
   - \`kb link golang-learning goroutine-guide\`
   - \`kb link golang-learning channel-patterns\`
   - \`kb link golang-learning quest-backend\`
   - \`kb link goroutine-guide channel-patterns\`
4. 逐条 \`kb backlinks\` —— 观察每条被引用的次数（3 / 2 / 2 / 1）；
5. \`kb stats\` —— 双向链接：4 对。`,
  starter: `# 第 2 关：知识网络

# TODO 1: 初始化

# TODO 2: 创建四条笔记：golang-learning / goroutine-guide / channel-patterns / quest-backend

# TODO 3: 建立四条 kb link（见任务）

# TODO 4: 逐条 kb backlinks 四条笔记

# TODO 5: kb stats 查看连通性`,
  solution: L2_SCRIPT,
  hints: [
    '先创建 4 条笔记再链接；kb link 的双方都必须已存在，否则报"kb：双方笔记都必须已存在"。',
    'backlinks 的引用者按创建顺序列出；golang-learning 被其余三条链接，反向链接（3）。',
    'stats 的双向链接对数 = 每条笔记 links 数之和 ÷ 2：本关 8 ÷ 2 = 4 对。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'kb-paradigm-3',
  lang: 'kb',
  module: 'paradigm',
  order: 3,
  title: 'inbox 处理流',
  difficulty: 3,
  xp: 25,
  goals: [
    '掌握 inbox 处理流：new 暂记 → tag → link → move 归位',
    '理解链接按 slug 记账，move 归位不断链',
    '养成"inbox 定期清零"的缓冲区意识',
  ],
  brief: `## inbox 处理流：收件箱是缓冲区，不是仓库

GTD 的铁律：**一切先进收件箱，收件箱必须定期清零**。知识库同理：灵感用 \`kb new 00-inbox/...\` 随手暂记 —— 不纠结放哪，先捕获；再到"处理时间"逐条走完四步：

1. **打标签**（kb tag）—— 补主题维度；
2. **建链接**（kb link）—— 挂进知识网络；
3. **归位**（kb move）—— 移入正式分区；
4. **验证**（kb tree）—— 确认 inbox 清零。

链接按 slug 记账，move 之后连接依然有效 —— 结构可调整，关系不断裂。

类比：**机场中转大厅** —— 旅客先集中中转，再登机去各自目的地；没人常住中转厅。

> 💡 inbox 攒到 10 条就处理一次。"暂存"变"常驻"，知识库就开始腐烂。`,
  task: `## 任务：把 inbox 清零

1. \`kb init\`；
2. \`kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"\`（已有知识）；
3. 捕获两条到收件箱：
   - \`kb new 00-inbox/inbox-error-handling --title "随手记：Go 错误处理三原则"\`
   - \`kb new 00-inbox/inbox-pprof --title "随手记：pprof 排查性能问题"\`
4. 打标签：\`kb tag inbox-error-handling Go\`、\`kb tag inbox-pprof Go\`、\`kb tag inbox-pprof 性能\`；
5. 建链接：两条 inbox 笔记分别 \`kb link\` 到 golang-learning；
6. 归位：\`kb move inbox-error-handling 20-areas\`、\`kb move inbox-pprof 30-resources\`；
7. \`kb backlinks golang-learning\` —— 链接没断，还能看到移动后的新分区；
8. \`kb tree\` —— 00-inbox 清零。`,
  starter: `# 第 3 关：inbox 处理流

# TODO 1: 初始化

# TODO 2: 创建 golang-learning（20-areas）与两条 00-inbox 暂记笔记

# TODO 3: 给两条 inbox 笔记打标签（kb tag）

# TODO 4: 两条 inbox 笔记分别 link 到 golang-learning

# TODO 5: kb move 归位到 20-areas / 30-resources

# TODO 6: kb backlinks golang-learning 验证链接仍在

# TODO 7: kb tree 验证 00-inbox 清零`,
  solution: L3_SCRIPT,
  hints: [
    'kb tag 一次只能追加一个标签；kb move <slug> <分区> 的分区名必须精确（如 20-areas）。',
    '链接按 slug 记账，move 不断链 —— backlinks 里能看到笔记移动后的新分区。',
    'tree 按分区输出：首行 00-inbox/ (0)；20-areas 下按创建序列出 golang-learning.md 和 inbox-error-handling.md。',
  ],
  tests: tests(L3_EXPECTED),
};

const L4: Level = {
  id: 'kb-paradigm-4',
  lang: 'kb',
  module: 'paradigm',
  order: 4,
  title: '标签体系设计',
  difficulty: 3,
  xp: 25,
  goals: [
    '设计"顶级标签 + 子场景"的两层受控词表',
    '用 kb tags 检查标签次数分布',
    '理解标签是横跨分区的主题索引',
  ],
  brief: `## 标签体系：先设计词表，再往里填

随手打标签，标签墙半年就成垃圾场：#Go、#golang、#go语言 撕裂检索。业内做法：先设计**受控词表**再使用：

- **顶级标签**管大类：#学习 #方法论 #工具 —— 数量少、含义稳；
- **子场景标签**管细分：#Go #架构 #项目 —— 挂在顶级标签之下；
- **一个概念只允许一个词**：词表里没有 #golang，只有 #Go。

\`kb tags\` 是词表健康报表：高频标签是主航道，孤频标签要么扶植要么合并。分区管"为哪件事服务"，标签管"关于什么"：一条笔记只有一个位置，却可挂多个标签 —— 标签是**横跨分区的主题索引**。

类比：**图书馆索引卡** —— 同一本书只站一个书架，却能出现在多张索引卡里。

> 💡 每季度审一次 kb tags：同义标签立即合并 —— 词表越干净，检索越可靠。`,
  task: `## 任务：设计一套标签词表

1. \`kb init\`；
2. 创建五条笔记，按词表打标签：
   - \`kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"\`
   - \`kb new 20-areas/backend-roadmap --title "后端学习路线" --tags "学习,Go,架构"\`
   - \`kb new 30-resources/zettelkasten --title "卡片盒笔记法" --tags "方法论,学习"\`
   - \`kb new 30-resources/obsidian-guide --title "Obsidian 实践指南" --tags "方法论,工具"\`
   - \`kb new 10-projects/quest-retro --title "智码一期复盘报告" --tags "方法论,项目"\`
3. \`kb list\` —— 注意三条 #方法论 笔记分属不同场景；
4. \`kb tags\` —— 次数分布：方法论 3、学习 3、Go 2，工具/架构/项目各 1；
5. \`kb search 方法论\` —— 一个标签词，横跨两个分区命中 3 条。`,
  starter: `# 第 4 关：标签体系设计

# TODO 1: 初始化

# TODO 2: 按词表创建五条带标签笔记（见任务）

# TODO 3: kb list 浏览全部笔记

# TODO 4: kb tags 查看标签次数分布

# TODO 5: kb search 方法论 体会标签的跨分区检索`,
  solution: L4_SCRIPT,
  hints: [
    '--tags "学习,Go,架构" 用逗号分隔可一次打多个标签；kb tags 按使用次数降序输出，格式 #标签 (次数)。',
    '同次数的标签再按标签名排序；方法论 与 学习 同为 3 次，方法论 排在前面。',
    'kb search 方法论 命中 3 条：zettelkasten、obsidian-guide、quest-retro —— 标签横跨 30-resources 与 10-projects。',
  ],
  tests: tests(L4_EXPECTED),
};

export const KB_PARADIGM: Level[] = [L1, L2, L3, L4];
