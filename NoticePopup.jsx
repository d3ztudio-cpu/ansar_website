import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-init';
import { useNavigate } from 'react-router-dom';
import { normalizeImageUrl } from './imageUrlUtils';

let hasShownNoticeThisPageLoad = false;

export default function NoticePopup() {
  const [notice, setNotice] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'notices'), where('active', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setNotice({ id: snapshot.docs[0].id, ...data, imageUrl: normalizeImageUrl(data.imageUrl || '') });
        setImageFailed(false);
        if (!hasShownNoticeThisPageLoad) {
          hasShownNoticeThisPageLoad = true;
          setIsVisible(true);
        }
      } else {
        setIsVisible(false);
      }
    }, (error) => {
      // A notice is optional public content. A transient Firestore failure
      // must never affect the home page on a slow mobile connection.
      console.warn('Notice banner could not be loaded:', error);
      setIsVisible(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!notice) return null;

  const handleClick = () => {
    setIsVisible(false);
    if (notice.buttonUrl) {
      if (notice.buttonUrl.startsWith('http')) {
        window.open(notice.buttonUrl, '_blank', 'noopener,noreferrer');
      } else {
        navigate(notice.buttonUrl);
      }
    }
  };

  return (
    <>
      <style>{`
        .notice-popup-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.88);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          /* Avoid backdrop-filter and 3D transforms here: both can exhaust
             the compositor on lower-memory mobile devices. */
        }
        .notice-container-fluid {
          position: relative;
          width: 90vw;
          max-width: 1000px; /* Designed to lock into widescreen landscape banner limits perfectly */
          height: auto;
          display: flex; flex-direction: column;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          border-radius: 12px;
        }
        .notice-popup-img {
          width: 100%;
          height: auto;
          object-fit: contain; /* Keeps widescreen posters perfectly uncropped and clear */
          border-radius: 12px;
          max-height: min(62vh, 620px);
          background: #111827;
        }
        .notice-overlay-content {
          position: absolute;
          bottom: 0; left: 0; width: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%);
          padding: 24px;
          border-radius: 0 0 12px 12px;
          display: flex; justify-content: space-between; align-items: center;
          box-sizing: border-box;
        }
        @media (max-width: 640px) {
          .notice-popup-overlay {
            align-items: flex-start;
            padding-top: 36vh;
          }
          .notice-container-fluid {
            width: min(92vw, 420px);
          }
          .notice-popup-img {
            border-radius: 12px 12px 0 0;
          }
          .notice-overlay-content {
            position: relative;
            background: #030712;
            padding: 16px;
            gap: 12px;
            align-items: stretch;
            flex-direction: column;
            border-radius: 0 0 12px 12px;
          }
          .notice-overlay-content h3 {
            padding-right: 0;
            font-size: 1rem;
            line-height: 1.45;
          }
          .notice-overlay-content button {
            width: 100%;
            padding: 12px 18px;
          }
        }
      `}</style>
    {isVisible && (
      <div className="notice-popup-overlay" role="dialog" aria-modal="true" aria-label={notice.title || 'School notice'} onClick={() => setIsVisible(false)}>
        <div className="notice-container-fluid" onClick={(e) => e.stopPropagation()}>
            {/* Floating Close Button */}
            <button 
              onClick={() => setIsVisible(false)} 
              className="absolute -top-12 right-0 z-50 text-white/70 hover:text-white p-2 transition-colors"
              aria-label="Close Notice"
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            {notice.imageUrl && !imageFailed ? (
              <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden bg-black/80 ring-1 ring-white/10">
              <img 
                src={notice.imageUrl} 
                alt={notice.title || "Notice Banner"} 
                className="notice-popup-img"
                decoding="async"
                onError={() => setImageFailed(true)}
              />
                <div className="notice-overlay-content">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight drop-shadow-lg text-left pr-4">
                    {notice.title}
                  </h3>
                  {notice.buttonUrl && (
                    <button onClick={handleClick} className="flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 px-6 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.4)] whitespace-nowrap">
                      {notice.buttonText || "Learn More"}
                    </button>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-amber-400 z-10" />
              </div>
            ) : (
              <div className="p-8 sm:p-12 relative bg-white rounded-2xl shadow-2xl max-w-lg mx-auto w-full text-center">
                <p className="text-sm font-black tracking-widest text-amber-500 uppercase mb-3">New Update</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">{notice.title}</h3>
                {notice.buttonUrl && (
                  <button onClick={handleClick} className="mt-6 inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-md hover:shadow-lg">
                    <span>{notice.buttonText || "Learn More"}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                )}
                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-amber-400 rounded-b-2xl" />
              </div>
            )}
        </div>
      </div>
    )}
    </>
  );
}
