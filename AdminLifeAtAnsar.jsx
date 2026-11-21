import React, { useEffect, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { useContentDocument } from './useContentCollection';
import { normalizeImageUrl } from './imageUrlUtils';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import { NSS_CONTENT, SPC_CONTENT, SPC_IMAGES } from './LifeAtAnsar';

const SECTION_CONFIG = [
  { key: 'clubs', label: 'Clubs' },
  { key: 'nss', label: 'National Service Scheme (NSS)' },
  { key: 'spc', label: 'Student Police Cadet (SPC)' }
];

const initialForm = {
  clubsTitle: 'Clubs', clubsBody: '', clubsImages: [''],
  nssTitle: 'National Service Scheme (NSS) – Unit NO: SFU/3, Ansar English School, Perumpilavu', nssBody: NSS_CONTENT, nssImages: [''],
  spcTitle: 'Student Police Cadet (SPC) – Ansar English School, Perumbilavu', spcBody: SPC_CONTENT, spcImages: SPC_IMAGES
};

export default function AdminLifeAtAnsar() {
  const { data, loading } = useContentDocument('pages', 'life-at-ansar');
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data) return;
    setForm(current => {
      const next = { ...current };
      SECTION_CONFIG.forEach(({ key }) => {
        next[`${key}Title`] = data[`${key}Title`] || current[`${key}Title`];
        next[`${key}Body`] = data[`${key}Body`] || current[`${key}Body`];
        next[`${key}Images`] = Array.isArray(data[`${key}Images`]) && data[`${key}Images`].length ? data[`${key}Images`] : [''];
      });
      return next;
    });
  }, [data]);

  const updateImages = (key, updater) => setForm(current => ({ ...current, [`${key}Images`]: updater(current[`${key}Images`]) }));

  const appendImages = (key, urls) => updateImages(key, images => [...new Set([...images.filter(Boolean), ...urls])]);

  const save = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { title: 'Life at Ansar', slug: 'life-at-ansar', published: true, updatedAt: serverTimestamp() };
      SECTION_CONFIG.forEach(({ key }) => {
        payload[`${key}Title`] = form[`${key}Title`].trim();
        payload[`${key}Body`] = form[`${key}Body`].trim();
        payload[`${key}Images`] = [...new Set(form[`${key}Images`].map(normalizeImageUrl).filter(Boolean))];
      });
      await setDoc(doc(db, 'pages', 'life-at-ansar'), payload, { merge: true });
      alert('Life at Ansar content saved.');
    } catch (error) {
      alert(`Save failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading Life at Ansar content...</p>;

  return (
    <form onSubmit={save} className="space-y-8">
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl sm:p-8">
        <h2 className="text-2xl font-extrabold text-slate-900">Life at Ansar</h2>
        <p className="mt-2 text-sm text-slate-500">Manage section content and add as many carousel images as needed for each programme.</p>
      </div>

      {SECTION_CONFIG.map(({ key, label }) => (
        <section key={key} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-xl font-extrabold text-emerald-950">{label}</h3>
          <label className="mt-5 block text-sm font-bold text-slate-700">Section title</label>
          <input value={form[`${key}Title`]} onChange={event => setForm(current => ({ ...current, [`${key}Title`]: event.target.value }))} required className="mt-1 w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
          <label className="mt-4 block text-sm font-bold text-slate-700">Content</label>
          <textarea value={form[`${key}Body`]} onChange={event => setForm(current => ({ ...current, [`${key}Body`]: event.target.value }))} className="mt-1 h-48 w-full rounded-lg border border-slate-200 p-3 leading-relaxed outline-none focus:ring-2 focus:ring-emerald-500" />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <label className="text-sm font-bold text-slate-700">Carousel images</label>
            <ImgBbUrlImporter multiple label="Extract Multiple ImgBB URLs" onExtracted={urls => appendImages(key, urls)} />
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {form[`${key}Images`].map((url, index) => (
              <div key={index} className="flex gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <input type="url" value={url} onChange={event => updateImages(key, images => images.map((image, imageIndex) => imageIndex === index ? event.target.value : image))} placeholder="https://example.com/image.jpg" className="min-w-0 flex-1 rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                <button type="button" onClick={() => updateImages(key, images => images.length === 1 ? [''] : images.filter((_, imageIndex) => imageIndex !== index))} className="rounded-lg px-3 font-bold text-red-600 hover:bg-red-50" aria-label={`Remove ${label} image ${index + 1}`}>×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => updateImages(key, images => images.length < 30 ? [...images, ''] : images)} className="mt-3 rounded-lg border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50">+ Add image</button>
        </section>
      ))}

      <button type="submit" disabled={saving} className="rounded-xl bg-emerald-700 px-7 py-3 font-bold text-white shadow-lg hover:bg-emerald-800 disabled:opacity-50">{saving ? 'Saving...' : 'Save Life at Ansar'}</button>
    </form>
  );
}
