export interface TokenResponse {
  token_type: string
  access_token: string
}

export interface User {
  tg_id: number
  tg_username: string | null
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface TelegramInitData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}
