import { useState, useEffect } from 'react'
import { getMyLoginLogs, getMyActionLogs } from '../../api/user'
import Card, { CardHeader, CardBody } from '../../components/Card'
import Table, { Badge } from '../../components/Table'
import './Account.css'

function PrivacyIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}

function EyeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
}

export default function Privacy() {
  const [loginLogs, setLoginLogs] = useState([])
  const [actionLogs, setActionLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [loginTotal, setLoginTotal] = useState(0)
  const [actionTotal, setActionTotal] = useState(0)

  useEffect(() => {
    Promise.all([
      getMyLoginLogs({ page: 1, page_size: 20 }),
      getMyActionLogs({ page: 1, page_size: 20 }),
    ]).then(([lRes, aRes]) => {
      const lData = lRes.data.data || {}
      const aData = aRes.data.data || {}
      setLoginLogs(lData.list || [])
      setLoginTotal(lData.total || 0)
      setActionLogs(aData.list || [])
      setActionTotal(aData.total || 0)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const loginColumns = [
    { key: 'created_at', title: '时间', render: (v) => v ? new Date(v).toLocaleString() : '-' },
    { key: 'success', title: '状态', render: (v) => v === true ? <Badge type="success">成功</Badge> : <Badge type="danger">失败</Badge> },
    { key: 'ip_address', title: 'IP 地址' },
    { key: 'user_agent', title: '设备信息', render: (v) => v ? <span className="text-sm">{v.substring(0, 40)}</span> : '-' },
  ]

  const actionColumns = [
    { key: 'created_at', title: '时间', render: (v) => v ? new Date(v).toLocaleString() : '-' },
    { key: 'action', title: '操作' },
    { key: 'target', title: '目标类型', render: (v) => v || '-' },
    { key: 'ip_address', title: 'IP 地址' },
  ]

  if (loading) {
    return <div className="loading-state">加载中...</div>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">隐私</h1>
          <p className="page-subtitle">查看你的登录记录和操作日志</p>
        </div>
      </div>

      <Card>
        <CardHeader icon={PrivacyIcon} title="隐私仪表板" subtitle="控制你的隐私数据和个人信息" accent />
        <CardBody>
          <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
            你可以在此页面查看与你帐户相关的登录活动和操作记录。
            如需详细了解隐向如何处理你的隐私数据，请访问隐私声明。
          </p>
          <div style={{ marginTop: 'var(--spacing-base)' }}>
            <a href="#" className="text-primary" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
              前往隐私仪表板
            </a>
          </div>
        </CardBody>
      </Card>

      <h2 className="section-header">登录日志 ({loginTotal})</h2>
      <Card>
        <CardHeader icon={EyeIcon} title="最近的登录活动" />
        <CardBody position="top">
          <Table columns={loginColumns} data={loginLogs} emptyText="暂无登录记录" />
        </CardBody>
      </Card>

      <h2 className="section-header">操作日志 ({actionTotal})</h2>
      <Card>
        <CardHeader icon={EyeIcon} title="最近的操作活动" />
        <CardBody position="top">
          <Table columns={actionColumns} data={actionLogs} emptyText="暂无操作记录" />
        </CardBody>
      </Card>
    </div>
  )
}
