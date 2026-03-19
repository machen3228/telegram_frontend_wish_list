import { useState } from 'react'

interface AddFriendFormProps {
  onSubmit: (receiverId: number) => Promise<void>
  onCancel: () => void
}

export function AddFriendForm({ onSubmit, onCancel }: AddFriendFormProps) {
  const [receiverIdStr, setReceiverIdStr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = Number(receiverIdStr.trim())
    if (!id || !Number.isInteger(id) || id <= 0) {
      alert('Введите корректный ID пользователя')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit(id)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="gift-form" onSubmit={handleSubmit}>
      <h3>Отправить заявку в друзья</h3>

      <div className="form-field">
        <input
          type="number"
          value={receiverIdStr}
          onChange={(e) => setReceiverIdStr(e.target.value)}
          placeholder="Например: 123456789"
          min={1}
          disabled={submitting}
        />
        <p className="add-friend-hint">
          Пользователь получит заявку и сможет принять или отклонить её
        </p>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel} disabled={submitting}>
          Отмена
        </button>
        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? 'Отправка...' : 'Отправить заявку'}
        </button>
      </div>
    </form>
  )
}