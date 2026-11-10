import { useCallback, useEffect, useMemo, useState } from 'react'
import api, { getToken, setToken } from './api'
import { AuthContext } from './auth'

/**
 * Holds the logged in account (and its role) for the whole app.
 *
 * The session lives in the token stored by api.js; the account itself is
 * re-fetched from /api/auth/me on load so a stale or revoked token can never
 * keep someone inside the app.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => getToken() !== null)

  useEffect(() => {
    if (getToken() === null) {
      return undefined
    }

    let active = true

    api('/auth/me')
      .then((payload) => {
        if (active) {
          setUser(payload.data)
        }
      })
      .catch(() => {
        if (active) {
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (identifier, password) => {
    const payload = await api('/auth/login', {
      method: 'POST',
      body: { identifier, password },
    })

    setToken(payload.data.token)
    setUser(payload.data.user)

    return payload.data.user
  }, [])

  const register = useCallback(async ({ email, username, password, confirmpassword }) => {
    const payload = await api('/auth/register', {
      method: 'POST',
      body: { email, username, password, confirmpassword },
    })

    setToken(payload.data.token)
    setUser(payload.data.user)

    return payload.data.user
  }, [])

  const logout = useCallback(async () => {
    const token = getToken()

    // Drop the local session first so the UI can never stay on an authed page
    // while the token revocation request is still in flight.
    setToken(null)
    setUser(null)

    if (token) {
      try {
        await api('/auth/logout', { method: 'POST', token })
      } catch {
        // The token may already be revoked or expired; either way we are out.
      }
    }
  }, [])

  const refreshUser = useCallback(async () => {
    const payload = await api('/auth/me')

    setUser(payload.data)

    return payload.data
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
