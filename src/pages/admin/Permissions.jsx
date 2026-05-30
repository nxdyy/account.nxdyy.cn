import { useState, useEffect } from 'react'
import { getPermissions, createPermission, updatePermission, deletePermission } from '../../api/admin'
import { showError, showSuccess } from '../../store/toastStore'
import Card, { CardBody } from '../../components/Card'
import Table from '../../components/Table'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormGroup, FormLabel, FormInput, FormTextarea } from '../../components/Input'
import './Admin.css'

export default function Permissions() {
  const [permissions, setPermissions] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', description: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      const res = await getPermissions()
      setPermissions(res.data.data || [])
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
        showSuccess('权限已更新')
      } else {
        await createPermission(form)
        showSuccess('权限已创建')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '操作失败'
      }
      setError(msg)
      showError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (p) => {
    if (!window.confirm(`确认删除权限 "${p.name}" 吗？`)) return
    try {
      await deletePermission(p.id)
      fetchData()
    } catch {
      // ignore
    }
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
        {Object.keys(grouped).length === 0 && (
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
