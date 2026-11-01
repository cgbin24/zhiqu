import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: true });

/** 渲染关卡讲解 / 任务 Markdown（内容均为本地编写，非用户输入） */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
