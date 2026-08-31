import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { STORE_CONFIG } from '../config'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  // Support both Supabase schema (image_url, is_sale, in_stock) and placeholder fallback
  const id = product?.id
  const name = product?.name || 'Zuhana Premium Bag'
  const price = product?.price != null ? Number(product.price).toLocaleString() : 'N/A'
  const originalPrice = product?.original_price != null ? Number(product.original_price).toLocaleString() : null
  const isSale = product?.is_sale ?? product?.sale ?? false
  const inStock = product?.in_stock ?? product?.inStock ?? true
  const imageUrl = product?.image_url || product?.image

  const isFavorited = isInWishlist(id)

  // Direct WhatsApp order link for single item
  const currentUrl = window.location.origin + '/shop'
  const whatsappMessage = encodeURIComponent(
    `Hello ${STORE_CONFIG.storeName}! 👜\n\nI want to order this item:\n*Product:* ${name}\n*Price:* Rs. ${price}\n*Stock:* ${inStock ? 'In Stock' : 'Out of Stock'}\n\nLink: ${currentUrl}`
  )
  const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${whatsappMessage}`

  return (
    <div className="product-card">
      <div className="product-image">
        {imageUrl ? (
          <img src={imageUrl} alt={name} loading="lazy" />
        ) : (
          <div className="image-placeholder">
            <span>👜</span>
            <p>No Photo</p>
          </div>
        )}
        {isSale && <span className="sale-badge">SALE</span>}
      </div>

      <div className="product-info">
        <p className="product-name">{name}</p>
        
        <div className="price-container">
          <p className="product-price">Rs. {price}</p>
          {isSale && originalPrice && (
            <span className="product-original-price">Rs. {originalPrice}</span>
          )}
        </div>

        <div className="product-actions">
          <button
            className={`icon-btn wishlist-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={() => toggleWishlist(product)}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
            title={isFavorited ? 'In Wishlist' : 'Add to Wishlist'}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isFavorited ? '#E53E3E' : 'none'}
              stroke={isFavorited ? '#E53E3E' : 'currentColor'}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: '18px', height: '18px' }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button
            className="add-to-cart-btn"
            disabled={!inStock}
            onClick={() => addToCart(product, 1)}
          >
            {inStock ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          <span>💬 Order via WhatsApp</span>
        </a>

        <p className={`stock-status ${inStock ? 'in-stock' : 'out-of-stock'}`}>
          {inStock ? '● In Stock' : '✕ Out of Stock'}
        </p>
      </div>
    </div>
  )
}

export default ProductCard
