import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const InventoryFilters = ({ isOpen, onClose, onApply, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    stockLessThan: initialFilters.stockLessThan || '',
    stockMoreThan: initialFilters.stockMoreThan || '',
    expiryBefore: initialFilters.expiryBefore || '',
    expiryAfter: initialFilters.expiryAfter || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    // Only include filters that have values
    const appliedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    onApply(appliedFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      stockLessThan: '',
      stockMoreThan: '',
      expiryBefore: '',
      expiryAfter: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Filter Inventory</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock More Than
                </label>
                <input
                  type="number"
                  name="stockMoreThan"
                  value={filters.stockMoreThan}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min stock"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Less Than
                </label>
                <input
                  type="number"
                  name="stockLessThan"
                  value={filters.stockLessThan}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max stock"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry After
                </label>
                <input
                  type="date"
                  name="expiryAfter"
                  value={filters.expiryAfter}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Before
                </label>
                <input
                  type="date"
                  name="expiryBefore"
                  value={filters.expiryBefore}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters; 