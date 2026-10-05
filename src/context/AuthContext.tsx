import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuthAccount,
  ResidentUser,
  WorkerUser,
  UserRole,
  AuthTab,
  BookingRecord,
  WorkerJobRecord,
} from '../types/auth';
import { isFirebaseConfigured } from '../firebase/config';
import {
  listenToAuthChanges,
  registerResidentInFirebase,
  loginResidentWithFirebase,
  registerWorkerInFirebase,
  loginWorkerWithFirebase,
  signInWithGoogleFirebase,
  signOutFromFirebase,
  createBookingInFirestore,
  updateBookingStatusInFirestore,
  subscribeToAllBookings,
  subscribeToWorkers,
  updateWorkerInFirestore,
  updateResidentInFirestore,
  addWorkerJobToFirestore,
  seedInitialWorkersToFirestore,
} from '../firebase/services';

interface AuthContextType {
  currentUser: AuthAccount | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  activeRole: UserRole;
  activeTab: AuthTab;
  isFirebaseOnline: boolean;
  setActiveRole: (role: UserRole) => void;
  setActiveTab: (tab: AuthTab) => void;
  loginResident: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerResident: (
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
  ) => Promise<{ success: boolean; error?: string }>;
  loginWorker: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerWorker: (
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
  ) => Promise<{ success: boolean; error?: string; worker?: WorkerUser }>;
  loginWithGoogle: (role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleWorkerAvailability: () => void;
  updateWorkerProfile: (updatedData: Partial<WorkerUser>) => void;
  updateResidentProfile: (updatedData: Partial<ResidentUser>) => void;

  // Bookings from Cloud Firestore
  bookings: BookingRecord[];
  addBooking: (booking: Omit<BookingRecord, 'id' | 'createdAt'>) => BookingRecord;
  cancelBooking: (bookingId: string) => void;
  updateBookingStatus: (bookingId: string, status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled') => void;
  getUserBookings: (userId?: string) => BookingRecord[];

  // Registered Workers from Cloud Firestore
  workers: WorkerUser[];

  // Worker Job Entries from Cloud Firestore
  workerJobs: Record<string, WorkerJobRecord[]>;
  addWorkerJob: (job: WorkerJobRecord) => void;
  getWorkerJobs: (workerId?: string) => WorkerJobRecord[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_AUTH_USER = 'smart_neighborhood_auth_user_v3';
const LOCAL_STORAGE_KEY_RESIDENTS = 'smart_neighborhood_residents_v3';
const LOCAL_STORAGE_KEY_WORKERS = 'smart_neighborhood_workers_v3';
const LOCAL_STORAGE_KEY_BOOKINGS = 'smart_neighborhood_bookings_v3';
const LOCAL_STORAGE_KEY_WORKER_JOBS = 'smart_neighborhood_worker_jobs_v3';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isFirebaseOnline = isFirebaseConfigured();

  // 1. Current logged in user (driven by Firebase Auth + Firestore)
  const [currentUser, setCurrentUser] = useState<AuthAccount | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_AUTH_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole>('user');
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  // 2. Registered Residents
  const [residents, setResidents] = useState<ResidentUser[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_RESIDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 3. Registered Workers
  const [workers, setWorkers] = useState<WorkerUser[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_WORKERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 4. Resident Bookings History
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 5. Worker Job Entries History (keyed by workerId)
  const [workerJobs, setWorkerJobs] = useState<Record<string, WorkerJobRecord[]>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_WORKER_JOBS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  // 1. ATTACH FIREBASE AUTH LISTENER & INITIAL SEEDING
  useEffect(() => {
    // Seed initial pros into Firestore if empty
    seedInitialWorkersToFirestore();

    const unsubscribeAuth = listenToAuthChanges((resolvedUser) => {
      if (resolvedUser) {
        setCurrentUser(resolvedUser);
        setActiveRole(resolvedUser.role);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY_AUTH_USER, JSON.stringify(resolvedUser));
        } catch {}
      } else {
        setCurrentUser(null);
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY_AUTH_USER);
        } catch {}
      }
      setAuthLoading(false);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // 2. ATTACH FIRESTORE REALTIME SYNC (Workers & Bookings)
  useEffect(() => {
    // Realtime Worker Pro Updates from Cloud Firestore
    const unsubWorkers = subscribeToWorkers((liveWorkers) => {
      setWorkers((prev) => {
        const merged = [...liveWorkers];
        prev.forEach((p) => {
          if (!merged.some((m) => m.id === p.id || m.email === p.email)) {
            merged.push(p);
          }
        });
        return merged;
      });
    });

    // Realtime Bookings Sync across residents & pros from Cloud Firestore
    const unsubBookings = subscribeToAllBookings((liveBookings) => {
      setBookings(liveBookings);
    });

    return () => {
      if (unsubWorkers) unsubWorkers();
      if (unsubBookings) unsubBookings();
    };
  }, []);

  // Local Storage Backups
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(LOCAL_STORAGE_KEY_AUTH_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_AUTH_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_RESIDENTS, JSON.stringify(residents));
    } catch (e) {
      console.error(e);
    }
  }, [residents]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_WORKERS, JSON.stringify(workers));
    } catch (e) {
      console.error(e);
    }
  }, [workers]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_WORKER_JOBS, JSON.stringify(workerJobs));
    } catch (e) {
      console.error(e);
    }
  }, [workerJobs]);

  // LOGIN RESIDENT
  const loginResident = async (
    emailOrPhone: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanQuery = emailOrPhone.trim();
    if (!cleanQuery) {
      return { success: false, error: 'Please enter your registered email or phone number.' };
    }

    const res = await loginResidentWithFirebase(cleanQuery, password);
    if (res.success && res.resident) {
      setCurrentUser(res.resident);
      setActiveRole('user');
      return { success: true };
    }

    return {
      success: false,
      error: res.error || 'No resident account found with these credentials on Firebase Auth.',
    };
  };

  // REGISTER RESIDENT
  const registerResident = async (
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
  ): Promise<{ success: boolean; error?: string }> => {
    if (!data.name.trim() || !data.email.trim() || !data.phone.trim()) {
      return { success: false, error: 'Please fill in all mandatory fields.' };
    }

    const res = await registerResidentInFirebase(data, password);
    if (res.success && res.resident) {
      setCurrentUser(res.resident);
      setActiveRole('user');
      setResidents((prev) => [res.resident!, ...prev.filter((r) => r.id !== res.resident!.id)]);
      return { success: true };
    }

    return { success: false, error: res.error || 'Failed to create resident account in Firebase Auth.' };
  };

  // LOGIN WORKER
  const loginWorker = async (
    emailOrPhone: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanQuery = emailOrPhone.trim();
    if (!cleanQuery) {
      return { success: false, error: 'Please enter your Worker ID, email, or phone number.' };
    }

    const res = await loginWorkerWithFirebase(cleanQuery, password);
    if (res.success && res.worker) {
      setCurrentUser(res.worker);
      setActiveRole('worker');
      return { success: true };
    }

    return {
      success: false,
      error: res.error || 'No professional account found on Firebase Auth with these credentials.',
    };
  };

  // REGISTER WORKER
  const registerWorker = async (
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
  ): Promise<{ success: boolean; error?: string; worker?: WorkerUser }> => {
    if (!data.name.trim() || !data.email.trim() || !data.phone.trim() || !data.serviceName.trim()) {
      return { success: false, error: 'Please fill in all mandatory worker registration fields.' };
    }

    const res = await registerWorkerInFirebase(data, password);
    if (res.success && res.worker) {
      setCurrentUser(res.worker);
      setActiveRole('worker');
      setWorkers((prev) => [res.worker!, ...prev.filter((w) => w.id !== res.worker!.id)]);
      return { success: true, worker: res.worker };
    }

    return { success: false, error: res.error || 'Worker registration failed in Firebase Auth.' };
  };

  // GOOGLE SIGN-IN
  const loginWithGoogle = async (
    role: UserRole = activeRole
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await signInWithGoogleFirebase(role);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setActiveRole(res.user.role);
      return { success: true };
    }
    return { success: false, error: res.error || 'Google authentication failed.' };
  };

  // TOGGLE WORKER AVAILABILITY
  const toggleWorkerAvailability = () => {
    if (!currentUser || currentUser.role !== 'worker') return;
    const newStatus = !currentUser.isAvailableNow;
    const updated: WorkerUser = {
      ...currentUser,
      isAvailableNow: newStatus,
    };
    setCurrentUser(updated);
    setWorkers((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));

    // Persist directly to Cloud Firestore
    updateWorkerInFirestore(updated.id, { isAvailableNow: newStatus });
  };

  // UPDATE WORKER PROFILE
  const updateWorkerProfile = (updatedData: Partial<WorkerUser>) => {
    if (!currentUser || currentUser.role !== 'worker') return;
    const updated: WorkerUser = {
      ...currentUser,
      ...updatedData,
    };
    setCurrentUser(updated);
    setWorkers((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));

    // Persist directly to Cloud Firestore
    updateWorkerInFirestore(updated.id, updatedData);
  };

  // UPDATE RESIDENT PROFILE
  const updateResidentProfile = (updatedData: Partial<ResidentUser>) => {
    if (!currentUser || currentUser.role !== 'user') return;
    const updated: ResidentUser = {
      ...(currentUser as ResidentUser),
      ...updatedData,
    };
    setCurrentUser(updated);
    setResidents((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));

    // Persist directly to Cloud Firestore
    updateResidentInFirestore(updated.id, updatedData);
  };

  // LOGOUT
  const logout = () => {
    signOutFromFirebase();
    setCurrentUser(null);
    setActiveTab('login');
  };

  // ADD BOOKING
  const addBooking = (bookingData: Omit<BookingRecord, 'id' | 'createdAt'>): BookingRecord => {
    const newBooking: BookingRecord = {
      ...bookingData,
      id: `SNH-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Save directly to Cloud Firestore Database
    createBookingInFirestore(newBooking);

    return newBooking;
  };

  // CANCEL BOOKING
  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b))
    );

    // Update in Cloud Firestore Database
    updateBookingStatusInFirestore(bookingId, 'Cancelled');
  };

  // UPDATE BOOKING STATUS
  const updateBookingStatus = (
    bookingId: string,
    status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );

    // Update in Cloud Firestore Database
    updateBookingStatusInFirestore(bookingId, status);
  };

  // GET USER BOOKINGS
  const getUserBookings = (userId?: string): BookingRecord[] => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return bookings;
    return bookings.filter((b) => b.userId === targetId);
  };

  // ADD WORKER COMPLETED JOB
  const addWorkerJob = (job: WorkerJobRecord) => {
    setWorkerJobs((prev) => {
      const existing = prev[job.workerId] || [];
      return {
        ...prev,
        [job.workerId]: [job, ...existing],
      };
    });

    // Save directly to Cloud Firestore Database
    addWorkerJobToFirestore(job);
  };

  // GET WORKER JOBS
  const getWorkerJobs = (workerId?: string): WorkerJobRecord[] => {
    const targetId = workerId || currentUser?.id;
    if (!targetId) return [];
    return workerJobs[targetId] || [];
  };

  const isAuthenticated = currentUser !== null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        authLoading,
        activeRole,
        activeTab,
        isFirebaseOnline,
        setActiveRole,
        setActiveTab,
        loginResident,
        registerResident,
        loginWorker,
        registerWorker,
        loginWithGoogle,
        logout,
        toggleWorkerAvailability,
        updateWorkerProfile,
        updateResidentProfile,
        bookings,
        addBooking,
        cancelBooking,
        updateBookingStatus,
        getUserBookings,
        workers,
        workerJobs,
        addWorkerJob,
        getWorkerJobs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
