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

export interface Gift {
  id: number
  user_id: number
  name: string
  url: string | null
  wish_rate: number | null
  price: number | null
  note: string | null
  created_at: string
  updated_at: string
  is_reserved: boolean
  reserved_by: number | null
}

export interface GiftCreateDTO {
  name: string
  url?: string | null
  wish_rate?: number | null
  price?: number | null
  note?: string | null
}

export interface FriendRequest {
  sender_tg_id: number
  receiver_tg_id: number
  status: string
  created_at: string
  sender_name: string | null
  sender_username: string | null
}

// A friend is a full user record
export type Friend = User

export interface GiftOwnerDTO {
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
}

export interface GiftWithOwner extends Gift {
  owner: GiftOwnerDTO
}
