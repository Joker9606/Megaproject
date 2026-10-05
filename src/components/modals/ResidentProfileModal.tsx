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
          className="fixed inset-0 bg-navy-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-navy-900 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] text-left"
        >
          {/* Top Banner & Header */}
          <div className="relative p-6 bg-gradient-to-r from-blue-950/90 via-navy-900 to-navy-950 border-b border-cyan-500/20">
            {/* Background Orb */}
            <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

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
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-400/60 shadow-glow-cyan group-hover:opacity-85 transition"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition text-white p-1">
                    <Camera className="w-5 h-5 text-cyan-300 mb-0.5" />
                    <span className="text-[9px] font-bold text-cyan-200 text-center leading-tight">Upload PFP</span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-navy-950" />
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
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">{name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Resident Pass
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>{email}</span>
                    <span>•</span>
                    <span className="text-cyan-300">{phone}</span>
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-semibold">{neighborhood}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 text-[11px]">Joined {resident.joinedDate}</span>
                  </div>

                  {/* Device Photo Upload CTA */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 shadow-glow-cyan transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo from Device</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
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
                  className="mt-3 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{uploadError}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-2 bg-navy-950 border-b border-slate-800 overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'details'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Personal & Address</span>
            </button>

            <button
              onClick={() => setActiveTab('emergency')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'emergency'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-glow-red'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-red-400" />
              <span>Emergency SOS & Kin</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Bookings & Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
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
                  className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>Resident Identity & Profile Information</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your details are verified and securely shared only with confirmed doorstep service professionals.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name *</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white">
                      <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Phone / WhatsApp *</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white">
                      <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Locality / Sector *</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <select
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-white cursor-pointer"
                      >
                        {NEIGHBORHOOD_OPTIONS.map((loc) => (
                          <option key={loc} value={loc} className="bg-navy-950 text-slate-100">
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address details */}
                <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Home className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Default Doorstep Address & Dispatch Landmark</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Apartment / House / Flat No. & Building
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Green Glen Heights, Flat 402"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Postal Pincode</label>
                      <input
                        type="text"
                        placeholder="560038"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Street Address & Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12th Main Road, Near BDA Complex, Opposite Cafe Coffee Day"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
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
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>Emergency SOS & Family Kin Setup</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    During 24/7 urgent service dispatches or emergency medical calls, this kin is instantly alerted.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-red-300">Neighborhood SOS Guard</p>
                        <p className="text-[10px] text-slate-400">Emergency auto-dispatch active for your home</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ARMED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Emergency Kin Name / Relation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Sharma (Father/Spouse)"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        24/7 Emergency Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98450 11223"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Primary Blood Group (For Medical SOS)
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-400 cursor-pointer"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg} className="bg-navy-950 text-slate-100">
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
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Your Neighborhood Service History & Preferences</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Summary of your requests, completed services, and verified pro connections.
                  </p>
                </div>

                {/* Stats Counters */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Bookings</p>
                    <p className="text-xl font-black text-cyan-300 mt-0.5">{bookings.length}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Visits</p>
                    <p className="text-xl font-black text-amber-400 mt-0.5">{activeBookingsCount}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Completed</p>
                    <p className="text-xl font-black text-emerald-400 mt-0.5">{completedBookingsCount}</p>
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
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold text-xs shadow-glow-blue transition flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>View Detailed My Bookings Modal ({bookings.length})</span>
                  </button>
                )}

                {/* Payment preference */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
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
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-glow-cyan'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    All doorstep services include ₹0 inspection advance — pay only after service completion.
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
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Resident Trust & Security Charter</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Features safeguarding your home, privacy, and verified neighborhood connections.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">4-Tier Verified Technicians Only</p>
                      <p className="text-[11px] text-slate-400">
                        Every professional assigned to your bookings holds government Aadhaar and police verification.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">4-Digit Doorstep Start PIN</p>
                      <p className="text-[11px] text-slate-400">
                        No job can begin until you provide your unique secret OTP to the visiting technician.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">30-Day Neighborhood Service Warranty</p>
                      <p className="text-[11px] text-slate-400">
                        If a repaired appliance, pipe, or wiring issue recurs within 30 days, re-inspection is 100% free.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bottom Actions Row */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSwitchToWorker}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch to Worker Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-glow-cyan transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
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
