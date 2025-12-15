import { useState } from 'react'
import { FaPlus, FaUpload, FaTimes } from 'react-icons/fa'

const AddProductForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    offerPrice: '',
    offerPercentage: '',
    images: [],
    stock: ''
  })

  const [previewImages, setPreviewImages] = useState([])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({ ...prev, images: files }))
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file))
    setPreviewImages(previews)
  }

  const calculateOfferPrice = (price, percentage) => {
    if (!price || !percentage) return ''
    const discount = (price * percentage) / 100
    return (price - discount).toFixed(2)
  }

  const handlePriceChange = (e) => {
    const price = e.target.value
    setFormData(prev => {
      const newData = { ...prev, price }
      if (prev.offerPercentage) {
        newData.offerPrice = calculateOfferPrice(price, prev.offerPercentage)
      }
      return newData
    })
  }

  const handleOfferPercentageChange = (e) => {
    const percentage = e.target.value
    setFormData(prev => ({
      ...prev,
      offerPercentage: percentage,
      offerPrice: calculateOfferPrice(prev.price, percentage)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Cleanup preview URLs
    previewImages.forEach(URL.revokeObjectURL)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Add New Product</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter product name"
              />
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter detailed product description"
            ></textarea>
          </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Regular Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regular Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            {/* Offer Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                value={formData.offerPercentage}
                onChange={handleOfferPercentageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                step="0.1"
                placeholder="Enter discount percentage"
              />
            </div>

            {/* Final Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Price (₹)
              </label>
              <input
                type="number"
                value={formData.offerPrice}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
                placeholder="Calculated price after discount"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              placeholder="Enter available stock"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(preview)
                        setPreviewImages(prev => prev.filter((_, i) => i !== index))
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ProductDetailsModal = ({ product, onClose, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    onDelete(product.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Product Details</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(product)}
              className="p-2 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
              title="Edit product"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors"
              title="Delete product"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
              title="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Product Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.images.map((image, index) => (
              <div key={index} className="relative aspect-video">
                <img
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=Product+Image'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Product Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Basic Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-500">Product Name</label>
                  <p className="text-lg font-medium">{product.name}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Description</label>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Pricing Details</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-500">Regular Price</label>
                  <p className="text-lg font-medium">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
                {product.offerPercentage > 0 && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-500">Discount</label>
                      <p className="text-lg font-medium text-green-600">{product.offerPercentage}% OFF</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Final Price</label>
                      <p className="text-xl font-bold text-blue-600">₹{product.offerPrice.toLocaleString('en-IN')}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Inventory</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm text-gray-500">Available Stock</label>
                  <p className="text-lg font-medium">{product.stock} units</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 20 ? 'bg-green-100 text-green-800' : 
                  product.stock > 5 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 20 ? 'In Stock' : 
                   product.stock > 5 ? 'Low Stock' : 
                   'Critical Stock'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Delete Product</h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{product.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Ecommerce = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Health Monitor",
      description: "Advanced health monitoring device with heart rate, blood pressure, and SpO2 tracking capabilities. Perfect for daily health monitoring.",
      price: 12999.99,
      offerPrice: 11699.99,
      offerPercentage: 10,
      stock: 15,
      images: ["https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?w=500&auto=format"],
    },
    {
      id: 2,
      name: "Digital Thermometer",
      description: "High-precision digital thermometer with instant reading and fever alert system. Suitable for all age groups.",
      price: 1499.99,
      offerPrice: 1199.99,
      offerPercentage: 20,
      stock: 50,
      images: ["https://images.unsplash.com/photo-1623957191350-fc15258655dd?w=500&auto=format"],
    },
    {
      id: 3,
      name: "Smart Blood Pressure Monitor",
      description: "Wireless blood pressure monitor with smartphone connectivity. Track and analyze your readings over time with the companion app.",
      price: 4999.99,
      offerPrice: 4499.99,
      offerPercentage: 10,
      stock: 25,
      images: ["https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format"],
    },
    {
      id: 4,
      name: "Professional Stethoscope",
      description: "High-quality acoustic stethoscope with dual-head chest piece. Perfect for medical professionals and home health monitoring.",
      price: 2999.99,
      offerPrice: 2399.99,
      offerPercentage: 20,
      stock: 30,
      images: ["https://images.unsplash.com/photo-1505751171710-1f6d0e5a1a01?w=500&auto=format"],
    },
    {
      id: 5,
      name: "Pulse Oximeter",
      description: "Fingertip pulse oximeter with OLED display. Measures blood oxygen saturation levels and pulse rate with high accuracy.",
      price: 1999.99,
      offerPrice: 1599.99,
      offerPercentage: 20,
      stock: 40,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format"],
    }
  ])

  const handleEdit = (product) => {
    setShowAddForm(true)
    setSelectedProduct(null)
    // You would typically populate the form with the product data here
  }

  const handleDelete = (productId) => {
    setProducts(products.filter(product => product.id !== productId))
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <FaPlus />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Product Image */}
            <div className="h-40 bg-gray-200 flex items-center justify-center relative">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x200?text=Product+Image'
                }}
              />
              {product.offerPercentage > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                  {product.offerPercentage}% OFF
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              
              {/* Price Section */}
              <div className="mb-3">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-lg font-bold text-blue-600">
                    ₹{product.offerPrice.toLocaleString('en-IN')}
                  </span>
                  {product.offerPercentage > 0 && (
                    <span className="text-gray-500 line-through text-xs">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Stock: {product.stock} units
                </div>
              </div>

              <button 
                onClick={() => setSelectedProduct(product)}
                className="w-full px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found matching your search.
        </div>
      )}

      {showAddForm && (
        <AddProductForm onClose={() => setShowAddForm(false)} />
      )}

      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default Ecommerce 