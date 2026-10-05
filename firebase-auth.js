// Auth is private-admin functionality. Keeping it in a separate module lets
// public visitors avoid downloading and initializing the Firebase Auth SDK.
import { browserLocalPersistence, getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { app } from './firebase-init';

export const auth = getAuth(app);
// Explicitly persist admin sessions in this browser. The session now survives
// page reloads and browser restarts; only an explicit sign-out clears it.
export const authPersistenceReady = setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Could not enable persistent authentication:', error);
});
export { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut };
