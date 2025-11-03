import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSeatSchema } from '@/hooks/useSeatSchema'
import PassengerForm, { type PassengerFormValues } from '@/components/PassengerForm'
import PriceSummary from '@/components/PriceSummary'
import type { Schedule } from '@/types/schedules'
import { lsSet } from "@/utils/storage"

const FORM_KEY = 'busx:form'

export default function SummaryPage() {
    const navigate = useNavigate()

    useEffect(() => {
        sessionStorage.setItem('busx:step', '3')
    }, [])

    const selectedTrip: Schedule | null = useMemo(() => {
        const raw = sessionStorage.getItem('selectedTrip')
        return raw ? JSON.parse(raw) : null
    }, [])

    const seats: number[] = useMemo(() => {
        const raw = sessionStorage.getItem('selectedSeats')
        try { return raw ? JSON.parse(raw) : [] } catch { return [] }
    }, [])

    useEffect(() => {
        if (!selectedTrip || seats.length === 0) navigate('/', { replace: true })
    }, [selectedTrip, seats.length, navigate])

    if (!selectedTrip || seats.length === 0) return null

    const { data: schema, loading } = useSeatSchema(selectedTrip.id)
    if (loading || !schema) return <p role="status">Loading summary...</p>

    const onSubmit = (v: PassengerFormValues) => {
        lsSet(FORM_KEY, v)
        navigate('/reservation-summary', { state: { form: v } })
    }

    return (
        <main className="max-w-6xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <section className="md:col-span-2 self-start">
                    <PassengerForm seats={seats} onSubmit={onSubmit} />
                </section>
                <aside className="self-start md:sticky md:top-[12.5rem]">
                    <PriceSummary unitPrice={schema.unitPrice} seats={seats} />
                </aside>
            </div>
        </main>
    )
}
