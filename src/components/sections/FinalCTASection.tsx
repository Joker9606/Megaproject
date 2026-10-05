import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Search, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { ParticleNetwork3D } from '../3d/ParticleNetwork3D';

interface FinalCTASectionProps {
  onOpenAppModal: () => void;
  onOpenFindModal: () => void;
}

export function FinalCTASection({ onOpenAppModal, onOpenFindModal }: FinalCTASectionProps) {
  return (
    <section className="relative py-28 bg-navy-950 overflow-hidden text-center">
      {/* 3D Particle constellation in background */}
      <ParticleNetwork3D count={50} className="opacity-50" />

      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/20 to-emerald-500/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900/90 border border-cyan-500/40 shadow-glow-cyan text-xs font-bold text-cyan-300 backdrop-blur-xl">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hyperlocal Help Network 2026</span>
        </div>

        {/* Big Bold Headline */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
          Your Neighborhood. <br />
          <span className="text-gradient-cyan">Your Trusted Help.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From everyday repairs to urgent assistance, help is closer than you think. Join thousands of neighbors living with peace of mind.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenAppModal}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-glow-blue transition-all transform hover:scale-105 flex items-center gap-2.5"
          >
            <Smartphone className="w-5 h-5" />
            <span>Download the App</span>
          </button>

          <button
            onClick={onOpenFindModal}
            className="px-8 py-4 rounded-2xl bg-slate-850/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white font-extrabold text-sm sm:text-base transition-all flex items-center gap-2 backdrop-blur-md"
          >
            <Search className="w-5 h-5 text-cyan-400" />
            <span>Find Help in My Area</span>
          </button>
        </div>

        {/* Footer Guarantee Mini Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Background-Checked Pros
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" /> Under 30-Min Emergency Response
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Safe Escrow Payment Release
          </span>
        </div>

      </div>
    </section>
  );
}
