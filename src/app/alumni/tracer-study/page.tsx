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
  Menu,
  X,
} from 'lucide-react';

export default function TracerStudyPage() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAlumniOpen, setIsAlumniOpen] = useState(true);

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

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-60 bg-[#0D3B82] min-h-screen h-auto flex flex-col justify-between shrink-0 text-white transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
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

          {/* Navigation Menus */}
          <nav className="pl-5 space-y-4 pt-1">
            {/* Menu: Home (Navigates back to Dashboard) */}
            <div className="pr-5">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileOpen(false)}
                className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3.5 px-3.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-colors"
              >
                <Home className="w-4 h-4 text-white/90 shrink-0" />
                <span>Home</span>
              </Link>
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

            {/* Menu Kategori: Alumni (Expanded with active Tracer Study) */}
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

              {/* Submenu Alumni */}
              {isAlumniOpen && (
                <div className="mt-2 ml-4 pl-3 border-l-2 border-white/20 space-y-1.5 py-1">
                  {/* Tracer Study (Active in this page) */}
                  <div className="w-full bg-[#F4F6FB] text-[#0D3B82] text-xs font-bold py-2.5 px-3 rounded-lg flex items-center gap-2.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#0D3B82] shrink-0" />
                    <span>Tracer Study</span>
                  </div>

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
      <main className="flex-1 min-h-screen bg-[#F4F6FB] p-4 sm:p-7 flex flex-col gap-5 overflow-y-auto w-full">
        {/* Top Header Row */}
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
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-0.5">
                  <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <span>/</span>
                  <span>Alumni</span>
                  <span>/</span>
                  <span className="text-[#0D3B82] font-semibold">Tracer Study</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                  Tracer Study
                </h2>
              </div>
            </div>

            {/* Mobile Notification & Profile */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center relative text-slate-600 shadow-2xs cursor-pointer shrink-0"
                aria-label="Notifikasi"
              >
                <Bell className="w-4 h-4 text-slate-500" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
              </button>
              <div className="w-8 h-8 rounded-full bg-[#00A896] text-white font-bold text-xs flex items-center justify-center tracking-tight shadow-xs shrink-0">
                AD
              </div>
            </div>
          </div>

          {/* Header Controls (Desktop & Tablet) */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl px-3 py-2 flex items-center gap-2 text-slate-400 w-full sm:w-56 focus-within:border-blue-400 focus-within:bg-white transition-all shadow-2xs">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Cari sesuatu..."
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

            <div className="hidden sm:flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-[#00A896] text-white font-bold text-xs flex items-center justify-center tracking-tight shadow-xs shrink-0">
                AD
              </div>
              <span className="text-xs font-bold text-slate-700">admin</span>
            </div>
          </div>
        </header>

        {/* ================= EMPTY CONTENT CANVAS ================= */}
        <div className="flex-1 min-h-[400px] w-full" />
      </main>
    </div>
  );
}
