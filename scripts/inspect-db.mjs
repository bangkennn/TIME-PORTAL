import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tbnnwgwnancfwgxbcfhx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibm53Z3duYW5jZndneGJjZmh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mzg2MDE3NCwiZXhwIjoyMTA5NDM2MTc0fQ.5vbG6jsYP6VGbTUYsZAEEK-_UAYRJbxMGn-sDqrMbEo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const { data: forms, error: formError } = await supabase
    .from('tracer_forms')
    .select('id, title, visibility, target_graduation_year')
    .order('id', { ascending: false });

  if (formError) {
    console.error('Error fetching forms:', formError);
    return;
  }
  console.log('Forms:', forms);

  const activeForm = forms.find(f => f.visibility === 'published') || forms[0];
  if (!activeForm) {
    console.log('No form found');
    return;
  }
  console.log('Selected Form:', activeForm);

  const { data: questions, error: qError } = await supabase
    .from('tracer_questions')
    .select('id, question_text, question_type, order_index, tracer_question_options(id, option_label, option_value, order_index)')
    .eq('form_id', activeForm.id)
    .order('order_index', { ascending: true });

  if (qError) {
    console.error('Error questions:', qError);
    return;
  }

  console.log(`Loaded ${questions.length} questions for form ${activeForm.id}`);
  for (const q of questions) {
    const opts = q.tracer_question_options || [];
    console.log(`[ID:${q.id}] [Idx:${q.order_index}] [Type:${q.question_type}] ${q.question_text.substring(0, 80)}`);
    if (opts.length > 0) {
      console.log(`   Options (${opts.length}): ${opts.map(o => `[${o.id}] "${o.option_label}"`).join(' | ')}`);
    }
  }

  const { data: responses, error: rError } = await supabase
    .from('tracer_responses')
    .select('*')
    .eq('form_id', activeForm.id);
  console.log('Existing responses count:', responses?.length);
}

main();
