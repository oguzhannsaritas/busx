import { useEffect, useState } from 'react'
import { apiGet } from '@/services/apiClient'
import type { SeatSchema } from '@/types/seats'

export function useSeatSchema(tripId?: string) {
  const [data, setData] = useState<SeatSchema | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!tripId) return
    setLoading(true)
    apiGet<SeatSchema>(`/seatSchemas/${tripId}`)
      .then(setData).catch(setError).finally(() => setLoading(false))
  }, [tripId])

  return { data, loading, error }
}
