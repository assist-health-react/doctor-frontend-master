import { IoMdClose } from 'react-icons/io';

const ReportFilters = ({ isOpen, onClose, filters, onFilterChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Filter Assessments</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* School Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School
            </label>
            <select
              value={filters.school}
              onChange={(e) => onFilterChange('school', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Schools</option>
              <option value="School 1">School 1</option>
              <option value="School 2">School 2</option>
              <option value="School 3">School 3</option>
              <option value="School 4">School 4</option>
            </select>
          </div>

          {/* Class Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={filters.class}
              onChange={(e) => onFilterChange('class', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={`Grade ${i + 1}`}>
                  Grade {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Section Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              value={filters.section}
              onChange={(e) => onFilterChange('section', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => onFilterChange('fromDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => onFilterChange('toDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-4">
          <button
            onClick={() => {
              Object.keys(filters).forEach(key => onFilterChange(key, ''));
              onClose();
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters; 