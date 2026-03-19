import { useCallback, useEffect, useState } from 'react'
import {
  getFriendRequests,
  getFriends,
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
  removeFriend,
} from '../api/client'
import type { FriendRequest, Friend } from '../api/types'

export function useFriends() {
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [error, setError] = useState<string | null>(null)

  // .then(setState) pattern required by react-hooks/set-state-in-effect
  useEffect(() => {
    getFriendRequests()
      .then(setRequests)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  useEffect(() => {
    getFriends()
      .then(setFriends)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  const refreshRequests = useCallback(async () => {
    setRequests(await getFriendRequests())
  }, [])

  const refreshFriends = useCallback(async () => {
    setFriends(await getFriends())
  }, [])

  const accept = async (senderId: number) => {
    try {
      await acceptFriendRequest(senderId)
      await refreshRequests()
      await refreshFriends()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const reject = async (senderId: number) => {
    try {
      await rejectFriendRequest(senderId)
      await refreshRequests()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const remove = async (friendId: number) => {
    try {
      await removeFriend(friendId)
      await refreshFriends()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const addFriend = async (receiverId: number) => {
    try {
      await sendFriendRequest(receiverId)
      // Outbound request — not visible in /me/friend-requests, no list to refresh
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
      throw e
    }
  }

  return { requests, friends, error, accept, reject, remove, addFriend }
}