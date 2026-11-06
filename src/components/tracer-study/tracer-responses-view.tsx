'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Users,
  RefreshCw,
  Clock,
  Layers,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  X,
  Search,
  AlertCircle,
  FileText,
  ShieldCheck,
  GraduationCap,
  ExternalLink,
  SlidersHorizontal,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { TracerForm, TracerQuestion, TracerResponse, ResponseApprovalStatus } from '@/types/tracer-study';
import { tracerStudyService } from '@/services/tracer-study.service';
import { useAuthStore } from '@/store/useAuthStore';
import { isQuestionVisible } from '@/lib/tracer-study-branching';

interface TracerResponsesViewProps {
  initialFormId?: number | null;
  onBack?: () => void;
}

export default function TracerResponsesView({
  initialFormId = null,
  onBack,
}: TracerResponsesViewProps) {
  const { user } = useAuthStore();
  const [forms, setForms] = useState<TracerForm[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(initialFormId);
  const [responses, setResponses] = useState<TracerResponse[]>([]);
  const [selectedForm, setSelectedForm] = useState<TracerForm | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedResponseId, setExpandedResponseId] = useState<number | null>(null);

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [prodiFilter, setProdiFilter] = useState<string>('all');
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [graduationYearFilter, setGraduationYearFilter] = useState<string>('all');

  // Mode filter soal saat pratinjau form: 'relevant' (hanya soal relevan/terisi) atau 'all' (semua 71 soal)
  const [viewQuestionFilter, setViewQuestionFilter] = useState<'relevant' | 'all'>('relevant');

  // Loading state per-response id saat aksi Terima/Tolak berjalan
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<number | null>(null);

  // Loading state ekspor Excel
  const [isExporting, setIsExporting] = useState(false);

  // Modal Tolak Responden
  const [rejectModalData, setRejectModalData] = useState<{
    isOpen: boolean;
    response: TracerResponse | null;
    notes: string;
  }>({
    isOpen: false,
    response: null,
    notes: '',
  });

  const fetchForms = async () => {
    try {
      setIsLoading(true);
      const res = await tracerStudyService.getAdminForms();
      if (res.status === 'success') {
        setForms(res.data);
        if (res.data.length > 0 && !selectedFormId) {
          setSelectedFormId(initialFormId || res.data[0].id);
        }
      }
    } catch {
      toast.error('Gagal mengambil daftar formulir dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResponses = async (formId: number) => {
    try {
      setIsLoading(true);
      const res = await tracerStudyService.getFormResponses(formId);
      if (res.status === 'success') {
        setSelectedForm(res.data.form);
        setResponses(res.data.responses);
      }
    } catch {
      toast.error('Gagal mengambil data respon kuesioner.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (selectedFormId) {
      fetchResponses(selectedFormId);
    }
  }, [selectedFormId]);

  // Handle Approve Responden
  const handleApprove = async (resp: TracerResponse) => {
    try {
      setIsUpdatingStatus(resp.id);
      const adminName = user?.name || 'Administrator';
      const res = await tracerStudyService.updateResponseApprovalStatus(resp.id, {
        status: 'approved',
        reviewed_by: adminName,
      });

      if (res.status === 'success') {
        toast.success(res.message || `Responden ${resp.respondent_name} berhasil diterima.`);
        setResponses((prev) =>
          prev.map((r) =>
            r.id === resp.id
              ? {
                  ...r,
                  status: 'approved',
                  reviewed_by: adminName,
                  reviewed_at: new Date().toISOString(),
                  review_notes: null,
                }
              : r
          )
        );
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal menyetujui respon mahasiswa.';
      toast.error(errorMsg);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Buka Modal Tolak
  const openRejectModal = (resp: TracerResponse) => {
    setRejectModalData({
      isOpen: true,
      response: resp,
      notes: resp.review_notes || '',
    });
  };

  // Konfirmasi Tolak Responden
  const handleRejectConfirm = async () => {
    if (!rejectModalData.response) return;
    const resp = rejectModalData.response;
    const adminName = user?.name || 'Administrator';

    try {
      setIsUpdatingStatus(resp.id);
      const res = await tracerStudyService.updateResponseApprovalStatus(resp.id, {
        status: 'rejected',
        review_notes: rejectModalData.notes.trim() || undefined,
        reviewed_by: adminName,
      });

      if (res.status === 'success') {
        toast.success(res.message || `Responden ${resp.respondent_name} berhasil ditolak.`);
        setResponses((prev) =>
          prev.map((r) =>
            r.id === resp.id
              ? {
                  ...r,
                  status: 'rejected',
                  reviewed_by: adminName,
                  reviewed_at: new Date().toISOString(),
                  review_notes: rejectModalData.notes.trim() || null,
                }
              : r
          )
        );
        setRejectModalData({ isOpen: false, response: null, notes: '' });
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal menolak respon mahasiswa.';
      toast.error(errorMsg);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Handle Export Excel Format Resmi Kemdiktisaintek 2026
  const handleExportExcel = async (exportStatus: 'approved' | 'all' = 'approved') => {
    if (!selectedFormId) return;

    if (exportStatus === 'approved' && approvedCount === 0) {
      toast.error(
        'Belum ada responden yang disetujui (Approved). Silakan setujui setidaknya 1 respon terlebih dahulu sebelum mengekspor ke Excel.'
      );
      return;
    }

    try {
      setIsExporting(true);
      toast.loading('Menyiapkan file Excel resmi Kemdiktisaintek 2026...', { id: 'export-excel' });

      const blob = await tracerStudyService.exportFormResponsesToExcel(
        selectedFormId,
        exportStatus
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeTitle = (selectedForm?.title || 'Tracer_Study')
        .replace(/[^a-zA-Z0-9_\-]/g, '_')
        .substring(0, 30);
      a.download = `Pelaporan_Tracer_Study_${safeTitle}_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('File Excel resmi Kemdiktisaintek 2026 berhasil diunduh!', {
        id: 'export-excel',
      });
    } catch (err: unknown) {
      console.error('Export Excel failed:', err);
      toast.error(
        'Gagal mengekspor file Excel. Pastikan terdapat data responden yang berstatus disetujui.',
        { id: 'export-excel' }
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Hitung jumlah status
  const totalCount = responses.length;
  const pendingCount = responses.filter((r) => (r.status || 'pending') === 'pending').length;
  const approvedCount = responses.filter((r) => r.status === 'approved').length;
  const rejectedCount = responses.filter((r) => r.status === 'rejected').length;

  // Helper untuk membangun map jawaban dari respon
  const getAnswersMap = (resp: TracerResponse) => {
    if (resp.answers_map) return resp.answers_map;
    const map: Record<
      number,
      { text?: string | null; option_ids?: number[]; selected_labels?: string[] }
    > = {};
    for (const ans of resp.answers || []) {
      map[ans.question_id] = {
        text: ans.answer_text,
        option_ids: (ans.selected_options || []).map(
          (o: { option_id?: number; id?: number }) => o.option_id || o.id || 0
        ),
        selected_labels: (ans.selected_options || []).map(
          (o: { option?: { option_label?: string }; option_label?: string }) =>
            o.option?.option_label || o.option_label || ''
        ),
      };
    }
    return map;
  };

  // Helper untuk mendapatkan status aktivitas [F8] responden
  const getRespondentActivity = (resp: TracerResponse): string => {
    const qF8 = (selectedForm?.questions || []).find((q) => q.question_text.includes('[F8]'));
    if (!qF8 || !qF8.id) return '';
    const answersMap = getAnswersMap(resp);
    const ans = answersMap[qF8.id];
    if (!ans) return '';
    const text = (ans.text || ans.selected_labels?.[0] || '').toLowerCase();
    if (text.includes('bekerja') && !text.includes('tidak') && !text.includes('belum')) return 'bekerja';
    if (text.includes('wiraswasta') || text.includes('wirausaha')) return 'wiraswasta';
    if (text.includes('pendidikan')) return 'pendidikan';
    if (text.includes('mencari')) return 'mencari';
    if (text.includes('belum memungkinkan')) return 'belum';
    return '';
  };

  const isAnyFilterActive =
    statusFilter !== 'all' ||
    searchQuery.trim() !== '' ||
    prodiFilter !== 'all' ||
    activityFilter !== 'all' ||
    graduationYearFilter !== 'all';

  const handleResetFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setProdiFilter('all');
    setActivityFilter('all');
    setGraduationYearFilter('all');
  };

  // Opsi Program Studi dinamis
  const prodiOptions = React.useMemo(() => {
    const set = new Set<string>();
    set.add('Teknik Informatika (S1)');
    set.add('Sistem Informasi (S1)');
    responses.forEach((r) => {
      if (r.prodi) set.add(r.prodi);
    });
    return Array.from(set);
  }, [responses]);

  // Opsi Angkatan dinamis
  const yearOptions = React.useMemo(() => {
    const set = new Set<string>();
    responses.forEach((r) => {
      if (r.graduation_year) set.add(String(r.graduation_year));
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [responses]);

  // Filter & Search data responden (Nama, NIM, Status, Prodi, Aktivitas F8, Angkatan)
  const filteredResponses = responses.filter((resp) => {
    // 1. Status Filter
    const currentStatus = resp.status || 'pending';
    const matchStatus = statusFilter === 'all' || currentStatus === statusFilter;

    // 2. Search Nama Mahasiswa atau NIM
    const cleanSearch = searchQuery.trim().toLowerCase();
    const matchSearch =
      !cleanSearch ||
      (resp.respondent_name && resp.respondent_name.toLowerCase().includes(cleanSearch)) ||
      (resp.nim && resp.nim.toLowerCase().includes(cleanSearch));

    // 3. Prodi Filter
    const matchProdi =
      prodiFilter === 'all' ||
      (resp.prodi && resp.prodi.toLowerCase().includes(prodiFilter.toLowerCase()));

    // 4. Aktivitas F8 Filter
    let matchActivity = true;
    if (activityFilter !== 'all') {
      const act = getRespondentActivity(resp);
      matchActivity = act === activityFilter;
    }

    // 5. Angkatan Filter
    const matchYear =
      graduationYearFilter === 'all' ||
      String(resp.graduation_year) === graduationYearFilter;

    return matchStatus && matchSearch && matchProdi && matchActivity && matchYear;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs mr-1"
            >
              <ArrowLeft className="w-4 h-4 text-[#0D3B82]" />
              <span>Kembali ke Daftar</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
            <Layers className="w-4 h-4 text-[#0D3B82]" />
            <span>Pilih Kuesioner:</span>
            <select
              value={selectedFormId || ''}
              onChange={(e) => setSelectedFormId(Number(e.target.value))}
              className="bg-transparent font-bold text-[#0D3B82] outline-none cursor-pointer max-w-[280px] truncate"
            >
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title} ({f.responses_count || 0} Responden)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Export Excel Format Resmi Kemdiktisaintek */}
          <button
            type="button"
            onClick={() => handleExportExcel('approved')}
            disabled={isExporting}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
              approvedCount > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            } disabled:opacity-50`}
            title={
              approvedCount > 0
                ? `Unduh file Excel resmi Kemdiktisaintek 2026 (${approvedCount} responden disetujui)`
                : 'Ekspor Excel (Diperlukan minimal 1 respon disetujui)'
            }
          >
            {isExporting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5" />
            )}
            <span>Export Excel</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono leading-none ${
                approvedCount > 0 ? 'bg-white/25 text-white' : 'bg-emerald-200/80 text-emerald-900'
              }`}
            >
              {approvedCount} Approved
            </span>
          </button>

          <button
            type="button"
            onClick={() => selectedFormId && fetchResponses(selectedFormId)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#0D3B82]' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Status Approval Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Masuk */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Responden Masuk</span>
            <Users className="w-4 h-4 text-[#0D3B82]" />
          </div>
          <div className="text-2xl font-black text-slate-800">{totalCount}</div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            Semua respon kuesioner
          </span>
        </div>

        {/* Menunggu Review (Pending) */}
        <div
          onClick={() => setStatusFilter('pending')}
          className={`bg-white border rounded-2xl p-5 shadow-xs cursor-pointer transition-all ${
            statusFilter === 'pending'
              ? 'border-amber-400 ring-2 ring-amber-100'
              : 'border-slate-200/90 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Menunggu Approval</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
          <span className="text-[11px] text-amber-700 font-medium mt-0.5 block">
            Perlu ditinjau oleh Admin
          </span>
        </div>

        {/* Disetujui (Approved) */}
        <div
          onClick={() => setStatusFilter('approved')}
          className={`bg-white border rounded-2xl p-5 shadow-xs cursor-pointer transition-all ${
            statusFilter === 'approved'
              ? 'border-emerald-400 ring-2 ring-emerald-100'
              : 'border-slate-200/90 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Responden Disetujui</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{approvedCount}</div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-emerald-700 font-medium">
              Valid & siap diekspor
            </span>
            {approvedCount > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleExportExcel('approved');
                }}
                className="text-[11px] font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer flex items-center gap-1"
                title="Unduh langsung file Excel responden disetujui"
              >
                <span>Unduh Excel</span>
                <Download className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Ditolak (Rejected) */}
        <div
          onClick={() => setStatusFilter('rejected')}
          className={`bg-white border rounded-2xl p-5 shadow-xs cursor-pointer transition-all ${
            statusFilter === 'rejected'
              ? 'border-rose-400 ring-2 ring-rose-100'
              : 'border-slate-200/90 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Responden Ditolak</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{rejectedCount}</div>
          <span className="text-[11px] text-rose-700 font-medium mt-0.5 block">
            Jawaban tidak memenuhi kriteria
          </span>
        </div>
      </div>

      {/* Main Table & Filter Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Toolbar: Filter Tabs, Search & Dropdowns */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-3.5">
          {/* Baris 1: Status Tabs & Counter Indikator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  statusFilter === 'all'
                    ? 'bg-[#0D3B82] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Semua ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending ({pendingCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  statusFilter === 'approved'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Disetujui ({approvedCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  statusFilter === 'rejected'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Ditolak ({rejectedCount})</span>
              </button>
            </div>

            {/* Counter Hasil Pencarian/Filter */}
            <div className="text-[11px] font-semibold text-slate-500 shrink-0 self-end sm:self-center">
              Menampilkan <span className="text-[#0D3B82] font-bold">{filteredResponses.length}</span> dari {totalCount} responden
            </div>
          </div>

          {/* Baris 2: Controls Search Nama/NIM & Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
            {/* Search Box Nama Mahasiswa / NIM */}
            <div className="lg:col-span-5 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama mahasiswa atau NIM..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 focus:border-[#0D3B82] focus:ring-1 focus:ring-[#0D3B82]/20 rounded-xl outline-none text-slate-800 shadow-2xs placeholder:text-slate-400 font-medium transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Filter Program Studi */}
            <div className="lg:col-span-3">
              <select
                value={prodiFilter}
                onChange={(e) => setProdiFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-[#0D3B82] rounded-xl outline-none text-slate-700 shadow-2xs font-semibold cursor-pointer"
              >
                <option value="all">Semua Program Studi</option>
                {prodiOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown Filter Aktivitas F8 */}
            <div className="lg:col-span-3">
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-[#0D3B82] rounded-xl outline-none text-slate-700 shadow-2xs font-semibold cursor-pointer"
              >
                <option value="all">Semua Aktivitas (F8)</option>
                <option value="bekerja">(1) Bekerja</option>
                <option value="wiraswasta">(3) Wiraswasta</option>
                <option value="pendidikan">(4) Melanjutkan Pendidikan</option>
                <option value="mencari">(5) Mencari Kerja</option>
                <option value="belum">(2) Belum Memungkinkan</option>
              </select>
            </div>

            {/* Tombol Reset Filter */}
            {isAnyFilterActive && (
              <div className="lg:col-span-1 flex items-center">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Reset semua filter dan pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="lg:hidden text-[11px]">Reset</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Responses List */}
        {filteredResponses.length === 0 ? (
          <div className="py-14 text-center px-4">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">
              {responses.length === 0
                ? 'Belum ada mahasiswa yang mengirimkan jawaban untuk formulir ini.'
                : 'Tidak ada responden yang sesuai dengan kriteria filter atau pencarian.'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
              {responses.length === 0
                ? 'Tanggapan mahasiswa yang masuk akan ditampilkan di sini untuk ditinjau oleh admin.'
                : 'Silakan periksa kembali ejaan nama mahasiswa/NIM, atau klik tombol di bawah untuk mereset seluruh filter.'}
            </p>
            {responses.length > 0 && isAnyFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0D3B82] hover:bg-[#092B60] text-white shadow-2xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Semua Filter & Pencarian</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredResponses.map((resp) => {
              const isExpanded = expandedResponseId === resp.id;
              const status: ResponseApprovalStatus = resp.status || 'pending';
              const isPending = status === 'pending';
              const isApproved = status === 'approved';
              const isRejected = status === 'rejected';
              const isThisUpdating = isUpdatingStatus === resp.id;

              const answersMap = getAnswersMap(resp);
              const formQuestions: TracerQuestion[] = selectedForm?.questions || [];

              // Saring daftar pertanyaan: apakah hanya yang relevan / terisi atau seluruhnya
              const visibleQuestions = formQuestions.filter((q) => {
                if (viewQuestionFilter === 'all') return true;
                const ans = answersMap[q.id || 0];
                const hasAnswer = Boolean(
                  ans && (ans.text || (ans.option_ids && ans.option_ids.length > 0))
                );
                if (hasAnswer) return true;
                return isQuestionVisible(q, answersMap as any, formQuestions);
              });

              return (
                <div key={resp.id} className="transition-colors">
                  {/* Respondent Row Header */}
                  <div className="px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                    {/* Left: Info Mahasiswa */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl font-black text-xs flex items-center justify-center shrink-0 font-mono shadow-2xs ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isRejected
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {resp.nim.slice(-3)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                            {resp.respondent_name}
                          </h4>
                          <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                            NIM: {resp.nim}
                          </span>

                          {/* Approval Status Badge */}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-500" />
                              <span>Menunggu Review</span>
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Disetujui</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Ditolak</span>
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-400 mt-1">
                          <span className="text-slate-600 font-medium">
                            {resp.prodi || 'Teknik Informatika'}
                          </span>
                          <span>•</span>
                          <span>Lulus: {resp.graduation_year || '-'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(resp.submitted_at).toLocaleString('id-ID')}
                          </span>
                          {resp.reviewed_by && (
                            <>
                              <span>•</span>
                              <span className="text-slate-500 font-medium">
                                Direview oleh: <strong className="text-slate-700">{resp.reviewed_by}</strong>
                              </span>
                            </>
                          )}
                        </div>

                        {/* Catatan Penolakan (Jika Ada) */}
                        {isRejected && resp.review_notes && (
                          <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-rose-700 bg-rose-50/80 border border-rose-200/80 px-2.5 py-1 rounded-lg">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <span>
                              <strong>Alasan Penolakan:</strong> {resp.review_notes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: ACTION BUTTONS (Lihat Jawaban, Terima, Tolak) */}
                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                      {/* Tombol Lihat Jawaban */}
                      <button
                        type="button"
                        onClick={() => setExpandedResponseId(isExpanded ? null : resp.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                          isExpanded
                            ? 'bg-[#0D3B82] text-white border-[#0D3B82]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                        title="Lihat formulir kuesioner dengan jawaban yang dipilih responden"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'Tutup Formulir' : 'Lihat Jawaban'}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        )}
                      </button>

                      {/* Tombol Terima (Approve) */}
                      <button
                        type="button"
                        onClick={() => handleApprove(resp)}
                        disabled={isThisUpdating || isApproved}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 cursor-default opacity-85'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:border-emerald-700'
                        } disabled:opacity-50`}
                        title={isApproved ? 'Responden sudah disetujui' : 'Setujui / Terima respon mahasiswa'}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isApproved ? 'Diterima' : 'Terima'}</span>
                      </button>

                      {/* Tombol Tolak (Reject) */}
                      <button
                        type="button"
                        onClick={() => openRejectModal(resp)}
                        disabled={isThisUpdating}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                          isRejected
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-white hover:bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-300'
                        } disabled:opacity-50`}
                        title="Tolak respon mahasiswa"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{isRejected ? 'Ubah Penolakan' : 'Tolak'}</span>
                      </button>
                    </div>
                  </div>

                  {/* ================= FORMULAR VIEW (PERSIS FORMULIR ASLI) ================= */}
                  {isExpanded && (
                    <div className="px-5 sm:px-8 py-6 bg-slate-100/70 border-t border-slate-200 space-y-5 animate-in fade-in-50 duration-200">
                      {/* Top Action Ribbon inside Expanded Detail */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0D3B82]" />
                            <h4 className="text-sm font-bold text-slate-800">
                              Pratinjau Kuesioner Mahasiswa: {resp.respondent_name}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500">
                            NIM: <strong className="text-slate-700">{resp.nim}</strong> • Program Studi:{' '}
                            <strong className="text-slate-700">{resp.prodi}</strong> • Angkatan:{' '}
                            <strong className="text-slate-700">{resp.graduation_year || '-'}</strong>
                          </p>
                        </div>

                        {/* Controls & Quick Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center">
                          {/* Filter mode soal */}
                          <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50 text-[11px] font-bold">
                            <button
                              type="button"
                              onClick={() => setViewQuestionFilter('relevant')}
                              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                viewQuestionFilter === 'relevant'
                                  ? 'bg-[#0D3B82] text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Soal Relevan ({visibleQuestions.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewQuestionFilter('all')}
                              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                viewQuestionFilter === 'all'
                                  ? 'bg-[#0D3B82] text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Semua Soal ({formQuestions.length})
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleApprove(resp)}
                            disabled={isThisUpdating || isApproved}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                              isApproved
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default opacity-90'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            } disabled:opacity-50`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isApproved ? 'Sudah Diterima' : 'Terima Responden'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openRejectModal(resp)}
                            disabled={isThisUpdating}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer transition-colors shadow-2xs disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{isRejected ? 'Ubah Penolakan' : 'Tolak Responden'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Question Cards (Read-Only Formulir Asli) */}
                      <div className="space-y-4">
                        {visibleQuestions.length > 0 ? (
                          visibleQuestions.map((q, qIdx) => {
                            const qId = q.id || 0;
                            const ans = answersMap[qId];
                            const hasAnswer = Boolean(
                              ans && (ans.text || (ans.option_ids && ans.option_ids.length > 0))
                            );

                            return (
                              <div
                                key={qId || qIdx}
                                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3.5"
                              >
                                {/* Header Soal */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-1">
                                    <h5 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                                      <span className="font-mono text-slate-400 mr-2">
                                        {qIdx + 1}.
                                      </span>
                                      {q.question_text}
                                      {q.is_required && (
                                        <span className="text-rose-500 ml-1 font-bold">*</span>
                                      )}
                                    </h5>
                                    {q.help_text && (
                                      <p className="text-xs text-slate-400 italic">
                                        {q.help_text}
                                      </p>
                                    )}
                                  </div>

                                  {/* Badge status keterisian */}
                                  <div className="shrink-0">
                                    {hasAnswer ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <Check className="w-3 h-3 text-emerald-600" />
                                        <span>Terisi</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-400 border border-slate-200">
                                        Dilewati
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Body Opsi: Radio (Pilihan Tunggal) */}
                                {q.question_type === 'radio' && (
                                  <div className="space-y-2 pt-1">
                                    {(q.options || []).map((opt) => {
                                      const isSelected = Boolean(
                                        opt.id && ans?.option_ids?.includes(opt.id)
                                      );

                                      return (
                                        <div
                                          key={opt.id}
                                          className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-colors ${
                                            isSelected
                                              ? 'bg-blue-50/80 border-blue-400 text-[#0D3B82] font-bold shadow-2xs ring-1 ring-blue-200'
                                              : 'bg-slate-50/40 border-slate-200/70 text-slate-500 opacity-70'
                                          }`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <div
                                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                                isSelected
                                                  ? 'border-[#0D3B82] bg-white'
                                                  : 'border-slate-300'
                                              }`}
                                            >
                                              {isSelected && (
                                                <div className="w-2 h-2 rounded-full bg-[#0D3B82]" />
                                              )}
                                            </div>
                                            <span>{opt.option_label}</span>
                                          </div>

                                          {isSelected && (
                                            <span className="text-[10px] font-bold bg-[#0D3B82] text-white px-2 py-0.5 rounded-full">
                                              Pilihan Responden
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Body Opsi: Checkbox (Pilihan Ganda) */}
                                {q.question_type === 'checkbox' && (
                                  <div className="space-y-2 pt-1">
                                    {(q.options || []).map((opt) => {
                                      const isChecked = Boolean(
                                        opt.id && ans?.option_ids?.includes(opt.id)
                                      );

                                      return (
                                        <div
                                          key={opt.id}
                                          className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-colors ${
                                            isChecked
                                              ? 'bg-blue-50/80 border-blue-400 text-[#0D3B82] font-bold shadow-2xs ring-1 ring-blue-200'
                                              : 'bg-slate-50/40 border-slate-200/70 text-slate-500 opacity-70'
                                          }`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <div
                                              className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                                                isChecked
                                                  ? 'bg-[#0D3B82] text-white'
                                                  : 'border border-slate-300 bg-white'
                                              }`}
                                            >
                                              {isChecked && (
                                                <Check className="w-3 h-3 stroke-[3]" />
                                              )}
                                            </div>
                                            <span>{opt.option_label}</span>
                                          </div>

                                          {isChecked && (
                                            <span className="text-[10px] font-bold bg-[#0D3B82] text-white px-2 py-0.5 rounded-full">
                                              Dipilih
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Body Opsi: Dropdown */}
                                {q.question_type === 'dropdown' && (
                                  <div className="space-y-2 pt-1">
                                    <div className="space-y-1.5">
                                      {(q.options || []).map((opt) => {
                                        const isSelected = Boolean(
                                          opt.id && ans?.option_ids?.includes(opt.id)
                                        );

                                        return isSelected ? (
                                          <div
                                            key={opt.id}
                                            className="flex items-center justify-between p-3 rounded-xl border border-blue-400 bg-blue-50/80 text-[#0D3B82] font-bold text-xs shadow-2xs ring-1 ring-blue-200"
                                          >
                                            <div className="flex items-center gap-2">
                                              <Check className="w-3.5 h-3.5 text-[#0D3B82]" />
                                              <span>{opt.option_label}</span>
                                            </div>
                                            <span className="text-[10px] font-bold bg-[#0D3B82] text-white px-2 py-0.5 rounded-full">
                                              Pilihan Responden
                                            </span>
                                          </div>
                                        ) : (
                                          <div
                                            key={opt.id}
                                            className="px-3 py-2 rounded-xl border border-slate-100 bg-slate-50/30 text-slate-400 text-xs opacity-60"
                                          >
                                            {opt.option_label}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Body Opsi: Scale (Rating 1 - 5) */}
                                {q.question_type === 'scale' && (
                                  <div className="pt-2">
                                    <div className="flex items-center gap-2.5">
                                      {[1, 2, 3, 4, 5].map((val) => {
                                        const isSelected =
                                          ans?.text === String(val) ||
                                          ans?.selected_labels?.some((l) =>
                                            l.includes(String(val))
                                          );

                                        return (
                                          <div
                                            key={val}
                                            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs border transition-all ${
                                              isSelected
                                                ? 'bg-[#0D3B82] text-white border-[#0D3B82] ring-3 ring-blue-100 shadow-xs'
                                                : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                                            }`}
                                          >
                                            {val}
                                          </div>
                                        );
                                      })}
                                    </div>
                                    <div className="flex justify-between max-w-[240px] text-[10px] text-slate-400 font-medium mt-1.5 px-1">
                                      <span>1 = Sangat Rendah</span>
                                      <span>5 = Sangat Tinggi</span>
                                    </div>
                                  </div>
                                )}

                                {/* Body Opsi: Short Text / Long Text / Date */}
                                {['short_text', 'long_text', 'date'].includes(q.question_type) && (
                                  <div className="pt-1">
                                    {ans?.text ? (
                                      <div className="p-3.5 bg-blue-50/60 border border-blue-200/90 rounded-xl flex items-start justify-between gap-3 shadow-2xs">
                                        <div className="space-y-0.5">
                                          <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">
                                            Jawaban Isian Mahasiswa:
                                          </span>
                                          <div className="text-slate-900 text-xs sm:text-sm font-semibold whitespace-pre-wrap">
                                            {ans.text}
                                          </div>
                                        </div>
                                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                      </div>
                                    ) : (
                                      <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-xs text-slate-400 italic">
                                        Tidak ada jawaban teks yang diisi (dilewati)
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-8 text-center text-xs text-slate-400 italic bg-white rounded-2xl border border-slate-200">
                            Tidak ada pertanyaan yang tersedia untuk formulir ini.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= MODAL TOLAK RESPONDEN ================= */}
      {rejectModalData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-rose-600">
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Tolak Responden</h3>
                  <p className="text-[11px] text-slate-400">Verifikasi penolakan kuesioner mahasiswa</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRejectModalData({ isOpen: false, response: null, notes: '' })}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                <div className="text-slate-500">Mahasiswa:</div>
                <div className="font-bold text-slate-800">
                  {rejectModalData.response?.respondent_name}
                </div>
                <div className="font-mono text-slate-500">
                  NIM: {rejectModalData.response?.nim} • {rejectModalData.response?.prodi}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alasan / Catatan Penolakan (Opsional):
                </label>
                <textarea
                  value={rejectModalData.notes}
                  onChange={(e) =>
                    setRejectModalData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Contoh: Jawaban tidak lengkap, data pekerjaan tidak valid..."
                  rows={3}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-rose-500 text-xs shadow-2xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Catatan ini akan tersimpan dan dapat dilihat kembali oleh admin.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectModalData({ isOpen: false, response: null, notes: '' })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={isUpdatingStatus !== null}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-2xs disabled:opacity-50 flex items-center gap-1.5"
              >
                {isUpdatingStatus !== null ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                <span>Konfirmasi Tolak</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
