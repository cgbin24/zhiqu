import type { Level } from '@/types';

/** Linux 课程 · 文本处理与管道（paradigm 模块，5 关） */
export const LINUX_TEXT: Level[] = [
  {
    id: 'linux-text-1',
    lang: 'linux',
    module: 'paradigm',
    order: 1,
    title: 'cat 与重定向',
    difficulty: 1,
    xp: 15,
    goals: [
      '会用 echo 输出文本',
      '掌握 > 覆盖写入与 >> 追加写入的区别',
      '会用 cat 读回文件确认内容',
    ],
    brief: `## echo 与重定向：往纸上写字

\`echo\` 是复读机 —— 你给它什么文本，它就原样喊出来。配合重定向符号，它还能把喊出的内容**写进文件**：

\`\`\`bash
echo "第一行" > story.txt    # > 创建（覆盖）文件并写入
echo "第二行" >> story.txt   # >> 在文件末尾追加
\`\`\`

- **\`>\`** 是"重新铺一张纸写"—— 文件原有内容会被覆盖
- **\`>>\`** 是"翻到后面继续写"—— 追加，不破坏已有内容
- 带空格的文本必须用引号包住，否则会被拆成多个参数

写完用 \`cat story.txt\` 读回来验收。模拟器每次重定向写入都会自动在行尾补一个换行符，所以多条 \`echo\` 恰好各占一行。`,
    task: `## 任务：写一个三行小故事

从空主目录开始，把三行内容写进 \`story.txt\`：

\`\`\`text
Once upon a time
a hero learned the shell
and lived happily ever after.
\`\`\`

步骤：第一条 \`echo\` 用 \`>\` 创建文件，后两条用 \`>>\` 追加，最后 \`cat story.txt\` 输出全文。

**输入**：无

**期望输出**（三行）：

\`\`\`text
Once upon a time
a hero learned the shell
and lived happily ever after.
\`\`\``,
    starter: `# echo 输出文本，> 写入新文件，>> 追加到文件末尾
# TODO 1: 用 echo + > 把第一行写入 story.txt
# TODO 2: 用 echo + >> 追加第二行
# TODO 3: 用 echo + >> 追加第三行，再 cat story.txt 验证
`,
    solution: `echo "Once upon a time" > story.txt
echo "a hero learned the shell" >> story.txt
echo "and lived happily ever after." >> story.txt
cat story.txt`,
    hints: [
      '带空格的句子要加引号：`echo "Once upon a time" > story.txt`。',
      '第一条用 `>` 创建文件，后两条必须用 `>>` 追加 —— 用 `>` 会把前面的内容覆盖掉。',
      '最后 `cat story.txt` 应输出三行故事。完整序列：三条 echo（> >> >>）加一条 cat。',
    ],
    tests: [
      { name: 'echo + > 创建文件', stdin: '', expected: 'Once upon a time\na hero learned the shell\nand lived happily ever after.' },
      { name: 'echo + >> 追加内容', stdin: '', expected: 'Once upon a time\na hero learned the shell\nand lived happily ever after.' },
      { name: 'cat 读回全文三行', stdin: '', expected: 'Once upon a time\na hero learned the shell\nand lived happily ever after.' },
      { name: '隐藏：三行顺序精确匹配', stdin: '', expected: 'Once upon a time\na hero learned the shell\nand lived happily ever after.', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# echo 输出文本，> 写入新文件，>> 追加到文件末尾
# TODO 1: 用 echo + > 把第一行写入 story.txt
# TODO 2: 用 echo + >> 追加第二行
# TODO 3: 用 echo + >> 追加第三行，再 cat story.txt 验证
`,
      },
      solutions: {
        bash: `echo "Once upon a time" > story.txt
echo "a hero learned the shell" >> story.txt
echo "and lived happily ever after." >> story.txt
cat story.txt`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{}}}',
  },
  {
    id: 'linux-text-2',
    lang: 'linux',
    module: 'paradigm',
    order: 2,
    title: 'grep 搜索',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解 grep 的过滤作用：只输出包含模式的行',
      '掌握 grep "关键词" 文件名 的基本语法',
      '能读懂日志文件并定位错误行',
    ],
    brief: `## grep：文本漏斗

日志文件动辄几百行，肉眼找错误太慢。\`grep\` 像一个**漏斗**：倒进去一整碗文本，只漏出包含关键词的那几行：

\`\`\`bash
grep "ERROR" log.txt    # 只输出包含 ERROR 的行
\`\`\`

语法：\`grep "模式" 文件名\`。匹配到的行**原样整行输出**，没匹配到的行被拦下；一行都不匹配时没有输出。

模拟器用正则表达式做匹配 —— 本关的关键词是普通文本，直接写即可。\`log.txt\` 里混着 INFO / WARN / ERROR 三种级别的日志，ERROR 行就是我们要捞出来的鱼。`,
    task: `## 任务：捞出错误日志

场景：主目录下有 \`log.txt\`，共 6 行：

\`\`\`text
INFO start
ERROR disk full
WARN memory high
INFO retry
ERROR net down
INFO done
\`\`\`

用 \`grep\` 过滤出所有包含 \`ERROR\` 的行。

**输入**：无

**期望输出**（两行）：

\`\`\`text
ERROR disk full
ERROR net down
\`\`\``,
    starter: `# 场景：log.txt 有 6 行日志，其中两行含 ERROR
# TODO: 用 grep 过滤出包含 ERROR 的行
# 语法：grep "模式" 文件名
`,
    solution: `grep "ERROR" log.txt`,
    hints: [
      'grep 后第一个参数是关键词，第二个是文件名：`grep "ERROR" log.txt`。',
      '只写 grep 不带文件名会去读管道输入，什么也得不到 —— 别忘了写上 log.txt。',
      '匹配行会原样整行输出，共两行：`ERROR disk full` 和 `ERROR net down`。',
    ],
    tests: [
      { name: 'grep 过滤 ERROR 行', stdin: '', expected: 'ERROR disk full\nERROR net down' },
      { name: '匹配行原样输出', stdin: '', expected: 'ERROR disk full\nERROR net down' },
      { name: '只输出两行错误日志', stdin: '', expected: 'ERROR disk full\nERROR net down' },
      { name: '隐藏：输出精确匹配', stdin: '', expected: 'ERROR disk full\nERROR net down', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 场景：log.txt 有 6 行日志，其中两行含 ERROR
# TODO: 用 grep 过滤出包含 ERROR 的行
# 语法：grep "模式" 文件名
`,
      },
      solutions: {
        bash: `grep "ERROR" log.txt`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"log.txt":{"type":"file","content":"INFO start\\nERROR disk full\\nWARN memory high\\nINFO retry\\nERROR net down\\nINFO done\\n"}}}}',
  },
  {
    id: 'linux-text-3',
    lang: 'linux',
    module: 'paradigm',
    order: 3,
    title: 'grep -n 与 -v',
    difficulty: 2,
    xp: 20,
    goals: [
      '会用 grep -n 显示匹配行的行号',
      '理解行号输出格式：行号:内容',
      '了解 -v 反选的作用（排除匹配行）',
    ],
    brief: `## 行号与反选：grep 的两只眼睛

\`grep\` 加上选项能看到更多细节：

- **\`-n\`**（number）：给每个命中行加上**原始行号**前缀，格式为 \`行号:内容\` —— 报告里能直接说"第几行出错"
- **\`-v\`**（invert）：反选，输出**不含**关键词的行

\`\`\`bash
grep -n "ERROR" log.txt   # 输出 2:ERROR disk full 这样的行
\`\`\`

注意行号是**文件里的原始行号**，不是输出中的第几行。真实排障时这两个选项经常和 \`-i\`（忽略大小写）配合使用。本关先练最常用的 \`-n\`。`,
    task: `## 任务：给错误标上坐标

场景与上一关相同：\`log.txt\` 共 6 行，其中第 2、5 行含 \`ERROR\`。

用 \`grep -n\` 找出所有 \`ERROR\` 行并带行号输出。

**输入**：无

**期望输出**（两行，格式 行号:内容）：

\`\`\`text
2:ERROR disk full
5:ERROR net down
\`\`\``,
    starter: `# 场景：log.txt 共 6 行，ERROR 在第 2 行和第 5 行
# TODO: 用 grep -n 找出 ERROR 行并显示行号
# 输出格式是 行号:内容
`,
    solution: `grep -n "ERROR" log.txt`,
    hints: [
      '选项写在关键词前面：`grep -n "ERROR" log.txt`。',
      '行号是文件里的原始行号：ERROR 分别在第 2 行和第 5 行，输出形如 `2:...` 和 `5:...`。',
      '完整输出两行：`2:ERROR disk full` 和 `5:ERROR net down`，冒号后没有空格。',
    ],
    tests: [
      { name: 'grep -n 显示行号', stdin: '', expected: '2:ERROR disk full\n5:ERROR net down' },
      { name: '行号为原始行号', stdin: '', expected: '2:ERROR disk full\n5:ERROR net down' },
      { name: '行号:内容 格式精确', stdin: '', expected: '2:ERROR disk full\n5:ERROR net down' },
      { name: '隐藏：输出精确匹配', stdin: '', expected: '2:ERROR disk full\n5:ERROR net down', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 场景：log.txt 共 6 行，ERROR 在第 2 行和第 5 行
# TODO: 用 grep -n 找出 ERROR 行并显示行号
# 输出格式是 行号:内容
`,
      },
      solutions: {
        bash: `grep -n "ERROR" log.txt`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"log.txt":{"type":"file","content":"INFO start\\nERROR disk full\\nWARN memory high\\nINFO retry\\nERROR net down\\nINFO done\\n"}}}}',
  },
  {
    id: 'linux-text-4',
    lang: 'linux',
    module: 'paradigm',
    order: 4,
    title: '排序 uniq -c',
    difficulty: 3,
    xp: 25,
    goals: [
      '理解 uniq 只合并相邻重复行，因此要先 sort',
      '掌握 sort | uniq -c 管道统计用法',
      '熟悉 -c 输出格式：4 字符宽右对齐计数 + 空格 + 内容',
    ],
    brief: `## 排序与去重计数：先排队，再点数

\`uniq\` 只把**相邻**的重复行合并 —— 就像点名时只统计"连着站在一起"的同名同学。想统计每种水果出现几次，必须先用 \`sort\` 把相同的水果排到一起：

\`\`\`bash
sort fruits.txt | uniq -c
\`\`\`

管道 \`|\` 把左边命令的输出接到右边命令的输入，像水流过一节节管子。

\`-c\`（count）给每行加上出现次数，格式很讲究：**计数占 4 个字符宽、右对齐**，后接一个空格和内容 —— 数字 3 会显示成 \`   3\`（前面三个空格）。这个格式是判题比对的一部分，空格一个都不能少。`,
    task: `## 任务：水果盘点

场景：主目录下有 \`fruits.txt\`，共 8 行水果名（有重复）：

\`\`\`text
apple
banana
apple
cherry
banana
apple
banana
cherry
\`\`\`

用 \`sort | uniq -c\` 统计每种水果的数量。

**输入**：无

**期望输出**（三行，注意计数的空格宽度）：

\`\`\`text
   3 apple
   3 banana
   2 cherry
\`\`\``,
    starter: `# uniq 只合并"相邻"的重复行，所以要先 sort
# TODO: 用管道把 sort 和 uniq -c 串起来
# 注意 -c 的计数占 4 个字符宽、右对齐
`,
    solution: `sort fruits.txt | uniq -c`,
    hints: [
      '管道写法：`sort fruits.txt | uniq -c` —— 先排序聚拢相同水果，再去重计数。',
      '计数是右对齐 4 字符宽：个位数前面有 3 个空格，像 `   3 apple`。',
      '完整输出三行：`   3 apple` / `   3 banana` / `   2 cherry`（每行开头的空格也要精确）。',
    ],
    tests: [
      { name: 'sort 聚拢重复项', stdin: '', expected: '   3 apple\n   3 banana\n   2 cherry' },
      { name: 'uniq -c 计数正确', stdin: '', expected: '   3 apple\n   3 banana\n   2 cherry' },
      { name: '计数 4 宽度右对齐', stdin: '', expected: '   3 apple\n   3 banana\n   2 cherry' },
      { name: '隐藏：格式逐字符匹配', stdin: '', expected: '   3 apple\n   3 banana\n   2 cherry', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# uniq 只合并"相邻"的重复行，所以要先 sort
# TODO: 用管道把 sort 和 uniq -c 串起来
# 注意 -c 的计数占 4 个字符宽、右对齐
`,
      },
      solutions: {
        bash: `sort fruits.txt | uniq -c`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"fruits.txt":{"type":"file","content":"apple\\nbanana\\napple\\ncherry\\nbanana\\napple\\nbanana\\ncherry\\n"}}}}',
  },
  {
    id: 'linux-text-5',
    lang: 'linux',
    module: 'paradigm',
    order: 5,
    title: '管道组合拳',
    difficulty: 3,
    xp: 30,
    goals: [
      '理解管道把多个命令串成一条处理流水线',
      '掌握 grep 过滤 + wc -l 计数的经典组合',
      '能从访问日志中统计 404 请求次数',
    ],
    brief: `## 管道：小命令的流水线

Unix 的哲学是"每个命令只做一件事，管道让它们协作"。\`|\` 把左边命令的输出**原封不动**接到右边命令的输入：

\`\`\`bash
grep "404" access.log | wc -l
\`\`\`

这一行做了两件事：\`grep\` 先从日志里捞出含 \`404\` 的行，\`wc -l\` 再数出这些行有**几行**，输出一个纯数字。

\`wc\`（word count）是计数器：\`-l\` 数行、\`-w\` 数词、\`-c\` 数字符。\`grep | wc -l\` 是日志分析里出镜率最高的组合拳 —— "有多少条满足条件？"一问便知。`,
    task: `## 任务：统计 404 次数

场景：主目录下有 \`access.log\`，共 6 行访问记录，格式为 \`IP METHOD PATH STATUS\`：

\`\`\`text
192.168.1.10 GET /index.html 200
192.168.1.11 GET /logo.png 200
172.16.0.8 GET /missing.html 404
192.168.1.12 POST /api/login 200
10.0.0.9 GET /old-link 404
192.168.1.15 GET /about.html 200
\`\`\`

用一条管道命令统计状态码为 \`404\` 的请求条数。

**输入**：无

**期望输出**（一个数字）：

\`\`\`text
2
\`\`\``,
    starter: `# 场景：access.log 有 6 行访问记录，格式 IP METHOD PATH STATUS
# TODO: 用 grep 过滤出含 404 的行，再用 wc -l 数出有几行
# 用管道 | 把两个命令连起来
`,
    solution: `grep "404" access.log | wc -l`,
    hints: [
      '先过滤：`grep "404" access.log` 会输出两行含 404 的记录。',
      '再计数：`wc -l` 数出行数。用管道连起来：`grep "404" access.log | wc -l`。',
      '最终输出一个数字：`2`。',
    ],
    tests: [
      { name: 'grep 过滤 404 行', stdin: '', expected: '2' },
      { name: 'wc -l 计数正确', stdin: '', expected: '2' },
      { name: '输出为数字 2', stdin: '', expected: '2' },
      { name: '隐藏：单条管道命令验证', stdin: '', expected: '2', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 场景：access.log 有 6 行访问记录，格式 IP METHOD PATH STATUS
# TODO: 用 grep 过滤出含 404 的行，再用 wc -l 数出有几行
# 用管道 | 把两个命令连起来
`,
      },
      solutions: {
        bash: `grep "404" access.log | wc -l`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"access.log":{"type":"file","content":"192.168.1.10 GET /index.html 200\\n192.168.1.11 GET /logo.png 200\\n172.16.0.8 GET /missing.html 404\\n192.168.1.12 POST /api/login 200\\n10.0.0.9 GET /old-link 404\\n192.168.1.15 GET /about.html 200\\n"}}}}',
  },
];
