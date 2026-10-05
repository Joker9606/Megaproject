import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Search, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface FinalCTASectionProps {
  onOpenAppModal: () => void;
  onOpenFindModal: () => void;
}

export function FinalCTASection({ onOpenAppModal, onOpenFindModal }: FinalCTASectionProps) {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-50 to-blue-50/50 overflow-hidden text-center border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-xs font-bold text-blue-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Hyperlocal Help Network 2026</span>
        </div>

        {/* Big Bold Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Your Neighborhood. <br />
          <span className="text-blue-600">Your Trusted Help.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          From everyday repairs to urgent assistance, help is closer than you think. Join thousands of neighbors living with complete peace of mind.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          <button
            onClick={onOpenAppModal}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition flex items-center gap-2.5"
          >
            <Smartphone className="w-5 h-5" />
            <span>Download the App</span>
          </button>

          <button
            onClick={onOpenFindModal}
            className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-sm sm:text-base transition shadow-sm flex items-center gap-2"
          >
            <Search className="w-5 h-5 text-blue-600" />
            <span>Find Help in My Area</span>
          </button>
        </div>

        {/* Footer Guarantee Mini Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Background-Checked Pros
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> Under 30-Min Emergency Response
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Safe Post-Service Payment
          </span>
        </div>

      </div>
    </section>
  );
}
