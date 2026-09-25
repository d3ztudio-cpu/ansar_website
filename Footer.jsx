import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from './SettingsContext';
import { useFirestoreCollection } from './useFirestoreCollection';

function PodcastIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10v2a7 7 0 0 0 14 0v-2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19v3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 22h8" />
    </svg>
  );
}

export default function Footer() {
  const settings = useSettings();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t-4 border-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 pr-4">
          <h3 className="text-white text-lg font-bold mb-4">Ansar English School</h3>
          <p className="text-sm leading-relaxed mb-4 text-slate-400">
            A CBSE-affiliated, NABET accredited school shaped by the Ansari Charitable Trust commitment to education, healthcare, and social welfare.
          </p>
          <p className="text-sm text-slate-400">Perumpilavu, Thrissur, Kerala</p>
          
          <div className="mt-8">
            <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Connect With Us</h3>
            <div className="flex items-center gap-4">
              <a href="mailto:ansarmedia@ansarschool.in" aria-label="Email Us" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white transition-colors transform hover:scale-110 duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </a>
              {settings?.whatsappChannelUrl && (
                <a href={settings.whatsappChannelUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-[#25D366] hover:text-white transition-colors transform hover:scale-110 duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </a>
              )}
              <a href={settings?.facebookUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-[#1877F2] hover:text-white transition-colors transform hover:scale-110 duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href={settings?.instagramUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-[#E1306C] hover:text-white transition-colors transform hover:scale-110 duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" clipRule="evenodd" /></svg>
              </a>
              <a href={settings?.youtubeUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-[#FF0000] hover:text-white transition-colors transform hover:scale-110 duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" clipRule="evenodd" /></svg>
              </a>
              <a href={settings?.podcastUrl || "https://www.youtube.com/channel/UCINzivjyBDxX2O8vzGpUOCg/"} target="_blank" rel="noopener noreferrer" aria-label="Podcast Channel" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white transition-colors transform hover:scale-110 duration-300">
                <PodcastIcon />
              </a>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">About / Identity</h3>
          <nav className="flex flex-col space-y-2 text-sm">
            <Link to="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">Who we are</Link>
            <Link to="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">Vision & Mission</Link>
            <Link to="/leadership" className="text-slate-400 hover:text-emerald-400 transition-colors">Leadership</Link>
            <Link to="/ansar-family" className="text-slate-400 hover:text-emerald-400 transition-colors">Faculty</Link>
            <Link to="/sop" className="text-slate-400 hover:text-emerald-400 transition-colors">SOP</Link>
          </nav>
        </div>

        <div>
          <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Admissions / Rules</h3>
          <nav className="flex flex-col space-y-2 text-sm">
            <Link to="/admission" className="text-slate-400 hover:text-emerald-400 transition-colors">Procedure</Link>
            <Link to="/admission" className="text-slate-400 hover:text-emerald-400 transition-colors">Fee Structure</Link>
            <Link to="/admission" className="text-slate-400 hover:text-emerald-400 transition-colors">Admission FAQS</Link>
            <Link to="/admission" className="text-slate-400 hover:text-emerald-400 transition-colors">TC Queries</Link>
            <Link to="/admission" className="text-slate-400 hover:text-emerald-400 transition-colors">Prospectus</Link>
          </nav>
        </div>

        <div>
          <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Media / Documentation</h3>
          <nav className="flex flex-col space-y-2 text-sm">
            <Link to="/gallery" className="text-slate-400 hover:text-emerald-400 transition-colors">Gallery</Link>
            <Link to="/news" className="text-slate-400 hover:text-emerald-400 transition-colors">News</Link>
            <Link to="/events" className="text-slate-400 hover:text-emerald-400 transition-colors">Events</Link>
            <Link to="/ansar-times" className="text-slate-400 hover:text-emerald-400 transition-colors">Ansar Times</Link>
            <Link to="/library" className="text-slate-400 hover:text-emerald-400 transition-colors">Library</Link>
            <Link to="/mandatory-public-disclosure" className="text-slate-400 hover:text-emerald-400 transition-colors">Mandatory Disclosure</Link>
            <Link to="/school-policies" className="text-slate-400 hover:text-emerald-400 transition-colors">School Policies</Link>
          </nav>
        </div>

        <div>
          <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Campus Life</h3>
          <nav className="flex flex-col space-y-2 text-sm">
            <Link to="/sports-page" className="text-slate-400 hover:text-emerald-400 transition-colors">Sports & Athletics</Link>
            <Link to="/achievements" className="text-slate-400 hover:text-emerald-400 transition-colors">Achievements</Link>
            <Link to="/life-at-ansar" className="text-slate-400 hover:text-emerald-400 transition-colors">Life at Ansar</Link>
            <Link to="/field-trips" className="text-slate-400 hover:text-emerald-400 transition-colors">Field Trips</Link>
            <Link to="/learning-labs" className="text-slate-400 hover:text-emerald-400 transition-colors">Learning Labs</Link>
            <Link to="/extension-services" className="text-slate-400 hover:text-emerald-400 transition-colors">Extension Services</Link>
            <Link to="/ansar-media-production" className="text-slate-400 hover:text-emerald-400 transition-colors">Ansar Media Productions</Link>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} Ansar English School. All rights reserved.</p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
          <p>This website was developed and deployed by <a href="https://d3ztudio-main.web.app" target="_blank" rel="noopener noreferrer" className="text-emerald-500 font-semibold hover:text-emerald-400 hover:underline transition-colors">D3ZTUDIO</a></p>
        </div>
      </div>
    </footer>
  );
}
