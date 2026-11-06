'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
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
  Menu,
  X,
  FileCheck,
  User,
} from 'lucide-react';
import TracerFormFiller from '@/components/tracer-study/tracer-form-filler';
import { useQueryClient } from '@tanstack/react-query';

export default function MahasiswaTracerStudyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, clearAuth } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAlumniOpen, setIsAlumniOpen] = useState(true);

  const handleLogout = () => {
    queryClient.clear();
    clearAuth();
    router.push('/');
  };

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

      {/* ================= SIDEBAR ================= */}
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
          <nav className="pl-5 space-y-4 pt-1">
            {/* Menu: Beranda (Navigates to /mahasiswa/dashboard) */}
            <div className="pr-5">
              <Link
                href="/mahasiswa/dashboard"
                onClick={() => setIsMobileOpen(false)}
                className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3.5 px-3.5 rounded-xl flex items-center gap-3 cursor-pointer text-left transition-colors"
              >
                <Home className="w-4 h-4 text-white/90 shrink-0" />
                <span>Beranda</span>
              </Link>
            </div>


            {/* Inactive Menu: KRS & KHS */}
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

            {/* Menu Kategori: Alumni (Expanded with active Tracer Study - Seamless Cut-out) */}
            <div>
              <div className="pr-5">
                <button
                  type="button"
                  onClick={() => setIsAlumniOpen((prev) => !prev)}
                  className="w-full text-white/90 hover:bg-white/10 text-xs sm:text-[13px] font-medium py-3.5 px-3.5 rounded-xl flex items-center justify-between cursor-pointer text-left transition-colors"
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
              </div>

              {/* Submenu Alumni */}
              {isAlumniOpen && (
                <div className="mt-2 space-y-2">
                  {/* Tracer Study (Active in this page - Seamless Cut-out) */}
                  <div className="relative">
                    {/* Inverted Concave Curve Top */}
                    <div className="absolute -top-7 right-0 w-7 h-7 bg-[#F4F6FB] pointer-events-none">
                      <div className="w-full h-full bg-[#0D3B82] rounded-br-[28px]" />
                    </div>

                    {/* Active Tab Body */}
                    <div className="w-full bg-[#F4F6FB] text-[#0D3B82] font-bold text-xs sm:text-sm py-4 pl-7 rounded-l-2xl flex items-center gap-3 relative z-10 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-[#0D3B82] shrink-0" />
                      <span>Tracer Study</span>
                    </div>

                    {/* Inverted Concave Curve Bottom */}
                    <div className="absolute -bottom-7 right-0 w-7 h-7 bg-[#F4F6FB] pointer-events-none">
                      <div className="w-full h-full bg-[#0D3B82] rounded-tr-[28px]" />
                    </div>
                  </div>

                  {/* Submenu Data Alumni */}
                  <div className="pr-5 pl-4">
                    <button
                      type="button"
                      className="w-full text-white/70 hover:text-white hover:bg-white/10 text-xs py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                      <span>Data Alumni</span>
                    </button>
                  </div>
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
      <main className="flex-1 min-w-0 h-screen bg-[#F4F6FB] p-4 sm:p-7 flex flex-col gap-5 overflow-y-auto w-full">
        {/* Top Header Row */}
        <header className="flex items-center justify-between gap-3 pt-1">
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
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-0.5">
                <Link href="/mahasiswa/dashboard" className="hover:text-blue-600 transition-colors">
                  Mahasiswa
                </Link>
                <span>/</span>
                <span>Alumni</span>
                <span>/</span>
                <span className="text-[#0D3B82] font-semibold">Tracer Study</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Kuesioner Tracer Study Alumni
              </h2>
            </div>
          </div>
        </header>

        {/* ================= MAHASISWA CONTENT: MURNI FORM FILLER ================= */}
        <div className="flex-1 w-full pb-10">
          <TracerFormFiller />
        </div>
      </main>
    </div>
  );
}