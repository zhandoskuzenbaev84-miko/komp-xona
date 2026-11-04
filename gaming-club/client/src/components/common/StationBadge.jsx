import React from 'react';

export const StationBadge = ({ status, isSelected = false, className = '' }) => {
  if (isSelected) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        Tanlandi (Selected)
      </span>
    );
  }

  switch (status) {
    case 'AVAILABLE':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Boʻsh (Available)
        </span>
      );
    case 'OCCUPIED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          Band (Occupied)
        </span>
      );
    case 'MAINTENANCE':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Servis (Maintenance)
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 ${className}`}>
          {status}
        </span>
      );
  }
};

export default StationBadge;
