import React, { useState, useEffect } from 'react';
import { fetchStationsByType } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { PCGrid } from '../components/pc/PCGrid';
import { Monitor, RefreshCw, Sparkles, Flame } from 'lucide-react';

export const PCBooking = () => {
  const { socket } = useSocket();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStations = async () => {
    try {
      setRefreshing(true);
      const res = await fetchStationsByType('PC');
      if (res.success) {
        setStations(res.data);
      }
    } catch (err) {
      console.error('Failed to load PC stations:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  // Real-time synchronization for station reservations and releases
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      loadStations();
    };

    socket.on('station:reserved', handleUpdate);
    socket.on('station:released', handleUpdate);
    socket.on('station:status_updated', handleUpdate);

    return () => {
      socket.off('station:reserved', handleUpdate);
      socket.off('station:released', handleUpdate);
      socket.off('station:status_updated', handleUpdate);
    };
  }, [socket]);

  const availableCount = stations.filter((s) => s.status === 'AVAILABLE').length;
  const occupiedCount = stations.filter((s) => s.status === 'OCCUPIED').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Monitor className="w-4 h-4" />
            <span>Interactive Real-Time Floor Plan</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-cyber font-bold text-white">
            PC Zali (50 Kompyuter)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Bir vaqtning oʻzida bitta yoki bir nechta kompyuterni tanlang (5+ kompyuter tanlasangiz +1 soat BEPUL bonus beriladi).
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Boʻsh</span>
              <span className="text-emerald-400 font-cyber font-bold text-base">
                {availableCount}
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Band</span>
              <span className="text-rose-400 font-cyber font-bold text-base">
                {occupiedCount}
              </span>
            </div>
          </div>

          <button
            onClick={loadStations}
            disabled={refreshing}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            title="Yangilash"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main 50-Unit Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-sm">50 ta kompyuter holati yuklanmoqda...</p>
        </div>
      ) : (
        <PCGrid stations={stations} />
      )}
    </div>
  );
};

export default PCBooking;
