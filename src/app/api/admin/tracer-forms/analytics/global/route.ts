import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  EmploymentComparisonRow,
  SalaryComparisonRow,
  SummaryPerYearItem,
} from '@/types/tracer-study';

// GET /api/admin/tracer-forms/analytics/global
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const yearsParam = searchParams.get('years');
    const filterProdi = searchParams.get('prodi');

    let filterYears: string[] = [];
    if (yearsParam) {
      filterYears = yearsParam
        .split(',')
        .map((y) => y.trim())
        .filter(Boolean);
    }

    // 1. Ambil formulir
    let formsQuery = supabaseAdmin
      .from('tracer_forms')
      .select('*, questions:tracer_questions(*, options:tracer_question_options(*))')
      .order('target_graduation_year', { ascending: true });

    if (filterYears.length > 0) {
      formsQuery = formsQuery.in('target_graduation_year', filterYears);
    }

    const { data: forms, error: formsError } = await formsQuery;
    if (formsError) {
      console.error('Error fetching forms for global analytics:', formsError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal mengambil data formulir untuk analitik global.' },
        { status: 500 }
      );
    }

    // 2. Ambil seluruh respon
    let responsesQuery = supabaseAdmin
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
      `);

    if (filterProdi) {
      responsesQuery = responsesQuery.eq('prodi', filterProdi);
    }

    const { data: responses, error: respError } = await responsesQuery;
    if (respError) {
      console.error('Error fetching responses for global analytics:', respError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal mengambil data respon untuk analitik global.' },
        { status: 500 }
      );
    }

    const allForms = forms || [];
    const allResponses = responses || [];

    // 3. Tentukan daftar tahun angkatan yang tersedia
    const yearSet = new Set<string>();
    for (const f of allForms) {
      if (f.target_graduation_year && f.target_graduation_year !== 'Semua Angkatan') {
        yearSet.add(f.target_graduation_year);
      }
    }
    for (const r of allResponses) {
      if (r.graduation_year) {
        yearSet.add(r.graduation_year);
      }
    }

    let availableYears = Array.from(yearSet).sort();
    if (availableYears.length === 0) {
      availableYears = ['2021', '2022', '2023', '2024'];
    }

    // 4. Struktur data tabel perbandingan gaji
    const standardSalaryBrackets = [
      '< Rp 3.000.000',
      'Rp 3.000.000 - Rp 5.000.000',
      'Rp 5.000.000 - Rp 10.000.000',
      '> Rp 10.000.000',
    ];

    const salaryComparisonMap: Record<string, SalaryComparisonRow> = {};
    for (const bracket of standardSalaryBrackets) {
      const row: SalaryComparisonRow = { bracket };
      for (const y of availableYears) {
        row[y] = 0;
      }
      salaryComparisonMap[bracket] = row;
    }

    // 5. Struktur data tabel status kerja
    const standardEmploymentStatuses = [
      'Bekerja (Full Time)',
      'Bekerja (Part Time / Freelance)',
      'Wiraswasta / Enterpreneur',
      'Melanjutkan Studi',
      'Sedang Mencari Kerja',
    ];

    const employmentComparisonMap: Record<string, EmploymentComparisonRow> = {};
    for (const status of standardEmploymentStatuses) {
      const row: EmploymentComparisonRow = { status };
      for (const y of availableYears) {
        row[y] = 0;
      }
      employmentComparisonMap[status] = row;
    }

    // 6. Summary per angkatan
    const summaryPerYearMap: Record<string, SummaryPerYearItem> = {};
    for (const y of availableYears) {
      summaryPerYearMap[y] = {
        year: y,
        total_respondents: 0,
        employed_count: 0,
        unemployed_count: 0,
        employed_percentage: 0,
        top_salary_bracket: '-',
      };
    }

    // Map questions by form for fast access
    const formQuestionsMap = new Map<number, { salaryQ?: any; employmentQ?: any }>();
    for (const f of allForms) {
      const qs = f.questions || [];
      const salaryQ = qs.find(
        (q: any) =>
          q.metric_tag === 'salary' ||
          q.question_text.toLowerCase().includes('gaji') ||
          q.question_text.toLowerCase().includes('pendapatan')
      );
      const employmentQ = qs.find(
        (q: any) =>
          q.metric_tag === 'employment_status' ||
          q.question_text.toLowerCase().includes('status pekerjaan') ||
          q.question_text.toLowerCase().includes('kondisi saat ini')
      );
      formQuestionsMap.set(f.id, { salaryQ, employmentQ });
    }

    // 7. Agregasikan seluruh tanggapan
    for (const resp of allResponses) {
      const form = allForms.find((f) => f.id === resp.form_id);
      const formYear = form?.target_graduation_year;
      const year = formYear && formYear !== 'Semua Angkatan' ? formYear : resp.graduation_year || 'Lainnya';

      if (!summaryPerYearMap[year]) {
        summaryPerYearMap[year] = {
          year,
          total_respondents: 0,
          employed_count: 0,
          unemployed_count: 0,
          employed_percentage: 0,
          top_salary_bracket: '-',
        };
      }
      summaryPerYearMap[year].total_respondents++;

      const fQuestions = formQuestionsMap.get(resp.form_id);
      if (!fQuestions) continue;

      // Hitung Gaji
      if (fQuestions.salaryQ) {
        const ans = (resp.answers || []).find((a: any) => a.question_id === fQuestions.salaryQ.id);
        if (ans && ans.selected_options && ans.selected_options.length > 0) {
          const chosenLabel = ans.selected_options[0]?.option?.option_label || '';
          let matchedBracket = '< Rp 3.000.000';

          if (chosenLabel.includes('< 3') || chosenLabel.toLowerCase().includes('kurang')) {
            matchedBracket = '< Rp 3.000.000';
          } else if (chosenLabel.includes('3 - 5') || chosenLabel.includes('3.000.000 - 5')) {
            matchedBracket = 'Rp 3.000.000 - Rp 5.000.000';
          } else if (chosenLabel.includes('5 - 10') || chosenLabel.includes('5.000.000 - 10')) {
            matchedBracket = 'Rp 5.000.000 - Rp 10.000.000';
          } else if (chosenLabel.includes('> 10') || chosenLabel.toLowerCase().includes('lebih')) {
            matchedBracket = '> Rp 10.000.000';
          } else {
            // Check direct match
            const direct = standardSalaryBrackets.find((b) => chosenLabel.includes(b));
            if (direct) matchedBracket = direct;
          }

          if (salaryComparisonMap[matchedBracket] && year in salaryComparisonMap[matchedBracket]) {
            (salaryComparisonMap[matchedBracket][year] as number)++;
          }
        }
      }

      // Hitung Status Pekerjaan
      if (fQuestions.employmentQ) {
        const ans = (resp.answers || []).find((a: any) => a.question_id === fQuestions.employmentQ.id);
        if (ans && ans.selected_options && ans.selected_options.length > 0) {
          const chosenStatus = (ans.selected_options[0]?.option?.option_label || '').toLowerCase();
          let matchedStatus = 'Bekerja (Full Time)';

          if (chosenStatus.includes('part time') || chosenStatus.includes('freelance') || chosenStatus.includes('paruh')) {
            matchedStatus = 'Bekerja (Part Time / Freelance)';
            summaryPerYearMap[year].employed_count++;
          } else if (chosenStatus.includes('wira') || chosenStatus.includes('usaha') || chosenStatus.includes('bisnis')) {
            matchedStatus = 'Wiraswasta / Enterpreneur';
            summaryPerYearMap[year].employed_count++;
          } else if (chosenStatus.includes('studi') || chosenStatus.includes('kuliah') || chosenStatus.includes('s2')) {
            matchedStatus = 'Melanjutkan Studi';
          } else if (chosenStatus.includes('mencari') || chosenStatus.includes('belum') || chosenStatus.includes('tidak')) {
            matchedStatus = 'Sedang Mencari Kerja';
            summaryPerYearMap[year].unemployed_count++;
          } else {
            matchedStatus = 'Bekerja (Full Time)';
            summaryPerYearMap[year].employed_count++;
          }

          if (employmentComparisonMap[matchedStatus] && year in employmentComparisonMap[matchedStatus]) {
            (employmentComparisonMap[matchedStatus][year] as number)++;
          }
        }
      }
    }

    // 8. Finalisasi summary (persentase & top bracket)
    for (const y of Object.keys(summaryPerYearMap)) {
      const summary = summaryPerYearMap[y];
      if (summary.total_respondents > 0) {
        summary.employed_percentage = Number(
          ((summary.employed_count / summary.total_respondents) * 100).toFixed(1)
        );
      }

      let topBracket = '-';
      let topCount = 0;
      for (const [bracket, row] of Object.entries(salaryComparisonMap)) {
        const c = (row[y] as number) || 0;
        if (c > topCount) {
          topCount = c;
          topBracket = bracket;
        }
      }
      summary.top_salary_bracket = topBracket;
    }

    const totalRespondentsAll = Object.values(summaryPerYearMap).reduce(
      (acc, curr) => acc + curr.total_respondents,
      0
    );

    return NextResponse.json({
      status: 'success',
      data: {
        available_years: availableYears,
        salary_comparison: Object.values(salaryComparisonMap),
        employment_comparison: Object.values(employmentComparisonMap),
        summary_per_year: Object.values(summaryPerYearMap),
        total_respondents_all: totalRespondentsAll,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Admin global analytics GET error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

