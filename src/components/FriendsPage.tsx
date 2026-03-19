import { useState } from 'react'
import { useFriends } from '../hooks/useFriends'
import { FriendRequestCard } from './FriendRequestCard'
import { FriendCard } from './FriendCard'
import { AddFriendForm } from './AddFriendForm'

interface FriendsPageProps {
  onBack: () => void
}

export function FriendsPage({ onBack }: FriendsPageProps) {
  const { requests, friends, error, accept, reject, remove, addFriend } = useFriends()
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeCardId, setActiveCardId] = useState<number | null>(null)

  const handleAddFriend = async (receiverId: number) => {
    await addFriend(receiverId)
    setShowAddForm(false)
  }

  return (
    <div className="container">
      {error && <div className="error" style={{ marginBottom: 12 }}>Ошибка: {error}</div>}

      <div className="friends-page-header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
        <h1 className="friends-page-title">Друзья</h1>
      </div>

      {/* Friend requests section */}
      <div className="friends-section">
        <div className="friends-section-header">
          <h2>Заявки в друзья</h2>
        </div>
        {requests.length === 0 ? (
          <p className="no-friends">Нет входящих заявок</p>
        ) : (
          requests.map((req) => (
            <FriendRequestCard
              key={req.sender_tg_id}
              request={req}
              onAccept={accept}
              onReject={reject}
            />
          ))
        )}
      </div>

      {/* Friends list section */}
      <div className="friends-section">
        <div className="friends-section-header">
          <h2>Мои друзья</h2>
          <button className="add-gift-btn" onClick={() => setShowAddForm(true)}>
            Добавить
          </button>
        </div>
        {friends.length === 0 ? (
          <p className="no-friends">У вас пока нет друзей</p>
        ) : (
          friends.map((f) => (
            <FriendCard
              key={f.tg_id}
              friend={f}
              isActive={activeCardId === f.tg_id}
              onActivate={setActiveCardId}
              onRemove={remove}
              onClick={() => { /* stub: future friend profile page */ }}
            />
          ))
        )}
      </div>

      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <AddFriendForm onSubmit={handleAddFriend} onCancel={() => setShowAddForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}