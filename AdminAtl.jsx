import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import { normalizeImageUrl } from './imageUrlUtils';

const DEFAULT_SETTINGS = {
  aimLabel: 'Established under AIM · NITI Aayog',
  heroTitle: 'Where ideas become',
  heroHighlight: 'innovations.',
  heroDescription: 'The Atal Tinkering Lab at Ansar English School, Perumpilavu is a state-of-the-art STEM learning centre where young minds explore, experiment, and create technology-driven solutions for society.',
  heroImageUrl: '/atl/atl-cover.jpg',
  inaugurationDate: 'January 2023',
  inauguratedBy: 'MLA Ramya Haridas',
  overviewTitle: 'A space built for curious minds',
  overviewText: 'Inaugurated in January 2023, the ATL marked a significant milestone in the school’s commitment to innovation and scientific learning. The lab gives students the tools, guidance, and freedom to move beyond textbooks—turning questions into experiments and ideas into working prototypes.',
  published: true
};

export default function AdminAtl() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'atlSettings', 'main'), (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      setExisting(data);
      setSettings({ ...DEFAULT_SETTINGS, ...data });
    });
    return unsubscribe;
  }, []);

  const update = (key, value) => setSettings(current => ({ ...current, [key]: value }));
  const fieldClass = 'mt-1 w-full rounded-lg border border-slate-200 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-500';

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'atlSettings', 'main'), {
        aimLabel: settings.aimLabel.trim(),
        heroTitle: settings.heroTitle.trim(),
        heroHighlight: settings.heroHighlight.trim(),
        heroDescription: settings.heroDescription.trim(),
        heroImageUrl: normalizeImageUrl(settings.heroImageUrl),
        inaugurationDate: settings.inaugurationDate.trim(),
        inauguratedBy: settings.inauguratedBy.trim(),
        overviewTitle: settings.overviewTitle.trim(),
        overviewText: settings.overviewText.trim(),
        published: !!settings.published,
        createdAt: existing?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      alert('ATL page settings saved.');
    } catch (error) {
      console.error(error);
      alert(`Could not save ATL settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Atal Tinkering Lab</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Manage the ATL page</h2>
        <p className="mt-2 max-w-3xl leading-7 text-slate-600">Update the hero message, cover image, inauguration details, and ATL introduction. The remaining learning sections stay consistent with the school’s STEM programme.</p>
      </div>
      <form onSubmit={save} className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">AIM label<input required value={settings.aimLabel} onChange={(e) => update('aimLabel', e.target.value)} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700">Inauguration date<input required value={settings.inaugurationDate} onChange={(e) => update('inaugurationDate', e.target.value)} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700">Hero title<input required value={settings.heroTitle} onChange={(e) => update('heroTitle', e.target.value)} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700">Hero highlight<input required value={settings.heroHighlight} onChange={(e) => update('heroHighlight', e.target.value)} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Hero description<textarea required value={settings.heroDescription} onChange={(e) => update('heroDescription', e.target.value)} className={`${fieldClass} h-28`} /></label>
          <div className="md:col-span-2"><label className="text-sm font-bold text-slate-700">Cover image URL<input required type="text" value={settings.heroImageUrl} onChange={(e) => update('heroImageUrl', e.target.value)} className={fieldClass} /></label><div className="mt-2"><ImgBbUrlImporter onExtracted={(url) => update('heroImageUrl', url)} /></div></div>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Inaugurated by<input required value={settings.inauguratedBy} onChange={(e) => update('inauguratedBy', e.target.value)} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Overview title<input required value={settings.overviewTitle} onChange={(e) => update('overviewTitle', e.target.value)} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Overview text<textarea required value={settings.overviewText} onChange={(e) => update('overviewText', e.target.value)} className={`${fieldClass} h-32`} /></label>
        </div>
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5"><button disabled={saving} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-50">{saving ? 'Saving…' : 'Save ATL settings'}</button></div>
      </form>
    </div>
  );
}
