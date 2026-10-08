'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { CheckCircle2, LogOut, User } from 'lucide-react';
import { StmikTimeLogo } from '@/components/shared/logo-stmik-time';

export default function DashboardPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-[#F0F4F9] flex flex-col justify-between p-6 md:p-12 font-sans">
      <div className="w-full max-w-lg mx-auto my-auto space-y-6 text-center">
        {/* Header Logo */}
        <div className="flex justify-center">
          <StmikTimeLogo className="h-12 w-auto" />
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/80 border border-slate-200/80 space-y-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Login Berhasil
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Autentikasi akun Anda telah berhasil diverifikasi oleh server kampus STMIK TIME.
            </p>
          </div>

          {/* User Information */}
          {user && (
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 text-left flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0D3B82] flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="text-xs overflow-hidden">
                <p className="font-semibold text-slate-800 truncate">
                  {String(user.name || user.username || 'Pengguna Terverifikasi')}
                </p>
                <p className="text-slate-400 font-mono truncate">
                  Role: {String(user.role || 'Default')}
                </p>
              </div>
            </div>
          )}

          {/* Logout / Kembali Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-[#0D3B82] hover:bg-[#0A2E66] active:scale-[0.99] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Kembali ke Halaman Login</span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-400">
          © 2026 STMIK TIME. Hak Cipta Dilindungi Undang-Undang.
        </p>
      </div>
    </main>
  );
}
