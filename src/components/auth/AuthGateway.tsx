import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  User,
  Wrench,
  CheckCircle2,
  Lock,
  PhoneCall,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserAuthForm } from './UserAuthForm';
import { WorkerAuthForm } from './WorkerAuthForm';

interface AuthGatewayProps {
  onEnterSite?: () => void;
}

export function AuthGateway({ onEnterSite }: AuthGatewayProps) {
  const { activeRole, setActiveRole } = useAuth();

  const handleSuccess = () => {
    if (onEnterSite) onEnterSite();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 flex items-center gap-1.5 leading-tight">
              Smart Neighborhood
            </span>
            <span className="text-[11px] text-blue-600 font-semibold tracking-wide">
              Help & Information Network
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-slate-600 font-medium">Secure Verification Portal</span>
        </div>
      </header>

      {/* Main Authentication Flow */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Please Select Your{' '}
            <span className={activeRole === 'user' ? 'text-blue-600' : 'text-amber-600'}>
              Account Type
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Sign in or register below to access verified neighborhood services or manage your pro jobs.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl mb-8">
          {/* USER / RESIDENT CARD */}
          <button
            type="button"
            onClick={() => setActiveRole('user')}
            className={`p-5 rounded-2xl transition-all duration-200 text-left relative overflow-hidden border ${
              activeRole === 'user'
                ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10'
                : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-600'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activeRole === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
              }`}>
                <User className="w-5 h-5" />
              </div>
              {activeRole === 'user' && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                  Selected
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-3">
              I am a User / Resident
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Find and book local verified services, technicians, and access emergency SOS dispatch.
            </p>
          </button>

          {/* WORKER / PRO CARD */}
          <button
            type="button"
            onClick={() => setActiveRole('worker')}
            className={`p-5 rounded-2xl transition-all duration-200 text-left relative overflow-hidden border ${
              activeRole === 'worker'
                ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/10'
                : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-600'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activeRole === 'worker' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
              }`}>
                <Wrench className="w-5 h-5" />
              </div>
              {activeRole === 'worker' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Selected
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-3">
              I am a Worker / Pro
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Manage incoming neighborhood jobs, daily earnings, duty status, and customer leads.
            </p>
          </button>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 relative">
            <AnimatePresence mode="wait">
              {activeRole === 'user' ? (
                <motion.div
                  key="user-portal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <UserAuthForm onSuccess={handleSuccess} />
                </motion.div>
              ) : (
                <motion.div
                  key="worker-portal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <WorkerAuthForm onSuccess={handleSuccess} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs">
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>Encrypted Authentication</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Police & KYC Verification</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>24/7 Smart Network Active</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 py-5 text-center text-xs text-slate-500 border-t border-slate-200">
        <p>© 2026 Smart Neighborhood Help & Information Network.</p>
      </footer>
    </div>
  );
}
