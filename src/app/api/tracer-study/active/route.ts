import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { formatDateToDMY, formatDateToYMD } from '@/lib/tracer-utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const nim = searchParams.get('nim');

    // Ambil formulir yang dipublikasikan (published)
    let query = supabaseAdmin
      .from('tracer_forms')
      .select('*')
      .eq('visibility', 'published')
      .order('updated_at', { ascending: false });

    const { data: forms, error: formsError } = await query;

    if (formsError) {
      console.error('Error fetching active tracer form:', formsError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal mengambil formulir kuesioner.' },
        { status: 500 }
      );
    }

    if (!forms || forms.length === 0) {
      return NextResponse.json({
        status: 'empty',
        message: 'Belum ada kuesioner Tracer Study yang dibuka saat ini.',
        data: null,
      });
    }

    // Filter berdasarkan target_graduation_year jika ada
    let selectedForm = forms[0];
    if (year) {
      const matched = forms.find(
        (f) =>
          f.target_graduation_year === year ||
          f.target_graduation_year === 'Semua Angkatan' ||
          !f.target_graduation_year
      );
      if (matched) {
        selectedForm = matched;
      } else {
        return NextResponse.json({
          status: 'empty',
          message: `Saat ini belum ada kuesioner Tracer Study yang dibuka untuk angkatan ${year} Anda.`,
          data: null,
        });
      }
    }

    // Ambil pertanyaan & opsi kuesioner
    const { data: questions, error: qError } = await supabaseAdmin
      .from('tracer_questions')
      .select('*, options:tracer_question_options(*)')
      .eq('form_id', selectedForm.id)
      .order('order_index', { ascending: true });

    if (qError) {
      console.error('Error fetching questions:', qError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal memuat pertanyaan kuesioner.' },
        { status: 500 }
      );
    }

    // Sort options by order_index
    const formattedQuestions = (questions || []).map((q) => {
      const sortedOptions = (q.options || []).sort(
        (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
      );
      return {
        ...q,
        options: sortedOptions,
      };
    });

    const fullForm = {
      ...selectedForm,
      questions: formattedQuestions,
    };

    // Evaluasi tempo jadwal kalender
    const today = new Date().toISOString().slice(0, 10);
    const startDate = formatDateToYMD(selectedForm.start_date);
    const endDate = formatDateToYMD(selectedForm.end_date);

    let scheduleStatus: 'open' | 'upcoming' | 'expired' = 'open';
    let scheduleMessage = 'Kuesioner sedang dalam tempo aktif dan dapat diisi.';

    if (startDate && today < startDate) {
      scheduleStatus = 'upcoming';
      scheduleMessage = `Pengisian kuesioner ini baru akan dibuka pada tanggal ${formatDateToDMY(startDate)}.`;
    } else if (endDate && today > endDate) {
      scheduleStatus = 'expired';
      scheduleMessage = `Masa pengisian kuesioner Tracer Study ini telah ditutup pada tanggal ${formatDateToDMY(endDate)}.`;
    }

    // Evaluasi apakah mahasiswa (berdasarkan NIM) sudah pernah mengisi kuesioner ini
    let alreadySubmitted = false;
    let submittedAt: string | null = null;
    let responseStatus: string | null = null;
    let reviewNotes: string | null = null;

    if (nim && selectedForm) {
      // Coba select dengan status & review_notes, fallback jika kolom belum ada di Supabase
      const respQuery = await supabaseAdmin
        .from('tracer_responses')
        .select('id, submitted_at, status, review_notes')
        .eq('form_id', selectedForm.id)
        .eq('nim', nim)
        .maybeSingle();

      let existingResp: any = null;
      if (respQuery.error && respQuery.error.message?.includes('status')) {
        const fallbackQuery = await supabaseAdmin
          .from('tracer_responses')
          .select('id, submitted_at')
          .eq('form_id', selectedForm.id)
          .eq('nim', nim)
          .maybeSingle();
        existingResp = fallbackQuery.data;
      } else {
        existingResp = respQuery.data;
      }

      if (existingResp) {
        alreadySubmitted = true;
        submittedAt = existingResp.submitted_at;
        responseStatus = existingResp.status || 'pending';
        reviewNotes = existingResp.review_notes || null;
      }
    }

    return NextResponse.json({
      status: 'success',
      schedule_status: scheduleStatus,
      schedule_message: scheduleMessage,
      already_submitted: alreadySubmitted,
      submitted_at: submittedAt,
      response_status: responseStatus,
      review_notes: reviewNotes,
      data: fullForm,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Active tracer form API error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

