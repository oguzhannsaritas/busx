import { useEffect, useState } from 'react'
import { apiGet } from '@/services/apiClient'
import type { Schedule } from '@/types/schedules'

export function useSchedules(
    from?: string,
    to?: string,
    date?: string,
    enabled: boolean = false,
    minDelay = 1800,
    maxDelay = 2600
) {
    const [data, setData] = useState<Schedule[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!enabled) return
        if (!from || !to || !date) return

        let alive = true
        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay

        setLoading(true)
        setError(null)

        const timer = setTimeout(() => {
            const qs = new URLSearchParams({ from, to, date }).toString()
            apiGet<Schedule[]>(`/schedules?${qs}`)
                .then(d => { if (alive) setData(d) })
                .catch(e => { if (alive) setError(e) })
                .finally(() => { if (alive) setLoading(false) })
        }, delay)

        return () => {
            alive = false
            clearTimeout(timer)
        }
    }, [from, to, date, enabled, minDelay, maxDelay])

    return { data, loading, error }
}
