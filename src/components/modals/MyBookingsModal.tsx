import React, { useState } from 'react';
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
  Star,
  MessageSquare,
  ThumbsUp,
  Tag,
  Check,
  Send,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BookingRecord } from '../../types/auth';
import confetti from 'canvas-confetti';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExploreServices?: () => void;
}

const QUICK_FEEDBACK_TAGS = [
  '⚡ Quick & Punctual',
  '🔧 High Quality Work',
  '💰 Fair & Honest Pricing',
  '🧹 Clean & Tidy Workspace',
  '🤝 Polite & Professional',
  '🛡️ Followed Safety Protocols',
];

const RATING_LABELS: Record<number, string> = {
  1: '1.0 - Poor Experience',
  2: '2.0 - Fair / Needs Improvement',
  3: '3.0 - Good & Satisfactory',
  4: '4.0 - Very Good Service',
  5: '5.0 - Outstanding & Highly Recommended!',
};

export function MyBookingsModal({
  isOpen,
  onClose,
  onOpenExploreServices,
}: MyBookingsModalProps) {
  const { currentUser, getUserBookings, cancelBooking, submitBookingFeedback } = useAuth();
  const bookings = getUserBookings(currentUser?.id);

  // Active Feedback Form State
  const [feedbackBooking, setFeedbackBooking] = useState<BookingRecord | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackSubmittedSuccess, setFeedbackSubmittedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Open feedback editor for a completed booking
  const handleOpenFeedback = (booking: BookingRecord) => {
    setFeedbackBooking(booking);
    setRatingValue(booking.rating || 5);
    setHoverRating(0);
    setFeedbackText(booking.feedback || '');
    setSelectedTags(booking.feedbackTags || ['⚡ Quick & Punctual', '🔧 High Quality Work', '💰 Fair & Honest Pricing']);
    setFeedbackSubmittedSuccess(false);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackBooking) return;

    submitBookingFeedback(
      feedbackBooking.id,
      ratingValue,
      feedbackText.trim(),
      selectedTags
    );

    setFeedbackSubmittedSuccess(true);
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setFeedbackBooking(null);
      setFeedbackSubmittedSuccess(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
                  Track visits, dynamic final settled payments, and leave feedback for local pros
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
              bookings.map((booking) => {
                const isCompleted = booking.status === 'Completed';
                const hasFeedback = Boolean(booking.rating);
                const displayPrice = booking.finalAmount || booking.price;

                return (
                  <div
                    key={booking.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
                      isCompleted
                        ? 'bg-slate-50/50 border-slate-200 hover:border-blue-300'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-card'
                    }`}
                  >
                    {/* Top Bar: ID, Date & Status */}
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

                        {/* Assigned Pro */}
                        {booking.proName && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] text-slate-500">Professional:</span>
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{booking.proName}</span>
                            </span>
                            {booking.proPhone && (
                              <a
                                href={`tel:${booking.proPhone}`}
                                className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{booking.proPhone}</span>
                              </a>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                          <div className="flex items-center gap-1 text-blue-700 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{booking.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate max-w-[220px]">{booking.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment & OTP box */}
                      <div className="text-left sm:text-right shrink-0 bg-white sm:bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <p className="text-[10px] text-slate-500 font-medium">
                          {isCompleted ? 'Final Settled Payment' : 'Estimated Rate'}
                        </p>
                        <p className="text-base font-extrabold text-slate-900">{displayPrice}</p>
                        
                        {!isCompleted ? (
                          <div className="flex items-center gap-1 text-[11px] font-mono text-amber-700 mt-1 font-bold">
                            <Key className="w-3 h-3 text-amber-600" />
                            <span>Start PIN: {booking.otp}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-emerald-700 mt-1 font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Payment Settled</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recorded Work Scope if present */}
                    {booking.workSummary && (
                      <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-xl text-xs space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Work Completed by Technician:
                        </p>
                        <p className="text-slate-800 leading-relaxed font-medium">{booking.workSummary}</p>
                      </div>
                    )}

                    {/* RATING & FEEDBACK SECTION (FOR COMPLETED BOOKINGS) */}
                    {isCompleted && (
                      <div className="pt-2 border-t border-slate-100">
                        {hasFeedback ? (
                          /* ALREADY REVIEWED: DISPLAY RATING & COMMENT */
                          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5 text-amber-500">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-3.5 h-3.5 ${
                                        s <= (booking.rating || 5)
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-slate-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-amber-900">
                                  {booking.rating}.0 / 5.0
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {booking.feedbackGivenAt && (
                                  <span className="text-[10px] text-slate-500">
                                    Reviewed on {booking.feedbackGivenAt}
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleOpenFeedback(booking)}
                                  className="text-[11px] text-blue-600 hover:text-blue-700 font-bold underline"
                                >
                                  Edit Review
                                </button>
                              </div>
                            </div>

                            {booking.feedback && (
                              <p className="text-xs text-slate-800 italic">
                                "{booking.feedback}"
                              </p>
                            )}

                            {booking.feedbackTags && booking.feedbackTags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {booking.feedbackTags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-lg bg-white border border-amber-200 text-[10px] font-semibold text-amber-900 shadow-2xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          /* NOT YET REVIEWED: CALL TO ACTION BUTTON */
                          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900">
                                  How was your service experience?
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  Rate {booking.proName || 'your technician'} to help neighbors find verified pros
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenFeedback(booking)}
                              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-sm transition flex items-center gap-1.5 shrink-0"
                            >
                              <Star className="w-3.5 h-3.5" />
                              <span>Rate & Review</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* FEEDBACK & RATING MODAL / DRAWER */}
        <AnimatePresence>
          {feedbackBooking && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFeedbackBooking(null)}
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl z-70 border border-slate-200 text-left space-y-5"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Rate & Review Service
                      </h3>
                      <p className="text-xs text-slate-500">
                        {feedbackBooking.serviceName} • {feedbackBooking.proName}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFeedbackBooking(null)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Live Success Banner */}
                {feedbackSubmittedSuccess ? (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Thank You for Your Feedback!</h4>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto">
                      Your review and rating have been recorded and updated across the neighborhood directory.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-4">
                    {/* Star Rating Interactive Selector */}
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-2">
                      <p className="text-xs font-bold text-slate-700">Select Overall Star Rating</p>
                      
                      <div className="flex items-center justify-center gap-2 py-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive = (hoverRating || ratingValue) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setRatingValue(star)}
                              className="p-1 transform hover:scale-125 transition duration-150 focus:outline-none"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  isActive
                                    ? 'fill-amber-400 text-amber-500 filter drop-shadow-sm'
                                    : 'text-slate-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>

                      <p className="text-xs font-extrabold text-amber-900">
                        {RATING_LABELS[hoverRating || ratingValue]}
                      </p>
                    </div>

                    {/* Quick Highlights Tags */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        What made this service great? (Select highlights)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_FEEDBACK_TAGS.map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleToggleTag(tag)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              <span>{tag}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detailed Review Text */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Detailed Review & Comments (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="e.g. Arrived right on time, explained the issue clearly, and charged fairly for the repair..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition resize-none"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setFeedbackBooking(null)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-sm transition flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Rating & Review</span>
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
