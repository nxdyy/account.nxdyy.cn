import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { showError } from '../../store/toastStore'
import Button from '../../components/Button'
import { FormGroup, FormLabel, FormInput } from '../../components/Input'
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

export default function OAuthLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, isLoading, isAuthenticated, initialize, isInitialized } = useAuthStore()
  const [form, setForm] = useState({ username: '', password: '' })

  const clientId = searchParams.get('client_id') || ''
  const redirectUri = searchParams.get('redirect_uri') || ''
  const responseType = searchParams.get('response_type') || ''
  const scope = searchParams.get('scope') || ''
  const state = searchParams.get('state') || ''

  useEffect(() => {
    if (!isInitialized) {
      initialize()
    }
  }, [isInitialized, initialize])

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const params = new URLSearchParams()
      if (clientId) params.set('client_id', clientId)
      if (redirectUri) params.set('redirect_uri', redirectUri)
      if (responseType) params.set('response_type', responseType)
      if (scope) params.set('scope', scope)
      if (state) params.set('state', state)
      navigate(`/oauth/authorize?${params.toString()}`, { replace: true })
    }
  }, [isInitialized, isAuthenticated, navigate, clientId, redirectUri, responseType, scope, state])

  const buildOAuthParams = () => {
    const params = new URLSearchParams()
    if (clientId) params.set('client_id', clientId)
    if (redirectUri) params.set('redirect_uri', redirectUri)
    if (responseType) params.set('response_type', responseType)
    if (scope) params.set('scope', scope)
    if (state) params.set('state', state)
    return params.toString()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await login(form.username, form.password)
      if (result.need2FA) {
        navigate(`/login/2fa?${buildOAuthParams()}`)
      } else {
        navigate(`/oauth/authorize?${buildOAuthParams()}`)
      }
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else if (err.response.status === 401) {
        msg = err.response.data?.message || '登录失败，请检查账号和密码'
      } else {
        msg = err.response.data?.message || '登录失败，请稍后重试'
      }
      showError(msg)
    }
  }

  if (!isInitialized) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="oauth-loading">加载中...</div>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <LogoIcon />
          <span className="auth-logo-text">隐向账户</span>
        </div>
        <div className="auth-card">
          <h1 className="auth-title">登录以继续</h1>
          <p className="auth-subtitle">
            {clientId
              ? `应用 ${clientId} 请求访问你的账户，请先登录`
              : '请登录你的隐向账户以继续'}
          </p>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="username">邮箱或用户名</FormLabel>
              <FormInput
                id="username"
                type="text"
                placeholder="请输入邮箱或用户名"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="password">密码</FormLabel>
              <FormInput
                id="password"
                type="password"
                placeholder="请输入密码"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </FormGroup>

            <Button type="submit" full disabled={isLoading}>
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>
        </div>

        <div className="auth-footer">
          继续即表示你同意隐向的{' '}
          <a href="#">服务协议</a> 和 <a href="#">隐私声明</a>
        </div>
      </div>
    </div>
  )
}
