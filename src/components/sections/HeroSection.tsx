import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Search, ArrowRight, Smartphone, CheckCircle2, Sparkles, Wrench, Zap, Star } from 'lucide-react';
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
    <section id="home" className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden flex items-center">
      {/* 3D Background Spatial Particle Constellation */}
      <ParticleNetwork3D count={65} className="opacity-60" />

      {/* Dynamic Background Gradients and Light Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[520px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Controls */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-7 text-left"
          >
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-navy-900/90 border border-cyan-500/40 shadow-glow-cyan text-xs font-bold text-cyan-300 backdrop-blur-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Hyperlocal 3D Information Mesh</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-normal">24+ Service Categories</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              <span className="text-white block">Trusted Help,</span>
              <span className="text-gradient-cyan block mt-1">Right in Your</span>
              <span className="text-gradient-electric block">Neighborhood.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Explore verified neighborhood services, scope checklists, standard pricing in INR, and local certified professionals across your locality in real-time 3D.
            </p>

            {/* Interactive Hyperlocal Quick Search Bar */}
            <form
              onSubmit={handleSearch}
              className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-navy-900/95 border border-cyan-500/40 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row gap-2 max-w-xl"
            >
              {/* Service Select */}
              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-800/80 rounded-xl sm:rounded-2xl border border-slate-700/80">
                <Wrench className="w-4 h-4 text-cyan-400 shrink-0" />
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  aria-label="Select Service"
                  className="w-full bg-transparent text-xs sm:text-sm text-white font-semibold focus:outline-none cursor-pointer"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id} className="bg-navy-900 text-white">
                      {s.name} (from {formatINR(s.startingPrice)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-800/80 rounded-xl sm:rounded-2xl border border-slate-700/80">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="Locality / Pincode"
                  className="w-full bg-transparent text-xs sm:text-sm text-white font-medium focus:outline-none placeholder-slate-500"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white text-xs sm:text-sm font-extrabold shadow-glow-blue transition-all flex items-center justify-center gap-2 shrink-0 transform hover:scale-[1.03]"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Direct CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => onOpenFindModal()}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-sm shadow-glow-blue transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Explore All Services</span>
              </button>

              <button
                onClick={onOpenAppModal}
                className="px-6 py-3.5 rounded-2xl bg-slate-850/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-md"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Download App</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Aadhaar & Police Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transparent Rate Benchmarks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>30-Day Service Warranty</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive 3D Smart Neighborhood Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            {/* Floating 3D Badge highlights */}
            <div className="absolute -top-4 -left-4 z-20 hidden sm:flex items-center gap-2.5 p-3 rounded-2xl bg-navy-900/95 border border-cyan-500/40 backdrop-blur-xl shadow-glow-cyan animate-float">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">24+ Services</div>
                <div className="text-[10px] text-cyan-300">Complete Directory Guides</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 z-20 hidden sm:flex items-center gap-2.5 p-3 rounded-2xl bg-navy-900/95 border border-emerald-500/40 backdrop-blur-xl shadow-glow-emerald animate-float-delayed">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">100% Verified</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Local Certified Pros</div>
              </div>
            </div>

            {/* 3D Neighborhood Interactive Canvas */}
            <NeighborhoodCanvas onSelectPro={onSelectProFromMap} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
