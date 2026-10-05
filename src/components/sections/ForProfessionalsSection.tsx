import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Calendar, Star, TrendingUp } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

interface ForProfessionalsSectionProps {
  onOpenJoinModal: () => void;
}

export function ForProfessionalsSection({ onOpenJoinModal }: ForProfessionalsSectionProps) {
  const { services } = useNetwork();
  
  // Popular default trades for quick calculation
  const popularTrades = [
    { id: 'electrician', name: 'Electrician', avgRate: 350 },
    { id: 'plumber', name: 'Plumber', avgRate: 380 },
    { id: 'ac-repair', name: 'AC Service & Repair', avgRate: 550 },
    { id: 'cleaning', name: 'Deep Cleaning', avgRate: 450 },
    { id: 'carpenter', name: 'Carpenter', avgRate: 400 },
    { id: 'appliance-repair', name: 'Appliance Specialist', avgRate: 420 },
  ];

  const [selectedTradeId, setSelectedTradeId] = useState('electrician');
  const [hoursPerWeek, setHoursPerWeek] = useState(28);

  const selectedTrade = popularTrades.find((t) => t.id === selectedTradeId) || popularTrades[0];
  const estimatedMonthlyEarnings = Math.round(selectedTrade.avgRate * (hoursPerWeek / 2) * 4.2);

  const benefits = [
    { title: 'Zero Commission Fees', desc: 'Keep 100% of your earnings with zero hidden middleman platform cuts.', icon: Users },
    { title: 'Hyperlocal Regular Clients', desc: 'Get direct inquiries from residential societies within 2-5 km of your home.', icon: Calendar },
    { title: 'Build Your Verified Reputation', desc: 'Showcase government ID verification, skill badges, and authentic neighbor reviews.', icon: Star },
    { title: 'Direct Customer Connections', desc: 'Customers contact you directly without third-party lead blockers or bidding wars.', icon: TrendingUp },
  ];

  return (
    <section id="for-pros" className="relative py-20 bg-white overflow-hidden border-t border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Benefits & Narrative */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Partner With Us</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Are You a Skilled <br />
              <span className="text-blue-600">Local Professional?</span>
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Join the Smart Neighborhood Help Network to connect directly with residential households, apartments, and businesses right in your locality.
            </p>

            {/* 4 Core Value Propositions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {benefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition space-y-1.5 text-left">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-sm font-bold text-slate-900">{b.title}</div>
                    <div className="text-xs text-slate-500 leading-relaxed">{b.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Earnings Estimator Card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-slate-50 shadow-soft-lg relative text-left">
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                    Earnings Calculator
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Estimate Your Monthly Income
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select your trade and estimated hours per week:
                  </p>
                </div>

                {/* Popular Trades Chips */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Primary Trade:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {popularTrades.map((trade) => (
                      <button
                        key={trade.id}
                        type="button"
                        onClick={() => setSelectedTradeId(trade.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition text-left flex items-center justify-between ${
                          selectedTradeId === trade.id
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{trade.name}</span>
                        <span className={`text-[10px] font-bold ml-1 ${selectedTradeId === trade.id ? 'text-blue-100' : 'text-blue-600'}`}>
                          ₹{trade.avgRate}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Working Hours Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700">Working hours per week:</span>
                    <span className="text-sm font-black text-blue-600">{hoursPerWeek} hrs/week</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="48"
                    step="2"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    aria-label="Working hours per week"
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
                    <span>Part-time (10h)</span>
                    <span>Regular (28h)</span>
                    <span>Full-time (48h)</span>
                  </div>
                </div>

                {/* Estimated Earnings Display Card */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
                  <span className="text-xs text-slate-500 font-bold tracking-wide uppercase">
                    Estimated Monthly Take-Home
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900">
                    ₹{estimatedMonthlyEarnings.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-500"> / month</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1.5">
                    Based on ~₹{selectedTrade.avgRate} avg per service booking in your area
                  </div>
                </div>

                <button
                  onClick={onOpenJoinModal}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition transform hover:scale-[1.01]"
                >
                  Register as a Professional
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

