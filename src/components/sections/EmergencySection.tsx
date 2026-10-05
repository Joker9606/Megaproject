import React from 'react';
import { motion } from 'framer-motion';
import { Zap, PhoneCall, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { EmergencyBeacon3D } from '../3d/EmergencyBeacon3D';

interface EmergencySectionProps {
  onOpenEmergencyModal: () => void;
}

export function EmergencySection({ onOpenEmergencyModal }: EmergencySectionProps) {
  return (
    <section id="emergency" className="relative py-20 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 overflow-hidden border-y border-red-500/30">
      {/* Ambient Red & Amber Glowing Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[380px] bg-red-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="glass-card rounded-[36px] p-8 sm:p-12 lg:p-14 border border-red-500/40 bg-gradient-to-r from-navy-900/98 via-navy-950/95 to-red-950/40 shadow-glow-red relative overflow-hidden">
          
          {/* Subtle diagonal stripe accent */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-500/50 text-xs font-bold text-red-300 shadow-lg shadow-red-500/20">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span>24/7 Rapid Hyperlocal SOS Dispatch</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Need Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-rose-400">Right Now?</span>
              </h2>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                When something goes wrong, waiting isn't an option. Our emergency help feature connects you with available verified professionals nearby with guaranteed rapid response times under 30 minutes.
              </p>

              {/* Emergency Service Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-navy-950/90 border border-slate-800 text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span>&lt; 30 Min Arrival</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-medium">Average response time</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-navy-950/90 border border-slate-800 text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>No Surge Fees</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-medium">Standard rate guarantee</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-navy-950/90 border border-slate-800 text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>On-Call 24/7</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-medium">Nights, weekends & holidays</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <button
                  onClick={onOpenEmergencyModal}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm sm:text-base shadow-xl shadow-red-600/30 transition-all transform hover:scale-105 inline-flex items-center gap-2.5"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>Get Emergency Help</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: 3D Emergency Beacon Animation */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <EmergencyBeacon3D />
              <div className="text-center mt-2">
                <span className="text-xs font-bold text-slate-200">Neighborhood Emergency Radar</span>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Active on-call specialists ready for immediate dispatch</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
