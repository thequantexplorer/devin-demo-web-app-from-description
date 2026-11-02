import { describe, expect, it } from 'vitest';
import { countWeekdays, groupApprovedByMonth, validateRequest } from '../dates.js';

describe('countWeekdays', () => {
  it('counts a single weekday as 1', () => {
    expect(countWeekdays('2027-03-01', '2027-03-01')).toBe(1); // Monday
  });

  it('counts a single weekend day as 0', () => {
    expect(countWeekdays('2027-03-06', '2027-03-06')).toBe(0); // Saturday
  });

  it('counts Monday to Friday inclusive as 5', () => {
    expect(countWeekdays('2027-03-01', '2027-03-05')).toBe(5);
  });

  it('skips weekends in a range spanning two weeks', () => {
    expect(countWeekdays('2027-03-04', '2027-03-15')).toBe(8); // Thu -> Mon
  });

  it('handles ranges across months, years and DST changes', () => {
    expect(countWeekdays('2027-03-12', '2027-03-16')).toBe(3); // US DST starts Mar 14
    expect(countWeekdays('2026-12-30', '2027-01-04')).toBe(4);
  });

  it('returns 0 when end is before start or dates are invalid', () => {
    expect(countWeekdays('2027-03-05', '2027-03-01')).toBe(0);
    expect(countWeekdays('', '2027-03-01')).toBe(0);
  });
});

describe('validateRequest', () => {
  it('requires a name', () => {
    expect(validateRequest({ name: '  ', start: '2027-03-01', end: '2027-03-02' })).toMatch(/name/i);
  });

  it('rejects an end date before the start date', () => {
    expect(validateRequest({ name: 'Ada', start: '2027-03-05', end: '2027-03-01' })).toMatch(
      /before/i,
    );
  });

  it('accepts a valid request', () => {
    expect(validateRequest({ name: 'Ada', start: '2027-03-01', end: '2027-03-01' })).toBeNull();
  });
});

describe('groupApprovedByMonth', () => {
  const requests = [
    { id: '1', name: 'Ada', start: '2027-04-12', end: '2027-04-13', status: 'approved' },
    { id: '2', name: 'Bob', start: '2027-03-20', end: '2027-03-22', status: 'approved' },
    { id: '3', name: 'Cy', start: '2027-03-01', end: '2027-03-02', status: 'denied' },
    { id: '4', name: 'Di', start: '2027-03-03', end: '2027-03-04', status: 'pending' },
    { id: '5', name: 'Eve', start: '2027-03-08', end: '2027-03-09', status: 'approved' },
    { id: '6', name: 'Fay', start: '2026-12-28', end: '2027-01-02', status: 'approved' },
  ];

  it('groups approved requests by month, earliest first', () => {
    const groups = groupApprovedByMonth(requests);
    expect(groups.map((g) => g.label)).toEqual(['December 2026', 'March 2027', 'April 2027']);
    expect(groups[1].requests.map((r) => r.name)).toEqual(['Eve', 'Bob']);
  });

  it('leaves out denied and pending requests', () => {
    const names = groupApprovedByMonth(requests).flatMap((g) => g.requests.map((r) => r.name));
    expect(names).not.toContain('Cy');
    expect(names).not.toContain('Di');
  });

  it('returns an empty list when nothing is approved', () => {
    expect(groupApprovedByMonth([])).toEqual([]);
  });
});
