import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import Layout from './Layout';
import { db } from './firebase-init';

const DEFAULT_LIBRARY = {
  title: 'Ansar English School Library',
  subtitle: 'A home for readers, researchers, storytellers, and lifelong learners.',
  intro: 'The school library brings together books, ideas, conversation, and discovery. Students are encouraged to read widely, explore thoughtfully, and share what inspires them.',
  heroImageUrl: '',
  resourceUrl: 'https://sites.google.com/view/ansar-english-school-library/home',
  resourceLabel: 'Explore the library collection',
  openingHours: 'Open during school hours',
  contactEmail: ''
};

const libraryAreas = [
  { title: 'Library events', text: 'Author interactions, reading celebrations, competitions, and special programmes.', href: 'https://sites.google.com/view/ansar-english-school-library/library-events' },
  { title: 'Library activities', text: 'Student-centred activities that turn reading and research into shared experiences.', href: 'https://sites.google.com/view/ansar-english-school-library/library-activities' },
  { title: 'New arrivals', text: 'Discover recently added books and resources waiting for their next reader.', href: 'https://sites.google.com/view/ansar-english-school-library/new-arrivals' },
  { title: 'Question papers', text: 'A structured collection of previous question papers for focused preparation.', href: 'https://sites.google.com/view/ansar-english-school-library/question-papers' },
  { title: 'Reading desk', text: 'Newspaper clippings, periodicals, school magazines, and The Ansari Quill.', href: 'https://sites.google.com/view/ansar-english-school-library/news-paper-clippings' },
  { title: 'Creative & kids’ corner', text: 'A joyful space for young readers, writers, and curious imaginations.', href: 'https://sites.google.com/view/ansar-english-school-library/creative-corner' }
];

const categories = ['All', 'Event', 'Activity', 'New Arrival', 'Resource', 'Publication', 'Announcement'];

function postTime(post) {
  const timestamp = Date.parse(post.date || '');
  if (!Number.isNaN(timestamp)) return timestamp;
  if (post.createdAt?.toMillis) return post.createdAt.toMillis();
  return 0;
}

function displayDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export default function LibraryPage() {
  const [settings, setSettings] = useState(DEFAULT_LIBRARY);
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'librarySettings', 'main'), (snapshot) => {
      if (snapshot.exists()) setSettings({ ...DEFAULT_LIBRARY, ...snapshot.data() });
    }, () => setSettings(DEFAULT_LIBRARY));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const publicPosts = query(collection(db, 'libraryPosts'), where('published', '==', true));
    const unsubscribe = onSnapshot(publicPosts, (snapshot) => {
      setPosts(snapshot.docs.map(item => ({ id: item.id, ...item.data() })).sort((a, b) => postTime(b) - postTime(a)));
    }, () => setPosts([]));
    return unsubscribe;
  }, []);

  const visiblePosts = useMemo(
    () => posts.filter(post => activeCategory === 'All' || post.type === activeCategory),
    [activeCategory, posts]
  );

  return (
    <Layout fullWidth>
      <main className="bg-[#f7f3ea] text-slate-900">
        <section className="relative isolate overflow-hidden bg-[#15324a] text-white">
          {settings.heroImageUrl && <img src={settings.heroImageUrl} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25" />}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_18%,rgba(218,154,44,.42),transparent_25%),linear-gradient(115deg,rgba(12,36,55,.98),rgba(18,52,73,.82))]" />
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">Ansar English School · Perumpilavu</p>
            <div className="mt-7 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
              <div>
                <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">{settings.title}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100 sm:text-xl">{settings.subtitle}</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#library-latest" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-amber-200">Read the latest</a>
                  {settings.resourceUrl && <a href={settings.resourceUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/20">{settings.resourceLabel}</a>}
                </div>
              </div>
              <div className="border-l border-white/20 pl-6 sm:pl-8 lg:mb-2">
                <p className="font-serif text-3xl italic text-amber-200">“A reader lives a thousand lives before he dies.”</p>
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-300">George R. R. Martin</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#ded6c8] bg-white/70">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:grid-cols-3 sm:px-6 lg:px-8">
            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#a75032]">Library hours</p><p className="mt-1 font-serif text-xl font-bold text-[#15324a]">{settings.openingHours}</p></div>
            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#a75032]">Our focus</p><p className="mt-1 font-serif text-xl font-bold text-[#15324a]">Read · Think · Create</p></div>
            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#a75032]">Connect</p>{settings.contactEmail ? <a href={`mailto:${settings.contactEmail}`} className="mt-1 block font-serif text-xl font-bold text-[#15324a] hover:text-[#a75032]">{settings.contactEmail}</a> : <p className="mt-1 font-serif text-xl font-bold text-[#15324a]">Meet us in the library</p>}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#a75032]">About the library</p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#15324a]">A place where every question can begin.</h2>
            </div>
            <p className="max-w-3xl text-lg leading-9 text-slate-700">{settings.intro}</p>
          </div>
        </section>

        <section className="bg-[#ece4d6] py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#a75032]">Explore</p><h2 className="mt-3 font-serif text-4xl font-bold text-[#15324a]">More than a bookshelf</h2></div>
              <a href={settings.resourceUrl} target="_blank" rel="noreferrer" className="text-sm font-extrabold text-[#a75032] underline decoration-2 underline-offset-4">View the existing resource archive</a>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {libraryAreas.map((area, index) => <a key={area.title} href={area.href} target="_blank" rel="noreferrer" className="group relative overflow-hidden border border-[#d8cbb9] bg-[#fdfbf6] p-6 transition hover:-translate-y-1 hover:border-[#a75032] hover:shadow-xl">
                <span className="font-serif text-5xl font-bold text-[#d8cbb9]">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 font-serif text-2xl font-bold text-[#15324a] group-hover:text-[#a75032]">{area.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{area.text}</p>
                <span className="mt-5 inline-block text-sm font-extrabold text-[#a75032]">Explore →</span>
              </a>)}
            </div>
          </div>
        </section>

        <section id="library-latest" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#a75032]">From the library desk</p><h2 className="mt-3 font-serif text-4xl font-bold text-[#15324a] sm:text-5xl">Latest stories & updates</h2></div>
          <div className="mt-8 flex flex-wrap gap-2 border-y border-[#ded6c8] py-4">
            {categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeCategory === category ? 'bg-[#15324a] text-white' : 'text-slate-600 hover:bg-white'}`}>{category}</button>)}
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {visiblePosts.map((post, index) => <article key={post.id} className={`border-t-4 border-[#a75032] bg-white shadow-sm ${index === 0 ? 'lg:col-span-2 lg:grid lg:grid-cols-2' : ''}`}>
              {post.imageUrl && <img src={post.imageUrl} alt="" className={`h-56 w-full object-cover ${index === 0 ? 'lg:h-full' : ''}`} loading="lazy" />}
              <div className="p-6 sm:p-7"><div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[#a75032]"><span>{post.type}</span>{post.date && <span className="text-slate-400">{displayDate(post.date)}</span>}</div><h3 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#15324a]">{post.title}</h3>{post.summary && <p className="mt-4 leading-7 text-slate-600">{post.summary}</p>}{post.body && <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">{post.body}</p>}{post.linkUrl && <a href={post.linkUrl} target="_blank" rel="noreferrer" className="mt-6 inline-block text-sm font-extrabold text-[#a75032] underline decoration-2 underline-offset-4">Open resource →</a>}</div>
            </article>)}
          </div>
          {!visiblePosts.length && <div className="mt-10 border border-dashed border-[#bcae98] bg-white/70 p-10 text-center"><p className="font-serif text-2xl font-bold text-[#15324a]">New library stories will appear here.</p><p className="mx-auto mt-3 max-w-xl text-slate-600">Library staff can publish events, activities, new arrivals, resources, and publications from the Admin Portal.</p></div>}
        </section>
      </main>
    </Layout>
  );
}
