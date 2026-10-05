import React, { useState } from 'react';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthGateway } from './components/auth/AuthGateway';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { Navbar } from './components/sections/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { StatisticsSection } from './components/sections/StatisticsSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { WhyTrustUsSection } from './components/sections/WhyTrustUsSection';
import { EmergencySection } from './components/sections/EmergencySection';
import { ForProfessionalsSection } from './components/sections/ForProfessionalsSection';
import { AppPromotionSection } from './components/sections/AppPromotionSection';
import { AboutUsSection } from './components/sections/AboutUsSection';
import { ContactSection } from './components/sections/ContactSection';
import { FAQSection } from './components/sections/FAQSection';
import { FinalCTASection } from './components/sections/FinalCTASection';
import { Footer } from './components/sections/Footer';

import { BookingPage } from './components/booking/BookingPage';
import { FindServiceModal } from './components/modals/FindServiceModal';
import { ServiceDetailsModal } from './components/modals/ServiceDetailsModal';
import { JoinProModal } from './components/modals/JoinProModal';
import { AppDownloadModal } from './components/modals/AppDownloadModal';
import { EmergencySOSModal } from './components/modals/EmergencySOSModal';
import { MyBookingsModal } from './components/modals/MyBookingsModal';
import { NoWorkerAvailableModal } from './components/modals/NoWorkerAvailableModal';
import { ResidentProfileModal } from './components/modals/ResidentProfileModal';

import { ServiceItem, VerifiedPro } from './types';

function MainLayout() {
  const { services, pros } = useNetwork();

  // Page view routing: 'home' | 'booking'
  const [currentView, setCurrentView] = useState<'home' | 'booking'>('home');

  // Modal states
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);
  const [findInitialService, setFindInitialService] = useState<string | undefined>(undefined);

  const [isJoinProModalOpen, setIsJoinProModalOpen] = useState(false);
  const [isAppDownloadModalOpen, setIsAppDownloadModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNoWorkerModalOpen, setIsNoWorkerModalOpen] = useState(false);
  const [unavailableService, setUnavailableService] = useState<ServiceItem | null>(null);

  // Service Details Modal state
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Dedicated Booking state
  const [bookingService, setBookingService] = useState<ServiceItem | null>(null);
  const [bookingPro, setBookingPro] = useState<VerifiedPro | null>(null);

  // Handlers
  const handleOpenFindModal = (serviceId?: string) => {
    setFindInitialService(serviceId);
    setIsFindModalOpen(true);
  };

  const handleSelectServiceForDetails = (service: ServiceItem) => {
    setSelectedService(service);
    setIsDetailsModalOpen(true);
  };

  const handleBookService = (service: ServiceItem) => {
    // Strict match against real verified pros for this trade
    const matchingPro =
      pros.find(
        (p) =>
          p.serviceId === service.id ||
          p.service.toLowerCase().includes(service.name.toLowerCase()) ||
          service.name.toLowerCase().includes(p.service.toLowerCase())
      ) || null;

    // If no worker is available, display error modal (no dummy booking!)
    if (!matchingPro) {
      setUnavailableService(service);
      setIsNoWorkerModalOpen(true);
      return;
    }

    setBookingService(service);
    setBookingPro(matchingPro);
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookPro = (pro: VerifiedPro) => {
    setBookingPro(pro);
    const matchingService = services.find((s) => s.id === pro.serviceId) || null;
    setBookingService(matchingService);
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProFromMap = (proName: string, serviceName: string) => {
    const matchingPro =
      pros.find((p) => p.name.toLowerCase().includes(proName.toLowerCase())) || null;

    if (!matchingPro) {
      const fallbackService =
        services.find(
          (s) =>
            s.name.toLowerCase() === serviceName.toLowerCase() ||
            s.id.toLowerCase() === serviceName.toLowerCase()
        ) || null;
      setUnavailableService(fallbackService);
      setIsNoWorkerModalOpen(true);
      return;
    }

    const matchingService =
      services.find(
        (s) =>
          s.id === matchingPro.serviceId ||
          s.name.toLowerCase() === serviceName.toLowerCase()
      ) || null;

    setBookingService(matchingService);
    setBookingPro(matchingPro);
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenJoinPro = () => {
    setIsJoinProModalOpen(true);
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white relative">
      {/* Navigation */}
      <Navbar
        onOpenFindModal={() => handleOpenFindModal()}
        onOpenAppModal={() => setIsAppDownloadModalOpen(true)}
        onOpenJoinModal={handleOpenJoinPro}
        onOpenBookingsModal={() => setIsBookingsModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main Content View: Booking Page OR Home Page */}
      {currentView === 'booking' ? (
        <main className="py-6 sm:py-10">
          <BookingPage
            service={bookingService}
            pro={bookingPro}
            onBack={handleNavigateHome}
            onOpenMyBookings={() => {
              handleNavigateHome();
              setIsBookingsModalOpen(true);
            }}
            onOpenExploreServices={() => {
              handleNavigateHome();
              handleOpenFindModal('all');
            }}
          />
        </main>
      ) : (
        <main>
          {/* 1. Hero Section */}
          <HeroSection
            onOpenFindModal={handleOpenFindModal}
            onOpenAppModal={() => setIsAppDownloadModalOpen(true)}
            onSelectProFromMap={handleSelectProFromMap}
          />

          {/* 2. Key Live Statistics */}
          <StatisticsSection />

          {/* 3. Services Directory Section with direct booking page navigation */}
          <ServicesSection
            onSelectService={handleSelectServiceForDetails}
            onBookService={handleBookService}
            onOpenExploreAll={() => handleOpenFindModal('all')}
          />

          {/* 4. How It Works Section */}
          <HowItWorksSection onOpenFindModal={() => handleOpenFindModal()} />

          {/* 5. Why Trust Us Section */}
          <WhyTrustUsSection />

          {/* 6. Emergency SOS Help Section */}
          <EmergencySection
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />

          {/* 7. For Professionals Section */}
          <ForProfessionalsSection
            onOpenJoinModal={handleOpenJoinPro}
          />

          {/* 8. App Promotion Section */}
          <AppPromotionSection
            onOpenAppModal={() => setIsAppDownloadModalOpen(true)}
            onOpenLearnMore={() => setIsAppDownloadModalOpen(true)}
          />

          {/* 9. About Us Section */}
          <AboutUsSection />

          {/* 10. Contact Section */}
          <ContactSection />

          {/* 11. FAQ Section */}
          <FAQSection />

          {/* 12. Final CTA Section */}
          <FinalCTASection
            onOpenAppModal={() => setIsAppDownloadModalOpen(true)}
            onOpenFindModal={() => handleOpenFindModal()}
          />
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Informational Directory Lookup Modal */}
      <FindServiceModal
        isOpen={isFindModalOpen}
        onClose={() => setIsFindModalOpen(false)}
        initialService={findInitialService}
        onSelectServiceForDetails={(svc) => {
          setIsFindModalOpen(false);
          handleSelectServiceForDetails(svc);
        }}
        onBookService={(svc) => {
          setIsFindModalOpen(false);
          handleBookService(svc);
        }}
        onBookPro={(pro) => {
          setIsFindModalOpen(false);
          handleBookPro(pro);
        }}
        onOpenJoinPro={handleOpenJoinPro}
      />

      {/* Service Details & Scope Guide Modal */}
      <ServiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        service={selectedService}
        pros={pros}
        onBookService={(svc) => {
          setIsDetailsModalOpen(false);
          handleBookService(svc);
        }}
        onBookPro={(pro) => {
          setIsDetailsModalOpen(false);
          handleBookPro(pro);
        }}
        onOpenAppModal={() => {
          setIsDetailsModalOpen(false);
          setIsAppDownloadModalOpen(true);
        }}
      />

      {/* Professional Registration Modal */}
      <JoinProModal
        isOpen={isJoinProModalOpen}
        onClose={() => setIsJoinProModalOpen(false)}
      />

      {/* Mobile App Download Modal */}
      <AppDownloadModal
        isOpen={isAppDownloadModalOpen}
        onClose={() => setIsAppDownloadModalOpen(false)}
      />

      {/* Emergency SOS Dispatch Modal */}
      <EmergencySOSModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Resident Saved Bookings History Modal */}
      <MyBookingsModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        onOpenExploreServices={() => handleOpenFindModal('all')}
      />

      {/* Resident Profile & Essential Details Modal */}
      <ResidentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenBookings={() => {
          setIsProfileModalOpen(false);
          setIsBookingsModalOpen(true);
        }}
      />

      {/* No Worker Available Warning Modal */}
      <NoWorkerAvailableModal
        isOpen={isNoWorkerModalOpen}
        onClose={() => {
          setIsNoWorkerModalOpen(false);
          setUnavailableService(null);
        }}
        service={unavailableService}
        onOpenJoinPro={handleOpenJoinPro}
        onExploreOtherServices={() => handleOpenFindModal('all')}
      />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, currentUser, authLoading } = useAuth();

  // Show clean light loader while Firebase Auth resolves session from Cloud
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-sm mb-4">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
        <p className="text-sm font-bold text-slate-900 tracking-wide">Smart Neighborhood Network</p>
        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Connecting to Firebase Cloud...
        </p>
      </div>
    );
  }

  // 1. If not authenticated at all, show the clean Auth Gateway
  if (!isAuthenticated || !currentUser) {
    return <AuthGateway />;
  }

  // 2. If logged in as WORKER, show dedicated Worker Operations Dashboard workflow
  if (currentUser.role === 'worker') {
    return <WorkerDashboard />;
  }

  // 3. If logged in as USER / RESIDENT, show Resident Help Network Website
  return <MainLayout />;
}

export function App() {
  return (
    <NetworkProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NetworkProvider>
  );
}

export default App;
