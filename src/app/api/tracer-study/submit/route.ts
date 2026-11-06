import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { formatDateToDMY, formatDateToYMD } from '@/lib/tracer-utils';
import { SubmitResponsePayload } from '@/types/tracer-study';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SubmitResponsePayload;

    if (!body.form_id || !body.nim || !body.respondent_name) {
      return NextResponse.json(
        { status: 'error', message: 'NIM, nama responden, dan ID formulir wajib diisi.' },
        { status: 400 }
      );
    }

    // Ambil data form untuk memvalidasi tempo & status
    const { data: form, error: formError } = await supabaseAdmin
      .from('tracer_forms')
      .select('*')
      .eq('id', body.form_id)
      .single();

    if (formError || !form) {
      return NextResponse.json(
        { status: 'error', message: 'Formulir kuesioner tidak ditemukan.' },
        { status: 404 }
      );
    }

    if (form.visibility !== 'published') {
      return NextResponse.json(
        { status: 'error', message: 'Formulir ini sedang tidak menerima tanggapan baru.' },
        { status: 403 }
      );
    }

    // Evaluasi tempo jadwal
    const today = new Date().toISOString().slice(0, 10);
    const startDate = formatDateToYMD(form.start_date);
    const endDate = formatDateToYMD(form.end_date);

    if (startDate && today < startDate) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Pengisian kuesioner ini belum dibuka. Tanggal mulai: ${formatDateToDMY(startDate)}.`,
        },
        { status: 403 }
      );
    }

    if (endDate && today > endDate) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Masa pengisian kuesioner Tracer Study ini telah berakhir pada tanggal ${formatDateToDMY(endDate)}.`,
        },
        { status: 403 }
      );
    }

    // Evaluasi pencegahan pengisian ganda (1 kali per mahasiswa)
    const { data: existingResp } = await supabaseAdmin
      .from('tracer_responses')
      .select('id, submitted_at')
      .eq('form_id', body.form_id)
      .eq('nim', body.nim)
      .maybeSingle();

    if (existingResp) {
      return NextResponse.json(
        {
          status: 'error',
          message:
            'Anda sudah pernah mengisi kuesioner Tracer Study ini. Setiap mahasiswa hanya diperkenankan mengisi sebanyak 1 kali.',
          already_submitted: true,
          submitted_at: existingResp.submitted_at,
        },
        { status: 409 }
      );
    }

    // Dapatkan IP Address responden
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '';

    // 1. Simpan header respon (dengan status default 'pending' untuk verifikasi admin)
    const basePayload: Record<string, unknown> = {
      form_id: body.form_id,
      nim: body.nim,
      respondent_name: body.respondent_name,
      respondent_email: body.respondent_email || null,
      prodi: body.prodi || null,
      graduation_year: body.graduation_year || null,
      ip_address: ip,
      submitted_at: new Date().toISOString(),
    };

    let responseRecord: any = null;
    let respError: any = null;

    // Coba insert dengan kolom status approval terlebih dahulu
    const insertWithStatus = await supabaseAdmin
      .from('tracer_responses')
      .insert({ ...basePayload, status: 'pending' })
      .select()
      .single();

    if (insertWithStatus.error) {
      // Jika kolom 'status' belum dieksekusi di database Supabase, fallback insert tanpa kolom status
      if (insertWithStatus.error.message?.includes('status')) {
        const fallbackInsert = await supabaseAdmin
          .from('tracer_responses')
          .insert(basePayload)
          .select()
          .single();
        responseRecord = fallbackInsert.data;
        respError = fallbackInsert.error;
      } else {
        respError = insertWithStatus.error;
      }
    } else {
      responseRecord = insertWithStatus.data;
    }

    if (respError || !responseRecord) {
      console.error('Error inserting tracer_response:', respError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal mencatat respon kuesioner.' },
        { status: 500 }
      );
    }

    // 2. Simpan setiap jawaban
    if (body.answers && Array.isArray(body.answers) && body.answers.length > 0) {
      for (const ans of body.answers) {
        if (!ans.question_id) continue;

        const { data: ansRecord, error: ansError } = await supabaseAdmin
          .from('tracer_answers')
          .insert({
            response_id: responseRecord.id,
            question_id: ans.question_id,
            answer_text: ans.answer_text || null,
          })
          .select()
          .single();

        if (ansError || !ansRecord) {
          console.error('Error inserting tracer_answer:', ansError);
          continue;
        }

        // Jika ada pilihan ganda (checkbox / radio / dropdown)
        if (ans.option_ids && Array.isArray(ans.option_ids) && ans.option_ids.length > 0) {
          const optionRows = ans.option_ids.map((optId) => ({
            answer_id: ansRecord.id,
            option_id: optId,
          }));

          const { error: optError } = await supabaseAdmin
            .from('tracer_answer_options')
            .insert(optionRows);

          if (optError) {
            console.error('Error inserting tracer_answer_options:', optError);
          }
        }
      }
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Tanggapan kuesioner Tracer Study Anda berhasil dikirimkan.',
        data: responseRecord,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Submit response API error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

