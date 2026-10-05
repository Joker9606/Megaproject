import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Lock, Star, CheckCircle2, Shield } from 'lucide-react';
import { TiltCard3D } from '../common/TiltCard3D';

export function WhyTrustUsSection() {
  const pillars = [
    {
      id: 'verified',
      icon: ShieldCheck,
      badge: '100% Vetted',
      title: 'Verified Professionals',
      description: 'We rigorously verify every service provider with criminal background checks, state license cross-referencing, and in-person interviews before they join the network.',
      accent: 'from-blue-500/25 to-cyan-500/15',
      borderColor: 'border-blue-500/40',
      iconColor: 'text-cyan-400',
    },
    {
      id: 'hyperlocal',
      icon: MapPin,
      badge: '2-5 km Radius',
      title: 'Hyperlocal Community',
      description: 'Find professionals who live and work right in your locality. Shorter travel distances mean faster response times, lower transit delays, and stronger community trust.',
      accent: 'from-cyan-500/25 to-teal-500/15',
      borderColor: 'border-cyan-500/40',
      iconColor: 'text-teal-400',
    },
    {
      id: 'safety',
      icon: Lock,
      badge: 'Escrow & UPI Protection',
      title: 'Safety & Warranty',
      description: 'Your safety and privacy are at the center of the platform. Enjoy private phone number masking, 30-day service warranty, and ₹10,00,000 property protection guarantee.',
      accent: 'from-emerald-500/25 to-green-500/15',
      borderColor: 'border-emerald-500/40',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'reviews',
      icon: Star,
      badge: 'Real Neighbors Only',
      title: 'Real Verified Reviews',
      description: 'Make confident hiring decisions. Reviews can only be posted by verified homeowners who booked and completed jobs on the network—zero paid or fake testimonials.',
      accent: 'from-amber-500/25 to-orange-500/15',
      borderColor: 'border-amber-500/40',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <section id="why-trust-us" className="relative py-24 bg-navy-950 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 right-1/4 w-[550px] h-[450px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-xs font-bold text-emerald-300 shadow-glow-emerald">
            <Shield className="w-3.5 h-3.5" />
            <span>Community Safety Charter</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Built Around <span className="text-gradient-cyan">Trust.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            We built Smart Neighborhood to solve the uncertainty of hiring strangers. Our multilayered trust system protects every service call.
          </p>
        </div>

        {/* 4 Feature Cards with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-full"
              >
                <TiltCard3D tiltMaxAngle={12} glareOpacity={0.25}>
                  <div className="glass-card rounded-3xl p-6 flex flex-col justify-between border border-slate-800/90 hover:border-cyan-500/40 relative group h-full bg-gradient-to-b from-navy-900/90 to-navy-950/95 text-left">
                    <div>
                      {/* Card Top Icon & Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div
                          style={{ transform: 'translateZ(25px)' }}
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.accent} border ${item.borderColor} flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <Icon className="w-7 h-7" />
                        </div>

                        <span
                          style={{ transform: 'translateZ(15px)' }}
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-navy-950 text-slate-300 border border-slate-700"
                        >
                          {item.badge}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        style={{ transform: 'translateZ(18px)' }}
                        className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors"
                      >
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div
                      style={{ transform: 'translateZ(15px)' }}
                      className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-bold text-emerald-400"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Guaranteed Standard</span>
                    </div>
                  </div>
                </TiltCard3D>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
