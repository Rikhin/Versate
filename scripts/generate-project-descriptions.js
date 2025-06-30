const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const { data, error } = await supabase.from('projects').select('id, title');
  if (error) {
    console.error(error);
    process.exit(1);
  }
  for (const project of data) {
    const desc = `Project: ${project.title}. This project explores innovative solutions in its field.`;
    await supabase.from('projects').update({ description: desc }).eq('id', project.id);
    console.log(`Updated: ${project.title}`);
  }
  console.log('Descriptions updated!');
  process.exit(0);
})(); 