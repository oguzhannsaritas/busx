import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchForm from '../components/SearchForm'


test('does not submit when required fields are empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
        <SearchForm
            onSubmit={onSubmit}
            defaultValues={{ from: '', to: '', date: '2025-11-30' }}
        />
    )

    expect(screen.getByLabelText(/Kalkış|From/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Varış|To/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Ara|Search/i }))
    expect(onSubmit).not.toHaveBeenCalled()
})

test('submits when form is valid (with defaultValues)', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
        <SearchForm
            onSubmit={onSubmit}
            defaultValues={{ from: 'ist-alibeykoy', to: 'ank-astim', date: '2025-11-30' }}
        />
    )

    await user.click(screen.getByRole('button', { name: /Ara|Search/i }))
    expect(onSubmit).toHaveBeenCalledTimes(1)

    const payload = onSubmit.mock.calls[0][0]
    expect(payload.from).toBe('ist-alibeykoy')
    expect(payload.to).toBe('ank-astim')
    expect(payload.date).toBe('2025-11-30')
})
