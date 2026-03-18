import type { User } from '../api/types'

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')

  return (
    <div className="user-card">
      {user.avatar_url ? (
        <img src={user.avatar_url} alt="Avatar" className="avatar" />
      ) : (
        <div className="avatar avatar-placeholder">
          {user.first_name?.[0] ?? '?'}
        </div>
      )}
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
            alert('Ваш ID скопирован в буфер обмена')
          }}
        >
          📋
        </button>
      </div>
    </div>
  )
}