import { WEEKDAY_LABELS, isWeekend, monthLabel, monthWeeks, parseISODate, toISODate } from '../lib/dates.js'
import { colorForName } from '../lib/colors.js'

function weekSegments(week, approved) {
  const weekStart = toISODate(week[0])
  const weekEnd = toISODate(week[6])
  const segments = approved
    .filter((r) => r.start <= weekEnd && r.end >= weekStart)
    .map((r) => {
      const from = r.start < weekStart ? weekStart : r.start
      const to = r.end > weekEnd ? weekEnd : r.end
      const startCol = week.findIndex((d) => toISODate(d) === from)
      const endCol = week.findIndex((d) => toISODate(d) === to)
      return { request: r, startCol, endCol, clippedStart: r.start < weekStart, clippedEnd: r.end > weekEnd }
    })
    .sort((a, b) => a.startCol - b.startCol || b.endCol - a.endCol)

  const laneEnds = []
  for (const seg of segments) {
    let lane = laneEnds.findIndex((end) => end < seg.startCol)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(seg.endCol)
    } else {
      laneEnds[lane] = seg.endCol
    }
    seg.lane = lane
  }
  return { segments, lanes: laneEnds.length }
}

export default function CalendarMonth({ requests, visibleMonth, todayISO, onChangeMonth }) {
  const { year, month } = visibleMonth
  const weeks = monthWeeks(year, month)
  const approved = requests
    .filter((r) => r.status === 'approved' && parseISODate(r.start) && parseISODate(r.end))
    .sort((a, b) => a.start.localeCompare(b.start))
  const title = monthLabel(`${year}-${String(month + 1).padStart(2, '0')}`)
  const monthHasTimeOff = weeks.some((week) => weekSegments(week, approved).segments.length > 0)

  function shift(delta) {
    const next = new Date(year, month + delta, 1)
    onChangeMonth({ year: next.getFullYear(), month: next.getMonth() })
  }

  function goToday() {
    const now = new Date()
    onChangeMonth({ year: now.getFullYear(), month: now.getMonth() })
  }

  return (
    <div className="calendar">
      <div className="calendar-head">
        <h2 className="calendar-title" aria-live="polite">{title}</h2>
        <div className="calendar-nav">
          <button type="button" className="btn btn-secondary btn-sm" onClick={goToday}>Today</button>
          <button type="button" className="btn btn-secondary btn-icon" onClick={() => shift(-1)} aria-label="Previous month">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className="btn btn-secondary btn-icon" onClick={() => shift(1)} aria-label="Next month">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      <div className="grid" role="grid" aria-label={title}>
        <div className="grid-weekdays" role="row">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={label} role="columnheader" className={i >= 5 ? 'is-weekend' : undefined}>{label}</div>
          ))}
        </div>
        {weeks.map((week) => {
          const { segments, lanes } = weekSegments(week, approved)
          return (
            <div key={toISODate(week[0])} className="week" role="row" style={{ '--lanes': lanes }}>
              {week.map((day) => {
                const iso = toISODate(day)
                const classes = ['day']
                if (isWeekend(day)) classes.push('is-weekend')
                if (day.getMonth() !== month) classes.push('is-outside')
                if (iso === todayISO) classes.push('is-today')
                return (
                  <div key={iso} className={classes.join(' ')} role="gridcell" aria-label={iso}>
                    <span className="day-number tabular">{day.getDate()}</span>
                  </div>
                )
              })}
              <div className="week-bars">
                {segments.map((seg) => {
                  const color = colorForName(seg.request.name)
                  const classes = ['bar']
                  if (seg.clippedStart) classes.push('clip-start')
                  if (seg.clippedEnd) classes.push('clip-end')
                  return (
                    <div
                      key={seg.request.id}
                      className={classes.join(' ')}
                      style={{
                        gridColumn: `${seg.startCol + 1} / ${seg.endCol + 2}`,
                        gridRow: seg.lane + 1,
                        '--person': color,
                      }}
                      title={`${seg.request.name}${seg.request.note ? ` — ${seg.request.note}` : ''}`}
                    >
                      <span className="bar-label">{seg.request.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      {!monthHasTimeOff && <p className="calendar-empty subtle">Approved time off shows here</p>}
    </div>
  )
}
