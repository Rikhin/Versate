// Deep clean all CSVs in public/ and write cleaned versions to public/cleaned/
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import stringify from 'csv-stringify';

const PUBLIC_DIR = path.join(__dirname, '../public');
const CLEANED_DIR = path.join(PUBLIC_DIR, 'cleaned');

async function ensureCleanedDir() {
  try {
    await fs.mkdir(CLEANED_DIR);
  } catch {
    // Ignore if already exists
  }
}

async function cleanCsvFile(file) {
  const filePath = path.join(PUBLIC_DIR, file);
  const content = await fs.readFile(filePath, 'utf8');
  return new Promise((resolve) => {
    Papa.parse(content, { skip_empty_lines: true }, (err, records) => {
      if (err) {
        console.error(`Error parsing ${file}:`, err.message);
        return resolve();
      }
      if (records.data.length === 0) {
        console.log(`${file}: empty file`);
        return resolve();
      }
      const colCount = records.data[0].length;
      const cleaned = [records.data[0]]; // header
      let removed = 0;
      for (let i = 1; i < records.data.length; i++) {
        const row = records.data[i];
        if (row.length !== colCount || row.every(cell => !cell.trim())) {
          removed++;
          continue;
        }
        cleaned.push(row);
      }
      const outPath = path.join(CLEANED_DIR, file);
      stringify(cleaned, (err, output) => {
        if (err) {
          console.error(`Error stringifying ${file}:`, err.message);
          return resolve();
        }
        fs.writeFile(outPath, output).then(() => {
          if (removed > 0) {
            console.log(`${file}: removed ${removed} malformed/empty rows`);
          } else {
            console.log(`${file}: no issues found`);
          }
          resolve();
        }).catch(e => {
          console.error(`Error writing ${file}:`, e.message);
          resolve();
        });
      });
    });
  });
}

async function main() {
  await ensureCleanedDir();
  const files = (await fs.readdir(PUBLIC_DIR)).filter(f => f.endsWith('.csv'));
  for (const file of files) {
    await cleanCsvFile(file);
  }
  console.log('Deep clean complete. Cleaned files are in public/cleaned/.');
}

main(); 