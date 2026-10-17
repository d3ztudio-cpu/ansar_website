import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './Layout';
import ShareButton from './ShareButton';
import { useContentCollection, useContentDocument } from './useContentCollection';
import { formatDisplayDate } from './dateUtils';
import { applySeoMetadata, createMetaDescription } from './seoUtils';

const FIELD_TRIPS_SHARE_ORIGIN = 'https://ansarschool.in';

function TripCarousel({ trip }) {
  const images = Array.isArray(trip.imageUrls) ? trip.imageUrls.filter(Boolean) : [];
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [trip.id]);
  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = window.setInterval(() => setIndex(value => (value + 1) % images.length), 4500);
    return () => window.clearInterval(timer);
  }, [images.length]);
  if (!images.length) return <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-slate-100 px-6 text-center font-bold text-slate-500">Trip photographs will be added soon.</div>;
  const move = step => setIndex(value => (value + step + images.length) % images.length);
  return <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950 shadow-xl"><AnimatePresence initial={false}><motion.img key={images[index]} src={images[index]} alt={`${trip.title} photograph ${index + 1}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0 h-full w-full object-cover" /></AnimatePresence>{images.length > 1 && <><button type="button" onClick={() => move(-1)} aria-label="Previous trip image" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/65 px-4 py-2 text-2xl text-white">‹</button><button type="button" onClick={() => move(1)} aria-label="Next trip image" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/65 px-4 py-2 text-2xl text-white">›</button><span className="absolute bottom-3 right-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-bold text-white">{index + 1} / {images.length}</span></>}</div>;
}

export default function FieldTripArticle() {
  const { id } = useParams();
  const legacySproutsId = id.startsWith('sprouts-') ? id.slice('sprouts-'.length) : '';
  const { data: savedTrip, loading: savedTripLoading } = useContentDocument('fieldTrips', id);
  const { data: sproutsActivities, loading: sproutsLoading } = useContentCollection('sproutsActivities', 'date', 'desc', { sheetsOnly: true });
  const sproutsActivity = legacySproutsId ? sproutsActivities.find(activity => activity.id === legacySproutsId) : null;
  const trip = sproutsActivity ? { ...sproutsActivity, id, section: 'Ansar Sprouts', destination: /paddy\s+field/i.test(`${sproutsActivity.title || ''} ${sproutsActivity.description || ''}`) ? 'Paddy Field' : '', coverImageUrl: sproutsActivity.imageUrls?.[0] || '' } : savedTrip;
  const loading = legacySproutsId ? sproutsLoading : savedTripLoading;
  const shareUrl = `${FIELD_TRIPS_SHARE_ORIGIN}/field-trips/${id}`;
  useEffect(() => {
    if (loading) return;
    applySeoMetadata(trip && trip.published !== false ? { title: `${trip.title} | Ansar Field Trips`, description: createMetaDescription(trip.description, `Explore ${trip.title} from Ansar English School.`), keywords: `${trip.title}, field trip, Ansar English School, ${trip.section || ''}`, imageUrl: trip.coverImageUrl || trip.imageUrls?.[0] } : { title: 'Field Trip Not Found | Ansar English School', description: 'The requested field-trip article does not exist or is not published.', noIndex: true }, `/field-trips/${id}`);
  }, [id, loading, trip]);
  if (loading) return <Layout><p className="py-24 text-center font-bold text-slate-500">Loading field trip...</p></Layout>;
  if (!trip || trip.published === false) return <Layout><p className="py-24 text-center font-bold text-red-600">Field-trip article not found.</p></Layout>;
  return <Layout><main className="bg-slate-50 py-12 lg:py-20"><article className="mx-auto max-w-5xl px-4"><Link to="/field-trips" className="text-sm font-bold text-emerald-700 hover:text-emerald-900">← All field trips</Link><div className="mt-6 flex flex-wrap items-center gap-3"><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-800">{trip.section}</span>{trip.date && <time className="font-bold text-slate-500">{formatDisplayDate(trip.date)}</time>}</div><h1 className="mt-5 text-4xl font-extrabold leading-tight text-emerald-950 lg:text-6xl">{trip.title}</h1>{trip.destination && <p className="mt-4 text-lg font-bold text-amber-700">Destination: {trip.destination}</p>}<div className="mt-6"><ShareButton url={shareUrl} title={`${trip.title} | Ansar Field Trips`} text={`Explore ${trip.title} from Ansar English School.`} className="bg-emerald-700 px-5 py-2.5 text-sm text-white hover:bg-emerald-800" /></div>{trip.description && <p className="mt-8 whitespace-pre-wrap text-lg leading-8 text-slate-700">{trip.description}</p>}<div className="mt-10"><TripCarousel trip={trip} /></div></article></main></Layout>;
}
