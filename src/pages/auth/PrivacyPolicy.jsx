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

export default function PrivacyPolicy() {
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
          <h1 className="legal-title">隐私政策</h1>
          <p className="legal-date">更新日期：2025年1月1日</p>
          
          <div className="legal-content">
            <section className="legal-section">
              <h2>1. 信息收集</h2>
              <p>我们收集的信息仅用于提供服务和支持，包括：</p>
              <ul>
                <li><strong>账户信息</strong>：邮箱地址、用户名等注册信息</li>
                <li><strong>安全信息</strong>：登录日志、设备信息用于账户安全保护</li>
                <li><strong>使用数据</strong>：服务使用情况统计用于改进服务质量</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>2. 信息使用</h2>
              <p>我们收集的信息将用于：</p>
              <ul>
                <li>提供、维护和改进我们的服务</li>
                <li>保护账户安全，检测和预防欺诈</li>
                <li>发送与服务相关的通知</li>
                <li>遵守法律法规要求</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. 信息共享</h2>
              <p>我们承诺不会出售您的个人信息。在以下情况下，我们可能会共享您的信息：</p>
              <ul>
                <li>获得您的明确同意</li>
                <li>根据法律法规要求或政府主管部门的命令</li>
                <li>为保护我们的合法权益而必须披露</li>
                <li>与服务提供商共享（仅用于提供服务，且受保密协议约束）</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4. 信息安全</h2>
              <p>我们采用多种安全措施保护您的信息：</p>
              <ul>
                <li>数据传输采用加密协议（HTTPS）</li>
                <li>敏感信息采用加密存储</li>
                <li>实施访问控制和权限管理</li>
                <li>定期进行安全审计和漏洞扫描</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. Cookie 使用</h2>
              <p>我们使用 Cookie 和类似技术来：</p>
              <ul>
                <li>记住您的偏好设置</li>
                <li>维持登录状态</li>
                <li>分析服务使用情况</li>
                <li>提供个性化服务</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>6. 您的权利</h2>
              <p>您对您的个人信息享有以下权利：</p>
              <ul>
                <li><strong>访问权</strong>：查看我们持有的关于您的信息</li>
                <li><strong>更正权</strong>：更正不准确的个人信息</li>
                <li><strong>删除权</strong>：要求删除您的个人信息</li>
                <li><strong>导出权</strong>：获取您的个人信息副本</li>
                <li><strong>撤销同意权</strong>：撤回对信息处理的同意</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>7. 数据保留</h2>
              <p>我们会在提供服务所必需的时间内保留您的信息。当您注销账户后，我们会在法律法规要求的期限内保留相关信息，然后将其删除或匿名化处理。</p>
            </section>

            <section className="legal-section">
              <h2>8. 第三方服务</h2>
              <p>我们的服务可能包含指向第三方网站的链接。我们不对第三方网站的隐私实践负责。建议您在使用第三方服务前阅读其隐私政策。</p>
            </section>

            <section className="legal-section">
              <h2>9. 未成年人保护</h2>
              <p>我们的服务不向未满18周岁的未成年人开放。如果我们有理由认为用户是未成年人且未获得适当授权，我们将停止向该用户提供服务。</p>
            </section>

            <section className="legal-section">
              <h2>10. 政策更新</h2>
              <p>我们可能会不时更新本隐私政策。重大变更时，我们将通过网站公告或邮件通知您。继续使用服务即表示您接受更新后的政策。</p>
            </section>

            <section className="legal-section">
              <h2>11. 联系我们</h2>
              <p>如果您对本隐私政策有任何疑问或担忧，请联系我们：</p>
              <p>邮箱：privacy@nxdyy.cn</p>
              <p>我们将在收到您的请求后尽快回复。</p>
            </section>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  )
}
