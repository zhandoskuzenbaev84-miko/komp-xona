import React from 'react';
import { MapPin, Phone, Clock, ShieldCheck, Gamepad2, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-cyber font-black tracking-wider text-xl text-white">
                CYBER<span className="text-emerald-400">CLUB</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Toshkentdagi eng zamonaviy kompyuter va PlayStation 5 lounge majmuasi. 50 ta kuchli RTX 4080/4070 PC va 5 ta hashamatli VIP zal.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>24/7 Xizmat koʻrsatish markazi</span>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-cyber font-bold tracking-wider text-slate-200 uppercase">
              Aloqa & Manzil
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Toshkent sh., Chilonzor tumani, Bunyodkor shoh koʻchasi, 42-uy</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-mono text-slate-200">+998 (71) 200-00-00</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Har kuni: 24 soat toʻxtovsiz (Non-stop)</span>
              </li>
            </ul>
          </div>

          {/* Pricing Highlight */}
          <div className="space-y-3">
            <h4 className="text-sm font-cyber font-bold tracking-wider text-slate-200 uppercase">
              Qulay Tariflar
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span>PC 1 soat</span>
                <span className="text-white font-mono font-bold">10,000 UZS</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span>PC 2 soat blok</span>
                <span className="text-emerald-400 font-mono font-bold">17,000 UZS</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span>PS5 VIP 1 soat</span>
                <span className="text-white font-mono font-bold">45,000 UZS</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span>PS5 2 soat blok</span>
                <span className="text-emerald-400 font-mono font-bold">80,000 UZS</span>
              </div>
            </div>
          </div>

          {/* Club Rules & Age */}
          <div className="space-y-3">
            <h4 className="text-sm font-cyber font-bold tracking-wider text-slate-200 uppercase">
              Klub Qoidalari
            </h4>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Yosh chegarasi: 12+</span>
              </div>
              <p className="text-slate-400 leading-snug">
                Klubga kirish va kompyuterlarni band qilish uchun eng kam yosh 12 yosh etib belgilangan.
              </p>
              <div className="pt-1 text-[11px] text-emerald-400 font-medium">
                ⚡ 5+ kompyuter band qilganda: +1 soat BEPUL bonus!
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 CYBERCLUB UZB. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Premium Esports Arena
            </span>
            <span>Real-time WebSocket Sync</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
