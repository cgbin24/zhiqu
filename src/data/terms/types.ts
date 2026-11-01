/** 术语百科类型定义 */

export type TermCatId = 'lifecycle' | 'frontend' | 'backend' | 'embedded' | 'devops' | 'network' | 'agent' | 'ai';

/** 术语间关系：to 为另一术语 id，desc 描述两者联系 */
export interface TermRelation {
  to: string;
  desc: string;
}

export interface Term {
  /** 全局唯一 id，如 fe-dom / be-rpc / net-tcp */
  id: string;
  name: string;
  en: string;
  cat: TermCatId;
  /** 子分类，如 页面结构 / 服务治理 */
  sub: string;
  tags: string[];
  /** 一句话摘要（列表展示 + 测验题干） */
  summary: string;
  /** 详细讲解（Markdown：是什么 / 为什么重要 / 与其他概念的关系） */
  detail: string;
  relations?: TermRelation[];
  /** 可选代码/配置示例 */
  example?: string;
  exampleLang?: string;
  /** 可选面试/实践要点 */
  interview?: string;
}

export interface TermCategoryDef {
  id: TermCatId;
  name: string;
  en: string;
  icon: string;
  color: string;
  gradient: string;
  /** 领域概览与术语关系总览（Markdown） */
  intro: string;
}
