import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { getSchoolById } from '../../services/schoolsService'
import { Modal } from './Modal'

const SchoolDetails = ({ schoolId, onClose }) => {
  const [school, setSchool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSchoolDetails()
  }, [schoolId])

  const fetchSchoolDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getSchoolById(schoolId)
      if (response.status === 'success') {
        setSchool(response.data)
      }
    } catch (err) {
      setError('Failed to fetch school details')
      console.error('Error fetching school details:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Modal title="School Details" onClose={onClose}>
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Modal>
    )
  }

  if (error || !school) {
    return (
      <Modal title="School Details" onClose={onClose}>
        <div className="flex justify-center items-center py-8">
          <div className="text-red-500">{error || 'Failed to load school details'}</div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title="School Details" onClose={onClose}>
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">{school.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{school.description}</p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Contact Number</h4>
            <p className="mt-1 text-sm text-gray-900">{school.contactNumber || 'N/A'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Email</h4>
            <p className="mt-1 text-sm text-gray-900">{school.email || 'N/A'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Website</h4>
            <p className="mt-1 text-sm text-gray-900">{school.website || 'N/A'}</p>
          </div>
        </div>

        {/* Address */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Address</h4>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-900">{school.address.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              {school.address.landmark && `${school.address.landmark}, `}
              {school.address.region && `${school.address.region}, `}
              {school.address.state}, {school.address.country}
            </p>
            <p className="text-sm text-gray-500 mt-1">PIN: {school.address.pinCode}</p>
            {school.address.location && (
              <p className="text-sm text-gray-500 mt-1">
                Location: {school.address.location.latitude}, {school.address.location.longitude}
              </p>
            )}
          </div>
        </div>

        {/* Principal Details */}
        {school.principal && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Principal Details</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-900">{school.principal.name}</p>
              <p className="text-sm text-gray-500 mt-1">{school.principal.email}</p>
              <p className="text-sm text-gray-500">{school.principal.phone}</p>
            </div>
          </div>
        )}

        {/* Grades and Sections */}
        {school.grades && school.grades.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Grades & Sections</h4>
            <div className="space-y-3">
              {school.grades.map((grade) => (
                <div key={grade._id} className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900">{grade.class}</h5>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {grade.section.map((section) => (
                      <div key={section._id} className="text-sm text-gray-500">
                        Section {section.name}: {section.studentsCount} students
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        {school.stats && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Statistics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Students</p>
                <p className="text-lg font-medium text-gray-900">{school.stats.studentCount}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Navigators</p>
                <p className="text-lg font-medium text-gray-900">{school.stats.navigatorCount}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Nurses</p>
                <p className="text-lg font-medium text-gray-900">{school.stats.nurseCount}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default SchoolDetails 