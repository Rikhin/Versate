import fs from 'fs';
import path from 'path';
import { parse as csvParse } from 'csv-parse/sync';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const outPath = path.join(__dirname, '../lib/competitions-csv.json');
const csvPath = path.join(__dirname, '../public/webset-competitions_academic_extracurricular_high_school_students (1).csv');

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const records = csvParse(csvContent, { columns: true, skip_empty_lines: true });

const competitions = records.map((row: any, idx: number) => ({
  id: `csv-${idx + 1}`,
  name: row['Title'] || '',
  category: row['competition is academic (e.g., stem, humanities) or extracurricular (e.g., arts, sports, debate, etc.) (Criterion)']?.includes('academic') ? 'STEM' : 'Other',
  status: 'active',
  description: row['Description'] || '',
  deadline: row['Published Date'] || '',
  prize: '',
  participants: 0,
  maxParticipants: 0,
  location: '',
  website: row['URL'] || '',
  requirements: [],
  tags: [],
  icon: '🏆',
  teamRequired: row['Is a Team Competition (Result)']?.toLowerCase() === 'yes',
}));

fs.writeFileSync(outPath, JSON.stringify(competitions, null, 2));
console.log(`Wrote ${competitions.length} competitions to ${outPath}`);
