import { useEffect, useState } from 'react'
import { login, getMe, getMyGifts, createGift, deleteGift, reserveGift, cancelReservation } from './api/client'
import type { User, Gift, GiftCreateDTO } from './api/types'
import { GiftForm } from './components/GiftForm'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const loadGifts = async (userId: number) => {
    const giftsData = await getMyGifts(userId)
    setGifts(giftsData)
  }

  useEffect(() => {
    async function initUser() {
      try {
        await login()
        const userData = await getMe()
        setUser(userData)
        await loadGifts(userData.tg_id)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    initUser()
  }, [])

  const handleAddGift = async (data: GiftCreateDTO) => {
    await createGift(data)
    if (user) {
      await loadGifts(user.tg_id)
    }
    setShowForm(false)
  }

  const handleDeleteGift = async (giftId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот подарок?')) {
      return
    }
    await deleteGift(giftId)
    if (user) {
      await loadGifts(user.tg_id)
    }
  }

  const handleReserveGift = async (giftId: number) => {
    await reserveGift(giftId)
    if (user) {
      await loadGifts(user.tg_id)
    }
  }

  const handleCancelReservation = async (giftId: number) => {
    await cancelReservation(giftId)
    if (user) {
      await loadGifts(user.tg_id)
    }
  }

  if (loading) {
    return <div className="container">Loading...</div>
  }

  if (error) {
    return <div className="container error">{error}</div>
  }

  if (!user) {
    return <div className="container">No user data</div>
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')

  return (
    <div className="container">
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

      <div className="gifts-section">
        <div className="gifts-header">
          <h2>Мои подарки</h2>
          <button className="add-gift-btn" onClick={() => setShowForm(true)}>
            Добавить
          </button>
        </div>
        {gifts.length === 0 ? (
          <p className="no-gifts">У вас пока нет подарков</p>
        ) : (
          <div className="gifts-list">
            {gifts.map((gift) => (
              <div key={gift.id} className={`gift-card ${gift.is_reserved ? 'gift-card--reserved' : ''}`}>
                <div className="gift-card-header">
                  <h3 className="gift-name">{gift.name}</h3>
                  <div className="gift-card-actions">
                    {gift.is_reserved && <span className="gift-reserved">Забронировано</span>}
                    <button
                      className="gift-delete-btn"
                      onClick={() => handleDeleteGift(gift.id)}
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {gift.url && (
                  <a href={gift.url} target="_blank" rel="noopener noreferrer" className="gift-url">
                    🔗 Ссылка
                  </a>
                )}
                <div className="gift-card-details">
                  {gift.wish_rate && (
                    <span className="gift-wish-rate">★ {gift.wish_rate}/10</span>
                  )}
                  {gift.price !== null && (
                    <span className="gift-price">{(gift.price / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽</span>
                  )}
                </div>
                {gift.note && <p className="gift-note">{gift.note}</p>}
                <p className="gift-created-at">
                  Добавлен: {new Date(gift.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                {!gift.is_reserved ? (
                  <button
                    className="gift-reserve-btn"
                    onClick={() => handleReserveGift(gift.id)}
                  >
                    Буду дарить
                  </button>
                ) : (
                  <button
                    className="gift-cancel-reserve-btn"
                    onClick={() => handleCancelReservation(gift.id)}
                  >
                    Отменить бронь
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <GiftForm
              onSubmit={handleAddGift}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App