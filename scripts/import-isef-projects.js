const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const projects = JSON.parse(fs.readFileSync('isef-projects.json', 'utf8'));

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin inserts
);

async function importProjects() {
  for (const project of projects) {
    const { error } = await supabase.from('projects').insert([project]);
    if (error) {
      console.error('Error inserting:', project.title, error);
    } else {
      console.log('Inserted:', project.title);
    }
  }
  console.log('Import complete!');
}

importProjects(); 