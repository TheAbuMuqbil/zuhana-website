import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

const STORAGE_KEY = 'zuhana_cart_items_v1'

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e)
    }
  }, [cartItems])

  function showToast(msg) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev))
    }, 2800)
  }

  function addToCart(product, quantity = 1) {
    if (!product || !product.id) return

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity, selected: true }
            : item
        )
      } else {
        const newItem = {
          id: product.id,
          name: product.name || 'Zuhana Bag',
          price: Number(product.price) || 0,
          original_price: product.original_price ? Number(product.original_price) : null,
          image_url: product.image_url || product.image || '',
          quantity: quantity,
          selected: true, // Selected by default
        }
        return [...prev, newItem]
      }
    })

    showToast(`Added "${product.name || 'Item'}" to your cart! 🛍️`)
  }

  function removeFromCart(productId) {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  function toggleItemSelection(productId) {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, selected: !item.selected } : item
      )
    )
  }

  function selectAll(isSelected) {
    setCartItems(prev =>
      prev.map(item => ({ ...item, selected: isSelected }))
    )
  }

  function clearCart() {
    setCartItems([])
  }

  function openCart() {
    setIsCartOpen(true)
  }

  function closeCart() {
    setIsCartOpen(false)
  }

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const selectedItems = cartItems.filter(item => item.selected)
  const selectedCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0)
  const selectedSubtotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const isAllSelected = cartItems.length > 0 && cartItems.every(item => item.selected)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleItemSelection,
        selectAll,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        totalItemCount,
        selectedItems,
        selectedCount,
        selectedSubtotal,
        isAllSelected,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
