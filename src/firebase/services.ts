import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  orderBy,
  limit,
  Unsubscribe,
  writeBatch,
} from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from './config';
import { ResidentUser, WorkerUser, BookingRecord, WorkerJobRecord, AuthAccount } from '../types/auth';
import { VerifiedPro } from '../types';
import { formatINR } from '../utils/formatCurrency';
import { INITIAL_VERIFIED_PROS } from '../data/mockData';

// Firestore Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  RESIDENTS: 'residents',
  WORKERS: 'workers',
  BOOKINGS: 'bookings',
  WORKER_JOBS: 'worker_jobs',
  EMERGENCY_ALERTS: 'emergency_alerts',
  SERVICES: 'services',
};

// Helper: Ensure valid email format for Firebase Auth (e.g. if phone provided)
function ensureEmailFormat(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.includes('@')) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  return `user_${digits || Date.now()}@smartneighborhood.local`;
}

// ==========================================
// 1. GLOBAL AUTH STATE LISTENER & PROFILE RESOLVER
// ==========================================

/**
 * Attaches a real-time listener to Firebase Auth state.
 * When a user logs in, reloads, or logs out, resolves their profile directly from Firestore.
 */
export function listenToAuthChanges(
  onProfileResolved: (user: AuthAccount | null) => void
): Unsubscribe {
  if (!auth) {
    onProfileResolved(null);
    return () => {};
  }

  return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (!fbUser) {
      onProfileResolved(null);
      return;
    }

    try {
      if (!db) {
        onProfileResolved(null);
        return;
      }

      // 1. Check in 'users' or 'residents'
      const userRef = doc(db, COLLECTIONS.USERS, fbUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as AuthAccount;
        onProfileResolved(data);
        return;
      }

      // 2. Check 'residents'
      const residentRef = doc(db, COLLECTIONS.RESIDENTS, fbUser.uid);
      const resSnap = await getDoc(residentRef);
      if (resSnap.exists()) {
        const data = resSnap.data() as ResidentUser;
        onProfileResolved(data);
        return;
      }

      // 3. Check 'workers'
      const workerRef = doc(db, COLLECTIONS.WORKERS, fbUser.uid);
      const workerSnap = await getDoc(workerRef);
      if (workerSnap.exists()) {
        const data = workerSnap.data() as WorkerUser;
        onProfileResolved(data);
        return;
      }

      // 4. If user exists in Auth but not in Firestore yet (e.g. fresh Google Sign-in)
      const defaultResident: ResidentUser = {
        id: fbUser.uid,
        role: 'user',
        name: fbUser.displayName || 'Resident User',
        email: fbUser.email || '',
        phone: fbUser.phoneNumber || '+91 98450 12345',
        avatar: fbUser.photoURL || `https://images.unsplash.com/photo-1534528741775?w=150&auto=format&fit=crop&q=80`,
        neighborhood: 'Indiranagar / 100ft Road',
        apartment: 'Neighborhood Residence',
        emergencyContact: '+91 98450 99881',
        emergencyContactName: 'Family Kin',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };

      await setDoc(doc(db, COLLECTIONS.RESIDENTS, fbUser.uid), {
        ...defaultResident,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, COLLECTIONS.USERS, fbUser.uid), {
        ...defaultResident,
        createdAt: serverTimestamp(),
      });

      onProfileResolved(defaultResident);
    } catch (err) {
      console.error('[Firebase Auth] Error resolving user profile from Firestore:', err);
      onProfileResolved(null);
    }
  });
}

// ==========================================
// 2. REGISTRATION & LOGIN VIA FIREBASE AUTH
// ==========================================

/**
 * Register Resident directly with Firebase Auth + Firestore
 */
export async function registerResidentInFirebase(
  data: {
    name: string;
    email: string;
    phone: string;
    neighborhood: string;
    apartment: string;
    emergencyContact: string;
    emergencyContactName?: string;
  },
  password?: string
): Promise<{ success: boolean; resident?: ResidentUser; error?: string }> {
  if (!auth || !db) {
    return { success: false, error: 'Firebase is not initialized. Please verify configuration.' };
  }

  const cleanEmail = ensureEmailFormat(data.email || data.phone);
  const userPassword = password && password.length >= 6 ? password : 'Password@123';

  try {
    let uid = '';
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, userPassword);
      uid = userCredential.user.uid;
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-in-use') {
        const loginRes = await signInWithEmailAndPassword(auth, cleanEmail, userPassword);
        uid = loginRes.user.uid;
      } else {
        throw authError;
      }
    }

    const residentProfile: ResidentUser = {
      id: uid,
      role: 'user',
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 10)}?w=150&auto=format&fit=crop&q=80`,
      neighborhood: data.neighborhood || 'Indiranagar / 100ft Road',
      apartment: data.apartment || 'Neighborhood Residence',
      emergencyContact: data.emergencyContact || '+91 98450 99881',
      emergencyContactName: data.emergencyContactName || 'Emergency Kin',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    // Save directly to Firestore
    await setDoc(doc(db, COLLECTIONS.RESIDENTS, uid), {
      ...residentProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    await setDoc(doc(db, COLLECTIONS.USERS, uid), {
      ...residentProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    console.log('✅ [Firebase Auth & Firestore] Resident registered:', uid);
    return { success: true, resident: residentProfile };
  } catch (error: any) {
    console.error('[Firebase Auth] Resident registration error:', error);
    let errorMsg = error.message || 'Failed to register with Firebase Auth.';
    if (error.code === 'auth/weak-password') errorMsg = 'Password must be at least 6 characters.';
    if (error.code === 'auth/invalid-email') errorMsg = 'Invalid email address format.';
    return { success: false, error: errorMsg };
  }
}

/**
 * Login Resident directly with Firebase Auth
 */
export async function loginResidentWithFirebase(
  emailOrPhone: string,
  password?: string
): Promise<{ success: boolean; resident?: ResidentUser; error?: string }> {
  if (!auth || !db) {
    return { success: false, error: 'Firebase is not initialized.' };
  }

  const cleanEmail = ensureEmailFormat(emailOrPhone);
  const userPassword = password || 'Password@123';

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, userPassword);
    const uid = userCredential.user.uid;

    const resRef = doc(db, COLLECTIONS.RESIDENTS, uid);
    const snap = await getDoc(resRef);

    if (snap.exists()) {
      return { success: true, resident: snap.data() as ResidentUser };
    }

    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { success: true, resident: userSnap.data() as ResidentUser };
    }

    return { success: false, error: 'Resident profile document not found in Firestore.' };
  } catch (error: any) {
    console.error('[Firebase Auth] Login error:', error);
    let errorMsg = error.message || 'Firebase login failed.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      errorMsg = 'No account found matching these credentials on Firebase Auth.';
    } else if (error.code === 'auth/wrong-password') {
      errorMsg = 'Incorrect password. Please try again.';
    }
    return { success: false, error: errorMsg };
  }
}

/**
 * Register Worker / Pro with Firebase Auth + Firestore
 */
export async function registerWorkerInFirebase(
  data: {
    name: string;
    email: string;
    phone: string;
    serviceName: string;
    serviceId: string;
    hourlyRate: string;
    experienceYears: string;
    neighborhood: string;
    aadhaarNumber?: string;
    emergencyReady?: boolean;
    bio?: string;
  },
  password?: string
): Promise<{ success: boolean; worker?: WorkerUser; error?: string }> {
  if (!auth || !db) {
    return { success: false, error: 'Firebase is not initialized.' };
  }

  const cleanEmail = ensureEmailFormat(data.email || data.phone);
  const userPassword = password && password.length >= 6 ? password : 'Password@123';
  const rate = formatINR(data.hourlyRate || '249');

  try {
    let uid = '';
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, userPassword);
      uid = userCredential.user.uid;
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-in-use') {
        const loginRes = await signInWithEmailAndPassword(auth, cleanEmail, userPassword);
        uid = loginRes.user.uid;
      } else {
        throw authError;
      }
    }

    const workerProfile: WorkerUser = {
      id: uid,
      role: 'worker',
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      avatar: `https://images.unsplash.com/photo-${1500648767791 + Math.floor(Math.random() * 10)}?w=150&auto=format&fit=crop&q=80`,
      serviceName: data.serviceName.trim(),
      serviceId: data.serviceId || 'electrician',
      hourlyRate: rate,
      experienceYears: data.experienceYears || '3+ Years',
      neighborhood: data.neighborhood || 'Indiranagar / 100ft Road',
      aadhaarNumber: data.aadhaarNumber || 'XXXX-XXXX-9912',
      aadhaarVerified: true,
      policeVerified: true,
      emergencyReady: data.emergencyReady ?? true,
      bio: data.bio || `Certified specialist in ${data.serviceName} with doorstep neighborhood assistance.`,
      rating: 5.0,
      reviewsCount: 0,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      isAvailableNow: true,
    };

    // Save directly to Firestore 'workers' and 'users'
    await setDoc(doc(db, COLLECTIONS.WORKERS, uid), {
      ...workerProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    await setDoc(doc(db, COLLECTIONS.USERS, uid), {
      ...workerProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    console.log('✅ [Firebase Auth & Firestore] Worker registered:', uid);
    return { success: true, worker: workerProfile };
  } catch (error: any) {
    console.error('[Firebase Auth] Worker registration error:', error);
    let errorMsg = error.message || 'Worker registration failed in Firebase Auth.';
    if (error.code === 'auth/weak-password') errorMsg = 'Password must be at least 6 characters.';
    return { success: false, error: errorMsg };
  }
}

/**
 * Login Worker directly with Firebase Auth
 */
export async function loginWorkerWithFirebase(
  identifier: string,
  password?: string
): Promise<{ success: boolean; worker?: WorkerUser; error?: string }> {
  if (!auth || !db) {
    return { success: false, error: 'Firebase is not initialized.' };
  }

  const cleanEmail = ensureEmailFormat(identifier);
  const userPassword = password || 'Password@123';

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, userPassword);
    const uid = userCredential.user.uid;

    const workerRef = doc(db, COLLECTIONS.WORKERS, uid);
    const snap = await getDoc(workerRef);

    if (snap.exists()) {
      return { success: true, worker: snap.data() as WorkerUser };
    }

    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && userSnap.data()?.role === 'worker') {
      return { success: true, worker: userSnap.data() as WorkerUser };
    }

    return { success: false, error: 'Worker account profile not found in Firestore.' };
  } catch (error: any) {
    console.error('[Firebase Auth] Worker login error:', error);
    let errorMsg = error.message || 'Worker login failed in Firebase Auth.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      errorMsg = 'No worker account found matching these credentials.';
    } else if (error.code === 'auth/wrong-password') {
      errorMsg = 'Incorrect password or PIN.';
    }
    return { success: false, error: errorMsg };
  }
}

/**
 * Google Sign-In with Firebase Auth & Firestore Profile Sync
 */
export async function signInWithGoogleFirebase(
  role: 'user' | 'worker' = 'user'
): Promise<{ success: boolean; user?: ResidentUser | WorkerUser; error?: string }> {
  if (!auth || !db || !googleProvider) {
    return { success: false, error: 'Firebase Auth or Google Provider not available.' };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    const email = fbUser.email || '';
    const name = fbUser.displayName || 'Google User';
    const avatar = fbUser.photoURL || `https://images.unsplash.com/photo-1534528741775?w=150&auto=format&fit=crop&q=80`;

    if (role === 'worker') {
      const workerDocRef = doc(db, COLLECTIONS.WORKERS, fbUser.uid);
      const existingSnap = await getDoc(workerDocRef);

      if (existingSnap.exists()) {
        return { success: true, user: existingSnap.data() as WorkerUser };
      }

      const newWorker: WorkerUser = {
        id: fbUser.uid,
        role: 'worker',
        name,
        email,
        phone: fbUser.phoneNumber || '+91 98765 43210',
        avatar,
        serviceName: 'Electrician & Wireman',
        serviceId: 'electrician',
        hourlyRate: '₹249',
        experienceYears: '4+ Years',
        neighborhood: 'Indiranagar / 100ft Road',
        aadhaarNumber: 'XXXX-XXXX-8821',
        aadhaarVerified: true,
        policeVerified: true,
        emergencyReady: true,
        bio: `Google-verified neighborhood professional ready for rapid assistance.`,
        rating: 5.0,
        reviewsCount: 0,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        isAvailableNow: true,
      };

      await setDoc(workerDocRef, { ...newWorker, createdAt: serverTimestamp() }, { merge: true });
      await setDoc(doc(db, COLLECTIONS.USERS, fbUser.uid), { ...newWorker, createdAt: serverTimestamp() }, { merge: true });
      return { success: true, user: newWorker };
    } else {
      // Resident
      const residentDocRef = doc(db, COLLECTIONS.RESIDENTS, fbUser.uid);
      const existingSnap = await getDoc(residentDocRef);

      if (existingSnap.exists()) {
        return { success: true, user: existingSnap.data() as ResidentUser };
      }

      const newResident: ResidentUser = {
        id: fbUser.uid,
        role: 'user',
        name,
        email,
        phone: fbUser.phoneNumber || '+91 98450 12345',
        avatar,
        neighborhood: 'Indiranagar / 100ft Road',
        apartment: 'Green View Residency #402',
        emergencyContact: '+91 98450 99881',
        emergencyContactName: 'Family Kin',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };

      await setDoc(residentDocRef, { ...newResident, createdAt: serverTimestamp() }, { merge: true });
      await setDoc(doc(db, COLLECTIONS.USERS, fbUser.uid), { ...newResident, createdAt: serverTimestamp() }, { merge: true });
      return { success: true, user: newResident };
    }
  } catch (error: any) {
    console.error('[Firebase] Google sign-in failed:', error);
    return { success: false, error: error.message || 'Google sign-in was cancelled or failed.' };
  }
}

/**
 * Sign Out from Firebase Auth
 */
export async function signOutFromFirebase(): Promise<void> {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('[Firebase Auth] Sign out error:', e);
    }
  }
}

// ==========================================
// 3. FIRESTORE DATABASE CRUD & REALTIME LISTENERS
// ==========================================

/**
 * Create a new Booking in Cloud Firestore
 */
export async function createBookingInFirestore(
  booking: BookingRecord
): Promise<BookingRecord> {
  if (!db) return booking;

  try {
    const bookingDocRef = doc(db, COLLECTIONS.BOOKINGS, booking.id);
    await setDoc(bookingDocRef, {
      ...booking,
      createdAtServer: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('✅ [Firestore] Booking created in database:', booking.id);
  } catch (error) {
    console.error('[Firestore] Error saving booking:', error);
  }
  return booking;
}

/**
 * Update Booking Status in Cloud Firestore
 */
export async function updateBookingStatusInFirestore(
  bookingId: string,
  status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'
): Promise<void> {
  if (!db) return;

  try {
    const bookingDocRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    await updateDoc(bookingDocRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    console.log(`✅ [Firestore] Booking ${bookingId} updated status: ${status}`);
  } catch (error) {
    console.error('[Firestore] Error updating booking status:', error);
  }
}

/**
 * Complete Booking with Dynamic Custom Price & Work Summary in Cloud Firestore
 */
export async function completeBookingInFirestore(
  bookingId: string,
  finalAmount: string,
  workSummary: string
): Promise<void> {
  if (!db) return;

  try {
    const bookingDocRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    await updateDoc(bookingDocRef, {
      status: 'Completed',
      price: finalAmount,
      finalAmount,
      workSummary,
      updatedAt: serverTimestamp(),
    });
    console.log(`✅ [Firestore] Booking ${bookingId} completed with final payment: ${finalAmount}`);
  } catch (error) {
    console.error('[Firestore] Error completing booking:', error);
  }
}

/**
 * Submit User Rating & Feedback for a Completed Booking in Cloud Firestore
 */
export async function submitBookingFeedbackInFirestore(
  bookingId: string,
  rating: number,
  feedback: string,
  feedbackTags: string[] = []
): Promise<void> {
  if (!db) return;

  try {
    const bookingDocRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    await updateDoc(bookingDocRef, {
      rating,
      feedback,
      feedbackTags,
      feedbackGivenAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      updatedAt: serverTimestamp(),
    });
    console.log(`✅ [Firestore] Feedback recorded for Booking ${bookingId}: ${rating} stars`);
  } catch (error) {
    console.error('[Firestore] Error saving booking feedback:', error);
  }
}

/**
 * Real-time Listener for all Bookings (ordered by creation)
 */
export function subscribeToAllBookings(
  onUpdate: (bookings: BookingRecord[]) => void
): Unsubscribe | null {
  if (!db) return null;

  try {
    const bookingsRef = collection(db, COLLECTIONS.BOOKINGS);
    return onSnapshot(
      bookingsRef,
      (snapshot) => {
        const results: BookingRecord[] = [];
        snapshot.forEach((docItem) => {
          results.push(docItem.data() as BookingRecord);
        });
        results.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        onUpdate(results);
      },
      (error) => {
        console.warn('[Firestore] Bookings listener notice:', error.message);
      }
    );
  } catch (e) {
    console.warn('[Firestore] Bookings subscription error:', e);
    return null;
  }
}

/**
 * Real-time Listener for Verified Pros & Workers from Cloud Firestore
 */
export function subscribeToWorkers(
  onUpdate: (workers: WorkerUser[]) => void
): Unsubscribe | null {
  if (!db) return null;

  try {
    const workersRef = collection(db, COLLECTIONS.WORKERS);
    return onSnapshot(
      workersRef,
      (snapshot) => {
        const results: WorkerUser[] = [];
        snapshot.forEach((docItem) => {
          results.push(docItem.data() as WorkerUser);
        });
        if (results.length > 0) {
          onUpdate(results);
        }
      },
      (error) => {
        console.warn('[Firestore] Workers listener notice:', error.message);
      }
    );
  } catch (e) {
    console.warn('[Firestore] Workers subscription error:', e);
    return null;
  }
}

/**
 * Update Worker Profile / Availability in Cloud Firestore
 */
export async function updateWorkerInFirestore(
  workerId: string,
  updatedData: Partial<WorkerUser>
): Promise<void> {
  if (!db) return;

  try {
    const workerDocRef = doc(db, COLLECTIONS.WORKERS, workerId);
    await updateDoc(workerDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });

    const userDocRef = doc(db, COLLECTIONS.USERS, workerId);
    await updateDoc(userDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    }).catch(() => {});
  } catch (error) {
    console.error('[Firestore] Error updating worker profile in Firestore:', error);
  }
}

/**
 * Update Resident Profile in Cloud Firestore
 */
export async function updateResidentInFirestore(
  residentId: string,
  updatedData: Partial<ResidentUser>
): Promise<void> {
  if (!db) return;

  try {
    const residentDocRef = doc(db, COLLECTIONS.RESIDENTS, residentId);
    await updateDoc(residentDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });

    const userDocRef = doc(db, COLLECTIONS.USERS, residentId);
    await updateDoc(userDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    }).catch(() => {});
  } catch (error) {
    console.error('[Firestore] Error updating resident profile in Firestore:', error);
  }
}

/**
 * Add Completed Job Record in Cloud Firestore
 */
export async function addWorkerJobToFirestore(
  job: WorkerJobRecord
): Promise<void> {
  if (!db) return;

  try {
    const jobDocRef = doc(db, COLLECTIONS.WORKER_JOBS, job.id);
    await setDoc(jobDocRef, {
      ...job,
      createdAtServer: serverTimestamp(),
    });
    console.log('✅ [Firestore] Worker Job recorded in Firestore:', job.id);
  } catch (error) {
    console.error('[Firestore] Error recording worker job:', error);
  }
}

/**
 * Emergency SOS Alert Interface
 */
export interface EmergencyAlertRecord {
  id: string;
  senderName: string;
  senderPhone: string;
  address: string;
  emergencyType: string;
  notes?: string;
  status: 'ACTIVE' | 'RESPONDED' | 'RESOLVED';
  createdAt: string;
}

/**
 * Broadcast Emergency SOS to Cloud Firestore
 */
export async function broadcastEmergencyAlert(
  alert: EmergencyAlertRecord
): Promise<EmergencyAlertRecord> {
  if (!db) return alert;

  try {
    const alertDocRef = doc(db, COLLECTIONS.EMERGENCY_ALERTS, alert.id);
    await setDoc(alertDocRef, {
      ...alert,
      createdAtServer: serverTimestamp(),
    });
    console.log('🚨 [Firestore] Emergency SOS Broadcast saved to database:', alert.id);
  } catch (error) {
    console.error('[Firestore] Error saving emergency alert:', error);
  }
  return alert;
}

/**
 * Auto-Seed Initial Verified Pros into Cloud Firestore if empty
 */
export async function seedInitialWorkersToFirestore(): Promise<void> {
  if (!db) return;
  const firestore = db;

  try {
    const workersRef = collection(firestore, COLLECTIONS.WORKERS);
    const snap = await getDocs(query(workersRef, limit(1)));

    if (snap.empty) {
      console.log('🌱 [Firestore] Seeding initial verified pros to database...');
      const batch = writeBatch(firestore);

      INITIAL_VERIFIED_PROS.forEach((pro) => {
        const workerUser: WorkerUser = {
          id: pro.id,
          role: 'worker',
          name: pro.name,
          email: pro.email || `${pro.id}@smartneighborhood.local`,
          phone: pro.phone || '+91 98450 11223',
          avatar: pro.avatar,
          serviceName: pro.service,
          serviceId: pro.serviceId,
          hourlyRate: pro.hourlyRate,
          experienceYears: '5+ Years',
          neighborhood: pro.neighborhood,
          aadhaarNumber: 'XXXX-XXXX-8921',
          aadhaarVerified: true,
          policeVerified: true,
          emergencyReady: pro.isEmergencyReady,
          bio: pro.bio,
          rating: pro.rating,
          reviewsCount: pro.reviewsCount,
          joinedDate: 'Jan 2026',
          isAvailableNow: pro.isAvailableNow,
        };

        const docRef = doc(firestore, COLLECTIONS.WORKERS, pro.id);
        batch.set(docRef, { ...workerUser, createdAt: serverTimestamp() });
      });

      await batch.commit();
      console.log('✅ [Firestore] Initial verified pros seeded successfully!');
    }
  } catch (error) {
    console.warn('[Firestore] Auto-seed notice (test mode rules may be needed):', error);
  }
}
