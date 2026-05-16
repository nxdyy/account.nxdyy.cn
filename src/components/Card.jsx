import './Card.css'

export default function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>
}

export function CardHeader({ icon: Icon, title, subtitle, accent, action, children }) {
  return (
    <div className="card-header">
      <div className="card-header-left">
        {Icon && (
          <span className={`card-icon ${accent ? 'accent' : ''}`}>
            <Icon />
          </span>
        )}
        <div>
          {title && <div className="card-title">{title}</div>}
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
          {children}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function CardBody({ children, position = 'full' }) {
  const cls = position === 'top' ? 'card-body-top' : position === 'bottom' ? 'card-body-bottom' : 'card-body'
  return <div className={cls}>{children}</div>
}

export function CardFooter({ children }) {
  return <div className="card-footer">{children}</div>
}

export function CardRow({ label, value, action, children }) {
  return (
    <div className="card-row">
      <div className="card-row-left">
        <div className="card-row-label">{label}</div>
        {value && <div className="card-row-value">{value}</div>}
        {children}
      </div>
      {action && <div className="card-row-right">{action}</div>}
    </div>
  )
}
