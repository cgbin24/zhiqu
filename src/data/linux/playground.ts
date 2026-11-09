/**
 * 练习场「Linux 终端演练」场景库。
 * fs JSON 与关卡 runtime 同构（{cwd, tree, system?}），由 initFs 加载。
 * tree 描述的是 cwd 目录的内容；system 是 ps/df/free/netstat 的数据源。
 */

import type { FsNode } from '@/judge/linux-sim';

const dir = (children: Record<string, FsNode> = {}): FsNode => ({ type: 'dir', children });
const file = (content = ''): FsNode => ({ type: 'file', content });

export interface TerminalScenario {
  id: string;
  name: string;
  desc: string;
  fs: string;
}

/* ---------- 场景 1：家目录 ---------- */

const HOME_FS = JSON.stringify({
  cwd: '/home/student',
  tree: dir({
    'welcome.txt': file('欢迎来到 Linux 终端演练！\n试试：ls / cat welcome.txt / mkdir demo\n敲 clear 可以清屏。\n'),
    'todo.txt': file('1. 学会 ls 与 cd\n2. 用 cat 读文件\n3. 玩转 grep 与管道\n'),
    docs: dir({
      'readme.md': file('# 学习笔记\n- 管道把上一个命令的输出接给下一个命令\n- grep 负责筛选，sort 负责排序，uniq -c 负责计数\n'),
      'cheatsheet.md': file('# 速查\npwd  当前目录\nls   列出内容\ncd   切换目录\ncat  看文件\ntouch 建空文件\nrm   删除\n'),
    }),
    projects: dir({
      'hello.sh': file('#!/bin/bash\necho "hello, linux"\n'),
    }),
  }),
});

/* ---------- 场景 2：日志分析 ---------- */

const LOG_FS = JSON.stringify({
  cwd: '/var/log',
  tree: dir({
    'app.log': file(
      '2026-11-09 08:00:01 INFO  服务启动完成，监听端口 8080\n' +
      '2026-11-09 08:12:33 WARN  响应时间超过阈值：1.2s\n' +
      '2026-11-09 09:03:11 ERROR 数据库连接超时：db-primary:5432\n' +
      '2026-11-09 09:03:14 ERROR 重试失败：db-primary:5432\n' +
      '2026-11-09 10:44:02 INFO  定时备份完成（大小 128M）\n' +
      '2026-11-09 11:21:57 WARN  磁盘使用率 81%\n' +
      '2026-11-09 12:00:00 INFO  健康检查通过\n' +
      '2026-11-09 14:37:29 ERROR 缓存雪崩：命中率跌至 12%\n',
    ),
    'access.log': file(
      '203.0.113.7 GET /index.html 200\n' +
      '198.51.100.23 GET /api/items 200\n' +
      '203.0.113.7 POST /api/login 401\n' +
      '192.0.2.14 GET /index.html 200\n' +
      '203.0.113.7 POST /api/login 401\n' +
      '198.51.100.23 GET /static/app.js 200\n' +
      '192.0.2.14 GET /api/items 500\n',
    ),
    nginx: dir({
      'error.log': file('2026/11/09 09:03:11 [error] upstream timed out while reading response header\n'),
    }),
  }),
});

/* ---------- 场景 3：服务器排查（system 数据齐全，可玩 ps/df/free/netstat/du） ---------- */

const SERVER_FS = JSON.stringify({
  cwd: '/home/student',
  tree: dir({
    'notes.txt': file('排查思路：\n1. df -h 看磁盘  2. free 看内存  3. ps 找吃 CPU 的进程\n4. netstat 查监听端口  5. du 定位大目录\n'),
    logs: dir({
      'app.log': file('ERROR Overflow...\n'.repeat(400)),
    }),
    tmp: dir({
      'dump.dat': file('x'.repeat(2000)),
    }),
  }),
  system: {
    ps: [
      { pid: 1, cmd: '/sbin/init', cpu: 0.1 },
      { pid: 348, cmd: 'sshd: /usr/sbin/sshd -D', cpu: 0.2 },
      { pid: 512, cmd: 'nginx: worker process', cpu: 1.4 },
      { pid: 733, cmd: 'mysqld', cpu: 3.8 },
      { pid: 921, cmd: 'python3 worker.py', cpu: 87.5 },
      { pid: 966, cmd: 'redis-server 127.0.0.1:6379', cpu: 0.6 },
    ],
    df: { total: 40, used: 36 },
    memMb: 7982,
    memUsedMb: 7312,
    ports: [22, 80, 443, 3306],
  },
});

export const TERMINAL_SCENARIOS: TerminalScenario[] = [
  { id: 'home', name: '🏠 家目录', desc: '从零开始练手感：ls / cd / cat / mkdir / 管道', fs: HOME_FS },
  { id: 'logs', name: '📜 日志分析', desc: '在 /var/log 里玩 grep / sort / uniq / wc / sed', fs: LOG_FS },
  { id: 'server', name: '🖥️ 服务器排查', desc: 'df / free / ps / netstat / du 一齐上阵，磁盘已 90%', fs: SERVER_FS },
];
