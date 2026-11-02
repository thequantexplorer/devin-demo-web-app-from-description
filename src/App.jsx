import { useEffect, useState } from 'react';
import {
  countWeekdays,
  formatDate,
  groupApprovedByMonth,
  validateRequest,
} from './dates.js';
import { loadRequests, saveRequests } from './storage.js';
import './App.css';

const EMPTY_FORM = { name: '', start: '', end: '', note: '' };
const STATUS_LABELS = { pending: 'Pending', approved: 'Approved', denied: 'Denied' };

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function dayLabel(days) {
  return `${days} weekday${days === 1 ? '' : 's'}`;
}

export default function App() {
  const [requests, setRequests] = useState(() => loadRequests());
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    saveRequests(requests);
  }, [requests]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const message = validateRequest(form);
    if (message) {
      setError(message);
      return;
    }
    const request = {
      id: newId(),
      name: form.name.trim(),
      start: form.start,
      end: form.end,
      note: form.note.trim(),
      status: 'pending',
      weekdays: countWeekdays(form.start, form.end),
    };
    setRequests((prev) => [...prev, request]);
    setForm(EMPTY_FORM);
    setError('');
  }

  function setStatus(id, status) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const groups = groupApprovedByMonth(requests);

  return (
    <main className="app">
      <h1>Team PTO</h1>

      <section className="card">
        <h2>New time-off request</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Name
            <input name="name" value={form.name} onChange={updateField} />
          </label>
          <div className="row">
            <label>
              Start date
              <input type="date" name="start" value={form.start} onChange={updateField} />
            </label>
            <label>
              End date
              <input type="date" name="end" value={form.end} onChange={updateField} />
            </label>
          </div>
          <label>
            Note (optional)
            <textarea name="note" rows="2" value={form.note} onChange={updateField} />
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button type="submit">Add request</button>
        </form>
      </section>

      <section className="card">
        <h2>Requests</h2>
        {requests.length === 0 ? (
          <p className="muted">No requests yet.</p>
        ) : (
          <ul className="requests" aria-label="Requests">
            {requests.map((r) => (
              <li key={r.id} className="request">
                <div>
                  <strong>{r.name}</strong>{' '}
                  <span className={`status status-${r.status}`}>{STATUS_LABELS[r.status]}</span>
                  <div className="muted">
                    {formatDate(r.start)} – {formatDate(r.end)} · {dayLabel(r.weekdays)}
                  </div>
                  {r.note && <div className="note">{r.note}</div>}
                </div>
                {r.status === 'pending' && (
                  <div className="actions">
                    <button
                      type="button"
                      onClick={() => setStatus(r.id, 'approved')}
                      aria-label={`Approve ${r.name}`}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => setStatus(r.id, 'denied')}
                      aria-label={`Deny ${r.name}`}
                    >
                      Deny
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card" aria-labelledby="calendar-heading">
        <h2 id="calendar-heading">Calendar</h2>
        {groups.length === 0 ? (
          <p className="muted">No approved time off yet.</p>
        ) : (
          groups.map((group) => (
            <div key={group.key} className="month">
              <h3>{group.label}</h3>
              <ul>
                {group.requests.map((r) => (
                  <li key={r.id}>
                    <strong>{r.name}</strong>: {formatDate(r.start)} – {formatDate(r.end)} (
                    {dayLabel(r.weekdays)})
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
