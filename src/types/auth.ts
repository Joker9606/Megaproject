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
  finalAmount?: string;
  workSummary?: string;
  taskDetails: string;
  status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  otp: string;

  // Feedback & Reviews from Resident
  rating?: number;
  feedback?: string;
  feedbackTags?: string[];
  feedbackGivenAt?: string;

  // Misbehavior Complaints
  complaint?: WorkerComplaint;
}

export type ComplaintIncidentType =
  | 'misbehavior'
  | 'verbal_abuse'
  | 'harassment'
  | 'overcharging'
  | 'property_damage'
  | 'unprofessional'
  | 'intoxicated'
  | 'other';

export type ComplaintSeverity = 'mild' | 'moderate' | 'severe' | 'critical';

export interface WorkerComplaint {
  id: string;
  bookingId?: string;
  workerId: string;
  workerName: string;
  workerService?: string;
  workerAvatar?: string;
  userId: string;
  userName: string;
  userPhone?: string;
  incidentType: ComplaintIncidentType;
  severity: ComplaintSeverity;
  title: string;
  description: string;
  incidentDate?: string;
  createdAt: string;
  status: 'Under Review' | 'Verified & Strike Issued' | 'Resolved';
  resolutionNotes?: string;
}

export interface WorkerJobRecord {
  id: string;
  workerId: string;
  bookingId?: string;
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
  rating?: number;
  feedback?: string;
}

export interface UserGeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  formattedAddress?: string;
  neighborhood?: string;
  city?: string;
  pincode?: string;
  source?: 'gps' | 'manual' | 'search';
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
  location?: UserGeoLocation;
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
  complaintsCount?: number;
  location?: UserGeoLocation;
  serviceRadiusKm?: number;
}

export type AuthAccount = ResidentUser | WorkerUser;
