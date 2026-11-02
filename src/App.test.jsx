import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { loadRequests } from './storage.js';

async function fillForm(user, { name, start, end, note }) {
  if (name) await user.type(screen.getByLabelText('Name'), name);
  if (start) await user.type(screen.getByLabelText('Start date'), start);
  if (end) await user.type(screen.getByLabelText('End date'), end);
  if (note) await user.type(screen.getByLabelText('Note (optional)'), note);
  await user.click(screen.getByRole('button', { name: 'Add request' }));
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a request and approves it', async () => {
    const user = userEvent.setup();
    render(<App />);

    await fillForm(user, { name: 'Ana', start: '2027-03-01', end: '2027-03-05', note: 'Beach trip' });

    const item = screen.getByRole('listitem', { name: 'Request from Ana' });
    expect(within(item).getByText('Pending')).toBeInTheDocument();
    expect(item).toHaveTextContent('5 weekdays');
    expect(screen.getByText('No approved time off yet.')).toBeInTheDocument();

    await user.click(within(item).getByRole('button', { name: 'Approve' }));

    expect(within(item).getByText('Approved')).toBeInTheDocument();
    expect(within(item).queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument();
    const month = screen.getByRole('group', { name: 'March 2027' });
    expect(month).toHaveTextContent('Ana');
    expect(loadRequests()).toMatchObject([{ name: 'Ana', status: 'approved', weekdays: 5 }]);
  });

  it('shows an error and does not save an invalid request', async () => {
    const user = userEvent.setup();
    render(<App />);

    await fillForm(user, { name: 'Ben', start: '2027-03-10', end: '2027-03-01' });
    expect(screen.getByRole('alert')).toHaveTextContent('End date cannot be before start date.');

    await user.clear(screen.getByLabelText('Name'));
    await user.click(screen.getByRole('button', { name: 'Add request' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Name is required.');

    expect(screen.getByText('No requests yet.')).toBeInTheDocument();
    expect(loadRequests()).toEqual([]);
  });
});
