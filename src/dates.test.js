import { describe, expect, it } from 'vitest';
import { buildMonthWeeks, countWeekdays, formatRange, groupApprovedByMonth, weekSegments } from './dates.js';

describe('countWeekdays', () => {
  it('counts a single weekday as 1', () => {
    expect(countWeekdays('2027-03-01', '2027-03-01')).toBe(1); // Monday
  });

  it('counts Monday to Friday, both dates included', () => {
    expect(countWeekdays('2027-03-01', '2027-03-05')).toBe(5);
  });

  it('skips weekends', () => {
    expect(countWeekdays('2027-03-05', '2027-03-08')).toBe(2); // Fri..Mon
    expect(countWeekdays('2027-03-06', '2027-03-07')).toBe(0); // Sat..Sun
  });

  it('counts across months and years', () => {
    expect(countWeekdays('2027-03-29', '2027-04-02')).toBe(5);
    expect(countWeekdays('2026-12-28', '2027-01-08')).toBe(10);
  });

  it('handles DST changes', () => {
    expect(countWeekdays('2027-03-08', '2027-03-19')).toBe(10);
  });

  it('returns 0 when the end is before the start or dates are invalid', () => {
    expect(countWeekdays('2027-03-05', '2027-03-01')).toBe(0);
    expect(countWeekdays('', '2027-03-01')).toBe(0);
    expect(countWeekdays('2027-02-30', '2027-03-01')).toBe(0);
  });
});

describe('groupApprovedByMonth', () => {
  const req = (id, start, end, status = 'approved') => ({ id, name: id, start, end, status });

  it('groups approved requests by month, earliest first', () => {
    const groups = groupApprovedByMonth([
      req('c', '2027-04-12', '2027-04-14'),
      req('a', '2027-03-15', '2027-03-16'),
      req('b', '2027-03-02', '2027-03-03'),
      req('d', '2026-12-21', '2026-12-24'),
    ]);
    expect(groups.map((g) => g.label)).toEqual(['December 2026', 'March 2027', 'April 2027']);
    expect(groups[1].requests.map((r) => r.id)).toEqual(['b', 'a']);
  });

  it('leaves out pending and denied requests', () => {
    const groups = groupApprovedByMonth([
      req('a', '2027-03-01', '2027-03-02', 'denied'),
      req('b', '2027-05-01', '2027-05-02', 'pending'),
      req('c', '2027-06-01', '2027-06-02'),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe('June 2027');
    expect(groups[0].requests.map((r) => r.id)).toEqual(['c']);
  });

  it('returns no groups when nothing is approved', () => {
    expect(groupApprovedByMonth([])).toEqual([]);
  });
});

describe('calendar helpers', () => {
  it('builds Sunday-first weeks covering the month', () => {
    const weeks = buildMonthWeeks(2027, 2); // March 2027 starts on a Monday
    expect(weeks).toHaveLength(5);
    expect(weeks[0][0].getDate()).toBe(28);
    expect(weeks[0][1].getDate()).toBe(1);
    expect(weeks.at(-1).at(-1).getDate()).toBe(3);
  });

  it('splits a request into week segments with non-overlapping lanes', () => {
    const week = buildMonthWeeks(2027, 2)[0]; // Feb 28 .. Mar 6
    const segs = weekSegments(week, [
      { id: 'a', name: 'A', start: '2027-03-01', end: '2027-03-10', status: 'approved' },
      { id: 'b', name: 'B', start: '2027-03-02', end: '2027-03-03', status: 'approved' },
    ]);
    expect(segs[0]).toMatchObject({ startCol: 1, span: 6, lane: 0, startsHere: true, endsHere: false });
    expect(segs[1]).toMatchObject({ startCol: 2, span: 2, lane: 1 });
  });

  it('formats date ranges', () => {
    expect(formatRange('2027-03-01', '2027-03-05')).toBe('Mar 1 – Mar 5, 2027');
    expect(formatRange('2027-03-01', '2027-03-01')).toBe('Mar 1, 2027');
  });
});
