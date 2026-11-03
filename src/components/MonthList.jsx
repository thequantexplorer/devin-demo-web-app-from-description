import { countWeekdays, formatRange } from '../lib/dates.js'
import { colorForName } from '../lib/colors.js'

export default function MonthList({ groups, onSelectMonth }) {
  return (
    <section className="month-list" aria-labelledby="month-list-title">
      <h3 id="month-list-title" className="section-label">Approved time off by month</h3>
      {groups.length === 0 ? (
        <p className="subtle">Nothing approved yet.</p>
      ) : (
        groups.map((group) => (
          <div key={group.key} className="month-group" data-testid="month-group">
            <button type="button" className="month-heading" onClick={() => onSelectMonth(group.key)}>
              <h4>{group.label}</h4>
            </button>
            <ul>
              {group.requests.map((request) => {
                const days = countWeekdays(request.start, request.end)
                return (
                  <li key={request.id} className="month-item">
                    <span className="person-dot" style={{ background: colorForName(request.name) }} aria-hidden="true" />
                    <span className="month-item-name">{request.name}</span>
                    <span className="month-item-dates subtle tabular">{formatRange(request.start, request.end)}</span>
                    <span className="month-item-days subtle tabular">{days}d</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))
      )}
    </section>
  )
}
