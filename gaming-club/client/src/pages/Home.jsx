import React, { useState, useEffect } from 'react';
import { fetchAllStations, fetchGames } from '../services/api';
import { useSocket } from '../context/SocketContext';
import {
  Monitor,
  Gamepad2,
  Sparkles,
  Flame,
  ShieldCheck,
  ChevronRight,
  Zap,
  Users,
  Award,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';

export const Home = ({ setActiveTab }) => {
  const { socket } = useSocket();
  const [stations, setStations] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHomeData = async () => {
    try {
      const [stRes, gmRes] = await Promise.all([
        fetchAllStations(),
        fetchGames({ popularOnly: 'true' }),
      ]);
      if (stRes.success) setStations(stRes.data);
      if (gmRes.success) setPopularGames(gmRes.data.slice(0, 6));
    } catch (err) {
      console.error('Home load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('station:reserved', loadHomeData);
    socket.on('station:released', loadHomeData);
    return () => {
      socket.off('station:reserved', loadHomeData);
      socket.off('station:released', loadHomeData);
    };
  }, [socket]);

  const pcStations = stations.filter((s) => s.type === 'PC');
  const psStations = stations.filter((s) => s.type === 'PS5');

  const pcAvailable = pcStations.filter((s) => s.status === 'AVAILABLE').length;
  const psAvailable = psStations.filter((s) => s.status === 'AVAILABLE').length;

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Cyber Neon Background Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-600/20 via-cyan-500/20 to-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 px-4">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 font-medium shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Toshkentdagi Eng Kuchli Esports Majmuasi</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-mono font-bold">24/7 Ochiq</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-cyber font-black tracking-tight text-white leading-tight">
            NEXT-GEN <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              GAMING ARENA
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
            50 ta professional RTX 4080/4070 kompyuterlari va 5 ta hashamatli VIP PlayStation 5 zallari.
            Joyni real-vaqtda tanlang, band qiling va maksimal zavq oling.
          </p>

          {/* Real-time Availability Counter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Monitor className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-xs text-slate-400">PC Hall</span>
                  <p className="font-cyber font-bold text-white text-sm">50 Kompyuter</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 font-mono font-bold block">
                  {pcAvailable} / 50 BOʻSH
                </span>
                <span className="text-[10px] text-slate-400">10,000 UZS/h</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-xs text-slate-400">VIP PS5 Lounge</span>
                  <p className="font-cyber font-bold text-white text-sm">5 VIP Xona</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-indigo-400 font-mono font-bold block">
                  {psAvailable} / 5 BOʻSH
                </span>
                <span className="text-[10px] text-slate-400">45,000 UZS/h</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('pc')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-cyber font-bold text-sm tracking-wider uppercase shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              <span>50 PC Zali Floor Plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('ps')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-white font-cyber font-bold text-sm tracking-wider uppercase border border-slate-700 hover:border-indigo-500/60 shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 text-indigo-400" />
              <span>VIP PS5 Lounge Zallari</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Special Offer / Perks Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase font-mono">
                <Flame className="w-4 h-4" />
                <span>Maxsus Jamoaviy Aksiya</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-cyber font-bold text-white">
                5+ Kompyuter Band Qiling — <span className="text-emerald-400">+1 Soat BEPUL</span> Oling!
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                Doʻstlaringiz bilan 5v5 CS2, Dota 2 yoki Valorant jamoaviy mashgʻuloti uyushtiring.
                Tizim avtomatik ravishda barcha band qilingan kompyuterlarga 1 soat bepul oʻyin vaqti sovgʻa qiladi!
              </p>
            </div>

            <div className="text-center md:text-right">
              <button
                onClick={() => setActiveTab('pricing')}
                className="px-6 py-3.5 rounded-xl bg-white text-slate-950 font-cyber font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors shadow-lg"
              >
                Tariflar Jadvalini Koʻrish
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
            Klub Afzalliklari
          </span>
          <h2 className="text-3xl font-cyber font-bold text-white">
            Nega Aynan CYBERCLUB?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-cyber font-bold text-lg text-white">RTX 4080 Super & 360Hz</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ZOWIE 360Hz va OLED 240Hz monitorlar, har bir kadrda mutlaq silliqlik va nol kirish kechikishi.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-cyber font-bold text-lg text-white">4x DualSense PS5 VIP</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              65" 4K 120Hz OLED ekranlar, 4 ta simsiz geympad, sovutish tizimi va qulay yumshoq divanlar.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-cyber font-bold text-lg text-white">20+ Oʻrnatilgan Oʻyinlar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              CS2, FC 25, Dota 2, Mortal Kombat 1, GTA V, UFC 5, Tekken 8 va boshqa soʻnggi xitlar toʻliq tayyor.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-cyber font-bold text-lg text-white">12+ Yosh Nazorati</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tartib-intizom, xavfsizlik va sokin professional esports muhitini saqlash uchun 12+ qoidasi.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Games Highlights */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              Top Oʻyinlar Katalogi
            </span>
            <h2 className="text-3xl font-cyber font-bold text-white">
              Eng Mashhur Oʻyinlar
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('games')}
            className="flex items-center gap-2 text-xs font-cyber font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Barcha Oʻyinlarni Koʻrish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {popularGames.map((game) => (
            <div
              key={game.id}
              className="group rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                    {game.platform}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-slate-300 text-[10px] font-medium border border-white/10">
                    {game.genre}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {game.title}
                  </h3>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    ★ {game.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono">
                  Joylashuv: {game.installedOn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
