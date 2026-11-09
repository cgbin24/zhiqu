import type { Level } from '@/types';

/**
 * Linux 课程 · 文本处理与管道追加章：日志分析实战（logs，5 关）
 *
 * 场景：服务器 /var/log/ 下有 Web 访问日志与应用日志，
 * 用 grep / awk / sed / sort / uniq / wc 管道组合完成真实运维分析。
 * 模拟器已扩展 awk / sed 命令与 system 注入。
 */

const ACCESS_LOG = `10.0.0.1 - [10/May] "GET /index.html" 200
10.0.0.2 - [10/May] "GET /api/user" 200
10.0.0.1 - [10/May] "POST /login" 302
10.0.0.3 - [10/May] "GET /index.html" 200
10.0.0.1 - [10/May] "GET /api/user" 500
10.0.0.2 - [10/May] "GET /admin" 403
10.0.0.1 - [10/May] "GET /api/user" 500`;

const APP_LOG = `2026-05-10 09:00:01 INFO 服务启动完成
2026-05-10 09:12:33 ERROR 数据库连接超时
2026-05-10 09:15:02 WARN 缓存命中率下降
2026-05-10 10:02:11 ERROR 磁盘写入失败
2026-05-10 10:30:00 INFO 定时任务执行
2026-05-10 11:48:20 ERROR 数据库连接超时`;

function mkFs(): string {
  return JSON.stringify({
    cwd: '/var/log',
    tree: {
      type: 'dir',
      children: {
        'access.log': { type: 'file', content: ACCESS_LOG },
        'app.log': { type: 'file', content: APP_LOG },
      },
    },
  });
}

const L1_SCRIPT = `grep ERROR app.log`;

const L1_EXPECTED = `2026-05-10 09:12:33 ERROR 数据库连接超时
2026-05-10 10:02:11 ERROR 磁盘写入失败
2026-05-10 11:48:20 ERROR 数据库连接超时`;

const L2_SCRIPT = `grep ERROR app.log | wc -l`;

const L2_EXPECTED = `3`;

const L3_SCRIPT = `awk "{print \\$1}" access.log | sort | uniq -c | sort -rn`;

const L3_EXPECTED = `   4 10.0.0.1
   2 10.0.0.2
   1 10.0.0.3`;

const L4_SCRIPT = `awk "{print \\$1}" access.log | sort | uniq -c | sort -rn | head -1`;

const L4_EXPECTED = `   4 10.0.0.1`;

const L5_SCRIPT = `grep ERROR app.log | sed "s/数据库连接超时/数据库连接失败/g"`;

const L5_EXPECTED = `2026-05-10 09:12:33 ERROR 数据库连接失败
2026-05-10 10:02:11 ERROR 磁盘写入失败
2026-05-10 11:48:20 ERROR 数据库连接失败`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：管道与命令组合', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'linux-logs-1',
  lang: 'linux',
  module: 'paradigm',
  order: 7,
  title: '日志分析：揪出错误行',
  difficulty: 2,
  xp: 20,
  goals: [
    '认识 Web 服务器日志与应用日志的结构',
    '用 grep 从日志中精准过滤错误行',
    '养成"先 grep 后分析"的排查习惯',
  ],
  brief: `## 日志分析：运维的第一现场

服务器出问题，第一件事永远是**看日志**。日志是纯文本，正好是 grep 的主场：

- **access.log**（访问日志）：谁在什么时间访问了什么接口、返回码多少；
- **app.log**（应用日志）：程序自己打的 INFO / WARN / ERROR。

\`grep ERROR app.log\` 一条命令就能把所有错误行捞出来——比肉眼逐行翻快一百倍，而且不会漏。

类比：**大海捞针** —— 日志是海，grep 是磁铁；不靠运气靠过滤。

> 💡 排查口诀：**先 grep 错误、再看上下文、最后数频次**——接下来几关就是这三步的展开。`,
  task: `## 任务：从应用日志中过滤错误

日志文件已在 /var/log/ 下（app.log 与 access.log）。

1. \`grep ERROR app.log\` —— 捞出全部 ERROR 行；
2. 观察输出：三条错误，两条"数据库连接超时"、一条"磁盘写入失败"。

输出三行，与 expected 逐字符比对。`,
  starter: `# 日志分析：过滤错误行

# TODO 1: 用 grep 从 app.log 中过滤出所有 ERROR 行`,
  solution: L1_SCRIPT,
  hints: [
    'grep 的用法：grep 关键词 文件名。',
    '关键词是 ERROR（大写），日志里同时有 INFO 和 WARN 行，过滤后只剩 3 行。',
    '输出保持原行内容不变，按日志中的先后顺序排列。',
  ],
  tests: tests(L1_EXPECTED),
  runtime: mkFs(),
};

const L2: Level = {
  id: 'linux-logs-2',
  lang: 'linux',
  module: 'paradigm',
  order: 8,
  title: '错误计数：管道组合统计',
  difficulty: 2,
  xp: 20,
  goals: [
    '掌握管道组合：grep 过滤 + wc -l 计数',
    '理解"一条命令的输出是下一条的输入"',
    '会用一条管道行回答"错误有多少条"',
  ],
  brief: `## 管道组合：把简单命令拼成强大工具

上一关 grep 捞出了错误行，但"有多少条"还得自己数。加一根管道接 \`wc -l\`，让机器数：

\`grep ERROR app.log | wc -l\`

竖线 \`|\` 把左边的输出变成右边的输入——grep 先过滤出 3 行，wc -l 再数出 3。**管道是 Linux 哲学的核心**：每个命令只做一件小事，组合起来威力巨大。

类比：**工厂流水线** —— 每个工位只做一道工序，传送带（管道）把它们串成完整产线。

> 💡 这个模式万能：换成 grep 404 就是"统计 404 次数"，换成 grep WARN 就是警告次数。`,
  task: `## 任务：统计错误总数

1. \`grep ERROR app.log\` —— 先看过滤结果；
2. \`grep ERROR app.log | wc -l\` —— 加管道统计条数（应为 3）。

一条管道行，输出一个数字。`,
  starter: `# 错误计数

# TODO 1: grep 过滤 ERROR 行

# TODO 2: 加管道 wc -l 统计条数`,
  solution: L2_SCRIPT,
  hints: [
    'wc -l 统计输入的行数，竖线 | 直接敲在两条命令之间。',
    '管道左边 grep 输出 3 行，右边 wc -l 数出 3。',
    '输出只有一个数字：3。',
  ],
  tests: tests(L2_EXPECTED),
  runtime: mkFs(),
};

const L3: Level = {
  id: 'linux-logs-3',
  lang: 'linux',
  module: 'paradigm',
  order: 9,
  title: '访问日志：Top IP 统计',
  difficulty: 3,
  xp: 25,
  goals: [
    '掌握 awk 提取日志字段（第一列 IP）',
    '跑通经典四连管道：awk | sort | uniq -c | sort -rn',
    '理解每段管道在统计中的作用',
  ],
  brief: `## Top IP：四连管道的经典组合

访问日志每行开头是来源 IP。想知道"谁访问最多"，一条管道搞定：

\`awk '{print $1}' access.log | sort | uniq -c | sort -rn\`

四段分工：**awk** 抽出第一列（IP）→ **sort** 排序（uniq 只对相邻行去重，必须先排序）→ **uniq -c** 相邻去重并计数 → **sort -rn** 按次数倒序。

输出形如 \`3 10.0.0.1\` —— 次数 + IP。这条管道是运维面试与日常排查的**必背组合**。

类比：**选票统计** —— awk 撕下选票上的名字，sort 按名字排好，uniq -c 数票，sort -rn 按票数排名。

> 💡 \`awk '{print $1}'\` 中的 $1 是第一列，$2 是第二列——列以空白分隔。`,
  task: `## 任务：统计访问日志的 Top IP

对 access.log（7 行，每行第一列是 IP）：

1. \`awk '{print $1}' access.log\` —— 先看第一列长什么样；
2. \`awk '{print $1}' access.log | sort\` —— 排序；
3. \`awk '{print $1}' access.log | sort | uniq -c\` —— 去重计数；
4. \`awk '{print $1}' access.log | sort | uniq -c | sort -rn\` —— 按次数倒序。

输出三行：10.0.0.1 四次、10.0.0.2 两次、10.0.0.3 一次。`,
  starter: `# Top IP 统计：四连管道

# TODO 1: awk 提取 access.log 第一列

# TODO 2: 接 sort 排序

# TODO 3: 接 uniq -c 去重计数

# TODO 4: 接 sort -rn 按次数倒序`,
  solution: L3_SCRIPT,
  hints: [
    "awk 提取字段：awk '{print $1}' access.log —— $1 是第一列。",
    'uniq -c 前必须先 sort：uniq 只合并相邻行。',
    'sort -rn 中 -r 是倒序、-n 是按数字比较——次数大的在前。',
  ],
  tests: tests(L3_EXPECTED),
  runtime: mkFs(),
};

const L4: Level = {
  id: 'linux-logs-4',
  lang: 'linux',
  module: 'paradigm',
  order: 10,
  title: '定位高频访客',
  difficulty: 3,
  xp: 25,
  goals: [
    '用 head -1 从排序结果中取出第一名',
    '理解"管道每段都可以接 head/tail 截取"',
    '形成完整的日志分析结论输出',
  ],
  brief: `## 定位第一名：管道末端的截取

四连管道跑完后，结果可能有几十行。想知道**第一名是谁**，在管道末尾接 \`head -1\`：

\`awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -1\`

head -1 取第一行——即访问次数最多的 IP。同理 \`tail -1\` 取最后一名。**管道的任何位置都能截取**，这是流式处理的灵活性。

类比：**颁奖典礼** —— 排名完成后，head -1 就是把金牌得主请上台。

> 💡 这个管道组合同样适用于：最常访问的接口（$7 是 URL 列）、错误最多的时段——换个列号而已。`,
  task: `## 任务：找出访问最多的 IP

1. \`awk '{print $1}' access.log | sort | uniq -c | sort -rn\` —— 完整排名；
2. 末尾接 \`head -1\` —— 只看第一名。

输出一行：次数 + IP。`,
  starter: `# 定位高频访客

# TODO 1: 四连管道：awk 提取 IP → sort → uniq -c → sort -rn

# TODO 2: 末尾接 head -1 只看第一名`,
  solution: L4_SCRIPT,
  hints: [
    '在四连管道末尾直接接 | head -1。',
    '输出一行：三个空格 + 3 + 空格 + 10.0.0.1（uniq -c 的计数有前导空格对齐）。',
    '如果想知道最后一名，把 head -1 换成 tail -1。',
  ],
  tests: tests(L4_EXPECTED),
  runtime: mkFs(),
};

const L5: Level = {
  id: 'linux-logs-5',
  lang: 'linux',
  module: 'paradigm',
  order: 11,
  title: 'sed 文本替换：日志改写',
  difficulty: 3,
  xp: 25,
  goals: [
    '掌握 sed s/old/new/ 单次替换与 /g 全局替换',
    '用 grep | sed 组合过滤并改写日志',
    '理解 sed 是"流编辑器"：逐行处理即时输出',
  ],
  brief: `## sed：流编辑器

sed 是**流编辑器**——对每一行执行替换、删除等编辑动作，处理完立即输出。最常用的是替换：

- \`sed s/超时/失败/\` —— 每行只替换**第一处**；
- \`sed s/超时/失败/g\` —— 加 g（global）替换**每一处**。

与 grep 组合：\`grep ERROR app.log | sed "s/数据库连接超时/数据库连接失败/g"\` —— 先过滤出错误行，再把敏感或模糊的表述统一改写（脱敏、术语标准化都靠它）。

类比：**流水线上的喷漆工位** —— 产品（日志行）经过时，sed 只负责把指定图案重新喷一遍。

> 💡 替换里的分隔符是 /，若内容含 / 可换分隔符：sed "s|/api|/gateway|"。`,
  task: `## 任务：过滤并改写错误表述

1. \`grep ERROR app.log\` —— 回顾过滤结果（3 行）；
2. \`grep ERROR app.log | sed "s/数据库连接超时/数据库连接失败/g"\` —— 把表述统一改写。

第二行的"磁盘写入失败"不含目标词，保持原样——sed 只改命中的部分。`,
  starter: `# sed 文本替换

# TODO 1: grep 过滤 ERROR 行

# TODO 2: 接管道 sed "s/数据库连接超时/数据库连接失败/g" 全局改写`,
  solution: L5_SCRIPT,
  hints: [
    'sed 表达式用双引号包住：sed "s/数据库连接超时/数据库连接失败/g"。',
    '末尾的 g 表示 global——每行所有命中都替换；不加 g 只替换每行第一处。',
    '第二行"磁盘写入失败"不含目标词，原样保留——sed 不动未命中的行。',
  ],
  tests: tests(L5_EXPECTED),
  runtime: mkFs(),
};

export const LINUX_LOGS: Level[] = [L1, L2, L3, L4, L5];
