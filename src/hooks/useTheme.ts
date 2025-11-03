import { useCallback, useEffect, useState } from "react"
import { applyTheme, readTheme, type Theme } from "@/app/theme"

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => readTheme())

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === "busx:theme" && (e.newValue === "light" || e.newValue === "dark")) {
                setTheme(e.newValue)
                applyTheme(e.newValue)
            }
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [])

    const toggle = useCallback(() => {
        const next = theme === "dark" ? "light" : "dark"
        setTheme(next)
        applyTheme(next)
    }, [theme])

    return { theme, toggle }
}
