import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, Star, ShieldCheck, Phone, Info, Calendar } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { VerifiedPro, ServiceItem } from '../../types';
import { formatINR } from '../../utils/formatCurrency';

interface FindServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  onSelectServiceForDetails?: (service: ServiceItem) => void;
  onBookService?: (service: ServiceItem) => void;
  onBookPro?: (pro: VerifiedPro) => void;
  onOpenJoinPro?: () => void;
}

export function FindServiceModal({
  isOpen,
  onClose,
  initialService,
  onSelectServiceForDetails,
  onBookService,
  onBookPro,
  onOpenJoinPro,
}: FindServiceModalProps) {
  const { services, pros } = useNetwork();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialService || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistance, setSelectedDistance] = useState('5');
  const [revealedPhoneId, setRevealedPhoneId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter Pros
  const filteredPros = pros.filter((pro) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      pro.serviceId === selectedCategory ||
      pro.service.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter Services matching current query
  const activeServiceObj = services.find((s) => s.id === selectedCategory);

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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 text-left">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h2 className="text-xl font-bold text-slate-900">Find & Book Verified Local Help</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Explore {services.length} services, instant booking, and verified neighborhood providers
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="p-6 border-b border-slate-100 bg-white space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search input */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search services or local pros (e.g. Electrician, Plumber, AC Repair)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              {/* Distance Radius */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs text-slate-500 whitespace-nowrap">Radius:</span>
                <select
                  value={selectedDistance}
                  onChange={(e) => setSelectedDistance(e.target.value)}
                  className="bg-transparent text-sm text-slate-900 font-medium focus:outline-none w-full cursor-pointer"
                >
                  <option value="2">Within 2 km</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                </select>
              </div>
            </div>

            {/* Service Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition font-medium ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                All Categories ({services.length})
              </button>

              {services.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => setSelectedCategory(svc.id)}
                  className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition font-medium flex items-center gap-1.5 ${
                    selectedCategory === svc.id
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <span>{svc.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-left bg-slate-50">
            {filteredPros.length > 0 ? (
              filteredPros.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200 hover:border-blue-300 hover:shadow-card transition duration-200"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="relative">
                      <img
                        src={pro.avatar}
                        alt={pro.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600"
                      />
                      {pro.isAvailableNow && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active"></span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">{pro.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Aadhaar Verified
                        </span>
                      </div>

                      <div className="text-xs text-blue-600 font-semibold mt-0.5">{pro.service}</div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-amber-600 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {pro.rating} ({pro.reviewsCount} reviews)
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" /> {pro.distance} ({pro.neighborhood})
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">{pro.completedCount}+ jobs done</span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 max-w-xl">{pro.bio}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-500">Baseline Rate</div>
                      <div className="text-lg font-extrabold text-slate-900">{formatINR(pro.hourlyRate)}</div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setRevealedPhoneId(revealedPhoneId === pro.id ? null : pro.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{revealedPhoneId === pro.id ? (pro.phone || '+91 98450 21980') : 'Call'}</span>
                      </button>

                      {onSelectServiceForDetails && (
                        <button
                          onClick={() => {
                            const svc = services.find((s) => s.id === pro.serviceId) || services[0];
                            onSelectServiceForDetails(svc);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                        >
                          <Info className="w-3 h-3 text-blue-600" />
                          <span>Details</span>
                        </button>
                      )}

                      {onBookPro && (
                        <button
                          onClick={() => {
                            onClose();
                            onBookPro(pro);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* If no direct pros registered in category yet, display category card with instant booking */
              <div className="text-center py-10 px-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                  <Info className="w-7 h-7" />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeServiceObj ? `Book ${activeServiceObj.name}` : 'Neighborhood Directory Overview'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                    {activeServiceObj
                      ? `${activeServiceObj.description} Baseline rates start from ${formatINR(activeServiceObj.startingPrice)} with zero advance payment.`
                      : 'Browse complete service descriptions, baseline rates in INR (₹), and neighborhood trade standards.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {activeServiceObj && onBookService && (
                    <button
                      onClick={() => {
                        onClose();
                        onBookService(activeServiceObj);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book {activeServiceObj.name} ({formatINR(activeServiceObj.startingPrice)})</span>
                    </button>
                  )}

                  {activeServiceObj && onSelectServiceForDetails && (
                    <button
                      onClick={() => onSelectServiceForDetails(activeServiceObj)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Info className="w-4 h-4 text-blue-600" />
                      <span>View Service Scope</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
