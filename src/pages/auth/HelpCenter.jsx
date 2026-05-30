import { Link } from 'react-router-dom'
import { useState } from 'react'
import AuthFooter from '../../components/AuthFooter'
import './Legal.css'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function SecurityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function DeviceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

const faqCategories = [
  {
    id: 'account',
    title: '账户问题',
    icon: AccountIcon,
    questions: [
      {
        q: '如何注册隐向账户？',
        a: '访问登录页面，点击"注册"链接，填写邮箱地址和密码即可完成注册。注册后需要验证邮箱。'
      },
      {
        q: '忘记密码怎么办？',
        a: '在登录页面点击"忘记密码"，输入注册时使用的邮箱地址，我们会发送验证码帮助您重置密码。'
      },
      {
        q: '如何修改个人信息？',
        a: '登录后进入"账户概览"或"个人信息"页面，可以修改昵称、头像等个人信息。'
      },
      {
        q: '如何注销账户？',
        a: '请联系我们的客服团队申请注销账户。注销后，您的所有数据将被永久删除，且无法恢复。'
      }
    ]
  },
  {
    id: 'security',
    title: '安全设置',
    icon: SecurityIcon,
    questions: [
      {
        q: '什么是二步验证（2FA）？',
        a: '二步验证是一种额外的安全保护措施。在输入密码后，还需要输入通过手机应用（如Google Authenticator）生成的临时验证码，大大提高账户安全性。'
      },
      {
        q: '如何启用二步验证？',
        a: '登录后进入"安全设置"页面，找到二步验证选项，按提示扫描二维码或输入密钥即可启用。'
      },
      {
        q: '开启二步验证后无法登录怎么办？',
        a: '如果您无法访问二步验证设备，请联系客服团队协助验证身份后重置二步验证设置。'
      },
      {
        q: '如何设置强密码？',
        a: '建议使用至少8位字符，包含大小写字母、数字和特殊符号的密码。避免使用生日、电话号码等容易被猜到的信息。'
      }
    ]
  },
  {
    id: 'devices',
    title: '设备管理',
    icon: DeviceIcon,
    questions: [
      {
        q: '如何查看登录设备？',
        a: '登录后进入"设备管理"页面，可以查看所有已登录的设备列表，包括设备类型、登录时间和位置。'
      },
      {
        q: '如何退出其他设备的登录？',
        a: '在"设备管理"页面，点击对应设备旁边的"退出登录"按钮即可。该设备的登录状态将被强制终止。'
      },
      {
        q: '设备列表显示的位置信息准确吗？',
        a: '位置信息基于IP地址估算，可能与实际位置有偏差，仅供参考。'
      }
    ]
  },
  {
    id: 'support',
    title: '联系支持',
    icon: SupportIcon,
    questions: [
      {
        q: '如何联系客服？',
        a: '您可以通过邮件联系我们：support@nxdyy.cn。我们会在1-3个工作日内回复您。'
      },
      {
        q: '客服工作时间是？',
        a: '我们的客服团队工作时间为工作日 9:00-18:00（北京时间）。非工作时间的问题将在下一个工作日处理。'
      },
      {
        q: '提交工单后多久能得到回复？',
        a: '我们承诺在1个工作日内回复您的工单。复杂问题可能需要更长时间，我们会及时更新进度。'
      }
    ]
  }
]

export default function HelpCenter() {
  const [expandedCategory, setExpandedCategory] = useState('account')
  const [expandedQuestion, setExpandedQuestion] = useState(null)

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  const toggleQuestion = (questionIndex) => {
    setExpandedQuestion(expandedQuestion === questionIndex ? null : questionIndex)
  }

  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <Link to="/login" className="legal-back-link">
            <BackIcon />
            <span>返回登录</span>
          </Link>
        </div>
        
        <div className="legal-card">
          <div className="help-hero">
            <HelpIcon />
            <h1 className="legal-title">帮助中心</h1>
            <p className="legal-date">找到常见问题的答案，或联系我们的支持团队</p>
          </div>

          <div className="help-categories">
            {faqCategories.map((category) => {
              const IconComponent = category.icon
              const isExpanded = expandedCategory === category.id
              
              return (
                <div key={category.id} className={`help-category ${isExpanded ? 'expanded' : ''}`}>
                  <button 
                    className="help-category-header"
                    onClick={() => toggleCategory(category.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="help-category-info">
                      <IconComponent />
                      <span className="help-category-title">{category.title}</span>
                    </div>
                    <svg 
                      className={`help-category-arrow ${isExpanded ? 'rotated' : ''}`}
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      width="20" 
                      height="20"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  
                  {isExpanded && (
                    <div className="help-questions">
                      {category.questions.map((item, index) => {
                        const questionKey = `${category.id}-${index}`
                        const isQuestionExpanded = expandedQuestion === questionKey
                        
                        return (
                          <div key={index} className="help-question">
                            <button
                              className="help-question-header"
                              onClick={() => toggleQuestion(questionKey)}
                              aria-expanded={isQuestionExpanded}
                            >
                              <span>{item.q}</span>
                              <svg 
                                className={`help-question-arrow ${isQuestionExpanded ? 'rotated' : ''}`}
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2"
                                width="16" 
                                height="16"
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                            {isQuestionExpanded && (
                              <div className="help-answer">
                                <p>{item.a}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="help-contact">
            <h2>没有找到答案？</h2>
            <p>我们的支持团队随时为您提供帮助</p>
            <a href="mailto:support@nxdyy.cn" className="help-contact-button">
              联系支持团队
            </a>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  )
}
