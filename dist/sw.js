/*
 * Notification-only service worker.
 *
 * Older versions cached HTML and JavaScript bundles. That can combine a page
 * shell from one deployment with scripts from another, leading to old pages,
 * failed route reloads, and crash/recovery screens. Firebase Hosting already
 * caches hashed static files correctly, so this worker never intercepts fetch
 * requests or stores page content.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const staleCaches = (await caches.keys()).filter((name) => /^(pages|assets|images)-/.test(name));
    await Promise.all(staleCaches.map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

// Retained solely for browser notifications. No fetch listener is registered.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    const existing = windows.find((client) => new URL(client.url).origin === self.location.origin);
    if (existing) return existing.focus().then(() => existing.navigate(url));
    return clients.openWindow(url);
  }));
});
