import { useState } from 'react'
import { countWeekdays, validateRequest } from '../lib/dates.js'

const EMPTY = { name: '', start: '', end: '', note: '' }

function FieldError({ field, message }) {
  if (!message) return null
  return (
    <p className="field-error" id={`error-${field}`} role="alert">
      {message}
    </p>
  )
}

export default function RequestForm({ onAdd }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const weekdays = countWeekdays(values.start, values.end)

  function update(field) {
    return (event) => {
      const next = { ...values, [field]: event.target.value }
      setValues(next)
      if (submitted) setErrors(validateRequest(next))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const found = validateRequest(values)
    setErrors(found)
    setSubmitted(true)
    if (Object.keys(found).length > 0) return
    onAdd(values)
    setValues(EMPTY)
    setErrors({})
    setSubmitted(false)
  }

  function fieldProps(field) {
    return {
      id: `field-${field}`,
      name: field,
      value: values[field],
      onChange: update(field),
      'aria-invalid': errors[field] ? true : undefined,
      'aria-describedby': errors[field] ? `error-${field}` : undefined,
    }
  }

  return (
    <form className="panel form" onSubmit={handleSubmit} noValidate aria-labelledby="form-title">
      <h2 id="form-title" className="panel-title">New request</h2>

      <div className="field">
        <label htmlFor="field-name">Name</label>
        <input type="text" autoComplete="off" placeholder="e.g. Maya Chen" {...fieldProps('name')} />
        <FieldError field="name" message={errors.name} />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="field-start">Start date</label>
          <input type="date" {...fieldProps('start')} />
          <FieldError field="start" message={errors.start} />
        </div>
        <div className="field">
          <label htmlFor="field-end">End date</label>
          <input type="date" min={values.start || undefined} {...fieldProps('end')} />
          <FieldError field="end" message={errors.end} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="field-note">
          Note <span className="optional">Optional</span>
        </label>
        <textarea rows={2} placeholder="Anything the team should know" {...fieldProps('note')} />
      </div>

      <div className="form-footer">
        <span className="subtle tabular" aria-live="polite">
          {weekdays > 0 ? `${weekdays} weekday${weekdays === 1 ? '' : 's'}` : ''}
        </span>
        <button type="submit" className="btn btn-primary">Add request</button>
      </div>
    </form>
  )
}
