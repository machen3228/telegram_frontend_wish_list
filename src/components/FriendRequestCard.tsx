import type { FriendRequest } from '../api/types'

interface FriendRequestCardProps {
  request: FriendRequest
  onAccept: (id: number) => Promise<void>
  onReject: (id: number) => Promise<void>
}

export function FriendRequestCard({ request, onAccept, onReject }: FriendRequestCardProps) {
  const { sender_tg_id, sender_name, sender_username } = request

  const displayName = sender_name || (sender_username ? `@${sender_username}` : `ID: ${sender_tg_id}`)

  return (
    <div className="friend-request-card">
      <div className="friend-request-info">
        <span className="friend-request-name">{displayName}</span>
        {sender_name && sender_username && (
          <span className="friend-request-username">@{sender_username}</span>
        )}
      </div>
      <div className="friend-request-actions">
        <button className="btn-accept" onClick={() => onAccept(sender_tg_id)}>
          Принять
        </button>
        <button className="btn-reject" onClick={() => onReject(sender_tg_id)}>
          Отклонить
        </button>
      </div>
    </div>
  )
}