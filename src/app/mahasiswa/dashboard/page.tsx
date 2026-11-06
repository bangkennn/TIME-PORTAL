'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useMahasiswaProfile } from '@/hooks/useMahasiswaProfile';
import { StmikLogoOnly } from '@/components/shared/logo-stmik-time';
import {
  Home,
  BookOpen,
  Calendar,
  GraduationCap,
  Megaphone,
  LogOut,
  ChevronRight,
  Search,
  Bell,
  Menu,
  X,
  FileCheck,
  CheckCircle2,
  Award,
  ArrowRight,
  ShieldCheck,
  User,
  ChevronDown,
} from 'lucide-react';

export default function MahasiswaDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, clearAuth } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAlumniOpen, setIsAlumniOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const activeNim = user?.name || '2345012';
  const { data: profile } = useMahasiswaProfile(activeNim);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    queryClient.clear();
    clearAuth();
    router.push('/');
  };

  // Dinamis: utamakan nama mahasiswa dari profil API, kemudian nama user, atau fallback sesuai NIM
  const studentName =
    profile?.namaMahasiswa ||
    ((profile as unknown) as Record<string, string>)?.nama ||
    ((profile as unknown) as Record<string, string>)?.nama_mahasiswa ||
    (user?.name && user.name !== activeNim ? user.name : null) ||
    (activeNim === '2345012'
      ? 'RISNAWATI DAMANIK'
      : activeNim === '2244090'
      ? 'TARQ HILMAR SIREGAR'
      : `Mahasiswa (${activeNim})`);

  const studentNim = String(profile?.nim || activeNim);
  const initials =
    studentName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'M';

  const prodiText =
    profile?.kodeProgramStudi === 'TI'
      ? 'S1 - Teknik Informatika'
      : profile?.kodeProgramStudi === 'SI'
      ? 'S1 - Sistem Informasi'
      : activeNim === '2345012'
      ? 'S1 - Sistem Informasi'
      : 'S1 - Teknik Informatika';

  return (
    <div className="h-screen w-full bg-[#F4F6FB] flex font-sans select-none overflow-hidden relative">
      {/* ================= BACKDROP (MOBILE ONLY) ================= */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* ================= SIDEBAR (STANDARD DASHBOARD SIDEBAR) ================= */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-60 bg-[#0D3B82] h-screen max-h-screen flex flex-col justify-between shrink-0 text-white transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none overflow-hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="px-5 pt-7 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="shrink-0 flex items-center justify-center">
                  <StmikLogoOnly className="h-10 w-10 object-contain drop-shadow-xs" />
                </div>
                <div>
                  <h1 className="text-white font-black text-sm tracking-wide leading-tight">
                    STMIK TIME
                  </h1>
                  <span className="text-[10px] text-blue-200/80 font-medium">Portal Mahasiswa</span>
                </div>
              </div>

              {/* Close Button Mobile */}
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Tutup menu navigasi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Menus with Seamless Active Tab */}
          <nav className="pl-5 space-y-3.5 pt-1">
            {/* Active: Beranda Mahasiswa (Seamless Cut-out Tab) */}
            <div className="relative">
              {/* Inverted Concave Curve Top */}
              <div className="absolute -top-7 right-0 w-7 h-7 bg-[#F4F6FB] pointer-events-none">
                <div className="w-full h-full bg-[#0D3B82] rounded-br-[28px]" />
              </div>

              {/* Active Tab Body */}
              <div className="w-full bg-[#F4F6FB] text-[#0D3B82] font-bold text-xs sm:text-sm py-4 pl-5 rounded-l-2xl flex items-center gap-3 relative z-10 shadow-xs">
                <Home className="w-4 h-4 text-[#0D3B82] shrink-0" />
                <span>Beranda</span>
              </div>

              {/* Inverted Concave Curve Bottom */}
              <div className="absolute -bottom-7 right-0 w-7 h-7 bg-[#F4F6FB] pointer-events-none">
                <div className="w-full h-full bg-[#0D3B82] rounded-tr-[28px]" />
              </div>
            </div>

            {/* Inactive Menu: Rencana Studi (KRS & KHS) */}
            <div className="pr-5">
              <button
                type="button"
                className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3.5 px-3.5 rounded-xl flex items-center justify-between cursor-pointer text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-white/90 shrink-0" />
                  <span>KRS & KHS</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            </div>

            {/* Inactive Menu: Jadwal Kuliah */}
            <div className="pr-5">
              <button
                type="button"
                className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3.5 px-3.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-colors"
              >
                <Calendar className="w-4 h-4 text-white/90 shrink-0" />
                <span>Jadwal Kuliah</span>
              </button>
            </div>

            {/* Menu Kategori: Alumni & Tracer Study */}
            <div className="pr-5">
              <button
                type="button"
                onClick={() => setIsAlumniOpen((prev) => !prev)}
                className="w-full bg-white/10 text-white text-xs sm:text-[13px] font-medium py-3.5 px-3.5 rounded-xl flex items-center justify-between cursor-pointer text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-white shrink-0" />
                  <span className="font-semibold">Alumni</span>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 opacity-80 shrink-0 transition-transform duration-200 ${
                    isAlumniOpen ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {isAlumniOpen && (
                <div className="mt-2 ml-4 pl-3 border-l-2 border-white/20 space-y-1.5 py-1">
                  <Link
                    href="/mahasiswa/tracer-study"
                    onClick={() => setIsMobileOpen(false)}
                    className="w-full text-white/90 hover:text-white hover:bg-white/15 text-xs font-medium py-2 px-3 rounded-lg flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
                    <span>Tracer Study</span>
                  </Link>

                  <button
                    type="button"
                    className="w-full text-white/70 hover:text-white hover:bg-white/10 text-xs py-2 px-3 rounded-lg flex items-center gap-2.5 cursor-pointer transition-colors text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                    <span>Data Alumni</span>
                  </button>
                </div>
              )}
            </div>

            {/* Inactive Menu: Pengumuman */}
            <div className="pr-5">
              <button
                type="button"
                className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3.5 px-3.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-colors"
              >
                <Megaphone className="w-4 h-4 text-white/90 shrink-0" />
                <span>Pengumuman</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-5 pb-6">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full bg-[#DC2626]/15 hover:bg-[#DC2626]/25 border border-red-300/20 text-[#FECACA] text-xs font-medium py-3 px-3.5 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left shadow-2xs"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 min-w-0 h-screen bg-[#F4F6FB] p-4 sm:p-7 flex flex-col gap-6 overflow-y-auto w-full">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
                aria-label="Buka menu navigasi"
              >
                <Menu className="w-5 h-5 text-[#0D3B82]" />
              </button>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                  Dashboard Mahasiswa
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Selamat datang, <span className="font-bold text-[#0D3B82]">{studentName}</span>
                </p>
              </div>
            </div>

            {/* Mobile Notification & Avatar Dropdown Trigger */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center relative text-slate-600 shadow-2xs"
                aria-label="Notifikasi"
              >
                <Bell className="w-4 h-4 text-slate-500" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
              </button>

              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="w-8 h-8 rounded-full bg-[#0D3B82] text-white font-bold text-xs flex items-center justify-center tracking-tight shadow-xs font-mono cursor-pointer"
                aria-label="Profil"
              >
                {initials}
              </button>
            </div>
          </div>

          {/* Desktop Controls with Interactive Profile Dropdown */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-white border border-slate-200/90 rounded-xl px-3 py-2 flex items-center gap-2 text-slate-400 w-full sm:w-56 focus-within:border-blue-400 shadow-2xs">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Cari mata kuliah..."
                className="bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none w-full"
              />
            </div>

            <button
              type="button"
              className="hidden sm:flex w-9 h-9 rounded-xl border border-slate-200 bg-white items-center justify-center relative text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
            </button>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="hidden sm:flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
                aria-label="Buka menu profil"
              >
                <div className="w-8 h-8 rounded-full bg-[#0D3B82] text-white font-bold text-xs flex items-center justify-center tracking-tight shadow-xs shrink-0 font-mono">
                  {initials}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-800 block leading-tight max-w-[130px] truncate">
                    {studentName}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Mahasiswa
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Floating Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Masuk sebagai</p>
                    <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{studentName}</p>
                    <p className="text-[11px] font-mono text-[#0D3B82] font-semibold mt-0.5">
                      NIM: {studentNim}
                    </p>
                  </div>

                  <div className="py-1.5 px-2">
                    <Link
                      href="/mahasiswa/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0D3B82] hover:bg-blue-50/70 rounded-xl transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#0D3B82]" />
                      <span>Profil Mahasiswa</span>
                    </Link>

                    <Link
                      href="/mahasiswa/tracer-study"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-[#0D3B82] hover:bg-blue-50/70 rounded-xl transition-colors cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      <span>Tracer Study</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1.5 px-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= HERO CARD MAHASISWA (MINIMALIST SOLID NAVY) ================= */}
        <div className="bg-[#0D3B82] rounded-xl p-6 sm:p-7 text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Status: Mahasiswa Aktif 2026/2027</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Selamat Datang di Portal Mahasiswa
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/80 max-w-xl leading-relaxed">
              Pantau kartu rencana studi, nilai perkuliahan semester, biodata profil, presensi kehadiran, serta partisipasi kuesioner akademik dan Tracer Study STMIK TIME.
            </p>
          </div>

          <div className="shrink-0 bg-white/10 border border-white/15 rounded-xl p-4 text-center min-w-[200px]">
            <span className="text-[11px] text-blue-200 uppercase font-medium tracking-wider">NIM Mahasiswa</span>
            <div className="text-xl font-mono font-bold text-white mt-0.5">{studentNim}</div>
            <span className="text-xs text-blue-100/90 block mt-1">{prodiText}</span>
            <span className="text-[11px] text-blue-200/80 block mt-0.5">Kampus {profile?.kodeKampus || 'MERBABU'}</span>
          </div>
        </div>

        {/* ================= TRACER STUDY CALL TO ACTION ================= */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D3B82] flex items-center justify-center shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-800">Kuesioner Tracer Study Alumni</h4>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Penting
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Kuesioner Tracer Study STMIK TIME sedang dibuka. Mohon luangkan waktu 3 menit untuk berpartisipasi dalam peningkatan akreditasi program studi.
              </p>
            </div>
          </div>

          <Link
            href="/mahasiswa/tracer-study"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D3B82] hover:bg-[#092B60] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            <span>Isi Kuesioner Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ================= 4 ACADEMIC STAT CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">IPK Kumulatif</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-800">3.82</div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 block">
              Sangat Memuaskan (Cum Laude)
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Total SKS Tempuh</span>
              <BookOpen className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-800">112 SKS</div>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">
              Tersisa 32 SKS Menuju Wisuda
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Presensi Kehadiran</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-slate-800">95.4%</div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 block">
              Memenuhi Syarat Ujian Akhir
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Status Keuangan</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600">LUNAS</div>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">
              Bebas Biaya Semester Ganjil
            </span>
          </div>
        </div>

        {/* ================= JADWAL KULIAH HARI INI ================= */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Jadwal Kuliah Hari Ini</h3>
              <p className="text-xs text-slate-400">Jadwal tatap muka ruang perkuliahan STMIK TIME</p>
            </div>
            <span className="text-xs font-bold text-[#0D3B82] bg-blue-50 px-3 py-1 rounded-lg">
              Jumat, 16 Oktober 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-blue-600 font-bold block mb-1">
                  08.00 - 10.30 WIB • Lab Komputer 2
                </span>
                <h4 className="text-xs font-bold text-slate-800">Rekayasa Perangkat Lunak Terdistribusi</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Dosen: Prof. Hartono, M.Kom.</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0">
                Hadir
              </span>
            </div>

            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-blue-600 font-bold block mb-1">
                  13.30 - 16.00 WIB • Ruang Teori 301
                </span>
                <h4 className="text-xs font-bold text-slate-800">Kecerdasan Buatan & Machine Learning</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Dosen: Dr. Wijaya Kusuma, S.T., M.Cs.</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg shrink-0">
                Mendatang
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}