import { useMemo } from "react"
import type { SeatSchema } from "@/types/seats"
import { useTranslation } from "react-i18next"
import { Armchair, DoorOpen, X } from "lucide-react"

type Props = {
    schema: SeatSchema
    selected: number[]
    onToggle: (no: number) => void
}

const MAX_SELECT = 4

type SeatLike = { no: number; row: number; col: number; status: "empty" | "taken" }

export default function SeatMap({ schema, selected, onToggle }: Props) {
    const { t } = useTranslation()

    const rows = schema.layout.rows
    const cols = schema.layout.cols
    const cells: number[][] | undefined = (schema as any)?.layout?.cells

    const PRICE = schema.unitPrice ?? 0
    const total = selected.length * PRICE
    const reachedMax = selected.length >= MAX_SELECT

    const colTemplate   = `repeat(${cols}, 2rem)`
    const colTemplateMd = `repeat(${cols}, 2.75rem)`
    const rowTemplate   = `repeat(${rows}, 2rem)`
    const rowTemplateMd = `repeat(${rows}, 2.75rem)`

    const noByRowCol = useMemo(() => {
        const m = new Map<string, number>()
        for (const s of schema.seats) m.set(`${s.row}:${s.col}`, s.no)
        return m
    }, [schema.seats])

    const doorPos = useMemo(() => {
        if (!cells) return null
        let hasDoor = false
        for (let r = 0; r < cells.length; r++) {
            if (cells[r]?.some(v => v === 3)) { hasDoor = true; break }
        }
        if (hasDoor) return null
        for (let r = 0; r < cells.length; r++) {
            const row = cells[r] || []
            for (let c = 0; c < row.length; c++) {
                if (row[c] === 2) return { r: r + 1, c: c + 1 }
            }
        }
        return null
    }, [cells])

    const derivedSeats: SeatLike[] = useMemo(() => {
        let seq = 0
        const out: SeatLike[] = []

        for (let r = 1; r <= rows; r++) {
            for (let c = 1; c <= cols; c++) {
                const code = cells?.[r - 1]?.[c - 1]

                const inferred =
                    code !== undefined
                        ? code
                        : (noByRowCol.has(`${r}:${c}`) ? 0 : 2)

                if (inferred === 2 || inferred === 3) continue
                const status: "empty" | "taken" = inferred === 1 ? "taken" : "empty"
                const no = noByRowCol.get(`${r}:${c}`) ?? (++seq)
                out.push({ no, row: r, col: c, status })
            }
        }
        return out
    }, [cells, rows, cols, noByRowCol])

    const byRowCol = useMemo(() => {
        const m = new Map<string, SeatLike>()
        for (const s of derivedSeats) m.set(`${s.row}:${s.col}`, s)
        return m
    }, [derivedSeats])

    const byNo = useMemo(() => {
        const m = new Map<number, SeatLike>()
        for (const s of derivedSeats) m.set(s.no, s)
        return m
    }, [derivedSeats])

    const suggestedSeats = useMemo(() => {
        if (selected.length === 0 || selected.length >= MAX_SELECT) return []

        const selectedSeats = selected
            .map(no => byNo.get(no))
            .filter(Boolean) as SeatLike[]

        const groups = new Map<number, number[]>()
        for (const s of selectedSeats) {
            if (!groups.has(s.row)) groups.set(s.row, [])
            groups.get(s.row)!.push(s.col)
        }

        type Cand = { no: number; row: number; col: number; score: number }
        const cands: Cand[] = []

        for (const [row, colsArr] of groups) {
            const colsSorted = [...colsArr].sort((a, b) => a - b)
            let start = 0
            for (let i = 1; i <= colsSorted.length; i++) {
                const isBreak = i === colsSorted.length || colsSorted[i] !== colsSorted[i - 1] + 1
                if (isBreak) {
                    const run = colsSorted.slice(start, i)
                    const runLen = run.length
                    const leftCol  = run[0] - 1
                    const rightCol = run[run.length - 1] + 1

                    const leftSeat = byRowCol.get(`${row}:${leftCol}`)
                    if (leftSeat && leftSeat.status === "empty" && !selected.includes(leftSeat.no)) {
                        cands.push({ no: leftSeat.no, row, col: leftCol, score: 100 + runLen })
                    }

                    const rightSeat = byRowCol.get(`${row}:${rightCol}`)
                    if (rightSeat && rightSeat.status === "empty" && !selected.includes(rightSeat.no)) {
                        cands.push({ no: rightSeat.no, row, col: rightCol, score: 100 + runLen })
                    }

                    start = i
                }
            }
        }

        if (cands.length === 0) {
            for (const s of selectedSeats) {
                for (const dc of [-1, 1]) {
                    const nCol = s.col + dc
                    const neigh = byRowCol.get(`${s.row}:${nCol}`)
                    if (neigh && neigh.status === "empty" && !selected.includes(neigh.no)) {
                        cands.push({ no: neigh.no, row: neigh.row, col: neigh.col, score: 50 })
                    }
                }
            }
        }

        const uniq = new Map<number, Cand>()
        for (const c of cands) if (!uniq.has(c.no)) uniq.set(c.no, c)
        const sorted = Array.from(uniq.values()).sort(
            (a, b) => (b.score - a.score) || (a.row - b.row) || (a.col - b.col)
        )

        const remain = Math.max(0, MAX_SELECT - selected.length)
        return sorted.slice(0, remain).map(c => c.no)
    }, [byNo, byRowCol, selected])

    const renderGrid = (size: "sm" | "md") => {
        const isSm = size === "sm"
        const gridCls = isSm ? "mx-auto grid w-fit gap-5 md:gap-2 md:hidden" : "mx-auto hidden md:grid w-fit gap-2"
        const style = isSm
            ? { gridTemplateColumns: colTemplate,   gridTemplateRows: rowTemplate }
            : { gridTemplateColumns: colTemplateMd, gridTemplateRows: rowTemplateMd }

        const items: React.ReactNode[] = []

        for (let r = 1; r <= rows; r++) {
            for (let c = 1; c <= cols; c++) {
                const code = cells?.[r - 1]?.[c - 1]
                const inferred =
                    code !== undefined
                        ? code
                        : (byRowCol.has(`${r}:${c}`) ? 0 : 2)

                if (inferred === 2) {
                    const isDoorFallback = doorPos && doorPos.r === r && doorPos.c === c
                    items.push(
                        <div
                            key={`aisle-${r}-${c}`}
                            aria-hidden
                            className={
                                (isSm
                                    ? "h-12 w-12"
                                    : "h-11 w-11") +
                                " grid place-items-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400"
                            }
                            title={isDoorFallback ? (t("seats.door") as string) : undefined}
                        >
                            {isDoorFallback && <DoorOpen className="h-4 w-4" />}
                        </div>
                    )
                    continue
                }

                if (inferred === 3) {
                    items.push(
                        <div
                            key={`door-${r}-${c}`}
                            aria-hidden
                            className={
                                (isSm
                                    ? "h-12 w-12"
                                    : "h-11 w-11") +
                                " grid place-items-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400"
                            }
                            title={t("seats.door") as string}
                        >
                            <DoorOpen className="h-4 w-4" />
                        </div>
                    )
                    continue
                }

                const seat = byRowCol.get(`${r}:${c}`)
                if (!seat) {
                    items.push(
                        <div
                            key={`blank-${r}-${c}`}
                            aria-hidden
                            className={(isSm ? "h-12 w-12" : "h-11 w-11") + " rounded-lg border-2 border-dashed border-gray-300"}
                        />
                    )
                    continue
                }

                const isSuggested = seat.status === "empty" && suggestedSeats.includes(seat.no)
                items.push(
                    renderSeatButton({
                        seat,
                        selected,
                        onToggle,
                        t,
                        size,
                        reachedMax,
                        suggested: isSuggested
                    })
                )
            }
        }

        return (
            <div className={gridCls} style={style} role="grid">
                {items}
            </div>
        )
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] mb-4">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm
                      dark:border-white/10 dark:bg-neutral-900">
                <div className="px-3 pt-3 pb-3 md:px-5 md:pt-5 md:pb-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                            {t("seats.title")}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 md:gap-5">
                            <Legend swatch="bg-white border border-gray-300" label={t("seats.available")} />
                            <Legend swatch="bg-gray-200 border border-gray-200 dark:bg-neutral-800" label={t("seats.unavailable")} />
                            <Legend swatch="bg-black border border-black dark:border-white" label={t("seats.selected")} />
                        </div>
                    </div>
                </div>

                <div className="px-3 pb-3 md:px-5 md:pb-5">
                    <div className="rounded-xl border border-gray-100 dark:bg-white bg-gray-50/40 py-4 md:py-6">
                        {!cells && (
                            <>
                                <div
                                    className="mx-auto grid w-fit gap-2 mb-3 md:hidden"
                                    style={{ gridTemplateColumns: colTemplate }}
                                    aria-hidden
                                >
                                    {Array.from({ length: cols }).map((_, i) => (
                                        <div
                                            key={`dash-sm-${i}`}
                                            className="h-12 w-12 grid place-items-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400"
                                        >
                                            <DoorOpen className="h-4 w-4" />
                                        </div>
                                    ))}
                                </div>

                                <div
                                    className="mx-auto hidden md:grid w-fit gap-2 mb-3"
                                    style={{ gridTemplateColumns: colTemplateMd }}
                                    aria-hidden
                                >
                                    {Array.from({ length: cols }).map((_, i) => (
                                        <div
                                            key={`dash-md-${i}`}
                                            className="h-11 w-11 grid place-items-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400"
                                        >
                                            <DoorOpen className="h-4 w-4" />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {renderGrid("sm")}
                        {renderGrid("md")}
                    </div>
                </div>
            </div>

            <aside className="rounded-lg border border-gray-200 dark:text-black bg-white shadow-sm p-4 md:p-5 h-fit">
                <h3 className="text-sm font-semibold mb-3 ">{t("seats.selectedSeats")}</h3>

                {selected.length === 0 ? (
                    <p className="text-sm text-gray-600">{t("seats.emptyState")}</p>
                ) : (
                    <div className="space-y-2">
                        {selected.map((no) => (
                            <div key={no} className="flex items-center justify-between rounded-lg border bg-gray-50 px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <Armchair className="h-4 w-4 text-gray-700" />
                                    <span className="text-sm">{t("seats.item")} {no}</span>
                                </div>
                                <button
                                    className="p-1 rounded hover:bg-gray-200"
                                    aria-label={t("actions.remove")}
                                    onClick={() => onToggle(no)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {reachedMax && (
                    <p className="mt-3 text-xs text-red-500">
                        {t("seats.maxLimit")}
                    </p>
                )}

                <hr className="my-4" />
                {selected.length > 0 && (
                    <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                        <span>{selected.length} × ₺{PRICE.toLocaleString("tr-TR")}</span>
                        <span>₺{(selected.length * PRICE).toLocaleString("tr-TR")}</span>
                    </div>
                )}

                <div className="flex items-center justify-between font-semibold">
                    <span>{t("cart.total")}</span>
                    <span>₺{total.toLocaleString("tr-TR")}</span>
                </div>
            </aside>
        </div>
    )
}

function renderSeatButton({
                              seat,
                              selected,
                              onToggle,
                              t,
                              size,
                              reachedMax,
                              suggested
                          }: {
    seat: SeatLike
    selected: number[]
    onToggle: (no: number) => void
    t: (k: string, opts?: any) => string
    size: "sm" | "md"
    reachedMax: boolean
    suggested: boolean
}) {
    const isSelected  = selected.includes(seat.no)
    const isAvailable = seat.status === "empty"
    const canClick = isAvailable && (isSelected || !reachedMax)

    const base = [
        "group grid place-items-center rounded-lg border transition",
        "focus:outline-none",
        size === "sm" ? "h-12 w-12 focus-visible:ring-5" : "h-11 w-11 focus-visible:ring-2",
        "focus-visible:ring-black/70"
    ].join(" ")

    const availableIdle =
        "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] " +
        "dark:bg-white dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"

    const selectedCls = "bg-black border-black text-white "
    const unavailable =
        "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed opacity-60 " +
        "dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-500"
    const limited = "bg-white border-gray-200 text-gray-300 cursor-not-allowed opacity-60"

    let cls = ""
    if (!isAvailable) cls = `${base} ${unavailable}`
    else if (isSelected) cls = `${base} ${selectedCls}`
    else if (reachedMax) cls = `${base} ${limited}`
    else cls = `${base} ${availableIdle}`

    if (suggested && !isSelected && isAvailable && !reachedMax) {
        cls += " ring-2 ring-amber-500 animate-pulse"
    }

    return (
        <button
            key={seat.no}
            role="gridcell"
            aria-selected={isSelected}
            aria-disabled={!canClick}
            aria-label={`${t("seats.seat")} ${seat.no} ${isAvailable ? t("seats.available") : t("seats.unavailable")}${suggested ? " · " + t("seats.suggested") : ""}`}
            className={cls}
            disabled={!canClick}
            onClick={() => canClick && onToggle(seat.no)}
            title={suggested ? t("seats.suggested") : undefined}
        >
            <div className="relative flex flex-col items-center leading-none">
                {suggested && !isSelected && isAvailable && !reachedMax && (
                    <span className="absolute -top-1 -right-1 rounded px-1 text-[9px] font-semibold bg-amber-400 text-black">
            {t("seats.suggestedShort")}
          </span>
                )}
                <Armchair className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
                <span className={size === "sm" ? "mt-0.5 text-[9px] font-medium" : "mt-0.5 text-[10px] font-medium"}>
          {seat.no}
        </span>
            </div>
        </button>
    )
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`inline-block h-3.5 w-3.5 rounded-sm ${swatch}`} aria-hidden />
            <span className="text-xs md:text-sm text-gray-700 dark:text-white">{label}</span>
        </div>
    )
}
