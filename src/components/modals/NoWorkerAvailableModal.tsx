import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Wrench, ShieldAlert, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../../types';

interface NoWorkerAvailableModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceItem | null;
  onOpenJoinPro?: () => void;
  onExploreOtherServices?: () => void;
}

export function NoWorkerAvailableModal({
  isOpen,
  onClose,
  service,
  onOpenJoinPro,
  onExploreOtherServices,
}: NoWorkerAvailableModalProps) {
  if (!isOpen) return null;

  const serviceName = service?.name || 'this service';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-navy-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col text-left"
        >
          {/* Top Decorative Amber/Red Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

          {/* Header */}
          <div className="p-6 pb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-glow-amber">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">No Verified Pro Available</h3>
                <p className="text-xs text-amber-400 font-semibold">{serviceName}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 pt-2 space-y-4">
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                There are currently no active, background-verified professionals registered for{' '}
                <b className="text-white">{serviceName}</b> in your neighborhood area.
              </p>
              <p className="text-slate-400">
                To protect resident security and uphold strict quality standards, we strictly disallow placeholder or fake bookings.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">What you can do:</p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Check back later once a verified technician joins the locality.</li>
                <li>Browse other active trades with registered neighborhood providers.</li>
                <li>Know a trusted local specialist? Encourage them to register as a Pro.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              {onOpenJoinPro && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenJoinPro();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-glow-amber transition flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Register as a Pro for {serviceName}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onExploreOtherServices) onExploreOtherServices();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>Browse Available Services</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
