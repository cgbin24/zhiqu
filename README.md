# 智码 CodeQuest 🗡️

游戏化编程闯关学习平台 —— 在浏览器里系统掌握 **Go / Rust / C++**，全程无需本地配置任何开发环境。

![tech](https://img.shields.io/badge/React%2018-Vite%206-7c5cf0) ![judge](https://img.shields.io/badge/云端判题-Godbolt%20%7C%20Wandbox-00add8)

## 📸 产品预览

| 仪表盘（暗色） | 关卡页（暗色） |
| --- | --- |
| ![仪表盘暗色](docs/screenshots/dashboard-dark.png) | ![关卡页暗色](docs/screenshots/level-dark.png) |

| 关卡地图（亮色） | 关卡页（亮色） |
| --- | --- |
| ![关卡地图](docs/screenshots/level-map.png) | ![关卡页亮色](docs/screenshots/level-light.png) |

> 明暗主题一键切换，全站平滑过渡；关卡地图展示六大模块 × 阶梯解锁。

## ✨ 特性

- **四大课程 168 关**：Go / Rust / C++ 各 42 关（六大模块：基础语法 → 编程思想 → 进阶 → 技巧 → 最佳实践 → 综合实战）+ **算法课 42 关**（复杂度、双指针、二分、排序、递归/分治/贪心、栈队列哈希链表树、BFS/DFS/拓扑、DP、Dijkstra 等，配 **15 个交互式算法可视化动画**——可播放/单步/调速）
- **算法课可切换作答语言**：JavaScript（浏览器内本地执行，零延迟）/ Go / Rust / C++（云端最新编译器），四语言参考答案均经真实执行验证
- **术语百科**：482 个核心开发术语覆盖十二大领域（**全链路开发** 43 / **页面效果** 76 / **网络安全** 56 / **数据结构与算法** 50 / **开发工具链** 36 / 前端 41 / 后端 41 / 运维 32 / 嵌入式 28 / AI 28 / 网络工程 27 / Agent 开发 24），含 **49 种可交互实时演示**（页面效果 + 算法可视化）。全链路提供**需求→上线流程视图**；安全领域覆盖 OWASP 攻防与渗透红蓝对抗；每条术语含精讲、关联关系、代码示例与面试要点 + **术语测验三模式（经典/60 秒速答/错题复习，得 XP）**
- **真实编译执行**：Go 1.26 · Rust 1.99 · GCC 16.2 (`-std=c++20`) 云端运行（Godbolt 主引擎 + Wandbox 自动降级），JavaScript 浏览器本地执行
- **自动判题系统**：逐测试点执行、期望/实际输出 diff、隐藏测试点、编译错误定位
- **游戏化系统**：XP 与七大段位（青铜→宗师）、三星评价、章节解锁、每日挑战（×1.5 XP）、连续学习天数、36 个成就
- **明暗主题**：暗色 / 亮色一键切换，全局平滑过渡不闪烁，Monaco 编辑器主题联动，刷新恢复
- **零配置练习**：Monaco 编辑器（本地打包，不依赖 CDN）、自定义 stdin 的自由练习场
- **数据自主**：进度存浏览器 localStorage，支持导出 / 导入 JSON 备份
- **可扩展架构**：新增语言 = 一个 `LanguageDef` 注册 + 章节内容文件，判题/游戏化/页面零改动

## 🚀 快速开始

```bash
npm install
npm run dev        # 打开终端显示的 http://localhost:5173
```

生产构建与本地预览：

```bash
npm run build
npm run preview
```

## ☁️ 在线访问

- **Cloudflare Pages（主站）**：https://zhiqu-1h0.pages.dev/
- GitHub Pages（备用）：https://ux58.github.io/zhiqu/

### Cloudflare 部署（直接上传，无需 Git）

```bash
npm run build
# 设置 CLOUDFLARE_API_TOKEN（需 Account | Cloudflare Pages | Edit 权限）后：
npx wrangler pages deploy dist --project-name=zhiqu --branch=main
```

### GitHub Pages（Git 推送触发）

推送 `main` 后，GitHub Actions（[.github/workflows/deploy.yml](.github/workflows/deploy.yml)）自动：`npm ci` → `tsc -b` → `vite build --base=/zhiqu/` → 发布到 GitHub Pages。首次需在仓库 Settings → Pages 把 Source 设为 GitHub Actions。

## 🔧 内容验证（维护者）

每关的参考答案都会被脚本真实提交到云端编译执行、逐用例比对：

```bash
node scripts/verify-levels.mjs go/basic        # 只验证某一章
node scripts/verify-levels.mjs --full          # 全部 126 关 + starter 防误过检查
node scripts/verify-terms.mjs                  # 术语数据完整性（关系引用/字段/唯一性）
```

## 🏗️ 架构

```
src/
├── types/            # 全部领域类型
├── data/
│   ├── modules.ts    # 六大模块定义（所有课程共用骨架）
│   ├── ranks.ts      # 段位表
│   ├── achievements.ts
│   ├── terms/        # ⭐ 术语百科：十二领域数据 + 注册表 + 全库搜索
│   ├── algo/         # ⭐ 算法课：6 章节文件（多语言 starter/solution + 可视化配置）
│   └── languages/
│       ├── registry.ts       # ⭐ 语言注册表 + 课程轨道（接入新语言的唯一入口之一）
│       └── go|rust|cpp/      # 每语言 6 个章节文件（关卡内容）
├── judge/            # provider 抽象 + Godbolt/Wandbox + JS 本地执行 + 节流队列 + 判题比对
├── game/             # XP / 星级 / 段位 / 术语测验出题引擎
├── store/progress.ts # zustand + localStorage 持久化
├── components/       # 编辑器 / AlgoVisualizer 算法动画 / Toast / Diff / 布局 …
└── pages/            # Dashboard / LearnPath / LevelPlay / Terms×4 / Playground / Achievements / Profile
```

### 接入新语言

1. `src/data/languages/registry.ts`：添加 `LanguageDef`（名称、主题色、Monaco id、Godbolt 编译器 id、模板）
2. 新建 `src/data/languages/<lang>/` 六个章节文件，导出 `Level[]`
3. `src/data/languages/index.ts`：把六个数组加入 `CHAPTER_FILES`

判题、游戏化、进度、页面全部自动生效。

## ⚠️ 已知限制

- 判题依赖公共编译服务（Compiler Explorer / Wandbox），离线不可用；高峰期可能排队
- 每日挑战的 ×1.5 XP 每天每关仅一次
- 进度存储于浏览器本地，清除站点数据会丢失（请先在「我的」页导出）
