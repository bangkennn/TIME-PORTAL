import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { formatDateToYMD } from '@/lib/tracer-utils';

// GET /api/admin/tracer-forms/[id]/responses
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

    // 1. Ambil data form
    const { data: form, error: formError } = await supabaseAdmin
      .from('tracer_forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      return NextResponse.json(
        { status: 'error', message: 'Formulir tidak ditemukan.' },
        { status: 404 }
      );
    }

    // 2. Ambil pertanyaan & opsi
    const { data: questions } = await supabaseAdmin
      .from('tracer_questions')
      .select('*, options:tracer_question_options(*)')
      .eq('form_id', formId)
      .order('order_index', { ascending: true });

    // 3. Ambil seluruh respon, jawaban, dan pilihan opsinya
    const { data: responses, error: respError } = await supabaseAdmin
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
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false });

    if (respError) {
      console.error('Error fetching responses:', respError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal mengambil data respon.' },
        { status: 500 }
      );
    }

    // Format pertanyaan dan urutkan opsi berdasarkan order_index
    const formattedQuestions = (questions || []).map((q) => {
      const sortedOptions = (q.options || []).sort(
        (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
      );
      return {
        ...q,
        options: sortedOptions,
      };
    });

    // Pastikan setiap respon memiliki status default 'pending' dan answers_map untuk memudahkan rendering kuesioner
    const allResponses = (responses || []).map((resp) => {
      const answersMap: Record<
        number,
        { text?: string | null; option_ids?: number[]; selected_labels?: string[] }
      > = {};

      for (const ans of resp.answers || []) {
        const optionIds = (ans.selected_options || []).map((so: any) => so.option_id);
        const selectedLabels = (ans.selected_options || []).map(
          (so: any) => so.option?.option_label || ''
        );
        answersMap[ans.question_id] = {
          text: ans.answer_text,
          option_ids: optionIds,
          selected_labels: selectedLabels,
        };
      }

      return {
        ...resp,
        status: resp.status || 'pending',
        answers_map: answersMap,
      };
    });

    const allQuestions = formattedQuestions;

    // Hitung ringkasan status approval
    const totalPending = allResponses.filter((r) => r.status === 'pending').length;
    const totalApproved = allResponses.filter((r) => r.status === 'approved').length;
    const totalRejected = allResponses.filter((r) => r.status === 'rejected').length;

    // 4. Hitung analitik agregasi pilihan per pertanyaan
    const analytics = [];
    for (const question of allQuestions) {
      if (['radio', 'checkbox', 'dropdown', 'scale'].includes(question.question_type)) {
        const optionCounts: Record<number, { label: string; count: number }> = {};
        for (const opt of question.options || []) {
          optionCounts[opt.id] = {
            label: opt.option_label,
            count: 0,
          };
        }

        for (const resp of allResponses) {
          const ans = (resp.answers || []).find(
            (a: { question_id: number }) => a.question_id === question.id
          );
          if (ans && ans.selected_options) {
            for (const selOpt of ans.selected_options) {
              if (optionCounts[selOpt.option_id]) {
                optionCounts[selOpt.option_id].count++;
              }
            }
          }
        }

        analytics.push({
          question_id: question.id,
          question_text: question.question_text,
          question_type: question.question_type,
          metric_tag: question.metric_tag,
          breakdown: Object.values(optionCounts),
        });
      }
    }

    return NextResponse.json({
      status: 'success',
      data: {
        form: {
          id: form.id,
          title: form.title,
          description: form.description,
          target_graduation_year: form.target_graduation_year,
          start_date: formatDateToYMD(form.start_date),
          end_date: formatDateToYMD(form.end_date),
          visibility: form.visibility,
          total_responses: allResponses.length,
          total_pending: totalPending,
          total_approved: totalApproved,
          total_rejected: totalRejected,
          questions: formattedQuestions,
        },
        responses: allResponses,
        analytics,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Admin tracer responses GET error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

