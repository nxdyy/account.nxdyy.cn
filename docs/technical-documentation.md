# 隐向账户系统 - 前端技术文档

## 1. 项目概述

隐向账户系统是一个基于 React 的多页面用户账户管理前端应用，提供用户认证、账户管理、安全设置和管理后台等功能。

- **项目名称**: account.nxdyy.cn
- **技术栈**: React 19 + Vite + Zustand + Axios + Framer Motion
- **构建工具**: Vite 8
- **包管理器**: npm/yarn
- **架构模式**: 多页面应用 (MPA)

## 2. 技术栈详解

### 2.1 核心依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| react | ^19.2.5 | UI 框架 |
| react-dom | ^19.2.5 | React DOM 渲染 |
| zustand | ^5.0.12 | 状态管理 |
| axios | ^1.16.0 | HTTP 请求 |
| framer-motion | ^12.38.0 | 页面进入动画 |

### 2.2 开发依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| vite | ^8.0.10 | 构建工具 |
| @vitejs/plugin-react | ^6.0.1 | React 支持 |
| eslint | ^10.2.1 | 代码检查 |

## 3. 项目结构

```
account.nxdyy.cn/
├── pages/                   # 多页面 HTML 入口
│   ├── login.html           # 登录页入口
│   ├── login/
│   │   └── 2fa.html         # 二步验证页入口
│   ├── register.html        # 注册页入口
│   ├── forgot/
│   │   └── password.html    # 找回密码页入口
│   ├── oauth/               # OAuth2 授权页面
│   │   ├── authorize.html   # 授权确认页入口
│   │   └── login.html       # OAuth 登录中转页入口
│   ├── account.html         # 账户概览入口
│   ├── account/
│   │   ├── info.html        # 个人信息入口
│   │   ├── security.html    # 安全设置入口
│   │   ├── devices.html     # 设备管理入口
│   │   ├── privacy.html     # 隐私设置入口
│   │   └── subscriptions.html # 订阅服务入口
│   ├── admin.html           # 管理仪表盘入口
│   └── admin/
│       ├── users.html       # 用户管理入口
│       ├── roles.html       # 角色管理入口
│       ├── permissions.html # 权限管理入口
│       ├── security/
│       │   └── config.html  # 安全策略入口
│       ├── sso.html         # SSO 客户端入口
│       ├── audit/
│       │   └── logs.html    # 审计日志入口
│       └── system/
│           └── api/
│               └── mappings.html # 系统运维入口
├── public/                  # 静态资源
├── docs/                    # 文档目录
│   └── technical-documentation.md  # 技术文档
├── src/
│   ├── entries/             # 页面入口 JS 文件
│   │   ├── login.jsx        # 登录页入口
│   │   ├── login-2fa.jsx    # 二步验证页入口
│   │   ├── register.jsx     # 注册页入口
│   │   ├── forgot-password.jsx # 找回密码页入口
│   │   ├── oauth-login.jsx  # OAuth 登录中转页入口
│   │   ├── oauth-authorize.jsx # OAuth 授权确认页入口
│   │   ├── account.jsx      # 账户概览入口
│   │   ├── account-info.jsx # 个人信息入口
│   │   ├── account-security.jsx # 安全设置入口
│   │   ├── account-devices.jsx  # 设备管理入口
│   │   ├── account-privacy.jsx  # 隐私设置入口
│   │   ├── account-subscriptions.jsx # 订阅服务入口
│   │   ├── admin.jsx        # 管理仪表盘入口
│   │   ├── admin-users.jsx  # 用户管理入口
│   │   ├── admin-roles.jsx  # 角色管理入口
│   │   ├── admin-permissions.jsx # 权限管理入口
│   │   ├── admin-security-config.jsx # 安全策略入口
│   │   ├── admin-sso.jsx    # SSO 客户端入口
│   │   ├── admin-audit-logs.jsx # 审计日志入口
│   │   └── admin-system-api-mappings.jsx # 系统运维入口
│   ├── api/                 # API 接口层
│   │   ├── auth.js          # 认证相关 API
│   │   ├── user.js          # 用户相关 API
│   │   ├── admin.js         # 管理后台 API
│   │   ├── oauth2.js        # OAuth2 授权流程 API + Scope 定义
│   │   └── client.js        # Axios 客户端配置
│   ├── components/          # 通用组件
│   │   ├── Button.jsx       # 按钮组件
│   │   ├── Card.jsx         # 卡片组件
│   │   ├── Input.jsx        # 表单输入组件
│   │   ├── Modal.jsx        # 模态框组件
│   │   ├── Table.jsx        # 表格组件
│   │   ├── Toast.jsx        # Toast 通知组件
│   │   ├── Toast.css        # Toast 样式
│   │   ├── PageTransition.jsx # 页面进入动画
│   │   ├── ProtectedRoute.jsx # 路由守卫（保留用于兼容性）
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
│   │   ├── oauth/           # OAuth2 授权页面
│   │   │   ├── OAuthLogin.jsx # OAuth 登录中转页
│   │   │   ├── OAuthAuthorize.jsx # OAuth 授权确认页
│   │   │   └── OAuth.css    # OAuth 页面样式
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
│   │       └── SystemApiMappings.jsx # 系统运维
│   ├── store/               # 状态管理
│   │   ├── authStore.js     # 认证状态存储
│   │   └── toastStore.js    # Toast 通知状态
│   ├── styles/              # 全局样式
│   │   └── variables.css    # CSS 变量
│   ├── index.css            # 全局样式入口
│   ├── App.jsx              # 应用根组件（保留用于开发模式）
│   └── main.jsx             # 应用入口（保留用于开发模式）
├── index.html               # HTML 模板（开发模式使用）
├── package.json             # 项目配置
├── vite.config.js           # Vite 配置
└── eslint.config.js         # ESLint 配置
```

## 4. 架构设计

### 4.1 多页面架构 (MPA)

本项目采用多页面应用架构，每个页面拥有独立的 HTML 入口和 JS 入口：

```
┌─────────────────────────────────────────────┐
│              页面入口 (pages/*.html)           │
│  login.html / account.html / admin.html ...   │
├─────────────────────────────────────────────┤
│           JS 入口 (src/entries/*.jsx)          │
│  login.jsx / account.jsx / admin.jsx ...      │
├─────────────────────────────────────────────┤
│              页面组件 (Pages)                  │
│  Login / Overview / AdminDashboard ...        │
├─────────────────────────────────────────────┤
│              组件层 (Components)               │
│  Button / Card / Modal / Toast / Layout ...   │
├─────────────────────────────────────────────┤
│              状态层 (Store)                    │
│    Zustand Auth Store / Toast Store           │
├─────────────────────────────────────────────┤
│              API 层 (API)                      │
│    auth.js / user.js / admin.js               │
├─────────────────────────────────────────────┤
│              客户端 (Client)                   │
│         Axios HTTP Client                     │
└─────────────────────────────────────────────┘
```

### 4.2 页面结构

```
/login                      -> pages/login.html -> src/entries/login.jsx
/login/2fa                  -> pages/login/2fa.html -> src/entries/login-2fa.jsx
/register                   -> pages/register.html -> src/entries/register.jsx
/forgot/password            -> pages/forgot/password.html -> src/entries/forgot-password.jsx

/oauth/login                -> pages/oauth/login.html -> src/entries/oauth-login.jsx
/oauth/authorize            -> pages/oauth/authorize.html -> src/entries/oauth-authorize.jsx

/account                    -> pages/account.html -> src/entries/account.jsx
/account/info               -> pages/account/info.html -> src/entries/account-info.jsx
/account/security           -> pages/account/security.html -> src/entries/account-security.jsx
/account/devices            -> pages/account/devices.html -> src/entries/account-devices.jsx
/account/privacy            -> pages/account/privacy.html -> src/entries/account-privacy.jsx
/account/subscriptions      -> pages/account/subscriptions.html -> src/entries/account-subscriptions.jsx

/admin                      -> pages/admin.html -> src/entries/admin.jsx
/admin/users                -> pages/admin/users.html -> src/entries/admin-users.jsx
/admin/roles                -> pages/admin/roles.html -> src/entries/admin-roles.jsx
/admin/permissions          -> pages/admin/permissions.html -> src/entries/admin-permissions.jsx
/admin/security/config      -> pages/admin/security/config.html -> src/entries/admin-security-config.jsx
/admin/sso                  -> pages/admin/sso.html -> src/entries/admin-sso.jsx
/admin/audit/logs           -> pages/admin/audit/logs.html -> src/entries/admin-audit-logs.jsx
/admin/system/api/mappings  -> pages/admin/system/api/mappings.html -> src/entries/admin-system-api-mappings.jsx
```

## 5. 核心模块详解

### 5.1 认证系统 (Auth)

#### 5.1.1 登录流程

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
   页面加载 -> initialize() -> 检查 localStorage token
   -> 有 token: 获取用户信息 + 权限
   -> 无 token: 尝试 refreshToken -> 成功则获取用户信息
   -> 无权限: 根据页面类型决定跳转
   ```

#### 5.1.2 OAuth2 授权流程

**授权码模式 (Authorization Code Flow)**:
```
┌─────────────┐                                    ┌─────────────┐
│   第三方    │──(1) 请求授权 /oauth/authorize────>│  隐向账户   │
│   应用      │    ?client_id=xxx&redirect_uri=xxx │  系统       │
│             │    &scope=user.info+user.email     │             │
├─────────────┤                                    ├─────────────┤
│             │<──(2) 重定向到登录页（如需登录）────│             │
│             │    /oauth/login?client_id=xxx&...  │             │
│             │                                    │             │
│             │──(3) 登录后显示授权确认页 ─────────>│             │
│             │    /oauth/authorize?client_id=xxx  │             │
│             │    展示 scope 权限列表             │             │
│             │                                    │             │
│             │──(4) 用户确认授权 ─────────────────>│             │
│             │    POST /api/oauth/consent         │             │
│             │                                    │             │
│             │<──(5) 302 重定向到 redirect_uri ────│             │
│             │    ?code=AUTHORIZATION_CODE        │             │
│             │    &state=xxx                      │             │
│             │                                    │             │
│             │──(6) 用 code 请求 token ───────────>│             │
│             │    POST /api/oauth/token           │             │
│             │    {code, client_id, client_secret}│             │
│             │                                    │             │
│             │<──(7) 返回 access_token ────────────│             │
│             │    {access_token, refresh_token,   │             │
│             │     id_token, expires_in,          │             │
│             │     scope, token_type}             │             │
│             │                                    │             │
│             │──(8) 使用 access_token 获取用户信息>│             │
│             │    GET /api/oauth/userinfo         │             │
│             │    Authorization: Bearer xxx       │             │
│             │                                    │             │
│             │<──(9) 返回用户信息 ─────────────────│             │
│             │    {id, username, email, nickname} │             │
└─────────────┘                                    └─────────────┘
```

**前端页面**:

| 页面 | 路由 | 组件 | 功能 |
|------|------|------|------|
| OAuth 登录 | `/oauth/login` | `OAuthLogin.jsx` | 未登录用户的登录中转页，登录后跳转回授权页 |
| OAuth 授权确认 | `/oauth/authorize` | `OAuthAuthorize.jsx` | 显示第三方应用名称、请求的 Scope 权限列表、隐私说明、同意/拒绝按钮 |

**OAuth 登录页 (`/oauth/login`)**:
- 读取 URL 中的 OAuth 参数（client_id, redirect_uri, response_type, scope, state）
- 如果用户已登录，自动跳转到 `/oauth/authorize` 并携带原始参数
- 如果用户未登录，显示登录表单
- 登录成功后跳转到 `/oauth/authorize` 并携带原始参数
- 如需二步验证，跳转到 `/login/2fa` 并携带原始参数

**OAuth 授权确认页 (`/oauth/authorize`)**:
- 读取 URL 中的 OAuth 参数
- 如果用户未登录，重定向到 `/oauth/login` 并携带原始参数
- 如果用户已登录，调用后端 API 验证请求并获取客户端信息
- 显示授权确认界面：
  - 第三方应用名称
  - 请求的 Scope 权限列表（带中文描述）
  - 隐私保护说明
  - 当前登录用户信息
  - "同意授权"和"拒绝"按钮
- 用户点击"同意授权"：调用 `POST /api/oauth/consent` (consent=allow)，后端返回重定向 URL
- 用户点击"拒绝"：调用 `POST /api/oauth/consent` (consent=deny)，重定向到回调地址并附带 error=access_denied

**关键端点**:
| 端点 | 方法 | 描述 |
|------|------|------|
| `/oauth/authorize` | GET | 前端授权确认页面入口 |
| `/oauth/login` | GET | 前端 OAuth 登录中转页入口 |
| `/api/oauth/authorize` | GET | 后端授权验证接口 |
| `/api/oauth/consent` | POST | 后端授权确认提交接口 |
| `/api/oauth/token` | POST | 后端 Token 交换接口 |
| `/api/oauth/userinfo` | GET | 后端用户信息接口 |

**Scope 权限映射**（与后端 `pkg/oauth/scope.go` 对应）：

**用户相关 Scope**:
| Scope | 对应权限键 | 显示名称 | 用户信息端点返回字段 |
|-------|-----------|----------|---------------------|
| user.info | user.profile.read | 获取用户基本信息 | username, nickname, avatar, email, phone |
| user.email | user.email.read | 获取用户邮箱 | email |
| user.phone | user.phone.read | 获取用户手机号 | phone |
| user.password | user.password.write | 修改密码 | - |
| user.security | user.security.read | 获取安全设置 | twofa_enabled |
| user.session | user.session.read | 获取会话信息 | - |
| user.log | user.log.read | 获取操作日志 | - |
| user.permission | user.permission.read | 获取权限信息 | - |

**管理员 Scope**:
| Scope | 对应权限键 | 显示名称 | 用户信息端点返回字段 |
|-------|-----------|----------|---------------------|
| admin.user | admin.user.list | 管理用户 | - |
| admin.role | admin.role.list | 管理角色 | - |
| admin.permission | admin.permission.list | 管理权限定义 | - |
| admin.log | admin.log.read | 查看系统日志 | - |
| admin.security | admin.security.config | 管理系统安全配置 | - |
| admin.sso | admin.sso.list | 管理 SSO/OAuth 客户端 | - |
| admin.dashboard | admin.dashboard.read | 访问管理后台仪表盘 | - |

**系统 Scope**:
| Scope | 对应权限键 | 显示名称 | 用户信息端点返回字段 |
|-------|-----------|----------|---------------------|
| system.server | system.server.restart | 执行服务器重启 | - |
| system.api.mapping | system.api.mapping.read | 查看 API 权限映射 | - |

**权限校验规则**:
- 用户请求授权时，系统根据用户当前权限树自动过滤无权限的 scope
- 授权确认页面只展示用户有权限的 scope（后端已过滤）
- 生成的授权码只包含被允许的 scope
- Access Token 中的 scope 为实际被授权的 scope

**Scope 统一定义**:
前端在 `src/api/oauth2.js` 中维护了与后端一致的 Scope 定义（`OAUTH_SCOPES`），供以下场景使用：
1. SSO 客户端管理页面的 Scope 快捷选择器
2. 授权确认页面的 Scope 中文显示（`SCOPE_LABELS`）
3. 授权确认页面的 Scope 详细描述（`SCOPE_DESCRIPTIONS`）

**OAuth2 API 模块** (`src/api/oauth2.js`):

| 导出 | 类型 | 用途 |
|------|------|------|
| `OAUTH_SCOPES` | 常量 | 按分组定义的所有 Scope（user/admin/system） |
| `SCOPE_LABELS` | 常量 | Scope → 中文标签映射 |
| `SCOPE_DESCRIPTIONS` | 常量 | Scope → 详细描述映射 |
| `SCOPE_GROUPS` | 常量 | Scope 分组定义（用于选择器） |
| `getAuthorizeInfo(params)` | 函数 | 调用后端验证授权请求并获取客户端信息 |
| `submitConsent(data)` | 函数 | 提交授权确认（allow/deny） |

#### 5.1.3 SSO 客户端管理

SSO 客户端管理页面（`/admin/sso`）支持以下功能：

**客户端列表**:
- 显示客户端名称、Client ID（带复制按钮）、回调地址、授权范围（Scope 标签）、启用状态、创建时间
- 支持编辑和删除操作
- Client ID 支持一键复制

**创建/编辑客户端**:
- Client ID（创建时必填，编辑时不可修改）
- Client Secret（创建时必填，编辑时留空则不修改；支持显示/隐藏切换）
- 客户端名称
- 回调地址（多个用逗号分隔）
- 授权类型（默认 `authorization_code,refresh_token`）
- 授权范围 (Scopes)：使用 **Scope 快捷选择器**

**Scope 快捷选择器**:
- 按分组展示所有可用 Scope：用户权限、管理员权限、系统权限
- 每个 Scope 显示中文名称和 Scope 值
- 支持单个勾选/取消
- 支持按分组全选/取消全选
- 底部显示已选 Scope 的预览

**API 接口**:
| 接口 | 方法 | 说明 |
|------|------|------|
| `/sso/clients` | GET | 获取客户端列表 |
| `/sso/clients` | POST | 创建客户端 |
| `/sso/clients/:id` | PUT | 更新客户端 |
| `/sso/clients/:id` | DELETE | 删除客户端 |

#### 5.1.4 错误处理规范

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
| 管理 | admin.js | 用户/角色/权限管理、审计日志、系统配置、SSO 客户端 |
| OAuth2 | oauth2.js | OAuth2 授权流程、Scope 定义、授权确认提交 |

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

#### 5.4.3 页面级权限控制

在多页面架构中，权限控制通过以下方式实现：
1. **服务端渲染前检查**: 后端可在返回 HTML 前检查权限
2. **客户端初始化检查**: 每个页面入口组件初始化时检查权限
3. **导航控制**: Sidebar 根据权限动态显示导航项

### 5.5 页面动画

#### 5.5.1 页面进入动画

所有页面使用 `PageTransition` 组件实现统一的进入动画：

```jsx
import PageTransition from '../components/PageTransition'

// 在页面入口中使用
<PageTransition>
  <Login />
</PageTransition>
```

动画参数：
- **初始状态**: opacity: 0, y: 14
- **进入状态**: opacity: 1, y: 0
- **持续时间**: 0.25s
- **缓动函数**: easeOut

#### 5.5.2 布局内页面切换

在带 Layout 的页面中，动画同样通过 PageTransition 实现：

```jsx
<Layout>
  <PageTransition>
    <Overview />
  </PageTransition>
</Layout>
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

#### Toast 组件

全局通知组件，支持自动关闭、悬停暂停、查看详情、一键复制。

```jsx
// 在页面入口中挂载
<ToastContainer />

// 使用方式
import { showError, showSuccess, showWarning } from '../store/toastStore'

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
  <PageTransition>
    <Overview />
  </PageTransition>
</Layout>

// 宽屏布局（管理后台）
<Layout wide>
  <PageTransition>
    <AdminDashboard />
  </PageTransition>
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

#### Sidebar 导航

- 用户导航项：账户、信息、安全、设备、隐私、订阅
- 管理导航项：根据权限动态显示

## 7. 样式系统

### 7.1 CSS 变量

所有样式变量定义在 `src/styles/variables.css`：

#### 颜色

| 变量 | 值 | 用途 |
|------|-----|------|
| --color-primary | #2b5c4f | 主色调 |
| --color-primary-hover | #1e453a | 主色悬停 |
| --color-danger | #c62828 | 危险/错误 |
| --color-success | #2e7d32 | 成功 |
| --color-warning | #e65100 | 警告 |
| --color-page-bg | #f3f3f3 | 页面背景 |
| --color-card-bg | #ffffff | 卡片背景 |
| --color-sidebar-bg | #f7f7f7 | 侧边栏背景 |

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
| OAuth.css | OAuth2 授权页面样式 |
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
- 页面入口：kebab-case.jsx（如 `account-security.jsx`）

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

### 8.6 多页面开发规范

- 每个页面必须有独立的 HTML 入口（pages/*.html）
- 每个页面必须有独立的 JS 入口（src/entries/*.jsx）
- 页面间通过标准 `<a>` 标签或 `window.location` 跳转
- 共享组件和状态通过 Zustand 管理

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
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 多页面入口配置
const pages = {
  login: resolve(__dirname, 'pages/login.html'),
  'login/2fa': resolve(__dirname, 'pages/login/2fa.html'),
  register: resolve(__dirname, 'pages/register.html'),
  'forgot/password': resolve(__dirname, 'pages/forgot/password.html'),
  'oauth/login': resolve(__dirname, 'pages/oauth/login.html'),
  'oauth/authorize': resolve(__dirname, 'pages/oauth/authorize.html'),
  account: resolve(__dirname, 'pages/account.html'),
  'account/info': resolve(__dirname, 'pages/account/info.html'),
  // ... 其他页面
}

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: pages,
    },
  },
})
```

### 9.4 构建输出结构

```
dist/
├── login.html                    # 登录页
├── login/
│   └── 2fa.html                  # 二步验证页
├── register.html                 # 注册页
├── forgot/
│   └── password.html             # 找回密码页
├── oauth/
│   ├── login.html                # OAuth 登录中转页
│   └── authorize.html            # OAuth 授权确认页
├── account.html                  # 账户概览
├── account/
│   ├── info.html                 # 个人信息
│   ├── security.html             # 安全设置
│   ├── devices.html              # 设备管理
│   ├── privacy.html              # 隐私设置
│   └── subscriptions.html        # 订阅服务
├── admin.html                    # 管理仪表盘
├── admin/
│   ├── users.html                # 用户管理
│   ├── roles.html                # 角色管理
│   ├── permissions.html          # 权限管理
│   ├── security/
│   │   └── config.html           # 安全策略
│   ├── sso.html                  # SSO 客户端
│   ├── audit/
│   │   └── logs.html             # 审计日志
│   └── system/
│       └── api/
│           └── mappings.html     # 系统运维
└── assets/                       # 静态资源
    ├── login-[hash].js
    ├── login-2fa-[hash].js
    └── ...
```

## 10. 扩展指南

### 10.1 添加新页面

1. 在 `src/pages/` 下创建新页面组件（如 `NewPage.jsx`）
2. 在 `pages/` 下创建 HTML 入口文件（如 `new-page.html`）
3. 在 `src/entries/` 下创建 JS 入口文件（如 `new-page.jsx`）
4. 在 `vite.config.js` 中添加页面配置
5. 如需导航，在 `Sidebar.jsx` 中添加导航项

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

在多页面架构中：
- **页面级别**: 后端可在返回 HTML 前进行权限检查
- **导航级别**: `Sidebar` 根据权限过滤导航项
- **操作级别**: 前端隐藏无权限操作，后端做最终校验

### 11.4 Toast 通知使用

```javascript
import { showError, showSuccess, showWarning } from '../store/toastStore'

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

### 11.5 页面跳转

在多页面架构中，使用标准方式跳转：

```javascript
// 方式 1: 使用 window.location（完整页面刷新）
window.location.href = '/account'

// 方式 2: 使用 react-router 的 navigate（同域页面间）
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/account')

// 方式 3: 使用 <Link> 组件
import { Link } from 'react-router-dom'
<Link to="/account">账户</Link>
```

### 11.6 页面间状态共享

由于是多页面应用，状态不能直接共享。使用以下方式：

1. **localStorage**: 存储持久化状态
2. **Cookies**: 存储认证信息
3. **后端 API**: 获取共享数据
4. **URL 参数**: 传递简单数据

```javascript
// 存储到 localStorage
localStorage.setItem('key', JSON.stringify(data))

// 从 localStorage 读取
const data = JSON.parse(localStorage.getItem('key'))
```
