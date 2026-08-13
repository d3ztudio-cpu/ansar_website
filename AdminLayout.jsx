import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminFieldUndo from './AdminFieldUndo';
import AdminUndoCenter from './AdminUndoCenter';

export default function AdminLayout({ children, user, onLogout, sproutsOnly = false }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const clock = useMemo(() => {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(now);
  }, [now]);

  const getModuleTitle = () => {
    if (path.includes('/news')) return 'News';
    if (path.includes('/events')) return 'Events';
    if (path.includes('/updates')) return 'News';
    if (path.includes('/sports-achievements')) return 'Sports';
    if (path.includes('/atl')) return 'Atal Tinkering Lab';
    if (path.includes('/learning-features')) return 'Student-Centric Learning';
    if (path.includes('/life-at-ansar')) return 'Life at Ansar';
    if (path.includes('/learning-labs')) return 'Experiential Learning Labs';
    if (path.includes('/ansar-sprouts')) return 'Ansar Sprouts';
    if (path.includes('/field-trips')) return 'Field Trips';
    if (path.includes('/achievements')) return 'Achievements';
    if (path.includes('/ansar-times')) return 'Ansar Times';
    if (path.includes('/library')) return 'Library';
    if (path.includes('/alumni')) return 'Alumni';
    if (path.includes('/leadership')) return 'Leadership';
    if (path.includes('/academics')) return 'Academics & Admissions';
    if (path.includes('/public-disclosure')) return 'Mandatory Disclosure';
    if (path.includes('/gallery')) return 'Gallery';
    if (path.includes('/notices')) return 'Notices';
    if (path.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  const currentModule = getModuleTitle();

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-wide text-emerald-400">Admin Portal</h2>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sproutsOnly ? (
          <Link to="/admin/ansar-sprouts" className="block rounded-lg bg-orange-500 px-4 py-3 font-medium text-white"><span className="mr-3" aria-hidden="true">🌱</span>Ansar Sprouts</Link>
          ) : <>
          <Link to="/admin/dashboard" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">▦</span>Dashboard</Link>
          <Link to="/admin/settings" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Settings' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">⚙</span>Settings & Trust Photos</Link>
          <Link to="/admin/news" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'News' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">▤</span>News</Link>
          <Link to="/admin/events" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Events' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">◫</span>Events</Link>
          <Link to="/admin/achievements" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Achievements' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">★</span>Achievements</Link>
          <Link to="/admin/sports-achievements" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Sports' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">●</span>Sports</Link>
          <Link to="/admin/atl" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Atal Tinkering Lab' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">⚙</span>ATL</Link>
          <Link to="/admin/learning-features" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Student-Centric Learning' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">◇</span>Student-Centric Learning</Link>
          <Link to="/admin/life-at-ansar" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Life at Ansar' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">♡</span>Life at Ansar</Link>
          <Link to="/admin/learning-labs" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Experiential Learning Labs' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">⚗</span>Learning Labs</Link>
          <Link to="/admin/ansar-sprouts" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Ansar Sprouts' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">♧</span>Ansar Sprouts</Link>
          <Link to="/admin/field-trips" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Field Trips' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">➜</span>Field Trips</Link>
          <Link to="/admin/ansar-times" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Ansar Times' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">◷</span>Ansar Times</Link>
          <Link to="/admin/library" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Library' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">▣</span>Library</Link>
          <Link to="/admin/alumni" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Alumni' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">A</span>Alumni</Link>
          <Link to="/admin/leadership" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Leadership' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">♙</span>Leadership</Link>
          <Link to="/admin/academics" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Academics & Admissions' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">▥</span>Academics & Admissions</Link>
          <Link to="/admin/public-disclosure" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Mandatory Disclosure' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">▧</span>Mandatory Disclosure</Link>
          <Link to="/admin/gallery" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Gallery' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">▣</span>Gallery</Link>
          <Link to="/admin/notices" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Notices' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><span className="mr-3" aria-hidden="true">!</span>Notices</Link>
          </>}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 h-20 flex items-center justify-between px-4 sm:px-8 bg-white border-b border-slate-200 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 -ml-2 lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{currentModule || 'Dashboard'}</h1>
              <time dateTime={now.toISOString()} className="mt-1 block text-xs font-semibold text-slate-500 md:hidden">{clock}</time>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden md:flex flex-col items-end leading-tight">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Date & Time</span>
              <time dateTime={now.toISOString()} className="text-sm font-bold text-slate-700">{clock}</time>
            </div>
            <span className="hidden sm:inline text-sm font-medium text-slate-500">{user?.email}</span>
            <button onClick={onLogout} className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border border-transparent hover:border-red-100">
              Sign Out
            </button>
          </div>
        </header>

        {/* Dynamic Inner Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
      {!sproutsOnly && <AdminFieldUndo />}
      {!sproutsOnly && <AdminUndoCenter />}
    </div>
  );
}
