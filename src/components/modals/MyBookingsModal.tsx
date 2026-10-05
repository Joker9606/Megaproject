import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  User,
  Phone,
  Sparkles,
  AlertCircle,
  FileText,
  Key,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BookingRecord } from '../../types/auth';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExploreServices?: () => void;
}

export function MyBookingsModal({
  isOpen,
  onClose,
  onOpenExploreServices,
}: MyBookingsModalProps) {
  const { currentUser, getUserBookings, cancelBooking } = useAuth();
  const bookings = getUserBookings(currentUser?.id);

  if (!isOpen) return null;

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

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-navy-900 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] text-left"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950/90 via-navy-900 to-navy-950 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-white">My Booking History</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Track your active neighborhood services, scheduled visits, and technician OTPs
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bookings List */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            {bookings.length === 0 ? (
              <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">No Bookings Found Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You have not scheduled any neighborhood service bookings yet. Browse verified local electricians, plumbers, nurses, and technicians to book.
                </p>
                {onOpenExploreServices && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenExploreServices();
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-glow-blue"
                  >
                    Browse Services Directory
                  </button>
                )}
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/40 transition-all space-y-3"
                >
                  {/* Top Bar: ID & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-300">{booking.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          booking.status === 'Confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : booking.status === 'Completed'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : 'bg-red-500/20 text-red-300 border-red-500/40'
                        }`}
                      >
                        {booking.status}
                      </span>

                      {booking.status === 'Confirmed' && (
                        <button
                          type="button"
                          onClick={() => cancelBooking(booking.id)}
                          className="text-[11px] text-red-400 hover:text-red-300 underline"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white">{booking.serviceName}</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{booking.taskDetails}</p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
                        <div className="flex items-center gap-1 text-cyan-300">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{booking.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span className="truncate max-w-[220px]">{booking.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0 bg-navy-950/80 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-400">Estimated Rate</p>
                      <p className="text-base font-extrabold text-cyan-300">{booking.price}</p>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300 mt-1 font-bold">
                        <Key className="w-3 h-3" />
                        <span>OTP: {booking.otp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
