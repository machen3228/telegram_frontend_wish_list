import type { TokenResponse, User, TelegramInitData } from './types'

const API_BASE_URL = 'http://localhost:80'

const MOCK_USER: TelegramInitData = {
  id: 12345,
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
