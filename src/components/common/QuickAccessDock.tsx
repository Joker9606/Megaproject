import React from 'react';
import { Search, PlusCircle, UserCheck, Zap } from 'lucide-react';
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
  const { services } = useNetwork();

  return (
    <aside aria-label="Quick Access Dock" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 hidden sm:flex items-center gap-1.5 p-2 rounded-2xl bg-white/95 border border-slate-200 backdrop-blur-xl shadow-lg">
      {/* 1. Explore Services */}
      <button
        onClick={onOpenFindModal}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition group"
        title="Search all verified services"
      >
        <Search className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
        <span>Services ({services.length})</span>
      </button>

      {/* 2. Register as Pro */}
      <button
        onClick={onOpenJoinModal}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition group"
        title="Register as a service provider"
      >
        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
        <span>Join as Pro</span>
      </button>

      {/* 3. SOS Dispatch */}
      <button
        onClick={onOpenEmergencyModal}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition group"
        title="Emergency Help Dispatch"
      >
        <Zap className="w-3.5 h-3.5 text-red-600 fill-red-600" />
        <span>SOS Dispatch</span>
      </button>
    </aside>
  );
}
