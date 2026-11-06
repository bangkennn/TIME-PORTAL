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
  Menu,
  X,
  User,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';

function formatTanggal(timestamp?: number | string | null): string {
  if (!timestamp) return '-';
  const num = typeof timestamp === 'string' ? Number(timestamp) : timestamp;
  if (isNaN(num)) return String(timestamp);
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(num));
  } catch {
    return String(timestamp);
  }
}

function formatGender(code?: string | null): string {
  if (!code) return '-';
  const c = code.toUpperCase().trim();
  if (c === 'P') return 'Pria';
  if (c === 'W') return 'Wanita';
  if (c === 'L') return 'Pria';
  return code;
}

function formatAgama(code?: string | null): string {
  if (!code) return '-';
  const map: Record<string, string> = {
    IS: 'Islam',
    KR: 'Kristen Protestan',
    KT: 'Katolik',
    HD: 'Hindu',
    BD: 'Buddha',
    KC: 'Konghucu',
  };
  return map[code.toUpperCase()] || code;
}

function formatProdi(code?: string | null, activeNim?: string): string {
  if (code === 'TI') return 'S1 - Teknik Informatika';
  if (code === 'SI') return 'S1 - Sistem Informasi';
  if (activeNim === '2345012') return 'S1 - Sistem Informasi';
  return 'S1 - Teknik Informatika';
}

export default function MahasiswaProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, clearAuth } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAlumniOpen, setIsAlumniOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const activeNim = user?.name || '2345012';
  const { data: profile } = useMahasiswaProfile(activeNim);

  // Close dropdown on click outside
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

  const studentEmail =
    profile?.email ||
    (activeNim === '2345012'
      ? 'watirisnadmk@gmail.com'
      : activeNim === '2244090'
      ? 'tarqhilmarsiregar@gmail.com'
      : `mahasiswa.${studentNim}@stmik-time.ac.id`);

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

      {/* ================= SIDEBAR (IDENTIK DENGAN DASHBOARD - TIDAK ADA MENU TERSELECT) ================= */}
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

          {/* Navigation Menus (Identik dengan dashboard, tanpa tab aktif yang dipilih) */}
          <nav className="pl-5 space-y-3 pt-1">
            <div className="pr-5">
              <Link
                href="/mahasiswa/dashboard"
                onClick={() => setIsMobileOpen(false)}
                className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3 px-3.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-colors"
              >
                <Home className="w-4 h-4 text-white/90 shrink-0" />
                <span>Beranda</span>
              </Link>
            </div>

            <div className="pr-5">
              <button
                type="button"
                className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3 px-3.5 rounded-xl flex items-center justify-between cursor-pointer text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-white/90 shrink-0" />
                  <span>KRS & KHS</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            </div>

            <div className="pr-5">
              <button
                type="button"
                className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3 px-3.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-colors"
              >
                <Calendar className="w-4 h-4 text-white/90 shrink-0" />
                <span>Jadwal Kuliah</span>
              </button>
            </div>

            <div className="pr-5">
              <button
                type="button"
                onClick={() => setIsAlumniOpen((prev) => !prev)}
                className="w-full bg-white/10 text-white text-xs sm:text-[13px] font-medium py-3 px-3.5 rounded-xl flex items-center justify-between cursor-pointer text-left transition-colors"
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

            <div className="pr-5">
              <button
                type="button"
                className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3 px-3.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-colors"
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
      <main className="flex-1 min-w-0 h-screen bg-[#F4F6FB] p-4 sm:p-7 flex flex-col gap-5 overflow-y-auto w-full max-w-7xl mx-auto">
        {/* Top Header */}
        <header className="flex items-center justify-between gap-3">
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
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-0.5">
                <Link href="/mahasiswa/dashboard" className="hover:text-[#0D3B82] transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-slate-600 font-medium">Profil</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Biodata Mahasiswa
              </h2>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
              aria-label="Menu profil pengguna"
            >
              <div className="w-8 h-8 rounded-full bg-[#0D3B82] text-white font-bold text-xs flex items-center justify-center tracking-tight shadow-xs shrink-0 font-mono">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight max-w-[150px] truncate">
                  {studentName}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  NIM: {studentNim}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isProfileDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in duration-100">
                <div className="px-3.5 py-2.5 border-b border-slate-100">
                  <p className="text-[11px] text-slate-400">Akun Aktif</p>
                  <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{studentName}</p>
                  <p className="text-[11px] font-mono text-[#0D3B82] font-semibold">{studentNim}</p>
                </div>

                <div className="py-1 px-1.5">
                  <Link
                    href="/mahasiswa/dashboard"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/mahasiswa/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#0D3B82] bg-blue-50/70 rounded-lg transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#0D3B82]" />
                    <span>Profil Mahasiswa</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-1 px-1.5">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Back Link */}
        <div>
          <Link
            href="/mahasiswa/dashboard"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-[#0D3B82] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>

        {/* ================= MINIMALIST PROFILE HEADER CARD ================= */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#0D3B82] text-white flex items-center justify-center font-mono font-bold text-xl sm:text-2xl shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {studentName}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Mahasiswa Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                NIM: <span className="font-mono text-slate-800 font-bold">{studentNim}</span> • {formatProdi(profile?.kodeProgramStudi, activeNim)}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Kampus {profile?.kodeKampus || 'MERBABU'} • Angkatan {profile?.tahunAngkatan || (activeNim === '2345012' ? 2023 : 2022)}
              </p>
            </div>
          </div>
        </div>

        {/* ================= 2 CLEAN STRUCTURED PANELS (NO NESTED CARDS) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Panel 1: Data Akademik & Pribadi */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#0D3B82] rounded-full inline-block" />
              <span>Data Akademik & Pribadi</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Nomor Induk Mahasiswa</span>
                <span className="text-slate-900 font-mono font-bold">{studentNim}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Nama Lengkap</span>
                <span className="text-slate-900 font-semibold">{studentName}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Program Studi</span>
                <span className="text-slate-900 font-semibold">{formatProdi(profile?.kodeProgramStudi, activeNim)}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Kampus</span>
                <span className="text-slate-900">{profile?.kodeKampus || 'MERBABU'}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Tahun Angkatan</span>
                <span className="text-slate-900">{profile?.tahunAngkatan || (activeNim === '2345012' ? 2023 : 2022)}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Waktu Kuliah</span>
                <span className="text-slate-900">{profile?.idWaktuKuliah === 1 ? 'Pagi / Reguler' : 'Malam / Eksekutif'}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Tempat, Tanggal Lahir</span>
                <span className="text-slate-900">
                  {profile?.tempatLahir || 'MEDAN'}, {formatTanggal(profile?.tanggalLahir)}
                </span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Jenis Kelamin</span>
                <span className="text-slate-900 font-medium">{formatGender(profile?.jenisKelamin || (activeNim === '2345012' ? 'W' : 'P'))}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Agama</span>
                <span className="text-slate-900">{formatAgama(profile?.idAgama)}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Golongan Darah</span>
                <span className="text-slate-900 font-mono">{profile?.golonganDarah || '-'}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Kewarganegaraan</span>
                <span className="text-slate-900">{profile?.kewarganegaraan || 'INDONESIA'}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Urutan Anak</span>
                <span className="text-slate-900">
                  Anak ke-{profile?.anakKe ?? '-'} dari {profile?.jumlahSaudara ?? '-'} bersaudara
                </span>
              </div>
            </div>
          </div>

          {/* Panel 2: Kontak, Alamat & Data Keluarga */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#0D3B82] rounded-full inline-block" />
              <span>Kontak, Domisili & Keluarga</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Alamat Mahasiswa</span>
                <span className="text-slate-900 leading-relaxed sm:text-right">
                  {profile?.alamatMahasiswa || '-'}
                </span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Email Mahasiswa</span>
                <span className="text-slate-900 font-medium">{studentEmail}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">No. Telepon / WA</span>
                <span className="text-slate-900 font-mono">{profile?.noTeleponMahasiswa || '-'}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Jurusan Asal Sekolah</span>
                <span className="text-slate-900">{profile?.jurusan || '-'}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Nomor Ijazah Asal</span>
                <span className="text-slate-900 font-mono">{profile?.noIjazah || '-'}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Nama Ayah</span>
                <span className="text-slate-900 font-medium">{profile?.namaAyah || '-'}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Nama Ibu</span>
                <span className="text-slate-900 font-medium">{profile?.namaIbu || '-'}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Pekerjaan Orang Tua</span>
                <span className="text-slate-900">{profile?.pekerjaanOrangtua || '-'}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Pendidikan Orang Tua</span>
                <span className="text-slate-900">{profile?.pendidikanOrangtua || '-'}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">No. Telepon Orang Tua</span>
                <span className="text-slate-900 font-mono">{profile?.noTeleponOrangtua || '-'}</span>
              </div>

              <div className="py-2.5 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">Alamat Orang Tua</span>
                <span className="text-slate-900 leading-relaxed sm:text-right">
                  {profile?.alamatOrangtua || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
