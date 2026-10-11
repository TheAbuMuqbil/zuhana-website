import { useEffect, useState, useMemo, useRef } from 'react'
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

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Alphabetical (A - Z)' },
  { value: 'name_desc', label: 'Alphabetical (Z - A)' },
]

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || 'All'

  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl)
  
  // Filter States
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [tempMin, setTempMin] = useState('')
  const [tempMax, setTempMax] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [onSaleOnly, setOnSaleOnly] = useState(false)
  
  // Sort State
  const [sortBy, setSortBy] = useState('newest')
  
  // Dropdown UI States
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const filterRef = useRef(null)
  const sortRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterMenuOpen(false)
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  function handleApplyPriceFilter() {
    setMinPrice(tempMin)
    setMaxPrice(tempMax)
    setFilterMenuOpen(false)
  }

  function handlePricePreset(minVal, maxVal) {
    setTempMin(minVal ? String(minVal) : '')
    setTempMax(maxVal ? String(maxVal) : '')
    setMinPrice(minVal ? String(minVal) : '')
    setMaxPrice(maxVal ? String(maxVal) : '')
  }

  function handleResetFilters() {
    setMinPrice('')
    setMaxPrice('')
    setTempMin('')
    setTempMax('')
    setInStockOnly(false)
    setOnSaleOnly(false)
    setFilterMenuOpen(false)
  }

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (minPrice !== '') count++
    if (maxPrice !== '') count++
    if (inStockOnly) count++
    if (onSaleOnly) count++
    return count
  }, [minPrice, maxPrice, inStockOnly, onSaleOnly])

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

    // 2. Price Filter (Min & Max)
    if (minPrice !== '') {
      const min = Number(minPrice)
      if (!isNaN(min)) {
        result = result.filter(p => Number(p.price) >= min)
      }
    }
    if (maxPrice !== '') {
      const max = Number(maxPrice)
      if (!isNaN(max)) {
        result = result.filter(p => Number(p.price) <= max)
      }
    }

    // 3. Availability & Offers Filter
    if (inStockOnly) {
      result = result.filter(p => (p.in_stock ?? true))
    }
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
    } else if (sortBy === 'name_desc') {
      result.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
    } else {
      // Default: newest by created_at or id
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    }

    return result
  }, [products, activeCategory, minPrice, maxPrice, inStockOnly, onSaleOnly, sortBy])

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Newest Arrivals'

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
            {/* Left: Filter Dropdown Trigger */}
            <div className="dropdown-wrapper" ref={filterRef}>
              <button
                className={`dropdown-trigger-btn ${filterMenuOpen || activeFilterCount > 0 ? 'active' : ''}`}
                onClick={() => {
                  setFilterMenuOpen(!filterMenuOpen)
                  setSortMenuOpen(false)
                }}
                aria-expanded={filterMenuOpen}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="control-icon">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="filter-count-badge">{activeFilterCount}</span>
                )}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron-icon ${filterMenuOpen ? 'open' : ''}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Animated Filter Dropdown Modal/Card */}
              {filterMenuOpen && (
                <div className="dropdown-panel filter-panel">
                  <div className="filter-panel-header">
                    <h4>Filters</h4>
                    {activeFilterCount > 0 && (
                      <button className="panel-reset-btn" onClick={handleResetFilters}>
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Price Range Section */}
                  <div className="filter-section">
                    <label className="filter-section-title">Price Range (Rs.)</label>
                    <div className="price-inputs-row">
                      <div className="price-input-group">
                        <span className="currency-prefix">Rs.</span>
                        <input
                          type="number"
                          placeholder="Min"
                          value={tempMin}
                          onChange={e => setTempMin(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleApplyPriceFilter()}
                        />
                      </div>
                      <span className="price-separator">to</span>
                      <div className="price-input-group">
                        <span className="currency-prefix">Rs.</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={tempMax}
                          onChange={e => setTempMax(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleApplyPriceFilter()}
                        />
                      </div>
                    </div>

                    {/* Quick Price Presets */}
                    <div className="price-presets-row">
                      <button
                        className={`preset-btn ${minPrice === '' && maxPrice === '3000' ? 'active' : ''}`}
                        onClick={() => handlePricePreset('', 3000)}
                      >
                        Under 3,000
                      </button>
                      <button
                        className={`preset-btn ${minPrice === '3000' && maxPrice === '5000' ? 'active' : ''}`}
                        onClick={() => handlePricePreset(3000, 5000)}
                      >
                        3,000 - 5,000
                      </button>
                      <button
                        className={`preset-btn ${minPrice === '5000' && maxPrice === '' ? 'active' : ''}`}
                        onClick={() => handlePricePreset(5000, '')}
                      >
                        5,000+
                      </button>
                    </div>
                  </div>

                  {/* Availability & Offers */}
                  <div className="filter-section">
                    <label className="filter-section-title">Availability & Offers</label>
                    <div className="checkbox-filter-list">
                      <label className="filter-checkbox-label">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={e => setInStockOnly(e.target.checked)}
                        />
                        <span>In Stock Only</span>
                      </label>
                      <label className="filter-checkbox-label">
                        <input
                          type="checkbox"
                          checked={onSaleOnly}
                          onChange={e => setOnSaleOnly(e.target.checked)}
                        />
                        <span>On Sale Only</span>
                      </label>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="filter-panel-footer">
                    <button className="apply-filter-btn" onClick={handleApplyPriceFilter}>
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sort Dropdown Trigger & Count */}
            <div className="shop-controls-right">
              <span className="products-count-text">
                {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'item' : 'items'}
              </span>

              <div className="dropdown-wrapper" ref={sortRef}>
                <button
                  className={`dropdown-trigger-btn sort-trigger ${sortMenuOpen ? 'active' : ''}`}
                  onClick={() => {
                    setSortMenuOpen(!sortMenuOpen)
                    setFilterMenuOpen(false)
                  }}
                  aria-expanded={sortMenuOpen}
                >
                  <span className="sort-label-dim">Sort by:</span>
                  <span className="sort-selected-value">{currentSortLabel}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron-icon ${sortMenuOpen ? 'open' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Animated Sort Dropdown Menu */}
                {sortMenuOpen && (
                  <div className="dropdown-panel sort-panel">
                    <div className="sort-options-list">
                      {SORT_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          className={`sort-option-item ${sortBy === option.value ? 'selected' : ''}`}
                          onClick={() => {
                            setSortBy(option.value)
                            setSortMenuOpen(false)
                          }}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {(filterMenuOpen || sortMenuOpen) && (
              <div
                className="mobile-dropdown-backdrop"
                onClick={() => {
                  setFilterMenuOpen(false)
                  setSortMenuOpen(false)
                }}
                aria-hidden="true"
              />
            )}
          </div>

          {/* Active Filter Badges Bar */}
          {activeFilterCount > 0 && (
            <div className="active-filters-chips-bar">
              <span className="active-filters-label">Active filters:</span>
              {minPrice !== '' && (
                <span className="filter-chip">
                  Min: Rs. {Number(minPrice).toLocaleString()}
                  <button onClick={() => { setMinPrice(''); setTempMin(''); }}>✕</button>
                </span>
              )}
              {maxPrice !== '' && (
                <span className="filter-chip">
                  Max: Rs. {Number(maxPrice).toLocaleString()}
                  <button onClick={() => { setMaxPrice(''); setTempMax(''); }}>✕</button>
                </span>
              )}
              {inStockOnly && (
                <span className="filter-chip">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>✕</button>
                </span>
              )}
              {onSaleOnly && (
                <span className="filter-chip">
                  On Sale Only
                  <button onClick={() => setOnSaleOnly(false)}>✕</button>
                </span>
              )}
              <button className="clear-all-chips-btn" onClick={handleResetFilters}>
                Clear All
              </button>
            </div>
          )}

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
              <p>No products found with the selected filters.</p>
              <button
                onClick={() => {
                  handleCategoryClick('All')
                  handleResetFilters()
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
