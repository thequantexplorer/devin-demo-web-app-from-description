import { useState } from 'react';
import { validateRequest } from '../requests.js';

const EMPTY = { name: '', start: '', end: '', note: '' };

export default function RequestForm({ onAdd }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  function update(field) {
    return (event) => {
      const value = event.target.value;
      setValues((v) => ({ ...v, [field]: value }));
      if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validateRequest(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onAdd(values);
    setValues(EMPTY);
    setErrors({});
  }

  function field(id, label, input) {
    const error = errors[id];
    return (
      <div className={`field${error ? ' field--invalid' : ''}`}>
        <label htmlFor={`req-${id}`}>{label}</label>
        {input}
        {error && (
          <p className="field__error" id={`req-${id}-error`} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  function inputProps(id) {
    return {
      id: `req-${id}`,
      value: values[id],
      onChange: update(id),
      'aria-invalid': errors[id] ? 'true' : undefined,
      'aria-describedby': errors[id] ? `req-${id}-error` : undefined,
    };
  }

  return (
    <form className="panel form" onSubmit={handleSubmit} noValidate aria-labelledby="form-title">
      <h2 id="form-title" className="panel__title">New request</h2>
      {field('name', 'Name', <input type="text" autoComplete="off" placeholder="Who’s taking time off?" {...inputProps('name')} />)}
      <div className="form__dates">
        {field('start', 'Start date', <input type="date" {...inputProps('start')} />)}
        {field('end', 'End date', <input type="date" min={values.start || undefined} {...inputProps('end')} />)}
      </div>
      {field(
        'note',
        <>
          Note <span className="optional">Optional</span>
        </>,
        <textarea rows={2} placeholder="Trip, appointment, family…" {...inputProps('note')} />,
      )}
      <button type="submit" className="btn btn--primary btn--block">
        Add request
      </button>
    </form>
  );
}
