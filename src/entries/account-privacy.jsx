import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ToastContainer from '../components/Toast'
import Layout from '../components/Layout/Layout'
import Privacy from '../pages/account/Privacy'
import '../index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Layout>
        <Privacy />
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)
