import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from './Layout';
import { STAFF_DIRECTORY } from './staffData';

const SECTION_ORDER = [
  'All Sections',
  'Senior Secondary',
  'Secondary',
  'Upper Primary',
  'Primary',
  'Lower Primary',
  'Sprouts',
  'School CCA'
];

const GROUPS = [
  { id: 'heads', title: 'School Leadership', eyebrow: 'Heads', description: 'Academic and institutional leadership across every school section.' },
  { id: 'counsellors', title: 'Student Counsellors', eyebrow: 'Counsellors', description: 'Professionals supporting students’ academic, personal, and emotional wellbeing.' },
  { id: 'teachers', title: 'Teaching Faculty', eyebrow: 'Teaching Staff', description: 'Our educators, special educators, coordinators, and subject specialists.' },
  { id: 'pe', title: 'Physical Education Faculty', eyebrow: 'PE Staff', description: 'Faculty guiding physical education, fitness, sports, and active learning.' }
];

const ACRONYMS = new Set(['CCA', 'PE', 'MS', 'KG', 'AI', 'EVS', 'GS']);

function displayText(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase())
    .split(' ')
    .map(word => ACRONYMS.has(word.toUpperCase()) ? word.toUpperCase() : word)
    .join(' ');
}

function normalizeSection(value) {
  return displayText(value);
}

function getGroup(member) {
  const designation = member.designation.toLowerCase();
  const subject = member.subject.toLowerCase();
  if (designation.includes('counsellor')) return 'counsellors';
  if (subject.includes('physical education') || designation.includes('physical education')) return 'pe';
  if (subject === 'heads' || designation.includes('principal') || designation.includes('head') || designation.includes('manager sports academy')) return 'heads';
  return 'teachers';
}

function StaffTable({ members }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="bg-emerald-950 text-white">
            <tr>
              {['Name', 'Designation', 'Subject', 'Section'].map(label => (
                <th key={label} className="px-5 py-4 text-xs font-black uppercase tracking-widest">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member, index) => (
              <tr key={`${member.name}-${member.section}-${index}`} className="transition-colors odd:bg-white even:bg-slate-50/70 hover:bg-emerald-50">
                <td className="px-5 py-4 font-extrabold text-slate-900">{displayText(member.name)}</td>
                <td className="px-5 py-4 text-sm font-semibold text-slate-600">{displayText(member.designation)}</td>
                <td className="px-5 py-4 text-sm font-semibold text-slate-600">{member.subject.toLowerCase() === 'heads' ? 'Administration' : displayText(member.subject)}</td>
                <td className="px-5 py-4"><span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">{normalizeSection(member.section)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Staff() {
  const location = useLocation();
  const requestedSection = new URLSearchParams(location.search).get('section')?.toLowerCase() === 'sprouts' ? 'Sprouts' : 'All Sections';
  const [section, setSection] = useState(requestedSection);
  const [search, setSearch] = useState('');

  useEffect(() => setSection(requestedSection), [requestedSection]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return STAFF_DIRECTORY.filter(member => {
      const matchesSection = section === 'All Sections' || normalizeSection(member.section) === section;
      const matchesSearch = !term || [member.name, member.designation, member.subject, member.section].some(value => value.toLowerCase().includes(term));
      return matchesSection && matchesSearch;
    });
  }, [search, section]);

  return (
    <Layout>
      <main className="bg-slate-50 pb-20">
        <section className="bg-emerald-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">Ansar Family</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">Meet Our Faculty</h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-emerald-50/85">{section === 'Sprouts' ? 'Meet the dedicated faculty who nurture and guide children in Ansar Sprouts.' : 'Meet the leadership, counsellors, teachers, and physical education faculty who serve our students across every section of Ansar English School.'}</p>
            <div className="mt-8 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-50">Academic Year 2026–27 · {STAFF_DIRECTORY.length} Faculty Members</div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="relative z-10 -mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
            <label htmlFor="staff-search" className="text-xs font-black uppercase tracking-widest text-slate-500">Find a faculty member</label>
            <input id="staff-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by name, designation, subject, or section…" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100" />
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Filter faculty by section">
              {SECTION_ORDER.map(item => (
                <button key={item} type="button" onClick={() => setSection(item)} className={`flex-none rounded-full px-4 py-2 text-sm font-extrabold transition ${section === item ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>{item}</button>
              ))}
            </div>
          </section>

          <div className="mt-14 space-y-16">
            {GROUPS.map(group => {
              const members = filtered.filter(member => getGroup(member) === group.id);
              if (!members.length) return null;
              return (
                <section key={group.id} id={group.id} className="scroll-mt-32">
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">{group.eyebrow}</p>
                      <h2 className="mt-2 text-3xl font-black text-slate-950">{group.title}</h2>
                      <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">{group.description}</p>
                    </div>
                    <span className="w-fit rounded-full bg-slate-200 px-3 py-1.5 text-xs font-black text-slate-600">{members.length} {members.length === 1 ? 'Member' : 'Members'}</span>
                  </div>
                  <StaffTable members={members} />
                </section>
              );
            })}

            {!filtered.length && <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center"><h2 className="text-2xl font-black text-slate-900">No faculty members found</h2><p className="mt-2 text-slate-500">Try another name, subject, or section.</p></div>}
          </div>
        </div>
      </main>
    </Layout>
  );
}
