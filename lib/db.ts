export type BloomLog = {
  id: number;
  createdAt: string;
  mode: string;
  intensity: string;
  content: string;
  status: "draft" | "approved" | "sent";
};

// Local JSON storage for drafts + approvals (avoids native deps).
const dbPath = process.env.DB_PATH || "data/bloombiatch.json";

type BloomStore = {
  lastId: number;
  blooms: BloomLog[];
};

const defaultStore: BloomStore = { lastId: 0, blooms: [] };

function readStore(): BloomStore {
  try {
    const raw = require("fs").readFileSync(dbPath, "utf-8");
    return JSON.parse(raw) as BloomStore;
  } catch {
    return { ...defaultStore };
  }
}

function writeStore(store: BloomStore) {
  const fs = require("fs");
  fs.mkdirSync(require("path").dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(store, null, 2));
}

export function createBloom(data: Omit<BloomLog, "id" | "createdAt">) {
  const store = readStore();
  const nextId = store.lastId + 1;
  const bloom: BloomLog = {
    id: nextId,
    createdAt: new Date().toISOString(),
    ...data,
  };
  store.lastId = nextId;
  store.blooms.unshift(bloom);
  writeStore(store);
  return nextId;
}

export function updateBloom(id: number, updates: Partial<Omit<BloomLog, "id" | "createdAt">>) {
  const store = readStore();
  const index = store.blooms.findIndex((bloom) => bloom.id === id);
  if (index === -1) return;
  store.blooms[index] = { ...store.blooms[index], ...updates };
  writeStore(store);
}

export function listBlooms(limit = 10): BloomLog[] {
  const store = readStore();
  return store.blooms.slice(0, limit);
}

export function getLatestBloom(status: BloomLog["status"] = "sent") {
  const store = readStore();
  return store.blooms.find((bloom) => bloom.status === status);
}
