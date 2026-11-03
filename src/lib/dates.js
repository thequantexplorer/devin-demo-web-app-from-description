const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const SHORT_MONTHS = MONTHS.map((m) => m.slice(0, 3))

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseISODate(value) {
  const match = ISO_RE.exec(value ?? '')
  if (!match) return null
  const [, y, m, d] = match.map(Number)
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
  return date
}

export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

export function isWeekend(date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

/** Number of Monday–Friday days from start to end, both included. */
export function countWeekdays(start, end) {
  const from = parseISODate(start)
  const to = parseISODate(end)
  if (!from || !to || to < from) return 0
  let count = 0
  for (let d = from; d <= to; d = addDays(d, 1)) {
    if (!isWeekend(d)) count += 1
  }
  return count
}

export function monthKey(iso) {
  return iso.slice(0, 7)
}

export function monthLabel(key) {
  const [y, m] = key.split('-').map(Number)
  return `${MONTHS[m - 1]} ${y}`
}

/**
 * Approved requests grouped by the month they start in, earliest month first.
 * Requests within a month are ordered by start date, then name.
 */
export function groupApprovedByMonth(requests) {
  const groups = new Map()
  const approved = requests
    .filter((r) => r.status === 'approved')
    .sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end) || a.name.localeCompare(b.name))
  for (const request of approved) {
    const key = monthKey(request.start)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(request)
  }
  return [...groups.keys()]
    .sort()
    .map((key) => ({ key, label: monthLabel(key), requests: groups.get(key) }))
}

export function formatShortDate(iso, { withYear = false } = {}) {
  const date = parseISODate(iso)
  if (!date) return ''
  const base = `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`
  return withYear ? `${base}, ${date.getFullYear()}` : base
}

export function formatRange(start, end) {
  const from = parseISODate(start)
  const to = parseISODate(end)
  if (!from || !to) return ''
  if (start === end) return formatShortDate(start, { withYear: true })
  if (from.getFullYear() === to.getFullYear()) {
    if (from.getMonth() === to.getMonth()) {
      return `${SHORT_MONTHS[from.getMonth()]} ${from.getDate()} – ${to.getDate()}, ${to.getFullYear()}`
    }
    return `${formatShortDate(start)} – ${formatShortDate(end)}, ${to.getFullYear()}`
  }
  return `${formatShortDate(start, { withYear: true })} – ${formatShortDate(end, { withYear: true })}`
}

/** Weeks (Monday first) covering the given month; each week is 7 Date objects. */
export function monthWeeks(year, month) {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7
  let cursor = addDays(first, -offset)
  const last = new Date(year, month + 1, 0)
  const weeks = []
  while (cursor <= last) {
    const week = []
    for (let i = 0; i < 7; i += 1) {
      week.push(cursor)
      cursor = addDays(cursor, 1)
    }
    weeks.push(week)
  }
  return weeks
}

export function validateRequest({ name, start, end }) {
  const errors = {}
  if (!name || !name.trim()) errors.name = 'Enter the person’s name.'
  const from = parseISODate(start)
  const to = parseISODate(end)
  if (!from) errors.start = 'Pick a start date.'
  if (!to) errors.end = 'Pick an end date.'
  else if (from && to < from) errors.end = 'Ends before the start date.'
  return errors
}
