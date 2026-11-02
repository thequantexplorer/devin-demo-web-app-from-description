import { formatRange, pluralizeWeekdays } from '../dates.js';
import { personColor } from '../requests.js';

const STATUS_LABEL = { pending: 'Pending', approved: 'Approved', denied: 'Denied' };

export default function RequestList({ requests, onApprove, onDeny }) {
  const pending = requests.filter((r) => r.status === 'pending').length;
  return (
    <section className="panel requests" aria-labelledby="requests-title">
      <div className="panel__header">
        <h2 id="requests-title" className="panel__title">Requests</h2>
        {requests.length > 0 && (
          <span className="panel__meta">{pending > 0 ? `${pending} pending` : 'All reviewed'}</span>
        )}
      </div>
      {requests.length === 0 ? (
        <div className="empty">
          <p className="empty__title">No requests yet</p>
          <p className="empty__body">New time-off requests show up here for review.</p>
        </div>
      ) : (
        <ul className="request-list">
          {requests.map((r) => (
            <li key={r.id} className={`request request--${r.status}`} data-testid="request">
              <span className="request__dot" style={{ '--person': personColor(r.name) }} aria-hidden="true" />
              <div className="request__body">
                <div className="request__top">
                  <span className="request__name">{r.name}</span>
                  <span className={`pill pill--${r.status}`}>{STATUS_LABEL[r.status]}</span>
                </div>
                <p className="request__dates">
                  {formatRange(r.start, r.end)} <span className="sep">·</span> {pluralizeWeekdays(r.weekdays)}
                </p>
                {r.note && <p className="request__note">{r.note}</p>}
                {r.status === 'pending' && (
                  <div className="request__actions">
                    <button type="button" className="btn btn--primary btn--sm" onClick={() => onApprove(r.id)} aria-label={`Approve ${r.name}`}>
                      Approve
                    </button>
                    <button type="button" className="btn btn--secondary btn--sm" onClick={() => onDeny(r.id)} aria-label={`Deny ${r.name}`}>
                      Deny
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
