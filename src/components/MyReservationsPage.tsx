import { useMyReservations } from '../hooks/useMyReservations'
import type { ReservationSortBy } from '../hooks/useMyReservations'
import type { User } from '../api/types'
import { GiftCard } from './GiftCard'
import { PageHeader } from './PageHeader'

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
  const { sortedGifts, sortBy, setSortBy, cancelReserve, error } = useMyReservations()

  return (
    <div className="container">
      <PageHeader title="Мои брони" onBack={onBack} />

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

        {sortedGifts.length === 0 ? (
          <p className="no-gifts">Вы пока ничего не забронировали</p>
        ) : (
          <div className="gifts-list">
            {sortedGifts.map(gift => (
              <GiftCard
                key={gift.id}
                gift={gift}
                owner={gift.owner}
                isOwner={false}
                currentUserId={currentUser.tg_id}
                onCancelReserve={cancelReserve}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}