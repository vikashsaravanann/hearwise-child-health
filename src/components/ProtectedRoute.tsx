import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Loader from '@/components/Loader'

// Guard 1 — Any logged-in user (teachers, parents, screeners)
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader fullscreen text="VERIFYING" />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

// Guard 2 — Admin ONLY (only the user whose email matches VITE_ADMIN_EMAIL)
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader fullscreen text="VERIFYING" />

  // Not logged in at all → go to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Logged in but NOT admin → go to home with a blocked message
  if (!isAdmin) {
    return <Navigate to="/" state={{ adminBlocked: true }} replace />
  }

  return <>{children}</>
}

// Legacy export for backward compatibility — maps to RequireAuth
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  if (adminOnly) {
    return <RequireAdmin>{children}</RequireAdmin>
  }
  return <RequireAuth>{children}</RequireAuth>
}

export default ProtectedRoute
