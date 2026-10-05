import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, Headphones } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {
        // fallback
      }
    }, 800);
  };

  return (
    <section id="contact" className="relative py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>24/7 Community Desk</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Let's <span className="text-blue-600">Connect</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Have a question about neighborhood coverage, pro onboarding, or community partnerships? Our support team is here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-16 items-start">
          
          {/* Left Column: Direct Contact Details */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">Get in Touch Directly</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Reach out to our dedicated neighborhood support coordinators or emergency assistance desk.
              </p>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold">Email Us</div>
                  <a href="mailto:support@smartneighborhood.network" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition">
                    support@smartneighborhood.network
                  </a>
                  <div className="text-[11px] text-slate-500">Average reply under 1 hour</div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold">Toll-Free Neighborhood Hotline</div>
                  <a href="tel:18001207627" className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition">
                    1800-120-SMART (76278)
                  </a>
                  <div className="text-[11px] text-emerald-600 font-semibold">24/7 Priority Helpline</div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold">Headquarters & Community Hub</div>
                  <div className="text-sm font-bold text-slate-900">100ft Road, Indiranagar</div>
                  <div className="text-[11px] text-slate-500">Bengaluru, Karnataka 560038</div>
                </div>
              </div>

              {/* Live Hours */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 text-xs text-slate-700 shadow-sm">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Live Chat & Phone Support open <b>24 Hours / 7 Days a Week</b></span>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Rajesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">Your Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="rajesh@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Pro Verification Support">Professional Verification / Onboarding</option>
                      <option value="Billing & Escrow">Billing & Escrow Protection</option>
                      <option value="Neighborhood Expansion">Request Network Expansion to My Area</option>
                      <option value="Partnership">Municipal / HOA Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help your neighborhood today?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Message Sent Successfully!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you, <span className="font-semibold text-slate-900">{formData.name}</span>! Our neighborhood support desk has received your ticket and will respond to <span className="font-semibold text-slate-900">{formData.email}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
