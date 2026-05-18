import client from './client'

export const OAUTH_SCOPES = {
  user: [
    { scope: 'user.info', label: '获取用户基本信息', description: '用户名、昵称、头像、邮箱、手机号' },
    { scope: 'user.email', label: '获取用户邮箱', description: '邮箱地址' },
    { scope: 'user.phone', label: '获取用户手机号', description: '手机号码' },
    { scope: 'user.password', label: '修改密码', description: '修改账户密码' },
    { scope: 'user.security', label: '获取安全设置', description: '二步验证状态等' },
    { scope: 'user.session', label: '获取会话信息', description: '登录会话与设备' },
    { scope: 'user.log', label: '获取操作日志', description: '账户操作记录' },
    { scope: 'user.permission', label: '获取权限信息', description: '用户权限列表' },
  ],
  admin: [
    { scope: 'admin.user', label: '管理用户', description: '查看和管理用户账户' },
    { scope: 'admin.role', label: '管理角色', description: '查看和管理角色' },
    { scope: 'admin.permission', label: '管理权限定义', description: '查看和管理权限' },
    { scope: 'admin.log', label: '查看系统日志', description: '审计日志与登录日志' },
    { scope: 'admin.security', label: '管理系统安全配置', description: '安全策略设置' },
    { scope: 'admin.sso', label: '管理 SSO/OAuth 客户端', description: 'OAuth2 客户端管理' },
    { scope: 'admin.dashboard', label: '访问管理后台仪表盘', description: '管理后台数据概览' },
  ],
  system: [
    { scope: 'system.server', label: '执行服务器重启', description: '重启服务器' },
    { scope: 'system.api.mapping', label: '查看 API 权限映射', description: 'API 权限配置' },
  ],
}

export const SCOPE_LABELS = {}
Object.values(OAUTH_SCOPES).forEach((group) => {
  group.forEach((s) => {
    SCOPE_LABELS[s.scope] = s.label
  })
})

export const SCOPE_DESCRIPTIONS = {}
Object.values(OAUTH_SCOPES).forEach((group) => {
  group.forEach((s) => {
    SCOPE_DESCRIPTIONS[s.scope] = s.description
  })
})

export const SCOPE_GROUPS = [
  { key: 'user', label: '用户权限' },
  { key: 'admin', label: '管理员权限' },
  { key: 'system', label: '系统权限' },
]

export function getAuthorizeInfo(params) {
  return client.get('/oauth/authorize', { params })
}

export function submitConsent(data) {
  const params = new URLSearchParams()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value)
    }
  })
  return client.post('/oauth/consent', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
