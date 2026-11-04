import type { Level } from '@/types';

/** Linux 课程 · 系统管理实战（best 模块，5 关） */
export const LINUX_BEST: Level[] = [
  {
    id: 'linux-best-1',
    lang: 'linux',
    module: 'best',
    order: 1,
    title: '服务状态检查',
    difficulty: 2,
    xp: 20,
    goals: [
      '了解 systemd 服务与单元文件的概念',
      '会用 ls 加绝对路径查看服务目录 /etc/systemd/system',
      '建立"站在哪、看什么"的运维巡检视角',
    ],
    brief: `## systemctl：服务管理的总开关

Linux 服务器上跑着的每个后台程序（网站、SSH、定时任务……）都叫**服务**，统一管理它们的管家叫 **systemd**。真实世界里查看服务状态用：

\`\`\`bash
systemctl status nginx
\`\`\`

本模拟器走简化路线：**服务装没装，先看服务目录**。自启动服务都以单元文件（\`.service\`）的形式登记在 \`/etc/systemd/system/\` 里，用 \`ls\` 加**绝对路径**就能看到服务清单：

\`\`\`bash
ls /etc/systemd/system/
\`\`\`

绝对路径以 \`/\` 开头，从根目录一路指到目的地 —— 不管当前站在哪里，都能一步到位。这是巡检工作的第一眼。`,
    task: `## 任务：盘点服务器上的服务

场景：你刚登录一台服务器，当前位于 \`/etc/systemd/system\` 目录，需要清点已登记的服务单元。

用 \`ls\` 列出 \`/etc/systemd/system/\` 目录下的服务清单。

**输入**：无

**期望输出**（一行，4 个服务单元名，之间是两个空格）：

\`\`\`text
cron.service  docker.service  nginx.service  sshd.service
\`\`\``,
    starter: `# 真实世界用 systemctl status <服务名> 查看服务状态
# 本模拟器简化：先列出服务单元目录，盘点机器上有哪些服务
# TODO: 用 ls 加绝对路径查看 /etc/systemd/system/
`,
    solution: `ls /etc/systemd/system/`,
    hints: [
      'ls 后面可以直接跟绝对路径（以 / 开头），不用管当前站在哪：`ls /etc/systemd/system/`。',
      '路径末尾的 / 可有可无，但目录名别拼错：是 systemd（以 d 结尾）而不是 system。',
      '完整答案一行：`ls /etc/systemd/system/`，输出 4 个 .service 单元名，按字母序排好。',
    ],
    tests: [
      { name: '列出服务单元目录', stdin: '', expected: 'cron.service  docker.service  nginx.service  sshd.service' },
      { name: '绝对路径访问 /etc', stdin: '', expected: 'cron.service  docker.service  nginx.service  sshd.service' },
      { name: '服务清单完整', stdin: '', expected: 'cron.service  docker.service  nginx.service  sshd.service' },
      { name: '隐藏：服务列表逐字符匹配', stdin: '', expected: 'cron.service  docker.service  nginx.service  sshd.service', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 真实世界用 systemctl status <服务名> 查看服务状态
# 本模拟器简化：先列出服务单元目录，盘点机器上有哪些服务
# TODO: 用 ls 加绝对路径查看 /etc/systemd/system/
`,
      },
      solutions: {
        bash: `ls /etc/systemd/system/`,
      },
    },
    fs: '{"cwd":"/etc/systemd/system","tree":{"type":"dir","children":{"nginx.service":{"type":"file","content":"[Unit]\\nDescription=NGINX web server\\n\\n[Service]\\nExecStart=/usr/sbin/nginx\\nRestart=on-failure\\n\\n[Install]\\nWantedBy=multi-user.target\\n"},"sshd.service":{"type":"file","content":"[Unit]\\nDescription=OpenBSD Secure Shell server\\n\\n[Service]\\nExecStart=/usr/sbin/sshd -D\\n\\n[Install]\\nWantedBy=multi-user.target\\n"},"docker.service":{"type":"file","content":"[Unit]\\nDescription=Docker Application Container Engine\\n\\n[Service]\\nExecStart=/usr/bin/dockerd\\n\\n[Install]\\nWantedBy=multi-user.target\\n"},"cron.service":{"type":"file","content":"[Unit]\\nDescription=Regular background program processing daemon\\n\\n[Service]\\nExecStart=/usr/sbin/cron -f\\n\\n[Install]\\nWantedBy=multi-user.target\\n"}}}}',
  },
  {
    id: 'linux-best-2',
    lang: 'linux',
    module: 'best',
    order: 2,
    title: '日志轮转审计',
    difficulty: 3,
    xp: 25,
    goals: [
      '会用 ls -l 以长格式查看文件大小与时间',
      '理解 -a 的作用：连隐藏文件（. 开头）一起列出',
      '了解 /var/log 是系统日志的家、logrotate 负责日志轮转',
    ],
    brief: `## /var/log：系统的日记本

Linux 把系统与应用日志集中放在 \`/var/log/\`：\`auth.log\` 记登录、\`kern.log\` 记内核、\`syslog\` 记一切杂项。日志由 **logrotate** 定期"轮转"—— 旧日志改名归档、新文件接着写，防止日记本无限变厚。

巡检日志目录要看**大小和时间**，这就需要长格式：

\`\`\`bash
ls -la /var/log/
\`\`\`

- **\`-l\`**：长格式，每行一条记录，依次是权限、链接数、属主、属组、**大小（字节）**、日期、时间、文件名
- **\`-a\`**：all，把 \`.\` 开头的**隐藏文件**也列出来（审计标记、临时快照常藏在这里）
- 两个短选项可以合并写成 \`-la\`

运维审计的第一步，就是对着这张清单看：哪个日志突然变大了？哪个文件不该出现在这里？`,
    task: `## 任务：巡检日志目录

场景：你正站在 \`/var/log\` 目录做例行审计，目录里有 4 个日志文件和 1 个隐藏的审计标记文件。

用 \`ls -la\` 长格式列出 \`/var/log/\` 的全部内容（含隐藏文件）。

**输入**：无

**期望输出**（5 行，注意大小列的空格对齐）：

\`\`\`text
-rw-r--r-- 1 student student     37 Jan  1 10:00 .last_audit
-rw-r--r-- 1 student student    162 Jan  1 10:00 auth.log
-rw-r--r-- 1 student student    112 Jan  1 10:00 boot.log
-rw-r--r-- 1 student student    105 Jan  1 10:00 kern.log
-rw-r--r-- 1 student student    112 Jan  1 10:00 syslog
\`\`\``,
    starter: `# 巡检日志要看大小与时间：ls -l 长格式
# 别忘了隐藏文件：-a 会把 . 开头的文件也列出来
# TODO: 用 ls -la 查看 /var/log/ 目录
`,
    solution: `ls -la /var/log/`,
    hints: [
      '两个短选项可以合并：`ls -la` 等价于 `ls -l -a`；目录参数用绝对路径 `/var/log/`。',
      '长格式每行依次是：权限、链接数、属主、属组、大小、日期、时间、文件名；. 开头的那行是隐藏文件。',
      '完整答案：`ls -la /var/log/`，共 5 行，第一行就是 .last_audit。',
    ],
    tests: [
      { name: '长格式列出日志目录', stdin: '', expected: '-rw-r--r-- 1 student student     37 Jan  1 10:00 .last_audit\n-rw-r--r-- 1 student student    162 Jan  1 10:00 auth.log\n-rw-r--r-- 1 student student    112 Jan  1 10:00 boot.log\n-rw-r--r-- 1 student student    105 Jan  1 10:00 kern.log\n-rw-r--r-- 1 student student    112 Jan  1 10:00 syslog' },
      { name: '隐藏文件 .last_audit 可见', stdin: '', expected: '-rw-r--r-- 1 student student     37 Jan  1 10:00 .last_audit\n-rw-r--r-- 1 student student    162 Jan  1 10:00 auth.log\n-rw-r--r-- 1 student student    112 Jan  1 10:00 boot.log\n-rw-r--r-- 1 student student    105 Jan  1 10:00 kern.log\n-rw-r--r-- 1 student student    112 Jan  1 10:00 syslog' },
      { name: '5 条记录逐行完整', stdin: '', expected: '-rw-r--r-- 1 student student     37 Jan  1 10:00 .last_audit\n-rw-r--r-- 1 student student    162 Jan  1 10:00 auth.log\n-rw-r--r-- 1 student student    112 Jan  1 10:00 boot.log\n-rw-r--r-- 1 student student    105 Jan  1 10:00 kern.log\n-rw-r--r-- 1 student student    112 Jan  1 10:00 syslog' },
      { name: '隐藏：大小列逐字符匹配', stdin: '', expected: '-rw-r--r-- 1 student student     37 Jan  1 10:00 .last_audit\n-rw-r--r-- 1 student student    162 Jan  1 10:00 auth.log\n-rw-r--r-- 1 student student    112 Jan  1 10:00 boot.log\n-rw-r--r-- 1 student student    105 Jan  1 10:00 kern.log\n-rw-r--r-- 1 student student    112 Jan  1 10:00 syslog', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 巡检日志要看大小与时间：ls -l 长格式
# 别忘了隐藏文件：-a 会把 . 开头的文件也列出来
# TODO: 用 ls -la 查看 /var/log/ 目录
`,
      },
      solutions: {
        bash: `ls -la /var/log/`,
      },
    },
    fs: '{"cwd":"/var/log","tree":{"type":"dir","children":{".last_audit":{"type":"file","content":"2026-10-31 22:00 weekly audit passed\\n"},"auth.log":{"type":"file","content":"Jan  1 09:12 sshd[412]: Accepted publickey for student\\nJan  1 09:13 sudo: student : TTY=pts/0 ; COMMAND=/bin/ls\\nJan  1 10:02 sshd[501]: Failed password for admin\\n"},"boot.log":{"type":"file","content":"Jan  1 08:00 systemd: Starting Daily apt download activities...\\nJan  1 08:00 systemd: Started NGINX web server.\\n"},"kern.log":{"type":"file","content":"Jan  1 08:00 kernel: Linux version 6.8.0-generic\\nJan  1 08:01 kernel: EXT4-fs (sda1): mounted filesystem\\n"},"syslog":{"type":"file","content":"Jan  1 09:00 cron[220]: (root) CMD (/usr/local/bin/backup.sh)\\nJan  1 09:10 systemd: logrotate.service succeeded\\n"}}}}',
  },
  {
    id: 'linux-best-3',
    lang: 'linux',
    module: 'best',
    order: 3,
    title: '磁盘使用分析',
    difficulty: 3,
    xp: 25,
    goals: [
      '了解 du -sh 统计目录占用的真实用法',
      '会用 ls -l 长格式的大小列做简化版磁盘分析',
      '理解目录固定 4096、文件按字节计大小的差异',
    ],
    brief: `## du：目录到底占多大

"磁盘怎么又满了？" —— 真实世界的第一反应是：

\`\`\`bash
du -sh /home/student/*    # 统计每个条目的占用：-s 汇总，-h 人类可读
\`\`\`

本模拟器没有 \`du\`，用 \`ls -l\` 的**大小列**做简化模拟。你已经在主目录里，直接执行：

\`\`\`bash
ls -l
\`\`\`

- **目录**统一显示 \`4096\`（目录项的固定占位大小）
- **文件**显示真实字节大小 —— 内容多长，数字就是多少

对比每一行的大小，就能定位"谁在偷偷吃磁盘"。真实 \`du -sh\` 的数字含义更精确，但"先看清单、再找大头"的分析思路完全一致。`,
    task: `## 任务：看看主目录里谁最大

场景：主目录 \`/home/student\` 下有 \`docs\`、\`downloads\`、\`projects\` 三个子目录和 \`notes.txt\`、\`todo.txt\` 两个文件。

用 \`ls -l\` 长格式列出主目录内容，观察各条目的大小。

**输入**：无

**期望输出**（5 行，目录显示 4096，文件显示字节大小）：

\`\`\`text
drwxr-xr-x 1 student student   4096 Jan  1 10:00 docs
drwxr-xr-x 1 student student   4096 Jan  1 10:00 downloads
-rw-r--r-- 1 student student     35 Jan  1 10:00 notes.txt
drwxr-xr-x 1 student student   4096 Jan  1 10:00 projects
-rw-r--r-- 1 student student     28 Jan  1 10:00 todo.txt
\`\`\``,
    starter: `# 真实世界用 du -sh /home/student/* 统计目录占用
# 本模拟器简化：ls -l 长格式的"大小"列就是各条目的占用
# TODO: 在主目录执行 ls -l，观察目录与文件的大小差异
`,
    solution: `ls -l`,
    hints: [
      '你就站在主目录里，直接 `ls -l` 即可，不需要 cd，也不需要参数。',
      '看输出的大小列：目录固定 4096，文件是字节大小 —— 这就是本模拟器对 du 的简化。',
      '完整答案一行：`ls -l`，输出 5 行（3 个目录 + 2 个文件），按名字字母序排列。',
    ],
    tests: [
      { name: '长格式列出主目录', stdin: '', expected: 'drwxr-xr-x 1 student student   4096 Jan  1 10:00 docs\ndrwxr-xr-x 1 student student   4096 Jan  1 10:00 downloads\n-rw-r--r-- 1 student student     35 Jan  1 10:00 notes.txt\ndrwxr-xr-x 1 student student   4096 Jan  1 10:00 projects\n-rw-r--r-- 1 student student     28 Jan  1 10:00 todo.txt' },
      { name: '目录与文件大小可见', stdin: '', expected: 'drwxr-xr-x 1 student student   4096 Jan  1 10:00 docs\ndrwxr-xr-x 1 student student   4096 Jan  1 10:00 downloads\n-rw-r--r-- 1 student student     35 Jan  1 10:00 notes.txt\ndrwxr-xr-x 1 student student   4096 Jan  1 10:00 projects\n-rw-r--r-- 1 student student     28 Jan  1 10:00 todo.txt' },
      { name: '5 个条目完整输出', stdin: '', expected: 'drwxr-xr-x 1 student student   4096 Jan  1 10:00 docs\ndrwxr-xr-x 1 student student   4096 Jan  1 10:00 downloads\n-rw-r--r-- 1 student student     35 Jan  1 10:00 notes.txt\ndrwxr-xr-x 1 student student   4096 Jan  1 10:00 projects\n-rw-r--r-- 1 student student     28 Jan  1 10:00 todo.txt' },
      { name: '隐藏：大小列逐字符匹配', stdin: '', expected: 'drwxr-xr-x 1 student student   4096 Jan  1 10:00 docs\ndrwxr-xr-x 1 student student   4096 Jan  1 10:00 downloads\n-rw-r--r-- 1 student student     35 Jan  1 10:00 notes.txt\ndrwxr-xr-x 1 student student   4096 Jan  1 10:00 projects\n-rw-r--r-- 1 student student     28 Jan  1 10:00 todo.txt', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# 真实世界用 du -sh /home/student/* 统计目录占用
# 本模拟器简化：ls -l 长格式的"大小"列就是各条目的占用
# TODO: 在主目录执行 ls -l，观察目录与文件的大小差异
`,
      },
      solutions: {
        bash: `ls -l`,
      },
    },
    fs: '{"cwd":"/home/student","tree":{"type":"dir","children":{"docs":{"type":"dir","children":{"linux.md":{"type":"file","content":"# Linux 学习笔记\\n\\n- pwd shows cwd\\n- ls lists files\\n"},"plan.txt":{"type":"file","content":"Mon: practice commands\\nWed: write scripts\\n"}}},"downloads":{"type":"dir","children":{"ubuntu.iso":{"type":"file","content":"binary image data omitted\\n"},"report_2026.pdf":{"type":"file","content":"pdf data omitted\\n"}}},"projects":{"type":"dir","children":{"hello.sh":{"type":"file","content":"echo hello\\n"},"readme.md":{"type":"file","content":"# My Projects\\n"}}},"notes.txt":{"type":"file","content":"todo: backup /etc\\ntodo: clean /tmp\\n"},"todo.txt":{"type":"file","content":"1. learn find\\n2. learn grep\\n"}}}}',
  },
  {
    id: 'linux-best-4',
    lang: 'linux',
    module: 'best',
    order: 4,
    title: '用户与组管理',
    difficulty: 2,
    xp: 20,
    goals: [
      '了解 /etc/passwd 的 7 字段结构与用户记录格式',
      '会用 cat + grep 管道在系统文件里定位用户记录',
      '了解 useradd / usermod 是真实世界的用户管理命令',
    ],
    brief: `## /etc/passwd：全系统的人物档案

Linux 的每个用户都在 \`/etc/passwd\` 里留有一行档案，7 个字段用冒号隔开：

\`\`\`text
student:x:1000:1000:Student:/home/student:/bin/bash
   ↓    ↓   ↓    ↓      ↓         ↓           ↓
 用户名 密码位 UID  GID    备注      主目录     默认 Shell
\`\`\`

真实世界用 \`useradd\` / \`usermod\` 管理用户，而"查档案"最快的招是把文件倒出来再用 \`grep\` 过滤：

\`\`\`bash
cat /etc/passwd | grep student
\`\`\`

管道把整份档案喂给 \`grep\`，只留下含 \`student\` 的那一行。这一招对 \`/etc/group\`（组档案）同样好用。`,
    task: `## 任务：找到 student 的档案行

场景：你站在 \`/etc\` 目录，手边有 \`passwd\`（用户档案）、\`group\`（组档案）、\`hostname\`（主机名）三个系统文件。

用 \`cat\` 输出 \`/etc/passwd\` 的全部内容，并用管道接 \`grep\` 过滤出含 \`student\` 的记录行。

**输入**：无

**期望输出**（一行）：

\`\`\`text
student:x:1000:1000:Student:/home/student:/bin/bash
\`\`\``,
    starter: `# /etc/passwd 每行是一个用户的档案，7 个字段用冒号隔开
# cat 倒出档案，管道接 grep 过滤出目标用户
# TODO: 输出 passwd 全文并过滤出含 student 的行
`,
    solution: `cat /etc/passwd | grep student`,
    hints: [
      '管道写法：`cat /etc/passwd | grep student` —— cat 倒全文，grep 只留匹配行。',
      '也可以直接 `grep student /etc/passwd`（grep 支持文件参数），两种写法输出相同。',
      'student 的档案在 passwd 第 3 行：UID/GID 都是 1000，主目录 /home/student，Shell 是 /bin/bash。',
    ],
    tests: [
      { name: '管道过滤 passwd', stdin: '', expected: 'student:x:1000:1000:Student:/home/student:/bin/bash' },
      { name: '定位 student 记录行', stdin: '', expected: 'student:x:1000:1000:Student:/home/student:/bin/bash' },
      { name: '输出唯一匹配行', stdin: '', expected: 'student:x:1000:1000:Student:/home/student:/bin/bash' },
      { name: '隐藏：档案行逐字符匹配', stdin: '', expected: 'student:x:1000:1000:Student:/home/student:/bin/bash', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# /etc/passwd 每行是一个用户的档案，7 个字段用冒号隔开
# cat 倒出档案，管道接 grep 过滤出目标用户
# TODO: 输出 passwd 全文并过滤出含 student 的行
`,
      },
      solutions: {
        bash: `cat /etc/passwd | grep student`,
      },
    },
    fs: '{"cwd":"/etc","tree":{"type":"dir","children":{"passwd":{"type":"file","content":"root:x:0:0:root:/root:/bin/bash\\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\\nstudent:x:1000:1000:Student:/home/student:/bin/bash\\nsshd:x:100:65534::/run/sshd:/usr/sbin/nologin\\nsystemd-network:x:101:102:systemd Network Management:/run/systemd:/usr/sbin/nologin\\n"},"group":{"type":"file","content":"root:x:0:\\nstudent:x:1000:\\ndocker:x:998:student\\n"},"hostname":{"type":"file","content":"codequest-vm\\n"}}}}',
  },
  {
    id: 'linux-best-5',
    lang: 'linux',
    module: 'best',
    order: 5,
    title: '定时任务 Crontab',
    difficulty: 3,
    xp: 25,
    goals: [
      '了解 cron 与 /etc/cron.d 的定时任务机制',
      '能读懂 cron 表达式的 5 个时间字段',
      '会用 ls 查看已排期的定时任务文件（模拟器简化）',
    ],
    brief: `## cron：不睡觉的闹钟

服务器上很多活要"定时干"：凌晨备份、每周清理、每小时轮转日志。干这活的是后台服务 **cron**，排班表写在 \`/etc/cron.d/\` 目录 —— 一个任务一个文件，每行一条规则：

\`\`\`text
0 2 * * * root /usr/local/bin/backup.sh
│ │ │ │ │   └─ 以 root 身份执行
│ │ │ │ └───── 星期几（0-7，* = 每天）
│ │ │ └─────── 月份（* = 每月）
│ │ └───────── 日（* = 每日）
│ └─────────── 小时（2 = 凌晨 2 点）
└───────────── 分钟（0 = 0 分）
\`\`\`

真实世界用 \`crontab -e\` 编辑任务；本模拟器简化为用 \`ls\` 看看 \`/etc/cron.d/\` 里排了哪些班 —— 文件名就是任务名。`,
    task: `## 任务：看看排了哪些定时任务

场景：你接手一台服务器，先搞清楚前任运维留下了哪些定时任务。当前位于 \`/etc/cron.d\` 目录。

用 \`ls\` 列出 \`/etc/cron.d/\` 目录下的全部任务文件。

**输入**：无

**期望输出**（一行，4 个任务文件名，之间是两个空格）：

\`\`\`text
apt  backup  cleanup  logrotate
\`\`\``,
    starter: `# /etc/cron.d/ 里一个文件就是一个定时任务（排班表）
# cron 表达式 5 个时间字段：分 时 日 月 周
# TODO: 用 ls 查看这个目录里排了哪些任务
`,
    solution: `ls /etc/cron.d/`,
    hints: [
      'ls 后跟绝对路径：`ls /etc/cron.d/`，列出所有排班文件。',
      '目录名别拼错：是 cron.d（cron + 点 + d）；注意各文件都没有扩展名，这是 cron.d 的命名习惯。',
      '完整答案一行：`ls /etc/cron.d/`，输出 4 个任务文件名，按字母序排好。',
    ],
    tests: [
      { name: '列出定时任务目录', stdin: '', expected: 'apt  backup  cleanup  logrotate' },
      { name: '4 个任务文件齐全', stdin: '', expected: 'apt  backup  cleanup  logrotate' },
      { name: '绝对路径访问 cron.d', stdin: '', expected: 'apt  backup  cleanup  logrotate' },
      { name: '隐藏：任务清单逐字符匹配', stdin: '', expected: 'apt  backup  cleanup  logrotate', hidden: true },
    ],
    algo: {
      starters: {
        bash: `# /etc/cron.d/ 里一个文件就是一个定时任务（排班表）
# cron 表达式 5 个时间字段：分 时 日 月 周
# TODO: 用 ls 查看这个目录里排了哪些任务
`,
      },
      solutions: {
        bash: `ls /etc/cron.d/`,
      },
    },
    fs: '{"cwd":"/etc/cron.d","tree":{"type":"dir","children":{"apt":{"type":"file","content":"30 6 * * 1 root /usr/bin/apt-get update -qq\\n"},"backup":{"type":"file","content":"0 2 * * * root /usr/local/bin/backup.sh\\n"},"cleanup":{"type":"file","content":"0 3 * * 0 root /usr/local/bin/cleanup_tmp.sh\\n"},"logrotate":{"type":"file","content":"15 1 * * * root /usr/sbin/logrotate /etc/logrotate.conf\\n"}}}}',
  },
];
