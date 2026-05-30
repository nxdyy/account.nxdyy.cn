import client from './client'

export function getDashboard() {
  return client.get('/admin/dashboard')
}

export function getUsers(params) {
  return client.get('/admin/users', { params })
}

export function getUser(id) {
  return client.get(`/admin/users/${id}`)
}

export function createUser(data) {
  return client.post('/admin/users', data)
}

export function updateUser(id, data) {
  return client.put(`/admin/users/${id}`, data)
}

export function updateUserStatus(id, data) {
  return client.patch(`/admin/users/${id}/status`, data)
}

export function deleteUser(id) {
  return client.delete(`/admin/users/${id}`)
}

export function getUserRoles(id) {
  return client.get(`/admin/users/${id}/roles`)
}

export function setUserRoles(id, data) {
  return client.put(`/admin/users/${id}/roles`, data)
}

export function getEffectivePermissions(id) {
  return client.get(`/admin/users/${id}/effective-permissions`)
}

export function getUserPermissionsOverride(id) {
  return client.get(`/admin/users/${id}/permissions-override`)
}

export function setUserPermissionsOverride(id, data) {
  return client.put(`/admin/users/${id}/permissions-override`, data)
}

export function getRoles(params) {
  return client.get('/admin/roles', { params })
}

export function createRole(data) {
  return client.post('/admin/roles', data)
}

export function getRole(id) {
  return client.get(`/admin/roles/${id}`)
}

export function updateRole(id, data) {
  return client.put(`/admin/roles/${id}`, data)
}

export function updateRoleStatus(id, data) {
  return client.patch(`/admin/roles/${id}/status`, data)
}

export function deleteRole(id) {
  return client.delete(`/admin/roles/${id}`)
}

export function getRolePermissionsTree(id) {
  return client.get(`/admin/roles/${id}/permissions-tree`)
}

export function setRolePermissionsTree(id, data) {
  return client.put(`/admin/roles/${id}/permissions-tree`, data)
}

export function getRoleUsers(id) {
  return client.get(`/admin/roles/${id}/users`)
}

export function getPermissions() {
  return client.get('/admin/permissions')
}

export function createPermission(data) {
  return client.post('/admin/permissions', data)
}

export function updatePermission(id, data) {
  return client.put(`/admin/permissions/${id}`, data)
}

export function deletePermission(id) {
  return client.delete(`/admin/permissions/${id}`)
}

export function getLoginLogs(params) {
  return client.get('/admin/logs/login', { params })
}

export function getActionLogs(params) {
  return client.get('/admin/logs/actions', { params })
}

export function getSecurityConfig() {
  return client.get('/admin/config/security')
}

export function updateSecurityConfig(data) {
  return client.put('/admin/config/security', data)
}

export function getSSOClients() {
  return client.get('/admin/sso/clients')
}

export function getSSOClient(id) {
  return client.get(`/admin/sso/clients/${id}`)
}

export function createSSOClient(data) {
  return client.post('/admin/sso/clients', data)
}

export function updateSSOClient(id, data) {
  return client.put(`/admin/sso/clients/${id}`, data)
}

export function updateSSOClientStatus(id, data) {
  return client.patch(`/admin/sso/clients/${id}/status`, data)
}

export function regenerateSSOClientSecret(id) {
  return client.post(`/admin/sso/clients/${id}/regenerate-secret`)
}

export function deleteSSOClient(id) {
  return client.delete(`/admin/sso/clients/${id}`)
}

export function getApiMappings() {
  return client.get('/admin/system/api-mappings')
}

export function updateApiMapping(id, data) {
  return client.put(`/admin/system/api-mappings/${id}`, data)
}

export function reloadApiMappings() {
  return client.post('/admin/system/api-mappings/reload')
}

export function restartServer() {
  return client.post('/admin/system/restart')
}
