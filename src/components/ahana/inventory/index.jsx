import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import AddItemModal from './AddItemModal';
import ViewMedicineDetails from './ViewMedicineDetails';
import InventoryFilters from './InventoryFilters';
import { useOutletContext } from 'react-router-dom';
import { getAllInventoryItems, getInventoryItemById, deleteInventoryItem } from '../../../services/inventoryService';

const Inventory = () => {
  const { school } = useOutletContext() || {};
  const schoolMongoId = school?._id;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (schoolMongoId) {
      fetchInventoryItems();
    } else {
      setError('No school selected. Please select a school to view inventory.');
      setItems([]);
    }
  }, [schoolMongoId, appliedSearch, filters]);

  const fetchInventoryItems = async () => {
    if (!schoolMongoId) {
      setError('School ID is required to fetch inventory items');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getAllInventoryItems({ 
        schoolId: schoolMongoId,
        search: appliedSearch || undefined,
        ...filters
      });
      if (response.data) {
        setItems(response.data);
      }
    } catch (err) {
      setError('Failed to fetch inventory items');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setAppliedSearch('');
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewItem = async (item) => {
    if (!schoolMongoId) {
      setError('School ID is required to view item details');
      return;
    }

    try {
      const response = await getInventoryItemById(item._id);
      if (response.data) {
        setSelectedItem(response.data);
        setShowDetails(true);
      }
    } catch (err) {
      console.error('Error fetching item details:', err);
      setError('Failed to fetch item details');
    }
  };

  const handleEditItem = (item) => {
    if (!schoolMongoId) {
      setError('School ID is required to edit items');
      return;
    }

    setShowDetails(false);
    setTimeout(() => {
      setSelectedItem(item);
      setShowAddModal(true);
    }, 100);
  };

  const handleDeleteItem = async (itemId) => {
    if (!schoolMongoId) {
      setError('School ID is required to delete items');
      return;
    }

    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await deleteInventoryItem(itemId);
        fetchInventoryItems();
        setShowDetails(false);
        setSelectedItem(null);
      } catch (err) {
        console.error('Error deleting item:', err);
        setError('Failed to delete item');
      }
    }
  };

  const handleAddSuccess = () => {
    fetchInventoryItems();
    setShowAddModal(false);
    setSelectedItem(null);
  };

  const handleAddClick = () => {
    if (!schoolMongoId) {
      setError('Please select a school before adding inventory items');
      return;
    }
    setSelectedItem(null);
    setShowAddModal(true);
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Inventory Management</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Search Bar and Filters */}
      <div className="mb-6">
        <div className="relative flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!schoolMongoId}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <IoMdClose className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={!schoolMongoId}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Search
          </button>
          <button
            onClick={() => setShowFilters(true)}
            disabled={!schoolMongoId}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaFilter className="w-4 h-4" />
            Filters
            {Object.keys(filters).length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Active Filters Display */}
      {Object.keys(filters).length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => (
            <div key={key} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center">
              {key}: {value}
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters[key];
                  setFilters(newFilters);
                }}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => setFilters({})}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Items List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{schoolMongoId ? 'No items found' : 'Please select a school to view inventory items'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewItem(item)}
              >
                <h3 className="text-lg font-semibold text-gray-800">{item.item_name}</h3>
                <p className="text-sm text-gray-600 mt-1">Quantity: {item.current_stock}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.current_stock > 10 ? 'bg-green-100 text-green-800' :
                    item.current_stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.current_stock > 10 ? 'In Stock' :
                     item.current_stock > 0 ? 'Low Stock' :
                     'Out of Stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {schoolMongoId && (
        <AddItemModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedItem(null);
          }}
          onSuccess={handleAddSuccess}
          schoolId={schoolMongoId}
          editItem={selectedItem}
        />
      )}

      {/* View Details Modal */}
      {schoolMongoId && (
        <ViewMedicineDetails
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      )}

      {/* Filters Modal */}
      <InventoryFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
    </div>
  );
};

export default Inventory;