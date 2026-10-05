import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, CalendarCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { TiltCard3D } from '../common/TiltCard3D';

export function HowItWorksSection({ onOpenFindModal }: { onOpenFindModal: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Search',
      tagline: 'Find the service you need.',
      description: 'Select your required trade—electrician, plumber, tutor, or cleaner—and specify your neighborhood locality or postal code.',
      icon: Search,
      preview: {
        badge: 'Hyperlocal Scan',
        title: 'Scanning Radius (3 km)',
        detail: 'Active verified responders available in your area',
      },
    },
    {
      number: '02',
      title: 'Choose',
      tagline: 'Compare verified professionals near you.',
      description: 'Inspect verified badges, neighbor reviews, transparent fixed rates, and real-time response times before deciding.',
      icon: Users,
      preview: {
        badge: 'Verified Match',
        title: 'Rajesh Sharma • 4.98 ⭐',
        detail: 'Master Electrician • 0.8 km away • 318 reviews',
      },
    },
    {
      number: '03',
      title: 'Book',
      tagline: 'Choose a convenient date and time.',
      description: 'Pick an immediate on-demand dispatch or schedule a future slot that matches your routine with zero advance booking fees.',
      icon: CalendarCheck,
      preview: {
        badge: 'Instant Scheduling',
        title: 'Tomorrow, 10:00 AM',
        detail: 'Confirmed with automated SMS & WhatsApp reminders',
      },
    },
    {
      number: '04',
      title: 'Get Help',
      tagline: 'Track your service and get the job done.',
      description: 'Follow your pro via live GPS, call or message safely, and pay via UPI only when you are 100% satisfied.',
      icon: CheckCircle2,
      preview: {
        badge: 'Job Complete',
        title: '100% Satisfaction Guarantee',
        detail: '30-Day Service Warranty & Pay After Service',
      },
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 bg-navy-950/80 overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-electric/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/40 text-xs font-bold text-cyan-300 shadow-glow-blue">
            <span>Simple 4-Step Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Getting Help Is <span className="text-gradient-cyan">Simple.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            From search to completion in four transparent steps with complete neighborhood safety.
          </p>
        </div>

        {/* Animated Connecting Timeline */}
        <div className="relative mt-20">
          
          {/* Glowing Animated Connecting Line behind steps (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-1.5 bg-slate-800 -translate-y-16 z-0 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 shadow-glow-cyan"
            />
          </div>

          {/* 4 Steps Grid with 3D Tilt */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  onClick={() => setActiveStep(idx)}
                  className="h-full"
                >
                  <TiltCard3D tiltMaxAngle={12} glareOpacity={0.25}>
                    <div
                      className={`glass-card p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group text-left h-full ${
                        isSelected
                          ? 'border-cyan-400 shadow-glow-cyan bg-navy-900/95'
                          : 'border-slate-800 hover:border-slate-700 bg-navy-900/60'
                      }`}
                    >
                      <div>
                        {/* Top Row: Number & Icon */}
                        <div className="flex items-center justify-between mb-6">
                          <span
                            style={{ transform: 'translateZ(20px)' }}
                            className="text-3xl font-black text-slate-700 group-hover:text-cyan-400/80 transition-colors font-mono"
                          >
                            {step.number}
                          </span>

                          <div
                            style={{ transform: 'translateZ(25px)' }}
                            className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all p-3 ${
                              isSelected
                                ? 'bg-cyan-500 text-navy-950 font-bold shadow-glow-cyan scale-110'
                                : 'bg-slate-800/80 text-cyan-400 group-hover:bg-cyan-500/20'
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                        </div>

                        {/* Step Title & Tagline */}
                        <h3
                          style={{ transform: 'translateZ(18px)' }}
                          className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors"
                        >
                          {step.title}
                        </h3>
                        <div
                          style={{ transform: 'translateZ(14px)' }}
                          className="text-xs font-bold text-cyan-400 mt-1"
                        >
                          {step.tagline}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Interactive Live Mini Preview Snippet */}
                      <div
                        style={{ transform: 'translateZ(16px)' }}
                        className="mt-6 pt-4 border-t border-slate-800/80"
                      >
                        <div className="p-3 rounded-2xl bg-navy-950/90 border border-slate-800 text-left">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                              {step.preview.badge}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          </div>
                          <div className="text-xs font-bold text-white mt-1.5 truncate">
                            {step.preview.title}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                            {step.preview.detail}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard3D>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Bottom bar */}
        <div className="mt-14 text-center">
          <button
            onClick={onOpenFindModal}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-sm shadow-glow-blue transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            <span>Start Searching in Your Neighborhood</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
