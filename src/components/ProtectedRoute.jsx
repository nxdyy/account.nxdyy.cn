import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isInitialized, hasAdminAccess } = useAuthStore()
  const location = useLocation()

  if (!isInitialized) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && !hasAdminAccess()) {
    return <Navigate to="/account" replace />
  }

  return children
}
