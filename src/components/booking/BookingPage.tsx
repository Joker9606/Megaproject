import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  User,
  Phone,
  Mail,
  FileText,
  Key,
  Star,
  Check,
  Sparkles,
  Info,
  CreditCard,
  Building,
  Home,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { VerifiedPro, ServiceItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ResidentUser } from '../../types/auth';
import confetti from 'canvas-confetti';
import { formatINR } from '../../utils/formatCurrency';
import { ServiceIcon } from '../common/ServiceIcon';

interface BookingPageProps {
  service: ServiceItem | null;
  pro: VerifiedPro | null;
  onBack: () => void;
  onOpenMyBookings?: () => void;
  onOpenExploreServices?: () => void;
}

const COMMON_ISSUE_TAGS: Record<string, string[]> = {
  electrician: ['Switchboard sparking', 'Circuit breaker tripping', 'Fan / Light fixture installation', 'Wiring replacement', 'Inverter issue'],
  plumber: ['Water leakage under sink', 'Blocked drain / pipe', 'Tap / Faucet repair', 'Flush tank malfunction', 'Water pump repair'],
  'ac-repair': ['Not cooling effectively', 'Water leakage from indoor unit', 'Gas refill required', 'Strange noise / vibration', 'Routine servicing & filter cleaning'],
  cleaning: ['Full home deep cleaning', 'Kitchen & bathroom sanitize', 'Sofa & mattress shampooing', 'Balcony & window cleaning', 'Move-in / Move-out clean'],
  carpenter: ['Door lock / handle repair', 'Furniture assembly', 'Cabinet hinge adjustment', 'Custom shelving', 'Wood polishing'],
  'appliance-repair': ['Washing machine drainage error', 'Refrigerator not freezing', 'Microwave heating failure', 'Geyser / water heater issue', 'Chimney servicing'],
  'elder-care': ['Daily mobility assistance', 'Medication administration', 'Post-hospitalization care', 'Companionship & meal prep', 'Night-time vital check'],
  tutor: ['Class 10 CBSE Math & Science', 'Coding & Computer Basics', 'English spoken & grammar', 'Physics / Chemistry coaching', 'Homework guidance'],
};

export function BookingPage({
  service,
  pro,
  onBack,
  onOpenMyBookings,
  onOpenExploreServices,
}: BookingPageProps) {
  const { currentUser, addBooking } = useAuth();
  const resident = currentUser && currentUser.role === 'user' ? (currentUser as ResidentUser) : null;

  // Selected Service and Pro info
  const serviceName = service?.name || pro?.service || 'Local Home Service';
  const categoryName = service?.categoryGroup || service?.category || 'Home Repair';
  const serviceId = service?.id || pro?.serviceId || 'general-service';
  const baselineRate = formatINR(pro?.hourlyRate || service?.startingPrice || '₹249');
  const proName = pro?.name || 'Assigned Verified Specialist';
  const proAvatar =
    pro?.avatar ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80';
  const proRating = pro?.rating || 4.9;
  const proReviews = pro?.reviewsCount || 124;
  const proNeighborhood = pro?.neighborhood || resident?.neighborhood || 'Indiranagar / 100ft Road';
  const proDistance = pro?.distance || '1.2 km away';
  const proCompletedJobs = pro?.completedCount || 240;

  // Form states
  const [customerName, setCustomerName] = useState(resident?.name || '');
  const [customerPhone, setCustomerPhone] = useState(resident?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(resident?.email || '');
  const [address, setAddress] = useState(
    resident?.apartment ? `${resident.apartment}, ${resident.neighborhood}` : 'Indiranagar, Bengaluru'
  );
  const [landmark, setLandmark] = useState(resident?.landmark || '');
  const [pincode, setPincode] = useState(resident?.pincode || '560038');
  const [selectedSlot, setSelectedSlot] = useState('Immediate Dispatch (< 30 mins)');
  const [customDate, setCustomDate] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Card'>('UPI');

  // Submission & Confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('4821');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (resident) {
      if (!customerName) setCustomerName(resident.name);
      if (!customerPhone) setCustomerPhone(resident.phone);
      if (!customerEmail) setCustomerEmail(resident.email);
      if (resident.apartment) {
        setAddress(
          resident.neighborhood
            ? `${resident.apartment}, ${resident.neighborhood}`
            : resident.apartment
        );
      }
      if (resident.landmark) setLandmark(resident.landmark);
      if (resident.pincode) setPincode(resident.pincode);
    }
  }, [resident]);

  const timeSlots = [
    { id: 'immediate', label: '⚡ Immediate Dispatch', detail: 'Guaranteed arrival in under 30 minutes' },
    { id: 'today-evening', label: 'Today, 4:00 PM - 6:00 PM', detail: 'Evening doorstep slot' },
    { id: 'tomorrow-morning', label: 'Tomorrow, 10:00 AM - 12:00 PM', detail: 'Morning preferred visit' },
    { id: 'tomorrow-afternoon', label: 'Tomorrow, 2:00 PM - 4:00 PM', detail: 'Afternoon flexible slot' },
    { id: 'weekend', label: 'This Weekend (Flexible)', detail: 'Saturday / Sunday scheduled visit' },
  ];

  const commonTags =
    COMMON_ISSUE_TAGS[serviceId] || [
      'Standard repair & fix',
      'Diagnostic & inspection',
      'New appliance / fitting',
      'Routine maintenance',
      'Emergency issue',
    ];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    setIsSubmitting(true);
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedOtp(otp);

    const fullDescription = [
      selectedTags.length > 0 ? `Tags: ${selectedTags.join(', ')}` : '',
      taskDetails.trim() || `Doorstep service request for ${serviceName}`,
      landmark ? `Landmark: ${landmark}` : '',
    ]
      .filter(Boolean)
      .join(' • ');

    const saved = addBooking({
      userId: currentUser?.id || 'guest',
      serviceName,
      serviceId,
      proId: pro?.id,
      proName,
      proPhone: pro?.phone,
      proAvatar,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      address: address.trim(),
      neighborhood: proNeighborhood,
      timeSlot: customDate ? `${customDate} (${selectedSlot})` : selectedSlot,
      price: 'Custom Quote on Visit',
      taskDetails: fullDescription,
      status: 'Confirmed',
      otp,
    });

    setBookingId(saved.id);
    setIsSubmitting(false);
    setIsConfirmed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Back to Services</span>
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-slate-700 cursor-pointer" onClick={onBack}>
              Home
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="hover:text-slate-700 cursor-pointer" onClick={onBack}>
              Services Directory
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-600 font-bold">{serviceName}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Doorstep Booking</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Advance • Pay After Service</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {!isConfirmed ? (
          /* Normal Multi-Step Booking Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Service & Assigned Specialist Summary */}
            <div className="lg:col-span-5 space-y-6">
              {/* Service Banner Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <ServiceIcon name={service?.icon || serviceId} className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200">
                      {categoryName}
                    </span>
                    <h1 className="text-2xl font-black text-slate-900 mt-1">{serviceName}</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Professional neighborhood repair, maintenance & installation
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {service?.description ||
                    service?.shortDesc ||
                    'Book certified local technicians with verified background checks, fixed baseline pricing, and genuine neighborhood service warranty.'}
                </p>
              </div>

              {/* Assigned Verified Professional Profile */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Assigned Neighborhood Specialist
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={proAvatar}
                    alt={proName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-100 shadow-sm"
                  />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{proName}</h2>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">
                      {pro?.service || serviceName} Specialist
                    </p>
                    <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {proRating}
                      </span>
                      <span>({proReviews} reviews)</span>
                      <span>•</span>
                      <span>{proCompletedJobs}+ jobs</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Based in: <b>{proNeighborhood}</b></span>
                  </div>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                    {proDistance}
                  </span>
                </div>
              </div>

              {/* Transparent Work-Based Quote Breakdown */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3.5 text-left">
                <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>Work Scope & Payment Structure</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Custom Quote on Work
                  </span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Doorstep Visiting & Inspection:</span>
                    <span className="font-bold text-emerald-600">FREE (₹0)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Labor & Repair Charge:</span>
                    <span className="font-bold text-slate-900">Agreed on-site by actual work</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Advance Payment Required:</span>
                    <span className="font-bold text-emerald-600">₹0 (Pay Post-Service)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>30-Day Neighborhood Warranty:</span>
                    <span className="font-bold text-blue-600">Included (Free re-check)</span>
                  </div>
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-sm">
                    <span className="font-extrabold text-slate-900">Payment Due:</span>
                    <span className="font-black text-base text-emerald-700">Settled After Job Satisfaction</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
                  💡 <b>Zero upfront payment.</b> The technician inspects the task at your doorstep, agrees on the work scope, and you only pay after work completion.
                </div>
              </div>

              {/* Trust Guarantees */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">100% Background Verified Pros</p>
                    <p className="text-slate-500">Government ID & police checked before dispatch</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Key className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Secure 4-Digit Doorstep PIN</p>
                    <p className="text-slate-500">Share with pro only when they arrive at your door</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Step-by-Step Booking Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-left"
              >
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Schedule Doorstep Service Visit
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill in your address and contact details to instantly confirm your appointment.
                  </p>
                </div>

                {/* Section 1: Customer Contact Details */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>1. Resident Contact Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Anita Sharma"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        WhatsApp / Mobile Number *
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+91 98450 12345"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address (For Booking Receipt)
                    </label>
                    <input
                      type="email"
                      placeholder="anita.sharma@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Section 2: Doorstep Address & Neighborhood */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>2. Doorstep Service Address</span>
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Flat / House No. & Building Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Flat 302, Palm Breeze Apartments, 100ft Road"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near BDA Complex / Opp Starbucks"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        placeholder="560038"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Time Slot Picker */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>3. Select Preferred Time Slot</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.label;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slot.label)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 text-slate-900 shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{slot.label}</span>
                            {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{slot.detail}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Problem Details & Quick Tags */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>4. What is the issue? (Optional)</span>
                  </h3>

                  {/* Common Quick Chips */}
                  <div>
                    <label className="text-xs text-slate-600 block mb-1.5">
                      Select common issues for faster diagnosis:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {commonTags.map((tag) => {
                        const isTagSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                              isTagSelected
                                ? 'bg-blue-600 text-white font-bold shadow-sm'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      placeholder="Add any specific instructions for the visiting technician (e.g., bring extension ladder, spare capacitor, kitchen sink tap leak)..."
                      value={taskDetails}
                      onChange={(e) => setTaskDetails(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Section 5: Payment Preference (Pay After Service) */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    <span>5. Payment Method (Pay on Job Completion)</span>
                  </h3>

                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'UPI', label: 'UPI / QR Code', sub: 'GPay, PhonePe, Paytm' },
                      { id: 'Cash', label: 'Cash on Delivery', sub: 'Pay in hand' },
                      { id: 'Card', label: 'Card / NetBanking', sub: 'Debit or Credit' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setPaymentMethod(mode.id as any)}
                        className={`p-3 rounded-2xl border text-center transition ${
                          paymentMethod === mode.id
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <div className="text-xs font-bold">{mode.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{mode.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Confirm & Schedule Service Booking</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    By booking, you agree to our 30-Day Neighborhood Service Warranty & Safety Charter.
                  </p>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Dedicated Full-Page Success Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md text-center space-y-6"
          >
            {/* Success Check Badge */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Booking Confirmed • ID: #{bookingId}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {serviceName} Appointment Scheduled!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <b>{customerName}</b>! Your doorstep service request has been confirmed for{' '}
                <span className="text-blue-600 font-bold">{selectedSlot}</span>.
              </p>
            </div>

            {/* Doorstep OTP Security Card */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 max-w-md mx-auto text-center space-y-1">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Key className="w-4 h-4 text-amber-600" />
                <span>Your 4-Digit Doorstep Start PIN</span>
              </div>
              <div className="text-3xl font-mono font-black text-amber-900 tracking-widest pt-1">
                {generatedOtp}
              </div>
              <p className="text-[11px] text-amber-700">
                Share this PIN with {proName} when they arrive at your doorstep to initiate the job.
              </p>
            </div>

            {/* Booking Details Summary */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Assigned Professional:</span>
                <span className="font-bold text-slate-900">{proName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Service Address:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[200px]">{address}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Payment:</span>
                <span className="font-bold text-emerald-700">Custom Quote (Pay After Service)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Payment Mode:</span>
                <span className="font-semibold text-slate-900">{paymentMethod} / Cash / UPI</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {onOpenMyBookings && (
                <button
                  type="button"
                  onClick={onOpenMyBookings}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
                >
                  View in My Bookings
                </button>
              )}

              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
              >
                Return to Homepage
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
