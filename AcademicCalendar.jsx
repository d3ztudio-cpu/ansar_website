import React, { useMemo, useState } from 'react';

const WEEKDAYS_SUNDAY_FIRST = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_MONDAY_FIRST = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function eventKind(event) {
  const value = event.toLowerCase();
  if (value.includes('holiday') || value.includes('break') || value.includes('easter')) return 'holiday';
  if (value.includes('assessment') || value.includes('test') || value.includes('exam')) return 'assessment';
  return 'event';
}

export default function AcademicCalendar({ calendar, accent = 'emerald' }) {
  const [index, setIndex] = useState(0);
  const month = calendar.months[index];
  const weekdayNames = calendar.weekStartsMonday ? WEEKDAYS_MONDAY_FIRST : WEEKDAYS_SUNDAY_FIRST;
  const cells = useMemo(() => {
    const firstDay = new Date(month.year, month.month, 1).getDay();
    const offset = calendar.weekStartsMonday ? (firstDay + 6) % 7 : firstDay;
    const days = new Date(month.year, month.month + 1, 0).getDate();
    return Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, cellIndex) => {
      const day = cellIndex - offset + 1;
      return day > 0 && day <= days ? day : null;
    });
  }, [calendar.weekStartsMonday, month]);
  const label = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(month.year, month.month));
  const palette = accent === 'sprouts'
    ? { heading: 'text-[#4f1f71]', button: 'bg-[#4f1f71] hover:bg-[#3d1758]', ring: 'ring-[#fbad18]/30', chip: 'bg-[#fbad18] text-white', holiday: 'bg-rose-50 text-rose-700', assessment: 'bg-amber-50 text-amber-800', event: 'bg-[#4f1f71]/10 text-[#4f1f71]' }
    : { heading: 'text-emerald-950', button: 'bg-emerald-700 hover:bg-emerald-800', ring: 'ring-emerald-200', chip: 'bg-emerald-700 text-white', holiday: 'bg-rose-50 text-rose-700', assessment: 'bg-amber-50 text-amber-800', event: 'bg-emerald-50 text-emerald-800' };

  return <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-7" aria-label={`${calendar.audience} academic calendar`}>
    <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Academic Year 2026-2027</p><h3 className={`mt-1 text-2xl font-black sm:text-3xl ${palette.heading}`}>{label}</h3></div>
      <div className="flex items-center gap-2"><button type="button" onClick={() => setIndex(value => Math.max(0, value - 1))} disabled={index === 0} className={`rounded-xl px-4 py-2.5 font-black text-white transition disabled:cursor-not-allowed disabled:opacity-30 ${palette.button}`} aria-label="Previous month">← <span className="hidden sm:inline">Previous</span></button><button type="button" onClick={() => setIndex(value => Math.min(calendar.months.length - 1, value + 1))} disabled={index === calendar.months.length - 1} className={`rounded-xl px-4 py-2.5 font-black text-white transition disabled:cursor-not-allowed disabled:opacity-30 ${palette.button}`} aria-label="Next month"><span className="hidden sm:inline">Next </span>→</button></div>
    </div>
    <div className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Choose a month">{calendar.months.map((item, itemIndex) => <button type="button" key={`${item.year}-${item.month}`} onClick={() => setIndex(itemIndex)} className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-extrabold transition ${itemIndex === index ? palette.chip : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(new Date(item.year, item.month))}</button>)}</div>
    <div className="mt-5 grid grid-cols-7 overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 text-center text-xs font-black uppercase tracking-wide text-slate-500">{weekdayNames.map(day => <div key={day} className="bg-slate-100 px-1 py-3">{day}</div>)}{cells.map((day, cellIndex) => { const events = day ? month.events[day] || [] : []; const isWeekend = cellIndex % 7 >= 5; return <div key={cellIndex} className={`min-h-20 border-r border-t border-slate-200 bg-white p-1 text-left sm:min-h-28 sm:p-2 ${isWeekend ? 'bg-slate-50' : ''}`}>{day && <><span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${events.some(event => eventKind(event) === 'holiday') ? 'bg-rose-100 text-rose-700' : 'text-slate-700'}`}>{day}</span><div className="mt-1 space-y-1">{events.map(event => <p key={event} className={`rounded px-1 py-0.5 text-[8px] font-bold leading-tight sm:text-[10px] ${palette[eventKind(event)]}`}>{event}</p>)}</div></>}</div>; })}</div>
    <div className={`mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 ring-1 ${palette.ring}`}><p className={`text-sm font-black ${palette.heading}`}>Total working days: <span className="text-xl">{month.workingDays}</span></p><div className="flex flex-wrap gap-2 text-xs font-bold"><span className={`rounded-full px-2 py-1 ${palette.holiday}`}>Holiday</span><span className={`rounded-full px-2 py-1 ${palette.assessment}`}>Assessment</span><span className={`rounded-full px-2 py-1 ${palette.event}`}>School event</span></div></div>
  </section>;
}
