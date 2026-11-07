import React, { useState } from 'react';
import { collection, deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase-init';
import { useFirestoreCollection } from './useFirestoreCollection';

const EMPTY = { name: '', sections: '', role: '', qualification: '', focus: '', imageUrl: '', order: 0 };
const input = 'w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

export default function AdminCounseling() {
  const { data: members, loading } = useFirestoreCollection('counselingTeam', 'order', 'asc');
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const change = (event) => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const reset = () => { setForm(EMPTY); setEditingId(null); };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please choose an image file.');
    setUploading(true);
    try {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
      const imageRef = ref(storage, `counseling-team/${editingId || 'new'}/${Date.now()}-${safeName}`);
      await uploadBytes(imageRef, file, { contentType: file.type });
      const imageUrl = await getDownloadURL(imageRef);
      setForm(current => ({ ...current, imageUrl }));
    } catch (error) { alert(`Image upload failed: ${error.message}`); }
    finally { setUploading(false); }
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const id = editingId || crypto.randomUUID();
      const payload = { ...form, order: Number(form.order) || 0, updatedAt: serverTimestamp() };
      if (editingId) await updateDoc(doc(db, 'counselingTeam', id), payload);
      else await setDoc(doc(db, 'counselingTeam', id), { ...payload, createdAt: serverTimestamp() });
      reset();
    } catch (error) { alert(`Save failed: ${error.message}`); }
    finally { setSaving(false); }
  };

  const edit = (member) => { setEditingId(member.id); setForm({ ...EMPTY, ...member }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const remove = async (member) => {
    if (!window.confirm(`Remove ${member.name} from the counseling team?`)) return;
    await deleteDoc(doc(db, 'counselingTeam', member.id));
  };

  return <div className="mx-auto max-w-6xl space-y-8">
    <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl sm:p-8">
      <h2 className="text-2xl font-black text-slate-900">Counseling Team Members</h2>
      <p className="mt-2 text-sm text-slate-500">Add team cards, upload profile images, and manage the information shown on the public counseling page.</p>
      <form onSubmit={save} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-bold">Name *<input required name="name" value={form.name} onChange={change} className={input} /></label>
        <label className="text-sm font-bold">Role *<input required name="role" value={form.role} onChange={change} className={input} placeholder="Counselor / Special Educator" /></label>
        <label className="text-sm font-bold md:col-span-2">Assigned section(s) *<input required name="sections" value={form.sections} onChange={change} className={input} placeholder="Lower Primary, Grades 1-2" /></label>
        <label className="text-sm font-bold">Qualification<input name="qualification" value={form.qualification} onChange={change} className={input} /></label>
        <label className="text-sm font-bold">WhatsApp number<input name="phone" value={form.phone || ''} onChange={change} className={input} placeholder="919XXXXXXXXX" /></label>
        <label className="text-sm font-bold">Display order<input name="order" type="number" value={form.order} onChange={change} className={input} /></label>
        <label className="text-sm font-bold md:col-span-2">Focus / short bio<textarea name="focus" value={form.focus} onChange={change} className={`${input} min-h-24`} /></label>
        <div className="md:col-span-2">
          <label className="text-sm font-bold">Profile image<input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} className="mt-1 block w-full rounded-xl border border-dashed border-slate-300 p-3 text-sm" /></label>
          {uploading && <p className="mt-2 text-sm text-emerald-600">Uploading image...</p>}
          {form.imageUrl && <img src={form.imageUrl} alt="Selected profile" className="mt-3 h-28 w-28 rounded-2xl object-cover" />}
        </div>
        <div className="flex gap-3 md:col-span-2">
          {editingId && <button type="button" onClick={reset} className="rounded-xl px-5 py-3 font-bold text-slate-600 hover:bg-slate-100">Cancel</button>}
          <button disabled={saving || uploading} className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50">{saving ? 'Saving...' : editingId ? 'Update Member' : 'Add Team Member'}</button>
        </div>
      </form>
    </section>
    <section className="space-y-3">
      <h3 className="text-xl font-black text-slate-900">Current team cards</h3>
      {loading ? <p className="text-slate-500">Loading team members...</p> : members.map(member => <article key={member.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-4">{member.imageUrl ? <img src={member.imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100 font-black text-emerald-700">{member.name?.slice(0, 2).toUpperCase()}</div>}<div><h4 className="font-black">{member.name}</h4><p className="text-sm text-slate-500">{member.role} · {member.sections}</p></div></div><div className="flex gap-2"><button onClick={() => edit(member)} className="rounded-lg px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50">Edit</button><button onClick={() => remove(member)} className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Remove</button></div></article>)}
    </section>
  </div>;
}
