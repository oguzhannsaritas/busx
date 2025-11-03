export type Theme = "light" | "dark"
const THEME_KEY = "busx:theme"

export function applyTheme(theme: Theme) {
    const root = document.documentElement
    if (theme === "dark") {
        root.classList.add("dark")
        root.style.colorScheme = "dark"
    } else {
        root.classList.remove("dark")
        root.style.colorScheme = "light"
    }
    try { localStorage.setItem(THEME_KEY, theme) } catch {}
}

export function readTheme(): Theme {
    try {
        const saved = localStorage.getItem(THEME_KEY) as Theme | null
        if (saved === "light" || saved === "dark") return saved
    } catch {}
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light"
}

export function initTheme() {
    const theme = readTheme()
    applyTheme(theme)
    const root = document.documentElement
    requestAnimationFrame(() => {
        requestAnimationFrame(() => root.classList.add("theme-ready"))
    })
}
