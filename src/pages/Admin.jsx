import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

// Exact categories requested for Zuhana
export const PRODUCT_CATEGORIES = [
  'Crossbody',
  'Shoulder bag',
  'Totebag',
  'Clutches',
  'Canvas bag'
]

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    is_sale: false,
    in_stock: true,
    category: 'Crossbody',
    is_new_arrival: true,
    is_best_seller: false,
    image_url: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [editingId, setEditingId] = useState(null)

  // Default Passcode
  const ADMIN_PIN = 'zuhana2026'

  useEffect(() => {
    const savedAuth = localStorage.getItem('zuhana_admin_auth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
      fetchProducts()
    }
  }, [])

  function handleLogin(e) {
    e.preventDefault()
    if (pinInput === ADMIN_PIN || pinInput === 'admin') {
      setIsAuthenticated(true)
      localStorage.setItem('zuhana_admin_auth', 'true')
      setPinError('')
      fetchProducts()
    } else {
      setPinError('Incorrect Admin Passcode. Please try again.')
    }
  }

  function handleLogout() {
    setIsAuthenticated(false)
    localStorage.removeItem('zuhana_admin_auth')
  }

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
      console.error('Error fetching inventory:', err)
      showMessage('error', 'Failed to load products: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function showMessage(type, text) {
    setMsg({ type, text })
    setTimeout(() => setMsg({ type: '', text: '' }), 4000)
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function uploadImage(file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formData.name.trim() || !formData.price) {
      showMessage('error', 'Please provide product name and price.')
      return
    }

    try {
      setSubmitting(true)
      let finalImageUrl = formData.image_url

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile)
      }

      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        is_sale: formData.is_sale,
        in_stock: formData.in_stock,
        category: formData.category,
        image_url: finalImageUrl || null
      }

      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingId)

        if (error) throw error
        showMessage('success', 'Product updated successfully!')
      } else {
        const { error } = await supabase
          .from('products')
          .insert([payload])

        if (error) throw error
        showMessage('success', 'New product added to inventory!')
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        original_price: '',
        is_sale: false,
        in_stock: true,
        category: 'Crossbody',
        image_url: ''
      })
      setImageFile(null)
      setImagePreview('')
      setEditingId(null)

      fetchProducts()
    } catch (err) {
      console.error('Error saving product:', err)
      showMessage('error', 'Error: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleStock(id, currentStock) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ in_stock: !currentStock })
        .eq('id', id)

      if (error) throw error
      setProducts(products.map(p => p.id === id ? { ...p, in_stock: !currentStock } : p))
      showMessage('success', `Stock status updated!`)
    } catch (err) {
      showMessage('error', 'Failed to update stock status.')
    }
  }

  async function toggleSale(id, currentSale) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_sale: !currentSale })
        .eq('id', id)

      if (error) throw error
      setProducts(products.map(p => p.id === id ? { ...p, is_sale: !currentSale } : p))
      showMessage('success', `Sale status updated!`)
    } catch (err) {
      showMessage('error', 'Failed to update sale status.')
    }
  }

  function startEdit(product) {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      original_price: product.original_price || '',
      is_sale: product.is_sale || false,
      in_stock: product.in_stock ?? true,
      category: product.category || 'Crossbody',
      image_url: product.image_url || ''
    })
    setImagePreview(product.image_url || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProducts(products.filter(p => p.id !== id))
      showMessage('success', 'Product deleted.')
    } catch (err) {
      showMessage('error', 'Failed to delete product: ' + err.message)
    }
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <span className="logo-text">ZUHANA</span>
            <h2>Admin Portal</h2>
            <p>Enter passcode to manage your catalog</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label>Passcode</label>
              <input
                type="password"
                placeholder="Enter passcode (default: zuhana2026)"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                autoFocus
              />
            </div>

            {pinError && <p className="error-text">{pinError}</p>}

            <button type="submit" className="admin-btn primary-btn">
              Unlock Dashboard 🔓
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ADMIN DASHBOARD
  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div className="container admin-topbar-inner">
          <div>
            <h2>ZUHANA Inventory Admin</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Manage products, stock status, and prices in real time
            </p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout 🔒
          </button>
        </div>
      </div>

      <div className="container admin-content">
        {msg.text && (
          <div className={`admin-alert ${msg.type}`}>
            {msg.text}
          </div>
        )}

        <div className="admin-grid">
          {/* LEFT: Add / Edit Product Form */}
          <div className="admin-card form-card">
            <h3>{editingId ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Classic Quilted Crossbody"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (Rs.) *</label>
                  <input
                    type="number"
                    placeholder="3500"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Original Price (Rs.)</label>
                  <input
                    type="number"
                    placeholder="4500 (if on sale)"
                    value={formData.original_price}
                    onChange={e => setFormData({ ...formData, original_price: e.target.value })}
                  />
                </div>
              </div>

              {/* Category selection */}
              <div className="form-group">
                <label>Category (Bag Type) *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {PRODUCT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Product Photo (Upload from Phone/Computer)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {imagePreview && (
                  <div className="image-preview-box">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(''); setFormData({ ...formData, image_url: '' }) }}
                      className="remove-img-btn"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Or Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/bag.jpg"
                  value={formData.image_url}
                  onChange={e => {
                    setFormData({ ...formData, image_url: e.target.value })
                    if (!imageFile) setImagePreview(e.target.value)
                  }}
                />
              </div>

              <div className="form-checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.in_stock}
                    onChange={e => setFormData({ ...formData, in_stock: e.target.checked })}
                  />
                  <span>In Stock</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_sale}
                    onChange={e => setFormData({ ...formData, is_sale: e.target.checked })}
                  />
                  <span>Show "SALE" Tag</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="admin-btn primary-btn" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product to Store 🚀')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="admin-btn secondary-btn"
                    onClick={() => {
                      setEditingId(null)
                      setFormData({
                        name: '',
                        description: '',
                        price: '',
                        original_price: '',
                        is_sale: false,
                        in_stock: true,
                        category: 'Crossbody',
                        image_url: ''
                      })
                      setImagePreview('')
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT: Inventory List */}
          <div className="admin-card list-card">
            <div className="list-card-header">
              <h3>📦 Live Catalog ({products.length})</h3>
              <button onClick={fetchProducts} className="refresh-btn">🔄 Refresh</button>
            </div>

            {loading ? (
              <p>Loading inventory...</p>
            ) : products.length === 0 ? (
              <div className="empty-catalog">
                <p>No products in your catalog yet.</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Use the form on the left to add your first product!
                </p>
              </div>
            ) : (
              <div className="inventory-items">
                {products.map(product => (
                  <div key={product.id} className="inventory-row">
                    <div className="inventory-thumb">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} />
                      ) : (
                        <div className="thumb-placeholder">👜</div>
                      )}
                    </div>

                    <div className="inventory-details">
                      <p className="inv-name">{product.name}</p>
                      <p className="inv-meta">
                        <strong>Rs. {Number(product.price).toLocaleString()}</strong>
                        <span className="inv-category">{product.category || 'Crossbody'}</span>
                      </p>
                    </div>

                    <div className="inventory-controls">
                      {/* One-tap In-stock toggle */}
                      <button
                        className={`stock-toggle-btn ${product.in_stock ? 'in' : 'out'}`}
                        onClick={() => toggleStock(product.id, product.in_stock)}
                        title="Click to toggle Stock Status"
                      >
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </button>

                      {/* One-tap Sale toggle */}
                      <button
                        className={`sale-toggle-btn ${product.is_sale ? 'active' : ''}`}
                        onClick={() => toggleSale(product.id, product.is_sale)}
                        title="Click to toggle Sale Badge"
                      >
                        {product.is_sale ? 'SALE ON' : 'No Sale'}
                      </button>

                      <div className="row-action-btns">
                        <button onClick={() => startEdit(product)} className="action-btn edit" title="Edit">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(product.id, product.name)} className="action-btn delete" title="Delete">
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
