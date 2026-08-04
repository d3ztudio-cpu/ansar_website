import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import Layout from './Layout';
import { db } from './firebase-init';
import { applySeoMetadata, createMetaDescription } from './seoUtils';
import { DEFAULT_ALUMNI_SETTINGS, mergeAlumniSettings } from './alumniContent';

export default function AlumniArticle() {
  const { section, index } = useParams();
  const [settings, setSettings] = useState(DEFAULT_ALUMNI_SETTINGS);
  useEffect(() => onSnapshot(doc(db, 'settings', 'alumniPage'), snapshot => snapshot.exists() && setSettings(mergeAlumniSettings(snapshot.data())), () => setSettings(DEFAULT_ALUMNI_SETTINGS)), []);
  const items = section === 'events' ? settings.events : section === 'success-stories' ? settings.successStories : [];
  const item = items[Number(index)];
  const sectionLabel = section === 'events' ? 'Alumni Event' : 'Success Story';
  useEffect(() => {
    applySeoMetadata(item ? { title: `${item.title} | Ansar Alumni`, description: createMetaDescription(item.body), keywords: 'Ansar English School alumni, alumni article' } : { title: 'Alumni Article Not Found | Ansar English School', description: 'The requested Alumni article could not be found.', noIndex: true }, `/alumni/${section}/${index}`);
  }, [item, section, index]);

  if (!item) return <Layout><main className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-3xl font-extrabold text-slate-900">Article not found</h1><p className="mt-4 text-slate-600">This Alumni article may have been removed or its address is incorrect.</p><Link to="/alumni" className="mt-7 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white">Back to Alumni</Link></main></Layout>;

  const images = (item.imageUrls || []).filter(Boolean);
  return <Layout fullWidth><main className="bg-slate-50">
    <header className="bg-emerald-950 text-white"><div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><Link to="/alumni" className="inline-flex items-center text-sm font-bold text-amber-300 hover:text-amber-200"><span className="mr-2" aria-hidden="true">←</span>Back to Alumni</Link><p className="mt-8 text-xs font-black uppercase tracking-[.22em] text-amber-300">{sectionLabel}</p><h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{item.title}</h1>{item.subtitle && <p className="mt-5 text-xl font-extrabold text-emerald-100">{item.subtitle}</p>}{item.speaker && <p className="mt-4 max-w-3xl font-bold leading-7 text-slate-200">{item.speaker}</p>}</div></header>
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      {images.length > 0 && <div className={`grid gap-5 ${images.length > 1 ? 'md:grid-cols-2' : ''}`}>{images.map((url, imageIndex) => <figure key={url} className="overflow-hidden rounded-3xl bg-white shadow-xl"><img src={url} alt={`${item.title} — image ${imageIndex + 1}`} className="h-full max-h-[44rem] w-full object-contain" loading={imageIndex ? 'lazy' : 'eager'} /></figure>)}</div>}
      <div className="mt-10 rounded-3xl bg-white p-7 shadow-sm sm:p-10"><p className="text-xs font-black uppercase tracking-[.2em] text-amber-600">About this story</p><p className="mt-5 whitespace-pre-line text-lg leading-9 text-slate-700">{item.body}</p></div>
      <div className="mt-8"><Link to="/alumni" className="inline-flex items-center rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-extrabold text-emerald-700 hover:bg-emerald-50"><span className="mr-2" aria-hidden="true">←</span>View all Alumni stories</Link></div>
    </article>
  </main></Layout>;
}
