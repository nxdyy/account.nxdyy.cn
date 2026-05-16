import { useState, useEffect } from 'react'
import { getApiMappings, updateApiMapping, reloadApiMappings, restartServer } from '../../api/admin'
import Card, { CardHeader, CardBody } from '../../components/Card'
import Table from '../../components/Table'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormGroup, FormLabel, FormInput, FormSelect } from '../../components/Input'
import './Admin.css'
import '../account/Account.css'

function ServerIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
}

function RefreshIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
}

export default function SystemApiMappings() {
  const [mappings, setMappings] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ method: '', path: '', permission_key: '', description: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reloadMsg, setReloadMsg] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getApiMappings()
      setMappings(res.data.data || [])
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openEdit = (m) => {
    setEditing(m)
    setForm({
      method: m.method,
      path: m.path,
      permission_key: m.permission_key || '',
      description: m.description || '',
    })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      await updateApiMapping(editing.id, form)
      setModalOpen(false)
      setSuccess(`映射 ${editing.method} ${editing.path} 已更新`)
      setTimeout(() => setSuccess(''), 3000)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || '更新失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReload = async () => {
    setReloadMsg('')
    try {
      await reloadApiMappings()
      setReloadMsg('API 映射缓存已重载')
      setTimeout(() => setReloadMsg(''), 3000)
    } catch {
      setReloadMsg('重载失败')
    }
  }

  const columns = [
    { key: 'method', title: '方法', render: (v) => <span className={`badge badge-${v === 'GET' ? 'success' : v === 'POST' ? 'neutral' : v === 'PUT' || v === 'PATCH' ? 'warning' : 'danger'}`}>{v}</span> },
    { key: 'path', title: '路径', render: (v) => <code className="config-value">{v}</code> },
    { key: 'permission_key', title: '所需权限', render: (v) => v ? <code className="config-value">{v}</code> : <span className="text-secondary">无需权限</span> },
    { key: 'description', title: '说明', render: (v) => v || '-' },
    {
      key: 'actions', title: '操作',
      render: (_, row) => (
        <div className="table-actions">
          <Button variant="text" size="sm" onClick={() => openEdit(row)}>编辑</Button>
        </div>
      ),
    },
  ]

  const methodOptions = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">系统运维</h1>
          <p className="page-subtitle">管理 API 权限映射和系统维护操作</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <Button variant="secondary" onClick={handleReload}>
            <RefreshIcon />
            重载映射
          </Button>
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}
      {reloadMsg && <div className="auth-success">{reloadMsg}</div>}

      <Card>
        <CardHeader icon={ServerIcon} title="API 权限映射表" subtitle="每个 API 端点所需的权限键，修改后需重载生效" accent />
        <CardBody position="top">
          <Table columns={columns} data={mappings} emptyText="暂无 API 映射数据" />
        </CardBody>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="编辑 API 映射"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>取消</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? '保存中...' : '保存'}
            </Button>
          </>
        }
      >
        {error && <div className="auth-error">{error}</div>}
        <FormGroup>
          <FormLabel>请求方法</FormLabel>
          <FormSelect value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
            {methodOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </FormSelect>
        </FormGroup>
        <FormGroup>
          <FormLabel>路径</FormLabel>
          <FormInput value={form.path} onChange={(e) => setForm({ ...form, path: e.target.value })} placeholder="/api/example" readOnly />
          <div className="form-hint">路径不可修改，如需修改请删除后重建</div>
        </FormGroup>
        <FormGroup>
          <FormLabel>所需权限键</FormLabel>
          <FormInput value={form.permission_key} onChange={(e) => setForm({ ...form, permission_key: e.target.value })} placeholder="例如: admin.user.list" />
          <div className="form-hint">留空表示无需额外权限，仅需登录</div>
        </FormGroup>
        <FormGroup>
          <FormLabel>说明</FormLabel>
          <FormInput value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="可选说明" />
        </FormGroup>
      </Modal>
    </div>
  )
}
