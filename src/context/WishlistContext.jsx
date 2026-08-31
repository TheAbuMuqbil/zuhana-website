import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

const STORAGE_KEY = 'zuhana_wishlist_items_v1'

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [isWishlistOpen, setIsWishlistOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems))
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e)
    }
  }, [wishlistItems])

  function isInWishlist(productId) {
    if (!productId) return false
    return wishlistItems.some(item => item.id === productId)
  }

  function toggleWishlist(product) {
    if (!product || !product.id) return

    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id)
      if (exists) {
        return prev.filter(item => item.id !== product.id)
      } else {
        const itemToAdd = {
          id: product.id,
          name: product.name || 'Zuhana Bag',
          price: Number(product.price) || 0,
          original_price: product.original_price ? Number(product.original_price) : null,
          image_url: product.image_url || product.image || '',
          in_stock: product.in_stock ?? true,
          is_sale: product.is_sale ?? false,
          category: product.category || 'Handbag',
        }
        return [...prev, itemToAdd]
      }
    })
  }

  function removeFromWishlist(productId) {
    setWishlistItems(prev => prev.filter(item => item.id !== productId))
  }

  function openWishlist() {
    setIsWishlistOpen(true)
  }

  function closeWishlist() {
    setIsWishlistOpen(false)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        openWishlist,
        closeWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
