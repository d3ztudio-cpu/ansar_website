import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase-init';
import { jsPDF } from 'jspdf';

const statuses = ['Under Review', 'Documents Required', 'Interview Scheduled', 'Interview Completed', 'Admission Approved', 'Admitted', 'Rejected', 'Withdrawn'];
const get = (item, keys) => keys.map((key) => item?.[key]).find((value) => value !== undefined && value !== '') || '—';

const whatsappNumber = item => String(item?.whatsappNumber || item?.fatherMobile || item?.motherMobile || '').replace(/\D/g, '');
const whatsappMessage = (item, nextStatus) => `Dear parent/guardian, ${get(item, ['studentName', 'fullName', 'field1'])}'s admission application (${get(item, ['referenceNumber', 'id'])}) has been ${nextStatus.toLowerCase()}. Ansar English School Admissions Office.`;

export default function AdmissionDesk() {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => onSnapshot(collection(db, 'admissionApplications'), (snap) => {
    const rows = snap.docs.map((item) => ({ id: item.id, ...item.data() }));
    setApplications(rows);
    setSelected((current) => rows.find((row) => row.id === current?.id) || rows[0] || null);
  }, (error) => setMessage(`Could not load applications: ${error.message}`)), []);

  const filtered = useMemo(() => applications.filter((item) => {
    const text = `${get(item, ['referenceNumber', 'id'])} ${get(item, ['studentName', 'fullName', 'field1'])} ${get(item, ['email', 'field10'])}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (status === 'All' || (item.status || 'Under Review') === status);
  }), [applications, search, status]);
  const count = (name) => applications.filter((item) => (item.status || 'Under Review') === name).length;
  const updateStatus = async (nextStatus) => {
    if (!selected) return;
    try { await updateDoc(doc(db, 'admissionApplications', selected.id), { status: nextStatus, updatedAt: new Date().toISOString() }); setMessage(`Application updated to ${nextStatus}. Email notification queued.`); const number = whatsappNumber(selected); if (number) window.open(`https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage(selected, nextStatus))}`, '_blank', 'noopener,noreferrer'); }
    catch (error) { setMessage(`Update failed: ${error.message}`); }
  };
  const removeApplication = async () => {
    if (!selected || !window.confirm(`Delete ${student}'s application permanently?`)) return;
    try { await deleteDoc(doc(db, 'admissionApplications', selected.id)); setMessage('Application deleted.'); } catch (error) { setMessage(`Delete failed: ${error.message}`); }
  };
  const detail = (label, keys) => <div><dt className="font-bold text-slate-400">{label}</dt><dd className="break-words text-slate-800">{get(selected, keys)}</dd></div>;
  const student = get(selected, ['studentName', 'fullName', 'field1']);
  const exportApplications = () => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const page = { left: 14, right: 196, top: 18, bottom: 282 };
    const rows = [...filtered].sort((a, b) => {
      const classA = String(get(a, ['classApplied', 'className', 'field5']));
      const classB = String(get(b, ['classApplied', 'className', 'field5']));
      return classA.localeCompare(classB, undefined, { numeric: true }) || String(a.studentName || '').localeCompare(String(b.studentName || ''));
    });
    const classGroups = rows.reduce((groups, item) => {
      const key = String(get(item, ['classApplied', 'className', 'field5']));
      (groups[key] ||= []).push(item);
      return groups;
    }, {});
    const safe = value => String(value || '—').replace(/[\u0000-\u001f]/g, ' ').trim();
    const wrap = (value, width = 176) => pdf.splitTextToSize(safe(value), width);
    const footer = () => { pdf.setDrawColor(210, 222, 224); pdf.line(page.left, 287, page.right, 287); pdf.setFontSize(7.5); pdf.setTextColor(100, 116, 139); pdf.text('ANSAR ENGLISH SCHOOL  |  Confidential admissions report', page.left, 292); pdf.text(`Page ${pdf.getNumberOfPages()}`, page.right, 292, { align: 'right' }); };
    const header = (title, subtitle = '') => { pdf.setFillColor(7, 63, 66); pdf.rect(0, 0, 210, 13, 'F'); pdf.setTextColor(7, 63, 66); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(17); pdf.text(title, page.left, 25); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8.5); pdf.setTextColor(71, 85, 105); pdf.text(subtitle, page.left, 31); footer(); };
    const newPage = (title, subtitle) => { pdf.addPage(); header(title, subtitle); return 40; };
    const labelValue = (label, value, x, y, width = 82) => { pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7.5); pdf.setTextColor(100, 116, 139); pdf.text(label.toUpperCase(), x, y); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(30, 41, 59); const lines = wrap(value, width); pdf.text(lines, x, y + 4); return y + 4 + lines.length * 4.2; };
    const title = status === 'All' ? 'Admission Applications Report' : `${status} Applications Report`;
    header(title, `Generated ${new Date().toLocaleString('en-IN')}  |  ${rows.length} application${rows.length === 1 ? '' : 's'}  |  Filter: ${status}`);
    let y = 43;
    pdf.setFillColor(239, 248, 245); pdf.roundedRect(page.left, y - 8, 182, 25, 3, 3, 'F');
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(7, 63, 66); pdf.text('REPORT SUMMARY', page.left + 6, y);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8.5); pdf.setTextColor(51, 65, 85); pdf.text(`Total in this export: ${rows.length}`, page.left + 6, y + 7); pdf.text(`Classes represented: ${Object.keys(classGroups).length}`, page.left + 82, y + 7); pdf.text(`Statuses represented: ${new Set(rows.map(x => x.status || 'Under Review')).size}`, page.left + 6, y + 14); pdf.text('Applications are grouped by class below.', page.left + 82, y + 14);
    y += 29;
    Object.entries(classGroups).forEach(([className, group]) => {
      if (y > 255) { y = newPage(`Class ${className}`, `${group.length} application${group.length === 1 ? '' : 's'} in this class`); }
      pdf.setFillColor(16, 45, 53); pdf.roundedRect(page.left, y - 5, 182, 10, 2, 2, 'F'); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(255, 255, 255); pdf.text(`CLASS ${className.toUpperCase()}`, page.left + 5, y + 2); pdf.setFontSize(8.5); pdf.text(`${group.length} application${group.length === 1 ? '' : 's'}`, page.right - 5, y + 2, { align: 'right' }); y += 13;
      group.forEach((item, groupIndex) => {
        const studentName = get(item, ['studentName', 'fullName', 'field1']); const itemStatus = item.status || 'Under Review';
        const blocks = [wrap(`${groupIndex + 1}. ${studentName}  |  ${get(item, ['referenceNumber', 'id'])}`, 170).length * 5, 18, 18, 18, 18, 16]; const height = Math.max(70, blocks.reduce((a, b) => a + b, 0));
        if (y + height > page.bottom) { y = newPage(`Class ${className}`, `Continuing class ${className}  |  ${group.length} applications`); }
        pdf.setFillColor(groupIndex % 2 ? 248 : 255, 250, 250); pdf.setDrawColor(220, 231, 232); pdf.roundedRect(page.left, y, 182, height - 4, 2, 2, 'FD');
        pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10.5); pdf.setTextColor(7, 63, 66); pdf.text(wrap(`${groupIndex + 1}. ${studentName}`, 120), page.left + 6, y + 8); pdf.setFontSize(8); pdf.setTextColor(71, 85, 105); pdf.text(safe(get(item, ['referenceNumber', 'id'])), page.right - 6, y + 8, { align: 'right' });
        pdf.setFillColor(itemStatus === 'Admitted' || itemStatus === 'Admission Approved' ? 220 : 254, itemStatus === 'Admitted' || itemStatus === 'Admission Approved' ? 252 : 243, itemStatus === 'Admitted' || itemStatus === 'Admission Approved' ? 231 : 199); pdf.roundedRect(page.left + 6, y + 12, 48, 6, 2, 2, 'F'); pdf.setFontSize(7.5); pdf.setTextColor(71, 85, 105); pdf.text(itemStatus, page.left + 9, y + 16);
        let cy = y + 25; cy = labelValue('Date of birth', get(item, ['dateOfBirth', 'field2']), page.left + 6, cy, 50); labelValue('Gender', get(item, ['gender', 'field3']), page.left + 68, y + 25, 45); labelValue('Academic year', get(item, ['academicYear']), page.left + 130, y + 25, 45);
        cy = y + 38; cy = labelValue('Parent / guardian', get(item, ['fatherName', 'parentName', 'field6']), page.left + 6, cy, 80); labelValue('Father mobile', get(item, ['fatherMobile', 'parentMobile', 'phone', 'field8']), page.left + 100, y + 38, 76);
        labelValue('Email', get(item, ['email', 'field10']), page.left + 6, y + 51, 80); labelValue('Address', get(item, ['address', 'field11']), page.left + 100, y + 51, 76);
        y += height;
      });
      y += 8;
    });
    footer();
    pdf.save(`ansar-admissions-${status === 'All' ? 'categorised-all' : status.toLowerCase().replaceAll(' ', '-')}.pdf`);
  };

  return <main className="min-h-screen bg-[#eef4f2] text-slate-900">
    <div className="bg-[#082f35] px-5 py-4 text-white lg:px-8"><div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[.25em] text-lime-300">Ansar English School · Admissions Office</p><p className="mt-1 text-sm text-teal-100">Live application workspace</p></div><a href="/" className="rounded-xl border border-white/25 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">Exit portal</a></div></div>
    <div className="mx-auto max-w-[1600px] p-4 lg:p-7">
    <header className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">Operations dashboard</p><h1 className="mt-1 text-3xl font-extrabold text-emerald-950">Admission Desk</h1><p className="text-sm text-slate-500">Review, update and track applications in real time.</p></div><button type="button" onClick={exportApplications} disabled={!filtered.length} className="rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Download {status === 'All' ? 'all' : status} PDF</button></header>
    {message && <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{message}</div>}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">{[['Total', applications.length], ...statuses.map((item) => [item, count(item)])].map(([label, number]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><p className="truncate text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-2xl font-extrabold text-emerald-900">{number}</p></div>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap gap-3 border-b border-slate-100 p-4"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reference, student or email" className="min-w-64 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none" /><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 font-bold"><option>All</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Reference</th><th className="p-4">Student</th><th className="p-4">Class</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} onClick={() => setSelected(item)} className={`cursor-pointer border-t border-slate-100 hover:bg-emerald-50 ${selected?.id === item.id ? 'bg-emerald-50' : ''}`}><td className="p-4 font-black text-emerald-800">{get(item, ['referenceNumber', 'id'])}</td><td className="p-4 font-bold">{get(item, ['studentName', 'fullName', 'field1'])}<span className="block text-xs font-normal text-slate-500">{get(item, ['email', 'field10'])}</span></td><td className="p-4">{get(item, ['classApplied', 'className', 'field5'])}</td><td className="p-4"><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">{item.status || 'Under Review'}</span></td><td className="p-4"><button type="button" onClick={(e) => { e.stopPropagation(); setSelected(item); setPreview(true); }} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white">Preview</button></td></tr>)}</tbody></table>{!filtered.length && <p className="p-10 text-center text-slate-500">No admission applications found.</p>}</div></section>
      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{selected ? <><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Selected application</p><h2 className="mt-2 text-2xl font-extrabold">{student}</h2></div>{selected.photoUrl && <img src={selected.photoUrl} alt="Applicant" className="h-20 w-20 rounded-xl object-cover" />}</div><dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">{detail('Reference', ['referenceNumber', 'id'])}{detail('Date of birth', ['dateOfBirth', 'field2'])}{detail('Class', ['classApplied', 'className', 'field5'])}{detail('Gender', ['gender', 'field3'])}{detail('Parent / guardian', ['fatherName', 'parentName', 'field6'])}{detail('Father phone', ['fatherMobile', 'parentMobile', 'phone', 'field8'])}{detail('Mother name', ['motherName', 'field7'])}{detail('Email', ['email', 'field10'])}{detail('Address', ['address', 'field11'])}</dl><div className="mt-6 flex flex-wrap gap-2"><button type="button" onClick={() => updateStatus('Under Review')} className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white">Approve for review</button><button type="button" onClick={() => updateStatus('Interview Scheduled')} className="rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white">Schedule interview</button><button type="button" onClick={() => updateStatus('Admitted')} className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white">Admit</button><button type="button" onClick={() => updateStatus('Rejected')} className="rounded-xl bg-red-700 px-4 py-3 text-sm font-bold text-white">Reject</button><button type="button" onClick={() => setPreview(true)} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold">Full preview</button><button type="button" onClick={removeApplication} className="rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-700">Delete entry</button></div></> : <div className="flex min-h-64 items-center justify-center text-center text-slate-500">Select an application to view details.</div>}</aside>
    </div></div>
    {preview && selected && <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 p-4"><div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex justify-between"><h2 className="text-2xl font-black">Application form preview</h2><button type="button" onClick={() => setPreview(false)} className="rounded-lg border px-3 py-2 font-bold">Close</button></div><div className="mt-6 border-t-4 border-emerald-800 p-5"><div className="flex justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Ansar English School</p><h3 className="mt-2 text-xl font-black">Application for Admission</h3></div>{selected.photoUrl ? <img src={selected.photoUrl} alt="Applicant" className="h-28 w-24 rounded-lg object-cover" /> : <div className="grid h-28 w-24 place-items-center rounded-lg bg-slate-100 text-center text-xs text-slate-400">Photo not provided</div>}</div><dl className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2">{detail('Application reference', ['referenceNumber', 'id'])}{detail('Student name', ['studentName', 'fullName', 'field1'])}{detail('Date of birth', ['dateOfBirth', 'field2'])}{detail('Class applied', ['classApplied', 'className', 'field5'])}{detail('Father name', ['fatherName', 'field6'])}{detail('Mother name', ['motherName', 'field7'])}{detail('Email', ['email', 'field10'])}{detail('Address', ['address', 'field11'])}</dl></div><button type="button" onClick={() => window.print()} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">Print / Save preview as PDF</button></div></div>}
  </main>;
}
