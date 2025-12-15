import React, { useState } from 'react'

const SchoolList = ({ 
  schools, 
  isLoading, 
  error,
  setSelectedSchoolId,
  pagination,
  onPageChange
}) => {
  // Track failed image loads
  const [failedImages, setFailedImages] = useState({})

  const handleImageError = (schoolId) => {
    setFailedImages(prev => ({
      ...prev,
      [schoolId]: true
    }))
  }

  const renderSchoolLogo = (school) => {
    // If image previously failed or no logo exists, show fallback
    if (failedImages[school._id] || !school.logo) {
      return (
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
          <span className="text-2xl font-semibold text-gray-400">
            {school.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )
    }

    // Attempt to load the image
    return (
      <img
        src={school.logo}
        alt={`${school.name} logo`}
        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
        onError={() => handleImageError(school._id)}
        loading="lazy"
      />
    )
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading schools...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((school) => (
              <div 
                key={school._id} 
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedSchoolId(school._id)}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {renderSchoolLogo(school)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-800 truncate">{school.name}</h3>
                      {school.schoolId && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          {school.schoolId}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {school.address?.description || 'No address'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {school.grades?.length || 0} grades
                      </span>
                      {school.website && (
                        <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                          Has Website
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 rounded ${
                    pagination.currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SchoolList 
