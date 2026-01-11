import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

export type BloomStatus = "draft" | "approved" | "sent";

export type BloomLog = {
  id: number;
  created_at: string;
  content: string;
  status: BloomStatus;
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
    "SELECT id, created_at, content, status FROM bloom_logs ORDER BY id DESC LIMIT ?"
  );
  return stmt.all(limit) as BloomLog[];
};
