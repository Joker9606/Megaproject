import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  LogOut,
  ChevronDown,
  MapPin,
  RotateCcw,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ResidentUser } from '../../types/auth';

interface UserProfileMenuProps {
  onOpenBookings?: () => void;
  onOpenProfile?: () => void;
}

export function UserProfileMenu({ onOpenBookings, onOpenProfile }: UserProfileMenuProps) {
  const {
    currentUser,
    isAuthenticated,
    logout,
    setActiveRole,
    setActiveTab,
  } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  const residentData = currentUser as ResidentUser;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          if (onOpenProfile) {
            onOpenProfile();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border transition-all duration-200 text-left bg-white border-slate-200 hover:border-slate-300 shadow-sm"
      >
        <div className="relative">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-xl object-cover border border-slate-200"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>

        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
            {currentUser.name.split(' ')[0]}
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </span>
          <span className="text-[10px] font-semibold text-blue-600">
            Resident Profile
          </span>
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-card p-4 z-50 text-left"
          >
            {/* Header / Profile info - clickable to open full profile */}
            <div
              onClick={() => {
                setIsOpen(false);
                if (onOpenProfile) onOpenProfile();
              }}
              className="flex items-start gap-3 pb-3.5 border-b border-slate-100 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Resident
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{currentUser.email}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1">
                  <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                  <span className="truncate">{currentUser.neighborhood}</span>
                </div>
              </div>
            </div>

            {/* Resident Specific Info */}
            <div className="py-3 border-b border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Address / Flat:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                  {residentData.apartment || 'Locality Resident'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Emergency SOS:</span>
                <span className="font-semibold text-emerald-600">
                  {residentData.emergencyContact || 'Active'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 space-y-2">
              {/* View Full Profile Modal CTA */}
              {onOpenProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>View Full Profile & Address</span>
                </button>
              )}

              {onOpenBookings && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenBookings();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>View My Booking History</span>
                </button>
              )}

              {/* Switch Role Button */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                  setActiveRole('worker');
                  setActiveTab('login');
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Switch to Worker Portal</span>
              </button>

              {/* Log Out */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out & Exit</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
