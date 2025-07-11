import fs from 'fs';
import path from 'path';
import { parse as csvParse } from 'csv-parse/sync';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const outPath = path.join(__dirname, '../lib/competitions-csv.json');
const csvPath = path.join(__dirname, '../public/webset-competitions_academic_extracurricular_high_school_students (1).csv');

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const records = csvParse(csvContent, { columns: true, skip_empty_lines: true });

const competitions = records.map((row: unknown, idx: number) => {
  if (typeof row !== 'object' || row === null) return null;
  const r = row as Record<string, unknown>;
  return {
    id: `csv-${idx + 1}`,
    name: typeof r['Title'] === 'string' ? r['Title'] : '',
    category: typeof r['competition is academic (e.g., stem, humanities) or extracurricular (e.g., arts, sports, debate, etc.) (Criterion)'] === 'string' && r['competition is academic (e.g., stem, humanities) or extracurricular (e.g., arts, sports, debate, etc.) (Criterion)'].includes('academic') ? 'STEM' : 'Other',
    status: 'active',
    description: typeof r['Description'] === 'string' ? r['Description'] : '',
    deadline: typeof r['Published Date'] === 'string' ? r['Published Date'] : '',
    prize: '',
    participants: 0,
    maxParticipants: 0,
    location: '',
    website: typeof r['URL'] === 'string' ? r['URL'] : '',
    requirements: [],
    tags: [],
    icon: '🏆',
    teamRequired: typeof r['Is a Team Competition (Result)'] === 'string' && r['Is a Team Competition (Result)'].toLowerCase() === 'yes',
  };
}).filter(Boolean);

fs.writeFileSync(outPath, JSON.stringify(competitions, null, 2));
console.log(`Wrote ${competitions.length} competitions to ${outPath}`);
