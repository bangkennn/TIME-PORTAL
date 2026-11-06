-- ========================================================
-- MIGRATION: Penambahan Fitur Approval Responden Tracer Study
-- Tabel: tracer_responses
-- ========================================================

-- 1. Tambah kolom status approval ('pending', 'approved', 'rejected')
ALTER TABLE tracer_responses 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- 2. Tambah kolom audit verifikasi (siapa, kapan, dan catatan jika ada)
ALTER TABLE tracer_responses 
ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS review_notes TEXT NULL;

-- 3. Beri nilai default 'pending' untuk seluruh data respon yang sudah ada sebelumnya
UPDATE tracer_responses 
SET status = 'pending' 
WHERE status IS NULL;

-- 4. Tambah index performa query filter berdasarkan status respon
CREATE INDEX IF NOT EXISTS idx_tracer_responses_status ON tracer_responses(status);
CREATE INDEX IF NOT EXISTS idx_tracer_responses_form_status ON tracer_responses(form_id, status);

