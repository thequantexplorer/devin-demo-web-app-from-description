const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_MS = 24 * 60 * 60 * 1000;

export function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return date;
}

export function countWeekdays(start, end) {
  const from = parseDate(start);
  const to = parseDate(end);
  if (!from || !to || to < from) return 0;
  let count = 0;
  for (let t = from.getTime(); t <= to.getTime(); t += DAY_MS) {
    const day = new Date(t).getUTCDay();
    if (day !== 0 && day !== 6) count += 1;
  }
  return count;
}

export function validateRequest({ name, start, end }) {
  if (!name || !name.trim()) return 'Name is required.';
  const from = parseDate(start);
  const to = parseDate(end);
  if (!from) return 'Start date is required.';
  if (!to) return 'End date is required.';
  if (to < from) return 'End date cannot be before start date.';
  return null;
}

export function monthLabel(value) {
  const date = parseDate(value);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function formatDate(value) {
  const date = parseDate(value);
  return `${MONTHS[date.getUTCMonth()].slice(0, 3)} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export function groupApprovedByMonth(requests) {
  const approved = requests
    .filter((r) => r.status === 'approved')
    .sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end));
  const groups = [];
  for (const request of approved) {
    const key = request.start.slice(0, 7);
    let group = groups[groups.length - 1];
    if (!group || group.key !== key) {
      group = { key, label: monthLabel(request.start), requests: [] };
      groups.push(group);
    }
    group.requests.push(request);
  }
  return groups;
}
