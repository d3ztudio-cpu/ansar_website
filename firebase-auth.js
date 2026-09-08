// Auth is private-admin functionality. Keeping it in a separate module lets
// public visitors avoid downloading and initializing the Firebase Auth SDK.
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { app } from './firebase-init';

export const auth = getAuth(app);
export { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut };
