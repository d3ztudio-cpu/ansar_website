import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebase-init';
import Layout from './Layout';

export const TESTIMONIAL_CATEGORIES = [
  { key: 'parents', label: 'Parents', title: "Parents' Voices" },
  { key: 'alumni', label: 'Alumni', title: 'Alumni Stories' },
  { key: 'staff', label: 'Former Staff', title: 'Our Former Staff' },
];

function usePublishedTestimonials() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });
  useEffect(() => {
    const q = query(collection(db, 'testimonials'), where('published', '==', true));
    const unsubscribe = onSnapshot(q, snapshot => {
      setItems(snapshot.docs.map(item => ({ id: item.id, ...item.data() })).sort((a, b) => {
        const at = a.createdAt?.toMillis?.() || Date.parse(a.createdAt || '') || 0;
        const bt = b.createdAt?.toMillis?.() || Date.parse(b.createdAt || '') || 0;
        return bt - at;
      }));
      setState({ loading: false, error: '' });
    }, error => setState({ loading: false, error: 'Testimonials are temporarily unavailable.' }));
    return unsubscribe;
  }, []);
  return { items, ...state };
}

function TestimonialCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const text = String(item.testimonial || '').trim();
  const long = text.length > 190;
  const imageUrl = item.imageUrl || item.photoUrl || item.photoURL || '';
  return <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white shadow-[0_18px_55px_-28px_rgba(4,66,61,.45)] transition duration-500 hover:-translate-y-1 hover:shadow-2xl sm:flex-row sm:items-start">
    <div className="relative flex shrink-0 items-center justify-center bg-emerald-950 px-6 py-6 sm:w-44 sm:self-stretch sm:px-5">
      <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white/80 bg-emerald-900 shadow-xl sm:h-32 sm:w-32">
        {imageUrl && !imageFailed ? <img src={imageUrl} alt={`${item.name} — ${item.categoryLabel || item.category || 'Ansar testimonial'}`} loading="lazy" decoding="async" onError={() => setImageFailed(true)} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-emerald-100"><svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4" strokeWidth="1.5"/><path d="M4 21a8 8 0 0 1 16 0" strokeWidth="1.5"/></svg></div>}
      </div>
      <span className="absolute left-4 top-4 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-emerald-950">{item.categoryLabel || item.category}</span>
    </div>
    <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-extrabold text-emerald-950">{item.name}</h3><p className="mt-1 text-sm font-bold text-amber-600">{item.detail || item.batch || item.relationship || ''}</p></div>{item.year && <span className="shrink-0 text-xs font-black text-slate-400">{item.year}</span>}</div>
      <p className={`mt-5 whitespace-pre-wrap text-[15px] leading-7 text-slate-600 ${!expanded && long ? 'line-clamp-4' : ''}`}>“{text}”</p>
      {long && <button type="button" onClick={() => setExpanded(value => !value)} className="mt-3 self-start text-sm font-black text-emerald-700 underline decoration-amber-400 decoration-2 underline-offset-4">{expanded ? 'Show less' : 'Read more'}</button>}
    </div>
  </article>;
}

export default function Testimonials({ compact = false }) {
  const { items, loading, error } = usePublishedTestimonials();
  const [active, setActive] = useState('parents');
  const [slideIndex, setSlideIndex] = useState(0);
  const visible = useMemo(() => compact ? items : items.filter(item => String(item.category || '').toLowerCase() === active), [items, active, compact]);
  useEffect(() => { setSlideIndex(0); }, [active, items.length, compact]);
  useEffect(() => {
    if (!compact || visible.length < 2) return;
    const timer = window.setInterval(() => setSlideIndex(index => (index + 1) % visible.length), 5200);
    return () => window.clearInterval(timer);
  }, [compact, visible.length]);
  const category = TESTIMONIAL_CATEGORIES.find(item => item.key === active);
  const content = <section id="testimonials" className={`${compact ? 'mt-24' : 'min-h-screen'} bg-gradient-to-b from-emerald-50/50 via-white to-white py-16 sm:py-24`}>
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center motion-safe:animate-[flow-fade_700ms_ease-out]">
        <p className="text-sm font-black uppercase tracking-[.25em] text-emerald-600">Community voices</p><h1 className="mt-3 text-4xl font-black tracking-tight text-emerald-950 sm:text-6xl">Voices of Ansar</h1><p className="mt-4 text-lg text-slate-600 sm:text-xl">Stories, Memories &amp; Experiences</p>
      </div>
      {!compact && <div className="mt-10 flex justify-center"><div className="inline-flex flex-wrap justify-center gap-2 rounded-2xl border border-emerald-100 bg-white p-2 shadow-sm" role="tablist" aria-label="Testimonial categories">{TESTIMONIAL_CATEGORIES.map(item => <button key={item.key} type="button" role="tab" aria-selected={active === item.key} onClick={() => setActive(item.key)} className={`rounded-xl px-4 py-2.5 text-sm font-black transition duration-300 sm:px-6 ${active === item.key ? 'bg-emerald-800 text-white shadow-lg' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'}`}>{item.label}</button>)}</div></div>}
      <div className="mt-12"><h2 className="text-center text-2xl font-extrabold text-emerald-950 sm:text-3xl">{compact ? 'Stories from our community' : category.title}</h2>{loading ? <div className="mt-8 rounded-3xl bg-white p-12 text-center text-slate-500 shadow-sm" role="status">Loading testimonials…</div> : error ? <div className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-red-700">{error}</div> : visible.length ? (compact ? <div key={visible[slideIndex]?.id} className="mx-auto mt-8 max-w-3xl motion-safe:animate-[testimonial-in-out_5200ms_ease-in-out_infinite]"><TestimonialCard item={visible[slideIndex]} /></div> : <div key={active} className="mx-auto mt-8 grid max-w-5xl gap-6 motion-safe:animate-[flow-fade_420ms_ease-out]">{visible.map(item => <TestimonialCard item={item} key={item.id} />)}</div>) : <div className="mt-8 rounded-3xl border border-dashed border-emerald-200 bg-white p-12 text-center text-slate-500">There are no published stories in this category yet.</div>}</div>
    </div>
  </section>;
  return compact ? content : <Layout>{content}</Layout>;
}
