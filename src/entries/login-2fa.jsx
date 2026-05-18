import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ToastContainer from '../components/Toast'
import PageTransition from '../components/PageTransition'
import Login2FA from '../pages/auth/Login2FA'
import '../index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <PageTransition>
        <Login2FA />
      </PageTransition>
    </BrowserRouter>
  </StrictMode>,
)
