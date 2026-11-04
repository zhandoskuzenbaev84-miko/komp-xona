import React, { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useSocket } from '../../context/SocketContext';
import { apiCreateBooking, apiCalculatePricing, apiCheckAvailability } from '../../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  Clock,
  Calendar,
  User,
  Phone,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Ticket,
  ChevronRight,
  Flame,
} from 'lucide-react';

export const MultiStationBookingModal = () => {
  const { selectedStations, isModalOpen, closeModal, clearSelection } = useBooking();
  const { addToast } = useSocket();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998');
  const [customerAge, setCustomerAge] = useState('');
  const [notes, setNotes] = useState('');
  const [hours, setHours] = useState(2); // default 2-hour combo
  const [startTime, setStartTime] = useState(() => {
    // Current time formatted for datetime-local
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  // UI status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successBooking, setSuccessBooking] = useState(null);
  const [pricingData, setPricingData] = useState(null);

  // Dynamic pricing calculation request whenever stations or hours change
  useEffect(() => {
    if (!isModalOpen || selectedStations.length === 0) return;

    let isMounted = true;
    const fetchPricing = async () => {
      try {
        const res = await apiCalculatePricing({
          stationIds: selectedStations.map((s) => s.id),
          requestedHours: hours,
        });
        if (isMounted && res.success) {
          setPricingData(res.data);
        }
      } catch (err) {
        console.error('Pricing calculation error:', err);
      }
    };

    fetchPricing();
    return () => {
      isMounted = false;
    };
  }, [isModalOpen, selectedStations, hours]);

  if (!isModalOpen || selectedStations.length === 0) return null;

  // Phone input mask / handler
  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998';
    }
    // Only allow digits after +
    const cleanDigits = val.replace(/[^\d+]/g, '');
    if (cleanDigits.length <= 13) {
      setCustomerPhone(cleanDigits);
    }
  };

  // Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Frontend validation according to business rules:
    const ageNum = parseInt(customerAge, 10);
    if (isNaN(ageNum)) {
      setErrorMsg('Iltimos, yoshingizni kiriting.');
      return;
    }
    if (ageNum < 12) {
      setErrorMsg('Minimum allowable age is 12 years old.');
      return;
    }

    if (!/^\+998\d{9}$/.test(customerPhone)) {
      setErrorMsg('Telefon raqami toʻliq va Oʻzbekiston formatida boʻlishi kerak (+998901234567).');
      return;
    }

    if (!customerName || customerName.trim().length < 2) {
      setErrorMsg('Iltimos, toʻliq ismingizni kiriting.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        stationIds: selectedStations.map((s) => s.id),
        customerName: customerName.trim(),
        customerPhone,
        customerAge: ageNum,
        requestedHours: hours,
        startTime: new Date(startTime).toISOString(),
        notes: notes.trim(),
      };

      const res = await apiCreateBooking(payload);

      if (res.success) {
        setSuccessBooking(res.data);
        addToast('🎉 Joy muvaffaqiyatli band qilindi!', 'success');

        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Bron qilishda xatolik yuz berdi.';
      setErrorMsg(msg);
      addToast(msg, 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    clearSelection();
    setSuccessBooking(null);
    closeModal();
  };

  const isBulkDiscount = selectedStations.length >= 5;
  const totalDuration = hours + (isBulkDiscount ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CyberClub Instant Booking Engine</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-cyber font-bold text-white">
            {successBooking ? 'Bron Tasdiqlandi!' : 'Joyni Band Qilish'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {selectedStations.length} ta joy tanlandi • Haqiqiy vaqt rejimida avtomatik narx hisoblash
          </p>
        </div>

        {/* Content */}
        {successBooking ? (
          /* Success Ticket Voucher */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">
                  Buyurtma Raqami
                </span>
                <h4 className="text-3xl font-cyber font-black tracking-wider text-white mt-1">
                  {successBooking.reservation.bookingCode}
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-left text-xs">
                <div>
                  <span className="text-slate-400">Mijoz:</span>
                  <p className="font-semibold text-white truncate">
                    {successBooking.reservation.customerName}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Telefon:</span>
                  <p className="font-semibold text-white font-mono">
                    {successBooking.reservation.customerPhone}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Davomiyligi:</span>
                  <p className="font-semibold text-emerald-400">
                    {successBooking.reservation.totalDurationHours} soat
                    {successBooking.reservation.bonusHours > 0 && ' (+1h bonus)'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Boshlanish:</span>
                  <p className="font-semibold text-white">
                    {new Date(successBooking.reservation.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Tugash vaqti:</span>
                  <p className="font-semibold text-white">
                    {new Date(successBooking.reservation.endTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Toʻlov summasi:</span>
                  <p className="font-semibold text-emerald-400 font-mono text-sm">
                    {successBooking.reservation.totalAmount?.toLocaleString()} UZS
                  </p>
                </div>
              </div>

              {/* Station badges */}
              <div className="pt-2 flex flex-wrap gap-2 justify-center">
                {selectedStations.map((st) => (
                  <span
                    key={st.id}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-cyan-300"
                  >
                    {st.code}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleFinish}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                Tayyor! Asosiy oynaga qaytish
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Selected Stations Pills */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Tanlangan Kompyuter / Xonalar:</span>
                <span className="text-cyan-400 font-mono">{selectedStations.length} ta</span>
              </label>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                {selectedStations.map((st) => (
                  <span
                    key={st.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold"
                  >
                    <span>{st.code}</span>
                    <span className="text-[10px] text-slate-400">({st.type})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Hours Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Oʻyin Vaqti (Soat):</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold">{hours} soat</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 8].map((h) => {
                  const isSelected = hours === h;
                  const hasDiscount = h >= 2;
                  return (
                    <button
                      type="button"
                      key={h}
                      onClick={() => setHours(h)}
                      className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/20'
                          : 'bg-slate-850/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base font-cyber">{h}h</span>
                      {hasDiscount && (
                        <span className="text-[9px] text-emerald-400 font-normal">
                          {h % 2 === 0 ? 'Chegirma' : 'Tarif'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start Time Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Boshlanish Vaqti:</span>
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            {/* Customer Information (Name, Phone, Age) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Full Name */}
              <div className="sm:col-span-1 space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ism-Sharif</span>
                </label>
                <input
                  type="text"
                  placeholder="Jasur Rahimov"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Phone */}
              <div className="sm:col-span-1 space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Telefon (+998...)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+998901234567"
                  value={customerPhone}
                  onChange={handlePhoneChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Age (12+) */}
              <div className="sm:col-span-1 space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Yoshingiz</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">12+</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Masalan: 18"
                  value={customerAge}
                  onChange={(e) => setCustomerAge(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border text-sm text-slate-100 focus:outline-none transition-colors ${
                    customerAge && parseInt(customerAge, 10) < 12
                      ? 'border-rose-500 text-rose-300'
                      : 'border-slate-800 focus:border-emerald-500'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Age restriction alert banner if age < 12 */}
            {customerAge && parseInt(customerAge, 10) < 12 && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Minimum allowable age is 12 years old. Klubga 12 yoshdan kichiklar qabul qilinmaydi.</span>
              </div>
            )}

            {/* Bulk perk highlight banner if >= 5 stations */}
            {isBulkDiscount && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-emerald-300 block">
                    Jamoaviy Aksiya Faollashdi (5+ Joy)!
                  </span>
                  <span className="text-slate-300">
                    Barcha {selectedStations.length} ta joyga{' '}
                    <strong className="text-emerald-400 font-bold">+1 Soat BEPUL bonus</strong> qoʻshildi!
                    Jami {totalDuration} soat oʻynaysiz, faqat {hours} soat uchun toʻlaysiz.
                  </span>
                </div>
              </div>
            )}

            {/* Dynamic Price Breakdown Summary Card */}
            {pricingData && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Asosiy qiymat ({selectedStations.length} joy × {hours} soat):</span>
                  <span className="font-mono">{pricingData.basePrice.toLocaleString()} UZS</span>
                </div>

                {pricingData.tieredDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>2-soatlik blok chegirmasi (Har 2 soatga tejaldi):</span>
                    <span className="font-mono">-{pricingData.tieredDiscount.toLocaleString()} UZS</span>
                  </div>
                )}

                {pricingData.bonusHours > 0 && (
                  <div className="flex justify-between text-cyan-400 font-medium">
                    <span>5+ Kompyuter Bonusi (+1 Soat BEPUL):</span>
                    <span className="font-mono">BEPUL (+1h)</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-cyber font-bold text-white text-base">Toʻlanadigan Summa:</span>
                    <span className="block text-[11px] text-slate-400">
                      Jami vaqt: {pricingData.totalDurationHours} soat ({hours} soat toʻlov + {pricingData.bonusHours} soat bonus)
                    </span>
                  </div>
                  <span className="text-xl font-cyber font-black text-emerald-400 font-mono">
                    {pricingData.finalPrice.toLocaleString()} UZS
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading || (customerAge && parseInt(customerAge, 10) < 12)}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-cyber font-bold text-sm shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Bronni Tasdiqlash</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MultiStationBookingModal;
