import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Key,
  Star,
  Tag,
  Check,
  Send,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Wrench,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BookingRecord } from '../../types/auth';
import confetti from 'canvas-confetti';

interface MyBookingsPageProps {
  onBack: () => void;
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

export function MyBookingsPage({ onBack, onOpenExploreServices }: MyBookingsPageProps) {
  const { currentUser, getUserBookings, cancelBooking, submitBookingFeedback } = useAuth();
  const bookings = getUserBookings(currentUser?.id);

  const [activeFilter, setActiveFilter] = useState<'all' | 'Confirmed' | 'Completed' | 'Cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Inline review editor states (keyed by booking ID)
  const [expandedReviewBookingId, setExpandedReviewBookingId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = activeFilter === 'all' || b.status === activeFilter;
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.proName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenInlineReview = (booking: BookingRecord) => {
    setExpandedReviewBookingId(booking.id);
    setRatingValue(booking.rating || 5);
    setHoverRating(0);
    setFeedbackText(booking.feedback || '');
    setSelectedTags(
      booking.feedbackTags || ['⚡ Quick & Punctual', '🔧 High Quality Work', '💰 Fair & Honest Pricing']
    );
    setSubmittedBookingId(null);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitFeedback = (bookingId: string, e: React.FormEvent) => {
    e.preventDefault();
    submitBookingFeedback(bookingId, ratingValue, feedbackText.trim(), selectedTags);
    setSubmittedBookingId(bookingId);

    try {
      confetti({ particleCount: 70, spread: 75, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setExpandedReviewBookingId(null);
      setSubmittedBookingId(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 text-left">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Back to Home</span>
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-slate-700 cursor-pointer" onClick={onBack}>
              Home
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">My Bookings & Feedback</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{bookings.length} Total Bookings</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header Title Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Booking History</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Live Status
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Track visiting technicians, secret OTPs, settled work invoices, and rate completed services.
            </p>
          </div>

          {onOpenExploreServices && (
            <button
              onClick={onOpenExploreServices}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book New Service</span>
            </button>
          )}
        </div>

        {/* Search & Filter Tabs */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Bookings' },
              { id: 'Confirmed', label: 'Active & Confirmed' },
              { id: 'Completed', label: 'Completed Services' },
              { id: 'Cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, pro or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-100">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No Bookings Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  {searchQuery
                    ? `No bookings matched your search "${searchQuery}".`
                    : 'You currently have no service appointments under this filter.'}
                </p>
              </div>

              {onOpenExploreServices && (
                <button
                  type="button"
                  onClick={onOpenExploreServices}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
                >
                  Browse Available Neighborhood Services
                </button>
              )}
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const isCompleted = booking.status === 'Completed';
              const hasFeedback = Boolean(booking.rating);
              const isReviewingInline = expandedReviewBookingId === booking.id;

              return (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-4 text-left"
                >
                  {/* Top Bar: Booking ID, Date & Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        #{booking.id}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">
                        Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${
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
                          className="text-xs text-red-600 hover:text-red-700 font-semibold underline ml-1"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Service Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Left & Middle: Service info & Assigned Technician */}
                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{booking.serviceName}</h3>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{booking.taskDetails}</p>
                      </div>

                      {/* Pro Details Box */}
                      {booking.proName && (
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={
                                booking.proAvatar ||
                                'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop&q=80'
                              }
                              alt={booking.proName}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">{booking.proName}</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Verified
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">Assigned Neighborhood Technician</p>
                            </div>
                          </div>

                          {booking.proPhone && (
                            <a
                              href={`tel:${booking.proPhone}`}
                              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1 transition"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Call</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Location & Time slot chips */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{booking.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate max-w-xs">{booking.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Payment & Doorstep PIN Box */}
                    <div className="md:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-left md:text-right">
                      {isCompleted ? (
                        <div>
                          <p className="text-[11px] text-slate-500 font-semibold">Final Settled Payment</p>
                          <p className="text-xl font-black text-emerald-600">
                            {booking.finalAmount || booking.price}
                          </p>
                          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Paid After Work Satisfaction</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[11px] text-slate-500 font-semibold">Payment Status</p>
                          <p className="text-sm font-bold text-slate-900">Custom Quote on Visit</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Pay after service completion (₹0 advance)</p>
                          
                          <div className="mt-2.5 pt-2 border-t border-slate-200">
                            <div className="flex items-center md:justify-end gap-1 text-xs font-mono font-bold text-amber-800">
                              <Key className="w-3.5 h-3.5 text-amber-600" />
                              <span>Doorstep Start PIN:</span>
                            </div>
                            <div className="text-xl font-mono font-black text-amber-900 tracking-widest mt-0.5">
                              {booking.otp}
                            </div>
                            <p className="text-[10px] text-slate-400">Share with pro upon arrival</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary of Work Done (recorded by worker upon completion) */}
                  {booking.workSummary && (
                    <div className="p-3.5 bg-blue-50/50 border border-blue-200/80 rounded-2xl text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-blue-950 uppercase tracking-wide text-[10px]">
                        <Wrench className="w-3.5 h-3.5 text-blue-600" />
                        <span>Work Completed Summary from Technician:</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">{booking.workSummary}</p>
                    </div>
                  )}

                  {/* RATING & FEEDBACK SECTION (FOR COMPLETED SERVICES) */}
                  {isCompleted && (
                    <div className="pt-3 border-t border-slate-100">
                      {/* 1. If currently editing / reviewing inline */}
                      {isReviewingInline ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                              <h4 className="text-sm font-extrabold text-slate-900">
                                Leave Feedback for {booking.proName}
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => setExpandedReviewBookingId(null)}
                              className="text-xs text-slate-500 hover:text-slate-900 font-bold"
                            >
                              Cancel
                            </button>
                          </div>

                          {submittedBookingId === booking.id ? (
                            <div className="p-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                              <span>Feedback & Rating saved successfully!</span>
                            </div>
                          ) : (
                            <form
                              onSubmit={(e) => handleSubmitFeedback(booking.id, e)}
                              className="space-y-3.5"
                            >
                              {/* Star Rating Interactive Selector */}
                              <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs font-bold text-slate-800">Your Rating Score</p>
                                  <p className="text-xs font-semibold text-amber-800">
                                    {RATING_LABELS[hoverRating || ratingValue]}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {[1, 2, 3, 4, 5].map((s) => {
                                    const isActive = (hoverRating || ratingValue) >= s;
                                    return (
                                      <button
                                        key={s}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(s)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRatingValue(s)}
                                        className="p-1 focus:outline-none transform hover:scale-125 transition"
                                      >
                                        <Star
                                          className={`w-7 h-7 ${
                                            isActive
                                              ? 'fill-amber-400 text-amber-500'
                                              : 'text-slate-300'
                                          }`}
                                        />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Quick Tags Toggle */}
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                  Select highlights of your service experience:
                                </label>
                                <div className="flex flex-wrap gap-1.5">
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
                                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                        }`}
                                      >
                                        {isSelected && <Check className="w-3 h-3" />}
                                        <span>{tag}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Comment Text Area */}
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Comments / Review Details (Optional)
                                </label>
                                <textarea
                                  rows={2}
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                  placeholder="Share how the technician did (promptness, pricing, cleanliness)..."
                                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                />
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="submit"
                                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-sm transition flex items-center gap-1.5"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Submit Rating & Review</span>
                                </button>
                              </div>
                            </form>
                          )}
                        </motion.div>
                      ) : hasFeedback ? (
                        /* 2. Already reviewed display */
                        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5 text-amber-500">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-4 h-4 ${
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
                                <span className="text-[11px] text-slate-500">
                                  Reviewed on {booking.feedbackGivenAt}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleOpenInlineReview(booking)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-bold underline ml-2"
                              >
                                Edit Review
                              </button>
                            </div>
                          </div>

                          {booking.feedback && (
                            <p className="text-xs text-slate-800 italic leading-relaxed">
                              "{booking.feedback}"
                            </p>
                          )}

                          {booking.feedbackTags && booking.feedbackTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {booking.feedbackTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200 text-[10px] font-semibold text-amber-900 shadow-2xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* 3. Not yet reviewed call to action */
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-blue-50 to-amber-50/40 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">
                                How was your service experience with {booking.proName}?
                              </p>
                              <p className="text-[11px] text-slate-500">
                                Help your neighbors by giving a star rating and quick review
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenInlineReview(booking)}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-sm transition flex items-center gap-1.5 shrink-0"
                          >
                            <Star className="w-3.5 h-3.5" />
                            <span>Rate & Review Service</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
