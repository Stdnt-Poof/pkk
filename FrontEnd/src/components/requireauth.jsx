import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { SkeletonShell } from './skeleton'

/**
 * Guards every route nested under it: guests are sent back to the login page,
 * and accounts that are not administrators are kept out of admin areas.
 */
function RequireAuth({ adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return <SkeletonShell />
  }

  if (!user) {
    return <Navigate to="/Login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/Home" replace />
  }

  return <Outlet />
}

export default RequireAuth
