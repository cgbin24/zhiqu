import { Link } from 'react-router-dom';
import { termsOfCategory } from '@/data/terms';
import { useProgress } from '@/store/progress';

/** 全链路九段流水线：环节 → 交付物 → 下一环节 */
const FLOW_STAGES: { sub: string; icon: string; role: string }[] = [
  { sub: '需求与产品', icon: '📋', role: '产品经理主导' },
  { sub: '设计与原型', icon: '🎨', role: '产品 / 设计师' },
  { sub: '项目管理与协作', icon: '🗓️', role: '项目经理 / 全员' },
  { sub: '开发环节', icon: '⌨️', role: '前端 + 后端' },
  { sub: '接口与联调', icon: '🔌', role: '前端 ⇄ 后端' },
  { sub: '测试', icon: '🧪', role: '测试 / QA' },
  { sub: '部署与上线', icon: '🚀', role: '开发 + 运维' },
  { sub: '线上运维与迭代', icon: '📊', role: '运维 + 产品' },
];

/** 环节之间流动的交付物 */
const DELIVERABLES: string[] = [
  'PRD · 原型稿',
  '设计稿 · 标注',
  '排期表 · 迭代计划',
  '功能代码 · 评审通过',
  '联调通过 · 接口冻结',
  '测试报告 · Bug 清零',
  '上线完成 · 监控就绪',
  '数据报告 · 下一轮需求',
];

/** 全链路开发流程视图：垂直流水线 + 各环节术语 */
export function LifecycleFlow() {
  const terms = termsOfCategory('lifecycle');
  const viewedTerms = useProgress((s) => s.viewedTerms);

  return (
    <div className="rounded-2xl border border-night-700 bg-night-900 p-5">
      <h2 className="mb-1 text-sm font-bold text-slate-200">🧭 全链路流程图</h2>
      <p className="mb-4 text-xs text-slate-500">从需求到迭代的完整旅程 —— 点击任意术语查看该环节的详细说明与上下游关系</p>

      <div className="relative">
        {FLOW_STAGES.map((stage, i) => {
          const stageTerms = terms.filter((t) => t.sub === stage.sub);
          const allViewed = stageTerms.length > 0 && stageTerms.every((t) => viewedTerms[t.id]);
          return (
            <div key={stage.sub}>
              {/* 环节节点 */}
              <div className="flex gap-3">
                {/* 左侧轨道 */}
                <div className="flex flex-col items-center">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg shadow-md ${
                      allViewed ? 'bg-emerald-500/20 ring-1 ring-emerald-400/60' : 'bg-gradient-to-br from-fuchsia-500/80 to-violet-500/60'
                    }`}
                  >
                    {stage.icon}
                  </span>
                  {i < FLOW_STAGES.length - 1 && <span className="my-1 w-px flex-1 bg-gradient-to-b from-fuchsia-500/50 to-violet-500/20" />}
                </div>

                {/* 右侧内容 */}
                <div className="min-w-0 flex-1 pb-5">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-bold text-slate-100">
                      {i + 1}. {stage.sub}
                    </span>
                    <span className="rounded bg-night-800 px-1.5 py-0.5 text-[10px] text-slate-400">{stage.role}</span>
                    <span className="text-[11px] text-slate-500">{stageTerms.length} 个术语</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {stageTerms.map((t) => (
                      <Link
                        key={t.id}
                        to={`/terms/lifecycle/${t.id}`}
                        className={`rounded-lg border px-2 py-1 text-xs transition-colors ${
                          viewedTerms[t.id]
                            ? 'border-emerald-500/30 bg-emerald-500/8 text-emerald-300'
                            : 'border-night-700 bg-night-850 text-slate-300 hover:border-quest-500/50 hover:text-quest-300'
                        }`}
                      >
                        {t.name}
                      </Link>
                    ))}
                  </div>
                  {/* 交付物流转 */}
                  {i < FLOW_STAGES.length - 1 && (
                    <div className="mt-2.5 flex items-center gap-2 text-[11px] text-fuchsia-300/80">
                      <span className="text-base leading-none">⬇</span>
                      <span>
                        交付物：<span className="font-semibold">{DELIVERABLES[i]}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-1 rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/8 p-3 text-xs leading-relaxed text-slate-300">
        ♻️ 链路是闭环的：「线上运维与迭代」产出的数据报告与用户反馈，会变成下一轮「需求与产品」的输入 —— 产品就是这样一轮轮长出来的。
      </div>
    </div>
  );
}
