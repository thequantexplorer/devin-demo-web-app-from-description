import { describe, expect, it } from 'vitest'
import { countWeekdays, formatRange, groupApprovedByMonth, monthWeeks, validateRequest } from './dates.js'

describe('countWeekdays', () => {
  it('counts a single weekday as 1', () => {
    expect(countWeekdays('2027-03-01', '2027-03-01')).toBe(1) // Monday
  })

  it('includes both start and end dates', () => {
    expect(countWeekdays('2027-03-01', '2027-03-05')).toBe(5) // Mon–Fri
  })

  it('skips Saturdays and Sundays', () => {
    expect(countWeekdays('2027-03-05', '2027-03-08')).toBe(2) // Fri–Mon
    expect(countWeekdays('2027-03-06', '2027-03-07')).toBe(0) // Sat–Sun
  })

  it('counts across months and years', () => {
    expect(countWeekdays('2027-03-29', '2027-04-09')).toBe(10)
    expect(countWeekdays('2026-12-28', '2027-01-08')).toBe(10)
  })

  it('returns 0 for invalid or reversed ranges', () => {
    expect(countWeekdays('2027-03-10', '2027-03-01')).toBe(0)
    expect(countWeekdays('', '2027-03-01')).toBe(0)
    expect(countWeekdays('2027-02-30', '2027-03-01')).toBe(0)
  })
})

describe('groupApprovedByMonth', () => {
  const requests = [
    { id: '1', name: 'Ada', start: '2027-05-03', end: '2027-05-04', status: 'approved' },
    { id: '2', name: 'Ben', start: '2027-03-15', end: '2027-03-19', status: 'approved' },
    { id: '3', name: 'Cy', start: '2027-03-02', end: '2027-03-02', status: 'approved' },
    { id: '4', name: 'Dee', start: '2027-04-01', end: '2027-04-02', status: 'denied' },
    { id: '5', name: 'Eve', start: '2027-02-01', end: '2027-02-02', status: 'pending' },
    { id: '6', name: 'Fay', start: '2026-12-21', end: '2026-12-24', status: 'approved' },
  ]

  it('groups approved requests by month with readable labels, earliest first', () => {
    const groups = groupApprovedByMonth(requests)
    expect(groups.map((g) => g.label)).toEqual(['December 2026', 'March 2027', 'May 2027'])
  })

  it('orders requests within a month by start date', () => {
    const march = groupApprovedByMonth(requests).find((g) => g.key === '2027-03')
    expect(march.requests.map((r) => r.name)).toEqual(['Cy', 'Ben'])
  })

  it('leaves out denied and pending requests', () => {
    const names = groupApprovedByMonth(requests).flatMap((g) => g.requests.map((r) => r.name))
    expect(names).not.toContain('Dee')
    expect(names).not.toContain('Eve')
  })

  it('returns an empty list when nothing is approved', () => {
    expect(groupApprovedByMonth([])).toEqual([])
  })
})

describe('validateRequest', () => {
  it('requires a name', () => {
    expect(validateRequest({ name: '  ', start: '2027-03-01', end: '2027-03-02' })).toHaveProperty('name')
  })

  it('rejects an end date before the start date', () => {
    expect(validateRequest({ name: 'Ada', start: '2027-03-05', end: '2027-03-01' })).toHaveProperty('end')
  })

  it('accepts a valid request', () => {
    expect(validateRequest({ name: 'Ada', start: '2027-03-01', end: '2027-03-01' })).toEqual({})
  })
})

describe('calendar helpers', () => {
  it('builds Monday-first weeks covering the month', () => {
    const weeks = monthWeeks(2027, 2) // March 2027 starts on a Monday
    expect(weeks[0][0].getDate()).toBe(1)
    expect(weeks.every((w) => w.length === 7)).toBe(true)
    expect(weeks.at(-1).some((d) => d.getMonth() === 2 && d.getDate() === 31)).toBe(true)
  })

  it('formats ranges compactly', () => {
    expect(formatRange('2027-03-01', '2027-03-05')).toBe('Mar 1 – 5, 2027')
    expect(formatRange('2027-03-30', '2027-04-02')).toBe('Mar 30 – Apr 2, 2027')
    expect(formatRange('2027-03-01', '2027-03-01')).toBe('Mar 1, 2027')
  })
})
