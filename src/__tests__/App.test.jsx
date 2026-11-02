import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';
import { loadRequests } from '../storage.js';

describe('App', () => {
  beforeEach(() => localStorage.clear());

  it('adds a request and approves it', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole('button', { name: 'Add request' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/name is required/i);

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace');
    await user.type(screen.getByLabelText('Start date'), '2027-03-01');
    await user.type(screen.getByLabelText('End date'), '2027-03-05');
    await user.type(screen.getByLabelText('Note (optional)'), 'Spring trip');
    await user.click(screen.getByRole('button', { name: 'Add request' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    const list = screen.getByRole('list', { name: 'Requests' });
    expect(within(list).getByText('Ada Lovelace')).toBeInTheDocument();
    expect(within(list).getByText('Pending')).toBeInTheDocument();
    expect(within(list).getByText(/5 weekdays/)).toBeInTheDocument();

    const calendar = screen.getByRole('region', { name: 'Calendar' });
    expect(within(calendar).queryByText('Ada Lovelace')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Approve Ada Lovelace' }));

    expect(within(list).getByText('Approved')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Approve Ada Lovelace' })).not.toBeInTheDocument();
    expect(within(calendar).getByRole('heading', { name: 'March 2027' })).toBeInTheDocument();
    expect(within(calendar).getByText('Ada Lovelace')).toBeInTheDocument();
    expect(loadRequests()[0]).toMatchObject({ name: 'Ada Lovelace', status: 'approved', weekdays: 5 });

    unmount();
    render(<App />);
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('shows an error and does not save when end date is before start date', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('Name'), 'Bob');
    await user.type(screen.getByLabelText('Start date'), '2027-03-10');
    await user.type(screen.getByLabelText('End date'), '2027-03-01');
    await user.click(screen.getByRole('button', { name: 'Add request' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/before start date/i);
    expect(loadRequests()).toEqual([]);
  });
});
