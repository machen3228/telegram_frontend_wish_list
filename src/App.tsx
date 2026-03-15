import { useEffect, useState } from 'react'
import { login, getMe } from './api/client'
import type { User } from './api/types'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initUser() {
      try {
        await login()
        const userData = await getMe()
        setUser(userData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    initUser()
  }, [])

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
        <p className="user-id">ID: {user.tg_id}</p>
        {user.tg_username && (
          <p className="user-username">@{user.tg_username}</p>
        )}
      </div>
    </div>
  )
}

export default App