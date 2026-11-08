/**
 * 知识库工程课判题模拟器 —— 在纯内存中模拟一个确定性的 PARA 知识库。
 *
 * 方法论：PARA（Projects 项目 / Areas 领域 / Resources 资源 / Archives 归档）
 * + Docs-as-Code（Markdown + front-matter + 双链）—— 业内主流个人/团队知识库实践。
 *
 * 脚本：每行一条命令（# 注释、空行跳过）。输出逐行拼接，与关卡 expected 逐字符比对。
 * 所有排序按创建序号（seq）—— 同一脚本永远得到同一输出。
 *
 * 支持的命令（levels 只允许使用这些）：
 *   kb init
 *   kb new <分区>/<slug> --title "标题" [--tags "标签1,标签2"]
 *   kb tree
 *   kb list
 *   kb search <关键词>
 *   kb tag <slug> <标签>          （为已有文档追加标签）
 *   kb link <slugA> <slugB>       （建立双向链接）
 *   kb backlinks <slug>
 *   kb move <slug> <新分区>
 *   kb archive <slug>
 *   kb tags
 *   kb stats
 *
 * 分区（PARA 固定五区，不可增删）：
 *   00-inbox  10-projects  20-areas  30-resources  40-archive
 */

/* ---------------- 状态 ---------------- */

export const KB_SECTIONS = ['00-inbox', '10-projects', '20-areas', '30-resources', '40-archive'] as const;

interface KbDoc {
  slug: string;
  section: string;
  title: string;
  tags: string[];
  links: string[];
  content: string;
  seq: number;
}

interface KbState {
  initialized: boolean;
  docs: Map<string, KbDoc>;
  seq: number;
}

function emptyState(): KbState {
  return { initialized: false, docs: new Map(), seq: 0 };
}

/* ---------------- 命令解析 ---------------- */

function sectionOf(path: string): string | null {
  return KB_SECTIONS.find((sec) => path === sec || path.startsWith(sec + '/')) ?? null;
}

function slugOf(path: string): string {
  const i = path.lastIndexOf('/');
  return i === -1 ? path : path.slice(i + 1);
}

function fmtDoc(d: KbDoc): string {
  const tags = d.tags.length ? ' #' + d.tags.join(' #') : '';
  return `[${d.section}/${d.slug}] ${d.title}${tags}`;
}

/* ---------------- 执行 ---------------- */

function execLine(s: KbState, raw: string, out: string[]): void {
  const line = raw.trim();
  if (!line || line.startsWith('#')) return;

  // 工作区文件写入（同 git 课风格）：echo "内容" > 分区/slug.md
  const echoM = line.match(/^echo\s+"([^"]*)"\s*>\s*(\S+)\.md$/);
  if (echoM) {
    const [, content, path] = echoM;
    if (!s.initialized) { out.push('kb：请先执行 kb init'); return; }
    const sec = sectionOf(path);
    if (!sec) { out.push(`kb：路径需位于 PARA 分区内（${KB_SECTIONS.join(' / ')}）`); return; }
    const slug = slugOf(path);
    const doc = s.docs.get(slug);
    if (doc) doc.content = content;
    else out.push(`kb：未知笔记 '${slug}'（用 kb new 创建）`);
    return;
  }

  if (!line.startsWith('kb ')) { out.push(`未知命令：${line}`); return; }
  const argv = line.slice(3).trim().split(/\s+/).filter(Boolean);
  const cmd = argv[0];
  const rest = argv.slice(1);

  switch (cmd) {
    case 'init': {
      if (s.initialized) { out.push('重新初始化知识库（结构已存在）'); return; }
      s.initialized = true;
      out.push('知识库初始化完成（PARA 结构）：');
      for (const sec of KB_SECTIONS) out.push(`  ${sec}/`);
      return;
    }
    case 'new': {
      if (!s.initialized) { out.push('kb：请先执行 kb init'); return; }
      const path = rest[0];
      // 标题/标签从原始行提取（支持含空格的多词标题）
      const titleM = line.match(/--title\s+"([^"]*)"/);
      const tagsM = line.match(/--tags\s+"([^"]*)"/);
      const title = titleM?.[1]?.trim() ?? '';
      if (!path || !title) { out.push('错误：用法 kb new <分区>/<slug> --title "标题"'); return; }
      const sec = sectionOf(path);
      if (!sec) { out.push(`kb：路径需位于 PARA 分区内`); return; }
      const slug = slugOf(path);
      if (s.docs.has(slug)) { out.push(`kb：笔记 '${slug}' 已存在`); return; }
      const tags = (tagsM?.[1] ?? '').split(',').map((t) => t.trim()).filter(Boolean);
      s.seq++;
      s.docs.set(slug, { slug, section: sec, title, tags, links: [], content: '', seq: s.seq });
      out.push(`已创建 [${sec}/${slug}] ${title}${tags.length ? ' #' + tags.join(' #') : ''}`);
      return;
    }
    case 'tree': {
      if (!s.initialized) { out.push('kb：请先执行 kb init'); return; }
      for (const sec of KB_SECTIONS) {
        const docs = [...s.docs.values()].filter((d) => d.section === sec);
        out.push(`${sec}/ (${docs.length})`);
        for (const d of docs) out.push(`  ${d.slug}.md`);
      }
      return;
    }
    case 'list': {
      if (!s.initialized) { out.push('kb：请先执行 kb init'); return; }
      const docs = [...s.docs.values()].sort((a, b) => a.seq - b.seq);
      if (!docs.length) { out.push('知识库为空'); return; }
      docs.forEach((d) => out.push(fmtDoc(d)));
      return;
    }
    case 'search': {
      if (!s.initialized) { out.push('kb：请先执行 kb init'); return; }
      const kw = rest.join(' ').toLowerCase();
      if (!kw) { out.push('错误：请提供搜索关键词'); return; }
      const hits = [...s.docs.values()]
        .sort((a, b) => a.seq - b.seq)
        .filter((d) => d.title.toLowerCase().includes(kw) || d.content.toLowerCase().includes(kw) || d.tags.some((t) => t.toLowerCase().includes(kw)));
      if (!hits.length) { out.push(`未找到与 '${rest.join(' ')}' 相关的笔记`); return; }
      out.push(`找到 ${hits.length} 条：`);
      hits.forEach((d) => out.push(fmtDoc(d)));
      return;
    }
    case 'tag': {
      const slug = rest[0];
      const tag = rest[1];
      const doc = slug ? s.docs.get(slug) : undefined;
      if (!doc) { out.push(`kb：未知笔记 '${slug ?? ''}'`); return; }
      if (!tag) { out.push('错误：请提供标签名'); return; }
      if (doc.tags.includes(tag)) { out.push(`标签 '${tag}' 已存在`); return; }
      doc.tags.push(tag);
      out.push(`已为 [${doc.section}/${doc.slug}] 追加标签 #${tag}`);
      return;
    }
    case 'link': {
      const a = rest[0];
      const b = rest[1];
      const da = a ? s.docs.get(a) : undefined;
      const db = b ? s.docs.get(b) : undefined;
      if (!da || !db) { out.push('kb：双方笔记都必须已存在'); return; }
      if (a === b) { out.push('kb：不能链接自身'); return; }
      if (da.links.includes(b)) { out.push('链接已存在'); return; }
      da.links.push(b);
      db.links.push(a);
      out.push(`已链接 ${da.title} ↔ ${db.title}`);
      return;
    }
    case 'backlinks': {
      const slug = rest[0];
      const target = slug ? s.docs.get(slug) : undefined;
      if (!target) { out.push(`kb：未知笔记 '${slug ?? ''}'`); return; }
      const referrers = [...s.docs.values()].filter((d) => d.slug !== slug && d.links.includes(slug));
      if (!referrers.length) { out.push(`'${target.title}' 暂无反向链接`); return; }
      out.push(`'${target.title}' 的反向链接（${referrers.length}）：`);
      referrers.forEach((d) => out.push(`  [${d.section}/${d.slug}] ${d.title}`));
      return;
    }
    case 'move': {
      const slug = rest[0];
      const to = rest[1];
      const doc = slug ? s.docs.get(slug) : undefined;
      if (!doc) { out.push(`kb：未知笔记 '${slug ?? ''}'`); return; }
      if (!to || !KB_SECTIONS.includes(to as (typeof KB_SECTIONS)[number])) { out.push(`kb：目标分区无效`); return; }
      if (doc.section === to) { out.push(`已在 ${to} 分区`); return; }
      const from = doc.section;
      doc.section = to;
      out.push(`已移动：${doc.title}（${from} → ${to}）`);
      return;
    }
    case 'archive': {
      const slug = rest[0];
      const doc = slug ? s.docs.get(slug) : undefined;
      if (!doc) { out.push(`kb：未知笔记 '${slug ?? ''}'`); return; }
      if (doc.section === '40-archive') { out.push('已在归档区'); return; }
      const from = doc.section;
      doc.section = '40-archive';
      out.push(`已归档：${doc.title}（${from} → 40-archive）`);
      return;
    }
    case 'tags': {
      if (!s.initialized) { out.push('kb：请先执行 kb init'); return; }
      const counts = new Map<string, number>();
      for (const d of s.docs.values()) for (const t of d.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
      const list = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      if (!list.length) { out.push('还没有任何标签'); return; }
      list.forEach(([t, c]) => out.push(`#${t} (${c})`));
      return;
    }
    case 'stats': {
      if (!s.initialized) { out.push('kb：请先执行 kb init'); return; }
      const docs = [...s.docs.values()];
      out.push(`笔记总数：${docs.length}`);
      for (const sec of KB_SECTIONS) {
        const c = docs.filter((d) => d.section === sec).length;
        out.push(`  ${sec}: ${c}`);
      }
      const links = docs.reduce((acc, d) => acc + d.links.length, 0) / 2;
      out.push(`双向链接：${links} 对`);
      return;
    }
    default:
      out.push(`kb: '${cmd}' 不是一个 kb 命令`);
  }
}

/** 执行一段 kb 脚本，返回全部输出（\n 连接） */
export function runKbScript(script: string, initJson: string | undefined): string {
  const s = emptyState();
  if (initJson) {
    try {
      const cfg = JSON.parse(initJson) as { preinit?: boolean };
      if (cfg.preinit) { s.initialized = true; }
    } catch {
      /* 忽略初始状态解析失败 */
    }
  }
  const out: string[] = [];
  for (const line of script.replace(/\r\n?/g, '\n').split('\n')) {
    execLine(s, line.trim(), out);
  }
  return out.join('\n');
}
