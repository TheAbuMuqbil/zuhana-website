import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STORE_CONFIG } from '../config'

export const FAQS_DATA = [
  {
    id: 1,
    category: 'Products',
    question: 'What types of bags does Zuhana offer?',
    answer: 'Zuhana offers handbags, crossbody bags, tote bags, clutches, and shoulder bags.',
  },
  {
    id: 2,
    category: 'Materials',
    question: 'What material are Zuhana bags made from?',
    answer: 'Our bags are made from quality materials such as PU leather, selected for style and everyday use.',
  },
  {
    id: 3,
    category: 'Orders',
    question: 'How can I place an order?',
    answer: 'Select your favourite bag and follow the ordering instructions provided on our website.',
  },
  {
    id: 4,
    category: 'Products',
    question: 'Do you offer different colours?',
    answer: 'Yes, selected designs are available in different colours, depending on stock.',
  },
  {
    id: 5,
    category: 'Pricing',
    question: 'How can I know the price of a bag?',
    answer: 'The current price is displayed on each product page.',
  },
  {
    id: 6,
    category: 'Shipping',
    question: 'Do you offer delivery across Pakistan?',
    answer: 'Yes, Zuhana offers delivery across Pakistan. Delivery charges may vary depending on your location.',
  },
  {
    id: 7,
    category: 'Shipping',
    question: 'How long does delivery take?',
    answer: 'Delivery usually takes a few working days, depending on your location and courier service.',
  },
  {
    id: 8,
    category: 'Returns',
    question: 'Can I return a bag if I receive a damaged item?',
    answer: 'Yes. Returns are accepted only if the bag is received damaged. Please contact us promptly after receiving your order with clear pictures of the damaged item.',
  },
  {
    id: 9,
    category: 'Products',
    question: 'Can the colour of the bag look slightly different from the picture?',
    answer: 'Yes. The actual colour may appear slightly different due to lighting, photography, and different screen settings.',
  },
  {
    id: 10,
    category: 'Products',
    question: 'Are Zuhana bags suitable for everyday use?',
    answer: 'Yes. Our collection includes stylish and practical designs suitable for everyday use, outings, work, and special occasions.',
  },
]

function FAQs() {
  const [openIds, setOpenIds] = useState([1]) // First item opened by default

  function toggleFaq(id) {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="faqs-page">
      <div className="faqs-header">
        <div className="container">
          <span className="section-tag">HELP & SUPPORT</span>
          <h1 className="page-title">Frequently Asked Questions</h1>
          <p className="page-subtitle">
            Find answers to common questions about our bags, ordering, shipping, and policies.
          </p>
        </div>
      </div>

      <section className="section faqs-content-section">
        <div className="container faqs-container">
          <div className="faqs-accordion">
            {FAQS_DATA.map((faq, index) => {
              const isOpen = openIds.includes(faq.id)
              return (
                <div
                  key={faq.id}
                  className={`faq-item ${isOpen ? 'open' : ''}`}
                >
                  <button
                    className="faq-question-btn"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="faq-question-left">
                      <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="faq-question-text">{faq.question}</span>
                    </div>
                    <span className="faq-toggle-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Quick Help Card */}
          <div className="faqs-cta-card">
            <div className="faqs-cta-content">
              <h3>Still have questions?</h3>
              <p>We are here to help you anytime. Reach out to our customer support team.</p>
            </div>
            <div className="faqs-cta-actions">
              <Link to="/contact" className="btn-secondary">
                Contact Us
              </Link>
              <a
                href={`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello ZUHANA, I have a question about your products.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FAQs
