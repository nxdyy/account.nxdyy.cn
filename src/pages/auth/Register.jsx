import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register, sendRegisterCode, confirmRegister } from '../../api/auth'
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

export default function Register() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      showError('两次输入的密码不一致')
      return
    }
    setLoading(true)
    try {
      const res = await register({ username: form.username, email: form.email, phone: form.phone || undefined, password: form.password })
      const data = res.data.data
      if (data?.need_verify) {
        showSuccess('注册成功，请验证你的邮箱')
        setStep(2)
      } else {
        showSuccess('注册成功')
        setStep(3)
      }
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '注册失败'
      }
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSendCode = async () => {
    setLoading(true)
    try {
      await sendRegisterCode({ email: form.email })
      showSuccess('验证码已发送到你的邮箱')
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
    setLoading(true)
    try {
      await confirmRegister({ username: form.username, code })
      showSuccess('帐户激活成功')
      setStep(3)
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
          {step === 3 ? (
            <>
              <h1 className="auth-title">注册完成</h1>
              <p className="auth-subtitle">你的帐户已成功创建并激活</p>
              <div className="auth-success">帐户激活成功</div>
              <Link to="/login" style={{ display: 'block', textAlign: 'center', marginTop: 'var(--spacing-base)', color: 'var(--color-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                前往登录
              </Link>
            </>
          ) : step === 2 ? (
            <>
              <h1 className="auth-title">验证邮箱</h1>
              <p className="auth-subtitle">我们已向 {form.email} 发送了验证码</p>
              <form onSubmit={handleConfirm}>
                <FormGroup>
                  <FormLabel htmlFor="code">验证码</FormLabel>
                  <FormInput
                    id="code"
                    type="text"
                    placeholder="请输入验证码"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </FormGroup>
                <Button type="submit" full disabled={loading}>
                  {loading ? '验证中...' : '激活帐户'}
                </Button>
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-base)' }}>
                  <Button type="button" variant="text" onClick={handleSendCode} disabled={loading}>
                    重新发送验证码
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth-title">创建帐户</h1>
              <p className="auth-subtitle">创建一个新的隐向账户</p>
              <form onSubmit={handleRegister}>
                <FormGroup>
                  <FormLabel htmlFor="username">用户名</FormLabel>
                  <FormInput
                    id="username"
                    type="text"
                    placeholder="请输入用户名"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="email">邮箱地址</FormLabel>
                  <FormInput
                    id="email"
                    type="email"
                    placeholder="请输入邮箱地址"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="phone">手机号</FormLabel>
                  <FormInput
                    id="phone"
                    type="tel"
                    placeholder="请输入手机号（选填）"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="password">密码</FormLabel>
                  <FormInput
                    id="password"
                    type="password"
                    placeholder="请输入密码（至少8位，包含大小写字母和数字）"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="confirmPassword">确认密码</FormLabel>
                  <FormInput
                    id="confirmPassword"
                    type="password"
                    placeholder="请再次输入密码"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                </FormGroup>
                <Button type="submit" full disabled={loading}>
                  {loading ? '注册中...' : '创建帐户'}
                </Button>
                <div className="auth-links" style={{ justifyContent: 'center' }}>
                  <Link to="/login">已有帐户？登录</Link>
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
      <AuthFooter />
    </div>
  )
}
