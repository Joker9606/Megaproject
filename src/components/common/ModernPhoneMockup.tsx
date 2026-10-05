import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bell, Star, ShieldCheck, Phone, Search, Zap, CheckCircle2, ChevronRight, Wrench } from 'lucide-react';

export function ModernPhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[360px] py-4 select-none flex items-center justify-center">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-emerald-500/20 rounded-full blur-[70px] pointer-events-none -z-10" />

      {/* Floating Pill Highlights */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-3 -right-6 z-20 hidden sm:flex items-center gap-2 p-2.5 rounded-2xl bg-navy-900/95 border border-cyan-500/40 backdrop-blur-xl shadow-glow-cyan text-xs text-white"
      >
        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-bold">100% Verified</div>
          <div className="text-[9px] text-slate-400">Aadhaar & Police Checked</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-3 -left-6 z-20 hidden sm:flex items-center gap-2 p-2.5 rounded-2xl bg-navy-900/95 border border-emerald-500/40 backdrop-blur-xl shadow-glow-emerald text-xs text-white"
      >
        <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
          <MapPin className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-bold">Within 2 km</div>
          <div className="text-[9px] text-emerald-400">Hyperlocal Coverage</div>
        </div>
      </motion.div>

      {/* Smartphone Outer Titanium Chassis Frame */}
      <div className="w-full bg-slate-900 p-3 rounded-[48px] shadow-2xl border-4 border-slate-700/80 ring-1 ring-cyan-500/30 relative">
        
        {/* Screen Glass Inner Bezel */}
        <div className="w-full bg-navy-950 rounded-[40px] overflow-hidden border border-slate-800 p-4 space-y-3.5 relative flex flex-col justify-between text-left">
          
          {/* Dynamic Island / Top Speaker Notch */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 px-1">
            <span className="font-bold text-white text-xs">9:41</span>
            <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400 font-semibold text-[11px]">
              <span>5G</span>
              <div className="w-4 h-2.5 border border-slate-400 rounded-sm p-0.5">
                <div className="w-full h-full bg-emerald-400 rounded-xs"></div>
              </div>
            </div>
          </div>

          {/* App Header */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>Indiranagar, Bengaluru</span>
              </div>
              <div className="text-sm font-extrabold text-white">Smart Help Network</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-850 border border-cyan-500/30 flex items-center justify-center relative shadow-sm">
              <Bell className="w-3.5 h-3.5 text-cyan-300" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 absolute -top-0.5 -right-0.5"></span>
            </div>
          </div>

          {/* In-App Quick Search */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px]">Search 24+ verified local trades...</span>
          </div>

          {/* Featured Service Guide Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950/70 via-slate-900 to-navy-900 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Verified Category
              </span>
              <span className="text-[11px] font-extrabold text-emerald-400">from ₹199</span>
            </div>

            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Master Electrician</div>
                <div className="text-[10px] text-slate-400">Wiring, MCB, Inverter & Fan</div>
              </div>
            </div>
          </div>

          {/* Verified Local Specialist Card */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Rajesh Sharma"
                className="w-10 h-10 rounded-xl object-cover border border-cyan-400/50"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">Rajesh Sharma</span>
                  <span className="text-[10px] text-cyan-300 font-semibold bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    0.8 km away
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className="text-amber-400 font-bold">⭐ 4.98</span>
                  <span>•</span>
                  <span>Govt ID Verified</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Rate: <b className="text-white">₹249</b></span>
              <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-[10px] flex items-center gap-1">
                <Phone className="w-2.5 h-2.5" />
                <span>Contact Pro</span>
              </div>
            </div>
          </div>

          {/* In-App Categories Quick Grid */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Popular Local Guides
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-sm">💧</span>
                <div className="text-[9px] font-bold text-white mt-0.5">Plumber</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-sm">❄️</span>
                <div className="text-[9px] font-bold text-white mt-0.5">AC Service</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-sm">🧹</span>
                <div className="text-[9px] font-bold text-white mt-0.5">Cleaning</div>
              </div>
            </div>
          </div>

          {/* App Bottom Dock */}
          <div className="pt-2 flex justify-around text-slate-400 border-t border-slate-800/80 text-[10px]">
            <div className="text-cyan-400 font-bold flex flex-col items-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
              <span>Directory</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span>Pricing</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span>Safety</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span>Account</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
