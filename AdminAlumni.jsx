import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { normalizeImageUrl } from './imageUrlUtils';
import { DEFAULT_ALUMNI_SETTINGS, mergeAlumniSettings } from './alumniContent';

const fieldClass = 'mt-1 w-full rounded-lg border border-slate-200 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-500';

function TextField({ label, value, onChange, multiline = false, required = true }) {
  const props = { required, value: value || '', onChange: e => onChange(e.target.value), className: `${fieldClass} ${multiline ? 'min-h-28' : ''}` };
  return <label className="block text-sm font-bold text-slate-700">{label}{multiline ? <textarea {...props} /> : <input {...props} />}</label>;
}

function ImageUrlFields({ urls, onChange }) {
  const values = urls?.length ? urls : [''];
  return <div className="space-y-3"><p className="text-sm font-bold text-slate-700">Image URLs</p>{values.map((url, index) => <div key={index} className="flex gap-2"><input value={url} onChange={e => onChange(values.map((item, i) => i === index ? e.target.value : item))} placeholder="Paste image URL; leave blank for an image space" className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />{values.length > 1 && <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} className="rounded-lg border border-red-200 px-3 font-bold text-red-600">×</button>}</div>)}<button type="button" onClick={() => onChange([...values, ''])} className="text-sm font-extrabold text-emerald-700">+ Add another image space</button></div>;
}

function StoryEditor({ title, items, onChange, speakers = false }) {
  const updateItem = (index, key, value) => onChange(items.map((item, i) => i === index ? { ...item, [key]: value } : item));
  return <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center justify-between gap-4"><h3 className="text-xl font-extrabold text-slate-900">{title}</h3><button type="button" onClick={() => onChange([...items, { title: 'New alumni story', subtitle: '', speaker: '', body: '', imageUrls: [''] }])} className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-extrabold text-emerald-700">+ Add card</button></div><div className="mt-6 space-y-6">{items.map((item, index) => <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-5"><div className="mb-4 flex justify-between"><p className="font-extrabold text-slate-800">Card {index + 1}</p><button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="text-sm font-bold text-red-600">Remove card</button></div><div className="grid gap-4 md:grid-cols-2"><TextField label="Title" value={item.title} onChange={v => updateItem(index, 'title', v)} /><TextField label="Subtitle" value={item.subtitle} required={false} onChange={v => updateItem(index, 'subtitle', v)} />{speakers && <div className="md:col-span-2"><TextField label="Speaker" value={item.speaker} required={false} onChange={v => updateItem(index, 'speaker', v)} /></div>}<div className="md:col-span-2"><TextField label="Description" value={item.body} multiline onChange={v => updateItem(index, 'body', v)} /></div><div className="md:col-span-2"><ImageUrlFields urls={item.imageUrls} onChange={v => updateItem(index, 'imageUrls', v)} /></div></div></div>)}</div></section>;
}

export default function AdminAlumni() {
  const [settings, setSettings] = useState(DEFAULT_ALUMNI_SETTINGS);
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => onSnapshot(doc(db, 'settings', 'alumniPage'), snap => { if (snap.exists()) { setExisting(snap.data()); setSettings(mergeAlumniSettings(snap.data())); } }), []);
  const update = (key, value) => setSettings(current => ({ ...current, [key]: value }));
  const save = async event => {
    event.preventDefault(); setSaving(true);
    try {
      const cleanUrls = urls => (urls?.length ? urls : ['']).map(url => normalizeImageUrl(url));
      await setDoc(doc(db, 'settings', 'alumniPage'), { ...settings, heroImageUrl: normalizeImageUrl(settings.heroImageUrl), events: settings.events.map(item => ({ ...item, imageUrls: cleanUrls(item.imageUrls) })), successStories: settings.successStories.map(item => ({ ...item, imageUrls: cleanUrls(item.imageUrls) })), givingBackImageUrls: cleanUrls(settings.givingBackImageUrls), createdAt: existing?.createdAt || serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
      alert('Alumni page settings saved.');
    } catch (error) { console.error(error); alert(`Could not save Alumni settings: ${error.message}`); }
    finally { setSaving(false); }
  };
  return <div className="mx-auto max-w-6xl"><div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8"><p className="text-xs font-black uppercase tracking-[.18em] text-emerald-700">Alumni page</p><h2 className="mt-2 text-2xl font-extrabold text-slate-900">Manage Alumni content</h2><p className="mt-2 max-w-3xl leading-7 text-slate-600">Edit all Alumni sections and paste image URLs into their matching cards. Blank image fields remain as image spaces on the website.</p></div><form onSubmit={save} className="mt-8 space-y-8">
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"><h3 className="text-xl font-extrabold text-slate-900">Hero and introduction</h3><div className="mt-5 grid gap-5 md:grid-cols-2"><TextField label="Eyebrow" value={settings.eyebrow} onChange={v => update('eyebrow', v)} /><TextField label="Hero title" value={settings.heroTitle} onChange={v => update('heroTitle', v)} /><div className="md:col-span-2"><TextField label="Hero subtitle" value={settings.heroSubtitle} multiline onChange={v => update('heroSubtitle', v)} /></div><div className="md:col-span-2"><TextField label="Hero image URL" value={settings.heroImageUrl} onChange={v => update('heroImageUrl', v)} /></div><TextField label="Introduction title" value={settings.introTitle} onChange={v => update('introTitle', v)} /><div className="md:col-span-2"><TextField label="Introduction text" value={settings.introText} multiline onChange={v => update('introText', v)} /></div></div></section>
    <StoryEditor title="Events" items={settings.events} onChange={v => update('events', v)} speakers />
    <StoryEditor title="Success stories" items={settings.successStories} onChange={v => update('successStories', v)} />
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"><h3 className="text-xl font-extrabold text-slate-900">Networking — Thanal Programme</h3><div className="mt-5 space-y-5"><TextField label="Section title" value={settings.thanalTitle} onChange={v => update('thanalTitle', v)} /><TextField label="Description" value={settings.thanalText} multiline onChange={v => update('thanalText', v)} />{settings.contributions.map((item, index) => <div key={index} className="grid gap-4 rounded-xl bg-slate-50 p-4 md:grid-cols-[.35fr_.65fr]"><TextField label={`Contribution ${index + 1}`} value={item.title} onChange={v => update('contributions', settings.contributions.map((x, i) => i === index ? { ...x, title: v } : x))} /><TextField label="Description" value={item.body} multiline onChange={v => update('contributions', settings.contributions.map((x, i) => i === index ? { ...x, body: v } : x))} /></div>)}</div></section>
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"><h3 className="text-xl font-extrabold text-slate-900">Giving back</h3><div className="mt-5 space-y-5"><TextField label="Title" value={settings.givingBackTitle} onChange={v => update('givingBackTitle', v)} /><TextField label="Description" value={settings.givingBackText} multiline onChange={v => update('givingBackText', v)} /><ImageUrlFields urls={settings.givingBackImageUrls} onChange={v => update('givingBackImageUrls', v)} /></div></section>
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"><h3 className="text-xl font-extrabold text-slate-900">PDF and alumni directory</h3><div className="mt-5 grid gap-5"><TextField label="PDF section title" value={settings.pdfTitle} onChange={v => update('pdfTitle', v)} /><TextField label="PDF description" value={settings.pdfDescription} multiline onChange={v => update('pdfDescription', v)} /><TextField label="PDF / Google Drive URL" value={settings.pdfUrl} onChange={v => update('pdfUrl', v)} /><TextField label="Prominent positions PDF URL" value={settings.prominentPositionsUrl} onChange={v => update('prominentPositionsUrl', v)} /></div></section>
    <div className="sticky bottom-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur"><label className="flex items-center gap-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={settings.published !== false} onChange={e => update('published', e.target.checked)} className="h-5 w-5" />Publish Alumni page</label><button disabled={saving} className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-extrabold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save Alumni page'}</button></div>
  </form></div>;
}
