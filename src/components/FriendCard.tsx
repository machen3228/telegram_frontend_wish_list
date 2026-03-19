import type { Friend } from '../api/types'
import { Avatar } from './Avatar'

interface FriendCardProps {
  friend: Friend
  isActive: boolean
  onActivate: (id: number | null) => void
  onRemove: (id: number) => void
  onClick: (id: number) => void
}

export function FriendCard({ friend, isActive, onActivate, onRemove, onClick }: FriendCardProps) {
  const { tg_id, tg_username, first_name, last_name, avatar_url } = friend

  const fullName = [first_name, last_name].filter(Boolean).join(' ')
  const displayName = fullName || (tg_username ? `@${tg_username}` : `ID: ${tg_id}`)

  const handleCardClick = () => {
    if (window.matchMedia('(hover: none)').matches) {
      onActivate(isActive ? null : tg_id)
    } else {
      onClick(tg_id)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove(tg_id)
  }

  return (
    <div
      className={`friend-card${isActive ? ' friend-card--active' : ''}`}
      onClick={handleCardClick}
    >
      <div className="friend-card-avatar-wrap">
        <Avatar avatarUrl={avatar_url} initial={first_name?.[0] ?? '?'} alt={displayName} className="friend-avatar" />
      </div>

      <div className="friend-card-info">
        <span className="friend-name">{displayName}</span>
        {fullName && tg_username && (
          <span className="friend-username">@{tg_username}</span>
        )}
      </div>

      <button className="friend-remove-btn" onClick={handleRemove} title="Удалить из друзей">
        ✕
      </button>
    </div>
  )
}