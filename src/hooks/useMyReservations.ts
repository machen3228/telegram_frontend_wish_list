import { useState, useEffect, useMemo, useCallback } from 'react'
import { getMyReservations, cancelReservation, getFriends } from '../api/client'
import type { Gift, Friend, User } from '../api/types'

export type ReservationSortBy = 'by_user' | 'price_asc' | 'price_desc'

export interface ReservedGift {
  gift: Gift
  owner: Friend | null
}

export function useMyReservations(currentUser: User) {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [sortBy, setSortBy] = useState<ReservationSortBy>('by_user')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyReservations().then(setGifts).catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
    getFriends().then(setFriends).catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  const refresh = useCallback(() => {
    getMyReservations().then(setGifts).catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  const cancelReserve = useCallback(async (giftId: number) => {
    await cancelReservation(giftId)
    refresh()
  }, [refresh])

  const sortedReservations = useMemo((): ReservedGift[] => {
    const withOwners: ReservedGift[] = gifts.map(gift => ({
      gift,
      owner: gift.user_id === currentUser.tg_id
        ? currentUser
        : friends.find(f => f.tg_id === gift.user_id) ?? null,
    }))

    return [...withOwners].sort((a, b) => {
      if (sortBy === 'by_user') {
        const nameA = [a.owner?.first_name, a.owner?.last_name].filter(Boolean).join(' ') || ''
        const nameB = [b.owner?.first_name, b.owner?.last_name].filter(Boolean).join(' ') || ''
        return nameA.localeCompare(nameB, 'ru')
      }
      if (sortBy === 'price_asc') {
        return (a.gift.price ?? Infinity) - (b.gift.price ?? Infinity)
      }
      // price_desc
      return (b.gift.price ?? -Infinity) - (a.gift.price ?? -Infinity)
    })
  }, [gifts, friends, sortBy, currentUser])

  return { sortedReservations, sortBy, setSortBy, cancelReserve, error }
}