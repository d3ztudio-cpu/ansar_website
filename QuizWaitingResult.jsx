import React from 'react';
import { formatDuration } from './quizUtils';

export default function QuizWaitingResult({ participant, quiz }) {
  const canReveal = participant.timedOut === true || ['ended', 'completed'].includes(quiz?.status);
  const scored = participant.score != null;
  return <main className="flex min-h-screen items-center justify-center bg-indigo-950 p-6 text-white">
    <div className="max-w-xl rounded-3xl bg-white p-10 text-center text-slate-900 shadow-2xl">
      {canReveal && scored ? <>
        <div className="text-6xl">🏁</div><h1 className="mt-5 text-3xl font-black">Quiz completed!</h1>
        <p className="mt-6 text-lg">Your score</p><p className="text-6xl font-black text-indigo-700">{participant.score}/{participant.total}</p>
        <p className="mt-3 font-bold">Completion time: {formatDuration(participant.durationMs)}</p>
      </> : <>
        <div className="text-6xl">🎉</div><h1 className="mt-5 text-3xl font-black">Thank you for playing!</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Please wait until the quiz gets completed. Your result will be shown when the timer reaches zero or the administrator ends and reveals the quiz.</p>
        {canReveal && !scored && <p className="mt-4 font-bold text-indigo-700">Calculating your result…</p>}
      </>}
    </div>
  </main>;
}
