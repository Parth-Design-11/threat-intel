export type ExploreType = "risk-score" | "cta" | "message-patterns";

export type ExploreHistoryEntry = {
  query: string;
  searchedAt: number;
};

const STORAGE_KEY = "wisely-explore-search-history";
const MAX_HISTORY = 5;

type ExploreHistoryStore = Partial<Record<ExploreType, ExploreHistoryEntry[]>>;

function readStore(): ExploreHistoryStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ExploreHistoryStore;
  } catch {
    return {};
  }
}

function writeStore(store: ExploreHistoryStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getExploreHistory(type: ExploreType): ExploreHistoryEntry[] {
  return readStore()[type] ?? [];
}

export function addExploreHistory(type: ExploreType, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;

  const store = readStore();
  const existing = store[type] ?? [];
  const next = [
    { query: trimmed, searchedAt: Date.now() },
    ...existing.filter((entry) => entry.query !== trimmed),
  ].slice(0, MAX_HISTORY);

  store[type] = next;
  writeStore(store);
}
