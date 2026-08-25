function ProductCard({ product }) {
  const productName = product?.name || 'this product'
  const productPrice = product?.price || 'N/A'
  const whatsappMessage = encodeURIComponent(
    "Hi! I'm interested in " + productName + ". Price: Rs. " + productPrice
  )
  const whatsappUrl = "https://wa.me/923000000000?text=" + whatsappMessage
  const stockClass = "stock-status " + (product?.inStock ? "in-stock" : "out-of-stock")

  return (
    <div className="product-card">
      <div className="product-image">
        {product?.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="image-placeholder">Image</div>
        )}
        {product?.sale && <span className="sale-badge">SALE</span>}
      </div>
      <div className="product-info">
        <p className="product-name">{product?.name || 'Product description'}</p>
        <p className="product-price">Rs. {product?.price || '0'}</p>
        <div className="product-actions">
          <button className="icon-btn wishlist-btn" aria-label="Add to wishlist">&#9825;</button>
          <button className="add-to-cart-btn">Add to cart</button>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          Order via WhatsApp
        </a>
        <p className={stockClass}>
          {product?.inStock ? 'In Stock' : 'Out of Stock'}
        </p>
      </div>
    </div>
  )
}

export default ProductCard
