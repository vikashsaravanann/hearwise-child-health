import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">👂</div>
          <p className="text-teal-400 text-lg font-medium">Loading HearWise…</p>
          <div className="mt-4 flex gap-1 justify-center">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
          </div>
        </div>
      </div>
    )
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
