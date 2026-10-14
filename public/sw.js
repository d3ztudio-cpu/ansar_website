/* Ansar English School service worker.
 *
 * Strategies:
 *  - Navigations (HTML): network-first with cache fallback, so deploys appear
 *    immediately while offline visitors still get the last known page.
 *  - Hashed build assets (/assets/**): cache-first — they are immutable, so a
 *    cached copy is always correct and repeat visits load instantly.
 *  - Images (avif/webp/png/jpg/svg + popular image CDNs): cache-first with a
 *    capped LRU-ish trim, making repeat gallery/hero views dramatically faster.
 *  - Everything else: network only.
 */
// Increment on each recovery deployment so clients immediately discard stale
// HTML and asset caches from an earlier version.
const VERSION = 'v13';
const PAGE_CACHE = `pages-${VERSION}`;
const ASSET_CACHE = `assets-${VERSION}`;
const IMAGE_CACHE = `images-${VERSION}`;
const KNOWN_CACHES = [PAGE_CACHE, ASSET_CACHE, IMAGE_CACHE];

const IMAGE_HOSTS = [
  'i.ibb.co',
  'images.unsplash.com',
  'i.imgur.com',
  'i.postimg.cc',
  'iili.io',
  'lh3.googleusercontent.com',
  'blogger.googleusercontent.com',
  'res.cloudinary.com'
];
const IMAGE_EXTENSIONS = /\.(?:avif|webp|png|jpe?g|gif|svg)(?:[?#].*)?$/i;
const MAX_IMAGE_ENTRIES = 250;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(PAGE_CACHE));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await Promise.all(
      (await caches.keys()).filter((name) => name.startsWith('pages-') || name.startsWith('assets-') || name.startsWith('images-'))
        .filter((name) => !KNOWN_CACHES.includes(name))
        .map((name) => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

function isImageRequest(url) {
  return IMAGE_EXTENSIONS.test(url.pathname) || IMAGE_HOSTS.includes(url.hostname);
}

async function trimImageCache(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= MAX_IMAGE_ENTRIES) return;
  // Delete oldest-first until back under the cap.
  for (let i = 0; i < keys.length - MAX_IMAGE_ENTRIES; i += 1) {
    await cache.delete(keys[i]);
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && (response.ok || response.type === 'opaque')) {
    await cache.put(request, response.clone());
    if (cacheName === IMAGE_CACHE) trimImageCache(cacheName);
  }
  return response;
}

async function networkFirstAsset(request) {
  const cache = await caches.open(ASSET_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const fallback = await caches.match('/index.html');
    if (fallback) return fallback;
    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept Firebase/Firestore/Auth/API traffic or the version probe.
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('firebaseio.com')
    || url.hostname === 'docs.google.com' || url.pathname === '/version.json') {
    return;
  }

  // HTML navigations — same-origin only.
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    if (url.origin === self.location.origin) event.respondWith(networkFirstPage(request));
    return;
  }

  // Immutable hashed build output.
  if (url.origin === self.location.origin && url.pathname.startsWith('/assets/')) {
    // Hashed build files are immutable, so the versioned cache is safe and
    // avoids the mobile tab briefly re-requesting a deleted chunk on reload.
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  // Images: same-origin static images and known external image CDNs.
  if (isImageRequest(url) && (url.origin === self.location.origin || IMAGE_HOSTS.includes(url.hostname))) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
  }
});

// Firebase Messaging must run inside the same service worker used by the site.
// It receives FCM alerts even when no Ansar School page is currently open.
try {
  importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js');
  firebase.initializeApp({
    apiKey: 'AIzaSyApBeUtd8i7VC6wpOSxjD1PPYjQEQBGQ4Y',
    authDomain: 'ansar-english-school.firebaseapp.com',
    projectId: 'ansar-english-school',
    storageBucket: 'ansar-english-school.firebasestorage.app',
    messagingSenderId: '729617648651',
    appId: '1:729617648651:web:f5d90b86b9b387d86b0b0e'
  });
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const notification = payload.notification || {};
    const data = payload.data || {};
    return self.registration.showNotification(notification.title || 'Ansar English School', {
      body: notification.body || 'There is a new school update.',
      icon: notification.icon || '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: payload.fcmOptions?.link || data.url || '/' }
    });
  });
} catch (error) {
  // Caching and offline support remain available if the Messaging SDK cannot
  // be loaded, for example while a visitor is offline for the first install.
  console.warn('Firebase Messaging service worker setup failed.', error);
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    const existing = windows.find((client) => new URL(client.url).origin === self.location.origin);
    if (existing) return existing.focus().then(() => existing.navigate(url));
    return clients.openWindow(url);
  }));
});
