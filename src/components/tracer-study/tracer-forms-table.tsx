'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  Users,
  Globe,
  Lock,
  Archive,
  RefreshCw,
  Clock,
  Layers,
  GraduationCap,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { TracerForm, FormVisibility } from '@/types/tracer-study';
import { tracerStudyService } from '@/services/tracer-study.service';

interface TracerFormsTableProps {
  onAddNew: () => void;
  onEdit: (formId: number) => void;
  onViewResponses: (formId?: number) => void;
  onViewSingleAnalytics: (formId: number) => void;
  onViewGlobalAnalytics: () => void;
}

export default function TracerFormsTable({
  onAddNew,
  onEdit,
  onViewResponses,
  onViewSingleAnalytics,
  onViewGlobalAnalytics,
}: TracerFormsTableProps) {
  const [forms, setForms] = useState<TracerForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchForms = async () => {
    try {
      setIsLoading(true);
      const res = await tracerStudyService.getAdminForms();
      if (res.status === 'success') {
        setForms(res.data);
      }
    } catch {
      toast.error('Gagal mengambil daftar formulir dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus formulir "${title}" beserta seluruh pertanyaan dan responnya?`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await tracerStudyService.deleteAdminForm(id);
      toast.success('Formulir berhasil dihapus dari database.');
      await fetchForms();
    } catch {
      toast.error('Gagal menghapus formulir dari server.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (id: number, currentVisibility: FormVisibility) => {
    const nextVisibility: FormVisibility =
      currentVisibility === 'published' ? 'draft' : 'published';

    try {
      await tracerStudyService.updateFormVisibility(id, nextVisibility);
      toast.success(
        `Status formulir berhasil diubah menjadi: ${
          nextVisibility === 'published' ? 'PUBLIC (AKTIF)' : 'DRAFT'
        }`
      );
      await fetchForms();
    } catch {
      toast.error('Gagal memperbarui status visibilitas formulir.');
    }
  };

  // Helper function to check tempo schedule
  const getScheduleStatus = (startDate?: string | null, endDate?: string | null) => {
    if (!startDate && !endDate) return null;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (startDate && todayStr < startDate) {
      return {
        label: 'Belum Dibuka',
        colorClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dotClass: 'bg-amber-500',
      };
    }
    if (endDate && todayStr > endDate) {
      return {
        label: 'Lewat Tempo (Ditutup)',
        colorClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
        dotClass: 'bg-rose-500',
      };
    }
    return {
      label: 'Tempo Aktif',
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dotClass: 'bg-emerald-500',
    };
  };

  // Metrics
  const totalForms = forms.length;
  const activeForms = forms.filter((f) => f.visibility === 'published').length;
  const totalResponses = forms.reduce((acc, curr) => acc + (curr.responses_count || 0), 0);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ================= 3 QUICK STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Formulir Dibuat</span>
            <Layers className="w-4 h-4 text-[#0D3B82]" />
          </div>
          <div className="text-2xl font-black text-slate-800">{totalForms}</div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            Formulir kuesioner dinamis
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Formulir Aktif (Public)</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{activeForms}</div>
          <span className="text-[11px] text-emerald-700/80 font-semibold mt-0.5 block">
            Dapat diakses alumni di web
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Respon Masuk</span>
            <Users className="w-4 h-4 text-[#0D3B82]" />
          </div>
          <div className="text-2xl font-black text-[#0D3B82]">{totalResponses}</div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">
            Tercatat di MySQL XAMPP
          </span>
        </div>
      </div>

      {/* ================= TABLE ACTION HEADER ================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Tambah Data Button */}
        <button
          type="button"
          onClick={onAddNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D3B82] hover:bg-[#092B60] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Formulir Baru</span>
        </button>

        {/* Right: Lihat Analitik Seluruh Angkatan & Refresh */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onViewGlobalAnalytics}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-[#0D3B82] text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Buka dashboard statistik komparasi gaji dan status seluruh angkatan"
          >
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Lihat Analitik Seluruh Angkatan</span>
          </button>

          <button
            type="button"
            onClick={fetchForms}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer disabled:opacity-60"
            title="Segarkan data tabel"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Daftar Formulir Tracer Study</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Kelola formulir kuesioner dinamis, tempo kalender pengisian, target kelulusan, dan analitik
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
            {forms.length} Formulir
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-7 h-7 text-[#0D3B82] animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Memuat data formulir dari database...</p>
          </div>
        ) : forms.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3.5 px-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0D3B82] flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-800">Belum Ada Formulir yang Dibuat</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Mulai buat formulir kuesioner pertama Anda dengan menekan tombol di bawah.
              </p>
            </div>
            <button
              type="button"
              onClick={onAddNew}
              className="mt-1 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D3B82] hover:bg-[#092B60] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Formulir Sekarang</span>
            </button>
          </div>
        ) : (
          /* Table Responsive */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 w-12 text-center">No</th>
                  <th className="px-5 py-3.5 min-w-[240px]">Judul Formulir & Target Lulus</th>
                  <th className="px-5 py-3.5 w-44">Tempo Pengisian (Jadwal)</th>
                  <th className="px-5 py-3.5 w-32">Status</th>
                  <th className="px-5 py-3.5 w-24 text-center">Soal</th>
                  <th className="px-5 py-3.5 w-28 text-center">Responden</th>
                  <th className="px-5 py-3.5 w-44 text-center">Aksi (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {forms.map((f, idx) => {
                  const isPublished = f.visibility === 'published';
                  const isDraft = f.visibility === 'draft';
                  const isClosed = f.visibility === 'closed';
                  const schedule = getScheduleStatus(f.start_date, f.end_date);

                  return (
                    <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 text-center font-mono text-slate-400 font-semibold">
                        {idx + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#0D3B82] font-bold text-[10px] border border-blue-200/80">
                            <GraduationCap className="w-3 h-3 text-blue-600" />
                            {f.target_graduation_year
                              ? `Angkatan ${f.target_graduation_year}`
                              : 'Semua Angkatan'}
                          </span>
                        </div>
                        <div className="font-bold text-slate-800 text-xs sm:text-sm leading-snug">
                          {f.title}
                        </div>
                        {f.description ? (
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {f.description}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic mt-0.5">
                            Tanpa deskripsi
                          </div>
                        )}
                      </td>

                      {/* Tempo Pengisian Kalender */}
                      <td className="px-5 py-4">
                        {f.start_date && f.end_date ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{f.start_date}</span>
                              <span className="text-slate-400">s/d</span>
                              <span>{f.end_date}</span>
                            </div>
                            {schedule && (
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${schedule.colorClass}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${schedule.dotClass}`} />
                                {schedule.label}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Tanpa batasan tempo
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(f.id, f.visibility)}
                          title="Klik untuk beralih antara Public dan Draft"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100'
                              : isDraft
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100'
                              : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {isPublished && <Globe className="w-3 h-3 text-emerald-600 shrink-0" />}
                          {isDraft && <Lock className="w-3 h-3 text-amber-600 shrink-0" />}
                          {isClosed && <Archive className="w-3 h-3 text-slate-500 shrink-0" />}
                          <span>{f.visibility.toUpperCase()}</span>
                        </button>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="font-bold text-slate-700 font-mono">
                          {f.questions_count ?? f.questions?.length ?? 0}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">Soal</span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => onViewResponses(f.id)}
                          className="font-bold text-[#0D3B82] hover:underline font-mono cursor-pointer"
                        >
                          {f.responses_count ?? 0}
                        </button>
                        <span className="text-[11px] text-slate-400 ml-1">Respon</span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Analitik Form Ini */}
                          <button
                            type="button"
                            onClick={() => onViewSingleAnalytics(f.id)}
                            className="p-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-[#0D3B82] hover:text-indigo-900 transition-colors cursor-pointer shadow-2xs"
                            title="Lihat Analitik Formulir Ini"
                          >
                            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                          </button>

                          {/* Edit Form */}
                          <button
                            type="button"
                            onClick={() => onEdit(f.id)}
                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 text-slate-600 hover:text-blue-700 transition-colors cursor-pointer shadow-2xs"
                            title="Edit Formulir"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Lihat Respon Mentah */}
                          <button
                            type="button"
                            onClick={() => onViewResponses(f.id)}
                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer shadow-2xs"
                            title="Lihat Tabel Jawaban Responden"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Form */}
                          <button
                            type="button"
                            onClick={() => handleDelete(f.id, f.title)}
                            disabled={deletingId === f.id}
                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                            title="Hapus Formulir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
