import type { Level } from '@/types';

/** Linux 课程 · 权限与进程（advanced 模块，4 关） */
export const LINUX_PERM: Level[] = [
  {
    id: 'linux-perm-1',
    lang: 'linux',
    module: 'advanced',
    order: 1,
    title: '读权限位',
    difficulty: 2,
    xp: 20,
    goals: [
      '理解 rwx 权限位与八进制数字的对应（r=4, w=2, x=1）',
      '会用 chmod 为文件设置权限（755 / 600）',
      '会用 ls -l 查看文件详情列表',
    ],
    brief: `## 权限位：谁能碰这个文件

Linux 给每个文件挂了一块九宫格门牌：\`rwxrwxrwx\`，依次是**属主 / 属组 / 其他人**的读(r)、写(w)、执行(x) 权限。每位有分值：r=4、w=2、x=1，三个数字加起来就是三位八进制数：

- \`755\` = \`rwxr-xr-x\` —— 我能读写执行，别人只能读和执行（脚本的常见权限）
- \`600\` = \`rw-------\` —— 只有我能读写，别人免谈（私密文件的常见权限）

修改权限用 \`chmod\`（change mode）：

\`\`\`bash
chmod 755 script.sh    # 给脚本开放执行
chmod 600 secret.txt   # 私密文件锁好
\`\`\`

查看详情用 \`ls -l\`：每行依次是权限、链接数、属主、属组、字节数、日期、时间、文件名。

> ⚠️ 模拟器简化：chmod 会记录你设置的权限，但 \`ls -l\` 的权限列固定显示 \`-rw-r--r--\`，不会随 chmod 变化 —— 本关重点是 chmod 用法与 ls -l 的输出格式。`,
    task: `## 任务：给文件上锁

场景：主目录下有两个文件：

- \`script.sh\` —— 一个脚本（内容共 8 字节），应当人人可执行：设为 \`755\`
- \`secret.txt\` —— 私密文件（内容共 11 字节），只许自己读写：设为 \`600\`

1. 用 \`chmod\` 给两个文件分别设置上述权限
2. 用 \`ls -l\`（不带参数）查看主目录的文件详情

**输入**：无

**期望输出**（两行，按文件名字母序；大小列右对齐占 6 字符宽；权限列在模拟器中固定为 -rw-r--r--）：

\`\`\`text
-rw-r--r-- 1 student student      8 Jan  1 10:00 script.sh
-rw-r--r-- 1 student student     11 Jan  1 10:00 secret.txt
\`\`\``,
    starter: `# r=4, w=2, x=1：755 = rwxr-xr-x，600 = rw-------
# TODO 1: chmod 755 给 script.sh 开放执行
# TODO 2: chmod 600 锁好 secret.txt
# TODO 3: 用 ls -l 查看文件详情
`,
    solution: `chmod 755 script.sh
chmod 600 secret.txt
ls -l`,
    hints: [
      'chmod 的用法：`chmod 755 script.sh`、`chmod 600 secret.txt`，两条各占一行。',
      '查看详情要用不带参数的 `ls -l` —— 模拟器里对单个文件名执行 ls -l 只会显示文件名本身。',
      '输出两行，字母序 script.sh 在前；大小列分别为 8 和 11（右对齐占 6 字符宽），日期时间固定为 Jan  1 10:00（Jan 与 1 之间两个空格）。',
    ],
    tests: [
      { name: 'chmod 设置两种权限', stdin: '', expected: '-rw-r--r-- 1 student student      8 Jan  1 10:00 script.sh\n-rw-r--r-- 1 student student     11 Jan  1 10:00 secret.txt' },
      { name: 'ls -l 详情格式', stdin: '', expected: '-rw-r--r-- 1 student student      8 Jan  1 10:00 script.sh\n-rw-r--r-- 1 student student     11 Jan  1 10:00 secret.txt' },
      { name: '大小列右对齐 6 字符', stdin: '', expected: '-rw-r--r-- 1 student student      8 Jan  1 10:00 script.sh\n-rw-r--r-- 1 student student     11 Jan  1 10:00 secret.txt' },
      { name: '隐藏：两行逐字符匹配', stdin: '', expected: '-rw-r--r-- 1 student student      8 Jan  1 10:00 script.sh\n-rw-r--r-- 1 student student     11 Jan  1 10:00 secret.txt', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# r=4, w=2, x=1：755 = rwxr-xr-x，600 = rw-------
# TODO 1: chmod 755 给 script.sh 开放执行
# TODO 2: chmod 600 锁好 secret.txt
# TODO 3: 用 ls -l 查看文件详情
`,
      },
      solutions: {
        bash: `chmod 755 script.sh
chmod 600 secret.txt
ls -l`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"script.sh":{"type":"file","content":"echo hi\\n","mode":"644"},"secret.txt":{"type":"file","content":"top secret\\n","mode":"600"}}}}',
  },
  {
    id: 'linux-perm-2',
    lang: 'linux',
    module: 'advanced',
    order: 2,
    title: 'whoami 与身份',
    difficulty: 1,
    xp: 15,
    goals: [
      '会用 whoami 查看当前用户名',
      '理解 Linux 多用户概念：每个操作都有身份',
    ],
    brief: `## whoami：我是谁

Linux 是**多用户**系统 —— 每个进程都带着"身份证"在运行，文件能不能碰、目录能不能进，都先看身份。\`whoami\`（我是谁）打印当前登录的用户名：

\`\`\`bash
whoami    # 输出：student
\`\`\`

把用户想成游乐园手环：你是谁，决定你能玩哪些项目。本课程的模拟器里，你始终以 \`student\` 身份操作主目录 \`/home/student\`。真实服务器上，管理员也常用它确认自己有没有拿错账号 —— 用 root 身份手滑删文件可是大事故。`,
    task: `## 任务：报上名来

执行 \`whoami\`，查看当前用户名。

**输入**：无

**期望输出**：

\`\`\`text
student
\`\`\``,
    starter: `# Linux 是多用户系统，每个命令都以某个用户身份执行
# TODO: 用 whoami 查看当前用户名
`,
    solution: `whoami`,
    hints: [
      'whoami 不需要参数，也不需要文件名。',
      '本模拟器的用户固定为 student。',
      '完整答案就一行：`whoami`，输出 `student`。',
    ],
    tests: [
      { name: 'whoami 输出用户名', stdin: '', expected: 'student' },
      { name: '输出为 student', stdin: '', expected: 'student' },
      { name: '单条命令无参数', stdin: '', expected: 'student' },
      { name: '隐藏：输出精确匹配', stdin: '', expected: 'student', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# Linux 是多用户系统，每个命令都以某个用户身份执行
# TODO: 用 whoami 查看当前用户名
`,
      },
      solutions: {
        bash: `whoami`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{}}}',
  },
  {
    id: 'linux-perm-3',
    lang: 'linux',
    module: 'advanced',
    order: 3,
    title: '文件查找 find',
    difficulty: 2,
    xp: 20,
    goals: [
      '会用 find 按名字模式递归查找文件',
      '理解通配符 * 的含义',
      '熟悉模拟器的路径输出格式',
    ],
    brief: `## find：全楼搜查令

文件散落在层层目录里，\`find\` 是**搜查令**：从指定起点出发，把整棵子树翻个底朝天：

\`\`\`bash
find . -name "*.log"    # 从当前目录递归查找所有 .log 文件
\`\`\`

- \`.\` 是起点（当前目录）；也可以写具体目录，如 \`find logs -name "*.log"\`
- \`-name\` 按名字匹配，\`*\` 通配**任意多个字符**，\`*.log\` 即"以 .log 结尾"的名字

模拟器的输出是从根开始的完整路径（不带 \`./\` 前缀），例如 \`home/student/logs/app.log\`，每行一条，按目录层级先后输出。`,
    task: `## 任务：找出所有日志文件

场景：

\`\`\`text
/home/student
├── docs/
│   └── notes.txt
├── logs/
│   ├── app.log
│   └── error.log
└── readme.txt
\`\`\`

用 \`find\` 找出主目录下所有 \`.log\` 文件。

**输入**：无

**期望输出**（两行完整路径）：

\`\`\`text
home/student/logs/app.log
home/student/logs/error.log
\`\`\``,
    starter: `# find 起点 -name "模式"：* 通配任意字符
# TODO: 从当前目录（.）查找所有以 .log 结尾的文件
# 注意观察输出的路径格式
`,
    solution: `find . -name "*.log"`,
    hints: [
      '起点写 `.`（当前目录）：`find . -name "*.log"`。',
      '模式要加引号，防止被拆散：`-name "*.log"`。',
      '输出是从根开始的完整路径、不带 ./ 前缀，共两行：`home/student/logs/app.log` 和 `home/student/logs/error.log`。',
    ],
    tests: [
      { name: 'find 按通配符查找', stdin: '', expected: 'home/student/logs/app.log\nhome/student/logs/error.log' },
      { name: '递归搜索子目录', stdin: '', expected: 'home/student/logs/app.log\nhome/student/logs/error.log' },
      { name: '输出完整相对路径', stdin: '', expected: 'home/student/logs/app.log\nhome/student/logs/error.log' },
      { name: '隐藏：输出精确匹配', stdin: '', expected: 'home/student/logs/app.log\nhome/student/logs/error.log', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# find 起点 -name "模式"：* 通配任意字符
# TODO: 从当前目录（.）查找所有以 .log 结尾的文件
# 注意观察输出的路径格式
`,
      },
      solutions: {
        bash: `find . -name "*.log"`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"docs":{"type":"dir","children":{"notes.txt":{"type":"file","content":"meeting at 3pm\\n"}}},"logs":{"type":"dir","children":{"app.log":{"type":"file","content":"log line\\n"},"error.log":{"type":"file","content":"log line\\n"}}},"readme.txt":{"type":"file","content":"welcome\\n"}}}}',
  },
  {
    id: 'linux-perm-4',
    lang: 'linux',
    module: 'advanced',
    order: 4,
    title: '日期与身份组合',
    difficulty: 2,
    xp: 20,
    goals: [
      '组合使用 whoami 与 pwd 输出身份与位置',
      '了解 date 命令（输出当天日期）及其在判题中的限制',
      '记住：模拟器不支持 && 与 ;，多命令就分行写',
    ],
    brief: `## 日期、身份与位置

再看两个信息型命令：

- \`date\` 输出今天的日期（ISO 格式，如 \`2026-11-04\`）—— 真实脚本里常用来给日志、备份文件打时间戳。不过**判题不能使用它**：日期天天变，标准答案没法固定，所以本关的任务改用输出固定的命令。
- \`pwd\` 报位置、\`whoami\` 报身份，组合起来就是"谁、在哪"：

\`\`\`bash
whoami
pwd
\`\`\`

> ⚠️ 本模拟器**不支持** \`&&\` 和 \`;\` 串联 —— 想执行多条命令，一行一条从上往下写即可，效果与脚本完全相同。写成 \`whoami && pwd\` 会得到错误结果。`,
    task: `## 任务：谁在何处

用两条命令组合，依次输出当前用户与当前目录：

1. \`whoami\` —— 输出用户名
2. \`pwd\` —— 输出当前目录

**输入**：无

**期望输出**（两行）：

\`\`\`text
student
/home/student
\`\`\``,
    starter: `# 模拟器不支持 && 和 ; —— 多条命令请一行一条分开写
# TODO 1: 用 whoami 输出当前用户
# TODO 2: 用 pwd 输出当前目录
`,
    solution: `whoami
pwd`,
    hints: [
      '不要写 `whoami && pwd` —— 模拟器不支持 &&，要分成两行。',
      '第一行 `whoami`，第二行 `pwd`，各自输出一行。',
      '完整输出两行：`student` 和 `/home/student`。',
    ],
    tests: [
      { name: 'whoami 与 pwd 组合', stdin: '', expected: 'student\n/home/student' },
      { name: '两行命令各输出一行', stdin: '', expected: 'student\n/home/student' },
      { name: '身份与位置输出正确', stdin: '', expected: 'student\n/home/student' },
      { name: '隐藏：输出精确匹配', stdin: '', expected: 'student\n/home/student', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 模拟器不支持 && 和 ; —— 多条命令请一行一条分开写
# TODO 1: 用 whoami 输出当前用户
# TODO 2: 用 pwd 输出当前目录
`,
      },
      solutions: {
        bash: `whoami
pwd`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{}}}',
  },
];
