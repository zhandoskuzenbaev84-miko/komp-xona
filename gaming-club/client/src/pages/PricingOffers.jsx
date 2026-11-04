import React, { useState, useMemo } from 'react';
import {
  Flame,
  CheckCircle,
  ShieldCheck,
  Calculator,
  Monitor,
  Gamepad2,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';

export const PricingOffers = () => {
  // Interactive Calculator State
  const [calcType, setCalcType] = useState('PC'); // 'PC' | 'PS5'
  const [calcHours, setCalcHours] = useState(2);
  const [calcStationCount, setCalcStationCount] = useState(5);

  // Exact formula conforming strictly to Business Rules & Pricing Engine:
  // PC: (Math.floor(hours / 2) * 17000) + ((hours % 2) * 10000)
  // PS5: (Math.floor(hours / 2) * 80000) + ((hours % 2) * 45000)
  // If stations >= 5: +1 Hour FREE Bonus!
  const calcResult = useMemo(() => {
    const hours = Math.max(1, calcHours);
    const stations = Math.max(1, calcStationCount);

    let singleFinal = 0;
    let singleBase = 0;

    if (calcType === 'PC') {
      singleBase = hours * 10000;
      singleFinal = Math.floor(hours / 2) * 17000 + (hours % 2) * 10000;
    } else {
      singleBase = hours * 45000;
      singleFinal = Math.floor(hours / 2) * 80000 + (hours % 2) * 45000;
    }

    const singleDiscount = singleBase - singleFinal;
    const totalBase = singleBase * stations;
    const totalFinal = singleFinal * stations;
    const totalDiscount = singleDiscount * stations;

    const isBulkBonus = stations >= 5;
    const bonusHours = isBulkBonus ? 1 : 0;
    const totalDurationHours = hours + bonusHours;

    return {
      hours,
      stations,
      singleFinal,
      singleBase,
      singleDiscount,
      totalBase,
      totalFinal,
      totalDiscount,
      isBulkBonus,
      bonusHours,
      totalDurationHours,
    };
  }, [calcType, calcHours, calcStationCount]);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
          Transparent Pricing & Perks
        </span>
        <h1 className="text-2xl sm:text-4xl font-cyber font-bold text-white">
          Tariflar, Chegirmalar va Bonuslar
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          Hech qanday yashirin toʻlovlarsiz shaffof narxlar, blokli chegirmalar va 5+ kompyuterlar uchun jamoaviy bepul soat aksiyasi.
        </p>
      </div>

      {/* Main Pricing Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PC Hall Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-cyber font-bold text-white">PC Zali (50 Kompyuter)</h3>
                <span className="text-xs text-slate-400">Standard, VIP va Esports Tournament zonalari</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Eng Ommabop
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-sm font-bold text-white block">1 Soatlik Tarif</span>
                <span className="text-xs text-slate-400">Oddiy soatlik toʻlov</span>
              </div>
              <span className="text-lg font-cyber font-bold text-white">10,000 UZS</span>
            </div>

            <div className="flex justify-between items-center p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40">
              <div>
                <span className="text-sm font-bold text-emerald-300 block">2 Soatlik Blok (Tavsiya!)</span>
                <span className="text-xs text-emerald-400/80">Har 2 soatga 3,000 UZS tejaladi</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-cyber font-bold text-emerald-400">17,000 UZS</span>
                <span className="text-[11px] text-slate-400 line-through block">20,000 UZS</span>
              </div>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>RTX 4080 Super / RTX 4070 Ti Super grafik kartalari</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ZOWIE 360Hz & ROG OLED 240Hz monitorlar</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Formula: (Math.floor(h / 2) * 17000) + ((h % 2) * 10000)</span>
            </li>
          </ul>
        </div>

        {/* PS5 VIP Lounge Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-cyber font-bold text-white">VIP PS5 Lounge (5 Xona)</h3>
                <span className="text-xs text-slate-400">Alohida premium VIP kabinetlar</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              VIP Sharoit
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-sm font-bold text-white block">1 Soatlik Tarif</span>
                <span className="text-xs text-slate-400">Butun xona va 4 geympad uchun</span>
              </div>
              <span className="text-lg font-cyber font-bold text-white">45,000 UZS</span>
            </div>

            <div className="flex justify-between items-center p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/40">
              <div>
                <span className="text-sm font-bold text-indigo-300 block">2 Soatlik Blok (Tavsiya!)</span>
                <span className="text-xs text-indigo-400/80">Har 2 soatga 10,000 UZS tejaladi</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-cyber font-bold text-indigo-400">80,000 UZS</span>
                <span className="text-[11px] text-slate-400 line-through block">90,000 UZS</span>
              </div>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>1x PlayStation 5 + 4x DualSense Wireless Controller</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>65" 4K 120Hz Display, Air Conditioner (AC), Premium Sofa</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Formula: (Math.floor(h / 2) * 80000) + ((h % 2) * 45000)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Special Bulk 5+ Rule Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/40 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
          <Flame className="w-4 h-4 animate-pulse" />
          <span>Jamoaviy Bonus Qoidasi (Bulk / Team Booking)</span>
        </div>
        <h3 className="text-2xl font-cyber font-bold text-white">
          5 va Undan Koʻp Joy Band Qilganda: +1 Soat Bepul Bonus!
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          Agar mijoz bitta tranzaksiyada bir vaqtning oʻzida 5 yoki undan koʻp kompyuter yoki xonani band qilsa (masalan, 5v5 CS2 jamoasi):
          tizim barcha kompyuterlarga <strong>avtomatik ravishda +1 SOAT BEPUL BONUS</strong> taqdim etadi.
          Yaʼni mijoz faqat soʻragan vaqti uchun toʻlaydi, ammo 1 soat qoʻshimcha bepul oʻynaydi!
        </p>
      </div>

      {/* Interactive Dynamic Price Calculator Widget */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-cyber font-bold text-white">Interaktiv Narx Kalkulyatori</h3>
            <p className="text-xs text-slate-400">
              Istalgan parametrlar boʻyicha formulaning hisoblanishini jonli sinab koʻring
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          {/* Station Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Joy Turi:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCalcType('PC')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  calcType === 'PC'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                PC (10K / h)
              </button>
              <button
                type="button"
                onClick={() => setCalcType('PS5')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  calcType === 'PS5'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                PS5 VIP (45K / h)
              </button>
            </div>
          </div>

          {/* Requested Hours */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Oʻyin Vaqti (Soat):</span>
              <span className="text-emerald-400 font-bold">{calcHours} soat</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={calcHours}
              onChange={(e) => setCalcHours(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1h</span>
              <span>2h (blok)</span>
              <span>4h</span>
              <span>8h</span>
              <span>12h</span>
            </div>
          </div>

          {/* Station Count */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Joylar Soni:</span>
              <span className="text-cyan-400 font-bold">{calcStationCount} ta</span>
            </div>
            <input
              type="range"
              min="1"
              max={calcType === 'PC' ? 50 : 5}
              value={calcStationCount}
              onChange={(e) => setCalcStationCount(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1</span>
              <span className="text-emerald-400 font-bold">5+ (+1h bonus)</span>
              <span>{calcType === 'PC' ? '50 PC' : '5 VIP'}</span>
            </div>
          </div>
        </div>

        {/* Live Calculation Output Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Asosiy Qiymat:</span>
              <span className="font-mono text-slate-300 font-bold text-sm">
                {calcResult.totalBase.toLocaleString()} UZS
              </span>
            </div>

            <div>
              <span className="text-slate-400 block">2-Soatlik Tejalish:</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">
                -{calcResult.totalDiscount.toLocaleString()} UZS
              </span>
            </div>

            <div>
              <span className="text-slate-400 block">Jami Oʻynaladigan Vaqt:</span>
              <span className="font-mono text-cyan-400 font-bold text-sm">
                {calcResult.totalDurationHours} soat
                {calcResult.bonusHours > 0 && ' (+1h bonus)'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block">Toʻlov Summasi:</span>
              <span className="font-mono text-emerald-400 font-cyber font-black text-xl">
                {calcResult.totalFinal.toLocaleString()} UZS
              </span>
            </div>
          </div>

          {calcResult.isBulkBonus && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                🎉 5+ joy boʻlgani sababli barcha joylarga +1 soat BEPUL bonus qoʻshildi! Mijoz faqat {calcHours} soat uchun toʻlaydi.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Safety & Age Restriction Notice */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-cyber font-bold text-white text-base">
              Yosh Chegarasi & Tartib Qoidalari (12+)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Oʻzbekiston qonunchiligi va klub nizomiga muvofiq, mijozlarning minimal yoshi 12 yosh boʻlishi shart.
            </p>
          </div>
        </div>

        <span className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 font-cyber font-bold text-sm border border-amber-500/40 shrink-0">
          MINIMUM AGE: 12
        </span>
      </div>
    </div>
  );
};

export default PricingOffers;
