import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const IST_OFFSET = '+05:30';
const UNITS = [['days', 'Days'], ['hours', 'Hours'], ['minutes', 'Minutes'], ['seconds', 'Seconds']];

function getEventTime(dateTime) {
  if (!dateTime) return Number.NaN;
  const normalized = dateTime.length === 16 ? `${dateTime}:00` : dateTime;
  return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(normalized) ? normalized : `${normalized}${IST_OFFSET}`).getTime();
}

function getRemainingTime(eventTime, now = Date.now()) {
  const remaining = Math.max(0, eventTime - now);
  return {
    total: remaining,
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60)
  };
}

function formatEventDate(dateTime) {
  const eventTime = getEventTime(dateTime);
  if (!Number.isFinite(eventTime)) return '';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  }).format(eventTime);
}

function CountdownCard({ event, onExpire }) {
  const eventTime = useMemo(() => getEventTime(event.dateTime), [event.dateTime]);
  const [remaining, setRemaining] = useState(() => getRemainingTime(eventTime));

  useEffect(() => {
    const update = () => {
      const next = getRemainingTime(eventTime);
      setRemaining(next);
      if (!next.total) onExpire();
    };
    update();
    if (!Number.isFinite(eventTime) || eventTime <= Date.now()) return undefined;
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [eventTime]);

  const announcement = `${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes and ${remaining.seconds} seconds remaining`;

  return (
    <AnimatePresence>
      {remaining.total > 0 && (
        <motion.article
          initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.96 }} transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 px-5 py-8 text-white shadow-2xl sm:px-10"
          aria-label={`Countdown to ${event.title}`}
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-emerald-300/15 blur-3xl" />
          <div className="relative text-center">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-300">Upcoming Event</p>
            <h2 className="mx-auto mt-3 max-w-4xl text-2xl font-extrabold leading-tight sm:text-4xl">{event.title}</h2>
            <time dateTime={`${event.dateTime}:00${IST_OFFSET}`} className="mt-3 block text-sm font-semibold text-emerald-100">{formatEventDate(event.dateTime)} IST</time>
            <p className="sr-only" aria-live="polite">{announcement}</p>
            <div className="mx-auto mt-7 grid max-w-3xl grid-cols-4 gap-2 sm:gap-4">
              {UNITS.map(([key, label]) => (
                <div key={key} className="rounded-2xl border border-white/15 bg-white/10 px-1 py-4 shadow-inner backdrop-blur-sm sm:px-4 sm:py-5">
                  <motion.strong key={remaining[key]} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="block tabular-nums text-2xl font-black tracking-tight sm:text-5xl">
                    {String(remaining[key]).padStart(2, '0')}
                  </motion.strong>
                  <span className="mt-1 block text-[0.6rem] font-bold uppercase tracking-wider text-emerald-100 sm:text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.article>
      )}
    </AnimatePresence>
  );
}

export default function EventCountdown({ events = [] }) {
  const [, setExpiryVersion] = useState(0);
  const activeEvents = events.filter(event => event?.enabled !== false && event?.title && getEventTime(event.dateTime) > Date.now());
  if (!activeEvents.length) return null;
  return <section className="mt-20 space-y-6" aria-label="Upcoming event countdowns">{activeEvents.map(event => <CountdownCard key={event.id || `${event.title}-${event.dateTime}`} event={event} onExpire={() => setExpiryVersion(version => version + 1)} />)}</section>;
}
