import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from 'firebase/analytics';

// Read Firebase configuration from environment variables with project fallback defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDV9ZMkMAImG7g3geLrPp8Xfw5poSbglX0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'smart-neighborhood-b9a22.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'smart-neighborhood-b9a22',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'smart-neighborhood-b9a22.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '488724812997',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:488724812997:web:ef285eb210bcb0f17e4cac',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-31D8LN4JK0',
};

/**
 * Validates if the user has provided real Firebase API keys or left placeholders.
 */
export const isFirebaseConfigured = (): boolean => {
  const apiKey = firebaseConfig.apiKey?.trim();
  const projectId = firebaseConfig.projectId?.trim();
  return Boolean(
    apiKey &&
    projectId &&
    !apiKey.includes('YourApiKeyHere') &&
    apiKey.length > 10 &&
    !projectId.includes('your-project-id')
  );
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    // Initialize Analytics if supported in environment
    if (typeof window !== 'undefined') {
      isAnalyticsSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
          console.log('📊 [Firebase Analytics] Initialized successfully');
        }
      }).catch(() => {
        // Analytics optional fallback
      });
    }

    console.log('🔥 [Firebase] Connected to project:', firebaseConfig.projectId);
  } catch (error) {
    console.warn('⚠️ [Firebase] Initialization notice:', error);
  }
}

export { app, auth, db, googleProvider, analytics, firebaseConfig };
