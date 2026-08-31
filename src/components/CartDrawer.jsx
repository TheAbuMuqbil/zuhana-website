import { useCart } from '../context/CartContext'
import { STORE_CONFIG } from '../config'

function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    selectAll,
    selectedItems,
    selectedCount,
    selectedSubtotal,
    isAllSelected,
    clearCart,
  } = useCart()

  if (!isCartOpen) return null

  const isFreeShipping = selectedSubtotal >= STORE_CONFIG.freeShippingThreshold
  const shippingFee = selectedSubtotal > 0 && !isFreeShipping ? STORE_CONFIG.standardShippingFee : 0
  const totalBill = selectedSubtotal + shippingFee
  const amountToFreeShipping = Math.max(0, STORE_CONFIG.freeShippingThreshold - selectedSubtotal)

  function handleCheckoutWhatsApp() {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to checkout!')
      return
    }

    // Build automated WhatsApp message
    let message = `👜 *NEW ORDER REQUEST - ${STORE_CONFIG.storeName}*\n`
    message += `──────────────────────\n`
    message += `*Selected Items (${selectedCount} pcs):*\n\n`

    selectedItems.forEach((item, index) => {
      const itemSubtotal = (item.price * item.quantity).toLocaleString()
      message += `${index + 1}. *${item.name}*\n`
      message += `   • Quantity: ${item.quantity}\n`
      message += `   • Price: Rs. ${item.price.toLocaleString()} each\n`
      message += `   • Subtotal: Rs. ${itemSubtotal}\n\n`
    })

    message += `──────────────────────\n`
    message += `*Items Subtotal:* Rs. ${selectedSubtotal.toLocaleString()}\n`
    if (isFreeShipping) {
      message += `*Shipping Fee:* FREE (Orders above Rs. ${STORE_CONFIG.freeShippingThreshold.toLocaleString()}) 🎉\n`
    } else {
      message += `*Shipping Fee:* Rs. ${shippingFee.toLocaleString()}\n`
    }
    message += `*TOTAL BILL:* Rs. ${totalBill.toLocaleString()}\n`
    message += `──────────────────────\n`
    message += `*Customer Details:*\n`
    message += `• Full Name:\n`
    message += `• Phone Number:\n`
    message += `• Delivery Address:\n`
    message += `• City:\n\n`
    message += `Please confirm my order!`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="drawer-overlay" onClick={closeCart}>
      <div className="drawer-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="drawer-icon">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2>Shopping Bag</h2>
            <span className="drawer-badge">{cartItems.length}</span>
          </div>
          <button className="drawer-close-btn" onClick={closeCart} aria-label="Close cart">
            ✕
          </button>
        </div>

        {cartItems.length > 0 ? (
          <>
            {/* Free Shipping Progress */}
            <div className="free-shipping-banner">
              {isFreeShipping ? (
                <p className="free-shipping-text unlocked">
                  🎉 You unlocked <strong>FREE Delivery</strong> on selected items!
                </p>
              ) : (
                <p className="free-shipping-text">
                  Add <strong>Rs. {amountToFreeShipping.toLocaleString()}</strong> more to unlock <strong>FREE Delivery</strong>!
                </p>
              )}
              <div className="free-shipping-bar">
                <div
                  className="free-shipping-fill"
                  style={{
                    width: `${Math.min(100, (selectedSubtotal / STORE_CONFIG.freeShippingThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Selection Toolbar */}
            <div className="selection-toolbar">
              <label className="select-all-label">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={e => selectAll(e.target.checked)}
                />
                <span>Select All ({cartItems.length} items)</span>
              </label>

              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Bag
              </button>
            </div>

            {/* Cart Items List */}
            <div className="drawer-body">
              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div
                    key={item.id}
                    className={`cart-item-card ${item.selected ? 'selected' : ''}`}
                  >
                    {/* Item Checkbox */}
                    <div className="item-checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={Boolean(item.selected)}
                        onChange={() => toggleItemSelection(item.id)}
                        id={`cart-item-${item.id}`}
                        aria-label={`Select ${item.name}`}
                      />
                    </div>

                    {/* Thumbnail */}
                    <div className="cart-item-image">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} />
                      ) : (
                        <div className="cart-item-no-image">👜</div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="cart-item-info">
                      <div className="cart-item-top">
                        <h4 className="cart-item-title">{item.name}</h4>
                        <button
                          className="item-remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>

                      <div className="cart-item-price-line">
                        <span className="cart-item-unit-price">
                          Rs. {item.price.toLocaleString()}
                        </span>
                        {item.quantity > 1 && (
                          <span className="cart-item-subtotal">
                            (Subtotal: Rs. {(item.price * item.quantity).toLocaleString()})
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="cart-item-quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer / Summary / Checkout */}
            <div className="drawer-footer">
              <div className="cart-summary-lines">
                <div className="summary-line">
                  <span>Selected Items ({selectedCount}):</span>
                  <span>Rs. {selectedSubtotal.toLocaleString()}</span>
                </div>
                <div className="summary-line">
                  <span>Estimated Shipping:</span>
                  <span>
                    {selectedSubtotal === 0
                      ? 'Rs. 0'
                      : isFreeShipping
                      ? 'FREE'
                      : `Rs. ${shippingFee}`}
                  </span>
                </div>
                <div className="summary-line total-line">
                  <span>Total Bill:</span>
                  <span className="total-amount">Rs. {totalBill.toLocaleString()}</span>
                </div>
              </div>

              <button
                className="whatsapp-checkout-btn"
                onClick={handleCheckoutWhatsApp}
                disabled={selectedItems.length === 0}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="wa-icon">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.969.54 1.761.815 2.796.815 3.183 0 5.769-2.587 5.77-5.767 0-3.181-2.588-5.8-5.77-5.8zm3.376 8.21c-.14.394-.712.723-1.026.772-.314.048-.707.086-2.146-.51-1.841-.763-3.023-2.639-3.115-2.761-.093-.122-.743-.989-.743-1.887 0-.898.471-1.34.639-1.523.168-.183.367-.229.49-.229.122 0 .245.002.352.007.113.006.264-.043.413.315.153.367.52 1.268.566 1.36.046.091.077.198.016.32-.061.122-.092.198-.184.305-.092.107-.193.239-.276.321-.092.091-.188.191-.081.374.107.183.477.786 1.023 1.272.703.626 1.296.82 1.48.912.183.092.29.076.397-.046.107-.122.458-.534.58-.717.122-.183.245-.153.413-.092.168.061 1.069.504 1.253.595.183.092.306.137.351.214.046.076.046.443-.094.837z" />
                </svg>
                <span>
                  {selectedItems.length === 0
                    ? 'Select items to checkout'
                    : `Checkout via WhatsApp (${selectedCount})`}
                </span>
              </button>

              <p className="checkout-note">
                🔒 Safe & secure order directly with our WhatsApp support team.
              </p>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="drawer-empty-state">
            <div className="empty-cart-icon">👜</div>
            <h3>Your Bag is Empty</h3>
            <p>Looks like you haven&apos;t added any items to your shopping bag yet.</p>
            <button className="explore-btn" onClick={closeCart}>
              Explore Collection
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartDrawer
