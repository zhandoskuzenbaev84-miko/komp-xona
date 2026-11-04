import React, { useState } from 'react';
import { SocketProvider } from './context/SocketContext';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { MultiStationBookingModal } from './components/booking/MultiStationBookingModal';

// Pages
import { Home } from './pages/Home';
import { PCBooking } from './pages/PCBooking';
import { PSBooking } from './pages/PSBooking';
import { GamesLibrary } from './pages/GamesLibrary';
import { PricingOffers } from './pages/PricingOffers';
import { AdminDashboard } from './pages/AdminDashboard';

export const App = () => {
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (['home', 'pc', 'ps', 'games', 'pricing', 'admin'].includes(hash)) {
      return hash;
    }
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    if (['home', 'pc', 'ps', 'games', 'pricing', 'admin'].includes(path)) {
      return path;
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    window.location.hash = tab;
  };

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'pc', 'ps', 'games', 'pricing', 'admin'].includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'pc':
        return <PCBooking />;
      case 'ps':
        return <PSBooking />;
      case 'games':
        return <GamesLibrary />;
      case 'pricing':
        return <PricingOffers />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <SocketProvider>
      <BookingProvider>
        <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 font-['Inter',sans-serif]">
          <div>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="transition-all duration-300">
              {renderPage()}
            </main>
          </div>

          <Footer />

          {/* Global Booking Modal & Real-time Toasts */}
          <MultiStationBookingModal />
          <ToastContainer />
        </div>
      </BookingProvider>
    </SocketProvider>
  );
};

export default App;
