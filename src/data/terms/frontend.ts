import type { Term } from './types';

/** frontend 领域术语：页面结构与渲染 / 布局与样式 / 组件化与框架 / 工程与性能 */
export const FE_FRONTEND: Term[] = [
  // ==================== 页面结构与渲染 ====================
  {
    id: 'fe-dom',
    name: 'DOM',
    en: 'Document Object Model',
    cat: 'frontend',
    sub: '页面结构与渲染',
    tags: ['HTML', '树结构', '浏览器 API'],
    summary: 'DOM 是浏览器将 HTML 解析成的树形对象模型，JavaScript 通过它读取和修改页面结构与内容。',
    detail: `**是什么**：DOM（文档对象模型）是浏览器把 HTML/XML 文档解析成一棵节点树后暴露的编程接口，每个标签、属性、文本都是节点对象。

**解决什么问题**：HTML 是静态文本，DOM 把它变成可被脚本查询和修改的结构化对象，页面才能"动起来"。

**如何工作**：
- 解析 HTML 生成以 document 为根的节点树，元素与文本各成节点
- 提供 querySelector、getElementById 等查询 API 遍历与定位节点
- 增删改节点或属性会同步反映到后续渲染流程

**误区与最佳实践**：直接操作 DOM 代价高昂，是前端性能问题的主要来源；框架的 Virtual DOM 本质就是为了减少真实 DOM 操作，批量读写、事件委托是常用优化手段。`,
    relations: [
      { to: 'fe-virtual-dom', desc: 'Virtual DOM 在内存中模拟 DOM，Diff 后批量最小化真实 DOM 操作' },
      { to: 'fe-cssom', desc: 'DOM 与 CSSOM 合成渲染树，决定页面最终绘制结果' },
      { to: 'fe-csp', desc: 'DOM 是 XSS 注入的主要目标面，CSP 从浏览器侧兜底限制注入脚本执行' },
    ],
    example: `<div id="app">
  <p>hello</p>
</div>
<script>
  const app = document.getElementById('app');
  const p = document.createElement('p');
  p.textContent = '由 JS 动态创建的节点';
  app.appendChild(p);
  // app 现在有 3 个子节点：文本节点 + 两个 <p>
  console.log(app.childNodes.length);
</script>`,
    exampleLang: 'html',
    interview: '高频考点：DOM 事件模型（捕获/冒泡/事件委托）、为什么用 DocumentFragment 批量插入更快。',
  },
  {
    id: 'fe-bom',
    name: 'BOM',
    en: 'Browser Object Model',
    cat: 'frontend',
    sub: '页面结构与渲染',
    tags: ['浏览器', 'window', 'API'],
    summary: 'BOM 是浏览器提供的 window 对象体系，让脚本访问窗口、导航、定时器、屏幕等浏览器能力。',
    detail: `**是什么**：BOM（浏览器对象模型）泛指浏览器暴露给 JS 的 window 及其附属对象：location、navigator、history、screen、定时器、弹窗等。

**解决什么问题**：DOM 只管文档内容，BOM 负责文档之外的浏览器环境交互——跳转页面、前进后退、获取屏幕信息、调度延时任务。

**关键点**：
- window 是全局对象，全局变量即其属性
- location 控制地址与跳转，history 管理会话历史栈
- setTimeout/setInterval 由浏览器事件循环调度

**提示**：BOM 没有 DOM 那样的统一标准，各浏览器实现存在差异；SPA 的前端路由正是大量依赖 BOM 的 history API 实现的。`,
    relations: [
      { to: 'fe-dom', desc: 'DOM 管文档内容，BOM 管浏览器环境，二者共同构成浏览器端 JS 的编程面' },
      { to: 'fe-event-loop', desc: 'setTimeout 等定时器是 BOM 提供的典型宏任务来源' },
      { to: 'fe-client-routing', desc: '前端路由基于 BOM 的 history 与 location API 实现无刷新跳转' },
    ],
  },
  {
    id: 'fe-semantic',
    name: '语义化标签',
    en: 'Semantic HTML',
    cat: 'frontend',
    sub: '页面结构与渲染',
    tags: ['HTML', '可访问性', 'SEO'],
    summary: '语义化标签是用 header、main、article 等有含义的 HTML 标签组织页面，利于 SEO 与可访问性。',
    detail: `**是什么**：语义化标签是 HTML5 提供的、自带含义的标签：header、nav、main、article、section、aside、footer 等，用来替代满屏无意义的 div。

**解决什么问题**：div + class 无法表达结构含义；语义化让搜索引擎、屏幕阅读器、爬虫直接"读懂"页面骨架，提升 SEO 与无障碍体验。

**关键点**：
- 一个页面通常只有一个 main，导航区域用 nav
- 按内容含义选标签，而不是按显示效果选
- 配合 alt、aria-* 属性构成完整的可访问性方案

**误区**：语义化不改变默认样式，需要 CSS 重置后再设计；用 section 或 div 无脑嵌套等于没有语义化。`,
    relations: [
      { to: 'fe-dom', desc: '语义化标签解析成结构清晰的 DOM 树，便于脚本与辅助技术定位内容' },
      { to: 'fe-ssr', desc: 'SSR 输出完整语义化 HTML，对 SEO 与首屏可读性收益最大' },
    ],
    example: `<body>
  <header><h1>CodeQuest 术语百科</h1></header>
  <nav><a href="/terms">全部术语</a></nav>
  <main>
    <article>
      <h2>什么是 DOM</h2>
      <p>DOM 是……</p>
    </article>
    <aside>相关术语推荐</aside>
  </main>
  <footer>© 智码 CodeQuest</footer>
</body>`,
    exampleLang: 'html',
    interview: '面试常问：语义化对 SEO 与无障碍的意义；strong 与 b、em 与 i 的语义区别。',
  },
  {
    id: 'fe-box-model',
    name: '盒模型',
    en: 'CSS Box Model',
    cat: 'frontend',
    sub: '页面结构与渲染',
    tags: ['CSS', '布局基础'],
    summary: '盒模型规定每个元素由 content、padding、border、margin 四层组成，是 CSS 布局的基础。',
    detail: `**是什么**：CSS 盒模型把每个元素看作一个矩形盒子，从内到外依次是内容、内边距、边框、外边距。

**解决什么问题**：浏览器需要统一规则决定盒子的总尺寸与相邻盒子的间距，所有布局体系都建立在盒模型之上。

**关键点**：
- 标准盒模型：width 只含 content，总宽还要加 padding 与 border
- box-sizing: border-box 让 width 包含 padding 与 border，尺寸更直观
- 相邻块级元素的垂直 margin 会塌陷合并取较大值

**最佳实践**：全局设置 * { box-sizing: border-box } 是现代项目标配；排查布局先看开发者工具的盒子分层图。`,
    relations: [
      { to: 'fe-bfc', desc: 'BFC 规则解释了 margin 塌陷等盒模型的默认行为' },
      { to: 'fe-reflow-refrepaint', desc: '修改盒模型的尺寸属性会触发重排，是布局抖动的常见来源' },
      { to: 'fe-flexbox', desc: 'Flex/Grid 对盒子的伸缩与排布仍以盒模型尺寸计算为基础' },
    ],
    example: `* { box-sizing: border-box; }

.card {
  width: 300px;          /* border-box 下已包含 padding 与 border */
  padding: 16px;
  border: 1px solid #ddd;
  margin: 24px;          /* 与相邻元素的最小间距 */
}

/* 标准盒模型下总宽 = 300 + 16*2 + 1*2 = 334px
   border-box 下总宽 = 300px，内容区自动压缩 */`,
    exampleLang: 'css',
    interview: '高频：标准盒模型与 border-box 的区别；margin 塌陷的触发条件与解决方案。',
  },
  {
    id: 'fe-bfc',
    name: 'BFC',
    en: 'Block Formatting Context',
    cat: 'frontend',
    sub: '页面结构与渲染',
    tags: ['CSS', '布局'],
    summary: 'BFC（块级格式化上下文）是一块独立渲染区域，内部布局不影响外部，常用于清除浮动与阻止 margin 塌陷。',
    detail: `**是什么**：BFC 是 CSS 的一块独立布局区域：内部盒子按特定规则排布，与外部互不干扰。

**解决什么问题**：浮动溢出、margin 塌陷、文字环绕等"诡异"布局行为，本质都是缺少 BFC 隔离。

**触发方式**：
- overflow: hidden / auto（非 visible）
- display: flow-root（专用声明，无副作用）
- float、position: absolute、flex/grid 子项等

**典型应用**：父元素设 display: flow-root 包住浮动子元素；相邻元素建 BFC 阻止 margin 合并。

**误区**：overflow: hidden 会裁剪内容并阻碍 sticky 定位，优先用 flow-root。`,
    relations: [
      { to: 'fe-box-model', desc: 'BFC 规则解释了 margin 塌陷等盒模型的默认行为' },
      { to: 'fe-flexbox', desc: 'Flex/Grid 容器建立独立格式化上下文，隔离思想与 BFC 一脉相承' },
    ],
  },
  {
    id: 'fe-reflow-refrepaint',
    name: '重排与重绘',
    en: 'Reflow & Repaint',
    cat: 'frontend',
    sub: '页面结构与渲染',
    tags: ['性能', '渲染'],
    summary: '重排是几何属性变化引起布局重新计算，重绘是外观变化重新上色；重排必然触发重绘，代价更高。',
    detail: `**是什么**：在浏览器渲染流水线中，布局（Layout）阶段重新计算元素几何信息叫重排，绘制（Paint）阶段重新生成像素叫重绘。

**为什么重要**：两者都在主线程执行，频繁触发会让页面掉帧卡顿，是前端性能优化的核心靶点。

**触发规则**：
- 改几何属性（width、top、font-size）→ 重排 + 重绘
- 只改颜色、背景等外观 → 仅重绘
- 最危险的是读写交替：改样式后立刻读 offsetTop 会强制同步重排

**最佳实践**：批量修改（改 class 或用文档片段）、读写分离、动画优先使用 transform 与 opacity——它们走合成层，跳过重排与重绘。`,
    relations: [
      { to: 'fe-cssom', desc: '样式变化经 CSSOM 重新计算后进入重排与重绘流程' },
      { to: 'fe-dom', desc: '增删改 DOM 节点是重排的主要触发源之一' },
      { to: 'fe-lazy-loading', desc: '图片懒加载需配合占位尺寸，否则加载完成会引发反复重排' },
    ],
    interview: '高频：为什么 transform 动画不触发重排；如何用 requestAnimationFrame 合并读写避免强制同步布局。',
  },
  {
    id: 'fe-cssom',
    name: 'CSSOM',
    en: 'CSS Object Model',
    cat: 'frontend',
    sub: '页面结构与渲染',
    tags: ['CSS', '渲染'],
    summary: 'CSSOM 是浏览器把所有样式表解析成的样式规则树，与 DOM 合成渲染树后决定每个节点的最终样式。',
    detail: `**是什么**：CSSOM 是浏览器解析 CSS（style 标签、外链样式表）后构建的样式规则树，相当于 CSS 的"DOM 版本"。

**为什么重要**：CSS 是渲染阻塞资源——CSSOM 构建完成前浏览器不会渲染页面；JS 也可能读取它（getComputedStyle），形成"JS 阻塞 CSS"的连带关系。

**如何工作**：
- 解析 CSS 生成规则树，按层叠规则（来源、优先级、顺序）计算每个节点的最终样式
- 渲染树 = DOM 节点 + 匹配的 CSSOM 样式（排除不可见节点）
- 选择器从右向左匹配，深层嵌套选择器更慢

**最佳实践**：关键 CSS 内联、其余样式异步加载可缩短首次渲染；控制选择器层级深度。`,
    relations: [
      { to: 'fe-dom', desc: 'DOM 与 CSSOM 合成渲染树，决定页面最终绘制结果' },
      { to: 'fe-reflow-refrepaint', desc: 'CSSOM 样式计算结果变化后触发重排与重绘' },
    ],
  },
  {
    id: 'fe-event-loop',
    name: 'Event Loop',
    en: 'Event Loop',
    cat: 'frontend',
    sub: '页面结构与渲染',
    tags: ['JS 运行时', '异步'],
    summary: 'Event Loop 是 JS 的调度机制：主线程执行完同步代码后，循环取微任务、再取宏任务执行，实现单线程异步。',
    detail: `**是什么**：Event Loop 是 JavaScript 运行时的调度机制。JS 单线程，异步任务由宿主环境（浏览器/Node）管理，事件循环负责在调用栈清空后按规则取任务执行。

**解决什么问题**：让单线程语言也能不阻塞地处理网络 IO、定时器与用户交互。

**执行规则**：
- 先跑完全部同步代码（调用栈清空）
- 清空整个微任务队列（Promise.then、queueMicrotask）
- 取一个宏任务（setTimeout、DOM 事件、IO）→ 再清微任务 → 循环往复
- 宏任务之间可能插入页面渲染

**误区**：setTimeout(fn, 0) 并非立即执行，至少要等当前代码与所有微任务结束；长时间运行的同步任务会阻塞渲染帧导致掉帧。`,
    relations: [
      { to: 'fe-microtask-macrotask', desc: '微任务/宏任务是事件循环调度的两类任务，清空规则是其核心' },
      { to: 'fe-web-worker', desc: 'Worker 提供独立线程跑重计算，避免堵塞主线程的事件循环' },
      { to: 'fe-debounce-throttle', desc: '防抖节流基于事件循环的定时器宏任务控制事件触发频率' },
    ],
    example: `console.log('1 同步');

setTimeout(() => console.log('4 宏任务'), 0);

Promise.resolve().then(() => console.log('3 微任务'));

console.log('2 同步');

// 输出顺序：1 → 2 → 3 → 4
// 规则：同步代码 → 清空微任务队列 → 取一个宏任务`,
    exampleLang: 'js',
    interview: '高频：给一段混合 setTimeout/Promise/async 的代码说出输出顺序；requestAnimationFrame 在事件循环中的位置。',
  },
  {
    id: 'fe-microtask-macrotask',
    name: '微任务与宏任务',
    en: 'Microtask & Macrotask',
    cat: 'frontend',
    sub: '页面结构与渲染',
    tags: ['异步', '事件循环'],
    summary: '宏任务如 setTimeout、DOM 事件回调，微任务如 Promise 回调；每执行一个宏任务前会先清空全部微任务。',
    detail: `**是什么**：事件循环中的两类异步任务。宏任务：setTimeout/setInterval、I/O、UI 事件回调；微任务：Promise.then/catch/finally、queueMicrotask、MutationObserver。

**核心规则**：
- 每执行完一个宏任务，立即清空整个微任务队列，再取下一个宏任务
- 微任务总能"插队"到下一个宏任务之前
- async/await 的延续本质是微任务

**为什么重要**：理解渲染时机（宏任务之间才可能渲染）、解释"Promise 比 setTimeout 先执行"、排查状态更新与 DOM 渲染的时序问题，都靠这对概念。

**误区**：微任务里不断派生微任务会饿死宏任务，导致页面卡死。`,
    relations: [
      { to: 'fe-event-loop', desc: '事件循环以"执行宏任务 → 清空微任务"为节拍调度两类任务' },
      { to: 'fe-dom', desc: 'DOM 事件回调是典型宏任务，MutationObserver 回调属于微任务' },
    ],
    interview: '高频：Promise 与 setTimeout 的执行顺序；Node 中 process.nextTick 与微任务的优先级差异。',
  },
  {
    id: 'fe-csp',
    name: 'CSP',
    en: 'Content Security Policy',
    cat: 'frontend',
    sub: '页面结构与渲染',
    tags: ['安全', 'HTTP 头', 'XSS'],
    summary: 'CSP（内容安全策略）通过声明允许的脚本与资源来源，从浏览器侧兜底防御 XSS 等注入攻击。',
    detail: `**是什么**：CSP（内容安全策略）是浏览器执行的安全机制：页面通过 HTTP 响应头（或 meta 标签）声明哪些来源的脚本、样式、图片等资源可以加载与执行。

**解决什么问题**：XSS 的本质是"不可信脚本被当作可信代码执行"；即便攻击者成功注入了脚本，CSP 也会因其来源不在白名单而拒绝运行，是纵深防御的关键一层。

**关键指令**：
- default-src / script-src / img-src：限制各类资源来源
- 'unsafe-inline'：放行内联脚本，会削弱防护，避免使用
- report-to：把违规事件上报给服务端

**最佳实践**：用 nonce 或 hash 精确放行可信脚本；先以 Report-Only 模式观察后再强制。`,
    relations: [
      { to: 'fe-dom', desc: 'DOM 是 XSS 注入的主要目标面，CSP 在浏览器侧兜底限制注入脚本' },
      { to: 'net-http', desc: 'CSP 策略通常由 HTTP 响应头下发，meta 方式仅作补充' },
      { to: 'fe-ssr', desc: 'SSR 拼接 HTML 时更易引入注入点，需配合 CSP 做纵深防御' },
    ],
    example: `# 通过 HTTP 响应头下发的 CSP 策略
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.example.com 'nonce-abc123';
  style-src 'self';
  img-src 'self' data:;
  report-to csp-endpoint`,
    exampleLang: 'http',
    interview: '实践建议：上线前用 Report-Only 模式收集违规报告逐步收紧；CSP 不能替代输入转义与输出编码。',
  },

  // ==================== 布局与样式 ====================
  {
    id: 'fe-flexbox',
    name: 'Flexbox',
    en: 'Flex Layout',
    cat: 'frontend',
    sub: '布局与样式',
    tags: ['CSS', '布局'],
    summary: 'Flexbox 是一维弹性布局模型，让容器沿主轴分配子项空间，轻松实现居中、等分与自适应排列。',
    detail: `**是什么**：Flexbox（弹性盒布局）是 CSS3 的一维布局模型：容器设 display: flex 后，子项沿主轴排列，可灵活控制方向、对齐与空间分配。

**解决什么问题**：传统浮动实现垂直居中、两端对齐都很别扭；Flex 用几行声明即可搞定。

**关键属性**：
- 容器：flex-direction（主轴方向）、justify-content（主轴对齐）、align-items（交叉轴对齐）、gap
- 子项：flex-grow / flex-shrink / flex-basis 控制伸缩比例
- 主轴随 direction 变化，对齐方向跟着变

**实践**：一维场景（导航栏、工具条、卡片排列）优先 Flex；复杂二维网格交给 Grid。`,
    relations: [
      { to: 'fe-grid', desc: 'Flex 管一维排列、Grid 管二维网格，是现代布局的两大支柱' },
      { to: 'fe-responsive', desc: '弹性伸缩能力是响应式布局的基础工具之一' },
      { to: 'fe-bfc', desc: 'Flex 容器建立独立格式化上下文，内部浮动失效' },
    ],
    example: `.toolbar {
  display: flex;
  justify-content: space-between; /* 主轴两端对齐 */
  align-items: center;            /* 交叉轴垂直居中 */
  gap: 8px;
}

.toolbar .logo   { flex: none; }
.toolbar .search { flex: 1; }   /* 占据剩余全部空间 */`,
    exampleLang: 'css',
    interview: '高频：flex: 1 展开是哪三个属性；flex-direction: column 后 justify-content 与 align-items 的行为变化。',
  },
  {
    id: 'fe-grid',
    name: 'Grid 布局',
    en: 'CSS Grid Layout',
    cat: 'frontend',
    sub: '布局与样式',
    tags: ['CSS', '布局'],
    summary: 'Grid 是二维网格布局模型，同时定义行与列，适合页面骨架与复杂卡片阵列的精确布局。',
    detail: `**是什么**：Grid（网格布局）是 CSS 的二维布局模型：容器按行与列划分网格，子项可精确放置到指定网格区域。

**解决什么问题**：Flex 只能沿一个轴排布，页面骨架与不等宽卡片阵列用 Flex 需层层嵌套，Grid 一次声明即可完成。

**关键属性**：
- grid-template-columns / rows：定义轨道，支持 fr 弹性单位
- gap：行列间距
- grid-column / grid-row：子项跨行跨列放置
- repeat(auto-fill, minmax(200px, 1fr)) 实现自适应列数

**实践**：页面骨架与二维阵列用 Grid，容器内部一维排列用 Flex；Grid 与 Flex 嵌套是现代布局的标准姿势。`,
    relations: [
      { to: 'fe-flexbox', desc: '一维 Flex 与二维 Grid 互补，嵌套组合使用' },
      { to: 'fe-responsive', desc: 'minmax + auto-fill 让网格随视口宽度自适应增减列数' },
      { to: 'fe-media-query', desc: '媒体查询切换 grid-template 定义，实现响应式页面骨架' },
    ],
    example: `.layout {
  display: grid;
  grid-template-columns: 240px 1fr; /* 侧栏 + 主体 */
  grid-template-rows: 64px 1fr auto;
  gap: 16px;
}

.layout .cards {
  display: grid;
  /* 列数随容器宽度自动变化，每列最小 200px */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}`,
    exampleLang: 'css',
  },
  {
    id: 'fe-responsive',
    name: '响应式设计',
    en: 'Responsive Design',
    cat: 'frontend',
    sub: '布局与样式',
    tags: ['布局', '移动端'],
    summary: '响应式设计让同一页面通过弹性布局、媒体查询与相对单位，自适应手机到桌面的各种屏幕尺寸。',
    detail: `**是什么**：响应式设计是"一份代码适配所有设备"的方案：布局、字号、图片随视口尺寸与设备能力自动调整。

**三大基石**：
- 弹性布局：Flex/Grid 配合 fr、百分比与相对单位（rem、vw）
- 媒体查询：按断点切换样式
- 弹性媒体：图片 max-width: 100%，srcset 按屏幕选图

**为什么重要**：移动流量已过半，维护多套页面成本高昂；响应式让一套 UI 覆盖手机到桌面。

**误区**：只做"桌面版缩小"不算响应式——移动端应有自己的信息优先级与触控目标尺寸；断点应由内容撑破点决定，而非绑定具体机型。`,
    relations: [
      { to: 'fe-media-query', desc: '媒体查询是响应式切换断点样式的核心机制' },
      { to: 'fe-viewport', desc: 'meta viewport 声明是移动端响应式的第一步' },
      { to: 'fe-grid', desc: 'Grid 的 minmax/auto-fill 天然支撑自适应网格' },
    ],
    interview: '实践建议：移动优先（min-width 断点）优于桌面优先；用 rem 与视口单位构建流式排版。',
  },
  {
    id: 'fe-viewport',
    name: 'Viewport',
    en: 'Viewport',
    cat: 'frontend',
    sub: '布局与样式',
    tags: ['移动端', 'CSS'],
    summary: 'Viewport 是页面可视区域；移动端需 meta viewport 声明按设备宽度布局，否则被 980px 缩放。',
    detail: `**是什么**：视口是用户看到页面的窗口区域。桌面端即浏览器窗口；移动端则分化出布局视口（默认约 980px）、视觉视口（实际可见区域）与理想视口（设备宽度）。

**解决什么问题**：为兼容老页面，手机浏览器默认用 980px 宽的布局视口再整体缩放，导致未适配页面字小难读；meta viewport 让开发者声明"按设备宽度布局"。

**关键声明**：
- width=device-width：布局视口等于理想视口
- initial-scale=1：初始不缩放
- viewport-fit=cover：适配刘海屏等异形屏

**误区**：禁用 user-scalable 会伤害无障碍体验；固定 px 尺寸加整体缩放不是真正的响应式。`,
    relations: [
      { to: 'fe-responsive', desc: 'viewport 声明是移动端响应式方案的第一步' },
      { to: 'fe-media-query', desc: 'width=device-width 后媒体查询断点才按真实设备宽度生效' },
      { to: 'fe-bom', desc: 'window.innerWidth 与 visualViewport 提供视口尺寸的 JS 读取能力' },
    ],
    example: `<head>
  <!-- 布局视口 = 设备宽度，初始缩放 1，适配刘海屏 -->
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, viewport-fit=cover"
  >
</head>
<style>
  /* 配合视口单位实现全宽头部 */
  header { width: 100vw; height: 20vh; }
</style>`,
    exampleLang: 'html',
  },
  {
    id: 'fe-css-variables',
    name: 'CSS 变量',
    en: 'CSS Custom Properties',
    cat: 'frontend',
    sub: '布局与样式',
    tags: ['CSS', '主题'],
    summary: 'CSS 变量（自定义属性）以 --name 声明可复用的值，支持继承与运行时修改，是主题切换的基石。',
    detail: `**是什么**：CSS 自定义属性用 --name: value 声明、var(--name) 使用，值可被 JS 运行时读写，并沿 DOM 树继承。

**解决什么问题**：颜色、间距、圆角散落在各处难以统一；预处理器变量编译后是死值、无法运行时换肤——原生 CSS 变量两样都解决。

**关键点**：
- 作用域遵循 CSS 继承：:root 上定义即全局可用
- JS 通过 element.style.setProperty 动态改值，实现一键换主题
- 可参与 calc() 计算构建间距体系

**最佳实践**：建立 --color-*、--space-* 等语义化变量体系；用 var(--primary, #06f) 提供降级默认值；组件库常用变量对外暴露定制入口。`,
    relations: [
      { to: 'fe-media-query', desc: '媒体查询内重定义变量，即可按断点或深色模式整站换肤' },
      { to: 'fe-responsive', desc: '配合 rem 等相对单位构建可伸缩的间距与字号体系' },
      { to: 'fe-component', desc: '组件库常用 CSS 变量作为主题定制的外部接口' },
    ],
    example: `:root {
  --color-primary: #2563eb;
  --space-unit: 8px;
}

.card {
  padding: calc(var(--space-unit) * 2);
  border-color: var(--color-primary);
}

/* JS 一行切换主题 */
// document.documentElement.style
//   .setProperty('--color-primary', '#16a34a');`,
    exampleLang: 'css',
  },
  {
    id: 'fe-media-query',
    name: '媒体查询',
    en: 'Media Query',
    cat: 'frontend',
    sub: '布局与样式',
    tags: ['CSS', '响应式'],
    summary: '媒体查询按视口宽度、方向、用户偏好等条件选择性应用样式，是响应式切换断点的核心机制。',
    detail: `**是什么**：媒体查询（@media）让一段样式只在满足特定条件时生效：视口宽度、屏幕方向、分辨率，以及用户偏好（深色模式、减少动效）等。

**解决什么问题**：同一份 CSS 需要在不同设备上呈现不同布局，媒体查询提供了"样式条件分支"能力。

**关键写法**：
- @media (min-width: 768px)：移动优先的桌面增强
- prefers-color-scheme: dark：适配系统深色模式
- prefers-reduced-motion：尊重"减少动效"偏好

**最佳实践**：断点按内容撑破点定义，3-5 个足够，不追随具体机型；配合 CSS 变量集中管理各断点的样式差异。`,
    relations: [
      { to: 'fe-responsive', desc: '媒体查询是响应式设计三大基石之一' },
      { to: 'fe-viewport', desc: 'width=device-width 让查询条件按真实设备宽度判断' },
      { to: 'fe-css-variables', desc: '在查询块中重定义变量即可实现按断点换肤' },
    ],
    example: `/* 移动优先：默认单列 */
.cards { display: grid; gap: 12px; }

/* 平板及以上：两列 */
@media (min-width: 768px) {
  .cards { grid-template-columns: 1fr 1fr; }
}

/* 桌面：三列 */
@media (min-width: 1024px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}

/* 跟随系统深色模式 */
@media (prefers-color-scheme: dark) {
  body { background: #111; color: #eee; }
}`,
    exampleLang: 'css',
  },

  // ==================== 组件化与框架 ====================
  {
    id: 'fe-component',
    name: '组件',
    en: 'Component',
    cat: 'frontend',
    sub: '组件化与框架',
    tags: ['组件化', '架构'],
    summary: '组件是 UI 的独立可复用单元，封装结构、样式与逻辑，通过输入输出接口组合构建复杂界面。',
    detail: `**是什么**：组件是把页面拆解出的独立单元：封装自己的模板（结构）、样式与逻辑，对外暴露输入输出接口，可嵌套、可复用。

**解决什么问题**：过程式操作 DOM 难以维护、无法复用；组件化让 UI 像乐高一样拼装，局部状态局部管理，团队可并行开发互不干扰。

**关键特征**：
- 封装性：内部实现对外不可见
- 输入输出：Props 进、事件/回调出
- 组合复用：小组件拼装成大页面

**实践**：设计组件先想清楚 Props 契约与职责边界；一个组件只做一件事，超过约 300 行就该拆分；按 UI 组件/容器组件/业务组件分层组织。`,
    relations: [
      { to: 'fe-props', desc: 'Props 是组件对外的输入契约' },
      { to: 'fe-state', desc: 'State 是组件内部私有、可变的数据，两者共同驱动渲染' },
      { to: 'fe-virtual-dom', desc: '主流框架用 Virtual DOM 描述组件渲染结果并高效更新' },
    ],
    interview: '实践建议：受控与非受控是组件输入设计的分水岭；无头组件（Headless）把逻辑与样式分离提升复用性。',
  },
  {
    id: 'fe-props',
    name: 'Props',
    en: 'Properties',
    cat: 'frontend',
    sub: '组件化与框架',
    tags: ['组件化', '数据流'],
    summary: 'Props 是父组件传给子组件的只读输入，构成组件间自上而下的单向数据流。',
    detail: `**是什么**：Props（properties）是父组件向子组件传递数据的机制：子组件声明所需属性，父组件以标签属性形式传入，子组件内部只读不可直接修改。

**解决什么问题**：让组件可配置、可复用——同一个 Button 传不同文案与类型即可复用；同时确立单向数据流，数据来源清晰可追溯。

**关键点**：
- 单向数据流：数据自上而下流动，子组件通过回调通知父组件
- 直接修改 Props 是反模式：应拷贝为 State 或触发父组件更新
- TypeScript 类型即 Props 契约的保障

**误区**：深层逐级透传（prop drilling）让中间组件沦为管道；此时应拆分组件或引入状态管理。`,
    relations: [
      { to: 'fe-component', desc: 'Props 定义组件的对外输入接口' },
      { to: 'fe-state', desc: 'Props 是外部只读输入，State 是内部可变数据，二者共同决定渲染' },
      { to: 'fe-state-management', desc: '跨层级传递困难时，全局状态管理可替代逐层透传' },
    ],
  },
  {
    id: 'fe-state',
    name: 'State',
    en: 'Component State',
    cat: 'frontend',
    sub: '组件化与框架',
    tags: ['组件化', '数据流'],
    summary: 'State 是组件内部私有的可变数据，状态变化触发组件重新渲染，是声明式 UI 的驱动力。',
    detail: `**是什么**：State 是组件内部持有的可变数据（输入框内容、弹窗开关等），状态变更触发框架重新渲染组件，UI 随数据自动更新。

**解决什么问题**：命令式开发"改了数据还要手动改 DOM"，容易不同步；声明式模型让 UI = f(state)，框架负责把状态映射到界面。

**关键点**：
- 状态变更必须走框架 API（setState/响应式赋值）才能被侦听
- 更新通常是异步批处理的，不能依赖变更后的立即值
- 状态应放在最小必要作用域，需要共享再上提或进全局仓库

**误区**：把所有状态塞进全局状态管理；从 Props 拷贝出一份不同步的 State 副本。`,
    relations: [
      { to: 'fe-props', desc: 'Props 外部输入与 State 内部数据共同决定渲染输出' },
      { to: 'fe-controlled-component', desc: '受控组件把表单值提升为 State，由数据驱动输入框显示' },
      { to: 'fe-state-management', desc: '组件间需要共享的状态上移到全局状态管理仓库' },
    ],
    interview: '高频：React setState 的异步批处理机制；Vue 响应式（Proxy 依赖收集）与 React 重渲染模型的差异。',
  },
  {
    id: 'fe-lifecycle',
    name: '生命周期',
    en: 'Component Lifecycle',
    cat: 'frontend',
    sub: '组件化与框架',
    tags: ['组件化', '框架'],
    summary: '生命周期是组件从挂载、更新到卸载过程的框架钩子，用于在正确时机发请求、订阅与清理。',
    detail: `**是什么**：生命周期是组件从创建（挂载）→ 更新 → 销毁（卸载）各阶段由框架调用的钩子函数，如 Vue 的 mounted/unmounted、React 类组件的 componentDidMount。

**解决什么问题**：副作用需要正确时机——DOM 就绪后测量、卸载前清理定时器与订阅，否则功能错乱或内存泄漏。

**关键阶段**：
- 挂载后：发请求、操作 DOM、初始化第三方库
- 更新时：响应 Props/State 变化执行对比逻辑
- 卸载前：清除定时器、取消订阅、中止请求

**实践**：React 函数组件用 useEffect 覆盖生命周期——依赖数组模拟挂载/更新，return 的清理函数模拟卸载。`,
    relations: [
      { to: 'fe-hooks', desc: 'useEffect/useLayoutEffect 是函数组件的生命周期载体' },
      { to: 'fe-component', desc: '生命周期是组件实例从创建到销毁的全过程' },
      { to: 'fe-state', desc: '状态更新驱动组件进入"更新"阶段并触发对应钩子' },
    ],
  },
  {
    id: 'fe-hooks',
    name: 'Hooks',
    en: 'React Hooks',
    cat: 'frontend',
    sub: '组件化与框架',
    tags: ['React', '函数组件'],
    summary: 'Hooks 让函数组件拥有状态与副作用能力（useState 等），并支持用自定义 Hook 复用逻辑。',
    detail: `**是什么**：Hooks 是 React 16.8 引入的机制，让函数组件无需类写法即可使用状态（useState）、副作用（useEffect）、上下文（useContext）等能力；Vue 3 的 Composition API 是同类思想。

**解决什么问题**：类组件逻辑分散在各生命周期、复用依赖 HOC 嵌套；Hooks 把相关逻辑聚拢在一起，自定义 Hook 可即插即用地跨组件复用。

**关键规则**：
- 只在顶层调用，不能放进条件或循环
- 依赖数组决定 Effect 何时重跑；return 的函数负责清理

**误区**：漏写依赖导致闭包捕获旧值；滥用 useMemo/useCallback 反而增加复杂度。`,
    relations: [
      { to: 'fe-lifecycle', desc: 'useEffect/useLayoutEffect 把副作用映射到组件生命周期' },
      { to: 'fe-state', desc: 'useState 是函数组件的状态载体' },
      { to: 'fe-hoc', desc: '自定义 Hook 与 HOC 是逻辑复用的两种方案，前者更轻' },
    ],
    example: `function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // 卸载或下次触发前清理
  }, [value, delay]);

  return debounced;
}
// 自定义 Hook：任何组件一行即可复用防抖逻辑`,
    exampleLang: 'jsx',
  },
  {
    id: 'fe-controlled-component',
    name: '受控组件',
    en: 'Controlled Component',
    cat: 'frontend',
    sub: '组件化与框架',
    tags: ['表单', 'React'],
    summary: '受控组件的表单值由组件 State 驱动、经 onChange 同步回写，使表单数据与 UI 始终一致。',
    detail: `**是什么**：受控组件指表单元素（input、select 等）的值完全由组件状态驱动：value 绑定 State，用户输入经 onChange 更新 State，再反映回输入框，形成受控闭环。

**解决什么问题**：非受控表单的值散落在 DOM 里，难以校验、联动与提交；受控模式让表单数据拥有"唯一事实来源"。

**关键点**：
- 数据流：State → value → 用户输入 → onChange → 更新 State
- 可即时校验、禁用提交按钮、实现级联联动
- 非受控（defaultValue + ref）留给文件上传等特殊场景

**实践**：多数业务表单应受控；大型表单可用 react-hook-form 降低每次按键的重渲染成本。`,
    relations: [
      { to: 'fe-state', desc: '受控组件把表单值提升为 State 统一管理' },
      { to: 'fe-props', desc: '受控值与 onChange 回调常由父组件经 Props 下发' },
      { to: 'fe-component', desc: '受控/非受控是组件输入设计的经典分界线' },
    ],
    interview: '高频：受控与非受控的区别及选型；受控输入每键触发渲染的性能优化（局部 state + 防抖提交）。',
  },
  {
    id: 'fe-virtual-dom',
    name: 'Virtual DOM',
    en: 'Virtual DOM',
    cat: 'frontend',
    sub: '组件化与框架',
    tags: ['React', '渲染优化'],
    summary: 'Virtual DOM 是用 JS 对象描述的 UI 内存快照，改动先更新虚拟树，再最小化同步到真实 DOM。',
    detail: `**是什么**：Virtual DOM 是用普通 JS 对象描述真实 DOM 的轻量副本：type、props、children 构成树结构，UI 变化先落在虚拟树上。

**解决什么问题**：直接操作 DOM 代价高且难以批量优化；有了内存副本，框架可先在 JS 层对比差异，再把最小变更一次性应用到真实 DOM。

**如何工作**：
- 状态变化 → 重新生成新虚拟树
- 新旧树 Diff 得到最小补丁集
- 批量应用补丁到真实 DOM

**提示**：Virtual DOM 不是"比手工操作更快"，而是"在可维护前提下足够快"；Svelte 等编译时方案证明绕开它也可行，理解取舍比迷信更重要。`,
    relations: [
      { to: 'fe-diff-algorithm', desc: 'Diff 算法负责比较新旧虚拟树并产出最小更新' },
      { to: 'fe-dom', desc: 'Virtual DOM 的所有更新最终仍要落到真实 DOM' },
      { to: 'fe-component', desc: '组件 render 函数的输出就是虚拟节点树' },
    ],
  },
  {
    id: 'fe-diff-algorithm',
    name: 'Diff 算法',
    en: 'Diffing Algorithm',
    cat: 'frontend',
    sub: '组件化与框架',
    tags: ['React', '算法'],
    summary: 'Diff 算法比较新旧虚拟 DOM 树找出最小变更，借助同层比较与 key 复用，把复杂度降至 O(n)。',
    detail: `**是什么**：Diff 算法是 Virtual DOM 的更新引擎：对比前后两棵虚拟树，计算出需要增、删、改的最小补丁。

**解决什么问题**：完整树对比是 O(n³) 级别、不可行；React/Vue 用启发式策略把复杂度降到 O(n)。

**关键策略**：
- 同层比较：节点类型不同直接重建子树，不跨层比较
- 类型相同：复用节点，仅更新变化的 props
- 列表用 key 标识身份：算法据此识别移动与复用，避免逐项重建

**误区**：用数组索引作 key，在插入、排序场景会引发状态错乱与多余重渲染；key 必须在同一列表内稳定且唯一。`,
    relations: [
      { to: 'fe-virtual-dom', desc: 'Diff 是虚拟 DOM 更新流程中的比较阶段' },
      { to: 'fe-dom', desc: 'Diff 计算出的补丁最终批量应用到真实 DOM' },
      { to: 'fe-state', desc: '状态更新触发重渲染后，由 Diff 决定实际需要的 DOM 改动' },
    ],
    interview: '高频：为什么需要 key、索引作 key 的问题；React 与 Vue Diff 策略的异同。',
  },
  {
    id: 'fe-hoc',
    name: '高阶组件',
    en: 'Higher-Order Component',
    cat: 'frontend',
    sub: '组件化与框架',
    tags: ['React', '复用'],
    summary: '高阶组件是接收组件、返回新组件的函数，用于鉴权、埋点等横切逻辑的复用。',
    detail: `**是什么**：高阶组件（HOC）是一种组件复用模式：接收一个组件，返回增强了能力的新组件，如 Redux 的 connect、React Router 的 withRouter。

**解决什么问题**：鉴权、埋点、数据订阅等横切逻辑在每个组件里重复实现；HOC 把逻辑抽到外层，包装即得能力。

**关键点**：
- 本质是函数组合：不修改原组件，返回新组件
- 通过转发 props 注入数据与回调
- 需要透传 ref（forwardRef）并保留原组件静态方法

**现状**：Hooks 出现后，多数逻辑复用改用自定义 Hook；HOC 仍适合"包装整个组件"的场景，如路由守卫、权限拦截。`,
    relations: [
      { to: 'fe-component', desc: 'HOC 是组件层面的包装增强模式' },
      { to: 'fe-props', desc: 'HOC 通常向被包装组件注入额外的 Props' },
      { to: 'fe-hooks', desc: '自定义 Hook 是更现代的逻辑复用方案，与 HOC 互补' },
    ],
    example: `// 高阶组件：为组件注入登录用户信息
function withUser(Wrapped) {
  return function WithUser(props) {
    const user = useContext(UserContext);
    if (!user) return <p>请先登录</p>;
    return <Wrapped {...props} user={user} />;
  };
}

const ProfilePage = withUser(Profile);`,
    exampleLang: 'jsx',
  },
  {
    id: 'fe-state-management',
    name: '状态管理',
    en: 'State Management',
    cat: 'frontend',
    sub: '组件化与框架',
    tags: ['架构', '数据流'],
    summary: '状态管理将跨组件共享状态抽到全局单一数据源，以可预测的规则更新（如 Redux/Zustand/Pinia）。',
    detail: `**是什么**：状态管理指把多个组件共享的数据从组件内部抽离到全局仓库，用统一 API 读写，代表方案有 Redux、Zustand、Pinia、MobX。

**解决什么问题**：Props 逐层透传在深层级组件间传数据又乱又脆；全局仓库让共享状态有唯一来源、变更可追踪、调试有工具。

**关键点**：
- 单一数据源 + 单向数据流：组件发起 action，reducer 纯函数计算新状态
- Redux 强调不可变更新；Zustand/Pinia 更轻量直观
- 服务端数据（接口返回）建议交给 TanStack Query 等数据缓存库单独管理

**误区**：把所有状态全局化；hover、输入中等纯 UI 状态应留在组件内部。`,
    relations: [
      { to: 'fe-state', desc: '组件内状态放不下、需要跨组件共享时才引入全局状态管理' },
      { to: 'fe-props', desc: '全局仓库可替代深层 Props 逐级透传' },
      { to: 'be-rest', desc: '服务端状态来自 REST 接口，适合用请求缓存库而非全局仓库管理' },
    ],
    interview: '高频：哪些状态该进全局仓库；Redux 单向数据流（dispatch → reducer → 新 state）与不可变更新的原因。',
  },
  {
    id: 'fe-spa',
    name: 'SPA 单页应用',
    en: 'Single-Page Application',
    cat: 'frontend',
    sub: '组件化与框架',
    tags: ['架构', '渲染'],
    summary: 'SPA 只加载一次 HTML，之后由 JS 动态渲染视图并切换路由，交互流畅但需专门处理首屏与 SEO。',
    detail: `**是什么**：SPA（单页应用）只在首次加载完整 HTML，之后所有视图切换由前端 JS 渲染完成，浏览器不再向服务器请求整页。

**优势与代价**：
- 优势：切换无刷新、体验接近原生、前后端彻底分离
- 代价：首屏 JS 体积大、加载慢，初始 HTML 近乎空壳导致 SEO 弱

**关键技术**：
- 前端路由接管 URL 与视图的映射
- Code Splitting 按需加载资源缓解首屏
- 预渲染 / SSR / SSG 补足 SEO 与首屏体验

**实践**：强 SEO 的内容站考虑 SSG/SSR；重交互的管理后台适合 CSR 型 SPA，两者常在同一应用中按页面混用。`,
    relations: [
      { to: 'fe-client-routing', desc: 'SPA 的页面切换由前端路由完成，不再整页跳转' },
      { to: 'fe-csr', desc: 'SPA 是 CSR 渲染架构的典型载体' },
      { to: 'net-http', desc: 'SPA 初始化后仅以 fetch/XHR 的 HTTP 请求与服务器交换数据' },
    ],
    interview: '高频：SPA 与 MPA 的对比；SPA 首屏慢的优化清单（拆包、预加载、SSR、骨架屏）。',
  },
  {
    id: 'fe-client-routing',
    name: '前端路由',
    en: 'Client-side Routing',
    cat: 'frontend',
    sub: '组件化与框架',
    tags: ['路由', 'SPA'],
    summary: '前端路由由 JS 在浏览器内维护 URL 到视图的映射，切换页面无需向服务器请求整页 HTML。',
    detail: `**是什么**：前端路由在浏览器端维护 URL 与组件视图的映射：URL 变化时由 JS 拦截并渲染对应组件，不向服务器请求新页面。React Router、Vue Router 是代表实现。

**解决什么问题**：SPA 需要可分享、可前进后退的多"页面"体验，但服务器只有一个 HTML——路由让客户端承担页面调度。

**两种模式**：
- history 模式：基于 pushState/replaceState 与 popstate 事件，URL 干净，需服务器兜底回退到 index.html
- hash 模式：用 #hash 表达路径，兼容老环境，无需服务器配置

**实践**：路由级组件配合懒加载实现按需加载；切换时取消未完成请求、恢复滚动位置。`,
    relations: [
      { to: 'fe-spa', desc: '前端路由是 SPA 实现"多页面"体验的基石' },
      { to: 'fe-bom', desc: 'history 与 location API 是前端路由实现的底层依赖' },
      { to: 'fe-code-splitting', desc: '路由级懒加载是代码分割最常见的落点' },
    ],
    interview: '实践：history 模式部署必须配置服务器回退（如 nginx try_files 指向 index.html），否则刷新 404。',
  },

  // ==================== 工程与性能 ====================
  {
    id: 'fe-bundler',
    name: '打包器',
    en: 'Bundler',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['工程化', '构建'],
    summary: '打包器把模块化源码按依赖图编译、合并、优化为浏览器可直接运行的少量静态产物文件。',
    detail: `**是什么**：打包器以入口文件为起点递归构建依赖图，将散落的模块编译、合并、优化成少量浏览器可直接运行的静态文件。Webpack、Vite、Rollup、esbuild 是代表。

**解决什么问题**：浏览器原生模块与新技术（TS、JSX、Sass）存在鸿沟，且请求上百个零散文件效率低；打包统一解决转换、合并与优化。

**核心能力**：
- 依赖图分析与模块合并
- Loader/插件体系做转换与扩展
- Tree Shaking、Code Splitting、压缩等产物优化
- 开发期 HMR 即时预览

**实践**：Vite 开发用原生 ESM 秒级冷启、生产用 Rollup 打包；产物文件名应带 content hash 才能安全开启长缓存。`,
    relations: [
      { to: 'fe-tree-shaking', desc: 'Tree Shaking 是打包器基于 ESM 静态分析剔除死代码的能力' },
      { to: 'fe-code-splitting', desc: '打包器按路由与动态导入把产物拆分为独立 chunk' },
      { to: 'fe-hmr', desc: 'HMR 由打包器开发服务器与客户端 runtime 协作实现' },
    ],
  },
  {
    id: 'fe-tree-shaking',
    name: 'Tree Shaking',
    en: 'Dead Code Elimination',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['工程化', '体积优化'],
    summary: 'Tree Shaking 基于 ES Module 的静态结构，在打包时剔除未被引用的导出代码，减小产物体积。',
    detail: `**是什么**：Tree Shaking 是打包阶段的死代码消除：分析模块导出的实际引用情况，把"摇下来"的未用代码排除出产物。

**为什么重要**：全量引入 lodash 与按需引入相比，产物体积可能相差数倍，直接影响加载时间。

**生效条件**：
- 依赖 ES Module 的静态 import/export（CommonJS 动态特性无法静态分析）
- package.json 的 sideEffects 字段标记无副作用文件
- 有副作用的代码（polyfill、样式）需豁免，否则会被误删

**误区**：export default 一个聚合对象难以摇动；应写 import debounce from 'lodash/debounce' 或改用 lodash-es。`,
    relations: [
      { to: 'fe-bundler', desc: 'Tree Shaking 是打包器提供的产物体积优化能力' },
      { to: 'fe-code-splitting', desc: '两者共同削减首屏体积：摇树去除死代码，拆分延迟非必需代码' },
      { to: 'fe-polyfill', desc: 'polyfill 属于副作用代码，需在 sideEffects 中豁免以免被误摇' },
    ],
  },
  {
    id: 'fe-code-splitting',
    name: 'Code Splitting',
    en: 'Code Splitting',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['工程化', '性能'],
    summary: '代码分割把单一大包拆成按需加载的小块（按路由或动态 import），减小首屏体积加快可交互。',
    detail: `**是什么**：Code Splitting 是把打包产物从单个大文件拆成多个小块（chunk），在真正需要时才加载的技术，由 Webpack/Vite 依据动态 import() 与 splitChunks 配置自动完成。

**解决什么问题**：业务增长让单包动辄数 MB，首屏下载与解析缓慢；而用户当次访问根本用不到全站代码。

**常见拆分点**：
- 路由级：React.lazy / Vue 异步组件按页面拆分
- 组件级：弹窗、重图表等非首屏组件
- 公共库：splitChunks 抽离稳定依赖，利于长缓存

**实践**：拆分过细会导致请求碎片化反而更慢；以"首屏必需"为界，并用 modulepreload 提示预加载关键 chunk。`,
    relations: [
      { to: 'fe-lazy-loading', desc: '代码分割是模块级懒加载的前提，配合动态 import 生效' },
      { to: 'fe-bundler', desc: '分割由打包器的动态导入分析与 splitChunks 实现' },
      { to: 'fe-client-routing', desc: '路由级懒加载是最常用的代码分割维度' },
    ],
    example: `// 路由级代码分割：访问对应页面时才加载 chunk
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>`,
    exampleLang: 'jsx',
  },
  {
    id: 'fe-lazy-loading',
    name: '懒加载',
    en: 'Lazy Loading',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['性能', '优化'],
    summary: '懒加载推迟非关键资源（图片、组件、模块）到临近使用时才加载，缩短首屏时间并节省流量。',
    detail: `**是什么**：懒加载（按需加载）指资源不在首屏一次性加载，而是在即将进入视口或被使用时才发起请求，覆盖图片、组件、JS 模块等。

**解决什么问题**：首屏加载一切既慢又浪费流量；懒加载把加载预算花在用户真正看到的内容上。

**常用手段**：
- 图片：原生 loading="lazy"，或用 IntersectionObserver 自实现
- 路由/组件：动态 import() 配合 Suspense/异步组件
- 占位：固定宽高或骨架屏，防止加载后布局跳动

**误区**：首屏关键内容（LCP 候选）不要懒加载，会延迟核心指标；懒加载需兜底失败重试与占位体验。`,
    relations: [
      { to: 'fe-code-splitting', desc: '模块级懒加载依托代码分割产出的独立 chunk' },
      { to: 'net-cdn', desc: '懒加载触发的后续请求经 CDN 就近节点快速返回' },
      { to: 'fe-reflow-refrepaint', desc: '图片未占位时懒加载会引发布局抖动与反复重排' },
    ],
    interview: '实践：LCP 候选元素避免懒加载；IntersectionObserver 比监听 scroll 事件的性能好得多。',
  },
  {
    id: 'fe-hmr',
    name: 'HMR 热更新',
    en: 'Hot Module Replacement',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['工程化', '开发体验'],
    summary: 'HMR 在开发时把修改的模块热替换进运行中的应用，无需刷新页面且保留应用状态。',
    detail: `**是什么**：HMR（模块热替换）是打包器开发服务器的能力：文件修改后只把变更模块推送并替换到运行中的页面，无需整页刷新。

**解决什么问题**：传统刷新会丢失应用状态——填了一半的表单、深入三级的路由全没了；HMR 秒级生效且状态保留，大幅缩短反馈循环。

**如何工作**：
- 开发服务器监听文件变化，增量编译变更模块
- 通过 WebSocket 推送更新清单，客户端 runtime 拉取新模块
- 替换模块并触发其 accept 回调；无法热替换时整页刷新兜底

**实践**：样式热替换最丝滑；组件级热替换需框架插件（react-refresh、vue-loader）配合。`,
    relations: [
      { to: 'fe-bundler', desc: 'HMR 由打包器的开发服务器与客户端 runtime 协作实现' },
      { to: 'fe-spa', desc: 'HMR 让 SPA 深层路由下的状态在开发时不丢失' },
      { to: 'fe-state', desc: 'React Fast Refresh 会尽量保留组件 State，只重渲染受影响部分' },
    ],
  },
  {
    id: 'fe-polyfill',
    name: 'Polyfill',
    en: 'Polyfill (Shim)',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['兼容性', '工程化'],
    summary: 'Polyfill 用等价实现补齐旧浏览器缺失的新 API，让新标准代码在旧环境中正常运行。',
    detail: `**是什么**：Polyfill（垫片）是为旧环境补齐缺失 API 的兼容代码：如为不支持 Promise 的浏览器注入等价实现，使新标准代码可正常运行。

**解决什么问题**：新特性普及有滞后，直接用会白屏报错、放弃使用则损失能力；Polyfill 让代码"写得新、跑得旧"。

**关键点**：
- core-js 是最全的 JS API 垫片库，配合 @babel/preset-env 的 useBuiltIns 按目标浏览器按需注入
- 箭头函数等语法转换由 Babel 负责，与 API 垫片互补
- 现代浏览器应走差异化构建（module/nomodule），避免背上无用垫片

**误区**：全量引入拖慢加载；垫片须最先执行，且其污染全局原型的实现可能引发冲突。`,
    relations: [
      { to: 'fe-bundler', desc: 'Babel 与打包流水线按目标浏览器自动按需注入 polyfill' },
      { to: 'fe-ssr', desc: 'SSR 在 Node 端运行浏览器侧代码时，常需服务端 polyfill 兜底' },
    ],
  },
  {
    id: 'fe-ssr',
    name: 'SSR',
    en: 'Server-Side Rendering',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['渲染架构', 'SEO'],
    summary: 'SSR 在服务器把组件渲染成完整 HTML 发给浏览器，首屏快、SEO 好，再由客户端注水激活交互。',
    detail: `**是什么**：SSR（服务端渲染）指框架组件在服务器执行并输出完整 HTML 首屏，浏览器立即可见内容，随后客户端"注水（hydration）"接管交互。Next.js、Nuxt 是代表框架。

**解决什么问题**：CSR 首屏白屏久且 SEO 差；SSR 让用户第一时间看到内容，爬虫拿到完整 HTML。

**工作流程**：
- 请求到达 → 服务器执行组件树 → renderToString 生成 HTML
- 浏览器立即渲染 HTML → 加载 JS → 注水绑定事件
- 之后的路由切换回到 CSR 模式

**代价与实践**：服务器有计算与运维成本；Node 端没有 window/document，需守卫；请求要在服务端转发 Cookie 才能识别用户态。`,
    relations: [
      { to: 'fe-csr', desc: 'CSR 首屏慢交互快，SSR 相反，常按页面混用' },
      { to: 'fe-ssg', desc: 'SSG 在构建时生成静态页，SSR 在请求时生成，动态性不同' },
      { to: 'be-cookie-session', desc: 'SSR 需把请求 Cookie 转发到服务端才能识别用户会话' },
    ],
    interview: '高频：hydration（注水）是什么、SSR 与 SSG 的选型依据（动态内容 vs 静态内容）。',
  },
  {
    id: 'fe-csr',
    name: 'CSR',
    en: 'Client-Side Rendering',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['渲染架构', 'SPA'],
    summary: 'CSR 由浏览器下载并执行 JS 在客户端生成 DOM 渲染页面，首屏较慢但后续交互流畅。',
    detail: `**是什么**：CSR（客户端渲染）指服务器只返回近乎空壳的 HTML 与 JS 资源，由浏览器执行 JS 生成 DOM 并渲染页面，之后所有视图更新也在客户端完成。

**解决什么问题**：CSR 把渲染压力从服务器转移到客户端，服务器只需提供静态资源与数据 API，部署简单、交互体验流畅。

**特点**：
- 首屏依赖完整 JS 下载执行，白屏时间较长（用骨架屏缓解）
- SEO 弱：不执行 JS 的爬虫拿不到内容
- 首屏之后路由切换秒级完成、无需整页请求

**实践**：管理后台、重交互应用适合 CSR；内容型页面考虑 SSR/SSG 补足首屏与 SEO。`,
    relations: [
      { to: 'fe-spa', desc: 'SPA 普遍采用 CSR 渲染架构' },
      { to: 'fe-ssr', desc: 'SSR 用服务端首屏弥补 CSR 的白屏与 SEO 短板' },
      { to: 'fe-code-splitting', desc: 'CSR 首屏体积靠代码分割与懒加载压缩' },
    ],
  },
  {
    id: 'fe-ssg',
    name: 'SSG',
    en: 'Static Site Generation',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['渲染架构', 'SEO'],
    summary: 'SSG 在构建时把页面预渲染成静态 HTML，直接由 CDN 分发，速度快且安全，适合内容型站点。',
    detail: `**是什么**：SSG（静态站点生成）在构建阶段就把页面渲染成静态 HTML 文件，部署后由服务器/CDN 直接返回，运行时无需计算。Next.js 的 getStaticProps、Astro、Hugo 是代表。

**解决什么问题**：文档、博客、营销页等内容型站点数据不常变，每次请求都 SSR 纯属浪费；预渲染换来极致的加载速度、稳定性与 SEO。

**关键点**：
- 构建时取数渲染，访问时零计算、零数据库依赖
- 增量再生（ISR）可在运行时按需重建部分页面，兼顾动态性
- 内容更新需要重新构建并部署

**实践**：配合 CDN 全站缓存是性价比最高的架构；个性化数据频繁的页面再交给 SSR 或 CSR。`,
    relations: [
      { to: 'fe-ssr', desc: '同为预取首屏方案：SSG 构建时生成、SSR 请求时生成' },
      { to: 'fe-csr', desc: 'SSG 产出的页面仍可注水为 CSR 应用获得完整交互' },
      { to: 'net-cdn', desc: 'SSG 的纯静态产物最适合 CDN 边缘全站分发' },
    ],
  },
  {
    id: 'fe-pwa',
    name: 'PWA',
    en: 'Progressive Web App',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['Web 应用', '离线'],
    summary: 'PWA 用 Service Worker 缓存与 manifest 让 Web 应用可安装、离线可用，体验接近原生。',
    detail: `**是什么**：PWA（渐进式 Web 应用）是一组让 Web 接近原生应用体验的技术集合：Service Worker 离线缓存、Web App Manifest 安装到桌面、推送通知等；渐进增强，不支持的浏览器照常降级运行。

**解决什么问题**：弱网或离线时 Web 应用不可用、也无法像原生 App 一样留存到桌面；PWA 补齐这两块短板。

**关键组成**：
- Service Worker：独立线程拦截并缓存请求，实现离线访问与秒开
- manifest.json：名称、图标、主题色、独立窗口
- 前提条件：全站 HTTPS

**实践**：静态资源用缓存优先策略、API 数据用网络优先回退缓存；提供离线兜底页面。`,
    relations: [
      { to: 'net-https', desc: 'PWA 的 Service Worker 只能在全站 HTTPS 环境下注册' },
      { to: 'fe-spa', desc: 'PWA 常与 SPA 结合，用 App Shell 模式实现离线秒开' },
      { to: 'net-http', desc: 'Service Worker 拦截 HTTP 请求，按策略决定走缓存还是网络' },
    ],
    interview: '实践：注意 Service Worker 更新的"二次生效"问题，新版本需 skipWaiting 或刷新提示。',
  },
  {
    id: 'fe-web-worker',
    name: 'Web Worker',
    en: 'Web Worker',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['性能', '多线程'],
    summary: 'Web Worker 在独立线程运行脚本并与主线程消息通信，让重计算不阻塞 UI 渲染与交互。',
    detail: `**是什么**：Web Worker 是浏览器提供的多线程机制：在后台线程运行 JS 文件，通过 postMessage 与主线程传递结构化消息，互不阻塞。

**解决什么问题**：JS 单线程，大计算（解析大文件、加密、图像处理）会卡死 UI；Worker 把重活挪出主线程，界面依旧流畅。

**关键约束**：
- Worker 中没有 DOM 与 window，不能直接操作页面
- 通信默认拷贝传递，大对象可用 Transferable 零拷贝转移
- 分 Dedicated/Shared/Service 三类，Service Worker 用于 PWA 缓存

**实践**：任务不足几十毫秒不值得开 Worker；构建工具需专用语法引入 worker 文件。`,
    relations: [
      { to: 'fe-event-loop', desc: 'Worker 线程不阻塞主线程的事件循环与渲染' },
      { to: 'fe-csp', desc: 'CSP 的 worker-src 指令限制 Worker 脚本的来源' },
      { to: 'fe-pwa', desc: 'Service Worker 是一种特殊 Worker，支撑 PWA 离线缓存' },
    ],
  },
  {
    id: 'fe-debounce-throttle',
    name: '防抖与节流',
    en: 'Debounce & Throttle',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['性能', '事件'],
    summary: '防抖在事件停止触发后延迟执行一次，节流在固定间隔内最多执行一次，用于控制高频事件频率。',
    detail: `**是什么**：两者都是高频事件的频率控制手段。防抖（debounce）：事件停止触发后延迟 n 毫秒执行最后一次；节流（throttle）：每 n 毫秒最多执行一次，期间的触发被忽略。

**解决什么问题**：input、scroll、resize、mousemove 每秒触发几十上百次，直接响应会造成无谓的请求、重排与渲染。

**选择策略**：
- 防抖：搜索联想、resize 后重算布局——只关心"最终状态"
- 节流：滚动加载、拖拽跟随、按钮防连点——关心"过程均匀采样"

**实现**：定时器加闭包保存状态；Lodash 的 debounce/throttle 提供 leading/trailing 选项控制首次与末次是否执行。`,
    relations: [
      { to: 'be-rate-limit', desc: '客户端节流与服务端限流配合，形成端到端的流量保护' },
      { to: 'fe-closure-perf', desc: '防抖节流靠闭包保存定时器状态，清理不当会引发泄漏' },
      { to: 'fe-event-loop', desc: '定时器回调作为宏任务被事件循环调度执行' },
    ],
    example: `function debounce(fn, delay) {
  let timer = null;
  return function (...args) {        // 闭包保存 timer
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}`,
    exampleLang: 'js',
    interview: '高频：手写防抖与节流；两者语义区别与各自适用场景。',
  },
  {
    id: 'fe-closure-perf',
    name: '闭包与内存泄漏',
    en: 'Closure & Memory Leak',
    cat: 'frontend',
    sub: '工程与性能',
    tags: ['JS 基础', '内存'],
    summary: '闭包让函数长期持有外部变量引用，使用不当会阻止垃圾回收形成内存泄漏，需及时解除引用。',
    detail: `**是什么**：闭包是函数与其词法作用域的组合：内层函数持续持有外层变量的引用，即使外层函数已经返回。它是 JS 封装与函数式编程的基石。

**为什么谈性能**：被闭包引用的对象无法被垃圾回收。定时器回调、事件监听持有大对象或 DOM 节点却从不清理时，内存持续上涨——这就是典型泄漏。

**常见泄漏源**：
- setInterval 回调闭包引用大对象，未 clearInterval
- 事件监听未移除，尤其是挂到长生命周期对象上
- 意外的全局变量、被遗忘的已卸载 DOM 引用

**实践**：组件卸载时清理定时器与订阅；用 Chrome DevTools 的 Memory 面板拍堆快照对比定位泄漏。`,
    relations: [
      { to: 'fe-dom', desc: '闭包持有已卸载的 DOM 引用是常见泄漏源' },
      { to: 'fe-event-loop', desc: '定时器回调形成长生命周期闭包，需手动清理' },
      { to: 'fe-debounce-throttle', desc: '防抖节流依赖闭包保存状态，忘记清理定时器即泄漏' },
    ],
    interview: '高频：闭包的应用（柯里化、模块封装）与风险；如何用堆快照对比定位内存泄漏。',
  },
];
