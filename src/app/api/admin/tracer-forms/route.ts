import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { slugify } from '@/lib/tracer-utils';
import { CreateFormPayload } from '@/types/tracer-study';

// GET /api/admin/tracer-forms
export async function GET() {
  try {
    // Ambil semua formulir diurutkan berdasarkan tanggal dibuat terbaru
    const { data: forms, error: formsError } = await supabaseAdmin
      .from('tracer_forms')
      .select('*, questions:tracer_questions(count), responses:tracer_responses(count)')
      .order('created_at', { ascending: false });

    if (formsError) {
      console.error('Error fetching admin forms:', formsError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal mengambil daftar formulir Tracer Study.' },
        { status: 500 }
      );
    }

    const formattedForms = (forms || []).map((f) => {
      const qCount = Array.isArray(f.questions) && f.questions.length > 0 ? f.questions[0].count : 0;
      const rCount = Array.isArray(f.responses) && f.responses.length > 0 ? f.responses[0].count : 0;
      return {
        ...f,
        questions_count: qCount,
        responses_count: rCount,
      };
    });

    return NextResponse.json({
      status: 'success',
      data: formattedForms,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Admin tracer forms GET error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/tracer-forms
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateFormPayload;

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { status: 'error', message: 'Judul formulir kuesioner wajib diisi.' },
        { status: 400 }
      );
    }

    const slug = slugify(body.title);

    // 1. Simpan data induk form
    const { data: formRecord, error: formError } = await supabaseAdmin
      .from('tracer_forms')
      .insert({
        title: body.title.trim(),
        slug,
        description: body.description || null,
        target_graduation_year: body.target_graduation_year || null,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        visibility: body.visibility || 'draft',
        created_by: 'Administrator',
      })
      .select()
      .single();

    if (formError || !formRecord) {
      console.error('Error creating form record:', formError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal membuat data formulir kuesioner.' },
        { status: 500 }
      );
    }

    // 2. Simpan pertanyaan & opsi
    if (body.questions && Array.isArray(body.questions) && body.questions.length > 0) {
      for (let qIdx = 0; qIdx < body.questions.length; qIdx++) {
        const q = body.questions[qIdx];
        if (!q.question_text || !q.question_text.trim()) continue;

        const { data: qRecord, error: qError } = await supabaseAdmin
          .from('tracer_questions')
          .insert({
            form_id: formRecord.id,
            question_text: q.question_text.trim(),
            help_text: q.help_text || null,
            question_type: q.question_type || 'short_text',
            metric_tag: q.metric_tag && q.metric_tag !== 'none' ? q.metric_tag : null,
            is_required: Boolean(q.is_required),
            order_index: typeof q.order_index === 'number' ? q.order_index : qIdx,
          })
          .select()
          .single();

        if (qError || !qRecord) {
          console.error('Error inserting question:', qError);
          continue;
        }

        // Simpan opsi pertanyaan pilihan ganda
        const isChoiceType = ['radio', 'checkbox', 'dropdown', 'scale'].includes(q.question_type);
        if (isChoiceType && q.options && Array.isArray(q.options) && q.options.length > 0) {
          const optRows = q.options
            .filter((opt) => opt.option_label && opt.option_label.trim())
            .map((opt, oIdx) => ({
              question_id: qRecord.id,
              option_label: opt.option_label.trim(),
              option_value: opt.option_value || opt.option_label.trim(),
              order_index: typeof opt.order_index === 'number' ? opt.order_index : oIdx,
            }));

          if (optRows.length > 0) {
            const { error: optError } = await supabaseAdmin
              .from('tracer_question_options')
              .insert(optRows);

            if (optError) {
              console.error('Error inserting question options:', optError);
            }
          }
        }
      }
    }

    // Ambil full form yang baru dibuat
    const { data: fullForm } = await supabaseAdmin
      .from('tracer_forms')
      .select('*, questions:tracer_questions(*, options:tracer_question_options(*))')
      .eq('id', formRecord.id)
      .single();

    return NextResponse.json(
      {
        status: 'success',
        message: 'Formulir berhasil dibuat',
        data: fullForm || formRecord,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Admin tracer forms POST error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

