import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Heart,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Key,
  RotateCcw,
  LogOut,
  Save,
  Home,
  Building,
  Activity,
  Award,
  RefreshCw,
  Clock,
  Shield,
  Check,
  Camera,
  Upload,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ResidentUser } from '../../types/auth';
import confetti from 'canvas-confetti';

interface ResidentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookings?: () => void;
}

const NEIGHBORHOOD_OPTIONS = [
  'Indiranagar / 100ft Road',
  'Koramangala 4th Block',
  'HSR Layout Sector 2',
  'Whitefield / ITPL Area',
  'Jayanagar 4th T Block',
  'Electronic City Phase 1',
  'JP Nagar 7th Phase',
  'Malleshwaram 15th Cross',
  'Hebbal / Outer Ring Road',
  'Bannerghatta Road Enclave',
];

const DEFAULT_RESIDENT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

const BLOOD_GROUPS = ['O+ (Positive)', 'A+ (Positive)', 'B+ (Positive)', 'AB+ (Positive)', 'O- (Negative)', 'A- (Negative)', 'B- (Negative)', 'AB- (Negative)'];

export function ResidentProfileModal({
  isOpen,
  onClose,
  onOpenBookings,
}: ResidentProfileModalProps) {
  const {
    currentUser,
    updateResidentProfile,
    logout,
    setActiveRole,
    setActiveTab: setAuthTab,
    getUserBookings,
  } = useAuth();

  const resident = currentUser && currentUser.role === 'user' ? (currentUser as ResidentUser) : null;
  const bookings = getUserBookings(currentUser?.id);

  const activeBookingsCount = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const completedBookingsCount = bookings.filter((b) => b.status === 'Completed').length;

  const [activeTab, setActiveTab] = useState<'details' | 'emergency' | 'activity' | 'security'>('details');

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(resident?.name || '');
  const [email, setEmail] = useState(resident?.email || '');
  const [phone, setPhone] = useState(resident?.phone || '');
  const [avatar, setAvatar] = useState(resident?.avatar || DEFAULT_RESIDENT_AVATAR);
  const [neighborhood, setNeighborhood] = useState(resident?.neighborhood || NEIGHBORHOOD_OPTIONS[0]);
  const [apartment, setApartment] = useState(resident?.apartment || '');
  const [landmark, setLandmark] = useState(resident?.landmark || '');
  const [pincode, setPincode] = useState(resident?.pincode || '560038');

  // Emergency SOS
  const [emergencyContactName, setEmergencyContactName] = useState(resident?.emergencyContactName || 'Family Kin');
  const [emergencyContact, setEmergencyContact] = useState(resident?.emergencyContact || '+91 98450 99881');
  const [bloodGroup, setBloodGroup] = useState(resident?.bloodGroup || BLOOD_GROUPS[0]);

  // Payment preference
  const [preferredPayment, setPreferredPayment] = useState(resident?.preferredPayment || 'UPI');

  // Save states
  const [isSaved, setIsSaved] = useState(false);

  // Handle device image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (resident) {
      setName(resident.name);
      setEmail(resident.email);
      setPhone(resident.phone);
      setAvatar(resident.avatar || DEFAULT_RESIDENT_AVATAR);
      setNeighborhood(resident.neighborhood || NEIGHBORHOOD_OPTIONS[0]);
      setApartment(resident.apartment || '');
      setLandmark(resident.landmark || '');
      setPincode(resident.pincode || '560038');
      setEmergencyContactName(resident.emergencyContactName || 'Family Kin');
      setEmergencyContact(resident.emergencyContact || '+91 98450 99881');
      setBloodGroup(resident.bloodGroup || BLOOD_GROUPS[0]);
      setPreferredPayment(resident.preferredPayment || 'UPI');
    }
  }, [resident, isOpen]);

  if (!isOpen || !resident) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateResidentProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar,
      neighborhood,
      apartment: apartment.trim(),
      landmark: landmark.trim(),
      pincode: pincode.trim(),
      emergencyContactName: emergencyContactName.trim(),
      emergencyContact: emergencyContact.trim(),
      bloodGroup,
      preferredPayment,
    });

    setIsSaved(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSwitchToWorker = () => {
    onClose();
    logout();
    setActiveRole('worker');
    setAuthTab('login');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] text-left"
        >
          {/* Top Banner & Header */}
          <div className="relative p-6 bg-slate-50 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                {/* Avatar with device file upload trigger */}
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to upload profile photo from device"
                >
                  <img
                    src={avatar}
                    alt={name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-600 shadow-sm group-hover:opacity-85 transition"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition text-white p-1">
                    <Camera className="w-5 h-5 text-white mb-0.5" />
                    <span className="text-[9px] font-bold text-white text-center leading-tight">Change</span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                {/* Hidden File Input for Device Image Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-700 border border-blue-200">
                      Resident Pass
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>{email}</span>
                    <span>•</span>
                    <span className="text-blue-600 font-medium">{phone}</span>
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-semibold">{neighborhood}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400 text-[11px]">Joined {resident.joinedDate}</span>
                  </div>

                  {/* Device Photo Upload CTA */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload Photo from Device</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner if file upload invalid */}
            <AnimatePresence>
              {uploadError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{uploadError}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'details'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Personal & Address</span>
            </button>

            <button
              onClick={() => setActiveTab('emergency')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'emergency'
                  ? 'bg-white text-red-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-red-600" />
              <span>Emergency SOS & Kin</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bookings & Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Trust & KYC Charter</span>
            </button>
          </div>

          {/* Form Content Body */}
          <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Live Success Banner */}
            <AnimatePresence>
              {isSaved && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your resident profile and address have been successfully updated!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TAB 1: PERSONAL & ADDRESS */}
            {activeTab === 'details' && (
              <motion.div
                key="tab-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Resident Identity & Profile Information</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your details are verified and securely shared only with confirmed doorstep service professionals.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 focus-within:border-blue-600 focus-within:bg-white rounded-xl text-xs text-slate-900">
                      <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Phone / WhatsApp *</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 focus-within:border-blue-600 focus-within:bg-white rounded-xl text-xs text-slate-900">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 focus-within:border-blue-600 focus-within:bg-white rounded-xl text-xs text-slate-900">
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Locality / Sector *</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 focus-within:border-blue-600 focus-within:bg-white rounded-xl text-xs text-slate-900">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <select
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-slate-900 cursor-pointer"
                      >
                        {NEIGHBORHOOD_OPTIONS.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Home className="w-3.5 h-3.5 text-blue-600" />
                    <span>Default Doorstep Address & Dispatch Landmark</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Apartment / House / Flat No. & Building
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Green Glen Heights, Flat 402"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Postal Pincode</label>
                      <input
                        type="text"
                        placeholder="560038"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Street Address & Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12th Main Road, Near BDA Complex, Opposite Cafe Coffee Day"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: EMERGENCY SOS */}
            {activeTab === 'emergency' && (
              <motion.div
                key="tab-emergency"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-600" />
                    <span>Emergency SOS & Family Kin Setup</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    During 24/7 urgent service dispatches or emergency medical calls, this kin is instantly alerted.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-red-800">Neighborhood SOS Guard</p>
                        <p className="text-[10px] text-slate-600">Emergency auto-dispatch active for your home</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ARMED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Emergency Kin Name / Relation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Sharma (Father/Spouse)"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-red-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        24/7 Emergency Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98450 11223"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-red-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Primary Blood Group (For Medical SOS)
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-red-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: ACTIVITY & BOOKING STATS */}
            {activeTab === 'activity' && (
              <motion.div
                key="tab-activity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>Your Neighborhood Service History & Preferences</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Summary of your requests, completed services, and verified pro connections.
                  </p>
                </div>

                {/* Stats Counters */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Total Bookings</p>
                    <p className="text-xl font-black text-blue-600 mt-0.5">{bookings.length}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Active Visits</p>
                    <p className="text-xl font-black text-amber-600 mt-0.5">{activeBookingsCount}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Completed</p>
                    <p className="text-xl font-black text-emerald-600 mt-0.5">{completedBookingsCount}</p>
                  </div>
                </div>

                {/* Direct Action to open bookings */}
                {onOpenBookings && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenBookings();
                    }}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>View Detailed My Bookings Modal ({bookings.length})</span>
                  </button>
                )}

                {/* Payment preference */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Preferred Post-Service Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['UPI', 'Cash', 'Card'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPreferredPayment(mode)}
                        className={`p-2 rounded-xl text-xs font-bold border transition ${
                          preferredPayment === mode
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    All doorstep services include ₹0 advance payment — pay only after service satisfaction.
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB 4: TRUST & SECURITY */}
            {activeTab === 'security' && (
              <motion.div
                key="tab-security"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>Resident Trust & Security Charter</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Features safeguarding your home, privacy, and verified neighborhood connections.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">4-Tier Verified Technicians Only</p>
                      <p className="text-[11px] text-slate-500">
                        Every professional assigned to your bookings holds government Aadhaar and police verification.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">4-Digit Doorstep Start PIN</p>
                      <p className="text-[11px] text-slate-500">
                        No job can begin until you provide your unique secret OTP to the visiting technician.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">30-Day Neighborhood Service Warranty</p>
                      <p className="text-[11px] text-slate-500">
                        If a repaired appliance, pipe, or wiring issue recurs within 30 days, re-inspection is 100% free.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bottom Actions Row */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSwitchToWorker}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Switch to Worker Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
