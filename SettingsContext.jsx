import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-init';
import { DEFAULT_ACADEMICS_PAGE, DEFAULT_ACADEMIC_SECTIONS, DEFAULT_SPORTS_PAGE, mergeListWithDefaults } from './contentDefaults';
import { DEFAULT_TRUST_MEMBERS } from './trustMembers';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

const DEFAULT_DIRECTOR_MESSAGE = `Welcome to Ansar English School, Perumpilavu. Education is the most powerful tool for shaping the future of individuals and society. At Ansar English School, we are committed to providing quality education that nurtures academic excellence, moral values, creativity, and leadership. Our goal is to empower students to become responsible citizens who contribute positively to the world around them.
We believe that true education goes beyond textbooks. Through a holistic approach to learning, we encourage our students to develop critical thinking, confidence, compassion, and a lifelong passion for learning. The dedication of our teachers, the support of our parents, and the enthusiasm of our students continue to drive our success.
As you explore this website, I invite you to learn more about our vision, achievements, and the vibrant learning community that makes Ansar English School a centre of excellence.
Director
Ansar English School, Perumpilavu`;

const DEFAULT_PRINCIPAL_MESSAGE = `Welcome to Ansar English School, Perumpilavu.
At Ansar English School, we are committed to providing a nurturing and inclusive learning environment that promotes academic excellence, character development, and lifelong learning. We strive to empower our students with knowledge, skills, values, and confidence to face the challenges of an ever-changing world.
Our dedicated teachers, supportive parents, and enthusiastic students work together to create a vibrant school community where every child is encouraged to discover and develop their unique potential.
This website offers a glimpse into our academic programs, achievements, and activities. We invite you to explore and be a part of our journey towards excellence.
Ms. Sajidha Razak
Principal
Ansar English School, Perumpilavu`;

const DEFAULT_FEE_STRUCTURE_URL = 'https://drive.google.com/file/d/1BlRQIlD4U4RjRGvVIq2Kah4xYxNjChoa/view?usp=drive_link';
const DEFAULT_PODCAST_URL = 'https://www.youtube.com/channel/UCINzivjyBDxX2O8vzGpUOCg/';
const DEFAULT_EVENT_COUNTDOWNS = [{ id: 'vision-2030-launch', title: 'Official Launch & Inauguration of VISION 2030!', dateTime: '2026-08-29T09:30', enabled: true }];

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    heroTitle: 'Empowering Minds, Enriching Futures',
    logoUrl: 'https://i.ibb.co/7d4mTQVT/image.png',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
    twitterUrl: 'https://twitter.com',
    whatsappChannelUrl: '',
    podcastUrl: DEFAULT_PODCAST_URL,
    premisesImages: [''],
    kgImages: [''],
    visionText: 'To empower students with academic rigor, skill and ethical leadership to serve society.',
    missionText: '1. Provide an inclusive learning environment that ensures sustained academic growth.\n2. To empower students with skills, values and character, enabling them to make meaningful contributions to the society.\n3. Conduct various programmes that will empower the students with 21st century skills.',
    directorName: 'Dr. Najeeb Mohamad',
    directorQualifications: 'MSc, MA, B.Ed, CIDTT, SET',
    directorRole: 'Director',
    directorImageUrl: '',
    directorMessage: DEFAULT_DIRECTOR_MESSAGE,
    principalName: 'Ms. Sajidha Razak',
    principalQualifications: '',
    principalRole: 'Principal',
    principalImageUrl: '',
    principalMessage: DEFAULT_PRINCIPAL_MESSAGE,
    juniorPrincipals: [
      { name: 'Fareeda E Mohammed', qualification: 'MA, B.Ed', role: 'Vice Principal Junior Section', section: '', imageUrl: '' },
      { name: 'Ravya K R', qualification: '', section: 'Secondary Section', imageUrl: '' },
      { name: 'Saleena Kader', qualification: '', section: 'Primary Section', imageUrl: '' },
      { name: 'Babitha KN', qualification: '', section: 'Sprouts', imageUrl: '' }
    ],
    trustMembers: DEFAULT_TRUST_MEMBERS,
    mandatoryDisclosureTitle: 'Mandatory Public Disclosure',
    mandatoryDisclosureSections: [
      'General Information',
      'Infrastructure',
      'Academics',
      'Staff Details',
      'Documents',
      'Others'
    ],
    sustainabilityTitle: 'Year of Sustainability 2026–2027',
    feeStructureTitle: 'Fee Structure 2026 - 2027',
    feeStructurePdfUrl: DEFAULT_FEE_STRUCTURE_URL,
    sustainabilityDesc: 'At our school, the Year of Sustainability is dedicated to nurturing environmentally responsible and socially conscious learners. Through awareness, action, and innovation, we encourage students to embrace sustainable practices and become active contributors to a greener future.',
    sustainabilityLogoUrl: '',
    eventCountdowns: DEFAULT_EVENT_COUNTDOWNS,
    sportsPageTitle: DEFAULT_SPORTS_PAGE.title,
    sportsPageDescription: DEFAULT_SPORTS_PAGE.description,
    sportsItems: DEFAULT_SPORTS_PAGE.items,
    academicSections: DEFAULT_ACADEMIC_SECTIONS,
    academicsPage: DEFAULT_ACADEMICS_PAGE,
    _isLoaded: false
  });

  // Hydrate from Firestore once the connection is ready, but never block the
  // initial render on it. Defaults are already present in state, so the homepage
  // can paint immediately even on a slow/flaky mobile session or before the first
  // snapshot arrives.
  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'global'),
      (docSnap) => {
        if (cancelled) return;
        if (docSnap.exists()) {
          const saved = docSnap.data();
          setSettings((prev) => ({
            ...prev,
            ...saved,
            feeStructureTitle: saved.feeStructureTitle || prev.feeStructureTitle,
            feeStructurePdfUrl: saved.feeStructurePdfUrl || prev.feeStructurePdfUrl,
            sportsPageTitle: saved.sportsPageTitle || prev.sportsPageTitle,
            sportsPageDescription: saved.sportsPageDescription || prev.sportsPageDescription,
            sportsItems: mergeListWithDefaults(saved.sportsItems, DEFAULT_SPORTS_PAGE.items),
            academicSections: mergeListWithDefaults(saved.academicSections, DEFAULT_ACADEMIC_SECTIONS),
            academicsPage: {
              ...DEFAULT_ACADEMICS_PAGE,
              ...(saved.academicsPage || {}),
              beyondItems: mergeListWithDefaults(saved.academicsPage?.beyondItems, DEFAULT_ACADEMICS_PAGE.beyondItems),
            },
            _isLoaded: true,
          }));
        } else {
          setSettings((prev) => ({ ...prev, _isLoaded: true }));
        }
      },
      // Firestore errors must never keep the homepage blank. The UI keeps the
      // last known/default settings and continues to render normally.
      (error) => {
        console.warn('Settings snapshot failed; continuing with cached defaults.', error);
        if (!cancelled) {
          setSettings((prev) => ({ ...prev, _isLoaded: true }));
        }
      }
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
