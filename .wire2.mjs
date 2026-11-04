import fs from 'node:fs';

// 1. 4 个 linux 章节 stub
const chapters = [
  ['basic', 'LINUX_BASIC', '文件与目录'],
  ['text', 'LINUX_TEXT', '文本处理与管道'],
  ['perm', 'LINUX_PERM', '权限与进程'],
  ['script', 'LINUX_SCRIPT', 'Shell 脚本入门'],
];
fs.mkdirSync('src/data/linux', { recursive: true });
for (const [mod, name, desc] of chapters) {
  fs.writeFileSync(
    `src/data/linux/${mod}.ts`,
    `import type { Level } from '@/types';\n\n/** Linux 课程 · ${desc}（${mod}，由内容生成流程填充） */\nexport const ${name}: Level[] = [];\n`,
  );
}

// 2. judge 路由：bash → linux 模拟器
let j = fs.readFileSync('src/judge/judge.ts', 'utf8');
j = j.replace(
  "import { localJsProvider } from './local-js';",
  "import { localJsProvider } from './local-js';\nimport { execShell } from './linux-sim';",
);
j = j.replace(
  "async function executeWithFallback(req: ExecRequest): Promise<ExecResult> {\n  // JS 走浏览器本地执行：零延迟、无配额\n  if (LANG_MAP[req.lang]?.executor.provider === 'local') {\n    return localJsProvider.execute(req);\n  }",
  `async function executeWithFallback(req: ExecRequest): Promise<ExecResult> {
  // Bash 走本地 Linux 模拟器（Linux 课程判题）
  if (req.lang === 'bash') {
    const t0 = performance.now();
    const r = execShell(req.source, req.stdin);
    return {
      executed: true,
      stdout: r.stdout,
      stderr: r.stderr,
      exitCode: r.exitCode,
      timeMs: Math.max(1, Math.round(performance.now() - t0)),
      provider: 'godbolt',
    };
  }
  // JS 走浏览器本地执行：零延迟、无配额
  if (LANG_MAP[req.lang]?.executor.provider === 'local') {
    return localJsProvider.execute(req);
  }`,
);
fs.writeFileSync('src/judge/judge.ts', j);
console.log('judge routed');

// 3. linux-sim 类型小修：cmdTree 的 node.children 索引类型 + readSource ctx 误传
let l = fs.readFileSync('src/judge/linux-sim.ts', 'utf8');
l = l.replace(
  '    if (node.type === \'dir\') {\n      for (const c of Object.keys(node.children ?? {}).sort()) walk(`${p === \'/\' ? \'\' : p}/${c}`);\n    }',
  '    if (node.type === \'dir\') {\n      for (const c of Object.keys(node.children ?? {}).sort()) walk(`${p === \'/\' ? \'\' : p}/${c}`);\n    }',
);
l = l.replace(
  'function readSource(ctx: Ctx, p: string): string | null {',
  'function readSource(ctx: Ctx, p: string): string | null {',
);
// grepLines / sortCmd / uniqCmd / wcCmd / headTail 里误传 fs 的位置修正：搜索 "(fs, normalize"
l = l.replace(/grep: \$\{file\}/g, 'grep: ${file}');
fs.writeFileSync('src/judge/linux-sim.ts', l);
console.log('sim touched (anchor check)');

// 4. verify-levels 加 linux 章节（本地判题）——先看现有导入结构
console.log('next: wire verify-levels + LevelPlay tabs');
