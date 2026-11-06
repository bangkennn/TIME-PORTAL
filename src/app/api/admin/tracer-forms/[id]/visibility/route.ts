import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { FormVisibility } from '@/types/tracer-study';

// PATCH /api/admin/tracer-forms/[id]/visibility
export async function PATCH(
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

    const body = (await req.json()) as { visibility: FormVisibility };

    if (!['draft', 'published', 'closed'].includes(body.visibility)) {
      return NextResponse.json(
        { status: 'error', message: 'Status visibilitas harus berupa draft, published, atau closed.' },
        { status: 400 }
      );
    }

    const { data: updatedForm, error: updateError } = await supabaseAdmin
      .from('tracer_forms')
      .update({
        visibility: body.visibility,
        updated_at: new Date().toISOString(),
      })
      .eq('id', formId)
      .select()
      .single();

    if (updateError || !updatedForm) {
      console.error('Error updating visibility:', updateError);
      return NextResponse.json(
        { status: 'error', message: 'Gagal mengubah visibilitas formulir.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: `Status visibilitas formulir berhasil diubah menjadi ${body.visibility}`,
      data: updatedForm,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Admin tracer visibility PATCH error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

