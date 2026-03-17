import { useState } from 'react'
import type { GiftCreateDTO } from '../api/types'

interface GiftFormProps {
  onSubmit: (data: GiftCreateDTO) => Promise<void>
  onCancel: () => void
}

const LIMITS = {
  name: 100,
  url: 300,
  wishRateMin: 1,
  wishRateMax: 10,
  priceMax: 99999999.99,
  note: 1000,
}

export function GiftForm({ onSubmit, onCancel }: GiftFormProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [wishRate, setWishRate] = useState('')
  const [price, setPrice] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      alert('Название подарка обязательно')
      return
    }

    const data: GiftCreateDTO = {
      name: name.trim(),
      url: url.trim() || null,
      wish_rate: wishRate ? Number(wishRate) : null,
      price: price ? Math.round(Number(price) * 100) : null,
      note: note.trim() || null,
    }

    setSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="gift-form" onSubmit={handleSubmit}>
      <h3>Новый подарок</h3>

      <div className="form-field">
        <label htmlFor="gift-name">Название *</label>
        <input
          id="gift-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={LIMITS.name}
          placeholder="Введите название"
          required
        />
        <span className="char-count">{name.length}/{LIMITS.name}</span>
      </div>

      <div className="form-field">
        <label htmlFor="gift-url">Ссылка</label>
        <input
          id="gift-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          maxLength={LIMITS.url}
          placeholder="https://..."
        />
        <span className="char-count">{url.length}/{LIMITS.url}</span>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="gift-wish-rate">Желаемость (1-10)</label>
          <input
            id="gift-wish-rate"
            type="number"
            value={wishRate}
            onChange={(e) => setWishRate(e.target.value)}
            min={LIMITS.wishRateMin}
            max={LIMITS.wishRateMax}
            placeholder="1-10"
          />
        </div>

        <div className="form-field">
          <label htmlFor="gift-price">Цена</label>
          <input
            id="gift-price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
            max={LIMITS.priceMax}
            step={0.01}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="gift-note">Заметка</label>
        <textarea
          id="gift-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={LIMITS.note}
          placeholder="Дополнительная информация..."
          rows={3}
        />
        <span className="char-count">{note.length}/{LIMITS.note}</span>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel} disabled={submitting}>
          Отмена
        </button>
        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? 'Добавление...' : 'Добавить'}
        </button>
      </div>
    </form>
  )
}