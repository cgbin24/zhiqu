import type { Level } from '@/types';

/**
 * 定时任务实战课程 · 第一章：cron 调度基础（basic，4 关）
 *
 * 提交一段监控/调度脚本，由本地服务器模拟器（src/judge/cron-sim.ts）执行，
 * stdout 与 expected 逐字符比对。服务器状态由 runtime JSON 注入，输出完全确定。
 */

const L1_SCRIPT = `cron add "0 2 * * *" 备份数据库
cron add "*/30 9-18 * * 1-5" 工作时间巡检
cron list
cron run 备份数据库`;

const L1_EXPECTED = `已添加定时任务：备份数据库（0 2 * * *）
已添加定时任务：工作时间巡检（*/30 9-18 * * 1-5）
当前定时任务（2）：
  0 2 * * *  备份数据库
  */30 9-18 * * 1-5  工作时间巡检
已手动触发：备份数据库（执行完成）`;

const L2_SCRIPT = `monitor disk
monitor mem
monitor cert
monitor http`;

const L2_EXPECTED = `磁盘使用率：78%（阈值 85% —— 正常）
内存使用率：62%（阈值 90% —— 正常）
证书检查：www.zhiquest.dev 剩余 45 天（阈值 30 天 —— 正常）
HTTP 检查：200 OK（45ms）—— 服务在线`;

const L3_SCRIPT = `cron add "0 2 * * *" 备份数据库
cron add "0 2 * * *" 备份数据库
cron list
cron remove 备份数据库
cron list`;

const L3_EXPECTED = `已添加定时任务：备份数据库（0 2 * * *）
定时任务 '备份数据库' 已存在
当前定时任务（1）：
  0 2 * * *  备份数据库
已移除定时任务：备份数据库
当前没有任何定时任务`;

const L4_SCRIPT = `monitor ssh
monitor port 22
monitor port 3389
alert SSH 登录失败次数异常，请立即检查`;

const L4_EXPECTED = `SSH 登录失败（24h）：47 次（超过阈值 10 次）⚠️ 疑似暴力破解，建议封禁来源 IP
端口 22：开放
端口 3389：未开放
已推送告警：SSH 登录失败次数异常，请立即检查`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'cron-basic-1',
  lang: 'cron',
  module: 'basic',
  order: 1,
  title: 'cron 表达式：让服务器自己动手',
  difficulty: 1,
  xp: 15,
  goals: [
    '理解 cron 表达式五段结构：分 时 日 月 周',
    '掌握 cron add 添加定时任务与 cron list 查看',
    '会用 cron run 手动触发一次验证任务',
  ],
  brief: `## cron：服务器世界的自动闹钟

cron 是 Linux 的内置调度器：你把"什么时候做什么"写成一行**五段表达式**，它就永远准时执行。

五段从左到右：**分（0-59）时（0-23）日（1-31）月（1-12）周（0-7）**。

- \`0 2 * * *\` —— 每天 2:00（\`*\` 表示"每"，星号占位）；
- \`*/30 9-18 * * 1-5\` —— 工作日 9 点到 18 点每半小时（\`*/30\` 每 30 分钟，\`9-18\` 范围，\`1-5\` 周一到周五）。

类比：**手机闹钟** —— 你只设置"何时+做什么"，之后它每天准时响，不用你守着。

> 💡 记忆法：从左到右单位越来越长 —— 分、时、日、月、周，先把"分"定下来再往粗了想。`,
  task: `## 任务：添加两个定时任务并手动触发

1. \`cron add "0 2 * * *" 备份数据库\` —— 每天凌晨 2 点备份；
2. \`cron add "*/30 9-18 * * 1-5" 工作时间巡检\` —— 工作日白天每半小时巡检；
3. \`cron list\` —— 查看全部（按添加顺序）；
4. \`cron run 备份数据库\` —— 手动触发一次验证脚本可用。`,
  starter: `# 第 1 关：cron 调度基础

# TODO 1: 添加定时任务"备份数据库"——每天凌晨 2 点（表达式 0 2 * * *）

# TODO 2: 添加定时任务"工作时间巡检"——工作日 9-18 点每半小时

# TODO 3: 查看全部定时任务

# TODO 4: 手动触发"备份数据库"`,
  solution: L1_SCRIPT,
  runtime: JSON.stringify({ certDomain: 'www.zhiquest.dev', certDays: 45 }),
  hints: [
    'cron add 的表达式要用双引号包住：cron add "0 2 * * *" 备份数据库。',
    '*/30 表示"每 30 分钟"，9-18 表示小时范围，1-5 表示周一到周五。',
    'list 输出两行任务，格式为两空格缩进 + 表达式 + 两空格 + 任务名；run 输出"已手动触发：..."。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'cron-basic-2',
  lang: 'cron',
  module: 'basic',
  order: 2,
  title: '服务器巡检四件套',
  difficulty: 2,
  xp: 20,
  goals: [
    '掌握四大巡检项：磁盘 / 内存 / 证书 / HTTP 存活',
    '理解阈值判断：输出自带"正常/异常"结论',
    '学会用巡检脚本一次跑完全部检查项',
  ],
  brief: `## 四件套：服务器健康的最小监控集

一台服务器至少要盯四件事，任何一件出问题都是事故：

- **磁盘**（\`monitor disk\`）：使用率超 85% 会写满，服务崩溃；
- **内存**（\`monitor mem\`）：超 90% 会 OOM，进程被杀；
- **证书**（\`monitor cert\`）：HTTPS 证书过期，全站无法访问；
- **HTTP**（\`monitor http\`）：服务存活与响应速度。

每项输出自带结论："正常"或"⚠️ 需要处理"—— 脚本把判断逻辑写好，人只看结论。

类比：**汽车仪表盘** —— 油量、水温、转速、故障灯，扫一眼就知道车况。

> 💡 这四项就是"巡检脚本"的骨架：加上 cron 每天定时跑一遍，出问题自动告警——下一章就教。`,
  task: `## 任务：跑一遍四项巡检

依次执行（服务器状态由模拟器注入）：

1. \`monitor disk\` —— 磁盘 78%，正常；
2. \`monitor mem\` —— 内存 62%，正常；
3. \`monitor cert\` —— 证书剩余 45 天，正常；
4. \`monitor http\` —— 200 OK（45ms），在线。

四行输出逐字符比对。`,
  starter: `# 第 2 关：服务器巡检四件套

# TODO 1: 检查磁盘使用率

# TODO 2: 检查内存使用率

# TODO 3: 检查 HTTPS 证书剩余天数

# TODO 4: 检查 HTTP 服务存活`,
  solution: L2_SCRIPT,
  runtime: JSON.stringify({ disk: 78, mem: 62, certDomain: 'www.zhiquest.dev', certDays: 45, http: 200, httpMs: 45, sshFails: 3, ports: [22, 80, 443] }),
  hints: [
    '巡检命令没有参数：monitor disk / monitor mem / monitor cert / monitor http。',
    '每项输出一行结论，正常时末尾有"—— 正常"。',
    '证书检查输出包含域名 www.zhiquest.dev 与剩余天数 45。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'cron-basic-3',
  lang: 'cron',
  module: 'basic',
  order: 3,
  title: '重复与移除：任务的增删管理',
  difficulty: 2,
  xp: 20,
  goals: [
    '认识重复添加的边界：同名任务会被拒绝',
    '掌握 cron remove 移除任务',
    '用 list 前后对比确认状态变化',
  ],
  brief: `## 增删管理：别让定时任务变成"僵尸任务"

定时任务会积累：改了备份策略忘了删旧的、临时巡检用完没撤 —— 每个"僵尸任务"都在消耗服务器资源，还可能互相冲突。

模拟器与真实 cron 一致的规则：

- **同名任务拒绝重复添加**（\`定时任务 'x' 已存在\`）；
- **remove 后 list 立即反映变化**。

类比：**闹钟管理** —— 换班了不删旧闹钟，周六早上照样被吵醒。

> 💡 每次改动后都 list 一下确认——两秒的习惯，避免"我记得我删过啊"。`,
  task: `## 任务：体验重复拒绝与移除

1. \`cron add "0 2 * * *" 备份数据库\`；
2. \`cron add "0 2 * * *" 备份数据库\` —— 再次添加同名任务（会被拒绝）；
3. \`cron list\` —— 仍只有一条；
4. \`cron remove 备份数据库\`；
5. \`cron list\` —— 应显示"当前没有任何定时任务"。`,
  starter: `# 第 3 关：重复与移除

# TODO 1: 添加"备份数据库"（0 2 * * *）

# TODO 2: 再次添加同名任务（观察拒绝输出）

# TODO 3: list 确认仍只有一条

# TODO 4: 移除"备份数据库"

# TODO 5: list 确认已清空`,
  solution: L3_SCRIPT,
  hints: [
    '第二次 add 的输出是"定时任务 备份数据库 已存在"——任务不会被重复创建。',
    'remove 的输出："已移除定时任务：备份数据库"。',
    '最后的 list 输出固定一行："当前没有任何定时任务"。',
  ],
  tests: tests(L3_EXPECTED),
};

const L4: Level = {
  id: 'cron-basic-4',
  lang: 'cron',
  module: 'basic',
  order: 4,
  title: '安全监控：SSH 爆破与端口',
  difficulty: 3,
  xp: 25,
  goals: [
    '监控 SSH 登录失败次数，识别暴力破解迹象',
    '检查关键端口开放状态（该开的开，不该开的关）',
    '掌握 alert 告警推送的用法',
  ],
  brief: `## 安全监控：服务器的大门与窗户

安全监控盯两类信号：

- **SSH 登录失败次数**：公网服务器每天被暴力破解扫描是常态（24h 失败几十次很常见）。偶发正常，**持续高频 = 疑似爆破**，要封来源 IP；
- **端口开放**：22（SSH）、80/443（Web）该开；3389（远程桌面）、数据库端口对公网开放就是漏洞。检查方式是"该开的在列表里，不该开的不在"。

发现异常后用 \`alert <消息>\` 推送告警到通知渠道（手机立收）—— **发现问题的价值在于及时处理**。

类比：**小区门禁** —— SSH 失败次数是"陌生人按门铃次数"，端口检查是"哪些门开着"，告警是"给物业打电话"。

> 💡 监控闭环三步：发现问题（monitor）→ 告警（alert）→ 处理（封 IP/关端口）。只有监视没有告警的监控等于没装。`,
  task: `## 任务：一次安全异常的完整响应

模拟服务器正遭暴力破解（24h 失败 47 次），完成响应流程：

1. \`monitor ssh\` —— 确认异常（超过阈值，⚠️）；
2. \`monitor port 22\` —— 确认 SSH 端口状态（开放）；
3. \`monitor port 3389\` —— 确认远程桌面端口（未开放，安全）；
4. \`alert SSH 登录失败次数异常，请立即检查\` —— 推送告警。

四行输出逐字符比对。`,
  starter: `# 第 4 关：安全监控响应

# TODO 1: 检查 SSH 登录失败次数（24h）

# TODO 2: 检查端口 22 状态

# TODO 3: 检查端口 3389 状态

# TODO 4: 推送告警"SSH 登录失败次数异常，请立即检查"`,
  solution: L4_SCRIPT,
  runtime: JSON.stringify({ sshFails: 47, ports: [22, 80, 443] }),
  hints: [
    'monitor ssh 的输出含"疑似暴力破解"提示——47 次已超过 10 次阈值。',
    'monitor port 后跟端口号：monitor port 22 / monitor port 3389。',
    'alert 后的消息直接跟在命令后面（不用引号），输出"已推送告警：..."。',
  ],
  tests: tests(L4_EXPECTED),
};

export const CRON_BASIC: Level[] = [L1, L2, L3, L4];
