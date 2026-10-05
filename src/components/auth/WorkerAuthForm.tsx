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
  const { activeTab, setActiveTab, loginWorker, registerWorker, loginWithGoogle, isFirebaseOnline } = useAuth();
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
  const [googleLoading, setGoogleLoading] = useState(false);
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

  // Handle Google Sign-in for Pro
  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setGoogleLoading(true);

    try {
      const res = await loginWithGoogle('worker');
      if (res.success) {
        triggerConfetti();
        setSuccessMessage('Pro Authenticated with Google!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 500);
      } else {
        setErrorMessage(res.error || 'Google Pro sign-in failed.');
      }
    } catch {
      setErrorMessage('Google authentication encountered an error.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Firebase Status Pill */}
      <div className="flex items-center justify-center mb-4">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${
            isFirebaseOnline
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-400'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${isFirebaseOnline ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
          <span>
            {isFirebaseOnline ? 'Connected to Firebase Auth & Cloud Firestore' : 'Firebase Ready (.env configurable)'}
          </span>
        </div>
      </div>

      {/* Mode Sub-tabs (Sign In / Sign Up) */}
      <div className="grid grid-cols-2 p-1 bg-navy-950/70 border border-slate-700/60 rounded-xl mb-5">
        <button
          type="button"
          onClick={() => {
            setActiveTab('login');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'login'
              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
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
              ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
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

      {/* Quick Google Sign In Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-300 flex items-center justify-center gap-2.5 transition shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Pro Account</span>
            </>
          )}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/80"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-navy-950 px-2 text-slate-400 font-bold tracking-wider">
              Or with Pro Credentials
            </span>
          </div>
        </div>
      </div>

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

            {/* Remember Device */}
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

              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Biometric Ready
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-navy-950 font-bold text-sm shadow-glow-amber transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Pro Operations</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-5 text-center text-xs text-slate-400">
            Want to register as a new verified service partner?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className="font-bold text-amber-400 hover:underline"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Legal Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Ramesh Kumar Verma"
                required
                className="w-full px-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs sm:text-sm placeholder-slate-500 outline-none"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-red-400">*</span>
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
                    className="w-full pl-9 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number <span className="text-red-400">*</span>
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
                    className="w-full pl-9 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Trade & Specialty */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Your Trade Specialty <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <select
                  value={selectedServiceId}
                  onChange={(e) => handleTradeChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs outline-none"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id} className="bg-navy-900 text-slate-100">
                      {s.name} (Base {s.defaultRate})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Trade Name (if selected 'custom') */}
            {selectedServiceId === 'custom' && (
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Enter Custom Trade / Specialty Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={customTradeName}
                  onChange={(e) => setCustomTradeName(e.target.value)}
                  placeholder="e.g. Solar Inverter Specialist, Pet Groomer"
                  required
                  className="w-full px-3 py-2 bg-navy-900/90 border border-amber-500/60 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
                />
              </div>
            )}

            {/* Hourly Rate & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Service / Hourly Rate (₹) <span className="text-red-400">*</span>
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
                    className="w-full pl-8 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Years of Experience <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={regExperience}
                    onChange={(e) => setRegExperience(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs outline-none"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Operational Neighborhood <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={regNeighborhood}
                    onChange={(e) => setRegNeighborhood(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs outline-none"
                  >
                    {NEIGHBORHOOD_OPTIONS.map((n) => (
                      <option key={n} value={n} className="bg-navy-900 text-slate-100">
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                    className="w-full pl-9 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Emergency SOS Ready Switch */}
            <label className="flex items-center justify-between p-2.5 bg-red-950/20 border border-red-500/30 rounded-xl cursor-pointer">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-red-200">24/7 Rapid Emergency Dispatch Ready</p>
                  <p className="text-[10px] text-red-300/80">
                    Opt-in to receive urgent SOS neighborhood callouts
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={regEmergencyReady}
                onChange={(e) => setRegEmergencyReady(e.target.checked)}
                className="w-4 h-4 rounded border-red-400 bg-navy-900 text-red-500 focus:ring-red-400 accent-red-500"
              />
            </label>

            {/* Short Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Short Professional Bio / Skills Summary
              </label>
              <textarea
                value={regBio}
                onChange={(e) => setRegBio(e.target.value)}
                placeholder="e.g. 7 years experience in domestic high-voltage wiring, MCB troubleshooting, and emergency inverter installations."
                rows={2}
                className="w-full px-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none resize-none"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Create PIN / Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
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
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full px-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-amber-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Pro Code of Conduct */}
            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreedToProCode}
                onChange={(e) => setAgreedToProCode(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-navy-900 text-amber-500 focus:ring-amber-400 accent-amber-500"
              />
              <span className="text-[11px] text-slate-300">
                I agree to the Verified Professional Code, upfront transparent pricing, and background verification.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-navy-950 font-bold text-sm shadow-glow-amber transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Submit Application & Launch Pro Fleet</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-4 text-center text-xs text-slate-400">
            Already a registered service pro?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="font-bold text-amber-400 hover:underline"
            >
              Pro Sign In
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
