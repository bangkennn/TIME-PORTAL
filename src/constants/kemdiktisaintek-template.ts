import { TracerQuestion } from '@/types/tracer-study';

const COMPETENCY_SCALE_OPTIONS = [
  { option_label: '(1) Sangat rendah', order_index: 0 },
  { option_label: '(2) Rendah', order_index: 1 },
  { option_label: '(3) Sedang', order_index: 2 },
  { option_label: '(4) Tinggi', order_index: 3 },
  { option_label: '(5) Sangat tinggi', order_index: 4 },
];

const LEARNING_METHOD_SCALE_OPTIONS = [
  { option_label: '(5) Tidak ada', order_index: 0 },
  { option_label: '(4) Kurang', order_index: 1 },
  { option_label: '(3) Cukup', order_index: 2 },
  { option_label: '(2) Besar', order_index: 3 },
  { option_label: '(1) Sangat besar', order_index: 4 },
];

export const KEMDIKTISAINTEK_TEMPLATE_QUESTIONS: TracerQuestion[] = [
  // 1. [F8] Aktivitas Utama
  {
    question_text: '[F8] Apakah status aktivitas Anda saat ini?',
    help_text: 'F8 tidak boleh kosong',
    question_type: 'radio',
    metric_tag: 'employment_status',
    is_required: true,
    order_index: 0,
    options: [
      { option_label: '(1) Bekerja (penuh waktu/paruh waktu)', order_index: 0 },
      { option_label: '(3) Wiraswasta/wirausaha/pekerja lepas', order_index: 1 },
      { option_label: '(4) Melanjutkan pendidikan', order_index: 2 },
      { option_label: '(5) Tidak bekerja tetapi sedang mencari pekerjaan', order_index: 3 },
      { option_label: '(2) Belum memungkinkan bekerja (sakit, mengurus keluarga, dan/atau alasan lainnya)', order_index: 4 },
    ],
  },

  // 2. [F502] Masa Tunggu Pekerjaan Pertama
  {
    question_text:
      '[F502] Dalam berapa bulan Anda mendapatkan pekerjaan pertama? (Kelulusan dihitung berdasarkan bulan yudisium dan masa tunggu kerja dihitung 0, jika bekerja sebelum lulus)',
    help_text: 'Instrumen F502 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja (Isi dengan angka)',
    question_type: 'short_text',
    metric_tag: 'waiting_time',
    is_required: false,
    order_index: 1,
  },

  // 3. [F505] Rata-rata Pendapatan / Take Home Pay
  {
    question_text:
      '[F505] Berapa rata-rata pendapatan (take home pay dalam rupiah) Anda per bulan? (take home pay adalah jumlah total penghasilan yang diterima ditambah tunjangan/bonus) – tulis dengan angka tanpa titik dan koma, contoh 5000000',
    help_text: 'Instrumen F505 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja',
    question_type: 'short_text',
    metric_tag: 'salary',
    is_required: false,
    order_index: 2,
  },

  // 4. [F5A0], [F5A1], [F5A2] Lokasi Kerja
  {
    question_text: '[F5A0] Negara',
    help_text: 'Instrumen F5A0 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja',
    question_type: 'dropdown',
    is_required: false,
    order_index: 3,
    options: [
      { option_label: 'Indonesia', order_index: 0 },
      { option_label: 'Luar Negeri', order_index: 1 },
    ],
  },
  {
    question_text: '[F5A1] Provinsi',
    help_text: 'Instrumen F5A1 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja, dan jika jawaban pada F5A0 adalah Indonesia',
    question_type: 'short_text',
    is_required: false,
    order_index: 4,
  },
  {
    question_text: '[F5A2] Kabupaten/kota',
    help_text: 'Instrumen F5A2/kabupaten/kota harus sesuai dengan F5A1/provinsi yang dipilih',
    question_type: 'short_text',
    is_required: false,
    order_index: 5,
  },

  // 5. [F1101] Jenis Instansi / Perusahaan
  {
    question_text: '[F1101] Apa jenis perusahaan/instansi/institusi tempat Anda bekerja sekarang?',
    help_text: 'Instrumen F1101 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja',
    question_type: 'radio',
    is_required: false,
    order_index: 6,
    options: [
      { option_label: '(1) Instansi/lembaga pemerintah', order_index: 0 },
      { option_label: '(6) Badan Usaha Milik Negara (BUMN)/Badan Usaha Milik Daerah (BUMD)', order_index: 1 },
      { option_label: '(7) Institusi/organisasi multilateral', order_index: 2 },
      { option_label: '(2) Institusi/organisasi nirlaba', order_index: 3 },
      { option_label: '(3) Perusahaan swasta (perusahaan nasional, multinasional, rintisan/startup, UMKM, dan lain-lain)', order_index: 4 },
      { option_label: '(5) Lainnya, tuliskan ...', order_index: 5 },
    ],
  },
  {
    question_text: '[F1102] Lainnya, tuliskan ...',
    help_text: 'Instrumen F1102 ditampilkan jika jawaban pada F1101 memilih 5 atau lainnya',
    question_type: 'short_text',
    is_required: false,
    order_index: 7,
  },

  // 6. [F5B] Nama Perusahaan/Kantor
  {
    question_text: '[F5B] Apa nama perusahaan/kantor tempat Anda bekerja?',
    help_text: 'Instrumen F5B ditampilkan jika jawaban pada F8 memilih 1 atau bekerja',
    question_type: 'short_text',
    is_required: false,
    order_index: 8,
  },

  // 7. [F5C] Posisi / Jabatan Wiraswasta
  {
    question_text: '[F5C] Jika Anda sedang berwiraswasta/berwirausaha, apa posisi/jabatan Anda saat ini?',
    help_text: 'Pilih salah satu jawaban dari daftar di bawah ini',
    question_type: 'radio',
    is_required: false,
    order_index: 9,
    options: [
      { option_label: '(1) Founder', order_index: 0 },
      { option_label: '(2) Co-Founder', order_index: 1 },
      { option_label: '(4) Freelance/Kerja Lepas', order_index: 2 },
    ],
  },

  // 8. [F5E] Izin Usaha
  {
    question_text: '[F5E] Apakah wiraswasta/wirausaha Anda sudah berizin/terdaftar?',
    help_text: 'Instrumen F5E ditampilkan jika jawaban pada F8 memilih 3 atau wirausaha',
    question_type: 'radio',
    is_required: false,
    order_index: 10,
    options: [
      { option_label: '(0) Belum', order_index: 0 },
      { option_label: '(1) Sudah', order_index: 1 },
    ],
  },

  // 9. [F5D] Ruang Lingkup
  {
    question_text: '[F5D] Apa ruang lingkup tempat Anda bekerja?',
    help_text: 'Pilih salah satu jawaban dari daftar di bawah ini',
    question_type: 'radio',
    is_required: false,
    order_index: 11,
    options: [
      { option_label: '(1) Lokal/Wilayah', order_index: 0 },
      { option_label: '(2) Nasional', order_index: 1 },
      { option_label: '(3) Multinasional/Internasional', order_index: 2 },
    ],
  },

  // 10. [F18A]-[F18D] Studi Lanjut
  {
    question_text: '[F18A] Sumber biaya',
    help_text: 'Pilih salah satu jawaban dari daftar di bawah ini',
    question_type: 'radio',
    is_required: false,
    order_index: 12,
    options: [
      { option_label: '(1) Biaya Sendiri', order_index: 0 },
      { option_label: '(2) Beasiswa', order_index: 1 },
    ],
  },
  {
    question_text: '[F18B] Perguruan tinggi',
    help_text: 'Instrumen F18B ditampilkan jika jawaban pada F8 memilih 4 atau melanjutkan pendidikan',
    question_type: 'short_text',
    is_required: false,
    order_index: 13,
  },
  {
    question_text: '[F18C] Program Studi',
    help_text: 'Instrumen F18C ditampilkan jika jawaban pada F8 memilih 4 atau melanjutkan pendidikan',
    question_type: 'short_text',
    is_required: false,
    order_index: 14,
  },
  {
    question_text: '[F18D] Tanggal Masuk',
    help_text: 'Instrumen F18D ditampilkan jika jawaban pada F8 memilih 4 atau melanjutkan pendidikan',
    question_type: 'date',
    is_required: false,
    order_index: 15,
  },

  // 11. [F14] Relevansi Bidang Studi
  {
    question_text: '[F14] Seberapa relevan bidang studi dengan pekerjaan Anda saat ini?',
    help_text: 'Instrumen F14 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja',
    question_type: 'radio',
    metric_tag: 'study_relevance',
    is_required: false,
    order_index: 16,
    options: [
      { option_label: '(5) Tidak relevan', order_index: 0 },
      { option_label: '(4) Kurang relevan', order_index: 1 },
      { option_label: '(3) Cukup relevan', order_index: 2 },
      { option_label: '(2) Relevan', order_index: 3 },
      { option_label: '(1) Sangat relevan', order_index: 4 },
    ],
  },

  // 12. [F15] Keselarasan Jenjang Pendidikan
  {
    question_text: '[F15] Tingkat kesesuaian jenjang pendidikan untuk pekerjaan Anda saat ini?',
    help_text: 'Instrumen F15 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja',
    question_type: 'radio',
    is_required: false,
    order_index: 17,
    options: [
      { option_label: '(4) Tidak perlu pendidikan tinggi', order_index: 0 },
      { option_label: '(3) Setingkat lebih rendah', order_index: 1 },
      { option_label: '(2) Tingkat yang sama', order_index: 2 },
      { option_label: '(1) Setingkat lebih tinggi', order_index: 3 },
    ],
  },

  // 13. [F301], [F302], [F303] Waktu Mulai Mencari Kerja
  {
    question_text:
      '[F301] Kapan Anda mulai mencari pekerjaan? (Kelulusan dihitung berdasarkan bulan yudisium dan pekerjaan sambilan tidak dimasukkan)',
    help_text: 'Instrumen F301 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja',
    question_type: 'radio',
    is_required: false,
    order_index: 18,
    options: [
      { option_label: '(1) Perkiraan bulan sebelum lulus', order_index: 0 },
      { option_label: '(2) Perkiraan bulan sesudah lulus', order_index: 1 },
      { option_label: '(3) Saya tidak mencari pekerjaan (misalnya ditawari/ikatan dinas)', order_index: 2 },
    ],
  },
  {
    question_text: '[F302] Perkiraan bulan sebelum lulus',
    help_text: 'Instrumen F302 ditampilkan jika jawaban pada F301 memilih opsi ke-1',
    question_type: 'short_text',
    is_required: false,
    order_index: 19,
  },
  {
    question_text: '[F303] Perkiraan bulan sesudah lulus',
    help_text: 'Instrumen F303 ditampilkan jika jawaban pada F301 memilih opsi ke-2',
    question_type: 'short_text',
    is_required: false,
    order_index: 20,
  },

  // 14. [F4] Saluran Mencari Kerja (Checkbox Multi-pilihan)
  {
    question_text: '[F4] Bagaimana Anda mencari pekerjaan tersebut? (Jawaban bisa lebih dari satu)',
    help_text: 'Instrumen F4 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja',
    question_type: 'checkbox',
    is_required: false,
    order_index: 21,
    options: [
      { option_label: '[F401] (0/1) Melalui iklan di koran/majalah/brosur', order_index: 0 },
      { option_label: '[F402] (0/1) Melamar ke perusahaan tanpa mengetahui lowongan yang ada', order_index: 1 },
      { option_label: '[F403] (0/1) Pergi ke bursa/pameran kerja', order_index: 2 },
      { option_label: '[F404] (0/1) Mencari lewat internet/media sosial/job portal', order_index: 3 },
      { option_label: '[F405] (0/1) Dihubungi oleh perusahaan', order_index: 4 },
      { option_label: '[F406] (0/1) Menghubungi Kementerian Ketenagakerjaan', order_index: 5 },
      { option_label: '[F407] (0/1) Menghubungi agen tenaga kerja komersial/swasta', order_index: 6 },
      { option_label: '[F408] (0/1) Memperoleh informasi karir dari fakultas/universitas', order_index: 7 },
      { option_label: '[F409] (0/1) Menghubungi kantor kemahasiswaan/hubungan alumni', order_index: 8 },
      { option_label: '[F411] (0/1) Melalui jejaring/relasi (misalnya dosen, orang tua, saudara, teman, dll)', order_index: 9 },
      { option_label: '[F413] (0/1) Melalui penempatan kerja atau magang', order_index: 10 },
      { option_label: '[F414] (0/1) Bekerja di tempat yang sama dengan tempat kerja semasa kuliah', order_index: 11 },
      { option_label: '[F415] (0/1) Lainnya, tuliskan ...', order_index: 12 },
    ],
  },
  {
    question_text: '[F416] Lainnya, tuliskan ...',
    help_text: 'Instrumen F416 ditampilkan jika jawaban pada F415 memilih 1 atau ya',
    question_type: 'short_text',
    is_required: false,
    order_index: 22,
  },

  // 15. [F6], [F7], [F7A] Rekap Lamaran & Wawancara
  {
    question_text:
      '[F6] Berapa jumlah perusahaan/instansi/institusi yang sudah Anda lamar (lewat surat atau email) sebelum Anda memperoleh pekerjaan pertama?',
    help_text: 'Instrumen F6 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja / 5 atau sedang mencari kerja',
    question_type: 'short_text',
    is_required: false,
    order_index: 23,
  },
  {
    question_text: '[F7] Berapa jumlah perusahaan/instansi/institusi yang merespons lamaran Anda?',
    help_text: 'Instrumen F7 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja / 5 atau sedang mencari kerja',
    question_type: 'short_text',
    is_required: false,
    order_index: 24,
  },
  {
    question_text: '[F7A] Berapa jumlah perusahaan/instansi/institusi yang mengundang Anda untuk wawancara?',
    help_text: 'Instrumen F7A ditampilkan jika jawaban pada F8 memilih 1 atau bekerja',
    question_type: 'short_text',
    is_required: false,
    order_index: 25,
  },

  // 16. [F1001], [F1002] Keaktifan Mencari Kerja
  {
    question_text: '[F1001] Apakah Anda aktif mencari pekerjaan dalam 4 minggu terakhir?',
    help_text: 'Instrumen F1001 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja / 5 atau sedang mencari kerja',
    question_type: 'radio',
    is_required: false,
    order_index: 26,
    options: [
      { option_label: '(1) Tidak', order_index: 0 },
      { option_label: '(2) Tidak, tapi saya sedang menunggu hasil lamaran kerja', order_index: 1 },
      { option_label: '(3) Ya, saya akan mulai bekerja dalam 2 minggu ke depan', order_index: 2 },
      { option_label: '(4) Ya, tapi saya belum pasti akan bekerja dalam 2 minggu ke depan', order_index: 3 },
      { option_label: '(5) Lainnya, tuliskan ...', order_index: 4 },
    ],
  },
  {
    question_text: '[F1002] Lainnya, tuliskan ...',
    help_text: 'Instrumen F1002 ditampilkan jika jawaban pada F1001 memilih 5 atau lainnya',
    question_type: 'short_text',
    is_required: false,
    order_index: 27,
  },

  // 17. [F16] Alasan Mengambil Pekerjaan
  {
    question_text:
      '[F16] Jika menurut Anda pekerjaan saat ini tidak relevan dengan latar belakang pendidikan Anda, mengapa Anda mengambilnya? (Jawaban bisa lebih dari satu)',
    help_text: 'Instrumen F16 ditampilkan jika jawaban pada F8 memilih 1 atau bekerja',
    question_type: 'checkbox',
    is_required: false,
    order_index: 28,
    options: [
      { option_label: '[F1601] (0/1) Pekerjaan saya saat ini sudah relevan dengan pendidikan saya.', order_index: 0 },
      { option_label: '[F1602] (0/1) Saya belum mendapatkan pekerjaan yang lebih relevan.', order_index: 1 },
      { option_label: '[F1603] (0/1) Di pekerjaan ini saya memperoleh prospek karier yang baik.', order_index: 2 },
      { option_label: '[F1604] (0/1) Saya lebih suka bekerja di area pekerjaan yang tidak ada hubungannya dengan pendidikan saya.', order_index: 3 },
      { option_label: '[F1605] (0/1) Saya dipromosikan ke posisi yang kurang berhubungan dengan pendidikan saya dibanding posisi sebelumnya.', order_index: 4 },
      { option_label: '[F1606] (0/1) Saya dapat memperoleh pendapatan yang lebih tinggi pada pekerjaan saya saat ini.', order_index: 5 },
      { option_label: '[F1607] (0/1) Pekerjaan saya saat ini lebih aman/terjamin.', order_index: 6 },
      { option_label: '[F1608] (0/1) Pekerjaan saya saat ini lebih menarik.', order_index: 7 },
      { option_label: '[F1609] (0/1) Pekerjaan saya saat ini lebih memungkinkan saya mengambil pekerjaan tambahan/jadwal yang fleksibel, dll.', order_index: 8 },
      { option_label: '[F1610] (0/1) Pekerjaan saya saat ini lokasinya lebih dekat dari rumah saya.', order_index: 9 },
      { option_label: '[F1612] (0/1) Pada awal meniti karir ini, saya harus menerima pekerjaan yang tidak berhubungan dengan pendidikan saya.', order_index: 10 },
      { option_label: '[F1613] (0/1) Lainnya, tuliskan ...', order_index: 11 },
    ],
  },
  {
    question_text: '[F1614] Lainnya, tuliskan ...',
    help_text: 'Instrumen F1614 ditampilkan jika jawaban pada F1613 memilih 1 atau ya',
    question_type: 'short_text',
    is_required: false,
    order_index: 29,
  },

  // 18. [F1201], [F1202] Sumber Pembiayaan Kuliah
  {
    question_text: '[F1201] Sebutkan sumber dana dalam pembiayaan kuliah? (bukan ketika studi lanjut)',
    help_text: 'F1201 tidak boleh kosong',
    question_type: 'radio',
    is_required: true,
    order_index: 30,
    options: [
      { option_label: '(1) Biaya sendiri/keluarga', order_index: 0 },
      { option_label: '(2) Beasiswa ADIK', order_index: 1 },
      { option_label: '(3) Beasiswa KIP-Kuliah (KIP-K)', order_index: 2 },
      { option_label: '(4) Beasiswa PPA', order_index: 3 },
      { option_label: '(5) Beasiswa AFIRMASI', order_index: 4 },
      { option_label: '(6) Beasiswa perusahaan/swasta', order_index: 5 },
      { option_label: '(8) Beasiswa pemerintah daerah', order_index: 6 },
      { option_label: '(7) Lainnya, tuliskan ...', order_index: 7 },
    ],
  },
  {
    question_text: '[F1202] Lainnya, tuliskan ...',
    help_text: 'Instrumen F1202 ditampilkan jika jawaban pada F1201 memilih opsi jawaban 7 atau lainnya',
    question_type: 'short_text',
    is_required: false,
    order_index: 31,
  },

  // 19. [F17A] Kompetensi Saat Lulus (A - Penguasaan)
  {
    question_text: '[F1761] Etika (Pada saat lulus)',
    help_text: '[F17A] Pada saat lulus, pada tingkat mana kompetensi Etika yang Anda kuasai?',
    question_type: 'scale',
    is_required: true,
    order_index: 32,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1763] Keahlian berdasarkan bidang ilmu (Pada saat lulus)',
    help_text: '[F17A] Pada saat lulus, pada tingkat mana kompetensi Keahlian berdasarkan bidang ilmu yang Anda kuasai?',
    question_type: 'scale',
    is_required: true,
    order_index: 33,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1765] Bahasa Inggris (Pada saat lulus)',
    help_text: '[F17A] Pada saat lulus, pada tingkat mana kompetensi Bahasa Inggris yang Anda kuasai?',
    question_type: 'scale',
    is_required: true,
    order_index: 34,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1767] Penggunaan teknologi informasi (Pada saat lulus)',
    help_text: '[F17A] Pada saat lulus, pada tingkat mana kompetensi Penggunaan teknologi informasi yang Anda kuasai?',
    question_type: 'scale',
    is_required: true,
    order_index: 35,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1769] Komunikasi (Pada saat lulus)',
    help_text: '[F17A] Pada saat lulus, pada tingkat mana kompetensi Komunikasi yang Anda kuasai?',
    question_type: 'scale',
    is_required: true,
    order_index: 36,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1771] Kerja sama tim (Pada saat lulus)',
    help_text: '[F17A] Pada saat lulus, pada tingkat mana kompetensi Kerja sama tim yang Anda kuasai?',
    question_type: 'scale',
    is_required: true,
    order_index: 37,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1773] Pengembangan diri (Pada saat lulus)',
    help_text: '[F17A] Pada saat lulus, pada tingkat mana kompetensi Pengembangan diri yang Anda kuasai?',
    question_type: 'scale',
    is_required: true,
    order_index: 38,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1775] Berpikir kritis (Pada saat lulus)',
    help_text: '[F17A] Pada saat lulus, pada tingkat mana kompetensi Berpikir kritis yang Anda kuasai?',
    question_type: 'scale',
    is_required: true,
    order_index: 39,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1777] Kreativitas (Pada saat lulus)',
    help_text: '[F17A] Pada saat lulus, pada tingkat mana kompetensi Kreativitas yang Anda kuasai?',
    question_type: 'scale',
    is_required: true,
    order_index: 40,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1779] Kewirausahaan (Pada saat lulus)',
    help_text: '[F17A] Pada saat lulus, pada tingkat mana kompetensi Kewirausahaan yang Anda kuasai?',
    question_type: 'scale',
    is_required: true,
    order_index: 41,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1781] Adaptasi (Pada saat lulus)',
    help_text: '[F17A] Pada saat lulus, pada tingkat mana kompetensi Adaptasi yang Anda kuasai?',
    question_type: 'scale',
    is_required: true,
    order_index: 42,
    options: COMPETENCY_SCALE_OPTIONS,
  },

  // 20. [F17B] Kompetensi Saat Ini di Pekerjaan (B - Diperlukan)
  {
    question_text: '[F1762] Etika (Diperlukan dalam pekerjaan)',
    help_text: '[F17B] Pada saat ini, pada tingkat mana kompetensi Etika yang diperlukan dalam pekerjaan?',
    question_type: 'scale',
    is_required: true,
    order_index: 43,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1764] Keahlian berdasarkan bidang ilmu (Diperlukan dalam pekerjaan)',
    help_text: '[F17B] Pada saat ini, pada tingkat mana kompetensi Keahlian berdasarkan bidang ilmu yang diperlukan dalam pekerjaan?',
    question_type: 'scale',
    is_required: true,
    order_index: 44,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1766] Bahasa Inggris (Diperlukan dalam pekerjaan)',
    help_text: '[F17B] Pada saat ini, pada tingkat mana kompetensi Bahasa Inggris yang diperlukan dalam pekerjaan?',
    question_type: 'scale',
    is_required: true,
    order_index: 45,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1768] Penggunaan teknologi informasi (Diperlukan dalam pekerjaan)',
    help_text: '[F17B] Pada saat ini, pada tingkat mana kompetensi Penggunaan teknologi informasi yang diperlukan dalam pekerjaan?',
    question_type: 'scale',
    is_required: true,
    order_index: 46,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1770] Komunikasi (Diperlukan dalam pekerjaan)',
    help_text: '[F17B] Pada saat ini, pada tingkat mana kompetensi Komunikasi yang diperlukan dalam pekerjaan?',
    question_type: 'scale',
    is_required: true,
    order_index: 47,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1772] Kerja sama tim (Diperlukan dalam pekerjaan)',
    help_text: '[F17B] Pada saat ini, pada tingkat mana kompetensi Kerja sama tim yang diperlukan dalam pekerjaan?',
    question_type: 'scale',
    is_required: true,
    order_index: 48,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1774] Pengembangan diri (Diperlukan dalam pekerjaan)',
    help_text: '[F17B] Pada saat ini, pada tingkat mana kompetensi Pengembangan diri yang diperlukan dalam pekerjaan?',
    question_type: 'scale',
    is_required: true,
    order_index: 49,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1776] Berpikir kritis (Diperlukan dalam pekerjaan)',
    help_text: '[F17B] Pada saat ini, pada tingkat mana kompetensi Berpikir kritis yang diperlukan dalam pekerjaan?',
    question_type: 'scale',
    is_required: true,
    order_index: 50,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1778] Kreativitas (Diperlukan dalam pekerjaan)',
    help_text: '[F17B] Pada saat ini, pada tingkat mana kompetensi Kreativitas yang diperlukan dalam pekerjaan?',
    question_type: 'scale',
    is_required: true,
    order_index: 51,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1780] Kewirausahaan (Diperlukan dalam pekerjaan)',
    help_text: '[F17B] Pada saat ini, pada tingkat mana kompetensi Kewirausahaan yang diperlukan dalam pekerjaan?',
    question_type: 'scale',
    is_required: true,
    order_index: 52,
    options: COMPETENCY_SCALE_OPTIONS,
  },
  {
    question_text: '[F1782] Adaptasi (Diperlukan dalam pekerjaan)',
    help_text: '[F17B] Pada saat ini, pada tingkat mana kompetensi Adaptasi yang diperlukan dalam pekerjaan?',
    question_type: 'scale',
    is_required: true,
    order_index: 53,
    options: COMPETENCY_SCALE_OPTIONS,
  },

  // 21. [F2] Bentuk / Metode Pembelajaran di Program Studi
  {
    question_text: '[F21] Perkuliahan',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada bentuk/metode perkuliahan dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 54,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F22] Mendemonstrasikan',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada metode mendemonstrasikan dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 55,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F23] Penelitian/partisipasi dalam proyek riset',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada penelitian/partisipasi dalam proyek riset dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 56,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F24] Magang/praktik kerja',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada magang/praktik kerja dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 57,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F25] Praktikum',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada praktikum dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 58,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F26] Kerja lapangan',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada kerja lapangan dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 59,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F27] Diskusi',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada diskusi dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 60,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F28] Responsi/tutorial',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada responsi/tutorial dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 61,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F29] Seminar',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada seminar dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 62,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F30] Studio',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada studio dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 63,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F31] Perancangan',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada perancangan dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 64,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F32] Pengembangan (misal produk/karya seni)',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada pengembangan (misal produk/karya seni) dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 65,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F33] Tugas akhir',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada tugas akhir dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 66,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F34] Pelatihan bela negara',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada pelatihan bela negara dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 67,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F35] Pertukaran pelajar',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada pertukaran pelajar dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 68,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F36] Wirausaha',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada wirausaha dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 69,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
  {
    question_text: '[F37] Pengabdian kepada masyarakat',
    help_text: '[F2] Menurut Anda seberapa besar penekanan pada pengabdian kepada masyarakat dilaksanakan di program studi?',
    question_type: 'scale',
    is_required: false,
    order_index: 70,
    options: LEARNING_METHOD_SCALE_OPTIONS,
  },
];

