import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-init';

const DEFAULT_STAFF = [
  { name: 'SHYNI PK', role: 'Librarian', qualification: 'MLIS', contact: '9400566641', imageUrl: '' },
  { name: 'DARSANA K KRISHNAN', role: 'Assistant librarian', qualification: 'BSC, B.Lib.I.Sc, MLIS, NET.', contact: '9656548908', imageUrl: '' },
  { name: 'SUHARA M', role: 'Library Assistant', qualification: 'BA', contact: '8907533513', imageUrl: '' }
];

export default function LibraryContactSection() {
  const [staff, setStaff] = useState(DEFAULT_STAFF);
  useEffect(() => onSnapshot(doc(db, 'librarySettings', 'main'), shot => {
    if (!shot.exists()) return;
    try { const parsed = JSON.parse(shot.data().staffMembers || ''); if (Array.isArray(parsed) && parsed.length) setStaff(parsed); } catch { /* keep built-in directory */ }
  }, () => {}), []);
  return <section className="border-t border-emerald-100 bg-white py-16" aria-labelledby="library-contact-title"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><p className="text-sm font-black uppercase tracking-widest text-emerald-700">Get in touch</p><h2 id="library-contact-title" className="mt-3 text-3xl font-extrabold text-emerald-950 sm:text-4xl">Meet the Library team</h2><p className="mt-4 max-w-md leading-7 text-slate-600">Visit the Library desk for help finding a resource, renewing a book or exploring our digital collections.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{staff.map((member, index) => <article key={`${member.name}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-[#f7faf8] shadow-sm">{member.imageUrl ? <img src={member.imageUrl} alt={member.name} className="aspect-[4/3] w-full object-cover" /> : <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-emerald-950 to-emerald-700 text-5xl font-black text-amber-300">{String(member.name || '?').trim().charAt(0)}</div>}<div className="p-5"><h3 className="font-extrabold text-slate-900">{member.name}</h3><p className="mt-1 text-sm font-bold text-emerald-700">{member.role}</p><p className="mt-3 text-sm text-slate-600">Qualification: {member.qualification}</p><a href={`tel:${member.contact}`} className="mt-3 block text-sm font-extrabold text-slate-800 hover:text-emerald-700">☎ {member.contact}</a></div></article>)}</div></div></div></section>;
}
