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
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-30 transition-all duration-700 ${
            activeRole === 'user' ? 'bg-cyan-500' : 'bg-amber-500'
          }`}
        />
        <div
          className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-30 transition-all duration-700 ${
            activeRole === 'user' ? 'bg-blue-600' : 'bg-orange-600'
          }`}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-950/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-[1.5px] shadow-glow-blue">
            <div className="w-full h-full bg-navy-950 rounded-2xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5 leading-tight">
              Smart Neighborhood
            </span>
            <span className="text-[11px] text-cyan-400 font-medium tracking-wide">
              Help & Information Network
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-900/80 border border-slate-700/80 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-slate-300 font-medium">Secure Verification Portal</span>
        </div>
      </header>

      {/* Main Authentication Flow */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col items-center">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Please Select Your{' '}
            <span
              className={
                activeRole === 'user' ? 'text-gradient-cyan' : 'text-gradient-gold'
              }
            >
              Account Type
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Sign in or register below to access your tailored workflow and services.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl mb-6">
          {/* USER / RESIDENT CARD */}
          <button
            type="button"
            onClick={() => setActiveRole('user')}
            className={`p-4 rounded-2xl transition-all duration-300 text-left relative overflow-hidden border ${
              activeRole === 'user'
                ? 'bg-gradient-to-br from-cyan-950/80 via-navy-900/90 to-blue-950/70 border-cyan-400 shadow-glow-cyan transform scale-[1.01]'
                : 'bg-navy-900/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <User className="w-5 h-5" />
              </div>
              {activeRole === 'user' && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-bold">
                  Selected
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-white mt-2.5">
              I am a User / Resident
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Find and book local verified services, technicians, and access emergency SOS dispatch.
            </p>
          </button>

          {/* WORKER / PRO CARD */}
          <button
            type="button"
            onClick={() => setActiveRole('worker')}
            className={`p-4 rounded-2xl transition-all duration-300 text-left relative overflow-hidden border ${
              activeRole === 'worker'
                ? 'bg-gradient-to-br from-amber-950/80 via-navy-900/90 to-purple-950/70 border-amber-400 shadow-glow-amber transform scale-[1.01]'
                : 'bg-navy-900/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Wrench className="w-5 h-5" />
              </div>
              {activeRole === 'worker' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                  Selected
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-white mt-2.5">
              I am a Worker / Pro
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Manage incoming neighborhood jobs, daily earnings, duty status, and customer leads.
            </p>
          </button>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-xl">
          <div className="glass-card rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-700/60 backdrop-blur-2xl relative">
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
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Encrypted Authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Police & KYC Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>24/7 Smart Network Active</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 py-4 text-center text-xs text-slate-500 border-t border-slate-800/80">
        <p>© 2026 Smart Neighborhood Help & Information Network.</p>
      </footer>
    </div>
  );
}
