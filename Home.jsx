import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import Hero from './Hero';
import NewsCard from './NewsCard';
import NoticePopup from './NoticePopup';
import AchievementsTicker from './AchievementsTicker';
import { useSettings } from './SettingsContext';
import { useContentCollection } from './useContentCollection';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { compareContentNewestFirst, getDisplayYear, isYearOnly } from './dateUtils';

const SchoolChatbot = lazy(() => import('./SchoolChatbot'));

function DeferredSchoolChatbot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const activate = () => setReady(true);
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(activate, { timeout: 3000 });
      return () => window.cancelIdleCallback(idleId);
    }
    const timer = window.setTimeout(activate, 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return ready ? <Suspense fallback={null}><SchoolChatbot /></Suspense> : null;
}

// Transformed into a Bento Layout configuration using Lucide-style SVG icons
const FALLBACK_FEATURES = [
  { slug: 'cctv-enabled-safety', span: 'md:col-span-1 md:row-span-1', text: 'A Safe & Secure Campus', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16h.01"/></svg> },
  { slug: 'smart-classrooms', span: 'md:col-span-2 md:row-span-1 bg-gradient-to-r from-white to-emerald-50', text: 'Future-Ready Learning Spaces', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="3" rx="2" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21h8"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17v4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10 8 6 4-6 4Z"/></svg> },
  { slug: 'qualified-support-staff', span: 'md:col-span-1 md:row-span-1', text: 'Dedicated Support Team', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 21v-2a4 4 0 0 0-3-3.87"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { slug: 'special-play-area', span: 'md:col-span-1 md:row-span-1', text: 'Joyful Play Zone', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9" strokeWidth="2"/><line x1="15" x2="15.01" y1="9" y2="9" strokeWidth="2"/></svg> },
  { slug: 'advanced-labs', span: 'md:col-span-1 md:row-span-1', text: 'Experiential Learning Labs', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 2v7.31L2 20.5A2 2 0 0 0 3.5 24h17a2 2 0 0 0 1.5-3.5L14 9.31V2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 2h7"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 9.31V6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9.31V6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 14h12"/></svg> },
  { slug: 'multi-sports-play-area', span: 'md:col-span-2 md:row-span-1', text: "Champions' Arena", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 22h16"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14.66V17c0 1.1-.9 2-2 2H4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 14.66V17c0 1.1.9 2 2 2h4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 4c0 3-2 5.5-5 5.5h-2c-3 0-5-2.5-5-5.5V2h12z"/></svg> },
  { slug: 'safe-school-transport', span: 'md:col-span-1 md:row-span-1', text: 'Safe School Transport', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6v6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 6v6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h19.6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2" strokeWidth="2"/><circle cx="17" cy="18" r="2" strokeWidth="2"/></svg> },
  { slug: 'healthy-dining-spaces', span: 'md:col-span-1 md:row-span-1', text: 'Healthy Dining Spaces', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 3v8a4 4 0 0 0 4 4v6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 3v18"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 3v8a5 5 0 0 0 5 5h1V3"/></svg> }
];

const FALLBACK_LEADERS = [
  { name: 'Dr. Najeeb Mohamad', role: 'Director', detail: 'MSc, MA, B.Ed, CIDTT, SET' },
  { name: 'Sajidha Razack', role: 'Principal in Charge', detail: 'Senior Secondary Section' },
  { name: 'Fareeda E Mohammed', role: 'Junior Principal', detail: 'Middle Section' },
  { name: 'Ravya K R', role: 'Junior Principal', detail: 'Secondary Section' },
  { name: 'Saleena Kader', role: 'Junior Principal', detail: 'Primary Section' },
  { name: 'Babitha KN', role: 'Junior Principal', detail: 'Sprouts' }
];

function AnimatedSection({ children, className = "", ...props }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`} {...props}>
      {children}
    </div>
  );
}

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(current);
          }
        }, 20);
        observer.unobserve(entry.target);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const getContentYear = item => getDisplayYear(item.date, 'Sports');

function VerticalCarousel({ images, onImageClick }) {
  const [index, setIndex] = useState(0);
  const validImages = (images || []).filter(img => img && img.trim() !== '');

  useEffect(() => {
    if (validImages.length <= 1) return;
    const timer = setInterval(() => setIndex(prev => (prev + 1) % validImages.length), 4000);
    return () => clearInterval(timer);
  }, [validImages.length]);

  if (validImages.length === 0) return <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">Media Pending</div>;

  return (
    <div className="relative w-full h-full bg-slate-900 group">
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={validImages[index]}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity"
          loading="lazy"
          decoding="async"
          onClick={() => onImageClick(validImages[index])}
        />
      </AnimatePresence>
      {validImages.length > 1 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          {validImages.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-all shadow-md ${i === index ? 'bg-amber-400 scale-125' : 'bg-white/50 hover:bg-white/80'}`} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function VisionMissionLoop({ vision, mission }) {
  const [showVision, setShowVision] = useState(true);
  useEffect(() => {
    const timer = setInterval(() => setShowVision(prev => !prev), 5000);
    return () => clearInterval(timer);
  }, []);
  const panelClassName = "absolute inset-0 flex flex-col justify-center";
  return (
    <div className="relative w-full h-[22rem] sm:h-64 overflow-hidden">
      <AnimatePresence mode="wait">
        {showVision ? (
          <motion.div key="vision" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={panelClassName}>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">Our Vision</h3>
            <p className="text-emerald-50/80 text-base sm:text-xl leading-relaxed font-light border-l-4 border-amber-400 pl-4 sm:pl-6 whitespace-pre-wrap">{vision}</p>
          </motion.div>
        ) : (
          <motion.div key="mission" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={panelClassName}>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">Our Mission</h3>
            <p className="text-emerald-50/80 text-base sm:text-lg leading-relaxed font-light border-l-4 border-amber-400 pl-4 sm:pl-6 whitespace-pre-wrap">{mission}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LeadershipProfile({ profile, reverse = false }) {
  const imageUrl = profile.imageUrl || '';
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className={`grid overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl lg:grid-cols-[18rem_1fr] ${reverse ? 'lg:grid-cols-[1fr_18rem]' : ''}`}
    >
      <div className={`relative min-h-[20rem] bg-emerald-950 ${reverse ? 'lg:order-2' : ''}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={profile.name}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: reverse ? '75% center' : 'center' }}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-950 text-emerald-100">
            <svg className="h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" /></svg>
          </div>
        )}
        <div className={`pointer-events-none absolute inset-y-0 hidden w-8 lg:block ${reverse ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'} from-white/55 via-white/20 to-white/0`} />
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-600">{profile.role}</p>
        <h3 className="mt-2 text-3xl font-extrabold text-emerald-950">{profile.name}</h3>
        {profile.qualifications && <p className="mt-2 font-bold text-amber-600">{profile.qualifications}</p>}
        {profile.message ? (
          <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-slate-600 sm:text-lg lg:text-base xl:text-lg">{profile.message}</p>
        ) : (
          <p className="mt-6 text-base leading-relaxed text-slate-500">A message from this office will be updated soon.</p>
        )}
      </div>
    </motion.article>
  );
}

function JuniorPrincipalTile({ leader, index }) {
  const qualification = leader.qualification || leader.qualifications || '';
  const role = leader.role || 'Junior Principal';
  const section = leader.section || leader.detail || '';
  const frameShape = {
    clipPath: 'polygon(0 0, calc(100% - 1.35rem) 0, 100% 1.35rem, 100% 100%, 1.35rem 100%, 0 calc(100% - 1.35rem))'
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.32) }}
      className="group overflow-hidden border border-emerald-100 bg-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={frameShape}
    >
      <div className="flex h-full flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-emerald-950">
          {leader.imageUrl ? (
            <img src={leader.imageUrl} alt={leader.name} className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-950 text-emerald-100">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" /></svg>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
          <p className="font-sans text-sm font-semibold normal-case leading-snug tracking-normal text-emerald-700">{role}</p>
          <h4 className="mt-2 text-xl font-extrabold leading-tight text-emerald-950">{leader.name}</h4>
          {qualification && <p className="mt-2 text-sm font-bold leading-snug text-amber-600">{qualification}</p>}
          {section && <p className="mt-2 text-sm font-bold text-slate-600">{section}</p>}
        </div>
      </div>
    </motion.article>
  );
}

function getJuniorPrincipalGridClass(count) {
  return count === 7
    ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-8'
    : 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5';
}

function getJuniorPrincipalItemClass(count, index) {
  if (count !== 7) return '';

  const centeredSecondRow = {
    4: 'lg:col-start-2',
    5: 'lg:col-start-4',
    6: 'lg:col-start-6'
  };

  return `lg:col-span-2 ${centeredSecondRow[index] || ''}`;
}

export default function Home() {
  const settings = useSettings();
  const [lightboxImage, setLightboxImage] = useState(null);
  const sportsAchievementsRef = useRef(null);
  const { data: leadershipData } = useContentCollection('leadership', 'order', 'asc', { firestoreOnly: true });
  const { data: updates } = useContentCollection('updates', null, 'desc', { limit: 18 });
  const { data: sportsAchievements } = useContentCollection('sportsAchievements', null, 'desc', { limit: 8 });
  const { data: learningFeatures } = useContentCollection('learningFeatures', null, 'asc', { sheetsOnly: true });

  const publishedUpdates = updates
    .filter(item => item.published !== false)
    .sort(compareContentNewestFirst);
  const homeNews = publishedUpdates.filter(item => item.category === 'News' || !item.category).slice(0, 3);
  const homeEvents = publishedUpdates.filter(item => item.category === 'Events').slice(0, 3);
  const homeSportsAchievements = sportsAchievements
    .filter(item => item.published !== false)
    .sort(compareContentNewestFirst)
    .slice(0, 8);
  const displayLearningFeatures = FALLBACK_FEATURES.map(feature => {
    const saved = learningFeatures.find(item => item.slug === feature.slug && item.published !== false);
    return saved?.title ? { ...feature, text: saved.title } : feature;
  });
  const activeLeaders = leadershipData.length ? leadershipData.filter(l => l.published !== false) : FALLBACK_LEADERS;
  const legacyDirector = activeLeaders.find(leader => (leader.role || '').toLowerCase().includes('director')) || FALLBACK_LEADERS[0];
  const legacyPrincipal = activeLeaders.find(leader => (leader.role || '').toLowerCase().includes('principal') && !(leader.role || '').toLowerCase().includes('junior')) || FALLBACK_LEADERS[1];
  const directorProfile = {
    name: settings?.directorName || legacyDirector.name,
    qualifications: settings?.directorQualifications || legacyDirector.qualification || legacyDirector.detail,
    role: settings?.directorRole || legacyDirector.role || 'Director',
    imageUrl: settings?.directorImageUrl || legacyDirector.imageUrl,
    message: settings?.directorMessage || ''
  };
  const principalProfile = {
    name: settings?.principalName || legacyPrincipal.name,
    qualifications: settings?.principalQualifications || legacyPrincipal.qualification || legacyPrincipal.detail,
    role: settings?.principalRole || legacyPrincipal.role || 'Principal',
    imageUrl: settings?.principalImageUrl || legacyPrincipal.imageUrl,
    message: settings?.principalMessage || ''
  };
  const juniorPrincipals = Array.isArray(settings?.juniorPrincipals) && settings.juniorPrincipals.length
    ? settings.juniorPrincipals.filter(leader => leader.name || leader.imageUrl || leader.section || leader.qualification || leader.qualifications)
    : activeLeaders
        .filter(leader => (leader.role || '').toLowerCase().includes('junior'))
        .map(leader => ({ name: leader.name, qualification: leader.qualification || '', section: leader.detail || leader.role, imageUrl: leader.imageUrl }));
  const canScrollSportsAchievements = homeSportsAchievements.length > 1;

  const scrollSportsAchievements = (direction) => {
    const container = sportsAchievementsRef.current;
    if (!container) return;
    const firstCard = container.firstElementChild;
    const cardWidth = firstCard?.getBoundingClientRect().width || 288;
    const gap = Number.parseFloat(window.getComputedStyle(container).columnGap) || 20;
    const distance = cardWidth + gap;
    container.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  return (
    <Layout isHome={true}>
      <NoticePopup />
      <DeferredSchoolChatbot />
      <Hero 
        title="Ansar English School – CBSE School in Thrissur"
        subtitle="A NABET-accredited CBSE Senior Secondary School in Perumpilavu, Thrissur, nurturing curious learners, ethical leaders, and responsible global citizens."
        imageUrl="/home-hero-640.webp"
        imageSrcSet="/home-hero-320.webp 320w, /home-hero-640.webp 640w"
        imageAvifSrcSet="/home-hero-320.avif 320w, /home-hero-640.avif 640w"
      />

      <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20 max-w-6xl mx-auto -mt-12 px-4 sm:px-0">
        <div className="p-10 text-center bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 border-b-4 border-b-amber-400 transform hover:-translate-y-2 transition-transform duration-500">
          <strong className="block text-5xl font-extrabold text-emerald-950 mb-2"><AnimatedCounter target={270} suffix="+" /></strong>
          <span className="text-slate-500 font-bold tracking-widest uppercase text-xs">Experienced Staff</span>
        </div>
        <div className="p-10 text-center bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 border-b-4 border-b-amber-400 transform hover:-translate-y-2 transition-transform duration-500 delay-100">
          <strong className="block text-5xl font-extrabold text-emerald-950 mb-2"><AnimatedCounter target={42} /></strong>
          <span className="text-slate-500 font-bold tracking-widest uppercase text-xs">Successful Years</span>
        </div>
        <div className="p-10 text-center bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 border-b-4 border-b-amber-400 transform hover:-translate-y-2 transition-transform duration-500 delay-200">
          <strong className="block text-5xl font-extrabold text-emerald-950 mb-2"><AnimatedCounter target={5000} suffix="+" /></strong>
          <span className="text-slate-500 font-bold tracking-widest uppercase text-xs">Students Enrolled</span>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
        <div className="flex flex-col justify-center">
          <div className="inline-block w-16 h-1.5 bg-amber-400 rounded-full mb-6"></div>
          <p className="text-emerald-600 font-black uppercase tracking-widest text-sm mb-3">About us</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-950 mb-6 leading-tight">Welcome to Ansar English School Perumpilavu</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">Founded by Ansari Charitable Trust, Ansar English School is a CBSE-affiliated institution focused on academic growth, inclusive learning, and values-led leadership.</p>
        </div>
        <div className="relative h-[400px] lg:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl">
           <VerticalCarousel images={settings?.premisesImages || []} onImageClick={setLightboxImage} />
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
        <div className="bg-emerald-950 p-8 sm:p-12 md:p-16 rounded-[2.5rem] shadow-2xl text-white flex flex-col justify-center relative overflow-hidden group order-2 lg:order-1">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-amber-500/20 transition-colors duration-700"></div>
          <VisionMissionLoop vision={settings?.visionText} mission={settings?.missionText} />
        </div>
        <div className="relative h-[400px] lg:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl order-1 lg:order-2">
           <VerticalCarousel images={settings?.kgImages || []} onImageClick={setLightboxImage} />
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-[2.5rem] p-10 lg:p-16 shadow-sm border border-emerald-100 flex flex-col md:flex-row items-center gap-10">
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl lg:text-4xl font-extrabold text-emerald-950 mb-4 leading-tight">{settings?.sustainabilityTitle || 'Year of Sustainability 2026–2027'}</h3>
            <p className="text-lg text-slate-700 leading-relaxed">{settings?.sustainabilityDesc || 'At our school, the Year of Sustainability is dedicated to nurturing environmentally responsible and socially conscious learners. Through awareness, action, and innovation, we encourage students to embrace sustainable practices and become active contributors to a greener future.'}</p>
         </div>
         {settings?.sustainabilityLogoUrl && (
           <div className="w-48 h-48 lg:w-64 lg:h-64 flex-shrink-0 bg-white p-4 rounded-3xl shadow-lg border border-slate-100">
             <img src={settings.sustainabilityLogoUrl} className="w-full h-full object-contain" alt="Sustainability Logo" loading="lazy" decoding="async" />
           </div>
         )}
      </AnimatedSection>

      <AnimatedSection className="mt-32" id="student-centric-learning">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-black uppercase tracking-widest text-sm mb-3">Campus Infrastructure</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-950">Student-Centric Learning</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[160px]">
          {displayLearningFeatures.map((feature, i) => (
            <Link key={feature.slug || i} to={`/learning/${feature.slug}`} className={`${feature.span || 'col-span-1'} ${feature.span?.includes('bg-') ? '' : 'bg-white'} p-8 rounded-[2rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-center focus:outline-none focus:ring-4 focus:ring-emerald-200`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:bg-amber-50 transition-colors duration-500"></div>
              <div className="w-14 h-14 bg-emerald-100/50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-white transition-all duration-500 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-emerald-950 leading-snug">{feature.text}</h3>
            </Link>
          ))}
        </div>
      </AnimatedSection>

      <AchievementsTicker />

      {homeSportsAchievements.length > 0 && (
        <AnimatedSection className="mt-24">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-emerald-600 font-black uppercase tracking-widest text-sm mb-3">Sports Achievements</p>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-950">Champions in Motion</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/sports-page#sports-achievements" className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-800">
                View Sports Achievements
              </Link>
              {canScrollSportsAchievements && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollSportsAchievements(-1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm transition-colors hover:bg-emerald-700"
                    aria-label="Previous sports achievement"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 18 9 12l6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollSportsAchievements(1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm transition-colors hover:bg-emerald-700"
                    aria-label="Next sports achievement"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div ref={sportsAchievementsRef} className="achievement-ticker-scroll flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto scroll-smooth pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {homeSportsAchievements.map((item, index) => {
              const imageUrl = item.thumbnailUrl || item.imageUrl || item.imageUrls?.[0];
              return (
                <Link key={item.id} to={`/sports-achievements/${item.id}`} className="group block w-72 flex-none snap-start overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:w-80">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M18 4c0 3-2 5.5-5 5.5h-2C8 9.5 6 7 6 4V2h12z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-amber-600">{getContentYear(item)}</p>
                    <h3 className="mt-2 line-clamp-2 text-lg font-extrabold text-slate-900 group-hover:text-emerald-700">{item.title}</h3>
                    {item.studentName && !isYearOnly(item.studentName) && <p className="mt-2 line-clamp-1 text-sm font-bold text-slate-500">{item.studentName}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </AnimatedSection>
      )}

      <AnimatedSection className="mt-32">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-black uppercase tracking-widest text-sm mb-3">Updates</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-950">Latest News</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {homeNews.length ? homeNews.map((item, index) => (
            <NewsCard key={item.id} id={item.id} title={item.title} excerpt={item.excerpt || item.description || item.content} date={item.date} thumbnailUrl={item.thumbnailUrl} coverImageUrl={item.coverImageUrl} imageUrl={item.image || item.imageUrl} type={item.category ? item.category.toLowerCase() : 'news'} priority={index === 0} />
          )) : <p className="col-span-full text-center text-slate-500">Latest news will appear here once published.</p>}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-20">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-black uppercase tracking-widest text-sm mb-3">Calendar</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-950">Events</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {homeEvents.length ? homeEvents.map((item, index) => (
            <NewsCard key={item.id} id={item.id} title={item.title} excerpt={item.description || item.excerpt || item.content} date={item.date} thumbnailUrl={item.thumbnailUrl} coverImageUrl={item.coverImageUrl} imageUrl={item.eventImages?.[0] || item.imageUrls?.[0] || item.imageUrl} type="events" priority={index === 0} />
          )) : <p className="col-span-full text-center text-slate-500">Events will appear here once scheduled.</p>}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-32">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Location</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">Explore Our Campus</h2>
        </div>
        <div className="w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-200">
          <iframe
            title="Ansar English School Satellite Map"
            src="https://maps.google.com/maps?q=Ansar%20English%20School,%20Perumpilavu&t=k&z=17&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-32 mb-16 scroll-mt-28" id="leadership">
        <div className="mb-12 text-center lg:text-left">
          <p className="text-emerald-600 font-black uppercase tracking-widest text-sm mb-3">Leadership</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-950">Guiding visionaries behind our success</h2>
        </div>
        <div className="space-y-8">
          <LeadershipProfile profile={directorProfile} />
          <LeadershipProfile profile={principalProfile} reverse />
          {juniorPrincipals.length > 0 && (
            <div className="pt-8">
              <h3 className="mb-8 text-center text-3xl font-extrabold text-emerald-950">Junior Principals</h3>
              <div className={getJuniorPrincipalGridClass(juniorPrincipals.length)}>
                {juniorPrincipals.map((leader, index) => (
                  <div key={`${leader.name || 'junior'}-${index}`} className={getJuniorPrincipalItemClass(juniorPrincipals.length, index)}>
                    <JuniorPrincipalTile leader={leader} index={index} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AnimatedSection>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50 bg-white/10 rounded-full backdrop-blur-sm transition-colors"
              onClick={() => setLightboxImage(null)}
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={lightboxImage}
              alt="Fullscreen View"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
