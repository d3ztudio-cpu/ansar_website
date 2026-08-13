import React, { useEffect, useRef, useState } from 'react';
import Layout from './Layout';
import ContentPageLayout from './ContentPageLayout';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useSettings } from './SettingsContext';
import { DEFAULT_TRUST_MEMBERS } from './trustMembers';

const ANSAR_MILESTONES = [
  { year: '1979', title: 'ACT got registered', color: 'bg-red-600', ring: 'ring-red-100' },
  { year: '1982', title: 'School got registered', color: 'bg-amber-400', ring: 'ring-amber-100' },
  { year: '1988', title: 'Affiliation from CBSE', color: 'bg-cyan-500', ring: 'ring-cyan-100' },
  { year: '1990', title: 'Updated to Senior Secondary', color: 'bg-indigo-700', ring: 'ring-indigo-100' },
  { year: '1992', title: '1st batch of class XII', color: 'bg-red-600', ring: 'ring-red-100' },
  { year: '2021', title: 'New vision & mission', color: 'bg-amber-400', ring: 'ring-amber-100' },
  { year: '2022', title: 'Year of Excellence', color: 'bg-cyan-500', ring: 'ring-cyan-100' },
  { year: '2022', title: 'Year of Talent', color: 'bg-indigo-700', ring: 'ring-indigo-100' },
  { year: '2023', title: 'Year of Quality', color: 'bg-red-600', ring: 'ring-red-100' },
  { year: '2023', title: 'Year of Innovation', color: 'bg-amber-400', ring: 'ring-amber-100' },
  { year: '2024', title: 'NABET Accredited', color: 'bg-cyan-500', ring: 'ring-cyan-100' },
  { year: '2025', title: 'National Silver Medal', color: 'bg-indigo-700', ring: 'ring-indigo-100' },
  { year: '2025', title: 'CBSE Topper', color: 'bg-red-600', ring: 'ring-red-100' },
  { year: '2026', title: 'Year of Sustainability', color: 'bg-indigo-700', ring: 'ring-indigo-100' }
];

const ABOUT_STATS = [
  ['1980', 'Founded'],
  ['4,600+', 'Students'],
  ['270+', 'Educators'],
  ['CBSE', 'Affiliated']
];

const DEFAULT_HISTORY_INTRO = 'Founded in 1980, Ansar English School, Perumpilavu, is the flagship educational institution of the Ansar Charitable Trust. What began as a humble initiative has grown into one of Kerala\'s respected CBSE Senior Secondary schools, serving a vibrant learning community of over 4,600 students.';

const DEFAULT_HISTORY_SECTIONS = [
  {
    title: 'A Vision That Transforms',
    body: 'The school was established with the noble vision of providing quality, value-based education that transforms lives and empowers future generations. Guided by the Trust\'s commitment to educational and social upliftment, Ansar creates an inclusive and caring environment where every child is encouraged to discover potential, think critically, embrace innovation, and grow as a lifelong learner.'
  },
  {
    title: 'Learning Beyond Textbooks',
    body: 'Affiliated with the Central Board of Secondary Education (CBSE), New Delhi, the school nurtures young minds through academic excellence, character formation, and holistic development. Experiential learning, leadership opportunities, co-curricular and sports programmes, arts, innovation, entrepreneurship, environmental stewardship, and community engagement cultivate creativity, confidence, collaboration, resilience, and social responsibility.'
  },
  {
    title: 'A Campus Built For Inquiry',
    body: 'The modern campus is equipped with smart classrooms, well-designed laboratories, dedicated innovation spaces, extensive sports facilities, and a resource-rich library with more than 34,000 books, journals, periodicals, newspapers, and digital learning resources that foster reading, inquiry, and research.'
  },
  {
    title: 'Educators With Purpose',
    body: 'A passionate team of educators delivers learner-centred education through innovative pedagogical practices that inspire curiosity, independent thinking, and academic excellence. Rooted in moral values and a culture of respect, discipline, and compassion, Ansar prepares students for higher education and the challenges of a rapidly changing global society.'
  }
];

const HISTORY_HIGHLIGHTS = [
  ['40+ Years', 'of steady service in value-based education'],
  ['34,000+', 'library books and learning resources'],
  ['CBSE', 'Senior Secondary affiliation'],
  ['4,600+', 'students in a vibrant learning community']
];

const HISTORY_IMAGE_URL = 'https://i.ibb.co/4nr6rs9n/DJI-20260625171033-0002-D.jpg';

function AnimatedSection({ children, className = '' }) {
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
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}>
      {children}
    </div>
  );
}

function FadeInOnView({ children, className = '', delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.18 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-sm'} ${className}`}
    >
      {children}
    </div>
  );
}

function AboutSidebar() {
  return (
    <>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
        <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">School Profile</p>
        <h2 className="mt-3 text-xl font-extrabold text-slate-900">Ansar English School</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">A CBSE senior secondary school in Perumpilavu shaped by academic excellence, values, service, and inclusive learning.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {ABOUT_STATS.map(([value, label]) => (
          <div key={label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-2xl font-extrabold text-slate-900">{value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <a href="https://www.p4panorama.com/360-virtual-tour/ansar-school/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-center text-sm font-bold text-white shadow-lg transition-colors hover:bg-emerald-700">
        Take a 360&deg; Virtual Tour
      </a>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">At a glance</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {['NABET accredited', 'CBSE senior secondary', 'Value-based learning', 'Inclusive campus life'].map(item => (
            <div key={item} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 ring-4 ring-amber-100" />
              <span className="text-sm font-bold text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AnsarTimeline() {
  return (
    <AnimatedSection className="mt-14 overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Ansar Timeline</p>
        <h2 className="mt-3 text-4xl font-extrabold text-slate-950 lg:text-5xl">Milestones</h2>
      </div>

      <div className="hidden overflow-x-auto pb-4 lg:block">
        <div className="relative min-w-[1220px] px-6 py-24">
          <div className="absolute left-10 right-10 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-800" />
          <div className="grid grid-cols-[repeat(14,minmax(0,1fr))]">
            {ANSAR_MILESTONES.map((milestone, index) => {
              const isTop = index % 2 === 0;
              return (
                <div key={`${milestone.year}-${milestone.title}`} className="relative h-48">
                  <span className={`absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ${milestone.color} ring-8 ${milestone.ring} shadow-md`} />
                  <span className={`absolute left-1/2 h-16 w-px -translate-x-1/2 bg-slate-700/70 ${isTop ? 'bottom-1/2 mb-3' : 'top-1/2 mt-3'}`} />
                  <div className={`absolute left-1/2 w-32 -translate-x-1/2 text-center ${isTop ? 'bottom-[8.25rem]' : 'top-[8.25rem]'}`}>
                    <p className="text-2xl font-black text-slate-950">{milestone.year}</p>
                    <h3 className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-extrabold leading-tight text-slate-700 shadow-sm">{milestone.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative space-y-6 lg:hidden">
        <div className="absolute bottom-4 left-4 top-4 w-1 rounded-full bg-slate-800" />
        {ANSAR_MILESTONES.map((milestone) => (
          <div key={`${milestone.year}-${milestone.title}-mobile`} className="relative flex gap-5 pl-0.5">
            <span className={`relative z-10 mt-2 h-8 w-8 flex-none rounded-full ${milestone.color} ring-8 ${milestone.ring} shadow-md`} />
            <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-2xl font-black text-slate-950">{milestone.year}</p>
              <h3 className="mt-1 text-base font-extrabold text-slate-700">{milestone.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}

function HistoryAndTrustees({ historyText, trustees = [] }) {
  const visibleTrustees = Array.isArray(trustees) ? trustees.filter(item => item?.imageUrl || item?.name) : [];
  const trusteeSlots = visibleTrustees.length ? visibleTrustees : Array.from({ length: 6 }, (_, index) => ({ name: `Trustee Member ${index + 1}` }));
  const customParagraphs = typeof historyText === 'string'
    ? historyText.split(/\n{2,}/).map(paragraph => paragraph.trim()).filter(Boolean)
    : [];
  const hasCustomHistory = customParagraphs.length > 0;
  const historySections = hasCustomHistory
    ? customParagraphs.map((body, index) => ({ title: index === 0 ? 'Our Beginning' : `Chapter ${index + 1}`, body }))
    : DEFAULT_HISTORY_SECTIONS;

  return (
    <AnimatedSection className="mt-12 space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-emerald-50">
        <div className="grid gap-8 p-8 lg:grid-cols-[0.82fr_1.18fr] lg:p-12">
          <FadeInOnView className="flex flex-col justify-between gap-8">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-emerald-700">Our Story</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight text-emerald-950 lg:text-5xl">History of Ansar</h2>
              <p className="mt-5 text-lg leading-relaxed text-emerald-950/75">
                {hasCustomHistory ? 'A continuing journey of education, service, and community trust.' : DEFAULT_HISTORY_INTRO}
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-lg">
              <div className="relative aspect-[4/3] bg-emerald-950">
                <img src={HISTORY_IMAGE_URL} alt="Aerial view of Ansar English School campus" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-950/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-amber-300">Campus View</p>
                  <p className="mt-1 text-lg font-extrabold leading-tight text-white">A learning community shaped by service and growth.</p>
                </div>
              </div>
            </div>
            {!hasCustomHistory && (
              <div className="grid grid-cols-2 gap-3">
                {HISTORY_HIGHLIGHTS.map(([value, label], index) => (
                  <FadeInOnView key={value} delay={120 + index * 80} className="rounded-xl border border-emerald-100 bg-white/85 p-4 shadow-sm">
                    <p className="text-2xl font-extrabold text-emerald-950">{value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                  </FadeInOnView>
                ))}
              </div>
            )}
          </FadeInOnView>

          <div className="space-y-4">
            {historySections.map((section, index) => (
              <FadeInOnView
                key={`${section.title}-${index}`}
                delay={index * 110}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-extrabold text-slate-950">{section.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">{section.body}</p>
              </FadeInOnView>
            ))}
          </div>
        </div>

        <div className="border-t border-emerald-100 bg-white/70 px-8 py-7 lg:px-12">
          <FadeInOnView className="mx-auto max-w-4xl text-center">
            <p className="text-xl font-extrabold leading-relaxed text-emerald-950 sm:text-2xl">
              Educating Minds, Enriching Values, and Inspiring Excellence.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              At Ansar, education nurtures future leaders, innovators, and changemakers prepared for meaningful lives of service and leadership.
            </p>
          </FadeInOnView>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm lg:p-12">
        <div className="mb-8 text-center">
          <p className="text-sm font-black uppercase tracking-widest text-amber-600">Ansari Charitable Trust</p>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-950">Trustee Members</h2>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {trusteeSlots.map((trustee, index) => (
            <div key={`${trustee.name || 'trustee'}-${index}`} className="group overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/5] bg-slate-100">
                {trustee.imageUrl ? (
                  <img src={trustee.imageUrl} alt={trustee.name || 'Trustee member'} className="absolute inset-0 h-full w-full object-contain bg-white p-2 transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    <svg className="h-14 w-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" /></svg>
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="text-sm font-extrabold text-slate-800">{trustee.name}</h3>
                {trustee.role && <p className="mt-1 text-xs font-bold text-emerald-600">{trustee.role}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </AnimatedSection>
  );
}

function AboutInstitutionSections() {
  const settings = useSettings();

  return (
    <>
      <ValuesAndFaculty />
      <AnsarTimeline />
      <HistoryAndTrustees historyText={settings?.ansarHistoryText} trustees={settings?.trustMembers || DEFAULT_TRUST_MEMBERS} />
    </>
  );
}

function ValuesAndFaculty() {
  const valuePoints = [
    ['Respect', 'Honouring every person, culture, belief, and perspective.'],
    ['Empathy', 'Understanding others and responding with kindness and compassion.'],
    ['Responsibility', 'Making thoughtful choices and contributing positively to the community.'],
    ['Perseverance', 'Meeting challenges with patience, courage, and purpose.']
  ];

  const facultyStrengths = [
    'Well-educated and professionally trained teachers',
    'Academic and personal mentoring for every learner',
    'CBSE-certified professional development courses',
    'Online and offline workshops and school empowerment programmes'
  ];

  return (
    <AnimatedSection className="mt-12 space-y-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Education with Character</p>
        <h2 className="mt-3 text-4xl font-extrabold leading-tight text-slate-950 lg:text-5xl">Knowledge guided by values and inspiring educators</h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">Academic excellence becomes meaningful when students learn with integrity, compassion, confidence, and a sense of purpose.</p>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-7 text-white shadow-xl sm:p-10 lg:p-12">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-300/10 blur-2xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-amber-300 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-950">Value Integration</span>
            <h3 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">Nurturing the intellect, heart, and spirit</h3>
            <p className="mt-5 text-lg leading-8 text-emerald-50/90">Our curriculum thoughtfully integrates respect, empathy, responsibility, and perseverance into everyday learning. We promote ethical behaviour, spiritual awareness, and cultural appreciation so that students grow into compassionate, balanced individuals who contribute positively to society.</p>
            <p className="mt-4 leading-7 text-emerald-50/75">By encouraging personal and moral growth alongside academic achievement, we prepare learners to face life&apos;s challenges with integrity, resilience, and purpose.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {valuePoints.map(([title, text], index) => (
              <FadeInOnView key={title} delay={index * 0.06} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 font-black text-emerald-950">{index + 1}</div>
                <h4 className="mt-4 text-lg font-extrabold">{title}</h4>
                <p className="mt-2 text-sm leading-6 text-emerald-50/75">{text}</p>
              </FadeInOnView>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl">
        <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
          <div className="flex min-h-72 items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-100 p-10">
            <div className="flex h-48 w-48 items-center justify-center rounded-full bg-white text-emerald-800 shadow-xl ring-8 ring-white/60">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-28 w-28" aria-hidden="true">
                <path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6M8 10h.01M12 10h.01M16 10h.01" />
                <path d="M7 6V3h10v3" />
              </svg>
            </div>
          </div>
          <div className="p-7 sm:p-10 lg:p-12">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-600">Our Faculty</p>
            <h3 className="mt-3 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">Teachers, mentors, and lifelong learners</h3>
            <p className="mt-5 text-lg leading-8 text-slate-600">Ansar English School, Perumpilavu is committed to a thriving educational environment built by dedicated human capital. Our well-educated and trained teachers create a nurturing, supportive atmosphere in which students feel encouraged to learn, question, and grow.</p>
            <p className="mt-4 leading-7 text-slate-600">Beyond classroom teaching, our educators serve as mentors who guide students academically and personally. We continuously invest in professional development so that every teacher has the current knowledge, confidence, and skills needed to inspire students and help them reach their full potential.</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {facultyStrengths.map(item => (
                <li key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

export default function About() {
  const { data: pages } = useFirestoreCollection('pages');
  const page = pages.find(p => p.slug === 'about');

  if (page) {
    return (
      <Layout>
        <ContentPageLayout
          page={page}
          eyebrow="About Ansar English School"
          sidebar={<AboutSidebar />}
          actions={page.virtualTourUrl && (
            <a href={page.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-700 no-underline">
              {page.virtualTourText || 'Take a 360\u00b0 Virtual Tour'}
            </a>
          )}
        />
        <div className="mx-auto max-w-7xl px-4 pb-12 lg:pb-20">
          <AboutInstitutionSections />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <section className="relative overflow-hidden rounded-2xl bg-slate-950 text-white shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop"
            alt="About Ansar English School"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/86 to-emerald-950/45" />
          <div className="relative grid min-h-[28rem] grid-cols-1 items-end gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:px-14 lg:py-16">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase tracking-widest text-amber-300">About Ansar English School</p>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-tight lg:text-6xl">A Legacy of Excellence, A Future of Promise</h1>
              <p className="mt-6 max-w-3xl text-lg font-light leading-relaxed text-slate-100/90 lg:text-xl">Empowering generations since 1982 through value-driven education and inclusive learning.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ABOUT_STATS.map(([value, label]) => (
                <div key={label} className="border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-3xl font-extrabold text-amber-300">{value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-100">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <article className="space-y-8">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
              <h2 className="text-3xl font-extrabold text-slate-900">Our Story: A Legacy of Excellence</h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate-600">
                <p>Founded in 1982 by the Ansari Charitable Trust under the guidance of Late Jb. A V Abdul Majeed Saheb and visionary leaders, <strong className="text-slate-900">Ansar English School</strong> has grown into a beacon of holistic education in Perumpilavu, Thrissur. We are proud to be the <strong className="text-slate-900">first school in Thrissur accredited by NABET</strong> and are affiliated with the CBSE board. Today, our sprawling campus serves over 4,600 students, guided by a dedicated team of 270+ experienced educators.</p>
                <p>Our expansive educational ecosystem goes beyond traditional schooling, encompassing a Senior Secondary School, an NIOS center, an Arts & Science College for Women, a Special School for Mentally Challenged Children, a nurturing Orphanage, and a well-equipped hospital.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
                <h2 className="text-2xl font-extrabold text-slate-900">Our Vision</h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-700">To empower students with academic rigor, skill and ethical leadership  to serve  society.</p>
              </section>
              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-extrabold text-slate-900">Our Mission</h2>
                <ul className="mt-5 space-y-4 text-slate-600">
                  <li><strong className="text-slate-900">Shape Contributors:</strong> Conduct educational programs that mold students into active contributors to a just and equitable society.</li>
                  <li><strong className="text-slate-900">Build 21st-Century Skills:</strong> Design and implement activities that empower students with critical thinking, creativity, communication, and collaboration.</li>
                  <li><strong className="text-slate-900">Ensure Inclusivity:</strong> Provide quality education to students from deprived sections to drive upward social mobility.</li>
                  <li><strong className="text-slate-900">Foster Character:</strong> Sustain an ecosystem that inculcates strong moral character, self-esteem, and a deep awareness of societal responsibilities.</li>
                </ul>
              </section>
            </div>
          </article>

          <aside className="space-y-6">
            <AboutSidebar />
          </aside>
        </section>

        <AboutInstitutionSections />
      </div>
    </Layout>
  );
}
