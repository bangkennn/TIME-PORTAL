import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { CreateFormPayload } from '@/types/tracer-study';

// GET /api/admin/tracer-forms/[id]
export async function GET(
  _req: NextRequest,
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

    const { data: form, error: formError } = await supabaseAdmin
      .from('tracer_forms')
      .select('*, questions:tracer_questions(*, options:tracer_question_options(*)), responses:tracer_responses(count)')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      return NextResponse.json(
        { status: 'error', message: 'Formulir tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Urutkan questions & options berdasarkan order_index
    const sortedQuestions = (form.questions || [])
      .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
      .map((q: { options?: { order_index: number }[] }) => ({
        ...q,
        options: (q.options || []).sort(
          (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
        ),
      }));

    const responseCount =
      Array.isArray(form.responses) && form.responses.length > 0 ? form.responses[0].count : 0;

    return NextResponse.json({
      status: 'success',
      data: {
        ...form,
        questions: sortedQuestions,
        responses_count: responseCount,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Admin tracer form GET detail error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/tracer-forms/[id]
export async function PUT(
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

    const body = (await req.json()) as CreateFormPayload;

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { status: 'error', message: 'Judul formulir kuesioner wajib diisi.' },
        { status: 400 }
      );
    }

    // 1. Perbarui data induk form
    const updatePayload: Record<string, unknown> = {
      title: body.title.trim(),
      description: body.description || null,
      target_graduation_year: body.target_graduation_year || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      updated_at: new Date().toISOString(),
    };

    if (body.visibility) {
      updatePayload.visibility = body.visibility;
    }

    const { data: updatedForm, error: updateError } = await supabaseAdmin
      .from('tracer_forms')
      .update(updatePayload)
      .eq('id', formId)
      .select()
      .single();

    if (updateError || !updatedForm) {
      console.error('Error updating tracer form:', updateError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal memperbarui data formulir.' },
        { status: 500 }
      );
    }

    // 2. Jika payload questions disertakan, ganti susunan pertanyaan
    if (body.questions && Array.isArray(body.questions)) {
      // Hapus pertanyaan lama (CASCADE di PostgreSQL akan menghapus options)
      await supabaseAdmin.from('tracer_questions').delete().eq('form_id', formId);

      for (let qIdx = 0; qIdx < body.questions.length; qIdx++) {
        const q = body.questions[qIdx];
        if (!q.question_text || !q.question_text.trim()) continue;

        const { data: qRecord, error: qError } = await supabaseAdmin
          .from('tracer_questions')
          .insert({
            form_id: formId,
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
          console.error('Error re-inserting question:', qError);
          continue;
        }

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
            await supabaseAdmin.from('tracer_question_options').insert(optRows);
          }
        }
      }
    }

    // Ambil full form yang telah diperbarui
    const { data: fullForm } = await supabaseAdmin
      .from('tracer_forms')
      .select('*, questions:tracer_questions(*, options:tracer_question_options(*)), responses:tracer_responses(count)')
      .eq('id', formId)
      .single();

    return NextResponse.json({
      status: 'success',
      message: 'Formulir berhasil diperbarui',
      data: fullForm || updatedForm,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Admin tracer form PUT error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tracer-forms/[id]
export async function DELETE(
  _req: NextRequest,
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

    const { error: deleteError } = await supabaseAdmin
      .from('tracer_forms')
      .delete()
      .eq('id', formId);

    if (deleteError) {
      console.error('Error deleting form:', deleteError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal menghapus formulir.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Formulir berhasil dihapus',
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Admin tracer form DELETE error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

