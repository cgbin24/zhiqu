import type { Level } from '@/types';

/**
 * Linux 课程 · 系统管理追加章：资源排查实战（ops，5 关）
 *
 * 场景：同一台服务器的完整运维周期——CPU 异常排查、磁盘告急、内存水位、
 * 端口审计、四项晨检复验。模拟器新增 ps / du / df / free / netstat 命令，
 * 数据源为 runtime JSON 的 system 字段（ps / df / memMb / memUsedMb / ports）。
 */

/* ---------- 场景数据 ---------- */

/** L1：异常进程混在正常列表中（%CPU 25.6 的 report-sync 是嫌疑人） */
const PS_ALERT = [
  { pid: 1, cmd: 'systemd', cpu: 0.1 },
  { pid: 348, cmd: 'sshd: /usr/sbin/sshd -D', cpu: 0.2 },
  { pid: 512, cmd: 'nginx: master process', cpu: 0.5 },
  { pid: 513, cmd: 'nginx: worker process', cpu: 1.2 },
  { pid: 780, cmd: 'node /var/www/app/server.js', cpu: 3.4 },
  { pid: 1024, cmd: 'mysqld', cpu: 8.2 },
  { pid: 1888, cmd: 'node /app/report-sync.js', cpu: 25.6 },
  { pid: 2048, cmd: 'cron', cpu: 0.1 },
];

/** L5：整改后的健康进程表（report-sync 已下线） */
const PS_CLEAN = [
  { pid: 1, cmd: 'systemd', cpu: 0.1 },
  { pid: 348, cmd: 'sshd: /usr/sbin/sshd -D', cpu: 0.2 },
  { pid: 512, cmd: 'nginx: master process', cpu: 0.5 },
  { pid: 513, cmd: 'nginx: worker process', cpu: 1.2 },
  { pid: 780, cmd: 'node /var/www/app/server.js', cpu: 3.4 },
  { pid: 1024, cmd: 'mysqld', cpu: 8.2 },
  { pid: 2048, cmd: 'cron', cpu: 0.1 },
];

/** L2：失控的 nginx 访问日志（重复生成大文件，du 可称出 M 级） */
const NGINX_LINE =
  '2026-05-10 10:02:11 ERROR upstream timed out (110: Connection timed out) while reading response header\n';

function mkFsOps1(): string {
  return JSON.stringify({
    cwd: '/home/student',
    tree: {
      type: 'dir',
      children: {
        'oncall.md': {
          type: 'file',
          content: '值班交接：CPU 告警待排查，重点盯 %CPU 异常的进程\n',
        },
      },
    },
    system: { ps: PS_ALERT },
  });
}

function mkFsOps2(): string {
  return JSON.stringify({
    cwd: '/var/log',
    tree: {
      type: 'dir',
      children: {
        app: {
          type: 'dir',
          children: {
            'app.log': { type: 'file', content: '2026-05-10 09:00:01 INFO 服务启动完成\n' },
          },
        },
        backup: {
          type: 'dir',
          children: {
            'db.dump': { type: 'file', content: 'PGDMP'.repeat(60000) },
          },
        },
        nginx: {
          type: 'dir',
          children: {
            'access.log': { type: 'file', content: NGINX_LINE.repeat(12000) },
            'access.log.1': { type: 'file', content: NGINX_LINE.repeat(8000) },
            'error.log': { type: 'file', content: '2026-05-10 10:02:11 ERROR connect() failed\n' },
          },
        },
        syslog: { type: 'file', content: '2026-05-10 09:00 systemd: daily maintenance done\n' },
      },
    },
    system: { df: { total: 40, used: 36 } },
  });
}

function mkFsOps3(): string {
  return JSON.stringify({
    cwd: '/home/student',
    tree: {
      type: 'dir',
      children: {
        'capacity-plan.md': {
          type: 'file',
          content: '容量判断：used 长期超过 total 九成 → 提交扩容工单\n',
        },
      },
    },
    system: { memMb: 7982, memUsedMb: 7460 },
  });
}

function mkFsOps4(): string {
  return JSON.stringify({
    cwd: '/home/student',
    tree: {
      type: 'dir',
      children: {
        'port-audit.md': {
          type: 'file',
          content: '端口审计清单：22=SSH 80/443=网站 3306=MySQL，逐门核对\n',
        },
      },
    },
    system: { ports: [22, 80, 443, 3306] },
  });
}

function mkFsOps5(): string {
  return JSON.stringify({
    cwd: '/home/student',
    tree: {
      type: 'dir',
      children: {
        'morning-check.md': {
          type: 'file',
          content: '晨检清单：df 磁盘 / free 内存 / ps 进程 / netstat 端口\n',
        },
      },
    },
    system: {
      ps: PS_CLEAN,
      df: { total: 40, used: 14 },
      memMb: 7982,
      memUsedMb: 3200,
      ports: [22, 80, 443],
    },
  });
}

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：管道与命令组合', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

/* ---------- 关卡 1：进程排查 ---------- */

const L1_SCRIPT = `ps | grep report-sync`;

const L1_EXPECTED = ' 1888 node /app/report-sync.js         25.6';

/* ---------- 关卡 2：磁盘告急排查 ---------- */

const L2_SCRIPT = `df
du -sh /var/log/app
du -sh /var/log/backup
du -sh /var/log/nginx`;

const L2_EXPECTED = [
  'Filesystem      Size  Used  Use% Mounted on',
  '/dev/vda1       40G  36G  4G  90% /',
  '8K\tvar/log/app',
  '297K\tvar/log/backup',
  '2.0M\tvar/log/nginx',
].join('\n');

/* ---------- 关卡 3：内存水位检查 ---------- */

const L3_SCRIPT = `free | grep Mem`;

const L3_EXPECTED = 'Mem:       7982      7460       522';

/* ---------- 关卡 4：端口暴露审计 ---------- */

const L4_SCRIPT = `netstat | grep 3306
echo "[ALERT] 数据库端口 3306 对公网监听，请立即配置防火墙限制来源"`;

const L4_EXPECTED = [
  'tcp   0  0 0.0.0.0:3306   0.0.0.0:*   LISTEN   mysqld',
  '[ALERT] 数据库端口 3306 对公网监听，请立即配置防火墙限制来源',
].join('\n');

/* ---------- 关卡 5：综合排查脚本 ---------- */

const L5_SCRIPT = `echo "===== 晨检报告 ====="
df
free
ps
netstat`;

const L5_EXPECTED = [
  '===== 晨检报告 =====',
  'Filesystem      Size  Used  Use% Mounted on',
  '/dev/vda1       40G  14G  26G  35% /',
  '              total        used        free',
  'Mem:       7982      3200      4782',
  '  PID CMD                              %CPU',
  '    1 systemd                           0.1',
  '  348 sshd: /usr/sbin/sshd -D           0.2',
  '  512 nginx: master process             0.5',
  '  513 nginx: worker process             1.2',
  '  780 node /var/www/app/server.js       3.4',
  ' 1024 mysqld                            8.2',
  ' 2048 cron                              0.1',
  'Active Internet connections (only servers)',
  'tcp   0  0 0.0.0.0:22   0.0.0.0:*   LISTEN   sshd',
  'tcp   0  0 0.0.0.0:80   0.0.0.0:*   LISTEN   nginx',
  'tcp   0  0 0.0.0.0:443   0.0.0.0:*   LISTEN   nginx',
].join('\n');

/* ---------- 关卡定义 ---------- */

const L1: Level = {
  id: 'linux-ops-1',
  lang: 'linux',
  module: 'best',
  order: 7,
  title: '进程排查：谁在吃 CPU',
  difficulty: 3,
  xp: 25,
  goals: [
    '会用 ps 查看进程列表与 %CPU 占用',
    '能从 %CPU 列识别异常进程',
    '会用 ps | grep 管道锁定目标进程',
  ],
  brief: `## ps：进程世界的花名册

服务器卡顿，第一反应是**看进程**。真实世界用 \`top\` 实时刷新，模拟器里 \`ps\` 一次列出全部进程：

\`\`\`text
  PID CMD                              %CPU
  348 sshd: /usr/sbin/sshd -D           0.2
\`\`\`

三列含义：**PID** 进程号（发信号、终止进程的凭据）、**CMD** 启动命令、**%CPU** 当前 CPU 占用。正常业务进程的 %CPU 通常是个位数，某行飙到几十，它就是头号嫌疑人。

类比：**急诊分诊** —— ps 是挂号单，%CPU 是体温；谁烧得最高，先查谁。

> 💡 锁定嫌疑人后，\`ps | grep 进程名\` 一击确认——管道把「列出来」和「留证据」并成一步。`,
  task: `## 任务：揪出吃 CPU 的进程

场景：监控告警「CPU 飙升」，你登录服务器排查。进程表已就绪，其中混着一个 %CPU 高得反常的进程。

1. \`ps\` —— 列出全部进程，扫一遍 %CPU 列，找出数值最高的那行；
2. \`ps | grep report-sync\` —— 用管道过滤出该进程，留下确凿证据。

输出一行：PID + 完整命令 + %CPU（列间对齐空格原样保留）。`,
  starter: `# CPU 告警排查：先列进程，再锁嫌疑
# TODO 1: 用 ps 列出全部进程，观察 %CPU 列

# TODO 2: 用管道 grep 过滤出 report-sync 那一行`,
  solution: L1_SCRIPT,
  hints: [
    'ps 列出进程表，%CPU 列在最右——逐行扫过去，找一个明显高出其他的数值。',
    '管道写法：ps | grep report-sync —— grep 的模式直接写进程名里的关键词。',
    '输出一行：PID 是 1888，命令是 node /app/report-sync.js，%CPU 是 25.6。',
  ],
  tests: tests(L1_EXPECTED),
  runtime: mkFsOps1(),
};

const L2: Level = {
  id: 'linux-ops-2',
  lang: 'linux',
  module: 'best',
  order: 8,
  title: '磁盘告急排查',
  difficulty: 3,
  xp: 25,
  goals: [
    '会用 df 查看磁盘全局水位与 Use%',
    '会用 du -sh 给目录称重、定位大目录',
    '理解 df 看全局、du 找元凶的排查套路',
  ],
  brief: `## df + du：磁盘告急双剑

「磁盘怎么又满了？」——真实运维两句口诀：**df 看全局，du 找元凶**。

\`df\` 报告整块磁盘的水位：

\`\`\`text
Filesystem      Size  Used  Use% Mounted on
/dev/vda1       40G  36G  4G  90% /
\`\`\`

Use% 超过 80% 就该警惕，逼近 100% 时日志和数据库会当场罢工。确认告急后，换 \`du -sh 目录\` 给可疑目录逐个**称重**，最大的往往就是元凶——十有八九是日志。

类比：**体检加 B 超** —— df 说我超重了，du 告诉你肉长在哪儿。

> 💡 du 输出里 K 是 KB、M 是 MB；本模拟器按文件字节折算，真实机器上失控的日志动辄上 G。`,
  task: `## 任务：给磁盘降温

场景：告警显示磁盘使用率突破 90%。你站在 /var/log 目录，下面有 app、backup、nginx 三个子目录。

1. \`df\` —— 确认全局水位（Use% 应为 90%）；
2. \`du -sh /var/log/app\`、\`du -sh /var/log/backup\`、\`du -sh /var/log/nginx\` —— 逐个给子目录称重，找出最大的元凶。

输出 5 行：df 两行 + 三个目录的大小行。哪个目录到了 M 级，答案就写在那里。`,
  starter: `# 磁盘告急：df 看全局，du 找元凶
# TODO 1: 用 df 确认磁盘水位

# TODO 2: 用 du -sh 逐个给 /var/log 下的子目录称重（app、backup、nginx）`,
  solution: L2_SCRIPT,
  hints: [
    'df 输出两行，第二行 Use% 列是 90——磁盘确实告急。',
    'du -sh 后面跟目录的绝对路径，如 du -sh /var/log/app；三个子目录各称一次。',
    '只有 nginx 目录达到 M 级（2.0M），app 是 8K、backup 是 297K——元凶是 nginx 日志。',
  ],
  tests: tests(L2_EXPECTED),
  runtime: mkFsOps2(),
};

const L3: Level = {
  id: 'linux-ops-3',
  lang: 'linux',
  module: 'best',
  order: 9,
  title: '内存水位检查',
  difficulty: 2,
  xp: 20,
  goals: [
    '会读 free 输出的 total/used/free 三列',
    '理解内存水位与扩容判断',
    '会用 grep 滤掉表头提取数据行',
  ],
  brief: `## free：内存水位表

\`free\` 一张表看清内存家底：**total** 总量、**used** 已用、**free** 剩余。运维最关心的是比例——used 长期贴着 total（例如 7460/7982，只剩不到 7%），内存就到了警戒线。

内存吃紧只有两个去向：**扩容**（升配加内存）或**瘦身**（排查泄漏、限制缓存）。判断依据就是这张表：偶尔冲高是正常抖动，长期高位必须动手。

类比：**水库水位** —— total 是库容，used 是当前蓄水；持续逼近坝顶，就得开闸放水或者扩库。

> 💡 用 \`free | grep Mem\` 滤掉表头只留数据行——写进监控脚本时取数更方便。`,
  task: `## 任务：读取内存水位

1. \`free\` —— 看完整表格：表头一行 + Mem 数据一行；
2. \`free | grep Mem\` —— 滤掉表头，只留数据行。

输出一行 Mem: 开头的数据。used 7460、free 仅剩 522（MB）——结合剧情判断：该提交扩容工单了。`,
  starter: `# 内存水位检查
# TODO 1: 用 free 查看内存三列：total / used / free

# TODO 2: 管道接 grep，只留 Mem 数据行`,
  solution: L3_SCRIPT,
  hints: [
    'free 直接回车就有两行输出：表头一行、Mem 数据一行。',
    'used 与 total 的单位是 MB：总量 7982、已用 7460，只剩 522——比例超过九成。',
    '管道写法：free | grep Mem —— 大小写敏感，M 要大写。',
  ],
  tests: tests(L3_EXPECTED),
  runtime: mkFsOps3(),
};

const L4: Level = {
  id: 'linux-ops-4',
  lang: 'linux',
  module: 'best',
  order: 10,
  title: '端口暴露审计',
  difficulty: 4,
  xp: 30,
  goals: [
    '会读 netstat 监听端口列表',
    '能识别 0.0.0.0 公网监听的安全风险',
    '会用 grep 过滤端口并用 echo 输出处置结论',
  ],
  brief: `## netstat：给服务器清点门锁

对外服务的每个端口都是一扇**门**：22 是 SSH、80/443 是网站、3306 是 MySQL。\`netstat\` 列出所有正在监听的门：

\`\`\`text
tcp   0  0 0.0.0.0:3306   0.0.0.0:*   LISTEN   mysqld
\`\`\`

\`0.0.0.0:3306\` 表示这扇门开在**所有网卡**上——公网也能敲。数据库端口暴露公网是高危项，扫描器几小时内就能撞上门。安全审计就是定期清点：每扇门都要答得上是谁开的、该不该开。

类比：**保安巡楼** —— 逐层检查每扇门，发现后门没锁，立刻上报处置。

> 💡 管道接力：\`netstat | grep 3306\` 专查一个端口；确认后用 echo 把处置结论写进值班记录。`,
  task: `## 任务：审计监听端口

1. \`netstat\` —— 列出全部监听端口，逐行核对「是谁开的门」；
2. \`netstat | grep 3306\` —— 单查数据库端口，确认它确实在监听；
3. \`echo "[ALERT] 数据库端口 3306 对公网监听，请立即配置防火墙限制来源"\` —— 用 echo 输出处置结论（双引号包住整句话，照抄这行）。

输出两行：grep 命中的端口行 + 你的处置结论。`,
  starter: `# 端口暴露审计：清点服务器上所有的门
# TODO 1: 用 netstat 列出全部监听端口

# TODO 2: 管道接 grep，单查 3306 端口

# TODO 3: 用 echo 输出一行 [ALERT] 处置结论`,
  solution: L4_SCRIPT,
  hints: [
    'netstat 每行末尾是监听服务名，0.0.0.0:3306 表示对所有网卡开放。',
    '管道写法：netstat | grep 3306 —— 只会命中 mysqld 一行。',
    'echo 的整句话用双引号包住，照抄任务里的 [ALERT] 那行即可。',
  ],
  tests: tests(L4_EXPECTED),
  runtime: mkFsOps4(),
};

const L5: Level = {
  id: 'linux-ops-5',
  lang: 'linux',
  module: 'best',
  order: 11,
  title: '综合排查脚本',
  difficulty: 4,
  xp: 35,
  goals: [
    '会把多条巡检命令按顺序组合成脚本',
    '掌握 df/free/ps/netstat 四项晨检',
    '能综合四项输出做健康度判定',
  ],
  brief: `## 晨检：四连巡检一次跑完

前几关我们单独查过进程、磁盘、内存、端口。真实运维把它们打包成**晨检**——每天早上的第一件事，逐项过一遍：

\`\`\`bash
echo "===== 晨检报告 ====="
df
free
ps
netstat
\`\`\`

脚本逐行执行，输出按顺序拼接：磁盘水位 → 内存水位 → 进程榜单 → 监听端口。扫一眼四个关键数字（Use%、剩余内存、最高 %CPU、可疑端口），全绿才算交差。前几关处理过的问题，正好在这里复检验收。

类比：**飞行员起飞检查单** —— 不靠记忆靠清单，逐项打勾才能起飞。

> 💡 把巡检命令存成 .sh 文件，以后一条命令完成晨检——这就是运维自动化的雏形。`,
  task: `## 任务：跑一份完整晨检

把四项巡检打包成一次执行（echo 标题行照抄）：

\`\`\`bash
echo "===== 晨检报告 ====="
df
free
ps
netstat
\`\`\`

输出依次拼接：标题 + df 两行 + free 两行 + ps 全表 + netstat 全表。逐项核对：Use% 回落、内存有余、无异常 CPU、3306 已消失——四个勾打完，晨检通过。`,
  starter: `# 晨检脚本：四项巡检一次跑完
# 依次执行：echo 标题 → df → free → ps → netstat
# TODO: 按顺序写出这 5 行命令`,
  solution: L5_SCRIPT,
  hints: [
    '五行命令按顺序各占一行：echo 标题、df、free、ps、netstat。',
    '标题行照抄：echo "===== 晨检报告 ====="。',
    '输出共 17 行：标题 1 + df 2 + free 2 + ps 8（表头 + 7 进程）+ netstat 4（首行 + 3 端口）。',
  ],
  tests: tests(L5_EXPECTED),
  runtime: mkFsOps5(),
};

export const LINUX_OPS: Level[] = [L1, L2, L3, L4, L5];
