import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ToastContainer from '../components/Toast'
import Layout from '../components/Layout/Layout'
import AuditLogs from '../pages/admin/AuditLogs'
import '../index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Layout wide>
        <AuditLogs />
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)
