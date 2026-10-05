import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, Clock, MapPin, Phone, Smartphone, Info, Star, Calendar, ChevronRight } from 'lucide-react';
import { ServiceItem, VerifiedPro } from '../../types';
import { ServiceIcon } from '../common/ServiceIcon';
import { formatINR } from '../../utils/formatCurrency';

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
  pros?: VerifiedPro[];
  onOpenAppModal?: () => void;
  onBookService?: (service: ServiceItem) => void;
  onBookPro?: (pro: VerifiedPro) => void;
}

export function ServiceDetailsModal({
  isOpen,
  onClose,
  service,
  pros = [],
  onOpenAppModal,
  onBookService,
  onBookPro,
}: ServiceDetailsModalProps) {
  if (!isOpen || !service) return null;

  // Filter pros matching this service
  const matchingPros = pros.filter(
    (p) => p.serviceId === service.id || p.service.toLowerCase().includes(service.name.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-navy-900 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] text-left"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-950/80 via-navy-900 to-navy-950 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.gradient || 'from-cyan-500/20 to-blue-500/10'} border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-glow-cyan shrink-0`}>
                <ServiceIcon name={service.icon || service.id} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-xl text-white">{service.name}</h3>
                  {service.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-cyan-300 border border-cyan-500/30">
                      {service.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {service.categoryGroup || service.category} • Hyperlocal Service Guide & Booking
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 overflow-y-auto">
            
            {/* Standard Pricing & Turnaround Info Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Standard Rate</div>
                <div className="text-base sm:text-lg font-black text-emerald-400 mt-0.5">
                  from {formatINR(service.startingPrice)}
                </div>
                <div className="text-[10px] text-slate-500">Transparent neighborhood baseline</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Avg Arrival / Response</div>
                <div className="text-base sm:text-lg font-black text-cyan-300 mt-0.5">
                  {service.avgResponseTime || '15-30 mins'}
                </div>
                <div className="text-[10px] text-slate-500">Within 2-5 km radius</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Quality Standard</div>
                <div className="text-base sm:text-lg font-black text-amber-300 mt-0.5 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{service.rating || '4.9'} / 5</span>
                </div>
                <div className="text-[10px] text-slate-500">{service.completedJobs || '3,000'}+ completed jobs</div>
              </div>
            </div>

            {/* Service Scope & Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Service Scope & Overview</span>
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                {service.description || service.shortDesc}
              </p>
            </div>

            {/* What's Covered / Popular Tasks */}
            {service.popularServices && service.popularServices.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Common Tasks Covered in This Category</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {service.popularServices.map((task, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center gap-2.5 text-xs text-white"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Standards */}
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Neighborhood Trust & Safety Standards</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>100% Aadhaar & Government ID verified service providers.</li>
                <li>Police background verification and neighborhood residence confirmation.</li>
                <li>30-Day service warranty on all domestic repair and installation jobs.</li>
                <li>Zero advance payment required — inspect and pay directly after service completion.</li>
              </ul>
            </div>

            {/* Registered Neighborhood Professionals */}
            {matchingPros.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Active Verified Providers in This Locality
                </h4>
                <div className="space-y-2.5">
                  {matchingPros.map((pro) => (
                    <div
                      key={pro.id}
                      className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="w-10 h-10 rounded-xl object-cover border border-cyan-400/50"
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{pro.name}</span>
                            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                              Verified
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>⭐ {pro.rating}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-cyan-400" /> {pro.neighborhood}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                        <div className="text-left sm:text-right">
                          <div className="text-[10px] text-slate-400">Baseline Rate</div>
                          <div className="text-xs font-bold text-white">{formatINR(pro.hourlyRate)}</div>
                        </div>

                        {onBookPro && (
                          <button
                            onClick={() => {
                              onClose();
                              onBookPro(pro);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-glow-blue transition hover:from-blue-500 hover:to-cyan-400 flex items-center gap-1"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Book Pro</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Helpline Info */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-white">Need immediate assistance or phone inquiry?</div>
                <div className="text-[11px] text-slate-400">Call our 24/7 toll-free neighborhood helpdesk: 1800-120-SMART</div>
              </div>
              {onOpenAppModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAppModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs shrink-0 flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Get Mobile App</span>
                </button>
              )}
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 bg-navy-950/90 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition"
            >
              Close
            </button>

            {onBookService && (
              <button
                onClick={() => {
                  onClose();
                  onBookService(service);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-bold shadow-glow-blue transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Service ({formatINR(service.startingPrice)})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
