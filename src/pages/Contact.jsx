import { STORE_CONFIG } from '../config'

function Contact() {
  const whatsappInquiryUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello ZUHANA, I would like to make an inquiry.')}`

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="container">
          <span className="section-tag">GET IN TOUCH</span>
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">
            We are here to assist you with orders, product inquiries, and custom requests.
          </p>
        </div>
      </div>

      <section className="section contact-content-section">
        <div className="container contact-cards-grid">
          {/* Instagram Contact Card */}
          <div className="contact-card instagram-card">
            <div className="contact-card-icon instagram-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <h3>Instagram</h3>
            <p>Follow our latest drops, styling previews, and direct message our team.</p>
            <span className="contact-handle">@zuhana6373</span>
            <a
              href={STORE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-action-btn instagram-btn"
            >
              Visit Instagram Profile
            </a>
          </div>

          {/* WhatsApp Contact Card */}
          <div className="contact-card whatsapp-contact-card">
            <div className="contact-card-icon whatsapp-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-svg">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <h3>Customer Support</h3>
            <p>Need immediate assistance with an order or product details? Chat with us directly.</p>
            <span className="contact-handle">+92 371 6905156</span>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-action-btn whatsapp-action-btn"
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* Delivery & Service Info Card */}
          <div className="contact-card info-card">
            <div className="contact-card-icon info-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-svg">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3>Delivery & Support Hours</h3>
            <p>We deliver across Pakistan with standard delivery times of 2 to 5 business days.</p>
            <div className="contact-hours-info">
              <span>Support available 7 days a week</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
