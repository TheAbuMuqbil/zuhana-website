import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import WishlistDrawer from './components/WishlistDrawer'
import Toast from './components/Toast'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import FAQs from './pages/FAQs'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
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
          <CartDrawer />
          <WishlistDrawer />
          <Toast />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
