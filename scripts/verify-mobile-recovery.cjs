/**
 * Reproduces the affected Android Chrome environment and verifies the
 * homepage mounts without the persistent "We are restoring this page"
 * recovery loop.
 *
 * Android-accurate emulation:
 *  - Notification.permission === 'granted' (the phone granted push
 *    notifications earlier).
 *  - The Notification constructor throws, exactly like Android Chrome:
 *    "Failed to construct 'Notification': Illegal constructor."
 * Live site + service worker behave no differently for this crash because it
 * is a deterministic render/effect-time throw in each fresh page load.
 */
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const TARGET_URL = process.argv[2] || 'http://localhost:4173/';
const LOADS = Number(process.argv[3] || 3); // consecutive full page loads, like refreshing

const ANDROID_EMULATION = () => {
  // Android Chrome: Notification is present but NOT constructible, and
  // permission is 'granted' on the affected phone.
  class NotificationAndroid {
    constructor() {
      throw new TypeError("Failed to construct 'Notification': Illegal constructor. Use ServiceWorkerRegistration.showNotification() instead.");
    }
    static get permission() {
      return 'granted';
    }
    static requestPermission() {
      return Promise.resolve('granted');
    }
  }
  window.Notification = NotificationAndroid;
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-first-run', '--disable-background-timer-throttling']
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => {
    const message = error.message || String(error);
    if (message.includes('favicon-96x96.png')) return; // noise only
    errors.push(message);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
  });
  await page.evaluateOnNewDocument(ANDROID_EMULATION);

  let recovered = false;
  for (let i = 0; i < LOADS; i += 1) {
    await page.goto(TARGET_URL, { waitUntil: 'load', timeout: 60000 });
    // Wait long enough for idle subscriptions + Firestore/cache delivery.
    await new Promise((resolve) => setTimeout(resolve, 9000));
    const state = await page.evaluate(() => ({
      restoring: document.body.innerText.includes('We are restoring this page'),
      appReady: document.documentElement.dataset.appReady === 'true',
      hasNavbar: Boolean(document.querySelector('header')),
      hero: document.body.innerText.length
    }));
    console.log(`load #${i + 1}:`, JSON.stringify(state));
    if (state.restoring) {
      console.log(`RESULT: RECOVERY LOOP (load #${i + 1})`);
      recovered = false;
      break;
    }
    if (state.hasNavbar && state.hero > 200) {
      recovered = true;
      // Simulate the user clicking "Refresh website" anyway.
      await page.reload({ waitUntil: 'load' });
    }
  }

  if (errors.length) {
    console.log('captured page errors:');
    errors.slice(0, 8).forEach((e) => console.log('  -', e));
  } else {
    console.log('captured page errors: none');
  }
  console.log(`RESULT: ${recovered ? 'HOMEPAGE MOUNTS, NO RECOVERY LOOP' : 'FAILED'}`);
  await browser.close();
  process.exit(recovered ? 0 : 1);
})().catch((error) => {
  console.error('harness failed:', error);
  process.exit(2);
});
