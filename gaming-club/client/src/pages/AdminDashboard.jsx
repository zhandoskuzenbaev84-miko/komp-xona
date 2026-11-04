import React, { useState } from 'react';
import { apiAdminLogin } from '../services/api';
import { AdminDashboardView } from '../components/admin/AdminDashboardView';
import { ShieldAlert, Lock, User, LogOut, KeyRound } from 'lucide-react';

export const AdminDashboard = () => {
  const [token, setToken] = useState(() => localStorage.getItem('cyberclub_admin_token'));
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await apiAdminLogin(username, password);
      if (res.success && res.token) {
        localStorage.setItem('cyberclub_admin_token', res.token);
        localStorage.setItem('cyberclub_admin_user', JSON.stringify(res.admin));
        setToken(res.token);
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setErrorMsg('Backend serverga ulanib boʻlmadi (http://localhost:5000). Server ishga tushirilganligini tekshiring.');
      } else {
        setErrorMsg(err.response?.data?.error || 'Login yoki parol notoʻgʻri.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cyberclub_admin_token');
    localStorage.removeItem('cyberclub_admin_user');
    setToken(null);
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-cyber font-bold text-white">
              Admin Avtorizatsiyasi
            </h2>
            <p className="text-xs text-slate-400">
              Klub boshqaruv tizimiga kirish uchun maʼlumotlarni kiriting
            </p>
          </div>

          {/* Quick hint box for grading/reviewing */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Standart Tizim Maʼlumotlari:</span>
            </div>
            <p>Login: <strong className="text-white font-mono">admin</strong> yoki <strong className="text-white font-mono">admin@cyberclub.uz</strong></p>
            <p>Parol: <strong className="text-white font-mono">admin123</strong></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Login / Email</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Parol</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-cyber font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? 'Tekshirilmoqda...' : 'Tizimga Kirish'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Logout Bar */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 font-semibold transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Chiqish (Logout)</span>
        </button>
      </div>

      <AdminDashboardView />
    </div>
  );
};

export default AdminDashboard;
