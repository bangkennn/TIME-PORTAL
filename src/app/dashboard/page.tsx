'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { StmikLogoOnly } from '@/components/shared/logo-stmik-time';
import {
  Home,
  Database,
  Users,
  FileText,
  Megaphone,
  LogOut,
  ChevronRight,
  Search,
  Bell,
  GraduationCap,
  CheckCircle2,
  Award,
  PauseCircle,
  Menu,
  X,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAlumniOpen, setIsAlumniOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F6FB] flex font-sans select-none overflow-x-hidden relative">
      {/* ================= BACKDROP (MOBILE ONLY) ================= */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* ================= SIDEBAR (RESPONSIVE NON-FULL DRAWER ON MOBILE) ================= */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-60 bg-[#0D3B82] min-h-screen h-auto flex flex-col justify-between shrink-0 text-white transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header with Logo.png & Close Button for Mobile */}
          <div className="px-5 pt-7 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="shrink-0 flex items-center justify-center">
                  <StmikLogoOnly className="h-10 w-10 object-contain drop-shadow-xs" />
                </div>
                <div>
                  <h1 className="text-base font-bold tracking-wide text-white">
                    STMIK TIME
                  </h1>
                </div>
              </div>

              {/* Close Button on Mobile Drawer */}
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Menus with Spacious Vertical Spacing */}
          <nav className="pl-5 space-y-4 pt-1">
            {/* Home (Active - Tebal & Lebar Atas-Bawah) */}
            <div className="relative">
              {/* Inverted Concave Curve Top */}
              <div className="absolute -top-7 right-0 w-7 h-7 bg-[#F4F6FB] pointer-events-none">
                <div className="w-full h-full bg-[#0D3B82] rounded-br-[28px]" />
              </div>

              {/* Active Tab Body (Tinggi & Tebal Vertikal) */}
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="w-full bg-[#F4F6FB] text-[#0D3B82] font-bold text-xs sm:text-sm py-5 pl-5 rounded-l-2xl flex items-center gap-3.5 cursor-pointer text-left transition-all relative z-10 shadow-xs"
              >
                <Home className="w-4 h-4 text-[#0D3B82] shrink-0" />
                <span>Home</span>
              </button>

              {/* Inverted Concave Curve Bottom */}
              <div className="absolute -bottom-7 right-0 w-7 h-7 bg-[#F4F6FB] pointer-events-none">
                <div className="w-full h-full bg-[#0D3B82] rounded-tr-[28px]" />
              </div>
            </div>

            {/* Inactive Menu: Data Master */}
            <div className="pr-5">
              <button
                type="button"
                className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3.5 px-3.5 rounded-xl flex items-center justify-between cursor-pointer text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-white/90 shrink-0" />
                  <span>Data Master</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            </div>

            {/* Inactive Menu: Kelola Data */}
            <div className="pr-5">
              <button
                type="button"
                className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3.5 px-3.5 rounded-xl flex items-center justify-between cursor-pointer text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-white/90 shrink-0" />
                  <span>Kelola Data</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            </div>

            {/* Inactive Menu: Studi Mahasiswa */}
            <div className="pr-5">
              <button
                type="button"
                className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3.5 px-3.5 rounded-xl flex items-center justify-between cursor-pointer text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-white/90 shrink-0" />
                  <span>Studi Mahasiswa</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            </div>

            {/* Menu Kategori: Alumni (Dropdown/Collapsible) */}
            <div className="pr-5">
              <button
                type="button"
                onClick={() => setIsAlumniOpen((prev) => !prev)}
                className={`w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3.5 px-3.5 rounded-xl flex items-center justify-between cursor-pointer text-left transition-colors ${
                  isAlumniOpen ? 'bg-white/10' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-white/90 shrink-0" />
                  <span>Alumni</span>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 opacity-60 shrink-0 transition-transform duration-200 ${
                    isAlumniOpen ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {/* Submenu Alumni */}
              {isAlumniOpen && (
                <div className="mt-2 ml-4 pl-3 border-l-2 border-white/20 space-y-1.5 py-1">
                  <Link
                    href="/alumni/tracer-study"
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

        {/* Sidebar Footer Logout (Soft Pastel Red) */}
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

      {/* ================= MAIN DASHBOARD CONTENT ================= */}
      <main className="flex-1 min-h-screen bg-[#F4F6FB] p-4 sm:p-7 flex flex-col gap-4 overflow-y-auto w-full">
        {/* Top Header Row with Mobile Hamburger Trigger */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              {/* Hamburger Button (Mobile Only) */}
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
                  Dashboard
                </h2>
                <p className="text-xs text-slate-400 font-normal mt-0.5">
                  Selamat datang, admin
                </p>
              </div>
            </div>

            {/* Mobile Notification & Profile (visible at top in mobile) */}
            <div className="flex sm:hidden items-center gap-2">
              {/* Notification Bell (Mobile: Di samping kiri profil) */}
              <button
                type="button"
                className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center relative text-slate-600 shadow-2xs cursor-pointer shrink-0"
                aria-label="Notifikasi"
              >
                <Bell className="w-4 h-4 text-slate-500" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
              </button>

              {/* Mobile Profile Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#00A896] text-white font-bold text-xs flex items-center justify-center tracking-tight shadow-xs shrink-0">
                AD
              </div>
            </div>
          </div>

          {/* Header Controls (Desktop & Tablet) */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Search Input */}
            <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl px-3 py-2 flex items-center gap-2 text-slate-400 w-full sm:w-56 focus-within:border-blue-400 focus-within:bg-white transition-all shadow-2xs">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Cari mahasiswa..."
                className="bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none w-full"
              />
            </div>

            {/* Notification Bell (Desktop & Tablet) */}
            <button
              type="button"
              className="hidden sm:flex w-9 h-9 rounded-xl border border-slate-200 bg-white items-center justify-center relative text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
            </button>

            {/* Desktop Profile Avatar Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-[#00A896] text-white font-bold text-xs flex items-center justify-center tracking-tight shadow-xs shrink-0">
                AD
              </div>
              <span className="text-xs font-bold text-slate-700">
                admin
              </span>
            </div>
          </div>
        </header>

        {/* 4 Metric Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total mahasiswa */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-[#0D3B82] flex items-center justify-center shrink-0 border border-blue-100/50">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-none">
                830
              </div>
              <div className="text-xs text-slate-400 font-normal mt-1">
                Total mahasiswa
              </div>
            </div>
          </div>

          {/* Card 2: Aktif */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0 border border-emerald-100/50">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-none">
                828
              </div>
              <div className="text-xs text-slate-400 font-normal mt-1">
                Aktif
              </div>
            </div>
          </div>

          {/* Card 3: Alumni */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center shrink-0 border border-amber-100/50">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-none">
                101
              </div>
              <div className="text-xs text-slate-400 font-normal mt-1">
                Alumni
              </div>
            </div>
          </div>

          {/* Card 4: Nonaktif */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F1F5F9] text-[#94A3B8] flex items-center justify-center shrink-0 border border-slate-200/50">
              <PauseCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-none">
                86
              </div>
              <div className="text-xs text-slate-400 font-normal mt-1">
                Nonaktif
              </div>
            </div>
          </div>
        </section>

        {/* Middle Row: 2 Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Chart: Mahasiswa berdasarkan prodi (Donut) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Mahasiswa berdasarkan prodi
              </h3>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Perbandingan TI dan SI
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-5 py-4">
              {/* Donut Chart SVG */}
              <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  {/* TI Segment (61% - Dark Navy #0D3B82) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="58"
                    fill="none"
                    stroke="#0D3B82"
                    strokeWidth="18"
                    strokeDasharray="222.4 142.0"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* SI Segment (39% - Green #00D284) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="58"
                    fill="none"
                    stroke="#00D284"
                    strokeWidth="18"
                    strokeDasharray="136.0 228.4"
                    strokeDashoffset="-225"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Donut Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold text-slate-800 leading-none">
                    830
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal mt-0.5">
                    mahasiswa
                  </span>
                </div>
              </div>

              {/* Legends Cards */}
              <div className="flex flex-col gap-2.5 w-full sm:w-48">
                {/* Teknik Informatika */}
                <div className="bg-[#F8FAFC] border border-slate-100/90 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0D3B82] mt-1 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        Teknik Informatika
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        TI · 505 mahasiswa
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 pl-2">
                    61%
                  </span>
                </div>

                {/* Sistem Informasi */}
                <div className="bg-[#F8FAFC] border border-slate-100/90 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00D284] mt-1 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        Sistem Informasi
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        SI · 325 mahasiswa
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 pl-2">
                    39%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Chart: Mahasiswa berdasarkan angkatan (Area Curve) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Mahasiswa berdasarkan angkatan
              </h3>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Total mahasiswa per tahun angkatan
              </p>
            </div>

            {/* Smooth Spline Area Chart */}
            <div className="w-full h-48 pt-2">
              <svg className="w-full h-full" viewBox="0 0 540 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0D3B82" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0D3B82" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines & Y-Axis Labels */}
                {[
                  { val: 160, y: 15 },
                  { val: 140, y: 32 },
                  { val: 120, y: 50 },
                  { val: 100, y: 68 },
                  { val: 80, y: 86 },
                  { val: 60, y: 104 },
                  { val: 40, y: 122 },
                  { val: 20, y: 140 },
                  { val: 0, y: 158 },
                ].map((item) => (
                  <g key={item.val}>
                    <text
                      x="25"
                      y={item.y + 3}
                      textAnchor="end"
                      className="fill-slate-400 text-[9px] font-normal"
                    >
                      {item.val}
                    </text>
                    <line
                      x1="35"
                      y1={item.y}
                      x2="530"
                      y2={item.y}
                      stroke="#F1F5F9"
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Area Fill */}
                <path
                  d="M 45 157
                     C 65 157, 75 158, 85 158
                     C 105 158, 125 145, 145 110
                     C 165 75, 185 45, 205 32
                     C 225 18, 245 15, 265 18
                     C 285 22, 295 48, 310 65
                     C 325 82, 335 85, 350 78
                     C 365 70, 385 55, 400 52
                     C 420 48, 440 70, 460 90
                     C 480 110, 500 125, 520 135
                     L 520 158
                     L 45 158
                     Z"
                  fill="url(#areaGradient)"
                />

                {/* Dark Navy Curve Line */}
                <path
                  d="M 45 157
                     C 65 157, 75 158, 85 158
                     C 105 158, 125 145, 145 110
                     C 165 75, 185 45, 205 32
                     C 225 18, 245 15, 265 18
                     C 285 22, 295 48, 310 65
                     C 325 82, 335 85, 350 78
                     C 365 70, 385 55, 400 52
                     C 420 48, 440 70, 460 90
                     C 480 110, 500 125, 520 135"
                  fill="none"
                  stroke="#0D3B82"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* X-Axis Labels */}
                {[
                  { label: 'null', x: 45 },
                  { label: '2000', x: 85 },
                  { label: '2020', x: 145 },
                  { label: '2021', x: 205 },
                  { label: '2022', x: 265 },
                  { label: '2023', x: 325 },
                  { label: '2024', x: 385 },
                  { label: '2025', x: 445 },
                  { label: '2026', x: 505 },
                ].map((item) => (
                  <text
                    key={item.label}
                    x={item.x}
                    y="173"
                    textAnchor="middle"
                    className="fill-slate-400 text-[9px] font-normal"
                  >
                    {item.label}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </section>

        {/* Bottom Full-Width Chart: Mahasiswa berdasarkan status per angkatan */}
        <section className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
          {/* Header & Legend */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Mahasiswa berdasarkan status per angkatan
              </h3>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Aktif, nonaktif, dropout, alumni, dan cuti
              </p>
            </div>

            {/* Status Legends */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0D3B82]" />
                <span>AKTIF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                <span>NONAKTIF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span>DROPOUT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00D284]" />
                <span>ALUMNI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span>CUTI</span>
              </div>
            </div>
          </div>

          {/* Clustered Bar Chart SVG */}
          <div className="w-full h-56 pt-2 overflow-x-auto">
            <svg className="w-full min-w-[620px] h-full" viewBox="0 0 820 190">
              {/* Horizontal Gridlines & Y-Axis Labels */}
              {[
                { val: 160, y: 15 },
                { val: 140, y: 33 },
                { val: 120, y: 51 },
                { val: 100, y: 69 },
                { val: 80, y: 87 },
                { val: 60, y: 105 },
                { val: 40, y: 123 },
                { val: 20, y: 141 },
                { val: 0, y: 159 },
              ].map((item) => (
                <g key={item.val}>
                  <text
                    x="25"
                    y={item.y + 3}
                    textAnchor="end"
                    className="fill-slate-400 text-[9px] font-normal"
                  >
                    {item.val}
                  </text>
                  <line
                    x1="35"
                    y1={item.y}
                    x2="800"
                    y2={item.y}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                  />
                </g>
              ))}

              {/* Data Groups per Year (Base Y = 159) */}
              {/* Group 1: null */}
              <g transform="translate(80, 0)">
                <rect x="0" y="156" width="7" height="3" rx="2" fill="#0D3B82" />
                <rect x="9" y="151" width="7" height="8" rx="2" fill="#00D284" />
                <text x="8" y="173" textAnchor="middle" className="fill-slate-400 text-[9px]">null</text>
              </g>

              {/* Group 2: 2000 */}
              <g transform="translate(160, 0)">
                <rect x="0" y="157" width="7" height="2" rx="1" fill="#0D3B82" />
                <text x="4" y="173" textAnchor="middle" className="fill-slate-400 text-[9px]">2000</text>
              </g>

              {/* Group 3: 2020 */}
              <g transform="translate(240, 0)">
                <rect x="0" y="106" width="7" height="53" rx="2" fill="#0D3B82" />
                <rect x="9" y="134" width="7" height="25" rx="2" fill="#94A3B8" />
                <rect x="18" y="157" width="7" height="2" rx="1" fill="#EF4444" />
                <rect x="27" y="91" width="7" height="68" rx="2" fill="#00D284" />
                <text x="17" y="173" textAnchor="middle" className="fill-slate-400 text-[9px]">2020</text>
              </g>

              {/* Group 4: 2021 */}
              <g transform="translate(325, 0)">
                <rect x="0" y="55" width="7" height="104" rx="2" fill="#0D3B82" />
                <rect x="9" y="157" width="7" height="2" rx="1" fill="#94A3B8" />
                <rect x="18" y="157" width="7" height="2" rx="1" fill="#EF4444" />
                <rect x="27" y="151" width="7" height="8" rx="2" fill="#00D284" />
                <text x="17" y="173" textAnchor="middle" className="fill-slate-400 text-[9px]">2021</text>
              </g>

              {/* Group 5: 2022 */}
              <g transform="translate(410, 0)">
                <rect x="0" y="24" width="7" height="135" rx="2" fill="#0D3B82" />
                <rect x="9" y="148" width="7" height="11" rx="2" fill="#94A3B8" />
                <rect x="18" y="157" width="7" height="2" rx="1" fill="#EF4444" />
                <rect x="27" y="154" width="7" height="5" rx="1" fill="#00D284" />
                <text x="17" y="173" textAnchor="middle" className="fill-slate-400 text-[9px]">2022</text>
              </g>

              {/* Group 6: 2023 */}
              <g transform="translate(495, 0)">
                <rect x="0" y="15" width="7" height="144" rx="2" fill="#0D3B82" />
                <rect x="9" y="145" width="7" height="14" rx="2" fill="#94A3B8" />
                <rect x="18" y="157" width="7" height="2" rx="1" fill="#EF4444" />
                <rect x="27" y="156" width="7" height="3" rx="1" fill="#00D284" />
                <rect x="36" y="158" width="7" height="1" rx="0.5" fill="#F59E0B" />
                <text x="21" y="173" textAnchor="middle" className="fill-slate-400 text-[9px]">2023</text>
              </g>

              {/* Group 7: 2024 */}
              <g transform="translate(585, 0)">
                <rect x="0" y="55" width="7" height="104" rx="2" fill="#0D3B82" />
                <rect x="9" y="155" width="7" height="4" rx="1" fill="#94A3B8" />
                <text x="8" y="173" textAnchor="middle" className="fill-slate-400 text-[9px]">2024</text>
              </g>

              {/* Group 8: 2025 */}
              <g transform="translate(660, 0)">
                <rect x="0" y="42" width="7" height="117" rx="2" fill="#0D3B82" />
                <rect x="9" y="151" width="7" height="8" rx="2" fill="#94A3B8" />
                <text x="8" y="173" textAnchor="middle" className="fill-slate-400 text-[9px]">2025</text>
              </g>

              {/* Group 9: 2026 */}
              <g transform="translate(735, 0)">
                <rect x="0" y="78" width="7" height="81" rx="2" fill="#0D3B82" />
                <text x="4" y="173" textAnchor="middle" className="fill-slate-400 text-[9px]">2026</text>
              </g>
            </svg>
          </div>
        </section>
      </main>
    </div>
  );
}
