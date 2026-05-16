import { useState, useEffect } from 'react'
import { getSSOClients, createSSOClient, updateSSOClient, deleteSSOClient } from '../../api/admin'
import Card, { CardHeader, CardBody } from '../../components/Card'
import Table from '../../components/Table'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormGroup, FormLabel, FormInput, FormTextarea } from '../../components/Input'
import './Admin.css'

function SSOIconSvg() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
}

export default function SSOClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', redirect_uris: '', grant_types: 'authorization_code', scopes: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getSSOClients()
      setClients(res.data.data || [])
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', redirect_uris: '', grant_types: 'authorization_code', scopes: '' })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({
      name: c.name,
      redirect_uris: c.redirect_uris || '',
      grant_types: c.grant_types || 'authorization_code',
      scopes: c.scopes || '',
    })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      if (editing) {
        await updateSSOClient(editing.id, form)
      } else {
        await createSSOClient(form)
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || '操作失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (c) => {
    if (!window.confirm(`确认删除客户端 "${c.name}" 吗？`)) return
    try {
      await deleteSSOClient(c.id)
      fetchData()
    } catch {}
  }

  const columns = [
    { key: 'name', title: '客户端名称', render: (v) => <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{v}</span> },
    { key: 'client_id', title: 'Client ID', render: (v) => <code className="config-value">{v}</code> },
    { key: 'redirect_uris', title: '回调地址', render: (v) => <span className="text-sm">{v}</span> },
    { key: 'grant_types', title: '授权类型', render: (v) => <span className="text-sm">{v}</span> },
    { key: 'created_at', title: '创建时间', render: (v) => v ? new Date(v).toLocaleString() : '-' },
    {
      key: 'actions', title: '操作',
      render: (_, row) => (
        <div className="table-actions">
          <Button variant="text" size="sm" onClick={() => openEdit(row)}>编辑</Button>
          <Button variant="text" size="sm" onClick={() => handleDelete(row)} style={{ color: 'var(--color-danger)' }}>删除</Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SSO 客户端</h1>
          <p className="page-subtitle">管理 OAuth2 / OIDC 单点登录客户端应用</p>
        </div>
        <Button onClick={openCreate}>创建客户端</Button>
      </div>

      <Card>
        <CardBody position="top">
          <Table columns={columns} data={clients} emptyText="暂无 SSO 客户端" />
        </CardBody>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? '编辑客户端' : '创建客户端'}
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
          <FormLabel>客户端名称</FormLabel>
          <FormInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="请输入应用名称" required />
        </FormGroup>
        <FormGroup>
          <FormLabel>回调地址</FormLabel>
          <FormInput value={form.redirect_uris} onChange={(e) => setForm({ ...form, redirect_uris: e.target.value })} placeholder="多个地址用逗号分隔" required />
        </FormGroup>
        <FormGroup>
          <FormLabel>授权类型</FormLabel>
          <FormInput value={form.grant_types} onChange={(e) => setForm({ ...form, grant_types: e.target.value })} placeholder="authorization_code, client_credentials" />
          <div className="form-hint">默认为 authorization_code</div>
        </FormGroup>
        <FormGroup>
          <FormLabel>授权范围 (Scopes)</FormLabel>
          <FormInput value={form.scopes} onChange={(e) => setForm({ ...form, scopes: e.target.value })} placeholder="多个 scope 用空格分隔" />
          <div className="form-hint">例如: profile email openid</div>
        </FormGroup>
      </Modal>
    </div>
  )
}
