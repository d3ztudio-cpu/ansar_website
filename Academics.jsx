import React, { useState } from 'react';
import Layout from './Layout';
import { useSettings } from './SettingsContext';
import { DEFAULT_ACADEMICS_PAGE, DEFAULT_ACADEMIC_SECTIONS, mergeListWithDefaults } from './contentDefaults';
import AcademicCalendar from './AcademicCalendar';
import { SCHOOL_ACADEMIC_CALENDAR, withSavedCalendarMonths } from './academicCalendarData';

function ImagePlaceholder({ label, className = '' }) {
  return (
    <div className={`flex h-full min-h-64 flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-6 text-center ${className}`}>
      <svg className="h-12 w-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="m3 16 5-5 4 4 3-3 6 6M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Zm10-12h.01" />
      </svg>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Image placeholder</p>
      <p className="mt-2 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function ContentImage({ src, alt, placeholder }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? <img src={src} alt={alt} onError={() => setFailed(true)} className="h-full min-h-64 w-full object-cover" loading="lazy" decoding="async" /> : <ImagePlaceholder label={placeholder} />;
}

export default function Academics() {
  const settings = useSettings();
  const page = {
    ...DEFAULT_ACADEMICS_PAGE,
    ...(settings?.academicsPage || {}),
    beyondItems: mergeListWithDefaults(settings?.academicsPage?.beyondItems, DEFAULT_ACADEMICS_PAGE.beyondItems)
  };
  const sections = mergeListWithDefaults(settings?.academicSections, DEFAULT_ACADEMIC_SECTIONS);

  return (
    <Layout>
      <main className="overflow-hidden bg-white">
        <section className="relative overflow-hidden rounded-[2rem] bg-emerald-950 px-6 py-10 text-white shadow-xl sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="inline-flex rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-amber-300">{page.eyebrow}</p>
              <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">{page.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-emerald-50/85">{page.introduction}</p>
            </div>
            <div className="overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-sm sm:p-4">
              <div className="h-64 overflow-hidden rounded-2xl bg-white sm:h-80 lg:h-96">
              <ContentImage src={page.heroImageUrl} alt="Academic life at Ansar English School" placeholder="Academic page hero photograph" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto -mt-5 max-w-6xl px-4 text-center sm:-mt-8">
          <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:grid-cols-3 sm:p-5">
            {[
              ['01', 'Curiosity', 'Learning that starts with questions'],
              ['02', 'Confidence', 'Skills built through practice'],
              ['03', 'Character', 'Values that guide every learner']
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-2xl bg-slate-50 p-5 text-left">
                <span className="text-xs font-black tracking-[0.2em] text-amber-600">{number}</span>
                <h3 className="mt-2 text-lg font-black text-emerald-950">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto max-w-4xl py-16 lg:py-20">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">Our Approach</p>
            <h2 className="mt-3 text-3xl font-black text-emerald-950 lg:text-4xl">{page.overviewTitle}</h2>
            <p className="mx-auto mt-6 text-lg leading-8 text-slate-600">{page.overviewBody}</p>
          </div>
        </section>

        <section className="rounded-[2rem] bg-slate-50 px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">Holistic Learning</p>
              <h2 className="mt-3 text-3xl font-black text-emerald-950 lg:text-4xl">{page.beyondTitle}</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">{page.beyondIntroduction}</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {page.beyondItems.map((item, index) => (
                <article key={`${item.title}-${index}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950 font-black text-amber-300 transition group-hover:bg-amber-400 group-hover:text-emerald-950">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-5 text-xl font-black text-emerald-950">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">Academic Calendar</p>
              <h2 className="mt-3 text-3xl font-black text-emerald-950 lg:text-4xl">Academic Year 2026-2027</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">Explore the monthly calendar for Ansar English School, including working days, important dates, holidays, assessments, and school activities.</p>
            </div>
            <AcademicCalendar calendar={withSavedCalendarMonths(SCHOOL_ACADEMIC_CALENDAR, settings?.academicCalendars?.school)} />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">Academic Sections</p>
            <h2 className="mt-3 text-3xl font-black text-emerald-950 lg:text-4xl">{page.sectionsTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{page.sectionsIntroduction}</p>
          </div>
          <div className="mt-12 space-y-8">
            {sections.map((section, index) => (
              <article key={`${section.title}-${index}`} className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl md:grid-cols-2">
                <div className={`min-h-72 ${index % 2 ? 'md:order-2' : ''}`}>
                  <ContentImage src={section.imageUrl} alt={`${section.title} at Ansar English School`} placeholder={`${section.title} photograph`} />
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-10">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">Stage {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-3 text-2xl font-black text-emerald-950 lg:text-3xl">{section.title}</h3>
                  <p className="mt-2 font-bold text-emerald-700">{section.tagline}</p>
                  <p className="mt-5 leading-7 text-slate-600">{section.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
