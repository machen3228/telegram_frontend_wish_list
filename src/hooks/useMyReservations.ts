import { useState, useEffect, useMemo, useCallback } from 'react'
import { getMyReservations, cancelReservation } from '../api/client'
import type { GiftWithOwner } from '../api/types'

export type ReservationSortBy = 'by_user' | 'price_asc' | 'price_desc'

export function useMyReservations() {
  const [gifts, setGifts] = useState<GiftWithOwner[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyReservations().then(setGifts).catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  const [sortBy, setSortBy] = useState<ReservationSortBy>('by_user')

  const refresh = useCallback(() => {
    getMyReservations().then(setGifts).catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  const cancelReserve = useCallback(async (giftId: number) => {
    await cancelReservation(giftId)
    refresh()
  }, [refresh])

  const sortedGifts = useMemo(() => {
    return [...gifts].sort((a, b) => {
      if (sortBy === 'by_user') {
        const nameA = [a.owner.first_name, a.owner.last_name].filter(Boolean).join(' ') || ''
        const nameB = [b.owner.first_name, b.owner.last_name].filter(Boolean).join(' ') || ''
        return nameA.localeCompare(nameB, 'ru')
      }
      if (sortBy === 'price_asc') {
        return (a.price ?? Infinity) - (b.price ?? Infinity)
      }
      // price_desc
      return (b.price ?? -Infinity) - (a.price ?? -Infinity)
    })
  }, [gifts, sortBy])

  return { sortedGifts, sortBy, setSortBy, cancelReserve, error }
}