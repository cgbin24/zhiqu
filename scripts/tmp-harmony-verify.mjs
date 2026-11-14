// 鸿蒙关卡验证 harness：逐用例计算输出 → refresh 重写 expected / check 比对 + starter 防误过（跑完即删）
// 用法：node scripts/tmp-harmony-verify.mjs refresh|check
import { readFileSync, writeFileSync } from 'node:fs';
import { execArkTS } from '../src/judge/arkts-sim.ts';

const mode = process.argv[2] ?? 'check';
const files = [
  ['src/data/harmony/basic.ts', 'B1'],
  ['src/data/harmony/paradigm.ts', 'P2'],
  ['src/data/harmony/advanced.ts', 'A3'],
  ['src/data/harmony/tips.ts', 'T4'],
  ['src/data/harmony/best.ts', 'B5'],
  ['src/data/harmony/integration.ts', 'I6'],
];

async function loadLevels(path) {
  const mod = await import(`../${path}`);
  return Object.values(mod)[0];
}

const show = (r) =>
  r.ok ? [r.logs.join('\n'), r.dump].filter(Boolean).join('\n') : [r.logs.join('\n'), r.error ?? '执行出错'].filter(Boolean).join('\n');

let fail = 0;
for (const [path, prefix] of files) {
  let fileSrc = null;
  try {
    fileSrc = readFileSync(path, 'utf8');
  } catch {
    continue;
  }
  const levels = await loadLevels(path);
  // 逐用例计算输出（文件顺序）
  const outs = [];
  for (const lv of levels) {
    const solSrc = lv.algo?.solutions?.arkts ?? lv.solution;
    for (const t of lv.tests) {
      const r = execArkTS(solSrc, lv.runtime, t.stdin);
      outs.push({ lv, t, out: show(r), ok: r.ok });
    }
    // starter 防误过（首用例交互）
    const st = execArkTS(lv.algo?.starters?.arkts ?? lv.starter, lv.runtime, lv.tests[0].stdin);
    const stOut = show(st);
    const solOut = outs[outs.length - lv.tests.length].out;
    const dup = stOut === solOut;
    if (dup) fail++;
    console.log(`${r0mark(outs, lv)} ${lv.id} · starter 防误过: ${dup ? '!!! 误过 !!!' : 'OK'}`);
  }
  if (mode === 'refresh') {
    // 按文件顺序重写所有 expected（与 levels/tests 顺序一一对应；单双引号都匹配）
    let idx = 0;
    fileSrc = fileSrc.replace(/expected: (?:'[^']*'|"(?:[^"\\]|\\.)*")/g, () => `expected: ${JSON.stringify(outs[idx++].out)}`);
    writeFileSync(path, fileSrc);
  } else {
    for (const o of outs) {
      if (!o.ok || o.t.expected !== o.out) {
        fail++;
        console.log(`  ✗ 用例失败: ${o.lv.id} [${o.t.name}] ${o.ok ? 'expected 不匹配' : o.error?.slice(0, 90)}`);
      }
    }
  }
}
console.log(mode === 'refresh' ? '刷新完成' : fail ? `HAS FAILURES (${fail})` : 'ALL OK');

function r0mark(outs, lv) {
  const lvOuts = outs.slice(-lv.tests.length);
  return lvOuts.every((o) => o.ok) && lvOuts.every((o) => o.t.expected === o.out) ? '✓' : '✗';
}
