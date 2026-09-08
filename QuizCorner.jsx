import React, { useEffect, useMemo, useRef, useState } from 'react';
import { collection, doc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { db } from './firebase-init';
import { auth } from './firebase-auth';
import { formatDuration, shuffle } from './quizUtils';
import QuizQuestionPlayer from './QuizQuestionPlayer';
import QuizWaitingResult from './QuizWaitingResult';

const EMPTY_STUDENT = { name: '', className: '1', division: 'A' };

export default function QuizCorner() {
  const [user, setUser] = useState(null), [quizzes, setQuizzes] = useState([]), [selected, setSelected] = useState(null);
  const [student, setStudent] = useState(EMPTY_STUDENT), [participant, setParticipant] = useState(null), [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}), [questionTimings, setQuestionTimings] = useState({}), [elapsed, setElapsed] = useState(0), [notice, setNotice] = useState('');
  const disqualifying = useRef(false);

  useEffect(() => onAuthStateChanged(auth, async current => {
    if (current) setUser(current); else { try { await signInAnonymously(auth); } catch { setNotice('Quiz sign-in is unavailable. Ask the administrator to enable Anonymous Authentication.'); } }
  }), []);
  useEffect(() => onSnapshot(query(collection(db, 'quizSessions'), where('status', 'in', ['lobby', 'running'])), snap => setQuizzes(snap.docs.map(d => ({ id: d.id, ...d.data() }))), () => setQuizzes([])), []);
  useEffect(() => {
    if (!selected || !user) return undefined;
    return onSnapshot(doc(db, 'quizSessions', selected.id, 'participants', user.uid), snap => setParticipant(snap.exists() ? { id: snap.id, ...snap.data() } : null));
  }, [selected, user]);
  useEffect(() => {
    if (!selected || !participant || selected.status !== 'running') return undefined;
    getDocs(collection(db, 'quizSessions', selected.id, 'questions')).then(snap => setQuestions(shuffle(snap.docs.map(d => ({ id: d.id, ...d.data() })), participant.shuffleSeed)));
    return undefined;
  }, [selected?.id, selected?.status, participant?.id]);
  useEffect(() => { if (participant?.questionTimings) setQuestionTimings(participant.questionTimings); }, [participant?.id]);
  useEffect(() => {
    if (!selected) return undefined;
    return onSnapshot(doc(db, 'quizSessions', selected.id), snap => snap.exists() && setSelected({ id: snap.id, ...snap.data() }));
  }, [selected?.id]);
  useEffect(() => {
    if (participant?.status !== 'active') return undefined;
    const startedAtMs = participant.startedAt?.toMillis?.();
    if (!startedAtMs) return undefined;
    const updateTimer = () => setElapsed(Math.max(0, Date.now() - startedAtMs));
    updateTimer();
    const timer = setInterval(updateTimer, 250);
    const violate = async (reason) => {
      if (disqualifying.current) return;
      disqualifying.current = true;
      try { await updateDoc(doc(db, 'quizSessions', selected.id, 'participants', user.uid), { status: 'disqualified', violation: reason, violationAt: serverTimestamp(), updatedAt: serverTimestamp() }); } catch { /* listener will retry visually */ }
    };
    const visibility = () => document.hidden && violate('Switched tab or minimized the quiz');
    const fullscreen = () => !document.fullscreenElement && violate('Exited full-screen mode');
    const keys = e => { if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 'p', 'u'].includes(e.key.toLowerCase())) { e.preventDefault(); violate('Used a restricted keyboard shortcut'); } };
    document.addEventListener('visibilitychange', visibility); document.addEventListener('fullscreenchange', fullscreen); document.addEventListener('keydown', keys);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', visibility); document.removeEventListener('fullscreenchange', fullscreen); document.removeEventListener('keydown', keys); };
  }, [participant?.status, participant?.startedAt?.seconds, participant?.startedAt?.nanoseconds, selected?.id, user?.uid]);

  const eligible = useMemo(() => quizzes.filter(q => !q.className || q.className === student.className), [quizzes, student.className]);
  const join = async e => { e.preventDefault(); if (!user || !selected) return; await setDoc(doc(db, 'quizSessions', selected.id, 'participants', user.uid), { uid: user.uid, name: student.name.trim(), className: student.className, division: student.division.trim().toUpperCase(), status: 'waiting', progress: 0, shuffleSeed: Math.floor(Math.random() * 9999999) + 1, joinedAt: serverTimestamp(), updatedAt: serverTimestamp() }); };
  const start = async () => { try { await document.documentElement.requestFullscreen(); await updateDoc(doc(db, 'quizSessions', selected.id, 'participants', user.uid), { status: 'active', startedAt: serverTimestamp(), updatedAt: serverTimestamp() }); disqualifying.current = false; } catch { setNotice('Full-screen permission is required to start this quiz.'); } };
  const submit = async (timedOut = false, finalTimings = questionTimings, forced = false) => { if (!timedOut && !forced && !window.confirm('Submit your final answers?')) return; disqualifying.current = true; const ref = doc(db, 'quizSessions', selected.id, 'participants', user.uid); await updateDoc(ref, { answers, questionTimings: finalTimings, timedOut, progress: questions.length, status: 'submitted', submittedAt: serverTimestamp(), updatedAt: serverTimestamp() }); if (document.fullscreenElement) await document.exitFullscreen(); };
  const setAnswer = async (id, value) => { const next = { ...answers, [id]: value }; setAnswers(next); await updateDoc(doc(db, 'quizSessions', selected.id, 'participants', user.uid), { answers: next, progress: Object.values(next).filter(Boolean).length, updatedAt: serverTimestamp() }); };
  const recordQuestionTime = async (id, milliseconds) => { const next = { ...questionTimings, [id]: Math.min(10800000, Math.max(0, (questionTimings[id] || 0) + Math.round(milliseconds))) }; setQuestionTimings(next); await updateDoc(doc(db, 'quizSessions', selected.id, 'participants', user.uid), { questionTimings: next, updatedAt: serverTimestamp() }); return next; };
  const durationMs = Math.max(1, Number(selected?.durationMinutes || 30)) * 60 * 1000;
  const remainingMs = Math.max(0, durationMs - elapsed);
  if (participant?.status === 'disqualified' || participant?.status === 'locked') return <Blocked participant={participant} />;
  if (participant?.status === 'submitted' || participant?.status === 'scored') return <QuizWaitingResult participant={participant} quiz={selected} />;
  if (participant?.status === 'active') return <QuizQuestionPlayer quiz={selected} questions={questions} answers={answers} remainingMs={remainingMs} setAnswer={setAnswer} recordQuestionTime={recordQuestionTime} submit={submit} />;
  return <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-violet-900 px-4 py-10 text-white">
    <div className="mx-auto max-w-4xl"><a href="/library" className="text-sm font-bold text-cyan-200">← Back to Library</a><div className="mt-8 rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur sm:p-10">
      <p className="text-sm font-black uppercase tracking-[.25em] text-amber-300">Library Quiz Corner</p><h1 className="mt-3 text-4xl font-black sm:text-6xl">Ready, set, think! 🧠</h1><p className="mt-4 max-w-2xl text-blue-100">Choose your class, join the live quiz, and answer accurately. Equal scores are ranked by fastest completion time.</p>
      {notice && <p className="mt-5 rounded-xl bg-red-500/25 p-4 font-bold text-red-100">{notice}</p>}
      {!participant ? <form onSubmit={join} className="mt-8 grid gap-4 rounded-2xl bg-white p-5 text-slate-900 sm:grid-cols-3">
        <label className="sm:col-span-3 text-sm font-bold">Student name<input required maxLength="80" value={student.name} onChange={e => setStudent({ ...student, name: e.target.value })} className="mt-1 w-full rounded-xl border p-3" /></label>
        <label className="text-sm font-bold">Class<select value={student.className} onChange={e => { setStudent({ ...student, className: e.target.value }); setSelected(null); }} className="mt-1 w-full rounded-xl border p-3">{Array.from({ length: 12 }, (_, i) => <option key={i + 1}>{i + 1}</option>)}</select></label>
        <label className="text-sm font-bold">Division<input required maxLength="5" value={student.division} onChange={e => setStudent({ ...student, division: e.target.value })} className="mt-1 w-full rounded-xl border p-3" /></label>
        <label className="text-sm font-bold">Available quiz<select required value={selected?.id || ''} onChange={e => setSelected(eligible.find(q => q.id === e.target.value))} className="mt-1 w-full rounded-xl border p-3"><option value="">Select…</option>{eligible.map(q => <option value={q.id} key={q.id}>{q.title}</option>)}</select></label>
        <button disabled={!selected} className="sm:col-span-3 rounded-xl bg-indigo-600 px-5 py-3 font-black text-white disabled:opacity-40">Join quiz</button>
      </form> : <div className="mt-8 rounded-2xl bg-white p-7 text-center text-slate-900"><p className="text-sm font-black uppercase text-indigo-600">You are registered</p><h2 className="mt-2 text-3xl font-black">{selected?.title}</h2>{selected?.status === 'running' ? <button onClick={start} className="mt-6 rounded-xl bg-emerald-600 px-8 py-4 text-lg font-black text-white">Enter full screen & start</button> : <p className="mt-5 font-bold text-slate-600">Waiting for the administrator to start the quiz…</p>}</div>}
    </div></div>
  </main>;
}

function QuizGame({ quiz, questions, answers, elapsed, setAnswer, submit }) { return <main onContextMenu={e => e.preventDefault()} onCopy={e => e.preventDefault()} onPaste={e => e.preventDefault()} className="min-h-screen select-none bg-slate-950 p-4 text-white sm:p-8"><div className="mx-auto max-w-5xl"><header className="sticky top-0 z-10 flex items-center justify-between rounded-2xl bg-indigo-700 p-4 shadow-xl"><div><p className="text-xs font-black uppercase text-indigo-200">Live quiz</p><h1 className="text-xl font-black">{quiz?.title}</h1></div><div className="rounded-xl bg-slate-950 px-4 py-2 font-mono text-xl">⏱ {formatDuration(elapsed)}</div></header><div className="mt-6 space-y-5">{questions.map((q, i) => <section key={q.id} className="rounded-2xl bg-white p-6 text-slate-900"><p className="text-xs font-black uppercase text-indigo-600">Question {i + 1}</p><h2 className="mt-2 text-xl font-bold">{q.question}</h2>{q.type === 'choice' ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{q.options.map(option => <label key={option} className={`cursor-pointer rounded-xl border-2 p-4 font-bold ${answers[q.id] === option ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}><input type="radio" className="mr-3" checked={answers[q.id] === option} onChange={() => setAnswer(q.id, option)} />{option}</label>)}</div> : <input value={answers[q.id] || ''} onChange={e => setAnswer(q.id, e.target.value)} maxLength="300" className="mt-5 w-full rounded-xl border-2 p-4" placeholder="Type your answer" />}</section>)}</div><button onClick={submit} disabled={!questions.length} className="my-8 w-full rounded-2xl bg-emerald-500 py-5 text-xl font-black text-slate-950 disabled:opacity-40">Submit final answers</button></div></main>; }
function Blocked({ participant }) { return <main className="flex min-h-screen items-center justify-center bg-red-700 p-6 text-center text-white"><div><div className="text-7xl">⛔</div><h1 className="mt-6 text-5xl font-black">SYSTEM LOCKED</h1><p className="mt-4 text-xl font-bold">You have been disqualified.</p><p className="mt-3 rounded-xl bg-red-950/40 p-4">{participant.violation || 'Quiz rule violation detected'}</p><p className="mt-5">Only the administrator can unlock this participant.</p></div></main>; }
function ResultWait({ participant, quiz }) { const visible = ['ended', 'completed'].includes(quiz?.status) && participant.score != null; return <main className="flex min-h-screen items-center justify-center bg-indigo-950 p-6 text-white"><div className="max-w-xl rounded-3xl bg-white p-10 text-center text-slate-900"><div className="text-6xl">🏁</div><h1 className="mt-5 text-3xl font-black">Answers submitted!</h1>{visible ? <><p className="mt-6 text-lg">Your score</p><p className="text-6xl font-black text-indigo-700">{participant.score}/{participant.total}</p><p className="mt-3 font-bold">Time: {formatDuration(participant.durationMs)}</p></> : <p className="mt-5 text-slate-600">Your score will appear only after the administrator ends the quiz.</p>}</div></main>; }
