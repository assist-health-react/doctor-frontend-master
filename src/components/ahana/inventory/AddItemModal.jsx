import { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { createInventoryItem, updateInventoryItem } from '../../../services/inventoryService';

const AddItemModal = ({ isOpen, onClose, onSuccess, schoolId, editItem = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    item_name: '',
    current_stock: '',
    expiry_date: ''
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (editItem) {
      setFormData({
        item_name: editItem.item_name,
        current_stock: editItem.current_stock.toString(),
        expiry_date: new Date(editItem.expiry_date).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        item_name: '',
        current_stock: '',
        expiry_date: ''
      });
    }
    setError(null); // Clear any previous errors
  }, [editItem]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Clear error when user makes changes
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  // Set maximum date to 5 years from now
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 5);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!schoolId) {
      setError('School ID is required. Please select a school first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        ...formData,
        schoolId, // Ensure schoolId is included in the payload
        current_stock: parseInt(formData.current_stock, 10)
      };

      if (editItem) {
        await updateInventoryItem(editItem._id, payload);
      } else {
        await createInventoryItem(payload);
      }

      onSuccess();
      setFormData({
        item_name: '',
        current_stock: '',
        expiry_date: ''
      });
    } catch (error) {
      console.error('Error saving inventory item:', error);
      setError(error.response?.data?.message || 'Failed to save inventory item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {editItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Stock
            </label>
            <input
              type="number"
              name="current_stock"
              value={formData.current_stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              required
              min={today}
              max={maxDateString}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (editItem ? 'Updating...' : 'Adding...') : (editItem ? 'Update Item' : 'Add Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal; 