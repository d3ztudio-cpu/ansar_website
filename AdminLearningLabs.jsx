import React, { useEffect, useMemo, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { useContentCollection } from './useContentCollection';
import { normalizeImageUrl } from './imageUrlUtils';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import { LEARNING_LABS } from './learningLabsConfig';


export default function AdminLearningLabs() {
  const { data, loading } = useContentCollection('learningLabs', 'order', 'asc', { firestoreOnly: true });
  const labs = useMemo(() => LEARNING_LABS.map(defaultLab => ({ ...defaultLab, ...(data.find(item => item.id === defaultLab.slug || item.slug === defaultLab.slug) || {}) })), [data]);
  const [selectedSlug, setSelectedSlug] = useState(LEARNING_LABS[0].slug);
  const selected = labs.find(lab => lab.slug === selectedSlug) || labs[0];
  const [form, setForm] = useState({ title: selected.title, description: selected.description, imageUrls: [''] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ title: selected.title, description: selected.description, imageUrls: Array.isArray(selected.imageUrls) && selected.imageUrls.length ? selected.imageUrls : [''] });
  }, [selected.slug, selected.title, selected.description, selected.imageUrls]);

  const appendImages = urls => setForm(current => ({ ...current, imageUrls: [...new Set([...current.imageUrls.filter(Boolean), ...urls])] }));

  const save = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const imageUrls = [...new Set(form.imageUrls.map(normalizeImageUrl).filter(Boolean))];
      await setDoc(doc(db, 'learningLabs', selected.slug), {
        slug: selected.slug,
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrls,
        order: selected.order,
        published: true,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setForm(current => ({ ...current, imageUrls: imageUrls.length ? imageUrls : [''] }));
      alert(`${form.title} saved.`);
    } catch (error) {
      alert(`Save failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return <div className="space-y-6">
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Experiential Learning Labs</p>
      <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Lab content and carousel images</h2>
      <p className="mt-2 text-sm text-slate-500">Select a laboratory and add as many images as needed. Each lab has its own automatic carousel.</p>
    </div>
    <div className="grid gap-6 lg:grid-cols-[19rem_1fr]">
      <aside className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        {labs.map(lab => <button key={lab.slug} type="button" onClick={() => setSelectedSlug(lab.slug)} className={`mb-2 block w-full rounded-xl px-4 py-3 text-left text-sm font-bold ${lab.slug === selectedSlug ? 'bg-emerald-700 text-white' : 'bg-slate-50 text-slate-700 hover:bg-emerald-50'}`}>{lab.title}</button>)}
      </aside>
      <form onSubmit={save} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        {loading && <p className="mb-4 text-sm text-slate-500">Loading saved lab content...</p>}
        <label className="block text-sm font-bold text-slate-700">Lab title</label>
        <input value={form.title} onChange={event => setForm(current => ({ ...current, title: event.target.value }))} required className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
        <label className="mt-5 block text-sm font-bold text-slate-700">Description</label>
        <textarea value={form.description} onChange={event => setForm(current => ({ ...current, description: event.target.value }))} required className="mt-1 h-72 w-full rounded-xl border border-slate-200 p-3 leading-relaxed outline-none focus:ring-2 focus:ring-emerald-500" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="font-extrabold text-slate-900">Carousel images</h3><p className="text-sm text-slate-500">Direct image URLs or ImgBB code.</p></div>
          <ImgBbUrlImporter multiple label="Extract Multiple ImgBB URLs" onExtracted={appendImages} />
        </div>
        <div className="mt-4 space-y-3">{form.imageUrls.map((url, index) => <div key={index} className="flex gap-2">
          <input type="url" value={url} onChange={event => setForm(current => ({ ...current, imageUrls: current.imageUrls.map((image, imageIndex) => imageIndex === index ? event.target.value : image) }))} placeholder={`Image ${index + 1} URL`} className="min-w-0 flex-1 rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
          <button type="button" onClick={() => setForm(current => ({ ...current, imageUrls: current.imageUrls.length === 1 ? [''] : current.imageUrls.filter((_, imageIndex) => imageIndex !== index) }))} className="rounded-xl px-4 font-bold text-red-600 hover:bg-red-50">Remove</button>
        </div>)}</div>
        <button type="button" onClick={() => setForm(current => ({ ...current, imageUrls: [...current.imageUrls, ''] }))} className="mt-4 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50">+ Add image</button>
        <div className="mt-7"><button type="submit" disabled={saving} className="rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800 disabled:opacity-50">{saving ? 'Saving...' : 'Save Lab'}</button></div>
      </form>
    </div>
  </div>;
}
