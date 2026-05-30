import { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, updateUserStatus, deleteUser, getUserRoles, setUserRoles as apiSetUserRoles, getUserPermissionsOverride, setUserPermissionsOverride, getRoles } from '../../api/admin'
import { showError, showSuccess } from '../../store/toastStore'
import Card, { CardBody } from '../../components/Card'
import Table, { Badge } from '../../components/Table'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormGroup, FormLabel, FormInput, FormTextarea } from '../../components/Input'
import './Admin.css'

function RefreshIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
}

function UsersIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 15
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({ username: '', email: '', password: '', nickname: '', phone: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [detailUser, setDetailUser] = useState(null)
  const [detailTab, setDetailTab] = useState('roles')
  const [userRoles, setUserRoles] = useState([])
  const [allRoles, setAllRoles] = useState([])
  const [permissionsJson, setPermissionsJson] = useState('')
  const [detailLoading, setDetailLoading] = useState(false)
  const [roleSubmitting, setRoleSubmitting] = useState(false)
  const [permSubmitting, setPermSubmitting] = useState(false)

  const fetchUsers = async () => {
    try {
      const params = { page, page_size: pageSize }
      if (keyword) params.keyword = keyword
      const res = await getUsers(params)
      const data = res.data.data
      setUsers(data.list || data || [])
      setTotal(data.total || 0)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const openCreate = () => {
    setEditingUser(null)
    setForm({ username: '', email: '', password: '', nickname: '', phone: '' })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setForm({ username: user.username, email: user.email, password: '', nickname: user.nickname || '', phone: user.phone || '' })
    setError('')
    setModalOpen(true)
  }

  const openDetail = async (user) => {
    setDetailUser(user)
    setDetailTab('roles')
    setUserRoles([])
    setPermissionsJson('')
    setDetailLoading(true)
    try {
      const [rolesRes, allRolesRes, permRes] = await Promise.all([
        getUserRoles(user.id).catch(() => ({ data: { data: [] } })),
        getRoles({ page: 1, page_size: 100 }).catch(() => ({ data: { data: { list: [] } } })),
        getUserPermissionsOverride(user.id).catch(() => ({ data: { data: null } })),
      ])
      setUserRoles(rolesRes.data.data || [])
      setAllRoles(allRolesRes.data.data?.list || [])
      const permData = permRes.data.data
      if (permData?.permissions_json) {
        setPermissionsJson(JSON.stringify(permData.permissions_json, null, 2))
      } else {
        setPermissionsJson('')
      }
    } catch {
      // ignore
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      if (editingUser) {
        await updateUser(editingUser.id, form)
        showSuccess('用户已更新')
      } else {
        await createUser(form)
        showSuccess('用户已创建')
      }
      setModalOpen(false)
      fetchUsers()
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

  const handleToggleStatus = async (user) => {
    try {
      await updateUserStatus(user.id, { is_active: !user.is_active })
      fetchUsers()
    } catch {
      // ignore
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`确认删除用户 "${user.username || user.email}" 吗？`)) return
    try {
      await deleteUser(user.id)
      fetchUsers()
    } catch {
      // ignore
    }
  }

  const handleRoleToggle = (roleId) => {
    setUserRoles((prev) => {
      const exists = prev.find((r) => r.id === roleId)
      if (exists) {
        return prev.filter((r) => r.id !== roleId)
      }
      const role = allRoles.find((r) => r.id === roleId)
      return role ? [...prev, role] : prev
    })
  }

  const handleSaveRoles = async () => {
    if (!detailUser) return
    setRoleSubmitting(true)
    try {
      await apiSetUserRoles(detailUser.id, { role_ids: userRoles.map((r) => r.id) })
      showSuccess('角色已更新')
      fetchUsers()
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '更新失败'
      }
      showError(msg)
    } finally {
      setRoleSubmitting(false)
    }
  }

  const handleSavePermissions = async () => {
    if (!detailUser) return
    setPermSubmitting(true)
    try {
      let jsonData = null
      if (permissionsJson.trim()) {
        jsonData = JSON.parse(permissionsJson.trim())
      }
      await setUserPermissionsOverride(detailUser.id, { permissions_json: jsonData })
      showSuccess('权限覆盖已更新')
    } catch (err) {
      let msg
      if (err instanceof SyntaxError) {
        msg = 'JSON 格式错误，请检查输入'
      } else if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '更新失败'
      }
      showError(msg)
    } finally {
      setPermSubmitting(false)
    }
  }

  const columns = [
    { key: 'username', title: '用户名', render: (v, row) => <span className="text-primary" style={{ fontWeight: 'var(--font-weight-medium)' }}>{v || row.email}</span> },
    { key: 'email', title: '邮箱' },
    { key: 'roles', title: '角色', render: (v) => v && v.length > 0 ? <span className="text-sm">{v.map((r) => r.name).join(', ')}</span> : <span className="text-secondary text-sm">无</span> },
    { key: 'is_active', title: '状态', render: (v) => v ? <Badge type="success">启用</Badge> : <Badge type="danger">禁用</Badge> },
    { key: 'created_at', title: '注册时间', render: (v) => v ? new Date(v).toLocaleString() : '-' },
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
          <h1 className="page-title">用户管理</h1>
          <p className="page-subtitle">管理系统中的所有用户帐户</p>
        </div>
        <Button onClick={openCreate}>创建用户</Button>
      </div>

      <div className="admin-toolbar">
        <form className="admin-toolbar-left" onSubmit={handleSearch}>
          <FormInput
            className="admin-search"
            placeholder="搜索用户名或邮箱..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button type="submit" variant="secondary" size="sm">搜索</Button>
          <Button type="button" variant="text" size="sm" onClick={fetchUsers} title="刷新">
            <RefreshIcon />
          </Button>
        </form>
        <span className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
          共 {total} 个用户
        </span>
      </div>

      <Card>
        <CardBody position="top">
          <Table columns={columns} data={users} emptyText="暂无用户数据" />
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
        title={editingUser ? '编辑用户' : '创建用户'}
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
          <FormLabel>用户名</FormLabel>
          <FormInput value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="请输入用户名" required />
        </FormGroup>
        <FormGroup>
          <FormLabel>邮箱</FormLabel>
          <FormInput value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="请输入邮箱地址" type="email" required />
        </FormGroup>
        {!editingUser && (
          <FormGroup>
            <FormLabel>密码</FormLabel>
            <FormInput value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="请输入密码" type="password" required />
          </FormGroup>
        )}
        <FormGroup>
          <FormLabel>昵称</FormLabel>
          <FormInput value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} placeholder="请输入昵称（可选）" />
        </FormGroup>
        <FormGroup>
          <FormLabel>手机号码</FormLabel>
          <FormInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="请输入手机号码（可选）" />
        </FormGroup>
      </Modal>

      <Modal
        open={!!detailUser}
        onClose={() => setDetailUser(null)}
        title={detailUser ? `用户详情: ${detailUser.username || detailUser.email}` : '用户详情'}
        footer={
          <Button variant="secondary" onClick={() => setDetailUser(null)}>关闭</Button>
        }
      >
        {detailUser && (
          <div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-base)' }}>
              <Button variant={detailTab === 'roles' ? 'primary' : 'secondary'} size="sm" onClick={() => setDetailTab('roles')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><UsersIcon /> 角色</span>
              </Button>
              <Button variant={detailTab === 'permissions' ? 'primary' : 'secondary'} size="sm" onClick={() => setDetailTab('permissions')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ShieldIcon /> 权限覆盖</span>
              </Button>
            </div>

            {detailTab === 'roles' && (
              <div>
                {detailLoading ? (
                  <div className="loading-state">加载中...</div>
                ) : (
                  <>
                    {allRoles.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                        {allRoles.map((role) => (
                          <label key={role.id} className="form-checkbox" style={{ padding: 'var(--spacing-sm)', background: 'var(--color-sidebar-bg)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={userRoles.some((r) => r.id === role.id)}
                              onChange={() => handleRoleToggle(role.id)}
                            />
                            <span className="form-checkbox-label">
                              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{role.name}</span>
                              <span className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginLeft: 'var(--spacing-sm)' }}>{role.code}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-secondary" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                        暂无可用角色
                      </div>
                    )}
                    <div style={{ marginTop: 'var(--spacing-base)', display: 'flex', justifyContent: 'flex-end' }}>
                      <Button size="sm" onClick={handleSaveRoles} disabled={roleSubmitting}>
                        {roleSubmitting ? '保存中...' : '保存角色'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {detailTab === 'permissions' && (
              <div>
                {detailLoading ? (
                  <div className="loading-state">加载中...</div>
                ) : (
                  <>
                    <FormGroup>
                      <FormLabel>权限覆盖 JSON</FormLabel>
                      <FormTextarea
                        value={permissionsJson}
                        onChange={(e) => setPermissionsJson(e.target.value)}
                        placeholder='{"admin": {"_enabled": true, "user": true}}'
                        rows={10}
                        style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-sm)' }}
                      />
                      <div className="form-hint">留空表示不设置权限覆盖。请输入有效的 JSON 格式。</div>
                    </FormGroup>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button size="sm" onClick={handleSavePermissions} disabled={permSubmitting}>
                        {permSubmitting ? '保存中...' : '保存权限'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
