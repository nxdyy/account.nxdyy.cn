import { useState, useEffect, useMemo } from 'react'
import { getSSOClients, createSSOClient, updateSSOClient, deleteSSOClient } from '../../api/admin'
import { OAUTH_SCOPES, SCOPE_GROUPS } from '../../api/oauth2'
import { showError, showSuccess } from '../../store/toastStore'
import Card, { CardBody } from '../../components/Card'
import Table from '../../components/Table'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormGroup, FormLabel, FormInput } from '../../components/Input'
import './Admin.css'
import '../oauth/OAuth.css'

function CopyIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
}

function ScopeSelector({ value, onChange }) {
  const selectedScopes = useMemo(() => {
    return value ? value.split(/[\s,]+/).filter(Boolean) : []
  }, [value])

  const toggleScope = (scope) => {
    const set = new Set(selectedScopes)
    if (set.has(scope)) {
      set.delete(scope)
    } else {
      set.add(scope)
    }
    onChange(Array.from(set).join(' '))
  }

  const toggleGroup = (groupKey) => {
    const groupScopes = OAUTH_SCOPES[groupKey].map((s) => s.scope)
    const allSelected = groupScopes.every((s) => selectedScopes.includes(s))
    const set = new Set(selectedScopes)
    if (allSelected) {
      groupScopes.forEach((s) => set.delete(s))
    } else {
      groupScopes.forEach((s) => set.add(s))
    }
    onChange(Array.from(set).join(' '))
  }

  return (
    <div className="oauth-scope-selector">
      {SCOPE_GROUPS.map((group) => {
        const groupScopes = OAUTH_SCOPES[group.key] || []
        const allSelected = groupScopes.every((s) => selectedScopes.includes(s.scope))
        return (
          <div key={group.key} className="oauth-scope-group">
            <div className="oauth-scope-group-header">
              <span className="oauth-scope-group-title">{group.label}</span>
              <button
                type="button"
                className="oauth-scope-group-toggle"
                onClick={() => toggleGroup(group.key)}
              >
                {allSelected ? '取消全选' : '全选'}
              </button>
            </div>
            <div className="oauth-scope-items">
              {groupScopes.map((s) => (
                <label key={s.scope} className="oauth-scope-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedScopes.includes(s.scope)}
                    onChange={() => toggleScope(s.scope)}
                  />
                  <div className="oauth-scope-checkbox-info">
                    <span className="oauth-scope-checkbox-label">{s.label}</span>
                    <span className="oauth-scope-checkbox-value">{s.scope}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )
      })}
      {selectedScopes.length > 0 && (
        <div className="oauth-scope-preview">
          <span className="oauth-scope-preview-label">已选 Scopes：</span>
          {selectedScopes.join(' ')}
        </div>
      )}
    </div>
  )
}

export default function SSOClients() {
  const [clients, setClients] = useState([])
  const [, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    client_id: '',
    client_secret: '',
    name: '',
    redirect_uris: '',
    grant_types: 'authorization_code,refresh_token',
    scopes: '',
  })
  const [showSecret, setShowSecret] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getSSOClients()
      setClients(res.data.data || [])
    } catch {
      showError('获取客户端列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({
      client_id: '',
      client_secret: '',
      name: '',
      redirect_uris: '',
      grant_types: 'authorization_code,refresh_token',
      scopes: '',
    })
    setShowSecret(false)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({
      client_id: c.client_id || '',
      client_secret: '',
      name: c.name || '',
      redirect_uris: c.redirect_uris || '',
      grant_types: c.grant_types || 'authorization_code,refresh_token',
      scopes: c.scopes || '',
    })
    setShowSecret(false)
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const payload = { ...form }
      if (editing && !payload.client_secret) {
        delete payload.client_secret
      }
      if (editing) {
        delete payload.client_id
      }
      if (editing) {
        await updateSSOClient(editing.id, payload)
        showSuccess('客户端已更新')
      } else {
        await createSSOClient(payload)
        showSuccess('客户端已创建')
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

  const handleDelete = async (c) => {
    if (!window.confirm(`确认删除客户端 "${c.name}" 吗？此操作不可撤销。`)) return
    try {
      await deleteSSOClient(c.id)
      showSuccess('客户端已删除')
      fetchData()
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '删除失败'
      }
      showError(msg)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => showSuccess('已复制到剪贴板'),
      () => showError('复制失败')
    )
  }

  const columns = [
    {
      key: 'name',
      title: '客户端名称',
      render: (v) => <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{v}</span>,
    },
    {
      key: 'client_id',
      title: 'Client ID',
      render: (v) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          <code className="config-value">{v}</code>
          <button
            type="button"
            className="btn-text btn-xs"
            onClick={() => copyToClipboard(v)}
            title="复制"
            style={{ padding: '2px', minHeight: 'auto', minWidth: 'auto' }}
          >
            <CopyIcon />
          </button>
        </div>
      ),
    },
    {
      key: 'redirect_uris',
      title: '回调地址',
      render: (v) => <span className="text-sm" style={{ wordBreak: 'break-all' }}>{v}</span>,
    },
    {
      key: 'scopes',
      title: '授权范围',
      render: (v) => {
        if (!v) return <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>-</span>
        const scopes = v.split(/[\s,]+/).filter(Boolean)
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {scopes.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 'var(--font-size-xs)',
                  padding: '1px 6px',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  borderRadius: 'var(--radius-sm)',
                  whiteSpace: 'nowrap',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )
      },
    },
    {
      key: 'is_active',
      title: '状态',
      render: (v) => (
        <span style={{
          fontSize: 'var(--font-size-xs)',
          padding: '2px 8px',
          borderRadius: 'var(--radius-sm)',
          background: v ? 'var(--color-success-light)' : 'var(--color-danger-light)',
          color: v ? 'var(--color-success)' : 'var(--color-danger)',
          fontWeight: 'var(--font-weight-medium)',
        }}>
          {v ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      key: 'created_at',
      title: '创建时间',
      render: (v) => v ? new Date(v).toLocaleString() : '-',
    },
    {
      key: 'actions',
      title: '操作',
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
          <FormLabel>Client ID</FormLabel>
          <FormInput
            value={form.client_id}
            onChange={(e) => setForm({ ...form, client_id: e.target.value })}
            placeholder="请输入客户端唯一标识"
            disabled={!!editing}
            required
          />
          {editing && <div className="form-hint">Client ID 创建后不可修改</div>}
        </FormGroup>
        <FormGroup>
          <FormLabel>Client Secret</FormLabel>
          <div style={{ position: 'relative' }}>
            <FormInput
              type={showSecret ? 'text' : 'password'}
              value={form.client_secret}
              onChange={(e) => setForm({ ...form, client_secret: e.target.value })}
              placeholder={editing ? '留空则不修改' : '请输入客户端密钥'}
              required={!editing}
              style={{ paddingRight: '60px' }}
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-xs)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              {showSecret ? '隐藏' : '显示'}
            </button>
          </div>
          {editing && <div className="form-hint">留空则保持原密钥不变</div>}
        </FormGroup>
        <FormGroup>
          <FormLabel>客户端名称</FormLabel>
          <FormInput
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="请输入应用名称"
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>回调地址</FormLabel>
          <FormInput
            value={form.redirect_uris}
            onChange={(e) => setForm({ ...form, redirect_uris: e.target.value })}
            placeholder="多个地址用逗号分隔"
            required
          />
          <div className="form-hint">例如: https://client.com/callback,https://client.com/callback2</div>
        </FormGroup>
        <FormGroup>
          <FormLabel>授权类型</FormLabel>
          <FormInput
            value={form.grant_types}
            onChange={(e) => setForm({ ...form, grant_types: e.target.value })}
            placeholder="authorization_code,refresh_token"
          />
          <div className="form-hint">默认为 authorization_code,refresh_token</div>
        </FormGroup>
        <FormGroup>
          <FormLabel>授权范围 (Scopes)</FormLabel>
          <ScopeSelector
            value={form.scopes}
            onChange={(scopes) => setForm({ ...form, scopes })}
          />
        </FormGroup>
      </Modal>
    </div>
  )
}
