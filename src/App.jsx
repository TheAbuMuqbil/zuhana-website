import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import WishlistDrawer from './components/WishlistDrawer'
import Toast from './components/Toast'
import MobileTabBar from './components/MobileTabBar'
import { CartProvider, useCart } from './context/CartContext'
import { WishlistProvider, useWishlist } from './context/WishlistContext'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import FAQs from './pages/FAQs'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

/* Inner component that can access both Cart and Wishlist contexts */
function AppShell() {
  const { isCartOpen } = useCart()
  const { isWishlistOpen } = useWishlist()

  // Lock body scroll when any drawer is open
  useEffect(() => {
    if (isCartOpen || isWishlistOpen) {
      document.body.classList.add('drawer-open')
    } else {
      document.body.classList.remove('drawer-open')
    }
    return () => document.body.classList.remove('drawer-open')
  }, [isCartOpen, isWishlistOpen])

  return (
    <>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      <Footer />
      <MobileTabBar />
      <CartDrawer />
      <WishlistDrawer />
      <Toast />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <AppShell />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
