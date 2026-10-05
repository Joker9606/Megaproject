import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNetwork } from '../../context/NetworkContext';
import { ServiceItem } from '../../types';
import { ServiceIcon } from '../common/ServiceIcon';
import { TiltCard3D } from '../common/TiltCard3D';
import { Search, Check, Sparkles, ChevronDown, Info, Calendar } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
  onBookService: (service: ServiceItem) => void;
  onOpenExploreAll: () => void;
}

export function ServicesSection({ onSelectService, onBookService, onOpenExploreAll }: ServicesSectionProps) {
  const { services, categories } = useNetwork();
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCards, setShowAllCards] = useState(false);

  // Filter services by category and search
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCat = activeCategory === 'all' || s.category === activeCategory || (s.categoryGroup && s.categoryGroup.toLowerCase().includes(activeCategory.toLowerCase()));
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) || (s.popularServices && s.popularServices.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCat && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  const displayedServices = showAllCards ? filteredServices : filteredServices.slice(0, 8);

  return (
    <section id="services" className="relative py-24 bg-navy-950/90 overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-xs font-bold text-cyan-300 shadow-glow-cyan">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hyperlocal Service Directory & Instant Booking</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Neighborhood <span className="text-gradient-cyan">Services Directory.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Book verified local professionals for electrical, plumbing, carpentry, AC repair, cleaning, and tutoring at transparent upfront rates in INR.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-5">
          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-cyan-400" />
              <input
                type="text"
                placeholder="Search any service or trade (e.g. Electrician, Roofer, AC Service, Plumber)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-cyan-500/30 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 shadow-xl transition backdrop-blur-md"
              />
            </div>
          </div>

          {/* Dynamic Category Filter Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setShowAllCards(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 text-white shadow-glow-blue scale-105'
                    : 'bg-navy-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Services Grid with 3D Tilt Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (idx % 8) * 0.05 }}
              className="h-full"
            >
              <TiltCard3D tiltMaxAngle={10} glareOpacity={0.22}>
                <div className="glass-card rounded-3xl p-6 flex flex-col justify-between relative group border border-slate-800/90 hover:border-cyan-500/50 transition-all text-left h-full bg-gradient-to-b from-navy-900/90 to-navy-950/95">
                  {/* Card Header & Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {/* Glowing Icon */}
                      <div
                        style={{ transform: 'translateZ(20px)' }}
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient || 'from-cyan-500/20 to-blue-500/10'} border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-110 group-hover:shadow-glow-cyan transition-all duration-300 shadow-md`}
                      >
                        <ServiceIcon name={service.icon || service.id} className="w-7 h-7" />
                      </div>

                      {service.badge && (
                        <span
                          style={{ transform: 'translateZ(15px)' }}
                          className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-cyan-300 border border-cyan-500/40"
                        >
                          {service.badge}
                        </span>
                      )}
                    </div>

                    {/* Service Name */}
                    <h3
                      style={{ transform: 'translateZ(18px)' }}
                      className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between"
                    >
                      <span>{service.name}</span>
                    </h3>

                    {/* Category tag */}
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                      {service.categoryGroup || service.category}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {service.shortDesc}
                    </p>

                    {/* Popular bullets */}
                    <div className="mt-4 space-y-1.5">
                      {service.popularServices && service.popularServices.slice(0, 2).map((item, i) => (
                        <div key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Pricing, View Details & Direct Book CTA */}
                  <div
                    style={{ transform: 'translateZ(15px)' }}
                    className="mt-6 pt-4 border-t border-slate-800/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Baseline Rate</span>
                        <span className="text-sm font-black text-white">{formatINR(service.startingPrice)}</span>
                      </div>

                      <button
                        onClick={() => onSelectService(service)}
                        className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-cyan-300 transition"
                      >
                        <Info className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Details</span>
                      </button>
                    </div>

                    {/* Primary Booking Button */}
                    <button
                      onClick={() => onBookService(service)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold text-xs shadow-glow-blue transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Service ({formatINR(service.startingPrice)})</span>
                    </button>
                  </div>
                </div>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>

        {/* Empty state if search returned 0 results */}
        {displayedServices.length === 0 && (
          <div className="text-center py-16 px-6 glass-card rounded-3xl border border-slate-800 space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No service matching "{searchQuery}"</h3>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for another trade such as Electrician, Plumber, AC Service, Carpenter, or Cleaning.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Expand / View All Action */}
        {filteredServices.length > 8 && (
          <div className="text-center flex items-center justify-center">
            <button
              onClick={() => setShowAllCards(!showAllCards)}
              className="px-8 py-3.5 rounded-2xl bg-navy-900 hover:bg-slate-800 border border-cyan-500/50 hover:border-cyan-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/10 transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              <span>{showAllCards ? 'Show Top 8 Services' : `View All Services (${filteredServices.length})`}</span>
              <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${showAllCards ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
