import React, { useEffect, useMemo, useRef, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from './firebase-init';
import { registerForSchoolPushNotifications } from './pushNotifications';

// Starts Firestore subscriptions only once the page has settled (idle) so the
// bell's four listeners never compete with the page's own content for the
// network and main thread during first paint.
function useIdleReady(fallbackDelay = 3500) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => setReady(true), { timeout: fallbackDelay });
      return () => window.cancelIdleCallback(idleId);
    }
    const timer = window.setTimeout(() => setReady(true), fallbackDelay);
    return () => window.clearTimeout(timer);
  }, [fallbackDelay]);

  return ready;
}

function getMillis(item) {
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item.updatedAt?.toMillis) return item.updatedAt.toMillis();
  if (item.date) {
    const parsed = Date.parse(item.date);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
}

function relativeTime(millis) {
  if (!millis) return 'Recently';
  const seconds = Math.max(1, Math.floor((Date.now() - millis) / 1000));
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hr', 3600],
    ['min', 60]
  ];

  for (const [label, size] of units) {
    const value = Math.floor(seconds / size);
    if (value >= 1) return `${value} ${label}${value > 1 && label !== 'hr' ? 's' : ''} ago`;
  }
  return 'Just now';
}

const LAST_SEEN_KEY = 'ansar:lastSeenNotification';
const PROMPT_DISMISSED_UNTIL_KEY = 'ansar:notificationPromptDismissedUntil';

export default function NotificationsBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState(() => (
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  ));
  const [lastSeenMillis, setLastSeenMillis] = useState(() => {
    try {
      const stored = window.localStorage.getItem(LAST_SEEN_KEY);
      return stored ? Number(stored) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [updates, setUpdates] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [ansarTimesEditions, setAnsarTimesEditions] = useState([]);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const knownNotificationKeys = useRef(null);
  const idleReady = useIdleReady();

  useEffect(() => {
    if (permission !== 'default') return undefined;
    try {
      if (Number(window.localStorage.getItem(PROMPT_DISMISSED_UNTIL_KEY)) > Date.now()) return undefined;
    } catch {
      // The prompt can still be shown when storage is unavailable.
    }
    const timer = window.setTimeout(() => setShowPermissionPrompt(true), 3000);
    return () => window.clearTimeout(timer);
  }, [permission]);

  useEffect(() => {
    // Hold all subscriptions until the browser is idle (or the timeout fires);
    // the panel simply shows "no notifications" until then.
    if (!idleReady) return undefined;

    const updatesQuery = collection(db, 'updates');
    const achievementsQuery = collection(db, 'achievements');
    const magazinesQuery = collection(db, 'schoolMagazines');
    const ansarTimesQuery = collection(db, 'ansarTimes');

    const unsubscribeUpdates = onSnapshot(updatesQuery, (snapshot) => {
      setUpdates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error('Unable to load notifications:', error));

    const unsubscribeAchievements = onSnapshot(achievementsQuery, (snapshot) => {
      setAchievements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error('Unable to load achievement notifications:', error));

    const unsubscribeMagazines = onSnapshot(magazinesQuery, (snapshot) => {
      setMagazines(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error('Unable to load magazine notifications:', error));

    const unsubscribeAnsarTimes = onSnapshot(ansarTimesQuery, (snapshot) => {
      setAnsarTimesEditions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error('Unable to load Ansar Times notifications:', error));

    return () => {
      unsubscribeUpdates();
      unsubscribeAchievements();
      unsubscribeMagazines();
      unsubscribeAnsarTimes();
    };
  }, [idleReady]);

  const notifications = useMemo(() => {
    const updateItems = updates
      .filter(item => item.published !== false && (item.category === 'News' || item.category === 'Events'))
      .map(item => ({
        id: item.id,
        title: item.title || 'New update',
        type: item.category === 'Events' ? 'Event' : 'News',
        href: item.category === 'Events' ? `/events/${item.id}` : `/news/${item.id}`,
        millis: getMillis(item)
      }));

    const achievementItems = achievements
      .filter(item => item.published !== false)
      .map(item => ({
        id: item.id,
        title: item.title || 'New achievement',
        type: 'Achievement',
        href: `/achievements/${item.id}`,
        millis: getMillis(item)
      }));

    // School Magazines and monthly Ansar Times editions are announced with
    // their own type instead of being lumped in as "News".
    const magazineItems = magazines
      .filter(item => item.published !== false)
      .map(item => ({
        id: item.id,
        title: item.title || `School Magazine ${item.year || ''}`.trim(),
        type: 'Magazine',
        href: '/ansar-times#school-magazines',
        millis: getMillis(item)
      }));

    const ansarTimesItems = ansarTimesEditions
      .filter(item => item.published !== false)
      .map(item => ({
        id: item.id,
        title: `Ansar Times - ${item.month || ''} ${item.year || ''}`.trim(),
        type: 'Ansar Times',
        href: '/ansar-times',
        millis: getMillis(item)
      }));

    return [...updateItems, ...achievementItems, ...magazineItems, ...ansarTimesItems]
      .sort((a, b) => b.millis - a.millis)
      .slice(0, 12);
  }, [updates, achievements, magazines, ansarTimesEditions]);

  const newestMillis = notifications[0]?.millis || 0;
  const hasUnread = newestMillis > lastSeenMillis;

  const markSeen = () => {
    const nextSeen = Math.max(lastSeenMillis, newestMillis);
    setLastSeenMillis(nextSeen);
    try {
      window.localStorage.setItem(LAST_SEEN_KEY, String(nextSeen));
    } catch {
      // Ignore storage failures; the open state still clears the dot for this session.
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'default') return;
    try {
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);
      if (nextPermission === 'granted') {
        await registerForSchoolPushNotifications();
      }
      // A visitor has made a choice, so never leave the prompt over content.
      setShowPermissionPrompt(false);
    } catch (error) {
      console.warn('Notification permission could not be requested:', error);
    }
  };

  const dismissPermissionPrompt = () => {
    setShowPermissionPrompt(false);
    try {
      // Do not repeatedly interrupt a visitor who chose not to opt in.
      window.localStorage.setItem(PROMPT_DISMISSED_UNTIL_KEY, String(Date.now() + 7 * 24 * 60 * 60 * 1000));
    } catch {
      // Ignore storage failures.
    }
  };

  const toggleOpen = async () => {
    // Permission dialogs must be initiated by a real tap. Ask only once, on
    // the notification bell the visitor has deliberately chosen to open.
    await requestNotificationPermission();
    setIsOpen(open => {
      const next = !open;
      if (next) markSeen();
      return next;
    });
  };

  useEffect(() => {
    const currentKeys = new Set(notifications.map(item => `${item.type}-${item.id}`));
    if (knownNotificationKeys.current === null) {
      // The first Firestore snapshot is existing history, not a new alert.
      knownNotificationKeys.current = currentKeys;
      return;
    }

    const newItems = notifications.filter(item => !knownNotificationKeys.current.has(`${item.type}-${item.id}`));
    knownNotificationKeys.current = currentKeys;
    if (permission !== 'granted' || typeof Notification === 'undefined') return;

    newItems.slice(0, 3).forEach((item) => {
      const alert = new Notification('Ansar English School', {
        body: `New ${item.type}: ${item.title}`,
        icon: '/icon-192.png',
        tag: `ansar-${item.type}-${item.id}`
      });
      alert.onclick = () => {
        window.focus();
        window.location.assign(item.href);
      };
    });
  }, [notifications, permission]);

  return (
    <div className="relative">
      {showPermissionPrompt && (
        <section className="fixed bottom-5 left-4 right-4 z-[70] mx-auto max-w-md rounded-2xl border border-emerald-200 bg-white p-5 shadow-2xl sm:left-auto sm:right-6" role="dialog" aria-label="Enable school update alerts">
          <p className="text-base font-extrabold text-slate-900">Get new school updates</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">Enable notifications for news, events, achievements, and Ansar Times updates.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={requestNotificationPermission} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white hover:bg-emerald-800">Enable notifications</button>
            <button type="button" onClick={dismissPermissionPrompt} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">Not now</button>
          </div>
        </section>
      )}
      <button
        type="button"
        onClick={toggleOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        aria-label="Open notifications"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.17V11a6 6 0 1 0-12 0v3.17c0 .53-.21 1.04-.59 1.42L4 17h5m6 0a3 3 0 0 1-6 0m6 0H9" />
        </svg>
        {hasUnread && <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl ring-1 ring-black/5">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-extrabold text-slate-900">Notifications</h3>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{notifications.length}</span>
          </div>
          {permission === 'default' && (
            <button type="button" onClick={requestNotificationPermission} className="w-full border-b border-emerald-100 bg-emerald-50 px-4 py-2.5 text-left text-xs font-bold text-emerald-800 hover:bg-emerald-100">
              Enable browser alerts for new school updates
            </button>
          )}
          {permission === 'denied' && <p className="border-b border-amber-100 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-900">Alerts are blocked in this browser. Enable them in browser settings to receive notifications.</p>}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length ? notifications.map(item => (
              <Link
                key={`${item.type}-${item.id}`}
                to={item.href}
                onClick={() => {
                  markSeen();
                  setIsOpen(false);
                }}
                className="block border-b border-slate-50 px-4 py-3 transition-colors hover:bg-emerald-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-600">{item.type}</span>
                  <span className="text-xs font-semibold text-slate-400">{relativeTime(item.millis)}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-slate-800">{item.title}</p>
              </Link>
            )) : (
              <p className="px-4 py-8 text-center text-sm font-medium text-slate-500">No notifications yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
