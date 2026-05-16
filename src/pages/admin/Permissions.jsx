import { useState, useEffect } from 'react'
import { getPermissions, createPermission, updatePermission, deletePermission } from '../../api/admin'
import Card, { CardHeader, CardBody } from '../../components/Card'
import Table from '../../components/Table'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormGroup, FormLabel, FormInput, FormTextarea } from '../../components/Input'
import './Admin.css'

function PermissionIconSvg() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
}

export default function Permissions() {
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', description: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getPermissions()
      setPermissions(res.data.data || [])
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', code: '', description: '' })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({ name: p.name, code: p.code, description: p.description || '' })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      if (editing) {
        await updatePermission(editing.id, form)
      } else {
        await createPermission(form)
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || '操作失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (p) => {
    if (!window.confirm(`确认删除权限 "${p.name}" 吗？`)) return
    try {
      await deletePermission(p.id)
      fetchData()
    } catch {}
  }

  const grouped = permissions.reduce((acc, p) => {
    const group = p.code?.split('.')[0] || 'other'
    if (!acc[group]) acc[group] = []
    acc[group].push(p)
    return acc
  }, {})

  const columns = [
    { key: 'name', title: '权限名称', render: (v) => <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{v}</span> },
    { key: 'code', title: '权限编码', render: (v) => <code className="config-value">{v}</code> },
    { key: 'description', title: '描述', render: (v) => v || '-' },
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
          <h1 className="page-title">权限管理</h1>
          <p className="page-subtitle">管理系统中的权限点定义</p>
        </div>
        <Button onClick={openCreate}>创建权限</Button>
      </div>

      <div className="admin-perm-tree">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="admin-perm-group">
            <div className="admin-perm-group-title">{group}</div>
            <Card>
              <CardBody position="top">
                <Table columns={columns} data={items} emptyText="暂无权限" />
              </CardBody>
            </Card>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && !loading && (
          <Card>
            <CardBody>
              <div className="empty-state">
                <p className="empty-state-title">暂无权限数据</p>
                <p className="empty-state-desc">点击上方"创建权限"按钮添加权限点</p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? '编辑权限' : '创建权限'}
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
          <FormLabel>权限名称</FormLabel>
          <FormInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="例如: 用户读取" required />
        </FormGroup>
        <FormGroup>
          <FormLabel>权限编码</FormLabel>
          <FormInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="例如: user.read, user.write" required />
          <div className="form-hint">建议格式: 模块.操作，如 user.read</div>
        </FormGroup>
        <FormGroup>
          <FormLabel>描述</FormLabel>
          <FormTextarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="请输入权限描述（可选）" />
        </FormGroup>
      </Modal>
    </div>
  )
}
