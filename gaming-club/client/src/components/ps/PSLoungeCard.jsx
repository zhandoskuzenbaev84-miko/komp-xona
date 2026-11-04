import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { StationBadge } from '../common/StationBadge';
import {
  Gamepad2,
  Tv,
  Wind,
  Armchair,
  Sparkles,
  Users2,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const PSLoungeCard = ({ room }) => {
  const { openModalWithSingleStation } = useBooking();

  const isAvailable = room.status === 'AVAILABLE';

  let specs = {};
  try {
    specs = typeof room.specs === 'string' ? JSON.parse(room.specs) : room.specs;
  } catch (e) {
    specs = {};
  }

  return (
    <div className="relative group rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 hover:border-indigo-500/50 p-6 sm:p-8 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between">
      {/* Background Neon Accent Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-all" />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-cyber font-black text-xl tracking-wider text-white group-hover:text-indigo-400 transition-colors">
              {room.code}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
              VIP LOUNGE
            </span>
          </div>

          <StationBadge status={room.status} />
        </div>

        {/* Room Title & Description */}
        <h3 className="text-lg font-bold text-slate-100 mb-2">{room.name}</h3>

        {/* 4 Mandatory VIP Amenities Badges */}
        <div className="grid grid-cols-2 gap-2 my-5">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
            <Gamepad2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-medium">PS5 Console</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
            <Users2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-medium">4x DualSense</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
            <Tv className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">4K 120Hz Display</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
            <Wind className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-medium">Air Conditioner (AC)</span>
          </div>
        </div>

        {/* Additional Specs Detail */}
        <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 mb-6 space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Armchair className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-medium">Premium Sofa Lounge & Mini-bar</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            {specs.display || 'LG OLED 65" 4K 120Hz'} • {specs.audio || 'Dolby Atmos Soundbar'}
          </p>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-xs text-slate-400">Standart narx:</span>
            <div className="text-xl font-cyber font-bold text-white">
              45,000 <span className="text-xs font-normal text-slate-400">UZS / soat</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-emerald-400 font-medium">
              2 soatlik blok (10K tejaladi)
            </span>
            <div className="text-base font-cyber font-bold text-emerald-400 font-mono">
              80,000 UZS
            </div>
          </div>
        </div>

        <button
          onClick={() => openModalWithSingleStation(room)}
          disabled={!isAvailable}
          className={`w-full py-3.5 rounded-2xl font-cyber font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
            isAvailable
              ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white shadow-indigo-500/20 transform hover:-translate-y-0.5'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          {isAvailable ? (
            <>
              <span>VIP Xonani Band Qilish</span>
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <span>Hozirda Band</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default PSLoungeCard;
