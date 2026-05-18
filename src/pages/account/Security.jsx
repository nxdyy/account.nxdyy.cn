import { useState, useEffect } from 'react'
import { get2FASetup, enable2FA, disable2FA, get2FAStatus, getSecurityAlerts, markAlertRead } from '../../api/user'
import { changePassword } from '../../api/auth'
import { showError, showSuccess } from '../../store/toastStore'
import Card, { CardHeader, CardBody, CardRow } from '../../components/Card'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import { FormGroup, FormLabel, FormInput } from '../../components/Input'
import './Account.css'

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}

function KeyIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
}

function BellIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
}

export default function Security() {
  const [twofaSetup, setTwofaSetup] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [pwdModal, setPwdModal] = useState(false)
  const [twofaModal, setTwofaModal] = useState(false)
  const [twofaCode, setTwofaCode] = useState('')
  const [backupCodes, setBackupCodes] = useState(null)
  const [pwdForm, setPwdForm] = useState({ old_password: '', new_password: '', confirm_password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)
  const [twofaEnabled, setTwofaEnabled] = useState(false)

  const refresh2FAStatus = async () => {
    try {
      const res = await get2FAStatus()
      setTwofaEnabled(res.data.data?.twofa_enabled ?? false)
    } catch {
      setTwofaEnabled(false)
    }
  }

  useEffect(() => {
    refresh2FAStatus()
    getSecurityAlerts().then((res) => {
      const data = res.data.data
      setAlerts(data?.list || data || [])
    }).catch(() => {})
  }, [])

  const openEnableModal = async () => {
    setError('')
    setTwofaCode('')
    setTwofaSetup(null)
    setSetupLoading(true)
    setTwofaModal(true)
    try {
      const res = await get2FASetup()
      setTwofaSetup(res.data.data)
    } catch {
      const msg = '获取设置信息失败'
      setError(msg)
      showError(msg)
    } finally {
      setSetupLoading(false)
    }
  }

  const handleEnable2FA = async () => {
    setLoading(true)
    setError('')
    try {
      await enable2FA({ code: twofaCode })
      await refresh2FAStatus()
      setTwofaModal(false)
      setTwofaCode('')
      setTwofaSetup(null)
      showSuccess('两步验证已启用')
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '启用失败'
      }
      setError(msg)
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    setLoading(true)
    setError('')
    try {
      await disable2FA({ code: twofaCode })
      await refresh2FAStatus()
      setTwofaModal(false)
      setTwofaCode('')
      showSuccess('两步验证已关闭')
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '关闭失败'
      }
      setError(msg)
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGetBackupCodes = async () => {
    setLoading(true)
    try {
      const res = await get2FAStatus()
      setBackupCodes(res.data.data?.backup_codes || [])
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '获取失败'
      }
      setError(msg)
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePwd = async () => {
    setError('')
    if (pwdForm.new_password !== pwdForm.confirm_password) {
      const msg = '两次输入的新密码不一致'
      setError(msg)
      showError(msg)
      return
    }
    setLoading(true)
    try {
      await changePassword({
        old_password: pwdForm.old_password,
        new_password: pwdForm.new_password,
      })
      setSuccess('密码修改成功')
      showSuccess('密码修改成功')
      setPwdModal(false)
      setPwdForm({ old_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '修改失败'
      }
      setError(msg)
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReadAlert = async (id) => {
    try {
      await markAlertRead(id)
      setAlerts((prev) => prev.filter((a) => a.id !== id))
    } catch {}
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">安全</h1>
          <p className="page-subtitle">保护你的帐户安全，管理认证方式和安全提醒</p>
        </div>
      </div>

      <Card>
        <CardHeader icon={ShieldIcon} title="两步验证" subtitle={twofaEnabled ? '两步验证已启用' : '提高帐户安全性，启用两步验证'} accent />
        <CardBody>
          <CardRow
            label="状态"
            value={twofaEnabled ? '已启用' : '未启用'}
            action={
              twofaEnabled ? (
                <Button variant="danger" size="sm" onClick={() => { setError(''); setTwofaCode(''); setTwofaSetup(null); setTwofaModal(true) }}>关闭</Button>
              ) : (
                <Button variant="primary" size="sm" onClick={openEnableModal}>启用</Button>
              )
            }
          />
          {twofaEnabled && (
            <CardRow
              label="备用验证码"
              value="在无法使用验证器时使用备用验证码"
              action={<Button variant="text" onClick={handleGetBackupCodes}>查看</Button>}
            />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={KeyIcon} title="密码" subtitle="修改你的登录密码" accent />
        <CardBody>
          <CardRow
            label="密码"
            value="建议定期更新密码以保证帐户安全"
            action={<Button variant="text" onClick={() => { setError(''); setSuccess(''); setPwdModal(true) }}>更改密码</Button>}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={BellIcon} title="安全提醒" subtitle="查看帐户安全相关提醒" accent />
        <CardBody>
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
              暂无安全提醒
            </div>
          ) : (
            alerts.map((alert) => (
              <CardRow key={alert.id} label={alert.title} value={alert.content}>
                <Button variant="text" size="sm" onClick={() => handleReadAlert(alert.id)}>标记已读</Button>
              </CardRow>
            ))
          )}
        </CardBody>
      </Card>

      <Modal
        open={twofaModal}
        onClose={() => setTwofaModal(false)}
        title={twofaEnabled ? '关闭两步验证' : '启用两步验证'}
        footer={
          twofaEnabled ? (
            <>
              <Button variant="secondary" onClick={() => setTwofaModal(false)}>取消</Button>
              <Button variant="danger" onClick={handleDisable2FA} disabled={loading}>确认关闭</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setTwofaModal(false)}>取消</Button>
              <Button onClick={handleEnable2FA} disabled={loading || !twofaSetup}>确认启用</Button>
            </>
          )
        }
      >
        {error && <div className="auth-error">{error}</div>}
        {!twofaEnabled && (
          setupLoading ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', color: 'var(--color-text-tertiary)' }}>
              加载设置信息...
            </div>
          ) : twofaSetup?.qrcode_url ? (
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-base)' }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(twofaSetup.qrcode_url)}`} alt="2FA QR Code" style={{ maxWidth: 180, margin: '0 auto' }} />
              <p className="text-secondary" style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-sm)' }}>
                密钥: {twofaSetup.secret}
              </p>
            </div>
          ) : null
        )}
        <FormGroup>
          <FormLabel>验证码</FormLabel>
          <FormInput
            value={twofaCode}
            onChange={(e) => setTwofaCode(e.target.value)}
            placeholder="请输入验证器应用中的 6 位验证码"
            maxLength={6}
          />
        </FormGroup>
      </Modal>

      <Modal open={!!backupCodes} onClose={() => setBackupCodes(null)} title="备用验证码">
        <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-base)' }}>
          请妥善保存以下备用验证码，每个验证码只能使用一次
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
          {(backupCodes || []).map((c, i) => (
            <div key={i} style={{ padding: 'var(--spacing-sm)', background: 'var(--color-sidebar-bg)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
              {c}
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={pwdModal}
        onClose={() => setPwdModal(false)}
        title="更改密码"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPwdModal(false)}>取消</Button>
            <Button onClick={handleChangePwd} disabled={loading}>{loading ? '保存中...' : '保存'}</Button>
          </>
        }
      >
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <FormGroup>
          <FormLabel>当前密码</FormLabel>
          <FormInput type="password" value={pwdForm.old_password} onChange={(e) => setPwdForm({ ...pwdForm, old_password: e.target.value })} placeholder="请输入当前密码" />
        </FormGroup>
        <FormGroup>
          <FormLabel>新密码</FormLabel>
          <FormInput type="password" value={pwdForm.new_password} onChange={(e) => setPwdForm({ ...pwdForm, new_password: e.target.value })} placeholder="请输入新密码" />
        </FormGroup>
        <FormGroup>
          <FormLabel>确认新密码</FormLabel>
          <FormInput type="password" value={pwdForm.confirm_password} onChange={(e) => setPwdForm({ ...pwdForm, confirm_password: e.target.value })} placeholder="请再次输入新密码" />
        </FormGroup>
      </Modal>
    </div>
  )
}
