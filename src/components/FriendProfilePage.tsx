import type { Friend } from '../api/types'
import { useGifts } from '../hooks/useGifts'
import { UserCard } from './UserCard'
import { GiftCard } from './GiftCard'
import { SortSelect } from './SortSelect'
import { PageHeader } from './PageHeader'

interface FriendProfilePageProps {
  friend: Friend
  currentUserId: number
  onBack: () => void
}

export function FriendProfilePage({ friend, currentUserId, onBack }: FriendProfilePageProps) {
  const { sortedGifts, sortBy, setSortBy, reserve, cancelReserve, error } = useGifts(friend.tg_id)

  return (
    <div className="container">
      <PageHeader onBack={onBack} />

      <UserCard user={friend} />

      <div className="gifts-section">
        {error && <div className="error" style={{ marginBottom: 12 }}>Ошибка: {error}</div>}
        <div className="gifts-header">
          <h2>Список желаний</h2>
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>
        {sortedGifts.length === 0 ? (
          <p className="no-gifts">У друга пока нет подарков</p>
        ) : (
          <div className="gifts-list">
            {sortedGifts.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                isOwner={false}
                currentUserId={currentUserId}
                onReserve={reserve}
                onCancelReserve={cancelReserve}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}