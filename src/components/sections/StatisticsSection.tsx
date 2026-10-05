import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Star, Clock } from 'lucide-react';
import { AnimatedCounter } from '../common/AnimatedCounter';
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
      subtext: 'Aadhaar & Police KYC verified',
      icon: ShieldCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
    {
      id: 'jobs',
      value: totalCompletedJobs > 0 ? totalCompletedJobs : 3480,
      suffix: '+',
      label: 'Services Completed',
      subtext: 'Across local residential clusters',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      id: 'rating',
      value: 4.9,
      suffix: '/5',
      decimals: 1,
      label: 'Average Pro Rating',
      subtext: 'From verified neighbor homeowners',
      icon: Star,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
    {
      id: 'support',
      value: 24,
      suffix: '/7',
      label: 'Emergency SOS Response',
      subtext: 'Under 30-min doorstep arrival',
      icon: Clock,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
    },
  ];

  return (
    <section className="relative py-14 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-slate-50 hover:bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-soft transition-all text-center flex flex-col items-center justify-center group"
              >
                {/* Icon Container */}
                <div
                  className={`w-12 h-12 rounded-2xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm`}
                >
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>

                {/* Animated Number */}
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  <AnimatedCounter
                    value={item.value}
                    suffix={item.suffix}
                    decimals={item.decimals || 0}
                    duration={2}
                  />
                </div>

                {/* Label */}
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  {item.label}
                </div>

                {/* Subtext */}
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  {item.subtext}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

