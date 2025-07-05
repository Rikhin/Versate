const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CSV files to import
const csvFiles = [
  'webset-california.csv',
  'webset-washington.csv',
  'webset-arkansas.csv',
  'webset-ohio.csv',
  'webset-indiana.csv',
  'webset-linkedin_profiles_yc_partners.csv',
  'webset-linkedin_profiles_current_admissions_officers_t20_universities.csv',
  'webset-linkedin_profiles_researcher_or_pi_high_school_projects_alabama.csv',
  'webset-linkedin_profiles_researcher_or_pi_high_school_projects_alaska.csv',
  'webset-linkedin_profiles_researcher_or_pi_high_school_projects_arizona.csv',
  'webset-linkedin_profiles_researcher_or_pi_high_school_projects_colorado.csv',
  'webset-linkedin_profiles_researcher_or_pi_high_school_projects_connecticut.csv',
  'webset-linkedin_profiles_researcher_or_pi_high_school_projects_delaware.csv',
  'webset-linkedin_profiles_researcher_or_pi_high_school_projects_florida.csv',
  'webset-linkedin_profiles_researcher_or_pi_high_school_projects_georgia.csv',
  'webset-linkedin_profiles_researcher_or_pi_high_school_projects_hawaii.csv'
];

function getStateFromFilename(filename) {
  if (filename.includes("california")) return "California";
  if (filename.includes("washington")) return "Washington";
  if (filename.includes("arkansas")) return "Arkansas";
  if (filename.includes("ohio")) return "Ohio";
  if (filename.includes("indiana")) return "Indiana";
  if (filename.includes("alabama")) return "Alabama";
  if (filename.includes("alaska")) return "Alaska";
  if (filename.includes("arizona")) return "Arizona";
  if (filename.includes("colorado")) return "Colorado";
  if (filename.includes("connecticut")) return "Connecticut";
  if (filename.includes("delaware")) return "Delaware";
  if (filename.includes("florida")) return "Florida";
  if (filename.includes("georgia")) return "Georgia";
  if (filename.includes("hawaii")) return "Hawaii";
  if (filename.includes("yc_partners")) return "Y Combinator";
  if (filename.includes("admissions_officers")) return "Admissions Officer";
  return "Unknown";
}

async function importMentorsFromFile(filePath, sourceFile) {
  try {
    console.log(`\n📁 Processing ${sourceFile}...`);
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, errors } = Papa.parse(fileContent, { 
      header: true, 
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });
    
    if (errors.length > 0) {
      console.warn(`⚠️  CSV parsing errors in ${sourceFile}:`, errors);
    }
    
    const state = getStateFromFilename(sourceFile);
    const mentors = [];
    
    for (const row of data) {
      // Skip incomplete rows
      if (!row["Title"] || !row["URL"]) continue;
      
      let mentor = {
        name: row["Title"]?.trim() || "",
        linkedin: row["URL"]?.trim() || "",
        company: row["Company"]?.trim() || "",
        job_title: row["Job Title"]?.trim() || "",
        email: "",
        years_experience: "",
        state: state,
        source_file: sourceFile
      };
      
      // Handle different email column names
      if (row["Work Email (Result)"]) {
        mentor.email = row["Work Email (Result)"].trim();
      } else if (row["Email (Result)"]) {
        mentor.email = row["Email (Result)"].trim();
      }
      
      // Handle different years experience column names
      if (row["Years Experience (Result)"]) {
        mentor.years_experience = row["Years Experience (Result)"].trim();
      } else if (row["Years of Experience (Result)"]) {
        mentor.years_experience = row["Years of Experience (Result)"].trim();
      }
      
      mentors.push(mentor);
    }
    
    console.log(`📊 Found ${mentors.length} mentors in ${sourceFile}`);
    
    // Insert mentors in batches of 100
    const batchSize = 100;
    for (let i = 0; i < mentors.length; i += batchSize) {
      const batch = mentors.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('mentors')
        .insert(batch);
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1} from ${sourceFile}:`, error);
      } else {
        console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1} (${batch.length} mentors) from ${sourceFile}`);
      }
    }
    
    return mentors.length;
    
  } catch (error) {
    console.error(`❌ Error processing ${sourceFile}:`, error);
    return 0;
  }
}

async function main() {
  console.log('🚀 Starting mentor import process...');
  
  // Check if mentors table exists
  const { error: tableCheck } = await supabase
    .from('mentors')
    .select('id')
    .limit(1);
  
  if (tableCheck) {
    console.error('❌ Mentors table does not exist. Please run the create-mentors-table.sql script first.');
    process.exit(1);
  }
  
  let totalImported = 0;
  const publicDir = path.join(__dirname, '..', 'public');
  
  for (const csvFile of csvFiles) {
    const filePath = path.join(publicDir, csvFile);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${csvFile}`);
      continue;
    }
    
    const imported = await importMentorsFromFile(filePath, csvFile);
    totalImported += imported;
  }
  
  console.log(`\n🎉 Import complete! Total mentors imported: ${totalImported}`);
  
  // Get final stats
  const { count } = await supabase
    .from('mentors')
    .select('*', { count: 'exact', head: true });
  
  console.log(`📈 Total mentors in database: ${count}`);
}

// Run the import
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { importMentorsFromFile, main }; 