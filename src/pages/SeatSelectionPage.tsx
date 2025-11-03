import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useSeatSchema } from "@/hooks/useSeatSchema"
import SeatMap from "@/components/SeatMap"
import type { Schedule } from "@/types/schedules"
import { currentLocale, money } from "@/utils/i18nFormat"

export default function SeatSelectionPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const selectedTrip: Schedule | null = useMemo(() => {
        const raw = sessionStorage.getItem("selectedTrip")
        return raw ? JSON.parse(raw) : null
    }, [])

    useEffect(() => {
        if (!selectedTrip) navigate("/", { replace: true })
    }, [selectedTrip, navigate])

    const tripId = selectedTrip?.id
    const { data: schema, loading } = useSeatSchema(tripId)

    const initialSelected = useMemo<number[]>(() => {
        try {
            const prevStep = sessionStorage.getItem("busx:step")
            const tripForSeats = sessionStorage.getItem("busx:tripForSeats")
            if (prevStep === "3" && tripForSeats && tripForSeats === selectedTrip?.id) {
                const raw = sessionStorage.getItem("selectedSeats")
                const arr = raw ? JSON.parse(raw) : []
                return Array.isArray(arr) ? arr : []
            }
        } catch {}
        return []
    }, [selectedTrip?.id])

    const [selected, setSelected] = useState<number[]>(initialSelected)


    useEffect(() => {
        sessionStorage.setItem("busx:step", "2")
    }, [])

    if (!selectedTrip) return null
    if (loading || !schema)
        return <p role="status">{t("seats.loading")}</p>

    const toggle = (no: number) => {
        setSelected(prev => (prev.includes(no) ? prev.filter(x => x !== no) : [...prev, no]))
    }

    const goSummary = () => {
        sessionStorage.setItem("selectedSeats", JSON.stringify(selected))
        sessionStorage.setItem("busx:tripForSeats", selectedTrip.id || "")
        navigate("/summary")
    }

    const fmtTime = (iso?: string) =>
        iso
            ? new Date(iso).toLocaleTimeString(currentLocale(), { hour: "2-digit", minute: "2-digit", hour12: false })
            : "--:--"

    const fmtDate = (iso?: string) => {
        if (!iso) return ""
        const dt = new Date(iso)
        return isNaN(dt.getTime())
            ? iso
            : dt.toLocaleDateString(currentLocale(), { day: "numeric", month: "long", year: "numeric" })
    }

    return (
        <main className="max-w-5xl mx-auto p-4">
            <div className="mb-6 rounded-2xl border bg-white shadow-sm px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row items-start md:items-start justify-between gap-4 md:gap-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight dark:text-black">{selectedTrip.company}</h1>
                    <p className="mt-1 text-gray-600 dark:text-black">{fmtDate(selectedTrip.departure)}</p>
                </div>

                <div className="flex gap-4 sm:gap-6 md:gap-12 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-left md:text-right">
                        <div className="text-xs text-gray-500 dark:text-black">{t("trip.depart")}</div>
                        <div className="text-xl md:text-2xl font-bold dark:text-black">{fmtTime(selectedTrip.departure)}</div>
                    </div>
                    <div className="text-left md:text-right">
                        <div className="text-xs text-gray-500 dark:text-black">{t("trip.arrival")}</div>
                        <div className="text-xl md:text-2xl font-bold dark:text-black">{fmtTime(selectedTrip.arrival)}</div>
                    </div>
                    <div className="text-left md:text-right dark:text-black">
                        <div className="text-xs text-gray-500 dark:text-black">{t("price.label")}</div>
                        <div className="text-xl md:text-2xl font-bold">{money(selectedTrip.price)}</div>
                    </div>
                </div>
            </div>

            <SeatMap schema={schema} selected={selected} onToggle={toggle} />

            <div className=" flex items-center justify-end">
                <button
                    className="px-4 py-2 rounded bg-black text-white disabled:opacity-50 dark:bg-white dark:text-black"
                    disabled={selected.length === 0}
                    onClick={goSummary}
                >
                    {t("actions.continue")}
                </button>
            </div>
        </main>
    )
}
