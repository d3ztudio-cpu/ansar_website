import React, { useEffect, useMemo, useState } from 'react';
import Layout from './Layout';
import { useContentCollection } from './useContentCollection';
import { formatDisplayDate } from './dateUtils';
import { Link } from 'react-router-dom';
import ShareButton from './ShareButton';

export const FIELD_TRIP_SECTIONS = ['Ansar Sprouts', 'LP Section', 'Primary Section', 'Middle Section', 'Secondary Section', 'Senior Secondary Section', 'General'];
const FIELD_TRIPS_SHARE_ORIGIN = 'https://ansarschool.in';

export default function FieldTrips() {
  const { data, loading } = useContentCollection('fieldTrips', null, 'desc', { firestoreOnly: true });
  const [section, setSection] = useState('All');
  const trips = useMemo(() => data.filter(item => item.published !== false).sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))), [data]);
  const availableSections = FIELD_TRIP_SECTIONS.filter(item => trips.some(trip => trip.section === item));
  const filterTabs = ['All', ...availableSections];
  useEffect(() => { if (!filterTabs.includes(section)) setSection('All'); }, [filterTabs, section]);
  const visibleTrips = section === 'All' ? trips : trips.filter(trip => trip.section === section);

  return <Layout>
    <main className="bg-slate-50 pb-20">
      <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 px-4 py-20 text-white lg:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-amber-300">Experiential Learning</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight lg:text-6xl">Learning Beyond the Classroom</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-emerald-50/85 lg:text-xl">Educational visits connect classroom ideas with communities, places, people, nature, and real-life experiences—turning every trip into a meaningful journey of discovery.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-6">
          {filterTabs.map(item => <button key={item} type="button" onClick={() => setSection(item)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${section === item ? 'bg-emerald-700 text-white shadow' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50'}`}>{item}</button>)}
        </div>

        {loading ? <p className="py-20 text-center font-bold text-slate-500">Loading field trips...</p> : visibleTrips.length ? <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleTrips.map(trip => <article key={trip.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg">
            <div className="aspect-[16/10] bg-slate-100">{trip.coverImageUrl || trip.imageUrls?.[0] ? <img src={trip.coverImageUrl || trip.imageUrls[0]} alt="" className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center px-6 text-center text-sm font-bold text-slate-500">Cover image coming soon</div>}</div>
            <div className="flex h-full flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-800">{trip.section}</span>
                {trip.date && <time className="text-sm font-bold text-slate-500">{formatDisplayDate(trip.date)}</time>}
              </div>
              <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">{trip.title}</h2>
              {trip.destination && <p className="mt-2 text-sm font-bold text-amber-700">Destination: {trip.destination}</p>}
              <div className="mt-6 flex flex-wrap gap-3"><Link to={`/field-trips/${trip.id}`} className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">Read more</Link><ShareButton url={`${FIELD_TRIPS_SHARE_ORIGIN}/field-trips/${trip.id}`} title={`${trip.title} | Ansar Field Trips`} text={`Explore ${trip.title} from Ansar English School.`} className="border border-emerald-200 px-4 py-2.5 text-sm text-emerald-800 hover:bg-emerald-50" /></div>
            </div>
          </article>)}
        </div> : <div className="mt-10 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center"><h2 className="text-xl font-extrabold text-slate-800">No field trips in this category yet</h2><p className="mt-2 text-slate-500">New educational journeys will appear here after they are published.</p></div>}
      </section>
    </main>
  </Layout>;
}
