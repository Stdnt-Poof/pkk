import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/auth'

/**
 * Keeps already logged in accounts away from the login and sign up pages.
 */
function RedirectIfAuthed() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="route-loading">Loading your account…</div>
  }

  if (user) {
    return <Navigate to="/Home" replace />
  }

  return <Outlet />
}

export default RedirectIfAuthed
