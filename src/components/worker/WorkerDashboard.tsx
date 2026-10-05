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
    completeBookingWithPayment,
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

  // Dynamic Pricing & Final Settlement State (Worker sets price according to work done)
  const [customFinalPrice, setCustomFinalPrice] = useState<string>('249');
  const [workDoneNotes, setWorkDoneNotes] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Cash'>('UPI');
  const [finalSettledAmount, setFinalSettledAmount] = useState<string>('₹249');

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

  // Reviews & ratings submitted by customers for this worker
  const workerReviews = bookings.filter((b) => b.proId === worker?.id && b.rating);
  const liveRating = worker?.rating || 5.0;
  const liveReviewsCount = worker?.reviewsCount || workerReviews.length || 0;

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
    setCustomFinalPrice(lead.offeredPrice.replace(/[^0-9]/g, '') || '249');
    setWorkDoneNotes(lead.notes || lead.serviceRequired);
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

  // Finish Job with Custom Price & Scope Updated on Website
  const handleCompleteJob = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeJob || !worker) return;

    const amountClean = customFinalPrice.replace(/[^0-9]/g, '') || '249';
    const finalAmountStr = `₹${amountClean}`;
    setFinalSettledAmount(finalAmountStr);

    // Save job entry permanently to worker's profile
    const invoiceNum = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newJobRecord: WorkerJobRecord = {
      id: `job-${Date.now()}`,
      workerId: worker.id,
      bookingId: activeJob.id,
      customerName: activeJob.customerName,
      customerPhone: activeJob.customerPhone,
      address: activeJob.address,
      neighborhood: activeJob.neighborhood,
      serviceTitle: activeJob.serviceRequired,
      notes: workDoneNotes.trim() || activeJob.notes,
      earnedAmount: finalAmountStr,
      completedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      paymentMethod: paymentMode,
      invoiceNumber: invoiceNum,
      status: 'Completed',
    };

    addWorkerJob(newJobRecord);
    // Update booking status in resident history to Completed with dynamic final price & work summary
    completeBookingWithPayment(
      activeJob.id,
      finalAmountStr,
      workDoneNotes.trim() || activeJob.serviceRequired,
      paymentMode
    );

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Worker Operations Navigation */}
      <WorkerNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingLeadsCount={availableLeads.length}
      />

      {/* Main Workspace Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* Top Summary Banner */}
        <div className="mb-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={worker?.avatar}
                alt={worker?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-sm"
              />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{worker?.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold">
                    Verified Professional
                  </span>
                </div>
                <p className="text-xs text-amber-700 font-semibold mt-0.5">
                  {worker?.serviceName} • {worker?.neighborhood}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Radar active: Scanning neighborhood for incoming customer bookings
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Live Leads</p>
                <p className="text-lg font-black text-amber-600">{availableLeads.length}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Revenue</p>
                <p className="text-lg font-black text-emerald-600">₹{totalEarningsCalculated}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Jobs Done</p>
                <p className="text-lg font-black text-blue-600">{completedJobs.length}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Pro Rating</p>
                <p className="text-lg font-black text-amber-600 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{liveRating}</span>
                  <span className="text-xs text-slate-400 font-normal">({liveReviewsCount})</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: INCOMING LEADS & JOB RADAR */}
        {activeTab === 'leads' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>Incoming Neighborhood Leads</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time job requests and bookings broadcasted by residents in your area.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Radar Live</span>
              </span>
            </div>

            {availableLeads.length === 0 ? (
              <div className="py-14 px-6 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Radar Scanning for Direct Bookings</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    No active bookings assigned to your Pro ID (<b className="text-amber-800">{worker?.id}</b>) yet.
                    When a neighbor in <b className="text-slate-800">{worker?.neighborhood}</b> books <b className="text-slate-800">{worker?.serviceName}</b>, it will appear here in real-time.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
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
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-card transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Header tag */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        {lead.isEmergency ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 text-[10px] font-extrabold flex items-center gap-1">
                            <Flame className="w-3 h-3 text-red-600" />
                            <span>EMERGENCY SOS</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                            Direct Booking
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">{lead.timeAgo}</span>
                      </div>

                      {/* Service Title */}
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{lead.serviceRequired}</h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{lead.notes}</p>

                      {/* Customer & Location */}
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-semibold text-slate-900">{lead.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{lead.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] text-slate-500 font-semibold">Service Price</p>
                        <p className="text-base font-black text-amber-600">{lead.offeredPrice}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAcceptLead(lead)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-sm transition flex items-center gap-1.5"
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
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Job Currently in Progress</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
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
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-sm">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-extrabold uppercase tracking-wide">
                      Active Dispatch #{activeJob.id}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">{activeJob.serviceRequired}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Total Payout</p>
                    <p className="text-xl font-black text-amber-600">{activeJob.offeredPrice}</p>
                  </div>
                </div>

                {/* Stepper Progress */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className={`p-2.5 rounded-xl border ${jobStep >= 1 ? 'bg-amber-100 border-amber-300 text-amber-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    1. En Route
                  </div>
                  <div className={`p-2.5 rounded-xl border ${jobStep >= 2 ? 'bg-amber-100 border-amber-300 text-amber-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    2. Arrived & OTP
                  </div>
                  <div className={`p-2.5 rounded-xl border ${jobStep >= 3 ? 'bg-amber-100 border-amber-300 text-amber-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    3. Working
                  </div>
                  <div className={`p-2.5 rounded-xl border ${jobStep >= 4 ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    4. Completed
                  </div>
                </div>

                {/* Customer Details Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-500">Customer Name</p>
                      <p className="text-sm font-bold text-slate-900">{activeJob.customerName}</p>
                    </div>
                    <a
                      href={`tel:${activeJob.customerPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Customer</span>
                    </a>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-500">Destination Address</p>
                    <p className="text-xs font-semibold text-slate-800">{activeJob.address}</p>
                    <p className="text-[11px] text-slate-500">{activeJob.neighborhood}</p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-500">Customer Notes</p>
                    <p className="text-xs text-slate-700 italic">"{activeJob.notes}"</p>
                  </div>
                </div>

                {/* STEP 1: EN ROUTE ACTION */}
                {jobStep === 1 && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600">
                      You are en route to customer doorstep. Click below when you arrive.
                    </p>
                    <button
                      type="button"
                      onClick={() => setJobStep(2)}
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm shadow-sm transition"
                    >
                      I Have Arrived at Doorstep
                    </button>
                  </div>
                )}

                {/* STEP 2: ARRIVED & VERIFY OTP */}
                {jobStep === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <p className="text-xs text-slate-600">
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
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-mono tracking-widest text-slate-900 outline-none focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-sm hover:bg-amber-600"
                      >
                        Verify & Start
                      </button>
                    </div>
                    {otpError && (
                      <p className="text-xs text-red-600">Incorrect PIN. Please re-enter the OTP provided by the resident.</p>
                    )}
                  </form>
                )}

                {/* STEP 3: WORK IN PROGRESS & FINAL PAYMENT SETTLEMENT */}
                {jobStep === 3 && (
                  <form onSubmit={handleCompleteJob} className="space-y-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Clock className="w-4 h-4 animate-spin" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-900">Work in Progress</p>
                          <p className="text-[11px] text-slate-500">Service underway at customer doorstep</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        OTP Verified
                      </span>
                    </div>

                    {/* Dynamic Work Scope & Payment Settlement Box */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                            Work Completion & Payment Settlement
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Charge according to actual work done, parts replaced, and time spent.
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Dynamic Pricing
                        </span>
                      </div>

                      {/* Work Description Input */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tasks & Work Completed Summary *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={workDoneNotes}
                          onChange={(e) => setWorkDoneNotes(e.target.value)}
                          placeholder="e.g. Replaced faulty circuit breaker, tightened electrical wiring, tested all sockets..."
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                        />
                      </div>

                      {/* Final Payment to Collect & Mode */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Final Amount to Collect (₹) *
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3.5 text-sm font-bold text-slate-500">₹</span>
                            <input
                              type="number"
                              min="0"
                              required
                              value={customFinalPrice}
                              onChange={(e) => setCustomFinalPrice(e.target.value)}
                              placeholder="249"
                              className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Updated on the customer website receipt instantly.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Payment Mode Collected
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setPaymentMode('UPI')}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                                paymentMode === 'UPI'
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              UPI / Online
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentMode('Cash')}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                                paymentMode === 'Cash'
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              Cash In Hand
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Direct 100% payout to you (0% commission).
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition transform hover:scale-[1.01] flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Complete Job • Record ₹{customFinalPrice || '0'} Payment & Update Website</span>
                    </button>
                  </form>
                )}

                {/* STEP 4: JOB COMPLETE */}
                {jobStep === 4 && (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">Job Saved & Updated on Website!</h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Final payment of <span className="font-bold text-emerald-700">{finalSettledAmount}</span> has been permanently saved to your Pro profile & customer receipt.
                      </p>
                    </div>

                    {workDoneNotes && (
                      <div className="p-3 bg-white border border-slate-200 rounded-xl text-left text-xs max-w-md mx-auto">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Recorded Work Scope:</p>
                        <p className="text-slate-800 mt-0.5">{workDoneNotes}</p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleDismissCompletedJob}
                      className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-sm transition"
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
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold">Total Revenue Earned</p>
                <h3 className="text-3xl font-black text-amber-600 mt-1">₹{totalEarningsCalculated}</h3>
                <button
                  type="button"
                  onClick={handleRequestPayout}
                  disabled={totalEarningsCalculated === 0}
                  className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-sm transition disabled:opacity-40"
                >
                  Instant UPI Payout
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold">Saved Job Entries</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{completedJobs.length}</h3>
                <p className="text-[11px] text-emerald-700 font-semibold mt-2">Saved in your Pro Profile</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold">Platform Fee</p>
                <h3 className="text-3xl font-black text-emerald-600 mt-1">0% Comm.</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-2">100% earnings go directly to you</p>
              </div>
            </div>

            {payoutSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Payout initiated! ₹{totalEarningsCalculated} dispatched to your registered UPI ID.</span>
              </div>
            )}

            {/* Real Saved Completed Jobs Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Completed Job History & Invoices</h3>
                  <p className="text-xs text-slate-500">Permanently saved under your Worker ID: {worker?.id}</p>
                </div>
                <span className="text-xs font-bold text-blue-600">{completedJobs.length} Entries</span>
              </div>

              {completedJobs.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <Receipt className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No Completed Jobs Recorded Yet</p>
                  <p className="text-[11px] text-slate-500">
                    Accept leads from your job radar and complete tasks to record your official earnings history.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="pb-3">Invoice #</th>
                        <th className="pb-3">Task Details</th>
                        <th className="pb-3">Customer & Address</th>
                        <th className="pb-3">Completed On</th>
                        <th className="pb-3 text-right">Amount Earned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {completedJobs.map((job) => (
                        <tr key={job.id}>
                          <td className="py-3 font-mono font-bold text-blue-600">{job.invoiceNumber}</td>
                          <td className="py-3 font-semibold text-slate-900">{job.serviceTitle}</td>
                          <td className="py-3 text-slate-700">
                            <p className="font-semibold">{job.customerName}</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{job.address}</p>
                          </td>
                          <td className="py-3 text-slate-500">{job.completedAt}</td>
                          <td className="py-3 text-right font-black text-amber-600">{job.earnedAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Customer Ratings & Reviews Received */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Neighborhood Customer Reviews</h3>
                    <p className="text-xs text-slate-500">Live feedback and ratings given after job completion</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{liveRating} / 5.0</span>
                  <span className="text-slate-400 font-normal">({liveReviewsCount} Reviews)</span>
                </div>
              </div>

              {workerReviews.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <Star className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No Customer Reviews Yet</p>
                  <p className="text-[11px] text-slate-500">
                    When residents complete their service bookings and submit ratings, their feedback will appear here in real-time.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {workerReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{rev.customerName}</p>
                          <p className="text-[10px] text-slate-500">{rev.serviceName}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= (rev.rating || 5)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-amber-800 ml-1">
                            {rev.rating}.0
                          </span>
                        </div>
                      </div>

                      {rev.feedback && (
                        <p className="text-xs text-slate-700 italic">
                          "{rev.feedback}"
                        </p>
                      )}

                      {rev.feedbackTags && rev.feedbackTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {rev.feedbackTags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span>Invoice: {rev.id}</span>
                        <span>{rev.feedbackGivenAt || 'Recent'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MY PROFILE & SERVICE RATES */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto text-left">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-sm">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
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
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-sm group-hover:opacity-85 transition"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition text-white p-1">
                      <Camera className="w-5 h-5 text-white mb-0.5" />
                      <span className="text-[9px] font-bold text-white text-center leading-tight">Change</span>
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
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
                      <h2 className="text-xl font-bold text-slate-900">{editName || worker?.name}</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Pro ID: {worker?.id}
                      </span>
                    </div>
                    <p className="text-xs text-amber-700 font-semibold mt-0.5">{worker?.serviceName} • {worker?.neighborhood}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Joined {worker?.joinedDate || 'Recently'}</p>

                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => workerFileInputRef.current?.click()}
                        className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
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
                    className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{workerUploadError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {profileSaved && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pro profile and service rates have been successfully saved!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 focus-within:border-amber-500 focus-within:bg-white rounded-xl text-xs text-slate-900">
                      <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registered Phone / WhatsApp *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 focus-within:border-amber-500 focus-within:bg-white rounded-xl text-xs text-slate-900">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <input
                        type="tel"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Base Hourly / Starting Rate (₹) *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 focus-within:border-amber-500 focus-within:bg-white rounded-xl text-xs text-slate-900">
                      <DollarSign className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <input
                        type="text"
                        required
                        value={editRate}
                        onChange={(e) => setEditRate(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-xs text-slate-900 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Experience in Field
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 focus-within:border-amber-500 focus-within:bg-white rounded-xl text-xs text-slate-900">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <input
                        type="text"
                        value={editExperience}
                        onChange={(e) => setEditExperience(e.target.value)}
                        placeholder="e.g. 5+ Years"
                        className="w-full bg-transparent focus:outline-none text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Specialty Service Listed
                    </label>
                    <input
                      type="text"
                      disabled
                      value={worker?.serviceName || 'Certified Specialist'}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Neighborhood Coverage
                    </label>
                    <input
                      type="text"
                      disabled
                      value={worker?.neighborhood || 'Indiranagar / 100ft Road'}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Bio & Credentials Description
                  </label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Briefly describe your expertise, certifications, and trade background..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:border-amber-500 focus:bg-white resize-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-600" />
                      <span>24/7 Emergency SOS Callouts Ready</span>
                    </p>
                    <p className="text-[10px] text-slate-600">Receive priority high-rate urgent bookings in your neighborhood</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editEmergency}
                    onChange={(e) => setEditEmergency(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                  />
                </div>

                {/* Trust & Safety Status */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Professional Verification Charter</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Trade Identity Verified</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Police Background Clearance</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2"
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
