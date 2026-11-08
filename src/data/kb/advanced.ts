import type { Level } from '@/types';

/**
 * 知识库工程课程 · 第三章：检索与发现（advanced，4 关）
 *
 * 提交一段 kb 命令脚本，由本地 PARA 知识库模拟器（src/judge/kb-sim.ts）执行，
 * stdout 与 expected 逐字符比对。输出完全确定（排序按创建序号）。
 */

const L1_SCRIPT = `kb init
kb new 30-resources/go-concurrency --title "Go 并发编程笔记" --tags "Go,并发"
echo "goroutine 与 channel 是并发模型的核心" > 30-resources/go-concurrency.md
kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"
kb new 30-resources/docker-basics --title "Docker 入门指南" --tags "工具"
echo "容器化部署从镜像构建开始" > 30-resources/docker-basics.md
kb search channel
kb search docker
kb search Go`;

const L1_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [30-resources/go-concurrency] Go 并发编程笔记 #Go #并发
已创建 [20-areas/golang-learning] Go 学习体系 #学习 #Go
已创建 [30-resources/docker-basics] Docker 入门指南 #工具
找到 1 条：
[30-resources/go-concurrency] Go 并发编程笔记 #Go #并发
找到 1 条：
[30-resources/docker-basics] Docker 入门指南 #工具
找到 2 条：
[30-resources/go-concurrency] Go 并发编程笔记 #Go #并发
[20-areas/golang-learning] Go 学习体系 #学习 #Go`;

const L2_SCRIPT = `kb init
kb new 20-areas/redis-notes --title "Redis 缓存实战手册" --tags "数据库,缓存"
echo "穿透与雪崩是缓存设计的两大经典问题" > 20-areas/redis-notes.md
kb new 30-resources/mysql-tuning --title "MySQL 慢查询调优" --tags "数据库"
echo "先看执行计划再决定加不加索引" > 30-resources/mysql-tuning.md
kb search Redis
kb search 雪崩
kb search 数据库`;

const L2_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [20-areas/redis-notes] Redis 缓存实战手册 #数据库 #缓存
已创建 [30-resources/mysql-tuning] MySQL 慢查询调优 #数据库
找到 1 条：
[20-areas/redis-notes] Redis 缓存实战手册 #数据库 #缓存
找到 1 条：
[20-areas/redis-notes] Redis 缓存实战手册 #数据库 #缓存
找到 2 条：
[20-areas/redis-notes] Redis 缓存实战手册 #数据库 #缓存
[30-resources/mysql-tuning] MySQL 慢查询调优 #数据库`;

const L3_SCRIPT = `kb init
kb new 30-resources/study-notes-07 --title "学习笔记整理（第七周）" --tags "笔记"
echo "记了一些容器与镜像的常用操作命令" > 30-resources/study-notes-07.md
kb new 20-areas/sql-index --title "SQL 索引优化手册" --tags "数据库,SQL"
echo "B+ 树与最左前缀原则" > 20-areas/sql-index.md
kb search Docker
kb search 容器
kb search 索引`;

const L3_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [30-resources/study-notes-07] 学习笔记整理（第七周） #笔记
已创建 [20-areas/sql-index] SQL 索引优化手册 #数据库 #SQL
未找到与 'Docker' 相关的笔记
找到 1 条：
[30-resources/study-notes-07] 学习笔记整理（第七周） #笔记
找到 1 条：
[20-areas/sql-index] SQL 索引优化手册 #数据库 #SQL`;

const L4_SCRIPT = `kb init
kb new 30-resources/para-guide --title "PARA 方法论详解" --tags "方法论"
kb new 20-areas/zettelkasten --title "卡片盒笔记法入门" --tags "方法论"
kb new 30-resources/moc-guide --title "MOC 内容地图实践" --tags "方法论"
kb new 10-projects/kb-migration --title "个人知识库迁移计划" --tags "项目"
echo "把碎片笔记重组进 PARA 五区" > 10-projects/kb-migration.md
kb link para-guide zettelkasten
kb link para-guide moc-guide
kb link moc-guide kb-migration
kb search 方法论
kb backlinks para-guide
kb backlinks moc-guide
kb search 迁移`;

const L4_EXPECTED = `知识库初始化完成（PARA 结构）：
  00-inbox/
  10-projects/
  20-areas/
  30-resources/
  40-archive/
已创建 [30-resources/para-guide] PARA 方法论详解 #方法论
已创建 [20-areas/zettelkasten] 卡片盒笔记法入门 #方法论
已创建 [30-resources/moc-guide] MOC 内容地图实践 #方法论
已创建 [10-projects/kb-migration] 个人知识库迁移计划 #项目
已链接 PARA 方法论详解 ↔ 卡片盒笔记法入门
已链接 PARA 方法论详解 ↔ MOC 内容地图实践
已链接 MOC 内容地图实践 ↔ 个人知识库迁移计划
找到 3 条：
[30-resources/para-guide] PARA 方法论详解 #方法论
[20-areas/zettelkasten] 卡片盒笔记法入门 #方法论
[30-resources/moc-guide] MOC 内容地图实践 #方法论
'PARA 方法论详解' 的反向链接（2）：
  [20-areas/zettelkasten] 卡片盒笔记法入门
  [30-resources/moc-guide] MOC 内容地图实践
'MOC 内容地图实践' 的反向链接（2）：
  [30-resources/para-guide] PARA 方法论详解
  [10-projects/kb-migration] 个人知识库迁移计划
找到 1 条：
[10-projects/kb-migration] 个人知识库迁移计划 #项目`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'kb-advanced-1',
  lang: 'kb',
  module: 'advanced',
  order: 1,
  title: '关键词检索：search 三路匹配',
  difficulty: 2,
  xp: 20,
  goals: [
    '掌握 kb search 的三路匹配：标题 / 正文 / 标签，任一路命中即返回',
    '理解搜索结果按创建顺序输出、不区分大小写',
    '会用 echo 为笔记写入可检索的正文',
  ],
  brief: `## 检索：知识库存在的理由

存进来的知识若找不回，等于没存。\`kb search <关键词>\` 是知识库的核心入口：它在**三路**里查找 —— 标题、正文、标签，任一路命中即返回，结果按创建顺序列出。

命中多条时输出 \`找到 N 条：\` 再逐条列出；一无所获时明确提示 \`未找到\`。搜索不区分大小写（Docker 与 docker 等价），因此能否搜到，完全取决于你写笔记时用了哪些词。

类比：**图书馆检索机** —— 书名、内容简介、主题卡任一匹配都能把书找出来；但检索机再强，也只在"你当时写下的词"里找。

> 💡 写下每条笔记时问自己：半年后我会用什么词来找它？把那个词写进标题、正文或标签三者之一。`,
  task: `## 任务：建立三条知识，三次检索

1. \`kb init\`；
2. \`kb new 30-resources/go-concurrency --title "Go 并发编程笔记" --tags "Go,并发"\`；
3. \`echo "goroutine 与 channel 是并发模型的核心" > 30-resources/go-concurrency.md\` —— 写入正文；
4. \`kb new 20-areas/golang-learning --title "Go 学习体系" --tags "学习,Go"\`；
5. \`kb new 30-resources/docker-basics --title "Docker 入门指南" --tags "工具"\`；
6. \`echo "容器化部署从镜像构建开始" > 30-resources/docker-basics.md\`；
7. \`kb search channel\` —— 正文路命中（1 条）；
8. \`kb search docker\` —— 标题路命中，大小写不敏感（1 条）；
9. \`kb search Go\` —— 标题+标签同时命中两条，按创建顺序列出。`,
  starter: `# 第 1 关：关键词检索

# TODO 1: 初始化知识库

# TODO 2: 创建 go-concurrency（--title "Go 并发编程笔记" --tags "Go,并发"）

# TODO 3: 用 echo 为 go-concurrency 写入正文（内容见任务）

# TODO 4: 创建 golang-learning 与 docker-basics（参数见任务）

# TODO 5: 用 echo 为 docker-basics 写入正文

# TODO 6: 三次 kb search（channel / docker / Go）`,
  solution: L1_SCRIPT,
  hints: [
    'kb search 在标题、正文、标签三路里查找，任一路命中即算；结果按创建顺序输出。',
    'echo "内容" > 分区/slug.md 给已有笔记写入正文（无输出）；channel 这个正文词全靠这一步才可被搜到。',
    'search Go 命中两条：go-concurrency（标题+标签）与 golang-learning（标题+标签），按创建顺序各输出一行 [分区/slug] 标题 #标签。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'kb-advanced-2',
  lang: 'kb',
  module: 'advanced',
  order: 2,
  title: '多角度检索：同一知识的三个入口',
  difficulty: 3,
  xp: 25,
  goals: [
    '体会同一笔记的三个检索入口：标题词 / 正文词 / 标签词',
    '理解标签路的聚合效应：一次捞出跨分区的同主题笔记',
    '建立"元数据是检索钩子"的写笔记意识',
  ],
  brief: `## 多角度检索：一条知识的三个入口

一条"Redis 缓存实战手册"可以从三个方向被找到：记得标题里的 **Redis**（标题路）；记得里面写过"雪崩"（正文路）；只记得它属于数据库主题（标签路）。\`kb search\` 对三路同时匹配，无论记忆从哪个角度残存，都能找到同一条笔记。

这正是元数据的价值：标题是门牌，正文是内容，标签是主题归属 —— 三个入口互为备份。标签路还有聚合效应：搜"数据库"能一次捞出所有带该标签的笔记，跨分区成批出现。

类比：**地图多点定位** —— 按地名、按门牌号、按"我收藏的位置"，都能找到同一个地方；收藏夹还能一次列出所有同类地点。

> 💡 重要笔记三路都要留钩子：标题放专名，正文放细节词，标签放主题词。`,
  task: `## 任务：一条笔记，三个入口

1. \`kb init\`；
2. \`kb new 20-areas/redis-notes --title "Redis 缓存实战手册" --tags "数据库,缓存"\`；
3. \`echo "穿透与雪崩是缓存设计的两大经典问题" > 20-areas/redis-notes.md\`；
4. \`kb new 30-resources/mysql-tuning --title "MySQL 慢查询调优" --tags "数据库"\`；
5. \`echo "先看执行计划再决定加不加索引" > 30-resources/mysql-tuning.md\`；
6. \`kb search Redis\` —— 标题路命中 redis-notes；
7. \`kb search 雪崩\` —— 正文路命中同一条；
8. \`kb search 数据库\` —— 标签路命中两条（按创建顺序）。`,
  starter: `# 第 2 关：多角度检索

# TODO 1: 初始化知识库

# TODO 2: 创建 redis-notes（--title "Redis 缓存实战手册" --tags "数据库,缓存"）

# TODO 3: 用 echo 为 redis-notes 写入正文（内容见任务）

# TODO 4: 创建 mysql-tuning 并用 echo 写入正文（参数见任务）

# TODO 5: 三次 kb search（Redis / 雪崩 / 数据库）`,
  solution: L2_SCRIPT,
  hints: [
    '三次搜索对应三个入口：Redis 走标题路，雪崩走正文路，数据库走标签路。',
    '正文路依赖 echo 写入的内容 —— 创建笔记时 content 是空的，不写正文就搜不到"雪崩"。',
    '标签路有聚合效应：redis-notes 与 mysql-tuning 都带 #数据库，所以 kb search 数据库 找到 2 条，按创建顺序 redis-notes 在前。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'kb-advanced-3',
  lang: 'kb',
  module: 'advanced',
  order: 3,
  title: '检索不到的教训：命名即检索',
  difficulty: 3,
  xp: 25,
  goals: [
    '经历一次检索失败，认识"未找到"输出的精确格式',
    '理解可检索性取决于命名：零信息标题是检索杀手',
    '学会用"未来的检索词"反推当下的命名',
  ],
  brief: `## 检索不到的教训：可检索性取决于命名

故意搜一个不存在的词 —— 未找到。这不是检索的失败，而是**命名的失败**：两个月前你记了一条容器命令笔记，标题叫"学习笔记整理（第七周）"，今天你脑子里只有"Docker"这个词，于是它永远沉了底。

\`kb search\` 只在标题、正文、标签三处找，三处都不含你输入的词，它就无从猜起。检索质量不是搜索引擎给的，而是你写笔记那一刻决定的 —— 这就是 Zettelkasten 强调"用未来的检索词命名"的原因。

类比：**给三个月后的自己指路** —— "我家在那个老地方"，三个月后的自己根本不知道老地方是哪；直接写门牌号才找得到。

> 💡 起标题避免"整理 / 笔记 / 杂记"这类零信息词，直接写"XX 常用命令""XX 原理"。`,
  task: `## 任务：一次失败，两次命中

1. \`kb init\`；
2. \`kb new 30-resources/study-notes-07 --title "学习笔记整理（第七周）" --tags "笔记"\` —— 故意用零信息标题；
3. \`echo "记了一些容器与镜像的常用操作命令" > 30-resources/study-notes-07.md\`；
4. \`kb new 20-areas/sql-index --title "SQL 索引优化手册" --tags "数据库,SQL"\`；
5. \`echo "B+ 树与最左前缀原则" > 20-areas/sql-index.md\`；
6. \`kb search Docker\` —— 三路皆空，输出"未找到与 'Docker' 相关的笔记"；
7. \`kb search 容器\` —— 正文路捞回第一条（想想：若正文当时也没写"容器"呢？）；
8. \`kb search 索引\` —— 标题路命中第二条。`,
  starter: `# 第 3 关：检索不到的教训

# TODO 1: 初始化知识库

# TODO 2: 创建 study-notes-07（--title "学习笔记整理（第七周）" --tags "笔记"）

# TODO 3: 用 echo 为 study-notes-07 写入正文（内容见任务）

# TODO 4: 创建 sql-index 并用 echo 写入正文（参数见任务）

# TODO 5: kb search Docker 观察未找到

# TODO 6: kb search 容器 与 kb search 索引 观察命中`,
  solution: L3_SCRIPT,
  hints: [
    '三路都搜不到时输出：未找到与 \'Docker\' 相关的笔记 —— 关键词按你输入的原样放进引号。',
    '"容器"这个词只在 study-notes-07 的正文里，是被 echo 挽救的 —— 若当时正文也没写，这条笔记就永远找不回了。',
    'search 容器 命中 study-notes-07（正文路），search 索引 命中 sql-index（标题路），各 1 条。',
  ],
  tests: tests(L3_EXPECTED),
};

const L4: Level = {
  id: 'kb-advanced-4',
  lang: 'kb',
  module: 'advanced',
  order: 4,
  title: '组合发现：search × backlinks',
  difficulty: 4,
  xp: 30,
  goals: [
    '掌握 search → backlinks → search 的组合发现路径',
    '理解链接让知识可达性超越单次关键词命中',
    '体会知识网络的价值随连接数超线性增长',
  ],
  brief: `## 组合发现：检索与链接的组合拳

单次检索只能找到"恰好写了那个词"的笔记；知识网络的真正用法是**顺藤摸瓜**：\`kb search\` 找到枢纽笔记 → \`kb backlinks\` 反查谁引用了它 → 发现邻居 → 对新线索再次 search。三步之后，你已从一个关键词走到了四条相互关联的知识。

这就是 Zettelkasten 的核心主张：检索解决"记得关键词"的问题，链接解决"不记得关键词"的问题 —— 沿链接走，总能撞见意料之外的关联。

类比：**顺藤摸瓜** —— 先抓到一根藤（检索命中），再沿藤蔓（反向链接）摸到整片瓜田（知识网络）。

> 💡 每次检索命中后顺手看一眼 backlinks —— 那里有你当时认为相关、如今可能已遗忘的笔记。`,
  task: `## 任务：三步组合发现

1. \`kb init\`；
2. 建四条笔记：
   - \`kb new 30-resources/para-guide --title "PARA 方法论详解" --tags "方法论"\`
   - \`kb new 20-areas/zettelkasten --title "卡片盒笔记法入门" --tags "方法论"\`
   - \`kb new 30-resources/moc-guide --title "MOC 内容地图实践" --tags "方法论"\`
   - \`kb new 10-projects/kb-migration --title "个人知识库迁移计划" --tags "项目"\`
3. 用 echo 给 kb-migration 写入正文："把碎片笔记重组进 PARA 五区"；
4. 连成网络：\`kb link para-guide zettelkasten\`、\`kb link para-guide moc-guide\`、\`kb link moc-guide kb-migration\`；
5. \`kb search 方法论\` —— 标签路捞出 3 条；
6. \`kb backlinks para-guide\` 与 \`kb backlinks moc-guide\` —— 各反查到 2 条；
7. \`kb search 迁移\` —— 顺藤摸到的最后一条，单独命中。`,
  starter: `# 第 4 关：组合发现

# TODO 1: 初始化知识库

# TODO 2: 创建 para-guide / zettelkasten / moc-guide / kb-migration 四条笔记（参数见任务）

# TODO 3: 用 echo 给 kb-migration 写入正文

# TODO 4: 三次 kb link 连成网络（见任务）

# TODO 5: kb search 方法论 找到枢纽

# TODO 6: kb backlinks para-guide 与 kb backlinks moc-guide 顺藤摸瓜

# TODO 7: kb search 迁移 完成扩展`,
  solution: L4_SCRIPT,
  hints: [
    'kb link 是双向的：建一条链接双方各记一笔；backlinks 列出"谁链接到我"，按创建顺序输出。',
    'para-guide 被 zettelkasten 与 moc-guide 反查到（2 条）；moc-guide 被 para-guide 与 kb-migration 反查到（2 条）。',
    '最后 search 迁移 只命中 kb-migration —— 它不在 #方法论 标签组里，是沿链接链发现的，这正是组合发现的意义。',
  ],
  tests: tests(L4_EXPECTED),
};

export const KB_ADVANCED: Level[] = [L1, L2, L3, L4];
