import type { Level } from '@/types';

/**
 * 知识库工程课程 · 第四章：迁移与归类（tips，4 关）
 *
 * 提交一段 kb 命令脚本，由本地 PARA 知识库模拟器（src/judge/kb-sim.ts）执行，
 * stdout 与 expected 逐字符比对。输出完全确定（排序按创建序号）。
 *
 * 本章主题：知识不是建完就完事 —— 放对分区（项目 vs 资源）、
 * 完结归档（归档不是删除）、季度大迁移（批量重组）、重复合并（检索杀手）。
 */

const L1_SCRIPT = `kb init
kb new 10-projects/docker-migration --title "老项目容器化改造" --tags "项目,Docker"
kb new 10-projects/docker-handbook --title "Docker 命令速查手册" --tags "参考,Docker"
kb list
kb move docker-handbook 30-resources
kb tree`;

const L1_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [10-projects/docker-migration] 老项目容器化改造 #项目 #Docker
已创建 [10-projects/docker-handbook] Docker 命令速查手册 #参考 #Docker
[10-projects/docker-migration] 老项目容器化改造 #项目 #Docker
[10-projects/docker-handbook] Docker 命令速查手册 #参考 #Docker
已移动：Docker 命令速查手册（10-projects → 30-resources）
00-inbox/ (0)
10-projects/ (1)
  docker-migration.md
20-areas/ (0)
30-resources/ (1)
  docker-handbook.md
40-archive/ (0)`;

const L2_SCRIPT = `kb init
kb new 10-projects/quest-launch --title "智码平台上线方案" --tags "项目"
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习"
kb stats
kb archive quest-launch
kb stats
kb list`;

const L2_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [10-projects/quest-launch] 智码平台上线方案 #项目
已创建 [20-areas/golang-learning] Go 学习体系 #学习
笔记总数：2
  00-inbox: 0
  10-projects: 1
  20-areas: 1
  30-resources: 0
  40-archive: 0
双向链接：0 对
已归档：智码平台上线方案（10-projects → 40-archive）
笔记总数：2
  00-inbox: 0
  10-projects: 0
  20-areas: 1
  30-resources: 0
  40-archive: 1
双向链接：0 对
[40-archive/quest-launch] 智码平台上线方案 #项目
[20-areas/golang-learning] Go 学习体系 #学习`;

const L3_SCRIPT = `kb init
kb new 00-inbox/interview-prep --title "秋招面试冲刺清单"
kb new 00-inbox/vim-shortcuts --title "Vim 快捷键速记"
kb new 00-inbox/english-daily --title "英语日常维持计划"
kb new 10-projects/quest-launch --title "智码平台上线方案" --tags "项目"
kb new 10-projects/blog-revamp --title "个人博客改版" --tags "项目"
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习"
kb tree
kb move interview-prep 10-projects
kb move vim-shortcuts 30-resources
kb move english-daily 20-areas
kb archive blog-revamp
kb new 20-areas/rust-learning --title "Rust 学习体系" --tags "学习,Rust"
kb tree
kb stats`;

const L3_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [00-inbox/interview-prep] 秋招面试冲刺清单
已创建 [00-inbox/vim-shortcuts] Vim 快捷键速记
已创建 [00-inbox/english-daily] 英语日常维持计划
已创建 [10-projects/quest-launch] 智码平台上线方案 #项目
已创建 [10-projects/blog-revamp] 个人博客改版 #项目
已创建 [20-areas/golang-learning] Go 学习体系 #学习
00-inbox/ (3)
  interview-prep.md
  vim-shortcuts.md
  english-daily.md
10-projects/ (2)
  quest-launch.md
  blog-revamp.md
20-areas/ (1)
  golang-learning.md
30-resources/ (0)
40-archive/ (0)
已移动：秋招面试冲刺清单（00-inbox → 10-projects）
已移动：Vim 快捷键速记（00-inbox → 30-resources）
已移动：英语日常维持计划（00-inbox → 20-areas）
已归档：个人博客改版（10-projects → 40-archive）
已创建 [20-areas/rust-learning] Rust 学习体系 #学习 #Rust
00-inbox/ (0)
10-projects/ (2)
  interview-prep.md
  quest-launch.md
20-areas/ (3)
  english-daily.md
  golang-learning.md
  rust-learning.md
30-resources/ (1)
  vim-shortcuts.md
40-archive/ (1)
  blog-revamp.md
笔记总数：7
  00-inbox: 0
  10-projects: 2
  20-areas: 3
  30-resources: 1
  40-archive: 1
双向链接：0 对`;

const L4_SCRIPT = `kb init
kb new 00-inbox/rust-draft --title "学习笔记草稿"
echo "所有权：值有唯一所有者，赋值即移动" > 00-inbox/rust-draft.md
kb new 30-resources/rust-ownership --title "Rust 所有权详解" --tags "Rust"
kb search 所有权
echo "所有权：值有唯一所有者，赋值即移动；借用：同一时刻要么一个可变引用，要么多个不可变引用" > 30-resources/rust-ownership.md
kb link rust-draft rust-ownership
kb archive rust-draft
kb search 借用
kb backlinks rust-ownership
kb stats`;

const L4_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [00-inbox/rust-draft] 学习笔记草稿
已创建 [30-resources/rust-ownership] Rust 所有权详解 #Rust
找到 2 条：
[00-inbox/rust-draft] 学习笔记草稿
[30-resources/rust-ownership] Rust 所有权详解 #Rust
已链接 学习笔记草稿 ↔ Rust 所有权详解
已归档：学习笔记草稿（00-inbox → 40-archive）
找到 1 条：
[30-resources/rust-ownership] Rust 所有权详解 #Rust
'Rust 所有权详解' 的反向链接（1）：
  [40-archive/rust-draft] 学习笔记草稿
笔记总数：2
  00-inbox: 0
  10-projects: 0
  20-areas: 0
  30-resources: 1
  40-archive: 1
双向链接：1 对`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'kb-tips-1',
  lang: 'kb',
  module: 'tips',
  order: 1,
  title: '归类决策：项目还是资源',
  difficulty: 3,
  xp: 25,
  goals: [
    '理解 PARA 归类判据：有终点的是项目，纯参考是资源',
    '掌握 kb move 平移笔记（slug 不变、链接不断）',
    '用 kb tree 验证归类结果',
  ],
  brief: `## 项目还是资源？一个判断标准

两条笔记长得像，去处却可能完全不同。判据只有一条：**它有没有终点**。

- **10-projects 项目**：有明确完成标志和截止时间 —— "把老项目容器化改造完"，做完就归档；
- **30-resources 资源**：没有终点，持续当参考查 —— "Docker 命令速查手册"，你永远不会"查完"。

放错的代价：项目区被参考资料淹没，要推进的事反而看不见。发现放错用 \`kb move\` 平移即可 —— slug 不变，链接不断。

类比：**外卖与菜谱** —— 正在做的这单外卖是项目，收藏夹里的菜谱是资源；把菜谱塞进外卖箱，晚饭就没着落了。

> 💡 判断口诀：能写出"做完的那天"就是项目，写不出来就是资源。`,
  task: `## 任务：纠正放错的笔记

1. \`kb init\`；
2. \`kb new 10-projects/docker-migration --title "老项目容器化改造" --tags "项目,Docker"\`（有截止目标，放对了）；
3. \`kb new 10-projects/docker-handbook --title "Docker 命令速查手册" --tags "参考,Docker"\`（纯参考，这一步**故意放错**）；
4. \`kb list\` —— 两条都显示在 10-projects；
5. \`kb move docker-handbook 30-resources\` —— 平移纠正；
6. \`kb tree\` —— 验证 10-projects 剩 1 条、30-resources 有 1 条。`,
  starter: `# 第 1 关：归类决策——项目还是资源

# TODO 1: 初始化

# TODO 2: 创建 docker-migration 到 10-projects（标题/标签见任务）

# TODO 3: 创建 docker-handbook（速查手册，按任务先放错分区）

# TODO 4: kb list 查看现状

# TODO 5: 用 kb move 把 docker-handbook 平移到正确分区

# TODO 6: kb tree 验证`,
  solution: L1_SCRIPT,
  hints: [
    '两条笔记都建在 10-projects；docker-handbook 是速查手册属纯参考 —— kb move docker-handbook 30-resources 平移过去。',
    'kb move 输出格式：已移动：<标题>（<旧分区> → <新分区>），分区名带数字前缀。',
    'kb tree 按固定五区顺序输出，每分区一行 "分区/ (N)"，下面按创建序列出 slug.md。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'kb-tips-2',
  lang: 'kb',
  module: 'tips',
  order: 2,
  title: '归档生命周期',
  difficulty: 2,
  xp: 20,
  goals: [
    '掌握 kb archive 归档完结项目',
    '用 stats 对比归档前后：总数不变、40-archive 增加',
    '理解"归档不是删除"：内容、标签与链接全部保留',
  ],
  brief: `## 归档：不是删除，是退休

项目做完的那天，它的笔记该怎么办？PARA 的答案是 \`kb archive\`：移入 40-archive，退出日常视野，但**内容、标签、链接全部保留**。

- \`kb stats\` 里 40-archive 计数增加、笔记总数不变 —— 归档是搬家不是清空；
- \`kb list\` 里它依然在册，只是分区前缀变成了 40-archive；
- 将来排查"当时为什么这么设计"，归档区就是项目的完整复盘档案。

类比：**退休员工档案** —— 人走了，但人事柜里的档案一份不少，十年后查老项目还要靠它。

> 💡 每完结一个项目就立刻归档，10-projects 里只留"正在呼吸"的事 —— 这是知识库不腐烂的第一纪律。`,
  task: `## 任务：完结项目归档

1. \`kb init\`；
2. \`kb new 10-projects/quest-launch --title "智码平台上线方案" --tags "项目"\`；
3. \`kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习"\`；
4. \`kb stats\` —— 归档前基线（总数 2，40-archive: 0）；
5. \`kb archive quest-launch\` —— 项目完结，归档；
6. \`kb stats\` —— 总数仍为 2，40-archive 变 1；
7. \`kb list\` —— 归档笔记仍在册，分区变为 40-archive。`,
  starter: `# 第 2 关：归档生命周期

# TODO 1: 初始化

# TODO 2: 创建 quest-launch（10-projects）

# TODO 3: 创建 golang-learning（20-areas）

# TODO 4: kb stats 归档前基线

# TODO 5: 归档完结的 quest-launch

# TODO 6: 再次 kb stats 对比

# TODO 7: kb list 确认仍在册`,
  solution: L2_SCRIPT,
  hints: [
    'kb archive quest-launch 输出：已归档：智码平台上线方案（10-projects → 40-archive）。',
    '归档不改总数：两次 kb stats 都是 笔记总数：2，变的只是分区计数（10-projects 1→0，40-archive 0→1）。',
    'kb list 按创建序输出：quest-launch 创建在前，归档后行首变成 [40-archive/quest-launch]。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'kb-tips-3',
  lang: 'kb',
  module: 'tips',
  order: 3,
  title: '季度大迁移',
  difficulty: 4,
  xp: 30,
  goals: [
    '掌握批量 move / archive 的季度重组流程',
    '理解健康信号：inbox 清零、projects 只留进行时、archive 持续增长',
    '用 tree + stats 完成迁移前后对比',
  ],
  brief: `## 季度大迁移：知识库大扫除

每周清收件箱是日常保洁，每季度还要一次**大迁移**——重新决定每条知识的去留，四步：

- **inbox 清零**：积压逐条 \`kb move\` 归位，收件箱回到 0；
- **项目完结归档**：做完的 \`kb archive\`，项目区只留进行时；
- **新领域立项**：本季度的新主题，在 20-areas 正式建档；
- **stats 复盘**：五区分布健康吗 —— inbox 0、projects 有活、archive 在增长。

类比：**换季收纳** —— 反季衣物收进仓库（archive），当季的挂出来（projects）。

> 💡 大迁移那天别追求完美分类：拿不准的先进 30-resources，资源区放错的成本远低于项目区。`,
  task: `## 任务：季度大迁移

1. \`kb init\`，建 6 条初始库存：00-inbox 三条（interview-prep / vim-shortcuts / english-daily）、10-projects 两条（quest-launch / blog-revamp）、20-areas 一条（golang-learning）；
2. \`kb tree\` —— 迁移前快照；
3. inbox 清零：\`kb move interview-prep 10-projects\`、\`kb move vim-shortcuts 30-resources\`、\`kb move english-daily 20-areas\`；
4. \`kb archive blog-revamp\` —— 完结项目归档；
5. \`kb new 20-areas/rust-learning --title "Rust 学习体系" --tags "学习,Rust"\` —— 新领域立项；
6. \`kb tree\` + \`kb stats\` —— 迁移后全景：五区 0/2/3/1/1，总数 7。`,
  starter: `# 第 3 关：季度大迁移

# TODO 1: 初始化

# TODO 2: 建 6 条初始库存（inbox 三条 / projects 两条 / areas 一条，见任务）

# TODO 3: kb tree 迁移前快照

# TODO 4: inbox 清零——三条逐条 move 到各自分区

# TODO 5: 归档完结的 blog-revamp

# TODO 6: 新领域 rust-learning 立项（20-areas）

# TODO 7: kb tree + kb stats 迁移后全景`,
  solution: L3_SCRIPT,
  hints: [
    '六条初始笔记按创建序：interview-prep、vim-shortcuts、english-daily、quest-launch、blog-revamp、golang-learning。',
    '三次 move + 一次 archive + 一条 new（rust-learning）之后，五区计数为 0 / 2 / 3 / 1 / 1，总数 7（quest-launch 仍在进行中，留在 10-projects）。',
    'kb tree 每分区下的文件按创建序排列：20-areas 里是 english-daily → golang-learning → rust-learning。',
  ],
  tests: tests(L3_EXPECTED),
};

const L4: Level = {
  id: 'kb-tips-4',
  lang: 'kb',
  module: 'tips',
  order: 4,
  title: '重复与合并',
  difficulty: 4,
  xp: 30,
  goals: [
    '识别重复条目对检索的伤害：同一关键词命中多条无从取舍',
    '掌握 echo 覆盖 + kb link + kb archive 的合并三步',
    '用 search 与 backlinks 验证合并后的唯一权威版本',
  ],
  brief: `## 重复条目：知识库的检索杀手

三个月前随手记了条 Rust 草稿，今天又认真写了篇"Rust 所有权详解"。此时 \`kb search\` 同一个词返回两条 —— 哪条是权威版本？每次检索都要人工分辨，这就是重复条目向你收的税。

合并三步：

- \`echo "完整内容" > 分区/slug.md\` 把旧笔记内容**覆盖并入**权威版本；
- \`kb link\` 让两条互链 —— 旧条目变成指向新家的路标；
- \`kb archive\` 归档旧条目，退出检索主视野但留痕可查。

类比：**图书馆并版本** —— 同一书的两个版次合并馆藏，旧版盖上"已被新版替代"的章再入库。

> 💡 建条前先 \`kb search\` 一次同名主题：知识库的第一道防重机制是"写入前先查重"。`,
  task: `## 任务：重复条目合并

1. \`kb init\`；
2. \`kb new 00-inbox/rust-draft --title "学习笔记草稿"\`，再 \`echo "所有权：值有唯一所有者，赋值即移动" > 00-inbox/rust-draft.md\`；
3. \`kb new 30-resources/rust-ownership --title "Rust 所有权详解" --tags "Rust"\`；
4. \`kb search 所有权\` —— 两条都命中，重复！；
5. \`echo "所有权：值有唯一所有者，赋值即移动；借用：同一时刻要么一个可变引用，要么多个不可变引用" > 30-resources/rust-ownership.md\` —— 合并内容进权威版本；
6. \`kb link rust-draft rust-ownership\` —— 互链留痕；
7. \`kb archive rust-draft\` —— 旧条目归档；
8. \`kb search 借用\` —— 只命中权威版本；\`kb backlinks rust-ownership\` + \`kb stats\` 验证。`,
  starter: `# 第 4 关：重复与合并

# TODO 1: 初始化

# TODO 2: 创建 rust-draft（00-inbox）并用 echo 写入正文

# TODO 3: 创建 rust-ownership（30-resources，带标签）

# TODO 4: kb search 所有权 观察重复命中

# TODO 5: echo 把完整内容覆盖进 rust-ownership

# TODO 6: kb link 互链留痕

# TODO 7: 归档旧条目 rust-draft

# TODO 8: search 借用 + backlinks + stats 验证`,
  solution: L4_SCRIPT,
  hints: [
    'search 同时匹配标题、正文、标签：rust-draft 靠正文命中，rust-ownership 靠标题命中，所以返回 2 条。',
    'echo "内容" > 30-resources/rust-ownership.md 覆盖正文（无输出）；kb link 是双向的，一次即互链，stats 里双向链接 1 对。',
    '最后的 search 借用 只命中合并后的 rust-ownership；backlinks 显示归档区的 rust-draft 仍指向它。',
  ],
  tests: tests(L4_EXPECTED),
};

export const KB_TIPS: Level[] = [L1, L2, L3, L4];
