import React from 'react';
import { useSocket } from '../../context/SocketContext';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useSocket();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-cyan-500/30 bg-slate-900/95 text-cyan-200';
        let Icon = Info;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/40 bg-slate-900/95 text-emerald-300';
          Icon = CheckCircle;
        } else if (toast.type === 'warning') {
          borderClass = 'border-rose-500/40 bg-slate-900/95 text-rose-300';
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${borderClass}`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
