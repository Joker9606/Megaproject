export type UserRole = 'user' | 'worker';
export type AuthTab = 'login' | 'register';

export interface BookingRecord {
  id: string;
  userId: string;
  serviceName: string;
  serviceId?: string;
  proId?: string;
  proName: string;
  proPhone?: string;
  proAvatar?: string;
  customerName: string;
  customerPhone: string;
  address: string;
  neighborhood: string;
  timeSlot: string;
  price: string;
  taskDetails: string;
  status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  otp: string;
}

export interface WorkerJobRecord {
  id: string;
  workerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  neighborhood: string;
  serviceTitle: string;
  notes: string;
  earnedAmount: string;
  completedAt: string;
  paymentMethod: 'UPI' | 'Cash';
  invoiceNumber: string;
  status: 'Completed';
}

export interface ResidentUser {
  id: string;
  role: 'user';
  name: string;
  email: string;
  phone: string;
  avatar: string;
  neighborhood: string;
  apartment: string;
  landmark?: string;
  pincode?: string;
  emergencyContact: string;
  emergencyContactName?: string;
  bloodGroup?: string;
  preferredPayment?: string;
  joinedDate: string;
}

export interface WorkerUser {
  id: string;
  role: 'worker';
  name: string;
  email: string;
  phone: string;
  avatar: string;
  serviceName: string;
  serviceId: string;
  hourlyRate: string;
  experienceYears: string;
  neighborhood: string;
  aadhaarNumber?: string;
  aadhaarVerified: boolean;
  policeVerified: boolean;
  emergencyReady: boolean;
  bio: string;
  rating: number;
  reviewsCount: number;
  joinedDate: string;
  isAvailableNow: boolean;
}

export type AuthAccount = ResidentUser | WorkerUser;
