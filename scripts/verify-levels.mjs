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
import { LINUX_BASIC } from '../src/data/linux/basic.ts';
import { LINUX_TEXT } from '../src/data/linux/text.ts';
import { LINUX_PERM } from '../src/data/linux/perm.ts';
import { LINUX_SCRIPT } from '../src/data/linux/script.ts';
import { LINUX_BEST } from '../src/data/linux/best.ts';
import { LINUX_INTEGRATION } from '../src/data/linux/integration.ts';
import { AGENTDEV_BASIC } from '../src/data/agentdev/basic.ts';
import { AGENTDEV_PARADIGM } from '../src/data/agentdev/paradigm.ts';
import { AGENTDEV_ADVANCED } from '../src/data/agentdev/advanced.ts';
import { AGENTDEV_TIPS } from '../src/data/agentdev/tips.ts';
import { AGENTDEV_BEST } from '../src/data/agentdev/best.ts';
import { AGENTDEV_INTEGRATION } from '../src/data/agentdev/integration.ts';

import { ALGO_BASIC } from '../src/data/algo/basic.ts';
import { ALGO_PARADIGM } from '../src/data/algo/paradigm.ts';
import { ALGO_ADVANCED } from '../src/data/algo/advanced.ts';
import { ALGO_TIPS } from '../src/data/algo/tips.ts';
import { ALGO_BEST } from '../src/data/algo/best.ts';
import { ALGO_INTEGRATION } from '../src/data/algo/integration.ts';
import { executeJsLocally } from '../src/judge/local-js.ts';
import { agentPreamble } from '../src/data/agent-runtime.ts';
import { execShell } from '../src/judge/linux-sim.ts';

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
  ['algo', 'basic', ALGO_BASIC], ['algo', 'paradigm', ALGO_PARADIGM], ['algo', 'advanced', ALGO_ADVANCED],
  ['algo', 'tips', ALGO_TIPS], ['algo', 'best', ALGO_BEST], ['algo', 'integration', ALGO_INTEGRATION],
  ['linux', 'basic', LINUX_BASIC], ['linux', 'text', LINUX_TEXT], ['linux', 'perm', LINUX_PERM], ['linux', 'script', LINUX_SCRIPT], ['linux', 'best', LINUX_BEST], ['linux', 'integration', LINUX_INTEGRATION],
  ['agentdev', 'basic', AGENTDEV_BASIC], ['agentdev', 'paradigm', AGENTDEV_PARADIGM], ['agentdev', 'advanced', AGENTDEV_ADVANCED], ['agentdev', 'tips', AGENTDEV_TIPS], ['agentdev', 'best', AGENTDEV_BEST], ['agentdev', 'integration', AGENTDEV_INTEGRATION],
];

/** 算法关的作答语言集（JS 本地验证，其余云端） */
const ALGO_LANGS = ['javascript', 'go', 'rust', 'cpp'];

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

/** 本地立即执行（JS），失败返回 null 交给调用方走云端 */
function execJs(source, stdin) {
  const r = executeJsLocally(source, stdin);
  return { executed: r.exitCode === null || r.exitCode === 0, compileError: r.stderr, stdout: r.stdout, exitCode: r.exitCode };
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

// 本地验证器：返回 null 表示该测试不适用本地路径
function execJsPreamble(src, stdin, runtimeJson) {
  return executeJsLocally(src, stdin, runtimeJson ? agentPreamble(runtimeJson) : undefined);
}

function verifyCaseLocal(level, t) {
  if (level.lang !== 'algo') return null;
  const js = level.algo?.solutions?.javascript;
  if (!js) return { executed: false, compileError: '缺少 javascript 参考答案' };
  return execJs(js, t.stdin);
}

for (const { lang, mod, level } of targets) {
  const label = `${lang}/${mod}/${level.id}`;
  process.stdout.write(`${label} `.padEnd(40));

  let ok = true;
  const details = [];

  // Linux 关：本地模拟器判题
  if (level.lang === 'linux') {
    let ok2 = true;
    const details2 = [];
    const src = level.algo?.solutions?.bash;
    if (!src) {
      ok2 = false;
      details2.push('  ✗ 缺少 bash 参考答案');
    }
    for (const t of level.tests) {
      if (!ok2) break;
      const res = execShell(src ?? '', t.fs ?? level.fs ?? '{}');
      const got = (res.stdout || '').replace(/\n+$/, '');
      const want = (t.expected || '').replace(/\n+$/, '');
      if (res.exitCode !== 0 && res.stderr) {
        ok2 = false;
        details2.push('  ✗ [' + t.name + '] 执行报错: ' + res.stderr.split('\n').slice(0, 3).join(' | '));
        break;
      }
      if (got !== want) {
        ok2 = false;
        details2.push('  ✗ [' + t.name + '] 输出不匹配\n    期望: ' + JSON.stringify(t.expected) + '\n    实际: ' + JSON.stringify(res.stdout));
      }
    }
    if (ok2) {
      passedLevels++;
      console.log('✓ 模拟终端 ' + level.tests.length + ' 用例');
    } else {
      failures.push(label);
      console.log('✗');
      for (const d of details2) console.log(d);
    }
    continue;
  }

  // Agent 关：本地 JS + Mock LLM runtime 注入
  if (level.lang === 'agentdev') {
    let ok3 = true;
    const details3 = [];
    const src = level.algo?.solutions?.javascript;
    if (!src) { ok3 = false; details3.push('  ✗ 缺少 javascript 参考答案'); }
    for (const t of level.tests) {
      if (!ok3) break;
      const r = execJsPreamble(src, t.stdin, level.runtime);
      if (r.exitCode !== 0 && r.stderr) {
        ok3 = false;
        details3.push('  ✗ [' + t.name + '] 执行报错: ' + r.stderr.split('\n').slice(0, 3).join(' | '));
        break;
      }
      const got = (r.stdout || '').replace(/\n+$/, '');
      const want = (t.expected || '').replace(/\n+$/, '');
      if (got !== want) {
        ok3 = false;
        details3.push('  ✗ [' + t.name + '] 输出不匹配\n    期望: ' + JSON.stringify(t.expected) + '\n    实际: ' + JSON.stringify(r.stdout));
      }
    }
    if (ok3) { passedLevels++; console.log('✓ Mock LLM ' + level.tests.length + ' 用例'); } else { failures.push(label); console.log('✗'); for (const d of details3) console.log(d); }
    continue;
  }

  // 算法关：逐语言验证
  if (level.lang === 'algo') {
    for (const l of ALGO_LANGS) {
      const src = level.algo?.solutions?.[l];
      if (!src) {
        ok = false;
        details.push(`  ✗ 缺少 ${l} 参考答案`);
        continue;
      }
      for (const t of level.tests) {
        let res;
        if (l === 'javascript') {
          res = execJs(src, t.stdin);
        } else {
          res = await exec(l, src, t.stdin);
        }
        if (!res.executed) {
          ok = false;
          details.push(`  ✗ [${l}] [${t.name}] 编译/执行失败: ${(res.compileError || '').split('\n').slice(0, 5).join('\n  ')}`);
          break;
        }
        if (normalizeOutput(res.stdout) !== normalizeOutput(t.expected)) {
          ok = false;
          details.push(
            `  ✗ [${l}] [${t.name}] 输出不匹配\n` +
            `    期望: ${JSON.stringify(t.expected)}\n` +
            `    实际: ${JSON.stringify(res.stdout)}`,
          );
        }
      }
    }
  } else {
    for (let i = 0; i < level.tests.length; i++) {
      const t = level.tests[i];
      const localRes = verifyCaseLocal(level, t);
      const res = localRes ?? (await exec(lang, level.solution ?? '', t.stdin));
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
  }

  if (ok) {
    passedLevels++;
    const langTag = level.lang === 'algo' ? `全 ${ALGO_LANGS.length} 语言` : `${level.tests.length} 用例`;
    console.log(`✓ ${langTag}`);
  } else {
    failures.push(label);
    console.log('✗');
    for (const d of details) console.log(d);
  }

  // starter 防误过：起始代码不该全过（抽第一个可见用例；算法关用 JS 本地验证）
  if (full && ok) {
    const vis = level.tests.find((t) => !t.hidden);
    if (vis) {
      const starterSrc = level.lang === 'algo' ? level.algo?.starters?.javascript : level.starter;
      if (starterSrc) {
        let res;
        if (level.lang === 'algo' || level.lang === 'javascript') {
          res = execJs(starterSrc, vis.stdin);
        } else {
          res = await exec(level.lang, starterSrc, vis.stdin);
        }
        const starterPassed = res.executed && normalizeOutput(res.stdout) === normalizeOutput(vis.expected);
        if (starterPassed) {
          failures.push(`${label} (starter 误过)`);
          console.log(`  ⚠ starter 在用例「${vis.name}」就通过了 —— 起始代码过于完整，缺少 TODO 空洞`);
        }
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
