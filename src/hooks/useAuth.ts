import { useEffect, useState } from 'react'
import { login, getMe } from '../api/client'
import type { User } from '../api/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      try {
        await login()
        setUser(await getMe())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  return { user, loading, error }
}