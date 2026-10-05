import React from 'react';
import { motion } from 'framer-motion';
import { Users2, ShieldCheck, Heart, Sparkles, Cpu, Globe2, CheckCircle2 } from 'lucide-react';

export function AboutUsSection() {
  const pillars = [
    { title: 'Community Centered', desc: 'Strengthening local neighborhood bonds and circulating resources back into your immediate community.', icon: Users2 },
    { title: 'Uncompromising Trust', desc: 'Every service provider is thoroughly vetted with state background checks and real peer evaluations.', icon: ShieldCheck },
    { title: 'Local Professionals', desc: 'Empowering independent tradespeople, technicians, and educators to build sustainable local businesses.', icon: Heart },
    { title: 'Universal Accessibility', desc: 'Fair, transparent rates for households of all sizes with dedicated senior and emergency assistance.', icon: Globe2 },
    { title: 'Hyperlocal Technology', desc: 'Intelligent real-time spatial routing algorithms connecting you with the closest verified responder.', icon: Cpu },
  ];

  return (
    <section id="about-us" className="relative py-24 bg-navy-950/80 overflow-hidden">
      {/* Background blur */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[400px] bg-electric/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Narrative */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Mission</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              About Smart Neighborhood <span className="text-gradient-cyan">Help Network</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Smart Neighborhood Help Network was founded with a singular purpose: to make finding reliable, skilled local help easier, faster, and genuinely safer for every household.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              In a world of impersonal gig apps, we believe the best solutions are hyperlocal. When your pipes burst or your child needs a math tutor, the most trustworthy help comes from skilled neighbors who live just down the road.
            </p>

            {/* Impact Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800">
                <div className="text-2xl font-black text-white">480+</div>
                <div className="text-xs text-cyan-400 font-semibold mt-0.5">Active Neighborhood Hubs</div>
              </div>
              <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800">
                <div className="text-2xl font-black text-white">99.4%</div>
                <div className="text-xs text-emerald-400 font-semibold mt-0.5">Positive Completion Rate</div>
              </div>
            </div>
          </div>

          {/* Right Column: 5 Core Value Cards */}
          <div className="lg:col-span-6 space-y-3">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="glass-card rounded-2xl p-4 flex items-start gap-4 border border-slate-800 hover:border-cyan-500/40 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{p.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
