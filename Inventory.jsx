import { useState } from 'react'
import { FaSearch, FaPlus, FaFileDownload, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddItem, setShowAddItem] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [categories, setCategories] = useState([
    'Tablets',
    'Syrups',
    'Sprays',
    'Nasal Drops',
    'Inhaler',
    'Lotion',
    'Gels',
    'Oral Rehydration',
    'Balms',
    'Ointments',
    'Eye Drops',
  ])

  // Sample inventory data
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      category: 'Tablets',
      name: 'Paracetamol 500mg',
      currentStock: 500,
      expiryDate: '2024-12-31',
      dailyUsage: 50,
      total: 1000,
      required: 500,
      received: 0
    },
    {
      id: 2,
      category: 'Syrups',
      name: 'Amoxicillin 250mg/5ml',
      currentStock: 100,
      expiryDate: '2024-10-15',
      dailyUsage: 10,
      total: 200,
      required: 100,
      received: 0
    },
    {
      id: 3,
      category: 'Tablets',
      name: 'Ibuprofen 400mg',
      currentStock: 300,
      expiryDate: '2024-11-30',
      dailyUsage: 30,
      total: 600,
      required: 300,
      received: 0
    },
    {
      id: 4,
      category: 'Sprays',
      name: 'Nasal Decongestant',
      currentStock: 50,
      expiryDate: '2024-09-30',
      dailyUsage: 5,
      total: 100,
      required: 50,
      received: 0
    },
    {
      id: 5,
      category: 'Nasal Drops',
      name: 'Saline Solution',
      currentStock: 75,
      expiryDate: '2024-08-31',
      dailyUsage: 8,
      total: 150,
      required: 75,
      received: 0
    },
    {
      id: 6,
      category: 'Inhaler',
      name: 'Salbutamol',
      currentStock: 40,
      expiryDate: '2024-12-15',
      dailyUsage: 4,
      total: 80,
      required: 40,
      received: 0
    },
    {
      id: 7,
      category: 'Lotion',
      name: 'Calamine',
      currentStock: 60,
      expiryDate: '2024-10-31',
      dailyUsage: 6,
      total: 120,
      required: 60,
      received: 0
    },
    {
      id: 8,
      category: 'Gels',
      name: 'Diclofenac',
      currentStock: 80,
      expiryDate: '2024-11-15',
      dailyUsage: 8,
      total: 160,
      required: 80,
      received: 0
    },
    {
      id: 9,
      category: 'Oral Rehydration',
      name: 'ORS Powder',
      currentStock: 200,
      expiryDate: '2024-12-31',
      dailyUsage: 20,
      total: 400,
      required: 200,
      received: 0
    },
    {
      id: 10,
      category: 'Balms',
      name: 'Tiger Balm',
      currentStock: 45,
      expiryDate: '2024-09-30',
      dailyUsage: 5,
      total: 90,
      required: 45,
      received: 0
    }
  ])

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? '' : category)
  }

  const handleItemClick = (item) => {
    setSelectedItem(item)
  }

  const handleUsageUpdate = (newDailyUsage) => {
    // Update daily usage logic here
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    // Add item logic here
  }

  // Filter items based on search term
  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group items by category
  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = filteredItems.filter(item => item.category === category)
    return acc
  }, {})

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Inventory Management</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:max-w-2xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Add Item Button */}
          <button
            onClick={() => setShowAddItem(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 whitespace-nowrap"
          >
            <FaPlus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Inventory Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => {
          const items = groupedItems[category] || []
          const isExpanded = expandedCategory === category

          return (
            <div
              key={category}
              className={`bg-white rounded-xl shadow-sm transition-all duration-300 ${
                isExpanded ? 'col-span-full' : ''
              }`}
            >
              {/* Category Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleCategory(category)}
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{category}</h3>
                  <p className="text-sm text-gray-500">{items.length} items</p>
                </div>
                {isExpanded ? (
                  <FaChevronUp className="text-gray-400" />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </div>

              {/* Category Content */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Daily Usage</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.map(item => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleItemClick(item)}
                          >
                            <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{item.currentStock}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{item.expiryDate}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{item.dailyUsage}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{item.total}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{item.required}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{item.received}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Inventory 