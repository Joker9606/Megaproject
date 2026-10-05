import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Smartphone, Search, User, Wrench, Calendar } from 'lucide-react';
import { UserProfileMenu } from '../auth/UserProfileMenu';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenFindModal: () => void;
  onOpenAppModal: () => void;
  onOpenJoinModal?: () => void;
  onOpenBookingsModal?: () => void;
  onOpenProfileModal?: () => void;
}

export function Navbar({
  onOpenFindModal,
  onOpenAppModal,
  onOpenJoinModal,
  onOpenBookingsModal,
  onOpenProfileModal,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, currentUser, logout, setActiveRole, setActiveTab, getUserBookings } = useAuth();
  const bookingsCount = getUserBookings(currentUser?.id).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services Directory', href: '#services' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Why Trust Us', href: '#why-trust-us' },
    { name: 'For Professionals', href: '#for-pros' },
    { name: 'About Us', href: '#about-us' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleSwitchToWorker = () => {
    logout();
    setActiveRole('worker');
    setActiveTab('login');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav py-3 shadow-2xl backdrop-blur-xl border-b border-cyan-500/20'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-[1.5px] shadow-glow-blue transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-navy-950 rounded-2xl flex items-center justify-center">
              <div className="relative">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5 leading-tight">
              Smart Neighborhood
            </span>
            <span className="text-[11px] text-cyan-400 font-medium tracking-wide">
              Help & Information Network
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-colors tracking-wide relative group py-1 whitespace-nowrap"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right Action CTAs & Profile */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* My Bookings History Button */}
          {onOpenBookingsModal && (
            <button
              onClick={onOpenBookingsModal}
              className="px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-300 text-xs font-bold transition flex items-center gap-1.5 shadow-glow-cyan"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Bookings</span>
              {bookingsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-cyan-400 text-navy-950 text-[10px] flex items-center justify-center font-extrabold ml-0.5">
                  {bookingsCount}
                </span>
              )}
            </button>
          )}

          {/* Download App Button */}
          <button
            onClick={onOpenAppModal}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>App</span>
          </button>

          {/* Explore Directory CTA */}
          <button
            onClick={onOpenFindModal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-glow-blue transition-all transform hover:scale-105 flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>

          {/* User Profile Menu */}
          <UserProfileMenu
            onOpenBookings={onOpenBookingsModal}
            onOpenProfile={onOpenProfileModal}
          />
        </div>

        {/* Mobile Controls */}
        <div className="sm:hidden flex items-center gap-2">
          {isAuthenticated && currentUser && (
            <div className="scale-90">
              <UserProfileMenu
                onOpenBookings={onOpenBookingsModal}
                onOpenProfile={onOpenProfileModal}
              />
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-950/95 border-b border-cyan-500/20 backdrop-blur-2xl px-6 py-5 space-y-4 shadow-2xl text-left"
          >
            {/* Logged in status header on mobile - click to open profile */}
            {isAuthenticated && currentUser && (
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenProfileModal) onOpenProfileModal();
                }}
                className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center gap-3 cursor-pointer hover:bg-cyan-950/60 transition shadow-glow-cyan"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-xl object-cover border border-cyan-400"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300">
                      View Profile
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                  <p className="text-[10px] text-cyan-400 font-semibold">{currentUser.neighborhood}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold text-slate-200 hover:text-cyan-300 py-1 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              {onOpenProfileModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfileModal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 shadow-glow-cyan"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Resident Profile & Address</span>
                </button>
              )}

              {onOpenBookingsModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBookingsModal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-850 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>My Bookings ({bookingsCount})</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFindModal();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-glow-blue flex items-center justify-center gap-2"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Browse Services Directory</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSwitchToWorker();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Switch to Worker Portal</span>
              </button>

              {onOpenJoinModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenJoinModal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <span>Register as a Local Pro</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppModal();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Download Mobile App</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

