import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { formatDateToYMD } from '@/lib/tracer-utils';
import { QuestionAnalyticsItem } from '@/types/tracer-study';

// GET /api/admin/tracer-forms/[id]/analytics
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
      .select('*')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      return NextResponse.json(
        { status: 'error', message: 'Formulir tidak ditemukan.' },
        { status: 404 }
      );
    }

    const { data: questions } = await supabaseAdmin
      .from('tracer_questions')
      .select('*, options:tracer_question_options(*)')
      .eq('form_id', formId)
      .order('order_index', { ascending: true });

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
      .eq('form_id', formId);

    if (respError) {
      console.error('Error fetching responses for analytics:', respError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal mengambil data respon.' },
        { status: 500 }
      );
    }

    const allResponses = responses || [];
    const allQuestions = questions || [];
    const totalResponses = allResponses.length;

    // 1. Breakdown Program Studi
    const prodiMap: Record<string, number> = {};
    for (const r of allResponses) {
      const p = r.prodi || 'Tidak Diketahui';
      prodiMap[p] = (prodiMap[p] || 0) + 1;
    }
    const prodiBreakdown = Object.entries(prodiMap).map(([label, count]) => ({
      label,
      count,
      percentage: totalResponses > 0 ? Number(((count / totalResponses) * 100).toFixed(1)) : 0,
    }));

    // 2. Analisis Pertanyaan & Metric Breakdowns
    const metricBreakdowns: Record<string, QuestionAnalyticsItem | null> = {
      salary: null,
      employment_status: null,
      waiting_time: null,
      study_relevance: null,
    };
    const questionsAnalysis: QuestionAnalyticsItem[] = [];

    for (const question of allQuestions) {
      if (['radio', 'checkbox', 'dropdown', 'scale'].includes(question.question_type)) {
        const optionsMap: Record<number, { label: string; count: number; percentage: number }> = {};
        for (const opt of question.options || []) {
          optionsMap[opt.id] = {
            label: opt.option_label,
            count: 0,
            percentage: 0,
          };
        }

        let answeredCount = 0;
        for (const resp of allResponses) {
          const ans = (resp.answers || []).find(
            (a: { question_id: number }) => a.question_id === question.id
          );
          if (ans && ans.selected_options && ans.selected_options.length > 0) {
            answeredCount++;
            for (const sel of ans.selected_options) {
              if (optionsMap[sel.option_id]) {
                optionsMap[sel.option_id].count++;
              }
            }
          }
        }

        const breakdownList = Object.values(optionsMap).map((opt) => ({
          ...opt,
          percentage:
            totalResponses > 0 ? Number(((opt.count / totalResponses) * 100).toFixed(1)) : 0,
        }));

        const qItem: QuestionAnalyticsItem = {
          question_id: question.id,
          question_text: question.question_text,
          question_type: question.question_type,
          metric_tag: question.metric_tag,
          answered_count: answeredCount,
          breakdown: breakdownList,
        };

        questionsAnalysis.push(qItem);

        if (
          question.metric_tag &&
          question.metric_tag in metricBreakdowns &&
          metricBreakdowns[question.metric_tag] === null
        ) {
          metricBreakdowns[question.metric_tag] = qItem;
        }
      }
    }

    return NextResponse.json({
      status: 'success',
      data: {
        form: {
          id: form.id,
          title: form.title,
          target_graduation_year: form.target_graduation_year,
          start_date: formatDateToYMD(form.start_date),
          end_date: formatDateToYMD(form.end_date),
          visibility: form.visibility,
          total_responses: totalResponses,
        },
        prodi_breakdown: prodiBreakdown,
        metric_breakdowns: metricBreakdowns,
        questions_analysis: questionsAnalysis,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Admin tracer single analytics error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

