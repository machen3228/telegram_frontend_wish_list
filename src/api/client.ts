import type { TokenResponse, User, TelegramInitData, Gift, GiftCreateDTO, FriendRequest, Friend } from './types'

const API_BASE_URL = 'http://localhost:80'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const MOCK_USER: TelegramInitData = {
  id: 12345,
  username: 'testusername',
  first_name: 'Test',
  last_name: 'User',
}

function getToken(): string | null {
  return localStorage.getItem('token')
}

function setToken(token: string): void {
  localStorage.setItem('token', token)
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()
  if (!token) throw new ApiError(401, 'No token available. Please login first.')
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem('token')
    let detail = `Request failed: ${response.status}`
    try {
      const body: unknown = await response.json()
      if (body && typeof body === 'object' && 'detail' in body && typeof body.detail === 'string') {
        detail = body.detail
      }
    } catch { /* ignore parse errors */ }
    throw new ApiError(response.status, detail)
  }
  return response
}

export async function login(): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE_URL}/users/auth-dev`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(MOCK_USER),
  })
  if (!response.ok) throw new Error(`Login failed: ${response.status}`)
  const data: TokenResponse = await response.json()
  setToken(data.access_token)
  return data
}

export async function getMe(): Promise<User> {
  return (await authFetch('/users/me')).json()
}

export async function getMyGifts(userId: number): Promise<Gift[]> {
  return (await authFetch(`/gifts/user/${userId}`)).json()
}

export async function createGift(data: GiftCreateDTO): Promise<void> {
  await authFetch('/gifts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteGift(giftId: number): Promise<void> {
  await authFetch(`/gifts/${giftId}`, { method: 'DELETE' })
}

export async function reserveGift(giftId: number): Promise<void> {
  await authFetch(`/gifts/${giftId}/reserve`, { method: 'POST' })
}

export async function cancelReservation(giftId: number): Promise<void> {
  await authFetch(`/gifts/${giftId}/reserve`, { method: 'DELETE' })
}

export async function getFriendRequests(): Promise<FriendRequest[]> {
  return (await authFetch('/users/me/friend-requests')).json()
}

export async function acceptFriendRequest(senderId: number): Promise<void> {
  await authFetch(`/users/me/friends/${senderId}/accept`, { method: 'PATCH' })
}

export async function rejectFriendRequest(senderId: number): Promise<void> {
  await authFetch(`/users/me/friends/${senderId}/reject`, { method: 'PATCH' })
}

export async function getFriends(): Promise<Friend[]> {
  return (await authFetch('/users/me/friends')).json()
}

export async function sendFriendRequest(receiverId: number): Promise<void> {
  await authFetch(`/users/me/friends/${receiverId}/request`, { method: 'POST' })
}

export async function removeFriend(friendId: number): Promise<void> {
  await authFetch(`/users/me/friends/${friendId}/delete`, { method: 'DELETE' })
}

export async function getMyReservations(): Promise<Gift[]> {
  return (await authFetch('/gifts/my/reserve')).json()
}