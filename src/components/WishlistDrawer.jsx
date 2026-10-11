import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

function WishlistDrawer() {
  const { wishlistItems, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlist()
  const { addToCart, openCart } = useCart()

  if (!isWishlistOpen) return null

  function handleMoveToCart(product) {
    addToCart(product, 1)
    removeFromWishlist(product.id)
    // Close wishlist and open cart — closeWishlist handles history cleanup
    closeWishlist()
    // Use a small delay so the history entry from closeWishlist settles
    setTimeout(() => openCart(), 50)
  }

  return (
    <div className="drawer-overlay" onClick={closeWishlist}>
      <div className="drawer-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-header-title">
            <svg viewBox="0 0 24 24" fill="#E53E3E" stroke="#E53E3E" strokeWidth="1.8" className="drawer-icon">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2>My Favourites</h2>
            <span className="drawer-badge">{wishlistItems.length}</span>
          </div>
          <button className="drawer-close-btn" onClick={closeWishlist} aria-label="Close wishlist">
            ✕
          </button>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="drawer-body">
            <div className="wishlist-items-list">
              {wishlistItems.map(item => (
                <div key={item.id} className="wishlist-item-card">
                  <div className="wishlist-item-image">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} />
                    ) : (
                      <div className="wishlist-item-no-image">👜</div>
                    )}
                  </div>

                  <div className="wishlist-item-info">
                    <div className="wishlist-item-top">
                      <h4 className="wishlist-item-title">{item.name}</h4>
                      <button
                        className="item-remove-btn"
                        onClick={() => removeFromWishlist(item.id)}
                        aria-label="Remove from favourites"
                        title="Remove"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>

                    <p className="wishlist-item-price">Rs. {Number(item.price).toLocaleString()}</p>

                    <div className="wishlist-item-actions">
                      <button
                        className="move-to-cart-btn"
                        onClick={() => handleMoveToCart(item)}
                      >
                        Add to Bag 🛍️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="drawer-empty-state">
            <div className="empty-cart-icon">❤️</div>
            <h3>No Favourites Saved Yet</h3>
            <p>Tap the heart icon on any bag you love to save it here for later.</p>
            <button className="explore-btn" onClick={closeWishlist}>
              Explore Collection
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistDrawer
