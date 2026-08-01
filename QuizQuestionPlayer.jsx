import React, { useEffect, useRef, useState } from 'react';
import { formatDuration } from './quizUtils';

export default function QuizQuestionPlayer({ quiz, questions, answers, remainingMs, setAnswer, recordQuestionTime, submit }) {
  const [index, setIndex] = useState(0);
  const enteredAt = useRef(Date.now());
  const moving = useRef(false);
  const timedOut = useRef(false);
  const question = questions[index];

  useEffect(() => { enteredAt.current = Date.now(); }, [index]);

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
    if (remainingMs !== 0 || timedOut.current || !question) return;
    timedOut.current = true;
    moving.current = true;
    saveTime().then(timings => submit(true, timings)).finally(() => { moving.current = false; });
  }, [remainingMs, question?.id]);

  useEffect(() => {
    if (quiz?.status !== 'ended' || timedOut.current || !question) return;
    timedOut.current = true;
    moving.current = true;
    saveTime().then(timings => submit(false, timings, true)).finally(() => { moving.current = false; });
  }, [quiz?.status, question?.id]);

  if (!question) return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><p className="text-xl font-bold">Loading questions…</p></main>;

  return <main onContextMenu={e => e.preventDefault()} onCopy={e => e.preventDefault()} onPaste={e => e.preventDefault()} className="min-h-screen select-none bg-slate-950 p-4 text-white sm:p-8">
    <div className="mx-auto max-w-4xl">
      <header className="sticky top-0 z-10 rounded-2xl bg-indigo-700 p-4 shadow-xl sm:flex sm:items-center sm:justify-between">
        <div><p className="text-xs font-black uppercase text-indigo-200">Question {index + 1} of {questions.length}</p><h1 className="text-xl font-black">{quiz?.title}</h1></div>
        <div className={`mt-3 rounded-xl px-4 py-2 text-center font-mono text-xl sm:mt-0 ${remainingMs <= 60000 ? 'animate-pulse bg-red-600' : 'bg-slate-950'}`}>Time left: {formatDuration(remainingMs)}</div>
      </header>

      <div className="mt-5 flex gap-1">{questions.map((item, itemIndex) => <span key={item.id} className={`h-2 flex-1 rounded-full ${itemIndex === index ? 'bg-amber-400' : answers[item.id] ? 'bg-emerald-500' : 'bg-slate-700'}`} />)}</div>

      <section className="mt-8 min-h-[360px] rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-10">
        <p className="text-sm font-black uppercase tracking-widest text-indigo-600">Question {index + 1}</p>
        <h2 className="mt-4 text-2xl font-black leading-relaxed sm:text-3xl">{question.question}</h2>
        {question.type === 'choice' ? <div className="mt-8 grid gap-4 sm:grid-cols-2">{question.options.map(option => <label key={option} className={`cursor-pointer rounded-2xl border-2 p-5 text-lg font-bold transition ${answers[question.id] === option ? 'border-indigo-600 bg-indigo-50 text-indigo-800' : 'border-slate-200 hover:border-indigo-300'}`}><input type="radio" className="mr-3" checked={answers[question.id] === option} onChange={() => setAnswer(question.id, option)} />{option}</label>)}</div> : <input value={answers[question.id] || ''} onChange={e => setAnswer(question.id, e.target.value)} maxLength="300" className="mt-8 w-full rounded-2xl border-2 p-5 text-lg outline-none focus:border-indigo-500" placeholder="Type your answer" />}
      </section>

      <nav className="mt-6 flex items-center justify-between gap-4">
        <button disabled={index === 0} onClick={() => move(index - 1)} className="rounded-2xl border border-white/30 px-6 py-4 font-black disabled:invisible">← Previous</button>
        <span className="text-sm font-bold text-slate-400">Answered {Object.values(answers).filter(Boolean).length}/{questions.length}</span>
        {index < questions.length - 1 ? <button onClick={() => move(index + 1)} className="rounded-2xl bg-indigo-500 px-7 py-4 font-black">Next →</button> : <button onClick={finish} className="rounded-2xl bg-emerald-500 px-7 py-4 font-black text-slate-950">Submit quiz</button>}
      </nav>
    </div>
  </main>;
}
