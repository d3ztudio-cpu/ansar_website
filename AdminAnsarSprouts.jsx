import React, { useEffect, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { clearGoogleSheetsCache, useContentCollection, useContentDocument } from './useContentCollection';
import { normalizeImageUrl } from './imageUrlUtils';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import { DEFAULT_RADIO_STATION_IMAGE, DEFAULT_SPROUTS_IMAGES } from './AnsarSprouts';
import { deleteSheetRecord, saveSheetRecord } from './googleSheetsAdminApi';

const MAX_IMAGES = 30;
const EMPTY_ACTIVITY = { title: '', category: '', date: '', description: '', imageUrls: [''], order: 0, published: true };

export default function AdminAnsarSprouts() {
  const { data, loading } = useContentDocument('pages', 'ansar-sprouts');
  const [images, setImages] = useState(DEFAULT_SPROUTS_IMAGES);
  const [radioStationImageUrl, setRadioStationImageUrl] = useState(DEFAULT_RADIO_STATION_IMAGE);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: activities, loading: activitiesLoading } = useContentCollection('sproutsActivities', 'date', 'desc', { sheetsOnly: true, refreshKey });
  const [activity, setActivity] = useState(EMPTY_ACTIVITY);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [savingActivity, setSavingActivity] = useState(false);

  useEffect(() => {
    if (Array.isArray(data?.sproutsImages) && data.sproutsImages.length) setImages(data.sproutsImages);
    setRadioStationImageUrl(data?.radioStationImageUrl || DEFAULT_RADIO_STATION_IMAGE);
  }, [data]);

  const appendImages = urls => setImages(current => [...new Set([...current.filter(Boolean), ...urls])].slice(0, MAX_IMAGES));

  const save = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const sproutsImages = [...new Set(images.map(normalizeImageUrl).filter(Boolean))].slice(0, MAX_IMAGES);
      const normalizedRadioStationImageUrl = normalizeImageUrl(radioStationImageUrl);
      await setDoc(doc(db, 'pages', 'ansar-sprouts'), {
        title: 'Ansar Sprouts',
        slug: 'ansar-sprouts',
        sproutsImages,
        radioStationImageUrl: normalizedRadioStationImageUrl,
        published: true,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setImages(sproutsImages.length ? sproutsImages : DEFAULT_SPROUTS_IMAGES);
      setRadioStationImageUrl(normalizedRadioStationImageUrl);
      alert('Ansar Sprouts images and facility image saved.');
    } catch (error) {
      alert(`Save failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const updateActivityField = event => {
    const { name, value, type, checked } = event.target;
    setActivity(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };
  const appendActivityImages = urls => setActivity(current => ({ ...current, imageUrls: [...new Set([...current.imageUrls.filter(Boolean), ...urls])].slice(0, MAX_IMAGES) }));
  const resetActivity = () => { setEditingActivityId(null); setActivity(EMPTY_ACTIVITY); };
  const refreshActivities = () => { clearGoogleSheetsCache(); setRefreshKey(value => value + 1); };
  const editActivity = item => {
    setEditingActivityId(item.id);
    setActivity({ title: item.title || '', category: item.category || '', date: item.date || '', description: item.description || '', imageUrls: item.imageUrls?.length ? item.imageUrls : [''], order: item.order || 0, published: item.published !== false });
    window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' });
  };
  const saveActivity = async event => {
    event.preventDefault();
    setSavingActivity(true);
    try {
      const imageUrls = [...new Set(activity.imageUrls.map(normalizeImageUrl).filter(Boolean))].slice(0, MAX_IMAGES);
      await saveSheetRecord('sproutsActivities', { ...activity, id: editingActivityId || undefined, title: activity.title.trim(), category: activity.category.trim() || 'Sprouts Activity', description: activity.description.trim(), imageUrls, order: Number(activity.order) || 0, published: !!activity.published });
      resetActivity();
      refreshActivities();
      alert('Sprouts activity saved to Google Sheets.');
    } catch (error) { alert(`Save failed: ${error.message}`); }
    finally { setSavingActivity(false); }
  };
  const removeActivity = async item => {
    if (!window.confirm(`Delete "${item.title}" from the Sprouts gallery?`)) return;
    try { await deleteSheetRecord('sproutsActivities', item.id, item); refreshActivities(); }
    catch (error) { alert(`Delete failed: ${error.message}`); }
  };

  return <div className="space-y-8"><form onSubmit={save} className="rounded-2xl border border-orange-100 bg-white p-6 shadow-xl sm:p-8">
    <p className="text-xs font-black uppercase tracking-widest text-orange-500">Ansar Sprouts</p>
    <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Cover carousel images</h2>
    <p className="mt-2 text-sm leading-relaxed text-slate-500">The first image is the cover. Add up to {MAX_IMAGES} images; they will slide automatically in the Sprouts hero.</p>
    {loading && <p className="mt-4 text-sm font-semibold text-slate-500">Loading saved images...</p>}

    <div className="mt-6 flex flex-wrap justify-end gap-3">
      <ImgBbUrlImporter multiple label="Extract Multiple ImgBB URLs" onExtracted={appendImages} />
    </div>
    <div className="mt-4 space-y-4">{images.map((url, index) => <div key={index} className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">{url ? <img src={url} alt={`Sprouts preview ${index + 1}`} className="h-full w-full object-cover" /> : null}</div>
      <div>
        <label className="text-xs font-black uppercase tracking-wider text-slate-500">{index === 0 ? 'Cover image' : `Carousel image ${index + 1}`}</label>
        <input type="url" value={url} onChange={event => setImages(current => current.map((image, imageIndex) => imageIndex === index ? event.target.value : image))} placeholder="https://example.com/image.jpg" className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-orange-400" />
      </div>
      <button type="button" onClick={() => setImages(current => current.length === 1 ? [''] : current.filter((_, imageIndex) => imageIndex !== index))} className="rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50">Remove</button>
    </div>)}</div>
    <button type="button" onClick={() => setImages(current => current.length < MAX_IMAGES ? [...current, ''] : current)} className="mt-4 rounded-xl border border-orange-200 px-4 py-2 text-sm font-bold text-orange-600 hover:bg-orange-50">+ Add image</button>
    <div className="mt-8 border-t border-slate-100 pt-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h3 className="text-xl font-extrabold text-slate-900">Sprouts FM Radio Station image</h3><p className="mt-1 text-sm leading-relaxed text-slate-500">Upload the facility photograph shown on the Sprouts page.</p></div>
        <ImgBbUrlImporter label="Extract ImgBB URL" onExtracted={url => setRadioStationImageUrl(url || '')} />
      </div>
      <div className="mt-4 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-[12rem_1fr] sm:items-center">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">{radioStationImageUrl ? <img src={radioStationImageUrl} alt="Sprouts FM Radio Station preview" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-4 text-center text-sm font-bold text-slate-400">No image uploaded</div>}</div>
        <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">Facility image URL</span><input type="url" value={radioStationImageUrl} onChange={event => setRadioStationImageUrl(event.target.value)} placeholder="https://example.com/radio-station.jpg" className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:ring-2 focus:ring-orange-400" /></label>
      </div>
    </div>
    <div className="mt-7 border-t border-slate-100 pt-6"><button type="submit" disabled={saving} className="rounded-xl bg-orange-500 px-7 py-3 font-black text-white shadow hover:bg-orange-600 disabled:opacity-50">{saving ? 'Saving...' : 'Save Sprouts Images & Facility'}</button></div>
  </form>

  <form onSubmit={saveActivity} className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl sm:p-8">
    <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Sprouts-only gallery</p>
    <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{editingActivityId ? 'Edit activity article' : 'Add activity article'}</h2>
    <p className="mt-2 text-sm leading-relaxed text-slate-500">These articles appear only on the Ansar Sprouts page and are stored in the sproutsActivities tab in Google Sheets.</p>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <label><span className="text-sm font-bold text-slate-700">Activity title *</span><input name="title" value={activity.title} onChange={updateActivityField} required className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
      <label><span className="text-sm font-bold text-slate-700">Category</span><input name="category" value={activity.category} onChange={updateActivityField} placeholder="Creative Learning, Celebration..." className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
      <label><span className="text-sm font-bold text-slate-700">Date</span><input type="date" name="date" value={activity.date} onChange={updateActivityField} className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
      <label><span className="text-sm font-bold text-slate-700">Display order</span><input type="number" name="order" value={activity.order} onChange={updateActivityField} className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
    </div>
    <label className="mt-4 block"><span className="text-sm font-bold text-slate-700">Article description *</span><textarea name="description" value={activity.description} onChange={updateActivityField} required className="mt-1 h-36 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">Activity images</h3><p className="text-sm text-slate-500">The first image is the article cover; all images rotate in its carousel.</p></div><ImgBbUrlImporter multiple label="Extract Multiple ImgBB URLs" onExtracted={appendActivityImages} /></div>
    <div className="mt-4 space-y-3">{activity.imageUrls.map((url, index) => <div key={index} className="flex gap-2"><input type="url" value={url} onChange={event => setActivity(current => ({ ...current, imageUrls: current.imageUrls.map((image, imageIndex) => imageIndex === index ? event.target.value : image) }))} placeholder={`Activity image ${index + 1}`} className="min-w-0 flex-1 rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /><button type="button" onClick={() => setActivity(current => ({ ...current, imageUrls: current.imageUrls.length === 1 ? [''] : current.imageUrls.filter((_, imageIndex) => imageIndex !== index) }))} className="rounded-xl px-4 font-bold text-red-600 hover:bg-red-50">Remove</button></div>)}</div>
    <button type="button" onClick={() => setActivity(current => current.imageUrls.length < MAX_IMAGES ? ({ ...current, imageUrls: [...current.imageUrls, ''] }) : current)} className="mt-4 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-700">+ Add image</button>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6"><label className="flex items-center gap-2 font-bold text-slate-700"><input type="checkbox" name="published" checked={activity.published} onChange={updateActivityField} className="h-5 w-5" /> Published</label><div className="flex gap-3">{editingActivityId && <button type="button" onClick={resetActivity} className="rounded-xl px-5 py-3 font-bold text-slate-600">Cancel</button>}<button type="submit" disabled={savingActivity} className="rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white disabled:opacity-50">{savingActivity ? 'Saving...' : 'Save Activity to Google Sheets'}</button></div></div>
  </form>

  <section className="space-y-3"><h2 className="text-xl font-extrabold text-slate-900">Sprouts activity articles</h2>{activitiesLoading ? <p className="text-slate-500">Loading from Google Sheets...</p> : activities.length ? activities.map(item => <article key={item.id} className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"><div className="h-20 w-28 flex-none overflow-hidden rounded-lg bg-amber-50">{item.imageUrls?.[0] && <img src={item.imageUrls[0]} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0 flex-1"><p className="text-xs font-extrabold uppercase text-orange-600">{item.category || 'Sprouts Activity'}</p><h3 className="truncate font-extrabold text-slate-900">{item.title}</h3><p className="text-sm text-slate-500">{item.date || 'No date'} · {item.published === false ? 'Draft' : 'Published'}</p></div><div className="flex gap-2"><button type="button" onClick={() => editActivity(item)} className="rounded-lg px-3 py-2 font-bold text-emerald-700">Edit</button><button type="button" onClick={() => removeActivity(item)} className="rounded-lg px-3 py-2 font-bold text-red-600">Delete</button></div></article>) : <p className="rounded-xl bg-white p-6 text-slate-500">No Sprouts activities have been added yet.</p>}</section>
  </div>;
}
