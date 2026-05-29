export default function AuthFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="auth-global-footer">
      <div className="auth-global-footer-content">
        <span className="auth-global-footer-brand">隐向账户</span>
        <span className="auth-global-footer-divider">|</span>
        <span>© {currentYear} 隐向科技</span>
        <span className="auth-global-footer-divider">|</span>
        <a href='https://beian.miit.gov.cn/' target='_blank' rel='noreferrer' className="auth-global-footer-link">晋ICP备2026006275号-1</a>
        <span className="auth-global-footer-divider">|</span>
        <div className="auth-global-footer-links">
          <a href="#" className="auth-global-footer-link">服务条款</a>
          <a href="#" className="auth-global-footer-link">隐私政策</a>
          <a href="#" className="auth-global-footer-link">帮助中心</a>
        </div>
      </div>
    </footer>
  )
}
