import Database from "better-sqlite3";

export type BloomLog = {
  id: number;
  createdAt: string;
  mode: string;
  intensity: string;
  content: string;
  status: "draft" | "approved" | "sent";
};

// Local SQLite storage for drafts + approvals.
const dbPath = process.env.DB_PATH || "data/bloombiatch.db";
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS blooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    mode TEXT NOT NULL,
    intensity TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL
  )
`);

export function createBloom(data: Omit<BloomLog, "id" | "createdAt">) {
  const stmt = db.prepare(
    "INSERT INTO blooms (created_at, mode, intensity, content, status) VALUES (@createdAt, @mode, @intensity, @content, @status)"
  );
  const result = stmt.run({
    createdAt: new Date().toISOString(),
    ...data,
  });
  return Number(result.lastInsertRowid);
}

export function updateBloom(id: number, updates: Partial<Omit<BloomLog, "id" | "createdAt">>) {
  const fields = Object.keys(updates);
  if (fields.length === 0) return;

  const assignments = fields.map((field) => `${field} = @${field}`).join(", ");
  const stmt = db.prepare(`UPDATE blooms SET ${assignments} WHERE id = @id`);
  stmt.run({ id, ...updates });
}

export function listBlooms(limit = 10): BloomLog[] {
  const stmt = db.prepare(
    "SELECT id, created_at as createdAt, mode, intensity, content, status FROM blooms ORDER BY id DESC LIMIT ?"
  );
  return stmt.all(limit) as BloomLog[];
}

export function getLatestBloom(status: BloomLog["status"] = "sent") {
  const stmt = db.prepare(
    "SELECT id, created_at as createdAt, mode, intensity, content, status FROM blooms WHERE status = ? ORDER BY id DESC LIMIT 1"
  );
  return stmt.get(status) as BloomLog | undefined;
}
