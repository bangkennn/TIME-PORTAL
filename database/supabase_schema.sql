-- ========================================================
-- DATABASE: portal_stmik_time (Supabase PostgreSQL)
-- MODUL: TRACER STUDY & FUTURE MODULES
-- ========================================================

-- 1. Tabel Formulir Tracer Study
CREATE TABLE IF NOT EXISTS tracer_forms (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_graduation_year VARCHAR(20),
    start_date DATE,
    end_date DATE,
    visibility VARCHAR(20) DEFAULT 'draft' CHECK (visibility IN ('draft', 'published', 'closed')),
    created_by VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Pertanyaan Kuesioner
CREATE TABLE IF NOT EXISTS tracer_questions (
    id BIGSERIAL PRIMARY KEY,
    form_id BIGINT NOT NULL REFERENCES tracer_forms(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    help_text TEXT,
    question_type VARCHAR(50) DEFAULT 'short_text' CHECK (question_type IN ('short_text', 'long_text', 'radio', 'checkbox', 'dropdown', 'scale', 'date')),
    metric_tag VARCHAR(50),
    is_required BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tracer_questions_form_order ON tracer_questions(form_id, order_index);

-- 3. Tabel Pilihan Jawaban (Options)
CREATE TABLE IF NOT EXISTS tracer_question_options (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES tracer_questions(id) ON DELETE CASCADE,
    option_label VARCHAR(255) NOT NULL,
    option_value VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tracer_question_options_q_order ON tracer_question_options(question_id, order_index);

-- 4. Tabel Tanggapan / Responden Kuesioner
CREATE TABLE IF NOT EXISTS tracer_responses (
    id BIGSERIAL PRIMARY KEY,
    form_id BIGINT NOT NULL REFERENCES tracer_forms(id) ON DELETE CASCADE,
    nim VARCHAR(50),
    respondent_name VARCHAR(255),
    respondent_email VARCHAR(255),
    prodi VARCHAR(100),
    graduation_year VARCHAR(10),
    ip_address VARCHAR(45),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tracer_responses_form_submitted ON tracer_responses(form_id, submitted_at);
CREATE INDEX IF NOT EXISTS idx_tracer_responses_nim ON tracer_responses(nim);
CREATE INDEX IF NOT EXISTS idx_tracer_responses_status ON tracer_responses(status);
CREATE INDEX IF NOT EXISTS idx_tracer_responses_form_status ON tracer_responses(form_id, status);

-- 5. Tabel Jawaban Responden
CREATE TABLE IF NOT EXISTS tracer_answers (
    id BIGSERIAL PRIMARY KEY,
    response_id BIGINT NOT NULL REFERENCES tracer_responses(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES tracer_questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tracer_answers_resp_question ON tracer_answers(response_id, question_id);

-- 6. Tabel Relasi Jawaban Pilihan Ganda (Selected Options)
CREATE TABLE IF NOT EXISTS tracer_answer_options (
    id BIGSERIAL PRIMARY KEY,
    answer_id BIGINT NOT NULL REFERENCES tracer_answers(id) ON DELETE CASCADE,
    option_id BIGINT NOT NULL REFERENCES tracer_question_options(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_answer_option UNIQUE (answer_id, option_id)
);

