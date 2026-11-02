import { countWeekdays, formatRange } from '../lib/dates.js'
import { colorForName } from '../lib/colors.js'

const STATUS_LABEL = { pending: 'Pending', approved: 'Approved', denied: 'Denied' }

export default function RequestList({ requests, onApprove, onDeny }) {
  return (
    <section className="panel" aria-labelledby="requests-title">
      <div className="panel-head">
        <h2 id="requests-title" className="panel-title">Requests</h2>
        {requests.length > 0 && <span className="subtle tabular">{requests.length}</span>}
      </div>

      {requests.length === 0 ? (
        <div className="empty">
          <p className="empty-title">No requests yet</p>
          <p className="subtle">New requests show up here for approval.</p>
        </div>
      ) : (
        <ul className="request-list">
          {requests.map((request) => {
            const days = countWeekdays(request.start, request.end)
            return (
              <li key={request.id} className={`request-row is-${request.status}`} data-testid="request-row">
                <span className="person-dot" style={{ background: colorForName(request.name) }} aria-hidden="true" />
                <div className="request-main">
                  <div className="request-top">
                    <span className="request-name">{request.name}</span>
                    <span className={`pill pill-${request.status}`}>{STATUS_LABEL[request.status]}</span>
                  </div>
                  <p className="request-meta tabular">
                    {formatRange(request.start, request.end)}
                    <span className="dot-sep" aria-hidden="true">·</span>
                    {days} weekday{days === 1 ? '' : 's'}
                  </p>
                  {request.note && <p className="request-note">{request.note}</p>}
                  {request.status === 'pending' && (
                    <div className="request-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => onApprove(request.id)}
                        aria-label={`Approve ${request.name}`}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => onDeny(request.id)}
                        aria-label={`Deny ${request.name}`}
                      >
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
