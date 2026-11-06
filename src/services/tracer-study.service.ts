import { api } from '@/lib/axios';
import {
  CreateFormPayload,
  FormVisibility,
  GlobalAnalyticsData,
  ResponseApprovalStatus,
  SingleFormAnalytics,
  SubmitResponsePayload,
  TracerForm,
  TracerResponse,
} from '@/types/tracer-study';

export const tracerStudyService = {
  // ================= Public Endpoints (Mahasiswa / Alumni) =================
  async getActiveForm(
    params?: { year?: string; nim?: string } | string,
    nimParam?: string
  ): Promise<{
    status: string;
    data: TracerForm | null;
    message?: string;
    schedule_status?: 'open' | 'upcoming' | 'expired';
    schedule_message?: string;
    already_submitted?: boolean;
    submitted_at?: string;
    response_status?: ResponseApprovalStatus | null;
    review_notes?: string | null;
  }> {
    let year: string | undefined;
    let nim: string | undefined;

    if (typeof params === 'string') {
      year = params;
      nim = nimParam;
    } else if (params) {
      year = params.year;
      nim = params.nim || nimParam;
    }

    const queryParams: Record<string, string> = {};
    if (year) queryParams.year = year;
    if (nim) queryParams.nim = nim;

    const res = await api.get('/tracer-study/active', {
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    });
    return res.data;
  },

  async submitResponse(
    payload: SubmitResponsePayload
  ): Promise<{ status: string; message: string; data: TracerResponse }> {
    const res = await api.post('/tracer-study/submit', payload);
    return res.data;
  },

  // ================= Admin Endpoints (Form Builder & Responses) =================
  async getAdminForms(): Promise<{ status: string; data: TracerForm[] }> {
    const res = await api.get('/admin/tracer-forms');
    return res.data;
  },

  async getAdminFormDetail(id: number | string): Promise<{ status: string; data: TracerForm }> {
    const res = await api.get(`/admin/tracer-forms/${id}`);
    return res.data;
  },

  async createAdminForm(
    payload: CreateFormPayload
  ): Promise<{ status: string; message: string; data: TracerForm }> {
    const res = await api.post('/admin/tracer-forms', payload);
    return res.data;
  },

  async updateAdminForm(
    id: number | string,
    payload: CreateFormPayload
  ): Promise<{ status: string; message: string; data: TracerForm }> {
    const res = await api.put(`/admin/tracer-forms/${id}`, payload);
    return res.data;
  },

  async updateFormVisibility(
    id: number | string,
    visibility: FormVisibility
  ): Promise<{ status: string; message: string; data: TracerForm }> {
    const res = await api.patch(`/admin/tracer-forms/${id}/visibility`, { visibility });
    return res.data;
  },

  async deleteAdminForm(id: number | string): Promise<{ status: string; message: string }> {
    const res = await api.delete(`/admin/tracer-forms/${id}`);
    return res.data;
  },

  async getFormResponses(
    id: number | string
  ): Promise<{
    status: string;
    data: {
      form: TracerForm & {
        total_responses?: number;
        total_pending?: number;
        total_approved?: number;
        total_rejected?: number;
      };
      responses: TracerResponse[];
    };
  }> {
    const res = await api.get(`/admin/tracer-forms/${id}/responses`);
    return res.data;
  },

  async updateResponseApprovalStatus(
    responseId: number | string,
    payload: {
      status: ResponseApprovalStatus;
      review_notes?: string;
      reviewed_by?: string;
    }
  ): Promise<{ status: string; message: string; data: TracerResponse }> {
    const res = await api.patch(`/admin/tracer-responses/${responseId}`, payload);
    return res.data;
  },

  async exportFormResponsesToExcel(
    formId: number | string,
    status: 'approved' | 'all' = 'approved'
  ): Promise<Blob> {
    const res = await api.get(`/admin/tracer-forms/${formId}/export`, {
      params: { status },
      responseType: 'blob',
    });
    return res.data;
  },

  // ================= Analytics Endpoints =================
  async getSingleFormAnalytics(
    id: number | string
  ): Promise<{ status: string; data: SingleFormAnalytics }> {
    const res = await api.get(`/admin/tracer-forms/${id}/analytics`);
    return res.data;
  },

  async getGlobalAnalytics(params?: {
    years?: string[];
    prodi?: string;
  }): Promise<{ status: string; data: GlobalAnalyticsData }> {
    const queryParams: Record<string, string> = {};
    if (params?.years && params.years.length > 0) {
      queryParams.years = params.years.join(',');
    }
    if (params?.prodi) {
      queryParams.prodi = params.prodi;
    }
    const res = await api.get('/admin/tracer-forms/analytics/global', {
      params: queryParams,
    });
    return res.data;
  },
};