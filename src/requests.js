import { countWeekdays, parseISODate } from './dates.js';

export const PERSON_COLORS = ['#5B8DEF', '#3FA27A', '#D49A3A', '#D2694A', '#5E8C9A', '#7A8B5A'];

export function personColor(name) {
  const key = name.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return PERSON_COLORS[hash % PERSON_COLORS.length];
}

export function validateRequest({ name, start, end }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Enter a name.';
  const startDate = parseISODate(start);
  const endDate = parseISODate(end);
  if (!startDate) errors.start = 'Pick a start date.';
  if (!endDate) errors.end = 'Pick an end date.';
  else if (startDate && endDate < startDate) errors.end = 'End date can’t be before the start date.';
  return errors;
}

function newId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createRequest({ name, start, end, note }) {
  return {
    id: newId(),
    name: name.trim(),
    start,
    end,
    note: (note || '').trim(),
    weekdays: countWeekdays(start, end),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}
