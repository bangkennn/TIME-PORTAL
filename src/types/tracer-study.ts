export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'radio'
  | 'checkbox'
  | 'dropdown'
  | 'scale'
  | 'date';

export type FormVisibility = 'draft' | 'published' | 'closed';

export type ResponseApprovalStatus = 'pending' | 'approved' | 'rejected';

export type MetricTag =
  | 'salary'
  | 'employment_status'
  | 'waiting_time'
  | 'study_relevance'
  | 'none';

export interface TracerOption {
  id?: number;
  question_id?: number;
  option_label: string;
  option_value?: string;
  order_index?: number;
}

export interface TracerQuestion {
  id?: number;
  form_id?: number;
  question_text: string;
  help_text?: string | null;
  question_type: QuestionType;
  metric_tag?: MetricTag | string | null;
  is_required: boolean;
  order_index: number;
  options?: TracerOption[];
}

export interface TracerForm {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  target_graduation_year?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  visibility: FormVisibility;
  created_by: string;
  created_at: string;
  updated_at: string;
  questions?: TracerQuestion[];
  questions_count?: number;
  responses_count?: number;
}

export interface CreateFormPayload {
  title: string;
  description?: string | null;
  target_graduation_year?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  visibility?: FormVisibility;
  questions: {
    question_text: string;
    help_text?: string | null;
    question_type: QuestionType;
    metric_tag?: MetricTag | string | null;
    is_required: boolean;
    order_index: number;
    options?: {
      option_label: string;
      option_value?: string;
      order_index: number;
    }[];
  }[];
}

export interface SubmitAnswerPayload {
  question_id: number;
  answer_text?: string;
  option_ids?: number[];
}

export interface SubmitResponsePayload {
  form_id: number;
  nim: string;
  respondent_name: string;
  respondent_email?: string;
  prodi?: string;
  graduation_year?: string;
  answers: SubmitAnswerPayload[];
}

export interface TracerAnswerOption {
  id: number;
  answer_id: number;
  option_id: number;
  option?: TracerOption;
}

export interface TracerAnswer {
  id: number;
  response_id: number;
  question_id: number;
  answer_text?: string | null;
  selected_options?: TracerOption[];
  question?: TracerQuestion;
}

export interface TracerResponse {
  id: number;
  form_id: number;
  nim: string;
  respondent_name: string;
  respondent_email?: string | null;
  prodi?: string | null;
  graduation_year?: string | null;
  ip_address?: string | null;
  status?: ResponseApprovalStatus;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_notes?: string | null;
  submitted_at: string;
  created_at: string;
  answers?: TracerAnswer[];
  answers_map?: Record<
    number,
    { text?: string | null; option_ids?: number[]; selected_labels?: string[] }
  >;
}

export interface QuestionBreakdownOption {
  label: string;
  count: number;
  percentage?: number;
}

export interface QuestionAnalyticsItem {
  question_id: number;
  question_text: string;
  question_type: QuestionType;
  metric_tag?: string | null;
  answered_count?: number;
  breakdown: QuestionBreakdownOption[];
}

export interface SingleFormAnalytics {
  form: {
    id: number;
    title: string;
    target_graduation_year?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    visibility: FormVisibility;
    total_responses: number;
  };
  prodi_breakdown: {
    label: string;
    count: number;
    percentage: number;
  }[];
  metric_breakdowns: {
    salary?: QuestionAnalyticsItem | null;
    employment_status?: QuestionAnalyticsItem | null;
    waiting_time?: QuestionAnalyticsItem | null;
    study_relevance?: QuestionAnalyticsItem | null;
  };
  questions_analysis: QuestionAnalyticsItem[];
}

export interface SalaryComparisonRow {
  bracket: string;
  [year: string]: string | number;
}

export interface EmploymentComparisonRow {
  status: string;
  [year: string]: string | number;
}

export interface SummaryPerYearItem {
  year: string;
  total_respondents: number;
  employed_count: number;
  unemployed_count: number;
  employed_percentage: number;
  top_salary_bracket: string;
}

export interface GlobalAnalyticsData {
  available_years: string[];
  salary_comparison: SalaryComparisonRow[];
  employment_comparison: EmploymentComparisonRow[];
  summary_per_year: SummaryPerYearItem[];
  total_respondents_all: number;
}