import ExcelJS from 'exceljs';
import { TracerQuestion, TracerResponse } from '@/types/tracer-study';

// 103 Kolom Baku Kemdiktisaintek 2026 (Persis sesuai template resmi)
export const EXCEL_KEMDIKTISAINTEK_HEADERS = [
  'Kode PT',
  'Kode Prodi',
  'NIM/Nomor Mhs',
  'Nama Mhs',
  'Nomor HP Mhs',
  'Email Mhs',
  'Tahun Lulus\n Keluar',
  'NIK',
  'NPWP',
  'F8',
  'F502',
  'F505',
  'F5C',
  'F18A',
  'F18B',
  'F18C',
  'F18D',
  'F5B',
  'F5A0',
  'F5A1',
  'F5A2',
  'F5E',
  'F1101',
  'F1102',
  'F5D',
  'F14',
  'F15',
  'F301',
  'F302',
  'F303',
  'F401',
  'F402',
  'F403',
  'F404',
  'F405',
  'F406',
  'F407',
  'F408',
  'F409',
  'F411',
  'F413',
  'F414',
  'F415',
  'F416',
  'F6',
  'F7',
  'F7A',
  'F1001',
  'F1002',
  'F1601',
  'F1602',
  'F1603',
  'F1604',
  'F1605',
  'F1606',
  'F1607',
  'F1608',
  'F1609',
  'F1610',
  'F1612',
  'F1613',
  'F1614',
  'F1201',
  'F1202',
  'F1761',
  'F1763',
  'F1765',
  'F1767',
  'F1769',
  'F1771',
  'F1773',
  'F1775',
  'F1777',
  'F1779',
  'F1781',
  'F1762',
  'F1764',
  'F1766',
  'F1768',
  'F1770',
  'F1772',
  'F1774',
  'F1776',
  'F1778',
  'F1780',
  'F1782',
  'F21',
  'F22',
  'F23',
  'F24',
  'F25',
  'F26',
  'F27',
  'F28',
  'F29',
  'F30',
  'F31',
  'F32',
  'F33',
  'F34',
  'F35',
  'F36',
  'F37',
];

/**
 * Ekstraksi kode angka dari opsi jawaban pilihan ganda
 * Contoh: "(1) Bekerja (penuh waktu)" -> "1"
 * Contoh: "(6) BUMN" -> "6"
 */
function extractNumericOptionCode(label: string): string {
  if (!label) return '';
  // Pola: (1) atau (6)
  const matchParen = label.match(/\((\d+)\)/);
  if (matchParen) return matchParen[1];

  // Pola skala: "1", "2", "3", "4", "5"
  const matchNum = label.match(/^\s*(\d+)/);
  if (matchNum) return matchNum[1];

  return label.trim();
}

/**
 * Helper untuk menyusun nilai tiap kolom pada satu responden
 */
export function buildRespondentRow(
  resp: TracerResponse,
  questions: TracerQuestion[]
): (string | number)[] {
  // 1. Siapkan map jawaban responden berdasarkan question_id
  const answersMap: Record<
    number,
    { text?: string | null; option_ids?: number[]; selected_labels?: string[] }
  > = {};

  for (const ans of resp.answers || []) {
    const optIds = (ans.selected_options || []).map(
      (so: { option_id?: number; id?: number }) => so.option_id || so.id || 0
    );
    const optLabels = (ans.selected_options || []).map(
      (so: { option?: { option_label?: string }; option_label?: string }) =>
        so.option?.option_label || so.option_label || ''
    );
    answersMap[ans.question_id] = {
      text: ans.answer_text,
      option_ids: optIds,
      selected_labels: optLabels,
    };
  }

  // 2. Kode Perguruan Tinggi STMIK TIME resmi: 013105
  const kodePT = '013105';

  // 3. Kode Prodi resmi: Teknik Informatika = 55201, Sistem Informasi = 57201
  let kodeProdi = '55201';
  const prodiLower = (resp.prodi || '').toLowerCase();
  if (prodiLower.includes('sistem informasi') || prodiLower.includes('si') || prodiLower.includes('57201')) {
    kodeProdi = '57201';
  } else if (prodiLower.includes('informatika') || prodiLower.includes('ti') || prodiLower.includes('55201')) {
    kodeProdi = '55201';
  }

  // 4. Data Identitas Mahasiswa
  const identityMap: Record<string, string> = {
    'Kode PT': kodePT,
    'Kode Prodi': kodeProdi,
    'NIM/Nomor Mhs': resp.nim || '',
    'Nama Mhs': resp.respondent_name || '',
    'Nomor HP Mhs': '',
    'Email Mhs': resp.respondent_email || '',
    'Tahun Lulus\n Keluar': resp.graduation_year || '',
    'NIK': '',
    'NPWP': '',
  };

  // Helper untuk mencari jawaban berdasarkan kode instrumen [CODE]
  const getAnswerForCode = (code: string): string | number => {
    // A. Sub-opsi checkbox F401 .. F415
    if (code.startsWith('F40') || code === 'F411' || code === 'F413' || code === 'F414' || code === 'F415') {
      const qF4 = questions.find((q) => q.question_text.includes('[F4]'));
      if (!qF4 || !qF4.id) return '';
      const ansF4 = answersMap[qF4.id];
      if (!ansF4 || (!ansF4.option_ids?.length && !ansF4.text)) return '';

      // Periksa apakah opsi dengan kode ini dipilih
      const isChecked = ansF4.selected_labels?.some((lbl) => lbl.includes(`[${code}]`));
      return isChecked ? 1 : 0;
    }

    // B. Sub-opsi checkbox F1601 .. F1613
    if (code.startsWith('F160') || code === 'F1610' || code === 'F1612' || code === 'F1613') {
      const qF16 = questions.find((q) => q.question_text.includes('[F16]'));
      if (!qF16 || !qF16.id) return '';
      const ansF16 = answersMap[qF16.id];
      if (!ansF16 || (!ansF16.option_ids?.length && !ansF16.text)) return '';

      const isChecked = ansF16.selected_labels?.some((lbl) => lbl.includes(`[${code}]`));
      return isChecked ? 1 : 0;
    }

    // C. Pertanyaan biasa dengan kode [CODE]
    const qTarget = questions.find((q) => q.question_text.includes(`[${code}]`));
    if (!qTarget || !qTarget.id) return '';

    const ans = answersMap[qTarget.id];
    if (!ans) return '';

    // Jika tipe radio / dropdown: ambil kode angka opsi terpilih
    if (qTarget.question_type === 'radio' || qTarget.question_type === 'dropdown') {
      const label = ans.selected_labels?.[0];
      if (label) {
        return extractNumericOptionCode(label);
      }
      if (ans.text) return ans.text;
      return '';
    }

    // Jika tipe skala (scale 1 - 5)
    if (qTarget.question_type === 'scale') {
      if (ans.text) {
        return extractNumericOptionCode(ans.text);
      }
      const label = ans.selected_labels?.[0];
      if (label) {
        return extractNumericOptionCode(label);
      }
      return '';
    }

    // Jika tipe teks (short_text, long_text, date)
    return ans.text || '';
  };

  // 5. Susun array nilai sesuai 103 kolom header
  return EXCEL_KEMDIKTISAINTEK_HEADERS.map((header) => {
    if (identityMap[header] !== undefined) {
      return identityMap[header];
    }
    return getAnswerForCode(header);
  });
}

/**
 * Menghasilkan file Buffer Excel (.xlsx) murni dengan format & warna resmi Kemdiktisaintek
 * - Baris 1: Merged title A1:CY1 dengan latar Lavender (#E6E6FA)
 * - Baris 2: 103 Header kolom dengan latar Hijau Muda (#C1E1C1)
 * - Baris 3..N: Data responden disetujui (Approved)
 */
export async function generateTracerStudyExcelBuffer(
  formTitle: string,
  approvedResponses: TracerResponse[],
  questions: TracerQuestion[],
  targetGraduationYear?: string | null
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'STMIK TIME Portal';
  workbook.lastModifiedBy = 'Admin Tracer Study STMIK TIME';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('Pelaporan Tracer Study', {
    views: [{ showGridLines: true }],
  });

  const totalCols = EXCEL_KEMDIKTISAINTEK_HEADERS.length; // 103

  // ==========================================
  // BARIS 1: Judul Periode Pelaporan (A1:CY1)
  // ==========================================
  worksheet.mergeCells(1, 1, 1, totalCols);
  const titleCell = worksheet.getCell('A1');

  // Hitung tahun kelulusan: Jika target angkatan 2023, maka tahun lulusan = 2023 + 4 = 2027
  let computedGradYear = '2027';
  if (targetGraduationYear && !isNaN(Number(targetGraduationYear))) {
    const angkatan = Number(targetGraduationYear);
    computedGradYear = String(angkatan + 4);
  } else if (formTitle) {
    const matchLulusan = formTitle.match(/lulusan\s*(\d{4})/i);
    if (matchLulusan) {
      computedGradYear = matchLulusan[1];
    }
  }

  // Ekstrak tahun periode pelaporan (misal 2026) dari formTitle
  const matchPeriodeYear = (formTitle || '').match(/20\d{2}/);
  const periodeYear = matchPeriodeYear ? matchPeriodeYear[0] : '2026';

  // Format baku Cell A1 resmi Kemdiktisaintek
  titleCell.value = `Pelaporan Tracer Study: Periode Pelaporan Tracer Study ${periodeYear} (Lulusan ${computedGradYear})`;

  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6E6FA' }, // Warna Lavender resmi template
  };
  titleCell.font = {
    name: 'Calibri',
    size: 11,
    bold: true,
    color: { argb: 'FF000000' },
  };
  titleCell.alignment = {
    vertical: 'middle',
    horizontal: 'left',
    indent: 1,
  };
  worksheet.getRow(1).height = 18.75;

  // Berikan border tipis pada cell baris 1
  for (let c = 1; c <= totalCols; c++) {
    const cCell = worksheet.getRow(1).getCell(c);
    cCell.border = {
      top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    };
  }

  // ==========================================
  // BARIS 2: Header 103 Kolom Kemdiktisaintek
  // ==========================================
  const headerRow = worksheet.getRow(2);
  headerRow.height = 24;

  EXCEL_KEMDIKTISAINTEK_HEADERS.forEach((headerText, index) => {
    const colNumber = index + 1;
    const cell = headerRow.getCell(colNumber);
    cell.value = headerText;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC1E1C1' }, // Warna Hijau Muda (Tea Green) resmi template
    };
    cell.font = {
      name: 'Calibri',
      size: 10,
      bold: true,
      color: { argb: 'FF000000' },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF9E9E9E' } },
      bottom: { style: 'thin', color: { argb: 'FF9E9E9E' } },
      left: { style: 'thin', color: { argb: 'FF9E9E9E' } },
      right: { style: 'thin', color: { argb: 'FF9E9E9E' } },
    };
  });

  // ==========================================
  // BARIS 3..N: Data Responden Disetujui
  // ==========================================
  approvedResponses.forEach((resp, rIdx) => {
    const rowValues = buildRespondentRow(resp, questions);
    const rowNumber = rIdx + 3;
    const dataRow = worksheet.getRow(rowNumber);
    dataRow.height = 18;

    rowValues.forEach((val, cIdx) => {
      const colNumber = cIdx + 1;
      const cell = dataRow.getCell(colNumber);
      cell.value = val;
      cell.font = {
        name: 'Calibri',
        size: 10,
        color: { argb: 'FF000000' },
      };

      // Alignment berdasarkan tipe kolom
      const isCenteredCol =
        colNumber <= 2 || // Kode PT, Kode Prodi
        colNumber === 3 || // NIM
        colNumber === 7 || // Tahun Lulus
        colNumber === 8 || // NIK
        colNumber === 9 || // NPWP
        typeof val === 'number' ||
        (typeof val === 'string' && val.length <= 4 && !val.includes(' '));

      cell.alignment = {
        vertical: 'middle',
        horizontal: isCenteredCol ? 'center' : 'left',
      };

      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
        right: { style: 'thin', color: { argb: 'FFE0E0E0' } },
      };
    });
  });

  // ==========================================
  // PENGATURAN LEBAR KOLOM
  // ==========================================
  worksheet.columns = EXCEL_KEMDIKTISAINTEK_HEADERS.map((h, i) => {
    if (i === 0) return { width: 12 }; // Kode PT
    if (i === 1) return { width: 12 }; // Kode Prodi
    if (i === 2) return { width: 18 }; // NIM
    if (i === 3) return { width: 28 }; // Nama Mhs
    if (i === 4) return { width: 16 }; // HP
    if (i === 5) return { width: 28 }; // Email
    if (i === 6) return { width: 14 }; // Tahun Lulus
    if (i === 7 || i === 8) return { width: 16 }; // NIK, NPWP
    return { width: Math.max(h.length + 3, 9) };
  });

  // Hasilkan ArrayBuffer dan konversi ke Node.js Buffer
  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
