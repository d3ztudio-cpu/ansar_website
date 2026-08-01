import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate, useLocation, Link } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase-init';
import { useContentCollection } from './useContentCollection';

import Layout from './Layout';
import AdminLayout from './AdminLayout';
import Home from './Home';
import About from './About';
import Academics from './Academics';
import Admission from './Admission';
import News from './News';
import Events from './Events';
import Achievements from './Achievements';
import AnsarTimes from './AnsarTimes';
import Staff from './Staff';
import Contact from './Contact';
import Gallery from './Gallery';
import AdminUpdates from './AdminUpdates';
import AdminEvents from './AdminEvents';
import AdminAchievements from './AdminAchievements';
import AdminAnsarTimes from './AdminAnsarTimes';
import AdminGallery from './AdminGallery';
import AdminSportsAchievements from './AdminSportsAchievements';
import AdminLearningFeatures from './AdminLearningFeatures';
import AdminLifeAtAnsar from './AdminLifeAtAnsar';
import AdminLearningLabs from './AdminLearningLabs';
import AdminAnsarSprouts from './AdminAnsarSprouts';
import AdminFieldTrips from './AdminFieldTrips';
import AdminLeadership from './AdminLeadership';
import AdminNotices from './AdminNotices';
import AdminAcademics from './AdminAcademics';
import ArticleView from './ArticleView';
import AdminSettings from './AdminSettings';
import AdminPublicDisclosure from './AdminPublicDisclosure';
import MandatoryDisclosure from './MandatoryDisclosure';
import SopPage, { SchoolPoliciesPage } from './SopPage';
import ContentPageLayout from './ContentPageLayout';
import LifeAtAnsar from './LifeAtAnsar';
import AnsarSprouts from './AnsarSprouts';
import SproutsActivityArticle from './SproutsActivityArticle';
import FieldTrips from './FieldTrips';
import AtlPage from './AtlPage';
import AdminAtl from './AdminAtl';
import LibraryPage from './LibraryPage';
import AdminLibrary from './AdminLibrary';
import AdminQuizCorner from './AdminQuizCorner';
import QuizCorner from './QuizCorner';
import LearningLabsSection from './LearningLabsSection';
import { SettingsProvider, useSettings } from './SettingsContext';
import { DEFAULT_SPORTS_PAGE, mergeListWithDefaults } from './contentDefaults';
import { compareContentNewestFirst, formatDisplayDate, getDisplayYear, isYearOnly } from './dateUtils';
import { applySeoMetadata, createMetaDescription } from './seoUtils';
import { LEARNING_FEATURES_DOCUMENT_CONTENT } from './learningFeaturesDocumentContent';

// --- AUTHORIZED ADMIN EMAILS ---
const ADMIN_EMAILS = [
  'd3ztudio@gmail.com',
  'ansarmedia@ansarschool.in',
  'shafeeqpulikkal32@gmail.com',
  'ansarschooloffice@gmail.com'
];
const SPROUTS_ADMIN_EMAIL = 'sprouts@ansar.in';

const DEFAULT_SEO = {
  title: 'Best CBSE School in Thrissur, Kerala | Ansar English School',
  description: 'Ansar English School, Perumpilavu is a leading CBSE Senior Secondary School in Thrissur, Kerala with NABET accreditation, 42+ years of excellence, modern facilities, and value-based education.',
  keywords: 'best CBSE school in Thrissur, CBSE school Thrissur Kerala, Ansar English School, CBSE school Perumpilavu, top school in Thrissur, senior secondary school Kerala'
};

const ROUTE_SEO = {
  '/': DEFAULT_SEO,
  '/about': {
    title: 'About Ansar English School | CBSE School in Thrissur',
    description: 'Learn about Ansar English School, a NABET accredited CBSE Senior Secondary School in Perumpilavu, Thrissur with a legacy of academic excellence and value-based education.',
    keywords: 'about Ansar English School, NABET accredited school Thrissur, CBSE Senior Secondary School Thrissur'
  },
  '/academics': {
    title: 'CBSE Academics in Thrissur | Ansar English School',
    description: 'Explore the CBSE curriculum, smart classrooms, labs, enrichment programmes, and academic pathway at Ansar English School, Perumpilavu, Thrissur.',
    keywords: 'CBSE curriculum Thrissur, CBSE academics Kerala, Ansar English School academics'
  },
  '/admission': {
    title: 'CBSE School Admission in Thrissur | Ansar English School',
    description: 'Apply for admission to Ansar English School, Perumpilavu, a leading CBSE school in Thrissur, Kerala with strong academics, facilities, and student care.',
    keywords: 'CBSE school admission Thrissur, school admission Perumpilavu, Ansar English School admission'
  },
  '/contact': {
    title: 'Contact Ansar English School | Perumpilavu, Thrissur',
    description: 'Contact Ansar English School, Perumpilavu, Karikkad P.O, Thrissur, Kerala for admission queries, campus location, phone, email, and school office support.',
    keywords: 'Ansar English School contact, CBSE school Perumpilavu address, school in Thrissur phone'
  },
  '/field-trips': {
    title: 'Field Trips | Learning Beyond the Classroom',
    description: 'Explore educational visits and field trips across Ansar Sprouts, Primary, Middle, Secondary, and Senior Secondary sections.',
    keywords: 'Ansar field trips, educational visits, learning beyond classroom, school trips Thrissur'
  },
  '/gallery': {
    title: 'Campus Gallery | Ansar English School Thrissur',
    description: 'View photos and campus moments from Ansar English School, a CBSE Senior Secondary School in Perumpilavu, Thrissur, Kerala.',
    keywords: 'Ansar English School gallery, CBSE school campus Thrissur, Perumpilavu school photos'
  },
  '/news': {
    title: 'School News | Ansar English School Thrissur',
    description: 'Latest news, announcements, achievements, and updates from Ansar English School, Perumpilavu, Thrissur.',
    keywords: 'Ansar English School news, Thrissur school updates, CBSE school news Kerala'
  },
  '/events': {
    title: 'School Events | Ansar English School Thrissur',
    description: 'Explore school events, celebrations, competitions, and activities at Ansar English School, Perumpilavu, Thrissur.',
    keywords: 'Ansar English School events, CBSE school events Thrissur, Perumpilavu school activities'
  },
  '/achievements': {
    title: 'Achievements | Ansar English School Thrissur',
    description: 'Student achievements, academic honours, competitions, and milestones from Ansar English School, Perumpilavu, Thrissur.',
    keywords: 'Ansar English School achievements, CBSE school achievements Thrissur, student achievements Kerala'
  },
  '/atl': {
    title: 'Atal Tinkering Lab | Ansar English School Thrissur',
    description: 'Explore the Atal Tinkering Lab at Ansar English School, where students develop STEM skills through innovation, prototyping, and hands-on problem solving.',
    keywords: 'Atal Tinkering Lab Thrissur, ATL Ansar English School, student innovation lab Kerala'
  },
  '/library': {
    title: 'Library | Ansar English School, Perumpilavu',
    description: 'Explore library events, reading activities, new arrivals, publications, and learning resources from Ansar English School, Perumpilavu.',
    keywords: 'Ansar English School Library, school library Perumpilavu, reading activities Thrissur, new books school library'
  },
  '/sports-page': {
    title: 'Sports and Athletics | Ansar English School Thrissur',
    description: 'Explore sports programmes, athletics, team achievements, training, and student highlights at Ansar English School, Perumpilavu.',
    keywords: 'school sports Thrissur, Ansar English School athletics, student sports achievements Kerala'
  },
  '/ansar-times': {
    title: 'Ansar Times School Magazine | Ansar English School',
    description: 'Read Ansar Times magazines, newsletters, student contributions, and school stories from Ansar English School.',
    keywords: 'Ansar Times, Ansar English School magazine, school newsletter Thrissur'
  },
  '/ansar-family': {
    title: 'Our Faculty | Ansar Family | Ansar English School',
    description: 'Meet the leadership, counsellors, teaching faculty, and physical education staff of Ansar English School for the academic year 2026–27.',
    keywords: 'Ansar English School faculty, Ansar Family, teachers Perumpilavu, CBSE school staff Thrissur'
  },
  '/ansar-sprouts': {
    title: 'Ansar Sprouts Early Learning | Ansar English School',
    description: 'Discover the caring, play-based early learning programme at Ansar Sprouts in Perumpilavu, Thrissur.',
    keywords: 'Ansar Sprouts, preschool Perumpilavu, early learning Thrissur'
  },
  '/extension-services': {
    title: 'Extension Services | Ansar English School',
    description: 'Learn about community outreach, service learning, awareness programmes, and student volunteering at Ansar English School.',
    keywords: 'school community outreach Thrissur, student service learning, Ansar English School extension services'
  },
  '/life-at-ansar': {
    title: 'Life at Ansar | Student Life and Campus Activities',
    description: 'Explore clubs, celebrations, campus routines, arts, sports, and student life at Ansar English School.',
    keywords: 'student life Ansar English School, school clubs Thrissur, campus activities Perumpilavu'
  },
  '/alumni': {
    title: 'Ansar Alumni | Ansar English School',
    description: 'Connect with the Ansar English School alumni community and explore alumni stories, achievements, mentorship, and events.',
    keywords: 'Ansar English School alumni, Ansar alumni community, school alumni Thrissur'
  },
  '/sop': {
    title: 'Standard Operating Procedures | Ansar English School',
    description: 'View approved academic, administrative, safety, and student-support standard operating procedures at Ansar English School.',
    keywords: 'Ansar English School SOP, standard operating procedures, school operational procedures'
  },
  '/school-policies': {
    title: 'AES School Policies | Ansar English School',
    description: 'View safeguarding, academic, staff, student-life, and governance policies followed at Ansar English School.',
    keywords: 'Ansar English School policies, AES policies, school policy documents'
  },
  '/ansar-media-production': {
    title: 'Ansar Media Productions | Ansar English School',
    description: 'Explore photography, videography, podcasting, design, and student media production at Ansar English School.',
    keywords: 'Ansar Media Productions, school media team Thrissur, student photography videography'
  },
  '/mandatory-public-disclosure': {
    title: 'Mandatory Public Disclosure | Ansar English School',
    description: 'CBSE mandatory public disclosure documents and official school information for Ansar English School, Perumpilavu, Thrissur.',
    keywords: 'CBSE mandatory public disclosure Ansar English School, school disclosure Thrissur'
  }
};

function getSeoForPath(pathname) {
  if (pathname === '/staff' || pathname.startsWith('/staff/')) {
    return {
      ...DEFAULT_SEO,
      title: 'Page Moved | Ansar English School',
      description: 'This page has moved to the official Ansar English School website.',
      noIndex: true
    };
  }
  if (pathname.startsWith('/admin')) {
    return {
      ...DEFAULT_SEO,
      title: 'Admin Portal | Ansar English School',
      description: 'Authorized administration portal for Ansar English School.',
      noIndex: true
    };
  }
  if (pathname.startsWith('/news/')) return { ...ROUTE_SEO['/news'], noIndex: true };
  if (pathname.startsWith('/events/')) return { ...ROUTE_SEO['/events'], noIndex: true };
  if (pathname.startsWith('/achievements/')) return { ...ROUTE_SEO['/achievements'], noIndex: true };
  if (pathname.startsWith('/sports-achievements/')) return { ...ROUTE_SEO['/sports-page'], noIndex: true };
  if (pathname.startsWith('/learning/')) {
    return {
      title: 'Learning Facilities | Ansar English School Thrissur',
      description: 'Explore learning facilities, smart classrooms, labs, safety, transport, and student support at Ansar English School, Perumpilavu, Thrissur.',
      keywords: 'CBSE school facilities Thrissur, smart classrooms Thrissur, school transport Perumpilavu'
    };
  }
  return ROUTE_SEO[pathname] || {
    title: 'Ansar English School | CBSE School in Thrissur, Kerala',
    description: 'Explore Ansar English School, a CBSE Senior Secondary School in Perumpilavu, Thrissur, Kerala known for academic excellence, student care, and value-based education.',
    keywords: DEFAULT_SEO.keywords,
    noIndex: true
  };
}

function SiteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(pathname);
    applySeoMetadata({ ...seo, keywords: seo.keywords || DEFAULT_SEO.keywords }, pathname);
  }, [pathname]);

  return null;
}

const SAMPLE_PAGES = {
  'sports-page': {
    title: 'Sports',
    subtitle: 'Athletics, games, fitness, and team spirit at Ansar English School.',
    sections: ['Sports Programmes', 'Facilities', 'Training & Events', 'Student Highlights']
  },
  atl: {
    title: 'ATL',
    eyebrow: 'Innovation Lab',
    subtitle: 'Innovation, tinkering, STEM exploration, and student-led problem solving.',
    heroImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=90&w=2400&auto=format&fit=crop',
    intro: 'The Atal Tinkering Lab culture at Ansar encourages students to observe problems, build prototypes, test ideas, and learn through experimentation. It gives young learners a practical space to connect science, technology, design, and teamwork.',
    highlights: ['Hands-on STEM learning', 'Prototype-based projects', 'Student innovation challenges'],
    sections: [
      {
        title: 'Lab Overview',
        body: 'ATL activities introduce students to practical tools, model making, electronics, coding basics, robotics thinking, and design-led problem solving in a supervised learning environment.'
      },
      {
        title: 'Student Projects',
        body: 'Learners are encouraged to convert classroom concepts into working models, simple machines, digital ideas, science exhibits, and solutions inspired by real community needs.'
      },
      {
        title: 'Innovation Challenges',
        body: 'Competitions, exhibitions, brainstorming sessions, and challenge-based tasks help students develop curiosity, planning skills, collaboration, and confidence in presenting their ideas.'
      },
      {
        title: 'Learning Outcomes',
        body: 'The programme strengthens observation, experimentation, critical thinking, communication, responsible use of technology, and the courage to improve an idea through repeated trials.'
      }
    ]
  },
  'ansar-sprouts': {
    title: 'Ansar Sprouts',
    eyebrow: 'Early Years',
    subtitle: 'A joyful early learning environment for foundational growth.',
    heroImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=90&w=2400&auto=format&fit=crop',
    intro: 'Ansar Sprouts is designed for the youngest learners, where care, play, language, movement, imagination, and social confidence come together. The environment supports children as they begin school life with warmth and steady routines.',
    highlights: ['Play-based learning', 'Language and motor development', 'Caring classroom routines'],
    sections: [
      {
        title: 'Learning Approach',
        body: 'The early years programme balances guided play, stories, songs, art, number awareness, nature-based conversations, and classroom habits that prepare children for confident schooling.'
      },
      {
        title: 'Daily Activities',
        body: 'Children take part in circle time, creative work, movement games, sensory activities, picture reading, rhymes, simple conversations, and age-appropriate group tasks.'
      },
      {
        title: 'Parent Connect',
        body: 'Teachers maintain supportive communication with parents so that each child receives consistent care, encouragement, and attention across home and school.'
      },
      {
        title: 'Classroom Moments',
        body: 'The section celebrates small milestones: speaking clearly, sharing with friends, finishing a task, exploring colors and shapes, and gaining independence in everyday routines.'
      }
    ]
  },
  'extension-services': {
    title: 'Extension Services',
    eyebrow: 'Community Outreach',
    subtitle: 'Community outreach, student service, and support initiatives.',
    heroImage: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=90&w=2400&auto=format&fit=crop',
    intro: 'Extension Services connects the school community with meaningful social responsibility. Through outreach, awareness, support activities, and service learning, students understand that education also includes compassion and civic responsibility.',
    highlights: ['Service learning', 'Awareness programmes', 'Community participation'],
    sections: [
      {
        title: 'Service Areas',
        body: 'The school supports initiatives related to health awareness, environmental care, social responsibility, student volunteering, charitable drives, and community well-being.'
      },
      {
        title: 'Programmes',
        body: 'Activities may include campaigns, visits, donation drives, cleanliness initiatives, awareness talks, collaborative projects, and student-led service events.'
      },
      {
        title: 'Community Impact',
        body: 'These initiatives help students develop empathy, leadership, teamwork, gratitude, and a better understanding of the society around them.'
      },
      {
        title: 'How We Participate',
        body: 'Students participate through clubs, class groups, school events, guided volunteering, and age-appropriate outreach activities coordinated by teachers and school leadership.'
      }
    ]
  },
  'life-at-ansar': {
    title: 'Life at Ansar',
    eyebrow: 'Campus Culture',
    subtitle: 'A look into campus culture, clubs, celebrations, and student life.',
    heroImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=90&w=2400&auto=format&fit=crop',
    intro: 'Life at Ansar is shaped by learning, friendships, discipline, celebrations, creativity, faith in values, and opportunities beyond the classroom. The campus experience helps students grow as confident, responsible, and expressive individuals.',
    highlights: ['Active student life', 'Clubs and celebrations', 'Balanced campus routines'],
    sections: [
      {
        title: 'Campus Life',
        body: 'The school day brings together academics, assemblies, mentoring, sports, arts, library time, lab work, peer interaction, and structured routines that help students feel grounded.'
      },
      {
        title: 'Clubs & Activities',
        body: 'Clubs and co-curricular activities give students space to discover interests in language, science, arts, technology, environment, leadership, service, and performance.'
      },
      {
        title: 'Celebrations',
        body: 'School celebrations, special days, competitions, exhibitions, cultural programmes, and observances create shared memories while building confidence and participation.'
      },
      {
        title: 'Student Voices',
        body: 'Students are encouraged to speak, perform, lead, write, create, and contribute so that school life becomes a platform for expression as well as achievement.'
      }
    ]
  },
  'ansar-times': {
    title: 'Ansar Times',
    subtitle: 'School publications, newsletters, and featured stories.',
    sections: ['Latest Issue', 'Archives', 'Student Contributions', 'Editorial Team']
  },
  alumni: {
    title: 'Alumni',
    eyebrow: 'Ansar Community',
    subtitle: 'Stories, connections, and achievements from the Ansar alumni community.',
    heroImage: '/alumni/odyssey-alumni-group.jpg',
    intro: 'The alumni community carries the Ansar story beyond the campus. Former students remain an important part of the school family through memories, achievements, mentorship, and continued connection.',
    highlights: ['Alumni connections', 'Mentorship and memories', 'Community events'],
    sections: [
      {
        title: 'Alumni Network',
        body: 'The network helps former students stay connected with the institution, teachers, classmates, and the wider Ansar community.'
      },
      {
        title: 'Success Stories',
        body: 'Alumni achievements in higher education, professions, entrepreneurship, public service, arts, sports, and social life inspire current students to dream with purpose.'
      },
      {
        title: 'Events',
        body: 'Reunions, interactive sessions, career conversations, campus visits, and special gatherings create opportunities for alumni to return, share, and contribute.'
      },
      {
        title: 'Get Connected',
        body: 'Former students can reach out to the school office to update their details, share achievements, contribute to student guidance, or participate in alumni initiatives.'
      }
    ]
  },
  sop: {
    title: 'SOP',
    eyebrow: 'School Procedures',
    subtitle: 'Standard operating procedures and essential school guidelines.',
    heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=90&w=2400&auto=format&fit=crop',
    intro: 'The SOP page provides a clear reference for expected routines, safety practices, academic processes, communication channels, and campus protocols followed at Ansar English School.',
    highlights: ['Clear daily routines', 'Safety-first procedures', 'Academic and campus discipline'],
    sections: [
      {
        title: 'General Guidelines',
        body: 'Students are expected to follow school timings, uniform standards, attendance rules, respectful conduct, classroom discipline, and instructions issued by teachers and school authorities.'
      },
      {
        title: 'Student Safety',
        body: 'Safety procedures cover supervised movement, transport routines, visitor control, emergency readiness, first-aid support, and responsible behaviour in classrooms, corridors, labs, and playgrounds.'
      },
      {
        title: 'Academic Procedures',
        body: 'Academic routines include lesson planning, assignments, assessments, practical work, parent communication, progress review, remedial support, and examination-related instructions.'
      },
      {
        title: 'Campus Protocols',
        body: 'Campus protocols help maintain order during arrival, dispersal, assemblies, events, library use, laboratory sessions, sports activities, and interactions with school facilities.'
      }
    ]
  },
  'mandatory-public-disclosure': {
    title: 'Mandatory Public Disclosure',
    subtitle: 'Required school information and public documents.',
    sections: ['General Information', 'Documents', 'Academic Information', 'Infrastructure Details']
  },
  'ansar-media-production': {
    title: 'ANSAR MEDIA PRODUCTIONS',
    subtitle: 'An in-house media production unit documenting campus life, student achievements, institutional milestones, and creative communication at Ansar English School.',
    sections: ['Photography', 'Videography', 'Drone Videography', 'Podcast', 'Graphic Designing', 'Editing']
  }
};

const MEDIA_SERVICES = [
  {
    title: 'Photography',
    kicker: 'Moments with meaning',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=90&w=3840&auto=format&fit=crop',
    body: 'Our photography team captures the spirit of school life with clarity and care. From assemblies, celebrations, competitions, classroom activities, portraits, and official documentation, Ansar Media preserves important moments as high-quality visual records for the institution.',
  },
  {
    title: 'Videography',
    kicker: 'Stories in motion',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=90&w=3840&auto=format&fit=crop',
    body: 'We produce event films, highlight videos, awareness clips, reels, institutional presentations, and programme coverage. The unit supports departments by turning school activities into polished video stories that can be shared with parents, students, alumni, and the wider community.',
  },
  {
    title: 'Drone Videography',
    kicker: 'A wider campus view',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=90&w=3840&auto=format&fit=crop',
    body: 'Aerial visuals bring scale, movement, and a fresh perspective to campus documentation. Drone videography is used for major events, campus showcases, infrastructure highlights, outdoor activities, and special productions where a broader view helps tell the story better.',
  },
  {
    title: 'Podcast',
    kicker: 'Voices from Ansar',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=90&w=3840&auto=format&fit=crop',
    body: 'The podcast setup creates space for student conversations, interviews, academic discussions, alumni interactions, awareness programmes, and leadership messages. It gives the Ansar community a clear voice and encourages confident, thoughtful communication.',
  },
  {
    title: 'Graphic Designing',
    kicker: 'Design for every announcement',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=90&w=3840&auto=format&fit=crop',
    body: 'Our design work supports posters, event announcements, certificates, social media creatives, digital banners, brochures, identity materials, and campaign visuals. Every design is prepared to keep school communication attractive, consistent, and easy to understand.',
  },
  {
    title: 'Editing',
    kicker: 'Finishing every story',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=90&w=3840&auto=format&fit=crop',
    body: 'Editing brings together footage, sound, images, captions, color, and rhythm into a complete final output. The in-house team handles photo retouching, video cuts, event recaps, subtitles, audio cleanup, and final exports for web, social media, archives, and presentations.',
  }
];

const BASE_LEARNING_FEATURES = {
  'cctv-enabled-safety': {
    title: 'A Safe & Secure Campus',
    kicker: 'Safe campus',
    icon: 'shield',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=90&w=2400&auto=format&fit=crop',
    description: 'A monitored learning environment helps students move through the campus with confidence. Safety systems support staff supervision and create a secure setting for academic and co-curricular activity.',
    points: ['CCTV-supported campus monitoring', 'Structured supervision around key areas', 'A calm environment for focused learning']
  },
  'smart-classrooms': {
    title: 'Future-Ready Learning Spaces',
    kicker: 'Interactive learning',
    icon: 'screen',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=90&w=2400&auto=format&fit=crop',
    description: 'Roomy classrooms and smart-board support help teachers blend explanation, visual learning, discussion, and practice. The setup keeps lessons clear, engaging, and easier to follow.',
    points: ['Spacious rooms for comfortable learning', 'Smart-board enabled explanations', 'Better visual support for concepts']
  },
  'qualified-support-staff': {
    title: 'Dedicated Support Team',
    kicker: 'Care and guidance',
    icon: 'users',
    image: 'https://i.ibb.co/VYgP8bRD/Web-1.jpg',
    galleryImages: [
      'https://i.ibb.co/VYgP8bRD/Web-1.jpg',
      'https://i.ibb.co/v8t6BJs/Web-23.jpg',
      'https://i.ibb.co/YmD9Ynd/Web-25.jpg'
    ],
    description: 'A dedicated team of support staff helps create a safe, caring, organized, and welcoming school environment. Their attentive presence supports students, teachers, families, and the smooth functioning of everyday campus life.',
    body: [
      'Support staff are an essential part of the Ansar English School community. They assist students throughout the school day, help maintain clean and orderly learning spaces, support safe movement around the campus, and respond to practical needs with care and responsibility.',
      'By working closely with teachers and administrators, the team helps classrooms, offices, common areas, transport routines, events, and student services operate efficiently. Their dependable contribution allows students to learn in a comfortable environment and helps families feel confident that care extends beyond the classroom.',
      'Respect, patience, teamwork, and readiness guide their service. Every member contributes to the welcoming culture of the school and to the well-being of the children entrusted to its care.'
    ],
    points: ['Attentive student assistance throughout the school day', 'Clean, organized, and welcoming campus spaces', 'Close coordination with teachers and administrators', 'Dependable support for daily routines and school activities']
  },
  'special-play-area': {
    title: 'Joyful Play Zone',
    kicker: 'Joyful growth',
    icon: 'smile',
    image: 'https://i.ibb.co/0VdjdrpS/Web-7.jpg',
    galleryImages: [
      'https://i.ibb.co/0VdjdrpS/Web-7.jpg',
      'https://i.ibb.co/wN70YbZ0/Web-8.jpg',
      'https://i.ibb.co/Zp3985n9/Web-10.jpg',
      'https://i.ibb.co/zTF0Qj57/Web-11.jpg'
    ],
    outdoorGymTitle: 'Outdoor Gyms',
    outdoorGymDescription: 'Outdoor gym facilities provide students with an accessible space for guided exercise, fitness, strength, and healthy movement in the open air.',
    outdoorGymImageUrls: [],
    description: 'The Joyful Play Zone shown here is the dedicated KG-section outdoor park, with safe, age-appropriate equipment including swings, slides, and a merry-go-round. Other school sections also have play areas designed for their respective age groups.',
    body: [
      'Active outdoor play supports balance, coordination, physical strength, imagination, friendship, confidence, and emotional well-being. The KG play area gives Ansar Sprouts children a cheerful environment where movement and social learning happen naturally through supervised play.',
      'The play zone is planned around the needs of young children. Colourful, age-appropriate equipment encourages them to climb, slide, swing, explore, and practise new movements at a comfortable pace. These experiences strengthen gross motor skills while helping children become more confident in using their bodies.',
      'Shared play also teaches important social habits. Children learn to wait for their turn, cooperate with friends, communicate ideas, solve small problems, and care for the equipment they use. Teachers and support staff guide these routines so that freedom, enjoyment, and safety remain closely connected.',
      'Play areas for other school sections provide age-suitable opportunities for recreation, exercise, and relaxation. Together with the Outdoor Gyms, these spaces make regular movement a natural part of campus life and encourage students to develop lasting habits of fitness and well-being.'
    ],
    points: ['Dedicated outdoor park for the KG section', 'Safe swings, slides, and merry-go-round', 'Supervised play that develops confidence and cooperation', 'Age-appropriate recreation spaces for other sections', 'Outdoor fitness opportunities that support healthy habits']
  },
  'advanced-labs': {
    title: 'Experiential Learning Labs',
    kicker: 'Hands-on discovery',
    icon: 'flask',
    image: 'https://i.ibb.co/zWwgGQFX/IMG-4790.jpg',
    description: 'Purpose-built labs help students move from theory to observation, experimentation, and analysis. The learning experience becomes practical, curious, and grounded in real exploration.',
    points: ['Spaces designed for practical learning', 'Hands-on science and skill development', 'Encourages observation, testing, and inquiry']
  },
  'multi-sports-play-area': {
    title: "Champions' Arena",
    kicker: 'Fitness and teamwork',
    icon: 'trophy',
    image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=90&w=2400&auto=format&fit=crop',
    description: 'The multi-sports play area supports fitness, coordination, teamwork, and healthy competition. Students get structured opportunities to participate, practice, and build sporting spirit.',
    points: ['Space for multiple sports and activities', 'Builds stamina, teamwork, and discipline', 'Encourages regular physical participation']
  },
  'safe-school-transport': {
    title: 'Safe School Transport',
    kicker: 'Reliable travel',
    icon: 'bus',
    image: 'https://i.ibb.co/XfX9K6Yv/D3-ZTUDIO-PR0.jpg',
    galleryImages: [
      'https://i.ibb.co/XfX9K6Yv/D3-ZTUDIO-PR0.jpg',
      'https://i.ibb.co/mC8JsJD8/D3-ZTUDIO-PR0-2.jpg',
      'https://i.ibb.co/0y8kKwBz/D3-ZTUDIO-PR0-3.jpg',
      'https://i.ibb.co/fbFfzHV/D3-ZTUDIO-PR0-4.jpg'
    ],
    description: 'Safe school transport at Ansar English School provides dependable daily travel support for students across different routes. The facility is planned around safety, punctuality, care, and parent confidence.',
    body: [
      'Ansar English School operates 30+ school buses across different routes, helping students travel between home and campus in a regular, organized, and comfortable way. The transport facility is designed to make the school day easier for families while ensuring that students can reach the campus on time and return home through a dependable route system.',
      'Every bus has staff members assigned to look after students throughout the journey. Their presence helps maintain discipline, assist younger children, guide boarding and dropping routines, and support student safety from the time they enter the bus until they reach their destination. With careful coordination, route coverage, and attentive supervision, the school transport facility reflects Ansar English School\'s commitment to student care beyond the classroom.'
    ],
    points: ['30+ school buses running on different routes', 'Staff present in every bus to care for students', 'Organized travel routines for safe daily movement']
  },
  'healthy-dining-spaces': {
    title: 'Healthy Dining Spaces',
    kicker: 'Nourishing routines',
    icon: 'utensils',
    image: 'https://i.ibb.co/QFQ4DMQ8/image.png',
    description: 'Healthy dining spaces give students a clean, comfortable place to eat, refresh, and build positive food habits during the school day.',
    points: ['Clean and organized dining areas', 'Supports healthy meal routines', 'Comfortable spaces for student refreshment']
  }
};

const LEARNING_FEATURES = Object.fromEntries(Object.entries(BASE_LEARNING_FEATURES).map(([slug, feature]) => [slug, {
  ...feature,
  ...LEARNING_FEATURES_DOCUMENT_CONTENT[slug]
}]));

function LearningIcon({ name, className = 'h-8 w-8' }) {
  const shared = { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'aria-hidden': 'true' };
  const pathProps = { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '1.8' };

  switch (name) {
    case 'screen':
      return <svg {...shared}><rect width="20" height="14" x="2" y="3" rx="2" {...pathProps} /><path {...pathProps} d="M8 21h8M12 17v4m-2-9 6-4v8l-6-4Z" /></svg>;
    case 'users':
      return <svg {...shared}><path {...pathProps} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" strokeWidth="1.8" /><path {...pathProps} d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case 'laptop':
      return <svg {...shared}><path {...pathProps} d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.3 2.6a1 1 0 0 1-.9 1.4H3.6a1 1 0 0 1-.9-1.4L4 16" /></svg>;
    case 'smile':
      return <svg {...shared}><circle cx="12" cy="12" r="10" strokeWidth="1.8" /><path {...pathProps} d="M8 14s1.5 2 4 2 4-2 4-2" /><path {...pathProps} d="M9 9h.01M15 9h.01" /></svg>;
    case 'flask':
      return <svg {...shared}><path {...pathProps} d="M10 2v7.3L3 20.1A1.9 1.9 0 0 0 4.6 23h14.8a1.9 1.9 0 0 0 1.6-2.9L14 9.3V2M8.5 2h7M7 15h10" /></svg>;
    case 'trophy':
      return <svg {...shared}><path {...pathProps} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17a2 2 0 0 1-2 2H6m8-4.3V17a2 2 0 0 0 2 2h2M18 4c0 3-2 5.5-5 5.5h-2C8 9.5 6 7 6 4V2h12v2Z" /></svg>;
    case 'bus':
      return <svg {...shared}><path {...pathProps} d="M8 6v6m7-6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2s-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" /><circle cx="7" cy="18" r="2" strokeWidth="1.8" /><circle cx="17" cy="18" r="2" strokeWidth="1.8" /></svg>;
    case 'utensils':
      return <svg {...shared}><path {...pathProps} d="M4 3v8a4 4 0 0 0 4 4v6M8 3v18M14 3v8a5 5 0 0 0 5 5h1V3" /></svg>;
    default:
      return <svg {...shared}><path {...pathProps} d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7Z" /><path {...pathProps} d="M12 8v4M12 16h.01" /></svg>;
  }
}

function LearningImageCarousel({ feature }) {
  const images = feature.galleryImages?.length ? feature.galleryImages : [feature.image].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = images.length > 1;
  const currentImage = images[activeIndex] || feature.image;

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [feature.slug]);

  useEffect(() => {
    if (!hasMultipleImages) return undefined;
    const timer = window.setInterval(goToNext, 4500);
    return () => window.clearInterval(timer);
  }, [activeIndex, hasMultipleImages, images.length]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-slate-100">
        <img
          src={currentImage}
          alt={`${feature.title} facility view ${activeIndex + 1}`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-emerald-950 shadow-md ring-1 ring-black/5 transition-colors hover:bg-white"
              aria-label="Previous facility image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 18 9 12l6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-emerald-950 shadow-md ring-1 ring-black/5 transition-colors hover:bg-white"
              aria-label="Next facility image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="flex items-center justify-center gap-2 px-4 py-4">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-8 bg-emerald-700' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
              aria-label={`Show facility image ${index + 1}`}
              aria-current={activeIndex === index ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.setTimeout(() => {
      if (hash) {
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'auto' });
        return;
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 0);
  }, [pathname, hash]);

  return null;
}

function AnsarMediaProductionPage() {
  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=90&w=3840&auto=format&fit=crop"
            alt="ANSAR MEDIA PRODUCTIONS studio workspace"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-emerald-950/50" />
          <div className="relative z-10 max-w-4xl px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-amber-300">In-house Media Unit</p>
            <h1 className="text-4xl font-extrabold leading-tight lg:text-6xl">ANSAR MEDIA PRODUCTIONS</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-100/85 lg:text-xl">
              A dedicated creative unit for photography, videography, drone visuals, podcasts, graphic design, and editing at Ansar English School.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-4xl text-center">
          <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Creative documentation</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 lg:text-5xl">Capturing, creating, and sharing the Ansar story</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            ANSAR MEDIA PRODUCTIONS works as the institution's own media studio, supporting academic, cultural, social, and administrative communication with professional visual content.
          </p>
        </section>

        <section className="mt-16 space-y-16">
          {MEDIA_SERVICES.map((service, index) => {
            const reverse = index % 2 === 1;
            return (
              <article key={service.title} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
                <div className={reverse ? 'lg:order-2' : ''}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 shadow-xl">
                    <img
                      src={service.image}
                      alt={`${service.title} at ANSAR MEDIA PRODUCTIONS`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading={index < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-black uppercase tracking-widest text-amber-600">{service.kicker}</p>
                  <h3 className="mt-3 text-3xl font-extrabold text-emerald-950 lg:text-4xl">{service.title}</h3>
                  <p className="mt-5 text-lg leading-relaxed text-slate-600">{service.body}</p>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </Layout>
  );
}

function LearningFeaturePage() {
  const { slug } = useParams();
  const { data: learningFeatureRows } = useContentCollection('learningFeatures', null, 'asc', { sheetsOnly: true });
  const sheetFeature = learningFeatureRows.find(item => item.slug === slug && item.published !== false);
  const defaultFeature = LEARNING_FEATURES[slug];
  const feature = defaultFeature ? {
    ...defaultFeature,
    ...sheetFeature,
    body: Array.isArray(sheetFeature?.body)
      ? sheetFeature.body
      : String(sheetFeature?.body || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean).length
        ? String(sheetFeature.body || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean)
        : defaultFeature.body,
    points: Array.isArray(sheetFeature?.points) && sheetFeature.points.length ? sheetFeature.points : defaultFeature.points,
    galleryImages: Array.isArray(sheetFeature?.galleryImages) && sheetFeature.galleryImages.length ? sheetFeature.galleryImages : defaultFeature.galleryImages,
    outdoorGymImageUrls: Array.isArray(sheetFeature?.outdoorGymImageUrls) ? sheetFeature.outdoorGymImageUrls : defaultFeature.outdoorGymImageUrls,
    image: sheetFeature?.imageUrl || sheetFeature?.image || defaultFeature.image
  } : null;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      applySeoMetadata(feature ? {
        title: `${feature.title} | Ansar English School`,
        description: createMetaDescription(feature.description, `Explore ${feature.title} at Ansar English School.`),
        keywords: `${feature.title}, Ansar English School facilities, CBSE school Thrissur`
      } : {
        title: 'Learning Feature Not Found | Ansar English School',
        description: 'The requested learning feature is not available.',
        noIndex: true
      }, `/learning/${slug}`);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [feature, slug]);

  if (!feature) {
    return (
      <Layout>
        <main className="mx-auto max-w-4xl px-4 py-24 text-center">
          <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Student-Centric Learning</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Learning feature not found</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">The campus feature you are looking for is not available.</p>
          <Link to="/#student-centric-learning" className="mt-8 inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-800">
            Back to learning features
          </Link>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <section className="relative min-h-[28rem] overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-2xl">
          <img
            src={feature.image}
            alt={`${feature.title} at Ansar English School`}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/88 to-slate-950/45" />
          <div className="relative z-10 flex min-h-[28rem] max-w-4xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-14">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-emerald-950 shadow-lg">
              <LearningIcon name={feature.icon} className="h-9 w-9" />
            </div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-amber-300">{feature.kicker}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight lg:text-6xl">{feature.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-emerald-50/90 lg:text-xl">{feature.description}</p>
          </div>
        </section>

        {slug !== 'advanced-labs' && <section className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Student-Centric Learning</p>
            <h2 className="mt-3 text-3xl font-extrabold text-emerald-950 lg:text-5xl">Built around student comfort, curiosity, and confidence</h2>
            {(feature.body || [
              'Each facility supports the school day in a practical way: safer movement, clearer lessons, stronger participation, and more opportunities for students to learn by seeing, doing, playing, and collaborating.'
            ]).map((paragraph) => (
              <p key={paragraph} className="mt-6 text-lg leading-relaxed text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="space-y-6">
            <LearningImageCarousel feature={feature} />

            <aside className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                <LearningIcon name={feature.icon} className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-emerald-950">Highlights</h3>
              <ul className="mt-4 space-y-3">
                {feature.points.map(point => (
                  <li key={point} className="flex gap-3 text-sm font-semibold leading-relaxed text-slate-700">
                    <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-amber-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>}
        {slug === 'special-play-area' && <section className="mt-16 rounded-3xl bg-emerald-950 px-6 py-10 text-white shadow-xl sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-amber-300">Fitness in the open air</p>
              <h2 className="mt-3 text-3xl font-extrabold lg:text-5xl">{feature.outdoorGymTitle || 'Outdoor Gyms'}</h2>
              <p className="mt-5 text-lg leading-relaxed text-emerald-50/90">{feature.outdoorGymDescription}</p>
            </div>
            {feature.outdoorGymImageUrls?.length ? (
              <LearningImageCarousel feature={{ ...feature, title: feature.outdoorGymTitle || 'Outdoor Gyms', image: feature.outdoorGymImageUrls[0], galleryImages: feature.outdoorGymImageUrls }} />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed border-emerald-700 bg-emerald-900/50 px-6 text-center text-sm font-bold text-emerald-100">
                Outdoor Gym images can be added from Admin → Student-Centric Learning → Joyful Play Zone.
              </div>
            )}
          </div>
        </section>}
        {slug === 'advanced-labs' && <LearningLabsSection />}
      </main>
    </Layout>
  );
}

function DynamicPage({ slug: propSlug }) {
  const params = useParams();
  const slug = propSlug || params.slug;
  const { data: pages, loading } = useContentCollection('pages', 'createdAt', 'desc', { firestoreOnly: true });
  
  const page = pages.find(p => p.slug === slug && p.published !== false);
  const samplePage = SAMPLE_PAGES[slug];

  useEffect(() => {
    if (loading) return;
    const seoPage = page || samplePage;
    const timer = window.setTimeout(() => {
      applySeoMetadata(seoPage ? {
        title: `${seoPage.title} | Ansar English School`,
        description: createMetaDescription(seoPage.metaDescription || seoPage.subtitle || seoPage.intro || seoPage.bodyHtml, `Learn more about ${seoPage.title} at Ansar English School.`),
        keywords: seoPage.keywords || `${seoPage.title}, Ansar English School, CBSE school Thrissur`
      } : {
        title: 'Page Not Found | Ansar English School',
        description: 'The requested page does not exist or is not published.',
        noIndex: true
      }, `/${slug}`);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loading, page, samplePage, slug]);

  if (loading && !page) return <Layout><div className="py-24 text-center"><h2 className="text-2xl font-bold text-slate-900 animate-pulse">Loading page...</h2></div></Layout>;

  if (!page && slug === 'ansar-media-production') {
    return <AnsarMediaProductionPage />;
  }
  
  if (!page && samplePage) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
          <section className="relative overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-2xl">
            {samplePage.heroImage && (
              <img
                src={samplePage.heroImage}
                alt={`${samplePage.title} at Ansar English School`}
                className="absolute inset-0 h-full w-full object-cover opacity-35"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-slate-950/50" />
            <div className="relative z-10 max-w-4xl px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
              <p className="text-sm font-extrabold uppercase tracking-widest text-amber-300">{samplePage.eyebrow || 'Ansar English School'}</p>
              <h1 className="mt-3 text-4xl font-extrabold leading-tight lg:text-6xl">{samplePage.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-emerald-50/90 lg:text-xl">{samplePage.subtitle}</p>
            </div>
          </section>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <div>
              {samplePage.intro && (
                <section className="border-l-4 border-amber-400 bg-white py-2 pl-6">
                  <p className="text-lg leading-relaxed text-slate-700 lg:text-xl">{samplePage.intro}</p>
                </section>
              )}

              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                {samplePage.sections.map((section, index) => {
                  const title = typeof section === 'string' ? section : section.title;
                  const body = typeof section === 'string' ? '' : section.body;

                  return (
                    <section key={title} className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl sm:p-8">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700 ring-1 ring-emerald-100">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <h2 className="mt-5 text-2xl font-extrabold text-slate-900">{title}</h2>
                      <p className="mt-4 text-base leading-relaxed text-slate-600">
                        {body || 'This section is being prepared by the school team.'}
                      </p>
                    </section>
                  );
                })}
              </div>
            </div>

            <aside className="space-y-5">
              {samplePage.highlights?.length ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Highlights</p>
                  <ul className="mt-5 space-y-4">
                    {samplePage.highlights.map(highlight => (
                      <li key={highlight} className="flex gap-3 text-sm font-bold leading-relaxed text-slate-700">
                        <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-amber-500" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600">School Office</p>
                <h2 className="mt-3 text-xl font-extrabold text-slate-900">Need more details?</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">For programme-specific information, parents and students may contact the school office during working hours.</p>
                <Link to="/contact" className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-800">
                  Contact Office
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </Layout>
    );
  }

  if (!page) return <Layout><div className="py-24 text-center"><h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2><p className="text-slate-600 mt-4">The page you are looking for does not exist or has not been published yet.</p></div></Layout>;

  return (
    <Layout>
      <ContentPageLayout page={page} />
    </Layout>
  );
}

function SportsPage() {
  const settings = useSettings();
  const { data: achievements, loading: achievementsLoading } = useContentCollection('sportsAchievements', null);
  const sportsItems = mergeListWithDefaults(settings?.sportsItems, DEFAULT_SPORTS_PAGE.items);
  const title = settings?.sportsPageTitle || DEFAULT_SPORTS_PAGE.title;
  const description = settings?.sportsPageDescription || DEFAULT_SPORTS_PAGE.description;
  const getAchievementYear = (item) => getDisplayYear(item.date, 'Other');
  const publishedAchievements = achievements
    .filter(item => item.published !== false)
    .sort(compareContentNewestFirst);
  const achievementYears = [...new Set(publishedAchievements.map(getAchievementYear))];

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <section className="relative overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.22),transparent_34%),linear-gradient(135deg,#0b3c5d,#071827)]" />
          <div className="relative z-10 max-w-4xl px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
            <p className="text-sm font-extrabold uppercase tracking-widest text-amber-300">Sports Programme</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight lg:text-6xl">{title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-emerald-50/90 lg:text-xl">{description}</p>
          </div>
        </section>

        <section className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {sportsItems.map((sport, index) => (
            <article key={`${sport.title}-${index}`} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                {sport.imageUrl ? (
                  <img
                    src={sport.imageUrl}
                    alt={`${sport.title} at Ansar English School`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
                        <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">Image Holder</p>
                    <p className="mt-1 text-sm font-bold text-slate-600">{sport.title}</p>
                  </div>
                )}
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-widest text-amber-600">Ansar Sports</p>
                <h2 className="mt-3 text-2xl font-extrabold text-slate-900">{sport.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">{sport.description}</p>
              </div>
            </article>
          ))}
        </section>

        <section id="sports-achievements" className="mt-20 scroll-mt-24">
          <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-600">Sports Achievements</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 lg:text-4xl">Year-wise Sports Highlights</h2>
            </div>
            <p className="max-w-2xl text-sm font-semibold leading-relaxed text-slate-500">Sports achievements added from the admin panel appear here, in the home carousel, and in the gallery timeline.</p>
          </div>

          {achievementsLoading ? (
            <p className="text-center font-bold text-slate-500">Loading sports achievements...</p>
          ) : achievementYears.length ? (
            <div className="space-y-12">
              {achievementYears.map(year => {
                const yearItems = publishedAchievements.filter(item => getAchievementYear(item) === year);
                return (
                  <div key={year}>
                    <div className="mb-5 flex items-center gap-4">
                      <h3 className="text-2xl font-black text-emerald-950">{year}</h3>
                      <span className="h-px flex-1 bg-slate-200" />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {yearItems.map((item, index) => {
                        const imageUrl = item.thumbnailUrl || item.imageUrl || item.imageUrls?.[0];
                        return (
                          <Link key={item.id} to={`/sports-achievements/${item.id}`} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                            <div className="relative aspect-[4/3] bg-slate-100">
                              {imageUrl ? (
                                <img src={imageUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading={index < 3 ? 'eager' : 'lazy'} />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                  <LearningIcon name="trophy" className="h-12 w-12" />
                                </div>
                              )}
                            </div>
                            <div className="p-6">
                              {item.date && <p className="text-xs font-black uppercase tracking-widest text-amber-600">{formatDisplayDate(item.date)}</p>}
                              <h3 className="mt-2 line-clamp-2 text-xl font-extrabold text-slate-900 group-hover:text-emerald-700">{item.title}</h3>
                              {item.studentName && !isYearOnly(item.studentName) && <p className="mt-2 text-sm font-bold text-slate-500">{item.studentName}</p>}
                              {item.description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{item.description}</p>}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="rounded-2xl border border-slate-100 bg-white p-8 text-center font-bold text-slate-500">Sports achievements will appear here once published.</p>
          )}
        </section>
      </main>
    </Layout>
  );
}

// --- SECURE ADMIN LOGIN COMPONENT ---
function AdminLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value);
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-emerald-500">
        <div className="text-center mb-8">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Secure Access</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Admin Portal</h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">This login is only for authorized school administrators.</p>
        </div>
        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium border border-red-100">{error}</p>}
        
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          type="button" 
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="px-3 text-sm text-slate-400 font-medium">OR</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleEmailAuth}>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
          <input name="email" type="email" required className="w-full mb-5 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          
          <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
          <input name="password" type="password" required className="w-full mb-8 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          
          <button disabled={loading} type="submit" className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-70">
            {loading ? "Processing..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- ADMIN DASHBOARD (ANALYTICS & METRICS) ---
function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('lastLogin', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(u => (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()));
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const activeUsersCount = users.filter(u => u.lastLogin?.toMillis() > sevenDaysAgo.getTime()).length;

  const exportCSV = () => {
    const headers = ["User Email", "Account Creation Date", "Last Sign-in Timestamp"];
    const rows = filteredUsers.map(u => [
      u.email || 'N/A',
      u.createdAt || 'N/A',
      u.lastLogin ? new Date(u.lastLogin.toMillis()).toLocaleString() : 'N/A'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => `"${e.join('","')}"`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ansar_users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Total Registered Users</span>
          <strong className="text-4xl font-extrabold text-emerald-950">{users.length}</strong>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Active Users (7-Day Metric)</span>
          <strong className="text-4xl font-extrabold text-emerald-950">{activeUsersCount}</strong>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Platform Status</span>
          <strong className="text-xl font-extrabold text-emerald-600 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span> Online & Syncing
          </strong>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-xl text-slate-800">Last Login Activity Feed</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input type="text" placeholder="Search by email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-64" />
            <button onClick={exportCSV} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-slate-100">User Email</th>
                <th className="p-4 font-bold border-b border-slate-100">Account Creation Date</th>
                <th className="p-4 font-bold border-b border-slate-100">Last Sign-in Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length ? filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-800">{u.email}</td>
                  <td className="p-4 text-slate-600 text-sm">{u.createdAt || 'N/A'}</td>
                  <td className="p-4 text-slate-600 text-sm">{u.lastLogin ? new Date(u.lastLogin.toMillis()).toLocaleString() : 'N/A'}</td>
                </tr>
              )) : (
                <tr><td colSpan="3" className="p-8 text-center text-slate-500">No users found matching criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isSproutsAdmin = String(user?.email || '').toLowerCase() === SPROUTS_ADMIN_EMAIL;

  useEffect(() => {
    // Instantly sync Firebase Auth session state with the React application
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await setDoc(doc(db, 'users', currentUser.uid), {
            email: currentUser.email,
            createdAt: currentUser.metadata.creationTime,
            lastLogin: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error("Error updating user tracking:", error);
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <SettingsProvider>
    <Router>
      <SiteSeo />
      <ScrollToTop />
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/sports-page" element={<SportsPage />} />
        <Route path="/atl" element={<AtlPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/library/quiz" element={<QuizCorner />} />
        <Route path="/ansar-sprouts" element={<AnsarSprouts />} />
        <Route path="/ansar-sprouts/activities/:id" element={<SproutsActivityArticle />} />
        <Route path="/field-trips" element={<FieldTrips />} />
        <Route path="/extension-services" element={<DynamicPage slug="extension-services" />} />
        <Route path="/life-at-ansar" element={<LifeAtAnsar />} />
        <Route path="/ansar-times" element={<AnsarTimes />} />
        <Route path="/ansar-family" element={<Staff />} />
        <Route path="/alumni" element={<DynamicPage slug="alumni" />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/sports-achievements/:id" element={<ArticleView />} />
        <Route path="/sop" element={<SopPage />} />
        <Route path="/school-policies" element={<SchoolPoliciesPage />} />
        <Route path="/mandatory-public-disclosure" element={<MandatoryDisclosure />} />
        <Route path="/learning/:slug" element={<LearningFeaturePage />} />
        <Route path="/:slug" element={<DynamicPage />} />
        
        {/* Placeholder detail routes for News/Events cards */}
        <Route path="/news/:id" element={<ArticleView />} />
        <Route path="/events/:id" element={<ArticleView />} />
        <Route path="/achievements/:id" element={<ArticleView />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin/*" element={
          authLoading ? (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : user ? (
            (ADMIN_EMAILS.includes(user.email) || isSproutsAdmin) ? (
              <AdminLayout user={user} onLogout={() => signOut(auth)} sproutsOnly={isSproutsAdmin}>
                <Routes>
                  {isSproutsAdmin ? <>
                    <Route path="/" element={<Navigate to="/admin/ansar-sprouts" replace />} />
                    <Route path="/ansar-sprouts" element={<AdminAnsarSprouts />} />
                    <Route path="*" element={<Navigate to="/admin/ansar-sprouts" replace />} />
                  </> : <>
                  <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route path="/pages" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/updates" element={<Navigate to="/admin/news" replace />} />
                  <Route path="/news" element={<AdminUpdates fixedCategory="News" />} />
                  <Route path="/events" element={<AdminEvents />} />
                  <Route path="/achievements" element={<AdminAchievements />} />
                  <Route path="/sports-achievements" element={<AdminSportsAchievements />} />
                  <Route path="/atl" element={<AdminAtl />} />
                  <Route path="/learning-features" element={<AdminLearningFeatures />} />
                  <Route path="/life-at-ansar" element={<AdminLifeAtAnsar />} />
                  <Route path="/learning-labs" element={<AdminLearningLabs />} />
                  <Route path="/ansar-sprouts" element={<AdminAnsarSprouts />} />
                  <Route path="/field-trips" element={<AdminFieldTrips />} />
                  <Route path="/ansar-times" element={<AdminAnsarTimes />} />
                  <Route path="/library" element={<AdminLibrary />} />
                  <Route path="/library/quiz" element={<AdminQuizCorner />} />
                  <Route path="/leadership" element={<AdminLeadership />} />
                  <Route path="/academics" element={<AdminAcademics />} />
                  <Route path="/public-disclosure" element={<AdminPublicDisclosure />} />
                  <Route path="/gallery" element={<AdminGallery />} />
                  <Route path="/notices" element={<AdminNotices />} />
                  <Route path="/settings" element={<AdminSettings />} />
                  <Route path="*" element={<div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-red-500"><h2 className="text-xl font-bold text-slate-800">Module Not Found</h2><p className="text-slate-500">Select a valid module from the sidebar.</p></div>} />
                  </>}
                </Routes>
              </AdminLayout>
            ) : (
              <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-red-500 text-center">
                  <h1 className="text-2xl font-extrabold text-slate-900 mb-4">Access Denied</h1>
                  <p className="text-slate-600 mb-6">
                    The account <strong className="text-slate-900">{user.email}</strong> is not authorized to access the admin portal.
                  </p>
                  <button onClick={() => signOut(auth)} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-lg hover:bg-slate-800 transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            )
          ) : (
            <AdminLogin />
          )
        } />
      </Routes>
    </Router>
    </SettingsProvider>
  );
}
