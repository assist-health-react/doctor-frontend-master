import { IoMdClose } from 'react-icons/io';
import { FaPills, FaCalendarAlt, FaBoxOpen, FaChartLine, FaEdit, FaTrash } from 'react-icons/fa';

const ViewMedicineDetails = ({ isOpen, onClose, item, onEdit, onDelete }) => {
  if (!isOpen || !item) return null;

  // Format the dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Medicine Details</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="text-blue-500 hover:text-blue-700 p-1"
              title="Edit"
            >
              <FaEdit className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item._id);
              }}
              className="text-red-500 hover:text-red-700 p-1"
              title="Delete"
            >
              <FaTrash className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-gray-500 hover:text-gray-700 p-1"
              title="Close"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Info */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <FaPills className="text-blue-500 w-5 h-5" />
              <h3 className="text-lg font-medium text-gray-900">{item.item_name}</h3>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Current Stock */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaBoxOpen className="text-blue-500" />
                <h4 className="font-medium text-gray-900">Current Stock</h4>
              </div>
              <div className="ml-8">
                <p className="text-2xl font-semibold text-blue-600">
                  {item.current_stock}
                </p>
                <p className={`text-sm ${
                  item.current_stock === 0 ? 'text-red-500' :
                  item.current_stock < 10 ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {item.current_stock === 0 ? 'Out of Stock' :
                   item.current_stock < 10 ? 'Low Stock' :
                   'In Stock'}
                </p>
              </div>
            </div>

            {/* Expiry Information */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaCalendarAlt className="text-yellow-600" />
                <h4 className="font-medium text-gray-900">Expiry Date</h4>
              </div>
              <div className="ml-8">
                <p className="text-2xl font-semibold text-yellow-600">
                  {formatDate(item.expiry_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine className="text-gray-700" />
              <h4 className="font-medium text-gray-900">Last Updated</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Modified</span>
                <span className="text-sm font-medium">
                  {formatDate(item.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMedicineDetails; 