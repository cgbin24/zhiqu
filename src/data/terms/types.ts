/** 术语百科类型定义 */

export type TermCatId = 'lifecycle' | 'frontend' | 'effects' | 'backend' | 'embedded' | 'devops' | 'network' | 'security' | 'dsa' | 'tools' | 'agent' | 'ai';

/** 页面效果实时演示种类（组件：EffectDemo） */
export type EffectDemoKind =
  | 'masonry' | 'parallax' | 'scroll-reveal' | 'horizontal-scroll' | 'sticky-header'
  | 'scroll-progress' | 'infinite-scroll' | 'skeleton' | 'preloader' | 'page-transition'
  | 'typewriter' | 'text-reveal' | 'count-up' | 'tilt' | 'magnetic' | 'ripple'
  | 'glassmorphism' | 'neumorphism' | 'gradient-animate' | 'neon-glow' | 'custom-cursor'
  | 'card-flip' | 'coverflow' | 'marquee' | 'lightbox' | 'before-after' | 'accordion'
  | 'magic-line' | 'bottom-sheet' | 'progress-ring' | 'bento' | 'timeline'
  /* 高交互 / 变化莫测（沉浸动效） */
  | 'cursor-trail' | 'spotlight' | 'glitch' | 'matrix-rain' | 'blob-morph' | 'scroll-skew'
  | 'svg-draw' | 'flip-grid' | 'cube-3d' | 'aurora' | 'mouse-parallax' | 'scramble-letters'
  | 'starfield' | 'neon-border' | 'text-stroke' | 'elastic-drag'
  | 'dijkstra';

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
  /** 页面效果实时演示（effects 领域使用，组件：EffectDemo） */
  demo?: { kind: EffectDemoKind; param?: string };
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
