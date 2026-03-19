import type { Gift } from '../api/types'

interface GiftCardProps {
  gift: Gift
  onDelete?: (id: number) => void
  onReserve: (id: number) => void
  onCancelReserve: (id: number) => void
  isOwner?: boolean
  currentUserId?: number
}

export function GiftCard({ gift, onDelete, onReserve, onCancelReserve, isOwner = true, currentUserId }: GiftCardProps) {
  const isReservedByMe = currentUserId !== undefined && gift.reserved_by === currentUserId
  // Cancel is allowed when: I made the reservation, OR currentUserId is unknown (own profile — old behaviour)
  const canCancelReserve = gift.is_reserved && (currentUserId === undefined || isReservedByMe)

  const reservationLabel = isReservedByMe ? 'Забронировано вами' : 'Забронировано'

  return (
    <div className={`gift-card ${gift.is_reserved ? 'gift-card--reserved' : ''}`}>
      {gift.is_reserved && <span className="gift-reserved">{reservationLabel}</span>}
      <div className="gift-card-header">
        <h3 className="gift-name">{gift.name}</h3>
        {isOwner && onDelete && (
          <div className="gift-card-actions">
            <button
              className="gift-delete-btn"
              onClick={() => onDelete(gift.id)}
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        )}
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
          <span className="gift-price">
            {(gift.price / 100).toLocaleString('ru-RU', { minimumFractionDigits: 0 })} ₽
          </span>
        )}
      </div>
      {gift.note && <p className="gift-note">{gift.note}</p>}
      <p className="gift-created-at">
        Добавлен: {new Date(gift.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      {!gift.is_reserved ? (
        <button className="gift-reserve-btn" onClick={() => onReserve(gift.id)}>
          Буду дарить
        </button>
      ) : canCancelReserve ? (
        <button className="gift-cancel-reserve-btn" onClick={() => onCancelReserve(gift.id)}>
          Отменить бронь
        </button>
      ) : null}
    </div>
  )
}