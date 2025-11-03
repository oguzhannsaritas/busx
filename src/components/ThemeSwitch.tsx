"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

export default function ThemeSwitch() {
    const { theme, toggle } = useTheme()
    const isDark = theme === "dark"

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Aydınlık temaya geç" : "Karanlık temaya geç"}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold
                 hover:bg-gray-50 dark:hover:bg-neutral-800
                 border-gray-300 dark:border-neutral-700
                 text-gray-900 dark:text-neutral-100"
            title={isDark ? "Light" : "Dark"}
        >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{isDark ? "Light" : "Dark"}</span>
        </button>
    )
}
