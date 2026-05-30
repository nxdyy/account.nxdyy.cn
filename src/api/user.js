import client from './client'

export function getProfile() {
  return client.get('/user/profile')
}

export function updateProfile(data) {
  return client.put('/user/profile', data)
}

export function getSessions() {
  return client.get('/sessions')
}

export function getCurrentSession() {
  return client.get('/sessions/me')
}

export function revokeSession(sessionId) {
  return client.delete(`/sessions/${sessionId}`)
}

export function revokeAllSessions() {
  return client.delete('/sessions')
}

export function getMyLoginLogs(params) {
  return client.get('/logs/login/me', { params })
}

export function getMyActionLogs(params) {
  return client.get('/logs/actions/me', { params })
}

export function getSecurityAlerts(params) {
  return client.get('/security/alerts/me', { params })
}

export function markAlertRead(id) {
  return client.post(`/security/alerts/${id}/read`)
}

export function get2FASetup() {
  return client.get('/2fa/setup')
}

export function enable2FA(data) {
  return client.post('/2fa/enable', data)
}

export function disable2FA(data) {
  return client.post('/2fa/disable', data)
}

export function getBackupCodes() {
  return client.get('/2fa/backup-codes')
}

export function get2FAStatus() {
  return client.get('/2fa/status')
}

export function getMyPermissions() {
  return client.get('/user/permissions')
}
