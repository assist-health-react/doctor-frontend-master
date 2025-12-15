import { useState } from 'react'
import { FaPlus, FaUserMd, FaUserCircle, FaUsers } from 'react-icons/fa'
import DoctorFilter from './DoctorFilter'

const DoctorsList = ({ 
  doctors,
  isLoading,
  searchTerm,
  setSearchTerm,
  doctorId,
  setDoctorId,
  pincode,
  setPincode,
  showFilters,
  setShowFilters,
  selectedServiceType,
  setSelectedServiceType,
  selectedLanguages,
  setSelectedLanguages,
  selectedAreas,
  setSelectedAreas,
  onViewProfile,
  onViewMembers,
  onAddDoctor,
  pagination,
  currentPage,
  setCurrentPage,
  onFilterChange
}) => {
  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-end items-center">
          <button 
            onClick={onAddDoctor}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus />
            Add Doctor
          </button>
        </div>

        {/* Search Bar and Filter Icon */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, doctor Id, Medical Council Number, email or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors relative ${
              showFilters 
                ? 'bg-blue-50 text-blue-600' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            } ${
              (selectedServiceType !== 'all' || selectedLanguages.length > 0 || selectedAreas.length > 0)
                ? 'ring-2 ring-blue-500'
                : ''
            }`}
            title="Toggle Filters"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            {(selectedServiceType !== 'all' || selectedLanguages.length > 0 || selectedAreas.length > 0) && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {[
                  selectedServiceType !== 'all' ? 1 : 0,
                  selectedLanguages.length > 0 ? 1 : 0,
                  selectedAreas.length > 0 ? 1 : 0
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Doctor Filter Modal */}
      <DoctorFilter
        showFilters={showFilters}
        selectedServiceType={selectedServiceType}
        setSelectedServiceType={setSelectedServiceType}
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
        selectedAreas={selectedAreas}
        setSelectedAreas={setSelectedAreas}
        onClose={() => setShowFilters(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        doctorId={doctorId}
        setDoctorId={setDoctorId}
        pincode={pincode}
        setPincode={setPincode}
        onFilterChange={onFilterChange}
      />

      <div className="flex-1 overflow-auto px-2">
        {isLoading && (
          <div className="p-4 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
            Loading doctors...
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
          {doctors.map((doctor) => (
            <div 
              key={doctor.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="p-6 flex flex-col h-full">
                {/* Header Section */}
                <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="relative flex-shrink-0">
                    {doctor.image ? (
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="w-20 h-20 rounded-full object-cover shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                        <FaUserCircle className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{doctor.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">ID: {doctor.doctorId}</p>
                    <p className="text-gray-600 text-sm capitalize mb-2">{doctor.gender}</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUserMd className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm truncate">{doctor.education || 'MBBS'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm truncate">MCN: {doctor.medicalCouncilNumber || 'Not Available'}</span>
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {doctor.specializations?.map((spec, index) => (
                      <span 
                        key={index}
                        className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Service Types */}
                <div className="mb-6 flex-grow">
                  <div className="flex flex-wrap gap-2">
                    {doctor.serviceTypes?.map((type, index) => (
                      <span 
                        key={index}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
                          type === 'online' 
                            ? 'bg-green-50 text-green-600'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                  <button
                    onClick={() => onViewProfile(doctor)}
                    className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => onViewMembers(doctor)}
                    className="flex-1 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Members
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Controls */}
        {!isLoading && doctors.length > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage >= pagination.pages}
                className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                  currentPage >= pagination.pages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> doctors
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === 1 ? 'cursor-not-allowed' : 'hover:text-gray-700'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {[...Array(Math.min(5, pagination.pages))].map((_, idx) => {
                    const pageNumber = currentPage + idx - Math.min(2, currentPage - 1);
                    if (pageNumber > 0 && pageNumber <= pagination.pages) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNumber
                              ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= pagination.pages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage >= pagination.pages ? 'cursor-not-allowed' : 'hover:text-gray-700'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorsList; 