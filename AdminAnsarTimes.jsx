import React, { useMemo, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { clearGoogleSheetsCache, useContentCollection } from './useContentCollection';
import { deleteSheetRecord, saveSheetRecord } from './googleSheetsAdminApi';
import {
  ANSAR_TIMES_MONTHS,
  ANSAR_TIMES_START_YEAR,
  clearAnsarTimesDeleted,
  getAnsarTimesId,
  getAnsarTimesPdfUrl,
  getAnsarTimesYears,
  isAnsarTimesDeleted,
  markAnsarTimesDeleted
} from './ansarTimesConfig';
import {
  SCHOOL_MAGAZINE_KINDS,
  clearSchoolMagazineDeleted,
  getSchoolMagazineDownloadUrl,
  getSchoolMagazineId,
  getSchoolMagazineUrl,
  getSchoolMagazineYearLabel,
  getSchoolMagazineYears,
  isSchoolMagazineDeleted,
  markSchoolMagazineDeleted
} from './schoolMagazinesConfig';

const createInitialFormState = () => ({
  year: ANSAR_TIMES_START_YEAR,
  month: ANSAR_TIMES_MONTHS[0].value,
  pdfUrl: '',
  published: true
});

const createInitialMagazineFormState = () => ({
  year: new Date().getFullYear(),
  title: '',
  kind: SCHOOL_MAGAZINE_KINDS[0],
  description: '',
  coverImageUrl: '',
  pdfUrl: '',
  order: 0,
  published: true
});

function getMonthIndex(month) {
  return ANSAR_TIMES_MONTHS.find(item => item.value === month)?.index || 0;
}

export default function AdminAnsarTimes() {
  const years = getAnsarTimesYears(2);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: entries, loading } = useContentCollection('ansarTimes', null, 'desc', { sheetsOnly: true, refreshKey });
  const [formData, setFormData] = useState(createInitialFormState);
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedEntries = useMemo(() => {
    const editions = new Map();
    entries.filter(item => !isAnsarTimesDeleted(item) && getAnsarTimesPdfUrl(item)).forEach(item => {
      editions.set(getAnsarTimesId(item.year, item.month), item);
    });

    return Array.from(editions.values()).sort((a, b) => {
      const yearDiff = Number(b.year || 0) - Number(a.year || 0);
      if (yearDiff) return yearDiff;
      return Number(a.monthIndex || getMonthIndex(a.month)) - Number(b.monthIndex || getMonthIndex(b.month));
    });
  }, [entries]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setEditingItem(null);
    setFormData(createInitialFormState());
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditingItem(item);
    setFormData({
      year: Number(item.year) || years[0],
      month: item.month || ANSAR_TIMES_MONTHS[0].value,
      pdfUrl: getAnsarTimesPdfUrl(item),
      published: item.published !== false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedYear = Number(formData.year);
      const selectedMonth = formData.month;
      const nextRecordId = getAnsarTimesId(selectedYear, selectedMonth);
      const payload = {
        id: nextRecordId,
        year: selectedYear,
        month: selectedMonth,
        monthIndex: getMonthIndex(selectedMonth),
        pdfUrl: formData.pdfUrl.trim(),
        published: !!formData.published
      };

      await saveSheetRecord('ansarTimes', payload);
      clearAnsarTimesDeleted(payload);

      // Mirror the edition into Firestore so the visitor notification bell
      // (which listens to Firestore) announces it as "Ansar Times".
      try {
        await setDoc(doc(db, 'ansarTimes', nextRecordId), {
          ...payload,
          ...(editingId ? {} : { createdAt: serverTimestamp() }),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (syncError) {
        console.warn('Unable to sync Ansar Times edition for notifications:', syncError);
      }
      if (editingId && editingId !== nextRecordId) {
        await deleteSheetRecord('ansarTimes', editingId, {
          year: editingItem?.year,
          month: editingItem?.month,
          monthIndex: editingItem?.monthIndex,
          pdfUrl: getAnsarTimesPdfUrl(editingItem)
        });
      }
      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
      resetForm();
    } catch (error) {
      alert('Save failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete Ansar Times - ${item.month} ${item.year}?`)) return;
    try {
      markAnsarTimesDeleted(item);
      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
      deleteDoc(doc(db, 'ansarTimes', item.id)).catch(() => {});
      await deleteSheetRecord('ansarTimes', item.id, {
        year: item.year,
        month: item.month,
        monthIndex: item.monthIndex,
        pdfUrl: getAnsarTimesPdfUrl(item)
      });
      if (editingId === item.id) resetForm();
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  const magazineYears = getSchoolMagazineYears(2);
  const { data: magazineEntries, loading: magazinesLoading } = useContentCollection('schoolMagazines', null, 'desc', { sheetsOnly: true, refreshKey });
  const [magazineFormData, setMagazineFormData] = useState(createInitialMagazineFormState);
  const [editingMagazineId, setEditingMagazineId] = useState(null);
  const [editingMagazineItem, setEditingMagazineItem] = useState(null);
  const [isSavingMagazine, setIsSavingMagazine] = useState(false);

  const sortedMagazines = useMemo(() => {
    const magazines = new Map();
    magazineEntries.filter(item => !isSchoolMagazineDeleted(item) && getSchoolMagazineUrl(item)).forEach(item => {
      magazines.set(item.id, item);
    });

    return Array.from(magazines.values()).sort((a, b) => {
      const yearDiff = Number(b.year || 0) - Number(a.year || 0);
      if (yearDiff) return yearDiff;
      return Number(a.order || 0) - Number(b.order || 0) || String(a.title || '').localeCompare(String(b.title || ''));
    });
  }, [magazineEntries]);

  const handleMagazineChange = (event) => {
    const { name, value, type, checked } = event.target;
    setMagazineFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetMagazineForm = () => {
    setEditingMagazineId(null);
    setEditingMagazineItem(null);
    setMagazineFormData(createInitialMagazineFormState());
  };

  const handleMagazineEdit = (item) => {
    setEditingMagazineId(item.id);
    setEditingMagazineItem(item);
    setMagazineFormData({
      year: Number(item.year) || magazineYears[0],
      title: item.title || '',
      kind: item.kind || SCHOOL_MAGAZINE_KINDS[0],
      description: item.description || '',
      coverImageUrl: item.coverImageUrl || '',
      pdfUrl: getSchoolMagazineUrl(item),
      order: item.order || 0,
      published: item.published !== false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMagazineSubmit = async (event) => {
    event.preventDefault();
    setIsSavingMagazine(true);

    try {
      const selectedYear = Number(magazineFormData.year);
      const title = String(magazineFormData.title || '').trim();
      const nextRecordId = getSchoolMagazineId(selectedYear, title);
      const payload = {
        id: nextRecordId,
        year: selectedYear,
        title,
        kind: magazineFormData.kind,
        description: String(magazineFormData.description || '').trim(),
        coverImageUrl: magazineFormData.coverImageUrl.trim(),
        pdfUrl: magazineFormData.pdfUrl.trim(),
        order: Number(magazineFormData.order) || 0,
        published: !!magazineFormData.published
      };

      await saveSheetRecord('schoolMagazines', payload);
      clearSchoolMagazineDeleted(payload);
      if (editingMagazineId && editingMagazineId !== nextRecordId) {
        await deleteSheetRecord('schoolMagazines', editingMagazineId, {
          year: editingMagazineItem?.year,
          title: editingMagazineItem?.title,
          pdfUrl: getSchoolMagazineUrl(editingMagazineItem)
        });
      }

      // Mirror the magazine into Firestore so the visitor notification bell
      // (which listens to Firestore) announces it as "Magazine" instead of
      // "News". Non-blocking: a Firestore hiccup never blocks the save.
      try {
        await setDoc(doc(db, 'schoolMagazines', nextRecordId), {
          ...payload,
          ...(editingMagazineId ? {} : { createdAt: serverTimestamp() }),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (syncError) {
        console.warn('Unable to sync magazine for notifications:', syncError);
      }

      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
      resetMagazineForm();
    } catch (error) {
      alert('Save failed: ' + error.message);
    } finally {
      setIsSavingMagazine(false);
    }
  };

  const handleMagazineDelete = async (item) => {
    if (!window.confirm(`Delete school magazine "${item.title || item.year}"? Visitors will no longer see it on the website.`)) return;
    try {
      markSchoolMagazineDeleted(item);
      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
      deleteDoc(doc(db, 'schoolMagazines', item.id)).catch(() => {});
      await deleteSheetRecord('schoolMagazines', item.id, {
        year: item.year,
        title: item.title,
        pdfUrl: getSchoolMagazineUrl(item)
      });
      if (editingMagazineId === item.id) resetMagazineForm();
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-slate-800">{editingId ? 'Edit Ansar Times PDF' : 'Add Ansar Times PDF'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Year *</label>
              <select name="year" value={formData.year} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500">
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Month *</label>
              <select name="month" value={formData.month} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500">
                {ANSAR_TIMES_MONTHS.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-700">Google Drive / PDF Link *</label>
              <input
                name="pdfUrl"
                type="url"
                value={formData.pdfUrl}
                onChange={handleChange}
                required
                placeholder="https://drive.google.com/file/d/..."
                className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700">
              <input name="published" type="checkbox" checked={formData.published} onChange={handleChange} className="h-5 w-5 rounded text-emerald-600" />
              Active on website
            </label>
            <div className="flex gap-3">
              {editingId && <button type="button" onClick={resetForm} className="rounded-lg px-5 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-100">Cancel</button>}
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-emerald-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : editingId ? 'Update PDF Link' : 'Save PDF Link'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="mb-4 text-lg font-bold text-slate-800">Current Ansar Times Links</h3>
        {loading ? <p className="text-slate-500">Loading Ansar Times links...</p> : sortedEntries.length ? sortedEntries.map(item => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-emerald-200">
            <div className="min-w-0">
              <h4 className="truncate font-bold text-slate-900">ANSAR TIMES - {item.month} <span className="text-slate-500">({item.year})</span></h4>
              <p className="truncate text-sm text-slate-500">{item.published !== false ? 'Active' : 'Inactive'} | {getAnsarTimesPdfUrl(item)}</p>
            </div>
            <div className="flex flex-none items-center gap-2">
              <a href={getAnsarTimesPdfUrl(item)} target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-1.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100">View</a>
              <button onClick={() => handleEdit(item)} className="rounded-lg px-3 py-1.5 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-50">Edit</button>
              <button onClick={() => handleDelete(item)} className="rounded-lg px-3 py-1.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50">Delete</button>
            </div>
          </div>
        )) : (
          <p className="rounded-xl border border-slate-100 bg-white p-8 text-center font-bold text-slate-500">No Ansar Times links added yet.</p>
        )}
      </div>

      <div className="mt-12 rounded-2xl border border-amber-100 bg-white p-8 shadow-xl">
        <div className="mb-1 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.306 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.694 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.694 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <h2 className="text-xl font-bold text-slate-800">{editingMagazineId ? 'Edit School Magazine' : 'Add School Magazine'}</h2>
        </div>
        <p className="mb-6 text-sm text-slate-500">Yearly school magazines shown in the "School Magazines" section of the Ansar Times page. Upload the PDF to the school's shared Google Drive folder and paste its link below.</p>
        <form onSubmit={handleMagazineSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Year *</label>
              <select name="year" value={magazineFormData.year} onChange={handleMagazineChange} required className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500">
                {magazineYears.map(year => <option key={year} value={year}>{getSchoolMagazineYearLabel(year)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Magazine Title *</label>
              <input
                name="title"
                type="text"
                value={magazineFormData.title}
                onChange={handleMagazineChange}
                required
                placeholder="e.g. Ansar Annual Magazine"
                className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Category</label>
              <select name="kind" value={magazineFormData.kind} onChange={handleMagazineChange} className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500">
                {SCHOOL_MAGAZINE_KINDS.map(kind => <option key={kind} value={kind}>{kind}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Display Order</label>
              <input
                name="order"
                type="number"
                value={magazineFormData.order}
                onChange={handleMagazineChange}
                className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-700">Google Drive / PDF Link *</label>
              <input
                name="pdfUrl"
                type="url"
                value={magazineFormData.pdfUrl}
                onChange={handleMagazineChange}
                required
                placeholder="https://drive.google.com/file/d/..."
                className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="mt-1 text-xs text-slate-400">Upload the magazine PDF to the school's shared Google Drive folder, set sharing to “Anyone with the link”, then paste the link here.</p>
              <p className="mt-1 text-xs font-semibold text-emerald-600">A direct download link is generated automatically for Drive files.</p>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-bold text-slate-700">Cover Image URL (optional)</label>
              <input
                name="coverImageUrl"
                type="url"
                value={magazineFormData.coverImageUrl}
                onChange={handleMagazineChange}
                placeholder="https://i.ibb.co/... (leave empty for a styled default cover)"
                className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="mt-4">
              <label className="text-sm font-bold text-slate-700">Short Description (optional)</label>
              <textarea
                name="description"
                value={magazineFormData.description}
                onChange={handleMagazineChange}
                rows={2}
                placeholder="A one-line note shown under the magazine title."
                className="mt-1 w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700">
              <input name="published" type="checkbox" checked={magazineFormData.published} onChange={handleMagazineChange} className="h-5 w-5 rounded text-emerald-600" />
              Active on website
            </label>
            <div className="flex gap-3">
              {editingMagazineId && <button type="button" onClick={resetMagazineForm} className="rounded-lg px-5 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-100">Cancel</button>}
              <button type="submit" disabled={isSavingMagazine} className="rounded-lg bg-emerald-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50">
                {isSavingMagazine ? 'Saving...' : editingMagazineId ? 'Update Magazine' : 'Save Magazine'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="mb-4 text-lg font-bold text-slate-800">Current School Magazines</h3>
        {magazinesLoading ? <p className="text-slate-500">Loading school magazines...</p> : sortedMagazines.length ? sortedMagazines.map(item => (
          <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border border-amber-100 bg-white p-4 shadow-sm transition-colors hover:border-amber-200">
            <div className="min-w-0">
              <h4 className="truncate font-bold text-slate-900">
                {item.title || `School Magazine ${item.year}`}
                <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">{getSchoolMagazineYearLabel(item.year)}{item.kind ? ` · ${item.kind}` : ''}</span>
              </h4>
              <p className="truncate text-sm text-slate-500">{item.published !== false ? 'Active' : 'Inactive'} | {getSchoolMagazineUrl(item)}</p>
            </div>
            <div className="flex flex-none items-center gap-2">
              <a href={getSchoolMagazineUrl(item)} target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-1.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100">View</a>
              <button onClick={() => handleMagazineEdit(item)} className="rounded-lg px-3 py-1.5 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-50">Edit</button>
              <button onClick={() => handleMagazineDelete(item)} className="rounded-lg px-3 py-1.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50">Delete</button>
            </div>
          </div>
        )) : (
          <p className="rounded-xl border border-slate-100 bg-white p-8 text-center font-bold text-slate-500">No school magazines added yet.</p>
        )}
      </div>
    </div>
  );
}
