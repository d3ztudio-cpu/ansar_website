import React, { useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { clearGoogleSheetsCache, useContentCollection } from './useContentCollection';
import { saveSheetRecord } from './googleSheetsAdminApi';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import ImageUrlThumb from './ImageUrlThumb';
import { softDeleteRecord } from './adminUndo';

const MAX_ACHIEVEMENT_IMAGES = 30;

// Achievements display in upload order (FIFO): the most recently uploaded
// achievement always appears first, regardless of its date field.
function getUploadTime(item) {
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
  return null;
}

function compareByUploadOrder(a, b) {
  const aTime = getUploadTime(a);
  const bTime = getUploadTime(b);
  if (aTime == null && bTime == null) return 0;
  if (aTime == null) return 1;
  if (bTime == null) return -1;
  return bTime - aTime;
}

export default function AdminAchievements() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: items, loading } = useContentCollection('achievements', null, 'asc', { refreshKey });
  const uploadOrderedItems = [...items].sort(compareByUploadOrder);
  
  const initialFormState = { title: '', description: '', imageUrls: [''], date: '', studentName: '', published: true };
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUrlChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.map((url, urlIndex) => urlIndex === index ? value : url)
    }));
  };

  const addImageUrlField = () => {
    setFormData(prev => {
      const currentImages = Array.isArray(prev.imageUrls) ? prev.imageUrls : [];
      if (currentImages.length >= MAX_ACHIEVEMENT_IMAGES) {
        alert(`You can add up to ${MAX_ACHIEVEMENT_IMAGES} images for one achievement.`);
        return prev;
      }
      return { ...prev, imageUrls: [...currentImages, ''] };
    });
  };

  const appendImageUrls = (urls) => {
    setFormData(prev => {
      const existing = Array.isArray(prev.imageUrls) ? prev.imageUrls.filter(url => url.trim() !== '') : [];
      const nextImages = [...existing, ...urls].slice(0, MAX_ACHIEVEMENT_IMAGES);
      if (existing.length + urls.length > MAX_ACHIEVEMENT_IMAGES) {
        alert(`Only the first ${MAX_ACHIEVEMENT_IMAGES} image links were added.`);
      }
      return { ...prev, imageUrls: nextImages.length ? nextImages : [''] };
    });
  };

  const removeImageUrlField = (index) => {
    setFormData(prev => {
      const nextImages = prev.imageUrls.filter((_, imageIndex) => imageIndex !== index);
      return { ...prev, imageUrls: nextImages.length ? nextImages : [''] };
    });
  };

  const moveImageUrl = (index, direction) => {
    setFormData(prev => {
      const images = Array.isArray(prev.imageUrls) ? [...prev.imageUrls] : [];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= images.length) return prev;
      [images[index], images[targetIndex]] = [images[targetIndex], images[index]];
      return { ...prev, imageUrls: images };
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditingItem(item);
    setFormData({ 
      title: item.title || '',
      description: item.description || '',
      imageUrls: Array.isArray(item.imageUrls) && item.imageUrls.length > 0 ? item.imageUrls : (item.imageUrl ? [item.imageUrl] : ['']),
      date: item.date || '',
      studentName: item.studentName || '',
      published: item.published !== false 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setEditingItem(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanedImageUrls = (Array.isArray(formData.imageUrls) ? formData.imageUrls : [])
        .map(url => url.trim())
        .filter(Boolean)
        .slice(0, MAX_ACHIEVEMENT_IMAGES);

      const payload = {
        title: formData.title || '',
        description: formData.description || '',
        imageUrl: cleanedImageUrls[0] || '',
        imageUrls: cleanedImageUrls,
        date: formData.date || '',
        studentName: formData.studentName || '',
        published: !!formData.published
      };

      let recordId = editingId;
      let firestoreError = null;
      let sheetsError = null;

      try {
        if (editingId && (!editingItem?._contentSource || editingItem._contentSource === 'firestore' || editingItem._contentSource === 'merged')) {
          await updateDoc(doc(db, 'achievements', editingId), {
            ...payload,
            updatedAt: serverTimestamp()
          });
        } else if (!editingId) {
          const docRef = await addDoc(collection(db, 'achievements'), {
            ...payload,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          recordId = docRef.id;
        }
      } catch (error) {
        firestoreError = error;
      }

      try {
        await saveSheetRecord('achievements', { ...payload, id: recordId || undefined });
      } catch (error) {
        sheetsError = error;
      }

      if (firestoreError && sheetsError) {
        throw new Error(`Firestore: ${firestoreError.message}. Sheets: ${sheetsError.message}`);
      }

      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
      resetForm();
      if (firestoreError || sheetsError) {
        alert(`Saved with warning: ${firestoreError ? 'Firestore failed. ' : ''}${sheetsError ? 'Google Sheets failed.' : ''}`);
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Save failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
      if (!window.confirm("Are you sure you want to delete this achievement?")) return;
    try {
      await softDeleteRecord('achievements', item);
      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 mb-8">
        <h2 className="text-xl font-bold mb-6 text-slate-800">{editingId ? 'Edit Achievement' : 'Add New Achievement'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Achievement Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Student / Team Name</label>
              <input name="studentName" value={formData.studentName} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="block text-sm font-bold text-slate-700">Achievement Image URLs</label>
                <ImgBbUrlImporter
                  multiple
                  label="Extract Multiple ImgBB URLs"
                  onExtracted={appendImageUrls}
                />
              </div>
              <div className="space-y-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="text-xs font-bold text-slate-500">The first image is used as the cover thumbnail. Use <span className="text-emerald-700">&uarr;</span> / <span className="text-emerald-700">&darr;</span> to swap images and set the priority one.</p>
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg text-xs font-black ${index === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`} title={index === 0 ? 'Cover image' : `Image ${index + 1}`}>{index + 1}</span>
                      <ImageUrlThumb url={url} alt={`Achievement image ${index + 1}`} />
                      <input type="url" value={url} onChange={(event) => handleImageUrlChange(index, event.target.value)} placeholder="https://example.com/achievement.jpg" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                      <button type="button" onClick={() => moveImageUrl(index, -1)} disabled={index === 0} aria-label="Move image up" className="rounded-lg border border-slate-200 px-2.5 py-2 font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">&uarr;</button>
                      <button type="button" onClick={() => moveImageUrl(index, 1)} disabled={index === formData.imageUrls.length - 1} aria-label="Move image down" className="rounded-lg border border-slate-200 px-2.5 py-2 font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">&darr;</button>
                      <button type="button" onClick={() => removeImageUrlField(index)} disabled={formData.imageUrls.length <= 1} className="rounded-lg px-3 py-2 font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40">Remove</button>
                    </div>
                    {url && (
                      <div className="relative h-28 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <img src={url} alt={`Achievement preview ${index + 1}`} className="absolute inset-0 h-full w-full object-contain" />
                      </div>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addImageUrlField} className="rounded-lg px-4 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50">+ Add another image</button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input name="published" type="checkbox" checked={formData.published} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded" />
              Published (Visible on website)
            </label>
            <div className="flex gap-3">
              {editingId && <button type="button" onClick={resetForm} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>}
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Achievement' : 'Save Achievement')}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Current Achievements</h3>
        {loading ? <p className="text-slate-500">Loading achievements...</p> : uploadOrderedItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors">
            <div>
              <h4 className="font-bold text-slate-900">{item.title}</h4>
              <p className="text-sm text-slate-500">{item.date || 'No date'} | {item.published ? 'Published' : 'Draft'}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(item)} className="px-3 py-1.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">Edit</button>
              <button onClick={() => handleDelete(item)} className="px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
