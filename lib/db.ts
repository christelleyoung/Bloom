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

type BloomStore = {
  nextId: number;
  blooms: BloomLog[];
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "bloombiatch.json");

const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const computeNextId = (blooms: BloomLog[]) =>
  blooms.reduce((max, bloom) => Math.max(max, bloom.id || 0), 0) + 1;

const readStore = (): BloomStore => {
  ensureDataDir();

  if (!fs.existsSync(dataFile)) {
    return { nextId: 1, blooms: [] };
  }

  try {
    const raw = fs.readFileSync(dataFile, "utf8");
    const parsed = JSON.parse(raw) as BloomStore | BloomLog[] | null;

    if (Array.isArray(parsed)) {
      return { nextId: computeNextId(parsed), blooms: parsed };
    }

    if (parsed && Array.isArray(parsed.blooms)) {
      return {
        nextId: Number.isFinite(parsed.nextId)
          ? Number(parsed.nextId)
          : computeNextId(parsed.blooms),
        blooms: parsed.blooms
      };
    }
  } catch {
    return { nextId: 1, blooms: [] };
  }

  return { nextId: 1, blooms: [] };
};

const writeStore = (store: BloomStore) => {
  ensureDataDir();
  fs.writeFileSync(dataFile, JSON.stringify(store, null, 2));
};

const updateStore = (updater: (store: BloomStore) => void) => {
  const store = readStore();
  updater(store);
  writeStore(store);
};

export const logBloom = (content: string, status: BloomStatus) => {
  const createdAt = new Date().toISOString();
  let newId = 0;

  updateStore((store) => {
    newId = store.nextId;
    store.nextId += 1;
    store.blooms.push({
      id: newId,
      created_at: createdAt,
      content,
      status
    });
  });

  return { id: newId, created_at: createdAt };
};

export const updateBloomStatus = (id: number, status: BloomStatus) => {
  updateStore((store) => {
    const target = store.blooms.find((bloom) => bloom.id === id);
    if (target) {
      target.status = status;
    }
  });
};

export const getRecentBlooms = (limit = 10): BloomLog[] => {
  const store = readStore();
  return [...store.blooms]
    .sort((a, b) => b.id - a.id)
    .slice(0, limit);
};

export function createBloom(input: {
  mode?: string;
  intensity?: string;
  content: string;
  status: BloomStatus;
}) {
  let newId = 0;

  updateStore((store) => {
    newId = store.nextId;
    store.nextId += 1;
    store.blooms.push({
      id: newId,
      created_at: new Date().toISOString(),
      content: input.content,
      status: input.status,
      mode: input.mode ?? null,
      intensity: input.intensity ?? null
    });
  });

  return newId;
}

export function updateBloom(
  id: number,
  patch: { content?: string; status?: BloomStatus; mode?: string; intensity?: string }
) {
  updateStore((store) => {
    const target = store.blooms.find((bloom) => bloom.id === id);
    if (!target) return;

    if (typeof patch.content === "string") {
      target.content = patch.content;
    }
    if (typeof patch.status === "string") {
      target.status = patch.status;
    }
    if (typeof patch.mode === "string") {
      target.mode = patch.mode;
    }
    if (typeof patch.intensity === "string") {
      target.intensity = patch.intensity;
    }
  });
}

export function listBlooms(limit = 10): BloomLog[] {
  return getRecentBlooms(limit);
}
