const MONTH_LABEL = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
const SHORT_DAY = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

export function parseISODate(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function countWeekdays(startISO, endISO) {
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  if (!start || !end || end < start) return 0;
  let count = 0;
  for (let d = start; d <= end; d = addDays(d, 1)) {
    if (!isWeekend(d)) count += 1;
  }
  return count;
}

export function monthKey(iso) {
  return iso.slice(0, 7);
}

export function formatMonth(year, monthIndex) {
  return MONTH_LABEL.format(new Date(year, monthIndex, 1));
}

export function formatMonthKey(key) {
  const [y, m] = key.split('-').map(Number);
  return formatMonth(y, m - 1);
}

export function formatRange(startISO, endISO) {
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  if (!start || !end) return '';
  if (startISO === endISO) return `${SHORT_DAY.format(start)}, ${start.getFullYear()}`;
  if (start.getFullYear() === end.getFullYear()) {
    return `${SHORT_DAY.format(start)} – ${SHORT_DAY.format(end)}, ${end.getFullYear()}`;
  }
  return `${SHORT_DAY.format(start)}, ${start.getFullYear()} – ${SHORT_DAY.format(end)}, ${end.getFullYear()}`;
}

export function pluralizeWeekdays(count) {
  return `${count} ${count === 1 ? 'weekday' : 'weekdays'}`;
}

/** Approved requests grouped by the month they start in, earliest month and date first. */
export function groupApprovedByMonth(requests) {
  const approved = requests
    .filter((r) => r.status === 'approved')
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end));
  const groups = [];
  for (const request of approved) {
    const key = monthKey(request.start);
    let group = groups[groups.length - 1];
    if (!group || group.key !== key) {
      group = { key, label: formatMonthKey(key), requests: [] };
      groups.push(group);
    }
    group.requests.push(request);
  }
  return groups;
}

/** Weeks (Sunday first) covering the given month; each week is 7 Date objects. */
export function buildMonthWeeks(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  let cursor = addDays(first, -first.getDay());
  const weeks = [];
  while (cursor <= last) {
    const week = [];
    for (let i = 0; i < 7; i += 1) week.push(addDays(cursor, i));
    weeks.push(week);
    cursor = addDays(cursor, 7);
  }
  return weeks;
}

/** Bar segments for one week row, with lanes assigned so bars never overlap. */
export function weekSegments(week, requests) {
  const weekStart = toISODate(week[0]);
  const weekEnd = toISODate(week[6]);
  const segments = requests
    .filter((r) => r.start <= weekEnd && r.end >= weekStart)
    .map((r) => {
      const segStart = r.start > weekStart ? r.start : weekStart;
      const segEnd = r.end < weekEnd ? r.end : weekEnd;
      const startCol = parseISODate(segStart).getDay();
      const endCol = parseISODate(segEnd).getDay();
      return {
        request: r,
        startCol,
        span: endCol - startCol + 1,
        startsHere: r.start >= weekStart,
        endsHere: r.end <= weekEnd,
      };
    })
    .sort((a, b) => a.startCol - b.startCol || b.span - a.span);
  const laneEnds = [];
  for (const seg of segments) {
    let lane = laneEnds.findIndex((end) => end < seg.startCol);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(0);
    }
    laneEnds[lane] = seg.startCol + seg.span - 1;
    seg.lane = lane;
  }
  return segments;
}
