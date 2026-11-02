export const STORAGE_KEY = 'team-pto-requests';

export function loadRequests(storage = window.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRequests(requests, storage = window.localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(requests));
}
