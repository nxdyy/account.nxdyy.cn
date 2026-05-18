import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ToastContainer from '../components/Toast'
import Layout from '../components/Layout/Layout'
import Overview from '../pages/account/Overview'
import '../index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Layout>
        <Overview />
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)
