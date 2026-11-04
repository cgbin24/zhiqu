import type { Level } from '@/types';

/** Linux 课程 · 综合实战（integration 模块，5 关） */
export const LINUX_INTEGRATION: Level[] = [
  {
    id: 'linux-integration-1',
    lang: 'linux',
    module: 'integration',
    order: 1,
    title: '项目部署模拟',
    difficulty: 4,
    xp: 35,
    goals: [
      '模拟部署验收：查看应用配置并确认入口文件存在',
      '会把多条检查命令分行组合（模拟器不支持 &&）',
      '理解 /opt 是第三方应用的传统安装位置',
    ],
    brief: `## 部署验收：先看配置，再点名字

应用部署到服务器后，运维验收的标准动作是两连查：

\`\`\`bash
cat config.json    # ① 读配置：端口、开关对不对
ls app.js          # ② 点名：入口文件在不在
\`\`\`

真实 bash 可以用 \`&&\` 把两条命令串成一行（\`cat config.json && ls app.js\`），前一条成功才执行后一条。本模拟器的规矩：**一行一条命令，分行写**，效果相同。

应用的家在 \`/opt/app\` —— \`/opt\` 是第三方软件的传统安装位置。\`node_modules/\` 则是 Node.js 项目的依赖仓库，成千上万个包都住在里面。`,
    task: `## 任务：验收刚部署的应用

场景：一个 Node.js 应用刚部署到 \`/opt/app\`（你正站在那里），里面有入口文件 \`app.js\`、配置 \`config.json\` 和依赖目录 \`node_modules/\`。

按顺序完成两步检查（分两行写）：

1. \`cat\` 输出 \`config.json\` 的内容
2. \`ls\` 确认 \`app.js\` 存在

**输入**：无

**期望输出**（前 4 行是配置，最后 1 行是文件名）：

\`\`\`text
{
  "name": "codequest-api",
  "port": 3000,
  "debug": false
}
app.js
\`\`\``,
    starter: `# 部署验收：① 读配置 ② 确认入口文件存在
# 模拟器不支持 &&，两条命令分两行写
# TODO 1: cat config.json
# TODO 2: ls app.js
`,
    solution: `cat config.json
ls app.js`,
    hints: [
      '分两行写：第一行 `cat config.json` 读配置，第二行 `ls app.js` 确认入口文件。',
      '你已经在 /opt/app 里，config.json 和 app.js 直接用文件名（相对路径）就能访问。',
      '期望输出 5 行：前 4 行是 JSON 配置，最后一行是 app.js。',
    ],
    tests: [
      { name: '读出应用配置', stdin: '', expected: '{\n  "name": "codequest-api",\n  "port": 3000,\n  "debug": false\n}\napp.js' },
      { name: '确认入口文件存在', stdin: '', expected: '{\n  "name": "codequest-api",\n  "port": 3000,\n  "debug": false\n}\napp.js' },
      { name: '组合输出完整', stdin: '', expected: '{\n  "name": "codequest-api",\n  "port": 3000,\n  "debug": false\n}\napp.js' },
      { name: '隐藏：验收输出逐字符匹配', stdin: '', expected: '{\n  "name": "codequest-api",\n  "port": 3000,\n  "debug": false\n}\napp.js', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 部署验收：① 读配置 ② 确认入口文件存在
# 模拟器不支持 &&，两条命令分两行写
# TODO 1: cat config.json
# TODO 2: ls app.js
`,
      },
      solutions: {
        bash: `cat config.json
ls app.js`,
      },
    },
    fs: '{"cwd":"/opt/app","tree":{"type":"dir","children":{"app.js":{"type":"file","content":"const config = require(\\"./config.json\\");\\nconsole.log(\\"API on port \\" + config.port);\\n"},"config.json":{"type":"file","content":"{\\n  \\"name\\": \\"codequest-api\\",\\n  \\"port\\": 3000,\\n  \\"debug\\": false\\n}\\n"},"node_modules":{"type":"dir","children":{"express":{"type":"dir","children":{"index.js":{"type":"file","content":"module.exports = function express() {};\\n"}}}}}}}}',
  },
  {
    id: 'linux-integration-2',
    lang: 'linux',
    module: 'integration',
    order: 2,
    title: '日志分析报告',
    difficulty: 4,
    xp: 35,
    goals: [
      '综合 grep 过滤 + wc -l 计数完成日志统计',
      '理解"过滤 → 计数"的报告生成思路',
      '能从 ERROR 数量判断服务健康状态',
    ],
    brief: `## 晨会报告：昨夜错了多少单

运维的清晨，常常从一条流水线开始：

\`\`\`bash
grep "ERROR" app.log | wc -l
\`\`\`

两节管道各司其职：

1. \`grep "ERROR"\` —— 漏斗只放行含 \`ERROR\` 的行
2. \`wc -l\` —— 数出放行了几行

一个数字，就是晨会上的"故障量"报告。这招综合了前面章节的核心功力：grep 文本过滤 + 管道 + wc 计数。模式套上引号是关键习惯 —— 引号告诉 shell"\`ERROR\` 是一个整体"。`,
    task: `## 任务：统计昨夜的错误日志

场景：你正站在 \`/var/log\` 目录，应用日志 \`app.log\` 共 10 行，混合了 \`INFO\`、\`WARN\`、\`ERROR\` 三种级别。

用一条管道命令统计其中 \`ERROR\` 日志的行数。

**输入**：无

**期望输出**（一个数字）：

\`\`\`text
3
\`\`\``,
    starter: `# 晨会报告：统计 ERROR 日志行数
# 流水线：grep 过滤 → wc -l 计数
# TODO: 用管道组合 grep 与 wc -l，统计 app.log 里的 ERROR 行数
`,
    solution: `grep "ERROR" app.log | wc -l`,
    hints: [
      '先想数据流：grep 从 app.log 里筛出 ERROR 行，wc -l 再数行数。',
      '管道连接：`grep "ERROR" app.log | wc -l` —— 模式加引号是好习惯。',
      'app.log 里含 ERROR 的日志共 3 行，最终输出就是数字 3。',
    ],
    tests: [
      { name: '过滤 ERROR 日志', stdin: '', expected: '3' },
      { name: '计数结果正确', stdin: '', expected: '3' },
      { name: '输出为数字 3', stdin: '', expected: '3' },
      { name: '隐藏：流水线结果逐字符匹配', stdin: '', expected: '3', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 晨会报告：统计 ERROR 日志行数
# 流水线：grep 过滤 → wc -l 计数
# TODO: 用管道组合 grep 与 wc -l，统计 app.log 里的 ERROR 行数
`,
      },
      solutions: {
        bash: `grep "ERROR" app.log | wc -l`,
      },
    },
    fs: '{"cwd":"/var/log","tree":{"type":"dir","children":{"app.log":{"type":"file","content":"INFO server started on port 3000\\nWARN response time exceeded 500ms\\nERROR db connection refused\\nINFO health check passed\\nERROR timeout on /api/orders\\nINFO cache warmed up\\nWARN retry attempt 3 for /api/pay\\nERROR disk usage reached 92%\\nINFO graceful reload done\\nINFO 8 requests served\\n"}}}}',
  },
  {
    id: 'linux-integration-3',
    lang: 'linux',
    module: 'integration',
    order: 3,
    title: '文件系统探索',
    difficulty: 3,
    xp: 30,
    goals: [
      '会用 find 按名字模式在目录树中搜索文件',
      '理解 -name 与通配符模式 "*.conf" 的配合',
      '熟悉多层目录树的探索方法',
    ],
    brief: `## find：给整棵目录树做地毯式搜索

"配置文件到底散落在哪？" —— \`ls\` 只能看一层，\`find\` 能**钻进整棵树**：

\`\`\`bash
find /home/student -name "*.conf"
\`\`\`

- 第一个参数是**搜索起点**，它整棵子树都会被翻遍
- \`-name "*.conf"\` 按名字匹配：\`*\` 是通配符，代表"任意文件名"，合起来就是"以 .conf 结尾"
- 每找到一个，输出一行路径

小提醒：本模拟器的 find 输出路径**不带开头的 \`/\`**（如 \`home/student/...\`），与真实 shell 略有差异 —— 以模拟器实际输出为准。`,
    task: `## 任务：找出所有配置文件

场景：主目录 \`/home/student\` 下有一棵多层目录树：\`configs/\`、\`projects/db/\`、\`projects/web/\` 等目录里散落着各种文件。

用 \`find\` 从 \`/home/student\` 出发，找出所有以 \`.conf\` 结尾的文件。

**输入**：无

**期望输出**（3 行路径，按目录树顺序）：

\`\`\`text
home/student/configs/redis.conf
home/student/projects/db/mysql.conf
home/student/projects/web/nginx.conf
\`\`\``,
    starter: `# find 能钻进整棵目录树，-name 按名字模式匹配
# TODO: 从 /home/student 出发，找出所有 .conf 结尾的文件
`,
    solution: `find /home/student -name "*.conf"`,
    hints: [
      'find 的两个要素：从哪找（起点目录）+ 找什么（-name 模式）。',
      '模式要加引号：`find /home/student -name "*.conf"` —— * 通配任意文件名，只留 .conf 结尾的。',
      '共 3 个 .conf：configs 下的 redis、projects/db 下的 mysql、projects/web 下的 nginx；注意输出路径不带开头的 /。',
    ],
    tests: [
      { name: '按名字模式搜索', stdin: '', expected: 'home/student/configs/redis.conf\nhome/student/projects/db/mysql.conf\nhome/student/projects/web/nginx.conf' },
      { name: '三个配置文件全部找到', stdin: '', expected: 'home/student/configs/redis.conf\nhome/student/projects/db/mysql.conf\nhome/student/projects/web/nginx.conf' },
      { name: '覆盖多层子目录', stdin: '', expected: 'home/student/configs/redis.conf\nhome/student/projects/db/mysql.conf\nhome/student/projects/web/nginx.conf' },
      { name: '隐藏：路径列表逐字符匹配', stdin: '', expected: 'home/student/configs/redis.conf\nhome/student/projects/db/mysql.conf\nhome/student/projects/web/nginx.conf', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# find 能钻进整棵目录树，-name 按名字模式匹配
# TODO: 从 /home/student 出发，找出所有 .conf 结尾的文件
`,
      },
      solutions: {
        bash: `find /home/student -name "*.conf"`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"configs":{"type":"dir","children":{"redis.conf":{"type":"file","content":"bind 127.0.0.1\\nport 6379\\n"}}},"projects":{"type":"dir","children":{"db":{"type":"dir","children":{"mysql.conf":{"type":"file","content":"[mysqld]\\nport=3306\\n"}}},"web":{"type":"dir","children":{"index.html":{"type":"file","content":"<h1>hello</h1>\\n"},"nginx.conf":{"type":"file","content":"server {\\n  listen 80;\\n}\\n"}}}}},"notes.txt":{"type":"file","content":"find 是搜索文件的好工具\\n"}}}}',
  },
  {
    id: 'linux-integration-4',
    lang: 'linux',
    module: 'integration',
    order: 4,
    title: '批量文件操作',
    difficulty: 4,
    xp: 35,
    goals: [
      '理解 shell 通配符（glob）的作用：真实世界 ls *.csv 的写法',
      '会用 find -name + wc -l 统计指定类型的文件数量（模拟器等价写法）',
      '体验批量数据处理前的清点步骤',
    ],
    brief: `## 批量处理第一步：先清点

处理一批数据文件前，先数清楚有多少份。真实 shell 用**通配符**（glob）：

\`\`\`bash
ls /tmp/batch/*.csv | wc -l    # * 匹配任意文件名
\`\`\`

本模拟器不支持通配符展开，用 \`find\` 达成同样目标：

\`\`\`bash
find /tmp/batch -name "*.csv" | wc -l
\`\`\`

\`find\` 把每个匹配文件的路径各输出一行，\`wc -l\` 一数 —— 清点完成。这是"探索（find）→ 计数（wc）"的组合拳，也是批量脚本的固定开场白。`,
    task: `## 任务：清点待处理的批量数据

场景：\`/tmp/batch\` 目录里躺着 10 份 \`.csv\` 数据文件（\`data_01.csv\` 到 \`data_10.csv\`），还有一个混进来的 \`readme.txt\`。你正站在这个目录里。

用一条管道命令统计 \`/tmp/batch\` 下 \`.csv\` 文件的数量。

**输入**：无

**期望输出**（一个数字）：

\`\`\`text
10
\`\`\``,
    starter: `# 批量处理前先清点：真实 shell 用 ls /tmp/batch/*.csv | wc -l
# 本模拟器不支持通配符，用 find -name 加 wc -l 组合
# TODO: 统计 /tmp/batch 下 .csv 文件的数量
`,
    solution: `find /tmp/batch -name "*.csv" | wc -l`,
    hints: [
      '真实 shell 的 `ls /tmp/batch/*.csv | wc -l` 用了通配符；本模拟器用 find 等价替代。',
      '组合拳：`find /tmp/batch -name "*.csv" | wc -l` —— find 逐行输出匹配路径，wc -l 负责数数。',
      '目录里还有个 readme.txt 会干扰吗？不会 —— 模式 *.csv 只匹配 csv 文件，答案是 10。',
    ],
    tests: [
      { name: '统计 csv 文件数量', stdin: '', expected: '10' },
      { name: '忽略非 csv 文件', stdin: '', expected: '10' },
      { name: '输出为数字 10', stdin: '', expected: '10' },
      { name: '隐藏：清点结果逐字符匹配', stdin: '', expected: '10', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 批量处理前先清点：真实 shell 用 ls /tmp/batch/*.csv | wc -l
# 本模拟器不支持通配符，用 find -name 加 wc -l 组合
# TODO: 统计 /tmp/batch 下 .csv 文件的数量
`,
      },
      solutions: {
        bash: `find /tmp/batch -name "*.csv" | wc -l`,
      },
    },
    fs: '{"cwd":"/tmp/batch","tree":{"type":"dir","children":{"data_01.csv":{"type":"file","content":"id,value\\n1,101\\n2,201\\n"},"data_02.csv":{"type":"file","content":"id,value\\n1,102\\n2,202\\n"},"data_03.csv":{"type":"file","content":"id,value\\n1,103\\n2,203\\n"},"data_04.csv":{"type":"file","content":"id,value\\n1,104\\n2,204\\n"},"data_05.csv":{"type":"file","content":"id,value\\n1,105\\n2,205\\n"},"data_06.csv":{"type":"file","content":"id,value\\n1,106\\n2,206\\n"},"data_07.csv":{"type":"file","content":"id,value\\n1,107\\n2,207\\n"},"data_08.csv":{"type":"file","content":"id,value\\n1,108\\n2,208\\n"},"data_09.csv":{"type":"file","content":"id,value\\n1,109\\n2,209\\n"},"data_10.csv":{"type":"file","content":"id,value\\n1,1010\\n2,2010\\n"},"readme.txt":{"type":"file","content":"batch input directory\\n"}}}}',
  },
  {
    id: 'linux-integration-5',
    lang: 'linux',
    module: 'integration',
    order: 5,
    title: '备份与恢复',
    difficulty: 4,
    xp: 35,
    goals: [
      '会用 mkdir 建立备份目录、cp 复制整个数据目录',
      '理解"复制 → 验证"的备份流程',
      '了解真实世界 cp -r 与模拟器 cp 的差异',
    ],
    brief: `## 备份：复制一份，再亲眼确认

数据无价，动手前先备份。标准三步：

\`\`\`bash
mkdir /backup                          # ① 建备份仓
cp /home/student/data /backup/data_bak # ② 整目录复制
ls /backup/data_bak                    # ③ 亲眼确认
\`\`\`

- 真实 bash 复制目录要加 \`-r\`（recursive 递归）；本模拟器的 \`cp\` **天生支持目录**，直接复制即可
- 备份目标名 \`data_bak\` 自拟，"原始名 + _bak" 是常见习惯
- 第 ③ 步不可省 —— 备份了却没验证，等于没备份

 Linux 课程到此毕业：mkdir、cp、ls 三条基础命令，串起来就是一次可靠的备份作业。`,
    task: `## 任务：给数据目录做一次完整备份

场景：主目录 \`/home/student\` 下有宝贵的数据目录 \`data/\`（内含 users.csv、orders.csv、settings.conf 三个文件），\`/backup\` 还不存在。

按顺序完成备份三步（分三行写）：

1. \`mkdir\` 创建 \`/backup\` 目录
2. \`cp\` 把 \`/home/student/data\` 整个复制为 \`/backup/data_bak\`
3. \`ls\` 查看 \`/backup/data_bak\`，验证备份内容

**输入**：无

**期望输出**（一行，3 个文件名，之间是两个空格）：

\`\`\`text
orders.csv  settings.conf  users.csv
\`\`\``,
    starter: `# 备份三步：建仓 → 复制 → 验证
# 本模拟器的 cp 天生支持目录复制（无需 -r）
# TODO 1: mkdir 创建 /backup
# TODO 2: cp 把 /home/student/data 复制为 /backup/data_bak
# TODO 3: ls 验证备份内容
`,
    solution: `mkdir /backup
cp /home/student/data /backup/data_bak
ls /backup/data_bak`,
    hints: [
      '三步分行写：`mkdir /backup` → `cp /home/student/data /backup/data_bak` → `ls /backup/data_bak`。',
      '本模拟器的 cp 直接支持复制整个目录（真实 bash 要加 -r）；/backup 一开始不存在，必须先 mkdir。',
      '最后 ls 输出备份目录里的 3 个文件名，两个空格分隔 —— 备份完成。',
    ],
    tests: [
      { name: '备份目录创建成功', stdin: '', expected: 'orders.csv  settings.conf  users.csv' },
      { name: '整目录复制完成', stdin: '', expected: 'orders.csv  settings.conf  users.csv' },
      { name: '验证输出三个文件', stdin: '', expected: 'orders.csv  settings.conf  users.csv' },
      { name: '隐藏：备份验证逐字符匹配', stdin: '', expected: 'orders.csv  settings.conf  users.csv', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 备份三步：建仓 → 复制 → 验证
# 本模拟器的 cp 天生支持目录复制（无需 -r）
# TODO 1: mkdir 创建 /backup
# TODO 2: cp 把 /home/student/data 复制为 /backup/data_bak
# TODO 3: ls 验证备份内容
`,
      },
      solutions: {
        bash: `mkdir /backup
cp /home/student/data /backup/data_bak
ls /backup/data_bak`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"data":{"type":"dir","children":{"users.csv":{"type":"file","content":"id,name\\n1,alice\\n2,bob\\n3,carol\\n"},"orders.csv":{"type":"file","content":"order_id,user,amount\\n1001,alice,250\\n1002,bob,120\\n"},"settings.conf":{"type":"file","content":"theme=dark\\nlang=zh-CN\\n"}}}}}}',
  },
];
