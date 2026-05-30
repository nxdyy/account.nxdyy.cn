import { Link } from 'react-router-dom'
import AuthFooter from '../../components/AuthFooter'
import './Legal.css'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

export default function TermsOfService() {
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
          <h1 className="legal-title">服务条款</h1>
          <p className="legal-date">更新日期：2025年1月1日</p>
          
          <div className="legal-content">
            <section className="legal-section">
              <h2>1. 服务说明</h2>
              <p>隐向账户系统（以下简称"本服务"）是由nxdyy（以下简称"本服务提供商"）向用户提供的账户管理平台服务。本服务包括用户认证、账户管理、安全设置等功能。</p>
            </section>

            <section className="legal-section">
              <h2>2. 账户注册与安全</h2>
              <p>用户在使用本服务前，需要注册一个账户。用户承诺：</p>
              <ul>
                <li>提供真实、准确、完整的个人信息</li>
                <li>妥善保管账户信息，不得向他人泄露</li>
                <li>及时更新个人信息以保持其真实性</li>
                <li>对账户下发生的所有活动承担责任</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. 服务使用规范</h2>
              <p>用户在使用本服务时，应遵守以下规定：</p>
              <ul>
                <li>不得利用本服务从事任何违法活动</li>
                <li>不得试图未经授权访问其他用户的账户</li>
                <li>不得干扰或破坏本服务的正常运行</li>
                <li>不得使用自动化工具或脚本访问本服务</li>
                <li>遵守当地法律法规，不得利用本服务进行洗钱、欺诈等违法活动</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4. 隐私保护</h2>
              <p>我们重视用户的隐私保护。关于我们如何收集、使用和保护您的个人信息，请参阅《隐私政策》。我们会采取合理的安全措施保护您的数据安全。</p>
            </section>

            <section className="legal-section">
              <h2>5. 知识产权</h2>
              <p>本服务及其包含的所有内容（包括但不限于文字、图片、图标、设计、数据、软件等）的知识产权归本服务提供商所有。用户不得未经授权复制、修改、传播或使用这些内容。</p>
            </section>

            <section className="legal-section">
              <h2>6. 服务变更与终止</h2>
              <p>本服务提供商保留随时修改、暂停或终止服务的权利。我们会通过合理方式通知用户。在服务终止时，我们将根据法律法规处理用户数据。</p>
            </section>

            <section className="legal-section">
              <h2>7. 免责声明</h2>
              <p>在法律允许的最大范围内，本服务提供商不对以下情况承担责任：</p>
              <ul>
                <li>因不可抗力导致的服务中断或数据丢失</li>
                <li>用户因自身原因导致的账户安全问题</li>
                <li>第三方行为导致的损失</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>8. 协议修改</h2>
              <p>本服务提供商有权随时修改本服务条款。修改后的条款将在网站上公布。如果您在修改后继续使用服务，视为您接受修改后的条款。</p>
            </section>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  )
}
