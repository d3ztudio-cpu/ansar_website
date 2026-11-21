import React, { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import { DEFAULT_ACADEMICS_PAGE, DEFAULT_ACADEMIC_SECTIONS, mergeListWithDefaults } from './contentDefaults';

export default function AdminAcademics() {
  const [formData, setFormData] = useState({
    feeStructurePdfUrl: '',
    prospectusYear: '2027 - 2028',
    prospectusDescription: 'Read the official prospectus for admissions, school information, programmes, facilities, and important guidance for the 2027 - 2028 academic year.',
    prospectusPdfUrl: '',
    academicSections: DEFAULT_ACADEMIC_SECTIONS,
    academicsPage: DEFAULT_ACADEMICS_PAGE
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'global'));
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      setFormData(prev => ({
        ...prev,
        feeStructurePdfUrl: data.feeStructurePdfUrl || prev.feeStructurePdfUrl,
        prospectusYear: data.prospectusYear || prev.prospectusYear,
        prospectusDescription: data.prospectusDescription || prev.prospectusDescription,
        prospectusPdfUrl: data.prospectusPdfUrl || prev.prospectusPdfUrl,
        academicSections: mergeListWithDefaults(data.academicSections, DEFAULT_ACADEMIC_SECTIONS),
        academicsPage: {
          ...DEFAULT_ACADEMICS_PAGE,
          ...(data.academicsPage || {}),
          beyondItems: mergeListWithDefaults(data.academicsPage?.beyondItems, DEFAULT_ACADEMICS_PAGE.beyondItems)
        }
      }));
    };
    fetchSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (listName, index, field, value) => {
    const next = [...formData[listName]];
    next[index] = { ...next[index], [field]: value };
    setFormData(prev => ({ ...prev, [listName]: next }));
  };

  const handleAcademicsPageChange = (field, value) => {
    setFormData(prev => ({ ...prev, academicsPage: { ...prev.academicsPage, [field]: value } }));
  };

  const handleBeyondChange = (index, field, value) => {
    setFormData(prev => {
      const beyondItems = [...prev.academicsPage.beyondItems];
      beyondItems[index] = { ...beyondItems[index], [field]: value };
      return { ...prev, academicsPage: { ...prev.academicsPage, beyondItems } };
    });
  };

  const normalizeItems = (items) => items.map(item => Object.fromEntries(
    Object.entries(item).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
  ));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await setDoc(doc(db, 'settings', 'global'), {
        feeStructurePdfUrl: formData.feeStructurePdfUrl,
        prospectusYear: formData.prospectusYear.trim(),
        prospectusDescription: formData.prospectusDescription.trim(),
        prospectusPdfUrl: formData.prospectusPdfUrl.trim(),
        academicSections: normalizeItems(formData.academicSections),
        academicsPage: {
          ...formData.academicsPage,
          beyondItems: normalizeItems(formData.academicsPage.beyondItems)
        },
        updatedAt: serverTimestamp()
      }, { merge: true });
      setMessage('Academics and admissions content updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-slate-800">Academics & Admissions Editor</h2>
        {message && <div className={`mb-6 rounded-lg p-4 text-sm font-bold ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-6">
            <h3 className="font-extrabold text-slate-900">Admission Documentation</h3>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Latest Fee Structure (Google Drive PDF URL)</label>
              <input name="feeStructurePdfUrl" type="url" value={formData.feeStructurePdfUrl} onChange={handleChange} placeholder="https://drive.google.com/file/d/..." className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
              <p className="mt-2 text-xs text-slate-500">Paste the shareable link to the PDF. The frontend will use this for the fee structure button.</p>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-6">
              <p className="mb-4 text-sm font-black uppercase tracking-widest text-emerald-700">Prospectus</p>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <label className="text-sm font-bold text-slate-700">Academic year
                  <input name="prospectusYear" value={formData.prospectusYear} onChange={handleChange} placeholder="2027 - 2028" className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal outline-none focus:ring-2 focus:ring-emerald-500" />
                </label>
                <label className="text-sm font-bold text-slate-700">Google Drive PDF URL
                  <input name="prospectusPdfUrl" type="url" value={formData.prospectusPdfUrl} onChange={handleChange} placeholder="https://drive.google.com/file/d/..." className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal outline-none focus:ring-2 focus:ring-emerald-500" />
                </label>
              </div>
              <label className="mt-4 block text-sm font-bold text-slate-700">Description
                <textarea name="prospectusDescription" value={formData.prospectusDescription} onChange={handleChange} className="mt-2 h-24 w-full rounded-lg border border-slate-200 p-3 font-normal outline-none focus:ring-2 focus:ring-emerald-500" />
              </label>
              <p className="mt-2 text-xs text-slate-500">Paste a Google Drive link with sharing set to “Anyone with the link”.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Academics Page</p>
              <h3 className="mt-1 font-extrabold text-slate-900">Page introduction and overview</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">Page eyebrow
                <input value={formData.academicsPage.eyebrow} onChange={(e) => handleAcademicsPageChange('eyebrow', e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal outline-none focus:ring-2 focus:ring-emerald-500" />
              </label>
              <label className="text-sm font-bold text-slate-700">Page title
                <input value={formData.academicsPage.title} onChange={(e) => handleAcademicsPageChange('title', e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal outline-none focus:ring-2 focus:ring-emerald-500" />
              </label>
            </div>
            <label className="block text-sm font-bold text-slate-700">Introduction
              <textarea value={formData.academicsPage.introduction} onChange={(e) => handleAcademicsPageChange('introduction', e.target.value)} className="mt-2 h-28 w-full rounded-lg border border-slate-200 p-3 font-normal outline-none focus:ring-2 focus:ring-emerald-500" />
            </label>
            <label className="block text-sm font-bold text-slate-700">Hero image URL
              <input value={formData.academicsPage.heroImageUrl} onChange={(e) => handleAcademicsPageChange('heroImageUrl', e.target.value)} placeholder="Leave empty to show an image placeholder" className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal outline-none focus:ring-2 focus:ring-emerald-500" />
            </label>
            <ImgBbUrlImporter onExtracted={(url) => handleAcademicsPageChange('heroImageUrl', url)} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">Overview title
                <input value={formData.academicsPage.overviewTitle} onChange={(e) => handleAcademicsPageChange('overviewTitle', e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 p-3 font-normal outline-none focus:ring-2 focus:ring-emerald-500" />
              </label>
              <label className="text-sm font-bold text-slate-700">Overview text
                <textarea value={formData.academicsPage.overviewBody} onChange={(e) => handleAcademicsPageChange('overviewBody', e.target.value)} className="mt-2 h-36 w-full rounded-lg border border-slate-200 p-3 font-normal outline-none focus:ring-2 focus:ring-emerald-500" />
              </label>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-6">
            <h3 className="font-extrabold text-slate-900">Beyond the Classroom</h3>
            <input value={formData.academicsPage.beyondTitle} onChange={(e) => handleAcademicsPageChange('beyondTitle', e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            <textarea value={formData.academicsPage.beyondIntroduction} onChange={(e) => handleAcademicsPageChange('beyondIntroduction', e.target.value)} className="h-24 w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            <div className="grid gap-4 lg:grid-cols-2">
              {formData.academicsPage.beyondItems.map((item, index) => (
                <div key={`beyond-${index}`} className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
                  <input value={item.title} onChange={(e) => handleBeyondChange(index, 'title', e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 font-bold outline-none focus:ring-2 focus:ring-emerald-500" />
                  <textarea value={item.description} onChange={(e) => handleBeyondChange(index, 'description', e.target.value)} className="h-28 w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Academics Page</p>
              <h3 className="mt-1 font-extrabold text-slate-900">Section descriptions and image holders</h3>
            </div>
            <input value={formData.academicsPage.sectionsTitle} onChange={(e) => handleAcademicsPageChange('sectionsTitle', e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 font-bold outline-none focus:ring-2 focus:ring-emerald-500" />
            <textarea value={formData.academicsPage.sectionsIntroduction} onChange={(e) => handleAcademicsPageChange('sectionsIntroduction', e.target.value)} className="h-28 w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            <div className="space-y-4">
              {formData.academicSections.map((section, index) => (
                <div key={`academic-section-${index}`} className="grid grid-cols-1 gap-4 rounded-xl border border-white bg-white p-4 shadow-sm lg:grid-cols-[1fr_1.3fr]">
                  <div className="space-y-3">
                    <div className="inline-flex rounded-lg bg-slate-100 px-3 py-2 text-sm font-black text-slate-600">#{index + 1}</div>
                    <input value={section.title || ''} onChange={(event) => handleListChange('academicSections', index, 'title', event.target.value)} placeholder="Section title" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input value={section.tagline || ''} onChange={(event) => handleListChange('academicSections', index, 'tagline', event.target.value)} placeholder="Section tagline" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input value={section.imageUrl || ''} onChange={(event) => handleListChange('academicSections', index, 'imageUrl', event.target.value)} placeholder="Image URL" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                    <ImgBbUrlImporter onExtracted={(url) => handleListChange('academicSections', index, 'imageUrl', url)} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Description</label>
                    <textarea value={section.description || ''} onChange={(event) => handleListChange('academicSections', index, 'description', event.target.value)} className="h-40 w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-emerald-600 px-6 py-3.5 text-lg font-bold text-white shadow-md transition-colors hover:bg-emerald-700 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Deploy Page Updates'}
          </button>
        </form>
      </div>
    </div>
  );
}
