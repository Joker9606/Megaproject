import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Phone, Radio, ShieldCheck, MapPin, CheckCircle2, Zap, ShieldAlert } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { useAuth } from '../../context/AuthContext';
import { ResidentUser } from '../../types/auth';
import { VerifiedPro } from '../../types';
import confetti from 'canvas-confetti';
import { formatINR } from '../../utils/formatCurrency';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencySOSModal({ isOpen, onClose }: EmergencySOSModalProps) {
  const { pros } = useNetwork();
  const { currentUser, addBooking } = useAuth();
  const resident = currentUser && currentUser.role === 'user' ? (currentUser as ResidentUser) : null;

  const [step, setStep] = useState<'select' | 'broadcasting' | 'matched' | 'no-pro'>('select');
  const [emergencyType, setEmergencyType] = useState('electrical');
  const [address, setAddress] = useState(
    resident?.apartment ? `${resident.apartment}, ${resident.neighborhood}` : 'Indiranagar, Bengaluru'
  );
  const [timer, setTimer] = useState(12);
  const [matchedPro, setMatchedPro] = useState<VerifiedPro | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState('5129');

  const emergencyOptions = [
    { id: 'electrical', name: 'Electrical Spark / Power Failure', icon: '⚡', proType: 'Electrician' },
    { id: 'plumbing', name: 'Burst Pipe / Tap Flooding', icon: '💧', proType: 'Plumber' },
    { id: 'ac-repair', name: 'AC Failure / Gas Leak', icon: '❄️', proType: 'AC Specialist' },
    { id: 'locksmith', name: 'Door Lockout / Broken Latch', icon: '🔑', proType: 'Locksmith' },
    { id: 'caregiver', name: 'Urgent Caregiver Assistance', icon: '❤️', proType: 'Elder Caregiver' },
  ];

  const selectedOption = emergencyOptions.find((o) => o.id === emergencyType) || emergencyOptions[0];

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (step === 'broadcasting') {
      timeoutId = setTimeout(() => {
        // Find real registered emergency pro
        const availableEmergencyPros = pros.filter((p) => p.isEmergencyReady);
        const matched =
          availableEmergencyPros.find(
            (p) =>
              p.serviceId === emergencyType ||
              p.service.toLowerCase().includes(selectedOption.proType.toLowerCase()) ||
              p.service.toLowerCase().includes(emergencyType.toLowerCase())
          ) || availableEmergencyPros[0];

        if (!matched) {
          setStep('no-pro');
        } else {
          setMatchedPro(matched);
          const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
          setGeneratedOtp(otp);

          // Add real emergency booking record
          addBooking({
            userId: currentUser?.id || 'guest',
            serviceName: `EMERGENCY SOS: ${selectedOption.name}`,
            serviceId: matched.serviceId,
            proId: matched.id,
            proName: matched.name,
            proPhone: matched.phone,
            proAvatar: matched.avatar,
            customerName: resident?.name || 'Local Resident',
            customerPhone: resident?.phone || '+91 98450 00000',
            address: address.trim(),
            neighborhood: resident?.neighborhood || matched.neighborhood || 'Indiranagar / 100ft Road',
            timeSlot: 'Immediate Dispatch (< 15 mins)',
            price: matched.hourlyRate || '₹249',
            taskDetails: `Urgent Emergency Callout: ${selectedOption.name}`,
            status: 'Confirmed',
            otp,
          });

          setStep('matched');
          try {
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
          } catch {
            // fallback
          }
        }
      }, 2500);
      return () => clearTimeout(timeoutId);
    }
  }, [step, pros, emergencyType, selectedOption, currentUser, resident, address, addBooking]);

  useEffect(() => {
    if (step === 'matched') {
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 1 ? prev - 1 : 1));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

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
          className="relative w-full max-w-lg bg-navy-900 border-2 border-red-500/40 rounded-3xl shadow-2xl overflow-hidden z-10 text-left"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-red-950/80 via-navy-900 to-navy-950 border-b border-red-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Emergency SOS Dispatch</h3>
                <p className="text-[11px] text-red-300">Fast neighborhood arrival in under 30 minutes</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step 1: Select Type */}
          {step === 'select' && (
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Select Urgent Issue:</label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {emergencyOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setEmergencyType(opt.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                        emergencyType === opt.id
                          ? 'bg-red-500/15 border-red-400 text-white shadow-lg'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{opt.icon}</span>
                        <div>
                          <div className="text-xs font-bold">{opt.name}</div>
                          <div className="text-[10px] text-slate-400">Dispatches: {opt.proType}</div>
                        </div>
                      </div>
                      {emergencyType === opt.id && <Zap className="w-4 h-4 text-red-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Your Location / Address:</label>
                <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-xs text-white"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep('broadcasting')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Radio className="w-4 h-4 animate-ping" />
                <span>Broadcast Emergency SOS Now</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>No surge pricing • Transparent baseline rates</span>
              </div>
            </div>
          )}

          {/* Step 2: Radar Searching */}
          {step === 'broadcasting' && (
            <div className="p-8 text-center space-y-6">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-2 border-amber-500/40 animate-pulse"></div>
                <div className="w-16 h-16 rounded-full bg-red-600/30 border border-red-400 flex items-center justify-center">
                  <Radio className="w-8 h-8 text-red-400 animate-spin" />
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Alerting On-Call Emergency Pros...</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Scanning verified 24/7 responders in {address.split(',')[0]}
                </p>
              </div>

              <div className="text-[11px] text-cyan-300 font-mono bg-navy-950/80 py-2 px-4 rounded-xl inline-block border border-cyan-500/30">
                ⚡ Connecting direct GPS radio channel...
              </div>
            </div>
          )}

          {/* Step 3: No Pro Available Error */}
          {step === 'no-pro' && (
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-glow-amber">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">No Emergency Pro Registered Currently</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1 leading-relaxed">
                  There are no verified on-call technicians registered for this emergency service in your locality right now.
                  Please call the direct helpline or contact local emergency civil services.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 text-left space-y-1">
                <div className="flex items-center justify-between">
                  <span>National Emergency:</span>
                  <b className="text-red-400 font-mono">112</b>
                </div>
                <div className="flex items-center justify-between">
                  <span>Toll-Free Neighborhood Helpdesk:</span>
                  <b className="text-cyan-300 font-mono">1800-120-SMART</b>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close & Return
              </button>
            </div>
          )}

          {/* Step 4: Matched & Dispatched */}
          {step === 'matched' && matchedPro && (
            <div className="p-6 space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">Professional Dispatched!</div>
                  <div className="text-[11px] text-slate-300">Technician is en route with required diagnostic kit.</div>
                </div>
              </div>

              {/* Matched Pro Card */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={matchedPro.avatar}
                      alt={matchedPro.name}
                      className="w-12 h-12 rounded-xl object-cover border border-cyan-400"
                    />
                    <div>
                      <div className="font-bold text-sm text-white">{matchedPro.name}</div>
                      <div className="text-xs text-cyan-300">{matchedPro.service}</div>
                      <div className="text-[10px] text-slate-400">⭐ {matchedPro.rating} • {matchedPro.neighborhood}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Estimated Arrival</div>
                    <div className="text-base font-extrabold text-emerald-400">{timer} Mins</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Baseline Rate: <b className="text-white">{formatINR(matchedPro.hourlyRate)}</b></span>
                  <span className="text-amber-300 font-mono font-bold">Start PIN: {generatedOtp}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${matchedPro.phone || '+919845000000'}`}
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Pro</span>
                </a>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Close & Track
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
