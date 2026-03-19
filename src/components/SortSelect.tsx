import type { SortOption } from '../hooks/useGifts'

interface SortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      className="sort-select"
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
    >
      <option value="newest">Сначала новые</option>
      <option value="oldest">Сначала старые</option>
      <option value="price_desc">Сначала дороже</option>
      <option value="price_asc">Сначала дешевле</option>
      <option value="wish_rate_desc">Сначала желанные</option>
    </select>
  )
}