import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ToastContainer from '../components/Toast'
import PageTransition from '../components/PageTransition'
import OAuthLogin from '../pages/oauth/OAuthLogin'
import '../index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <PageTransition>
        <OAuthLogin />
      </PageTransition>
    </BrowserRouter>
  </StrictMode>,
)
