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
  signatureProjectImageUrl: 'https://i.ibb.co/hFBT52b2/IMG-6340-JPG.jpg',
  outreachWorkshopImageUrl: '',
  stemDiscoveryImageUrl: '',
  inaugurationDate: 'January 2023',
  inauguratedBy: 'MLA Ramya Haridas',
  overviewTitle: 'A space built for curious minds',
  overviewText: 'Inaugurated in January 2023, the ATL marked a significant milestone in the school’s commitment to innovation and scientific learning. The lab gives students the tools, guidance, and freedom to move beyond textbooks—turning questions into experiments and ideas into working prototypes.',
  eventTiles: [
    { id: 'cbse-skill-expo-2026', title: 'CBSE Skill Expo and Guidance Festival 2026–27', images: ['/atl/events/skill-expo-01.jpg', '/atl/events/skill-expo-02.jpg', '/atl/events/skill-expo-03.jpg', '/atl/events/skill-expo-04.jpg'] },
    { id: 'navora-ideathon-2026', title: 'NAVORA Ideathon', images: Array.from({ length: 12 }, (_, index) => `/atl/events/navora-${String(index + 1).padStart(2, '0')}.jpg`) }
  ],
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
  const updateEvent = (eventIndex, key, value) => update('eventTiles', settings.eventTiles.map((item, index) => index === eventIndex ? { ...item, [key]: value } : item));
  const updateEventImage = (eventIndex, imageIndex, value) => updateEvent(eventIndex, 'images', settings.eventTiles[eventIndex].images.map((image, index) => index === imageIndex ? value : image));
  const addEvent = () => update('eventTiles', [...settings.eventTiles, { id: `atl-event-${Date.now()}`, title: '', images: [''] }]);
  const removeEvent = (eventIndex) => update('eventTiles', settings.eventTiles.filter((_, index) => index !== eventIndex));
  const addEventImage = (eventIndex) => updateEvent(eventIndex, 'images', [...settings.eventTiles[eventIndex].images, '']);
  const removeEventImage = (eventIndex, imageIndex) => updateEvent(eventIndex, 'images', settings.eventTiles[eventIndex].images.filter((_, index) => index !== imageIndex));
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
        signatureProjectImageUrl: normalizeImageUrl(settings.signatureProjectImageUrl),
        outreachWorkshopImageUrl: normalizeImageUrl(settings.outreachWorkshopImageUrl),
        stemDiscoveryImageUrl: normalizeImageUrl(settings.stemDiscoveryImageUrl),
        inaugurationDate: settings.inaugurationDate.trim(),
        inauguratedBy: settings.inauguratedBy.trim(),
        overviewTitle: settings.overviewTitle.trim(),
        overviewText: settings.overviewText.trim(),
        eventTiles: settings.eventTiles
          .map((item, index) => ({
            id: item.id || `atl-event-${index + 1}`,
            title: item.title.trim(),
            images: item.images.map(normalizeImageUrl).filter(Boolean)
          }))
          .filter(item => item.title && item.images.length),
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
          <div className="md:col-span-2"><label className="text-sm font-bold text-slate-700">Signature ATL initiative image URL<input required type="text" value={settings.signatureProjectImageUrl} onChange={(e) => update('signatureProjectImageUrl', e.target.value)} className={fieldClass} /></label><p className="mt-2 text-xs leading-5 text-slate-500">Displayed beside “Building democracy, one circuit at a time”.</p><div className="mt-2"><ImgBbUrlImporter onExtracted={(url) => update('signatureProjectImageUrl', url)} /></div></div>
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4"><label className="text-sm font-bold text-slate-700">Robotics outreach workshop image URL<input type="text" value={settings.outreachWorkshopImageUrl} onChange={(e) => update('outreachWorkshopImageUrl', e.target.value)} placeholder="Paste an image URL" className={fieldClass} /></label><p className="mt-2 text-xs leading-5 text-slate-500">Leave blank to keep the existing image placeholder.</p><div className="mt-2"><ImgBbUrlImporter onExtracted={(url) => update('outreachWorkshopImageUrl', url)} /></div></div>
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4"><label className="text-sm font-bold text-slate-700">Hands-on STEM discovery image URL<input type="text" value={settings.stemDiscoveryImageUrl} onChange={(e) => update('stemDiscoveryImageUrl', e.target.value)} placeholder="Paste an image URL" className={fieldClass} /></label><p className="mt-2 text-xs leading-5 text-slate-500">Leave blank to keep the existing image placeholder.</p><div className="mt-2"><ImgBbUrlImporter onExtracted={(url) => update('stemDiscoveryImageUrl', url)} /></div></div>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Inaugurated by<input required value={settings.inauguratedBy} onChange={(e) => update('inauguratedBy', e.target.value)} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Overview title<input required value={settings.overviewTitle} onChange={(e) => update('overviewTitle', e.target.value)} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Overview text<textarea required value={settings.overviewText} onChange={(e) => update('overviewText', e.target.value)} className={`${fieldClass} h-32`} /></label>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h3 className="text-lg font-extrabold text-slate-900">ATL event photo tiles</h3><p className="mt-1 text-sm text-slate-500">Add an event and any number of photos. Only tiles with a title and at least one photo are published.</p></div>
            <button type="button" onClick={addEvent} className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100">+ Add event tile</button>
          </div>
          <div className="mt-5 space-y-5">
            {settings.eventTiles.map((item, eventIndex) => (
              <div key={item.id || eventIndex} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <label className="flex-1 text-sm font-bold text-slate-700">Event title<input value={item.title} onChange={(e) => updateEvent(eventIndex, 'title', e.target.value)} placeholder="Event title" className={fieldClass} /></label>
                  <button type="button" onClick={() => removeEvent(eventIndex)} className="mt-6 rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Remove tile</button>
                </div>
                <div className="mt-4 space-y-3">
                  {item.images.map((imageUrl, imageIndex) => (
                    <div key={`${item.id}-${imageIndex}`} className="rounded-lg border border-slate-200 bg-white p-3">
                      <div className="flex gap-2"><input value={imageUrl} onChange={(e) => updateEventImage(eventIndex, imageIndex, e.target.value)} placeholder="Photo URL" className="min-w-0 flex-1 rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /><button type="button" onClick={() => removeEventImage(eventIndex, imageIndex)} className="rounded-lg px-3 text-sm font-bold text-red-600 hover:bg-red-50">Remove</button></div>
                      <div className="mt-2"><ImgBbUrlImporter onExtracted={(url) => updateEventImage(eventIndex, imageIndex, url)} /></div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addEventImage(eventIndex)} className="mt-3 rounded-lg border border-emerald-100 bg-white px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50">+ Add photo</button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5"><button disabled={saving} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-50">{saving ? 'Saving…' : 'Save ATL settings'}</button></div>
      </form>
    </div>
  );
}
