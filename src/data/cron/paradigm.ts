import type { Level } from '@/types';

/**
 * 定时任务实战课程 · 第二章：服务器巡检（paradigm，4 关）
 *
 * 提交一段监控/调度脚本，由本地服务器模拟器（src/judge/cron-sim.ts）执行，
 * stdout 与 expected 逐字符比对。服务器状态由 runtime JSON 注入，输出完全确定。
 *
 * 注意：模拟器状态字段名为 httpCode —— runtime 里写 http 不会生效（见第 4 关）。
 */

const L1_SCRIPT = `monitor disk
report`;

const L1_EXPECTED = `磁盘使用率：72%（阈值 85% —— 正常）
—— 服务器巡检报告 ——
磁盘使用率：72%（阈值 85% —— 正常）
内存使用率：58%（阈值 90% —— 正常）
证书检查：www.zhiquest.dev 剩余 52 天（阈值 30 天 —— 正常）
HTTP 检查：200 OK（38ms）—— 服务在线
SSH 登录失败（24h）：1 次（阈值 10 次 —— 正常）
—— 巡检结束 ——`;

const L2_SCRIPT = `monitor disk
alert 磁盘使用率 91% 超过阈值 85%，请清理日志与大文件`;

const L2_EXPECTED = `磁盘使用率：91%（超过阈值 85%）⚠️ 需要清理空间
已推送告警：磁盘使用率 91% 超过阈值 85%，请清理日志与大文件`;

const L3_SCRIPT = `monitor cert
alert 证书 www.zhiquest.dev 仅剩 12 天到期，请尽快续期`;

const L3_EXPECTED = `证书检查：www.zhiquest.dev 剩余 12 天（低于 30 天阈值）⚠️ 请尽快续期
已推送告警：证书 www.zhiquest.dev 仅剩 12 天到期，请尽快续期`;

const L4_SCRIPT = `monitor http
alert Web 服务返回 500，用户无法正常访问，请立即排查应用日志
monitor disk
monitor mem
monitor http`;

const L4_EXPECTED = `HTTP 检查：500 —— 服务异常，需要排查
已推送告警：Web 服务返回 500，用户无法正常访问，请立即排查应用日志
磁盘使用率：66%（阈值 85% —— 正常）
内存使用率：59%（阈值 90% —— 正常）
HTTP 检查：500 —— 服务异常，需要排查`;

function tests(expected: string) {
  return [
    { name: '样例：脚本输出逐字符比对', stdin: '', expected },
    { name: '检查：命令顺序与状态流转', stdin: '', expected },
    { name: '检查：输出格式规范', stdin: '', expected },
    { name: '隐藏：完整输出比对', stdin: '', expected, hidden: true },
  ];
}

const L1: Level = {
  id: 'cron-paradigm-1',
  lang: 'cron',
  module: 'paradigm',
  order: 1,
  title: '巡检报告：一条命令看清全貌',
  difficulty: 2,
  xp: 20,
  goals: [
    '认识 report 全量巡检报告的七行结构',
    '理解单项检查与全量报告的关系',
    '建立"每日巡检存档"的运维习惯',
  ],
  brief: `## 巡检报告：一条命令看清服务器全貌

前面学的巡检命令一次只查一项：磁盘、内存、证书、HTTP、SSH 各敲一条。值班巡检要的是效率 —— \`report\` 一条命令跑完全部五项，输出固定七行：

- 首行 \`—— 服务器巡检报告 ——\`，报告开始；
- 中间五行为磁盘 / 内存 / 证书 / HTTP / SSH 检查结果，每行自带"正常 / ⚠️"结论；
- 末行 \`—— 巡检结束 ——\`，报告收尾。

把 report 挂到 cron 每天凌晨执行，输出存档，就是"每日健康记录"—— 出事故时回看历史报告，能定位问题从哪天开始恶化。

类比：**体检中心** —— 单项 monitor 是挂一个科室，report 是套餐体检：一次排队，五项结论全拿到，末尾还有"检查完毕"的盖章。

> 💡 七行结构是固定的：头一行 + 五项检查 + 尾一行。熟练之后扫一眼就能发现哪一行出现了 ⚠️。`,
  task: `## 任务：跑一份全量巡检报告

1. \`monitor disk\` —— 先做单项检查，观察单行输出；
2. \`report\` —— 一条命令跑全部五项，得到七行巡检报告。

服务器状态全部正常，共八行输出逐字符比对。注意报告的七行结构：首行标题 + 五项检查 + 末行结束。`,
  starter: `# 第 1 关：巡检报告

# TODO 1: 单项检查磁盘使用率

# TODO 2: 一条命令跑出全量巡检报告`,
  solution: L1_SCRIPT,
  runtime: JSON.stringify({ disk: 72, mem: 58, certDomain: 'www.zhiquest.dev', certDays: 52, http: 200, httpMs: 38, sshFails: 1, ports: [22, 80, 443] }),
  hints: [
    'report 不需要任何参数，单独一行直接执行。',
    '第一行 monitor disk 输出磁盘单项结论；report 会把这一行重复作为报告的第二行。',
    '报告七行：首行"—— 服务器巡检报告 ——"，末行"—— 巡检结束 ——"，中间按磁盘、内存、证书、HTTP、SSH 顺序排列。',
  ],
  tests: tests(L1_EXPECTED),
};

const L2: Level = {
  id: 'cron-paradigm-2',
  lang: 'cron',
  module: 'paradigm',
  order: 2,
  title: '磁盘告警：从发现到处置',
  difficulty: 3,
  xp: 25,
  goals: [
    '理解磁盘 85% 警戒线与写满风险',
    '掌握 monitor disk 的异常输出格式',
    '掌握 alert 推送带上下文的告警消息',
  ],
  brief: `## 磁盘告警：从发现到处置的闭环

磁盘是最先爆掉的资源：日志疯涨、备份堆积都会推高使用率。**超过 85% 就是警戒线**——写满后数据库写不进、日志落不了盘，服务大面积崩溃。

monitor disk 内置判断：达到 85% 时，输出末尾是 \`⚠️ 需要清理空间\`；否则显示"—— 正常"。用 \`alert <消息>\` 把结论转发出去，值班手机立刻收到。

告警消息要**带上下文**：写清指标值与建议动作（如"磁盘 91%，请清理日志"），而不是只喊"出事了"——收到的人不登录服务器就知道做什么。

类比：**烟雾报警器** —— 传感器（monitor）发现烟雾，蜂鸣器（alert）送到耳边；没有蜂鸣器，火再大也没人知道。

> 💡 监控闭环三步：发现（monitor）→ 告警（alert）→ 处置（清理空间）。只监视不告警，等于没装监控。`,
  task: `## 任务：发现磁盘异常并推送告警

模拟服务器磁盘使用率已升至 91%（超过 85% 阈值）：

1. \`monitor disk\` —— 确认异常（输出含 ⚠️ 需要清理空间）；
2. \`alert 磁盘使用率 91% 超过阈值 85%，请清理日志与大文件\` —— 推送处置通知。

两行输出逐字符比对。注意告警消息包含了指标值（91%）与建议动作（清理日志与大文件）。`,
  starter: `# 第 2 关：磁盘告警

# TODO 1: 检查磁盘使用率，确认超过 85% 阈值

# TODO 2: 推送告警，消息包含指标值 91% 与建议动作`,
  solution: L2_SCRIPT,
  runtime: JSON.stringify({ disk: 91, mem: 64, certDomain: 'www.zhiquest.dev', certDays: 41, http: 200, httpMs: 52, sshFails: 4, ports: [22, 80, 443] }),
  hints: [
    'monitor disk 不带参数；磁盘 91% 已达 85 阈值，输出末尾是"⚠️ 需要清理空间"。',
    'alert 后面直接跟消息文本，不用引号、不用等号。',
    '告警消息逐字为：磁盘使用率 91% 超过阈值 85%，请清理日志与大文件。',
  ],
  tests: tests(L2_EXPECTED),
};

const L3: Level = {
  id: 'cron-paradigm-3',
  lang: 'cron',
  module: 'paradigm',
  order: 3,
  title: '证书续期演练',
  difficulty: 3,
  xp: 25,
  goals: [
    '理解证书过期的严重性：全站不可访问',
    '掌握 monitor cert 的临期告警输出',
    '学会推送带域名与天数的续期提醒',
  ],
  brief: `## 证书续期：离到期越近，动作越要快

HTTPS 证书有有效期（通常一年）。证书一旦过期，浏览器会直接拦截访问，**全站瞬间不可用**——这不是"降级"，是彻底下线。不少站点的事故复盘写着同一句话：不是被黑客打垮的，是忘了续证书。

续期要经过申请、验证、部署，通常需要几天，所以行业通行 **30 天阈值**：低于 30 天就告警，给续期留足缓冲。monitor cert 在低于 30 天时输出 \`⚠️ 请尽快续期\`，否则"—— 正常"。

发现临期后用 alert 推送提醒，消息带上域名和剩余天数——负责人一眼看到该续哪张、还剩多久。

类比：**驾照换证** —— 到期前车照开、路照跑，一切正常；一旦过期被查，寸步难行。老司机的做法是设个"提前 30 天"的提醒。

> 💡 证书事故最冤枉：提前 30 天告警，续期只要 10 分钟，却能避免全站下线。`,
  task: `## 任务：发现证书临期并推送续期提醒

模拟服务器 HTTPS 证书仅剩 12 天（低于 30 天阈值）：

1. \`monitor cert\` —— 确认临期（输出含 ⚠️ 请尽快续期）；
2. \`alert 证书 www.zhiquest.dev 仅剩 12 天到期，请尽快续期\` —— 推送续期提醒。

两行输出逐字符比对。消息里带上域名与剩余天数，负责人一眼看到该续哪张证书、还剩多久。`,
  starter: `# 第 3 关：证书续期演练

# TODO 1: 检查 HTTPS 证书剩余天数，确认低于 30 天阈值

# TODO 2: 推送续期提醒，消息包含域名与剩余天数`,
  solution: L3_SCRIPT,
  runtime: JSON.stringify({ disk: 68, mem: 61, certDomain: 'www.zhiquest.dev', certDays: 12, http: 200, httpMs: 41, sshFails: 2, ports: [22, 80, 443] }),
  hints: [
    'monitor cert 输出包含域名 www.zhiquest.dev 与剩余天数 12；低于 30 天时末尾是"⚠️ 请尽快续期"。',
    'alert 消息里直接写域名与天数，例如用"仅剩 12 天到期"描述紧迫性。',
    '第二条输出是"已推送告警："加上你写的完整消息文本，请与任务描述逐字一致。',
  ],
  tests: tests(L3_EXPECTED),
};

const L4: Level = {
  id: 'cron-paradigm-4',
  lang: 'cron',
  module: 'paradigm',
  order: 4,
  title: 'HTTP 故障发现：监控第一防线',
  difficulty: 4,
  xp: 30,
  goals: [
    '理解存活检查是监控的第一防线',
    '掌握 monitor http 异常状态的输出格式',
    '体会"资源正常不等于服务正常"的排查思路',
  ],
  brief: `## HTTP 存活检查：监控的第一防线

磁盘、内存都正常，用户却打不开网站——这种事故资源指标看不出来，只有**存活检查**能发现。monitor http 发一次真实请求：200 表示在线（附耗时）；500 等状态码就是服务异常。

它是"第一防线"：

- 用户反馈"打不开"之前，存活检查已经先知道；
- 资源正常 **不等于** 服务正常——应用崩溃、配置出错都发生在资源健康时；
- 服务不会自愈：500 不会自己变回 200，必须有人介入。

发现异常立即 alert；再复查 disk、mem 正常，说明问题在应用层——对比直接缩小排查范围。

类比：**前台访客登记** —— 只问一句"今天能正常接待吗"，答不上来就拉响警报。

> 💡 排查顺序先外后内：先看服务活不活（http），再看资源够不够（disk / mem），最后翻应用日志。`,
  task: `## 任务：发现服务异常并对比资源指标

模拟服务器 Web 服务返回 500（资源指标正常）：

1. \`monitor http\` —— 确认服务异常（输出"服务异常，需要排查"）；
2. \`alert Web 服务返回 500，用户无法正常访问，请立即排查应用日志\` —— 推送告警；
3. \`monitor disk\` —— 磁盘正常（对比项一）；
4. \`monitor mem\` —— 内存正常（对比项二）；
5. \`monitor http\` —— 前后两次检查对比，仍是 500（服务不会自愈）。

五行输出逐字符比对。思考：资源指标全绿，为什么用户还是打不开网站？`,
  starter: `# 第 4 关：HTTP 故障发现

# TODO 1: 检查 HTTP 服务存活（预期返回 500）

# TODO 2: 推送告警，说明服务异常需要排查应用日志

# TODO 3: 对比检查磁盘与内存（应显示正常）

# TODO 4: 再次检查 HTTP，确认服务不会自愈`,
  solution: L4_SCRIPT,
  // 模拟器状态字段名为 httpCode（写 http 不生效），故此处用 httpCode: 500
  runtime: JSON.stringify({ disk: 66, mem: 59, certDomain: 'www.zhiquest.dev', certDays: 60, httpCode: 500, httpMs: 120, sshFails: 2, ports: [22, 80, 443] }),
  hints: [
    'HTTP 非 200 时输出不含响应耗时，格式为"HTTP 检查：500 —— 服务异常，需要排查"。',
    '对比项用 monitor disk 与 monitor mem，资源正常时输出以"—— 正常"结尾。',
    '前后两次 monitor http 输出完全相同——500 不会自己恢复，必须人工介入。',
  ],
  tests: tests(L4_EXPECTED),
};

export const CRON_PARADIGM: Level[] = [L1, L2, L3, L4];
