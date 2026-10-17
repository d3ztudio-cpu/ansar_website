import React, { useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { clearGoogleSheetsCache, useContentCollection } from './useContentCollection';
import { imageCandidates, normalizeImageUrl } from './imageUrlUtils';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import { softDeleteRecord } from './adminUndo';
import { deleteSheetRecord } from './googleSheetsAdminApi';
import { FIELD_TRIP_SECTIONS } from './FieldTrips';

const MAX_IMAGES = 30;
const initialForm = (section = 'Ansar Sprouts') => ({ title: '', section, destination: '', date: '', description: '', coverImageUrl: '', imageUrls: [''], published: true });

function isLegacySproutsFieldTrip(activity) {
  return activity.isFieldTrip === true || String(activity.isFieldTrip).toLowerCase() === 'true' || /^field\s*trips?$/i.test(String(activity.category || '').trim()) || /\b(field|farm|paddy)\s+visit\b/i.test(String(activity.title || ''));
}

function legacyDestination(activity) {
  const match = `${activity.title || ''} ${activity.description || ''}`.match(/visited\s+([^.,\n]+)/i);
  return match ? match[1].trim() : (/paddy\s+field/i.test(String(activity.title || '')) ? 'Paddy Field' : '');
}

export default function AdminFieldTrips({ lockedSection = '' }) {
  const { data, loading } = useContentCollection('fieldTrips', null, 'desc', { firestoreOnly: true });
  const { data: sproutsActivities, loading: sproutsLoading } = useContentCollection('sproutsActivities', 'date', 'desc', { sheetsOnly: true });
  const { data: galleryItems } = useContentCollection('gallery', null, 'desc', { firestoreOnly: true });
  const [form, setForm] = useState(() => initialForm(lockedSection || 'Ansar Sprouts'));
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [legacySourceId, setLegacySourceId] = useState('');
  const [deletedLegacyIds, setDeletedLegacyIds] = useState([]);

  const setField = event => { const { name, value, type, checked } = event.target; setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value })); };
  const appendImages = urls => setForm(current => ({ ...current, imageUrls: [...new Set([...current.imageUrls.filter(Boolean), ...urls])].slice(0, MAX_IMAGES) }));
  const reset = () => { setEditingId(null); setLegacySourceId(''); setForm(initialForm(lockedSection || 'Ansar Sprouts')); };
  const edit = trip => { setEditingId(trip.isLegacySproutsTrip ? null : trip.id); setLegacySourceId(trip.isLegacySproutsTrip ? String(trip.sourceId || '') : ''); setForm({ title: trip.title || '', section: lockedSection || trip.section || 'General', destination: trip.destination || '', date: trip.date || '', description: trip.description || '', coverImageUrl: trip.coverImageUrl || trip.imageUrls?.[0] || '', imageUrls: Array.isArray(trip.imageUrls) && trip.imageUrls.length ? trip.imageUrls : [''], published: trip.published !== false }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const save = async event => {
    event.preventDefault(); setSaving(true);
    try {
      const imageUrls = [...new Set(form.imageUrls.map(normalizeImageUrl).filter(Boolean))].slice(0, MAX_IMAGES);
      const payload = { title: form.title.trim(), section: lockedSection || form.section, destination: form.destination.trim(), date: form.date, description: form.description.trim(), coverImageUrl: normalizeImageUrl(form.coverImageUrl), imageUrls, published: !!form.published, updatedAt: serverTimestamp() };
      if (editingId) await updateDoc(doc(db, 'fieldTrips', editingId), payload);
      else {
        await addDoc(collection(db, 'fieldTrips'), { ...payload, createdAt: serverTimestamp() });
        if (legacySourceId) { await deleteSheetRecord('sproutsActivities', legacySourceId); clearGoogleSheetsCache(); setDeletedLegacyIds(ids => [...ids, legacySourceId]); }
      }
      reset();
    } catch (error) { alert(`Save failed: ${error.message}`); }
    finally { setSaving(false); }
  };

  const remove = async trip => { if (!window.confirm(`Delete “${trip.title}”?`)) return; try { await softDeleteRecord('fieldTrips', trip); } catch (error) { alert(`Delete failed: ${error.message}`); } };
  const libraryImages = [...new Set(galleryItems.flatMap(item => imageCandidates(item.coverImageUrl, item.imageUrl, item.eventImages, item.imageUrls)))];

  const removeLegacy = async trip => { if (!window.confirm(`Delete “${trip.title}” from Sprouts activities?`)) return; try { await deleteSheetRecord('sproutsActivities', trip.sourceId); clearGoogleSheetsCache(); setDeletedLegacyIds(ids => [...ids, trip.sourceId]); } catch (error) { alert(`Delete failed: ${error.message}`); } };
  const legacySproutsTrips = sproutsActivities.filter(activity => activity.published !== false && !deletedLegacyIds.includes(activity.id) && isLegacySproutsFieldTrip(activity)).filter(activity => !data.some(trip => trip.title === activity.title && trip.date === activity.date)).map(activity => ({ ...activity, id: `sprouts-${activity.id}`, sourceId: activity.id, section: 'Ansar Sprouts', destination: legacyDestination(activity), coverImageUrl: activity.imageUrls?.[0] || '', isLegacySproutsTrip: true }));
  const listedTrips = [...data, ...legacySproutsTrips].filter(trip => !lockedSection || trip.section === lockedSection).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  return <div className="space-y-8">
    <form onSubmit={save} className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl sm:p-8">
      <h2 className="text-2xl font-extrabold text-slate-900">{editingId ? 'Edit Field Trip' : 'Add Field Trip'}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block"><span className="text-sm font-bold text-slate-700">Title *</span><input name="title" value={form.title} onChange={setField} required className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block"><span className="text-sm font-bold text-slate-700">Section *</span>{lockedSection ? <input value={lockedSection} readOnly className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-600" /> : <select name="section" value={form.section} onChange={setField} className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500">{FIELD_TRIP_SECTIONS.map(section => <option key={section}>{section}</option>)}</select>}</label>
        <label className="block"><span className="text-sm font-bold text-slate-700">Destination *</span><input name="destination" value={form.destination} onChange={setField} required className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block"><span className="text-sm font-bold text-slate-700">Date *</span><input type="date" name="date" value={form.date} onChange={setField} required className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
      </div>
      <label className="mt-4 block"><span className="text-sm font-bold text-slate-700">Description *</span><textarea name="description" value={form.description} onChange={setField} required className="mt-1 h-40 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">Cover image</h3><p className="text-sm text-slate-500">Shown on the field-trip card only.</p></div><button type="button" onClick={() => setShowImageLibrary(open => !open)} className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700">Choose from image library</button></div><div className="mt-4"><ImgBbUrlImporter allowUrlPaste={false} label="Upload cover image" onExtracted={url => setForm(current => ({ ...current, coverImageUrl: url }))} />{form.coverImageUrl && <div className="mt-3 flex items-center gap-3"><img src={form.coverImageUrl} alt="Cover preview" className="h-20 w-28 rounded-lg object-cover" /><button type="button" onClick={() => setForm(current => ({ ...current, coverImageUrl: '' }))} className="text-sm font-bold text-red-600">Remove cover</button></div>}</div>{showImageLibrary && <div className="mt-4 grid max-h-72 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">{libraryImages.length ? libraryImages.map(url => <button key={url} type="button" onClick={() => { setForm(current => ({ ...current, coverImageUrl: url })); setShowImageLibrary(false); }} className="overflow-hidden rounded-lg border-2 border-transparent bg-white hover:border-emerald-500"><img src={url} alt="Choose as cover" className="aspect-[4/3] w-full object-cover" /></button>) : <p className="col-span-full text-sm font-semibold text-slate-500">No images are available in the Image Library yet.</p>}</div>}</div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">Trip carousel images</h3><p className="text-sm text-slate-500">Up to {MAX_IMAGES} images, shown only inside the article.</p></div><ImgBbUrlImporter multiple allowUrlPaste={false} label="Upload trip images" onExtracted={appendImages} /></div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{form.imageUrls.filter(Boolean).map((url, index) => <div key={url} className="relative overflow-hidden rounded-xl border border-slate-200"><img src={url} alt={`Trip image ${index + 1}`} className="aspect-[4/3] w-full object-cover" /><button type="button" onClick={() => setForm(current => ({ ...current, imageUrls: current.imageUrls.filter(image => image !== url) }))} className="absolute right-2 top-2 rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-red-600">Remove</button></div>)}</div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6"><label className="flex items-center gap-2 font-bold text-slate-700"><input type="checkbox" name="published" checked={form.published} onChange={setField} className="h-5 w-5" /> Published</label><div className="flex gap-3">{editingId && <button type="button" onClick={reset} className="rounded-xl px-5 py-3 font-bold text-slate-600">Cancel</button>}<button type="submit" disabled={saving} className="rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save Field Trip'}</button></div></div>
    </form>

    <section className="space-y-3"><h2 className="text-xl font-extrabold text-slate-900">{lockedSection ? `${lockedSection} Field Trips` : 'Field Trips'}</h2>{loading || sproutsLoading ? <p>Loading...</p> : listedTrips.map(trip => <article key={trip.id} className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"><div className="h-20 w-28 flex-none overflow-hidden rounded-lg bg-slate-100">{(trip.coverImageUrl || trip.imageUrls?.[0]) && <img src={trip.coverImageUrl || trip.imageUrls?.[0]} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0 flex-1"><p className="text-xs font-extrabold uppercase text-emerald-700">{trip.section}{trip.isLegacySproutsTrip ? ' · Sprouts activity' : ''}</p><h3 className="truncate font-extrabold text-slate-900">{trip.title}</h3><p className="text-sm text-slate-500">{trip.date || 'No date'} · {trip.published === false ? 'Draft' : 'Published'}</p></div><div className="flex gap-2"><button type="button" onClick={() => edit(trip)} className="rounded-lg px-3 py-2 font-bold text-emerald-700">{trip.isLegacySproutsTrip ? 'Import & Edit' : 'Edit'}</button><button type="button" onClick={() => trip.isLegacySproutsTrip ? removeLegacy(trip) : remove(trip)} className="rounded-lg px-3 py-2 font-bold text-red-600">Delete</button></div></article>)}</section>
  </div>;
}
