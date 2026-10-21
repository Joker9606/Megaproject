import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Download, X, Laptop } from 'lucide-react';
import { usePWAInstall, triggerApkDownload, APK_VERSION } from '../../utils/appInstall';

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const hasDismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (hasDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await promptInstall();
    } else {
      triggerApkDownload();
    }
  };

  if (isInstalled || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="App Installation Banner"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white border border-blue-200/90 rounded-2xl p-4 shadow-xl shadow-blue-500/10 flex flex-col gap-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-extrabold text-slate-900">Get the Smart Help App</h4>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                  {APK_VERSION}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Install downloadable Web App or download direct Android APK.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Install Web App</span>
            </button>
          )}

          <a
            href="/SmartNeighborhood-v1.0.apk"
            download="SmartNeighborhood-v1.0.apk"
            onClick={() => triggerApkDownload()}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download APK</span>
          </a>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
