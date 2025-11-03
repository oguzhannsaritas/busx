export type Agency = { id: string; name: string }

export type Schedule = {
    id: string
    company: string
    from: string
    to: string
    departure: string
    arrival: string
    price: number
    availableSeats: number
}