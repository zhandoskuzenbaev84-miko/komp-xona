import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { StationBadge } from '../common/StationBadge';
import { Monitor, Cpu, Sparkles, Check, Info, Users } from 'lucide-react';

export const PCGrid = ({ stations = [], onSelectStation }) => {
  const { selectedStations, toggleStation, openModalWithStations } = useBooking();
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [hoveredStation, setHoveredStation] = useState(null);

  const zones = [
    { id: 'ALL', label: 'Barcha Kompyuterlar (50)', count: stations.length },
    {
      id: 'Standard Hall',
      label: 'Standard Hall (PC 01-20)',
      desc: 'RTX 4060 Ti • 180Hz IPS',
      count: stations.filter((s) => s.zone === 'Standard Hall').length,
    },
    {
      id: 'VIP Hall',
      label: 'VIP Hall (PC 21-40)',
      desc: 'RTX 4070 Ti Super • 360Hz Fast TN',
      count: stations.filter((s) => s.zone === 'VIP Hall').length,
    },
    {
      id: 'Esports Tournament Zone',
      label: 'Esports Zone (PC 41-50)',
      desc: 'RTX 4080 Super • 240Hz OLED',
      count: stations.filter((s) => s.zone === 'Esports Tournament Zone').length,
    },
  ];

  const filteredStations = stations.filter((s) => {
    if (selectedZone === 'ALL') return true;
    return s.zone === selectedZone;
  });

  // Quick action: Select 5 available PCs for 5v5 team match
  const handleSelectTeam5 = () => {
    const available = stations.filter(
      (s) => s.status === 'AVAILABLE' && !selectedStations.some((sel) => sel.id === s.id)
    );
    const toAdd = available.slice(0, 5);
    if (toAdd.length > 0) {
      openModalWithStations([...selectedStations, ...toAdd]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone filter tabs & team quick button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-wrap gap-2">
          {zones.map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedZone === z.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
              }`}
            >
              <span>{z.label}</span>
            </button>
          ))}
        </div>

        {/* 5v5 team match fast selector */}
        <button
          onClick={handleSelectTeam5}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all"
        >
          <Users className="w-4 h-4 text-indigo-400" />
          <span>5v5 Jamoa Tanlash (5 ta PC + 1h Bonus)</span>
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-500/30 border border-emerald-500" />
          <span>🟢 Boʻsh (Available)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-rose-500/30 border border-rose-500" />
          <span>🔴 Band (Occupied)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-cyan-500/30 border border-cyan-500" />
          <span>🔵 Tanlangan (Selected)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-amber-500/30 border border-amber-500" />
          <span>🟡 Texnik xizmat (Maintenance)</span>
        </div>
      </div>

      {/* 50-Unit Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-3">
        {filteredStations.map((pc) => {
          const isSelected = selectedStations.some((s) => s.id === pc.id);
          const isOccupied = pc.status === 'OCCUPIED';
          const isMaintenance = pc.status === 'MAINTENANCE';
          const isAvailable = pc.status === 'AVAILABLE';

          let cardStyle = 'border-slate-800 bg-slate-900/60 hover:border-slate-700';

          if (isSelected) {
            cardStyle = 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-500/50';
          } else if (isAvailable) {
            cardStyle = 'border-emerald-500/30 bg-emerald-950/15 hover:border-emerald-400/60 hover:bg-emerald-950/25 cursor-pointer';
          } else if (isOccupied) {
            cardStyle = 'border-rose-500/30 bg-rose-950/20 opacity-80 cursor-not-allowed';
          } else if (isMaintenance) {
            cardStyle = 'border-amber-500/30 bg-amber-950/20 opacity-60 cursor-not-allowed';
          }

          let specs = {};
          try {
            specs = typeof pc.specs === 'string' ? JSON.parse(pc.specs) : pc.specs;
          } catch (e) {
            specs = {};
          }

          return (
            <div
              key={pc.id}
              onClick={() => {
                if (isAvailable || isSelected) {
                  toggleStation(pc);
                }
              }}
              onMouseEnter={() => setHoveredStation(pc)}
              onMouseLeave={() => setHoveredStation(null)}
              className={`relative p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${cardStyle}`}
            >
              {/* Top Header */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-cyber font-bold text-sm tracking-wide text-white group-hover:text-emerald-400 transition-colors">
                  {pc.code}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected
                      ? 'bg-cyan-400 animate-pulse'
                      : isAvailable
                      ? 'bg-emerald-400'
                      : isOccupied
                      ? 'bg-rose-500'
                      : 'bg-amber-400'
                  }`}
                />
              </div>

              {/* Icon & Center Info */}
              <div className="my-1 flex items-center justify-center py-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : isAvailable
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : isOccupied
                      ? 'bg-rose-500/10 text-rose-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}
                >
                  <Monitor className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom Specs / Rate */}
              <div className="mt-1 pt-2 border-t border-slate-800/60 text-center">
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {specs.gpu ? specs.gpu.split(' ')[1] || 'RTX' : 'RTX'}
                </p>
                <p className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                  10K <span className="text-[9px] font-normal text-slate-400">soat</span>
                </p>
              </div>

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hovered Details Footer Bar */}
      {hoveredStation && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-150">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cyber font-bold text-lg text-white">
                {hoveredStation.code} - {hoveredStation.name}
              </span>
              <StationBadge status={hoveredStation.status} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {hoveredStation.zone} • {hoveredStation.amenities}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Tarif:</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                10,000 UZS / soat (2 soat = 17,000 UZS)
              </span>
            </div>
            {hoveredStation.status === 'AVAILABLE' && (
              <button
                onClick={() => toggleStation(hoveredStation)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                {selectedStations.some((s) => s.id === hoveredStation.id)
                  ? 'Tanlovdan oʻchirish'
                  : 'Tanlash'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PCGrid;
