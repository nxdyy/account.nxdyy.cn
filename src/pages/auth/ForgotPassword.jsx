import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword, confirmForgotPassword } from '../../api/auth'
import { showError, showSuccess } from '../../store/toastStore'
import Button from '../../components/Button'
import { FormGroup, FormLabel, FormInput } from '../../components/Input'
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

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPassword({ email })
      showSuccess('重置密码的验证码已发送到你的邮箱')
      setStep(2)
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '请求失败'
      }
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmReset = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showError('两次输入的密码不一致')
      return
    }
    setLoading(true)
    try {
      await confirmForgotPassword({ email, code, new_password: newPassword })
      showSuccess('密码重置成功')
      setStep(3)
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '重置失败'
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
          {step === 3 ? (
            <>
              <h1 className="auth-title">密码已重置</h1>
              <p className="auth-subtitle">你的密码已成功重置</p>
              <div className="auth-success">密码重置成功</div>
              <Link to="/login" style={{ display: 'block', textAlign: 'center', marginTop: 'var(--spacing-base)', color: 'var(--color-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                前往登录
              </Link>
            </>
          ) : step === 2 ? (
            <>
              <h1 className="auth-title">重置密码</h1>
              <p className="auth-subtitle">请输入发送到 {email} 的验证码和新密码</p>
              <form onSubmit={handleConfirmReset}>
                <FormGroup>
                  <FormLabel htmlFor="code">验证码</FormLabel>
                  <FormInput id="code" type="text" placeholder="请输入验证码" value={code} onChange={(e) => setCode(e.target.value)} required />
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="newPassword">新密码</FormLabel>
                  <FormInput id="newPassword" type="password" placeholder="请输入新密码" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="confirmPassword">确认新密码</FormLabel>
                  <FormInput id="confirmPassword" type="password" placeholder="请再次输入新密码" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </FormGroup>
                <Button type="submit" full disabled={loading}>
                  {loading ? '重置中...' : '重置密码'}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth-title">找回密码</h1>
              <p className="auth-subtitle">输入你的邮箱地址，我们将发送验证码帮助你重置密码</p>
              <form onSubmit={handleRequestReset}>
                <FormGroup>
                  <FormLabel htmlFor="email">邮箱地址</FormLabel>
                  <FormInput id="email" type="email" placeholder="请输入注册时使用的邮箱" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </FormGroup>
                <Button type="submit" full disabled={loading}>
                  {loading ? '发送中...' : '发送验证码'}
                </Button>
                <div className="auth-links" style={{ justifyContent: 'center' }}>
                  <Link to="/login">返回登录</Link>
                </div>
              </form>
            </>
          )}
        </div>

        <div className="auth-footer">
          继续即表示你同意隐向的{' '}
          <a href="#">服务协议</a> 和 <a href="#">隐私声明</a>
        </div>
      </div>
    </div>
  )
}
