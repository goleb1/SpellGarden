import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check that every setting is present (client-side only). Each value has to
// be read by its full name above: Next.js only fills in NEXT_PUBLIC_ values
// in the browser when they are written out literally.
if (typeof window !== 'undefined') {
  Object.entries(firebaseConfig).forEach(([key, value]) => {
    if (!value) {
      console.error(`Missing Firebase config value: ${key}`);
    }
  });
}

let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

const db = initializeFirestore(app, { localCache: persistentLocalCache() });
const auth = getAuth(app);

// Enable Auth persistence
setPersistence(auth, browserLocalPersistence)
  .catch(error => console.error('Error enabling auth persistence:', error));

export { db, auth };
