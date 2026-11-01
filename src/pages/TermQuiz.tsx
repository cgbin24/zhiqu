import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, ChevronLeft, RotateCcw, XCircle } from 'lucide-react';
import { buildQuizRound, type QuizQuestion } from '@/game/term-quiz';
import { getTerm } from '@/data/terms';
import { emitToast } from '@/lib/toast-bus';
import { useProgress } from '@/store/progress';

const ROUND_SIZE = 10;

export function TermQuiz() {
  const [round, setRound] = useState(0);
  const [questions] = useState<QuizQuestion[]>(() => buildQuizRound(ROUND_SIZE));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState<null | { xpGained: number; perfect: boolean }>(null);
  const settle = useProgress((s) => s.recordQuiz);

  const q = questions[idx];
  const terms = useMemo(() => questions, [round]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!q && !finished) {
    return <div className="py-24 text-center text-slate-400">题库为空</div>;
  }

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const isCorrect = q!.options[i].correct;
    if (isCorrect) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      const res = settle(correctCount, questions.length);
      setFinished(res);
      if (res.newAchievements.length > 0) emitToast({ kind: 'achievement', achievements: res.newAchievements });
      if (res.perfect) {
        confetti({ particleCount: 130, spread: 70, origin: { y: 0.6 } });
      }
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setRound((r) => r + 1);
    setIdx(0);
    setPicked(null);
    setCorrectCount(0);
    setFinished(null);
    window.location.reload();
  };

  if (finished) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-quest-500 to-fuchsia-500 text-4xl shadow-xl shadow-quest-500/30">
            {finished.perfect ? '🏆' : correctCount >= 6 ? '🎯' : '💪'}
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-100">
            {finished.perfect ? '满分！术语通！' : `${correctCount} / ${questions.length} 正确`}
          </h1>
          <div className="mt-2 font-bold text-gold-300">⚡ 获得 {finished.xpGained} XP {finished.perfect && <span className="ml-1 text-xs text-fuchsia-300">含满分奖励 +10</span>}</div>
          <p className="mt-3 text-sm text-slate-400">
            {correctCount < 6 ? '多翻翻术语详情再来一轮，熟能生巧！' : '继续巩固，向词汇大师进发！'}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button onClick={restart} className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-quest-500 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-white hover:brightness-110">
              <RotateCcw size={14} /> 再来一轮
            </button>
            <Link to="/terms" className="flex items-center gap-1.5 rounded-lg border border-night-600 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-night-800">
              <ChevronLeft size={14} /> 返回百科
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-3">
        <Link to="/terms" className="text-sm text-slate-500 hover:text-slate-300">← 术语百科</Link>
        <div className="ml-auto text-xs text-slate-400">
          第 {idx + 1}/{questions.length} 题 · 已答对 {correctCount}
        </div>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-night-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-quest-500 to-fuchsia-500 transition-all duration-300"
          style={{ width: `${((idx + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${round}-${idx}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.22 }}
          className="rounded-2xl border border-night-700 bg-night-900 p-6"
        >
          <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-quest-400">
            {{ 'summary-to-term': '看描述 · 猜术语', 'term-to-summary': '选定义', relation: '找关联' }[q!.kind]}
          </div>
          <h2 className="whitespace-pre-line text-lg font-bold leading-relaxed text-slate-100">{q!.prompt}</h2>

          <div className="mt-5 space-y-2">
            {q!.options.map((opt, i) => {
              const state =
                picked === null
                  ? 'idle'
                  : opt.correct
                    ? 'correct'
                    : picked === i
                      ? 'wrong'
                      : 'dim';
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
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
              <div className="text-xs leading-relaxed text-slate-300">{q!.explain}</div>
              <div className="mt-2 flex items-center gap-2">
                <Link to={`/terms/${getTerm(q!.termId)?.cat}/${q!.termId}`} className="text-[11px] text-quest-400 hover:underline">
                  查看词条详情 →
                </Link>
                <button onClick={next} className="ml-auto rounded-lg bg-quest-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-quest-600">
                  {idx + 1 >= questions.length ? '查看结果' : '下一题 →'}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 text-center text-[11px] text-slate-600">答对每题 +2 XP · 一轮满分额外 +10 XP · {terms.length} 题本轮</p>
    </div>
  );
}
