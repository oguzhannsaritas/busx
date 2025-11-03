import { render, screen } from '@testing-library/react'
import PriceSummary from '@/components/PriceSummary'


const cur = (n: number) =>
    new RegExp(`(?:TRY(?:\\s|\\u00A0)?${n}|₺\\s*${n}|${n}(?:\\s|\\u00A0)?₺)`)

test('calculates total (currency tolerant)', () => {
    render(<PriceSummary unitPrice={100} seats={[1, 3]} />)


    const totalRow = screen.getByText(/Total|Toplam/i).closest('div')!
    expect(totalRow).toHaveTextContent(cur(200))


    const unitRow = screen.getByText(/Unit|Birim/i).closest('div')!
    expect(unitRow).toHaveTextContent(cur(100))
})
