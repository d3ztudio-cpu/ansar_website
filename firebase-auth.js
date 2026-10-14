// Auth is private-admin functionality. Keeping it in a separate module lets
// public visitors avoid downloading and initializing the Firebase Auth SDK.
import { browserLocalPersistence, browserPopupRedirectResolver, getRedirectResult, GoogleAuthProvider, initializeAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { app } from './firebase-init';

// Configure persistence when Auth is created. Switching persistence after Auth
// has started can briefly produce a null user during a reload; that looked like
// an unexpected admin logout. browserLocalPersistence survives refreshes and
// browser restarts, with Firebase's browser fallback where IndexedDB is absent.
// Explicitly include the browser resolver. Without it, Google popup/redirect
// operations fail with auth/argument-error even though email/password works.
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver
});
export const authPersistenceReady = Promise.resolve();
export { getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut };
