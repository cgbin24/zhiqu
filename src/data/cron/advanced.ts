import type { Level } from '@/types';

/**
 * 定时任务实战课程 · 第三章：安全监控（advanced，4 关）
 *
 * 提交一段监控/调度脚本，由本地服务器模拟器（src/judge/cron-sim.ts）执行，
 * stdout 与 expected 逐字符比对。服务器状态由 runtime JSON 注入，输出完全确定。
 *
 * 注意：cron add 的任务名是单个词（不能含空格）；模拟器状态字段名为 httpCode。
 */

const L1_SCRIPT = `cron add "0 8 * * *" SSH安全巡检
cron run SSH安全巡检
monitor ssh
alert 安全告警：24h 内 SSH 登录失败 47 次，疑似暴力破解，请封禁来源 IP`;

const L1_EXPECTED = `已添加定时任务：SSH安全巡检（0 8 * * *）
已手动触发：SSH安全巡检（执行完成）
SSH 登录失败（24h）：47 次（超过阈值 10 次）⚠️ 疑似暴力破解，建议封禁来源 IP
已推送告警：安全告警：24h 内 SSH 登录失败 47 次，疑似暴力破解，请封禁来源 IP`;

const L2_SCRIPT = `monitor port 22
monitor port 80
monitor port 443
monitor port 3389
alert 高危端口告警：远程桌面端口 3389 对公网开放，请立即关闭或限制来源 IP`;

const L2_EXPECTED = `端口 22：开放
端口 80：开放
端口 443：开放
端口 3389：开放
已推送告警：高危端口告警：远程桌面端口 3389 对公网开放，请立即关闭或限制来源 IP`;

const L3_SCRIPT = `monitor ssh
monitor port 22
monitor port 3389
monitor port 3306
report`;

const L3_EXPECTED = `SSH 登录失败（24h）：5 次（阈值 10 次 —— 正常）
端口 22：开放
端口 3389：未开放
端口 3306：未开放
—— 服务器巡检报告 ——
磁盘使用率：71%（阈值 85% —— 正常）
内存使用率：57%（阈值 90% —— 正常）
证书检查：www.zhiquest.dev 剩余 45 天（阈值 30 天 —— 正常）
HTTP 检查：200 OK（39ms）—— 服务在线
SSH 登录失败（24h）：5 次（阈值 10 次 —— 正常）
—— 巡检结束 ——`;

const L4_SCRIPT = `monitor ssh
alert 安全告警：24h 内 SSH 登录失败 47 次，疑似暴力破解，开始排查
monitor port 22
alert 处置通知：SSH 端口 22 保持开放，来源 IP 已封禁，密码策略已加固`;

const L4_EXPECTED = `SSH 登录失败（24h）：47 次（超过阈值 10 次）⚠️ 疑似暴力破解，建议封禁来源 IP
已推送告警：安全告警：24h 内 SSH 登录失败 47 次，疑似暴力破解，开始排查
端口 22：开放
已推送告警：处置通知：SSH 端口 22 保持开放，来源 IP 已封禁，密码策略已加固`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'cron-advanced-1',
  lang: 'cron',
  module: 'advanced',
  order: 1,
  title: 'SSH 爆破识别：读懂失败次数',
  difficulty: 3,
  xp: 25,
  goals: [
    '用 monitor ssh 检查 24 小时登录失败次数',
    '理解爆破识别逻辑：偶发是噪音，持续高频是攻击',
    '发现异常后用 alert 推送带次数与建议动作的告警',
  ],
  brief: `## SSH 爆破识别：从失败次数读懂攻击

公网服务器的 22 端口天天被扫描器敲门——SSH 登录失败是常态，不必紧张。关键看**频率与持续性**：

- **偶发失败**（每天几次到十几次）：同事手滑输错密码、扫描器路过，属正常噪音；
- **持续高频**（24h 内几十次集中失败）：同一来源反复试密码，是**暴力破解**的前兆。

\`monitor ssh\` 替你数数：24h 失败超过 10 次即输出 ⚠️ 与"疑似暴力破解，建议封禁来源 IP"。发现后立刻 \`alert\` 推送——消息带上次数与建议动作，值班的人不用登录就知道该封谁。

类比：**门铃** —— 偶尔按一两声是访客找错门；半夜连按几十声，就该报警了。

> 💡 看失败次数要结合时段：凌晨集中 20 次失败，比全天零散 20 次更危险——模式比总数更能说明问题。`,
  task: `## 任务：把 SSH 检查挂上定时任务并响应告警

模拟服务器正遭 SSH 爆破（24h 登录失败 47 次）：

1. \`cron add "0 8 * * *" SSH安全巡检\` —— 建立每日早 8 点巡检任务（任务名不能含空格）；
2. \`cron run SSH安全巡检\` —— 手动触发一次，验证任务可用；
3. \`monitor ssh\` —— 查看失败次数（超过阈值 10 次，输出 ⚠️）；
4. \`alert 安全告警：24h 内 SSH 登录失败 47 次，疑似暴力破解，请封禁来源 IP\` —— 推送告警。

四行输出逐字符比对。`,
  starter: `# 第 1 关：SSH 爆破识别

# TODO 1: 添加每日巡检任务"SSH安全巡检"——每天早 8 点（表达式 0 8 * * *，任务名不含空格）

# TODO 2: 手动触发"SSH安全巡检"验证任务可用

# TODO 3: 检查 SSH 登录失败次数（24h）

# TODO 4: 推送告警"安全告警：24h 内 SSH 登录失败 47 次，疑似暴力破解，请封禁来源 IP"`,
  solution: L1_SCRIPT,
  runtime: JSON.stringify({ disk: 76, mem: 60, certDomain: 'www.zhiquest.dev', certDays: 45, httpMs: 42, sshFails: 47, ports: [22, 80, 443] }),
  hints: [
    '先建任务再触发：cron add "0 8 * * *" SSH安全巡检，然后 cron run SSH安全巡检。',
    'monitor ssh 不带参数；47 次已超过阈值 10 次，输出末尾是"疑似暴力破解，建议封禁来源 IP"。',
    'alert 消息直接跟在命令后面（不用引号），输出为"已推送告警："加上消息原文。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'cron-advanced-2',
  lang: 'cron',
  module: 'advanced',
  order: 2,
  title: '端口暴露检查：关好不该开的门',
  difficulty: 3,
  xp: 25,
  goals: [
    '用 monitor port 逐个检查端口开放状态',
    '区分该开的端口（22/80/443）与不该开的（3389/3306）',
    '发现高危端口暴露后立即告警',
  ],
  brief: `## 端口暴露检查：关好不该开的门

端口是服务器对外的门：每个开放端口背后是一个服务，也是一份攻击面。安全巡检的基本功，就是**逐个核对该开与不该开**：

- **该开**：22（SSH 管理通道）、80/443（Web 服务）；
- **不该对公网开**：3389（Windows 远程桌面）、3306（MySQL）、6379（Redis）——只应监听内网或经堡垒机跳转。

\`monitor port <端口号>\` 一次查一个，返回"开放 / 未开放"。3389 这类高危端口对公网开放，等于把保险柜搬到大街上——爆破工具全天候在扫，必须立即处置。

类比：**小区门禁巡检** —— 大门、消防通道该开，设备间的门必须锁好；巡检就是挨个确认状态。

> 💡 正确姿势是白名单思维：不是问"哪些端口开着"，而是核对"开放的只有该开的"。`,
  task: `## 任务：逐个核查端口并推送告警

模拟服务器当前开着四个端口（其中 3389 不该开）：

1. \`monitor port 22\` —— SSH 管理通道（开放，正常）；
2. \`monitor port 80\` —— Web 服务（开放，正常）；
3. \`monitor port 443\` —— HTTPS（开放，正常）；
4. \`monitor port 3389\` —— 远程桌面（开放，异常！不该对公网开）；
5. \`alert 高危端口告警：远程桌面端口 3389 对公网开放，请立即关闭或限制来源 IP\` —— 推送告警。

五行输出逐字符比对。`,
  starter: `# 第 2 关：端口暴露检查

# TODO 1: 检查端口 22 状态

# TODO 2: 检查端口 80 状态

# TODO 3: 检查端口 443 状态

# TODO 4: 检查端口 3389 状态（注意观察结果）

# TODO 5: 推送告警"高危端口告警：远程桌面端口 3389 对公网开放，请立即关闭或限制来源 IP"`,
  solution: L2_SCRIPT,
  runtime: JSON.stringify({ disk: 74, mem: 63, certDomain: 'www.zhiquest.dev', certDays: 45, httpMs: 41, sshFails: 6, ports: [22, 80, 443, 3389] }),
  hints: [
    'monitor port 后跟端口号：22、80、443 三个都会显示"开放"。',
    '本关服务器确实开着 3389——输出"端口 3389：开放"就是要告警的异常证据。',
    'alert 后面的消息不用引号，直接跟文本；消息要写清端口、风险与建议动作。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'cron-advanced-3',
  lang: 'cron',
  module: 'advanced',
  order: 3,
  title: '组合巡检：每周安全五连',
  difficulty: 4,
  xp: 30,
  goals: [
    '把单项检查组合成完整的安全巡检脚本',
    '掌握安全基线：SSH 与高危端口全部达标才算健康',
    '用 report 输出全量巡检报告收尾存档',
  ],
  brief: `## 组合巡检：一段脚本查完整个安全面

单项检查会漏：只盯 SSH 可能错过端口暴露。真实运维把检查项**组合成一段巡检脚本**，定时执行、输出存档。

本关的安全巡检五连：

1. \`monitor ssh\` —— 失败次数在正常范围；
2. \`monitor port 22\` —— 管理通道必须在；
3. \`monitor port 3389\` —— 远程桌面端口必须关；
4. \`monitor port 3306\` —— 数据库端口必须关；
5. \`report\` —— 全量报告收尾存档。

巡检的日常不是天天救火：**多数时候全绿，恰是巡检的价值**——确认基线还在，留档对比。

类比：**保安夜巡打点** —— 没异常也要逐点打卡，证明"那一夜一切正常"。

> 💡 把巡检脚本挂上 cron 每周定时跑，报告就是巡检日志——出事时能回答"上周五还是好的"。`,
  task: `## 任务：跑一次完整安全巡检（五连）

模拟服务器本周安全基线正常：

1. \`monitor ssh\` —— 登录失败 5 次，正常范围；
2. \`monitor port 22\` —— 管理通道开放，正常；
3. \`monitor port 3389\` —— 远程桌面未开放，安全；
4. \`monitor port 3306\` —— 数据库端口未开放，安全；
5. \`report\` —— 全量巡检报告收尾存档（七行结构）。

十一行输出逐字符比对。`,
  starter: `# 第 3 关：组合巡检

# TODO 1: 检查 SSH 登录失败次数（24h）

# TODO 2: 检查端口 22 状态

# TODO 3: 检查端口 3389 状态

# TODO 4: 检查端口 3306 状态

# TODO 5: 一条命令输出全量巡检报告`,
  solution: L3_SCRIPT,
  runtime: JSON.stringify({ disk: 71, mem: 57, certDomain: 'www.zhiquest.dev', certDays: 45, httpMs: 39, sshFails: 5, ports: [22, 80, 443] }),
  hints: [
    '五个命令按顺序执行：monitor ssh → monitor port 22 → monitor port 3389 → monitor port 3306 → report。',
    '本关一切正常：ssh 失败 5 次低于阈值 10 次，3389 与 3306 都显示"未开放"。',
    'report 输出七行：首行"—— 服务器巡检报告 ——"，中间按磁盘、内存、证书、HTTP、SSH 排列，末行"—— 巡检结束 ——"。',
  ],
  tests: tests(L3_EXPECTED),
};

const L4: Level = {
  id: 'cron-advanced-4',
  lang: 'cron',
  module: 'advanced',
  order: 4,
  title: '入侵迹象时间线：从发现到处置',
  difficulty: 4,
  xp: 30,
  goals: [
    '掌握事件响应四步：发现→告警→验证→处置',
    '按时间线组织响应脚本，每步有输出可追溯',
    '区分发现告警与处置通知两类消息的职责',
  ],
  brief: `## 入侵迹象时间线：发现→告警→验证→处置

发现异常只是第一步，**有序**比快更重要——慌乱中先重启服务器，反而销毁现场证据。

标准事件响应时间线，每步都有输出可追溯：

1. **发现**：\`monitor ssh\` 确认 24h 失败 47 次，远超阈值；
2. **告警**：\`alert\` 推送，附上指标值，让团队第一时间知情；
3. **验证**：\`monitor port 22\` 确认端口状态——服务还在，攻击面就还在；
4. **处置**：封 IP、加固密码策略，再 \`alert\` 推送处置通知，闭环留痕。

两条告警职责不同：发现告警说"出了什么事"，处置通知说"做了什么"。

类比：**火警演习** —— 报警、确认火源、灭火、复盘通知，一步不跳。

> 💡 时间线思维的关键是每步留痕：写清发生了什么、做了什么，事后复盘全靠这些记录。`,
  task: `## 任务：按时间线完成事件响应

模拟服务器正遭 SSH 爆破（24h 登录失败 47 次），按四步时间线响应：

1. \`monitor ssh\` —— 发现：失败次数异常（超过阈值，⚠️）；
2. \`alert 安全告警：24h 内 SSH 登录失败 47 次，疑似暴力破解，开始排查\` —— 告警：同步团队；
3. \`monitor port 22\` —— 验证：确认 SSH 端口状态（开放）；
4. \`alert 处置通知：SSH 端口 22 保持开放，来源 IP 已封禁，密码策略已加固\` —— 处置：闭环留痕。

四行输出逐字符比对。注意两条告警消息内容不同：一条说"出了什么事"，一条说"做了什么"。`,
  starter: `# 第 4 关：入侵迹象时间线

# TODO 1: 发现——检查 SSH 登录失败次数（24h）

# TODO 2: 告警——推送发现告警"安全告警：24h 内 SSH 登录失败 47 次，疑似暴力破解，开始排查"

# TODO 3: 验证——检查端口 22 状态

# TODO 4: 处置——推送处置通知"处置通知：SSH 端口 22 保持开放，来源 IP 已封禁，密码策略已加固"`,
  solution: L4_SCRIPT,
  runtime: JSON.stringify({ disk: 74, mem: 66, certDomain: 'www.zhiquest.dev', certDays: 45, httpMs: 44, sshFails: 47, ports: [22, 80, 443] }),
  hints: [
    '前两步是发现与告警：monitor ssh 确认 47 次异常，然后 alert 推送发现告警。',
    '第三步 monitor port 22 验证端口状态，输出"端口 22：开放"。',
    '最后一步 alert 推送的是处置通知——消息与发现告警不同，写明已完成的处置动作。',
  ],
  tests: tests(L4_EXPECTED),
};

export const CRON_ADVANCED: Level[] = [L1, L2, L3, L4];
