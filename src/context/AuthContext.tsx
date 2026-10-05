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
import { formatINR } from '../utils/formatCurrency';

interface AuthContextType {
  currentUser: AuthAccount | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  activeTab: AuthTab;
  setActiveRole: (role: UserRole) => void;
  setActiveTab: (tab: AuthTab) => void;
  loginResident: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerResident: (data: {
    name: string;
    email: string;
    phone: string;
    neighborhood: string;
    apartment: string;
    emergencyContact: string;
    emergencyContactName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  loginWorker: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerWorker: (data: {
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
  }) => Promise<{ success: boolean; error?: string; worker?: WorkerUser }>;
  logout: () => void;
  toggleWorkerAvailability: () => void;
  updateWorkerProfile: (updatedData: Partial<WorkerUser>) => void;
  updateResidentProfile: (updatedData: Partial<ResidentUser>) => void;
  
  // Booking History methods
  bookings: BookingRecord[];
  addBooking: (booking: Omit<BookingRecord, 'id' | 'createdAt'>) => BookingRecord;
  cancelBooking: (bookingId: string) => void;
  updateBookingStatus: (bookingId: string, status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled') => void;
  getUserBookings: (userId?: string) => BookingRecord[];

  // Registered Workers
  workers: WorkerUser[];

  // Worker Job Entries methods
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
  // 1. Registered Residents (starts empty or from localStorage)
  const [residents, setResidents] = useState<ResidentUser[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_RESIDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 2. Registered Workers (starts empty or from localStorage)
  const [workers, setWorkers] = useState<WorkerUser[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_WORKERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 3. Current logged in user
  const [currentUser, setCurrentUser] = useState<AuthAccount | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_AUTH_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
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

  const [activeRole, setActiveRole] = useState<UserRole>('user');
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  // Persistence effects
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

  // Login Resident
  const loginResident = async (
    emailOrPhone: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanQuery = emailOrPhone.trim().toLowerCase();
    const cleanDigits = emailOrPhone.replace(/\D/g, '');

    if (!cleanQuery) {
      return { success: false, error: 'Please enter your registered email or phone number.' };
    }

    const found = residents.find(
      (r) =>
        r.email.toLowerCase() === cleanQuery ||
        (cleanDigits.length >= 6 && r.phone.replace(/\D/g, '').includes(cleanDigits))
    );

    if (found) {
      setCurrentUser(found);
      return { success: true };
    }

    return {
      success: false,
      error: 'No resident account found with these credentials. Please register first.',
    };
  };

  // Register Resident
  const registerResident = async (data: {
    name: string;
    email: string;
    phone: string;
    neighborhood: string;
    apartment: string;
    emergencyContact: string;
    emergencyContactName?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!data.name.trim() || !data.email.trim() || !data.phone.trim()) {
      return { success: false, error: 'Please fill in all mandatory fields.' };
    }

    // Check if email already registered
    const existing = residents.find((r) => r.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return { success: true };
    }

    const newResident: ResidentUser = {
      id: `user-${Date.now()}`,
      role: 'user',
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + (residents.length % 7)}?w=150&auto=format&fit=crop&q=80`,
      neighborhood: data.neighborhood || 'Indiranagar / 100ft Road',
      apartment: data.apartment || 'Neighborhood Residence',
      emergencyContact: data.emergencyContact || '+91 98450 99881',
      emergencyContactName: data.emergencyContactName || 'Emergency Kin',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    setResidents((prev) => [newResident, ...prev]);
    setCurrentUser(newResident);
    return { success: true };
  };

  // Login Worker
  const loginWorker = async (
    emailOrPhone: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanQuery = emailOrPhone.trim().toLowerCase();
    const cleanDigits = emailOrPhone.replace(/\D/g, '');

    if (!cleanQuery) {
      return { success: false, error: 'Please enter your Worker ID, email, or phone number.' };
    }

    const found = workers.find(
      (w) =>
        w.email.toLowerCase() === cleanQuery ||
        w.id.toLowerCase() === cleanQuery ||
        (cleanDigits.length >= 6 && w.phone.replace(/\D/g, '').includes(cleanDigits))
    );

    if (found) {
      setCurrentUser(found);
      return { success: true };
    }

    return {
      success: false,
      error: 'No worker profile found with these credentials. Please register as a Pro first.',
    };
  };

  // Register Worker
  const registerWorker = async (data: {
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
  }): Promise<{ success: boolean; error?: string; worker?: WorkerUser }> => {
    if (!data.name.trim() || !data.email.trim() || !data.phone.trim() || !data.serviceName.trim()) {
      return { success: false, error: 'Please fill in all mandatory worker registration fields.' };
    }

    const rate = formatINR(data.hourlyRate || '249');

    const newWorker: WorkerUser = {
      id: `pro-${Date.now()}`,
      role: 'worker',
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      avatar: `https://images.unsplash.com/photo-${1500648767791 + (workers.length % 7)}?w=150&auto=format&fit=crop&q=80`,
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

    setWorkers((prev) => [newWorker, ...prev.filter((w) => w.email !== newWorker.email)]);
    setCurrentUser(newWorker);
    return { success: true, worker: newWorker };
  };

  // Toggle availability
  const toggleWorkerAvailability = () => {
    if (!currentUser || currentUser.role !== 'worker') return;
    const updated: WorkerUser = {
      ...currentUser,
      isAvailableNow: !currentUser.isAvailableNow,
    };
    setCurrentUser(updated);
    setWorkers((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  // Update Worker Profile
  const updateWorkerProfile = (updatedData: Partial<WorkerUser>) => {
    if (!currentUser || currentUser.role !== 'worker') return;
    const updated: WorkerUser = {
      ...currentUser,
      ...updatedData,
    };
    setCurrentUser(updated);
    setWorkers((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  // Update Resident Profile
  const updateResidentProfile = (updatedData: Partial<ResidentUser>) => {
    if (!currentUser || currentUser.role !== 'user') return;
    const updated: ResidentUser = {
      ...(currentUser as ResidentUser),
      ...updatedData,
    };
    setCurrentUser(updated);
    setResidents((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setActiveTab('login');
  };

  // Add Booking to history
  const addBooking = (bookingData: Omit<BookingRecord, 'id' | 'createdAt'>): BookingRecord => {
    const newBooking: BookingRecord = {
      ...bookingData,
      id: `SNH-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  // Cancel Booking
  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b))
    );
  };

  // Update Booking Status
  const updateBookingStatus = (
    bookingId: string,
    status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  // Get User Bookings
  const getUserBookings = (userId?: string): BookingRecord[] => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return bookings;
    return bookings.filter((b) => b.userId === targetId);
  };

  // Add Worker Completed Job to their profile
  const addWorkerJob = (job: WorkerJobRecord) => {
    setWorkerJobs((prev) => {
      const existing = prev[job.workerId] || [];
      return {
        ...prev,
        [job.workerId]: [job, ...existing],
      };
    });
  };

  // Get Worker Jobs
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
        activeRole,
        activeTab,
        setActiveRole,
        setActiveTab,
        loginResident,
        registerResident,
        loginWorker,
        registerWorker,
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
