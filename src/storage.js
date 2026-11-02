export const STORAGE_KEY = 'team-pto.requests';

export function loadRequests(storage = window.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRequests(requests, storage = window.localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(requests));
}
