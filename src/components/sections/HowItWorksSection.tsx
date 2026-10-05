import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, CalendarCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export function HowItWorksSection({ onOpenFindModal }: { onOpenFindModal: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Search Service',
      tagline: 'Find the service you need.',
      description: 'Select your required trade—electrician, plumber, tutor, or cleaner—and specify your neighborhood locality or postal code.',
      icon: Search,
      preview: {
        badge: 'Local Scan',
        title: 'Neighborhood Radius (3 km)',
        detail: 'Active verified responders available near you',
      },
    },
    {
      number: '02',
      title: 'Choose Specialist',
      tagline: 'Compare verified professionals.',
      description: 'Inspect verified badges, neighbor reviews, transparent fixed rates, and real-time response times before deciding.',
      icon: Users,
      preview: {
        badge: 'Verified Match',
        title: 'Rajesh Sharma • 4.9 ⭐',
        detail: 'Master Electrician • 0.8 km away • 318 reviews',
      },
    },
    {
      number: '03',
      title: 'Schedule Booking',
      tagline: 'Choose a convenient date and time.',
      description: 'Pick an immediate on-demand dispatch or schedule a future slot that matches your routine with zero advance booking fees.',
      icon: CalendarCheck,
      preview: {
        badge: 'Instant Confirmation',
        title: 'Tomorrow, 10:00 AM',
        detail: 'Confirmed with automated SMS & WhatsApp reminders',
      },
    },
    {
      number: '04',
      title: 'Doorstep Help & Pay',
      tagline: 'Track your service and get the job done.',
      description: 'Follow your pro via live updates, share your 4-digit start PIN, and pay via UPI only when you are 100% satisfied.',
      icon: CheckCircle2,
      preview: {
        badge: 'Job Complete',
        title: '100% Satisfaction Guarantee',
        detail: '30-Day Service Warranty & Pay After Service',
      },
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 bg-white overflow-hidden text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
            <span>Simple 4-Step Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Getting Help Is <span className="text-blue-600">Simple & Safe</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From search to completion in four transparent steps with complete neighborhood safety.
          </p>
        </div>

        {/* Connecting Timeline */}
        <div className="relative mt-16">
          
          {/* Connecting Line behind steps (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-1 bg-slate-200 -translate-y-14 z-0 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="h-full bg-blue-600"
            />
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  onClick={() => setActiveStep(idx)}
                  className="h-full"
                >
                  <div
                    className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group text-left h-full ${
                      isSelected
                        ? 'border-blue-500 shadow-soft-lg bg-blue-50/40'
                        : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Top Row: Number & Icon */}
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-2xl font-black text-slate-300 group-hover:text-blue-600 transition-colors font-mono">
                          {step.number}
                        </span>

                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all p-3 ${
                            isSelected
                              ? 'bg-blue-600 text-white font-bold shadow-md scale-105'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Step Title & Tagline */}
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>
                      <div className="text-xs font-semibold text-blue-600 mt-0.5">
                        {step.tagline}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Preview Snippet */}
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                            {step.preview.badge}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 mt-1.5 truncate">
                          {step.preview.title}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                          {step.preview.detail}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Bottom bar */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenFindModal}
            className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            <span>Start Searching in Your Neighborhood</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

