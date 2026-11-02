import type { Term } from './types';

/**
 * effects 领域术语（60 条）：布局类效果 / 滚动叙事 / 加载与转场 / 文字动效 /
 * 微交互 / 视觉风格 / 媒体展示 / 内容组织 / 进阶与库选型。
 * 多数术语带 EffectDemo 实时演示（kind 见 components/EffectDemo.tsx）。
 */
export const EFF_EFFECTS: Term[] = [
  // ==================== 布局类效果 ====================
  {
    id: 'eff-masonry',
    name: '瀑布流 Masonry',
    en: 'Masonry Layout',
    cat: 'effects',
    sub: '布局类效果',
    tags: ['布局', 'CSS', '图片流'],
    summary: '瀑布流把不等高的卡片排成多列、各自贴向最矮列堆叠，形成 Pinterest 式错落有致的版面。',
    detail: `**效果描述**：不同高度的卡片按列排布，新卡片总是落到当前最矮列的下方，整面墙参差错落又严丝合缝——玩上方演示，感受高矮卡片自动补位的效果。

**实现原理**：纯 CSS 路线用 \`columns\` 把容器分成多列、\`break-inside: avoid\` 禁止卡片被拦腰截断；JS 路线则逐卡测量高度，把每张卡绝对定位到当前最矮列的底部（详见"两种实现路线"词条）。

**适用场景与代表网站**：图片墙、电商商品流、博客摘要列表；Pinterest 是开山鼻祖，小红书、站酷的图片流都是它的变体。

**生产建议**：图片场景必须等图片加载完成或已知宽高比后再布局，否则列高会跳变；列数用 \`columns: 3 240px\` 随宽度自适应；数据量大时配合虚拟滚动控制节点数量。`,
    relations: [
      { to: 'eff-masonry-columns-vs-js', desc: '本词条是瀑布流效果本身，两条实现路线的取舍见姊妹词条' },
      { to: 'eff-gallery-masonry-hover', desc: '瀑布流画廊常配悬停信息遮罩展示标题与作者' },
      { to: 'fe-grid', desc: 'Grid 擅长规整网格，瀑布流的不等高错落需要 columns 或 JS 介入' },
    ],
    example: `/* 路线一：CSS 多列瀑布流（零 JS 依赖） */
.masonry {
  columns: 3 240px;      /* 3 列，每列最小 240px，自动增减 */
  column-gap: 16px;
}
.masonry .card {
  break-inside: avoid;   /* 关键：禁止卡片跨列截断 */
  margin-bottom: 16px;
}
/* 浏览器按"列"自上而下填充，
   高矮卡片自然交错成瀑布流 */
`,
    exampleLang: 'css',
    demo: { kind: 'masonry' },
  },
  {
    id: 'eff-bento',
    name: 'Bento 网格',
    en: 'Bento Grid',
    cat: 'effects',
    sub: '布局类效果',
    tags: ['布局', '网格', '仪表盘'],
    summary: 'Bento 网格用大小不一的圆角块拼出便当盒式版面，重要内容占大格、次要信息收进小格。',
    detail: `**效果描述**：像日式便当盒一样，页面被划成大小不等的圆角格子：核心功能占双倍大格，统计数字、快捷入口各居一格，信息密度高却井然有序——上方演示正是 2×1 大块与 1×1 小格的混排。

**实现原理**：CSS Grid 是唯一正解：\`grid-template-columns\` 定列轨，子项用 \`grid-column: span 2\` 跨列、\`grid-row: span 2\` 跨行，\`gap\` 统一留缝。

**适用场景与代表网站**：产品首页功能矩阵、个人主页、数据看板；Apple 官网产品区与 Bento.me 把它带成潮流。

**生产建议**：格子控制在 4~8 个，最大格放视觉主角；移动端退化为单列堆叠即可；格内留白要慷慨，塞太满会毁掉呼吸感。`,
    relations: [
      { to: 'fe-grid', desc: 'span 跨行跨列正是 CSS Grid 的核心能力' },
      { to: 'eff-masonry', desc: '同属多块版面家族：Bento 有序可设计，瀑布流随数据自然生长' },
      { to: 'eff-expansion-card', desc: 'Bento 大格常承载可点击展开详情的卡片' },
    ],
    example: `.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.bento .hero { grid-column: span 2; grid-row: span 2; } /* 2×2 主角 */
.bento .wide { grid-column: span 2; }                   /* 2×1 宽块 */
.bento .cell { /* 1×1 默认占一格 */ }

/* 移动端退化为单列 */
@media (max-width: 640px) {
  .bento { grid-template-columns: 1fr; }
  .bento .hero, .bento .wide { grid-column: auto; grid-row: auto; }
}
`,
    exampleLang: 'css',
    demo: { kind: 'bento' },
  },
  {
    id: 'eff-horizontal-scroll',
    name: '横向滚动',
    en: 'Horizontal Scroll',
    cat: 'effects',
    sub: '布局类效果',
    tags: ['布局', '滚动', '交互'],
    summary: '横向滚动让内容沿水平轴滑动画廊或分幕，配合滚动吸附形成"翻页"手感，横向叙事页常用。',
    detail: `**效果描述**：鼠标滚轮或触摸左右滑动，一屏一幕水平推进；上方演示中每一幕到达边界会被磁性吸住对齐，松手不散。

**实现原理**：容器 \`overflow-x: auto\` 承载横向溢出，子项 \`flex-shrink: 0\` 防压缩；配 \`scroll-snap-type: x mandatory\` 与 \`scroll-snap-align: center\` 获得逐幕吸附；\`scrollbar-width: none\` 隐藏滚动条更沉浸。

**适用场景与代表网站**：横向叙事官网、剧集/商品横向货架、作品集分幕；Apple 产品页的横向特性区是经典案例。

**生产建议**：把纵向滚轮映射到横向会劫持习惯，务必提供拖动提示与前后按钮；移动端原生手势体验最好；重要链接别只藏在横向区，不利 SEO。`,
    relations: [
      { to: 'eff-scroll-snap', desc: '吸附让横向滚动产生逐幕对齐的翻页手感' },
      { to: 'eff-carousel', desc: '横向货架与轮播是近亲：一个用户自由滚，一个按页切' },
      { to: 'eff-marquee', desc: '走马灯是自动匀速版的横向滚动' },
    ],
    example: `.hscroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;            /* 横向滚动容器 */
  scroll-snap-type: x mandatory; /* 逐幕吸附 */
  scrollbar-width: none;       /* 隐藏滚动条 */
}
.hscroll > * {
  flex-shrink: 0;              /* 子项不被压缩 */
  scroll-snap-align: center;   /* 吸附到幕中心 */
  width: 80vw;                 /* 每幕约一屏宽 */
}
`,
    exampleLang: 'css',
    demo: { kind: 'horizontal-scroll' },
  },
  {
    id: 'eff-sticky',
    name: 'Sticky 吸附',
    en: 'Sticky Positioning',
    cat: 'effects',
    sub: '布局类效果',
    tags: ['布局', 'CSS', '导航'],
    summary: 'Sticky 吸附让元素随文档滚动、到达阈值后钉在视口一侧，吸顶表头、侧边目录全靠它。',
    detail: `**效果描述**：元素像普通内容一样随页面上滚，顶边碰到 \`top\` 指定的位置就"钉"住不动，直到父容器滚出视口——上方演示中表头吸住顶部，内容行从它下方穿行。

**实现原理**：一行 \`position: sticky; top: 0\` 即可。它相对**最近的滚动祖先**吸附，范围被父元素框住；比 \`fixed\` 优雅在不脱离文档流、无需 JS 计算偏移。

**适用场景与代表网站**：吸顶导航、长表格表头、文档站右侧目录（MDN、各大组件库文档）、通讯录字母索引条。

**生产建议**：任何祖先设 \`overflow: hidden/auto\` 都会让 sticky 失效，是最高频踩坑点；配合理 \`z-index\` 与不透明背景防内容穿透；吸顶导航要配合 \`scroll-margin-top\` 补偿锚点。`,
    relations: [
      { to: 'eff-scroll-progress', desc: '阅读进度条轨道常做成 sticky 常驻顶部' },
      { to: 'eff-anchor-scroll', desc: '吸顶导航会遮挡锚点目标，需要 scroll-margin-top 补偿' },
      { to: 'eff-scroll-telling', desc: 'sticky 钉住分幕是滚动叙事的常用骨架' },
    ],
    example: `/* 吸顶表头：滚动时钉在容器顶部 */
.table-head {
  position: sticky;
  top: 0;                     /* 距顶 0 时吸附 */
  z-index: 10;
  background: var(--bg);      /* 不透明背景防穿透 */
  backdrop-filter: blur(8px); /* 或毛玻璃质感 */
}

/* 坑：任何祖先 overflow: hidden/auto
   都会让 sticky 失效，先查祖先再查属性 */
`,
    exampleLang: 'css',
    demo: { kind: 'sticky-header' },
  },
  {
    id: 'eff-split-screen',
    name: '分屏布局',
    en: 'Split Screen Layout',
    cat: 'effects',
    sub: '布局类效果',
    tags: ['布局', '双栏', '落地页'],
    summary: '分屏布局把视口切成两半，两侧内容独立滚动或交互，常用于对比展示与左图右文落地页。',
    detail: `**效果描述**：左文右图、左旧右新，两个世界共用一块视口；两侧可以各自滚动，也可以固定一侧只滚另一侧，视线在对比中自然移动。

**实现原理**：最简做法是 Flex 两等分：\`flex: 1\` + \`height: 100vh\`，各自 \`overflow-y: auto\` 独立滚动；需要比例可拖拽时，监听分隔条 \`mousemove\` 改写 \`flex-basis\`，拖动中 \`user-select: none\`。

**适用场景与代表网站**：产品落地页左介绍右演示、新旧版本对比、双语对照阅读；许多作品集用"左固定头像、右滚动内容"的结构。

**生产建议**：移动端直接退化为上下堆叠；固定侧内容过高时给内部滚动；拖拽分隔条要处理鼠标移出窗口与释放解绑，避免"拖不放手"。`,
    relations: [
      { to: 'eff-before-after', desc: '叠加裁切式前后对比是分屏的特化变体' },
      { to: 'fe-flexbox', desc: '等分与比例分配由 Flex 布局完成' },
      { to: 'eff-fullpage-scroll', desc: '分屏落地页常与全屏逐屏切换组合使用' },
    ],
    example: `.split {
  display: flex;
  height: 100vh;        /* 占满视口 */
}
.split .pane {
  flex: 1;              /* 各占一半 */
  overflow-y: auto;     /* 两侧独立滚动 */
  padding: 48px;
}
/* 需要拖拽比例时，用 JS 改写
   .pane { flex-basis: 62%; } */
`,
    exampleLang: 'css',
  },
  {
    id: 'eff-scroll-snap',
    name: '滚动吸附',
    en: 'Scroll Snap',
    cat: 'effects',
    sub: '布局类效果',
    tags: ['CSS', '滚动', '轮播'],
    summary: '滚动吸附用 scroll-snap 让滚动停在预设锚点附近时自动对齐，产生翻页般的确定手感。',
    detail: `**效果描述**：滚动接近某一屏时松手，内容不会停在半路，而是被"磁铁"吸到整屏边界——上方横向演示里可以体会这种吸附回弹。

**实现原理**：容器声明 \`scroll-snap-type: y mandatory\`（或 x），子项声明 \`scroll-snap-align: start/center\`；\`mandatory\` 强制必吸附，\`proximity\` 靠近才吸；\`scroll-padding\` 为吸顶导航预留偏移。

**适用场景与代表网站**：全屏幻灯式官网、移动端图片浏览器、iOS 风格选择滚轮、横向货架。

**生产建议**：\`mandatory\` 在单幕内容高于视口时会"看不全"，长内容改用 \`proximity\`；它是零依赖纯 CSS 方案，可替代 fullpage.js 这类劫持；重点测试触控板与移动端吸附。`,
    relations: [
      { to: 'eff-horizontal-scroll', desc: '横向吸附的纵向孪生兄弟' },
      { to: 'eff-fullpage-scroll', desc: 'snap 是 CSS 原生替代全屏滚动劫持的方案' },
      { to: 'eff-carousel', desc: '许多轮播的底层就是 snap 滚动' },
    ],
    example: `.snapper {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory; /* 纵向强制吸附 */
  scroll-padding-top: 64px;      /* 给吸顶导航留位 */
}
.snapper section {
  height: 100vh;                 /* 每幕一屏 */
  scroll-snap-align: start;      /* 对齐幕首 */
}
`,
    exampleLang: 'css',
    demo: { kind: 'horizontal-scroll' },
  },
  {
    id: 'eff-masonry-columns-vs-js',
    name: '瀑布流两种实现路线：CSS columns vs JS 绝对定位',
    en: 'Masonry: CSS Columns vs JS Positioning',
    cat: 'effects',
    sub: '布局类效果',
    tags: ['布局', '方案对比', '性能'],
    summary: '瀑布流有两条路线：CSS columns 零依赖但按列排序，JS 绝对定位顺序正确且支持动态插入。',
    detail: `**效果描述**：两种路线拼出的卡片墙肉眼几乎一致，但"新卡片插到哪""阅读顺序是什么"完全不同，列填充方向的差异可到瀑布流词条的演示里观察。

**实现原理**：**CSS columns** 用 \`columns + break-inside: avoid\`，浏览器自动分列，零 JS；缺点是按"先填满第 1 列再第 2 列"填充，与期望的"从左到右逐行"不符，动态插入会整列重排。**JS 路线**逐卡测量、放入最矮列，绝对定位摆放，顺序可控、可增量插入。

**适用场景与代表网站**：静态内容、顺序不敏感用 columns；Pinterest 类信息流必须走 JS 路线。

**生产建议**：React 生态选 react-masonry-css 或自写最短列算法；图片流先拿宽高比占位再布局，避免列高抖动；增量插入只动受影响列。`,
    relations: [
      { to: 'eff-masonry', desc: '本词条是瀑布流效果的实现路线深入对比' },
      { to: 'fe-reflow-refrepaint', desc: 'JS 路线的重排成本与 transform 优化直接相关' },
      { to: 'eff-performance-budget', desc: '动态插入时应避免全量重排，守住帧率预算' },
    ],
    example: `// 路线二：JS 最短列算法（顺序正确，可增量插入）
function layout(items, cols, colWidth, gap) {
  const heights = new Array(cols).fill(0); // 各列当前高度
  return items.map((item) => {
    const col = heights.indexOf(Math.min(...heights));
    const x = col * (colWidth + gap);      // 横向位置
    const y = heights[col];                // 纵向位置
    heights[col] += item.height + gap;     // 累计列高
    return { item, x, y };                 // 输出摆放坐标
  });
}
// 渲染：position: absolute + translate3d(x, y, 0)
`,
    exampleLang: 'js',
  },

  // ==================== 滚动叙事 ====================
  {
    id: 'eff-parallax',
    name: '视差滚动',
    en: 'Parallax Scrolling',
    cat: 'effects',
    sub: '滚动叙事',
    tags: ['滚动', '动画', '官网'],
    summary: '视差滚动让背景与前景以不同速率位移，制造肉眼可见的纵深层次，官网首屏的经典手法。',
    detail: `**效果描述**：滚动时远处的山移动得慢、近处的树移动得快，页面像多层玻璃板相对滑动——上方演示中背景层以 0.5 倍速跟随。

**实现原理**：scroll 监听配 rAF 节流，对每层套不同系数做 \`transform: translateY(scrollY * k)\`；现代零 JS 方案用 \`animation-timeline: scroll()\`；\`perspective + translateZ\` 还能做真 3D 视差。

**适用场景与代表网站**：官网 Hero 区、游戏化叙事页；Apple 官网产品分层展示与 Awwwards 获奖站的核心配方。

**生产建议**：只用 transform 合成层动画，绝不动 top/margin；层数 2~3 层；移动端慎用；\`prefers-reduced-motion\` 提供静态降级。`,
    relations: [
      { to: 'eff-scroll-driven', desc: 'CSS 滚动驱动动画是视差的零 JS 现代实现' },
      { to: 'eff-gsap', desc: 'ScrollTrigger 是生产视差的事实标准库' },
      { to: 'eff-scroll-telling', desc: '视差是滚动叙事的第一视觉语言' },
    ],
    example: `// 前景 1 倍速，背景 0.5 倍速 = 视差
const bg = document.querySelector('.parallax-bg');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {       // 一帧最多算一次
    const y = window.scrollY;
    bg.style.transform = 'translateY(' + y * 0.5 + 'px)';
    ticking = false;
  });
}, { passive: true });                // 滚动监听必加 passive
`,
    exampleLang: 'js',
    demo: { kind: 'parallax' },
  },
  {
    id: 'eff-scroll-reveal',
    name: '滚动显现 Reveal',
    en: 'Scroll Reveal',
    cat: 'effects',
    sub: '滚动叙事',
    tags: ['滚动', '动画', 'IntersectionObserver'],
    summary: '滚动显现让元素进入视口才播放淡入上移等出场动画，滚到哪亮到哪，内容页最常用的节奏感来源。',
    detail: `**效果描述**：滚到哪儿哪儿"亮起来"：淡入、上浮、左滑依次登场——上方演示框内滚动可见卡片成批点亮。

**实现原理**：核心是 **IntersectionObserver** 观察与视口交叉，进入加 class，CSS transition 播动画；framer-motion 的 \`whileInView\`、AOS 库都是这层封装。

**适用场景与代表网站**：博客文章卡片、落地页特性区、团队成员墙；Stripe、Linear 等 SaaS 官网标配。

**生产建议**：时长 0.4~0.6s、位移 16~30px 最舒适；同屏多元素用 50~80ms 阶梯 delay；\`prefers-reduced-motion\` 时直接显示；隐藏期用 opacity+transform 而非 display:none。`,
    relations: [
      { to: 'eff-text-reveal', desc: '把 reveal 粒度细化到逐字的变体' },
      { to: 'fe-lazy-loading', desc: '同一 IntersectionObserver 思想：懒加载管资源，reveal 管动画' },
      { to: 'eff-scroll-driven', desc: '驱动信号相同，但 reveal 是一次性触发、scroll-driven 连续映射' },
    ],
    example: `const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);   // 只播放一次
    }
  }
}, { threshold: 0.2 });         // 露出 20% 即触发
document.querySelectorAll('.reveal')
  .forEach((el) => io.observe(el));

/* 配套 CSS：
.reveal { opacity: 0; transform: translateY(24px);
  transition: opacity .5s ease, transform .5s ease; }
.reveal.is-visible { opacity: 1; transform: none; } */
`,
    exampleLang: 'js',
    demo: { kind: 'scroll-reveal' },
  },
  {
    id: 'eff-scroll-driven',
    name: '滚动驱动动画',
    en: 'Scroll-Driven Animations',
    cat: 'effects',
    sub: '滚动叙事',
    tags: ['CSS', '滚动', '新特性'],
    summary: '滚动驱动动画把动画进度直接映射到滚动位置，滚动条就是时间轴，倒滚动画也随之倒放。',
    detail: `**效果描述**：不是"滚到才播一次"，而是动画与滚动逐帧绑定：滚 10% 播 10%，回滚就倒放——进度条、图片随滚动放大都是连续映射。

**实现原理**：最新 CSS 方案：\`animation-timeline: scroll()\` 映射整页滚动，\`view()\` 映射元素进出视口，配 \`animation-range\` 控制区间，零 JS；JS 方案以 GSAP ScrollTrigger 的 \`scrub: true\` 为代表。

**适用场景与代表网站**：Apple 产品页（iPhone 旋转展示）、进度条、Scrollytelling 数据新闻。

**生产建议**：Safari/Firefox 尚未完全支持，生产建议 GSAP 打底、CSS 渐进增强；连续映射必须用 \`scrub\`；动画只限 transform/opacity。`,
    relations: [
      { to: 'eff-parallax', desc: '视差是 scroll-driven 最经典的应用形态' },
      { to: 'eff-scroll-progress', desc: '阅读进度条是 scroll-driven 的最小案例' },
      { to: 'eff-gsap', desc: 'ScrollTrigger 的 scrub 模式提供全兼容实现' },
    ],
    example: `/* 滚动驱动：零 JS，滚动条即时间轴 */
@keyframes grow { from { width: 0 } to { width: 100% } }

.progress-bar {
  position: fixed; top: 0; left: 0;
  height: 3px; background: gold;
  animation: grow linear both;
  animation-timeline: scroll();  /* 绑定整页滚动 */
}

@keyframes pop { from { scale: .6 } to { scale: 1 } }
.card {
  animation: pop linear both;
  animation-timeline: view();    /* 元素进出视口 */
  animation-range: entry 0% cover 40%;
}
`,
    exampleLang: 'css',
  },
  {
    id: 'eff-fullpage-scroll',
    name: '全屏滚动劫持',
    en: 'Fullpage Scroll Hijacking',
    cat: 'effects',
    sub: '滚动叙事',
    tags: ['滚动', '交互', 'fullPage.js'],
    summary: '全屏滚动劫持拦截滚轮与触摸，一次手势切换一整屏并缓动对齐，形成逐屏演示的翻页感。',
    detail: `**效果描述**：滚一下就"啪"地翻到下一整屏，页面没有中间态，像 PPT 翻页——每屏一个主题，纵向推进，节奏完全由页面掌控。

**实现原理**：监听 \`wheel\`/touchmove/键盘事件并 \`preventDefault\`，节流防连滚；切换时对容器做 \`translateY(-index * 100vh)\` 缓动；纯 CSS 的 scroll-snap \`mandatory\` 可近似，但无法完全锁定中间态。

**适用场景与代表网站**：产品发布会页、作品集、品牌活动页；fullPage.js 是代表库，无数创意站采用。

**生产建议**：劫持滚动牺牲用户预期，务必提供圆点导航与可见滚动提示；长内容屏允许内部滚动；移动端建议换 snap 方案；提供 reduced-motion 降级与键盘路径。`,
    relations: [
      { to: 'eff-scroll-snap', desc: 'CSS 原生 snap 是无 JS 的温和替代方案' },
      { to: 'eff-smooth-scroll', desc: '两者都接管滚动手感，缓动配调相通' },
      { to: 'eff-scroll-telling', desc: '全屏劫持常被用作逐幕讲故事的极端形态' },
    ],
    example: `let index = 0, locked = false;
const total = document.querySelectorAll('.fp').length;
window.addEventListener('wheel', (e) => {
  if (locked) return;
  locked = true;                  // 节流：一次手势切一屏
  index = Math.min(total - 1, Math.max(0,
    index + (e.deltaY > 0 ? 1 : -1)));
  document.querySelector('.fp-wrap').style.transform =
    'translateY(-' + index * 100 + 'vh)';
  setTimeout(() => (locked = false), 800); // 缓动期间锁住
}, { passive: false });           // 需要 preventDefault 时不加 passive
`,
    exampleLang: 'js',
  },
  {
    id: 'eff-infinite-scroll',
    name: '无限滚动',
    en: 'Infinite Scroll',
    cat: 'effects',
    sub: '滚动叙事',
    tags: ['滚动', '数据加载', '信息流'],
    summary: '无限滚动在列表接近底部时自动加载下一页，滚动不停内容不断，是信息流产品的标配。',
    detail: `**效果描述**：列表底部没有"下一页"按钮，滚到接近末尾时自动追加新内容——上方演示里触底会先出现"加载中…"再插入三条新项。

**实现原理**：在列表末尾放一个哨兵元素，用 **IntersectionObserver** 监听它进入视口即触发加载；加载完成后哨兵被推远，形成"触底→加载→再触底"的循环；也可在 scroll 事件里算距离阈值。

**适用场景与代表网站**：微博、小红书、抖音网页版等 Feed 流，配合游标（cursor）分页 API。

**生产建议**：必须有兜底——显示"没有更多了"、失败可重试；前进/后退配合内容缓存恢复滚动位置；节点无限增长会拖垮渲染，长列表上虚拟滚动（react-window）；重 SEO 场景保留分页。`,
    relations: [
      { to: 'fe-debounce-throttle', desc: '触底判定与滚动事件需要节流防抖防重复加载' },
      { to: 'eff-content-placeholder', desc: '加载间隙的骨架占位让追加不突兀' },
      { to: 'fe-lazy-loading', desc: '同源思想：按需拉取资源而非一次给全' },
    ],
    example: `const sentinel = document.querySelector('#sentinel');
const io = new IntersectionObserver(async (entries) => {
  if (!entries[0].isIntersecting || state.loading) return;
  state.loading = true;
  const next = await fetchNextPage(state.cursor); // 拉下一页
  appendItems(next.list);                         // 追加 DOM
  state.cursor = next.cursor;
  state.loading = false;
  if (!next.hasMore) {
    io.disconnect();             // 没有更多，停止观察
    showEndTip('到底啦～');
  }
}, { rootMargin: '200px' });     // 提前 200px 预加载
io.observe(sentinel);
`,
    exampleLang: 'js',
    demo: { kind: 'infinite-scroll' },
  },
  {
    id: 'eff-scroll-progress',
    name: '滚动进度指示',
    en: 'Scroll Progress Indicator',
    cat: 'effects',
    sub: '滚动叙事',
    tags: ['滚动', '进度', '阅读'],
    summary: '滚动进度指示用顶部细条实时显示已读百分比，把"读完还有多远"可视化，长文标配。',
    detail: `**效果描述**：页面顶端一条 2~3px 的彩色细条随阅读推进从左到右涨满——上方演示在滚动框内即可体验；还有圆环进度、侧边章节点亮等变体。

**实现原理**：进度 = \`scrollTop / (scrollHeight - clientHeight)\`，把比值写入进度条的 \`transform: scaleX()\`；现代零 JS 写法是 CSS 滚动驱动动画 \`animation-timeline: scroll()\`，一行绑定。

**适用场景与代表网站**：技术博客、长篇教程、小说阅读页；掘金、MDN 的文章页都有。

**生产建议**：用 \`scaleX\` 而非 \`width\`，避免每次滚动重排；细条配 \`position: fixed\`；把进度值同时驱动目录高亮形成"进度+导航"组合；滚动事件记得 passive + rAF 合并。`,
    relations: [
      { to: 'eff-scroll-driven', desc: 'scroll-timeline 让进度条零 JS 实现' },
      { to: 'eff-progress-ring', desc: '同一进度语义的圆环形态' },
      { to: 'eff-sticky', desc: '进度条与吸顶导航常同框出现' },
    ],
    example: `const bar = document.querySelector('.progress');
const update = () => {
  const max = document.documentElement.scrollHeight
            - window.innerHeight;
  const p = max > 0 ? window.scrollY / max : 0;
  bar.style.transform = 'scaleX(' + p + ')'; // 合成层动画
};
document.addEventListener('scroll', update, { passive: true });
update(); // 初始也要执行一次（含锚点直达场景）

/* CSS：transform-origin: 0 50%; transform: scaleX(0); */
`,
    exampleLang: 'js',
    demo: { kind: 'scroll-progress' },
  },
  {
    id: 'eff-smooth-scroll',
    name: '平滑滚动惯性',
    en: 'Smooth Scroll / Inertia (Lenis)',
    cat: 'effects',
    sub: '滚动叙事',
    tags: ['滚动', '手感', 'Lenis'],
    summary: '平滑滚动用插值缓动接管原生滚轮，页面带惯性丝滑滑行，营造"高级感"的包裹体验。',
    detail: `**效果描述**：拨一下滚轮，页面不是瞬移，而是缓缓滑行一段再柔和停下，像水面滑船——这就是 Lenis 类库带来的质感升级。

**实现原理**：拦截 \`wheel\` 事件获得目标位移，每帧用 lerp（线性插值）把当前滚动位置逼近目标：\`current += (target - current) * 0.1\`，写入 \`window.scrollTo\`；原生 \`scroll-behavior: smooth\` 只平滑锚点跳转，不带惯性。

**适用场景与代表网站**：创意机构官网、Awwwards 站点几乎全员开启；做滚动叙事配 GSAP 的团队标配。

**生产建议**：直接用 Lenis 而非自写（边界情况极多）；保留无障碍滚动路径并提供关闭开关；与 fixed 元素、iframe、嵌套滚动区相处注意豁免；先定滚动引擎再叠视差。`,
    relations: [
      { to: 'eff-lenis', desc: 'Lenis 是该效果的生产级实现库' },
      { to: 'eff-fullpage-scroll', desc: '同样接管滚动手感的两种哲学：连续滑行 vs 逐屏吸附' },
      { to: 'eff-anchor-scroll', desc: '锚点跳转要与平滑滚动引擎协作才有统一手感' },
    ],
    example: `import Lenis from 'lenis';

const lenis = new Lenis({
  duration: 1.2,        // 滑行时长
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,    // 接管滚轮
});

function raf(time) {
  lenis.raf(time);      // 每帧推进插值
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 与 GSAP ScrollTrigger 联动见 eff-lenis 词条
`,
    exampleLang: 'js',
  },
  {
    id: 'eff-back-to-top',
    name: '返回顶部',
    en: 'Back to Top',
    cat: 'effects',
    sub: '滚动叙事',
    tags: ['滚动', '导航', '组件'],
    summary: '返回顶部按钮在滚过一屏后浮现，点击平滑回到页首，长页面必备的导航兜底。',
    detail: `**效果描述**：右下角悬浮圆钮平时隐藏，滚过一屏后淡入，点击后页面丝滑滑回顶部；进阶形态把按钮做成进度环。

**实现原理**：显示/隐藏用 IntersectionObserver 观察"首屏哨兵"，或判断 \`scrollY > innerHeight\`；回到顶部用 \`window.scrollTo({ top: 0, behavior: 'smooth' })\`，Lenis 场景则调 \`lenis.scrollTo(0)\` 保持同一套手感。

**适用场景与代表网站**：所有长列表、长文档站点；电商详情页、博客归档页标配。

**生产建议**：加 \`aria-label="返回顶部"\` 并保证键盘可达；出现阈值别太小（一屏起）；动画只用 opacity/transform；SPA 切换路由后重置显示状态。`,
    relations: [
      { to: 'eff-scroll-progress', desc: '常合体为"进度环返回顶部按钮"' },
      { to: 'eff-anchor-scroll', desc: '同为"平滑定位到某处"的家族成员' },
      { to: 'eff-smooth-scroll', desc: '平滑动画由滚动引擎或原生 behavior 实现' },
    ],
    example: `const btn = document.querySelector('#back-top');
new IntersectionObserver(([e]) => {
  // 首屏哨兵离开视口 = 已滚过一屏
  btn.classList.toggle('show', !e.isIntersecting);
}).observe(document.querySelector('#hero'));

btn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
/* CSS：#back-top 默认 opacity:0 + pointer-events:none，
   .show 时恢复；过渡只用 opacity/transform */
`,
    exampleLang: 'js',
  },
  {
    id: 'eff-anchor-scroll',
    name: '锚点平滑定位',
    en: 'Anchor Smooth Scrolling',
    cat: 'effects',
    sub: '滚动叙事',
    tags: ['滚动', '导航', 'CSS'],
    summary: '锚点平滑定位让目录点击不再瞬间跳变，而是缓动滑向目标区块并自动补偿吸顶导航遮挡。',
    detail: `**效果描述**：点击"第三章"，页面像电梯一样滑到目标节，标题完整露出、不被吸顶导航盖住半截。

**实现原理**：一行 \`scroll-behavior: smooth\` 让锚点跳转变平滑；遮挡补偿用 \`scroll-margin-top\`（等于留出导航高度）；JS 精确控制用 \`scrollIntoView({ behavior: 'smooth' })\`，SPA 里交给路由 hash 或 \`lenis.scrollTo\`。

**适用场景与代表网站**：文档站目录（MDN、Vue 文档）、FAQ 页、单页官网导航。

**生产建议**：吸顶导航高度用 CSS 变量统一管理，\`scroll-margin-top\` 引用同一变量；SPA 中区分"锚点跳转"与"路由跳转"；全局 smooth 后给 reduced-motion 用户豁免。`,
    relations: [
      { to: 'eff-sticky', desc: '吸顶导航是 scroll-margin 要补偿的对象' },
      { to: 'eff-back-to-top', desc: '同属平滑定位家族：一个去页首一个去章节' },
      { to: 'eff-smooth-scroll', desc: 'Lenis 场景下锚点跳转要交给 lenis.scrollTo' },
    ],
    example: `html {
  scroll-behavior: smooth;   /* 锚点跳转全局平滑 */
}
/* 每个锚点目标预留吸顶导航高度，避免被遮挡 */
section[id] {
  scroll-margin-top: calc(var(--nav-h, 64px) + 16px);
}

/* JS 精确控制时：
   target.scrollIntoView({ behavior: 'smooth',
                           block: 'start' }); */
`,
    exampleLang: 'css',
  },
  {
    id: 'eff-scroll-telling',
    name: '滚动叙事',
    en: 'Scrollytelling',
    cat: 'effects',
    sub: '滚动叙事',
    tags: ['滚动', '叙事', 'GSAP'],
    summary: '滚动叙事让图文随滚动分幕推进、图表随进度演化，用户滚轮就是播放键，像被导演的故事。',
    detail: `**效果描述**：滚轮一拨，章节标题淡入、数据图生长、产品特写推近——内容不是摆在那儿，而是被滚动"导演"着推进，如同纪录片的分镜脚本。

**实现原理**：三件套：**GSAP ScrollTrigger**（\`pin\` 钉住场景 + \`scrub\` 把时间轴绑到滚动）、或 CSS 滚动驱动动画配 sticky 容器分幕；数据可视化侧用滚动进度插值图表参数，新闻业常用 scrollama + D3。

**适用场景与代表网站**：数据新闻（纽约时报 *Snow Fall* 开山）、Apple AirPods 产品页、年度报告 H5。

**生产建议**：故事优先、效果克制，每屏只讲一个重点；移动端重排分镜并预加载素材；提供"跳过动画"入口与 reduced-motion 静态版本；场景时长用屏数而非秒数设计。`,
    relations: [
      { to: 'eff-gsap', desc: 'ScrollTrigger 是滚动叙事的生产标配' },
      { to: 'eff-scroll-driven', desc: 'CSS 原生路线的对应物，轻量场景可直接替代' },
      { to: 'eff-parallax', desc: '视差层是叙事场景最常用的镜头语言' },
    ],
    example: `import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// 钉住一幕：滚轮推进场景内动画（scrub 模式）
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.scene',
    start: 'top top',
    end: '+=150%',     // 该幕消耗 1.5 屏滚动
    pin: true,         // 钉住场景
    scrub: 1,          // 动画跟随滚动（1s 平滑）
  },
});
tl.from('.scene h2', { y: 40, opacity: 0 })
  .to('.scene .rocket', { y: -200, rotate: 12 });
`,
    exampleLang: 'js',
  },

  // ==================== 加载与转场 ====================
  {
    id: 'eff-skeleton',
    name: '骨架屏',
    en: 'Skeleton Screen',
    cat: 'effects',
    sub: '加载与转场',
    tags: ['加载', '占位', '体验'],
    summary: '骨架屏在数据到达前用灰色脉冲块占出内容轮廓，加载完成后淡入真实内容，消除闪白焦虑。',
    detail: `**效果描述**：内容未到时先出现灰色"轮廓画"：头像圆、标题条、段落块微微呼吸闪烁；数据一到整体淡入替换成真实内容——上方演示正在骨架与真实内容之间循环。

**实现原理**：占位块用背景灰 + \`animation: pulse\`（opacity 循环）或扫光 shimmer（渐变背景位移动画）；形状按真实布局 1:1 摆放；数据到达后切换渲染真实组件，配 opacity 过渡衔接。

**适用场景与代表网站**：Feed 流首屏、详情页、看板；Facebook 首创后被 Notion、知乎、B 站广泛采用。

**生产建议**：骨架必须与真实内容布局一致，否则"闪一下"反而更难受；配合 SSR/流式渲染效果最佳；短于 300ms 的加载不必展示骨架（延迟显示防抖）；容器加 \`aria-busy="true"\`。`,
    relations: [
      { to: 'eff-content-placeholder', desc: '骨架屏是分级占位策略的第一级' },
      { to: 'eff-preloader', desc: '骨架管局部等待，preloader 管整页等待' },
      { to: 'fe-lazy-loading', desc: '同为先占位后填充的资源策略' },
    ],
    example: `.skeleton {
  background: #2a2f3a; border-radius: 6px;
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: .4; }  /* 呼吸明暗 */
}
/* 扫光变体 shimmer：高光从左掠过 */
.shimmer {
  background: linear-gradient(90deg,
    #2a2f3a 25%, #3a4150 37%, #2a2f3a 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s linear infinite;
}
@keyframes shimmer { from { background-position: 100% 0 }
  to { background-position: -100% 0 } }
`,
    exampleLang: 'css',
    demo: { kind: 'skeleton' },
  },
  {
    id: 'eff-preloader',
    name: '预加载动画',
    en: 'Preloader',
    cat: 'effects',
    sub: '加载与转场',
    tags: ['加载', '品牌', '动画'],
    summary: '预加载动画在资源就绪前循环播放 Loader 或品牌动画，把不可控的等待变成有预期的仪式感。',
    detail: `**效果描述**：进入网站先是全屏品牌画面：转圈圆环、滑动进度条或 Logo 描边动画，资源就绪后整体揭开进入首页——上方演示呈现环形 Loader 与滑动进度条两种经典形态。

**实现原理**：纯装饰型用 CSS 动画（border 旋转圆环、扫光进度条）；真实进度型用资源预加载器（\`Promise.all\` 监听关键资源、three.js LoadingManager）更新百分比；完成后给遮罩加退场动画并移除节点。

**适用场景与代表网站**：重资源创意站、游戏官网、3D 场景站点；Awwwards 站点几乎必备。

**生产建议**：等待硬上限 3 秒，超时强制放行；装饰动画不阻塞交互并提供跳过；确保 JS 失败时遮罩也能消失（noscript/超时兜底），否则等于自己制造白屏。`,
    relations: [
      { to: 'eff-skeleton', desc: '骨架管局部、preloader 管整页的两级等待体系' },
      { to: 'eff-progress-ring', desc: '圆环 Loader 与进度环同源：都是 stroke 弧线' },
      { to: 'eff-page-transition', desc: '入场揭开动画可与首屏转场无缝衔接' },
    ],
    example: `.loader {
  width: 48px; height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, .15);
  border-top-color: #fbbf24;    /* 只亮一段弧 */
  animation: spin .9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg) } }

/* 资源就绪后遮罩退场 */
.preloader.done {
  transform: translateY(-100%);
  transition: transform .6s cubic-bezier(.7, 0, .3, 1);
}
`,
    exampleLang: 'css',
    demo: { kind: 'preloader' },
  },
  {
    id: 'eff-page-transition',
    name: '页面转场',
    en: 'Page Transition',
    cat: 'effects',
    sub: '加载与转场',
    tags: ['转场', '路由', '动画'],
    summary: '页面转场在两页之间插入旧页退场、新页入场的动画，让路由跳转变成连贯的空间移动。',
    detail: `**效果描述**：点击链接，旧页滑出淡去、新页滑入，像舞台换景而不是闪屏——上方演示可反复切换 A/B 体会节奏。

**实现原理**：SPA 做"等待式切换"：旧页播 exit，结束后新页播 enter（framer-motion \`AnimatePresence mode="wait"\`，按路由 key 重挂载）；更高级的**共享元素转场**让卡片飞成详情页头图（\`layoutId\` 或 View Transitions API）。

**适用场景与代表网站**：作品集、品牌官网、移动端风格 Web 应用；Apple 产品线页、Stripe 站内切换。

**生产建议**：总时长 300~500ms，过久令人烦躁；方向语义一致：前进向左、后退向右；转场期间禁用重复点击；SSR/MPA 用 View Transitions API。`,
    relations: [
      { to: 'eff-route-transition', desc: 'View Transitions API 是浏览器原生的转场新方案' },
      { to: 'eff-expansion-card', desc: '共享元素转场的具体案例：卡片展开成详情' },
      { to: 'fe-client-routing', desc: '转场挂在路由切换的生命周期上' },
    ],
    example: `<AnimatePresence mode="wait">
  <motion.main
    key={route}                      // 路由变化触发重挂载
    initial={{ opacity: 0, x: 60 }}  // 新页入场
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -60 }}    // 旧页先退场
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    <Outlet />
  </motion.main>
</AnimatePresence>
`,
    exampleLang: 'jsx',
    demo: { kind: 'page-transition' },
  },
  {
    id: 'eff-route-transition',
    name: '路由过渡 View Transitions API',
    en: 'Route Transition / View Transitions API',
    cat: 'effects',
    sub: '加载与转场',
    tags: ['转场', '新特性', '浏览器'],
    summary: '路由过渡基于 View Transitions API，一行 CSS 即可让换页获得浏览器原生的进出场动画。',
    detail: `**效果描述**：换页瞬间浏览器自动截取旧页快照，新旧页面以滑动或圆形揭示交错过渡，全程浏览器合成不掉帧。

**实现原理**：调用 \`document.startViewTransition(callback)\`，回调里同步完成 DOM/路由更新；浏览器生成 old/new 伪元素快照供 CSS 定制动画；声明 \`view-transition-name\` 可跨页共享元素飞行。

**适用场景与代表网站**：MPA/SPA 通用，页面转场的原生答案；Astro/Next 新版文档站。

**生产建议**：调用前判断 API 存在并降级；React 里回调需 \`flushSync\` 同步提交；动画只用 opacity/transform；\`view-transition-name\` 同屏唯一，重复会跳过转场。`,
    relations: [
      { to: 'eff-page-transition', desc: 'JS 动画方案的原生替代，两者思路同源' },
      { to: 'fe-client-routing', desc: '包裹在路由跳转函数外触发一次性转场' },
      { to: 'fe-spa', desc: 'SPA 的路由切换正是该 API 的主战场' },
    ],
    example: `// SPA 路由切换时包裹一次渲染
function navigate(url) {
  if (!document.startViewTransition) {
    location.href = url;        // 不支持则直接跳转
    return;
  }
  document.startViewTransition(() => {
    updateTheDOMSomehow(url);   // 同步完成 DOM 更新
  });
}

/* 定制过渡动画（CSS 侧）：
::view-transition-old(root) { animation: fade-out .25s both }
::view-transition-new(root) { animation: fade-in  .25s both } */
`,
    exampleLang: 'js',
  },
  {
    id: 'eff-lazy-image-fade',
    name: '图片懒加载淡入',
    en: 'Lazy Image Fade-in',
    cat: 'effects',
    sub: '加载与转场',
    tags: ['图片', '加载', '性能'],
    summary: '图片懒加载淡入让图片进入视口才加载，解码完成后由模糊或透明渐变为清晰，告别突兀闪现。',
    detail: `**效果描述**：滚动到哪儿图片才加载到哪儿，加载完成不是"啪"地弹出，而是从透明或模糊柔和浮现，占位底色先撑住版面。

**实现原理**：加载时机交给原生 \`loading="lazy"\`；浮现动画在 \`onload\` 后加 class 触发 \`opacity 0→1\` 过渡；进阶 blur-up：先显示模糊缩略图，高清图就绪后交叉淡入（Next/Image 内置）。

**适用场景与代表网站**：图片密集站点；Medium 的 blur-up、Unsplash 图墙、Pinterest 商品流。

**生产建议**：首屏 LCP 图不要懒加载，改 \`fetchpriority="high"\`；必须声明 width/height 防 CLS 抖动；淡入 300ms 内；配合 WebP/AVIF 现代格式。`,
    relations: [
      { to: 'fe-lazy-loading', desc: '懒加载的通用前端概念，图片是最典型场景' },
      { to: 'eff-skeleton', desc: '加载前的占位反馈，与淡入衔接自然' },
      { to: 'eff-content-placeholder', desc: '媒体级渐进填充的具体实现' },
    ],
    example: `<img
  src="hero.avif"
  alt="产品图"
  loading="lazy"           <!-- 进入视口才请求 -->
  decoding="async"
  width="800" height="500" <!-- 防 CLS 抖动 -->
  class="fade-img"
  onload="this.classList.add('loaded')"
/>

/* CSS：.fade-img { opacity: 0; transition: opacity .3s }
         .fade-img.loaded { opacity: 1 } */
`,
    exampleLang: 'html',
  },
  {
    id: 'eff-content-placeholder',
    name: '内容占位分级',
    en: 'Tiered Content Placeholder',
    cat: 'effects',
    sub: '加载与转场',
    tags: ['加载', '策略', '体验'],
    summary: '内容占位分级按数据到达次序分层填充：先骨架、再文本、后媒体，每级都有对应占位形态。',
    detail: `**效果描述**：页面不是"全有或全无"：骨架先撑起结构，文字数据到了先渲染，图片最后渐进浮现——每一级等待都有对应视觉反馈，感知快于实际。

**实现原理**：按资源层级编排：HTML/SSR 先出结构 → 未到模块由骨架屏兜底 → 接口数据流式注入（React Suspense 分段 \`fallback\`）→ 图片用 LQIP/blur-up 渐进加载；配合 \`Promise.race\` 做超时降级。

**适用场景与代表网站**：内容聚合首页、仪表盘、社交 Feed；YouTube（灰块→文字→封面）、Twitter 的分级填充是教科书。

**生产建议**：分级顺序按"用户最想看什么"排列；每级独立 loading 状态而非全局转圈；Suspense 的 fallback 复用骨架组件；埋点测各级耗时持续优化。`,
    relations: [
      { to: 'eff-skeleton', desc: '骨架屏是其第一级占位形态' },
      { to: 'eff-lazy-image-fade', desc: '媒体级的渐进加载策略' },
      { to: 'eff-infinite-scroll', desc: '流式追加内容时的占位续接' },
    ],
    example: `// React Suspense 分级占位：每层独立 fallback
<Suspense fallback={<PostSkeleton />}>
  <PostList />                    {/* 第一级：文字数据 */}
  <Suspense fallback={<ImgSkeleton />}>
    <PostCover />                 {/* 第二级：媒体资源 */}
  </Suspense>
</Suspense>
// 数据、组件、图片各自就绪各自呈现，
// 用户先读到文字，再看图片浮现
`,
    exampleLang: 'jsx',
  },

  // ==================== 文字动效 ====================
  {
    id: 'eff-typewriter',
    name: '打字机效果',
    en: 'Typewriter Effect',
    cat: 'effects',
    sub: '文字动效',
    tags: ['文字', '动画', '终端风'],
    summary: '打字机效果让文字逐字出现并伴随光标闪烁，模拟敲键盘输出，Hero 标语与终端风界面常用。',
    detail: `**效果描述**：文字一个一个蹦出来，尾部光标规律闪烁，偶尔还有删除重来换下一句的循环——上方演示正是逐字输出加光标闪烁的完整形态。

**实现原理**：纯 CSS 版：等宽字体 + \`width: 0→N ch\` 配 \`steps(N)\` 逐字揭示，\`border-right\` 当光标闪烁；JS 版用 \`setInterval\` 切片 \`text.slice(0, n)\`，便于多句循环、删除与变速。

**适用场景与代表网站**：开发者工具官网（终端感）、个人主页 Hero 标语、Chat 类产品的流式回复（AI 回答天然是打字机）。

**生产建议**：中文场景 \`ch\` 单位不准，用 JS 切片更稳；光标闪烁用 \`steps(2)\` 而非 linear 才像真终端；AI 对话流式输出直接复用该效果；给容器加 \`aria-live\` 让读屏用户一次听到全文。`,
    relations: [
      { to: 'eff-text-reveal', desc: '逐字家族的两兄弟：打字机模拟输入，reveal 强调出场' },
      { to: 'eff-text-gradient', desc: '流光渐变可叠加在打字文本上做双色效果' },
      { to: 'eff-gsap', desc: 'TextPlugin 提供生产级打字机编排' },
    ],
    example: `.typewriter {
  font-family: monospace;
  width: 22ch;                    /* 文本总字数 */
  overflow: hidden;               /* 藏住未打出的字 */
  white-space: nowrap;
  border-right: 2px solid #34d399; /* 光标 */
  animation:
    typing 2.2s steps(22) forwards, /* 逐字揭示 */
    caret .8s steps(2) infinite;    /* 光标闪烁 */
}
@keyframes typing { from { width: 0 } to { width: 22ch } }
@keyframes caret  { 50% { border-color: transparent } }
`,
    exampleLang: 'css',
    demo: { kind: 'typewriter' },
  },
  {
    id: 'eff-text-reveal',
    name: '文字逐字显现',
    en: 'Text Reveal / Split Text',
    cat: 'effects',
    sub: '文字动效',
    tags: ['文字', '动画', '标题'],
    summary: '文字逐字显现把标题拆成字符依次带位移与模糊淡入，形成电影字幕般的华丽出场。',
    detail: `**效果描述**：标题先隐形，每个字带着轻微上移与模糊渐次浮起，错落有致如片头字幕——上方演示正是逐字 blur + 位移入场。

**实现原理**：把文本拆成 \`<span>\` 粒度（字符或单词），每个 span 设 \`animation-delay: i * 50ms\`，播放 \`opacity + translateY + blur\` 入场；生产用 GSAP SplitText + \`stagger\` 编排；常配滚动显现，进视口才播放。

**适用场景与代表网站**：品牌官网 Hero 大标题、片头式开场、获奖作品集；Apple 产品页标题等 Awwwards 站首屏。

**生产建议**：拆字破坏选中与搜索，正文别用（或加 \`aria-label\`）；英文拆单词、中文拆字符；stagger 40~80ms、单字动画 ≤0.5s；只做一遍入场别循环。`,
    relations: [
      { to: 'eff-typewriter', desc: '同为逐字动效：打字机重输入感，reveal 重出场感' },
      { to: 'eff-scroll-reveal', desc: '整块显现的宏观版，两者常组合使用' },
      { to: 'eff-gsap', desc: 'SplitText + stagger 是生产级编排方案' },
    ],
    example: `// 拆字 + stagger 入场（GSAP 版）
const chars = title.textContent.split('');
title.innerHTML = chars
  .map((c) => '<span class="ch">' + c + '</span>')
  .join('');

gsap.from('.ch', {
  y: 18, opacity: 0, filter: 'blur(4px)',
  duration: 0.45, ease: 'power2.out',
  stagger: 0.05,          // 每字延迟 50ms
});
// 纯 CSS 版：给第 i 个 span 写
// animation-delay: calc(i * 50ms) 同样可行
`,
    exampleLang: 'js',
    demo: { kind: 'text-reveal' },
  },
  {
    id: 'eff-count-up',
    name: '数字滚动 CountUp',
    en: 'CountUp',
    cat: 'effects',
    sub: '文字动效',
    tags: ['数字', '动画', '看板'],
    summary: '数字滚动让统计值从 0 缓动涨到目标数，常在进入视口时触发，数据成果展示的标配动效。',
    detail: `**效果描述**：一串大数字从 0 快速滚动跳变，最后稳稳停在目标值，先快后慢的缓动很有"结算感"——上方演示可重播 easeOutCubic 缓动。

**实现原理**：\`requestAnimationFrame\` 循环，按 \`p = elapsed / duration\` 求进度，套缓动函数（easeOutCubic：\`1 - (1-p)^3\`）算当前值；进入视口才启动；\`toLocaleString\` 加千分位。

**适用场景与代表网站**：落地页"服务 1,200 万用户"、年度报告数据页、看板指标卡。

**生产建议**：\`tabular-nums\` 防数字宽度抖动；时长 1~2s；触发一次即 disconnect；React 可用 react-countup。`,
    relations: [
      { to: 'eff-progress-ring', desc: '数字与圆环组合呈现完成度，看板双拼' },
      { to: 'eff-scroll-reveal', desc: '共用进入视口触发的机制' },
      { to: 'eff-gsap', desc: 'gsap.to 的 snap 修饰器同样擅长数字动画' },
    ],
    example: `function countUp(el, target, duration = 1600) {
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);  // easeOutCubic
    el.textContent = Math.round(target * eased)
      .toLocaleString();                   // 千分位
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
// 进入视口才触发一次
new IntersectionObserver(([e], io) => {
  if (e.isIntersecting) { countUp(el, 2333); io.disconnect(); }
}).observe(el);
`,
    exampleLang: 'js',
    demo: { kind: 'count-up' },
  },
  {
    id: 'eff-text-gradient',
    name: '渐变文字流光',
    en: 'Animated Gradient Text',
    cat: 'effects',
    sub: '文字动效',
    tags: ['文字', '渐变', 'CSS'],
    summary: '渐变文字流光用 background-clip: text 把流动渐变裁进文字笔画，标题呈现彩色光带游走。',
    detail: `**效果描述**：标题文字内部像封着流动的极光：多彩渐变沿笔画缓缓滑过，轮廓依然锐利，是 SaaS 官网标题的标志性质感。

**实现原理**：三件套：\`background-clip: text\` 把渐变背景裁成文字形状、\`color: transparent\` 让字色让位，放大 \`background-size\` 再动 \`background-position\` 即可流动。

**适用场景与代表网站**：SaaS 官网 Hero 标题（Stripe、Linear 风格）、创作者主页。

**生产建议**：渐变取品牌色板且对比度达标；reduced-motion 时定格静态；Safari 老版本需 -webkit- 前缀；只用于大标题。`,
    relations: [
      { to: 'eff-gradient-animate', desc: '同一手法作用于块状背景的版本' },
      { to: 'eff-neon-glow', desc: '流光与霓虹是大标题特效的双雄' },
      { to: 'fe-css-variables', desc: '用 CSS 变量管理渐变色板便于主题化' },
    ],
    example: `.gradient-text {
  font-size: 48px; font-weight: 900;
  background: linear-gradient(90deg,
    #fbbf24, #f472b6, #22d3ee, #fbbf24); /* 首尾同色 */
  background-size: 300% 100%;     /* 放大便于流动 */
  -webkit-background-clip: text;  /* Safari 前缀 */
  background-clip: text;          /* 背景裁进文字 */
  color: transparent;             /* 字色让位 */
  animation: flow 4s linear infinite;
}
@keyframes flow { to { background-position: 300% 0 } }
`,
    exampleLang: 'css',
  },

  // ==================== 微交互 ====================
  {
    id: 'eff-tilt',
    name: '3D 倾斜卡片',
    en: '3D Tilt Card',
    cat: 'effects',
    sub: '微交互',
    tags: ['微交互', '3D', '指针跟随'],
    summary: '3D 倾斜卡片随鼠标位置绕 X/Y 轴微倾并带透视，卡面元素分层 translateZ，立体感十足。',
    detail: `**效果描述**：鼠标在卡片上移动，卡片像被指尖轻压般朝对应方向倾斜，图标与文字浮在卡面之上、阴影反向偏移——上方演示移动鼠标即可体会。

**实现原理**：\`mousemove\` 计算光标在卡内的相对位置（-0.5~0.5），映射为 \`rotateX/rotateY\`（最大 ±10°），父容器 \`perspective\` 提供透视；卡内元素 \`translateZ(30px)\` 分层产生景深；离开时弹簧回弹。

**适用场景与代表网站**：作品卡片、勋章/卡牌展示、定价卡；Apple TV+ 与 Stripe 产品卡的质感来源。

**生产建议**：倾角 ≤15°；移动端无 hover 改陀螺仪；用 useSpring、vanilla-tilt 或 gsap.quickTo 跟随；加 \`will-change\`。`,
    relations: [
      { to: 'eff-magnetic', desc: '指针跟随家族：一个转动一个平移' },
      { to: 'eff-hover-lift', desc: '抬升是倾斜的极简替代，二选一即可' },
      { to: 'eff-gsap', desc: 'quickTo 是高频指针跟随的高性能实现路径' },
    ],
    example: `card.addEventListener('mousemove', (e) => {
  const r = card.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;  // -0.5~0.5
  const py = (e.clientY - r.top) / r.height - 0.5;
  card.style.transform =
    'perspective(600px)' +
    ' rotateY(' + px * 14 + 'deg)' +    // 水平倾角
    ' rotateX(' + -py * 14 + 'deg)';    // 垂直倾角
});
card.addEventListener('mouseleave', () => {
  card.style.transform = 'perspective(600px)'; // 回弹归位
});
`,
    exampleLang: 'js',
    demo: { kind: 'tilt' },
  },
  {
    id: 'eff-magnetic',
    name: '磁吸按钮',
    en: 'Magnetic Button',
    cat: 'effects',
    sub: '微交互',
    tags: ['微交互', '指针跟随', '按钮'],
    summary: '磁吸按钮让按钮在光标靠近时被"吸"向指针、离开后弹簧归位，用物理感制造俏皮的互动记忆点。',
    detail: `**效果描述**：鼠标还没碰到按钮，按钮已微微偏向你；越靠近吸得越多，离开瞬间像弹簧一样弹回原位——上方演示在区域内移动即可感受。

**实现原理**：监听**父容器**（而非按钮自身）的 \`mousemove\`，计算光标相对按钮中心的偏移乘以系数（0.3~0.4）作为 \`translate\` 目标，用弹簧插值（framer-motion \`useSpring\` 或 GSAP \`quickTo\`）跟随；离开时目标归零回位。

**适用场景与代表网站**：CTA 主按钮、社交图标、关闭按钮；许多创意机构官网把它当标志性交互。

**生产建议**：感应区比按钮大一圈体验更好；位移别超 20px；触屏直接禁用；按钮内文字可反向少量位移制造视差；弹簧 stiffness 200 左右，别太"Q 弹"。`,
    relations: [
      { to: 'eff-tilt', desc: '指针驱动的孪生兄弟，常在同站搭配出现' },
      { to: 'eff-custom-cursor', desc: '自定义光标与磁吸同场营造整体"手感"' },
      { to: 'eff-gsap', desc: 'quickTo 是 GSAP 版实现路径' },
    ],
    example: `function MagneticButton({ children }) {
  const x = useSpring(useMotionValue(0), { stiffness: 200 });
  const y = useSpring(useMotionValue(0), { stiffness: 200 });
  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <motion.button style={{ x, y }}>{children}</motion.button>
    </div>
  );
}
`,
    exampleLang: 'jsx',
    demo: { kind: 'magnetic' },
  },
  {
    id: 'eff-ripple',
    name: '点击涟漪',
    en: 'Ripple Effect',
    cat: 'effects',
    sub: '微交互',
    tags: ['微交互', 'Material', '反馈'],
    summary: '点击涟漪从按压点扩散出半透明圆形波纹后消散，是 Material Design 的标志性按压反馈。',
    detail: `**效果描述**：手指按下按钮，接触点荡开一圈水波并逐渐淡去，让"我按到了"有了具象反馈——上方演示每次点击都从光标处起波。

**实现原理**：点击时在按钮内插入一个圆形 span，定位到 \`e.clientX - rect.left\` 按压点，从 \`scale(0)\` 动画到 \`scale(4)\` 同时 \`opacity\` 归零，600ms 后移除节点；按钮 \`overflow: hidden\` 裁掉溢出波纹；多波纹并存用数组状态。

**适用场景与代表网站**：Material 系产品：Android Web 应用、MUI 组件、Google 全家桶网页。

**生产建议**：波纹用白色或品牌色半透明；高频点击及时清理 DOM 节点；已有按压 scale 时二选一避免反馈过载；波纹层 \`pointer-events: none\` 防挡点击。`,
    relations: [
      { to: 'eff-button-press', desc: '两种按压反馈：涟漪有位置感，scale 有整体感' },
      { to: 'eff-hover-lift', desc: 'hover 抬升 + 点击涟漪构成完整反馈链' },
      { to: 'eff-toggle-switch', desc: '同属 Material Design 反馈语言家族' },
    ],
    example: `btn.addEventListener('click', (e) => {
  const r = btn.getBoundingClientRect();
  const d = Math.max(r.width, r.height) * 2; // 波纹直径
  const wave = document.createElement('span');
  wave.className = 'ripple-wave';            // absolute + 圆形
  wave.style.cssText =
    'left:' + (e.clientX - r.left - d / 2) + 'px;' +
    'top:'  + (e.clientY - r.top - d / 2) + 'px;' +
    'width:' + d + 'px;height:' + d + 'px;';
  btn.appendChild(wave);
  wave.addEventListener('animationend', () => wave.remove());
});
/* CSS：.ripple-wave { border-radius: 50%;
     background: rgba(255,255,255,.45);
     animation: wave .6s ease-out forwards; }
   @keyframes wave { to { transform: scale(0); opacity: 0 } } */
`,
    exampleLang: 'js',
    demo: { kind: 'ripple' },
  },
  {
    id: 'eff-magic-line',
    name: '魔法导航条',
    en: 'Magic Line Navigation',
    cat: 'effects',
    sub: '微交互',
    tags: ['微交互', '导航', '动画'],
    summary: '魔法导航条是导航里随选中项滑动过渡的下划线，而非每项各自闪现，让切换更有整体感。',
    detail: `**效果描述**：一条下划线在导航项之间平滑滑动、伸缩到新选中项的宽度，像有一条"活"的线在游走——上方演示点击不同 Tab 感受滑行与弹簧感。

**实现原理**：一个绝对定位的下划线常驻导航底部，切换时读取目标项的 \`offsetLeft/offsetWidth\` 写入 \`transform: translateX\` 与 \`width\` 过渡；React 里 framer-motion 的 \`layoutId\` 共享元素可自动插值，无需手动测量。

**适用场景与代表网站**：站点主导航、Tab 组、分段控件；各类文档站与设计感导航的标配。

**生产建议**：窗口 resize 后重新测量；初始渲染要无动画定位到当前项；也常做成背景滑块（pill 高亮）形态；配合 sticky 导航注意层叠顺序。`,
    relations: [
      { to: 'eff-tab-switch', desc: '导航条滑动与内容面板切换是 Tab 的成套动作' },
      { to: 'eff-sticky', desc: '魔法条常驻身于吸顶导航之中' },
      { to: 'eff-gsap', desc: '非 React 项目可用 gsap.to 补间位置与宽度' },
    ],
    example: `// 魔法条随选中项滑动（测量 offsetLeft 方案）
function moveLine(target) {
  line.style.width = target.offsetWidth + 'px';
  line.style.transform =
    'translateX(' + target.offsetLeft + 'px)';
}
nav.addEventListener('click', (e) => {
  const item = e.target.closest('.nav-item');
  if (item) { setActive(item); moveLine(item); }
});
/* framer-motion 版：给 line 声明 layoutId="magic-line"，
   切换时自动在两位置间弹簧插值，无需手动测量 */
`,
    exampleLang: 'js',
    demo: { kind: 'magic-line' },
  },
  {
    id: 'eff-hover-lift',
    name: '悬停浮起抬升',
    en: 'Hover Lift',
    cat: 'effects',
    sub: '微交互',
    tags: ['微交互', 'hover', '卡片'],
    summary: '悬停浮起让卡片在鼠标移入时上移并加深投影，是成本最低也最常用的"可点击"暗示。',
    detail: `**效果描述**：鼠标移入卡片，卡片整体上浮 4~8px、投影加深放大，像被轻轻托起，移出回落——传递"可以点我"的信号。

**实现原理**：纯 CSS 两行：\`:hover\` 时 \`transform: translateY(-6px)\` + \`box-shadow\` 加深，配 \`transition: transform, box-shadow\`；只动 transform 与 shadow，别动 top/margin。

**适用场景与代表网站**：卡片列表、定价方案、服务入口；GitHub 仓库卡等 SaaS 特性卡的默认手法。

**生产建议**：回弹曲线缓动更有托举感；触摸屏补 \`:active\` 按压兜底；与 tilt/magnetic 二选一；大卡浮起 6~8px、小卡 3~4px。`,
    relations: [
      { to: 'eff-tilt', desc: '抬升是倾斜的平面版，预算有限时的替代' },
      { to: 'eff-button-press', desc: 'hover 抬升配 active 按压，反馈闭环' },
      { to: 'eff-bento', desc: 'Bento 格子悬停抬升是常见组合' },
    ],
    example: `.card {
  transition: transform .25s ease, box-shadow .25s ease;
}
.card:hover {
  transform: translateY(-6px);              /* 上浮 */
  box-shadow: 0 12px 32px rgba(0,0,0,.35);  /* 投影加深 */
}
.card:active {
  transform: translateY(-2px);  /* 触摸屏的按压替代 */
  transition-duration: .1s;
}
`,
    exampleLang: 'css',
  },
  {
    id: 'eff-toggle-switch',
    name: '开关切换动画',
    en: 'Toggle Switch Animation',
    cat: 'effects',
    sub: '微交互',
    tags: ['微交互', '表单', 'iOS 风'],
    summary: '开关切换让圆形滑块沿轨道弹性滑动并变色，把布尔状态变成可感知的物理拨动。',
    detail: `**效果描述**：点击开关，圆形滑块沿轨道弹性滑到另一端，轨道颜色同步点亮或熄灭，像拨动一枚真实的拨钮。

**实现原理**：结构为轨道 + 滑块两层：选中态用 \`translateX\` 移动滑块、\`background-color\` 过渡变色；弹性手感来自回弹曲线 \`cubic-bezier(0.34, 1.56, 0.64, 1)\`；纯 CSS 用 checkbox + \`:checked\` 兄弟选择器即可零 JS。

**适用场景与代表网站**：设置页开关、暗色模式切换、筛选条件；Headless UI Switch、MUI Switch 的标准形态。

**生产建议**：必须用真实 \`input\`/\`role="switch"\` 保证键盘与读屏可用；点击热区 ≥44px；切换 200~250ms；禁用态降透明度；滑块加阴影更凸起。`,
    relations: [
      { to: 'eff-button-press', desc: '同为控件按压反馈家族' },
      { to: 'eff-ripple', desc: '开关上叠涟漪是 Material 的经典组合' },
      { to: 'eff-dark-toggle', desc: '暗色模式切换是开关最常见的业务落点' },
    ],
    example: `.switch-track { width: 44px; height: 24px; border-radius: 999px;
  background: #475569; transition: background .2s; }
.switch-knob  { width: 18px; height: 18px; border-radius: 50%;
  background: #fff; transform: translateX(3px);
  transition: transform .25s cubic-bezier(.34, 1.56, .64, 1); }

/* 选中态：轨道点亮 + 滑块右移（checkbox + 兄弟选择器） */
input:checked ~ .switch-track { background: #10b981; }
input:checked ~ .switch-knob  { transform: translateX(23px); }
`,
    exampleLang: 'css',
  },
  {
    id: 'eff-button-press',
    name: '按钮按压反馈 scale',
    en: 'Button Press Feedback',
    cat: 'effects',
    sub: '微交互',
    tags: ['微交互', '按钮', '反馈'],
    summary: '按钮按压反馈在 active 时把按钮微缩并压暗，松手回弹，补上"按下去"的物理手感。',
    detail: `**效果描述**：按下瞬间整体微缩（scale 0.95~0.97）并略压暗，松手回弹——模拟物理按键的行程，让点击有"实感"。

**实现原理**：\`:active\` 伪类触发 \`transform: scale(0.96)\`；手感取决于 transition：按下要短（80~120ms）、松开稍长带回弹；Tailwind 一行 \`active:scale-95\` 即可；进阶让阴影同步收缩更像按入。

**适用场景与代表网站**：所有可点击元素的默认反馈；Telegram Web、Linear 都带这类手感。

**生产建议**：与涟漪效果二选一，避免反馈过载；缩放别小于 0.9 否则像 bug；触屏加 \`touch-action: manipulation\` 防双击缩放；reduced-motion 时移除缩放。`,
    relations: [
      { to: 'eff-ripple', desc: '两种按压反馈哲学：整体缩放 vs 位置涟漪' },
      { to: 'eff-hover-lift', desc: 'hover 抬升 + active 按压构成完整状态反馈' },
      { to: 'eff-toggle-switch', desc: '开关的按压手感同样来自 scale/回弹曲线' },
    ],
    example: `.btn {
  transition: transform .12s ease, box-shadow .12s ease;
}
.btn:active {
  transform: scale(.96);                /* 按下微缩 */
  box-shadow: 0 1px 2px rgba(0,0,0,.3); /* 阴影收缩 */
}
@media (prefers-reduced-motion: reduce) {
  .btn:active { transform: none; }      /* 动效豁免 */
}
`,
    exampleLang: 'css',
  },
  {
    id: 'eff-tooltip-animation',
    name: '气泡提示出现动画',
    en: 'Tooltip Entrance Animation',
    cat: 'effects',
    sub: '微交互',
    tags: ['微交互', '气泡', 'hover'],
    summary: '气泡提示以缩放、位移加淡入的方式弹出并带箭头定位，避免突兀出现打断浏览。',
    detail: `**效果描述**：悬停目标元素，气泡以 scale 0.9→1 加位移淡入弹出，小箭头指向目标；消失时反向收起，轻盈不打断。

**实现原理**：气泡默认缩至 .92 且透明、\`pointer-events: none\`，悬停归位；\`transform-origin\` 决定弹出方向；纯 CSS 用 group-hover，含翻转定位逻辑用 floating-ui。

**适用场景与代表网站**：图标按钮说明、术语解释、截断文本全文；GitHub、Figma 的 tooltip 出场均很细腻。

**生产建议**：延迟 300~500ms 出现防闪现，消失要即时；气泡别遮挡目标本身；键盘 focus 也要触发；触屏改点击切换；重要说明别只放 tooltip。`,
    relations: [
      { to: 'eff-button-press', desc: '同属 hover/active 状态动画家族' },
      { to: 'eff-hover-lift', desc: '常一起构成卡片的悬停反馈组合' },
      { to: 'eff-glassmorphism', desc: '气泡常用毛玻璃质感提升层次' },
    ],
    example: `.tip { position: relative; }
.tip .bubble {
  position: absolute; bottom: calc(100% + 8px); left: 50%;
  translate: -50% 4px; scale: .92;   /* 初始收起 */
  opacity: 0; pointer-events: none;
  transition: opacity .18s, translate .18s, scale .18s;
  transform-origin: bottom center;   /* 从目标侧弹出 */
}
.tip:hover .bubble,
.tip:focus-visible .bubble {
  opacity: 1; translate: -50% 0; scale: 1;  /* 弹出归位 */
}
`,
    exampleLang: 'css',
  },

  // ==================== 视觉风格 ====================
  {
    id: 'eff-glassmorphism',
    name: '毛玻璃拟态',
    en: 'Glassmorphism',
    cat: 'effects',
    sub: '视觉风格',
    tags: ['风格', 'CSS', '拟态'],
    summary: '毛玻璃拟态用 backdrop-blur 把背后内容虚化成磨砂质感，配合半透明底与细边框营造轻盈层次。',
    detail: `**效果描述**：一块半透明卡片浮在彩色背景上，背后景象被虚化成朦胧光斑，卡面泛着细边高光，像磨砂玻璃——上方演示背后正是被虚化的彩色光球。

**实现原理**：三件套：\`backdrop-filter: blur\` 虚化背后内容、\`rgba\` 半透明底、细白描边；再叠 \`box-shadow\` 增悬浮感。

**适用场景与代表网站**：macOS/Vision OS 系统界面、导航栏、模态卡片、播放器控件；Apple 官网与无数 Dribbble 概念稿。

**生产建议**：\`backdrop-filter\` 成本随模糊半径与面积增长，滚动区大面积慎用；不支持时用 \`@supports\` 降级为纯色底；底层背景要有足够色彩对比。`,
    relations: [
      { to: 'eff-neumorphism', desc: '拟态双雄：毛玻璃透、新拟态浮雕' },
      { to: 'eff-gradient-animate', desc: '彩色流动背景是毛玻璃最好的"透景"' },
      { to: 'eff-lightbox', desc: '灯箱遮罩常用毛玻璃压暗背景' },
    ],
    example: `.glass {
  background: rgba(255, 255, 255, .08);  /* 半透明底 */
  backdrop-filter: blur(14px) saturate(1.4);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, .25); /* 描光边 */
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, .35);
}
/* 降级：不支持时提高底色不透明度 */
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: rgba(20, 24, 34, .92); }
}
`,
    exampleLang: 'css',
    demo: { kind: 'glassmorphism' },
  },
  {
    id: 'eff-neumorphism',
    name: '新拟态',
    en: 'Neumorphism',
    cat: 'effects',
    sub: '视觉风格',
    tags: ['风格', '阴影', '拟物'],
    summary: '新拟态用同色双向阴影把控件塑造成从背景凸起或凹进的软浮雕，风格极简柔和。',
    detail: `**效果描述**：控件与背景同色，靠左上亮、右下暗的双向阴影把按钮"凸"出背景；按下时阴影内翻变成"凹"痕，像软胶浮雕——上方演示同屏展示凸起与凹陷两态。

**实现原理**：核心是双值 \`box-shadow\`：\`8px 8px 16px 暗色, -8px -8px 16px 亮色\`；凹陷态改用 \`inset\` 内阴影；背景必须纯色且控件同色，立体感全靠光影模拟，无描边无渐变。

**适用场景与代表网站**：音乐播放器、智能家居面板、计算器概念 UI；2020 年 Dribbble 刮起的 Neumorphism 风潮。

**生产建议**：对比度天然偏低，正文与关键操作别用（可访问性硬伤），仅作装饰性控件；阴影色随主题变量走，暗色模式需整套重调；按压时缩小阴影偏移表现"按入"；大圆角让浮雕感更柔和。`,
    relations: [
      { to: 'eff-glassmorphism', desc: '拟态双雄：一个透光一个浮雕' },
      { to: 'eff-toggle-switch', desc: '新拟态开关是最经典的组合应用' },
      { to: 'eff-button-press', desc: '按压反馈在新拟态里表现为凹陷阴影' },
    ],
    example: `.neu-page { background: #e0e5ec; }       /* 同色基底 */

.neu-raised {  /* 凸起：左上亮影 + 右下暗影 */
  background: #e0e5ec;
  border-radius: 16px;
  box-shadow: 8px 8px 16px #bec4cd,
             -8px -8px 16px #ffffff;
}
.neu-pressed { /* 凹陷：inset 内翻阴影 */
  box-shadow: inset 6px 6px 12px #bec4cd,
              inset -6px -6px 12px #ffffff;
}
`,
    exampleLang: 'css',
    demo: { kind: 'neumorphism' },
  },
  {
    id: 'eff-gradient-animate',
    name: '流光渐变',
    en: 'Animated Gradient Background',
    cat: 'effects',
    sub: '视觉风格',
    tags: ['风格', '渐变', '背景'],
    summary: '流光渐变放大背景尺寸并循环移动 position，让渐变色带在按钮或横幅上缓慢流动。',
    detail: `**效果描述**：按钮或横幅上的渐变不是静止的，色带像液体一样缓慢流动、循环往复——上方演示的卡片就是 600% 放大的渐变在循环游走。

**实现原理**：把 \`background-size\` 放大到 300%~600%，再用 \`background-position\` 在 0%~100% 间循环动画，渐变随之"流动"；另一条路线是 \`hue-rotate\` 滤镜做色相旋转；大面积场景可换 canvas/WebGL 渲染。

**适用场景与代表网站**：CTA 按钮、会员卡、加载文案、品牌横幅；Instagram 渐变按钮、各类 AI 产品界面。

**生产建议**：循环周期 4~8s 避免晃眼；首尾同色相才能无缝循环；大面积流动注意重绘，必要时换 transform；\`prefers-reduced-motion\` 时定格。`,
    relations: [
      { to: 'eff-text-gradient', desc: '同一手法裁进文字的变体' },
      { to: 'eff-neon-glow', desc: '流光渐变常与霓虹发光同场营造氛围' },
      { to: 'eff-noise-texture', desc: '噪点叠加在流动渐变上消除色带感' },
    ],
    example: `.flow {
  background: linear-gradient(270deg,
    #7c5cf0, #f74c00, #00add8, #7c5cf0); /* 首尾同色无缝 */
  background-size: 600% 600%;      /* 放大渐变画布 */
  animation: flow 6s linear infinite;
}
@keyframes flow {
  0%   { background-position: 0% 50% }
  50%  { background-position: 100% 50% }
  100% { background-position: 0% 50% }  /* 循环归位 */
}
`,
    exampleLang: 'css',
    demo: { kind: 'gradient-animate' },
  },
  {
    id: 'eff-neon-glow',
    name: '霓虹发光',
    en: 'Neon Glow',
    cat: 'effects',
    sub: '视觉风格',
    tags: ['风格', '发光', '暗色'],
    summary: '霓虹发光用多层同色 text-shadow 或 box-shadow 加呼吸动画，模拟霓虹灯管的光晕与闪烁。',
    detail: `**效果描述**：暗底之上，文字或边框泛着同色光晕，光晕缓慢呼吸、偶尔闪烁，像深夜招牌的霓虹灯管——上方演示的 NEON 字样持续呼吸明暗。

**实现原理**：多层 \`text-shadow\`（边框用 box-shadow）同色叠加：小半径贴字亮晕 + 中层扩散 + 大半径弥散；呼吸动画在两组 shadow 强弱间循环；闪烁用 \`steps\` 制造断续感。

**适用场景与代表网站**：赛博朋克主题站、夜店/音乐节活动页、暗色仪表盘强调元素；Cyberpunk 2077 官网是代表。

**生产建议**：只在深色背景使用，浅底发光显脏；shadow 层数 ≤3 控制绘制成本；光晕别承载关键信息对比度，正文保持普通样式；reduced-motion 时停止呼吸。`,
    relations: [
      { to: 'eff-gradient-animate', desc: '流光与霓虹是暗色系氛围双件套' },
      { to: 'eff-text-gradient', desc: '文字特效家族：一个内流光一个外发光' },
      { to: 'eff-dark-toggle', desc: '霓虹效果通常只在暗色主题下启用' },
    ],
    example: `.neon {
  color: #22d3ee;
  text-shadow:
    0 0 4px  #22d3ee,   /* 贴字亮晕 */
    0 0 12px #22d3ee,   /* 中层扩散 */
    0 0 32px #0891b2;   /* 大范围弥散 */
  animation: breathe 1.8s ease-in-out infinite;
}
@keyframes breathe {
  50% { text-shadow:
    0 0 2px #22d3ee, 0 0 6px #22d3ee, 0 0 16px #0891b2; }
}
`,
    exampleLang: 'css',
    demo: { kind: 'neon-glow' },
  },
  {
    id: 'eff-custom-cursor',
    name: '自定义光标',
    en: 'Custom Cursor',
    cat: 'effects',
    sub: '视觉风格',
    tags: ['风格', '指针跟随', '交互'],
    summary: '自定义光标隐藏系统箭头，用跟随鼠标的圆点或圆环替代，悬停可交互元素时放大变形。',
    detail: `**效果描述**：系统箭头消失，取而代之是一个跟随光标的圆点或圆环；悬停链接时光标放大或变形——上方演示悬停文字即可体验。

**实现原理**：容器 \`cursor: none\` 隐藏原生光标；自定义元素 \`position: fixed\` + \`transform: translate(x, y)\` 跟随，每帧 lerp 插值产生"拖尾"惯性；悬停可交互元素时切换 class。

**适用场景与代表网站**：创意机构、作品集、获奖站；Awwwards 站点标配，Lusion、Studio Freight 都是代表。

**生产建议**：只在 \`pointer: fine\` 下启用；reduced-motion 用户禁用拖尾；用 transform 而非 left/top 避免重排；光标只做视觉层不劫持点击；输入区保留 I 型光标。`,
    relations: [
      { to: 'eff-magnetic', desc: '磁吸与自定义光标是"手感套餐"的固定搭配' },
      { to: 'eff-tilt', desc: '三者共享指针位置驱动这一数据源' },
      { to: 'fe-reflow-refrepaint', desc: '跟随必须走 transform 合成层，避免逐帧重排' },
    ],
    example: `const dot = document.querySelector('.cursor-dot');
let tx = 0, ty = 0, x = 0, y = 0;
window.addEventListener('mousemove', (e) => {
  tx = e.clientX; ty = e.clientY;  // 目标位置
});
(function follow() {
  x += (tx - x) * 0.18;            // lerp 拖尾插值
  y += (ty - y) * 0.18;
  dot.style.transform =
    'translate(' + x + 'px,' + y + 'px)';
  requestAnimationFrame(follow);
})();
`,
    exampleLang: 'js',
    demo: { kind: 'custom-cursor' },
  },
  {
    id: 'eff-noise-texture',
    name: '噪点纹理颗粒感',
    en: 'Noise Texture / Grain',
    cat: 'effects',
    sub: '视觉风格',
    tags: ['风格', '质感', '纹理'],
    summary: '噪点纹理在渐变或纯色上叠加半透明颗粒，消除色带与塑料感，让界面更有胶片质感。',
    detail: `**效果描述**：在渐变或纯色表面覆盖一层细密半透明颗粒，色带被打破、塑料感消失，像老胶片或纸张的肌理——高质感渐变的幕后功臣。

**实现原理**：最常用 SVG \`feTurbulence\` 噪声生成图案，转 data URI 作 \`background-image\` 平铺，配 \`opacity: 0.03~0.08\` 与 \`mix-blend-mode: overlay\`；也可用 PNG/canvas；WebGL 侧是 shader noise（同源思想）。

**适用场景与代表网站**：设计感渐变背景、英雄区、卡片封面；Stripe 首页渐变与 grainy gradient 潮流作品。

**生产建议**：噪点图平铺 128~256px 足够；透明度宁低勿高，超 10% 就显脏；叠在动画渐变上时噪点层保持静止；导出噪点 PNG 更省。`,
    relations: [
      { to: 'eff-gradient-animate', desc: '噪点叠加流动渐变是 grainy gradient 标配' },
      { to: 'eff-glassmorphism', desc: '同为"质感叠加"手法，常组合使用' },
      { to: 'eff-threejs-webgl', desc: 'shader noise 与 feTurbulence 是同源思想' },
    ],
    example: `.grain { position: relative; }
.grain::after {                  /* 静止噪点覆盖层 */
  content: '';
  position: absolute; inset: 0;
  pointer-events: none;
  opacity: .06;                  /* 宁低勿高 */
  mix-blend-mode: overlay;       /* 混合进底色 */
  background-image: url("data:image/svg+xml,%3Csvg \
xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E\
%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/\
%3E%3C/filter%3E%3Crect width='100%25' height='100%25' \
filter='url(%23n)'/%3E%3C/svg%3E");
}
`,
    exampleLang: 'css',
  },
  {
    id: 'eff-dark-toggle',
    name: '暗色模式切换动画',
    en: 'Dark Mode Toggle Animation',
    cat: 'effects',
    sub: '视觉风格',
    tags: ['风格', '主题', 'CSS 变量'],
    summary: '暗色模式切换动画让主题在明暗间平滑过渡或圆形扩散揭开，而非生硬瞬变，凸显精致度。',
    detail: `**效果描述**：点击切换图标，主题不是生硬瞬变：要么全站颜色平滑过渡，要么圆形波纹从按钮扩散揭开新主题。

**实现原理**：基础版：根元素切 \`data-theme\`，颜色走 CSS 变量加过渡；高级版用 View Transitions API 的 \`clip-path: circle()\` 从点击处扩散揭开；图标做旋转翻转过渡。

**适用场景与代表网站**：所有支持暗色模式的产品；GitHub、Vercel、Tailwind 文档的圆点扩散切换。

**生产建议**：颜色一律走 CSS 变量，切换只改变量值；transition 只加颜色属性，别写 \`*\` 全过渡；首帧防闪烁：内联脚本先读 localStorage；尊重 \`prefers-color-scheme\`。`,
    relations: [
      { to: 'fe-css-variables', desc: '主题切换的本质是换一组 CSS 变量值' },
      { to: 'eff-route-transition', desc: '圆形揭示复用 View Transitions API 机制' },
      { to: 'eff-neon-glow', desc: '暗色主题正是霓虹效果的舞台' },
    ],
    example: `// 圆形波纹揭开暗色主题（View Transitions 版）
btn.addEventListener('click', async (e) => {
  const x = e.clientX, y = e.clientY;
  const toggle = () => {
    document.documentElement.dataset.theme =
      isDark() ? 'light' : 'dark';
  };
  if (!document.startViewTransition) return toggle();
  const vt = document.startViewTransition(toggle);
  await vt.ready;
  const r = Math.hypot(innerWidth - x, innerHeight - y);
  document.documentElement.animate(
    { clipPath: ['circle(0 at ' + x + 'px ' + y + 'px)',
                 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)'] },
    { duration: 500, pseudoElement: '::view-transition-new(root)' });
});
`,
    exampleLang: 'js',
  },

  // ==================== 媒体展示 ====================
  {
    id: 'eff-lightbox',
    name: '灯箱',
    en: 'Lightbox',
    cat: 'effects',
    sub: '媒体展示',
    tags: ['媒体', '弹层', '相册'],
    summary: '灯箱点击缩略图后以遮罩加缩放动画展示大图并锁定背景滚动，是相册与作品集的标准查看方式。',
    detail: `**效果描述**：点击缩略图，背景压暗虚化、大图从中心缩放浮现，支持左右切换与 Esc/点击遮罩关闭——上方演示点击任一缩略图即可开合。

**实现原理**：遮罩层 \`position: fixed; inset: 0\` + 半透明黑底（可加 backdrop-blur），内容层 \`scale(0.8)→1\` 弹入；打开时锁背景滚动（\`body.overflow = hidden\`）；焦点移入弹层、Esc 关闭、关闭后焦点归还。

**适用场景与代表网站**：相册、作品集、电商商品图；Unsplash、Medium 的图片查看都是灯箱范式。

**生产建议**：必须处理焦点陷阱（focus trap）与 \`aria-modal\`；大图预加载下一张；移动端支持双指缩放与滑动切换；关闭动画与打开对称，200~300ms。`,
    relations: [
      { to: 'eff-gallery-masonry-hover', desc: '画廊悬停遮罩引导点击，灯箱承接查看' },
      { to: 'eff-carousel', desc: '灯箱内的多图切换就是轮播逻辑' },
      { to: 'eff-glassmorphism', desc: '遮罩加毛玻璃是灯箱的进阶质感' },
    ],
    example: `{open !== null && (
  <motion.div
    className="fixed inset-0 z-50 grid place-items-center bg-black/80"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={close}                        // 点遮罩关闭
  >
    <motion.img
      src={items[open].src}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}   // 缩放浮现
      exit={{ scale: 0.8, opacity: 0 }}
      onClick={(e) => e.stopPropagation()} // 阻止冒泡
    />
  </motion.div>
)}
`,
    exampleLang: 'jsx',
    demo: { kind: 'lightbox' },
  },
  {
    id: 'eff-before-after',
    name: '前后对比滑块',
    en: 'Before/After Comparison Slider',
    cat: 'effects',
    sub: '媒体展示',
    tags: ['媒体', '对比', '交互'],
    summary: '前后对比滑块用可拖动的分割线裁切叠放的两层图像，直观呈现修图、改版或年代对比。',
    detail: `**效果描述**：两张图上下叠放，一条可拖动的白色分割线控制上层图露出的宽度，拖动之间新旧版本无缝切换——上方演示拖动滑块即可对比两个设计版本。

**实现原理**：上层图用 \`clip-path: inset(0 右侧裁掉% 0 0)\` 按比例裁切；拖动交互用一个透明 range input 铺满容器（或 pointer 事件），值同步映射为裁切百分比；分割线与手柄是随值移动的装饰层。

**适用场景与代表网站**：修图软件前后对比（Photoshop 官网）、家装/美妆效果图、网页改版展示、卫星地图年代对比。

**生产建议**：两层图必须严格对齐（同宽高比同裁切）；range input 要 \`aria-label\` 且键盘可调；初始 50% 最直观；移动端容器加 \`touch-action: none\` 防滚动冲突。`,
    relations: [
      { to: 'eff-split-screen', desc: '分屏是并排对比，本效果是叠加裁切对比' },
      { to: 'eff-lightbox', desc: '同为图片查看增强组件' },
      { to: 'eff-image-zoom-lens', desc: '同为图像局部检视类交互' },
    ],
    example: `.ba { position: relative; overflow: hidden; }
.ba img { position: absolute; inset: 0; width: 100%; }

/* 关键：上层按滑块值裁切（JS 把 50% 改成 0~100%） */
.ba-top { clip-path: inset(0 50% 0 0); }

/* 透明 range input 铺满全容器作为拖动热区 */
.ba input { position: absolute; inset: 0;
  width: 100%; height: 100%;
  opacity: 0; cursor: ew-resize; }
`,
    exampleLang: 'css',
    demo: { kind: 'before-after' },
  },
  {
    id: 'eff-marquee',
    name: '无缝走马灯',
    en: 'Seamless Marquee',
    cat: 'effects',
    sub: '媒体展示',
    tags: ['媒体', '循环', '动画'],
    summary: '无缝走马灯让一排内容匀速循环滚动永不间断，通过复制内容加位移 -50% 实现真正无缝。',
    detail: `**效果描述**：一排标签、Logo 或图片匀速向左漂移，首尾无缝衔接永不停歇；鼠标悬停往往暂停——上方演示的标签流即复制两份循环位移。

**实现原理**：把内容**复制两份**放入一行，动画从 \`translateX(0)\` 到 \`-50%\`（正好走过一份的宽度）无限循环；因为两份内容相同，到 -50% 时视觉与起点完全一致，实现无缝；悬停暂停用 \`animation-play-state: paused\`。

**适用场景与代表网站**：合作品牌墙、技能标签流、新闻标题滚动条、弹幕；无数官网的 "Trusted by" Logo 墙。

**生产建议**：内容必须复制整数份且宽度一致，否则接缝跳动；用 transform 动画走合成层；副本加 \`aria-hidden\` 防读屏读两遍；RTL 语言注意方向取反。`,
    relations: [
      { to: 'eff-horizontal-scroll', desc: '走马灯是自动匀速版的横向滚动' },
      { to: 'eff-carousel', desc: '同为内容循环展示，一个连续一个分页' },
      { to: 'eff-performance-budget', desc: '持续循环动画更要守住 transform 合成层' },
    ],
    example: `.marquee { overflow: hidden; }
.marquee-track {
  display: flex; width: max-content;  /* 内容自然撑开 */
  animation: marquee 18s linear infinite;
}
.marquee:hover .marquee-track {
  animation-play-state: paused;       /* 悬停暂停 */
}
/* 内容复制两份，位移 -50% 即无缝循环 */
@keyframes marquee { to { transform: translateX(-50%) } }
`,
    exampleLang: 'css',
    demo: { kind: 'marquee' },
  },
  {
    id: 'eff-coverflow',
    name: '3D 封面流',
    en: 'Coverflow',
    cat: 'effects',
    sub: '媒体展示',
    tags: ['媒体', '3D', '轮播'],
    summary: '3D 封面流把相邻卡片绕 Y 轴旋转缩放并层叠排布，中央卡片朝前，切换时如翻动唱片架。',
    detail: `**效果描述**：中央卡片正面朝前，两侧卡片绕 Y 轴向内旋转、缩小、依次向后层叠，切换时像翻动唱片架一样流转——上方演示点击任意卡片即可把它转到中央。

**实现原理**：每个卡片按与当前索引的偏移量 off 计算：\`x = off * 间距\`、\`rotateY = off * -35deg\`、\`scale = off===0 ? 1 : 0.72\`、\`zIndex = 5 - |off|\`，全部交给 spring 动画插值；容器 \`perspective\` 提供透视深度。

**适用场景与代表网站**：音乐专辑展示、图片精选、角色选择器；iTunes 时代的 Cover Flow 是鼻祖，游戏选人界面常见。

**生产建议**：可视卡片 5~7 张为宜；支持键盘左右与拖拽滑动；两侧卡片保持可点击直达；3D 层数多注意移动端帧率，低性能设备降级为平面轮播。`,
    relations: [
      { to: 'eff-carousel', desc: '封面流是轮播的 3D 强化版' },
      { to: 'eff-tilt', desc: '同样依赖 rotateY 与 perspective 的 3D 变换' },
      { to: 'eff-lightbox', desc: '点击封面常接灯箱查看大图' },
    ],
    example: `{cards.map((_, i) => {
  const off = i - active;              // 与中心卡的偏移
  return (
    <motion.div
      key={i}
      onClick={() => setActive(i)}
      animate={{
        x: off * 48,                   // 横向排开
        rotateY: off * -35,            // 侧卡内旋
        scale: off === 0 ? 1 : 0.72,   // 中心最大
        zIndex: 5 - Math.abs(off),
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    />
  );
})}
`,
    exampleLang: 'jsx',
    demo: { kind: 'coverflow' },
  },
  {
    id: 'eff-carousel',
    name: '轮播图',
    en: 'Carousel',
    cat: 'effects',
    sub: '媒体展示',
    tags: ['媒体', '轮播', 'Banner'],
    summary: '轮播图在固定窗口内按页切换幻灯片，配指示器与循环播放，是首屏 Banner 最通用的形态。',
    detail: `**效果描述**：固定窗口内一屏一屏切换内容，小圆点指示当前页，箭头或拖拽换页，可自动轮播、循环衔接——电商与资讯站第一屏常客。

**实现原理**：轨道容器 \`display: flex\` 装所有 slide，整体 \`translateX(-index * 100%)\` 过渡切换；循环播放：到尾部克隆头部或反向取模；自动播放 setInterval + 悬停暂停 + 隐藏时停止；底层也可用 scroll-snap 实现。

**适用场景与代表网站**：电商首屏 Banner（淘宝、京东）、新闻头条、推荐位；Swiper 是 Web 端事实标准库。

**生产建议**：直接用 Swiper/Embla 别自造轮子（触摸、循环、懒加载边界极多）；自动播放 5s 起且悬停暂停；首屏外 slide 懒加载；补齐 carousel 无障碍标注。`,
    relations: [
      { to: 'eff-marquee', desc: '同为循环展示：轮播分页、走马灯连续' },
      { to: 'eff-coverflow', desc: '封面流是轮播的 3D 变体' },
      { to: 'eff-horizontal-scroll', desc: '用 scroll-snap 实现的横向滚动就是轻量轮播' },
    ],
    example: `let index = 0;
const track = document.querySelector('.track');
const total = track.children.length;

function go(i) {
  index = (i + total) % total;         // 取模循环
  track.style.transform =
    'translateX(-' + index * 100 + '%)';
}
setInterval(() => go(index + 1), 5000);   // 自动轮播
document.querySelector('.next').onclick = () => go(index + 1);
document.querySelector('.prev').onclick = () => go(index - 1);
`,
    exampleLang: 'js',
  },
  {
    id: 'eff-image-zoom-lens',
    name: '放大镜效果',
    en: 'Image Zoom Lens',
    cat: 'effects',
    sub: '媒体展示',
    tags: ['媒体', '电商', '指针跟随'],
    summary: '放大镜效果在鼠标处显示局部放大的镜片或右侧高清跟随视图，电商看图检查细节的标配。',
    detail: `**效果描述**：鼠标在小图上移动，旁边（或跟随光标的方框内）同步显示该区域的高清放大像，像手持放大镜逐寸检查布纹与做工。

**实现原理**：放大层复用同一张高清图作 \`background-image\`，\`background-size\` 设 250% 表示放大 2.5 倍；鼠标位置换算为 0~1 百分比写入 \`background-position\`，让光标所指区域对准视窗；镜片版直接给元素定位加 \`overflow: hidden\`。

**适用场景与代表网站**：电商商品图（淘宝、京东、Amazon 的 hover 放大）、印刷品预览、地图局部查看。

**生产建议**：高清大图必须预加载，否则跟随画面糊一下很掉价；换算基于实际渲染尺寸；移动端换为点击全屏 + 双指缩放；mousemove 用 rAF 合并处理。`,
    relations: [
      { to: 'eff-lightbox', desc: '灯箱内放大镜是电商图查看的完整方案' },
      { to: 'eff-before-after', desc: '同为图像局部检视类交互' },
      { to: 'eff-custom-cursor', desc: '镜片跟随光标的插值思路同源' },
    ],
    example: `lens.addEventListener('mousemove', (e) => {
  const r = lens.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;   // 0~1
  const py = (e.clientY - r.top) / r.height;
  zoom.style.backgroundSize = '250% 250%';     // 放大 2.5 倍
  zoom.style.backgroundPosition =
    (px * 100) + '% ' + (py * 100) + '%';      // 对准光标区域
});
lens.addEventListener('mouseleave', () =>
  zoom.style.backgroundSize = '0 0');          // 移出隐藏
`,
    exampleLang: 'js',
  },
  {
    id: 'eff-gallery-masonry-hover',
    name: '画廊悬停信息遮罩',
    en: 'Gallery Hover Overlay',
    cat: 'effects',
    sub: '媒体展示',
    tags: ['媒体', 'hover', '作品集'],
    summary: '画廊悬停遮罩在鼠标移入图片时自下而上升起半透明信息层，移出即退场，作品集高频手法。',
    detail: `**效果描述**：鼠标移入瀑布流图片，半透明渐变遮罩自下而上升起，托出标题与"查看"按钮；移出即退回，像快门开合。

**实现原理**：遮罩层 \`position: absolute; inset: 0\`，默认 \`translateY(100%)\` 藏在图片底部之外，hover 时归位；背景用 \`linear-gradient(transparent → rgba(0,0,0,.7))\` 保证白字可读；配图片 \`scale(1.05)\` 微放大。

**适用场景与代表网站**：作品集画廊、摄影站、模板市场；Behance、Dribbble 作品卡与摄影个人站。

**生产建议**：触屏与键盘无 hover，改常显半透明或点击进详情兜底；动画 250ms 内；图片加载完再启用 hover；遮罩信息克制，一句话加一个按钮。`,
    relations: [
      { to: 'eff-masonry', desc: '瀑布流画廊是遮罩效果最常落地的容器' },
      { to: 'eff-lightbox', desc: '遮罩上的"查看"按钮通常接灯箱大图' },
      { to: 'eff-hover-lift', desc: '同为 hover 状态反馈，遮罩承载更多信息' },
    ],
    example: `.g-item { position: relative; overflow: hidden; }
.g-item img { transition: transform .4s ease; }
.g-item:hover img { transform: scale(1.05); } /* 微放大 */

.g-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: flex-end;
  padding: 16px;
  background: linear-gradient(transparent 30%,
                              rgba(0, 0, 0, .75));
  transform: translateY(100%);       /* 藏在底部外 */
  transition: transform .3s ease;
}
.g-item:hover .g-overlay { transform: translateY(0); }
`,
    exampleLang: 'css',
  },

  // ==================== 内容组织 ====================
  {
    id: 'eff-accordion',
    name: '手风琴',
    en: 'Accordion',
    cat: 'effects',
    sub: '内容组织',
    tags: ['内容', '折叠', 'FAQ'],
    summary: '手风琴点击标题展开对应内容并收起其他项，高度过渡平滑，FAQ 与设置面板的标配。',
    detail: `**效果描述**：点击标题行，内容平滑展开，再点或其他项收起；箭头图标同步旋转 180°——上方演示即是互斥展开的 FAQ 卡片。

**实现原理**：高度动画是难点：纯 CSS \`max-height\` 需预估上限（易卡顿）；生产方案用 JS 测量 \`scrollHeight\` 写过渡，或 framer-motion \`AnimatePresence\` 支持 \`height: 'auto'\`。

**适用场景与代表网站**：FAQ 页、设置分组、移动端菜单分组、结算页折叠项；Apple 官网 FAQ、各大文档站。

**生产建议**：互斥展开（手风琴）与多开（折叠面板）按需求选择；标题按钮加 \`aria-expanded\`；动画 250~300ms 配 ease-out；键盘 Enter/Space 可触发；内容含图片时加载后重测高度。`,
    relations: [
      { to: 'eff-bottom-sheet', desc: '同为展开收起类容器，方向一个向下一个向上' },
      { to: 'eff-tab-switch', desc: '都是"切换显示内容块"的组织方式' },
      { to: 'eff-expansion-card', desc: '卡片展开是手风琴的空间化变体' },
    ],
    example: `<AnimatePresence initial={false}>
  {open === i && (
    <motion.div
      key="content"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }} // 自适应高度
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      style={{ overflow: 'hidden' }}
    >
      <p>{item.answer}</p>
    </motion.div>
  )}
</AnimatePresence>
`,
    exampleLang: 'jsx',
    demo: { kind: 'accordion' },
  },
  {
    id: 'eff-timeline',
    name: '时间线',
    en: 'Timeline',
    cat: 'effects',
    sub: '内容组织',
    tags: ['内容', '历程', '布局'],
    summary: '时间线以中轴或侧轴线串联节点卡片，可配合滚动逐点点亮，呈现历程、版本或流程。',
    detail: `**效果描述**：一条纵轴串起一枚枚发光节点，节点旁卡片依次排开记录大事记；配合滚动时节点逐个点亮、线条"生长"延伸——上方演示是最简三节点版本。

**实现原理**：结构三件套：轴线（容器 \`border-left\` 或伪元素）、节点（绝对定位圆点 + ring 光晕）、卡片（偏移排布）；"滚动点亮"用 IntersectionObserver 给节点加 class 触发缩放弹入；线条生长用 scaleY（原点在顶部）动画。

**适用场景与代表网站**：公司历程、个人简历、版本 Roadmap、剧情梳理；GitHub 年度贡献、各类产品更新日志页。

**生产建议**：节点垂直对齐卡片标题行；移动端改单侧轴线窄卡片；节点动画一次性触发即可；交替左右布局在窄屏退化为单侧。`,
    relations: [
      { to: 'eff-scroll-reveal', desc: '节点随滚动逐点点亮就是 reveal 的应用' },
      { to: 'eff-stepper', desc: '步骤条是时间线的任务化变体' },
      { to: 'eff-scroll-telling', desc: '时间线配滚动叙事可做出纪录片式历程页' },
    ],
    example: `.timeline {
  position: relative;
  padding-left: 28px;              /* 给轴线留位 */
  border-left: 2px solid #334155;  /* 纵轴 */
}
.t-item { position: relative; margin-bottom: 24px; }
/* 节点：骑在轴线上 */
.t-item::before {
  content: '';
  position: absolute;
  left: -35px; top: 4px;
  width: 12px; height: 12px; border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 0 4px rgba(251, 191, 36, .25); /* 光晕 */
}
`,
    exampleLang: 'css',
    demo: { kind: 'timeline' },
  },
  {
    id: 'eff-bottom-sheet',
    name: '底部抽屉',
    en: 'Bottom Sheet',
    cat: 'effects',
    sub: '内容组织',
    tags: ['内容', '移动端', '手势'],
    summary: '底部抽屉从屏幕底部弹出且支持拖拽跟手与下拉关闭，移动端详情与筛选的标准容器。',
    detail: `**效果描述**：面板从屏幕底边弹起，可上拉展开、下拉收起，松手越过阈值自动吸附到最近状态——上方演示点按钮唤起、下拉即可关闭。

**实现原理**：容器 \`position: absolute; bottom: 0\`，出场 \`y: 100%→0\` spring 过渡；跟手用指针事件或 framer-motion \`drag="y"\` + \`dragConstraints\`，\`onDragEnd\` 按位移与速度判定吸附档位。

**适用场景与代表网站**：移动端详情、筛选面板、分享菜单、地图 App 的地点卡；Google Maps、各大电商 App 的 Web 版。

**生产建议**：把手整块可拖拽才顺手；背景滚动要锁住，面板内滚动与拖拽手势分区处理；速度判定（velocity）比纯位移阈值更直觉；桌面端可退化为居中模态。`,
    relations: [
      { to: 'eff-accordion', desc: '同为展开收起容器，抽屉带手势物理感' },
      { to: 'eff-lightbox', desc: '同为模态弹层，一个居中一个贴底' },
      { to: 'eff-expansion-card', desc: '卡片展开详情后常以抽屉形式承载' },
    ],
    example: `<motion.div
  className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4"
  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
  drag="y"                              // 跟手拖拽
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={{ top: 0, bottom: 0.6 }} // 只允许下拉出弹性
  onDragEnd={(_, info) => {
    // 位移超 60px 或上滑速度够快都判定为关闭
    if (info.offset.y > 60 || info.velocity.y > 500) onClose();
  }}
>
  <div className="mx-auto h-1 w-10 rounded-full bg-slate-400" />
  {/* 面板内容 */}
</motion.div>
`,
    exampleLang: 'jsx',
    demo: { kind: 'bottom-sheet' },
  },
  {
    id: 'eff-progress-ring',
    name: '进度环',
    en: 'Progress Ring',
    cat: 'effects',
    sub: '内容组织',
    tags: ['内容', '进度', 'SVG'],
    summary: '进度环用 SVG 圆环的 stroke-dashoffset 随进度收缩弧长，环形填充直观表达百分比。',
    detail: `**效果描述**：一圈圆环随进度从 0% 涨到目标值，环内数字同步跳动，颜色沿弧线"点亮"——上方演示的百分比环正在持续循环。

**实现原理**：SVG \`<circle>\` 两枚叠放：底环灰色常驻，进度环 \`stroke-dasharray = 周长\`，改 \`stroke-dashoffset = 周长 * (1 - 进度)\` 收缩可见弧长；圆环初始 \`rotate(-90)\` 从顶部开始；环心数字用 count-up 同步。

**适用场景与代表网站**：技能完成度、上传进度、任务完成率、倒计时；GitHub 贡献、学习平台的课程进度环。

**生产建议**：\`stroke-linecap: round\` 让弧端圆润；进度用 transition 或 rAF 补间而非跳变；环色按阈值变化（绿/黄/红）；环心数字加 \`tabular-nums\`。`,
    relations: [
      { to: 'eff-scroll-progress', desc: '同一进度语义的环形形态' },
      { to: 'eff-count-up', desc: '环内数字滚动与环弧收缩同步演出' },
      { to: 'eff-preloader', desc: '环形 Loader 本质就是自动播放的进度环' },
    ],
    example: `const R = 30;
const C = 2 * Math.PI * R;               // 周长 = dasharray
progressRing.style.strokeDasharray = C;
progressRing.style.strokeDashoffset = C; // 初始全隐藏

function setProgress(p) {                // p: 0~1
  progressRing.style.strokeDashoffset = C * (1 - p);
  // 给 stroke-dashoffset 加 CSS transition 即平滑补间
}
/* <circle r="30" fill="none" stroke="#fbbf24"
     stroke-width="7" stroke-linecap="round"
     transform="rotate(-90)" /> */
`,
    exampleLang: 'js',
    demo: { kind: 'progress-ring' },
  },
  {
    id: 'eff-stepper',
    name: '步骤条动画',
    en: 'Stepper Animation',
    cat: 'effects',
    sub: '内容组织',
    tags: ['内容', '表单', '流程'],
    summary: '步骤条把流程拆为节点，完成时打勾、进度线生长到当前步，让多步表单的推进可视化。',
    detail: `**效果描述**：横向一串节点用进度线相连，完成步打勾变绿、当前步高亮呼吸、未来步置灰；点击"下一步"时连接线生长延伸到下一节点，流程感一目了然。

**实现原理**：连接线是节点间的条形元素，进度用 \`transform: scaleX\`（origin 左侧）从 0 到 1 生长；打勾图标用 SVG 描边动画（\`stroke-dashoffset\` 归零）"画"出来；当前步用 ring 脉冲强调。

**适用场景与代表网站**：多步表单（注册、结账流程）、引导向导、工单状态；淘宝/支付宝结算流程、SaaS onboarding。

**生产建议**：步进状态由数据驱动而非 CSS 写死；线生长与图标切换错开 100ms 更有层次；允许点击已完成步回跳；窄屏可只显示"第 n 步 / 共 m 步"紧凑模式。`,
    relations: [
      { to: 'eff-timeline', desc: '时间线是回顾，步骤条是推进' },
      { to: 'eff-progress-ring', desc: '同为进度的可视化表达' },
      { to: 'eff-tab-switch', desc: '步骤内容面板切换复用 Tab 动画逻辑' },
    ],
    example: `.step-line {                    /* 两节点之间的连接线 */
  height: 2px; flex: 1;
  background: #334155;
  transform: scaleX(0);         /* 默认未生长 */
  transform-origin: left center;
  transition: transform .4s ease;
}
.step-line.done { transform: scaleX(1); } /* 已走过的路 */

.step-check path {              /* 对勾描边动画 */
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  transition: stroke-dashoffset .3s ease .1s;
}
.step-check.done path { stroke-dashoffset: 0; }
`,
    exampleLang: 'css',
  },
  {
    id: 'eff-tab-switch',
    name: 'Tab 切换内容动画',
    en: 'Tab Switch Animation',
    cat: 'effects',
    sub: '内容组织',
    tags: ['内容', '切换', '动画'],
    summary: 'Tab 切换在面板间做淡入滑动或共享元素过渡，配合下划线滑动让内容切换连贯不生硬。',
    detail: `**效果描述**：点击 Tab，内容面板淡入加轻微滑动登场，旧面板退场让位；下划线沿导航滑到新选中项，整套动作一气呵成，没有"闪变"感。

**实现原理**：面板切换用"等待式"动画：旧面板 exit 结束后新面板 enter（淡入加轻微位移），framer-motion \`AnimatePresence mode="wait"\` 按 key 切换；滑块式 Tab 用共享元素（\`layoutId\`）让高亮块平滑滑动。

**适用场景与代表网站**：详情页多信息分区、设置面板、登录/注册双 Tab；各大组件库 Tabs、浏览器设置页。

**生产建议**：方向感要一致；面板高度差异大时容器高度也做过渡；非激活面板懒渲染但保留挂载可加速回切；键盘左右键切换并补齐 tablist 系列属性。`,
    relations: [
      { to: 'eff-magic-line', desc: '下划线滑动与面板切换是 Tab 的成套动作' },
      { to: 'eff-page-transition', desc: '等待式切换模式同源，粒度不同' },
      { to: 'eff-accordion', desc: '同为内容块切换组织方式' },
    ],
    example: `<AnimatePresence mode="wait">
  <motion.section
    key={activeTab}                // key 变化触发切换
    initial={{ opacity: 0, x: 16 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -16 }}
    transition={{ duration: 0.22 }}
  >
    {panels[activeTab]}
  </motion.section>
</AnimatePresence>
`,
    exampleLang: 'jsx',
  },
  {
    id: 'eff-expansion-card',
    name: '卡片展开详情',
    en: 'Expansion Card / Shared Element',
    cat: 'effects',
    sub: '内容组织',
    tags: ['内容', '共享元素', '转场'],
    summary: '点击后卡片自身放大过渡成详情面板（共享元素动画），列表到详情无缝衔接不跳变。',
    detail: `**效果描述**：列表里的小卡点击后"长大"为详情视图——位置、尺寸连续过渡而非跳变，仿佛卡片展开了夹层；关闭时缩回原位，像 App Store 的今日卡片。

**实现原理**：共享元素动画（shared element transition）：列表缩略卡与详情大卡声明同一个 \`layoutId\`，framer-motion 在两者挂载/卸载间自动插值；原生对应 View Transitions API。

**适用场景与代表网站**：App Store"今日 App"卡是教科书；瀑布流点开详情、邮件展开详情。

**生产建议**：同一页面 \`layoutId\` 必须唯一；展开后加遮罩并锁背景滚动；大卡内容延迟 100ms 淡入，避免文字挤压；移动端与桌面端分别适配展开尺寸。`,
    relations: [
      { to: 'eff-bento', desc: 'Bento 网格中的大格常做成可展开卡片' },
      { to: 'eff-lightbox', desc: '灯箱是"看大图"，展开卡是"整卡变大"的共享元素版' },
      { to: 'eff-bottom-sheet', desc: '展开后的详情面板也常以抽屉承接' },
    ],
    example: `// 列表小卡与详情大卡共享 layoutId，尺寸位置自动补间
{items.map((it) => (
  <motion.div key={it.id} layoutId={'card-' + it.id}
    onClick={() => setOpenId(it.id)} className="cursor-pointer">
    <img src={it.cover} />
  </motion.div>
))}

{open && (
  <motion.div layoutId={'card-' + open.id}
    className="fixed inset-8 z-50 rounded-2xl bg-white p-6">
    <img src={open.cover} />
    <p>{open.detail}</p>
  </motion.div>
)}
`,
    exampleLang: 'jsx',
  },

  // ==================== 进阶与库选型 ====================
  {
    id: 'eff-gsap',
    name: 'GSAP 动画库',
    en: 'GSAP',
    cat: 'effects',
    sub: '进阶与库选型',
    tags: ['库', '动画', '滚动'],
    summary: 'GSAP 是工业级 JS 动画库，用时间轴编排任意属性动画，ScrollTrigger 是滚动效果标配。',
    detail: `**效果描述**：GSAP 不是视觉特效本身，而是让效果"丝滑可控"的引擎：时间轴串起任意对象的属性，scrub 绑定滚动、stagger 编排群体登场，多数效果的生产版都由它驱动。

**实现原理**：核心是 \`gsap.to/from/fromTo\` + \`timeline\` 时间轴（可顺序并行嵌套）；插件：**ScrollTrigger**（滚动驱动/钉住）、TextPlugin（打字机）等；\`quickTo\` 专攻高频指针跟随。

**适用场景与代表网站**：滚动叙事、复杂编排、SVG 动画；Apple、Nike 宣传页大量使用。

**生产建议**：React 用官方 \`useGSAP\` 管生命周期；图片懒加载后 \`ScrollTrigger.refresh()\`；reduced-motion 时跳过注册；核心免费可商用。`,
    relations: [
      { to: 'eff-lenis', desc: 'Lenis 管滚动惯性，GSAP 管动画编排，黄金搭档' },
      { to: 'eff-scroll-telling', desc: 'ScrollTrigger 是滚动叙事的生产标配' },
      { to: 'eff-parallax', desc: '视差是 GSAP 最常见的应用场景之一' },
    ],
    example: `import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
tl.from('.hero-title', { y: 40, opacity: 0, duration: .6 })
  .from('.hero-cards > *',
        { y: 24, opacity: 0, stagger: .08 }, '<.2')
  .to('.hero-bg', { scale: 1.2, scrollTrigger: {
      trigger: '.hero', scrub: true } });

// 高频指针跟随：quickTo 性能最好
const moveX = gsap.quickTo('.follower', 'x', { duration: .4 });
window.addEventListener('mousemove', (e) => moveX(e.clientX));
`,
    exampleLang: 'js',
  },
  {
    id: 'eff-lenis',
    name: 'Lenis 平滑滚动库',
    en: 'Lenis',
    cat: 'effects',
    sub: '进阶与库选型',
    tags: ['库', '滚动', '手感'],
    summary: 'Lenis 是轻量平滑滚动库，接管原生滚动提供惯性感，并可与 GSAP ScrollTrigger 无缝联动。',
    detail: `**效果描述**：Lenis 接管滚轮与触摸滚动，用插值让页面滑行带惯性、停止带缓出，滚动中的视差与 reveal 都因此更"贵"——平滑滚动的生产级实现库。

**实现原理**：监听 wheel 得到目标位移，rAF 每帧 lerp 逼近目标并写入滚动位置；暴露 scroll 事件供 ScrollTrigger 同步；支持滚动容器豁免（\`data-lenis-prevent\`）。

**适用场景与代表网站**：创意机构官网、作品集、滚动叙事站；Awwwards 榜单大量站点默认开启。

**生产建议**：\`autoRaf\` 或手动 raf 二选一别双开；与 ScrollTrigger 联动记得 update 并关 lagSmoothing；嵌套滚动区加豁免属性；提供开关照顾晕动症用户。`,
    relations: [
      { to: 'eff-smooth-scroll', desc: 'Lenis 是平滑滚动效果的标准实现库' },
      { to: 'eff-gsap', desc: '与 ScrollTrigger 联动是官方推荐用法' },
      { to: 'eff-scroll-telling', desc: '滚动叙事站点几乎都以 Lenis 打底' },
    ],
    example: `import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const lenis = new Lenis({ duration: 1.2 });
lenis.on('scroll', ScrollTrigger.update);  // 与 GSAP 同步

gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);  // 关补偿，避免双重平滑

lenis.scrollTo('#section-2', { offset: -80 }); // 编程式滚动
`,
    exampleLang: 'js',
  },
  {
    id: 'eff-threejs-webgl',
    name: 'Three.js 与 WebGL 背景',
    en: 'Three.js / WebGL Background',
    cat: 'effects',
    sub: '进阶与库选型',
    tags: ['库', 'WebGL', '3D'],
    summary: 'Three.js 封装 WebGL，可在页面绘制 3D 场景与着色器背景，是沉浸式官网的终极武器。',
    detail: `**效果描述**：页面背景是流动的 3D 粒子、随鼠标转头的几何体或折射水面——这是 WebGL 的领地；Three.js 让前端免写裸 GLSL 也能搭建，是 CSS 效果天花板之上那层。

**实现原理**：三件套：**Scene** + **Camera** + **Renderer**，往里加 Mesh（几何体 + 材质）与灯光，rAF 循环渲染；进阶用 **ShaderMaterial** 写 GLSL 实现噪声、折射等 CSS 做不到的效果。

**适用场景与代表网站**：品牌沉浸式官网、3D 产品展示、数据可视化大屏；Apple 发布会 3D 展示、Bruno Simon 的作品集。

**生产建议**：模型用 Draco 压缩 + KTX2 纹理；React 集成选 React Three Fiber；移动端降级粒子数、关阴影；离屏暂停渲染循环节能；留静态图兜底。`,
    relations: [
      { to: 'eff-performance-budget', desc: 'WebGL 场景是最需要性能预算的效果' },
      { to: 'eff-parallax', desc: '3D 场景中的相机移动即高配版视差' },
      { to: 'eff-noise-texture', desc: 'shader noise 与 SVG 噪点是同源思想' },
    ],
    example: `import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, w / h, .1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
container.appendChild(renderer.domElement);
camera.position.z = 5;

const mesh = new THREE.Mesh(
  new THREE.TorusGeometry(1, .4, 32, 64),
  new THREE.MeshNormalMaterial()   // 彩色法线材质
);
scene.add(mesh);
(function loop(t) {
  mesh.rotation.x = t * .0005;     // 随时间旋转
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
})(0);
`,
    exampleLang: 'js',
  },
  {
    id: 'eff-performance-budget',
    name: '动画性能预算与合成层',
    en: 'Animation Performance Budget & Compositing',
    cat: 'effects',
    sub: '进阶与库选型',
    tags: ['性能', '合成层', '优化'],
    summary: '动画性能预算要求只动画 transform/opacity、控制合成层数量，守住每帧 16.7ms 让效果丝滑不掉帧。',
    detail: `**效果描述**："性能预算"看不见摸不着，却决定效果是丝滑还是卡顿：只动画该动的属性、只开必要合成层、每帧预算 16.7ms——所有页面效果的质量底线。

**实现原理**：渲染流水线 Layout → Paint → Composite：**transform/opacity** 走合成器，是最便宜的动画属性；\`top/width\` 触发重排、\`color\` 触发重绘。

**适用场景与代表网站**：所有动画的验收标准；Chrome DevTools 的 Performance + Layers 面板是检验工具。

**生产建议**：动画只碰 transform/opacity；滚动/指针事件 passive + rAF 合并；长列表虚拟化；用 rAF 而非 setInterval；上线后盯帧率监控（INP）。`,
    relations: [
      { to: 'fe-reflow-refrepaint', desc: '重排重绘正是性能预算要规避的成本来源' },
      { to: 'fe-event-loop', desc: 'rAF 与事件循环决定每帧 16.7ms 怎么花' },
      { to: 'eff-gsap', desc: 'GSAP 的快速跟随与 ticker 都按合成层友好设计' },
    ],
    example: `/* 只动画合成属性：transform / opacity */
.card {
  transition: transform .3s ease, opacity .3s ease;
  will-change: transform;  /* 提示提升合成层（别滥用） */
}
.card:hover { transform: translateY(-6px) scale(1.02); }

/* 反例：改 width/top 会逐帧重排，动画必卡 */
/* .bad { transition: width .3s; width: 100px; } */
/* .bad:hover { width: 200px; }  ← 禁止这样写 */
`,
    exampleLang: 'css',
  },
];
