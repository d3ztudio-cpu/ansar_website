import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

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
export const db = getFirestore(app);
// Analytics is browser-only. Initialising it here makes the existing GA4 web
// stream (G-Y7YNPNVFP1) start recording website visits after the next deploy.
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  }).catch(() => {});
}


// This must be enabled before the application starts Firestore listeners.
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});
