import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ResponseApprovalStatus } from '@/types/tracer-study';

const VALID_STATUSES: ResponseApprovalStatus[] = ['pending', 'approved', 'rejected'];

// PATCH /api/admin/tracer-responses/[id]
// Memperbarui status persetujuan (approval) responden
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const responseId = parseInt(id, 10);

    if (isNaN(responseId)) {
      return NextResponse.json(
        { status: 'error', message: 'ID responden tidak valid.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, review_notes, reviewed_by } = body as {
      status?: ResponseApprovalStatus;
      review_notes?: string;
      reviewed_by?: string;
    };

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Status tidak valid. Pilihan yang diizinkan: ${VALID_STATUSES.join(', ')}.`,
        },
        { status: 400 }
      );
    }

    // Periksa keberadaan data responden
    const { data: existingResp, error: fetchErr } = await supabaseAdmin
      .from('tracer_responses')
      .select('id, form_id, nim, respondent_name')
      .eq('id', responseId)
      .single();

    if (fetchErr || !existingResp) {
      return NextResponse.json(
        { status: 'error', message: 'Data responden tidak ditemukan.' },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const updatePayload: Record<string, unknown> = {
      status,
      review_notes: review_notes?.trim() || null,
      reviewed_by: reviewed_by?.trim() || 'Admin',
      reviewed_at: status === 'pending' ? null : now,
      updated_at: now,
    };

    const { data: updatedRecord, error: updateErr } = await supabaseAdmin
      .from('tracer_responses')
      .update(updatePayload)
      .eq('id', responseId)
      .select()
      .single();

    if (updateErr) {
      console.error('Error updating tracer response approval status:', updateErr);
      const isMissingCol =
        (updateErr.message?.includes('column') && updateErr.message?.includes('does not exist')) ||
        updateErr.message?.includes('schema cache') ||
        updateErr.message?.includes('Could not find');

      return NextResponse.json(
        {
          status: 'error',
          message: isMissingCol
            ? 'Kolom approval (status / review_notes) belum aktif di Supabase. Silakan jalankan script database/migration_add_approval_to_tracer_responses.sql di Supabase SQL Editor.'
            : `Gagal memperbarui status responden: ${updateErr.message}`,
        },
        { status: 500 }
      );
    }

    const statusLabel =
      status === 'approved' ? 'Disetujui' : status === 'rejected' ? 'Ditolak' : 'Menunggu Review';

    return NextResponse.json({
      status: 'success',
      message: `Responden atas nama "${existingResp.respondent_name}" (NIM: ${existingResp.nim}) berhasil diubah menjadi: ${statusLabel}.`,
      data: updatedRecord,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Admin tracer response approval error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

