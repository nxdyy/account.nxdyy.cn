import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { sendRegisterCode, confirmRegister } from '../../api/auth'
import { showError, showSuccess } from '../../store/toastStore'
import Button from '../../components/Button'
import { FormGroup, FormLabel, FormInput } from '../../components/Input'
import AuthFooter from '../../components/AuthFooter'
import './Auth.css'

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

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48, margin: '0 auto var(--spacing-base)', display: 'block', color: 'var(--color-primary)' }}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

export default function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { username, email } = location.state || {}
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSendCode = async () => {
    if (!username) {
      showError('缺少用户名信息，请返回登录页面重试')
      return
    }
    setLoading(true)
    try {
      await sendRegisterCode({ username })
      showSuccess('验证码已发送，请检查邮箱')
      setSent(true)
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '发送验证码失败'
      }
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (e) => {
    e.preventDefault()
    if (!username && !email) {
      showError('缺少用户信息，请返回登录页面重试')
      return
    }
    setLoading(true)
    try {
      const params = { code }
      if (username) {
        params.username = username
      } else {
        params.email = email
      }
      await confirmRegister(params)
      showSuccess('邮箱验证成功，请登录')
      navigate('/login')
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '验证失败'
      }
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <LogoIcon />
          <span className="auth-logo-text">隐向账户</span>
        </div>
        <div className="auth-card">
          <MailIcon />
          <h1 className="auth-title">验证邮箱</h1>
          <p className="auth-subtitle">
            {sent
              ? '验证码已发送到你的邮箱，请输入验证码完成验证'
              : '你的邮箱尚未验证，需要验证后才能登录'}
          </p>

          {!sent ? (
            <div style={{ textAlign: 'center' }}>
              <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-base)' }}>
                点击下方按钮发送验证码到你的注册邮箱
              </p>
              <Button onClick={handleSendCode} disabled={loading} full>
                {loading ? '发送中...' : '发送验证码'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleConfirm}>
              <FormGroup>
                <FormLabel htmlFor="code">验证码</FormLabel>
                <FormInput
                  id="code"
                  type="text"
                  placeholder="请输入6位验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </FormGroup>
              <Button type="submit" full disabled={loading}>
                {loading ? '验证中...' : '验证邮箱'}
              </Button>
              <div style={{ textAlign: 'center', marginTop: 'var(--spacing-base)' }}>
                <Button type="button" variant="text" onClick={handleSendCode} disabled={loading}>
                  重新发送验证码
                </Button>
              </div>
            </form>
          )}

          <div className="auth-links" style={{ justifyContent: 'center', marginTop: 'var(--spacing-base)' }}>
            <Link to="/login">返回登录</Link>
          </div>
        </div>

        <div className="auth-footer">
          继续即表示你同意隐向的{' '}
          <a href="#">服务协议</a> 和 <a href="#">隐私声明</a>
        </div>
      </div>
      <AuthFooter />
    </div>
  )
}
