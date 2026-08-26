import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { supabase } from '../supabaseClient'

function Home() {
  const [newArrivals, setNewArrivals] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        // Filter into New Arrivals and Best Sellers categories
        const newArr = data.filter(p => p.category === 'New Arrivals' || !p.category)
        const bestSell = data.filter(p => p.category === 'Best Sellers')

        setNewArrivals(newArr.length > 0 ? newArr.slice(0, 4) : data.slice(0, 4))
        setBestSellers(bestSell.length > 0 ? bestSell.slice(0, 4) : data.slice(0, 4))
      } else {
        setNewArrivals([])
        setBestSellers([])
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Placeholder reviews
  const placeholderReviews = [
    {
      id: 1,
      reviewer: 'Ayesha K.',
      rating: 5,
      comment: 'The quality and finishing of the bag exceeded my expectations. Elegant, spacious and durable!',
      verified: true,
    },
    {
      id: 2,
      reviewer: 'Fatima N.',
      rating: 5,
      comment: 'Super fast delivery and the packaging was lovely. Exactly as shown in the pictures.',
      verified: true,
    },
    {
      id: 3,
      reviewer: 'Zainab M.',
      rating: 5,
      comment: 'Very lightweight yet spacious. Perfect for daily use and special occasions!',
      verified: true,
    },
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="container hero-content">
            <h1 className="hero-title">
              Carry Confidence.<br />
              Carry <strong>ZUHANA.</strong>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: '12px', fontSize: '16px' }}>
              Explore luxury handcrafted bags designed for everyday elegance.
            </p>
            <div style={{ marginTop: '24px' }}>
              <Link to="/shop" style={{
                background: 'var(--white)',
                color: 'var(--primary-dark)',
                padding: '12px 28px',
                borderRadius: '30px',
                fontWeight: '600',
                fontSize: '14px',
                display: 'inline-block',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}>
                Shop Collection →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/shop" className="view-all-link">View All</Link>
          </div>

          {loading ? (
            <div className="loading-state">Loading products...</div>
          ) : newArrivals.length > 0 ? (
            <div className="product-grid">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No products added yet.</p>
              <Link to="/admin" className="admin-quick-link">Go to Admin to upload products →</Link>
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Best Sellers</h2>
            <Link to="/shop" className="view-all-link">View All</Link>
          </div>

          {loading ? (
            <div className="loading-state">Loading products...</div>
          ) : bestSellers.length > 0 ? (
            <div className="product-grid">
              {bestSellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No best sellers added yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="section reviews-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Customer Reviews</h2>
          </div>
          <div className="reviews-grid">
            {placeholderReviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-stars">
                  {'★'.repeat(review.rating)}
                </div>
                <p className="review-text-placeholder">"{review.comment}"</p>
                <div className="review-footer">
                  <span className="reviewer-name">{review.reviewer}</span>
                  {review.verified && <span className="review-badge">✓ Verified Buyer</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
