import { beforeEach, describe, expect, it } from 'vitest';
import { loadRequests, saveRequests, STORAGE_KEY } from './storage.js';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty list when nothing is saved', () => {
    expect(loadRequests()).toEqual([]);
  });

  it('saves and loads requests', () => {
    const requests = [
      { id: '1', name: 'Ana', start: '2027-03-01', end: '2027-03-05', note: 'Trip', status: 'pending', weekdays: 5 },
    ];
    saveRequests(requests);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(requests);
    expect(loadRequests()).toEqual(requests);
  });

  it('returns an empty list when the saved data is broken', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadRequests()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, '{"a":1}');
    expect(loadRequests()).toEqual([]);
  });
});
