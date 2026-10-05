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
  onNavigateHome?: () => void;
}

export function Navbar({
  onOpenFindModal,
  onOpenAppModal,
  onOpenJoinModal,
  onOpenBookingsModal,
  onOpenProfileModal,
  onNavigateHome,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, currentUser, logout, setActiveRole, setActiveTab, getUserBookings } = useAuth();
  const bookingsCount = getUserBookings(currentUser?.id).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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

  const handleLinkClick = () => {
    if (onNavigateHome) onNavigateHome();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white/70 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={handleLinkClick}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-blue-600 p-[1.5px] shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 flex items-center gap-1.5 leading-tight">
              Smart Neighborhood
            </span>
            <span className="text-[11px] text-blue-600 font-semibold tracking-wide">
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
              onClick={handleLinkClick}
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors tracking-wide relative group py-1 whitespace-nowrap"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right Action CTAs & Profile */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* My Bookings Button */}
          {onOpenBookingsModal && (
            <button
              onClick={onOpenBookingsModal}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Bookings</span>
              {bookingsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-extrabold ml-0.5">
                  {bookingsCount}
                </span>
              )}
            </button>
          )}

          {/* Download App Button */}
          <button
            onClick={onOpenAppModal}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>App</span>
          </button>

          {/* Explore Directory CTA */}
          <button
            onClick={onOpenFindModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all transform hover:scale-105 flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Explore Services</span>
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
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 focus:outline-none"
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
            className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-4 shadow-xl text-left"
          >
            {/* Logged in status header on mobile - click to open profile */}
            {isAuthenticated && currentUser && (
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenProfileModal) onOpenProfileModal();
                }}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      View Profile
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser.email}</p>
                  <p className="text-[10px] text-blue-600 font-semibold">{currentUser.neighborhood}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLinkClick();
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-blue-600 py-1 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              {onOpenProfileModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfileModal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center gap-2"
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
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>My Bookings ({bookingsCount})</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFindModal();
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Browse Services Directory</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSwitchToWorker();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs flex items-center justify-center gap-2"
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
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <span>Register as a Local Pro</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppModal();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Download Mobile App</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


