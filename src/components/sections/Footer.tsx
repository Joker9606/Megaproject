import React, { useState } from 'react';
import { Shield, Send, CheckCircle2, Heart, ArrowUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    } catch {
      // fallback
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <a href="#home" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-white tracking-tight">
                  Smart Neighborhood
                </span>
                <span className="text-xs text-blue-400 font-semibold">
                  Help Network
                </span>
              </div>
            </a>

            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Making local help easier, safer, and more accessible. Connecting neighbors with background-checked local professionals in real time.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-xs font-bold text-white block mb-2">Get neighborhood safety updates & pro discounts</span>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Subscribed! Welcome to the community.</span>
                </div>
              )}
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-blue-400 transition">Home</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition">Services Directory</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-400 transition">How It Works</a></li>
              <li><a href="#why-trust-us" className="hover:text-blue-400 transition">Why Trust Us</a></li>
              <li><a href="#about-us" className="hover:text-blue-400 transition">About Network</a></li>
            </ul>
          </div>

          {/* Col 4: Community & Pros */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Community</h4>
            <ul className="space-y-2">
              <li><a href="#about-us" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#for-pros" className="hover:text-blue-400 transition">For Local Professionals</a></li>
              <li><a href="#safety" className="hover:text-blue-400 transition">Safety & Verification Charter</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition">24/7 Community Support</a></li>
              <li><a href="#safety" className="hover:text-blue-400 transition">FAQ & Help Center</a></li>
            </ul>
          </div>

          {/* Col 5: Legal & Hub */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal & Standards</h4>
            <ul className="space-y-2">
              <li><a href="#safety" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              <li><a href="#safety" className="hover:text-blue-400 transition">Terms of Service</a></li>
              <li><a href="#safety" className="hover:text-blue-400 transition">Payment Protection Rules</a></li>
              <li><a href="#safety" className="hover:text-blue-400 transition">Background Check Standards</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition">Regional Hub Directory</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-xs">
            © 2026 Smart Neighborhood Help Network. All rights reserved. Built for community resilience and trust.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
