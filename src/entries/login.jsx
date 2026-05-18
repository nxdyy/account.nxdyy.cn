import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ToastContainer from '../components/Toast'
import PageTransition from '../components/PageTransition'
import Login from '../pages/auth/Login'
import '../index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <PageTransition>
        <Login />
      </PageTransition>
    </BrowserRouter>
  </StrictMode>,
)
