import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShareButton from './ShareButton';

export default function NewsCard({ id, title, excerpt, thumbnailUrl, coverImageUrl, imageUrl, date, type = 'news', priority = false }) {
  const navigate = useNavigate();
  const targetImage = thumbnailUrl || coverImageUrl || imageUrl;
  const shareUrl = `${window.location.origin}/${type}/${id}`;

  return (
    <div 
      onClick={() => navigate(`/${type}/${id}`)}
      className="relative isolate cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden border border-slate-100 group flex flex-col h-full transform hover:-translate-y-2"
    >
      {/* Liquid Flow Animation Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-emerald-50 to-teal-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Image with fallback skeleton */}
      <div className="relative z-10 w-full aspect-[4/3] bg-slate-100 overflow-hidden flex-shrink-0 border-b border-slate-100">
        {targetImage ? (
          <>
            <img 
              src={targetImage} 
              alt={title} 
              width="640"
              height="480"
              className="relative z-[1] h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              onError={(e) => { 
                // If the URL fails to load as a direct asset, trigger a graceful fallback block
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden flex-col items-center justify-center h-full w-full bg-slate-100 text-slate-400 absolute inset-0">
              <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Image Unavailable</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full bg-slate-100 text-slate-400 absolute inset-0">
            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Image Unavailable</span>
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="relative z-10 p-6 flex flex-col flex-grow">
        <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase mb-2">{date}</span>
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">{title}</h3>
        <p className="text-slate-600 text-sm flex-grow line-clamp-3 leading-relaxed">{excerpt}</p>
        <button className="mt-5 w-full bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold py-2.5 rounded-lg transition-colors duration-300">
          Read More
        </button>
        <ShareButton
          url={shareUrl}
          title={title}
          text={excerpt}
          className="mt-3 w-full border border-slate-200 bg-white px-4 py-2.5 text-slate-700 duration-300 hover:-translate-y-0.5 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-md"
        />
      </div>
    </div>
  );
}
