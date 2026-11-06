import { TracerQuestion } from '@/types/tracer-study';

export interface FormAnswerState {
  text?: string;
  option_ids?: number[];
}

export type F8Branch = '1' | '2' | '3' | '4' | '5' | null;

/**
 * Mendapatkan cabang pilihan aktivitas responden pada instrumen [F8]
 * (1) Bekerja (penuh waktu/paruh waktu)
 * (3) Wiraswasta/wirausaha/pekerja lepas
 * (4) Melanjutkan pendidikan
 * (5) Tidak bekerja tetapi sedang mencari pekerjaan
 * (2) Belum memungkinkan bekerja
 */
export function getSelectedF8Branch(
  answers: Record<number, FormAnswerState>,
  questions: TracerQuestion[]
): F8Branch {
  const f8Question = questions.find((q) => q.question_text.includes('[F8]'));
  if (!f8Question || !f8Question.id) return null;

  const f8Answer = answers[f8Question.id];
  const selectedOptionId = f8Answer?.option_ids?.[0];
  if (!selectedOptionId) return null;

  const selectedOpt = f8Question.options?.find((opt) => opt.id === selectedOptionId);
  if (!selectedOpt) return null;

  const label = selectedOpt.option_label.toLowerCase();

  // (1) Bekerja
  if (label.includes('(1)') || label.includes('bekerja (penuh') || label.includes('bekerja')) {
    return '1';
  }
  // (3) Wiraswasta / wirausaha / pekerja lepas
  if (label.includes('(3)') || label.includes('wiraswasta') || label.includes('wirausaha')) {
    return '3';
  }
  // (4) Melanjutkan pendidikan
  if (label.includes('(4)') || label.includes('melanjutkan pendidikan') || label.includes('studi lanjut')) {
    return '4';
  }
  // (5) Tidak bekerja tetapi sedang mencari pekerjaan
  if (label.includes('(5)') || label.includes('tidak bekerja') || label.includes('mencari pekerjaan')) {
    return '5';
  }
  // (2) Belum memungkinkan bekerja
  if (label.includes('(2)') || label.includes('belum memungkinkan')) {
    return '2';
  }

  return null;
}

/**
 * Mengevaluasi apakah suatu pertanyaan kuesioner harus ditampilkan (visible)
 * atau disembunyikan (hidden) berdasarkan panduan percabangan resmi Kemdiktisaintek 2026.
 */
export function isQuestionVisible(
  question: TracerQuestion,
  answers: Record<number, FormAnswerState>,
  allQuestions: TracerQuestion[]
): boolean {
  const text = question.question_text;

  // Jika form tidak memiliki instrumen [F8], maka bukan kuesioner Kemdiktisaintek -> selalu tampilkan
  const hasF8Question = allQuestions.some((q) => q.question_text.includes('[F8]'));
  if (!hasF8Question) {
    return true;
  }

  // Instrumen [F8] selalu ditampilkan sebagai pertanyaan pembuka
  if (text.includes('[F8]')) {
    return true;
  }

  const f8Branch = getSelectedF8Branch(answers, allQuestions);

  // Jika responden belum memilih opsi pada [F8], sembunyikan pertanyaan kondisional berikutnya
  if (!f8Branch) {
    return false;
  }

  // Helper untuk membaca label opsi terpilih pada suatu kode soal
  const getSelectedOptionLabel = (qCode: string): string => {
    const qTarget = allQuestions.find((q) => q.question_text.includes(`[${qCode}]`));
    if (!qTarget || !qTarget.id) return '';
    const ans = answers[qTarget.id];
    const optId = ans?.option_ids?.[0];
    if (!optId) return '';
    return qTarget.options?.find((opt) => opt.id === optId)?.option_label || '';
  };

  // Helper untuk memeriksa apakah suatu opsi checkbox terpilih (misal: F415, F1613)
  const isCheckboxOptionSelected = (qCode: string, optCode: string): boolean => {
    const qTarget = allQuestions.find((q) => q.question_text.includes(`[${qCode}]`));
    if (!qTarget || !qTarget.id) return false;
    const ans = answers[qTarget.id];
    if (!ans?.option_ids || ans.option_ids.length === 0) return false;
    const optTarget = qTarget.options?.find(
      (opt) => opt.option_label.includes(`[${optCode}]`) || opt.option_label.toLowerCase().includes('lainnya')
    );
    if (!optTarget || !optTarget.id) return false;
    return ans.option_ids.includes(optTarget.id);
  };

  // ================= 1. CABANG (4) MELANJUTKAN PENDIDIKAN =================
  if (f8Branch === '4') {
    // Soal khusus studi lanjut:
    if (
      text.includes('[F18A]') ||
      text.includes('[F18B]') ||
      text.includes('[F18C]') ||
      text.includes('[F18D]')
    ) {
      return true;
    }
    // Lokasi studi lanjut:
    if (text.includes('[F5A0]')) {
      return true;
    }
    if (text.includes('[F5A1]') || text.includes('[F5A2]')) {
      const f5a0 = getSelectedOptionLabel('F5A0').toLowerCase();
      return f5a0.includes('indonesia');
    }
    // Relevansi keilmuan studi lanjut:
    if (text.includes('[F14]')) {
      return true;
    }
    // Pertanyaan almamater (F1201, F17A, F17B, F2):
    if (isAlmamaterQuestion(text, getSelectedOptionLabel)) {
      return true;
    }
    // Semua pertanyaan kerja/wirausaha/cari kerja disembunyikan
    return false;
  }

  // ================= 2. CABANG (1) BEKERJA =================
  if (f8Branch === '1') {
    // Masa tunggu & pendapatan
    if (text.includes('[F502]') || text.includes('[F505]')) {
      return true;
    }
    // Lokasi kerja
    if (text.includes('[F5A0]')) {
      return true;
    }
    if (text.includes('[F5A1]') || text.includes('[F5A2]')) {
      const f5a0 = getSelectedOptionLabel('F5A0').toLowerCase();
      return f5a0.includes('indonesia');
    }
    // Jenis instansi
    if (text.includes('[F1101]')) {
      return true;
    }
    if (text.includes('[F1102]')) {
      const f1101 = getSelectedOptionLabel('F1101').toLowerCase();
      return f1101.includes('(5)') || f1101.includes('lainnya');
    }
    // Nama kantor & ruang lingkup
    if (text.includes('[F5B]') || text.includes('[F5D]')) {
      return true;
    }
    // Relevansi & kesesuaian jenjang
    if (text.includes('[F14]') || text.includes('[F15]')) {
      return true;
    }
    // Kapan mulai mencari kerja
    if (text.includes('[F301]')) {
      return true;
    }
    if (text.includes('[F302]')) {
      const f301 = getSelectedOptionLabel('F301').toLowerCase();
      return f301.includes('(1)') || f301.includes('sebelum');
    }
    if (text.includes('[F303]')) {
      const f301 = getSelectedOptionLabel('F301').toLowerCase();
      return f301.includes('(2)') || f301.includes('sesudah');
    }
    // Cara mencari kerja
    if (text.includes('[F4]')) {
      return true;
    }
    if (text.includes('[F416]')) {
      return isCheckboxOptionSelected('F4', 'F415');
    }
    // Lamaran & wawancara
    if (text.includes('[F6]') || text.includes('[F7]') || text.includes('[F7A]')) {
      return true;
    }
    // Aktif mencari kerja
    if (text.includes('[F1001]')) {
      return true;
    }
    if (text.includes('[F1002]')) {
      const f1001 = getSelectedOptionLabel('F1001').toLowerCase();
      return f1001.includes('(5)') || f1001.includes('lainnya');
    }
    // Alasan pekerjaan tidak relevan
    if (text.includes('[F16]')) {
      return true;
    }
    if (text.includes('[F1614]')) {
      return isCheckboxOptionSelected('F16', 'F1613');
    }
    // Pertanyaan almamater
    if (isAlmamaterQuestion(text, getSelectedOptionLabel)) {
      return true;
    }
    return false;
  }

  // ================= 3. CABANG (3) WIRASWASTA / WIRAUSAHA =================
  if (f8Branch === '3') {
    // Masa tunggu & penghasilan
    if (text.includes('[F502]') || text.includes('[F505]')) {
      return true;
    }
    // Posisi wirausaha, nama kantor, izin usaha, ruang lingkup
    if (
      text.includes('[F5C]') ||
      text.includes('[F5B]') ||
      text.includes('[F5E]') ||
      text.includes('[F5D]')
    ) {
      return true;
    }
    // Lokasi wirausaha
    if (text.includes('[F5A0]')) {
      return true;
    }
    if (text.includes('[F5A1]') || text.includes('[F5A2]')) {
      const f5a0 = getSelectedOptionLabel('F5A0').toLowerCase();
      return f5a0.includes('indonesia');
    }
    // Relevansi & keselarasan jenjang
    if (text.includes('[F14]') || text.includes('[F15]')) {
      return true;
    }
    // Kapan mulai wirausaha
    if (text.includes('[F301]')) {
      return true;
    }
    if (text.includes('[F302]')) {
      const f301 = getSelectedOptionLabel('F301').toLowerCase();
      return f301.includes('(1)') || f301.includes('sebelum');
    }
    if (text.includes('[F303]')) {
      const f301 = getSelectedOptionLabel('F301').toLowerCase();
      return f301.includes('(2)') || f301.includes('sesudah');
    }
    // Alasan wirausaha tidak relevan
    if (text.includes('[F16]')) {
      return true;
    }
    if (text.includes('[F1614]')) {
      return isCheckboxOptionSelected('F16', 'F1613');
    }
    // Pertanyaan almamater
    if (isAlmamaterQuestion(text, getSelectedOptionLabel)) {
      return true;
    }
    return false;
  }

  // ================= 4. CABANG (5) SEDANG MENCARI KERJA =================
  if (f8Branch === '5') {
    // Kapan mulai mencari kerja
    if (text.includes('[F301]')) {
      return true;
    }
    if (text.includes('[F302]')) {
      const f301 = getSelectedOptionLabel('F301').toLowerCase();
      return f301.includes('(1)') || f301.includes('sebelum');
    }
    if (text.includes('[F303]')) {
      const f301 = getSelectedOptionLabel('F301').toLowerCase();
      return f301.includes('(2)') || f301.includes('sesudah');
    }
    // Cara mencari kerja
    if (text.includes('[F4]')) {
      return true;
    }
    if (text.includes('[F416]')) {
      return isCheckboxOptionSelected('F4', 'F415');
    }
    // Lamaran & wawancara
    if (text.includes('[F6]') || text.includes('[F7]') || text.includes('[F7A]')) {
      return true;
    }
    // Keaktifan mencari kerja
    if (text.includes('[F1001]')) {
      return true;
    }
    if (text.includes('[F1002]')) {
      const f1001 = getSelectedOptionLabel('F1001').toLowerCase();
      return f1001.includes('(5)') || f1001.includes('lainnya');
    }
    // Pertanyaan almamater
    if (isAlmamaterQuestion(text, getSelectedOptionLabel)) {
      return true;
    }
    return false;
  }

  // ================= 5. CABANG (2) BELUM MEMUNGKINKAN BEKERJA =================
  if (f8Branch === '2') {
    // Hanya mengisi instrumen umum almamater:
    return isAlmamaterQuestion(text, getSelectedOptionLabel);
  }

  return true;
}

/**
 * Memeriksa apakah pertanyaan termasuk instrumen evaluasi almamater
 * yang wajib dijawab oleh seluruh responden (apapun pilihan F8).
 */
function isAlmamaterQuestion(
  text: string,
  getSelectedOptionLabel: (qCode: string) => string
): boolean {
  // Pembiayaan kuliah almamater
  if (text.includes('[F1201]')) {
    return true;
  }
  if (text.includes('[F1202]')) {
    const f1201 = getSelectedOptionLabel('F1201').toLowerCase();
    return f1201.includes('(7)') || f1201.includes('lainnya');
  }
  // Kompetensi almamater (F17A & F17B): F1761 - F1782
  if (
    text.includes('[F176') ||
    text.includes('[F177') ||
    text.includes('[F178')
  ) {
    return true;
  }
  // Metode pembelajaran (F2): F21 - F37
  if (
    text.includes('[F21]') ||
    text.includes('[F22]') ||
    text.includes('[F23]') ||
    text.includes('[F24]') ||
    text.includes('[F25]') ||
    text.includes('[F26]') ||
    text.includes('[F27]') ||
    text.includes('[F28]') ||
    text.includes('[F29]') ||
    text.includes('[F30]') ||
    text.includes('[F31]') ||
    text.includes('[F32]') ||
    text.includes('[F33]') ||
    text.includes('[F34]') ||
    text.includes('[F35]') ||
    text.includes('[F36]') ||
    text.includes('[F37]')
  ) {
    return true;
  }

  return false;
}

