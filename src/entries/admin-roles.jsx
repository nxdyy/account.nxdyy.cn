import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ToastContainer from '../components/Toast'
import Layout from '../components/Layout/Layout'
import Roles from '../pages/admin/Roles'
import '../index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Layout wide>
        <Roles />
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)
