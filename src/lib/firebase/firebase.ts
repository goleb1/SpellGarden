import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

// Check if all required environment variables are present (client-side only)
if (typeof window !== 'undefined') {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      console.error(`Missing required environment variable: ${varName}`);
    }
  });
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

const db = initializeFirestore(app, { cache: persistentLocalCache() });
const auth = getAuth(app);

// Enable Auth persistence
setPersistence(auth, browserLocalPersistence)
  .catch(error => console.error('Error enabling auth persistence:', error));

export { db, auth };
