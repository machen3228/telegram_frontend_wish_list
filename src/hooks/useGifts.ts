import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMyGifts, createGift, deleteGift, reserveGift, cancelReservation } from '../api/client'
import type { Gift, GiftCreateDTO } from '../api/types'

export type SortOption = 'newest' | 'oldest' | 'price_desc' | 'price_asc' | 'wish_rate_desc'

export function useGifts(userId: number | null) {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const load = useCallback(async () => {
    if (userId === null) return
    setGifts(await getMyGifts(userId))
  }, [userId])

  useEffect(() => { load() }, [load])

  const sortedGifts = useMemo(() => {
    const sorted = [...gifts]
    switch (sortBy) {
      case 'newest':      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      case 'oldest':      return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      case 'price_desc':  return sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
      case 'price_asc':   return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
      case 'wish_rate_desc': return sorted.sort((a, b) => (b.wish_rate ?? -Infinity) - (a.wish_rate ?? -Infinity))
    }
  }, [gifts, sortBy])

  const addGift = async (data: GiftCreateDTO) => {
    await createGift(data)
    await load()
  }

  const removeGift = async (giftId: number) => {
    await deleteGift(giftId)
    await load()
  }

  const reserve = async (giftId: number) => {
    await reserveGift(giftId)
    await load()
  }

  const cancelReserve = async (giftId: number) => {
    await cancelReservation(giftId)
    await load()
  }

  return { sortedGifts, sortBy, setSortBy, addGift, removeGift, reserve, cancelReserve }
}