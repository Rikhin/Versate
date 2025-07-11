import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';

export const dynamic = 'force-dynamic';

interface SummerProgramRow {
  URL?: string;
  Title?: string;
  'Name of Summer Program (Result)'?: string;
  Description?: string;
  'Description of summer program (Result)'?: string;
  'Cost (Result)'?: string;
  'Acceptance Rate (Result)'?: string;
  'Application Deadline (Result)'?: string;
  'Program Sessions, Dates (Result)'?: string;
  'Is targeted toward low-income/first-gen (Result)'?: string;
  'program is located in the united states (Criterion)'?: string;
  'program is competitive, demonstrated by selective admissions or application process (Criterion)'?: string;
  'url is the official page for the specific program (Criterion)'?: string;
}

export async function GET() {
  const csvPath = path.join(process.cwd(), 'public', 'webset-summer_programs_competitive_high_school_u_s.csv');
  const csvText = await fs.readFile(csvPath, 'utf8');
  const { data } = Papa.parse<SummerProgramRow>(csvText, { header: true, skipEmptyLines: true });
  const programs = (data as SummerProgramRow[]).map(row => ({
    url: row['URL'] || '',
    title: row['Title'] || row['Name of Summer Program (Result)'] || '',
    description: row['Description'] || row['Description of summer program (Result)'] || '',
    cost: row['Cost (Result)'] || '',
    acceptanceRate: row['Acceptance Rate (Result)'] || '',
    applicationDeadline: row['Application Deadline (Result)'] || '',
    sessions: row['Program Sessions, Dates (Result)'] || '',
    targeted: row['Is targeted toward low-income/first-gen (Result)'] || '',
    location: row['program is located in the united states (Criterion)'] || '',
    competitive: row['program is competitive, demonstrated by selective admissions or application process (Criterion)'] || '',
    officialUrl: row['url is the official page for the specific program (Criterion)'] || row['URL'] || '',
    name: row['Name of Summer Program (Result)'] || row['Title'] || '',
  }));
  return new Response(JSON.stringify(programs), {
    headers: { 'Content-Type': 'application/json' },
  });
} 