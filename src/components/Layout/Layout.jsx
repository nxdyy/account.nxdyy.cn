import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import './Layout.css'

export default function Layout({ wide = false }) {
  const location = useLocation()

  return (
    <div className="layout">
      <TopBar />
      <Sidebar />
      <main className="layout-main">
        <div className={wide ? 'layout-content-wide' : 'layout-content'}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
