import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  BookOpen, ChevronLeft, ChevronRight, Eye, Lightbulb, Loader2, Lock, Play, RotateCcw,
} from 'lucide-react';
import { Send, Terminal, Trophy } from 'lucide-react';
import { agentPreamble } from '@/data/agent-runtime';
import { CodeEditor } from '@/components/CodeEditor';
import { Markdown } from '@/components/Markdown';
import { DiffView } from '@/components/DiffView';
import { Stars } from '@/components/Stars';
import { AlgoVisualizer } from '@/components/AlgoVisualizer';
import { SnippetDrawer } from '@/components/SnippetDrawer';
import { BookMarked, StickyNote } from 'lucide-react';
import { COURSE_MAP, LANG_MAP, getModuleName } from '@/data/languages/registry';
import { dailyLevel, getLevel, nextLevel, isLevelUnlocked } from '@/data/languages';
import { MODULE_MAP } from '@/data/modules';
import { getRank } from '@/data/ranks';
import { DIFFICULTY_COLOR, DIFFICULTY_LABEL } from '@/game/xp';
import { executeCode, judgeLevel } from '@/judge/judge';
import { emitToast } from '@/lib/toast-bus';
import { starsFor, todayKey, useProgress } from '@/store/progress';
import type { ExecResult, JudgeCaseResult, JudgeResult, LanguageId } from '@/types';

type Tab = 'task' | 'brief' | 'hints' | 'notes' | 'tests';

export function LevelPlay() {
  const { id } = useParams<{ id: string }>();
  const level = getLevel(id);
  const navigate = useNavigate();

  const levelStats = useProgress((s) => s.levelStats);
  const drafts = useProgress((s) => s.drafts);
  const saveDraft = useProgress((s) => s.saveDraft);
  const recordRun = useProgress((s) => s.recordRun);
  const recordSubmission = useProgress((s) => s.recordSubmission);
  const recordHint = useProgress((s) => s.recordHint);
  const hintsUsedFn = useProgress((s) => s.hintsUsedThisLevel);
  const completeLevel = useProgress((s) => s.completeLevel);
  const setLastLevel = useProgress((s) => s.setLastLevel);
  const saveNote = useProgress((s) => s.saveNote);
  const notes = useProgress((s) => s.notes);

  const [tab, setTab] = useState<Tab>('task');
  const [hintsOpen, setHintsOpen] = useState(0);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [code, setCode] = useState('');
  const [stdin, setStdin] = useState('');
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<ExecResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [judge, setJudge] = useState<JudgeResult | null>(null);
  const [judgeProgress, setJudgeProgress] = useState({ done: 0, total: 0 });
  const [execLang, setExecLang] = useState<LanguageId>('javascript');
  const [snippetOpen, setSnippetOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [victory, setVictory] = useState<null | {
    stars: number; xpGained: number; isDaily: boolean; newAchievements: number; rankUp: string | null;
  }>(null);
  const rankBefore = useRef(getRank(useProgress.getState().xp).rank.name);
  const confettiFired = useRef(false);

  const lang = level ? LANG_MAP[level.lang as LanguageId] : undefined;
  const course = level ? COURSE_MAP[level.lang] : undefined;
  const isAlgo = Boolean(level?.algo);
  const stat = level ? levelStats[level.id] : undefined;
  const completed = Boolean(stat && stat.stars > 0);
  const isDaily = level ? dailyLevel().id === level.id : false;
  const dailyNotDone = isDaily && useProgress.getState().dailyLog[todayKey()] !== level?.id;
  const unlocked = level ? isLevelUnlocked(level, new Set(Object.keys(levelStats).filter((k) => levelStats[k].stars > 0))) : false;
  const next = level ? nextLevel(level) : undefined;

  const draftKey = isAlgo ? `${level?.id}:${execLang}` : (level?.id ?? '');
  const currentStarter = level ? (level.algo?.starters[execLang] ?? level.starter ?? '') : '';
  const currentSolution = level ? (level.algo?.solutions[execLang] ?? level.solution ?? '') : '';
  const execMonaco = isAlgo ? LANG_MAP[execLang].monaco : (lang?.monaco ?? 'plaintext');
  const execFileName = isAlgo ? LANG_MAP[execLang].fileName : (lang?.fileName ?? 'main');

  const switchExecLang = (l: LanguageId) => {
    if (!level) return;
    setExecLang(l);
    const draft = drafts[`${level.id}:${l}`];
    setCode(draft ?? level.algo?.starters[l] ?? '');
    setRunResult(null);
  };

  useEffect(() => {
    if (!level) return;
    const defaultLang = level.lang === 'linux' ? 'bash' : 'javascript';
    setExecLang(defaultLang);
    const initDraft = level.algo ? drafts[`${level.id}:${defaultLang}`] : drafts[level.id];
    setCode(initDraft ?? level.algo?.starters[defaultLang] ?? level.starter ?? '');
    setRunResult(null);
    setJudge(null);
    setVictory(null);
    setHintsOpen(0);
    setAnswerOpen(false);
    setTab('task');
    setStdin(level.tests.find((t) => !t.hidden)?.stdin ?? '');
    setNoteText(notes[level.id] ?? '');
    rankBefore.current = getRank(useProgress.getState().xp).rank.name;
    confettiFired.current = false;
    setLastLevel(level.id);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level?.id]);

  // 笔记防抖保存
  const noteTimer = useRef<ReturnType<typeof setTimeout>>();
  const onNoteChange = useCallback(
    (v: string) => {
      setNoteText(v);
      clearTimeout(noteTimer.current);
      noteTimer.current = setTimeout(() => saveNote(level?.id ?? '', v), 700);
    },
    [level?.id, saveNote],
  );

  // 键盘快捷键：Ctrl+Enter 运行，Ctrl+S 保存草稿
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!running && !submitting) doRun();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveDraft(draftKey, code);
        emitToast({ kind: 'info', text: '草稿已保存' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, submitting, draftKey, code]);

  // 代码草稿防抖保存（算法关按作答语言分键）
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const onCodeChange = useCallback(
    (v: string) => {
      setCode(v);
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveDraft(draftKey, v), 600);
    },
    [draftKey, saveDraft],
  );

  if (!level || !course) {
    return (
      <div className="grid place-items-center py-24 text-slate-400">
        <div className="text-center">
          <p className="text-lg">关卡不存在</p>
          <Link to="/learn" className="mt-3 inline-block text-quest-400 hover:underline">返回闯关地图</Link>
        </div>
      </div>
    );
  }

  if (!unlocked && !isDaily) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <Lock size={44} className="mx-auto text-slate-600" />
        <h1 className="mt-4 text-xl font-bold text-slate-200">{level.title}</h1>
        <p className="mt-2 text-sm text-slate-500">此关卡尚未解锁 —— 先完成同语言的前序关卡吧！</p>
        <Link
          to={`/learn/${level.lang}`}
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-quest-500 px-4 py-2 text-sm font-semibold text-white hover:bg-quest-600"
        >
          <ChevronLeft size={16} /> 返回关卡地图
        </Link>
      </div>
    );
  }

  const visibleTests = level.tests.filter((t) => !t.hidden);

  const doRun = async () => {
    if (running || submitting) return;
    setRunning(true);
    setRunResult(null);
    recordRun(false);
    try {
      const res = await executeCode({ lang: (isAlgo ? execLang : level.lang) as LanguageId, source: code, stdin, fs: level.fs, runtime: level.runtime ? agentPreamble(level.runtime) : undefined });
      setRunResult(res);
    } catch (err) {
      setRunResult({
        executed: false,
        compileError: err instanceof Error ? err.message : String(err),
        stdout: '', stderr: '', exitCode: null, provider: 'godbolt',
      });
    } finally {
      setRunning(false);
    }
  };

  const doSubmit = async () => {
    if (submitting || running) return;
    setSubmitting(true);
    setJudge(null);
    setJudgeProgress({ done: 0, total: level.tests.length });
    setTab('tests');
    try {
      const result = await judgeLevel((isAlgo ? execLang : level.lang) as LanguageId, code, level.tests, (r, done, total) => {
        setJudgeProgress({ done, total });
        setJudge((prev) => {
          const cases = prev?.cases ? [...prev.cases] : [];
          cases.push(r);
          return { verdict: 'wrong-answer', passed: cases.filter((c) => c.verdict === 'accepted').length, total, cases };
        });
      }, level.fs, level.runtime ? agentPreamble(level.runtime) : undefined);
      setJudge(result);
      const accepted = result.verdict === 'accepted';
      recordSubmission(level.id, accepted);

      if (accepted) {
        const stars = Math.max(1, starsFor(stat?.attempts ?? 0, hintsUsedFn()));
        const res = completeLevel(level, stars, { isDaily: isDaily && dailyNotDone });
        const after = getRank(useProgress.getState().xp);
        const rankUp = after.rank.name !== rankBefore.current ? after.rank.name : null;
        setVictory({
          stars,
          xpGained: res.xpGained,
          isDaily: isDaily && dailyNotDone,
          newAchievements: res.newAchievements.length,
          rankUp,
        });
        if (res.newAchievements.length > 0) {
          emitToast({ kind: 'achievement', achievements: res.newAchievements });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openHint = (idx: number) => {
    if (idx >= hintsOpen) {
      recordHint();
      setHintsOpen(idx + 1);
      emitToast({ kind: 'info', text: '使用提示会降低本关星级评价（最多 2 星）' });
    }
  };

  const resetCode = () => {
    if (confirm('确定要重置为本关起始代码吗？当前修改将丢失。')) {
      setCode(currentStarter);
      saveDraft(draftKey, currentStarter);
    }
  };

  const fireConfetti = () => {
    if (confettiFired.current) return;
    confettiFired.current = true;
    confetti({
      particleCount: 160,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#7c5cf0', '#fbbf24', '#00add8', '#f74c00', '#34d399'],
    });
    setTimeout(() => confetti({ particleCount: 90, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } }), 250);
    setTimeout(() => confetti({ particleCount: 90, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } }), 400);
  };

  const mod = MODULE_MAP[level.module];

  return (
    <div className="flex flex-col gap-4">
      {/* 顶部信息条 */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Link
          to={`/learn/${level.lang}`}
          className="flex items-center gap-1 rounded-lg border border-night-700 bg-night-850 px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:text-slate-200"
        >
          <ChevronLeft size={14} /> {course?.name} · {getModuleName(course, level.module) || mod.name}
        </Link>
        <h1 className="text-lg font-bold text-slate-100">
          <span className="mr-2 text-slate-500">#{level.order}</span>
          {level.title}
        </h1>
        <span className={`text-xs font-semibold ${DIFFICULTY_COLOR[level.difficulty]}`}>
          {'●'.repeat(level.difficulty)}{'○'.repeat(5 - level.difficulty)} {DIFFICULTY_LABEL[level.difficulty]}
        </span>
        <span className="rounded-md bg-gold-500/10 px-2 py-0.5 text-xs font-bold text-gold-300">⚡ {level.xp} XP</span>
        {isDaily && (
          <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${dailyNotDone ? 'bg-fuchsia-500/15 text-fuchsia-300' : 'bg-night-800 text-slate-500'}`}>
            🗓️ 每日挑战 {dailyNotDone ? '×1.5 XP' : '(已完成)'}
          </span>
        )}
        {completed && (
          <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-300">
            <Trophy size={12} /> 已通关 <Stars earned={stat!.stars} size="xs" />
          </span>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* 左：任务/知识/提示/结果 */}
        <div className="lg:col-span-2">
          <div className="mb-2 flex gap-1 rounded-xl border border-night-700 bg-night-900 p-1">
            {([
              ['task', '任务', Trophy],
              ['brief', '知识', BookOpen],
              ['hints', '提示', Lightbulb],
              ['notes', '笔记', StickyNote],
              ['tests', '结果', Terminal],
            ] as const).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${
                  tab === key ? 'bg-quest-500/20 text-quest-300' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon size={13} /> {label}
                {key === 'tests' && judge && (
                  <span className={judge.passed === judge.total ? 'text-emerald-400' : 'text-amber-400'}>
                    {judge.passed}/{judge.total}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="max-h-[calc(100vh-220px)] overflow-y-auto rounded-xl border border-night-700 bg-night-900 p-4 lg:sticky lg:top-20">
            {tab === 'task' && (
              <div>
                {level.visualizer && (
                  <div className="mb-3">
                    <AlgoVisualizer kind={level.visualizer.kind} param={level.visualizer.param} />
                  </div>
                )}
                <div className="mb-3 rounded-lg border border-quest-500/25 bg-quest-500/8 p-3">
                  <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-quest-400">本关目标</div>
                  <ul className="space-y-1">
                    {level.goals.map((g, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-0.5 text-quest-400">▸</span> {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <Markdown text={level.task} />
                <div className="mt-4">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    测试点（{visibleTests.length} 个可见）
                  </div>
                  <div className="space-y-2">
                    {visibleTests.map((t, i) => (
                      <div key={i} className="rounded-lg border border-night-700 bg-night-850 p-2.5">
                        <div className="mb-1.5 text-xs font-semibold text-slate-300">{t.name}</div>
                        {t.stdin && (
                          <div className="mb-1 text-[11px] text-slate-500">
                            输入：<code className="rounded bg-night-800 px-1 py-0.5 font-mono text-slate-400">{t.stdin.replace(/\n/g, '⏎')}</code>
                          </div>
                        )}
                        <pre className="whitespace-pre-wrap rounded bg-night-950 p-1.5 font-mono text-[11px] leading-relaxed text-slate-400">
                          期望：{t.expected.replace(/\n/g, '⏎')}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'notes' && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">📝 我的学习笔记（自动保存）</span>
                  <span className="text-[10px] text-slate-600">思路 / 踩坑 / 复杂度分析…</span>
                </div>
                <textarea
                  value={noteText}
                  onChange={(e) => onNoteChange(e.target.value)}
                  rows={14}
                  placeholder={'例：\n· 这题的关键是发现 xxx\n· 坑：边界 n=1 要特判\n· 复杂度 O(n log n)，1e5 规模可过'}
                  className="w-full resize-y rounded-xl border border-night-700 bg-night-950 p-3 font-mono text-xs leading-relaxed text-slate-200 outline-none focus:border-quest-500/50"
                />
              </div>
            )}

            {tab === 'brief' && (
              <div>
                {level.visualizer && (
                  <div className="mb-3">
                    <AlgoVisualizer kind={level.visualizer.kind} param={level.visualizer.param} />
                  </div>
                )}
                <Markdown text={level.brief} />
              </div>
            )}

            {tab === 'hints' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">提示分三级，从思路点拨到接近答案。使用提示会降低星级（⭐⭐ → ⭐），请先自己尝试！</p>
                {level.hints.map((h, i) => {
                  const open = i < hintsOpen;
                  const locked = i > hintsOpen;
                  return (
                    <div key={i} className={`rounded-lg border p-3 ${open ? 'border-gold-500/30 bg-gold-500/5' : 'border-night-700 bg-night-850'}`}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-bold text-gold-300">提示 {i + 1}</span>
                        {!open && (
                          <button
                            onClick={() => openHint(i)}
                            disabled={locked}
                            className="rounded-md bg-gold-500/15 px-2.5 py-1 text-xs font-semibold text-gold-300 transition-colors hover:bg-gold-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            揭示（{i + 1} 级）
                          </button>
                        )}
                      </div>
                      {open ? (
                        <Markdown text={h} className="text-sm" />
                      ) : (
                        <div className="text-xs text-slate-600">{locked ? '先揭示上一级提示' : '点击揭示……'}</div>
                      )}
                    </div>
                  );
                })}
                {hintsOpen >= 3 && (
                  <button
                    onClick={() => setAnswerOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-night-600 py-2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    <Eye size={13} /> 实在不行了……查看参考答案（本关最高 1 星）
                  </button>
                )}
              </div>
            )}

            {tab === 'tests' && (
              <JudgePanel
                judge={judge}
                submitting={submitting}
                progress={judgeProgress}
                total={level.tests.length}
              />
            )}
          </div>
        </div>

        {/* 右：编辑器 + 输出 */}
        <div className="lg:col-span-3">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md border px-2 py-1 font-mono text-xs font-semibold" style={{ borderColor: (isAlgo ? LANG_MAP[execLang].color : lang?.color ?? '#659ad2') + '55', color: isAlgo ? LANG_MAP[execLang].color : lang?.color ?? '#659ad2' }}>
              {execFileName}
            </span>
            {isAlgo && (
              <div className="flex gap-1 rounded-lg border border-night-700 bg-night-900 p-0.5">
                {(COURSE_MAP[level.lang]?.execLangs ?? ['javascript'] as LanguageId[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => switchExecLang(l)}
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
                      execLang === l ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    style={execLang === l ? { background: LANG_MAP[l].color + '33', color: LANG_MAP[l].color } : undefined}
                  >
                    {LANG_MAP[l].name}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setSnippetOpen(true)}
              className="flex items-center gap-1 rounded-md border border-night-700 px-2 py-1 text-xs text-slate-400 hover:text-amber-300"
              title="代码片段速查（常用语法）"
            >
              <BookMarked size={12} /> 片段
            </button>
            <button
              onClick={resetCode}
              className="flex items-center gap-1 rounded-md border border-night-700 px-2 py-1 text-xs text-slate-400 hover:text-slate-200"
              title="重置为起始代码"
            >
              <RotateCcw size={12} /> 重置
            </button>
            <div className="flex-1" />
            <button
              onClick={doRun}
              disabled={running || submitting}
              className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-sm font-semibold text-sky-300 transition-colors hover:bg-sky-500/20 disabled:opacity-50"
            >
              {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} 运行
            </button>
            <button
              onClick={doSubmit}
              disabled={running || submitting}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-quest-500 to-fuchsia-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-quest-500/30 transition-all hover:brightness-110 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              提交评测{submitting && ` ${judgeProgress.done}/${judgeProgress.total}`}
            </button>
          </div>

          <div className="h-[46vh] min-h-[320px] lg:h-[54vh]">
            <CodeEditor value={code} language={execMonaco} onChange={onCodeChange} />
          </div>

          <div className="mt-3">
            <details className="rounded-xl border border-night-700 bg-night-900" open>
              <summary className="cursor-pointer select-none px-3 py-2 text-xs font-semibold text-slate-400">
                标准输入 stdin（点「运行」时喂给程序）
              </summary>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                rows={2}
                spellCheck={false}
                placeholder="多行输入…"
                className="w-full resize-y rounded-b-xl bg-night-950 px-3 pb-2 pt-1 font-mono text-xs text-slate-300 outline-none"
              />
            </details>
          </div>

          <div className="mt-3 rounded-xl border border-night-700 bg-night-900 p-3">
            <RunPanel result={runResult} running={running} />
          </div>
        </div>
      </div>

      {/* 代码片段速查抽屉 */}
      <SnippetDrawer
        open={snippetOpen}
        onClose={() => setSnippetOpen(false)}
        lang={execLang}
        onLangChange={setExecLang}
      />

      {/* 通关庆祝 */}
      <AnimatePresence>
        {victory && (
          <VictoryModal
            levelTitle={level.title}
            stars={victory.stars}
            xpGained={victory.xpGained}
            isDaily={victory.isDaily}
            hasAchievements={victory.newAchievements > 0}
            rankUp={victory.rankUp}
            hasNext={Boolean(next)}
            onNext={() => next && navigate(`/level/${next.id}`)}
            onClose={() => setVictory(null)}
            onFire={() => fireConfetti()}
          />
        )}
      </AnimatePresence>

      {/* 参考答案 */}
      <AnimatePresence>
        {answerOpen && (
          <AnswerModal
            code={currentSolution}
            onClose={() => setAnswerOpen(false)}
            onCopy={() => {
              navigator.clipboard.writeText(currentSolution).then(() => {
                emitToast({ kind: 'info', text: '参考答案已复制，粘贴后先理解再提交' });
                setAnswerOpen(false);
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- 判题结果面板 ---------------- */

function JudgePanel({
  judge, submitting, progress, total,
}: { judge: JudgeResult | null; submitting: boolean; progress: { done: number; total: number }; total: number }) {
  if (submitting && !judge) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
        <Loader2 className="animate-spin text-quest-400" size={28} />
        <div className="text-sm">正在逐用例评测… {progress.done}/{progress.total}</div>
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-night-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-quest-500 to-fuchsia-500 transition-all"
            style={{ width: `${total ? (progress.done / total) * 100 : 0}%` }}
          />
        </div>
      </div>
    );
  }
  if (!judge) {
    return (
      <div className="py-8 text-center text-sm text-slate-600">
        点击「提交评测」开始判题 —— 每个测试点都会真实编译运行
      </div>
    );
  }
  const allPass = judge.verdict === 'accepted';
  return (
    <div className="space-y-2">
      <div className={`rounded-lg border p-3 text-center font-bold ${allPass ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'}`}>
        {allPass ? `🎉 通过！${judge.passed}/${judge.total} 个测试点全部正确` : `${judge.passed}/${judge.total} 个测试点通过`}
        {!allPass && (
          <div className="mt-1 text-xs font-normal text-slate-400">{VERDICT_HINT[judge.verdict] ?? ''}</div>
        )}
      </div>
      {judge.cases.map((c, i) => (
        <CaseCard key={i} c={c} />
      ))}
    </div>
  );
}

const VERDICT_BADGE: Record<string, { text: string; cls: string }> = {
  accepted: { text: '通过', cls: 'bg-emerald-500/15 text-emerald-300' },
  'wrong-answer': { text: '答案错误', cls: 'bg-rose-500/15 text-rose-300' },
  'compile-error': { text: '编译错误', cls: 'bg-orange-500/15 text-orange-300' },
  'runtime-error': { text: '运行错误', cls: 'bg-red-500/15 text-red-300' },
  timeout: { text: '超时', cls: 'bg-amber-500/15 text-amber-300' },
  'internal-error': { text: '评测异常', cls: 'bg-slate-500/15 text-slate-300' },
};

const VERDICT_HINT: Record<string, string> = {
  'wrong-answer': '输出与期望不一致',
  'compile-error': '编译失败',
  'runtime-error': '运行时出错',
  timeout: '运行超时',
  'internal-error': '评测服务异常，稍后重试',
};

function CaseCard({ c }: { c: JudgeCaseResult }) {
  const [open, setOpen] = useState(false);
  const badge = VERDICT_BADGE[c.verdict] ?? VERDICT_BADGE['internal-error'];
  const timeLabel = c.timeMs == null ? '' : c.timeMs >= 1000 ? `${(c.timeMs / 1000).toFixed(1)}s` : `${c.timeMs}ms`;
  return (
    <div className="rounded-lg border border-night-700 bg-night-850">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-2 px-3 py-2 text-left">
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${badge.cls}`}>{badge.text}</span>
        <span className="flex-1 truncate text-xs text-slate-300">{c.name}</span>
        {timeLabel && <span className="text-[10px] text-slate-600">{timeLabel}</span>}
        <ChevronRight size={13} className={`text-slate-600 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="space-y-2 border-t border-night-700 p-2.5">
          {c.compileError && (
            <pre className="max-h-32 overflow-auto whitespace-pre-wrap rounded bg-night-950 p-2 font-mono text-[11px] text-orange-300">{c.compileError}</pre>
          )}
          {c.stderr && c.verdict === 'runtime-error' && (
            <pre className="max-h-32 overflow-auto whitespace-pre-wrap rounded bg-night-950 p-2 font-mono text-[11px] text-red-300">{c.stderr}</pre>
          )}
          {c.hidden ? (
            <div className="rounded bg-night-950 p-2 text-[11px] italic text-slate-600">隐藏测试点：仅展示结果，通关后不可查看</div>
          ) : (
            c.verdict !== 'accepted' && c.verdict !== 'compile-error' && <DiffView expected={c.expected} actual={c.actual} />
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- 运行面板 ---------------- */

function RunPanel({ result, running }: { result: ExecResult | null; running: boolean }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Terminal size={13} /> 运行输出
        {result && (
          <span className="text-[10px] font-normal text-slate-600">
            via {result.provider}
            {result.timeMs != null ? ` · ${result.timeMs >= 1000 ? `${(result.timeMs / 1000).toFixed(1)}s` : `${result.timeMs}ms`}` : ''}
          </span>
        )}
      </div>
      {running && (
        <div className="flex items-center gap-2 py-3 text-sm text-slate-400">
          <Loader2 size={15} className="animate-spin text-sky-400" /> 正在云端编译运行…
        </div>
      )}
      {!running && !result && <div className="py-2 text-xs text-slate-600">点「运行」快速验证代码（不计入判题）。提交评测才会判分。</div>}
      {!running && result && (
        <div className="space-y-2">
          {!result.executed && (
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-night-950 p-2.5 font-mono text-xs leading-relaxed text-orange-300">
              {result.compileError}
            </pre>
          )}
          {result.executed && result.stdout && (
            <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-night-950 p-2.5 font-mono text-xs leading-relaxed text-emerald-200">{result.stdout}</pre>
          )}
          {result.executed && !result.stdout && (
            <div className="rounded-lg bg-night-950 p-2.5 text-xs italic text-slate-600">（无标准输出）</div>
          )}
          {result.executed && result.stderr && (
            <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-night-950 p-2.5 font-mono text-[11px] leading-relaxed text-amber-300/80">
              stderr：{result.stderr}
            </pre>
          )}
          {result.executed && (
            <div className="text-[10px] text-slate-600">
              退出码：{result.exitCode ?? '—'}{result.exitCode !== 0 && result.exitCode !== null ? '（非零退出码通常意味着运行出错）' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- 通关弹窗 ---------------- */

function VictoryModal(p: {
  levelTitle: string; stars: number; xpGained: number; isDaily: boolean; hasAchievements: boolean;
  rankUp: string | null; hasNext: boolean; onNext: () => void; onClose: () => void; onFire: () => void;
}) {
  useEffect(() => {
    p.onFire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] grid place-items-center bg-night-950/70 backdrop-blur-sm"
      onClick={p.onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="w-[min(92vw,420px)] rounded-2xl border border-gold-500/30 bg-night-850 p-6 text-center shadow-2xl shadow-gold-500/10"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-orange-500 text-4xl shadow-lg shadow-gold-500/40"
        >
          🏆
        </motion.div>
        <h2 className="mt-4 text-xl font-black text-slate-100">关卡通关！</h2>
        <p className="mt-1 text-sm text-slate-400">{p.levelTitle}</p>

        <motion.div
          initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35 }}
          className="mt-3 flex justify-center"
        >
          <Stars earned={p.stars} size="lg" />
        </motion.div>

        <div className="mt-4 space-y-1.5 text-sm">
          {p.xpGained > 0 ? (
            <div className="font-bold text-gold-300">
              ⚡ 获得 {p.xpGained} XP {p.isDaily && <span className="ml-1 rounded bg-fuchsia-500/20 px-1.5 py-0.5 text-xs text-fuchsia-300">每日挑战 ×1.5</span>}
            </div>
          ) : (
            <div className="text-xs text-slate-500">再次通关不重复获得 XP，继续冲击 3 星吧！</div>
          )}
          {p.rankUp && <div className="font-bold text-quest-400">👑 段位晋升：{p.rankUp}！</div>}
          {p.hasAchievements && <div className="text-xs text-emerald-300">🎖️ 有新成就解锁（见右上角）</div>}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={p.onClose}
            className="flex-1 rounded-lg border border-night-600 py-2.5 text-sm font-semibold text-slate-300 hover:bg-night-800"
          >
            留在本关
          </button>
          {p.hasNext ? (
            <button
              onClick={p.onNext}
              className="flex-1 rounded-lg bg-gradient-to-r from-quest-500 to-fuchsia-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-quest-500/30 hover:brightness-110"
            >
              下一关 →
            </button>
          ) : (
            <button onClick={p.onClose} className="flex-1 rounded-lg bg-quest-500 py-2.5 text-sm font-bold text-white">
              太棒了！
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AnswerModal({ code, onClose, onCopy }: { code: string; onClose: () => void; onCopy: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] grid place-items-center bg-night-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-[min(92vw,680px)] rounded-2xl border border-night-600 bg-night-850 p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-100">参考答案</h3>
          <div className="flex gap-2">
            <button onClick={onCopy} className="rounded-lg bg-quest-500/20 px-3 py-1.5 text-xs font-semibold text-quest-300 hover:bg-quest-500/30">
              复制到剪贴板
            </button>
            <button onClick={onClose} className="rounded-lg border border-night-600 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200">
              关闭
            </button>
          </div>
        </div>
        <pre className="max-h-[60vh] overflow-auto rounded-xl bg-night-950 p-3 font-mono text-xs leading-relaxed text-slate-300">{code}</pre>
        <p className="mt-2 text-center text-[11px] text-slate-600">先理解思路，再自己敲一遍 —— 复制提交只能拿 1 星哦</p>
      </motion.div>
    </motion.div>
  );
}
