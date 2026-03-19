import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMyGifts, createGift, deleteGift, reserveGift, cancelReservation } from '../api/client'
import type { Gift, GiftCreateDTO } from '../api/types'

export type SortOption = 'newest' | 'oldest' | 'price_desc' | 'price_asc' | 'wish_rate_desc'

export function useGifts(userId: number | null) {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId === null) return
    getMyGifts(userId)
      .then(setGifts)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
  }, [userId])

  const refresh = useCallback(async () => {
    if (userId === null) return
    setGifts(await getMyGifts(userId))
  }, [userId])

  const sortedGifts = useMemo(() => {
    const sorted = [...gifts]
    switch (sortBy) {
      case 'newest':         return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      case 'oldest':         return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      case 'price_desc':     return sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
      case 'price_asc':      return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
      case 'wish_rate_desc': return sorted.sort((a, b) => (b.wish_rate ?? -Infinity) - (a.wish_rate ?? -Infinity))
    }
  }, [gifts, sortBy])

  const addGift = async (data: GiftCreateDTO) => {
    try {
      await createGift(data)
      await refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
      throw e
    }
  }

  const removeGift = async (giftId: number) => {
    try {
      await deleteGift(giftId)
      await refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const reserve = async (giftId: number) => {
    try {
      await reserveGift(giftId)
      await refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const cancelReserve = async (giftId: number) => {
    try {
      await cancelReservation(giftId)
      await refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return { sortedGifts, sortBy, setSortBy, addGift, removeGift, reserve, cancelReserve, error }
}