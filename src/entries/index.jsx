import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import useAuthStore from '../store/authStore'
import '../index.css'

function IndexPage() {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!isInitialized) return

    if (isAuthenticated) {
      window.location.href = '/account'
    } else {
      window.location.href = '/login'
    }
  }, [isAuthenticated, isInitialized])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'var(--color-page-bg, #f3f3f3)'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--color-primary, #2b5c4f)',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IndexPage />
  </StrictMode>,
)
