import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlusCircle, CheckCircle2, Sparkles, Tag, DollarSign, Clock, ShieldCheck, Zap } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import confetti from 'canvas-confetti';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const { categories, addCustomService } = useNetwork();

  const [serviceName, setServiceName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(categories[1]?.id || 'repairs');
  const [customGroupName, setCustomGroupName] = useState('');
  const [startingPrice, setStartingPrice] = useState('45');
  const [avgResponseTime, setAvgResponseTime] = useState('Within 1 hour');
  const [shortDesc, setShortDesc] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [icon, setIcon] = useState('Sparkles');
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    const group = selectedGroup === 'new' ? customGroupName.trim() || 'Custom Services' : selectedGroup;

    addCustomService({
      name: serviceName.trim(),
      category: selectedGroup === 'new' ? 'custom' : selectedGroup,
      categoryGroup: group,
      startingPrice: startingPrice.startsWith('$') ? startingPrice : `$${startingPrice}/hr`,
      avgResponseTime,
      shortDesc: shortDesc.trim() || `Professional ${serviceName.trim()} services provided by verified neighbors.`,
      isEmergencyAvailable: isEmergency,
      icon,
    });

    setIsDone(true);
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {
      // fallback
    }
  };

  const handleClose = () => {
    setIsDone(false);
    setServiceName('');
    setShortDesc('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-navy-900 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-950/80 via-navy-900 to-navy-950 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Add New Service Category</h3>
                <p className="text-xs text-slate-400">Expand the network with your specialized skills</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isDone ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
              {/* Service Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Service / Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Inverter Setup, Drone Roof Inspector, Piano Tuner..."
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Category Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category Group</label>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {categories.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-navy-900 text-white">
                        {cat.name}
                      </option>
                    ))}
                    <option value="new" className="bg-navy-900 text-cyan-300 font-bold">
                      + Create New Group...
                    </option>
                  </select>
                </div>

                {selectedGroup === 'new' && (
                  <div>
                    <label className="text-xs font-semibold text-cyan-300 block mb-1">New Group Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Artisan & Crafts"
                      value={customGroupName}
                      onChange={(e) => setCustomGroupName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-800 border border-cyan-500/40 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Starting Rate (₹)</label>
                  <div className="relative">
                    <span className="text-sm font-bold text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                    <input
                      type="number"
                      min="99"
                      max="10000"
                      step="50"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what this service provides to neighborhood households..."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Emergency Checkbox */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Emergency On-Demand Dispatch</div>
                    <div className="text-[10px] text-slate-400">Eligible for urgent SOS assistance requests</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-glow-blue transition"
              >
                Publish Category to Neighborhood Network
              </button>
            </form>
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">New Category Added!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                <b className="text-cyan-300">{serviceName}</b> is now active in the neighborhood directory. You and other local professionals can now register and accept bookings under this category.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                View in Directory
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
