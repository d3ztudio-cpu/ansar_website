// Firebase Cloud Messaging service worker for Ansar English School.
// This is the dedicated FCM worker required by the Firebase Messaging SDK.
// It handles background push messages and delegates everything else to the
// main service worker (sw.js) so the two workers never conflict.
//
// Scope: /firebase-cloud-messaging-push-scope (FCM default)
// This worker only handles FCM push events. All other fetch/notification
// traffic is handled by the main sw.js at the root scope.

// Keep the FCM SDK from trying to install its own polyfills or helpers here.
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Firebase config (matching the main app — only messagingSenderId and projectId
// are used by the messaging-compat worker).
const firebaseConfig = {
  apiKey: "AIzaSyApBeUtd8i7VC6wpOSxjD1PPYjQEQBGQ4Y",
  authDomain: "ansar-english-school.firebaseapp.com",
  projectId: "ansar-english-school",
  storageBucket: "ansar-english-school.firebasestorage.app",
  messagingSenderId: "729617648651",
  appId: "1:729617648651:web:f5d90b86b9b387d86b0b0e",
  measurementId: "G-Y7YNPNVFP1"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background message handler: show a visible notification when the site is
// closed or in the background. Foreground messages are handled by the React
// app (NotificationsBell) so they do not duplicate here.
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'Ansar English School';
  const notificationOptions = {
    body: payload.notification?.body || 'New school update available.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'ansar-fcm-background',
    renotify: true,
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions).catch(() => {});
});

// Forward notification click to the main app so the visitor lands on the
// relevant page (news, event, achievement, etc.).
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const url = action === 'dismiss' ? '/' :
    payloadToUrl(event.notification.data || payload.data || {}) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((client) => client.url.startsWith(self.location.origin));
      if (existing) {
        if (action !== 'dismiss') existing.navigate(url);
        return existing.focus();
      }
      return clients.openWindow(url);
    }).catch(() => {})
  );
});

// Convert an FCM data payload into a plausible on-page URL. If the payload
// does not carry a clear route, fall back to the homepage.
function payloadToUrl(data) {
  if (!data || typeof data !== 'object') return '/';
  // FCM notifications sent by the Apps Script backend include a url field.
  if (typeof data.url === 'string' && data.url) return data.url;
  // Fallback: interpret common FCM notification payloads.
  const type = data.type || data.notificationType;
  const id = data.id || data.itemId || data.documentId;
  if (type === 'News' && id) return `/news/${id}`;
  if (type === 'Event' && id) return `/events/${id}`;
  if (type === 'Achievement' && id) return `/achievements/${id}`;
  if (type === 'Magazine' || type === 'Ansar Times') return '/ansar-times';
  return '/';
}
