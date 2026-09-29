import React, { useState } from 'react';
import { addDoc, collection, deleteField, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { clearGoogleSheetsCache, useContentCollection } from './useContentCollection';
import { saveSheetRecord } from './googleSheetsAdminApi';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import ImageUrlThumb from './ImageUrlThumb';
import { softDeleteRecord } from './adminUndo';
import { normalizeImageUrl } from './imageUrlUtils';

const MAX_ARTICLE_IMAGES = 100;

function getDateTime(item) {
  const dateTime = Date.parse(item.date);
  if (!Number.isNaN(dateTime)) return dateTime;
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
  return Number.MIN_SAFE_INTEGER;
}

export default function AdminUpdates({ fixedCategory = '' }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: items, loading } = useContentCollection('updates', null, 'asc', { refreshKey });
  const dateOrderedItems = items.filter((item) => !fixedCategory || item.category === fixedCategory).sort((a, b) => getDateTime(b) - getDateTime(a));
  
  const initialFormState = { category: fixedCategory || 'News', title: '', description: '', date: '', coverImageUrl: '', eventImages: [''], instagramUrl: '', facebookUrl: '', youtubeUrl: '', published: true };
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEventImageChange = (index, value) => {
    const newEventImages = [...formData.eventImages];
    newEventImages[index] = value;
    setFormData(prev => ({ ...prev, eventImages: newEventImages }));
  };

  const addEventImageField = () => setFormData(prev => {
    const currentImages = Array.isArray(prev.eventImages) ? prev.eventImages : [];
    if (currentImages.length >= MAX_ARTICLE_IMAGES) {
      alert(`You can add up to ${MAX_ARTICLE_IMAGES} images for one article.`);
      return prev;
    }
    return { ...prev, eventImages: [...currentImages, ''] };
  });
  const appendEventImages = (urls) => {
    setFormData(prev => {
      const existing = Array.isArray(prev.eventImages) ? prev.eventImages.filter(url => url.trim() !== '') : [];
      const nextImages = [...existing, ...urls].slice(0, MAX_ARTICLE_IMAGES);
      if (existing.length + urls.length > MAX_ARTICLE_IMAGES) {
        alert(`Only the first ${MAX_ARTICLE_IMAGES} image links were added.`);
      }
      return { ...prev, eventImages: nextImages };
    });
  };

  const removeEventImageField = (index) => {
    if (formData.eventImages.length <= 1) return;
    setFormData(prev => ({ ...prev, eventImages: prev.eventImages.filter((_, i) => i !== index) }));
  };

  const moveEventImage = (index, direction) => {
    setFormData(prev => {
      const images = [...(Array.isArray(prev.eventImages) ? prev.eventImages : [])];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= images.length) return prev;
      [images[index], images[targetIndex]] = [images[targetIndex], images[index]];
      return { ...prev, eventImages: images };
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditingItem(item);
    setFormData({ 
      category: item.category || 'News',
      title: item.title || '', 
      description: item.description || '', 
      date: item.date || '',
      coverImageUrl: item.coverImageUrl || item.imageUrl || '',
      eventImages: Array.isArray(item.eventImages) && item.eventImages.length > 0 ? item.eventImages : (Array.isArray(item.imageUrls) && item.imageUrls.length > 0 ? item.imageUrls : ['']),
      instagramUrl: item.instagramUrl || '',
      facebookUrl: item.facebookUrl || '',
      youtubeUrl: item.youtubeUrl || '',
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
    if (isSubmitting) return; // Prevent double-clicks triggering infinite loops
    setIsSubmitting(true);

    try {
      const cleanedCoverImageUrl = normalizeImageUrl(formData.coverImageUrl);
      const cleanedEventImages = [...new Set(
        (Array.isArray(formData.eventImages) ? formData.eventImages : [])
          .map(url => normalizeImageUrl(url))
          .filter(url => url !== '')
      )];

      if (cleanedEventImages.length > MAX_ARTICLE_IMAGES) {
        alert(`Save failed: one article can have up to ${MAX_ARTICLE_IMAGES} image links.`);
        return;
      }

      const category = fixedCategory || formData.category || 'News';
      const isEvent = category === 'Events';

      const payload = {
        category,
        title: formData.title || '',
        description: formData.description || '',
        date: formData.date || '',
        coverImageUrl: cleanedCoverImageUrl || cleanedEventImages[0] || '',
        imageUrls: isEvent ? [] : cleanedEventImages,
        eventImages: isEvent ? cleanedEventImages : [],
        instagramUrl: formData.instagramUrl || '',
        facebookUrl: formData.facebookUrl || '',
        youtubeUrl: formData.youtubeUrl || '',
        published: !!formData.published
      };
      const firestorePayload = {
        category: payload.category,
        title: payload.title,
        description: payload.description,
        date: payload.date,
        coverImageUrl: cleanedCoverImageUrl || cleanedEventImages[0] || '',
        imageUrl: cleanedCoverImageUrl || cleanedEventImages[0] || '',
        instagramUrl: payload.instagramUrl,
        facebookUrl: payload.facebookUrl,
        youtubeUrl: payload.youtubeUrl,
        published: payload.published
      };

      let recordId = editingId;
      let firestoreError = null;
      let sheetsError = null;

      try {
        if (editingId && (!editingItem?._contentSource || editingItem._contentSource === 'firestore' || editingItem._contentSource === 'merged')) {
          await updateDoc(doc(db, 'updates', editingId), {
            ...firestorePayload,
            imageUrls: isEvent ? deleteField() : cleanedEventImages,
            eventImages: isEvent ? cleanedEventImages : deleteField(),
            updatedAt: serverTimestamp()
          });
        } else if (!editingId) {
          const docRef = await addDoc(collection(db, 'updates'), {
            ...firestorePayload,
            ...(isEvent ? { eventImages: cleanedEventImages } : { imageUrls: cleanedEventImages }),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          recordId = docRef.id;
        }
      } catch (error) {
        firestoreError = error;
      }

      try {
        await saveSheetRecord('updates', { ...payload, id: recordId || undefined });
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
    if (!window.confirm("Are you sure you want to delete this publication?")) return;
    try {
      await softDeleteRecord('updates', item);
      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Premium Admin Form styling */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 mb-8">
        <h2 className="text-xl font-bold mb-6 text-slate-800">{editingId ? `Edit ${fixedCategory || 'Publication'}` : `Add ${fixedCategory || 'News / Event'}`}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {!fixedCategory && <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Category (News or Event) *</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="News">News</option>
                <option value="Events">Events</option>
              </select>
            </div>}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Description / Content</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24" />
            </div>
            
            <div className="md:col-span-2 space-y-3 p-5 bg-emerald-50/50 border border-emerald-100 rounded-xl">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Cover Image URL (Primary Thumbnail)</label>
                <div className="space-y-2">
                  <input name="coverImageUrl" type="url" value={formData.coverImageUrl} onChange={handleChange} placeholder="https://example.com/cover.jpg" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                  <ImgBbUrlImporter
                    onExtracted={(url) => setFormData(prev => ({ ...prev, coverImageUrl: url }))}
                  />
                </div>
              <div className="mt-3 w-full h-40 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden relative flex items-center justify-center">
                {!formData.coverImageUrl ? (
                  <div className="flex flex-col items-center text-slate-400">
                    <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="text-xs font-bold uppercase tracking-wider">No Image Provided</span>
                  </div>
                ) : (
                  <>
                    <img src={formData.coverImageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-10" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
                    <div className="absolute inset-0 hidden flex-col items-center justify-center text-slate-500 bg-slate-100 z-0">
                      <svg className="w-8 h-8 mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Invalid Link Format</span>
                    </div>
                  </>
                )}
              </div>
              </div>

              {(fixedCategory || formData.category) && (
                <div>
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="block text-sm font-bold text-slate-700">
                      {formData.category === 'Events' ? 'Event Image URLs (Carousel)' : 'Article Image URLs (Carousel)'}
                    </label>
                    <ImgBbUrlImporter
                      multiple
                      label="Extract Multiple ImgBB URLs"
                      onExtracted={appendEventImages}
                    />
                  </div>
                  <p className="mb-2 text-xs font-bold text-slate-500">The first image becomes the thumbnail if no cover image is set. Use <span className="text-emerald-700">&uarr;</span> / <span className="text-emerald-700">&darr;</span> to swap images and set the priority one.</p>
                  {Array.isArray(formData.eventImages) && formData.eventImages.map((url, index) => (
                    <div key={index} className="flex flex-col gap-2 mb-4 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg text-xs font-black ${index === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`} title={index === 0 ? 'Priority image' : `Image ${index + 1}`}>{index + 1}</span>
                        <ImageUrlThumb url={url} alt={`Article image ${index + 1}`} />
                        <input type="url" value={url} onChange={(e) => handleEventImageChange(index, e.target.value)} placeholder="https://example.com/image.jpg" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                        <button type="button" onClick={() => moveEventImage(index, -1)} disabled={index === 0} aria-label="Move image up" className="rounded-lg border border-slate-200 px-2.5 py-2 font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">&uarr;</button>
                        <button type="button" onClick={() => moveEventImage(index, 1)} disabled={index === formData.eventImages.length - 1} aria-label="Move image down" className="rounded-lg border border-slate-200 px-2.5 py-2 font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">&darr;</button>
                        <button type="button" onClick={() => removeEventImageField(index)} disabled={formData.eventImages.length <= 1} className="p-2 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50">✕</button>
                      </div>
                    <div className="w-full h-32 bg-slate-50 border border-slate-200 rounded-md overflow-hidden relative flex items-center justify-center">
                      {!url ? (
                        <span className="text-xs font-bold uppercase text-slate-400">Blank Slot</span>
                      ) : (
                        <>
                          <img src={url} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-10" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
                          <div className="absolute inset-0 hidden flex-col items-center justify-center text-slate-500 bg-slate-100 z-0">
                            <span className="text-xs font-bold uppercase text-slate-500">Invalid Link</span>
                          </div>
                        </>
                      )}
                    </div>
                    </div>
                  ))}
                  <button type="button" onClick={addEventImageField} className="text-sm font-bold text-emerald-600 hover:bg-emerald-50 py-2 px-4 rounded-lg transition-colors border border-emerald-100">+ Add Another Image</button>
                  <p className="mt-2 text-xs text-slate-500">Add up to {MAX_ARTICLE_IMAGES} images. The cover image remains the thumbnail; all images appear in the article carousel.</p>
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-4 p-5 bg-slate-50 border border-slate-100 rounded-xl">
              <h3 className="font-extrabold text-slate-900 mb-2">Optional Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Instagram Post Link</label>
                  <input name="instagramUrl" type="url" value={formData.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Facebook Post Link</label>
                  <input name="facebookUrl" type="url" value={formData.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">YouTube Video Link</label>
                  <input name="youtubeUrl" type="url" value={formData.youtubeUrl} onChange={handleChange} placeholder="https://youtube.com/..." className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
            </div>

          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input name="published" type="checkbox" checked={formData.published} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded" />
              Published
            </label>
            <div className="flex gap-3">
              {editingId && <button type="button" onClick={resetForm} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>}
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Post' : 'Publish')}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Current Publications</h3>
        {loading ? <p className="text-slate-500">Loading...</p> : dateOrderedItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-emerald-300 hover:shadow-md transition-all duration-300">
            
            {/* Defensive Thumbnail Rendering */}
            <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
              {(item.coverImageUrl || item.imageUrl || item.imageUrls?.[0] || item.eventImages?.[0]) ? (
                <img 
                  src={item.coverImageUrl || item.imageUrl || item.imageUrls?.[0] || item.eventImages?.[0]}
                  alt="Thumbnail" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' font-weight='bold' fill='%2394a3b8'%3EError%3C/text%3E%3C/svg%3E"; }} 
                />
              ) : (
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              )}
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${item.category === 'News' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{item.category}</span>
                <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
              </div>
              <p className="text-sm text-slate-500 mt-1">{item.date} | {item.published ? 'Published' : 'Draft'}</p>
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
