export type Seat = { no: number; row: number; col: number; status: 'empty' | 'taken' }
export type SeatSchema = {
    tripId: string
    layout: { rows: number; cols: number; cells?: number[][] }

    seats: Seat[]
    unitPrice: number
}
