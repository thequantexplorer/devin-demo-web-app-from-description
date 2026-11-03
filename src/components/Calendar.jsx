import { useState } from 'react';
import {
  buildMonthWeeks,
  formatMonth,
  formatRange,
  groupApprovedByMonth,
  isWeekend,
  pluralizeWeekdays,
  toISODate,
  weekSegments,
} from '../dates.js';
import { personColor } from '../requests.js';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ requests, today = new Date() }) {
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const approved = requests.filter((r) => r.status === 'approved');
  const groups = groupApprovedByMonth(requests);
  const weeks = buildMonthWeeks(view.year, view.month);
  const todayISO = toISODate(today);
  const isCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth();

  function shift(delta) {
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  return (
    <section className="panel calendar" aria-labelledby="calendar-title">
      <div className="calendar__header">
        <h2 id="calendar-title" className="calendar__title" aria-live="polite">
          {formatMonth(view.year, view.month)}
        </h2>
        <div className="calendar__nav">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => setView({ year: today.getFullYear(), month: today.getMonth() })}
            disabled={isCurrentMonth}
          >
            Today
          </button>
          <button type="button" className="btn btn--secondary btn--icon" onClick={() => shift(-1)} aria-label="Previous month">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" /></svg>
          </button>
          <button type="button" className="btn btn--secondary btn--icon" onClick={() => shift(1)} aria-label="Next month">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" /></svg>
          </button>
        </div>
      </div>

      <div className="grid" role="grid" aria-labelledby="calendar-title">
        <div className="grid__head" role="row">
          {WEEKDAYS.map((d, i) => (
            <div key={d} role="columnheader" className={`grid__weekday${i === 0 || i === 6 ? ' is-weekend' : ''}`}>
              {d}
            </div>
          ))}
        </div>
        {weeks.map((week) => {
          const segments = weekSegments(week, approved);
          const lanes = Math.max(2, ...segments.map((s) => s.lane + 1));
          return (
            <div
              key={toISODate(week[0])}
              className="grid__week"
              role="row"
              style={{ gridTemplateRows: `32px repeat(${lanes}, 24px) 1fr` }}
            >
              {week.map((day, col) => {
                const iso = toISODate(day);
                const classes = ['grid__day'];
                if (day.getMonth() !== view.month) classes.push('is-outside');
                if (isWeekend(day)) classes.push('is-weekend');
                if (iso === todayISO) classes.push('is-today');
                return (
                  <div key={iso} role="gridcell" className={classes.join(' ')} style={{ gridColumn: col + 1 }}>
                    <span className="grid__num">{day.getDate()}</span>
                  </div>
                );
              })}
              {segments.map((s) => (
                <div
                  key={s.request.id}
                  className={`bar${s.startsHere ? ' bar--start' : ''}${s.endsHere ? ' bar--end' : ''}`}
                  style={{
                    gridColumn: `${s.startCol + 1} / span ${s.span}`,
                    gridRow: s.lane + 2,
                    '--person': personColor(s.request.name),
                  }}
                  title={`${s.request.name} · ${formatRange(s.request.start, s.request.end)}`}
                  data-testid="calendar-bar"
                >
                  <span className="bar__label">{s.request.name}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="agenda" aria-labelledby="agenda-title">
        <h3 id="agenda-title" className="agenda__title">Approved time off</h3>
        {groups.length === 0 ? (
          <p className="agenda__empty">Approved time off shows here</p>
        ) : (
          groups.map((g) => (
            <section key={g.key} className="agenda__group" aria-label={g.label} data-testid="month-group">
              <h4 className="agenda__month">{g.label}</h4>
              <ul className="agenda__list">
                {g.requests.map((r) => (
                  <li key={r.id} className="agenda__item">
                    <span className="request__dot" style={{ '--person': personColor(r.name) }} aria-hidden="true" />
                    <span className="agenda__name">{r.name}</span>
                    <span className="agenda__dates">{formatRange(r.start, r.end)}</span>
                    <span className="agenda__count">{pluralizeWeekdays(r.weekdays)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </section>
  );
}
