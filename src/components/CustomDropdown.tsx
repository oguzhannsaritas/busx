import React, {useEffect, useId, useMemo, useRef, useState} from "react"
import {Check, ChevronDown} from "lucide-react"

type Size = "sm" | "md"

type CommonProps<T> = {
    id?: string
    labelId?: string
    value: string
    onChange: (value: string) => void
    options: T[]
    getOptionValue?: (opt: T) => string
    getOptionLabel?: (opt: T) => React.ReactNode
    placeholder?: string
    disabled?: boolean
    error?: boolean
    leadingIcon?: React.ReactNode
    size?: Size
    className?: string
    listClassName?: string
}

export default function CustomDropdown<T = { value: string; label: string }>(
    props: CommonProps<T>
) {
    const {
        id,
        labelId,
        value,
        onChange,
        options,
        getOptionValue,
        getOptionLabel,
        placeholder = "Select…",
        disabled,
        error,
        leadingIcon,
        size = "md",
        className = "",
        listClassName = "",
    } = props

    const reactId = useId()
    const baseId = id || `cd-${reactId}`
    const listboxId = `${baseId}-listbox`

    const valOf = useMemo(
        () =>
            getOptionValue ??
            ((o: any) => (typeof o?.value === "string" ? o.value : String(o?.value ?? ""))),
        [getOptionValue]
    )
    const labelOf = useMemo(
        () =>
            getOptionLabel ??
            ((o: any) => (o?.label ?? String(o?.label ?? o?.name ?? o?.id ?? ""))),
        [getOptionLabel]
    )

    const [isOpen, setIsOpen] = useState(false)
    const [highlightIndex, setHighlightIndex] = useState<number>(-1)
    const rootRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const typeBufferRef = useRef("")
    const typeBufferTsRef = useRef(0)

    const selectedIndex = useMemo(
        () => options.findIndex((o) => valOf(o) === value),
        [options, value, valOf]
    )

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setIsOpen(false)
                setHighlightIndex(-1)
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            return () => document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            setHighlightIndex(selectedIndex >= 0 ? selectedIndex : 0)
        } else {
            setHighlightIndex(-1)
        }
    }, [isOpen, selectedIndex])

    const sizeCls = size === "sm" ? "h-11 text-[15px]" : "h-12 text-sm"

    const ensureVisible = (idx: number) => {
        const el = document.getElementById(optionId(idx))
        el?.scrollIntoView({ block: "nearest" })
    }

    const openWithIndex = (idx: number) => {
        if (disabled) return
        setIsOpen(true)
        setHighlightIndex(idx)
        requestAnimationFrame(() => ensureVisible(idx))
    }

    const moveHighlight = (delta: number) => {
        if (!isOpen) return
        const total = options.length
        if (total === 0) return
        let next = highlightIndex
        if (next < 0) next = selectedIndex >= 0 ? selectedIndex : 0
        next = (next + delta + total) % total
        setHighlightIndex(next)
        requestAnimationFrame(() => ensureVisible(next))
    }

    const selectHighlight = () => {
        if (!isOpen) return
        const idx = highlightIndex >= 0 ? highlightIndex : selectedIndex
        if (idx >= 0) {
            const v = valOf(options[idx])
            onChange(v)
        }
        setIsOpen(false)
        setHighlightIndex(-1)
        buttonRef.current?.focus()
    }

    const typeahead = (char: string) => {
        const now = Date.now()
        if (now - typeBufferTsRef.current > 800) typeBufferRef.current = ""
        typeBufferTsRef.current = now
        typeBufferRef.current += char.toLowerCase()

        const start = Math.max(highlightIndex, 0)
        const total = options.length
        const needle = typeBufferRef.current

        const findFrom = (s: number) => {
            for (let i = 0; i < total; i++) {
                const idx = (s + i) % total
                const text = String(labelOf(options[idx]) ?? "").toLowerCase()
                if (text.startsWith(needle)) return idx
            }
            return -1
        }

        const found = findFrom(start) !== -1 ? findFrom(start) : findFrom(0)
        if (found !== -1) {
            if (!isOpen) setIsOpen(true)
            setHighlightIndex(found)
            requestAnimationFrame(() => ensureVisible(found))
        }
    }

    const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                openWithIndex(selectedIndex >= 0 ? selectedIndex : 0)
                break
            case "ArrowUp":
                e.preventDefault()
                openWithIndex(selectedIndex >= 0 ? selectedIndex : Math.max(options.length - 1, 0))
                break
            case "Enter":
            case " ":
                e.preventDefault()
                if (!isOpen) {
                    openWithIndex(selectedIndex >= 0 ? selectedIndex : 0)
                } else {
                    selectHighlight()
                }
                break
            case "Escape":
                if (isOpen) {
                    e.preventDefault()
                    setIsOpen(false)
                    setHighlightIndex(-1)
                }
                break
            case "Home":
                if (isOpen) {
                    e.preventDefault()
                    setHighlightIndex(0)
                    requestAnimationFrame(() => ensureVisible(0))
                }
                break
            case "End":
                if (isOpen) {
                    e.preventDefault()
                    const last = Math.max(options.length - 1, 0)
                    setHighlightIndex(last)
                    requestAnimationFrame(() => ensureVisible(last))
                }
                break
            case "Tab":
                setIsOpen(false)
                setHighlightIndex(-1)
                break
            default: {
                if (e.key.length === 1 && /\S/.test(e.key)) {
                    e.preventDefault()
                    typeahead(e.key)
                }
            }
        }
    }

    const handleRootKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isOpen || disabled) return
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                moveHighlight(1)
                break
            case "ArrowUp":
                e.preventDefault()
                moveHighlight(-1)
                break
            case "Home":
                e.preventDefault()
                setHighlightIndex(0)
                requestAnimationFrame(() => ensureVisible(0))
                break
            case "End":
                e.preventDefault()
            {
                const last = Math.max(options.length - 1, 0)
                setHighlightIndex(last)
                requestAnimationFrame(() => ensureVisible(last))
            }
                break
            case "Enter":
                e.preventDefault()
                selectHighlight()
                break
            case "Escape":
                e.preventDefault()
                setIsOpen(false)
                setHighlightIndex(-1)
                buttonRef.current?.focus()
                break
            case "Tab":
                setIsOpen(false)
                setHighlightIndex(-1)
                break
            default:
                if (e.key.length === 1 && /\S/.test(e.key)) {
                    e.preventDefault()
                    typeahead(e.key)
                }
        }
    }

    const optionId = (idx: number) => `${baseId}-opt-${idx}`

    const selected = options.find((o) => valOf(o) === value)

    const btnClasses = [
        "w-full rounded-xl border bg-white text-left transition-all duration-200",
        "focus:outline-none focus:ring-0 focus:border-gray-900 hover:border-gray-300",
        sizeCls,
        error ? "border-red-500" : "border-gray-200",
        "pr-10 pl-10",
        selected ? "text-black" : "text-gray-500",
        disabled ? "disabled:opacity-50 disabled:cursor-not-allowed" : "",
    ].join(" ")

    return (
        <div
            ref={rootRef}
            className={`relative ${className}`}
            onKeyDown={handleRootKeyDown}
        >
            <button
                ref={buttonRef}
                id={baseId}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
                aria-labelledby={labelId}
                aria-invalid={error || undefined}
                aria-activedescendant={
                    isOpen && highlightIndex >= 0 ? optionId(highlightIndex) : undefined
                }
                disabled={disabled}
                onClick={() => !disabled && setIsOpen((s) => !s)}
                onKeyDown={handleButtonKeyDown}
                className={btnClasses}
            >
                {selected ? labelOf(selected) : placeholder}
            </button>

            {leadingIcon ? (
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {leadingIcon}
        </span>
            ) : null}

            <ChevronDown
                className={[
                    "absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none",
                    isOpen ? "rotate-180 transition-transform duration-200" : "",
                ].join(" ")}
                aria-hidden
            />

            {isOpen && (
                <div
                    className={[
                        "absolute z-50 mt-2 w-full rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden",
                        listClassName,
                    ].join(" ")}
                >
                    <ul
                        role="listbox"
                        id={listboxId}
                        aria-labelledby={labelId}
                        className="max-h-60 overflow-y-auto"
                    >
                        {options.map((opt, idx) => {
                            const v = valOf(opt)
                            const isSelected = v === value
                            const isHighlighted = idx === highlightIndex
                            return (
                                <li
                                    key={v}
                                    id={optionId(idx)}
                                    role="option"
                                    aria-selected={isSelected}
                                    data-highlighted={isHighlighted || undefined}
                                >
                                    <button
                                        type="button"
                                        onMouseEnter={() => setHighlightIndex(idx)}
                                        onClick={() => {
                                            onChange(v)
                                            setIsOpen(false)
                                            setHighlightIndex(-1)
                                            buttonRef.current?.focus()
                                        }}
                                        className={[
                                            "w-full px-4 py-3 text-left text-sm transition-colors duration-150",
                                            "flex items-center justify-between",
                                            isHighlighted
                                                ? "bg-black text-white"
                                                : isSelected
                                                    ? "bg-white text-black"
                                                    : "text-black hover:bg-black hover:text-white",
                                        ].join(" ")}
                                    >
                                        <span>{labelOf(opt)}</span>
                                        {isSelected && <Check className="h-4 w-4" aria-hidden />}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}
