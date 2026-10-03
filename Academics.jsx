import React from 'react';
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
  return src ? <img src={src} alt={alt} className="h-full min-h-64 w-full object-cover" loading="lazy" decoding="async" /> : <ImagePlaceholder label={placeholder} />;
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
        <section className="bg-emerald-950 px-4 py-16 text-white lg:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-400">{page.eyebrow}</p>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{page.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-emerald-100">{page.introduction}</p>
            </div>
            <div className="h-72 overflow-hidden rounded-3xl bg-white shadow-2xl sm:h-96">
              <ContentImage src={page.heroImageUrl} alt="Academic life at Ansar English School" placeholder="Academic page hero photograph" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 text-center lg:py-24">
          <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Our Approach</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 lg:text-4xl">{page.overviewTitle}</h2>
          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-slate-600">{page.overviewBody}</p>
        </section>

        <section className="bg-slate-50 px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Holistic Learning</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 lg:text-4xl">{page.beyondTitle}</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">{page.beyondIntroduction}</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {page.beyondItems.map((item, index) => (
                <article key={`${item.title}-${index}`} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 font-black text-emerald-700">{index + 1}</span>
                  <h3 className="mt-5 text-xl font-extrabold text-slate-900">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-emerald-50/70 px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Academic Calendar</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 lg:text-4xl">Academic Year 2026-2027</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">Explore the monthly calendar for Ansar English School, including working days, important dates, holidays, assessments, and school activities.</p>
            </div>
            <AcademicCalendar calendar={withSavedCalendarMonths(SCHOOL_ACADEMIC_CALENDAR, settings?.academicCalendars?.school)} />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Academic Sections</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 lg:text-4xl">{page.sectionsTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{page.sectionsIntroduction}</p>
          </div>
          <div className="mt-12 space-y-8">
            {sections.map((section, index) => (
              <article key={`${section.title}-${index}`} className="grid overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm md:grid-cols-2">
                <div className={`min-h-72 ${index % 2 ? 'md:order-2' : ''}`}>
                  <ContentImage src={section.imageUrl} alt={`${section.title} at Ansar English School`} placeholder={`${section.title} photograph`} />
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-10">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">Stage {index + 1}</p>
                  <h3 className="mt-3 text-2xl font-extrabold text-slate-900 lg:text-3xl">{section.title}</h3>
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
