'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Save,
  Eye,
  HelpCircle,
  FileText,
  AlignLeft,
  CircleDot,
  CheckSquare,
  ListFilter,
  Star,
  Calendar,
  Layers,
  Globe,
  Lock,
  Archive,
  RefreshCw,
  Sparkles,
  GraduationCap,
  Clock,
  Tag,
  AlertCircle,
} from 'lucide-react';
import {
  QuestionType,
  FormVisibility,
  TracerQuestion,
  TracerForm,
  CreateFormPayload,
  MetricTag,
} from '@/types/tracer-study';
import { tracerStudyService } from '@/services/tracer-study.service';
import { KEMDIKTISAINTEK_TEMPLATE_QUESTIONS } from '@/constants/kemdiktisaintek-template';

interface TracerFormBuilderProps {
  initialFormId?: number | 'new';
  onFormSaved?: () => void;
  onBack?: () => void;
}

const QUESTION_TYPES: { type: QuestionType; label: string; icon: React.ElementType }[] = [
  { type: 'short_text', label: 'Jawaban Singkat', icon: AlignLeft },
  { type: 'long_text', label: 'Paragraf', icon: FileText },
  { type: 'radio', label: 'Pilihan Ganda', icon: CircleDot },
  { type: 'checkbox', label: 'Kotak Centang', icon: CheckSquare },
  { type: 'dropdown', label: 'Dropdown', icon: ListFilter },
  { type: 'scale', label: 'Skala Penilaian (1-5)', icon: Star },
  { type: 'date', label: 'Tanggal', icon: Calendar },
];

const METRIC_TAG_OPTIONS: { value: MetricTag | ''; label: string; icon: string }[] = [
  { value: '', label: '(Umum / Tidak Ditag Metrik)', icon: '📝' },
  { value: 'salary', label: 'Pendapatan / Gaji Alumni (salary)', icon: '💰' },
  { value: 'employment_status', label: 'Status Kebekerjaan (employment_status)', icon: '💼' },
  { value: 'waiting_time', label: 'Waktu Tunggu Kerja (waiting_time)', icon: '⏱️' },
  { value: 'study_relevance', label: 'Relevansi Bidang Studi (study_relevance)', icon: '🎯' },
];

const GRADUATION_YEARS = ['Semua Angkatan', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];

export default function TracerFormBuilder({
  initialFormId = 'new',
  onFormSaved,
  onBack,
}: TracerFormBuilderProps) {
  const [forms, setForms] = useState<TracerForm[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<number | 'new'>(initialFormId);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Form Settings State
  const [title, setTitle] = useState('Kuesioner Tracer Study Alumni STMIK TIME');
  const [description, setDescription] = useState(
    'Formulir pelacakan jejak alumni untuk peningkatan mutu kurikulum dan akreditasi program studi STMIK TIME.'
  );
  const [targetGraduationYear, setTargetGraduationYear] = useState<string>('2024');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [visibility, setVisibility] = useState<FormVisibility>('published');

  // Questions State
  const [questions, setQuestions] = useState<TracerQuestion[]>([
    {
      question_text: 'Apa status pekerjaan Anda saat ini?',
      help_text: 'Pilih status aktivitas utama pasca kelulusan dari STMIK TIME',
      question_type: 'radio',
      metric_tag: 'employment_status',
      is_required: true,
      order_index: 0,
      options: [
        { option_label: 'Bekerja (Penuh Waktu / Full Time)', order_index: 0 },
        { option_label: 'Bekerja (Paruh Waktu / Freelance)', order_index: 1 },
        { option_label: 'Wiraswasta / Wirausaha Mandiri', order_index: 2 },
        { option_label: 'Melanjutkan Studi (S2)', order_index: 3 },
        { option_label: 'Sedang Mencari Kerja', order_index: 4 },
      ],
    },
    {
      question_text: 'Berapa rata-rata pendapatan / gaji kotor Anda per bulan dari pekerjaan utama?',
      help_text: 'Termasuk gaji pokok dan tunjangan tetap (Standar Akreditasi Dikti)',
      question_type: 'radio',
      metric_tag: 'salary',
      is_required: true,
      order_index: 1,
      options: [
        { option_label: '< Rp 3.000.000', order_index: 0 },
        { option_label: 'Rp 3.000.000 - Rp 5.000.000', order_index: 1 },
        { option_label: 'Rp 5.000.000 - Rp 10.000.000', order_index: 2 },
        { option_label: '> Rp 10.000.000', order_index: 3 },
      ],
    },
    {
      question_text: 'Berapa lama waktu tunggu hingga Anda mendapatkan pekerjaan pertama?',
      help_text: 'Dihitung sejak tanggal wisuda kelulusan',
      question_type: 'dropdown',
      metric_tag: 'waiting_time',
      is_required: true,
      order_index: 2,
      options: [
        { option_label: 'Kurang dari 3 bulan', order_index: 0 },
        { option_label: '3 s/d 6 bulan', order_index: 1 },
        { option_label: '6 s/d 12 bulan', order_index: 2 },
        { option_label: 'Lebih dari 1 tahun', order_index: 3 },
      ],
    },
    {
      question_text: 'Seberapa relevan kurikulum di STMIK TIME dengan pekerjaan Anda saat ini?',
      help_text: 'Nilai dari skala 1 (Sangat Tidak Relevan) hingga 5 (Sangat Relevan)',
      question_type: 'scale',
      metric_tag: 'study_relevance',
      is_required: true,
      order_index: 3,
      options: [
        { option_label: '1 - Tidak Relevan', order_index: 0 },
        { option_label: '2 - Kurang Relevan', order_index: 1 },
        { option_label: '3 - Cukup Relevan', order_index: 2 },
        { option_label: '4 - Relevan', order_index: 3 },
        { option_label: '5 - Sangat Relevan', order_index: 4 },
      ],
    },
    {
      question_text: 'Nama Perusahaan / Instansi Tempat Bekerja',
      help_text: 'Isi dengan "-" jika belum bekerja atau berwirausaha mandiri',
      question_type: 'short_text',
      is_required: false,
      order_index: 4,
    },
    {
      question_text: 'Saran dan masukan untuk kemajuan almamater STMIK TIME',
      help_text: 'Tuliskan masukan konstruktif untuk pengembangan fasilitas dan kurikulum',
      question_type: 'long_text',
      is_required: false,
      order_index: 5,
    },
  ]);

  // Load existing forms list from backend
  const fetchForms = async () => {
    try {
      setIsLoading(true);
      const res = await tracerStudyService.getAdminForms();
      if (res.status === 'success') {
        setForms(res.data);
      }
    } catch {
      // Backend offline or error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
    if (initialFormId) {
      handleSelectForm(initialFormId);
    }
  }, [initialFormId]);

  const handleSelectForm = async (id: number | 'new') => {
    setSelectedFormId(id);
    if (id === 'new') {
      setTitle('Kuesioner Tracer Study Baru');
      setDescription('');
      setTargetGraduationYear('2024');
      setStartDate('');
      setEndDate('');
      setVisibility('draft');
      setQuestions([
        {
          question_text: 'Pertanyaan Baru',
          help_text: '',
          question_type: 'short_text',
          is_required: false,
          order_index: 0,
        },
      ]);
      return;
    }

    try {
      setIsLoading(true);
      const res = await tracerStudyService.getAdminFormDetail(id);
      if (res.status === 'success' && res.data) {
        setTitle(res.data.title);
        setDescription(res.data.description || '');
        setTargetGraduationYear(res.data.target_graduation_year || 'Semua Angkatan');
        setStartDate(res.data.start_date ? String(res.data.start_date).slice(0, 10) : '');
        setEndDate(res.data.end_date ? String(res.data.end_date).slice(0, 10) : '');
        setVisibility(res.data.visibility);
        setQuestions(res.data.questions || []);
      }
    } catch {
      toast.error('Gagal mengambil detail formulir dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Question manipulation
  const addQuestion = () => {
    const newQ: TracerQuestion = {
      question_text: `Pertanyaan #${questions.length + 1}`,
      help_text: '',
      question_type: 'radio',
      is_required: true,
      order_index: questions.length,
      options: [
        { option_label: 'Opsi 1', order_index: 0 },
        { option_label: 'Opsi 2', order_index: 1 },
      ],
    };
    setQuestions([...questions, newQ]);
  };

  const updateQuestion = (index: number, updates: Partial<TracerQuestion>) => {
    const next = [...questions];
    next[index] = { ...next[index], ...updates };
    setQuestions(next);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast.info('Formulir harus memiliki minimal 1 pertanyaan.');
      return;
    }
    const next = questions.filter((_, i) => i !== index);
    setQuestions(next.map((q, idx) => ({ ...q, order_index: idx })));
  };

  const duplicateQuestion = (index: number) => {
    const target = questions[index];
    const duplicated: TracerQuestion = {
      ...target,
      id: undefined,
      question_text: `${target.question_text} (Salinan)`,
      order_index: index + 1,
      options: target.options ? target.options.map((opt) => ({ ...opt, id: undefined })) : [],
    };
    const next = [...questions];
    next.splice(index + 1, 0, duplicated);
    setQuestions(next.map((q, idx) => ({ ...q, order_index: idx })));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const next = [...questions];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    setQuestions(next.map((q, idx) => ({ ...q, order_index: idx })));
  };

  // Option manipulation
  const addOption = (qIndex: number) => {
    const q = questions[qIndex];
    const currentOptions = q.options || [];
    const newOpt = {
      option_label: `Opsi ${currentOptions.length + 1}`,
      order_index: currentOptions.length,
    };
    updateQuestion(qIndex, { options: [...currentOptions, newOpt] });
  };

  const updateOption = (qIndex: number, optIndex: number, label: string) => {
    const q = questions[qIndex];
    if (!q.options) return;
    const nextOpts = [...q.options];
    nextOpts[optIndex] = {
      ...nextOpts[optIndex],
      option_label: label,
      option_value: label,
    };
    updateQuestion(qIndex, { options: nextOpts });
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const q = questions[qIndex];
    if (!q.options || q.options.length <= 1) {
      toast.info('Pilihan ganda minimal harus memiliki 1 opsi.');
      return;
    }
    const nextOpts = q.options.filter((_, i) => i !== optIndex);
    updateQuestion(qIndex, {
      options: nextOpts.map((opt, i) => ({ ...opt, order_index: i })),
    });
  };

  // Preset Template Kemdiktisaintek Injector
  const handleInsertDiktiTemplate = () => {
    setTitle('Kuesioner Tracer Study Kemdiktisaintek 2026 (Lulusan 2025)');
    setDescription(
      'Kuesioner pelacakan jejak alumni berstandar resmi Kemdiktisaintek untuk lulusan perguruan tinggi.'
    );
    setTargetGraduationYear('Semua Angkatan');
    const clonedQuestions = KEMDIKTISAINTEK_TEMPLATE_QUESTIONS.map((q, idx) => ({
      ...q,
      order_index: idx,
      options: q.options ? q.options.map((opt, oIdx) => ({ ...opt, order_index: oIdx })) : undefined,
    }));
    setQuestions(clonedQuestions);
    toast.success(
      'Paket kuesioner resmi Kemdiktisaintek (71 instrumen soal F8-F37) berhasil diterapkan!'
    );
  };

  // Save form handler
  const handleSaveForm = async () => {
    if (!title.trim()) {
      toast.error('Judul formulir tidak boleh kosong.');
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      toast.error('Tanggal mulai tempo tidak boleh lebih besar dari tanggal selesai!');
      return;
    }

    const payload: CreateFormPayload = {
      title,
      description,
      target_graduation_year:
        targetGraduationYear === 'Semua Angkatan' ? null : targetGraduationYear || null,
      start_date: startDate || null,
      end_date: endDate || null,
      visibility,
      questions: questions.map((q, idx) => ({
        question_text: q.question_text,
        help_text: q.help_text,
        question_type: q.question_type,
        metric_tag: q.metric_tag || null,
        is_required: q.is_required,
        order_index: idx,
        options: q.options?.map((opt, oIdx) => ({
          option_label: opt.option_label,
          option_value: opt.option_value || opt.option_label,
          order_index: oIdx,
        })),
      })),
    };

    try {
      setIsSaving(true);
      if (selectedFormId === 'new') {
        const res = await tracerStudyService.createAdminForm(payload);
        toast.success('Formulir Tracer Study baru berhasil disimpan ke database!');
        setSelectedFormId(res.data.id);
      } else {
        await tracerStudyService.updateAdminForm(selectedFormId, payload);
        toast.success('Perubahan formulir berhasil disimpan!');
      }
      await fetchForms();
      if (onFormSaved) onFormSaved();
    } catch {
      toast.error('Gagal menyimpan formulir kuesioner.');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick visibility toggle
  const handleToggleVisibility = async (newVisibility: FormVisibility) => {
    setVisibility(newVisibility);
    if (selectedFormId !== 'new') {
      try {
        await tracerStudyService.updateFormVisibility(selectedFormId, newVisibility);
        toast.success(`Status visibilitas diubah menjadi: ${newVisibility.toUpperCase()}`);
        await fetchForms();
      } catch {
        toast.error('Gagal memperbarui status visibilitas formulir.');
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ================= TOP TOOLBAR ================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
            <span>Pilih Formulir:</span>
            <select
              value={selectedFormId}
              onChange={(e) =>
                handleSelectForm(e.target.value === 'new' ? 'new' : Number(e.target.value))
              }
              className="bg-transparent font-bold text-[#0D3B82] outline-none cursor-pointer"
            >
              <option value="new">+ Buat Formulir Baru</option>
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title} ({f.visibility.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Visibility Indicator & Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => handleToggleVisibility('published')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                visibility === 'published'
                  ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public (Aktif)</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleVisibility('draft')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                visibility === 'draft'
                  ? 'bg-amber-500 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleVisibility('closed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                visibility === 'closed'
                  ? 'bg-slate-700 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Closed</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              previewMode
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-4 h-4 text-[#0D3B82]" />
            <span>{previewMode ? 'Kembali ke Editor' : 'Pratinjau Mahasiswa'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveForm}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0D3B82] hover:bg-[#092B60] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Formulir'}</span>
          </button>
        </div>
      </div>

      {/* ================= PREVIEW MODE ================= */}
      {previewMode ? (
        <div className="bg-white border border-blue-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Pratinjau Tampilan Mahasiswa (Target: {targetGraduationYear})</span>
            </div>
            {startDate && endDate && (
              <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                Tempo: {startDate} s/d {endDate}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line border-b border-slate-100 pb-5">
              {description}
            </p>
          )}

          <div className="mt-6 space-y-6">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-800">
                    <span className="text-slate-400 font-mono mr-1.5">{idx + 1}.</span>
                    {q.question_text}
                    {q.is_required && <span className="text-rose-500 ml-1 font-bold">*</span>}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                    {QUESTION_TYPES.find((t) => t.type === q.question_type)?.label}
                  </span>
                </div>
                {q.help_text && <p className="text-xs text-slate-500 italic">{q.help_text}</p>}

                {/* Input Simulation */}
                <div className="pt-1">
                  {q.question_type === 'short_text' && (
                    <input
                      disabled
                      placeholder="Jawaban teks singkat..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-600 cursor-not-allowed"
                    />
                  )}
                  {q.question_type === 'long_text' && (
                    <textarea
                      disabled
                      rows={3}
                      placeholder="Jawaban teks panjang..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-600 cursor-not-allowed"
                    />
                  )}
                  {q.question_type === 'radio' && (
                    <div className="space-y-2">
                      {q.options?.map((opt, oIdx) => (
                        <label
                          key={oIdx}
                          className="flex items-center gap-2.5 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60"
                        >
                          <input type="radio" disabled name={`preview_q_${idx}`} />
                          <span>{opt.option_label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.question_type === 'checkbox' && (
                    <div className="space-y-2">
                      {q.options?.map((opt, oIdx) => (
                        <label
                          key={oIdx}
                          className="flex items-center gap-2.5 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60"
                        >
                          <input type="checkbox" disabled />
                          <span>{opt.option_label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.question_type === 'dropdown' && (
                    <select
                      disabled
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-600 cursor-not-allowed"
                    >
                      <option>-- Pilih Salah Satu --</option>
                      {q.options?.map((opt, oIdx) => (
                        <option key={oIdx}>{opt.option_label}</option>
                      ))}
                    </select>
                  )}
                  {q.question_type === 'scale' && (
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <div
                          key={val}
                          className="flex-1 min-w-[50px] text-center p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700"
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.question_type === 'date' && (
                    <input
                      type="date"
                      disabled
                      className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-600 cursor-not-allowed"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ================= GOOGLE FORM BUILDER EDITOR ================= */
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-5">
          {/* ================= FORM HEADER & SETTINGS CARD ================= */}
          <div className="bg-white border-t-8 border-t-[#0D3B82] border-x border-b border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs relative space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Judul Formulir
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul Formulir Kuesioner..."
                className="text-xl sm:text-2xl font-bold text-slate-800 w-full outline-none border-b border-slate-200 focus:border-[#0D3B82] pb-1.5 transition-colors placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Deskripsi / Petunjuk Pengisian
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Deskripsi atau petunjuk pengisian formulir..."
                className="text-xs sm:text-sm text-slate-600 w-full outline-none border-b border-slate-200 focus:border-blue-300 pt-1 transition-colors placeholder:text-slate-300 resize-none"
              />
            </div>

            {/* Target Tahun Lulus & Tempo Kalender Grid */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3.5 items-end">
              {/* Target Tahun Kelulusan */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#0D3B82]" />
                  <span>Target Tahun Lulus (Angkatan)</span>
                </label>
                <select
                  value={targetGraduationYear}
                  onChange={(e) => setTargetGraduationYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#0D3B82] rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-colors"
                >
                  {GRADUATION_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y === 'Semua Angkatan' ? 'Semua Angkatan' : `Angkatan ${y}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tempo Pengisian: Tanggal Mulai */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tempo Buka (Tanggal Mulai)</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#0D3B82] rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-colors"
                />
              </div>

              {/* Tempo Pengisian: Tanggal Berakhir */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Tempo Tutup (Batas Akhir)</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#0D3B82] rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Template Kemdiktisaintek Quick Button */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs text-blue-900 font-medium">
                  Gunakan standar kuesioner resmi Tracer Study Kemdiktisaintek 2026 (71 instrumen soal lengkap F8 s/d F37).
                </span>
              </div>
              <button
                type="button"
                onClick={handleInsertDiktiTemplate}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                ✨ Terapkan Template Resmi Kemdiktisaintek
              </button>
            </div>
          </div>

          {/* ================= DYNAMIC QUESTIONS LIST ================= */}
          <div className="space-y-4">
            {questions.map((q, qIndex) => {
              const currentType = QUESTION_TYPES.find((t) => t.type === q.question_type);
              const hasOptions = ['radio', 'checkbox', 'dropdown', 'scale'].includes(
                q.question_type
              );

              return (
                <div
                  key={qIndex}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs relative transition-all duration-200 hover:shadow-md group"
                >
                  {/* Top Bar of Card: Reorder & Delete */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#0D3B82]/10 text-[#0D3B82] text-xs font-bold flex items-center justify-center font-mono">
                        {qIndex + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-700">Pertanyaan</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveQuestion(qIndex, 'up')}
                        disabled={qIndex === 0}
                        title="Geser ke atas"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveQuestion(qIndex, 'down')}
                        disabled={qIndex === questions.length - 1}
                        title="Geser ke bawah"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-slate-200 mx-1" />
                      <button
                        type="button"
                        onClick={() => duplicateQuestion(qIndex)}
                        title="Duplikat pertanyaan"
                        className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        title="Hapus pertanyaan"
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Main Inputs: Question Text, Type, and Metric Tag */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-start">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={q.question_text}
                        onChange={(e) => updateQuestion(qIndex, { question_text: e.target.value })}
                        placeholder="Tuliskan pertanyaan di sini..."
                        className="w-full bg-[#F8FAFC] border border-slate-200 focus:border-[#0D3B82] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition-colors"
                      />
                      <div className="flex items-center gap-1.5 mt-2">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={q.help_text || ''}
                          onChange={(e) => updateQuestion(qIndex, { help_text: e.target.value })}
                          placeholder="Tambahkan petunjuk bantuan jawaban (opsional)..."
                          className="w-full text-xs text-slate-500 placeholder:text-slate-400 outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    {/* Question Type Selector */}
                    <div className="space-y-2">
                      <select
                        value={q.question_type}
                        onChange={(e) => {
                          const newType = e.target.value as QuestionType;
                          const updates: Partial<TracerQuestion> = { question_type: newType };
                          if (
                            ['radio', 'checkbox', 'dropdown', 'scale'].includes(newType) &&
                            (!q.options || q.options.length === 0)
                          ) {
                            updates.options = [
                              { option_label: 'Opsi 1', order_index: 0 },
                              { option_label: 'Opsi 2', order_index: 1 },
                            ];
                          }
                          updateQuestion(qIndex, updates);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:border-[#0D3B82] focus:bg-white transition-colors"
                      >
                        {QUESTION_TYPES.map((t) => (
                          <option key={t.type} value={t.type}>
                            {t.label}
                          </option>
                        ))}
                      </select>

                      {/* Metric Tag Selector */}
                      <div>
                        <select
                          value={q.metric_tag || ''}
                          onChange={(e) =>
                            updateQuestion(qIndex, { metric_tag: e.target.value || null })
                          }
                          className="w-full bg-amber-50/60 border border-amber-200/80 rounded-xl px-3 py-2 text-[11px] font-bold text-amber-900 outline-none cursor-pointer focus:border-amber-400 transition-colors"
                          title="Pilih Metrik Analitik Standar untuk dikelompokkan ke dalam grafik"
                        >
                          {METRIC_TAG_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.icon} {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Options Builder (For Radio, Checkbox, Dropdown, Scale) */}
                  {hasOptions && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5 pl-1 sm:pl-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Daftar Pilihan Jawaban
                      </span>

                      {q.options?.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2 group/opt">
                          {q.question_type === 'radio' && (
                            <CircleDot className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          {q.question_type === 'checkbox' && (
                            <CheckSquare className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          {q.question_type === 'dropdown' && (
                            <span className="text-xs font-mono text-slate-400 w-4 text-center shrink-0">
                              {optIndex + 1}.
                            </span>
                          )}
                          {q.question_type === 'scale' && (
                            <Star className="w-4 h-4 text-amber-400 shrink-0" />
                          )}

                          <input
                            type="text"
                            value={opt.option_label}
                            onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                            placeholder={`Tuliskan nama opsi ${optIndex + 1}...`}
                            className="flex-1 bg-transparent border-b border-slate-200 focus:border-[#0D3B82] py-1 text-xs text-slate-700 outline-none transition-colors"
                          />

                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, optIndex)}
                            className="p-1 rounded-md text-slate-300 hover:text-rose-500 opacity-60 group-hover/opt:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#0D3B82] hover:text-blue-700 pt-2 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Opsi Pilihan</span>
                      </button>
                    </div>
                  )}

                  {/* Card Footer: Required Switch & Metric indicator */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={q.is_required}
                        onChange={(e) => updateQuestion(qIndex, { is_required: e.target.checked })}
                        className="w-4 h-4 text-[#0D3B82] rounded-md border-slate-300 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-slate-700">
                        Wajib Diisi (Required)
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      {q.metric_tag && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Metrik: {q.metric_tag}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        {currentType && <currentType.icon className="w-3.5 h-3.5" />}
                        <span>{currentType?.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action: Add Question & Save Form */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <button
              type="button"
              onClick={addQuestion}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-[#0D3B82] text-[#0D3B82] hover:bg-blue-50/70 text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pertanyaan Baru</span>
            </button>

            <button
              type="button"
              onClick={handleSaveForm}
              disabled={isSaving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0D3B82] hover:bg-[#092B60] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Seluruh Formulir'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
