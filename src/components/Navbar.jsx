import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import logoBlack from '../assets/logo-black.png'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { openCart, closeCart, isCartOpen, totalItemCount } = useCart()
  const { openWishlist, closeWishlist, isWishlistOpen, wishlistCount } = useWishlist()

  const links = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/faqs', label: 'FAQs' },
    { path: '/contact', label: 'Contact Us' },
  ]

  function handleOpenWishlist() {
    if (isCartOpen) closeCart()
    openWishlist()
  }

  function handleOpenCart() {
    if (isWishlistOpen) closeWishlist()
    openCart()
  }

  const hamburgerClass = "hamburger" + (menuOpen ? " active" : "")
  const navLinksClass = "nav-links" + (menuOpen ? " open" : "")

  return (
    <>
      <div className="announcement-bar">
        <span className="announcement-text">
          🚚 Free delivery on orders above 5000!
        </span>
      </div>
      <nav className="navbar">
        <div className="container navbar-inner">
          <div className="navbar-brand-group">
            <button
              className={hamburgerClass}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <Link to="/" className="logo">
              <img src={logoBlack} alt="ZUHANA Logo" className="logo-img" />
              <span className="logo-text">ZUHANA</span>
            </Link>
          </div>

          <div className={`nav-links-drawer ${menuOpen ? 'open' : ''}`}>
            <div className="drawer-nav-header">
              <div className="drawer-brand">
                <img src={logoBlack} alt="ZUHANA Logo" className="logo-img" />
                <span className="logo-text">ZUHANA</span>
              </div>
              <button
                className="drawer-nav-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <ul className="nav-links">
              {links.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={location.pathname === link.path ? 'active' : ''}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <span className="nav-arrow">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {menuOpen && (
            <div
              className="mobile-nav-backdrop"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
          )}

          <div className="nav-icons">
            {/* Wishlist Heart Icon */}
            <button
              className="icon-btn nav-action-btn"
              onClick={handleOpenWishlist}
              aria-label="View Favourites"
              title="Favourites"
            >
              <svg viewBox="0 0 24 24" fill={wishlistCount > 0 ? '#E53E3E' : 'none'} stroke={wishlistCount > 0 ? '#E53E3E' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="nav-badge wishlist-badge">{wishlistCount}</span>
              )}
            </button>

            {/* Fashion Shopping Bag Icon */}
            <button
              className="icon-btn nav-action-btn"
              onClick={handleOpenCart}
              aria-label="View Shopping Bag"
              title="Shopping Bag"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItemCount > 0 && (
                <span className="nav-badge cart-badge">{totalItemCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
