import { useCart } from '../context/CartContext'

function Toast() {
  const { toastMessage, openCart } = useCart()

  if (!toastMessage) return null

  return (
    <div className="toast-notification" onClick={openCart} role="status">
      <div className="toast-content">
        <span className="toast-text">{toastMessage}</span>
        <button className="toast-action-btn">View Bag →</button>
      </div>
    </div>
  )
}

export default Toast
