import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Lock, Star, CheckCircle2, Shield } from 'lucide-react';

export function WhyTrustUsSection() {
  const pillars = [
    {
      id: 'verified',
      icon: ShieldCheck,
      badge: '100% Vetted',
      title: 'Verified Professionals',
      description: 'We rigorously verify every service provider with criminal background checks, state license cross-referencing, and in-person interviews before they join the network.',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 'hyperlocal',
      icon: MapPin,
      badge: '2-5 km Radius',
      title: 'Hyperlocal Community',
      description: 'Find professionals who live and work right in your locality. Shorter travel distances mean faster response times, lower transit delays, and stronger community trust.',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
      iconColor: 'text-teal-600',
    },
    {
      id: 'safety',
      icon: Lock,
      badge: 'Escrow & Warranty',
      title: 'Safety & Warranty',
      description: 'Your safety and privacy are at the center of the platform. Enjoy private phone number masking, 30-day service warranty, and ₹10,00,000 property protection guarantee.',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'reviews',
      icon: Star,
      badge: 'Real Neighbors Only',
      title: 'Real Verified Reviews',
      description: 'Make confident hiring decisions. Reviews can only be posted by verified homeowners who booked and completed jobs on the network—zero paid or fake testimonials.',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <section id="why-trust-us" className="relative py-20 bg-slate-50 overflow-hidden text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Community Safety Charter</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Built Around <span className="text-blue-600">Trust & Safety</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            We built Smart Neighborhood to solve the uncertainty of hiring strangers. Our multilayered trust system protects every doorstep service call.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="h-full"
              >
                <div className="bg-white rounded-3xl p-6 flex flex-col justify-between border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-card-hover transition-all text-left h-full group">
                  <div>
                    {/* Card Top Icon & Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-13 h-13 rounded-2xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center ${item.iconColor} p-3 group-hover:scale-105 transition-transform duration-200 shadow-sm`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {item.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Guaranteed Standard</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

