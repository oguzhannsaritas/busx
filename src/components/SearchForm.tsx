import { useMemo, useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { apiGet } from "@/services/apiClient"
import type { Agency } from "@/types/schedules"
import CustomDropdown from "@/components/CustomDropdown"
import { MapPin, Calendar, ChevronDown, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react"

const schema = z.object({
    from: z.string().min(2, "validation.fromMin"),
    to: z.string().min(2, "validation.toMin"),
    date: z.string().min(1, "validation.dateRequired"),
}).refine(d => d.from !== d.to, {
    path: ["to"],
    message: "validation.info",
})
export type SearchFormValues = z.infer<typeof schema>

type Props = {
    defaultValues?: Partial<SearchFormValues>
    onSubmit: (v: SearchFormValues) => void
    loading?: boolean
}


const ymd = (y: number, m0: number, d: number) =>
    `${y}-${String(m0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
const ymdNum = (s: string) => Number(s.replace(/-/g, ""))
const formatDateLocal = (dateStr: string) => {
    if (!dateStr) return ""
    const [yyyy, mm, dd] = dateStr.split("-")
    return `${dd}.${mm}.${yyyy}`
}

function CustomDatePicker({
                              id,
                              labelId,
                              value,
                              onChange,
                              minDate,
                              disabled,
                              error,
                          }: {
    id?: string
    labelId?: string
    value: string
    onChange: (value: string) => void
    minDate: string
    disabled?: boolean
    error?: string
}) {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()
        return { daysInMonth, startingDayOfWeek, year, month }
    }

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)

    const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
    const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

    const handleDayClick = (day: number) => {
        const dateStr = ymd(year, month, day)
        if (ymdNum(dateStr) >= ymdNum(minDate)) {
            onChange(dateStr)
            setIsOpen(false)
        }
    }

    const isDateDisabled = (day: number) => {
        const dateStr = ymd(year, month, day)
        return ymdNum(dateStr) < ymdNum(minDate)
    }

    const isDateSelected = (day: number) => {
        if (!value) return false
        return value === ymd(year, month, day)
    }

    const monthNames = [
        t("monthNames.january"),
        t("monthNames.february"),
        t("monthNames.march"),
        t("monthNames.april"),
        t("monthNames.may"),
        t("monthNames.june"),
        t("monthNames.july"),
        t("monthNames.august"),
        t("monthNames.september"),
        t("monthNames.october"),
        t("monthNames.november"),
        t("monthNames.december"),
    ]
    const dayNames = [
        t("dayNames.sun"),
        t("dayNames.mon"),
        t("dayNames.tue"),
        t("dayNames.wed"),
        t("dayNames.thu"),
        t("dayNames.fri"),
        t("dayNames.sat"),
    ]

    const listboxId = id ? `${id}-calendar` : undefined

    return (
        <div ref={dropdownRef} className="relative">
            <button
                id={id}
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                aria-labelledby={labelId}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
                aria-invalid={!!error || undefined}
                className={`w-full h-12 rounded-xl border ${error ? "border-red-500" : "border-gray-200"
                } bg-white pr-10 pl-10 text-sm text-left transition-all duration-200 focus:outline-none focus:ring-0 focus:ring-gray-900 focus:border-gray-900 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed ${value ? "text-gray-900" : "text-gray-500"}`}
            >
                {value ? formatDateLocal(value) : "gg.aa.yyyy"}
            </button>
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <ChevronDown
                className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-4" role="listbox" id={listboxId} aria-labelledby={labelId}>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="p-1 rounded-lg bg-black transition-colors"
                                aria-label={t("actions.prev") as string}
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-200" />
                            </button>
                            <span className="text-sm font-semibold text-black">
                                {monthNames[month]} {year}
                            </span>
                            <button
                                type="button"
                                onClick={handleNextMonth}
                                className="p-1 rounded-lg bg-black transition-colors"
                                aria-label={t("actions.next") as string}
                            >
                                <ChevronRight className="h-5 w-5 text-gray-200" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2" aria-hidden="true">
                            {dayNames.map((day) => (
                                <div key={day} className="text-center text-xs font-medium text-black py-1">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                                <div key={`empty-${i}`} aria-hidden="true" />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1
                                const disabledBtn = isDateDisabled(day)
                                const selected = isDateSelected(day)
                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDayClick(day)}
                                        disabled={disabledBtn}
                                        role="option"
                                        aria-selected={selected}
                                        className={`aspect-square rounded-lg text-sm transition-all duration-150 ${selected
                                            ? "bg-black text-white font-semibold"
                                            : disabledBtn
                                                ? "text-gray-300 cursor-not-allowed"
                                                : "text-black hover:bg-black hover:text-white"
                                        }`}
                                    >
                                        {day}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function SearchForm({ defaultValues, onSubmit, loading }: Props) {
    const { t } = useTranslation()
    const {
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<SearchFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { from: "", to: "", date: "", ...defaultValues },
    })

    const [agencies, setAgencies] = useState<Agency[]>([])
    useEffect(() => {
        apiGet<Agency[]>("/reference/agencies")
            .then(setAgencies)
            .catch(() => setAgencies([]))
    }, [])

    const today = useMemo(() => {
        const d = new Date()
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const dd = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${dd}`
    }, [])

    const fromValue = watch("from")
    const toValue = watch("to")
    const dateValue = watch("date")

    const labelBase = "block mb-2 text-sm font-semibold text-gray-800 dark:text-white"
    const hintBase = "mt-1.5 text-xs text-red-600 font-medium"

    return (
        <section className="dark:bg-gradient-to-t rounded-2xl from-gray-100 to-gray-50 dark:from-neutral-900 ">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-center pt-12 md:pt-16 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 text-balance dark:text-white">
                    {t("home.searchTitle")}
                </h1>
                <p className="mt-3 text-center text-base md:text-lg text-gray-600 max-w-2xl mx-auto text-pretty dark:text-white">
                    {t("home.subtitle")}
                </p>

                <div className="mt-10 rounded-2xl border-2 border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="p-6 md:p-8 lg:p-10">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end"
                            noValidate
                        >
                            <div className="md:col-span-4">
                                <label id="from-label" htmlFor="from" className={labelBase}>
                                    {t("form.from")}
                                </label>
                                <CustomDropdown<Agency>
                                    id="from"
                                    labelId="from-label"
                                    value={fromValue}
                                    onChange={(val) => setValue("from", val)}
                                    options={agencies}
                                    getOptionValue={(a) => a.id}
                                    getOptionLabel={(a) => a.name}
                                    placeholder={t("form.fromPlaceholder")}
                                    disabled={loading}
                                    error={!!errors.from}
                                    leadingIcon={<MapPin className="h-5 w-5 text-gray-400" />}
                                />
                                {errors.from && <span data-testid="error-from" className={hintBase}>{t(errors.from.message as any)}</span>}
                            </div>

                            <div className="md:col-span-4">
                                <label id="to-label" htmlFor="to" className={labelBase}>
                                    {t("form.to")}
                                </label>
                                <CustomDropdown<Agency>
                                    id="to"
                                    labelId="to-label"
                                    value={toValue}
                                    onChange={(val) => setValue("to", val)}
                                    options={agencies}
                                    getOptionValue={(a) => a.id}
                                    getOptionLabel={(a) => a.name}
                                    placeholder={t("form.toPlaceholder")}
                                    disabled={loading}
                                    error={!!errors.to}
                                    leadingIcon={<MapPin className="h-5 w-5 text-gray-400" />}
                                />
                                {errors.to && <span data-testid="error-to" className={hintBase}>{t(errors.to.message as any)}</span>}
                            </div>

                            <div className="md:col-span-4">
                                <label id="date-label" htmlFor="date" className={labelBase}>
                                    {t("form.date")}
                                </label>
                                <CustomDatePicker
                                    id="date"
                                    labelId="date-label"
                                    value={dateValue}
                                    onChange={(val) => setValue("date", val)}
                                    minDate={today}
                                    disabled={loading}
                                    error={errors.date?.message}
                                />
                                {errors.date && <span data-testid="error-date" className={hintBase}>{t(errors.date.message as any)}</span>}
                            </div>

                            <div className="md:col-span-12 lg:col-span-12 flex justify-center md:justify-start">
                                <button
                                    data-testid="search-submit"
                                    type="submit"
                                    disabled={loading}
                                    aria-busy={loading}
                                    className="w-full md:w-auto md:min-w-[200px] inline-flex items-center justify-center gap-2 rounded-xl dark:bg-white dark:text-black bg-gray-900 text-white px-8 py-3 text-sm font-semibold shadow-md hover:bg-gray-800 hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                                    {t("form.submit")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
