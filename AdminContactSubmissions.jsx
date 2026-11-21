import React, { useEffect, useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import { clearGoogleSheetsCache, useContentCollection } from './useContentCollection';
import { confirmSheetRecordDeleted, deleteSheetRecord, deleteSheetRecords, saveSheetRecord } from './googleSheetsAdminApi';

const value = (item, key) => String(item?.[key] || '').trim();
const messageValue = item => {
  const message = value(item, 'message');
  if (!/^(true|false)$/i.test(message)) return message;
  const candidates = ['applyingForClass', 'query', 'inquiry', 'messageText', 'body', 'description']
    .map(key => value(item, key))
    .filter(entry => entry.length >= 20 && !/^contact[-\d]+$/i.test(entry));
  return candidates[0] || '';
};

function writePdfHeader(pdf, title) {
  pdf.setFillColor(7, 63, 66); pdf.rect(0, 0, 210, 32, 'F'); pdf.setTextColor(255, 255, 255); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(18); pdf.text('ANSAR ENGLISH SCHOOL', 18, 14); pdf.setFontSize(10); pdf.text(title, 18, 23);
}

function downloadPdf(item) {
  const pdf = new jsPDF(); writePdfHeader(pdf, 'Contact enquiry record'); let y = 48;
  pdf.setTextColor(15, 23, 42); pdf.setFontSize(14); pdf.text('Submitted enquiry', 18, y); y += 13;
  [['Submitted', value(item, 'submittedAt') || value(item, 'date')], ['Name', value(item, 'name')], ['Phone', value(item, 'phone')], ['Email', value(item, 'email')], ['Contacting', value(item, 'destination')], ['Category', value(item, 'category')]].forEach(([label, text]) => { pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(71, 85, 105); pdf.text(label.toUpperCase(), 18, y); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11); pdf.setTextColor(15, 23, 42); pdf.text(text || 'Not provided', 53, y); y += 9; });
  pdf.setDrawColor(226, 232, 240); pdf.line(18, y + 2, 192, y + 2); y += 15; pdf.setFont('helvetica', 'bold'); pdf.text('Message', 18, y); y += 8; pdf.setFont('helvetica', 'normal'); const lines = pdf.splitTextToSize(messageValue(item) || 'No message provided', 174); pdf.text(lines, 18, y); pdf.setFontSize(8); pdf.setTextColor(100, 116, 139); pdf.text('Generated from the Ansar English School admin portal', 18, 285); pdf.save(`ansar-contact-${value(item, 'id') || Date.now()}.pdf`);
}

function downloadAllPdf(items) {
  const pdf = new jsPDF(); writePdfHeader(pdf, 'Contact enquiries report'); let y = 46;
  pdf.setTextColor(15, 23, 42); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(13); pdf.text(`All contact enquiries Ã‚· ${items.length} records`, 18, y); y += 12;
  items.forEach((item, index) => { if (y > 258) { pdf.addPage(); writePdfHeader(pdf, 'Contact enquiries report'); y = 46; } pdf.setFillColor(241, 245, 249); pdf.roundedRect(15, y - 6, 180, 8, 2, 2, 'F'); pdf.setTextColor(7, 63, 66); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.text(`${index + 1}. ${value(item, 'name') || 'Unnamed visitor'}`, 19, y); y += 9; pdf.setTextColor(71, 85, 105); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.text(`${value(item, 'submittedAt') || value(item, 'date')} Ã‚· ${value(item, 'category')} Ã‚· ${value(item, 'email')}`, 19, y); y += 6; const lines = pdf.splitTextToSize(messageValue(item) || 'No message provided', 172); pdf.text(lines, 19, y); y += lines.length * 4.5 + 10; });
  pdf.save(`ansar-contact-enquiries-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function AdminContactSubmissions() {
  const [refresh, setRefresh] = useState(0); const [selected, setSelected] = useState(null); const [query, setQuery] = useState(''); const [openedIds, setOpenedIds] = useState([]); const [hiddenIds, setHiddenIds] = useState([]);
  const { data: submissions } = useContentCollection('contactSubmissions', 'date', 'desc', { sheetsOnly: true, refreshKey: refresh });
  useEffect(() => {
    const timer = window.setInterval(() => setRefresh(value => value + 1), 15000);
    return () => window.clearInterval(timer);
  }, []);
  const filtered = useMemo(() => submissions.filter(item => !hiddenIds.includes(item.id) && `${value(item, 'name')} ${value(item, 'email')} ${value(item, 'phone')} ${value(item, 'category')}`.toLowerCase().includes(query.toLowerCase())), [submissions, hiddenIds, query]);
  const isOpened = item => openedIds.includes(item.id) || value(item, 'status') === 'Actioned' || Boolean(value(item, 'lastAction'));
  const newItems = filtered.filter(item => !isOpened(item)); const openedItems = filtered.filter(isOpened);
  const recordAction = async (item, action) => { await saveSheetRecord('contactSubmissions', { ...item, status: 'Actioned', lastAction: action, lastActionAt: new Date().toISOString() }); clearGoogleSheetsCache(); setRefresh(v => v + 1); };
  const openItem = async item => { setOpenedIds(ids => ids.includes(item.id) ? ids : [...ids, item.id]); setSelected(item); try { await recordAction(item, 'Viewed'); } catch (error) { window.alert(error.message); } };
  const exportAll = async () => {
    if (!filtered.length) return;
    const exported = [...filtered];
    downloadAllPdf(exported);
    setHiddenIds(ids => [...new Set([...ids, ...exported.map(item => item.id)])]);
    try {
      for (const item of exported) {
        await deleteSheetRecord('contactSubmissions', item.id, item);
        await confirmSheetRecordDeleted('contactSubmissions', item.id, 'contactSubmissions');
      }
      clearGoogleSheetsCache();
      setRefresh(value => value + 1);
    } catch (error) {
      setHiddenIds(ids => ids.filter(id => !exported.some(item => item.id === id)));
      window.alert(`The PDF was downloaded, but some queries could not be cleared: ${error.message}`);
    }
  };
  const deleteAll = async () => {
    if (!filtered.length) return;
    if (!window.confirm(`Delete all ${filtered.length} queries from the admin panel and Google Sheets? This cannot be undone.`)) return;
    const removed = [...filtered];
    setHiddenIds(ids => [...new Set([...ids, ...removed.map(item => item.id)])]);
    try {
      // Use the live, single-row endpoint sequentially. Deleting concurrently
      // can shift row positions and cause Google Sheets to skip records.
      for (const item of removed) {
        await deleteSheetRecord('contactSubmissions', item.id, item);
      }
      clearGoogleSheetsCache();
      setRefresh(value => value + 1);
    } catch (error) {
      setHiddenIds(ids => ids.filter(id => !removed.some(item => item.id === id)));
      window.alert(`Some queries could not be deleted: ${error.message}`);
    }
  };
  const remove = async item => { if (!window.confirm(`Delete the enquiry from ${value(item, 'name')}?`)) return; setHiddenIds(ids => [...ids, item.id]); setSelected(null); try { await deleteSheetRecord('contactSubmissions', item.id, item); await confirmSheetRecordDeleted('contactSubmissions', item.id, 'contactSubmissions'); clearGoogleSheetsCache(); setRefresh(v => v + 1); } catch (error) { setHiddenIds(ids => ids.filter(id => id !== item.id)); window.alert(error.message); } };
  const whatsapp = async item => { const phone = value(item, 'phone').replace(/[^\d]/g, ''); if (!phone) return; const text = encodeURIComponent(`Hello ${value(item, 'name')}, this is Ansar English School regarding your enquiry.`); window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer'); setOpenedIds(ids => [...new Set([...ids, item.id])]); await recordAction(item, 'WhatsApp opened'); };
  const email = async item => { setOpenedIds(ids => [...new Set([...ids, item.id])]); await recordAction(item, 'Email opened'); const to = encodeURIComponent(value(item, 'email')); const subject = encodeURIComponent('Re: Ansar English School enquiry'); window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}`, '_blank', 'noopener,noreferrer'); };
  const list = (items, heading, empty) => <section className="rounded-2xl border border-slate-100 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b p-5"><div><h3 className="text-xl font-extrabold text-slate-900">{heading}</h3><p className="mt-1 text-sm text-slate-500">{items.length} {items.length === 1 ? 'query' : 'queries'}</p></div>{heading === 'New Queries' && <button type="button" onClick={exportAll} disabled={!filtered.length} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-40">Download All as PDF</button>}<button type="button" onClick={deleteAll} disabled={!filtered.length} className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-extrabold text-red-600 disabled:opacity-40">Delete All Queries</button></div><div className="divide-y">{items.length ? items.map(item => <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><button type="button" onClick={() => openItem(item)} className="min-w-0 flex-1 text-left"><h4 className="font-extrabold text-slate-900">{value(item, 'name') || 'Unnamed visitor'}</h4><p className="mt-1 text-sm text-slate-500">{value(item, 'category')} Ã‚· {value(item, 'submittedAt') || value(item, 'date')}</p><p className="mt-1 truncate text-sm text-slate-600">{messageValue(item)}</p></button><div className="flex flex-wrap gap-2"><button type="button" onClick={() => openItem(item)} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white">View</button><button type="button" onClick={async () => { downloadPdf(item); setOpenedIds(ids => [...new Set([...ids, item.id])]); await recordAction(item, 'Downloaded PDF'); }} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-bold text-white">Download</button><button type="button" onClick={() => whatsapp(item)} className="rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white">WhatsApp</button><button type="button" onClick={() => email(item)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700">Email</button><button type="button" onClick={() => remove(item)} className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Delete</button></div></div>) : <p className="p-8 text-center font-bold text-slate-500">{empty}</p>}</div></section>;
  return <div className="space-y-6"><header><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Google Sheets inbox</p><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="mt-2 text-3xl font-extrabold text-slate-900">Contact Submissions</h2><p className="mt-2 text-slate-600">New queries move to Opened Queries when viewed or exported.</p></div><input value={query} onChange={e => setQuery(e.target.value)} aria-label="Search submissions" className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500 sm:w-80" /></div></header>{list(newItems, 'New Queries', 'No new queries found.')}{list(openedItems, 'Opened Queries', 'No opened queries yet.')}{selected && <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 p-4" onClick={() => setSelected(null)}><article className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Contact enquiry</p><h3 className="mt-2 text-2xl font-extrabold text-slate-900">{value(selected, 'name')}</h3></div><button type="button" onClick={() => setSelected(null)} className="rounded-lg border px-3 py-2 font-bold">Close</button></div><dl className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2"><div><dt className="text-xs font-bold uppercase text-slate-500">Submitted</dt><dd className="mt-1 font-bold">{value(selected, 'submittedAt') || value(selected, 'date')}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-500">Phone</dt><dd className="mt-1 font-bold">{value(selected, 'phone')}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-500">Email</dt><dd className="mt-1 font-bold">{value(selected, 'email')}</dd></div><div><dt className="text-xs font-bold uppercase text-slate-500">Category</dt><dd className="mt-1 font-bold">{value(selected, 'category')}</dd></div></dl><div className="mt-6 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 leading-relaxed text-slate-700">{messageValue(selected)}</div></article></div>}</div>;
}
