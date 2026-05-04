import { useState, useEffect } from 'react'
import { getRoles, createRole, updateRole, deleteRole } from '../../api/admin'
import Card, { CardHeader, CardBody } from '../../components/Card'
import Table from '../../components/Table'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormGroup, FormLabel, FormInput, FormTextarea } from '../../components/Input'
import './Admin.css'

function RoleIconSvg() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
}

export default function Roles() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', description: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchRoles = async () => {
    setLoading(true)
    try {
      const res = await getRoles()
      setRoles(res.data.data || [])
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRoles() }, [])

  const openCreate = () => {
    setEditingRole(null)
    setForm({ name: '', code: '', description: '' })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (role) => {
    setEditingRole(role)
    setForm({ name: role.name, code: role.code, description: role.description || '' })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      if (editingRole) {
        await updateRole(editingRole.id, form)
      } else {
        await createRole(form)
      }
      setModalOpen(false)
      fetchRoles()
    } catch (err) {
      setError(err.response?.data?.message || '操作失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (role) => {
    if (!window.confirm(`确认删除角色 "${role.name}" 吗？`)) return
    try {
      await deleteRole(role.id)
      fetchRoles()
    } catch {}
  }

  const columns = [
    { key: 'name', title: '角色名称', render: (v) => <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{v}</span> },
    { key: 'code', title: '角色编码', render: (v) => <code className="config-value">{v}</code> },
    { key: 'description', title: '描述', render: (v) => v || '-' },
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
          <h1 className="page-title">角色管理</h1>
          <p className="page-subtitle">管理系统中的角色定义</p>
        </div>
        <Button onClick={openCreate}>创建角色</Button>
      </div>

      <Card>
        <CardBody position="top">
          <Table columns={columns} data={roles} emptyText="暂无角色数据" />
        </CardBody>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRole ? '编辑角色' : '创建角色'}
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
          <FormLabel>角色名称</FormLabel>
          <FormInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="请输入角色名称" required />
        </FormGroup>
        <FormGroup>
          <FormLabel>角色编码</FormLabel>
          <FormInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="例如: admin, editor, viewer" required />
          <div className="form-hint">编码需唯一，只能包含字母、数字和下划线</div>
        </FormGroup>
        <FormGroup>
          <FormLabel>描述</FormLabel>
          <FormTextarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="请输入角色描述（可选）" />
        </FormGroup>
      </Modal>
    </div>
  )
}
