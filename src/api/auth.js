import client from './client'

export function login(data) {
  return client.post('/auth/login', data)
}

export function login2FA(data) {
  return client.post('/auth/login/2fa', data)
}

export function refreshToken() {
  return client.post('/auth/refresh')
}

export function logout() {
  return client.post('/auth/logout')
}

export function register(data) {
  return client.post('/auth/register', data)
}

export function sendRegisterCode(data) {
  return client.post('/auth/register/verify-code', data)
}

export function confirmRegister(data) {
  return client.post('/auth/register/confirm', data)
}

export function forgotPassword(data) {
  return client.post('/auth/forgot-password', data)
}

export function confirmForgotPassword(data) {
  return client.post('/auth/forgot-password/confirm', data)
}

export function changePassword(data) {
  return client.post('/auth/change-password', data)
}

export function oauthRedirect(provider) {
  return client.get(`/auth/oauth/${provider}/redirect`)
}

export function unbindOAuth(provider) {
  return client.post(`/auth/oauth/${provider}/unbind`)
}
