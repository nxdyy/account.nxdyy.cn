import { create } from 'zustand'
import * as authApi from '../api/auth'
import * as userApi from '../api/user'
import { setAccessToken, getAccessToken } from '../api/client'

function normalizePermissions(raw) {
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object') {
    return Object.keys(raw)
  }
  return []
}

function extractPermissions(respData) {
  if (!respData) return []
  if (respData.permissions) return normalizePermissions(respData.permissions)
  return normalizePermissions(respData)
}

function hasAdminAccess(perms) {
  return perms.some((p) => p.startsWith('admin.') || p.startsWith('system.'))
}

const useAuthStore = create((set, get) => ({
  user: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  need2FA: false,
  loginToken: null,

  initialize: async () => {
    try {
      const token = getAccessToken()
      if (token) {
        try {
          const [profileRes, permRes] = await Promise.all([
            userApi.getProfile(),
            userApi.getMyPermissions().catch(() => ({ data: { data: [] } })),
          ])
          const perms = extractPermissions(permRes.data.data)
          set({
            user: profileRes.data.data,
            permissions: perms,
            isAuthenticated: true,
            isInitialized: true,
          })
          return
        } catch (err) {
          if (err.response?.status === 401) {
            setAccessToken(null)
            set({
              user: null,
              permissions: [],
              isAuthenticated: false,
              isInitialized: true,
            })
            return
          }
          throw err
        }
      }
      try {
        const refreshRes = await authApi.refreshToken()
        setAccessToken(refreshRes.data.data.access_token)
        const [meRes, permRes] = await Promise.all([
          userApi.getProfile(),
          userApi.getMyPermissions().catch(() => ({ data: { data: [] } })),
        ])
        const perms = extractPermissions(permRes.data.data)
        set({
          user: meRes.data.data,
          permissions: perms,
          isAuthenticated: true,
          isInitialized: true,
        })
        return
      } catch {
        setAccessToken(null)
      }
    } catch {
      setAccessToken(null)
    }
    set({
      user: null,
      permissions: [],
      isAuthenticated: false,
      need2FA: false,
      loginToken: null,
      isInitialized: true,
    })
  },

  login: async (username, password) => {
    set({ isLoading: true })
    try {
      const res = await authApi.login({ username, password })
      const data = res.data.data
      if (data.need_2fa) {
        set({
          need2FA: true,
          loginToken: data.login_token,
          isLoading: false,
        })
        return { need2FA: true }
      }
      setAccessToken(data.access_token)
      const [meRes, permRes] = await Promise.all([
        userApi.getProfile(),
        userApi.getMyPermissions().catch(() => ({ data: { data: [] } })),
      ])
      const perms = extractPermissions(permRes.data.data)
      set({
        user: meRes.data.data,
        permissions: perms,
        isAuthenticated: true,
        isLoading: false,
        need2FA: false,
        loginToken: null,
      })
      return { success: true }
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  verify2FA: async (code) => {
    set({ isLoading: true })
    try {
      const { loginToken } = get()
      const res = await authApi.login2FA({ login_token: loginToken, code })
      setAccessToken(res.data.data.access_token)
      const [meRes, permRes] = await Promise.all([
        userApi.getProfile(),
        userApi.getMyPermissions().catch(() => ({ data: { data: [] } })),
      ])
      const perms = extractPermissions(permRes.data.data)
      set({
        user: meRes.data.data,
        permissions: perms,
        isAuthenticated: true,
        isLoading: false,
        need2FA: false,
        loginToken: null,
      })
      return { success: true }
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore
    }
    setAccessToken(null)
    set({
      user: null,
      permissions: [],
      isAuthenticated: false,
      need2FA: false,
      loginToken: null,
    })
  },

  refreshUser: async () => {
    try {
      const [profileRes, permRes] = await Promise.all([
        userApi.getProfile(),
        userApi.getMyPermissions().catch(() => ({ data: { data: [] } })),
      ])
      const perms = extractPermissions(permRes.data.data)
      set({ user: profileRes.data.data, permissions: perms })
    } catch {
      // ignore
    }
  },

  hasAdminAccess: () => {
    const { permissions } = get()
    return hasAdminAccess(permissions)
  },
}))

export default useAuthStore
