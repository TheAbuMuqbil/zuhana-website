import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

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
  // Track if we pushed a history entry for the wishlist drawer
  const historyPushedRef = useRef(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems))
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e)
    }
  }, [wishlistItems])

  // Handle Android back button (popstate) to close the wishlist
  useEffect(() => {
    function handlePopState(e) {
      if (isWishlistOpen) {
        e.preventDefault()
        historyPushedRef.current = false
        setIsWishlistOpen(false)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isWishlistOpen])

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

  const openWishlist = useCallback(() => {
    // Push a history entry so Android back button can close the drawer
    if (!historyPushedRef.current) {
      window.history.pushState({ drawer: 'wishlist' }, '')
      historyPushedRef.current = true
    }
    setIsWishlistOpen(true)
  }, [])

  const closeWishlist = useCallback(() => {
    // Pop the history entry we pushed (so back doesn't double-fire)
    if (historyPushedRef.current) {
      historyPushedRef.current = false
      window.history.back()
    }
    setIsWishlistOpen(false)
  }, [])

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
