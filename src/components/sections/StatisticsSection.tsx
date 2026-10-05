import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Star, Clock } from 'lucide-react';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { TiltCard3D } from '../common/TiltCard3D';
import { useNetwork } from '../../context/NetworkContext';
import { useAuth } from '../../context/AuthContext';

export function StatisticsSection() {
  const { pros } = useNetwork();
  const { bookings, workerJobs } = useAuth();

  // Calculate total completed jobs across all workers
  const totalCompletedJobs =
    Object.values(workerJobs).reduce((acc, list) => acc + list.length, 0) +
    bookings.filter((b) => b.status === 'Completed').length;

  const stats = [
    {
      id: 'pros',
      value: pros.length,
      suffix: pros.length > 0 ? '+' : '',
      label: 'Verified Professionals',
      subtext: pros.length > 0 ? 'Aadhaar & KYC verified' : 'Strict verification active',
      icon: ShieldCheck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/15',
      borderColor: 'border-blue-500/40',
      glowShadow: 'hover:shadow-glow-blue',
    },
    {
      id: 'jobs',
      value: totalCompletedJobs,
      suffix: totalCompletedJobs > 0 ? '+' : '',
      label: 'Services Completed',
      subtext: 'Across local residential clusters',
      icon: CheckCircle2,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/15',
      borderColor: 'border-cyan-500/40',
      glowShadow: 'hover:shadow-glow-cyan',
    },
    {
      id: 'rating',
      value: 5.0,
      suffix: '/5',
      decimals: 1,
      label: 'Average Pro Rating',
      subtext: 'From verified neighborhood residents',
      icon: Star,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/15',
      borderColor: 'border-amber-500/40',
      glowShadow: 'hover:shadow-glow-amber',
    },
    {
      id: 'support',
      value: 24,
      suffix: '/7',
      label: 'Emergency SOS Response',
      subtext: 'Fast 15-30 min doorstep arrival',
      icon: Clock,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/15',
      borderColor: 'border-emerald-500/40',
      glowShadow: 'hover:shadow-glow-emerald',
    },
  ];

  return (
    <section className="relative py-16 bg-navy-950/80 border-y border-slate-800/80 overflow-hidden">
      {/* Subtle background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 4 Statistics Cards with 3D Tilt Physics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <TiltCard3D tiltMaxAngle={12} glareOpacity={0.2}>
                  <div className={`glass-card p-6 rounded-3xl border ${item.borderColor} ${item.glowShadow} transition-all text-center flex flex-col items-center justify-center relative group h-full`}>
                    {/* Icon Container with 3D Pop */}
                    <div
                      style={{ transform: 'translateZ(25px)' }}
                      className={`w-14 h-14 rounded-2xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <Icon className={`w-7 h-7 ${item.color}`} />
                    </div>

                    {/* Animated Number */}
                    <div
                      style={{ transform: 'translateZ(20px)' }}
                      className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                    >
                      <AnimatedCounter
                        value={item.value}
                        suffix={item.suffix}
                        decimals={item.decimals || 0}
                        duration={2.2}
                      />
                    </div>

                    {/* Label */}
                    <div
                      style={{ transform: 'translateZ(15px)' }}
                      className="text-sm font-bold text-slate-100 mt-1.5"
                    >
                      {item.label}
                    </div>

                    {/* Subtext */}
                    <div
                      style={{ transform: 'translateZ(10px)' }}
                      className="text-[11px] text-slate-400 mt-0.5 font-medium"
                    >
                      {item.subtext}
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
