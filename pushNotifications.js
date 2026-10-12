import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { app } from './firebase-init';
import { GOOGLE_SHEETS_DATABASE } from './googleSheetsConfig';

// Public browser credential from Firebase Cloud Messaging. It identifies this
// website to the browser push service; it is not a server secret.
const VAPID_KEY = 'BDmgZuE11esn3kXpohdmr8jafyQKCP6mXnEM2hvcM5v4XqWntHqDJ3BNgXjGkMnegBc9-iCKqoYYal8eQ1t98_s';

export async function registerForSchoolPushNotifications() {
  if (!('serviceWorker' in navigator) || !GOOGLE_SHEETS_DATABASE.writeEndpoint) return null;
  if (!(await isSupported())) return null;

  const registration = await navigator.serviceWorker.ready;
  const messaging = getMessaging(app);
  const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
  if (!token) return null;

  // The Apps Script endpoint stores the FCM token without exposing its list to
  // browsers. A no-cors response is expected from the existing web app.
  await fetch(GOOGLE_SHEETS_DATABASE.writeEndpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'registerPushToken', token, spreadsheetId: GOOGLE_SHEETS_DATABASE.spreadsheetId })
  });
  return token;
}
