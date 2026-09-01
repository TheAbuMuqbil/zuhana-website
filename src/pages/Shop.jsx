import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { supabase } from '../supabaseClient'

export const SHOP_CATEGORIES = [
  'All',
  'New Arrivals',
  'Best Sellers',
  'Crossbody',
  'Shoulder bag',
  'Totebag',
  'Clutches',
  'Canvas bag',
]

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || 'All'

  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [onSaleOnly, setOnSaleOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (searchParams.get('category')) {
      setActiveCategory(searchParams.get('category'))
    }
  }, [searchParams])

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

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // 1. Category Filter
    if (activeCategory === 'New Arrivals') {
      result = result.filter(p => p.category === 'New Arrivals' || !p.category)
    } else if (activeCategory === 'Best Sellers') {
      result = result.filter(p => p.category === 'Best Sellers')
    } else if (activeCategory !== 'All') {
      result = result.filter(p =>
        p.category?.toLowerCase() === activeCategory.toLowerCase()
      )
    }

    // 2. Secondary Filter: In Stock Only
    if (inStockOnly) {
      result = result.filter(p => (p.in_stock ?? true))
    }

    // 3. Secondary Filter: On Sale Only
    if (onSaleOnly) {
      result = result.filter(p => Boolean(p.is_sale))
    }

    // 4. Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else {
      // Default: newest by created_at or id
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    }

    return result
  }, [products, activeCategory, inStockOnly, onSaleOnly, sortBy])

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="container">
          <span className="section-tag">COLLECTION</span>
          <h1 className="page-title">Shop All Bags</h1>
          <p className="page-subtitle">Handcrafted bags designed for everyday elegance</p>

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
          {/* Filter & Sorting Controls Bar */}
          <div className="shop-controls-bar">
            {/* Quick Filter Toggles */}
            <div className="shop-filter-toggles">
              <button
                className={`filter-toggle-btn ${inStockOnly ? 'active' : ''}`}
                onClick={() => setInStockOnly(!inStockOnly)}
              >
                In Stock Only
              </button>
              <button
                className={`filter-toggle-btn ${onSaleOnly ? 'active' : ''}`}
                onClick={() => setOnSaleOnly(!onSaleOnly)}
              >
                On Sale Only
              </button>
              {(inStockOnly || onSaleOnly) && (
                <button
                  className="clear-filters-btn"
                  onClick={() => {
                    setInStockOnly(false)
                    setOnSaleOnly(false)
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Sort & Count */}
            <div className="shop-sort-wrapper">
              <span className="products-count-text">
                {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'item' : 'items'}
              </span>

              <div className="sort-dropdown-container">
                <label htmlFor="shop-sort-select" className="sort-label">Sort by:</label>
                <select
                  id="shop-sort-select"
                  className="shop-sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="loading-state">Loading collection...</div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="product-grid">
              {filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No products found in <strong>{activeCategory}</strong> with the selected filters.</p>
              <button
                onClick={() => {
                  handleCategoryClick('All')
                  setInStockOnly(false)
                  setOnSaleOnly(false)
                }}
                className="reset-btn"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Shop
