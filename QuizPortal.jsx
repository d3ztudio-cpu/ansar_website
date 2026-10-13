import React from 'react';
import { Link } from 'react-router-dom';

const Arrow = () => <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">→</span>;

export default function QuizPortal() {
  return <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
    <div className="relative isolate min-h-screen bg-[radial-gradient(circle_at_20%_0%,#3730a3_0%,transparent_36%),radial-gradient(circle_at_90%_90%,#0e7490_0%,transparent_34%)] px-4 py-5 sm:px-8 sm:py-8">
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:42px_42px]" />
      <section className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col rounded-[2rem] border border-white/10 bg-slate-950/45 p-5 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-12">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link to="/ansar-media-production" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-200 transition hover:text-white"><span aria-hidden="true">←</span> Ansar Media Productions</Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-300" /> Secure access</div>
        </header>
        <div className="flex flex-1 flex-col justify-center py-12 lg:py-16">
          <div className="max-w-3xl"><p className="inline-flex rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-[.18em] text-amber-200">Assessment Centre</p><h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Choose your <span className="text-cyan-300">exam portal.</span></h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Select the experience designed for you. Student quizzes use the familiar classroom flow; staff examinations use verified, protected access.</p></div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <Link to="/ansar-media-production/add-ons/online-quiz/student" className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8"><div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-indigo-100/70" /><div className="relative flex items-start justify-between gap-5"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl text-white shadow-lg shadow-indigo-200">▤</div><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-700">For students</span></div><h2 className="relative mt-8 text-3xl font-black">Student Quiz</h2><p className="relative mt-3 max-w-md leading-6 text-slate-600">Join an assigned classroom quiz and continue with the familiar student experience.</p><span className="relative mt-8 flex items-center justify-between border-t border-slate-200 pt-5 text-sm font-black text-indigo-700">Enter student portal <Arrow /></span></Link>
            <Link to="/ansar-media-production/add-ons/online-quiz/staff" className="group relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-300 via-amber-200 to-orange-200 p-6 text-slate-950 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8"><div aria-hidden="true" className="absolute -right-8 -top-8 h-36 w-36 rounded-full border-[24px] border-white/25" /><div className="relative flex items-start justify-between gap-5"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-xl text-amber-200 shadow-lg">⌑</div><span className="rounded-full bg-slate-950/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-800">For staff</span></div><h2 className="relative mt-8 text-3xl font-black">Staff Online Exam</h2><p className="relative mt-3 max-w-md leading-6 text-slate-700">Sign in with Google, verify your staff profile once, then join your assigned exam lobby.</p><span className="relative mt-8 flex items-center justify-between border-t border-slate-950/15 pt-5 text-sm font-black text-slate-900">Enter staff portal <Arrow /></span></Link>
          </div>
          <footer className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-400"><span>Protected account access</span><span>•</span><span>Mobile-ready experience</span><span>•</span><span>Ansar English School</span></footer>
        </div>
      </section>
    </div>
  </main>;
}
