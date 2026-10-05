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
  const { activeTab, setActiveTab, loginResident, registerResident } = useAuth();

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
        colors: ['#00F0FF', '#10B981', '#3B82F6', '#F59E0B'],
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
      const res = await registerResident({
        name: regName,
        email: regEmail,
        phone: regPhone,
        neighborhood: regNeighborhood,
        apartment: regApartment,
        emergencyContact: regEmergencyContact,
        emergencyContactName: regEmergencyName,
      });

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
      setErrorMessage('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Tab Selector */}
      <div className="flex bg-navy-900/90 p-1.5 rounded-2xl border border-cyan-500/20 mb-6 backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            setActiveTab('login');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'login'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Resident Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('register');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'register'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-glow-emerald'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
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
          key="user-login"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
        >
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            {/* Email / Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-slate-100 text-xs sm:text-sm placeholder-slate-500 transition outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link has been dispatched to your email/mobile.')}
                  className="text-[11px] text-cyan-400 hover:underline"
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
                  className="w-full pl-10 pr-10 py-2.5 bg-navy-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-slate-100 text-xs sm:text-sm placeholder-slate-500 transition outline-none"
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
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-navy-900 text-cyan-500 focus:ring-cyan-400 accent-cyan-500"
                />
                <span className="text-xs text-slate-300">Remember me</span>
              </label>

              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Secured
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-glow-cyan transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
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
          <div className="mt-5 text-center text-xs text-slate-400">
            Don't have a resident account?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className="font-bold text-cyan-400 hover:underline"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Sanya Iyer"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-slate-100 text-xs sm:text-sm placeholder-slate-500 transition outline-none"
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="sanya@gmail.com"
                    required
                    className="w-full pl-10 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-10 pr-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 transition outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Neighborhood Locality Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Neighborhood Locality <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <select
                  value={regNeighborhood}
                  onChange={(e) => setRegNeighborhood(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-slate-100 text-xs sm:text-sm transition outline-none cursor-pointer"
                >
                  {NEIGHBORHOOD_OPTIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-navy-950 text-slate-100">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Apartment / Society */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Society / Apartment / House No.
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Home className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={regApartment}
                  onChange={(e) => setRegApartment(e.target.value)}
                  placeholder="e.g. Tower B, Flat 304, Prestige Ozone"
                  className="w-full pl-10 pr-4 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 transition outline-none"
                />
              </div>
            </div>

            {/* Emergency SOS Contact */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Emergency Kin Contact (Optional)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={regEmergencyName}
                  onChange={(e) => setRegEmergencyName(e.target.value)}
                  placeholder="Contact Name / Relation"
                  className="w-full px-3 py-1.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 outline-none"
                />
                <input
                  type="tel"
                  value={regEmergencyContact}
                  onChange={(e) => setRegEmergencyContact(e.target.value)}
                  placeholder="Emergency Phone Number"
                  className="w-full px-3 py-1.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create password"
                    required
                    className="w-full px-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-emerald-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
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
                  className="w-full px-3 py-2 bg-navy-900/90 border border-slate-700/80 focus:border-emerald-400 rounded-xl text-slate-100 text-xs placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-navy-900 text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
              />
              <span className="text-[11px] text-slate-300">
                I agree to the Neighborhood Safety Charter and acknowledge terms.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-glow-emerald transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
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
          <div className="mt-4 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="font-bold text-emerald-400 hover:underline"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
