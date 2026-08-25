import ProductCard from '../components/ProductCard'

// Placeholder products — will be replaced with database data later
const placeholderProducts = [
  { id: 1, name: 'Product description', price: '2,500', inStock: true, image: null },
  { id: 2, name: 'Product description', price: '3,200', inStock: true, image: null },
  { id: 3, name: 'Product description', price: '1,800', inStock: true, sale: true, image: null },
  { id: 4, name: 'Product description', price: '4,500', inStock: false, image: null },
]

function Home() {
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
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <a href="/shop" className="view-all-link">View All</a>
          </div>
          <div className="product-grid">
            {placeholderProducts.slice(0, 2).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Best Sellers</h2>
            <a href="/shop" className="view-all-link">View All</a>
          </div>
          <div className="product-grid">
            {placeholderProducts.slice(2, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
