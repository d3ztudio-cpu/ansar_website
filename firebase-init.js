import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyApBeUtd8i7VC6wpOSxjD1PPYjQEQBGQ4Y",
  authDomain: "ansar-english-school.firebaseapp.com",
  projectId: "ansar-english-school",
  storageBucket: "ansar-english-school.firebasestorage.app",
  messagingSenderId: "729617648651",
  appId: "1:729617648651:web:f5d90b86b9b387d86b0b0e",
  measurementId: "G-Y7YNPNVFP1"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

// Offline persistence: use the current (non-deprecated) Firestore local-cache API.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({})
});

// Optional: connect to the Firestore emulator in local development.
// if (window.location.hostname === 'localhost') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

// Analytics is browser-only. Initialising it here makes the existing GA4 web
// stream (G-Y7YNPNVFP1) start recording website visits after the next deploy.
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  }).catch(() => {});
}
