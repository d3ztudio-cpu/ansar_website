// Auth is private-admin functionality. Keeping it in a separate module lets
// public visitors avoid downloading and initializing the Firebase Auth SDK.
import { browserLocalPersistence, GoogleAuthProvider, initializeAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { app } from './firebase-init';

// Configure persistence when Auth is created. Switching persistence after Auth
// has started can briefly produce a null user during a reload; that looked like
// an unexpected admin logout. browserLocalPersistence survives refreshes and
// browser restarts, with Firebase's browser fallback where IndexedDB is absent.
export const auth = initializeAuth(app, { persistence: browserLocalPersistence });
export const authPersistenceReady = Promise.resolve();
export { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut };
