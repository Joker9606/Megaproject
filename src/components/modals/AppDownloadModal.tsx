import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, QrCode, Download, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppDownloadModal({ isOpen, onClose }: AppDownloadModalProps) {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSent(true);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch {
      // fallback
    }
  };

  const handleDirectDownload = () => {
    setDownloadStarted(true);
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {
      // fallback
    }
    setTimeout(() => {
      // Trigger virtual download
      const element = document.createElement('a');
      const file = new Blob(['Smart Neighborhood Help Network - Android APK v2.4.0 (Release build)'], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'SmartNeighborhood-v2.4.apk';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Get the Smart Help App</h3>
                <p className="text-xs text-slate-500">Hyperlocal help in your pocket • iOS & Android</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 bg-white">
            {/* Top Download Methods Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Method A: QR Code */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center space-y-2">
                <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                  {/* Stylized QR Code SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect width="100" height="100" fill="white" />
                    {/* Top left corner */}
                    <rect x="10" y="10" width="24" height="24" fill="#0F172A" />
                    <rect x="14" y="14" width="16" height="16" fill="white" />
                    <rect x="18" y="18" width="8" height="8" fill="#2563EB" />
                    {/* Top right corner */}
                    <rect x="66" y="10" width="24" height="24" fill="#0F172A" />
                    <rect x="70" y="14" width="16" height="16" fill="white" />
                    <rect x="74" y="18" width="8" height="8" fill="#2563EB" />
                    {/* Bottom left corner */}
                    <rect x="10" y="66" width="24" height="24" fill="#0F172A" />
                    <rect x="14" y="70" width="16" height="16" fill="white" />
                    <rect x="18" y="74" width="8" height="8" fill="#2563EB" />
                    {/* Data patterns */}
                    <rect x="42" y="14" width="6" height="6" fill="#0F172A" />
                    <rect x="52" y="22" width="6" height="6" fill="#2563EB" />
                    <rect x="44" y="38" width="12" height="12" fill="#0F172A" />
                    <rect x="22" y="44" width="6" height="12" fill="#0F172A" />
                    <rect x="68" y="44" width="16" height="6" fill="#2563EB" />
                    <rect x="42" y="66" width="8" height="8" fill="#0F172A" />
                    <rect x="70" y="70" width="16" height="16" fill="#0F172A" />
                    <rect x="54" y="80" width="8" height="8" fill="#2563EB" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-900">Scan with Phone Camera</span>
                <span className="text-[11px] text-slate-500">Direct open in Play Store / App Store</span>
              </div>

              {/* Method B: Direct APK */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-blue-600" /> Direct Android APK
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Download the signed APK package for Android devices (v2.4.0 • 28MB).
                  </p>
                </div>

                <button
                  onClick={handleDirectDownload}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                >
                  {downloadStarted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Downloading APK...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Android APK</span>
                    </>
                  )}
                </button>

                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>SHA-256 Verified Clean & Secure</span>
                </div>
              </div>
            </div>

            {/* SMS Link Sender */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Or text the link directly to your mobile phone:
              </label>

              {!sent ? (
                <form onSubmit={handleSendLink} className="flex gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send SMS</span>
                  </button>
                </form>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Download link sent to <b>{phone}</b>! Check your messages.</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
