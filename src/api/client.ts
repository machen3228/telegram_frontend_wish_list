import type { TokenResponse, User, TelegramInitData, Gift, GiftCreateDTO } from './types'

const API_BASE_URL = 'http://localhost:80'

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
  if (!token) throw new Error('No token available. Please login first.')
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
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