import React from 'react';
import { motion } from 'framer-motion';
import { Users2, ShieldCheck, Heart, Sparkles, Cpu, Globe2 } from 'lucide-react';

export function AboutUsSection() {
  const pillars = [
    { title: 'Community Centered', desc: 'Strengthening local neighborhood bonds and circulating resources back into your immediate community.', icon: Users2 },
    { title: 'Uncompromising Trust', desc: 'Every service provider is thoroughly vetted with state background checks and real peer evaluations.', icon: ShieldCheck },
    { title: 'Local Professionals', desc: 'Empowering independent tradespeople, technicians, and educators to build sustainable local businesses.', icon: Heart },
    { title: 'Universal Accessibility', desc: 'Fair, transparent rates for households of all sizes with dedicated senior and emergency assistance.', icon: Globe2 },
    { title: 'Hyperlocal Technology', desc: 'Intelligent real-time routing algorithms connecting you with the closest verified neighborhood responder.', icon: Cpu },
  ];

  return (
    <section id="about-us" className="relative py-20 bg-white overflow-hidden text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Narrative */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Mission</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              About Smart Neighborhood <span className="text-blue-600">Help Network</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Smart Neighborhood Help Network was founded with a singular purpose: to make finding reliable, skilled local help easier, faster, and genuinely safer for every household.
            </p>

            <p className="text-sm text-slate-500 leading-relaxed">
              In a world of impersonal gig apps, we believe the best solutions are hyperlocal. When your pipes burst or your child needs a math tutor, the most trustworthy help comes from skilled neighbors who live right down the road.
            </p>

            {/* Impact Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-black text-slate-900">480+</div>
                <div className="text-xs text-blue-600 font-semibold mt-0.5">Active Neighborhood Hubs</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-black text-slate-900">99.4%</div>
                <div className="text-xs text-emerald-600 font-semibold mt-0.5">Positive Completion Rate</div>
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
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="bg-slate-50 hover:bg-white rounded-2xl p-4 flex items-start gap-4 border border-slate-200 hover:border-slate-300 transition shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{p.desc}</p>
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

