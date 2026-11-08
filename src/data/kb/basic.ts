import type { Level } from '@/types';

/**
 * 知识库工程课程 · 第一章：方案与初始化（basic，4 关）
 *
 * 提交一段 kb 命令脚本，由本地 PARA 知识库模拟器（src/judge/kb-sim.ts）执行，
 * stdout 与 expected 逐字符比对。输出完全确定（排序按创建序号）。
 */

const L1_SCRIPT = `kb init
kb tree`;

const L1_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
00-inbox/ (0)
10-projects/ (0)
20-areas/ (0)
30-resources/ (0)
40-archive/ (0)`;

const L2_SCRIPT = `kb init
kb new 10-projects/quest-launch --title "智码平台上线方案" --tags "项目,里程碑"
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"
kb new 30-resources/para-guide --title "PARA 方法论详解" --tags "方法论"
kb list`;

const L2_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [10-projects/quest-launch] 智码平台上线方案 #项目 #里程碑
已创建 [20-areas/golang-learning] Go 学习体系 #学习 #Go
已创建 [30-resources/para-guide] PARA 方法论详解 #方法论
[10-projects/quest-launch] 智码平台上线方案 #项目 #里程碑
[20-areas/golang-learning] Go 学习体系 #学习 #Go
[30-resources/para-guide] PARA 方法论详解 #方法论`;

const L3_SCRIPT = `kb init
kb new 00-inbox/quick-capture --title "随手记：读完 PARA 原文"
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"
kb tag quick-capture 方法论
kb tag golang-learning 每周复盘
kb tags`;

const L3_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [00-inbox/quick-capture] 随手记：读完 PARA 原文
已创建 [20-areas/golang-learning] Go 学习体系 #学习 #Go
已为 [00-inbox/quick-capture] 追加标签 #方法论
已为 [20-areas/golang-learning] 追加标签 #每周复盘
#方法论 (1)
#每周复盘 (1)
#学习 (1)
#Go (1)`;

const L4_SCRIPT = `kb init
kb new 10-projects/quest-launch --title "智码平台上线方案" --tags "项目"
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习"
kb new 30-resources/para-guide --title "PARA 方法论详解" --tags "方法论"
kb tree
kb stats`;

const L4_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [10-projects/quest-launch] 智码平台上线方案 #项目
已创建 [20-areas/golang-learning] Go 学习体系 #学习
已创建 [30-resources/para-guide] PARA 方法论详解 #方法论
00-inbox/ (0)
10-projects/ (1)
  quest-launch.md
20-areas/ (1)
  golang-learning.md
30-resources/ (1)
  para-guide.md
40-archive/ (0)
笔记总数：3
  00-inbox: 0
  10-projects: 1
  20-areas: 1
  30-resources: 1
  40-archive: 0
双向链接：0 对`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'kb-basic-1',
  lang: 'kb',
  module: 'basic',
  order: 1,
  title: 'PARA：五区架构初始化',
  difficulty: 1,
  xp: 15,
  goals: [
    '理解 PARA 五区架构：Projects / Areas / Resources / Archives + 收件箱',
    '掌握 kb init 初始化知识库结构',
    '会用 kb tree 查看目录全景',
  ],
  brief: `## PARA：业内最主流的知识库组织法

PARA 把所有知识按**行动距离**分成四区，再加一个缓冲收件箱：

- **00-inbox 收件箱**：一切先丢这里，定期清零；
- **10-projects 项目**：有明确目标和截止时间的事（如"上线智码平台"）；
- **20-areas 领域**：需要长期维持的标准（如"Go 学习"、"健康管理"）；
- **30-resources 资源**：感兴趣的主题参考（如"PARA 方法论"）；
- **40-archive 归档**：完结/失效的内容，不删但移出视野。

类比：**书桌与书架** —— 项目是桌上正在办的文件，领域是常备工具书，资源是兴趣藏书，归档是仓库；收件箱是门口的文件篮。

> 💡 排序按"距离行动有多近"而非"重要程度"—— 这是 PARA 与传统文件夹分类的本质区别。`,
  task: `## 任务：初始化你的知识库

1. \`kb init\` —— 创建 PARA 五区结构；
2. \`kb tree\` —— 查看目录全景（五个分区各 0 条）。

两步，观察输出的完整结构。`,
  starter: `# 第 1 关：初始化知识库

# TODO 1: 初始化 PARA 结构

# TODO 2: 查看目录全景`,
  solution: L1_SCRIPT,
  hints: [
    'kb init 会一次性创建五个分区，输出共 6 行（完成提示 + 5 个目录）。',
    'kb tree 每个分区输出两行：分区名 + 数量，如 "00-inbox/ (0)"。',
    '分区顺序固定：00-inbox → 10-projects → 20-areas → 30-resources → 40-archive。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'kb-basic-2',
  lang: 'kb',
  module: 'basic',
  order: 2,
  title: '第一条知识：new 与 front-matter',
  difficulty: 2,
  xp: 20,
  goals: [
    '掌握 kb new 在指定分区创建笔记（路径决定归属）',
    '理解 front-matter 元数据：标题与标签',
    '用 kb list 按创建顺序浏览全部笔记',
  ],
  brief: `## kb new：每条知识都有身份证

\`kb new <分区>/<slug> --title "标题" --tags "标签1,标签2"\` 创建一条笔记：

- **路径**决定它属于哪个 PARA 分区；
- **slug** 是全局唯一标识（kebab-case：小写+连字符），用于链接与检索；
- **标签**是横跨分区的主题维度 —— 分区管"放哪"，标签管"关于什么"。

\`kb list\` 按创建顺序列出全部笔记，每行包含分区、slug、标题与标签 —— 这是知识库的"全部资产清单"。

类比：**图书馆建档** —— 分区是书架，slug 是藏书编号，标签是主题索引卡。

> 💡 slug 一旦被引用就不宜再改（链接会断），起名时想清楚。`,
  task: `## 任务：建立三条知识，覆盖三个分区

1. \`kb init\`；
2. \`kb new 10-projects/quest-launch --title "智码平台上线方案" --tags "项目,里程碑"\`；
3. \`kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"\`；
4. \`kb new 30-resources/para-guide --title "PARA 方法论详解" --tags "方法论"\`；
5. \`kb list\` —— 三条按创建顺序列出。`,
  starter: `# 第 2 关：建立三条知识

# TODO 1: 初始化

# TODO 2: 在 10-projects 分区创建 quest-launch（标题/标签见任务）

# TODO 3: 在 20-areas 分区创建 golang-learning

# TODO 4: 在 30-resources 分区创建 para-guide

# TODO 5: kb list 浏览全部`,
  solution: L2_SCRIPT,
  hints: [
    'kb new 的标题/标签要用双引号包住：--title "智码平台上线方案" --tags "项目,里程碑"。',
    'list 按创建顺序输出：创建时 seq 递增，quest-launch → golang-learning → para-guide。',
    '每行格式：[分区/slug] 标题 #标签1 #标签2 —— 标签前带 #，无标签则省略。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'kb-basic-3',
  lang: 'kb',
  module: 'basic',
  order: 3,
  title: '标签体系：横跨分区的主题维度',
  difficulty: 2,
  xp: 20,
  goals: [
    '创建时带标签与事后追加标签（kb tag）两种方式',
    '掌握 kb tags 全库标签统计',
    '理解标签与分区的分工：分区管位置，标签管主题',
  ],
  brief: `## 标签：打破分区墙的主题索引

分区回答"这条知识**为哪件事**服务"，标签回答"它**关于什么**"。一条"Go 学习体系"笔记放在 20-areas，但可以同时带 #学习 #Go #每周复盘 —— 它会同时出现在三个主题线索里。

\`kb tag <slug> <标签>\` 给已有笔记追加标签；\`kb tags\` 统计全库标签及使用次数（按次数降序）—— 标签使用频率就是你知识库的"兴趣分布图"。

类比：**文件夹 vs 便利贴** —— 文件夹只能待在一个地方，便利贴可以同时标记多个主题。

> 💡 标签贵精不贵多：同一个概念只用一个词（"方法论"别再造"方法"），否则检索会碎裂。`,
  task: `## 任务：两种打标签方式

1. \`kb init\`；
2. \`kb new 00-inbox/quick-capture --title "随手记：读完 PARA 原文"\`（收件箱暂不打标签）；
3. \`kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"\`；
4. \`kb tag quick-capture 方法论\` —— 事后追加；
5. \`kb tag golang-learning 每周复盘\`；
6. \`kb tags\` —— 四个标签各出现 1 次。

注意 kb tags 的排序：按使用次数降序，同次数按标签名字母序。`,
  starter: `# 第 3 关：标签体系

# TODO 1: 初始化

# TODO 2: 创建 quick-capture（标题"随手记：读完 PARA 原文"，暂无标签）

# TODO 3: 创建 golang-learning（--tags "学习,Go"）

# TODO 4: 给 quick-capture 追加标签"方法论"

# TODO 5: 给 golang-learning 追加标签"每周复盘"

# TODO 6: kb tags 查看统计`,
  solution: L3_SCRIPT,
  hints: [
    '创建时带标签用 --tags "学习,Go"（逗号分隔）；事后追加用 kb tag <slug> <标签>（单个）。',
    'kb tags 输出格式：#标签 (次数)，排序按次数降序、同次数按标签名字母序 —— 方法论 < 每周复盘（拼音序按字母）—— 实际按字母：以字符编码比较。',
    '四个标签各 1 次：方法论、每周复盘、学习、Go —— 按字母序输出：Go < 学习 < 每周复盘 < 方法论？注意中文按 UTF-8 编码排序。',
  ],
  tests: tests(L3_EXPECTED),
};

const L4: Level = {
  id: 'kb-basic-4',
  lang: 'kb',
  module: 'basic',
  order: 4,
  title: '库存全景：tree 与 stats',
  difficulty: 3,
  xp: 25,
  goals: [
    '组合使用 tree 与 stats 形成知识库全景认知',
    '理解 stats 的四项指标：总数/分区分布/链接对数',
    '建立"知识库需要定期盘点"的意识',
  ],
  brief: `## 盘点：知识库的健康检查

建了几条知识之后，需要两个命令俯瞰全局：

- \`kb tree\`：**结构视图** —— 每个分区下有哪些文件，检查"放对地方了吗"；
- \`kb stats\`：**指标视图** —— 笔记总数、五区分布、双向链接对数，检查"平衡吗、连通吗"。

健康信号：10-projects 有正在进行的事、00-inbox 接近清零、40-archive 持续吸纳、链接对数稳步增长。如果 projects 堆了 30 条而 archive 是 0 —— 你在囤积不做，知识库变成了仓库坟场。

类比：**体检报告** —— tree 是 B 超看结构，stats 是血常规看指标。

> 💡 每周固定盘点一次（15 分钟）：清收件箱、移归档、补链接。知识库死于"只存不理"。`,
  task: `## 任务：三条知识 + 两次盘点

1. \`kb init\`；
2. 按下述建立三条知识：
   - \`kb new 10-projects/quest-launch --title "智码平台上线方案" --tags "项目"\`
   - \`kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习"\`
   - \`kb new 30-resources/para-guide --title "PARA 方法论详解" --tags "方法论"\`
3. \`kb tree\` —— 结构视图；
4. \`kb stats\` —— 指标视图（笔记总数 3，三个分区各 1，双向链接 0 对）。`,
  starter: `# 第 4 关：库存全景

# TODO 1: 初始化

# TODO 2: 三条知识（分区/slug/标题/标签见任务）

# TODO 3: kb tree 结构盘点

# TODO 4: kb stats 指标盘点`,
  solution: L4_SCRIPT,
  hints: [
    'tree 在每个分区下按创建序列出 slug.md 文件（带两空格缩进）。',
    'stats 的分区行格式："  00-inbox: 0"（两空格缩进 + 冒号 + 数量）。',
    '双向链接对数 = 所有链接数之和 ÷ 2 —— 本关没有 link 操作，是 0 对。',
  ],
  tests: tests(L4_EXPECTED),
};

export const KB_BASIC: Level[] = [L1, L2, L3, L4];
