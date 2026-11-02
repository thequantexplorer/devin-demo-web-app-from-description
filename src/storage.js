export const STORAGE_KEY = 'team-pto.requests.v1';

const STATUSES = new Set(['pending', 'approved', 'denied']);

function isValidRequest(r) {
  return (
    r &&
    typeof r.id === 'string' &&
    typeof r.name === 'string' &&
    typeof r.start === 'string' &&
    typeof r.end === 'string' &&
    STATUSES.has(r.status)
  );
}

export function loadRequests(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidRequest) : [];
  } catch {
    return [];
  }
}

export function saveRequests(requests, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // Storage full or unavailable; keep working in memory.
  }
}
