import { useState } from 'react'
import { updateProfile } from '../../api/user'
import { showError, showSuccess } from '../../store/toastStore'
import Card, { CardHeader, CardBody, CardRow } from '../../components/Card'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import { FormGroup, FormLabel, FormInput } from '../../components/Input'
import useAuthStore from '../../store/authStore'
import './Account.css'

function PeopleIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}

function EmailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 4-10 8L2 4"/></svg>
}

export default function YourInfo() {
  const { user, refreshUser } = useAuthStore()
  const [editOpen, setEditOpen] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const openEditNickname = () => {
    setEditValue(user?.nickname || '')
    setError('')
    setEditOpen(true)
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      await updateProfile({ nickname: editValue })
      await refreshUser()
      setEditOpen(false)
      showSuccess('保存成功')
    } catch (err) {
      let msg
      if (!err.response) {
        msg = '无法连接到服务器，请检查网络连接'
      } else {
        msg = err.response.data?.message || '保存失败'
      }
      setError(msg)
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">你的信息</h1>
          <p className="page-subtitle">查看和管理你的个人资料信息</p>
        </div>
      </div>

      <Card>
        <CardHeader icon={PeopleIcon} title="个人资料" accent />
        <CardBody>
          <CardRow
            label="显示名称"
            value={user?.nickname || user?.username || '未设置'}
            action={<Button variant="text" onClick={openEditNickname}>编辑名称</Button>}
          />
          <CardRow
            label="用户名"
            value={user?.username || '-'}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={EmailIcon} title="联系方式" accent />
        <CardBody>
          <CardRow
            label="邮箱地址"
            value={user?.email || '-'}
          />
          <CardRow
            label="手机号码"
            value={user?.phone || '未设置'}
          />
        </CardBody>
      </Card>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="编辑显示名称"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>取消</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </>
        }
      >
        {error && <div className="auth-error" style={{ marginBottom: 'var(--spacing-base)' }}>{error}</div>}
        <FormGroup>
          <FormLabel>显示名称</FormLabel>
          <FormInput
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="请输入显示名称"
          />
        </FormGroup>
      </Modal>
    </div>
  )
}
