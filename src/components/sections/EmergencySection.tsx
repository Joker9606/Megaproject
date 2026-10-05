import React from 'react';
import { motion } from 'framer-motion';
import { Zap, PhoneCall, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { EmergencyBeacon3D } from '../3d/EmergencyBeacon3D';

interface EmergencySectionProps {
  onOpenEmergencyModal: () => void;
}

export function EmergencySection({ onOpenEmergencyModal }: EmergencySectionProps) {
  return (
    <section id="emergency" className="relative py-20 bg-gradient-to-b from-rose-50/50 via-white to-slate-50 overflow-hidden border-y border-rose-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="rounded-[36px] p-8 sm:p-12 lg:p-14 border border-rose-200 bg-white shadow-soft-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                </span>
                <span>24/7 Rapid Hyperlocal SOS Dispatch</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Need Help <span className="text-rose-600">Right Now?</span>
              </h2>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                When something goes wrong, waiting isn't an option. Our emergency help feature connects you with available verified professionals nearby with guaranteed rapid response times under 30 minutes.
              </p>

              {/* Emergency Service Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-rose-600" />
                    <span>&lt; 30 Min Arrival</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">Average response time</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>No Surge Fees</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">Standard rate guarantee</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>On-Call 24/7</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">Nights & holidays ready</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={onOpenEmergencyModal}
                  className="px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm sm:text-base shadow-sm transition-all transform hover:scale-105 inline-flex items-center gap-2.5"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Get Emergency SOS Help</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: 3D Emergency Beacon Animation */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <EmergencyBeacon3D />
              <div className="text-center mt-2">
                <span className="text-xs font-bold text-slate-800">Neighborhood Emergency Radar</span>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Active on-call specialists ready for immediate dispatch</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

