import { useEffect, useState } from 'react'
import useAuthStore from '../../store/authStore'
import { get2FAStatus, getSessions } from '../../api/user'
import Card, { CardHeader, CardBody, CardRow } from '../../components/Card'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import './Account.css'

function PeopleIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}

function DeviceIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
}

function PrivacyIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}

export default function Overview() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [twofaEnabled, setTwofaEnabled] = useState(false)
  const [sessionCount, setSessionCount] = useState(null)

  useEffect(() => {
    get2FAStatus().then((res) => {
      setTwofaEnabled(res.data.data?.twofa_enabled ?? false)
    }).catch(() => {})
    getSessions().then((res) => {
      const sessions = res.data.data?.list || res.data.data || []
      setSessionCount(Array.isArray(sessions) ? sessions.length : 0)
    }).catch(() => {})
  }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">帐户</h1>
          <p className="page-subtitle">管理你的帐户信息、安全设置和隐私偏好</p>
        </div>
      </div>

      <Card>
        <CardHeader icon={PeopleIcon} title="你的信息" subtitle="管理你的个人资料和联系方式" accent />
        <CardBody>
          <CardRow
            label="显示名称"
            value={user?.nickname || user?.username || user?.email}
            action={<Button variant="text" onClick={() => navigate('/account/info')}>编辑</Button>}
          />
          <CardRow
            label="邮箱地址"
            value={user?.email}
            action={<Button variant="text" onClick={() => navigate('/account/info')}>管理</Button>}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={ShieldIcon} title="安全" subtitle="保护你的帐户安全" accent />
        <CardBody>
          <CardRow
            label="两步验证"
            value={twofaEnabled ? '已启用' : '未启用'}
            action={<Button variant="text" onClick={() => navigate('/account/security')}>管理</Button>}
          />
          <CardRow
            label="密码"
            value="建议定期更新密码以保证安全"
            action={<Button variant="text" onClick={() => navigate('/account/security')}>更改</Button>}
          />
          <CardRow
            label="活跃会话"
            value={sessionCount !== null ? `${sessionCount} 个活跃会话` : '加载中...'}
            action={<Button variant="text" onClick={() => navigate('/account/devices')}>查看</Button>}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={DeviceIcon} title="设备" subtitle="管理你的登录设备" accent />
        <CardBody>
          <CardRow
            label="当前设备"
            value="查看并管理所有已登录的设备"
            action={<Button variant="text" onClick={() => navigate('/account/devices')}>查看</Button>}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={PrivacyIcon} title="隐私" subtitle="管理你的隐私设置和数据偏好" accent />
        <CardBody>
          <CardRow
            label="隐私仪表板"
            value="查看和控制你的隐私数据"
            action={<Button variant="text" onClick={() => navigate('/account/privacy')}>查看</Button>}
          />
        </CardBody>
      </Card>
    </div>
  )
}
