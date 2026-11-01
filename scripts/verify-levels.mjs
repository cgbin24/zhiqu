/**
 * 关卡内容真实验证脚本
 *
 * 作用：对每个关卡的参考答案 solution，逐测试用例真实提交到云端编译执行，
 * 比对 stdout 与 expected 是否一致；(--full) 额外检查 starter 不会"意外通过"。
 *
 * 用法：
 *   node scripts/verify-levels.mjs [过滤词...] [--full]
 *   例：node scripts/verify-levels.mjs go/basic
 *   例：node scripts/verify-levels.mjs --full        # 全部关卡 + starter 检查
 *
 * 退出码：0 全部通过；1 存在失败。
 */

import { GO_BASIC } from '../src/data/languages/go/basic.ts';
import { GO_PARADIGM } from '../src/data/languages/go/paradigm.ts';
import { GO_ADVANCED } from '../src/data/languages/go/advanced.ts';
import { GO_TIPS } from '../src/data/languages/go/tips.ts';
import { GO_BEST } from '../src/data/languages/go/best.ts';
import { GO_INTEGRATION } from '../src/data/languages/go/integration.ts';
import { RUST_BASIC } from '../src/data/languages/rust/basic.ts';
import { RUST_PARADIGM } from '../src/data/languages/rust/paradigm.ts';
import { RUST_ADVANCED } from '../src/data/languages/rust/advanced.ts';
import { RUST_TIPS } from '../src/data/languages/rust/tips.ts';
import { RUST_BEST } from '../src/data/languages/rust/best.ts';
import { RUST_INTEGRATION } from '../src/data/languages/rust/integration.ts';
import { CPP_BASIC } from '../src/data/languages/cpp/basic.ts';
import { CPP_PARADIGM } from '../src/data/languages/cpp/paradigm.ts';
import { CPP_ADVANCED } from '../src/data/languages/cpp/advanced.ts';
import { CPP_TIPS } from '../src/data/languages/cpp/tips.ts';
import { CPP_BEST } from '../src/data/languages/cpp/best.ts';
import { CPP_INTEGRATION } from '../src/data/languages/cpp/integration.ts';

const LANG_EXEC = {
  go: { id: 'gl1260', args: '', file: 'main.go' },
  rust: { id: 'r1990', args: '', file: 'main.rs' },
  cpp: { id: 'g162', args: '-std=c++20', file: 'main.cpp' },
};

const CHAPTERS = [
  ['go', 'basic', GO_BASIC], ['go', 'paradigm', GO_PARADIGM], ['go', 'advanced', GO_ADVANCED],
  ['go', 'tips', GO_TIPS], ['go', 'best', GO_BEST], ['go', 'integration', GO_INTEGRATION],
  ['rust', 'basic', RUST_BASIC], ['rust', 'paradigm', RUST_PARADIGM], ['rust', 'advanced', RUST_ADVANCED],
  ['rust', 'tips', RUST_TIPS], ['rust', 'best', RUST_BEST], ['rust', 'integration', RUST_INTEGRATION],
  ['cpp', 'basic', CPP_BASIC], ['cpp', 'paradigm', CPP_PARADIGM], ['cpp', 'advanced', CPP_ADVANCED],
  ['cpp', 'tips', CPP_TIPS], ['cpp', 'best', CPP_BEST], ['cpp', 'integration', CPP_INTEGRATION],
];

/* ---------- CLI ---------- */
const argv = process.argv.slice(2);
const full = argv.includes('--full');
const filters = argv.filter((a) => !a.startsWith('--'));

/* ---------- 输出规整（与 src/judge/judge.ts 保持一致） ---------- */
function normalizeOutput(s) {
  const lines = s.replace(/\r\n?/g, '\n').split('\n').map((l) => l.replace(/[ \t]+$/g, ''));
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}

/* ---------- Godbolt 执行 ---------- */
const GAP_MS = 2400;
let lastAt = 0;

async function pace() {
  const wait = lastAt + GAP_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastAt = Date.now();
}

async function exec(lang, source, stdin) {
  const cfg = LANG_EXEC[lang];
  for (let attempt = 0; attempt < 4; attempt++) {
    await pace();
    try {
      const res = await fetch(`https://godbolt.org/api/compiler/${cfg.id}/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          source,
          options: {
            userArguments: cfg.args,
            executeParameters: { args: [], stdin },
            compilerOptions: { executorRequest: true },
            filters: { execute: true },
            tools: [],
            libraries: [],
          },
          lang: lang === 'cpp' ? 'c++' : lang,
          allowStoreCodeDebug: false,
        }),
        signal: AbortSignal.timeout(120_000),
      });
      if (res.status === 429 || res.status >= 500) {
        // 限流/服务端错误：退避后重试
        const backoff = 6000 * 2 ** attempt;
        console.log(`    (HTTP ${res.status}，退避 ${backoff / 1000}s 后重试)`);
        await new Promise((r) => setTimeout(r, backoff));
        throw new Error(`HTTP ${res.status}`);
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const r = await res.json();
      const join = (arr) => (arr ?? []).map((l) => l.text ?? '').join('\n');
      if (r.didExecute !== true) {
        return { executed: false, compileError: (join(r.buildResult?.stderr) || join(r.stderr)).replace(/\x1b\[[0-9;]*m/g, '') };
      }
      return { executed: true, stdout: join(r.stdout).replace(/\x1b\[[0-9;]*m/g, ''), exitCode: r.code };
    } catch (err) {
      if (attempt === 3) return { executed: false, compileError: `网络/服务错误: ${err.message}` };
    }
  }
}

/* ---------- 主流程 ---------- */
const allLevels = CHAPTERS.flatMap(([lang, mod, levels]) =>
  (levels ?? []).map((l) => ({ lang, mod, level: l })),
);

let targets = allLevels;
if (filters.length > 0) {
  targets = allLevels.filter(({ lang, mod, level }) =>
    filters.some((f) => `${lang}/${mod}`.includes(f) || level.id.includes(f)),
  );
}

console.log(`共 ${allLevels.length} 关，本次验证 ${targets.length} 关${full ? '（含 starter 防误过检查）' : ''}\n`);

const failures = [];
let passedLevels = 0;

for (const { lang, mod, level } of targets) {
  const label = `${lang}/${mod}/${level.id}`;
  process.stdout.write(`${label} `.padEnd(38));

  const cfg = LANG_EXEC[lang];
  let ok = true;
  const details = [];

  for (let i = 0; i < level.tests.length; i++) {
    const t = level.tests[i];
    const res = await exec(lang, level.solution, t.stdin);
    if (!res.executed) {
      ok = false;
      details.push(`  ✗ [${t.name}] 编译/执行失败: ${(res.compileError || '').split('\n').slice(0, 6).join('\n  ')}`);
      break;
    }
    if (normalizeOutput(res.stdout) !== normalizeOutput(t.expected)) {
      ok = false;
      details.push(
        `  ✗ [${t.name}] 输出不匹配\n` +
        `    期望: ${JSON.stringify(t.expected)}\n` +
        `    实际: ${JSON.stringify(res.stdout)}`,
      );
    }
  }

  if (ok) {
    passedLevels++;
    console.log(`✓ ${level.tests.length} 用例`);
  } else {
    failures.push(label);
    console.log('✗');
    for (const d of details) console.log(d);
  }

  // starter 防误过：起始代码不该全过（抽第一个可见用例）
  if (full && ok) {
    const vis = level.tests.find((t) => !t.hidden);
    if (vis && level.starter) {
      const res = await exec(lang, level.starter, vis.stdin);
      const starterPassed = res.executed && normalizeOutput(res.stdout) === normalizeOutput(vis.expected);
      if (starterPassed) {
        failures.push(`${label} (starter 误过)`);
        console.log(`  ⚠ starter 在用例「${vis.name}」就通过了 —— 起始代码过于完整，缺少 TODO 空洞`);
      }
    }
  }
}

console.log(`\n结果: ${passedLevels}/${targets.length} 关全部用例通过`);
if (failures.length > 0) {
  console.log(`失败关卡 (${failures.length}):`);
  for (const f of failures) console.log('  - ' + f);
  process.exit(1);
}
