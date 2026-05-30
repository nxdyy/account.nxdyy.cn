import { useState, useEffect } from 'react'
import { getSessions, getCurrentSession, revokeSession, revokeAllSessions } from '../../api/user'
import Card, { CardHeader, CardBody, CardRow } from '../../components/Card'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import './Account.css'

function DeviceIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
}

function MonitorIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
}

function SmartphoneIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
}

export default function Devices() {
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmModal, setConfirmModal] = useState(false)
  const [actionTarget, setActionTarget] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [sRes, cRes] = await Promise.all([getSessions(), getCurrentSession()])
      setSessions(sRes.data.data || [])
      setCurrentSession(cRes.data.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRevoke = async (sessionId) => {
    try {
      await revokeSession(sessionId)
      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId))
    } catch {
      // ignore
    }
    setConfirmModal(false)
  }

  const handleRevokeAll = async () => {
    try {
      await revokeAllSessions()
      await fetchData()
    } catch {
      // ignore
    }
    setConfirmModal(false)
  }

  const detectIcon = (userAgent) => {
    const ua = (userAgent || '').toLowerCase()
    return ua.includes('mobile') || ua.includes('phone') || ua.includes('android') || ua.includes('iphone')
      ? SmartphoneIcon : MonitorIcon
  }

  if (loading) {
    return <div className="loading-state">加载中...</div>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">设备</h1>
          <p className="page-subtitle">管理所有已登录的设备</p>
        </div>
        {sessions.length > 1 && (
          <Button variant="danger" size="sm" onClick={() => { setActionTarget('all'); setConfirmModal(true) }}>
            退出所有其他设备
          </Button>
        )}
      </div>

      {currentSession && (
        <Card>
          <CardHeader icon={DeviceIcon} title="当前设备" subtitle="你正在使用此设备" accent />
          <CardBody>
            <CardRow label="设备名称" value={currentSession.device_name || '未知设备'} />
            <CardRow label="设备信息" value={currentSession.user_agent || '未知'} />
            <CardRow label="IP 地址" value={currentSession.ip_address || '未知'} />
            {currentSession.location && <CardRow label="位置" value={currentSession.location} />}
            <CardRow label="最后活跃" value={currentSession.last_seen_at ? new Date(currentSession.last_seen_at).toLocaleString() : '刚刚'} />
          </CardBody>
        </Card>
      )}

      {sessions.filter(s => !s.is_current).length > 0 && (
        <>
          <h2 className="section-header">其他设备</h2>
          {sessions.filter(s => !s.is_current).map((session) => {
            const Icon = detectIcon(session.user_agent)
            return (
              <Card key={session.id || session.session_id}>
                <CardHeader
                  icon={Icon}
                  title={session.device_name || '未知设备'}
                  subtitle={`${session.ip_address || '未知IP'} - ${session.location || ''}`}
                  action={
                    <Button variant="danger" size="sm" onClick={() => { setActionTarget(session.session_id); setConfirmModal(true) }}>
                      退出
                    </Button>
                  }
                />
                <CardBody>
                  <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                    最后活跃: {session.last_seen_at ? new Date(session.last_seen_at).toLocaleString() : '未知'}
                  </p>
                  <p className="text-tertiary" style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-xs)' }}>
                    {(session.user_agent || '').substring(0, 80)}
                  </p>
                </CardBody>
              </Card>
            )
          })}
        </>
      )}

      <Modal
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="确认操作"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModal(false)}>取消</Button>
            <Button variant="danger" onClick={() => actionTarget === 'all' ? handleRevokeAll() : handleRevoke(actionTarget)}>
              确认
            </Button>
          </>
        }
      >
        <p className="text-secondary">
          {actionTarget === 'all'
            ? '确认要退出除当前设备外的所有设备吗？'
            : '确认要退出该设备的登录吗？'}
        </p>
      </Modal>
    </div>
  )
}
