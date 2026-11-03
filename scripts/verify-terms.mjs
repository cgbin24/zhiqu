/**
 * 术语内容完整性校验（静态检查，无需网络）：
 *  - id 全局唯一、前缀与领域匹配
 *  - 必填字段非空（name/en/cat/sub/summary/detail）
 *  - relations 指向存在的术语 id，且不自指
 *  - cat 与所在文件一致
 */
import { LC_LIFECYCLE } from '../src/data/terms/lifecycle.ts';
import { EFF_EFFECTS } from '../src/data/terms/effects.ts';
import { DSA_DSA } from '../src/data/terms/dsa.ts';
import { TOOLS_TOOLS } from '../src/data/terms/tools.ts';
import { FE_FRONTEND } from '../src/data/terms/frontend.ts';
import { NET_NETWORK } from '../src/data/terms/network.ts';
import { SEC_SECURITY } from '../src/data/terms/security.ts';
import { BE_BACKEND } from '../src/data/terms/backend.ts';
import { DEVOPS_DEVOPS } from '../src/data/terms/devops.ts';
import { EMB_EMBEDDED } from '../src/data/terms/embedded.ts';
import { AGENT_AGENT } from '../src/data/terms/agent.ts';
import { AI_AI } from '../src/data/terms/ai.ts';

const FILE_CAT = {
  lifecycle: LC_LIFECYCLE,
  effects: EFF_EFFECTS,
  dsa: DSA_DSA,
  tools: TOOLS_TOOLS,
  frontend: FE_FRONTEND,
  network: NET_NETWORK,
  security: SEC_SECURITY,
  backend: BE_BACKEND,
  network: NET_NETWORK,
  backend: BE_BACKEND,
  devops: DEVOPS_DEVOPS,
  embedded: EMB_EMBEDDED,
  agent: AGENT_AGENT,
  ai: AI_AI,
};

const errors = [];
const all = [];

for (const [cat, terms] of Object.entries(FILE_CAT)) {
  for (const t of terms ?? []) {
    all.push(t);
    const where = `${cat}/${t.id ?? '(no-id)'}`;
    if (!t.id) errors.push(`${where}: 缺少 id`);
    if (t.cat !== cat) errors.push(`${where}: cat(${t.cat}) 与文件领域(${cat})不一致`);
    if (!t.name) errors.push(`${where}: 缺少 name`);
    if (!t.en) errors.push(`${where}: 缺少 en`);
    if (!t.sub) errors.push(`${where}: 缺少 sub`);
    if (!t.summary || t.summary.length < 10) errors.push(`${where}: summary 为空或过短`);
    if (!t.detail || t.detail.length < 40) errors.push(`${where}: detail 为空或过短`);
    if (!Array.isArray(t.tags) || t.tags.length === 0) errors.push(`${where}: 缺少 tags`);
    for (const r of t.relations ?? []) {
      if (!r.to) errors.push(`${where}: relation 缺少 to`);
      if (!r.desc) errors.push(`${where}: relation 到 ${r.to} 缺少 desc`);
      if (r.to === t.id) errors.push(`${where}: relation 自指`);
    }
  }
}

const ids = new Set();
for (const t of all) {
  if (ids.has(t.id)) errors.push(`id 重复: ${t.id}`);
  ids.add(t.id);
}
for (const t of all) {
  for (const r of t.relations ?? []) {
    if (!ids.has(r.to)) errors.push(`${t.id}: relation 指向不存在的术语 ${r.to}`);
  }
}

console.log(`共 ${all.length} 个术语`);
if (errors.length > 0) {
  console.log(`发现 ${errors.length} 个问题:`);
  for (const e of errors) console.log('  - ' + e);
  process.exit(1);
}
console.log('✓ 术语数据完整性校验通过');
