// Small in-memory TTL cache. Not a data-fetching library (no request
// dedupe/retry/background-refetch) — just a get/set/invalidate map with
// expiry, for services that want to avoid refetching the same key inside a
// short window (e.g. a feature-flag or lookup-list read). Reach for a real
// data-fetching library if you outgrow this.
const store = new Map();

export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

export function setCached(key, value, ttlMs = 60_000) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function invalidateCached(key) {
  store.delete(key);
}

export function clearCache() {
  store.clear();
}
