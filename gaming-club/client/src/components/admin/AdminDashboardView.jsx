import React, { useState, useEffect } from 'react';
import {
  fetchDashboardStats,
  apiToggleMaintenance,
  apiGetAllBookings,
  apiCancelBooking,
} from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { StationBadge } from '../common/StationBadge';
import {
  ShieldCheck,
  Monitor,
  Gamepad2,
  DollarSign,
  Users,
  Wrench,
  Search,
  Filter,
  RefreshCw,
  XCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Check,
} from 'lucide-react';

export const AdminDashboardView = () => {
  const { socket, addToast } = useSocket();

  const [statsData, setStatsData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'reservations'
  const [stationTypeFilter, setStationTypeFilter] = useState('ALL'); // 'ALL' | 'PC' | 'PS5'
  const [resStatusFilter, setResStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, bookingsRes] = await Promise.all([
        fetchDashboardStats(),
        apiGetAllBookings({ status: resStatusFilter, search: searchQuery }),
      ]);

      if (statsRes.success) {
        setStatsData(statsRes);
      }
      if (bookingsRes.success) {
        setReservations(bookingsRes.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('cyberclub_admin_token');
        localStorage.removeItem('cyberclub_admin_user');
        window.location.reload();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [resStatusFilter]);

  // Real-time synchronization
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      loadData();
    };

    socket.on('station:reserved', handleUpdate);
    socket.on('station:released', handleUpdate);
    socket.on('station:status_updated', handleUpdate);
    socket.on('reservation:created', handleUpdate);
    socket.on('reservation:cancelled', handleUpdate);

    return () => {
      socket.off('station:reserved', handleUpdate);
      socket.off('station:released', handleUpdate);
      socket.off('station:status_updated', handleUpdate);
      socket.off('reservation:created', handleUpdate);
      socket.off('reservation:cancelled', handleUpdate);
    };
  }, [socket, resStatusFilter, searchQuery]);

  // Toggle maintenance lock
  const handleToggleMaintenance = async (station) => {
    try {
      const res = await apiToggleMaintenance(station.id);
      if (res.success) {
        addToast(res.message, 'info');
        loadData();
      }
    } catch (err) {
      addToast(err.response?.data?.error || err.message, 'warning');
    }
  };

  // Cancel reservation
  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Haqiqatdan ham ushbu bronni bekor qilmoqchimisiz?')) return;

    try {
      const res = await apiCancelBooking(reservationId);
      if (res.success) {
        addToast('Bron bekor qilindi va joy boʻshatildi.', 'success');
        loadData();
      }
    } catch (err) {
      addToast(err.response?.data?.error || err.message, 'warning');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-sm">Admin boshqaruv paneli yuklanmoqda...</p>
      </div>
    );
  }

  const stations = statsData?.stations || [];
  const stats = statsData?.stats || {};

  const filteredStations = stations.filter((st) => {
    if (stationTypeFilter === 'ALL') return true;
    return st.type === stationTypeFilter;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-time Operational Command Center</span>
          </div>
          <h2 className="text-2xl font-cyber font-bold text-white">
            CyberClub Yagona Boshqaruv Portali
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            50 ta kompyuter va 5 ta PS5 VIP xonalarining jonli nazorati va bronlar jurnali
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stations */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Jami Joylar</span>
            <div className="text-2xl font-cyber font-bold text-white mt-1">
              {stats.stations?.total || 55}
            </div>
            <span className="text-[11px] text-slate-400">
              50 PC + 5 PS5 VIP
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Monitor className="w-6 h-6" />
          </div>
        </div>

        {/* Occupied & Occupancy Rate */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Band Joylar</span>
            <div className="text-2xl font-cyber font-bold text-rose-400 mt-1">
              {stats.stations?.occupied || 0}
            </div>
            <span className="text-[11px] text-slate-400">
              Bandlik: {stats.stations?.occupancyRate || 0}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Bugungi Tushum</span>
            <div className="text-2xl font-cyber font-bold text-emerald-400 mt-1">
              {(stats.financials?.todayRevenue || 0).toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">UZS</span>
            </div>
            <span className="text-[11px] text-emerald-400/80">
              +{stats.financials?.todayBookingsCount || 0} ta buyurtma
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Maintenance Locked */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Texnik Xizmatda</span>
            <div className="text-2xl font-cyber font-bold text-amber-400 mt-1">
              {stats.stations?.maintenance || 0}
            </div>
            <span className="text-[11px] text-slate-400">Qulflangan joylar</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs: Live Status Board vs Reservations Log */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('live')}
          className={`pb-4 px-6 text-sm font-cyber font-bold border-b-2 transition-all ${
            activeTab === 'live'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Jonli Joylar Holati (55 Ta)
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-4 px-6 text-sm font-cyber font-bold border-b-2 transition-all ${
            activeTab === 'reservations'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Bronlar Jurnali & Boshqaruv ({reservations.length})
        </button>
      </div>

      {/* TAB 1: LIVE STATUS BOARD */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          {/* Subfilter */}
          <div className="flex items-center gap-2">
            {['ALL', 'PC', 'PS5'].map((t) => (
              <button
                key={t}
                onClick={() => setStationTypeFilter(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  stationTypeFilter === t
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'ALL' ? 'Barchasi (55)' : t === 'PC' ? '50 PC Hall' : '5 PS5 Lounge'}
              </button>
            ))}
          </div>

          {/* Grid of all stations */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
            {filteredStations.map((st) => {
              const isOccupied = st.status === 'OCCUPIED';
              const isMaintenance = st.status === 'MAINTENANCE';
              const isPS = st.type === 'PS5';

              return (
                <div
                  key={st.id}
                  className={`relative p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                    isOccupied
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : isMaintenance
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-emerald-950/15 border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-cyber font-bold text-xs text-white">
                      {st.code}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOccupied
                          ? 'bg-rose-400'
                          : isMaintenance
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                  </div>

                  <div className="my-2 text-center">
                    <span className="text-[10px] text-slate-400 block truncate">
                      {st.type} • {st.status}
                    </span>
                  </div>

                  {/* Maintenance toggle action */}
                  <button
                    onClick={() => handleToggleMaintenance(st)}
                    title={isMaintenance ? 'Qulfdan chiqarish' : 'Servisga yopish'}
                    className={`w-full py-1 text-[10px] font-semibold rounded-lg border transition-colors ${
                      isMaintenance
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-amber-400'
                    }`}
                  >
                    {isMaintenance ? 'Ochish' : 'Qulflash'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: RESERVATIONS LOG */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Kod, mijoz ismi yoki telefon boʻyicha qidiruv..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadData()}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setResStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    resStatusFilter === st
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Kod</th>
                  <th className="p-4">Mijoz (Ism / Tel / Yosh)</th>
                  <th className="p-4">Band Joylar</th>
                  <th className="p-4">Vaqt Oraligʻi</th>
                  <th className="p-4">Toʻlov / Chegirma</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500">
                      Bronlar mavjud emas.
                    </td>
                  </tr>
                ) : (
                  reservations.map((res) => {
                    const isActive = res.status === 'ACTIVE';

                    return (
                      <tr key={res.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 font-mono font-bold text-cyan-400">
                          {res.bookingCode}
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-white">{res.customerName}</p>
                          <p className="text-[11px] font-mono text-slate-400">
                            {res.customerPhone} • {res.customerAge} yosh
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {res.stations?.map((rs) => (
                              <span
                                key={rs.id}
                                className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] font-bold text-emerald-400"
                              >
                                {rs.station?.code || rs.stationId}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-[11px]">
                          <p className="text-white font-medium">
                            {new Date(res.startTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            -{' '}
                            {new Date(res.endTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <span className="text-slate-400">
                            {res.totalDurationHours} soat
                            {res.bonusHours > 0 && ' (+1h bonus)'}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-mono font-bold text-emerald-400">
                            {res.totalAmount?.toLocaleString()} UZS
                          </p>
                          {res.discountApplied > 0 && (
                            <span className="text-[10px] text-slate-400 block">
                              Chegirma: -{res.discountApplied.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              res.status === 'ACTIVE'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : res.status === 'COMPLETED'
                                ? 'bg-slate-800 text-slate-300'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {isActive && (
                            <button
                              onClick={() => handleCancelReservation(res.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[11px] font-medium transition-colors"
                            >
                              Bekor qilish
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardView;
