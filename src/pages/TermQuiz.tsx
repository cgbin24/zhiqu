import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, RotateCcw, Timer, XCircle, Zap } from 'lucide-react';import { buildQuizRound, buildReviewRound, buildRushPool, type QuizQuestion } from '@/game/term-quiz';
import { getTerm } from '@/data/terms';
import { emitToast } from '@/lib/toast-bus';
import { useProgress } from '@/store/progress';

type Mode = 'menu' | 'classic' | 'rush' | 'review';
const ROUND_SIZE = 10;
const RUSH_SECONDS = 60;

export function TermQuiz() {
  const [mode, setMode] = useState<Mode>('menu');
  const quizWrong = useProgress((s) => s.quizWrong);
  const wrongCount = Object.keys(quizWrong).length;

  if (mode === 'menu') {
    return <ModeMenu wrongCount={wrongCount} onPick={setMode} />;
  }
  if (mode === 'rush') return <RushGame onExit={() => setMode('menu')} />;
  if (mode === 'review') return <ReviewGame questions={buildReviewRound(Object.keys(quizWrong))} onExit={() => setMode('menu')} />;
  return <ClassicGame onExit={() => setMode('menu')} />;
}

/* ================= 模式选择 ================= */

function ModeMenu({ wrongCount, onPick }: { wrongCount: number; onPick: (m: Mode) => void }) {
  const rushBest = useProgress((s) => s.counters.quizRushBest);
  const cards = [
    {
      m: 'classic' as Mode, icon: '📚', title: '经典测验', desc: '10 题一轮，答对 +2 XP，满分额外 +10',
      badge: '稳妥涨分', grad: 'from-quest-500/60 to-fuchsia-500/40', enabled: true,
    },
    {
      m: 'rush' as Mode, icon: '⚡', title: '60 秒速答', desc: '限时 60 秒无限出题，连击越久加成越高，答对每题 +1 XP',
      badge: rushBest > 0 ? `个人最佳：${rushBest} 题` : '极限挑战', grad: 'from-amber-500/60 to-rose-500/40', enabled: true,
    },
    {
      m: 'review' as Mode, icon: '📖', title: '错题复习', desc: '只出你答错过的术语，全部答对即可清空错题本',
      badge: wrongCount > 0 ? `${wrongCount} 个待复习` : '错题本是空的', grad: 'from-emerald-500/60 to-teal-500/40', enabled: wrongCount > 0,
    },
  ];
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/terms" className="text-sm text-slate-500 hover:text-slate-300">← 术语百科</Link>
      <h1 className="mt-4 text-xl font-black text-slate-100">选择挑战模式</h1>
      <div className="mt-4 space-y-3">
        {cards.map((c) => (
          <button
            key={c.m}
            onClick={() => c.enabled && onPick(c.m)}
            disabled={!c.enabled}
            className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
              c.enabled
                ? `border-night-700 bg-gradient-to-r ${c.grad} bg-night-900 hover:border-quest-500/60 hover:shadow-lg`
                : 'cursor-not-allowed border-night-800 bg-night-900/50 opacity-50'
            }`}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-night-800 text-2xl">{c.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold text-slate-100">{c.title}</span>
              <span className="mt-0.5 block text-xs text-slate-400">{c.desc}</span>
            </span>
            <span className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold ${c.enabled ? 'bg-night-800 text-amber-300' : 'bg-night-850 text-slate-600'}`}>
              {c.badge}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================= 经典模式（10 题） ================= */

function ClassicGame({ onExit }: { onExit: () => void }) {
  const questions = useMemo(() => buildQuizRound(ROUND_SIZE), []);
  return <QuizFlow questions={questions} onExit={onExit} />;
}

/* ================= 错题复习 ================= */

function ReviewGame({ questions, onExit }: { questions: QuizQuestion[]; onExit: () => void }) {
  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="mt-4 text-lg font-bold text-slate-100">错题本已清空！</h2>
        <p className="mt-2 text-sm text-slate-400">去经典测验或速答模式继续巩固吧。</p>
        <Link to="/terms/quiz" className="mt-4 inline-block text-quest-400 hover:underline">返回选择模式</Link>
      </div>
    );
  }
  return <QuizFlow questions={questions} onExit={onExit} />;
}

function QuizFlow({
  questions, onExit,
}: { questions: QuizQuestion[]; onExit: () => void }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState<null | { xpGained: number; perfect: boolean; newAchievements: number }>(null);
  const settle = useProgress((s) => s.recordQuiz);

  const q = questions[idx];

  if (!q && !finished) {
    return <div className="py-24 text-center text-slate-400">题库为空</div>;
  }

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (q!.options[i].correct) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      const res = settle(correctCount, questions.length);
      setFinished({ xpGained: res.xpGained, perfect: res.perfect, newAchievements: res.newAchievements.length });
      if (res.newAchievements.length > 0) emitToast({ kind: 'achievement', achievements: res.newAchievements });
      if (res.perfect) confetti({ particleCount: 130, spread: 70, origin: { y: 0.6 } });
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    window.location.reload();
  };

  if (finished) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-quest-500 to-fuchsia-500 text-4xl shadow-xl shadow-quest-500/30">
            {finished.perfect ? '🏆' : correctCount >= questions.length * 0.6 ? '🎯' : '💪'}
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-100">
            {correctCount} / {questions.length} 正确
          </h2>
          <div className="mt-2 font-bold text-gold-300">⚡ 获得 {finished.xpGained} XP</div>
          <div className="mt-6 flex justify-center gap-2">
            <button onClick={restart} className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-quest-500 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-white hover:brightness-110">
              <RotateCcw size={14} /> 再来一轮
            </button>
            <Link to="/terms" className="flex items-center gap-1.5 rounded-lg border border-night-600 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-night-800">
              返回百科
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <QuizHeader onExit={onExit} idx={idx} total={questions.length} correct={correctCount} />
      <QuestionCard
        q={q!}
        picked={picked}
        onPick={pick}
        onNext={next}
        isLast={idx + 1 >= questions.length}
      />
    </div>
  );
}

/* ================= 60 秒速答 ================= */

function RushGame({ onExit }: { onExit: () => void }) {
  const pool = useMemo(() => buildRushPool(60), []);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(RUSH_SECONDS);
  const [done, setDone] = useState(false);
  const settle = useProgress((s) => s.recordQuiz);

  const q = pool[idx];

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setDone(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [done]);

  // 时间到 → 结算
  useEffect(() => {
    if (!done) return;
    settle(correct, correct + wrongIds.length, { rush: true, bestStreak, wrongTermIds: wrongIds });
    if (correct >= 10) confetti({ particleCount: 140, spread: 75, origin: { y: 0.6 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const pick = (i: number) => {
    if (picked !== null || done) return;
    setPicked(i);
    const isCorrect = q!.options[i].correct;
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
      setWrongIds((w) => [...w, q!.termId]);
    }
    setTimeout(() => {
      setPicked(null);
      setIdx((v) => v + 1);
    }, 350);
  };

  // 题池耗尽也结束
  useEffect(() => {
    if (idx >= pool.length && !done) setDone(true);
  }, [idx, pool.length, done]);

  if (done) {
    return <RushResult correct={correct} bestStreak={bestStreak} />;
  }
  if (!q) return <div className="py-24 text-center text-slate-400">出题中…</div>;

  const timeColor = timeLeft <= 10 ? 'text-rose-400' : timeLeft <= 20 ? 'text-amber-300' : 'text-emerald-300';
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center gap-3">
        <button onClick={onExit} className="text-sm text-slate-500 hover:text-slate-300">← 退出</button>
        <motion.div
          key={timeLeft}
          initial={{ scale: timeLeft <= 5 ? 1.3 : 1 }}
          className={`ml-auto flex items-center gap-1.5 font-mono text-2xl font-black tabular-nums ${timeColor}`}
        >
          <Timer size={18} /> {String(timeLeft).padStart(2, '0')}s
        </motion.div>
        <div className="flex items-center gap-1 text-sm font-bold text-slate-300">
          {streak >= 3 && <span className="animate-pulse text-orange-400">🔥{streak}</span>}
          <span className="text-slate-500">答对</span> {correct}
        </div>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-night-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500"
          animate={{ width: `${(timeLeft / RUSH_SECONDS) * 100}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="rounded-2xl border border-night-700 bg-night-900 p-6"
        >
          <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
            {{ 'summary-to-term': '看描述 · 猜术语', 'term-to-summary': '选定义', relation: '找关联' }[q.kind]}
          </div>
          <h2 className="whitespace-pre-line text-lg font-bold leading-relaxed text-slate-100">{q.prompt}</h2>
          <div className="mt-5 grid gap-2">
            {q.options.map((opt, i) => {
              const state =
                picked === null ? 'idle' : opt.correct ? 'correct' : picked === i ? 'wrong' : 'dim';
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={`rounded-xl border p-3 text-left text-sm transition-all ${
                    state === 'idle'
                      ? 'border-night-700 bg-night-850 hover:border-amber-400/60 hover:bg-night-800'
                      : state === 'correct'
                        ? 'border-emerald-500/60 bg-emerald-500/15 font-semibold text-emerald-300'
                        : state === 'wrong'
                          ? 'border-rose-500/60 bg-rose-500/10 text-rose-300'
                          : 'border-night-800 bg-night-850/40 text-slate-600'
                  }`}
                >
                  <span className="mr-2 inline-flex items-center gap-1">
                    {state === 'correct' && <CheckCircle2 size={15} />}
                    {state === 'wrong' && <XCircle size={15} />}
                    {'ABCD'[i]}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
      <p className="mt-4 text-center text-[11px] text-slate-600">
        <Zap size={11} className="mr-0.5 inline text-amber-400" />
        答对每题 +1 XP · 连击 5 的倍数额外 +3 XP · 结束后自动结算
      </p>
    </div>
  );
}

function RushResult({ correct, bestStreak }: { correct: number; bestStreak: number }) {
  const rushBest = useProgress((s) => s.counters.quizRushBest);
  const isNewRecord = correct >= rushBest && correct > 0;
  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220 }}>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-4xl shadow-xl shadow-amber-500/30">
          ⚡
        </div>
        <h2 className="mt-4 text-3xl font-black text-slate-100">{correct} 题</h2>
        <div className="mt-1 text-sm text-slate-400">60 秒 · 最长连击 🔥{bestStreak}</div>
        {isNewRecord && <div className="mt-2 inline-block rounded-lg bg-gold-500/20 px-3 py-1 text-xs font-bold text-gold-300">🏅 新纪录！</div>}
        <div className="mt-4 text-sm text-slate-400">历史最佳：{Math.max(rushBest, correct)} 题</div>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white hover:brightness-110">
            <RotateCcw size={14} /> 再来一局
          </button>
          <Link to="/terms" className="flex items-center gap-1.5 rounded-lg border border-night-600 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-night-800">
            返回百科
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ================= 共用小组件 ================= */

function QuizHeader({ onExit, idx, total, correct }: { onExit: () => void; idx: number; total: number; correct: number }) {
  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <button onClick={onExit} className="text-sm text-slate-500 hover:text-slate-300">← 术语百科</button>
        <div className="ml-auto text-xs text-slate-400">
          第 {Math.min(idx + 1, total)}/{total} 题 · 已答对 {correct}
        </div>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-night-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-quest-500 to-fuchsia-500 transition-all duration-300"
          style={{ width: `${(idx / total) * 100}%` }}
        />
      </div>
    </>
  );
}

function QuestionCard({
  q, picked, onPick, onNext, isLast,
}: {
  q: QuizQuestion; picked: number | null; onPick: (i: number) => void; onNext: () => void; isLast: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={q.termId + String(q.prompt).slice(0, 8)}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.22 }}
        className="rounded-2xl border border-night-700 bg-night-900 p-6"
      >
        <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-quest-400">
          {{ 'summary-to-term': '看描述 · 猜术语', 'term-to-summary': '选定义', relation: '找关联' }[q.kind]}
        </div>
        <h2 className="whitespace-pre-line text-lg font-bold leading-relaxed text-slate-100">{q.prompt}</h2>
        <div className="mt-5 space-y-2">
          {q.options.map((opt, i) => {
            const state =
              picked === null ? 'idle' : opt.correct ? 'correct' : picked === i ? 'wrong' : 'dim';
            return (
              <button
                key={i}
                onClick={() => onPick(i)}
                disabled={picked !== null}
                className={`w-full rounded-xl border p-3.5 text-left text-sm transition-all ${
                  state === 'idle'
                    ? 'border-night-700 bg-night-850 hover:border-quest-500/60 hover:bg-night-800'
                    : state === 'correct'
                      ? 'border-emerald-500/60 bg-emerald-500/10 font-semibold text-emerald-300'
                      : state === 'wrong'
                        ? 'border-rose-500/60 bg-rose-500/10 text-rose-300'
                        : 'border-night-800 bg-night-850/40 text-slate-600'
                }`}
              >
                <span className="mr-2 inline-flex items-center gap-1">
                  {state === 'correct' && <CheckCircle2 size={15} />}
                  {state === 'wrong' && <XCircle size={15} />}
                  {'ABCD'[i]}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-night-700 bg-night-850 p-3.5">
            <div className="text-xs leading-relaxed text-slate-300">{q.explain}</div>
            <div className="mt-2 flex items-center gap-2">
              <Link to={`/terms/${getTerm(q.termId)?.cat}/${q.termId}`} className="text-[11px] text-quest-400 hover:underline">
                查看词条详情 →
              </Link>
              <button onClick={onNext} className="ml-auto rounded-lg bg-quest-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-quest-600">
                {isLast ? '查看结果' : '下一题 →'}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
