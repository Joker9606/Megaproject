import React from 'react';
import { Shield, Wrench, Power, LogOut, Bell, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { WorkerUser } from '../../types/auth';

interface WorkerNavbarProps {
  activeTab: 'leads' | 'active' | 'earnings' | 'profile';
  setActiveTab: (tab: 'leads' | 'active' | 'earnings' | 'profile') => void;
  pendingLeadsCount: number;
}

export function WorkerNavbar({
  activeTab,
  setActiveTab,
  pendingLeadsCount,
}: WorkerNavbarProps) {
  const { currentUser, toggleWorkerAvailability, logout } = useAuth();
  const worker = currentUser as WorkerUser;

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand & Pro Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-sm">
            <Wrench className="w-5 h-5 text-slate-950" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                Pro Terminal
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold">
                {worker?.serviceName || 'Specialist'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Smart Neighborhood Professional Workspace
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'leads'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Job Leads</span>
            {pendingLeadsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-extrabold">
                {pendingLeadsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'active'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Job
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'earnings'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Earnings & Wallet
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Profile & Rates
          </button>
        </nav>

        {/* Right Controls: Availability Toggle & Logout */}
        <div className="flex items-center gap-3">
          {/* Online/Offline Toggle */}
          <button
            onClick={toggleWorkerAvailability}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              worker?.isAvailableNow
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {worker?.isAvailableNow ? 'Duty: ONLINE' : 'Duty: OFFLINE'}
            </span>
          </button>

          {/* User Avatar & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 group text-left cursor-pointer p-1 rounded-xl hover:bg-slate-100 transition"
              title="Open Pro Profile & Rates"
            >
              <img
                src={worker?.avatar}
                alt={worker?.name}
                className="w-8 h-8 rounded-xl object-cover border border-slate-200 group-hover:border-amber-500 transition"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700 transition">{worker?.name}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">★ {worker?.rating || '5.0'}</span>
              </div>
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition ml-1"
              title="Sign Out of Worker Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-50 border-t border-slate-200 px-2 py-1.5">
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
            activeTab === 'leads' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'
          }`}
        >
          <span>Leads</span>
          {pendingLeadsCount > 0 && (
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">
              {pendingLeadsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            activeTab === 'active' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'
          }`}
        >
          Active Job
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            activeTab === 'earnings' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'
          }`}
        >
          Wallet
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            activeTab === 'profile' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'
          }`}
        >
          Profile
        </button>
      </div>
    </header>
  );
}
