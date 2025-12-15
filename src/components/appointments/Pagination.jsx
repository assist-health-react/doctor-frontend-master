const Pagination = ({ 
  currentPage, 
  totalPages, 
  handlePageChange, 
  startIndex, 
  itemsPerPage, 
  totalItems 
}) => {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
            ${currentPage === 1
              ? 'text-gray-400 bg-gray-100'
              : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
            }`}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
            ${currentPage === totalPages
              ? 'text-gray-400 bg-gray-100'
              : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
            }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2
                ${currentPage === 1
                  ? 'text-gray-400 bg-gray-100'
                  : 'text-gray-500 bg-white hover:bg-gray-50 border border-gray-300'
                }`}
            >
              <span className="sr-only">First</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1
              const isCurrentPage = pageNumber === currentPage
              const isWithinRange = Math.abs(pageNumber - currentPage) <= 2 || pageNumber === 1 || pageNumber === totalPages

              if (!isWithinRange) {
                if (pageNumber === 2 || pageNumber === totalPages - 1) {
                  return <span key={pageNumber} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
                }
                return null
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold
                    ${isCurrentPage
                      ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                    }`}
                >
                  {pageNumber}
                </button>
              )
            })}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2
                ${currentPage === totalPages
                  ? 'text-gray-400 bg-gray-100'
                  : 'text-gray-500 bg-white hover:bg-gray-50 border border-gray-300'
                }`}
            >
              <span className="sr-only">Last</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Pagination 