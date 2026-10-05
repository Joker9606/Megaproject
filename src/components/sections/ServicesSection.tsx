import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNetwork } from '../../context/NetworkContext';
import { ServiceItem } from '../../types';
import { ServiceIcon } from '../common/ServiceIcon';
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
    <section id="services" className="relative py-20 bg-slate-50 overflow-hidden text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hyperlocal Service Directory & Instant Booking</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Neighborhood <span className="text-blue-600">Services Directory</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Book verified local professionals with doorstep inspection, custom work-based quotes, and pay after completion.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search any service or trade (e.g. Electrician, Roofer, AC Service, Plumber)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 shadow-sm transition"
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
                    ? 'bg-blue-600 text-white shadow-sm scale-105'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: (idx % 8) * 0.04 }}
              className="h-full"
            >
              <div className="bg-white rounded-3xl p-6 flex flex-col justify-between border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-card-hover transition-all text-left h-full group">
                {/* Card Header & Badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Icon */}
                    <div
                      className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shadow-sm p-3"
                    >
                      <ServiceIcon name={service.icon || service.id} className="w-6 h-6" />
                    </div>

                    {service.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Service Name */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>

                  {/* Category tag */}
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                    {service.categoryGroup || service.category}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Popular bullets */}
                  <div className="mt-4 space-y-1.5">
                    {service.popularServices && service.popularServices.slice(0, 2).map((item, i) => (
                      <div key={i} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Pricing, View Details & Direct Book CTA */}
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pricing Scheme</span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Custom Quote on Work
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectService(service)}
                      className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-blue-600 transition"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-600" />
                      <span>Details</span>
                    </button>
                  </div>

                  {/* Primary Booking Button - navigates to dedicated page */}
                  <button
                    onClick={() => onBookService(service)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all transform hover:scale-[1.02] flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Service Slot</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state if search returned 0 results */}
        {displayedServices.length === 0 && (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No service matching "{searchQuery}"</h3>
              <p className="text-xs text-slate-500 mt-1">
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
              className="px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-900 font-bold text-sm shadow-sm transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              <span>{showAllCards ? 'Show Top 8 Services' : `View All Services (${filteredServices.length})`}</span>
              <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${showAllCards ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

