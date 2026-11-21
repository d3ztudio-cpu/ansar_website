import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import ContentPageLayout from './ContentPageLayout';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useSettings } from './SettingsContext';

const DEFAULT_FEE_STRUCTURE_URL = 'https://drive.google.com/file/d/1BlRQIlD4U4RjRGvVIq2Kah4xYxNjChoa/view?usp=drive_link';
const DEFAULT_FEE_STRUCTURE_TITLE = 'Fee Structure 2026 - 2027';
const ADMISSION_SOP_URL = 'https://drive.google.com/file/d/1eM6K3YL_JO-VgTJD9wO_iS1s01hRMO5s/view?usp=drive_link';
const DEFAULT_PROSPECTUS_YEAR = '2027 - 2028';
const DEFAULT_PROSPECTUS_DESCRIPTION = 'Read the official prospectus for admissions, school information, programmes, facilities, and important guidance for the 2027 - 2028 academic year.';
const FEE_PAYMENT_PORTAL_URL = 'https://ansartrust.atcampussolutions.com/school/';
const FEE_PAYMENT_TUTORIAL_URL = 'https://www.youtube.com/embed/dwqhwvvNIvI';

export const ADMISSION_POLICY_SECTIONS = [
  { number: '01', title: 'Vision and Core Principles', items: [
    ['Vision statement', 'Our school envisions nurturing students to thrive as creative and value-driven citizens who can adapt and excel in a diverse and rapidly changing world. The admission policy reflects this vision by ensuring inclusivity, transparency, and equal opportunity.'],
    ['Compliance and transparency', 'The school shall follow a fair, transparent, and merit-based admission process in compliance with NEP and CBSE guidelines and government regulations.'],
    ['Inclusivity', 'Admissions will be open to all children irrespective of caste, creed, religion, gender, or socio-economic background, upholding the principle of inclusivity.'],
    ['Public information', 'The school shall publicize admission criteria, age eligibility, and procedure well in advance through official notice boards, website, and other communication channels.']
  ] },
  { number: '02', title: 'Admission Procedures and Assessment', items: [
    ['Entry-level classes', 'Admissions to entry-level classes (Pre-KG to Class I) will be based on age eligibility and interaction with the child and parents, not on formal testing.'],
    ['Higher classes', 'For higher classes, admissions shall be granted on the basis of vacancies, prior academic record, and a diagnostic assessment to understand the child’s learning needs.'],
    ['Priority system', 'A priority system may be applied for siblings of existing students, children of staff, alumni wards, and those residing in the local community, without compromising merit and fairness.']
  ] },
  { number: '03', title: 'Timeline and Special Category Admissions', items: [
    ['Academic schedule', 'Admissions are generally granted at the beginning of the academic year, from March to May.'],
    ['Mid-year admissions', 'Mid-year admissions for Pre-KG to Class IX and Class XI are considered only in genuine cases of transfer of residence, with applications accepted until October.'],
    ['Classes X and XII', 'Admission is granted only in rare transfer-of-residence cases, provided a vacancy exists and the application follows CBSE direct-admission guidelines.'],
    ['Deprived-section support', 'The school shall provide admission to students belonging to the deprived section of society, supported by the APF - Ansar Poor Fund.'],
    ['Orphan admissions', 'Admission to orphans shall be given through the Ansar Care initiative, which is funded by the Ansar Alumni.'],
    ['Special learning needs', 'Children with Special Learning Needs (CWSN), abilities or challenges shall be given admission on a case-by-case basis under the guidance of the school counsellor and following the CBSE guidelines.'],
    ['Orientation and integration', 'The school shall provide counseling and orientation to newly admitted students and parents to ensure smooth integration into the learning environment.']
  ] },
  { number: '04', title: 'Age Criteria', items: [
    ['Age calculation', 'Candidates shall meet the stipulated age requirement for admission to Ansar English School as on June 1st of that year. The stipulated age limit may be relaxed at the discretion of the School Admission Committee based on past academic achievements and performance in our testing procedures, provided the student has graduated from a recognized school.']
  ] },
  { number: '05', title: 'Record Keeping and Policy Governance', items: [
    ['Record maintenance', 'Records of all applications and admissions are systematically maintained for audit, review, and compliance.'],
    ['Annual review', 'The School Admission Committee reviews the admission process annually to ensure effectiveness, transparency, and alignment with the school’s vision.']
  ] }
];

export const ADMISSION_AGE_TABLE = [
  ['Pre-KG', '3 years'], ['LKG', '4 years'], ['UKG', '5 years'], ['Class I', '6 years'],
  ['Class II', '7 years'], ['Class III', '8 years'], ['Class IV', '9 years'], ['Class V', '10 years'],
  ['Class VI', '11 years'], ['Class VII', '12 years'], ['Class VIII', '13 years'], ['Class IX', '14 years'],
  ['Class X', '15 years'], ['Class XI', '16 years'], ['Class XII', '17 years']
];

function AdmissionPolicySection({ settings }) {
  const sections = settings?.admissionPolicySections?.length ? settings.admissionPolicySections : ADMISSION_POLICY_SECTIONS;
  const ageTable = settings?.admissionPolicyAgeTable?.length ? settings.admissionPolicyAgeTable : ADMISSION_AGE_TABLE;
  const revision = settings?.admissionPolicyRevision || 'Rev 01';
  const ref = settings?.admissionPolicyRef || 'AES/ADM/PO/Rev01';
  const preparedBy = settings?.admissionPolicyPreparedBy || 'Ms. Shabitha M M';
  const approvedBy = settings?.admissionPolicyApprovedBy || 'Mr. Feroze E M';
  const revisionDate = settings?.admissionPolicyRevisionDate || 'November 20, 2026';
  return (
    <section id="admission-policy" className="mb-16 scroll-mt-24 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl">
      <div className="bg-emerald-950 px-6 py-8 text-white sm:px-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Official policy · {revision} · {ref}</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">Admission Policy</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-emerald-50/85">A clear framework for inclusive, transparent, and fair admissions at Ansar English School, Perumpilavu.</p>
      </div>
      <div className="space-y-5 p-5 sm:p-8">
        {sections.map(section => (
          <article key={section.number} className="rounded-2xl border border-slate-200 p-5 sm:p-6">
            <div className="flex gap-4"><span className="text-sm font-black text-amber-600">{section.number}</span><div className="min-w-0 flex-1"><h3 className="text-xl font-extrabold text-emerald-950">{section.title}</h3><div className="mt-4 grid gap-4 md:grid-cols-2">{section.items.map(([label, text]) => <div key={label}><p className="text-sm font-extrabold text-slate-900">{label}</p><p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p></div>)}</div></div></div>
          </article>
        ))}
        <div className="grid gap-6 rounded-2xl bg-slate-50 p-5 sm:p-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div><h3 className="text-xl font-extrabold text-emerald-950">Age criteria by class</h3><p className="mt-2 text-sm text-slate-600">Minimum age as of June 1 of the academic year.</p><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{ageTable.map(([klass, age]) => <div key={klass} className="rounded-xl border border-slate-200 bg-white px-3 py-2"><p className="text-xs font-bold text-slate-500">{klass}</p><p className="mt-1 text-sm font-black text-emerald-800">{age}</p></div>)}</div></div>
          <div className="border-t border-slate-200 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"><h3 className="text-xl font-extrabold text-emerald-950">Policy record</h3><dl className="mt-4 space-y-3 text-sm"><div><dt className="font-bold text-slate-500">Prepared by</dt><dd className="font-extrabold text-slate-900">{preparedBy}</dd></div><div><dt className="font-bold text-slate-500">Approved by</dt><dd className="font-extrabold text-slate-900">{approvedBy}</dd></div><div><dt className="font-bold text-slate-500">Revision date</dt><dd className="font-extrabold text-slate-900">{revisionDate}</dd></div></dl></div>
        </div>
      </div>
    </section>
  );
}

const ADMISSION_FAQS = [
  {
    group: 'General Admission & Eligibility',
    items: [
      {
        question: 'What is the general admission criteria at Ansar English School?',
        answer: 'Admissions are open to all children regardless of caste, creed, religion, gender, or socio-economic background, in alignment with NEP and CBSE guidelines.'
      },
      {
        question: 'What is the age requirement for entry-level and higher classes?',
        answer: 'Candidates must meet the minimum age requirement calculated as of June 1st of the academic year: Pre-KG 3 years, LKG 4 years, UKG 5 years, and Class I 6 years. For Class II \u2013 XII it increases incrementally per grade \u2014 7 years for Class II, 11 years for Class VI, up to 17 years for Class XII. Age limits may be relaxed at the discretion of the School Admission Committee for students transferring from a recognized school based on past performance.'
      },
      {
        question: 'Is there an entrance test for entry-level admissions?',
        answer: 'No. Admissions to entry-level classes (Pre-KG to Class I) are based solely on age eligibility and an informal interaction with the child and parents. No formal testing is conducted.'
      },
      {
        question: 'How are admissions processed for higher classes (Class II and above)?',
        answer: 'Admission to higher classes depends on seat availability, past academic performance, and a diagnostic assessment to understand the student\u2019s learning needs.'
      }
    ]
  },
  {
    group: 'Timelines & Mid-Year Admissions',
    items: [
      {
        question: 'When does the admission process take place?',
        answer: 'Regular admissions are processed at the beginning of the academic year, typically between March and May.'
      },
      {
        question: 'Can I apply for mid-year admission?',
        answer: 'Mid-year admissions for Pre-KG to Class IX and Class XI are considered only under genuine transfer-of-residence circumstances, with applications accepted until October.'
      },
      {
        question: 'Can students be admitted directly into Class X or Class XII?',
        answer: 'Admissions to Classes X and XII are granted only in rare cases involving a transfer of residence, provided a vacancy exists and the transfer complies with CBSE direct admission guidelines.'
      }
    ]
  },
  {
    group: 'Priorities, Financial Support & Special Inclusion',
    items: [
      {
        question: 'Does the school offer priority in admissions?',
        answer: 'Yes, a priority framework may be applied for siblings of current students, children of staff members, wards of alumni, and local community residents, while maintaining fairness and merit.'
      },
      {
        question: 'Are financial assistance or scholarships available for underprivileged students?',
        answer: 'Yes. Ansar English School provides admission to economically disadvantaged students supported by the Ansar Poor Fund (APF). Additionally, admission for orphans is supported through the Ansar Care initiative funded by the Ansar Alumni.'
      },
      {
        question: 'What is the admission policy for Children with Special Learning Needs (CWSN)?',
        answer: 'Admissions for children with special learning needs or challenges are evaluated on a case-by-case basis under the guidance of the school counselor and in strict adherence to CBSE guidelines.'
      },
      {
        question: 'How does the school help new students adjust to the school environment?',
        answer: 'The school provides structured counseling and orientation sessions for newly admitted students and parents to support a smooth transition and integration into the academic community.'
      }
    ]
  }
];

function getDriveFileId(url = '') {
  const match = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  return match ? match[1] : '';
}

function getDriveDownloadUrl(url = '') {
  const fileId = getDriveFileId(url);
  if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
  return url;
}

function FeeStructureActions({ title, url, onDownload }) {
  if (!url) return null;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-emerald-600 text-white">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" /></svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-widest text-emerald-700">Admission Document</p>
          <h2 className="mt-2 text-2xl font-extrabold text-emerald-950">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">View the official fee structure in Google Drive or download a copy for reference.</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          View Fee Structure
        </a>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download
        </button>
        <a
          href={ADMISSION_SOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-emerald-950 transition-colors hover:bg-amber-300 sm:col-span-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2Zm7 0v6h6M8.5 14h7M8.5 17h5" /></svg>
          View Admission SOP
        </a>
      </div>
    </div>
  );
}

function ProspectusActions({ year, description, url, onDownload }) {
  return (
    <section id="prospectus" className="scroll-mt-24 rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6 shadow-lg sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">Admissions Prospectus</p>
          <h2 className="mt-2 text-3xl font-black text-emerald-950">Prospectus {year}</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">{description}</p>
        </div>
      </div>
      {!url && <p className="mt-5 rounded-xl border border-amber-200 bg-amber-100/60 p-3 text-sm font-semibold text-amber-900">The prospectus will be available here once the latest PDF is published.</p>}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a href={url || undefined} aria-disabled={!url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white ${url ? 'bg-slate-900 hover:bg-slate-800' : 'pointer-events-none bg-slate-300'}`}>View Prospectus</a>
        <button type="button" disabled={!url} onClick={onDownload} className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-200">Download Prospectus</button>
      </div>
    </section>
  );
}

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`overflow-hidden rounded-2xl border transition-colors ${isOpen ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 bg-white hover:border-emerald-200'}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-base font-bold text-slate-900">{question}</span>
        <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-full transition-all ${isOpen ? 'rotate-45 bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p className="text-sm leading-relaxed text-slate-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

function AdmissionFaqSection() {
  const [openFaqKey, setOpenFaqKey] = useState(null);

  return (
    <section className="mb-16 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
      <div className="mb-10 text-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Frequently Asked Questions</p>
        <h2 className="mt-2 text-3xl font-black text-emerald-950">Admission FAQs</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">Everything parents need to know about admissions at Ansar English School, based on our official admission policy.</p>
      </div>

      <div className="space-y-10">
        {ADMISSION_FAQS.map((group) => (
          <div key={group.group}>
            <h3 className="mb-4 flex items-center gap-3 text-lg font-extrabold text-slate-900">
              <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-emerald-500 to-amber-400" aria-hidden="true" />
              {group.group}
            </h3>
            <div className="space-y-3">
              {group.items.map((faq, index) => {
                const faqKey = `${group.group}-${index}`;
                return (
                  <FaqItem
                    key={faqKey}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFaqKey === faqKey}
                    onToggle={() => setOpenFaqKey(openFaqKey === faqKey ? null : faqKey)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 p-8 text-center shadow-lg sm:p-10">
        <h3 className="text-xl font-extrabold text-white sm:text-2xl">If you have any other queries, feel free to contact us</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">Our admissions team is happy to help you with anything that is not covered in the questions above.</p>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 font-bold text-white shadow-md transition-colors hover:bg-emerald-700 hover:shadow-lg"
        >
          Contact Us
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export default function Admission() {
  const { data: pages } = useFirestoreCollection('pages');
  const page = pages.find(p => p.slug === 'admission');
  const settings = useSettings();
  const feeStructureUrl = settings?.feeStructurePdfUrl?.trim() || DEFAULT_FEE_STRUCTURE_URL;
  const feeStructureTitle = settings?.feeStructureTitle?.trim() || DEFAULT_FEE_STRUCTURE_TITLE;
  const prospectusYear = settings?.prospectusYear?.trim() || DEFAULT_PROSPECTUS_YEAR;
  const prospectusDescription = settings?.prospectusDescription?.trim() || DEFAULT_PROSPECTUS_DESCRIPTION;
  const prospectusPdfUrl = settings?.prospectusPdfUrl?.trim() || '';
  const [isFeePaymentModalOpen, setIsFeePaymentModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  React.useEffect(() => {
    if (!isFeePaymentModalOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsFeePaymentModalOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isFeePaymentModalOpen]);

  const closeFeePaymentModal = () => {
    setIsFeePaymentModalOpen(false);
    setIsTutorialOpen(false);
  };

  const openGooglePay = () => {
    window.location.href = 'tez://upi/pay';
    closeFeePaymentModal();
  };

  const handlePdfDownload = (url) => {
    if (!url) return;
    const downloadUrl = url.includes('drive.google.com') ? getDriveDownloadUrl(url) : url;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.target = '_blank';
    a.download = url === prospectusPdfUrl ? `Ansar_Prospectus_${prospectusYear.replace(/\s+/g, '_')}.pdf` : 'Ansar_Fee_Structure.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (page?.useLegacyAdmissionLayout) {
    return (
      <Layout>
        <ContentPageLayout
          page={page}
          eyebrow="Admissions"
          sidebar={(
            <>
              <FeeStructureActions title={feeStructureTitle} url={feeStructureUrl} onDownload={() => handlePdfDownload(feeStructureUrl)} />
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-900">Admissions Office</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">Contact the school office for application support, eligibility, and document verification.</p>
                <Link to="/contact" className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700">Contact Office</Link>
              </div>
            </>
          )}
        >
          <div
            className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-emerald-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
          />
          <AdmissionPolicySection settings={settings} />
          <div className="mt-6">
            <ProspectusActions year={prospectusYear} description={prospectusDescription} url={prospectusPdfUrl} onDownload={() => handlePdfDownload(prospectusPdfUrl)} />
          </div>
          <div className="mt-6">
            <FeeStructureActions title={feeStructureTitle} url={feeStructureUrl} onDownload={() => handlePdfDownload(feeStructureUrl)} />
          </div>
        </ContentPageLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

        {/* Page header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-600">Join Our Family</p>
          <h1 className="text-4xl font-extrabold text-slate-900 lg:text-5xl">Admissions</h1>
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" aria-hidden="true"></div>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">A clear, supportive admission journey into a learning community built on excellence, values, care, and opportunity.</p>
        </div>

        {/* Hero + quick actions card */}
        <section className="mb-12 overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white shadow-lg ring-1 ring-emerald-50">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Admission Window</h2>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-600">January 01 — March 31</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">Our team guides every family through eligibility, assessment, documentation, and enrollment — a confident first step toward a bright future.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-0 lg:flex-1">
              <button
                type="button"
                onClick={() => setIsFeePaymentModalOpen(true)}
                className="group flex h-full flex-col gap-2 rounded-xl border border-slate-100 border-t-4 border-t-amber-500 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V6a3 3 0 00-3-3H6a3 3 0 00-3 3v10a3 3 0 003 3z" />
                  </svg>
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Online Payments</span>
                <span className="whitespace-nowrap text-sm font-extrabold leading-5 tracking-tight text-slate-900">Fee Payment</span>
              </button>
              <Link
                to="/contact"
                className="group flex h-full flex-col gap-2 rounded-xl border border-slate-100 border-t-4 border-t-emerald-500 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                  </svg>
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Talk to Us</span>
                <span className="whitespace-nowrap text-sm font-extrabold leading-5 tracking-tight text-slate-900">Admissions Office</span>
              </Link>
              <a
                href={feeStructureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-2 rounded-xl border border-slate-100 border-t-4 border-t-sky-500 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:shadow-md"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-700 transition-colors group-hover:bg-sky-600 group-hover:text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Official Document</span>
                <span className="whitespace-nowrap text-sm font-extrabold leading-5 tracking-tight text-slate-900">Fee Structure</span>
              </a>
            </div>
          </div>
        </section>

        {isFeePaymentModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeFeePaymentModal();
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="fee-payment-modal-title"
              className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 bg-gradient-to-br from-emerald-950 to-emerald-800 px-6 py-5 text-white sm:px-8">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Online Payments</p>
                  <h2 id="fee-payment-modal-title" className="mt-1 text-2xl font-black">Online Fee Payment</h2>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">Tutorial video</span>
                  <button
                    type="button"
                    aria-label="Open fee payment tutorial video"
                    aria-expanded={isTutorialOpen}
                    onClick={() => setIsTutorialOpen((open) => !open)}
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/30 text-lg font-bold transition-colors hover:bg-white/15"
                  >
                    ℹ
                  </button>
                </div>
              </div>

              <div className="max-h-[85vh] space-y-3 overflow-y-auto p-6 sm:p-8">
                {isTutorialOpen && (
                  <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="aspect-[9/16] max-h-[420px] w-full sm:aspect-video">
                      <iframe
                        className="h-full w-full"
                        src={FEE_PAYMENT_TUTORIAL_URL}
                        title="How to make an online fee payment"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
                <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-slate-700 sm:p-6">
                  <h3 className="text-base font-black text-slate-900">Online Fee Payment Guidelines</h3>
                  <p className="mt-2">Those who wish to pay school fees online can choose any of the following methods. This will make paying fees easier and help avoid delays and confusion in receipt generation.</p>
                  <h4 className="mt-4 font-black text-slate-900">(1) BBPS (Google Pay / PhonePe / Paytm)</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Search &amp; find: <strong>Ansar English School, Thrissur</strong></li>
                    <li>Enter Admission No. &amp; Mobile Number as in the school profile</li>
                    <li>Select Fee Type: Due till date</li>
                  </ul>
                  <h4 className="mt-4 font-black text-slate-900">(2) School Software</h4>
                  <p className="mt-2">Log in through the Parent Login link using the student&apos;s <strong>Admission Number</strong> and <strong>Date of Birth</strong> to pay the fees.</p>
                  <h4 className="mt-4 font-black text-slate-900">Important Notes</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Those who pay fees using any of the above methods do not need to send details via WhatsApp.</li>
                    <li>Fees should not be paid directly into the school&apos;s bank account.</li>
                  </ul>
                  <div className="mt-6 border-t border-amber-200 pt-5" lang="ml">
                    <h4 className="mt-3 font-black text-slate-900">ഓൺലൈൻ ഫീസ് അടവ് (Online Fee Payment)</h4>
                    <p className="mt-2">സ്കൂൾ ഫീസ് ഓൺലൈനിൽ അടക്കാനാഗ്രഹിക്കുന്നവർക്ക് താഴെ പറയുന്ന ഏതെങ്കിലും ഒരു രീതി സ്വീകരിക്കാവുന്നതാണ്. ഫീസ് അടക്കുന്നത് കൂടുതൽ എളുപ്പമാകുന്നതിനും ഫീസ് വരവ് വെക്കുന്നതിലെ കാലതാമസവും ആശയക്കുഴപ്പങ്ങളും ഒഴിവാക്കുന്നതിനും ഇത് കൂടുതൽ സഹായകമാവും.</p>
                    <h4 className="mt-4 font-black text-slate-900">(1) BBPS (Google Pay / PhonePe / Paytm)</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>Search &amp; Find: <strong>Ansar English School, Thrissur</strong></li>
                      <li>Admission No. &amp; Mob. Number (As in the school profile)</li>
                      <li>Fee Type (Due till date)</li>
                    </ul>
                    <h4 className="mt-4 font-black text-slate-900">(2) School Software</h4>
                    <p className="mt-2"><a href={FEE_PAYMENT_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-700 underline">ഈ Parent Login ലിങ്കിൽ</a> കുട്ടിയുടെ അഡ്മിഷൻ നമ്പർ, ജനന തീയതി എന്നിവ ഉപയോഗിച്ച് പേരന്റ് ലോഗിൻ ചെയ്യാവുന്നതും ഫീസ് അടയ്ക്കാവുന്നതുമാണ്.</p>
                    <h4 className="mt-4 font-black text-slate-900">പ്രത്യേക ശ്രദ്ധയ്ക്ക്</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>മേൽ പറഞ്ഞ ഏതെങ്കിലും രീതിയിൽ ഫീസ് അടക്കുന്നവർ അതുസംബന്ധമായ വിവരങ്ങൾ വാട്സ്ആപ്പ് ചെയ്യേണ്ടതില്ല.</li>
                      <li>സ്കൂൾ ബാങ്ക് അക്കൗണ്ടിലേക്ക് നേരിട്ട് ഫീസ് അടയ്ക്കേണ്ടതില്ല.</li>
                    </ul>
                  </div>
                </div>
                <button type="button" onClick={openGooglePay} className="flex w-full items-center justify-between rounded-2xl bg-emerald-600 px-5 py-4 text-left font-extrabold text-white shadow-md transition-colors hover:bg-emerald-700">
                  <span><span className="block text-base">Open Google Pay</span><span className="mt-0.5 block text-xs font-medium text-emerald-100">Launch the Google Pay app</span></span>
                  <span aria-hidden="true" className="text-xl">→</span>
                </button>
                <a href={FEE_PAYMENT_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left font-extrabold text-slate-900 transition-colors hover:border-emerald-300 hover:bg-emerald-50">
                  <span><span className="block text-base">Go to Fee Portal</span><span className="mt-0.5 block text-xs font-medium text-slate-500">Open the school payment portal</span></span>
                  <span aria-hidden="true" className="text-xl text-emerald-600">↗</span>
                </a>
                <button type="button" onClick={closeFeePaymentModal} className="w-full rounded-2xl px-5 py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">Cancel / Close</button>
              </div>
            </div>
          </div>
        )}

        {page?.bodyHtml && (
          <section className="mb-16 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">About admissions</p>
            <div className="prose prose-slate prose-lg mt-5 max-w-none prose-headings:text-emerald-950 prose-a:text-emerald-600 prose-img:rounded-2xl" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
          </section>
        )}

        <div className="mb-16"><ProspectusActions year={prospectusYear} description={prospectusDescription} url={prospectusPdfUrl} onDownload={() => handlePdfDownload(prospectusPdfUrl)} /></div>

        <AdmissionPolicySection settings={settings} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 academics-card">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Your admission journey</p>
              <h2 className="mb-8 mt-2 text-3xl font-black text-emerald-950">Three clear steps to enrollment</h2>
              <div className="space-y-6">
                <div className="flex gap-5 rounded-2xl border border-slate-100 p-5 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">1</div>
                  <div><h3 className="font-bold text-slate-900 text-lg">Submit Application</h3><p className="text-slate-600 mt-1">Applications are open annually from <strong>Jan 01 to March 31</strong>. Apply online or submit a physical form detached from our school prospectus.</p></div>
                </div>
                <div className="flex gap-5 rounded-2xl border border-slate-100 p-5 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">2</div>
                  <div><h3 className="font-bold text-slate-900 text-lg">Attend Assessment</h3><p className="text-slate-600 mt-1">For students entering above LKG, a language proficiency and diagnostic assessment is mandatory to understand learning needs.</p></div>
                </div>
                <div className="flex gap-5 rounded-2xl border border-slate-100 p-5 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">3</div>
                  <div><h3 className="font-bold text-slate-900 text-lg">Finalize Enrollment</h3><p className="text-slate-600 mt-1">Upon successful assessment, submit the required documents to our school office to secure your child's seat.</p></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white academics-card">
              <h2 className="text-xl font-bold mb-6 text-emerald-400">Eligibility by Class and Age</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-3 font-bold text-emerald-300">Class</th>
                      <th className="pb-3 font-bold text-emerald-300">Minimum Age</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr className="border-b border-slate-700/60"><td className="pb-3 font-semibold text-slate-100">Pre KG</td><td className="pb-3 font-bold text-slate-100">3</td></tr>
                    <tr className="border-b border-slate-700/60"><td className="pb-3 font-semibold text-slate-100">Jr. KG</td><td className="pb-3 font-bold text-slate-100">4</td></tr>
                    <tr className="border-b border-slate-700/60"><td className="pb-3 font-semibold text-slate-100">Sr. KG</td><td className="pb-3 font-bold text-slate-100">5</td></tr>
                    <tr><td className="pb-3 font-semibold text-slate-100">Std. I</td><td className="pb-3 font-bold text-slate-100">6</td></tr>
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-slate-400 italic">*Age computed as of June 1st of the academic year.</p>
              </div>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 academics-card">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Documentation Required for Admission</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li className="flex items-start gap-3"><svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="text-slate-600"><strong>KG &amp; Std. I</strong> — Copy of the Birth Certificate &amp; Copy of the Aadhaar Card. Also 4 passport size photos.</span></li>
                <li className="flex items-start gap-3"><svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="text-slate-600"><strong>Std. II to Std. IX</strong> — Transfer Certificate (TC) from a recognised school, Copy of the Birth Certificate, Copy of the Aadhaar Card and Passport Size Photo.</span></li>
                <li className="flex items-start gap-3"><svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="text-slate-600"><strong>Std. XI</strong> — Attested copy of the Std. X Mark List, Transfer Certificate (TC), Conduct Certificate (CC), Copy of the Aadhaar Card and Passport Size Photo.</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">              <div className="bg-emerald-50 p-8 rounded-3xl shadow-sm border border-emerald-100 academics-card text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="text-xl font-bold text-emerald-950 mb-3">Fees & Financial Aid</h2>
              <p className="text-slate-600 text-sm mb-6">Ansar Charitable Trust delivers free education to orphans and targeted financial aid to disadvantaged learners.</p>
              <div className="grid grid-cols-1 gap-3">
                <a href={feeStructureUrl} target="_blank" rel="noopener noreferrer" className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-slate-800 sm:text-base">
                  View {feeStructureTitle}
                </a>
                <button
                  onClick={() => handlePdfDownload(feeStructureUrl)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Download Fee Structure
                </button>
                <a
                  href={ADMISSION_SOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-emerald-950 shadow-md transition-colors hover:bg-amber-300 sm:text-base"
                >
                  View Admission SOP
                </a>
              </div>
            </div>
          </div>
        </div>

        <AdmissionFaqSection />
      </div>
    </Layout>
  );
}
