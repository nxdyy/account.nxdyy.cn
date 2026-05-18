import { useEffect, useRef, useState, useCallback } from 'react'
import { useToastStore } from '../store/toastStore'
import './Toast.css'

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

const iconMap = {
  success: CheckIcon,
  error: AlertIcon,
  warning: WarningIcon,
  info: InfoIcon,
}

function formatDetail(detail) {
  if (!detail) return ''
  if (typeof detail === 'string') return detail
  if (typeof detail === 'object') {
    try {
      return JSON.stringify(detail, null, 2)
    } catch {
      return String(detail)
    }
  }
  return String(detail)
}

function ToastItem({ toast }) {
  const removeToast = useToastStore((s) => s.removeToast)
  const [isExiting, setIsExiting] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [progress, setProgress] = useState(100)
  const [copied, setCopied] = useState(false)

  const remainingRef = useRef(toast.duration)
  const isPausedRef = useRef(false)
  const intervalRef = useRef(null)
  const lastTickRef = useRef(Date.now())

  const detailText = formatDetail(toast.detail)
  const hasDetail = detailText && detailText.length > 0

  const handleClose = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsExiting(true)
    setTimeout(() => removeToast(toast.id), 250)
  }, [toast.id, removeToast])

  const pause = useCallback(() => {
    isPausedRef.current = true
  }, [])

  const resume = useCallback(() => {
    isPausedRef.current = false
    lastTickRef.current = Date.now()
  }, [])

  const handleCopy = useCallback(async () => {
    if (!detailText) return
    try {
      await navigator.clipboard.writeText(detailText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = detailText
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } finally {
        document.body.removeChild(textarea)
      }
    }
  }, [detailText])

  useEffect(() => {
    const tickInterval = 50

    intervalRef.current = setInterval(() => {
      if (isPausedRef.current) {
        lastTickRef.current = Date.now()
        return
      }

      const now = Date.now()
      const elapsed = now - lastTickRef.current
      lastTickRef.current = now

      remainingRef.current = Math.max(0, remainingRef.current - elapsed)

      const pct = (remainingRef.current / toast.duration) * 100
      setProgress(pct)

      if (remainingRef.current <= 0) {
        handleClose()
      }
    }, tickInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [toast.duration, handleClose])

  const Icon = iconMap[toast.type] || InfoIcon
  const progressClass = `toast-progress-${toast.type}`

  return (
    <div
      className={`toast-item ${isExiting ? 'toast-exit' : ''}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="toast-content">
        <span className={`toast-icon toast-icon-${toast.type}`}>
          <Icon />
        </span>
        <span className="toast-message">{toast.message}</span>
        <button className="toast-close" onClick={handleClose} aria-label="关闭">
          <CloseIcon />
        </button>
      </div>

      {hasDetail && (
        <div className="toast-detail-section">
          {!showDetail ? (
            <div className="toast-detail-toggle" onClick={() => setShowDetail(true)}>
              查看详细信息
            </div>
          ) : (
            <>
              <div className="toast-detail-header">
                <span className="toast-detail-label">详细信息</span>
                <button
                  className={`toast-copy-btn ${copied ? 'toast-copy-btn-copied' : ''}`}
                  onClick={handleCopy}
                  title="复制"
                >
                  {copied ? <CheckCircleIcon /> : <CopyIcon />}
                  <span>{copied ? '已复制' : '复制'}</span>
                </button>
              </div>
              <div className="toast-detail-content">{detailText}</div>
            </>
          )}
        </div>
      )}

      <div className="toast-progress">
        <div
          className={`toast-progress-bar ${progressClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
