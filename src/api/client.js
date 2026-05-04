import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

let accessToken = null
let refreshPromise = null

export function setAccessToken(token) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

client.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 1002 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true
      try {
        if (!refreshPromise) {
          refreshPromise = client.post('/auth/refresh').then((res) => {
            const newToken = res.data.data.access_token
            setAccessToken(newToken)
            refreshPromise = null
            return newToken
          }).catch((err) => {
            refreshPromise = null
            setAccessToken(null)
            throw err
          })
        }
        const newToken = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return client(originalRequest)
      } catch {
        setAccessToken(null)
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default client
