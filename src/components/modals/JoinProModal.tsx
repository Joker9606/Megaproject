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
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-navy-900 border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col text-left"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-950/70 via-navy-900 to-navy-950 border-b border-blue-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-cyan-300">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Join as a Local Professional</h3>
                <p className="text-xs text-slate-400">List your profile & skills in the verified neighborhood directory</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto">
            {!isDone ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Legal Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98450 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Trade / Skill *</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    {services.map((svc) => (
                      <option key={svc.id} value={svc.id} className="bg-navy-900 text-white">
                        {svc.name} ({svc.categoryGroup || svc.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Baseline Rate (₹)</label>
                    <div className="relative">
                      <span className="text-sm font-bold text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                      <input
                        type="number"
                        min="99"
                        max="5000"
                        step="50"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        className="w-full pl-8 pr-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Locality / Area</label>
                    <input
                      type="text"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      placeholder="e.g. Indiranagar, Bengaluru"
                      className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Short Bio / Experience</label>
                  <textarea
                    rows={2}
                    placeholder="Tell neighbors about your experience, certifications, and trade specialty..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Verification Notice */}
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    By submitting, you agree to our 4-tier safety charter (Aadhaar KYC check and police background clearance).
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-blue transition flex items-center justify-center gap-2"
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
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-white">Registration Submitted!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Welcome to the network, <span className="font-semibold text-cyan-300">{formData.fullName}</span>! Your profile has been added to our verification queue for your locality.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-navy-950 font-bold text-xs shadow-glow-cyan"
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
