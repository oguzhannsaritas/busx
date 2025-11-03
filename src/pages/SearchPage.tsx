import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import SearchForm, { type SearchFormValues } from "@/components/SearchForm"
import { useSchedules } from "@/hooks/useSchedules"
import ScheduleList from "@/components/ScheduleList"
import type { Schedule } from "@/types/schedules"

type Criteria = { from: string; to: string; date: string }

export default function SearchPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [criteria, setCriteria] = useState<Criteria | null>(null)
    const submitted = !!criteria

    useEffect(() => {
        sessionStorage.setItem("busx:step", "1")
        sessionStorage.removeItem("selectedSeats")
        sessionStorage.removeItem("busx:tripForSeats")
    }, [])

    const { data, loading } = useSchedules(
        criteria?.from, criteria?.to, criteria?.date, submitted
    )

    const onSubmit = (v: SearchFormValues) => {
        setCriteria({ from: v.from, to: v.to, date: v.date })
    }

    const onSelect = (s: Schedule) => {
        sessionStorage.setItem("selectedTrip", JSON.stringify(s))
        navigate("/seats")
    }

    const showResults = submitted && !loading

    return (
        <main className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-16"></h1>
            <SearchForm onSubmit={onSubmit} defaultValues={criteria ?? {}} loading={loading} />
            {showResults && (
                <div className="mt-8">
                    {data.length > 0 ? (
                        <>
                            <h2 className="text-xl font-semibold mb-3">{t("trips.title")}</h2>
                            <ScheduleList items={data} onSelect={onSelect} />
                        </>
                    ) : (
                        <p className="text-gray-600 dark:text-white">{t("errors.notFound")}</p>
                    )}
                </div>
            )}
        </main>
    )
}
