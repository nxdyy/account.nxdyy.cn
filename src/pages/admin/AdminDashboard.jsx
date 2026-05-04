import { useState, useEffect } from 'react'
import { getDashboard, getUsers, getRoles, getLoginLogs } from '../../api/admin'
import Card, { CardHeader, CardBody, CardRow } from '../../components/Card'
import Table from '../../components/Table'
import './Admin.css'
import '../account/Account.css'

function DashboardIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
}

function UsersIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}

function RoleIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
}

function ActivityIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentLogins, setRecentLogins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDashboard().then((res) => setStats(res.data.data)).catch(() => {}),
      getLoginLogs({ page: 1, page_size: 5 }).then((res) => {
        const data = res.data.data
        setRecentLogins(data.list || data || [])
      }).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-state">加载中...</div>

  const statCards = [
    { label: '用户总数', value: stats?.total_users ?? '-', icon: UsersIcon, desc: '系统注册用户总数' },
    { label: '角色数量', value: stats?.total_roles ?? '-', icon: RoleIcon, desc: '系统中定义的角色' },
    { label: '今日登录', value: stats?.today_logins ?? '-', icon: ActivityIcon, desc: '今日登录次数' },
    { label: '活跃会话', value: stats?.active_sessions ?? '-', icon: DashboardIcon, desc: '当前活跃会话数' },
  ]

  const loginColumns = [
    { key: 'created_at', title: '时间', render: (v) => v ? new Date(v).toLocaleString() : '-' },
    { key: 'username', title: '用户' },
    { key: 'success', title: '状态', render: (v) => <span className={`badge badge-${v ? 'success' : 'danger'}`}>{v ? '成功' : '失败'}</span> },
    { key: 'ip_address', title: 'IP 地址' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">管理仪表盘</h1>
          <p className="page-subtitle">系统概览和关键数据</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-base)', marginBottom: 'var(--spacing-xl)' }}>
        {statCards.map((item) => (
          <Card key={item.label}>
            <CardBody>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-sidebar-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--color-primary)' }}>
                  <item.icon />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{item.value}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{item.desc}</div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader icon={ActivityIcon} title="最近登录" accent />
        <CardBody position="top">
          <Table columns={loginColumns} data={recentLogins} emptyText="暂无登录记录" />
        </CardBody>
      </Card>
    </div>
  )
}
