import { useMemo } from 'react';

/** 热力图展示的周数（一年） */
const WEEKS = 52;

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 强度等级 0-4（0 = 无活动） */
function levelOf(n: number): 0 | 1 | 2 | 3 | 4 {
  if (n <= 0) return 0;
  if (n <= 2) return 1;
  if (n <= 5) return 2;
  if (n <= 9) return 3;
  return 4;
}

const LEVEL_BG: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-night-800',
  1: 'bg-quest-500/25',
  2: 'bg-quest-500/45',
  3: 'bg-quest-500/70',
  4: 'bg-quest-500',
};

const WEEKDAY_LABELS = ['一', '', '三', '', '五', '', '日'];

/**
 * 学习热力图（GitHub 风格）：最近一年，按日活动次数分 5 档强度。
 * 弹性填充网格：列 flex-1 + 单元格 aspect-square，随面板宽度自动撑满。
 * 数据源 store.activityLog（完成关卡 / 测验 / 笔记 / 浏览术语都会 +1）。
 */
export function ActivityHeatmap({ log }: { log: Record<string, number> }) {
  const { weeks, total, activeDays, monthLabels } = useMemo(() => {
    const today = new Date();
    // 本周一
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const cols: { key: string; n: number; future: boolean }[][] = [];
    let total = 0;
    let activeDays = 0;
    for (let w = WEEKS - 1; w >= 0; w--) {
      const col: { key: string; n: number; future: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() - w * 7 + d);
        const key = dateKey(day);
        const n = log[key] ?? 0;
        const future = day.getTime() > today.getTime();
        if (!future && n > 0) {
          total += n;
          activeDays++;
        }
        col.push({ key, n, future });
      }
      cols.push(col);
    }
    // 月份标签：每月第一次出现的列
    const labels: (string | null)[] = new Array(cols.length).fill(null);
    let lastMonth = -1;
    cols.forEach((col, i) => {
      const month = Number(col[0].key.slice(5, 7));
      if (month !== lastMonth) {
        labels[i] = `${month}月`;
        lastMonth = month;
      }
    });
    return { weeks: cols, total, activeDays, monthLabels: labels };
  }, [log]);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-200">学习热力图</h3>
        <span className="text-[11px] text-slate-500">
          近一年 {total} 次活动 · 活跃 {activeDays} 天
        </span>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[560px]">
          {/* 月份标签行：与周列同构对齐（固定行高，避免塌陷重叠） */}
          <div className="mb-1 flex h-[13px] gap-[3px]">
            <div className="w-[14px] shrink-0" />
            <div className="flex flex-1 gap-[3px]">
              {weeks.map((_, i) => (
                <div key={i} className="relative min-w-0 flex-1">
                  {monthLabels[i] && (
                    <span className="absolute left-0 top-0 whitespace-nowrap text-[9px] leading-[13px] text-slate-600">
                      {monthLabels[i]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* 网格：列 flex-1 + 单元格 aspect-square，铺满面板宽度 */}
          <div className="flex gap-[3px]">
            <div className="flex w-[14px] shrink-0 flex-col gap-[3px]">
              {WEEKDAY_LABELS.map((w, i) => (
                <span key={i} className="flex flex-1 items-center text-[9px] leading-none text-slate-600">
                  {w}
                </span>
              ))}
            </div>
            <div className="flex flex-1 gap-[3px]">
              {weeks.map((col, i) => (
                <div key={i} className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  {col.map((cell) => (
                    <span
                      key={cell.key}
                      title={cell.future ? '' : `${cell.key} · ${cell.n} 次活动`}
                      className={`aspect-square w-full rounded-[2px] transition-colors ${cell.future ? 'opacity-0' : ''} ${LEVEL_BG[levelOf(cell.n)]}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-slate-600">
        少
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className={`h-[10px] w-[10px] rounded-[3px] ${LEVEL_BG[l as 0 | 1 | 2 | 3 | 4]}`} />
        ))}
        多
      </div>
    </div>
  );
}
