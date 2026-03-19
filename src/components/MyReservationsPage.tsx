import { useMyReservations } from '../hooks/useMyReservations'
import type { ReservationSortBy } from '../hooks/useMyReservations'
import type { User } from '../api/types'
import { GiftCard } from './GiftCard'

interface MyReservationsPageProps {
  currentUser: User
  onBack: () => void
}

const SORT_OPTIONS: { value: ReservationSortBy; label: string }[] = [
  { value: 'by_user', label: 'По пользователю' },
  { value: 'price_asc', label: 'Сначала дешевле' },
  { value: 'price_desc', label: 'Сначала дороже' },
]

export function MyReservationsPage({ currentUser, onBack }: MyReservationsPageProps) {
  const { sortedReservations, sortBy, setSortBy, cancelReserve, error } = useMyReservations(currentUser)

  return (
    <div className="container">
      <div className="friends-page-header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
        <h1 className="friends-page-title">Мои брони</h1>
      </div>

      <div className="gifts-section">
        {error && <div className="error" style={{ marginBottom: 12 }}>Ошибка: {error}</div>}
        <div className="gifts-header">
          <h2>Забронированные подарки</h2>
          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as ReservationSortBy)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {sortedReservations.length === 0 ? (
          <p className="no-gifts">Вы пока ничего не забронировали</p>
        ) : (
          <div className="gifts-list">
            {sortedReservations.map(({ gift, owner }) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                owner={owner}
                isOwner={false}
                currentUserId={currentUser.tg_id}
                onReserve={() => {}}
                onCancelReserve={cancelReserve}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}