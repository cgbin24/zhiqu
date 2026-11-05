/**
 * 重新生成 src/data/terms/total.ts（术语总数轻量文件）。
 * achievements.ts 只需要这个数字 —— 若直接 import 术语库，
 * 534 条数据会被拖进首屏 bundle（仪表盘 eager 引用成就数据）。
 *
 * 用法：node scripts/gen-terms-total.mjs
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['lifecycle', 'effects', 'dsa', 'tools', 'english', 'frontend', 'network', 'security', 'backend', 'devops', 'embedded', 'agent', 'ai'];

const expr = `Promise.all([${files.map((f) => `import('./src/data/terms/${f}.ts')`).join(', ')}]).then((mods) => {
  const total = mods.reduce((s, m) => s + Object.values(m)[0].length, 0);
  console.log(String(total));
});`;

const total = execFileSync('node', ['--experimental-strip-types', '-e', expr], { cwd: root, encoding: 'utf8' }).trim();
const body = `// 自动生成：术语总数（勿手改）—— 与 13 个领域文件的实际条数保持一致。
// scripts/verify-terms.mjs 会校验此数字；增删术语后运行 node scripts/gen-terms-total.mjs 重新生成。
export const TERMS_TOTAL = ${total} as const;
`;
writeFileSync(join(root, 'src/data/terms/total.ts'), body);
console.log('src/data/terms/total.ts 已生成：TERMS_TOTAL =', total);
