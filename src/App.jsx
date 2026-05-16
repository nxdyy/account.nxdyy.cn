import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import useAuthStore from './store/authStore'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/PageTransition'
import Layout from './components/Layout/Layout'
import Login from './pages/auth/Login'
import Login2FA from './pages/auth/Login2FA'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Overview from './pages/account/Overview'
import YourInfo from './pages/account/YourInfo'
import Security from './pages/account/Security'
import Devices from './pages/account/Devices'
import Privacy from './pages/account/Privacy'
import Subscriptions from './pages/account/Subscriptions'
import Users from './pages/admin/Users'
import Roles from './pages/admin/Roles'
import Permissions from './pages/admin/Permissions'
import SecurityConfig from './pages/admin/SecurityConfig'
import SSOClients from './pages/admin/SSOClients'
import AuditLogs from './pages/admin/AuditLogs'
import AdminDashboard from './pages/admin/AdminDashboard'
import SystemApiMappings from './pages/admin/SystemApiMappings'

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)
  const isInitialized = useAuthStore((s) => s.isInitialized)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!isInitialized) {
    return (
      <div className="loading-state" style={{ minHeight: '100vh' }}>
        加载中...
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/login/2fa" element={<PageTransition><Login2FA /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/account" replace />} />
          <Route path="account" element={<Overview />} />
          <Route path="account/info" element={<YourInfo />} />
          <Route path="account/security" element={<Security />} />
          <Route path="account/devices" element={<Devices />} />
          <Route path="account/privacy" element={<Privacy />} />
          <Route path="account/subscriptions" element={<Subscriptions />} />
        </Route>

        <Route
          element={
            <ProtectedRoute requireAdmin>
              <Layout wide />
            </ProtectedRoute>
          }
        >
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/roles" element={<Roles />} />
          <Route path="admin/permissions" element={<Permissions />} />
          <Route path="admin/security-config" element={<SecurityConfig />} />
          <Route path="admin/sso" element={<SSOClients />} />
          <Route path="admin/audit-logs" element={<AuditLogs />} />
          <Route path="admin/system/api-mappings" element={<SystemApiMappings />} />
        </Route>

        <Route path="*" element={<Navigate to="/account" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
