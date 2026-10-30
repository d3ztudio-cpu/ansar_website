import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase-init';

const DEFAULT_ADMISSION_DESK_EMAILS = ['d3ztudio@gmail.com', 'ansarmedia@ansarschool.in', 'aesmedia2025@gmail.com'];

export default function DeveloperOptions() {
  const [enabled, setEnabled] = useState(false);
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Loading developer settings…');
  const [saving, setSaving] = useState(false);

  useEffect(() => { getDoc(doc(db, 'settings', 'global')).then((snap) => {
    const data = snap.exists() ? snap.data() : {};
    setEnabled(data.admissionsPortalEnabled !== false);
    const mergedEmails = [...new Set([...(Array.isArray(data.admissionDeskEmails) ? data.admissionDeskEmails : []), ...DEFAULT_ADMISSION_DESK_EMAILS])];
    setEmails(mergedEmails);
    if (mergedEmails.length !== (Array.isArray(data.admissionDeskEmails) ? data.admissionDeskEmails.length : 0)) updateDoc(doc(db, 'settings', 'global'), { admissionDeskEmails: mergedEmails }).catch(() => {});
    setMessage('');
  }).catch(() => setMessage('Unable to load developer settings.')); }, []);

  const save = async (nextEnabled = enabled, nextEmails = emails) => {
    setSaving(true); setMessage('Saving…');
    try { await updateDoc(doc(db, 'settings', 'global'), { admissionsPortalEnabled: nextEnabled, admissionDeskEmails: nextEmails }); setMessage('Developer settings saved.'); }
    catch (error) { setMessage(error.message || 'Could not save settings.'); }
    finally { setSaving(false); }
  };
  const addEmail = (event) => { event.preventDefault(); const value = email.trim().toLowerCase(); if (!value || !value.includes('@') || emails.includes(value)) return; const next = [...emails, value]; setEmails(next); setEmail(''); save(enabled, next); };
  const removeEmail = (value) => { const next = emails.filter((item) => item !== value); setEmails(next); save(enabled, next); };
  return <div className="space-y-6"><div><p className="text-xs font-black uppercase tracking-widest text-amber-600">Developer-only controls</p><h2 className="mt-2 text-3xl font-extrabold text-slate-900">Developer Options</h2><p className="mt-2 max-w-2xl text-slate-500">The admissions portal is unofficial and hidden from the public website until approval. Use these controls to test access.</p></div><section className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="font-extrabold text-slate-900">Admissions portal</h3><p className="mt-1 text-sm text-slate-600">{enabled ? 'Enabled for assigned admission desk users.' : 'Disabled. No admission desk user can open the portal.'}</p></div><button type="button" disabled={saving} onClick={() => { const next = !enabled; setEnabled(next); save(next, emails); }} className={`rounded-full px-5 py-2.5 text-sm font-black text-white ${enabled ? 'bg-emerald-700' : 'bg-slate-500'}`}>{enabled ? 'Enabled' : 'Disabled'}</button></div></section><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-lg font-extrabold text-slate-900">Admission desk email IDs</h3><p className="mt-1 text-sm text-slate-500">Only these authenticated email addresses may access the admission desk.</p><form onSubmit={addEmail} className="mt-4 flex flex-col gap-3 sm:flex-row"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admissions@ansarschool.in" className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" /><button disabled={saving} className="rounded-xl bg-emerald-700 px-5 py-3 font-black text-white">Assign email</button></form><div className="mt-5 space-y-2">{emails.length ? emails.map((item) => <div key={item} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"><span>{item}</span><button type="button" onClick={() => removeEmail(item)} className="text-red-600">Remove</button></div>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No admission desk users assigned.</p>}</div></section>{message && <p className="text-sm font-bold text-slate-500">{message}</p>}</div>;
}
