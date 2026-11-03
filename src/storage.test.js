import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEY, loadRequests, saveRequests } from './storage.js';

const sample = [
  { id: '1', name: 'Ada', start: '2027-03-01', end: '2027-03-05', note: 'Trip', weekdays: 5, status: 'approved' },
  { id: '2', name: 'Lin', start: '2027-04-01', end: '2027-04-02', note: '', weekdays: 2, status: 'pending' },
];

describe('localStorage save and load', () => {
  beforeEach(() => localStorage.clear());

  it('returns an empty list when nothing is saved', () => {
    expect(loadRequests()).toEqual([]);
  });

  it('saves requests and loads them back', () => {
    saveRequests(sample);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(sample);
    expect(loadRequests()).toEqual(sample);
  });

  it('ignores corrupt or malformed data', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadRequests()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nope: true }));
    expect(loadRequests()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([sample[0], { id: 3 }]));
    expect(loadRequests()).toEqual([sample[0]]);
  });
});
