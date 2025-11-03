export function lsGet<T>(key: string, fallback: T | null = null): T | null {
    try {
        const raw = localStorage.getItem(key)
        return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
        return fallback
    }
}

export function lsSet(key: string, value: unknown) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {}
}

export function lsDel(key: string) {
    try {
        localStorage.removeItem(key)
    } catch {}
}
