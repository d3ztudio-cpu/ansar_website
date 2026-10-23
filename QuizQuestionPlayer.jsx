import React, { useEffect, useRef, useState } from 'react';
import { formatDuration } from './quizUtils';

const formatCountdown = ms => {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

export default function QuizQuestionPlayer({ quiz, questions, answers, remainingMs, setAnswer, recordQuestionTime, submit, onSecurityEvent, loadingError, onRetryQuestions }) {
  const [index, setIndex] = useState(0);
  const enteredAt = useRef(Date.now());
  const moving = useRef(false);
  const timedOut = useRef(false);
  const securityEventReported = useRef(false);
  const question = questions[index];
  const splitTiming = quiz?.timingMode === 'per-question';
  const perQuestionMs = splitTiming ? Math.max(5, Number(quiz?.questionSeconds) || 20) * 1000 : 0;
  const totalMs = splitTiming ? perQuestionMs * questions.length : Math.max(0, Number(quiz?.durationMinutes || 0) * 60000);
  const elapsedMs = Math.max(0, totalMs - remainingMs);
  const currentSlot = splitTiming && perQuestionMs ? Math.floor(elapsedMs / perQuestionMs) : index;
  const splitExamEnded = splitTiming && elapsedMs >= totalMs;
  const questionRemainingMs = splitTiming && perQuestionMs
    ? (splitExamEnded ? 0 : Math.max(0, perQuestionMs - (elapsedMs % perQuestionMs)))
    : remainingMs;

  useEffect(() => { enteredAt.current = Date.now(); }, [index]);

  useEffect(() => {
    const reportSecurityEvent = reason => {
      if (!securityEventReported.current) {
        securityEventReported.current = true;
        onSecurityEvent?.(reason);
      }
    };
    const onVisibilityChange = () => { if (document.hidden) reportSecurityEvent('Exam tab was hidden'); };
    const onKeyDown = event => {
      if (event.key === 'F11') { event.preventDefault(); reportSecurityEvent('Fullscreen shortcut was used'); }
      if (event.key === 'Escape') event.preventDefault();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [onSecurityEvent]);

  const saveTime = async () => {
    if (!question) return {};
    const spent = Date.now() - enteredAt.current;
    enteredAt.current = Date.now();
    return recordQuestionTime(question.id, spent);
  };

  const move = async nextIndex => {
    if (moving.current) return;
    moving.current = true;
    try { await saveTime(); setIndex(nextIndex); } finally { moving.current = false; }
  };

  const finish = async () => {
    if (moving.current) return;
    moving.current = true;
    try { const timings = await saveTime(); await submit(false, timings); } finally { moving.current = false; }
  };

  useEffect(() => {
    if (!splitTiming || !questions.length || moving.current) return;

    // Split mode is strictly slot-based. If an older page state was moved
    // manually, bring it back to the active slot before processing expiry.
    if (currentSlot < index) {
      setIndex(currentSlot);
      return;
    }

    // A slot is over as soon as the next slot begins. Store an explicit blank
    // answer for every missed question, then move forward even if Firestore is
    // temporarily slow. Blank answers are scored as wrong by the result flow.
    if ((splitExamEnded || currentSlot >= questions.length) && !timedOut.current) {
      timedOut.current = true;
      moving.current = true;
      const expiredQuestion = questions[Math.min(index, questions.length - 1)];
      if (expiredQuestion && !answers[expiredQuestion.id]) setAnswer(expiredQuestion.id, '');
      saveTime().then(timings => submit(true, timings)).finally(() => { moving.current = false; });
      return;
    }

    if (currentSlot > index) {
      moving.current = true;
      const expiredQuestion = questions[index];
      if (expiredQuestion && !answers[expiredQuestion.id]) setAnswer(expiredQuestion.id, '');
      saveTime().finally(() => {
        setIndex(currentSlot);
        moving.current = false;
      });
    }
  }, [answers, currentSlot, index, questions, splitExamEnded, splitTiming]);

  useEffect(() => {
    if ((splitTiming || remainingMs !== 0) || timedOut.current || !question) return;
    timedOut.current = true;
    moving.current = true;
    saveTime().then(timings => submit(true, timings)).finally(() => { moving.current = false; });
  }, [remainingMs, question?.id, splitTiming]);

  useEffect(() => {
    if (quiz?.status !== 'ended' || timedOut.current || !question) return;
    timedOut.current = true;
    moving.current = true;
    saveTime().then(timings => submit(false, timings, true)).finally(() => { moving.current = false; });
  }, [quiz?.status, question?.id]);

  if (!question) return <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center text-white"><section className="max-w-lg rounded-3xl border border-white/15 bg-white/5 p-8"><p className="text-xl font-bold">{loadingError || 'Loading questions…'}</p><p className="mt-3 text-sm leading-6 text-slate-300">Your exam session is active. Please keep this page open while we reconnect.</p>{onRetryQuestions && <button onClick={onRetryQuestions} className="mt-6 rounded-xl bg-indigo-500 px-5 py-3 font-black text-white">Retry loading questions</button>}</section></main>;

  return <main onContextMenu={e => e.preventDefault()} onCopy={e => e.preventDefault()} onPaste={e => e.preventDefault()} className="min-h-screen select-none bg-slate-950 p-4 text-white sm:p-8">
    <div className="mx-auto max-w-4xl">
      <header className="sticky top-0 z-10 rounded-2xl bg-indigo-700 p-4 shadow-xl sm:flex sm:items-center sm:justify-between">
        <div><p className="text-xs font-black uppercase text-indigo-200">Question {index + 1} of {questions.length}</p><h1 className="text-xl font-black">{quiz?.title}</h1></div>
        <div className={`mt-3 rounded-xl px-4 py-2 text-center font-mono text-xl sm:mt-0 ${questionRemainingMs <= 60000 ? 'animate-pulse bg-red-600' : 'bg-slate-950'}`}><span className="block text-[10px] font-sans font-black uppercase tracking-wide text-indigo-100">{splitTiming ? 'This question' : 'Entire exam'}</span>{splitTiming ? formatCountdown(questionRemainingMs) : formatDuration(questionRemainingMs)}</div>
      </header>

      <div className="mt-5 flex gap-1">{questions.map((item, itemIndex) => <span key={item.id} className={`h-2 flex-1 rounded-full ${itemIndex === index ? 'bg-amber-400' : answers[item.id] ? 'bg-emerald-500' : 'bg-slate-700'}`} />)}</div>

      <section className="mt-8 min-h-[360px] rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-10">
        <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Question {index + 1}</p>
        <h2 className="mt-4 text-2xl font-black leading-relaxed sm:text-3xl">{question.question}</h2>
        {question.type === 'choice' ? <div className="mt-8 grid gap-4 sm:grid-cols-2">{question.options.map(option => <label key={option} className={`cursor-pointer rounded-2xl border-2 p-5 text-lg font-bold transition ${answers[question.id] === option ? 'border-indigo-600 bg-indigo-50 text-indigo-800' : 'border-slate-200 hover:border-indigo-300'}`}><input type="radio" className="mr-3" checked={answers[question.id] === option} onChange={() => setAnswer(question.id, option)} />{option}</label>)}</div> : <input value={answers[question.id] || ''} onChange={e => setAnswer(question.id, e.target.value)} maxLength="300" className="mt-8 w-full rounded-2xl border-2 p-5 text-lg outline-none focus:border-indigo-500" placeholder="Type your answer" />}
      </section>

      <nav className="mt-6 flex items-center justify-between gap-4">
        <button disabled={splitTiming || index === 0} onClick={() => move(index - 1)} className="rounded-2xl border border-white/30 px-6 py-4 font-black disabled:invisible">← Previous</button>
        <span className="text-sm font-bold text-slate-400">Answered {Object.values(answers).filter(Boolean).length}/{questions.length}</span>
        {index < questions.length - 1 ? <button disabled={splitTiming} onClick={() => move(index + 1)} title={splitTiming ? 'Questions advance automatically when the timer ends.' : undefined} className="rounded-2xl bg-indigo-500 px-7 py-4 font-black disabled:cursor-not-allowed disabled:opacity-45">{splitTiming ? 'Auto-advance' : 'Next →'}</button> : <button onClick={finish} className="rounded-2xl bg-amber-400 px-7 py-4 font-black text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-200">Submit exam</button>}
      </nav>
    </div>
  </main>;
}
