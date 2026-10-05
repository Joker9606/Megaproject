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
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] text-left"
        >
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                <ServiceIcon name={service.icon || service.id} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-xl text-slate-900">{service.name}</h3>
                  {service.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                      {service.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {service.categoryGroup || service.category} • Hyperlocal Service Guide & Booking
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 overflow-y-auto bg-white">
            
            {/* Standard Pricing & Turnaround Info Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Pricing Scheme</div>
                <div className="text-sm sm:text-base font-black text-emerald-600 mt-0.5">
                  Custom Quote on Work
                </div>
                <div className="text-[10px] text-slate-400">Pay after completion</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Avg Arrival</div>
                <div className="text-base sm:text-lg font-black text-blue-600 mt-0.5">
                  {service.avgResponseTime || '15-30 mins'}
                </div>
                <div className="text-[10px] text-slate-400">Within 2-5 km radius</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Quality Standard</div>
                <div className="text-base sm:text-lg font-black text-amber-600 mt-0.5 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{service.rating || '4.9'} / 5</span>
                </div>
                <div className="text-[10px] text-slate-400">{service.completedJobs || '3,000'}+ completed jobs</div>
              </div>
            </div>

            {/* Service Scope & Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>Service Scope & Overview</span>
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {service.description || service.shortDesc}
              </p>
            </div>

            {/* What's Covered / Popular Tasks */}
            {service.popularServices && service.popularServices.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Common Tasks Covered in This Category</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {service.popularServices.map((task, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-800 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Standards */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
              <h4 className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Neighborhood Trust & Safety Standards</span>
              </h4>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li>100% Aadhaar & Government ID verified service providers.</li>
                <li>Police background verification and neighborhood residence confirmation.</li>
                <li>30-Day service warranty on all domestic repair and installation jobs.</li>
                <li>Zero advance payment required — inspect and pay directly after service completion.</li>
              </ul>
            </div>

            {/* Registered Neighborhood Professionals */}
            {matchingPros.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Active Verified Providers in This Locality
                </h4>
                <div className="space-y-2.5">
                  {matchingPros.map((pro) => (
                    <div
                      key={pro.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm hover:border-blue-300 transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="w-10 h-10 rounded-xl object-cover border border-blue-600"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{pro.name}</span>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Verified
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>⭐ {pro.rating}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-blue-600" /> {pro.neighborhood}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                        <div className="text-left sm:text-right">
                          <div className="text-[10px] text-slate-500">Pricing Mode</div>
                          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Custom Quote on Work
                          </div>
                        </div>

                        {onBookPro && (
                          <button
                            onClick={() => {
                              onClose();
                              onBookPro(pro);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1"
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
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-900">Need immediate assistance or phone inquiry?</div>
                <div className="text-[11px] text-slate-500">Call our 24/7 toll-free neighborhood helpdesk: 1800-120-SMART</div>
              </div>
              {onOpenAppModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAppModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-blue-600 font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Get Mobile App</span>
                </button>
              )}
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition shadow-sm"
            >
              Close
            </button>

            {onBookService && (
              <button
                onClick={() => {
                  onClose();
                  onBookService(service);
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Service Slot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
