import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, CheckCircle2, Navigation, MessageSquare, ShieldCheck, ArrowRight, RotateCw } from 'lucide-react';
import { ModernPhoneMockup } from '../common/ModernPhoneMockup';
import { Smartphone3D } from '../3d/Smartphone3D';

interface AppPromotionSectionProps {
  onOpenAppModal: () => void;
  onOpenLearnMore: () => void;
}

export function AppPromotionSection({ onOpenAppModal, onOpenLearnMore }: AppPromotionSectionProps) {
  const [use3DView, setUse3DView] = useState(true);

  const appFeatures = [
    {
      title: 'Hyperlocal Provider Directory',
      desc: 'Browse certified technicians, cleaners, educators, and repair specialists residing in your locality.',
      icon: Navigation,
    },
    {
      title: 'Direct Verified Contact',
      desc: 'View phone numbers, inspect skill badges, and contact nearby professionals directly with zero middlemen.',
      icon: MessageSquare,
    },
    {
      title: 'Transparent Pricing Benchmarks',
      desc: 'Know standard baseline rates in INR (₹) before hiring, protected with our community safety charter.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="relative py-24 bg-navy-950 overflow-hidden border-t border-slate-800">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: 3D Interactive Smartphone / Modern Crisp Phone */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-center justify-center">
            {/* View Mode Toggle Pill */}
            <div className="mb-3 inline-flex items-center gap-1.5 p-1 rounded-2xl bg-navy-900 border border-slate-700/80 backdrop-blur-md shadow-lg">
              <button
                onClick={() => setUse3DView(true)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  use3DView
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-glow-blue'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <RotateCw className="w-3 h-3" />
                <span>3D Interactive Orbit</span>
              </button>
              <button
                onClick={() => setUse3DView(false)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  !use3DView
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-glow-blue'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>HD Flat Mockup</span>
              </button>
            </div>

            {use3DView ? <Smartphone3D /> : <ModernPhoneMockup />}
          </div>

          {/* Right Column: Content & Downloads */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-xs font-bold text-cyan-300 shadow-glow-cyan">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Experience</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Help Is Just a <span className="text-gradient-cyan">Tap Away.</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              The Smart Neighborhood mobile app makes it effortless to search local service guides, connect directly with verified neighbors, and check standard rates on the go.
            </p>

            {/* App Features */}
            <div className="space-y-4 pt-2">
              {appFeatures.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Download Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenAppModal}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-glow-blue transition-all transform hover:scale-105 flex items-center gap-2.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Android App</span>
              </button>

              <button
                onClick={onOpenLearnMore}
                className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
              >
                <span>App Overview</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Available for Android (APK / Google Play) & iOS (App Store) • v2.4.0</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
