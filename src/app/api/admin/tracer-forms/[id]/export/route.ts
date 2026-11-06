import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateTracerStudyExcelBuffer } from '@/lib/tracer-study-excel-export';
import { TracerQuestion, TracerResponse } from '@/types/tracer-study';

// GET /api/admin/tracer-forms/[id]/export?status=approved
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formId = parseInt(id, 10);

    if (isNaN(formId)) {
      return NextResponse.json(
        { status: 'error', message: 'ID formulir tidak valid.' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const filterStatus = searchParams.get('status') || 'approved'; // Default: hanya yang approved

    // 1. Ambil data form
    const { data: form, error: formError } = await supabaseAdmin
      .from('tracer_forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      return NextResponse.json(
        { status: 'error', message: 'Formulir kuesioner tidak ditemukan.' },
        { status: 404 }
      );
    }

    // 2. Ambil seluruh pertanyaan & opsi formulir
    const { data: questions, error: qError } = await supabaseAdmin
      .from('tracer_questions')
      .select('*, options:tracer_question_options(*)')
      .eq('form_id', formId)
      .order('order_index', { ascending: true });

    if (qError) {
      console.error('Error fetching questions for export:', qError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal mengambil data pertanyaan formulir.' },
        { status: 500 }
      );
    }

    // 3. Ambil data responden beserta jawaban dan pilihan opsinya
    let respQuery = supabaseAdmin
      .from('tracer_responses')
      .select(`
        *,
        answers:tracer_answers(
          id,
          question_id,
          answer_text,
          selected_options:tracer_answer_options(
            id,
            option_id,
            option:tracer_question_options(id, option_label, option_value)
          )
        )
      `)
      .eq('form_id', formId);

    if (filterStatus && filterStatus !== 'all') {
      respQuery = respQuery.eq('status', filterStatus);
    }

    const { data: responses, error: respError } = await respQuery.order('submitted_at', {
      ascending: true,
    });

    if (respError) {
      console.error('Error fetching responses for export:', respError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal mengambil data tanggapan responden.' },
        { status: 500 }
      );
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          message:
            filterStatus === 'approved'
              ? 'Belum ada tanggapan responden yang berstatus Disetujui (Approved) untuk diekspor. Silakan setujui respon terlebih dahulu.'
              : 'Belum ada responden yang mengisi formulir ini.',
        },
        { status: 400 }
      );
    }

    // 4. Hasilkan buffer file Excel (.xlsx)
    const excelBuffer = await generateTracerStudyExcelBuffer(
      form.title,
      responses as TracerResponse[],
      questions as TracerQuestion[],
      form.target_graduation_year
    );

    const safeTitle = form.title
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .substring(0, 40);
    const filename = `Pelaporan_Tracer_Study_${safeTitle}_${Date.now()}.xlsx`;

    return new NextResponse(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(excelBuffer.length),
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Export Tracer Study Excel error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Gagal mengekspor file Excel.' },
      { status: 500 }
    );
  }
}
