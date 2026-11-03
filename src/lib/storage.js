export const STORAGE_KEY = 'team-pto.requests.v1'

const STATUSES = new Set(['pending', 'approved', 'denied'])

function isValidRequest(item) {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.start === 'string' &&
    typeof item.end === 'string' &&
    STATUSES.has(item.status)
  )
}

export function loadRequests(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isValidRequest) : []
  } catch {
    return []
  }
}

export function saveRequests(requests, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(requests))
  } catch {
    // Storage can be full or unavailable (private mode); the app keeps working in memory.
  }
}
