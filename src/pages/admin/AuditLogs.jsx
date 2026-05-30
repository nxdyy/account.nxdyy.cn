import { useState, useEffect } from 'react'
import { getLoginLogs, getActionLogs } from '../../api/admin'
import Card, { CardBody } from '../../components/Card'
import Table, { Badge } from '../../components/Table'
import Button from '../../components/Button'
import { FormInput } from '../../components/Input'
import './Admin.css'
import '../account/Account.css'

function RefreshIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
}

export default function AuditLogs() {
  const [loginLogs, setLoginLogs] = useState([])
  const [actionLogs, setActionLogs] = useState([])
  const [tab, setTab] = useState('login')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [userId, setUserId] = useState('')
  const pageSize = 20

  const fetchData = () => {
    const fetcher = tab === 'login' ? getLoginLogs : getActionLogs
    const params = { page, page_size: pageSize }
    if (userId) params.user_id = userId
    fetcher(params)
      .then((res) => {
        const data = res.data.data
        const list = data.list || []
        const t = data.total || 0
        if (tab === 'login') setLoginLogs(list)
        else setActionLogs(list)
        setTotal(t)
      })
      .catch(() => {
        // ignore
      })
  }

  useEffect(() => {
    fetchData()
  }, [tab, page])

  const handleSearch = () => {
    setPage(1)
    fetchData()
  }

  const loginColumns = [
    { key: 'created_at', title: '时间', render: (v) => v ? new Date(v).toLocaleString() : '-' },
    { key: 'user_id', title: '用户ID' },
    { key: 'success', title: '状态', render: (v) => v === true ? <Badge type="success">成功</Badge> : <Badge type="danger">失败</Badge> },
    { key: 'ip_address', title: 'IP 地址' },
    { key: 'user_agent', title: '设备信息', render: (v) => v ? <span className="text-sm">{v.substring(0, 40)}</span> : '-' },
  ]

  const actionColumns = [
    { key: 'created_at', title: '时间', render: (v) => v ? new Date(v).toLocaleString() : '-' },
    { key: 'user_id', title: '用户ID' },
    { key: 'action', title: '操作', render: (v) => <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{v}</span> },
    { key: 'target', title: '目标类型' },
    { key: 'target_id', title: '目标ID', render: (v) => v || '-' },
    { key: 'ip_address', title: 'IP 地址' },
  ]

  const data = tab === 'login' ? loginLogs : actionLogs
  const columns = tab === 'login' ? loginColumns : actionColumns

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">审计日志</h1>
          <p className="page-subtitle">查看所有用户的登录记录和操作日志</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-base)' }}>
        <Button variant={tab === 'login' ? 'primary' : 'secondary'} size="sm" onClick={() => { setTab('login'); setPage(1) }}>
          登录日志
        </Button>
        <Button variant={tab === 'action' ? 'primary' : 'secondary'} size="sm" onClick={() => { setTab('action'); setPage(1) }}>
          操作日志
        </Button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <FormInput
            className="admin-search"
            placeholder="按用户ID筛选..."
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Button variant="secondary" size="sm" onClick={handleSearch}>筛选</Button>
          <Button type="button" variant="text" size="sm" onClick={fetchData} title="刷新">
            <RefreshIcon />
          </Button>
        </div>
        <span className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
          共 {total} 条记录
        </span>
      </div>

      <Card>
        <CardBody position="top">
          <Table columns={columns} data={data} emptyText="暂无日志数据" />
        </CardBody>
      </Card>

      {total > pageSize && (
        <div className="pagination">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
          <span className="pagination-info">第 {page} 页 / 共 {Math.ceil(total / pageSize)} 页</span>
          <Button variant="secondary" size="sm" disabled={page * pageSize >= total} onClick={() => setPage(page + 1)}>下一页</Button>
        </div>
      )}
    </div>
  )
}
