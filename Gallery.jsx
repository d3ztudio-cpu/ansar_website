import React, { useMemo, useState } from 'react';
import Layout from './Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useContentCollection } from './useContentCollection';
import { imageCandidates, normalizeImageUrl } from './imageUrlUtils';
import { formatDisplayDate, getDateTime, getDisplayYear } from './dateUtils';

function getItemTime(item) {
  const dateTime = getDateTime(item.date, null);
  if (dateTime != null) return dateTime;
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
  return 0;
}

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const [selectedImg, setSelectedImg] = useState(null);
  const [brokenUrls, setBrokenUrls] = useState([]);
  const { data: updates, loading: loadingUpdates } = useContentCollection('updates', null);
  const { data: achievements, loading: loadingAchievements } = useContentCollection('achievements', null);
  const { data: sportsAchievements, loading: loadingSportsAchievements } = useContentCollection('sportsAchievements', null);
  const { data: galleryData, loading: loadingGallery } = useContentCollection('gallery', null);
  const loading = loadingUpdates || loadingAchievements || loadingSportsAchievements || loadingGallery;

  const media = useMemo(() => {
      const dedupedImages = new Map();
      const addImage = (url, item, meta) => {
        const normalizedUrl = normalizeImageUrl(url);
        if (!normalizedUrl || brokenUrls.includes(normalizedUrl)) return;

        const next = {
          id: meta.id,
          url: normalizedUrl,
          title: meta.title,
          category: meta.category,
          date: formatDisplayDate(item.date),
          year: getDisplayYear(item.date),
          timestamp: getItemTime(item),
          sourceRank: meta.sourceRank
        };
        const existing = dedupedImages.get(normalizedUrl);

        if (!existing || next.sourceRank < existing.sourceRank || next.timestamp > existing.timestamp) {
          dedupedImages.set(normalizedUrl, next);
        }
      };

      // Updates (News & Events) Collections
      updates.filter(item => item.published !== false).forEach(item => {
        let i = 0;
        imageCandidates(item.coverImageUrl, item.imageUrl, item.eventImages, item.imageUrls).forEach(url => addImage(url, item, {
          id: `${item.id}-upd-${i++}`,
          title: item.title || 'School Update',
          category: item.category || 'News & Events',
          sourceRank: 1
        }));
      });

      // Achievements Collection
      achievements.filter(item => item.published !== false).forEach(item => {
        let i = 0;
        imageCandidates(item.imageUrl, item.imageUrls).forEach(url => addImage(url, item, {
          id: item.id + `-ach-${i++}`,
          title: item.title || 'Achievement',
          category: 'Achievements',
          sourceRank: 1
        }));
      });

      // Sports Achievements Collection
      sportsAchievements.filter(item => item.published !== false).forEach(item => {
        let i = 0;
        imageCandidates(item.imageUrl, item.imageUrls).forEach(url => addImage(url, item, {
          id: item.id + `-sport-ach-${i++}`,
          title: item.title || 'Sports Achievement',
          category: 'Sports Achievements',
          sourceRank: 1
        }));
      });

      // Legacy Gallery Collection support
      galleryData.filter(item => item.published !== false).forEach(item => {
        addImage(item.imageUrl, item, {
          id: item.id + '-gal',
          title: item.title || 'Gallery Image',
          category: item.category || 'General',
          sourceRank: 2
        });
      });

      // Sort strictly chronologically (newest first)
      const allImages = Array.from(dedupedImages.values());
      allImages.sort((a, b) => b.timestamp - a.timestamp);
      return allImages;
  }, [updates, achievements, sportsAchievements, galleryData, brokenUrls]);

  const categories = ['All', ...new Set(media.map(item => item.category).filter(Boolean))];
  const filteredMedia = filter === 'All' ? media : media.filter(item => item.category === filter);
  const timelineYears = [...new Set(filteredMedia.map(item => item.year))];
  const scrollToYear = (year) => {
    document.getElementById(`gallery-year-${year}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Raw Asset Fetcher (Bypasses browser compression or preview constraints)
  const handleDownload = async (url, title) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network error');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'ansar_gallery_image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback for strict CORS blocked resources
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 lg:py-20 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900">Photo Gallery</h1>
          <p className="text-lg text-slate-600 mt-4">A visual timeline of moments, events, and achievements at Ansar English School.</p>
        </div>
        
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {categories.map(category => (
            <button key={category} onClick={() => setFilter(category)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === category ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
              {category}
            </button>
          ))}
        </div>
        
        {loading ? (
          <p className="text-center text-slate-500 font-bold animate-pulse">Synchronizing media assets...</p>
        ) : !filteredMedia.length ? (
          <p className="rounded-2xl border border-slate-100 bg-white p-10 text-center font-bold text-slate-500">No gallery images found for this filter.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[11rem_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-emerald-600">Timeline</p>
                <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                  {timelineYears.map(year => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => scrollToYear(year)}
                      className="flex shrink-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-left text-sm font-extrabold text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 lg:w-full"
                    >
                      <span>{year}</span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-black text-slate-500">{filteredMedia.filter(item => item.year === year).length}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
            <div className="space-y-12">
              {timelineYears.map(year => (
                <section id={`gallery-year-${year}`} key={year} className="scroll-mt-28">
                  <div className="mb-5 flex items-center gap-4">
                    <h2 className="text-2xl font-black text-emerald-950">{year}</h2>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>
                  <div className="columns-1 gap-4 sm:columns-2 md:columns-3 xl:columns-4">
                    {filteredMedia.filter(item => item.year === year).map(item => (
                      <div key={item.id} className="break-inside-avoid relative group overflow-hidden rounded-xl shadow-sm cursor-pointer mb-4 bg-slate-100 border border-slate-200" onClick={() => setSelectedImg(item)}>
                         <img src={item.url} alt={item.title} className="w-full h-auto block group-hover:scale-105 transition-transform duration-500" loading="lazy" onError={() => setBrokenUrls(urls => [...new Set([...urls, item.url])])} />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                            <h3 className="text-white font-bold text-sm lg:text-base leading-snug line-clamp-2 drop-shadow-md">{item.title}</h3>
                            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider mt-1 drop-shadow-md">{item.category}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* High-Fidelity Lightbox View */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedImg(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50 bg-white/10 rounded-full backdrop-blur-sm transition-colors"
              onClick={() => setSelectedImg(null)}
            >
              <span className="flex items-center gap-2 px-2 text-sm font-extrabold"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>Close</span>
            </button>

            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImg.url}
              alt={selectedImg.title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-5 pointer-events-none"
            >
              <div className="text-center px-4">
                <h3 className="text-white font-bold text-xl sm:text-2xl drop-shadow-md">{selectedImg.title}</h3>
                <p className="text-emerald-400 font-medium text-sm drop-shadow-md">{selectedImg.category} {selectedImg.date && ` | ${selectedImg.date}`}</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDownload(selectedImg.url, selectedImg.title); }}
                className="pointer-events-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:shadow-[0_0_30px_rgba(5,150,105,0.6)] transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Original Image
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
