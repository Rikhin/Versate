import { Index } from "@upstash/vector";
import { parse } from "csv-parse";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const index = Index.fromEnv();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Determine CSV path: use argument or default to first file in public/cleaned/
let csvPath = process.argv[2];
if (!csvPath) {
  const CLEANED_DIR = path.join(__dirname, "../public/cleaned");
  const files = fs.readdirSync(CLEANED_DIR).filter(f => f.endsWith(".csv"));
  if (files.length === 0) {
    console.error("No CSV files found in public/cleaned/");
    process.exit(1);
  }
  csvPath = path.join(CLEANED_DIR, files[0]);
  console.log(`No CSV path provided. Using: ${csvPath}`);
}

const BATCH_SIZE = 10; // OpenAI recommends batching for efficiency

function getRowsFromCSV(path) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(path)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

async function getEmbeddings(texts) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small", // or "text-embedding-ada-002"
      input: texts,
    }),
  });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  return data.data.map((d) => d.embedding);
}

(async () => {
  const rows = await getRowsFromCSV(csvPath);
  console.log(`Loaded ${rows.length} rows from CSV.`);

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const texts = batch.map((row) => row.Description || row.Title || JSON.stringify(row));
    let embeddings;
    try {
      embeddings = await getEmbeddings(texts);
    } catch (e) {
      console.error("Embedding error:", e);
      continue;
    }
    for (let j = 0; j < batch.length; j++) {
      const row = batch[j];
      const id = row.URL || row.Title || `row-${i + j}`;
      const metadata = { ...row };
      try {
        await index.upsert({
          id,
          vector: embeddings[j],
          metadata,
        });
        console.log(`Upserted: ${id}`);
      } catch (e) {
        console.error(`Upstash upsert error for ${id}:`, e);
      }
    }
  }
  console.log("Done uploading vectors.");
})(); 