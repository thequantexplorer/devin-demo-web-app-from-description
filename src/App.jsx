import { useEffect, useMemo, useState } from 'react'
import RequestForm from './components/RequestForm.jsx'
import RequestList from './components/RequestList.jsx'
import CalendarMonth from './components/CalendarMonth.jsx'
import MonthList from './components/MonthList.jsx'
import { groupApprovedByMonth, parseISODate, toISODate } from './lib/dates.js'
import { loadRequests, saveRequests } from './lib/storage.js'

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function App() {
  const [requests, setRequests] = useState(() => loadRequests())
  const [todayISO] = useState(() => toISODate(new Date()))
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  useEffect(() => {
    saveRequests(requests)
  }, [requests])

  const groups = useMemo(() => groupApprovedByMonth(requests), [requests])
  const pendingCount = requests.filter((r) => r.status === 'pending').length
  const approvedCount = requests.filter((r) => r.status === 'approved').length

  function showMonthOf(iso) {
    const date = parseISODate(iso)
    if (date) setVisibleMonth({ year: date.getFullYear(), month: date.getMonth() })
  }

  function addRequest({ name, start, end, note }) {
    const request = {
      id: newId(),
      name: name.trim(),
      start,
      end,
      note: note.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setRequests((current) => [request, ...current])
  }

  function setStatus(id, status) {
    setRequests((current) => current.map((r) => (r.id === id ? { ...r, status } : r)))
    if (status === 'approved') {
      const request = requests.find((r) => r.id === id)
      if (request) showMonthOf(request.start)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <h1>Team PTO</h1>
            <p className="subtle">Time off requests and who’s out when.</p>
          </div>
        </div>
        <dl className="stats">
          <div>
            <dt>Pending</dt>
            <dd>{pendingCount}</dd>
          </div>
          <div>
            <dt>Approved</dt>
            <dd>{approvedCount}</dd>
          </div>
        </dl>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <RequestForm onAdd={addRequest} />
          <RequestList
            requests={requests}
            onApprove={(id) => setStatus(id, 'approved')}
            onDeny={(id) => setStatus(id, 'denied')}
          />
        </aside>
        <section className="panel calendar-panel" aria-label="Calendar">
          <CalendarMonth requests={requests} visibleMonth={visibleMonth} todayISO={todayISO} onChangeMonth={setVisibleMonth} />
          <MonthList groups={groups} onSelectMonth={(key) => showMonthOf(`${key}-01`)} />
        </section>
      </main>
    </div>
  )
}
