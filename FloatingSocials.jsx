import React, { useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

function PodcastIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={`${className} relative z-10 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10v2a7 7 0 0 0 14 0v-2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19v3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 22h8" />
    </svg>
  );
}

export default function FloatingSocials() {
  const settings = useSettings();
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let frameId = null;
    const handleScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        setShowBackToTop(scrollY > 400);
        setIsScrolledPast(scrollY > 700);
        frameId = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className={`fixed right-3 bottom-3 z-40 transition-all duration-500 ease-in-out md:left-auto md:bottom-auto md:right-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 ${isScrolledPast ? 'md:opacity-0 md:translate-x-full md:pointer-events-none' : 'opacity-100 md:translate-x-0'}`}>
        {/* Prevent inner rendering until settings are fully loaded to eliminate icon layout glitching & FOUC */}
        {settings?._isLoaded && (
          <div className="floating-panel-container flex flex-row md:flex-col items-center justify-center gap-2 md:gap-3 p-2 md:p-3 bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] rounded-2xl md:rounded-l-2xl md:rounded-r-none border border-emerald-100 md:border-r-0">
      {settings?.whatsappChannelUrl && (
        <a href={settings.whatsappChannelUrl} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center p-2.5 text-slate-400 hover:text-white bg-white hover:bg-[#25D366] rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg">
          <span className="floating-icon-aura absolute inset-0 rounded-xl bg-[#25D366]"></span>
          <svg className="w-6 h-6 relative z-10 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
        </a>
      )}
      <a href={settings?.facebookUrl || "#"} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center p-2.5 text-slate-400 hover:text-white bg-white hover:bg-[#1877F2] rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg">
        <span className="floating-icon-aura absolute inset-0 rounded-xl bg-[#1877F2]"></span>
        <svg className="w-6 h-6 relative z-10 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
      </a>
      <a href={settings?.instagramUrl || "#"} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center p-2.5 text-slate-400 hover:text-white bg-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg">
        <span className="floating-icon-aura absolute inset-0 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]"></span>
        <svg className="w-6 h-6 relative z-10 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" clipRule="evenodd" /></svg>
      </a>
      <a href={settings?.youtubeUrl || "#"} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center p-2.5 text-slate-400 hover:text-white bg-white hover:bg-[#FF0000] rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg">
        <span className="floating-icon-aura absolute inset-0 rounded-xl bg-[#FF0000]"></span>
        <svg className="w-6 h-6 relative z-10 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" clipRule="evenodd" /></svg>
      </a>
      <a href={settings?.podcastUrl || "https://www.youtube.com/channel/UCINzivjyBDxX2O8vzGpUOCg/"} target="_blank" rel="noopener noreferrer" aria-label="Podcast Channel" className="group relative flex items-center justify-center p-2.5 text-slate-400 hover:text-white bg-white hover:bg-emerald-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg">
        <span className="floating-icon-aura absolute inset-0 rounded-xl bg-emerald-600"></span>
        <PodcastIcon />
      </a>
      <a href={settings?.twitterUrl || "#"} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center p-2.5 text-slate-400 hover:text-white bg-white hover:bg-[#000000] rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg">
        <span className="floating-icon-aura absolute inset-0 rounded-xl bg-[#000000]"></span>
        <svg className="w-5 h-5 relative z-10 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path></svg>
      </button>
    </>
  );
}
