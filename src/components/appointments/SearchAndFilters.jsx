import { FaSearch, FaTimes } from 'react-icons/fa'

const SearchAndFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, onSearch }) => {
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm, statusFilter);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('', statusFilter); // Trigger search with empty term
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-4 min-w-0">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4 flex-shrink-0">
        <div className="relative flex w-full sm:w-auto sm:min-w-[200px] lg:w-64 xl:w-72">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                title="Clear search"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            // Trigger search when status changes
            onSearch && onSearch(searchTerm, e.target.value);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  )
}

export default SearchAndFilters 