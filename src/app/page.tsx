'use client';

import React, { useState } from 'react';
import { StmikTimeLogo, StmikWatermark } from '@/components/shared/logo-stmik-time';
// import { RecaptchaV2, RecaptchaV2Ref } from '@/components/shared/recaptcha-v2';
import { useLoginMutation } from '@/hooks/useAuthMutation';
import { toast } from 'sonner';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Headphones,
  CheckCircle2,
  Info,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useLoginMutation();

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Data Belum Lengkap', {
        description: 'Silakan masukkan Nama Pengguna Anda.',
      });
      return;
    }
    if (!password.trim()) {
      toast.error('Data Belum Lengkap', {
        description: 'Silakan masukkan Kata Sandi Anda.',
      });
      return;
    }

    loginMutation.mutate({
      username: username.trim(),
      password: password.trim(),
    });
  };

  return (
    <main className="min-h-screen bg-[#F0F4F9] flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans">
      <div className="w-full max-w-5xl mx-auto my-auto py-2">
        {/* Main Card Container */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
          
          {/* ================= LEFT BRAND PANEL (Desktop only) ================= */}
          <section className="hidden lg:flex lg:col-span-5 bg-[#0D3B82] p-10 flex-col justify-between relative overflow-hidden text-white select-none">
            {/* STMIK TIME Watermark Silhouette */}
            <div className="absolute -bottom-2 -right-16 w-[440px] h-[440px] pointer-events-none">
              <StmikWatermark className="w-full h-full" opacity="opacity-10" />
            </div>

            {/* Top Badge & Headings */}
            <div className="space-y-6 relative z-10">
              {/* Badge SIAKAD */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full border border-white/15 tracking-wide">
                <span className="w-2 h-2 rounded-full bg-white/90 animate-pulse" />
                SIAKAD 4.0 TERPADU
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Sistem Informasi Akademik Terintegrasi
                </h1>
                <p className="text-blue-100/80 text-xs md:text-sm leading-relaxed font-normal">
                  Akses gerbang tunggal untuk registrasi KRS, pengelolaan nilai, jadwal perkuliahan, dan layanan akademik STMIK TIME.
                </p>
              </div>
            </div>

            {/* Bottom Support Contact */}
            <div className="relative z-10 pt-16">
              <div className="flex items-center gap-2 text-xs text-white/80 font-normal">
                <Headphones className="w-4 h-4 text-white/80 shrink-0" />
                <span>
                  Kendala teknis? Hubungi{' '}
                  <span className="font-semibold text-white underline decoration-white/30 underline-offset-2">
                    stmik-time.ac.id
                  </span>
                </span>
              </div>
            </div>
          </section>

          {/* ================= RIGHT FORM PANEL (Desktop & Mobile) ================= */}
          <section className="lg:col-span-7 bg-white p-6 sm:p-10 md:p-12 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Top Header Row */}
              <div className="flex items-center justify-center sm:justify-between gap-4">
                {/* Logo STMIK TIME */}
                <StmikTimeLogo className="h-10 sm:h-11 w-auto" />

                {/* Badge Portal Resmi Kampus (Desktop) */}
                <div className="hidden sm:inline-flex items-center gap-1.5 bg-[#EEF4FF] text-[#0D3B82] text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D3B82] shrink-0" />
                  <span>Portal Resmi Kampus</span>
                </div>
              </div>

              {/* Title Header */}
              <div className="space-y-1">
                {/* Desktop Heading */}
                <h2 className="hidden lg:block text-2xl font-bold text-slate-900 tracking-tight">
                  Masuk ke Akun Anda
                </h2>
                <p className="hidden lg:block text-xs text-slate-500 font-normal leading-relaxed">
                  Silakan masukkan kredensial akun akademik Anda untuk melanjutkan ke layanan kampus.
                </p>

                {/* Mobile Heading */}
                <h2 className="lg:hidden text-xl font-bold text-[#0D3B82] text-center tracking-tight pt-2">
                  Portal Akademik Mobile
                </h2>
                <p className="lg:hidden text-xs text-slate-500 text-center font-normal max-w-xs mx-auto leading-relaxed">
                  Masuk dengan akun terdaftar Anda untuk akses layanan perkuliahan
                </p>
              </div>

              {/* Mobile Info Alert */}
              <div className="lg:hidden flex items-center gap-2.5 bg-[#EEF4FF] border border-blue-100 text-blue-900 text-xs p-3.5 rounded-xl">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-slate-600 leading-snug">
                  Silakan isi <strong className="text-slate-900 font-semibold">Username</strong> dan{' '}
                  <strong className="text-slate-900 font-semibold">Password</strong> portal Anda.
                </p>
              </div>


              {/* Form Fields */}
              <form onSubmit={handleSubmitLogin} action="#" className="space-y-4 pt-1">
                {/* Nama Pengguna Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Nama Pengguna
                  </label>
                  <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center gap-3 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masukkan Nama Pengguna Anda"
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Kata Sandi Akun Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kata Sandi Akun
                  </label>
                  <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center gap-3 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi Anda"
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 
                  Verifikasi Keamanan (Google reCAPTCHA v2)
                  Sementara dinonaktifkan untuk mempermudah akses pengujian melalui jaringan LAN / IP lokal
                */}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-800">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="hidden sm:inline">Ingat saya di perangkat ini</span>
                    <span className="sm:hidden">Ingat Saya</span>
                  </label>

                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    className="text-[#0D3B82] font-semibold hover:underline"
                  >
                    <span className="hidden sm:inline">Lupa kata sandi?</span>
                    <span className="sm:hidden">Lupa Sandi?</span>
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-[#0D3B82] hover:bg-[#0A2E66] active:scale-[0.99] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-sm cursor-pointer mt-5 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sedang Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Mobile Help Pill */}
              <div className="lg:hidden pt-2 flex justify-center">
                <div className="inline-flex items-center gap-2 bg-[#EEF4FF] border border-blue-100 text-slate-700 text-xs py-2 px-4 rounded-full">
                  <Headphones className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span>
                    Bantuan Layanan :{' '}
                    <strong className="font-semibold text-blue-900">stmik-time.ac.id</strong>
                  </span>
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* ================= EXTERNAL FOOTER ================= */}
        <footer className="w-full pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-normal">
          <p className="text-center sm:text-left">
            © 2026 STMIK TIME. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="hidden sm:flex items-center gap-3 text-slate-500">
            <a href="#privacy" className="hover:text-slate-800 hover:underline">
              Kebijakan Privasi
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-800 hover:underline">
              Syarat &amp; Ketentuan
            </a>
            <span>•</span>
            <a href="#security" className="hover:text-slate-800 hover:underline">
              Keamanan Akun
            </a>
          </div>
        </footer>

      </div>
    </main>
  );
}
