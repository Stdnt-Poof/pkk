import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { SkeletonAuthForm } from './skeleton'

/**
 * Keeps already logged in accounts away from the login and sign up pages.
 */
function RedirectIfAuthed() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    // Signup has 4 fields, login has 2 — match the form about to appear.
    const fields = location.pathname.toLowerCase().includes('signup') ? 4 : 2

    return <SkeletonAuthForm fields={fields} />
  }

  if (user) {
    return <Navigate to="/Home" replace />
  }

  return <Outlet />
}

export default RedirectIfAuthed
