import React from 'react';
import { useSocket } from '../../context/SocketContext';
import { useBooking } from '../../context/BookingContext';
import { Monitor, Gamepad2, Flame, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { isConnected } = useSocket();
  const { selectedStations, openModalWithStations, clearSelection } = useBooking();

  const navItems = [
    { id: 'home', label: 'Bosh Sahifa', icon: Sparkles },
    { id: 'pc', label: 'PC Zali (50)', icon: Monitor, badge: '50 PC' },
    { id: 'ps', label: 'PS5 VIP Lounge', icon: Gamepad2, badge: '5 VIP' },
    { id: 'games', label: 'Oʻyinlar', icon: Layers },
    { id: 'pricing', label: 'Narxlar & Aksiyalar', icon: Flame, highlight: true },
    { id: 'admin', label: 'Admin Panel', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-indigo-600 p-[2px] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-cyber font-black text-2xl tracking-tighter bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                C
              </span>
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur-xs opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-cyber font-black tracking-wider text-xl text-white group-hover:text-emerald-400 transition-colors">
                CYBER<span className="text-emerald-400">CLUB</span>
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                UZB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-medium">
              Next-Gen Gaming Lounge
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>

                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side: Live indicator & Selected stations cart */}
        <div className="flex items-center gap-3">
          {/* Socket status */}
          <div
            title={isConnected ? 'Server bilan real-vaqtda bogʻlangan' : 'Ulanmoqda...'}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-slate-900 border border-slate-800"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          {/* Floating Cart Trigger if stations selected */}
          {selectedStations.length > 0 && (
            <div className="flex items-center gap-2 animate-in zoom-in-95 duration-200">
              <button
                onClick={() => openModalWithStations(selectedStations)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all transform hover:-translate-y-0.5"
              >
                <span className="w-5 h-5 rounded-full bg-slate-950 text-emerald-400 text-xs flex items-center justify-center font-black">
                  {selectedStations.length}
                </span>
                <span>Bron qilish</span>
                {selectedStations.length >= 5 && (
                  <span className="hidden lg:inline text-[10px] bg-slate-950/20 px-1 rounded uppercase">
                    +1h Bonus
                  </span>
                )}
              </button>
              <button
                onClick={clearSelection}
                title="Tozalash"
                className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg transition-colors"
              >
                Bekor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav pills */}
      <div className="md:hidden flex items-center gap-1 px-3 pb-3 overflow-x-auto no-scrollbar border-t border-slate-900/60 pt-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-300'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default Navbar;
