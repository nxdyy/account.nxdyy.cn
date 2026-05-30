import { Link } from 'react-router-dom'
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
          <Link to="/terms" className="footer-link">服务条款</Link>
          <Link to="/privacy" className="footer-link">隐私政策</Link>
          <Link to="/help" className="footer-link">帮助中心</Link>
        </div>
      </div>
    </footer>
  )
}
