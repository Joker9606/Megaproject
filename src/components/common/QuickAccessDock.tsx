import React from 'react';
import { Search, PlusCircle, UserCheck, Zap, Smartphone } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

interface QuickAccessDockProps {
  onOpenFindModal: () => void;
  onOpenAddCategory: () => void;
  onOpenJoinModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenAppModal: () => void;
}

export function QuickAccessDock({
  onOpenFindModal,
  onOpenAddCategory,
  onOpenJoinModal,
  onOpenEmergencyModal,
  onOpenAppModal,
}: QuickAccessDockProps) {
  const { services, pros } = useNetwork();

  return (
    <aside aria-label="Quick Access Dock" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 hidden sm:flex items-center gap-1.5 p-2 rounded-2xl bg-navy-900/90 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl shadow-navy-950/80">
      {/* 1. Explore Services */}
      <button
        onClick={onOpenFindModal}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition group"
        title="Search all verified services"
      >
        <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
        <span>Services ({services.length})</span>
      </button>

      {/* 2. Add New Category */}
      <button
        onClick={onOpenAddCategory}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold transition group"
        title="Add a custom service category"
      >
        <PlusCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-90 transition-transform" />
        <span>+ Add Category</span>
      </button>

      {/* 3. Register as Pro */}
      <button
        onClick={onOpenJoinModal}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-cyan-300 hover:text-white text-xs font-bold transition group"
        title="Register as a service provider"
      >
        <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
        <span>Join as Pro</span>
      </button>

      {/* 4. SOS Dispatch */}
      <button
        onClick={onOpenEmergencyModal}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold transition group animate-pulse"
        title="Emergency Help Dispatch"
      >
        <Zap className="w-3.5 h-3.5 text-red-400 fill-red-400" />
        <span>SOS Dispatch</span>
      </button>
    </aside>
  );
}
