import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  Send,
  User,
  Wrench,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BookingRecord, ComplaintIncidentType, ComplaintSeverity, WorkerComplaint } from '../../types/auth';
import confetti from 'canvas-confetti';

interface FileComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: BookingRecord | null;
  preselectedWorker?: {
    id: string;
    name: string;
    service?: string;
    avatar?: string;
    phone?: string;
  } | null;
  onSuccess?: (complaint: WorkerComplaint) => void;
}

const INCIDENT_CATEGORIES: {
  type: ComplaintIncidentType;
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    type: 'misbehavior',
    label: 'Rude & Inappropriate Misbehavior',
    icon: '😠',
    desc: 'Disrespectful demeanor, insolence, or rude tone toward resident/family',
  },
  {
    type: 'verbal_abuse',
    label: 'Verbal Abuse & Threatening Conduct',
    icon: '🗣️',
    desc: 'Aggressive shouting, foul language, or intimidating threats',
  },
  {
    type: 'overcharging',
    label: 'Demanding Extra Cash / Extortion',
    icon: '💸',
    desc: 'Refusing work without unapproved cash, asking for bribes, or overcharging',
  },
  {
    type: 'property_damage',
    label: 'Household Property or Appliance Damage',
    icon: '🔨',
    desc: 'Broke furniture, damaged electrical lines, or caused accidental destruction',
  },
  {
    type: 'unprofessional',
    label: 'Abandoned Job / Unprofessional Walkout',
    icon: '🚫',
    desc: 'Left work messy/incomplete or abruptly walked out during service',
  },
  {
    type: 'intoxicated',
    label: 'Safety Hazard / Intoxicated on Duty',
    icon: '🚨',
    desc: 'Arrived under substance influence, dangerous safety breach, or trespass',
  },
  {
    type: 'other',
    label: 'Other Code of Conduct Infraction',
    icon: '📝',
    desc: 'Other violations against neighborhood community safety and decency',
  },
];

const SEVERITY_LEVELS: {
  level: ComplaintSeverity;
  label: string;
  badge: string;
  color: string;
}[] = [
  {
    level: 'mild',
    label: 'Mild (Unprofessional)',
    badge: 'Notice',
    color: 'border-yellow-300 bg-yellow-50 text-yellow-800',
  },
  {
    level: 'moderate',
    label: 'Moderate (Misbehavior)',
    badge: 'Warning Strike',
    color: 'border-amber-400 bg-amber-50 text-amber-900',
  },
  {
    level: 'severe',
    label: 'Severe (Abuse / Damage)',
    badge: 'Disciplinary Action',
    color: 'border-orange-400 bg-orange-50 text-orange-900',
  },
  {
    level: 'critical',
    label: 'Critical (Safety Threat)',
    badge: 'Immediate Review',
    color: 'border-red-500 bg-red-50 text-red-900',
  },
];

export function FileComplaintModal({
  isOpen,
  onClose,
  booking,
  preselectedWorker,
  onSuccess,
}: FileComplaintModalProps) {
  const { fileComplaint } = useAuth();

  const workerId = booking?.proId || preselectedWorker?.id || 'worker-unknown';
  const workerName = booking?.proName || preselectedWorker?.name || 'Assigned Technician';
  const workerService = booking?.serviceName || preselectedWorker?.service || 'Home Services';
  const workerAvatar =
    booking?.proAvatar ||
    preselectedWorker?.avatar ||
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80';

  const [incidentType, setIncidentType] = useState<ComplaintIncidentType>('misbehavior');
  const [severity, setSeverity] = useState<ComplaintSeverity>('moderate');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [submitting, setSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<WorkerComplaint | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    const complaintTitle =
      title.trim() ||
      `${INCIDENT_CATEGORIES.find((c) => c.type === incidentType)?.label || 'Misbehavior'} by ${workerName}`;

    const created = fileComplaint({
      bookingId: booking?.id,
      workerId,
      workerName,
      workerService,
      workerAvatar,
      incidentType,
      severity,
      title: complaintTitle,
      description: description.trim(),
      incidentDate,
    });

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {}

    setSubmitting(false);
    setSubmittedComplaint(created);

    if (onSuccess) {
      onSuccess(created);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedComplaint(null);
    setTitle('');
    setDescription('');
    setIncidentType('misbehavior');
    setSeverity('moderate');
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
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] text-left"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/5 border-b border-red-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shrink-0">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                    Report Worker Misbehavior
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800 border border-red-300">
                    Formal Complaint
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  The complaint will be officially logged and displayed on the worker&apos;s public profile record.
                </p>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200 transition shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 overflow-y-auto bg-white flex-1">
            {submittedComplaint ? (
              /* Success confirmation view */
              <div className="py-6 px-4 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-red-100 border-2 border-red-300 text-red-600 flex items-center justify-center mx-auto shadow-sm">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-900">
                    Misbehavior Complaint Officially Filed!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Complaint reference <span className="font-mono font-bold text-red-700">{submittedComplaint.id}</span> has been logged to <span className="font-bold text-slate-800">{submittedComplaint.workerName}</span>&apos;s professional profile and forwarded to the Smart Neighborhood Conduct Board.
                  </p>
                </div>

                {/* Complaint Summary Pill */}
                <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 text-left space-y-2 max-w-md mx-auto text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-red-700">Incident Classification</span>
                    <span className="px-2 py-0.5 rounded-md font-bold bg-white border border-red-200 text-red-800 text-[10px]">
                      {submittedComplaint.status}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">{submittedComplaint.title}</p>
                  <p className="text-slate-600 italic text-[11px]">&quot;{submittedComplaint.description}&quot;</p>
                  <div className="pt-2 border-t border-red-200/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Pro ID: {submittedComplaint.workerId}</span>
                    <span>Logged on: {submittedComplaint.createdAt}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 flex items-center gap-2 max-w-md mx-auto text-left">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    This report is now live on the worker&apos;s profile for neighborhood transparency and accountability.
                  </span>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    onClick={handleResetAndClose}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Target Worker Snapshot */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={workerAvatar}
                      alt={workerName}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{workerName}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {workerService}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Worker ID: <span className="font-mono font-medium">{workerId}</span>
                        {booking && (
                          <span className="ml-2 font-sans font-semibold text-blue-600">
                            • Booking: {booking.id}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-600 shadow-2xs">
                    Target Profile
                  </span>
                </div>

                {/* Misbehavior Incident Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2">
                    What type of misbehavior occurred? *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {INCIDENT_CATEGORIES.map((cat) => {
                      const isSelected = incidentType === cat.type;
                      return (
                        <button
                          key={cat.type}
                          type="button"
                          onClick={() => setIncidentType(cat.type)}
                          className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                            isSelected
                              ? 'border-red-500 bg-red-50/80 shadow-xs ring-1 ring-red-400'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-lg leading-none shrink-0 mt-0.5">{cat.icon}</span>
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-bold leading-tight ${
                                isSelected ? 'text-red-950' : 'text-slate-900'
                              }`}
                            >
                              {cat.label}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 leading-normal">
                              {cat.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Severity Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Severity & Impact Level *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SEVERITY_LEVELS.map((s) => {
                      const isSelected = severity === s.level;
                      return (
                        <button
                          key={s.level}
                          type="button"
                          onClick={() => setSeverity(s.level)}
                          className={`p-2.5 rounded-xl border text-center transition ${
                            isSelected
                              ? `${s.color} font-extrabold shadow-xs ring-2 ring-red-400`
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold text-xs'
                          }`}
                        >
                          <p className="text-[11px] leading-tight">{s.label}</p>
                          <span className="inline-block mt-1 text-[9px] uppercase tracking-wider opacity-80">
                            {s.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Complaint Title / Headline */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Complaint Summary / Headline
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Worker shouted loudly at family and demanded extra cash before leaving"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-400 transition"
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Describe the Misbehavior Incident in Detail *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what occurred: What time was it? What was said or done? How did the technician misbehave? Be as specific as possible so this can be reviewed and displayed on their profile..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-400 transition resize-none leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Minimum 10 characters required. Your feedback helps safeguard neighborhood residents.
                  </p>
                </div>

                {/* Incident Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Incident Date
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="date"
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        className="bg-transparent text-xs text-slate-800 focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-800">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      Formal disciplinary record: This complaint will appear under the worker&apos;s public profile.
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || !description.trim()}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Post to Worker Profile</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
