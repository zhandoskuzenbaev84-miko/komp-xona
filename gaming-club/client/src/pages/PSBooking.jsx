import React, { useState, useEffect } from 'react';
import { fetchStationsByType } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { PSLoungeCard } from '../components/ps/PSLoungeCard';
import { Gamepad2, Sparkles, RefreshCw, Trophy, Crown } from 'lucide-react';

export const PSBooking = () => {
  const { socket } = useSocket();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRooms = async () => {
    try {
      setRefreshing(true);
      const res = await fetchStationsByType('PS5');
      if (res.success) {
        setRooms(res.data);
      }
    } catch (err) {
      console.error('Failed to load PS5 rooms:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // Real-time synchronization
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      loadRooms();
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <Crown className="w-4 h-4" />
            <span>VIP PlayStation 5 Lounge Suites</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-cyber font-bold text-white">
            VIP PS5 Zallari (5 Hashamatli Xona)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Har bir VIP zalda: Sony PS5, 4 ta simsiz DualSense pulti, 65" 4K 120Hz displey, konditsioner va yumshoq charm divanlar.
          </p>
        </div>

        <button
          onClick={loadRooms}
          disabled={refreshing}
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 self-start md:self-auto"
          title="Yangilash"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 5 Distinct VIP Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-sm">5 ta VIP PS5 zallari yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <PSLoungeCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PSBooking;
