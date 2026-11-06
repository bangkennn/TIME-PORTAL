import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tbnnwgwnancfwgxbcfhx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibm53Z3duYW5jZndneGJjZmh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mzg2MDE3NCwiZXhwIjoyMTA5NDM2MTc0fQ.5vbG6jsYP6VGbTUYsZAEEK-_UAYRJbxMGn-sDqrMbEo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  console.log('🚀 Memulai proses seeding responden Tracer Study...');

  // 1. Dapatkan form aktif
  const { data: forms, error: formErr } = await supabase
    .from('tracer_forms')
    .select('id, title')
    .order('id', { ascending: false });

  if (formErr || !forms || forms.length === 0) {
    console.error('❌ Gagal mendapatkan tracer_forms:', formErr);
    process.exit(1);
  }

  const activeForm = forms[0];
  console.log(`📋 Target Form ID: ${activeForm.id} ("${activeForm.title}")`);

  // 2. Ambil seluruh pertanyaan & opsi untuk form ini
  const { data: questions, error: qErr } = await supabase
    .from('tracer_questions')
    .select('id, question_text, question_type, order_index, tracer_question_options(id, option_label, option_value, order_index)')
    .eq('form_id', activeForm.id)
    .order('order_index', { ascending: true });

  if (qErr || !questions) {
    console.error('❌ Gagal mengambil pertanyaan:', qErr);
    process.exit(1);
  }

  console.log(`✅ Berhasil memuat ${questions.length} pertanyaan.`);

  // Helper untuk mencari pertanyaan berdasarkan kode tag seperti "[F8]", "[F502]" dsb
  const findQ = (tag) => {
    return questions.find(q => q.question_text.includes(tag));
  };

  // Helper untuk mencari opsi pada pertanyaan
  const findOpt = (q, match) => {
    if (!q || !q.tracer_question_options) return null;
    return q.tracer_question_options.find(o => 
      o.option_label.includes(match) || o.option_value.includes(match)
    );
  };

  // 3. Data 3 Responden Target
  const respondentsData = [
    {
      nim: '2345012',
      respondent_name: 'RISNAWATI DAMANIK',
      respondent_email: 'risnawati.damanik@time.ac.id',
      prodi: 'Sistem Informasi (S1)',
      graduation_year: '2023',
      branch: 'bekerja',
      f8_match: '(1) Bekerja',
      work_name: 'PT Bank Central Asia Tbk',
      salary: '6500000',
      months_to_job: '2',
      province: 'Sumatera Utara',
      city: 'Kota Medan',
    },
    {
      nim: '2244090',
      respondent_name: 'TARQ HILMAR SIREGAR',
      respondent_email: 'tarq.hilmar@time.ac.id',
      prodi: 'Teknik Informatika (S1)',
      graduation_year: '2024',
      branch: 'pendidikan',
      f8_match: '(4) Melanjutkan pendidikan',
      university: 'Institut Teknologi Bandung',
      study_program: 'Magister Informatika (S2)',
      province: 'Jawa Barat',
      city: 'Kota Bandung',
    },
    {
      nim: '2244105',
      respondent_name: 'MICHAEL CHANDRA',
      respondent_email: 'michael.chandra@time.ac.id',
      prodi: 'Teknik Informatika (S1)',
      graduation_year: '2023',
      branch: 'wiraswasta',
      f8_match: '(3) Wiraswasta',
      business_name: 'CV Chandra Digital Solusindo',
      salary: '12000000',
      months_to_job: '1',
      province: 'Sumatera Utara',
      city: 'Kota Medan',
    }
  ];

  for (const respInfo of respondentsData) {
    console.log(`\n--------------------------------------------------`);
    console.log(`👤 Menyisipkan responden: ${respInfo.respondent_name} (${respInfo.nim})...`);

    // Hapus jika responden ini sudah ada sebelumnya agar idempoten
    await supabase.from('tracer_responses').delete().eq('form_id', activeForm.id).eq('nim', respInfo.nim);

    // Insert ke tracer_responses
    const { data: insertedResp, error: insRespErr } = await supabase
      .from('tracer_responses')
      .insert({
        form_id: activeForm.id,
        nim: respInfo.nim,
        respondent_name: respInfo.respondent_name,
        respondent_email: respInfo.respondent_email,
        prodi: respInfo.prodi,
        graduation_year: respInfo.graduation_year,
        ip_address: '127.0.0.1',
        status: 'pending',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insRespErr || !insertedResp) {
      console.error(`❌ Gagal insert responden ${respInfo.nim}:`, insRespErr);
      continue;
    }

    const responseId = insertedResp.id;
    console.log(`   ID Responden: ${responseId} (Status: pending)`);

    // Susun jawaban berdasarkan branch responden
    const answersToInsert = []; // { question_id, answer_text, option_ids: [] }

    // [F8] Status Aktivitas
    const qF8 = findQ('[F8]');
    if (qF8) {
      const opt = findOpt(qF8, respInfo.f8_match);
      if (opt) {
        answersToInsert.push({
          question_id: qF8.id,
          answer_text: opt.option_label,
          option_ids: [opt.id]
        });
      }
    }

    // Cabang Bekerja
    if (respInfo.branch === 'bekerja') {
      const qF502 = findQ('[F502]');
      if (qF502) answersToInsert.push({ question_id: qF502.id, answer_text: respInfo.months_to_job });

      const qF505 = findQ('[F505]');
      if (qF505) answersToInsert.push({ question_id: qF505.id, answer_text: respInfo.salary });

      const qF5A0 = findQ('[F5A0]');
      if (qF5A0) {
        const opt = findOpt(qF5A0, 'Indonesia');
        if (opt) answersToInsert.push({ question_id: qF5A0.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF5A1 = findQ('[F5A1]');
      if (qF5A1) answersToInsert.push({ question_id: qF5A1.id, answer_text: respInfo.province });

      const qF5A2 = findQ('[F5A2]');
      if (qF5A2) answersToInsert.push({ question_id: qF5A2.id, answer_text: respInfo.city });

      const qF1101 = findQ('[F1101]');
      if (qF1101) {
        const opt = findOpt(qF1101, '(3) Perusahaan swasta');
        if (opt) answersToInsert.push({ question_id: qF1101.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF5B = findQ('[F5B]');
      if (qF5B) answersToInsert.push({ question_id: qF5B.id, answer_text: respInfo.work_name });

      const qF5D = findQ('[F5D]');
      if (qF5D) {
        const opt = findOpt(qF5D, '(2) Nasional');
        if (opt) answersToInsert.push({ question_id: qF5D.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF14 = findQ('[F14]');
      if (qF14) {
        const opt = findOpt(qF14, '(1) Sangat relevan');
        if (opt) answersToInsert.push({ question_id: qF14.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF15 = findQ('[F15]');
      if (qF15) {
        const opt = findOpt(qF15, '(2) Tingkat yang sama');
        if (opt) answersToInsert.push({ question_id: qF15.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF301 = findQ('[F301]');
      if (qF301) {
        const opt = findOpt(qF301, '(1) Perkiraan bulan sebelum lulus');
        if (opt) answersToInsert.push({ question_id: qF301.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF302 = findQ('[F302]');
      if (qF302) answersToInsert.push({ question_id: qF302.id, answer_text: '3' });

      const qF4 = findQ('[F4]');
      if (qF4) {
        const opt1 = findOpt(qF4, 'F404');
        const opt2 = findOpt(qF4, 'F411');
        const selectedOpts = [opt1, opt2].filter(Boolean);
        answersToInsert.push({
          question_id: qF4.id,
          answer_text: selectedOpts.map(o => o.option_label).join(', '),
          option_ids: selectedOpts.map(o => o.id)
        });
      }

      const qF6 = findQ('[F6]');
      if (qF6) answersToInsert.push({ question_id: qF6.id, answer_text: '6' });

      const qF7 = findQ('[F7]');
      if (qF7) answersToInsert.push({ question_id: qF7.id, answer_text: '4' });

      const qF7A = findQ('[F7A]');
      if (qF7A) answersToInsert.push({ question_id: qF7A.id, answer_text: '2' });

      const qF1001 = findQ('[F1001]');
      if (qF1001) {
        const opt = findOpt(qF1001, '(1) Ya');
        if (opt) answersToInsert.push({ question_id: qF1001.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF16 = findQ('[F16]');
      if (qF16) {
        const opt1 = findOpt(qF16, 'F1601');
        const opt2 = findOpt(qF16, 'F1602');
        const selectedOpts = [opt1, opt2].filter(Boolean);
        answersToInsert.push({
          question_id: qF16.id,
          answer_text: selectedOpts.map(o => o.option_label).join(', '),
          option_ids: selectedOpts.map(o => o.id)
        });
      }
    }

    // Cabang Melanjutkan Pendidikan
    if (respInfo.branch === 'pendidikan') {
      const qF18A = findQ('[F18A]');
      if (qF18A) {
        const opt = findOpt(qF18A, '(2) Beasiswa');
        if (opt) answersToInsert.push({ question_id: qF18A.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF18B = findQ('[F18B]');
      if (qF18B) answersToInsert.push({ question_id: qF18B.id, answer_text: respInfo.university });

      const qF18C = findQ('[F18C]');
      if (qF18C) answersToInsert.push({ question_id: qF18C.id, answer_text: respInfo.study_program });

      const qF18D = findQ('[F18D]');
      if (qF18D) answersToInsert.push({ question_id: qF18D.id, answer_text: '2024-09-01' });

      const qF5A0 = findQ('[F5A0]');
      if (qF5A0) {
        const opt = findOpt(qF5A0, 'Indonesia');
        if (opt) answersToInsert.push({ question_id: qF5A0.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF5A1 = findQ('[F5A1]');
      if (qF5A1) answersToInsert.push({ question_id: qF5A1.id, answer_text: respInfo.province });

      const qF5A2 = findQ('[F5A2]');
      if (qF5A2) answersToInsert.push({ question_id: qF5A2.id, answer_text: respInfo.city });

      const qF14 = findQ('[F14]');
      if (qF14) {
        const opt = findOpt(qF14, '(1) Sangat relevan');
        if (opt) answersToInsert.push({ question_id: qF14.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }
    }

    // Cabang Wiraswasta
    if (respInfo.branch === 'wiraswasta') {
      const qF502 = findQ('[F502]');
      if (qF502) answersToInsert.push({ question_id: qF502.id, answer_text: respInfo.months_to_job });

      const qF505 = findQ('[F505]');
      if (qF505) answersToInsert.push({ question_id: qF505.id, answer_text: respInfo.salary });

      const qF5C = findQ('[F5C]');
      if (qF5C) {
        const opt = findOpt(qF5C, '(1) Founder');
        if (opt) answersToInsert.push({ question_id: qF5C.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF5B = findQ('[F5B]');
      if (qF5B) answersToInsert.push({ question_id: qF5B.id, answer_text: respInfo.business_name });

      const qF5E = findQ('[F5E]');
      if (qF5E) {
        const opt = findOpt(qF5E, '(1) Sudah');
        if (opt) answersToInsert.push({ question_id: qF5E.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF5D = findQ('[F5D]');
      if (qF5D) {
        const opt = findOpt(qF5D, '(2) Nasional');
        if (opt) answersToInsert.push({ question_id: qF5D.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF5A0 = findQ('[F5A0]');
      if (qF5A0) {
        const opt = findOpt(qF5A0, 'Indonesia');
        if (opt) answersToInsert.push({ question_id: qF5A0.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF5A1 = findQ('[F5A1]');
      if (qF5A1) answersToInsert.push({ question_id: qF5A1.id, answer_text: respInfo.province });

      const qF5A2 = findQ('[F5A2]');
      if (qF5A2) answersToInsert.push({ question_id: qF5A2.id, answer_text: respInfo.city });

      const qF14 = findQ('[F14]');
      if (qF14) {
        const opt = findOpt(qF14, '(1) Sangat relevan');
        if (opt) answersToInsert.push({ question_id: qF14.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF15 = findQ('[F15]');
      if (qF15) {
        const opt = findOpt(qF15, '(2) Tingkat yang sama');
        if (opt) answersToInsert.push({ question_id: qF15.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF301 = findQ('[F301]');
      if (qF301) {
        const opt = findOpt(qF301, '(3) Saya tidak mencari pekerjaan');
        if (opt) answersToInsert.push({ question_id: qF301.id, answer_text: opt.option_label, option_ids: [opt.id] });
      }

      const qF16 = findQ('[F16]');
      if (qF16) {
        const opt = findOpt(qF16, 'F1603') || qF16.tracer_question_options?.[2];
        if (opt) {
          answersToInsert.push({
            question_id: qF16.id,
            answer_text: opt.option_label,
            option_ids: [opt.id]
          });
        }
      }
    }

    // Evaluasi Almamater (F1201) - Diisi semua
    const qF1201 = findQ('[F1201]');
    if (qF1201) {
      const opt = findOpt(qF1201, '(1) Sangat besar') || findOpt(qF1201, '(2) Besar');
      if (opt) answersToInsert.push({ question_id: qF1201.id, answer_text: opt.option_label, option_ids: [opt.id] });
    }

    // Kompetensi F1761..F1782 & Proses Belajar F21..F37 (Scale questions)
    const scaleQuestions = questions.filter(q => q.question_type === 'scale');
    for (const sq of scaleQuestions) {
      // Pilih opsi nilai tinggi: (4) Tinggi / (5) Sangat tinggi / (1) Sangat besar / (2) Besar
      const opts = sq.tracer_question_options || [];
      if (opts.length > 0) {
        // default ambil opsi index 3 atau 4 (skala 4 atau 5)
        const chosen = opts[opts.length - 1] || opts[0];
        answersToInsert.push({
          question_id: sq.id,
          answer_text: chosen.option_label,
          option_ids: [chosen.id]
        });
      }
    }

    console.log(`   Menyimpan ${answersToInsert.length} butir jawaban...`);

    // Insert answers secara berurutan
    for (const ans of answersToInsert) {
      const { data: insertedAns, error: ansErr } = await supabase
        .from('tracer_answers')
        .insert({
          response_id: responseId,
          question_id: ans.question_id,
          answer_text: ans.answer_text
        })
        .select()
        .single();

      if (ansErr || !insertedAns) {
        console.error(`   ⚠️ Error insert answer for Q${ans.question_id}:`, ansErr?.message);
        continue;
      }

      // Insert option ids jika ada
      if (ans.option_ids && ans.option_ids.length > 0) {
        const optionRows = ans.option_ids.map(optId => ({
          answer_id: insertedAns.id,
          option_id: optId
        }));

        const { error: optErr } = await supabase
          .from('tracer_answer_options')
          .insert(optionRows);

        if (optErr) {
          console.error(`   ⚠️ Error insert answer options for answer ${insertedAns.id}:`, optErr.message);
        }
      }
    }

    console.log(`   ✅ Selesai menyimpan data responden: ${respInfo.respondent_name}`);
  }

  // Verifikasi hasil akhir
  const { data: finalResponses } = await supabase
    .from('tracer_responses')
    .select('id, nim, respondent_name, status, submitted_at')
    .eq('form_id', activeForm.id)
    .order('id', { ascending: true });

  console.log('\n==================================================');
  console.log('🎉 SEEDING BERHASIL! Daftar Responden Siap di-Approve:');
  console.table(finalResponses);
}

seed().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

