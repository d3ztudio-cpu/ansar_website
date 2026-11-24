import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminFieldUndo from './AdminFieldUndo';
import AdminUndoCenter from './AdminUndoCenter';
import NotificationsBell from './NotificationsBell';

const navGroups = [
  ['Overview & Analytics', [['Dashboard','/admin/dashboard'],['Analytics & SEO','/admin/analytics']]],
  ['HR & Recruitment', [['Careers & Recruitment','/admin/careers'],['Staff Exams','/admin/ansar-media-production/add-ons/staff-exams'],['Transport Staff','/admin/transport-staff']]],
  ['Academics & Admissions', [['Academics & Admissions','/admin/academics'],['Prospectus','/admin/prospectus'],['Admission Policy','/admin/admission-policy'],['Student-Centric Learning','/admin/learning-features'],['Learning Labs','/admin/learning-labs'],['ATL','/admin/atl'],['Ansar Sprouts','/admin/ansar-sprouts'],['Library','/admin/library'],['Student Quiz Dashboard','/admin/ansar-media-production/add-ons/online-quiz']]],
  ['Campus Life & Activities', [['Life at Ansar','/admin/life-at-ansar'],['Events','/admin/events'],['Sports','/admin/sports-achievements'],['Achievements','/admin/achievements'],['Field Trips','/admin/field-trips'],['Alumni','/admin/alumni'],['Leadership','/admin/leadership']]],
  ['Content & Media', [['News','/admin/news'],['Ansar Times','/admin/ansar-times'],['Media Add-ons','/admin/ansar-media-production/add-ons/online-quiz'],['Gallery','/admin/gallery'],['Notices','/admin/notices'],['SOP Library','/admin/sop']]],
  ['Institution & Administration', [['Mandatory Disclosure','/admin/public-disclosure'],['Academic Calendar','/admin/academic-calendar'],['Counseling Team','/admin/counseling'],['School Forms','/admin/forms'],['Contact Submissions','/admin/contact-submissions']]],
  ['System & Settings', [['Settings & Trust Photos','/admin/settings'],['Developer Options','/admin/developer-options']]],
];
const glyphs = ['▦','↗','▣','▥','◈','◆','◇','◉','◌','⌂','◫','●','✦','➜','◍','▤','▧','◈','!','✉','⚙'];

function titleFor(path) {
  const item = navGroups.flatMap(([, items]) => items).find(([, href]) => path === href || path.startsWith(`${href}/`));
  return item?.[0] || 'Dashboard';
}

export default function AdminLayout({ children, user, onLogout, sproutsOnly = false, libraryOnly = false, careersOnly = false }) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(() => Object.fromEntries(navGroups.map(([name]) => [name, true])));
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => { const key = e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.querySelector('[data-admin-search]')?.focus(); } }; addEventListener('keydown', key); return () => removeEventListener('keydown', key); }, []);
  const clock = useMemo(() => new Intl.DateTimeFormat('en-IN', { weekday:'short', day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true }).format(now), [now]);
  const groups = navGroups.map(([name, items]) => [name, items.filter(([label]) => !search || label.toLowerCase().includes(search.toLowerCase()))]).filter(([,items]) => items.length);
  const restricted = careersOnly ? groups.filter(([name]) => name === 'HR & Recruitment') : libraryOnly ? groups.filter(([name]) => name === 'Academics & Admissions') : sproutsOnly ? groups.filter(([name]) => name === 'Academics & Admissions') : groups;
  const moduleTitle = titleFor(pathname);
  const initials = (user?.email || 'A').charAt(0).toUpperCase();
  return <div className="flex h-[100dvh] overflow-hidden bg-[#f8fafc] text-slate-900">
    {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" onClick={() => setMobileOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/10 bg-[#0f172a] text-white shadow-2xl transition-all duration-300 lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'lg:w-[76px]' : 'w-[280px]'}`}>
      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-400/15 text-xl text-teal-300">⌂</div>{!collapsed && <div><p className="text-[15px] font-bold">Ansar English School</p><p className="text-xs text-slate-400">Admin Workspace</p></div>}<button onClick={() => setCollapsed(!collapsed)} className="ml-auto hidden rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:block" aria-label="Toggle sidebar">{collapsed ? '›' : '‹'}</button><button onClick={() => setMobileOpen(false)} className="ml-auto rounded-lg p-2 text-slate-400 lg:hidden" aria-label="Close navigation">×</button></div>
      {!collapsed && <div className="border-b border-white/10 p-4"><label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-400"><span>⌕</span><input data-admin-search value={search} onChange={e => setSearch(e.target.value)} placeholder="Search modules" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-500"/><kbd className="text-[10px] text-slate-500">Ctrl K</kbd></label></div>}
      <nav className="flex-1 overflow-y-auto px-3 py-4">{restricted.map(([name, items], gi) => <section key={name} className="mb-5">{!collapsed && <button onClick={() => setOpen(s => ({...s,[name]:!s[name]}))} className="mb-2 flex w-full justify-between px-3 text-[10px] font-bold uppercase tracking-[.15em] text-slate-500"><span>{name}</span><span>{open[name] ? '⌄' : '›'}</span></button>}<div className={`${collapsed || open[name] ? 'space-y-1' : 'hidden'}`}>{items.map(([label, href], i) => { const active = pathname === href || pathname.startsWith(`${href}/`); return <Link key={href} to={href} title={collapsed ? label : undefined} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'} ${collapsed ? 'justify-center' : ''}`}><span className="w-5 text-center text-base">{glyphs[(gi * 3 + i) % glyphs.length]}</span>{!collapsed && <span className="truncate">{label}</span>}</Link>; })}</div></section>)}</nav>
      {!collapsed && <div className="relative h-28 overflow-hidden border-t border-white/10"><img src="/admin-campus.jpg" alt="Ansar campus" className="h-full w-full object-cover opacity-30"/><div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"/><p className="absolute bottom-3 left-4 text-xs text-slate-300">Ansar English School</p></div>}
    </aside>
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden"><header className="sticky top-0 z-30 flex min-h-[72px] items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7"><div className="flex min-w-0 items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation">☰</button><div className="min-w-0"><p className="truncate text-xs font-medium text-slate-500">Admin Portal <span className="mx-1 text-slate-300">/</span> {moduleTitle}</p><h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">{moduleTitle}</h1></div></div><div className="flex shrink-0 items-center gap-2 sm:gap-4"><time dateTime={now.toISOString()} className="hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 md:block">{clock}</time><NotificationsBell /><div className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#0f3d3e] text-sm font-bold text-white">{initials}</span><span className="max-w-[190px] truncate text-sm font-semibold text-slate-700">{user?.email}</span></div><button onClick={onLogout} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600">⇥<span className="hidden sm:inline">Sign Out</span></button></div></header><main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-7"><div className="mx-auto w-full max-w-[1500px] pb-12">{children}</div></main></div>
    {!sproutsOnly && !libraryOnly && <AdminFieldUndo />}{!sproutsOnly && !libraryOnly && <AdminUndoCenter />}
  </div>;
}
