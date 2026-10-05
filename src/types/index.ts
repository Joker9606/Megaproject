export interface ServiceItem {
  id: string;
  name: string;
  category: string; // e.g. 'repairs', 'maintenance', 'care', 'tech', 'automotive', 'emergency', or custom
  categoryGroup?: string; // friendly group name
  icon: string;
  description: string;
  shortDesc: string;
  avgResponseTime: string;
  startingPrice: string;
  rating: number;
  completedJobs: number;
  popularServices: string[];
  gradient: string;
  badge?: string;
  isEmergencyAvailable?: boolean;
  isCustom?: boolean;
  createdBy?: string;
}

export interface VerifiedPro {
  id: string;
  name: string;
  avatar: string;
  service: string;
  serviceId: string;
  rating: number;
  reviewsCount: number;
  distance: string;
  neighborhood: string;
  isAvailableNow: boolean;
  isEmergencyReady: boolean;
  hourlyRate: string;
  badges: string[];
  bio: string;
  completedCount: number;
  joinedYear: string;
  phone?: string;
  email?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  avatar: string;
  neighborhood: string;
  service: string;
  rating: number;
  content: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface NeighborhoodHotspot {
  id: string;
  name: string;
  service: string;
  proName: string;
  position: [number, number, number];
  color: string;
  status: 'available' | 'on-job' | 'emergency';
  distance: string;
  rating: number;
}

export interface CategoryGroup {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface ServiceBookingTier {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

export interface BookingFormData {
  serviceId?: string;
  serviceName: string;
  proId?: string;
  proName?: string;
  tierId: string;
  tierName: string;
  selectedSlot: string;
  customDateTime?: string;
  customerName: string;
  phone: string;
  address: string;
  taskNotes: string;
  totalEstimatedPrice: string;
  paymentMethod: string;
  bookingRef?: string;
}
