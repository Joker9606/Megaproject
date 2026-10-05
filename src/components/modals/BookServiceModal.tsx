import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, ShieldCheck, CheckCircle2, User, Phone, FileText, Lock, Sparkles, ArrowRight, Check } from 'lucide-react';
import { VerifiedPro, ServiceItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ResidentUser } from '../../types/auth';
import confetti from 'canvas-confetti';
import { formatINR } from '../../utils/formatCurrency';
import { ServiceIcon } from '../common/ServiceIcon';

interface BookServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceItem | null;
  pro?: VerifiedPro | null;
}

export function BookServiceModal({ isOpen, onClose, service, pro }: BookServiceModalProps) {
  const { currentUser, addBooking } = useAuth();
  const resident = currentUser && currentUser.role === 'user' ? (currentUser as ResidentUser) : null;

  const [selectedSlot, setSelectedSlot] = useState('Immediate Dispatch (< 30 mins)');
  const [customerName, setCustomerName] = useState(resident?.name || '');
  const [customerPhone, setCustomerPhone] = useState(resident?.phone || '');
  const [address, setAddress] = useState(
    resident?.apartment ? `${resident.apartment}, ${resident.neighborhood}` : 'Indiranagar, Bengaluru'
  );
  const [taskDetails, setTaskDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('4821');

  useEffect(() => {
    if (resident) {
      if (!customerName) setCustomerName(resident.name);
      if (!customerPhone) setCustomerPhone(resident.phone);
      if (resident.apartment && resident.neighborhood) {
        setAddress(`${resident.apartment}, ${resident.neighborhood}`);
      }
    }
  }, [resident]);

  if (!isOpen) return null;

  const serviceName = service?.name || pro?.service || 'Local Home Service';
  const categoryName = service?.categoryGroup || service?.category || 'Home Repair';
  const baselineRate = formatINR(pro?.hourlyRate || service?.startingPrice || '₹249');
  const proName = pro?.name || 'Verified Professional';
  const proAvatar =
    pro?.avatar ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80';
  const proRating = pro?.rating || 5.0;
  const proNeighborhood = pro?.neighborhood || resident?.neighborhood || 'Indiranagar / 100ft Road';

  const timeSlots = [
    'Immediate Dispatch (< 30 mins)',
    'Today, 4:00 PM - 6:00 PM',
    'Tomorrow, 10:00 AM - 12:00 PM',
    'Tomorrow, 2:00 PM - 4:00 PM',
    'This Weekend (Flexible)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    setIsSubmitting(true);
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedOtp(otp);

    const saved = addBooking({
      userId: currentUser?.id || 'guest',
      serviceName,
      serviceId: service?.id || pro?.serviceId,
      proId: pro?.id,
      proName,
      proPhone: pro?.phone,
      proAvatar,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      address: address.trim(),
      neighborhood: proNeighborhood,
      timeSlot: selectedSlot,
      price: baselineRate,
      taskDetails: taskDetails.trim() || `Doorstep assistance for ${serviceName}`,
      status: 'Confirmed',
      otp,
    });

    setBookingId(saved.id);
    setIsSubmitting(false);
    setIsConfirmed(true);
    try {
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
    } catch {
      // fallback
    }
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-navy-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-navy-900 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] text-left"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950/90 via-navy-900 to-navy-950 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
                {service ? (
                  <ServiceIcon name={service.icon || service.id} className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-white">Book {serviceName}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Pay After Service
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {categoryName} • Zero advance payment required
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            {!isConfirmed ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Service & Specialist Summary Card */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={proAvatar}
                      alt={proName}
                      className="w-11 h-11 rounded-xl object-cover border border-cyan-400/50"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{proName}</span>
                        <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          Verified Pro
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>⭐ {proRating} Rating</span>
                        <span>•</span>
                        <span>{proNeighborhood}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Starting Baseline</div>
                    <div className="text-sm sm:text-base font-black text-emerald-400">{baselineRate}</div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name *</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white">
                      <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <input
                        required
                        type="text"
                        placeholder="e.g. Anita Sharma"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">WhatsApp / Phone *</label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <input
                        required
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time Slots */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Select Preferred Time Slot
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition flex items-center gap-2 ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`} />
                          <span className="truncate">{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Service Address */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Service Address</label>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <input
                      required
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter flat/house no, street, locality"
                      className="w-full bg-transparent focus:outline-none text-xs text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Problem Description */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Describe the Issue (Optional)</label>
                  <div className="flex items-start gap-2 px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
                    <textarea
                      rows={2}
                      placeholder="e.g. Switchboard sparking, water leak under kitchen sink, AC gas refill..."
                      value={taskDetails}
                      onChange={(e) => setTaskDetails(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-xs text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Pricing & Trust Notice */}
                <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Inspection & Visiting Charge:</span>
                    <span className="text-emerald-400 font-bold">Waived (₹0)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Estimated Standard Rate:</span>
                    <span className="text-white font-bold">{baselineRate}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between font-bold text-white">
                    <span>Pay Post-Service:</span>
                    <span className="text-cyan-300">UPI / Cash / Card</span>
                  </div>
                </div>

                {/* Safety Guarantee */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Includes 30-Day Neighborhood Service Warranty & Aadhaar verified pro.</span>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-glow-blue transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Confirm & Book Service Slot</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Success Confirmation Card */
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-glow-emerald">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Booking Confirmed • ID: {bookingId}
                  </span>
                  <h4 className="text-xl font-extrabold text-white mt-2">
                    {serviceName} Appointment Reserved!
                  </h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1 leading-relaxed">
                    Thank you, <b className="text-cyan-300">{customerName}</b>! Your appointment has been scheduled for <b className="text-white">{selectedSlot}</b> at {address}.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-md mx-auto text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Assigned Professional:</span>
                    <span className="font-bold text-white">{proName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Confirmation SMS sent to:</span>
                    <span className="font-semibold text-cyan-300">{customerPhone}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Payment:</span>
                    <span className="font-semibold text-emerald-400">Pay {baselineRate} after job completion</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleClose}
                    className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-glow-blue transition"
                  >
                    Done & Return to Website
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
