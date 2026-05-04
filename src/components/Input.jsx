import './Input.css'

export function FormGroup({ children, className = '' }) {
  return <div className={`form-group ${className}`}>{children}</div>
}

export function FormLabel({ children, htmlFor }) {
  return <label className="form-label" htmlFor={htmlFor}>{children}</label>
}

export function FormInput({ error, hint, id, className = '', ...props }) {
  return (
    <div>
      <input
        id={id}
        className={`form-input ${error ? 'error' : ''} ${className}`}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
      {hint && !error && <div className="form-hint">{hint}</div>}
    </div>
  )
}

export function FormSelect({ error, hint, id, children, className = '', ...props }) {
  return (
    <div>
      <select id={id} className={`form-select ${error ? 'error' : ''} ${className}`} {...props}>
        {children}
      </select>
      {error && <div className="form-error">{error}</div>}
      {hint && !error && <div className="form-hint">{hint}</div>}
    </div>
  )
}

export function FormTextarea({ error, hint, id, className = '', ...props }) {
  return (
    <div>
      <textarea id={id} className={`form-textarea ${error ? 'error' : ''} ${className}`} {...props} />
      {error && <div className="form-error">{error}</div>}
      {hint && !error && <div className="form-hint">{hint}</div>}
    </div>
  )
}

export function FormCheckbox({ id, label, ...props }) {
  return (
    <label className="form-checkbox" htmlFor={id}>
      <input type="checkbox" id={id} {...props} />
      <span className="form-checkbox-label">{label}</span>
    </label>
  )
}
