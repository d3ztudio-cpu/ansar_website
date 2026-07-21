import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const SOP_DOCUMENTS = [
  { title: 'School SOP', category: 'School-wide', file: 'school-sop.pdf', size: '3.1 MB', featured: true },
  { title: 'Control of Records & Documents SOP', category: 'Governance', file: 'control-of-records-and-documents-sop.pdf', size: '48 KB' },
  { title: 'Curriculum Planning SOP', category: 'Academic', file: 'curriculum-planning-sop.pdf', size: '195 KB' },
  { title: 'Teaching & Learning Process SOP', category: 'Academic', file: 'teaching-learning-process-sop.pdf', size: '325 KB' },
  { title: 'Assessment & Evaluation SOP', category: 'Academic', file: 'assessment-and-evaluation-sop.pdf', size: '392 KB' },
  { title: 'Career Guidance SOP', category: 'Academic', file: 'career-guidance-sop.pdf', size: '156 KB' },
  { title: 'Instructional Resources SOP', category: 'Academic', file: 'instructional-resources-sop.pdf', size: '59 KB' },
  { title: 'CWSN SOP', category: 'Student support', file: 'cwsn-sop.pdf', size: '164 KB' },
  { title: 'Student Activities SOP', category: 'Student support', file: 'student-activities-sop.pdf', size: '178 KB' },
  { title: 'School Assembly SOP', category: 'Student support', file: 'school-assembly-sop.pdf', size: '45 KB' },
  { title: 'Complaint Handling SOP', category: 'Safeguarding', file: 'complaint-handling-sop.pdf', size: '100 KB' },
  { title: 'Health & Safety SOP', category: 'Safeguarding', file: 'health-and-safety-sop.pdf', size: '322 KB' },
  { title: 'Admission SOP', category: 'Administration', file: 'admission-sop.pdf', size: '502 KB' },
  { title: 'Accounts SOP', category: 'Administration', file: 'accounts-sop.pdf', size: '300 KB' },
  { title: 'Human Resource Development SOP', category: 'Administration', file: 'human-resource-development-sop.pdf', size: '674 KB' },
  { title: 'Hostel SOP', category: 'Administration', file: 'hostel-sop.pdf', size: '206 KB' },
  { title: 'Self-Assessment SOP', category: 'Governance', file: 'self-assessment-sop.pdf', size: '69 KB' },
  { title: 'Risk & Opportunities SOP', category: 'Governance', file: 'risk-and-opportunities-sop.pdf', size: '154 KB' }
];

const POLICY_DOCUMENTS = [
  { title: 'AES School Policies', category: 'School-wide', file: 'aes-school-policies.pdf', size: '4.0 MB', featured: true },
  { title: 'POSH Policy', category: 'Safeguarding', file: 'posh-policy.pdf', size: '21 KB' },
  { title: 'Anti-Bullying Policy', category: 'Safeguarding', file: 'anti-bullying-policy.pdf', size: '21 KB' },
  { title: 'POCSO Policy', category: 'Safeguarding', file: 'pocso-policy.pdf', size: '125 KB' },
  { title: 'Health & Safety Policy', category: 'Safeguarding', file: 'health-and-safety-policy.pdf', size: '288 KB' },
  { title: 'Complaint Handling Policy', category: 'Safeguarding', file: 'complaint-handling-policy.pdf', size: '159 KB' },
  { title: 'Assessment & Evaluation Policy', category: 'Academics', file: 'assessment-and-evaluation-policy.pdf', size: '127 KB' },
  { title: 'Teaching & Learning Policy', category: 'Academics', file: 'teaching-and-learning-policy.pdf', size: '127 KB' },
  { title: 'Student Promotion Policy', category: 'Academics', file: 'student-promotion-policy.pdf', size: '361 KB' },
  { title: 'Library Policy', category: 'Academics', file: 'library-policy.pdf', size: '265 KB' },
  { title: 'Career Guidance Policy', category: 'Academics', file: 'career-guidance-policy.pdf', size: '264 KB' },
  { title: 'Student Activity Policy', category: 'Student life', file: 'student-activity-policy.pdf', size: '372 KB' },
  { title: 'Incentives & Rewards — Students', category: 'Student life', file: 'student-incentives-and-rewards-policy.pdf', size: '311 KB' },
  { title: 'Admission Policy', category: 'Student life', file: 'admission-policy.pdf', size: '146 KB' },
  { title: 'Hostel Management Policy', category: 'Student life', file: 'hostel-management-policy.pdf', size: '368 KB' },
  { title: 'CPD Policy', category: 'Staff', file: 'cpd-policy.pdf', size: '160 KB' },
  { title: 'Recruitment Policy', category: 'Staff', file: 'recruitment-policy.pdf', size: '165 KB' },
  { title: 'Staff Leave Policy', category: 'Staff', file: 'staff-leave-policy.pdf', size: '322 KB' },
  { title: 'Staff Performance Appraisal Policy', category: 'Staff', file: 'staff-performance-appraisal-policy.pdf', size: '154 KB' },
  { title: 'Stakeholders Feedback Policy', category: 'Governance', file: 'stakeholders-feedback-policy.pdf', size: '355 KB' }
];

const LIBRARIES = {
  sop: {
    title: 'Standard Operating Procedures',
    description: 'Approved step-by-step procedures for consistent academic, administrative, safety, and student-support operations.',
    documents: SOP_DOCUMENTS,
    categories: ['All', 'School-wide', 'Academic', 'Student support', 'Safeguarding', 'Administration', 'Governance'],
    basePath: '/sop',
    countLabel: '18 SOP documents',
    featuredEyebrow: 'Complete SOP collection',
    featuredDescription: 'Open the consolidated School SOP, or browse each operating procedure below.',
    libraryEyebrow: 'SOP library',
    libraryTitle: 'Find an operating procedure',
    searchLabel: 'Search standard operating procedures',
    searchPlaceholder: 'Search SOPs...',
    emptyTitle: 'No procedures found',
    supportTitle: 'Need clarification about a procedure?',
    relatedPath: '/school-policies',
    relatedLabel: 'Browse AES School Policies'
  },
  policies: {
    title: 'AES School Policies',
    description: 'The principles, rules, and institutional commitments that guide safeguarding, academics, staff, and student life.',
    documents: POLICY_DOCUMENTS,
    categories: ['All', 'School-wide', 'Safeguarding', 'Academics', 'Student life', 'Staff', 'Governance'],
    basePath: '/policies',
    countLabel: '20 policy documents',
    featuredEyebrow: 'Complete policy collection',
    featuredDescription: 'Open the consolidated AES School Policies document, or browse individual policies below.',
    libraryEyebrow: 'Policy library',
    libraryTitle: 'Find a school policy',
    searchLabel: 'Search school policies',
    searchPlaceholder: 'Search policies...',
    emptyTitle: 'No policies found',
    supportTitle: 'Need clarification about a policy?',
    relatedPath: '/sop',
    relatedLabel: 'Browse Standard Operating Procedures'
  }
};

function DocumentIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M14 3v6h6M8.5 14h7M8.5 17h5" />
    </svg>
  );
}

function OpenIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" />
    </svg>
  );
}

function DocumentCard({ document, basePath }) {
  const documentUrl = `${basePath}/${document.file}`;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition-colors group-hover:bg-emerald-700 group-hover:text-white">
          <DocumentIcon />
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-600">
          {document.category}
        </span>
      </div>

      <h2 className="mt-5 text-xl font-extrabold leading-snug text-slate-900">{document.title}</h2>
      <p className="mt-2 text-sm text-slate-500">PDF document · {document.size}</p>

      <div className="mt-auto flex flex-wrap gap-3 pt-6">
        <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2" aria-label={`View ${document.title} PDF`}>
          View PDF <OpenIcon />
        </a>
        <a href={documentUrl} download className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2" aria-label={`Download ${document.title} PDF`}>
          Download <DownloadIcon />
        </a>
      </div>
    </article>
  );
}

function DocumentLibraryPage({ library }) {
  const config = LIBRARIES[library];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const featuredDocument = config.documents.find(document => document.featured);
  const libraryTitleId = `${library}-library-title`;

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return config.documents.filter(document => {
      const matchesCategory = category === 'All' || document.category === category;
      const matchesQuery = !normalizedQuery
        || document.title.toLowerCase().includes(normalizedQuery)
        || document.category.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, config.documents, query]);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-3xl bg-emerald-950 px-6 py-14 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-20">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[42px] border-emerald-800/50" />
          <div className="absolute -bottom-24 right-36 h-64 w-64 rounded-full bg-amber-300/10 blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/95 to-slate-950/85" />
          <div className="relative z-10 max-w-4xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-amber-300">Ansar English School</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{config.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-emerald-50/90 lg:text-xl">{config.description}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">{config.countLabel}</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Public PDF access</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">View or download</span>
            </div>
            <Link to={config.relatedPath} className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-amber-300 transition-colors hover:text-white">
              {config.relatedLabel} <OpenIcon />
            </Link>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-widest text-amber-700">{config.featuredEyebrow}</p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{featuredDocument.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{config.featuredDescription}</p>
            </div>
            <a href={`${config.basePath}/${featuredDocument.file}`} target="_blank" rel="noopener noreferrer" className="inline-flex flex-none items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2">
              Open complete document <OpenIcon />
            </a>
          </div>
        </section>

        <section className="mt-12" aria-labelledby={libraryTitleId}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-700">{config.libraryEyebrow}</p>
              <h2 id={libraryTitleId} className="mt-2 text-3xl font-extrabold text-slate-900">{config.libraryTitle}</h2>
              <p className="mt-2 text-slate-600">Search by name or filter the collection by subject.</p>
            </div>
            <label className="relative block w-full lg:w-80">
              <span className="sr-only">{config.searchLabel}</span>
              <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
              </svg>
              <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={config.searchPlaceholder} className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" aria-label={`${config.title} categories`}>
            {config.categories.map(item => {
              const count = item === 'All' ? config.documents.length : config.documents.filter(document => document.category === item).length;
              const selected = category === item;
              return (
                <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={selected} className={`rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${selected ? 'bg-emerald-700 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800'}`}>
                  {item} <span className={selected ? 'text-emerald-100' : 'text-slate-400'}>{count}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-sm font-semibold text-slate-500" aria-live="polite">Showing {filteredDocuments.length} of {config.documents.length} documents</p>

          {filteredDocuments.length ? (
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredDocuments.map(document => <DocumentCard key={document.file} document={document} basePath={config.basePath} />)}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <h3 className="text-xl font-extrabold text-slate-900">{config.emptyTitle}</h3>
              <p className="mt-2 text-slate-600">Try a different search term or select another category.</p>
              <button type="button" onClick={() => { setQuery(''); setCategory('All'); }} className="mt-5 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">Clear filters</button>
            </div>
          )}
        </section>

        <section className="mt-14 rounded-2xl bg-slate-900 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-300">Document support</p>
              <h2 className="mt-2 text-2xl font-extrabold">{config.supportTitle}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">Contact the school office for the latest approved interpretation, applicability, or document verification.</p>
            </div>
            <Link to="/contact" className="inline-flex flex-none items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-amber-300">Contact school office</Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export function SchoolPoliciesPage() {
  return <DocumentLibraryPage library="policies" />;
}

export default function SopPage() {
  return <DocumentLibraryPage library="sop" />;
}
