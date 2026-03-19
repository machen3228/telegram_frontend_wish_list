import type { User } from '../api/types'
import { Avatar } from './Avatar'

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')

  return (
    <div className="user-card">
      <Avatar avatarUrl={user.avatar_url} initial={user.first_name?.[0] ?? '?'} />
      <h1 className="user-name">{fullName || 'Unknown User'}</h1>
      {user.tg_username && (
        <p className="user-username">@{user.tg_username}</p>
      )}
      <div className="user-id-row">
        <span className="user-id">ID: {user.tg_id}</span>
        <button
          className="copy-btn"
          onClick={() => {
            navigator.clipboard.writeText(String(user.tg_id))
            alert('ID скопирован в буфер обмена')
          }}
        >
          📋
        </button>
      </div>
    </div>
  )
}