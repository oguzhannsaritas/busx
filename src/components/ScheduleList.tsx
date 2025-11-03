import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Clock, MapPin, Users } from "lucide-react"
import type { Schedule } from "@/types/schedules"
import { money } from "@/utils/i18nFormat"
import CustomDropdown from "@/components/CustomDropdown"

type Props = { items: Schedule[]; onSelect: (s: Schedule) => void }

export default function ScheduleList({ items, onSelect }: Props) {
    const { t } = useTranslation()

    type SortKey = "time-asc" | "time-desc" | "price-asc" | "price-desc" | "seat-desc" | "seat-asc"
    const [sort, setSort] = useState<SortKey>("time-asc")
    const [company, setCompany] = useState<string>("ALL")

    const companies = useMemo(
        () => ["ALL", ...Array.from(new Set(items.map((i) => i.company)))],
        [items]
    )

    const timeOf = (iso: string) => {
        const d = new Date(iso)
        return isNaN(d.getTime())
            ? iso.slice(11, 16) || iso
            : d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", hour12: false })
    }

    const seatsOf = (s: Schedule) =>
        (s as any).availableSeats ?? (s as any).emptySeats ?? (s as any).seats ?? 0

    const sortOptions = [
        { value: "time-asc", label: t("trips.sort.timeAsc") },
        { value: "time-desc", label: t("trips.sort.timeDesc") },
        { value: "price-asc", label: t("trips.sort.priceAsc") },
        { value: "price-desc", label: t("trips.sort.priceDesc") },
        { value: "seat-desc", label: t("trips.sort.seatDesc") },
        { value: "seat-asc", label: t("trips.sort.seatAsc") },
    ]

    const companyOptions = companies.map((c) => ({
        value: c,
        label: c === "ALL" ? t("trips.allCompanies") : c,
    }))

    const filtered = useMemo(() => {
        const base = company === "ALL" ? items : items.filter((i) => i.company === company)
        const toNum = (i: Schedule) => Number.parseInt(timeOf(i.departure).replace(":", ""), 10)
        return [...base].sort((a, b) => {
            switch (sort) {
                case "time-asc":
                    return toNum(a) - toNum(b)
                case "time-desc":
                    return toNum(b) - toNum(a)
                case "price-asc":
                    return a.price - b.price
                case "price-desc":
                    return b.price - a.price
                case "seat-desc":
                    return seatsOf(b) - seatsOf(a)
                case "seat-asc":
                    return seatsOf(a) - seatsOf(b)
            }
        })
    }, [items, sort, company])

    if (!items?.length) return <p role="status">{t("errors.notFound")}</p>

    return (
        <section className="mt-10">
            <div className="container mx-auto max-w-5xl px-4">
                <h2 className="text-3xl md:text-4xl font-bold">{t("trips.listTitle")}</h2>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label id="sort-label" className="block text-sm font-medium mb-2">
                            {t("trips.sequencing")}
                        </label>
                        <CustomDropdown
                            id="sort"
                            labelId="sort-label"
                            value={sort}
                            onChange={(v) => setSort(v as SortKey)}
                            options={sortOptions}
                            placeholder={t("trips.sequencing")}
                            size="sm"
                            className="w-56"
                        />
                    </div>

                    <div>
                        <label id="company-label" className="block text-sm font-medium mb-2">
                            {t("trips.filter")}
                        </label>
                        <CustomDropdown
                            id="company"
                            labelId="company-label"
                            value={company}
                            onChange={setCompany}
                            options={companyOptions}
                            placeholder={t("trips.filter")}
                            size="sm"
                            className="w-56"
                        />
                    </div>
                </div>

                <div className="mt-6 space-y-6">
                    {filtered.map((s) => {
                        const dep = timeOf(s.departure)
                        const arr = timeOf(s.arrival)
                        const seats = seatsOf(s)

                        return (
                            <article
                                key={s.id}
                                aria-label={`${s.company} ${dep}`}
                                className="rounded-2xl border bg-white shadow-sm p-6 md:p-8 relative
                           dark:bg-neutral-900 dark:border-neutral-800"
                            >
                                <div className="absolute right-6 top-6">
                                    <div className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-900 font-semibold
                                  dark:bg-neutral-800 dark:text-neutral-100">
                                        {money(s.price)}
                                    </div>
                                </div>

                                <h3 className="text-xl md:text-2xl font-semibold">{s.company}</h3>

                                <div className="mt-6 grid grid-cols-3 md:grid-cols-12 gap-6 items-center">
                                    <div className="col-span-3 md:col-span-3 flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-gray-500 mt-0.5 dark:text-white" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-white">{t("form.from")}</div>
                                            <div className="text-xl font-semibold tracking-wide">{dep}</div>
                                        </div>
                                    </div>

                                    <div className="col-span-3 md:col-span-3 flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5 dark:text-white" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-white">{t("form.to")}</div>
                                            <div className="text-xl font-semibold tracking-wide">{arr}</div>
                                        </div>
                                    </div>

                                    <div className="col-span-3 md:col-span-3 flex items-start gap-3">
                                        <Users className="h-5 w-5 text-gray-500 mt-0.5 dark:text-white" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-white">{t("trips.emptySeat")}</div>
                                            <div className="text-xl font-semibold tracking-wide">{seats}</div>
                                        </div>
                                    </div>

                                    <div className="col-span-3 md:col-span-12">
                                        <button
                                            onClick={() => onSelect(s)}
                                            aria-label={`${s.company} seferini seç`}
                                            className="w-full h-12 rounded-xl bg-black text-white font-medium hover:bg-black/90 transition
                                 dark:bg-white dark:text-black"
                                        >
                                            {t("trips.select")}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
