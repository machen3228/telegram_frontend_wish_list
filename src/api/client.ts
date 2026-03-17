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

export async function login(): Promise<TokenResponse> {
  const response = await fetch(`${API_BASE_URL}/users/auth-dev`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(MOCK_USER),
  })

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`)
  }

  const data: TokenResponse = await response.json()
  setToken(data.access_token)
  return data
}

export async function getMe(): Promise<User> {
  const token = getToken()

  if (!token) {
    throw new Error('No token available. Please login first.')
  }

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`)
  }

  return response.json()
}

export async function getMyGifts(userId: number): Promise<Gift[]> {
  const token = getToken()

  if (!token) {
    throw new Error('No token available. Please login first.')
  }

  const response = await fetch(`${API_BASE_URL}/gifts/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch gifts: ${response.status}`)
  }

  return response.json()
}

export async function createGift(data: GiftCreateDTO): Promise<{ tg_id: number }> {
  const token = getToken()

  if (!token) {
    throw new Error('No token available. Please login first.')
  }

  const response = await fetch(`${API_BASE_URL}/gifts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to create gift: ${response.status}`)
  }

  return response.json()
}

export async function deleteGift(giftId: number): Promise<void> {
  const token = getToken()

  if (!token) {
    throw new Error('No token available. Please login first.')
  }

  const response = await fetch(`${API_BASE_URL}/gifts/${giftId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete gift: ${response.status}`)
  }
}

export async function reserveGift(giftId: number): Promise<void> {
  const token = getToken()

  if (!token) {
    throw new Error('No token available. Please login first.')
  }

  const response = await fetch(`${API_BASE_URL}/gifts/${giftId}/reserve`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to reserve gift: ${response.status}`)
  }
}

export async function cancelReservation(giftId: number): Promise<void> {
  const token = getToken()

  if (!token) {
    throw new Error('No token available. Please login first.')
  }

  const response = await fetch(`${API_BASE_URL}/gifts/${giftId}/reserve`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to cancel reservation: ${response.status}`)
  }
}
