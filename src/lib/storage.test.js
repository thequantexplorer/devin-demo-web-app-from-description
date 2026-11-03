import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY, loadRequests, saveRequests } from './storage.js'

const sample = [
  { id: 'a', name: 'Ada', start: '2027-03-01', end: '2027-03-05', note: 'Trip', status: 'approved', createdAt: '2026-11-01T00:00:00.000Z' },
  { id: 'b', name: 'Ben', start: '2027-04-01', end: '2027-04-01', note: '', status: 'pending', createdAt: '2026-11-02T00:00:00.000Z' },
]

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('returns an empty list when nothing is saved', () => {
    expect(loadRequests()).toEqual([])
  })

  it('saves to localStorage and loads the same requests back', () => {
    saveRequests(sample)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(sample)
    expect(loadRequests()).toEqual(sample)
  })

  it('overwrites the previous save', () => {
    saveRequests(sample)
    saveRequests([sample[1]])
    expect(loadRequests()).toEqual([sample[1]])
  })

  it('ignores corrupt or malformed data', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadRequests()).toEqual([])
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 'x', status: 'weird' }, sample[0]]))
    expect(loadRequests()).toEqual([sample[0]])
  })
})
