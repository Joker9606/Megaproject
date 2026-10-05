import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface JoinProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinProModal({ isOpen, onClose }: JoinProModalProps) {
  const { services, registerPro } = useNetwork();
  const { registerWorker } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceId: services[0]?.id || 'electrician',
    hourlyRate: '249',
    neighborhood: 'Indiranagar / 100ft Road',
    bio: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    setIsSubmitting(true);
    const selectedServiceObj = services.find((s) => s.id === formData.serviceId);
    const serviceName = selectedServiceObj?.name || 'Local Specialist';

    const res = await registerWorker({
      name: formData.fullName.trim(),
      email: formData.email.trim() || `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@smartneighborhood.in`,
      phone: formData.phone.trim() || '+91 98450 00000',
      serviceName,
      serviceId: formData.serviceId,
      hourlyRate: formData.hourlyRate,
      experienceYears: '4+ Years',
      neighborhood: formData.neighborhood.trim(),
      emergencyReady: true,
      bio: formData.bio.trim(),
    });

    registerPro({
      id: res.worker?.id,
      name: formData.fullName.trim(),
      serviceName,
      serviceId: formData.serviceId,
      hourlyRate: formData.hourlyRate,
      neighborhood: formData.neighborhood.trim(),
      bio: formData.bio.trim() || `Experienced neighborhood specialist offering ${serviceName}.`,
      phone: formData.phone.trim() || '+91 98450 00000',
      email: formData.email.trim() || `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@smartneighborhood.in`,
      isEmergencyReady: true,
    });

    setIsSubmitting(false);
    setIsDone(true);
    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch {
      // fallback
    }
  };

  const handleClose = () => {
    setIsDone(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col text-left"
        >
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Join as a Local Professional</h3>
                <p className="text-xs text-slate-500">List your profile & skills in the verified neighborhood directory</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 rounded-xl bg-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto bg-white">
            {!isDone ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98450 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Trade / Skill *</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                  >
                    {services.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        {svc.name} ({svc.categoryGroup || svc.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Baseline Rate (₹)</label>
                    <div className="relative">
                      <span className="text-sm font-bold text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                      <input
                        type="number"
                        min="99"
                        max="5000"
                        step="50"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Locality / Area</label>
                    <input
                      type="text"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      placeholder="e.g. Indiranagar, Bengaluru"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Short Bio / Experience</label>
                  <textarea
                    rows={2}
                    placeholder="Tell neighbors about your experience, certifications, and trade specialty..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
                  />
                </div>

                {/* Verification Notice */}
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    By submitting, you agree to our 4-tier safety charter (Aadhaar KYC check and police background clearance).
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Submit Professional Registration</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Registration Submitted!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Welcome to the network, <span className="font-semibold text-slate-900">{formData.fullName}</span>! Your profile has been added to our verification queue for your locality.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700"
                >
                  View Directory
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
