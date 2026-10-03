import React, { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { SCHOOL_ACADEMIC_CALENDAR, SPROUTS_ACADEMIC_CALENDAR } from './academicCalendarData';
import { importAcademicCalendarPdf } from './calendarPdfImporter';

const clone = value => JSON.parse(JSON.stringify(value));
const monthLabel = month => new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(month.year, month.month));

function normalizeMonths(months) {
  return months.map(month => ({
    ...month,
    workingDays: Number(month.workingDays) || 0,
    events: Object.fromEntries(Object.entries(month.events || {}).map(([day, entries]) => [day, (entries || []).map(entry => String(entry).trim()).filter(Boolean)]).filter(([, entries]) => entries.length))
  }));
}

export default function AdminAcademicCalendar() {
  const [calendars, setCalendars] = useState({ school: clone(SCHOOL_ACADEMIC_CALENDAR.months), sprouts: clone(SPROUTS_ACADEMIC_CALENDAR.months) });
  const [audience, setAudience] = useState('school');
  const [monthIndex, setMonthIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getDoc(doc(db, 'settings', 'global')).then(snapshot => {
      const saved = snapshot.data()?.academicCalendars;
      if (!saved) return;
      setCalendars(current => ({
        school: Array.isArray(saved.school) && saved.school.length === SCHOOL_ACADEMIC_CALENDAR.months.length ? saved.school : current.school,
        sprouts: Array.isArray(saved.sprouts) && saved.sprouts.length === SPROUTS_ACADEMIC_CALENDAR.months.length ? saved.sprouts : current.sprouts
      }));
    }).catch(error => setMessage(`Could not load saved calendars: ${error.message}`));
  }, []);

  const months = calendars[audience];
  const currentMonth = months[monthIndex];
  const rows = useMemo(() => Object.entries(currentMonth?.events || {}).flatMap(([day, entries]) => entries.map((text, entryIndex) => ({ day: Number(day), entryIndex, text }))).sort((a, b) => a.day - b.day), [currentMonth]);
  const updateMonth = updater => setCalendars(current => ({ ...current, [audience]: current[audience].map((month, index) => index === monthIndex ? updater(month) : month) }));
  const updateEvent = (day, entryIndex, text) => updateMonth(month => ({ ...month, events: { ...month.events, [day]: month.events[day].map((entry, index) => index === entryIndex ? text : entry) } }));
  const removeEvent = (day, entryIndex) => updateMonth(month => {
    const nextEvents = { ...month.events };
    nextEvents[day] = nextEvents[day].filter((_, index) => index !== entryIndex);
    if (!nextEvents[day].length) delete nextEvents[day];
    return { ...month, events: nextEvents };
  });
  const addEvent = () => updateMonth(month => ({ ...month, events: { ...month.events, 1: [...(month.events[1] || []), 'New calendar event'] } }));
  const moveEventDay = (day, entryIndex, nextDay) => updateMonth(month => {
    const text = month.events[day][entryIndex]; const nextEvents = { ...month.events, [day]: month.events[day].filter((_, index) => index !== entryIndex) };
    if (!nextEvents[day].length) delete nextEvents[day];
    nextEvents[nextDay] = [...(nextEvents[nextDay] || []), text];
    return { ...month, events: nextEvents };
  });
  const save = async () => {
    setSaving(true); setMessage('');
    try {
      await setDoc(doc(db, 'settings', 'global'), { academicCalendars: { school: normalizeMonths(calendars.school), sprouts: normalizeMonths(calendars.sprouts) }, updatedAt: serverTimestamp() }, { merge: true });
      setMessage('Academic calendars saved. The School Academics and Ansar Sprouts pages update automatically.');
    } catch (error) { setMessage(`Could not save calendars: ${error.message}`); }
    finally { setSaving(false); }
  };
  const importPdf = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImporting(true); setMessage('Reading the PDF calendar. This can take a few moments…');
    try {
      const importedMonths = await importAcademicCalendarPdf(file, audience);
      setCalendars(current => ({ ...current, [audience]: importedMonths }));
      setMonthIndex(0);
      setMessage(`PDF scanned for ${audience === 'school' ? 'Ansar English School' : 'Ansar Sprouts'}. Review every month and select Save both calendars to publish it.`);
    } catch (error) { setMessage(`Could not scan this PDF: ${error.message}`); }
    finally { setImporting(false); }
  };

  return <div className="mx-auto max-w-6xl space-y-6">
    <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Academic year 2026-2027</p><h2 className="mt-2 text-2xl font-extrabold text-slate-900">Academic Calendar Editor</h2><p className="mt-3 max-w-3xl leading-7 text-slate-600">Update the two public calendars from one place. School entries appear only on the Academics page; Sprouts entries appear only on the Ansar Sprouts page.</p></section>
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-slate-700"><h3 className="font-extrabold text-slate-900">How to update the calendar</h3><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6"><li>Select <strong>School</strong> or <strong>Sprouts</strong>. They remain completely separate.</li><li>To start from an official calendar, select <strong>Scan PDF calendar</strong>. The scan fills the editor but does <strong>not</strong> publish anything yet.</li><li>Review all ten months, working-day totals, holidays, assessments, and reopening/closing dates against the PDF. Correct any item in the editor or use <strong>Add event</strong>.</li><li>Select <strong>Save both calendars</strong> only after review. The matching public page then updates automatically.</li></ol></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setAudience('school'); setMonthIndex(0); }} className={`rounded-xl px-5 py-3 font-bold ${audience === 'school' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'}`}>Ansar English School</button><button type="button" onClick={() => { setAudience('sprouts'); setMonthIndex(0); }} className={`rounded-xl px-5 py-3 font-bold ${audience === 'sprouts' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700'}`}>Ansar Sprouts</button></div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">{months.map((month, index) => <button type="button" key={`${month.year}-${month.month}`} onClick={() => setMonthIndex(index)} className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold ${index === monthIndex ? audience === 'school' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'}`}>{monthLabel(month)}</button>)}</div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><h3 className="text-xl font-extrabold text-slate-900">{monthLabel(currentMonth)}</h3><p className="mt-1 text-sm text-slate-500">Each line is shown on the public calendar for its selected date.</p></div><div className="flex flex-wrap items-end gap-3"><label className="block text-sm font-bold text-slate-700">Working days<input type="number" min="0" max="31" value={currentMonth.workingDays} onChange={event => updateMonth(month => ({ ...month, workingDays: event.target.value }))} className="mt-1 block w-28 rounded-lg border border-slate-300 p-3 text-lg font-bold" /></label><label className={`cursor-pointer rounded-lg px-4 py-3 font-bold text-white ${importing ? 'cursor-wait bg-slate-400' : audience === 'school' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-orange-500 hover:bg-orange-600'}`}><input type="file" accept="application/pdf,.pdf" onChange={importPdf} disabled={importing} className="sr-only" />{importing ? 'Scanning PDF…' : 'Scan PDF calendar'}</label></div></div>
      <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">Date</th><th className="p-3">Event / holiday / assessment</th><th className="p-3"><span className="sr-only">Remove</span></th></tr></thead><tbody>{rows.map(row => <tr key={`${row.day}-${row.entryIndex}`} className="border-b border-slate-100"><td className="p-3"><select value={row.day} onChange={event => moveEventDay(row.day, row.entryIndex, Number(event.target.value))} className="rounded-lg border border-slate-300 p-2">{Array.from({ length: new Date(currentMonth.year, currentMonth.month + 1, 0).getDate() }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></td><td className="p-3"><input value={row.text} onChange={event => updateEvent(row.day, row.entryIndex, event.target.value)} className="w-full rounded-lg border border-slate-300 p-2" aria-label={`Event on ${row.day}`} /></td><td className="p-3 text-right"><button type="button" onClick={() => removeEvent(row.day, row.entryIndex)} className="rounded-lg px-3 py-2 font-bold text-red-600 hover:bg-red-50">Remove</button></td></tr>)}</tbody></table></div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={addEvent} className="rounded-lg border border-slate-300 px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-50">+ Add event</button><button type="button" onClick={save} disabled={saving} className="rounded-lg bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800 disabled:opacity-60">{saving ? 'Saving…' : 'Save both calendars'}</button></div>
      {message && <p className={`mt-5 rounded-lg p-3 text-sm font-bold ${message.startsWith('Could not') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>{message}</p>}
    </section>
  </div>;
}
