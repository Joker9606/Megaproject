import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Award,
  Navigation,
  Check,
  X,
  CreditCard,
  User,
  Star,
  Zap,
  FileCheck,
  Receipt,
  Calendar,
  Mail,
  Briefcase,
  Save,
  RefreshCw,
  Camera,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { WorkerUser, BookingRecord, WorkerJobRecord } from '../../types/auth';
import { WorkerNavbar } from './WorkerNavbar';
import confetti from 'canvas-confetti';

interface JobLead {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  neighborhood: string;
  serviceRequired: string;
  notes: string;
  offeredPrice: string;
  distance: string;
  isEmergency: boolean;
  timeAgo: string;
  otp: string;
}

export function WorkerDashboard() {
  const {
    currentUser,
    updateWorkerProfile,
    bookings,
    updateBookingStatus,
    addWorkerJob,
    getWorkerJobs,
  } = useAuth();
  const worker = currentUser as WorkerUser;

  const [activeTab, setActiveTab] = useState<'leads' | 'active' | 'earnings' | 'profile'>('leads');
  const [activeJob, setActiveJob] = useState<JobLead | null>(null);

  // Active Job Workflow Step: 1 = En Route, 2 = Arrived & OTP, 3 = In Progress, 4 = Completed
  const [jobStep, setJobStep] = useState<number>(1);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);

  // File Upload Ref for Worker PFP
  const workerFileInputRef = useRef<HTMLInputElement>(null);
  const [workerUploadError, setWorkerUploadError] = useState<string | null>(null);

  // Profile Edit state
  const [editName, setEditName] = useState(worker?.name || '');
  const [editPhone, setEditPhone] = useState(worker?.phone || '');
  const [editBio, setEditBio] = useState(worker?.bio || '');
  const [editExperience, setEditExperience] = useState(worker?.experienceYears || '5+ Years');
  const [editAvatar, setEditAvatar] = useState(worker?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80');
  const [editRate, setEditRate] = useState(worker?.hourlyRate?.replace(/[^0-9]/g, '') || '249');
  const [editEmergency, setEditEmergency] = useState(worker?.emergencyReady ?? true);
  const [profileSaved, setProfileSaved] = useState(false);

  // Handle device image upload for worker
  const handleWorkerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setWorkerUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setWorkerUploadError('Image size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setWorkerUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditAvatar(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Sync state when worker changes
  useEffect(() => {
    if (worker) {
      setEditName(worker.name || '');
      setEditPhone(worker.phone || '');
      setEditBio(worker.bio || '');
      setEditExperience(worker.experienceYears || '5+ Years');
      setEditAvatar(worker.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80');
      setEditRate(worker.hourlyRate?.replace(/[^0-9]/g, '') || '249');
      setEditEmergency(worker.emergencyReady ?? true);
    }
  }, [worker]);

  // Payout State
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Saved Jobs for this worker
  const completedJobs = getWorkerJobs(worker?.id);

  // Compute live total earnings from completed jobs
  const totalEarningsCalculated = completedJobs.reduce((sum, job) => {
    const amt = parseInt(job.earnedAmount.replace(/[^0-9]/g, ''), 10) || 0;
    return sum + amt;
  }, 0);

  // Transform real resident bookings sent strictly to this worker
  const availableLeads: JobLead[] = bookings
    .filter((b) => b.status === 'Confirmed' && b.proId === worker?.id)
    .map((b) => ({
      id: b.id,
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      address: b.address,
      neighborhood: b.neighborhood,
      serviceRequired: b.serviceName,
      notes: b.taskDetails,
      offeredPrice: b.price,
      distance: '0.8 km away',
      isEmergency: b.serviceName.toLowerCase().includes('emergency'),
      timeAgo: 'Just now',
      otp: b.otp,
    }));

  // Accept Lead
  const handleAcceptLead = (lead: JobLead) => {
    setActiveJob(lead);
    setJobStep(1);
    setActiveTab('active');
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeJob && enteredOtp === activeJob.otp) {
      setOtpError(false);
      setJobStep(3); // Start job
    } else {
      setOtpError(true);
    }
  };

  // Finish Job
  const handleCompleteJob = () => {
    if (!activeJob || !worker) return;

    // Save job entry permanently to worker's profile
    const invoiceNum = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newJobRecord: WorkerJobRecord = {
      id: `job-${Date.now()}`,
      workerId: worker.id,
      customerName: activeJob.customerName,
      customerPhone: activeJob.customerPhone,
      address: activeJob.address,
      neighborhood: activeJob.neighborhood,
      serviceTitle: activeJob.serviceRequired,
      notes: activeJob.notes,
      earnedAmount: activeJob.offeredPrice,
      completedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      paymentMethod: 'UPI',
      invoiceNumber: invoiceNum,
      status: 'Completed',
    };

    addWorkerJob(newJobRecord);
    // Update booking status in resident history to Completed
    updateBookingStatus(activeJob.id, 'Completed');
    setJobStep(4);
    try {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  // Dismiss completed job
  const handleDismissCompletedJob = () => {
    setActiveJob(null);
    setJobStep(1);
    setActiveTab('earnings');
  };

  // Save profile updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkerProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      bio: editBio.trim(),
      experienceYears: editExperience.trim(),
      avatar: editAvatar,
      hourlyRate: `₹${editRate}`,
      emergencyReady: editEmergency,
    });
    setProfileSaved(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Payout simulation
  const handleRequestPayout = () => {
    if (totalEarningsCalculated <= 0) return;
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 3500);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Worker Operations Navigation */}
      <WorkerNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingLeadsCount={availableLeads.length}
      />

      {/* Main Workspace Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* Top Summary Banner */}
        <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-amber-950/50 via-navy-900 to-navy-950 border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={worker?.avatar}
                alt={worker?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-glow-amber"
              />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">{worker?.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                    Verified Professional
                  </span>
                </div>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">
                  {worker?.serviceName} • {worker?.neighborhood}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Radar active: Scanning neighborhood for incoming customer bookings
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              <div className="p-3 rounded-2xl bg-navy-950/80 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Live Leads</p>
                <p className="text-lg font-black text-amber-400">{availableLeads.length}</p>
              </div>
              <div className="p-3 rounded-2xl bg-navy-950/80 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Revenue</p>
                <p className="text-lg font-black text-emerald-400">₹{totalEarningsCalculated}</p>
              </div>
              <div className="p-3 rounded-2xl bg-navy-950/80 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Jobs Completed</p>
                <p className="text-lg font-black text-cyan-400">{completedJobs.length}</p>
              </div>
              <div className="p-3 rounded-2xl bg-navy-950/80 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Base Rate</p>
                <p className="text-lg font-black text-slate-200">{worker?.hourlyRate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: INCOMING LEADS & JOB RADAR */}
        {activeTab === 'leads' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>Incoming Neighborhood Leads</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time job requests and bookings broadcasted by residents in your area.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Radar Live</span>
              </span>
            </div>

            {availableLeads.length === 0 ? (
              <div className="py-14 px-6 rounded-3xl bg-navy-900/60 border border-slate-800 text-center space-y-4 max-w-lg mx-auto shadow-xl">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-20"></span>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Radar Scanning for Direct Bookings</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    No active bookings assigned to your Pro ID (<b className="text-amber-300">{worker?.id}</b>) yet.
                    When a neighbor in <b className="text-white">{worker?.neighborhood}</b> books <b className="text-white">{worker?.serviceName}</b>, it will appear here in real-time.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Available & Ready for Doorstep Dispatch</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 rounded-2xl bg-navy-900/90 border border-slate-700/80 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg"
                  >
                    <div>
                      {/* Header tag */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        {lead.isEmergency ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-extrabold flex items-center gap-1">
                            <Flame className="w-3 h-3 text-red-400" />
                            <span>EMERGENCY SOS</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                            Direct Booking
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">{lead.timeAgo}</span>
                      </div>

                      {/* Service Title */}
                      <h3 className="text-base font-bold text-white leading-snug">{lead.serviceRequired}</h3>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">{lead.notes}</p>

                      {/* Customer & Location */}
                      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="font-semibold text-white">{lead.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{lead.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">Service Price</p>
                        <p className="text-base font-black text-amber-400">{lead.offeredPrice}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAcceptLead(lead)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-glow-amber transition transform hover:scale-105 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Job</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE ASSIGNED JOB TRACKER */}
        {activeTab === 'active' && (
          <div className="max-w-3xl mx-auto text-left">
            {!activeJob ? (
              <div className="p-12 rounded-3xl bg-navy-900/60 border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No Job Currently in Progress</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Accept an incoming lead from the Job Leads tab to initiate doorstep dispatch and tracking.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('leads')}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  View Available Leads
                </button>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase tracking-wide">
                      Active Dispatch #{activeJob.id}
                    </span>
                    <h2 className="text-xl font-extrabold text-white mt-1.5">{activeJob.serviceRequired}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Total Payout</p>
                    <p className="text-xl font-black text-amber-400">{activeJob.offeredPrice}</p>
                  </div>
                </div>

                {/* Stepper Progress */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className={`p-2.5 rounded-xl border ${jobStep >= 1 ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    1. En Route
                  </div>
                  <div className={`p-2.5 rounded-xl border ${jobStep >= 2 ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    2. Arrived & OTP
                  </div>
                  <div className={`p-2.5 rounded-xl border ${jobStep >= 3 ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    3. Working
                  </div>
                  <div className={`p-2.5 rounded-xl border ${jobStep >= 4 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    4. Completed
                  </div>
                </div>

                {/* Customer Details Box */}
                <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Customer Name</p>
                      <p className="text-sm font-bold text-white">{activeJob.customerName}</p>
                    </div>
                    <a
                      href={`tel:${activeJob.customerPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Customer</span>
                    </a>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Destination Address</p>
                    <p className="text-xs font-semibold text-slate-200">{activeJob.address}</p>
                    <p className="text-[11px] text-slate-400">{activeJob.neighborhood}</p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Customer Notes</p>
                    <p className="text-xs text-slate-300 italic">"{activeJob.notes}"</p>
                  </div>
                </div>

                {/* STEP 1: EN ROUTE ACTION */}
                {jobStep === 1 && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-300">
                      You are en route to customer doorstep. Click below when you arrive.
                    </p>
                    <button
                      type="button"
                      onClick={() => setJobStep(2)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-sm shadow-glow-amber transition transform hover:scale-[1.01]"
                    >
                      I Have Arrived at Doorstep
                    </button>
                  </div>
                )}

                {/* STEP 2: ARRIVED & VERIFY OTP */}
                {jobStep === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <p className="text-xs text-slate-300">
                      Ask customer for their 4-digit service start PIN to begin the job:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="Enter 4-digit PIN"
                        required
                        className="flex-1 px-4 py-2.5 bg-navy-900 border border-slate-700 rounded-xl text-center text-lg font-mono tracking-widest text-white outline-none focus:border-amber-400"
                      />
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-glow-amber"
                      >
                        Verify & Start
                      </button>
                    </div>
                    {otpError && (
                      <p className="text-xs text-red-400">Incorrect PIN. Please re-enter the OTP provided by the resident.</p>
                    )}
                  </form>
                )}

                {/* STEP 3: WORK IN PROGRESS */}
                {jobStep === 3 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Clock className="w-4 h-4 animate-spin" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-300">Work in Progress</p>
                        <p className="text-[11px] text-slate-400">Complete the task and inspect all connections</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCompleteJob}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-sm shadow-glow-emerald transition transform hover:scale-[1.01]"
                    >
                      Job Completed - Collect {activeJob.offeredPrice}
                    </button>
                  </div>
                )}

                {/* STEP 4: JOB COMPLETE */}
                {jobStep === 4 && (
                  <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-extrabold text-white">Job Saved & Recorded!</h3>
                    <p className="text-xs text-slate-300">
                      Payment of <span className="font-bold text-emerald-400">{activeJob.offeredPrice}</span> has been permanently saved to your Pro profile.
                    </p>

                    <button
                      type="button"
                      onClick={handleDismissCompletedJob}
                      className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                    >
                      View in Earnings & Invoices
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EARNINGS & SAVED JOB HISTORY */}
        {activeTab === 'earnings' && (
          <div className="max-w-4xl mx-auto space-y-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/60 to-navy-900 border border-amber-500/40">
                <p className="text-xs text-slate-400 font-semibold">Total Revenue Earned</p>
                <h3 className="text-3xl font-black text-amber-400 mt-1">₹{totalEarningsCalculated}</h3>
                <button
                  type="button"
                  onClick={handleRequestPayout}
                  disabled={totalEarningsCalculated === 0}
                  className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-glow-amber transition disabled:opacity-40"
                >
                  Instant UPI Payout
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-navy-900/80 border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold">Saved Job Entries</p>
                <h3 className="text-3xl font-black text-white mt-1">{completedJobs.length}</h3>
                <p className="text-[11px] text-emerald-400 font-semibold mt-2">Saved in your Pro Profile</p>
              </div>

              <div className="p-5 rounded-3xl bg-navy-900/80 border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold">Platform Fee</p>
                <h3 className="text-3xl font-black text-emerald-400 mt-1">0% Comm.</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-2">100% earnings go directly to you</p>
              </div>
            </div>

            {payoutSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Payout initiated! ₹{totalEarningsCalculated} dispatched to your registered UPI ID.</span>
              </div>
            )}

            {/* Real Saved Completed Jobs Table */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Completed Job History & Invoices</h3>
                  <p className="text-xs text-slate-400">Permanently saved under your Worker ID: {worker?.id}</p>
                </div>
                <span className="text-xs font-bold text-cyan-400">{completedJobs.length} Entries</span>
              </div>

              {completedJobs.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
                  <Receipt className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">No Completed Jobs Recorded Yet</p>
                  <p className="text-[11px] text-slate-400">
                    Accept leads from your job radar and complete tasks to record your official earnings history.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                        <th className="pb-3">Invoice #</th>
                        <th className="pb-3">Task Details</th>
                        <th className="pb-3">Customer & Address</th>
                        <th className="pb-3">Completed On</th>
                        <th className="pb-3 text-right">Amount Earned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {completedJobs.map((job) => (
                        <tr key={job.id}>
                          <td className="py-3 font-mono font-bold text-cyan-300">{job.invoiceNumber}</td>
                          <td className="py-3 font-semibold text-white">{job.serviceTitle}</td>
                          <td className="py-3 text-slate-300">
                            <p className="font-semibold">{job.customerName}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{job.address}</p>
                          </td>
                          <td className="py-3 text-slate-400">{job.completedAt}</td>
                          <td className="py-3 text-right font-black text-amber-400">{job.earnedAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MY PROFILE & SERVICE RATES */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto text-left">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  {/* Worker Avatar with device upload trigger */}
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => workerFileInputRef.current?.click()}
                    title="Click to upload profile photo from device"
                  >
                    <img
                      src={editAvatar}
                      alt={editName}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-glow-amber group-hover:opacity-85 transition"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition text-white p-1">
                      <Camera className="w-5 h-5 text-amber-300 mb-0.5" />
                      <span className="text-[9px] font-bold text-amber-200 text-center leading-tight">Upload PFP</span>
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-navy-950" />
                  </div>

                  {/* Hidden File Input for Device Photo */}
                  <input
                    type="file"
                    ref={workerFileInputRef}
                    accept="image/*"
                    onChange={handleWorkerImageUpload}
                    className="hidden"
                  />

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-white">{editName || worker?.name}</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Pro ID: {worker?.id}
                      </span>
                    </div>
                    <p className="text-xs text-amber-400 font-semibold mt-0.5">{worker?.serviceName} • {worker?.neighborhood}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Joined {worker?.joinedDate || 'Recently'}</p>

                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => workerFileInputRef.current?.click()}
                        className="px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-glow-amber transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo from Device</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error banner if file upload invalid */}
              <AnimatePresence>
                {workerUploadError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{workerUploadError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {profileSaved && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Pro profile and service rates have been successfully saved!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Legal Name *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white">
                      <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Registered Phone / WhatsApp *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <input
                        type="tel"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Base Hourly / Starting Rate (₹) *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <input
                        type="text"
                        required
                        value={editRate}
                        onChange={(e) => setEditRate(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-white font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Experience in Field
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white">
                      <Briefcase className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <input
                        type="text"
                        value={editExperience}
                        onChange={(e) => setEditExperience(e.target.value)}
                        placeholder="e.g. 5+ Years"
                        className="w-full bg-transparent focus:outline-none text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Specialty Service Listed
                    </label>
                    <input
                      type="text"
                      disabled
                      value={worker?.serviceName || 'Certified Specialist'}
                      className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-800 rounded-xl text-slate-400 text-xs cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Primary Neighborhood Coverage
                    </label>
                    <input
                      type="text"
                      disabled
                      value={worker?.neighborhood || 'Indiranagar / 100ft Road'}
                      className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-800 rounded-xl text-slate-400 text-xs cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Professional Bio & Credentials Description
                  </label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Briefly describe your expertise, certifications, and trade background..."
                    className="w-full px-3.5 py-2.5 bg-navy-900 border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span>24/7 Emergency SOS Callouts Ready</span>
                    </p>
                    <p className="text-[11px] text-slate-400">Receive priority high-rate urgent bookings in your neighborhood</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editEmergency}
                    onChange={(e) => setEditEmergency(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-700 bg-navy-900 text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Trust & Safety Status */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Professional Verification Charter</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-850 border border-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Trade Identity Verified</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-850 border border-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Police Background Clearance</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-glow-amber transition transform hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Pro Settings & Profile</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
