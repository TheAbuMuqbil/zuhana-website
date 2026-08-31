import { Link } from 'react-router-dom'
import logoWhite from '../assets/logo-white.png'

function Footer() {
  const instagramUrl = "https://www.instagram.com/zuhana6373?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-logo">
          <img src={logoWhite} alt="ZUHANA Logo" className="footer-logo-img" />
          <span className="logo-text">ZUHANA</span>
        </div>

        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/faqs">FAQs</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-social">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>@zuhana6373</span>
          </a>
        </div>

        <p className="footer-copy">&copy; 2026 ZUHANA. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
