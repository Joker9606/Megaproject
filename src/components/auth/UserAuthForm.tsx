import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Home,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  HeartHandshake,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface UserAuthFormProps {
  onSuccess?: () => void;
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

export function UserAuthForm({ onSuccess }: UserAuthFormProps) {
  const { activeTab, setActiveTab, loginResident, registerResident, isFirebaseOnline } = useAuth();

  // Login Form States
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regNeighborhood, setRegNeighborhood] = useState(NEIGHBORHOOD_OPTIONS[0]);
  const [regApartment, setRegApartment] = useState('');
  const [regEmergencyContact, setRegEmergencyContact] = useState('');
  const [regEmergencyName, setRegEmergencyName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Status & Error States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#3B82F6', '#F59E0B'],
      });
    } catch {
      // ignore
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmailOrPhone.trim()) {
      setErrorMessage('Please enter your email or registered phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginResident(loginEmailOrPhone, loginPassword);
      if (res.success) {
        triggerConfetti();
        setSuccessMessage('Welcome back! Entering resident portal...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 500);
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setErrorMessage('Please fill in your name, email, and phone number.');
      return;
    }

    if (regPassword && regConfirmPassword && regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please accept the community charter to continue.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerResident(
        {
          name: regName,
          email: regEmail,
          phone: regPhone,
          neighborhood: regNeighborhood,
          apartment: regApartment,
          emergencyContact: regEmergencyContact,
          emergencyContactName: regEmergencyName,
        },
        regPassword
      );

      if (res.success) {
        triggerConfetti();
        setSuccessMessage('Resident account created successfully! Entering network...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 600);
      } else {
        setErrorMessage(res.error || 'Failed to create resident account.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during registration.');
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
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Resident Sign In</span>
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
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Resident Sign Up</span>
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
          key="user-login"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
        >
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            {/* Email / Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={loginEmailOrPhone}
                  onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                  placeholder="name@gmail.com or 9845012345"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl text-slate-900 text-xs sm:text-sm placeholder-slate-400 transition outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link has been dispatched to your email/mobile.')}
                  className="text-[11px] text-blue-600 hover:underline font-semibold"
                >
                  Forgot password?
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
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl text-slate-900 text-xs sm:text-sm placeholder-slate-400 transition outline-none"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
                <span className="text-xs text-slate-600">Remember me</span>
              </label>

              <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Secured
              </span>
            </div>

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
                  <span>Sign In to Resident Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-5 text-center text-xs text-slate-500">
            Don't have a resident account?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className="font-bold text-blue-600 hover:underline"
            >
              Sign up now
            </button>
          </div>
        </motion.div>
      )}

      {/* REGISTER TAB */}
      {activeTab === 'register' && (
        <motion.div
          key="user-register"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Priya Sundaram"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-slate-900 text-xs sm:text-sm placeholder-slate-400 outline-none"
                />
              </div>
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
                    placeholder="priya@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none"
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
                    placeholder="+91 98450 12345"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Neighborhood & Apartment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Neighborhood Sector <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={regNeighborhood}
                    onChange={(e) => setRegNeighborhood(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-slate-900 text-xs outline-none cursor-pointer"
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
                  Flat / House / Villa No.
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={regApartment}
                    onChange={(e) => setRegApartment(e.target.value)}
                    placeholder="e.g. Flat 302, Palm Heights"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl">
              <div className="flex items-center gap-1.5 mb-2">
                <HeartHandshake className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs font-bold text-red-700">Neighborhood SOS Emergency Kin</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={regEmergencyName}
                  onChange={(e) => setRegEmergencyName(e.target.value)}
                  placeholder="Kin Name (e.g. Spouse / Brother)"
                  className="w-full px-3 py-1.5 bg-white border border-red-200 focus:border-red-500 rounded-lg text-slate-900 text-xs placeholder-slate-400 outline-none"
                />
                <input
                  type="tel"
                  value={regEmergencyContact}
                  onChange={(e) => setRegEmergencyContact(e.target.value)}
                  placeholder="Kin Phone: +91 98450 XXXXX"
                  className="w-full px-3 py-1.5 bg-white border border-red-200 focus:border-red-500 rounded-lg text-slate-900 text-xs placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none"
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-slate-900 text-xs placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="text-[11px] text-slate-600">
                I agree to the Neighborhood Safety Charter and acknowledge terms.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Resident Account & Enter</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="font-bold text-emerald-600 hover:underline"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
