import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from './SettingsContext';
import { useFirestoreCollection } from './useFirestoreCollection';
import NotificationsBell from './NotificationsBell';

const LEGACY_EXPLORE_LINKS = [
  { title: 'Gallery', slug: 'gallery' },
  { title: 'Achievements', slug: 'achievements' },
  { title: 'Ansar Media Productions', slug: 'ansar-media-production' },
  { title: 'Sports', slug: 'sports-page' },
  { title: 'ATL', slug: 'atl' },
  { title: 'Library', slug: 'library' },
  { title: 'Extension Services', slug: 'extension-services' },
  { title: 'Life at Ansar', slug: 'life-at-ansar' },
  { title: 'Ansar Times', slug: 'ansar-times' },
  { title: 'Ansar Family', slug: 'ansar-family' },
  { title: 'Alumni', slug: 'alumni' },
  { title: 'SOP', slug: 'sop' },
  { title: 'AES School Policies', slug: 'school-policies' },
  { title: 'Mandatory Public Disclosure', slug: 'mandatory-public-disclosure' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const settings = useSettings();
  
  // Fetch all custom pages to dynamically build the navigation menu
  const { data: pages } = useFirestoreCollection('pages', 'order', 'asc');
  const mainNavSlugs = ['about', 'academics', 'admission'];
  const dynamicExplorePages = pages
    .filter(p => p.published !== false && !mainNavSlugs.includes(p.slug))
    .map(page => ({ title: page.title, slug: page.slug, id: page.id }));
  const explorePages = [
    ...LEGACY_EXPLORE_LINKS,
    ...dynamicExplorePages.filter(page => !LEGACY_EXPLORE_LINKS.some(link => link.slug === page.slug))
  ];

  return (
    <header className="relative sticky top-0 z-50 border-b border-white/10 bg-emerald-950/95 shadow-lg shadow-emerald-950/20 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Premium Logo Layout */}
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-16 items-center rounded-2xl bg-white px-3 shadow-md shadow-slate-950/20 ring-1 ring-white/60">
              <img
                src={settings?.logoUrl || "/icon-192.png"}
                alt="Ansar English School Logo"
                width="48"
                height="48"
                decoding="async"
                className="h-12 w-auto object-contain contrast-125 brightness-105 transition-all duration-300 hover:scale-[1.03]"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              />
            </span>
            <div className="hidden sm:flex flex-col border-l-2 border-white/25 pl-3 ml-1">
              <span className="block text-lg font-extrabold uppercase leading-tight tracking-wide text-white">ANSAR ENGLISH SCHOOL</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="block font-sans text-sm font-semibold normal-case tracking-normal text-emerald-50">Perumpilavu</span>
                <span className="block rounded bg-amber-100 px-2 py-0.5 text-[11px] font-black uppercase leading-none tracking-wide text-amber-900 shadow-sm">NABET Accredited</span>
              </div>
            </div>
          </Link>
          
          {/* Fluid Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            {[
              { title: 'Home', path: '/' },
              { title: 'About', path: '/about' },
              { title: 'Academics', path: '/academics' },
              { title: 'Admission', path: '/admission' },
              { title: 'Ansar Sprouts', path: '/ansar-sprouts' },
              { title: 'News', path: '/news' },
              { title: 'Events', path: '/events' },
              { title: 'Contact', path: '/contact' }
            ].map((item) => (
              <Link key={item.path} to={item.path} className="relative text-sm font-bold text-white/90 hover:text-amber-300 transition-colors py-2 group">
                {item.title}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
              </Link>
            ))}
            
            {/* "More Options" Dropdown relocating the Login mechanism */}
            <div className="relative">
              <button 
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="flex items-center gap-1 text-sm font-bold text-white/90 hover:text-amber-300 transition-colors py-2"
              >
                Explore
                <svg className={`w-4 h-4 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isMoreOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl py-3 flex flex-col max-h-96 overflow-y-auto z-50 custom-scrollbar ring-1 ring-black/5">
                  {explorePages.map(page => (
                    <Link key={page.id || page.slug} to={`/${page.slug}`} onClick={() => setIsMoreOpen(false)} className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">{page.title}</Link>
                  ))}
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/admin" className="px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors">Admin Login</Link>
                </div>
              )}
            </div>
            <NotificationsBell />
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <NotificationsBell />
            <button 
              className="p-2 text-white hover:text-amber-300 focus:outline-none transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-6rem)] overflow-y-auto border-t border-white/10 bg-emerald-950 shadow-xl md:hidden">
          <div className="mx-auto grid w-full max-w-7xl gap-1 px-4 py-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-white font-bold hover:bg-white/10 hover:text-amber-300">Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-white font-bold hover:bg-white/10 hover:text-amber-300">About Us</Link>
            <Link to="/admission" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-white font-bold hover:bg-white/10 hover:text-amber-300">Admissions</Link>
            <Link to="/ansar-sprouts" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-white font-bold hover:bg-white/10 hover:text-amber-300">Ansar Sprouts</Link>
            <Link to="/academics" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-white font-bold hover:bg-white/10 hover:text-amber-300">Academics</Link>
            <Link to="/news" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-white font-bold hover:bg-white/10 hover:text-amber-300">News</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-white font-bold hover:bg-white/10 hover:text-amber-300">Events</Link>
            {explorePages.map(page => (
              <Link key={page.id || page.slug} to={`/${page.slug}`} onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-white font-bold hover:bg-white/10 hover:text-amber-300">{page.title}</Link>
            ))}
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-white font-bold hover:bg-white/10 hover:text-amber-300">Contact Us</Link>
            <div className="mt-2 border-t border-white/10 pt-2">
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-amber-300 font-extrabold hover:bg-white/10 hover:text-white">Admin Login</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
