import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Layout from './Layout';
import { useSettings } from './SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import ShareButton from './ShareButton';
import { useContentDocument } from './useContentCollection';
import { imageCandidates } from './imageUrlUtils';
import { formatDisplayDate, isYearOnly } from './dateUtils';
import { applySeoMetadata, createMetaDescription } from './seoUtils';
import ReportButton from './ReportButton';
import { normalizeItemForReport, getSchoolLogoDataUrl, generateEventReport } from './reportUtils';

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const fallbackImageSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600' viewBox='0 0 1200 600'%3E%3Crect width='1200' height='600' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' font-weight='bold' fill='%2394a3b8'%3EImage Unavailable%3C/text%3E%3C/svg%3E";

export default function ArticleView() {
  const { id } = useParams();
  const location = useLocation();
  const settings = useSettings();
  const isAchievement = location.pathname.startsWith('/achievements/');
  const isSportsAchievement = location.pathname.startsWith('/sports-achievements/');
  const collectionName = isSportsAchievement ? 'sportsAchievements' : (isAchievement ? 'achievements' : 'updates');
  const shareUrl = `${window.location.origin}${location.pathname}`;
  const { data: article, loading } = useContentDocument(collectionName, id);

  const [[page, direction], setPage] = useState([0, 0]);
  const [brokenImages, setBrokenImages] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setPage([0, 0]);
    setBrokenImages([]);
  }, [location.pathname, id]);

  const allImageCandidates = imageCandidates(article?.coverImageUrl, article?.imageUrl, article?.eventImages, article?.imageUrls);
  const validImages = allImageCandidates
    .filter((url) => !brokenImages.includes(url));

  const isEventArticle = location.pathname.startsWith('/events/');
  const handleReport = async (onProgress) => {
    const reportItem = normalizeItemForReport(article, 'events');
    const logo = await getSchoolLogoDataUrl();
    return generateEventReport(reportItem, logo, { onProgress });
  };
  const exhaustedImages = allImageCandidates.length > 0 && validImages.length === 0;
  const displayDate = formatDisplayDate(article?.date);
  const displayStudentName = isSportsAchievement && isYearOnly(article?.studentName) ? '' : article?.studentName;

  useEffect(() => {
    if (loading) return;
    const isIndexable = article && article.published !== false;
    const timer = window.setTimeout(() => {
      applySeoMetadata(isIndexable ? {
        title: `${article.title} | Ansar English School`,
        description: createMetaDescription(article.description || article.excerpt || article.content, `${article.title} from Ansar English School.`),
        keywords: `${article.title}, Ansar English School, ${isSportsAchievement ? 'sports achievement' : isAchievement ? 'student achievement' : 'school news and events'}`,
        imageUrl: article.thumbnailUrl || article.coverImageUrl || article.imageUrl || article.eventImages?.[0] || article.imageUrls?.[0]
      } : {
        title: 'Article Not Found | Ansar English School',
        description: 'The requested article does not exist or is not published.',
        noIndex: true
      }, location.pathname);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [article, isAchievement, isSportsAchievement, loading, location.pathname]);

  // Fix negative modulo bug so backwards manual navigation loops safely
  const imageIndex = validImages.length > 0 ? ((page % validImages.length) + validImages.length) % validImages.length : 0;

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  // Automatic Carousel Sliding Effect
  useEffect(() => {
    if (validImages.length > 1) {
      const timer = setInterval(() => paginate(1), 4000); // Auto-slides every 4s
      return () => clearInterval(timer); // Resets the timer if a user manually clicks an arrow
    }
  }, [page, validImages.length]);

  if (loading) {
    return <Layout><div className="text-center py-24 font-bold text-xl">Loading Article...</div></Layout>;
  }

  if (!article || article.published === false) {
    return <Layout><div className="text-center py-24 font-bold text-xl text-red-600">Article not found.</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 lg:py-20 px-4">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-emerald-950 mb-4">{article.title}</h1>
        
        {displayDate && (
          <div className="flex items-center gap-2 text-slate-500 font-semibold mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span>{displayDate}</span>
          </div>
        )}

        {/* Dynamic Social Post Links & Global WhatsApp Anchor */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {settings?.whatsappChannelUrl && (
            <a href={settings.whatsappChannelUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Join WhatsApp Channel
            </a>
          )}
          {article.facebookUrl && (
            <a href={article.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-[#1877F2] text-white rounded-full hover:opacity-90 transition-opacity shadow-sm" title="View on Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
            </a>
          )}
          {article.instagramUrl && (
            <a href={article.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 text-white rounded-full hover:opacity-90 transition-opacity shadow-sm" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }} title="View on Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" clipRule="evenodd" /></svg>
            </a>
          )}
          {article.youtubeUrl && (
            <a href={article.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-[#FF0000] text-white rounded-full hover:opacity-90 transition-opacity shadow-sm" title="View on YouTube">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" clipRule="evenodd" /></svg>
            </a>
          )}
          <ShareButton
            url={shareUrl}
            title={article.title}
            text={article.description}
            className="bg-slate-900 px-5 py-2.5 text-sm text-white hover:bg-slate-800"
          />
          {isEventArticle && (
            <ReportButton
              item={article}
              onGenerate={handleReport}
              kindLabel="Event"
              className="border border-emerald-600 bg-emerald-600 px-5 py-2.5 text-sm text-white hover:bg-emerald-700"
            />
          )}
        </div>

        {displayStudentName && (
          <p className="text-base font-bold text-emerald-700 mb-4">{displayStudentName}</p>
        )}

        {article.description && (
          <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap mb-10">{article.description}</p>
        )}

        {validImages.length === 1 && (
          <img 
            src={validImages[0]} 
            alt={article.title} 
            style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain', backgroundColor: '#f7f9fa', display: 'block', margin: '0 auto', borderRadius: '12px' }}
            className="shadow-xl border border-slate-200"
            onError={() => setBrokenImages((urls) => [...new Set([...urls, validImages[0]])])}
          />
        )}

        {validImages.length > 1 && (
          <div className="relative shadow-xl border border-slate-200 overflow-hidden" style={{ width: '100%', height: '60vh', minHeight: '400px', maxHeight: '600px', backgroundColor: '#f7f9fa', borderRadius: '12px', display: 'block', margin: '0 auto' }}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={page}
                src={validImages[imageIndex]}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                style={{ width: '100%', height: '100%', maxHeight: '600px', objectFit: 'contain', backgroundColor: '#f7f9fa', display: 'block', margin: '0 auto' }}
                className="absolute inset-0"
                onError={() => setBrokenImages((urls) => [...new Set([...urls, validImages[imageIndex]])])}
              />
            </AnimatePresence>
            
            <>
              <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 bg-white/50 p-2 rounded-full hover:bg-white transition-colors cursor-pointer" onClick={() => paginate(-1)}>
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10 bg-white/50 p-2 rounded-full hover:bg-white transition-colors cursor-pointer" onClick={() => paginate(1)}>
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {validImages.map((_, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${i === imageIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          </div>
        )}

        {exhaustedImages && (
          <img
            src={fallbackImageSvg}
            alt="Image unavailable"
            style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain', backgroundColor: '#f7f9fa', display: 'block', margin: '0 auto', borderRadius: '12px' }}
            className="shadow-xl border border-slate-200"
          />
        )}
      </div>
    </Layout>
  );
}
