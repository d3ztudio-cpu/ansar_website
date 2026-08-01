import React, { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { useFirestoreCollection } from './useFirestoreCollection';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import { softDeleteRecord } from './adminUndo';
import { normalizeImageUrl } from './imageUrlUtils';
import { Link } from 'react-router-dom';

const DEFAULT_SETTINGS = {
  title: 'Ansar English School Library',
  subtitle: 'A home for readers, researchers, storytellers, and lifelong learners.',
  intro: 'The school library brings together books, ideas, conversation, and discovery. Students are encouraged to read widely, explore thoughtfully, and share what inspires them.',
  heroImageUrl: '',
  resourceUrl: 'https://sites.google.com/view/ansar-english-school-library/home',
  resourceLabel: 'Explore the library collection',
  openingHours: 'Open during school hours',
  contactEmail: '',
  published: true
};

const EMPTY_POST = { type: 'Announcement', title: '', summary: '', body: '', date: '', imageUrl: '', linkUrl: '', published: true };
const POST_TYPES = ['Announcement', 'Event', 'Activity', 'New Arrival', 'Resource', 'Publication'];

function displayDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'No date' : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function AdminLibrary() {
  const { data: settingsItems, loading: settingsLoading } = useFirestoreCollection('librarySettings', 'title', 'asc');
  const { data: posts, loading: postsLoading } = useFirestoreCollection('libraryPosts', 'date', 'desc');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [post, setPost] = useState(EMPTY_POST);
  const [editingId, setEditingId] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const existingSettings = useMemo(() => settingsItems.find(item => item.id === 'main') || null, [settingsItems]);

  useEffect(() => {
    if (existingSettings) setSettings({ ...DEFAULT_SETTINGS, ...existingSettings });
  }, [existingSettings]);

  const saveSettings = async (event) => {
    event.preventDefault();
    setSavingSettings(true);
    try {
      await setDoc(doc(db, 'librarySettings', 'main'), {
        title: settings.title.trim(),
        subtitle: settings.subtitle.trim(),
        intro: settings.intro.trim(),
        heroImageUrl: normalizeImageUrl(settings.heroImageUrl),
        resourceUrl: settings.resourceUrl.trim(),
        resourceLabel: settings.resourceLabel.trim(),
        openingHours: settings.openingHours.trim(),
        contactEmail: settings.contactEmail.trim(),
        published: !!settings.published,
        createdAt: existingSettings?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      alert('Library profile saved.');
    } catch (error) {
      console.error(error);
      alert(`Could not save the library profile: ${error.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const savePost = async (event) => {
    event.preventDefault();
    setSavingPost(true);
    try {
      const payload = {
        type: post.type,
        title: post.title.trim(),
        summary: post.summary.trim(),
        body: post.body.trim(),
        date: post.date,
        imageUrl: normalizeImageUrl(post.imageUrl),
        linkUrl: post.linkUrl.trim(),
        published: !!post.published,
        updatedAt: serverTimestamp()
      };
      if (editingId) {
        await updateDoc(doc(db, 'libraryPosts', editingId), payload);
      } else {
        await addDoc(collection(db, 'libraryPosts'), { ...payload, createdAt: serverTimestamp() });
      }
      setPost(EMPTY_POST);
      setEditingId(null);
      alert(editingId ? 'Library post updated.' : 'Library post published.');
    } catch (error) {
      console.error(error);
      alert(`Could not save the library post: ${error.message}`);
    } finally {
      setSavingPost(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setPost({ type: item.type || 'Announcement', title: item.title || '', summary: item.summary || '', body: item.body || '', date: item.date || '', imageUrl: item.imageUrl || '', linkUrl: item.linkUrl || '', published: item.published !== false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removePost = async (item) => {
    if (!window.confirm(`Delete “${item.title}”? You can restore it from the Undo Centre for 15 minutes.`)) return;
    try {
      await softDeleteRecord('libraryPosts', item);
    } catch (error) {
      alert(`Could not delete this post: ${error.message}`);
    }
  };

  const fieldClass = 'mt-1 w-full rounded-lg border border-slate-200 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-700 to-cyan-600 p-6 text-white shadow-lg sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">New interactive module</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-5"><div><h2 className="text-2xl font-extrabold">Library Quiz Corner</h2><p className="mt-2 max-w-2xl text-indigo-100">Create quizzes from Google files, run live sessions, monitor violations, unlock students, and export ranked results.</p></div><Link to="/admin/library/quiz" className="rounded-xl bg-white px-5 py-3 font-black text-indigo-700">Open quiz control room →</Link></div>
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Library content manager</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Manage the Library page</h2>
        <p className="mt-2 max-w-3xl leading-7 text-slate-600">Update the library introduction and publish announcements, events, activities, new arrivals, resources, and publications. Published entries appear immediately on the public Library page.</p>
      </div>

      <form onSubmit={saveSettings} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-4"><div><h3 className="text-xl font-extrabold text-slate-900">Library profile</h3><p className="mt-1 text-sm text-slate-500">The public page heading, introduction, and quick links.</p></div>{settingsLoading && <span className="text-sm font-bold text-slate-400">Loading…</span>}</div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">Page title<input required value={settings.title} onChange={(e) => setSettings(value => ({ ...value, title: e.target.value }))} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700">Subtitle<input required value={settings.subtitle} onChange={(e) => setSettings(value => ({ ...value, subtitle: e.target.value }))} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Introduction<textarea required value={settings.intro} onChange={(e) => setSettings(value => ({ ...value, intro: e.target.value }))} className={`${fieldClass} h-28`} /></label>
          <div className="md:col-span-2"><label className="text-sm font-bold text-slate-700">Hero image URL (optional)<input type="url" value={settings.heroImageUrl} onChange={(e) => setSettings(value => ({ ...value, heroImageUrl: e.target.value }))} className={fieldClass} /></label><div className="mt-2"><ImgBbUrlImporter onExtracted={(url) => setSettings(value => ({ ...value, heroImageUrl: url }))} /></div></div>
          <label className="text-sm font-bold text-slate-700">Resource archive URL<input type="url" value={settings.resourceUrl} onChange={(e) => setSettings(value => ({ ...value, resourceUrl: e.target.value }))} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700">Resource button label<input value={settings.resourceLabel} onChange={(e) => setSettings(value => ({ ...value, resourceLabel: e.target.value }))} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700">Library hours<input value={settings.openingHours} onChange={(e) => setSettings(value => ({ ...value, openingHours: e.target.value }))} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700">Library contact email<input type="email" value={settings.contactEmail} onChange={(e) => setSettings(value => ({ ...value, contactEmail: e.target.value }))} className={fieldClass} /></label>
        </div>
        <div className="mt-6 flex justify-end"><button disabled={savingSettings} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-50">{savingSettings ? 'Saving…' : 'Save library profile'}</button></div>
      </form>

      <form onSubmit={savePost} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-extrabold text-slate-900">{editingId ? 'Edit library post' : 'Publish a library post'}</h3><p className="mt-1 text-sm text-slate-500">Use this for news from the library and links to resources.</p></div>{editingId && <button type="button" onClick={() => { setEditingId(null); setPost(EMPTY_POST); }} className="text-sm font-bold text-slate-600 hover:text-slate-900">Cancel editing</button>}</div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">Post type<select value={post.type} onChange={(e) => setPost(value => ({ ...value, type: e.target.value }))} className={fieldClass}>{POST_TYPES.map(type => <option key={type}>{type}</option>)}</select></label>
          <label className="text-sm font-bold text-slate-700">Date<input type="date" value={post.date} onChange={(e) => setPost(value => ({ ...value, date: e.target.value }))} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Title<input required value={post.title} onChange={(e) => setPost(value => ({ ...value, title: e.target.value }))} className={fieldClass} /></label>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Short summary<textarea value={post.summary} onChange={(e) => setPost(value => ({ ...value, summary: e.target.value }))} className={`${fieldClass} h-20`} /></label>
          <label className="text-sm font-bold text-slate-700 md:col-span-2">Full content<textarea value={post.body} onChange={(e) => setPost(value => ({ ...value, body: e.target.value }))} className={`${fieldClass} h-32`} /></label>
          <div><label className="text-sm font-bold text-slate-700">Image URL (optional)<input type="url" value={post.imageUrl} onChange={(e) => setPost(value => ({ ...value, imageUrl: e.target.value }))} className={fieldClass} /></label><div className="mt-2"><ImgBbUrlImporter onExtracted={(url) => setPost(value => ({ ...value, imageUrl: url }))} /></div></div>
          <label className="text-sm font-bold text-slate-700">Resource or article link (optional)<input type="url" value={post.linkUrl} onChange={(e) => setPost(value => ({ ...value, linkUrl: e.target.value }))} className={fieldClass} /></label>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5"><label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={post.published} onChange={(e) => setPost(value => ({ ...value, published: e.target.checked }))} className="h-4 w-4" />Publish on the Library page</label><button disabled={savingPost} className="rounded-lg bg-[#15324a] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#0d2639] disabled:opacity-50">{savingPost ? 'Saving…' : editingId ? 'Update post' : 'Publish post'}</button></div>
      </form>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between"><div><h3 className="text-xl font-extrabold text-slate-900">Published & draft posts</h3><p className="mt-1 text-sm text-slate-500">Drafts stay private until published.</p></div>{postsLoading && <span className="text-sm font-bold text-slate-400">Loading…</span>}</div>
        <div className="mt-6 divide-y divide-slate-100">{posts.map(item => <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.13em] text-emerald-700"><span>{item.type}</span><span className={item.published !== false ? 'text-emerald-600' : 'text-amber-600'}>{item.published !== false ? 'Published' : 'Draft'}</span></div><h4 className="mt-1 font-bold text-slate-900">{item.title}</h4><p className="mt-1 text-sm text-slate-500">{displayDate(item.date)}</p></div><div className="flex gap-2"><button onClick={() => startEdit(item)} className="rounded-lg px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50">Edit</button><button onClick={() => removePost(item)} className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Delete</button></div></article>)}{!postsLoading && !posts.length && <p className="py-8 text-center text-slate-500">No library posts yet.</p>}</div>
      </section>
    </div>
  );
}
