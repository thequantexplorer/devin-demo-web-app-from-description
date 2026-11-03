import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import App from './App.jsx'
import { STORAGE_KEY } from './lib/storage.js'

function fillForm({ name, start, end, note }) {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: name } })
  fireEvent.change(screen.getByLabelText('Start date'), { target: { value: start } })
  fireEvent.change(screen.getByLabelText('End date'), { target: { value: end } })
  if (note) fireEvent.change(screen.getByLabelText(/Note/), { target: { value: note } })
  fireEvent.click(screen.getByRole('button', { name: 'Add request' }))
}

describe('App', () => {
  beforeEach(() => localStorage.clear())

  it('adds a request as pending, approves it and shows it in the month list', () => {
    render(<App />)
    expect(screen.getByText('No requests yet')).toBeInTheDocument()

    fillForm({ name: 'Maya Chen', start: '2027-03-04', end: '2027-03-09', note: 'Lisbon' })

    const row = screen.getByTestId('request-row')
    expect(within(row).getByText('Maya Chen')).toBeInTheDocument()
    expect(within(row).getByText('Pending')).toBeInTheDocument()
    expect(row).toHaveTextContent('4 weekdays')

    fireEvent.click(within(row).getByRole('button', { name: 'Approve Maya Chen' }))

    expect(within(row).getByText('Approved')).toBeInTheDocument()
    expect(within(row).queryByRole('button', { name: /Approve/ })).not.toBeInTheDocument()

    const group = screen.getByTestId('month-group')
    expect(within(group).getByRole('heading', { name: 'March 2027' })).toBeInTheDocument()
    expect(group).toHaveTextContent('Maya Chen')

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(saved).toHaveLength(1)
    expect(saved[0]).toMatchObject({ name: 'Maya Chen', status: 'approved' })
  })

  it('shows errors and does not save an invalid request', () => {
    render(<App />)
    fillForm({ name: '', start: '2027-03-10', end: '2027-03-01' })

    expect(screen.getByText('Enter the person’s name.')).toBeInTheDocument()
    expect(screen.getByText('Ends before the start date.')).toBeInTheDocument()
    expect(screen.getByText('No requests yet')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([])
  })

  it('keeps denied requests out of the month list', () => {
    render(<App />)
    fillForm({ name: 'Sam', start: '2027-03-01', end: '2027-03-02' })
    fireEvent.click(screen.getByRole('button', { name: 'Deny Sam' }))

    expect(screen.getByText('Denied')).toBeInTheDocument()
    expect(screen.queryByTestId('month-group')).not.toBeInTheDocument()
  })
})
