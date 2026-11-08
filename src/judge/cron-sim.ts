/**
 * 定时任务实战课判题模拟器 —— 在纯内存中模拟一台“你的服务器”+ cron 调度器。
 *
 * 场景：对自己有权限的服务器做定时监控与告警（磁盘/内存/证书/HTTP/SSH 安全/端口），
 * 全部输出确定性生成（状态由 runtime JSON 注入），任何脚本永远得到同一结果。
 *
 * 脚本：每行一条命令（# 注释、空行跳过）。输出逐行拼接，与 expected 逐字符比对。
 *
 * 支持的命令（levels 只允许使用这些）：
 *   cron add "<分 时 日 月 周>" <任务名>     添加定时任务（表达式五段校验）
 *   cron list                               列出全部定时任务
 *   cron remove <任务名>                     移除定时任务
 *   monitor disk                            磁盘使用率检查（阈值 85%）
 *   monitor mem                             内存使用率检查（阈值 90%）
 *   monitor cert                            HTTPS 证书到期检查（阈值 30 天）
 *   monitor http                            服务存活检查（HTTP 状态码 + 响应时间）
 *   monitor ssh                             SSH 登录失败检查（24h，阈值 10 次）
 *   monitor port <端口号>                    端口开放检查
 *   alert <消息>                             推送告警通知
 *   report                                  全量巡检报告（disk/mem/cert/http/ssh 五项）
 */

/* ---------------- 状态 ---------------- */

interface CrontabEntry {
  expr: string;
  task: string;
}

interface CronState {
  disk: number;
  mem: number;
  certDomain: string;
  certDays: number;
  httpCode: number;
  httpMs: number;
  sshFails: number;
  ports: number[];
  crontab: CrontabEntry[];
}

function seedState(initJson: string | undefined): CronState {
  const base: CronState = {
    disk: 78,
    mem: 62,
    certDomain: 'www.example.com',
    certDays: 45,
    httpCode: 200,
    httpMs: 45,
    sshFails: 3,
    ports: [22, 80, 443],
    crontab: [],
  };
  if (!initJson) return base;
  try {
    const cfg = JSON.parse(initJson) as Partial<CronState>;
    return { ...base, ...cfg, crontab: cfg.crontab ? [...cfg.crontab] : [] };
  } catch {
    return base;
  }
}

/* ---------------- cron 表达式校验（五段：分 时 日 月 周） ---------------- */

const CRON_RANGES: [number, number][] = [
  [0, 59],
  [0, 23],
  [1, 31],
  [1, 12],
  [0, 7],
];

function validCronExpr(expr: string): boolean {
  const fields = expr.trim().split(/\s+/);
  if (fields.length !== 5) return false;
  return fields.every((field, i) => {
    if (field === '*') return true;
    const parts = field.split(',');
    return parts.every((part) => {
      if (part.startsWith('*/')) {
        const step = Number(part.slice(2));
        return Number.isInteger(step) && step >= 1 && step <= CRON_RANGES[i][1];
      }
      const nums = part.split('-');
      if (nums.length > 2) return false;
      return nums.every((numStr) => {
        const num = Number(numStr);
        return Number.isInteger(num) && num >= CRON_RANGES[i][0] && num <= CRON_RANGES[i][1];
      });
    });
  });
}

/* ---------------- 巡检项（阈值判断） ---------------- */

function checkDisk(s: CronState): string {
  return s.disk >= 85
    ? `磁盘使用率：${s.disk}%（超过阈值 85%）⚠️ 需要清理空间`
    : `磁盘使用率：${s.disk}%（阈值 85% —— 正常）`;
}

function checkMem(s: CronState): string {
  return s.mem >= 90
    ? `内存使用率：${s.mem}%（超过阈值 90%）⚠️ 需要排查进程`
    : `内存使用率：${s.mem}%（阈值 90% —— 正常）`;
}

function checkCert(s: CronState): string {
  return s.certDays < 30
    ? `证书检查：${s.certDomain} 剩余 ${s.certDays} 天（低于 30 天阈值）⚠️ 请尽快续期`
    : `证书检查：${s.certDomain} 剩余 ${s.certDays} 天（阈值 30 天 —— 正常）`;
}

function checkHttp(s: CronState): string {
  return s.httpCode === 200
    ? `HTTP 检查：${s.httpCode} OK（${s.httpMs}ms）—— 服务在线`
    : `HTTP 检查：${s.httpCode} —— 服务异常，需要排查`;
}

function checkSsh(s: CronState): string {
  return s.sshFails > 10
    ? `SSH 登录失败（24h）：${s.sshFails} 次（超过阈值 10 次）⚠️ 疑似暴力破解，建议封禁来源 IP`
    : `SSH 登录失败（24h）：${s.sshFails} 次（阈值 10 次 —— 正常）`;
}

function checkPort(s: CronState, port: number): string {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return `端口：<端口号> 无效`;
  }
  return s.ports.includes(port) ? `端口 ${port}：开放` : `端口 ${port}：未开放`;
}

/* ---------------- 执行 ---------------- */

function execLine(s: CronState, raw: string, out: string[]): void {
  const line = raw.trim();
  if (!line || line.startsWith('#')) return;

  if (!line.startsWith('cron ') && !line.startsWith('monitor ') && !line.startsWith('alert ') && !line.startsWith('report')) {
    out.push(`未知命令：${line}`);
    return;
  }

  const argv = line.trim().split(/\s+/).filter(Boolean);
  const cmd = argv[0];

  switch (cmd) {
    case 'cron': {
      const sub = argv[1];
      if (sub === 'add') {
        const quoted = line.match(/"([^"]*)"\s+(\S+)/);
        if (!quoted) { out.push('错误：用法 cron add "分 时 日 月 周" <任务名>'); return; }
        const expr = quoted[1];
        const task = quoted[2];
        if (!validCronExpr(expr)) { out.push('cron：表达式无效（格式：分 时 日 月 周）'); return; }
        if (s.crontab.some((c) => c.task === task)) { out.push(`定时任务 '${task}' 已存在`); return; }
        s.crontab.push({ expr, task });
        out.push(`已添加定时任务：${task}（${expr}）`);
        return;
      }
      if (sub === 'list') {
        if (!s.crontab.length) { out.push('当前没有任何定时任务'); return; }
        out.push(`当前定时任务（${s.crontab.length}）：`);
        s.crontab.forEach((c) => out.push(`  ${c.expr}  ${c.task}`));
        return;
      }
      if (sub === 'remove') {
        const task = argv[2];
        const idx = s.crontab.findIndex((c) => c.task === task);
        if (idx === -1) { out.push(`未找到定时任务：${task ?? ''}`); return; }
        s.crontab.splice(idx, 1);
        out.push(`已移除定时任务：${task}`);
        return;
      }
      if (sub === 'run') {
        const task = argv[2];
        if (!s.crontab.some((c) => c.task === task)) { out.push(`未找到定时任务：${task ?? ''}`); return; }
        out.push(`已手动触发：${task}（执行完成）`);
        return;
      }
      out.push(`cron：'${sub ?? ''}' 不是一个 cron 子命令`);
      return;
    }
    case 'monitor': {
      const item = argv[1];
      switch (item) {
        case 'disk': out.push(checkDisk(s)); return;
        case 'mem': out.push(checkMem(s)); return;
        case 'cert': out.push(checkCert(s)); return;
        case 'http': out.push(checkHttp(s)); return;
        case 'ssh': out.push(checkSsh(s)); return;
        case 'port': out.push(checkPort(s, Number(argv[2]))); return;
        default: out.push(`未知监控项：${item ?? ''}`); return;
      }
    }
    case 'alert': {
      const msg = line.slice(line.indexOf('alert') + 5).trim();
      if (!msg) { out.push('错误：请提供告警消息'); return; }
      out.push(`已推送告警：${msg}`);
      return;
    }
    case 'report': {
      out.push('—— 服务器巡检报告 ——');
      out.push(checkDisk(s));
      out.push(checkMem(s));
      out.push(checkCert(s));
      out.push(checkHttp(s));
      out.push(checkSsh(s));
      out.push('—— 巡检结束 ——');
      return;
    }
    default:
      out.push(`kb: '${cmd}' 不是一个监控命令`);
  }
}

/** 执行一段监控脚本，返回全部输出（\n 连接） */
export function runCronScript(script: string, initJson: string | undefined): string {
  const s = seedState(initJson);
  const out: string[] = [];
  for (const line of script.replace(/\r\n?/g, '\n').split('\n')) {
    execLine(s, line.trim(), out);
  }
  return out.join('\n');
}
