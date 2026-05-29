import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-copyright">© {currentYear} 隐向科技</span>
          <span className="footer-divider">|</span>
          <a href='https://beian.miit.gov.cn/' target='_blank' rel='noreferrer' className="footer-link">晋ICP备2026006275号-1</a>
        </div>
        <div className="footer-right">
          <a href="#" className="footer-link">服务条款</a>
          <a href="#" className="footer-link">隐私政策</a>
          <a href="#" className="footer-link">帮助中心</a>
        </div>
      </div>
    </footer>
  )
}
