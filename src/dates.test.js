import { describe, expect, it } from 'vitest';
import { countWeekdays, groupApprovedByMonth, monthLabel, validateRequest } from './dates.js';

describe('countWeekdays', () => {
  it('counts a single weekday as 1', () => {
    expect(countWeekdays('2027-03-01', '2027-03-01')).toBe(1); // Monday
  });

  it('counts both start and end dates', () => {
    expect(countWeekdays('2027-03-01', '2027-03-05')).toBe(5); // Mon to Fri
  });

  it('skips weekends', () => {
    expect(countWeekdays('2027-03-05', '2027-03-08')).toBe(2); // Fri to Mon
    expect(countWeekdays('2027-03-06', '2027-03-07')).toBe(0); // Sat to Sun
    expect(countWeekdays('2027-03-01', '2027-03-14')).toBe(10); // two full weeks
  });

  it('works across months and years', () => {
    expect(countWeekdays('2026-12-28', '2027-01-08')).toBe(10);
  });

  it('returns 0 when the end is before the start or a date is invalid', () => {
    expect(countWeekdays('2027-03-05', '2027-03-01')).toBe(0);
    expect(countWeekdays('', '2027-03-01')).toBe(0);
    expect(countWeekdays('2027-02-30', '2027-03-01')).toBe(0);
  });
});

describe('monthLabel', () => {
  it('formats a date as month and year', () => {
    expect(monthLabel('2027-03-15')).toBe('March 2027');
  });
});

describe('groupApprovedByMonth', () => {
  const requests = [
    { id: '1', name: 'Ana', start: '2027-04-10', end: '2027-04-12', status: 'approved' },
    { id: '2', name: 'Ben', start: '2027-03-20', end: '2027-03-22', status: 'approved' },
    { id: '3', name: 'Cy', start: '2027-03-02', end: '2027-03-03', status: 'approved' },
    { id: '4', name: 'Dee', start: '2027-01-05', end: '2027-01-06', status: 'denied' },
    { id: '5', name: 'Eli', start: '2027-02-01', end: '2027-02-02', status: 'pending' },
    { id: '6', name: 'Fay', start: '2026-12-30', end: '2027-01-02', status: 'approved' },
  ];

  it('groups approved requests by month, earliest first', () => {
    const groups = groupApprovedByMonth(requests);
    expect(groups.map((g) => g.label)).toEqual(['December 2026', 'March 2027', 'April 2027']);
    expect(groups[1].requests.map((r) => r.name)).toEqual(['Cy', 'Ben']);
  });

  it('leaves out denied and pending requests', () => {
    const names = groupApprovedByMonth(requests).flatMap((g) => g.requests.map((r) => r.name));
    expect(names).not.toContain('Dee');
    expect(names).not.toContain('Eli');
  });

  it('returns an empty list when nothing is approved', () => {
    expect(groupApprovedByMonth([])).toEqual([]);
  });
});

describe('validateRequest', () => {
  it('requires a name', () => {
    expect(validateRequest({ name: '  ', start: '2027-03-01', end: '2027-03-02' })).toMatch(/name/i);
  });

  it('rejects an end date before the start date', () => {
    expect(validateRequest({ name: 'Ana', start: '2027-03-05', end: '2027-03-01' })).toMatch(/before/i);
  });

  it('accepts a valid request', () => {
    expect(validateRequest({ name: 'Ana', start: '2027-03-01', end: '2027-03-01' })).toBeNull();
  });
});
