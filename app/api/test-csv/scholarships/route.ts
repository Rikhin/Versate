import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';

export const dynamic = 'force-dynamic';

interface ScholarshipRow {
  title?: string;
  Title?: string;
  degrees?: string;
  funds?: string;
  location?: string;
}

export async function GET() {
  const csvPath = path.join(process.cwd(), 'public', 'Universities_Schoolarships_All_Around_the_World.csv');
  const csvText = await fs.readFile(csvPath, 'utf8');
  const { data } = Papa.parse<ScholarshipRow>(csvText, { header: true, skipEmptyLines: true });
  const scholarships = (data as ScholarshipRow[]).map(row => ({
    title: row['title'] || row['Title'] || '',
    degrees: row['degrees'] || '',
    funds: row['funds'] || '',
    location: row['location'] || '',
  }));
  return new Response(JSON.stringify(scholarships), {
    headers: { 'Content-Type': 'application/json' },
  });
} 