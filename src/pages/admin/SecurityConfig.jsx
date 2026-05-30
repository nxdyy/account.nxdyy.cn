import { useState, useEffect } from 'react'
import { getSecurityConfig, updateSecurityConfig } from '../../api/admin'
import { showError, showSuccess } from '../../store/toastStore'
import Card, { CardHeader, CardBody } from '../../components/Card'
import Button from '../../components/Button'
import { FormGroup, FormLabel, FormInput, FormCheckbox } from '../../components/Input'
import './Admin.css'
import '../account/Account.css'

function ConfigIconSvg() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
}

export default function SecurityConfig() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({})

  useEffect(() => {
    getSecurityConfig().then((res) => {
      const data = res.data.data || {}
      setForm(data)
    }).catch(() => {
      // ignore
    }).finally(() => setLoading(false))
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSuccess('')
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await updateSecurityConfig(form)
      setSuccess('安全策略已更新')
      showSuccess('安全策略已更新')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '保存失败'
      }
      setError(msg)
      showError(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading-state">加载中...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">安全策略</h1>
          <p className="page-subtitle">配置系统安全策略和密码策略</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? '保存中...' : '保存更改'}
        </Button>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      <Card>
        <CardHeader icon={ConfigIconSvg} title="密码策略" accent />
        <CardBody>
          <div className="admin-config-section">
            <div className="admin-form-grid">
              <FormGroup>
                <FormLabel>最小密码长度</FormLabel>
                <FormInput
                  type="number"
                  min={4}
                  max={64}
                  value={form.password_min_length || 8}
                  onChange={(e) => handleChange('password_min_length', Number(e.target.value))}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>最大登录失败次数</FormLabel>
                <FormInput
                  type="number"
                  min={1}
                  max={20}
                  value={form.max_login_failures || 5}
                  onChange={(e) => handleChange('max_login_failures', Number(e.target.value))}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>锁定时长（分钟）</FormLabel>
                <FormInput
                  type="number"
                  min={1}
                  max={1440}
                  value={form.lock_duration_minutes || 15}
                  onChange={(e) => handleChange('lock_duration_minutes', Number(e.target.value))}
                />
              </FormGroup>
            </div>
          </div>

          <div className="admin-config-section">
            <FormGroup>
              <FormCheckbox
                id="require_upper"
                label="必须包含大写字母"
                checked={form.password_require_upper !== false}
                onChange={(e) => handleChange('password_require_upper', e.target.checked)}
              />
            </FormGroup>
            <FormGroup>
              <FormCheckbox
                id="require_digit"
                label="必须包含数字"
                checked={form.password_require_digit !== false}
                onChange={(e) => handleChange('password_require_digit', e.target.checked)}
              />
            </FormGroup>
            <FormGroup>
              <FormCheckbox
                id="require_symbol"
                label="必须包含特殊字符"
                checked={form.password_require_symbol === true}
                onChange={(e) => handleChange('password_require_symbol', e.target.checked)}
              />
            </FormGroup>
          </div>

          <div className="admin-config-section">
            <FormGroup>
              <FormCheckbox
                id="force_twofa_admin"
                label="管理员必须启用两步验证"
                checked={form.force_twofa_for_admin !== false}
                onChange={(e) => handleChange('force_twofa_for_admin', e.target.checked)}
              />
            </FormGroup>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={ConfigIconSvg} title="注册策略" accent />
        <CardBody>
          <div className="admin-config-section">
            <FormGroup>
              <FormCheckbox
                id="phone_required"
                label="注册时手机号必填"
                checked={form.phone_required === true}
                onChange={(e) => handleChange('phone_required', e.target.checked)}
              />
              <div className="form-hint">开启后，用户注册时必须填写手机号</div>
            </FormGroup>
            <FormGroup>
              <FormCheckbox
                id="email_required"
                label="注册时邮箱必填"
                checked={form.email_required !== false}
                onChange={(e) => handleChange('email_required', e.target.checked)}
              />
              <div className="form-hint">开启后，用户注册时必须填写邮箱</div>
            </FormGroup>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
