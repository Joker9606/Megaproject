import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  Award,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Clock,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import confetti from 'canvas-confetti';

interface WorkerAuthFormProps {
  onSuccess?: () => void;
}

const SERVICE_OPTIONS = [
  { id: 'electrician', name: 'Certified Electrician', defaultRate: '249' },
  { id: 'plumber', name: 'Master Plumber', defaultRate: '299' },
  { id: 'ac-repair', name: 'AC Service & HVAC Technician', defaultRate: '499' },
  { id: 'carpenter', name: 'Carpenter & Woodwork Specialist', defaultRate: '299' },
  { id: 'cleaning', name: 'Deep Home Cleaning Specialist', defaultRate: '399' },
  { id: 'caregiver', name: 'Elderly Caregiver & Nurse', defaultRate: '399/day' },
  { id: 'pest-control', name: 'Pest & Termite Control Pro', defaultRate: '599' },
  { id: 'gardener', name: 'Gardener & Landscaper', defaultRate: '299' },
  { id: 'tech-support', name: 'Computer & Smart Tech Engineer', defaultRate: '299' },
  { id: 'cctv-smart-home', name: 'CCTV & Security System Tech', defaultRate: '499' },
  { id: 'mover', name: 'House Shifting & Heavy Transport', defaultRate: '799' },
  { id: 'tutor-math', name: 'Home Tutor & Academic Mentor', defaultRate: '350/hr' },
  { id: 'custom', name: 'Other Custom Specialty Trade', defaultRate: '299' },
];

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

export function WorkerAuthForm({ onSuccess }: WorkerAuthFormProps) {
  const { activeTab, setActiveTab, loginWorker, registerWorker, isFirebaseOnline } = useAuth();
  const { registerPro } = useNetwork();

  // Login Form States
  const [loginWorkerId, setLoginWorkerId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('electrician');
  const [customTradeName, setCustomTradeName] = useState('');
  const [regHourlyRate, setRegHourlyRate] = useState('249');
  const [regExperience, setRegExperience] = useState('5 Years');
  const [regNeighborhood, setRegNeighborhood] = useState(NEIGHBORHOOD_OPTIONS[0]);
  const [regAadhaar, setRegAadhaar] = useState('');
  const [regEmergencyReady, setRegEmergencyReady] = useState(true);
  const [regBio, setRegBio] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreedToProCode, setAgreedToProCode] = useState(true);

  // Status & Error States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'],
      });
    } catch {
      // ignore
    }
  };

  // Handle Trade Change
  const handleTradeChange = (tradeId: string) => {
    setSelectedServiceId(tradeId);
    const item = SERVICE_OPTIONS.find((s) => s.id === tradeId);
    if (item && tradeId !== 'custom') {
      setRegHourlyRate(item.defaultRate.replace(/[^0-9]/g, ''));
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginWorkerId.trim()) {
      setErrorMessage('Please enter your registered Worker ID, email, or mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginWorker(loginWorkerId, loginPassword);
      if (res.success) {
        triggerConfetti();
        setSuccessMessage('Worker authenticated! Launching your pro system...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 500);
      } else {
        setErrorMessage(res.error || 'Worker authentication failed. Please check credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during worker login.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Worker Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setErrorMessage('Please fill in your name, email, and phone number.');
      return;
    }

    if (selectedServiceId === 'custom' && !customTradeName.trim()) {
      setErrorMessage('Please specify your custom trade specialty.');
      return;
    }

    if (regPassword && regConfirmPassword && regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreedToProCode) {
      setErrorMessage('Please accept the Neighborhood Professional Code of Conduct.');
      return;
    }

    const tradeItem = SERVICE_OPTIONS.find((s) => s.id === selectedServiceId);
    const tradeTitle = selectedServiceId === 'custom' ? customTradeName.trim() : tradeItem?.name || 'Verified Specialist';

    setLoading(true);
    try {
      // 1. Register in AuthContext & Firebase
      const res = await registerWorker(
        {
          name: regName,
          email: regEmail,
          phone: regPhone,
          serviceName: tradeTitle,
          serviceId: selectedServiceId,
          hourlyRate: regHourlyRate,
          experienceYears: regExperience,
          neighborhood: regNeighborhood,
          aadhaarNumber: regAadhaar || 'XXXX-XXXX-8921',
          emergencyReady: regEmergencyReady,
          bio: regBio,
        },
        regPassword
      );

      if (res.success && res.worker) {
        // 2. Register in NetworkContext pros list with identical ID
        registerPro({
          id: res.worker.id,
          name: regName.trim(),
          serviceName: tradeTitle,
          serviceId: selectedServiceId === 'custom' ? 'custom' : selectedServiceId,
          hourlyRate: regHourlyRate || '249',
          neighborhood: regNeighborhood,
          bio: regBio.trim() || `Verified neighborhood professional in ${tradeTitle}.`,
          phone: regPhone.trim(),
          email: regEmail.trim(),
          isEmergencyReady: regEmergencyReady,
          customCategory: selectedServiceId === 'custom' ? customTradeName.trim() : undefined,
        });

        triggerConfetti();
        setSuccessMessage('Professional onboarding approved! Welcome to the Pro Partner Fleet.');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 600);
      } else {
        setErrorMessage(res.error || 'Worker registration failed. Please review your details.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during pro registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Firebase Status Pill */}
      <div className="flex items-center justify-center mb-5">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${
            isFirebaseOnline
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${isFirebaseOnline ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`} />
          <span>
            {isFirebaseOnline ? 'Connected to Firebase Auth & Cloud Firestore' : 'Firebase Ready (.env configurable)'}
          </span>
        </div>
      </div>

      {/* Mode Sub-tabs (Sign In / Sign Up) */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab('login');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'login'
              ? 'bg-white text-amber-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Pro Login</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('register');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'register'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Register as a Pro</span>
        </button>
      </div>

      {/* Error / Success Alerts */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN TAB */}
      {activeTab === 'login' && (
        <motion.div
          key="worker-login"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
        >
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            {/* Worker ID / Email / Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Worker ID, Email, or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={loginWorkerId}
                  onChange={(e) => setLoginWorkerId(e.target.value)}
                  placeholder="worker@example.com or 9845021980"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100 rounded-xl text-slate-900 text-xs sm:text-sm placeholder-slate-400 transition outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Password / PIN</label>
                <button
                  type="button"
                  onClick={() => alert('Worker PIN reset instruction sent to registered mobile!')}
                  className="text-[11px] text-amber-600 hover:underline font-semibold"
                >
                  Forgot PIN?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100 rounded-xl text-slate-900 text-xs sm:text-sm placeholder-slate-400 transition outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Device */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 accent-amber-600"
                />
                <span className="text-xs text-slate-600">Keep Pro Terminal Active</span>
              </label>

              <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Biometric Ready
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Pro Operations</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-5 text-center text-xs text-slate-500">
            Want to register as a new verified service partner?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className="font-bold text-amber-600 hover:underline"
            >
              Apply now
            </button>
          </div>
        </motion.div>
      )}

      {/* REGISTER TAB */}
      {activeTab === 'register' && (
        <motion.div
          key="worker-register"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left">
            {/* Pro Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Ramesh Kumar Verma"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 text-xs sm:text-sm placeholder-slate-400 outline-none"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98450 XXXXX"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Trade & Specialty */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Your Trade Specialty <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <select
                  value={selectedServiceId}
                  onChange={(e) => handleTradeChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 text-xs outline-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Base {s.defaultRate})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Trade Name (if selected 'custom') */}
            {selectedServiceId === 'custom' && (
              <div>
                <label className="block text-xs font-semibold text-amber-700 mb-1">
                  Enter Custom Trade / Specialty Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customTradeName}
                  onChange={(e) => setCustomTradeName(e.target.value)}
                  placeholder="e.g. Solar Inverter Specialist, Pet Groomer"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-amber-300 focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none"
                />
              </div>
            )}

            {/* Hourly Rate & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service / Hourly Rate (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                    ₹
                  </div>
                  <input
                    type="text"
                    value={regHourlyRate}
                    onChange={(e) => setRegHourlyRate(e.target.value)}
                    placeholder="249"
                    required
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={regExperience}
                    onChange={(e) => setRegExperience(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 text-xs outline-none cursor-pointer"
                  >
                    <option value="2+ Years">2+ Years (Junior Pro)</option>
                    <option value="5+ Years">5+ Years (Mid-level Pro)</option>
                    <option value="8+ Years">8+ Years (Master Technician)</option>
                    <option value="12+ Years">12+ Years (Fleet Specialist)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Neighborhood & Aadhaar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operational Neighborhood <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={regNeighborhood}
                    onChange={(e) => setRegNeighborhood(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 text-xs outline-none cursor-pointer"
                  >
                    {NEIGHBORHOOD_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Aadhaar / ID Card Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={regAadhaar}
                    onChange={(e) => setRegAadhaar(e.target.value)}
                    placeholder="XXXX-XXXX-9912"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Emergency SOS Ready Switch */}
            <label className="flex items-center justify-between p-2.5 bg-red-50 border border-red-200 rounded-xl cursor-pointer">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-red-800">24/7 Rapid Emergency Dispatch Ready</p>
                  <p className="text-[10px] text-red-600">
                    Opt-in to receive urgent SOS neighborhood callouts
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={regEmergencyReady}
                onChange={(e) => setRegEmergencyReady(e.target.checked)}
                className="w-4 h-4 rounded border-red-300 text-red-600 focus:ring-red-500 accent-red-600"
              />
            </label>

            {/* Short Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Professional Bio / Skills Summary
              </label>
              <textarea
                value={regBio}
                onChange={(e) => setRegBio(e.target.value)}
                placeholder="e.g. 7 years experience in domestic high-voltage wiring, MCB troubleshooting, and emergency inverter installations."
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none resize-none"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create PIN / Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Pro Code of Conduct */}
            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreedToProCode}
                onChange={(e) => setAgreedToProCode(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span className="text-[11px] text-slate-600">
                I agree to the Verified Professional Code, upfront transparent pricing, and background verification.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Submit Application & Launch Pro Fleet</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-4 text-center text-xs text-slate-500">
            Already a registered service pro?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="font-bold text-blue-600 hover:underline"
            >
              Pro Sign In
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
