import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ToastContainer from '../components/Toast'
import PageTransition from '../components/PageTransition'
import ForgotPassword from '../pages/auth/ForgotPassword'
import '../index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <PageTransition>
        <ForgotPassword />
      </PageTransition>
    </BrowserRouter>
  </StrictMode>,
)
