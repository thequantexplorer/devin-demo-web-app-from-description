const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Dates are 'YYYY-MM-DD' strings. They are read as UTC so the local time zone never shifts a day.
export function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return date;
}

export function countWeekdays(start, end) {
  const from = parseDate(start);
  const to = parseDate(end);
  if (!from || !to || to < from) return 0;
  let count = 0;
  for (const day = new Date(from); day <= to; day.setUTCDate(day.getUTCDate() + 1)) {
    const weekday = day.getUTCDay();
    if (weekday !== 0 && weekday !== 6) count += 1;
  }
  return count;
}

export function monthLabel(value) {
  const date = parseDate(value);
  return date ? `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}` : '';
}

// Groups approved requests by the month of their start date, earliest month first.
export function groupApprovedByMonth(requests) {
  const approved = requests
    .filter((r) => r.status === 'approved')
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end));
  const groups = [];
  for (const request of approved) {
    const label = monthLabel(request.start);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.requests.push(request);
    else groups.push({ label, requests: [request] });
  }
  return groups;
}

export function validateRequest({ name, start, end }) {
  if (!name || !name.trim()) return 'Name is required.';
  const from = parseDate(start);
  const to = parseDate(end);
  if (!from || !to) return 'Start date and end date are required.';
  if (to < from) return 'End date cannot be before start date.';
  return null;
}
