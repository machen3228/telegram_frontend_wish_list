import type { Gift } from '../api/types'

interface GiftCardProps {
  gift: Gift
  onDelete: (id: number) => void
  onReserve: (id: number) => void
  onCancelReserve: (id: number) => void
}

export function GiftCard({ gift, onDelete, onReserve, onCancelReserve }: GiftCardProps) {
  return (
    <div className={`gift-card ${gift.is_reserved ? 'gift-card--reserved' : ''}`}>
      {gift.is_reserved && <span className="gift-reserved">Забронировано</span>}
      <div className="gift-card-header">
        <h3 className="gift-name">{gift.name}</h3>
        <div className="gift-card-actions">
          <button
            className="gift-delete-btn"
            onClick={() => onDelete(gift.id)}
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
      ) : (
        <button className="gift-cancel-reserve-btn" onClick={() => onCancelReserve(gift.id)}>
          Отменить бронь
        </button>
      )}
    </div>
  )
}