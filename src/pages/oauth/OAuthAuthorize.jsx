import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { showError } from '../../store/toastStore'
import { getAuthorizeInfo, submitConsent, SCOPE_LABELS, SCOPE_DESCRIPTIONS } from '../../api/oauth2'
import Button from '../../components/Button'
import './OAuth.css'

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

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export default function OAuthAuthorize() {
  const [searchParams] = useSearchParams()
  const { isAuthenticated, initialize, isInitialized, user } = useAuthStore()
  const [clientName, setClientName] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('')

  const clientId = searchParams.get('client_id') || ''
  const redirectUri = searchParams.get('redirect_uri') || ''
  const responseType = searchParams.get('response_type') || ''
  const scope = searchParams.get('scope') || ''
  const state = searchParams.get('state') || ''
  const clientNameParam = searchParams.get('client_name') || ''

  const scopeList = scope ? scope.split(/[\s+]+/).filter(Boolean) : []

  useEffect(() => {
    if (!isInitialized) {
      initialize()
    }
  }, [isInitialized, initialize])

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }, [redirectUrl])

  useEffect(() => {
    if (!isInitialized) return
    if (!isAuthenticated) {
      const params = new URLSearchParams()
      if (clientId) params.set('client_id', clientId)
      if (redirectUri) params.set('redirect_uri', redirectUri)
      if (responseType) params.set('response_type', responseType)
      if (scope) params.set('scope', scope)
      if (state) params.set('state', state)
      setRedirectUrl(`/oauth/login?${params.toString()}`)
      return
    }

    if (!clientId || !redirectUri) {
      setError('缺少必要的授权参数（client_id 或 redirect_uri）')
      setLoading(false)
      return
    }

    let cancelled = false
    const fetchInfo = async () => {
      try {
        const res = await getAuthorizeInfo({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: responseType,
          scope,
          state,
        })
        const data = res.data?.data || res.data || {}
        if (!cancelled) {
          setClientName(data.client_name || data.name || clientNameParam || clientId)
        }
      } catch {
        if (!cancelled) {
          setClientName(clientNameParam || clientId)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    fetchInfo()
    return () => { cancelled = true }
  }, [isInitialized, isAuthenticated, clientId, redirectUri, responseType, scope, state, clientNameParam])

  const handleConsent = async (consent) => {
    setSubmitting(true)
    try {
      const res = await submitConsent({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        state,
        consent,
      })

      const data = res.data?.data || res.data || {}
      if (data.redirect_url || data.redirect_uri) {
        setRedirectUrl(data.redirect_url || data.redirect_uri)
        return
      }

      if (consent === 'deny') {
        const errorUrl = new URL(redirectUri)
        errorUrl.searchParams.set('error', 'access_denied')
        if (state) errorUrl.searchParams.set('state', state)
        setRedirectUrl(errorUrl.toString())
        return
      }

      const callbackUrl = new URL(redirectUri)
      if (data.code) callbackUrl.searchParams.set('code', data.code)
      if (state) callbackUrl.searchParams.set('state', state)
      setRedirectUrl(callbackUrl.toString())
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.error_description || err.response.data?.message || '授权请求失败'
      }
      showError(msg)
      setSubmitting(false)
    }
  }

  if (!isInitialized || loading) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="oauth-loading">加载中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-logo">
            <LogoIcon />
            <span className="auth-logo-text">隐向账户</span>
          </div>
          <div className="auth-card">
            <div className="oauth-error-state">
              <h1 className="auth-title">授权请求无效</h1>
              <p className="auth-subtitle">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const displayName = user?.nickname || user?.username || user?.email || '用户'

  return (
    <div className="auth-page">
      <div className="oauth-container">
        <div className="auth-logo">
          <LogoIcon />
          <span className="auth-logo-text">隐向账户</span>
        </div>

        <div className="oauth-consent-card">
          <div className="oauth-consent-header">
            <div className="oauth-consent-icon">
              <ShieldIcon />
            </div>
            <h1 className="oauth-consent-title">授权请求</h1>
            <p className="oauth-consent-subtitle">
              <strong>{clientName}</strong> 请求访问你的账户
            </p>
          </div>

          {scopeList.length > 0 && (
            <div className="oauth-scopes">
              <div className="oauth-scopes-title">该应用将获得以下权限：</div>
              <ul className="oauth-scopes-list">
                {scopeList.map((s) => (
                  <li key={s} className="oauth-scope-item">
                    <span className="oauth-scope-check"><CheckIcon /></span>
                    <div className="oauth-scope-info">
                      <span className="oauth-scope-label">
                        {SCOPE_LABELS[s] || s}
                      </span>
                      {SCOPE_DESCRIPTIONS[s] && (
                        <span className="oauth-scope-desc">{SCOPE_DESCRIPTIONS[s]}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="oauth-privacy-notice">
            <span className="oauth-privacy-icon"><LockIcon /></span>
            <span>你的数据将按照隐向隐私声明受到保护，该应用仅能访问你授权的信息。</span>
          </div>

          <div className="oauth-user-info">
            <span>以 <strong>{displayName}</strong> 身份登录</span>
          </div>

          <div className="oauth-consent-actions">
            <Button
              variant="danger"
              onClick={() => handleConsent('deny')}
              disabled={submitting}
            >
              拒绝
            </Button>
            <Button
              onClick={() => handleConsent('allow')}
              disabled={submitting}
            >
              {submitting ? '授权中...' : '同意授权'}
            </Button>
          </div>
        </div>

        <div className="auth-footer">
          授权即表示你同意隐向的{' '}
          <a href="#">服务协议</a> 和 <a href="#">隐私声明</a>
        </div>
      </div>
    </div>
  )
}
