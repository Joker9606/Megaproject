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
  const { activeTab, setActiveTab, loginWorker, registerWorker } = useAuth();
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
      // 1. Register in AuthContext
      const res = await registerWorker({
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
      });

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
        setSuccessMessage('Registration successful! Welcome to your Pro Dashboard.');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 600);
      } else {
        setErrorMessage(res.error || 'Failed to complete pro registration.');
      }
    } catch {
      setErrorMessage('An error occurred during pro registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Tab Selector */}
      <div className="flex bg-navy-900/90 p-1.5 rounded-2xl border border-amber-500/20 mb-6 backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            setActiveTab('login');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'login'
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-glow-amber'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Worker / Pro Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('register');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'register'
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-glow-amber'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
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
            className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-100 text-xs sm:text-sm placeholder-slate-500 transition outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password / PIN</label>
                <button
                  type="button"
                  onClick={() => alert('Worker PIN reset instruction sent to registered mobile!')}
                  className="text-[11px] text-amber-400 hover:underline"
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
                  className="w-full pl-10 pr-10 py-2.5 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-100 text-xs sm:text-sm placeholder-slate-500 transition outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-navy-900 text-amber-500 focus:ring-amber-400 accent-amber-500"
                />
                <span className="text-xs text-slate-300">Keep Pro Terminal Active</span>
              </label>

              <span className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Pro Portal
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm shadow-glow-amber transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Pro Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-5 text-center text-xs text-slate-400">
            Want to register as a new service pro?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className="font-bold text-amber-400 hover:underline"
            >
              Register Here
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
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-left">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Legal Name <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra Verma"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-100 text-xs sm:text-sm placeholder-slate-500 transition outline-none"
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ramesh@worker.in"
                    required
                    className="w-full pl-10 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    required
                    className="w-full pl-10 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 transition outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Trade Specialty Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Trade / Service Specialty <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Wrench className="w-4 h-4 text-amber-400" />
                </div>
                <select
                  value={selectedServiceId}
                  onChange={(e) => handleTradeChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-100 text-xs sm:text-sm transition outline-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-navy-950 text-slate-100">
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Trade Name if selected */}
            {selectedServiceId === 'custom' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Specify Your Custom Trade Name
                </label>
                <input
                  type="text"
                  value={customTradeName}
                  onChange={(e) => setCustomTradeName(e.target.value)}
                  placeholder="e.g. Solar Glass Cleaner, Appliance Specialist"
                  className="w-full px-3 py-2 bg-navy-900/90 border border-amber-500/50 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
                />
              </div>
            )}

            {/* Rate & Experience Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Base Starting Rate (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <input
                    type="text"
                    value={regHourlyRate}
                    onChange={(e) => setRegHourlyRate(e.target.value)}
                    placeholder="249"
                    className="w-full pl-10 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Experience Duration
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regExperience}
                    onChange={(e) => setRegExperience(e.target.value)}
                    placeholder="e.g. 5+ Years"
                    className="w-full pl-10 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Neighborhood Locality */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Neighborhood Served <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4 text-amber-400" />
                </div>
                <select
                  value={regNeighborhood}
                  onChange={(e) => setRegNeighborhood(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-slate-100 text-xs sm:text-sm transition outline-none cursor-pointer"
                >
                  {NEIGHBORHOOD_OPTIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-navy-950 text-slate-100">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Emergency SOS Availability */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-amber-300">24/7 Emergency SOS Callouts</p>
                  <p className="text-[10px] text-slate-400">Available for urgent local calls</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={regEmergencyReady}
                onChange={(e) => setRegEmergencyReady(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 bg-navy-900 text-amber-500 focus:ring-amber-400 accent-amber-500"
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password / PIN <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create PIN"
                    required
                    className="w-full px-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password / PIN <span className="text-amber-400">*</span>
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter PIN"
                  required
                  className="w-full px-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Pro Code of conduct checkbox */}
            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreedToProCode}
                onChange={(e) => setAgreedToProCode(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-navy-900 text-amber-500 focus:ring-amber-400 accent-amber-500"
              />
              <span className="text-[11px] text-slate-300">
                I pledge to uphold quality service standards and maintain fair local pricing.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm shadow-glow-amber transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Register as Pro & Enter Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-4 text-center text-xs text-slate-400">
            Already have a pro account?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="font-bold text-amber-400 hover:underline"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
