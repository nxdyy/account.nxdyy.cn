import { useState, useEffect } from 'react'
import { getDashboard, getLoginLogs, getActionLogs } from '../../api/admin'
import Card, { CardHeader, CardBody } from '../../components/Card'
import Table, { Badge } from '../../components/Table'
import './Admin.css'
import '../account/Account.css'

function DashboardIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
}

function ActivityIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
}

function UsersIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}

export default function AdminDashboard() {
  const [welcome, setWelcome] = useState('')
  const [recentLogins, setRecentLogins] = useState([])
  const [recentActions, setRecentActions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDashboard().then((res) => setWelcome(res.data.data?.message || '')).catch(() => {}),
      getLoginLogs({ page: 1, page_size: 5 }).then((res) => {
        const data = res.data.data
        setRecentLogins(data.list || [])
      }).catch(() => {}),
      getActionLogs({ page: 1, page_size: 5 }).then((res) => {
        const data = res.data.data
        setRecentActions(data.list || [])
      }).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-state">加载中...</div>

  const loginColumns = [
    { key: 'created_at', title: '时间', render: (v) => v ? new Date(v).toLocaleString() : '-' },
    { key: 'user_id', title: '用户ID' },
    { key: 'success', title: '状态', render: (v) => v === true ? <Badge type="success">成功</Badge> : <Badge type="danger">失败</Badge> },
    { key: 'ip_address', title: 'IP 地址' },
  ]

  const actionColumns = [
    { key: 'created_at', title: '时间', render: (v) => v ? new Date(v).toLocaleString() : '-' },
    { key: 'user_id', title: '用户ID' },
    { key: 'action', title: '操作', render: (v) => <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{v}</span> },
    { key: 'target', title: '目标类型', render: (v) => v || '-' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">管理仪表盘</h1>
          <p className="page-subtitle">{welcome || '系统概览'}</p>
        </div>
      </div>

      <Card>
        <CardHeader icon={DashboardIcon} title="欢迎使用管理后台" subtitle={welcome || '隐向账户管理系统'} accent />
        <CardBody>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            通过左侧导航栏访问各管理功能。您拥有以下管理模块的访问权限：
            <ul style={{ marginTop: 'var(--spacing-sm)', paddingLeft: 'var(--spacing-lg)' }}>
              <li>用户管理 - 查看、创建、编辑和管理系统用户</li>
              <li>角色管理 - 管理角色定义和权限分配</li>
              <li>权限管理 - 管理系统权限点定义</li>
              <li>安全策略 - 配置密码策略和登录安全设置</li>
              <li>SSO 客户端 - 管理 OAuth2 单点登录应用</li>
              <li>审计日志 - 查看登录和操作日志</li>
              <li>系统运维 - 管理 API 权限映射</li>
            </ul>
          </div>
        </CardBody>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-base)' }}>
        <Card>
          <CardHeader icon={ActivityIcon} title="最近登录" accent />
          <CardBody position="top">
            <Table columns={loginColumns} data={recentLogins} emptyText="暂无登录记录" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={UsersIcon} title="最近操作" accent />
          <CardBody position="top">
            <Table columns={actionColumns} data={recentActions} emptyText="暂无操作记录" />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
