import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SeatMap from '../components/SeatMap'

const schemaCells = {
    tripId: 'TRIP-1001',
    layout: {
        rows: 2,
        cols: 3,
        cells: [
            [0, 2, 0],
            [1, 2, 0],
        ],
    },
    seats: [
        { no: 1, row: 1, col: 1, status: 'empty' },
        { no: 2, row: 1, col: 3, status: 'empty' },
        { no: 3, row: 2, col: 1, status: 'taken' },
        { no: 4, row: 2, col: 3, status: 'empty' },
    ],
    unitPrice: 100,
}

test('selects available seat (cells-driven)', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()

    render(<SeatMap schema={schemaCells as any} selected={[]} onToggle={onToggle} />)

    const [smGrid] = screen.getAllByRole('grid')

    const seat1 = within(smGrid).getByRole('gridcell', { name: /(Seat|Koltuk)\s*1\b/i })
    await user.click(seat1)
    expect(onToggle).toHaveBeenCalledWith(1)

    const seat3 = within(smGrid).getByRole('gridcell', { name: /(Seat|Koltuk)\s*3\b/i })
    await user.click(seat3)
    expect(onToggle).toHaveBeenCalledTimes(1)
})

test('enforces max 4 seat selection (parent-like state & rerender)', async () => {
    const user = userEvent.setup()
    const spy = vi.fn()

    const bigSchema = {
        tripId: 'TRIP-2001',
        layout: {
            rows: 2,
            cols: 5,
            cells: [
                [0, 0, 2, 0, 0],
                [0, 0, 2, 0, 0],
            ],
        },
        seats: [
            { no: 1, row: 1, col: 1, status: 'empty' },
            { no: 2, row: 1, col: 2, status: 'empty' },
            { no: 3, row: 1, col: 4, status: 'empty' },
            { no: 4, row: 1, col: 5, status: 'empty' },
            { no: 5, row: 2, col: 1, status: 'empty' },
            { no: 6, row: 2, col: 2, status: 'empty' },
            { no: 7, row: 2, col: 4, status: 'empty' },
            { no: 8, row: 2, col: 5, status: 'empty' },
        ],
        unitPrice: 100,
    }

    let selected: number[] = []
    const handleToggle = (no: number) => {
        if (selected.includes(no)) {
            selected = selected.filter(x => x !== no)
            spy(no)
            rerender(<SeatMap schema={bigSchema as any} selected={selected} onToggle={handleToggle} />)
            return
        }
        if (selected.length < 4) {
            selected = [...selected, no]
            spy(no)
            rerender(<SeatMap schema={bigSchema as any} selected={selected} onToggle={handleToggle} />)
            return
        }
    }

    const { rerender } = render(
        <SeatMap schema={bigSchema as any} selected={selected} onToggle={handleToggle} />
    )

    const [smGrid] = screen.getAllByRole('grid')
    const clickSeat = async (n: number) => {
        const re = new RegExp(`(Seat|Koltuk)\\s*${n}\\b`, 'i')
        await user.click(within(smGrid).getByRole('gridcell', { name: re }))
    }

    for (const n of [1, 2, 3, 4]) {
        await clickSeat(n)
    }
    expect(spy).toHaveBeenCalledTimes(4)

    const seat5 = within(smGrid).getByRole('gridcell', { name: /(Seat|Koltuk)\s*5\b/i })
    expect(seat5).toBeDisabled()
    await user.click(seat5)
    expect(spy).toHaveBeenCalledTimes(4)
})
