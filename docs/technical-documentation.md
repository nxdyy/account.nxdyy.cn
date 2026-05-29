# 隐向账户系统 - 前端技术文档

## 1. 项目概述

隐向账户系统是一个基于 React 的用户账户管理前端应用，提供用户认证、账户管理、安全设置和管理后台等功能。

- **项目名称**: account.nxdyy.cn
- **技术栈**: React 19 + Vite + React Router + Zustand + Axios + Framer Motion
- **构建工具**: Vite 8
- **包管理器**: npm/yarn

## 2. 技术栈详解

### 2.1 核心依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| react | ^19.2.5 | UI 框架 |
| react-dom | ^19.2.5 | React DOM 渲染 |
| react-router-dom | ^7.14.2 | 客户端路由 |
| zustand | ^5.0.12 | 状态管理 |
| axios | ^1.16.0 | HTTP 请求 |
| framer-motion | ^12.38.0 | 页面过渡动画 |

### 2.2 新增/升级功能

#### 2.2.1 深色模式支持

系统支持浅色/深色模式切换，通过 CSS 变量和 Zustand 状态管理实现：

- **主题存储**: `src/store/themeStore.js`
- **切换方式**: 顶栏主题按钮 或 跟随系统偏好
- **持久化**: 使用 localStorage 保存用户偏好

**使用方法**:
```jsx
import useThemeStore from './store/themeStore'

// 在组件中使用
const theme = useThemeStore((s) => s.theme)
const toggleTheme = useThemeStore((s) => s.toggleTheme)

// 切换主题
toggleTheme()
```

### 2.3 开发依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| vite | ^8.0.10 | 构建工具 |
| @vitejs/plugin-react | ^6.0.1 | React 支持 |
| eslint | ^10.2.1 | 代码检查 |

## 3. 项目结构

```
account.nxdyy.cn/
├── public/                  # 静态资源
├── docs/                    # 文档目录
│   └── technical-documentation.md  # 技术文档
├── src/
│   ├── api/                 # API 接口层
│   │   ├── auth.js          # 认证相关 API
│   │   ├── user.js          # 用户相关 API
│   │   ├── admin.js         # 管理后台 API
│   │   └── client.js        # Axios 客户端配置
│   ├── components/          # 通用组件
│   │   ├── Button.jsx       # 按钮组件
│   │   ├── Card.jsx         # 卡片组件
│   │   ├── Input.jsx        # 表单输入组件
│   │   ├── Modal.jsx        # 模态框组件
│   │   ├── Table.jsx        # 表格组件
│   │   ├── Toast.jsx        # Toast 通知组件
│   │   ├── Toast.css        # Toast 样式
│   │   ├── PageTransition.jsx # 页面过渡动画
│   │   ├── ProtectedRoute.jsx # 路由守卫
│   │   ├── AuthFooter.jsx   # 认证页面页脚
│   │   └── Layout/          # 布局组件
│   │       ├── Layout.jsx   # 主布局
│   │       ├── Sidebar.jsx  # 侧边栏导航
│   │       ├── TopBar.jsx   # 顶部栏
│   │       └── *.css        # 布局样式
│   ├── pages/               # 页面组件
│   │   ├── auth/            # 认证页面
│   │   │   ├── Login.jsx    # 登录
│   │   │   ├── Login2FA.jsx # 二步验证
│   │   │   ├── Register.jsx # 注册
│   │   │   └── ForgotPassword.jsx # 找回密码
│   │   ├── account/         # 账户管理页面
│   │   │   ├── Overview.jsx # 账户概览
│   │   │   ├── YourInfo.jsx # 个人信息
│   │   │   ├── Security.jsx # 安全设置
│   │   │   ├── Devices.jsx  # 设备管理
│   │   │   ├── Privacy.jsx  # 隐私设置
│   │   │   └── Subscriptions.jsx # 订阅服务
│   │   └── admin/           # 管理后台页面
│   │       ├── AdminDashboard.jsx # 管理仪表盘
│   │       ├── Users.jsx    # 用户管理
│   │       ├── Roles.jsx    # 角色管理
│   │       ├── Permissions.jsx # 权限管理
│   │       ├── SecurityConfig.jsx # 安全策略
│   │       ├── SSOClients.jsx # SSO 客户端
│   │       ├── AuditLogs.jsx # 审计日志
│   │       └── SystemApiMappings.jsx # API 映射
│   ├── store/               # 状态管理
│   │   ├── authStore.js     # 认证状态存储
│   │   ├── toastStore.js    # Toast 通知状态
│   │   └── themeStore.js    # 主题状态存储
│   ├── styles/              # 全局样式
│   │   └── variables.css    # CSS 变量
│   ├── index.css            # 全局样式入口
│   ├── App.jsx              # 应用根组件
│   └── main.jsx             # 应用入口
├── index.html               # HTML 模板
├── package.json             # 项目配置
├── vite.config.js           # Vite 配置
└── eslint.config.js         # ESLint 配置
```

## 4. 架构设计

### 4.1 分层架构

```
┌─────────────────────────────────────┐
│           页面层 (Pages)             │
│  Login / Register / Overview / ...  │
├─────────────────────────────────────┤
│           组件层 (Components)        │
│  Button / Card / Modal / Toast ...  │
├─────────────────────────────────────┤
│           状态层 (Store)             │
│    Zustand Auth Store / Toast Store │
├─────────────────────────────────────┤
│           API 层 (API)               │
│    auth.js / user.js / admin.js     │
├─────────────────────────────────────┤
│           客户端 (Client)            │
│         Axios HTTP Client           │
└─────────────────────────────────────┘
```

### 4.2 路由结构

```
/                           -> 重定向到 /account
/login                      -> 登录页
/login/2fa                  -> 二步验证
/register                   -> 注册页
/forgot-password            -> 找回密码

/account                    -> 账户概览 (需登录)
/account/info               -> 个人信息 (需登录)
/account/security           -> 安全设置 (需登录)
/account/devices            -> 设备管理 (需登录)
/account/privacy            -> 隐私设置 (需登录)
/account/subscriptions      -> 订阅服务 (需登录)

/admin                      -> 管理仪表盘 (需管理员)
/admin/users                -> 用户管理 (需管理员)
/admin/roles                -> 角色管理 (需管理员)
/admin/permissions          -> 权限管理 (需管理员)
/admin/security-config      -> 安全策略 (需管理员)
/admin/sso                  -> SSO 客户端 (需管理员)
/admin/audit-logs           -> 审计日志 (需管理员)
/admin/system/api-mappings  -> 系统运维 (需管理员)
```

## 5. 核心模块详解

### 5.1 认证系统 (Auth)

#### 5.1.1 认证流程

1. **登录流程**:
   ```
   用户输入账号密码 -> login() API -> 检查 need_2fa
   -> 需要 2FA: 跳转 /login/2fa -> verify2FA() -> 设置 token -> 跳转 /account
   -> 不需要 2FA: 设置 token -> 跳转 /account
   ```

2. **Token 刷新**:
   ```
   API 请求返回 401 (code: 1002) -> 自动刷新 token -> 重试原请求
   ```

3. **初始化流程**:
   ```
   App 加载 -> initialize() -> 检查 localStorage token
   -> 有 token: 获取用户信息 + 权限
   -> 无 token: 尝试 refreshToken -> 成功则获取用户信息
   ```

#### 5.1.2 错误处理规范

所有认证相关操作都需要区分网络错误和业务错误：

```javascript
} catch (err) {
  let msg
  if (!err.response) {
    // 网络错误（无响应）
    msg = '无法连接到服务器，请检查网络连接'
  } else {
    // 业务错误，使用服务器返回的消息或默认提示
    msg = err.response.data?.message || '默认错误提示'
  }
  showError(msg)
}
```

### 5.2 状态管理 (Zustand)

#### 5.2.1 AuthStore 结构

```javascript
{
  user: null,              // 当前用户信息
  permissions: [],         // 用户权限列表
  isAuthenticated: false,  // 是否已认证
  isLoading: false,        // 加载状态
  isInitialized: false,    // 是否已初始化
  need2FA: false,          // 是否需要二步验证
  loginToken: null,        // 2FA 临时 token
}
```

#### 5.2.2 主要方法

| 方法 | 功能 |
|------|------|
| initialize() | 应用初始化，恢复登录状态 |
| login(username, password) | 用户登录 |
| verify2FA(code) | 验证二步验证码 |
| logout() | 退出登录 |
| refreshUser() | 刷新用户信息 |
| hasAdminAccess() | 检查是否有管理员权限 |

#### 5.2.3 ToastStore 结构

```javascript
{
  toasts: [],              // Toast 列表
}
```

#### 5.2.4 Toast 主要方法

| 方法 | 功能 |
|------|------|
| addToast(options) | 添加 Toast 通知 |
| removeToast(id) | 移除指定 Toast |
| clearAll() | 清空所有 Toast |
| showError(message, detail) | 显示错误 Toast |
| showSuccess(message, detail) | 显示成功 Toast |
| showWarning(message, detail) | 显示警告 Toast |

#### 5.2.5 ThemeStore 结构

```javascript
{
  theme: 'light',          // 当前主题: 'light' | 'dark'
}
```

#### 5.2.6 ThemeStore 主要方法

| 方法 | 功能 |
|------|------|
| initialize() | 初始化主题（从 localStorage 或系统偏好读取） |
| toggleTheme() | 切换浅色/深色模式 |
| setTheme(theme) | 设置指定主题 |

### 5.3 API 层

#### 5.3.1 Axios 客户端配置

- **Base URL**: `/api`
- **Timeout**: 15000ms
- **Credentials**: withCredentials: true
- **Content-Type**: application/json

#### 5.3.2 响应拦截器

自动处理 Token 刷新：
- 当收到 401 且 code 为 1002 时
- 自动调用 `/auth/refresh` 获取新 token
- 使用新 token 重试原请求

#### 5.3.3 API 模块

| 模块 | 文件 | 功能 |
|------|------|------|
| 认证 | auth.js | 登录、注册、找回密码、Token 刷新 |
| 用户 | user.js | 用户信息、会话、2FA、日志、安全提醒 |
| 管理 | admin.js | 用户/角色/权限管理、审计日志、系统配置 |

### 5.4 权限系统

#### 5.4.1 权限格式

权限以字符串形式存储，使用点号分隔：
- `admin.dashboard` - 仪表盘访问
- `admin.user` - 用户管理
- `admin.role` - 角色管理
- `admin.permission` - 权限管理
- `admin.security` - 安全策略
- `admin.sso` - SSO 客户端
- `admin.log` - 审计日志
- `system.api` - 系统运维

#### 5.4.2 权限检查

```javascript
// 检查是否有管理员权限
function hasAdminAccess(perms) {
  return perms.some((p) => p.startsWith('admin.') || p.startsWith('system.'))
}

// 检查具体权限
function hasPermission(permissions, permPrefix) {
  return Array.isArray(permissions) && permissions.some((p) => p.startsWith(permPrefix))
}
```

#### 5.4.3 路由守卫

```javascript
// ProtectedRoute 组件
// - 未登录 -> 跳转登录页
// - 需要管理员权限但无权限 -> 跳转账户页
```

## 6. 组件系统

### 6.1 通用组件

#### Button 组件

```jsx
<Button
  variant="primary|secondary|danger|text"  // 按钮样式
  size="sm|md|lg"                           // 按钮大小
  full={true|false}                         // 是否全宽
  disabled={true|false}                     // 是否禁用
  type="button|submit"                      // 按钮类型
>
  按钮文本
</Button>
```

#### Card 组件

```jsx
<Card>
  <CardHeader
    icon={IconComponent}    // 图标组件
    title="标题"            // 标题
    subtitle="副标题"       // 副标题
    accent={true|false}     // 是否强调
    action={<Button />}     // 操作按钮
  />
  <CardBody position="full|top|bottom">
    内容
  </CardBody>
  <CardFooter>底部</CardFooter>
</Card>

<CardRow
  label="标签"
  value="值"
  action={<Button />}
/>
```

#### Form 组件

```jsx
<FormGroup>
  <FormLabel htmlFor="inputId">标签</FormLabel>
  <FormInput
    id="inputId"
    type="text|password|email|number"
    placeholder="提示文本"
    error={errorMessage}    // 错误信息
    hint={hintText}         // 提示文本
  />
</FormGroup>

<FormSelect>
  <option>选项</option>
</FormSelect>

<FormTextarea />

<FormCheckbox id="checkId" label="复选框标签" />
```

#### Table 组件

```jsx
<Table
  columns={[
    { key: 'name', title: '名称', render: (value, row) => <span>{value}</span> },
    { key: 'actions', title: '操作', render: (value, row) => <Button /> }
  ]}
  data={[{ id: 1, name: 'test' }]}
  emptyText="暂无数据"
/>
```

#### Modal 组件

```jsx
<Modal
  open={isOpen}
  onClose={handleClose}
  title="标题"
  footer={<><Button>取消</Button><Button>确认</Button></>}
>
  内容
</Modal>
```

**动画特性**:
- **遮罩层动画**: 淡入淡出效果，透明度从 0 到 1，持续 0.2 秒
- **弹窗动画**: 缩放 + 位移动画
  - 打开时: 从 95% 缩放比例和向下偏移 20px 动画到正常状态，持续 0.25 秒，使用 `easeOut` 缓动函数
  - 关闭时: 缩放到 95% 并向下偏移 20px，持续 0.2 秒，使用 `easeIn` 缓动函数
- **AnimatePresence**: 支持组件卸载时的退出动画

#### Toast 组件

全局通知组件，支持自动关闭、悬停暂停、查看详情、一键复制。

```jsx
// 在 App.jsx 中挂载
<ToastContainer />

// 使用方式
import { showError, showSuccess, showWarning } from './store/toastStore'

// 简单提示
showError('操作失败')
showSuccess('操作成功')

// 带详细信息的提示
showError('登录失败', '无法连接到服务器，请检查网络连接')
showError('请求失败', {
  status: 500,
  message: 'Internal Server Error',
  timestamp: '2024-01-15T10:30:00Z'
})
```

**Toast 功能特性**:
- **位置**: 页面顶部居中，固定在 TopBar 下方
- **自动关闭**: 默认 5 秒后自动消失，底部有进度条显示剩余时间
- **悬停暂停**: 鼠标放上去暂停倒计时，移开后继续
- **关闭按钮**: 右上角有关闭按钮
- **查看详情**: 如果有详细错误信息，显示"查看详细信息"文字链接，点击展开
- **一键复制**: 展开详情后显示"复制"按钮，点击复制完整内容
- **类型样式**: 支持 success(绿色)、error(红色)、warning(橙色)、info(青色) 四种类型
- **动画**: 滑入滑出动画
- **多通知**: 支持同时显示多个 Toast

### 6.2 布局组件

#### Layout 组件

```jsx
// 普通布局
<Layout>
  <Outlet />
</Layout>

// 宽屏布局（管理后台）
<Layout wide>
  <Outlet />
</Layout>
```

布局结构：
```
┌─────────────────────────────┐
│          TopBar              │
├──────────┬──────────────────┤
│          │                    │
│ Sidebar  │     Main Content   │
│          │                    │
│          │                    │
├──────────┴──────────────────┤
│         Footer               │
└─────────────────────────────┘
```

#### Footer 页脚

全局页脚组件，显示在页面底部，包含版权信息、备案号和相关链接：

```jsx
// 在 Layout 中自动集成，无需手动添加
<Footer />
```

**功能特性**:
- **品牌标识**: 显示应用名称
- **版权信息**: 自动显示当前年份
- **备案号**: 显示 ICP 备案号并链接到工信部网站
- **相关链接**: 服务条款、隐私政策、帮助中心
- **响应式设计**: 移动端自动调整为垂直布局
- **主题适配**: 自动适配浅色/深色模式

#### AuthFooter 认证页面页脚

认证页面专用页脚组件，固定在页面底部：

```jsx
// 在认证页面中使用
import AuthFooter from '../../components/AuthFooter'

export default function Login() {
  return (
    <div className="auth-page">
      {/* 页面内容 */}
      <AuthFooter />
    </div>
  )
}
```

**功能特性**:
- **固定定位**: 始终固定在页面底部
- **品牌标识**: 显示应用名称
- **版权信息**: 自动显示当前年份
- **备案号**: 显示 ICP 备案号并链接到工信部网站
- **相关链接**: 服务条款、隐私政策、帮助中心
- **响应式设计**: 移动端自动调整为垂直布局
- **主题适配**: 自动适配浅色/深色模式

**使用页面**:
- 登录页 (`/login`)
- 二步验证页 (`/login/2fa`)
- 注册页 (`/register`)
- 找回密码页 (`/forgot-password`)

#### TopBar 顶栏

顶栏包含菜单按钮、品牌标识、主题切换按钮和帮助按钮：

```jsx
// 顶栏组件自动集成主题切换和侧边栏折叠功能
<TopBar onToggleSidebar={toggleSidebar} isSidebarCollapsed={isCollapsed} />
```

**功能特性**:
- **菜单按钮**: 点击折叠/展开侧边栏
- **品牌标识**: 显示应用 Logo 和名称
- **主题切换按钮**: 点击切换浅色/深色模式，图标随主题变化（太阳/月亮）
- **帮助按钮**: 跳转到帮助页面

#### Sidebar 导航

- 用户导航项：账户、信息、安全、设备、隐私、订阅
- 管理导航项：根据权限动态显示

## 7. 样式系统

### 7.1 CSS 变量与主题系统

所有样式变量定义在 `src/styles/variables.css`，支持浅色/深色模式自动切换：

#### 颜色变量（自动适配主题）

| 变量 | 浅色模式 | 深色模式 | 用途 |
|------|----------|----------|------|
| --color-primary | #2b5c4f | #4a9b85 | 主色调 |
| --color-primary-hover | #1e453a | #5ab396 | 主色悬停 |
| --color-topbar-bg | #1b1b1b | #0d0d0d | 顶栏背景 |
| --color-page-bg | #f3f3f3 | #1a1a1a | 页面背景 |
| --color-card-bg | #ffffff | #242424 | 卡片背景 |
| --color-sidebar-bg | #f7f7f7 | #1e1e1e | 侧边栏背景 |
| --color-text-primary | #1b1b1b | #f0f0f0 | 主要文字 |
| --color-text-secondary | #616161 | #a0a0a0 | 次要文字 |
| --color-text-tertiary | #a0a0a0 | #707070 | 辅助文字 |
| --color-text-inverse | #ffffff | #ffffff | 反色文字（用于深色背景） |
| --color-danger | #c62828 | #ef5350 | 危险/错误 |
| --color-success | #2e7d32 | #66bb6a | 成功 |
| --color-warning | #e65100 | #ffa726 | 警告 |
| --color-border | #e0e0e0 | #3a3a3a | 边框颜色 |

#### 主题切换机制

通过 `data-theme` 属性控制主题：

```css
/* 默认浅色主题 */
:root {
  --color-primary: #2b5c4f;
  /* ... */
}

/* 深色主题 */
[data-theme="dark"] {
  --color-primary: #4a9b85;
  /* ... */
}
```

在 JS 中切换主题：
```javascript
// 设置为深色模式
document.documentElement.setAttribute('data-theme', 'dark')

// 设置为浅色模式
document.documentElement.setAttribute('data-theme', 'light')
```

#### 尺寸

| 变量 | 值 |
|------|-----|
| --sidebar-width | 250px |
| --topbar-height | 48px |
| --spacing-base | 16px |
| --radius-md | 6px |

### 7.2 样式文件组织

| 文件 | 范围 |
|------|------|
| index.css | 全局重置和基础样式 |
| variables.css | CSS 变量定义 |
| Auth.css | 认证页面样式 |
| Account.css | 账户页面样式 |
| Admin.css | 管理后台样式 |
| Button.css | 按钮组件样式 |
| Card.css | 卡片组件样式 |
| Input.css | 输入组件样式 |
| Modal.css | 模态框样式 |
| Table.css | 表格样式 |
| Toast.css | Toast 通知样式 |
| Layout.css | 布局样式 |
| Sidebar.css | 侧边栏样式 |
| TopBar.css | 顶部栏样式 |

## 8. 开发规范

### 8.1 代码风格

- 使用 ES6+ 语法
- 组件使用函数式组件 + Hooks
- 使用 JSX 语法
- 使用单引号

### 8.2 文件命名

- 组件文件：PascalCase.jsx（如 `Login.jsx`）
- 工具文件：camelCase.js（如 `authStore.js`）
- CSS 文件：与组件同名（如 `Login.jsx` + `Auth.css`）

### 8.3 组件规范

- 每个组件一个文件
- 默认导出组件
- 使用 PropTypes 或 JSDoc 注释（可选）

### 8.4 API 调用规范

- 所有 API 调用通过 api 目录
- 使用 async/await 处理异步
- 错误处理区分网络错误和业务错误
- 使用 Toast 显示错误/成功提示

### 8.5 状态管理规范

- 全局状态使用 Zustand
- 局部状态使用 useState/useReducer
- 避免过度使用全局状态

## 9. 构建与部署

### 9.1 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 代码检查
npm run lint
```

### 9.2 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 9.3 Vite 配置

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,  // 不清空输出目录
  },
})
```

## 10. 扩展指南

### 10.1 添加新页面

1. 在 `src/pages/` 下创建新页面组件
2. 在 `src/App.jsx` 中添加路由
3. 如需导航，在 `Sidebar.jsx` 中添加导航项

### 10.2 添加新 API

1. 在对应 api 文件中添加函数
2. 使用 client 发送请求
3. 在页面中调用并处理错误
4. 使用 `showError` / `showSuccess` 显示 Toast 提示

### 10.3 添加新组件

1. 在 `src/components/` 下创建组件
2. 创建对应的 CSS 文件
3. 导出并在页面中使用

### 10.4 添加新权限

1. 后端添加新权限点
2. 前端在 `Sidebar.jsx` 的 `adminNavItems` 中添加导航项
3. 使用 `perm` 字段指定所需权限

### 10.5 添加主题支持到新组件

1. 使用 CSS 变量定义颜色，避免硬编码：
```css
.my-component {
  color: var(--color-text-primary);
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
}
```

2. 如需添加新的主题变量，在 `variables.css` 的 `:root` 和 `[data-theme="dark"]` 中都定义：
```css
:root {
  --my-custom-color: #xxxxxx;
}

[data-theme="dark"] {
  --my-custom-color: #xxxxxx;
}
```

## 11. 常见问题

### 11.1 网络错误处理

所有 API 调用都需要处理网络错误：

```javascript
try {
  await apiCall()
} catch (err) {
  if (!err.response) {
    // 网络错误
    showError('无法连接到服务器，请检查网络连接')
  } else {
    // 业务错误
    showError(err.response.data?.message || '操作失败')
  }
}
```

### 11.2 Token 管理

- Access Token 存储在内存中（authStore）
- Refresh Token 存储在 HTTP-only Cookie 中
- Token 过期自动刷新

### 11.3 权限控制

- 路由级别：`ProtectedRoute` 组件
- 导航级别：`Sidebar` 根据权限过滤导航项
- 操作级别：前端隐藏无权限操作，后端做最终校验

### 11.4 Toast 通知使用

```javascript
import { showError, showSuccess, showWarning } from './store/toastStore'

// 简单提示
showError('操作失败')
showSuccess('保存成功')

// 带详细信息的提示（支持字符串或对象）
showError('登录失败', '无法连接到服务器，请检查网络连接')
showError('请求失败', {
  status: 500,
  message: 'Internal Server Error'
})

// 显示错误详情和堆栈
showError('操作失败', err.stack || err.message)
```
