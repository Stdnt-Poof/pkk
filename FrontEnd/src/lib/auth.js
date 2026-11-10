import { createContext, useContext } from 'react'

/**
 * The session shared by the whole app. Created here so that only components
 * live in AuthContext.jsx (keeps fast refresh working).
 */
export const AuthContext = createContext(null)

/**
 * Read the current account, its role and the auth actions.
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }

  return context
}
