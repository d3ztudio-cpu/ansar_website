import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import ShareButton from './ShareButton';
import { useContentCollection } from './useContentCollection';

// Achievements display in upload order (FIFO): newest uploads first.
function getUploadTime(item) {
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
  return null;
}

function compareByUploadOrder(a, b) {
  const aTime = getUploadTime(a);
  const bTime = getUploadTime(b);
  if (aTime == null && bTime == null) return 0;
  if (aTime == null) return 1;
  if (bTime == null) return -1;
  return bTime - aTime;
}

function AchievementCard({ achievement, priority = false }) {
  const navigate = useNavigate();
  const shareUrl = `${window.location.origin}/achievements/${achievement.id}`;
  const galleryImages = Array.isArray(achievement.imageUrls) ? achievement.imageUrls.filter(Boolean) : [];
  const imageUrl = achievement.thumbnailUrl || achievement.coverImageUrl || achievement.imageUrl || galleryImages[0];

  return (
    <div
      onClick={() => navigate(`/achievements/${achievement.id}`)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
    >
      <div className="relative min-h-56 overflow-hidden border-b border-slate-100 bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={achievement.title}
            className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            width="640"
            height="360"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v18m14-18v18M5 8h14M5 16h14" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {achievement.date && <span className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600">{achievement.date}</span>}
        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-slate-900 group-hover:text-emerald-700">{achievement.title}</h3>
        {achievement.studentName && <p className="mb-2 text-sm font-bold text-slate-500">{achievement.studentName}</p>}
        {achievement.description && <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{achievement.description}</p>}
        {galleryImages.length > 1 && <p className="mt-3 text-xs font-black uppercase tracking-widest text-amber-600">{galleryImages.length} Photos</p>}
        <button className="mt-5 w-full rounded-lg bg-emerald-50 py-2.5 font-bold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white">
          Read More
        </button>
        <ShareButton
          url={shareUrl}
          title={achievement.title}
          text={achievement.description}
          className="mt-3 w-full border border-slate-200 bg-white px-4 py-2.5 text-slate-700 duration-300 hover:-translate-y-0.5 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-md"
        />
      </div>
    </div>
  );
}

export default function Achievements() {
  const { data: achievements, loading } = useContentCollection('achievements', null);
  const publishedAchievements = achievements
    .filter(item => item.published !== false)
    .sort(compareByUploadOrder);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 lg:text-5xl">Achievements</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">Celebrating the accomplishments of Ansar English School students and community.</p>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">Loading achievements...</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {publishedAchievements.length ? (
              publishedAchievements.map((item, index) => <AchievementCard key={item.id} achievement={item} priority={index === 0} />)
            ) : (
              <p className="col-span-full text-center text-slate-500">Achievements will appear here once published.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
