import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ReservationSummary from '@/components/ReservationSummary'
import type { Passenger, Contact } from '@/components/PassengerForm'
import type { PassengerFormValues } from '@/components/PassengerForm'
import type { Schedule } from '@/types/schedules'
import { useSeatSchema } from '@/hooks/useSeatSchema'
import { apiPost } from '@/services/apiClient'
import { lsGet, lsDel } from "@/utils/storage"

type Trip = { company: string; dateISO: string; depart: string; arrival: string; price: number }
const FORM_KEY = 'busx:form'

export default function ReservationSummaryPage() {
    const navigate = useNavigate()

    useEffect(() => {
        sessionStorage.setItem('busx:step', '4')
    }, [])

    const selectedTrip: Schedule | null = useMemo(() => {
        const raw = sessionStorage.getItem('selectedTrip')
        return raw ? JSON.parse(raw) : null
    }, [])

    const seats: number[] = useMemo(() => {
        const raw = sessionStorage.getItem('selectedSeats')
        try { return raw ? JSON.parse(raw) : [] } catch { return [] }
    }, [])

    const form = lsGet<PassengerFormValues>(FORM_KEY, null)

    useEffect(() => {
        if (!selectedTrip || seats.length === 0 || !form) navigate('/', { replace: true })
    }, [selectedTrip, seats.length, form, navigate])

    if (!selectedTrip || seats.length === 0 || !form) return null

    const { data: schema, loading: schemaLoading } = useSeatSchema(selectedTrip.id)
    if (schemaLoading || !schema) return <p role="status">Loading summary...</p>

    const trip: Trip = {
        company: selectedTrip.company,
        dateISO: selectedTrip.departure,
        depart: new Date(selectedTrip.departure).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        arrival: new Date(selectedTrip.arrival).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        price: schema.unitPrice,
    }

    const handleBack = () => navigate('/summary')

    const handlePay = async () => {
        const payload = { tripId: selectedTrip.id, seats, contact: form.contact, passengers: form.passengers }
        const res = await apiPost<{ ok: boolean; pnr?: string; message?: string }>('/tickets/sell', payload)
        if (res.ok && res.pnr) {
            sessionStorage.setItem('lastPNR', res.pnr)
            lsDel(FORM_KEY)
            navigate('/payment-success', { state: { pnr: res.pnr }, replace: true })
        } else {
            alert(res.message || 'Payment could not be completed.')
        }
    }

    return (
        <ReservationSummary
            trip={trip}
            passengers={form.passengers as Passenger[]}
            contact={form.contact as Contact}
            onBack={handleBack}
            onPay={() => handlePay()}
        />
    )
}
