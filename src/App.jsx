import { useEffect, useState } from 'react';
import { countWeekdays, groupApprovedByMonth, validateRequest } from './dates.js';
import { loadRequests, saveRequests } from './storage.js';
import './App.css';

const EMPTY_FORM = { name: '', start: '', end: '', note: '' };
const STATUS_LABELS = { pending: 'Pending', approved: 'Approved', denied: 'Denied' };

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function dayLabel(count) {
  return `${count} weekday${count === 1 ? '' : 's'}`;
}

export default function App() {
  const [requests, setRequests] = useState(() => loadRequests());
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);

  useEffect(() => {
    saveRequests(requests);
  }, [requests]);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const problem = validateRequest(form);
    if (problem) {
      setError(problem);
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
    setRequests([...requests, request]);
    setForm(EMPTY_FORM);
    setError(null);
  }

  function setStatus(id, status) {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const groups = groupApprovedByMonth(requests);

  return (
    <main>
      <h1>Team PTO</h1>

      <section aria-labelledby="new-request-heading">
        <h2 id="new-request-heading">New time-off request</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Name
            <input name="name" value={form.name} onChange={updateField} />
          </label>
          <label>
            Start date
            <input type="date" name="start" value={form.start} onChange={updateField} />
          </label>
          <label>
            End date
            <input type="date" name="end" value={form.end} onChange={updateField} />
          </label>
          <label className="wide">
            Note (optional)
            <input name="note" value={form.note} onChange={updateField} />
          </label>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <button type="submit">Add request</button>
        </form>
      </section>

      <section aria-labelledby="requests-heading">
        <h2 id="requests-heading">Requests</h2>
        {requests.length === 0 ? (
          <p className="empty">No requests yet.</p>
        ) : (
          <ul className="requests">
            {requests.map((r) => (
              <li key={r.id} className={`request ${r.status}`} aria-label={`Request from ${r.name}`}>
                <div>
                  <strong>{r.name}</strong> · {r.start} to {r.end} · {dayLabel(r.weekdays)}
                  {r.note && <div className="note">{r.note}</div>}
                </div>
                <div className="actions">
                  <span className={`status ${r.status}`}>{STATUS_LABELS[r.status]}</span>
                  {r.status === 'pending' && (
                    <>
                      <button type="button" onClick={() => setStatus(r.id, 'approved')}>
                        Approve
                      </button>
                      <button type="button" className="deny" onClick={() => setStatus(r.id, 'denied')}>
                        Deny
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="calendar-heading">
        <h2 id="calendar-heading">Calendar</h2>
        {groups.length === 0 ? (
          <p className="empty">No approved time off yet.</p>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="month" role="group" aria-label={group.label}>
              <h3>{group.label}</h3>
              <ul>
                {group.requests.map((r) => (
                  <li key={r.id}>
                    <strong>{r.name}</strong> · {r.start} to {r.end} · {dayLabel(r.weekdays)}
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
