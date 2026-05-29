import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { showError } from '../../store/toastStore'
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

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [form, setForm] = useState({ username: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await login(form.username, form.password)
      if (result.need2FA) {
        navigate('/login/2fa')
      } else {
        navigate('/account')
      }
    } catch (err) {
      let msg
      if (!err.response) {
        // 网络错误（无响应）
        msg = '无法连接到服务器，请检查网络连接'
      } else if (err.response.status === 401) {
        // 认证失败（账号或密码错误）
        msg = err.response.data?.message || '登录失败，请检查账号和密码'
      } else {
        // 其他错误
        msg = err.response.data?.message || '登录失败，请稍后重试'
      }
      showError(msg)
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
          <h1 className="auth-title">登录</h1>
          <p className="auth-subtitle">使用你的隐向账户登录</p>

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

            <div className="auth-links">
              <Link to="/forgot-password">忘记密码</Link>
              <Link to="/register">创建新帐户</Link>
            </div>
          </form>
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
