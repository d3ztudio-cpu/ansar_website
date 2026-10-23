import React from 'react';
import Layout from './Layout';
import { useContentCollection } from './useContentCollection';
import { useSettings } from './SettingsContext';

function getDocumentUrl(item) {
  return item.documentUrl || item.fileUrl || '';
}

const DEFAULT_DISCLOSURE_SECTIONS = [
  'General Information',
  'Infrastructure',
  'Academics',
  'Staff Details',
  'Documents',
  'Others'
];

const DISCLOSURE_SECTION_DETAILS = {
  'General Information': 'Basic institutional information such as school name, address, affiliation details, school code, principal details, and official contact information.',
  Infrastructure: 'Campus and facility information including classrooms, laboratories, library resources, sanitation facilities, safety provisions, and other infrastructure details.',
  Academics: 'Academic information related to curriculum, classes offered, subject options, assessment practices, academic planning, and school performance details.',
  'Staff Details': 'Teaching and administrative staff information, qualifications, staffing structure, and details required for public disclosure.',
  Documents: 'Official certificates, approvals, recognition documents, affiliation records, safety certificates, and other statutory documents for reference.',
  Others: 'Additional public information, declarations, policies, and supporting details shared by the school administration.'
};

function getDisclosureSections(settings) {
  const sections = Array.isArray(settings?.mandatoryDisclosureSections)
    ? settings.mandatoryDisclosureSections
    : DEFAULT_DISCLOSURE_SECTIONS;

  const cleaned = sections
    .map(section => String(section || '').trim())
    .filter(Boolean);

  return cleaned.length ? [...new Set(cleaned)] : DEFAULT_DISCLOSURE_SECTIONS;
}

function groupDocumentsBySection(documents, sectionOrder) {
  const groups = new Map();

  documents.forEach((item) => {
    const section = item.section || 'Documents';
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section).push(item);
  });

  return Array.from(groups.entries())
    .map(([section, items]) => ({
      section,
      items: [...items].sort((a, b) => (a.order || 0) - (b.order || 0))
    }))
    .sort((a, b) => {
      const aIndex = sectionOrder.indexOf(a.section);
      const bIndex = sectionOrder.indexOf(b.section);
      if (aIndex === -1 && bIndex === -1) return a.section.localeCompare(b.section);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
}

export default function MandatoryDisclosure() {
  const { data: documents, loading } = useContentCollection('publicDisclosure', 'order', 'asc');
  const settings = useSettings();
  const publishedDocuments = documents.filter(item => item.published !== false && getDocumentUrl(item));
  const disclosureTitle = settings?.mandatoryDisclosureTitle || 'Mandatory Public Disclosure';
  const disclosureSections = getDisclosureSections(settings);
  const groupedDocuments = groupDocumentsBySection(publishedDocuments, disclosureSections);

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <section className="relative overflow-hidden rounded-3xl bg-emerald-950 px-6 py-14 text-white shadow-2xl sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(218,154,44,.18),transparent_42%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/95 to-slate-950/80" />
          <div className="relative z-10 max-w-4xl">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-amber-300">Ansar English School</p>
            <h1 className="text-4xl font-extrabold leading-tight lg:text-6xl">{disclosureTitle}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-emerald-50/85 lg:text-xl">
              Institutional documents and statutory certificates for public viewing.
            </p>
          </div>
        </section>

        <section className="mt-12">
          {loading ? (
            <p className="py-16 text-center text-slate-500">Loading documents...</p>
          ) : publishedDocuments.length ? (
            <div className="space-y-12">
              {groupedDocuments.map(({ section, items }) => (
                <section key={section}>
                  <div className="mb-5 flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Mandatory Disclosure</p>
                      <h2 className="mt-1 text-2xl font-extrabold text-slate-900">{section}</h2>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{items.length} file{items.length === 1 ? '' : 's'}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => (
                      <a
                        key={item.id}
                        href={getDocumentUrl(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-h-36 items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                      >
                        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 21h10a2 2 0 0 0 2-2V8.5L13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 3v6h6" /></svg>
                        </span>
                        <span className="min-w-0">
                          <span className="text-xs font-black uppercase tracking-widest text-amber-600">Document {index + 1}</span>
                          <span className="mt-2 block text-xl font-extrabold leading-snug text-slate-900 group-hover:text-emerald-700">{item.title}</span>
                          <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                            View PDF
                            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17 17 7M8 7h9v9" /></svg>
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
              <div>
                <div className="border-l-4 border-amber-400 bg-white py-2 pl-6">
                  <p className="text-lg leading-relaxed text-slate-700 lg:text-xl">
                    This page is reserved for the school's CBSE mandatory public disclosure information. The document links are managed by the school administration and will be displayed in their relevant categories when published.
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {disclosureSections.map((section, index) => (
                    <article key={section} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700 ring-1 ring-emerald-100">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <h2 className="mt-5 text-2xl font-extrabold text-slate-900">{section}</h2>
                      <p className="mt-4 text-base leading-relaxed text-slate-600">
                        {DISCLOSURE_SECTION_DETAILS[section] || 'Relevant public disclosure information and supporting documents for this category will be organized here.'}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Public Access</p>
                <h2 className="mt-3 text-xl font-extrabold text-slate-900">Disclosure Desk</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  For document verification or official disclosure queries, please contact the school office during working hours.
                </p>
              </aside>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}
