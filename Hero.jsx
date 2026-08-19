import React from 'react';
import { useSettings } from './SettingsContext';

export default function Hero({ imageUrl, imageSrcSet, imageAvifSrcSet, title, titleLine2, subtitle }) {
  const settings = useSettings();
  const graphicUrl = imageUrl || settings?.logoUrl || 'https://i.ibb.co/7d4mTQVT/image.png';
  const displayTitle = title || settings?.heroTitle || "Welcome to Ansar English School";

  return (
    <div className="relative w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-emerald-950 border border-emerald-900/50 mt-4 lg:mt-6">
      {/* Premium Cinematic Overlay & Glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_38%),linear-gradient(135deg,rgba(16,185,129,0.08),transparent_55%)]" />
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between px-8 py-16 sm:px-16 sm:py-20 lg:py-24 gap-12 lg:gap-8">
        
        {/* Left Side: Prominent Text */}
        <div className="w-full lg:w-3/5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="inline-block py-1.5 px-5 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-500/10 text-amber-400 text-sm font-bold tracking-[0.2em] uppercase mb-6 border border-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
            Ansar English School
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight">
            <span className="block lg:whitespace-nowrap">{displayTitle}</span>
            {titleLine2 && <span className="mt-2 block text-2xl font-bold leading-tight text-emerald-50/90 sm:text-3xl lg:text-4xl">{titleLine2}</span>}
          </h1>
          <p className="text-lg sm:text-xl text-emerald-50/80 max-w-2xl font-light leading-relaxed mb-10">
            {subtitle || "Nurturing creative and value-driven citizens in a rapidly changing world."}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a href="https://www.p4panorama.com/360-virtual-tour/ansar-school/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 font-bold py-4 px-8 rounded-full hover:bg-amber-300 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              360° Virtual Tour
            </a>
          </div>
        </div>

        {/* Right Side: Contained Featured Graphic */}
        <div className="w-full lg:w-2/5 flex justify-center lg:justify-end">
          <div className="group relative flex w-full max-w-[30rem] items-center justify-center rounded-[2rem] border border-white/25 bg-white/15 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/25 via-white/10 to-white/5 opacity-80" />
            <div className="absolute -inset-4 rounded-[2.25rem] bg-white/10 blur-2xl transition-opacity duration-700 group-hover:opacity-90" />
            <picture className="relative z-10 block w-full">
              {imageAvifSrcSet && <source type="image/avif" srcSet={imageAvifSrcSet} sizes="(max-width: 639px) calc(100vw - 96px), 480px" />}
              {imageSrcSet && <source type="image/webp" srcSet={imageSrcSet} sizes="(max-width: 639px) calc(100vw - 96px), 480px" />}
              <img
                src={graphicUrl}
                srcSet={imageSrcSet}
                sizes="(max-width: 639px) calc(100vw - 96px), 480px"
                alt="Ansar English School featured programme"
                width="640"
                height="401"
                className="max-h-[18rem] w-full rounded-[1.35rem] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:max-h-[21rem] lg:max-h-[24rem]"
                style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </picture>
          </div>
        </div>
      </div>
    </div>
  );
}
