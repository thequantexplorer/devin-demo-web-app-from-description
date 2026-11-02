import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { STORAGE_KEY } from './storage.js';

function fillDates(start, end) {
  fireEvent.change(screen.getByLabelText('Start date'), { target: { value: start } });
  fireEvent.change(screen.getByLabelText('End date'), { target: { value: end } });
}

describe('App', () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it('adds a request as Pending and approves it', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText('No requests yet')).toBeInTheDocument();
    expect(screen.getByText('Approved time off shows here')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace');
    fillDates('2027-03-01', '2027-03-05');
    await user.type(screen.getByLabelText(/Note/), 'Spring break');
    await user.click(screen.getByRole('button', { name: 'Add request' }));

    const row = screen.getByTestId('request');
    expect(within(row).getByText('Ada Lovelace')).toBeInTheDocument();
    expect(within(row).getByText('Pending')).toBeInTheDocument();
    expect(within(row).getByText(/5 weekdays/)).toBeInTheDocument();

    await user.click(within(row).getByRole('button', { name: 'Approve Ada Lovelace' }));

    expect(within(row).getByText('Approved')).toBeInTheDocument();
    expect(within(row).queryByRole('button', { name: /Approve/ })).not.toBeInTheDocument();
    const group = screen.getByRole('region', { name: 'March 2027' });
    expect(within(group).getByText('Ada Lovelace')).toBeInTheDocument();

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ name: 'Ada Lovelace', status: 'approved', weekdays: 5 });
  });

  it('shows errors and does not save an invalid request', async () => {
    const user = userEvent.setup();
    render(<App />);
    fillDates('2027-03-05', '2027-03-01');
    await user.click(screen.getByRole('button', { name: 'Add request' }));

    expect(screen.getByText('Enter a name.')).toBeInTheDocument();
    expect(screen.getByText('End date can’t be before the start date.')).toBeInTheDocument();
    expect(screen.queryByTestId('request')).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([]);
  });

  it('keeps denied requests out of the calendar and restores data after a reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await user.type(screen.getByLabelText('Name'), 'Lin');
    fillDates('2027-04-05', '2027-04-06');
    await user.click(screen.getByRole('button', { name: 'Add request' }));
    await user.click(screen.getByRole('button', { name: 'Deny Lin' }));
    expect(screen.getByText('Denied')).toBeInTheDocument();
    expect(screen.queryByTestId('month-group')).not.toBeInTheDocument();

    unmount();
    render(<App />);
    expect(screen.getByText('Lin')).toBeInTheDocument();
    expect(screen.getByText('Denied')).toBeInTheDocument();
  });
});
