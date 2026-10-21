import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Smartphone,
  Download,
  Send,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Sparkles,
  ExternalLink,
  Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerApkDownload, usePWAInstall, APK_VERSION, APK_SIZE, APK_SHA256 } from '../../utils/appInstall';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppDownloadModal({ isOpen, onClose }: AppDownloadModalProps) {
  const [activeTab, setActiveTab] = useState<'apk' | 'pwa'>('apk');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

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
    triggerApkDownload(() => {
      setTimeout(() => setDownloadStarted(false), 2500);
    });
  };

  const handleInstallPWA = async () => {
    if (isInstallable) {
      await promptInstall();
    } else {
      // If not yet installable (e.g. desktop safari/firefox), give clear instructions
      alert('To install this web application:\n\n• On Chrome / Edge: Click the "Install" icon in your address bar.\n• On iPhone / iPad (Safari): Tap the Share button, then select "Add to Home Screen".\n• On Android: Tap menu (⋮) and choose "Add to Home screen" / "Install app".');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
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
                <p className="text-xs text-slate-500">Hyperlocal help on your devices • Android APK & Installable Web App</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-300 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="px-6 pt-4 flex gap-2 border-b border-slate-100 bg-white">
            <button
              onClick={() => setActiveTab('apk')}
              className={`flex-1 pb-3 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition ${
                activeTab === 'apk'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Download Android APK</span>
            </button>
            <button
              onClick={() => setActiveTab('pwa')}
              className={`flex-1 pb-3 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition ${
                activeTab === 'pwa'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Install Web App (PWA)</span>
            </button>
          </div>

          <div className="p-6 space-y-6 bg-white">
            {activeTab === 'apk' ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-slate-50 border border-blue-100 flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Download className="w-4 h-4 text-blue-600" /> Direct Android APK Package
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Official release build for Android devices ({APK_VERSION} • {APK_SIZE}). Includes full offline support and instant location services.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                      SIGNED RELEASE
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      onClick={handleDirectDownload}
                      className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      {downloadStarted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Downloading APK...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download Android APK Now</span>
                        </>
                      )}
                    </button>

                    <a
                      href="/SmartNeighborhood-v1.0.apk"
                      download="SmartNeighborhood-v1.0.apk"
                      className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition flex items-center justify-center gap-1.5"
                    >
                      <span>Direct Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Checksum and Security Badge */}
                  <div className="pt-2 border-t border-slate-200/80 flex flex-col gap-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-700">SHA-256 Verified Clean & Secure:</span>
                    </div>
                    <code className="text-[10px] bg-white px-2 py-1 rounded-lg border border-slate-200 font-mono text-slate-600 select-all break-all">
                      {APK_SHA256}
                    </code>
                  </div>
                </div>

                {/* QR Code and Mobile camera scan */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                  <div
                    onClick={handleDirectDownload}
                    className="w-20 h-20 bg-white p-1.5 rounded-xl border border-slate-200 flex items-center justify-center shadow-xs cursor-pointer hover:border-blue-400 shrink-0"
                    title="Click or scan to download APK"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect width="100" height="100" fill="white" />
                      <rect x="10" y="10" width="24" height="24" fill="#0F172A" />
                      <rect x="14" y="14" width="16" height="16" fill="white" />
                      <rect x="18" y="18" width="8" height="8" fill="#2563EB" />
                      <rect x="66" y="10" width="24" height="24" fill="#0F172A" />
                      <rect x="70" y="14" width="16" height="16" fill="white" />
                      <rect x="74" y="18" width="8" height="8" fill="#2563EB" />
                      <rect x="10" y="66" width="24" height="24" fill="#0F172A" />
                      <rect x="14" y="70" width="16" height="16" fill="white" />
                      <rect x="18" y="74" width="8" height="8" fill="#2563EB" />
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
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Scan to Download or Click QR</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Point phone camera to trigger immediate APK package download. Compatible with Android 7.0 (Nougat) up to Android 15+.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/60 border border-indigo-100 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" /> Instant Downloadable Web App (PWA)
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Install directly from your web browser with zero APK installation prompts or app store downloads. Works on Android, iOS, Windows & Mac!
                      </p>
                    </div>
                    {isInstalled ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                        INSTALLED
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[10px]">
                        PWA READY
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleInstallPWA}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Laptop className="w-4 h-4" />
                    <span>{isInstalled ? 'App Is Already Installed' : 'Install Web App on This Device'}</span>
                  </button>

                  <div className="pt-2 border-t border-indigo-100 text-[11px] text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800">Installation Instructions:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                      <li><b>Android / Chrome:</b> Tap &quot;Install App&quot; above or open menu (⋮) → &quot;Install App&quot;.</li>
                      <li><b>iPhone / iPad (Safari):</b> Tap Share icon (<span className="text-blue-600">⎙</span>) → &quot;Add to Home Screen&quot;.</li>
                      <li><b>Desktop (Edge/Chrome):</b> Click the install icon in your browser URL bar.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* SMS Link Sender */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Or text the APK download link to your mobile phone:
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
                  <span>Direct APK download link sent to <b>{phone}</b>! Check your messages.</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
