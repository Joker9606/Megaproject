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
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] text-left"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-slate-900">My Booking History</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                    {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Track your active neighborhood services, scheduled visits, and technician OTPs
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bookings List */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            {bookings.length === 0 ? (
              <div className="p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">No Bookings Found Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You have not scheduled any neighborhood service bookings yet. Browse verified local electricians, plumbers, nurses, and technicians to book.
                </p>
                {onOpenExploreServices && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenExploreServices();
                    }}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    Browse Services Directory
                  </button>
                )}
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-card transition-all space-y-3"
                >
                  {/* Top Bar: ID & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600">{booking.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-500">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          booking.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : booking.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {booking.status}
                      </span>

                      {booking.status === 'Confirmed' && (
                        <button
                          type="button"
                          onClick={() => cancelBooking(booking.id)}
                          className="text-[11px] text-red-600 hover:text-red-700 underline font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{booking.serviceName}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{booking.taskDetails}</p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1 text-blue-700 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{booking.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          <span className="truncate max-w-[220px]">{booking.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-medium">Estimated Rate</p>
                      <p className="text-base font-extrabold text-slate-900">{booking.price}</p>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-amber-700 mt-1 font-bold">
                        <Key className="w-3 h-3 text-amber-600" />
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
