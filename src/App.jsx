import { useEffect, useState } from 'react';
import RequestForm from './components/RequestForm.jsx';
import RequestList from './components/RequestList.jsx';
import Calendar from './components/Calendar.jsx';
import { createRequest } from './requests.js';
import { loadRequests, saveRequests } from './storage.js';

export default function App() {
  const [requests, setRequests] = useState(() => loadRequests());

  useEffect(() => {
    saveRequests(requests);
  }, [requests]);

  function addRequest(values) {
    setRequests((list) => [createRequest(values), ...list]);
  }

  function setStatus(id, status) {
    setRequests((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 20 20"><rect x="2.5" y="4" width="15" height="13" rx="3" /><path d="M2.5 8h15M7 2.5v3M13 2.5v3" /></svg>
          </span>
          <h1 className="brand__name">Team PTO</h1>
        </div>
        <p className="app__subtitle">Request, review and plan time off.</p>
      </header>
      <main className="layout">
        <div className="layout__side">
          <RequestForm onAdd={addRequest} />
          <RequestList
            requests={requests}
            onApprove={(id) => setStatus(id, 'approved')}
            onDeny={(id) => setStatus(id, 'denied')}
          />
        </div>
        <div className="layout__main">
          <Calendar requests={requests} />
        </div>
      </main>
    </div>
  );
}
