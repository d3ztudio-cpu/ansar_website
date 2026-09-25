import React, { useEffect, useMemo, useState } from 'react';
import Layout from './Layout';
import { subscribeGoogleSheetsRefresh, useContentCollection } from './useContentCollection';
import {
  ANSAR_TIMES_MONTHS,
  ANSAR_TIMES_START_YEAR,
  getAnsarTimesPdfUrl,
  isAnsarTimesDeleted
} from './ansarTimesConfig';
import {
  getSchoolMagazineDownloadUrl,
  getSchoolMagazineRecordId,
  getSchoolMagazineTitle,
  getSchoolMagazineUrl,
  getSchoolMagazineYearLabel,
  isSchoolMagazineDeleted
} from './schoolMagazinesConfig';

function MagazineCard({ item }) {
  const pdfUrl = getSchoolMagazineUrl(item);
  const downloadUrl = getSchoolMagazineDownloadUrl(item);
  const title = getSchoolMagazineTitle(item);
  const year = Number(item.year) || '';
  const kind = String(item.kind || '').trim();

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:border-amber-200 hover:shadow-2xl">
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
        {item.coverImageUrl ? (
          <img
            src={item.coverImageUrl}
            alt={`${title} cover`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <span className="text-xs font-black uppercase tracking-[0.35em] text-amber-300">Ansar English School</span>
              <span className="mt-2 text-2xl font-extrabold leading-snug text-white">{title}</span>
            </div>
          </>
        )}
        {year ? <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-950 shadow">{getSchoolMagazineYearLabel(year)}</span> : null}
        {kind ? <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700 shadow">{kind}</span> : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h4 className="text-lg font-extrabold leading-snug text-slate-950">{title}</h4>
        {item.description ? <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{item.description}</p> : null}
        <div className="mt-5 flex items-center gap-2 pt-1">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white shadow-md transition-colors hover:bg-emerald-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.306 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.694 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.694 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Read Magazine
          </a>
          <a
            href={downloadUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-extrabold text-emerald-700 transition-colors hover:bg-emerald-100"
            title="Download magazine PDF"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4" />
            </svg>
            Download
          </a>
        </div>
      </div>
    </article>
  );
}

export default function AnsarTimes() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: entries, loading } = useContentCollection('ansarTimes', null, 'desc', { sheetsOnly: true, refreshKey });
  const { data: magazines, loading: magazinesLoading } = useContentCollection('schoolMagazines', null, 'desc', { sheetsOnly: true, refreshKey });

  useEffect(() => {
    return subscribeGoogleSheetsRefresh(() => setRefreshKey(key => key + 1));
  }, []);

  const yearSections = useMemo(() => {
    const sections = new Map();
    sections.set(ANSAR_TIMES_START_YEAR, new Map());

    entries
      .filter(item => item.published !== false && getAnsarTimesPdfUrl(item) && !isAnsarTimesDeleted(item))
      .forEach(item => {
        const year = Number(item.year) || ANSAR_TIMES_START_YEAR;
        const key = String(item.month || '').trim().toLowerCase();
        if (!key) return;

        if (!sections.has(year)) sections.set(year, new Map());
        sections.get(year).set(key, item);
      });

    return Array.from(sections.entries())
      .map(([year, entriesByMonth]) => ({ year, entriesByMonth }))
      .sort((a, b) => b.year - a.year);
  }, [entries]);

  const magazineSections = useMemo(() => {
    const sections = new Map();

    magazines
      .filter(item => item.published !== false && getSchoolMagazineUrl(item) && !isSchoolMagazineDeleted(item))
      .forEach(item => {
        const year = Number(item.year) || new Date().getFullYear();
        if (!sections.has(year)) sections.set(year, []);
        sections.get(year).push(item);
      });

    sections.forEach(list => {
      list.sort((a, b) => Number(a.order || 0) - Number(b.order || 0) || getSchoolMagazineTitle(a).localeCompare(getSchoolMagazineTitle(b)));
    });

    return Array.from(sections.entries())
      .map(([year, items]) => ({ year, items }))
      .sort((a, b) => b.year - a.year);
  }, [magazines]);

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 px-6 py-14 text-white shadow-2xl sm:px-10 lg:px-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(251,191,36,0.14),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(16,185,129,0.18),transparent_50%)]" />
          <div className="relative z-10 max-w-4xl">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-amber-300">School Publication</p>
            <h1 className="text-4xl font-extrabold leading-tight lg:text-6xl">Ansar Times</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-100/85 lg:text-xl">
              Monthly editions of Ansar Times for each academic year.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-100 pb-6">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Academic Year Archive</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-950">Monthly Editions</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">New academic years appear above previous years as PDFs are added.</p>
            </div>
          </div>

          {loading ? (
            <p className="py-12 text-center font-bold text-slate-500">Loading Ansar Times...</p>
          ) : (
            <div className="mt-8 space-y-10">
              {yearSections.map(({ year, entriesByMonth }) => (
                <section key={year}>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="flex items-center gap-3 text-2xl font-extrabold text-slate-950">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-black text-white shadow">{String(year).slice(-2)}</span>
                      {year}
                    </h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-500">Academic Year</span>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {ANSAR_TIMES_MONTHS.map(month => {
                      const entry = entriesByMonth.get(month.value.toLowerCase());
                      const pdfUrl = getAnsarTimesPdfUrl(entry);
                      const isActive = Boolean(pdfUrl);

                      if (isActive) {
                        return (
                          <a
                            key={month.value}
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-2xl"
                          >
                            <div className="relative flex h-24 items-center justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-5">
                              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.16),transparent_55%)]" />
                              <span className="relative z-10 text-xs font-black uppercase tracking-[0.25em] text-amber-300">Ansar Times</span>
                              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
                                </svg>
                              </span>
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                              <h4 className="text-lg font-extrabold text-slate-950">{month.label} Edition</h4>
                              <p className="mt-1 text-sm text-slate-500">{year} · Monthly issue</p>
                              <span className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white shadow-md transition-colors group-hover:bg-emerald-700">
                                Read Edition
                                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17 17 7M8 7h9v9" />
                                </svg>
                              </span>
                            </div>
                          </a>
                        );
                      }

                      return (
                        <div
                          key={month.value}
                          className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 opacity-75"
                        >
                          <div className="relative flex h-24 items-center justify-between bg-slate-200/70 px-5">
                            <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">Ansar Times</span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-slate-400">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
                              </svg>
                            </span>
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <h4 className="text-lg font-extrabold text-slate-400">{month.label} Edition</h4>
                            <p className="mt-1 text-sm text-slate-400">{year} · Not published yet</p>
                            <span className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-400">
                              Not Added
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>

        <section id="school-magazines" className="mt-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-100 pb-6">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-amber-600">School Publications</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-950">School Magazines</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Yearly school magazines published by Ansar English School. Open any issue to read it online or download a copy.</p>
            </div>
          </div>

          {magazinesLoading ? (
            <p className="py-12 text-center font-bold text-slate-500">Loading School Magazines...</p>
          ) : magazineSections.length ? (
            <div className="mt-8 space-y-10">
              {magazineSections.map(({ year, items }) => (
                <section key={year}>
                  <div className="mb-4 flex items-center gap-4">
                    <h3 className="flex items-center gap-3 text-2xl font-extrabold text-slate-950">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-sm font-black text-slate-950 shadow">{String(year).slice(-2)}</span>
                      {getSchoolMagazineYearLabel(year)}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map(item => <MagazineCard key={getSchoolMagazineRecordId(item) || item.id} item={item} />)}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-amber-500 shadow-sm">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.306 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.694 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.694 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <p className="mt-4 font-bold text-slate-600">No school magazines published yet</p>
              <p className="mt-1 text-sm text-slate-400">Yearly magazines added by the school office will appear here.</p>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}
