import React, { useState, useEffect } from 'react';
import { fetchGames } from '../services/api';
import { Search, Filter, Gamepad2, Monitor, Star, Check } from 'lucide-react';

export const GamesLibrary = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState('ALL');
  const [genre, setGenre] = useState('ALL');
  const [search, setSearch] = useState('');

  const genres = [
    'ALL',
    'FPS / Shooter',
    'Sports & Football',
    'MOBA',
    'Action & Story',
    'Fighting',
    'Racing & Simulator',
    'Battle Royale',
  ];

  const loadGames = async () => {
    try {
      setLoading(true);
      const res = await fetchGames({ platform, genre, search });
      if (res.success) {
        setGames(res.data);
      }
    } catch (err) {
      console.error('Failed to load games:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadGames();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [platform, genre, search]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
          Installed Titles Catalog
        </span>
        <h1 className="text-2xl sm:text-4xl font-cyber font-bold text-white">
          Oʻyinlar Kutubxonasi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          Barcha 50 ta kompyuter va 5 ta PS5 VIP xonalarida oldindan oʻrnatilgan, yangilangan va eng yuqori FPS bilan ishlaydigan oʻyinlar.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Oʻyin nomini qidiring (masalan: CS2, FC 25, GTA V)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Platform Filter Buttons */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
            {[
              { id: 'ALL', label: 'Barchasi' },
              { id: 'PC', label: 'Faqat PC' },
              { id: 'PS5', label: 'Faqat PS5' },
              { id: 'BOTH', label: 'PC & PS5' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  platform === p.id
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                genre === g
                  ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Games Catalog Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-sm">Oʻyinlar katalogi yuklanmoqda...</p>
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-20 text-slate-500 font-mono text-sm">
          Mos keluvchi oʻyin topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="group rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                    {game.platform}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-slate-300 text-[10px] font-medium border border-white/10">
                    {game.genre}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {game.title}
                  </h3>
                  <span className="text-xs font-mono text-amber-400 font-bold shrink-0">
                    ★ {game.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono border-t border-slate-800">
                  {game.installedOn}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesLibrary;
