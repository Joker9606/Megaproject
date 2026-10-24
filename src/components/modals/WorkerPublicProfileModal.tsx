import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Briefcase,
  Phone,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  Flame,
  CheckCircle2,
  MessageSquare,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { VerifiedPro } from '../../types';
import { WorkerComplaint } from '../../types/auth';

interface WorkerPublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  pro: VerifiedPro | null;
  onBookPro?: (pro: VerifiedPro) => void;
  onReportMisbehavior?: (pro: VerifiedPro) => void;
}

export function WorkerPublicProfileModal({
  isOpen,
  onClose,
  pro,
  onBookPro,
  onReportMisbehavior,
}: WorkerPublicProfileModalProps) {
  const { getWorkerComplaints } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints'>('overview');

  if (!isOpen || !pro) return null;

  // Retrieve complaints filed against this specific worker
  const workerComplaints: WorkerComplaint[] = getWorkerComplaints(pro.id).filter(
    (c) => c.workerId === pro.id || c.workerName.toLowerCase() === pro.name.toLowerCase()
  );

  const hasComplaints = workerComplaints.length > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] text-left"
        >
          {/* Header Hero Banner */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                <img
                  src={pro.avatar}
                  alt={pro.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
                {pro.isAvailableNow && (
                  <span
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900"
                    title="Active Now"
                  />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-black text-white">{pro.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                    {pro.service}
                  </span>
                  {hasComplaints ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500 text-white flex items-center gap-1 shadow-xs">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{workerComplaints.length} Misbehavior Report(s)</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Clean Conduct</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{pro.rating}</span>
                    <span className="text-slate-400 font-normal">({pro.reviewsCount} reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" /> {pro.neighborhood}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">Joined {pro.joinedYear || '2026'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Professional Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('complaints')}
              className={`pb-3 font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'complaints'
                  ? 'border-red-600 text-red-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Conduct & Complaints</span>
              {hasComplaints && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                  {workerComplaints.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 space-y-5 overflow-y-auto bg-white flex-1">
            {activeTab === 'overview' && (
              <>
                {/* Notice if worker has misbehavior reports */}
                {hasComplaints && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-red-900">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>Public Notice: Conduct Complaints Filed on Record</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('complaints')}
                        className="text-[11px] font-bold text-red-700 underline hover:text-red-900"
                      >
                        Inspect Complaints ({workerComplaints.length})
                      </button>
                    </div>
                    <p className="text-[11px] text-red-700 leading-relaxed">
                      Residents have reported misbehavior incidents regarding this technician. Review the Conduct & Complaints tab for transparent details before booking.
                    </p>
                  </div>
                )}

                {/* Bio */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    About Professional
                  </h4>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed">
                    {pro.bio || `${pro.name} is a verified neighborhood technician specializing in ${pro.service}.`}
                  </p>
                </div>

                {/* Key Verification Badges */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Security Credentials & Verification
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">Aadhaar & Govt ID Verified</p>
                        <p className="text-[10px] text-slate-500">Government identity verified</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">Police Background Checked</p>
                        <p className="text-[10px] text-slate-500">Local station record verified</p>
                      </div>
                    </div>

                    {pro.isEmergencyReady && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2.5">
                        <Flame className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <p className="font-bold text-amber-900">24/7 Emergency SOS Responder</p>
                          <p className="text-[10px] text-amber-700">Rapid doorstep dispatch ready</p>
                        </div>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-bold text-blue-900">30-Day Service Guarantee</p>
                        <p className="text-[10px] text-blue-700">Free revisit on quality issues</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB: COMPLAINTS & CONDUCT RECORD */}
            {activeTab === 'complaints' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span>Resident Misbehavior Reports & Conduct Log</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Official transparent record of customer complaints registered for this worker
                    </p>
                  </div>

                  {onReportMisbehavior && (
                    <button
                      onClick={() => onReportMisbehavior(pro)}
                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span>Report Misbehavior</span>
                    </button>
                  )}
                </div>

                {workerComplaints.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-200 text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-sm font-bold text-emerald-950">Clean Conduct Record</p>
                    <p className="text-xs text-emerald-700 max-w-md mx-auto">
                      Zero misbehavior complaints have been filed against {pro.name}. This worker upholds community safety standards and professional neighborhood etiquette.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workerComplaints.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-2xl bg-red-50/50 border border-red-200 text-xs space-y-2.5 transition hover:bg-red-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-slate-900">{c.title}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  c.severity === 'critical'
                                    ? 'bg-red-600 text-white'
                                    : c.severity === 'severe'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                                }`}
                              >
                                {c.severity.toUpperCase()} SEVERITY
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Incident: <span className="font-semibold text-red-700 capitalize">{c.incidentType.replace('_', ' ')}</span>
                            </p>
                          </div>

                          <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-red-100 text-red-800 border border-red-200 shrink-0">
                            {c.status}
                          </span>
                        </div>

                        <p className="text-slate-800 leading-relaxed italic bg-white p-3 rounded-xl border border-red-100">
                          &quot;{c.description}&quot;
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-red-100">
                          <span>Complainant: {c.userName}</span>
                          <span>Reported on: {c.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            {onReportMisbehavior && (
              <button
                onClick={() => onReportMisbehavior(pro)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-red-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Report Worker</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition shadow-2xs"
              >
                Close
              </button>

              {onBookPro && (
                <button
                  onClick={() => {
                    onClose();
                    onBookPro(pro);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book This Pro</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
