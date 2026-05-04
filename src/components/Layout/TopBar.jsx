import useAuthStore from '../../store/authStore'
import './TopBar.css'

function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export default function TopBar() {
  const user = useAuthStore((s) => s.user)

  const initials = user
    ? (user.nickname || user.username || user.email || '?').charAt(0).toUpperCase()
    : '?'

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-logo"><LogoIcon /></span>
        <span className="topbar-title">隐向账户</span>
      </div>
      <div className="topbar-actions">
        <button className="topbar-btn" title="帮助">
          <HelpIcon />
          <span>帮助</span>
        </button>
        <div className="topbar-avatar" title={user?.email}>{initials}</div>
      </div>
    </header>
  )
}
