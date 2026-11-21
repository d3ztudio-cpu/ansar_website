import React, { useEffect, useState } from 'react';
import { clearGoogleSheetsCache, useContentCollection } from './useContentCollection';
import { deleteSheetRecord, saveSheetRecord } from './googleSheetsAdminApi';
import { SOP_DOCUMENTS } from './SopPage';

const blank = { id: '', title: '', category: 'Academic', file: '', driveUrl: '', size: '', order: 0, published: true, featured: false };

export default function AdminSop() {
  const [form, setForm] = useState(blank);
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState('');
  const [importing, setImporting] = useState(false);
  const { data: savedDocuments } = useContentCollection('sops', 'order', 'asc', { sheetsOnly: true, refreshKey: refresh });
  const documents = savedDocuments.length ? savedDocuments : SOP_DOCUMENTS.map((item, index) => ({ ...item, id: `sop-${item.file.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}`, order: index, published: true, featured: item.featured === true, _catalogueFallback: true }));
  useEffect(() => {
    if (savedDocuments.length || sessionStorage.getItem('ansar-sops-seeded')) return;
    sessionStorage.setItem('ansar-sops-seeded', 'pending');
    Promise.all(SOP_DOCUMENTS.map((item, index) => saveSheetRecord('sops', {
      ...item,
      id: `sop-${item.file.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}`,
      order: index,
      published: true,
      featured: item.featured === true
    }))).then(() => {
      sessionStorage.setItem('ansar-sops-seeded', 'done');
      clearGoogleSheetsCache();
      setRefresh(value => value + 1);
      setMessage('Existing public SOPs were added to the admin library.');
    }).catch(error => {
      sessionStorage.removeItem('ansar-sops-seeded');
      setMessage(`Could not import the existing SOPs: ${error.message}`);
    });
  }, [savedDocuments.length]);

  const save = async (event) => {
    event.preventDefault();
    const record = {
      ...form,
      id: form.id || `sop-${Date.now()}`,
      title: form.title.trim(), category: form.category.trim(), file: form.file.trim(),
      driveUrl: form.driveUrl.trim(), size: form.size.trim(), order: Number(form.order) || documents.length + 1
    };
    if (!record.title || (!record.file && !record.driveUrl)) return setMessage('Enter a title and either a public file path or Google Drive link.');
    try {
      await saveSheetRecord('sops', record);
      clearGoogleSheetsCache(); setRefresh(value => value + 1); setForm(blank); setMessage('SOP saved successfully.');
    } catch (error) { setMessage(`Save failed: ${error.message}`); }
  };

  const importAll = async () => {
    if (!window.confirm(`Import all ${SOP_DOCUMENTS.length} public SOPs into the admin library? Existing records will be updated by ID.`)) return;
    setImporting(true);
    try {
      await Promise.all(SOP_DOCUMENTS.map((item, index) => saveSheetRecord('sops', {
        ...item,
        id: `sop-${item.file.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}`,
        order: index,
        published: true,
        featured: item.featured === true
      })));
      clearGoogleSheetsCache();
      setRefresh(value => value + 1);
      setMessage('All public SOPs were imported. Add Drive links by editing each record.');
    } catch (error) {
      setMessage(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    try { await deleteSheetRecord('sops', item.id, item); clearGoogleSheetsCache(); setRefresh(value => value + 1); setMessage('SOP deleted.'); }
    catch (error) { setMessage(`Delete failed: ${error.message}`); }
  };

  return <div className="grid gap-6 xl:grid-cols-[1fr_28rem]">
    <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b p-5"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-600">Document library</p><h2 className="mt-2 text-2xl font-extrabold">Saved SOPs</h2><p className="mt-1 text-sm text-slate-500">Manage the procedures displayed on the public SOP page.</p></div><button type="button" onClick={importAll} disabled={importing} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50">{importing ? 'Importing...' : 'Import all public SOPs'}</button></div>
      {message && <p className="m-5 rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</p>}
      <div className="divide-y">{documents.length ? documents.map(item => <div key={item.id} className="flex items-center justify-between gap-4 p-5"><div className="min-w-0"><h3 className="font-extrabold text-slate-900">{item.title}</h3><p className="mt-1 text-sm text-slate-500">{item.category} {item.size ? `· ${item.size}` : ''} {item.published === false ? '· Hidden' : ''}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => setForm({ ...blank, ...item })} className="rounded-lg px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50">Edit</button><button type="button" onClick={() => remove(item)} className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Delete</button></div></div>) : <p className="p-8 text-center text-sm font-bold text-slate-500">No saved SOPs yet.</p>}</div>
    </section>
    <form onSubmit={save} className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">{form.id ? 'Edit SOP' : 'Add SOP'}</h2>{form.id && <button type="button" onClick={() => setForm(blank)} className="text-sm font-bold text-slate-500">Cancel</button>}</div>
      <label className="mt-4 block text-sm font-bold">Title<input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
      <label className="mt-4 block text-sm font-bold">Category<input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
      <label className="mt-4 block text-sm font-bold">Public file path<input value={form.file} onChange={e => setForm({ ...form, file: e.target.value })} placeholder="admission-sop.pdf" className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
      <label className="mt-4 block text-sm font-bold">Google Drive link<input type="url" value={form.driveUrl} onChange={e => setForm({ ...form, driveUrl: e.target.value })} placeholder="https://drive.google.com/..." className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
      <div className="mt-4 grid grid-cols-2 gap-3"><label className="text-sm font-bold">File size<input value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="502 KB" className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label><label className="text-sm font-bold">Order<input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label></div>
      <label className="mt-4 flex gap-2 text-sm font-bold"><input type="checkbox" checked={form.published !== false} onChange={e => setForm({ ...form, published: e.target.checked })} />Show on public SOP page</label>
      <label className="mt-3 flex gap-2 text-sm font-bold"><input type="checkbox" checked={form.featured === true} onChange={e => setForm({ ...form, featured: e.target.checked })} />Feature as the complete document</label>
      <button className="mt-6 w-full rounded-xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white">{form.id ? 'Update SOP' : 'Save SOP'}</button>
    </form>
  </div>;
}
