import { STORAGE_KEYS } from "@/constants/storageKeys";

// A real, working pending-action queue: enqueue() persists actions to
// localStorage, and they flush automatically on the browser's "online"
// event. What this deliberately does NOT do is conflict resolution — that
// needs a specific backend's semantics (last-write-wins? server-side merge?
// versioned records?) that a generic template can't invent. Provide your
// own `handler` to flush() that knows how to replay an action against your
// real API, and your own conflict handling inside it.
function readQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeQueue(queue) {
  localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
}

export function enqueue(action) {
  const queue = readQueue();
  queue.push({ ...action, queuedAt: Date.now() });
  writeQueue(queue);
}

export function peekQueue() {
  return readQueue();
}

export async function flush(handler) {
  const queue = readQueue();
  if (queue.length === 0) return;

  const remaining = [];
  for (const action of queue) {
    try {
      await handler(action);
    } catch {
      remaining.push(action);
    }
  }
  writeQueue(remaining);
}

// Call once from platform composition (see platform/sync/index.js's
// initOfflineSync) with the handler that knows how to replay a queued
// action against your real API.
export function initOfflineSync(handler) {
  const onOnline = () => flush(handler);
  window.addEventListener("online", onOnline);
  return () => window.removeEventListener("online", onOnline);
}
