import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

// 多页面入口配置
const pages = {
  // 认证页面
  login: resolve(__dirname, 'pages/login.html'),
  'login/2fa': resolve(__dirname, 'pages/login/2fa.html'),
  register: resolve(__dirname, 'pages/register.html'),
  'forgot/password': resolve(__dirname, 'pages/forgot/password.html'),

  // OAuth2 授权页面
  'oauth/login': resolve(__dirname, 'pages/oauth/login.html'),
  'oauth/authorize': resolve(__dirname, 'pages/oauth/authorize.html'),

  // 账户管理页面
  account: resolve(__dirname, 'pages/account.html'),
  'account/info': resolve(__dirname, 'pages/account/info.html'),
  'account/security': resolve(__dirname, 'pages/account/security.html'),
  'account/devices': resolve(__dirname, 'pages/account/devices.html'),
  'account/privacy': resolve(__dirname, 'pages/account/privacy.html'),
  'account/subscriptions': resolve(__dirname, 'pages/account/subscriptions.html'),

  // 管理后台页面
  admin: resolve(__dirname, 'pages/admin.html'),
  'admin/users': resolve(__dirname, 'pages/admin/users.html'),
  'admin/roles': resolve(__dirname, 'pages/admin/roles.html'),
  'admin/permissions': resolve(__dirname, 'pages/admin/permissions.html'),
  'admin/security/config': resolve(__dirname, 'pages/admin/security/config.html'),
  'admin/sso': resolve(__dirname, 'pages/admin/sso.html'),
  'admin/audit/logs': resolve(__dirname, 'pages/admin/audit/logs.html'),
  'admin/system/api/mappings': resolve(__dirname, 'pages/admin/system/api/mappings.html'),
}

// 复制 index.html 到根目录的插件
function copyIndexToRoot() {
  return {
    name: 'copy-index-to-root',
    closeBundle() {
      try {
        copyFileSync(
          resolve(__dirname, 'dist/pages/index.html'),
          resolve(__dirname, 'dist/index.html')
        )
        console.log('Copied index.html to dist root')
      } catch (err) {
        console.error('Failed to copy index.html:', err)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyIndexToRoot()],
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'pages/index.html'),
        ...pages
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  publicDir: 'public',
})
