import { useState } from 'react'
import { FaUserCircle, FaUserMd } from 'react-icons/fa'
import DoctorDetail from './EmpDoctorDetail'

const DoctorList = ({ doctors, isLoading, error, onRefresh, searchTerm, activeFilters }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  // Filter doctors based on search term and active filters
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm ? 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.qualification.some(q => q.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doctor.workplaces.some(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : true

    const matchesFilters = !activeFilters || Object.entries(activeFilters).every(([key, value]) => {
      if (!value || value.length === 0) return true
      switch (key) {
        case 'speciality':
          return doctor.speciality.toLowerCase().includes(value.toLowerCase())
        case 'hospital':
          return doctor.workplaces.some(w => w.name.toLowerCase().includes(value.toLowerCase()))
        case 'fees':
          return doctor.workplaces.some(w => 
            parseInt(w.consultationFees) >= value.min && 
            parseInt(w.consultationFees) <= value.max
          )
        default:
          return true
      }
    })

    return matchesSearch && matchesFilters
  })

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading doctors...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div 
              key={doctor._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  {doctor.profilePic ? (
                    <img 
                      src={doctor.profilePic} 
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <FaUserCircle className="w-20 h-20 text-gray-400" />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">ID: {doctor.empanelledDoctorId}</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaUserMd className="text-blue-500" />
                    {doctor.workplaces[0]?.name || 'No workplace listed'}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {doctor.speciality}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {doctor.qualification.length > 0 ? (
                      doctor.qualification.map((qual, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full border border-purple-100"
                        >
                          {qual}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No qualifications listed</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex gap-3">
                  <span className="bg-blue-50 px-4 py-1.5 rounded-full text-blue-700 text-sm font-medium">
                    ₹{doctor.workplaces[0]?.consultationFees || 'N/A'}
                  </span>
                  <span className="bg-green-50 px-4 py-1.5 rounded-full text-green-700 text-sm font-medium">
                    {doctor.rating} ★
                  </span>
                </div>

                <button 
                  onClick={() => setSelectedDoctor(doctor)}
                  className="mt-4 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl transition-colors font-medium"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Detail Modal */}
      {selectedDoctor && (
        <DoctorDetail 
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onUpdate={onRefresh}
        />
      )}
    </div>
  )
}

export default DoctorList 