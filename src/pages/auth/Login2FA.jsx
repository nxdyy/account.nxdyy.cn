import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Button from '../../components/Button'
import { FormGroup, FormLabel, FormInput } from '../../components/Input'
import './Auth.css'

export default function Login2FA() {
  const navigate = useNavigate()
  const { verify2FA, isLoading, need2FA } = useAuthStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  if (!need2FA) {
    navigate('/login', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await verify2FA(code)
      navigate('/account')
    } catch (err) {
      const msg = err.response?.data?.message || '验证码错误，请重试'
      setError(msg)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">二步验证</h1>
          <p className="auth-subtitle">请输入你的验证器应用中的验证码以完成登录</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="code">验证码</FormLabel>
              <FormInput
                id="code"
                type="text"
                placeholder="请输入 6 位验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
              />
            </FormGroup>

            <Button type="submit" full disabled={isLoading}>
              {isLoading ? '验证中...' : '验证'}
            </Button>

            <div className="auth-links" style={{ justifyContent: 'center' }}>
              <Link to="/login">返回登录</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
