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
const VERSION = 'v3';
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
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  // Images: same-origin static images and known external image CDNs.
  if (isImageRequest(url) && (url.origin === self.location.origin || IMAGE_HOSTS.includes(url.hostname))) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
  }
});
