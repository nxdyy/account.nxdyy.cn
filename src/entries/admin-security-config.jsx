import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ToastContainer from '../components/Toast'
import Layout from '../components/Layout/Layout'
import SecurityConfig from '../pages/admin/SecurityConfig'
import '../index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Layout wide>
        <SecurityConfig />
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)
