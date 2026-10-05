import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Search, ArrowRight, Smartphone, CheckCircle2, Sparkles, Wrench, Star } from 'lucide-react';
import { NeighborhoodCanvas } from '../3d/NeighborhoodCanvas';
import { ParticleNetwork3D } from '../3d/ParticleNetwork3D';
import { useNetwork } from '../../context/NetworkContext';
import { formatINR } from '../../utils/formatCurrency';

interface HeroSectionProps {
  onOpenFindModal: (serviceId?: string) => void;
  onOpenAppModal: () => void;
  onSelectProFromMap?: (proName: string, service: string) => void;
}

export function HeroSection({ onOpenFindModal, onOpenAppModal, onSelectProFromMap }: HeroSectionProps) {
  const { services } = useNetwork();
  const [selectedService, setSelectedService] = useState('electrician');
  const [locationText, setLocationText] = useState('Indiranagar, Bengaluru (560038)');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenFindModal(selectedService);
  };

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden flex items-center bg-gradient-to-b from-slate-50 via-blue-50/30 to-white text-slate-900">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-blue-100/60 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Controls */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Verified Neighborhood Network</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600 font-semibold">24+ Service Categories</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-slate-900">
              <span>Trusted Local Help,</span> <br />
              <span className="text-blue-600">Right in Your</span> <br />
              <span>Neighborhood.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Connect with background-checked local electricians, plumbers, technicians, cleaners, and tutors. Transparent standard rates in INR with zero advance fees.
            </p>

            {/* Interactive Hyperlocal Quick Search Bar */}
            <form
              onSubmit={handleSearch}
              className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-soft-lg flex flex-col sm:flex-row gap-2 max-w-xl"
            >
              {/* Service Select */}
              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200">
                <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  aria-label="Select Service"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none cursor-pointer"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id} className="bg-white text-slate-900">
                      {s.name} (from {formatINR(s.startingPrice)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="Locality / Pincode"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 font-medium focus:outline-none placeholder-slate-400"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 transform hover:scale-[1.02]"
              >
                <span>Find Help</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Direct CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onOpenFindModal()}
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Browse All Services</span>
              </button>

              <button
                onClick={onOpenAppModal}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Get Mobile App</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Aadhaar & Police Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Standard Fixed Rates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>30-Day Service Warranty</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Neighborhood Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            {/* Floating Highlights */}
            <div className="absolute -top-3 -left-3 z-20 hidden sm:flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-soft-lg">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">24+ Services</div>
                <div className="text-[10px] text-slate-500">Fixed Upfront Rates</div>
              </div>
            </div>

            <div className="absolute -bottom-3 -right-3 z-20 hidden sm:flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-soft-lg">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">100% Vetted</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Local Certified Pros</div>
              </div>
            </div>

            {/* Neighborhood Interactive Canvas */}
            <NeighborhoodCanvas onSelectPro={onSelectProFromMap} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

