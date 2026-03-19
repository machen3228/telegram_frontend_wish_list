import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useGifts } from './hooks/useGifts'
import type { Friend, GiftCreateDTO } from './api/types'
import { UserCard } from './components/UserCard'
import { GiftCard } from './components/GiftCard'
import { GiftForm } from './components/GiftForm'
import { SortSelect } from './components/SortSelect'
import { FriendsPage } from './components/FriendsPage'
import { FriendProfilePage } from './components/FriendProfilePage'
import { MyReservationsPage } from './components/MyReservationsPage'

function App() {
  const { user, loading, error } = useAuth()
  const { sortedGifts, sortBy, setSortBy, addGift, removeGift, reserve, cancelReserve, error: giftsError } = useGifts(user?.tg_id ?? null)
  const [showForm, setShowForm] = useState(false)
  const [currentView, setCurrentView] = useState<'main' | 'friends' | 'friend-profile' | 'my-reservations'>('main')
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)

  const handleFriendClick = (friend: Friend) => {
    setSelectedFriend(friend)
    setCurrentView('friend-profile')
  }

  const handleAddGift = async (data: GiftCreateDTO) => {
    await addGift(data)
    setShowForm(false)
  }

  const handleDeleteGift = async (giftId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот подарок?')) return
    await removeGift(giftId)
  }

  if (loading) return <div className="container">Loading...</div>
  if (error) return <div className="container error">{error}</div>
  if (!user) return <div className="container">No user data</div>

  if (currentView === 'my-reservations') {
    return <MyReservationsPage currentUser={user} onBack={() => setCurrentView('main')} />
  }

  if (currentView === 'friends') {
    return <FriendsPage onBack={() => setCurrentView('main')} onFriendClick={handleFriendClick} />
  }

  if (currentView === 'friend-profile' && selectedFriend) {
    return (
      <FriendProfilePage
        friend={selectedFriend}
        currentUserId={user.tg_id}
        onBack={() => setCurrentView('friends')}
      />
    )
  }

  return (
    <div className="container">
      <UserCard user={user} />

      <div className="main-nav">
        <button className="nav-friends-btn" onClick={() => setCurrentView('my-reservations')}>
          Мои брони
        </button>
        <button className="nav-friends-btn" onClick={() => setCurrentView('friends')}>
          Друзья
        </button>
      </div>

      <div className="gifts-section">
        {giftsError && <div className="error" style={{ marginBottom: 12 }}>Ошибка: {giftsError}</div>}
        <div className="gifts-header">
          <h2>Мои подарки</h2>
          <div className="gifts-header-actions">
            <SortSelect value={sortBy} onChange={setSortBy} />
            <button className="add-gift-btn" onClick={() => setShowForm(true)}>
              Добавить
            </button>
          </div>
        </div>
        {sortedGifts.length === 0 ? (
          <p className="no-gifts">У вас пока нет подарков</p>
        ) : (
          <div className="gifts-list">
            {sortedGifts.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                onDelete={handleDeleteGift}
                onReserve={reserve}
                onCancelReserve={cancelReserve}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <GiftForm onSubmit={handleAddGift} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App