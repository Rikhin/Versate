import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import dotenv from "dotenv";
dotenv.config();
console.log("UPSTASH_VECTOR_REST_URL:", process.env.UPSTASH_VECTOR_REST_URL); // Debug print

const CLEANED_DIR = path.join(__dirname, "../public/cleaned");

const files = fs.readdirSync(CLEANED_DIR).filter((f) => f.endsWith(".csv"));

let idx = 0;
function next() {
  if (idx >= files.length) return;
  const file = files[idx++];
  const proc = spawn("node", [path.join(__dirname, "upload_vectors_from_csv.js"), path.join(CLEANED_DIR, file)], {
    stdio: "inherit",
    env: process.env,
  });
  proc.on("exit", next);
}
next(); 