export const PERSON_COLORS = ['#5B8DEF', '#3FA27A', '#D49A3A', '#D2694A', '#5E8C9A', '#7A8B5A']

export function colorForName(name) {
  const key = name.trim().toLowerCase()
  let hash = 2166136261
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i)
    hash = Math.imul(hash, 16777619) >>> 0
  }
  return PERSON_COLORS[hash % PERSON_COLORS.length]
}

export function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}
