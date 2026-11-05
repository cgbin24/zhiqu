import { useMemo } from 'react';

/** 热力图展示的周数（约半年） */
const WEEKS = 26;

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

/**
 * 学习热力图（GitHub 风格）：最近 26 周，按日活动次数分 5 档强度。
 * 数据源 store.activityLog（完成关卡 / 测验 / 笔记 / 浏览术语都会 +1）。
 */
export function ActivityHeatmap({ log }: { log: Record<string, number> }) {
  const { weeks, total, activeDays } = useMemo(() => {
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
        const future = day.getTime() > today.getTime() && dateKey(day) !== dateKey(today);
        if (!future && n > 0) {
          total += n;
          activeDays++;
        }
        col.push({ key, n, future: future || day.getTime() > today.getTime() });
      }
      cols.push(col);
    }
    return { weeks: cols, total, activeDays };
  }, [log]);

  const monthLabels = useMemo(() => {
    // 顶部月份标签：在每月第一次出现的列上标注
    const labels: (string | null)[] = new Array(weeks.length).fill(null);
    let lastMonth = -1;
    weeks.forEach((col, i) => {
      const first = col[0];
      const month = Number(first.key.slice(5, 7));
      if (month !== lastMonth) {
        labels[i] = `${month}月`;
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-200">学习热力图</h3>
        <span className="text-[11px] text-slate-500">
          近半年 {total} 次活动 · 活跃 {activeDays} 天
        </span>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="inline-block min-w-full">
          <div className="mb-1 flex gap-[3px] pl-6 text-[9px] text-slate-600">
            {monthLabels.map((m, i) => (
              <span key={i} className="w-[13px] shrink-0 overflow-visible whitespace-nowrap">{m}</span>
            ))}
          </div>
          <div className="flex gap-[3px]">
            <div className="mr-1 flex flex-col gap-[3px] pt-[1px] text-[8px] leading-[10px] text-slate-600">
              <span className="h-[11px]">一</span>
              <span className="h-[11px]"></span>
              <span className="h-[11px]">三</span>
              <span className="h-[11px]"></span>
              <span className="h-[11px]">五</span>
              <span className="h-[11px]"></span>
              <span className="h-[11px]">日</span>
            </div>
            {weeks.map((col, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {col.map((cell) => (
                  <span
                    key={cell.key}
                    title={cell.future ? '' : `${cell.key} · ${cell.n} 次活动`}
                    className={`h-[11px] w-[11px] shrink-0 rounded-[3px] ${cell.future ? 'opacity-30' : ''} ${LEVEL_BG[levelOf(cell.n)]} transition-colors`}
                  />
                ))}
              </div>
            ))}
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
