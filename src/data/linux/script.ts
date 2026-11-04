import type { Level } from '@/types';

/** Linux 课程 · Shell 脚本入门（tips 模块，5 关） */
export const LINUX_SCRIPT: Level[] = [
  {
    id: 'linux-script-1',
    lang: 'linux',
    module: 'tips',
    order: 1,
    title: 'echo 与变量思维',
    difficulty: 2,
    xp: 20,
    goals: [
      '会用 echo 输出指定文本',
      '理解引号对空格与标点的保护作用',
      '了解 bash 变量概念（脚本的地基）',
    ],
    brief: `## echo：脚本的第一句话

Shell 脚本是写给终端的剧本，\`echo\` 是剧本里最基础的台词功 —— 把文本打印到屏幕：

\`\`\`bash
echo "Hello, Linux!"
\`\`\`

两个要点：

- **引号是保护罩**：逗号、空格、感叹号都在引号里原样保留；不加引号，文本会被按空格拆成多个参数
- **变量思维**：真实 bash 可以把值存进变量反复使用（\`greeting="Hi"\`、\`echo "$greeting"\`）。本模拟器专注命令序列本身，但"先存值、再使用"的思想会贯穿你未来的脚本生涯

从一句问候开始，你的脚本之路正式发车。`,
    task: `## 任务：向 Linux 问好

用 \`echo\` 原样输出下面一行文本（逗号、空格、感叹号一个都不能少）：

\`\`\`text
Hello, Linux!
\`\`\`

**输入**：无`,
    starter: `# echo 会把参数原样输出，引号保护空格与标点
# TODO: 用 echo 输出 Hello, Linux!
`,
    solution: `echo "Hello, Linux!"`,
    hints: [
      '给文本加双引号：`echo "Hello, Linux!"`。',
      '逗号后有一个空格，感叹号紧贴在 t 后面，都要原样保留。',
      '完整答案一行：`echo "Hello, Linux!"`，输出 `Hello, Linux!`。',
    ],
    tests: [
      { name: 'echo 输出问候语', stdin: '', expected: 'Hello, Linux!' },
      { name: '空格与标点原样保留', stdin: '', expected: 'Hello, Linux!' },
      { name: '输出精确匹配', stdin: '', expected: 'Hello, Linux!' },
      { name: '隐藏：逐字符匹配', stdin: '', expected: 'Hello, Linux!', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# echo 会把参数原样输出，引号保护空格与标点
# TODO: 用 echo 输出 Hello, Linux!
`,
      },
      solutions: {
        bash: `echo "Hello, Linux!"`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{}}}',
  },
  {
    id: 'linux-script-2',
    lang: 'linux',
    module: 'tips',
    order: 2,
    title: '多命令与分号',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解脚本的本质：多条命令按顺序执行',
      '掌握 cd 切换目录后，后续命令在新目录中执行',
      '了解 bash 的 ; 与 && 串联（模拟器不支持，需分行）',
    ],
    brief: `## 剧本是一行一行念的

真实 bash 允许把多条命令串在一行：分号 \`cmd1; cmd2\` 依次执行，双与号 \`cmd1 && cmd2\` 前者成功才执行后者。

本模拟器的规矩更简单：**一行一条命令，从上到下执行** —— 这正是脚本的本来面貌，一整段命令序列就是一个小剧本。

还有个关键设定要记住：\`cd\` 会**改变后续所有命令**的工作目录 —— 剧本翻页后，舞台已经换了：

\`\`\`bash
mkdir build    # 在主目录建 build
cd build       # 走进 build
touch main.sh  # 此时已在 build 里，文件建在这里
ls             # 列出 build 的内容
\`\`\``,
    task: `## 任务：搭一间工作间

按顺序完成：

1. 创建 \`build\` 目录
2. 进入 \`build\`
3. 在里面创建 \`main.sh\`
4. \`ls\` 验证

**输入**：无

**期望输出**：

\`\`\`text
main.sh
\`\`\``,
    starter: `# 一行一条命令，从上到下执行；cd 之后的命令都在新目录里运行
# TODO 1: mkdir 创建 build 目录
# TODO 2: cd 进入 build
# TODO 3: touch 创建 main.sh
# TODO 4: ls 验证
`,
    solution: `mkdir build
cd build
touch main.sh
ls`,
    hints: [
      '不要把命令写在一行 —— 模拟器不支持 `;` 和 `&&`，分四行写。',
      '顺序很重要：必须先 `mkdir build` 再 `cd build`，否则 cd 会报错。',
      'cd 之后 touch 建的文件就在 build 里，最后 `ls` 输出 `main.sh`。',
    ],
    tests: [
      { name: '多命令顺序执行', stdin: '', expected: 'main.sh' },
      { name: 'cd 后新目录生效', stdin: '', expected: 'main.sh' },
      { name: 'touch 在 build 内建文件', stdin: '', expected: 'main.sh' },
      { name: '隐藏：最终输出 main.sh', stdin: '', expected: 'main.sh', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 一行一条命令，从上到下执行；cd 之后的命令都在新目录里运行
# TODO 1: mkdir 创建 build 目录
# TODO 2: cd 进入 build
# TODO 3: touch 创建 main.sh
# TODO 4: ls 验证
`,
      },
      solutions: {
        bash: `mkdir build
cd build
touch main.sh
ls`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{}}}',
  },
  {
    id: 'linux-script-3',
    lang: 'linux',
    module: 'tips',
    order: 3,
    title: '注释与可读性',
    difficulty: 2,
    xp: 20,
    goals: [
      '会用 # 写注释，理解注释会被执行器忽略',
      '养成"命令 + 注释"的脚本书写习惯',
      '会用 sort 对文件内容按字典序排序',
    ],
    brief: `## 注释：写给三个月后的自己

以 \`#\` 开头的行是**注释** —— 执行器看都不看一眼，直接跳过。它们是剧本的舞台说明，只演给"人"看：

\`\`\`bash
# 按从小到大排序 data.txt
sort data.txt
\`\`\`

好脚本 = 命令 + 注释。三个月后回看，注释能让你秒懂"这行当初为什么这么写"；团队协作时，注释更是别人读懂你思路的捷径。

\`sort\` 则负责排序：把文件内容按**字典序**从小到大整理后输出（数字排序的进阶用法 \`sort -n\` 以后会见到）。注释写得再多，也不会影响命令的输出 —— 这正是本关的验证点。`,
    task: `## 任务：排好这三个数

场景：主目录下有 \`data.txt\`，内容是三行数字：\`7\`、\`2\`、\`9\`（每行一个）。

写一段**带至少两条注释**的命令序列，用 \`sort data.txt\` 输出排序结果。

**输入**：无

**期望输出**（三行）：

\`\`\`text
2
7
9
\`\`\``,
    starter: `# 注释以 # 开头，执行时会被忽略
# TODO 1: 写一条注释说明你要做什么
# TODO 2: 再写一条注释，然后执行 sort data.txt
`,
    solution: `# data.txt 里存着三行数字
# sort 会按字典序从小到大输出它们
sort data.txt`,
    hints: [
      '注释独占一行、以 # 开头即可，例如：`# 对 data.txt 排序`。',
      '注释不影响输出 —— 判题只看命令产生的结果，写多少条注释都行（至少两条）。',
      '核心命令就一条：`sort data.txt`，输出 `2`、`7`、`9` 三行。',
    ],
    tests: [
      { name: '注释被忽略', stdin: '', expected: '2\n7\n9' },
      { name: 'sort 字典序输出', stdin: '', expected: '2\n7\n9' },
      { name: '三行排序结果正确', stdin: '', expected: '2\n7\n9' },
      { name: '隐藏：带注释执行结果一致', stdin: '', expected: '2\n7\n9', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 注释以 # 开头，执行时会被忽略
# TODO 1: 写一条注释说明你要做什么
# TODO 2: 再写一条注释，然后执行 sort data.txt
`,
      },
      solutions: {
        bash: `# data.txt 里存着三行数字
# sort 会按字典序从小到大输出它们
sort data.txt`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"data.txt":{"type":"file","content":"7\\n2\\n9\\n"}}}}',
  },
  {
    id: 'linux-script-4',
    lang: 'linux',
    module: 'tips',
    order: 4,
    title: '统计脚本',
    difficulty: 3,
    xp: 30,
    goals: [
      '掌握词频统计三连：sort | uniq -c | sort -r',
      '理解第二级 sort -r 按"计数+单词"整行字符串逆序排序',
      '能读懂 -c 计数格式（4 字符宽右对齐）',
    ],
    brief: `## 词频统计三连招

"哪个词出现最多？"是日志分析、数据清洗的高频问题。经典三连：

\`\`\`bash
sort words.txt | uniq -c | sort -r
\`\`\`

三节管道各司其职：

1. \`sort\` —— 把相同单词**排到一起**（uniq 只认相邻重复）
2. \`uniq -c\` —— 去重并计数，输出 \`   4 cat\` 这样的行（计数占 4 字符宽、右对齐，空格 + 单词）
3. \`sort -r\` —— 逆序。它把每行当作**整串字符**比较：计数是行首字符，4 开头的行自然排在 3、2、1 前面 —— 出现次数最多的词排在最上面

这三招组合就是最小可用的词频分析器。`,
    task: `## 任务：谁是最热门的词

场景：主目录下有 \`words.txt\`，共 10 行单词：

\`\`\`text
cat
dog
cat
bird
dog
cat
fish
dog
cat
bird
\`\`\`

用三连管道输出按出现次数从多到少的统计。

**输入**：无

**期望输出**（四行，注意每行开头的空格）：

\`\`\`text
   4 cat
   3 dog
   2 bird
   1 fish
\`\`\``,
    starter: `# 词频三连：sort（聚拢）→ uniq -c（计数）→ sort -r（逆序）
# TODO: 用两条管道把三个命令串起来
# 计数占 4 字符宽右对齐，如    4 cat
`,
    solution: `sort words.txt | uniq -c | sort -r`,
    hints: [
      '第一段 `sort words.txt` 把相同单词排到一起；不排序直接 uniq -c 会漏计。',
      '完整命令：`sort words.txt | uniq -c | sort -r` —— 最后的 -r 让次数多的排前面。',
      '输出四行：`   4 cat` / `   3 dog` / `   2 bird` / `   1 fish`，每行计数前有 3 个空格。',
    ],
    tests: [
      { name: '三级管道执行正确', stdin: '', expected: '   4 cat\n   3 dog\n   2 bird\n   1 fish' },
      { name: '计数字符串逆序排列', stdin: '', expected: '   4 cat\n   3 dog\n   2 bird\n   1 fish' },
      { name: '计数格式右对齐', stdin: '', expected: '   4 cat\n   3 dog\n   2 bird\n   1 fish' },
      { name: '隐藏：四行逐字符匹配', stdin: '', expected: '   4 cat\n   3 dog\n   2 bird\n   1 fish', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 词频三连：sort（聚拢）→ uniq -c（计数）→ sort -r（逆序）
# TODO: 用两条管道把三个命令串起来
# 计数占 4 字符宽右对齐，如    4 cat
`,
      },
      solutions: {
        bash: `sort words.txt | uniq -c | sort -r`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"words.txt":{"type":"file","content":"cat\\ndog\\ncat\\nbird\\ndog\\ncat\\nfish\\ndog\\ncat\\nbird\\n"}}}}',
  },
  {
    id: 'linux-script-5',
    lang: 'linux',
    module: 'tips',
    order: 5,
    title: '综合实战：日志分析',
    difficulty: 4,
    xp: 35,
    goals: [
      '综合运用 cat、管道、grep、wc -l',
      '体会"读文件 → 过滤 → 计数"的日志分析流水线',
      '完成 Linux 课程毕业实战',
    ],
    brief: `## 毕业实战：一次真实的日志分析

真实运维的清晨，往往从这条命令开始：

\`\`\`bash
cat server.log | grep ERROR | wc -l
\`\`\`

三节流水线，三步走：

1. \`cat server.log\` —— 把 8 行日志原样倒进管道
2. \`grep ERROR\` —— 漏斗拦下含 \`ERROR\` 的行（服务器的哀嚎）
3. \`wc -l\` —— 数出哀嚎了几声，输出一个数字

小命令各自简单，管道一接就是强大的分析工具。这一关综合了本课程的核心招式 —— 通过它，你就正式从 Linux 新手村毕业了。`,
    task: `## 任务：清点错误日志

场景：主目录下有 \`server.log\`，共 8 行，格式为 \`LEVEL message\`：

\`\`\`text
INFO server started
ERROR db connection failed
INFO request received
WARN slow query detected
ERROR timeout on /api/users
INFO cache refreshed
ERROR disk almost full
INFO server healthy
\`\`\`

用一条管道命令统计其中 \`ERROR\` 日志的行数。

**输入**：无

**期望输出**（一个数字）：

\`\`\`text
3
\`\`\``,
    starter: `# 日志分析流水线：读文件 → 过滤 → 计数
# TODO 1: cat server.log 输出全部日志
# TODO 2: 用管道接 grep ERROR 过滤
# TODO 3: 再用管道接 wc -l 计数
`,
    solution: `cat server.log | grep ERROR | wc -l`,
    hints: [
      '先想清楚数据流：cat 的输出喂给 grep，grep 的输出喂给 wc -l。',
      '管道用 | 连接：`cat server.log | grep ERROR | wc -l`。',
      'server.log 里有 3 行 ERROR，最终输出 `3`。',
    ],
    tests: [
      { name: 'cat + grep + wc 流水线', stdin: '', expected: '3' },
      { name: 'ERROR 行数统计正确', stdin: '', expected: '3' },
      { name: '输出为数字 3', stdin: '', expected: '3' },
      { name: '隐藏：单条管道命令验证', stdin: '', expected: '3', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 日志分析流水线：读文件 → 过滤 → 计数
# TODO 1: cat server.log 输出全部日志
# TODO 2: 用管道接 grep ERROR 过滤
# TODO 3: 再用管道接 wc -l 计数
`,
      },
      solutions: {
        bash: `cat server.log | grep ERROR | wc -l`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"server.log":{"type":"file","content":"INFO server started\\nERROR db connection failed\\nINFO request received\\nWARN slow query detected\\nERROR timeout on /api/users\\nINFO cache refreshed\\nERROR disk almost full\\nINFO server healthy\\n"}}}}',
  },
];
