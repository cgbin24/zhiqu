import { useMemo, useRef, useState } from 'react';
import { Download, RotateCcw, Upload, User } from 'lucide-react';
import { ACHIEVEMENTS } from '@/data/achievements';
import { totalLevels } from '@/data/languages';
import { getRank } from '@/data/ranks';
import { emitToast } from '@/lib/toast-bus';
import { useProgress } from '@/store/progress';

export function Profile() {
  const nickname = useProgress((s) => s.nickname);
  const setNickname = useProgress((s) => s.setNickname);
  const xp = useProgress((s) => s.xp);
  const levelStats = useProgress((s) => s.levelStats);
  const counters = useProgress((s) => s.counters);
  const streak = useProgress((s) => s.streak);
  const achievements = useProgress((s) => s.achievements);
  const resetAll = useProgress((s) => s.resetAll);
  const importAll = useProgress((s) => s.importAll);

  const fileRef = useRef<HTMLInputElement>(null);
  const [nameDraft, setNameDraft] = useState(nickname);
  const { rank } = getRank(xp);

  const stats = useMemo(() => {
    const entries = Object.values(levelStats);
    const done = entries.filter((e) => e.stars > 0);
    return {
      done: done.length,
      total: totalLevels(),
      stars: done.reduce((a, e) => a + e.stars, 0),
      maxStars: totalLevels() * 3,
      threeStar: done.filter((e) => e.stars === 3).length,
    };
  }, [levelStats]);

  const exportData = () => {
    const s = useProgress.getState();
    const data = {
      exportedAt: new Date().toISOString(),
      nickname: s.nickname,
      xp: s.xp,
      levelStats: s.levelStats,
      achievements: s.achievements,
      streak: s.streak,
      counters: s.counters,
      dailyLog: s.dailyLog,
      lastLevelId: s.lastLevelId,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `codequest-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importData = (text: string) => {
    if (importAll(text)) {
      emitToast({ kind: 'info', text: '进度导入成功！' });
    } else {
      emitToast({ kind: 'info', text: '导入失败：文件格式不正确' });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* 名片 */}
      <div className="rounded-2xl border border-night-700 bg-night-900 p-5">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-quest-500 to-fuchsia-500 text-2xl font-black text-white shadow-lg shadow-quest-500/30">
            {nickname.slice(0, 1)}
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <User size={14} className="text-slate-500" />
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={() => setNickname(nameDraft)}
                maxLength={16}
                className="w-40 rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-lg font-bold text-slate-100 outline-none hover:border-night-600 focus:border-quest-500/60"
              />
            </div>
            <div className="mt-1 text-sm" style={{ color: rank.color }}>
              {rank.icon} {rank.name} · ⚡ {xp} XP
            </div>
          </div>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="通关关卡" value={`${stats.done}/${stats.total}`} />
        <StatCard label="累计星数" value={`★ ${stats.stars}/${stats.maxStars}`} />
        <StatCard label="3 星通关" value={String(stats.threeStar)} />
        <StatCard label="提交评测" value={String(counters.totalSubmissions)} />
        <StatCard label="运行代码" value={String(counters.totalRuns)} />
        <StatCard label="连续学习" value={`${streak.current} 天（最长 ${streak.best}）`} />
        <StatCard label="成就解锁" value={`${Object.keys(achievements).length}/${ACHIEVEMENTS.length}`} />
        <StatCard label="每日挑战" value={String(counters.dailyDone)} />
        <StatCard label="一发入魂" value={String(counters.firstTryWins)} />
      </div>

      {/* 数据管理 */}
      <div className="rounded-2xl border border-night-700 bg-night-900 p-5">
        <h2 className="mb-1 font-bold text-slate-100">数据管理</h2>
        <p className="mb-4 text-xs text-slate-500">进度保存在浏览器 localStorage 中 —— 换设备或清理浏览器前请先导出备份。</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportData} className="flex items-center gap-1.5 rounded-lg bg-quest-500/15 px-3.5 py-2 text-sm font-semibold text-quest-300 hover:bg-quest-500/25">
            <Download size={14} /> 导出进度
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg border border-night-600 px-3.5 py-2 text-sm font-semibold text-slate-300 hover:bg-night-800"
          >
            <Upload size={14} /> 导入进度
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              f.text().then(importData);
              e.target.value = '';
            }}
          />
          <button
            onClick={() => {
              if (confirm('确定清空全部进度吗？此操作不可恢复！建议先导出备份。')) {
                resetAll();
                emitToast({ kind: 'info', text: '进度已重置，新的旅程开始！' });
              }
            }}
            className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 px-3.5 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/10"
          >
            <RotateCcw size={14} /> 重置全部
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-600">
        智码 CodeQuest · 代码在浏览器中经由云端编译服务真实执行 · 无需本地环境
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-night-700 bg-night-900 p-3.5">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-0.5 text-lg font-bold text-slate-100">{value}</div>
    </div>
  );
}
