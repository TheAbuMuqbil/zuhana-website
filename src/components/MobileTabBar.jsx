import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

function MobileTabBar() {
  const location = useLocation()
  const { openCart, closeCart, isCartOpen, totalItemCount } = useCart()
  const { openWishlist, closeWishlist, isWishlistOpen, wishlistCount } = useWishlist()

  function handleOpenWishlist() {
    // Close cart first if it's open (mutual exclusion)
    if (isCartOpen) {
      closeCart()
    }
    openWishlist()
  }

  function handleOpenCart() {
    // Close wishlist first if it's open (mutual exclusion)
    if (isWishlistOpen) {
      closeWishlist()
    }
    openCart()
  }

  return (
    <nav className="mobile-tab-bar" aria-label="Mobile Navigation Bar">
      {/* Home */}
      <Link
        to="/"
        className={`tab-item ${location.pathname === '/' && !isCartOpen && !isWishlistOpen ? 'active' : ''}`}
        aria-label="Home"
      >
        <span className="tab-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-icon">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </span>
        <span className="tab-label">Home</span>
      </Link>

      {/* Shop */}
      <Link
        to="/shop"
        className={`tab-item ${location.pathname === '/shop' && !isCartOpen && !isWishlistOpen ? 'active' : ''}`}
        aria-label="Shop Collection"
      >
        <span className="tab-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-icon">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        </span>
        <span className="tab-label">Shop</span>
      </Link>

      {/* Favourites / Wishlist */}
      <button
        type="button"
        onClick={handleOpenWishlist}
        className={`tab-item tab-btn ${isWishlistOpen ? 'active' : ''}`}
        aria-label="Favourites"
      >
        <span className="tab-icon-wrapper">
          <svg
            viewBox="0 0 24 24"
            fill={wishlistCount > 0 ? '#E53E3E' : 'none'}
            stroke={wishlistCount > 0 ? '#E53E3E' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="tab-icon"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {wishlistCount > 0 && (
            <span className="tab-badge wishlist-tab-badge">{wishlistCount}</span>
          )}
        </span>
        <span className="tab-label">Saved</span>
      </button>

      {/* Shopping Bag / Cart */}
      <button
        type="button"
        onClick={handleOpenCart}
        className={`tab-item tab-btn ${isCartOpen ? 'active' : ''}`}
        aria-label="Shopping Bag"
      >
        <span className="tab-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-icon">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {totalItemCount > 0 && (
            <span className="tab-badge cart-tab-badge">{totalItemCount}</span>
          )}
        </span>
        <span className="tab-label">Bag</span>
      </button>

      {/* Support / Contact */}
      <Link
        to="/contact"
        className={`tab-item ${location.pathname === '/contact' && !isCartOpen && !isWishlistOpen ? 'active' : ''}`}
        aria-label="Contact & Support"
      >
        <span className="tab-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-icon">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </span>
        <span className="tab-label">Help</span>
      </Link>
    </nav>
  )
}

export default MobileTabBar
