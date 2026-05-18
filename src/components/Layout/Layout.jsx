import TopBar from './TopBar'
import Sidebar from './Sidebar'
import PageTransition from '../PageTransition'
import './Layout.css'

export default function Layout({ wide = false, children }) {
  return (
    <div className="layout">
      <TopBar />
      <Sidebar />
      <main className="layout-main">
        <div className={wide ? 'layout-content-wide' : 'layout-content'}>
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  )
}
