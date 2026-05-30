import { useState, useEffect } from 'react'
import { getRoles, createRole, updateRole, updateRoleStatus, deleteRole, getRolePermissionsTree, getRoleUsers } from '../../api/admin'
import { showError, showSuccess } from '../../store/toastStore'
import Card, { CardBody } from '../../components/Card'
import Table from '../../components/Table'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormGroup, FormLabel, FormInput, FormTextarea } from '../../components/Input'
import './Admin.css'

function RefreshIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
}

export default function Roles() {
  const [roles, setRoles] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [keyword, setKeyword] = useState('')
  const pageSize = 20
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', description: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [detailRole, setDetailRole] = useState(null)
  const [detailTab, setDetailTab] = useState('permissions')
  const [roleUsers, setRoleUsers] = useState([])
  const [permTree, setPermTree] = useState(null)
  const [permLoading, setPermLoading] = useState(false)

  const fetchRoles = async () => {
    try {
      const params = { page, page_size: pageSize }
      if (keyword) params.keyword = keyword
      const res = await getRoles(params)
      const data = res.data.data
      setRoles(data.list || [])
      setTotal(data.total || 0)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchRoles()
  }

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

  const openDetail = async (role) => {
    setDetailRole(role)
    setDetailTab('permissions')
    setPermTree(null)
    setRoleUsers([])
    setPermLoading(true)
    try {
      const [permRes, usersRes] = await Promise.all([
        getRolePermissionsTree(role.id).catch(() => ({ data: { data: null } })),
        getRoleUsers(role.id).catch(() => ({ data: { data: [] } })),
      ])
      setPermTree(permRes.data.data)
      setRoleUsers(usersRes.data.data || [])
    } catch {
      // ignore
    } finally {
      setPermLoading(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      if (editingRole) {
        await updateRole(editingRole.id, form)
        showSuccess('角色已更新')
      } else {
        await createRole(form)
        showSuccess('角色已创建')
      }
      setModalOpen(false)
      fetchRoles()
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

  const handleToggleStatus = async (role) => {
    try {
      await updateRoleStatus(role.id, { is_active: !role.is_active })
      fetchRoles()
    } catch {
      // ignore
    }
  }

  const handleDelete = async (role) => {
    if (!window.confirm(`确认删除角色 "${role.name}" 吗？`)) return
    try {
      await deleteRole(role.id)
      fetchRoles()
    } catch {
      // ignore
    }
  }

  const columns = [
    { key: 'name', title: '角色名称', render: (v) => <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{v}</span> },
    { key: 'code', title: '角色编码', render: (v) => <code className="config-value">{v}</code> },
    { key: 'description', title: '描述', render: (v) => v || '-' },
    { key: 'is_active', title: '状态', render: (v) => <span className={`badge badge-${v ? 'success' : 'danger'}`}>{v ? '启用' : '禁用'}</span> },
    { key: 'created_at', title: '创建时间', render: (v) => v ? new Date(v).toLocaleString() : '-' },
    {
      key: 'actions', title: '操作',
      render: (_, row) => (
        <div className="table-actions">
          <Button variant="text" size="sm" onClick={() => openDetail(row)}>详情</Button>
          <Button variant="text" size="sm" onClick={() => openEdit(row)}>编辑</Button>
          <Button variant="text" size="sm" onClick={() => handleToggleStatus(row)}>
            {row.is_active ? '禁用' : '启用'}
          </Button>
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

      <div className="admin-toolbar">
        <form className="admin-toolbar-left" onSubmit={handleSearch}>
          <FormInput
            className="admin-search"
            placeholder="搜索角色名称或编码..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button type="submit" variant="secondary" size="sm">搜索</Button>
          <Button type="button" variant="text" size="sm" onClick={fetchRoles} title="刷新">
            <RefreshIcon />
          </Button>
        </form>
        <span className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
          共 {total} 个角色
        </span>
      </div>

      <Card>
        <CardBody position="top">
          <Table columns={columns} data={roles} emptyText="暂无角色数据" />
        </CardBody>
      </Card>

      {total > pageSize && (
        <div className="pagination">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
          <span className="pagination-info">第 {page} 页</span>
          <Button variant="secondary" size="sm" disabled={page * pageSize >= total} onClick={() => setPage(page + 1)}>下一页</Button>
        </div>
      )}

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

      <Modal
        open={!!detailRole}
        onClose={() => setDetailRole(null)}
        title={detailRole ? `角色详情: ${detailRole.name}` : '角色详情'}
        footer={
          <Button variant="secondary" onClick={() => setDetailRole(null)}>关闭</Button>
        }
      >
        {detailRole && (
          <div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-base)' }}>
              <Button variant={detailTab === 'permissions' ? 'primary' : 'secondary'} size="sm" onClick={() => setDetailTab('permissions')}>
                权限树
              </Button>
              <Button variant={detailTab === 'users' ? 'primary' : 'secondary'} size="sm" onClick={() => setDetailTab('users')}>
                关联用户
              </Button>
            </div>

            {detailTab === 'permissions' && (
              <div>
                {permLoading ? (
                  <div className="loading-state">加载中...</div>
                ) : permTree?.permissions_json ? (
                  <pre className="config-value" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {JSON.stringify(permTree.permissions_json, null, 2)}
                  </pre>
                ) : (
                  <div className="text-secondary" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                    暂无权限配置
                  </div>
                )}
              </div>
            )}

            {detailTab === 'users' && (
              <div>
                {permLoading ? (
                  <div className="loading-state">加载中...</div>
                ) : roleUsers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    {roleUsers.map((u) => (
                      <div key={u.id} style={{ padding: 'var(--spacing-sm)', background: 'var(--color-sidebar-bg)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{u.username || u.email}</div>
                        <div className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>{u.email}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-secondary" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                    暂无关联用户
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
