import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { supabase } from '../supabaseClient'

export const SHOP_CATEGORIES = [
  'All',
  'Crossbody',
  'Shoulder bag',
  'Totebag',
  'Clutches',
  'Canvas bag',
  'On Sale',
  'In Stock'
]

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || 'All'

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Sync category if URL parameter changes
  useEffect(() => {
    if (searchParams.get('category')) {
      setActiveCategory(searchParams.get('category'))
    }
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, activeCategory, searchQuery])

  async function fetchProducts() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching shop products:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleCategoryClick(cat) {
    setActiveCategory(cat)
    if (cat === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ category: cat })
    }
  }

  function filterProducts() {
    let result = [...products]

    // Category filter matching exact bag types
    if (activeCategory === 'On Sale') {
      result = result.filter(p => p.is_sale)
    } else if (activeCategory === 'In Stock') {
      result = result.filter(p => p.in_stock)
    } else if (activeCategory !== 'All') {
      result = result.filter(p => 
        p.category?.toLowerCase() === activeCategory.toLowerCase()
      )
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
    }

    setFilteredProducts(result)
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="container">
          <h1 className="page-title">Shop Collection</h1>
          <p className="page-subtitle">Handcrafted bags & statement accessories</p>
          
          {/* Search bar */}
          <div className="shop-search-bar">
            <input
              type="text"
              placeholder="Search by name or bag style..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="filter-pills">
            {SHOP_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-pill ${activeCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-state">Loading collection...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No products found in <strong>{activeCategory}</strong>.</p>
              <button onClick={() => handleCategoryClick('All')} className="reset-btn">
                View All Products →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Shop
