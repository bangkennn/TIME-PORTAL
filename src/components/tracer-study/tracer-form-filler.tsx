'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  CheckCircle2,
  AlertCircle,
  Send,
  RefreshCw,
  GraduationCap,
  Calendar,
  User,
  Clock,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { TracerForm, SubmitAnswerPayload } from '@/types/tracer-study';
import { tracerStudyService } from '@/services/tracer-study.service';
import { useAuthStore } from '@/store/useAuthStore';
import { useMahasiswaProfile } from '@/hooks/useMahasiswaProfile';
import { isQuestionVisible, getSelectedF8Branch } from '@/lib/tracer-study-branching';

export default function TracerFormFiller() {
  const [form, setForm] = useState<TracerForm | null>(null);
  const [scheduleStatus, setScheduleStatus] = useState<'open' | 'upcoming' | 'expired'>('open');
  const [scheduleMessage, setScheduleMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submittedAtDate, setSubmittedAtDate] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string | null>(null);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);

  const { user } = useAuthStore();
  const activeNim = user?.name || '';
  const { data: profile } = useMahasiswaProfile(activeNim);

  // Student Identity Info (Auto-filled from profile & locked read-only)
  const [nim, setNim] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [prodi, setProdi] = useState('Teknik Informatika');
  const [graduationYear, setGraduationYear] = useState('2022');

  // Answers State: { [questionId: number]: { text?: string; option_ids?: number[] } }
  const [answers, setAnswers] = useState<Record<number, { text?: string; option_ids?: number[] }>>(
    {}
  );

  // Dynamic Skip-Logic / Percabangan Soal Berdasarkan Pilihan [F8]
  const allQuestions = form?.questions || [];
  const visibleQuestions = allQuestions.filter((q) =>
    isQuestionVisible(q, answers, allQuestions)
  );
  const f8Branch = getSelectedF8Branch(answers, allQuestions);
  const hasF8Question = allQuestions.some((q) => q.question_text.includes('[F8]'));

  // Auto-sync profile data into locked respondent state
  useEffect(() => {
    const studentNim = String(profile?.nim || activeNim || '');
    const studentName =
      profile?.namaMahasiswa ||
      ((profile as unknown) as Record<string, string>)?.nama ||
      ((profile as unknown) as Record<string, string>)?.nama_mahasiswa ||
      (user?.name && user.name !== activeNim ? user.name : '') ||
      '';
    const studentEmail = profile?.email || '';
    const studentProdi =
      profile?.kodeProgramStudi === 'TI'
        ? 'Teknik Informatika (S1)'
        : profile?.kodeProgramStudi === 'SI'
        ? 'Sistem Informasi (S1)'
        : 'Teknik Informatika (S1)';
    const studentYear = profile?.tahunAngkatan ? String(profile.tahunAngkatan) : '2022';

    if (studentNim) setNim(studentNim);
    if (studentName) setName(studentName);
    if (studentEmail) setEmail(studentEmail);
    setProdi(studentProdi);
    setGraduationYear(studentYear);
  }, [profile, user, activeNim]);

  const fetchActiveForm = async (targetYear?: string, studentNim?: string) => {
    try {
      setIsLoading(true);
      const rawNim =
        studentNim ||
        nim ||
        (profile && 'nim' in profile ? String(profile.nim) : '') ||
        activeNim ||
        '';
      const queryNim = rawNim ? String(rawNim) : undefined;
      const res = await tracerStudyService.getActiveForm({
        year: targetYear,
        nim: queryNim,
      });
      if (res.status === 'success' && res.data) {
        setForm(res.data);
        setScheduleStatus(res.schedule_status || 'open');
        setScheduleMessage(res.schedule_message || '');
        setAlreadySubmitted(Boolean(res.already_submitted));
        setSubmittedAtDate(res.submitted_at || null);
        setResponseStatus(res.response_status || 'pending');
        setReviewNotes(res.review_notes || null);
        setEmptyMessage(null);
      } else {
        setForm(null);
        setEmptyMessage(
          res.message ||
            (targetYear
              ? `Saat ini belum ada formulir Tracer Study yang dibuka untuk angkatan ${targetYear} Anda.`
              : 'Saat ini belum ada formulir Tracer Study yang dipublikasikan.')
        );
      }
    } catch {
      setForm(null);
      setEmptyMessage(
        'Gagal terhubung ke server API Tracer Study. Silakan coba beberapa saat lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch form whenever student's batch year or NIM is loaded or changes
  useEffect(() => {
    const studentNim = String(profile?.nim || activeNim || '');
    const studentYear = profile?.tahunAngkatan ? String(profile.tahunAngkatan) : undefined;
    fetchActiveForm(studentYear, studentNim);
  }, [profile?.tahunAngkatan, profile?.nim, activeNim]);

  const handleTextAnswer = (qId: number, val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], text: val },
    }));
  };

  const handleRadioAnswer = (qId: number, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: { option_ids: [optionId] },
    }));
  };

  const handleCheckboxAnswer = (qId: number, optionId: number, checked: boolean) => {
    setAnswers((prev) => {
      const current = prev[qId]?.option_ids || [];
      const updated = checked ? [...current, optionId] : current.filter((id) => id !== optionId);
      return {
        ...prev,
        [qId]: { option_ids: updated },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) return;

    if (scheduleStatus === 'upcoming') {
      toast.error('Pengisian formulir ini belum dibuka sesuai jadwal tempo.');
      return;
    }

    if (scheduleStatus === 'expired') {
      toast.error('Masa pengisian formulir ini telah ditutup.');
      return;
    }

    if (!nim.trim() || !name.trim()) {
      toast.error('Data identitas mahasiswa tidak lengkap. Mohon hubungi admin.');
      return;
    }

    // Validasi hanya soal wajib yang SEDANG AKTIF / VISIBLE
    for (const q of visibleQuestions) {
      if (q.is_required && q.id) {
        const ans = answers[q.id];
        const hasText = ans?.text && ans.text.trim().length > 0;
        const hasOptions = ans?.option_ids && ans.option_ids.length > 0;
        if (!hasText && !hasOptions) {
          toast.error(`Pertanyaan wajib: "${q.question_text}" belum dijawab.`);
          return;
        }
      }
    }

    // Hanya kirim jawaban untuk pertanyaan yang sedang aktif terlihat
    const visibleQuestionIds = new Set(visibleQuestions.map((q) => q.id));
    const formattedAnswers: SubmitAnswerPayload[] = Object.entries(answers)
      .filter(([qId]) => visibleQuestionIds.has(Number(qId)))
      .map(([qId, ansData]) => ({
        question_id: Number(qId),
        answer_text: ansData.text,
        option_ids: ansData.option_ids,
      }));

    const payload = {
      form_id: form.id,
      nim: nim.trim(),
      respondent_name: name.trim(),
      respondent_email: email.trim() || undefined,
      prodi: prodi,
      graduation_year: graduationYear,
      answers: formattedAnswers,
    };

    try {
      setIsSubmitting(true);
      await tracerStudyService.submitResponse(payload);
      setIsSuccess(true);
      setAlreadySubmitted(true);
      setSubmittedAtDate(new Date().toISOString());
      toast.success('Jawaban Anda berhasil dikirim ke server STMIK TIME!');
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string; already_submitted?: boolean } };
      };
      if (axiosErr?.response?.status === 409 || axiosErr?.response?.data?.already_submitted) {
        setAlreadySubmitted(true);
      }
      const errorMsg =
        axiosErr?.response?.data?.message ||
        'Gagal mengirim jawaban Tracer Study. Silakan coba kembali.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center min-h-[350px] shadow-xs">
        <RefreshCw className="w-7 h-7 text-[#0D3B82] animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-700">Memuat formulir Tracer Study...</p>
        <p className="text-[11px] text-slate-400 mt-1">
          Menyelaraskan kuesioner dengan tahun angkatan Anda
        </p>
      </div>
    );
  }

  if (alreadySubmitted) {
    const formattedDate = submittedAtDate
      ? new Date(submittedAtDate).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;

    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 mb-3 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Formulir Berhasil Diterima
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Kuesioner Tracer Study Telah Diterima
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Terima kasih atas partisipasi Anda. Tanggapan kuesioner Tracer Study Anda telah berhasil dikirimkan dan resmi tercatat dalam sistem akademik STMIK TIME.
        </p>

        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5 font-mono text-slate-600">
          <p>
            <span className="text-slate-400">NIM:</span> <span className="font-semibold text-slate-800">{nim}</span>
          </p>
          <p>
            <span className="text-slate-400">Nama:</span> <span className="font-semibold text-slate-800">{name}</span>
          </p>
          <p>
            <span className="text-slate-400">Program Studi:</span>{' '}
            <span className="font-semibold text-slate-800">{prodi}</span>
          </p>
          <p>
            <span className="text-slate-400">Tahun Angkatan:</span>{' '}
            <span className="font-semibold text-slate-800">{graduationYear}</span>
          </p>
          {formattedDate && (
            <p>
              <span className="text-slate-400">Waktu Pengisian:</span>{' '}
              <span className="font-semibold text-slate-700">{formattedDate} WIB</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Terima Kasih atas Partisipasi Anda!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Tanggapan kuesioner Tracer Study Anda telah berhasil direkam ke dalam basis data kampus STMIK TIME.
        </p>
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1 font-mono text-slate-600">
          <p>
            <span className="text-slate-400">NIM:</span> {nim}
          </p>
          <p>
            <span className="text-slate-400">Nama:</span> {name}
          </p>
          <p>
            <span className="text-slate-400">Angkatan:</span> {graduationYear}
          </p>
        </div>
      </div>
    );
  }

  if (!form || emptyMessage) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0D3B82] flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Belum Ada Kuesioner untuk Angkatan Anda
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
          {emptyMessage ||
            `Saat ini belum ada formulir Tracer Study yang dibuka untuk mahasiswa angkatan ${graduationYear}.`}
        </p>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => fetchActiveForm(profile?.tahunAngkatan ? String(profile.tahunAngkatan) : undefined)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Periksa Ulang Kuesioner</span>
          </button>
        </div>
      </div>
    );
  }

  const isFormClosed = scheduleStatus === 'expired' || scheduleStatus === 'upcoming';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl mx-auto w-full">
      {/* ================= SCHEDULE NOTICE ================= */}
      {scheduleStatus === 'expired' && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-rose-800">
              Formulir Ditutup (Masa Pengisian Telah Berakhir)
            </h4>
            <p className="text-xs text-rose-600 leading-relaxed">
              {scheduleMessage ||
                'Masa pengisian kuesioner Tracer Study ini telah berakhir sehingga saat ini tidak menerima jawaban baru.'}
            </p>
          </div>
        </div>
      )}

      {scheduleStatus === 'upcoming' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-amber-800">
              Formulir Belum Dibuka
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              {scheduleMessage ||
                'Jadwal tempo pengisian formulir ini belum dimulai. Silakan kembali pada tanggal yang telah ditentukan.'}
            </p>
          </div>
        </div>
      )}

      {/* ================= FORM HEADER CARD (MINIMALIST) ================= */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0D3B82] text-[11px] font-semibold border border-blue-200/60">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {form.target_graduation_year
                ? `Target: Angkatan ${form.target_graduation_year}`
                : 'Semua Angkatan'}
            </span>
          </span>

          {form.start_date && form.end_date && (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Tempo: {form.start_date} s/d {form.end_date}
              </span>
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {form.title}
        </h2>
        {form.description && (
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line border-b border-slate-100 pb-4">
            {form.description}
          </p>
        )}
        <div className="pt-3 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="text-rose-500 font-bold">*</span> Menandakan pertanyaan wajib diisi
        </div>
      </div>

      {/* ================= DATA IDENTITAS ALUMNI (AUTO-FILLED & LOCKED) ================= */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-[#0D3B82]" />
              <span>Identitas Responden (Mahasiswa)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Data terisi otomatis sesuai profil Anda dan terkunci permanen
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-semibold">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Terverifikasi Sistem</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Nomor Induk Mahasiswa (NIM)</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </label>
            <input
              type="text"
              readOnly
              value={nim}
              className="w-full bg-slate-100/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none font-mono font-bold cursor-not-allowed select-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Nama Lengkap</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </label>
            <input
              type="text"
              readOnly
              value={name}
              className="w-full bg-slate-100/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none font-semibold cursor-not-allowed select-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Program Studi</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </label>
            <input
              type="text"
              readOnly
              value={prodi}
              className="w-full bg-slate-100/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none cursor-not-allowed select-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Tahun Angkatan</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </label>
            <input
              type="text"
              readOnly
              value={`Angkatan ${graduationYear}`}
              className="w-full bg-slate-100/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none font-mono font-medium cursor-not-allowed select-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Alamat Email</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </label>
            <input
              type="email"
              readOnly
              value={email || '-'}
              className="w-full bg-slate-100/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none cursor-not-allowed select-none"
            />
          </div>
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-2.5 text-[11px] text-[#0D3B82]">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#0D3B82]" />
          <span>
            Identitas responden terisi otomatis dari sistem portal akademik STMIK TIME dan terkunci untuk menjamin validitas kuesioner.
          </span>
        </div>
      </div>

      {/* ================= DAFTAR PERTANYAAN KUESIONER ================= */}
      <div className="space-y-4">
        {visibleQuestions.map((q, idx) => {
          const qId = q.id || idx;
          const currentAns = answers[qId];

          return (
            <div
              key={qId}
              className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-3 transition-all duration-200 animate-in fade-in-50"
            >
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  <span className="font-mono text-slate-400 mr-2">{idx + 1}.</span>
                  {q.question_text}
                  {q.is_required && <span className="text-rose-500 ml-1 font-bold">*</span>}
                </h4>
                {q.help_text && (
                  <p className="text-xs text-slate-400 mt-1 italic">{q.help_text}</p>
                )}
              </div>

              {/* Short Text */}
              {q.question_type === 'short_text' && (
                <input
                  type="text"
                  disabled={isFormClosed}
                  value={currentAns?.text || ''}
                  onChange={(e) => handleTextAnswer(qId, e.target.value)}
                  placeholder="Ketik jawaban singkat Anda di sini..."
                  className="w-full bg-[#F8FAFC] border border-slate-200 focus:border-[#0D3B82] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-colors disabled:opacity-60"
                />
              )}

              {/* Long Text */}
              {q.question_type === 'long_text' && (
                <textarea
                  rows={3}
                  disabled={isFormClosed}
                  value={currentAns?.text || ''}
                  onChange={(e) => handleTextAnswer(qId, e.target.value)}
                  placeholder="Ketik penjelasan lengkap Anda di sini..."
                  className="w-full bg-[#F8FAFC] border border-slate-200 focus:border-[#0D3B82] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-colors disabled:opacity-60"
                />
              )}

              {/* Radio (Pilihan Tunggal) */}
              {q.question_type === 'radio' && (
                <div className="space-y-2 pt-1">
                  {(q.options || []).map((opt) => {
                    const isSelected = Boolean(opt.id && currentAns?.option_ids?.[0] === opt.id);
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-300 text-[#0D3B82] font-semibold'
                            : 'bg-[#F8FAFC] border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
                        } ${isFormClosed ? 'cursor-not-allowed opacity-60' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`question_${qId}`}
                          disabled={isFormClosed}
                          checked={isSelected}
                          onChange={() => opt.id && handleRadioAnswer(qId, opt.id)}
                          className="accent-[#0D3B82] w-4 h-4 cursor-pointer"
                        />
                        <span>{opt.option_label}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Checkbox (Pilihan Ganda) */}
              {q.question_type === 'checkbox' && (
                <div className="space-y-2 pt-1">
                  {(q.options || []).map((opt) => {
                    const isChecked = Boolean(opt.id && currentAns?.option_ids?.includes(opt.id));
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-blue-50/70 border-blue-300 text-[#0D3B82] font-semibold'
                            : 'bg-[#F8FAFC] border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
                        } ${isFormClosed ? 'cursor-not-allowed opacity-60' : ''}`}
                      >
                        <input
                          type="checkbox"
                          disabled={isFormClosed}
                          checked={isChecked}
                          onChange={(e) =>
                            opt.id && handleCheckboxAnswer(qId, opt.id, e.target.checked)
                          }
                          className="accent-[#0D3B82] w-4 h-4 rounded-sm cursor-pointer"
                        />
                        <span>{opt.option_label}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Dropdown Select */}
              {q.question_type === 'dropdown' && (
                <select
                  disabled={isFormClosed}
                  value={String(currentAns?.option_ids?.[0] ?? '')}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) handleRadioAnswer(qId, Number(val));
                  }}
                  className="w-full bg-[#F8FAFC] border border-slate-200 focus:border-[#0D3B82] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-colors cursor-pointer disabled:opacity-60"
                >
                  <option value="">-- Pilih Salah Satu Jawaban --</option>
                  {(q.options || []).map((opt) => (
                    <option key={opt.id} value={String(opt.id)}>
                      {opt.option_label}
                    </option>
                  ))}
                </select>
              )}

              {/* Scale (Rating 1 - 5) */}
              {q.question_type === 'scale' && (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {[1, 2, 3, 4, 5].map((scaleVal) => {
                    const isSelected = currentAns?.text === String(scaleVal);
                    return (
                      <button
                        key={scaleVal}
                        type="button"
                        disabled={isFormClosed}
                        onClick={() => handleTextAnswer(qId, String(scaleVal))}
                        className={`flex-1 min-w-[50px] py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0D3B82] text-white border-[#0D3B82] shadow-xs'
                            : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:bg-slate-100'
                        } ${isFormClosed ? 'cursor-not-allowed opacity-60' : ''}`}
                      >
                        {scaleVal}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Date Input */}
              {q.question_type === 'date' && (
                <input
                  type="date"
                  disabled={isFormClosed}
                  value={currentAns?.text || ''}
                  onChange={(e) => handleTextAnswer(qId, e.target.value)}
                  className="bg-[#F8FAFC] border border-slate-200 focus:border-[#0D3B82] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none transition-colors disabled:opacity-60"
                />
              )}
            </div>
          );
        })}

        {hasF8Question && !f8Branch && (
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-900 text-xs flex items-center gap-3 shadow-2xs">
            <span className="text-xl shrink-0">📋</span>
            <div>
              <span className="font-bold block">Langkah 1: Tentukan Status Aktivitas Anda</span>
              <span className="text-blue-800/90 text-[11px]">
                Silakan pilih opsi status aktivitas Anda pada pertanyaan nomor 1 di atas. Instrumen soal berikutnya akan otomatis disesuaikan secara dinamis.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ================= SUBMIT ACTION BUTTON ================= */}
      <div className="flex items-center justify-end pt-3 pb-8">
        <button
          type="submit"
          disabled={isSubmitting || isFormClosed}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D3B82] hover:bg-[#092B60] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Mengirim Jawaban...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Kirim Tanggapan Kuesioner</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
