import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

export type BloomStatus = "draft" | "approved" | "sent";

export type BloomLog = {
  id: number;
  created_at: string;
  content: string;
  status: BloomStatus;
  mode?: string | null;
  intensity?: string | null;
};

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "bloom.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS bloom_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL
  );
`);

// Lightweight migration for mode/intensity (won't crash if already exists)
try {
  db.exec(`ALTER TABLE bloom_logs ADD COLUMN mode TEXT;`);
} catch {}
try {
  db.exec(`ALTER TABLE bloom_logs ADD COLUMN intensity TEXT;`);
} catch {}

// --- Existing API used by your routes ---
export const logBloom = (content: string, status: BloomStatus) => {
  const stmt = db.prepare(
    "INSERT INTO bloom_logs (created_at, content, status) VALUES (?, ?, ?)"
  );
  const createdAt = new Date().toISOString();
  const info = stmt.run(createdAt, content, status);
  return { id: info.lastInsertRowid as number, created_at: createdAt };
};

export const updateBloomStatus = (id: number, status: BloomStatus) => {
  const stmt = db.prepare("UPDATE bloom_logs SET status = ? WHERE id = ?");
  stmt.run(status, id);
};

export const getRecentBlooms = (limit = 10): BloomLog[] => {
  const stmt = db.prepare(
    "SELECT id, created_at, content, status, mode, intensity FROM bloom_logs ORDER BY id DESC LIMIT ?"
  );
  return stmt.all(limit) as BloomLog[];
};

// --- Functions expected by lib/admin.ts ---
export function createBloom(input: {
  mode?: string;
  intensity?: string;
  content: string;
  status: BloomStatus;
}) {
  const createdAt = new Date().toISOString();
  const stmt = db.prepare(
    "INSERT INTO bloom_logs (created_at, content, status, mode, intensity) VALUES (?, ?, ?, ?, ?)"
  );
  const info = stmt.run(
    createdAt,
    input.content,
    input.status,
    input.mode ?? null,
    input.intensity ?? null
  );
  return Number(info.lastInsertRowid);
}

export function updateBloom(
  id: number,
  patch: { content?: string; status?: BloomStatus; mode?: string; intensity?: string }
) {
  const fields: string[] = [];
  const values: any[] = [];

  if (typeof patch.content === "string") {
    fields.push("content = ?");
    values.push(patch.content);
  }
  if (typeof patch.status === "string") {
    fields.push("status = ?");
    values.push(patch.status);
  }
  if (typeof patch.mode === "string") {
    fields.push("mode = ?");
    values.push(patch.mode);
  }
  if (typeof patch.intensity === "string") {
    fields.push("intensity = ?");
    values.push(patch.intensity);
  }

  if (fields.length === 0) return;

  values.push(id);
  const stmt = db.prepare(`UPDATE bloom_logs SET ${fields.join(", ")} WHERE id = ?`);
  stmt.run(...values);
}

export function listBlooms(limit = 10): BloomLog[] {
  return getRecentBlooms(limit);
}
