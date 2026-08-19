import React from 'react';
import Layout from './Layout';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';
import { useContentCollection } from './useContentCollection';

function getDateTime(item) {
  const dateTime = Date.parse(item.date);
  if (!Number.isNaN(dateTime)) return dateTime;
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
  return Number.MIN_SAFE_INTEGER;
}

export default function Events() {
  const { data: eventItems, loading, error } = useContentCollection('events', null);
  const navigate = useNavigate();
  const events = eventItems
    .filter(item => item.published !== false && (!item.category || item.category === 'Events'))
    .sort((a, b) => getDateTime(b) - getDateTime(a));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 lg:py-20 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-emerald-950">Events</h1>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">Join us for our school events, celebrations, and community activities.</p>
        </div>
        {error ? (
          <p className="text-center text-red-500 font-bold">Unable to load events at this time.</p>
        ) : loading ? (
          <p className="text-center text-slate-500">Loading events...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? events.map((item, index) => (
              <div key={item.id} onClick={() => navigate(`/events/${item.id}`)} className="cursor-pointer">
                <EventCard {...item} id={item.id} type="events" priority={index === 0} />
              </div>
            )) : <p className="col-span-full text-center text-slate-500">No events have been scheduled yet.</p>}
          </div>
        )}
      </div>
    </Layout>
  );
}
